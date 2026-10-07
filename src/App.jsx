import React, { useState, useEffect } from 'react';
import LandingApp from '../landing/src/App.jsx';
import MultiwebsApp from '../miltiwebs/src/App.jsx';
import PortalApp from '../PortalDeClientes/src/App.jsx';
import MultiwebsCySApp from '../MultiwebsCyS/src/App.jsx';
import TenantProvider from './multi-tenant/TenantProvider.jsx';
import TenantRouter from './multi-tenant/TenantRouter.jsx';

export default function App() {
  const [view, setView] = useState(() => {
    if (typeof window === 'undefined') return 'landing';

    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const params = new URLSearchParams(window.location.search);

    if (params.get('view') === 'cinematic' || params.get('view') === 'awwwards' || params.get('tenant')) return 'cinematic';
    if (hash.includes('#/cinematic') || hash.includes('#cinematic') || hash.includes('#/awwwards') || hash.includes('#awwwards')) return 'cinematic';
    if (params.get('view') === 'multiwebs' || params.get('view') === 'restaurantes') return 'multiwebs';
    if (params.get('view') === 'portal') return 'portal';
    if (params.get('view') === 'cys' || params.get('view') === 'clinicas' || params.get('view') === 'salud') return 'cys';

    if (
      path.includes('/clinicas') ||
      path.includes('/cys') ||
      path.includes('/salud') ||
      path.includes('/c/') ||
      hash.includes('#/clinicas') ||
      hash.includes('#/cys') ||
      hash.includes('#/c/') ||
      hash.includes('#c/') ||
      hash.startsWith('#/c/') ||
      hash.startsWith('#c/') ||
      hash.includes('#/clinic/') ||
      hash.includes('#clinic/')
    ) {
      return 'cys';
    }

    if (
      path.includes('/restaurantes') || 
      path.includes('/multiwebs') || 
      path.includes('/r/') ||
      hash.includes('#/multiwebs') || 
      hash.includes('#/wizard') || 
      hash.includes('#/manage') || 
      hash.includes('#/r/') ||
      hash.includes('#r/') ||
      hash.startsWith('#/r/') ||
      hash.startsWith('#r/')
    ) {
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

  const [hasIntroCompleted, setHasIntroCompleted] = useState(false);

  // Limpiar cualquier flag persistido en sessionStorage para que la animación siempre se ejecute al recargar la web
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('tecnodiel_intro_seen');
      } catch (_) {}
    }
  }, []);

  const markIntroComplete = () => {
    setHasIntroCompleted(true);
  };

  // Listen to hash / popstate changes
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);

      const qSlug = params.get('r') || params.get('slug') || params.get('restaurant');
      if (qSlug) setActiveSlug(qSlug);

      // Ignore intra-page anchor jumps (#carta, #degustacion, etc.) so they never reset the active view
      if (/^#(carta|degustacion|menu|reservas|contacto|info|horarios)/i.test(hash)) {
        return;
      }

      if (
        params.get('view') === 'cinematic' ||
        params.get('view') === 'awwwards' ||
        path.includes('/cinematic') ||
        path.includes('/awwwards') ||
        hash.includes('#/cinematic') ||
        hash.includes('#cinematic') ||
        hash.includes('#/awwwards') ||
        hash.includes('#awwwards')
      ) {
        setView('cinematic');
      } else if (
        path.includes('/clinicas') ||
        path.includes('/cys') ||
        path.includes('/salud') ||
        path.includes('/c/') ||
        hash.includes('#/clinicas') ||
        hash.includes('#/cys') ||
        hash.includes('#/c/') ||
        hash.includes('#c/') ||
        hash.startsWith('#/c/') ||
        hash.startsWith('#c/') ||
        hash.includes('#/clinic/') ||
        hash.includes('#clinic/')
      ) {
        setView('cys');
      } else if (
        path.includes('/restaurantes') || 
        path.includes('/multiwebs') || 
        path.includes('/r/') ||
        hash.includes('#/multiwebs') || 
        hash.includes('#/wizard') || 
        hash.includes('#/manage') || 
        hash.includes('#/r/') ||
        hash.includes('#r/') ||
        hash.startsWith('#/r/') ||
        hash.startsWith('#r/')
      ) {
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
    } else if (newView === 'cys') {
      window.history.pushState(null, '', '/clinicas');
      window.location.hash = '#/cys';
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
          initialIntroFinished={hasIntroCompleted}
          onIntroComplete={markIntroComplete}
          onNavigateToMultiwebs={() => navigateTo('multiwebs')} 
          onNavigateToCyS={() => navigateTo('cys')}
        />
      )}

      {view === 'multiwebs' && (
        <MultiwebsApp 
          key="multiwebs-page"
          initialIntroFinished={hasIntroCompleted}
          onIntroComplete={markIntroComplete}
          onNavigateToPortal={(slug) => navigateTo('portal', slug)}
          onNavigateToLanding={() => navigateTo('landing')}
          onNavigateToCyS={() => navigateTo('cys')}
        />
      )}

      {view === 'cys' && (
        <MultiwebsCySApp 
          key="cys-page"
          onNavigateToLanding={() => navigateTo('landing')}
          onNavigateToMultiwebs={() => navigateTo('multiwebs')}
          onNavigateToPortal={(slug) => navigateTo('portal', slug)}
        />
      )}

      {view === 'cinematic' && (
        <TenantProvider>
          <TenantRouter />
        </TenantProvider>
      )}

      {view === 'portal' && (
        <PortalApp 
          key={`portal-page-${activeSlug || 'root'}`}
          initialSlug={activeSlug}
          initialIntroFinished={hasIntroCompleted}
          onIntroComplete={markIntroComplete}
          onNavigateToMultiwebs={() => navigateTo('multiwebs')}
          onNavigateToCyS={() => navigateTo('cys')}
          onNavigateToLanding={() => navigateTo('landing')}
        />
      )}
    </div>
  );
}
