import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Zap, Smartphone, ShieldCheck, Search, ShoppingBag, HeartHandshake, Check } from 'lucide-react'
import HoldButton from './ui/HoldButton'
import LogoLoop from './ui/LogoLoop'

export default function MainPortalCard({ onOpenAudit }) {
  const currentYear = new Date().getFullYear()

  const solutionsList = [
    {
      icon: Zap,
      title: 'Web rápida que vende',
      description: 'Diseño moderno y ultrarrápido en móvil. Tus clientes entran, ven lo que ofreces y compran en segundos.',
      color: 'text-amber-400',
      badge: 'Carga en 0.2s',
    },
    {
      icon: Search,
      title: 'Primero en Google y Maps',
      description: 'Aparece antes que tu competencia cuando busquen tu negocio o comida en Huelva.',
      color: 'text-blue-400',
      badge: 'Más clientes locales',
    },
    {
      icon: Smartphone,
      title: 'Carta digital con QR',
      description: 'Sin descargar PDFs molestos. Carta táctil interactiva con fotos irresistibles y precios al día.',
      color: 'text-emerald-400',
      badge: '0 descargas',
    },
    {
      icon: ShieldCheck,
      title: 'Reservas directas a WhatsApp',
      description: 'Tus clientes reservan mesa o piden en 1 clic. Cero intermediarios y 0€ en comisiones.',
      color: 'text-cyan-400',
      badge: '100% tu beneficio',
    },
    {
      icon: ShoppingBag,
      title: 'Cobra con Bizum o Tarjeta',
      description: 'Pagos al instante directo a tu cuenta bancaria. Cómodo para tu cliente, seguro para ti.',
      color: 'text-purple-400',
      badge: 'Cobro directo',
    },
    {
      icon: HeartHandshake,
      title: 'Nosotros nos ocupamos de todo',
      description: 'Dominio, velocidad, cambios de carta y soporte técnico desde Huelva. Tú solo atiende a tus clientes.',
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
              Tus clientes deciden con el móvil en la mano. Si no te encuentran o tu web va lenta, eligen a la competencia. En <strong className="text-white font-semibold">TecnOdiel</strong> creamos tu web para que atraigas clientes cada día y multipliques tus ingresos sin líos:
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

            {/* Elegant Main CTA Button: Desde 99€ with React Bits HoldButton */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="flex flex-col items-center justify-center w-full mb-6 sm:mb-8"
            >
              <HoldButton
                onHold={onOpenAudit}
                onTap={onOpenAudit}
                size="lg"
                fillColor="#10b981"
                backgroundColor="#ffffff"
                textColor="#000000"
                fillTextColor="#000000"
                radius={9999}
                holdTime={1100}
                className="font-black tracking-wider uppercase text-base sm:text-lg shadow-[0_0_35px_rgba(255,255,255,0.25)] hover:shadow-[0_0_45px_rgba(16,185,129,0.4)]"
                doneLabel="Quiero Mi Web • Desde 99€"
                icon={<ArrowUpRight className="h-5 w-5 text-black" />}
                doneIcon={<ArrowUpRight className="h-5 w-5 text-black" />}
              >
                Quiero Mi Web • Desde 99€
              </HoldButton>
              <p className="mt-2.5 text-[11px] sm:text-xs font-mono text-zinc-400">
                Presupuesto sin compromiso • Te respondemos hoy mismo
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
                <span>Cero líos técnicos</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span>Trato cercano en Huelva</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span>0€ comisiones por cliente</span>
              </span>
            </motion.div>

            {/* Continuous Technology & Partner Badges Ribbon via React Bits LogoLoop */}
            <div className="w-full mt-6 border-t border-white/5 pt-5 overflow-hidden">
              <LogoLoop
                logos={[
                  { node: <span className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono text-zinc-300"><span className="w-1.5 h-1.5 rounded-full bg-orange-400" />Cloudflare Edge</span> },
                  { node: <span className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono text-zinc-300"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Supabase SSL</span> },
                  { node: <span className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono text-zinc-300"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />React 18 & Vite</span> },
                  { node: <span className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono text-zinc-300"><span className="w-1.5 h-1.5 rounded-full bg-blue-400" />Google Maps & SEO</span> },
                  { node: <span className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono text-zinc-300"><span className="w-1.5 h-1.5 rounded-full bg-teal-400" />Bizum Directo</span> },
                  { node: <span className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono text-zinc-300"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />Stripe Checkout</span> },
                  { node: <span className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono text-zinc-300"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" />Carta Digital QR</span> },
                  { node: <span className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono text-zinc-300"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Soporte TecnOdiel</span> },
                ]}
                speed={50}
                gap={16}
                fadeOut={true}
                fadeOutColor="#09090b"
              />
            </div>
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
