import { iso } from '../../lib/rows';
import { useStore } from '../../lib/store';
import { createSyncedStore } from '../../lib/syncedStore';
import type { Client, Lead } from '../../types';

/*
 * Clientes del portal: tabla `clients`. Los crea la BD cuando un visitante envía el formulario
 * (estado `solicitud`) y la oficina cuando se cierra un lead a mano. La cuenta propietaria
 * (`owner_user_id`) no se toca desde aquí: la fija la BD con el formulario o al reclamar por email.
 */
const clientsStore = createSyncedStore<Client>([], {
  table: 'clients',
  persistKey: 'clients',
  toRow: (c) => ({
    id: c.id,
    business_name: c.businessName,
    contact_name: c.contactName,
    phone: c.phone,
    email: c.email,
    city: c.city,
    lead_id: c.leadId,
    status: c.status,
    created_at: c.createdAt,
  }),
  fromRow: (r) => ({
    id: r.id,
    ownerUserId: r.owner_user_id,
    businessName: r.business_name,
    contactName: r.contact_name,
    phone: r.phone,
    email: r.email,
    city: r.city,
    leadId: r.lead_id,
    status: r.status,
    createdAt: iso(r.created_at),
  }),
  sort: (a, b) => b.createdAt.localeCompare(a.createdAt),
  order: { column: 'created_at', ascending: false },
});

export function useClients(): Client[] {
  return useStore(clientsStore);
}

export function useClient(id: string | null | undefined): Client | undefined {
  return useStore(clientsStore, (list) => (id ? list.find((c) => c.id === id) : undefined));
}

/** Activa el cliente que ya existía (el que creó el formulario) o crea uno con los datos del lead. */
export function ensureClientForLead(lead: Pick<Lead, 'id' | 'businessName' | 'contactName' | 'phone' | 'email' | 'city'>): string {
  const existing = clientsStore.get().find((c) => c.leadId === lead.id);
  if (existing) {
    if (existing.status !== 'activo') {
      clientsStore.set((prev) => prev.map((c) => (c.id === existing.id ? { ...c, status: 'activo' } : c)));
    }
    return existing.id;
  }
  const client: Client = {
    id: crypto.randomUUID(),
    ownerUserId: null,
    businessName: lead.businessName,
    contactName: lead.contactName,
    phone: lead.phone,
    email: lead.email,
    city: lead.city,
    leadId: lead.id,
    status: 'activo',
    createdAt: new Date().toISOString(),
  };
  clientsStore.set((prev) => [client, ...prev]);
  return client.id;
}

export function updateClient(id: string, patch: Partial<Pick<Client, 'businessName' | 'contactName' | 'phone' | 'email' | 'city' | 'status'>>): void {
  clientsStore.set((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
}
