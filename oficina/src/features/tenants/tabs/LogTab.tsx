import { CircleAlert, CircleCheck, Clock } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PARTNER_META } from '../../../lib/partners';
import type { PartnerId, Tenant } from '../../../types';
import { PROVIDER_META, type PipelineStep } from '../tenantMeta';
import { useTenantLog } from '../tenantService';
import { formatLogTime } from './shared';

export const stepLabel = (step: string) =>
  step in PROVIDER_META ? PROVIDER_META[step as PipelineStep].label : step === 'start' ? 'Inicio' : step === 'sync' ? 'Sincronización' : step;

export const actorLabel = (actor: string) => (actor in PARTNER_META ? PARTNER_META[actor as PartnerId].name : actor);

/** provisioning_log completo del tenant, más reciente primero. */
export function LogTab({ tenant }: { tenant: Tenant }) {
  const log = useTenantLog(tenant.id);
  const [filter, setFilter] = useState<'todo' | 'errores'>('todo');
  const rows = useMemo(() => [...log].reverse().filter((l) => filter === 'todo' || !l.ok), [log, filter]);

  return (
    <section className="rounded-2xl border border-gray-800 bg-gray-900 p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">provisioning_log · {log.length} entradas</h2>
        <div className="flex gap-1 rounded-xl bg-gray-800/60 p-1" role="tablist">
          {(['todo', 'errores'] as const).map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1 text-xs font-medium ${filter === f ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              {f === 'todo' ? 'Todo' : 'Errores'}
            </button>
          ))}
        </div>
      </div>
      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-800 px-4 py-10 text-center text-sm text-gray-500">
          {log.length ? 'Sin errores registrados.' : 'Todavía no se ha provisionado este tenant.'}
        </p>
      ) : (
        <ol className="divide-y divide-gray-800">
          {rows.map((l) => {
            const waiting = l.ok && l.detail.startsWith('En espera:');
            const Icon = !l.ok ? CircleAlert : waiting ? Clock : CircleCheck;
            return (
              <li key={l.id} className="flex gap-3 py-2.5">
                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${!l.ok ? 'text-rose-400' : waiting ? 'text-amber-400' : 'text-emerald-400'}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-100">
                    <span className="font-semibold">{stepLabel(l.step)}</span>
                    <span className="ml-2 break-words text-gray-300">{l.detail}</span>
                  </p>
                  <p className="mt-0.5 text-[11px] text-gray-500">
                    {formatLogTime(l.at)} · {actorLabel(l.actor)}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
