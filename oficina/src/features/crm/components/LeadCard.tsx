import { CalendarDays, FolderCheck } from 'lucide-react';
import type { DragEvent } from 'react';
import { Avatar } from '../../../components/ui/Avatar';
import { PARTNER_META } from '../../../lib/partners';
import { daysUntil, formatDueDate, formatEuros } from '../../../lib/format';
import type { Lead } from '../../../types';
import { BUSINESS_TYPE_META } from '../../projects/projectMeta';

export function nextActionClass(lead: Lead): string {
  if (!lead.nextActionDate) return 'bg-gray-800 text-gray-400';
  const diff = daysUntil(lead.nextActionDate);
  if (diff < 0) return 'bg-rose-500/15 text-rose-300';
  if (diff === 0) return 'bg-amber-500/15 text-amber-300';
  return 'bg-gray-800 text-gray-300';
}

interface LeadCardProps {
  lead: Lead;
  dragging: boolean;
  onOpen: () => void;
  onDragStart: (e: DragEvent<HTMLElement>) => void;
  onDragEnd: () => void;
}

export function LeadCard({ lead, dragging, onOpen, onDragStart, onDragEnd }: LeadCardProps) {
  const type = BUSINESS_TYPE_META[lead.businessType];
  const TypeIcon = type.icon;
  return (
    <button
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onOpen}
      className={`block w-full cursor-grab rounded-xl border border-gray-800 bg-gray-800/60 p-3 text-left transition hover:border-indigo-500/50 active:cursor-grabbing ${
        dragging ? 'opacity-40 ring-2 ring-indigo-500/60' : ''
      }`}
    >
      <div className="flex items-start gap-2.5">
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${type.tint}`}>
          <TypeIcon className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-white">{lead.businessName}</span>
          <span className="block truncate text-xs text-gray-400">
            {lead.contactName} · {lead.city}
          </span>
        </span>
      </div>

      {lead.nextAction && <p className="mt-2 line-clamp-2 text-xs text-gray-400">{lead.nextAction}</p>}

      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-sm font-semibold tabular-nums text-white">{formatEuros(lead.estimatedValue)}</span>
        <span className="flex items-center gap-1.5">
          {lead.projectId && (
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[11px] font-medium text-emerald-300">
              <FolderCheck className="h-3 w-3" />
              Proyecto
            </span>
          )}
          {lead.nextActionDate && (
            <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium ${nextActionClass(lead)}`}>
              <CalendarDays className="h-3 w-3" />
              {formatDueDate(lead.nextActionDate)}
            </span>
          )}
          <span title={PARTNER_META[lead.owner].name}>
            <Avatar partner={{ ...PARTNER_META[lead.owner], avatarUrl: null }} size="xs" />
          </span>
        </span>
      </div>
    </button>
  );
}
