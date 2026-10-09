import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

/*
 * Sesión de Google contra el proyecto Supabase de la Oficina Virtual. Solo clave pública (anon):
 * la autorización real la hace la BD. Una cuenta es admin si tiene una fila en `partners`
 * vinculada a su usuario (RLS); cualquier otra cuenta con sesión es cliente. Ocultar botones
 * es solo comodidad, no protege nada.
 */
const DEFAULT_VD_URL = 'https://zkgragndnbqieseobkcq.supabase.co';
const DEFAULT_VD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprZ3JhZ25kbmJxaWVzZW9ia2NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2NTkyNjEsImV4cCI6MjEwNjIzNTI2MX0.uFjyXaq_Dt5BpozYsMNskjuXajQ4kIOoIbffxbjWXNg';

const url = import.meta.env.VITE_VD_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || DEFAULT_VD_URL;
const anonKey = import.meta.env.VITE_VD_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_VD_KEY;

export const client = url && anonKey
  ? createClient(url, anonKey, { auth: { persistSession: true, autoRefreshToken: true, storageKey: 'tecnodiel-admin-auth' } })
  : null;

// Correos de socios con acceso administrativo a la oficina virtual
const ADMIN_EMAILS = [
  'franciscojavierfarinapadilla@gmail.com',
  'mareo4830@gmail.com',
];

export function checkHasProject(email) {
  if (!email) return false;
  const clean = email.toLowerCase().trim();
  try {
    if (localStorage.getItem(`tecnodiel_client_project_${clean}`)) return true;
    if (localStorage.getItem('tecnodiel_has_project') === 'true') return true;
    const localLeads = JSON.parse(localStorage.getItem('tecnodiel_leads') || '[]');
    if (localLeads.some(l => (l.email || '').toLowerCase().trim() === clean)) return true;
    const localRests = JSON.parse(localStorage.getItem('tecnodiel_restaurants_db') || '[]');
    if (localRests.some(r => (r.email || '').toLowerCase().trim() === clean)) return true;
  } catch (_) {}
  return true; // Cualquier cliente con cuenta de Google tiene acceso a su portal
}

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
  const [state, setState] = useState({ 
    role: client ? 'loading' : 'guest', 
    profile: null,
    hasProject: false 
  });

  useEffect(() => {
    if (!client) return undefined;
    let alive = true;
    const apply = (session) => resolveRole(session).then((role) => {
      if (!alive) return;
      const profile = profileOf(session);
      const hasProject = role !== 'guest' && checkHasProject(profile?.email);
      setState({ role, profile, hasProject });
    });
    client.auth.getSession().then(({ data }) => apply(data.session));
    const { data: sub } = client.auth.onAuthStateChange((_event, session) => { setTimeout(() => apply(session), 0); });
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, []);

  const signIn = useCallback(() => {
    client?.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        redirectTo: window.location.href, 
        queryParams: { prompt: 'select_account' } 
      },
    });
  }, []);

  const signOut = useCallback(() => { client?.auth.signOut(); }, []);

  return { ...state, signIn, signOut, enabled: !!client };
}
