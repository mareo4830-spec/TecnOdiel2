import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import CinematicIntro from './components/CinematicIntro';
import Navbar from './components/Navbar';
import DashboardOverview from './components/Dashboard/DashboardOverview';
import ClinicWizard from './components/Wizard/ClinicWizard';
import TemplateRenderer from './components/Templates/TemplateRenderer';
import ErrorBoundary from './components/ErrorBoundary';
import { fetchClinics, fetchClinicBySlug } from './lib/supabase';
import { ArrowLeft } from 'lucide-react';

function detectTenantSlug() {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.search);
  const qSlug = params.get('c') || params.get('slug') || params.get('clinic');
  if (qSlug) return qSlug.toLowerCase().trim();

  const host = window.location.hostname;
  if (!host || host === '127.0.0.1') return null;

  const parts = host.split('.');
  if (parts.length === 2 && parts[1] === 'localhost') {
    return parts[0].toLowerCase().trim();
  }
  if (parts.length >= 3) {
    const sub = parts[0].toLowerCase().trim();
    if (!['www', 'app', 'api', 'admin', 'tecnodiel', 'multiwebs', 'cys'].includes(sub)) {
      return sub;
    }
  }

  return null;
}

export default function App() {
  const [clinics, setClinics] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'wizard', 'public_clinic', 'standalone_tenant'
  const [activeClinic, setActiveClinic] = useState(null);
  const [publicSlug, setPublicSlug] = useState(null);
  const [singleClinic, setSingleClinic] = useState(null);
  const [isLoadingPublic, setIsLoadingPublic] = useState(false);
  const [tenantSlug, setTenantSlug] = useState(() => detectTenantSlug());
  const [introFinished, setIntroFinished] = useState(false);

  const loadData = async () => {
    const list = await fetchClinics();
    setClinics(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (publicSlug) {
      const match = clinics.find(c => c.slug === publicSlug || c.subdomain === publicSlug || c.id === publicSlug);
      if (match) {
        setSingleClinic(match);
      } else {
        setIsLoadingPublic(true);
        fetchClinicBySlug(publicSlug)
          .then(found => {
            if (found) setSingleClinic(found);
          })
          .catch(err => {
            console.warn('Error fetching single clinic from Supabase:', err);
          })
          .finally(() => {
            setIsLoadingPublic(false);
          });
      }
    }
  }, [publicSlug, clinics]);

  // Routing
  useEffect(() => {
    const handleRouting = () => {
      const detected = detectTenantSlug();
      const hash = window.location.hash;

      if (detected) {
        setTenantSlug(detected);
        const target = clinics.find(c => c.slug === detected || c.subdomain === detected);
        if (target) {
          setActiveClinic(target);
          setCurrentView('standalone_tenant');
          return;
        }
      }

      if (hash.startsWith('#c/') || hash.startsWith('#/c/') || hash.startsWith('#clinic/') || hash.startsWith('#/clinic/') || hash.startsWith('#r/') || hash.startsWith('#/r/')) {
        const rawPath = hash.replace(/^#\/?(c|clinic|r)\//, '');
        const cleanPath = rawPath.split('?')[0].replace(/\/$/, '');
        setPublicSlug(cleanPath);
        setCurrentView('public_clinic');
      } else if (hash === '#wizard' || hash === '#/wizard') {
        setCurrentView('wizard');
      } else {
        setCurrentView('dashboard');
      }
    };

    handleRouting();
    window.addEventListener('hashchange', handleRouting);
    return () => window.removeEventListener('hashchange', handleRouting);
  }, [clinics]);

  const handleOpenWizard = () => {
    window.location.hash = '#/wizard';
    setCurrentView('wizard');
  };

  const handleBackToDashboard = () => {
    window.location.hash = '#/';
    setCurrentView('dashboard');
    loadData();
  };

  return (
    <div className="relative min-h-screen bg-black text-zinc-100 flex flex-col">
      {/* Intro Animation */}
      <AnimatePresence mode="wait">
        {!introFinished && (
          <CinematicIntro
            key="cinematic-intro"
            subtitle={
              currentView === 'wizard' ? "Crea Tu Web Clínica en 2 Minutos • Sin Líos" :
              currentView === 'public_clinic' ? "Cita Previa Online • Cuadro Médico" :
              "Webs para Clínicas y Salud • 0€ Comisiones"
            }
            onComplete={() => setIntroFinished(true)}
          />
        )}
      </AnimatePresence>

      {/* Standalone Subdomain View */}
      {currentView === 'standalone_tenant' && activeClinic && (
        <div className="relative min-h-screen bg-black text-white">
          <TemplateRenderer clinic={activeClinic} isPreview={false} />
        </div>
      )}

      {/* Public Clinic View (#/c/:slug) */}
      {currentView === 'public_clinic' && publicSlug && (
        (() => {
          const target = singleClinic || clinics.find(c => c.slug === publicSlug || c.subdomain === publicSlug || c.id === publicSlug);

          if (isLoadingPublic && !target) {
            return (
              <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
                <h2 className="text-xl font-bold mb-1">Cargando clínica médica...</h2>
                <p className="text-zinc-400 text-xs font-mono">Conectando con la base de datos Supabase</p>
              </div>
            );
          }

          if (!target) {
            return (
              <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-2xl font-bold mb-2">Clínica no encontrada</h2>
                <p className="text-zinc-400 text-sm mb-4">No pudimos encontrar la clínica /{publicSlug} en la base de datos.</p>
                <button
                  onClick={handleBackToDashboard}
                  className="px-4 py-2 rounded-xl bg-cyan-400 text-black font-bold text-xs"
                >
                  Volver al Catálogo de Clínicas
                </button>
              </div>
            );
          }

          return (
            <div className="relative min-h-screen bg-black text-white">
              <div className="fixed bottom-4 left-4 z-50">
                <button
                  onClick={handleBackToDashboard}
                  className="px-4 py-2 rounded-full bg-zinc-950/90 border border-white/15 text-zinc-300 hover:text-white text-xs font-semibold shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-md hover:bg-zinc-900 transition flex items-center gap-2 emil-pressable cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Volver a TecnOdiel CyS</span>
                </button>
              </div>

              <TemplateRenderer clinic={target} isPreview={false} />
            </div>
          );
        })()
      )}

      {/* Wizard View */}
      {currentView === 'wizard' && (
        <ErrorBoundary>
          <ClinicWizard
            onCreated={(newClinic) => {
              loadData();
              window.location.hash = `#/c/${newClinic.slug}`;
            }}
            onCancel={handleBackToDashboard}
          />
        </ErrorBoundary>
      )}

      {/* Dashboard Overview */}
      {currentView === 'dashboard' && (
        <div className="min-h-screen bg-black text-zinc-100 flex flex-col">
          <Navbar
            onOpenWizard={handleOpenWizard}
            onViewHome={handleBackToDashboard}
            currentView={currentView}
          />

          <DashboardOverview
            clinics={clinics}
            onOpenWizard={handleOpenWizard}
          />
        </div>
      )}
    </div>
  );
}
