import { Check, Clock } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/Badge';
import { ConfirmDialog, DeleteIconButton } from '../../../components/ui/ConfirmDialog';
import { PARTNER_IDS, PARTNER_META } from '../../../lib/partners';
import type { PartnerId, SessionVerification, WorkSession } from '../../../types';
import { useAuth } from '../../auth/authContext';
import { useProjects } from '../../projects/projectService';
import { formatHours, type SessionEvaluation } from '../hoursMath';
import { VERIFICATION_META } from '../hoursMeta';
import { approveSession, deleteSession } from '../hoursService';
import { DAILY_CAP_HOURS } from '../repartoConfig';

const WEEK_MS = 7 * 24 * 3_600_000;
const dateFmt = new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
const timeFmt = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' });

const selectClass =
  'h-10 rounded-xl border border-gray-800 bg-gray-900 px-3 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none';

export function SessionsPanel({ evaluations }: { evaluations: SessionEvaluation[] }) {
  const { partner } = useAuth();
  const projects = useProjects();
  const [who, setWho] = useState<PartnerId | 'todos'>('todos');
  const [projectId, setProjectId] = useState('todos');
  const [state, setState] = useState<SessionVerification | 'todas'>('todas');
  const [toDelete, setToDelete] = useState<WorkSession | null>(null);

  const week = useMemo(() => {
    const since = Date.now() - WEEK_MS;
    const recent = evaluations.filter((e) => new Date(e.session.startedAt).getTime() >= since);
    return PARTNER_IDS.map((id) => {
      const mine = recent.filter((e) => e.session.partnerId === id);
      return {
        id,
        counted: mine.reduce((s, e) => s + e.counted, 0),
        pending: mine.filter((e) => e.verification === 'pendiente').reduce((s, e) => s + e.hours, 0),
      };
    });
  }, [evaluations]);
  const maxWeek = Math.max(1, ...week.map((w) => w.counted + w.pending));

  const filtered = evaluations.filter(
    (e) =>
      (who === 'todos' || e.session.partnerId === who) &&
      (projectId === 'todos' || e.session.projectId === projectId) &&
      (state === 'todas' || e.verification === state),
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-3">
      <section className="rounded-2xl border border-gray-800 bg-gray-900 p-4 sm:p-5">
        <h2 className="font-semibold text-white">Últimos 7 días</h2>
        <p className="mt-0.5 text-xs text-gray-500">Horas que cuentan para el reparto (tope de {DAILY_CAP_HOURS} h/día).</p>
        <ul className="mt-5 space-y-4">
          {week.map((w) => (
            <li key={w.id} className="flex items-center gap-3">
              <Avatar partner={{ ...PARTNER_META[w.id], avatarUrl: null }} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="font-medium text-white">{PARTNER_META[w.id].name}</span>
                  <span className="tabular-nums text-gray-300">{formatHours(w.counted)}</span>
                </div>
                <div className="mt-1.5 flex h-2 overflow-hidden rounded-full bg-gray-800">
                  <div className="bg-emerald-500" style={{ width: `${(w.counted / maxWeek) * 100}%` }} />
                  <div className="bg-amber-500/60" style={{ width: `${(w.pending / maxWeek) * 100}%` }} />
                </div>
                {w.pending > 0 && (
                  <p className="mt-1 text-[11px] text-amber-300/80">+ {formatHours(w.pending)} pendientes de validar</p>
                )}
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-5 space-y-1.5 rounded-xl bg-gray-800/40 p-3 text-xs text-gray-400">
          <p>
            <span className="font-semibold text-emerald-300">Verificada:</span> hubo un push tuyo a ese proyecto durante la
            sesión.
          </p>
          <p>
            <span className="font-semibold text-amber-300">Pendiente:</span> sin push (reuniones, diseño…). Otro socio tiene
            que validarla para que cuente.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-800 bg-gray-900 p-4 sm:p-5 xl:col-span-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <h2 className="font-semibold text-white">Sesiones</h2>
          <div className="grid grid-cols-1 gap-2 sm:ml-auto sm:flex">
            <select value={who} onChange={(e) => setWho(e.target.value as PartnerId | 'todos')} aria-label="Socio" className={selectClass}>
              <option value="todos">Todos los socios</option>
              {PARTNER_IDS.map((id) => (
                <option key={id} value={id}>{PARTNER_META[id].name}</option>
              ))}
            </select>
            <select value={projectId} onChange={(e) => setProjectId(e.target.value)} aria-label="Proyecto" className={selectClass}>
              <option value="todos">Todos los proyectos</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.businessName}</option>
              ))}
            </select>
            <select
              value={state}
              onChange={(e) => setState(e.target.value as SessionVerification | 'todas')}
              aria-label="Estado"
              className={selectClass}
            >
              <option value="todas">Todos los estados</option>
              {(Object.keys(VERIFICATION_META) as SessionVerification[]).map((v) => (
                <option key={v} value={v}>{VERIFICATION_META[v].label}</option>
              ))}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-4 flex flex-col items-center rounded-xl border border-dashed border-gray-800 px-6 py-10 text-center">
            <Clock className="h-8 w-8 text-gray-600" />
            <p className="mt-2 text-sm text-gray-400">No hay sesiones con estos filtros.</p>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-gray-800">
            {filtered.map(({ session: s, verification, hours, counted }) => {
              const meta = VERIFICATION_META[verification];
              const Icon = meta.icon;
              const project = projects.find((p) => p.id === s.projectId);
              const canApprove = verification === 'pendiente' && partner && partner.id !== s.partnerId;
              return (
                <li key={s.id} className="flex flex-wrap items-center gap-x-3 gap-y-2 py-3">
                  <Avatar partner={{ ...PARTNER_META[s.partnerId], avatarUrl: null }} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-gray-200">
                      <span className="font-medium text-white">{PARTNER_META[s.partnerId].name}</span> ·{' '}
                      {project ? (
                        <Link to={`/proyectos/${project.id}`} className="text-indigo-300 hover:underline">
                          {project.businessName}
                        </Link>
                      ) : (
                        'Proyecto eliminado'
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      {dateFmt.format(new Date(s.startedAt))} · {timeFmt.format(new Date(s.startedAt))}–
                      {timeFmt.format(new Date(s.endedAt))}
                      {s.approvedBy && verification === 'aprobada' && ` · validada por ${PARTNER_META[s.approvedBy].name}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={meta.badge}>
                      <Icon className="h-3 w-3" />
                      <span className="hidden sm:inline">{meta.label}</span>
                    </Badge>
                    <span className="w-24 text-right text-sm tabular-nums text-gray-200">
                      {formatHours(hours)}
                      {counted < hours && verification !== 'pendiente' && (
                        <span className="block text-[11px] text-amber-300/80">cuentan {formatHours(counted)}</span>
                      )}
                    </span>
                    {canApprove && (
                      <button
                        onClick={() => approveSession(s.id, partner.id)}
                        className="inline-flex h-8 items-center gap-1 rounded-lg bg-sky-600 px-2.5 text-xs font-semibold text-white hover:bg-sky-500"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Validar
                      </button>
                    )}
                    <DeleteIconButton label="Eliminar sesión" onClick={() => setToDelete(s)} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
      {toDelete && partner && (
        <ConfirmDialog
          title="Eliminar sesión"
          confirmLabel="Eliminar sesión"
          onCancel={() => setToDelete(null)}
          onConfirm={async () => {
            const ok = await deleteSession(toDelete.id, partner.id);
            if (!ok) return false;
            setToDelete(null);
          }}
        >
          <p>
            Se borrará la sesión de {PARTNER_META[toDelete.partnerId].name} del{' '}
            {dateFmt.format(new Date(toDelete.startedAt))} ({timeFmt.format(new Date(toDelete.startedAt))}–
            {timeFmt.format(new Date(toDelete.endedAt))}). Sus horas dejan de contar para el reparto.
          </p>
          <p className="text-gray-400">Esta acción no se puede deshacer.</p>
        </ConfirmDialog>
      )}
    </div>
  );
}
