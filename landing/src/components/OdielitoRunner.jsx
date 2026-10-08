import React, { useState, useEffect, useRef } from 'react';

/**
 * ODIELITO RUNNER - 3D Desktop Mascot & Cursor Hunter
 * Odielito corre en 3D por la pantalla persiguiendo tu ratón,
 * lo atrapa con un lazo de energía cibernética y lo arrastra
 * directamente al formulario de propuesta ("Hablemos de tu proyecto"),
 * estés donde estés en la web, celebrando con confeti y destellos.
 */
export default function OdielitoRunner({ onNavigateToLanding }) {
  // Posiciones y estados físicos
  const [pos, setPos] = useState({ x: 120, y: 300 });
  const [facing, setFacing] = useState(1); // 1 = derecha, -1 = izquierda
  const [tilt, setTilt] = useState(0); // inclinación 3D en grados
  const [speech, setSpeech] = useState("¡Buscando tu ratón! 👀");
  const [speechVisible, setSpeechVisible] = useState(true);
  const [state, setState] = useState('idle'); // 'idle' | 'chasing' | 'caught' | 'dragging' | 'delivered' | 'napping'
  const [cutoutSrc, setCutoutSrc] = useState(null);
  const [lassoTarget, setLassoTarget] = useState(null);
  const [particles, setParticles] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  // Refs de loop y física
  const posRef = useRef({ x: 120, y: 300, vx: 0, vy: 0 });
  const mouseRef = useRef({ x: 400, y: 400, lastX: 400, lastY: 400, speed: 0, lastActive: Date.now() });
  const stateRef = useRef('idle');
  const animFrameRef = useRef(null);
  const runCycleRef = useRef(0);
  const cooldownRef = useRef(0);
  const dragStartTimeRef = useRef(0);
  const hasDeliveredRef = useRef(typeof window !== 'undefined' && sessionStorage.getItem('odielito_has_delivered') === 'true');

  // 1. Detectar si es dispositivo de escritorio
  useEffect(() => {
    const checkDesktop = () => {
      const finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
      setIsDesktop(window.innerWidth >= 1024 && finePointer);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // 2. Procesar transparencia del fondo negro de la imagen con Canvas
  useEffect(() => {
    if (!isDesktop) return;
    const img = new Image();
    img.src = '/bot/odielito.jpg';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 512;
        canvas.height = img.naturalHeight || 512;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imgData.data;

        // Quitar fondo negro y suavizar contorno
        for (let i = 0; i < d.length; i += 4) {
          const r = d[i];
          const g = d[i + 1];
          const b = d[i + 2];
          const maxVal = Math.max(r, g, b);

          if (maxVal < 22) {
            d[i + 3] = 0; // Transparente total
          } else if (maxVal < 42) {
            // Suavizado anti-aliasing de los bordes
            d[i + 3] = Math.round(((maxVal - 22) / 20) * 255);
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setCutoutSrc(canvas.toDataURL('image/png'));
      } catch (_) {
        setCutoutSrc('/bot/odielito.jpg');
      }
    };
    img.onerror = () => {
      setCutoutSrc('/bot/odielito.jpg');
    };
  }, [isDesktop]);

  // 3. Rastrear movimiento del ratón
  useEffect(() => {
    if (!isDesktop) return;

    const handleMouseMove = (e) => {
      const now = Date.now();
      const dx = e.clientX - mouseRef.current.lastX;
      const dy = e.clientY - mouseRef.current.lastY;
      const dist = Math.hypot(dx, dy);

      mouseRef.current.speed = dist;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.lastX = e.clientX;
      mouseRef.current.lastY = e.clientY;
      mouseRef.current.lastActive = now;

      // Mecánica de escape: si el usuario sacude el ratón bruscamente mientras lo arrastra
      if (stateRef.current === 'dragging' && dist > 34) {
        stateRef.current = 'idle';
        setState('idle');
        setLassoTarget(null);
        cooldownRef.current = now + 4000; // 4s de respiro
        triggerSpeech("¡Ayy, te escapaste! 💨 ¡Qué reflejos!", 2800);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isDesktop]);

  // 4. Helper para bocadillos de diálogo con temporizador
  const speechTimeoutRef = useRef(null);
  const triggerSpeech = (text, duration = 2400) => {
    setSpeech(text);
    setSpeechVisible(true);
    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    speechTimeoutRef.current = setTimeout(() => {
      setSpeechVisible(false);
    }, duration);
  };

  // 5. Función para encontrar el elemento destino: el formulario de propuesta ("Hablemos de tu proyecto")
  const getProposalFormElement = () => {
    return (
      document.getElementById('propuesta-lead-form') ||
      document.getElementById('contacto') ||
      document.querySelector('section#contacto')
    );
  };

  // 6. Explosión de confeti y resplandor al llegar al formulario
  const triggerCelebration = (targetX, targetY, targetEl) => {
    // Aura de resplandor sobre el formulario
    if (targetEl) {
      targetEl.style.transition = 'all 0.4s ease';
      targetEl.style.boxShadow = '0 0 50px #6DD94B, 0 0 90px rgba(109,217,75,0.45)';
      targetEl.style.borderColor = '#6DD94B';
      setTimeout(() => {
        targetEl.style.boxShadow = '';
        targetEl.style.borderColor = '';
      }, 4000);
    }

    // Generar partículas de confeti cibernético
    const newParticles = [];
    const colors = ['#6DD94B', '#0D844A', '#FFFFFF', '#38BDF8', '#FACC15', '#A855F7'];
    for (let i = 0; i < 52; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 8;
      newParticles.push({
        id: Math.random(),
        x: targetX,
        y: targetY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 5 + Math.random() * 6,
        alpha: 1,
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 15
      });
    }
    setParticles(newParticles);
  };

  // 7. Bucle Principal de Física y Animación (60 FPS)
  useEffect(() => {
    if (!isDesktop || isPaused) return;

    // Inicializar posición
    posRef.current.x = window.innerWidth - 160;
    posRef.current.y = window.innerHeight - 200;

    const phrasesChase = [
      "¡Te vi! 🏃‍♂️",
      "¡No huyas!",
      "¡A por tu ratón! 🎯",
      "¡Espérate que voy! 💨",
      "¡Ven que te enseño algo! ✨"
    ];

    let lastSpeechTick = 0;

    const tick = () => {
      const now = Date.now();
      const p = posRef.current;
      const m = mouseRef.current;
      runCycleRef.current += 0.24;

      // ── ESTADO: IDLE ──
      if (stateRef.current === 'idle') {
        // Si no está en cooldown y el ratón se mueve, pasar a perseguir
        if (now > cooldownRef.current && (now - m.lastActive < 2000)) {
          stateRef.current = 'chasing';
          setState('chasing');
          triggerSpeech(phrasesChase[Math.floor(Math.random() * phrasesChase.length)], 2000);
        } else {
          // Movimiento de deambular suave y respiración
          p.x += Math.sin(now * 0.0015) * 0.8;
          p.y += Math.cos(now * 0.002) * 0.6;
        }
      }

      // ── ESTADO: CHASING (Persiguiendo) ──
      else if (stateRef.current === 'chasing') {
        const dx = m.x - p.x;
        const dy = m.y - p.y;
        const dist = Math.hypot(dx, dy);

        // Orientación y tilt 3D
        if (Math.abs(dx) > 5) {
          setFacing(dx > 0 ? 1 : -1);
          setTilt(Math.max(-20, Math.min(20, (dx / 15))));
        }

        // Si ya nos llevó una vez abajo: Odielito corre acompañando al ratón, pero NO lo coge de nuevo
        if (hasDeliveredRef.current) {
          const companionDist = 65;
          const speed = 4.2;
          if (dist > companionDist) {
            p.x += (dx / dist) * speed;
            p.y += (dy / dist) * speed;
          }

          if (now - lastSpeechTick > 4500) {
            lastSpeechTick = now;
            const companionPhrases = [
              "¡Te sigo el ritmo! 🏃‍♂️",
              "¡Aquí ando contigo! 🤖",
              "¡Mira cómo corro! ⚡",
              "¡Echa un ojo al formulario! 👇",
              "¡Buen paseo por la web! ✨"
            ];
            triggerSpeech(companionPhrases[Math.floor(Math.random() * companionPhrases.length)], 2000);
          }
        } else {
          // Primera vez: perseguir para atrapar y llevar al formulario
          const speed = 4.4;
          if (dist > 35) {
            p.x += (dx / dist) * speed;
            p.y += (dy / dist) * speed;
          }

          // Diálogos aleatorios durante la persecución
          if (now - lastSpeechTick > 3500) {
            lastSpeechTick = now;
            triggerSpeech(phrasesChase[Math.floor(Math.random() * phrasesChase.length)], 1600);
          }

          // ¡ATRAPADO! Si está a menos de 38px
          if (dist <= 38) {
            stateRef.current = 'caught';
            setState('caught');
            triggerSpeech("¡¡TE PILLÉ!! 🎯🎯 ¡Vente conmigo al formulario!", 2400);

            // Inicializar captura y lazo
            setLassoTarget({ x: m.x, y: m.y });

            // Si estamos en otra página/sección sin el formulario, navegar a landing
            if (!getProposalFormElement() && onNavigateToLanding) {
              onNavigateToLanding();
            }

            // Tras medio segundo, empezar a correr arrastrándolo
            setTimeout(() => {
              if (stateRef.current === 'caught') {
                stateRef.current = 'dragging';
                setState('dragging');
                dragStartTimeRef.current = Date.now();
                triggerSpeech("¡Tirando con fuerza! 💨 ¡Rumbo a tu propuesta! 🚀", 3200);
              }
            }, 600);
          }
        }
      }

      // ── ESTADO: DRAGGING (Arrastrando hacia el formulario en cualquier parte de la web) ──
      else if (stateRef.current === 'dragging') {
        let formEl = getProposalFormElement();
        if (!formEl && onNavigateToLanding) {
          onNavigateToLanding();
          formEl = getProposalFormElement();
        }

        if (formEl) {
          const rect = formEl.getBoundingClientRect();
          // Colocación ideal del formulario en la parte superior-media de la pantalla
          const idealScrollOffset = rect.top - Math.min(130, window.innerHeight * 0.16);

          // 1. Scroll suave, continuo y rápido de la página
          const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 15);
          const scrollDone = Math.abs(idealScrollOffset) <= 28 || (idealScrollOffset > 0 && isAtBottom);

          if (!scrollDone) {
            const sign = Math.sign(idealScrollOffset);
            const abs = Math.abs(idealScrollOffset);
            // Velocidad progresiva: hasta 46px por frame (~2760px/s) para avance rápido y fluido
            const scrollSpeed = sign * Math.min(abs * 0.16 + 8, 46);
            window.scrollBy({ top: scrollSpeed, behavior: 'auto' });
          }

          // 2. Destino del bot en la pantalla
          let targetX = rect.left + rect.width / 2;
          let targetY = rect.top + 70;

          // Si el formulario aún está fuera de la vista vertical
          if (rect.top > window.innerHeight - 100) {
            // El formulario está más abajo: el bot corre hacia abajo tirando con fuerza
            targetX = window.innerWidth * 0.65;
            targetY = window.innerHeight - 120;
          } else if (rect.bottom < 100) {
            // El formulario está más arriba: el bot corre hacia arriba
            targetX = window.innerWidth * 0.65;
            targetY = 110;
          } else {
            // El formulario está visible en pantalla
            targetX = Math.max(80, Math.min(window.innerWidth - 80, rect.left + rect.width / 2));
            targetY = Math.max(70, Math.min(window.innerHeight - 70, rect.top + 70));
          }

          const dx = targetX - p.x;
          const dy = targetY - p.y;
          const distToBotTarget = Math.hypot(dx, dy);

          // Orientación e inclinación hacia la dirección del movimiento
          setFacing(dx >= 0 ? 1 : -1);
          setTilt(dx >= 0 ? 18 : -18);

          // Carrera del bot arrastrando
          const dragSpeed = 7.5;
          if (distToBotTarget > 25) {
            p.x += (dx / distToBotTarget) * dragSpeed;
            p.y += (dy / distToBotTarget) * dragSpeed;
          }

          // Posición del cursor virtual atrapado detrás de él
          const trailOffset = dx >= 0 ? -48 : 48;
          setLassoTarget({
            x: p.x + trailOffset,
            y: p.y + Math.sin(now * 0.02) * 8
          });

          // Watchdog: tiempo transcurrido de arrastre
          const dragElapsed = Date.now() - (dragStartTimeRef.current || 0);

          // Comprobación de llegada triunfal
          const isArrived = (scrollDone && distToBotTarget <= 50) || 
                            (dragElapsed > 8000 && rect.top < window.innerHeight);

          if (isArrived) {
            stateRef.current = 'delivered';
            setState('delivered');
            setLassoTarget(null);
            hasDeliveredRef.current = true;
            try { sessionStorage.setItem('odielito_has_delivered', 'true'); } catch (_) {}
            triggerSpeech("¡¡LLEGAMOS!! 🎉 ¡Cuéntanos sobre tu negocio aquí!", 4500);
            triggerCelebration(rect.left + rect.width / 2, rect.top + 60, formEl);

            // Enfocar campo de nombre para que el usuario pueda empezar a escribir
            const nameInput = document.getElementById('lf-name');
            if (nameInput) {
              setTimeout(() => {
                nameInput.focus({ preventScroll: true });
              }, 400);
            }

            // Volver a estado idle tras celebrar y pasar a modo acompañante
            setTimeout(() => {
              stateRef.current = 'idle';
              setState('idle');
              cooldownRef.current = Date.now() + 4000;
              triggerSpeech("¡Ya te traje aquí! Ahora te acompaño de paseo ✨", 3500);
            }, 4500);
          }
        } else {
          // Si tras 4s no encuentra el formulario en pantalla, soltar suavemente
          if (Date.now() - (dragStartTimeRef.current || 0) > 4000) {
            stateRef.current = 'idle';
            setState('idle');
            setLassoTarget(null);
            cooldownRef.current = Date.now() + 4000;
          }
        }
      }

      // ── ESTADO: DELIVERED (Celebración y baile) ──
      else if (stateRef.current === 'delivered') {
        // Baile de victoria: saltitos cómicos
        p.y += Math.sin(now * 0.012) * 2.5;
        setTilt(Math.sin(now * 0.01) * 14);
      }

      // Restringir márgenes dentro de la pantalla
      p.x = Math.max(40, Math.min(window.innerWidth - 60, p.x));
      p.y = Math.max(50, Math.min(window.innerHeight - 80, p.y));

      setPos({ x: p.x, y: p.y });

      // Actualizar partículas
      setParticles((prev) =>
        prev
          .map((pt) => ({
            ...pt,
            x: pt.x + pt.vx,
            y: pt.y + pt.vy,
            vy: pt.vy + 0.15, // gravedad
            alpha: pt.alpha - 0.018,
            rotation: pt.rotation + pt.vr
          }))
          .filter((pt) => pt.alpha > 0)
      );

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isDesktop, isPaused, onNavigateToLanding]);

  if (!isDesktop) return null;

  // Cálculo de animación de patitas en ciclo de carrera
  const legOffsetLeft = (state === 'chasing' || state === 'dragging') 
    ? Math.sin(runCycleRef.current) * 8 
    : 0;
  const legOffsetRight = (state === 'chasing' || state === 'dragging') 
    ? Math.sin(runCycleRef.current + Math.PI) * 8 
    : 0;
  const legAngleLeft = (state === 'chasing' || state === 'dragging') 
    ? Math.cos(runCycleRef.current) * 25 
    : 0;
  const legAngleRight = (state === 'chasing' || state === 'dragging') 
    ? Math.cos(runCycleRef.current + Math.PI) * 25 
    : 0;
  const bodyBob = (state === 'chasing' || state === 'dragging') 
    ? Math.abs(Math.sin(runCycleRef.current)) * 5 
    : Math.sin(Date.now() * 0.003) * 2;

  return (
    <>
      {/* ── 1. LAZO DE ENERGÍA Y RAYO TRACTOR ── */}
      {lassoTarget && (
        <svg
          className="pointer-events-none fixed inset-0 z-[99990] h-full w-full overflow-visible"
          style={{ filter: 'drop-shadow(0 0 10px #6DD94B)' }}
        >
          <defs>
            <linearGradient id="odielitoLassoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6DD94B" stopOpacity="1" />
              <stop offset="50%" stopColor="#22C55E" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Haz principal palpitante */}
          <line
            x1={pos.x}
            y1={pos.y + 10}
            x2={lassoTarget.x}
            y2={lassoTarget.y}
            stroke="url(#odielitoLassoGrad)"
            strokeWidth="3.5"
            strokeDasharray="6 4"
            className="animate-pulse"
          />

          {/* Anillos de energía sobre el haz */}
          <circle cx={(pos.x + lassoTarget.x) / 2} cy={(pos.y + 10 + lassoTarget.y) / 2} r="5" fill="#6DD94B" />
          <circle cx={lassoTarget.x} cy={lassoTarget.y} r="7" fill="none" stroke="#6DD94B" strokeWidth="2.5" />
        </svg>
      )}

      {/* ── 2. CURSOR VIRTUAL ATRAPADO ── */}
      {lassoTarget && (
        <div
          className="pointer-events-none fixed z-[99995] flex items-center gap-1.5 transition-transform"
          style={{
            left: lassoTarget.x - 6,
            top: lassoTarget.y - 6,
            transform: `rotate(${Math.sin(Date.now() * 0.02) * 20}deg)`
          }}
        >
          {/* Icono de puntero de ratón forcejeando */}
          <svg className="h-7 w-7 text-white drop-shadow-[0_0_12px_#6DD94B]" viewBox="0 0 24 24" fill="#6DD94B" stroke="#000" strokeWidth="1.5">
            <path d="M3 3l7 18 3-7 7-3L3 3z" />
          </svg>
          <span className="rounded-md bg-black/80 px-1.5 py-0.5 text-[9px] font-mono font-bold text-[#6DD94B] border border-[#6DD94B]/50 whitespace-nowrap">
            ¡Agarrado! 🪢
          </span>
        </div>
      )}

      {/* ── 3. EXPLOSIÓN DE CONFETI DE VICTORIA ── */}
      {particles.map((pt) => (
        <div
          key={pt.id}
          className="pointer-events-none fixed z-[99998]"
          style={{
            left: pt.x,
            top: pt.y,
            width: pt.size,
            height: pt.size,
            backgroundColor: pt.color,
            borderRadius: pt.id > 0.5 ? '50%' : '2px',
            opacity: pt.alpha,
            transform: `rotate(${pt.rotation}deg)`,
            boxShadow: `0 0 8px ${pt.color}`
          }}
        />
      ))}

      {/* ── 4. EL BOT ODIELITO EN 3D ── */}
      <div
        className="fixed z-[99992] select-none cursor-pointer transition-transform duration-75 ease-out"
        style={{
          left: pos.x - 42,
          top: pos.y - 48,
          perspective: 800
        }}
        onClick={() => {
          if (hasDeliveredRef.current) {
            triggerSpeech("¡Soy tu copiloto Odielito! 🤖 Te acompaño por la web ✨", 2500);
          } else {
            triggerSpeech("¡Hola! Soy Odielito 🤖✨ ¡Rellena el formulario para tu propuesta!", 2500);
          }
        }}
        title="Odielito Bot — TecnOdiel (Haz clic para saludar)"
      >
        {/* Bocadillo de diálogo de cómic */}
        {speechVisible && (
          <div
            className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-2xl border-2 border-[#6DD94B] bg-[#161616]/95 px-3 py-1 text-[11px] font-bold text-white shadow-[0_4px_20px_rgba(109,217,75,0.4)] backdrop-blur-md animate-bounce"
            style={{ animationDuration: '1.4s' }}
          >
            <span>{speech}</span>
            {/* Triangulito del bocadillo */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-0 w-0 border-x-4 border-x-transparent border-t-8 border-t-[#6DD94B]" />
          </div>
        )}

        {/* Contenedor con perspectiva 3D e inclinación de carrera */}
        <div
          className="relative flex flex-col items-center"
          style={{
            transform: `scale(${1}) scaleX(${facing}) rotateZ(${tilt}deg) translateY(-${bodyBob}px)`,
            transformOrigin: 'bottom center',
            transition: 'transform 0.08s ease-out'
          }}
        >
          {/* Cuerpo / Avatar de Odielito */}
          <div className="relative h-20 w-20 flex items-center justify-center">
            {cutoutSrc ? (
              <img
                src={cutoutSrc}
                alt="Odielito 3D Bot"
                className="h-full w-full object-contain drop-shadow-[0_8px_16px_rgba(109,217,75,0.4)] transition-transform duration-150"
                draggable={false}
              />
            ) : (
              <img
                src="/bot/odielito.jpg"
                alt="Odielito 3D Bot"
                className="h-full w-full object-contain rounded-full border-2 border-[#6DD94B] drop-shadow-[0_8px_16px_rgba(109,217,75,0.5)]"
                draggable={false}
              />
            )}

            {/* Antena parpadeante con luz verde de neón */}
            <span className="absolute top-1 right-[38%] h-2 w-2 rounded-full bg-[#6DD94B] shadow-[0_0_10px_#6DD94B] animate-ping opacity-75" />
          </div>

          {/* Patitas mecánicas corriendo con animación cíclica */}
          <div className="relative -mt-2 flex w-12 justify-between px-1">
            {/* Pata Izquierda */}
            <div
              className="h-3.5 w-3 rounded-full bg-[#52be31] shadow-[0_2px_4px_rgba(0,0,0,0.5)] border border-black/30"
              style={{
                transform: `translateY(${legOffsetLeft}px) rotate(${legAngleLeft}deg)`,
                transformOrigin: 'top center'
              }}
            />
            {/* Pata Derecha */}
            <div
              className="h-3.5 w-3 rounded-full bg-[#6DD94B] shadow-[0_2px_4px_rgba(0,0,0,0.5)] border border-black/30"
              style={{
                transform: `translateY(${legOffsetRight}px) rotate(${legAngleRight}deg)`,
                transformOrigin: 'top center'
              }}
            />
          </div>

          {/* Sombra proyectada en el suelo */}
          <div
            className="mt-1 h-2.5 w-14 rounded-full bg-black/60 blur-[2px] transition-transform duration-100"
            style={{
              transform: `scale(${1 - bodyBob * 0.05})`
            }}
          />
        </div>
      </div>

      {/* ── 5. BOTÓN FLOTANTE DISCRETO PARA PAUSAR / ACTIVAR ── */}
      <div className="fixed bottom-4 left-5 z-[99990] flex items-center gap-2">
        <button
          onClick={() => {
            const next = !isPaused;
            setIsPaused(next);
            if (next) {
              triggerSpeech("¡Me voy a dormir la siesta! Zzz 😴", 2500);
              setState('napping');
            } else {
              triggerSpeech("¡Despierto y listo para correr! ⚡", 2500);
              setState('idle');
            }
          }}
          className="group flex items-center gap-2 rounded-full border border-white/10 bg-black/80 px-3 py-1.5 text-[11px] font-mono text-zinc-300 shadow-lg backdrop-blur-md transition hover:border-[#6DD94B]/50 hover:bg-zinc-900 cursor-pointer"
          title={isPaused ? "Reactivar persecución de Odielito" : "Pausar Odielito"}
        >
          <span className={`h-2 w-2 rounded-full ${isPaused ? 'bg-zinc-500' : 'bg-[#6DD94B] animate-pulse'}`} />
          <span className="text-zinc-400 group-hover:text-white transition">
            {isPaused ? 'Odielito: En pausa' : 'Odielito: Corriendo'}
          </span>
          <span className="text-[10px] text-zinc-500 underline ml-0.5">
            {isPaused ? 'Despertar' : 'Pausar'}
          </span>
        </button>
      </div>
    </>
  );
}
