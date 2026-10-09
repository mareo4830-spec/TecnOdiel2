import React from 'react'
import { motion } from 'framer-motion'
import { Utensils, Store, MapPin, Zap, Shield, Sparkles, Smartphone, Award } from 'lucide-react'

export default function MarqueeTicker() {
  const items = [
    { text: 'SOMOS DE HUELVA • DIGITALIZAMOS TU EMPRESA', icon: Sparkles },
    { text: 'CARTAS DIGITALES QR SIN DESCARGAR PDF', icon: Utensils },
    { text: 'RESERVAS DIRECTAS A TU WHATSAPP', icon: Shield },
    { text: '0% COMISIONES POR PEDIDO O MESA', icon: Award },
    { text: 'CITAS MÉDICAS ONLINE LAS 24 HORAS', icon: Zap },
    { text: 'APARECE EL PRIMERO EN GOOGLE MAPS', icon: MapPin },
    { text: 'TU WEB ABRE EN 1 SEGUNDO EN EL MÓVIL', icon: Smartphone },
    { text: 'ATENCIÓN DIRECTA CON MARIO Y JAVIER', icon: Store },
  ]

  // Double array for seamless loop
  const marqueeItems = [...items, ...items, ...items]

  return (
    <div className="relative w-full overflow-hidden border-y border-white/10 bg-[#121212] py-4 select-none">
      {/* Side gradient fades */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-[#121212] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-[#121212] to-transparent z-10" />

      {/* Marquee Track */}
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: 30,
        }}
        className="flex items-center gap-8 sm:gap-12 whitespace-nowrap will-change-transform"
      >
        {marqueeItems.map((item, i) => {
          const Icon = item.icon
          return (
            <div key={i} className="flex items-center gap-2.5 sm:gap-3">
              <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center bg-[#181818] border border-white/15 text-[#6DD94B]">
                <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </span>
              <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-white uppercase">
                {item.text}
              </span>
              <span className="text-[#6DD94B] font-mono text-xs ml-4">//</span>
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}
