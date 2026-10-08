import { describeChanges, ensureRecordSet, ensureTxt, type RecordChange } from '../dns/records.ts';
import { ProviderError } from '../http.ts';
import type { Step, StepContext } from '../types.ts';
import { createVercelClient } from '../vercel/client.ts';
import type { RequiredDnsRecord } from './vercel.ts';

/**
 * Paso 4 · dns. Crea en el proveedor del tenant (Cloudflare o IONOS) los registros que pidió
 * Vercel y le pide verificar. Si aún no ha propagado queda en `pending` (no es un error): el
 * reintento o sync-tenant lo completan. Sin proveedor elegido, deja los registros para ponerlos a mano.
 */
export const dnsStep: Step = {
  name: 'dns',
  provider: 'dns',
  async run(ctx: StepContext) {
    const { tenant } = ctx;
    const vercelMeta = ctx.integrations.vercel?.meta ?? {};
    const records = (vercelMeta.dnsRecords ?? []) as RequiredDnsRecord[];
    if (ctx.integrations.vercel?.status !== 'ok' || !records.length || !tenant.domain) {
      throw new ProviderError('dns', 'Falta el paso vercel: no hay registros DNS que crear');
    }

    const changes: RecordChange[] = [];
    if (tenant.dns_provider) {
      const dns = ctx.dns(tenant.dns_provider);
      const zone = await dns.findZone(tenant.domain);
      const byName = new Map<string, RequiredDnsRecord[]>();
      for (const r of records.filter((r) => r.type !== 'TXT')) byName.set(`${r.type}|${r.name}`, [...(byName.get(`${r.type}|${r.name}`) ?? []), r]);
      for (const [key, group] of byName) {
        const [type, name] = key.split('|') as [RequiredDnsRecord['type'], string];
        // Un CNAME no puede convivir con A/AAAA; en el dominio raíz se quita el AAAA (Vercel no usa IPv6).
        const conflicting = type === 'CNAME' ? (['A', 'AAAA'] as const) : (['AAAA', 'CNAME'] as const);
        changes.push(...(await ensureRecordSet(dns, zone, name, type, group.map((r) => r.content), [...conflicting])));
      }
      for (const r of records.filter((r) => r.type === 'TXT')) changes.push(await ensureTxt(dns, zone, r.name, r.content));
    }

    // Vercel comprueba el DNS real: sin propagar devuelve misconfigured / verified = false.
    const vercel = createVercelClient(ctx.env, ctx.fetch);
    const names = [...new Set(records.filter((r) => r.purpose !== 'verification').map((r) => r.name))];
    const state: Record<string, { verified: boolean; misconfigured: boolean; configuredBy: string | null }> = {};
    for (const name of names) {
      const domain = await vercel.verifyProjectDomain(name);
      const config = await vercel.getDomainConfig(name);
      state[name] = { verified: domain.verified, misconfigured: config.misconfigured, configuredBy: config.configuredBy };
    }
    const ready = Object.values(state).every((s) => s.verified && !s.misconfigured);

    const manual = !tenant.dns_provider;
    const meta = {
      provider: tenant.dns_provider,
      records,
      vercel: state,
      ...(manual ? { manual: true } : {}),
      checkedAt: ctx.now().toISOString(),
    };
    if (ready) {
      return { status: 'ok', externalId: tenant.domain, meta, detail: `${manual ? 'DNS manual correcto' : describeChanges(changes)} · Vercel verificado` };
    }
    const waiting = Object.entries(state)
      .filter(([, s]) => !s.verified || s.misconfigured)
      .map(([n]) => n)
      .join(', ');
    return {
      status: 'pending',
      externalId: tenant.domain,
      meta,
      detail: manual
        ? `Sin proveedor DNS: crea a mano ${records.map((r) => `${r.type} ${r.name} → ${r.content}`).join('; ')} y reintenta`
        : `${describeChanges(changes)} · esperando propagación en ${waiting}`,
    };
  },
};
