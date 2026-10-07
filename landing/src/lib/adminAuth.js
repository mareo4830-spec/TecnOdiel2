import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

/*
 * Acceso admin con Google, contra el proyecto Supabase de la Oficina Virtual (VirtualDesk).
 * Solo se usa la clave pública (anon): la autorización real la hace la BD — una cuenta es admin
 * si tiene una fila en `partners` vinculada a su usuario (RLS). Ocultar el botón es solo comodidad.
 */
const url = import.meta.env.VITE_VD_SUPABASE_URL;
const anonKey = import.meta.env.VITE_VD_SUPABASE_ANON_KEY;

export const VIRTUALDESK_URL = import.meta.env.VITE_VIRTUALDESK_URL || 'https://virtualdesk-tecnodiel.vercel.app';

const client = url && anonKey
  ? createClient(url, anonKey, { auth: { persistSession: true, autoRefreshToken: true, storageKey: 'tecnodiel-admin-auth' } })
  : null;

async function checkAdmin(session) {
  if (!client || !session) return false;
  const { data, error } = await client.from('partners').select('id').eq('user_id', session.user.id).maybeSingle();
  return !error && !!data;
}

/** 'loading' | 'admin' | 'guest'. Con 'admin' se muestra el botón del panel. */
export function useAdminAccess() {
  const [status, setStatus] = useState(client ? 'loading' : 'guest');

  useEffect(() => {
    if (!client) return undefined;
    let alive = true;
    const apply = (session) => checkAdmin(session).then((ok) => alive && setStatus(ok ? 'admin' : 'guest'));
    client.auth.getSession().then(({ data }) => apply(data.session));
    const { data: sub } = client.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => apply(session), 0);
    });
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, []);

  const signIn = useCallback(() => {
    if (!client) return;
    client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin, queryParams: { prompt: 'select_account' } },
    });
  }, []);

  const openPanel = useCallback(() => { window.location.href = VIRTUALDESK_URL; }, []);

  return { status, isAdmin: status === 'admin', signIn, openPanel };
}
