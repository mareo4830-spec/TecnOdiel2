-- ==============================================================================
-- TECNODIEL - SCRIPT MAESTRO DE BASE DE DATOS SUPABASE
-- Compatible con Multiwebs, Portal de Clientes y Landing Page
-- Soporte para Cloudflare Pages (*.pages.dev), Carta Digital y Reservas Directas
-- ==============================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA CENTRAL DE RESTAURANTES Y NEGOCIOS
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(64) UNIQUE NOT NULL,
    subdomain VARCHAR(64),
    cloudflare_url TEXT,
    published_url TEXT,
    cloudflare_status VARCHAR(32) DEFAULT 'ready',
    name VARCHAR(255) NOT NULL,
    slogan VARCHAR(255),
    description TEXT,
    category VARCHAR(64) DEFAULT 'night_bar',
    dress_code VARCHAR(128) DEFAULT 'Smart Casual / Elegante',
    ambiance VARCHAR(64) DEFAULT 'Elegante y exclusivo',
    template_id VARCHAR(64) DEFAULT 'nocturne',
    
    -- Disposición y textura visual
    hero_layout VARCHAR(32) DEFAULT 'centered',
    texture VARCHAR(32) DEFAULT 'spotlight',
    hero_image TEXT,
    logo_url TEXT,
    
    -- Cromática y tipografía
    primary_color VARCHAR(32) DEFAULT '#f59e0b',
    accent_color VARCHAR(32) DEFAULT '#fbbf24',
    background_color VARCHAR(32) DEFAULT '#050507',
    surface_color VARCHAR(32) DEFAULT '#0d0d12',
    font_family VARCHAR(64) DEFAULT 'Outfit',
    
    -- Motor de reservas directas
    booking_rules JSONB DEFAULT '{
      "max_guests_per_table": 8,
      "slot_interval_minutes": 30,
      "advance_notice": "Mismo día permitido",
      "confirmation_mode": "instant",
      "available_areas": ["Salón Central", "Terraza Climatizada", "Barra VIP Coctelería"]
    }'::jsonb,
    
    -- Horarios y logística
    lunch_shift JSONB DEFAULT '{"enabled": false, "open": "13:30", "close": "16:30"}'::jsonb,
    dinner_shift JSONB DEFAULT '{"enabled": true, "open": "19:30", "close": "02:30"}'::jsonb,
    closed_days JSONB DEFAULT '["Lunes"]'::jsonb,
    dietary_filters JSONB DEFAULT '["Gluten Free", "Vegano", "Sin Lácteos"]'::jsonb,
    
    -- Canales directos y ubicación
    phone VARCHAR(32),
    whatsapp_number VARCHAR(32),
    email VARCHAR(128),
    address VARCHAR(255),
    city VARCHAR(128) DEFAULT 'Huelva',
    postal_code VARCHAR(16) DEFAULT '21001',
    google_maps_url TEXT,
    instagram_url TEXT,
    
    -- Metadatos SEO Schema.org
    seo_title VARCHAR(255),
    seo_description TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Si la tabla ya existía, añadir columnas de Cloudflare si no existen:
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS cloudflare_url TEXT;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS published_url TEXT;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS cloudflare_status VARCHAR(32) DEFAULT 'ready';

-- Índices de búsqueda
CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON public.restaurants(slug);
CREATE INDEX IF NOT EXISTS idx_restaurants_subdomain ON public.restaurants(subdomain);

-- 3. CATEGORÍAS DE CARTA DIGITAL
CREATE TABLE IF NOT EXISTS public.menu_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_menu_categories_restaurant ON public.menu_categories(restaurant_id);

-- 4. PLATOS Y BEBIDAS DE CARTA DIGITAL
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.menu_categories(id) ON DELETE SET NULL,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    allergens JSONB DEFAULT '[]'::jsonb,
    badge VARCHAR(64),
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant ON public.menu_items(restaurant_id);

-- 5. RESERVAS DIRECTAS DE MESAS
CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    booking_code VARCHAR(16) NOT NULL,
    customer_name VARCHAR(128) NOT NULL,
    customer_email VARCHAR(128),
    customer_phone VARCHAR(32) NOT NULL,
    guests_count INT NOT NULL DEFAULT 2,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    area VARCHAR(64) DEFAULT 'Salón Central',
    special_requests TEXT,
    status VARCHAR(32) DEFAULT 'confirmed', -- 'pending', 'confirmed', 'seated', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reservations_restaurant_date ON public.reservations(restaurant_id, reservation_date);
CREATE INDEX IF NOT EXISTS idx_reservations_code ON public.reservations(booking_code);

-- 6. SEGURIDAD Y PERMISOS ROW-LEVEL SECURITY (RLS)
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Limpieza de políticas previas si existían
DROP POLICY IF EXISTS "Publico puede ver restaurantes" ON public.restaurants;
DROP POLICY IF EXISTS "Publico puede ver categorias" ON public.menu_categories;
DROP POLICY IF EXISTS "Publico puede ver carta" ON public.menu_items;
DROP POLICY IF EXISTS "Publico puede crear reservas" ON public.reservations;
DROP POLICY IF EXISTS "Publico puede consultar su reserva por codigo" ON public.reservations;
DROP POLICY IF EXISTS "Gestion total de restaurantes" ON public.restaurants;
DROP POLICY IF EXISTS "Gestion total de categorias" ON public.menu_categories;
DROP POLICY IF EXISTS "Gestion total de platos" ON public.menu_items;
DROP POLICY IF EXISTS "Gestion total de reservas" ON public.reservations;

-- Políticas de lectura pública
CREATE POLICY "Publico puede ver restaurantes" ON public.restaurants FOR SELECT USING (true);
CREATE POLICY "Publico puede ver categorias" ON public.menu_categories FOR SELECT USING (true);
CREATE POLICY "Publico puede ver carta" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Publico puede crear reservas" ON public.reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Publico puede consultar su reserva por codigo" ON public.reservations FOR SELECT USING (true);

-- Políticas de gestión (Portal de Clientes y Multiwebs)
CREATE POLICY "Crear restaurante" ON public.restaurants FOR INSERT WITH CHECK (true);
CREATE POLICY "Modificar restaurante" ON public.restaurants FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Gestion total de categorias" ON public.menu_categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Gestion total de platos" ON public.menu_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Gestion total de reservas" ON public.reservations FOR ALL USING (true) WITH CHECK (true);

-- Blindaje contra borrado no autorizado (OWASP A01: Broken Access Control)
CREATE OR REPLACE FUNCTION delete_restaurant_admin(target_id UUID, master_pin TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF master_pin = 'tecnodiel2026' THEN
        DELETE FROM public.restaurants WHERE id = target_id;
        RETURN true;
    ELSE
        RAISE EXCEPTION 'Acceso denegado: Clave de administrador incorrecta';
    END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION delete_restaurant_admin(UUID, TEXT) TO anon, authenticated;

-- 7. REGISTRO DEMO INICIAL PARA PRUEBAS INMEDIATAS
INSERT INTO public.restaurants (
    slug, subdomain, cloudflare_url, published_url, name, slogan, description, category,
    template_id, primary_color, accent_color, phone, whatsapp_number, address, city
) VALUES (
    'marea-negra',
    'marea-negra.pages.dev',
    'https://marea-negra.pages.dev',
    'https://marea-negra.pages.dev',
    'Marea Negra Bar & Lounge',
    'Coctelería de autor y bocados de noche',
    'Un espacio íntimo y refinado donde la mixología contemporánea se encuentra con creaciones culinarias de origen y acústica envolvente.',
    'night_bar',
    'nocturne',
    '#f59e0b',
    '#fbbf24',
    '+34 959 10 20 30',
    '+34600112233',
    'Calle Marina, 14',
    'Huelva'
) ON CONFLICT (slug) DO UPDATE SET 
    cloudflare_url = EXCLUDED.cloudflare_url,
    published_url = EXCLUDED.published_url;
