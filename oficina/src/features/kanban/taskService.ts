import { iso } from '../../lib/rows';
import { useStore } from '../../lib/store';
import { createSyncedStore } from '../../lib/syncedStore';
import type { PartnerId, Task, TaskStatus } from '../../types';
import { logActivity } from '../activity/activityService';
import { COLUMN_LABEL } from './kanbanMeta';

/* Kanban de tareas técnicas: tabla `tasks`. Cada movimiento actualiza solo status/order. */
const tasksStore = createSyncedStore<Task>([], {
  table: 'tasks',
  persistKey: 'tasks',
  toRow: (t) => ({
    id: t.id,
    title: t.title,
    project_id: t.projectId,
    status: t.status,
    assignees: t.assignees,
    tags: t.tags,
    due_date: t.dueDate,
    priority: t.priority,
    order: t.order,
    created_at: t.createdAt,
  }),
  fromRow: (r) => ({
    id: r.id,
    title: r.title,
    projectId: r.project_id,
    status: r.status,
    assignees: r.assignees ?? [],
    tags: r.tags ?? [],
    dueDate: r.due_date,
    priority: r.priority,
    order: r.order,
    createdAt: iso(r.created_at),
  }),
  order: { column: 'created_at', ascending: true },
});

export function removeProjectTasks(projectId: string): void {
  tasksStore.set((prev) => prev.filter((t) => t.projectId !== projectId));
}

export function useTasks(): Task[] {
  return useStore(tasksStore);
}

/** Tareas de una columna en su orden visual. */
export function sortColumn(tasks: Task[], status: TaskStatus): Task[] {
  return tasks.filter((t) => t.status === status).sort((a, b) => a.order - b.order);
}

/**
 * Mueve una tarea a `status`, justo antes de `beforeId` (o al final si es null).
 * Se usa un id de referencia y no un índice para que funcione aunque haya filtros activos.
 */
export function moveTask(id: string, status: TaskStatus, beforeId: string | null, by: PartnerId): void {
  const task = tasksStore.get().find((t) => t.id === id);
  if (!task || id === beforeId) return;
  const statusChanged = task.status !== status;

  tasksStore.set((prev) => {
    const column = sortColumn(prev, status).filter((t) => t.id !== id);
    const at = beforeId ? column.findIndex((t) => t.id === beforeId) : -1;
    column.splice(at === -1 ? column.length : at, 0, { ...task, status });
    const reordered = new Map(column.map((t, i) => [t.id, { ...t, order: i }]));
    return prev.map((t) => reordered.get(t.id) ?? t);
  });

  if (statusChanged) {
    logActivity({
      type: 'task',
      partnerId: by,
      projectId: task.projectId,
      action: `movió «${task.title}» a ${COLUMN_LABEL[status]} en`,
    });
  }
}

export function createTask(input: Pick<Task, 'title' | 'projectId' | 'status'>, by: PartnerId): Task {
  const column = sortColumn(tasksStore.get(), input.status);
  const task: Task = {
    ...input,
    id: crypto.randomUUID(),
    assignees: [by],
    tags: [],
    dueDate: null,
    priority: 'media',
    order: column.length ? column[column.length - 1].order + 1 : 0,
    createdAt: new Date().toISOString(),
  };
  tasksStore.set((prev) => [...prev, task]);
  logActivity({ type: 'task', partnerId: by, projectId: task.projectId, action: `creó la tarea «${task.title}» en` });
  return task;
}
