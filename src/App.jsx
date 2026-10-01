import React, { useState, useEffect } from 'react';
import LandingApp from '../landing/src/App.jsx';
import MultiwebsApp from '../miltiwebs/src/App.jsx';
import PortalApp from '../PortalDeClientes/src/App.jsx';
import { Home, UtensilsCrossed, LayoutDashboard } from 'lucide-react';

export default function App() {
  const [view, setView] = useState(() => {
    if (typeof window === 'undefined') return 'landing';

    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const params = new URLSearchParams(window.location.search);

    if (params.get('view') === 'multiwebs' || params.get('view') === 'restaurantes') return 'multiwebs';
    if (params.get('view') === 'portal') return 'portal';

    if (path.includes('/restaurantes') || path.includes('/multiwebs') || hash.includes('#/multiwebs') || hash.includes('#/wizard') || hash.includes('#/manage') || hash.includes('#/r/')) {
      return 'multiwebs';
    }
    if (path.includes('/portal') || hash.includes('#/portal') || hash.includes('#portal')) {
      return 'portal';
    }
    return 'landing';
  });

  const [activeSlug, setActiveSlug] = useState(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    return params.get('r') || params.get('slug') || params.get('restaurant') || localStorage.getItem('tecnodiel_client_slug') || null;
  });

  // Listen to hash / popstate changes
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);

      const qSlug = params.get('r') || params.get('slug') || params.get('restaurant');
      if (qSlug) setActiveSlug(qSlug);

      if (path.includes('/restaurantes') || path.includes('/multiwebs') || hash.includes('#/multiwebs') || hash.includes('#/wizard') || hash.includes('#/manage') || hash.includes('#/r/')) {
        setView('multiwebs');
      } else if (path.includes('/portal') || hash.includes('#/portal') || hash.includes('#portal')) {
        setView('portal');
      } else if (hash === '#/' || hash === '' || path === '/') {
        setView('landing');
      }
    };

    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  const navigateTo = (newView, slug = null) => {
    setView(newView);
    if (slug) {
      setActiveSlug(slug);
    }

    if (newView === 'landing') {
      window.history.pushState(null, '', '/');
      window.location.hash = '';
    } else if (newView === 'multiwebs') {
      window.history.pushState(null, '', '/restaurantes');
      window.location.hash = '#/multiwebs';
    } else if (newView === 'portal') {
      const q = slug ? `?r=${encodeURIComponent(slug)}` : '';
      window.history.pushState(null, '', `/portal${q}`);
      window.location.hash = `#/portal${q}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-black text-zinc-100 selection:bg-white selection:text-black">
      {/* Active Sub-App Rendering */}
      {view === 'landing' && (
        <LandingApp 
          onNavigateToMultiwebs={() => navigateTo('multiwebs')} 
        />
      )}

      {view === 'multiwebs' && (
        <MultiwebsApp 
          onNavigateToPortal={(slug) => navigateTo('portal', slug)}
          onNavigateToLanding={() => navigateTo('landing')}
        />
      )}

      {view === 'portal' && (
        <PortalApp 
          initialSlug={activeSlug}
          onNavigateToMultiwebs={() => navigateTo('multiwebs')}
          onNavigateToLanding={() => navigateTo('landing')}
        />
      )}

      {/* Floating Global Ecosystem Dock */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-full bg-zinc-950/90 border border-white/15 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.85)]">
          <button
            type="button"
            onClick={() => navigateTo('landing')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
              view === 'landing' 
                ? 'bg-white text-black shadow-md' 
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
            title="Portada TecnOdiel"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Inicio</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('multiwebs')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
              view === 'multiwebs' 
                ? 'bg-emerald-400 text-black font-bold shadow-md shadow-emerald-500/20' 
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
            title="Creador de Webs con 30 Plantillas"
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Multiwebs (30)</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('portal', activeSlug)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
              view === 'portal' 
                ? 'bg-emerald-400 text-black font-bold shadow-md shadow-emerald-500/20' 
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
            title="Portal de Gestión para Clientes"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Portal Clientes</span>
            <span className="sm:hidden">Portal</span>
          </button>
        </div>
      </div>
    </div>
  );
}
