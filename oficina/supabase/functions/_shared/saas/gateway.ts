import { createClient, type SupabaseClient } from 'npm:@supabase/supabase-js@2';
import { type Env, requireSecret } from '../env.ts';
import { type FetchFn, ProviderError } from '../http.ts';

/** Fila de public.businesses del SaaS (solo lo que usa el provisionado). */
export interface SaasBusiness {
  id: string;
  slug: string;
  name: string;
  status: 'draft' | 'active' | 'suspended';
  layout_key: string | null;
  contact: Record<string, unknown>;
  public_config: Record<string, unknown>;
}

export interface SaasBusinessWrite {
  /** Solo al insertar: el business_id que el tenant fijó en su alta. */
  id?: string;
  slug: string;
  name: string;
  layout_key: string;
  layout_variant: string;
  plan_code: string;
  active_features: Record<string, boolean>;
  contact: Record<string, unknown>;
  public_config: Record<string, unknown>;
  status?: SaasBusiness['status'];
}

export interface SaasDomain {
  business_id: string;
  hostname: string;
  is_primary: boolean;
  status: 'pending' | 'active' | 'disabled';
}

export interface SaasIntegration {
  onesignal_app_id: string | null;
  onesignal_api_key_secret: string | null;
  site_url: string | null;
}

export interface SaasService {
  business_id: string;
  name: string;
  price: number;
  duration: string;
  duration_minutes: number;
  icon: string;
  sort_order: number;
}

/**
 * Operaciones sobre el Supabase del SaaS que usa el provisionado. Es una interfaz para que
 * los pasos se prueben sin red; la implementación real va con la service_role del SaaS.
 */
export interface SaasGateway {
  findBusinessById(id: string): Promise<SaasBusiness | null>;
  findBusinessBySlug(slug: string): Promise<SaasBusiness | null>;
  defaultVariant(layoutKey: string): Promise<string>;
  insertBusiness(row: SaasBusinessWrite): Promise<string>;
  updateBusiness(id: string, row: Partial<SaasBusinessWrite>): Promise<void>;
  getDomain(hostname: string): Promise<SaasDomain | null>;
  insertDomain(row: SaasDomain & { verified_at: string | null }): Promise<void>;
  activateDomain(businessId: string, hostname: string): Promise<void>;
  countServices(businessId: string): Promise<number>;
  insertServices(rows: SaasService[]): Promise<void>;
  getIntegration(businessId: string): Promise<SaasIntegration | null>;
  upsertIntegration(businessId: string, patch: Partial<SaasIntegration>): Promise<void>;
  /** Guarda la API key en Vault (RPC set_business_integration_secret) y devuelve el nombre del secreto. */
  storeSecret(businessId: string, kind: 'onesignal' | 'resend', secret: string): Promise<string>;
}

const BUSINESS_COLUMNS = 'id, slug, name, status, layout_key, contact, public_config';

function fail(what: string, error: { message: string; code?: string } | null): never {
  throw new ProviderError('supabase', `${what}: ${error?.message ?? 'error desconocido'}`);
}

export function createSaasGateway(env: Env, fetchFn: FetchFn): SaasGateway {
  const db: SupabaseClient = createClient(requireSecret(env, 'SAAS_SUPABASE_URL'), requireSecret(env, 'SAAS_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: fetchFn },
  });

  return {
    async findBusinessById(id) {
      const { data, error } = await db.from('businesses').select(BUSINESS_COLUMNS).eq('id', id).maybeSingle();
      if (error) fail('leer el negocio', error);
      return data as SaasBusiness | null;
    },
    async findBusinessBySlug(slug) {
      const { data, error } = await db.from('businesses').select(BUSINESS_COLUMNS).eq('slug', slug).maybeSingle();
      if (error) fail('buscar el negocio por slug', error);
      return data as SaasBusiness | null;
    },
    async defaultVariant(layoutKey) {
      const { data, error } = await db
        .from('layout_variants')
        .select('key')
        .eq('layout_key', layoutKey)
        .eq('is_available', true)
        .order('sort_order')
        .limit(1)
        .maybeSingle();
      if (error) fail('leer las variantes de layout', error);
      if (!data) throw new ProviderError('supabase', `El SaaS no tiene variantes disponibles para el layout ${layoutKey}`);
      return (data as { key: string }).key;
    },
    async insertBusiness(row) {
      const { data, error } = await db.from('businesses').insert(row).select('id').single();
      if (error) fail('crear el negocio', error);
      return (data as { id: string }).id;
    },
    async updateBusiness(id, row) {
      const { error } = await db.from('businesses').update({ ...row, updated_at: new Date().toISOString() }).eq('id', id);
      if (error) fail('actualizar el negocio', error);
    },
    async getDomain(hostname) {
      const { data, error } = await db
        .from('business_domains')
        .select('business_id, hostname, is_primary, status')
        .eq('hostname', hostname)
        .maybeSingle();
      if (error) fail('leer el dominio', error);
      return data as SaasDomain | null;
    },
    async insertDomain(row) {
      const { error } = await db.from('business_domains').insert(row);
      if (error) fail(`dar de alta ${row.hostname}`, error);
    },
    async activateDomain(businessId, hostname) {
      const now = new Date().toISOString();
      const { error } = await db
        .from('business_domains')
        .update({ status: 'active', verified_at: now, updated_at: now })
        .eq('business_id', businessId)
        .eq('hostname', hostname);
      if (error) fail(`activar ${hostname}`, error);
    },
    async countServices(businessId) {
      const { count, error } = await db.from('services').select('id', { count: 'exact', head: true }).eq('business_id', businessId);
      if (error) fail('contar los servicios', error);
      return count ?? 0;
    },
    async insertServices(rows) {
      const { error } = await db.from('services').insert(rows);
      if (error) fail('crear los servicios por defecto', error);
    },
    async getIntegration(businessId) {
      const { data, error } = await db
        .from('business_integrations')
        .select('onesignal_app_id, onesignal_api_key_secret, site_url')
        .eq('business_id', businessId)
        .maybeSingle();
      if (error) fail('leer business_integrations', error);
      return data as SaasIntegration | null;
    },
    async upsertIntegration(businessId, patch) {
      const { error } = await db
        .from('business_integrations')
        .upsert({ business_id: businessId, ...patch, updated_at: new Date().toISOString() }, { onConflict: 'business_id' });
      if (error) fail('guardar business_integrations', error);
    },
    async storeSecret(businessId, kind, secret) {
      const { data, error } = await db.rpc('set_business_integration_secret', {
        p_business_id: businessId,
        p_kind: kind,
        p_secret: secret,
      });
      if (error) {
        if (error.code === 'PGRST202') {
          throw new ProviderError(
            'supabase',
            'Falta la función set_business_integration_secret en el SaaS: aplica su migración 20260929120000_saas_business_integration_secrets.sql',
          );
        }
        fail('guardar el secreto en Vault', error);
      }
      return data as string;
    },
  };
}
