import { RotateCw, Sprout } from 'lucide-react';
import { motion } from 'motion/react';
import { SplitText } from '../../components/ui/SplitText';
import { APP_CONFIG } from '../../lib/config';
import { useEffect, useState, type ReactNode } from 'react';
import { db, live, reportDbError, setReloadAll } from '../../lib/db';
import { loadActivity } from '../activity/activityService';
import { loadChat } from '../chat/chatService';
import { loadConversations } from '../chats/clientChatService';
import { loadLeads } from '../crm/leadService';
import { loadFund, loadSessions } from '../hours/hoursService';
import { loadTasks } from '../kanban/taskService';
import { loadCommits, loadProjects } from '../projects/projectService';
import {
  loadBilling,
  loadContacts,
  loadIntegrations,
  loadPayments,
  loadPlans,
  loadProvisioningLog,
  loadTenants,
} from '../tenants/tenantService';

/** Qué recargar cuando cambia cada tabla (Supabase Realtime). */
const LOADERS: Record<string, () => Promise<void>> = {
  projects: loadProjects,
  saas_project_config: loadProjects,
  commits: loadCommits,
  activity: loadActivity,
  tasks: loadTasks,
  chat_messages: loadChat,
  chat_reads: loadChat,
  work_sessions: loadSessions,
  fund_movements: loadFund,
  leads: loadLeads,
  lead_notes: loadLeads,
  client_conversations: loadConversations,
  client_messages: loadConversations,
  plans: loadPlans,
  tenants: loadTenants,
  tenant_contacts: loadContacts,
  tenant_billing: loadBilling,
  tenant_payments: loadPayments,
  tenant_integrations: loadIntegrations,
  provisioning_log: loadProvisioningLog,
};

const ALL = [...new Set(Object.values(LOADERS))];

/**
 * Con Supabase: carga todos los datos al entrar y los mantiene al día en tiempo real (lo que
 * registra otro socio aparece sin recargar). Sin Supabase no hace nada.
 */
export function DataSync({ children }: { children: ReactNode }) {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>(live ? 'loading' : 'ready');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!live) return;
    let cancelled = false;
    setState('loading');

    const loadAll = () =>
      Promise.allSettled(ALL.map((load) => load())).then((results) => {
        const failed = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected');
        failed.forEach((r) => reportDbError('Cargar datos', r.reason));
        return failed.length === 0;
      });

    loadAll().then((ok) => !cancelled && setState(ok ? 'ready' : 'error'));
    // Si una escritura falla, se recarga todo para que la pantalla muestre lo que hay en la BD.
    setReloadAll(() => void loadAll());

    // Varios cambios seguidos en la misma tabla → una sola recarga.
    const timers = new Map<string, number>();
    const schedule = (table: string) => {
      const load = LOADERS[table];
      if (!load) return;
      window.clearTimeout(timers.get(table));
      timers.set(table, window.setTimeout(() => void load().catch((e) => reportDbError('Actualizar datos', e)), 250));
    };

    const channel = db()
      .channel('oficina-cambios')
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => schedule(payload.table))
      .subscribe();

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
      setReloadAll(() => {});
      void db().removeChannel(channel);
    };
  }, [attempt]);

  if (state === 'loading') {
    return (
      // Intro como la de Fernly: el logo gira hasta su sitio, el nombre sube letra a letra y la frase llega detrás.
      <div className="waves on-accent grid min-h-dvh place-items-center text-white" role="status">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-3">
            <motion.span
              initial={{ scale: 0, rotate: -120, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25"
            >
              <Sprout className="h-7 w-7" strokeWidth={2.4} aria-hidden />
            </motion.span>
            <SplitText as="span" text={APP_CONFIG.name} delay={0.15} stagger={0.04} className="text-4xl font-bold tracking-tight" />
          </div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-3 text-sm text-white/70"
          >
            Cargando los datos de la oficina…
          </motion.p>
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ originX: 0 }}
            className="mt-5 h-0.5 w-40 rounded-full bg-white/60"
          />
        </div>
      </div>
    );
  }

  return (
    <>
      {state === 'error' && (
        <div role="alert" className="flex items-center justify-center gap-3 border-b border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm text-rose-200">
          Algunos datos no se han podido cargar.
          <button onClick={() => setAttempt((a) => a + 1)} className="inline-flex items-center gap-1 font-medium underline">
            <RotateCw className="h-3.5 w-3.5" /> Reintentar
          </button>
        </div>
      )}
      {children}
    </>
  );
}
