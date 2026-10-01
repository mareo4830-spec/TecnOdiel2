import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, MessageCircle } from 'lucide-react'

export default function MobileStickyBar({ onOpenAudit }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past top header (approx 120px)
      setVisible(window.scrollY > 120)
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
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden px-3.5 py-2.5 bg-[#09090c]/98 backdrop-blur-xl border-t border-zinc-800 shadow-2xl pb-[calc(0.6rem+env(safe-area-inset-bottom,0px))]"
          aria-label="Barra de acción rápida para móvil"
        >
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            {/* Price Badge Spec */}
            <div className="flex flex-col pl-1">
              <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest leading-none font-medium">
                PRESUPUESTO
              </span>
              <span className="font-mono text-sm font-black text-white leading-tight">
                99€ <span className="text-[10px] text-zinc-400 font-normal">PAGO ÚNICO</span>
              </span>
            </div>

            {/* Ergonomic Touch Actions (Min 44px height for accessibility) */}
            <div className="flex items-center gap-2">
              {/* WhatsApp direct */}
              <a
                href="https://wa.me/34600000000?text=Hola%20TecnOdiel,%20quiero%20información%20sobre%20una%20web%20para%20mi%20negocio"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-industrial min-h-[44px] min-w-[44px] flex items-center justify-center p-2.5 rounded bg-zinc-900 border border-zinc-700 text-emerald-400 active:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-emerald-400"
                aria-label="Abrir WhatsApp directo con TecnOdiel"
                title="WhatsApp Directo"
              >
                <MessageCircle className="h-4 w-4" />
              </a>

              {/* Configure CTA */}
              <button
                onClick={onOpenAudit}
                className="btn-industrial min-h-[44px] flex items-center justify-center gap-1.5 px-4 py-2.5 rounded bg-white text-black font-mono text-xs font-bold uppercase tracking-wider shadow-sm active:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Configurar proyecto web"
              >
                <span>Configurar</span>
                <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
