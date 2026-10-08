import { Check, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { Badge } from '../../../components/ui/Badge';
import type { TenantRequirement, TenantStatus } from '../../../types';
import { REQUIREMENTS, REQUIREMENT_LABEL, TENANT_STATUS_META } from '../tenantMeta';

export function TenantStatusBadge({ status }: { status: TenantStatus }) {
  const meta = TENANT_STATUS_META[status];
  return (
    <Badge className={meta.badge}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot} ${status === 'provisioning' ? 'animate-pulse' : ''}`} />
      {meta.label}
    </Badge>
  );
}

/** Checklist de la regla de go-live: ✓ lo que está, ✗ lo que falta. */
export function RequirementsChecklist({ missing, compact = false }: { missing: TenantRequirement[]; compact?: boolean }) {
  return (
    <ul className={compact ? 'grid grid-cols-1 gap-1.5 sm:grid-cols-2' : 'space-y-2'}>
      {REQUIREMENTS.map((r) => {
        const ok = !missing.includes(r);
        return (
          <li key={r} className="flex items-center gap-2 text-sm">
            <span
              className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${ok ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}`}
              aria-hidden
            >
              {ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
            </span>
            <span className={ok ? 'text-gray-300' : 'text-gray-100'}>
              {REQUIREMENT_LABEL[r]}
              <span className="sr-only">{ok ? ': completo' : ': falta'}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export const inputClass =
  'h-10 w-full rounded-xl border border-gray-700 bg-gray-800 px-3 text-sm text-white placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-60';

export function Field({
  label,
  hint,
  error,
  children,
  className = '',
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-gray-300">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-rose-400">{error}</span> : hint && <span className="mt-1 block text-xs text-gray-500">{hint}</span>}
    </label>
  );
}
