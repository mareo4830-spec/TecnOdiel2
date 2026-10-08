import { apiErrorMessage, fetchJson, type FetchFn, ProviderError } from '../http.ts';
import { zoneCandidates } from './records.ts';
import type { DnsProvider, DnsRecord, DnsRecordType, DnsZone } from './types.ts';

// IONOS Hosting DNS API (dominios contratados en IONOS). No es la API de IONOS Cloud DNS.
const API = 'https://api.hosting.ionos.com/dns/v1';

interface IonosRecord {
  id: string;
  name: string;
  type: DnsRecordType;
  content: string;
  ttl: number;
}

/** IONOS DNS. La API key tiene el formato "prefijo.secreto" y va en la cabecera X-API-Key. */
export function ionosDns(apiKey: string, fetchFn: FetchFn): DnsProvider {
  const headers = { 'X-API-Key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' };

  async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
    const res = await fetchJson<T>(fetchFn, `${API}${path}`, { ...init, headers });
    if (!res.ok) throw new ProviderError('dns', `IONOS: ${apiErrorMessage(res.data, res.status)}`, res.status);
    return res.data;
  }

  const recordBody = (r: DnsRecord) => ({ name: r.name, type: r.type, content: r.content, ttl: r.ttl ?? 300, disabled: false });

  return {
    id: 'ionos',
    async findZone(domain) {
      const zones = await call<{ id: string; name: string }[]>('/zones');
      for (const candidate of zoneCandidates(domain)) {
        const zone = zones.find((z) => z.name.toLowerCase() === candidate);
        if (zone) return { id: zone.id, name: zone.name };
      }
      throw new ProviderError('dns', `IONOS: la cuenta no tiene ninguna zona para ${domain}`);
    },
    async listRecords(zone: DnsZone, name, type) {
      const q = new URLSearchParams({ recordName: name });
      if (type) q.set('recordType', type);
      const data = await call<{ records?: IonosRecord[] }>(`/zones/${zone.id}?${q}`);
      // El filtro de IONOS es por sufijo en algunos casos: se filtra también aquí por nombre exacto.
      return (data.records ?? [])
        .filter((r) => r.name.toLowerCase() === name.toLowerCase() && (!type || r.type === type))
        .map((r) => ({ id: r.id, type: r.type, name: r.name, content: r.content, ttl: r.ttl }));
    },
    async createRecord(zone, record) {
      await call(`/zones/${zone.id}/records`, { method: 'POST', body: JSON.stringify([recordBody(record)]) });
    },
    async updateRecord(zone, id, record) {
      const { content, ttl, disabled } = recordBody(record);
      await call(`/zones/${zone.id}/records/${id}`, { method: 'PUT', body: JSON.stringify({ content, ttl, disabled }) });
    },
    async deleteRecord(zone, id) {
      await call(`/zones/${zone.id}/records/${id}`, { method: 'DELETE' });
    },
  };
}
