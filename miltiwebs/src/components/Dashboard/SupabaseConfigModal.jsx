import React, { useState } from 'react';
import { X, Database, CheckCircle2, Copy, Key, Globe, ShieldCheck, Check } from 'lucide-react';
import { getSupabaseConfig, saveSupabaseConfig } from '../../lib/supabase';

export default function SupabaseConfigModal({ isOpen, onClose, onConfigSaved }) {
  if (!isOpen) return null;

  const current = getSupabaseConfig();
  const [url, setUrl] = useState(current.url || '');
  const [anonKey, setAnonKey] = useState(current.anonKey || '');
  const [copied, setCopied] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const sqlSchemaSnippet = `-- 1. TABLA DE RESTAURANTES (28 PARAMETROS ARQUITECTONICOS)
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(64) UNIQUE NOT NULL,
    subdomain VARCHAR(64) UNIQUE,
    name VARCHAR(255) NOT NULL,
    slogan VARCHAR(255),
    description TEXT,
    category VARCHAR(64) DEFAULT 'night_bar',
    dress_code VARCHAR(128) DEFAULT 'Smart Casual / Elegante',
    template_id VARCHAR(64) DEFAULT 'nocturne',
    hero_layout VARCHAR(32) DEFAULT 'centered',
    texture VARCHAR(32) DEFAULT 'spotlight',
    primary_color VARCHAR(32) DEFAULT '#f59e0b',
    accent_color VARCHAR(32) DEFAULT '#fbbf24',
    background_color VARCHAR(32) DEFAULT '#050507',
    surface_color VARCHAR(32) DEFAULT '#0d0d12',
    font_family VARCHAR(64) DEFAULT 'Outfit',
    hero_image TEXT,
    phone VARCHAR(32),
    whatsapp_number VARCHAR(32),
    email VARCHAR(128),
    address VARCHAR(255),
    city VARCHAR(128) DEFAULT 'Huelva',
    postal_code VARCHAR(16) DEFAULT '21001',
    booking_rules JSONB DEFAULT '{"max_guests_per_table": 8, "available_areas": ["Salon Central", "Terraza", "Barra VIP"]}'::jsonb,
    lunch_shift JSONB DEFAULT '{"enabled": false, "open": "13:30", "close": "16:30"}'::jsonb,
    dinner_shift JSONB DEFAULT '{"enabled": true, "open": "19:30", "close": "02:30"}'::jsonb,
    closed_days JSONB DEFAULT '["Lunes"]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 2. TABLA DE CATEGORIAS DE CARTA
CREATE TABLE IF NOT EXISTS public.menu_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 3. TABLA DE PLATOS Y PRODUCTOS
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.menu_categories(id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    badge VARCHAR(64),
    allergens TEXT[] DEFAULT '{}',
    is_available BOOLEAN DEFAULT true,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 4. TABLA DE RESERVAS DIRECTAS
CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    booking_code VARCHAR(16) NOT NULL,
    customer_name VARCHAR(128) NOT NULL,
    customer_phone VARCHAR(32) NOT NULL,
    customer_email VARCHAR(128),
    guests_count INT DEFAULT 2,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    area VARCHAR(64) DEFAULT 'Salon Central',
    special_requests TEXT,
    status VARCHAR(32) DEFAULT 'confirmed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 5. SEGURIDAD Y PRIVACIDAD DE DATOS (POLITICAS RLS)
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura publica de restaurantes" ON public.restaurants FOR SELECT USING (true);
CREATE POLICY "Modificacion restaurantes" ON public.restaurants FOR ALL USING (true);
CREATE POLICY "Lectura publica de categorias" ON public.menu_categories FOR SELECT USING (true);
CREATE POLICY "Gestion categorias" ON public.menu_categories FOR ALL USING (true);
CREATE POLICY "Lectura publica de platos" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Gestion platos" ON public.menu_items FOR ALL USING (true);
CREATE POLICY "Creacion publica de reservas" ON public.reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Lectura reservas" ON public.reservations FOR SELECT USING (true);
`;

  const handleSave = (e) => {
    e.preventDefault();
    if (!url.trim() || !anonKey.trim()) {
      setStatusMsg('Por favor introduce la direccion y clave de tu nube.');
      return;
    }
    const saved = saveSupabaseConfig(url, anonKey);
    setStatusMsg('Conexion guardada con exito. Tus datos estan protegidos y sincronizados.');
    if (onConfigSaved) onConfigSaved(saved);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(sqlSchemaSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl bg-zinc-950 border border-emerald-500/30 shadow-[0_0_60px_rgba(0,0,0,0.95)] overflow-hidden text-zinc-100">
        {/* Glow Header */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Copia de Seguridad y Sincronizacion de Tus Clientes
              </h3>
              <p className="text-xs text-zinc-400">
                Guarda tus reservas, cartas y telefonos en tu propio espacio seguro
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
          {statusMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}

          <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/5 text-xs text-zinc-300 space-y-1">
            <div className="flex items-center gap-1.5 text-white font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Tus Datos y tus Clientes te Pertenecen al 100%</span>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              A diferencia de las plataformas habituales que retienen la informacion de tus comensales, aqui cada telefono, nombre y reserva queda guardado en tu propio servidor privado en la nube. Totalmente seguro, permanente y sin pagar un solo euro en comisiones.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Direccion de Tu Servidor en la Nube (URL)
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="https://tu-espacio-privado.co"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Clave de Acceso Seguro (API Key)
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Pega aqui la clave de acceso seguro de tu servidor..."
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              <span>Conectar y Proteger Mis Datos</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </form>

          {/* Helper info */}
          <div className="pt-2 border-t border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-300">
                Configuracion de Tablas del Servidor
              </span>
              <button
                type="button"
                onClick={handleCopySQL}
                className="px-2.5 py-1 rounded-lg border border-white/10 bg-zinc-900 text-[11px] text-zinc-300 hover:text-white flex items-center gap-1.5 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado al Portapapeles' : 'Copiar Instrucciones'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-black border border-white/5 text-[10px] font-mono text-zinc-400 overflow-x-auto max-h-28">
              {sqlSchemaSnippet}
            </pre>
            <p className="text-[11px] text-zinc-500">
              Si vas a conectar tu propia base de datos, ejecuta estas instrucciones una sola vez en tu panel de control para que tus restaurantes y reservas se organicen automaticamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
