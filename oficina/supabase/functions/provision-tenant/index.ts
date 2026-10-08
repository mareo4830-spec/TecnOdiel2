import { adminClient, requireAdmin } from '../_shared/auth.ts';
import { createDnsProvider } from '../_shared/dns/index.ts';
import { denoEnv } from '../_shared/env.ts';
import { corsHeaders, HttpError, json } from '../_shared/http.ts';
import { type PipelineDeps, runProvisioning } from '../_shared/pipeline.ts';
import { envForTenant } from '../_shared/projectConfig.ts';
import { supabaseRepo } from '../_shared/repo.ts';
import { createSaasGateway, type SaasGateway } from '../_shared/saas/gateway.ts';
import type { IntegrationProvider, ProvisionMode } from '../_shared/types.ts';

/*
 * POST /provision-tenant  { tenantId, mode?: 'full' | 'preview', force?: provider[], wait?: boolean }
 *
 * full (por defecto): places → supabase → preview → vercel → dns → onesignal → gsc → go-live.
 * preview: supabase → preview, para ver la web en <slug>-<sufijo>.vercel.app antes del dominio.
 * Usa la configuración del proyecto SaaS del tenant (saas_project_config). Idempotente: al
 * reintentar retoma desde el paso que falló. Por defecto responde 202 y sigue en segundo plano;
 * la UI sigue el avance por Realtime (tenant_integrations y provisioning_log).
 */

declare const EdgeRuntime: { waitUntil(promise: Promise<unknown>): void } | undefined;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PROVIDERS: IntegrationProvider[] = ['places', 'supabase', 'preview', 'vercel', 'dns', 'onesignal', 'gsc'];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Método no permitido' }, 405);

  try {
    const db = adminClient(denoEnv);
    const { partnerId } = await requireAdmin(req, denoEnv, db);

    const body = await req.json().catch(() => null);
    const tenantId = body?.tenantId;
    if (typeof tenantId !== 'string' || !UUID.test(tenantId)) throw new HttpError(400, 'tenantId debe ser un UUID');
    const force = Array.isArray(body?.force) ? body.force.filter((p: unknown) => PROVIDERS.includes(p as IntegrationProvider)) : [];
    const mode: ProvisionMode = body?.mode === 'preview' ? 'preview' : 'full';
    const env = await envForTenant(db, tenantId, denoEnv);

    // El gateway del SaaS se crea al usarlo: si faltan sus secretos, falla solo el paso que lo necesita.
    let saas: SaasGateway | null = null;
    const deps: PipelineDeps = {
      repo: supabaseRepo(db),
      env,
      fetch,
      saas: () => (saas ??= createSaasGateway(env, fetch)),
      dns: (id) => createDnsProvider(id, env, fetch),
    };

    const run = runProvisioning(tenantId, partnerId, deps, { force, mode });

    if (body?.wait === true || typeof EdgeRuntime === 'undefined') {
      return json(await run);
    }
    // Si acaba enseguida (p. ej. un 409 por datos que faltan) se responde con eso; si no, sigue
    // en segundo plano y la respuesta es 202.
    type Settled = { done: true; result?: unknown; error?: unknown } | { done: false };
    const settled = await Promise.race<Settled>([
      run.then((result) => ({ done: true, result }), (error) => ({ done: true, error })),
      new Promise<Settled>((resolve) => setTimeout(() => resolve({ done: false }), 1500)),
    ]);
    if (settled.done) {
      if (settled.error) throw settled.error;
      return json(settled.result);
    }
    EdgeRuntime.waitUntil(run.catch((e) => console.error('provision-tenant', tenantId, e)));
    return json({ accepted: true, tenantId }, 202);
  } catch (e) {
    if (e instanceof HttpError) return json({ error: e.message, details: e.details }, e.status);
    console.error('provision-tenant', e);
    return json({ error: e instanceof Error ? e.message : 'Error inesperado' }, 500);
  }
});
