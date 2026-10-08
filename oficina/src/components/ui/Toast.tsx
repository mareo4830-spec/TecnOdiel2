import { CheckCircle2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { createStore, useStore } from '../../lib/store';

/** Aviso breve tras una acción ("Proyecto añadido", "Acento: Océano"), centrado abajo. */
const toastStore = createStore<{ id: number; text: string } | null>(null);
let timer: number | undefined;

export function toast(text: string): void {
  window.clearTimeout(timer);
  toastStore.set(() => ({ id: Date.now(), text }));
  timer = window.setTimeout(() => toastStore.set(() => null), 2400);
}

export function ToastHost() {
  const current = useStore(toastStore);
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center px-4" aria-live="polite">
      <AnimatePresence>
        {current && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="on-accent inline-flex items-center gap-2 rounded-full bg-indigo-800 px-4 py-2 text-sm font-medium text-white shadow-xl shadow-black/20"
          >
            <CheckCircle2 className="h-4 w-4 text-indigo-100" />
            {current.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
