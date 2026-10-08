import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import { MOCK_PARTNERS, PARTNER_COLUMNS, mapPartnerRow, type PartnerRow } from '../../lib/partners';
import type { AuthStatus, Partner, PartnerId } from '../../types';
import { AuthContext, type AuthContextValue } from './authContext';

const DEMO_KEY = 'ov.demo.partner';

interface State {
  status: AuthStatus;
  partner: Partner | null;
  error: string | null;
}

const SIGNED_OUT: State = { status: 'unauthenticated', partner: null, error: null };

function readDemoPartner(): Partner | null {
  try {
    const id = localStorage.getItem(DEMO_KEY);
    return MOCK_PARTNERS.find((p) => p.id === id) ?? null;
  } catch {
    return null;
  }
}

/**
 * Acceso solo con Google. Entra únicamente quien tenga una fila en `partners` vinculada a su
 * cuenta (el trigger `link_partner_user` la vincula por email en el primer login); RLS lo
 * garantiza también en la BD. Misma sesión que la landing de TecnOdiel (mismo storageKey): si
 * ya entraste allí con Google, aquí no hace falta volver a hacerlo.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({ status: 'loading', partner: null, error: null });

  const resolvePartner = useCallback(async (userId: string) => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('partners')
      .select(PARTNER_COLUMNS)
      .eq('user_id', userId)
      .maybeSingle<PartnerRow>();

    if (error || !data) {
      await supabase.auth.signOut();
      setState({ ...SIGNED_OUT, error: 'Esta cuenta de Google no tiene acceso al panel. Solo el equipo interno.' });
      return;
    }
    setState({ status: 'authenticated', partner: mapPartnerRow(data), error: null });
  }, []);

  useEffect(() => {
    if (!supabase) {
      const partner = readDemoPartner();
      setState(partner ? { status: 'authenticated', partner, error: null } : SIGNED_OUT);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) void resolvePartner(data.session.user.id);
      else setState(SIGNED_OUT);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setState((prev) => ({ ...SIGNED_OUT, error: prev.error }));
      } else if (event === 'SIGNED_IN' && session) {
        // El primer login con Google (o el que llega ya hecho desde la landing) pasa por aquí.
        setTimeout(() => void resolvePartner(session.user.id), 0);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [resolvePartner]);

  const signInWithGoogle = useCallback<AuthContextValue['signInWithGoogle']>(async () => {
    if (!supabase) return 'Supabase no está configurado.';
    setState((prev) => ({ ...prev, error: null }));
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + import.meta.env.BASE_URL, queryParams: { prompt: 'select_account' } },
    });
    return error ? 'No se ha podido iniciar sesión con Google. Inténtalo de nuevo.' : null;
  }, []);

  const signInDemo = useCallback((id: PartnerId) => {
    if (isSupabaseConfigured) return;
    const partner = MOCK_PARTNERS.find((p) => p.id === id) ?? null;
    try {
      localStorage.setItem(DEMO_KEY, id);
    } catch {
      /* sin almacenamiento: la sesión demo dura hasta recargar */
    }
    setState({ status: 'authenticated', partner, error: null });
  }, []);

  const signOut = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut();
    } else {
      try {
        localStorage.removeItem(DEMO_KEY);
      } catch {
        /* ignorado */
      }
    }
    setState(SIGNED_OUT);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      mode: isSupabaseConfigured ? 'supabase' : 'demo',
      signInWithGoogle,
      signInDemo,
      signOut,
    }),
    [state, signInWithGoogle, signInDemo, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
