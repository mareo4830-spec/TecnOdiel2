import { useMemo } from 'react';
import { createStore, useStore } from '../../lib/store';
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
 * Capa de datos de los tenants (local). Reproduce las reglas de la BD de la fase 1 (pagos generados
 * desde la facturación, regla de go-live, unicidad de slug y dominio) para que la UI se comporte
 * igual que con Supabase. Al conectar Supabase: tablas tenants, tenant_* y provisioning_log con
 * Realtime; las reglas las aplica la BD y este archivo solo lee y escribe.
 */
const plansStore = createStore<SaasPlan[]>(PLANS);
const tenantsStore = createStore<Tenant[]>([], 'tenants');
const contactsStore = createStore<TenantContact[]>([], 'tenants.contacts');
const billingStore = createStore<TenantBilling[]>([], 'tenants.billing');
const paymentsStore = createStore<TenantPayment[]>([], 'tenants.payments');
export const integrationsStore = createStore<TenantIntegration[]>([], 'tenants.integrations');
export const logStore = createStore<ProvisioningLogEntry[]>([], 'tenants.log');

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

/** Igual que el trigger tenant_billing_generate_payments. */
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
    'id' | 'status' | 'createdBy' | 'createdAt' | 'updatedAt' | 'googlePlaceId' | 'boardOrder' | 'waitingClient' | 'meeting'
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
  integrationsStore.set((prev) => [
    ...prev,
    ...PROVIDERS.map((provider) => ({ tenantId: tenant.id, provider, status: 'pending' as const, externalId: null, meta: {}, error: null, lastSyncAt: null })),
  ]);
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

/** Alta de la facturación (si no se puso en el asistente): genera los pagos como el trigger de la BD. */
export function createBilling(tenantId: string, input: { closedPrice: number; paymentMode: PaymentMode; maintenanceYearly: number }): void {
  if (billingStore.get().some((b) => b.tenantId === tenantId)) throw new Error('Este tenant ya tiene facturación');
  const billing: TenantBilling = { tenantId, ...input, maintenanceRenewal: null };
  billingStore.set((prev) => [...prev, billing]);
  paymentsStore.set((prev) => [...prev, ...paymentsFor(billing, true)]);
}

export function saveContact(tenantId: string, contact: Omit<TenantContact, 'tenantId'>): void {
  contactsStore.set((prev) => [...prev.filter((c) => c.tenantId !== tenantId), { tenantId, ...contact }]);
}

/** Cambia precio / modalidad: regenera los pagos de cierre solo si ninguno está cobrado (como la BD). */
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

// ---------------------------------------------------------------- integraciones y log (los usa el provisionado)

export function patchIntegration(tenantId: string, provider: IntegrationProvider, patch: Partial<TenantIntegration>): void {
  integrationsStore.set((prev) => prev.map((i) => (i.tenantId === tenantId && i.provider === provider ? { ...i, ...patch } : i)));
}
export function getIntegrations(tenantId: string): TenantIntegration[] {
  return integrationsStore.get().filter((i) => i.tenantId === tenantId);
}
export function appendLog(entry: Omit<ProvisioningLogEntry, 'id' | 'at'>): void {
  logStore.set((prev) => [...prev, { ...entry, id: crypto.randomUUID(), at: new Date().toISOString() }]);
}
