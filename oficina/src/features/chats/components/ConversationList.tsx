import { Search } from 'lucide-react';
import { useState } from 'react';
import { Avatar } from '../../../components/ui/Avatar';
import { PARTNER_META } from '../../../lib/partners';
import type { ClientConversation } from '../../../types';
import { unreadCount } from '../clientChatService';

const normalize = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const timeFmt = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' });
const dayFmt = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' });

function shortTime(iso: string): string {
  const d = new Date(iso);
  return d.toDateString() === new Date().toDateString() ? timeFmt.format(d) : dayFmt.format(d);
}

interface Props {
  conversations: ClientConversation[];
  selectedId: string | null;
  typingId: string | null;
  onSelect: (id: string) => void;
}

export function ConversationList({ conversations, selectedId, typingId, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const q = normalize(query.trim());
  const visible = conversations.filter((c) => !q || normalize(`${c.contactName} ${c.businessName} ${c.phone}`).includes(q));

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-gray-800 p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar conversación"
            aria-label="Buscar conversación"
            className="h-10 w-full rounded-xl border border-gray-800 bg-gray-950 pl-10 pr-3 text-sm text-white placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>
      <ul className="flex-1 overflow-y-auto">
        {visible.length === 0 && <li className="px-4 py-8 text-center text-sm text-gray-500">Sin conversaciones</li>}
        {visible.map((c) => {
          const last = c.messages.at(-1);
          const unread = unreadCount(c);
          const typing = typingId === c.id;
          return (
            <li key={c.id}>
              <button
                onClick={() => onSelect(c.id)}
                aria-current={selectedId === c.id}
                className={`flex w-full items-center gap-3 border-b border-gray-800/60 px-3 py-3 text-left transition ${
                  selectedId === c.id ? 'bg-gray-800/80' : 'hover:bg-gray-800/40'
                }`}
              >
                <Avatar
                  partner={{ name: c.contactName, initials: c.contactName.charAt(0), avatarUrl: null, color: 'from-green-600 to-emerald-700' }}
                  size="md"
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-sm font-semibold text-white">{c.businessName}</span>
                    {last && (
                      <span className={`shrink-0 text-[11px] ${unread ? 'font-semibold text-green-400' : 'text-gray-500'}`}>
                        {shortTime(last.createdAt)}
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 flex items-center gap-2">
                    <span className={`min-w-0 flex-1 truncate text-xs ${typing ? 'text-green-400' : 'text-gray-400'}`}>
                      {typing
                        ? 'escribiendo…'
                        : last
                          ? `${last.direction === 'saliente' ? `${PARTNER_META[last.sentBy ?? 'javier'].name}: ` : ''}${last.text}`
                          : 'Sin mensajes'}
                    </span>
                    {unread > 0 && (
                      <span className="grid h-5 min-w-5 place-items-center rounded-full bg-green-600 px-1.5 text-[11px] font-bold text-white">
                        {unread}
                      </span>
                    )}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
