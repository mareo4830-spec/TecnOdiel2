import { Building2, Palette, UserRound, type LucideIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { Avatar } from '../../components/ui/Avatar';
import { toast } from '../../components/ui/Toast';
import { ACCENTS, setAccent, useAccent } from '../../lib/accent';
import { APP_CONFIG } from '../../lib/config';
import { useAuth } from '../auth/authContext';

type Section = 'perfil' | 'agencia' | 'apariencia';

const SECTIONS: { id: Section; label: string; icon: LucideIcon }[] = [
  { id: 'perfil', label: 'Perfil', icon: UserRound },
  { id: 'agencia', label: 'Agencia y conexión', icon: Building2 },
  { id: 'apariencia', label: 'Apariencia', icon: Palette },
];

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-gray-800 py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <dt className="text-sm text-gray-400">{label}</dt>
      <dd className="text-sm font-medium text-white">{value}</dd>
    </div>
  );
}

/** Ajustes estilo Fernly: submenú a la izquierda y panel a la derecha. */
export function SettingsPage() {
  const { partner, mode } = useAuth();
  const accent = useAccent();
  const [section, setSection] = useState<Section>('perfil');
  if (!partner) return null;

  return (
    <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-[220px_1fr]">
      <nav className="card h-fit p-2" aria-label="Secciones de ajustes">
        <ul className="flex gap-1 overflow-x-auto md:flex-col">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <li key={id} className="shrink-0">
              <button
                onClick={() => setSection(id)}
                aria-current={section === id ? 'page' : undefined}
                className={`relative flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                  section === id ? 'text-indigo-700' : 'text-gray-400 hover:text-white'
                }`}
              >
                {section === id && (
                  <motion.span layoutId="settings-active" className="absolute inset-0 rounded-xl bg-indigo-50" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />
                )}
                <Icon className="relative h-4 w-4" />
                <span className="relative">{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="card min-h-80 p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={section}
            initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {section === 'perfil' && (
              <>
                <h2 className="text-lg font-bold text-white">Perfil</h2>
                <p className="mt-1 text-sm text-gray-400">Así te ven el resto de socios en la oficina.</p>
                <div className="mt-5 flex items-center gap-4">
                  <Avatar partner={partner} size="lg" />
                  <div>
                    <p className="font-semibold text-white">{partner.name}</p>
                    <p className="text-sm text-gray-400">{partner.email}</p>
                  </div>
                </div>
                <dl className="mt-4">
                  <Row label="Nombre" value={partner.name} />
                  <Row label="Email" value={partner.email} />
                  <Row label="Disponibilidad" value={partner.availability} />
                </dl>
              </>
            )}

            {section === 'agencia' && (
              <>
                <h2 className="text-lg font-bold text-white">Agencia y conexión</h2>
                <p className="mt-1 text-sm text-gray-400">
                  Nombre y logo se configuran en <code className="text-gray-300">src/lib/config.ts</code>.
                </p>
                <dl className="mt-4">
                  <Row label="Nombre" value={APP_CONFIG.name} />
                  <Row label="Ubicación" value={APP_CONFIG.location} />
                  <Row label="Datos" value={mode === 'supabase' ? 'Supabase (en tiempo real)' : 'Local (sin Supabase, en memoria)'} />
                  <Row label="Autenticación" value={mode === 'supabase' ? 'Google' : 'Selector de socio'} />
                </dl>
              </>
            )}

            {section === 'apariencia' && (
              <>
                <h2 className="text-lg font-bold text-white">Apariencia</h2>
                <p className="mt-1 text-sm text-gray-400">El acento retiñe toda la oficina y se recuerda en este dispositivo.</p>
                <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Acento</p>
                <div role="radiogroup" aria-label="Color de acento" className="mt-3 flex flex-wrap gap-2">
                  {ACCENTS.map((a) => {
                    const active = accent === a.id;
                    return (
                      <motion.button
                        key={a.id}
                        role="radio"
                        aria-checked={active}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (active) return;
                          setAccent(a.id);
                          toast(`Acento: ${a.label}`);
                        }}
                        className={`relative inline-flex items-center gap-2.5 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                          active ? 'border-transparent text-white' : 'border-gray-700 text-gray-300 hover:border-gray-600'
                        }`}
                      >
                        {/* El marco de selección se desliza hasta el acento elegido. */}
                        {active && (
                          <motion.span
                            layoutId="accent-ring"
                            className="absolute -inset-px rounded-xl border-2 border-indigo-600 ring-4 ring-indigo-100"
                            transition={{ type: 'spring', stiffness: 450, damping: 34 }}
                          />
                        )}
                        <motion.span
                          className="relative h-6 w-6 rounded-lg shadow-inner"
                          style={{ background: a.swatch }}
                          animate={{ scale: active ? 1.12 : 1, rotate: active ? -6 : 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                        />
                        <span className="relative">{a.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
