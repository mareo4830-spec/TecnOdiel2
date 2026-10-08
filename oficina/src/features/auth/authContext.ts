import { createContext, useContext } from 'react';
import type { AuthMode, AuthStatus, Partner, PartnerId } from '../../types';

export interface AuthContextValue {
  status: AuthStatus;
  mode: AuthMode;
  partner: Partner | null;
  error: string | null;
  /** Devuelve un mensaje de error o null si ha ido bien. */
  signInWithGoogle: () => Promise<string | null>;
  /** Solo disponible en modo demo (sin Supabase configurado). */
  signInDemo: (id: PartnerId) => void;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
