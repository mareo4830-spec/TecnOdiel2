import { createContext, useContext } from 'react';
import type { AuthMode, AuthStatus, Partner } from '../../types';

export interface AuthContextValue {
  status: AuthStatus;
  mode: AuthMode;
  partner: Partner | null;
  error: string | null;
  /** Redirige a Google. Devuelve un mensaje de error o null si ha arrancado bien. */
  signInWithGoogle: () => Promise<string | null>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
