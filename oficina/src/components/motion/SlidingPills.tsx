import { useEffect } from 'react';
import { gsap, prefersReducedMotion } from '../../lib/motion';

const ACTIVE = 'button[aria-pressed="true"], [role="tab"][aria-selected="true"]';

/**
 * Selección deslizante global para los grupos de chips y pestañas con relleno de acento: en vez de
 * que el fondo "salte" de un botón a otro, una píldora viaja entre ellos (como el filtro del equipo
 * en el vídeo). Se aplica sola a cualquier grupo cuyo botón activo use `bg-indigo-*`, sin tocar
 * los componentes; los grupos con otro estilo (subrayado, etc.) no se ven afectados.
 */
export function SlidingPills() {
  useEffect(() => {
    const reduced = prefersReducedMotion();
    const pills = new Map<HTMLElement, HTMLElement>();
    let raf = 0;

    const sync = () => {
      raf = 0;
      const seen = new Set<HTMLElement>();

      document.querySelectorAll<HTMLElement>(ACTIVE).forEach((btn) => {
        if (!btn.className.toString().includes('bg-indigo-600')) return;
        const host = btn.parentElement;
        if (!host || host.querySelectorAll(ACTIVE).length !== 1) return;
        seen.add(host);

        let pill = pills.get(host);
        const fresh = !pill || !pill.isConnected;
        if (!pill || !pill.isConnected) {
          pill = document.createElement('span');
          pill.setAttribute('aria-hidden', 'true');
          pill.className = 'slide-pill';
          host.dataset.slideHost = '1';
          host.prepend(pill);
          pills.set(host, pill);
        }

        const cs = getComputedStyle(btn);
        const to = {
          x: btn.offsetLeft,
          y: btn.offsetTop,
          width: btn.offsetWidth,
          height: btn.offsetHeight,
          borderRadius: cs.borderRadius,
        };
        if (fresh || reduced) {
          gsap.set(pill, { ...to, opacity: 1 });
        } else {
          gsap.to(pill, { ...to, opacity: 1, duration: 0.55, ease: 'expo.out', overwrite: true });
        }
      });

      pills.forEach((pill, host) => {
        if (!seen.has(host)) {
          pill.remove();
          delete host.dataset.slideHost;
          pills.delete(host);
        }
      });
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(sync);
    };

    const mo = new MutationObserver(schedule);
    mo.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['aria-pressed', 'aria-selected'],
    });
    window.addEventListener('resize', schedule);
    schedule();

    return () => {
      mo.disconnect();
      window.removeEventListener('resize', schedule);
      if (raf) cancelAnimationFrame(raf);
      pills.forEach((p, h) => {
        p.remove();
        delete h.dataset.slideHost;
      });
    };
  }, []);

  return null;
}
