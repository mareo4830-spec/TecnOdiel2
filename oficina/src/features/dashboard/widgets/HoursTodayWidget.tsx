import { useMemo } from 'react';
import { Avatar } from '../../../components/ui/Avatar';
import { useElapsed } from '../../../hooks/useElapsed';
import { PARTNER_IDS, PARTNER_META } from '../../../lib/partners';
import { useAuth } from '../../auth/authContext';
import { useCheckin } from '../../checkin/checkinContext';
import { formatHours, localDayKey } from '../../hours/hoursMath';
import { useSessionEvaluations } from '../../hours/hoursService';
import { DAILY_CAP_HOURS } from '../../hours/repartoConfig';

/** Horas de hoy por socio frente al tope diario, sumando en vivo el check-in activo. */
export function HoursTodayWidget() {
  const { partner } = useAuth();
  const { active } = useCheckin();
  const liveHours = useElapsed(active?.startedAt ?? null) / 3600;
  const evaluations = useSessionEvaluations();

  const rows = useMemo(() => {
    const today = localDayKey(new Date().toISOString());
    return PARTNER_IDS.map((id) => {
      const mine = evaluations.filter((e) => e.session.partnerId === id && localDayKey(e.session.startedAt) === today);
      return {
        id,
        counted: mine.reduce((s, e) => s + e.counted, 0),
        pending: mine.filter((e) => e.verification === 'pendiente').reduce((s, e) => s + e.hours, 0),
      };
    });
  }, [evaluations]);

  return (
    <ul className="space-y-4">
      {rows.map((r) => {
        const live = partner?.id === r.id && active?.projectId ? liveHours : 0;
        const total = Math.min(DAILY_CAP_HOURS, r.counted + r.pending + live);
        const width = (h: number) => `${(Math.min(h, DAILY_CAP_HOURS) / DAILY_CAP_HOURS) * 100}%`;
        return (
          <li key={r.id} className="flex items-center gap-3">
            <Avatar partner={{ ...PARTNER_META[r.id], avatarUrl: null }} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="font-medium text-white">
                  {PARTNER_META[r.id].name}
                  {live > 0 && <span className="ml-1.5 text-[11px] font-semibold text-emerald-400">● en curso</span>}
                </span>
                <span className="tabular-nums text-gray-400">
                  {formatHours(total)} <span className="text-gray-600">/ {DAILY_CAP_HOURS} h</span>
                </span>
              </div>
              <div className="mt-1.5 flex h-2 overflow-hidden rounded-full bg-gray-800">
                <div className="bg-emerald-500" style={{ width: width(r.counted) }} />
                <div className="animate-pulse bg-emerald-400/60" style={{ width: width(live) }} />
                <div className="bg-amber-500/60" style={{ width: width(r.pending) }} />
              </div>
            </div>
          </li>
        );
      })}
      <li className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-[11px] text-gray-500">
        <span><span className="mr-1 inline-block h-2 w-2 rounded-sm bg-emerald-500" />Verificadas</span>
        <span><span className="mr-1 inline-block h-2 w-2 rounded-sm bg-emerald-400/60" />En curso</span>
        <span><span className="mr-1 inline-block h-2 w-2 rounded-sm bg-amber-500/60" />Pendientes</span>
      </li>
    </ul>
  );
}
