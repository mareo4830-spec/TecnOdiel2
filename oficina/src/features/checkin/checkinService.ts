import type { CheckinSession, PartnerId } from '../../types';

/**
 * Capa de datos del check-in. Los componentes solo conocen esta interfaz:
 * en la Fase 3 se añade `supabaseCheckinService` (tabla `checkins`) y se cambia la exportación.
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

export const checkinService: CheckinService = mockCheckinService;
