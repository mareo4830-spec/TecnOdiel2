import { Globe, Plus, Search, Store } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';
import { daysUntil, formatEuros, formatRelative } from '../../lib/format';
import type { Project, Tenant, TenantStatus } from '../../types';
import { STATUS_META, WAITING_BADGE } from '../projects/projectMeta';
import { RequirementsChecklist, TenantStatusBadge } from './components/TenantBits';
import { INTEGRATION_STATUS_META, PROVIDERS, PROVIDER_META, TENANT_STATUSES, TENANT_STATUS_META, TENANT_TYPE_META } from './tenantMeta';
import {
  missingRequirements,
  useAllBilling,
  useAllPayments,
  usePlans,
  useProjectTenants,
  useTenantIntegrations,
} from './tenantService';

const normalize = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function TenantCard({ tenant, projectId, missing }: { tenant: Tenant; projectId: string; missing: number }) {
  const integrations = useTenantIntegrations(tenant.id);
  const plans = usePlans();
  const type = tenant.businessType ? TENANT_TYPE_META[tenant.businessType] : null;
  const TypeIcon = type?.icon ?? Store;
  const plan = plans.find((p) => p.id === tenant.planId);

  return (
    <Link
      to={`/proyectos/${projectId}/tenants/${tenant.id}`}
      className="flex flex-col rounded-2xl border border-gray-800 bg-gray-900 p-4 transition hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-950/40 focus:outline-none focus-visible:border-indigo-500"
    >
      <div className="flex items-start gap-3">
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${type?.tint ?? 'bg-gray-800 text-gray-400'}`}>
          <TypeIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-white">{tenant.name}</h3>
          <p className="flex items-center gap-1 truncate text-xs text-gray-400">
            <Globe className="h-3 w-3 shrink-0" />
            <span className="truncate">{tenant.domain ?? tenant.previewHost ?? 'Sin dominio'}</span>
          </p>
        </div>
        <TenantStatusBadge status={tenant.status} />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge className={STATUS_META[tenant.stage].badge}>{STATUS_META[tenant.stage].label}</Badge>
        {tenant.waitingClient && <Badge className={WAITING_BADGE}>Esperando cliente</Badge>}
        {type && <Badge>{type.label}</Badge>}
        {plan && <Badge>{plan.name}</Badge>}
        {tenant.status !== 'live' && missing > 0 && (
          <Badge className="bg-rose-500/10 text-rose-300 ring-rose-500/30">
            {missing} requisito{missing > 1 ? 's' : ''} pendiente{missing > 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-800 pt-3">
        <ul className="flex gap-1" aria-label="Estado de las integraciones">
          {PROVIDERS.map((p) => {
            const s = integrations[p].status;
            const color = s === 'ok' ? 'bg-emerald-400' : s === 'error' ? 'bg-rose-400' : s === 'running' ? 'animate-pulse bg-sky-400' : s === 'skipped' ? 'bg-gray-600' : 'bg-gray-700';
            return (
              <li key={p} title={`${PROVIDER_META[p].label}: ${INTEGRATION_STATUS_META[s].label}`}>
                <span className={`block h-2 w-5 rounded-full ${color}`} />
                <span className="sr-only">{`${PROVIDER_META[p].label}: ${INTEGRATION_STATUS_META[s].label}`}</span>
              </li>
            );
          })}
        </ul>
        <span className="text-[11px] text-gray-500">{formatRelative(tenant.updatedAt)}</span>
      </div>
    </Link>
  );
}

/** Pestaña "Tenants" de un proyecto SaaS: métricas, filtros y grid. */
export function SaasTenantsPanel({ project }: { project: Project }) {
  const tenants = useProjectTenants(project.id);
  const billing = useAllBilling();
  const payments = useAllPayments();
  const plans = usePlans();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<TenantStatus | 'todos'>('todos');
  const [planId, setPlanId] = useState('todos');

  const ids = useMemo(() => new Set(tenants.map((t) => t.id)), [tenants]);

  const metrics = useMemo(() => {
    const mine = payments.filter((p) => ids.has(p.tenantId));
    const bills = billing.filter((b) => ids.has(b.tenantId));
    const billed = bills.reduce((s, b) => s + b.closedPrice, 0);
    const collected = mine.filter((p) => p.paidAt).reduce((s, p) => s + p.amount, 0);
    // Pendiente: cierre sin cobrar + mantenimientos ya con fecha (tenant en producción).
    const pending = mine
      .filter((p) => !p.paidAt && (p.concept !== 'maintenance' || p.dueDate))
      .reduce((s, p) => s + p.amount, 0);
    const renewals = bills.filter((b) => b.maintenanceRenewal && daysUntil(b.maintenanceRenewal) >= 0 && daysUntil(b.maintenanceRenewal) <= 30);
    const byStatus = Object.fromEntries(TENANT_STATUSES.map((s) => [s, tenants.filter((t) => t.status === s).length])) as Record<TenantStatus, number>;
    return { billed, collected, pending, renewals, byStatus };
  }, [tenants, billing, payments, ids]);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return tenants.filter(
      (t) =>
        (status === 'todos' || t.status === status) &&
        (planId === 'todos' || t.planId === planId) &&
        (!q || normalize(`${t.name} ${t.slug} ${t.domain ?? ''}`).includes(q)),
    );
  }, [tenants, query, status, planId]);

  const collectedPct = metrics.collected + metrics.pending > 0 ? (metrics.collected / (metrics.collected + metrics.pending)) * 100 : 0;

  return (
    <div className="space-y-5">
      <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
          <dt className="text-xs text-gray-400">Tenants</dt>
          <dd className="mt-1 text-xl font-semibold text-white sm:text-2xl">{tenants.length}</dd>
          <dd className="mt-2 flex flex-wrap gap-x-2.5 gap-y-1">
            {TENANT_STATUSES.filter((s) => metrics.byStatus[s] > 0).map((s) => (
              <span key={s} className="flex items-center gap-1 text-[11px] text-gray-400">
                <span className={`h-1.5 w-1.5 rounded-full ${TENANT_STATUS_META[s].dot}`} />
                {metrics.byStatus[s]} {TENANT_STATUS_META[s].label.toLowerCase()}
              </span>
            ))}
          </dd>
        </div>
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
          <dt className="text-xs text-gray-400">Facturado (precio de cierre)</dt>
          <dd className="mt-1 text-xl font-semibold text-white sm:text-2xl">{formatEuros(metrics.billed)}</dd>
        </div>
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
          <dt className="text-xs text-gray-400">Cobrado / pendiente</dt>
          <dd className="mt-1 text-xl font-semibold text-emerald-300 sm:text-2xl">
            {formatEuros(metrics.collected)}
            <span className="ml-1.5 text-sm font-medium text-amber-300">/ {formatEuros(metrics.pending)}</span>
          </dd>
          <dd className="mt-2 h-1.5 overflow-hidden rounded-full bg-amber-500/30">
            <div className="h-full bg-emerald-500" style={{ width: `${collectedPct}%` }} />
          </dd>
        </div>
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
          <dt className="text-xs text-gray-400">Renovaciones en 30 días</dt>
          <dd className="mt-1 text-xl font-semibold text-white sm:text-2xl">{metrics.renewals.length}</dd>
          <dd className="mt-1 text-[11px] text-gray-400">
            {metrics.renewals.length
              ? `${formatEuros(metrics.renewals.reduce((s, b) => s + b.maintenanceYearly, 0))} de mantenimiento`
              : 'Ninguna próxima'}
          </dd>
        </div>
      </dl>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, slug o dominio"
            aria-label="Buscar tenants"
            className="h-10 w-full rounded-xl border border-gray-800 bg-gray-900 pl-10 pr-3 text-sm text-white placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>
        <div className="flex gap-2 sm:ml-auto">
          <select
            value={planId}
            onChange={(e) => setPlanId(e.target.value)}
            aria-label="Plan"
            className="h-10 flex-1 rounded-xl border border-gray-800 bg-gray-900 px-3 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none sm:flex-none"
          >
            <option value="todos">Todos los planes</option>
            {plans.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <Link
            to={`/proyectos/${project.id}/tenants/nuevo`}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 hover:from-indigo-500 hover:to-purple-500"
          >
            <Plus className="h-4 w-4" />
            Nuevo tenant
          </Link>
        </div>
      </div>

      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Estado">
        {(['todos', ...TENANT_STATUSES] as (TenantStatus | 'todos')[]).map((s) => (
          <button
            key={s}
            role="tab"
            aria-selected={status === s}
            onClick={() => setStatus(s)}
            className={`h-9 shrink-0 rounded-xl px-3 text-sm font-medium transition ${
              status === s ? 'bg-indigo-600 text-white' : 'bg-gray-900 text-gray-400 ring-1 ring-gray-800 hover:text-white'
            }`}
          >
            {s === 'todos' ? 'Todos' : TENANT_STATUS_META[s].label}
            {s !== 'todos' && metrics.byStatus[s] > 0 && <span className="ml-1.5 text-xs opacity-70">{metrics.byStatus[s]}</span>}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((t) => (
            <TenantCard key={t.id} tenant={t} projectId={project.id} missing={missingRequirements(t, payments).length} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-800 px-6 py-14 text-center">
          <Store className="h-10 w-10 text-gray-600" />
          <p className="mt-3 font-medium text-gray-300">{tenants.length ? 'No hay tenants con estos filtros' : 'Todavía no hay tenants'}</p>
          <p className="mt-1 max-w-sm text-sm text-gray-500">
            {tenants.length ? 'Prueba con otro estado o plan.' : 'Da de alta el primer negocio con el asistente: te pide lo obligatorio paso a paso.'}
          </p>
          {!tenants.length && (
            <div className="mt-5 w-full max-w-sm rounded-xl border border-gray-800 bg-gray-900 p-4 text-left">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Para salir a producción hace falta</p>
              <RequirementsChecklist missing={['name', 'business_type', 'layout', 'plan', 'domain', 'opening_hours', 'address', 'payment']} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
