import type { SupabaseClient } from 'npm:@supabase/supabase-js@2';
import type { Env } from './env.ts';

/** Fila de public.saas_project_config: conexiones de un producto SaaS (solo referencias). */
export interface SaasProjectConfigRow {
  project_id: string;
  supabase_url: string | null;
  supabase_ref: string | null;
  service_role_secret: string;
  vercel_team_slug: string | null;
  vercel_team_id: string | null;
  vercel_project_id: string | null;
  vercel_token_secret: string;
  preview_mode: 'vercel_app' | 'agency_domain';
  vercel_app_suffix: string | null;
  agency_preview_domain: string | null;
  default_dns_provider: 'cloudflare' | 'ionos' | null;
}

export async function loadProjectConfig(db: SupabaseClient, projectId: string): Promise<SaasProjectConfigRow | null> {
  const { data, error } = await db.from('saas_project_config').select('*').eq('project_id', projectId).maybeSingle();
  if (error) throw new Error(`BD (leer configuración del SaaS): ${error.message}`);
  return data as SaasProjectConfigRow | null;
}

/**
 * Env del proyecto SaaS: los pasos siguen pidiendo SAAS_SUPABASE_URL, VERCEL_PROJECT_ID…, pero cada
 * producto responde con lo suyo. Los secretos se leen por el nombre guardado en la config
 * (p. ej. SAAS_RESTAURANTES_SERVICE_ROLE_KEY). Lo que no está configurado cae a las variables globales.
 */
export function projectEnv(base: Env, cfg: SaasProjectConfigRow | null): Env {
  if (!cfg) return base;
  const overrides: Record<string, () => string | null | undefined> = {
    SAAS_SUPABASE_URL: () => cfg.supabase_url,
    SAAS_SERVICE_ROLE_KEY: () => base(cfg.service_role_secret),
    VERCEL_TOKEN: () => base(cfg.vercel_token_secret),
    VERCEL_PROJECT_ID: () => cfg.vercel_project_id,
    VERCEL_TEAM_ID: () => cfg.vercel_team_id,
    AGENCY_PREVIEW_DOMAIN: () => cfg.agency_preview_domain,
  };
  return (name) => overrides[name]?.()?.trim() || base(name);
}

/** Env del proyecto al que pertenece un tenant. */
export async function envForTenant(db: SupabaseClient, tenantId: string, base: Env): Promise<Env> {
  const { data, error } = await db.from('tenants').select('project_id').eq('id', tenantId).maybeSingle();
  if (error) throw new Error(`BD (leer tenant): ${error.message}`);
  if (!data) return base;
  return projectEnv(base, await loadProjectConfig(db, (data as { project_id: string }).project_id));
}
