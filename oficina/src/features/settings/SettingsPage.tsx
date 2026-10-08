import { Building2, Database, UserRound } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { WidgetCard } from '../../components/ui/WidgetCard';
import { APP_CONFIG } from '../../lib/config';
import { useAuth } from '../auth/authContext';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
      <dt className="text-sm text-gray-400">{label}</dt>
      <dd className="text-sm text-gray-100">{value}</dd>
    </div>
  );
}

export function SettingsPage() {
  const { partner, mode } = useAuth();
  if (!partner) return null;

  return (
    <div className="mx-auto grid max-w-4xl gap-4 sm:gap-6 md:grid-cols-2">
      <WidgetCard title="Agencia" icon={Building2}>
        <dl className="space-y-3">
          <Row label="Nombre" value={APP_CONFIG.name} />
          <Row label="Ubicación" value={APP_CONFIG.location} />
        </dl>
        <p className="mt-4 text-xs text-gray-500">
          Nombre y logo se configuran en <code className="text-gray-400">src/lib/config.ts</code>.
        </p>
      </WidgetCard>

      <WidgetCard title="Conexión" icon={Database}>
        <dl className="space-y-3">
          <Row label="Modo" value={mode === 'supabase' ? 'Supabase' : 'Demo (datos mock)'} />
          <Row label="Autenticación" value={mode === 'supabase' ? 'Google' : 'Acceso directo (demo)'} />
        </dl>
      </WidgetCard>

      <WidgetCard title="Tu perfil" icon={UserRound} className="md:col-span-2">
        <div className="flex items-center gap-4">
          <Avatar partner={partner} size="lg" />
          <dl className="flex-1 space-y-2">
            <Row label="Nombre" value={partner.name} />
            <Row label="Email" value={partner.email} />
            <Row label="Disponibilidad" value={partner.availability} />
          </dl>
        </div>
      </WidgetCard>
    </div>
  );
}
