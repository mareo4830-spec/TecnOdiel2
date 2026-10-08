import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FundPanel } from './components/FundPanel';
import { RepartoPanel } from './components/RepartoPanel';
import { SessionsPanel } from './components/SessionsPanel';
import { formatHours } from './hoursMath';
import { HOURS_TABS, type HoursTab } from './hoursMeta';
import { useSessionEvaluations } from './hoursService';

const WEEK_MS = 7 * 24 * 3_600_000;

export function HoursPage() {
  const [params, setParams] = useSearchParams();
  const tab: HoursTab = HOURS_TABS.some((t) => t.id === params.get('tab')) ? (params.get('tab') as HoursTab) : 'horas';
  const evaluations = useSessionEvaluations();

  const stats = useMemo(() => {
    const since = Date.now() - WEEK_MS;
    const week = evaluations.filter((e) => new Date(e.session.startedAt).getTime() >= since);
    const pending = evaluations.filter((e) => e.verification === 'pendiente');
    const verified = week.filter((e) => e.verification === 'push').length;
    return [
      { label: 'Horas contadas (7 días)', value: formatHours(week.reduce((s, e) => s + e.counted, 0)) },
      { label: 'Sesiones (7 días)', value: String(week.length) },
      { label: 'Verificadas por push', value: week.length ? `${Math.round((verified / week.length) * 100)} %` : '—' },
      { label: 'Pendientes de validar', value: String(pending.length) },
    ];
  }, [evaluations]);

  return (
    <div className="mx-auto max-w-[1600px] space-y-5 sm:space-y-6">
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Secciones">
        {HOURS_TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setParams(t.id === 'horas' ? {} : { tab: t.id }, { replace: true })}
            className={`h-9 shrink-0 rounded-xl px-4 text-sm font-medium transition ${
              tab === t.id ? 'bg-indigo-600 text-white' : 'bg-gray-900 text-gray-400 ring-1 ring-gray-800 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'horas' && (
        <>
          <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
                <dt className="text-xs text-gray-400">{s.label}</dt>
                <dd className="mt-1 text-xl font-semibold text-white sm:text-2xl">{s.value}</dd>
              </div>
            ))}
          </dl>
          <SessionsPanel evaluations={evaluations} />
        </>
      )}
      {tab === 'reparto' && <RepartoPanel evaluations={evaluations} />}
      {tab === 'fondo' && <FundPanel />}
    </div>
  );
}
