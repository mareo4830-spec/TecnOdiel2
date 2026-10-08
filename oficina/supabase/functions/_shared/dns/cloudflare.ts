import { apiErrorMessage, fetchJson, type FetchFn, ProviderError } from '../http.ts';
import { zoneCandidates } from './records.ts';
import type { DnsProvider, DnsRecord, DnsRecordType, DnsZone } from './types.ts';

const API = 'https://api.cloudflare.com/client/v4';

interface CfEnvelope<T> {
  success: boolean;
  result: T;
  errors?: { code: number; message: string }[];
}

interface CfRecord {
  id: string;
  type: DnsRecordType;
  name: string;
  content: string;
  ttl: number;
}

/** Cloudflare DNS. Token con permisos Zone:Read y DNS:Edit sobre las zonas de los clientes. */
export function cloudflareDns(token: string, fetchFn: FetchFn): DnsProvider {
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
    const res = await fetchJson<CfEnvelope<T>>(fetchFn, `${API}${path}`, { ...init, headers });
    if (!res.ok || (res.data && typeof res.data === 'object' && res.data.success === false)) {
      throw new ProviderError('dns', `Cloudflare: ${apiErrorMessage(res.data, res.status)}`, res.status);
    }
    return res.data.result;
  }

  // Sin proxy: Vercel necesita ver el tráfico directo para emitir el certificado.
  const body = (r: DnsRecord) => JSON.stringify({ type: r.type, name: r.name, content: r.content, ttl: r.ttl ?? 300, proxied: false });

  return {
    id: 'cloudflare',
    async findZone(domain) {
      for (const candidate of zoneCandidates(domain)) {
        const zones = await call<{ id: string; name: string }[]>(`/zones?name=${encodeURIComponent(candidate)}`);
        if (zones.length) return { id: zones[0].id, name: zones[0].name };
      }
      throw new ProviderError('dns', `Cloudflare: la cuenta no tiene ninguna zona para ${domain}`);
    },
    async listRecords(zone: DnsZone, name, type) {
      const q = new URLSearchParams({ name, per_page: '100' });
      if (type) q.set('type', type);
      const records = await call<CfRecord[]>(`/zones/${zone.id}/dns_records?${q}`);
      return records.map((r) => ({ id: r.id, type: r.type, name: r.name, content: r.content, ttl: r.ttl }));
    },
    async createRecord(zone, record) {
      await call(`/zones/${zone.id}/dns_records`, { method: 'POST', body: body(record) });
    },
    async updateRecord(zone, id, record) {
      await call(`/zones/${zone.id}/dns_records/${id}`, { method: 'PUT', body: body(record) });
    },
    async deleteRecord(zone, id) {
      await call(`/zones/${zone.id}/dns_records/${id}`, { method: 'DELETE' });
    },
  };
}
