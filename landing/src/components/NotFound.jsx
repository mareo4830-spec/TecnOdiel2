import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowLeft, Sparkles, Terminal, Compass, RotateCcw, Home, Eye } from 'lucide-react';
import LogoMark from './home/LogoMark';

/* ─────────────────────────────────────────────────────────────
 * 1. FONDO REACTIVO: Interactive Particle Web (Inspirado en React Bits)
 * Canvas 2D ultra-ligero a 60+ FPS que responde en tiempo real al ratón.
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

    // Número de partículas balanceado para máxima fluidez
    const particleCount = Math.min(Math.floor((width * height) / 14000), 75);
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2 + 1,
        baseAlpha: Math.random() * 0.4 + 0.2,
      });
    }

    const mouse = { x: -1000, y: -1000, radius: 170 };

    const updateCanvas = () => {
      ctx.clearRect(0, 0, width, height);

      // Actualizar posición de ratón desde props
      mouse.x = mousePos.current.x;
      mouse.y = mousePos.current.y;

      // Dibujar y actualizar partículas
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Movimiento base
        p.x += p.vx;
        p.y += p.vy;

        // Rebote en bordes
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Reacción magnética al ratón (efecto React Bits)
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (1 - dist / mouse.radius) * 1.5;
          p.x -= (dx / dist) * force;
          p.y -= (dy / dist) * force;
        }

        // Renderizado del punto
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(109, 217, 75, ${p.baseAlpha})`;
        ctx.fill();

        // Conexiones de red entre partículas
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distNodes = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (distNodes < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(109, 217, 75, ${0.18 * (1 - distNodes / 110)})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }

        // Conexión dinámica hacia el cursor
        if (dist < mouse.radius) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(109, 217, 75, ${0.35 * (1 - dist / mouse.radius)})`;
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

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0 opacity-80" />;
}

/* ─────────────────────────────────────────────────────────────
 * 2. COMPONENTE DE TEXTO DESENCRIPTADO (DecryptedText de React Bits)
 * Transición cibernética de glifos aleatorios a texto legible.
 * ───────────────────────────────────────────────────────────── */
const CHARS = '01#$%/&<>?@*!ABCDEFXYZ';

function DecryptedText({ text, speed = 40, className = '' }) {
  const [displayText, setDisplayText] = useState(text);

  const decrypt = useCallback(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) return text[index];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }
      iteration += 1 / 2;
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  useEffect(() => {
    return decrypt();
  }, [decrypt]);

  return (
    <span onMouseEnter={decrypt} className={`inline-block font-mono cursor-default ${className}`}>
      {displayText}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
 * 3. BOTÓN MAGNÉTICO (Magnet Button de React Bits)
 * Sigue y se aproxima suavemente al cursor en su proximidad.
 * ───────────────────────────────────────────────────────────── */
function MagneticButton({ children, onClick, href, className = '' }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.2 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    // Fuerza de atracción magnética dentro de 90px
    x.set(distanceX * 0.35);
    y.set(distanceY * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Tag = href ? motion.a : motion.button;

  return (
    <Tag
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={`relative inline-flex items-center justify-center select-none cursor-pointer ${className}`}
    >
      {children}
    </Tag>
  );
}

/* ─────────────────────────────────────────────────────────────
 * 4. PÁGINA NOT FOUND REACTIVA & CINEMÁTICA
 * ───────────────────────────────────────────────────────────── */
export default function NotFound({ onNavigateHome, onNavigateToContact }) {
  const mousePosRef = useRef({ x: -1000, y: -1000 });
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  // Valores de movimiento para el Tilt 3D reactivo
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Rotaciones sutiles tridimensionales (React Bits 3D Card effect)
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-15, 15]);

  const handleGlobalMouseMove = (e) => {
    mousePosRef.current = { x: e.clientX, y: e.clientY };
    setCoords({ x: Math.round(e.clientX), y: Math.round(e.clientY) });

    // Normalizar entre -0.5 y 0.5 para el Tilt 3D
    const { innerWidth, innerHeight } = window;
    mouseX.set(e.clientX / innerWidth - 0.5);
    mouseY.set(e.clientY / innerHeight - 0.5);
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
      className="relative min-h-screen w-full bg-[#080808] text-white overflow-hidden flex flex-col justify-between font-['Montserrat',Inter,system-ui,sans-serif] selection:bg-[#6DD94B] selection:text-black"
    >
      {/* ── 1. FONDO INTERACTIVO DE PARTÍCULAS REACTIVAS AL RATÓN ── */}
      <InteractiveParticleBackground mousePos={mousePosRef} />

      {/* ── 2. SPOTLIGHT RADIAL REACTIVO QUE SIGUE EL CURSOR ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(650px circle at ${coords.x}px ${coords.y}px, rgba(109, 217, 75, 0.08), transparent 80%)`,
        }}
      />

      {/* Grid técnico geométrico de fondo */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.07] z-0"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '3.5rem 3.5rem',
        }}
      />

      {/* ── HEADER ── */}
      <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
        <a href="#/" onClick={goHome} className="flex items-center gap-3 group cursor-pointer">
          <LogoMark className="h-10 w-10 transition-transform duration-300 group-hover:scale-105" />
          <span className="leading-none">
            <span className="block text-lg font-extrabold tracking-wide text-white">TECNODIEL</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6DD94B]">Huelva</span>
          </span>
        </a>

        {/* Telemetría reactiva en vivo (React Bits UI style) */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3.5 py-1.5 backdrop-blur-md text-[11px] font-mono text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-[#6DD94B] animate-pulse" />
            <span>RADAR: X {coords.x}px · Y {coords.y}px</span>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-mono font-medium text-zinc-300">404 NOT FOUND</span>
          </div>
        </div>
      </header>

      {/* ── MAIN: CONTENEDOR 3D TILT REACTIVO ── */}
      <main className="relative z-10 mx-auto flex max-w-4xl flex-col items-center justify-center px-4 sm:px-6 text-center py-6 sm:py-8 [perspective:1200px]">
        {/* Terminal Badge con texto desencriptado */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-[#6DD94B]/30 bg-[#6DD94B]/10 px-4 py-1.5 text-xs font-mono font-semibold text-[#6DD94B] shadow-lg shadow-[#6DD94B]/10 backdrop-blur-md mb-6"
        >
          <Terminal className="h-3.5 w-3.5" />
          <span>[ </span>
          <DecryptedText text="HTTP_404_PAGE_NOT_FOUND" speed={30} className="text-[#6DD94B]" />
          <span> ]</span>
        </motion.div>

        {/* ── CAJA 3D CON TILT REACTIVO AL RATÓN (ESTILO REACT BITS) ── */}
        <motion.div
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="relative group select-none cursor-default py-2"
        >
          {/* Brillo reflectivo dinámico en la tarjeta */}
          <div 
            className="pointer-events-none absolute -inset-8 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
            style={{
              background: 'radial-gradient(circle, rgba(109,217,75,0.18) 0%, transparent 70%)',
            }}
          />

          {/* Sombra de relieve posterior */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 block text-[130px] sm:text-[210px] md:text-[270px] lg:text-[320px] font-black leading-none tracking-tighter text-[#6DD94B]/15 blur-2xl translate-z-[-50px]"
          >
            404
          </span>

          {/* Tipografía 404 principal con gradiente líquido y bordes pulidos */}
          <h1 className="relative text-[130px] sm:text-[210px] md:text-[270px] lg:text-[320px] font-black leading-none tracking-tighter bg-gradient-to-b from-white via-zinc-200 to-zinc-600 bg-clip-text text-transparent drop-shadow-[0_20px_60px_rgba(0,0,0,0.9)] transition-transform duration-200">
            404
          </h1>

          {/* Línea de escaneo láser sutil neón */}
          <div className="absolute inset-x-0 bottom-4 h-[2px] bg-gradient-to-r from-transparent via-[#6DD94B] to-transparent opacity-60 shadow-[0_0_15px_#6DD94B]" />
        </motion.div>

        {/* Titular y Copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="space-y-3 max-w-xl px-4 mt-6"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            <DecryptedText text="Parece que te has perdido en el código." speed={35} className="font-sans font-bold" />
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-zinc-400">
            Esta coordenada no existe en nuestro servidor. Pero en TecnOdiel ayudamos a tu negocio local a encontrar el camino exacto para multiplicar sus clientes.
          </p>
        </motion.div>

        {/* ── BOTONES CON FÍSICA MAGNÉTICA (REACT BITS MAGNET) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
          className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          {/* Botón Magnético Principal: Volver al inicio */}
          <MagneticButton
            href="#/"
            onClick={goHome}
            className="group relative overflow-hidden rounded-full bg-[#6DD94B] px-8 py-4 text-sm font-black text-black shadow-xl shadow-[#6DD94B]/25 transition-colors duration-300 hover:bg-white hover:shadow-white/25 active:scale-95"
          >
            <div className="relative z-10 flex items-center gap-3">
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Volver al inicio</span>
            </div>
            {/* Efecto Shiny Shimmer interior */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </MagneticButton>

          {/* Botón Magnético Secundario: Pide tu propuesta */}
          <MagneticButton
            href="#contacto"
            onClick={(e) => {
              if (onNavigateToContact) {
                e.preventDefault();
                onNavigateToContact();
              }
            }}
            className="rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:border-[#6DD94B] hover:text-[#6DD94B] hover:bg-[#6DD94B]/10 active:scale-95"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-4 w-4 text-[#6DD94B]" />
              <span>Pide tu propuesta</span>
            </div>
          </MagneticButton>
        </motion.div>

        {/* Atajos Rápidos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-zinc-500"
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
