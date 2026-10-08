import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import LogoMark from '../components/home/LogoMark';
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
const STEP_TITLES = {
  negocio: 'Tu negocio',
  funciones: 'Qué necesitas',
  estilo: 'Elige tu estilo',
  contacto: 'Cómo te contactamos',
};

/**
 * Asistente público en /formulario: recoge negocio, funciones deseadas y estilo, calcula un
 * precio en vivo y, al confirmar (con sesión de Google), envía la solicitud a la Oficina Virtual
 * como un lead nuevo para que el equipo la revise y, si procede, cree el tenant real.
 */
export default function FormularioPage() {
  const account = useAccount();
  const [form, setForm] = useState(readDraft);
  const [stepIndex, setStepIndex] = useState(0);
  const [showPrice, setShowPrice] = useState(false);
  const step = STEPS[stepIndex];

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
    if (step === 'negocio') return form.businessName.trim().length > 1 && form.sector && form.ambiente;
    if (step === 'funciones') return form.features.length > 0;
    if (step === 'estilo') return form.layoutFamily && form.layoutVariant;
    if (step === 'contacto') return form.contactName.trim().length > 1 && /\S+@\S+\.\S+/.test(form.email) && form.phone.trim().length >= 9;
    return true;
  }, [step, form]);

  const goNext = () => {
    if (stepIndex < STEPS.length - 1) setStepIndex((i) => i + 1);
    else setShowPrice(true);
  };
  const goBack = () => setStepIndex((i) => Math.max(0, i - 1));

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
        <Link to="/" className="flex items-center gap-2.5">
          <LogoMark className="h-9 w-9" />
          <span className="text-sm font-bold tracking-tight">TecnOdiel</span>
        </Link>
        <Link to="/" className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 transition hover:text-white">
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver a la web
        </Link>
      </header>

      <main className="relative z-10 mx-auto flex max-w-2xl flex-col px-5 pb-28 pt-6 sm:px-6">
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-zinc-500">
            <span>
              Paso {stepIndex + 1} de {STEPS.length}
            </span>
            <span className="text-[#6DD94B]">{STEP_TITLES[step]}</span>
          </div>
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-[#6DD94B]"
              animate={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {step === 'negocio' && <StepNegocio form={form} set={set} />}
            {step === 'funciones' && <StepFunciones form={form} set={set} />}
            {step === 'estilo' && <StepEstilo form={form} set={set} />}
            {step === 'contacto' && <StepContacto form={form} set={set} account={account} />}
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex items-center justify-between gap-3">
          <button
            onClick={goBack}
            disabled={stepIndex === 0}
            className="inline-flex h-12 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-zinc-400 transition hover:text-white disabled:opacity-0"
          >
            <ArrowLeft className="h-4 w-4" />
            Atrás
          </button>
          <button
            onClick={goNext}
            disabled={!canNext}
            className="group inline-flex h-12 items-center gap-2 rounded-xl bg-[#6DD94B] px-6 text-sm font-bold text-black transition hover:bg-[#7fe55f] disabled:cursor-not-allowed disabled:opacity-30"
          >
            {step === 'contacto' ? 'Ver mi precio' : 'Siguiente'}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </main>

      {showPrice && <PriceRevealModal form={form} onClose={() => setShowPrice(false)} onSubmitted={onSubmitted} />}
    </div>
  );
}
