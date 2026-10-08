-- Dani deja la empresa y el acceso pasa a Google Auth: la tabla `partners` es la lista de admins.
-- is_admin() = socio vinculado (user_id) → el trigger link_partner_user lo vincula al primer login por email.
-- Si Dani tiene filas asociadas (horas, tareas, chat…) la FK abortará la migración: reasígnalas antes.
delete from public.partners where id = 'dani';

alter table public.partners drop constraint if exists partners_id_check;
alter table public.partners add constraint partners_id_check check (id in ('javier', 'mario'));

-- Cuenta de Google de Javier. Mario: cambia su email cuando lo sepas (update public.partners set email = '…' where id = 'mario').
update public.partners set email = 'franciscojavierfarinapadilla@gmail.com' where id = 'javier';

-- Si el usuario ya existía en Auth, vincúlalo ahora.
update public.partners p
   set user_id = u.id
  from auth.users u
 where lower(u.email) = lower(p.email)
   and p.user_id is null;
