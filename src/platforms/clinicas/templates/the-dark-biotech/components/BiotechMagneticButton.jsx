import React, { useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

/**
 * Botón Magnético Biotech con Brillos Interiores Azules
 * Exclusivo de "2. THE DARK BIOTECH" (Medicina Deportiva)
 */
export const BiotechMagneticButton = ({
  children,
  onClick,
  className = ''
}) => {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  const springConfig = { damping: 15, stiffness: 150 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { top, left, width, height } = ref.current.getBoundingClientRect();
    x.set((clientX - (left + width / 2)) * 0.3);
    y.set((clientY - (top + height / 2)) * 0.3);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className={`relative px-8 py-4 rounded-xl border border-cyan-500/40 bg-gradient-to-r from-blue-950/80 to-slate-900/90 text-cyan-300 font-mono text-xs tracking-[0.25em] uppercase select-none cursor-pointer transition-all duration-300 ${
        hovered
          ? 'shadow-[inset_0_0_25px_rgba(6,182,212,0.6),0_0_20px_rgba(6,182,212,0.3)] border-cyan-400 text-white'
          : 'shadow-[inset_0_0_10px_rgba(6,182,212,0.2)]'
      } ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        <span>{children}</span>
      </span>
    </motion.button>
  );
};

export default BiotechMagneticButton;
