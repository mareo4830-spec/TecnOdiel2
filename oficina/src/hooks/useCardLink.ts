import type { MouseEvent } from 'react';
import { useHref, useNavigate } from 'react-router-dom';

const INTERACTIVE = 'a, button, input, select, textarea, label, form, [role="menu"]';

/**
 * Tarjeta entera clicable: al pulsar en cualquier hueco va a `to`, como el enlace del título.
 * Los botones, enlaces y formularios de dentro siguen funcionando, y no navega si se está
 * seleccionando texto. Con Ctrl/Cmd o la rueda abre en una pestaña nueva.
 */
export function useCardLink(to: string) {
  const navigate = useNavigate();
  const href = useHref(to);

  const open = (e: MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).closest(INTERACTIVE)) return;
    if (window.getSelection()?.toString()) return;
    if (e.ctrlKey || e.metaKey || e.button === 1) window.open(href, '_blank');
    else navigate(to);
  };

  return { onClick: open, onAuxClick: (e: MouseEvent<HTMLElement>) => e.button === 1 && open(e) };
}
