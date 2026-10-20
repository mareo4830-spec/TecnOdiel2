import { iso, isoOrNull } from '../../lib/rows';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import type { CheckinSession, PartnerId } from '../../types';

/**
 * Capa de datos del check-in. Los componentes solo conocen esta interfaz:
 * con Supabase usa la tabla `work_sessions`; sin él (demo) guarda en localStorage.
 */
export interface CheckinService {
  getActive(partnerId: PartnerId): Promise<CheckinSession | null>;
  checkIn(partnerId: PartnerId, projectId?: string | null): Promise<CheckinSession>;
  checkOut(partnerId: PartnerId): Promise<CheckinSession | null>;
}

const activeKey = (id: PartnerId) => `ov.checkin.active.${id}`;
const HISTORY_KEY = 'ov.checkin.history';

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

const mockCheckinService: CheckinService = {
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
    const closed: CheckinSession = { ...active, endedAt: new Date().toISOString() };
    const history = read<CheckinSession[]>(HISTORY_KEY) ?? [];
    write(HISTORY_KEY, [closed, ...history].slice(0, 200));
    write(activeKey(partnerId), null);
    return closed;
  },
};

interface SessionRow {
  id: string;
  partner_id: PartnerId;
  project_id: string | null;
  started_at: string;
  ended_at: string | null;
}

const toSession = (r: SessionRow): CheckinSession => ({
  id: r.id,
  partnerId: r.partner_id,
  projectId: r.project_id,
  startedAt: iso(r.started_at),
  endedAt: isoOrNull(r.ended_at),
});

/**
 * Tabla `work_sessions`: el check-in abre una fila sin `ended_at` (la BD solo permite una abierta
 * por socio) y el check-out la cierra. Así el check-in sobrevive a cerrar el navegador y se ve
 * desde el móvil.
 */
const supabaseCheckinService: CheckinService = {
  async getActive(partnerId) {
    const { data } = await supabase!
      .from('work_sessions')
      .select('id, partner_id, project_id, started_at, ended_at')
      .eq('partner_id', partnerId)
      .is('ended_at', null)
      .maybeSingle<SessionRow>();
    return data ? toSession(data) : null;
  },

  async checkIn(partnerId, projectId = null) {
    const existing = await supabaseCheckinService.getActive(partnerId);
    if (existing) return existing;
    const { data, error } = await supabase!
      .from('work_sessions')
      .insert({ partner_id: partnerId, project_id: projectId })
      .select('id, partner_id, project_id, started_at, ended_at')
      .single<SessionRow>();
    if (error) throw new Error(`No se pudo hacer check-in: ${error.message}`);
    return toSession(data);
  },

  async checkOut(partnerId) {
    const { data, error } = await supabase!
      .from('work_sessions')
      .update({ ended_at: new Date().toISOString() })
      .eq('partner_id', partnerId)
      .is('ended_at', null)
      .select('id, partner_id, project_id, started_at, ended_at')
      .maybeSingle<SessionRow>();
    if (error) throw new Error(`No se pudo hacer check-out: ${error.message}`);
    return data ? toSession(data) : null;
  },
};

export const checkinService: CheckinService = isSupabaseConfigured ? supabaseCheckinService : mockCheckinService;
