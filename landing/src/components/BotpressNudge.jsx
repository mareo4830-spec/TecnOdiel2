import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/*
 * Globo de texto que sale cada cierto tiempo encima del icono del chatbot de Botpress (abajo a la
 * derecha) para invitar a usarlo. Al pulsarlo abre el chat; la X lo cierra y deja de aparecer
 * durante esa visita.
 */
const MESSAGES = [
  '¡Oye! Resuelvo tus dudas al instante 👋',
  'Digitaliza tu negocio con nosotros 🚀',
  '¿Quieres tu web? Pregúntame precios y plazos',
  '¿Dudas? Te respondo en segundos',
  'Tu negocio online en pocos días. ¡Cuéntame!',
];

const FIRST_DELAY = 8000; // primera aparición
const EVERY = 30000; // cada cuánto vuelve a salir
const VISIBLE_FOR = 7000; // cuánto se queda

function openChat() {
  if (typeof window === 'undefined') return;
  const bp = window.botpress;
  if (bp && typeof bp.open === 'function') { bp.open(); return; }
  if (window.botpressWebChat?.sendEvent) { window.botpressWebChat.sendEvent({ type: 'show' }); return; }
  // Sin API: pulsa el icono que pinta el propio widget.
  document.querySelector('.bpFab, #bp-web-widget, [class*="bpFab"]')?.click();
}

export default function BotpressNudge() {
  const [index, setIndex] = useState(-1);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return undefined;
    let n = 0;
    let hideTimer;
    const show = () => {
      setIndex(n % MESSAGES.length);
      n += 1;
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => setIndex(-1), VISIBLE_FOR);
    };
    const first = setTimeout(show, FIRST_DELAY);
    const loop = setInterval(show, EVERY);
    return () => { clearTimeout(first); clearInterval(loop); clearTimeout(hideTimer); };
  }, [dismissed]);

  return (
    <div className="pointer-events-none fixed bottom-24 right-5 z-[9998] sm:bottom-28 sm:right-8" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <AnimatePresence mode="wait">
        {index >= 0 && (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 14, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            style={{ transformOrigin: 'bottom right' }}
            className="pointer-events-auto relative max-w-[16rem] cursor-pointer rounded-2xl rounded-br-sm border border-[#6DD94B]/40 bg-[#121212]/95 py-3 pl-4 pr-9 text-sm font-semibold leading-snug text-white shadow-[0_10px_40px_rgba(0,0,0,0.6),0_0_24px_rgba(109,217,75,0.18)] backdrop-blur-xl"
            onClick={() => { setIndex(-1); openChat(); }}
            role="button"
            aria-label="Abrir el chat"
          >
            <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-[#6DD94B] align-middle" />
            {MESSAGES[index]}
            <button
              type="button"
              aria-label="Cerrar"
              onClick={(e) => { e.stopPropagation(); setIndex(-1); setDismissed(true); }}
              className="absolute right-2 top-2 grid h-5 w-5 cursor-pointer place-items-center rounded-full text-zinc-500 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
