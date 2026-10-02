import React from 'react';
import { Globe, LogOut, ExternalLink, ShieldCheck, Sparkles, ArrowLeft, UtensilsCrossed, Shield, Stethoscope } from 'lucide-react';

export default function Navbar({ 
  restaurant, 
  onSwitchRestaurant, 
  onNavigateToMultiwebs, 
  onNavigateToCyS,
  onNavigateToLanding,
  isAdminImpersonating,
  onBackToAdmin
}) {
  const isClinic = !!(
    restaurant?.collegiate_number || 
    ['dental', 'policlinica', 'fisioterapia', 'estetica', 'psicologia', 'veterinaria', 'oftalmologia', 'podologia', 'nutricion'].includes(restaurant?.category)
  );

  const liveUrl = restaurant?.custom_domain 
    ? `https://${restaurant.custom_domain}` 
    : (isClinic ? `/#/c/${restaurant?.slug || ''}` : `/#/r/${restaurant?.slug || ''}`);

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-black/85 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0">
            <img 
              src="/logo.png" 
              alt="TecnOdiel Logo" 
              className={`w-full h-full object-contain ${
                isClinic 
                  ? 'drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]' 
                  : 'drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'
              }`} 
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-base tracking-tight leading-none">
                TecnOdiel
              </span>
              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border font-semibold uppercase ${
                isClinic 
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' 
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              }`}>
                {isAdminImpersonating ? 'Vista Admin' : (isClinic ? 'Portal Clínico' : 'Tu Portal')}
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono tracking-wider block">
              {restaurant?.name || (isClinic ? 'Gestión Clínica' : 'Panel de Gestión')}
            </span>
          </div>
        </div>

        {/* Center / Right status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* If admin is impersonating, button to return to Master Admin */}
          {isAdminImpersonating && onBackToAdmin && (
            <button
              type="button"
              onClick={onBackToAdmin}
              className="px-3.5 py-1.5 rounded-xl border border-emerald-500/50 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-bold transition flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Volver a Panel Maestro Admin</span>
            </button>
          )}

          {/* Back to Landing */}
          {onNavigateToLanding && (
            <button
              type="button"
              onClick={onNavigateToLanding}
              className="btn-industrial px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900/90 hover:bg-zinc-800 text-xs font-mono font-medium text-zinc-300 hover:text-white transition flex items-center gap-1.5 min-h-[40px] sm:min-h-[44px] cursor-pointer"
              title="Volver a la portada de TecnOdiel"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span>Inicio</span>
            </button>
          )}

          {/* Navigate to Multiwebs Restaurantes */}
          {onNavigateToMultiwebs && (
            <button
              type="button"
              onClick={onNavigateToMultiwebs}
              className="btn-industrial px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900/90 hover:bg-zinc-800 text-xs font-mono font-medium text-zinc-300 hover:text-white transition flex items-center gap-1.5 min-h-[40px] sm:min-h-[44px] cursor-pointer"
              title="Ver catálogo de restaurantes"
            >
              <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Restaurantes</span>
            </button>
          )}

          {/* Navigate to Multiwebs Clínicas */}
          {onNavigateToCyS && (
            <button
              type="button"
              onClick={onNavigateToCyS}
              className="btn-industrial px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900/90 hover:bg-zinc-800 text-xs font-mono font-medium text-zinc-300 hover:text-white transition flex items-center gap-1.5 min-h-[40px] sm:min-h-[44px] cursor-pointer"
              title="Ver catálogo de clínicas y salud"
            >
              <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Clínicas</span>
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

          {/* Logout / Exit */}
          <button
            onClick={onSwitchRestaurant}
            className="px-3 py-1.5 rounded-xl border border-white/10 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5"
            title="Cerrar sesión de este panel"
          >
            <LogOut className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
