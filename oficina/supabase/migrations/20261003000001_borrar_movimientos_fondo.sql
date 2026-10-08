-- =====================================================================
-- Los socios pueden eliminar movimientos del fondo común (botón «Eliminar»).
-- Siguen sin poder editarlos: un movimiento mal puesto se borra y se vuelve a crear.
-- =====================================================================

grant delete on public.fund_movements to authenticated;
