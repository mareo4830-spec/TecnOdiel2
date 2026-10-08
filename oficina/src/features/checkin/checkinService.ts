import { db, live, must } from '../../lib/db';
import type { CheckinSession, PartnerId } from '../../types';

/**
 * Capa de datos del check-in. Los componentes solo conocen esta interfaz.
 *  - Con Supabase: la sesión abierta es una fila de `work_sessions` con ended_at = null
 *    (la BD impide tener dos abiertas a la vez); el check-out la cierra.
 *  - Sin Supabase: localStorage del navegador.
 */
export interface CheckinService {
  getActive(partnerId: PartnerId): Promise<CheckinSession | null>;
  checkIn(partnerId: PartnerId, projectId?: string | null): Promise<CheckinSession>;
  checkOut(partnerId: PartnerId): Promise<CheckinSession | null>;
}

interface SessionRow {
  id: string;
  partner_id: PartnerId;
  project_id: string | null;
  started_at: string;
  ended_at: string | null;
}

const fromRow = (r: SessionRow): CheckinSession => ({
  id: r.id,
  partnerId: r.partner_id,
  projectId: r.project_id,
  startedAt: r.started_at,
  endedAt: r.ended_at,
});

const supabaseCheckinService: CheckinService = {
  async getActive(partnerId) {
    const row = await must<SessionRow | null>(
      db().from('work_sessions').select('*').eq('partner_id', partnerId).is('ended_at', null).maybeSingle(),
    );
    return row ? fromRow(row) : null;
  },

  async checkIn(partnerId, projectId = null) {
    const existing = await this.getActive(partnerId);
    if (existing) return existing;
    const row = await must<SessionRow>(
      db().from('work_sessions').insert({ partner_id: partnerId, project_id: projectId }).select('*').single(),
    );
    return fromRow(row);
  },

  async checkOut(partnerId) {
    const active = await this.getActive(partnerId);
    if (!active) return null;
    const row = await must<SessionRow>(
      db().from('work_sessions').update({ ended_at: new Date().toISOString() }).eq('id', active.id).select('*').single(),
    );
    return fromRow(row);
  },
};

const activeKey = (id: PartnerId) => `ov.checkin.active.${id}`;

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): void {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* sin almacenamiento disponible: el estado vive solo en memoria */
  }
}

const localCheckinService: CheckinService = {
  async getActive(partnerId) {
    return read<CheckinSession>(activeKey(partnerId));
  },

  async checkIn(partnerId, projectId = null) {
    const existing = read<CheckinSession>(activeKey(partnerId));
    if (existing) return existing;
    const session: CheckinSession = {
      id: crypto.randomUUID(),
      partnerId,
      projectId,
      startedAt: new Date().toISOString(),
      endedAt: null,
    };
    write(activeKey(partnerId), session);
    return session;
  },

  async checkOut(partnerId) {
    const active = read<CheckinSession>(activeKey(partnerId));
    if (!active) return null;
    write(activeKey(partnerId), null);
    return { ...active, endedAt: new Date().toISOString() };
  },
};

export const checkinService: CheckinService = live ? supabaseCheckinService : localCheckinService;
