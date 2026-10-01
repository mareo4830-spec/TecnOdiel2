import React from 'react';
import { Sparkles, Database, Plus, Globe, Shield, Terminal, ArrowUpRight, LayoutDashboard, ArrowLeft, Store } from 'lucide-react';
import { getSupabaseConfig } from '../lib/supabase';

export default function Navbar({ onOpenWizard, onViewHome, currentView, onNavigateToPortal, onNavigateToLanding }) {
  const config = getSupabaseConfig();
  const isConnected = config.connected;

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/85 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={onViewHome}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-black border border-emerald-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:border-emerald-400 transition">
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
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                Studio
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono tracking-wider hidden sm:block">
              Creador de Webs para Restaurantes
            </span>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Back to Landing */}
          {onNavigateToLanding && (
            <button
              type="button"
              onClick={onNavigateToLanding}
              className="emil-pressable px-3 py-1.5 rounded-xl border border-white/10 bg-zinc-900/60 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition flex items-center gap-1.5"
              title="Volver a la portada principal"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Inicio</span>
            </button>
          )}

          {/* Go to Portal */}
          <button
            type="button"
            onClick={() => {
              if (onNavigateToPortal) {
                onNavigateToPortal();
              } else {
                window.location.hash = '#/portal';
              }
            }}
            className="emil-pressable px-3 py-1.5 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition flex items-center gap-1.5"
            title="Abrir Portal de Gestión de Clientes"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Portal Clientes</span>
          </button>

          {/* Cloud sync status badge */}
          <div
            className="hidden xl:inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Supabase Conectado</span>
          </div>

          {/* New Website Wizard CTA */}
          <button
            onClick={onOpenWizard}
            className="px-3.5 sm:px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-extrabold transition flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.35)]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden xs:inline">Crear Mi Web</span>
            <span className="xs:hidden">Crear</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
