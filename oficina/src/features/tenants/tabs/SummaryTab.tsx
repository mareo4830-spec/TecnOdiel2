import { ArrowRight, ExternalLink, Globe, MonitorSmartphone } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { PARTNER_META } from '../../../lib/partners';
import { formatEuros, formatShortDate } from '../../../lib/format';
import type { Tenant } from '../../../types';
import { hoursSummary } from '../components/HoursEditor';
import { RequirementsChecklist } from '../components/TenantBits';
import { DNS_PROVIDER_META, FEATURE_LABEL, INTEGRATION_STATUS_META, PROVIDERS, PROVIDER_META, TENANT_TYPE_META, effectiveVariant, SOCIAL_META, SOCIALS, socialUrl, tenantPreviewUrl } from '../tenantMeta';
import { useMissingRequirements, usePlans, useTenantBilling, useTenantIntegrations } from '../tenantService';
import { Card, Row } from './shared';

export function SummaryTab({ tenant, onGo }: { tenant: Tenant; onGo: (tab: string) => void }) {
  const missing = useMissingRequirements(tenant);
  const plan = usePlans().find((p) => p.id === tenant.planId);
  const billing = useTenantBilling(tenant.id);
  const integrations = useTenantIntegrations(tenant.id);
  const links = [
    { label: 'Dominio', url: tenant.domain ? `https://${tenant.domain}` : null, icon: Globe, note: tenant.status === 'live' ? 'En producción' : 'Activo tras el go-live' },
    {
      label: 'Preview',
      url: integrations.preview.status === 'ok' ? tenantPreviewUrl(tenant) : null,
      icon: MonitorSmartphone,
      note: integrations.preview.status === 'ok' ? 'Subdominio de pruebas en Vercel' : `${tenant.previewHost ?? 'Sin host'} · se crea desde la pestaña Preview`,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-3">
      <Card
        title="Checklist para producción"
        action={
          missing.length > 0 && (
            <button onClick={() => onGo(missing.includes('payment') && missing.length === 1 ? 'facturacion' : 'datos')} className="inline-flex items-center gap-1 text-xs font-medium text-indigo-300 hover:text-indigo-200">
              Completar <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )
        }
      >
        <RequirementsChecklist missing={missing} />
        <p className={`mt-4 rounded-lg px-3 py-2 text-xs ${missing.length ? 'bg-amber-500/10 text-amber-200' : 'bg-emerald-500/10 text-emerald-300'}`}>
          {missing.length ? `Faltan ${missing.length} requisito${missing.length > 1 ? 's' : ''}: el botón Provisionar está desactivado.` : 'Todo listo para provisionar.'}
        </p>
      </Card>

      <Card title="Enlaces">
        <ul className="space-y-2">
          {links.map(({ label, url, icon: Icon, note }) => (
            <li key={label} className="rounded-xl border border-gray-800 bg-gray-800/30 p-3">
              <p className="flex items-center gap-2 text-sm font-medium text-white">
                <Icon className="h-4 w-4 text-indigo-300" />
                {label}
              </p>
              {url ? (
                <a href={url} target="_blank" rel="noreferrer" className="mt-1 inline-flex max-w-full items-center gap-1 break-all font-mono text-xs text-indigo-300 hover:underline">
                  {url.replace('https://', '')}
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              ) : (
                <p className="mt-1 text-xs text-gray-500">{label === 'Preview' ? 'Aún no creada' : 'Sin dominio'}</p>
              )}
              <p className="mt-0.5 text-[11px] text-gray-500">{note}</p>
            </li>
          ))}
        </ul>
        <ul className="mt-4 grid grid-cols-2 gap-1.5">
          {PROVIDERS.map((p) => {
            const s = integrations[p].status;
            return (
              <li key={p} className="flex items-center justify-between gap-2 rounded-lg bg-gray-800/40 px-2.5 py-1.5 text-xs">
                <span className="text-gray-300">{PROVIDER_META[p].label}</span>
                <Badge className={INTEGRATION_STATUS_META[s].badge}>{INTEGRATION_STATUS_META[s].label}</Badge>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card title="Ficha">
        <dl className="divide-y divide-gray-800">
          <Row label="Tipo">{tenant.businessType ? TENANT_TYPE_META[tenant.businessType].label : '—'}</Row>
          <Row label="Plan">{plan ? `${plan.name} · ${plan.saasPlanCode}` : '—'}</Row>
          <Row label="Layout">{tenant.layout ? `${tenant.layout} · ${effectiveVariant(tenant.layout, tenant.layoutVariant).name}` : '—'}</Row>
          <Row label="DNS">{tenant.dnsProvider ? DNS_PROVIDER_META[tenant.dnsProvider].label : 'Manual'}</Row>
          <Row label="Dirección">{tenant.address ?? '—'}</Row>
          <Row label="Precio de cierre">{billing ? `${formatEuros(billing.closedPrice)} · ${billing.paymentMode === 'single' ? 'único' : '50/50'}` : '—'}</Row>
          <Row label="Renovación">{billing?.maintenanceRenewal ? formatShortDate(billing.maintenanceRenewal) : 'Se fija al salir a producción'}</Row>
          <Row label="business_id">
            {tenant.saasBusinessId ? <code className="break-all text-xs">{tenant.saasBusinessId}</code> : '—'}
            <span className="block text-[11px] text-gray-500">{integrations.supabase.status === 'ok' ? 'En la BD del SaaS' : 'Aún no escrito en el SaaS'}</span>
          </Row>
          <Row label="Teléfono">{[tenant.phone, tenant.whatsapp && `WhatsApp ${tenant.whatsapp}`].filter(Boolean).join(' · ') || '—'}</Row>
          <Row label="Email">{tenant.publicEmail ?? '—'}</Row>
          <Row label="Redes">
            {SOCIALS.filter((n) => tenant.socials[n]).length ? (
              <span className="flex flex-wrap justify-end gap-x-2">
                {SOCIALS.filter((n) => tenant.socials[n]).map((n) => (
                  <a key={n} href={socialUrl(n, tenant.socials[n]!)} target="_blank" rel="noreferrer" className="text-indigo-300 hover:underline">
                    {SOCIAL_META[n].label}
                  </a>
                ))}
              </span>
            ) : (
              '—'
            )}
          </Row>
          <Row label="Alta">{`${formatShortDate(tenant.createdAt)}${tenant.createdBy ? ` · ${PARTNER_META[tenant.createdBy].name}` : ''}`}</Row>
        </dl>
        {plan && (
          <div className="mt-3 flex flex-wrap gap-1">
            {Object.entries(plan.features).map(([k, on]) => (
              <span key={k} className={`rounded px-1.5 py-0.5 text-[10px] ${on ? 'bg-emerald-500/10 text-emerald-300' : 'bg-gray-800 text-gray-500 line-through'}`}>
                {FEATURE_LABEL[k] ?? k}
              </span>
            ))}
          </div>
        )}
        {tenant.openingHours && (
          <ul className="mt-4 space-y-0.5 text-xs">
            {hoursSummary(tenant.openingHours).map((h) => (
              <li key={h.day} className="flex justify-between gap-2">
                <span className="text-gray-400">{h.day}</span>
                <span className={h.hours === 'Cerrado' ? 'text-gray-600' : 'tabular-nums text-gray-200'}>{h.hours}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
