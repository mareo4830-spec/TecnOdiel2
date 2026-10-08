import { Handshake, MessageCircle, Search, SquareKanban, Store, type LucideIcon } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConversations } from '../../features/chats/clientChatService';
import { STAGE_META } from '../../features/crm/leadMeta';
import { useLeads } from '../../features/crm/leadService';
import { COLUMN_LABEL } from '../../features/kanban/kanbanMeta';
import { useTasks } from '../../features/kanban/taskService';
import { BUSINESS_TYPE_META } from '../../features/projects/projectMeta';
import { useProjects } from '../../features/projects/projectService';
import { TENANT_TYPE_META } from '../../features/tenants/tenantMeta';
import { useAllTenants } from '../../features/tenants/tenantService';
import { useClickOutside } from '../../hooks/useClickOutside';

const normalize = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const PER_GROUP = 4;

interface Result {
  key: string;
  group: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  tint: string;
  to: string;
}

/** Buscador global: proyectos, tareas del Kanban, leads del CRM y conversaciones de clientes. */
export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const close = useCallback(() => setOpen(false), []);
  const containerRef = useClickOutside<HTMLDivElement>(close, open);
  const projects = useProjects();
  const tasks = useTasks();
  const tenants = useAllTenants();
  const leads = useLeads();
  const conversations = useConversations();
  const navigate = useNavigate();

  const results = useMemo<Result[]>(() => {
    const q = normalize(query.trim());
    if (q.length < 2) return [];
    const match = (text: string) => normalize(text).includes(q);
    const projectName = (id: string) => projects.find((p) => p.id === id)?.businessName ?? '';

    const projectResults = projects
      .filter((p) => match(`${p.name} ${p.businessName} ${p.domain ?? ''} ${p.client.contactName}`))
      .slice(0, PER_GROUP)
      .map<Result>((p) => ({
        key: `p-${p.id}`,
        group: 'Proyectos',
        title: p.name,
        subtitle: p.businessName,
        icon: BUSINESS_TYPE_META[p.businessType].icon,
        tint: BUSINESS_TYPE_META[p.businessType].tint,
        to: `/proyectos/${p.id}`,
      }));

    const taskResults = tasks
      .filter((t) => match(t.title))
      .slice(0, PER_GROUP)
      .map<Result>((t) => ({
        key: `t-${t.id}`,
        group: 'Tareas',
        title: t.title,
        subtitle: `${COLUMN_LABEL[t.status]} · ${projectName(t.projectId)}`,
        icon: SquareKanban,
        tint: 'bg-indigo-500/15 text-indigo-300',
        to: `/proyectos/${t.projectId}?tab=desarrollo`,
      }));

    const tenantResults = tenants
      .filter((t) => match(`${t.name} ${t.slug} ${t.domain ?? ''} ${t.previewHost ?? ''}`))
      .slice(0, PER_GROUP)
      .map<Result>((t) => {
        const type = t.businessType ? TENANT_TYPE_META[t.businessType] : null;
        return {
          key: `tn-${t.id}`,
          group: 'Tenants',
          title: t.name,
          subtitle: `${projectName(t.projectId)} · ${t.domain ?? t.previewHost ?? t.slug}`,
          icon: type?.icon ?? Store,
          tint: type?.tint ?? 'bg-gray-800 text-gray-400',
          to: `/proyectos/${t.projectId}/tenants/${t.id}`,
        };
      });

    const leadResults = leads
      .filter((l) => match(`${l.businessName} ${l.contactName} ${l.city}`))
      .slice(0, PER_GROUP)
      .map<Result>((l) => ({
        key: `l-${l.id}`,
        group: 'Leads',
        title: l.businessName,
        subtitle: `${STAGE_META[l.stage].label} · ${l.contactName}`,
        icon: Handshake,
        tint: 'bg-sky-500/15 text-sky-300',
        to: `/crm?lead=${l.id}`,
      }));

    const chatResults = conversations
      .filter((c) => match(`${c.contactName} ${c.businessName} ${c.phone}`))
      .slice(0, PER_GROUP)
      .map<Result>((c) => ({
        key: `c-${c.id}`,
        group: 'Conversaciones',
        title: `${c.contactName} · ${c.businessName}`,
        subtitle: c.messages.at(-1)?.text ?? c.phone,
        icon: MessageCircle,
        tint: 'bg-green-500/15 text-green-300',
        to: `/chats?c=${c.id}`,
      }));

    return [...projectResults, ...tenantResults, ...taskResults, ...leadResults, ...chatResults];
  }, [projects, tenants, tasks, leads, conversations, query]);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const go = (to: string) => {
    navigate(to);
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => (h + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => (h - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      go(results[Math.min(highlight, results.length - 1)].to);
    }
  };

  const showPanel = open && query.trim().length >= 2;

  return (
    <div ref={containerRef} role="search" className="relative min-w-0 flex-1 xl:w-80 xl:flex-none 2xl:w-96">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setHighlight(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder="Buscar proyectos, clientes, tareas…"
        aria-label="Buscar"
        aria-expanded={showPanel}
        aria-controls="global-search-results"
        className="h-10 w-full rounded-xl border border-gray-800 bg-gray-900 pl-10 pr-14 text-sm text-white placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
      />
      {!query && (
        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-gray-700 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 md:block">
          Ctrl K
        </kbd>
      )}

      {showPanel && (
        <div
          id="global-search-results"
          className="absolute inset-x-0 top-full z-50 mt-2 max-h-[70dvh] overflow-y-auto rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl shadow-black/50"
        >
          {results.length === 0 ? (
            <p className="px-4 py-5 text-center text-sm text-gray-500">Sin resultados para “{query.trim()}”</p>
          ) : (
            <ul role="listbox" className="p-1.5">
              {results.map((r, i) => {
                const Icon = r.icon;
                const firstOfGroup = i === 0 || results[i - 1].group !== r.group;
                return (
                  <li key={r.key} role="option" aria-selected={i === highlight}>
                    {firstOfGroup && (
                      <p className="px-2.5 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">{r.group}</p>
                    )}
                    <button
                      onMouseEnter={() => setHighlight(i)}
                      onClick={() => go(r.to)}
                      className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left ${i === highlight ? 'bg-gray-800' : ''}`}
                    >
                      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${r.tint}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-white">{r.title}</span>
                        <span className="block truncate text-xs text-gray-400">{r.subtitle}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
