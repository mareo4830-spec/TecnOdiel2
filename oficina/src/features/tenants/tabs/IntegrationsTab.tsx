import { LoaderCircle, RefreshCw, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../../../components/ui/Badge';
import { formatRelative } from '../../../lib/format';
import type { IntegrationProvider, Tenant, TenantIntegration } from '../../../types';
import { useAuth } from '../../auth/authContext';
import { provisionTenant, syncTenant, useIsProvisioning } from '../provisioningClient';
import { INTEGRATION_STATUS_META, PROVIDERS, PROVIDER_META } from '../tenantMeta';
import { useMissingRequirements, useTenantIntegrations } from '../tenantService';

type Sync = Record<string, unknown> & { at?: string };

/** Datos útiles del meta de cada proveedor (registros DNS, métricas del último sync…). */
function MetaDetails({ integration }: { integration: TenantIntegration }) {
  const { provider, meta } = integration;
  const sync = (meta.sync ?? null) as Sync | null;
  const records = (meta.dnsRecords ?? meta.records ?? null) as { type: string; name: string; content: string }[] | null;
  return (
    <div className="space-y-2 text-xs">
      {records && (provider === 'vercel' || provider === 'dns') && (
        <ul className="space-y-1 rounded-lg bg-gray-950/60 p-2 font-mono">
          {records.map((r) => (
            <li key={`${r.type}${r.name}${r.content}`} className="break-all text-gray-300">
              <span className="text-indigo-300">{r.type}</span> {r.name} → {r.content}
            </li>
          ))}
        </ul>
      )}
      {sync && (
        <p className="text-gray-400">
          {provider === 'onesignal' && `${String(sync.messageable ?? 0)} suscriptores activos`}
          {provider === 'gsc' && `${String(sync.clicks ?? 0)} clics · ${String(sync.impressions ?? 0)} impresiones (28 días)`}
          {provider === 'vercel' && (sync.ssl ? 'Dominio verificado · SSL disponible' : 'Dominio aún sin verificar')}
          {provider === 'dns' && (sync.propagated ? 'DNS propagado' : 'DNS aún sin propagar')}
        </p>
      )}
      {provider === 'dns' && meta.manual === true && <p className="text-amber-300">Sin proveedor DNS: los registros se crean a mano.</p>}
    </div>
  );
}

/** Una tarjeta por proveedor: estado, error y "Reintentar" (retoma el provisionado desde ese paso). */
export function IntegrationsTab({ tenant }: { tenant: Tenant }) {
  const { partner } = useAuth();
  const integrations = useTenantIntegrations(tenant.id);
  const missing = useMissingRequirements(tenant);
  const running = useIsProvisioning(tenant.id);
  const [busy, setBusy] = useState<IntegrationProvider | 'sync' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const retry = async (provider: IntegrationProvider) => {
    if (!partner) return;
    setBusy(provider);
    setError(null);
    try {
      // En ok se fuerza repetir el paso; en error/pending basta con relanzar (el orquestador salta lo hecho).
      await provisionTenant(tenant.id, partner.id, integrations[provider].status === 'ok' ? [provider] : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo reintentar');
    } finally {
      setBusy(null);
    }
  };

  const sync = async () => {
    if (!partner) return;
    setBusy('sync');
    await syncTenant(tenant.id, partner.id);
    setBusy(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-400">
          Los secretos de cada proveedor viven solo en las Edge Functions: aquí solo se ve el estado.
        </p>
        <button
          onClick={sync}
          disabled={busy !== null || running || tenant.status === 'draft'}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-700 px-4 text-sm font-medium text-gray-200 hover:border-indigo-500 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${busy === 'sync' ? 'animate-spin' : ''}`} />
          Sincronizar estado real
        </button>
      </div>
      {error && <p className="rounded-xl bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {PROVIDERS.map((p) => {
          const integ = integrations[p];
          const meta = PROVIDER_META[p];
          const Icon = meta.icon;
          const status = INTEGRATION_STATUS_META[integ.status];
          const canRetry = !running && missing.length === 0 && integ.status !== 'running';
          return (
            <section key={p} className={`flex flex-col rounded-2xl border bg-gray-900 p-4 ${integ.status === 'error' ? 'border-rose-500/40' : 'border-gray-800'}`}>
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-500/10 text-indigo-300">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-white">{meta.label}</h3>
                  <p className="text-xs text-gray-500">{meta.description}</p>
                </div>
                <Badge className={status.badge}>
                  {integ.status === 'running' && <LoaderCircle className="h-3 w-3 animate-spin" />}
                  {status.label}
                </Badge>
              </div>

              <div className="mt-3 flex-1 space-y-2">
                {integ.externalId && (
                  <p className="break-all text-xs text-gray-400">
                    ID externo: <code className="text-gray-300">{integ.externalId}</code>
                  </p>
                )}
                {integ.error && <p className="break-words rounded-lg bg-rose-500/10 px-2.5 py-2 text-xs text-rose-300">{integ.error}</p>}
                <MetaDetails integration={integ} />
              </div>

              <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-800 pt-3">
                <span className="text-[11px] text-gray-500">{integ.lastSyncAt ? `Actualizado ${formatRelative(integ.lastSyncAt)}` : 'Sin ejecutar'}</span>
                {integ.status !== 'skipped' && (
                  <button
                    onClick={() => retry(p)}
                    disabled={!canRetry || busy !== null}
                    title={missing.length ? 'Completa los requisitos antes de provisionar' : undefined}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-gray-800 px-2.5 text-xs font-medium text-gray-200 hover:bg-gray-700 disabled:opacity-40"
                  >
                    {busy === p ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />}
                    {integ.status === 'ok' ? 'Repetir' : 'Reintentar'}
                  </button>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
