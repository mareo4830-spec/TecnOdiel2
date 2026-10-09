import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Loader2, Sparkles, X } from 'lucide-react';
import { client, useAccount } from '../../lib/adminAuth';
import { computeOurPrice, computeReferencePrice } from './pricing';
import { FEATURES } from './formConfig';

/** Cuenta atrás animada de un número a otro (el precio bajando). */
function CountTo({ from, to, duration = 1.6, onDone }) {
  const [value, setValue] = useState(from);
  useEffect(() => {
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (to - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
      else onDone?.();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to]);
  return <>{value.toLocaleString('es-ES')}</>;
}

export default function PriceRevealModal({ form, onClose, onSubmitted, onNavigateToPortal }) {
  const account = useAccount();
  const [phase, setPhase] = useState('counting'); // counting -> revealed -> sending -> done | error
  const [errorMsg, setErrorMsg] = useState('');

  const ourPrice = computeOurPrice(form.features);
  const referencePrice = computeReferencePrice(ourPrice, form.features);
  const savings = referencePrice - ourPrice;
  const featureLabels = form.features.map((id) => FEATURES.find((f) => f.id === id)?.label).filter(Boolean);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const signedIn = Boolean(account.profile && (account.role === 'client' || account.role === 'admin' || account.role === 'user'));

  const confirm = async () => {
    if (!signedIn) {
      try {
        sessionStorage.setItem('tecnodiel_pending_portal_redirect', 'true');
        sessionStorage.setItem('tecnodiel_pending_form', JSON.stringify(form));
        localStorage.setItem('tecnodiel_pending_portal_redirect', 'true');
        localStorage.setItem('tecnodiel_pending_form', JSON.stringify(form));
        sessionStorage.setItem('tecnodiel_formulario_draft', JSON.stringify(form));
      } catch (_) {}
      account.signIn();
      return;
    }
    setPhase('sending');
    setErrorMsg('');
    const userEmail = (form.email || account.profile?.email || '').trim().toLowerCase();
    const projectRecord = {
      business_name: form.businessName,
      name: form.businessName,
      business_type: form.sector,
      sector: form.sector,
      contact_name: form.contactName,
      phone: form.phone,
      email: userEmail,
      city: 'Huelva',
      source: 'formulario_web',
      stage: 'contactado',
      estimated_value: ourPrice,
      budget: ourPrice,
      owner: 'javier',
      intake: {
        ambiente: form.ambiente,
        features: form.features,
        layoutFamily: form.layoutFamily,
        layoutVariant: form.layoutVariant,
        accentOverride: form.accentOverride || null,
        ourPrice,
        referencePrice,
      },
    };

    try {
      const { error } = await client.from('leads').insert(projectRecord);
      if (error) {
        console.warn('Error insertando lead en Supabase:', error);
      }
    } catch (e) {
      console.warn('Excepción al registrar lead en Supabase:', e);
    }

    // Persistir siempre para el portal de clientes vinculado a esta cuenta
    try {
      if (userEmail) {
        localStorage.setItem(`tecnodiel_client_project_${userEmail}`, JSON.stringify(projectRecord));
      }
      localStorage.setItem('tecnodiel_active_project', JSON.stringify(projectRecord));
    } catch (_) {}

    setPhase('done');
    onSubmitted?.();

    // Redirigir al portal de clientes automáticamente
    setTimeout(() => {
      if (onNavigateToPortal) {
        onClose?.();
        onNavigateToPortal();
      } else if (typeof window !== 'undefined') {
        window.location.hash = '#/portal';
      }
    }, 1200);
  };

  const handleGoToPortal = () => {
    onClose?.();
    if (onNavigateToPortal) {
      onNavigateToPortal();
    } else if (typeof window !== 'undefined') {
      window.location.hash = '#/portal';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0d0d0d] p-7 text-center shadow-2xl"
        >
          {phase !== 'sending' && phase !== 'done' && (
            <button onClick={onClose} aria-label="Cerrar" className="absolute right-4 top-4 rounded-full p-1.5 text-zinc-500 hover:bg-white/10 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          )}

          {phase === 'done' ? (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="py-6">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#6DD94B]/15 text-[#6DD94B]">
                <Check className="h-7 w-7" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-white">¡Propuesta confirmada!</h2>
              <p className="mt-2 text-sm text-zinc-400">
                Todo listo para <span className="text-white font-semibold">{form.businessName}</span>. Abriendo tu Portal de Clientes...
              </p>
              <button 
                onClick={handleGoToPortal} 
                className="mt-6 w-full rounded-xl bg-[#6DD94B] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#7fe55f]"
              >
                Acceder al Portal de Clientes
              </button>
            </motion.div>
          ) : (
            <>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6DD94B]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#6DD94B]">
                <Sparkles className="h-3 w-3" />
                Tu propuesta
              </span>
              <h2 className="mt-3 text-xl font-black tracking-tight text-white">Esto te costaría en otra plataforma</h2>

              <div className="mt-6">
                <p className="text-sm text-zinc-500 line-through decoration-rose-500/70">
                  {phase === 'counting' ? referencePrice.toLocaleString('es-ES') : referencePrice.toLocaleString('es-ES')} €
                </p>
                <p className="text-6xl font-black tracking-tighter text-[#6DD94B]">
                  {phase === 'counting' ? (
                    <CountTo from={referencePrice} to={ourPrice} onDone={() => setPhase('revealed')} />
                  ) : (
                    ourPrice.toLocaleString('es-ES')
                  )}
                  <span className="text-3xl"> €</span>
                </p>
                <AnimatePresence>
                  {phase !== 'counting' && (
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm font-semibold text-white"
                    >
                      Te ahorras {savings.toLocaleString('es-ES')} € eligiéndonos a nosotros
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {phase !== 'counting' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                  <ul className="mt-5 space-y-1 text-left text-xs text-zinc-400">
                    {featureLabels.map((label) => (
                      <li key={label} className="flex items-center gap-1.5">
                        <Check className="h-3 w-3 shrink-0 text-[#6DD94B]" />
                        {label}
                      </li>
                    ))}
                  </ul>

                  {errorMsg && <p className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">{errorMsg}</p>}

                  <button
                    onClick={confirm}
                    disabled={phase === 'sending'}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6DD94B] py-3.5 text-sm font-bold text-black transition hover:bg-[#7fe55f] disabled:opacity-60"
                  >
                    {phase === 'sending' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Enviando…
                      </>
                    ) : signedIn ? (
                      'Confirmar que me interesa'
                    ) : (
                      'Continuar con Google para confirmar'
                    )}
                  </button>
                  <p className="mt-3 text-[11px] text-zinc-600">Sin compromiso: solo nos ponemos en contacto contigo.</p>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
