import React from 'react'
import { motion } from 'framer-motion'
import { XCircle, CheckCircle2, AlertTriangle, ShieldCheck, Zap, ArrowRight, UtensilsCrossed, TrendingUp } from 'lucide-react'
import TiltCard from './TiltCard'

export default function ComparisonSection({ onOpenAudit }) {
  const problems = [
    {
      title: 'Carta en PDF pesada o borrosa',
      desc: 'El cliente escanea el QR, tarda 15 segundos en descargarse un archivo de 20 MB y tiene que hacer zoom con los dedos para ver los precios.',
      impact: 'Pérdida de ventas y mala imagen de marca'
    },
    {
      title: 'Comisiones de 2€ a 4€ por comensal',
      desc: 'Portales de reservas externos que se quedan con parte de tu margen por clientes que ya iban a comer en tu propio local.',
      impact: 'Cientos de euros perdidos al mes'
    },
    {
      title: 'Plantones y mesas vacías de imprevisto',
      desc: 'Reservas telefónicas que luego no aparecen en sábado por la noche sin previo aviso, dejándote con género comprado y mesas paradas.',
      impact: 'Pérdidas directas en caja'
    },
    {
      title: 'Invisible en Google en Huelva',
      desc: 'La gente busca "dónde comer hoy" o "reformas en Huelva" y solo salen tus competidores en el mapa.',
      impact: 'Clientes que van directos a tu competencia'
    }
  ]

  const solutions = [
    {
      title: 'Carta Digital Táctil Ultrarrápida (< 0.18s)',
      desc: 'Abre al instante en cualquier móvil, con fotos en alta definición, filtros de alérgenos y posibilidad de cambiar precios en 30 segundos.',
      impact: 'Mesas con pedidos más altos y clientes felices'
    },
    {
      title: 'Reservas 100% Directas y Propias',
      desc: 'Las reservas llegan a tu propio WhatsApp o panel. Cero intermediarios, cero comisiones por persona: todo el beneficio es tuyo.',
      impact: '0€ en comisiones a plataformas externas'
    },
    {
      title: 'Cobro de Fianza Anti-Plantones',
      desc: 'Posibilidad de solicitar un pequeño depósito previo para mesas de más de 4 personas o días señalados como festivos o fines de semana.',
      impact: '100% de asistencia garantizada'
    },
    {
      title: 'Posicionamiento Nº1 en Google Maps',
      desc: 'Optimizamos tu presencia local para que cuando alguien busque en Huelva, tu negocio sea la primera y más atractiva opción.',
      impact: 'Flujo constante de nuevos clientes cada semana'
    }
  ]

  return (
    <section className="relative w-full bg-zinc-950 py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 border-t border-white/5">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400 font-semibold">
              // LA DIFERENCIA REAL
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            ¿Por qué la mayoría de negocios <br />
            <span className="text-zinc-400 font-light">pierden dinero con su web actual?</span>
          </h2>
          <p className="mt-4 text-xs sm:text-base text-zinc-300 font-normal leading-relaxed">
            Una web no es un folleto decorativo. Es el comercial más importante de tu empresa cuando no estás delante del cliente.
          </p>
        </motion.div>

        {/* Side by side comparison columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
          {/* Column 1: The Problem (La Web Tradicional) */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="h-full rounded-3xl border border-red-500/20 bg-red-950/[0.08] p-6 sm:p-8 md:p-10 backdrop-blur-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-red-500/20">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                    <XCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base sm:text-lg">Lo Que Tiene Casi Todo el Mundo</h3>
                    <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider">Webs lentas, PDFs y comisiones</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-red-400 font-bold hidden sm:inline">OBSOLETO</span>
              </div>

              <div className="space-y-4 sm:space-y-5">
                {problems.map((prob, i) => (
                  <div key={i} className="p-3.5 sm:p-4 rounded-xl bg-black/40 border border-red-500/10">
                    <div className="flex items-start gap-2.5">
                      <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-zinc-100">{prob.title}</h4>
                        <p className="text-[11px] sm:text-xs text-zinc-400 mt-1 leading-relaxed">{prob.desc}</p>
                        <span className="inline-block mt-2 font-mono text-[10px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                          {prob.impact}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Column 2: The Solution (El Estándar TecnOdiel) */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <TiltCard tiltIntensity={5} className="h-full rounded-3xl border border-emerald-500/30 bg-emerald-950/[0.1] p-6 sm:p-8 md:p-10 backdrop-blur-xl relative overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.1)]">
              {/* Glowing top line */}
              <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

              <div className="flex items-center justify-between mb-6 pb-4 border-b border-emerald-500/20">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base sm:text-lg">El Estándar TecnOdiel</h3>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">Diseñado para llenar y facturar</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold hidden sm:inline">ALTO RENDIMIENTO</span>
              </div>

              <div className="space-y-4 sm:space-y-5">
                {solutions.map((sol, i) => (
                  <div key={i} className="p-3.5 sm:p-4 rounded-xl bg-black/60 border border-emerald-500/20 group hover:border-emerald-500/40 transition-colors">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white">{sol.title}</h4>
                        <p className="text-[11px] sm:text-xs text-zinc-300 mt-1 leading-relaxed">{sol.desc}</p>
                        <span className="inline-block mt-2 font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">
                          {sol.impact}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-emerald-500/20">
                <button
                  onClick={onOpenAudit}
                  className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)] active:scale-95"
                >
                  Cambiar Mi Negocio al Estándar TecnOdiel
                </button>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
