import { createClient } from 'npm:@supabase/supabase-js@2';
import { adminClient, requireAdmin } from '../_shared/auth.ts';
import { type Env, denoEnv } from '../_shared/env.ts';
import { apiErrorMessage, corsHeaders, fetchJson, HttpError, json } from '../_shared/http.ts';
import { loadProjectConfig, projectEnv, type SaasProjectConfigRow } from '../_shared/projectConfig.ts';
import { createSaasGateway } from '../_shared/saas/gateway.ts';

/*
 * POST /saas-project
 *   { action: 'check', projectId }                     → prueba real de BD del SaaS, GitHub, Vercel y previews
 *   { action: 'lookup-business', projectId, businessId } → negocio de businesses por id (para vincular un tenant)
 *
 * Usa la configuración del proyecto (saas_project_config); los secretos se leen por su nombre.
 */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Connection = 'supabase' | 'github' | 'vercel' | 'preview';
interface Check {
  connection: Connection;
  ok: boolean;
  detail: string;
}

interface ProjectRow {
  id: string;
  kind: string;
  repo_full_name: string;
  repo_branch: string;
  vercel_project: string;
}

const errorMessage = (e: unknown) => (e instanceof Error ? e.message : String(e));

async function checkSupabase(env: Env): Promise<Check> {
  const url = env('SAAS_SUPABASE_URL');
  const key = env('SAAS_SERVICE_ROLE_KEY');
  if (!url || !key) return { connection: 'supabase', ok: false, detail: `Falta ${!url ? 'la URL' : 'el secreto con la service_role'}` };
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { count, error } = await db.from('businesses').select('id', { count: 'exact', head: true });
  if (error) return { connection: 'supabase', ok: false, detail: `businesses: ${error.message}` };
  return { connection: 'supabase', ok: true, detail: `${count ?? 0} negocios en ${new URL(url).host}` };
}

async function checkGithub(env: Env, project: ProjectRow): Promise<Check> {
  const token = env('GITHUB_TOKEN');
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json', 'User-Agent': 'virtualdesk' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const base = `https://api.github.com/repos/${project.repo_full_name}`;
  const repo = await fetchJson<{ private: boolean; default_branch: string }>(fetch, base, { headers });
  if (!repo.ok) {
    const hint = repo.status === 404 && !token ? ' (si es privado, configura GITHUB_TOKEN)' : '';
    return { connection: 'github', ok: false, detail: `${project.repo_full_name}: ${apiErrorMessage(repo.data, repo.status)}${hint}` };
  }
  const branch = await fetchJson(fetch, `${base}/branches/${encodeURIComponent(project.repo_branch)}`, { headers });
  if (!branch.ok) return { connection: 'github', ok: false, detail: `No existe la rama ${project.repo_branch}` };
  return {
    connection: 'github',
    ok: true,
    detail: `${project.repo_full_name} (${repo.data.private ? 'privado' : 'público'}) · rama ${project.repo_branch}`,
  };
}

async function checkVercel(env: Env): Promise<Check> {
  const token = env('VERCEL_TOKEN');
  const projectId = env('VERCEL_PROJECT_ID');
  if (!token || !projectId) return { connection: 'vercel', ok: false, detail: `Falta ${!token ? 'el secreto del token' : 'el ID del proyecto'}` };
  const teamId = env('VERCEL_TEAM_ID');
  const url = `https://api.vercel.com/v9/projects/${encodeURIComponent(projectId)}${teamId ? `?teamId=${teamId}` : ''}`;
  const res = await fetchJson<{ name: string; framework: string | null }>(fetch, url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) return { connection: 'vercel', ok: false, detail: apiErrorMessage(res.data, res.status) };
  return { connection: 'vercel', ok: true, detail: `Proyecto ${res.data.name}${res.data.framework ? ` · ${res.data.framework}` : ''}` };
}

function checkPreview(cfg: SaasProjectConfigRow | null): Check {
  if (cfg?.preview_mode === 'agency_domain') {
    return cfg.agency_preview_domain
      ? { connection: 'preview', ok: true, detail: `<slug>.${cfg.agency_preview_domain} (requiere CNAME *.${cfg.agency_preview_domain})` }
      : { connection: 'preview', ok: false, detail: 'Falta el dominio de previews' };
  }
  return cfg?.vercel_app_suffix
    ? { connection: 'preview', ok: true, detail: `<slug>-${cfg.vercel_app_suffix}.vercel.app` }
    : { connection: 'preview', ok: false, detail: 'Falta el sufijo .vercel.app' };
}

/** Ejecuta una comprobación sin que un fallo de red tumbe las demás. */
const safe = (connection: Connection, run: () => Promise<Check>): Promise<Check> =>
  run().catch((e) => ({ connection, ok: false, detail: errorMessage(e) }));

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Método no permitido' }, 405);

  try {
    const db = adminClient(denoEnv);
    await requireAdmin(req, denoEnv, db);
    const body = await req.json().catch(() => null);
    const projectId = body?.projectId;
    if (typeof projectId !== 'string' || !projectId) throw new HttpError(400, 'Falta projectId');

    const { data: project, error } = await db
      .from('projects')
      .select('id, kind, repo_full_name, repo_branch, vercel_project')
      .eq('id', projectId)
      .maybeSingle();
    if (error) throw new Error(`BD (leer proyecto): ${error.message}`);
    if (!project) throw new HttpError(404, 'Proyecto no encontrado');
    if ((project as ProjectRow).kind !== 'saas') throw new HttpError(400, 'Solo para proyectos SaaS');

    const cfg = await loadProjectConfig(db, projectId);
    const env = projectEnv(denoEnv, cfg);

    if (body?.action === 'check') {
      const checks = await Promise.all([
        safe('supabase', () => checkSupabase(env)),
        safe('github', () => checkGithub(env, project as ProjectRow)),
        safe('vercel', () => checkVercel(env)),
        Promise.resolve(checkPreview(cfg)),
      ]);
      return json({ checks });
    }

    if (body?.action === 'lookup-business') {
      const businessId = body?.businessId;
      if (typeof businessId !== 'string' || !UUID.test(businessId)) throw new HttpError(400, 'businessId debe ser un UUID');
      const business = await createSaasGateway(env, fetch).findBusinessById(businessId.toLowerCase());
      if (!business) return json({ business: null });
      return json({
        business: {
          id: business.id,
          name: business.name,
          slug: business.slug,
          status: business.status,
          layoutKey: business.layout_key,
        },
      });
    }

    throw new HttpError(400, 'action debe ser check o lookup-business');
  } catch (e) {
    if (e instanceof HttpError) return json({ error: e.message, details: e.details }, e.status);
    console.error('saas-project', e);
    return json({ error: errorMessage(e) }, 500);
  }
});
