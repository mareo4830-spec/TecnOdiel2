-- =====================================================================
-- SaaS Multi-Tenant · Fase 2 (UI): proyectos SaaS sin business_id propio
-- Requiere 20260929000000_saas_tenants.sql.
--
-- Un proyecto `saas` es el producto core: no es un negocio del SaaS, cada tenant
-- guarda el suyo (tenants.saas_business_id). Los `standard` lo siguen exigiendo.
-- =====================================================================

alter table public.projects alter column business_id drop not null;

alter table public.projects drop constraint if exists projects_business_id_by_kind;
alter table public.projects add constraint projects_business_id_by_kind
  check (kind = 'saas' or business_id is not null);
