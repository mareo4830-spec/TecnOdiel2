import { useMemo } from 'react';
import { db, must, persist } from '../../lib/db';
import { createStore, useStore } from '../../lib/store';
import type { ActivityEvent, ActivityType, PartnerId } from '../../types';

/*
 * Timeline "Actividad del equipo". Con Supabase: tabla `activity` (solo se añade, nunca se
 * reescribe) escuchada por Realtime. Sin Supabase: en memoria.
 */
const activityStore = createStore<ActivityEvent[]>([]);

interface ActivityRow {
  id: string;
  type: ActivityType;
  partner_id: PartnerId;
  project_id: string | null;
  action: string;
  detail: string | null;
  created_at: string;
}

export async function loadActivity(): Promise<void> {
  const rows = await must<ActivityRow[]>(db().from('activity').select('*').order('created_at', { ascending: false }).limit(100));
  activityStore.set(() =>
    rows.map((r) => ({
      id: r.id,
      type: r.type,
      partnerId: r.partner_id,
      projectId: r.project_id,
      action: r.action,
      detail: r.detail ?? undefined,
      createdAt: r.created_at,
    })),
  );
}

export function logActivity(event: Omit<ActivityEvent, 'id' | 'createdAt'>): void {
  const full: ActivityEvent = { ...event, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  activityStore.set((prev) => [full, ...prev].slice(0, 100));
  void persist('Registrar actividad', () =>
    must(
      db().from('activity').insert({
        id: full.id,
        type: full.type,
        partner_id: full.partnerId,
        project_id: full.projectId,
        action: full.action,
        detail: full.detail ?? null,
        created_at: full.createdAt,
      }),
    ),
  );
}

export function useActivity(limit = 20): ActivityEvent[] {
  const events = useStore(activityStore);
  return useMemo(() => events.slice(0, limit), [events, limit]);
}
