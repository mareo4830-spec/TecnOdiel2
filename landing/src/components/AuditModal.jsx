import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UtensilsCrossed, Store, Stethoscope, Briefcase, ArrowRight, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AuditModal({ isOpen, onClose, onNavigateToMultiwebs }) {
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
        // Fallback for standalone preview
        window.location.hash = '#/multiwebs';
      }
    }, 300);
  };

  const handleSelectDisabled = (sectorName) => {
    setSelectedDisabledSector(sectorName);
  };

  if (!isOpen) return null;

  const sectors = [
    {
      id: 'restaurante',
      name: 'Restaurante / Bar / Gastronomía',
      icon: UtensilsCrossed,
      active: true,
      badge: 'DISPONIBLE // HOSTELERÍA',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      description: 'Creador inteligente de webs gastronómicas con carta digital QR interactiva y reservas automáticas sin comisiones.',
      actionText: 'Crear Mi Web Gastronómica Ahora'
    },
    {
      id: 'comercio',
      name: 'Comercio / Tienda Local',
      icon: Store,
      active: false,
      badge: 'EN DESARROLLO',
      badgeColor: 'text-zinc-400 bg-white/5 border-white/10',
      description: 'Catálogo de productos, venta online con Bizum y recogida en tienda física.',
      actionText: 'Próximamente'
    },
    {
      id: 'clinica',
      name: 'Clínica / Salud / Bienestar',
      icon: Stethoscope,
      active: false,
      badge: 'EN DESARROLLO',
      badgeColor: 'text-zinc-400 bg-white/5 border-white/10',
      description: 'Cita previa online para pacientes, recordatorios automáticos por WhatsApp y tarifas.',
      actionText: 'Próximamente'
    },
    {
      id: 'servicios',
      name: 'Servicios Profesionales / Empresa',
      icon: Briefcase,
      active: false,
      badge: 'EN DESARROLLO',
      badgeColor: 'text-zinc-400 bg-white/5 border-white/10',
      description: 'Presupuestos automáticos, captación de clientes cualificados y presencia corporativa sólida.',
      actionText: 'Próximamente'
    }
  ];

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="audit-modal-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl transition-all"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl max-h-[92dvh] overflow-y-auto rounded-3xl border border-white/20 bg-zinc-950 p-5 sm:p-8 md:p-10 shadow-[0_0_80px_rgba(0,0,0,0.95)] z-10"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors z-20"
            aria-label="Cerrar ventana"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Modal Header */}
          <div className="mb-6 sm:mb-8 pr-8 sm:pr-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-emerald-400 flex items-center gap-1.5 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                // SELECCIONA TU SECTOR DE NEGOCIO
              </span>
            </div>
            <h3 id="audit-modal-title" className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
              ¿Qué tipo de negocio tienes?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
              Elige tu sector para acceder de inmediato al generador de webs con plantillas y herramientas especializadas:
            </p>
          </div>

          {/* Sector Selection Grid */}
          <div className="space-y-3 sm:space-y-4">
            {sectors.map((sector) => {
              const Icon = sector.icon;
              const isRestaurante = sector.active;

              return (
                <div
                  key={sector.id}
                  onClick={() => {
                    if (isRestaurante) {
                      handleSelectRestaurant();
                    } else {
                      handleSelectDisabled(sector.name);
                    }
                  }}
                  className={`group relative rounded-2xl border p-4 sm:p-5 transition-all duration-300 cursor-pointer text-left ${
                    isRestaurante
                      ? 'border-emerald-500/40 bg-emerald-950/20 hover:bg-emerald-950/30 hover:border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30'
                      : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20 opacity-75 hover:opacity-90'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl border ${
                        isRestaurante 
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
                          : 'bg-white/5 border-white/10 text-zinc-400'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                          {sector.name}
                        </h4>
                      </div>
                    </div>

                    <span className={`self-start sm:self-auto font-mono text-[10px] px-2.5 py-1 rounded-full border ${sector.badgeColor}`}>
                      {sector.badge}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 font-light leading-relaxed sm:pl-12 mb-3">
                    {sector.description}
                  </p>

                  <div className="sm:pl-12 flex items-center justify-between pt-1 border-t border-white/5">
                    {isRestaurante ? (
                      <span className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
                        <span>{isNavigating ? 'Abriendo Creador Web...' : sector.actionText}</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Módulo en construcción</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Feedback notice if clicked on an inactive sector */}
          <AnimatePresence>
            {selectedDisabledSector && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3"
              >
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-medium mb-0.5">
                    Sector &ldquo;{selectedDisabledSector}&rdquo; no disponible aún
                  </strong>
                  <span className="text-zinc-300">
                    Actualmente la plataforma TecnOdiel está 100% activa y optimizada para <strong>Restaurantes, Bares y Gastronomía</strong> (con cartas interactivas y Cloudflare Pages). Selecciona la primera opción para crear tu web al instante.
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Security Note */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span>TecnOdiel Web Engine • Huelva</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Acceso directo sin formularios previos
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
