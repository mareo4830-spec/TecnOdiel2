-- ==============================================================================
-- TECNODIEL - TABLA DE SOLICITUDES (formulario de la landing -> Oficina Virtual)
-- Ejecutar una vez en Supabase > SQL Editor.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.leads (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at    timestamptz NOT NULL DEFAULT now(),
  name          text NOT NULL,
  business_name text,
  sector        text,
  city          text DEFAULT 'Huelva',
  email         text,
  phone         text,
  services      text[] DEFAULT '{}',
  message       text,
  source        text DEFAULT 'landing',
  stage         text NOT NULL DEFAULT 'nuevo',   -- nuevo | contactado | reunion | propuesta | negociacion | cerrado
  value         numeric DEFAULT 0,
  owner         text,
  notes         text
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Publico puede enviar solicitudes" ON public.leads;
DROP POLICY IF EXISTS "Oficina virtual gestiona solicitudes" ON public.leads;

-- Cualquiera puede ENVIAR una solicitud desde la landing.
CREATE POLICY "Publico puede enviar solicitudes" ON public.leads
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- NOTA: la Oficina Virtual usa una clave maestra en el navegador (no Supabase Auth),
-- por eso leer/actualizar con la clave anon es lo que la hace funcionar HOY. Esto deja
-- los datos de contacto legibles con la anon key. Cuando migréis el login de admin a
-- Supabase Auth, cambiad "anon" por "authenticated" en esta política.
CREATE POLICY "Oficina virtual gestiona solicitudes" ON public.leads
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Oficina virtual actualiza solicitudes" ON public.leads
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS leads_created_idx ON public.leads (created_at DESC);
