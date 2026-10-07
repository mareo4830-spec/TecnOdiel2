import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CinematicIntro from './components/CinematicIntro';
import CinematicBackground from './components/CinematicBackground';
import Navbar from './components/Navbar';
import ClientAuth from './components/ClientAuth';
import Dashboard from './components/Dashboard';
import AdminMonitoringDashboard from './components/AdminMonitoringDashboard';
import VirtualDeskAdminApp from './components/virtualdesk/VirtualDeskAdminApp';
import VirtualDeskClientPortal from './components/virtualdesk/VirtualDeskClientPortal';
import { getClientRestaurantDetails, verifyClientAccessKey } from './lib/supabase';

export default function App({ 
  initialSlug, 
  onNavigateToMultiwebs, 
  onNavigateToCyS,
  onNavigateToLanding, 
  initialIntroFinished = false, 
  onIntroComplete 
}) {
  const [introFinished, setIntroFinished] = useState(initialIntroFinished);
  const [isAdmin, setIsAdmin] = useState(false);
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
  const [loading, setLoading] = useState(false);

  const handleIntroComplete = () => {
    setIntroFinished(true);
    if (onIntroComplete) onIntroComplete();
  };

  // Sync if initialSlug changes
  useEffect(() => {
    if (initialSlug && initialSlug !== selectedSlug) {
      setSelectedSlug(initialSlug);
      // Al cambiar de negocio destino, requerir autenticación con la clave correspondiente
      if (!isAdmin && !isAdminImpersonating) {
        setIsAuthenticated(false);
        setRestaurantData(null);
      }
    }
  }, [initialSlug, isAdmin, isAdminImpersonating]);

  // Verificar si existe una sesión activa y autorizada con clave en sessionStorage
  useEffect(() => {
    const checkActiveSession = async () => {
      if (typeof window === 'undefined') return;

      try {
        const rawSession = sessionStorage.getItem('tecnodiel_auth_session');
        if (rawSession) {
          const session = JSON.parse(rawSession);
          if (session && session.key && session.slug) {
            // Verificar estrictamente la clave guardada
            const verified = await verifyClientAccessKey(session.key, session.slug);
            if (verified) {
              setRestaurantData(verified);
              setSelectedSlug(verified.slug);
              setIsAuthenticated(true);
              return;
            } else {
              sessionStorage.removeItem('tecnodiel_auth_session');
            }
          }
        }
      } catch (err) {
        console.warn('Error verificando sesión activa:', err);
      }

      // Si no hay sesión válida o no coincide, no autorizar acceso directo
      if (!isAdmin && !isAdminImpersonating) {
        setIsAuthenticated(false);
        setRestaurantData(null);
      }
    };

    if (!isAdmin && !isAdminImpersonating) {
      checkActiveSession();
    }
  }, [isAdmin, isAdminImpersonating]);

  // Recargar datos cuando el cliente ya está autenticado (para refrescar cambios de carta/reservas)
  const loadRestaurant = async (slug) => {
    if (!slug) return;
    setLoading(true);
    try {
      const data = await getClientRestaurantDetails(slug);
      setRestaurantData(data);
    } catch (err) {
      console.error('Error refreshing restaurant data:', err);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="relative min-h-[100dvh] w-full bg-black text-zinc-100 selection:bg-white selection:text-black cinematic-grain overflow-x-hidden">
      {/* Dynamic Background Atmosphere identical to Landing */}
      <CinematicBackground />

      {/* Cinematic Intro: Giant TecnOdiel with kinetic animation before portal */}
      <AnimatePresence mode="wait">
        {!introFinished && (
          <CinematicIntro
            key="cinematic-intro"
            onComplete={handleIntroComplete}
          />
        )}
      </AnimatePresence>

      {/* Main Portal Stage */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 min-h-screen flex flex-col justify-between"
      >
          {/* CASE 1: Master Admin Portal (VirtualDesk-main exact replica) */}
          {isAdmin ? (
            <VirtualDeskAdminApp 
              onSwitchToClientView={() => setIsAdmin(false)}
            />
          ) : (isAuthenticated && restaurantData) ? (
            /* CASE 2: Client Portal (VirtualDesk Style, solo datos necesarios + Hablar con Nosotros) */
            <main className="flex-1 w-full min-h-screen">
              <VirtualDeskClientPortal 
                tenantData={restaurantData}
                onSwitchToAdminView={() => setIsAdmin(true)}
              />
            </main>
          ) : (
            /* CASE 3: Secure Login Gate con acceso rápido a VirtualDesk Admin */
            <main className="flex-1 flex flex-col items-center justify-center p-4">
              <ClientAuth 
                targetSlug={selectedSlug}
                onSelectRestaurant={handleSelectRestaurant} 
                onAdminLogin={() => setIsAdmin(true)}
                onNavigateToLanding={onNavigateToLanding}
                onNavigateToMultiwebs={onNavigateToMultiwebs}
                onNavigateToCyS={onNavigateToCyS}
              />
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setIsAdmin(true)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-mono tracking-wider underline"
                >
                  [⚡ ACCESO DIRECTO OFICINA VIRTUAL ADMIN]
                </button>
              </div>
            </main>
          )}

          {/* Footer branding */}
          <footer className="relative z-10 border-t border-white/5 py-6 px-4 text-center text-xs text-zinc-500 bg-black/60 backdrop-blur-md">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-zinc-300">TecnOdiel</span>
                <span>•</span>
                <span>Portal Privado de Clientes & Administración</span>
              </div>
              <div className="text-[11px] font-mono text-zinc-500">
                Alojamiento Cloudflare Pages • Base de Datos Supabase SSL
              </div>
            </div>
          </footer>
        </motion.div>
    </div>
  );
}
