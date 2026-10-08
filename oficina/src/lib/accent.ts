import { createStore, useStore } from './store';

/** Color de acento de la app (Ajustes → Apariencia). Se recuerda en este dispositivo. */
export type Accent = 'forest' | 'ocean' | 'plum' | 'ember';

export const ACCENTS: { id: Accent; label: string; swatch: string }[] = [
  { id: 'forest', label: 'Bosque', swatch: '#1f6b45' },
  { id: 'ocean', label: 'Océano', swatch: '#234ca8' },
  { id: 'plum', label: 'Ciruela', swatch: '#6a2fa8' },
  { id: 'ember', label: 'Ascua', swatch: '#a8401f' },
];

const KEY = 'ov.accent';

function read(): Accent {
  try {
    const v = localStorage.getItem(KEY);
    if (v && ACCENTS.some((a) => a.id === v)) return v as Accent;
  } catch {
    /* sin almacenamiento */
  }
  return 'forest';
}

const accentStore = createStore<Accent>(read());

function apply(accent: Accent): void {
  document.documentElement.dataset.accent = accent;
}

apply(accentStore.get());

export const useAccent = () => useStore(accentStore);

let fadeTimer: number | undefined;

export function setAccent(accent: Accent): void {
  accentStore.set(() => accent);
  // Solo al cambiarlo a mano: la oficina se retiñe con un fundido (ver .accent-fade en index.css).
  const root = document.documentElement;
  root.classList.add('accent-fade');
  window.clearTimeout(fadeTimer);
  fadeTimer = window.setTimeout(() => root.classList.remove('accent-fade'), 900);
  apply(accent);
  try {
    localStorage.setItem(KEY, accent);
  } catch {
    /* sin almacenamiento: dura hasta recargar */
  }
}
