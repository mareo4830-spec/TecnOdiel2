import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Sparkles } from 'lucide-react'

export default function FloatingContact({ onOpenAudit }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div className="fixed bottom-20 sm:bottom-8 right-4 sm:right-8 z-40 flex items-center gap-3">
      {/* Expanded Pill Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 12, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 12, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/30 bg-zinc-950/90 px-4 py-2 shadow-2xl backdrop-blur-xl"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="font-mono text-xs text-zinc-200">
              ¿Dudas? Chatea en WhatsApp directo
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button with Radar Pulse */}
      <motion.a
        href="https://wa.me/34600000000?text=Hola%20TecnOdiel,%20quiero%20informaci%C3%B3n%20para%20mi%20negocio"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="relative group flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-emerald-500 text-black shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-colors hover:bg-emerald-400 focus:outline-none"
        aria-label="Contactar por WhatsApp"
      >
        {/* Sonar Radar Waves */}
        <span className="absolute -inset-1 rounded-full border border-emerald-400/50 animate-ping opacity-60 pointer-events-none" />
        <span className="absolute -inset-2.5 rounded-full border border-emerald-400/20 animate-pulse pointer-events-none" />

        <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7 text-black transition-transform group-hover:scale-110" />
      </motion.a>
    </div>
  )
}
