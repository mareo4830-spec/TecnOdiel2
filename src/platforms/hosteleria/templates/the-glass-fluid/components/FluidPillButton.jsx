import React from 'react';
import { motion } from 'framer-motion';

/**
 * Botón Píldora Acrílica
 * Exclusivo de "3. THE GLASS FLUID" (Coctelerías Premium)
 * Píldora ultra-redondeada (rounded-full), fondo traslúcido, y al hacer hover
 * el borde interior emite un brillo intenso (inset 0 0 20px rgba(255,255,255,0.5)).
 */
export const FluidPillButton = ({
  children,
  onClick,
  className = ''
}) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{
        scale: 1.05,
        boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.6), 0 10px 30px rgba(120, 50, 255, 0.3)'
      }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative rounded-full px-8 py-4 backdrop-blur-2xl bg-white/10 border border-white/20 text-white font-light tracking-[0.2em] text-sm uppercase transition-all duration-300 shadow-[inset_0_0_8px_rgba(255,255,255,0.2)] ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default FluidPillButton;
