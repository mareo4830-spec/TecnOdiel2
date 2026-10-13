import { useMemo } from 'react';
import { createStore, useStore } from '../../lib/store';
import type { Commit, NewProjectInput, PartnerId, Project, ProjectClient, BusinessType, LayoutVariant, ProjectStatus } from '../../types';
import { logActivity } from '../activity/activityService';
import { sanitizeSlug } from '../../lib/cloudflare';

/*
 * Capa de datos de proyectos (local y sincronizada con leads/landing).
 * Hidrata automáticamente proyectos desde `ov.data.projects`, `tecnodiel_active_project`
 * y `tecnodiel_leads` para que cualquier cliente que envíe solicitud aparezca de inmediato
 * tanto en Proyectos como en Kanban con la información limpia y necesaria.
 */

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
  if (s.includes('bar') || s.includes('cafeter')) return 'cafeteria';
  if (s.includes('clinic') || s.includes('dental') || s.includes('salud') || s.includes('fisio') || s.includes('medic')) return 'clinica';
  if (s.includes('barber')) return 'barberia';
  if (s.includes('peluquer')) return 'peluqueria';
  if (s.includes('estet')) return 'estetica';
  if (s.includes('tienda') || s.includes('comercio') || s.includes('moda')) return 'tienda';
  return 'otro';
}

function mapStageToProjectStatus(stage?: string): ProjectStatus {
  const s = (stage || '').toLowerCase();
  if (s === 'cerrado' || s === 'hecho' || s === 'ganado') return 'hecho';
  if (s === 'interesado' || s === 'propuesta' || s === 'negociacion' || s === 'en_progreso') return 'en_progreso';
  return 'planeado';
}

function projectFromLead(lead: RawStoredLead): Project {
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
    layout: (lead.template_id?.includes('editorial') ? 'editorial' : lead.template_id?.includes('minimal') ? 'minimal' : lead.template_id?.includes('playful') ? 'playful' : 'classic') as LayoutVariant,
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
    saas: null,
    waitingClient: false,
    meeting: null,
    boardOrder: -1,
    startedAt: now,
    updatedAt: now,
  };
}

function loadInitialProjects(): Project[] {
  const map = new Map<string, Project>();

  // 1. Proyectos existentes en el almacenamiento de la oficina
  try {
    const raw = localStorage.getItem('ov.data.projects');
    if (raw) {
      const parsed = JSON.parse(raw) as Project[];
      if (Array.isArray(parsed)) {
        parsed.forEach((p) => map.set(p.id, p));
      }
    }
  } catch (_) {}

  // 2. Proyectos procedentes de solicitudes de la Landing (`tecnodiel_leads`)
  try {
    const rawLeads = localStorage.getItem('tecnodiel_leads');
    if (rawLeads) {
      const parsedLeads = JSON.parse(rawLeads) as RawStoredLead[];
      if (Array.isArray(parsedLeads)) {
        parsedLeads.forEach((l) => {
          const proj = projectFromLead(l);
          if (!map.has(proj.id)) {
            map.set(proj.id, proj);
          }
        });
      }
    }
  } catch (_) {}

  // 3. Proyecto activo del cliente en sesión (`tecnodiel_active_project`)
  try {
    const rawActive = localStorage.getItem('tecnodiel_active_project');
    if (rawActive) {
      const active = JSON.parse(rawActive) as RawStoredLead;
      if (active && (active.business_name || active.name)) {
        const proj = projectFromLead(active);
        if (!map.has(proj.id)) {
          map.set(proj.id, proj);
        }
      }
    }
  } catch (_) {}

  return Array.from(map.values());
}

const projectsStore = createStore<Project[]>(loadInitialProjects(), 'projects');
const commitsStore = createStore<Commit[]>([], 'commits');

export function createProject(
  input: NewProjectInput,
  createdBy: PartnerId,
  client: ProjectClient = { contactName: '', phone: '', email: '', city: 'Huelva' },
): Project {
  const now = new Date().toISOString();
  const base = slugify(`${input.name} ${input.businessName}`) || 'proyecto';
  const taken = new Set(projectsStore.get().map((p) => p.id));
  let id = base;
  for (let i = 2; taken.has(id); i++) id = `${base}-${i}`;

  const repoSlug = slugify(input.kind === 'saas' ? input.name : input.businessName) || id;
  const { saas = null, repo, vercelProject, status, meeting = null, ...rest } = input;
  const project: Project = {
    ...rest,
    id,
    description: '',
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
  logActivity({ type: 'project_created', partnerId: createdBy, projectId: id, action: 'creó el proyecto' });
  return project;
}

export function updateProject(id: string, patch: Partial<Omit<Project, 'id' | 'kind'>>): void {
  projectsStore.set((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p)));
}

/** Quita el proyecto y sus commits. El borrado completo (tenants, tareas…) está en deleteProject.ts. */
export function removeProject(id: string): void {
  projectsStore.set((prev) => prev.filter((p) => p.id !== id));
  commitsStore.set((prev) => prev.filter((c) => c.projectId !== id));
}

/** Cambios en bloque (reordenar el Kanban) sin tocar updatedAt de todos. */
export function patchProjects(patches: Map<string, Partial<Project>>): void {
  if (!patches.size) return;
  projectsStore.set((prev) => prev.map((p) => (patches.has(p.id) ? { ...p, ...patches.get(p.id) } : p)));
}

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
