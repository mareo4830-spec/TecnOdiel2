import React, { useState } from 'react';

/**
 * Botón Cyber-Terminal Neón
 * Exclusivo de "5. THE CYBER-TERMINAL" (Comida Fusión / Geek)
 * Contorno rectangular transparente con borde neón verde (#00FF66).
 * Al hacer hover se rellena con patrón ASCII o verde parpadeante.
 */
export const CyberTerminalButton = ({
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
      className={`relative font-mono uppercase text-xs sm:text-sm tracking-[0.2em] px-6 py-3 border-2 border-[#00FF66] text-[#00FF66] bg-transparent cursor-pointer select-none transition-all duration-200 overflow-hidden ${
        hovered ? 'bg-[#00FF66] !text-black shadow-[0_0_20px_#00FF66]' : ''
      } ${className}`}
    >
      <span className="relative z-10 font-bold flex items-center gap-2">
        <span>[&gt;]</span>
        <span>{hovered ? `[EXEC::${children}]` : children}</span>
      </span>

      {/* Relleno ASCII dinámico en hover */}
      {hovered && (
        <span
          aria-hidden="true"
          className="absolute inset-0 opacity-15 text-[8px] leading-tight select-none pointer-events-none break-all"
        >
          0101010111001010101010101001101010101010101010101010101
        </span>
      )}
    </button>
  );
};

export default CyberTerminalButton;
