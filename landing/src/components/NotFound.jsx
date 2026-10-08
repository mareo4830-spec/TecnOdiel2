import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Terminal, RotateCcw, AlertTriangle } from 'lucide-react';
import LogoMark from './home/LogoMark';

/**
 * Componente de dígito monolítico con física de peso masivo (Heavy Impact Physics).
 * Caída con aceleración gravitacional, compresión vertical (squash & stretch),
 * rebote elástico pesado, sombra dinámica y onda de choque neón en el suelo.
 */
function HeavyDigit({ char, delay, animKey }) {
  return (
    <div className="relative inline-flex flex-col items-center justify-center px-1 sm:px-3">
      {/* Dígito en caída pesada */}
      <motion.div
        key={`${char}-${animKey}`}
        initial={{
          y: -420,
          opacity: 0,
          scaleY: 1.35,
          scaleX: 0.75,
          filter: 'blur(8px)',
        }}
        animate={{
          y: [-420, 0, -28, 0, -8, 0],
          scaleY: [1.35, 0.72, 1.12, 0.94, 1.03, 1],
          scaleX: [0.75, 1.28, 0.92, 1.05, 0.98, 1],
          opacity: [0, 1, 1, 1, 1, 1],
          filter: ['blur(8px)', 'blur(0px)', 'blur(0px)', 'blur(0px)', 'blur(0px)', 'blur(0px)'],
        }}
        transition={{
          delay,
          duration: 0.95,
          times: [0, 0.48, 0.65, 0.8, 0.9, 1],
          ease: ['easeIn', 'easeOut', 'easeInOut', 'easeOut', 'easeOut'],
        }}
        className="relative z-10 select-none transform-gpu origin-bottom cursor-default"
      >
        {/* Glow difuso posterior verde neón */}
        <span 
          aria-hidden 
          className="pointer-events-none absolute inset-0 block text-[130px] sm:text-[210px] md:text-[270px] lg:text-[310px] font-black leading-none tracking-tighter text-[#6DD94B]/20 blur-xl scale-105"
        >
          {char}
        </span>

        {/* Sombra de relieve inferior profunda */}
        <span 
          aria-hidden 
          className="pointer-events-none absolute inset-0 block text-[130px] sm:text-[210px] md:text-[270px] lg:text-[310px] font-black leading-none tracking-tighter text-black/90 translate-y-3 blur-[2px]"
        >
          {char}
        </span>

        {/* Tipografía gigante con bisel metálico de titanio y máscara */}
        <span className="relative block text-[130px] sm:text-[210px] md:text-[270px] lg:text-[310px] font-black leading-none tracking-tighter bg-gradient-to-b from-white via-zinc-200 to-zinc-600 bg-clip-text text-transparent drop-shadow-[0_25px_35px_rgba(0,0,0,0.9)]">
          {char}
        </span>
      </motion.div>

      {/* ── SUELO: Sombra de impacto & Onda de choque ── */}
      <div className="relative -mt-6 sm:-mt-10 h-8 w-full flex items-center justify-center pointer-events-none">
        {/* Sombra proyectada en el suelo que se intensifica al tocar tierra */}
        <motion.div
          key={`shadow-${char}-${animKey}`}
          initial={{ scaleX: 0.2, scaleY: 0.2, opacity: 0 }}
          animate={{
            scaleX: [0.15, 1.4, 0.9, 1.1, 1],
            scaleY: [0.15, 1.4, 0.9, 1.1, 1],
            opacity: [0, 0.9, 0.5, 0.8, 0.7],
          }}
          transition={{
            delay: delay + 0.35,
            duration: 0.6,
            times: [0, 0.3, 0.55, 0.8, 1],
          }}
          className="h-4 w-28 sm:w-44 rounded-full bg-black/90 blur-md"
        />

        {/* Onda de choque (shockwave ring) que estalla en el instante de contacto */}
        <motion.div
          key={`shockwave-${char}-${animKey}`}
          initial={{ scale: 0.1, opacity: 0 }}
          animate={{
            scale: [0.1, 2.3],
            opacity: [0.85, 0],
          }}
          transition={{
            delay: delay + 0.44, // Momento exacto de colisión
            duration: 0.65,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="absolute h-8 w-28 sm:w-44 rounded-full border-2 border-[#6DD94B] shadow-[0_0_20px_#6DD94B]"
        />

        {/* Destello de impacto central */}
        <motion.div
          key={`flash-${char}-${animKey}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0, 0.7, 0],
            scale: [0.5, 1.5, 0.8],
          }}
          transition={{
            delay: delay + 0.44,
            duration: 0.3,
            ease: 'easeOut',
          }}
          className="absolute h-2 w-16 rounded-full bg-[#6DD94B] blur-sm"
        />
      </div>
    </div>
  );
}

export default function NotFound({ onNavigateHome, onNavigateToContact }) {
  const [animKey, setAnimKey] = useState(0);

  const goHome = (e) => {
    if (onNavigateHome) {
      e.preventDefault();
      onNavigateHome();
    } else {
      window.location.href = '/';
    }
  };

  const handleReplay = () => {
    setAnimKey((prev) => prev + 1);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-white overflow-hidden flex flex-col justify-between font-['Montserrat',Inter,system-ui,sans-serif] selection:bg-[#6DD94B] selection:text-black">
      {/* ── ATMÓSFERA CINEMÁTICA Y EFECTOS DE FONDO ── */}
      {/* Cuadrícula técnica en perspectiva con fade radial */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(ellipse 65% 55% at 50% 50%, #000 65%, transparent 100%)'
        }}
      />

      {/* Orbe de luz neón ambiental pulsante */}
      <motion.div
        animate={{
          scale: [1, 1.22, 1],
          opacity: [0.12, 0.22, 0.12],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[#6DD94B]/20 blur-[140px]"
      />

      {/* Halo de profundidad esmeralda en la base */}
      <div className="pointer-events-none absolute -bottom-40 left-1/2 -translate-x-1/2 h-80 w-[750px] rounded-full bg-[#0D844A]/15 blur-[130px]" />

      {/* ── HEADER MINIMALISTA ── */}
      <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
        <a href="#/" onClick={goHome} className="flex items-center gap-3 group cursor-pointer">
          <LogoMark className="h-10 w-10 transition-transform duration-300 group-hover:scale-105" />
          <span className="leading-none">
            <span className="block text-lg font-extrabold tracking-wide text-white">TECNODIEL</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6DD94B]">Huelva</span>
          </span>
        </a>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReplay}
            title="Repetir animación de caída"
            aria-label="Repetir animación"
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold text-zinc-300 hover:text-[#6DD94B] hover:border-[#6DD94B]/40 transition cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden sm:inline">Repetir caída</span>
          </button>

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-mono font-medium text-zinc-400">STATUS 404</span>
          </div>
        </div>
      </header>

      {/* ── ESCENARIO CENTRAL CINEMÁTICO ── */}
      <main className="relative z-10 mx-auto flex max-w-5xl flex-col items-center justify-center px-4 sm:px-6 text-center py-6 sm:py-10">
        {/* Terminal Badge con micro-animación */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-[#6DD94B]/30 bg-[#6DD94B]/10 px-4 py-1.5 text-xs font-mono font-semibold text-[#6DD94B] shadow-lg shadow-[#6DD94B]/10 backdrop-blur-md mb-4 sm:mb-6"
        >
          <Terminal className="h-3.5 w-3.5" />
          <span>[ GRAVITY_DROP // ERROR_404_PAGE_NOT_FOUND ]</span>
        </motion.div>

        {/* ── CONTENEDOR DE IMPACTO DE LOS DÍGITOS 4 - 0 - 4 ── */}
        {/* El contenedor sufre vibraciones sísmicas sincronizadas con la caída de cada dígito */}
        <motion.div
          key={`camera-shake-${animKey}`}
          animate={{
            y: [0, 0, 7, -4, 2, 0, 7, -4, 2, 0, 9, -5, 3, 0],
            rotateZ: [0, 0, -0.4, 0.3, -0.1, 0, 0.4, -0.3, 0.1, 0, -0.6, 0.4, -0.2, 0],
          }}
          transition={{
            duration: 2.1,
            times: [
              0,
              0.22, 0.24, 0.27, 0.30, 0.34, // Impacto del primer '4'
              0.48, 0.50, 0.53, 0.56, 0.60, // Impacto del '0'
              0.73, 0.75, 0.78, 0.82, 0.86  // Impacto del segundo '4'
            ],
            ease: 'easeInOut',
          }}
          className="relative flex items-center justify-center my-2 sm:my-4"
        >
          {/* 1º Cae el 4 izquierdo (t = 0.15s) */}
          <HeavyDigit char="4" delay={0.15} animKey={animKey} />

          {/* 2º Cae el 0 central (t = 0.68s) */}
          <HeavyDigit char="0" delay={0.68} animKey={animKey} />

          {/* 3º Cae el 4 derecho (t = 1.22s) */}
          <HeavyDigit char="4" delay={1.22} animKey={animKey} />
        </motion.div>

        {/* Copy con actitud cinemática */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 1.6 }}
          className="space-y-3 max-w-xl px-4 mt-2 sm:mt-4"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            Parece que te has perdido en el código.
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-zinc-400">
            La ruta que buscas se desprendió del servidor o nunca existió. En TecnOdiel construimos sistemas robustos, pero aquí has llegado a un callejón sin salida.
          </p>
        </motion.div>

        {/* Botones de Acción de alto contraste */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 1.8 }}
          className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          {/* Botón Principal: Volver al inicio */}
          <a
            href="#/"
            onClick={goHome}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#6DD94B] px-8 py-4 text-sm font-black text-black shadow-xl shadow-[#6DD94B]/25 transition-all duration-300 hover:bg-white hover:shadow-white/20 hover:scale-[1.03] cursor-pointer active:scale-95"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Volver al inicio</span>
          </a>

          {/* Botón Secundario: Contactar / Pide tu propuesta */}
          <a
            href="#contacto"
            onClick={(e) => {
              if (onNavigateToContact) {
                e.preventDefault();
                onNavigateToContact();
              }
            }}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:border-[#6DD94B] hover:text-[#6DD94B] hover:bg-[#6DD94B]/10 hover:scale-[1.03] cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-[#6DD94B]" />
            <span>Pide tu propuesta</span>
          </a>
        </motion.div>

        {/* Atajos Rápidos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.1 }}
          className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-zinc-500"
        >
          <span className="font-semibold text-zinc-400">Rutas rápidas:</span>
          <a href="#/multiwebs" className="hover:text-[#6DD94B] transition">Webs Hostelería</a>
          <span className="text-zinc-700">•</span>
          <a href="#/cys" className="hover:text-[#6DD94B] transition">Webs Clínicas & Salud</a>
          <span className="text-zinc-700">•</span>
          <a href="#/portal" className="hover:text-[#6DD94B] transition">Área Clientes</a>
        </motion.div>
      </main>

      {/* ── FOOTER SUTIL ── */}
      <footer className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between border-t border-white/10 px-6 py-6 text-xs text-zinc-600 sm:px-10">
        <p>© {new Date().getFullYear()} TecnOdiel. Huelva, España.</p>
        <div className="flex gap-4">
          <a href="#/aviso-legal" className="hover:text-zinc-400 transition">Aviso Legal</a>
          <a href="#/politica-privacidad" className="hover:text-zinc-400 transition">Privacidad</a>
          <a href="#/politica-cookies" className="hover:text-zinc-400 transition">Cookies</a>
        </div>
      </footer>
    </div>
  );
}
