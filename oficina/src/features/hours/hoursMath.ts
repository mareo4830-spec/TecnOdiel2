import { PARTNER_IDS } from '../../lib/partners';
import type { Commit, PartnerId, Project, SessionVerification, WorkSession } from '../../types';
import { DAILY_CAP_HOURS, PUSH_GRACE_MINUTES, REPARTO_RULES, WORK_SHARE } from './repartoConfig';

/*
 * Cálculos puros de horas y reparto. No dependen de React ni del origen de los datos,
 * así que valen igual con mock que con Supabase (o para una Edge Function de cierre de mes).
 */

export function sessionHours(s: Pick<WorkSession, 'startedAt' | 'endedAt'>): number {
  return Math.max(0, (new Date(s.endedAt).getTime() - new Date(s.startedAt).getTime()) / 3_600_000);
}

/** Una sesión está verificada si el socio hizo push a ese proyecto mientras trabajaba. */
export function verifySession(s: WorkSession, commits: Commit[]): SessionVerification {
  const from = new Date(s.startedAt).getTime();
  const to = new Date(s.endedAt).getTime() + PUSH_GRACE_MINUTES * 60_000;
  const pushed = commits.some((c) => {
    if (c.author !== s.partnerId || c.projectId !== s.projectId) return false;
    const t = new Date(c.committedAt).getTime();
    return t >= from && t <= to;
  });
  if (pushed) return 'push';
  return s.approvedBy ? 'aprobada' : 'pendiente';
}

export function localDayKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export interface SessionEvaluation {
  session: WorkSession;
  verification: SessionVerification;
  hours: number;
  /** Horas que cuentan para el reparto: 0 si está pendiente y recortadas al tope diario. */
  counted: number;
}

/** Evalúa todas las sesiones aplicando el tope diario por socio en orden cronológico. */
export function evaluateSessions(sessions: WorkSession[], commits: Commit[]): SessionEvaluation[] {
  const usedByPartnerDay = new Map<string, number>();
  return [...sessions]
    .sort((a, b) => a.startedAt.localeCompare(b.startedAt))
    .map((session) => {
      const verification = verifySession(session, commits);
      const hours = sessionHours(session);
      let counted = 0;
      if (verification !== 'pendiente') {
        const key = `${session.partnerId}|${localDayKey(session.startedAt)}`;
        const used = usedByPartnerDay.get(key) ?? 0;
        counted = Math.max(0, Math.min(hours, DAILY_CAP_HOURS - used));
        usedByPartnerDay.set(key, used + counted);
      }
      return { session, verification, hours, counted };
    })
    .reverse();
}

export interface RepartoRow {
  partnerId: PartnerId;
  hours: number;
  /** Fracción de las horas del proyecto (0–1). */
  hoursShare: number;
  work: number;
  closing: number;
  audit: number;
  total: number;
}

export interface Reparto {
  price: number;
  fund: number;
  workPool: number;
  rows: RepartoRow[];
  /** Si nadie tiene horas contadas, el trabajo se reparte a partes iguales entre los que colaboraron. */
  equalSplit: boolean;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function computeReparto(project: Project, evaluations: SessionEvaluation[], price = project.price): Reparto {
  const hoursBy = new Map<PartnerId, number>();
  for (const e of evaluations) {
    if (e.session.projectId !== project.id) continue;
    hoursBy.set(e.session.partnerId, (hoursBy.get(e.session.partnerId) ?? 0) + e.counted);
  }
  const totalHours = [...hoursBy.values()].reduce((s, h) => s + h, 0);
  const equalSplit = totalHours === 0;
  const workPool = price * WORK_SHARE;
  const collaborators = project.contributors.length ? project.contributors : PARTNER_IDS;

  const rows = PARTNER_IDS.map((partnerId) => {
    const hours = hoursBy.get(partnerId) ?? 0;
    const hoursShare = equalSplit
      ? collaborators.includes(partnerId)
        ? 1 / collaborators.length
        : 0
      : hours / totalHours;
    const work = round2(workPool * hoursShare);
    const closing = partnerId === project.closedBy ? round2(price * REPARTO_RULES.closing) : 0;
    const audit = partnerId === project.auditBy ? round2(price * REPARTO_RULES.audit) : 0;
    return { partnerId, hours, hoursShare, work, closing, audit, total: round2(work + closing + audit) };
  });

  return { price, fund: round2(price * REPARTO_RULES.fund), workPool: round2(workPool), rows, equalSplit };
}

export function formatHours(hours: number): string {
  const totalMin = Math.round(hours * 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
}
