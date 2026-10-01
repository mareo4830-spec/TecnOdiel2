import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardOverview from './components/Dashboard/DashboardOverview';
import RestaurantWizard from './components/Wizard/RestaurantWizard';
import RestaurantManager from './components/Dashboard/RestaurantManager';
import TemplateRenderer from './components/Templates/TemplateRenderer';
import { fetchRestaurants } from './lib/supabase';
import { ArrowLeft, ExternalLink } from 'lucide-react';

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
            setCurrentView('manager');
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
          const target = restaurants.find(r => r.id === slug || r.slug === slug || r.subdomain === slug);
          if (target) {
            setActiveRestaurant(target);
            setCurrentView('manager');
            return;
          }
        }
        setPublicSlug(path);
        setCurrentView('public_restaurant');
      } else if (hash === '#wizard' || hash === '#/wizard') {
        setCurrentView('wizard');
      } else if (hash.startsWith('#manage/') || hash.startsWith('#/manage/')) {
        const id = hash.replace(/^#\/?manage\//, '');
        const target = restaurants.find(r => r.id === id || r.slug === id);
        if (target) {
          setActiveRestaurant(target);
          setCurrentView('manager');
        }
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
    window.location.hash = '#/wizard';
    setCurrentView('wizard');
  };

  const handleManage = (restaurant) => {
    setActiveRestaurant(restaurant);
    window.location.hash = `#/manage/${restaurant.id}`;
    setCurrentView('manager');
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

  // If in Standalone Tenant View (Distinct Vercel Subdomain / Custom Domain)
  if (currentView === 'standalone_tenant' && activeRestaurant) {
    return (
      <div className="relative min-h-screen bg-black text-white">
        {/* Discreet floating admin button for restaurant owner */}
        <div className="fixed bottom-4 right-4 z-50">
          <a
            href="#/admin"
            className="px-3.5 py-2 rounded-full bg-zinc-950/90 hover:bg-zinc-900 border border-white/15 hover:border-emerald-500/50 text-zinc-300 hover:text-emerald-300 text-xs font-semibold shadow-2xl backdrop-blur-xl transition-all flex items-center gap-2 emil-pressable"
            title="Acceso al Panel de Administración del Restaurante"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Panel de Admin ({activeRestaurant.name})</span>
          </a>
        </div>

        <TemplateRenderer restaurant={activeRestaurant} isPreview={false} />
      </div>
    );
  }

  // If in public restaurant view (via Master Platform #/r/slug)
  if (currentView === 'public_restaurant' && publicSlug) {
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
            Volver al Panel Principal
          </button>
        </div>
      );
    }

    return (
      <div className="relative">
        {/* Floating Owner Access & Management Bar */}
        <div className="fixed bottom-4 inset-x-4 z-50 flex items-center justify-between pointer-events-none">
          <a
            href={`#/r/${target.slug}/admin`}
            className="pointer-events-auto px-4 py-2.5 rounded-full bg-zinc-950/95 border border-emerald-500/50 text-emerald-300 text-xs font-bold shadow-[0_0_25px_rgba(0,0,0,0.9)] backdrop-blur-xl hover:bg-zinc-900 transition flex items-center gap-2 emil-pressable"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Panel de Admin (Añadir Platos)</span>
          </a>

          <button
            onClick={handleBackToDashboard}
            className="pointer-events-auto px-4 py-2.5 rounded-full bg-zinc-950/90 border border-white/15 text-zinc-300 hover:text-white text-xs font-semibold shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-md hover:bg-zinc-900 transition flex items-center gap-2 emil-pressable"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Panel TecnOdiel</span>
          </button>
        </div>

        <TemplateRenderer restaurant={target} isPreview={false} />
      </div>
    );
  }

  // If in Wizard View
  if (currentView === 'wizard') {
    return (
      <RestaurantWizard
        onCreated={(newRest) => {
          loadData();
          setActiveRestaurant(newRest);
          // Navigate directly to the client portal after giving visto bueno
          if (onNavigateToPortal) {
            onNavigateToPortal(newRest?.slug);
          } else {
            window.location.hash = `#/portal?r=${newRest?.slug || ''}`;
          }
        }}
        onCancel={handleBackToDashboard}
      />
    );
  }

  // If in Management View
  if (currentView === 'manager' && activeRestaurant) {
    return (
      <RestaurantManager
        restaurant={activeRestaurant}
        onBack={handleBackToDashboard}
        onRestaurantUpdated={(updated) => {
          setActiveRestaurant(updated);
          loadData();
        }}
      />
    );
  }

  // Default: Dashboard Overview
  return (
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
  );
}
