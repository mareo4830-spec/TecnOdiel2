import { ArrowLeft, ArrowRight, Check, Eye, LoaderCircle, MapPin, RefreshCw, Save, Search, Wand2 } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { formatEuros } from '../../lib/format';
import type {
  DnsProviderId,
  LayoutVariant,
  OpeningHours,
  PaymentMode,
  TenantBusinessType,
  TenantRequirement,
  TenantSocials,
  WorkStage,
} from '../../types';
import { useAuth } from '../auth/authContext';
import { STATUS_META } from '../projects/projectMeta';
import { useProject } from '../projects/projectService';
import { lookupSaasBusiness, type SaasBusinessSummary } from '../projects/saasProjectClient';
import { hoursSummary, HoursEditor } from './components/HoursEditor';
import { LayoutPicker } from './components/LayoutPicker';
import { SitePreview } from './components/SitePreview';
import { Field, inputClass, RequirementsChecklist } from './components/TenantBits';
import { createPreview, lookupPlace } from './provisioningClient';
import {
  DNS_PROVIDER_META,
  FEATURE_LABEL,
  MAX_LABEL,
  SOCIAL_META,
  SOCIALS,
  TENANT_TYPE_META,
  TENANT_TYPES,
  effectiveVariant,
  previewHostFor,
} from './tenantMeta';
import {
  createTenant,
  isBusinessIdTaken,
  isDomainTaken,
  isSlugTaken,
  isValidDomain,
  isValidSlug,
  isValidUuid,
  normalizeDomain,
  previewMissing,
  slugify,
  usePlans,
} from './tenantService';

const STEPS = [
  { id: 'negocio', label: 'Negocio', essential: true },
  { id: 'diseno', label: 'Diseño y plan', essential: true },
  { id: 'contacto', label: 'Contacto y redes', essential: false },
  { id: 'ubicacion', label: 'Ubicación y horario', essential: false },
  { id: 'dominio', label: 'Dominio y cobro', essential: false },
  { id: 'resumen', label: 'Resumen', essential: true },
] as const;

type Errors = Record<string, string>;
type BusinessMode = 'new' | 'link';

const emptyContact = { fullName: '', nif: '', legalEmail: '', billingEmail: '', phone: '', fiscalAddress: '' };
const EMAIL_RE = /^\S+@\S+\.\S+$/;
const PHONE_RE = /^\+?[\d\s()-]{6,20}$/;

function Section({ title, description, badge, children }: { title: string; description?: string; badge?: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
          {title}
          {badge && <span className="rounded-md bg-gray-800 px-1.5 py-0.5 text-[11px] font-medium text-gray-400">{badge}</span>}
        </h2>
        {description && <p className="mt-0.5 text-sm text-gray-400">{description}</p>}
      </div>
      {children}
    </section>
  );
}

export function TenantWizardPage() {
  const { projectId } = useParams();
  const project = useProject(projectId);
  const { partner } = useAuth();
  const navigate = useNavigate();
  const plans = usePlans();
  const cfg = project?.saas ?? null;

  const [step, setStep] = useState(0);
  const [visited, setVisited] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  // 1. Negocio (esencial)
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [businessType, setBusinessType] = useState<TenantBusinessType | null>(null);
  const [businessMode, setBusinessMode] = useState<BusinessMode>('new');
  const [newBusinessId] = useState(() => crypto.randomUUID());
  const [linkedId, setLinkedId] = useState('');
  const [linkCheck, setLinkCheck] = useState<{
    state: 'idle' | 'loading' | 'found' | 'missing' | 'error';
    business?: SaasBusinessSummary;
    message?: string;
  }>({
    state: 'idle',
  });
  const [stage, setStage] = useState<WorkStage>('en_progreso');
  const [meeting, setMeeting] = useState({ date: '', time: '', place: '' });
  // 2. Diseño y plan (esencial)
  const [layout, setLayout] = useState<LayoutVariant | null>(null);
  const [variant, setVariant] = useState<string | null>(null);
  const [tagline, setTagline] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [planId, setPlanId] = useState<string | null>(null);
  // 3. Contacto y redes (opcional)
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [publicEmail, setPublicEmail] = useState('');
  const [socials, setSocials] = useState<TenantSocials>({});
  const [contact, setContact] = useState(emptyContact);
  // 4. Ubicación y horario (opcional)
  const [mapsUrl, setMapsUrl] = useState('');
  const [placeId, setPlaceId] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [hours, setHours] = useState<OpeningHours>({});
  const [lookup, setLookup] = useState<{ state: 'idle' | 'loading' | 'done' | 'error'; message?: string }>({ state: 'idle' });
  // 5. Dominio y cobro (opcional)
  const [domain, setDomain] = useState('');
  const [dnsProvider, setDnsProvider] = useState<DnsProviderId | ''>(cfg?.defaultDnsProvider ?? 'cloudflare');
  const [price, setPrice] = useState('');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('split_50_50');
  const [maintenance, setMaintenance] = useState('50');
  // 6. Resumen
  const [previewNow, setPreviewNow] = useState(true);

  const plan = plans.find((p) => p.id === planId);
  const priceNum = price.trim() ? Number(price.replace(',', '.')) : null;
  const maintenanceNum = Number(maintenance.replace(',', '.'));
  const previewHost = previewHostFor(slug, cfg);
  const businessId = businessMode === 'new' ? newBusinessId : linkedId.trim().toLowerCase();

  const onName = (value: string) => {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const checkLinked = async () => {
    if (!project) return;
    const id = linkedId.trim().toLowerCase();
    if (!isValidUuid(id)) {
      setLinkCheck({ state: 'error', message: 'Debe ser un UUID (00000000-0000-0000-0000-000000000000).' });
      return;
    }
    setLinkCheck({ state: 'loading' });
    try {
      const business = await lookupSaasBusiness(project, id);
      if (!business) {
        setLinkCheck({ state: 'missing', message: 'No existe ningún negocio con ese business_id en la BD del SaaS.' });
        return;
      }
      setLinkCheck({ state: 'found', business });
      // Prellenar lo que está vacío con lo que ya tiene el negocio.
      if (!name.trim()) onName(business.name);
      if (!slugTouched && !slug) setSlug(business.slug);
      if (!layout && business.layoutKey && ['classic', 'editorial', 'minimal', 'playful'].includes(business.layoutKey)) {
        setLayout(business.layoutKey as LayoutVariant);
      }
    } catch (e) {
      setLinkCheck({ state: 'error', message: e instanceof Error ? e.message : 'No se pudo consultar el SaaS' });
    }
  };

  const autocomplete = async () => {
    setLookup({ state: 'loading' });
    try {
      const place = await lookupPlace(mapsUrl.trim(), name);
      setPlaceId(place.placeId);
      setAddress(place.address);
      setLat(String(place.lat));
      setLng(String(place.lng));
      if (place.openingHours) setHours(place.openingHours);
      setLookup({ state: 'done', message: `Encontrado: ${place.name} · revisa y ajusta lo que haga falta` });
    } catch (e) {
      setLookup({ state: 'error', message: e instanceof Error ? e.message : 'No se pudo autocompletar' });
    }
  };

  /** Validación del paso `i`; devuelve los errores (vacío = correcto). */
  const validate = (i: number): Errors => {
    const e: Errors = {};
    if (i === 0) {
      if (!name.trim()) e.name = 'Indica el nombre del negocio.';
      if (!isValidSlug(slug)) e.slug = 'Solo minúsculas, números y guiones (sin guion al principio ni al final).';
      else if (isSlugTaken(slug)) e.slug = 'Ya hay un tenant con este slug.';
      else if (previewHost.split('.')[0].length > MAX_LABEL) e.slug = `El host de preview supera ${MAX_LABEL} caracteres: acorta el slug.`;
      if (!businessType) e.businessType = 'Elige el tipo de negocio.';
      if (businessMode === 'link') {
        if (!isValidUuid(linkedId)) e.businessId = 'Pega el business_id (UUID) del negocio.';
        else if (isBusinessIdTaken(linkedId)) e.businessId = 'Ese business_id ya está vinculado a otro tenant.';
        else if (linkCheck.state !== 'found' || linkCheck.business?.id !== linkedId.trim().toLowerCase())
          e.businessId = 'Pulsa «Comprobar» para verificar que existe en el SaaS.';
      }
      if (stage === 'planeado' && (meeting.time || meeting.place) && !meeting.date) e.meeting = 'Pon la fecha de la cita.';
    }
    if (i === 1) {
      if (!layout) e.layout = 'Elige el layout de la web.';
      if (!planId) e.plan = 'Elige un plan.';
      if (logoUrl.trim() && !/^https:\/\//.test(logoUrl.trim())) e.logoUrl = 'Debe ser una URL https://';
    }
    if (i === 2) {
      if (phone.trim() && !PHONE_RE.test(phone.trim())) e.phone = 'Teléfono no válido.';
      if (whatsapp.trim() && !PHONE_RE.test(whatsapp.trim())) e.whatsapp = 'Teléfono no válido.';
      if (publicEmail.trim() && !EMAIL_RE.test(publicEmail.trim())) e.publicEmail = 'Email no válido.';
      if (contact.legalEmail && !EMAIL_RE.test(contact.legalEmail)) e.legalEmail = 'Email no válido.';
      if (contact.billingEmail && !EMAIL_RE.test(contact.billingEmail)) e.billingEmail = 'Email no válido.';
      if (socials.google?.trim() && !/^https:\/\//.test(socials.google.trim())) e.google = 'Pega el enlace https:// de reseñas.';
    }
    if (i === 3) {
      if (Object.values(hours).some((r) => r?.some(([a, b]) => !a || !b || a >= b)))
        e.hours = 'Revisa los tramos: la apertura debe ser anterior al cierre.';
      if ((lat && !Number.isFinite(Number(lat))) || (lng && !Number.isFinite(Number(lng)))) e.coords = 'Coordenadas no válidas.';
    }
    if (i === 4) {
      const d = normalizeDomain(domain);
      if (d && !isValidDomain(d)) e.domain = 'Dominio no válido (ej. salonaurora.es).';
      else if (d && isDomainTaken(d)) e.domain = 'Otro tenant ya usa este dominio.';
      if (priceNum !== null && (!Number.isFinite(priceNum) || priceNum <= 0)) e.price = 'Precio no válido (o déjalo vacío).';
      if (priceNum !== null && (!Number.isFinite(maintenanceNum) || maintenanceNum < 0)) e.maintenance = 'Importe no válido.';
    }
    return e;
  };

  const go = (target: number) => {
    // Hacia delante solo si los pasos intermedios son válidos.
    for (let i = step; i < target; i++) {
      const e = validate(i);
      if (Object.keys(e).length) {
        setErrors(e);
        setStep(i);
        return;
      }
    }
    setErrors({});
    setStep(target);
    setVisited((v) => Math.max(v, target));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Lo que faltará para salir a producción (se puede completar después desde la ficha).
  const missing = useMemo<TenantRequirement[]>(() => {
    const m: TenantRequirement[] = [];
    if (!name.trim()) m.push('name');
    if (!businessType) m.push('business_type');
    if (!layout) m.push('layout');
    if (!planId) m.push('plan');
    if (!isValidDomain(normalizeDomain(domain))) m.push('domain');
    if (!Object.values(hours).some((r) => r?.length)) m.push('opening_hours');
    if (!address.trim()) m.push('address');
    m.push('payment');
    return m;
  }, [name, businessType, layout, planId, domain, hours, address]);

  const siteData = useMemo(
    () => ({
      name,
      tagline: tagline || null,
      logoUrl: /^https:\/\//.test(logoUrl.trim()) ? logoUrl.trim() : null,
      businessType,
      layout,
      layoutVariant: variant,
      address: address || null,
      openingHours: Object.keys(hours).length ? hours : null,
      phone: phone || null,
      whatsapp: whatsapp || null,
      publicEmail: publicEmail || null,
      socials,
      domain: normalizeDomain(domain) || null,
      previewHost,
    }),
    [name, tagline, logoUrl, businessType, layout, variant, address, hours, phone, whatsapp, publicEmail, socials, domain, previewHost],
  );

  const save = async () => {
    if (!partner || !project) return;
    for (let i = 0; i < 5; i++) {
      const e = validate(i);
      if (Object.keys(e).length) {
        setErrors(e);
        setStep(i);
        return;
      }
    }
    setSaving(true);
    try {
      const clean = Object.fromEntries(Object.entries(contact).map(([k, v]) => [k, v.trim() || null])) as Record<
        keyof typeof emptyContact,
        string | null
      >;
      const cleanSocials = Object.fromEntries(
        Object.entries(socials)
          .filter(([, v]) => v?.trim())
          .map(([k, v]) => [k, v!.trim()]),
      ) as TenantSocials;
      const tenant = createTenant(
        {
          tenant: {
            projectId: project.id,
            saasBusinessId: businessId,
            stage,
            meeting: stage === 'planeado' && meeting.date ? { date: meeting.date, time: meeting.time || null, place: meeting.place.trim() } : null,
            name: name.trim(),
            slug,
            tagline: tagline.trim() || null,
            logoUrl: logoUrl.trim() || null,
            businessType,
            layout,
            layoutVariant: variant,
            planId,
            googleMapsUrl: mapsUrl.trim() || null,
            googlePlaceId: placeId,
            openingHours: Object.keys(hours).length ? hours : null,
            address: address.trim() || null,
            lat: lat ? Number(lat) : null,
            lng: lng ? Number(lng) : null,
            domain: normalizeDomain(domain) || null,
            dnsProvider: dnsProvider || null,
            previewHost,
            phone: phone.trim() || null,
            whatsapp: whatsapp.trim() || null,
            publicEmail: publicEmail.trim() || null,
            socials: cleanSocials,
          },
          contact: Object.values(clean).some(Boolean) ? clean : null,
          billing: priceNum !== null ? { closedPrice: priceNum, paymentMode, maintenanceYearly: maintenanceNum } : null,
        },
        partner.id,
      );
      // La preview se crea en segundo plano: la ficha muestra el avance.
      if (previewNow && !previewMissing(tenant).length) void createPreview(tenant.id, partner.id).catch(() => undefined);
      navigate(`/proyectos/${project.id}/tenants/${tenant.id}?tab=${previewNow ? 'preview' : 'resumen'}`);
    } catch (e) {
      setErrors({ save: e instanceof Error ? e.message : 'No se pudo guardar' });
      setSaving(false);
    }
  };

  if (!project || project.kind !== 'saas') {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-gray-800 px-6 py-14 text-center">
        <p className="font-medium text-gray-200">Los tenants solo existen en proyectos SaaS Multi-Tenant</p>
        <Link to="/proyectos" className="mt-4 inline-flex items-center gap-2 text-sm text-indigo-300 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Volver a Proyectos
        </Link>
      </div>
    );
  }

  const half = priceNum ? Math.round((priceNum / 2) * 100) / 100 : 0;

  return (
    <div className="mx-auto max-w-[1400px] space-y-5">
      <Link to={`/proyectos/${project.id}`} className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> {project.name}
      </Link>

      <header className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white sm:text-2xl">Nuevo tenant</h1>
          <p className="text-sm text-gray-400">Lo esencial son los dos primeros pasos; el resto se puede completar después desde la ficha.</p>
        </div>
        <p className="font-mono text-xs text-indigo-300">https://{previewHost}</p>
      </header>

      <nav aria-label="Pasos" className="no-scrollbar -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <ol className="flex w-max gap-1 rounded-2xl border border-gray-800 bg-gray-900 p-1 sm:w-full">
          {STEPS.map((s, i) => {
            const done = i < step;
            const reachable = i <= visited;
            return (
              <li key={s.id} className="sm:flex-1">
                <button
                  type="button"
                  onClick={() => reachable && go(i)}
                  disabled={!reachable}
                  aria-current={i === step ? 'step' : undefined}
                  className={`flex w-full items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition ${
                    i === step ? 'bg-indigo-600 text-white' : reachable ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600'
                  }`}
                >
                  <span
                    className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] ${done ? 'bg-emerald-500 text-gray-950' : i === step ? 'bg-white/20' : 'bg-gray-800'}`}
                  >
                    {done ? <Check className="h-3 w-3" /> : i + 1}
                  </span>
                  {s.label}
                  {!s.essential && <span className="text-[10px] font-normal opacity-60">opcional</span>}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-5">
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4 sm:p-6">
            {step === 0 && (
              <Section
                title="Negocio"
                badge="esencial"
                description="Nombre, subdominio de preview, tipo y a qué negocio de la BD del SaaS se enlaza."
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Nombre del negocio" error={errors.name}>
                    <input className={inputClass} value={name} onChange={(e) => onName(e.target.value)} placeholder="Salón Aurora" autoFocus />
                  </Field>
                  <Field label="Slug" error={errors.slug} hint={`Preview en Vercel: ${previewHost}`}>
                    <input
                      className={`${inputClass} font-mono`}
                      value={slug}
                      onChange={(e) => {
                        setSlugTouched(true);
                        setSlug(e.target.value.toLowerCase());
                      }}
                      placeholder="salon-aurora"
                    />
                  </Field>
                </div>

                <fieldset>
                  <legend className="mb-1.5 text-sm font-medium text-gray-300">Tipo de negocio</legend>
                  <div role="radiogroup" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {TENANT_TYPES.map((t) => {
                      const meta = TENANT_TYPE_META[t];
                      const Icon = meta.icon;
                      return (
                        <button
                          key={t}
                          type="button"
                          role="radio"
                          aria-checked={businessType === t}
                          onClick={() => setBusinessType(t)}
                          className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                            businessType === t
                              ? 'border-indigo-500 bg-indigo-500/10 text-white'
                              : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                          }`}
                        >
                          <span className={`grid h-7 w-7 place-items-center rounded-lg ${meta.tint}`}>
                            <Icon className="h-4 w-4" />
                          </span>
                          {meta.label}
                        </button>
                      );
                    })}
                  </div>
                  {errors.businessType && <p className="mt-1 text-xs text-rose-400">{errors.businessType}</p>}
                </fieldset>

                <fieldset className="rounded-xl border border-gray-800 bg-gray-800/20 p-3 sm:p-4">
                  <legend className="px-1 text-sm font-medium text-gray-300">business_id en la BD del SaaS</legend>
                  <div role="radiogroup" className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {(
                      [
                        ['new', 'Negocio nuevo', 'Se crea en businesses con este id al generar la preview.'],
                        ['link', 'Vincular uno existente', 'El negocio ya está en la BD: se enlaza y se actualiza.'],
                      ] as [BusinessMode, string, string][]
                    ).map(([mode, label, desc]) => (
                      <button
                        key={mode}
                        type="button"
                        role="radio"
                        aria-checked={businessMode === mode}
                        onClick={() => setBusinessMode(mode)}
                        className={`rounded-xl border p-3 text-left transition ${businessMode === mode ? 'border-indigo-500 bg-indigo-500/10' : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'}`}
                      >
                        <span className="block text-sm font-semibold text-white">{label}</span>
                        <span className="block text-xs text-gray-400">{desc}</span>
                      </button>
                    ))}
                  </div>
                  {businessMode === 'new' ? (
                    <p className="mt-3 text-xs text-gray-400">
                      business_id: <code className="text-indigo-300">{newBusinessId}</code>
                    </p>
                  ) : (
                    <div className="mt-3 space-y-2">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
                        <Field label="business_id" error={errors.businessId} className="flex-1">
                          <input
                            className={`${inputClass} font-mono`}
                            value={linkedId}
                            onChange={(e) => {
                              setLinkedId(e.target.value);
                              setLinkCheck({ state: 'idle' });
                            }}
                            placeholder="00000000-0000-0000-0000-000000000000"
                          />
                        </Field>
                        <button
                          type="button"
                          onClick={checkLinked}
                          disabled={!linkedId.trim() || linkCheck.state === 'loading'}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-500 sm:mt-7"
                        >
                          {linkCheck.state === 'loading' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                          Comprobar
                        </button>
                      </div>
                      {linkCheck.state === 'found' && linkCheck.business && (
                        <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
                          Encontrado: <strong>{linkCheck.business.name}</strong> · {linkCheck.business.slug} · {linkCheck.business.status}
                        </p>
                      )}
                      {(linkCheck.state === 'missing' || linkCheck.state === 'error') && (
                        <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-xs text-rose-300">{linkCheck.message}</p>
                      )}
                    </div>
                  )}
                </fieldset>

                <fieldset>
                  <legend className="mb-1.5 text-sm font-medium text-gray-300">Etapa en el Kanban</legend>
                  <div role="radiogroup" className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {(['planeado', 'en_progreso'] as WorkStage[]).map((s) => (
                      <button
                        key={s}
                        type="button"
                        role="radio"
                        aria-checked={stage === s}
                        onClick={() => setStage(s)}
                        className={`rounded-xl border p-3 text-left transition ${stage === s ? 'border-indigo-500 bg-indigo-500/10' : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'}`}
                      >
                        <span className="block text-sm font-semibold text-white">{STATUS_META[s].label}</span>
                        <span className="block text-xs text-gray-400">{STATUS_META[s].hint}</span>
                      </button>
                    ))}
                  </div>
                  {stage === 'planeado' && (
                    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <input
                        type="date"
                        aria-label="Fecha de la cita"
                        className={inputClass}
                        value={meeting.date}
                        onChange={(e) => setMeeting((m) => ({ ...m, date: e.target.value }))}
                      />
                      <input
                        type="time"
                        aria-label="Hora de la cita"
                        className={inputClass}
                        value={meeting.time}
                        onChange={(e) => setMeeting((m) => ({ ...m, time: e.target.value }))}
                      />
                      <input
                        aria-label="Lugar de la cita"
                        className={`${inputClass} col-span-2`}
                        value={meeting.place}
                        onChange={(e) => setMeeting((m) => ({ ...m, place: e.target.value }))}
                        placeholder="Dónde vamos a cerrarlo"
                      />
                      {errors.meeting && <p className="col-span-full text-xs text-rose-400">{errors.meeting}</p>}
                    </div>
                  )}
                </fieldset>
              </Section>
            )}

            {step === 1 && (
              <Section
                title="Diseño y plan"
                badge="esencial"
                description="Layout y variante de la web (se ve en vivo a la derecha) y plan contratado."
              >
                <div>
                  <p className="mb-1.5 text-sm font-medium text-gray-300">Layout</p>
                  <LayoutPicker
                    layout={layout}
                    variant={variant}
                    name={name}
                    tagline={tagline || null}
                    onChange={(l, v) => {
                      setLayout(l);
                      setVariant(v);
                    }}
                  />
                  {errors.layout && <p className="mt-1 text-xs text-rose-400">{errors.layout}</p>}
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Eslogan (opcional)" hint="Bajo el nombre en la portada.">
                    <input
                      className={inputClass}
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="Tu salón de confianza en Huelva"
                    />
                  </Field>
                  <Field label="Logo (opcional)" error={errors.logoUrl} hint="URL https:// de una imagen cuadrada.">
                    <input className={inputClass} value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://…/logo.png" />
                  </Field>
                </div>
                <fieldset>
                  <legend className="mb-1.5 text-sm font-medium text-gray-300">Plan</legend>
                  <div role="radiogroup" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {plans.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        role="radio"
                        aria-checked={planId === p.id}
                        onClick={() => {
                          setPlanId(p.id);
                          setMaintenance(String(p.yearlyMaintenance));
                        }}
                        className={`rounded-xl border p-3 text-left transition ${planId === p.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'}`}
                      >
                        <span className="flex items-baseline justify-between">
                          <span className="font-semibold text-white">{p.name}</span>
                          <span className="text-sm text-gray-300">{formatEuros(p.setupPrice)}</span>
                        </span>
                        <span className="mt-0.5 block text-xs text-gray-400">
                          {formatEuros(p.yearlyMaintenance)}/año{p.monthlyAi ? ` + ${formatEuros(p.monthlyAi)}/mes IA` : ''}
                        </span>
                        <span className="mt-2 flex flex-wrap gap-1">
                          {Object.entries(p.features)
                            .filter(([, on]) => on)
                            .map(([k]) => (
                              <span key={k} className="rounded bg-gray-800 px-1.5 py-0.5 text-[10px] text-gray-300">
                                {FEATURE_LABEL[k] ?? k}
                              </span>
                            ))}
                        </span>
                      </button>
                    ))}
                  </div>
                  {errors.plan && <p className="mt-1 text-xs text-rose-400">{errors.plan}</p>}
                </fieldset>
              </Section>
            )}

            {step === 2 && (
              <Section
                title="Contacto y redes"
                badge="opcional"
                description="Lo público sale en la web; los datos del titular solo los ven los admin."
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Público (en la web)</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Field label="Teléfono del local" error={errors.phone}>
                    <input
                      className={inputClass}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+34 959 000 000"
                      inputMode="tel"
                    />
                  </Field>
                  <Field label="WhatsApp" error={errors.whatsapp}>
                    <input
                      className={inputClass}
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="+34 600 000 000"
                      inputMode="tel"
                    />
                  </Field>
                  <Field label="Email público" error={errors.publicEmail}>
                    <input
                      className={inputClass}
                      value={publicEmail}
                      onChange={(e) => setPublicEmail(e.target.value)}
                      placeholder="hola@negocio.es"
                      inputMode="email"
                    />
                  </Field>
                  {SOCIALS.map((s) => (
                    <Field key={s} label={SOCIAL_META[s].label} error={errors[s]}>
                      <input
                        className={inputClass}
                        value={socials[s] ?? ''}
                        onChange={(e) => setSocials((o) => ({ ...o, [s]: e.target.value }))}
                        placeholder={SOCIAL_META[s].placeholder}
                      />
                    </Field>
                  ))}
                </div>
                <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Titular (privado)</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {(
                    [
                      ['fullName', 'Nombre del cliente', 'Aurora Pérez Martín'],
                      ['phone', 'Teléfono personal', '+34 600 000 000'],
                      ['nif', 'NIF / CIF', '12345678Z'],
                      ['legalEmail', 'Email legal', 'titular@negocio.es'],
                      ['billingEmail', 'Email de facturación', 'facturas@negocio.es'],
                      ['fiscalAddress', 'Dirección fiscal', 'Si es distinta del local'],
                    ] as const
                  ).map(([key, label, placeholder]) => (
                    <Field key={key} label={label} error={errors[key]}>
                      <input
                        className={inputClass}
                        value={contact[key]}
                        onChange={(e) => setContact((c) => ({ ...c, [key]: e.target.value }))}
                        placeholder={placeholder}
                      />
                    </Field>
                  ))}
                </div>
              </Section>
            )}

            {step === 3 && (
              <Section
                title="Ubicación y horario"
                badge="opcional"
                description="Pega el enlace de Google Maps y autocompleta; hará falta para salir a producción."
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                  <Field label="URL de Google Maps" className="flex-1">
                    <input
                      className={inputClass}
                      value={mapsUrl}
                      onChange={(e) => setMapsUrl(e.target.value)}
                      placeholder="https://maps.app.goo.gl/…"
                    />
                  </Field>
                  <button
                    type="button"
                    onClick={autocomplete}
                    disabled={!mapsUrl.trim() || lookup.state === 'loading'}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-500"
                  >
                    {lookup.state === 'loading' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                    Autocompletar
                  </button>
                </div>
                {lookup.message && (
                  <p
                    className={`rounded-lg px-3 py-2 text-xs ${lookup.state === 'error' ? 'bg-rose-500/10 text-rose-300' : 'bg-emerald-500/10 text-emerald-300'}`}
                  >
                    {lookup.message}
                  </p>
                )}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                  <Field label="Dirección" className="sm:col-span-2">
                    <input
                      className={inputClass}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Calle Mayor 1, 21001 Huelva"
                    />
                  </Field>
                  <Field label="Latitud" error={errors.coords}>
                    <input className={inputClass} inputMode="decimal" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="37.2583" />
                  </Field>
                  <Field label="Longitud">
                    <input className={inputClass} inputMode="decimal" value={lng} onChange={(e) => setLng(e.target.value)} placeholder="-6.9508" />
                  </Field>
                </div>
                {placeId && (
                  <p className="flex items-center gap-1.5 text-xs text-gray-400">
                    <MapPin className="h-3.5 w-3.5" /> place_id: <code className="text-gray-300">{placeId}</code>
                  </p>
                )}
                <div>
                  <p className="mb-1.5 text-sm font-medium text-gray-300">Horario</p>
                  <HoursEditor value={hours} onChange={setHours} />
                  {errors.hours && <p className="mt-1 text-xs text-rose-400">{errors.hours}</p>}
                </div>
              </Section>
            )}

            {step === 4 && (
              <Section
                title="Dominio y cobro"
                badge="opcional"
                description="El dominio propio y el precio cerrado. Sin ellos la preview funciona; se piden para producción."
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Dominio del cliente" error={errors.domain} hint="Sin https:// ni www. Mientras tanto, la web vive en la preview.">
                    <input
                      className={`${inputClass} font-mono`}
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      onBlur={() => setDomain(normalizeDomain(domain))}
                      placeholder="salonaurora.es"
                    />
                  </Field>
                  <Field label="DNS del dominio">
                    <select className={inputClass} value={dnsProvider} onChange={(e) => setDnsProvider(e.target.value as DnsProviderId | '')}>
                      {(Object.keys(DNS_PROVIDER_META) as DnsProviderId[]).map((d) => (
                        <option key={d} value={d}>
                          {DNS_PROVIDER_META[d].label}
                        </option>
                      ))}
                      <option value="">Otro (manual)</option>
                    </select>
                  </Field>
                  <Field
                    label="Precio de cierre (€)"
                    error={errors.price}
                    hint={plan ? `Plan ${plan.name}: ${formatEuros(plan.setupPrice)}. Vacío = se pone después.` : 'Vacío = se pone después.'}
                  >
                    <input
                      className={inputClass}
                      inputMode="decimal"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder={plan ? String(plan.setupPrice) : '600'}
                    />
                  </Field>
                  <Field label="Mantenimiento anual (€)" error={errors.maintenance}>
                    <input className={inputClass} inputMode="decimal" value={maintenance} onChange={(e) => setMaintenance(e.target.value)} />
                  </Field>
                </div>
                {priceNum !== null && priceNum > 0 && (
                  <>
                    <div role="radiogroup" aria-label="Modalidad de pago" className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {(
                        [
                          ['split_50_50', '50 % + 50 %', 'Depósito al empezar y el resto al publicar.'],
                          ['single', 'Pago único', 'El 100 % al empezar.'],
                        ] as const
                      ).map(([mode, label, desc]) => (
                        <button
                          key={mode}
                          type="button"
                          role="radio"
                          aria-checked={paymentMode === mode}
                          onClick={() => setPaymentMode(mode)}
                          className={`rounded-xl border p-3 text-left transition ${paymentMode === mode ? 'border-indigo-500 bg-indigo-500/10' : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'}`}
                        >
                          <span className="block font-semibold text-white">{label}</span>
                          <span className="block text-xs text-gray-400">{desc}</span>
                        </button>
                      ))}
                    </div>
                    <ul className="space-y-1 rounded-xl border border-gray-800 bg-gray-800/30 p-3 text-sm">
                      {paymentMode === 'split_50_50' ? (
                        <>
                          <li className="flex justify-between">
                            <span className="text-gray-300">Depósito (vence hoy)</span>
                            <span className="tabular-nums text-white">{formatEuros(half)}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-gray-300">Pago final (al publicar)</span>
                            <span className="tabular-nums text-white">{formatEuros(priceNum - half)}</span>
                          </li>
                        </>
                      ) : (
                        <li className="flex justify-between">
                          <span className="text-gray-300">Pago único (vence hoy)</span>
                          <span className="tabular-nums text-white">{formatEuros(priceNum)}</span>
                        </li>
                      )}
                      <li className="flex justify-between">
                        <span className="text-gray-300">Mantenimiento anual (desde producción)</span>
                        <span className="tabular-nums text-white">{formatEuros(maintenanceNum || 0)}</span>
                      </li>
                    </ul>
                  </>
                )}
              </Section>
            )}

            {step === 5 && (
              <Section title="Resumen" description="Se guarda como borrador. La preview se crea en Vercel al guardar; producción, cuando esté todo.">
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  <dl className="space-y-2 text-sm">
                    {[
                      ['Negocio', `${name} · ${businessType ? TENANT_TYPE_META[businessType].label : '—'}`],
                      ['business_id', `${businessId}${businessMode === 'link' ? ' (vinculado)' : ' (nuevo)'}`],
                      ['Preview', previewHost],
                      [
                        'Etapa',
                        `${STATUS_META[stage].label}${stage === 'planeado' && meeting.date ? ` · cita ${meeting.date} ${meeting.time}` : ''}`,
                      ],
                      ['Layout', layout ? `${layout} · ${effectiveVariant(layout, variant).name}` : '—'],
                      ['Plan', plan ? `${plan.name} (${plan.saasPlanCode})` : '—'],
                      [
                        'Contacto',
                        [phone, whatsapp && 'WhatsApp', publicEmail, ...SOCIALS.filter((s) => socials[s]?.trim()).map((s) => SOCIAL_META[s].label)]
                          .filter(Boolean)
                          .join(' · ') || 'Pendiente',
                      ],
                      ['Titular', contact.fullName || 'Pendiente'],
                      [
                        'Horario',
                        hoursSummary(hours)
                          .filter((h) => h.hours !== 'Cerrado')
                          .map((h) => `${h.day.slice(0, 3)} ${h.hours}`)
                          .join(' · ') || 'Pendiente',
                      ],
                      ['Dominio', normalizeDomain(domain) || 'Pendiente'],
                      ['Cobro', priceNum ? `${formatEuros(priceNum)} · ${paymentMode === 'single' ? 'único' : '50/50'}` : 'Pendiente'],
                    ].map(([k, v]) => (
                      <div key={k} className="flex flex-col gap-0.5 border-b border-gray-800 pb-2 sm:flex-row sm:justify-between sm:gap-4">
                        <dt className="text-gray-400">{k}</dt>
                        <dd className={`break-all sm:text-right ${v === 'Pendiente' ? 'text-amber-300' : 'text-gray-100'}`}>{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 rounded-xl border border-indigo-500/40 bg-indigo-500/10 p-3">
                      <input
                        type="checkbox"
                        checked={previewNow}
                        onChange={(e) => setPreviewNow(e.target.checked)}
                        className="mt-1 h-4 w-4 accent-indigo-500"
                      />
                      <span>
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
                          <Eye className="h-4 w-4" /> Crear la preview al guardar
                        </span>
                        <span className="block text-xs text-indigo-200">
                          Da de alta el negocio en la BD del SaaS y añade <code>{previewHost}</code> al proyecto de Vercel.
                        </span>
                      </span>
                    </label>
                    <div className="rounded-xl border border-gray-800 bg-gray-800/30 p-4">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Para salir a producción</p>
                      <RequirementsChecklist missing={missing} />
                    </div>
                  </div>
                </div>
                {errors.save && <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{errors.save}</p>}
              </Section>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => go(Math.max(0, step - 1))}
              disabled={step === 0}
              className="inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-medium text-gray-300 hover:bg-gray-800 disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" />
              Anterior
            </button>
            <div className="flex gap-2">
              {step >= 2 && step < STEPS.length - 1 && (
                <button
                  type="button"
                  onClick={() => go(STEPS.length - 1)}
                  className="inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-medium text-indigo-300 hover:bg-gray-800"
                >
                  Saltar al resumen
                </button>
              )}
              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => go(step + 1)}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-500"
                >
                  Siguiente
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={save}
                  disabled={saving}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-60"
                >
                  {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {previewNow ? 'Guardar y crear preview' : 'Guardar borrador'}
                </button>
              )}
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-4 lg:self-start" aria-label="Vista previa en vivo">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Vista previa en vivo</p>
          <SitePreview data={siteData} compact />
        </aside>
      </div>
    </div>
  );
}
