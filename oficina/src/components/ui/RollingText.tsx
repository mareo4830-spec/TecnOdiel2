import { AnimatePresence, motion } from 'motion/react';

/**
 * Texto cuyos caracteres ruedan al cambiar, como un cuentakilómetros
 * (los segundos del Time Tracker de Fernly): el viejo sale por arriba y el nuevo entra por abajo.
 */
export function RollingText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={`inline-flex ${className ?? ''}`} aria-label={text}>
      {[...text].map((ch, i) => (
        <span key={i} aria-hidden className="relative inline-block overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={ch}
              className="inline-block"
              initial={{ y: '100%', opacity: 0, filter: 'blur(2px)' }}
              animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: '-100%', opacity: 0, filter: 'blur(2px)' }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              {ch}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  );
}
