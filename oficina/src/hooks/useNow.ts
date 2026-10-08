import { useEffect, useState } from 'react';

/** Fuerza un re-render periódico para refrescar textos relativos ("hace 5 minutos"). */
export function useNow(intervalMs = 30_000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}
