import { FilterX, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Avatar } from '../../components/ui/Avatar';
import { MOCK_PARTNERS } from '../../lib/partners';
import type { PartnerId } from '../../types';
import { useProjects } from '../projects/projectService';
import { WorkBoard } from './components/WorkBoard';
import { useWorkItems } from './workService';

const normalize = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Origen de las tarjetas: todo, solo proyectos estándar o los tenants de un SaaS concreto. */
type Origin = 'todos' | 'standard' | string;

export function KanbanPage() {
  const items = useWorkItems();
  const saasProjects = useProjects().filter((p) => p.kind === 'saas');
  // `?proyecto=<id>` llega desde un proyecto SaaS: abre filtrado por sus tenants.
  const [params] = useSearchParams();
  const paramProject = params.get('proyecto');
  const [origin, setOrigin] = useState<Origin>(() => paramProject ?? 'todos');
  const [partnerId, setPartnerId] = useState<PartnerId | 'todos'>('todos');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return items.filter(
      (i) =>
        (origin === 'todos' || (origin === 'standard' ? i.kind === 'project' : i.kind === 'tenant' && i.projectId === origin)) &&
        (partnerId === 'todos' || i.people.includes(partnerId)) &&
        (!q || normalize(`${i.title} ${i.subtitle} ${i.meeting?.place ?? ''}`).includes(q)),
    );
  }, [items, origin, partnerId, query]);

  const hasFilters = origin !== 'todos' || partnerId !== 'todos' || query !== '';
  const selectClass = 'h-10 rounded-xl border border-gray-800 bg-gray-900 px-3 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none';

  return (
    <div className="mx-auto max-w-[1600px] space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <div className="relative col-span-2 sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar cliente o lugar"
              aria-label="Buscar en el Kanban"
              className="h-10 w-full rounded-xl border border-gray-800 bg-gray-900 pl-10 pr-3 text-sm text-white placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <select value={origin} onChange={(e) => setOrigin(e.target.value)} aria-label="Origen" className={`${selectClass} col-span-2 sm:w-64`}>
            <option value="todos">Proyectos y tenants</option>
            <option value="standard">Solo proyectos estándar</option>
            {saasProjects.map((p) => (
              <option key={p.id} value={p.id}>
                Tenants de {p.name}
              </option>
            ))}
          </select>
          {hasFilters && (
            <button
              onClick={() => {
                setOrigin('todos');
                setPartnerId('todos');
                setQuery('');
              }}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl px-3 text-sm text-gray-400 hover:bg-gray-900 hover:text-white"
            >
              <FilterX className="h-4 w-4" />
              Limpiar
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 lg:ml-auto" role="group" aria-label="Filtrar por socio">
          <button
            onClick={() => setPartnerId('todos')}
            aria-pressed={partnerId === 'todos'}
            className={`h-10 rounded-xl px-3 text-sm font-medium transition ${
              partnerId === 'todos' ? 'bg-indigo-600 text-white' : 'text-gray-400 ring-1 ring-gray-800 hover:text-white'
            }`}
          >
            Todos
          </button>
          {MOCK_PARTNERS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPartnerId(partnerId === p.id ? 'todos' : p.id)}
              aria-pressed={partnerId === p.id}
              title={p.name}
              className={`flex h-10 items-center gap-2 rounded-xl pl-1.5 pr-3 text-sm transition ${
                partnerId === p.id ? 'bg-indigo-600/20 text-white ring-1 ring-indigo-500' : 'text-gray-400 ring-1 ring-gray-800 hover:text-white'
              }`}
            >
              <Avatar partner={p} size="xs" />
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <WorkBoard items={filtered} />

      <p className="hidden text-xs text-gray-500 lg:block">
        Cada tarjeta es un cliente: proyecto estándar o tenant de un SaaS. Arrastra entre columnas o usa el menú ···; las tareas técnicas de cada
        proyecto están en su pestaña Desarrollo.
      </p>
    </div>
  );
}
