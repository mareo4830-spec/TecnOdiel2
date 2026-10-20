-- =====================================================================
-- Formulario público de captación: columna para las respuestas del
-- asistente de la landing y permiso para que un visitante ya logueado
-- con Google (no socio) envíe su propia solicitud como lead.
-- (Recuperada de la base en vivo, donde se aplicó sin pasar por el repo.)
-- =====================================================================

alter table public.leads add column if not exists intake jsonb;

alter table public.leads drop constraint if exists leads_business_type_check;
alter table public.leads add constraint leads_business_type_check
  check (business_type in ('barberia','peluqueria','salon','estetica','restaurante','cafeteria','clinica','tienda','otro'));

alter table public.leads drop constraint if exists leads_source_check;
alter table public.leads add constraint leads_source_check
  check (source in ('puerta_fria','instagram','recomendacion','google','whatsapp','formulario_web'));

alter table public.leads drop constraint if exists leads_estimated_value_check;
alter table public.leads add constraint leads_estimated_value_check
  check (estimated_value >= 0 and estimated_value <= 5000);

drop policy if exists "Visitantes envían su solicitud" on public.leads;
create policy "Visitantes envían su solicitud"
  on public.leads for insert
  to authenticated
  with check (stage = 'contactado' and project_id is null);
