import type { ReactNode } from 'react';

export function Card({ title, action, children, className = '' }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-gray-800 bg-gray-900 p-4 sm:p-5 ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <dt className="text-sm text-gray-400">{label}</dt>
      <dd className="min-w-0 break-words text-sm text-gray-100 sm:text-right">{children}</dd>
    </div>
  );
}

const timeFmt = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' });
export const formatLogTime = (iso: string) => timeFmt.format(new Date(iso));
