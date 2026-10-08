import type { Partner, PartnerId } from '../types';

type PartnerMeta = Omit<Partner, 'email' | 'avatarUrl'>;

/** Datos visuales fijos de cada socio. El resto (email, avatar) viene de la tabla `partners`. */
export const PARTNER_META: Record<PartnerId, PartnerMeta> = {
  javier: {
    id: 'javier',
    name: 'Javier',
    initials: 'J',
    color: 'from-sky-500 to-indigo-600',
    availability: 'Estudia por la mañana',
  },
  dani: {
    id: 'dani',
    name: 'Dani',
    initials: 'D',
    color: 'from-fuchsia-500 to-purple-600',
    availability: 'Estudia por la tarde',
  },
  mario: {
    id: 'mario',
    name: 'Mario',
    initials: 'M',
    color: 'from-emerald-500 to-teal-600',
    availability: 'Disponibilidad completa',
  },
};

export const PARTNER_IDS: PartnerId[] = ['javier', 'dani', 'mario'];

export const MOCK_PARTNERS: Partner[] = PARTNER_IDS.map((id) => ({
  ...PARTNER_META[id],
  email: `${id}@oficina.local`,
  avatarUrl: null,
}));

export interface PartnerRow {
  id: PartnerId;
  name: string;
  initials: string;
  email: string;
  avatar_url: string | null;
  availability: string | null;
}

export function mapPartnerRow(row: PartnerRow): Partner {
  const meta = PARTNER_META[row.id];
  return {
    ...meta,
    name: row.name,
    initials: row.initials,
    email: row.email,
    avatarUrl: row.avatar_url,
    availability: row.availability ?? meta.availability,
  };
}

export const PARTNER_COLUMNS = 'id, name, initials, email, avatar_url, availability';
