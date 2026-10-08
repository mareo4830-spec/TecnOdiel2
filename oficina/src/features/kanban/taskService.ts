import { db, must, persist } from '../../lib/db';
import { createStore, useStore } from '../../lib/store';
import type { PartnerId, Task, TaskPriority, TaskStatus, TaskTag } from '../../types';
import { logActivity } from '../activity/activityService';
import { COLUMN_LABEL } from './kanbanMeta';

/*
 * Kanban de tareas. Con Supabase: tabla `tasks` + Realtime; cada movimiento guarda
 * status/order de las tarjetas que cambian. Sin Supabase: en memoria.
 */
const tasksStore = createStore<Task[]>([]);

interface TaskRow {
  id: string;
  title: string;
  project_id: string;
  status: TaskStatus;
  assignees: PartnerId[];
  tags: TaskTag[];
  due_date: string | null;
  priority: TaskPriority;
  order: number;
  created_at: string;
}

export async function loadTasks(): Promise<void> {
  const rows = await must<TaskRow[]>(db().from('tasks').select('*').order('order'));
  tasksStore.set(() =>
    rows.map((r) => ({
      id: r.id,
      title: r.title,
      projectId: r.project_id,
      status: r.status,
      assignees: r.assignees,
      tags: r.tags,
      dueDate: r.due_date,
      priority: r.priority,
      order: r.order,
      createdAt: r.created_at,
    })),
  );
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

  const before = new Map(tasksStore.get().map((t) => [t.id, t]));
  tasksStore.set((prev) => {
    const column = sortColumn(prev, status).filter((t) => t.id !== id);
    const at = beforeId ? column.findIndex((t) => t.id === beforeId) : -1;
    column.splice(at === -1 ? column.length : at, 0, { ...task, status });
    const reordered = new Map(column.map((t, i) => [t.id, { ...t, order: i }]));
    return prev.map((t) => reordered.get(t.id) ?? t);
  });

  // Solo se guardan las tarjetas cuyo estado u orden ha cambiado.
  const changed = tasksStore.get().filter((t) => {
    const old = before.get(t.id);
    return old && (old.status !== t.status || old.order !== t.order);
  });
  void persist('Mover tarea', () =>
    Promise.all(changed.map((t) => must(db().from('tasks').update({ status: t.status, order: t.order }).eq('id', t.id)))),
  );

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
  void persist('Crear tarea', () =>
    must(
      db().from('tasks').insert({
        id: task.id,
        title: task.title,
        project_id: task.projectId,
        status: task.status,
        assignees: task.assignees,
        tags: task.tags,
        due_date: task.dueDate,
        priority: task.priority,
        order: task.order,
        created_at: task.createdAt,
      }),
    ),
  );
  logActivity({ type: 'task', partnerId: by, projectId: task.projectId, action: `creó la tarea «${task.title}» en` });
  return task;
}

export async function deleteTask(id: string, by: PartnerId): Promise<boolean> {
  const task = tasksStore.get().find((t) => t.id === id);
  if (!task) return false;
  const ok = await persist('Eliminar tarea', () => must(db().from('tasks').delete().eq('id', id)));
  if (ok) {
    tasksStore.set((prev) => prev.filter((t) => t.id !== id));
    logActivity({ type: 'task', partnerId: by, projectId: task.projectId, action: `eliminó la tarea «${task.title}» de` });
  }
  return ok;
}
