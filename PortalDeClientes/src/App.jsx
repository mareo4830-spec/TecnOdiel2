import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CinematicIntro from './components/CinematicIntro';
import CinematicBackground from './components/CinematicBackground';
import Navbar from './components/Navbar';
import ClientAuth from './components/ClientAuth';
import Dashboard from './components/Dashboard';
import AdminMonitoringDashboard from './components/AdminMonitoringDashboard';
import { getClientRestaurantDetails } from './lib/supabase';

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
  const [selectedSlug, setSelectedSlug] = useState(() => {
    if (initialSlug) return initialSlug;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('r') || params.get('slug') || params.get('restaurant') || localStorage.getItem('tecnodiel_client_slug') || null;
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
    }
  }, [initialSlug]);

  // Load restaurant details when slug changes
  const loadRestaurant = async (slug) => {
    if (!slug) {
      setRestaurantData(null);
      return;
    }
    setLoading(true);
    try {
      const data = await getClientRestaurantDetails(slug);
      setRestaurantData(data);
      if (typeof window !== 'undefined') {
        localStorage.setItem('tecnodiel_client_slug', slug);
      }
    } catch (err) {
      console.error('Error loading restaurant data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSlug && !isAdmin) {
      loadRestaurant(selectedSlug);
    }
  }, [selectedSlug, isAdmin]);

  const handleSelectRestaurant = (slug) => {
    setSelectedSlug(slug);
    setIsAdmin(false);
    setIsAdminImpersonating(false);
  };

  const handleAdminLogin = () => {
    setIsAdmin(true);
    setIsAdminImpersonating(false);
    setSelectedSlug(null);
    setRestaurantData(null);
  };

  const handleImpersonateClient = (slugOrId) => {
    setIsAdmin(false);
    setIsAdminImpersonating(true);
    setSelectedSlug(slugOrId);
  };

  const handleBackToAdmin = () => {
    setIsAdmin(true);
    setIsAdminImpersonating(false);
    setSelectedSlug(null);
    setRestaurantData(null);
  };

  const handleSwitchRestaurant = () => {
    setSelectedSlug(null);
    setRestaurantData(null);
    setIsAdmin(false);
    setIsAdminImpersonating(false);
    if (typeof window !== 'undefined') {
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
          {/* CASE 1: Master Admin Monitoring Dashboard */}
          {isAdmin ? (
            <AdminMonitoringDashboard 
              onImpersonateClient={handleImpersonateClient}
              onLogout={handleSwitchRestaurant}
              onNavigateToLanding={onNavigateToLanding}
            />
          ) : restaurantData ? (
            /* CASE 2: Single Client Dashboard (Isolated) */
            <>
              <Navbar 
                restaurant={restaurantData} 
                onSwitchRestaurant={handleSwitchRestaurant}
                onNavigateToMultiwebs={onNavigateToMultiwebs}
                onNavigateToCyS={onNavigateToCyS}
                onNavigateToLanding={onNavigateToLanding}
                isAdminImpersonating={isAdminImpersonating}
                onBackToAdmin={handleBackToAdmin}
              />
              <main className="flex-1">
                <Dashboard 
                  restaurant={restaurantData} 
                  onRefresh={() => loadRestaurant(selectedSlug)} 
                />
              </main>
            </>
          ) : (
            /* CASE 3: Secure Login Gate (Client Key or Master Admin) */
            <main className="flex-1 flex items-center justify-center">
              <ClientAuth 
                onSelectRestaurant={handleSelectRestaurant} 
                onAdminLogin={handleAdminLogin}
                onNavigateToLanding={onNavigateToLanding}
                onNavigateToMultiwebs={onNavigateToMultiwebs}
                onNavigateToCyS={onNavigateToCyS}
              />
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
