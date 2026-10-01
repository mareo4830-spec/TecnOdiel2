import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Utensils, Store, Calculator, ArrowUpRight, ChevronRight, Sparkles, CheckCircle2, Shield, Zap, MessageCircle, MapPin } from 'lucide-react'
import { SUBDOMAINS } from '../config/subdomains'

export default function CoverPortal({ onOpenAudit }) {
  // Default selected card on desktop: 'restaurants'
  const [hoveredCard, setHoveredCard] = useState('restaurants')

  const portalCards = [
    {
      id: 'restaurants',
      config: SUBDOMAINS.restaurants,
      icon: Utensils,
      color: 'emerald',
      borderColor: 'group-hover:border-emerald-500/60',
      activeBorder: 'border-emerald-500/50',
      glowBg: 'bg-emerald-500/10',
      glowText: 'text-emerald-400',
      tagText: 'text-emerald-300',
      btnBg: 'bg-emerald-500 hover:bg-emerald-400 text-black',
      actionText: 'Entrar al Portal Restaurantes',
      shortDescription: 'Cartas Digitales QR en 0.18s, Reservas Directas sin comisiones y Control de Sala anti-plantones.',
    },
    {
      id: 'businesses',
      config: SUBDOMAINS.businesses,
      icon: Store,
      color: 'cyan',
      borderColor: 'group-hover:border-cyan-500/60',
      activeBorder: 'border-cyan-500/50',
      glowBg: 'bg-cyan-500/10',
      glowText: 'text-cyan-400',
      tagText: 'text-cyan-300',
      btnBg: 'bg-cyan-400 hover:bg-cyan-300 text-black',
      actionText: 'Entrar al Portal Negocios',
      shortDescription: 'Páginas web profesionales para clínicas, reformas y comercios que posicionan Nº1 en Google Maps.',
    },
    {
      id: 'audit',
      config: SUBDOMAINS.audit,
      icon: Calculator,
      color: 'violet',
      borderColor: 'group-hover:border-violet-500/60',
      activeBorder: 'border-violet-500/50',
      glowBg: 'bg-violet-500/10',
      glowText: 'text-violet-400',
      tagText: 'text-violet-300',
      btnBg: 'bg-white hover:bg-zinc-200 text-black',
      actionText: 'Calcular Presupuesto Online',
      shortDescription: 'Auditoría gratuita en 60 segundos con propuesta personalizada y presupuesto cerrado.',
      onClick: onOpenAudit,
    },
  ]

  const handleCardClick = (card) => {
    if (card.onClick) {
      card.onClick()
      return
    }
    // If it has a subdomain URL
    if (card.config && card.config.url) {
      window.open(card.config.url, card.config.target || '_self')
    }
  }

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-between overflow-x-hidden bg-black text-white px-3 sm:px-6 md:px-12 py-4 sm:py-6 selection:bg-white selection:text-black">
      {/* Background Subtle Grid & Center Glow */}
      <div className="pointer-events-none absolute inset-0 bg-grid-subtle opacity-35" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-r from-emerald-500/10 via-cyan-500/5 to-violet-500/10 blur-[160px] rounded-full" />

      {/* Top Bar: Brand, Status & WhatsApp */}
      <header className="relative z-20 flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-zinc-900 border border-white/20 shadow-lg">
            <span className="font-mono text-xs font-bold text-white tracking-widest">TO</span>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-black tracking-tight text-white">TecnOdiel</span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                Portal Activo
              </span>
            </div>
            <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest block -mt-0.5">
              Huelva // Ingeniería Web
            </span>
          </div>
        </div>

        {/* Right Top Actions */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          <button
            onClick={onOpenAudit}
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.05] hover:bg-white/[0.1] px-4 py-1.5 text-xs font-mono uppercase tracking-wider text-zinc-200 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>Pedir Presupuesto</span>
          </button>

          <a
            href="https://wa.me/34600000000?text=Hola%20TecnOdiel,%20quiero%20información%20para%20mi%20negocio"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black px-3.5 sm:px-4 py-1.5 text-xs font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95"
          >
            <MessageCircle className="h-3.5 w-3.5 text-black" />
            <span className="hidden xs:inline">WhatsApp Directo</span>
            <span className="xs:hidden">WhatsApp</span>
          </a>
        </div>
      </header>

      {/* Main Central Stage: Cinematic Cover Headline + 3 Full Gateway Selector Cards */}
      <main className="relative z-20 my-auto py-6 sm:py-8 flex flex-col items-center justify-center max-w-7xl mx-auto w-full">
        {/* Cinematic Title & Explanatory Tag */}
        <div className="text-center mb-6 sm:mb-10 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1 backdrop-blur-xl"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-zinc-300">
              SELECCIONA TU ÁREA DE NEGOCIO PARA ACCEDER
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white select-none leading-none"
          >
            Tecn<span className="text-metallic-pure">Odiel</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-2.5 sm:mt-4 text-xs sm:text-base md:text-lg text-zinc-300 font-normal leading-relaxed"
          >
            Páginas web, cartas digitales interactivas y sistemas de reservas directas diseñados para llenar tu local y facturar más.
          </motion.p>
        </div>

        {/* 3 Cinematic Gateway Cards (Fullscreen Area Selector) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full">
          {portalCards.map((card, idx) => {
            const Icon = card.icon
            const isHovered = hoveredCard === card.id

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 + idx * 0.1 }}
                onMouseEnter={() => setHoveredCard(card.id)}
                className="group relative"
              >
                <div
                  onClick={() => handleCardClick(card)}
                  className={`cursor-pointer h-full relative rounded-2xl sm:rounded-3xl border bg-zinc-950/85 p-5 sm:p-7 md:p-8 backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-2xl ${
                    isHovered
                      ? `${card.activeBorder} shadow-[0_0_50px_rgba(0,0,0,0.8)] scale-[1.01]`
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Subtle Top Specular Shine */}
                  <div
                    className={`absolute top-0 inset-x-8 h-[2px] bg-gradient-to-r from-transparent via-current to-transparent transition-opacity duration-300 ${
                      card.glowText
                    } ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                  />

                  <div>
                    {/* Badge and Icon */}
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <span className={`font-mono text-[9px] sm:text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border ${card.glowBg} ${card.glowText} border-current/20 font-bold`}>
                        {card.config.badge}
                      </span>
                      <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-white/[0.04] border border-white/15 text-white transition-all group-hover:scale-105 ${card.glowText}`}>
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                    </div>

                    {/* Card Title */}
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white mb-2 group-hover:text-zinc-100 transition-colors">
                      {card.config.name}
                    </h2>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-5 sm:mb-6 font-normal">
                      {card.shortDescription}
                    </p>

                    {/* Metrics Strip */}
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center mb-6 pt-3 border-t border-white/10">
                      {card.config.metrics.map((m, mIdx) => (
                        <div key={mIdx} className="bg-white/[0.03] border border-white/5 p-1.5 sm:p-2 rounded-lg">
                          <span className="font-mono text-[11px] sm:text-xs font-bold text-white block truncate">
                            {m.value}
                          </span>
                          <span className="text-[8px] sm:text-[9px] text-zinc-400 font-mono tracking-tight block truncate mt-0.5">
                            {m.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Feature bullets */}
                    <ul className="space-y-2 mb-6 hidden sm:block">
                      {card.config.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2 text-xs text-zinc-300">
                          <CheckCircle2 className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${card.glowText}`} />
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Gateway Action Button */}
                  <div className="pt-2">
                    <button
                      className={`w-full flex items-center justify-between py-3.5 px-4 sm:px-5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg active:scale-95 ${card.btnBg}`}
                    >
                      <span>{card.actionText}</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </button>
                    <span className="block text-center font-mono text-[9px] text-zinc-400 mt-2">
                      {card.config.url}
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </main>

      {/* Bottom Footer Telemetry */}
      <footer className="relative z-20 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-white/10 pt-3 sm:pt-4 text-[10px] sm:text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-3 sm:gap-6 flex-wrap justify-center">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <MapPin className="h-3 w-3 text-white" />
            Huelva, Andalucía, España
          </span>
          <span className="hidden sm:inline text-zinc-600">•</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Zap className="h-3 w-3" />
            Carga Ultrarrápida &lt; 0.18s
          </span>
          <span className="hidden sm:inline text-zinc-600">•</span>
          <span className="text-zinc-400">
            0€ Comisiones a Terceros
          </span>
        </div>

        <div className="flex items-center gap-4 text-zinc-400">
          <button
            onClick={onOpenAudit}
            className="hover:text-white transition-colors underline underline-offset-4 decoration-white/20"
          >
            Diagnóstico Gratuito
          </button>
          <span>© {new Date().getFullYear()} TecnOdiel</span>
        </div>
      </footer>
    </div>
  )
}
