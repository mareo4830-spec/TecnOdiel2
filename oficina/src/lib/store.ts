import { useSyncExternalStore } from 'react';

/**
 * Store mínimo en memoria. Cuando se conecte Supabase, los servicios rellenarán estos stores
 * con la consulta inicial y los cambios de Realtime, así que los hooks y componentes no cambian.
 *
 * Mientras tanto, los stores con `persistKey` se guardan en localStorage para que los datos
 * que se introducen a mano sobrevivan a una recarga (solo en este navegador).
 */
export interface Store<T> {
  get: () => T;
  set: (updater: (prev: T) => T) => void;
  subscribe: (listener: () => void) => () => void;
}

const STORAGE_PREFIX = 'ov.data.';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {
    /* sin almacenamiento disponible: el estado vive solo en memoria */
  }
}

export function createStore<T>(initial: T, persistKey?: string): Store<T> {
  let state = persistKey ? load(persistKey, initial) : initial;
  const listeners = new Set<() => void>();
  return {
    get: () => state,
    set(updater) {
      state = updater(state);
      if (persistKey) save(persistKey, state);
      listeners.forEach((l) => l());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export function useStore<T, S = T>(store: Store<T>, selector?: (state: T) => S): S {
  return useSyncExternalStore(store.subscribe, () =>
    selector ? selector(store.get()) : (store.get() as unknown as S),
  );
}
