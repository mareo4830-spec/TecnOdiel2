import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface WidgetCardProps {
  title: string;
  icon: LucideIcon;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function WidgetCard({ title, icon: Icon, action, className = '', children }: WidgetCardProps) {
  return (
    <section className={`lift flex flex-col rounded-2xl border border-gray-800 bg-gray-900 p-4 sm:p-5 ${className}`}>
      <header className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-indigo-500/10 text-indigo-400">
            <Icon className="h-4 w-4" />
          </span>
          <h2 className="truncate font-semibold text-white">{title}</h2>
        </div>
        {action}
      </header>
      <div className="flex-1">{children}</div>
    </section>
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
