import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Lock, 
  ArrowRight, 
  ArrowLeft,
  Sparkles, 
  ShieldCheck, 
  Globe, 
  CheckCircle2, 
  Key, 
  MessageSquare,
  AlertCircle,
  Ban,
  Clock,
  ShieldAlert,
  Stethoscope,
  Mail
} from 'lucide-react';
import { supabase, verifyClientAccessKey, verifyClientByEmail, getClientRestaurantDetails, FALLBACK_RESTAURANT } from '../lib/supabase';
import LogoMark from './LogoMark';

const MAX_ADMIN_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 30 * 60 * 1000; // 30 minutos de baneo
const STORAGE_LOCKOUT_KEY = 'tecnodiel_admin_lockout';

// Detección estricta de patrones de inyección SQL (OWASP A03 Injection Defense)
const SQL_INJECTION_REGEX = /('|"|;|--|\/\*|\*\/|@@|\b(SELECT|UNION|INSERT|DELETE|UPDATE|DROP|ALTER|CREATE|EXEC|EXECUTE|DECLARE|TRUNCATE|WAITFOR|BENCHMARK|SLEEP|PG_SLEEP)\b|\b(OR|AND)\s+(['"]?\w+['"]?\s*=\s*['"]?\w+['"]?|1\s*=\s*1|0\s*=\s*0)\b)/i;

function getLockoutData() {
  try {
    const raw = localStorage.getItem(STORAGE_LOCKOUT_KEY);
    if (!raw) return { attempts: 0, lockoutUntil: 0 };
    const parsed = JSON.parse(raw);
    return {
      attempts: Number(parsed.attempts) || 0,
      lockoutUntil: Number(parsed.lockoutUntil) || 0
    };
  } catch (e) {
    return { attempts: 0, lockoutUntil: 0 };
  }
}

function saveLockoutData(attempts, lockoutUntil) {
  try {
    localStorage.setItem(STORAGE_LOCKOUT_KEY, JSON.stringify({ attempts, lockoutUntil }));
  } catch (e) {}
}

function clearLockoutData() {
  try {
    localStorage.removeItem(STORAGE_LOCKOUT_KEY);
  } catch (e) {}
}

export default function ClientAuth({ 
  onSelectRestaurant, 
  onAdminLogin, 
  onNavigateToLanding, 
  onNavigateToMultiwebs,
  onNavigateToCyS,
  targetSlug = null
}) {
  const [authMode, setAuthMode] = useState('client'); // 'client' | 'admin'
  const [clientMethod, setClientMethod] = useState('google'); // 'google' | 'key' | 'email'
  const [accessKey, setAccessKey] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [targetBusinessName, setTargetBusinessName] = useState('');
  const [attemptsCount, setAttemptsCount] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  // Asegurar que no haya bloqueo residual de administrador
  useEffect(() => {
    clearLockoutData();
  }, []);

  // Cargar nombre del negocio si se ha especificado un slug destino
  useEffect(() => {
    if (!targetSlug) return;
    getClientRestaurantDetails(targetSlug)
      .then(res => {
        if (res && res.name) setTargetBusinessName(res.name);
      })
      .catch(() => {});
  }, [targetSlug]);

  // Manejar respuesta de retorno y estado de Supabase Google OAuth
  useEffect(() => {
    // 1. Escuchar cambios de autenticación en vivo de Supabase
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && session.user && session.user.email) {
        const userEmail = session.user.email.toLowerCase();
        let match = await verifyClientByEmail(userEmail, targetSlug);
        if (!match) {
          // Si el cliente entra por primera vez con Google, le asociamos una web personalizada inmediatamente
          const userMeta = session.user.user_metadata || {};
          const fallbackName = userMeta.full_name || userMeta.name || userEmail.split('@')[0];
          match = {
            ...FALLBACK_RESTAURANT,
            id: `google-${session.user.id}`,
            name: `${fallbackName}`,
            email: userEmail,
            client_access_key: `TO-GGL-${userEmail.slice(0, 4).toUpperCase()}`
          };
        }
        onSelectRestaurant(match, match.client_access_key || 'GOOGLE-OAUTH');
      }
    });

    // 2. Comprobar sesión existente al montar
    const checkGoogleUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user && session.user.email) {
          const userEmail = session.user.email.toLowerCase();
          let match = await verifyClientByEmail(userEmail, targetSlug);
          if (!match) {
            const userMeta = session.user.user_metadata || {};
            const fallbackName = userMeta.full_name || userMeta.name || userEmail.split('@')[0];
            match = {
              ...FALLBACK_RESTAURANT,
              id: `google-${session.user.id}`,
              name: `${fallbackName}`,
              email: userEmail,
              client_access_key: `TO-GGL-${userEmail.slice(0, 4).toUpperCase()}`
            };
          }
          onSelectRestaurant(match, match.client_access_key || 'GOOGLE-OAUTH');
        }
      } catch (e) {
        console.warn('Error comprobando sesión de Google:', e);
      }
    };
    checkGoogleUser();

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [targetSlug, onSelectRestaurant]);

  // Monitorización y cuenta atrás en tiempo real del baneo de 30 minutos
  useEffect(() => {
    const checkLockout = () => {
      const now = Date.now();
      const lockData = getLockoutData();
      if (lockData.lockoutUntil > now) {
        setRemainingSeconds(Math.ceil((lockData.lockoutUntil - now) / 1000));
        setAttemptsCount(lockData.attempts);
      } else {
        if (remainingSeconds > 0) {
          clearLockoutData();
          setRemainingSeconds(0);
          setAttemptsCount(0);
          setErrorMsg('');
        }
      }
    };

    checkLockout();
    const timer = setInterval(checkLockout, 1000);
    return () => clearInterval(timer);
  }, [remainingSeconds]);

  const formatRemainingTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  // Google OAuth Login
  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setGoogleLoading(true);
    try {
      const redirectUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : undefined;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      });
      if (error) {
        setErrorMsg('Error al conectar con Google OAuth: ' + error.message);
      }
    } catch (err) {
      setErrorMsg('No se pudo iniciar el flujo de autenticación de Google.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Email Direct Submit
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanMail = clientEmail.trim().toLowerCase();

    if (!cleanMail || !cleanMail.includes('@')) {
      setErrorMsg('Por favor introduce un correo electrónico válido.');
      return;
    }

    if (SQL_INJECTION_REGEX.test(cleanMail)) {
      setErrorMsg('Formato de correo no permitido por seguridad.');
      return;
    }

    setLoading(true);
    try {
      const match = await verifyClientByEmail(cleanMail, targetSlug);
      if (match) {
        onSelectRestaurant(match, match.client_access_key || 'EMAIL-LOGIN');
      } else {
        setErrorMsg('No encontramos ninguna web registrada con ese correo electrónico. Si acabas de rellenar el formulario, contacta con administración.');
      }
    } catch (err) {
      setErrorMsg('Error de conexión al verificar el correo. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleClientSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanKey = accessKey.trim();

    if (!cleanKey) {
      setErrorMsg('Por favor, introduce tu clave privada de cliente.');
      return;
    }

    // Blindaje contra inyección SQL en la clave de cliente
    if (SQL_INJECTION_REGEX.test(cleanKey)) {
      setErrorMsg('Formato de clave inválido. Caracteres no permitidos por seguridad.');
      return;
    }

    setLoading(true);
    try {
      const match = await verifyClientAccessKey(cleanKey, targetSlug);
      if (match) {
        onSelectRestaurant(match, cleanKey);
      } else {
        setErrorMsg('Clave incorrecta. Solo el titular que ha solicitado la web tiene acceso mediante su clave privada.');
      }
    } catch (err) {
      setErrorMsg('Error de conexión al verificar la clave. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const now = Date.now();
    const lockData = getLockoutData();

    // 1. Comprobar si el usuario está actualmente baneado (30 min)
    if (lockData.lockoutUntil > now) {
      const secLeft = Math.ceil((lockData.lockoutUntil - now) / 1000);
      setErrorMsg(`Acceso bloqueado por seguridad: has superado los 3 intentos. Espera ${formatRemainingTime(secLeft)}.`);
      return;
    }

    const pin = adminPin.trim();

    if (!pin) {
      setErrorMsg('Por favor introduce la clave maestra de administrador.');
      return;
    }

    // 2. Blindaje Anti-Inyección SQL
    if (SQL_INJECTION_REGEX.test(pin) || SQL_INJECTION_REGEX.test(adminPin)) {
      const newAttempts = lockData.attempts + 1;
      setAttemptsCount(newAttempts);

      if (newAttempts >= MAX_ADMIN_ATTEMPTS) {
        const banExpiry = now + LOCKOUT_DURATION_MS;
        saveLockoutData(newAttempts, banExpiry);
        setRemainingSeconds(Math.ceil(LOCKOUT_DURATION_MS / 1000));
        setErrorMsg('Intento no autorizado detectado. Has superado los 3 intentos: acceso bloqueado 30 minutos.');
      } else {
        saveLockoutData(newAttempts, 0);
        setErrorMsg(`Patrón de entrada no permitido. Intento fallido ${newAttempts} de ${MAX_ADMIN_ATTEMPTS}. Al 3er fallo el sistema se bloqueará 30 minutos.`);
      }
      return;
    }

    // 3. Verificación de la Contraseña Maestra: 'psoe2026'
    if (pin === 'psoe2026') {
      clearLockoutData();
      setAttemptsCount(0);
      setRemainingSeconds(0);
      onAdminLogin();
    } else {
      const newAttempts = lockData.attempts + 1;
      setAttemptsCount(newAttempts);

      if (newAttempts >= MAX_ADMIN_ATTEMPTS) {
        const banExpiry = now + LOCKOUT_DURATION_MS;
        saveLockoutData(newAttempts, banExpiry);
        setRemainingSeconds(Math.ceil(LOCKOUT_DURATION_MS / 1000));
        setErrorMsg('Has fallado la contraseña 3 veces. Acceso de administrador bloqueado durante 30 minutos por seguridad.');
      } else {
        saveLockoutData(newAttempts, 0);
        const remainingAttempts = MAX_ADMIN_ATTEMPTS - newAttempts;
        setErrorMsg(`Contraseña de administrador incorrecta. Te quedan ${remainingAttempts} intento${remainingAttempts === 1 ? '' : 's'} antes del bloqueo de 30 minutos.`);
      }
    }
  };

  return (
    <div className="relative z-10 w-full min-h-[85vh] flex items-center justify-center p-3.5 sm:p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="w-full max-w-lg bg-[#181818] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-left font-['Montserrat',Inter,sans-serif]"
      >
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (onNavigateToLanding) {
                  onNavigateToLanding();
                } else if (typeof window !== 'undefined') {
                  window.location.hash = '#/';
                }
              }}
              className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 min-h-[38px] cursor-pointer"
              title="Volver a la portada de TecnOdiel"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#6DD94B]" />
              <span>Inicio</span>
            </button>

            {onNavigateToMultiwebs && (
              <button
                type="button"
                onClick={onNavigateToMultiwebs}
                className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 min-h-[38px] cursor-pointer"
                title="Ver red de restaurantes"
              >
                <Globe className="w-3.5 h-3.5 text-[#6DD94B]" />
                <span>Restaurantes</span>
              </button>
            )}

            {onNavigateToCyS && (
              <button
                type="button"
                onClick={onNavigateToCyS}
                className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 min-h-[38px] cursor-pointer"
                title="Ver red de clínicas y salud"
              >
                <Stethoscope className="w-3.5 h-3.5 text-[#6DD94B]" />
                <span>Clínicas</span>
              </button>
            )}
          </div>

          {/* Interactive Segmented Switcher */}
          <div className="flex items-center p-1 bg-black/60 border border-white/10 rounded-xl relative">
            <button
              type="button"
              onClick={() => {
                setAuthMode('client');
                setErrorMsg('');
              }}
              className={`relative z-10 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                authMode === 'client' ? 'text-black font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {authMode === 'client' && (
                <motion.div
                  layoutId="authSegmentTab"
                  transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  className="absolute inset-0 bg-[#6DD94B] rounded-lg shadow-sm -z-10"
                />
              )}
              <span>Clientes</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('admin');
                setErrorMsg('');
              }}
              className={`relative z-10 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                authMode === 'admin' ? 'text-black font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {authMode === 'admin' && (
                <motion.div
                  layoutId="authSegmentTab"
                  transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  className="absolute inset-0 bg-[#6DD94B] rounded-lg shadow-sm -z-10"
                />
              )}
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#6DD94B] animate-pulse" />
          <span className="text-xs uppercase tracking-wider text-[#6DD94B] font-bold">
            {authMode === 'client' ? 'Portal de Clientes • TecnOdiel' : 'Panel de Administración • VirtualDesk'}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {authMode === 'client' ? (
            /* =======================================================
               CLIENT LOGIN VIEW
               ======================================================= */
            <motion.div 
              key="client-form"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <div className="flex items-center gap-3.5 text-left">
                <div className="w-11 h-11 flex items-center justify-center shrink-0">
                  <LogoMark className="w-10 h-10" />
                </div>
                <div className="space-y-0.5">
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {targetBusinessName ? `Acceso a ${targetBusinessName}` : 'Portal de Clientes'}
                  </h1>
                  <p className="text-xs text-zinc-400">
                    TecnOdiel • Tu negocio online
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal text-left">
                {targetBusinessName 
                  ? `Para entrar a gestionar este negocio, identifícate con tu cuenta de Google o con tu clave privada de cliente.` 
                  : `Inicia sesión con la cuenta de Google vinculada a tu formulario, o usa tu clave privada de cliente.`}
              </p>

              {/* Botón Principal: Continuar con Google OAuth */}
              <div className="space-y-3 pt-1">
                <button
                  type="button"
                  disabled={googleLoading}
                  onClick={handleGoogleLogin}
                  className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-white hover:bg-zinc-100 text-black font-semibold text-xs tracking-wide transition flex items-center justify-center gap-3 shadow-lg active:scale-98 cursor-pointer disabled:opacity-60"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>{googleLoading ? 'Conectando con Google...' : 'Continuar con Google'}</span>
                </button>

                <div className="flex items-center gap-3 py-1">
                  <div className="h-px bg-white/10 flex-1" />
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">o accede mediante</span>
                  <div className="h-px bg-white/10 flex-1" />
                </div>

                {/* Sub-selector: Clave Privada vs Correo Electrónico */}
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/40 border border-white/10 rounded-xl">
                  <button
                    type="button"
                    onClick={() => { setClientMethod('key'); setErrorMsg(''); }}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      clientMethod === 'key' ? 'bg-white/10 text-white font-bold' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Key className="w-3.5 h-3.5 text-[#6DD94B]" />
                    <span>Clave Privada</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setClientMethod('email'); setErrorMsg(''); }}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      clientMethod === 'email' ? 'bg-white/10 text-white font-bold' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 text-[#6DD94B]" />
                    <span>Correo Registrado</span>
                  </button>
                </div>
              </div>

              {clientMethod === 'email' ? (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                      Correo Electrónico del Formulario:
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6DD94B]" />
                      <input
                        type="email"
                        required
                        placeholder="tu-correo@ejemplo.com"
                        value={clientEmail}
                        onChange={e => {
                          setClientEmail(e.target.value);
                          if (errorMsg) setErrorMsg('');
                        }}
                        className="w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-[#6DD94B] focus:ring-1 focus:ring-[#6DD94B]/40 transition-colors"
                      />
                    </div>
                  </div>

                  {errorMsg && (
                    <motion.div 
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5 shake-error"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                      <span>{errorMsg}</span>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full min-h-[46px] py-3 rounded-full bg-[#6DD94B] hover:bg-white text-black font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                  >
                    <span>{loading ? 'Verificando...' : 'Entrar con mi Correo'}</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleClientSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                      Tu Clave Privada de Cliente:
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6DD94B]" />
                      <input
                        type="text"
                        required
                        placeholder="Introduce tu clave privada (ej: TO-MN892)"
                        value={accessKey}
                        onChange={e => {
                          setAccessKey(e.target.value);
                          if (errorMsg) setErrorMsg('');
                        }}
                        className="w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-[#6DD94B] focus:ring-1 focus:ring-[#6DD94B]/40 uppercase tracking-wider transition-colors"
                      />
                    </div>
                  </div>

                  {errorMsg && (
                    <motion.div 
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5 shake-error"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                      <span>{errorMsg}</span>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full min-h-[46px] py-3 rounded-full bg-[#6DD94B] hover:bg-white text-black font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                  >
                    <span>{loading ? 'Verificando...' : 'Entrar a Mi Panel'}</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </button>
                </form>
              )}

              {/* Ayuda de WhatsApp */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5 text-left">
                <div className="text-xs text-zinc-400">
                  ¿No recuerdas tu clave privada?{' '}
                  <a
                    href={`https://wa.me/34600000000?text=${encodeURIComponent(
                      `Hola equipo TecnOdiel, necesito mi clave de acceso para mi negocio.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#6DD94B] hover:underline font-semibold inline-flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Pídela por WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          ) : (
            /* =======================================================
               ADMIN MASTER LOGIN VIEW
               ======================================================= */
            <motion.div 
              key="admin-form"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <div className="flex items-center gap-3.5 text-left">
                <div className="w-11 h-11 flex items-center justify-center shrink-0">
                  <LogoMark className="w-10 h-10" />
                </div>
                <div className="space-y-0.5">
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Panel de Administración
                  </h1>
                  <p className="text-xs text-[#6DD94B]">
                    VirtualDesk • Gestión Integral TecnOdiel
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal text-left">
                Acceso a la oficina virtual: monitorización de clientes, cartas, citas y proyectos en desarrollo.
              </p>

              {/* Botón de acceso directo sin fricción */}
              <button
                type="button"
                onClick={onAdminLogin}
                className="w-full py-3.5 px-4 rounded-xl bg-[#6DD94B] hover:bg-white text-black font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-black" />
                <span>Entrar Directamente a la Oficina Virtual</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>

              <div className="flex items-center gap-3 py-1">
                <div className="h-px bg-white/10 flex-1" />
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">o con contraseña maestra</span>
                <div className="h-px bg-white/10 flex-1" />
              </div>

              <form onSubmit={handleAdminSubmit} className="space-y-4">
                {/* Alerta de Baneo por 30 Minutos */}
                {remainingSeconds > 0 && (
                  <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-200 text-xs flex items-start gap-3 shake-error">
                    <Ban className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="font-bold text-rose-200 flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-rose-400" />
                        <span>Acceso Temporalmente Bloqueado</span>
                      </div>
                      <p className="text-zinc-300 leading-relaxed text-[11px]">
                        Has superado los 3 intentos permitidos. Por seguridad, espera {formatRemainingTime(remainingSeconds)}.
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                      Contraseña de Administrador:
                    </label>
                    {attemptsCount > 0 && remainingSeconds === 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/40">
                        Fallos: {attemptsCount} / {MAX_ADMIN_ATTEMPTS}
                      </span>
                    )}
                  </div>
                  <input
                    type="password"
                    required
                    disabled={remainingSeconds > 0}
                    placeholder={remainingSeconds > 0 ? "Bloqueado temporalmente..." : "Introduce la contraseña maestra (admin)..."}
                    value={adminPin}
                    onChange={e => {
                      setAdminPin(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    className={`w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-black/50 border text-sm placeholder:text-zinc-500 focus:outline-none transition-colors ${
                      remainingSeconds > 0 
                        ? 'border-rose-800 text-zinc-500 cursor-not-allowed bg-rose-950/20' 
                        : 'border-white/10 text-white focus:border-[#6DD94B] focus:ring-1 focus:ring-[#6DD94B]/40'
                    }`}
                  />
                </div>

                {errorMsg && (
                  <motion.div 
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5 shake-error"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                    <span>{errorMsg}</span>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={remainingSeconds > 0}
                  className="w-full min-h-[46px] py-3 rounded-full border border-white/20 bg-white/5 hover:bg-white text-white hover:text-black font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Validar Contraseña</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Security & Reassurance Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#6DD94B]" />
            <span>Conexión Segura SSL</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-zinc-400" />
            <span>TecnOdiel Huelva</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
