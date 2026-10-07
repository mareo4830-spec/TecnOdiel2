import React from 'react';

/**
 * Botón Sólido de Máximo Contraste y Usabilidad
 * Exclusivo de "6. THE TECH-ORTHO" (Ortodoncia Avanzada)
 * REGLA: Bloque sólido azul (#0055FF) sin efectos locos, máxima usabilidad y contraste clínico.
 */
export const OrthoSolidButton = ({
  children,
  onClick,
  className = ''
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`bg-[#0055FF] hover:bg-[#0043CC] active:bg-[#0037A8] text-white font-sans font-semibold tracking-wide text-sm px-7 py-3.5 rounded-none border border-[#0037A8] transition-colors cursor-pointer select-none inline-flex items-center justify-center shadow-sm ${className}`}
    >
      <span>{children}</span>
    </button>
  );
};

export default OrthoSolidButton;
