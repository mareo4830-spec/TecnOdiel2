import type { SupabaseClient } from 'npm:@supabase/supabase-js@2';
import type { ProvisioningRepo, TenantBundle } from './pipeline.ts';
import type { Billing, Integration, IntegrationProvider, Plan, Tenant } from './types.ts';

const PROVIDERS: IntegrationProvider[] = ['places', 'supabase', 'preview', 'vercel', 'dns', 'onesignal', 'gsc'];

function check(what: string, error: { message: string } | null) {
  if (error) throw new Error(`BD (${what}): ${error.message}`);
}

/** Fecha YYYY-MM-DD dentro de un año (UTC). */
function inOneYear(now: Date): string {
  const d = new Date(now);
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().slice(0, 10);
}

/** Repositorio sobre la BD de VirtualDesk con la service_role (se salta RLS). */
export function supabaseRepo(db: SupabaseClient): ProvisioningRepo {
  return {
    async load(tenantId) {
      const { data: tenant, error } = await db.from('tenants').select('*').eq('id', tenantId).maybeSingle();
      check('leer tenant', error);
      if (!tenant) return null;
      const t = tenant as Tenant & { plan_id: string | null };

      const [plan, billing, integ] = await Promise.all([
        t.plan_id ? db.from('plans').select('id, name, saas_plan_code, features').eq('id', t.plan_id).maybeSingle() : null,
        db.from('tenant_billing').select('*').eq('tenant_id', tenantId).maybeSingle(),
        db.from('tenant_integrations').select('provider, status, external_id, meta, error, last_sync_at').eq('tenant_id', tenantId),
      ]);
      check('leer plan', plan?.error ?? null);
      check('leer facturación', billing.error);
      check('leer integraciones', integ.error);

      const rows = (integ.data ?? []) as Integration[];
      const integrations = Object.fromEntries(
        PROVIDERS.map((p) => [
          p,
          rows.find((r) => r.provider === p) ?? { provider: p, status: 'pending', external_id: null, meta: {}, error: null, last_sync_at: null },
        ]),
      ) as TenantBundle['integrations'];

      return {
        tenant: { ...t, lat: t.lat === null ? null : Number(t.lat), lng: t.lng === null ? null : Number(t.lng) },
        plan: (plan?.data as Plan | null) ?? null,
        billing: billing.data
          ? { ...(billing.data as Billing), closed_price: Number((billing.data as Billing).closed_price) }
          : null,
        integrations,
      };
    },

    async missingRequirements(tenantId) {
      // Columna calculada de PostgREST: public.tenant_missing_requirements(tenants).
      const { data, error } = await db.from('tenants').select('missing:tenant_missing_requirements').eq('id', tenantId).single();
      check('comprobar requisitos', error);
      return ((data as { missing: string[] | null }).missing ?? []).filter(Boolean);
    },

    async previewMissing(tenantId) {
      const { data, error } = await db.from('tenants').select('missing:tenant_preview_missing').eq('id', tenantId).single();
      check('comprobar requisitos de la preview', error);
      return ((data as { missing: string[] | null }).missing ?? []).filter(Boolean);
    },

    async acquireLock(tenantId, staleMs) {
      const staleBefore = new Date(Date.now() - staleMs).toISOString();
      const { data, error } = await db
        .from('tenants')
        .update({ provisioning_started_at: new Date().toISOString() })
        .eq('id', tenantId)
        .or(`provisioning_started_at.is.null,provisioning_started_at.lt.${staleBefore}`)
        .select('id');
      check('cerrojo', error);
      return (data ?? []).length === 1;
    },

    async releaseLock(tenantId) {
      const { error } = await db.from('tenants').update({ provisioning_started_at: null }).eq('id', tenantId);
      check('liberar cerrojo', error);
    },

    async updateTenant(tenantId, patch) {
      const { error } = await db.from('tenants').update(patch).eq('id', tenantId);
      check('actualizar tenant', error);
    },

    async updateIntegration(tenantId, provider, patch) {
      const { error } = await db.from('tenant_integrations').update(patch).eq('tenant_id', tenantId).eq('provider', provider);
      check(`actualizar integración ${provider}`, error);
    },

    async log({ tenantId, step, ok, detail, actor }) {
      const { error } = await db.from('provisioning_log').insert({ tenant_id: tenantId, step, ok, detail, actor });
      check('escribir log', error);
    },

    async onLive(tenant, actor) {
      const { data: billing, error } = await db.from('tenant_billing').select('maintenance_renewal').eq('tenant_id', tenant.id).maybeSingle();
      check('leer renovación', error);
      if (billing && !billing.maintenance_renewal) {
        const upd = await db.from('tenant_billing').update({ maintenance_renewal: inOneYear(new Date()) }).eq('tenant_id', tenant.id);
        check('fijar renovación', upd.error);
      }
      // Aviso a los socios: timeline de actividad + chat del equipo (solo si lo lanzó un socio).
      const { data: partner } = await db.from('partners').select('id').eq('id', actor).maybeSingle();
      if (!partner) return;
      const url = `https://${tenant.domain}`;
      const act = await db.from('activity').insert({
        type: 'deploy',
        partner_id: actor,
        project_id: tenant.project_id,
        action: `puso en producción «${tenant.name}» en`,
        detail: url,
      });
      check('actividad', act.error);
      const chat = await db.from('chat_messages').insert({
        author: actor,
        kind: 'aviso',
        project_id: tenant.project_id,
        text: `🚀 ${tenant.name} ya está en producción: ${url}`,
      });
      check('chat', chat.error);
    },
  };
}
