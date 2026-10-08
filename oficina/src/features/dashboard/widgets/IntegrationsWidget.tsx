import { Database, Github, MessageCircle, Triangle, type LucideIcon } from 'lucide-react';
import type { Integration, IntegrationStatus } from '../../../types';
import { useIntegrations } from '../../integrations/integrationService';

const ICONS: Record<Integration['id'], { icon: LucideIcon; tint: string }> = {
  supabase: { icon: Database, tint: 'bg-emerald-500/15 text-emerald-300' },
  github: { icon: Github, tint: 'bg-gray-700/50 text-gray-200' },
  vercel: { icon: Triangle, tint: 'bg-white/10 text-white' },
  whatsapp: { icon: MessageCircle, tint: 'bg-green-500/15 text-green-300' },
};

const STATUS: Record<IntegrationStatus, { label: string; className: string }> = {
  connected: { label: 'Conectado', className: 'bg-emerald-500/10 text-emerald-400' },
  demo: { label: 'Demo', className: 'bg-amber-500/10 text-amber-300' },
  pending: { label: 'Pendiente', className: 'bg-gray-700/40 text-gray-400' },
};

export function IntegrationsWidget() {
  const integrations = useIntegrations();

  return (
    <>
      <ul className="space-y-2">
        {integrations.map((i) => {
          const { icon: Icon, tint } = ICONS[i.id];
          const status = STATUS[i.status];
          return (
            <li key={i.id} className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-800/30 px-3 py-2.5">
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${tint}`}>
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white">{i.name}</p>
                <p className="truncate text-xs text-gray-500">
                  {i.details.map((d) => `${d.label}: ${d.value}`).join(' · ')}
                </p>
              </div>
              <span className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold ${status.className}`}>
                {status.label}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs text-gray-500">Los tokens de GitHub, Vercel y WhatsApp viven solo en Edge Functions.</p>
    </>
  );
}
