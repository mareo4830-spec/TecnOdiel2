-- =====================================================================
-- Sincronización de la oficina con Supabase (sale del modo demo).
--
-- 1. Realtime para las tablas que faltaban: la oficina escucha facturación,
--    contactos fiscales y configuración SaaS (RLS también se aplica a Realtime).
-- 2. Vínculo de socios en cada inicio de sesión, no solo al crear la cuenta de Auth:
--    si alguien ya había entrado antes como visitante (cliente) y luego se añade como
--    socio, quedaba sin vincular y la app no lo dejaba entrar. Así se puede quitar la
--    lista de emails que había escrita en el código.
-- =====================================================================

do $$
declare
  t text;
begin
  foreach t in array array['tenant_billing', 'tenant_contacts', 'saas_project_config']
  loop
    if not exists (
      select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end;
$$;

drop trigger if exists on_auth_user_signed_in_link_partner on auth.users;
create trigger on_auth_user_signed_in_link_partner
  after update of last_sign_in_at on auth.users
  for each row
  when (old.last_sign_in_at is distinct from new.last_sign_in_at)
  execute function public.link_partner_user();

-- Re-vincula ahora a quien ya tenga cuenta.
update public.partners p
   set user_id = u.id
  from auth.users u
 where lower(u.email) = lower(p.email)
   and p.user_id is null;
