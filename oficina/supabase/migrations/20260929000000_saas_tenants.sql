-- =====================================================================
-- SaaS Multi-Tenant · Fase 1 (BD)
-- Proyecto Supabase de la OFICINA VIRTUAL (NO el de producción del SaaS).
-- Requiere 20260925000000_partners.sql y 20260928000000_oficina.sql.
--
-- Un proyecto `saas` contiene tenants (cada negocio del SaaS de peluquerías,
-- barberías y salones) con sus datos, facturación, integraciones y log de
-- provisionado. Los proyectos existentes quedan como `standard` sin cambios.
-- =====================================================================

-- 1. Rol admin -------------------------------------------------------------
-- Hoy los tres socios son admin. Se mantiene como función aparte para poder
-- restringirlo más adelante (p. ej. con una columna partners.is_admin) sin
-- tocar ninguna política.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_partner();
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- 2. Tipo de proyecto ------------------------------------------------------
alter table public.projects
  add column if not exists kind text not null default 'standard'
  check (kind in ('standard', 'saas'));

-- 3. Planes ------------------------------------------------------------------
create table if not exists public.plans (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null unique,
  setup_price        numeric(10, 2) not null check (setup_price >= 0),
  yearly_maintenance numeric(10, 2) not null check (yearly_maintenance >= 0),
  monthly_ai         numeric(10, 2) not null default 0 check (monthly_ai >= 0),
  -- Flags que se copian al negocio del SaaS al provisionar.
  features           jsonb not null default '{}'::jsonb check (jsonb_typeof(features) = 'object'),
  created_at         timestamptz not null default now()
);

-- ⚠️ Precios provisionales: ajustadlos antes de usar en producción.
insert into public.plans (name, setup_price, yearly_maintenance, monthly_ai, features) values
  ('Básico', 350, 50, 0,
   '{"booking": true, "gallery": true, "reviews": false, "push_notifications": false, "seo_gsc": true, "ai_assistant": false}'),
  ('Pro', 600, 50, 0,
   '{"booking": true, "gallery": true, "reviews": true, "push_notifications": true, "seo_gsc": true, "ai_assistant": false}'),
  ('Pro+IA', 600, 50, 20,
   '{"booking": true, "gallery": true, "reviews": true, "push_notifications": true, "seo_gsc": true, "ai_assistant": true}')
on conflict (name) do nothing;

-- 4. Tenants -----------------------------------------------------------------
-- Casi todo es opcional para poder guardar un borrador; la regla de go-live
-- (sección 10) exige los campos obligatorios antes de pasar a `live`.
create table if not exists public.tenants (
  id               uuid primary key default gen_random_uuid(),
  project_id       text not null references public.projects (id) on delete cascade,
  saas_business_id uuid unique,                          -- id en la tabla de negocios del SaaS (lo rellena el provisionado)
  name             text not null check (char_length(btrim(name)) > 0),
  slug             text not null unique
                   check (slug ~ '^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$'),
  logo_url         text,
  business_type    text check (business_type in ('barberia', 'peluqueria', 'salon', 'estetica')),
  layout           text check (layout in ('clasico', 'moderno', 'minimal')),
  plan_id          uuid references public.plans (id),
  google_maps_url  text,
  google_place_id  text,
  opening_hours    jsonb check (opening_hours is null or jsonb_typeof(opening_hours) in ('object', 'array')),
  address          text,
  lat              numeric(9, 6) check (lat between -90 and 90),
  lng              numeric(9, 6) check (lng between -180 and 180),
  domain           text unique
                   check (domain = lower(domain) and domain ~ '^([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$'),
  -- Proveedor donde está la zona DNS del dominio del cliente (lo usa el paso `dns`).
  dns_provider     text check (dns_provider in ('cloudflare', 'ionos')),
  status           text not null default 'draft'
                   check (status in ('draft', 'provisioning', 'live', 'suspended', 'error')),
  created_by       text references public.partners (id),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists tenants_project_idx on public.tenants (project_id, status);

-- Datos personales y fiscales del cliente: todo opcional y con RLS más estricta.
create table if not exists public.tenant_contacts (
  tenant_id      uuid primary key references public.tenants (id) on delete cascade,
  full_name      text,
  nif            text,
  legal_email    text,
  billing_email  text,
  phone          text,
  fiscal_address text,
  updated_at     timestamptz not null default now()
);

create table if not exists public.tenant_billing (
  tenant_id           uuid primary key references public.tenants (id) on delete cascade,
  closed_price        numeric(10, 2) not null check (closed_price >= 0),
  payment_mode        text not null default 'single' check (payment_mode in ('single', 'split_50_50')),
  maintenance_yearly  numeric(10, 2) not null default 50 check (maintenance_yearly >= 0),
  -- Próxima renovación del mantenimiento; la fija el paso go-live.
  maintenance_renewal date,
  updated_at          timestamptz not null default now()
);

create table if not exists public.tenant_payments (
  id         uuid primary key default gen_random_uuid(),
  tenant_id  uuid not null references public.tenants (id) on delete cascade,
  concept    text not null check (concept in ('deposit', 'final', 'single', 'maintenance', 'ai')),
  amount     numeric(10, 2) not null check (amount >= 0),
  due_date   date,
  paid_at    timestamptz,
  method     text,                                       -- transferencia, bizum, efectivo…
  created_at timestamptz not null default now()
);
create index if not exists tenant_payments_tenant_idx on public.tenant_payments (tenant_id, concept);

create table if not exists public.tenant_integrations (
  id           uuid primary key default gen_random_uuid(),
  tenant_id    uuid not null references public.tenants (id) on delete cascade,
  provider     text not null check (provider in ('places', 'supabase', 'vercel', 'dns', 'onesignal', 'gsc')),
  status       text not null default 'pending' check (status in ('pending', 'running', 'ok', 'error', 'skipped')),
  external_id  text,
  meta         jsonb not null default '{}'::jsonb,
  error        text,
  last_sync_at timestamptz,
  unique (tenant_id, provider)
);

create table if not exists public.provisioning_log (
  id        bigint generated always as identity primary key,
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  step      text not null,
  ok        boolean not null,
  detail    text,
  actor     text not null,                               -- id del socio o 'system'
  at        timestamptz not null default now()
);
create index if not exists provisioning_log_tenant_idx on public.provisioning_log (tenant_id, at);

-- 5. updated_at ----------------------------------------------------------------
drop trigger if exists tenants_touch on public.tenants;
create trigger tenants_touch before update on public.tenants
  for each row execute function public.touch_updated_at();

drop trigger if exists tenant_contacts_touch on public.tenant_contacts;
create trigger tenant_contacts_touch before update on public.tenant_contacts
  for each row execute function public.touch_updated_at();

drop trigger if exists tenant_billing_touch on public.tenant_billing;
create trigger tenant_billing_touch before update on public.tenant_billing
  for each row execute function public.touch_updated_at();

-- 6. Un tenant solo puede colgar de un proyecto `saas` -------------------------
-- security definer: debe ver el proyecto aunque la RLS de `projects` se lo oculte
-- al usuario; así un no-socio recibe el error de RLS de `tenants` y no uno engañoso.
create or replace function public.tenants_check_project_kind()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.projects where id = new.project_id and kind = 'saas') then
    raise exception 'El proyecto % no es de tipo saas', new.project_id
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

drop trigger if exists tenants_project_kind on public.tenants;
create trigger tenants_project_kind before insert or update of project_id on public.tenants
  for each row execute function public.tenants_check_project_kind();

-- Y un proyecto con tenants no puede volver a `standard`.
create or replace function public.projects_check_kind_change()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if old.kind = 'saas' and new.kind <> 'saas'
     and exists (select 1 from public.tenants where project_id = new.id) then
    raise exception 'El proyecto % tiene tenants: no puede dejar de ser saas', new.id
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

drop trigger if exists projects_kind_change on public.projects;
create trigger projects_kind_change before update of kind on public.projects
  for each row execute function public.projects_check_kind_change();

-- 7. Una fila de integración por provider al crear el tenant -------------------
create or replace function public.tenants_create_integrations()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.tenant_integrations (tenant_id, provider)
  select new.id, p
  from unnest(array['places', 'supabase', 'vercel', 'dns', 'onesignal', 'gsc']) as p
  on conflict (tenant_id, provider) do nothing;
  return new;
end;
$$;

drop trigger if exists tenants_integrations on public.tenants;
create trigger tenants_integrations after insert on public.tenants
  for each row execute function public.tenants_create_integrations();

-- 8. Pagos a partir de la facturación ------------------------------------------
-- Al crear: 50/50 → deposit + final; single → un pago del 100 %; y siempre el
-- mantenimiento anual (vence en la renovación, que se fija al salir a live).
-- Al cambiar precio o modalidad se regeneran los pagos de cierre si ninguno
-- está cobrado; si ya hay alguno cobrado se rechaza para no descuadrar.
create or replace function public.tenant_billing_generate_payments()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  half numeric(10, 2);
begin
  if tg_op = 'UPDATE' then
    if new.closed_price = old.closed_price and new.payment_mode = old.payment_mode then
      -- Solo cambia el mantenimiento: se actualiza la cuota pendiente.
      update public.tenant_payments
         set amount = new.maintenance_yearly, due_date = new.maintenance_renewal
       where tenant_id = new.tenant_id and concept = 'maintenance' and paid_at is null;
      return new;
    end if;
    if exists (
      select 1 from public.tenant_payments
       where tenant_id = new.tenant_id and concept in ('deposit', 'final', 'single') and paid_at is not null
    ) then
      raise exception 'Ya hay pagos de cierre cobrados: ajusta los pagos a mano antes de cambiar precio o modalidad'
        using errcode = 'check_violation';
    end if;
    delete from public.tenant_payments
     where tenant_id = new.tenant_id and concept in ('deposit', 'final', 'single');
  end if;

  if new.payment_mode = 'split_50_50' then
    half := round(new.closed_price / 2, 2);
    insert into public.tenant_payments (tenant_id, concept, amount, due_date) values
      (new.tenant_id, 'deposit', half, current_date),
      (new.tenant_id, 'final', new.closed_price - half, null);
  else
    insert into public.tenant_payments (tenant_id, concept, amount, due_date) values
      (new.tenant_id, 'single', new.closed_price, current_date);
  end if;

  if tg_op = 'INSERT' then
    insert into public.tenant_payments (tenant_id, concept, amount, due_date)
    values (new.tenant_id, 'maintenance', new.maintenance_yearly, new.maintenance_renewal);
  end if;
  return new;
end;
$$;

drop trigger if exists tenant_billing_payments on public.tenant_billing;
create trigger tenant_billing_payments after insert or update on public.tenant_billing
  for each row execute function public.tenant_billing_generate_payments();

-- 9. Campos que faltan para salir a live ----------------------------------------
-- También la usa la UI (checklist) y la Edge Function antes de provisionar.
create or replace function public.tenant_missing_requirements(t public.tenants)
returns text[]
language sql
stable
security definer
set search_path = public
as $$
  select array_remove(array[
    case when t.name is null or btrim(t.name) = '' then 'name' end,
    case when t.business_type is null then 'business_type' end,
    case when t.layout is null then 'layout' end,
    case when t.plan_id is null then 'plan' end,
    case when t.domain is null then 'domain' end,
    case when t.opening_hours is null
              or t.opening_hours in ('{}'::jsonb, '[]'::jsonb) then 'opening_hours' end,
    case when t.address is null or btrim(t.address) = '' then 'address' end,
    case when not exists (
      select 1 from public.tenant_payments p
       where p.tenant_id = t.id and p.concept in ('deposit', 'single') and p.paid_at is not null
    ) then 'payment' end
  ], null);
$$;

revoke all on function public.tenant_missing_requirements(public.tenants) from public, anon;
grant execute on function public.tenant_missing_requirements(public.tenants) to authenticated;

-- 10. Regla: no se pasa a `live` con datos obligatorios o el cobro inicial pendientes
create or replace function public.tenants_check_go_live()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  missing text[];
begin
  if new.status = 'live' and (tg_op = 'INSERT' or old.status is distinct from 'live') then
    missing := public.tenant_missing_requirements(new);
    if cardinality(missing) > 0 then
      raise exception 'No se puede pasar a live: falta %', array_to_string(missing, ', ')
        using errcode = 'check_violation', detail = array_to_string(missing, ',');
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists tenants_go_live on public.tenants;
create trigger tenants_go_live before insert or update of status on public.tenants
  for each row execute function public.tenants_check_go_live();

-- 11. RLS: socios leen, solo admin escribe --------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array['plans', 'tenants', 'tenant_billing', 'tenant_payments', 'tenant_integrations', 'provisioning_log']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon', t);
    execute format('drop policy if exists "Socios leen" on public.%I', t);
    execute format('create policy "Socios leen" on public.%I for select to authenticated using (public.is_partner())', t);
    execute format('drop policy if exists "Admin escribe" on public.%I', t);
    execute format(
      'create policy "Admin escribe" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())',
      t
    );
  end loop;
end;
$$;

-- tenant_contacts: ni siquiera la lectura es para todos los socios.
alter table public.tenant_contacts enable row level security;
revoke all on public.tenant_contacts from anon;
drop policy if exists "Solo admin" on public.tenant_contacts;
create policy "Solo admin" on public.tenant_contacts
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- El log es de solo añadir (la Edge Function escribe con service_role).
revoke update, delete on public.provisioning_log from authenticated;

-- 12. Realtime (timeline de provisionado y estado en vivo) -------------------
do $$
declare
  t text;
begin
  foreach t in array array['tenants', 'tenant_integrations', 'provisioning_log', 'tenant_payments']
  loop
    if not exists (
      select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end;
$$;
