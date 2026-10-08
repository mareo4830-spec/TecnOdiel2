import type { DnsProvider, DnsRecord, DnsRecordType, DnsZone } from './types.ts';

/** Nombres de zona candidatos, del más largo al registrable: a.b.example.es → [a.b.example.es, b.example.es, example.es]. */
export function zoneCandidates(domain: string): string[] {
  const labels = domain.toLowerCase().replace(/\.$/, '').split('.');
  const out: string[] = [];
  for (let i = 0; i <= labels.length - 2; i++) out.push(labels.slice(i).join('.'));
  return out;
}

/** Normaliza para comparar: sin comillas en TXT, sin punto final ni mayúsculas en nombres. */
export function normalizeContent(type: DnsRecordType, content: string): string {
  const c = content.trim();
  if (type === 'TXT') return c.replace(/^"|"$/g, '').replace(/"\s*"/g, '');
  return c.replace(/\.$/, '').toLowerCase();
}

export interface RecordChange {
  action: 'create' | 'update' | 'delete' | 'keep';
  type: DnsRecordType;
  name: string;
  content: string;
}

/**
 * Deja en `name` exactamente los registros `type` con `contents` (A, CNAME). Borra antes los
 * tipos incompatibles de `conflicting` (p. ej. un AAAA o un A viejos donde va un CNAME).
 * Idempotente: si ya está como debe, no toca nada.
 */
export async function ensureRecordSet(
  dns: DnsProvider,
  zone: DnsZone,
  name: string,
  type: DnsRecordType,
  contents: string[],
  conflicting: DnsRecordType[] = [],
  ttl = 300,
): Promise<RecordChange[]> {
  const changes: RecordChange[] = [];
  for (const other of conflicting) {
    for (const r of await dns.listRecords(zone, name, other)) {
      if (r.id) {
        await dns.deleteRecord(zone, r.id);
        changes.push({ action: 'delete', type: other, name, content: r.content });
      }
    }
  }

  const wanted = contents.map((c) => normalizeContent(type, c));
  const existing = await dns.listRecords(zone, name, type);
  const unmatched = existing.filter((r) => !wanted.includes(normalizeContent(type, r.content)));
  const missing = contents.filter((c) => !existing.some((r) => normalizeContent(type, r.content) === normalizeContent(type, c)));

  for (const content of missing) {
    // Se reutiliza un registro sobrante (update) antes de crear uno nuevo.
    const reuse = unmatched.shift();
    if (reuse?.id) {
      await dns.updateRecord(zone, reuse.id, { type, name, content, ttl });
      changes.push({ action: 'update', type, name, content });
    } else {
      await dns.createRecord(zone, { type, name, content, ttl });
      changes.push({ action: 'create', type, name, content });
    }
  }
  for (const r of unmatched) {
    if (r.id) {
      await dns.deleteRecord(zone, r.id);
      changes.push({ action: 'delete', type, name, content: r.content });
    }
  }
  for (const c of contents) {
    if (!changes.some((ch) => ch.content === c && ch.action !== 'delete')) changes.push({ action: 'keep', type, name, content: c });
  }
  return changes;
}

/** Añade un TXT si no existe. Nunca borra otros TXT (SPF, verificaciones de otros servicios…). */
export async function ensureTxt(dns: DnsProvider, zone: DnsZone, name: string, value: string, ttl = 300): Promise<RecordChange> {
  const existing = await dns.listRecords(zone, name, 'TXT');
  if (existing.some((r) => normalizeContent('TXT', r.content) === normalizeContent('TXT', value))) {
    return { action: 'keep', type: 'TXT', name, content: value };
  }
  await dns.createRecord(zone, { type: 'TXT', name, content: value, ttl });
  return { action: 'create', type: 'TXT', name, content: value };
}

export function describeChanges(changes: RecordChange[]): string {
  const done = changes.filter((c) => c.action !== 'keep');
  if (!done.length) return 'registros ya correctos';
  return done.map((c) => `${c.action} ${c.type} ${c.name} → ${c.content}`).join('; ');
}

export type { DnsRecord };
