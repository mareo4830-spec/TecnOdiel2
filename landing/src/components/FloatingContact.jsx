import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import SlingButton from './ui/SlingButton'

export default function FloatingContact({ onOpenAudit }) {
  const [hovered, setHovered] = useState(false)

  const handleOpenChatbot = (e) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation()
    }
    if (typeof window === 'undefined') return

    // 1. Integración Botpress WebChat (sendEvent 'show')
    if (window.botpressWebChat && typeof window.botpressWebChat.sendEvent === 'function') {
      window.botpressWebChat.sendEvent({ type: 'show' })
      return
    }

    // 2. Integración Botpress v2 API (open)
    if (window.botpress && typeof window.botpress.open === 'function') {
      window.botpress.open()
      return
    }

    // 3. Integración Voiceflow Chat (soporte alternativo)
    if (window.voiceflow?.chat && typeof window.voiceflow.chat.open === 'function') {
      window.voiceflow.chat.open()
      return
    }

    console.info('[TecnOdiel] Esperando inicialización de Botpress Webchat...')
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
            className="hidden sm:flex items-center gap-2 border border-white/20 bg-[#121212]/95 px-4 py-2 shadow-2xl backdrop-blur-xl"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6DD94B] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6DD94B]" />
            </span>
            <span className="font-mono text-xs uppercase text-white font-medium tracking-wide">
              ¿DUDAS? CHATEA CON NUESTRA IA DIRECTO
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* React Bits SlingButton: Pull back to send or tap directly */}
      <div 
        className="relative group cursor-pointer"
        onClick={handleOpenChatbot}
      >
        <SlingButton
          size={54}
          padColor="#6DD94B"
          iconColor="#000000"
          accentColor="#38d600"
          wellColor="#121212"
          bandColor="#0D844A"
          onSend={handleOpenChatbot}
          ariaLabel="¿DUDAS? CHATEA CON NUESTRA IA DIRECTO"
          className="shadow-[0_0_30px_rgba(109,217,75,0.4)]"
        >
          <MessageCircle className="h-6 w-6 text-black fill-black" />
        </SlingButton>
      </div>
    </div>
  )
}
