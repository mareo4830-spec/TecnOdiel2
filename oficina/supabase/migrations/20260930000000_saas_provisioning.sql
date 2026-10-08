-- =====================================================================
-- SaaS Multi-Tenant · Fase 3 (soporte de BD para provision-tenant)
-- Requiere 20260929000000_saas_tenants.sql.
--
-- 1. Layouts idénticos a businesses.layout_key del SaaS (sin traducciones).
-- 2. Cada plan apunta a su plan del SaaS y lleva sus active_features.
-- 3. Tenant: tagline, variante de layout y cerrojo de provisionado.
-- =====================================================================

-- 1. Layouts: clasico → classic, moderno → editorial; se añade playful ---
alter table public.projects drop constraint if exists projects_layout_check;
update public.projects set layout = case layout when 'clasico' then 'classic' when 'moderno' then 'editorial' else layout end
 where layout in ('clasico', 'moderno');
alter table public.projects
  add constraint projects_layout_check check (layout in ('classic', 'editorial', 'minimal', 'playful'));

alter table public.tenants drop constraint if exists tenants_layout_check;
update public.tenants set layout = case layout when 'clasico' then 'classic' when 'moderno' then 'editorial' else layout end
 where layout in ('clasico', 'moderno');
alter table public.tenants
  add constraint tenants_layout_check check (layout in ('classic', 'editorial', 'minimal', 'playful'));

-- 2. Planes ↔ plans.code del SaaS ----------------------------------------
-- features usa exactamente las claves de public.feature_keys() del SaaS: se copian a
-- businesses.active_features al provisionar.
alter table public.plans add column if not exists saas_plan_code text;

update public.plans set saas_plan_code = 'basic', features =
  '{"has_store": false, "has_gallery": true, "allow_manual_booking": true, "enable_emails": false, "enable_campaigns": false, "enable_pwa": true, "enable_seo_advanced": false}'
 where name = 'Básico';
update public.plans set saas_plan_code = 'pro', features =
  '{"has_store": true, "has_gallery": true, "allow_manual_booking": true, "enable_emails": true, "enable_campaigns": false, "enable_pwa": true, "enable_seo_advanced": true}'
 where name = 'Pro';
update public.plans set saas_plan_code = 'premium', features =
  '{"has_store": true, "has_gallery": true, "allow_manual_booking": true, "enable_emails": true, "enable_campaigns": true, "enable_pwa": true, "enable_seo_advanced": true}'
 where name = 'Pro+IA';

alter table public.plans alter column saas_plan_code set not null;
alter table public.plans drop constraint if exists plans_saas_plan_code_check;
alter table public.plans add constraint plans_saas_plan_code_check check (saas_plan_code ~ '^[a-z][a-z0-9_]{1,30}$');

-- 3. Tenant ----------------------------------------------------------------
alter table public.tenants add column if not exists tagline text;
-- Una de las 5 variantes del layout (p. ej. editorial_magazine). Vacío = la primera del layout.
alter table public.tenants add column if not exists layout_variant text;
alter table public.tenants drop constraint if exists tenants_layout_variant_check;
alter table public.tenants add constraint tenants_layout_variant_check
  check (layout_variant is null or (layout is not null and split_part(layout_variant, '_', 1) = layout));

-- Cerrojo: evita dos provisionados simultáneos del mismo tenant. Si una ejecución muere,
-- el cerrojo caduca a los 10 minutos (lo comprueba la Edge Function).
alter table public.tenants add column if not exists provisioning_started_at timestamptz;
