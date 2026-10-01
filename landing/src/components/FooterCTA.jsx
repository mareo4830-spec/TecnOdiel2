import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Utensils, Store, MessageCircle } from 'lucide-react'
import { SUBDOMAINS } from '../config/subdomains'

export default function FooterCTA({ onOpenAudit }) {
  const currentYear = new Date().getFullYear()

  return (
    <section 
      id="contacto" 
      className="relative min-h-[100dvh] w-full bg-black text-white flex flex-col justify-center items-center px-4 sm:px-6 md:px-12 py-16 sm:py-24 overflow-hidden border-t border-white/5"
      aria-label="Contacto y acceso a subdominios"
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-white/[0.03] blur-[160px] rounded-full" />
      <div className="pointer-events-none absolute inset-0 bg-grid-subtle opacity-25" />

      {/* Massive Brutalist Hero CTA Block - Exact Match to Screenshot */}
      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl border border-white/15 bg-gradient-to-b from-zinc-950 via-black to-zinc-950 p-6 sm:p-12 md:p-16 text-center overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.95)]"
        >
          {/* Subtle grid pattern */}
          <div className="pointer-events-none absolute inset-0 bg-grid-subtle opacity-20" />
          
          <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto">
            {/* Top diagnostic callout */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 backdrop-blur-md"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-emerald-300 font-medium">
                PROYECTOS NUEVOS: PLAZAS DISPONIBLES ESTE MES
              </span>
            </motion.div>

            {/* Giant Brutalist Headline */}
            <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter text-white uppercase leading-[0.95] mb-4 sm:mb-8 select-none">
              ¿TIENES UN RESTAURANTE <br />
              <span className="text-metallic-pure text-glow">O UN NEGOCIO?</span>
            </h2>

            <p className="max-w-2xl text-xs sm:text-base md:text-lg font-normal text-zinc-300 mb-8 sm:mb-10 leading-relaxed">
              Deja de perder clientes por tener una web lenta, una carta en PDF incómoda o no aparecer bien en Google. Hablemos y te preparamos una propuesta a medida sin ningún compromiso.
            </p>

            {/* Action Buttons: Subdomains + Main Budget Action */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto mb-6 sm:mb-8">
              {/* Main CTA */}
              <motion.button
                onClick={onOpenAudit}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto group relative overflow-hidden flex items-center justify-center gap-2.5 bg-white px-7 sm:px-10 py-4 sm:py-5 text-xs sm:text-base font-bold tracking-tight text-black transition-all duration-300 hover:bg-zinc-100 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] rounded-xl sm:rounded-none"
                id="footer-cta-audit"
                aria-label="Pedir Presupuesto Para Mi Negocio"
              >
                <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/70 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out" />
                <span className="relative z-10">Pedir Presupuesto Sin Compromiso</span>
                <ArrowUpRight className="relative z-10 h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </motion.button>

              {/* Subdomain 1: Restaurantes */}
              <a
                href={SUBDOMAINS.restaurants.url}
                target="_self"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 sm:py-5 text-xs sm:text-sm font-mono uppercase tracking-wider text-emerald-300 hover:text-white transition-all duration-200 border border-emerald-500/30 hover:border-emerald-400 bg-emerald-500/10 rounded-xl sm:rounded-none"
              >
                <Utensils className="h-4 w-4" />
                <span>Restaurantes & Hostelería</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>

              {/* Subdomain 2: Negocios */}
              <a
                href={SUBDOMAINS.businesses.url}
                target="_self"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 sm:py-5 text-xs sm:text-sm font-mono uppercase tracking-wider text-cyan-300 hover:text-white transition-all duration-200 border border-cyan-500/30 hover:border-cyan-400 bg-cyan-500/10 rounded-xl sm:rounded-none"
              >
                <Store className="h-4 w-4" />
                <span>Comercios & Negocios</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Trust Marks */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-mono text-zinc-300">
              <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Te respondemos en menos de 24h</span>
              <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Presupuesto cerrado y claro</span>
              <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Trato directo en Huelva</span>
            </div>
          </div>
        </motion.div>

        {/* Minimalist Bottom Copyright */}
        <div className="mt-8 text-center text-xs font-mono text-zinc-400">
          <span>© {currentYear} TecnOdiel • Huelva, Andalucía, España</span>
        </div>
      </div>
    </section>
  )
}
