import { displayHours } from '../hours.ts';
import { ProviderError } from '../http.ts';
import { defaultServices } from '../saas/defaultServices.ts';
import type { SaasBusiness, SaasBusinessWrite, SaasGateway } from '../saas/gateway.ts';
import type { Step, StepContext, Tenant } from '../types.ts';

/** Marca en public_config para reconocer el negocio creado por este tenant al reintentar. */
export const TENANT_MARKER = 'virtualdesk_tenant_id';


/** Negocio ya creado para este tenant: por id guardado o, si se perdió, por slug + marca. */
async function findExisting(saas: SaasGateway, tenant: Tenant): Promise<SaasBusiness | null> {
  if (tenant.saas_business_id) {
    const byId = await saas.findBusinessById(tenant.saas_business_id);
    if (byId) return byId;
  }
  const bySlug = await saas.findBusinessBySlug(tenant.slug);
  if (!bySlug) return null;
  if (bySlug.public_config?.[TENANT_MARKER] !== tenant.id) {
    throw new ProviderError('supabase', `El slug "${tenant.slug}" ya lo usa otro negocio del SaaS (${bySlug.name}). Cambia el slug del tenant.`);
  }
  return bySlug;
}

export async function ensureDomain(saas: SaasGateway, businessId: string, hostname: string, isPrimary: boolean, verified: boolean) {
  const existing = await saas.getDomain(hostname);
  if (existing) {
    if (existing.business_id !== businessId) {
      throw new ProviderError('supabase', `El dominio ${hostname} ya pertenece a otro negocio del SaaS`);
    }
    return 'ya estaba';
  }
  // El dominio del cliente entra en pending (lo activa el go-live). El de preview es nuestro
  // (.vercel.app o de la agencia): se da por verificado desde el alta.
  await saas.insertDomain({
    business_id: businessId,
    hostname,
    is_primary: isPrimary,
    status: verified ? 'active' : 'pending',
    verified_at: verified ? new Date().toISOString() : null,
  });
  return 'creado';
}

/**
 * Paso 2 · supabase. Upsert del negocio en el SaaS con el business_id del tenant, todos los datos
 * y las features del plan, alta del dominio del cliente (si lo hay) en business_domains y servicios
 * por defecto si no tiene. Sirve también para la preview: no exige dominio ni horario.
 */
export const saasStep: Step = {
  name: 'supabase',
  provider: 'supabase',
  async run(ctx: StepContext) {
    const { tenant, plan } = ctx;
    if (!plan) throw new ProviderError('supabase', 'El tenant no tiene plan');
    if (!tenant.layout || !tenant.business_type) {
      throw new ProviderError('supabase', 'Faltan el layout o el tipo de negocio');
    }
    const saas = ctx.saas();

    const existing = await findExisting(saas, tenant);
    const variant = tenant.layout_variant ?? (await saas.defaultVariant(tenant.layout));

    const contact = {
      ...(existing?.contact ?? {}),
      address: tenant.address,
      lat: tenant.lat,
      lng: tenant.lng,
      ...(tenant.google_maps_url ? { mapsUrl: tenant.google_maps_url } : {}),
      // Contacto público y redes: lo pinta la web del negocio.
      phone: tenant.phone,
      whatsapp: tenant.whatsapp,
      email: tenant.public_email,
      socials: tenant.socials ?? {},
    };
    const publicConfig: Record<string, unknown> = {
      ...(existing?.public_config ?? {}),
      [TENANT_MARKER]: tenant.id,
      business_type: tenant.business_type,
      opening_hours: tenant.opening_hours,
      // El frontend del SaaS pinta el horario desde `hours` (texto por día).
      ...(tenant.opening_hours ? { hours: displayHours(tenant.opening_hours) } : {}),
      google_place_id: tenant.google_place_id,
      ...(tenant.tagline ? { tagline: tenant.tagline } : {}),
    };
    if (tenant.logo_url) {
      publicConfig.brand = { ...((existing?.public_config?.brand as object) ?? {}), logoUrl: tenant.logo_url, shortName: tenant.name };
    }

    const row: SaasBusinessWrite = {
      slug: tenant.slug,
      name: tenant.name,
      layout_key: tenant.layout,
      layout_variant: variant,
      plan_code: plan.saas_plan_code,
      active_features: plan.features,
      contact,
      public_config: publicConfig,
    };

    let businessId: string;
    let action: string;
    if (existing) {
      businessId = existing.id;
      await saas.updateBusiness(businessId, row); // el status no se toca: lo cambia el go-live
      action = 'actualizado';
    } else {
      // Mismo id que el tenant fijó al darse de alta: todo en VirtualDesk lo referencia ya.
      businessId = await saas.insertBusiness({ ...row, ...(tenant.saas_business_id ? { id: tenant.saas_business_id } : {}), status: 'draft' });
      action = 'creado';
    }

    const domainResult = tenant.domain ? await ensureDomain(saas, businessId, tenant.domain, true, false) : null;

    let services = 'ya tenía servicios';
    const seeds = defaultServices(businessId, tenant.business_type);
    if (!seeds.length) services = 'sin servicios por defecto para este tipo';
    else if ((await saas.countServices(businessId)) === 0) {
      await saas.insertServices(seeds);
      services = `${seeds.length} servicios por defecto`;
    }

    return {
      status: 'ok',
      externalId: businessId,
      tenantPatch: { saas_business_id: businessId },
      meta: { layout_variant: variant, plan_code: plan.saas_plan_code },
      detail: `Negocio ${action} (${businessId})${domainResult ? ` · ${tenant.domain}: ${domainResult}` : ' · sin dominio propio todavía'} · ${services}`,
    };
  },
};
