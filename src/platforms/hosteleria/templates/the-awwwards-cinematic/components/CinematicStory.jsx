import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import CinematicTextReveal from './CinematicTextReveal.jsx';
import CinematicMagneticLink from './CinematicMagneticLink.jsx';

/**
 * Sección de Narrativa y Manifiesto Radical
 * Exclusivo de "1. THE AWWWARDS CINEMATIC"
 * Superposición fotográfica con filtros de grano, tipografía gigante con mix-blend-mode
 * y parallax en direcciones opuestas para tensión visual Awwwards.
 */
export const CinematicStory = ({ tenant, onBookingClick }) => {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);
  const textTranslateX = useTransform(scrollYProgress, [0, 1], ['5%', '-15%']);
  const scaleImage = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1, 1.1]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-black py-28 md:py-44 px-6 md:px-16 overflow-hidden border-t border-neutral-900"
    >
      {/* Título de Fondo Cinematográfico Marquee / Parallax horizontal */}
      <motion.div
        style={{ x: textTranslateX }}
        className="absolute top-12 left-0 whitespace-nowrap opacity-10 pointer-events-none select-none z-0"
      >
        <span className="text-[18vw] font-black uppercase tracking-tighter text-white">
          MATERIA · FUEGO · VACÍO · CINEGÉTICA · SILENCIO
        </span>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Columna Izquierda: Imagen vertical con Parallax y Máscara de recorte */}
        <div className="lg:col-span-5 relative">
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-950">
            <motion.div
              style={{ y: imageY, scale: scaleImage }}
              className="absolute inset-0 w-full h-[130%] -top-[15%]"
            >
              <img
                src={tenant?.gallery?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85'}
                alt="Atmósfera Culinaria"
                className="w-full h-full object-cover filter brightness-75 contrast-125 grayscale-[0.4]"
                loading="lazy"
              />
            </motion.div>

            {/* Marcadores de encuadre de cine anamórfico */}
            <div className="absolute top-4 left-4 text-[9px] font-mono tracking-widest text-white/60">
              FRAME // 0048.B
            </div>
            <div className="absolute bottom-4 right-4 text-[9px] font-mono tracking-widest text-white/60">
              LENS 50MM F/1.2
            </div>
            <div className="absolute inset-0 border border-white/10 pointer-events-none" />
          </div>
        </div>

        {/* Columna Derecha: Manifiesto editorial masivo */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-10">
          <div className="border-b border-neutral-900 pb-4">
            <CinematicTextReveal delay={0.1}>
              <span className="text-xs font-mono tracking-[0.4em] text-neutral-500 uppercase">
                MANIFIESTO DISRUPTIVO // 01
              </span>
            </CinematicTextReveal>
          </div>

          <div className="space-y-6">
            <CinematicTextReveal delay={0.2} duration={1.2}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-[-0.03em] text-white leading-[1.08] uppercase">
                NO BUSCAMOS AGRADAR. <br />
                <span className="font-serif italic text-neutral-400">BUSCAMOS SACUDIR</span> LA MEMORIA.
              </h2>
            </CinematicTextReveal>

            <div className="space-y-4 max-w-xl text-neutral-400 font-light text-base md:text-lg leading-relaxed">
              <CinematicTextReveal delay={0.35}>
                <p>
                  Eliminamos los adornos superfluos para enfrentarnos a la pureza de la brasa virgen,
                  la maduración milimétrica y los fondos de cocción reducidos a su esencia más oscura.
                </p>
              </CinematicTextReveal>
              <CinematicTextReveal delay={0.45}>
                <p>
                  Cada pase es concebido como un fotograma irrepetible. No hay cartas estáticas:
                  solo el diálogo diario con agricultores biodinámicos y pescadores de noche cerrada.
                </p>
              </CinematicTextReveal>
            </div>
          </div>

          {/* Enlaces magnéticos de contacto / reserva */}
          <div className="pt-6">
            <CinematicMagneticLink
              onClick={onBookingClick}
              size="text-base sm:text-xl"
              tracking="tracking-[0.25em]"
            >
              EXPERIMENTAR LA NARRATIVA →
            </CinematicMagneticLink>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CinematicStory;
