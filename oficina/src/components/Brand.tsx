import { Sprout } from 'lucide-react';
import { APP_CONFIG } from '../lib/config';

const SIZES = {
  md: { box: 'h-8 w-8', icon: 'h-4.5 w-4.5', text: 'text-[17px]' },
  lg: { box: 'h-12 w-12', icon: 'h-7 w-7', text: 'text-3xl' },
} as const;

/** Logo: brote dentro de una caja redondeada del color de acento + nombre. */
export function Brand({ size = 'md' }: { size?: keyof typeof SIZES }) {
  const s = SIZES[size];
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      {APP_CONFIG.logoUrl ? (
        <img src={APP_CONFIG.logoUrl} alt="" className={`${s.box} rounded-xl object-contain`} />
      ) : (
        <span className={`${s.box} on-accent grid shrink-0 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm`}>
          <Sprout className={s.icon} strokeWidth={2.4} aria-hidden />
        </span>
      )}
      <span className={`${s.text} truncate font-bold tracking-tight text-white`}>{APP_CONFIG.name}</span>
    </div>
  );
}
