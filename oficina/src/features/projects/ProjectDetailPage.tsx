import { ArrowLeft, Boxes, Check, Code2, ExternalLink, FileText, Link2, MonitorSmartphone, Pencil, Settings2, SquareKanban, Trash2, X, type LucideIcon } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AvatarStack } from '../../components/ui/AvatarStack';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { DevelopmentTab } from './detail/DevelopmentTab';
import { LinksTab } from './detail/LinksTab';
import { PreviewTab } from './detail/PreviewTab';
import { SaasConfigTab } from './detail/SaasConfigTab';
import { SummaryTab } from './detail/SummaryTab';
import { toast } from '../../lib/toast';
import { deleteProject } from './deleteProject';
import { BUSINESS_TYPE_META, LAYOUT_META, STATUS_META, WAITING_BADGE } from './projectMeta';
import { updateProject, useProject } from './projectService';
import { SaasTenantsPanel } from '../tenants/SaasTenantsPanel';
import { useProjectTenants } from '../tenants/tenantService';

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
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);
  // Un proyecto SaaS abre en sus tenants; el resto de pestañas (repo core, preview…) se mantienen.
  const tabs = project?.kind === 'saas' ? [...SAAS_TABS, ...TABS.filter((t) => t.id !== 'preview')] : TABS;
  const defaultTab = tabs[0].id;
  const tab = tabs.some((t) => t.id === searchParams.get('tab')) ? searchParams.get('tab')! : defaultTab;

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
                <ProjectName id={project.id} name={project.name} />
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
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-700 px-4 text-sm font-medium text-gray-400 hover:border-rose-500/60 hover:text-rose-300"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </button>
          </div>
        </div>

        {confirmDelete && (
          <div role="alertdialog" aria-label="Confirmar borrado" className="mt-4 flex flex-col gap-3 rounded-xl border border-rose-500/30 bg-rose-500/5 p-3 sm:flex-row sm:items-center">
            <p className="flex-1 text-sm text-rose-200">
              ¿Eliminar «{project.name}»?{' '}
              {saas && tenants.length > 0 && `También se borrarán sus ${tenants.length} tenant${tenants.length === 1 ? '' : 's'}. `}
              Se borran sus tareas, horas y actividad. No se puede deshacer.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(false)} className="h-9 rounded-lg px-3 text-sm text-gray-300 hover:bg-gray-800">
                Cancelar
              </button>
              <button
                onClick={() => {
                  deleteProject(project.id);
                  toast('Proyecto eliminado');
                  navigate('/proyectos', { replace: true });
                }}
                className="h-9 rounded-lg bg-rose-600 px-3 text-sm font-semibold text-white hover:bg-rose-500"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        )}
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
    </div>
  );
}

/** Nombre del proyecto con edición en el sitio: lápiz → campo; Enter guarda, Escape cancela. */
function ProjectName({ id, name }: { id: string; name: string }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);

  const start = () => {
    setDraft(name);
    setEditing(true);
  };
  const save = (e?: FormEvent) => {
    e?.preventDefault();
    const next = draft.trim();
    if (next && next !== name) {
      updateProject(id, { name: next });
      toast('Nombre actualizado');
    }
    setEditing(false);
  };

  if (!editing) {
    return (
      <span className="group inline-flex min-w-0 items-center gap-1.5">
        <h2 className="text-xl font-semibold text-white sm:text-2xl">{name}</h2>
        <button
          onClick={start}
          aria-label="Cambiar el nombre del proyecto"
          title="Cambiar nombre"
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-800 hover:text-white"
        >
          <Pencil className="h-4 w-4" />
        </button>
      </span>
    );
  }

  return (
    <form onSubmit={save} className="flex min-w-0 items-center gap-1.5">
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => e.key === 'Escape' && setEditing(false)}
        aria-label="Nombre del proyecto"
        autoFocus
        onFocus={(e) => e.currentTarget.select()}
        className="h-10 w-64 max-w-full rounded-xl border border-indigo-500 bg-gray-950 px-3 text-lg font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 sm:w-80"
      />
      <button type="submit" disabled={!draft.trim()} aria-label="Guardar nombre" className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50">
        <Check className="h-4 w-4" />
      </button>
      <button type="button" onClick={() => setEditing(false)} aria-label="Cancelar" className="grid h-9 w-9 place-items-center rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white">
        <X className="h-4 w-4" />
      </button>
    </form>
  );
}
