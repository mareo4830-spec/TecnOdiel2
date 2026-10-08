import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './components/home/HomePage';
import AuditModal from './components/AuditModal';
import FormularioPage from './pages/FormularioPage';

function Home({ onNavigateToMultiwebs, onNavigateToCyS, onNavigateToPortal, onNavigateToAdmin }) {
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

/*
 * Router propio de la landing: /formulario es una página nueva e independiente del
 * view-switcher a mano del `src/App.jsx` de la raíz (que, al no reconocer la ruta, cae por
 * defecto a 'landing' y monta este árbol, que entonces ya sabe enrutar internamente).
 */
export default function App(props) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/formulario" element={<FormularioPage />} />
        <Route path="*" element={<Home {...props} />} />
      </Routes>
    </BrowserRouter>
  );
}
