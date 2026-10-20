-- Datos de la web de cada lead (lanzamiento en Cloudflare Pages desde el CRM y plantilla elegida en
-- el formulario de la landing). Los rellenan el CRM y la importación de solicitudes de la landing.
alter table public.leads
  add column if not exists slug text,
  add column if not exists site_deployed boolean not null default false,
  add column if not exists cloudflare_url text,
  add column if not exists live_url text,
  add column if not exists template_id text,
  add column if not exists template_name text,
  add column if not exists services jsonb not null default '[]'::jsonb check (jsonb_typeof(services) = 'array');
