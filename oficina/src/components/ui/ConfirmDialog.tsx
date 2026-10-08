import { LoaderCircle, Trash2, X } from 'lucide-react';
import { useEffect, useId, useState, type ReactNode } from 'react';

interface ConfirmDialogProps {
  title: string;
  children: ReactNode;
  confirmLabel: string;
  onCancel: () => void;
  /** Devuelve false (o lanza) si no se pudo: el diálogo sigue abierto y el aviso ya se muestra aparte. */
  onConfirm: () => Promise<boolean | void> | boolean | void;
}

/** Confirmación para acciones que no se pueden deshacer (eliminar). */
export function ConfirmDialog({ title, children, confirmLabel, onCancel, onConfirm }: ConfirmDialogProps) {
  const [busy, setBusy] = useState(false);
  const titleId = useId();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !busy && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [busy, onCancel]);

  const confirm = async () => {
    setBusy(true);
    try {
      const result = await onConfirm();
      if (result === false) setBusy(false);
    } catch {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div aria-hidden onClick={() => !busy && onCancel()} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full rounded-t-xl border border-gray-800 bg-gray-900 shadow-2xl sm:max-w-md sm:rounded-xl"
      >
        <header className="flex items-center justify-between gap-3 border-b border-gray-800 px-5 py-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-rose-500/10 text-rose-400">
              <Trash2 className="h-4 w-4" />
            </span>
            <h2 id={titleId} className="truncate font-semibold text-white">{title}</h2>
          </div>
          <button type="button" onClick={onCancel} disabled={busy} aria-label="Cerrar" className="rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="space-y-2 px-5 py-4 text-sm text-gray-300">{children}</div>
        <footer className="flex justify-end gap-2 border-t border-gray-800 px-5 py-4">
          <button type="button" onClick={onCancel} disabled={busy} className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-800">
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => void confirm()}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-500 disabled:opacity-60"
          >
            {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            {confirmLabel}
          </button>
        </footer>
      </div>
    </div>
  );
}

/** Botón pequeño de papelera para listas. */
export function DeleteIconButton({ label, onClick, className = '' }: { label: string; onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      aria-label={label}
      title={label}
      className={`rounded-md p-1.5 text-gray-500 transition-colors hover:bg-rose-500/10 hover:text-rose-400 ${className}`}
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
