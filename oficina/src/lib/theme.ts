import { useSyncExternalStore } from 'react';

export type Theme = 'dark' | 'light';

const KEY = 'vd-theme';
const listeners = new Set<() => void>();

function read(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Cambia el tema con un círculo que se expande desde el botón (View Transitions) o, si no hay, con fundido. */
export function setTheme(next: Theme, origin?: { x: number; y: number }) {
  const apply = () => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* sin almacenamiento: el tema sigue aplicándose en esta sesión */
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'light' ? '#f2f8f5' : '#080b08');
    listeners.forEach((l) => l());
  };

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const start = (document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } })
    .startViewTransition;

  if (!reduced && start && origin) {
    const radius = Math.hypot(Math.max(origin.x, innerWidth - origin.x), Math.max(origin.y, innerHeight - origin.y));
    const t = start.call(document, apply);
    void t.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${origin.x}px ${origin.y}px)`, `circle(${radius}px at ${origin.x}px ${origin.y}px)`] },
        { duration: 650, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    });
    return;
  }

  const root = document.documentElement;
  root.classList.add('theme-switching');
  apply();
  window.setTimeout(() => root.classList.remove('theme-switching'), 500);
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, read, () => 'dark');
}
