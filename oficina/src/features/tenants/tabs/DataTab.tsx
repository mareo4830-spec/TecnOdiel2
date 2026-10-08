import { LoaderCircle, Lock, Save, Wand2 } from 'lucide-react';
import { useState } from 'react';
import type { DnsProviderId, OpeningHours, Tenant, TenantBusinessType, TenantSocials } from '../../../types';
import { useProject } from '../../projects/projectService';
import { HoursEditor } from '../components/HoursEditor';
import { LayoutPicker } from '../components/LayoutPicker';
import { Field, inputClass } from '../components/TenantBits';
import { lookupPlace } from '../provisioningClient';
import { DNS_PROVIDER_META, MAX_LABEL, previewHostFor, SOCIAL_META, SOCIALS, TENANT_TYPES, TENANT_TYPE_META } from '../tenantMeta';
import {
  isDomainTaken,
  isSlugTaken,
  isValidDomain,
  isValidSlug,
  normalizeDomain,
  patchIntegration,
  saveContact,
  updateTenant,
  usePlans,
  useTenantContact,
  useTenantIntegrations,
} from '../tenantService';
import { Card } from './shared';

type Errors = Record<string, string>;

function ContactCard({ tenantId }: { tenantId: string }) {
  const contact = useTenantContact(tenantId);
  const [form, setForm] = useState({
    fullName: contact?.fullName ?? '',
    nif: contact?.nif ?? '',
    legalEmail: contact?.legalEmail ?? '',
    billingEmail: contact?.billingEmail ?? '',
    phone: contact?.phone ?? '',
    fiscalAddress: contact?.fiscalAddress ?? '',
  });
  const [saved, setSaved] = useState(false);
  const fields = [
    ['fullName', 'Nombre y apellidos'],
    ['nif', 'NIF / CIF'],
    ['legalEmail', 'Email legal'],
    ['billingEmail', 'Email de facturación'],
    ['phone', 'Teléfono'],
    ['fiscalAddress', 'Dirección fiscal'],
  ] as const;

  const save = () => {
    saveContact(tenantId, Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim() || null])) as never);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card
      title="Cliente"
      action={
        <span className="inline-flex items-center gap-1 text-[11px] text-gray-500">
          <Lock className="h-3 w-3" /> Solo admin
        </span>
      }
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {fields.map(([key, label]) => (
          <Field key={key} label={label}>
            <input className={inputClass} value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} />
          </Field>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-end gap-3">
        {saved && <span className="text-xs text-emerald-400">Guardado</span>}
        <button onClick={save} className="inline-flex h-9 items-center gap-2 rounded-xl bg-indigo-600 px-3 text-sm font-semibold text-white hover:bg-indigo-500">
          <Save className="h-4 w-4" /> Guardar cliente
        </button>
      </div>
    </Card>
  );
}

/** Edición de los datos del tenant. Tras provisionar, los cambios se aplican en el SaaS al re-provisionar. */
export function DataTab({ tenant }: { tenant: Tenant }) {
  const plans = usePlans();
  const [form, setForm] = useState({
    name: tenant.name,
    slug: tenant.slug,
    tagline: tenant.tagline ?? '',
    logoUrl: tenant.logoUrl ?? '',
    businessType: tenant.businessType,
    googleMapsUrl: tenant.googleMapsUrl ?? '',
    address: tenant.address ?? '',
    lat: tenant.lat === null ? '' : String(tenant.lat),
    lng: tenant.lng === null ? '' : String(tenant.lng),
    openingHours: (tenant.openingHours ?? {}) as OpeningHours,
    domain: tenant.domain ?? '',
    dnsProvider: (tenant.dnsProvider ?? '') as DnsProviderId | '',
    layout: tenant.layout,
    layoutVariant: tenant.layoutVariant,
    planId: tenant.planId,
    phone: tenant.phone ?? '',
    whatsapp: tenant.whatsapp ?? '',
    publicEmail: tenant.publicEmail ?? '',
    socials: tenant.socials as TenantSocials,
  });
  const project = useProject(tenant.projectId);
  const integrations = useTenantIntegrations(tenant.id);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'saved' | 'looking'>('idle');
  const provisioned = integrations.supabase.status === 'ok';
  const nextPreviewHost = previewHostFor(form.slug, project?.saas);
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  const autocomplete = async () => {
    setStatus('looking');
    try {
      const place = await lookupPlace(form.googleMapsUrl.trim(), form.name);
      setForm((f) => ({ ...f, address: place.address, lat: String(place.lat), lng: String(place.lng), openingHours: place.openingHours ?? f.openingHours }));
      setErrors({});
    } catch (e) {
      setErrors({ maps: e instanceof Error ? e.message : 'No se pudo autocompletar' });
    }
    setStatus('idle');
  };

  const save = () => {
    const e: Errors = {};
    const domain = normalizeDomain(form.domain);
    if (!form.name.trim()) e.name = 'Obligatorio.';
    if (!isValidSlug(form.slug)) e.slug = 'Slug no válido.';
    else if (isSlugTaken(form.slug, tenant.id)) e.slug = 'Ya existe.';
    else if (nextPreviewHost.split('.')[0].length > MAX_LABEL) e.slug = 'Demasiado largo para el host de preview.';
    if (form.publicEmail.trim() && !/^\S+@\S+\.\S+$/.test(form.publicEmail.trim())) e.publicEmail = 'Email no válido.';
    if (form.socials.google?.trim() && !/^https:\/\//.test(form.socials.google.trim())) e.google = 'Debe ser https://';
    if (form.logoUrl && !/^https:\/\//.test(form.logoUrl)) e.logoUrl = 'Debe ser https://';
    if (domain && !isValidDomain(domain)) e.domain = 'Dominio no válido.';
    else if (domain && isDomainTaken(domain, tenant.id)) e.domain = 'Otro tenant lo usa.';
    setErrors(e);
    if (Object.keys(e).length) return;
    try {
      updateTenant(tenant.id, {
        name: form.name.trim(),
        slug: form.slug,
        tagline: form.tagline.trim() || null,
        logoUrl: form.logoUrl.trim() || null,
        businessType: form.businessType,
        googleMapsUrl: form.googleMapsUrl.trim() || null,
        address: form.address.trim() || null,
        lat: form.lat ? Number(form.lat) : null,
        lng: form.lng ? Number(form.lng) : null,
        openingHours: Object.keys(form.openingHours).length ? form.openingHours : null,
        domain: domain || null,
        dnsProvider: form.dnsProvider || null,
        layout: form.layout,
        layoutVariant: form.layoutVariant,
        planId: form.planId,
        phone: form.phone.trim() || null,
        whatsapp: form.whatsapp.trim() || null,
        publicEmail: form.publicEmail.trim() || null,
        socials: Object.fromEntries(Object.entries(form.socials).filter(([, v]) => v?.trim()).map(([k, v]) => [k, v!.trim()])),
        // El host de preview sigue al slug; el paso preview lo da de alta en Vercel al volver a lanzarlo.
        ...(form.slug !== tenant.slug ? { previewHost: nextPreviewHost } : {}),
      });
      if (form.slug !== tenant.slug) patchIntegration(tenant.id, 'preview', { status: 'pending', error: null });
      setStatus('saved');
      window.setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      setErrors({ save: err instanceof Error ? err.message : 'No se pudo guardar' });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {provisioned && (
        <p className="rounded-xl bg-sky-500/10 px-3 py-2 text-sm text-sky-200">
          Este tenant ya está en el SaaS: los cambios se aplican allí al volver a provisionar (el orquestador actualiza el negocio sin duplicarlo).
          Cambiar slug o dominio crea las entradas nuevas en Vercel y DNS.
        </p>
      )}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-2">
        <Card title="Negocio">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Nombre" error={errors.name}>
              <input className={inputClass} value={form.name} onChange={(e) => set('name', e.target.value)} />
            </Field>
            <Field label="Slug" error={errors.slug} hint={form.slug !== tenant.slug ? `Nueva preview: ${nextPreviewHost}` : `Preview: ${tenant.previewHost ?? '—'}`}>
              <input className={`${inputClass} font-mono`} value={form.slug} onChange={(e) => set('slug', e.target.value.toLowerCase())} />
            </Field>
            <Field label="Eslogan">
              <input className={inputClass} value={form.tagline} onChange={(e) => set('tagline', e.target.value)} />
            </Field>
            <Field label="Logo (URL)" error={errors.logoUrl}>
              <input className={inputClass} value={form.logoUrl} onChange={(e) => set('logoUrl', e.target.value)} />
            </Field>
            <Field label="Tipo">
              <select className={inputClass} value={form.businessType ?? ''} onChange={(e) => set('businessType', (e.target.value || null) as TenantBusinessType | null)}>
                <option value="">—</option>
                {TENANT_TYPES.map((t) => (
                  <option key={t} value={t}>{TENANT_TYPE_META[t].label}</option>
                ))}
              </select>
            </Field>
            <Field label="Plan">
              <select className={inputClass} value={form.planId ?? ''} onChange={(e) => set('planId', e.target.value || null)}>
                <option value="">—</option>
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Dominio" error={errors.domain}>
              <input className={`${inputClass} font-mono`} value={form.domain} onChange={(e) => set('domain', e.target.value)} onBlur={() => set('domain', normalizeDomain(form.domain))} />
            </Field>
            <Field label="DNS">
              <select className={inputClass} value={form.dnsProvider} onChange={(e) => set('dnsProvider', e.target.value as DnsProviderId | '')}>
                {(Object.keys(DNS_PROVIDER_META) as DnsProviderId[]).map((d) => (
                  <option key={d} value={d}>{DNS_PROVIDER_META[d].label}</option>
                ))}
                <option value="">Otro (manual)</option>
              </select>
            </Field>
          </div>
        </Card>

        <Card title="Ubicación y horario">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <Field label="URL de Google Maps" error={errors.maps} className="flex-1">
              <input className={inputClass} value={form.googleMapsUrl} onChange={(e) => set('googleMapsUrl', e.target.value)} />
            </Field>
            <button
              type="button"
              onClick={autocomplete}
              disabled={!form.googleMapsUrl.trim() || status === 'looking'}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gray-800 px-3 text-sm font-medium text-gray-200 hover:bg-gray-700 disabled:opacity-50"
            >
              {status === 'looking' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              Autocompletar
            </button>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-4">
            <Field label="Dirección" className="sm:col-span-2">
              <input className={inputClass} value={form.address} onChange={(e) => set('address', e.target.value)} />
            </Field>
            <Field label="Latitud">
              <input className={inputClass} inputMode="decimal" value={form.lat} onChange={(e) => set('lat', e.target.value)} />
            </Field>
            <Field label="Longitud">
              <input className={inputClass} inputMode="decimal" value={form.lng} onChange={(e) => set('lng', e.target.value)} />
            </Field>
          </div>
          <div className="mt-3">
            <HoursEditor value={form.openingHours} onChange={(h) => set('openingHours', h)} />
          </div>
        </Card>
      </div>

      <Card title="Contacto público y redes">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field label="Teléfono del local">
            <input className={inputClass} value={form.phone} onChange={(e) => set('phone', e.target.value)} inputMode="tel" />
          </Field>
          <Field label="WhatsApp">
            <input className={inputClass} value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} inputMode="tel" />
          </Field>
          <Field label="Email público" error={errors.publicEmail}>
            <input className={inputClass} value={form.publicEmail} onChange={(e) => set('publicEmail', e.target.value)} inputMode="email" />
          </Field>
          {SOCIALS.map((n) => (
            <Field key={n} label={SOCIAL_META[n].label} error={errors[n]}>
              <input
                className={inputClass}
                value={form.socials[n] ?? ''}
                onChange={(e) => set('socials', { ...form.socials, [n]: e.target.value })}
                placeholder={SOCIAL_META[n].placeholder}
              />
            </Field>
          ))}
        </div>
      </Card>

      <Card title="Web">
        <LayoutPicker
          layout={form.layout}
          variant={form.layoutVariant}
          name={form.name}
          tagline={form.tagline || null}
          onChange={(l, v) => setForm((f) => ({ ...f, layout: l, layoutVariant: v }))}
        />
      </Card>

      <div className="flex items-center justify-end gap-3">
        {errors.save && <span className="text-sm text-rose-300">{errors.save}</span>}
        {status === 'saved' && <span className="text-sm text-emerald-400">Cambios guardados</span>}
        <button onClick={save} className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 text-sm font-semibold text-white hover:from-indigo-500 hover:to-purple-500">
          <Save className="h-4 w-4" /> Guardar datos
        </button>
      </div>

      <ContactCard tenantId={tenant.id} />
    </div>
  );
}
