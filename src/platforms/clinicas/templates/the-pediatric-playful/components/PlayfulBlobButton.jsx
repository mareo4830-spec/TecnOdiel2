import React from 'react';
import { motion } from 'framer-motion';

/**
 * Botón Elástico Tipo Goma Playful
 * Exclusivo de "3. THE PEDIATRIC PLAYFUL" (Pediatría)
 * Se estira y encoge al pulsarlo con físicas ultra elásticas y formas redondeadas amigables.
 */
export const PlayfulBlobButton = ({
  children,
  onClick,
  color = 'bg-[#70D6BC]', // menta vibrante
  textColor = 'text-slate-900',
  className = ''
}) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scaleX: 1.25, scaleY: 0.8, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 500, damping: 12 }}
      className={`rounded-full px-8 py-4 font-bold text-base shadow-lg cursor-pointer select-none transition-colors inline-flex items-center justify-center gap-2 ${color} ${textColor} ${className}`}
    >
      <span>{children}</span>
      <span className="text-xl">🎈</span>
    </motion.button>
  );
};

export default PlayfulBlobButton;
