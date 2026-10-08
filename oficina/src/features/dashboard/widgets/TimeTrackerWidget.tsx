import { Folder, Play, Square } from 'lucide-react';
import { useCallback, useState } from 'react';
import { RollingText } from '../../../components/motion/RollingText';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { useElapsed } from '../../../hooks/useElapsed';
import { formatDuration } from '../../../lib/format';
import { toast } from '../../../lib/toast';
import { useCheckin } from '../../checkin/checkinContext';
import { useProject, useProjects } from '../../projects/projectService';

/**
 * Jornada: la tarjeta de check-in del Panel, con degradado de marca y temporizador que rueda
 * dígito a dígito. Play elige el proyecto en el que se va a trabajar; el botón rojo ficha la salida.
 */
export function TimeTrackerWidget() {
  const { active, busy, checkIn, checkOut } = useCheckin();
  const elapsed = useElapsed(active?.startedAt ?? null);
  const project = useProject(active?.projectId ?? undefined);
  const projects = useProjects();
  const [picking, setPicking] = useState(false);
  const close = useCallback(() => setPicking(false), []);
  const ref = useClickOutside<HTMLDivElement>(close, picking);

  const sorted = [...projects].sort(
    (a, b) => Number(a.status === 'hecho') - Number(b.status === 'hecho') || b.updatedAt.localeCompare(a.updatedAt),
  );

  const start = (projectId: string | null) => {
    setPicking(false);
    void checkIn(projectId).then(() => toast('Jornada iniciada'));
  };
  const stop = () => void checkOut().then(() => toast('Jornada guardada en Horas'));

  return (
    <div
      ref={ref}
      className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-800 p-5 text-gray-950 shadow-lg shadow-indigo-900/30"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-2xl"
      />
      <div aria-hidden className="pointer-events-none absolute -bottom-14 -left-8 h-36 w-36 rounded-full bg-gray-950/10 blur-2xl" />

      <div className="relative flex items-center justify-between gap-2">
        <p className="text-sm font-bold uppercase tracking-wide">Jornada</p>
        {active && (
          <span className="relative flex h-2 w-2" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gray-950/70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gray-950" />
          </span>
        )}
      </div>

      <div className="relative mt-1">
        <p className="truncate text-xs font-medium text-gray-950/70">
          {active ? project?.businessName ?? 'Tareas generales' : 'Ficha para que tus horas cuenten'}
        </p>
        <p className="mt-1 font-mono text-[2.5rem] font-bold leading-none tabular-nums tracking-tight" aria-live="off">
          <RollingText text={formatDuration(elapsed)} />
        </p>
      </div>

      <div className="relative mt-4 flex items-center gap-3">
        <button
          onClick={() => !active && setPicking((v) => !v)}
          disabled={busy || !!active}
          aria-label="Empezar jornada"
          aria-expanded={picking}
          className="grid h-11 w-11 place-items-center rounded-full bg-gray-950 text-indigo-400 shadow-lg transition hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <Play className="h-4 w-4 translate-x-px fill-current" />
        </button>
        <button
          onClick={stop}
          disabled={busy || !active}
          aria-label="Terminar jornada (check-out)"
          className="grid h-11 w-11 place-items-center rounded-full bg-rose-600 text-white shadow-lg transition hover:scale-105 active:scale-95 disabled:opacity-40"
        >
          <Square className="h-3.5 w-3.5 fill-current" />
        </button>
      </div>

      {picking && (
        <div
          role="menu"
          className="absolute inset-x-3 bottom-[4.5rem] z-50 max-h-64 overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 text-white shadow-2xl shadow-black/50"
        >
          <p className="border-b border-gray-800 px-4 py-3 text-sm font-semibold text-white">¿En qué vas a trabajar?</p>
          <ul className="max-h-44 overflow-y-auto p-1.5">
            {sorted.length === 0 && <li className="px-3 py-2 text-sm text-gray-400">Todavía no hay proyectos.</li>}
            {sorted.map((p) => (
              <li key={p.id}>
                <button role="menuitem" onClick={() => start(p.id)} className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left hover:bg-gray-800">
                  <Folder className="h-4 w-4 shrink-0 text-indigo-400" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-white">{p.businessName}</span>
                    <span className="block truncate text-xs text-gray-400">{p.name}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-800 p-1.5">
            <button role="menuitem" onClick={() => start(null)} className="w-full rounded-xl px-2.5 py-2 text-left text-sm text-gray-400 hover:bg-gray-800">
              Tareas generales (no cuentan para el reparto)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
