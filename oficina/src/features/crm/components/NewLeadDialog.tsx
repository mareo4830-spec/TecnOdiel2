import { UserPlus, X } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { MOCK_PARTNERS } from '../../../lib/partners';
import type { BusinessType, LeadSource, PartnerId } from '../../../types';
import { BUSINESS_TYPES, BUSINESS_TYPE_META } from '../../projects/projectMeta';
import { SOURCES, SOURCE_LABEL } from '../leadMeta';
import type { NewLeadInput } from '../leadService';

const inputClass =
  'w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30';

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-gray-300">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-rose-400">{error}</span>}
    </label>
  );
}

interface Props {
  defaultOwner: PartnerId;
  onClose: () => void;
  onCreate: (input: NewLeadInput) => void;
}

export function NewLeadDialog({ defaultOwner, onClose, onCreate }: Props) {
  const [form, setForm] = useState({
    businessName: '',
    businessType: 'barberia' as BusinessType,
    contactName: '',
    phone: '',
    email: '',
    city: 'Huelva',
    source: 'puerta_fria' as LeadSource,
    estimatedValue: '',
    owner: defaultOwner,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((f) => ({ ...f, [key]: value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!form.businessName.trim()) next.businessName = 'Indica el negocio.';
    if (!form.contactName.trim()) next.contactName = '¿Con quién habláis?';
    if (form.phone.replace(/\D/g, '').length < 9) next.phone = 'Teléfono no válido.';
    const value = form.estimatedValue.trim() ? Number(form.estimatedValue.replace(',', '.')) : 0;
    if (!Number.isFinite(value) || value < 0) next.estimatedValue = 'Importe no válido.';
    setErrors(next);
    if (Object.keys(next).length) return;
    onCreate({
      businessName: form.businessName.trim(),
      businessType: form.businessType,
      contactName: form.contactName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      city: form.city.trim() || 'Huelva',
      source: form.source,
      estimatedValue: value,
      owner: form.owner,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div aria-hidden onClick={onClose} className="anim-backdrop absolute inset-0 bg-black/70" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-lead-title"
        className="anim-modal relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl border border-gray-800 bg-gray-900 shadow-2xl sm:max-w-xl sm:rounded-2xl"
      >
        <header className="flex items-center justify-between border-b border-gray-800 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <UserPlus className="h-4 w-4" />
            </span>
            <h2 id="new-lead-title" className="font-semibold text-white">Nuevo lead</h2>
          </div>
          <button onClick={onClose} aria-label="Cerrar" className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </header>

        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col" noValidate>
          <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto px-5 py-5 sm:grid-cols-2">
            <Field label="Negocio" error={errors.businessName}>
              <input ref={firstRef} className={inputClass} value={form.businessName} onChange={(e) => set('businessName', e.target.value)} placeholder="Barbería Los Pinos" />
            </Field>
            <Field label="Tipo de negocio">
              <select className={inputClass} value={form.businessType} onChange={(e) => set('businessType', e.target.value as BusinessType)}>
                {BUSINESS_TYPES.map((t) => (
                  <option key={t} value={t}>{BUSINESS_TYPE_META[t].label}</option>
                ))}
              </select>
            </Field>
            <Field label="Persona de contacto" error={errors.contactName}>
              <input className={inputClass} value={form.contactName} onChange={(e) => set('contactName', e.target.value)} placeholder="Rafa" />
            </Field>
            <Field label="Teléfono" error={errors.phone}>
              <input className={inputClass} type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+34 600 000 000" />
            </Field>
            <Field label="Email">
              <input className={inputClass} type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="opcional" />
            </Field>
            <Field label="Ciudad">
              <input className={inputClass} value={form.city} onChange={(e) => set('city', e.target.value)} />
            </Field>
            <Field label="Cómo llegó">
              <select className={inputClass} value={form.source} onChange={(e) => set('source', e.target.value as LeadSource)}>
                {SOURCES.map((s) => (
                  <option key={s} value={s}>{SOURCE_LABEL[s]}</option>
                ))}
              </select>
            </Field>
            <Field label="Presupuesto estimado (€)" error={errors.estimatedValue}>
              <input className={inputClass} inputMode="decimal" value={form.estimatedValue} onChange={(e) => set('estimatedValue', e.target.value)} placeholder="700" />
            </Field>
            <Field label="Responsable">
              <select className={inputClass} value={form.owner} onChange={(e) => set('owner', e.target.value as PartnerId)}>
                {MOCK_PARTNERS.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </Field>
          </div>
          <footer className="flex justify-end gap-2 border-t border-gray-800 px-5 py-4">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-800">
              Cancelar
            </button>
            <button type="submit" className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 hover:from-indigo-500 hover:to-purple-500">
              Añadir lead
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
