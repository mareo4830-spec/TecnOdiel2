import { Boxes, Check, Plus, Settings2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AvatarStack } from '../../../components/ui/AvatarStack';
import type { Project } from '../../../types';
import { useProjectTenants } from '../../tenants/tenantService';
import { BUSINESS_TYPE_META, STATUS_META, STATUS_ORDER } from '../projectMeta';
import { CONNECTION_LABEL, saasConnections, type SaasConnection } from '../saasConfig';

/** Tarjeta de un producto SaaS: tenants por etapa, conexiones y acceso directo a dar de alta. */
export function SaasProductCard({ project }: { project: Project }) {
  const tenants = useProjectTenants(project.id);
  const connections = saasConnections(project);
  const live = tenants.filter((t) => t.status === 'live').length;
  const vertical = BUSINESS_TYPE_META[project.businessType];

  return (
    <article className="flex flex-col rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-gray-900 to-gray-900 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-500/15 text-indigo-300">
          <Boxes className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <Link to={`/proyectos/${project.id}`} className="block truncate text-lg font-semibold text-white hover:text-indigo-300">
            {project.name}
          </Link>
          <p className="truncate text-sm text-gray-400">
            SaaS Multi-Tenant · {vertical.label} · {project.repo.fullName}
          </p>
        </div>
        <AvatarStack ids={project.contributors} />
      </div>

      <dl className="mt-4 grid grid-cols-4 gap-2">
        {STATUS_ORDER.map((s) => (
          <div key={s} className="rounded-xl bg-gray-800/50 px-3 py-2">
            <dt className="flex items-center gap-1.5 text-[11px] text-gray-400">
              <span className={`h-1.5 w-1.5 rounded-full ${STATUS_META[s].accent}`} />
              {STATUS_META[s].label}
            </dt>
            <dd className="text-lg font-semibold text-white">{tenants.filter((t) => t.stage === s).length}</dd>
          </div>
        ))}
        <div className="rounded-xl bg-emerald-500/10 px-3 py-2">
          <dt className="text-[11px] text-emerald-300">En producción</dt>
          <dd className="text-lg font-semibold text-emerald-200">{live}</dd>
        </div>
      </dl>

      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Conexiones">
        {(Object.keys(connections) as SaasConnection[]).map((c) => (
          <li
            key={c}
            className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium ${
              connections[c] ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'
            }`}
          >
            {connections[c] ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
            {CONNECTION_LABEL[c]}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-800 pt-4">
        <Link
          to={`/proyectos/${project.id}/tenants/nuevo`}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-indigo-600 px-3 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" />
          Nuevo tenant
        </Link>
        <Link
          to={`/proyectos/${project.id}`}
          className="inline-flex h-9 items-center rounded-xl border border-gray-700 px-3 text-sm font-medium text-gray-200 hover:border-indigo-500"
        >
          Ver tenants ({tenants.length})
        </Link>
        <Link
          to={`/proyectos/${project.id}?tab=configuracion`}
          className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-sm text-gray-400 hover:bg-gray-800 hover:text-white"
        >
          <Settings2 className="h-4 w-4" />
          Configuración
        </Link>
      </div>
    </article>
  );
}
