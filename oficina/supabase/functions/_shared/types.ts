import type { DnsProvider, DnsProviderId } from './dns/types.ts';
import type { Env } from './env.ts';
import type { FetchFn } from './http.ts';
import type { SaasGateway } from './saas/gateway.ts';

export type IntegrationProvider = 'places' | 'supabase' | 'preview' | 'vercel' | 'dns' | 'onesignal' | 'gsc';
export type IntegrationStatus = 'pending' | 'running' | 'ok' | 'error' | 'skipped';
export type TenantStatus = 'draft' | 'provisioning' | 'live' | 'suspended' | 'error';
export type LayoutKey = 'classic' | 'editorial' | 'minimal' | 'playful';
export type TenantBusinessType = 'barberia' | 'peluqueria' | 'salon' | 'estetica' | 'restaurante' | 'cafeteria' | 'clinica' | 'otro';

/** Horario estructurado: { mon: [["09:30", "13:30"], ["16:30", "20:30"]], … }. */
export type OpeningHours = Partial<Record<Weekday, [string, string][]>>;
export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

/** Fila de public.tenants. */
export interface Tenant {
  id: string;
  project_id: string;
  saas_business_id: string | null;
  name: string;
  slug: string;
  tagline: string | null;
  logo_url: string | null;
  business_type: TenantBusinessType | null;
  layout: LayoutKey | null;
  layout_variant: string | null;
  plan_id: string | null;
  google_maps_url: string | null;
  google_place_id: string | null;
  opening_hours: OpeningHours | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  domain: string | null;
  dns_provider: DnsProviderId | null;
  /** <slug>-<sufijo>.vercel.app o <slug>.<dominio de la agencia>. */
  preview_host: string | null;
  phone: string | null;
  whatsapp: string | null;
  public_email: string | null;
  socials: Record<string, string>;
  status: TenantStatus;
}

/** Qué se lanza: todo el provisionado, o solo lo necesario para la preview. */
export type ProvisionMode = 'full' | 'preview';

export interface Plan {
  id: string;
  name: string;
  saas_plan_code: string;
  features: Record<string, boolean>;
}

export interface Billing {
  tenant_id: string;
  closed_price: number;
  payment_mode: 'single' | 'split_50_50';
  maintenance_yearly: number;
  maintenance_renewal: string | null;
}

export interface Integration {
  provider: IntegrationProvider;
  status: IntegrationStatus;
  external_id: string | null;
  meta: Record<string, unknown>;
  error: string | null;
  last_sync_at: string | null;
}

/** Todo lo que un paso necesita. Las dependencias externas se inyectan para poder probarlas. */
export interface StepContext {
  tenant: Tenant;
  plan: Plan | null;
  billing: Billing | null;
  integrations: Record<IntegrationProvider, Integration>;
  env: Env;
  fetch: FetchFn;
  saas: () => SaasGateway;
  dns: (id: DnsProviderId) => DnsProvider;
  now: () => Date;
  /** Id del socio que lanza el provisionado (o 'system'). */
  actor: string;
  /** Lo que falta para salir a live, según tenant_missing_requirements() de la BD. */
  missingRequirements: () => Promise<string[]>;
}

export interface StepOutcome {
  /** ok = hecho · pending = hecho a medias, esperando algo externo (DNS) · skipped = no aplica. */
  status: 'ok' | 'pending' | 'skipped';
  detail: string;
  externalId?: string | null;
  /** Se mezcla con el meta guardado (no lo sustituye). */
  meta?: Record<string, unknown>;
  /** Cambios a guardar en el tenant (p. ej. google_place_id, saas_business_id). */
  tenantPatch?: Partial<Tenant>;
}

export interface Step {
  /** Nombre en provisioning_log. */
  name: IntegrationProvider | 'go-live';
  /** Fila de tenant_integrations que actualiza (go-live no tiene). */
  provider: IntegrationProvider | null;
  run(ctx: StepContext): Promise<StepOutcome>;
}
