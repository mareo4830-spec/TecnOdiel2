import { Boxes, FolderPlus, Store, X, type LucideIcon } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { MOCK_PARTNERS } from '../../../lib/partners';
import type { BusinessType, LayoutVariant, NewProjectInput, PartnerId, ProjectKind, ProjectStatus } from '../../../types';
import { BUSINESS_TYPES, BUSINESS_TYPE_META, LAYOUTS, LAYOUT_META, STATUS_META } from '../projectMeta';
import { DEFAULT_SAAS_CONFIG, LABEL_RE, REPO_RE, refFromSupabaseUrl } from '../saasConfig';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const inputClass =
  'w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30';

const KINDS: { id: ProjectKind; label: string; description: string; icon: LucideIcon }[] = [
  { id: 'standard', label: 'Estándar', description: 'La web de un cliente: un negocio, un precio cerrado.', icon: Store },
  {
    id: 'saas',
    label: 'SaaS Multi-Tenant',
    description: 'Un producto (peluquerías, restaurantes…) con su BD, repo y Vercel. Dentro se crean los negocios.',
    icon: Boxes,
  },
];

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-gray-300">{label}</span>
      {children}
      {error ? (
        <span className="mt-1 block text-xs text-rose-400">{error}</span>
      ) : (
        hint && <span className="mt-1 block text-xs text-gray-500">{hint}</span>
      )}
    </label>
  );
}

interface Props {
  defaultPartner: PartnerId;
  /** Valores iniciales, p. ej. al convertir un lead del CRM. */
  initial?: Partial<Pick<NewProjectInput, 'name' | 'businessName' | 'businessType' | 'price' | 'closedBy'>>;
  onClose: () => void;
  onCreate: (input: NewProjectInput) => void;
}

export function NewProjectDialog({ defaultPartner, initial, onClose, onCreate }: Props) {
  const [kind, setKind] = useState<ProjectKind>('standard');
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    businessName: initial?.businessName ?? '',
    businessId: '',
    businessType: initial?.businessType ?? ('barberia' as BusinessType),
    layout: 'classic' as LayoutVariant,
    price: initial?.price ? String(initial.price) : '',
    domain: '',
    closedBy: initial?.closedBy ?? defaultPartner,
    auditBy: defaultPartner,
    // Estándar: etapa inicial y cita de cierre.
    status: (initial?.price ? 'en_progreso' : 'planeado') as ProjectStatus,
    meetingDate: '',
    meetingTime: '',
    meetingPlace: '',
    // SaaS: conexiones básicas (el resto en la pestaña Configuración).
    repo: '',
    supabaseUrl: '',
    vercelProject: '',
    vercelAppSuffix: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const firstRef = useRef<HTMLInputElement>(null);
  const saas = kind === 'saas';

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = 'Ponle un nombre al proyecto.';
    if (!form.businessName.trim()) next.businessName = saas ? 'Indica el nombre del producto.' : 'Indica el negocio.';
    if (!saas && form.businessId.trim() && !UUID_RE.test(form.businessId.trim())) next.businessId = 'Debe ser un UUID.';
    const price = saas || !form.price.trim() ? 0 : Number(form.price.replace(',', '.'));
    if (!saas && (!Number.isFinite(price) || price < 0)) next.price = 'Introduce un precio válido.';
    if (!saas && form.status !== 'planeado' && price <= 0) next.price = 'Si ya está cerrado, indica el precio.';
    if (saas && form.repo.trim() && !REPO_RE.test(form.repo.trim())) next.repo = 'Formato organización/repositorio.';
    if (saas && form.supabaseUrl.trim() && !refFromSupabaseUrl(form.supabaseUrl)) next.supabaseUrl = 'Debe ser https://<ref>.supabase.co';
    if (saas && form.vercelAppSuffix && !LABEL_RE.test(form.vercelAppSuffix)) next.vercelAppSuffix = 'Minúsculas, números y guiones.';
    setErrors(next);
    if (Object.keys(next).length) return;

    const supabaseUrl = form.supabaseUrl.trim().replace(/\/$/, '');
    onCreate({
      kind,
      name: form.name.trim(),
      businessName: form.businessName.trim(),
      businessId: saas || !form.businessId.trim() ? null : form.businessId.trim().toLowerCase(),
      businessType: form.businessType,
      layout: form.layout,
      price,
      domain: form.domain.trim() || null,
      closedBy: form.closedBy,
      auditBy: form.auditBy,
      ...(saas
        ? {
            repo: form.repo.trim() ? { fullName: form.repo.trim(), branch: 'main' } : undefined,
            vercelProject: form.vercelProject.trim() || undefined,
            saas: {
              ...DEFAULT_SAAS_CONFIG,
              supabaseUrl,
              supabaseRef: refFromSupabaseUrl(supabaseUrl),
              vercelAppSuffix: form.vercelAppSuffix,
            },
          }
        : {
            status: form.status,
            meeting:
              form.status === 'planeado' && form.meetingDate
                ? { date: form.meetingDate, time: form.meetingTime || null, place: form.meetingPlace.trim() }
                : null,
          }),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div aria-hidden onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-project-title"
        className="relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl border border-gray-800 bg-gray-900 shadow-2xl sm:max-w-2xl sm:rounded-2xl"
      >
        <header className="flex items-center justify-between border-b border-gray-800 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <FolderPlus className="h-4 w-4" />
            </span>
            <h2 id="new-project-title" className="font-semibold text-white">
              Nuevo proyecto
            </h2>
          </div>
          <button onClick={onClose} aria-label="Cerrar" className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col" noValidate>
          <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto px-5 py-5 sm:grid-cols-2">
            <fieldset className="sm:col-span-2">
              <legend className="mb-1.5 text-sm font-medium text-gray-300">Tipo de proyecto</legend>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" role="radiogroup">
                {KINDS.map(({ id, label, description, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={kind === id}
                    onClick={() => setKind(id)}
                    className={`flex items-start gap-3 rounded-xl border p-3 text-left transition ${
                      kind === id ? 'border-indigo-500 bg-indigo-500/10' : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                    }`}
                  >
                    <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${kind === id ? 'text-indigo-300' : 'text-gray-400'}`} />
                    <span>
                      <span className="block text-sm font-semibold text-white">{label}</span>
                      <span className="mt-0.5 block text-xs text-gray-400">{description}</span>
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="sm:col-span-2">
              <legend className="mb-1.5 text-sm font-medium text-gray-300">{saas ? 'Vertical del producto' : 'Categoría'}</legend>
              <div role="radiogroup" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {BUSINESS_TYPES.map((t) => {
                  const meta = BUSINESS_TYPE_META[t];
                  const Icon = meta.icon;
                  return (
                    <button
                      key={t}
                      type="button"
                      role="radio"
                      aria-checked={form.businessType === t}
                      onClick={() => set('businessType', t)}
                      className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 text-sm transition ${
                        form.businessType === t
                          ? 'border-indigo-500 bg-indigo-500/10 text-white'
                          : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      <span className={`grid h-6 w-6 place-items-center rounded-md ${meta.tint}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      {meta.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="sm:col-span-2">
              <Field label="Nombre del proyecto" error={errors.name}>
                <input
                  ref={firstRef}
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder={saas ? 'SaaS Restaurantes' : 'Landing Page Barbería'}
                />
              </Field>
            </div>
            <Field label={saas ? 'Producto' : 'Negocio'} error={errors.businessName}>
              <input
                className={inputClass}
                value={form.businessName}
                onChange={(e) => set('businessName', e.target.value)}
                placeholder={saas ? 'Plataforma de reservas' : 'Barbería El Faro'}
              />
            </Field>

            {!saas ? (
              <>
                <Field label="Etapa">
                  <select className={inputClass} value={form.status} onChange={(e) => set('status', e.target.value as ProjectStatus)}>
                    {(['planeado', 'en_progreso'] as ProjectStatus[]).map((s) => (
                      <option key={s} value={s}>
                        {STATUS_META[s].label} · {STATUS_META[s].hint.toLowerCase()}
                      </option>
                    ))}
                  </select>
                </Field>
                {form.status === 'planeado' && (
                  <div className="grid grid-cols-2 gap-3 rounded-xl border border-gray-800 bg-gray-800/30 p-3 sm:col-span-2 sm:grid-cols-4">
                    <p className="col-span-2 text-xs text-gray-400 sm:col-span-4">Cita para ir a cerrarlo (opcional)</p>
                    <input
                      type="date"
                      aria-label="Fecha de la cita"
                      className={inputClass}
                      value={form.meetingDate}
                      onChange={(e) => set('meetingDate', e.target.value)}
                    />
                    <input
                      type="time"
                      aria-label="Hora de la cita"
                      className={inputClass}
                      value={form.meetingTime}
                      onChange={(e) => set('meetingTime', e.target.value)}
                    />
                    <input
                      aria-label="Lugar de la cita"
                      className={`${inputClass} col-span-2`}
                      value={form.meetingPlace}
                      onChange={(e) => set('meetingPlace', e.target.value)}
                      placeholder="Dónde (el local, una dirección…)"
                    />
                  </div>
                )}
                <Field label="Layout">
                  <select className={inputClass} value={form.layout} onChange={(e) => set('layout', e.target.value as LayoutVariant)}>
                    {LAYOUTS.map((l) => (
                      <option key={l} value={l}>
                        {LAYOUT_META[l].label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Precio cerrado (€)" error={errors.price} hint={form.status === 'planeado' ? 'Opcional hasta cerrarlo.' : undefined}>
                  <input
                    className={inputClass}
                    inputMode="decimal"
                    value={form.price}
                    onChange={(e) => set('price', e.target.value)}
                    placeholder="700"
                  />
                </Field>
                <Field label="Dominio" hint="Opcional.">
                  <input className={inputClass} value={form.domain} onChange={(e) => set('domain', e.target.value)} placeholder="barberiaelfaro.es" />
                </Field>
                <Field label="business_id (opcional)" hint="Solo si su web vive como negocio en un SaaS." error={errors.businessId}>
                  <input
                    className={`${inputClass} font-mono`}
                    value={form.businessId}
                    onChange={(e) => set('businessId', e.target.value)}
                    placeholder="00000000-0000-…"
                  />
                </Field>
              </>
            ) : (
              <>
                <Field label="Repositorio de GitHub" hint="organización/repositorio del core." error={errors.repo}>
                  <input
                    className={`${inputClass} font-mono`}
                    value={form.repo}
                    onChange={(e) => set('repo', e.target.value)}
                    placeholder="agencia/saas-restaurantes"
                  />
                </Field>
                <Field label="URL del Supabase del SaaS" hint="La BD donde viven los negocios (businesses)." error={errors.supabaseUrl}>
                  <input
                    className={`${inputClass} font-mono`}
                    value={form.supabaseUrl}
                    onChange={(e) => set('supabaseUrl', e.target.value)}
                    placeholder="https://abcd1234.supabase.co"
                  />
                </Field>
                <Field label="Proyecto de Vercel">
                  <input
                    className={`${inputClass} font-mono`}
                    value={form.vercelProject}
                    onChange={(e) => set('vercelProject', e.target.value)}
                    placeholder="saas-restaurantes"
                  />
                </Field>
                <Field
                  label="Sufijo de las previews"
                  hint={`Cada tenant: <slug>-${form.vercelAppSuffix || 'sufijo'}.vercel.app`}
                  error={errors.vercelAppSuffix}
                >
                  <input
                    className={`${inputClass} font-mono`}
                    value={form.vercelAppSuffix}
                    onChange={(e) => set('vercelAppSuffix', e.target.value.toLowerCase())}
                    placeholder="rest"
                  />
                </Field>
              </>
            )}

            <Field label={saas ? 'Responsable del producto' : 'Cerró la venta'}>
              <select className={inputClass} value={form.closedBy} onChange={(e) => set('closedBy', e.target.value as PartnerId)}>
                {MOCK_PARTNERS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Auditoría, seguridad y SEO">
              <select className={inputClass} value={form.auditBy} onChange={(e) => set('auditBy', e.target.value as PartnerId)}>
                {MOCK_PARTNERS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </Field>
            {saas && (
              <p className="rounded-xl bg-indigo-500/10 px-3 py-2.5 text-xs text-indigo-200 sm:col-span-2">
                Al crearlo se abre su pestaña <strong>Configuración</strong> para completar las conexiones (secretos, IDs de Vercel, DNS). Después los
                negocios se dan de alta desde <strong>Tenants</strong>.
              </p>
            )}
          </div>

          <footer className="flex justify-end gap-2 border-t border-gray-800 px-5 py-4">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-800">
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 hover:from-indigo-500 hover:to-purple-500"
            >
              Crear proyecto
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
