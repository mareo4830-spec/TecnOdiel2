-- =====================================================================
-- Flujo de trabajo y SaaS configurables
-- Proyecto Supabase de la OFICINA VIRTUAL. Requiere las migraciones SaaS anteriores.
--
-- 1. Kanban de trabajos: etapas planeado → en_progreso → hecho para proyectos
--    estándar y tenants, con "esperando al cliente", cita de cierre y orden.
-- 2. Configuración de conexiones por proyecto SaaS (BD, Vercel, previews): las
--    Edge Functions la leen en vez de variables globales, así cada producto
--    (peluquerías, restaurantes…) usa su propia infraestructura.
-- 3. Tenant: business_id desde el alta, host de preview (.vercel.app),
--    contacto público y redes; nuevo paso de provisionado `preview`.
-- =====================================================================

-- 1. Etapas de los proyectos ------------------------------------------------
alter table public.projects drop constraint if exists projects_status_check;
update public.projects set status = case status
    when 'propuesta' then 'planeado'
    when 'en_desarrollo' then 'en_progreso'
    when 'revision' then 'en_progreso'
    when 'publicado' then 'hecho'
    when 'mantenimiento' then 'hecho'
    else status end;
alter table public.projects alter column status set default 'planeado';
alter table public.projects add constraint projects_status_check check (status in ('planeado', 'en_progreso', 'hecho'));

alter table public.projects
  add column if not exists waiting_client boolean not null default false,
  add column if not exists meeting jsonb check (meeting is null or (jsonb_typeof(meeting) = 'object' and meeting ? 'date')),
  add column if not exists board_order integer not null default 0;

-- Categorías de negocio (proyectos estándar, vertical de un SaaS y leads del CRM).
alter table public.projects drop constraint if exists projects_business_type_check;
alter table public.projects add constraint projects_business_type_check
  check (business_type in ('barberia', 'peluqueria', 'estetica', 'restaurante', 'cafeteria', 'clinica', 'tienda', 'otro'));
alter table public.leads drop constraint if exists leads_business_type_check;
alter table public.leads add constraint leads_business_type_check
  check (business_type in ('barberia', 'peluqueria', 'estetica', 'restaurante', 'cafeteria', 'clinica', 'tienda', 'otro'));

-- Un proyecto estándar ya no tiene por qué vivir en un SaaS: business_id opcional para todos.
alter table public.projects drop constraint if exists projects_business_id_by_kind;

-- 2. Configuración de cada proyecto SaaS ------------------------------------
-- Solo referencias: los secretos se guardan con `supabase secrets set` y aquí va su NOMBRE.
create table if not exists public.saas_project_config (
  project_id             text primary key references public.projects (id) on delete cascade,
  supabase_url           text check (supabase_url is null or supabase_url ~ '^https://[a-z0-9-]+\.supabase\.(co|in)$'),
  supabase_ref           text,
  service_role_secret    text not null default 'SAAS_SERVICE_ROLE_KEY' check (service_role_secret ~ '^[A-Z][A-Z0-9_]{2,63}$'),
  vercel_team_slug       text,
  vercel_team_id         text check (vercel_team_id is null or vercel_team_id ~ '^team_[A-Za-z0-9]+$'),
  vercel_project_id      text check (vercel_project_id is null or vercel_project_id ~ '^prj_[A-Za-z0-9]+$'),
  vercel_token_secret    text not null default 'VERCEL_TOKEN' check (vercel_token_secret ~ '^[A-Z][A-Z0-9_]{2,63}$'),
  preview_mode           text not null default 'vercel_app' check (preview_mode in ('vercel_app', 'agency_domain')),
  vercel_app_suffix      text check (vercel_app_suffix is null or vercel_app_suffix ~ '^[a-z0-9]([a-z0-9-]{0,20}[a-z0-9])?$'),
  agency_preview_domain  text check (agency_preview_domain is null or agency_preview_domain ~ '^([a-z0-9-]+\.)+[a-z]{2,}$'),
  default_dns_provider   text check (default_dns_provider in ('cloudflare', 'ionos')),
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

drop trigger if exists saas_project_config_touch on public.saas_project_config;
create trigger saas_project_config_touch before update on public.saas_project_config
  for each row execute function public.touch_updated_at();

-- Solo para proyectos saas.
create or replace function public.saas_project_config_check_kind()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if not exists (select 1 from public.projects where id = new.project_id and kind = 'saas') then
    raise exception 'La configuración SaaS solo aplica a proyectos kind = saas' using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

drop trigger if exists saas_project_config_kind on public.saas_project_config;
create trigger saas_project_config_kind before insert or update of project_id on public.saas_project_config
  for each row execute function public.saas_project_config_check_kind();

alter table public.saas_project_config enable row level security;
revoke all on public.saas_project_config from anon;
drop policy if exists "Socios leen" on public.saas_project_config;
create policy "Socios leen" on public.saas_project_config for select to authenticated using (public.is_partner());
drop policy if exists "Admin escribe" on public.saas_project_config;
create policy "Admin escribe" on public.saas_project_config
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 3. Tenants ------------------------------------------------------------------
alter table public.tenants drop constraint if exists tenants_business_type_check;
alter table public.tenants add constraint tenants_business_type_check
  check (business_type in ('barberia', 'peluqueria', 'salon', 'estetica', 'restaurante', 'cafeteria', 'clinica', 'otro'));

alter table public.tenants
  add column if not exists stage text not null default 'en_progreso' check (stage in ('planeado', 'en_progreso', 'hecho')),
  add column if not exists waiting_client boolean not null default false,
  add column if not exists meeting jsonb check (meeting is null or (jsonb_typeof(meeting) = 'object' and meeting ? 'date')),
  add column if not exists board_order integer not null default 0,
  -- <slug>-<sufijo>.vercel.app o <slug>.<dominio de la agencia>; lo da de alta el paso `preview`.
  add column if not exists preview_host text unique
    check (preview_host is null or preview_host ~ '^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$'),
  add column if not exists phone text,
  add column if not exists whatsapp text,
  add column if not exists public_email text,
  add column if not exists socials jsonb not null default '{}'::jsonb check (jsonb_typeof(socials) = 'object');

-- Los que ya estaban en producción están entregados.
update public.tenants set stage = 'hecho' where status = 'live' and stage <> 'hecho';

-- Al salir a producción el trabajo pasa a Hecho en el Kanban.
create or replace function public.tenants_live_to_done()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.status = 'live' and old.status is distinct from 'live' then
    new.stage := 'hecho';
    new.waiting_client := false;
  end if;
  return new;
end;
$$;

drop trigger if exists tenants_live_done on public.tenants;
create trigger tenants_live_done before update of status on public.tenants
  for each row execute function public.tenants_live_to_done();

-- 4. Paso `preview` del provisionado -------------------------------------------
alter table public.tenant_integrations drop constraint if exists tenant_integrations_provider_check;
alter table public.tenant_integrations add constraint tenant_integrations_provider_check
  check (provider in ('places', 'supabase', 'preview', 'vercel', 'dns', 'onesignal', 'gsc'));

create or replace function public.tenants_create_integrations()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.tenant_integrations (tenant_id, provider)
  select new.id, p
  from unnest(array['places', 'supabase', 'preview', 'vercel', 'dns', 'onesignal', 'gsc']) as p
  on conflict (tenant_id, provider) do nothing;
  return new;
end;
$$;

insert into public.tenant_integrations (tenant_id, provider)
select id, 'preview' from public.tenants
on conflict (tenant_id, provider) do nothing;

-- Lo mínimo para crear la preview (el SaaS necesita tipo, layout y plan).
create or replace function public.tenant_preview_missing(t public.tenants)
returns text[]
language sql
stable
set search_path = public
as $$
  select array_remove(array[
    case when btrim(t.name) = '' then 'name' end,
    case when t.business_type is null then 'business_type' end,
    case when t.layout is null then 'layout' end,
    case when t.plan_id is null then 'plan' end,
    case when t.preview_host is null then 'preview_host' end
  ], null);
$$;

revoke all on function public.tenant_preview_missing(public.tenants) from public, anon;
grant execute on function public.tenant_preview_missing(public.tenants) to authenticated;

-- 5. Realtime ---------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'projects'
  ) then
    alter publication supabase_realtime add table public.projects;
  end if;
end;
$$;
