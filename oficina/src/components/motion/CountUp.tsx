import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../../lib/motion';

interface CountUpProps {
  value: number;
  /** Decimales a mostrar. */
  decimals?: number;
  className?: string;
}

/** Número que cuenta hasta su valor y se reajusta con animación cuando cambia (los KPI del vídeo). */
export function CountUp({ value, decimals = 0, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef({ v: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const render = () => {
      el.textContent = shown.current.v.toFixed(decimals);
    };
    if (prefersReducedMotion()) {
      shown.current.v = value;
      render();
      return;
    }
    const tween = gsap.to(shown.current, { v: value, duration: 1.4, ease: 'power3.out', onUpdate: render });
    return () => {
      tween.kill();
    };
  }, [value, decimals]);

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ''}`}>
      {(0).toFixed(decimals)}
    </span>
  );
}
