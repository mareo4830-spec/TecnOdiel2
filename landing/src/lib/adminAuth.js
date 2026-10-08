import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

/*
 * Sesión de Google contra el proyecto Supabase de la Oficina Virtual. Solo clave pública (anon):
 * la autorización real la hace la BD. Una cuenta es admin si tiene una fila en `partners`
 * vinculada a su usuario (RLS); cualquier otra cuenta con sesión es cliente. Ocultar botones
 * es solo comodidad, no protege nada.
 */
const url = import.meta.env.VITE_VD_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_VD_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

export const client = url && anonKey
  ? createClient(url, anonKey, { auth: { persistSession: true, autoRefreshToken: true, storageKey: 'tecnodiel-admin-auth' } })
  : null;

// Correos de socios con acceso administrativo a la oficina virtual
const ADMIN_EMAILS = [
  'franciscojavierfarinapadilla@gmail.com',
  'mareo4830@gmail.com',
];

async function resolveRole(session) {
  if (!session) return 'guest';
  const email = session.user.email?.toLowerCase();
  if (email && ADMIN_EMAILS.includes(email)) return 'admin';
  try {
    const { data, error } = await client.from('partners').select('id').eq('user_id', session.user.id).maybeSingle();
    return !error && data ? 'admin' : 'client';
  } catch {
    return 'client';
  }
}

const profileOf = (session) => session && {
  email: session.user.email,
  name: session.user.user_metadata?.full_name || session.user.email,
  avatar: session.user.user_metadata?.avatar_url || null,
};

/** role: 'loading' | 'guest' | 'client' | 'admin'. */
export function useAccount() {
  const [state, setState] = useState({ role: client ? 'loading' : 'guest', profile: null });

  useEffect(() => {
    if (!client) return undefined;
    let alive = true;
    const apply = (session) => resolveRole(session).then((role) => alive && setState({ role, profile: profileOf(session) }));
    client.auth.getSession().then(({ data }) => apply(data.session));
    const { data: sub } = client.auth.onAuthStateChange((_event, session) => { setTimeout(() => apply(session), 0); });
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, []);

  const signIn = useCallback(() => {
    client?.auth.signInWithOAuth({
      provider: 'google',
      options: { // href (no solo origin): si el login se pide desde el formulario, Google devuelve ahí
      // mismo y no se pierde el progreso guardado en sessionStorage.
      redirectTo: window.location.href, queryParams: { prompt: 'select_account' } },
    });
  }, []);

  const signOut = useCallback(() => { client?.auth.signOut(); }, []);

  return { ...state, signIn, signOut, enabled: !!client };
}
