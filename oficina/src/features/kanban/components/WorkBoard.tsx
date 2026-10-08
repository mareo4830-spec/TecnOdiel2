import { Boxes, Plus, Store } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, type DragEvent } from 'react';
import { Link } from 'react-router-dom';
import { useClickOutside } from '../../../hooks/useClickOutside';
import type { WorkStage } from '../../../types';
import { useAuth } from '../../auth/authContext';
import { STATUS_META, STATUS_ORDER } from '../../projects/projectMeta';
import { useProjects } from '../../projects/projectService';
import { moveWork, setMeeting, setWaitingClient, sortStage, type WorkItem } from '../workService';
import { WorkCard } from './WorkCard';

interface WorkBoardProps {
  items: WorkItem[];
  /** Versión reducida para el Panel. */
  compact?: boolean;
  maxPerColumn?: number;
}

interface DropTarget {
  stage: WorkStage;
  beforeKey: string | null;
}

/** Kanban de trabajos: Planeado → En progreso → Hecho, con proyectos estándar y tenants mezclados. */
export function WorkBoard({ items, compact, maxPerColumn }: WorkBoardProps) {
  const { partner } = useAuth();
  const [draggingKey, setDraggingKey] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);

  const move = (key: string, stage: WorkStage, beforeKey: string | null) => {
    if (partner) moveWork(key, stage, beforeKey, partner.id);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, stage: WorkStage) => {
    if (!draggingKey) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const cards = [...e.currentTarget.querySelectorAll<HTMLElement>('[data-work-key]')];
    const before = cards.find((el) => {
      if (el.dataset.workKey === draggingKey) return false;
      const r = el.getBoundingClientRect();
      return e.clientY < r.top + r.height / 2;
    });
    const beforeKey = before?.dataset.workKey ?? null;
    if (dropTarget?.stage !== stage || dropTarget.beforeKey !== beforeKey) setDropTarget({ stage, beforeKey });
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, stage: WorkStage) => {
    e.preventDefault();
    const key = draggingKey ?? e.dataTransfer.getData('text/plain');
    if (key) move(key, stage, dropTarget?.stage === stage ? dropTarget.beforeKey : null);
    setDraggingKey(null);
    setDropTarget(null);
  };

  const indicator = <div className="h-0.5 rounded-full bg-indigo-400 shadow-[0_0_8px] shadow-indigo-500" />;

  return (
    <div
      className={
        compact
          ? 'no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 md:grid md:grid-cols-3 md:overflow-visible'
          : 'no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0'
      }
    >
      {STATUS_ORDER.map((stage) => {
        const meta = STATUS_META[stage];
        const all = sortStage(items, stage);
        const visible = maxPerColumn ? all.slice(0, maxPerColumn) : all;
        const hidden = all.length - visible.length;
        const waiting = stage === 'en_progreso' ? all.filter((i) => i.waitingClient).length : 0;
        const isTarget = dropTarget?.stage === stage;
        const targetBefore = isTarget ? dropTarget.beforeKey : undefined;

        return (
          <section
            key={stage}
            aria-label={meta.label}
            className={`flex shrink-0 flex-col rounded-2xl border bg-gray-900/60 transition duration-300 ${
              compact ? 'w-64 p-2.5 md:w-auto' : 'w-[85%] max-w-sm snap-center p-3 sm:w-80 lg:w-auto lg:max-w-none'
            } ${isTarget ? 'scale-[1.01] border-dashed border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10' : 'border-gray-800'}`}
          >
            <header className="mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${meta.accent}`} />
                <h3 className="whitespace-nowrap text-sm font-semibold text-white">{meta.label}</h3>
                <span className="rounded-md bg-gray-800 px-1.5 text-xs font-medium text-gray-400">{all.length}</span>
                {waiting > 0 && !compact && (
                  <span className="rounded-md bg-amber-500/15 px-1.5 text-[11px] font-medium text-amber-300" title="Esperando datos del cliente">
                    {waiting} esperando
                  </span>
                )}
                {stage === 'planeado' && <NewWorkMenu />}
              </div>
              {!compact && <p className="mt-0.5 text-[11px] text-gray-500">{meta.hint}</p>}
              {compact && waiting > 0 && <p className="mt-0.5 text-[11px] font-medium text-amber-300">{waiting} esperando al cliente</p>}
            </header>

            <div
              onDragOver={(e) => handleDragOver(e, stage)}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setDropTarget(null);
              }}
              onDrop={(e) => handleDrop(e, stage)}
              className={`flex flex-1 flex-col gap-2 ${compact ? 'min-h-24' : 'min-h-40'}`}
            >
              {visible.map((item) => (
                // Al soltar, la tarjeta viaja con un muelle hasta su sitio nuevo (también entre columnas).
                <motion.div key={item.key} layout="position" layoutId={`kb-${item.key}`} transition={{ type: 'spring', stiffness: 420, damping: 36 }}>
                  {targetBefore === item.key && <div className="mb-2">{indicator}</div>}
                  <WorkCard
                    item={item}
                    compact={compact}
                    dragging={draggingKey === item.key}
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', item.key);
                      e.dataTransfer.effectAllowed = 'move';
                      setDraggingKey(item.key);
                    }}
                    onDragEnd={() => {
                      setDraggingKey(null);
                      setDropTarget(null);
                    }}
                    onMoveTo={(s) => move(item.key, s, null)}
                    onToggleWaiting={(w) => partner && setWaitingClient(item.key, w, partner.id)}
                    onMeeting={(m) => setMeeting(item.key, m)}
                  />
                </motion.div>
              ))}
              {targetBefore === null && indicator}

              {all.length === 0 && (
                <p className="grid flex-1 place-items-center rounded-xl border border-dashed border-gray-800 p-4 text-center text-xs text-gray-500">
                  {draggingKey ? 'Suelta aquí' : 'Nada por ahora'}
                </p>
              )}
              {hidden > 0 && <p className="px-1 text-xs text-gray-500">+{hidden} más</p>}
            </div>
          </section>
        );
      })}
    </div>
  );
}

/** "+" de Planeado: nuevo proyecto estándar o nuevo tenant en uno de los SaaS. */
function NewWorkMenu() {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false), open);
  const saas = useProjects().filter((p) => p.kind === 'saas');
  const item = 'flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-gray-200 hover:bg-gray-800';

  return (
    <div ref={ref} className="relative ml-auto">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Nuevo trabajo"
        aria-expanded={open}
        className="rounded-md p-1 text-gray-500 hover:bg-gray-800 hover:text-white"
      >
        <Plus className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-1 w-64 rounded-xl border border-gray-800 bg-gray-900 p-1.5 shadow-2xl">
          <Link to="/proyectos?nuevo=1" className={item}>
            <Store className="h-4 w-4 text-gray-400" />
            Proyecto estándar
          </Link>
          {saas.map((p) => (
            <Link key={p.id} to={`/proyectos/${p.id}/tenants/nuevo`} className={item}>
              <Boxes className="h-4 w-4 text-indigo-300" />
              <span className="truncate">Tenant en {p.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
