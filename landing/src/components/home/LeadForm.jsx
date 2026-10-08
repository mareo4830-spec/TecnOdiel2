import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { submitLead } from '../../../../src/lib/leads.js';

const EMPTY = { 
  name: '', 
  business_name: '', 
  phone: '', 
  email: '', 
  sector: 'Restaurante / Bar / Cafetería', 
  privacy: false 
};

const SECTORS = [
  'Restaurante / Bar / Cafetería',
  'Clínica / Salud / Dental',
  'Comercio local / Otro servicio'
];

export default function LeadForm({ 
  style: initialStyle = null,
  onNavigateToMultiwebs,
  onNavigateToCyS
}) {
  const [form, setForm] = useState(() => ({
    ...EMPTY,
    sector: initialStyle?.group === 'salud' 
      ? 'Clínica / Salud / Dental' 
      : 'Restaurante / Bar / Cafetería'
  }));
  const [status, setStatus] = useState('idle'); // idle | sending | done
  const [error, setError] = useState('');
  const [hasAttempted, setHasAttempted] = useState(false);
  const [shaking, setShaking] = useState(false);

  // Estados para la animación del botón que huye (Instagram: The button runs away until you've earned it)
  const [dodgeOffset, setDodgeOffset] = useState({ x: 0, y: 0 });
  const [dodgeIndex, setDodgeIndex] = useState(0);

  // Validaciones en tiempo real
  const isNameValid = form.name.trim().length > 0;
  const isPhoneValid = form.phone.length === 9;
  const isEmailValid = form.email.trim().includes('@') && form.email.trim().includes('.') && form.email.trim().length >= 5;
  const isFormValid = isNameValid && isPhoneValid && isEmailValid && form.privacy;

  // Contador de campos completados (0 a 3)
  const completedFields = (isNameValid ? 1 : 0) + (isPhoneValid ? 1 : 0) + (isEmailValid ? 1 : 0);

  // Cuando el formulario está 100% completo, vuelve a su sitio y se bloquea ("snaps home and locks for good")
  useEffect(() => {
    if (isFormValid) {
      setDodgeOffset({ x: 0, y: 0 });
      setError('');
    }
  }, [isFormValid]);

  // Al pasar el ratón: Si falta algo por rellenar, el botón esquiva al cursor
  const handleButtonHover = () => {
    if (isFormValid) return; // Una vez completado, ya no huye

    // A medida que rellenas campos, huye menos distancia
    const multiplier = completedFields === 0 ? 1 : completedFields === 1 ? 0.65 : 0.4;
    
    const positions = [
      { x: -140, y: 0 },
      { x: 140, y: 0 },
      { x: -110, y: -45 },
      { x: 110, y: -45 },
      { x: 0, y: -50 },
      { x: 130, y: 15 },
      { x: -130, y: 15 }
    ];

    const nextPos = positions[(dodgeIndex + 1) % positions.length];
    setDodgeOffset({
      x: Math.round(nextPos.x * multiplier),
      y: Math.round(nextPos.y * multiplier)
    });
    setDodgeIndex((prev) => prev + 1);
  };

  const triggerErrorShake = (msg) => {
    setError(msg);
    setShaking(true);
    setHasAttempted(true);
    setTimeout(() => setShaking(false), 550);
  };

  const handlePhoneChange = (e) => {
    // REGLA: Solo números y máximo 9 dígitos estrictos
    const onlyDigits = e.target.value.replace(/\D/g, '').slice(0, 9);
    setForm((f) => ({ ...f, phone: onlyDigits }));
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!isNameValid) {
      return triggerErrorShake('Dinos tu nombre para poder preparar tu propuesta.');
    }
    if (!isPhoneValid) {
      return triggerErrorShake('El número debe tener exactamente 9 números (ej. 600123456).');
    }
    if (!isEmailValid) {
      return triggerErrorShake('Indícanos un email válido con @ y dominio.');
    }
    if (!form.privacy) {
      return triggerErrorShake('Debes marcar la casilla de política de privacidad.');
    }

    setStatus('sending');

    // 1. Guardar datos en sesión para que los siguientes pasos del configurador ya los tengan
    try {
      const payload = {
        name: form.name.trim(),
        business_name: form.business_name.trim() || form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        sector: form.sector
      };
      sessionStorage.setItem('tecnodiel_lead_data', JSON.stringify(payload));
      localStorage.setItem('tecnodiel_lead_data', JSON.stringify(payload));
    } catch (_) {}

    // 2. Notificar lead en segundo plano
    try {
      await submitLead({
        name: form.name,
        business_name: form.business_name || form.name,
        phone: form.phone,
        email: form.email,
        sector: form.sector,
        message: `Solicitud inicial validada (9 dígitos: ${form.phone})`
      });
    } catch (err) {
      console.warn('Lead submit error:', err);
    }

    // 3. Redirigir al configurador de Restaurante o Clínica
    const isClinic = form.sector.toLowerCase().includes('clínica') || 
                     form.sector.toLowerCase().includes('salud') || 
                     form.sector.toLowerCase().includes('dental');

    if (isClinic) {
      if (onNavigateToCyS) onNavigateToCyS();
      else window.location.hash = '#/cys';
    } else {
      if (onNavigateToMultiwebs) onNavigateToMultiwebs();
      else window.location.hash = '#/multiwebs';
    }
  };

  const baseInputCls =
    'w-full rounded-xl border bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition';
  const labelCls = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-700';

  return (
    <form 
      onSubmit={onSubmit} 
      noValidate 
      className={`rounded-2xl bg-white p-6 sm:p-9 text-zinc-900 shadow-2xl space-y-4 relative ${shaking ? 'runaway-shake' : ''}`}
    >
      <style>{`
        @keyframes runawayShake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-12px) rotate(-1deg); }
          30% { transform: translateX(12px) rotate(1deg); }
          45% { transform: translateX(-8px) rotate(-0.5deg); }
          60% { transform: translateX(8px) rotate(0.5deg); }
          75% { transform: translateX(-4px); }
        }
        .runaway-shake {
          animation: runawayShake 0.5s ease-in-out;
        }
      `}</style>

      <div className="border-b border-zinc-100 pb-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0D844A]">
            PASO 1 DE 2 • SOLICITUD RÁPIDA
          </span>
          <span className="text-[11px] font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full font-semibold">
            {completedFields}/3 datos obligatorios
          </span>
        </div>
        <h3 className="text-xl font-extrabold text-zinc-900 mt-1">
          Cuéntanos sobre tu negocio
        </h3>
        <p className="text-xs text-zinc-500 mt-0.5">
          Completa los campos para desbloquear tu propuesta personalizada.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Tu nombre */}
        <div>
          <label className={labelCls} htmlFor="lf-name">Tu nombre *</label>
          <input 
            id="lf-name" 
            className={`${baseInputCls} ${
              hasAttempted && !isNameValid 
                ? 'border-red-400 bg-red-50/40 ring-2 ring-red-400/30' 
                : 'border-zinc-300 focus:border-[#0D844A] focus:ring-2 focus:ring-[#6DD94B]/40'
            }`} 
            value={form.name} 
            onChange={set('name')} 
            placeholder="Ej. Mario" 
            autoComplete="name" 
            maxLength={120} 
            required 
          />
        </div>

        {/* Nombre del negocio */}
        <div>
          <label className={labelCls} htmlFor="lf-biz">Nombre del negocio</label>
          <input 
            id="lf-biz" 
            className={`${baseInputCls} border-zinc-300 focus:border-[#0D844A] focus:ring-2 focus:ring-[#6DD94B]/40`} 
            value={form.business_name} 
            onChange={set('business_name')} 
            placeholder="Ej. Asador El Rincón" 
            maxLength={160} 
          />
        </div>

        {/* Teléfono / WhatsApp (SOLO 9 NÚMEROS) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700" htmlFor="lf-phone">
              Teléfono / WhatsApp *
            </label>
            <span className={`text-[10px] font-mono font-bold ${form.phone.length === 9 ? 'text-[#0D844A]' : 'text-zinc-400'}`}>
              {form.phone.length}/9 números
            </span>
          </div>
          <input 
            id="lf-phone" 
            type="tel" 
            inputMode="numeric"
            pattern="[0-9]{9}"
            maxLength={9}
            className={`${baseInputCls} font-mono ${
              hasAttempted && !isPhoneValid 
                ? 'border-red-400 bg-red-50/40 ring-2 ring-red-400/30' 
                : 'border-zinc-300 focus:border-[#0D844A] focus:ring-2 focus:ring-[#6DD94B]/40'
            }`} 
            value={form.phone} 
            onChange={handlePhoneChange} 
            placeholder="600123456" 
            autoComplete="tel" 
            required 
          />
          <p className="text-[10px] text-zinc-400 mt-1">
            Solo números (9 dígitos exactos)
          </p>
        </div>

        {/* Email */}
        <div>
          <label className={labelCls} htmlFor="lf-email">Tu email *</label>
          <input 
            id="lf-email" 
            type="email" 
            className={`${baseInputCls} ${
              hasAttempted && !isEmailValid 
                ? 'border-red-400 bg-red-50/40 ring-2 ring-red-400/30' 
                : 'border-zinc-300 focus:border-[#0D844A] focus:ring-2 focus:ring-[#6DD94B]/40'
            }`} 
            value={form.email} 
            onChange={set('email')} 
            placeholder="mario@negocio.es" 
            autoComplete="email" 
            maxLength={160} 
            required 
          />
        </div>
      </div>

      {/* Tipo de negocio */}
      <div>
        <label className={labelCls} htmlFor="lf-sector">¿Qué tipo de negocio tienes? *</label>
        <select 
          id="lf-sector" 
          className={`${baseInputCls} border-zinc-300 focus:border-[#0D844A] focus:ring-2 focus:ring-[#6DD94B]/40`} 
          value={form.sector} 
          onChange={set('sector')}
          required
        >
          {SECTORS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Casilla de Privacidad RGPD */}
      <label className="flex items-start gap-3 text-xs text-zinc-600 pt-1 cursor-pointer select-none">
        <input 
          type="checkbox" 
          required
          checked={form.privacy} 
          onChange={(e) => setForm((f) => ({ ...f, privacy: e.target.checked }))} 
          className="mt-0.5 h-4 w-4 accent-[#0D844A] cursor-pointer" 
        />
        <span>
          He leído y acepto la{' '}
          <a 
            href="#/politica-privacidad" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="underline font-semibold text-zinc-800 hover:text-[#0D844A]"
            onClick={(e) => e.stopPropagation()}
          >
            Política de Privacidad
          </a>.
        </span>
      </label>

      {/* Mensaje de Error */}
      {error && (
        <div role="alert" className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs font-semibold text-red-700 animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── BOTÓN QUE HUYE SI FALTA ALGO (RUNAWAY BUTTON DE INSTAGRAM) ── */}
      <div className="relative pt-2 flex justify-center overflow-visible">
        <button 
          type="submit" 
          disabled={status === 'sending'}
          onMouseEnter={handleButtonHover}
          style={{
            transform: `translate(${dodgeOffset.x}px, ${dodgeOffset.y}px)`,
            transition: isFormValid 
              ? 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.25s' 
              : 'transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1)'
          }}
          className={`relative z-10 flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl px-8 py-4 text-xs sm:text-sm font-black uppercase tracking-wider transition-all select-none cursor-pointer shadow-xl ${
            isFormValid
              ? 'bg-[#0D844A] hover:bg-[#09663a] text-white shadow-[#0D844A]/30 ring-2 ring-[#6DD94B]/50'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 shadow-zinc-900/30'
          }`}
        >
          {status === 'sending' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Abriendo configurador...</span>
            </>
          ) : isFormValid ? (
            <>
              <span>¡Todo listo! Quiero mi propuesta gratis</span>
              <Sparkles className="h-4 w-4 text-[#6DD94B]" />
            </>
          ) : (
            <>
              <span>Rellena los campos obligatorios</span>
              <ArrowRight className="h-4 w-4 text-[#6DD94B]" />
            </>
          )}
        </button>
      </div>

      <p className="text-center text-[11px] text-zinc-500 pt-1">
        {isFormValid 
          ? '✓ Formulario listo: haz clic para continuar' 
          : 'El botón solo se desbloquea cuando completas los 3 datos obligatorios (nombre, 9 números de teléfono y email)'}
      </p>
    </form>
  );
}
