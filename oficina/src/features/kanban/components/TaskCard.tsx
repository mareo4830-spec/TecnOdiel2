import { ArrowRight, CalendarDays, Flag, Folder, MoreHorizontal } from 'lucide-react';
import { useState, type DragEvent } from 'react';
import { Link } from 'react-router-dom';
import { AvatarStack } from '../../../components/ui/AvatarStack';
import { daysUntil, formatDueDate } from '../../../lib/format';
import type { Task, TaskStatus } from '../../../types';
import { COLUMNS, PRIORITY_META, TAG_META } from '../kanbanMeta';

interface TaskCardProps {
  task: Task;
  projectName?: string;
  compact?: boolean;
  dragging?: boolean;
  onDragStart: (e: DragEvent<HTMLElement>) => void;
  onDragEnd: () => void;
  onMoveTo: (status: TaskStatus) => void;
}

function dueClass(task: Task): string {
  if (!task.dueDate || task.status === 'hecho') return 'bg-gray-800 text-gray-400';
  const diff = daysUntil(task.dueDate);
  if (diff < 0) return 'bg-rose-500/15 text-rose-300';
  if (diff <= 1) return 'bg-amber-500/15 text-amber-300';
  return 'bg-gray-800 text-gray-300';
}

export function TaskCard({ task, projectName, compact, dragging, onDragStart, onDragEnd, onMoveTo }: TaskCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const done = task.status === 'hecho';
  const priority = PRIORITY_META[task.priority];

  return (
    <article
      data-task-id={task.id}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`group cursor-grab rounded-xl border border-gray-800 bg-gray-800/60 p-3 transition duration-300 hover:-translate-y-0.5 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-black/20 active:cursor-grabbing ${
        dragging ? 'rotate-2 scale-105 opacity-50 shadow-2xl ring-2 ring-indigo-500/60' : ''
      }`}
    >
      <div className="flex items-start gap-2">
        <h4 className={`flex-1 text-sm font-medium leading-snug ${done ? 'text-gray-400' : 'text-white'}`}>{task.title}</h4>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={`Mover «${task.title}»`}
          aria-expanded={menuOpen}
          className="-mr-1 -mt-1 rounded-md p-1 text-gray-500 hover:bg-gray-700 hover:text-white"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {projectName && (
        <Link
          to={`/proyectos/${task.projectId}`}
          draggable={false}
          className="mt-1 inline-flex max-w-full items-center gap-1 text-xs text-gray-400 hover:text-indigo-300"
        >
          <Folder className="h-3 w-3 shrink-0" />
          <span className="truncate">{projectName}</span>
        </Link>
      )}

      {!compact && task.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {task.tags.map((tag) => (
            <span key={tag} className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${TAG_META[tag].className}`}>
              {TAG_META[tag].label}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AvatarStack ids={task.assignees} />
          {compact && task.tags[0] && (
            <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${TAG_META[task.tags[0]].className}`}>
              {TAG_META[task.tags[0]].label}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {!compact && !done && (
            <span title={`Prioridad ${priority.label.toLowerCase()}`}>
              <Flag className={`h-3.5 w-3.5 ${priority.className}`} aria-label={`Prioridad ${priority.label}`} />
            </span>
          )}
          {task.dueDate && (
            <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium ${dueClass(task)}`}>
              <CalendarDays className="h-3 w-3" />
              {formatDueDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-gray-700/60 pt-2.5">
          <span className="text-[11px] text-gray-500">Mover a</span>
          {COLUMNS.filter((c) => c.id !== task.status).map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setMenuOpen(false);
                onMoveTo(c.id);
              }}
              className="inline-flex items-center gap-1 rounded-md bg-gray-700/60 px-2 py-1 text-[11px] font-medium text-gray-200 hover:bg-indigo-600 hover:text-white"
            >
              <ArrowRight className="h-3 w-3" />
              {c.label}
            </button>
          ))}
        </div>
      )}
    </article>
  );
}
