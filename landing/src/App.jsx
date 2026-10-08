import React, { useState } from 'react';
import HomePage from './components/home/HomePage';
import AuditModal from './components/AuditModal';
import OdielitoRunner from './components/OdielitoRunner';

export default function App({ 
  onNavigateToMultiwebs, 
  onNavigateToCyS, 
  onNavigateToPortal,
  onNavigateToAdmin,
  initialIntroFinished = true, 
  onIntroComplete 
}) {
  const [auditModalOpen, setAuditModalOpen] = useState(false);

  const handleOpenAudit = () => {
    setAuditModalOpen(true);
  };

  const handleCloseAudit = () => {
    setAuditModalOpen(false);
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#121212] text-white selection:bg-[#6DD94B] selection:text-black overflow-x-hidden">
      <HomePage
        onNavigateToMultiwebs={onNavigateToMultiwebs}
        onNavigateToCyS={onNavigateToCyS}
        onNavigateToPortal={onNavigateToPortal}
        onNavigateToAdmin={onNavigateToAdmin}
      />

      {/* 3D Mascot Odielito: persigue el cursor y lo arrastra a "Pide tu propuesta" */}
      <OdielitoRunner />

      {/* Interactive & Secure Technical Audit Diagnostic Modal with Direct Restaurant Routing */}
      <AuditModal 
        isOpen={auditModalOpen} 
        onClose={handleCloseAudit} 
        onNavigateToMultiwebs={onNavigateToMultiwebs}
        onNavigateToCyS={onNavigateToCyS}
      />
    </div>
  );
}
