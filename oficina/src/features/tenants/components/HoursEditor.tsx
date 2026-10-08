import { Copy, Plus, X } from 'lucide-react';
import type { OpeningHours, Weekday } from '../../../types';
import { WEEKDAYS, WEEKDAY_LABEL } from '../tenantMeta';

const timeClass =
  'h-9 w-[5.5rem] rounded-lg border border-gray-700 bg-gray-800 px-2 text-sm tabular-nums text-white [color-scheme:dark] focus:border-indigo-500 focus:outline-none';

/** Horario por días con varios tramos (mañana y tarde). Un día sin tramos queda cerrado. */
export function HoursEditor({ value, onChange }: { value: OpeningHours; onChange: (next: OpeningHours) => void }) {
  const setDay = (day: Weekday, ranges: [string, string][]) => {
    const next = { ...value };
    if (ranges.length) next[day] = ranges;
    else delete next[day];
    onChange(next);
  };

  // Copia el horario del lunes a los demás días laborables.
  const copyMonday = () => {
    const mon = value.mon;
    if (!mon) return;
    onChange({ ...value, tue: mon, wed: mon, thu: mon, fri: mon });
  };

  return (
    <div className="space-y-2">
      {WEEKDAYS.map((day) => {
        const ranges = value[day] ?? [];
        const open = ranges.length > 0;
        return (
          <div key={day} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-800 bg-gray-800/30 px-3 py-2">
            <label className="flex w-28 shrink-0 items-center gap-2 text-sm text-gray-200">
              <input
                type="checkbox"
                checked={open}
                onChange={(e) => setDay(day, e.target.checked ? [['09:30', '13:30'], ['16:30', '20:30']] : [])}
                className="h-4 w-4 accent-indigo-500"
              />
              {WEEKDAY_LABEL[day]}
            </label>
            {!open && <span className="text-sm text-gray-500">Cerrado</span>}
            {ranges.map(([from, to], i) => (
              <span key={i} className="flex items-center gap-1">
                <input
                  type="time"
                  aria-label={`${WEEKDAY_LABEL[day]}, tramo ${i + 1}, apertura`}
                  value={from}
                  onChange={(e) => setDay(day, ranges.map((r, j) => (j === i ? [e.target.value, r[1]] : r)))}
                  className={timeClass}
                />
                <span className="text-gray-500">–</span>
                <input
                  type="time"
                  aria-label={`${WEEKDAY_LABEL[day]}, tramo ${i + 1}, cierre`}
                  value={to}
                  onChange={(e) => setDay(day, ranges.map((r, j) => (j === i ? [r[0], e.target.value] : r)))}
                  className={timeClass}
                />
                <button
                  type="button"
                  onClick={() => setDay(day, ranges.filter((_, j) => j !== i))}
                  aria-label={`Quitar tramo ${i + 1} del ${WEEKDAY_LABEL[day].toLowerCase()}`}
                  className="rounded-md p-1 text-gray-500 hover:bg-gray-700 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
            {open && ranges.length < 3 && (
              <button
                type="button"
                onClick={() => setDay(day, [...ranges, ['16:30', '20:30']])}
                className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs text-indigo-300 hover:bg-gray-700"
              >
                <Plus className="h-3.5 w-3.5" />
                Tramo
              </button>
            )}
          </div>
        );
      })}
      {value.mon && (
        <button type="button" onClick={copyMonday} className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-300 hover:text-indigo-200">
          <Copy className="h-3.5 w-3.5" />
          Copiar el lunes de martes a viernes
        </button>
      )}
    </div>
  );
}

/** Horario en texto compacto, como lo pinta la web del SaaS. */
export function hoursSummary(value: OpeningHours | null): { day: string; hours: string }[] {
  return WEEKDAYS.map((d) => ({
    day: WEEKDAY_LABEL[d],
    hours: value?.[d]?.length ? value[d]!.map(([a, b]) => `${a.replace(/^0/, '')} – ${b.replace(/^0/, '')}`).join(' · ') : 'Cerrado',
  }));
}
