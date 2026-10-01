import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export default function CinematicIntro({ onComplete, subtitle = "Webs que Facturan • Soluciones Reales" }) {
  // progress represents fade state from 0 (fully visible) to 1 (fully faded out)
  const [progress, setProgress] = useState(0);

  const progressRef = useRef(0);
  const isCompletedRef = useRef(false);
  const isAnimatingExitRef = useRef(false);
  const touchStartY = useRef(null);
  const touchStartX = useRef(null);
  const rafId = useRef(null);
  const accumulatedScroll = useRef(0);

  // Smooth animation to target progress using cubic-bezier ease-out
  const animateTo = useCallback((target, duration = 360, onEnd) => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    const start = progressRef.current;
    const diff = target - start;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      // Luxury smooth ease-out curve
      const ease = 1 - Math.pow(1 - t, 3);
      const current = start + diff * ease;

      progressRef.current = current;
      setProgress(current);

      if (t < 1) {
        rafId.current = requestAnimationFrame(step);
      } else {
        progressRef.current = target;
        setProgress(target);
        if (onEnd) onEnd();
      }
    };

    rafId.current = requestAnimationFrame(step);
  }, []);

  const completeIntro = useCallback(() => {
    if (isCompletedRef.current) return;
    isCompletedRef.current = true;
    isAnimatingExitRef.current = true;

    animateTo(1, 380, () => {
      onComplete();
    });
  }, [animateTo, onComplete]);

  useEffect(() => {
    let wheelTimeout = null;

    // 1. Mouse wheel / trackpad: gradual progressive fade-out
    const handleWheel = (e) => {
      if (isCompletedRef.current || isAnimatingExitRef.current) return;

      if (e.deltaY > 0) {
        // Scrolling down -> fade out
        accumulatedScroll.current += Math.max(e.deltaY * 0.45, 10);
      } else if (e.deltaY < 0) {
        // Scrolling up -> fade back in
        accumulatedScroll.current = Math.max(0, accumulatedScroll.current + e.deltaY * 0.45);
      }

      // 120px total scroll distance for complete fade
      const targetP = Math.min(Math.max(accumulatedScroll.current / 120, 0), 1);
      progressRef.current = targetP;
      setProgress(targetP);

      if (targetP >= 0.85) {
        completeIntro();
      } else {
        // If user stops scrolling before completing, gently restore
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
          if (!isCompletedRef.current && !isAnimatingExitRef.current && progressRef.current < 0.85) {
            accumulatedScroll.current = 0;
            animateTo(0, 280);
          }
        }, 900);
      }
    };

    // 2. Touch gesture handling: fluid finger tracking
    const handleTouchStart = (e) => {
      if (isCompletedRef.current || isAnimatingExitRef.current) return;
      if (e.touches && e.touches.length > 0) {
        touchStartY.current = e.touches[0].clientY;
        touchStartX.current = e.touches[0].clientX;
      }
    };

    const handleTouchMove = (e) => {
      if (isCompletedRef.current || isAnimatingExitRef.current) return;
      if (touchStartY.current === null || !e.touches || e.touches.length === 0) return;

      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const deltaY = currentY - touchStartY.current;
      const deltaX = currentX - touchStartX.current;

      // Only respond to predominantly vertical movement
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        const distance = Math.abs(deltaY);
        // 130px distance for full progressive fade
        const p = Math.min(Math.max(distance / 130, 0), 1);
        progressRef.current = p;
        setProgress(p);
      }
    };

    const handleTouchEnd = () => {
      if (isCompletedRef.current || isAnimatingExitRef.current) return;
      touchStartY.current = null;
      touchStartX.current = null;

      // If user pulled past 30%, smoothly complete the exit
      if (progressRef.current >= 0.3) {
        completeIntro();
      } else {
        // Otherwise, spring back smoothly
        animateTo(0, 240);
      }
    };

    // 3. Fallback window scroll listener
    const handleScroll = () => {
      if (window.scrollY > 8 && !isCompletedRef.current) {
        completeIntro();
      }
    };

    // 4. Keyboard keys
    const handleKeyDown = (e) => {
      if (isCompletedRef.current) return;
      if (['ArrowDown', 'PageDown', 'Space', 'Enter'].includes(e.key)) {
        completeIntro();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(wheelTimeout);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [completeIntro, animateTo]);

  // Split letter kinetic animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 40, rotateX: 60, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 14,
        stiffness: 150,
      },
    },
  };

  // Continuous visual styles driven by progress (GPU-accelerated)
  const currentOpacity = Math.max(0, 1 - progress);
  const currentTranslateY = -progress * 75;
  const currentScale = 1 + progress * 0.03;
  const currentBlur = progress * 10;
  const promptOpacity = Math.max(0, 1 - progress * 2.4);

  return (
    <div
      onClick={completeIntro}
      style={{
        opacity: currentOpacity,
        transform: `translate3d(0, ${currentTranslateY}px, 0) scale(${currentScale})`,
        filter: currentBlur > 0.2 ? `blur(${currentBlur}px)` : 'none',
        pointerEvents: progress >= 0.9 ? 'none' : 'auto',
        willChange: 'opacity, transform, filter',
      }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black select-none cursor-pointer overflow-hidden touch-none"
    >
      {/* Background ambient lighting */}
      <div 
        className="pointer-events-none absolute inset-0 bg-grid-subtle" 
        style={{ opacity: 0.35 * (1 - progress) }} 
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: 'easeInOut',
        }}
        style={{ opacity: (1 - progress) * 0.25 }}
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-emerald-500/20 via-white/10 to-cyan-500/20 blur-[130px] rounded-full"
      />

      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-6xl">
        {/* Top Radar Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 backdrop-blur-xl"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-zinc-300">
            TECNODIEL // HUELVA
          </span>
        </motion.div>

        {/* Massive Giant Title */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-6xl xs:text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] font-black tracking-tighter text-white uppercase leading-none select-none perspective-1000"
        >
          <motion.span variants={letterVariants} className="inline-block text-white">
            Tecn
          </motion.span>
          <motion.span variants={letterVariants} className="inline-block text-metallic-pure text-glow">
            Odiel
          </motion.span>
        </motion.h1>

        {/* Subtitle with laser sweep */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-4 sm:mt-6 text-xs sm:text-base md:text-lg font-mono tracking-widest uppercase text-zinc-400"
        >
          {subtitle}
        </motion.p>

        {/* Visual indicator to slide down - fades out early as soon as slide starts */}
        <div
          style={{ opacity: promptOpacity }}
          className="mt-10 sm:mt-14 inline-flex flex-col items-center gap-2 group cursor-pointer transition-opacity duration-150"
          onClick={(e) => {
            e.stopPropagation();
            completeIntro();
          }}
        >
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/15 bg-white/[0.05] backdrop-blur-xl group-hover:border-emerald-500/50 group-hover:bg-white/[0.1] transition-all duration-300 shadow-lg shadow-black/40">
            <ArrowDown className="h-4 w-4 text-emerald-400 animate-bounce" />
            <span className="text-xs sm:text-sm font-medium tracking-wide text-zinc-200">
              Desliza para abajo
            </span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
            o toca para entrar
          </span>
        </div>
      </div>
    </div>
  );
}
