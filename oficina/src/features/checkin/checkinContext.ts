import { createContext, useContext } from 'react';
import type { CheckinSession } from '../../types';

export interface CheckinContextValue {
  active: CheckinSession | null;
  busy: boolean;
  /** Las horas solo cuentan para el reparto si la sesión va asociada a un proyecto. */
  checkIn: (projectId: string | null) => Promise<void>;
  checkOut: () => Promise<void>;
}

export const CheckinContext = createContext<CheckinContextValue | null>(null);

export function useCheckin(): CheckinContextValue {
  const ctx = useContext(CheckinContext);
  if (!ctx) throw new Error('useCheckin debe usarse dentro de <CheckinProvider>');
  return ctx;
}
