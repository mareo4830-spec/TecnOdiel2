import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, TrendingUp } from 'lucide-react';
import { FEATURES } from './formConfig';
import { computeOurPrice } from './pricing';

function AnimatedPriceCounter({ targetPrice }) {
  const [currentValue, setCurrentValue] = useState(targetPrice);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    if (targetPrice === currentValue) return;

    setIsChanging(true);
    const start = currentValue;
    const end = targetPrice;
    const duration = 500; // ms
    const startTime = performance.now();
    let rafId;

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const nextVal = Math.round(start + (end - start) * ease);
      setCurrentValue(nextVal);

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setIsChanging(false), 200);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [targetPrice]);

  return (
    <motion.div
      key={targetPrice}
      initial={{ scale: 1.12, y: 3 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className="inline-flex items-baseline gap-1"
    >
      <span className={`text-3xl sm:text-4xl font-black tracking-tight transition-colors duration-300 ${isChanging ? 'text-white' : 'text-[#6DD94B]'}`}>
        {currentValue.toLocaleString('es-ES')}
      </span>
      <span className="text-xl sm:text-2xl font-bold text-[#6DD94B]">€</span>
    </motion.div>
  );
}

export default function StepFunciones({ form, set }) {
  const toggle = (id) => {
    set('features', (list) => (list.includes(id) ? list.filter((f) => f !== id) : [...list, id]));
  };
  const price = computeOurPrice(form.features);
  const selectedCount = form.features.length;

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
              className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200 active:scale-[0.99] cursor-pointer ${
                active 
                  ? 'border-[#6DD94B] bg-[#6DD94B]/10 shadow-[0_0_15px_rgba(109,217,75,0.15)]' 
                  : 'border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/[0.08]'
              }`}
            >
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-colors ${active ? 'bg-[#6DD94B] text-black shadow-sm' : 'bg-white/10 text-zinc-400'}`}>
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

      {/* Caja de precio situada abajo, sin solapar las opciones, con animación fluida de subida */}
      <div className="mt-8 rounded-2xl border border-[#6DD94B]/30 bg-gradient-to-b from-[#141414] to-[#0c0c0c] p-5 shadow-2xl text-center">
        <div className="flex items-center justify-center gap-2 mb-1.5">
          <span className="h-2 w-2 rounded-full bg-[#6DD94B] animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            Precio estimado en vivo
          </span>
          <span className="text-xs font-semibold text-zinc-500">
            ({selectedCount} {selectedCount === 1 ? 'función' : 'funciones'})
          </span>
        </div>

        <div className="py-1">
          <AnimatedPriceCounter targetPrice={price} />
        </div>

        <p className="mt-1 text-xs text-zinc-400 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#6DD94B]" />
          <span>Ajuste instantáneo en tiempo real • Sin costes ocultos</span>
        </p>
      </div>
    </div>
  );
}
