import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ChevronRight, CheckCircle2, Zap, Shield, Sparkles, Smartphone, Gauge } from 'lucide-react'
import { SUBDOMAINS } from '../config/subdomains'

export default function Hero({ onOpenAudit }) {
  const containerRef = useRef(null)

  // Framer Motion Parallax hook
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Cinematic scale and opacity transforms
  const titleScale = useTransform(scrollYProgress, [0, 0.7], [1, 0.82])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const titleY = useTransform(scrollYProgress, [0, 0.7], [0, 75])
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 140])

  // Split title animation variants
  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  }

  const letterVariants = {
    hidden: { opacity: 0, y: 35, rotateX: 45 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: 'spring',
        damping: 18,
        stiffness: 140,
      },
    },
  }

  const liveStats = [
    {
      icon: Gauge,
      label: 'Velocidad de Carga',
      value: '0.18s',
      detail: 'Ultra Rápida',
      color: 'text-emerald-400',
    },
    {
      icon: Shield,
      label: 'Comisiones a Terceros',
      value: '0€',
      detail: 'Beneficio 100% Tuyo',
      color: 'text-cyan-400',
    },
    {
      icon: Smartphone,
      label: 'Adaptación Móvil',
      value: '100%',
      detail: 'Fluida y Perfecta',
      color: 'text-zinc-200',
    },
    {
      icon: Zap,
      label: 'Lighthouse Score',
      value: '100/100',
      detail: 'Optimización SEO Máxima',
      color: 'text-emerald-400',
    },
  ]

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[92dvh] sm:min-h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden bg-black pt-24 pb-14 sm:pt-36 sm:pb-24"
      aria-label="Presentación TecnOdiel"
    >
      {/* Background cinematic grid & radial lighting */}
      <motion.div 
        style={{ y: backgroundY }}
        className="pointer-events-none absolute inset-0 bg-grid-subtle opacity-45 will-change-transform [mask-image:radial-gradient(ellipse_70%_55%_at_50%_40%,#000_65%,transparent_100%)]" 
      />
      
      {/* Ambient subtle center glow with breathing pulse */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.03, 0.07, 0.03],
        }}
        transition={{
          repeat: Infinity,
          duration: 8,
          ease: 'easeInOut',
        }}
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-gradient-to-r from-emerald-500 to-cyan-500 blur-[140px] rounded-full will-change-transform"
      />

      {/* Hero Content Container */}
      <motion.div 
        style={{ scale: titleScale, opacity: titleOpacity, y: titleY }}
        className="relative z-10 mx-auto max-w-5xl px-3 sm:px-6 text-center flex flex-col items-center will-change-transform"
      >
        {/* Industry Focus Badge with Radar Wave */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.04 }}
          className="group cursor-default mb-4 sm:mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 sm:px-5 sm:py-2 backdrop-blur-2xl shadow-[0_0_25px_rgba(0,0,0,0.6)] hover:border-emerald-500/40 transition-colors"
        >
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
          </span>
          <span className="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-zinc-200">
            <span className="sm:hidden">Restaurantes & Negocios • Huelva</span>
            <span className="hidden sm:inline">Hostelería // Comercios // Negocios Locales // Huelva</span>
          </span>
          <span className="text-[10px] font-mono text-emerald-400 border-l border-white/15 pl-2.5 hidden xs:inline">
            DISPONIBILIDAD ACTIVA
          </span>
        </motion.div>

        {/* Massive Cinematic Title with Split Staggered Spring Reveal */}
        <motion.h1
          variants={titleVariants}
          initial="hidden"
          animate="visible"
          className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10.5rem] font-black tracking-tighter text-white select-none leading-[0.95] sm:leading-none break-words perspective-1000"
        >
          <motion.span variants={letterVariants} className="inline-block text-white">Tecn</motion.span>
          <motion.span variants={letterVariants} className="inline-block text-metallic-pure text-glow">Odiel</motion.span>
        </motion.h1>

        {/* Subtitle oriented to Restaurants and all businesses */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
          className="mt-4 sm:mt-8 max-w-2xl text-xs xs:text-sm sm:text-lg md:text-xl font-light leading-relaxed text-zinc-300 tracking-tight px-1"
        >
          Hacemos páginas web para <span className="text-white font-medium underline decoration-white/40 underline-offset-4">restaurantes</span> y para <span className="text-white font-medium underline decoration-white/40 underline-offset-4">todo negocio</span> que necesite clientes de verdad. Desde Huelva.
        </motion.p>

        {/* Practical Value Grid with Staggered Entrance */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
          className="mt-6 sm:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-xs sm:text-sm font-mono text-zinc-300 max-w-3xl w-full px-1"
        >
          <motion.div 
            whileHover={{ y: -3, borderColor: 'rgba(52, 211, 153, 0.4)' }}
            className="flex items-center justify-start gap-2.5 bg-white/[0.03] border border-white/10 px-3.5 py-2.5 rounded-xl backdrop-blur-md transition-all"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="text-left text-[11px] sm:text-xs">Reservas directas sin comisiones</span>
          </motion.div>
          <motion.div 
            whileHover={{ y: -3, borderColor: 'rgba(52, 211, 153, 0.4)' }}
            className="flex items-center justify-start gap-2.5 bg-white/[0.03] border border-white/10 px-3.5 py-2.5 rounded-xl backdrop-blur-md transition-all"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="text-left text-[11px] sm:text-xs">Cartas interactivas ultrarrápidas</span>
          </motion.div>
          <motion.div 
            whileHover={{ y: -3, borderColor: 'rgba(52, 211, 153, 0.4)' }}
            className="flex items-center justify-start gap-2.5 bg-white/[0.03] border border-white/10 px-3.5 py-2.5 rounded-xl backdrop-blur-md transition-all"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="text-left text-[11px] sm:text-xs">Google Maps y SEO en Huelva</span>
          </motion.div>
        </motion.div>

        {/* CTAs with Direct Subdomain Gateways */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
          className="mt-7 sm:mt-12 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto px-1"
        >
          <motion.button
            onClick={onOpenAudit}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto group relative overflow-hidden flex items-center justify-center gap-2.5 bg-white px-7 py-3.5 sm:px-8 sm:py-4 text-xs sm:text-sm font-bold tracking-tight text-black transition-all duration-300 hover:bg-zinc-100 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] rounded-xl sm:rounded-none"
            id="hero-cta-audit"
          >
            {/* Luminous sheen wave */}
            <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out" />
            <span className="relative z-10">Pedir Presupuesto Para Mi Negocio</span>
            <ChevronRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </motion.button>

          <a
            href={SUBDOMAINS.restaurants.url}
            target="_self"
            className="w-full sm:w-auto text-center group flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm font-mono uppercase tracking-wider text-emerald-300 hover:text-white transition-colors duration-200 border border-emerald-500/30 hover:border-emerald-400 bg-emerald-500/10 rounded-xl sm:rounded-none"
          >
            <span>Restaurantes</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </a>

          <a
            href={SUBDOMAINS.businesses.url}
            target="_self"
            className="w-full sm:w-auto text-center group flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm font-mono uppercase tracking-wider text-cyan-300 hover:text-white transition-colors duration-200 border border-cyan-500/30 hover:border-cyan-400 bg-cyan-500/10 rounded-xl sm:rounded-none"
          >
            <span>Negocios Locales</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </a>
        </motion.div>

        {/* Live Performance HUD Strip (High-Tech Cinematic Cockpit) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          className="mt-10 sm:mt-16 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5 px-2"
        >
          {liveStats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={i}
                whileHover={{ y: -4, scale: 1.02 }}
                className="relative overflow-hidden flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-zinc-950/70 border border-white/10 backdrop-blur-xl group hover:border-white/30 transition-all shadow-lg"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className={`h-3.5 w-3.5 ${stat.color}`} />
                  <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
                <span className={`text-base sm:text-xl font-bold tracking-tight ${stat.color}`}>
                  {stat.value}
                </span>
                <span className="font-mono text-[9px] text-zinc-400 mt-0.5">
                  {stat.detail}
                </span>
                {/* Subtle top indicator glow */}
                <div className="absolute top-0 inset-x-4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-emerald-400/50 transition-colors" />
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>

      {/* Cinematic scroll down link directly to #contacto */}
      <motion.a
        href="#contacto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer z-20"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 hover:text-zinc-200">Deslizar para ver más</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ArrowDown className="h-3.5 w-3.5 text-zinc-400" />
        </motion.div>
      </motion.a>
    </section>
  )
}
