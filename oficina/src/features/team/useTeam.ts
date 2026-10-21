import { useEffect, useMemo, useState } from 'react';
import { MOCK_PARTNERS } from '../../lib/partners';
import type { Partner, PartnerId, PresenceStatus } from '../../types';
import { useAuth } from '../auth/authContext';
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

/** Estado de cada socio: el socio activo aparece conectado. */
export function usePresence(): Record<PartnerId, PresenceStatus> {
  const { partner } = useAuth();

  return useMemo(() => {
    const map = { ...DEFAULT_PRESENCE };
    if (partner) map[partner.id] = 'online';
    return map;
  }, [partner]);
}
