import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Sparkles } from 'lucide-react'

export default function FloatingContact({ onOpenAudit }) {
  const [hovered, setHovered] = useState(false)

  const handleOpenChatbot = (e) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation()
    }
    if (typeof window === 'undefined') return

    // 1. Integración directa con Botpress WebChat v3.7
    if (window.botpressWebChat && typeof window.botpressWebChat.sendEvent === 'function') {
      window.botpressWebChat.sendEvent({ type: 'show' })
      return
    }

    // 2. Integración Botpress v2 API
    if (window.botpress && typeof window.botpress.open === 'function') {
      window.botpress.open()
      return
    }

    // 3. Integración Voiceflow Chat
    if (window.voiceflow?.chat && typeof window.voiceflow.chat.open === 'function') {
      window.voiceflow.chat.open()
      return
    }

    console.info('[TecnOdiel] Inicializando Botpress Webchat...')
  }

  return (
    <div 
      className="fixed bottom-6 right-5 sm:bottom-8 sm:right-8 z-50 flex items-center gap-3 select-none pointer-events-auto"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Tooltip flotante con diseño moderno y bordes glow */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 12, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 12, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="hidden sm:flex items-center gap-2.5 rounded-full border border-[#6DD94B]/30 bg-[#121212]/95 px-4 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.8),0_0_20px_rgba(109,217,75,0.15)] backdrop-blur-xl"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6DD94B] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6DD94B]" />
            </span>
            <span className="font-mono text-xs uppercase text-white font-semibold tracking-wide">
              ¿DUDAS? CHATEA CON NUESTRA IA DIRECTO
            </span>
            <Sparkles className="h-3.5 w-3.5 text-[#6DD94B] shrink-0 animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón flotante animado de IA */}
      <motion.div
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative flex items-center justify-center"
      >
        {/* Ondas concéntricas de pulso (Radar Wave) */}
        <span 
          className="absolute -inset-2 rounded-full bg-[#6DD94B] opacity-25 animate-ping pointer-events-none" 
          style={{ animationDuration: '2.8s' }} 
        />
        <span 
          className="absolute -inset-1 rounded-full bg-[#6DD94B]/20 blur-md animate-pulse pointer-events-none" 
        />

        {/* Botón interactivo principal */}
        <motion.button
          type="button"
          onClick={handleOpenChatbot}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="relative group h-14 w-14 sm:h-16 sm:w-16 rounded-full flex items-center justify-center bg-gradient-to-tr from-[#4eb62c] via-[#6DD94B] to-[#7ff259] text-black shadow-[0_0_30px_rgba(109,217,75,0.5),0_8px_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_45px_rgba(109,217,75,0.75),0_10px_25px_rgba(0,0,0,0.7)] transition-shadow duration-300 border border-white/25 cursor-pointer outline-none focus:outline-none focus:ring-2 focus:ring-[#6DD94B] focus:ring-offset-2 focus:ring-offset-black"
          aria-label="¿DUDAS? CHATEA CON NUESTRA IA DIRECTO"
        >
          {/* Brillo dinámico de gradiente al hacer hover */}
          <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Iconos del botón: Burbuja de chat + destellos IA */}
          <div className="relative flex items-center justify-center">
            <MessageCircle className="h-7 w-7 text-black fill-black drop-shadow-sm transition-transform duration-300 group-hover:scale-105" />
            <Sparkles className="absolute -top-1 -right-1 h-3.5 w-3.5 text-black fill-black animate-spin" style={{ animationDuration: '8s' }} />
          </div>

          {/* Indicador de estado "En línea" (Live Green Dot) */}
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-300 border-2 border-black" />
          </span>
        </motion.button>
      </motion.div>
    </div>
  )
}
