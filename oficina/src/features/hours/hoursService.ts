import { useMemo } from 'react';
import { iso, num } from '../../lib/rows';
import { useStore } from '../../lib/store';
import { createSyncedStore } from '../../lib/syncedStore';
import type { CheckinSession, FundMovement, FundMovementType, PartnerId, WorkSession } from '../../types';
import { logActivity } from '../activity/activityService';
import { useAllCommits } from '../projects/projectService';
import { evaluateSessions, formatHours, sessionHours, type SessionEvaluation } from './hoursMath';
import { FUND_MIN_RESERVE } from './repartoConfig';

/*
 * Horas y fondo común.
 *  - `work_sessions`: el check-in abre una fila (ended_at nulo) y el check-out la cierra. Aquí solo
 *    entran las cerradas y con proyecto: las demás no cuentan para el reparto.
 *  - `fund_movements`: aportaciones y gastos. Solo se añaden (la BD no deja editar ni borrar).
 */
const sessionsStore = createSyncedStore<WorkSession>([], {
  table: 'work_sessions',
  persistKey: 'sessions',
  toRow: (s) => ({
    id: s.id,
    partner_id: s.partnerId,
    project_id: s.projectId,
    started_at: s.startedAt,
    ended_at: s.endedAt,
    approved_by: s.approvedBy,
  }),
  fromRow: (r) => ({
    id: r.id,
    partnerId: r.partner_id,
    projectId: r.project_id,
    startedAt: iso(r.started_at),
    endedAt: iso(r.ended_at),
    approvedBy: r.approved_by,
  }),
  readFilter: (q) => q.not('ended_at', 'is', null).not('project_id', 'is', null),
  accept: (r) => r.ended_at != null && r.project_id != null,
  sort: (a, b) => b.startedAt.localeCompare(a.startedAt),
  order: { column: 'started_at', ascending: false },
  limit: 1000,
});
const fundStore = createSyncedStore<FundMovement>([], {
  table: 'fund_movements',
  persistKey: 'fund',
  toRow: (m) => ({
    id: m.id,
    type: m.type,
    concept: m.concept,
    amount: m.amount,
    project_id: m.projectId,
    created_by: m.createdBy,
    created_at: m.createdAt,
  }),
  fromRow: (r) => ({
    id: r.id,
    type: r.type,
    concept: r.concept,
    amount: num(r.amount),
    projectId: r.project_id,
    createdBy: r.created_by,
    createdAt: iso(r.created_at),
  }),
  sort: (a, b) => b.createdAt.localeCompare(a.createdAt),
  order: { column: 'created_at', ascending: false },
  write: { update: false, delete: false },
});

/** Al borrar un proyecto: fuera sus sesiones; los movimientos del fondo se quedan sin proyecto. */
export function removeProjectHours(projectId: string): void {
  sessionsStore.set((prev) => prev.filter((s) => s.projectId !== projectId));
  fundStore.set((prev) => prev.map((m) => (m.projectId === projectId ? { ...m, projectId: null } : m)));
}

/** Sesiones evaluadas (verificación + horas contadas con el tope diario), más recientes primero. */
export function useSessionEvaluations(): SessionEvaluation[] {
  const sessions = useStore(sessionsStore);
  const commits = useAllCommits();
  return useMemo(() => evaluateSessions(sessions, commits), [sessions, commits]);
}

/** Guarda la sesión cerrada de un check-out. Las sesiones sin proyecto no cuentan para el reparto. */
export function recordSession(closed: CheckinSession): void {
  if (!closed.projectId || !closed.endedAt) return;
  const session: WorkSession = {
    id: closed.id,
    partnerId: closed.partnerId,
    projectId: closed.projectId,
    startedAt: closed.startedAt,
    endedAt: closed.endedAt,
    approvedBy: null,
  };
  // Con Supabase el check-out ya cerró la fila y Realtime puede haberla traído antes que esta llamada.
  sessionsStore.set((prev) => [session, ...prev.filter((s) => s.id !== session.id)]);
}

/** Otro socio valida a mano una sesión sin push (reunión con cliente, diseño, auditoría…). */
export function approveSession(id: string, by: PartnerId): void {
  const session = sessionsStore.get().find((s) => s.id === id);
  if (!session || session.partnerId === by || session.approvedBy) return;
  sessionsStore.set((prev) => prev.map((s) => (s.id === id ? { ...s, approvedBy: by } : s)));
  logActivity({
    type: 'hours',
    partnerId: by,
    projectId: session.projectId,
    action: `validó ${formatHours(sessionHours(session))} de trabajo sin push en`,
  });
}

export function useFundMovements(): FundMovement[] {
  const movements = useStore(fundStore);
  return useMemo(() => [...movements].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [movements]);
}

export interface FundSummary {
  contributions: number;
  expenses: number;
  balance: number;
  reserve: number;
  distributable: number;
}

export function useFundSummary(): FundSummary {
  const movements = useStore(fundStore);
  return useMemo(() => {
    const contributions = movements.filter((m) => m.type === 'aportacion').reduce((s, m) => s + m.amount, 0);
    const expenses = movements.filter((m) => m.type === 'gasto').reduce((s, m) => s + m.amount, 0);
    const balance = contributions - expenses;
    return {
      contributions,
      expenses,
      balance,
      reserve: FUND_MIN_RESERVE,
      distributable: Math.max(0, balance - FUND_MIN_RESERVE),
    };
  }, [movements]);
}

export function addFundMovement(
  input: { type: FundMovementType; concept: string; amount: number; projectId: string | null },
  by: PartnerId,
): FundMovement {
  const movement: FundMovement = {
    ...input,
    concept: input.concept.trim(),
    id: crypto.randomUUID(),
    createdBy: by,
    createdAt: new Date().toISOString(),
  };
  fundStore.set((prev) => [movement, ...prev]);
  const eur = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(movement.amount);
  logActivity({
    type: 'fund',
    partnerId: by,
    projectId: movement.projectId,
    action: movement.type === 'gasto' ? `registró un gasto de ${eur} del fondo` : `aportó ${eur} al fondo`,
    detail: movement.concept,
  });
  return movement;
}

/** ¿Ya se ingresó en el fondo la parte de este proyecto? */
export function useProjectFundPaid(projectId: string | undefined): boolean {
  return useStore(fundStore, (list) =>
    Boolean(projectId) && list.some((m) => m.type === 'aportacion' && m.projectId === projectId),
  );
}
