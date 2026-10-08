import { createStore, useStore } from './store';
import { isSupabaseConfigured, supabase } from './supabase';

/*
 * Capa común de datos.
 *  - `live`: hay Supabase → todo lo que se crea, edita o elimina se guarda en la BD.
 *  - Los servicios actualizan su store al momento (la UI responde sin esperas) y mandan la
 *    escritura a `persist`, que las ejecuta EN ORDEN (crear un tenant y luego su facturación…).
 *  - Si una escritura falla se avisa en pantalla y se recargan los datos reales de la BD,
 *    así la pantalla nunca se queda mostrando algo que no se guardó.
 */
export const live = isSupabaseConfigured;

export function db() {
  if (!supabase) throw new Error('Supabase no está configurado');
  return supabase;
}

// ---------------------------------------------------------------- avisos de error

const errorsStore = createStore<{ id: string; message: string }[]>([]);

export const useDbErrors = () => useStore(errorsStore);

export function dismissDbError(id: string): void {
  errorsStore.set((prev) => prev.filter((e) => e.id !== id));
}

export function reportDbError(context: string, error: unknown): void {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'object' && error && 'message' in error
        ? String((error as { message: unknown }).message)
        : String(error);
  console.error(`[db] ${context}`, error);
  errorsStore.set((prev) => [...prev, { id: crypto.randomUUID(), message: `${context}: ${message}` }].slice(-3));
}

// ---------------------------------------------------------------- escrituras

interface DbResult {
  data?: unknown;
  error: { message: string } | null;
}

/** Ejecuta una consulta y lanza su error (para usar dentro de `persist`). */
export async function must<T = unknown>(query: PromiseLike<DbResult>): Promise<T> {
  const { data, error } = await query;
  if (error) throw error;
  return data as T;
}

/** Recarga de todos los datos tras un fallo (la registra DataSync). */
let reloadAll: () => void = () => {};
export function setReloadAll(fn: () => void): void {
  reloadAll = fn;
}

let queue: Promise<void> = Promise.resolve();

/**
 * Encola una escritura en Supabase. En modo demo no hace nada (los datos viven en memoria).
 * Devuelve una promesa que se resuelve cuando la escritura termina (o falla, ya avisada).
 */
export function persist(context: string, write: () => Promise<unknown>): Promise<boolean> {
  if (!live) return Promise.resolve(true);
  const run = queue.then(async () => {
    try {
      await write();
      return true;
    } catch (e) {
      reportDbError(context, e);
      reloadAll();
      return false;
    }
  });
  queue = run.then(() => undefined);
  return run;
}

/** Recarga puntual tras una escritura (p. ej. para traer el id que puso la BD). */
export function loadAfter(load: () => Promise<void>): void {
  load().catch((e) => reportDbError('Recargar datos', e));
}

export const num =(v: unknown): number => (v === null || v === undefined ? 0 : Number(v));
export const numOrNull = (v: unknown): number | null => (v === null || v === undefined ? null : Number(v));
