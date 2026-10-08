import { X } from 'lucide-react';
import { useLayoutEffect, useRef, type MouseEvent } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NAV_ITEMS, getNavItem } from '../../lib/navigation';
import { gsap, prefersReducedMotion } from '../../lib/motion';
import { useAuth } from '../../features/auth/authContext';
import { useUnreadCount } from '../../features/chat/chatService';
import { useClientUnreadTotal } from '../../features/chats/clientChatService';
import { Brand } from '../Brand';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { partner } = useAuth();
  const { pathname } = useLocation();
  const clientUnread = useClientUnreadTotal();
  const teamUnread = useUnreadCount(partner?.id);
  const badges: Record<string, number> = { '/chats': clientUnread + teamUnread };

  const listRef = useRef<HTMLUListElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const hoverRef = useRef<HTMLSpanElement>(null);
  const placed = useRef(false);

  const activeIndex = NAV_ITEMS.findIndex((i) => i.path === getNavItem(pathname).path);

  // Selección deslizante: la píldora y la barra lateral viajan hasta la herramienta activa.
  useLayoutEffect(() => {
    const list = listRef.current;
    // Solo los <li>: los tres <span> del indicador también son hijos de la lista.
    const li = list?.querySelectorAll<HTMLElement>(':scope > li')[activeIndex];
    if (!li || !pillRef.current || !barRef.current) return;
    const to = { y: li.offsetTop, height: li.offsetHeight };
    if (!placed.current || prefersReducedMotion()) {
      gsap.set(pillRef.current, { ...to, opacity: 1 });
      gsap.set(barRef.current, { y: li.offsetTop + li.offsetHeight / 2 - 9, opacity: 1 });
      placed.current = true;
      return;
    }
    gsap.to(pillRef.current, { ...to, duration: 0.7, ease: 'expo.out', overwrite: true });
    gsap.to(barRef.current, {
      y: li.offsetTop + li.offsetHeight / 2 - 9,
      duration: 0.9,
      ease: 'elastic.out(1, 0.65)',
      overwrite: true,
    });
  }, [activeIndex, partner]);

  // Entrada escalonada de las herramientas al cargar la app.
  useLayoutEffect(() => {
    if (!listRef.current || prefersReducedMotion()) return;
    const items = listRef.current.querySelectorAll(':scope > li');
    const tween = gsap.fromTo(
      items,
      { x: -18, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.05, delay: 0.1, clearProps: 'transform,opacity' },
    );
    return () => {
      tween.revert();
    };
  }, [partner]);

  const moveHover = (e: MouseEvent<HTMLLIElement>) => {
    const li = e.currentTarget;
    if (!hoverRef.current) return;
    const hidden = gsap.getProperty(hoverRef.current, 'opacity') === 0;
    if (hidden) gsap.set(hoverRef.current, { y: li.offsetTop, height: li.offsetHeight });
    gsap.to(hoverRef.current, { y: li.offsetTop, height: li.offsetHeight, opacity: 1, duration: 0.35, ease: 'power3.out', overwrite: true });
  };
  const hideHover = () => {
    if (hoverRef.current) gsap.to(hoverRef.current, { opacity: 0, duration: 0.25 });
  };

  const ripple = (e: MouseEvent<HTMLAnchorElement>) => {
    const a = e.currentTarget;
    const r = a.getBoundingClientRect();
    const dot = document.createElement('span');
    dot.className = 'nav-ripple';
    dot.style.left = `${e.clientX - r.left}px`;
    dot.style.top = `${e.clientY - r.top}px`;
    a.appendChild(dot);
    window.setTimeout(() => dot.remove(), 750);
  };

  if (!partner) return null;

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-gray-800 bg-gray-950 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:sticky lg:top-0 lg:h-dvh lg:w-52 lg:shrink-0 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-14 items-center justify-between px-4">
          <Brand size="sm" />
          <button
            onClick={onClose}
            aria-label="Cerrar menú"
            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-2" aria-label="Navegación principal">
          <ul ref={listRef} className="relative space-y-0.5" onMouseLeave={hideHover}>
            <span
              ref={hoverRef}
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 rounded-md bg-gray-800/50 opacity-0"
            />
            <span
              ref={pillRef}
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 rounded-md bg-indigo-500/15 opacity-0"
            />
            <span
              ref={barRef}
              aria-hidden
              className="pointer-events-none absolute -left-2 top-0 h-[18px] w-[3px] rounded-full bg-indigo-400 opacity-0 shadow-[0_0_10px] shadow-indigo-400/70"
            />
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path} className="relative" onMouseEnter={moveHover}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    onClick={ripple}
                    className={({ isActive }) =>
                      `relative flex items-center gap-2.5 overflow-hidden rounded-md px-2.5 py-1.5 text-[13px] transition-colors duration-300 ${
                        isActive ? 'font-medium text-white' : 'text-gray-400 hover:text-gray-100'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                    <span className="truncate">{item.label}</span>
                    {badges[item.path] > 0 && (
                      <span className="ml-auto grid h-4 min-w-4 place-items-center rounded-full bg-indigo-600 px-1 text-[10px] font-semibold text-white">
                        {badges[item.path] > 9 ? '9+' : badges[item.path]}
                      </span>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
