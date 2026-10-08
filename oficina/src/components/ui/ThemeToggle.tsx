import { Moon, Sun } from 'lucide-react';
import { setTheme, useTheme } from '../../lib/theme';

/** Interruptor claro/oscuro: los dos iconos giran y se intercambian; el tema se revela en círculo. */
export function ThemeToggle() {
  const theme = useTheme();
  const dark = theme === 'dark';

  return (
    <button
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setTheme(dark ? 'light' : 'dark', { x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
      aria-label={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={dark ? 'Modo claro' : 'Modo oscuro'}
      className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white"
    >
      <Sun
        className={`absolute h-5 w-5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          dark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
        }`}
      />
      <Moon
        className={`absolute h-5 w-5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          dark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
        }`}
      />
    </button>
  );
}
