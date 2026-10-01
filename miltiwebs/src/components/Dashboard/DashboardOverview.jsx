import React, { useState } from 'react';
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
  MessageSquare,
  Copy,
  Check,
  Edit3,
  QrCode
} from 'lucide-react';
import { getSupabaseConfig } from '../../lib/supabase';

export default function DashboardOverview({ 
  restaurants, 
  onOpenWizard, 
  onManageRestaurant
}) {
  const config = getSupabaseConfig();
  const [copiedId, setCopiedId] = useState(null);

  const totalReservations = restaurants.reduce(
    (acc, r) => acc + (r.reservations?.length || 0), 0
  );

  const handleCopyLink = (rest) => {
    const url = rest.custom_domain 
      ? `https://${rest.custom_domain}` 
      : `${window.location.origin}/#/r/${rest.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(rest.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black relative">
      {/* Ambient Radial Spotlight matching TecnOdiel */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-radial-spotlight pointer-events-none opacity-80" />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 pb-20 relative z-10 space-y-10">
        {/* Hero Title Section */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-wider">WEBS PARA HOSTELERÍA // HUELVA</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.08]">
            Tu restaurante en internet. Mesas llenas, 0€ comisiones.
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Tu carta digital interactiva con QR y reservas directas a tu WhatsApp. Diseñada para móvil y lista en solo 2 minutos.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenWizard}
              className="px-6 py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs transition flex items-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.4)]"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Crear Web de Mi Restaurante</span>
            </button>
          </div>
        </div>

        {/* 3-Step Intuitive Process Guide */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-zinc-950/60 border border-white/10 text-xs">
          <div className="flex items-center gap-3 p-2">
            <span className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono font-bold flex items-center justify-center text-xs shrink-0">1</span>
            <div>
              <strong className="text-white block font-semibold">Elige tu estilo</strong>
              <span className="text-[11px] text-zinc-400">Taberna, asador, copas, marisquería o alta cocina.</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2 border-t sm:border-t-0 sm:border-l border-white/5">
            <span className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono font-bold flex items-center justify-center text-xs shrink-0">2</span>
            <div>
              <strong className="text-white block font-semibold">Personaliza tu carta</strong>
              <span className="text-[11px] text-zinc-400">Tus platos, fotos apetitosas y precios actualizados.</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2 border-t sm:border-t-0 sm:border-l border-white/5">
            <span className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono font-bold flex items-center justify-center text-xs shrink-0">3</span>
            <div>
              <strong className="text-white block font-semibold">Recibe reservas directas</strong>
              <span className="text-[11px] text-zinc-400">Directo a tu WhatsApp, sin pagar intermediarios.</span>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Webs Publicadas</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white">{restaurants.length}</span>
              <span className="text-xs text-emerald-400 font-mono">En Línea</span>
            </div>
            <span className="text-[11px] text-zinc-500 block">Listas para recibir clientes</span>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Reservas Confirmadas</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white">{totalReservations}</span>
              <span className="text-xs text-emerald-400 font-mono">100% Tuyas</span>
            </div>
            <span className="text-[11px] text-zinc-500 block">0€ en comisiones a intermediarios</span>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Canal Directo</span>
            <div className="flex items-baseline gap-2">
              <span className="text-sm sm:text-base font-bold text-white truncate">
                WhatsApp & Web
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono block">
              Confirmación Inmediata
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Carta Digital QR</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white">0 PDFs</span>
              <span className="text-xs text-emerald-400 font-mono">Rápido</span>
            </div>
            <span className="text-[11px] text-zinc-500 block">Fotos, alérgenos y precios al día</span>
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
                Entra a gestionar tu carta, ver tus reservas o abrir tu web en vivo.
              </p>
            </div>
          </div>

          {/* Grid of Restaurant Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {restaurants.map((rest) => {
              const pColor = rest.primary_color || '#10b981';
              const reservationsCount = rest.reservations?.length || 0;
              const isCopied = copiedId === rest.id;

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

                    {/* Action Buttons: Intuitive & Complete */}
                    <div className="space-y-2 pt-1">
                      <div className="grid grid-cols-2 gap-2">
                        {/* Primary Button: Open Client Management Portal */}
                        <button
                          type="button"
                          onClick={() => {
                            if (onManageRestaurant) {
                              onManageRestaurant(rest);
                            } else {
                              window.location.hash = `#/portal?r=${rest.slug}`;
                            }
                          }}
                          className="py-2.5 px-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-extrabold transition flex items-center justify-center gap-1.5 shadow-md"
                          title="Entrar a gestionar carta y reservas de este restaurante"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Gestionar</span>
                        </button>

                        {/* View Live Web */}
                        <a
                          href={rest.custom_domain ? `https://${rest.custom_domain}` : `/#/r/${rest.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold border border-white/10 transition flex items-center justify-center gap-1.5"
                          title="Abrir web pública en una pestaña nueva"
                        >
                          <span>Ver Web</span>
                          <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                        </a>
                      </div>

                      {/* Quick copy link */}
                      <button
                        type="button"
                        onClick={() => handleCopyLink(rest)}
                        className="w-full py-1.5 px-3 rounded-lg bg-zinc-950/60 hover:bg-zinc-900 border border-white/5 hover:border-white/10 text-zinc-400 hover:text-zinc-200 text-[11px] font-mono transition flex items-center justify-center gap-1.5"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">¡Enlace copiado al portapapeles!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copiar enlace público</span>
                          </>
                        )}
                      </button>
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
              <span>Ahorra comisiones por cada comensal</span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              0€ comisiones por cubierto. 100% de las ganancias para ti.
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Otras plataformas cobran hasta 3€ por cada reserva que te envían. Con tu propia web de TecnOdiel, las reservas van directas a tu WhatsApp y los clientes fidelizados son siempre tuyos.
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
