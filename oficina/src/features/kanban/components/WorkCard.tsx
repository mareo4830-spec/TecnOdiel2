import { ArrowRight, Boxes, CalendarDays, Clock, ExternalLink, Hourglass, MapPin, MoreHorizontal } from 'lucide-react';
import { useState, type DragEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AvatarStack } from '../../../components/ui/AvatarStack';
import { daysUntil, formatDueDate, formatEuros } from '../../../lib/format';
import type { PlannedMeeting, WorkStage } from '../../../types';
import { STATUS_META, STATUS_ORDER } from '../../projects/projectMeta';
import type { WorkItem } from '../workService';

interface WorkCardProps {
  item: WorkItem;
  compact?: boolean;
  dragging?: boolean;
  settled?: boolean;
  onDragStart: (e: DragEvent<HTMLElement>) => void;
  onDragEnd: () => void;
  onMoveTo: (stage: WorkStage) => void;
  onToggleWaiting: (waiting: boolean) => void;
  onMeeting: (meeting: PlannedMeeting | null) => void;
}

function meetingClass(date: string): string {
  const d = daysUntil(date);
  if (d < 0) return 'bg-rose-500/15 text-rose-300';
  if (d <= 1) return 'bg-amber-500/15 text-amber-300';
  return 'bg-gray-800 text-gray-300';
}

export function WorkCard({ item, compact, dragging, settled, onDragStart, onDragEnd, onMoveTo, onToggleWaiting, onMeeting }: WorkCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(false);
  const Icon = item.icon;
  const done = item.stage === 'hecho';

  return (
    <article
      data-work-key={item.key}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`group cursor-grab rounded-xl border bg-gray-800/60 p-3 transition hover:border-indigo-500/50 active:cursor-grabbing ${
        item.waitingClient ? 'border-amber-500/40' : 'border-gray-800'
      } ${dragging ? 'opacity-40 ring-2 ring-indigo-500/60' : ''} ${settled ? 'anim-settle' : ''}`}
    >
      <div className="flex items-start gap-2.5">
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${item.tint}`}>
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <Link
            to={item.to}
            draggable={false}
            className={`block truncate text-sm font-semibold leading-snug hover:text-indigo-300 ${done ? 'text-gray-300' : 'text-white'}`}
          >
            {item.title}
          </Link>
          <p className="flex items-center gap-1 truncate text-xs text-gray-400">
            {item.kind === 'tenant' && <Boxes className="h-3 w-3 shrink-0 text-indigo-300" aria-label="Tenant de SaaS" />}
            <span className="truncate">{item.subtitle}</span>
          </p>
        </div>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={`Opciones de «${item.title}»`}
          aria-expanded={menuOpen}
          className="-mr-1 -mt-1 rounded-md p-1 text-gray-500 hover:bg-gray-700 hover:text-white"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {!compact && <span className="rounded bg-gray-800 px-1.5 py-0.5 text-[10px] font-semibold text-gray-300">{item.typeLabel}</span>}
        {item.kind === 'tenant' && <span className="rounded bg-indigo-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-300">SaaS</span>}
        {item.waitingClient && (
          <span className="inline-flex items-center gap-1 rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">
            <Hourglass className="h-3 w-3" />
            Esperando cliente
          </span>
        )}
      </div>

      {item.stage === 'planeado' &&
        (item.meeting ? (
          <button
            onClick={() => setEditingMeeting(true)}
            className="mt-2 flex w-full flex-col items-start gap-0.5 rounded-lg bg-gray-900/60 px-2 py-1.5 text-left hover:bg-gray-900"
          >
            <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium ${meetingClass(item.meeting.date)}`}>
              <CalendarDays className="h-3 w-3" />
              {formatDueDate(item.meeting.date)}
              {item.meeting.time && (
                <>
                  <Clock className="ml-1 h-3 w-3" />
                  {item.meeting.time}
                </>
              )}
            </span>
            {item.meeting.place && (
              <span className="flex w-full items-center gap-1 truncate text-[11px] text-gray-400">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{item.meeting.place}</span>
              </span>
            )}
          </button>
        ) : (
          !editingMeeting && (
            <button
              onClick={() => setEditingMeeting(true)}
              className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-indigo-300 hover:text-indigo-200"
            >
              <CalendarDays className="h-3 w-3" />
              Planificar cita de cierre
            </button>
          )
        ))}

      {editingMeeting && (
        <MeetingForm
          initial={item.meeting}
          onCancel={() => setEditingMeeting(false)}
          onSave={(m) => {
            onMeeting(m);
            setEditingMeeting(false);
          }}
        />
      )}

      <div className="mt-3 flex items-center justify-between gap-2">
        <AvatarStack ids={item.people} />
        <div className="flex items-center gap-2">
          {item.price !== null && !compact && <span className="text-[11px] tabular-nums text-gray-400">{formatEuros(item.price)}</span>}
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              draggable={false}
              title={item.url.replace('https://', '')}
              aria-label={`Abrir ${item.url}`}
              className="rounded-md p-1 text-gray-500 hover:bg-gray-700 hover:text-white"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="mt-3 space-y-2 border-t border-gray-700/60 pt-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-gray-500">Mover a</span>
            {STATUS_ORDER.filter((s) => s !== item.stage).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setMenuOpen(false);
                  onMoveTo(s);
                }}
                className="inline-flex items-center gap-1 rounded-md bg-gray-700/60 px-2 py-1 text-[11px] font-medium text-gray-200 hover:bg-indigo-600 hover:text-white"
              >
                <ArrowRight className="h-3 w-3" />
                {STATUS_META[s].label}
              </button>
            ))}
          </div>
          {item.stage === 'en_progreso' && (
            <button
              onClick={() => {
                setMenuOpen(false);
                onToggleWaiting(!item.waitingClient);
              }}
              className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-1 text-[11px] font-medium text-amber-300 hover:bg-amber-500/20"
            >
              <Hourglass className="h-3 w-3" />
              {item.waitingClient ? 'Ya tenemos sus datos' : 'Esperando datos del cliente'}
            </button>
          )}
          {item.stage === 'planeado' && item.meeting && (
            <button
              onClick={() => {
                setMenuOpen(false);
                onMeeting(null);
              }}
              className="ml-1.5 text-[11px] text-gray-400 hover:text-rose-300"
            >
              Quitar cita
            </button>
          )}
        </div>
      )}
    </article>
  );
}

function MeetingForm({ initial, onSave, onCancel }: { initial: PlannedMeeting | null; onSave: (m: PlannedMeeting) => void; onCancel: () => void }) {
  const [date, setDate] = useState(initial?.date ?? '');
  const [time, setTime] = useState(initial?.time ?? '');
  const [place, setPlace] = useState(initial?.place ?? '');
  const field =
    'w-full rounded-lg border border-gray-700 bg-gray-900 px-2 py-1.5 text-xs text-white placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none';

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (date) onSave({ date, time: time || null, place: place.trim() });
  };

  return (
    <form
      onSubmit={submit}
      className="mt-2 space-y-1.5 rounded-lg border border-indigo-500/40 bg-gray-900/60 p-2"
      onKeyDown={(e) => e.key === 'Escape' && onCancel()}
    >
      <div className="grid grid-cols-2 gap-1.5">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Fecha de la cita" className={field} autoFocus />
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} aria-label="Hora" className={field} />
      </div>
      <input value={place} onChange={(e) => setPlace(e.target.value)} placeholder="Dónde (local, dirección…)" aria-label="Lugar" className={field} />
      <div className="flex justify-end gap-1.5">
        <button type="button" onClick={onCancel} className="rounded-md px-2 py-1 text-[11px] text-gray-400 hover:text-white">
          Cancelar
        </button>
        <button
          type="submit"
          disabled={!date}
          className="rounded-md bg-indigo-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          Guardar cita
        </button>
      </div>
    </form>
  );
}
