import React, { useState } from 'react'
import Navbar from './components/Navbar'
import MainPortalCard from './components/MainPortalCard'
import AuditModal from './components/AuditModal'
import ScrollProgress from './components/ScrollProgress'
import CinematicBackground from './components/CinematicBackground'
import FloatingContact from './components/FloatingContact'
import MobileStickyBar from './components/MobileStickyBar'

export default function App({ onNavigateToMultiwebs }) {
  const [auditModalOpen, setAuditModalOpen] = useState(false)

  const handleOpenAudit = () => {
    setAuditModalOpen(true)
  }

  const handleCloseAudit = () => {
    setAuditModalOpen(false)
  }

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#070709] text-zinc-100 selection:bg-white selection:text-black overflow-x-hidden">
      {/* Top Precision Progress Accent */}
      <ScrollProgress />

      {/* Industrial Architectural Precision Canvas */}
      <CinematicBackground />

      {/* Fixed Industrial Minimalist Navigation */}
      <Navbar onOpenAudit={handleOpenAudit} />

      {/* Main Industrial Control Interface */}
      <main id="main-content" className="relative z-10 w-full min-h-[100dvh] flex items-center justify-center">
        <MainPortalCard onOpenAudit={handleOpenAudit} />
      </main>

      {/* Desktop Floating WhatsApp Utility */}
      <FloatingContact />

      {/* Mobile Sticky Industrial Action Dock */}
      <MobileStickyBar onOpenAudit={handleOpenAudit} />

      {/* Project Configurator Diagnostic Modal */}
      <AuditModal 
        isOpen={auditModalOpen} 
        onClose={handleCloseAudit} 
        onNavigateToMultiwebs={onNavigateToMultiwebs}
      />
    </div>
  )
}
