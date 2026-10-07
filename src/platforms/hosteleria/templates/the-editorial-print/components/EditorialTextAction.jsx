import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Acción Editorial Exclusiva
 * REGLA ESTRICTA: No hay botones. Solo texto fino y mayúsculo.
 * El hover engrosa el texto y añade un subrayado ultra-fino.
 */
export const EditorialTextAction = ({
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
      className={`relative inline-block font-serif uppercase tracking-[0.25em] text-xs sm:text-sm text-neutral-900 transition-all duration-500 cursor-pointer select-none bg-transparent border-0 p-0 ${
        hovered ? 'font-bold' : 'font-light'
      } ${className}`}
    >
      <span>{children}</span>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="absolute bottom-[-2px] left-0 w-full h-[0.75px] bg-black origin-left"
      />
    </button>
  );
};

export default EditorialTextAction;
