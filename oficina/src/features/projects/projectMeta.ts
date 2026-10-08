import {
  Coffee,
  Flower2,
  Scissors,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  Store,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';
import type { BusinessType, LayoutVariant, ProjectStatus } from '../../types';

export const BUSINESS_TYPE_META: Record<BusinessType, { label: string; icon: LucideIcon; tint: string }> = {
  barberia: { label: 'Barbería', icon: Scissors, tint: 'bg-sky-500/15 text-sky-300' },
  peluqueria: { label: 'Peluquería', icon: Sparkles, tint: 'bg-fuchsia-500/15 text-fuchsia-300' },
  salon: { label: 'Salón de belleza', icon: Sparkles, tint: 'bg-pink-500/15 text-pink-300' },
  estetica: { label: 'Estética', icon: Flower2, tint: 'bg-rose-500/15 text-rose-300' },
  restaurante: { label: 'Restaurante', icon: UtensilsCrossed, tint: 'bg-amber-500/15 text-amber-300' },
  cafeteria: { label: 'Cafetería', icon: Coffee, tint: 'bg-orange-500/15 text-orange-300' },
  clinica: { label: 'Clínica', icon: Stethoscope, tint: 'bg-teal-500/15 text-teal-300' },
  tienda: { label: 'Tienda', icon: ShoppingBag, tint: 'bg-lime-500/15 text-lime-300' },
  otro: { label: 'Otro', icon: Store, tint: 'bg-gray-500/15 text-gray-300' },
};

// Mismos valores que businesses.layout_key del SaaS (cada uno tiene 5 variantes de estilo).
export const LAYOUT_META: Record<LayoutVariant, { label: string }> = {
  classic: { label: 'Layout Classic' },
  editorial: { label: 'Layout Editorial' },
  minimal: { label: 'Layout Minimal' },
  playful: { label: 'Layout Playful' },
};

/** Etapas del Kanban de trabajos. Son también el estado de los proyectos. */
export const STATUS_META: Record<ProjectStatus, { label: string; badge: string; accent: string; hint: string }> = {
  planeado: {
    label: 'Planeado',
    badge: 'bg-gray-500/15 text-gray-300 ring-gray-500/30',
    accent: 'bg-gray-400',
    hint: 'Hay que ir a cerrarlo con el cliente',
  },
  en_progreso: {
    label: 'En progreso',
    badge: 'bg-indigo-500/15 text-indigo-300 ring-indigo-500/30',
    accent: 'bg-indigo-400',
    hint: 'Dijo que sí: desarrollando, personalizando o esperando sus datos',
  },
  hecho: {
    label: 'Hecho',
    badge: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
    accent: 'bg-emerald-400',
    hint: 'Entregado y publicado',
  },
};

export const STATUS_ORDER: ProjectStatus[] = ['planeado', 'en_progreso', 'hecho'];
export const BUSINESS_TYPES = Object.keys(BUSINESS_TYPE_META) as BusinessType[];
export const LAYOUTS: LayoutVariant[] = ['classic', 'editorial', 'minimal', 'playful'];

/** Badge de "esperando al cliente" (sub-estado de En progreso). */
export const WAITING_BADGE = 'bg-amber-500/15 text-amber-300 ring-amber-500/30';
