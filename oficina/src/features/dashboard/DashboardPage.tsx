import { ArrowUpRight, CalendarClock, Folder, Plus } from 'lucide-react';
import { AnimatePresence, motion, type Variants } from 'motion/react';
import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '../../components/ui/Avatar';
import { CountUp } from '../../components/ui/CountUp';
import { formatRelative } from '../../lib/format';
import { TimeTracker } from '../checkin/TimeTracker';
import { useLeads } from '../crm/leadService';
import { useSessionEvaluations } from '../hours/hoursService';
import { useWorkItems, type WorkItem } from '../kanban/workService';
import { useProjects } from '../projects/projectService';
import { usePresence, useTeam } from '../team/useTeam';
import { ActivityWidget } from './widgets/ActivityWidget';

/*
 * Panel estilo Fernly, con los datos reales de la oficina:
 * contadores de trabajos · horas por día de la semana · próxima cita · proyectos recientes ·
 * equipo · progreso global · Time Tracker (check-in) · actividad.
 */

const grid: Variants = { show: { transition: { staggerChildren: 0.06 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.97, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

function Card({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <motion.section variants={item} className={`card p-5 ${className}`}>
      {children}
    </motion.section>
  );
}

const startOfMonth = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
};

export function DashboardPage() {
  const work = useWorkItems();
  const counts = useMemo(() => {
    const monthStart = startOfMonth();
    const by = (stage: WorkItem['stage']) => work.filter((w) => w.stage === stage);
    return {
      total: work.length,
      newThisMonth: work.filter((w) => w.updatedAt >= monthStart).length,
      done: by('hecho').length,
      running: by('en_progreso').length,
      waiting: by('en_progreso').filter((w) => w.waitingClient).length,
      planned: by('planeado').length,
    };
  }, [work]);

  const stats = [
    { label: 'Trabajos totales', value: counts.total, foot: `${counts.newThisMonth} con movimiento este mes`, to: '/kanban' },
    { label: 'Terminados', value: counts.done, foot: 'Entregados al cliente', to: '/kanban' },
    { label: 'En progreso', value: counts.running, foot: counts.waiting ? `${counts.waiting} esperando al cliente` : 'Nadie esperando al cliente', to: '/kanban' },
    { label: 'Por cerrar', value: counts.planned, foot: 'Pendientes de cita con el cliente', to: '/kanban', highlight: true },
  ];

  return (
    <motion.div data-own-motion variants={grid} initial="hidden" animate="show" className="mx-auto grid max-w-[1600px] grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-12">
      {stats.map((s, i) => (
        <motion.div key={s.label} variants={item} className="xl:col-span-3">
          <StatCard {...s} filled={i === 0} />
        </motion.div>
      ))}

      <Card className="col-span-2 xl:col-span-5">
        <WeekHours />
      </Card>
      <Card className="col-span-2 md:col-span-1 xl:col-span-3">
        <Reminder />
      </Card>
      <Card className="col-span-2 md:col-span-1 xl:col-span-4">
        <RecentProjects />
      </Card>

      <Card className="col-span-2 xl:col-span-5">
        <TeamCollaboration />
      </Card>
      <Card className="col-span-2 md:col-span-1 xl:col-span-3">
        <ProgressGauge done={counts.done} running={counts.running} planned={counts.planned} />
      </Card>
      <motion.div variants={item} className="col-span-2 md:col-span-1 xl:col-span-4">
        <TimeTracker />
      </motion.div>

      <Card className="col-span-2 xl:col-span-12">
        <CardTitle title="Actividad del equipo" />
        <ActivityWidget />
      </Card>
    </motion.div>
  );
}

function CardTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-base font-semibold text-white">{title}</h2>
      {action}
    </div>
  );
}

// ---------------------------------------------------------------- contadores

function StatCard({ label, value, foot, to, filled, highlight }: { label: string; value: number; foot: string; to: string; filled?: boolean; highlight?: boolean }) {
  return (
    <Link
      to={to}
      className={`group block h-full rounded-2xl p-4 transition sm:p-5 hover:-translate-y-0.5 hover:shadow-lg ${
        filled ? 'waves on-accent text-white shadow-md' : 'card'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-white sm:text-[15px]">{label}</p>
        <span
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition group-hover:rotate-45 ${
            filled ? 'border-transparent bg-paper text-indigo-800' : 'border-gray-600 text-white'
          }`}
        >
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
      <CountUp value={value} className="mt-3 block text-[2rem] font-bold leading-none tracking-tight sm:text-[2.6rem]" />
      <p className={`mt-3 text-xs ${filled ? 'text-white/75' : highlight ? 'font-medium text-indigo-600' : 'text-gray-400'}`}>{foot}</p>
    </Link>
  );
}

// ---------------------------------------------------------------- horas de la semana

const DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const FILLS = ['bg-indigo-700', 'bg-indigo-500', 'bg-indigo-300', 'bg-indigo-900'];

function WeekHours() {
  const evaluations = useSessionEvaluations();
  const [hover, setHover] = useState<number | null>(null);

  const week = useMemo(() => {
    const now = new Date();
    const monday = new Date(now);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    const hours = Array<number>(7).fill(0);
    for (const e of evaluations) {
      const d = new Date(e.session.startedAt);
      const idx = Math.floor((d.getTime() - monday.getTime()) / 86_400_000);
      if (idx >= 0 && idx < 7) hours[idx] += e.counted;
    }
    return { hours, today: (now.getDay() + 6) % 7 };
  }, [evaluations]);

  const max = Math.max(8, ...week.hours);
  const total = week.hours.reduce((s, h) => s + h, 0);
  const peak = week.hours.indexOf(Math.max(...week.hours));

  // Ancho real de una barra: cada una nace como un círculo de ese diámetro antes de estirarse.
  const rowRef = useRef<HTMLDivElement>(null);
  const [barW, setBarW] = useState(0);
  useLayoutEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const measure = () => {
      const bar = el.querySelector<HTMLElement>('[data-bar]');
      if (bar) setBarW(bar.offsetWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const ROW = 176; // h-44

  return (
    <>
      <CardTitle
        title="Horas de la semana"
        action={
          <span className="text-xs font-medium text-gray-400">
            <CountUp value={total} format={(n) => n.toFixed(1)} /> h verificadas
          </span>
        }
      />
      <div ref={rowRef} className="flex h-44 items-end justify-between gap-2 sm:gap-3" onMouseLeave={() => setHover(null)}>
        {week.hours.map((h, i) => {
          const empty = h === 0;
          const pct = empty ? 70 + ((i * 13) % 25) : Math.max(18, (h / max) * 100);
          const target = (pct / 100) * ROW;
          const dot = Math.min(barW || 40, target);
          const delay = 0.25 + i * 0.09;
          const dim = hover !== null && hover !== i;
          // Etiqueta flotante: la del día con más horas aparece sola; al pasar el ratón, la de ese día.
          const label = !empty && (hover === i || (hover === null && i === peak && total > 0));
          return (
            <div key={i} className="relative flex h-full flex-1 flex-col items-center justify-end" onMouseEnter={() => setHover(i)}>
              <AnimatePresence>
                {label && (
                  <motion.span
                    key={hover === null ? 'peak' : 'hover'}
                    initial={{ opacity: 0, y: 8, scale: 0.6 }}
                    animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 500, damping: 22, delay: hover === null ? delay + 0.7 : 0 } }}
                    exit={{ opacity: 0, y: 4, scale: 0.8, transition: { duration: 0.12 } }}
                    style={{ bottom: target + 6 }}
                    className="absolute z-10 whitespace-nowrap rounded-full border border-gray-700 bg-gray-900 px-2 py-0.5 text-[10px] font-semibold text-white shadow"
                  >
                    {h.toFixed(1)} h
                  </motion.span>
                )}
              </AnimatePresence>
              {/* Nace como un punto, se hincha a círculo y se estira hasta su altura con un rebote. */}
              <motion.div
                data-bar
                initial={{ height: 0, scale: 0, opacity: 0 }}
                animate={{
                  height: [0, dot, target],
                  scale: [0, 1, 1],
                  opacity: [0, 1, 1],
                }}
                transition={{
                  delay,
                  duration: 1.05,
                  times: [0, 0.32, 1],
                  ease: [[0.34, 1.56, 0.64, 1], [0.34, 1.45, 0.64, 1]],
                }}
                whileHover={{ scaleX: 1.08 }}
                style={{ originY: 1 }}
                className={`w-full max-w-12 rounded-full transition-opacity duration-300 ${dim ? 'opacity-45' : ''} ${
                  empty ? 'hatch border border-gray-600 bg-gray-900' : `on-accent ${FILLS[i % FILLS.length]}`
                } ${i === week.today ? 'ring-2 ring-indigo-300 ring-offset-2 ring-offset-gray-900' : ''}`}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between gap-2 sm:gap-3">
        {DAYS.map((d, i) => (
          <motion.span
            key={d}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.09, duration: 0.4 }}
            className={`flex-1 text-center text-xs transition-colors ${i === week.today || hover === i ? 'font-semibold text-white' : 'text-gray-400'}`}
          >
            {d}
          </motion.span>
        ))}
      </div>
    </>
  );
}

// ---------------------------------------------------------------- recordatorio

function Reminder() {
  const work = useWorkItems();
  const leads = useLeads();
  const today = new Date().toISOString().slice(0, 10);

  const next = useMemo(() => {
    const meetings = work
      .filter((w) => w.meeting && w.meeting.date >= today)
      .map((w) => ({ title: `Cita con ${w.title}`, date: w.meeting!.date, time: w.meeting!.time, place: w.meeting!.place, to: w.to }));
    const followUps = leads
      .filter((l) => l.nextActionDate && l.nextActionDate >= today && l.stage !== 'cerrado' && l.stage !== 'perdido')
      .map((l) => ({ title: l.nextAction || `Seguimiento a ${l.businessName}`, date: l.nextActionDate!, time: null, place: l.businessName, to: `/crm?lead=${l.id}` }));
    return [...meetings, ...followUps].sort((a, b) => a.date.localeCompare(b.date))[0];
  }, [work, leads, today]);

  const dateFmt = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'short' });

  return (
    <div className="flex h-full flex-col">
      <CardTitle title="Recordatorios" />
      {next ? (
        <>
          <p className="text-xl font-bold leading-snug text-indigo-700">{next.title}</p>
          <p className="mt-2 text-xs text-gray-400">
            {dateFmt.format(new Date(`${next.date}T00:00:00`))}
            {next.time ? ` · ${next.time}` : ''}
            {next.place ? ` · ${next.place}` : ''}
          </p>
          <Link
            to={next.to}
            className="on-accent mt-auto inline-flex h-10 items-center justify-center gap-2 rounded-full bg-indigo-700 text-sm font-semibold text-white transition hover:bg-indigo-600"
          >
            <CalendarClock className="h-4 w-4" /> Abrir
          </Link>
        </>
      ) : (
        <div className="flex flex-1 flex-col justify-center text-sm text-gray-400">
          <p className="text-lg font-bold text-white">Sin citas próximas</p>
          <p className="mt-1">Las citas del Kanban y los seguimientos del CRM aparecerán aquí.</p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- proyectos recientes

function RecentProjects() {
  const work = useWorkItems();
  const recent = [...work].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5);
  return (
    <>
      <CardTitle
        title="Trabajos"
        action={
          <Link to="/proyectos?nuevo=1" className="inline-flex h-8 items-center gap-1 rounded-full border border-gray-600 px-3 text-xs font-semibold text-white hover:border-gray-500">
            <Plus className="h-3.5 w-3.5" /> Nuevo
          </Link>
        }
      />
      {recent.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-400">Todavía no hay trabajos.</p>
      ) : (
        <ul className="space-y-3">
          {recent.map((w, i) => {
            const Icon = w.icon ?? Folder;
            return (
              <motion.li key={w.key} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.05 }}>
                <Link to={w.to} className="flex items-center gap-3 rounded-xl p-1 transition hover:bg-gray-950">
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${w.tint}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-white">{w.title}</span>
                    <span className="block truncate text-xs text-gray-400">Actualizado {formatRelative(w.updatedAt)}</span>
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      )}
    </>
  );
}

// ---------------------------------------------------------------- equipo

const PRESENCE_PILL = {
  checked_in: { label: 'Trabajando', className: 'border-amber-500/40 text-amber-300' },
  online: { label: 'En línea', className: 'border-emerald-500/40 text-emerald-300' },
  offline: { label: 'Sin conexión', className: 'border-gray-600 text-gray-400' },
} as const;

function TeamCollaboration() {
  const team = useTeam();
  const presence = usePresence();
  const evaluations = useSessionEvaluations();
  const projects = useProjects();
  const names = useMemo(() => new Map(projects.map((p) => [p.id, p.businessName])), [projects]);

  return (
    <>
      <CardTitle title="Equipo" action={<Link to="/horas" className="text-xs font-semibold text-indigo-600 hover:underline">Ver horas</Link>} />
      <ul className="space-y-3">
        {team.map((m) => {
          const last = evaluations.find((e) => e.session.partnerId === m.id);
          const pill = PRESENCE_PILL[presence[m.id]];
          return (
            <li key={m.id} className="flex items-center gap-3">
              <Avatar partner={m} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{m.name}</p>
                <p className="truncate text-xs text-gray-400">
                  {last ? (
                    <>
                      Trabajó en <span className="font-semibold text-gray-300">{names.get(last.session.projectId) ?? 'un proyecto'}</span>
                    </>
                  ) : (
                    m.availability
                  )}
                </p>
              </div>
              <span className={`shrink-0 rounded-md border px-2 py-0.5 text-[11px] font-medium ${pill.className}`}>{pill.label}</span>
            </li>
          );
        })}
      </ul>
    </>
  );
}

// ---------------------------------------------------------------- progreso

function ProgressGauge({ done, running, planned }: { done: number; running: number; planned: number }) {
  const total = done + running + planned;
  const pct = total ? Math.round((done / total) * 100) : 0;
  // Semicírculo: 0 → 180°. Tramos: hechos (acento), en progreso (acento oscuro), resto rayado.
  const r = 70;
  const arc = `M ${90 - r} 90 A ${r} ${r} 0 0 1 ${90 + r} 90`;
  const doneFrac = total ? done / total : 0;
  const runFrac = total ? (done + running) / total : 0;

  return (
    <div className="flex h-full flex-col">
      <CardTitle title="Progreso" />
      <div className="relative mx-auto mt-1 w-full max-w-56">
        <svg viewBox="0 0 180 100" className="w-full" aria-hidden>
          <defs>
            <pattern id="gauge-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="6" height="6" fill="var(--color-gray-900)" />
              <line x1="0" y1="0" x2="0" y2="6" stroke="var(--color-gray-600)" strokeWidth="2" />
            </pattern>
          </defs>
          <path d={arc} fill="none" stroke="url(#gauge-hatch)" strokeWidth="22" strokeLinecap="round" />
          {runFrac > 0 && <motion.path
            d={arc}
            fill="none"
            stroke="var(--accent-900)"
            strokeWidth="22"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: runFrac }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          />}
          {doneFrac > 0 && <motion.path
            d={arc}
            fill="none"
            stroke="var(--accent-500)"
            strokeWidth="22"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: doneFrac }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          />}
        </svg>
        <div className="absolute inset-x-0 bottom-0 text-center">
          <CountUp value={pct} format={(n) => `${Math.round(n)}%`} className="block text-3xl font-bold tracking-tight text-white" />
          <p className="text-[11px] text-gray-400">Trabajos terminados</p>
        </div>
      </div>
      <ul className="mt-4 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] text-gray-400">
        <li className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--accent-500)' }} /> Hechos</li>
        <li className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--accent-900)' }} /> En progreso</li>
        <li className="flex items-center gap-1.5"><span className="hatch h-2.5 w-2.5 rounded-full border border-gray-600" /> Por cerrar</li>
      </ul>
    </div>
  );
}
