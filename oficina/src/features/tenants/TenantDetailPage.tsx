import { ArrowLeft, ExternalLink, Eye, FileText, Plug, Receipt, Rocket, ScrollText, SquarePen, Store, Trash2, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useAuth } from '../auth/authContext';
import { STATUS_META, WAITING_BADGE } from '../projects/projectMeta';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useProject } from '../projects/projectService';
import { TenantStatusBadge } from './components/TenantBits';
import { BillingTab } from './tabs/BillingTab';
import { DataTab } from './tabs/DataTab';
import { IntegrationsTab } from './tabs/IntegrationsTab';
import { LogTab } from './tabs/LogTab';
import { PreviewTab } from './tabs/PreviewTab';
import { ProvisionTab } from './tabs/ProvisionTab';
import { SummaryTab } from './tabs/SummaryTab';
import { TENANT_TYPE_META } from './tenantMeta';
import { deleteTenant, useTenant, useTenantIntegrations } from './tenantService';

const TABS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: 'resumen', label: 'Resumen', icon: FileText },
  { id: 'preview', label: 'Preview', icon: Eye },
  { id: 'datos', label: 'Datos', icon: SquarePen },
  { id: 'facturacion', label: 'Facturación', icon: Receipt },
  { id: 'integraciones', label: 'Integraciones', icon: Plug },
  { id: 'provisionar', label: 'Provisionar', icon: Rocket },
  { id: 'log', label: 'Log', icon: ScrollText },
];

export function TenantDetailPage() {
  const { projectId, tenantId } = useParams();
  const project = useProject(projectId);
  const tenant = useTenant(tenantId);
  const integrations = useTenantIntegrations(tenantId ?? '');
  const [params, setParams] = useSearchParams();
  const tab = TABS.some((t) => t.id === params.get('tab')) ? params.get('tab')! : 'resumen';
  const { partner } = useAuth();
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!project || !tenant || tenant.projectId !== project.id) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-gray-800 px-6 py-14 text-center">
        <p className="font-medium text-gray-200">No encontramos este tenant</p>
        <Link to={project ? `/proyectos/${project.id}` : '/proyectos'} className="mt-4 inline-flex items-center gap-2 text-sm text-indigo-300 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Volver
        </Link>
      </div>
    );
  }

  const type = tenant.businessType ? TENANT_TYPE_META[tenant.businessType] : null;
  const TypeIcon = type?.icon ?? Store;
  const setTab = (id: string) => setParams(id === 'resumen' ? {} : { tab: id }, { replace: true });

  return (
    <div className="mx-auto max-w-[1600px] space-y-5">
      <Link to={`/proyectos/${project.id}`} className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> {project.name}
      </Link>

      <header className="flex flex-col gap-4 rounded-2xl border border-gray-800 bg-gray-900 p-4 sm:p-6 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          {tenant.logoUrl ? (
            <img src={tenant.logoUrl} alt="" className="h-12 w-12 shrink-0 rounded-2xl object-cover" />
          ) : (
            <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${type?.tint ?? 'bg-gray-800 text-gray-400'}`}>
              <TypeIcon className="h-6 w-6" />
            </span>
          )}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold text-white sm:text-2xl">{tenant.name}</h1>
              <TenantStatusBadge status={tenant.status} />
              <Badge className={STATUS_META[tenant.stage].badge}>{STATUS_META[tenant.stage].label}</Badge>
              {tenant.waitingClient && <Badge className={WAITING_BADGE}>Esperando cliente</Badge>}
            </div>
            <p className="mt-0.5 truncate font-mono text-sm text-gray-400">{tenant.slug}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {tenant.previewHost && integrations.preview.status === 'ok' && (
            <a
              href={`https://${tenant.previewHost}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 max-w-full items-center gap-2 rounded-xl border border-gray-700 px-4 text-sm font-medium text-gray-200 hover:border-indigo-500 hover:text-white"
            >
              <Eye className="h-4 w-4 shrink-0" />
              <span className="truncate">{tenant.previewHost}</span>
            </a>
          )}
          {tenant.domain && (
            <a
              href={`https://${tenant.domain}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-700 px-4 text-sm font-medium text-gray-200 hover:border-indigo-500 hover:text-white"
            >
              <ExternalLink className="h-4 w-4" />
              {tenant.domain}
            </a>
          )}
          <button
            onClick={() => setTab('provisionar')}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 hover:from-indigo-500 hover:to-purple-500"
          >
            <Rocket className="h-4 w-4" />
            Provisionar
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            aria-label="Eliminar tenant"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-700 px-3 text-sm font-medium text-rose-300 transition hover:border-rose-500 hover:bg-rose-500/10"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Eliminar</span>
          </button>
        </div>
      </header>

      <nav className="no-scrollbar -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0" aria-label="Secciones del tenant">
        <div role="tablist" className="flex w-max gap-1 rounded-2xl border border-gray-800 bg-gray-900 p-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition ${
                tab === id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </nav>

      <div role="tabpanel">
        {tab === 'resumen' && <SummaryTab tenant={tenant} onGo={setTab} />}
        {tab === 'preview' && <PreviewTab tenant={tenant} />}
        {tab === 'datos' && <DataTab tenant={tenant} />}
        {tab === 'facturacion' && <BillingTab tenant={tenant} />}
        {tab === 'integraciones' && <IntegrationsTab tenant={tenant} />}
        {tab === 'provisionar' && <ProvisionTab tenant={tenant} onGo={setTab} />}
        {tab === 'log' && <LogTab tenant={tenant} />}
      </div>

      {confirmDelete && partner && (
        <ConfirmDialog
          title={`Eliminar «${tenant.name}»`}
          confirmLabel="Eliminar tenant"
          onCancel={() => setConfirmDelete(false)}
          onConfirm={async () => {
            const ok = await deleteTenant(tenant.id, partner.id);
            if (!ok) return false;
            navigate(`/proyectos/${project.id}`, { replace: true });
          }}
        >
          <p>Se borrará de la base de datos con sus datos de cliente, facturación, pagos, integraciones y log.</p>
          <p className="text-gray-400">
            No se toca nada fuera de la oficina: el negocio en el SaaS, Vercel, DNS, OneSignal y Search Console siguen como estén.
            Esta acción no se puede deshacer.
          </p>
        </ConfirmDialog>
      )}
    </div>
  );
}
