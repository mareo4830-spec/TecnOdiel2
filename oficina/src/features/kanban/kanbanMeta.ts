import type { TaskPriority, TaskStatus, TaskTag } from '../../types';

/** Columnas del tablero, en orden. Para añadir "Revisión" basta con sumarla aquí y a TaskStatus. */
export const COLUMNS: { id: TaskStatus; label: string; accent: string }[] = [
  { id: 'por_hacer', label: 'Por hacer', accent: 'bg-gray-400' },
  { id: 'en_progreso', label: 'En progreso', accent: 'bg-indigo-400' },
  { id: 'hecho', label: 'Hecho', accent: 'bg-emerald-400' },
];

export const COLUMN_LABEL: Record<TaskStatus, string> = Object.fromEntries(
  COLUMNS.map((c) => [c.id, c.label]),
) as Record<TaskStatus, string>;

export const TAG_META: Record<TaskTag, { label: string; className: string }> = {
  frontend: { label: 'Frontend', className: 'bg-sky-500/15 text-sky-300' },
  backend: { label: 'Backend', className: 'bg-violet-500/15 text-violet-300' },
  seo: { label: 'SEO', className: 'bg-emerald-500/15 text-emerald-300' },
  seguridad: { label: 'Seguridad', className: 'bg-rose-500/15 text-rose-300' },
  cliente: { label: 'Cliente', className: 'bg-amber-500/15 text-amber-300' },
  devops: { label: 'DevOps', className: 'bg-cyan-500/15 text-cyan-300' },
  diseno: { label: 'Diseño', className: 'bg-fuchsia-500/15 text-fuchsia-300' },
};

export const TAGS = Object.keys(TAG_META) as TaskTag[];

export const PRIORITY_META: Record<TaskPriority, { label: string; className: string }> = {
  alta: { label: 'Alta', className: 'text-rose-400' },
  media: { label: 'Media', className: 'text-amber-400' },
  baja: { label: 'Baja', className: 'text-gray-500' },
};
