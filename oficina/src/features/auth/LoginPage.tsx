import { motion } from 'motion/react';
import { Brand } from '../../components/Brand';
import { Avatar } from '../../components/ui/Avatar';
import { APP_CONFIG } from '../../lib/config';
import { MOCK_PARTNERS } from '../../lib/partners';
import { useAuth } from './authContext';

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.4-1.7 4.1-5.5 4.1a6.2 6.2 0 1 1 0-12.4c2 0 3.3.9 4.1 1.6l2.8-2.7A10 10 0 0 0 12 2a10 10 0 1 0 0 20c5.8 0 9.6-4 9.6-9.8 0-.7-.1-1.2-.2-1.9z"
      />
    </svg>
  );
}

export function LoginPage() {
  const { mode, signInWithGoogle, signInDemo, error: authError } = useAuth();

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-indigo-500/15 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="mb-8 flex justify-center">
          <Brand size="lg" />
        </div>

        <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6 shadow-2xl shadow-black/60 backdrop-blur sm:p-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
            Solo socios // {APP_CONFIG.location}
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">Accede a tu oficina</h1>
          <p className="mt-3 text-sm text-gray-400">Panel interno para los socios de la agencia.</p>

          {authError && (
            <p role="alert" className="mt-5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              {authError}
            </p>
          )}

          {mode === 'supabase' ? (
            <button
              onClick={() => void signInWithGoogle()}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-white py-3 text-sm font-semibold text-gray-900 shadow-lg transition hover:bg-gray-100"
            >
              <GoogleLogo />
              Continuar con Google
            </button>
          ) : (
            <div className="mt-6">
              <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                Modo local: Supabase no está configurado. Elige un socio para entrar; lo que registres se guarda solo en esta pestaña.
              </p>
              <div className="mt-4 grid gap-2">
                {MOCK_PARTNERS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => signInDemo(p.id)}
                    className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-800/50 px-4 py-3 text-left transition hover:border-indigo-500/60 hover:bg-gray-800"
                  >
                    <Avatar partner={p} size="md" />
                    <div>
                      <p className="font-medium text-white">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.availability}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
