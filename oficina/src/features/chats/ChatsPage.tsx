import { MessageCircle, MessagesSquare } from 'lucide-react';
import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth/authContext';
import { useUnreadCount } from '../chat/chatService';
import { useClientTyping, useClientUnreadTotal, useConversation, useConversations } from './clientChatService';
import { ConversationList } from './components/ConversationList';
import { ConversationThread } from './components/ConversationThread';
import { TeamChatPanel } from './components/TeamChatPanel';

export function ChatsPage() {
  const { partner } = useAuth();
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') === 'equipo' ? 'equipo' : 'clientes';
  const selectedId = params.get('c');
  const conversations = useConversations();
  const selected = useConversation(selectedId);
  const typingId = useClientTyping();
  const clientUnread = useClientUnreadTotal();
  const teamUnread = useUnreadCount(partner?.id);

  const select = useCallback((id: string) => setParams({ c: id }), [setParams]);
  const back = useCallback(() => setParams({}), [setParams]);

  if (!partner) return null;

  const tabs = [
    { id: 'clientes', label: 'Clientes · WhatsApp', icon: MessageCircle, unread: clientUnread },
    { id: 'equipo', label: 'Equipo', icon: MessagesSquare, unread: teamUnread },
  ] as const;

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-4">
      <div className="flex gap-2" role="tablist" aria-label="Bandejas">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setParams(t.id === 'equipo' ? { tab: 'equipo' } : {})}
              className={`inline-flex h-9 items-center gap-2 rounded-xl px-3 text-sm font-medium transition ${
                tab === t.id ? 'bg-indigo-600 text-white' : 'bg-gray-900 text-gray-400 ring-1 ring-gray-800 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
              {t.unread > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-green-600 px-1.5 text-[11px] font-bold text-white">
                  {t.unread}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Alto fijo para que cada panel tenga su propio scroll, como en WhatsApp Web. */}
      <div className="h-[calc(100dvh-15rem)] min-h-[26rem] overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 xl:h-[calc(100dvh-11.5rem)]">
        {tab === 'equipo' ? (
          <TeamChatPanel me={partner.id} />
        ) : (
          <div className="grid h-full grid-cols-1 lg:grid-cols-[20rem_minmax(0,1fr)]">
            <div className={`min-h-0 border-gray-800 lg:block lg:border-r ${selected ? 'hidden' : 'block'}`}>
              <ConversationList conversations={conversations} selectedId={selectedId} typingId={typingId} onSelect={select} />
            </div>
            <div className={`min-h-0 lg:block ${selected ? 'block' : 'hidden'}`}>
              {selected ? (
                <ConversationThread conversation={selected} typing={typingId === selected.id} onBack={back} />
              ) : (
                <div className="grid h-full place-items-center p-6 text-center">
                  <div>
                    <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-green-500/10 text-green-400">
                      <MessageCircle className="h-7 w-7" />
                    </span>
                    <p className="mt-3 font-medium text-gray-200">Elige una conversación</p>
                    <p className="mt-1 max-w-xs text-sm text-gray-500">
                      Los mensajes de WhatsApp Business de los clientes llegan aquí. De momento están simulados.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
