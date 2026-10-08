import type { DnsRecordType } from '../dns/types.ts';
import { ProviderError } from '../http.ts';
import type { Step, StepContext } from '../types.ts';
import { createVercelClient, recommendedA, recommendedCname, type VercelClient } from '../vercel/client.ts';

/** Registro DNS que exige Vercel. Lo consume el paso `dns`. */
export interface RequiredDnsRecord {
  type: DnsRecordType;
  name: string;
  content: string;
  purpose: 'apex' | 'www' | 'verification';
}

export async function ensureProjectDomain(vercel: VercelClient, name: string, redirect?: string) {
  const existing = await vercel.getProjectDomain(name);
  if (existing) return { domain: existing, created: false };
  return { domain: await vercel.addProjectDomain(name, redirect), created: true };
}

/**
 * Paso 4 · vercel. Añade al proyecto del SaaS el dominio del cliente y www (redirige al dominio),
 * y guarda los registros DNS que pide Vercel para el paso dns. La preview va en su propio paso.
 */
export const vercelStep: Step = {
  name: 'vercel',
  provider: 'vercel',
  async run(ctx: StepContext) {
    const { tenant } = ctx;
    if (!tenant.domain) throw new ProviderError('vercel', 'El tenant no tiene dominio');
    const vercel = createVercelClient(ctx.env, ctx.fetch);

    const apex = tenant.domain;
    const www = `www.${apex}`;

    const added = {
      apex: await ensureProjectDomain(vercel, apex),
      www: await ensureProjectDomain(vercel, www, apex),
    };

    const apexConfig = await vercel.getDomainConfig(apex);
    const wwwConfig = await vercel.getDomainConfig(www);
    const ips = recommendedA(apexConfig);
    const cname = recommendedCname(wwwConfig);
    if (!ips.length || !cname) {
      throw new ProviderError('vercel', `Vercel no ha devuelto los registros recomendados para ${apex} (A: ${ips.length}, CNAME: ${cname ?? 'ninguno'})`);
    }

    const records: RequiredDnsRecord[] = [
      ...ips.map((ip) => ({ type: 'A' as const, name: apex, content: ip, purpose: 'apex' as const })),
      { type: 'CNAME', name: www, content: cname, purpose: 'www' },
    ];
    // Verificación TXT si el dominio ya se usó en otra cuenta de Vercel.
    for (const d of [added.apex.domain, added.www.domain]) {
      for (const v of d.verification ?? []) {
        if (v.type === 'TXT') records.push({ type: 'TXT', name: v.domain, content: v.value, purpose: 'verification' });
      }
    }

    const created = Object.entries(added)
      .filter(([, v]) => v.created)
      .map(([k]) => k);
    return {
      status: 'ok',
      externalId: apex,
      meta: {
        domains: {
          [apex]: { verified: added.apex.domain.verified },
          [www]: { verified: added.www.domain.verified, redirect: apex },
        },
        dnsRecords: records,
      },
      detail: `${created.length ? `Añadidos: ${created.join(', ')}` : 'Dominios ya presentes'} · DNS requerido: ${records
        .map((r) => `${r.type} ${r.name} → ${r.content}`)
        .join('; ')}`,
    };
  },
};
