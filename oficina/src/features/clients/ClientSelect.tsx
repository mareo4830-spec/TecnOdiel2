import { useClients } from './clientService';

const STATUS_LABEL = { solicitud: 'solicitud', activo: 'activo', pausado: 'pausado', baja: 'baja' } as const;

/**
 * Vincula un proyecto o tenant a un cliente del portal. El cliente lo ve entrando con su cuenta de
 * Google (la del formulario, o la que tenga el mismo email que el cliente).
 */
export function ClientSelect({ value, onChange }: { value: string | null; onChange: (clientId: string | null) => void }) {
  const clients = useClients();
  const claimed = clients.find((c) => c.id === value)?.ownerUserId;
  return (
    <div className="flex flex-col items-end gap-1">
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || null)}
        aria-label="Cliente del portal"
        className="max-w-[16rem] rounded-lg border border-gray-700 bg-gray-900 px-2 py-1 text-sm text-gray-200 outline-none focus:border-indigo-500"
      >
        <option value="">Sin cliente</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>
            {c.businessName} · {STATUS_LABEL[c.status]}
          </option>
        ))}
      </select>
      {value && (
        <span className={`text-xs ${claimed ? 'text-emerald-400' : 'text-amber-400'}`}>
          {claimed ? 'Ya tiene su cuenta vinculada' : 'Aún sin cuenta: entrará con el email del cliente'}
        </span>
      )}
    </div>
  );
}
