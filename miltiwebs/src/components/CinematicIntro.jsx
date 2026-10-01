import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export default function CinematicIntro({ onComplete, subtitle = "Webs que Facturan • Soluciones Reales" }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Automatically transition after 2.0 seconds of cinematic presentation
    const timer = setTimeout(() => {
      handleFinish();
    }, 2000);

    // Allow user to click, scroll or press any key to instantly transition
    const handleSkip = () => handleFinish();
    window.addEventListener('keydown', handleSkip, { once: true });
    window.addEventListener('wheel', handleSkip, { once: true, passive: true });
    window.addEventListener('touchstart', handleSkip, { once: true, passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleSkip);
      window.removeEventListener('wheel', handleSkip);
      window.removeEventListener('touchstart', handleSkip);
    };
  }, []);

  const handleFinish = () => {
    if (!isExiting) {
      setIsExiting(true);
      setTimeout(() => {
        onComplete();
      }, 700);
    }
  };

  // Split letter animations
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

  return (
    <motion.div
      onClick={handleFinish}
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1, scale: isExiting ? 1.08 : 1, filter: isExiting ? 'blur(10px)' : 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(12px)' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black select-none cursor-pointer overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 bg-grid-subtle opacity-35" />
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

        {/* Subtle skip prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.7 }}
          className="mt-10 sm:mt-14 inline-flex items-center gap-2 text-[10px] sm:text-xs font-mono text-zinc-500 uppercase tracking-widest"
        >
          <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
          <span>Haz clic para entrar</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
