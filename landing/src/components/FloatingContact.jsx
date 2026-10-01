import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

export default function FloatingContact() {
  const [hovered, setHovered] = useState(false)

  return (
    <div className="hidden md:flex fixed bottom-6 right-6 z-40 items-center gap-3 select-none">
      {/* Industrial Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 8, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2 rounded px-3 py-1.5 bg-zinc-900/95 border border-zinc-700 font-mono text-[11px] text-zinc-200 shadow-xl backdrop-blur-md"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>ATENCIÓN TÉCNICA HUELVA</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Machined Tactical WhatsApp Button */}
      <motion.a
        href="https://wa.me/34600000000?text=Hola%20TecnOdiel,%20quiero%20información%20sobre%20una%20web%20para%20mi%20negocio"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="btn-industrial flex h-11 w-11 items-center justify-center rounded bg-zinc-900 border border-zinc-700 text-emerald-400 shadow-lg hover:border-zinc-500 hover:bg-zinc-800 transition-colors"
        aria-label="Contactar por WhatsApp con TecnOdiel"
        title="WhatsApp Directo"
      >
        <MessageCircle className="h-5 w-5" />
      </motion.a>
    </div>
  )
}
