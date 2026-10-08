import { ProviderError } from '../http.ts';
import type { Step, StepContext } from '../types.ts';
import { createVercelClient } from '../vercel/client.ts';
import { ensureDomain } from './saas.ts';
import { ensureProjectDomain } from './vercel.ts';

/**
 * Paso 3 · preview. Da de alta el host de preview del tenant (<slug>-<sufijo>.vercel.app o
 * <slug>.<dominio de la agencia>) en el proyecto de Vercel del SaaS y en business_domains como
 * activo, para ver la web real antes de tener dominio propio.
 *
 * Los .vercel.app son globales: si otro proyecto de Vercel ya tiene ese nombre, Vercel responde
 * 409 y el error pide cambiar el slug o el sufijo del proyecto.
 */
export const previewStep: Step = {
  name: 'preview',
  provider: 'preview',
  async run(ctx: StepContext) {
    const { tenant } = ctx;
    if (!tenant.preview_host) return { status: 'skipped', detail: 'El tenant no tiene host de preview' };
    if (!tenant.saas_business_id) throw new ProviderError('preview', 'El negocio aún no existe en el SaaS (paso supabase)');

    const vercel = createVercelClient(ctx.env, ctx.fetch);
    const added = await ensureProjectDomain(vercel, tenant.preview_host);
    const inSaas = await ensureDomain(ctx.saas(), tenant.saas_business_id, tenant.preview_host, false, true);

    return {
      status: 'ok',
      externalId: tenant.preview_host,
      meta: { previewUrl: `https://${tenant.preview_host}`, verified: added.domain.verified },
      detail: `${added.created ? 'Añadido' : 'Ya estaba'} ${tenant.preview_host} en Vercel · business_domains: ${inSaas}`,
    };
  },
};
