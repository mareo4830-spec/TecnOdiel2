import { ArrowLeft, Check, CheckCheck, Clock, Folder, Handshake, SendHorizontal } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '../../../components/ui/Avatar';
import { ConfirmDialog, DeleteIconButton } from '../../../components/ui/ConfirmDialog';
import { MOCK_PARTNERS, PARTNER_META } from '../../../lib/partners';
import type { ClientConversation, ClientMessageStatus, PartnerId } from '../../../types';
import { useAuth } from '../../auth/authContext';
import { useProjects } from '../../projects/projectService';
import {
  SERVICE_WINDOW_MS,
  assignConversation,
  deleteConversation,
  lastIncomingAt,
  markConversationRead,
  sendClientMessage,
} from '../clientChatService';
import { QUICK_REPLIES } from '../quickReplies';

const timeFmt = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' });
const dayFmt = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

function StatusIcon({ status }: { status: ClientMessageStatus }) {
  if (status === 'enviado') return <Check className="h-3.5 w-3.5 text-emerald-200/70" aria-label="Enviado" />;
  if (status === 'entregado') return <CheckCheck className="h-3.5 w-3.5 text-emerald-200/70" aria-label="Entregado" />;
  return <CheckCheck className="h-3.5 w-3.5 text-sky-300" aria-label="Leído" />;
}

interface Props {
  conversation: ClientConversation;
  typing: boolean;
  onBack: () => void;
}

export function ConversationThread({ conversation: c, typing, onBack }: Props) {
  const { partner } = useAuth();
  const projects = useProjects();
  const [text, setText] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const project = c.projectId ? projects.find((p) => p.id === c.projectId) : undefined;
  const lastIn = lastIncomingAt(c);
  const windowOpen = lastIn ? Date.now() - new Date(lastIn).getTime() < SERVICE_WINDOW_MS : false;

  useEffect(() => {
    markConversationRead(c.id);
  }, [c.id, c.messages.length]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [c.id, c.messages.length, typing]);

  const send = (value: string) => {
    if (!partner || !value.trim()) return;
    sendClientMessage(c.id, value, partner.id);
    setText('');
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(text);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send(text);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex flex-wrap items-center gap-3 border-b border-gray-800 bg-gray-900 px-3 py-2.5 sm:px-4">
        <button onClick={onBack} aria-label="Volver a la bandeja" className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white lg:hidden">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <Avatar
          partner={{ name: c.contactName, initials: c.contactName.charAt(0), avatarUrl: null, color: 'from-green-600 to-emerald-700' }}
          size="sm"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">
            {c.contactName} · {c.businessName}
          </p>
          <p className={`truncate text-xs ${typing ? 'text-green-400' : 'text-gray-400'}`}>{typing ? 'escribiendo…' : c.phone}</p>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          {project && (
            <Link to={`/proyectos/${project.id}`} className="inline-flex items-center gap-1 rounded-lg bg-gray-800 px-2 py-1.5 text-xs text-indigo-300 hover:bg-gray-700">
              <Folder className="h-3.5 w-3.5" />
              Proyecto
            </Link>
          )}
          {c.leadId && (
            <Link to={`/crm?lead=${c.leadId}`} className="inline-flex items-center gap-1 rounded-lg bg-gray-800 px-2 py-1.5 text-xs text-sky-300 hover:bg-gray-700">
              <Handshake className="h-3.5 w-3.5" />
              Lead
            </Link>
          )}
          <select
            value={c.assignedTo ?? ''}
            onChange={(e) => assignConversation(c.id, (e.target.value || null) as PartnerId | null)}
            aria-label="Asignada a"
            className="ml-auto h-8 rounded-lg border border-gray-800 bg-gray-950 px-2 text-xs text-gray-300 focus:border-indigo-500 focus:outline-none sm:ml-0"
          >
            <option value="">Sin asignar</option>
            {MOCK_PARTNERS.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <DeleteIconButton label="Eliminar conversación" onClick={() => setConfirmDelete(true)} />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto bg-gray-950 px-3 py-4 sm:px-6" aria-live="polite">
        {c.messages.map((m, i) => {
          const date = new Date(m.createdAt);
          const prev = c.messages[i - 1];
          const newDay = !prev || new Date(prev.createdAt).toDateString() !== date.toDateString();
          const out = m.direction === 'saliente';
          return (
            <div key={m.id}>
              {newDay && (
                <p className="my-3 text-center">
                  <span className="rounded-full bg-gray-800/80 px-3 py-1 text-[11px] font-medium text-gray-400">
                    {date.toDateString() === new Date().toDateString() ? 'Hoy' : dayFmt.format(date)}
                  </span>
                </p>
              )}
              <div className={`mt-2 flex ${out ? 'justify-end' : ''}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm sm:max-w-[70%] ${
                    out ? 'rounded-br-md bg-emerald-700 text-white' : 'rounded-bl-md bg-gray-800 text-gray-100'
                  }`}
                >
                  {out && m.sentBy && <p className="mb-0.5 text-[11px] font-semibold text-emerald-200">{PARTNER_META[m.sentBy].name}</p>}
                  <p className="whitespace-pre-wrap break-words leading-snug">{m.text}</p>
                  <p className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${out ? 'text-emerald-200/80' : 'text-gray-500'}`}>
                    {timeFmt.format(date)}
                    {out && <StatusIcon status={m.status} />}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        {typing && (
          <div className="mt-2 flex">
            <div className="flex gap-1 rounded-2xl rounded-bl-md bg-gray-800 px-3 py-3" aria-label="Escribiendo">
              {[0, 150, 300].map((d) => (
                <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: `${d}ms` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="border-t border-gray-800 bg-gray-900 px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {!windowOpen && (
          <p className="mb-2 flex items-start gap-1.5 rounded-lg bg-amber-500/10 px-2.5 py-1.5 text-[11px] text-amber-200">
            <Clock className="mt-0.5 h-3 w-3 shrink-0" />
            Han pasado más de 24 h desde el último mensaje del cliente. Con la API real de WhatsApp solo se podrán enviar
            plantillas aprobadas.
          </p>
        )}
        <div className="no-scrollbar -mx-3 mb-2 flex gap-2 overflow-x-auto px-3">
          {QUICK_REPLIES.map((q) => {
            const value = q.replace('{nombre}', c.contactName);
            return (
              <button
                key={q}
                type="button"
                onClick={() => setText(value)}
                className="max-w-56 shrink-0 truncate rounded-full border border-gray-800 px-3 py-1 text-xs text-gray-300 hover:border-green-600/60 hover:text-white"
                title={value}
              >
                {value}
              </button>
            );
          })}
        </div>
        <form onSubmit={onSubmit} className="flex items-end gap-2">
          <label className="flex-1">
            <span className="sr-only">Mensaje para {c.contactName}</span>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              maxLength={4096}
              placeholder="Escribe un mensaje de WhatsApp…"
              className="field-sizing-content block max-h-32 min-h-10 w-full resize-none rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-base text-gray-100 placeholder:text-gray-500 focus:border-green-600 focus:outline-none sm:text-sm"
            />
          </label>
          <button
            type="submit"
            disabled={!text.trim()}
            aria-label="Enviar por WhatsApp"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-green-600 text-white hover:bg-green-500 disabled:bg-gray-800 disabled:text-gray-500"
          >
            <SendHorizontal className="h-4 w-4" />
          </button>
        </form>
      </div>
      {confirmDelete && (
        <ConfirmDialog
          title="Eliminar conversación"
          confirmLabel="Eliminar conversación"
          onCancel={() => setConfirmDelete(false)}
          onConfirm={async () => {
            const ok = await deleteConversation(c.id);
            if (!ok) return false;
            onBack();
          }}
        >
          <p>
            Se borrará la conversación con {c.contactName} ({c.businessName}) y sus {c.messages.length} mensajes de la oficina. En el
            WhatsApp del cliente no cambia nada. Esta acción no se puede deshacer.
          </p>
        </ConfirmDialog>
      )}
    </div>
  );
}
