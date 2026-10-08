import { ChevronDown, LogOut, Settings } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/authContext';
import { usePresence } from '../../features/team/useTeam';
import { useClickOutside } from '../../hooks/useClickOutside';
import { Avatar } from '../ui/Avatar';
import { StatusLabel } from '../ui/StatusDot';

export function ProfileMenu() {
  const { partner, mode, signOut } = useAuth();
  const presence = usePresence();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const ref = useClickOutside<HTMLDivElement>(close, open);

  if (!partner) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Menú de perfil"
        aria-expanded={open}
        className="flex items-center gap-1 rounded-xl p-1 transition hover:bg-gray-800"
      >
        <Avatar partner={partner} size="sm" />
        <ChevronDown className="hidden h-4 w-4 text-gray-500 sm:block" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl shadow-black/50">
          <div className="flex items-center gap-3 border-b border-gray-800 p-4">
            <Avatar partner={partner} size="md" status={presence[partner.id]} />
            <div className="min-w-0">
              <p className="truncate font-medium text-white">{partner.name}</p>
              <p className="truncate text-xs text-gray-500">{partner.email}</p>
              <div className="mt-1">
                <StatusLabel status={presence[partner.id]} />
              </div>
            </div>
          </div>
          <div className="p-2">
            <Link
              to="/ajustes"
              onClick={close}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <Settings className="h-4 w-4" />
              Ajustes
            </Link>
            {mode === 'supabase' && (
              <button
                onClick={() => void signOut()}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-300 hover:bg-rose-500/10"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
