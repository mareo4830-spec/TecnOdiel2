import { useLayoutEffect, useMemo, useRef } from 'react';
import { CountUp } from '../../../components/motion/CountUp';
import { gsap, prefersReducedMotion } from '../../../lib/motion';
import { useWorkItems } from '../../kanban/workService';

const R = 70;
const ARC_LEN = Math.PI * R; // longitud del semicírculo

/** Progreso global de los trabajos en curso: medidor semicircular con el arco dibujándose. */
export function ProgressWidget() {
  const items = useWorkItems();
  const runRef = useRef<SVGPathElement>(null);
  const doneRef = useRef<SVGPathElement>(null);

  const { done, running, planned, total, pct } = useMemo(() => {
    const done = items.filter((i) => i.stage === 'hecho').length;
    const running = items.filter((i) => i.stage === 'en_progreso').length;
    const planned = items.filter((i) => i.stage === 'planeado').length;
    const total = done + running + planned;
    return { done, running, planned, total, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [items]);

  const doneFrac = total ? done / total : 0;
  const runFrac = total ? (done + running) / total : 0;

  useLayoutEffect(() => {
    if (!runRef.current || !doneRef.current) return;
    const targets = [
      { el: runRef.current, frac: runFrac, delay: 0.1 },
      { el: doneRef.current, frac: doneFrac, delay: 0.2 },
    ];
    if (prefersReducedMotion()) {
      targets.forEach(({ el, frac }) => {
        el.style.strokeDashoffset = `${ARC_LEN * (1 - frac)}`;
      });
      return;
    }
    const tweens = targets.map(({ el, frac, delay }) => {
      gsap.set(el, { strokeDashoffset: ARC_LEN });
      return gsap.to(el, { strokeDashoffset: ARC_LEN * (1 - frac), duration: 1.1, ease: 'power3.out', delay });
    });
    // Salta al final antes de matarlos: si el efecto se corta a medias, el arco queda en su
    // porcentaje real en vez de a 0% (revert() aquí lo dejaría oculto, que es su estado inicial).
    return () => tweens.forEach((t) => t.progress(1).kill());
  }, [doneFrac, runFrac]);

  const arc = `M ${90 - R} 90 A ${R} ${R} 0 0 1 ${90 + R} 90`;

  return (
    <div className="flex h-full flex-col">
      <div className="relative mx-auto mt-1 w-full max-w-56">
        <svg viewBox="0 0 180 100" className="w-full" aria-hidden>
          <path d={arc} fill="none" stroke="var(--color-gray-800)" strokeWidth="20" strokeLinecap="round" />
          <path
            ref={runRef}
            d={arc}
            fill="none"
            stroke="var(--color-indigo-800)"
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray={ARC_LEN}
            strokeDashoffset={ARC_LEN}
          />
          <path
            ref={doneRef}
            d={arc}
            fill="none"
            stroke="var(--color-indigo-500)"
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray={ARC_LEN}
            strokeDashoffset={ARC_LEN}
          />
        </svg>
        <div className="absolute inset-x-0 bottom-0 text-center">
          <p className="text-3xl font-bold tracking-tight text-white">
            <CountUp value={pct} />%
          </p>
          <p className="text-[11px] text-gray-500">Trabajos terminados</p>
        </div>
      </div>
      <ul className="mt-4 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] text-gray-400">
        <li className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" /> Hechos ({done})
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-800" /> En progreso ({running})
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border border-gray-600 bg-gray-900" /> Por cerrar ({planned})
        </li>
      </ul>
    </div>
  );
}
