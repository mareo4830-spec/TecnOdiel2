import { useMemo } from 'react';
import { iso, isoOrNull, num, numOrNull } from '../../lib/rows';
import { useStore } from '../../lib/store';
import { isSupabaseConfigured } from '../../lib/supabase';
import { createSyncedStore } from '../../lib/syncedStore';
import type {
  IntegrationProvider,
  PartnerId,
  PaymentMode,
  ProvisioningLogEntry,
  SaasPlan,
  Tenant,
  TenantBilling,
  TenantContact,
  TenantIntegration,
  TenantPayment,
  TenantRequirement,
} from '../../types';
import { logActivity } from '../activity/activityService';
import { PLANS } from './plans';
import { PROVIDERS } from './tenantMeta';

/*
 * Tenants de los proyectos SaaS: tablas tenants, tenant_contacts, tenant_billing, tenant_payments,
 * tenant_integrations, provisioning_log y plans.
 *
 * Con Supabase las reglas las aplica la BD (pagos generados desde la facturación, integraciones
 * creadas con el tenant, regla de go-live, unicidad de slug y dominio): este archivo solo lee y
 * escribe, y las comprobaciones de aquí son para avisar al instante. Las integraciones y el log
 * los escribe la Edge Function de provisionado: el navegador solo los lee. En la demo (sin
 * Supabase) se reproducen las mismas reglas en local.
 */
const remote = isSupabaseConfigured;

const plansStore = createSyncedStore<SaasPlan>(remote ? [] : PLANS, {
  table: 'plans',
  toRow: (p) => ({
    id: p.id,
    name: p.name,
    saas_plan_code: p.saasPlanCode,
    setup_price: p.setupPrice,
    yearly_maintenance: p.yearlyMaintenance,
    monthly_ai: p.monthlyAi,
    features: p.features,
  }),
  fromRow: (r) => ({
    id: r.id,
    name: r.name,
    saasPlanCode: r.saas_plan_code,
    setupPrice: num(r.setup_price),
    yearlyMaintenance: num(r.yearly_maintenance),
    monthlyAi: num(r.monthly_ai),
    features: r.features ?? {},
  }),
  sort: (a, b) => a.setupPrice - b.setupPrice || a.monthlyAi - b.monthlyAi,
  write: { insert: false, update: false, delete: false },
});

const tenantsStore = createSyncedStore<Tenant>([], {
  table: 'tenants',
  persistKey: 'tenants',
  toRow: (t) => ({
    id: t.id,
    project_id: t.projectId,
    client_id: t.clientId,
    saas_business_id: t.saasBusinessId,
    stage: t.stage,
    name: t.name,
    slug: t.slug,
    tagline: t.tagline,
    logo_url: t.logoUrl,
    business_type: t.businessType,
    layout: t.layout,
    layout_variant: t.layoutVariant,
    plan_id: t.planId,
    google_maps_url: t.googleMapsUrl,
    google_place_id: t.googlePlaceId,
    opening_hours: t.openingHours,
    address: t.address,
    lat: t.lat,
    lng: t.lng,
    domain: t.domain,
    dns_provider: t.dnsProvider,
    preview_host: t.previewHost,
    phone: t.phone,
    whatsapp: t.whatsapp,
    public_email: t.publicEmail,
    socials: t.socials,
    site_content: t.siteContent ?? {},
    status: t.status,
    waiting_client: t.waitingClient,
    meeting: t.meeting,
    board_order: t.boardOrder,
    created_by: t.createdBy,
    created_at: t.createdAt,
  }),
  fromRow: (r) => ({
    id: r.id,
    projectId: r.project_id,
    clientId: r.client_id ?? null,
    saasBusinessId: r.saas_business_id,
    stage: r.stage,
    name: r.name,
    slug: r.slug,
    tagline: r.tagline,
    logoUrl: r.logo_url,
    businessType: r.business_type,
    layout: r.layout,
    layoutVariant: r.layout_variant,
    planId: r.plan_id,
    googleMapsUrl: r.google_maps_url,
    googlePlaceId: r.google_place_id,
    openingHours: r.opening_hours,
    address: r.address,
    lat: numOrNull(r.lat),
    lng: numOrNull(r.lng),
    domain: r.domain,
    dnsProvider: r.dns_provider,
    previewHost: r.preview_host,
    phone: r.phone,
    whatsapp: r.whatsapp,
    publicEmail: r.public_email,
    socials: r.socials ?? {},
    siteContent: r.site_content ?? {},
    status: r.status,
    waitingClient: r.waiting_client,
    meeting: r.meeting,
    boardOrder: r.board_order,
    createdBy: r.created_by,
    createdAt: iso(r.created_at),
    updatedAt: iso(r.updated_at),
  }),
  sort: (a, b) => b.createdAt.localeCompare(a.createdAt),
  order: { column: 'created_at', ascending: false },
});

const contactsStore = createSyncedStore<TenantContact>([], {
  table: 'tenant_contacts',
  conflict: 'tenant_id',
  persistKey: 'tenants.contacts',
  toRow: (c) => ({
    tenant_id: c.tenantId,
    full_name: c.fullName,
    nif: c.nif,
    legal_email: c.legalEmail,
    billing_email: c.billingEmail,
    phone: c.phone,
    fiscal_address: c.fiscalAddress,
  }),
  fromRow: (r) => ({
    tenantId: r.tenant_id,
    fullName: r.full_name,
    nif: r.nif,
    legalEmail: r.legal_email,
    billingEmail: r.billing_email,
    phone: r.phone,
    fiscalAddress: r.fiscal_address,
  }),
});

const billingStore = createSyncedStore<TenantBilling>([], {
  table: 'tenant_billing',
  conflict: 'tenant_id',
  persistKey: 'tenants.billing',
  toRow: (b) => ({
    tenant_id: b.tenantId,
    closed_price: b.closedPrice,
    payment_mode: b.paymentMode,
    maintenance_yearly: b.maintenanceYearly,
    maintenance_renewal: b.maintenanceRenewal,
  }),
  fromRow: (r) => ({
    tenantId: r.tenant_id,
    closedPrice: num(r.closed_price),
    paymentMode: r.payment_mode,
    maintenanceYearly: num(r.maintenance_yearly),
    maintenanceRenewal: r.maintenance_renewal,
  }),
});

// Los pagos los genera un trigger de la BD al guardar la facturación: aquí solo se marcan como cobrados.
const paymentsStore = createSyncedStore<TenantPayment>([], {
  table: 'tenant_payments',
  persistKey: 'tenants.payments',
  toRow: (p) => ({
    id: p.id,
    tenant_id: p.tenantId,
    concept: p.concept,
    amount: p.amount,
    due_date: p.dueDate,
    paid_at: p.paidAt,
    method: p.method,
  }),
  fromRow: (r) => ({
    id: r.id,
    tenantId: r.tenant_id,
    concept: r.concept,
    amount: num(r.amount),
    dueDate: r.due_date,
    paidAt: isoOrNull(r.paid_at),
    method: r.method,
  }),
  write: { insert: false, delete: false },
});

// Integraciones y log: los crea y actualiza el provisionado (Edge Function); el navegador solo los lee.
export const integrationsStore = createSyncedStore<TenantIntegration>([], {
  table: 'tenant_integrations',
  conflict: 'tenant_id,provider',
  persistKey: 'tenants.integrations',
  toRow: (i) => ({
    tenant_id: i.tenantId,
    provider: i.provider,
    status: i.status,
    external_id: i.externalId,
    meta: i.meta,
    error: i.error,
    last_sync_at: i.lastSyncAt,
  }),
  fromRow: (r) => ({
    tenantId: r.tenant_id,
    provider: r.provider,
    status: r.status,
    externalId: r.external_id,
    meta: r.meta ?? {},
    error: r.error,
    lastSyncAt: isoOrNull(r.last_sync_at),
  }),
  write: { insert: false, update: false, delete: false },
});

export const logStore = createSyncedStore<ProvisioningLogEntry>([], {
  table: 'provisioning_log',
  persistKey: 'tenants.log',
  toRow: (l) => ({ id: l.id, tenant_id: l.tenantId, step: l.step, ok: l.ok, detail: l.detail, actor: l.actor, at: l.at }),
  fromRow: (r) => ({
    id: String(r.id),
    tenantId: r.tenant_id,
    step: r.step,
    ok: r.ok,
    detail: r.detail ?? '',
    actor: r.actor,
    at: iso(r.at),
  }),
  sort: (a, b) => a.at.localeCompare(b.at),
  order: { column: 'at', ascending: false },
  limit: 1000,
  write: { insert: false, update: false, delete: false },
});

/** Al borrar un proyecto SaaS: fuera sus tenants y todo lo que cuelga de ellos. */
export function removeProjectTenants(projectId: string): void {
  const ids = new Set(tenantsStore.get().filter((t) => t.projectId === projectId).map((t) => t.id));
  if (!ids.size) return;
  tenantsStore.set((prev) => prev.filter((t) => !ids.has(t.id)));
  contactsStore.set((prev) => prev.filter((c) => !ids.has(c.tenantId)));
  billingStore.set((prev) => prev.filter((b) => !ids.has(b.tenantId)));
  paymentsStore.set((prev) => prev.filter((p) => !ids.has(p.tenantId)));
  integrationsStore.set((prev) => prev.filter((i) => !ids.has(i.tenantId)));
  logStore.set((prev) => prev.filter((l) => !ids.has(l.tenantId)));
}

// ---------------------------------------------------------------- lectura

export function usePlans(): SaasPlan[] {
  return useStore(plansStore);
}
export function getPlan(id: string | null): SaasPlan | undefined {
  return id ? plansStore.get().find((p) => p.id === id) : undefined;
}

export function getTenants(): Tenant[] {
  return tenantsStore.get();
}
export function useAllTenants(): Tenant[] {
  return useStore(tenantsStore);
}
export function useProjectTenants(projectId: string): Tenant[] {
  const all = useStore(tenantsStore);
  return useMemo(() => all.filter((t) => t.projectId === projectId), [all, projectId]);
}
export function useTenant(id: string | undefined): Tenant | undefined {
  return useStore(tenantsStore, (list) => list.find((t) => t.id === id));
}
export function getTenant(id: string): Tenant | undefined {
  return tenantsStore.get().find((t) => t.id === id);
}
export function useTenantContact(id: string): TenantContact | undefined {
  return useStore(contactsStore, (list) => list.find((c) => c.tenantId === id));
}
export function useTenantBilling(id: string): TenantBilling | undefined {
  return useStore(billingStore, (list) => list.find((b) => b.tenantId === id));
}
export function useAllPayments(): TenantPayment[] {
  return useStore(paymentsStore);
}
export function useAllBilling(): TenantBilling[] {
  return useStore(billingStore);
}
export function useTenantPayments(id: string): TenantPayment[] {
  const all = useStore(paymentsStore);
  return useMemo(() => all.filter((p) => p.tenantId === id), [all, id]);
}
export function useTenantIntegrations(id: string): Record<IntegrationProvider, TenantIntegration> {
  const all = useStore(integrationsStore);
  return useMemo(() => {
    const mine = all.filter((i) => i.tenantId === id);
    return Object.fromEntries(
      PROVIDERS.map((p) => [
        p,
        mine.find((i) => i.provider === p) ?? { tenantId: id, provider: p, status: 'pending', externalId: null, meta: {}, error: null, lastSyncAt: null },
      ]),
    ) as Record<IntegrationProvider, TenantIntegration>;
  }, [all, id]);
}
export function useTenantLog(id: string): ProvisioningLogEntry[] {
  const all = useStore(logStore);
  return useMemo(() => all.filter((l) => l.tenantId === id).sort((a, b) => a.at.localeCompare(b.at)), [all, id]);
}

// ---------------------------------------------------------------- reglas

const DOMAIN_RE = /^([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/;
const SLUG_RE = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 63)
    .replace(/-$/, '');
}
export const isValidSlug = (slug: string) => SLUG_RE.test(slug);
/** Normaliza lo que se pega (https://, www., barra final…) al dominio canónico. */
export function normalizeDomain(input: string): string {
  return input.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '');
}
export const isValidDomain = (domain: string) => DOMAIN_RE.test(domain);
export const isSlugTaken = (slug: string, exceptId?: string) => tenantsStore.get().some((t) => t.slug === slug && t.id !== exceptId);
export const isDomainTaken = (domain: string, exceptId?: string) =>
  tenantsStore.get().some((t) => t.domain === domain && t.id !== exceptId);

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isValidUuid = (id: string) => UUID_RE.test(id.trim());
export const isBusinessIdTaken = (id: string, exceptId?: string) =>
  tenantsStore.get().some((t) => t.saasBusinessId === id.trim().toLowerCase() && t.id !== exceptId);

/** Lo mínimo para crear la preview en Vercel: el SaaS necesita tipo, layout y plan. */
export type PreviewRequirement = 'name' | 'business_type' | 'layout' | 'plan';
export function previewMissing(tenant: Pick<Tenant, 'name' | 'businessType' | 'layout' | 'planId'>): PreviewRequirement[] {
  const out: PreviewRequirement[] = [];
  if (!tenant.name.trim()) out.push('name');
  if (!tenant.businessType) out.push('business_type');
  if (!tenant.layout) out.push('layout');
  if (!tenant.planId) out.push('plan');
  return out;
}

const hasHours = (h: Tenant['openingHours']) => Boolean(h && Object.values(h).some((ranges) => ranges && ranges.length));

/** Igual que tenant_missing_requirements() de la BD. */
export function missingRequirements(tenant: Tenant, payments: TenantPayment[]): TenantRequirement[] {
  const out: TenantRequirement[] = [];
  if (!tenant.name.trim()) out.push('name');
  if (!tenant.businessType) out.push('business_type');
  if (!tenant.layout) out.push('layout');
  if (!tenant.planId) out.push('plan');
  if (!tenant.domain) out.push('domain');
  if (!hasHours(tenant.openingHours)) out.push('opening_hours');
  if (!tenant.address?.trim()) out.push('address');
  if (!payments.some((p) => p.tenantId === tenant.id && (p.concept === 'deposit' || p.concept === 'single') && p.paidAt)) out.push('payment');
  return out;
}

export function useMissingRequirements(tenant: Tenant | undefined): TenantRequirement[] {
  const payments = useStore(paymentsStore);
  return useMemo(() => (tenant ? missingRequirements(tenant, payments) : []), [tenant, payments]);
}
export function getMissingRequirements(tenantId: string): TenantRequirement[] {
  const t = getTenant(tenantId);
  return t ? missingRequirements(t, paymentsStore.get()) : [];
}

const today = () => new Date().toISOString().slice(0, 10);

/** Igual que el trigger tenant_billing_generate_payments (solo en la demo: con Supabase lo hace la BD). */
function paymentsFor(b: TenantBilling, withMaintenance: boolean): TenantPayment[] {
  const mk = (concept: TenantPayment['concept'], amount: number, dueDate: string | null): TenantPayment => ({
    id: crypto.randomUUID(),
    tenantId: b.tenantId,
    concept,
    amount,
    dueDate,
    paidAt: null,
    method: null,
  });
  const out: TenantPayment[] = [];
  if (b.paymentMode === 'split_50_50') {
    const half = Math.round((b.closedPrice / 2) * 100) / 100;
    out.push(mk('deposit', half, today()), mk('final', Math.round((b.closedPrice - half) * 100) / 100, null));
  } else {
    out.push(mk('single', b.closedPrice, today()));
  }
  if (withMaintenance) out.push(mk('maintenance', b.maintenanceYearly, b.maintenanceRenewal));
  return out;
}

// ---------------------------------------------------------------- escritura

export interface NewTenantInput {
  tenant: Omit<
    Tenant,
    'id' | 'status' | 'createdBy' | 'createdAt' | 'updatedAt' | 'googlePlaceId' | 'boardOrder' | 'waitingClient' | 'meeting' | 'clientId'
  > & {
    googlePlaceId?: string | null;
    meeting?: Tenant['meeting'];
  };
  contact: Omit<TenantContact, 'tenantId'> | null;
  /** Null = se configura después desde la pestaña Facturación. */
  billing: { closedPrice: number; paymentMode: PaymentMode; maintenanceYearly: number } | null;
}

/**
 * Guarda el tenant en borrador con sus integraciones (pending) y, si hay precio, sus pagos.
 * El business_id se fija aquí (vinculado o nuevo) para que todo lo del SaaS lo referencie desde el alta.
 */
export function createTenant(input: NewTenantInput, by: PartnerId): Tenant {
  if (isSlugTaken(input.tenant.slug)) throw new Error(`El slug "${input.tenant.slug}" ya existe`);
  if (input.tenant.domain && isDomainTaken(input.tenant.domain)) throw new Error(`El dominio ${input.tenant.domain} ya lo usa otro tenant`);
  const businessId = (input.tenant.saasBusinessId ?? crypto.randomUUID()).trim().toLowerCase();
  if (!isValidUuid(businessId)) throw new Error('El business_id debe ser un UUID');
  if (isBusinessIdTaken(businessId)) throw new Error('Ese business_id ya está vinculado a otro tenant');
  const now = new Date().toISOString();
  const tenant: Tenant = {
    ...input.tenant,
    googlePlaceId: input.tenant.googlePlaceId ?? null,
    meeting: input.tenant.meeting ?? null,
    clientId: null,
    id: crypto.randomUUID(),
    status: 'draft',
    saasBusinessId: businessId,
    waitingClient: false,
    boardOrder: -1,
    createdBy: by,
    createdAt: now,
    updatedAt: now,
  };

  tenantsStore.set((prev) => [tenant, ...prev]);
  if (input.billing) createBilling(tenant.id, input.billing);
  if (!remote) {
    integrationsStore.set((prev) => [
      ...prev,
      ...PROVIDERS.map((provider) => ({ tenantId: tenant.id, provider, status: 'pending' as const, externalId: null, meta: {}, error: null, lastSyncAt: null })),
    ]);
  }
  const contact = input.contact;
  if (contact && Object.values(contact).some(Boolean)) contactsStore.set((prev) => [...prev, { tenantId: tenant.id, ...contact }]);

  logActivity({ type: 'project_created', partnerId: by, projectId: tenant.projectId, action: `dio de alta el tenant «${tenant.name}» en` });
  return tenant;
}

export function updateTenant(id: string, patch: Partial<Tenant>): void {
  const current = getTenant(id);
  if (!current) return;
  if (patch.slug && patch.slug !== current.slug && isSlugTaken(patch.slug, id)) throw new Error(`El slug "${patch.slug}" ya existe`);
  if (patch.domain && patch.domain !== current.domain && isDomainTaken(patch.domain, id)) throw new Error(`El dominio ${patch.domain} ya lo usa otro tenant`);
  if (patch.status === 'live' && current.status !== 'live') {
    const missing = missingRequirements({ ...current, ...patch }, paymentsStore.get());
    if (missing.length) throw new Error(`No se puede pasar a live: falta ${missing.join(', ')}`);
    // En producción = trabajo entregado: pasa a Hecho en el Kanban.
    patch = { ...patch, stage: 'hecho', waitingClient: false };
  }
  tenantsStore.set((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t)));
}

/** Cambios en bloque (reordenar el Kanban) sin tocar updatedAt de todos. */
export function patchTenants(patches: Map<string, Partial<Tenant>>): void {
  if (!patches.size) return;
  tenantsStore.set((prev) => prev.map((t) => (patches.has(t.id) ? { ...t, ...patches.get(t.id) } : t)));
}

/** Alta de la facturación (si no se puso en el asistente): la BD genera los pagos; en la demo, aquí. */
export function createBilling(tenantId: string, input: { closedPrice: number; paymentMode: PaymentMode; maintenanceYearly: number }): void {
  if (billingStore.get().some((b) => b.tenantId === tenantId)) throw new Error('Este tenant ya tiene facturación');
  const billing: TenantBilling = { tenantId, ...input, maintenanceRenewal: null };
  billingStore.set((prev) => [...prev, billing]);
  if (!remote) paymentsStore.set((prev) => [...prev, ...paymentsFor(billing, true)]);
}

export function saveContact(tenantId: string, contact: Omit<TenantContact, 'tenantId'>): void {
  contactsStore.set((prev) => [...prev.filter((c) => c.tenantId !== tenantId), { tenantId, ...contact }]);
}

/** Cambia precio / modalidad: los pagos de cierre se regeneran solo si ninguno está cobrado (lo exige también la BD). */
export function updateBilling(tenantId: string, patch: Partial<Omit<TenantBilling, 'tenantId'>>): void {
  const current = billingStore.get().find((b) => b.tenantId === tenantId);
  if (!current) return;
  const next = { ...current, ...patch };
  const closingChanged = next.closedPrice !== current.closedPrice || next.paymentMode !== current.paymentMode;
  const payments = paymentsStore.get().filter((p) => p.tenantId === tenantId);
  if (closingChanged && payments.some((p) => ['deposit', 'final', 'single'].includes(p.concept) && p.paidAt)) {
    throw new Error('Ya hay pagos de cierre cobrados: ajusta los pagos a mano antes de cambiar precio o modalidad');
  }
  billingStore.set((prev) => prev.map((b) => (b.tenantId === tenantId ? next : b)));
  if (remote) return; // el trigger de la BD regenera los pagos y Realtime los trae
  paymentsStore.set((prev) => {
    let list = prev;
    if (closingChanged) {
      list = list.filter((p) => !(p.tenantId === tenantId && ['deposit', 'final', 'single'].includes(p.concept)));
      list = [...list, ...paymentsFor(next, false)];
    }
    return list.map((p) =>
      p.tenantId === tenantId && p.concept === 'maintenance' && !p.paidAt
        ? { ...p, amount: next.maintenanceYearly, dueDate: next.maintenanceRenewal }
        : p,
    );
  });
}

export function markPaymentPaid(paymentId: string, method: string, by: PartnerId): void {
  const payment = paymentsStore.get().find((p) => p.id === paymentId);
  if (!payment || payment.paidAt) return;
  paymentsStore.set((prev) => prev.map((p) => (p.id === paymentId ? { ...p, paidAt: new Date().toISOString(), method } : p)));
  const t = getTenant(payment.tenantId);
  const eur = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(payment.amount);
  logActivity({ type: 'fund', partnerId: by, projectId: t?.projectId ?? null, action: `cobró ${eur} de «${t?.name ?? 'tenant'}» en` });
}

export function unmarkPayment(paymentId: string): void {
  paymentsStore.set((prev) => prev.map((p) => (p.id === paymentId ? { ...p, paidAt: null, method: null } : p)));
}

/** Al pasar a live: fija la renovación a un año vista si no la tenía (como el paso go-live). */
export function setRenewalIfMissing(tenantId: string): void {
  const b = billingStore.get().find((x) => x.tenantId === tenantId);
  if (!b || b.maintenanceRenewal) return;
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  updateBilling(tenantId, { maintenanceRenewal: d.toISOString().slice(0, 10) });
}

// ---------------------------------------------------------------- integraciones y log (los usa el provisionado simulado de la demo)

export function patchIntegration(tenantId: string, provider: IntegrationProvider, patch: Partial<TenantIntegration>): void {
  integrationsStore.set((prev) => prev.map((i) => (i.tenantId === tenantId && i.provider === provider ? { ...i, ...patch } : i)));
}
export function getIntegrations(tenantId: string): TenantIntegration[] {
  return integrationsStore.get().filter((i) => i.tenantId === tenantId);
}
export function appendLog(entry: Omit<ProvisioningLogEntry, 'id' | 'at'>): void {
  logStore.set((prev) => [...prev, { ...entry, id: crypto.randomUUID(), at: new Date().toISOString() }]);
}
