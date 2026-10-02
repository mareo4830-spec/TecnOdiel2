import React, { useState, useEffect } from 'react';
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
  Stethoscope
} from 'lucide-react';
import { verifyClientAccessKey, getClientRestaurantDetails } from '../lib/supabase';

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
  const [accessKey, setAccessKey] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [targetBusinessName, setTargetBusinessName] = useState('');
  const [attemptsCount, setAttemptsCount] = useState(() => getLockoutData().attempts);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  // Cargar nombre del negocio si se ha especificado un slug destino
  useEffect(() => {
    if (!targetSlug) return;
    getClientRestaurantDetails(targetSlug)
      .then(res => {
        if (res && res.name) setTargetBusinessName(res.name);
      })
      .catch(() => {});
  }, [targetSlug]);

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
      <div className="w-full max-w-lg bg-[#09090c] border border-zinc-800 rounded-lg p-5 sm:p-8 shadow-2xl space-y-6 text-left">
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
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
              className="btn-industrial px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900/90 hover:bg-zinc-800 text-xs font-mono font-medium text-zinc-300 hover:text-white transition flex items-center gap-1.5 min-h-[40px] cursor-pointer"
              title="Volver a la portada de TecnOdiel"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
              <span>Inicio</span>
            </button>

            {onNavigateToMultiwebs && (
              <button
                type="button"
                onClick={onNavigateToMultiwebs}
                className="btn-industrial px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition flex items-center gap-1.5 min-h-[40px] cursor-pointer"
                title="Ver red de restaurantes"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Restaurantes</span>
              </button>
            )}

            {onNavigateToCyS && (
              <button
                type="button"
                onClick={onNavigateToCyS}
                className="btn-industrial px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition flex items-center gap-1.5 min-h-[40px] cursor-pointer"
                title="Ver red de clínicas y salud"
              >
                <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
                <span>Clínicas</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setAuthMode(prev => (prev === 'client' ? 'admin' : 'client'));
              setErrorMsg('');
            }}
            className="text-[11px] font-mono text-zinc-400 hover:text-white transition flex items-center gap-1 hover:underline cursor-pointer rounded px-2 py-1.5 min-h-[40px]"
          >
            {authMode === 'client' ? (
              <span>Acceso Admin →</span>
            ) : (
              <span>← Acceso Clientes</span>
            )}
          </button>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-wider text-emerald-300 font-semibold">
            {authMode === 'client' ? '// PANEL DE CLIENTE // RESTAURANTES & CLÍNICAS // 0€ COMISIONES' : '// PANEL DE ADMINISTRACIÓN // MASTER'}
          </span>
        </div>

        {authMode === 'client' ? (
          /* =======================================================
             CLIENT LOGIN VIEW (SOLO CON CLAVE PRIVADA DE ACCESO)
             ======================================================= */
          <div className="space-y-5">
            <div className="flex items-center gap-3 text-left">
              <div className="w-11 h-11 flex items-center justify-center shrink-0">
                <img src="/logo.png" alt="TecnOdiel Logo" className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]" />
              </div>
              <div className="space-y-0.5">
                <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-sans">
                  {targetBusinessName ? `Acceso a ${targetBusinessName}` : 'Acceso al Portal de Clientes'}
                </h1>
                <p className="text-[11px] font-mono text-cyan-400">
                  TecnOdiel // Identificación Segura
                </p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal text-left">
              {targetBusinessName 
                ? `Para entrar a gestionar este negocio, introduce la clave privada que te entregamos al solicitar tu página web.` 
                : `Solo el titular que ha solicitado la página web tiene acceso mediante su clave privada de cliente.`}
            </p>

            <form onSubmit={handleClientSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2 font-mono">
                  Tu Clave Privada de Cliente:
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                  <input
                    type="text"
                    required
                    placeholder="Introduce tu clave privada"
                    value={accessKey}
                    onChange={e => {
                      setAccessKey(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    className="w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded bg-zinc-900 border border-zinc-700 text-white font-mono text-sm placeholder:text-zinc-500 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 uppercase tracking-wider transition"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded bg-rose-950/40 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-industrial w-full min-h-[44px] py-3 rounded bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-sm active:scale-98 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>{loading ? 'Verificando Clave...' : 'Entrar a Mi Panel'}</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </form>

            {/* Ayuda de recuperación de clave por WhatsApp oficial */}
            <div className="p-3.5 rounded bg-zinc-900/60 border border-zinc-800 space-y-1.5 text-left font-mono">
              <div className="text-[11px] text-zinc-400">
                ¿Has solicitado tu web y no recuerdas tu clave privada?{' '}
                <a
                  href={`https://wa.me/34600000000?text=${encodeURIComponent(
                    `Hola equipo TecnOdiel, he solicitado la web ${targetBusinessName ? `de ${targetBusinessName}` : ''} y necesito mi clave de acceso privado.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:underline font-medium inline-flex items-center gap-1"
                >
                  <MessageSquare className="w-3 h-3" />
                  Pídela por WhatsApp
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* =======================================================
             SUPER ADMIN MASTER LOGIN VIEW
             ======================================================= */
          <div className="space-y-5">
            <div className="flex items-center gap-3 text-left">
              <div className="w-11 h-11 flex items-center justify-center shrink-0">
                <img src="/logo.png" alt="TecnOdiel Logo" className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]" />
              </div>
              <div className="space-y-0.5">
                <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-sans">
                  Acceso de Administración
                </h1>
                <p className="text-[11px] font-mono text-cyan-400">
                  TecnOdiel // Panel Maestro
                </p>
              </div>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-normal text-left">
              Monitorización técnica de clientes, presupuestos, estados y despliegues.
            </p>

            <form onSubmit={handleAdminSubmit} className="space-y-4">
              {/* Alerta de Baneo por 30 Minutos */}
              {remainingSeconds > 0 && (
                <div className="p-3.5 rounded bg-rose-950/40 border border-rose-800 text-rose-200 text-xs flex items-start gap-3">
                  <Ban className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-bold text-rose-200 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                      <span>Acceso de Administrador Bloqueado</span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed text-[11px]">
                      Has superado los 3 intentos permitidos o se detectó un patrón malicioso. Por seguridad de TecnOdiel, este panel está bloqueado durante 30 minutos.
                    </p>
                    <div className="pt-1.5 flex items-center gap-1.5 text-rose-300 font-mono text-xs font-bold">
                      <Clock className="w-3.5 h-3.5 animate-spin" />
                      <span>Tiempo restante: {formatRemainingTime(remainingSeconds)}</span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
                    Clave Maestra de Administrador:
                  </label>
                  {attemptsCount > 0 && remainingSeconds === 0 && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/40">
                      Fallos: {attemptsCount} / {MAX_ADMIN_ATTEMPTS}
                    </span>
                  )}
                </div>
                <input
                  type="password"
                  required
                  disabled={remainingSeconds > 0}
                  placeholder={remainingSeconds > 0 ? "Acceso temporalmente bloqueado..." : "Introduce la clave maestra..."}
                  value={adminPin}
                  onChange={e => {
                    setAdminPin(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  className={`w-full min-h-[44px] px-4 py-2.5 rounded bg-zinc-900 border font-mono text-sm placeholder:text-zinc-500 focus:outline-none transition ${
                    remainingSeconds > 0 
                      ? 'border-rose-800 text-zinc-500 cursor-not-allowed bg-rose-950/20' 
                      : 'border-zinc-700 text-white focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400'
                  }`}
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded bg-rose-950/40 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={remainingSeconds > 0}
                className={`btn-industrial w-full min-h-[44px] py-3 rounded font-mono font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 active:scale-98 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  remainingSeconds > 0
                    ? 'bg-rose-900/30 text-rose-400 border border-rose-800 cursor-not-allowed'
                    : 'bg-white hover:bg-zinc-200 text-black shadow-sm'
                }`}
              >
                {remainingSeconds > 0 ? (
                  <>
                    <Ban className="w-4 h-4" />
                    <span>Bloqueado ({formatRemainingTime(remainingSeconds)})</span>
                  </>
                ) : (
                  <>
                    <span>Acceder al Panel Maestro</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Security & Reassurance Footer */}
        <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Aislamiento SSL 256-Bit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-zinc-400" />
            <span>Cloudflare Edge</span>
          </div>
        </div>
      </div>
    </div>
  );
}
