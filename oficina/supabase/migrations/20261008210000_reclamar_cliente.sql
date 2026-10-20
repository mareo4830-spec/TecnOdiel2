-- =====================================================================
-- Reclamar un cliente por email.
--
-- Un cliente que cierra un socio a mano (sin pasar por el formulario) no tiene cuenta de Google
-- vinculada. Al entrar al portal, si hay clientes sin propietario cuyo email coincide con el de
-- su cuenta de Google (verificado por Google), pasan a ser suyos. Devuelve cuántos reclamó.
-- Es SECURITY DEFINER a propósito: el cliente no tiene permiso de escritura sobre `clients`.
-- =====================================================================

create or replace function public.claim_my_clients()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  mail text := lower(coalesce(auth.jwt() ->> 'email', ''));
  claimed integer;
begin
  if auth.uid() is null or mail = '' then
    return 0;
  end if;
  update public.clients
     set owner_user_id = auth.uid()
   where owner_user_id is null
     and lower(email) = mail;
  get diagnostics claimed = row_count;
  return claimed;
end;
$$;

revoke all on function public.claim_my_clients() from public, anon;
grant execute on function public.claim_my_clients() to authenticated;

create index if not exists clients_email_unclaimed_idx on public.clients (lower(email)) where owner_user_id is null;
