import { useMemo } from 'react';
import { db, must, persist } from '../../lib/db';
import { createStore, useStore } from '../../lib/store';
import type { ChatMessage, ChatMessageKind, PartnerId } from '../../types';
import { logActivity } from '../activity/activityService';

/*
 * Chat interno del equipo. Con Supabase: tabla `chat_messages` + Realtime y `chat_reads`
 * (hasta dónde ha leído cada socio) para los no leídos. Sin Supabase: en memoria.
 */
const EPOCH = '1970-01-01T00:00:00.000Z';
const messagesStore = createStore<ChatMessage[]>([]);
const lastReadStore = createStore<Record<PartnerId, string>>({ javier: EPOCH, dani: EPOCH, mario: EPOCH });
// "Está escribiendo…": pendiente de Realtime Presence; mientras tanto nunca hay nadie escribiendo.
const typingStore = createStore<PartnerId | null>(null);

interface MessageRow {
  id: string;
  author: PartnerId;
  text: string;
  kind: ChatMessageKind;
  project_id: string | null;
  created_at: string;
}

export async function loadChat(): Promise<void> {
  const [rows, reads] = await Promise.all([
    must<MessageRow[]>(db().from('chat_messages').select('*').order('created_at', { ascending: false }).limit(200)),
    must<{ partner_id: PartnerId; last_read_at: string }[]>(db().from('chat_reads').select('*')),
  ]);
  messagesStore.set(() =>
    rows
      .map((r) => ({ id: r.id, author: r.author, text: r.text, kind: r.kind, projectId: r.project_id, createdAt: r.created_at }))
      .reverse(),
  );
  lastReadStore.set((prev) => ({ ...prev, ...Object.fromEntries(reads.map((r) => [r.partner_id, r.last_read_at])) }));
}

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
  void persist('Marcar chat como leído', () => must(db().from('chat_reads').upsert({ partner_id: me, last_read_at: latest })));
}

function addMessage(input: Omit<ChatMessage, 'id' | 'createdAt'>): ChatMessage {
  const message: ChatMessage = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  messagesStore.set((prev) => [...prev, message].slice(-200));
  void persist('Enviar mensaje', () =>
    must(
      db().from('chat_messages').insert({
        id: message.id,
        author: message.author,
        text: message.text,
        kind: message.kind,
        project_id: message.projectId,
        created_at: message.createdAt,
      }),
    ),
  );
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

/** Aviso automático (p. ej. un tenant sale a producción), sin entrada extra en la actividad. */
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

/** Cada socio puede borrar sus propios mensajes. */
export async function deleteChatMessage(id: string): Promise<boolean> {
  const ok = await persist('Eliminar mensaje', () => must(db().from('chat_messages').delete().eq('id', id)));
  if (ok) messagesStore.set((prev) => prev.filter((m) => m.id !== id));
  return ok;
}
