import { useMemo } from 'react';
import { createStore, useStore } from '../../lib/store';
import type { Commit, NewProjectInput, PartnerId, Project, ProjectClient } from '../../types';
import { logActivity } from '../activity/activityService';

/*
 * Capa de datos de proyectos (local). Al conectar Supabase:
 *  - projectsStore se rellena con `select` sobre `projects` + canal Realtime.
 *  - commitsStore con la tabla `commits` que escribe la Edge Function `github-webhook`.
 * Los hooks de abajo no cambian.
 */
const projectsStore = createStore<Project[]>([], 'projects');
const commitsStore = createStore<Commit[]>([], 'commits');

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
