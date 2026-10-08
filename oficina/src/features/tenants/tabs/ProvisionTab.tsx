import { CircleAlert, CircleCheck, CircleDashed, CircleMinus, Clock, LoaderCircle, Radio, RefreshCw, Rocket } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Tenant, TenantIntegrationStatus } from '../../../types';
import { useAuth } from '../../auth/authContext';
import { RequirementsChecklist } from '../components/TenantBits';
import { provisionTenant, syncTenant, useIsProvisioning } from '../provisioningClient';
import { PIPELINE_STEPS, PROVIDER_META, REQUIREMENT_LABEL, type PipelineStep } from '../tenantMeta';
import { useMissingRequirements, useTenantIntegrations, useTenantLog } from '../tenantService';
import { actorLabel, stepLabel } from './LogTab';
import { formatLogTime } from './shared';

type StepState = TenantIntegrationStatus | 'done-live';

const STATE_ICON: Record<StepState, { icon: typeof CircleCheck; className: string; label: string }> = {
  ok: { icon: CircleCheck, className: 'text-emerald-400', label: 'Hecho' },
  'done-live': { icon: CircleCheck, className: 'text-emerald-400', label: 'En producción' },
  running: { icon: LoaderCircle, className: 'animate-spin text-sky-400', label: 'En curso' },
  pending: { icon: CircleDashed, className: 'text-gray-500', label: 'Pendiente' },
  error: { icon: CircleAlert, className: 'text-rose-400', label: 'Error' },
  skipped: { icon: CircleMinus, className: 'text-gray-500', label: 'Omitido' },
};

/** Botón Provisionar (desactivado con motivo si falta algo) + pasos y timeline en vivo. */
export function ProvisionTab({ tenant, onGo }: { tenant: Tenant; onGo: (tab: string) => void }) {
  const { partner } = useAuth();
  const missing = useMissingRequirements(tenant);
  const integrations = useTenantIntegrations(tenant.id);
  const log = useTenantLog(tenant.id);
  const running = useIsProvisioning(tenant.id);
  const [message, setMessage] = useState<{ kind: 'ok' | 'error' | 'info'; text: string } | null>(null);
  const [syncing, setSyncing] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // La última ejecución empieza en la última entrada "start".
  const lastRun = useMemo(() => {
    const start = log.map((l) => l.step).lastIndexOf('start');
    return start === -1 ? [] : log.slice(start);
  }, [log]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest' });
  }, [lastRun.length]);

  const stepState = (step: PipelineStep): StepState => {
    if (step === 'go-live') return tenant.status === 'live' ? 'done-live' : lastRun.some((l) => l.step === 'go-live' && !l.ok) ? 'error' : 'pending';
    return integrations[step].status;
  };
  // Qué espera un paso en pending tras ejecutarse (DNS sin propagar, TXT de Google…).
  const waitingNote = (step: PipelineStep) => {
    const entry = [...lastRun].reverse().find((l) => l.step === step);
    return entry?.detail.startsWith('En espera:') ? entry.detail.replace('En espera: ', '') : null;
  };

  const hasError = PIPELINE_STEPS.some((s) => stepState(s) === 'error');
  const waiting = PIPELINE_STEPS.some((s) => s !== 'go-live' && integrations[s].status === 'pending' && waitingNote(s));
  const label = tenant.status === 'live' ? 'Re-provisionar' : hasError || waiting ? 'Reintentar' : 'Provisionar';

  const disabledReason = running
    ? 'Provisionado en curso…'
    : missing.length
      ? `Falta: ${missing.map((m) => REQUIREMENT_LABEL[m]).join(', ')}`
      : null;

  const run = async () => {
    if (!partner || disabledReason) return;
    setMessage({ kind: 'info', text: 'Provisionando… el avance aparece abajo en directo.' });
    try {
      const res = await provisionTenant(tenant.id, partner.id);
      if (res.status === 'live') setMessage({ kind: 'ok', text: '¡En producción! Se ha avisado al equipo en el chat.' });
      else if (res.status === 'pending') setMessage({ kind: 'info', text: 'Casi listo: falta que propague el DNS. Pulsa Reintentar o Sincronizar en unos segundos.' });
      else setMessage({ kind: 'error', text: `Se ha parado en ${stepLabel(res.failedStep ?? '')}. Corrige el problema y pulsa Reintentar: seguirá desde ahí.` });
    } catch (e) {
      setMessage({ kind: 'error', text: e instanceof Error ? e.message : 'No se pudo provisionar' });
    }
  };

  const sync = async () => {
    if (!partner) return;
    setSyncing(true);
    await syncTenant(tenant.id, partner.id);
    setSyncing(false);
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-5">
      <section className="space-y-4 rounded-2xl border border-gray-800 bg-gray-900 p-4 sm:p-5 xl:col-span-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={run}
            disabled={Boolean(disabledReason)}
            aria-describedby={disabledReason ? 'provision-disabled-reason' : undefined}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 hover:from-indigo-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-500 disabled:shadow-none"
          >
            {running ? <LoaderCircle className="h-4 w-4 animate-spin" /> : label === 'Provisionar' ? <Rocket className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
            {running ? 'Provisionando…' : label}
          </button>
          <button
            onClick={sync}
            disabled={syncing || running || tenant.status === 'draft'}
            title="Refresca el estado real de Vercel/SSL, DNS, OneSignal y Search Console"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-gray-700 px-4 text-sm font-medium text-gray-200 hover:border-indigo-500 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            Sincronizar
          </button>
        </div>

        {disabledReason && !running && (
          <div id="provision-disabled-reason" className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
            <p className="text-sm font-medium text-amber-200">No se puede provisionar todavía</p>
            <div className="mt-2">
              <RequirementsChecklist missing={missing} />
            </div>
            <div className="mt-3 flex gap-3 text-xs font-medium">
              {missing.includes('payment') && (
                <button onClick={() => onGo('facturacion')} className="text-indigo-300 hover:text-indigo-200">Marcar el cobro →</button>
              )}
              {missing.some((m) => m !== 'payment') && (
                <button onClick={() => onGo('datos')} className="text-indigo-300 hover:text-indigo-200">Completar datos →</button>
              )}
            </div>
          </div>
        )}

        {message && (
          <p
            role="status"
            className={`rounded-xl px-3 py-2 text-sm ${
              message.kind === 'ok' ? 'bg-emerald-500/10 text-emerald-300' : message.kind === 'error' ? 'bg-rose-500/10 text-rose-300' : 'bg-sky-500/10 text-sky-200'
            }`}
          >
            {message.text}
          </p>
        )}

        <ol className="relative space-y-1 before:absolute before:bottom-4 before:left-[15px] before:top-4 before:w-px before:bg-gray-800">
          {PIPELINE_STEPS.map((step) => {
            const state = stepState(step);
            const meta = STATE_ICON[state];
            const Icon = meta.icon;
            const note = state === 'pending' ? waitingNote(step) : null;
            const error = step !== 'go-live' && state === 'error' ? integrations[step].error : null;
            return (
              <li key={step} className="relative flex gap-3 rounded-xl px-1 py-2">
                <span className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gray-900">
                  {note ? <Clock className="h-5 w-5 text-amber-400" /> : <Icon className={`h-5 w-5 ${meta.className}`} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white">
                    {PROVIDER_META[step].label}
                    <span className={`ml-2 text-xs font-normal ${note ? 'text-amber-300' : 'text-gray-500'}`}>{note ? 'En espera' : meta.label}</span>
                  </p>
                  <p className="text-xs text-gray-500">{PROVIDER_META[step].description}</p>
                  {note && <p className="mt-1 text-xs text-amber-200/90">{note}</p>}
                  {error && <p className="mt-1 break-words rounded-lg bg-rose-500/10 px-2 py-1 text-xs text-rose-300">{error}</p>}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="rounded-2xl border border-gray-800 bg-gray-900 p-4 sm:p-5 xl:col-span-3">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Última ejecución</h2>
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
            <Radio className="h-3 w-3" />
            En directo
          </span>
        </div>
        {lastRun.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-800 px-4 py-10 text-center text-sm text-gray-500">
            Aún no se ha provisionado. Cuando pulses el botón verás aquí cada paso según ocurre.
          </p>
        ) : (
          <ol className="max-h-[32rem] space-y-2 overflow-y-auto pr-1" aria-live="polite">
            {lastRun.map((l) => {
              const waitingEntry = l.ok && l.detail.startsWith('En espera:');
              return (
                <li
                  key={l.id}
                  className={`animate-[fadeIn_0.3s_ease-out] rounded-xl border px-3 py-2 ${
                    !l.ok ? 'border-rose-500/30 bg-rose-500/5' : waitingEntry ? 'border-amber-500/30 bg-amber-500/5' : 'border-gray-800 bg-gray-800/30'
                  }`}
                >
                  <p className="flex items-center justify-between gap-2 text-xs">
                    <span className={`font-semibold ${!l.ok ? 'text-rose-300' : waitingEntry ? 'text-amber-300' : 'text-emerald-300'}`}>{stepLabel(l.step)}</span>
                    <span className="text-gray-500">{formatLogTime(l.at)} · {actorLabel(l.actor)}</span>
                  </p>
                  <p className="mt-0.5 break-words text-sm text-gray-200">{l.detail}</p>
                </li>
              );
            })}
            {running && (
              <li className="flex items-center gap-2 px-3 py-2 text-sm text-sky-300">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Trabajando en el siguiente paso…
              </li>
            )}
            <div ref={endRef} />
          </ol>
        )}
      </section>
    </div>
  );
}
