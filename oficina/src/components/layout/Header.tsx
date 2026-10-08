import { Globe, Mail, Menu } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/authContext';
import { useClientUnreadTotal } from '../../features/chats/clientChatService';
import { GlobalSearch } from './GlobalSearch';
import { NotificationsMenu } from './NotificationsMenu';
import { ProfileMenu } from './ProfileMenu';

/** Barra superior estilo Fernly: buscador ⌘K a la izquierda; mensajes, avisos y perfil a la derecha. */
export function Header({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { partner } = useAuth();
  const unread = useClientUnreadTotal();

  return (
    <header className="sticky top-0 z-20 bg-gray-950/80 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-3 px-4 py-4 sm:px-6 lg:px-8"
      >
        <button
          onClick={onOpenMenu}
          aria-label="Abrir menú"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gray-900 text-gray-400 shadow-sm hover:text-white lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1 sm:max-w-md">
          <GlobalSearch />
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <a
            href="/"
            aria-label="Ir a la página principal de TecnOdiel"
            title="Ir a la página principal"
            className="hidden h-10 shrink-0 items-center gap-2 rounded-full border border-gray-700 px-3 text-sm font-medium text-gray-300 transition hover:border-indigo-500 hover:text-white sm:inline-flex"
          >
            <Globe className="h-4 w-4" />
            Landing
          </a>
          <Link
            to="/chats"
            aria-label={`Chats${unread ? ` (${unread} sin leer)` : ''}`}
            className="relative grid h-10 w-10 place-items-center rounded-full text-gray-400 transition hover:bg-gray-900 hover:text-white"
          >
            <Mail className="h-[18px] w-[18px]" />
            {unread > 0 && <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-gray-950" />}
          </Link>
          <NotificationsMenu />
          {partner && <ProfileMenu />}
        </div>
      </motion.div>
    </header>
  );
}
