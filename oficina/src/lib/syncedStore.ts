import { createStore, useStore, type Store } from './store';
import { isSupabaseConfigured, supabase } from './supabase';
import { toastError } from './toast';

/*
 * Store de un array de filas de una tabla de Supabase. Misma interfaz que `createStore`, así que
 * los servicios y componentes no cambian:
 *
 *  - Con Supabase: nada se guarda en el navegador. Al iniciar sesión se lee la tabla y se escucha
 *    Realtime; cada `set` actualiza la pantalla al instante y escribe en la BD solo lo que cambió
 *    (insert / update de las columnas modificadas / delete), en el mismo orden en que se hicieron
 *    las llamadas (las claves foráneas lo necesitan). Si una escritura falla, se avisa y se vuelve
 *    a leer la tabla para no dejar en pantalla algo que la BD rechazó.
 *  - Sin Supabase (demo): igual que `createStore`, persistido en localStorage.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Row = Record<string, any>;

export interface SyncedStoreOptions<T> {
  table: string;
  /** Columnas de la clave primaria en la BD, separadas por coma. Por defecto `id`. */
  conflict?: string;
  toRow: (item: T) => Row;
  fromRow: (row: Row) => T;
  /** Clave de localStorage para el modo demo. */
  persistKey?: string;
  /** Filtro de lectura (PostgREST) para la carga inicial; ver también `accept`. */
  readFilter?: (query: any) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
  /** Qué filas entran en el store (se aplica a la carga y a Realtime). */
  accept?: (row: Row) => boolean;
  sort?: (a: T, b: T) => number;
  /** Orden y tope de la carga inicial (se queda con las más recientes). */
  order?: { column: string; ascending: boolean };
  limit?: number;
  /** Qué escrituras puede hacer el navegador. Lo que no esté permitido solo lo escribe la BD o una Edge Function. */
  write?: { insert?: boolean; update?: boolean; delete?: boolean };
}

export interface SyncedStore<T> extends Store<T[]> {
  start(): Promise<void>;
  stop(): void;
}

// ---------------------------------------------------------------- ciclo de vida global

interface Lifecycle {
  start(): Promise<void>;
  stop(): void;
}
const registry = new Set<Lifecycle>();
let active = false;

export type SyncState = 'idle' | 'loading' | 'ready';
const statusStore = createStore<SyncState>('idle');
export const useSyncStatus = (): SyncState => useStore(statusStore);

/** Empieza a leer y escuchar todas las tablas. Se llama al entrar un socio. */
export async function startSync(): Promise<void> {
  if (!isSupabaseConfigured) return;
  active = true;
  statusStore.set(() => 'loading');
  await Promise.all([...registry].map((s) => s.start()));
  if (active) statusStore.set(() => 'ready');
}

/** Deja de escuchar y vacía los datos (al cerrar sesión no debe quedar nada del equipo en pantalla). */
export function stopSync(): void {
  active = false;
  registry.forEach((s) => s.stop());
  statusStore.set(() => 'idle');
}

// Todas las escrituras de todas las tablas pasan por una única cola para conservar el orden.
let queue: Promise<void> = Promise.resolve();
const enqueue = (job: () => Promise<void>) => {
  queue = queue.then(job).catch((e) => console.error('[sync]', e));
};

// ---------------------------------------------------------------- store

export function createSyncedStore<T>(initial: T[], options: SyncedStoreOptions<T>): SyncedStore<T> {
  const { table, toRow, fromRow, accept, sort, order, limit } = options;
  const cols = (options.conflict ?? 'id').split(',').map((c) => c.trim());
  const canInsert = options.write?.insert ?? true;
  const canUpdate = options.write?.update ?? true;
  const canDelete = options.write?.delete ?? true;

  const rowKey = (row: Row) => cols.map((c) => String(row[c])).join('|');
  const keyOf = (item: T) => rowKey(toRow(item));
  const keyMatch = (row: Row) => Object.fromEntries(cols.map((c) => [c, row[c]]));

  // Sin Supabase: un store local normal.
  if (!isSupabaseConfigured || !supabase) {
    const local = createStore<T[]>(initial, options.persistKey);
    return { ...local, start: async () => undefined, stop: () => undefined };
  }
  const db = supabase;

  let state = initial;
  let started = false;
  let channel: ReturnType<typeof db.channel> | null = null;
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((l) => l());

  // Claves con escrituras sin confirmar: mientras duran se ignoran los eventos Realtime de esa
  // fila (serían el eco de un estado anterior) y, al terminar, se vuelve a leer si hubo alguno.
  const pending = new Map<string, number>();
  const skipped = new Set<string>();

  const sorted = (list: T[]) => (sort ? [...list].sort(sort) : list);
  const replace = (next: T[]) => {
    state = sorted(next);
    emit();
  };

  async function load(): Promise<void> {
    let q = db.from(table).select('*');
    if (options.readFilter) q = options.readFilter(q);
    if (order) q = q.order(order.column, { ascending: order.ascending });
    if (limit) q = q.limit(limit);
    const { data, error } = await q;
    if (error) {
      console.error(`[sync] ${table}:`, error.message);
      toastError(`No se pudo leer «${table}»: ${error.message}`);
      return;
    }
    replace((data as Row[]).filter((r) => !accept || accept(r)).map(fromRow));
  }

  async function loadOne(key: string, match: Row): Promise<void> {
    const { data } = await db.from(table).select('*').match(match).maybeSingle();
    const without = state.filter((i) => keyOf(i) !== key);
    replace(data && (!accept || accept(data)) ? [...without, fromRow(data)] : without);
  }

  function applyRemote(type: string, row: Row): void {
    const key = rowKey(row);
    if ((pending.get(key) ?? 0) > 0) {
      skipped.add(key);
      return;
    }
    if (type === 'DELETE') {
      if (state.some((i) => keyOf(i) === key)) replace(state.filter((i) => keyOf(i) !== key));
      return;
    }
    if (accept && !accept(row)) {
      if (state.some((i) => keyOf(i) === key)) replace(state.filter((i) => keyOf(i) !== key));
      return;
    }
    const item = fromRow(row);
    const at = state.findIndex((i) => keyOf(i) === key);
    if (at === -1) {
      replace([...state, item]);
    } else if (JSON.stringify(state[at]) !== JSON.stringify(item)) {
      replace(state.map((x, i) => (i === at ? item : x)));
    }
  }

  function pushDiff(prev: T[], next: T[]): void {
    const before = new Map(prev.map((i) => [keyOf(i), i]));
    const after = new Map(next.map((i) => [keyOf(i), i]));
    const ops: { key: string; run: () => PromiseLike<{ error: { message: string } | null }> }[] = [];

    for (const [key, item] of after) {
      const old = before.get(key);
      if (old === item) continue;
      const row = toRow(item);
      if (!old) {
        if (canInsert) ops.push({ key, run: () => db.from(table).upsert(row, { onConflict: cols.join(',') }) });
        continue;
      }
      if (!canUpdate) continue;
      const was = toRow(old);
      const patch = Object.fromEntries(
        Object.entries(row).filter(([c, v]) => !cols.includes(c) && JSON.stringify(v) !== JSON.stringify(was[c])),
      );
      if (Object.keys(patch).length) ops.push({ key, run: () => db.from(table).update(patch).match(keyMatch(row)) });
    }
    if (canDelete) {
      for (const [key, item] of before) {
        if (!after.has(key)) ops.push({ key, run: () => db.from(table).delete().match(keyMatch(toRow(item))) });
      }
    }
    if (!ops.length) return;

    for (const { key } of ops) pending.set(key, (pending.get(key) ?? 0) + 1);
    enqueue(async () => {
      let failed: string | null = null;
      for (const op of ops) {
        const { error } = await op.run();
        if (error) {
          failed = error.message;
          console.error(`[sync] ${table}:`, error.message);
          break;
        }
      }
      for (const { key } of ops) {
        const left = (pending.get(key) ?? 1) - 1;
        if (left > 0) pending.set(key, left);
        else pending.delete(key);
      }
      if (failed) {
        toastError(`No se pudo guardar en «${table}»: ${failed}`);
        await load();
        skipped.clear();
        return;
      }
      // Eventos que llegaron mientras escribíamos: se confirma el estado real de esas filas.
      for (const key of new Set(ops.map((o) => o.key))) {
        if (!skipped.has(key) || pending.has(key)) continue;
        skipped.delete(key);
        const item = after.get(key);
        if (item) await loadOne(key, keyMatch(toRow(item)));
        else replace(state.filter((i) => keyOf(i) !== key));
      }
    });
  }

  const api: SyncedStore<T> = {
    get: () => state,
    set(updater) {
      const prev = state;
      const next = updater(prev);
      if (next === prev) return;
      state = next;
      emit();
      if (started) pushDiff(prev, next);
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    async start() {
      if (started) return;
      started = true;
      await new Promise<void>((resolve) => {
        channel = db
          .channel(`sync:${table}:${Math.random().toString(36).slice(2, 8)}`)
          .on('postgres_changes', { event: '*', schema: 'public', table }, (payload) => {
            const row = (payload.eventType === 'DELETE' ? payload.old : payload.new) as Row;
            if (row) applyRemote(payload.eventType, row);
          })
          .subscribe((status) => {
            // Se lee la tabla una vez abierto el canal para no perder cambios entre la lectura y la escucha.
            if (status === 'SUBSCRIBED') void load().finally(resolve);
            else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
              console.error(`[sync] canal de «${table}»: ${status}`);
              void load().finally(resolve);
            }
          });
      });
    },

    stop() {
      started = false;
      if (channel) void db.removeChannel(channel);
      channel = null;
      pending.clear();
      skipped.clear();
      state = initial;
      emit();
    },
  };

  registry.add(api);
  if (active) void api.start(); // un módulo cargado después del login (rutas perezosas)
  return api;
}
