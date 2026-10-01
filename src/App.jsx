import React, { useState, useEffect } from 'react';
import LandingApp from '../landing/src/App.jsx';
import MultiwebsApp from '../miltiwebs/src/App.jsx';
import PortalApp from '../PortalDeClientes/src/App.jsx';

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
          key="landing-page"
          onNavigateToMultiwebs={() => navigateTo('multiwebs')} 
        />
      )}

      {view === 'multiwebs' && (
        <MultiwebsApp 
          key="multiwebs-page"
          onNavigateToPortal={(slug) => navigateTo('portal', slug)}
          onNavigateToLanding={() => navigateTo('landing')}
        />
      )}

      {view === 'portal' && (
        <PortalApp 
          key={`portal-page-${activeSlug || 'root'}`}
          initialSlug={activeSlug}
          onNavigateToMultiwebs={() => navigateTo('multiwebs')}
          onNavigateToLanding={() => navigateTo('landing')}
        />
      )}
    </div>
  );
}
