import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, ShieldCheck } from 'lucide-react';

const STORAGE_KEY = 'tecnodiel_cookie_consent';

export default function CookieBanner({ onNavigateToCookies }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(STORAGE_KEY);
      if (!consent) {
        // Pequeño retardo para que la carga inicial sea limpia
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch (_) {}
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ choice: 'all', timestamp: Date.now() }));
    } catch (_) {}
    setVisible(false);
  };

  const handleRejectNonEssential = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ choice: 'essential', timestamp: Date.now() }));
    } catch (_) {}
    setVisible(false);
  };

  const handleCookiePolicyClick = (e) => {
    if (onNavigateToCookies) {
      e.preventDefault();
      onNavigateToCookies();
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          role="region"
          aria-label="Aviso de cookies y privacidad"
          className="fixed bottom-4 inset-x-4 sm:bottom-6 sm:inset-x-auto sm:right-6 sm:max-w-md z-[999]"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#161616]/95 p-5 shadow-2xl shadow-black/80 backdrop-blur-xl font-['Montserrat',Inter,sans-serif]">
            {/* Glow decorativo sutil verde neón */}
            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#6DD94B]/10 blur-2xl" />

            {/* Cabecera del Banner */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#6DD94B]/15 text-[#6DD94B] ring-1 ring-[#6DD94B]/30">
                  <Cookie className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">Privacidad & Cookies</h4>
                  <p className="text-[10px] text-zinc-400">Cumplimiento RGPD & LSSI-CE</p>
                </div>
              </div>

              <button
                onClick={handleRejectNonEssential}
                aria-label="Cerrar aviso de cookies"
                className="rounded-lg p-1 text-zinc-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Texto del aviso */}
            <p className="mt-3 text-xs leading-relaxed text-zinc-300">
              Utilizamos cookies técnicas necesarias para el funcionamiento del sitio web y analíticas para optimizar tu experiencia y la velocidad del servicio. Puedes aceptar todas o limitar su uso a las esenciales.
            </p>

            <div className="mt-1.5">
              <a
                href="#/politica-cookies"
                onClick={handleCookiePolicyClick}
                className="text-[11px] font-semibold text-[#6DD94B] hover:text-white underline underline-offset-2 transition"
              >
                Leer Política de Cookies completa
              </a>
            </div>

            {/* Botones de Acción */}
            <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-white/5">
              <button
                onClick={handleAcceptAll}
                className="flex-1 rounded-xl bg-[#6DD94B] px-3.5 py-2.5 text-xs font-black text-black hover:bg-white transition-all shadow-lg shadow-[#6DD94B]/20 cursor-pointer text-center"
              >
                Aceptar todas
              </button>
              <button
                onClick={handleRejectNonEssential}
                className="flex-1 rounded-xl border border-white/20 bg-white/5 px-3.5 py-2.5 text-xs font-semibold text-zinc-200 hover:bg-white/10 hover:border-white transition-all cursor-pointer text-center"
              >
                Rechazar no esenciales
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
