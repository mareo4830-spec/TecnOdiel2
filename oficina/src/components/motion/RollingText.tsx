import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../../lib/motion';

function Digit({ char }: { char: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(char);

  useEffect(() => {
    if (prev.current === char) return;
    prev.current = char;
    if (prefersReducedMotion() || !ref.current) return;
    gsap.fromTo(ref.current, { yPercent: -70, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.45, ease: 'expo.out' });
  }, [char]);

  return (
    <span className="inline-block overflow-hidden align-bottom">
      <span ref={ref} className="inline-block">
        {char}
      </span>
    </span>
  );
}

/** Texto (p. ej. un cronómetro) donde cada carácter que cambia rueda desde arriba, como el reloj del vídeo. */
export function RollingText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={`tabular-nums ${className ?? ''}`} aria-label={text}>
      {[...text].map((c, i) => (
        <Digit key={i} char={c} />
      ))}
    </span>
  );
}
