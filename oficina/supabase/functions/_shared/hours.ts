import type { OpeningHours, Weekday } from './types.ts';

export const WEEKDAYS: Weekday[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const DAY_LABEL: Record<Weekday, string> = {
  mon: 'Lunes',
  tue: 'Martes',
  wed: 'Miércoles',
  thu: 'Jueves',
  fri: 'Viernes',
  sat: 'Sábado',
  sun: 'Domingo',
};
// Places numera los días de 0 (domingo) a 6 (sábado).
const PLACES_DAY: Weekday[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

/** Periodo de regularOpeningHours de Places API (New). */
export interface PlacesPeriod {
  open: { day: number; hour: number; minute: number };
  close?: { day: number; hour: number; minute: number };
}

const hhmm = (h: number, m: number) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

/**
 * Convierte los periodos de Places al horario estructurado de VirtualDesk.
 * Un periodo sin `close` significa abierto 24 h todos los días. Los que cruzan medianoche
 * se asignan al día de apertura (p. ej. vie 20:00 – 02:00 → fri ["20:00", "02:00"]).
 */
export function openingHoursFromPlaces(periods: PlacesPeriod[] | undefined): OpeningHours | null {
  if (!periods?.length) return null;
  if (periods.length === 1 && !periods[0].close) {
    return Object.fromEntries(WEEKDAYS.map((d) => [d, [['00:00', '24:00']]])) as OpeningHours;
  }
  const hours: OpeningHours = {};
  for (const p of periods) {
    if (!p.close) continue;
    const day = PLACES_DAY[p.open.day];
    (hours[day] ??= []).push([hhmm(p.open.hour, p.open.minute), hhmm(p.close.hour, p.close.minute)]);
  }
  for (const d of WEEKDAYS) hours[d]?.sort((a, b) => a[0].localeCompare(b[0]));
  return hours;
}

/** "09:30" → "9:30", como en la web del SaaS. */
const display = (t: string) => t.replace(/^0(\d)/, '$1');

/**
 * Formato que ya pinta el frontend del SaaS en public_config.hours:
 * [{ day: "Lunes", hours: "9:30 – 13:30 · 16:30 – 20:30" }, …, { day: "Domingo", hours: "Cerrado" }].
 */
export function displayHours(hours: OpeningHours): { day: string; hours: string }[] {
  return WEEKDAYS.map((d) => {
    const ranges = hours[d] ?? [];
    return {
      day: DAY_LABEL[d],
      hours: ranges.length ? ranges.map(([a, b]) => `${display(a)} – ${display(b)}`).join(' · ') : 'Cerrado',
    };
  });
}

export function hasOpeningHours(hours: unknown): boolean {
  if (!hours || typeof hours !== 'object') return false;
  return Array.isArray(hours) ? hours.length > 0 : Object.keys(hours).length > 0;
}
