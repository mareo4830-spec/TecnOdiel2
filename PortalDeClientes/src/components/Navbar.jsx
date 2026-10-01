import React from 'react';
import { Globe, LogOut, ExternalLink, ShieldCheck, Sparkles, ArrowLeft, UtensilsCrossed } from 'lucide-react';

export default function Navbar({ restaurant, onSwitchRestaurant, onNavigateToMultiwebs, onNavigateToLanding }) {
  const liveUrl = restaurant?.cloudflare_url || restaurant?.published_url || `https://${restaurant?.slug || 'web'}.pages.dev`;

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-black/85 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-black border border-emerald-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-5 h-5">
              <path d="M30 70 L50 30 L70 70" stroke="#10b981" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="50" cy="30" r="7" fill="#34d399" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-base tracking-tight leading-none">
                TecnOdiel
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold uppercase">
                Portal Clientes
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono tracking-wider block">
              {restaurant?.name || 'Panel de Gestión'}
            </span>
          </div>
        </div>

        {/* Center / Right status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Back to Landing */}
          {onNavigateToLanding && (
            <button
              type="button"
              onClick={onNavigateToLanding}
              className="emil-pressable px-3 py-1.5 rounded-xl border border-white/10 bg-zinc-900/60 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition flex items-center gap-1.5"
              title="Volver al inicio"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Inicio</span>
            </button>
          )}

          {/* Go to Multiwebs Creator */}
          {onNavigateToMultiwebs && (
            <button
              type="button"
              onClick={onNavigateToMultiwebs}
              className="emil-pressable px-3 py-1.5 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition flex items-center gap-1.5"
              title="Ir al creador de webs para restaurantes"
            >
              <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Creador de Webs</span>
            </button>
          )}

          {/* Cloudflare Pages Live Link */}
          <a
            href={liveUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-xs font-mono transition"
            title="Abrir tu web pública en Cloudflare Pages"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-semibold">{restaurant?.slug}.pages.dev</span>
            <ExternalLink className="w-3 h-3 text-amber-400" />
          </a>

          {/* Switch Restaurant / Logout */}
          <button
            onClick={onSwitchRestaurant}
            className="px-3 py-1.5 rounded-xl border border-white/10 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden md:inline">Cambiar Negocio</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
