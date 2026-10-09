import React from 'react';

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-[#6DD94B] focus:bg-white/[0.07]';

export default function StepContacto({ form, set, account }) {
  const signedIn = account.role === 'client' || account.role === 'admin';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">¿Cómo te contactamos?</h1>
        <p className="mt-2 text-sm text-zinc-400">Solo para enviarte la propuesta. Nada de spam.</p>
      </div>

      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-400">Tu nombre</span>
        <input value={form.contactName} onChange={(e) => set('contactName', e.target.value)} placeholder="Tu nombre" className={inputClass} />
      </label>

      <label className="block">
        <div className="flex items-center justify-between mb-2">
          <span className="block text-xs font-semibold uppercase tracking-wide text-zinc-400">Teléfono</span>
          <span className="text-[11px] text-zinc-500 font-mono">
            {form.phone ? `${form.phone.length}/9 dígitos` : 'Solo 9 números'}
          </span>
        </div>
        <input 
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={9}
          value={form.phone} 
          onChange={(e) => {
            const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 9);
            set('phone', digitsOnly);
          }} 
          placeholder="612345678" 
          className={inputClass} 
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-400">Email</span>
        <input
          type="email"
          value={form.email}
          onChange={(e) => set('email', e.target.value)}
          placeholder="tu@email.com"
          disabled={signedIn}
          className={`${inputClass} ${signedIn ? 'opacity-70' : ''}`}
        />
      </label>

      {!signedIn && (
        <p className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-xs text-amber-200">
          Para enviar tu solicitud te pediremos entrar con Google en el último paso — solo para confirmar que eres tú.
        </p>
      )}
    </div>
  );
}
