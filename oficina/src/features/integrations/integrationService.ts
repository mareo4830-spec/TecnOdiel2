import { useMemo } from 'react';
import { isSupabaseConfigured } from '../../lib/supabase';
import type { Integration } from '../../types';
import { useConversations } from '../chats/clientChatService';
import { useProjects } from '../projects/projectService';

/**
 * Estado de las integraciones (mock). Los datos reales de GitHub y Vercel llegarán desde
 * Edge Functions: el frontend nunca ve sus tokens.
 */
export function useIntegrations(): Integration[] {
  const projects = useProjects();
  const conversations = useConversations().length;

  return useMemo(() => {
    const live = projects.filter((p) => p.status === 'hecho').length;
    return [
      {
        id: 'supabase',
        name: 'Supabase',
        status: isSupabaseConfigured ? 'connected' : 'demo',
        details: [
          { label: 'Proyecto', value: 'oficina-virtual' },
          { label: 'Realtime', value: isSupabaseConfigured ? 'Activo' : 'Simulado' },
        ],
      },
      {
        id: 'github',
        name: 'GitHub',
        status: 'demo',
        details: [
          { label: 'Webhook', value: 'Edge Function github-webhook' },
          { label: 'Repositorios', value: String(projects.length) },
        ],
      },
      {
        id: 'vercel',
        name: 'Vercel',
        status: 'demo',
        details: [
          { label: 'Webs publicadas', value: String(live) },
          { label: 'Previews', value: `${projects.length - live} activas` },
        ],
      },
      {
        id: 'whatsapp',
        name: 'WhatsApp Business',
        status: 'demo',
        details: [
          { label: 'Bandeja', value: `${conversations} conversaciones` },
          { label: 'Cloud API', value: 'Edge Function whatsapp-webhook' },
        ],
      },
    ];
  }, [projects, conversations]);
}
