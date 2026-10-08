import { Activity, Clock, FolderKanban, PiggyBank, Plug, SquareKanban, type LucideIcon } from 'lucide-react';
import type { ComponentType } from 'react';
import { ActivityWidget, LiveBadge } from './widgets/ActivityWidget';
import { FundWidget } from './widgets/FundWidget';
import { HoursTodayWidget } from './widgets/HoursTodayWidget';
import { IntegrationsWidget } from './widgets/IntegrationsWidget';
import { KanbanWidget } from './widgets/KanbanWidget';
import { MyProjectsWidget } from './widgets/MyProjectsWidget';

export interface DashboardWidget {
  id: string;
  title: string;
  icon: LucideIcon;
  phase: number;
  description: string;
  /** Posición en el grid: 1 col en móvil, 2 en md, 12 en xl. */
  className: string;
  /** Widget real. Si no hay, se muestra el placeholder de su fase. */
  component?: ComponentType;
  link?: { label: string; to: string };
  badge?: ComponentType;
}

/** Widgets del Panel, en orden. El Kanban de trabajos va arriba, donde estaba la bienvenida. */
export const DASHBOARD_WIDGETS: DashboardWidget[] = [
  {
    id: 'kanban',
    title: 'Kanban',
    icon: SquareKanban,
    phase: 3,
    description: 'Trabajos por etapa: planeado, en progreso y hecho (proyectos y tenants).',
    className: 'md:col-span-2 xl:col-span-8',
    component: KanbanWidget,
    link: { label: 'Ver tablero', to: '/kanban' },
  },
  {
    id: 'integrations',
    title: 'Integraciones',
    icon: Plug,
    phase: 2,
    description: 'Estado de Supabase, GitHub, Vercel y WhatsApp.',
    className: 'md:col-span-2 xl:col-span-4',
    component: IntegrationsWidget,
  },
  {
    id: 'projects',
    title: 'Mis proyectos',
    icon: FolderKanban,
    phase: 2,
    description: 'Carpetas de clientes con estado, progreso y socios que han trabajado en cada una.',
    className: 'md:col-span-2 xl:col-span-4',
    component: MyProjectsWidget,
    link: { label: 'Ver todos', to: '/proyectos' },
  },
  {
    id: 'hours',
    title: 'Horas de hoy',
    icon: Clock,
    phase: 5,
    description: 'Horas verificadas por socio y proyecto, con el tope diario de 8 h.',
    className: 'xl:col-span-4',
    component: HoursTodayWidget,
    link: { label: 'Ver horas', to: '/horas' },
  },
  {
    id: 'fund',
    title: 'Fondo común',
    icon: PiggyBank,
    phase: 5,
    description: 'Saldo acumulado, reserva mínima, gastos y saldo repartible.',
    className: 'xl:col-span-4',
    component: FundWidget,
    link: { label: 'Ver fondo', to: '/horas?tab=fondo' },
  },
  {
    id: 'activity',
    title: 'Actividad del equipo',
    icon: Activity,
    phase: 2,
    description: 'Timeline en tiempo real: pushes, check-ins y movimientos de tareas.',
    className: 'md:col-span-2 xl:col-span-12',
    component: ActivityWidget,
    badge: LiveBadge,
  },
];
