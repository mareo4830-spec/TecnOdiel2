import React from 'react'
import { motion } from 'framer-motion'
import { Coffee, Code, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react'
import TiltCard from './TiltCard'

export default function Methodology() {
  const steps = [
    {
      num: '01',
      title: 'Hablamos de tu Negocio',
      subtitle: 'SIN RODEOS NI TECNICISMOS',
      desc: 'Nos cuentas qué vendes, cómo es tu local o tu servicio y qué te gustaría mejorar (más reservas, carta digital limpia, o una web nueva que dé prestigio). Te damos un presupuesto cerrado sin letra pequeña.',
      specs: ['Reunión presencial o por videollamada', 'Auditoría de tu presencia actual', 'Presupuesto claro y definitivo']
    },
    {
      num: '02',
      title: 'Diseño y Programación a Medida',
      subtitle: 'TU MARCA EN LO MÁS ALTO',
      desc: 'Creamos tu web desde cero, optimizada para que cargue en menos de un segundo en cualquier móvil. Si tienes un restaurante, diseñamos tu carta interactiva con fotos apetecibles y sistema de reservas directo.',
      specs: ['Diseño moderno y exclusivo', 'Carga ultrarrápida (< 0.2s)', 'Reservas sin comisiones integradas']
    },
    {
      num: '03',
      title: 'Lanzamiento y Control Total',
      subtitle: 'FÁCIL DE USAR DESDE TU MÓVIL',
      desc: 'Publicamos tu web en tu dominio y te explicamos en 5 minutos cómo gestionar reservas, cambiar precios o subir platos del día. Además, nos quedamos a tu lado para cualquier duda o cambio.',
      specs: ['Te enseñamos en 5 minutos', 'Panel fácil de usar desde el móvil', 'Soporte y mantenimiento continuo']
    }
  ]

  return (
    <section 
      id="metodologia" 
      className="relative w-full bg-zinc-950 py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 border-t border-white/5"
      aria-label="Cómo trabajamos"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-2 sm:mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400 block font-medium">
              // CÓMO TRABAJAMOS
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Un proceso directo y sin dolores de cabeza: <br />
            <span className="text-zinc-400 font-light">Nosotros nos encargamos de todo.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 35, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              <TiltCard
                tiltIntensity={7}
                className="relative h-full flex flex-col justify-between rounded-2xl bg-black/80 p-5 sm:p-7 md:p-8 border border-white/10 backdrop-blur-2xl group hover:border-emerald-500/30 transition-all duration-300 shadow-xl"
              >
                {/* Glowing Top Laser on Hover */}
                <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  <div className="flex items-center justify-between mb-5 sm:mb-8">
                    <span className="font-mono text-3xl sm:text-4xl font-extralight text-zinc-500 group-hover:text-emerald-400 transition-colors">
                      {step.num}
                    </span>
                    <span className="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-emerald-400/90 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 font-medium">
                      {step.subtitle}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white mb-2.5 sm:mb-3 group-hover:text-zinc-100 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm font-normal text-zinc-300 leading-relaxed mb-5 sm:mb-6">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-5 border-t border-white/10 space-y-2 sm:space-y-2.5">
                  {step.specs.map((item, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2 sm:gap-2.5 text-xs sm:text-sm font-mono text-zinc-300">
                      <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
