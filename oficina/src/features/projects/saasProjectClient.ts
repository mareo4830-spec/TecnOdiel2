import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import type { Project } from '../../types';
import { getTenants } from '../tenants/tenantService';
import { CONNECTION_LABEL, saasConnections, type SaasConnection } from './saasConfig';

/*
 * Operaciones contra la infraestructura de un proyecto SaaS. Con Supabase van a la Edge Function
 * `saas-project` (los secretos nunca llegan al navegador); en la demo se simulan con la config.
 */

export interface ConnectionCheck {
  connection: SaasConnection;
  ok: boolean;
  detail: string;
}

export interface SaasBusinessSummary {
  id: string;
  name: string;
  slug: string;
  status: string;
  layoutKey: string | null;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function invoke<T>(body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase!.functions.invoke<T & { error?: string }>('saas-project', { body });
  if (error) {
    const payload = await (error as { context?: Response }).context?.json?.().catch(() => null);
    throw new Error(payload?.error ?? error.message);
  }
  if (!data || (data as { error?: string }).error) throw new Error((data as { error?: string } | null)?.error ?? 'Respuesta vacía');
  return data;
}

/** Prueba real de cada conexión: consulta a businesses, repo en GitHub y proyecto en Vercel. */
export async function checkSaasConnections(project: Project): Promise<ConnectionCheck[]> {
  if (isSupabaseConfigured && supabase) {
    const res = await invoke<{ checks: ConnectionCheck[] }>({ action: 'check', projectId: project.id });
    return res.checks;
  }
  await sleep(900);
  const shape = saasConnections(project);
  const c = project.saas;
  const detail: Record<SaasConnection, [string, string]> = {
    supabase: [`businesses accesible en ${c?.supabaseRef || '—'} (demo)`, 'Falta la URL o el nombre del secreto service_role'],
    github: [`${project.repo.fullName} · rama ${project.repo.branch} (demo)`, 'Falta el repositorio'],
    vercel: [
      `Proyecto ${project.vercelProject} (${c?.vercelProjectId || '—'}) accesible (demo)`,
      'Falta el ID del proyecto (prj_…) o el secreto del token',
    ],
    preview: [
      c?.previewMode === 'agency_domain' ? `*.${c.agencyPreviewDomain}` : `<slug>-${c?.vercelAppSuffix}.vercel.app`,
      'Falta el sufijo .vercel.app o el dominio de la agencia',
    ],
  };
  return (Object.keys(shape) as SaasConnection[]).map((k) => ({
    connection: k,
    ok: shape[k],
    detail: shape[k] ? detail[k][0] : `${CONNECTION_LABEL[k]}: ${detail[k][1]}`,
  }));
}

/**
 * Busca un negocio por business_id en la BD del SaaS (para vincular un tenant a uno que ya existe).
 * Null = no existe.
 */
export async function lookupSaasBusiness(project: Project, businessId: string): Promise<SaasBusinessSummary | null> {
  if (isSupabaseConfigured && supabase) {
    const res = await invoke<{ business: SaasBusinessSummary | null }>({ action: 'lookup-business', projectId: project.id, businessId });
    return res.business;
  }
  await sleep(700);
  // Demo: los negocios "existentes" son los de los tenants ya provisionados, más cualquier UUID que empiece por 0.
  const known = getTenants().find((t) => t.saasBusinessId === businessId);
  if (known)
    return { id: businessId, name: known.name, slug: known.slug, status: known.status === 'live' ? 'active' : 'draft', layoutKey: known.layout };
  if (businessId.startsWith('0'))
    return { id: businessId, name: 'Negocio existente (demo)', slug: 'negocio-existente', status: 'draft', layoutKey: 'classic' };
  return null;
}
