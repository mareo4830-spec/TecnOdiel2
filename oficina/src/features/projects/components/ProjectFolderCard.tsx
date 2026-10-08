import { Boxes, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AvatarStack } from '../../../components/ui/AvatarStack';
import { Badge } from '../../../components/ui/Badge';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { formatEuros, formatRelative } from '../../../lib/format';
import type { Project } from '../../../types';
import { BUSINESS_TYPE_META, LAYOUT_META, STATUS_META, WAITING_BADGE } from '../projectMeta';
import { useProjectTenants } from '../../tenants/tenantService';

/** Proyecto como carpeta: pestaña superior con el tipo de negocio y cuerpo con el resumen. */
export function ProjectFolderCard({ project }: { project: Project }) {
  const type = BUSINESS_TYPE_META[project.businessType];
  const status = STATUS_META[project.status];
  const saas = project.kind === 'saas';
  const tenants = useProjectTenants(project.id);
  const live = tenants.filter((t) => t.status === 'live').length;
  const TypeIcon = saas ? Boxes : type.icon;

  return (
    <Link to={`/proyectos/${project.id}`} className="group flex flex-col focus:outline-none">
      <div className="flex">
        <span className="flex h-7 items-center gap-1.5 rounded-t-xl border border-b-0 border-gray-800 bg-gray-900 px-3 text-xs font-medium text-gray-400 transition group-hover:border-indigo-500/50 group-focus-visible:border-indigo-500">
          <TypeIcon className="h-3.5 w-3.5" />
          {saas ? 'SaaS Multi-Tenant' : type.label}
        </span>
      </div>
      <article className="-mt-px flex flex-1 flex-col rounded-2xl rounded-tl-none border border-gray-800 bg-gray-900 p-4 transition group-hover:border-indigo-500/50 group-hover:shadow-lg group-hover:shadow-indigo-950/40 group-focus-visible:border-indigo-500 sm:p-5">
        <div className="flex items-start gap-3">
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${saas ? 'bg-indigo-500/15 text-indigo-300' : type.tint}`}>
            <TypeIcon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 font-semibold leading-snug text-white">{project.name}</h3>
            <p className="truncate text-sm text-gray-400">{project.businessName}</p>
          </div>
          <Badge className={status.badge}>{status.label}</Badge>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {saas ? (
            <>
              <Badge>{tenants.length} tenants</Badge>
              <Badge className="bg-emerald-500/10 text-emerald-300 ring-emerald-500/30">{live} en producción</Badge>
            </>
          ) : (
            <>
              <Badge>{LAYOUT_META[project.layout].label}</Badge>
              <Badge>{formatEuros(project.price)}</Badge>
              {project.waitingClient && <Badge className={WAITING_BADGE}>Esperando cliente</Badge>}
            </>
          )}
        </div>

        <div className="mt-4">
          <ProgressBar value={project.progress} />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-800 pt-3">
          <AvatarStack ids={project.contributors} />
          <div className="min-w-0 text-right">
            <p className="flex items-center justify-end gap-1 truncate text-xs text-gray-400">
              <Globe className="h-3 w-3 shrink-0" />
              <span className="truncate">{project.domain ?? (saas ? 'Un dominio por tenant' : 'Sin dominio')}</span>
            </p>
            <p className="text-[11px] text-gray-500">Actualizado {formatRelative(project.updatedAt)}</p>
          </div>
        </div>
      </article>
    </Link>
  );
}
