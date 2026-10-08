import { requireSecret } from '../env.ts';
import { apiErrorMessage, fetchJson, type FetchFn, ProviderError } from '../http.ts';
import type { Step, StepContext } from '../types.ts';

const API = 'https://api.onesignal.com';

interface OneSignalApp {
  id: string;
  name: string;
  chrome_web_origin?: string | null;
  players?: number;
  messageable_players?: number;
}

export function oneSignalHeaders(orgKey: string) {
  return { Authorization: `Key ${orgKey}`, 'Content-Type': 'application/json', Accept: 'application/json' };
}

export async function getOneSignalApp(appId: string, orgKey: string, fetchFn: FetchFn): Promise<OneSignalApp | null> {
  const res = await fetchJson<OneSignalApp>(fetchFn, `${API}/apps/${appId}`, { headers: oneSignalHeaders(orgKey) });
  if (res.status === 404) return null;
  if (!res.ok) throw new ProviderError('onesignal', `leer la app ${appId}: ${apiErrorMessage(res.data, res.status)}`, res.status);
  return res.data;
}

/** Busca una app ya creada para este origen (por si se perdió el id tras un fallo a medias). */
async function findAppByOrigin(origin: string, orgKey: string, fetchFn: FetchFn): Promise<OneSignalApp | null> {
  const res = await fetchJson<OneSignalApp[]>(fetchFn, `${API}/apps`, { headers: oneSignalHeaders(orgKey) });
  if (!res.ok) throw new ProviderError('onesignal', `listar apps: ${apiErrorMessage(res.data, res.status)}`, res.status);
  return (Array.isArray(res.data) ? res.data : []).find((a) => a.chrome_web_origin?.replace(/\/$/, '') === origin) ?? null;
}

/**
 * Paso 5 · onesignal. Crea la app web del tenant (una sola vez), escribe su app_id en
 * business_integrations del SaaS y guarda una REST API key de la app en Vault.
 */
export const oneSignalStep: Step = {
  name: 'onesignal',
  provider: 'onesignal',
  async run(ctx: StepContext) {
    const { tenant } = ctx;
    const businessId = tenant.saas_business_id;
    if (!businessId || !tenant.domain) throw new ProviderError('onesignal', 'Falta el paso supabase (negocio del SaaS) o el dominio');
    if (ctx.plan && ctx.plan.features.enable_pwa === false) {
      return { status: 'skipped', detail: `El plan ${ctx.plan.name} no incluye PWA ni notificaciones push` };
    }
    const orgKey = requireSecret(ctx.env, 'ONESIGNAL_USER_AUTH_KEY');
    const orgId = requireSecret(ctx.env, 'ONESIGNAL_ORGANIZATION_ID');
    const saas = ctx.saas();
    const origin = `https://${tenant.domain}`;

    // 1. App: la ya guardada (aquí o en el SaaS), una existente para este origen o una nueva.
    const known = await saas.getIntegration(businessId);
    const candidateId = ctx.integrations.onesignal?.external_id ?? known?.onesignal_app_id ?? null;
    let app = candidateId ? await getOneSignalApp(candidateId, orgKey, ctx.fetch) : null;
    let appAction = 'ya existía';
    if (!app) app = await findAppByOrigin(origin, orgKey, ctx.fetch);
    if (!app) {
      const icon = tenant.logo_url?.startsWith('https://') ? tenant.logo_url : undefined;
      const res = await fetchJson<OneSignalApp>(ctx.fetch, `${API}/apps`, {
        method: 'POST',
        headers: oneSignalHeaders(orgKey),
        body: JSON.stringify({
          name: `${tenant.name} (${tenant.slug})`,
          organization_id: orgId,
          site_name: tenant.name,
          chrome_web_origin: origin,
          safari_site_origin: origin,
          safari_apns_p12: '',
          safari_apns_p12_password: '',
          ...(icon ? { chrome_web_default_notification_icon: icon, safari_icon_256_256: icon } : {}),
        }),
      });
      if (!res.ok) throw new ProviderError('onesignal', `crear la app: ${apiErrorMessage(res.data, res.status)}`, res.status);
      app = res.data;
      appAction = 'creada';
    }

    await saas.upsertIntegration(businessId, { onesignal_app_id: app.id, site_url: origin });

    // 2. REST API key: solo se devuelve al crearla, así que se guarda en Vault en el acto.
    let keyAction = 'REST key ya en Vault';
    if (!known?.onesignal_api_key_secret) {
      const res = await fetchJson<{ token_id: string; formatted_token: string }>(ctx.fetch, `${API}/apps/${app.id}/auth/tokens`, {
        method: 'POST',
        headers: oneSignalHeaders(orgKey),
        body: JSON.stringify({ name: 'virtualdesk-provision', ip_allowlist_mode: 'disabled' }),
      });
      if (!res.ok || !res.data?.formatted_token) {
        throw new ProviderError('onesignal', `crear la REST API key: ${apiErrorMessage(res.data, res.status)}`, res.status);
      }
      const secretName = await saas.storeSecret(businessId, 'onesignal', res.data.formatted_token);
      keyAction = `REST key guardada en Vault (${secretName})`;
    }

    return {
      status: 'ok',
      externalId: app.id,
      meta: { appId: app.id, origin },
      detail: `App ${appAction} (${app.id}) · ${keyAction}`,
    };
  },
};
