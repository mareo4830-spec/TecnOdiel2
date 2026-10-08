import { Cloud, Database, Eye, LoaderCircle, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../../../components/ui/Badge';
import { isSupabaseConfigured } from '../../../lib/supabase';
import type { Tenant } from '../../../types';
import { useAuth } from '../../auth/authContext';
import { SitePreview } from '../components/SitePreview';
import { createPreview, useIsProvisioning } from '../provisioningClient';
import { INTEGRATION_STATUS_META, REQUIREMENT_LABEL, tenantPreviewUrl } from '../tenantMeta';
import { previewMissing, useTenantIntegrations } from '../tenantService';
import { Card } from './shared';

/** Preview del tenant: la web real en su host .vercel.app (o de la agencia) y la simulada con sus datos. */
export function PreviewTab({ tenant }: { tenant: Tenant }) {
  const { partner } = useAuth();
  const integrations = useTenantIntegrations(tenant.id);
  const running = useIsProvisioning(tenant.id);
  const [error, setError] = useState<string | null>(null);
  const missing = previewMissing(tenant);
  const previewOk = integrations.preview.status === 'ok' && integrations.supabase.status === 'ok';
  const live = tenant.status === 'live' && tenant.domain ? `https://${tenant.domain}` : null;
  const liveUrl = live ?? (previewOk ? tenantPreviewUrl(tenant) : null);

  const run = async () => {
    if (!partner) return;
    setError(null);
    try {
      const res = await createPreview(tenant.id, partner.id);
      if (res.status === 'error') setError(`Falló el paso ${res.failedStep}: revisa el Log.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo crear la preview');
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section className="rounded-2xl border border-gray-800 bg-gray-900 p-3 sm:p-4">
        <SitePreview key={liveUrl ?? 'sim'} data={tenant} liveUrl={liveUrl} preferLive={isSupabaseConfigured} height="h-[560px] sm:h-[680px]" />
        {!isSupabaseConfigured && liveUrl && (
          <p className="mt-3 text-xs text-amber-300/80">Modo demo: la preview real no existe en Vercel, se muestra la simulada.</p>
        )}
        {!liveUrl && (
          <p className="mt-3 text-xs text-gray-500">
            Vista simulada con el layout y los datos del tenant. Al crear la preview se carga aquí la web real servida por el SaaS.
          </p>
        )}
      </section>

      <aside className="space-y-4">
        <Card title="Preview en Vercel">
          <p className="break-all font-mono text-sm text-indigo-300">{tenant.previewHost ?? 'Sin host'}</p>
          <ul className="mt-3 space-y-1.5">
            {(
              [
                ['supabase', Database, 'Negocio en la BD del SaaS'],
                ['preview', Cloud, 'Host en el proyecto de Vercel'],
              ] as const
            ).map(([p, Icon, label]) => {
              const s = integrations[p].status;
              return (
                <li key={p} className="flex items-center justify-between gap-2 rounded-lg bg-gray-800/40 px-2.5 py-2 text-xs">
                  <span className="flex items-center gap-1.5 text-gray-300">
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </span>
                  <Badge className={INTEGRATION_STATUS_META[s].badge}>
                    {s === 'running' && <LoaderCircle className="h-3 w-3 animate-spin" />}
                    {INTEGRATION_STATUS_META[s].label}
                  </Badge>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-xs text-gray-400">
            business_id: <code className="break-all text-gray-300">{tenant.saasBusinessId ?? '—'}</code>
          </p>
          {missing.length > 0 ? (
            <p className="mt-3 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
              Para la preview falta: {missing.map((m) => REQUIREMENT_LABEL[m]).join(', ')}. Complétalo en Datos.
            </p>
          ) : (
            <button
              onClick={run}
              disabled={running}
              className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
            >
              {running ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : previewOk ? (
                <RefreshCw className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              {running ? 'Creando preview…' : previewOk ? 'Actualizar preview' : 'Crear preview'}
            </button>
          )}
          {error && <p className="mt-2 text-xs text-rose-300">{error}</p>}
          <p className="mt-3 text-[11px] text-gray-500">
            Actualizar vuelve a escribir en el SaaS los datos de la ficha (nombre, layout, contacto, horario…) sin duplicar nada.
          </p>
        </Card>
      </aside>
    </div>
  );
}
