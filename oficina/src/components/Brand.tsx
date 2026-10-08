import { APP_CONFIG } from '../lib/config';

const SIZES = {
  sm: { box: 'h-6 w-6 rounded-md text-[10px]', text: 'text-sm', gap: 'gap-2' },
  md: { box: 'h-9 w-9 rounded-xl text-sm', text: 'text-lg', gap: 'gap-3' },
  lg: { box: 'h-12 w-12 rounded-xl text-base', text: 'text-2xl', gap: 'gap-3' },
} as const;

export function Brand({ size = 'md' }: { size?: keyof typeof SIZES }) {
  const s = SIZES[size];
  return (
    <div className={`flex items-center ${s.gap}`}>
      {APP_CONFIG.logoUrl ? (
        <img src={APP_CONFIG.logoUrl} alt="" className={`${s.box} object-contain`} />
      ) : (
        <span
          className={`${s.box} grid place-items-center bg-gradient-to-br from-indigo-500 to-purple-600 font-bold text-white`}
        >
          {APP_CONFIG.shortName}
        </span>
      )}
      <span className={`${s.text} font-semibold tracking-tight text-white`}>{APP_CONFIG.name}</span>
    </div>
  );
}
