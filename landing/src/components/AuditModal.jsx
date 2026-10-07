import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UtensilsCrossed, Stethoscope, Store, Briefcase, ArrowRight, Check } from 'lucide-react';

export default function AuditModal({ isOpen, onClose, onNavigateToMultiwebs, onNavigateToCyS }) {
  const [selectedDisabledSector, setSelectedDisabledSector] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setSelectedDisabledSector(null);
      setIsNavigating(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSelectRestaurant = () => {
    setIsNavigating(true);
    setTimeout(() => {
      if (onClose) onClose();
      if (onNavigateToMultiwebs) {
        onNavigateToMultiwebs();
      } else {
        window.location.hash = '#/multiwebs';
      }
    }, 200);
  };

  const handleSelectClinic = () => {
    setIsNavigating(true);
    setTimeout(() => {
      if (onClose) onClose();
      if (onNavigateToCyS) {
        onNavigateToCyS();
      } else {
        window.location.hash = '#/cys';
      }
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-[#121212] border border-white/20 p-6 sm:p-10 shadow-2xl overflow-hidden font-sans text-white"
        >
          {/* Header Banch */}
          <div className="flex items-start justify-between border-b border-white/10 pb-6 mb-8">
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#6DD94B] font-bold block">
                // CONFIGURADOR EN TIEMPO REAL
              </span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight leading-none">
                SELECCIONA TU SECTOR
              </h2>
              <p className="text-xs font-mono text-zinc-400 mt-1">
                Tu web lista en 2 minutos con las 6 plantillas exclusivas y precios desde 99€.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 border border-white/20 hover:border-white text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Opciones Principales Estilo Banch */}
          <div className="space-y-4">
            {/* OPCIÓN 1: HOSTELERÍA */}
            <button
              onClick={handleSelectRestaurant}
              className="w-full p-6 bg-[#232323] hover:bg-black border border-white/10 hover:border-[#6DD94B] text-left transition-all duration-300 group flex items-start justify-between gap-4 cursor-pointer"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-[#6DD94B]">01</span>
                  <h3 className="text-lg sm:text-xl font-black uppercase text-white group-hover:text-[#6DD94B] transition-colors">
                    Hostelería & Gastronomía
                  </h3>
                  <span className="text-[9px] font-mono px-2 py-0.5 border border-[#6DD94B]/40 bg-[#6DD94B]/10 text-[#6DD94B] uppercase">
                    DISPONIBLE AHORA
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-light max-w-md leading-relaxed">
                  Restaurantes, bares, coctelerías y asadores. Carta digital táctil con fotos irresistibles, 0 descargas de PDFs y reservas directas a tu WhatsApp.
                </p>
              </div>
              <div className="h-10 w-10 border border-white/20 group-hover:border-[#6DD94B] group-hover:bg-[#6DD94B] group-hover:text-black flex items-center justify-center transition-all shrink-0">
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            {/* OPCIÓN 2: CLÍNICAS */}
            <button
              onClick={handleSelectClinic}
              className="w-full p-6 bg-[#232323] hover:bg-black border border-white/10 hover:border-[#6DD94B] text-left transition-all duration-300 group flex items-start justify-between gap-4 cursor-pointer"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-[#6DD94B]">02</span>
                  <h3 className="text-lg sm:text-xl font-black uppercase text-white group-hover:text-[#6DD94B] transition-colors">
                    Clínicas & Salud
                  </h3>
                  <span className="text-[9px] font-mono px-2 py-0.5 border border-[#6DD94B]/40 bg-[#6DD94B]/10 text-[#6DD94B] uppercase">
                    DISPONIBLE AHORA
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-light max-w-md leading-relaxed">
                  Clínicas dentales, fisioterapia, estética y policlínicas. Cita previa online 24/7, catálogo de tratamientos médicos y recordatorios directos.
                </p>
              </div>
              <div className="h-10 w-10 border border-white/20 group-hover:border-[#6DD94B] group-hover:bg-[#6DD94B] group-hover:text-black flex items-center justify-center transition-all shrink-0">
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            {/* OPCIÓN 3: OTROS SECTORES */}
            <div className="p-4 border border-white/5 bg-black/40 flex items-center justify-between text-xs font-mono text-zinc-500">
              <span>03 / COMERCIO LOCAL & SERVICIOS</span>
              <span>PRÓXIMAMENTE // CONSULTAR EN FORMULARIO</span>
            </div>
          </div>

          {/* Footer del Modal Banch */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#6DD94B]" />
              <span>Sin permanencia • Dominio y SSL incluidos</span>
            </span>
            <span className="text-white font-bold">DESDE 99€ // HUELVA & SEVILLA</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
