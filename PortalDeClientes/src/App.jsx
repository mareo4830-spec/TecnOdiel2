import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ClientAuth from './components/ClientAuth';
import VirtualDeskAdminApp from './components/virtualdesk/VirtualDeskAdminApp';
import VirtualDeskClientPortal from './components/virtualdesk/VirtualDeskClientPortal';
import { getClientRestaurantDetails, verifyClientAccessKey, supabase, portalAuthClient } from './lib/supabase';

class PortalAdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Portal Admin error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="p-6 max-w-md bg-zinc-900 border border-[#6DD94B]/30 rounded-2xl shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-2">Panel de Administrador</h2>
            <p className="text-xs text-zinc-400 mb-4">Error al inicializar el panel. Pulsa para reintentar.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-[#6DD94B] text-black font-bold text-xs rounded-xl"
            >
              Recargar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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
  const [showGreenSplash, setShowGreenSplash] = useState(true);
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

  // Animación de bienvenida en pantalla verde completa
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGreenSplash(false);
    }, 1400);
    return () => clearTimeout(timer);
  }, []);

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

  const handleLogoutToLanding = async () => {
    setSelectedSlug(null);
    setRestaurantData(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    setIsAdminImpersonating(false);
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('tecnodiel_auth_session');
        sessionStorage.removeItem('tecnodiel_formulario_draft');
        sessionStorage.removeItem('tecnodiel_pending_portal_redirect');
        localStorage.removeItem('tecnodiel_client_slug');
        localStorage.removeItem('tecnodiel_has_project');
        localStorage.removeItem('tecnodiel-admin-auth');
        await portalAuthClient.auth.signOut();
        await supabase.auth.signOut();
      } catch (_) {}
      if (onNavigateToLanding) {
        onNavigateToLanding();
      }
      window.history.pushState(null, '', '/');
      window.location.hash = '';
      window.location.href = '/';
    }
  };

  const handleSwitchRestaurant = () => {
    handleLogoutToLanding();
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#121212] text-zinc-100 selection:bg-[#6DD94B] selection:text-black overflow-x-hidden font-['Montserrat',Inter,sans-serif]">
      {/* Animación apertura: pantalla completa en verde con letras blancas "Portal de Clientes" */}
      <AnimatePresence>
        {showGreenSplash && (
          <motion.div
            key="portal-green-splash"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: 'easeInOut' }}
            className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-gradient-to-b from-[#1b5030] via-[#21633c] to-[#174529] px-6 text-center select-none shadow-2xl"
          >
            <motion.h1
              initial={{ scale: 0.90, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.04, opacity: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white drop-shadow-sm"
            >
              Portal de Clientes
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.35 }}
              className="mt-3 text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-100/85"
            >
              TecnOdiel
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

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
          <PortalAdminErrorBoundary>
            <VirtualDeskAdminApp 
              onSwitchToClientView={() => setIsAdmin(false)}
              onNavigateToLanding={onNavigateToLanding}
            />
          </PortalAdminErrorBoundary>
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
              onNavigateToLanding={handleLogoutToLanding}
              onLogout={handleLogoutToLanding}
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
                  onClick={handleLogoutToLanding}
                  className="text-zinc-400 hover:text-white cursor-pointer"
                >
                  Volver a la web
                </button>
              </div>
            </div>
          </footer>
        )}
      </motion.div>
    </div>
  );
}
