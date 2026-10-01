import React from 'react';
import { 
  Plus, 
  ExternalLink, 
  Calendar, 
  Settings, 
  ShieldCheck, 
  Globe, 
  Utensils, 
  Database,
  ArrowRight,
  Sparkles,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { getSupabaseConfig } from '../../lib/supabase';

export default function DashboardOverview({ 
  restaurants, 
  onOpenWizard, 
  onManageRestaurant
}) {
  const config = getSupabaseConfig();

  const totalReservations = restaurants.reduce(
    (acc, r) => acc + (r.reservations?.length || 0), 0
  );

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black relative">
      {/* Ambient Radial Spotlight matching TecnOdiel */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-radial-spotlight pointer-events-none opacity-80" />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 pb-20 relative z-10 space-y-10">
        {/* Hero Title Section */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-wider">Diseno Web de Alto Rendimiento para Hosteleria</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.08]">
            Consigue mas reservas directas y eleva la imagen de tu restaurante.
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Crea en pocos minutos una web elegante y personalizada a traves de un sencillo cuestionario. Tus clientes podran ver tu carta digital y reservar mesa desde su movil directamente a tu WhatsApp, sin pagar comisiones a plataformas externas.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenWizard}
              className="px-6 py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs transition flex items-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.4)]"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Disenar Mi Web con el Cuestionario</span>
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Webs Publicadas</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white">{restaurants.length}</span>
              <span className="text-xs text-emerald-400 font-mono">En Linea</span>
            </div>
            <span className="text-[11px] text-zinc-500 block">Listas para recibir clientes</span>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Reservas Confirmadas</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white">{totalReservations}</span>
              <span className="text-xs text-emerald-400 font-mono">100% Tuyas</span>
            </div>
            <span className="text-[11px] text-zinc-500 block">0 euros en comisiones de terceros</span>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Canal Directo</span>
            <div className="flex items-baseline gap-2">
              <span className="text-sm sm:text-base font-bold text-white truncate">
                WhatsApp & Web
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono block">
              Confirmacion Inmediata
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Personalizacion</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white">28</span>
              <span className="text-xs text-zinc-400 font-mono">Detalles</span>
            </div>
            <span className="text-[11px] text-zinc-500 block">Colores, carta, zonas y turnos</span>
          </div>
        </div>

        {/* Restaurants Directory */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Tus Restaurantes y Bares Activos
              </h2>
              <p className="text-xs text-zinc-400">
                Gestiona las reservas que entran, actualiza los platos de tu carta o comparte el enlace de tu web.
              </p>
            </div>
          </div>

          {/* Grid of Restaurant Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {restaurants.map((rest) => {
              const pColor = rest.primary_color || '#10b981';
              const reservationsCount = rest.reservations?.length || 0;

              return (
                <div
                  key={rest.id}
                  className="rounded-3xl bg-zinc-950 border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-lg"
                >
                  {/* Card Cover */}
                  <div className="relative h-44 overflow-hidden border-b border-white/5">
                    <img
                      src={rest.hero_image || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1920&q=80'}
                      alt={rest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

                    {/* Template Pill */}
                    <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: pColor }} />
                      <span className="capitalize">{rest.category === 'night_bar' ? 'Bar de Noche' : rest.category === 'gastronomic' ? 'Alta Cocina' : 'Restaurante'}</span>
                    </div>

                    {/* Web link pill with Cloudflare Pages URL */}
                    <div className="absolute bottom-3 left-3.5 flex items-center gap-1.5 text-[11px] font-mono text-zinc-200 bg-black/85 px-2.5 py-1 rounded-xl border border-amber-500/30 backdrop-blur-md">
                      <span className="font-bold text-[10px] text-amber-400">⚡</span>
                      <span className="text-amber-300 font-semibold">{rest.cloudflare_url ? rest.cloudflare_url.replace('https://', '') : `${rest.slug}.pages.dev`}</span>
                    </div>
                  </div>


                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
                          {rest.name}
                        </h3>
                        {rest.dress_code && (
                          <span className="text-[9px] font-mono text-zinc-500 border border-white/5 px-2 py-0.5 rounded-full">
                            {rest.dress_code}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {rest.slogan || rest.description}
                      </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-white/5 text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{reservationsCount} Reservas</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Utensils className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{rest.menu_categories?.[0]?.items?.length || 4} Platos en carta</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-1">
                      <a
                        href={rest.cloudflare_url || `#r/${rest.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-extrabold transition flex items-center justify-center gap-2 shadow-md"
                      >
                        <span>Ver Web en Línea</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Benefits Callout: Direct Sales & Savings */}
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950/80 border border-emerald-500/20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Mayor Rentabilidad & Fidelizacion de Clientes</span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Sin Comisiones por Cubierto ni Dependencia de Portales Externos
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Muchas plataformas cobran entre 1 y 3 euros por cada comensal que te envian. Con tu propia web, las reservas van directo a ti, los datos de tus clientes son tuyos y ofreces una experiencia de maxima categoria desde el primer clic.
            </p>
          </div>

          <button
            onClick={onOpenWizard}
            className="shrink-0 px-5 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold transition flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Crear Mi Web Directa</span>
          </button>
        </div>
      </main>
    </div>
  );
}
