import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

/**
 * Scroll suave de toda la página (Lenis). Respeta "reducir movimiento" y deja
 * que los paneles con su propio scroll (chat, modales, menús, Kanban) se desplacen solos.
 */
let lenis: Lenis | null = null;

export function startSmoothScroll(): () => void {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  lenis = new Lenis({
    autoRaf: true,
    lerp: 0.1,
    anchors: true,
    allowNestedScroll: true,
    stopInertiaOnNavigate: true,
    prevent: (node) => !!node.closest?.('[role="dialog"],[role="alertdialog"],[role="menu"],[data-lenis-prevent]'),
  });
  return () => {
    lenis?.destroy();
    lenis = null;
  };
}

/** Vuelve arriba al cambiar de sección, sin animación (la página nueva entra con la suya). */
export function scrollToTop(): void {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}
