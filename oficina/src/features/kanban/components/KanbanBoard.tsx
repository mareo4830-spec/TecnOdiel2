import { Plus } from 'lucide-react';
import { useMemo, useState, type DragEvent, type FormEvent } from 'react';
import type { Project, Task, TaskStatus } from '../../../types';
import { useAuth } from '../../auth/authContext';
import { COLUMNS } from '../kanbanMeta';
import { createTask, moveTask, sortColumn } from '../taskService';
import { TaskCard } from './TaskCard';

interface KanbanBoardProps {
  tasks: Task[];
  projects: Project[];
  /** Versión reducida para el widget del Panel. */
  compact?: boolean;
  /** Máximo de tarjetas visibles por columna (compact). */
  maxPerColumn?: number;
  /** Proyecto preseleccionado al crear tareas (filtro activo). */
  defaultProjectId?: string;
}

interface DropTarget {
  status: TaskStatus;
  beforeId: string | null;
}

export function KanbanBoard({ tasks, projects, compact, maxPerColumn, defaultProjectId }: KanbanBoardProps) {
  const { partner } = useAuth();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);
  const [addingTo, setAddingTo] = useState<TaskStatus | null>(null);

  const projectNames = useMemo(() => new Map(projects.map((p) => [p.id, p.businessName])), [projects]);

  const move = (id: string, status: TaskStatus, beforeId: string | null) => {
    if (partner) moveTask(id, status, beforeId, partner.id);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, status: TaskStatus) => {
    if (!draggingId) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    // La tarjeta de destino es la primera cuyo centro queda por debajo del puntero.
    const cards = [...e.currentTarget.querySelectorAll<HTMLElement>('[data-task-id]')];
    const before = cards.find((el) => {
      if (el.dataset.taskId === draggingId) return false;
      const r = el.getBoundingClientRect();
      return e.clientY < r.top + r.height / 2;
    });
    const beforeId = before?.dataset.taskId ?? null;
    if (dropTarget?.status !== status || dropTarget.beforeId !== beforeId) setDropTarget({ status, beforeId });
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, status: TaskStatus) => {
    e.preventDefault();
    const id = draggingId ?? e.dataTransfer.getData('text/plain');
    if (id) move(id, status, dropTarget?.status === status ? dropTarget.beforeId : null);
    setDraggingId(null);
    setDropTarget(null);
  };

  const indicator = <div className="h-0.5 rounded-full bg-indigo-400 shadow-[0_0_8px] shadow-indigo-500" />;

  return (
    <div
      className={
        compact
          ? 'no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 md:grid md:grid-cols-3 md:overflow-visible'
          : 'no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0'
      }
    >
      {COLUMNS.map((col) => {
        const all = sortColumn(tasks, col.id);
        const visible = maxPerColumn ? all.slice(0, maxPerColumn) : all;
        const hidden = all.length - visible.length;
        const isTarget = dropTarget?.status === col.id;
        // undefined = esta columna no es destino; null = soltar al final.
        const targetBefore = isTarget ? dropTarget.beforeId : undefined;

        return (
          <section
            key={col.id}
            aria-label={col.label}
            className={`flex shrink-0 flex-col rounded-2xl border bg-gray-900/60 transition ${
              compact ? 'w-64 p-2.5 md:w-auto' : 'w-[85%] max-w-sm snap-center p-3 sm:w-80 lg:w-auto lg:max-w-none'
            } ${isTarget ? 'border-indigo-500/60 bg-indigo-500/5' : 'border-gray-800'}`}
          >
            <header className="mb-3 flex items-center gap-2 px-1">
              <span className={`h-2 w-2 rounded-full ${col.accent}`} />
              <h3 className="text-sm font-semibold text-white">{col.label}</h3>
              <span className="rounded-md bg-gray-800 px-1.5 text-xs font-medium text-gray-400">{all.length}</span>
              {!compact && (
                <button
                  onClick={() => setAddingTo(col.id)}
                  aria-label={`Añadir tarea en ${col.label}`}
                  className="ml-auto rounded-md p-1 text-gray-500 hover:bg-gray-800 hover:text-white"
                >
                  <Plus className="h-4 w-4" />
                </button>
              )}
            </header>

            <div
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setDropTarget(null);
              }}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`flex flex-1 flex-col gap-2 ${compact ? 'min-h-24' : 'min-h-40'}`}
            >
              {addingTo === col.id && (
                <QuickAdd
                  projects={projects}
                  defaultProjectId={defaultProjectId}
                  onCancel={() => setAddingTo(null)}
                  onSubmit={(title, projectId) => {
                    if (partner) createTask({ title, projectId, status: col.id }, partner.id);
                    setAddingTo(null);
                  }}
                />
              )}

              {visible.map((task) => (
                <div key={task.id}>
                  {targetBefore === task.id && <div className="mb-2">{indicator}</div>}
                  <TaskCard
                    task={task}
                    compact={compact}
                    projectName={projectNames.get(task.projectId)}
                    dragging={draggingId === task.id}
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', task.id);
                      e.dataTransfer.effectAllowed = 'move';
                      setDraggingId(task.id);
                    }}
                    onDragEnd={() => {
                      setDraggingId(null);
                      setDropTarget(null);
                    }}
                    onMoveTo={(status) => move(task.id, status, null)}
                  />
                </div>
              ))}
              {targetBefore === null && indicator}

              {all.length === 0 && addingTo !== col.id && (
                <p className="grid flex-1 place-items-center rounded-xl border border-dashed border-gray-800 p-4 text-center text-xs text-gray-500">
                  {draggingId ? 'Suelta la tarea aquí' : 'Sin tareas'}
                </p>
              )}
              {hidden > 0 && <p className="px-1 text-xs text-gray-500">+{hidden} más</p>}
            </div>
          </section>
        );
      })}
    </div>
  );
}

interface QuickAddProps {
  projects: Project[];
  defaultProjectId?: string;
  onSubmit: (title: string, projectId: string) => void;
  onCancel: () => void;
}

function QuickAdd({ projects, defaultProjectId, onSubmit, onCancel }: QuickAddProps) {
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState(defaultProjectId ?? projects[0]?.id ?? '');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (title.trim() && projectId) onSubmit(title.trim(), projectId);
  };

  return (
    <form onSubmit={submit} className="space-y-2 rounded-xl border border-indigo-500/50 bg-gray-800/60 p-2.5">
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === 'Escape' && onCancel()}
        placeholder="Título de la tarea"
        aria-label="Título de la tarea"
        className="w-full rounded-lg border border-gray-700 bg-gray-900 px-2.5 py-2 text-sm text-white placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none"
      />
      <select
        value={projectId}
        onChange={(e) => setProjectId(e.target.value)}
        aria-label="Proyecto"
        className="w-full rounded-lg border border-gray-700 bg-gray-900 px-2.5 py-2 text-xs text-gray-200 focus:border-indigo-500 focus:outline-none"
      >
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.businessName} · {p.name}
          </option>
        ))}
      </select>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-lg px-2.5 py-1.5 text-xs text-gray-400 hover:text-white">
          Cancelar
        </button>
        <button
          type="submit"
          disabled={!title.trim()}
          className="rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          Añadir
        </button>
      </div>
    </form>
  );
}
