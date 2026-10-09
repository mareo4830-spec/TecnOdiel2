import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import LogoMark from '../components/home/LogoMark';
import Stepper, { Step } from '../components/formulario/Stepper';
import StepNegocio from '../components/formulario/StepNegocio';
import StepFunciones from '../components/formulario/StepFunciones';
import StepEstilo from '../components/formulario/StepEstilo';
import StepContacto from '../components/formulario/StepContacto';
import PriceRevealModal from '../components/formulario/PriceRevealModal';
import { AMBIENTE_TO_FAMILY, variantsOf } from '../components/formulario/layoutSwatches';
import { useAccount } from '../lib/adminAuth';

const STORAGE_KEY = 'tecnodiel_formulario_draft';

const EMPTY = {
  businessName: '',
  sector: '',
  ambiente: '',
  features: [],
  layoutFamily: '',
  layoutVariant: '',
  accentOverride: '',
  contactName: '',
  phone: '',
  email: '',
};

function readDraft() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

const STEPS = ['negocio', 'funciones', 'estilo', 'contacto'];

/**
 * Asistente público en /formulario con componente Stepper de React Bits:
 * recoge negocio, funciones deseadas y estilo, calcula un precio en vivo y,
 * al confirmar (con Google OAuth obligatorio), redirige directamente al Portal de Clientes.
 */
export default function FormularioPage({ onBack, onNavigateToPortal }) {
  const account = useAccount();
  const [form, setForm] = useState(readDraft);
  const [currentStep, setCurrentStep] = useState(() => {
    try {
      const s = Number(sessionStorage.getItem('tecnodiel_formulario_step'));
      return s >= 1 && s <= 4 ? s : 1;
    } catch {
      return 1;
    }
  });
  const [showPrice, setShowPrice] = useState(() => {
    try {
      return sessionStorage.getItem('tecnodiel_formulario_show_price') === 'true';
    } catch {
      return false;
    }
  });
  const step = STEPS[currentStep - 1] || 'negocio';

  useEffect(() => {
    try {
      sessionStorage.setItem('tecnodiel_formulario_step', String(currentStep));
    } catch (_) {}
  }, [currentStep]);

  useEffect(() => {
    try {
      if (showPrice) sessionStorage.setItem('tecnodiel_formulario_show_price', 'true');
      else sessionStorage.removeItem('tecnodiel_formulario_show_price');
    } catch (_) {}
  }, [showPrice]);

  // Si el usuario acaba de iniciar sesión con Google para confirmar la propuesta, redirigir al portal
  useEffect(() => {
    try {
      const pendingRedirect = sessionStorage.getItem('tecnodiel_pending_portal_redirect');
      if (pendingRedirect && account.profile) {
        sessionStorage.removeItem('tecnodiel_pending_portal_redirect');
        if (onNavigateToPortal) {
          onNavigateToPortal();
        }
      }
    } catch (_) {}
  }, [account.profile, onNavigateToPortal]);

  // Guarda el progreso: si hay que pasar por Google, el redirect recarga la página entera.
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    } catch {
      /* sin almacenamiento: el progreso no sobrevive a un posible redirect de Google */
    }
  }, [form]);

  // Al elegir "ambiente" en el paso 1, se preselecciona la familia de estilo recomendada.
  useEffect(() => {
    if (form.ambiente && !form.layoutFamily) {
      const family = AMBIENTE_TO_FAMILY[form.ambiente];
      if (family) set('layoutFamily', family);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.ambiente]);

  // Si cambia la familia, la variante elegida deja de ser válida y se resetea a la primera.
  useEffect(() => {
    if (!form.layoutFamily) return;
    const variants = variantsOf(form.layoutFamily);
    if (!variants.some((v) => v.key === form.layoutVariant)) {
      set('layoutVariant', variants[0]?.key ?? '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.layoutFamily]);

  // Con sesión ya iniciada (al volver de Google), rellena el contacto si estaba vacío.
  useEffect(() => {
    if (account.profile && !form.email) {
      set('email', account.profile.email ?? '');
      set('contactName', (f) => f || account.profile.name || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account.profile]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: typeof value === 'function' ? value(f[key]) : value }));

  const canNext = useMemo(() => {
    if (step === 'negocio') return form.businessName.trim().length > 1 && Boolean(form.sector) && Boolean(form.ambiente);
    if (step === 'funciones') return form.features.length > 0;
    if (step === 'estilo') return Boolean(form.layoutVariant);
    if (step === 'contacto') {
      const cleanPhone = form.phone.replace(/\D/g, '');
      return form.contactName.trim().length > 1 && /\S+@\S+\.\S+/.test(form.email) && cleanPhone.length === 9;
    }
    return true;
  }, [step, form]);

  const goHome = (e) => {
    if (onBack) {
      e.preventDefault();
      onBack();
    }
  };

  const onSubmitted = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignorado */
    }
  };

  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden bg-[#0a0a0a] text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid-subtle opacity-20" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-[#6DD94B]/10 blur-[160px]"
      />

      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-10">
        <a href="#/" onClick={goHome} className="flex items-center gap-2.5">
          <LogoMark className="h-9 w-9" />
          <span className="text-sm font-bold tracking-tight">TecnOdiel</span>
        </a>
        <a href="#/" onClick={goHome} className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 transition hover:text-white">
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver a la web
        </a>
      </header>

      <main className="relative z-10 mx-auto flex max-w-3xl flex-col px-4 pb-28 pt-2 sm:px-6">
        <Stepper
          initialStep={1}
          currentStep={currentStep}
          onStepChange={(newStep) => setCurrentStep(newStep)}
          onFinalStepCompleted={() => setShowPrice(true)}
          canNext={canNext}
          backButtonText="Atrás"
          nextButtonText={step === 'contacto' ? 'Ver mi precio' : 'Continuar'}
        >
          <Step>
            <StepNegocio form={form} set={set} />
          </Step>
          <Step>
            <StepFunciones form={form} set={set} />
          </Step>
          <Step>
            <StepEstilo form={form} set={set} />
          </Step>
          <Step>
            <StepContacto form={form} set={set} account={account} />
          </Step>
        </Stepper>
      </main>

      {showPrice && (
        <PriceRevealModal 
          form={form} 
          onClose={() => setShowPrice(false)} 
          onSubmitted={onSubmitted}
          onNavigateToPortal={onNavigateToPortal}
        />
      )}
    </div>
  );
}
