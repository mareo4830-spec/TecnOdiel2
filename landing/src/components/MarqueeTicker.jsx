import React from 'react'
import { motion } from 'framer-motion'
import { Utensils, Store, MapPin, Zap, Shield, Sparkles, Smartphone, Award } from 'lucide-react'

export default function MarqueeTicker() {
  const items = [
    { text: 'RESTAURANTES & BARES', icon: Utensils },
    { text: 'CARTAS DIGITALES QR EN 0.18s', icon: Zap },
    { text: 'RESERVAS DIRECTAS SIN COMISIONES', icon: Shield },
    { text: 'COMERCIOS & NEGOCIOS LOCALES', icon: Store },
    { text: 'POSICIONAMIENTO Nº1 GOOGLE MAPS HUELVA', icon: MapPin },
    { text: 'SISTEMA ANTI-PLANTONES CON FIANZA', icon: Award },
    { text: 'DISEÑO ADAPTADO 100% A MÓVIL', icon: Smartphone },
    { text: 'INGENIERÍA WEB DESDE HUELVA', icon: Sparkles },
  ]

  // Double array for seamless loop
  const marqueeItems = [...items, ...items, ...items]

  return (
    <div className="relative w-full overflow-hidden border-y border-white/10 bg-zinc-950/80 py-3.5 sm:py-4 backdrop-blur-xl select-none">
      {/* Side gradient fades */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-black to-transparent z-10" />

      {/* Marquee Track */}
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: 35,
        }}
        className="flex items-center gap-8 sm:gap-12 whitespace-nowrap will-change-transform"
      >
        {marqueeItems.map((item, i) => {
          const Icon = item.icon
          return (
            <div key={i} className="flex items-center gap-2.5 sm:gap-3">
              <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </span>
              <span className="font-mono text-xs sm:text-sm font-semibold tracking-widest text-zinc-300 uppercase">
                {item.text}
              </span>
              <span className="text-zinc-600 font-mono text-xs ml-4">✦</span>
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}
