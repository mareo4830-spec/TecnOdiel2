import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Zap, Smartphone, ShieldCheck, Search, ShoppingBag, HeartHandshake, Check } from 'lucide-react'

export default function MainPortalCard({ onOpenAudit }) {
  const currentYear = new Date().getFullYear()

  const solutionsList = [
    {
      icon: Zap,
      title: 'Tu web lista para vender',
      description: 'Una web bonita, moderna y rápida en el móvil. Tus clientes entrarán y verán al instante lo que ofreces para comprarte a ti.',
      color: 'text-amber-400',
      badge: 'Carga en 0.2s',
    },
    {
      icon: Search,
      title: 'Posiciónate el primero en Google',
      description: 'Cuando busquen tu negocio o servicio en Huelva, saldrás tú antes que la competencia en Google y Google Maps.',
      color: 'text-blue-400',
      badge: 'Más clientes locales',
    },
    {
      icon: Smartphone,
      title: 'Tu carta o menú en el móvil',
      description: 'Sin descargar incómodos PDFs. Una carta táctil que se abre al segundo, con fotos de tus platos y precios siempre actualizados.',
      color: 'text-emerald-400',
      badge: '0 PDFs molestos',
    },
    {
      icon: ShieldCheck,
      title: 'Reservas y pedidos a tu WhatsApp',
      description: 'Tus clientes te piden o te reservan mesa en un clic directo. Sin intermediarios y sin que nadie te quite un 15% de comisión.',
      color: 'text-cyan-400',
      badge: '100% para ti',
    },
    {
      icon: ShoppingBag,
      title: 'Cobra al instante por Bizum o tarjeta',
      description: 'Vende tus productos o servicios por internet y recibe el dinero en tu cuenta bancaria al momento. Fácil y sin líos.',
      color: 'text-purple-400',
      badge: 'Bizum y Tarjeta',
    },
    {
      icon: HeartHandshake,
      title: 'Nosotros nos encargamos de todo',
      description: 'Tú dedícate a atender a tus clientes. Del dominio, el servidor, el mantenimiento y que todo funcione nos ocupamos nosotros desde Huelva.',
      color: 'text-emerald-400',
      badge: 'Tranquilidad total',
    },
  ]

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-center items-center px-4 sm:px-6 md:px-12 py-16 sm:py-24 select-none overflow-hidden">
      {/* Background ambient radial glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-white/[0.025] blur-[160px] rounded-full" />
      <div className="pointer-events-none absolute inset-0 bg-grid-subtle opacity-25" />

      {/* Main Center Card - Brutalist & Ultra-Elegant */}
      <div className="relative z-10 w-full max-w-4xl my-auto">
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl border border-white/15 bg-gradient-to-b from-zinc-950 via-black to-zinc-950 p-6 sm:p-12 md:p-14 text-center overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.95)]"
        >
          {/* Subtle grid pattern */}
          <div className="pointer-events-none absolute inset-0 bg-grid-subtle opacity-15" />

          <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto">
            {/* Top diagnostic callout badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-5 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 backdrop-blur-md"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-emerald-300 font-medium">
                MÁS CLIENTES PARA TU NEGOCIO // HUELVA
              </span>
            </motion.div>

            {/* High-Converting Sales Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white uppercase leading-[0.95] mb-5 sm:mb-6 select-none"
            >
              CONSIGUE MÁS CLIENTES. <br />
              <span className="text-metallic-pure text-glow">MULTIPLICA TUS VENTAS.</span>
            </motion.h1>

            {/* Problem-solving introduction in close marketing language */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.22 }}
              className="max-w-2xl text-xs sm:text-sm md:text-base font-normal text-zinc-300 mb-8 sm:mb-10 leading-relaxed"
            >
              Tus clientes buscan en el móvil antes de comprar o salir a comer. Si no tienes una web rápida o no sales el primero en Google, se están yendo a tu competencia. En <strong className="text-white font-semibold">TecnOdiel</strong> hacemos que tu negocio destaque, atraiga clientes todos los días y multipliques tus ingresos sin complicaciones:
            </motion.p>

            {/* Everything We Can Do - Close, Clear & Sales-Oriented Grid */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.28 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full mb-8 sm:mb-10 text-left"
            >
              {solutionsList.map((item, index) => {
                const IconComponent = item.icon
                return (
                  <div
                    key={index}
                    className="group relative rounded-2xl border border-white/10 bg-white/[0.025] hover:bg-white/[0.05] hover:border-white/20 p-4 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                            <IconComponent className={`h-4 w-4 ${item.color}`} />
                          </div>
                          <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                            {item.title}
                          </h2>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-zinc-400">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed font-normal">
                        {item.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </motion.div>

            {/* Elegant Main CTA Button: Desde 99€ */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="flex flex-col items-center justify-center w-full mb-6 sm:mb-8"
            >
              <motion.button
                onClick={onOpenAudit}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group relative overflow-hidden inline-flex items-center justify-center gap-3 bg-white px-8 sm:px-10 py-4 sm:py-4.5 text-sm sm:text-base font-black tracking-tight text-black transition-all duration-300 hover:bg-zinc-100 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] rounded-full cursor-pointer shadow-lg"
                id="cta-desde-99"
                aria-label="Pedir Presupuesto Desde 99€"
              >
                <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out" />
                <span className="relative z-10 uppercase font-black tracking-wider text-base sm:text-lg">
                  Desde 99€
                </span>
                <ArrowUpRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </motion.button>
              <p className="mt-2.5 text-[11px] sm:text-xs font-mono text-zinc-400">
                Pide tu presupuesto sin compromiso • Te respondemos hoy mismo
              </p>
            </motion.div>

            {/* Real Guarantees Checklist */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.42 }}
              className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[11px] sm:text-xs font-mono text-zinc-400 border-t border-white/10 pt-5 w-full"
            >
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span>Cero complicaciones técnicas</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span>Trato cercano y directo en Huelva</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span>Sin comisiones por tus clientes</span>
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Minimalist Bottom Copyright */}
        <div className="mt-6 text-center text-xs font-mono text-zinc-500">
          <span>© {currentYear} TecnOdiel • Huelva, Andalucía, España</span>
        </div>
      </div>
    </div>
  )
}
