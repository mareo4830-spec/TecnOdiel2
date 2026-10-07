import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Botón Invisible Suizo con Flecha Revelada
 * Exclusivo de "1. THE ULTRA-MINIMAL SWISS" (Dentales de Lujo)
 * REGLA: Botón invisible que solo revela una flecha fina '→' al pasar el ratón.
 * Micro-interacciones sutiles y tipografía suiza pura.
 */
export const SwissArrowButton = ({
  children,
  onClick,
  className = ''
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`inline-flex items-center gap-2 bg-transparent border-0 p-0 cursor-pointer select-none text-[11px] font-sans tracking-[0.25em] uppercase text-black transition-opacity ${
        hovered ? 'opacity-100' : 'opacity-70'
      } ${className}`}
    >
      <span>{children}</span>
      <motion.span
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -6 }}
        transition={{ duration: 0.2 }}
        className="font-light text-sm"
      >
        →
      </motion.span>
    </button>
  );
};

export default SwissArrowButton;
