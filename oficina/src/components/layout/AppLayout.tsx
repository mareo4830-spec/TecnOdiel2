import { Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ChatWidget } from '../../features/chat/ChatWidget';
import { gsap, prefersReducedMotion } from '../../lib/motion';
import { PageReveal } from '../motion/PageReveal';
import { SlidingPills } from '../motion/SlidingPills';
import { SmoothScroll } from '../motion/SmoothScroll';
import { ToastHost } from '../motion/ToastHost';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

function SectionSkeleton() {
  return (
    <div className="mx-auto grid max-w-[1600px] gap-4 sm:gap-6 md:grid-cols-2" aria-label="Cargando sección" role="status">
      <div className="skeleton h-40 rounded-2xl md:col-span-2" />
      <div className="skeleton h-56 rounded-2xl" />
      <div className="skeleton h-56 rounded-2xl" />
    </div>
  );
}

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const shell = useRef<HTMLDivElement>(null);
  // En /chats el chat del equipo ya está a página completa.
  const showChatWidget = !pathname.startsWith('/chats');

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // Entrada del marco de la app (como el panel del vídeo al salir del splash): sale del desenfoque y escala.
  useLayoutEffect(() => {
    if (!shell.current || prefersReducedMotion()) return;
    const delay = document.documentElement.classList.contains('splash-active') ? 1.3 : 0;
    const tween = gsap.fromTo(
      shell.current,
      { opacity: 0, scale: 0.97, filter: 'blur(10px)' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1, ease: 'expo.out', delay, clearProps: 'filter,transform,opacity' },
    );
    return () => {
      // Salta al final antes de matarlo: si el efecto se reinicia a medias (el doble montaje de
      // StrictMode, o un desmontaje muy rápido) el marco queda visible en vez de congelado a
      // medio desenfocar — si no, la app entera podía quedarse invisible.
      tween.progress(1).kill();
    };
  }, []);

  return (
    <div ref={shell} className="min-h-dvh bg-gray-950 text-gray-100 lg:flex">
      <SmoothScroll />
      <SlidingPills />
      <Sidebar open={menuOpen} onClose={closeMenu} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header onOpenMenu={() => setMenuOpen(true)} />
        {/* pb extra para que el botón flotante del chat no tape el final de la página. */}
        <main className={`flex-1 px-4 pt-5 sm:px-6 sm:pt-6 ${showChatWidget ? 'pb-24' : 'pb-5 sm:pb-6'}`}>
          <Suspense fallback={<SectionSkeleton />}>
            <PageReveal key={pathname}>
              <Outlet />
            </PageReveal>
          </Suspense>
        </main>
      </div>
      {showChatWidget && <ChatWidget />}
      <ToastHost />
    </div>
  );
}
