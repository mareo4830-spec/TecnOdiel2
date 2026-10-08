import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useFundMovements, useFundSummary } from '../../hours/hoursService';

const eur = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

/** Saldo del fondo común, reserva, repartible y últimos movimientos. */
export function FundWidget() {
  const summary = useFundSummary();
  const latest = useFundMovements().slice(0, 3);
  const reservePct = summary.balance > 0 ? Math.min(100, (summary.reserve / summary.balance) * 100) : 100;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-3xl font-semibold tabular-nums text-white">{eur.format(summary.balance)}</p>
        <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-gray-800">
          <div className="bg-gray-500" style={{ width: `${reservePct}%` }} />
          <div className="bg-emerald-500" style={{ width: `${100 - reservePct}%` }} />
        </div>
        <div className="mt-2 flex justify-between text-xs">
          <span className="text-gray-400">Reserva {eur.format(summary.reserve)}</span>
          <span className="font-medium text-emerald-300">Repartible {eur.format(summary.distributable)}</span>
        </div>
      </div>
      <ul className="space-y-2 border-t border-gray-800 pt-3">
        {latest.map((m) => {
          const income = m.type === 'aportacion';
          return (
            <li key={m.id} className="flex items-center gap-2 text-sm">
              {income ? (
                <ArrowDownLeft className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
              ) : (
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-rose-400" />
              )}
              <span className="min-w-0 flex-1 truncate text-gray-300">{m.concept}</span>
              <span className={`shrink-0 tabular-nums ${income ? 'text-emerald-300' : 'text-rose-300'}`}>
                {income ? '+' : '−'}
                {eur.format(m.amount)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
