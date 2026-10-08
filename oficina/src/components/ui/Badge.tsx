import type { ReactNode } from 'react';

export function Badge({ className = 'bg-gray-800 text-gray-300 ring-gray-700', children }: { className?: string; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${className}`}>
      {children}
    </span>
  );
}
