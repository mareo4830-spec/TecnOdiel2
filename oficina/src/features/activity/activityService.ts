import { useMemo } from 'react';
import { iso } from '../../lib/rows';
import { useStore } from '../../lib/store';
import { createSyncedStore } from '../../lib/syncedStore';
import type { ActivityEvent } from '../../types';

/*
 * Timeline "Actividad del equipo": tabla `activity`. Solo se añade (la BD no deja editar ni borrar),
 * y también la alimentan las Edge Functions (pushes de GitHub, provisionado).
 */
const activityStore = createSyncedStore<ActivityEvent>([], {
  table: 'activity',
  persistKey: 'activity',
  toRow: (e) => ({
    id: e.id,
    type: e.type,
    partner_id: e.partnerId,
    project_id: e.projectId,
    action: e.action,
    detail: e.detail ?? null,
    created_at: e.createdAt,
  }),
  fromRow: (r) => ({
    id: r.id,
    type: r.type,
    partnerId: r.partner_id,
    projectId: r.project_id,
    action: r.action,
    detail: r.detail ?? undefined,
    createdAt: iso(r.created_at),
  }),
  sort: (a, b) => b.createdAt.localeCompare(a.createdAt),
  order: { column: 'created_at', ascending: false },
  limit: 100,
  write: { update: false, delete: false },
});

export function logActivity(event: Omit<ActivityEvent, 'id' | 'createdAt'>): void {
  const full: ActivityEvent = { ...event, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  activityStore.set((prev) => [full, ...prev].slice(0, 100));
}

/** Al borrar un proyecto la BD deja sus eventos sin proyecto (on delete set null): no se borra el historial. */
export function removeProjectActivity(projectId: string): void {
  activityStore.set((prev) => prev.map((e) => (e.projectId === projectId ? { ...e, projectId: null } : e)));
}

export function useActivity(limit = 20): ActivityEvent[] {
  const events = useStore(activityStore);
  return useMemo(() => events.slice(0, limit), [events, limit]);
}
