import React from 'react';
import { motion } from 'framer-motion';

/**
 * Botón Rústico Orgánico con Borde Irregular Hecho a Mano
 * Exclusivo de "6. THE RUSTIC ORGANIC" (Asadores tradicionales)
 * REGLA: Formas irregulares hechas con un border-radius complejo
 * (255px 15px 225px 15px / 15px 225px 15px 255px), tonos tierra y textura artesanal.
 */
export const RusticOrganicButton = ({
  children,
  onClick,
  className = ''
}) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.04, rotate: -1 }}
      whileTap={{ scale: 0.96, rotate: 1 }}
      style={{
        borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px'
      }}
      className={`relative bg-[#8B5A2B] hover:bg-[#72451E] text-[#F5EFEB] font-serif tracking-widest text-sm sm:text-base px-8 py-4 border-2 border-[#543317] shadow-lg cursor-pointer select-none transition-colors inline-flex items-center justify-center ${className}`}
    >
      <span>{children}</span>
    </motion.button>
  );
};

export default RusticOrganicButton;
