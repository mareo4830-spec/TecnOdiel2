import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import MainPortalCard from './components/MainPortalCard'
import AuditModal from './components/AuditModal'
import ScrollProgress from './components/ScrollProgress'
import CinematicBackground from './components/CinematicBackground'
import FloatingContact from './components/FloatingContact'
import CinematicIntro from './components/CinematicIntro'

export default function App({ onNavigateToMultiwebs, initialIntroFinished = false, onIntroComplete }) {
  const [auditModalOpen, setAuditModalOpen] = useState(false)
  const [introFinished, setIntroFinished] = useState(initialIntroFinished)

  const handleIntroComplete = () => {
    setIntroFinished(true)
    if (onIntroComplete) onIntroComplete()
  }

  const handleOpenAudit = () => {
    setAuditModalOpen(true)
  }

  const handleCloseAudit = () => {
    setAuditModalOpen(false)
  }

  return (
    <div className="relative min-h-[100dvh] w-full bg-black text-zinc-100 selection:bg-white selection:text-black cinematic-grain overflow-x-hidden">
      {/* Top Laser Progress Accent */}
      <ScrollProgress />

      {/* Atmospheric Ambient Glow & Dynamic Pointer Spotlight */}
      <CinematicBackground />

      {/* Cinematic Intro: Giant TecnOdiel with animation before revealing portal */}
      <AnimatePresence mode="wait">
        {!introFinished && (
          <CinematicIntro
            key="cinematic-intro"
            onComplete={handleIntroComplete}
          />
        )}
      </AnimatePresence>

      {/* Fixed Global Navigation */}
      <Navbar onOpenAudit={handleOpenAudit} />

      {/* Main Stage: Portada Principal Centrada y Elegante */}
      <motion.main
        id="main-content"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full min-h-[100dvh] flex items-center justify-center"
      >
        <MainPortalCard onOpenAudit={handleOpenAudit} />
      </motion.main>

      {/* Floating Interactive WhatsApp Quick Contact */}
      <FloatingContact onOpenAudit={handleOpenAudit} />

      {/* Interactive & Secure Technical Audit Diagnostic Modal with Direct Restaurant Routing */}
      <AuditModal 
        isOpen={auditModalOpen} 
        onClose={handleCloseAudit} 
        onNavigateToMultiwebs={onNavigateToMultiwebs}
      />
    </div>
  )
}
