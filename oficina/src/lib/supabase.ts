import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Proyecto Supabase de la Oficina Virtual (separado del de producción de los clientes).
// Solo se usa la clave pública: los secretos viven en las Edge Functions.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      // Misma clave de sesión que la landing: al estar en el mismo origen, iniciar sesión una vez vale para las dos.
      auth: { persistSession: true, autoRefreshToken: true, storageKey: 'tecnodiel-admin-auth' },
    })
  : null;
