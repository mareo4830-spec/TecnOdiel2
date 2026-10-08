import { useEffect, useMemo, useState } from 'react';
import { MOCK_PARTNERS } from '../../lib/partners';
import type { Partner, PartnerId, PresenceStatus } from '../../types';
import { useAuth } from '../auth/authContext';
import { useCheckin } from '../checkin/checkinContext';
import { DEFAULT_PRESENCE, listPartners } from './teamService';

export function useTeam(): Partner[] {
  const [team, setTeam] = useState<Partner[]>(MOCK_PARTNERS);

  useEffect(() => {
    let cancelled = false;
    listPartners().then((partners) => {
      if (!cancelled) setTeam(partners);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return team;
}

/** Estado de cada socio. El del socio activo se deriva de su sesión y su check-in. */
export function usePresence(): Record<PartnerId, PresenceStatus> {
  const { partner } = useAuth();
  const { active } = useCheckin();

  return useMemo(() => {
    const map = { ...DEFAULT_PRESENCE };
    if (partner) map[partner.id] = active ? 'checked_in' : 'online';
    return map;
  }, [partner, active]);
}
