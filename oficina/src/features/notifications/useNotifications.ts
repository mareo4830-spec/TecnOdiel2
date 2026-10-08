import { useCallback, useMemo } from 'react';
import { PARTNER_META } from '../../lib/partners';
import { daysUntil } from '../../lib/format';
import { createStore, useStore } from '../../lib/store';
import type { AppNotification } from '../../types';
import { useAuth } from '../auth/authContext';
import { useChatMessages, useLastRead } from '../chat/chatService';
import { unreadCount, useConversations } from '../chats/clientChatService';
import { useLeads } from '../crm/leadService';
import { formatHours } from '../hours/hoursMath';
import { useSessionEvaluations } from '../hours/hoursService';
import { useProjects } from '../projects/projectService';

/*
 * Notificaciones derivadas de lo que requiere tu atención: horas de otros socios por validar,
 * seguimientos del CRM que vencen, WhatsApp sin leer y avisos del equipo. Con Supabase se
 * podrían generar igual en el cliente o con una tabla `notifications` + push (OneSignal).
 */
const seenStore = createStore<Set<string>>(new Set());

export function useNotifications() {
  const { partner } = useAuth();
  const me = partner?.id;
  const evaluations = useSessionEvaluations();
  const leads = useLeads();
  const conversations = useConversations();
  const messages = useChatMessages();
  const lastRead = useLastRead(me);
  const projects = useProjects();
  const seen = useStore(seenStore);

  const items = useMemo<AppNotification[]>(() => {
    if (!me) return [];
    const projectName = (id: string | null) => projects.find((p) => p.id === id)?.businessName ?? '';
    const list: Omit<AppNotification, 'read'>[] = [];

    for (const e of evaluations) {
      if (e.verification !== 'pendiente' || e.session.partnerId === me) continue;
      list.push({
        id: `session-${e.session.id}`,
        title: 'Horas pendientes de validar',
        body: `${PARTNER_META[e.session.partnerId].name} · ${formatHours(e.hours)} en ${projectName(e.session.projectId)}`,
        createdAt: e.session.endedAt,
        to: '/horas',
      });
    }

    for (const l of leads) {
      if (l.owner !== me || !l.nextActionDate || l.stage === 'cerrado' || l.stage === 'perdido') continue;
      const diff = daysUntil(l.nextActionDate);
      if (diff > 0) continue;
      list.push({
        id: `lead-${l.id}-${l.nextActionDate}`,
        title: diff < 0 ? `Seguimiento vencido: ${l.businessName}` : `Seguimiento para hoy: ${l.businessName}`,
        body: l.nextAction || 'Sin próximo paso definido',
        createdAt: l.updatedAt,
        to: `/crm?lead=${l.id}`,
      });
    }

    for (const c of conversations) {
      const unread = unreadCount(c);
      const last = c.messages.at(-1);
      if (!unread || !last) continue;
      list.push({
        id: `wa-${c.id}-${last.id}`,
        title: `WhatsApp de ${c.contactName} (${c.businessName})`,
        body: unread > 1 ? `${unread} mensajes nuevos · ${last.text}` : last.text,
        createdAt: last.createdAt,
        to: `/chats?c=${c.id}`,
      });
    }

    for (const m of messages) {
      if (m.kind !== 'aviso' || m.author === me || (lastRead && m.createdAt <= lastRead)) continue;
      list.push({
        id: `aviso-${m.id}`,
        title: `Aviso de ${PARTNER_META[m.author].name}`,
        body: m.text,
        createdAt: m.createdAt,
        to: '/chats?tab=equipo',
      });
    }

    return list
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((n) => ({ ...n, read: seen.has(n.id) }));
  }, [me, evaluations, leads, conversations, messages, lastRead, projects, seen]);

  const unreadCountTotal = useMemo(() => items.filter((n) => !n.read).length, [items]);

  const markAllRead = useCallback(() => {
    seenStore.set((prev) => new Set([...prev, ...items.map((n) => n.id)]));
  }, [items]);

  return { items, unreadCount: unreadCountTotal, markAllRead };
}
