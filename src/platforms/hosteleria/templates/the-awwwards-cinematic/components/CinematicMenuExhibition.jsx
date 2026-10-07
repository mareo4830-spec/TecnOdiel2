import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CinematicTextReveal from './CinematicTextReveal.jsx';
import CinematicMagneticLink from './CinematicMagneticLink.jsx';

/**
 * Exhibición Culinaria & Galería de Platos de Autor
 * Exclusivo de "1. THE AWWWARDS CINEMATIC"
 * Cada plato se presenta como una escena numerada con previsualización flotante,
 * textos gigantes con mix-blend-mode sobre fotografía macro, y selección magnética.
 */
export const CinematicMenuExhibition = ({ tenant, onBookingClick }) => {
  const [activeDishIndex, setActiveDishIndex] = useState(0);

  const dishes = tenant?.signatureDishes || [];
  const passes = tenant?.experiencePasses || [];
  const currentDish = dishes[activeDishIndex] || dishes[0];

  return (
    <section className="relative w-full min-h-screen bg-black py-28 md:py-40 px-6 md:px-16 overflow-hidden border-t border-neutral-900">
      {/* Cabecera de la sección */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
        <div>
          <CinematicTextReveal delay={0.1}>
            <span className="text-xs font-mono tracking-[0.4em] text-neutral-500 uppercase">
              COLECCIÓN DE TEMPORADA // ACTOS & CREACIONES
            </span>
          </CinematicTextReveal>
          <CinematicTextReveal delay={0.2} duration={1.2}>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-light uppercase tracking-tighter text-white mt-4">
              EL REPERTORIO <span className="font-serif italic text-neutral-400">EFÍMERO</span>
            </h2>
          </CinematicTextReveal>
        </div>

        <div className="max-w-md">
          <CinematicTextReveal delay={0.3}>
            <p className="text-sm tracking-wider text-neutral-400 font-light">
              Platos concebidos bajo el influjo de las estaciones crudas. La materia prima dicta el
              ritmo; el fuego sentencia el resultado.
            </p>
          </CinematicTextReveal>
        </div>
      </div>

      {/* Showcase Interactivo Dividido: Lista Tipográfica + Visualizador Cinemático */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Lista de Platos - Tipografía pura y magnética */}
        <div className="lg:col-span-6 space-y-8">
          {dishes.map((dish, idx) => {
            const isSelected = idx === activeDishIndex;
            return (
              <div
                key={dish.id || idx}
                onMouseEnter={() => setActiveDishIndex(idx)}
                onClick={() => setActiveDishIndex(idx)}
                className="group relative cursor-pointer border-b border-neutral-900/90 pb-6 transition-colors"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-xs tracking-widest text-neutral-600 transition-colors group-hover:text-neutral-400">
                    {dish.code || `ACTO 0${idx + 1}`}
                  </span>
                  <span className="font-mono text-[11px] tracking-widest text-neutral-700">
                    {dish.year || '2026'}
                  </span>
                </div>

                <div className="mt-2 overflow-hidden">
                  <h3
                    className={`text-2xl sm:text-3xl md:text-4xl uppercase font-light tracking-wide transition-all duration-300 ${
                      isSelected
                        ? 'text-white translate-x-3'
                        : 'text-neutral-500 group-hover:text-neutral-300 group-hover:translate-x-1'
                    }`}
                  >
                    {dish.name}
                  </h3>
                </div>

                <p className="mt-2 text-xs sm:text-sm text-neutral-400 font-light line-clamp-2 pr-6">
                  {dish.description}
                </p>

                {/* Línea indicadora de foco activo */}
                <motion.div
                  initial={false}
                  animate={{
                    scaleX: isSelected ? 1 : 0,
                    opacity: isSelected ? 1 : 0
                  }}
                  transition={{ duration: 0.4 }}
                  className="absolute bottom-0 left-0 w-full h-[1.5px] bg-white origin-left"
                />
              </div>
            );
          })}
        </div>

        {/* Visualizador Macro con Mix-Blend y Filtro de Película */}
        <div className="lg:col-span-6 relative">
          <div className="relative aspect-square sm:aspect-[4/5] w-full overflow-hidden bg-neutral-950 border border-neutral-900">
            <AnimatePresence mode="wait">
              {currentDish && (
                <motion.div
                  key={currentDish.id || activeDishIndex}
                  initial={{ opacity: 0, scale: 1.15, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.95, filter: 'blur(6px)' }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 w-full h-full"
                >
                  <img
                    src={currentDish.image}
                    alt={currentDish.name}
                    className="w-full h-full object-cover filter brightness-[0.65] contrast-[1.2]"
                  />
                  {/* Superposición sutil de viñeta */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />

                  {/* Texto flotante con mix-blend-difference */}
                  <div className="absolute bottom-6 left-6 right-6 z-10 mix-blend-difference">
                    <span className="block font-mono text-[10px] tracking-[0.3em] text-white uppercase mb-1">
                      {currentDish.code}
                    </span>
                    <h4 className="text-2xl sm:text-3xl font-extralight tracking-tight text-white uppercase">
                      {currentDish.name}
                    </h4>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute top-4 right-4 z-20 font-mono text-[9px] tracking-widest text-neutral-400 bg-black/60 backdrop-blur-sm px-2 py-1">
              {String(activeDishIndex + 1).padStart(2, '0')} / {String(dishes.length).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>

      {/* Pases de Experiencia (Menús degustación en formato de alta costura) */}
      {passes.length > 0 && (
        <div className="max-w-7xl mx-auto mt-28 border-t border-neutral-900 pt-16">
          <CinematicTextReveal delay={0.1}>
            <span className="text-xs font-mono tracking-[0.4em] text-neutral-500 uppercase">
              ITINERARIOS DE DEGUSTACIÓN
            </span>
          </CinematicTextReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
            {passes.map((pass, pIdx) => (
              <div
                key={pass.id || pIdx}
                className="relative border border-neutral-900 p-8 sm:p-12 hover:border-neutral-700 transition-colors bg-gradient-to-b from-neutral-950/60 to-black"
              >
                <div className="flex justify-between items-baseline mb-6">
                  <span className="font-mono text-xs tracking-widest text-neutral-400">
                    {pass.steps}
                  </span>
                  <span className="text-3xl sm:text-4xl font-light text-white tracking-tight">
                    {pass.price}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extralight uppercase text-white tracking-wide mb-4">
                  {pass.title}
                </h3>

                <p className="text-sm font-light text-neutral-400 leading-relaxed mb-8">
                  {pass.notes}
                </p>

                <CinematicMagneticLink
                  onClick={onBookingClick}
                  size="text-sm sm:text-base"
                  tracking="tracking-[0.25em]"
                >
                  RESERVAR ESTE ITINERARIO →
                </CinematicMagneticLink>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default CinematicMenuExhibition;
