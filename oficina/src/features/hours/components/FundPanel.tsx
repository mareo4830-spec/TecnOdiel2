import { ArrowDownLeft, ArrowUpRight, Plus } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Avatar } from '../../../components/ui/Avatar';
import { PARTNER_META } from '../../../lib/partners';
import { formatShortDate } from '../../../lib/format';
import type { FundMovementType } from '../../../types';
import { useAuth } from '../../auth/authContext';
import { useProjects } from '../../projects/projectService';
import { addFundMovement, useFundMovements, useFundSummary } from '../hoursService';

const eur2 = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 });
const inputClass =
  'h-10 w-full rounded-xl border border-gray-800 bg-gray-950 px-3 text-sm text-white placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none';

export function FundSummaryCards() {
  const summary = useFundSummary();
  const cards = [
    { label: 'Saldo', value: summary.balance, className: 'text-white' },
    { label: 'Reserva mínima', value: summary.reserve, className: 'text-gray-300' },
    { label: 'Repartible', value: summary.distributable, className: 'text-emerald-300' },
    { label: 'Gastos acumulados', value: summary.expenses, className: 'text-rose-300' },
  ];
  return (
    <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
          <dt className="text-xs text-gray-400">{c.label}</dt>
          <dd className={`mt-1 text-xl font-semibold tabular-nums sm:text-2xl ${c.className}`}>{eur2.format(c.value)}</dd>
        </div>
      ))}
    </dl>
  );
}

export function FundPanel() {
  const { partner } = useAuth();
  const projects = useProjects();
  const movements = useFundMovements();
  const [type, setType] = useState<FundMovementType>('gasto');
  const [concept, setConcept] = useState('');
  const [amount, setAmount] = useState('');
  const [projectId, setProjectId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const value = Number(amount.replace(',', '.'));
    if (!concept.trim()) return setError('Indica el concepto.');
    if (!Number.isFinite(value) || value <= 0) return setError('Introduce un importe válido.');
    if (!partner) return;
    addFundMovement({ type, concept, amount: Math.round(value * 100) / 100, projectId: projectId || null }, partner.id);
    setConcept('');
    setAmount('');
    setProjectId('');
    setError(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <FundSummaryCards />
      <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-3">
        <form onSubmit={submit} className="space-y-3 rounded-2xl border border-gray-800 bg-gray-900 p-4 sm:p-5">
          <h2 className="font-semibold text-white">Nuevo movimiento</h2>
          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Tipo de movimiento">
            {(['gasto', 'aportacion'] as FundMovementType[]).map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={type === t}
                onClick={() => setType(t)}
                className={`h-10 rounded-xl text-sm font-medium transition ${
                  type === t
                    ? t === 'gasto'
                      ? 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/40'
                      : 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/40'
                    : 'bg-gray-950 text-gray-400 ring-1 ring-gray-800 hover:text-white'
                }`}
              >
                {t === 'gasto' ? 'Gasto' : 'Aportación'}
              </button>
            ))}
          </div>
          <input value={concept} onChange={(e) => setConcept(e.target.value)} placeholder="Concepto (ej. Dominio .es)" aria-label="Concepto" className={inputClass} />
          <input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" placeholder="Importe en €" aria-label="Importe" className={inputClass} />
          <select value={projectId} onChange={(e) => setProjectId(e.target.value)} aria-label="Proyecto" className={inputClass}>
            <option value="">Gasto general (sin proyecto)</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.businessName}</option>
            ))}
          </select>
          {error && <p className="text-xs text-rose-400">{error}</p>}
          <button
            type="submit"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-sm font-semibold text-white hover:from-indigo-500 hover:to-purple-500"
          >
            <Plus className="h-4 w-4" />
            Registrar
          </button>
        </form>

        <section className="rounded-2xl border border-gray-800 bg-gray-900 p-4 sm:p-5 xl:col-span-2">
          <h2 className="font-semibold text-white">Movimientos</h2>
          <ul className="mt-3 divide-y divide-gray-800">
            {movements.map((m) => {
              const income = m.type === 'aportacion';
              const project = m.projectId ? projects.find((p) => p.id === m.projectId) : undefined;
              return (
                <li key={m.id} className="flex items-center gap-3 py-3">
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                      income ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'
                    }`}
                  >
                    {income ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-gray-100">{m.concept}</p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Avatar partner={{ ...PARTNER_META[m.createdBy], avatarUrl: null }} size="xs" />
                      {formatShortDate(m.createdAt)}
                      {project && <span className="truncate">· {project.businessName}</span>}
                    </div>
                  </div>
                  <span className={`shrink-0 text-sm font-semibold tabular-nums ${income ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {income ? '+' : '−'}
                    {eur2.format(m.amount)}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
