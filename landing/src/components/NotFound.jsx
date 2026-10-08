import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Sparkles, Terminal, Compass, MessageCircle } from 'lucide-react';
import LogoMark from './home/LogoMark';

export default function NotFound({ onNavigateHome, onNavigateToContact }) {
  const goHome = (e) => {
    if (onNavigateHome) {
      e.preventDefault();
      onNavigateHome();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-white overflow-hidden flex flex-col justify-between font-['Montserrat',Inter,system-ui,sans-serif] selection:bg-[#6DD94B] selection:text-black">
      {/* ── ATMÓSFERA CINEMÁTICA Y EFECTOS DE FONDO ── */}
      {/* Grid de cuadrícula técnica en perspectiva */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)'
        }}
      />

      {/* Orbes de luz verde neón difusa */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[550px] w-[550px] rounded-full bg-[#6DD94B]/20 blur-[130px]"
      />

      {/* Halo secundario de profundidad */}
      <div className="pointer-events-none absolute -bottom-32 left-1/2 -translate-x-1/2 h-80 w-[700px] rounded-full bg-[#0D844A]/15 blur-[120px]" />

      {/* ── HEADER MINIMALISTA ── */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
        <a href="#/" onClick={goHome} className="flex items-center gap-3 group cursor-pointer">
          <LogoMark className="h-10 w-10 transition-transform group-hover:scale-105" />
          <span className="leading-none">
            <span className="block text-lg font-extrabold tracking-wide text-white">TECNODIEL</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6DD94B]">Huelva</span>
          </span>
        </a>

        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-mono font-medium text-zinc-400">ESTADO: 404 NOT FOUND</span>
        </div>
      </header>

      {/* ── CONTENIDO PRINCIPAL CINEMÁTICO ── */}
      <main className="relative z-10 mx-auto flex max-w-4xl flex-col items-center justify-center px-6 text-center py-12 sm:py-16">
        {/* Terminal Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-[#6DD94B]/30 bg-[#6DD94B]/10 px-4 py-1.5 text-xs font-mono font-semibold text-[#6DD94B] shadow-lg shadow-[#6DD94B]/10 backdrop-blur-md mb-6"
        >
          <Terminal className="h-3.5 w-3.5" />
          <span>[ ERROR_404 // RUTA_DESCONOCIDA ]</span>
        </motion.div>

        {/* TIPOGRAFÍA GIGANTE 404 CON TEXT CLIPPING Y GLOW */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="relative select-none"
        >
          {/* Sombra de texto profunda detrás */}
          <span className="absolute inset-0 block text-[130px] sm:text-[200px] md:text-[250px] font-black leading-none tracking-tighter text-white/5 blur-sm">
            404
          </span>

          {/* 404 principal con gradiente metálico y máscara */}
          <h1 className="relative text-[130px] sm:text-[200px] md:text-[250px] font-black leading-none tracking-tighter bg-gradient-to-b from-white via-zinc-300 to-zinc-700 bg-clip-text text-transparent drop-shadow-[0_20px_50px_rgba(109,217,75,0.25)]">
            404
          </h1>
        </motion.div>

        {/* Copy con actitud */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          className="space-y-4 max-w-xl"
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Parece que te has perdido en el código.
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-zinc-400">
            La ruta que buscas no existe en nuestro servidor o ha sido reubicada durante una actualización del sistema. Pero tranquilo: tu negocio aún está a tiempo de encontrar la solución digital adecuada.
          </p>
        </motion.div>

        {/* Botones de Acción de alto contraste */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          {/* Botón Principal: Volver al inicio */}
          <a
            href="#/"
            onClick={goHome}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#6DD94B] px-8 py-4 text-sm font-black text-black shadow-xl shadow-[#6DD94B]/25 transition-all duration-300 hover:bg-white hover:shadow-white/20 hover:scale-[1.02] cursor-pointer"
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
            className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:border-[#6DD94B] hover:text-[#6DD94B] hover:bg-[#6DD94B]/10 hover:scale-[1.02] cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-[#6DD94B]" />
            <span>Pide tu propuesta</span>
          </a>
        </motion.div>

        {/* Atajos Rápidos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500"
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
      <footer className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between border-t border-white/10 px-6 py-6 text-xs text-zinc-600 sm:px-10">
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
