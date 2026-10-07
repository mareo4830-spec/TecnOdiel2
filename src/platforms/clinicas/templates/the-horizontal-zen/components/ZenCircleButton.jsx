import React from 'react';
import { motion } from 'framer-motion';

/**
 * Botón Círculo Translúcido Zen
 * Exclusivo de "4. THE HORIZONTAL ZEN" (Psicología / Spa)
 * REGLA: Círculo perfecto translúcido con micro-ondas concéntricas.
 */
export const ZenCircleButton = ({
  children,
  onClick,
  className = ''
}) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`relative w-28 h-28 rounded-full bg-white/40 backdrop-blur-md border border-[#D5CEC2] text-[#4A453E] text-[11px] font-sans tracking-[0.2em] uppercase flex items-center justify-center text-center p-3 cursor-pointer select-none shadow-sm transition-all hover:bg-white/70 hover:shadow-md ${className}`}
    >
      <span className="relative z-10">{children}</span>
      {/* Micro-onda circular decorativa */}
      <span className="absolute inset-0 rounded-full border border-white/60 animate-ping opacity-20 pointer-events-none" />
    </motion.button>
  );
};

export default ZenCircleButton;
