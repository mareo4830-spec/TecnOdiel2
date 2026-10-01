import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import SlingButton from './ui/SlingButton'

export default function FloatingContact({ onOpenAudit }) {
  const [hovered, setHovered] = useState(false)

  const handleOpenWhatsApp = () => {
    window.open('https://wa.me/34600000000?text=Hola%20TecnOdiel,%20quiero%20informaci%C3%B3n%20para%20mi%20negocio', '_blank', 'noopener,noreferrer')
  }

  return (
    <div 
      className="fixed bottom-20 sm:bottom-8 right-4 sm:right-8 z-40 flex items-center gap-3"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
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

      {/* React Bits SlingButton: Pull back to send or tap directly */}
      <div className="relative group">
        <SlingButton
          size={54}
          padColor="#10b981"
          iconColor="#000000"
          accentColor="#34d399"
          wellColor="#09090b"
          bandColor="#059669"
          onSend={handleOpenWhatsApp}
          ariaLabel="Contactar por WhatsApp"
          className="shadow-[0_0_30px_rgba(16,185,129,0.4)]"
        >
          <MessageCircle className="h-6 w-6 text-black fill-black" />
        </SlingButton>
      </div>
    </div>
  )
}
