import { Check, PiggyBank } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Avatar } from '../../../components/ui/Avatar';
import { PARTNER_META } from '../../../lib/partners';
import { formatEuros } from '../../../lib/format';
import { useAuth } from '../../auth/authContext';
import { useProjects } from '../../projects/projectService';
import { computeReparto, formatHours, type SessionEvaluation } from '../hoursMath';
import { addFundMovement, useProjectFundPaid } from '../hoursService';
import { REPARTO_RULES, WORK_SHARE } from '../repartoConfig';

const pct = (n: number) => `${Math.round(n * 100)} %`;
const eur2 = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 });

export function RepartoPanel({ evaluations }: { evaluations: SessionEvaluation[] }) {
  const { partner } = useAuth();
  const projects = useProjects();
  const [projectId, setProjectId] = useState(projects[0]?.id ?? '');
  const [priceInput, setPriceInput] = useState('');
  const project = projects.find((p) => p.id === projectId);
  const paid = useProjectFundPaid(project?.id);

  const price = useMemo(() => {
    const n = Number(priceInput.replace(',', '.'));
    return priceInput.trim() && Number.isFinite(n) && n >= 0 ? n : (project?.price ?? 0);
  }, [priceInput, project]);

  const reparto = useMemo(
    () => (project ? computeReparto(project, evaluations, price) : null),
    [project, evaluations, price],
  );

  if (!project || !reparto) return <p className="text-sm text-gray-400">No hay proyectos todavía.</p>;

  const registerPayment = () => {
    if (!partner) return;
    addFundMovement(
      {
        type: 'aportacion',
        concept: `Cobro de ${project.businessName} (${pct(REPARTO_RULES.fund)})`,
        amount: reparto.fund,
        projectId: project.id,
      },
      partner.id,
    );
  };

  const split = [
    { label: 'Fondo común', value: REPARTO_RULES.fund, amount: reparto.fund, className: 'bg-amber-500' },
    { label: 'Cierre de venta', value: REPARTO_RULES.closing, amount: price * REPARTO_RULES.closing, className: 'bg-sky-500' },
    { label: 'Auditoría', value: REPARTO_RULES.audit, amount: price * REPARTO_RULES.audit, className: 'bg-purple-500' },
    { label: 'Trabajo (por horas)', value: WORK_SHARE, amount: reparto.workPool, className: 'bg-emerald-500' },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-3">
      <section className="space-y-4 rounded-2xl border border-gray-800 bg-gray-900 p-4 sm:p-5">
        <h2 className="font-semibold text-white">Calculadora</h2>
        <label className="block">
          <span className="mb-1.5 block text-sm text-gray-400">Proyecto</span>
          <select
            value={projectId}
            onChange={(e) => {
              setProjectId(e.target.value);
              setPriceInput('');
            }}
            className="h-10 w-full rounded-xl border border-gray-800 bg-gray-950 px-3 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.businessName} · {formatEuros(p.price)}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm text-gray-400">Importe cobrado (€)</span>
          <input
            inputMode="decimal"
            value={priceInput}
            onChange={(e) => setPriceInput(e.target.value)}
            placeholder={String(project.price)}
            className="h-10 w-full rounded-xl border border-gray-800 bg-gray-950 px-3 text-sm text-white placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none"
          />
          <span className="mt-1 block text-xs text-gray-500">Vacío = precio cerrado del proyecto. Útil para pagos parciales.</span>
        </label>

        <div>
          <div className="flex h-3 overflow-hidden rounded-full">
            {split.map((s) => (
              <div key={s.label} className={s.className} style={{ width: pct(s.value) }} title={s.label} />
            ))}
          </div>
          <ul className="mt-3 space-y-1.5 text-sm">
            {split.map((s) => (
              <li key={s.label} className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-sm ${s.className}`} />
                <span className="flex-1 text-gray-300">
                  {s.label} <span className="text-gray-500">({pct(s.value)})</span>
                </span>
                <span className="tabular-nums text-white">{eur2.format(s.amount)}</span>
              </li>
            ))}
          </ul>
        </div>

        {paid ? (
          <p className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-300">
            <Check className="h-4 w-4" />
            La parte del fondo de este proyecto ya está ingresada.
          </p>
        ) : (
          <button
            onClick={registerPayment}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 text-sm font-semibold text-gray-950 hover:bg-amber-400"
          >
            <PiggyBank className="h-4 w-4" />
            Registrar cobro: {eur2.format(reparto.fund)} al fondo
          </button>
        )}
        <p className="text-xs text-gray-500">
          Porcentajes en <code className="text-gray-400">src/features/hours/repartoConfig.ts</code>.
        </p>
      </section>

      <section className="rounded-2xl border border-gray-800 bg-gray-900 p-4 sm:p-5 xl:col-span-2">
        <h2 className="font-semibold text-white">Qué cobra cada socio · {project.businessName}</h2>
        {reparto.equalSplit && (
          <p className="mt-2 rounded-xl bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
            Todavía no hay horas verificadas en este proyecto: la parte de trabajo se reparte a partes iguales entre quienes
            han colaborado.
          </p>
        )}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500">
                <th className="pb-2 font-medium">Socio</th>
                <th className="pb-2 text-right font-medium">Horas</th>
                <th className="pb-2 text-right font-medium">Trabajo</th>
                <th className="pb-2 text-right font-medium">Cierre</th>
                <th className="pb-2 text-right font-medium">Auditoría</th>
                <th className="pb-2 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {reparto.rows.map((r) => (
                <tr key={r.partnerId}>
                  <td className="py-3">
                    <span className="flex items-center gap-2">
                      <Avatar partner={{ ...PARTNER_META[r.partnerId], avatarUrl: null }} size="xs" />
                      <span className="font-medium text-white">{PARTNER_META[r.partnerId].name}</span>
                    </span>
                  </td>
                  <td className="py-3 text-right tabular-nums text-gray-300">
                    {formatHours(r.hours)}
                    <span className="block text-[11px] text-gray-500">{pct(r.hoursShare)}</span>
                  </td>
                  <td className="py-3 text-right tabular-nums text-gray-300">{eur2.format(r.work)}</td>
                  <td className="py-3 text-right tabular-nums text-gray-300">{r.closing ? eur2.format(r.closing) : '—'}</td>
                  <td className="py-3 text-right tabular-nums text-gray-300">{r.audit ? eur2.format(r.audit) : '—'}</td>
                  <td className="py-3 text-right font-semibold tabular-nums text-white">{eur2.format(r.total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-700 text-gray-400">
                <td className="pt-3" colSpan={5}>
                  + Fondo común
                </td>
                <td className="pt-3 text-right tabular-nums">{eur2.format(reparto.fund)}</td>
              </tr>
              <tr className="text-white">
                <td className="pt-1 font-semibold" colSpan={5}>
                  Total cobrado
                </td>
                <td className="pt-1 text-right font-semibold tabular-nums">{eur2.format(reparto.price)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </div>
  );
}
