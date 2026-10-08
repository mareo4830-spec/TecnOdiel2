import {
  Clock,
  FolderKanban,
  Handshake,
  LayoutDashboard,
  MessagesSquare,
  Settings,
  SquareKanban,
} from 'lucide-react';
import type { NavItem } from '../types';

export const NAV_ITEMS: NavItem[] = [
  {
    path: '/',
    label: 'Panel',
    title: 'Panel general',
    icon: LayoutDashboard,
    phase: 1,
    description: 'Resumen del día, actividad del equipo y estado de los proyectos.',
  },
  {
    path: '/proyectos',
    label: 'Proyectos',
    title: 'Proyectos',
    icon: FolderKanban,
    phase: 2,
    description:
      'Una carpeta por cliente, vinculada a su business_id del SaaS, con repositorio, commits, preview y accesos rápidos.',
  },
  {
    path: '/kanban',
    label: 'Kanban',
    title: 'Kanban',
    icon: SquareKanban,
    phase: 3,
    description:
      'Tablero Por hacer / En progreso / Hecho, filtrable por proyecto y socio, con drag and drop.',
  },
  {
    path: '/horas',
    label: 'Horas y Reparto',
    title: 'Horas y Reparto',
    icon: Clock,
    phase: 5,
    description:
      'Check-ins por proyecto verificados con pushes a main, calculadora de reparto y fondo común.',
  },
  {
    path: '/crm',
    label: 'CRM',
    title: 'CRM de clientes',
    icon: Handshake,
    phase: 6,
    description:
      'Pipeline de leads de Contactado a Cerrado, con fichas y conversión a proyecto.',
  },
  {
    path: '/chats',
    label: 'Chats',
    title: 'Chats',
    icon: MessagesSquare,
    phase: 7,
    description:
      'Bandeja de conversaciones con clientes y chat interno del equipo en tiempo real.',
  },
  {
    path: '/ajustes',
    label: 'Ajustes',
    title: 'Ajustes',
    icon: Settings,
    phase: 1,
    description: 'Configuración de la agencia, la conexión y tu perfil.',
  },
];

export function getNavItem(pathname: string): NavItem {
  return (
    NAV_ITEMS.find((item) =>
      item.path === '/'
        ? pathname === '/'
        : pathname === item.path || pathname.startsWith(`${item.path}/`),
    ) ?? NAV_ITEMS[0]
  );
}
