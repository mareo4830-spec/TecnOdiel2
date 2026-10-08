import { Store, type LucideIcon } from 'lucide-react';
import { useMemo } from 'react';
import type { PartnerId, PlannedMeeting, Project, Tenant, WorkStage } from '../../types';
import { logActivity } from '../activity/activityService';
import { BUSINESS_TYPE_META, STATUS_META } from '../projects/projectMeta';
import { getProjects, patchProjects, updateProject, useProjects } from '../projects/projectService';
import { TENANT_TYPE_META } from '../tenants/tenantMeta';
import { getTenants, patchTenants, updateTenant, useAllTenants } from '../tenants/tenantService';

/*
 * Kanban de trabajos: cada tarjeta es un cliente, sea un proyecto estándar o un tenant de un
 * proyecto SaaS. Los proyectos SaaS (el producto) no salen: salen sus tenants.
 * No hay tabla propia: la etapa vive en projects.status y tenants.stage, y el orden en board_order.
 */

export type WorkKind = 'project' | 'tenant';

export interface WorkItem {
  /** `p:<id>` o `t:<id>`: único entre proyectos y tenants. */
  key: string;
  kind: WorkKind;
  id: string;
  /** Proyecto al que pertenece (el propio, o el SaaS del tenant). */
  projectId: string;
  title: string;
  subtitle: string;
  typeLabel: string;
  icon: LucideIcon;
  tint: string;
  stage: WorkStage;
  waitingClient: boolean;
  meeting: PlannedMeeting | null;
  boardOrder: number;
  people: PartnerId[];
  /** Precio cerrado (proyectos); los tenants lo tienen en su facturación. */
  price: number | null;
  url: string | null;
  to: string;
  updatedAt: string;
}

function fromProject(p: Project): WorkItem {
  const type = BUSINESS_TYPE_META[p.businessType];
  return {
    key: `p:${p.id}`,
    kind: 'project',
    id: p.id,
    projectId: p.id,
    title: p.businessName,
    subtitle: p.name,
    typeLabel: type.label,
    icon: type.icon,
    tint: type.tint,
    stage: p.status,
    waitingClient: p.waitingClient,
    meeting: p.meeting,
    boardOrder: p.boardOrder,
    people: p.contributors,
    price: p.price || null,
    url: p.domain ? `https://${p.domain}` : p.previewUrl,
    to: `/proyectos/${p.id}`,
    updatedAt: p.updatedAt,
  };
}

function fromTenant(t: Tenant, saas: Project): WorkItem {
  const type = t.businessType ? TENANT_TYPE_META[t.businessType] : null;
  return {
    key: `t:${t.id}`,
    kind: 'tenant',
    id: t.id,
    projectId: saas.id,
    title: t.name,
    subtitle: saas.name,
    typeLabel: type?.label ?? 'Sin tipo',
    icon: type?.icon ?? Store,
    tint: type?.tint ?? 'bg-gray-800 text-gray-400',
    stage: t.stage,
    waitingClient: t.waitingClient,
    meeting: t.meeting,
    boardOrder: t.boardOrder,
    people: t.createdBy ? [t.createdBy] : [],
    price: null,
    url: t.status === 'live' && t.domain ? `https://${t.domain}` : t.previewHost ? `https://${t.previewHost}` : null,
    to: `/proyectos/${saas.id}/tenants/${t.id}`,
    updatedAt: t.updatedAt,
  };
}

function buildItems(projects: Project[], tenants: Tenant[]): WorkItem[] {
  const saas = new Map(projects.filter((p) => p.kind === 'saas').map((p) => [p.id, p]));
  return [
    ...projects.filter((p) => p.kind === 'standard').map(fromProject),
    ...tenants.flatMap((t) => {
      const parent = saas.get(t.projectId);
      return parent ? [fromTenant(t, parent)] : [];
    }),
  ];
}

export function useWorkItems(): WorkItem[] {
  const projects = useProjects();
  const tenants = useAllTenants();
  return useMemo(() => buildItems(projects, tenants), [projects, tenants]);
}

/** Tarjetas de una columna en su orden: primero board_order, luego lo más reciente. */
export function sortStage(items: WorkItem[], stage: WorkStage): WorkItem[] {
  return items.filter((i) => i.stage === stage).sort((a, b) => a.boardOrder - b.boardOrder || b.updatedAt.localeCompare(a.updatedAt));
}

const parseKey = (key: string) => ({ kind: (key.startsWith('p:') ? 'project' : 'tenant') as WorkKind, id: key.slice(2) });

/**
 * Mueve un trabajo a `stage`, justo antes de `beforeKey` (o al final). Igual que el Kanban de
 * tareas: se referencia por id para que funcione con filtros activos.
 */
export function moveWork(key: string, stage: WorkStage, beforeKey: string | null, by: PartnerId): void {
  const all = buildItems(getProjects(), getTenants());
  const item = all.find((i) => i.key === key);
  if (!item || key === beforeKey) return;
  const stageChanged = item.stage !== stage;

  const column = sortStage(all, stage).filter((i) => i.key !== key);
  const at = beforeKey ? column.findIndex((i) => i.key === beforeKey) : -1;
  column.splice(at === -1 ? column.length : at, 0, item);

  const projectPatches = new Map<string, Partial<Project>>();
  const tenantPatches = new Map<string, Partial<Tenant>>();
  column.forEach((i, order) => {
    if (i.boardOrder === order && i.key !== key) return;
    const { kind, id } = parseKey(i.key);
    if (kind === 'project') projectPatches.set(id, { boardOrder: order });
    else tenantPatches.set(id, { boardOrder: order });
  });
  patchProjects(projectPatches);
  patchTenants(tenantPatches);

  if (stageChanged) {
    // Fuera de En progreso ya no se espera al cliente.
    const common = { waitingClient: stage === 'en_progreso' ? item.waitingClient : false };
    if (item.kind === 'project') updateProject(item.id, { ...common, status: stage, ...(stage === 'hecho' ? { progress: 100 } : {}) });
    else updateTenant(item.id, { ...common, stage });
    logActivity({ type: 'status', partnerId: by, projectId: item.projectId, action: `movió «${item.title}» a ${STATUS_META[stage].label} en` });
  }
}

export function setWaitingClient(key: string, waiting: boolean, by: PartnerId): void {
  const { kind, id } = parseKey(key);
  if (kind === 'project') updateProject(id, { waitingClient: waiting });
  else updateTenant(id, { waitingClient: waiting });
  const item = buildItems(getProjects(), getTenants()).find((i) => i.key === key);
  if (item && waiting) {
    logActivity({ type: 'status', partnerId: by, projectId: item.projectId, action: `marcó «${item.title}» esperando datos del cliente en` });
  }
}

export function setMeeting(key: string, meeting: PlannedMeeting | null): void {
  const { kind, id } = parseKey(key);
  if (kind === 'project') updateProject(id, { meeting });
  else updateTenant(id, { meeting });
}
