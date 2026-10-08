import { useMemo } from 'react';
import { db, live, loadAfter, must, persist } from '../../lib/db';
import { createStore, useStore } from '../../lib/store';
import type { ClientConversation, ClientMessageDirection, ClientMessageStatus, PartnerId } from '../../types';
import { logActivity } from '../activity/activityService';

/*
 * Bandeja de WhatsApp Business.
 *  - Con Supabase: `client_conversations` + `client_messages`. La Edge Function `whatsapp-webhook`
 *    guarda los mensajes entrantes y los estados (enviado / entregado / leído); la app los recibe
 *    por Realtime. El envío real a WhatsApp necesita otra Edge Function con el token de Meta:
 *    hasta entonces la respuesta queda registrada en la conversación.
 *  - Sin Supabase: en memoria.
 */
const conversationsStore = createStore<ClientConversation[]>([]);
const typingStore = createStore<string | null>(null);

/** Tras 24 h sin mensajes del cliente, WhatsApp solo deja enviar plantillas aprobadas. */
export const SERVICE_WINDOW_MS = 24 * 3_600_000;

interface ConversationRow {
  id: string;
  contact_name: string;
  business_name: string;
  phone: string;
  project_id: string | null;
  lead_id: string | null;
  assigned_to: PartnerId | null;
  last_read_at: string;
  client_messages: {
    id: string;
    direction: ClientMessageDirection;
    text: string;
    sent_by: PartnerId | null;
    status: ClientMessageStatus;
    created_at: string;
  }[];
}

export async function loadConversations(): Promise<void> {
  const rows = await must<ConversationRow[]>(db().from('client_conversations').select('*, client_messages(*)'));
  conversationsStore.set(() =>
    rows.map((r) => ({
      id: r.id,
      contactName: r.contact_name,
      businessName: r.business_name,
      phone: r.phone,
      projectId: r.project_id,
      leadId: r.lead_id,
      assignedTo: r.assigned_to,
      lastReadAt: r.last_read_at,
      messages: r.client_messages
        .map((m) => ({ id: m.id, direction: m.direction, text: m.text, sentBy: m.sent_by, status: m.status, createdAt: m.created_at }))
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    })),
  );
}

export function unreadCount(c: ClientConversation): number {
  return c.messages.filter((m) => m.direction === 'entrante' && m.createdAt > c.lastReadAt).length;
}

export function lastIncomingAt(c: ClientConversation): string | null {
  const incoming = c.messages.filter((m) => m.direction === 'entrante');
  return incoming.at(-1)?.createdAt ?? null;
}

/** Conversaciones ordenadas por el último mensaje. */
export function useConversations(): ClientConversation[] {
  const list = useStore(conversationsStore);
  return useMemo(
    () => [...list].sort((a, b) => (b.messages.at(-1)?.createdAt ?? '').localeCompare(a.messages.at(-1)?.createdAt ?? '')),
    [list],
  );
}

export function useConversation(id: string | null): ClientConversation | undefined {
  return useStore(conversationsStore, (list) => (id ? list.find((c) => c.id === id) : undefined));
}

export function useClientUnreadTotal(): number {
  return useStore(conversationsStore, (list) => list.reduce((s, c) => s + unreadCount(c), 0));
}

/** Id de la conversación que "está escribiendo" ahora mismo (pendiente de la API real). */
export function useClientTyping(): string | null {
  return useStore(typingStore);
}

function patchConversation(id: string, fn: (c: ClientConversation) => ClientConversation): void {
  conversationsStore.set((prev) => prev.map((c) => (c.id === id ? fn(c) : c)));
}

export function markConversationRead(id: string): void {
  const conv = conversationsStore.get().find((c) => c.id === id);
  const last = conv?.messages.at(-1)?.createdAt;
  if (!conv || !last || conv.lastReadAt >= last) return;
  patchConversation(id, (c) => ({ ...c, lastReadAt: last }));
  void persist('Marcar conversación como leída', () =>
    must(db().from('client_conversations').update({ last_read_at: last }).eq('id', id)),
  );
}

export function assignConversation(id: string, partnerId: PartnerId | null): void {
  patchConversation(id, (c) => ({ ...c, assignedTo: partnerId }));
  void persist('Asignar conversación', () =>
    must(db().from('client_conversations').update({ assigned_to: partnerId }).eq('id', id)),
  );
}

export function sendClientMessage(convId: string, text: string, by: PartnerId): void {
  const conv = conversationsStore.get().find((c) => c.id === convId);
  if (!conv || !text.trim()) return;
  const msg = {
    id: crypto.randomUUID(),
    direction: 'saliente' as const,
    text: text.trim(),
    sentBy: by,
    status: 'enviado' as const,
    createdAt: new Date().toISOString(),
  };
  patchConversation(convId, (c) => ({
    ...c,
    assignedTo: c.assignedTo ?? by,
    lastReadAt: msg.createdAt,
    messages: [...c.messages, msg],
  }));
  // Los socios solo pueden escribir estas columnas: el id y la fecha los pone la BD.
  void persist('Guardar respuesta', async () => {
    await must(db().from('client_messages').insert({ conversation_id: convId, direction: 'saliente', text: msg.text, sent_by: by }));
    await must(
      db().from('client_conversations').update({ assigned_to: conv.assignedTo ?? by, last_read_at: msg.createdAt }).eq('id', convId),
    );
  }).then((ok) => ok && live && loadAfter(loadConversations));
  logActivity({
    type: 'chat',
    partnerId: by,
    projectId: conv.projectId,
    action: conv.projectId ? 'respondió por WhatsApp al cliente de' : `respondió por WhatsApp a ${conv.businessName}`,
    detail: msg.text.length > 120 ? `${msg.text.slice(0, 117)}…` : msg.text,
  });
}

/** Elimina la conversación y todos sus mensajes. */
export async function deleteConversation(id: string): Promise<boolean> {
  const ok = await persist('Eliminar conversación', () => must(db().from('client_conversations').delete().eq('id', id)));
  if (ok) conversationsStore.set((prev) => prev.filter((c) => c.id !== id));
  return ok;
}
