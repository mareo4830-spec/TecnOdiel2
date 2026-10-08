import { removeProjectActivity } from '../activity/activityService';
import { unlinkProjectLeads } from '../crm/leadService';
import { removeProjectHours } from '../hours/hoursService';
import { removeProjectTasks } from '../kanban/taskService';
import { removeProjectTenants } from '../tenants/tenantService';
import { removeProject } from './projectService';

/**
 * Borra un proyecto y todo lo que cuelga de él (tenants, tareas, commits, sesiones y su
 * actividad). Los leads y movimientos del fondo se conservan, solo pierden el enlace.
 * Vive aparte de projectService para no crear dependencias circulares entre servicios.
 */
export function deleteProject(id: string): void {
  removeProjectTenants(id);
  removeProjectTasks(id);
  removeProjectHours(id);
  unlinkProjectLeads(id);
  removeProjectActivity(id);
  removeProject(id);
}
