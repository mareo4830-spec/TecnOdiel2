import { Boxes, FolderOpen, Plus, Search, Store } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { formatEuros } from '../../lib/format';
import type { BusinessType, NewProjectInput, ProjectStatus } from '../../types';
import { useAuth } from '../auth/authContext';
import { useAllBilling, useAllTenants } from '../tenants/tenantService';
import { NewProjectDialog } from './components/NewProjectDialog';
import { ProjectFolderCard } from './components/ProjectFolderCard';
import { SaasProductCard } from './components/SaasProductCard';
import { BUSINESS_TYPE_META, STATUS_META, STATUS_ORDER } from './projectMeta';
import { createProject, useProjects } from './projectService';

type StatusFilter = ProjectStatus | 'todos';

function normalize(text: string) {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export function ProjectsPage() {
  const projects = useProjects();
  const tenants = useAllTenants();
  const billing = useAllBilling();
  const { partner } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('todos');
  const [type, setType] = useState<BusinessType | 'todos'>('todos');

  const saas = useMemo(() => projects.filter((p) => p.kind === 'saas'), [projects]);
  const standard = useMemo(() => projects.filter((p) => p.kind === 'standard'), [projects]);

  const dialogOpen = searchParams.get('nuevo') === '1';
  const closeDialog = useCallback(() => {
    setSearchParams((prev) => {
      prev.delete('nuevo');
      return prev;
    });
  }, [setSearchParams]);

  /** Categorías que tienen al menos un proyecto (con su recuento). */
  const categories = useMemo(() => {
    const counts = new Map<BusinessType, number>();
    for (const p of standard) counts.set(p.businessType, (counts.get(p.businessType) ?? 0) + 1);
    return [...counts.entries()];
  }, [standard]);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return standard.filter(
      (p) =>
        (status === 'todos' || p.status === status) &&
        (type === 'todos' || p.businessType === type) &&
        (!q || normalize(`${p.name} ${p.businessName} ${p.domain ?? ''} ${p.client.contactName}`).includes(q)),
    );
  }, [standard, query, status, type]);

  const stats = useMemo(() => {
    const inProgress = standard.filter((p) => p.status === 'en_progreso').length + tenants.filter((t) => t.stage === 'en_progreso').length;
    const planned = standard.filter((p) => p.status === 'planeado').length + tenants.filter((t) => t.stage === 'planeado').length;
    const closed = standard.reduce((s, p) => s + p.price, 0) + billing.reduce((s, b) => s + b.closedPrice, 0);
    return [
      { label: 'Proyectos estándar', value: String(standard.length) },
      { label: 'Tenants en SaaS', value: String(tenants.length) },
      { label: 'Planeados / en progreso', value: `${planned} / ${inProgress}` },
      { label: 'Facturación cerrada', value: formatEuros(closed) },
    ];
  }, [standard, tenants, billing]);

  const handleCreate = (input: NewProjectInput) => {
    if (!partner) return;
    const project = createProject(input, partner.id);
    navigate(project.kind === 'saas' ? `/proyectos/${project.id}?tab=configuracion` : `/proyectos/${project.id}`);
  };

  const chip = (active: boolean) =>
    `inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl px-3 text-sm font-medium transition ${
      active ? 'bg-indigo-600 text-white' : 'bg-gray-900 text-gray-400 ring-1 ring-gray-800 hover:text-white'
    }`;

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <dl className="grid flex-1 grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
              <dt className="text-xs text-gray-400">{s.label}</dt>
              <dd className="mt-1 text-xl font-semibold text-white sm:text-2xl">{s.value}</dd>
            </div>
          ))}
        </dl>
        <button
          onClick={() => setSearchParams({ nuevo: '1' })}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 hover:from-indigo-500 hover:to-purple-500"
        >
          <Plus className="h-4 w-4" />
          Nuevo proyecto
        </button>
      </div>

      <section aria-labelledby="saas-title" className="space-y-3">
        <h2 id="saas-title" className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
          <Boxes className="h-4 w-4" />
          Productos SaaS Multi-Tenant
        </h2>
        {saas.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {saas.map((p) => (
              <SaasProductCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-gray-800 px-4 py-6 text-center text-sm text-gray-500">
            Aún no hay productos SaaS. Crea uno con «Nuevo proyecto» → SaaS Multi-Tenant.
          </p>
        )}
      </section>

      <section aria-labelledby="standard-title" className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <h2 id="standard-title" className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
            <Store className="h-4 w-4" />
            Proyectos estándar
          </h2>
          <div className="relative sm:ml-auto sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filtrar por proyecto, negocio o dominio"
              aria-label="Filtrar proyectos"
              className="h-10 w-full rounded-xl border border-gray-800 bg-gray-900 pl-10 pr-3 text-sm text-white placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>
        </div>

        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Categoría">
          <button onClick={() => setType('todos')} aria-pressed={type === 'todos'} className={chip(type === 'todos')}>
            Todas las categorías
          </button>
          {categories.map(([t, n]) => {
            const Icon = BUSINESS_TYPE_META[t].icon;
            return (
              <button key={t} onClick={() => setType(type === t ? 'todos' : t)} aria-pressed={type === t} className={chip(type === t)}>
                <Icon className="h-4 w-4" />
                {BUSINESS_TYPE_META[t].label}
                <span className="text-xs opacity-70">{n}</span>
              </button>
            );
          })}
        </div>

        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Etapa">
          {(['todos', ...STATUS_ORDER] as StatusFilter[]).map((s) => (
            <button key={s} role="tab" aria-selected={status === s} onClick={() => setStatus(s)} className={chip(status === s)}>
              {s === 'todos' ? 'Todas las etapas' : STATUS_META[s].label}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4">
            {filtered.map((p) => (
              <ProjectFolderCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-800 px-6 py-14 text-center">
            <FolderOpen className="h-10 w-10 text-gray-600" />
            <p className="mt-3 font-medium text-gray-300">No hay proyectos con estos filtros</p>
            <p className="mt-1 text-sm text-gray-500">Prueba con otra etapa o categoría.</p>
          </div>
        )}
      </section>

      {dialogOpen && partner && <NewProjectDialog defaultPartner={partner.id} onClose={closeDialog} onCreate={handleCreate} />}
    </div>
  );
}
