import { type Env, requireSecret } from '../env.ts';
import { apiErrorMessage, fetchJson, type FetchFn, ProviderError } from '../http.ts';

const API = 'https://api.vercel.com';

export interface VercelVerification {
  type: string;
  domain: string;
  value: string;
  reason: string;
}

export interface VercelProjectDomain {
  name: string;
  apexName: string;
  verified: boolean;
  redirect?: string | null;
  verification?: VercelVerification[];
}

export interface VercelDomainConfig {
  configuredBy: 'A' | 'CNAME' | 'dns-01' | 'http' | null;
  misconfigured: boolean;
  recommendedIPv4: { rank: number; value: string[] }[];
  recommendedCNAME: { rank: number; value: string }[];
  acceptedChallenges?: string[];
}

export interface VercelClient {
  getProjectDomain(name: string): Promise<VercelProjectDomain | null>;
  addProjectDomain(name: string, redirect?: string): Promise<VercelProjectDomain>;
  verifyProjectDomain(name: string): Promise<VercelProjectDomain>;
  getDomainConfig(name: string): Promise<VercelDomainConfig>;
}

export function createVercelClient(env: Env, fetchFn: FetchFn): VercelClient {
  const token = requireSecret(env, 'VERCEL_TOKEN');
  const projectId = requireSecret(env, 'VERCEL_PROJECT_ID');
  const teamId = env('VERCEL_TEAM_ID')?.trim();
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const url = (path: string, params: Record<string, string> = {}) => {
    const q = new URLSearchParams(params);
    if (teamId) q.set('teamId', teamId);
    const qs = q.toString();
    return `${API}${path}${qs ? `?${qs}` : ''}`;
  };
  const projectPath = `/projects/${encodeURIComponent(projectId)}/domains`;

  return {
    async getProjectDomain(name) {
      const res = await fetchJson<VercelProjectDomain>(fetchFn, url(`/v9${projectPath}/${encodeURIComponent(name)}`), { headers });
      if (res.status === 404) return null;
      if (!res.ok) throw new ProviderError('vercel', `leer ${name}: ${apiErrorMessage(res.data, res.status)}`, res.status);
      return res.data;
    },
    async addProjectDomain(name, redirect) {
      const body: Record<string, unknown> = { name };
      if (redirect) Object.assign(body, { redirect, redirectStatusCode: 308 });
      const res = await fetchJson<VercelProjectDomain>(fetchFn, url(`/v10${projectPath}`), {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      if (res.status === 409) {
        throw new ProviderError('vercel', `${name} ya está asignado a otro proyecto o cuenta de Vercel: ${apiErrorMessage(res.data, res.status)}`, 409);
      }
      if (!res.ok) throw new ProviderError('vercel', `añadir ${name}: ${apiErrorMessage(res.data, res.status)}`, res.status);
      return res.data;
    },
    async verifyProjectDomain(name) {
      const res = await fetchJson<VercelProjectDomain>(fetchFn, url(`/v9${projectPath}/${encodeURIComponent(name)}/verify`), {
        method: 'POST',
        headers,
      });
      // Si la verificación TXT aún no ha propagado, Vercel responde 400: se devuelve el estado actual.
      if (!res.ok) {
        const current = await this.getProjectDomain(name);
        if (current) return current;
        throw new ProviderError('vercel', `verificar ${name}: ${apiErrorMessage(res.data, res.status)}`, res.status);
      }
      return res.data;
    },
    async getDomainConfig(name) {
      const res = await fetchJson<VercelDomainConfig>(
        fetchFn,
        url(`/v6/domains/${encodeURIComponent(name)}/config`, { projectIdOrName: projectId }),
        { headers },
      );
      if (!res.ok) throw new ProviderError('vercel', `configuración DNS de ${name}: ${apiErrorMessage(res.data, res.status)}`, res.status);
      return res.data;
    },
  };
}

const byRank = <T extends { rank: number }>(list: T[] | undefined) => [...(list ?? [])].sort((a, b) => Number(a.rank) - Number(b.rank));

/** IPs A preferidas (rank 1). No se hardcodean: salen de la API de Vercel. */
export function recommendedA(config: VercelDomainConfig): string[] {
  return byRank(config.recommendedIPv4)[0]?.value ?? [];
}

export function recommendedCname(config: VercelDomainConfig): string | null {
  return byRank(config.recommendedCNAME)[0]?.value?.replace(/\.$/, '') ?? null;
}
