-- =====================================================================
-- El tope de 5000 € en leads.estimated_value impedía cerrar una venta mayor (convertLead copia
-- el precio del proyecto al lead). El tope tiene sentido solo para lo que envía un visitante
-- desde el formulario público, así que se mueve a esa política; la tabla admite hasta 1.000.000.
-- =====================================================================

alter table public.leads drop constraint if exists leads_estimated_value_check;
alter table public.leads add constraint leads_estimated_value_check
  check (estimated_value >= 0 and estimated_value <= 1000000);

drop policy if exists "Visitantes envían su solicitud" on public.leads;
create policy "Visitantes envían su solicitud"
  on public.leads for insert
  to authenticated
  with check (
    stage = 'contactado'
    and project_id is null
    and source = 'formulario_web'
    and estimated_value between 0 and 5000
  );
