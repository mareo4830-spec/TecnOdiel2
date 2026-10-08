import { LoaderCircle, Plus, SquareKanban } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useOutlet } from 'react-router-dom';
import { ChatWidget } from '../../features/chat/ChatWidget';
import { useReveal } from '../../hooks/useReveal';
import { getNavItem } from '../../lib/navigation';
import { scrollToTop, startSmoothScroll } from '../../lib/smoothScroll';
import { SplitText } from '../ui/SplitText';
import { DbErrorToast } from '../ui/DbErrorToast';
import { ToastHost } from '../ui/Toast';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

/** Frase bajo el título de cada sección, como el "Everything your team is shipping" de Fernly. */
const SUBTITLES: Record<string, string> = {
  '/': 'Todo lo que está moviendo la agencia, en un solo sitio.',
  '/proyectos': 'Una carpeta por cliente y los productos SaaS con sus tenants.',
  '/kanban': 'Arrastra cada trabajo o tarea a su etapa, o usa su menú para moverlo.',
  '/horas': 'Horas verificadas, reparto de cada proyecto y fondo común.',
  '/crm': 'Clientes potenciales desde el primer contacto hasta el cierre.',
  '/chats': 'WhatsApp de los clientes y chat interno del equipo.',
  '/ajustes': 'Tu perfil, la conexión con Supabase y el aspecto de la oficina.',
};

const primaryBtn =
  'on-accent inline-flex h-10 items-center gap-2 rounded-full bg-indigo-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-600 active:translate-y-0';
const outlineBtn =
  'inline-flex h-10 items-center gap-2 rounded-full border border-gray-600 bg-gray-900 px-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-gray-500 active:translate-y-0';

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 10, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
});

function PageTitle({ pathname }: { pathname: string }) {
  const item = getNavItem(pathname);
  // Solo en la portada de cada sección: las fichas (proyecto, tenant…) tienen su propia cabecera.
  if (pathname !== item.path) return null;
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {/* El título sube letra a letra; la frase de debajo llega justo detrás. */}
        <SplitText as="h1" text={item.title} className="text-[1.75rem] font-bold leading-tight tracking-tight text-white sm:text-[2rem]" />
        <motion.p {...fadeUp(0.18)} className="mt-1 text-sm text-gray-400">
          {SUBTITLES[item.path]}
        </motion.p>
      </div>
      {item.path === '/' && (
        <motion.div {...fadeUp(0.26)} className="flex flex-wrap gap-2">
          <Link to="/proyectos?nuevo=1" className={primaryBtn}>
            <Plus className="h-4 w-4" /> Añadir proyecto
          </Link>
          <Link to="/kanban" className={outlineBtn}>
            <SquareKanban className="h-4 w-4" /> Ver Kanban
          </Link>
        </motion.div>
      )}
    </div>
  );
}

/**
 * Una sección: congela su contenido para que, al cambiar de ruta, la vieja pueda
 * salir con su animación mientras la nueva espera; al entrar, sus tarjetas aparecen en cascada.
 */
function Page({ pathname }: { pathname: string }) {
  const [outlet] = useState(useOutlet());
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref, pathname);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -8, filter: 'blur(6px)', transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }}
      transition={{ duration: 0.25 }}
    >
      <PageTitle pathname={pathname} />
      {outlet}
    </motion.div>
  );
}

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  // En /chats el chat del equipo ya está a página completa.
  const showChatWidget = !pathname.startsWith('/chats');

  useEffect(() => startSmoothScroll(), []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <div className="min-h-dvh text-gray-100 lg:flex">
      <Sidebar open={menuOpen} onClose={closeMenu} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header onOpenMenu={() => setMenuOpen(true)} />
        {/* pb extra para que el botón flotante del chat no tape el final de la página. */}
        <main className={`flex-1 px-4 pt-2 sm:px-6 lg:px-8 ${showChatWidget ? 'pb-24' : 'pb-5 sm:pb-6'}`}>
          <Suspense
            fallback={
              <div className="grid min-h-60 place-items-center">
                <LoaderCircle className="h-7 w-7 animate-spin text-indigo-400" aria-label="Cargando sección" />
              </div>
            }
          >
            {/* La sección vieja se desvanece; luego entra la nueva (título, frase y tarjetas en cascada). */}
            <AnimatePresence mode="wait" initial={true} onExitComplete={scrollToTop}>
              <Page key={pathname} pathname={pathname} />
            </AnimatePresence>
          </Suspense>
        </main>
      </div>
      {showChatWidget && <ChatWidget />}
      <DbErrorToast />
      <ToastHost />
    </div>
  );
}
