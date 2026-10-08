import { Bell, CheckCheck } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../features/notifications/useNotifications';
import { useClickOutside } from '../../hooks/useClickOutside';
import { formatRelative } from '../../lib/format';

export function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const ref = useClickOutside<HTMLDivElement>(close, open);
  const { items, unreadCount, markAllRead } = useNotifications();
  const navigate = useNavigate();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notificaciones${unreadCount ? ` (${unreadCount} sin leer)` : ''}`}
        aria-expanded={open}
        className="relative grid h-10 w-10 place-items-center rounded-xl text-gray-400 transition hover:bg-gray-800 hover:text-white"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-gray-950 bg-rose-500" />
        )}
      </button>

      {open && (
        <div className="fixed inset-x-4 top-16 z-50 overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl shadow-black/50 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80">
          <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
            <p className="font-semibold text-white">Notificaciones</p>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Marcar como leídas
              </button>
            )}
          </div>
          <ul className="max-h-80 divide-y divide-gray-800 overflow-y-auto">
            {items.length === 0 && <li className="px-4 py-6 text-center text-sm text-gray-500">Todo al día: nada pendiente</li>}
            {items.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => {
                    setOpen(false);
                    if (n.to) navigate(n.to);
                  }}
                  className="flex w-full gap-3 px-4 py-3 text-left hover:bg-gray-800/60"
                >
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? 'bg-transparent' : 'bg-indigo-400'}`}
                  />
                  <span className="block min-w-0">
                    <span className="block text-sm font-medium text-gray-100">{n.title}</span>
                    <span className="mt-0.5 line-clamp-2 block text-sm text-gray-400">{n.body}</span>
                    <span className="mt-1 block text-xs text-gray-500">{formatRelative(n.createdAt)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
