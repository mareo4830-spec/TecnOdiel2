import { MOCK_PARTNERS, PARTNER_COLUMNS, PARTNER_META, mapPartnerRow, type PartnerRow } from '../../lib/partners';
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
  return data.filter((row) => row.id in PARTNER_META).map(mapPartnerRow);
}

/**
 * Presencia del resto del equipo: desconectados hasta tener un canal de Supabase Realtime Presence.
 */
export const DEFAULT_PRESENCE: Record<PartnerId, PresenceStatus> = {
  javier: 'offline',
  mario: 'offline',
};
