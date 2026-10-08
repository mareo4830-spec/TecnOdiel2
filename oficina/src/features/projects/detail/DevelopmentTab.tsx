import { ExternalLink, GitBranch, GitCommitHorizontal, Github, Webhook } from 'lucide-react';
import { useMemo } from 'react';
import { Avatar } from '../../../components/ui/Avatar';
import { PARTNER_META } from '../../../lib/partners';
import { formatRelative } from '../../../lib/format';
import type { PartnerId, Project } from '../../../types';
import { KanbanBoard } from '../../kanban/components/KanbanBoard';
import { useTasks } from '../../kanban/taskService';
import { useProjectCommits } from '../projectService';

export function DevelopmentTab({ project }: { project: Project }) {
  const commits = useProjectCommits(project.id);
  const allTasks = useTasks();
  const tasks = useMemo(() => allTasks.filter((t) => t.projectId === project.id), [allTasks, project.id]);

  const totals = useMemo(() => {
    const byAuthor = new Map<PartnerId, number>();
    let additions = 0;
    let deletions = 0;
    for (const c of commits) {
      additions += c.additions;
      deletions += c.deletions;
      byAuthor.set(c.author, (byAuthor.get(c.author) ?? 0) + 1);
    }
    return { additions, deletions, byAuthor: [...byAuthor.entries()] };
  }, [commits]);

  const repoUrl = `https://github.com/${project.repo.fullName}`;

  return (
    <div className="space-y-4">
      <section aria-label="Tareas técnicas">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">Tareas técnicas</h3>
        <KanbanBoard tasks={tasks} projects={[project]} defaultProjectId={project.id} />
      </section>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4">
          <section className="rounded-2xl border border-gray-800 bg-gray-900 p-4 sm:p-5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Repositorio</h3>
            <a
              href={`${repoUrl}/tree/${project.repo.branch}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-800/40 p-3 hover:border-indigo-500/50"
            >
              <Github className="h-5 w-5 shrink-0 text-gray-300" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{project.repo.fullName}</p>
                <p className="flex items-center gap-1 truncate font-mono text-xs text-purple-300">
                  <GitBranch className="h-3 w-3 shrink-0" />
                  {project.repo.branch}
                </p>
              </div>
              <ExternalLink className="h-4 w-4 shrink-0 text-gray-500" />
            </a>

            <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-gray-800/40 p-3">
                <dt className="text-[11px] text-gray-500">Commits</dt>
                <dd className="text-lg font-semibold text-white">{commits.length}</dd>
              </div>
              <div className="rounded-xl bg-gray-800/40 p-3">
                <dt className="text-[11px] text-gray-500">Añadidas</dt>
                <dd className="text-lg font-semibold text-emerald-400">+{totals.additions}</dd>
              </div>
              <div className="rounded-xl bg-gray-800/40 p-3">
                <dt className="text-[11px] text-gray-500">Borradas</dt>
                <dd className="text-lg font-semibold text-rose-400">−{totals.deletions}</dd>
              </div>
            </dl>

            {totals.byAuthor.length > 0 && (
              <ul className="mt-4 space-y-2">
                {totals.byAuthor.map(([id, count]) => (
                  <li key={id} className="flex items-center gap-2 text-sm">
                    <Avatar partner={{ ...PARTNER_META[id], avatarUrl: null }} size="xs" />
                    <span className="flex-1 text-gray-300">{PARTNER_META[id].name}</span>
                    <span className="text-gray-500">
                      {count} {count === 1 ? 'commit' : 'commits'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="flex gap-3 rounded-2xl border border-dashed border-gray-800 p-4 text-xs text-gray-500">
            <Webhook className="h-4 w-4 shrink-0 text-gray-400" />
            <p>
              Los pushes llegan por webhook de GitHub a la Edge Function <code className="text-gray-400">github-webhook</code>,
              que guarda autor, mensaje y líneas cambiadas. Aparecerán aquí cuando el webhook esté conectado.
            </p>
          </div>
        </div>

        <section className="rounded-2xl border border-gray-800 bg-gray-900 p-4 sm:p-5 lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Últimos pushes</h3>
          {commits.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-500">Todavía no hay commits en este proyecto.</p>
          ) : (
            <ol className="space-y-2">
              {commits.map((c) => (
                <li key={c.sha} className="flex gap-3 rounded-xl border border-gray-800 bg-gray-800/30 p-3">
                  <Avatar partner={{ ...PARTNER_META[c.author], avatarUrl: null }} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white">{c.message}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                      <span className="text-gray-300">{PARTNER_META[c.author].name}</span>
                      <a
                        href={`${repoUrl}/commit/${c.sha}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-mono hover:text-indigo-300"
                      >
                        <GitCommitHorizontal className="h-3 w-3" />
                        {c.sha.slice(0, 7)}
                      </a>
                      <span className="font-mono">{c.branch}</span>
                      <span>{formatRelative(c.committedAt)}</span>
                    </p>
                  </div>
                  <div className="shrink-0 text-right font-mono text-xs">
                    <p className="text-emerald-400">+{c.additions}</p>
                    <p className="text-rose-400">−{c.deletions}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
}
