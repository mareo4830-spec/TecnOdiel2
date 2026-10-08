import { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar } from '../../../components/ui/Avatar';
import { PARTNER_IDS, PARTNER_META } from '../../../lib/partners';
import type { ChatMessageKind, PartnerId } from '../../../types';
import { markChatRead, sendChatMessage, useChatMessages, useLastRead, useTyping } from '../../chat/chatService';
import { ChatComposer } from '../../chat/components/ChatComposer';
import { ChatMessageList } from '../../chat/components/ChatMessageList';
import { useProjects } from '../../projects/projectService';
import { usePresence } from '../../team/useTeam';

/** El mismo chat interno del widget flotante, a página completa. */
export function TeamChatPanel({ me }: { me: PartnerId }) {
  const messages = useChatMessages();
  const typing = useTyping();
  const projects = useProjects();
  const presence = usePresence();
  const lastRead = useLastRead(me);
  // Se fija al entrar para que el separador "Mensajes nuevos" se quede donde estaba.
  const [readUntil] = useState(lastRead);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    markChatRead(me);
  }, [me, messages]);

  const onSend = useCallback(
    (input: { text: string; kind: ChatMessageKind; projectId: string | null }) => sendChatMessage(input, me),
    [me],
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex items-center gap-3 border-b border-gray-800 bg-gray-900 px-4 py-3">
        <div className="flex -space-x-2">
          {PARTNER_IDS.map((id) => (
            <Avatar key={id} partner={{ ...PARTNER_META[id], avatarUrl: null }} size="sm" status={presence[id]} />
          ))}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-white">Chat del equipo</p>
          <p className={`truncate text-xs ${typing ? 'text-green-400' : 'text-gray-400'}`}>
            {typing ? `${PARTNER_META[typing].name} está escribiendo…` : 'Avisos y mensajes sobre los proyectos'}
          </p>
        </div>
      </header>
      <ChatMessageList messages={messages} me={me} projects={projects} readUntil={readUntil} typing={typing} onOpenProject={() => {}} />
      <ChatComposer projects={projects} inputRef={inputRef} onSend={onSend} />
    </div>
  );
}
