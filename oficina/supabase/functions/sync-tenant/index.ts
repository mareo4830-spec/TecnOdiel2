import { adminClient, requireAdmin } from '../_shared/auth.ts';
import { createDnsProvider } from '../_shared/dns/index.ts';
import { denoEnv } from '../_shared/env.ts';
import { corsHeaders, HttpError, json } from '../_shared/http.ts';
import { envForTenant } from '../_shared/projectConfig.ts';
import { supabaseRepo } from '../_shared/repo.ts';
import { createSaasGateway } from '../_shared/saas/gateway.ts';
import { syncTenant } from '../_shared/sync.ts';

/*
 * POST /sync-tenant  { tenantId }
 * Refresca bajo demanda el estado real de Vercel/SSL, DNS, OneSignal y Search Console.
 */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Método no permitido' }, 405);

  try {
    const db = adminClient(denoEnv);
    const { partnerId } = await requireAdmin(req, denoEnv, db);
    const body = await req.json().catch(() => null);
    const tenantId = body?.tenantId;
    if (typeof tenantId !== 'string' || !UUID.test(tenantId)) throw new HttpError(400, 'tenantId debe ser un UUID');

    const env = await envForTenant(db, tenantId, denoEnv);
    const reports = await syncTenant(tenantId, partnerId, {
      repo: supabaseRepo(db),
      env,
      fetch,
      saas: () => createSaasGateway(env, fetch),
      dns: (id) => createDnsProvider(id, env, fetch),
    });
    return json({ tenantId, reports });
  } catch (e) {
    if (e instanceof HttpError) return json({ error: e.message, details: e.details }, e.status);
    console.error('sync-tenant', e);
    return json({ error: e instanceof Error ? e.message : 'Error inesperado' }, 500);
  }
});
