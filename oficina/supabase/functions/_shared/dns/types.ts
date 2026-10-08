export type DnsProviderId = 'cloudflare' | 'ionos';
export type DnsRecordType = 'A' | 'AAAA' | 'CNAME' | 'TXT';

export interface DnsZone {
  id: string;
  name: string;
}

export interface DnsRecord {
  id?: string;
  type: DnsRecordType;
  /** Nombre completo (FQDN sin punto final), p. ej. "www.salonaurora.es". */
  name: string;
  content: string;
  ttl?: number;
}

/** Operaciones mínimas que necesita el provisionado. Cada proveedor DNS implementa esta interfaz. */
export interface DnsProvider {
  readonly id: DnsProviderId;
  /** Zona que contiene el dominio (sube por los niveles: a.b.example.com → example.com). */
  findZone(domain: string): Promise<DnsZone>;
  listRecords(zone: DnsZone, name: string, type?: DnsRecordType): Promise<DnsRecord[]>;
  createRecord(zone: DnsZone, record: DnsRecord): Promise<void>;
  updateRecord(zone: DnsZone, id: string, record: DnsRecord): Promise<void>;
  deleteRecord(zone: DnsZone, id: string): Promise<void>;
}
