import { designTokensFromContent, instagramHandle, parseSiteContent, publicConfigFromContent } from '../../../supabase/functions/_shared/siteContent';
import type { SiteContent } from '../../types';
import { hoursSummary } from './components/HoursEditor';
import { effectiveVariant, SAAS_DEMO_URL } from './tenantMeta';
import type { SiteData } from './tenantSite';

/**
 * Vista previa en vivo con la portada real del SaaS: un iframe a la demo con ?preview=live al que se
 * le manda por postMessage lo que se está editando. Usa las mismas funciones que el provisionado
 * (siteContent.ts), así que lo que se ve es lo que tendrá el negocio al crearlo.
 */
export const LIVE_PREVIEW_URL = `${SAAS_DEMO_URL}/?preview=live`;
export const LIVE_PREVIEW_ORIGIN = new URL(SAAS_DEMO_URL).origin;
export const LIVE_PREVIEW_READY = 'saas-live-preview-ready';

export function livePreviewMessage(data: SiteData, content: SiteContent | undefined): Record<string, unknown> {
  const c = parseSiteContent(content ?? {});
  const v = effectiveVariant(data.layout ?? 'barber', data.layoutVariant);
  return {
    type: 'saas-live-preview',
    name: data.name.trim() || 'Tu negocio',
    variant: v.key,
    tokens: designTokensFromContent(c),
    publicConfig: {
      ...publicConfigFromContent(c),
      tagline: data.tagline,
      hours: data.openingHours ? hoursSummary(data.openingHours) : null,
      brand: { shortName: data.name.trim() || null, logoUrl: data.logoUrl },
    },
    contact: {
      phone: data.phone,
      whatsapp: data.whatsapp,
      instagram: instagramHandle(data.socials.instagram),
      address: data.address,
    },
    services: c.services,
    team: c.team,
  };
}
