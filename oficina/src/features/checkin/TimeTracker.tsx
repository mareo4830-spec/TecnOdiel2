import { Folder, Play, Square } from 'lucide-react';
import { RollingText } from '../../components/ui/RollingText';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useState } from 'react';
import { toast } from '../../components/ui/Toast';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useElapsed } from '../../hooks/useElapsed';
import { formatDuration } from '../../lib/format';
import { useProject, useProjects } from '../projects/projectService';
import { useCheckin } from './checkinContext';

/**
 * Time Tracker: el check-in de la jornada en una tarjeta de acento con ondas.
 * Play elige el proyecto y empieza; el botón rojo hace check-out.
 */
export function TimeTracker({ compact = false }: { compact?: boolean }) {
  const { active, busy, checkIn, checkOut } = useCheckin();
  const elapsed = useElapsed(active?.startedAt ?? null);
  const project = useProject(active?.projectId ?? undefined);
  const projects = useProjects();
  const [picking, setPicking] = useState(false);
  const close = useCallback(() => setPicking(false), []);
  const ref = useClickOutside<HTMLDivElement>(close, picking);

  const sorted = [...projects]
    .filter((p) => p.kind === 'standard' || p.kind === 'saas')
    .sort((a, b) => Number(a.status === 'hecho') - Number(b.status === 'hecho') || b.updatedAt.localeCompare(a.updatedAt));

  const start = (projectId: string | null) => {
    setPicking(false);
    void checkIn(projectId).then(() => toast('Jornada iniciada'));
  };
  const stop = () => void checkOut().then(() => toast('Jornada guardada en Horas'));

  return (
    <div ref={ref} className={`waves on-accent relative rounded-2xl text-white ${compact ? 'p-3.5' : 'p-5'}`}>
      <div className="flex items-center justify-between gap-2">
        <p className={`font-semibold ${compact ? 'text-sm' : 'text-base'}`}>{compact ? 'Jornada' : 'Time Tracker'}</p>
        {active && (
          <span className="relative flex h-2 w-2" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
        )}
      </div>
      <p className={`mt-1 truncate text-white/70 ${compact ? 'text-[11px]' : 'text-xs'}`}>
        {active ? project?.businessName ?? 'Tareas generales' : 'Ficha para que tus horas cuenten'}
      </p>
      <p
        className={`font-bold tabular-nums tracking-tight ${compact ? 'mt-2 text-2xl' : 'mt-3 text-[2.6rem] leading-none'}`}
        aria-live="off"
      >
        {/* Cada dígito rueda al cambiar, como en el Time Tracker de Fernly. */}
        <RollingText text={formatDuration(elapsed)} />
      </p>
      <div className={`flex items-center justify-center gap-3 ${compact ? 'mt-3' : 'mt-4'}`}>
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => !active && setPicking((v) => !v)}
          disabled={busy || !!active}
          aria-label="Empezar jornada"
          aria-expanded={picking}
          className={`grid place-items-center rounded-full bg-paper text-indigo-800 shadow-lg disabled:opacity-50 ${compact ? 'h-9 w-9' : 'h-11 w-11'}`}
        >
          <Play className="h-4 w-4 translate-x-px fill-current" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={stop}
          disabled={busy || !active}
          aria-label="Terminar jornada (check-out)"
          className={`grid place-items-center rounded-full bg-rose-600 text-white shadow-lg disabled:opacity-40 ${compact ? 'h-9 w-9' : 'h-11 w-11'}`}
        >
          <Square className="h-3.5 w-3.5 fill-current" />
        </motion.button>
      </div>

      <AnimatePresence>
        {picking && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            style={{ ['--color-white' as string]: '#151a16' }}
            className={`absolute z-50 w-72 overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 text-white shadow-2xl shadow-black/20 ${
              compact ? 'bottom-full left-0 mb-2' : 'right-0 top-full mt-2'
            }`}
          >
            <p className="border-b border-gray-800 px-4 py-3 text-sm font-semibold text-white">¿En qué vas a trabajar?</p>
            <ul className="max-h-64 overflow-y-auto p-1.5">
              {sorted.length === 0 && <li className="px-3 py-2 text-sm text-gray-400">Todavía no hay proyectos.</li>}
              {sorted.map((p) => (
                <li key={p.id}>
                  <button role="menuitem" onClick={() => start(p.id)} className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left hover:bg-gray-950">
                    <Folder className="h-4 w-4 shrink-0 text-indigo-600" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-white">{p.businessName}</span>
                      <span className="block truncate text-xs text-gray-400">{p.name}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-800 p-1.5">
              <button role="menuitem" onClick={() => start(null)} className="w-full rounded-xl px-2.5 py-2 text-left text-sm text-gray-400 hover:bg-gray-950">
                Tareas generales (no cuentan para el reparto)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
