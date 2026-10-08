import React, { useState, useEffect } from 'react';
import HomePage from './components/home/HomePage';
import AuditModal from './components/AuditModal';
import OdielitoRunner from './components/OdielitoRunner';
import FormularioPage from './pages/FormularioPage';

export default function App({ 
  onNavigateToMultiwebs, 
  onNavigateToCyS, 
  onNavigateToPortal,
  onNavigateToAdmin,
  initialIntroFinished = true, 
  onIntroComplete,
  disableOdielito = false
}) {
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [formularioOpen, setFormularioOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.location.pathname.toLowerCase().startsWith('/formulario') ||
      window.location.hash.toLowerCase().includes('formulario')
    );
  });

  useEffect(() => {
    const handleHash = () => {
      const isForm = (
        window.location.pathname.toLowerCase().startsWith('/formulario') ||
        window.location.hash.toLowerCase().includes('formulario')
      );
      setFormularioOpen(isForm);
    };
    window.addEventListener('hashchange', handleHash);
    window.addEventListener('popstate', handleHash);
    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('popstate', handleHash);
    };
  }, []);

  const handleOpenFormulario = () => {
    setFormularioOpen(true);
    window.location.hash = '#formulario';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseFormulario = () => {
    setFormularioOpen(false);
    if (window.location.hash.toLowerCase().includes('formulario')) {
      window.history.pushState(null, '', window.location.pathname === '/formulario' ? '/' : window.location.pathname);
      window.location.hash = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAudit = () => {
    setAuditModalOpen(true);
  };

  const handleCloseAudit = () => {
    setAuditModalOpen(false);
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#121212] text-white selection:bg-[#6DD94B] selection:text-black overflow-x-hidden">
      {formularioOpen ? (
        <FormularioPage onBack={handleCloseFormulario} />
      ) : (
        <>
          <HomePage
            onNavigateToMultiwebs={onNavigateToMultiwebs}
            onNavigateToCyS={onNavigateToCyS}
            onNavigateToPortal={onNavigateToPortal}
            onNavigateToAdmin={onNavigateToAdmin}
            onOpenFormulario={handleOpenFormulario}
          />

          {/* 3D Mascot Odielito: persigue el cursor y lo arrastra al botón de propuesta (solo en la landing) */}
          {!disableOdielito && <OdielitoRunner />}
        </>
      )}

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
