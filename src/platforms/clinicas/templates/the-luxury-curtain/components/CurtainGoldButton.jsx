import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Botón con Líneas Finas Doradas Envolventes
 * Exclusivo de "5. THE LUXURY CURTAIN" (Clínicas Estéticas)
 * REGLA: Líneas finas doradas que envuelven el texto lentamente al hacer hover.
 */
export const CurtainGoldButton = ({
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
      className={`relative px-8 py-4 bg-transparent text-[#D4AF37] font-serif tracking-[0.25em] text-xs sm:text-sm uppercase cursor-pointer select-none transition-colors duration-500 border border-[#D4AF37]/30 ${
        hovered ? 'text-white' : ''
      } ${className}`}
    >
      <span className="relative z-10">{children}</span>

      {/* Líneas doradas envolventes en hover */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-0 w-full h-[1px] bg-[#D4AF37] origin-left"
      />
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 right-0 w-full h-[1px] bg-[#D4AF37] origin-right"
      />
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: hovered ? 1 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="absolute top-0 left-0 w-[1px] h-full bg-[#D4AF37] origin-top"
      />
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: hovered ? 1 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="absolute top-0 right-0 w-[1px] h-full bg-[#D4AF37] origin-bottom"
      />
    </button>
  );
};

export default CurtainGoldButton;
