import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Utensils, Calendar, Clock, MapPin, Sparkles, CheckCircle2, Flame, HeartPulse, Building2 } from 'lucide-react'
import TiltCard from './TiltCard'

export default function Portfolio({ onOpenAudit }) {
  const [activeFilter, setActiveFilter] = useState('all')

  const projects = [
    {
      id: '01',
      title: 'Restaurante & Marisquería El Rincón del Odiel',
      shortTitle: 'El Rincón del Odiel',
      category: 'Restaurante // Reservas Directas & Carta QR',
      type: 'hosteleria',
      year: '2024',
      gridSpan: 'lg:col-span-7',
      description: 'Web gastronómica inmersiva con carta interactiva en alta definición, reservas de mesas directas sin intermediarios y control automático de aforo.',
      tags: ['Carta Digital QR', 'Reservas Sin Comisiones', 'Gestión Alérgenos', 'Huelva Centro'],
      metrics: '0€ en comisiones // +64% reservas web directas',
      wireframeType: 'restaurant'
    },
    {
      id: '02',
      title: 'Asador & Bodega La Casona',
      shortTitle: 'Asador La Casona',
      category: 'Hostelería // Menús de Grupo & Eventos',
      type: 'hosteleria',
      year: '2024',
      gridSpan: 'lg:col-span-5',
      description: 'Sistema de reserva de menús para celebraciones y eventos con fianza previa para evitar plantones en fines de semana.',
      tags: ['Fianza Previa', 'Eventos Privados', 'Sincronización WhatsApp'],
      metrics: '0 mesas vacías de imprevisto // Lleno garantizado',
      wireframeType: 'asador'
    },
    {
      id: '03',
      title: 'Clínica & Salud Dental Odiel',
      shortTitle: 'Clínica Dental Odiel',
      category: 'Negocio de Servicios // Citas Autónomas',
      type: 'servicios',
      year: '2023',
      gridSpan: 'lg:col-span-5',
      description: 'Ecosistema de citación automática 24/7 con recordatorio automático por WhatsApp para pacientes y sincronización de gabinete.',
      tags: ['Citas Online', 'WhatsApp API', 'Google Calendar'],
      metrics: '2h diarias ahorradas al teléfono // Cero solapamientos',
      wireframeType: 'dental'
    },
    {
      id: '04',
      title: 'Espacio Reformas & Diseño Huelva',
      shortTitle: 'Reformas & Interiorismo Huelva',
      category: 'Empresa Local // Captación de Clientes',
      type: 'reformas',
      year: '2023',
      gridSpan: 'lg:col-span-7',
      description: 'Web con galería visual antes/después, estimador de presupuestos interactivo y posicionamiento Nº1 en Google Maps en la provincia.',
      tags: ['Posicionamiento SEO Local', 'Presupuestos en 1 Clic', 'Google Maps #1'],
      metrics: '+38 presupuestos cualificados al mes // 0.18s carga',
      wireframeType: 'reformas'
    }
  ]

  const filters = [
    { id: 'all', label: 'Todos los Proyectos' },
    { id: 'hosteleria', label: 'Hostelería & Cartas' },
    { id: 'servicios', label: 'Servicios & Citas' },
    { id: 'reformas', label: 'Reformas & Negocios' },
  ]

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(p => p.type === activeFilter)

  const renderWireframe = (type) => {
    switch (type) {
      case 'restaurant':
        return (
          <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-br from-zinc-900/90 via-black to-zinc-950 font-mono text-xs text-zinc-300 select-none overflow-hidden">
            {/* Holographic Scanline */}
            <div className="pointer-events-none absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-emerald-400/10 to-transparent animate-scanline blur-[1px]" />

            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-zinc-100 font-semibold uppercase text-[11px] sm:text-xs">EL_RINCÓN_DEL_ODIEL // SALA</span>
              </div>
              <span className="text-emerald-400 font-mono text-[10px] sm:text-xs">SISTEMA EN VIVO</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 sm:gap-3 my-3 sm:my-4">
              <div className="p-2 sm:p-3 bg-white/[0.04] border border-white/10 rounded-lg">
                <span className="text-zinc-400 block text-[9px] sm:text-[10px]">MESAS LIBRES</span>
                <span className="text-xs sm:text-base font-bold text-white tracking-tight">4 DE 18</span>
              </div>
              <div className="p-2 sm:p-3 bg-white/[0.04] border border-white/10 rounded-lg">
                <span className="text-zinc-400 block text-[9px] sm:text-[10px]">CARTA QR</span>
                <span className="text-xs sm:text-base font-bold text-emerald-400 tracking-tight">ACTIVA</span>
              </div>
              <div className="p-2 sm:p-3 bg-white/[0.04] border border-white/10 rounded-lg">
                <span className="text-zinc-400 block text-[9px] sm:text-[10px]">COMISIÓN</span>
                <span className="text-xs sm:text-base font-bold text-white tracking-tight">0€ DIRECTO</span>
              </div>
            </div>

            <div className="p-2.5 sm:p-3 rounded-lg bg-white/[0.04] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] sm:text-xs">
              <div className="flex items-center gap-2 text-zinc-200 truncate">
                <Utensils className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">Mesa 7: Gamba Blanca de Huelva & Jamón Ibérico</span>
              </div>
              <span className="text-emerald-400 font-semibold shrink-0">Reserva Confirmada</span>
            </div>
          </div>
        )
      case 'asador':
        return (
          <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-br from-zinc-950 via-black to-zinc-900/80 font-mono text-xs text-zinc-300 select-none overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-amber-400/10 to-transparent animate-scanline blur-[1px]" />
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span className="text-zinc-100 font-semibold tracking-wider uppercase text-[11px] sm:text-xs flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-amber-400" />
                ASADOR LA CASONA
              </span>
              <span className="text-amber-400 text-[10px] sm:text-xs">FIANZA ACTIVA</span>
            </div>
            <div className="my-3 sm:my-4 space-y-2">
              <div className="flex justify-between items-center bg-white/[0.03] p-2 sm:p-2.5 rounded border border-white/5 text-[11px]">
                <span>Menú Chuletón & Brasa x6 pers.</span>
                <span className="text-emerald-400 font-bold">120€ Depositados</span>
              </div>
              <div className="flex justify-between items-center bg-white/[0.03] p-2 sm:p-2.5 rounded border border-white/5 text-[11px]">
                <span>Sábado Noche (Turno 21:30h)</span>
                <span className="text-white font-semibold">100% Ocupación</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-[10px] sm:text-xs text-zinc-400 border-t border-white/5 pt-2">
              <span>RIESGO PLANTONES: 0%</span>
              <span className="text-emerald-400">SIN PERDIDAS</span>
            </div>
          </div>
        )
      case 'dental':
        return (
          <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black font-mono text-xs text-zinc-300 select-none overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent animate-scanline blur-[1px]" />
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span className="text-zinc-100 font-semibold tracking-wider uppercase text-[11px] sm:text-xs flex items-center gap-1.5">
                <HeartPulse className="h-3.5 w-3.5 text-cyan-400" />
                DENTAL ODIEL // AGENDA
              </span>
              <span className="text-cyan-400 text-[10px] sm:text-xs">WHATSAPP SYNC</span>
            </div>
            <div className="my-3 space-y-2">
              <div className="p-2 sm:p-2.5 bg-white/[0.03] rounded border border-white/5">
                <div className="flex justify-between text-[11px] text-zinc-200 mb-1">
                  <span>Próxima cita online</span>
                  <span className="text-cyan-400 font-semibold">11:30h Mañana</span>
                </div>
                <span className="text-[10px] text-zinc-400 block truncate">Recordatorio automático enviado al paciente</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-[10px] sm:text-xs text-zinc-400 border-t border-white/5 pt-2">
              <span>TIEMPO AHORRADO: 2H/DÍA</span>
              <span className="text-cyan-400">AUTOMATIZADO</span>
            </div>
          </div>
        )
      case 'reformas':
        return (
          <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-br from-zinc-900 via-black to-zinc-950 font-mono text-xs text-zinc-300 select-none overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-emerald-400/10 to-transparent animate-scanline blur-[1px]" />
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span className="text-zinc-100 font-semibold tracking-wider uppercase text-[11px] sm:text-xs flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-emerald-400" />
                ESPACIO REFORMAS // SEO
              </span>
              <span className="text-emerald-400 text-[10px] sm:text-xs">GOOGLE MAPS #1</span>
            </div>
            <div className="my-3 bg-white/[0.03] p-2.5 sm:p-3 rounded border border-white/5 flex flex-col gap-1">
              <span className="text-[10px] text-zinc-400 uppercase">
                Búsqueda: "Reformas de cocinas Huelva"
              </span>
              <span className="text-[11px] sm:text-xs text-zinc-300">
                Aparición destacada con mapa y botón directo "WhatsApp"
              </span>
            </div>
            <div className="flex justify-between items-center text-[10px] sm:text-xs text-zinc-400">
              <span>SOLICITUDES: 38/MES</span>
              <span className="text-emerald-400 font-medium">ALTO RETORNO</span>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <section 
      id="proyectos" 
      className="relative w-full bg-black py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 border-t border-white/5"
      aria-label="Casos de éxito y proyectos"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 sm:mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 mb-2 sm:mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest text-zinc-400 font-medium">
                // RESULTADOS EN NEGOCIOS REALES
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Ejemplos reales de cómo una web <br />
              <span className="text-zinc-400 font-light">hace crecer tu negocio cada mes.</span>
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
            Soluciones reales para restaurantes y empresas que necesitaban dejar de depender de terceros y empezar a vender por sí mismos.
          </p>
        </motion.div>

        {/* Interactive Filter Tabs with Animated Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 sm:mb-12 flex flex-wrap items-center gap-2"
        >
          {filters.map((tab) => {
            const isSelected = activeFilter === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`relative px-4 py-2 rounded-full text-xs font-mono tracking-wider uppercase transition-colors duration-200 ${
                  isSelected ? 'text-black font-bold' : 'text-zinc-400 hover:text-white bg-white/[0.03] border border-white/10'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activePortfolioTab"
                    className="absolute inset-0 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            )
          })}
        </motion.div>

        {/* Asymmetrical Raw Brutalist Grid with TiltCards & Layout Animation */}
        <motion.div 
          layout
          className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.92, y: 25 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={item.gridSpan}
              >
                <TiltCard
                  tiltIntensity={6}
                  className="group relative h-full rounded-2xl border border-white/10 bg-zinc-950/80 p-4 sm:p-6 md:p-8 backdrop-blur-2xl overflow-hidden transition-all duration-300 hover:border-emerald-500/30 hover:bg-zinc-900/60 shadow-xl"
                >
                  {/* Top Subtle Specular Highlight */}
                  <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* UI wireframe container with desktop hover and clean mobile view */}
                  <div className="relative aspect-[16/10] w-full rounded-xl border border-white/10 overflow-hidden bg-zinc-900/60 transition-all duration-300 group-hover:border-white/30">
                    {/* Visual architectural wireframe */}
                    {renderWireframe(item.wireframeType)}

                    {/* Desktop hover overlay with luminous CTA */}
                    <div className="hidden md:flex absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[3px] flex-col items-center justify-center p-6 text-center z-20">
                      <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 mb-2 font-semibold">
                        SOLUCIÓN A MEDIDA // TECNODIEL
                      </span>
                      <h4 className="text-lg sm:text-xl font-bold text-white mb-4 tracking-tight">
                        {item.shortTitle}
                      </h4>
                      <motion.button 
                        onClick={onOpenAudit}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-xs font-bold text-black hover:bg-zinc-200 transition-colors shadow-[0_0_25px_rgba(255,255,255,0.4)]"
                      >
                        <span>Quiero una web como esta</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Meta details below container */}
                  <div className="mt-4 sm:mt-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono text-zinc-300 mb-2">
                      <span className="uppercase tracking-widest text-emerald-400 font-semibold">{item.category}</span>
                      <span className="text-zinc-400">{item.year}</span>
                    </div>

                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white mb-2 group-hover:text-zinc-100 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm font-normal text-zinc-300 leading-relaxed mb-4">
                      {item.description}
                    </p>

                    {/* Tech Pills & Impact Metric */}
                    <div className="pt-3 sm:pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5">
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {item.tags.map((tag, tIdx) => (
                          <span 
                            key={tIdx} 
                            className="rounded-md bg-white/[0.05] border border-white/10 px-2 py-0.5 sm:px-2.5 sm:py-1 font-mono text-[10px] sm:text-xs text-zinc-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="w-full sm:w-auto font-mono text-[11px] sm:text-xs text-emerald-400 flex items-center gap-1.5 font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                        <span>{item.metrics}</span>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
