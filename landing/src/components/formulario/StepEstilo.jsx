import React from 'react';
import { Check } from 'lucide-react';
import { ACCENT_PALETTE, LAYOUT_FAMILIES, variantsOf } from './layoutSwatches';

/** Tarjeta-boceto: líneas = texto, bloque de color = botón. Igual que el asistente de tenants. */
function LayoutSwatch({ variant, accentOverride, active, onClick }) {
  const accent = accentOverride || variant.accent;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group overflow-hidden rounded-xl border text-left transition ${
        active ? 'border-[#6DD94B] ring-2 ring-[#6DD94B]/40' : 'border-white/10 hover:border-white/30'
      }`}
    >
      <div className="relative flex h-20 flex-col justify-center gap-1.5 p-3" style={{ background: variant.surface }}>
        <span className="h-1.5 w-3/4 rounded-full opacity-70" style={{ background: variant.text }} />
        <span className="h-1.5 w-1/2 rounded-full opacity-45" style={{ background: variant.text }} />
        <span className="mt-1.5 h-2 w-9 rounded-full" style={{ background: accent, borderRadius: variant.radius === '0' ? '2px' : variant.radius }} />
        {active && (
          <span className="absolute right-2 top-2 grid h-4 w-4 place-items-center rounded-full bg-[#6DD94B] text-black">
            <Check className="h-2.5 w-2.5" strokeWidth={3} />
          </span>
        )}
      </div>
      <div className="bg-white/5 px-2.5 py-1.5">
        <p className="truncate text-xs font-semibold text-white">{variant.name}</p>
        <p className="truncate text-[10px] text-zinc-500">{variant.description}</p>
      </div>
    </button>
  );
}

export default function StepEstilo({ form, set }) {
  const variants = form.layoutFamily ? variantsOf(form.layoutFamily) : [];

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Elige el estilo que más te represente</h1>
        <p className="mt-2 text-sm text-zinc-400">Te hemos preseleccionado una familia según el ambiente que dijiste; cámbiala si quieres.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {LAYOUT_FAMILIES.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => set('layoutFamily', f.id)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
              form.layoutFamily === f.id ? 'border-[#6DD94B] bg-[#6DD94B]/10 text-[#6DD94B]' : 'border-white/10 text-zinc-400 hover:border-white/25'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {variants.map((v) => (
          <LayoutSwatch
            key={v.key}
            variant={v}
            accentOverride={form.accentOverride}
            active={form.layoutVariant === v.key}
            onClick={() => set('layoutVariant', v.key)}
          />
        ))}
      </div>

      <div>
        <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-400">O prueba otro color de acento</span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => set('accentOverride', '')}
            className={`h-9 rounded-full border px-3 text-xs font-medium transition ${
              !form.accentOverride ? 'border-[#6DD94B] text-[#6DD94B]' : 'border-white/10 text-zinc-500 hover:border-white/25'
            }`}
          >
            Original
          </button>
          {ACCENT_PALETTE.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`Acento ${c}`}
              onClick={() => set('accentOverride', c)}
              style={{ background: c }}
              className={`h-9 w-9 rounded-full border-2 transition ${form.accentOverride === c ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
