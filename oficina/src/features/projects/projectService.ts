import { useMemo } from 'react';
import { iso, num, orNull } from '../../lib/rows';
import { useStore } from '../../lib/store';
import { isSupabaseConfigured } from '../../lib/supabase';
import { createSyncedStore, whenSyncReady } from '../../lib/syncedStore';
import type { BusinessType, Commit, LayoutVariant, NewProjectInput, PartnerId, Project, ProjectClient, ProjectStatus, SaasProjectConfig } from '../../types';
import { logActivity } from '../activity/activityService';
import { sanitizeSlug } from '../../lib/cloudflare';

/*
 * Proyectos: tabla `projects`; la configuración de un proyecto SaaS vive aparte en
 * `saas_project_config` (solo nombres de secretos, nunca claves) y aquí se une al proyecto para que
 * los componentes sigan viendo `project.saas`. Los commits los escribe la Edge Function
 * `github-webhook`: el navegador solo los lee.
 *
 * Las solicitudes que la landing guarda en este navegador (`tecnodiel_leads` y
 * `tecnodiel_active_project`) se convierten en proyectos si aún no existen, para que aparezcan
 * en Proyectos y en el Kanban (ver importLandingProjects).
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

interface RawStoredLead {
  id?: string;
  name?: string;
  business_name?: string;
  sector?: string;
  city?: string;
  email?: string;
  phone?: string;
  services?: string[];
  message?: string;
  source?: string;
  template_id?: string;
  template_name?: string;
  slug?: string;
  site_deployed?: boolean;
  live_url?: string;
  stage?: string;
  created_at?: string;
  budget?: number;
  estimated_value?: number;
  owner?: string;
  intake?: Record<string, unknown>;
}

function mapSectorToBusinessType(sector?: string): BusinessType {
  const s = (sector || '').toLowerCase();
  if (s.includes('restauran') || s.includes('comida') || s.includes('hosteler')) return 'restaurante';
  // «barbería» contiene «bar»: va antes que cafetería.
  if (s.includes('barber')) return 'barberia';
  if (s.includes('bar') || s.includes('cafeter')) return 'cafeteria';
  if (s.includes('clinic') || s.includes('dental') || s.includes('salud') || s.includes('fisio') || s.includes('medic')) return 'clinica';
  if (s.includes('peluquer')) return 'peluqueria';
  if (s.includes('estet')) return 'estetica';
  if (s.includes('tienda') || s.includes('comercio') || s.includes('moda')) return 'tienda';
  return 'otro';
}

/** Grupo de portadas del SaaS que encaja con cada tipo de negocio (projects.layout). */
const LAYOUT_FOR_BUSINESS: Record<BusinessType, LayoutVariant> = {
  barberia: 'barber',
  peluqueria: 'women',
  salon: 'beauty',
  estetica: 'beauty',
  clinica: 'beauty',
  restaurante: 'unisex',
  cafeteria: 'unisex',
  tienda: 'unisex',
  otro: 'unisex',
};

function mapStageToProjectStatus(stage?: string): ProjectStatus {
  const s = (stage || '').toLowerCase();
  if (s === 'cerrado' || s === 'hecho' || s === 'ganado') return 'hecho';
  if (s === 'interesado' || s === 'propuesta' || s === 'negociacion' || s === 'en_progreso') return 'en_progreso';
  return 'planeado';
}

function projectFromLead(lead: RawStoredLead): ProjectRecord {
  const businessName = lead.business_name || lead.name || 'Negocio';
  const cleanSlug = lead.slug || sanitizeSlug(businessName);
  const id = slugify(businessName) || `proyecto-${Date.now()}`;
  const now = lead.created_at || new Date().toISOString();
  const cfUrl = lead.live_url || (lead.site_deployed ? `https://${cleanSlug}.pages.dev` : `https://${cleanSlug}.pages.dev`);
  const status = mapStageToProjectStatus(lead.stage);

  return {
    id,
    kind: 'standard',
    name: `Web ${businessName}`,
    description: lead.message || `Proyecto web para ${businessName}. Plantilla: ${lead.template_name || lead.template_id || 'Personalizada'}.`,
    businessId: null,
    businessName,
    businessType: mapSectorToBusinessType(lead.sector),
    layout: LAYOUT_FOR_BUSINESS[mapSectorToBusinessType(lead.sector)],
    status,
    progress: status === 'hecho' ? 100 : status === 'en_progreso' ? 50 : 15,
    price: Number(lead.budget || lead.estimated_value) || 350,
    closedBy: 'javier',
    auditBy: 'mario',
    contributors: ['mario', 'javier'],
    client: {
      contactName: lead.name || businessName,
      phone: lead.phone || '',
      email: lead.email || '',
      city: lead.city || 'Huelva',
    },
    domain: null,
    repo: { fullName: `agencia/${cleanSlug}`, branch: 'main' },
    vercelProject: cleanSlug,
    previewUrl: cfUrl,
    clientId: null,
    waitingClient: false,
    meeting: null,
    boardOrder: -1,
    startedAt: now,
    updatedAt: now,
  };
}

/** Solicitudes de la landing guardadas en este navegador, como filas de proyecto. */
function landingProjects(): ProjectRecord[] {
  const out: ProjectRecord[] = [];
  const read = (key: string): RawStoredLead[] => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as RawStoredLead | RawStoredLead[];
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [];
    }
  };
  for (const lead of [...read('tecnodiel_leads'), ...read('tecnodiel_active_project')]) {
    if (lead && (lead.business_name || lead.name)) out.push(projectFromLead(lead));
  }
  return out;
}

/** Añade como proyecto cada solicitud de la landing que todavía no lo sea (por id o por negocio). */
function importLandingProjects(): void {
  const incoming = landingProjects();
  if (!incoming.length) return;
  projectsStore.set((prev) => {
    const ids = new Set(prev.map((p) => p.id));
    const names = new Set(prev.map((p) => p.businessName.trim().toLowerCase()));
    const fresh: ProjectRecord[] = [];
    for (const p of incoming) {
      const name = p.businessName.trim().toLowerCase();
      if (ids.has(p.id) || names.has(name)) continue;
      ids.add(p.id);
      names.add(name);
      fresh.push(p);
    }
    return fresh.length ? [...fresh, ...prev] : prev;
  });
}

// En la demo se importa al cargar; con Supabase, cuando ya se han leído los proyectos del equipo.
if (typeof window !== 'undefined') {
  if (isSupabaseConfigured) whenSyncReady(importLandingProjects);
  else importLandingProjects();
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
