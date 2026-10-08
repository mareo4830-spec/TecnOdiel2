import React from 'react';
import { SECTORS, AMBIENTES } from './formConfig';

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-[#6DD94B] focus:bg-white/[0.07]';

export default function StepNegocio({ form, set }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Hablemos de tu negocio</h1>
        <p className="mt-2 text-sm text-zinc-400">Dos minutos y te decimos justo lo que necesitas.</p>
      </div>

      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-400">Nombre del negocio</span>
        <input
          value={form.businessName}
          onChange={(e) => set('businessName', e.target.value)}
          placeholder="Barbería Mi Negocio"
          className={inputClass}
          autoFocus
        />
      </label>

      <div>
        <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-400">Sector</span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SECTORS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => set('sector', s.id)}
              className={`rounded-xl border px-3 py-3 text-left text-sm font-medium transition ${
                form.sector === s.id ? 'border-[#6DD94B] bg-[#6DD94B]/10 text-[#6DD94B]' : 'border-white/10 bg-white/5 text-zinc-300 hover:border-white/25'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-400">¿Qué ambiente tiene tu negocio?</span>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {AMBIENTES.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => set('ambiente', a.id)}
              className={`rounded-xl border px-4 py-3 text-left transition ${
                form.ambiente === a.id ? 'border-[#6DD94B] bg-[#6DD94B]/10' : 'border-white/10 bg-white/5 hover:border-white/25'
              }`}
            >
              <span className={`block text-sm font-semibold ${form.ambiente === a.id ? 'text-[#6DD94B]' : 'text-white'}`}>{a.label}</span>
              <span className="mt-0.5 block text-xs text-zinc-500">{a.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
