import { Plus, Search } from 'lucide-react';
import { useCallback, useMemo, useState, type DragEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { daysUntil, formatEuros } from '../../lib/format';
import { PARTNER_IDS, PARTNER_META } from '../../lib/partners';
import type { LeadStage, NewProjectInput, PartnerId } from '../../types';
import { useAuth } from '../auth/authContext';
import { NewProjectDialog } from '../projects/components/NewProjectDialog';
import { BUSINESS_TYPE_META } from '../projects/projectMeta';
import { LeadCard } from './components/LeadCard';
import { LeadDrawer } from './components/LeadDrawer';
import { NewLeadDialog } from './components/NewLeadDialog';
import { toast } from '../../lib/toast';
import { PIPELINE_STAGES, STAGE_META } from './leadMeta';
import { convertLead, createLead, moveLead, useLead, useLeads, type NewLeadInput } from './leadService';

const normalize = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function CrmPage() {
  const { partner } = useAuth();
  const leads = useLeads();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [owner, setOwner] = useState<PartnerId | 'todos'>('todos');
  const [showLost, setShowLost] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<LeadStage | null>(null);
  const [converting, setConverting] = useState(false);

  const selectedId = params.get('lead');
  const selected = useLead(selectedId);
  const newOpen = params.get('nuevo') === '1';

  const setParam = useCallback(
    (key: string, value: string | null) =>
      setParams((prev) => {
        if (value) prev.set(key, value);
        else prev.delete(key);
        return prev;
      }),
    [setParams],
  );
  const closeDrawer = useCallback(() => setParam('lead', null), [setParam]);
  const closeNew = useCallback(() => setParam('nuevo', null), [setParam]);
  const closeConvert = useCallback(() => setConverting(false), []);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return leads.filter(
      (l) =>
        (owner === 'todos' || l.owner === owner) &&
        (!q || normalize(`${l.businessName} ${l.contactName} ${l.city}`).includes(q)),
    );
  }, [leads, owner, query]);

  const stats = useMemo(() => {
    const open = leads.filter((l) => l.stage !== 'cerrado' && l.stage !== 'perdido');
    const won = leads.filter((l) => l.stage === 'cerrado').length;
    const lost = leads.filter((l) => l.stage === 'perdido').length;
    const due = open.filter((l) => l.nextActionDate && daysUntil(l.nextActionDate) <= 0).length;
    return [
      { label: 'Pipeline abierto', value: formatEuros(open.reduce((s, l) => s + l.estimatedValue, 0)) },
      {
        label: 'Previsión ponderada',
        value: formatEuros(open.reduce((s, l) => s + l.estimatedValue * STAGE_META[l.stage].probability, 0)),
      },
      { label: 'Tasa de cierre', value: won + lost ? `${Math.round((won / (won + lost)) * 100)} %` : '—' },
      { label: 'Seguimientos para hoy o vencidos', value: String(due) },
    ];
  }, [leads]);

  const stages: LeadStage[] = showLost ? [...PIPELINE_STAGES, 'perdido'] : PIPELINE_STAGES;

  const onDrop = (stage: LeadStage) => (e: DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || dragId;
    if (id && partner) moveLead(id, stage, partner.id);
    setDragId(null);
    setOverStage(null);
  };

  const handleCreateLead = (input: NewLeadInput) => {
    if (!partner) return;
    const lead = createLead(input, partner.id);
    toast('Lead añadido al pipeline');
    setParams({ lead: lead.id });
  };

  const handleConvert = (input: NewProjectInput) => {
    if (!partner || !selected) return;
    const project = convertLead(selected.id, input, partner.id);
    setConverting(false);
    if (project) navigate(`/proyectos/${project.id}`);
  };

  return (
    <div className="mx-auto max-w-[1600px] space-y-5 sm:space-y-6">
      <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
            <dt className="text-xs text-gray-400">{s.label}</dt>
            <dd className="mt-1 text-xl font-semibold text-white sm:text-2xl">{s.value}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar negocio, contacto o ciudad"
            aria-label="Buscar leads"
            className="h-10 w-full rounded-xl border border-gray-800 bg-gray-900 pl-10 pr-3 text-sm text-white placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>
        <div className="flex flex-wrap gap-2 sm:ml-auto">
          <select
            value={owner}
            onChange={(e) => setOwner(e.target.value as PartnerId | 'todos')}
            aria-label="Responsable"
            className="h-10 flex-1 rounded-xl border border-gray-800 bg-gray-900 px-3 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none sm:flex-none"
          >
            <option value="todos">Todos los socios</option>
            {PARTNER_IDS.map((id) => (
              <option key={id} value={id}>{PARTNER_META[id].name}</option>
            ))}
          </select>
          <button
            onClick={() => setShowLost((v) => !v)}
            aria-pressed={showLost}
            className={`h-10 rounded-xl px-3 text-sm font-medium ring-1 transition ${
              showLost ? 'bg-rose-500/15 text-rose-300 ring-rose-500/40' : 'bg-gray-900 text-gray-400 ring-gray-800 hover:text-white'
            }`}
          >
            Perdidos
          </button>
          <button
            onClick={() => setParam('nuevo', '1')}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 hover:from-indigo-500 hover:to-purple-500"
          >
            <Plus className="h-4 w-4" />
            Nuevo lead
          </button>
        </div>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        <div className="flex gap-4">
          {stages.map((stage) => {
            const items = filtered
              .filter((l) => l.stage === stage)
              .sort((a, b) => (a.nextActionDate ?? '9999').localeCompare(b.nextActionDate ?? '9999'));
            const meta = STAGE_META[stage];
            return (
              <section
                key={stage}
                aria-label={meta.label}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOverStage(stage);
                }}
                onDragLeave={() => setOverStage((s) => (s === stage ? null : s))}
                onDrop={onDrop(stage)}
                className={`flex w-72 shrink-0 flex-col rounded-2xl border bg-gray-900 p-3 transition ${
                  overStage === stage && dragId ? 'border-indigo-500/60 bg-indigo-500/5' : 'border-gray-800'
                }`}
              >
                <header className="mb-3 flex items-center gap-2 px-1">
                  <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                  <h2 className="text-sm font-semibold text-white">{meta.label}</h2>
                  <span className="rounded-md bg-gray-800 px-1.5 text-xs text-gray-400">{items.length}</span>
                  <span className="ml-auto text-xs tabular-nums text-gray-500">
                    {formatEuros(items.reduce((s, l) => s + l.estimatedValue, 0))}
                  </span>
                </header>
                <div className="flex min-h-24 flex-1 flex-col gap-2">
                  {items.map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      dragging={dragId === lead.id}
                      onOpen={() => setParam('lead', lead.id)}
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', lead.id);
                        e.dataTransfer.effectAllowed = 'move';
                        setDragId(lead.id);
                      }}
                      onDragEnd={() => {
                        setDragId(null);
                        setOverStage(null);
                      }}
                    />
                  ))}
                  {items.length === 0 && (
                    <p className="rounded-xl border border-dashed border-gray-800 px-3 py-6 text-center text-xs text-gray-500">
                      Arrastra aquí un lead
                    </p>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {selected && !converting && (
        <LeadDrawer lead={selected} onClose={closeDrawer} onConvert={() => setConverting(true)} />
      )}
      {selected && converting && partner && (
        <NewProjectDialog
          defaultPartner={partner.id}
          initial={{
            name: `Web ${BUSINESS_TYPE_META[selected.businessType].label}`,
            businessName: selected.businessName,
            businessType: selected.businessType,
            price: selected.estimatedValue,
            closedBy: selected.owner,
          }}
          onClose={closeConvert}
          onCreate={handleConvert}
        />
      )}
      {newOpen && partner && <NewLeadDialog defaultOwner={partner.id} onClose={closeNew} onCreate={handleCreateLead} />}
    </div>
  );
}
