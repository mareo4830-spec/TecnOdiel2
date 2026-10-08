import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import type { MouseEvent, ReactNode } from 'react';

interface WidgetCardProps {
  title: string;
  icon: LucideIcon;
  action?: ReactNode;
  className?: string;
  /** Posición en la rejilla: retrasa su entrada para que aparezcan escalonadas. */
  index?: number;
  children: ReactNode;
}

/** Foco de luz que sigue al ratón dentro de la tarjeta (variables CSS, sin re-render). */
function trackSpotlight(e: MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
}

export function WidgetCard({ title, icon: Icon, action, className = '', index = 0, children }: WidgetCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.45, delay: Math.min(index, 10) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={trackSpotlight}
      className={`card group/card relative flex flex-col overflow-hidden p-4 transition-shadow hover:shadow-md sm:p-5 ${className}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
        style={{ background: 'radial-gradient(400px circle at var(--mx) var(--my), color-mix(in oklab, var(--accent-500) 7%, transparent), transparent 45%)' }}
      />
      <header className="relative mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
            <Icon className="h-4 w-4" />
          </span>
          <h2 className="truncate text-base font-semibold text-white">{title}</h2>
        </div>
        {action}
      </header>
      <div className="relative flex-1">{children}</div>
    </motion.section>
  );
}

/** Hueco reservado en el grid para un widget de una fase posterior. */
export function WidgetPlaceholder({ phase, description }: { phase: number; description: string }) {
  return (
    <div className="flex h-full min-h-40 flex-col justify-between gap-4 rounded-xl border border-dashed border-gray-700/80 bg-gray-800/30 p-4">
      <div className="space-y-2" aria-hidden>
        <div className="h-2.5 w-2/3 animate-pulse rounded-full bg-gray-800" />
        <div className="h-2.5 w-1/2 animate-pulse rounded-full bg-gray-800" />
        <div className="h-2.5 w-3/4 animate-pulse rounded-full bg-gray-800" />
      </div>
      <div>
        <span className="inline-flex rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-medium text-purple-300">
          Fase {phase}
        </span>
        <p className="mt-2 text-sm text-gray-400">{description}</p>
      </div>
    </div>
  );
}
