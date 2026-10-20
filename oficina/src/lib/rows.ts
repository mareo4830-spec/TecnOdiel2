/*
 * Conversión entre lo que devuelve Postgres y lo que usa la app.
 * Las fechas se normalizan a ISO con «Z» y milisegundos: la BD las devuelve como
 * `2026-10-08T11:49:51.682123+00:00` y la app compara fechas como texto (unread, orden…),
 * así que hay que tener un único formato.
 */

export const iso = (v: unknown): string => new Date(v as string).toISOString();
export const isoOrNull = (v: unknown): string | null => (v == null ? null : iso(v));

/** Postgres `numeric` puede llegar como texto según el driver. */
export const num = (v: unknown): number => Number(v);
export const numOrNull = (v: unknown): number | null => (v == null ? null : Number(v));

/** Texto vacío → null (columnas con CHECK que no admiten ''). */
export const orNull = (v: string | null | undefined): string | null => (v && v.trim() ? v : null);
