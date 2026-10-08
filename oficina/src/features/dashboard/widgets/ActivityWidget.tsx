import {
  Clock,
  FolderPlus,
  Handshake,
  GitCommitHorizontal,
  LogIn,
  LogOut,
  MessageCircle,
  PiggyBank,
  RefreshCw,
  Rocket,
  SquareKanban,
  type LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar } from '../../../components/ui/Avatar';
import { useNow } from '../../../hooks/useNow';
import { PARTNER_META } from '../../../lib/partners';
import { formatRelative } from '../../../lib/format';
import type { ActivityType } from '../../../types';
import { useActivity } from '../../activity/activityService';
import { useProjects } from '../../projects/projectService';

const TYPE_META: Record<ActivityType, { icon: LucideIcon; tint: string }> = {
  push: { icon: GitCommitHorizontal, tint: 'text-purple-300 bg-purple-500/10' },
  checkin: { icon: LogIn, tint: 'text-emerald-300 bg-emerald-500/10' },
  checkout: { icon: LogOut, tint: 'text-rose-300 bg-rose-500/10' },
  project_created: { icon: FolderPlus, tint: 'text-indigo-300 bg-indigo-500/10' },
  status: { icon: RefreshCw, tint: 'text-amber-300 bg-amber-500/10' },
  deploy: { icon: Rocket, tint: 'text-sky-300 bg-sky-500/10' },
  task: { icon: SquareKanban, tint: 'text-indigo-300 bg-indigo-500/10' },
  chat: { icon: MessageCircle, tint: 'text-green-300 bg-green-500/10' },
  hours: { icon: Clock, tint: 'text-emerald-300 bg-emerald-500/10' },
  fund: { icon: PiggyBank, tint: 'text-amber-300 bg-amber-500/10' },
  lead: { icon: Handshake, tint: 'text-sky-300 bg-sky-500/10' },
};

export function LiveBadge() {
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
      </span>
      En directo
    </span>
  );
}

/** Timeline "Actividad del equipo": pushes, check-ins, despliegues y cambios de estado. */
export function ActivityWidget() {
  const events = useActivity(8);
  const projects = useProjects();
  useNow();

  return (
    <ol className="relative space-y-4 before:absolute before:bottom-2 before:left-4 before:top-2 before:w-px before:bg-gray-800">
      {events.map((e) => {
        const partner = PARTNER_META[e.partnerId];
        const project = e.projectId ? projects.find((p) => p.id === e.projectId) : undefined;
        const meta = TYPE_META[e.type];
        const Icon = meta.icon;
        return (
          <li key={e.id} className="relative flex gap-3">
            <Avatar partner={{ ...partner, avatarUrl: null }} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-snug text-gray-300">
                <span className="font-semibold text-white">{partner.name}</span> {e.action}
                {project && (
                  <>
                    {' '}
                    <Link to={`/proyectos/${project.id}`} className="font-medium text-indigo-300 hover:underline">
                      {project.businessName}
                    </Link>
                  </>
                )}
              </p>
              {e.detail && <p className="mt-0.5 truncate font-mono text-xs text-gray-500">{e.detail}</p>}
              <p className="mt-0.5 text-xs text-gray-500">{formatRelative(e.createdAt)}</p>
            </div>
            <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${meta.tint}`}>
              <Icon className="h-3.5 w-3.5" />
            </span>
          </li>
        );
      })}
    </ol>
  );
}
