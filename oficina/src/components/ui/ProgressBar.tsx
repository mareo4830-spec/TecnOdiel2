export function ProgressBar({ value, showLabel = true }: { value: number; showLabel?: boolean }) {
  const pct = Math.min(100, Math.max(0, Math.round(value)));
  return (
    <div className="flex items-center gap-3">
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-800"
      >
        <div
          className="anim-bar h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className={`w-9 text-right text-xs font-semibold tabular-nums ${pct === 100 ? 'text-emerald-400' : 'text-indigo-300'}`}>
          {pct}%
        </span>
      )}
    </div>
  );
}
