import { createStore, useStore } from '../../lib/store';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import type { IntegrationProvider, OpeningHours, PartnerId, TenantIntegration } from '../../types';
import { logActivity } from '../activity/activityService';
import { postChatAviso } from '../chat/chatService';
import { PIPELINE_STEPS, PREVIEW_STEPS, type PipelineStep, REQUIREMENT_LABEL } from './tenantMeta';
import {
  appendLog,
  getIntegrations,
  getMissingRequirements,
  getPlan,
  getTenant,
  patchIntegration,
  previewMissing,
  setRenewalIfMissing,
  updateTenant,
} from './tenantService';

/*
 * Provisionado desde la UI.
 *
 * Con Supabase: POST a la Edge Function `provision-tenant` ({ tenantId, force }) y la ficha
 * escucha por Realtime tenant_integrations y provisioning_log del tenant.
 * En modo demo (sin Supabase, y mientras los tenants vivan en memoria) se simula aquí el mismo
 * orquestador de la fase 3: pasos idempotentes, DNS que tarda en propagar (pending), parada en
 * el primer error y reintento desde ese paso. Escribe en los mismos stores que leería Realtime.
 */

export class ProvisioningError extends Error {}

/** Tenants con un provisionado en marcha (reactivo: la UI desactiva el botón mientras dura). */
const runningStore = createStore<ReadonlySet<string>>(new Set());
export const useIsProvisioning = (tenantId: string) => useStore(runningStore, (set) => set.has(tenantId));
const setRunning = (tenantId: string, on: boolean) =>
  runningStore.set((prev) => {
    const next = new Set(prev);
    if (on) next.add(tenantId);
    else next.delete(tenantId);
    return next;
  });

/** En la demo el DNS "propaga" 20 s después de crear los registros. */
const DNS_PROPAGATION_MS = 20_000;
const dnsReadyAt = new Map<string, number>([['t-norte', Date.now() + DNS_PROPAGATION_MS]]);
const propagated = (tenantId: string) => (dnsReadyAt.get(tenantId) ?? Infinity) <= Date.now();

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const shortId = (id: string) => `${id.slice(0, 8)}…`;

interface Outcome {
  status: 'ok' | 'pending' | 'skipped';
  detail: string;
  externalId?: string | null;
  meta?: Record<string, unknown>;
}

async function runStep(step: PipelineStep, tenantId: string, actor: PartnerId): Promise<Outcome> {
  const t = getTenant(tenantId)!;
  const integ = Object.fromEntries(getIntegrations(tenantId).map((i) => [i.provider, i])) as Record<IntegrationProvider, TenantIntegration>;
  switch (step) {
    case 'places': {
      if (!t.googleMapsUrl && !t.googlePlaceId) {
        return { status: 'skipped', detail: 'Sin URL de Google Maps: se usan la dirección y el horario introducidos a mano' };
      }
      const place = await lookupPlace(t.googleMapsUrl ?? '', t.name);
      const filled: string[] = [];
      const patch: Parameters<typeof updateTenant>[1] = { googlePlaceId: t.googlePlaceId ?? place.placeId };
      if (!t.address?.trim()) {
        patch.address = place.address;
        filled.push('dirección');
      }
      if (t.lat === null || t.lng === null) {
        patch.lat = place.lat;
        patch.lng = place.lng;
        filled.push('coordenadas');
      }
      if (!t.openingHours || !Object.keys(t.openingHours).length) {
        patch.openingHours = place.openingHours;
        filled.push('horario');
      }
      updateTenant(tenantId, patch);
      return {
        status: 'ok',
        externalId: patch.googlePlaceId,
        detail: `${t.name} (${patch.googlePlaceId})${filled.length ? ` · rellenado: ${filled.join(', ')}` : ' · datos manuales conservados'}`,
      };
    }
    case 'supabase': {
      const id = t.saasBusinessId ?? crypto.randomUUID();
      const created = integ.supabase.status !== 'ok';
      updateTenant(tenantId, { saasBusinessId: id });
      const parts = [`Negocio ${created ? 'creado' : 'actualizado'} con business_id ${shortId(id)}`];
      if (t.domain) parts.push(`${t.domain}: pending`);
      if (created) parts.push('servicios por defecto');
      return { status: 'ok', externalId: id, detail: parts.join(' · ') };
    }
    case 'preview': {
      if (!t.previewHost) return { status: 'skipped', detail: 'Sin host de preview' };
      const already = integ.preview.status === 'ok' && integ.preview.externalId === t.previewHost;
      return {
        status: 'ok',
        externalId: t.previewHost,
        meta: { previewUrl: `https://${t.previewHost}` },
        detail: `${already ? 'Ya estaba' : 'Añadido'} ${t.previewHost} en Vercel · activo en business_domains`,
      };
    }
    case 'vercel': {
      const records = [
        { type: 'A', name: t.domain, content: '76.76.21.21', purpose: 'apex' },
        { type: 'CNAME', name: `www.${t.domain}`, content: 'cname.vercel-dns-017.com', purpose: 'www' },
      ];
      return {
        status: 'ok',
        externalId: t.domain,
        meta: { dnsRecords: records },
        detail: `Dominios en Vercel: ${t.domain}, www.${t.domain} (redirige) · DNS requerido: ${records.map((r) => `${r.type} ${r.name} → ${r.content}`).join('; ')}`,
      };
    }
    case 'dns': {
      if (!dnsReadyAt.has(tenantId)) dnsReadyAt.set(tenantId, Date.now() + DNS_PROPAGATION_MS);
      const records = (integ.vercel.meta.dnsRecords ?? []) as { type: string; name: string; content: string }[];
      const list = records.map((r) => `${r.type} ${r.name} → ${r.content}`).join('; ');
      if (!t.dnsProvider) {
        return propagated(tenantId)
          ? { status: 'ok', externalId: t.domain, meta: { manual: true }, detail: 'DNS manual correcto · Vercel verificado' }
          : { status: 'pending', externalId: t.domain, meta: { manual: true, records }, detail: `Sin proveedor DNS: crea a mano ${list} y reintenta` };
      }
      return propagated(tenantId)
        ? { status: 'ok', externalId: t.domain, meta: { provider: t.dnsProvider }, detail: `${list} · Vercel verificado` }
        : {
            status: 'pending',
            externalId: t.domain,
            meta: { provider: t.dnsProvider, records },
            detail: `${list} · esperando propagación en ${t.domain}`,
          };
    }
    case 'onesignal': {
      if (getPlan(t.planId)?.features.enable_pwa === false) return { status: 'skipped', detail: 'El plan no incluye PWA ni push' };
      const appId = integ.onesignal.externalId ?? crypto.randomUUID();
      return {
        status: 'ok',
        externalId: appId,
        meta: { appId, origin: `https://${t.domain}` },
        detail: `App ${integ.onesignal.externalId ? 'ya existía' : 'creada'} (${shortId(appId)}) · REST key guardada en Vault`,
      };
    }
    case 'gsc':
      return propagated(tenantId)
        ? {
            status: 'ok',
            externalId: `sc-domain:${t.domain}`,
            meta: { verified: true },
            detail: `TXT creado · propiedad verificada · sc-domain:${t.domain} en Search Console · sitemap omitido: el SaaS aún sirve un sitemap estático común`,
          }
        : { status: 'pending', meta: { verified: false }, detail: 'TXT creado · esperando a que Google vea el TXT' };
    case 'go-live': {
      if (integ.dns.status !== 'ok') return { status: 'pending', detail: 'Esperando a que el DNS propague y Vercel verifique el dominio' };
      const missing = getMissingRequirements(tenantId);
      if (missing.length) throw new ProvisioningError(`No se puede pasar a live: falta ${missing.map((m) => REQUIREMENT_LABEL[m]).join(', ')}`);
      const wasLive = t.status === 'live';
      updateTenant(tenantId, { status: 'live' });
      setRenewalIfMissing(tenantId);
      if (!wasLive) {
        logActivity({ type: 'deploy', partnerId: actor, projectId: t.projectId, action: `puso en producción «${t.name}» en`, detail: `https://${t.domain}` });
        postChatAviso(`🚀 ${t.name} ya está en producción: https://${t.domain}`, t.projectId, actor);
      }
      return { status: 'ok', detail: `https://${t.domain} en producción` };
    }
  }
}

export interface ProvisionResult {
  status: 'live' | 'pending' | 'error' | 'preview';
  failedStep?: PipelineStep;
}

/**
 * Crea (o actualiza) la preview: negocio en la BD del SaaS con su business_id y host
 * <slug>-<sufijo>.vercel.app en Vercel. No exige dominio, horario ni cobro; no cambia el estado.
 */
export async function createPreview(tenantId: string, actor: PartnerId): Promise<ProvisionResult> {
  const tenant = getTenant(tenantId);
  if (!tenant) throw new ProvisioningError('Tenant no encontrado');
  const missing = previewMissing(tenant);
  if (missing.length) throw new ProvisioningError(`Para la preview falta: ${missing.map((m) => REQUIREMENT_LABEL[m]).join(', ')}`);
  if (runningStore.get().has(tenantId)) throw new ProvisioningError('Ya hay un provisionado en curso para este tenant');

  setRunning(tenantId, true);
  try {
    appendLog({ tenantId, step: 'start', ok: true, detail: `Preview solicitada por ${actor}`, actor });
    for (const step of PREVIEW_STEPS) {
      const current = getIntegrations(tenantId).find((i) => i.provider === step);
      patchIntegration(tenantId, step, { status: 'running', error: null });
      await sleep(600 + Math.random() * 500);
      try {
        const out = await runStep(step, tenantId, actor);
        patchIntegration(tenantId, step, {
          status: out.status,
          externalId: out.externalId ?? current?.externalId ?? null,
          meta: { ...(current?.meta ?? {}), ...(out.meta ?? {}) },
          error: null,
          lastSyncAt: new Date().toISOString(),
        });
        appendLog({ tenantId, step, ok: true, detail: out.detail, actor });
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        patchIntegration(tenantId, step, { status: 'error', error: message, lastSyncAt: new Date().toISOString() });
        appendLog({ tenantId, step, ok: false, detail: message, actor });
        return { status: 'error', failedStep: step };
      }
    }
    return { status: 'preview' };
  } finally {
    setRunning(tenantId, false);
  }
}

/**
 * Lanza el provisionado. Resuelve al terminar; mientras tanto la UI ve el avance en los stores.
 * `force` repite pasos que ya estaban en ok (p. ej. "Reintentar" en una tarjeta).
 */
export async function provisionTenant(tenantId: string, actor: PartnerId, force: IntegrationProvider[] = []): Promise<ProvisionResult> {
  const tenant = getTenant(tenantId);
  if (!tenant) throw new ProvisioningError('Tenant no encontrado');
  const missing = getMissingRequirements(tenantId);
  if (missing.length) throw new ProvisioningError(`Faltan datos para provisionar: ${missing.map((m) => REQUIREMENT_LABEL[m]).join(', ')}`);
  if (runningStore.get().has(tenantId)) throw new ProvisioningError('Ya hay un provisionado en curso para este tenant');

  setRunning(tenantId, true);
  const wasLive = tenant.status === 'live';
  try {
    appendLog({ tenantId, step: 'start', ok: true, detail: `Provisionado iniciado por ${actor}`, actor });
    if (!wasLive) updateTenant(tenantId, { status: 'provisioning' });

    for (const step of PIPELINE_STEPS) {
      const provider = step === 'go-live' ? null : step;
      const current = provider ? getIntegrations(tenantId).find((i) => i.provider === provider) : null;
      if (provider && current && (current.status === 'ok' || current.status === 'skipped') && !force.includes(provider)) continue;

      if (provider) patchIntegration(tenantId, provider, { status: 'running', error: null });
      await sleep(700 + Math.random() * 700);

      try {
        const out = await runStep(step, tenantId, actor);
        if (provider) {
          patchIntegration(tenantId, provider, {
            status: out.status,
            externalId: out.externalId ?? current?.externalId ?? null,
            meta: { ...(current?.meta ?? {}), ...(out.meta ?? {}) },
            error: null,
            lastSyncAt: new Date().toISOString(),
          });
        }
        appendLog({ tenantId, step, ok: true, detail: out.status === 'pending' ? `En espera: ${out.detail}` : out.detail, actor });
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        if (provider) patchIntegration(tenantId, provider, { status: 'error', error: message, lastSyncAt: new Date().toISOString() });
        appendLog({ tenantId, step, ok: false, detail: message, actor });
        if (!wasLive) updateTenant(tenantId, { status: 'error' });
        return { status: 'error', failedStep: step };
      }
    }
    return { status: getTenant(tenantId)?.status === 'live' ? 'live' : 'pending' };
  } finally {
    setRunning(tenantId, false);
  }
}

/** Como la Edge Function sync-tenant: estado real y métricas, sin re-provisionar. */
export async function syncTenant(tenantId: string, actor: PartnerId): Promise<void> {
  const t = getTenant(tenantId);
  if (!t) return;
  await sleep(900);
  const integ = getIntegrations(tenantId);
  const now = new Date().toISOString();
  const parts: string[] = [];
  const ready = propagated(tenantId) || integ.find((i) => i.provider === 'dns')?.status === 'ok';

  for (const i of integ) {
    if (i.provider === 'vercel' && ['ok', 'pending'].includes(i.status)) {
      patchIntegration(tenantId, 'vercel', { meta: { ...i.meta, sync: { at: now, ssl: ready } }, lastSyncAt: now });
      parts.push(`vercel: ${ready ? 'dominio verificado y SSL disponible' : 'dominio aún sin verificar'}`);
    }
    if (i.provider === 'dns' && ['ok', 'pending'].includes(i.status)) {
      patchIntegration(tenantId, 'dns', { status: ready ? 'ok' : i.status, meta: { ...i.meta, sync: { at: now, propagated: ready } }, lastSyncAt: now });
      parts.push(`dns: ${ready ? 'DNS propagado' : 'DNS aún sin propagar'}`);
    }
    if (i.provider === 'onesignal' && i.status === 'ok') {
      const prev = (i.meta.sync as { messageable?: number } | undefined)?.messageable ?? 0;
      const messageable = prev + Math.floor(Math.random() * 6);
      patchIntegration(tenantId, 'onesignal', { meta: { ...i.meta, sync: { at: now, messageable, subscribers: messageable + 12 } }, lastSyncAt: now });
      parts.push(`onesignal: ${messageable} suscriptores activos`);
    }
    if (i.provider === 'gsc' && i.status === 'ok') {
      const prev = (i.meta.sync as { clicks?: number; impressions?: number } | undefined) ?? {};
      const clicks = (prev.clicks ?? 0) + Math.floor(Math.random() * 20);
      const impressions = (prev.impressions ?? 0) + Math.floor(Math.random() * 400);
      patchIntegration(tenantId, 'gsc', { meta: { ...i.meta, sync: { at: now, clicks, impressions } }, lastSyncAt: now });
      parts.push(`gsc: ${clicks} clics · ${impressions} impresiones (28 días)`);
    }
  }
  appendLog({ tenantId, step: 'sync', ok: true, detail: parts.join(' · ') || 'Nada que sincronizar todavía', actor });
}

// ---------------------------------------------------------------- Places (botón "Autocompletar")

export interface PlaceLookup {
  placeId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  openingHours: OpeningHours | null;
}

/**
 * Autocompletar desde la URL de Google Maps. La API key de Places nunca llega al navegador:
 * con Supabase se llama a la Edge Function `places-lookup`; en la demo se devuelve una ficha simulada.
 */
export async function lookupPlace(mapsUrl: string, nameHint: string): Promise<PlaceLookup> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.functions.invoke<PlaceLookup & { error?: string }>('places-lookup', { body: { mapsUrl } });
    if (error) {
      // Con respuestas no 2xx el motivo real viene en el cuerpo (p. ej. "Google no encuentra…").
      const body = await (error as { context?: Response }).context?.json?.().catch(() => null);
      throw new ProvisioningError(body?.error ?? error.message);
    }
    if (!data || data.error) throw new ProvisioningError(data?.error ?? 'Respuesta vacía de places-lookup');
    return data;
  }
  await sleep(800);
  if (!/^https?:\/\/(maps\.app\.goo\.gl|goo\.gl|(www\.)?google\.[a-z.]+\/maps|maps\.google\.[a-z.]+)/.test(mapsUrl)) {
    throw new ProvisioningError('Eso no parece una URL de Google Maps');
  }
  let h = 0;
  for (const c of mapsUrl) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const split: [string, string][] = [['09:30', '13:30'], ['16:30', '20:30']];
  return {
    placeId: `ChIJ_demo_${h.toString(36)}`,
    name: nameHint || 'Negocio de ejemplo',
    address: `Calle Rico ${(h % 40) + 1}, 21001 Huelva`,
    lat: Number((37.25 + (h % 200) / 10_000).toFixed(6)),
    lng: Number((-6.95 + (h % 300) / 10_000).toFixed(6)),
    openingHours: { mon: split, tue: split, wed: split, thu: split, fri: split, sat: [['09:30', '14:00']] },
  };
}
