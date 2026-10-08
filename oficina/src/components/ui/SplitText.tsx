import { motion } from 'motion/react';
import type { ElementType } from 'react';

/**
 * Texto que sube letra a letra desde una máscara (el título de cada sección en Fernly).
 * Las palabras no se parten al saltar de línea; los lectores de pantalla leen el texto entero.
 */
export function SplitText({
  text,
  as: Tag = 'span',
  className,
  delay = 0,
  stagger = 0.022,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  let index = 0;
  return (
    <Tag className={className} aria-label={text}>
      {text.split(' ').map((word, w, words) => (
        <span key={w} aria-hidden className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom">
          {[...word].map((ch) => {
            const i = index++;
            return (
              <motion.span
                key={i}
                className="inline-block will-change-transform"
                initial={{ y: '105%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ duration: 0.55, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] }}
              >
                {ch}
              </motion.span>
            );
          })}
          {w < words.length - 1 && ' '}
        </span>
      ))}
    </Tag>
  );
}
