import { MessageCircle, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar } from '../../components/ui/Avatar';
import { PARTNER_IDS, PARTNER_META } from '../../lib/partners';
import type { ChatMessage, ChatMessageKind } from '../../types';
import { useAuth } from '../auth/authContext';
import { useProjects } from '../projects/projectService';
import { usePresence } from '../team/useTeam';
import {
  markChatRead,
  sendChatMessage,
  useChatMessages,
  useLastRead,
  useTyping,
  useUnreadCount,
} from './chatService';
import { ChatComposer } from './components/ChatComposer';
import { ChatMessageList } from './components/ChatMessageList';

/** Por debajo de `sm` el chat ocupa toda la pantalla. */
const MOBILE_QUERY = '(max-width: 639px)';
const PREVIEW_MS = 5000;

/** Botón flotante + chat interno del equipo, disponible en todas las vistas. */
export function ChatWidget() {
  const { partner } = useAuth();
  const me = partner?.id;
  const messages = useChatMessages();
  const unread = useUnreadCount(me);
  const lastRead = useLastRead(me);
  const typing = useTyping();
  const projects = useProjects();
  const presence = usePresence();

  const [open, setOpen] = useState(false);
  // Se congela al abrir para que el separador "Mensajes nuevos" no salte mientras se lee.
  const [readUntil, setReadUntil] = useState<string | null>(null);
  const [preview, setPreview] = useState<ChatMessage | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const seenRef = useRef(messages.at(-1)?.id);

  const openChat = useCallback(() => {
    setReadUntil(lastRead);
    setPreview(null);
    setOpen(true);
  }, [lastRead]);

  const closeChat = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  // Con el chat abierto todo lo que llega se da por leído.
  useEffect(() => {
    if (open && me) markChatRead(me);
  }, [open, me, messages]);

  // Vista previa del último mensaje entrante mientras el chat está cerrado.
  useEffect(() => {
    const last = messages.at(-1);
    if (!last || last.id === seenRef.current) return;
    seenRef.current = last.id;
    if (!open && last.author !== me) setPreview(last);
  }, [messages, open, me]);

  useEffect(() => {
    if (!preview) return;
    const id = window.setTimeout(() => setPreview(null), PREVIEW_MS);
    return () => window.clearTimeout(id);
  }, [preview]);

  useEffect(() => {
    if (!open) return;
    const mobile = window.matchMedia(MOBILE_QUERY).matches;
    if (!mobile) inputRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    if (mobile) document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeChat();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, closeChat]);

  const onSend = useCallback(
    (input: { text: string; kind: ChatMessageKind; projectId: string | null }) => {
      if (me) sendChatMessage(input, me);
    },
    [me],
  );

  // En móvil el chat tapa la página: al abrir un proyecto desde un mensaje se cierra.
  const onOpenProject = useCallback(() => {
    if (window.matchMedia(MOBILE_QUERY).matches) setOpen(false);
  }, []);

  if (!me) return null;

  const others = PARTNER_IDS.filter((id) => id !== me);
  const subtitle = typing
    ? `${PARTNER_META[typing].name} está escribiendo…`
    : PARTNER_IDS.map((id) => (id === me ? 'Tú' : PARTNER_META[id].name)).join(', ');

  return (
    <>
      {!open && (
        <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-20 flex flex-col items-end gap-3 sm:right-6">
          {preview && (
            <button
              onClick={openChat}
              className="flex max-w-72 items-start gap-2 rounded-2xl rounded-br-md border border-gray-800 bg-gray-900 p-3 text-left shadow-2xl shadow-black/50"
            >
              <Avatar partner={{ ...PARTNER_META[preview.author], avatarUrl: null }} size="sm" />
              <span className="min-w-0">
                <span className="block text-xs font-semibold text-green-300">
                  {PARTNER_META[preview.author].name}
                  {preview.kind === 'aviso' && <span className="ml-1 text-amber-300">· Aviso</span>}
                </span>
                <span className="line-clamp-2 text-sm text-gray-200">{preview.text}</span>
              </span>
            </button>
          )}
          <button
            ref={buttonRef}
            onClick={openChat}
            aria-label={`Abrir chat del equipo${unread ? ` (${unread} sin leer)` : ''}`}
            className="relative grid h-14 w-14 place-items-center rounded-full bg-green-600 text-white shadow-lg shadow-green-900/40 transition hover:scale-105 hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
          >
            <MessageCircle className="h-6 w-6" />
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full border-2 border-gray-950 bg-rose-500 px-1 text-[11px] font-bold leading-none">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>
        </div>
      )}

      {open && (
        <section
          role="dialog"
          aria-label="Chat del equipo"
          className="anim-modal fixed inset-0 z-50 flex flex-col overflow-hidden bg-gray-950 sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[min(640px,calc(100dvh-3rem))] sm:w-96 sm:rounded-2xl sm:border sm:border-gray-800 sm:shadow-2xl sm:shadow-black/60"
        >
          <header className="flex items-center gap-3 border-b border-gray-800 bg-gray-900 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <div className="flex -space-x-2">
              {others.map((id) => (
                <Avatar key={id} partner={{ ...PARTNER_META[id], avatarUrl: null }} size="sm" status={presence[id]} />
              ))}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-white">Chat del equipo</p>
              <p className={`truncate text-xs ${typing ? 'text-green-400' : 'text-gray-400'}`}>{subtitle}</p>
            </div>
            <button
              onClick={closeChat}
              aria-label="Cerrar chat"
              className="grid h-9 w-9 place-items-center rounded-lg text-gray-400 transition hover:bg-gray-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          <ChatMessageList
            messages={messages}
            me={me}
            projects={projects}
            readUntil={readUntil}
            typing={typing}
            onOpenProject={onOpenProject}
          />
          <ChatComposer projects={projects} inputRef={inputRef} onSend={onSend} />
        </section>
      )}
    </>
  );
}
