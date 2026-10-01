import React from 'react'
import { motion } from 'framer-motion'
import { UtensilsCrossed, Store, Zap, ArrowUpRight, CheckCircle2, CalendarCheck, Smartphone, ShieldCheck, Sparkles } from 'lucide-react'
import TiltCard from './TiltCard'

export default function Services({ onOpenAudit }) {
  const services = [
    {
      id: '01',
      title: 'Webs para Restaurantes y Hostelería',
      category: 'HOSTELERÍA & GASTRONOMÍA',
      summary: 'Tu restaurante merece una web que llene mesas todos los días y una carta digital que entre por los ojos, sin intermediarios ni comisiones abusivas.',
      icon: UtensilsCrossed,
      features: [
        'Carta digital interactiva: adiós a los PDFs pesados y borrosos que nadie quiere abrir.',
        'Motor de reservas directas propio: deja de pagar comisiones por cada comensal.',
        'Menú del día y sugerencias actualizables desde tu propio móvil en 30 segundos.',
        'Gestión de eventos privados, alérgenos obligatorios y galería visual de platos en alta definición.'
      ],
      metrics: [
        { label: 'Comisión por Mesa', value: '0€ (Tuya 100%)' },
        { label: 'Carga de Carta', value: '< 0.2 Segundos' },
        { label: 'Reservas Directas', value: '+60% Aumento' }
      ],
      tagline: 'Convierte a quien busca dónde comer en una mesa reservada en tu local.'
    },
    {
      id: '02',
      title: 'Webs para Todo Tipo de Negocios',
      category: 'COMERCIOS & SERVICIOS',
      summary: 'Para clínicas, tiendas, despachos, reformas, talleres y cualquier profesional que quiera ser la primera opción cuando alguien busque en Google en su ciudad.',
      icon: Store,
      features: [
        'Diseño a medida que proyecta solvencia y confianza absoluta desde el primer segundo.',
        'Optimización total para móviles: el 85% de tus clientes te buscará desde el smartphone.',
        'Botón de llamada y WhatsApp directo para que pedir cita o presupuesto sea inmediato.',
        'Posicionamiento en Google Maps y SEO local en tu zona geográfica para adelantar a tu competencia.'
      ],
      metrics: [
        { label: 'Adaptabilidad Móvil', value: '100% Perfecta' },
        { label: 'Contacto a WhatsApp', value: '1 Clic Directo' },
        { label: 'Visitas en Clientes', value: '+45% Ratio' }
      ],
      tagline: 'Una página web que trabaja como tu mejor comercial las 24 horas del día.'
    },
    {
      id: '03',
      title: 'Digitalización y Cero Plantones',
      category: 'AUTOMATIZACIÓN & AUTONOMÍA',
      summary: 'Eliminamos las llamadas a deshoras y el tiempo perdido en WhatsApp. Tus clientes reservan o compran solos con confirmaciones automáticas.',
      icon: CalendarCheck,
      features: [
        'Cobro de fianza o depósito previo para mesas grandes o citas previas: fin definitivo a los plantones.',
        'Recordatorios automáticos por WhatsApp y Email para que nadie olvide su hora.',
        'Sincronización directa con Google Calendar para evitar solapamientos de turnos o citas.',
        'Soporte directo y formación sencilla: te enseñamos a gestionar todo sin tecnicismos.'
      ],
      metrics: [
        { label: 'Tasa de No-Shows', value: '0% Plantones' },
        { label: 'Ahorro al Teléfono', value: '2h al Día' },
        { label: 'Disponibilidad', value: '24 Horas / 7 Días' }
      ],
      tagline: 'Organización impecable en sala y en agenda sin sobrecargar a tu equipo.'
    }
  ]

  // Container motion variant with stepped cascade
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.1,
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 45, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  }

  return (
    <section 
      id="restaurantes" 
      className="relative w-full bg-black py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 border-t border-white/5"
      aria-label="Soluciones para restaurantes y negocios"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 sm:mb-16 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
                // QUÉ CONSTRUIMOS PARA TI
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Soluciones digitales claras, <br />
              <span className="text-zinc-400 font-light">enfocadas en llenar tu negocio.</span>
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
            Tanto si tienes un restaurante con 30 mesas como si gestionas una clínica, un comercio o un negocio de servicios: creamos la herramienta perfecta para ti.
          </p>
        </motion.div>

        {/* Stepped Fade-up Cards Grid with 3D Tilt and Cursor Glare */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {services.map((service) => {
            const Icon = service.icon
            return (
              <motion.div key={service.id} variants={cardVariants} className="h-full">
                <TiltCard
                  tiltIntensity={8}
                  className="group h-full flex flex-col justify-between rounded-2xl bg-zinc-950/80 p-5 sm:p-7 md:p-8 backdrop-blur-2xl border border-white/10 transition-all duration-300 hover:border-emerald-500/30 hover:bg-zinc-900/60 hover:shadow-[0_0_50px_rgba(52,211,153,0.08)]"
                >
                  {/* Top Glowing Laser Edge */}
                  <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div>
                    {/* Card Meta & Icon */}
                    <div className="flex items-center justify-between mb-5 sm:mb-8">
                      <span className="font-mono text-xs text-zinc-400 tracking-wider">
                        [{service.id}]
                      </span>
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-white/[0.06] border border-white/15 text-white transition-all group-hover:border-emerald-400/40 group-hover:bg-emerald-500/10 group-hover:text-emerald-400"
                      >
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </motion.div>
                    </div>

                    <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-emerald-400/90 block mb-1.5 sm:mb-2 font-medium">
                      {service.category}
                    </span>

                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white mb-3 sm:mb-4 group-hover:text-zinc-100 transition-colors">
                      {service.title}
                    </h3>

                    <p className="text-xs sm:text-sm font-normal leading-relaxed text-zinc-300 mb-5 sm:mb-8">
                      {service.summary}
                    </p>

                    {/* Feature Checklist */}
                    <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                      {service.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-zinc-200 font-normal leading-relaxed">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom Metrics Bar */}
                  <div className="pt-5 sm:pt-6 border-t border-white/10">
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center mb-5 sm:mb-6">
                      {service.metrics.map((m, mIdx) => (
                        <div key={mIdx} className="flex flex-col bg-white/[0.03] border border-white/5 p-1.5 sm:p-2 rounded-lg group-hover:border-white/10 transition-colors">
                          <span className="font-mono text-[11px] sm:text-xs md:text-sm font-bold text-white tracking-tight break-words">
                            {m.value}
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-zinc-400 font-mono tracking-tight mt-0.5 truncate">
                            {m.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    <motion.button
                      onClick={onOpenAudit}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-between py-2.5 sm:py-3 px-3.5 sm:px-4 rounded-xl bg-white/[0.05] border border-white/15 text-[11px] sm:text-xs font-mono tracking-wider uppercase text-zinc-200 transition-all duration-300 hover:bg-white hover:text-black hover:border-white"
                    >
                      <span>Consultar para mi negocio</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </motion.button>
                  </div>
                </TiltCard>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
