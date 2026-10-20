-- =====================================================================
-- Capa de clientes: del formulario público al portal del cliente.
--
--   Google login -> formulario -> lead (applicant_user_id) -> client (status 'solicitud')
--   -> el socio lo activa al cerrar -> el portal muestra sus proyectos/tenants.
--
-- El rol sigue decidiéndose en un único sitio: ser socio = tener fila en `partners`
-- vinculada a su cuenta (is_partner()). Cualquier otra cuenta con sesión es cliente.
-- Migración aditiva: no borra ni modifica datos existentes.
-- =====================================================================

-- 1. Clientes -------------------------------------------------------------
create table if not exists public.clients (
  id            uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users (id) on delete set null,   -- único propietario (de momento)
  business_name text not null check (char_length(btrim(business_name)) > 0),
  contact_name  text not null,
  phone         text not null default '',
  email         text not null default '',
  city          text not null default 'Huelva',
  lead_id       uuid unique references public.leads (id) on delete set null,
  status        text not null default 'solicitud' check (status in ('solicitud', 'activo', 'pausado', 'baja')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists clients_owner_idx on public.clients (owner_user_id);

drop trigger if exists clients_touch on public.clients;
create trigger clients_touch before update on public.clients
  for each row execute function public.touch_updated_at();

-- 2. Vínculos con el resto del modelo -------------------------------------
alter table public.leads
  add column if not exists applicant_user_id uuid references auth.users (id) on delete set null;
create index if not exists leads_applicant_idx on public.leads (applicant_user_id)
  where applicant_user_id is not null;

alter table public.projects
  add column if not exists client_id uuid references public.clients (id) on delete set null;
alter table public.tenants
  add column if not exists client_id uuid references public.clients (id) on delete set null;
create index if not exists projects_client_idx on public.projects (client_id);
create index if not exists tenants_client_idx on public.tenants (client_id);

-- projects aceptaba menos tipos que leads: un lead de tipo 'salon' no se podía convertir.
alter table public.projects drop constraint if exists projects_business_type_check;
alter table public.projects add constraint projects_business_type_check
  check (business_type in ('barberia', 'peluqueria', 'salon', 'estetica', 'restaurante', 'cafeteria', 'clinica', 'tienda', 'otro'));

-- 3. Un visitante que envía el formulario queda como solicitante y recibe su cliente
-- (SECURITY DEFINER: el visitante no tiene permiso de lectura sobre leads/clients).
create or replace function public.leads_set_applicant()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_partner() then
    new.applicant_user_id := auth.uid();
    -- Freno básico contra abuso desde una cuenta de Google.
    if (select count(*) from public.leads
         where applicant_user_id = new.applicant_user_id
           and created_at > now() - interval '24 hours') >= 3 then
      raise exception 'Demasiadas solicitudes en poco tiempo'
        using errcode = 'check_violation';
    end if;
  end if;
  return new;
end;
$$;

create or replace function public.leads_create_client()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.applicant_user_id is not null then
    insert into public.clients (owner_user_id, business_name, contact_name, phone, email, city, lead_id)
    values (new.applicant_user_id, new.business_name, new.contact_name, new.phone, new.email, new.city, new.id)
    on conflict (lead_id) do nothing;
  end if;
  return new;
end;
$$;

revoke execute on function public.leads_set_applicant() from public, anon, authenticated;
revoke execute on function public.leads_create_client() from public, anon, authenticated;

drop trigger if exists leads_applicant on public.leads;
create trigger leads_applicant before insert on public.leads
  for each row execute function public.leads_set_applicant();

drop trigger if exists leads_client on public.leads;
create trigger leads_client after insert on public.leads
  for each row execute function public.leads_create_client();

-- La política pública solo deja crear solicitudes de formulario, siempre en su primera etapa.
drop policy if exists "Visitantes envían su solicitud" on public.leads;
create policy "Visitantes envían su solicitud"
  on public.leads for insert
  to authenticated
  with check (stage = 'contactado' and project_id is null and source = 'formulario_web');

-- 4. RLS -------------------------------------------------------------------
alter table public.clients enable row level security;
revoke all on public.clients from anon;

drop policy if exists "Solo socios" on public.clients;
create policy "Solo socios" on public.clients
  for all to authenticated using (public.is_partner()) with check (public.is_partner());

-- El cliente ve lo suyo y nada más (solo lectura; sus cambios irán por canales controlados).
drop policy if exists "Propietario ve su cliente" on public.clients;
create policy "Propietario ve su cliente" on public.clients
  for select to authenticated using (owner_user_id = auth.uid());

drop policy if exists "Propietario ve sus proyectos" on public.projects;
create policy "Propietario ve sus proyectos" on public.projects
  for select to authenticated
  using (client_id in (select id from public.clients where owner_user_id = auth.uid()));

drop policy if exists "Propietario ve sus tenants" on public.tenants;
create policy "Propietario ve sus tenants" on public.tenants
  for select to authenticated
  using (client_id in (select id from public.clients where owner_user_id = auth.uid()));

drop policy if exists "Propietario ve sus pagos" on public.tenant_payments;
create policy "Propietario ve sus pagos" on public.tenant_payments
  for select to authenticated
  using (tenant_id in (select id from public.tenants));  -- ya filtrado por la política anterior

-- 5. Realtime --------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'clients'
  ) then
    alter publication supabase_realtime add table public.clients;
  end if;
end;
$$;
