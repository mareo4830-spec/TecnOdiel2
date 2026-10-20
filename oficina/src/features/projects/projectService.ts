import { useMemo } from 'react';
import { iso, num, orNull } from '../../lib/rows';
import { useStore } from '../../lib/store';
import { createSyncedStore } from '../../lib/syncedStore';
import type { Commit, NewProjectInput, PartnerId, Project, ProjectClient, SaasProjectConfig } from '../../types';
import { logActivity } from '../activity/activityService';

/*
 * Proyectos: tabla `projects`; la configuración de un proyecto SaaS vive aparte en
 * `saas_project_config` (solo nombres de secretos, nunca claves) y aquí se une al proyecto para que
 * los componentes sigan viendo `project.saas`. Los commits los escribe la Edge Function
 * `github-webhook`: el navegador solo los lee.
 */
type ProjectRecord = Omit<Project, 'saas'>;
interface SaasConfigRecord {
  projectId: string;
  config: SaasProjectConfig;
}

const projectsStore = createSyncedStore<ProjectRecord>([], {
  table: 'projects',
  persistKey: 'projects',
  toRow: (p) => ({
    id: p.id,
    client_id: p.clientId,
    kind: p.kind,
    name: p.name,
    description: p.description,
    business_id: p.businessId,
    business_name: p.businessName,
    business_type: p.businessType,
    layout: p.layout,
    status: p.status,
    progress: p.progress,
    price: p.price,
    closed_by: p.closedBy,
    audit_by: p.auditBy,
    contributors: p.contributors,
    client_contact: p.client.contactName,
    client_phone: p.client.phone,
    client_email: p.client.email,
    client_city: p.client.city,
    domain: p.domain,
    repo_full_name: p.repo.fullName,
    repo_branch: p.repo.branch,
    vercel_project: p.vercelProject,
    preview_url: p.previewUrl,
    waiting_client: p.waitingClient,
    meeting: p.meeting,
    board_order: p.boardOrder,
    started_at: p.startedAt,
  }),
  fromRow: (r) => ({
    id: r.id,
    clientId: r.client_id ?? null,
    kind: r.kind,
    name: r.name,
    description: r.description ?? '',
    businessId: r.business_id,
    businessName: r.business_name,
    businessType: r.business_type,
    layout: r.layout,
    status: r.status,
    progress: r.progress,
    price: num(r.price),
    closedBy: r.closed_by,
    auditBy: r.audit_by,
    contributors: r.contributors ?? [],
    client: { contactName: r.client_contact, phone: r.client_phone, email: r.client_email, city: r.client_city },
    domain: r.domain,
    repo: { fullName: r.repo_full_name, branch: r.repo_branch },
    vercelProject: r.vercel_project,
    previewUrl: r.preview_url,
    waitingClient: r.waiting_client,
    meeting: r.meeting,
    boardOrder: r.board_order,
    startedAt: iso(r.started_at),
    updatedAt: iso(r.updated_at),
  }),
  sort: (a, b) => b.startedAt.localeCompare(a.startedAt),
  order: { column: 'started_at', ascending: false },
});

const saasConfigStore = createSyncedStore<SaasConfigRecord>([], {
  table: 'saas_project_config',
  conflict: 'project_id',
  persistKey: 'projects.saas',
  toRow: ({ projectId, config: c }) => ({
    project_id: projectId,
    supabase_url: orNull(c.supabaseUrl),
    supabase_ref: orNull(c.supabaseRef),
    // not null con valor por defecto: nunca se manda vacío.
    service_role_secret: c.serviceRoleSecret || 'SAAS_SERVICE_ROLE_KEY',
    vercel_team_slug: orNull(c.vercelTeamSlug),
    vercel_team_id: orNull(c.vercelTeamId),
    vercel_project_id: orNull(c.vercelProjectId),
    vercel_token_secret: c.vercelTokenSecret || 'VERCEL_TOKEN',
    preview_mode: c.previewMode,
    // Solo el campo del modo elegido: la BD valida el formato de los dos y no admite restos del otro.
    vercel_app_suffix: c.previewMode === 'vercel_app' ? orNull(c.vercelAppSuffix) : null,
    agency_preview_domain: c.previewMode === 'agency_domain' ? orNull(c.agencyPreviewDomain) : null,
    default_dns_provider: c.defaultDnsProvider,
  }),
  fromRow: (r) => ({
    projectId: r.project_id,
    config: {
      supabaseUrl: r.supabase_url ?? '',
      supabaseRef: r.supabase_ref ?? '',
      serviceRoleSecret: r.service_role_secret,
      vercelTeamSlug: r.vercel_team_slug ?? '',
      vercelTeamId: r.vercel_team_id ?? '',
      vercelProjectId: r.vercel_project_id ?? '',
      vercelTokenSecret: r.vercel_token_secret,
      previewMode: r.preview_mode,
      vercelAppSuffix: r.vercel_app_suffix ?? '',
      agencyPreviewDomain: r.agency_preview_domain ?? '',
      defaultDnsProvider: r.default_dns_provider,
    },
  }),
});

const commitsStore = createSyncedStore<Commit>([], {
  table: 'commits',
  conflict: 'sha',
  persistKey: 'commits',
  toRow: (c) => ({
    sha: c.sha,
    project_id: c.projectId,
    author: c.author,
    message: c.message,
    branch: c.branch,
    additions: c.additions,
    deletions: c.deletions,
    committed_at: c.committedAt,
  }),
  fromRow: (r) => ({
    sha: r.sha,
    projectId: r.project_id,
    author: r.author,
    message: r.message,
    branch: r.branch,
    additions: r.additions,
    deletions: r.deletions,
    committedAt: iso(r.committed_at),
  }),
  sort: (a, b) => b.committedAt.localeCompare(a.committedAt),
  order: { column: 'committed_at', ascending: false },
  limit: 1000,
  write: { insert: false, update: false, delete: false },
});

function withSaas(records: ProjectRecord[], configs: SaasConfigRecord[]): Project[] {
  const byProject = new Map(configs.map((c) => [c.projectId, c.config]));
  return records.map((r) => ({ ...r, saas: byProject.get(r.id) ?? null }));
}

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function createProject(
  input: NewProjectInput,
  createdBy: PartnerId,
  client: ProjectClient = { contactName: '', phone: '', email: '', city: 'Huelva' },
  clientId: string | null = null,
): Project {
  const now = new Date().toISOString();
  const base = slugify(`${input.name} ${input.businessName}`) || 'proyecto';
  const taken = new Set(projectsStore.get().map((p) => p.id));
  let id = base;
  for (let i = 2; taken.has(id); i++) id = `${base}-${i}`;

  const repoSlug = slugify(input.kind === 'saas' ? input.name : input.businessName) || id;
  const { saas = null, repo, vercelProject, status, meeting = null, ...rest } = input;
  const record: ProjectRecord = {
    ...rest,
    id,
    clientId,
    description: '',
    // Un estándar nace al cerrar la venta o antes (cita pendiente); el SaaS ya está en marcha.
    status: status ?? (input.kind === 'saas' ? 'en_progreso' : 'planeado'),
    progress: 0,
    contributors: [createdBy],
    client,
    repo: repo ?? { fullName: `agencia/${repoSlug}`, branch: 'main' },
    vercelProject: vercelProject || repoSlug,
    previewUrl: null,
    waitingClient: false,
    meeting,
    boardOrder: -1,
    startedAt: now,
    updatedAt: now,
  };
  projectsStore.set((prev) => [record, ...prev]);
  // La configuración depende de la fila del proyecto: va después (misma cola de escritura, mismo orden).
  if (input.kind === 'saas' && saas) saasConfigStore.set((prev) => [...prev, { projectId: id, config: saas }]);
  logActivity({ type: 'project_created', partnerId: createdBy, projectId: id, action: 'creó el proyecto' });
  return { ...record, saas: input.kind === 'saas' ? saas : null };
}

export function updateProject(id: string, patch: Partial<Omit<Project, 'id' | 'kind'>>): void {
  const { saas, ...rest } = patch;
  if (Object.keys(rest).length) {
    projectsStore.set((prev) => prev.map((p) => (p.id === id ? { ...p, ...rest, updatedAt: new Date().toISOString() } : p)));
  }
  if (saas !== undefined) {
    saasConfigStore.set((prev) => {
      const others = prev.filter((c) => c.projectId !== id);
      return saas ? [...others, { projectId: id, config: saas }] : others;
    });
  }
}

/** Quita el proyecto y sus commits. El borrado completo (tenants, tareas…) está en deleteProject.ts. */
export function removeProject(id: string): void {
  projectsStore.set((prev) => prev.filter((p) => p.id !== id));
  saasConfigStore.set((prev) => prev.filter((c) => c.projectId !== id));
  commitsStore.set((prev) => prev.filter((c) => c.projectId !== id));
}

/** Cambios en bloque (reordenar el Kanban) sin tocar updatedAt de todos. */
export function patchProjects(patches: Map<string, Partial<Omit<Project, 'saas'>>>): void {
  if (!patches.size) return;
  projectsStore.set((prev) => prev.map((p) => (patches.has(p.id) ? { ...p, ...patches.get(p.id) } : p)));
}

export function getProjects(): Project[] {
  return withSaas(projectsStore.get(), saasConfigStore.get());
}

/** Lectura puntual fuera de React (servicios que necesitan el nombre de un proyecto). */
export function getProject(id: string): Project | undefined {
  return getProjects().find((p) => p.id === id);
}

export function useProjects(): Project[] {
  const records = useStore(projectsStore);
  const configs = useStore(saasConfigStore);
  return useMemo(() => withSaas(records, configs), [records, configs]);
}

export function useProject(id: string | undefined): Project | undefined {
  const projects = useProjects();
  return useMemo(() => projects.find((p) => p.id === id), [projects, id]);
}

export function useAllCommits(): Commit[] {
  return useStore(commitsStore);
}

export function useProjectCommits(projectId: string): Commit[] {
  const commits = useStore(commitsStore);
  return useMemo(
    () =>
      commits
        .filter((c) => c.projectId === projectId)
        .sort((a, b) => b.committedAt.localeCompare(a.committedAt)),
    [commits, projectId],
  );
}
