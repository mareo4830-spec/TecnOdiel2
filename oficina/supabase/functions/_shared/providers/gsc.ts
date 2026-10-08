import { ensureTxt } from '../dns/records.ts';
import { requireSecret } from '../env.ts';
import { serviceAccountToken } from '../google/serviceAccount.ts';
import { apiErrorMessage, fetchJson, type FetchFn, ProviderError } from '../http.ts';
import type { Step, StepContext } from '../types.ts';

const SV = 'https://www.googleapis.com/siteVerification/v1';
const WM = 'https://www.googleapis.com/webmasters/v3';

interface WebResource {
  id: string;
  site: { type: string; identifier: string };
  owners: string[];
}

export const scDomain = (domain: string) => `sc-domain:${domain}`;
export const sitePath = (domain: string) => `${WM}/sites/${encodeURIComponent(scDomain(domain))}`;

const auth = (token: string) => ({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });

/**
 * El SaaS sirve hoy un sitemap.xml estático con las URLs del tenant heredado. Solo se envía a
 * Search Console si el sitemap que sirve el dominio es realmente de ese dominio.
 */
async function sitemapFor(domain: string, fetchFn: FetchFn): Promise<{ url: string } | { skip: string }> {
  const url = `https://${domain}/sitemap.xml`;
  try {
    const res = await fetchFn(url, { redirect: 'follow' });
    const body = await res.text();
    if (!res.ok) return { skip: `${url} responde HTTP ${res.status}` };
    const own = new RegExp(`<loc>\\s*https?://(www\\.)?${domain.replace(/\./g, '\\.')}[/<]`, 'i');
    if (!own.test(body)) return { skip: `${url} no contiene URLs de ${domain} (el SaaS aún sirve un sitemap estático común)` };
    return { url };
  } catch (e) {
    return { skip: `${url} no accesible todavía (${e instanceof Error ? e.message : String(e)})` };
  }
}

/**
 * Paso 6 · gsc. Token DNS_TXT de Site Verification → TXT por el adaptador DNS → verify →
 * propiedad sc-domain: en Search Console → sitemap → GSC_OWNER_EMAIL como propietario.
 * Si el TXT no ha propagado queda en `pending`.
 */
export const gscStep: Step = {
  name: 'gsc',
  provider: 'gsc',
  async run(ctx: StepContext) {
    const { tenant } = ctx;
    const domain = tenant.domain;
    if (!domain) throw new ProviderError('gsc', 'El tenant no tiene dominio');
    const ownerEmail = requireSecret(ctx.env, 'GSC_OWNER_EMAIL').toLowerCase();
    const { token } = await serviceAccountToken(ctx.env, ctx.fetch, ctx.now());
    const prev = ctx.integrations.gsc?.meta ?? {};
    const site = { type: 'INET_DOMAIN', identifier: domain };

    // 1. Verificación de la propiedad (una sola vez).
    let resourceId = typeof prev.webResourceId === 'string' ? prev.webResourceId : null;
    let txtNote = '';
    if (!resourceId) {
      const tokenRes = await fetchJson<{ token: string }>(ctx.fetch, `${SV}/token`, {
        method: 'POST',
        headers: auth(token),
        body: JSON.stringify({ site, verificationMethod: 'DNS_TXT' }),
      });
      if (!tokenRes.ok) throw new ProviderError('gsc', `getToken: ${apiErrorMessage(tokenRes.data, tokenRes.status)}`, tokenRes.status);
      const txt = tokenRes.data.token;

      if (tenant.dns_provider) {
        const dns = ctx.dns(tenant.dns_provider);
        const change = await ensureTxt(dns, await dns.findZone(domain), domain, txt);
        txtNote = change.action === 'create' ? 'TXT creado' : 'TXT ya presente';
      } else {
        txtNote = `Sin proveedor DNS: crea a mano TXT ${domain} → ${txt}`;
      }

      const verify = await fetchJson<WebResource>(ctx.fetch, `${SV}/webResource?verificationMethod=DNS_TXT`, {
        method: 'POST',
        headers: auth(token),
        body: JSON.stringify({ site }),
      });
      if (!verify.ok) {
        // Google responde 400 mientras el TXT no se ve: se reintenta más tarde.
        if (verify.status === 400) {
          return {
            status: 'pending',
            meta: { txt, verified: false },
            detail: `${txtNote} · esperando a que Google vea el TXT (${apiErrorMessage(verify.data, verify.status)})`,
          };
        }
        throw new ProviderError('gsc', `verify: ${apiErrorMessage(verify.data, verify.status)}`, verify.status);
      }
      resourceId = verify.data.id;
    }

    // 2. Propietario humano en la verificación (ve la propiedad en Search Console).
    const resUrl = `${SV}/webResource/${encodeURIComponent(resourceId)}`;
    const current = await fetchJson<WebResource>(ctx.fetch, resUrl, { headers: auth(token) });
    if (!current.ok) throw new ProviderError('gsc', `leer la verificación: ${apiErrorMessage(current.data, current.status)}`, current.status);
    let ownerNote = `${ownerEmail} ya era propietario`;
    if (!current.data.owners.map((o) => o.toLowerCase()).includes(ownerEmail)) {
      const upd = await fetchJson(ctx.fetch, resUrl, {
        method: 'PUT',
        headers: auth(token),
        body: JSON.stringify({ site: current.data.site, owners: [...current.data.owners, ownerEmail] }),
      });
      if (!upd.ok) throw new ProviderError('gsc', `añadir propietario: ${apiErrorMessage(upd.data, upd.status)}`, upd.status);
      ownerNote = `${ownerEmail} añadido como propietario`;
    }

    // 3. Propiedad de dominio en Search Console (PUT es idempotente).
    const add = await fetchJson(ctx.fetch, sitePath(domain), { method: 'PUT', headers: auth(token) });
    if (!add.ok) throw new ProviderError('gsc', `sites.add: ${apiErrorMessage(add.data, add.status)}`, add.status);

    // 4. Sitemap: mejor esfuerzo, no bloquea el paso.
    const sm = await sitemapFor(domain, ctx.fetch);
    let sitemapNote: string;
    if ('url' in sm) {
      const sub = await fetchJson(ctx.fetch, `${sitePath(domain)}/sitemaps/${encodeURIComponent(sm.url)}`, { method: 'PUT', headers: auth(token) });
      sitemapNote = sub.ok ? `sitemap enviado (${sm.url})` : `sitemap no enviado: ${apiErrorMessage(sub.data, sub.status)}`;
    } else {
      sitemapNote = `sitemap omitido: ${sm.skip}`;
    }

    return {
      status: 'ok',
      externalId: scDomain(domain),
      meta: { webResourceId: resourceId, verified: true, owner: ownerEmail, sitemap: sitemapNote },
      detail: [txtNote, 'propiedad verificada', ownerNote, `${scDomain(domain)} en Search Console`, sitemapNote].filter(Boolean).join(' · '),
    };
  },
};
