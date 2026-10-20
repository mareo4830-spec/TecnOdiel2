-- Portadas nuevas del SaaS (20, en 4 grupos) y contenido completo de la web de cada tenant.
--
-- 1. tenants.layout y projects.layout pasan a los grupos del SaaS: barber, women, beauty, unisex
--    (classic solo queda para la web propia de Adrián Millán, variante classic_prestige).
-- 2. tenants.site_content: todo lo que pinta la portada además de los datos básicos (presentación,
--    fotos, servicios, equipo, reseñas, preguntas, color de marca, animación y dueño con acceso
--    de administrador). El provisionado lo vuelca al negocio del SaaS.

alter table public.tenants drop constraint if exists tenants_layout_check;
alter table public.projects drop constraint if exists projects_layout_check;

-- Los proyectos con el layout antiguo pasan a barbería (el único grupo que existía en la práctica).
update public.projects set layout = 'barber' where layout in ('editorial', 'minimal', 'playful')
  or (layout = 'classic');
update public.tenants
   set layout = 'barber', layout_variant = null
 where layout in ('editorial', 'minimal', 'playful')
    or (layout = 'classic' and coalesce(layout_variant, '') <> 'classic_prestige');

alter table public.tenants
  add constraint tenants_layout_check check (layout in ('classic', 'barber', 'women', 'beauty', 'unisex'));
alter table public.projects
  add constraint projects_layout_check check (layout in ('classic', 'barber', 'women', 'beauty', 'unisex'));

alter table public.tenants
  add column if not exists site_content jsonb not null default '{}'::jsonb
    check (jsonb_typeof(site_content) = 'object');

comment on column public.tenants.site_content is
  'Contenido de la portada del SaaS: about, heroImageUrl, aboutImageUrl, placeImageUrl, accent, motion, '
  'services[], team[], reviews[], rating, reviewUrl, faq[], owner{email,name}. Lo vuelca el provisionado.';
