-- =====================================================================
-- FASE 1 · Socios y control de acceso
-- Proyecto Supabase de la OFICINA VIRTUAL (NO el de producción del SaaS).
-- =====================================================================

-- 1. Tabla de socios -----------------------------------------------------
create table if not exists public.partners (
  id           text primary key check (id in ('javier', 'dani', 'mario')),
  user_id      uuid unique references auth.users (id) on delete set null,
  name         text not null,
  initials     text not null,
  email        text not null unique,
  avatar_url   text,
  availability text,
  created_at   timestamptz not null default now()
);

alter table public.partners enable row level security;

-- 2. ¿El usuario actual es socio? ------------------------------------------
-- SECURITY DEFINER para que las políticas puedan usarla sin recursión de RLS.
-- La reutilizarán todas las tablas internas de las siguientes fases.
create or replace function public.is_partner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.partners where user_id = auth.uid());
$$;

revoke all on function public.is_partner() from public, anon;
grant execute on function public.is_partner() to authenticated;

-- 3. Políticas -------------------------------------------------------------
revoke all on public.partners from anon;

drop policy if exists "Socios pueden ver a los socios" on public.partners;
create policy "Socios pueden ver a los socios"
  on public.partners for select
  to authenticated
  using (public.is_partner());

drop policy if exists "Cada socio edita su propio perfil" on public.partners;
create policy "Cada socio edita su propio perfil"
  on public.partners for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Solo se pueden modificar estas columnas desde el cliente (ni id, ni user_id, ni email).
revoke insert, update, delete on public.partners from authenticated;
grant update (avatar_url, availability) on public.partners to authenticated;

-- 4. Vincular automáticamente la cuenta de Auth con su fila de socio ------
create or replace function public.link_partner_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.partners
     set user_id = new.id
   where lower(email) = lower(new.email)
     and user_id is null;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_link_partner on auth.users;
create trigger on_auth_user_created_link_partner
  after insert on auth.users
  for each row execute function public.link_partner_user();

-- 5. Datos iniciales -------------------------------------------------------
-- ⚠️ Sustituye los emails por los reales ANTES de ejecutar.
insert into public.partners (id, name, initials, email, availability) values
  ('javier', 'Javier', 'J', 'franciscojavierfarinapadilla@gmail.com', 'Estudia por la mañana'),
  ('dani',   'Dani',   'D', 'dani@CAMBIAR.com',   'Estudia por la tarde'),
  ('mario',  'Mario',  'M', 'mario@CAMBIAR.com',  'Disponibilidad completa')
on conflict (id) do update
  set email = excluded.email,
      availability = excluded.availability;

-- Si los usuarios ya existían en Auth antes de este script, vincúlalos:
update public.partners p
   set user_id = u.id
  from auth.users u
 where lower(u.email) = lower(p.email)
   and p.user_id is null;
