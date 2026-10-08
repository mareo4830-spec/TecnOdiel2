import { ProviderError } from '../http.ts';
import type { IntegrationProvider, Step, StepContext } from '../types.ts';

/** Integraciones sin las que la web no funciona. OneSignal y GSC pueden completarse después. */
const REQUIRED: IntegrationProvider[] = ['supabase', 'vercel', 'dns'];

/**
 * Paso 7 · go-live. Activa el negocio y su dominio en el SaaS y pasa el tenant a `live`
 * (la BD rechaza el cambio si falta un dato obligatorio o el cobro inicial). El pipeline fija
 * después la renovación del mantenimiento y avisa a los socios.
 */
export const goLiveStep: Step = {
  name: 'go-live',
  provider: null,
  async run(ctx: StepContext) {
    const { tenant, integrations } = ctx;
    const places = integrations.places?.status;
    if (places !== 'ok' && places !== 'skipped') throw new ProviderError('go-live', 'El paso places no está completado');
    const notReady = REQUIRED.filter((p) => integrations[p]?.status !== 'ok');
    if (notReady.includes('dns') && notReady.length === 1) {
      return { status: 'pending', detail: 'Esperando a que el DNS propague y Vercel verifique el dominio' };
    }
    if (notReady.length) throw new ProviderError('go-live', `Pasos sin completar: ${notReady.join(', ')}`);
    if (!tenant.saas_business_id || !tenant.domain) throw new ProviderError('go-live', 'Falta el negocio del SaaS o el dominio');

    // Se comprueba antes de activar nada en el SaaS para no dejarlo a medias.
    const missing = await ctx.missingRequirements();
    if (missing.length) throw new ProviderError('go-live', `No se puede pasar a live: falta ${missing.join(', ')}`);

    const saas = ctx.saas();
    await saas.activateDomain(tenant.saas_business_id, tenant.domain);
    await saas.updateBusiness(tenant.saas_business_id, { status: 'active' });

    const pendingExtras = (['onesignal', 'gsc'] as const).filter((p) => !['ok', 'skipped'].includes(integrations[p]?.status));
    return {
      status: 'ok',
      tenantPatch: { status: 'live' },
      detail: `https://${tenant.domain} en producción${pendingExtras.length ? ` · pendiente de completar: ${pendingExtras.join(', ')}` : ''}`,
    };
  },
};
