import React from 'react';

/**
 * Filtro de grano de película cinematográfico analógico (Film Grain Overlay)
 * Exclusivo de la plantilla "1. THE AWWWARDS CINEMATIC".
 * Genera textura táctil con ruido dinámico de 35mm y viñeta perimetral.
 */
export const CinematicNoiseGrain = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden mix-blend-overlay opacity-30 select-none"
    >
      <svg className="w-full h-full opacity-60">
        <filter id="cinematic-film-grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
          />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter="url(#cinematic-film-grain-filter)"
        />
      </svg>
      {/* Viñeta perimetral cinematográfica tipo lente anamórfica */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)]" 
      />
    </div>
  );
};

export default CinematicNoiseGrain;
