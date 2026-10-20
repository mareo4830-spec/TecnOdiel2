import { useSyncExternalStore } from 'react';

export interface ToastItem {
  id: number;
  message: string;
  kind: 'ok' | 'error';
}

let toasts: ToastItem[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function push(message: string, kind: ToastItem['kind'], ms: number) {
  const id = nextId++;
  toasts = [...toasts, { id, message, kind }];
  emit();
  window.setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, ms);
}

/** Muestra una píldora de confirmación abajo al centro (como "added to projects" del vídeo). */
export function toast(message: string, ms = 2800) {
  push(message, 'ok', ms);
}

/** Aviso de error (p. ej. la BD rechazó un cambio). Dura más para que dé tiempo a leerlo. */
export function toastError(message: string, ms = 6000) {
  push(message, 'error', ms);
}

export function useToasts(): ToastItem[] {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => toasts,
    () => toasts,
  );
}
