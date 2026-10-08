import { createClient, type SupabaseClient } from 'npm:@supabase/supabase-js@2';
import { type Env, requireSecret } from './env.ts';
import { HttpError } from './http.ts';

/** Cliente con la service_role de VirtualDesk (inyectada por Supabase en todas las funciones). */
export function adminClient(env: Env): SupabaseClient {
  return createClient(requireSecret(env, 'SUPABASE_URL'), requireSecret(env, 'SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Exige un socio con rol admin. Se valida con el JWT del propio usuario (RLS/`is_admin()`),
 * no con la service_role, y devuelve su id de socio para el log y los avisos.
 */
export async function requireAdmin(req: Request, env: Env, admin: SupabaseClient): Promise<{ partnerId: string }> {
  const authorization = req.headers.get('Authorization');
  if (!authorization?.startsWith('Bearer ')) throw new HttpError(401, 'Falta el token de sesión');

  const userClient = createClient(requireSecret(env, 'SUPABASE_URL'), requireSecret(env, 'SUPABASE_ANON_KEY'), {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: userData, error: userError } = await userClient.auth.getUser();
  if (userError || !userData.user) throw new HttpError(401, 'Sesión no válida');

  const { data: isAdmin, error: adminError } = await userClient.rpc('is_admin');
  if (adminError) throw new HttpError(500, `No se pudo comprobar el rol: ${adminError.message}`);
  if (isAdmin !== true) throw new HttpError(403, 'Solo un admin puede provisionar tenants');

  const { data: partner, error } = await admin.from('partners').select('id').eq('user_id', userData.user.id).maybeSingle();
  if (error || !partner) throw new HttpError(403, 'La cuenta no está vinculada a ningún socio');
  return { partnerId: (partner as { id: string }).id };
}
