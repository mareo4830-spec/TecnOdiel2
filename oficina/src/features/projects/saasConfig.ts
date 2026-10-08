import type { Project, SaasProjectConfig } from '../../types';

export const DEFAULT_SAAS_CONFIG: SaasProjectConfig = {
  supabaseUrl: '',
  supabaseRef: '',
  serviceRoleSecret: 'SAAS_SERVICE_ROLE_KEY',
  vercelTeamSlug: '',
  vercelTeamId: '',
  vercelProjectId: '',
  vercelTokenSecret: 'VERCEL_TOKEN',
  previewMode: 'vercel_app',
  vercelAppSuffix: '',
  agencyPreviewDomain: '',
  defaultDnsProvider: null,
};

export type SaasConnection = 'supabase' | 'github' | 'vercel' | 'preview';

export const CONNECTION_LABEL: Record<SaasConnection, string> = {
  supabase: 'Supabase',
  github: 'GitHub',
  vercel: 'Vercel',
  preview: 'Previews',
};

const SUPABASE_URL_RE = /^https:\/\/[a-z0-9-]+\.supabase\.(co|in)\/?$/;
export const SECRET_NAME_RE = /^[A-Z][A-Z0-9_]{2,63}$/;
export const REPO_RE = /^[\w.-]+\/[\w.-]+$/;
export const LABEL_RE = /^[a-z0-9]([a-z0-9-]{0,20}[a-z0-9])?$/;

/** Ref del proyecto a partir de la URL (https://<ref>.supabase.co). */
export function refFromSupabaseUrl(url: string): string {
  return url.trim().match(/^https:\/\/([a-z0-9-]+)\.supabase\./)?.[1] ?? '';
}

/** Qué conexiones del SaaS están completas (solo forma: la prueba real la hace «Comprobar conexiones»). */
export function saasConnections(project: Project): Record<SaasConnection, boolean> {
  const c = project.saas ?? DEFAULT_SAAS_CONFIG;
  return {
    supabase: SUPABASE_URL_RE.test(c.supabaseUrl) && SECRET_NAME_RE.test(c.serviceRoleSecret),
    github: REPO_RE.test(project.repo.fullName) && Boolean(project.repo.branch),
    vercel: Boolean(project.vercelProject && c.vercelProjectId.trim()) && SECRET_NAME_RE.test(c.vercelTokenSecret),
    preview: c.previewMode === 'vercel_app' ? LABEL_RE.test(c.vercelAppSuffix) : /\./.test(c.agencyPreviewDomain),
  };
}

/** Errores de formato de la configuración (vacío = correcta). */
export function validateSaasConfig(c: SaasProjectConfig, repo: Project['repo'], vercelProject: string): Record<string, string> {
  const e: Record<string, string> = {};
  if (c.supabaseUrl && !SUPABASE_URL_RE.test(c.supabaseUrl.trim())) e.supabaseUrl = 'Debe ser https://<ref>.supabase.co';
  if (!SECRET_NAME_RE.test(c.serviceRoleSecret)) e.serviceRoleSecret = 'Nombre de secreto en MAYÚSCULAS_CON_GUIONES_BAJOS';
  if (!SECRET_NAME_RE.test(c.vercelTokenSecret)) e.vercelTokenSecret = 'Nombre de secreto en MAYÚSCULAS_CON_GUIONES_BAJOS';
  if (repo.fullName && !REPO_RE.test(repo.fullName)) e.repo = 'Formato organización/repositorio';
  if (!vercelProject.trim()) e.vercelProject = 'Indica el proyecto de Vercel';
  if (c.vercelProjectId && !/^prj_[A-Za-z0-9]+$/.test(c.vercelProjectId.trim())) e.vercelProjectId = 'Empieza por prj_';
  if (c.vercelTeamId && !/^team_[A-Za-z0-9]+$/.test(c.vercelTeamId.trim())) e.vercelTeamId = 'Empieza por team_';
  if (c.previewMode === 'vercel_app' && c.vercelAppSuffix && !LABEL_RE.test(c.vercelAppSuffix)) {
    e.vercelAppSuffix = 'Minúsculas, números y guiones (máx. 22)';
  }
  if (c.previewMode === 'agency_domain' && !/^([a-z0-9-]+\.)+[a-z]{2,}$/.test(c.agencyPreviewDomain.trim())) {
    e.agencyPreviewDomain = 'Dominio no válido (ej. preview.tu-agencia.es)';
  }
  return e;
}
