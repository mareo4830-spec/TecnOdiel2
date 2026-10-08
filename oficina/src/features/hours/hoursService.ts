import { useMemo } from 'react';
import { createStore, useStore } from '../../lib/store';
import type { CheckinSession, FundMovement, FundMovementType, PartnerId, WorkSession } from '../../types';
import { logActivity } from '../activity/activityService';
import { useAllCommits } from '../projects/projectService';
import { evaluateSessions, formatHours, sessionHours, type SessionEvaluation } from './hoursMath';
import { FUND_MIN_RESERVE } from './repartoConfig';

/*
 * Capa de datos de horas y fondo común (local). Con Supabase:
 *  - `work_sessions` se rellena al hacer check-out (la tabla `checkins` cerrada).
 *  - La verificación por push se puede hacer igual en el cliente o en una vista SQL que cruce
 *    `work_sessions` con `commits`.
 *  - `fund_movements` guarda aportaciones y gastos.
 */
const sessionsStore = createStore<WorkSession[]>([], 'sessions');
const fundStore = createStore<FundMovement[]>([], 'fund');

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
  sessionsStore.set((prev) => [session, ...prev]);
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
