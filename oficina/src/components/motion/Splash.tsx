import { useLayoutEffect, useRef, useState } from 'react';
import { APP_CONFIG } from '../../lib/config';
import { gsap, prefersReducedMotion } from '../../lib/motion';

const SPLASH_TITLE = 'VirtualOffice';

/**
 * Intro de marca (en cada carga de la página): fondo verde con resplandor en movimiento, logo y nombre que
 * suben letra a letra desde una máscara, eslogan que aparece y salida con cortina hacia arriba.
 */
export function Splash() {
  const [done, setDone] = useState(prefersReducedMotion);
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (done) return;
    document.documentElement.classList.add('splash-active');
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.documentElement.classList.remove('splash-active');
          setDone(true);
        },
      });
      // Duración total ≈ 1,8 s.
      tl.from('.sp-mark', { scale: 0.4, rotate: -25, opacity: 0, duration: 0.55, ease: 'back.out(1.8)' })
        .from('.sp-char', { yPercent: 115, duration: 0.55, ease: 'expo.out', stagger: 0.03 }, '-=0.35')
        .from('.sp-tag', { y: 12, opacity: 0, duration: 0.45, ease: 'power3.out' }, '-=0.3')
        .to({}, { duration: 0.2 })
        .to('.sp-content', { y: -20, opacity: 0, duration: 0.25, ease: 'power2.in' })
        .to(root.current, { yPercent: -100, duration: 0.55, ease: 'expo.inOut' }, '-=0.05');
    }, root);
    return () => {
      ctx.revert();
      document.documentElement.classList.remove('splash-active');
    };
  }, [done]);

  if (done) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-[#080b08]"
      onClick={() => setDone(true)}
    >
      <div
        aria-hidden
        className="absolute -left-1/4 -top-1/4 h-[70vmax] w-[70vmax] rounded-full bg-[radial-gradient(circle,#2f9622_0%,transparent_65%)] opacity-70 [animation:drift_9s_ease-in-out_infinite]"
      />
      <div
        aria-hidden
        className="absolute -bottom-1/3 -right-1/4 h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(circle,#26761f_0%,transparent_65%)] opacity-60 [animation:drift_11s_ease-in-out_infinite_reverse]"
      />
      <div className="sp-content relative flex flex-col items-center text-center">
        <div className="flex items-center gap-4">
          <span className="sp-mark grid h-14 w-14 place-items-center rounded-2xl border-2 border-[#6dd94b] text-xl font-bold text-[#6dd94b]">
            {APP_CONFIG.shortName}
          </span>
          <h1 className="flex overflow-hidden pb-2 text-6xl font-semibold tracking-tight text-[#f4f7f4] sm:text-7xl">
            {[...SPLASH_TITLE].map((c, i) => (
              <span key={i} className="sp-char inline-block whitespace-pre">
                {c}
              </span>
            ))}
          </h1>
        </div>
        <p className="sp-tag mt-3 text-base text-emerald-100/80">En Tecnodiel trabajamos desde nuestra puta casa</p>
      </div>
    </div>
  );
}
