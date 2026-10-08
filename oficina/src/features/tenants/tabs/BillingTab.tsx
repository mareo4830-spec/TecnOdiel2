import { Check, CircleDollarSign, Pencil, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../../../components/ui/Badge';
import { daysUntil, formatEuros, formatShortDate } from '../../../lib/format';
import type { PaymentMode, Tenant, TenantPayment } from '../../../types';
import { useAuth } from '../../auth/authContext';
import { Field, inputClass } from '../components/TenantBits';
import { PAYMENT_CONCEPT_LABEL } from '../tenantMeta';
import { createBilling, markPaymentPaid, unmarkPayment, updateBilling, usePlans, useTenantBilling, useTenantPayments } from '../tenantService';
import { Card, Row } from './shared';

const METHODS = ['transferencia', 'bizum', 'efectivo', 'tarjeta'];
const ORDER: TenantPayment['concept'][] = ['deposit', 'single', 'final', 'maintenance', 'ai'];

function dueBadge(p: TenantPayment) {
  if (p.paidAt) return <Badge className="bg-emerald-500/15 text-emerald-300 ring-emerald-500/30">Cobrado</Badge>;
  if (!p.dueDate) return <Badge>Sin fecha</Badge>;
  const d = daysUntil(p.dueDate);
  if (d < 0) return <Badge className="bg-rose-500/15 text-rose-300 ring-rose-500/30">Vencido</Badge>;
  if (d <= 30) return <Badge className="bg-amber-500/15 text-amber-300 ring-amber-500/30">Vence en {d} d</Badge>;
  return <Badge>Pendiente</Badge>;
}

/** Alta de la facturación cuando no se puso precio en el asistente. */
function NewBilling({ tenant }: { tenant: Tenant }) {
  const plan = usePlans().find((p) => p.id === tenant.planId);
  const [form, setForm] = useState({ price: plan ? String(plan.setupPrice) : '', mode: 'split_50_50' as PaymentMode, maintenance: String(plan?.yearlyMaintenance ?? 50) });
  const [error, setError] = useState<string | null>(null);
  const save = () => {
    const price = Number(form.price.replace(',', '.'));
    const maintenance = Number(form.maintenance.replace(',', '.'));
    if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(maintenance) || maintenance < 0) {
      setError('Revisa los importes.');
      return;
    }
    try {
      createBilling(tenant.id, { closedPrice: price, paymentMode: form.mode, maintenanceYearly: maintenance });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar');
    }
  };
  return (
    <Card title="Configurar facturación">
      <p className="mb-4 text-sm text-gray-400">Aún no hay precio cerrado. Cuando lo tengas, se generan los pagos (depósito y final, o pago único) y el mantenimiento.</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Precio de cierre (€)">
          <input className={inputClass} inputMode="decimal" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
        </Field>
        <Field label="Modalidad">
          <select className={inputClass} value={form.mode} onChange={(e) => setForm((f) => ({ ...f, mode: e.target.value as PaymentMode }))}>
            <option value="split_50_50">50 % + 50 %</option>
            <option value="single">Pago único</option>
          </select>
        </Field>
        <Field label="Mantenimiento anual (€)">
          <input className={inputClass} inputMode="decimal" value={form.maintenance} onChange={(e) => setForm((f) => ({ ...f, maintenance: e.target.value }))} />
        </Field>
      </div>
      {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
      <button onClick={save} className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-500">
        <CircleDollarSign className="h-4 w-4" />
        Guardar facturación
      </button>
    </Card>
  );
}

export function BillingTab({ tenant }: { tenant: Tenant }) {
  const billing = useTenantBilling(tenant.id);
  return billing ? <BillingDetail tenant={tenant} /> : <NewBilling tenant={tenant} />;
}

function BillingDetail({ tenant }: { tenant: Tenant }) {
  const { partner } = useAuth();
  const billing = useTenantBilling(tenant.id);
  const payments = useTenantPayments(tenant.id);
  const [method, setMethod] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ price: '', mode: 'single' as PaymentMode, maintenance: '' });
  const [error, setError] = useState<string | null>(null);

  if (!billing) return <p className="text-sm text-gray-400">Este tenant no tiene facturación.</p>;

  const sorted = [...payments].sort((a, b) => ORDER.indexOf(a.concept) - ORDER.indexOf(b.concept));
  const collected = payments.filter((p) => p.paidAt).reduce((s, p) => s + p.amount, 0);
  const pending = payments.filter((p) => !p.paidAt && (p.concept !== 'maintenance' || p.dueDate)).reduce((s, p) => s + p.amount, 0);
  const renewalDays = billing.maintenanceRenewal ? daysUntil(billing.maintenanceRenewal) : null;

  const startEdit = () => {
    setForm({ price: String(billing.closedPrice), mode: billing.paymentMode, maintenance: String(billing.maintenanceYearly) });
    setError(null);
    setEditing(true);
  };
  const save = () => {
    const price = Number(form.price.replace(',', '.'));
    const maintenance = Number(form.maintenance.replace(',', '.'));
    if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(maintenance) || maintenance < 0) {
      setError('Revisa los importes.');
      return;
    }
    try {
      updateBilling(tenant.id, { closedPrice: price, paymentMode: form.mode, maintenanceYearly: maintenance });
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar');
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-3">
      <Card
        title="Condiciones"
        action={
          !editing && (
            <button onClick={startEdit} className="inline-flex items-center gap-1 text-xs font-medium text-indigo-300 hover:text-indigo-200">
              <Pencil className="h-3.5 w-3.5" /> Editar
            </button>
          )
        }
      >
        {editing ? (
          <div className="space-y-3">
            <Field label="Precio de cierre (€)">
              <input className={inputClass} inputMode="decimal" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
            </Field>
            <Field label="Modalidad">
              <select className={inputClass} value={form.mode} onChange={(e) => setForm((f) => ({ ...f, mode: e.target.value as PaymentMode }))}>
                <option value="split_50_50">50 % + 50 %</option>
                <option value="single">Pago único</option>
              </select>
            </Field>
            <Field label="Mantenimiento anual (€)">
              <input className={inputClass} inputMode="decimal" value={form.maintenance} onChange={(e) => setForm((f) => ({ ...f, maintenance: e.target.value }))} />
            </Field>
            {error && <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-xs text-rose-300">{error}</p>}
            <p className="text-xs text-gray-500">Cambiar precio o modalidad regenera los pagos de cierre si ninguno está cobrado.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditing(false)} className="rounded-lg px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-800">Cancelar</button>
              <button onClick={save} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500">Guardar</button>
            </div>
          </div>
        ) : (
          <dl className="divide-y divide-gray-800">
            <Row label="Precio de cierre">{formatEuros(billing.closedPrice)}</Row>
            <Row label="Modalidad">{billing.paymentMode === 'single' ? 'Pago único' : '50 % + 50 %'}</Row>
            <Row label="Mantenimiento">{`${formatEuros(billing.maintenanceYearly)} / año`}</Row>
            <Row label="Renovación">
              {billing.maintenanceRenewal ? (
                <span className={renewalDays !== null && renewalDays <= 30 ? 'text-amber-300' : ''}>
                  {formatShortDate(billing.maintenanceRenewal)}
                  {renewalDays !== null && renewalDays >= 0 && ` · en ${renewalDays} días`}
                </span>
              ) : (
                'Se fija al salir a producción'
              )}
            </Row>
          </dl>
        )}
      </Card>

      <Card title="Pagos" className="xl:col-span-2">
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-emerald-500/10 p-3">
            <p className="text-xs text-emerald-300/80">Cobrado</p>
            <p className="text-lg font-semibold tabular-nums text-emerald-300">{formatEuros(collected)}</p>
          </div>
          <div className="rounded-xl bg-amber-500/10 p-3">
            <p className="text-xs text-amber-300/80">Pendiente</p>
            <p className="text-lg font-semibold tabular-nums text-amber-300">{formatEuros(pending)}</p>
          </div>
        </div>
        <ul className="divide-y divide-gray-800">
          {sorted.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-x-3 gap-y-2 py-3">
              <CircleDollarSign className={`h-5 w-5 shrink-0 ${p.paidAt ? 'text-emerald-400' : 'text-gray-500'}`} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white">{PAYMENT_CONCEPT_LABEL[p.concept]}</p>
                <p className="text-xs text-gray-500">
                  {p.paidAt
                    ? `Cobrado el ${formatShortDate(p.paidAt)}${p.method ? ` · ${p.method}` : ''}`
                    : p.dueDate
                      ? `Vence el ${formatShortDate(p.dueDate)}`
                      : p.concept === 'maintenance'
                        ? 'Vence un año después de salir a producción'
                        : 'Al publicar la web'}
                </p>
              </div>
              <span className="w-20 text-right text-sm font-semibold tabular-nums text-white">{formatEuros(p.amount)}</span>
              {dueBadge(p)}
              {p.paidAt ? (
                <button
                  onClick={() => unmarkPayment(p.id)}
                  title="Deshacer"
                  aria-label={`Deshacer el cobro de ${PAYMENT_CONCEPT_LABEL[p.concept]}`}
                  className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-800 hover:text-white"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              ) : (
                <span className="flex items-center gap-1.5">
                  <select
                    value={method[p.id] ?? 'transferencia'}
                    onChange={(e) => setMethod((m) => ({ ...m, [p.id]: e.target.value }))}
                    aria-label="Método de pago"
                    className="h-8 rounded-lg border border-gray-700 bg-gray-800 px-2 text-xs text-gray-200 focus:border-indigo-500 focus:outline-none"
                  >
                    {METHODS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => partner && markPaymentPaid(p.id, method[p.id] ?? 'transferencia', partner.id)}
                    className="inline-flex h-8 items-center gap-1 rounded-lg bg-emerald-600 px-2.5 text-xs font-semibold text-white hover:bg-emerald-500"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Marcar cobrado
                  </button>
                </span>
              )}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
