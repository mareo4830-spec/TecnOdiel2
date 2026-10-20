import { useMemo } from 'react';
import { iso } from '../../lib/rows';
import { createStore, useStore } from '../../lib/store';
import { createSyncedStore } from '../../lib/syncedStore';
import type { ChatMessage, ChatMessageKind, PartnerId } from '../../types';
import { logActivity } from '../activity/activityService';

/*
 * Chat interno del equipo: tabla `chat_messages` y `chat_reads` (hasta dónde ha leído cada socio).
 * "Está escribiendo…" (typingStore) seguirá siendo local hasta usar Realtime Presence.
 */
const messagesStore = createSyncedStore<ChatMessage>([], {
  table: 'chat_messages',
  persistKey: 'chat.messages',
  toRow: (m) => ({
    id: m.id,
    author: m.author,
    text: m.text,
    kind: m.kind,
    project_id: m.projectId,
    created_at: m.createdAt,
  }),
  fromRow: (r) => ({
    id: r.id,
    author: r.author,
    text: r.text,
    kind: r.kind,
    projectId: r.project_id,
    createdAt: iso(r.created_at),
  }),
  sort: (a, b) => a.createdAt.localeCompare(b.createdAt),
  order: { column: 'created_at', ascending: false },
  limit: 200,
  write: { update: false, delete: false },
});

interface ReadMark {
  partnerId: PartnerId;
  lastReadAt: string;
}
const readsStore = createSyncedStore<ReadMark>([], {
  table: 'chat_reads',
  conflict: 'partner_id',
  persistKey: 'chat.reads',
  toRow: (m) => ({ partner_id: m.partnerId, last_read_at: m.lastReadAt }),
  fromRow: (r) => ({ partnerId: r.partner_id, lastReadAt: iso(r.last_read_at) }),
  write: { delete: false },
});
const typingStore = createStore<PartnerId | null>(null);

const lastReadOf = (marks: ReadMark[], me: PartnerId) => marks.find((m) => m.partnerId === me)?.lastReadAt ?? '';

export function useChatMessages(): ChatMessage[] {
  return useStore(messagesStore);
}

export function useTyping(): PartnerId | null {
  return useStore(typingStore);
}

/** Mensajes de otros socios posteriores a la última lectura de `me`. */
export function useUnreadCount(me: PartnerId | undefined): number {
  const messages = useStore(messagesStore);
  const marks = useStore(readsStore);
  return useMemo(() => {
    if (!me) return 0;
    const since = lastReadOf(marks, me);
    return messages.filter((m) => m.author !== me && m.createdAt > since).length;
  }, [messages, marks, me]);
}

/** Fecha de la última lectura de `me`, para pintar el separador "Mensajes nuevos". */
export function useLastRead(me: PartnerId | undefined): string | null {
  return useStore(readsStore, (marks) => (me ? lastReadOf(marks, me) : null));
}

export function markChatRead(me: PartnerId): void {
  const latest = messagesStore.get().at(-1)?.createdAt;
  if (!latest || lastReadOf(readsStore.get(), me) >= latest) return;
  readsStore.set((prev) => [...prev.filter((m) => m.partnerId !== me), { partnerId: me, lastReadAt: latest }]);
}

function addMessage(input: Omit<ChatMessage, 'id' | 'createdAt'>): ChatMessage {
  const message: ChatMessage = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  messagesStore.set((prev) => [...prev, message].slice(-200));
  return message;
}

/** Solo los avisos y los mensajes sobre un proyecto pasan al timeline; la charla no. */
function logChatActivity(message: ChatMessage): void {
  if (message.kind !== 'aviso' && !message.projectId) return;
  const aviso = message.kind === 'aviso';
  logActivity({
    type: 'chat',
    partnerId: message.author,
    projectId: message.projectId,
    action: message.projectId
      ? aviso
        ? 'lanzó un aviso en el chat sobre'
        : 'escribió en el chat sobre'
      : 'lanzó un aviso en el chat',
    detail: message.text.length > 120 ? `${message.text.slice(0, 117)}…` : message.text,
  });
}

/** Aviso automático (p. ej. un tenant sale a producción): sin entrada extra en la actividad. */
export function postChatAviso(text: string, projectId: string | null, author: PartnerId): void {
  addMessage({ author, text, kind: 'aviso', projectId });
}

export function sendChatMessage(
  input: { text: string; kind: ChatMessageKind; projectId: string | null },
  by: PartnerId,
): ChatMessage {
  const message = addMessage({ ...input, text: input.text.trim(), author: by });
  logChatActivity(message);
  markChatRead(by);
  return message;
}
