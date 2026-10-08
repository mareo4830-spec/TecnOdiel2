import { MOCK_PARTNERS, PARTNER_COLUMNS, mapPartnerRow, type PartnerRow } from '../../lib/partners';
import { supabase } from '../../lib/supabase';
import type { Partner, PartnerId, PresenceStatus } from '../../types';

export async function listPartners(): Promise<Partner[]> {
  if (!supabase) return MOCK_PARTNERS;
  const { data, error } = await supabase
    .from('partners')
    .select(PARTNER_COLUMNS)
    .order('name')
    .returns<PartnerRow[]>();
  if (error || !data) return MOCK_PARTNERS;
  return data.map(mapPartnerRow);
}

/**
 * Presencia del resto del equipo. Pendiente de Supabase Realtime Presence: mientras tanto solo
 * se conoce la del socio que usa la app (ver usePresence), el resto aparece desconectado.
 */
export const DEFAULT_PRESENCE: Record<PartnerId, PresenceStatus> = {
  javier: 'offline',
  dani: 'offline',
  mario: 'offline',
};
