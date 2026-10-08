import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { LayoutDashboard, LogOut, User, Users, X } from 'lucide-react';
import { APP_URLS } from '../../config/apps.js';

/* Botón de acceso rápido según el rol: cliente → su portal, admin → la oficina virtual. */
export function roleLink(account) {
  if (account.role === 'admin') return { href: APP_URLS.oficina, label: 'Oficina virtual', Icon: LayoutDashboard };
  if (account.role === 'client') return { href: APP_URLS.portal, label: 'Mi portal de cliente', Icon: Users };
  return null;
}

export function RoleButton({ account, className = '' }) {
  const link = roleLink(account);
  if (!link) return null;
  const { href, label, Icon } = link;
  return (
    <a href={href} className={`flex items-center gap-2 rounded-full bg-[#6DD94B]/10 px-3.5 py-1.5 text-xs font-semibold text-[#6DD94B] ring-1 ring-[#6DD94B]/40 transition hover:bg-[#6DD94B] hover:text-black ${className}`}>
      <Icon className="h-4 w-4" />{label}
    </a>
  );
}

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.7 4.1-5.5 4.1a6.2 6.2 0 1 1 0-12.4c2 0 3.3.9 4.1 1.6l2.8-2.7A10 10 0 0 0 12 2a10 10 0 1 0 0 20c5.8 0 9.6-4 9.6-9.8 0-.7-.1-1.2-.2-1.9z" />
    </svg>
  );
}

function LoginModal({ onClose, onGoogle }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 px-4 backdrop-blur-sm" onClick={onClose} role="presentation">
      <div role="dialog" aria-modal="true" aria-labelledby="login-title" onClick={(e) => e.stopPropagation()} className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-[#161616] p-7 text-center shadow-2xl">
        <button onClick={onClose} aria-label="Cerrar" className="absolute right-4 top-4 rounded-full p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white cursor-pointer"><X className="h-5 w-5" /></button>
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#6DD94B]/15 text-[#6DD94B]"><User className="h-6 w-6" /></div>
        <h2 id="login-title" className="mt-4 text-xl font-bold text-white">Inicia sesión</h2>
        <p className="mt-1.5 text-sm text-zinc-400">Accede a tu cuenta de TecnOdiel con Google.</p>
        <button onClick={onGoogle} className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-white py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200 cursor-pointer">
          <GoogleLogo />Continuar con Google
        </button>
      </div>
    </div>,
    document.body,
  );
}

/* Círculo de perfil: sin sesión abre el popup de Google; con sesión, un desplegable con la cuenta y "Cerrar sesión". */
export function ProfileButton({ account }) {
  const { role, profile, signIn, signOut, enabled } = account;
  const [menu, setMenu] = useState(false);
  const [login, setLogin] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!menu) return undefined;
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setMenu(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [menu]);

  if (!enabled || role === 'loading') return null;
  const signedIn = role !== 'guest';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => (signedIn ? setMenu((m) => !m) : setLogin(true))}
        aria-label={signedIn ? 'Mi cuenta' : 'Iniciar sesión'}
        aria-expanded={signedIn ? menu : undefined}
        className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-white/20 bg-white/5 text-sm font-bold text-white transition hover:border-[#6DD94B] hover:text-[#6DD94B] cursor-pointer"
      >
        {signedIn && profile?.avatar
          ? <img src={profile.avatar} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
          : signedIn ? (profile?.name || '?').charAt(0).toUpperCase() : <User className="h-5 w-5" />}
      </button>

      {menu && signedIn && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-white/10 bg-[#161616] p-2 shadow-2xl">
          <div className="px-3 py-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Mi cuenta</p>
            <p className="mt-1 truncate text-sm font-semibold text-white">{profile?.name}</p>
            <p className="truncate text-xs text-zinc-400">{profile?.email}</p>
          </div>
          <button onClick={() => { setMenu(false); signOut(); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-zinc-200 transition hover:bg-white/5 cursor-pointer">
            <LogOut className="h-4 w-4" />Cerrar sesión
          </button>
        </div>
      )}

      {login && <LoginModal onClose={() => setLogin(false)} onGoogle={() => { setLogin(false); signIn(); }} />}
    </div>
  );
}
