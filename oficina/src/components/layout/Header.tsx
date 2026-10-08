import { Globe, Menu, Plus } from 'lucide-react';
import { useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { APP_URLS } from '../../lib/config';
import { gsap, prefersReducedMotion } from '../../lib/motion';
import { ThemeToggle } from '../ui/ThemeToggle';
import { getNavItem } from '../../lib/navigation';
import { CheckinButton } from './CheckinButton';
import { GlobalSearch } from './GlobalSearch';
import { NotificationsMenu } from './NotificationsMenu';
import { ProfileMenu } from './ProfileMenu';

export function Header({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const item = getNavItem(pathname);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // El título de cada sección se revela letra a letra desde una máscara.
  useLayoutEffect(() => {
    if (!titleRef.current || prefersReducedMotion()) return;
    const chars = titleRef.current.querySelectorAll('.t-char');
    const tween = gsap.fromTo(chars, { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: 'expo.out', stagger: 0.025 });
    return () => {
      // Salta al final antes de matarlo: si el efecto se reinicia a medias (p. ej. el doble
      // montaje de StrictMode) las letras quedan en su sitio en vez de a mitad de camino e invisibles.
      tween.progress(1).kill();
    };
  }, [item.path]);

  return (
    <header className="sticky top-0 z-20 border-b border-gray-800/80 bg-gray-950/85 backdrop-blur">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-3 px-4 py-3 sm:px-6">
        <button
          onClick={onOpenMenu}
          aria-label="Abrir menú"
          className="grid h-10 w-10 place-items-center rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <h1
          ref={titleRef}
          aria-label={item.title}
          className="min-w-0 flex-1 truncate text-base font-semibold text-white sm:text-xl xl:flex-none"
        >
          <span aria-hidden className="sm:hidden">
            {[...item.label].map((c, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <span className="t-char inline-block whitespace-pre">{c}</span>
              </span>
            ))}
          </span>
          <span aria-hidden className="hidden sm:inline">
            {[...item.title].map((c, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <span className="t-char inline-block whitespace-pre">{c}</span>
              </span>
            ))}
          </span>
        </h1>

        {/* Hasta xl, buscador + botón bajan a una segunda fila a ancho completo. */}
        <div className="order-last flex w-full items-center gap-2 xl:order-none xl:ml-auto xl:w-auto">
          <GlobalSearch />
          <button
            onClick={() => navigate('/proyectos?nuevo=1')}
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-3 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition hover:from-indigo-500 hover:to-purple-500 sm:px-4"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Añadir Proyecto</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <a
            href={APP_URLS.landing}
            aria-label="Ir a la landing"
            title="Ir a la landing"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-700 px-3 text-sm font-medium text-gray-300 transition hover:border-indigo-500 hover:text-white"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden md:inline">Landing</span>
          </a>
          <ThemeToggle />
          <CheckinButton />
          <NotificationsMenu />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
