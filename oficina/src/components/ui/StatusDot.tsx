import type { PresenceStatus } from '../../types';

export const PRESENCE_META: Record<PresenceStatus, { label: string; dot: string; text: string }> = {
  online: { label: 'En línea', dot: 'bg-emerald-400', text: 'text-emerald-400' },
  checked_in: { label: 'Check-in activo', dot: 'bg-violet-400', text: 'text-violet-300' },
  offline: { label: 'Desconectado', dot: 'bg-gray-500', text: 'text-gray-500' },
};

export function StatusDot({ status, className = '' }: { status: PresenceStatus; className?: string }) {
  const meta = PRESENCE_META[status];
  return (
    <span className={`relative flex h-3 w-3 ${className}`} title={meta.label}>
      {status === 'checked_in' && (
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${meta.dot} opacity-60`} />
      )}
      <span className={`relative inline-flex h-3 w-3 rounded-full border-2 border-gray-900 ${meta.dot}`} />
    </span>
  );
}

export function StatusLabel({ status }: { status: PresenceStatus }) {
  const meta = PRESENCE_META[status];
  return (
    <span className={`flex items-center gap-1.5 text-xs font-medium ${meta.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}
