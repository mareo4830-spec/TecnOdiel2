import { Check } from 'lucide-react';
import { useToasts } from '../../lib/toast';

export function ToastHost() {
  const toasts = useToasts();
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex flex-col items-center gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="anim-toast flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-xl shadow-black/30"
        >
          <Check className="h-4 w-4" />
          {t.message}
        </div>
      ))}
    </div>
  );
}
