import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import CinematicTextReveal from './CinematicTextReveal.jsx';
import CinematicMagneticLink from './CinematicMagneticLink.jsx';

/**
 * Hero Monumental de "1. THE AWWWARDS CINEMATIC"
 * Superpone tipografía monumental con mix-blend-mode: difference sobre vídeo/imágenes oscuras,
 * Parallax agresivo calculado con useScroll y useTransform, y revelado de texto clip-path.
 */
export const CinematicHero = ({ tenant, onExploreClick, onBookingClick }) => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  // Parallax agresivo multicapa (Awwwards standard)
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-45%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const subtitleY = useTransform(scrollYProgress, [0, 1], ['0%', '60%']);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col justify-between selection:bg-white selection:text-black"
    >
      {/* Fondo Media con Parallax Agresivo y Filtros Oscuros */}
      <motion.div
        style={{ y: mediaY, scale: mediaScale }}
        className="absolute inset-0 w-full h-[125%] -top-[12%] z-0 pointer-events-none"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={tenant?.heroImage}
          className="w-full h-full object-cover filter brightness-[0.42] contrast-[1.25] grayscale-[0.25]"
        >
          <source
            src={tenant?.heroVideo || 'https://assets.mixkit.co/videos/preview/mixkit-chef-plating-a-gourmet-dish-40919-large.mp4'}
            type="video/mp4"
          />
        </video>

        {/* Gradientes de penumbra cinemática */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-transparent to-black/90" />
      </motion.div>

      {/* Barra superior con metadatos de cine (Coordenadas, estrellas, código) */}
      <div className="relative z-20 w-full px-6 md:px-16 pt-8 flex items-center justify-between text-[11px] md:text-xs tracking-[0.35em] text-neutral-400 uppercase">
        <div className="flex items-center space-x-4">
          <span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <span>REC / 24FPS · {tenant?.city || 'MADRID'}</span>
        </div>
        <div className="hidden sm:block">
          <span>{tenant?.michelinStars ? `★★ ${tenant.michelinStars} GUÍA MICHELIN` : 'HAUTE CUISINE'}</span>
        </div>
        <div>
          <span>EST. MMXXVI</span>
        </div>
      </div>

      {/* Contenedor Central: Tipografía Monumental con mix-blend-mode: difference */}
      <div className="relative z-20 w-full px-6 md:px-16 py-12 my-auto flex flex-col justify-center">
        {/* Subtítulo superior revelado con máscara de texto */}
        <motion.div style={{ y: subtitleY }} className="mb-4">
          <CinematicTextReveal delay={0.2} duration={0.9}>
            <p className="text-xs sm:text-sm md:text-base tracking-[0.45em] text-neutral-400 font-mono uppercase">
              {tenant?.tagline || 'ATELIER GASTRONÓMICO RADICAL'}
            </p>
          </CinematicTextReveal>
        </motion.div>

        {/* Título Principal Gigante con mix-blend-difference */}
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="relative mix-blend-difference select-none"
        >
          <div className="overflow-hidden">
            <CinematicTextReveal delay={0.3} duration={1.3}>
              <h1 className="text-[13vw] leading-[0.82] font-black tracking-[-0.04em] text-white uppercase break-words">
                {tenant?.name?.split('&')[0]?.trim() || 'NOIR'}
              </h1>
            </CinematicTextReveal>
          </div>

          <div className="overflow-hidden pl-[6vw]">
            <CinematicTextReveal delay={0.45} duration={1.3}>
              <h1 className="text-[13vw] leading-[0.82] font-black tracking-[-0.04em] text-white/95 uppercase break-words italic font-serif">
                {tenant?.name?.includes('&') ? `& ${tenant.name.split('&')[1].trim()}` : 'ATELIER'}
              </h1>
            </CinematicTextReveal>
          </div>
        </motion.div>

        {/* Cita conceptual o manifiesto */}
        <div className="mt-8 max-w-xl">
          <CinematicTextReveal delay={0.65} duration={1.1}>
            <p className="text-sm md:text-base leading-relaxed tracking-wider text-neutral-300 font-light">
              {tenant?.description ||
                'Una dramaturgia culinaria sin precedentes donde el carbón, la ceniza y la técnica ancestral definen un nuevo vocabulario sensorial.'}
            </p>
          </CinematicTextReveal>
        </div>
      </div>

      {/* Zona Inferior: Acciones exclusivamente magnéticas (SIN BOTONES RECTANGULARES) */}
      <div className="relative z-20 w-full px-6 md:px-16 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 border-t border-neutral-900/80 pt-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 md:gap-14">
          <CinematicMagneticLink
            onClick={onBookingClick}
            size="text-lg sm:text-2xl"
            tracking="tracking-[0.25em]"
          >
            SOLICITAR PASE PRIVADO →
          </CinematicMagneticLink>

          <CinematicMagneticLink
            onClick={onExploreClick}
            size="text-sm sm:text-lg"
            tracking="tracking-[0.3em]"
            lineColor="bg-neutral-400"
          >
            EXPLORAR LA CARTA
          </CinematicMagneticLink>
        </div>

        {/* Scroll Indicator Cinemático */}
        <div className="flex items-center space-x-4 text-[10px] tracking-[0.3em] text-neutral-500 uppercase font-mono">
          <span>DESLIZAR HACIA EL VACÍO</span>
          <div className="w-12 h-[1px] bg-neutral-700 relative overflow-hidden">
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="w-full h-full bg-white"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CinematicHero;
