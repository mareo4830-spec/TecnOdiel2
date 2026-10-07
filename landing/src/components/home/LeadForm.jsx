import React, { useState } from 'react';
import { CheckCircle2, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { submitLead } from '../../../../src/lib/leads.js';
import { waLink } from './content.js';

const EMPTY = { 
  name: '', 
  business_name: '', 
  phone: '', 
  email: '', 
  sector: 'Restaurante / Bar / Cafetería', 
  privacy: true 
};

const inputCls =
  'w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-[#0D844A] focus:ring-2 focus:ring-[#6DD94B]/40';
const labelCls = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-700';

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

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) {
      return setError('Dinos tu nombre para poder preparar tu propuesta.');
    }
    if (!form.phone.trim()) {
      return setError('Déjanos un teléfono o WhatsApp de contacto.');
    }
    if (!form.email.trim()) {
      return setError('Indícanos tu email para enviarte la propuesta.');
    }
    if (!form.privacy) {
      return setError('Debes aceptar la política de privacidad para continuar.');
    }

    setStatus('sending');

    // 1. Guardar en almacenamiento de sesión para que el formulario siguiente (wizard) lo tenga pre-rellenado
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

    // 2. Registrar el lead en segundo plano
    try {
      await submitLead({
        name: form.name,
        business_name: form.business_name || form.name,
        phone: form.phone,
        email: form.email,
        sector: form.sector,
        message: `Solicitud inicial desde landing para: ${form.sector}`
      });
    } catch (err) {
      console.warn('Registro de lead en backend:', err);
    }

    // 3. Redirección inmediata al formulario del tipo de empresa elegido (sin preview)
    const isClinic = form.sector.toLowerCase().includes('clínica') || form.sector.toLowerCase().includes('salud') || form.sector.toLowerCase().includes('dental');

    if (isClinic) {
      if (onNavigateToCyS) {
        onNavigateToCyS();
      } else {
        window.location.hash = '#/cys';
      }
    } else {
      if (onNavigateToMultiwebs) {
        onNavigateToMultiwebs();
      } else {
        window.location.hash = '#/multiwebs';
      }
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-2xl bg-white p-6 sm:p-9 text-zinc-900 shadow-2xl space-y-4">
      <div className="border-b border-zinc-100 pb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#0D844A] block mb-1">
          PASO 1 DE 2 • SOLICITUD RÁPIDA
        </span>
        <h3 className="text-xl font-extrabold text-zinc-900">
          Cuéntanos sobre tu negocio
        </h3>
        <p className="text-xs text-zinc-500 mt-0.5">
          Rellena tus datos y pasa directo a elegir tu plantilla y servicios sin líos.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Tu nombre */}
        <div>
          <label className={labelCls} htmlFor="lf-name">Tu nombre *</label>
          <input 
            id="lf-name" 
            className={inputCls} 
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
            className={inputCls} 
            value={form.business_name} 
            onChange={set('business_name')} 
            placeholder="Ej. Asador El Rincón" 
            maxLength={160} 
          />
        </div>

        {/* Teléfono / WhatsApp */}
        <div>
          <label className={labelCls} htmlFor="lf-phone">Teléfono / WhatsApp *</label>
          <input 
            id="lf-phone" 
            type="tel" 
            className={inputCls} 
            value={form.phone} 
            onChange={set('phone')} 
            placeholder="600 000 000" 
            autoComplete="tel" 
            maxLength={40} 
            required 
          />
        </div>

        {/* Email */}
        <div>
          <label className={labelCls} htmlFor="lf-email">Tu email *</label>
          <input 
            id="lf-email" 
            type="email" 
            className={inputCls} 
            value={form.email} 
            onChange={set('email')} 
            placeholder="mario@negocio.es" 
            autoComplete="email" 
            maxLength={160} 
            required 
          />
        </div>
      </div>

      {/* Tipo de empresa */}
      <div>
        <label className={labelCls} htmlFor="lf-sector">¿Qué tipo de negocio tienes? *</label>
        <select 
          id="lf-sector" 
          className={inputCls} 
          value={form.sector} 
          onChange={set('sector')}
          required
        >
          {SECTORS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Política de privacidad */}
      <label className="flex items-start gap-3 text-xs text-zinc-600 pt-1 cursor-pointer">
        <input 
          type="checkbox" 
          checked={form.privacy} 
          onChange={(e) => setForm((f) => ({ ...f, privacy: e.target.checked }))} 
          className="mt-0.5 h-4 w-4 accent-[#0D844A] cursor-pointer" 
        />
        <span>He leído y acepto la política de privacidad. Usaremos tus datos solo para tu proyecto.</span>
      </label>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-700">
          {error}
        </p>
      )}

      {/* Botón de envío */}
      <button 
        type="submit" 
        disabled={status === 'sending'}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0D844A] hover:bg-[#09663a] px-8 py-4 text-sm font-black uppercase tracking-wider text-white transition shadow-lg shadow-[#0D844A]/25 disabled:opacity-60 cursor-pointer"
      >
        {status === 'sending' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Abriendo configurador...</span>
          </>
        ) : (
          <>
            <span>Quiero mi propuesta gratis</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      <p className="text-center text-[11px] text-zinc-500">
        Sin compromiso • Elige tu plantilla y servicios en el siguiente paso
      </p>
    </form>
  );
}
