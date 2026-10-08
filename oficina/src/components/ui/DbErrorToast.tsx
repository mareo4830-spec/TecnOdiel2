import { AlertTriangle, X } from 'lucide-react';
import { dismissDbError, useDbErrors } from '../../lib/db';

/** Avisos cuando algo no se pudo guardar o cargar en Supabase. */
export function DbErrorToast() {
  const errors = useDbErrors();
  if (!errors.length) return null;
  return (
    <div className="fixed inset-x-4 bottom-4 z-[60] flex flex-col items-end gap-2 sm:left-auto sm:w-96" aria-live="assertive">
      {errors.map((e) => (
        <div
          key={e.id}
          role="alert"
          className="flex w-full items-start gap-3 rounded-lg border border-rose-500/40 bg-gray-900 p-3 text-sm text-rose-100 shadow-xl"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
          <p className="min-w-0 flex-1 break-words">
            {e.message}
            <span className="mt-0.5 block text-xs text-gray-400">Se han recargado los datos guardados.</span>
          </p>
          <button onClick={() => dismissDbError(e.id)} aria-label="Cerrar aviso" className="rounded p-1 text-gray-400 hover:bg-gray-800 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
