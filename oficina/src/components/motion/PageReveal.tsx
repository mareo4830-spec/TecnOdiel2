import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { gsap, prefersReducedMotion } from '../../lib/motion';

/**
 * Entrada de cada sección: los bloques de primer nivel de la página suben y aparecen en cascada
 * (tarjetas, tablas, columnas). Si la página tiene un único contenedor, se anima lo que hay dentro.
 * Se monta dentro de <Suspense>, así la animación arranca cuando el contenido ya ha cargado.
 */
export function PageReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const host = ref.current;
    if (!host || prefersReducedMotion()) return;

    let blocks = [...(host.firstElementChild?.children ?? [])] as HTMLElement[];
    if (blocks.length === 1) blocks = [...(blocks[0].children ?? [])] as HTMLElement[];
    blocks = blocks.slice(0, 24);
    if (blocks.length === 0) return;

    const tween = gsap.fromTo(
      blocks,
      { y: 26, opacity: 0, scale: 0.985 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.85,
        ease: 'expo.out',
        stagger: 0.07,
        clearProps: 'transform,opacity',
      },
    );
    return () => {
      tween.revert();
    };
  }, []);

  return <div ref={ref}>{children}</div>;
}
