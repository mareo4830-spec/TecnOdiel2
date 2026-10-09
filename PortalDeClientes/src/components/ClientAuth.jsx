import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  AlertCircle,
  CalendarClock,
  MessageSquare,
  Rocket,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import { supabase, portalAuthClient, verifyClientByEmail, getClientRestaurantDetails, FALLBACK_RESTAURANT } from '../lib/supabase';
import LogoMark from './LogoMark';

const PERKS = [
  { icon: Rocket, title: 'El avance de tu web', text: 'En qué fase está y cuándo se publica.' },
  { icon: CalendarClock, title: 'Tus reuniones', text: 'Fecha, hora y lugar de la próxima cita.' },
  { icon: Wallet, title: 'Tus pagos', text: 'Qué has pagado y qué queda pendiente.' },
];

export default function ClientAuth({
  onSelectRestaurant,
  onNavigateToLanding,
  onNavigateToMultiwebs,
  targetSlug = null,
}) {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [targetBusinessName, setTargetBusinessName] = useState('');

  // Cargar nombre del negocio si se ha especificado un slug destino
  useEffect(() => {
    if (!targetSlug) return;
    getClientRestaurantDetails(targetSlug)
      .then((res) => { if (res?.name) setTargetBusinessName(res.name); })
      .catch(() => {});
  }, [targetSlug]);

  // Vuelta de Google: sesión nueva o ya existente (en ambos proyectos Supabase).
  useEffect(() => {
    const handleSessionUser = async (user) => {
      if (!user?.email) return;
      const userEmail = user.email.toLowerCase();
      let match = await verifyClientByEmail(userEmail, targetSlug);
      if (!match) {
        const meta = user.user_metadata || {};
        match = {
          ...FALLBACK_RESTAURANT,
          id: `google-${user.id}`,
          name: meta.full_name || meta.name || userEmail.split('@')[0],
          email: userEmail,
          client_access_key: `TO-GGL-${userEmail.slice(0, 4).toUpperCase()}`,
        };
      }
      onSelectRestaurant(match, match.client_access_key || 'GOOGLE-OAUTH');
    };

    const { data: portalListener } = portalAuthClient.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) await handleSessionUser(session.user);
    });
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) await handleSessionUser(session.user);
    });

    (async () => {
      try {
        const { data: pData } = await portalAuthClient.auth.getSession();
        if (pData?.session?.user) { await handleSessionUser(pData.session.user); return; }
        const { data: sData } = await supabase.auth.getSession();
        if (sData?.session?.user) await handleSessionUser(sData.session.user);
      } catch (e) {
        console.warn('Error comprobando sesión de Google:', e);
      }
    })();

    return () => {
      portalListener?.subscription?.unsubscribe();
      authListener?.subscription?.unsubscribe();
    };
  }, [targetSlug, onSelectRestaurant]);

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setGoogleLoading(true);
    try {
      const redirectTo = window.location.origin + window.location.pathname;
      const { error } = await portalAuthClient.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } });
      if (error) {
        // Fallback al otro proyecto si falla el proveedor
        await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } });
      }
    } catch {
      setErrorMsg('No se pudo iniciar el acceso con Google. Inténtalo de nuevo.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const goHome = () => {
    if (onNavigateToLanding) onNavigateToLanding();
    window.history.pushState(null, '', '/');
    window.location.hash = '';
    window.location.href = '/';
  };

  return (
    <div className="relative z-10 flex min-h-[85vh] w-full items-center justify-center p-3.5 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#181818] text-left shadow-2xl font-['Montserrat',Inter,sans-serif] md:grid-cols-[1.05fr_1fr]"
      >
        {/* Qué vas a encontrar */}
        <aside className="relative hidden flex-col justify-between gap-8 border-r border-white/10 bg-gradient-to-br from-[#6DD94B]/10 via-transparent to-[#0D844A]/10 p-8 md:flex">
          <div className="flex items-center gap-3">
            <LogoMark className="h-9 w-9" />
            <span className="text-lg font-bold text-white">Tecn<span className="text-[#6DD94B]">Odiel</span></span>
          </div>
          <div>
            <h2 className="text-2xl font-bold leading-tight text-white">Tu web, <span className="text-[#6DD94B]">a la vista.</span></h2>
            <ul className="mt-6 space-y-5">
              {PERKS.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#6DD94B]/15 text-[#6DD94B]"><Icon className="h-4 w-4" /></span>
                  <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="text-xs leading-snug text-zinc-400">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <p className="flex items-center gap-2 text-xs text-zinc-500"><ShieldCheck className="h-3.5 w-3.5 text-[#6DD94B]" />Solo tú ves lo de tu negocio.</p>
        </aside>

        {/* Acceso */}
        <section className="flex flex-col justify-center space-y-6 p-6 sm:p-8">
          <button
            type="button"
            onClick={goHome}
            className="flex w-fit cursor-pointer items-center gap-1.5 text-xs font-medium text-zinc-400 transition hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-[#6DD94B]" /> Volver a la web
          </button>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#6DD94B]">Primer acceso</p>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {targetBusinessName ? `Entra a ${targetBusinessName}` : 'Entra a tu portal'}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Usa la cuenta de Google con la que nos enviaste tu solicitud. Sin contraseñas ni claves: tu portal se activa solo.
            </p>
          </div>

          <button
            type="button"
            disabled={googleLoading}
            onClick={handleGoogleLogin}
            className="flex min-h-[52px] w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-white px-4 text-sm font-semibold text-black shadow-lg transition hover:bg-zinc-100 active:scale-[0.98] disabled:opacity-60"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            {googleLoading ? 'Conectando con Google…' : 'Continuar con Google'}
          </button>

          {errorMsg && (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-800 bg-rose-950/40 p-3 text-xs text-rose-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" /><span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-2 border-t border-white/10 pt-5 text-xs text-zinc-400">
            {onNavigateToMultiwebs && (
              <p>
                ¿Aún no tienes web con nosotros?{' '}
                <button type="button" onClick={onNavigateToMultiwebs} className="cursor-pointer font-semibold text-[#6DD94B] hover:underline">Solicita la tuya</button>
              </p>
            )}
            <p>
              ¿Problemas para entrar?{' '}
              <a
                href={`https://wa.me/34600000000?text=${encodeURIComponent('Hola equipo TecnOdiel, necesito ayuda para acceder al portal de clientes.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-[#6DD94B] hover:underline"
              >
                <MessageSquare className="h-3.5 w-3.5" />Escríbenos por WhatsApp
              </a>
            </p>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
