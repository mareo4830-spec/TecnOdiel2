import { ArrowLeft, Boxes, Code2, ExternalLink, FileText, Link2, MonitorSmartphone, Settings2, SquareKanban, Trash2, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { AvatarStack } from '../../components/ui/AvatarStack';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { DevelopmentTab } from './detail/DevelopmentTab';
import { LinksTab } from './detail/LinksTab';
import { PreviewTab } from './detail/PreviewTab';
import { SaasConfigTab } from './detail/SaasConfigTab';
import { SummaryTab } from './detail/SummaryTab';
import { BUSINESS_TYPE_META, LAYOUT_META, STATUS_META, WAITING_BADGE } from './projectMeta';
import { deleteProject, useProject } from './projectService';
import { SaasTenantsPanel } from '../tenants/SaasTenantsPanel';
import { forgetTenants, useProjectTenants } from '../tenants/tenantService';

const SAAS_TABS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: 'tenants', label: 'Tenants', icon: Boxes },
  { id: 'configuracion', label: 'Configuración', icon: Settings2 },
];

const TABS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: 'resumen', label: 'Resumen', icon: FileText },
  { id: 'desarrollo', label: 'Desarrollo', icon: Code2 },
  { id: 'preview', label: 'Preview', icon: MonitorSmartphone },
  { id: 'accesos', label: 'Accesos rápidos', icon: Link2 },
];

export function ProjectDetailPage() {
  const { projectId } = useParams();
  const project = useProject(projectId);
  const [searchParams, setSearchParams] = useSearchParams();
  const tenants = useProjectTenants(projectId ?? '');
  // Un proyecto SaaS abre en sus tenants; el resto de pestañas (repo core, preview…) se mantienen.
  const tabs = project?.kind === 'saas' ? [...SAAS_TABS, ...TABS.filter((t) => t.id !== 'preview')] : TABS;
  const defaultTab = tabs[0].id;
  const tab = tabs.some((t) => t.id === searchParams.get('tab')) ? searchParams.get('tab')! : defaultTab;
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!project) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-gray-800 px-6 py-14 text-center">
        <p className="font-medium text-gray-200">No encontramos este proyecto</p>
        <Link to="/proyectos" className="mt-4 inline-flex items-center gap-2 text-sm text-indigo-300 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Volver a Proyectos
        </Link>
      </div>
    );
  }

  const saas = project.kind === 'saas';
  const type = BUSINESS_TYPE_META[project.businessType];
  const TypeIcon = saas ? Boxes : type.icon;

  return (
    <div className="mx-auto max-w-[1600px] space-y-5">
      <Link to="/proyectos" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Proyectos
      </Link>

      <header className="rounded-2xl border border-gray-800 bg-gray-900 p-4 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${saas ? 'bg-indigo-500/15 text-indigo-300' : type.tint}`}>
              <TypeIcon className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold text-white sm:text-2xl">{project.name}</h2>
                <Badge className={STATUS_META[project.status].badge}>{STATUS_META[project.status].label}</Badge>
                {project.waitingClient && <Badge className={WAITING_BADGE}>Esperando cliente</Badge>}
              </div>
              <p className="mt-0.5 text-gray-400">
                {saas
                  ? `SaaS Multi-Tenant · ${project.businessName} · ${tenants.length} tenant${tenants.length === 1 ? '' : 's'}`
                  : `${project.businessName} · ${type.label} · ${LAYOUT_META[project.layout].label}`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 lg:w-auto">
            <div className="w-full sm:w-56">
              <p className="mb-1.5 text-xs text-gray-500">Progreso</p>
              <ProgressBar value={project.progress} />
            </div>
            <AvatarStack ids={project.contributors} size="sm" />
            {saas && (
              <Link
                to={`/kanban?proyecto=${project.id}`}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-700 px-4 text-sm font-medium text-gray-200 hover:border-indigo-500 hover:text-white"
              >
                <SquareKanban className="h-4 w-4" />
                Kanban de tenants
              </Link>
            )}
            {project.domain && (
              <a
                href={`https://${project.domain}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-700 px-4 text-sm font-medium text-gray-200 hover:border-indigo-500 hover:text-white"
              >
                <ExternalLink className="h-4 w-4" />
                Abrir web
              </a>
            )}
            <button
              onClick={() => setConfirmDelete(true)}
              aria-label="Eliminar proyecto"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-700 px-3 text-sm font-medium text-rose-300 transition hover:border-rose-500 hover:bg-rose-500/10"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Eliminar</span>
            </button>
          </div>
        </div>
      </header>

      <nav className="no-scrollbar -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0" aria-label="Secciones del proyecto">
        <div role="tablist" className="flex w-max gap-1 rounded-2xl border border-gray-800 bg-gray-900 p-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => setSearchParams(id === defaultTab ? {} : { tab: id }, { replace: true })}
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
        {tab === 'tenants' && <SaasTenantsPanel project={project} />}
        {tab === 'configuracion' && <SaasConfigTab key={project.id} project={project} />}
        {tab === 'resumen' && <SummaryTab project={project} />}
        {tab === 'desarrollo' && <DevelopmentTab project={project} />}
        {tab === 'preview' && <PreviewTab project={project} />}
        {tab === 'accesos' && <LinksTab project={project} />}
      </div>

      {confirmDelete && (
        <ConfirmDialog
          title={`Eliminar «${project.name}»`}
          confirmLabel="Eliminar proyecto"
          onCancel={() => setConfirmDelete(false)}
          onConfirm={async () => {
            const ok = await deleteProject(project.id);
            if (!ok) return false;
            forgetTenants((t) => t.projectId === project.id);
            navigate('/proyectos', { replace: true });
          }}
        >
          <p>
            Se borrará de la base de datos junto con sus tareas y commits
            {saas ? `, sus ${tenants.length} tenants (con facturación, pagos e integraciones) y su configuración SaaS` : ''}.
          </p>
          <p className="text-gray-400">
            Las horas, los movimientos del fondo, los leads y los chats se conservan sin proyecto. No se toca nada fuera de la
            oficina (GitHub, Vercel, el SaaS…). Esta acción no se puede deshacer.
          </p>
        </ConfirmDialog>
      )}
    </div>
  );
}
