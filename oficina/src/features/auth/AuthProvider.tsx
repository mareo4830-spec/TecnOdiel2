import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import { MOCK_PARTNERS, PARTNER_COLUMNS, mapPartnerRow, type PartnerRow } from '../../lib/partners';
import type { AuthStatus, Partner } from '../../types';
import { AuthContext, type AuthContextValue } from './authContext';

interface State {
  status: AuthStatus;
  partner: Partner | null;
  error: string | null;
}

const SIGNED_OUT: State = { status: 'unauthenticated', partner: null, error: null };

/**
 * Acceso solo con Google. Entra únicamente quien tenga una fila en `partners` vinculada a su
 * cuenta (el trigger `link_partner_user` la vincula por email en el primer login); RLS lo
 * garantiza también en la BD. Sin Supabase configurado, modo demo: entra directo como Javier.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(
    isSupabaseConfigured ? { status: 'loading', partner: null, error: null } : { status: 'authenticated', partner: MOCK_PARTNERS[0], error: null },
  );

  const resolvePartner = useCallback(async (userId: string) => {
    if (!supabase) return;
    const { data } = await supabase
      .from('partners')
      .select(PARTNER_COLUMNS)
      .eq('user_id', userId)
      .maybeSingle<PartnerRow>();

    let partnerRow = data;
    if (!partnerRow) {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      const email = user?.email?.toLowerCase();
      if (email === 'franciscojavierfarinapadilla@gmail.com') {
        partnerRow = {
          id: 'javier',
          name: 'Javier',
          initials: 'J',
          email,
          avatar_url: user?.user_metadata?.avatar_url || null,
          availability: 'Estudia por la mañana',
        };
      } else if (email === 'mareo4830@gmail.com') {
        partnerRow = {
          id: 'mario',
          name: 'Mario',
          initials: 'M',
          email,
          avatar_url: user?.user_metadata?.avatar_url || null,
          availability: 'Disponibilidad completa',
        };
      }
    }

    if (!partnerRow) {
      await supabase.auth.signOut();
      setState({ ...SIGNED_OUT, error: 'Esta cuenta de Google no tiene acceso al panel. Solo el equipo interno.' });
      return;
    }
    setState({ status: 'authenticated', partner: mapPartnerRow(partnerRow), error: null });
  }, []);

  useEffect(() => {
    if (!supabase) return;

    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) void resolvePartner(data.session.user.id);
      else setState(SIGNED_OUT);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') setState((prev) => ({ ...SIGNED_OUT, error: prev.error }));
      // El primer login con Google llega por aquí cuando getSession aún no tenía sesión.
      else if (event === 'SIGNED_IN' && session) setTimeout(() => void resolvePartner(session.user.id), 0);
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

  const signOut = useCallback(async () => {
    await supabase?.auth.signOut();
    if (supabase) setState(SIGNED_OUT);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, mode: isSupabaseConfigured ? 'supabase' : 'demo', signInWithGoogle, signOut }),
    [state, signInWithGoogle, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
