import { ChevronRight, FolderOpen } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AvatarStack } from '../../../components/ui/AvatarStack';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { useAuth } from '../../auth/authContext';
import { BUSINESS_TYPE_META } from '../../projects/projectMeta';
import { useProjects } from '../../projects/projectService';

/** Proyectos en curso en los que participa el socio activo. */
export function MyProjectsWidget() {
  const projects = useProjects();
  const { partner } = useAuth();

  const mine = useMemo(
    () =>
      projects
        .filter((p) => p.status !== 'hecho' && (!partner || p.contributors.includes(partner.id)))
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .slice(0, 4),
    [projects, partner],
  );

  if (mine.length === 0) {
    return (
      <div className="flex flex-col items-center py-8 text-center text-sm text-gray-500">
        <FolderOpen className="mb-2 h-8 w-8 text-gray-600" />
        No tienes proyectos en curso.
      </div>
    );
  }

  return (
    <ul className="space-y-2.5">
      {mine.map((p) => {
        const Icon = BUSINESS_TYPE_META[p.businessType].icon;
        return (
          <li key={p.id}>
            <Link
              to={`/proyectos/${p.id}`}
              className="group block rounded-xl border border-gray-800 bg-gray-800/40 p-3 transition hover:border-indigo-500/50 hover:bg-gray-800/70"
            >
              <div className="flex items-center gap-3">
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${BUSINESS_TYPE_META[p.businessType].tint}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{p.name}</p>
                  <p className="truncate text-xs text-gray-400">{p.businessName}</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-gray-600 transition group-hover:text-indigo-300" />
              </div>
              <div className="mt-2.5 flex items-center gap-3 pl-11">
                <div className="flex-1">
                  <ProgressBar value={p.progress} />
                </div>
                <AvatarStack ids={p.contributors} />
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
