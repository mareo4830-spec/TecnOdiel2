import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, MessageCircle, Sparkles } from 'lucide-react'

export default function MobileStickyBar({ onOpenAudit }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past hero (approx 350px)
      setVisible(window.scrollY > 350)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden p-3 bg-zinc-950/90 backdrop-blur-2xl border-t border-white/10 shadow-[0_-8px_30px_rgba(0,0,0,0.8)] pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]"
          aria-label="Acciones rápidas para móvil"
        >
          <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
            {/* Direct WhatsApp button */}
            <a
              href="https://wa.me/34600000000?text=Hola%20TecnOdiel,%20quiero%20información%20sobre%20una%20web%20para%20mi%20negocio"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 font-mono text-[11px] font-medium active:scale-95 transition-transform"
              aria-label="Escribir por WhatsApp a TecnOdiel"
            >
              <MessageCircle className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>WhatsApp</span>
            </a>

            {/* Direct Audit / Presupuesto trigger */}
            <button
              onClick={onOpenAudit}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black font-sans text-xs font-bold active:scale-95 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.25)]"
              aria-label="Pedir Presupuesto sin compromiso"
            >
              <span>Pedir Presupuesto</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-black" />
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
