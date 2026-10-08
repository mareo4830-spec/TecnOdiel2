import { BadgeCheck, CircleDashed, GitCommitHorizontal, type LucideIcon } from 'lucide-react';
import type { SessionVerification } from '../../types';

export const VERIFICATION_META: Record<SessionVerification, { label: string; icon: LucideIcon; badge: string }> = {
  push: {
    label: 'Verificada por push',
    icon: GitCommitHorizontal,
    badge: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  },
  aprobada: { label: 'Validada por un socio', icon: BadgeCheck, badge: 'bg-sky-500/15 text-sky-300 ring-sky-500/30' },
  pendiente: { label: 'Pendiente de validar', icon: CircleDashed, badge: 'bg-amber-500/15 text-amber-300 ring-amber-500/30' },
};

export const HOURS_TABS = [
  { id: 'horas', label: 'Horas' },
  { id: 'reparto', label: 'Reparto' },
  { id: 'fondo', label: 'Fondo común' },
] as const;

export type HoursTab = (typeof HOURS_TABS)[number]['id'];
