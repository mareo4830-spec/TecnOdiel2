import { LogOut, X } from 'lucide-react';
import { AnimatePresence, motion, type Variants } from 'motion/react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../../lib/navigation';
import { useAuth } from '../../features/auth/authContext';
import { useUnreadCount } from '../../features/chat/chatService';
import { useClientUnreadTotal } from '../../features/chats/clientChatService';
import { TimeTracker } from '../../features/checkin/TimeTracker';
import { Brand } from '../Brand';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const GENERAL = new Set(['/ajustes']);

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `group relative flex h-9 items-center gap-3 rounded-lg pl-4 pr-2 text-[13.5px] font-medium transition-colors duration-300 ${
    isActive ? 'text-white' : 'text-gray-400 hover:text-white'
  }`;

// Al abrir la oficina, logo, rótulos y secciones entran uno tras otro desde la izquierda.
const list: Variants = { show: { transition: { staggerChildren: 0.045, delayChildren: 0.1 } } };
const entry: Variants = {
  hidden: { opacity: 0, x: -14, filter: 'blur(4px)' },
  show: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};
const spring = { type: 'spring', stiffness: 420, damping: 34, mass: 0.8 } as const;

/** Menú lateral estilo Fernly: MENÚ y GENERAL, barra de acento en la sección activa y tarjeta de jornada abajo. */
export function Sidebar({ open, onClose }: SidebarProps) {
  const { partner, signOut } = useAuth();
  const clientUnread = useClientUnreadTotal();
  const teamUnread = useUnreadCount(partner?.id);
  const badges: Record<string, number> = { '/chats': clientUnread + teamUnread };
  // Fondo suave que se desliza bajo el cursor de una sección a otra.
  const [hovered, setHovered] = useState<string | null>(null);

  if (!partner) return null;

  const renderItem = (item: { path: string; label: string; icon: (typeof NAV_ITEMS)[number]['icon'] }, onClick?: () => void) => {
    const Icon = item.icon;
    const content = (isActive: boolean) => (
      <>
        <AnimatePresence>
          {hovered === item.path && (
            <motion.span
              layoutId="nav-hover"
              className="absolute inset-0 rounded-lg bg-gray-800/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={spring}
            />
          )}
        </AnimatePresence>
        {isActive && (
          // La barra de acento viaja hasta la sección nueva con un muelle (y se estira al moverse).
          <motion.span layoutId="nav-active" className="absolute -left-3 top-1.5 bottom-1.5 w-1 rounded-r-full bg-indigo-600" transition={spring} />
        )}
        <motion.span
          className="relative flex min-w-0 flex-1 items-center gap-3"
          animate={{ x: isActive ? 3 : 0 }}
          transition={spring}
        >
          <Icon
            className={`h-[18px] w-[18px] shrink-0 transition-[color,transform] duration-300 group-hover:scale-110 group-active:scale-95 ${
              isActive ? 'text-indigo-600' : ''
            }`}
          />
          <span className={`truncate transition-[font-weight] ${isActive ? 'font-semibold' : ''}`}>{item.label}</span>
          <AnimatePresence>
            {badges[item.path] > 0 && (
              <motion.span
                key={badges[item.path]}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.4, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 600, damping: 22 }}
                className="on-accent ml-auto grid h-5 min-w-5 place-items-center rounded-md bg-indigo-700 px-1 text-[10px] font-bold text-white"
              >
                {badges[item.path] > 9 ? '9+' : badges[item.path]}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.span>
      </>
    );
    return (
      <motion.li key={item.path} variants={entry} onMouseEnter={() => setHovered(item.path)}>
        {onClick ? (
          <button onClick={onClick} className={`${linkClass({ isActive: false })} w-full`}>
            {content(false)}
          </button>
        ) : (
          <NavLink to={item.path} end={item.path === '/'} className={linkClass}>
            {({ isActive }) => content(isActive)}
          </NavLink>
        )}
      </motion.li>
    );
  };

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-black/30 backdrop-blur-sm transition-opacity lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-gray-900 transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:h-dvh lg:w-56 lg:shrink-0 lg:translate-x-0 lg:bg-transparent ${
          open ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <motion.div variants={entry} initial="hidden" animate="show" className="flex items-center justify-between px-5 pb-4 pt-6">
          <Brand />
          <button onClick={onClose} aria-label="Cerrar menú" className="rounded-md p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white lg:hidden">
            <X className="h-4 w-4" />
          </button>
        </motion.div>

        <motion.nav
          variants={list}
          initial="hidden"
          animate="show"
          onMouseLeave={() => setHovered(null)}
          className="flex-1 overflow-y-auto px-3"
          aria-label="Navegación principal"
        >
          <motion.p variants={entry} className="px-4 pb-2 pt-3 text-[11px] font-medium uppercase tracking-wider text-gray-500">
            Menú
          </motion.p>
          <ul className="space-y-0.5">{NAV_ITEMS.filter((i) => !GENERAL.has(i.path)).map((i) => renderItem(i))}</ul>

          <motion.p variants={entry} className="px-4 pb-2 pt-6 text-[11px] font-medium uppercase tracking-wider text-gray-500">
            General
          </motion.p>
          <ul className="space-y-0.5">
            {NAV_ITEMS.filter((i) => GENERAL.has(i.path)).map((i) => renderItem(i))}
            {renderItem({ path: '#salir', label: 'Cerrar sesión', icon: LogOut }, () => void signOut())}
          </ul>
        </motion.nav>

        <motion.div
          className="p-3"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <TimeTracker compact />
        </motion.div>
      </aside>
    </>
  );
}
