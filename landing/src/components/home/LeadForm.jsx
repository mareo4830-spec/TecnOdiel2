import React, { useState } from 'react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { submitLead } from '../../../../src/lib/leads.js';
import { FORM_SECTORS, FORM_SERVICES, waLink } from './content.js';

const EMPTY = { name: '', business_name: '', sector: '', email: '', phone: '', services: [], message: '', privacy: false };

const inputCls =
  'w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-[#0D844A] focus:ring-2 focus:ring-[#6DD94B]/40';
const labelCls = 'mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-600';

export default function LeadForm() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle'); // idle | sending | done
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const toggleService = (s) =>
    setForm((f) => ({ ...f, services: f.services.includes(s) ? f.services.filter((x) => x !== s) : [...f.services, s] }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) return setError('Dinos tu nombre para poder contactarte.');
    if (!form.phone.trim() && !form.email.trim()) return setError('Déjanos un teléfono o un email para responderte.');
    if (!form.privacy) return setError('Debes aceptar la política de privacidad para enviar la solicitud.');
    setStatus('sending');
    const res = await submitLead(form);
    if (res.ok) setStatus('done');
    else { setStatus('idle'); setError('No hemos podido enviar la solicitud. Escríbenos por WhatsApp.'); }
  };

  if (status === 'done') {
    return (
      <div className="rounded-2xl bg-white p-8 sm:p-10 text-center text-zinc-900 shadow-2xl">
        <CheckCircle2 className="mx-auto h-14 w-14 text-[#0D844A]" />
        <h3 className="mt-4 text-2xl font-bold">¡Solicitud recibida!</h3>
        <p className="mt-2 text-zinc-600">
          Gracias, {form.name.split(' ')[0]}. Te contestaremos en menos de 24 horas con una propuesta pensada para tu negocio.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={waLink(`Hola, soy ${form.name} (${form.business_name || 'mi negocio'}). Acabo de enviar el formulario.`)} target="_blank" rel="noopener noreferrer"
            className="rounded-full bg-[#0D844A] px-6 py-3 text-sm font-semibold text-white hover:bg-[#09663a]">
            Adelantar por WhatsApp
          </a>
          <button onClick={() => { setForm(EMPTY); setStatus('idle'); }} className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 cursor-pointer">
            Enviar otra solicitud
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-2xl bg-white p-6 sm:p-9 text-zinc-900 shadow-2xl space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="lf-name">Tu nombre *</label>
          <input id="lf-name" className={inputCls} value={form.name} onChange={set('name')} placeholder="Ej. Adrián" autoComplete="name" maxLength={120} />
        </div>
        <div>
          <label className={labelCls} htmlFor="lf-biz">Nombre del negocio</label>
          <input id="lf-biz" className={inputCls} value={form.business_name} onChange={set('business_name')} placeholder="Ej. Barbería Millán" maxLength={160} />
        </div>
        <div>
          <label className={labelCls} htmlFor="lf-phone">Teléfono / WhatsApp</label>
          <input id="lf-phone" type="tel" className={inputCls} value={form.phone} onChange={set('phone')} placeholder="600 000 000" autoComplete="tel" maxLength={40} />
        </div>
        <div>
          <label className={labelCls} htmlFor="lf-email">Email</label>
          <input id="lf-email" type="email" className={inputCls} value={form.email} onChange={set('email')} placeholder="tu@negocio.com" autoComplete="email" maxLength={160} />
        </div>
      </div>

      <div>
        <label className={labelCls} htmlFor="lf-sector">¿Qué tipo de negocio tienes?</label>
        <select id="lf-sector" className={inputCls} value={form.sector} onChange={set('sector')}>
          <option value="">Selecciona una opción</option>
          {FORM_SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <fieldset>
        <legend className={labelCls}>¿Qué te gustaría tener?</legend>
        <div className="flex flex-wrap gap-2">
          {FORM_SERVICES.map((s) => {
            const on = form.services.includes(s);
            return (
              <button type="button" key={s} onClick={() => toggleService(s)} aria-pressed={on}
                className={`rounded-full border px-4 py-2 text-xs font-medium transition cursor-pointer ${on ? 'border-[#0D844A] bg-[#0D844A] text-white' : 'border-zinc-300 text-zinc-700 hover:border-[#0D844A]'}`}>
                {s}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div>
        <label className={labelCls} htmlFor="lf-msg">Cuéntanos tu idea (opcional)</label>
        <textarea id="lf-msg" rows={4} className={inputCls} value={form.message} onChange={set('message')} placeholder="¿Qué problema quieres resolver? ¿Qué usas ahora?" maxLength={2000} />
      </div>

      <label className="flex items-start gap-3 text-xs text-zinc-600">
        <input type="checkbox" checked={form.privacy} onChange={(e) => setForm((f) => ({ ...f, privacy: e.target.checked }))} className="mt-0.5 h-4 w-4 accent-[#0D844A]" />
        <span>He leído y acepto la política de privacidad. Usaremos tus datos solo para contactarte sobre tu solicitud.</span>
      </label>

      {error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <button type="submit" disabled={status === 'sending'}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0D844A] px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-[#09663a] disabled:opacity-60 cursor-pointer">
        {status === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {status === 'sending' ? 'Enviando…' : 'Quiero mi propuesta gratis'}
      </button>
      <p className="text-center text-xs text-zinc-500">Sin compromiso · Presupuesto cerrado · Respuesta en menos de 24 h</p>
    </form>
  );
}
