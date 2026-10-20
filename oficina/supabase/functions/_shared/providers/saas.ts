import { displayHours } from '../hours.ts';
import { ProviderError } from '../http.ts';
import { defaultServices } from '../saas/defaultServices.ts';
import type { SaasBarber, SaasBusiness, SaasBusinessWrite, SaasGateway, SaasService } from '../saas/gateway.ts';
import { designTokensFromContent, initials, instagramHandle, parseSiteContent, publicConfigFromContent } from '../siteContent.ts';
import type { Step, StepContext, Tenant } from '../types.ts';

/** Marca en public_config para reconocer el negocio creado por este tenant al reintentar. */
export const TENANT_MARKER = 'virtualdesk_tenant_id';


function slugBase(name: string): string {
  return (
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 24) || 'profesional'
  );
}

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
    // La web propia de Adrián Millán (classic) tiene su contenido en el SaaS: no se pisa.
    const legacy = tenant.layout === 'classic';
    const content = parseSiteContent(legacy ? {} : tenant.site_content);
    const socials = tenant.socials ?? {};

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
      instagram: instagramHandle(socials.instagram),
      socials,
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
      // Contenido de la portada: presentación, fotos, reseñas y preguntas.
      ...(legacy ? {} : publicConfigFromContent(content)),
      ...(!legacy && !content.reviewUrl && socials.google ? { reviewUrl: socials.google } : {}),
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
      ...(legacy ? {} : { design_tokens: designTokensFromContent(content) }),
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

    // Servicios: los de la ficha del tenant o, si no hay, los de por defecto del tipo de negocio.
    // Solo se crean si el negocio aún no tiene ninguno (después los gestiona desde su panel).
    let services = 'ya tenía servicios';
    const own: SaasService[] = content.services.map((sv, i) => ({
      business_id: businessId,
      name: sv.name,
      price: sv.price,
      duration: `${sv.minutes}min`,
      duration_minutes: sv.minutes,
      icon: 'scissors',
      sort_order: i,
    }));
    const seeds = own.length ? own : defaultServices(businessId, tenant.business_type);
    if (!seeds.length) services = 'sin servicios por defecto para este tipo';
    else if ((await saas.countServices(businessId)) === 0) {
      await saas.insertServices(seeds);
      services = own.length ? `${seeds.length} servicios de la ficha` : `${seeds.length} servicios por defecto`;
    }

    // Equipo: igual, solo en el primer volcado.
    let team = '';
    if (content.team.length && (await saas.countBarbers(businessId)) === 0) {
      const suffix = businessId.slice(0, 4);
      const rows: SaasBarber[] = content.team.map((m, i) => ({
        id: `${slugBase(m.name)}-${suffix}${i ? `-${i}` : ''}`,
        business_id: businessId,
        name: m.name,
        role: m.role,
        initials: initials(m.name),
        photo_url: m.photoUrl,
        sort_order: i,
      }));
      await saas.insertBarbers(rows);
      team = ` · equipo: ${rows.length}`;
    }

    // Dueño con acceso al panel de administración del negocio.
    let owner = '';
    if (content.owner) {
      await saas.grantOwner(businessId, content.owner.email, content.owner.name);
      owner = ` · admin: ${content.owner.email}`;
    }

    return {
      status: 'ok',
      externalId: businessId,
      tenantPatch: { saas_business_id: businessId },
      meta: { layout_variant: variant, plan_code: plan.saas_plan_code },
      detail: `Negocio ${action} (${businessId})${domainResult ? ` · ${tenant.domain}: ${domainResult}` : ' · sin dominio propio todavía'} · ${services}${team}${owner}`,
    };
  },
};
