import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import CinematicIntro from './components/CinematicIntro';
import Navbar from './components/Navbar';
import DashboardOverview from './components/Dashboard/DashboardOverview';
import RestaurantWizard from './components/Wizard/RestaurantWizard';
import TemplateRenderer from './components/Templates/TemplateRenderer';
import { fetchRestaurants } from './lib/supabase';
import { ArrowLeft } from 'lucide-react';

// Helper to detect distinct tenant subdomain (e.g. "marea-negra.vercel.app" or "marea-negra.localhost")
function detectTenantSlug() {
  if (typeof window === 'undefined') return null;

  // 1. Support query parameter (e.g. ?r=marea-negra) for testing or iframe previews
  const params = new URLSearchParams(window.location.search);
  const qSlug = params.get('r') || params.get('slug') || params.get('restaurant');
  if (qSlug) return qSlug.toLowerCase().trim();

  // 2. Extract subdomain from host
  const host = window.location.hostname;
  if (!host || host === '127.0.0.1') return null;

  const parts = host.split('.');
  // e.g. "marea-negra.localhost" -> 2 parts
  if (parts.length === 2 && parts[1] === 'localhost') {
    return parts[0].toLowerCase().trim();
  }
  // e.g. "marea-negra.vercel.app" or "marea-negra.tecnodiel.app" -> 3+ parts
  if (parts.length >= 3) {
    const sub = parts[0].toLowerCase().trim();
    if (!['www', 'app', 'api', 'admin', 'tecnodiel', 'multiwebs'].includes(sub)) {
      return sub;
    }
  }

  return null;
}

export default function App({ onNavigateToPortal, onNavigateToLanding }) {
  const [restaurants, setRestaurants] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'wizard', 'manager', 'public_restaurant', 'standalone_tenant'
  const [activeRestaurant, setActiveRestaurant] = useState(null);
  const [publicSlug, setPublicSlug] = useState(null);
  const [tenantSlug, setTenantSlug] = useState(() => detectTenantSlug());
  const [introFinished, setIntroFinished] = useState(false);
  const lastPathRef = useRef(typeof window !== 'undefined' ? (window.location.hash || window.location.pathname) : '');

  // Load restaurants on mount
  const loadData = async () => {
    const list = await fetchRestaurants();
    setRestaurants(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle URL hash & host-based tenant routing
  useEffect(() => {
    const handleRouting = () => {
      const detected = detectTenantSlug();
      const hash = window.location.hash;
      const pathname = window.location.pathname;

      const currentRoute = hash || pathname;
      if (lastPathRef.current && lastPathRef.current !== currentRoute) {
        setIntroFinished(false);
      }
      lastPathRef.current = currentRoute;

      // Case A: Visited via distinct Vercel subdomain (e.g. "bar-pepe.vercel.app")
      if (detected) {
        setTenantSlug(detected);
        const target = restaurants.find(r => 
          r.slug === detected || 
          r.subdomain === detected ||
          (r.vercel_domain && r.vercel_domain.startsWith(detected))
        );

        if (target) {
          setActiveRestaurant(target);
          if (pathname.includes('/admin') || hash === '#admin' || hash === '#/admin') {
            if (onNavigateToPortal) {
              onNavigateToPortal(target.slug);
            } else {
              window.location.hash = `#/portal?r=${target.slug}`;
            }
            return;
          } else {
            setCurrentView('standalone_tenant');
          }
          return;
        }
      }

      // Case B: Master Platform Routing (tecnodiel.vercel.app or localhost)
      if (hash.startsWith('#r/') || hash.startsWith('#/r/')) {
        const path = hash.replace(/^#\/?r\//, '');
        if (path.includes('/admin')) {
          const slug = path.replace(/\/admin.*$/, '');
          if (onNavigateToPortal) {
            onNavigateToPortal(slug);
          } else {
            window.location.hash = `#/portal?r=${slug}`;
          }
          return;
        }
        setPublicSlug(path);
        setCurrentView('public_restaurant');
      } else if (hash === '#wizard' || hash === '#/wizard') {
        setCurrentView('wizard');
      } else if (hash.startsWith('#manage/') || hash.startsWith('#/manage/')) {
        const id = hash.replace(/^#\/?manage\//, '');
        const target = restaurants.find(r => r.id === id || r.slug === id);
        if (onNavigateToPortal) {
          onNavigateToPortal(target?.slug || id);
        } else {
          window.location.hash = `#/portal?r=${target?.slug || id}`;
        }
        return;
      } else {
        setCurrentView('dashboard');
      }
    };

    handleRouting();
    window.addEventListener('hashchange', handleRouting);
    return () => window.removeEventListener('hashchange', handleRouting);
  }, [restaurants]);

  // Handle navigation helpers
  const handleOpenWizard = () => {
    setIntroFinished(false);
    window.location.hash = '#/wizard';
    setCurrentView('wizard');
  };

  const handleManage = (restaurant) => {
    if (onNavigateToPortal) {
      onNavigateToPortal(restaurant?.slug);
    } else {
      window.location.hash = `#/portal?r=${restaurant?.slug || ''}`;
    }
  };

  const handleBackToDashboard = () => {
    setIntroFinished(false);
    const detected = detectTenantSlug();
    if (detected) {
      window.location.hash = '#/';
      setCurrentView('standalone_tenant');
      return;
    }
    window.location.hash = '#/';
    setCurrentView('dashboard');
    loadData();
  };

  return (
    <div className="relative min-h-screen bg-black text-zinc-100 flex flex-col">
      {/* Cinematic Intro: Giant TecnOdiel with kinetic animation */}
      <AnimatePresence mode="wait">
        {!introFinished && (
          <CinematicIntro
            key={`cinematic-intro-${currentView}-${publicSlug || ''}`}
            subtitle={
              currentView === 'wizard' ? "Configurador de Restaurantes" :
              currentView === 'public_restaurant' ? "Carta Digital & Pedidos" :
              "Multiwebs • Red de Restaurantes"
            }
            onComplete={() => setIntroFinished(true)}
          />
        )}
      </AnimatePresence>

      {/* If in Standalone Tenant View (Distinct Vercel Subdomain / Custom Domain) */}
      {currentView === 'standalone_tenant' && activeRestaurant && (
        <div className="relative min-h-screen bg-black text-white">
          <TemplateRenderer restaurant={activeRestaurant} isPreview={false} />
        </div>
      )}

      {/* If in public restaurant view (via Master Platform #/r/slug) */}
      {currentView === 'public_restaurant' && publicSlug && (
        (() => {
          const target = restaurants.find(r => r.slug === publicSlug || r.subdomain === publicSlug);
          if (!target) {
            return (
              <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-2xl font-bold mb-2">Restaurante no encontrado</h2>
                <p className="text-zinc-400 text-sm mb-4">No pudimos encontrar el subdominio /{publicSlug}.</p>
                <button
                  onClick={handleBackToDashboard}
                  className="px-4 py-2 rounded-xl bg-emerald-400 text-black font-bold text-xs"
                >
                  Volver al Catálogo
                </button>
              </div>
            );
          }

          return (
            <div className="relative min-h-screen bg-black text-white">
              {/* Discreet Back to Catalog button */}
              <div className="fixed bottom-4 left-4 z-50">
                <button
                  onClick={handleBackToDashboard}
                  className="px-4 py-2 rounded-full bg-zinc-950/90 border border-white/15 text-zinc-300 hover:text-white text-xs font-semibold shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-md hover:bg-zinc-900 transition flex items-center gap-2 emil-pressable"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Volver a Multiwebs</span>
                </button>
              </div>

              <TemplateRenderer restaurant={target} isPreview={false} />
            </div>
          );
        })()
      )}

      {/* If in Wizard View */}
      {currentView === 'wizard' && (
        <RestaurantWizard
          onCreated={(newRest) => {
            loadData();
            setActiveRestaurant(newRest);
            if (onNavigateToPortal) {
              onNavigateToPortal(newRest?.slug);
            } else {
              window.location.hash = `#/portal?r=${newRest?.slug || ''}`;
            }
          }}
          onCancel={handleBackToDashboard}
        />
      )}

      {/* Default: Dashboard Overview */}
      {currentView === 'dashboard' && (
        <div className="min-h-screen bg-black text-zinc-100 flex flex-col">
          <Navbar
            onOpenWizard={handleOpenWizard}
            onViewHome={handleBackToDashboard}
            currentView={currentView}
            onNavigateToPortal={onNavigateToPortal}
            onNavigateToLanding={onNavigateToLanding}
          />

          <DashboardOverview
            restaurants={restaurants}
            onOpenWizard={handleOpenWizard}
            onManageRestaurant={handleManage}
          />
        </div>
      )}
    </div>
  );
}
