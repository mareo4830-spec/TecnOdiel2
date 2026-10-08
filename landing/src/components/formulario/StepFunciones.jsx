import React from 'react';
import { Check } from 'lucide-react';
import { FEATURES } from './formConfig';
import { computeOurPrice } from './pricing';

export default function StepFunciones({ form, set }) {
  const toggle = (id) => {
    set('features', (list) => (list.includes(id) ? list.filter((f) => f !== id) : [...list, id]));
  };
  const price = computeOurPrice(form.features);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">¿Qué quieres que tenga tu web?</h1>
        <p className="mt-2 text-sm text-zinc-400">Elige todo lo que quieras: el precio se ajusta solo, en vivo.</p>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {FEATURES.map(({ id, label, desc, icon: Icon }) => {
          const active = form.features.includes(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggle(id)}
              className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${
                active ? 'border-[#6DD94B] bg-[#6DD94B]/10' : 'border-white/10 bg-white/5 hover:border-white/25'
              }`}
            >
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${active ? 'bg-[#6DD94B] text-black' : 'bg-white/10 text-zinc-400'}`}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
                  {label}
                  {active && <Check className="h-3.5 w-3.5 text-[#6DD94B]" />}
                </span>
                <span className="mt-0.5 block text-xs text-zinc-500">{desc}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="sticky bottom-24 rounded-xl border border-[#6DD94B]/30 bg-black/80 px-4 py-3 text-center backdrop-blur">
        <span className="text-xs uppercase tracking-wide text-zinc-500">Precio estimado</span>
        <p className="text-2xl font-black text-[#6DD94B]">{price} €</p>
      </div>
    </div>
  );
}
