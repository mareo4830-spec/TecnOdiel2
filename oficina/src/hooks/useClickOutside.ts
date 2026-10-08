import { useEffect, useRef } from 'react';

/** Llama a `onOutside` al pulsar fuera del elemento o al pulsar Escape. */
export function useClickOutside<T extends HTMLElement>(onOutside: () => void, enabled = true) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;
    const handlePointer = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOutside();
    };
    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('touchstart', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('touchstart', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onOutside, enabled]);

  return ref;
}
