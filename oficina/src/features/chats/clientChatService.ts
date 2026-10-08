import { useMemo } from 'react';
import { createStore, useStore } from '../../lib/store';
import type { ClientConversation, ClientMessage, PartnerId } from '../../types';
import { logActivity } from '../activity/activityService';

/*
 * Bandeja de WhatsApp Business. Está vacía hasta conectar la Cloud API real:
 *  - Una Edge Function `whatsapp-webhook` guarda los mensajes entrantes y los estados
 *    (enviado / entregado / leído) en `client_messages`, y el cliente los recibe por Realtime.
 *  - Enviar pasa por otra Edge Function con el token de Meta, nunca desde el navegador.
 */
const conversationsStore = createStore<ClientConversation[]>([], 'conversations');
const typingStore = createStore<string | null>(null);

/** Tras 24 h sin mensajes del cliente, WhatsApp solo deja enviar plantillas aprobadas. */
export const SERVICE_WINDOW_MS = 24 * 3_600_000;

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

/** Id de la conversación que "está escribiendo" ahora mismo. */
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
}

export function assignConversation(id: string, partnerId: PartnerId | null): void {
  patchConversation(id, (c) => ({ ...c, assignedTo: partnerId }));
}

export function sendClientMessage(convId: string, text: string, by: PartnerId): void {
  const conv = conversationsStore.get().find((c) => c.id === convId);
  if (!conv || !text.trim()) return;
  const msg: ClientMessage = {
    id: crypto.randomUUID(),
    direction: 'saliente',
    text: text.trim(),
    sentBy: by,
    status: 'enviado',
    createdAt: new Date().toISOString(),
  };
  patchConversation(convId, (c) => ({
    ...c,
    assignedTo: c.assignedTo ?? by,
    lastReadAt: msg.createdAt,
    messages: [...c.messages, msg],
  }));
  logActivity({
    type: 'chat',
    partnerId: by,
    projectId: conv.projectId,
    action: conv.projectId ? 'respondió por WhatsApp al cliente de' : `respondió por WhatsApp a ${conv.businessName}`,
    detail: msg.text.length > 120 ? `${msg.text.slice(0, 117)}…` : msg.text,
  });
}
