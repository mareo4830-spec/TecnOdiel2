import React from 'react';
import { Plus, Stethoscope, Globe, ExternalLink, ShieldCheck, LayoutDashboard } from 'lucide-react';

export default function Navbar({ 
  onOpenWizard, 
  onViewHome, 
  currentView, 
  onNavigateToLanding, 
  onNavigateToMultiwebs,
  onNavigateToPortal
}) {
  const handleGoRestaurantes = () => {
    if (onNavigateToMultiwebs) {
      onNavigateToMultiwebs();
    } else {
      window.location.hash = '#/multiwebs';
    }
  };

  const handleGoLanding = () => {
    if (onNavigateToLanding) {
      onNavigateToLanding();
    } else {
      window.location.hash = '#/';
    }
  };

  const handleGoPortal = () => {
    if (onNavigateToPortal) {
      onNavigateToPortal();
    } else {
      window.location.hash = '#/portal';
    }
  };

  return (
    <header className="h-16 border-b border-white/10 bg-zinc-950/90 backdrop-blur-2xl px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <button
          onClick={onViewHome || handleGoLanding}
          className="flex items-center gap-2.5 text-left group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-black border border-cyan-500/30 overflow-hidden flex items-center justify-center group-hover:scale-105 group-hover:border-cyan-400 transition shadow-sm">
            <img src="/logo.png" alt="TecnOdiel Logo" className="w-full h-full object-contain p-0.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">
                Tecn<span className="text-cyan-400">Odiel</span> <span className="text-cyan-300">CyS</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-semibold">
                Clínicas & Salud
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block font-sans">
              Plataforma de Webs Médicas & Cita Previa 24/7
            </p>
          </div>
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={handleGoLanding}
          className="px-3 py-1.5 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition hidden sm:flex items-center gap-1.5 cursor-pointer"
          title="Ir al inicio de TecnOdiel"
        >
          <span>Inicio TecnOdiel</span>
        </button>

        <button
          onClick={handleGoRestaurantes}
          className="px-3 py-1.5 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition hidden md:flex items-center gap-1.5 cursor-pointer"
          title="Abrir plataforma de Restaurantes"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span>Multiwebs Restaurantes</span>
        </button>

        <button
          onClick={handleGoPortal}
          className="px-3 py-1.5 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition hidden lg:flex items-center gap-1.5 cursor-pointer"
          title="Abrir portal de clientes y gestión médica"
        >
          <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
          <span>Portal Clientes</span>
        </button>

        <button
          onClick={onOpenWizard}
          className="btn-industrial px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-extrabold transition flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.35)] cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Nueva Clínica</span>
        </button>
      </div>
    </header>
  );
}
