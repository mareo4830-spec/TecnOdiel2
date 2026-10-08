import { useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { Brand } from '../../components/Brand';
import { APP_CONFIG } from '../../lib/config';
import { useAuth } from './authContext';

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.7 4.1-5.5 4.1a6.2 6.2 0 1 1 0-12.4c2 0 3.3.9 4.1 1.6l2.8-2.7A10 10 0 0 0 12 2a10 10 0 1 0 0 20c5.8 0 9.6-4 9.6-9.8 0-.7-.1-1.2-.2-1.9z" />
    </svg>
  );
}

export function LoginPage() {
  const { signInWithGoogle, error: authError } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setSubmitting(true);
    setError(null);
    const err = await signInWithGoogle();
    if (err) {
      setError(err);
      setSubmitting(false);
    }
  };

  const shownError = error ?? authError;

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-gray-950 px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-600/25 to-purple-600/25 blur-3xl"
      />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Brand size="lg" />
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-6 shadow-2xl shadow-black/40 backdrop-blur sm:p-8">
          <h1 className="text-xl font-semibold text-white">Accede a tu oficina</h1>
          <p className="mt-1 text-sm text-gray-400">
            Panel interno para los socios de la agencia · {APP_CONFIG.location}
          </p>

          {shownError && (
            <p role="alert" className="mt-5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              {shownError}
            </p>
          )}

          <button
            onClick={() => void handleClick()}
            disabled={submitting}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-gray-700 bg-white py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-100 disabled:opacity-60"
          >
            {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <GoogleLogo />}
            Entrar con Google
          </button>
        </div>
      </div>
    </div>
  );
}
