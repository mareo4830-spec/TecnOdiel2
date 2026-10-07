import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ClientAuth from './components/ClientAuth';
import VirtualDeskAdminApp from './components/virtualdesk/VirtualDeskAdminApp';
import VirtualDeskClientPortal from './components/virtualdesk/VirtualDeskClientPortal';
import { getClientRestaurantDetails, verifyClientAccessKey } from './lib/supabase';

export default function App({ 
  initialSlug, 
  initialAdmin = false,
  onNavigateToMultiwebs, 
  onNavigateToCyS,
  onNavigateToLanding, 
  onNavigateToAdmin
}) {
  const [isAdmin, setIsAdmin] = useState(() => {
    if (initialAdmin) return true;
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      return params.get('view') === 'admin' || hash.includes('admin') || path.includes('/admin');
    }
    return false;
  });

  const [isAdminImpersonating, setIsAdminImpersonating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState(() => {
    if (initialSlug) return initialSlug;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('r') || params.get('slug') || params.get('restaurant') || null;
    }
    return null;
  });
  const [restaurantData, setRestaurantData] = useState(null);
  const [isVerifyingSession, setIsVerifyingSession] = useState(() => {
    if (initialAdmin) return false;
    if (typeof window === 'undefined') return false;
    const hash = window.location.hash.toLowerCase();
    const path = window.location.pathname.toLowerCase();
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'admin' || hash.includes('admin') || path.includes('/admin')) return false;
    try {
      const raw = sessionStorage.getItem('tecnodiel_auth_session');
      return !!raw;
    } catch (_) { return false; }
  });

  // Sync if initialAdmin or URL hash changes
  useEffect(() => {
    const handleLocationSync = () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      if (initialAdmin || params.get('view') === 'admin' || hash.includes('admin') || path.includes('/admin')) {
        setIsAdmin(true);
        setIsVerifyingSession(false);
      }
    };
    handleLocationSync();
    window.addEventListener('hashchange', handleLocationSync);
    window.addEventListener('popstate', handleLocationSync);
    return () => {
      window.removeEventListener('hashchange', handleLocationSync);
      window.removeEventListener('popstate', handleLocationSync);
    };
  }, [initialAdmin]);

  // Sync if initialSlug changes
  useEffect(() => {
    if (initialSlug && initialSlug !== selectedSlug) {
      setSelectedSlug(initialSlug);
      if (!isAdmin && !isAdminImpersonating) {
        setIsAuthenticated(false);
        setRestaurantData(null);
      }
    }
  }, [initialSlug, isAdmin, isAdminImpersonating]);

  // Verificar si existe una sesión activa y autorizada con clave en sessionStorage sin parpadeos
  useEffect(() => {
    const checkActiveSession = async () => {
      if (typeof window === 'undefined') {
        setIsVerifyingSession(false);
        return;
      }

      try {
        const rawSession = sessionStorage.getItem('tecnodiel_auth_session');
        if (rawSession) {
          const session = JSON.parse(rawSession);
          if (session && session.key && session.slug) {
            const verified = await verifyClientAccessKey(session.key, session.slug);
            if (verified) {
              setRestaurantData(verified);
              setSelectedSlug(verified.slug);
              setIsAuthenticated(true);
              setIsVerifyingSession(false);
              return;
            } else {
              sessionStorage.removeItem('tecnodiel_auth_session');
            }
          }
        }
      } catch (err) {
        console.warn('Error verificando sesión activa:', err);
      } finally {
        setIsVerifyingSession(false);
      }

      if (!isAdmin && !isAdminImpersonating) {
        setIsAuthenticated(false);
        setRestaurantData(null);
      }
    };

    if (!isAdmin && !isAdminImpersonating) {
      checkActiveSession();
    } else {
      setIsVerifyingSession(false);
    }
  }, [isAdmin, isAdminImpersonating]);

  const handleSelectRestaurant = (matchedRestaurant, verifiedKey) => {
    if (matchedRestaurant && matchedRestaurant.slug) {
      setRestaurantData(matchedRestaurant);
      setSelectedSlug(matchedRestaurant.slug);
      setIsAuthenticated(true);
      setIsAdmin(false);
      setIsAdminImpersonating(false);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('tecnodiel_auth_session', JSON.stringify({
          slug: matchedRestaurant.slug,
          key: verifiedKey
        }));
      }
    }
  };

  const handleAdminLogin = () => {
    setIsAdmin(true);
    setIsAdminImpersonating(false);
    setSelectedSlug(null);
    setRestaurantData(null);
    setIsAuthenticated(false);
  };

  const handleImpersonateClient = async (slugOrId) => {
    setIsAdmin(false);
    setIsAdminImpersonating(true);
    setSelectedSlug(slugOrId);
    try {
      const data = await getClientRestaurantDetails(slugOrId);
      setRestaurantData(data);
      setIsAuthenticated(true);
    } catch (e) {
      console.warn('Error impersonating client:', e);
    }
  };

  const handleBackToAdmin = () => {
    setIsAdmin(true);
    setIsAdminImpersonating(false);
    setSelectedSlug(null);
    setRestaurantData(null);
    setIsAuthenticated(false);
  };

  const handleSwitchRestaurant = () => {
    setSelectedSlug(null);
    setRestaurantData(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    setIsAdminImpersonating(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('tecnodiel_auth_session');
      localStorage.removeItem('tecnodiel_client_slug');
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#121212] text-zinc-100 selection:bg-[#6DD94B] selection:text-black overflow-x-hidden font-['Montserrat',Inter,sans-serif]">
      {/* Fondo estético idéntico a la nueva Landing */}
      <div 
        className="pointer-events-none fixed inset-0 opacity-40 z-0" 
        style={{ 
          backgroundImage: 'radial-gradient(60% 50% at 70% 30%, rgba(109,217,75,0.18), transparent 70%), radial-gradient(40% 40% at 10% 90%, rgba(13,132,74,0.30), transparent 70%)' 
        }} 
      />
      <div 
        className="pointer-events-none fixed inset-0 z-0 opacity-50" 
        style={{ 
          backgroundSize: '64px 64px', 
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)' 
        }} 
      />

      {/* Main Portal Stage */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 min-h-screen flex flex-col justify-between"
      >
        {/* CASE 1: Master Admin Portal (VirtualDesk-main exact replica) */}
        {isAdmin ? (
          <VirtualDeskAdminApp 
            onSwitchToClientView={() => setIsAdmin(false)}
            onNavigateToLanding={onNavigateToLanding}
          />
        ) : isVerifyingSession ? (
          /* CASE 2: Verificando sesión guardada */
          <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-10 h-10 border-2 border-[#6DD94B] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-bold text-white tracking-wide">Cargando portal seguro...</p>
            <p className="text-xs text-zinc-400 mt-1">TecnOdiel</p>
          </main>
        ) : (isAuthenticated && restaurantData) ? (
          /* CASE 3: Client Portal (VirtualDesk Style) */
          <main className="flex-1 w-full min-h-screen">
            <VirtualDeskClientPortal 
              tenantData={restaurantData}
              onSwitchToAdminView={() => setIsAdmin(true)}
              onNavigateToLanding={onNavigateToLanding}
            />
          </main>
        ) : (
          /* CASE 4: Secure Login Gate adaptado a la estética de TecnOdiel */
          <main className="flex-1 flex flex-col items-center justify-center p-4">
            <ClientAuth 
              targetSlug={selectedSlug}
              onSelectRestaurant={handleSelectRestaurant} 
              onAdminLogin={() => setIsAdmin(true)}
              onNavigateToLanding={onNavigateToLanding}
              onNavigateToMultiwebs={onNavigateToMultiwebs}
              onNavigateToCyS={onNavigateToCyS}
            />
          </main>
        )}

        {/* Footer branding TecnOdiel (solo en portal de cliente / login, no en el panel maestro) */}
        {!isAdmin && (
          <footer className="relative z-10 border-t border-white/10 py-5 px-4 text-center text-xs text-zinc-400 bg-[#121212]/90 backdrop-blur-md">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">TecnOdiel</span>
                <span>•</span>
                <span>Portal Privado de Clientes & Administración</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <button 
                  type="button" 
                  onClick={() => setIsAdmin(!isAdmin)}
                  className="text-[#6DD94B] hover:underline font-semibold cursor-pointer"
                >
                  Acceder al Panel Admin
                </button>
                {onNavigateToLanding && (
                  <button 
                    type="button" 
                    onClick={onNavigateToLanding}
                    className="text-zinc-400 hover:text-white cursor-pointer"
                  >
                    Volver a la web
                  </button>
                )}
              </div>
            </div>
          </footer>
        )}
      </motion.div>
    </div>
  );
}
