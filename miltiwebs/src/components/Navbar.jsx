import React from 'react';
import { Plus, LayoutDashboard, ArrowLeft } from 'lucide-react';
import { getSupabaseConfig } from '../lib/supabase';

export default function Navbar({ onOpenWizard, onViewHome, currentView, onNavigateToPortal, onNavigateToLanding }) {
  const config = getSupabaseConfig();
  const isConnected = config.connected;

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-[#09090c]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={onViewHome}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onViewHome();
            }
          }}
          aria-label="Ir a catálogo de restaurantes"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center font-mono text-xs font-bold text-white tracking-widest group-hover:border-zinc-500 transition-colors">
            <span>TO</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-sm sm:text-base tracking-tight leading-none uppercase font-sans">
                TecnOdiel
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-semibold uppercase">
                STUDIO
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
              className="btn-industrial min-h-[40px] px-3 py-1.5 rounded border border-zinc-800 hover:border-zinc-600 bg-zinc-900 text-xs font-medium text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-white"
              title="Volver a la portada principal"
              aria-label="Volver a inicio"
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
            className="btn-industrial min-h-[40px] px-3 py-1.5 rounded border border-zinc-800 hover:border-zinc-600 bg-zinc-900 text-xs font-medium text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-emerald-400"
            title="Abrir Portal de Gestión de Clientes"
            aria-label="Abrir portal de clientes"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Portal Clientes</span>
          </button>

          {/* Cloud sync status badge */}
          <div
            className="hidden xl:inline-flex items-center gap-2 px-2.5 py-1 rounded text-[10px] font-mono border border-zinc-800 bg-zinc-900 text-zinc-300"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>SUPABASE CONECTADO</span>
          </div>

          {/* New Website Wizard CTA */}
          <button
            onClick={onOpenWizard}
            className="btn-industrial min-h-[40px] px-3.5 sm:px-4 py-2 rounded bg-white hover:bg-zinc-200 text-black font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-sm focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Crear nueva web de restaurante"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">Crear Mi Web</span>
            <span className="sm:hidden">Crear</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
