import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import LogoMark from './home/LogoMark';

/* ─────────────────────────────────────────────────────────────
 * 1. FONDO REACTIVO: Red interactiva de partículas (React Bits)
 * Canvas 2D ultra-fluido a 60+ FPS que responde sutilmente al cursor.
 * ───────────────────────────────────────────────────────────── */
function InteractiveParticleBackground({ mousePos }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const particleCount = Math.min(Math.floor((width * height) / 13000), 80);
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.65,
        vy: (Math.random() - 0.5) * 0.65,
        radius: Math.random() * 2 + 1,
        baseAlpha: Math.random() * 0.4 + 0.2,
      });
    }

    const mouse = { x: -1000, y: -1000, radius: 180 };

    const updateCanvas = () => {
      ctx.clearRect(0, 0, width, height);

      mouse.x = mousePos.current.x;
      mouse.y = mousePos.current.y;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Atracción sutil hacia el ratón
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (1 - dist / mouse.radius) * 1.6;
          p.x -= (dx / dist) * force;
          p.y -= (dy / dist) * force;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(109, 217, 75, ${p.baseAlpha})`;
        ctx.fill();

        // Conexiones de red entre partículas
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distNodes = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (distNodes < 115) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(109, 217, 75, ${0.16 * (1 - distNodes / 115)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Conexión dinámica con el ratón
        if (dist < mouse.radius) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(109, 217, 75, ${0.32 * (1 - dist / mouse.radius)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(updateCanvas);
    };

    updateCanvas();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, [mousePos]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0 opacity-75" />;
}

/* ─────────────────────────────────────────────────────────────
 * 2. PÁGINA NOT FOUND (404 Monumental, Estático y de Gran Legibilidad)
 * ───────────────────────────────────────────────────────────── */
export default function NotFound({ onNavigateHome, onNavigateToContact }) {
  const mousePosRef = useRef({ x: -1000, y: -1000 });
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleGlobalMouseMove = (e) => {
    mousePosRef.current = { x: e.clientX, y: e.clientY };
    setCoords({ x: Math.round(e.clientX), y: Math.round(e.clientY) });
  };

  const goHome = (e) => {
    if (onNavigateHome) {
      e.preventDefault();
      onNavigateHome();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div
      onMouseMove={handleGlobalMouseMove}
      className="relative min-h-screen w-full bg-[#060606] text-white overflow-hidden flex flex-col justify-between font-['Montserrat',Inter,system-ui,sans-serif] selection:bg-[#6DD94B] selection:text-black"
    >
      {/* ── 1. FONDO INTERACTIVO DE PARTÍCULAS REACTIVAS ── */}
      <InteractiveParticleBackground mousePos={mousePosRef} />

      {/* ── 2. SPOTLIGHT RADIAL REACTIVO QUE SIGUE AL CURSOR ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(750px circle at ${coords.x}px ${coords.y}px, rgba(109, 217, 75, 0.08), transparent 75%)`,
        }}
      />

      {/* Cuadrícula geométrica sutil en el fondo */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.05] z-0"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '4rem 4rem',
        }}
      />

      {/* ── 3. EL 404 MONUMENTAL ESTÁTICO (ALTA LEGIBILIDAD INTEGRADA) ── */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center select-none overflow-hidden">
        <div className="relative flex items-center justify-center">
          {/* Halo posterior verde neón para definición y contraste */}
          <span 
            aria-hidden="true"
            className="absolute text-[240px] sm:text-[380px] md:text-[500px] lg:text-[620px] font-black tracking-tighter text-[#6DD94B]/20 blur-3xl select-none"
          >
            404
          </span>

          {/* Sombra de relieve espacial */}
          <span
            aria-hidden="true"
            className="absolute text-[240px] sm:text-[380px] md:text-[500px] lg:text-[620px] font-black tracking-tighter text-black/90 translate-y-4 blur-md select-none"
          >
            404
          </span>

          {/* 404 Monumental: Alta legibilidad con trazo blanco nítido y degradado plateado */}
          <span 
            className="text-[240px] sm:text-[380px] md:text-[500px] lg:text-[620px] font-black tracking-tighter leading-none select-none bg-gradient-to-b from-white/70 via-white/35 to-white/10 bg-clip-text text-transparent [text-shadow:_0_0_100px_rgba(109,217,75,0.25)] [-webkit-text-stroke:_2px_rgba(255,255,255,0.35)]"
          >
            404
          </span>
        </div>
      </div>

      {/* ── HEADER LIMPIO ── */}
      <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
        <a href="#/" onClick={goHome} className="flex items-center gap-3 group cursor-pointer">
          <LogoMark className="h-10 w-10 transition-transform duration-300 group-hover:scale-105" />
          <span className="leading-none">
            <span className="block text-lg font-extrabold tracking-wide text-white">TECNODIEL</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6DD94B]">Huelva</span>
          </span>
        </a>

        {/* Indicador discreto de página no encontrada */}
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-mono font-medium text-zinc-300">404 NOT FOUND</span>
        </div>
      </header>

      {/* ── CONTENIDO PRINCIPAL FLOTANTE SOBRE EL 404 GIGANTE ── */}
      <main className="relative z-10 mx-auto flex max-w-2xl flex-col items-center justify-center px-4 sm:px-6 text-center py-10 sm:py-16">
        {/* Titular y Copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4 px-4"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white drop-shadow-xl">
            Parece que te has perdido en el código.
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-zinc-300 max-w-lg mx-auto drop-shadow-md">
            Esta coordenada no existe en nuestro servidor. Pero en TecnOdiel ayudamos a tu negocio local a encontrar el camino exacto para multiplicar sus clientes.
          </p>
        </motion.div>

        {/* ── BOTONES DE ACCIÓN ESTÁTICOS (SIN MOVIMIENTO MAGNÉTICO) ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          {/* Botón Principal: Volver al inicio */}
          <a
            href="#/"
            onClick={goHome}
            className="group relative inline-flex items-center justify-center select-none cursor-pointer overflow-hidden rounded-full bg-[#6DD94B] px-8 py-4 text-sm font-black text-black shadow-xl shadow-[#6DD94B]/25 transition-all duration-300 hover:bg-white hover:shadow-white/30 active:scale-95"
          >
            <div className="relative z-10 flex items-center gap-3">
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Volver al inicio</span>
            </div>
            {/* Destello interior Shimmer sutil en hover */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
          </a>

          {/* Botón Secundario: Pide tu propuesta */}
          <a
            href="#contacto"
            onClick={(e) => {
              if (onNavigateToContact) {
                e.preventDefault();
                onNavigateToContact();
              }
            }}
            className="inline-flex items-center justify-center select-none cursor-pointer rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:border-[#6DD94B] hover:text-[#6DD94B] hover:bg-[#6DD94B]/10 active:scale-95"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-4 w-4 text-[#6DD94B]" />
              <span>Pide tu propuesta</span>
            </div>
          </a>
        </motion.div>

        {/* Atajos Rápidos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 sm:mt-14 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-zinc-500"
        >
          <span className="font-semibold text-zinc-400">Atajos rápidos:</span>
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
