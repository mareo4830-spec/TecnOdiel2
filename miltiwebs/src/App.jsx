import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import DashboardOverview from './components/Dashboard/DashboardOverview';
import FormularioPage from '../../landing/src/pages/FormularioPage';
import TemplateRenderer from './components/Templates/TemplateRenderer';
import ErrorBoundary from './components/ErrorBoundary';
import { fetchRestaurants, fetchRestaurantBySlug } from './lib/supabase';
import { ArrowLeft } from 'lucide-react';
import StandaloneCartaView from './components/Carta/StandaloneCartaView';

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

export default function App({ onNavigateToPortal, onNavigateToLanding, onNavigateToCyS, initialIntroFinished = true, onIntroComplete }) {
  const [restaurants, setRestaurants] = useState([]);
  const [currentView, setCurrentView] = useState('wizard'); // 'wizard' directo sin pasar por dashboard antiguo
  const [activeRestaurant, setActiveRestaurant] = useState(null);
  const [publicSlug, setPublicSlug] = useState(null);
  const [singleRestaurant, setSingleRestaurant] = useState(null);
  const [isLoadingPublic, setIsLoadingPublic] = useState(false);
  const [tenantSlug, setTenantSlug] = useState(() => detectTenantSlug());
  const [introFinished, setIntroFinished] = useState(true);
  const lastPathRef = useRef(typeof window !== 'undefined' ? (window.location.hash || window.location.pathname) : '');

  const handleIntroComplete = () => {
    setIntroFinished(true);
    if (onIntroComplete) onIntroComplete();
  };

  // Load restaurants on mount
  const loadData = async () => {
    const list = await fetchRestaurants();
    setRestaurants(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  // When publicSlug is active, fetch from Supabase if not in local cache
  useEffect(() => {
    if (publicSlug) {
      const match = restaurants.find(r => r.slug === publicSlug || r.subdomain === publicSlug || r.id === publicSlug);
      if (match) {
        setSingleRestaurant(match);
      } else {
        setIsLoadingPublic(true);
        fetchRestaurantBySlug(publicSlug)
          .then(found => {
            if (found) setSingleRestaurant(found);
          })
          .catch(err => {
            console.warn('Error fetching single restaurant from Supabase:', err);
          })
          .finally(() => {
            setIsLoadingPublic(false);
          });
      }
    }
  }, [publicSlug, restaurants]);

  // Handle URL hash & host-based tenant routing
  useEffect(() => {
    const handleRouting = () => {
      const detected = detectTenantSlug();
      const hash = window.location.hash;
      const pathname = window.location.pathname;

      // Ignore in-page section jumps (#degustacion, #menu, etc.) so they never re-trigger intro or reset view
      if (/^#(degustacion|menu|reservas|contacto|info|horarios)$/i.test(hash)) {
        return;
      }

      const currentRoute = hash || pathname;
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
        const rawPath = hash.replace(/^#\/?r\//, '');
        const cleanPath = rawPath.split('?')[0].replace(/\/$/, '');
        if (cleanPath.includes('/admin')) {
          const slug = cleanPath.replace(/\/admin.*$/, '');
          if (onNavigateToPortal) {
            onNavigateToPortal(slug);
          } else {
            window.location.hash = `#/portal?r=${slug}`;
          }
          return;
        }
        setPublicSlug(cleanPath);
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
      } else if (hash.startsWith('#carta/') || hash.startsWith('#/carta/')) {
        const raw = hash.replace(/^#\/?carta\//, '');
        const slug = raw.split('?')[0];
        setPublicSlug(slug);
        setCurrentView('standalone_carta');
      } else if (hash === '#dashboard' || hash === '#/dashboard') {
        setCurrentView('dashboard');
      } else {
        setCurrentView('wizard');
      }
    };

    handleRouting();
    window.addEventListener('hashchange', handleRouting);
    return () => window.removeEventListener('hashchange', handleRouting);
  }, [restaurants]);


  // Handle navigation helpers
  const handleOpenWizard = () => {
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
      {/* If in Standalone Tenant View (Distinct Vercel Subdomain / Custom Domain) */}
      {currentView === 'standalone_tenant' && activeRestaurant && (
        <div className="relative min-h-screen bg-black text-white">
          <TemplateRenderer restaurant={activeRestaurant} isPreview={false} />
        </div>
      )}

      {/* If in public restaurant view (via Master Platform #/r/slug) */}
      {currentView === 'public_restaurant' && publicSlug && (
        (() => {
          const target = singleRestaurant || restaurants.find(r => r.slug === publicSlug || r.subdomain === publicSlug || r.id === publicSlug);

          if (isLoadingPublic && !target) {
            return (
              <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mb-4" />
                <h2 className="text-xl font-bold mb-1">Cargando restaurante...</h2>
                <p className="text-zinc-400 text-xs font-mono">Conectando con la base de datos Supabase</p>
              </div>
            );
          }

          if (!target) {
            return (
              <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-2xl font-bold mb-2">Restaurante no encontrado</h2>
                <p className="text-zinc-400 text-sm mb-4">No pudimos encontrar el restaurante /{publicSlug} en la base de datos.</p>
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
        <ErrorBoundary>
          <FormularioPage onBack={onNavigateToLanding || (() => { window.location.hash = '#/'; })} />
        </ErrorBoundary>
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
            onNavigateToCyS={onNavigateToCyS}
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
