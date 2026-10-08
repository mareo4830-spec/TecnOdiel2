import React, { useState, useEffect } from 'react';
import LandingApp from '../landing/src/App.jsx';
import MultiwebsApp from '../miltiwebs/src/App.jsx';
import PortalApp from '../PortalDeClientes/src/App.jsx';
import MultiwebsCySApp from '../MultiwebsCyS/src/App.jsx';
import TenantProvider from './multi-tenant/TenantProvider.jsx';
import TenantRouter from './multi-tenant/TenantRouter.jsx';
import VirtualDeskAdminApp from '../PortalDeClientes/src/components/virtualdesk/VirtualDeskAdminApp.jsx';
import AvisoLegal from '../landing/src/components/legal/AvisoLegal.jsx';
import PoliticaPrivacidad from '../landing/src/components/legal/PoliticaPrivacidad.jsx';
import PoliticaCookies from '../landing/src/components/legal/PoliticaCookies.jsx';
import NotFound from '../landing/src/components/NotFound.jsx';

class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Admin portal initialization error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="p-6 max-w-md bg-zinc-900 border border-[#6DD94B]/30 rounded-2xl shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-2">Panel de Administrador</h2>
            <p className="text-xs text-zinc-400 mb-4">Error al inicializar el panel. Pulsa para reintentar.</p>
            <div className="flex items-center justify-center gap-3">
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-[#6DD94B] text-black font-bold text-xs rounded-xl"
              >
                Recargar
              </button>
              {this.props.onNavigateToLanding && (
                <button 
                  onClick={this.props.onNavigateToLanding} 
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl"
                >
                  Volver al Inicio
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function resolveCurrentView() {
  if (typeof window === 'undefined') return 'landing';

  const path = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  const hash = window.location.hash.toLowerCase();
  const params = new URLSearchParams(window.location.search);

  // Vistas especiales
  if (params.get('view') === 'cinematic' || params.get('view') === 'awwwards' || params.get('tenant')) return 'cinematic';
  if (hash.includes('#/cinematic') || hash.includes('#cinematic') || hash.includes('#/awwwards') || hash.includes('#awwwards')) return 'cinematic';

  // Páginas Legales RGPD & LSSI
  if (path === '/aviso-legal' || hash.includes('aviso-legal')) return 'aviso-legal';
  if (path === '/politica-privacidad' || hash.includes('politica-privacidad')) return 'politica-privacidad';
  if (path === '/politica-cookies' || hash.includes('politica-cookies')) return 'politica-cookies';

  // 404 explícito
  if (params.get('view') === '404' || hash.includes('404')) return '404';

  // Panel de administración
  if (params.get('view') === 'admin' || path.startsWith('/admin') || hash.includes('#/admin') || hash.includes('#admin')) return 'admin';

  // Portales verticales
  if (params.get('view') === 'multiwebs' || params.get('view') === 'restaurantes') return 'multiwebs';
  if (params.get('view') === 'portal') return 'portal';
  if (params.get('view') === 'cys' || params.get('view') === 'clinicas' || params.get('view') === 'salud') return 'cys';

  if (
    path.startsWith('/clinicas') ||
    path.startsWith('/cys') ||
    path.startsWith('/salud') ||
    path.startsWith('/c/') ||
    hash.includes('#/clinicas') ||
    hash.includes('#/cys') ||
    hash.includes('#/c/') ||
    hash.includes('#c/') ||
    hash.includes('#/clinic/') ||
    hash.includes('#clinic/')
  ) {
    return 'cys';
  }

  if (
    path.startsWith('/restaurantes') || 
    path.startsWith('/multiwebs') || 
    path.startsWith('/r/') ||
    hash.includes('#/multiwebs') || 
    hash.includes('#/wizard') || 
    hash.includes('#/manage') || 
    hash.includes('#/r/') ||
    hash.includes('#r/')
  ) {
    return 'multiwebs';
  }

  if (path.startsWith('/portal') || hash.includes('#/portal') || hash.includes('#portal')) {
    return 'portal';
  }

  // Raíz / Landing
  if (path === '/' || path === '') {
    return 'landing';
  }

  // Cualquier ruta desconocida no contemplada -> 404
  return '404';
}

export default function App() {
  const [view, setView] = useState(() => resolveCurrentView());

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
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);

      const qSlug = params.get('r') || params.get('slug') || params.get('restaurant');
      if (qSlug) setActiveSlug(qSlug);

      // Ignore intra-page anchor jumps (#carta, #degustacion, #contacto, etc.) so they never reset the active view
      if (/^#(carta|degustacion|menu|reservas|contacto|info|horarios|por-que|proyectos|servicios|faq|inicio)/i.test(hash)) {
        return;
      }

      setView(resolveCurrentView());
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
    } else if (newView === 'admin') {
      window.history.pushState(null, '', '/admin');
      window.location.hash = '#/admin';
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
    } else if (newView === 'aviso-legal') {
      window.history.pushState(null, '', '/aviso-legal');
      window.location.hash = '#/aviso-legal';
    } else if (newView === 'politica-privacidad') {
      window.history.pushState(null, '', '/politica-privacidad');
      window.location.hash = '#/politica-privacidad';
    } else if (newView === 'politica-cookies') {
      window.history.pushState(null, '', '/politica-cookies');
      window.location.hash = '#/politica-cookies';
    } else if (newView === '404') {
      window.history.pushState(null, '', '/404');
      window.location.hash = '#/404';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-black text-zinc-100 selection:bg-white selection:text-black">
      {/* Active Sub-App Rendering */}
      {view === 'landing' && (
        <LandingApp 
          key="landing-page"
          initialIntroFinished={true}
          onIntroComplete={markIntroComplete}
          onNavigateToMultiwebs={() => navigateTo('multiwebs')} 
          onNavigateToCyS={() => navigateTo('cys')}
          onNavigateToPortal={() => navigateTo('portal')}
          onNavigateToAdmin={() => navigateTo('admin')}
        />
      )}

      {view === 'multiwebs' && (
        <MultiwebsApp 
          key="multiwebs-page"
          initialIntroFinished={true}
          onIntroComplete={markIntroComplete}
          onNavigateToPortal={(slug) => navigateTo('portal', slug)}
          onNavigateToLanding={() => navigateTo('landing')}
          onNavigateToCyS={() => navigateTo('cys')}
        />
      )}

      {view === 'cys' && (
        <MultiwebsCySApp 
          key="cys-page"
          initialIntroFinished={true}
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

      {view === 'admin' && (
        <AdminErrorBoundary onNavigateToLanding={() => navigateTo('landing')}>
          <VirtualDeskAdminApp 
            key="admin-page"
            onSwitchToClientView={() => navigateTo('portal')}
            onNavigateToLanding={() => navigateTo('landing')}
          />
        </AdminErrorBoundary>
      )}

      {view === 'portal' && (
        <PortalApp 
          key={`portal-page-${activeSlug || 'root'}`}
          initialSlug={activeSlug}
          initialAdmin={false}
          initialIntroFinished={true}
          onIntroComplete={markIntroComplete}
          onNavigateToMultiwebs={() => navigateTo('multiwebs')}
          onNavigateToCyS={() => navigateTo('cys')}
          onNavigateToLanding={() => navigateTo('landing')}
          onNavigateToAdmin={() => navigateTo('admin')}
        />
      )}

      {view === 'aviso-legal' && (
        <AvisoLegal key="aviso-legal-page" onNavigateHome={() => navigateTo('landing')} />
      )}

      {view === 'politica-privacidad' && (
        <PoliticaPrivacidad key="politica-privacidad-page" onNavigateHome={() => navigateTo('landing')} />
      )}

      {view === 'politica-cookies' && (
        <PoliticaCookies key="politica-cookies-page" onNavigateHome={() => navigateTo('landing')} />
      )}

      {view === '404' && (
        <NotFound 
          key="not-found-page"
          onNavigateHome={() => navigateTo('landing')}
          onNavigateToContact={() => {
            navigateTo('landing');
            setTimeout(() => {
              document.querySelector('#contacto')?.scrollIntoView({ behavior: 'smooth' });
            }, 300);
          }}
        />
      )}
    </div>
  );
}
