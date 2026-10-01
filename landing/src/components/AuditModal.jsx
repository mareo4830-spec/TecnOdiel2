import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  UtensilsCrossed, 
  Store, 
  Stethoscope, 
  Briefcase, 
  ArrowRight, 
  AlertCircle, 
  Terminal,
  CheckCircle2,
  MessageCircle
} from 'lucide-react'

export default function AuditModal({ isOpen, onClose, onNavigateToMultiwebs }) {
  const [selectedDisabledSector, setSelectedDisabledSector] = useState(null)
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setSelectedDisabledSector(null)
      setIsNavigating(false)
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleSelectRestaurant = () => {
    setIsNavigating(true)
    setTimeout(() => {
      if (onClose) onClose()
      if (onNavigateToMultiwebs) {
        onNavigateToMultiwebs()
      } else {
        window.location.hash = '#/multiwebs'
      }
    }, 250)
  }

  const handleSelectDisabled = (sectorName) => {
    setSelectedDisabledSector(sectorName)
  }

  if (!isOpen) return null

  const sectors = [
    {
      id: 'restaurante',
      name: 'Hostelería, Restaurantes & Bares',
      icon: UtensilsCrossed,
      active: true,
      badge: 'DISPONIBLE // MOTOR 2.6',
      badgeClass: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40',
      description: 'Generador web con 30 identidades visuales, carta digital QR interactiva y sistema de reservas directas sin comisiones.',
      actionText: 'Iniciar Creador Web Ahora'
    },
    {
      id: 'comercio',
      name: 'Comercio Local & Tiendas',
      icon: Store,
      active: false,
      badge: 'EN DESARROLLO',
      badgeClass: 'text-zinc-500 bg-zinc-900 border-zinc-800',
      description: 'Catálogo de productos, venta online con Bizum y recogida local.',
      actionText: 'Próximamente'
    },
    {
      id: 'clinica',
      name: 'Clínica, Salud & Belleza',
      icon: Stethoscope,
      active: false,
      badge: 'EN DESARROLLO',
      badgeClass: 'text-zinc-500 bg-zinc-900 border-zinc-800',
      description: 'Cita previa online, recordatorios automáticos y tarifas de servicios.',
      actionText: 'Próximamente'
    },
    {
      id: 'servicios',
      name: 'Servicios Profesionales & Empresas',
      icon: Briefcase,
      active: false,
      badge: 'EN DESARROLLO',
      badgeClass: 'text-zinc-500 bg-zinc-900 border-zinc-800',
      description: 'Presupuestos automáticos, captación B2B y presencia corporativa en Huelva.',
      actionText: 'Próximamente'
    }
  ]

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
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
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window: Industrial Spec Sheet */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 15 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-xl max-h-[92dvh] overflow-y-auto rounded-xl border border-zinc-800 bg-[#09090c] p-4 sm:p-6 shadow-2xl z-10 text-left"
        >
          {/* Top Bar with Close */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
            <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] text-zinc-400 uppercase tracking-widest">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>CONFIGURADOR // SELECCIÓN DE SECTOR</span>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded border border-zinc-800 hover:border-zinc-600 bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
              aria-label="Cerrar ventana"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Heading */}
          <div className="mb-5">
            <h2 id="audit-modal-title" className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-sans">
              Selecciona el tipo de negocio
            </h2>
            <p className="mt-1 text-xs text-zinc-400 font-normal leading-relaxed">
              Elige tu sector comercial para acceder de inmediato al entorno de configuración y plantillas especializadas:
            </p>
          </div>

          {/* Sectors Grid */}
          <div className="space-y-2.5 sm:space-y-3">
            {sectors.map((sector) => {
              const Icon = sector.icon
              const isRestaurante = sector.active

              const handleSectorClick = () => {
                if (isRestaurante) {
                  handleSelectRestaurant()
                } else {
                  handleSelectDisabled(sector.name)
                }
              }

              return (
                <div
                  key={sector.id}
                  role="button"
                  tabIndex={0}
                  onClick={handleSectorClick}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleSectorClick()
                    }
                  }}
                  className={`group relative rounded-lg border p-3.5 sm:p-4 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 ${
                    isRestaurante
                      ? 'border-emerald-500/50 bg-emerald-950/20 hover:bg-emerald-950/30 hover:border-emerald-400 shadow-sm focus-visible:ring-emerald-400'
                      : 'border-zinc-800/80 bg-zinc-900/30 hover:bg-zinc-900/60 hover:border-zinc-700 opacity-70 hover:opacity-90 focus-visible:ring-zinc-400'
                  }`}
                >
                  <div className="flex items-start sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded border ${
                        isRestaurante 
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' 
                          : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight font-sans">
                        {sector.name}
                      </h3>
                    </div>

                    <span className={`font-mono text-[9px] px-2 py-0.5 rounded border ${sector.badgeClass} shrink-0`}>
                      {sector.badge}
                    </span>
                  </div>

                  <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed font-normal mb-2.5">
                    {sector.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
                    {isRestaurante ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 group-hover:text-emerald-300 font-mono transition-colors">
                        <span>{isNavigating ? 'Cargando generador...' : sector.actionText}</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-zinc-400" />
                        <span>Módulo en fase de despliegue</span>
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Feedback Notice for Inactive Sector */}
          <AnimatePresence>
            {selectedDisabledSector && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="mt-4 p-3 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-white font-semibold">
                    Sector &ldquo;{selectedDisabledSector}&rdquo;
                  </div>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Actualmente el motor automático está activo para <strong>Hostelería y Restauración</strong>. Si necesitas una web a medida para tu sector, contacta directamente con nuestro equipo en Huelva:
                  </p>
                  <a
                    href="https://wa.me/34600000000?text=Hola%20TecnOdiel,%20necesito%20una%20web%20a%20medida%20para%20mi%20negocio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-400 hover:underline pt-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Consultar por WhatsApp con nosotros</span>
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Note */}
          <div className="mt-5 pt-3 border-t border-zinc-800 flex items-center justify-between text-[10px] font-mono text-zinc-400">
            <span>TECNODIEL ENGINE • HUELVA</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Acceso inmediato sin registro
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
