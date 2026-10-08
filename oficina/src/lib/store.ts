import { useSyncExternalStore } from 'react';

/**
 * Store mínimo en memoria para los datos mock. Cuando se conecte Supabase, los servicios
 * rellenarán estos stores con la consulta inicial y los cambios de Realtime, así que los
 * hooks y componentes no cambian.
 */
export interface Store<T> {
  get: () => T;
  set: (updater: (prev: T) => T) => void;
  subscribe: (listener: () => void) => () => void;
}

export function createStore<T>(initial: T): Store<T> {
  let state = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => state,
    set(updater) {
      state = updater(state);
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
