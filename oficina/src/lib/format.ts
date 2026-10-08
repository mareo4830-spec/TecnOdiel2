export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map((n) => String(n).padStart(2, '0')).join(':');
}

const relative = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });

export function formatRelative(iso: string): string {
  const diffSec = Math.round((new Date(iso).getTime() - Date.now()) / 1000);
  const abs = Math.abs(diffSec);
  if (abs < 60) return relative.format(diffSec, 'second');
  if (abs < 3600) return relative.format(Math.round(diffSec / 60), 'minute');
  if (abs < 86400) return relative.format(Math.round(diffSec / 3600), 'hour');
  return relative.format(Math.round(diffSec / 86400), 'day');
}

export function formatLongDate(date: Date): string {
  const text = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const eur = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

export function formatEuros(amount: number): string {
  return eur.format(amount);
}

export function formatShortDate(iso: string): string {
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).format(
    new Date(iso),
  );
}

/** Parsea una fecha YYYY-MM-DD como fecha local (sin desfase de zona horaria). */
function parseLocalDate(ymd: string): Date {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Días desde hoy hasta la fecha (negativo si ya pasó). */
export function daysUntil(ymd: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((parseLocalDate(ymd).getTime() - today.getTime()) / 86_400_000);
}

export function formatDueDate(ymd: string): string {
  const diff = daysUntil(ymd);
  if (diff === 0) return 'Hoy';
  if (diff === 1) return 'Mañana';
  if (diff === -1) return 'Ayer';
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' }).format(parseLocalDate(ymd));
}

export function greeting(date: Date): string {
  const h = date.getHours();
  if (h >= 6 && h < 14) return 'Buenos días';
  if (h >= 14 && h < 21) return 'Buenas tardes';
  return 'Buenas noches';
}
