import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { reportDbError } from '../../lib/db';
import type { CheckinSession } from '../../types';
import { logActivity } from '../activity/activityService';
import { useAuth } from '../auth/authContext';
import { CheckinContext, type CheckinContextValue } from './checkinContext';
import { formatHours, sessionHours } from '../hours/hoursMath';
import { recordSession } from '../hours/hoursService';
import { checkinService } from './checkinService';

export function CheckinProvider({ children }: { children: ReactNode }) {
  const { partner } = useAuth();
  const [active, setActive] = useState<CheckinSession | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!partner) {
      setActive(null);
      return;
    }
    let cancelled = false;
    checkinService
      .getActive(partner.id)
      .then((session) => {
        if (!cancelled) setActive(session);
      })
      .catch((e) => reportDbError('Cargar el check-in', e));
    return () => {
      cancelled = true;
    };
  }, [partner]);

  const checkIn = useCallback(async (projectId: string | null) => {
    if (!partner) return;
    setBusy(true);
    try {
      const session = await checkinService.checkIn(partner.id, projectId);
      setActive(session);
      logActivity({
        type: 'checkin',
        partnerId: partner.id,
        projectId: session.projectId,
        action: session.projectId ? 'hizo check-in en' : 'hizo check-in',
      });
    } catch (e) {
      reportDbError('Hacer check-in', e);
    } finally {
      setBusy(false);
    }
  }, [partner]);

  const checkOut = useCallback(async () => {
    if (!partner) return;
    setBusy(true);
    try {
      const closed = await checkinService.checkOut(partner.id);
      setActive(null);
      if (closed) {
        recordSession(closed);
        const worked = formatHours(sessionHours({ startedAt: closed.startedAt, endedAt: closed.endedAt ?? closed.startedAt }));
        logActivity({
          type: 'checkout',
          partnerId: partner.id,
          projectId: closed.projectId,
          action: closed.projectId ? `hizo check-out (${worked}) en` : `hizo check-out (${worked})`,
        });
      }
    } catch (e) {
      reportDbError('Hacer check-out', e);
    } finally {
      setBusy(false);
    }
  }, [partner]);

  const value = useMemo<CheckinContextValue>(
    () => ({ active, busy, checkIn, checkOut }),
    [active, busy, checkIn, checkOut],
  );

  return <CheckinContext.Provider value={value}>{children}</CheckinContext.Provider>;
}
