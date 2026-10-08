import { useMemo } from 'react';
import { createStore, useStore } from '../../lib/store';
import type { ActivityEvent } from '../../types';

/*
 * Timeline "Actividad del equipo". En local, los eventos llegan de las acciones de la app
 * (check-in, check-out, alta de proyectos). Con Supabase será una tabla `activity`
 * alimentada por triggers y por la Edge Function de GitHub, escuchada por Realtime.
 */
const activityStore = createStore<ActivityEvent[]>([], 'activity');

export function logActivity(event: Omit<ActivityEvent, 'id' | 'createdAt'>): void {
  const full: ActivityEvent = { ...event, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  activityStore.set((prev) => [full, ...prev].slice(0, 100));
}

export function removeProjectActivity(projectId: string): void {
  activityStore.set((prev) => prev.filter((e) => e.projectId !== projectId));
}

export function useActivity(limit = 20): ActivityEvent[] {
  const events = useStore(activityStore);
  return useMemo(() => events.slice(0, limit), [events, limit]);
}
