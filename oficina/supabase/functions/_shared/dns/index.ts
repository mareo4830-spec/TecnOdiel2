import { type Env, requireSecret } from '../env.ts';
import type { FetchFn } from '../http.ts';
import { cloudflareDns } from './cloudflare.ts';
import { ionosDns } from './ionos.ts';
import type { DnsProvider, DnsProviderId } from './types.ts';

/** Crea el adaptador DNS elegido para el tenant. Pide su secreto solo cuando se usa. */
export function createDnsProvider(id: DnsProviderId, env: Env, fetchFn: FetchFn): DnsProvider {
  switch (id) {
    case 'cloudflare':
      return cloudflareDns(requireSecret(env, 'CLOUDFLARE_API_TOKEN'), fetchFn);
    case 'ionos':
      return ionosDns(requireSecret(env, 'IONOS_API_KEY'), fetchFn);
  }
}

export type { DnsProvider, DnsProviderId };
