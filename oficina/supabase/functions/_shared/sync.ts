import { requireSecret } from './env.ts';
import { serviceAccountToken } from './google/serviceAccount.ts';
import { apiErrorMessage, fetchJson, HttpError, ProviderError } from './http.ts';
import type { PipelineDeps } from './pipeline.ts';
import { sitePath } from './providers/gsc.ts';
import { getOneSignalApp } from './providers/onesignal.ts';
import type { Integration, IntegrationProvider } from './types.ts';
import { createVercelClient } from './vercel/client.ts';

export interface SyncReport {
  provider: IntegrationProvider;
  ok: boolean;
  summary: string;
  data?: Record<string, unknown>;
}

const isoDay = (d: Date) => d.toISOString().slice(0, 10);

/**
 * Refresca el estado real de un tenant sin re-provisionar: dominio y SSL en Vercel, DNS,
 * suscriptores de OneSignal y clics/impresiones de Search Console (28 días). Guarda el
 * resultado en meta.sync de cada integración. Si el DNS que estaba pendiente ya propaga,
 * lo marca como ok para que el siguiente provisionado pueda salir a live.
 */
export async function syncTenant(tenantId: string, actor: string, deps: PipelineDeps): Promise<SyncReport[]> {
  const { repo } = deps;
  const now = deps.now ?? (() => new Date());
  const bundle = await repo.load(tenantId);
  if (!bundle) throw new HttpError(404, 'Tenant no encontrado');
  const { tenant, integrations } = bundle;
  const reports: SyncReport[] = [];

  async function record(provider: IntegrationProvider, fn: () => Promise<{ summary: string; data: Record<string, unknown>; status?: Integration['status'] }>) {
    const at = now().toISOString();
    const prev = integrations[provider];
    try {
      const { summary, data, status } = await fn();
      await repo.updateIntegration(tenantId, provider, {
        ...(status ? { status, error: null } : {}),
        meta: { ...prev.meta, sync: { at, ...data } },
        last_sync_at: at,
      });
      reports.push({ provider, ok: true, summary, data });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      await repo.updateIntegration(tenantId, provider, { meta: { ...prev.meta, sync: { at, error: message } }, last_sync_at: at });
      reports.push({ provider, ok: false, summary: message });
    }
  }

  const domain = tenant.domain;
  const active = (p: IntegrationProvider) => ['ok', 'pending'].includes(integrations[p].status);

  if (domain && active('vercel')) {
    const vercel = createVercelClient(deps.env, deps.fetch);
    const names = [domain, `www.${domain}`];
    let allReady = true;
    const state: Record<string, unknown> = {};
    await record('vercel', async () => {
      for (const name of names) {
        const [d, c] = await Promise.all([vercel.getProjectDomain(name), vercel.getDomainConfig(name)]);
        const ready = Boolean(d?.verified) && !c.misconfigured;
        allReady &&= ready;
        state[name] = { verified: d?.verified ?? false, misconfigured: c.misconfigured, configuredBy: c.configuredBy, ssl: ready };
      }
      return { summary: allReady ? 'dominio verificado y SSL disponible' : 'dominio aún sin verificar o mal configurado', data: { domains: state } };
    });
    if (active('dns')) {
      await record('dns', async () => ({
        summary: allReady ? 'DNS propagado' : 'DNS aún sin propagar',
        data: { vercel: state },
        ...(allReady && integrations.dns.status === 'pending' ? { status: 'ok' as const } : {}),
      }));
    }
  }

  const appId = integrations.onesignal.external_id;
  if (appId && active('onesignal')) {
    await record('onesignal', async () => {
      const app = await getOneSignalApp(appId, requireSecret(deps.env, 'ONESIGNAL_USER_AUTH_KEY'), deps.fetch);
      if (!app) throw new ProviderError('onesignal', `La app ${appId} ya no existe en OneSignal`);
      return {
        summary: `${app.messageable_players ?? 0} suscriptores activos`,
        data: { subscribers: app.players ?? 0, messageable: app.messageable_players ?? 0 },
      };
    });
  }

  if (domain && integrations.gsc.status === 'ok') {
    await record('gsc', async () => {
      const { token } = await serviceAccountToken(deps.env, deps.fetch, now());
      const end = now();
      const start = new Date(end.getTime() - 27 * 86_400_000);
      const res = await fetchJson<{ rows?: { clicks: number; impressions: number; ctr: number; position: number }[] }>(
        deps.fetch,
        `${sitePath(domain)}/searchAnalytics/query`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ startDate: isoDay(start), endDate: isoDay(end), dataState: 'all' }),
        },
      );
      if (!res.ok) throw new ProviderError('gsc', `searchAnalytics: ${apiErrorMessage(res.data, res.status)}`, res.status);
      const row = res.data.rows?.[0] ?? { clicks: 0, impressions: 0, ctr: 0, position: 0 };
      return {
        summary: `${row.clicks} clics · ${row.impressions} impresiones (28 días)`,
        data: { from: isoDay(start), to: isoDay(end), clicks: row.clicks, impressions: row.impressions, ctr: row.ctr, position: row.position },
      };
    });
  }

  await repo.log({
    tenantId,
    step: 'sync',
    ok: reports.every((r) => r.ok),
    detail: reports.length ? reports.map((r) => `${r.provider}: ${r.summary}`).join(' · ') : 'Nada que sincronizar todavía',
    actor,
  });
  return reports;
}
