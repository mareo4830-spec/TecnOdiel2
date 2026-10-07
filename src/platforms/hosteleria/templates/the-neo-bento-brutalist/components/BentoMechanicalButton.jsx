import React from 'react';
import { motion } from 'framer-motion';

/**
 * Botón Mecánico Neo-Brutalista Gigante
 * Exclusivo de "2. THE NEO-BENTO BRUTALIST"
 * REGLA: Bloque gigante de color primario con border-4 border-black.
 * Al hacer hover/active baja 8px perdiendo la sombra sólida simulando un botón mecánico real.
 */
export const BentoMechanicalButton = ({
  children,
  onClick,
  variant = 'yellow', // 'yellow' | 'cyan' | 'pink'
  className = ''
}) => {
  const bgColors = {
    yellow: 'bg-[#FFE600] text-black',
    cyan: 'bg-[#00F0FF] text-black',
    pink: 'bg-[#FF0055] text-white'
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ x: 6, y: 6, boxShadow: '2px 2px 0px #000000' }}
      whileTap={{ x: 8, y: 8, boxShadow: '0px 0px 0px #000000' }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      style={{ boxShadow: '8px 8px 0px #000000' }}
      className={`font-black uppercase tracking-wider text-lg sm:text-xl md:text-2xl px-8 py-5 border-4 border-black select-none cursor-pointer inline-flex items-center justify-center transition-colors ${bgColors[variant] || bgColors.yellow} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default BentoMechanicalButton;
