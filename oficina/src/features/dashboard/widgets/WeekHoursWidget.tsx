import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '../../../lib/motion';
import { useSessionEvaluations } from '../../hours/hoursService';
import { CountUp } from '../../../components/motion/CountUp';

const DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const FILLS = ['bg-indigo-700', 'bg-indigo-500', 'bg-indigo-300', 'bg-indigo-900', 'bg-indigo-600', 'bg-indigo-400', 'bg-indigo-800'];

/** Horas verificadas de la semana en curso, en barras que crecen desde abajo con un ligero rebote. */
export function WeekHoursWidget() {
  const evaluations = useSessionEvaluations();
  const [hover, setHover] = useState<number | null>(null);
  const barsRef = useRef<HTMLDivElement>(null);

  const week = useMemo(() => {
    const now = new Date();
    const monday = new Date(now);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    const hours = Array<number>(7).fill(0);
    for (const e of evaluations) {
      const d = new Date(e.session.startedAt);
      const idx = Math.floor((d.getTime() - monday.getTime()) / 86_400_000);
      if (idx >= 0 && idx < 7) hours[idx] += e.counted;
    }
    return { hours, today: (now.getDay() + 6) % 7 };
  }, [evaluations]);

  const max = Math.max(8, ...week.hours);
  const total = week.hours.reduce((s, h) => s + h, 0);

  useLayoutEffect(() => {
    if (!barsRef.current || prefersReducedMotion()) return;
    const bars = barsRef.current.querySelectorAll<HTMLElement>('[data-bar]');
    const tween = gsap.fromTo(
      bars,
      { scaleY: 0 },
      { scaleY: 1, duration: 0.9, ease: 'elastic.out(1, 0.7)', stagger: 0.07, delay: 0.1, transformOrigin: '50% 100%' },
    );
    return () => {
      // Salta al final antes de matarlo: si el efecto se corta a medias, las barras quedan a su
      // altura real en vez de encogidas a cero.
      tween.progress(1).kill();
    };
  }, [week.hours.join(',')]);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-medium text-gray-400">Esta semana</p>
        <span className="text-xs font-semibold text-indigo-300">
          <CountUp value={total} decimals={1} /> h
        </span>
      </div>
      <div ref={barsRef} className="flex h-32 flex-1 items-end justify-between gap-1.5" onMouseLeave={() => setHover(null)}>
        {week.hours.map((h, i) => {
          const empty = h === 0;
          const pct = empty ? 10 : Math.max(10, (h / max) * 100);
          return (
            <div key={i} className="relative flex h-full flex-1 flex-col items-center justify-end" onMouseEnter={() => setHover(i)}>
              {hover === i && !empty && (
                <span className="absolute -top-6 z-10 whitespace-nowrap rounded-md border border-gray-700 bg-gray-900 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow">
                  {h.toFixed(1)} h
                </span>
              )}
              <div
                data-bar
                style={{ height: `${pct}%` }}
                className={`w-full max-w-7 rounded-full transition-[opacity] duration-200 ${
                  empty ? 'border border-dashed border-gray-700 bg-gray-800/60' : FILLS[i % FILLS.length]
                } ${i === week.today ? 'ring-2 ring-indigo-300 ring-offset-2 ring-offset-gray-900' : ''} ${
                  hover !== null && hover !== i ? 'opacity-50' : 'opacity-100'
                }`}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between gap-1.5">
        {DAYS.map((d, i) => (
          <span key={d} className={`flex-1 text-center text-[11px] ${i === week.today ? 'font-semibold text-white' : 'text-gray-500'}`}>
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}
