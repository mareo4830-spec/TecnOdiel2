import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Sparkles } from 'lucide-react';

export default function CinematicIntro({ subtitle = "Webs para Clínicas y Salud • Citas Médicas Directas", onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black select-none pointer-events-none"
    >
      <div className="relative flex flex-col items-center text-center px-4">
        {/* Glow */}
        <div className="absolute w-[400px] h-[300px] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none -translate-y-12" />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-4 backdrop-blur-xl"
        >
          <Stethoscope className="w-3.5 h-3.5" />
          <span>TECNODIEL CYS — HEALTH ENGINE</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-2"
        >
          Tecn<span className="text-cyan-400">Odiel</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">CyS</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xs sm:text-sm font-mono text-zinc-400 max-w-md"
        >
          {subtitle}
        </motion.p>
      </div>
    </motion.div>
  );
}
