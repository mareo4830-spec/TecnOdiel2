import { useMemo } from 'react';
import { db, must, num, persist } from '../../lib/db';
import { createStore, useStore } from '../../lib/store';
import type { Commit, NewProjectInput, PartnerId, Project, ProjectClient, SaasProjectConfig } from '../../types';
import { logActivity } from '../activity/activityService';
import { DEFAULT_SAAS_CONFIG } from './saasConfig';

/*
 * Proyectos y commits.
 *  - Con Supabase: tablas `projects` + `saas_project_config` (conexiones de un proyecto SaaS) y
 *    `commits` (la escribe la Edge Function de GitHub). DataSync recarga con Realtime.
 *  - Sin Supabase (demo): en memoria, empieza vacío.
 */
const projectsStore = createStore<Project[]>([]);
const commitsStore = createStore<Commit[]>([]);

// ---------------------------------------------------------------- filas ↔ tipos

interface ProjectRow {
  id: string;
  kind: Project['kind'];
  name: string;
  description: string;
  business_id: string | null;
  business_name: string;
  business_type: Project['businessType'];
  layout: Project['layout'];
  status: Project['status'];
  progress: number;
  price: number | string;
  closed_by: PartnerId;
  audit_by: PartnerId;
  contributors: PartnerId[];
  client_contact: string;
  client_phone: string;
  client_email: string;
  client_city: string;
  domain: string | null;
  repo_full_name: string;
  repo_branch: string;
  vercel_project: string;
  preview_url: string | null;
  waiting_client: boolean;
  meeting: Project['meeting'];
  board_order: number;
  started_at: string;
  updated_at: string;
}

interface SaasConfigRow {
  project_id: string;
  supabase_url: string | null;
  supabase_ref: string | null;
  service_role_secret: string;
  vercel_team_slug: string | null;
  vercel_team_id: string | null;
  vercel_project_id: string | null;
  vercel_token_secret: string;
  preview_mode: SaasProjectConfig['previewMode'];
  vercel_app_suffix: string | null;
  agency_preview_domain: string | null;
  default_dns_provider: SaasProjectConfig['defaultDnsProvider'];
}

function configFromRow(r: SaasConfigRow | undefined): SaasProjectConfig {
  if (!r) return { ...DEFAULT_SAAS_CONFIG };
  return {
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
  };
}

const orNull = (v: string) => (v.trim() ? v.trim() : null);

function configToRow(projectId: string, c: SaasProjectConfig): SaasConfigRow {
  return {
    project_id: projectId,
    supabase_url: orNull(c.supabaseUrl),
    supabase_ref: orNull(c.supabaseRef),
    service_role_secret: c.serviceRoleSecret,
    vercel_team_slug: orNull(c.vercelTeamSlug),
    vercel_team_id: orNull(c.vercelTeamId),
    vercel_project_id: orNull(c.vercelProjectId),
    vercel_token_secret: c.vercelTokenSecret,
    preview_mode: c.previewMode,
    vercel_app_suffix: orNull(c.vercelAppSuffix),
    agency_preview_domain: orNull(c.agencyPreviewDomain),
    default_dns_provider: c.defaultDnsProvider,
  };
}

function fromRow(r: ProjectRow, config: SaasConfigRow | undefined): Project {
  return {
    id: r.id,
    kind: r.kind,
    name: r.name,
    description: r.description,
    businessId: r.business_id,
    businessName: r.business_name,
    businessType: r.business_type,
    layout: r.layout,
    status: r.status,
    progress: r.progress,
    price: num(r.price),
    closedBy: r.closed_by,
    auditBy: r.audit_by,
    contributors: r.contributors,
    client: { contactName: r.client_contact, phone: r.client_phone, email: r.client_email, city: r.client_city },
    domain: r.domain,
    repo: { fullName: r.repo_full_name, branch: r.repo_branch },
    vercelProject: r.vercel_project,
    previewUrl: r.preview_url,
    saas: r.kind === 'saas' ? configFromRow(config) : null,
    waitingClient: r.waiting_client,
    meeting: r.meeting,
    boardOrder: r.board_order,
    startedAt: r.started_at,
    updatedAt: r.updated_at,
  };
}

/** Columnas de `projects` que cambian con un patch de la app. */
function toRow(p: Partial<Project>): Partial<ProjectRow> {
  const row: Partial<ProjectRow> = {};
  const map: [keyof Project, keyof ProjectRow][] = [
    ['name', 'name'],
    ['description', 'description'],
    ['businessId', 'business_id'],
    ['businessName', 'business_name'],
    ['businessType', 'business_type'],
    ['layout', 'layout'],
    ['status', 'status'],
    ['progress', 'progress'],
    ['price', 'price'],
    ['closedBy', 'closed_by'],
    ['auditBy', 'audit_by'],
    ['contributors', 'contributors'],
    ['domain', 'domain'],
    ['vercelProject', 'vercel_project'],
    ['previewUrl', 'preview_url'],
    ['waitingClient', 'waiting_client'],
    ['meeting', 'meeting'],
    ['boardOrder', 'board_order'],
  ];
  for (const [from, to] of map) if (from in p) (row as Record<string, unknown>)[to] = p[from];
  if (p.client) {
    row.client_contact = p.client.contactName;
    row.client_phone = p.client.phone;
    row.client_email = p.client.email;
    row.client_city = p.client.city;
  }
  if (p.repo) {
    row.repo_full_name = p.repo.fullName;
    row.repo_branch = p.repo.branch;
  }
  return row;
}

interface CommitRow {
  sha: string;
  project_id: string;
  author: PartnerId;
  message: string;
  branch: string;
  additions: number;
  deletions: number;
  committed_at: string;
}

export async function loadProjects(): Promise<void> {
  const [rows, configs] = await Promise.all([
    must<ProjectRow[]>(db().from('projects').select('*').order('updated_at', { ascending: false })),
    must<SaasConfigRow[]>(db().from('saas_project_config').select('*')),
  ]);
  const byProject = new Map(configs.map((c) => [c.project_id, c]));
  projectsStore.set(() => rows.map((r) => fromRow(r, byProject.get(r.id))));
}

export async function loadCommits(): Promise<void> {
  const rows = await must<CommitRow[]>(db().from('commits').select('*').order('committed_at', { ascending: false }).limit(2000));
  commitsStore.set(() =>
    rows.map((r) => ({
      sha: r.sha,
      projectId: r.project_id,
      author: r.author,
      message: r.message,
      branch: r.branch,
      additions: r.additions,
      deletions: r.deletions,
      committedAt: r.committed_at,
    })),
  );
}

// ---------------------------------------------------------------- escritura

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
): Project {
  const now = new Date().toISOString();
  // En un SaaS nombre y negocio coinciden: el id sale solo del nombre.
  const base = slugify(input.kind === 'saas' ? input.name : `${input.name} ${input.businessName}`) || 'proyecto';
  const taken = new Set(projectsStore.get().map((p) => p.id));
  let id = base;
  for (let i = 2; taken.has(id); i++) id = `${base}-${i}`;

  const repoSlug = slugify(input.kind === 'saas' ? input.name : input.businessName) || id;
  const { saas = null, repo, vercelProject, status, meeting = null, ...rest } = input;
  const project: Project = {
    ...rest,
    id,
    description: '',
    // Un estándar nace al cerrar la venta o antes (cita pendiente); el SaaS ya está en marcha.
    status: status ?? (input.kind === 'saas' ? 'en_progreso' : 'planeado'),
    progress: 0,
    contributors: [createdBy],
    client,
    repo: repo ?? { fullName: `agencia/${repoSlug}`, branch: 'main' },
    vercelProject: vercelProject || repoSlug,
    previewUrl: null,
    saas: input.kind === 'saas' ? saas : null,
    waitingClient: false,
    meeting,
    boardOrder: -1,
    startedAt: now,
    updatedAt: now,
  };
  projectsStore.set((prev) => [project, ...prev]);

  void persist('Crear proyecto', async () => {
    await must(db().from('projects').insert({ ...toRow(project), id, kind: project.kind, started_at: now }));
    if (project.kind === 'saas' && project.saas) {
      await must(db().from('saas_project_config').insert(configToRow(id, project.saas)));
    }
  });
  logActivity({ type: 'project_created', partnerId: createdBy, projectId: id, action: 'creó el proyecto' });
  return project;
}

export function updateProject(id: string, patch: Partial<Omit<Project, 'id' | 'kind'>>): void {
  projectsStore.set((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p)));
  void persist('Guardar proyecto', async () => {
    const row = toRow(patch);
    if (Object.keys(row).length) await must(db().from('projects').update(row).eq('id', id));
    if (patch.saas) await must(db().from('saas_project_config').upsert(configToRow(id, patch.saas)));
  });
}

/** Cambios en bloque (reordenar el Kanban) sin tocar updatedAt de todos. */
export function patchProjects(patches: Map<string, Partial<Project>>): void {
  if (!patches.size) return;
  projectsStore.set((prev) => prev.map((p) => (patches.has(p.id) ? { ...p, ...patches.get(p.id) } : p)));
  void persist('Reordenar proyectos', () =>
    Promise.all([...patches].map(([id, patch]) => must(db().from('projects').update(toRow(patch)).eq('id', id)))),
  );
}

/**
 * Elimina el proyecto. En la BD se borran en cascada sus commits, tareas, tenants (con su
 * facturación, pagos, integraciones y log) y su configuración SaaS; las horas, el fondo, los
 * leads y los chats que lo referencian se conservan sin proyecto.
 */
export async function deleteProject(id: string): Promise<boolean> {
  const ok = await persist('Eliminar proyecto', () => must(db().from('projects').delete().eq('id', id)));
  if (ok) {
    projectsStore.set((prev) => prev.filter((p) => p.id !== id));
    commitsStore.set((prev) => prev.filter((c) => c.projectId !== id));
  }
  return ok;
}

// ---------------------------------------------------------------- lectura

export function getProjects(): Project[] {
  return projectsStore.get();
}

/** Lectura puntual fuera de React (servicios que necesitan el nombre de un proyecto). */
export function getProject(id: string): Project | undefined {
  return projectsStore.get().find((p) => p.id === id);
}

export function useProjects(): Project[] {
  return useStore(projectsStore);
}

export function useProject(id: string | undefined): Project | undefined {
  return useStore(projectsStore, (list) => list.find((p) => p.id === id));
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

