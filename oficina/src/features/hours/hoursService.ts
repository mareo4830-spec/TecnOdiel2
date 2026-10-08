import { useMemo } from 'react';
import { db, must, num, persist } from '../../lib/db';
import { createStore, useStore } from '../../lib/store';
import type { CheckinSession, FundMovement, FundMovementType, PartnerId, WorkSession } from '../../types';
import { logActivity } from '../activity/activityService';
import { useAllCommits } from '../projects/projectService';
import { evaluateSessions, formatHours, sessionHours, type SessionEvaluation } from './hoursMath';
import { FUND_MIN_RESERVE } from './repartoConfig';

/*
 * Horas y fondo común.
 *  - Con Supabase: `work_sessions` (cada check-in; cerrada al hacer check-out) y `fund_movements`.
 *    La verificación por push cruza las sesiones con `commits` en el cliente.
 *  - Sin Supabase: en memoria.
 */
const sessionsStore = createStore<WorkSession[]>([]);
const fundStore = createStore<FundMovement[]>([]);

interface SessionRow {
  id: string;
  partner_id: PartnerId;
  project_id: string | null;
  started_at: string;
  ended_at: string | null;
  approved_by: PartnerId | null;
}

interface FundRow {
  id: string;
  type: FundMovementType;
  concept: string;
  amount: number | string;
  project_id: string | null;
  created_by: PartnerId;
  created_at: string;
}

/** Solo cuentan para el reparto las sesiones cerradas y con proyecto. */
export async function loadSessions(): Promise<void> {
  const rows = await must<SessionRow[]>(
    db().from('work_sessions').select('*').not('ended_at', 'is', null).not('project_id', 'is', null).order('started_at', { ascending: false }),
  );
  sessionsStore.set(() =>
    rows.map((r) => ({
      id: r.id,
      partnerId: r.partner_id,
      projectId: r.project_id!,
      startedAt: r.started_at,
      endedAt: r.ended_at!,
      approvedBy: r.approved_by,
    })),
  );
}

export async function loadFund(): Promise<void> {
  const rows = await must<FundRow[]>(db().from('fund_movements').select('*').order('created_at', { ascending: false }));
  fundStore.set(() =>
    rows.map((r) => ({
      id: r.id,
      type: r.type,
      concept: r.concept,
      amount: num(r.amount),
      projectId: r.project_id,
      createdBy: r.created_by,
      createdAt: r.created_at,
    })),
  );
}

/** Sesiones evaluadas (verificación + horas contadas con el tope diario), más recientes primero. */
export function useSessionEvaluations(): SessionEvaluation[] {
  const sessions = useStore(sessionsStore);
  const commits = useAllCommits();
  return useMemo(() => evaluateSessions(sessions, commits), [sessions, commits]);
}

/**
 * Añade la sesión cerrada de un check-out a la lista. Con Supabase ya está guardada (el check-out
 * cierra su fila de work_sessions). Las sesiones sin proyecto no cuentan para el reparto.
 */
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
  sessionsStore.set((prev) => [session, ...prev.filter((s) => s.id !== session.id)]);
}

/** Otro socio valida a mano una sesión sin push (reunión con cliente, diseño, auditoría…). */
export function approveSession(id: string, by: PartnerId): void {
  const session = sessionsStore.get().find((s) => s.id === id);
  if (!session || session.partnerId === by || session.approvedBy) return;
  sessionsStore.set((prev) => prev.map((s) => (s.id === id ? { ...s, approvedBy: by } : s)));
  void persist('Validar horas', () => must(db().from('work_sessions').update({ approved_by: by }).eq('id', id)));
  logActivity({
    type: 'hours',
    partnerId: by,
    projectId: session.projectId,
    action: `validó ${formatHours(sessionHours(session))} de trabajo sin push en`,
  });
}

export async function deleteSession(id: string, by: PartnerId): Promise<boolean> {
  const session = sessionsStore.get().find((s) => s.id === id);
  if (!session) return false;
  const ok = await persist('Eliminar sesión', () => must(db().from('work_sessions').delete().eq('id', id)));
  if (ok) {
    sessionsStore.set((prev) => prev.filter((s) => s.id !== id));
    logActivity({ type: 'hours', partnerId: by, projectId: session.projectId, action: `eliminó una sesión de ${formatHours(sessionHours(session))} en` });
  }
  return ok;
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

const eur = (n: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n);

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
  void persist('Guardar movimiento del fondo', () =>
    must(
      db().from('fund_movements').insert({
        id: movement.id,
        type: movement.type,
        concept: movement.concept,
        amount: movement.amount,
        project_id: movement.projectId,
        created_by: by,
        created_at: movement.createdAt,
      }),
    ),
  );
  logActivity({
    type: 'fund',
    partnerId: by,
    projectId: movement.projectId,
    action: movement.type === 'gasto' ? `registró un gasto de ${eur(movement.amount)} del fondo` : `aportó ${eur(movement.amount)} al fondo`,
    detail: movement.concept,
  });
  return movement;
}

export async function deleteFundMovement(id: string, by: PartnerId): Promise<boolean> {
  const movement = fundStore.get().find((m) => m.id === id);
  if (!movement) return false;
  const ok = await persist('Eliminar movimiento del fondo', () => must(db().from('fund_movements').delete().eq('id', id)));
  if (ok) {
    fundStore.set((prev) => prev.filter((m) => m.id !== id));
    logActivity({
      type: 'fund',
      partnerId: by,
      projectId: movement.projectId,
      action: `eliminó un movimiento de ${eur(movement.amount)} del fondo`,
      detail: movement.concept,
    });
  }
  return ok;
}

/** ¿Ya se ingresó en el fondo la parte de este proyecto? */
export function useProjectFundPaid(projectId: string | undefined): boolean {
  return useStore(fundStore, (list) =>
    Boolean(projectId) && list.some((m) => m.type === 'aportacion' && m.projectId === projectId),
  );
}

