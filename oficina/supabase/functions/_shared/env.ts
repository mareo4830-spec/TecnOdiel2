/**
 * Secretos de las Edge Functions. Viven solo aquí (supabase secrets set …) o en Vault:
 * nunca en variables VITE_* ni en el frontend.
 */
export type Env = (name: string) => string | undefined;

export const denoEnv: Env = (name) => Deno.env.get(name);

/** Para qué sirve cada secreto: aparece en el error si falta. */
const PURPOSE: Record<string, string> = {
  GOOGLE_MAPS_API_KEY: 'Places API (New) para ficha, horario y coordenadas',
  SAAS_SUPABASE_URL: 'URL del proyecto Supabase del SaaS',
  SAAS_SERVICE_ROLE_KEY: 'service_role del proyecto Supabase del SaaS',
  VERCEL_TOKEN: 'token de la API de Vercel',
  VERCEL_PROJECT_ID: 'proyecto de Vercel del SaaS',
  AGENCY_PREVIEW_DOMAIN: 'dominio de la agencia para las previews slug.<dominio> (solo si el SaaS no tiene config propia)',
  GITHUB_TOKEN: 'token de GitHub de solo lectura para comprobar repos privados',
  CLOUDFLARE_API_TOKEN: 'token de Cloudflare con permiso Zone.DNS:Edit',
  IONOS_API_KEY: 'API key de IONOS Hosting (formato prefijo.secreto)',
  ONESIGNAL_USER_AUTH_KEY: 'Organization API Key de OneSignal',
  ONESIGNAL_ORGANIZATION_ID: 'id de la organización de OneSignal',
  GOOGLE_SERVICE_ACCOUNT_JSON: 'JSON de la cuenta de servicio para Site Verification y Search Console',
  GSC_OWNER_EMAIL: 'email que se añade como propietario en Search Console',
};

export class MissingSecretError extends Error {
  constructor(readonly secret: string) {
    const purpose = PURPOSE[secret] ? ` (${PURPOSE[secret]})` : '';
    super(`Falta el secreto ${secret}${purpose}. Configúralo con: supabase secrets set ${secret}=…`);
  }
}

export function requireSecret(env: Env, name: string): string {
  const value = env(name)?.trim();
  if (!value) throw new MissingSecretError(name);
  return value;
}
