import React, { useState, useEffect } from 'react';
import HomePage from './components/home/HomePage';
import AuditModal from './components/AuditModal';
import OdielitoRunner from './components/OdielitoRunner';
import FormularioPage from './pages/FormularioPage';
import { useAccount, client } from './lib/adminAuth';
import { computeOurPrice, computeReferencePrice } from './components/formulario/pricing';

export default function App({ 
  onNavigateToMultiwebs, 
  onNavigateToCyS, 
  onNavigateToPortal,
  onNavigateToAdmin,
  initialIntroFinished = true, 
  onIntroComplete,
  disableOdielito = false
}) {
  const account = useAccount();
  const [isProcessingPortal, setIsProcessingPortal] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return (
        sessionStorage.getItem('tecnodiel_pending_portal_redirect') === 'true' ||
        localStorage.getItem('tecnodiel_pending_portal_redirect') === 'true'
      );
    } catch {
      return false;
    }
  });

  // Manejar el retorno de Google OAuth para enviar la propuesta e ir al portal directamente
  useEffect(() => {
    const handlePendingSubmission = async () => {
      try {
        const isPending = (
          sessionStorage.getItem('tecnodiel_pending_portal_redirect') === 'true' ||
          localStorage.getItem('tecnodiel_pending_portal_redirect') === 'true'
        );
        if (!isPending) return;

        if (account.profile) {
          const rawForm = (
            sessionStorage.getItem('tecnodiel_pending_form') ||
            localStorage.getItem('tecnodiel_pending_form') ||
            sessionStorage.getItem('tecnodiel_formulario_draft')
          );

          if (rawForm) {
            const parsedForm = JSON.parse(rawForm);
            const userEmail = (account.profile.email || parsedForm.email || '').trim().toLowerCase();
            const ourPrice = computeOurPrice(parsedForm.features || []);
            const referencePrice = computeReferencePrice(ourPrice, parsedForm.features || []);
            const projectRecord = {
              business_name: parsedForm.businessName,
              name: parsedForm.businessName,
              business_type: parsedForm.sector,
              sector: parsedForm.sector,
              contact_name: parsedForm.contactName || account.profile?.name || '',
              phone: parsedForm.phone,
              email: userEmail,
              city: 'Huelva',
              source: 'formulario_web',
              stage: 'contactado',
              estimated_value: ourPrice,
              budget: ourPrice,
              owner: 'javier',
              intake: {
                ambiente: parsedForm.ambiente,
                features: parsedForm.features,
                layoutFamily: parsedForm.layoutFamily,
                layoutVariant: parsedForm.layoutVariant,
                accentOverride: parsedForm.accentOverride || null,
                ourPrice,
                referencePrice,
              },
            };

            if (client) {
              try {
                await client.from('leads').insert(projectRecord);
              } catch (err) {
                console.warn('Error insertando lead tras Google Auth:', err);
              }
            }
            if (userEmail) {
              localStorage.setItem(`tecnodiel_client_project_${userEmail}`, JSON.stringify(projectRecord));
            }
            localStorage.setItem('tecnodiel_active_project', JSON.stringify(projectRecord));
            localStorage.setItem('tecnodiel_has_project', 'true');
          }

          sessionStorage.removeItem('tecnodiel_pending_portal_redirect');
          localStorage.removeItem('tecnodiel_pending_portal_redirect');
          sessionStorage.removeItem('tecnodiel_pending_form');
          localStorage.removeItem('tecnodiel_pending_form');
          sessionStorage.removeItem('tecnodiel_formulario_draft');
          sessionStorage.removeItem('tecnodiel_formulario_step');
          sessionStorage.removeItem('tecnodiel_formulario_show_price');

          setIsProcessingPortal(false);

          if (onNavigateToPortal) {
            onNavigateToPortal();
          } else if (typeof window !== 'undefined') {
            window.location.hash = '#/portal';
          }
        }
      } catch (err) {
        console.warn('Error procesando propuesta pendiente:', err);
        setIsProcessingPortal(false);
      }
    };

    handlePendingSubmission();
  }, [account.profile, onNavigateToPortal]);

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

  if (isProcessingPortal) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-2 border-[#6DD94B] border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-bold text-white mb-1">Confirmando tu propuesta...</h2>
        <p className="text-xs text-zinc-400">Entrando a tu Portal de Clientes de TecnOdiel</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#121212] text-white selection:bg-[#6DD94B] selection:text-black overflow-x-hidden">
      {formularioOpen ? (
        <FormularioPage onBack={handleCloseFormulario} onNavigateToPortal={onNavigateToPortal} />
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
