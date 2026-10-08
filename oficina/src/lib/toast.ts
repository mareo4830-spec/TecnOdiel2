import { useSyncExternalStore } from 'react';

export interface ToastItem {
  id: number;
  message: string;
}

let toasts: ToastItem[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

/** Muestra una píldora de confirmación abajo al centro (como "added to projects" del vídeo). */
export function toast(message: string, ms = 2800) {
  const id = nextId++;
  toasts = [...toasts, { id, message }];
  emit();
  window.setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, ms);
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
