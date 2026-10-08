import { useLayoutEffect, type RefObject } from 'react';

/*
 * Entrada escalonada de una vista, al estilo de Fernly (GSAP batch): al abrir una sección,
 * sus tarjetas suben y se enfocan una tras otra en orden de lectura; las que quedan
 * por debajo del pliegue aparecen al llegar a ellas con el scroll.
 *
 * Detecta solas las tarjetas (.card, cajas con borde y fondo de tarjeta, [data-reveal]),
 * también las que llegan después (secciones con carga diferida o datos que tardan).
 * Lo que va dentro de [data-own-motion] ya se anima por su cuenta y se deja en paz.
 */

const SELECTOR = [
  '.card',
  '[data-reveal]',
  'section.rounded-2xl.border',
  'div.rounded-2xl.border.bg-gray-900',
  'article.rounded-2xl',
  'li.rounded-2xl',
  'a.rounded-2xl.border',
].join(',');

const SKIP_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON']);
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
/** Ventana tras abrir la sección en la que lo que aparezca también entra animado. */
const WATCH_MS = 1500;
const MAX_STAGGER = 14;

function play(el: HTMLElement, delay: number) {
  el.animate(
    [
      { opacity: 0, transform: 'translateY(18px) scale(0.985)', filter: 'blur(6px)' },
      { opacity: 1, transform: 'none', filter: 'blur(0)' },
    ],
    { duration: 620, delay, easing: EASE, fill: 'backwards' },
  );
}

export function useReveal(ref: RefObject<HTMLElement | null>, key: string) {
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const seen = new WeakSet<Element>();
    const holds = new Map<Element, Animation>();
    let batch = 0;
    const start = performance.now();

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement);
        visible.forEach((el, i) => {
          io.unobserve(el);
          holds.get(el)?.cancel();
          holds.delete(el);
          play(el, Math.min(i, 6) * 60);
        });
      },
      { rootMargin: '0px 0px -8% 0px' },
    );

    const collect = () => {
      const found: HTMLElement[] = [];
      root.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
        if (seen.has(el) || SKIP_TAGS.has(el.tagName)) return;
        if (el.closest('[data-own-motion]')) return;
        // Solo la tarjeta exterior (las de dentro se mueven con ella), salvo las marcadas a mano.
        const parent = el.parentElement?.closest(SELECTOR);
        if (parent && root.contains(parent) && !el.hasAttribute('data-reveal')) return;
        const pos = getComputedStyle(el).position;
        if (pos === 'fixed' || pos === 'absolute') return;
        seen.add(el);
        found.push(el);
      });
      if (!found.length) return;

      // Orden de lectura: de arriba abajo y de izquierda a derecha.
      const rects = new Map(found.map((el) => [el, el.getBoundingClientRect()]));
      found.sort((a, b) => {
        const ra = rects.get(a)!;
        const rb = rects.get(b)!;
        return Math.abs(ra.top - rb.top) > 12 ? ra.top - rb.top : ra.left - rb.left;
      });

      const base = batch === 0 ? 120 : 0;
      let n = 0;
      for (const el of found) {
        const r = rects.get(el)!;
        if (r.top < window.innerHeight && r.bottom > 0) {
          play(el, base + Math.min(n++, MAX_STAGGER) * 55);
        } else if (r.top >= window.innerHeight) {
          // Oculta hasta que el scroll llegue a ella.
          holds.set(el, el.animate([{ opacity: 0 }, { opacity: 0 }], { duration: 1e9, fill: 'forwards' }));
          io.observe(el);
        }
      }
      batch++;
    };

    collect();
    const mo = new MutationObserver(() => {
      if (performance.now() - start > WATCH_MS) {
        mo.disconnect();
        return;
      }
      collect();
    });
    mo.observe(root, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
      holds.forEach((a) => a.cancel());
    };
  }, [ref, key]);
}
