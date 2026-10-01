import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Globe, 
  CheckCircle2, 
  Key, 
  MessageSquare,
  AlertCircle,
  Ban,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { verifyClientAccessKey } from '../lib/supabase';

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

export default function ClientAuth({ onSelectRestaurant, onAdminLogin }) {
  const [authMode, setAuthMode] = useState('client'); // 'client' | 'admin'
  const [accessKey, setAccessKey] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [attemptsCount, setAttemptsCount] = useState(() => getLockoutData().attempts);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

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
      setErrorMsg('Por favor, introduce tu clave de acceso de cliente.');
      return;
    }

    // Blindaje contra inyección SQL en la clave de cliente
    if (SQL_INJECTION_REGEX.test(cleanKey)) {
      setErrorMsg('⚠️ Formato de clave inválido. Caracteres sospechosos de inyección SQL neutralizados.');
      return;
    }

    setLoading(true);
    try {
      const match = await verifyClientAccessKey(cleanKey);
      if (match) {
        onSelectRestaurant(match.slug || match.id);
      } else {
        setErrorMsg('Clave no reconocida. Si eres cliente de TecnOdiel, contacta con nosotros por WhatsApp para facilitártela en el acto.');
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
      setErrorMsg(`⛔ Acceso bloqueado por seguridad: has superado los 3 intentos. Espera ${formatRemainingTime(secLeft)}.`);
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
        setErrorMsg('⛔ Intento de inyección SQL detectado y bloqueado. Has superado los 3 intentos: baneado 30 minutos.');
      } else {
        saveLockoutData(newAttempts, 0);
        setErrorMsg(`⚠️ Patrón de inyección SQL no permitido. Intento fallido ${newAttempts} de ${MAX_ADMIN_ATTEMPTS}. Al 3er fallo serás baneado 30 min.`);
      }
      return;
    }

    // 3. Verificación de la Contraseña Maestra Actualizada: 'psoe2026'
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
        setErrorMsg('⛔ Has fallado la contraseña 3 veces. Acceso de administrador BANEADO durante 30 minutos por seguridad.');
      } else {
        saveLockoutData(newAttempts, 0);
        const remainingAttempts = MAX_ADMIN_ATTEMPTS - newAttempts;
        setErrorMsg(`Contraseña de administrador incorrecta. Te quedan ${remainingAttempts} intento${remainingAttempts === 1 ? '' : 's'} antes del bloqueo de 30 minutos.`);
      }
    }
  };

  return (
    <div className="relative z-10 w-full min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-zinc-950/85 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-2xl space-y-7 animate-fadeIn">
        {/* Mode Toggle Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-semibold">
              {authMode === 'client' ? '// ACCESO PRIVADO CLIENTE' : '// ACCESO MAESTRO ADMIN'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setAuthMode(prev => (prev === 'client' ? 'admin' : 'client'));
              setErrorMsg('');
            }}
            className="text-[11px] font-mono text-zinc-400 hover:text-white transition flex items-center gap-1 hover:underline"
          >
            {authMode === 'client' ? (
              <span>Acceso Administrador →</span>
            ) : (
              <span>← Volver a Acceso Clientes</span>
            )}
          </button>
        </div>

        {authMode === 'client' ? (
          /* =======================================================
             CLIENT LOGIN VIEW (ISOLATED WITH UNIQUE ACCESS KEY)
             ======================================================= */
          <div className="space-y-6">
            <div className="text-center space-y-2.5">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Acceso a Tu Negocio
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
                Introduce tu <strong>Clave Única de Cliente</strong> para gestionar tu carta, revisar tus reservas y ver tu web en tiempo real con total privacidad.
              </p>
            </div>

            <form onSubmit={handleClientSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2 font-mono">
                  Tu Clave de Acceso Única:
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                  <input
                    type="text"
                    required
                    placeholder="ej: TO-MN892 o nombre de tu web"
                    value={accessKey}
                    onChange={e => {
                      setAccessKey(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-zinc-900/90 border border-white/15 text-white font-mono text-sm placeholder:text-zinc-500 focus:outline-none focus:border-emerald-400 uppercase tracking-wider transition shadow-inner"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.35)] active:scale-95"
              >
                <span>{loading ? 'Verificando Clave...' : 'Entrar a Mi Panel'}</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </form>

            {/* Quick Demo Key Hint & WhatsApp Recovery */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-center">
              <div className="text-[11px] text-zinc-400">
                Clave demo para probar ahora mismo: <code className="text-emerald-400 font-bold font-mono bg-zinc-900 px-2 py-0.5 rounded border border-emerald-500/30 cursor-pointer" onClick={() => setAccessKey('TO-MN892')}>TO-MN892</code>
              </div>
              <div className="text-[11px] text-zinc-500">
                ¿No tienes tu clave a mano?{' '}
                <a
                  href={`https://wa.me/34600000000?text=${encodeURIComponent('Hola equipo TecnOdiel, necesito la clave de acceso para mi restaurante.')}`}
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
          <div className="space-y-6">
            <div className="text-center space-y-2.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Acceso de Administración
              </h1>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Monitorización de clientes, presupuestos, estados y tareas de cada web.
              </p>
            </div>

            <form onSubmit={handleAdminSubmit} className="space-y-4">
              {/* Alerta de Baneo por 30 Minutos */}
              {remainingSeconds > 0 && (
                <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-3 animate-fadeIn">
                  <Ban className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-bold text-rose-200 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                      <span>Acceso de Administrador Bloqueado</span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed text-[11px]">
                      Has superado los 3 intentos permitidos o se detectó un patrón malicioso. Por seguridad de TecnOdiel, este panel está baneado durante 30 minutos.
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
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      Fallos: {attemptsCount} / {MAX_ADMIN_ATTEMPTS}
                    </span>
                  )}
                </div>
                <input
                  type="password"
                  required
                  disabled={remainingSeconds > 0}
                  placeholder={remainingSeconds > 0 ? "Acceso temporalmente baneado..." : "Introduce la clave maestra..."}
                  value={adminPin}
                  onChange={e => {
                    setAdminPin(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  className={`w-full px-4 py-3.5 rounded-2xl bg-zinc-900/90 border font-mono text-sm placeholder:text-zinc-500 focus:outline-none transition ${
                    remainingSeconds > 0 
                      ? 'border-rose-500/30 text-zinc-500 cursor-not-allowed bg-rose-950/20' 
                      : 'border-white/15 text-white focus:border-emerald-400'
                  }`}
                />
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={remainingSeconds > 0}
                className={`w-full py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 active:scale-95 ${
                  remainingSeconds > 0
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 cursor-not-allowed'
                    : 'bg-emerald-400 hover:bg-emerald-300 text-black shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                }`}
              >
                {remainingSeconds > 0 ? (
                  <>
                    <Ban className="w-4 h-4" />
                    <span>Baneado ({formatRemainingTime(remainingSeconds)})</span>
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
        <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Aislamiento de Negocio SSL</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>Cloudflare Edge</span>
          </div>
        </div>
      </div>
    </div>
  );
}
