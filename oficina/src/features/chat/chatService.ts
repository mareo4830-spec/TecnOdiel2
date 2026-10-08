import { useMemo } from 'react';
import { createStore, useStore } from '../../lib/store';
import type { ChatMessage, ChatMessageKind, PartnerId } from '../../types';
import { logActivity } from '../activity/activityService';

/*
 * Chat interno del equipo (local). Con Supabase: tabla `chat_messages` + canal Realtime,
 * `chat_reads` (partner_id, last_read_at) para los no leídos y Realtime Presence para
 * "está escribiendo…". Los hooks no cambian.
 */
const messagesStore = createStore<ChatMessage[]>([], 'chat.messages');
const lastReadStore = createStore<Record<PartnerId, string>>({ javier: '', mario: '' }, 'chat.lastRead');
const typingStore = createStore<PartnerId | null>(null);

export function useChatMessages(): ChatMessage[] {
  return useStore(messagesStore);
}

export function useTyping(): PartnerId | null {
  return useStore(typingStore);
}

/** Mensajes de otros socios posteriores a la última lectura de `me`. */
export function useUnreadCount(me: PartnerId | undefined): number {
  const messages = useStore(messagesStore);
  const lastRead = useStore(lastReadStore);
  return useMemo(() => {
    if (!me) return 0;
    const since = lastRead[me];
    return messages.filter((m) => m.author !== me && m.createdAt > since).length;
  }, [messages, lastRead, me]);
}

/** Fecha de la última lectura de `me`, para pintar el separador "Mensajes nuevos". */
export function useLastRead(me: PartnerId | undefined): string | null {
  return useStore(lastReadStore, (map) => (me ? map[me] : null));
}

export function markChatRead(me: PartnerId): void {
  const latest = messagesStore.get().at(-1)?.createdAt;
  if (!latest || lastReadStore.get()[me] >= latest) return;
  lastReadStore.set((prev) => ({ ...prev, [me]: latest }));
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
