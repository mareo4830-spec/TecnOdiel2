import { Folder, LogIn, LogOut } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useCheckin } from '../../features/checkin/checkinContext';
import { STATUS_META } from '../../features/projects/projectMeta';
import { useProject, useProjects } from '../../features/projects/projectService';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useElapsed } from '../../hooks/useElapsed';
import { formatDuration } from '../../lib/format';

export function CheckinButton() {
  const { active, busy, checkIn, checkOut } = useCheckin();
  const elapsed = useElapsed(active?.startedAt ?? null);
  const activeProject = useProject(active?.projectId ?? undefined);
  const projects = useProjects();
  const [picking, setPicking] = useState(false);
  const close = useCallback(() => setPicking(false), []);
  const ref = useClickOutside<HTMLDivElement>(close, picking);

  // Primero los proyectos en los que se está trabajando.
  const sorted = [...projects].sort(
    (a, b) => Number(a.status === 'hecho') - Number(b.status === 'hecho') || b.updatedAt.localeCompare(a.updatedAt),
  );

  const start = (projectId: string | null) => {
    setPicking(false);
    void checkIn(projectId);
  };

  if (!active) {
    return (
      <div ref={ref} className="relative">
        <button
          onClick={() => setPicking((v) => !v)}
          disabled={busy}
          aria-expanded={picking}
          aria-haspopup="menu"
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-500 px-3 text-xs font-bold uppercase tracking-wide text-gray-950 shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-400 disabled:opacity-60 sm:px-4"
        >
          <LogIn className="h-4 w-4" />
          Check-in
        </button>

        {picking && (
          <div
            role="menu"
            className="fixed inset-x-4 top-16 z-50 overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl shadow-black/50 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80"
          >
            <p className="border-b border-gray-800 px-4 py-3 text-sm font-semibold text-white">¿En qué vas a trabajar?</p>
            <ul className="max-h-80 overflow-y-auto p-1.5">
              {sorted.map((p) => (
                <li key={p.id}>
                  <button
                    role="menuitem"
                    onClick={() => start(p.id)}
                    className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left hover:bg-gray-800"
                  >
                    <Folder className="h-4 w-4 shrink-0 text-indigo-300" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-white">{p.businessName}</span>
                      <span className="block truncate text-xs text-gray-400">{p.name}</span>
                    </span>
                    <span className="shrink-0 text-[11px] text-gray-500">{STATUS_META[p.status].label}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-800 p-1.5">
              <button
                role="menuitem"
                onClick={() => start(null)}
                className="w-full rounded-xl px-2.5 py-2 text-left text-sm text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                Tareas generales (no cuentan para el reparto)
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="inline-flex h-10 items-center overflow-hidden rounded-xl border border-emerald-500/40 bg-emerald-500/10">
      <span className="flex items-center gap-2 px-2 sm:px-3" aria-live="off">
        <span className="relative hidden h-2 w-2 sm:flex">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        {activeProject && (
          <span className="hidden max-w-36 truncate text-xs font-medium text-emerald-200 2xl:inline" title={activeProject.businessName}>
            {activeProject.businessName}
          </span>
        )}
        <span className="font-mono text-xs tabular-nums text-emerald-300 sm:text-sm">{formatDuration(elapsed)}</span>
      </span>
      <button
        onClick={() => void checkOut()}
        disabled={busy}
        aria-label="Hacer check-out"
        className="flex h-full items-center gap-2 border-l border-emerald-500/30 bg-rose-500/90 px-2.5 text-xs sm:px-3 font-bold uppercase tracking-wide text-white transition hover:bg-rose-500 disabled:opacity-60"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Check-out</span>
      </button>
    </div>
  );
}
