import React, { useState } from 'react';
import { 
  Utensils, 
  Plus, 
  Calendar, 
  ShieldCheck, 
  Copy, 
  Check, 
  Sparkles, 
  Eye,
  Flame,
  Wine,
  Coffee,
  Compass,
  ChefHat,
  Zap,
  QrCode,
  Edit3
} from 'lucide-react';
import { RESTAURANT_CATEGORIES } from '../../lib/mockData';
import { isRestaurantEntity } from '../../lib/supabase';

export default function DashboardOverview({ 
  restaurants = [], 
  onOpenWizard, 
  onManageRestaurant 
}) {
  const [filterCategory, setFilterCategory] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  // Guarantee only restaurant entities are processed (total clinic isolation)
  const pureRestaurants = restaurants.filter(isRestaurantEntity);

  const totalReservations = pureRestaurants.reduce(
    (acc, r) => acc + (r.reservations?.length || 0), 0
  );

  const filteredRestaurants = filterCategory === 'all'
    ? pureRestaurants
    : pureRestaurants.filter(r => r.category === filterCategory);

  const handleCopyLink = (rest) => {
    const url = rest.custom_domain 
      ? `https://${rest.custom_domain}` 
      : `${window.location.origin}/#/r/${rest.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(rest.id || rest.slug);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getCategoryIcon = (catId) => {
    switch (catId) {
      case 'asador':
        return Flame;
      case 'night_bar':
        return Wine;
      case 'cafe':
        return Coffee;
      case 'mediterranean':
        return Compass;
      case 'pizzeria':
        return ChefHat;
      case 'burger':
        return Zap;
      case 'gastronomic':
        return Sparkles;
      default:
        return Utensils;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-black text-zinc-100 p-4 sm:p-8 space-y-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Banner */}
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-950/60 via-zinc-950 to-zinc-950 border border-emerald-500/20 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>TECNODIEL RESTAURANTES — ECOSISTEMA HOSTELERO</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Generador de Webs para Restaurantes & Bares
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                Crea en 2 minutos la web oficial de tu restaurante, taberna, asador o bar. Carta digital QR interactiva, fotos apetitosas y reservas directas a tu WhatsApp sin pagar comisiones a intermediarios.
              </p>
            </div>

            <button
              onClick={onOpenWizard}
              className="btn-industrial px-6 py-3.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-sm transition flex items-center gap-2.5 shadow-[0_0_30px_rgba(16,185,129,0.4)] shrink-0 cursor-pointer"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              <span>Crear Nueva Web de Restaurante</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 border-t border-white/10 mt-6">
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono">
                <Utensils className="w-4 h-4" />
                <span>RESTAURANTES ACTIVOS</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">{pureRestaurants.length}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono">
                <Calendar className="w-4 h-4" />
                <span>RESERVAS HOY</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">{totalReservations || 14}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono">
                <QrCode className="w-4 h-4" />
                <span>CARTA DIGITAL QR</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">100% Sin PDFs</div>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>COMISIONES INTERMEDIARIOS</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">0€</div>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => setFilterCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl border transition shrink-0 cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-emerald-500 text-black font-extrabold shadow-sm'
                : 'bg-zinc-900 border-white/10 text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            Todos los Estilos ({pureRestaurants.length})
          </button>
          {RESTAURANT_CATEGORIES.map(cat => {
            const count = pureRestaurants.filter(r => r.category === cat.id).length;
            const CategoryIcon = getCategoryIcon(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl border transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  filterCategory === cat.id
                    ? 'bg-emerald-500 text-black font-extrabold shadow-sm'
                    : 'bg-zinc-900 border-white/10 text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                <CategoryIcon className="w-3.5 h-3.5" />
                <span>{cat.name}</span>
                {count > 0 && <span className="opacity-70">({count})</span>}
              </button>
            );
          })}
        </div>

        {/* Restaurants Grid (2 Columns, Matching CyS Aesthetic) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRestaurants.map(rest => {
            const catObj = RESTAURANT_CATEGORIES.find(c => c.id === rest.category);
            const CardIcon = getCategoryIcon(rest.category);
            const isCopied = copiedId === (rest.id || rest.slug);

            return (
              <div
                key={rest.id || rest.slug}
                className="p-5 sm:p-6 rounded-2xl bg-zinc-950 border border-white/10 hover:border-emerald-500/40 transition shadow-xl space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Top line */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-emerald-400 shadow-md shrink-0"
                        style={{ backgroundColor: `${rest.primary_color || '#10b981'}25` }}
                      >
                        <CardIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-emerald-300 transition">
                          {rest.name}
                        </h3>
                        <p className="text-xs text-zinc-400 font-mono">
                          {catObj?.name || rest.dress_code || 'Restaurante & Bar'}
                        </p>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono uppercase font-bold shrink-0">
                      Activa 24/7
                    </span>
                  </div>

                  {/* Slogan */}
                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed font-sans">
                    {rest.slogan || rest.description}
                  </p>

                  {/* URLs */}
                  <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5 space-y-1.5 font-mono text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">SUBDOMINIO TECNODIEL:</span>
                      <span className="text-emerald-400 font-semibold">{rest.slug}.tecnodiel.app</span>
                    </div>
                    {rest.cloudflare_url && (
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">CLOUDFLARE PAGES:</span>
                        <span className="text-zinc-300">{rest.cloudflare_url.replace('https://', '')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyLink(rest)}
                    className="p-2 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition cursor-pointer text-xs flex items-center gap-1.5"
                    title="Copiar enlace de la web"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copiado' : 'Copiar URL'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (onManageRestaurant) {
                          onManageRestaurant(rest);
                        } else {
                          window.location.hash = `#/portal?r=${rest.slug}`;
                        }
                      }}
                      className="px-3 py-2 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                      title="Gestionar carta y reservas en el portal"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Gestionar</span>
                    </button>

                    <a
                      href={rest.custom_domain ? `https://${rest.custom_domain}` : `/#/r/${rest.slug}`}
                      className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs transition flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Ver Web</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
