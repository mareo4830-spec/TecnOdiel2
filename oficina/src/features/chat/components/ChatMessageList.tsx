import { Folder, TriangleAlert } from 'lucide-react';
import { Fragment, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '../../../components/ui/Avatar';
import { PARTNER_META } from '../../../lib/partners';
import type { ChatMessage, PartnerId, Project } from '../../../types';

/** Mensajes seguidos del mismo autor en este margen se agrupan sin repetir avatar. */
const GROUP_WINDOW_MS = 5 * 60_000;

const timeFmt = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' });
const dayFmt = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

function dayLabel(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return 'Hoy';
  if (date.toDateString() === yesterday.toDateString()) return 'Ayer';
  const text = dayFmt.format(date);
  return text.charAt(0).toUpperCase() + text.slice(1);
}

interface ChatMessageListProps {
  messages: ChatMessage[];
  me: PartnerId;
  projects: Project[];
  /** Última lectura al abrir el chat: los mensajes posteriores de otros van tras el separador. */
  readUntil: string | null;
  typing: PartnerId | null;
  onOpenProject: () => void;
}

export function ChatMessageList({ messages, me, projects, readUntil, typing, onOpenProject }: ChatMessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);
  const firstUnreadId = readUntil
    ? messages.find((m) => m.author !== me && m.createdAt > readUntil)?.id
    : undefined;

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length, typing]);

  return (
    <div className="flex-1 overflow-y-auto px-3 py-4" aria-live="polite">
      {messages.map((m, i) => {
        const prev = messages[i - 1];
        const date = new Date(m.createdAt);
        const newDay = !prev || new Date(prev.createdAt).toDateString() !== date.toDateString();
        const grouped =
          !newDay &&
          prev.author === m.author &&
          m.id !== firstUnreadId &&
          date.getTime() - new Date(prev.createdAt).getTime() < GROUP_WINDOW_MS;
        const mine = m.author === me;
        const partner = PARTNER_META[m.author];
        const project = m.projectId ? projects.find((p) => p.id === m.projectId) : undefined;
        const aviso = m.kind === 'aviso';

        return (
          <Fragment key={m.id}>
            {newDay && (
              <p className="my-3 text-center">
                <span className="rounded-full bg-gray-800/80 px-3 py-1 text-[11px] font-medium text-gray-400">
                  {dayLabel(date)}
                </span>
              </p>
            )}
            {m.id === firstUnreadId && (
              <p className="my-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-green-400">
                <span className="h-px flex-1 bg-green-500/30" />
                Mensajes nuevos
                <span className="h-px flex-1 bg-green-500/30" />
              </p>
            )}
            <div className={`flex items-end gap-2 ${mine ? 'justify-end' : ''} ${grouped ? 'mt-1' : 'mt-3'}`}>
              {!mine && (
                <div className="w-8 shrink-0">
                  {!grouped && <Avatar partner={{ ...partner, avatarUrl: null }} size="sm" />}
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                  mine ? 'rounded-br-md bg-emerald-700 text-white' : 'rounded-bl-md bg-gray-800 text-gray-100'
                } ${aviso ? 'ring-1 ring-amber-400/70' : ''}`}
              >
                {!mine && !grouped && <p className="mb-0.5 text-xs font-semibold text-green-300">{partner.name}</p>}
                {aviso && (
                  <p className="mb-1 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-amber-300">
                    <TriangleAlert className="h-3 w-3" />
                    Aviso
                  </p>
                )}
                <p className="whitespace-pre-wrap break-words leading-snug">{m.text}</p>
                <div className="mt-1 flex items-center justify-end gap-2">
                  {project && (
                    <Link
                      to={`/proyectos/${project.id}`}
                      onClick={onOpenProject}
                      className={`mr-auto inline-flex min-w-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium hover:underline ${
                        mine ? 'bg-black/20 text-emerald-100' : 'bg-gray-900/60 text-indigo-300'
                      }`}
                    >
                      <Folder className="h-3 w-3 shrink-0" />
                      <span className="truncate">{project.businessName}</span>
                    </Link>
                  )}
                  <time dateTime={m.createdAt} className={`text-[10px] ${mine ? 'text-emerald-200/80' : 'text-gray-500'}`}>
                    {timeFmt.format(date)}
                  </time>
                </div>
              </div>
            </div>
          </Fragment>
        );
      })}

      {typing && (
        <div className="mt-3 flex items-end gap-2">
          <Avatar partner={{ ...PARTNER_META[typing], avatarUrl: null }} size="sm" />
          <div className="flex gap-1 rounded-2xl rounded-bl-md bg-gray-800 px-3 py-3" aria-label="Escribiendo">
            {[0, 150, 300].map((delay) => (
              <span
                key={delay}
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </div>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}
