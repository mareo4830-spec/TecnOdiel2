import { animate, useMotionValue, useTransform, motion } from 'motion/react';
import { useEffect } from 'react';

/** Número que sube desde su valor anterior hasta el nuevo (los contadores del Panel). */
export function CountUp({ value, format = (n) => String(Math.round(n)), className }: { value: number; format?: (n: number) => string; className?: string }) {
  const mv = useMotionValue(0);
  const text = useTransform(mv, (n) => format(n));

  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.9, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [mv, value]);

  return <motion.span className={className}>{text}</motion.span>;
}
