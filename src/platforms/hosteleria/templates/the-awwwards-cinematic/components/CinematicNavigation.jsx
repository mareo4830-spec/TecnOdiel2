import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CinematicMagneticLink from './CinematicMagneticLink.jsx';

/**
 * Navegación Flotante Minimalista de Vanguardia
 * Exclusivo de "1. THE AWWWARDS CINEMATIC"
 * mix-blend-mode: difference para interactuar con cualquier medio o imagen bajo scroll,
 * Enlaces magnéticos y menú full-screen con clip-path.
 */
export const CinematicNavigation = ({ tenant, onBookingClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-700 px-6 md:px-16 py-6 flex items-center justify-between ${
          scrolled
            ? 'bg-black/60 backdrop-blur-md border-b border-neutral-900/60'
            : 'bg-transparent'
        }`}
      >
        {/* Logotipo / Marca del Tenant con mix-blend-mode */}
        <div className="mix-blend-difference cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="font-extralight text-lg md:text-xl tracking-[0.3em] uppercase text-white block">
            {tenant?.name || 'NOIR & ATELIER'}
          </span>
          <span className="font-mono text-[9px] tracking-[0.4em] text-neutral-400 uppercase block">
            CUISINE CINÉMATIQUE
          </span>
        </div>

        {/* Acciones principales de escritorio */}
        <nav className="hidden md:flex items-center space-x-12 mix-blend-difference">
          <CinematicMagneticLink
            onClick={() => scrollTo('story')}
            size="text-xs"
            tracking="tracking-[0.3em]"
          >
            FILOSOFÍA
          </CinematicMagneticLink>

          <CinematicMagneticLink
            onClick={() => scrollTo('menu')}
            size="text-xs"
            tracking="tracking-[0.3em]"
          >
            LA CARTA
          </CinematicMagneticLink>

          <CinematicMagneticLink
            onClick={() => {
              if (onBookingClick) onBookingClick();
              else scrollTo('booking');
            }}
            size="text-xs"
            tracking="tracking-[0.3em]"
          >
            PASE PRIVADO
          </CinematicMagneticLink>
        </nav>

        {/* Gatillo de Menú Completo para Móvil / Experiencia Inmersiva */}
        <div className="flex items-center">
          <CinematicMagneticLink
            onClick={() => setMenuOpen(!menuOpen)}
            size="text-xs md:text-sm"
            tracking="tracking-[0.3em]"
          >
            {menuOpen ? 'CERRAR [✕]' : 'ÍNDICE [≡]'}
          </CinematicMagneticLink>
        </div>
      </header>

      {/* Menú de Pantalla Completa revelado con Clip-Path */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
            animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
            exit={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-black flex flex-col justify-between p-8 md:p-20 overflow-hidden"
          >
            <div className="flex justify-between items-center text-xs font-mono text-neutral-500 tracking-widest uppercase">
              <span>DIRECTORIO GENERAL</span>
              <span>{tenant?.name}</span>
            </div>

            <div className="flex flex-col space-y-8 my-auto pl-4">
              <CinematicMagneticLink
                onClick={() => scrollTo('hero')}
                size="text-3xl sm:text-5xl md:text-6xl"
                tracking="tracking-[0.15em]"
              >
                01. PRÓLOGO
              </CinematicMagneticLink>

              <CinematicMagneticLink
                onClick={() => scrollTo('story')}
                size="text-3xl sm:text-5xl md:text-6xl"
                tracking="tracking-[0.15em]"
              >
                02. EL MANIFIESTO
              </CinematicMagneticLink>

              <CinematicMagneticLink
                onClick={() => scrollTo('menu')}
                size="text-3xl sm:text-5xl md:text-6xl"
                tracking="tracking-[0.15em]"
              >
                03. REPERTORIO GASTRONÓMICO
              </CinematicMagneticLink>

              <CinematicMagneticLink
                onClick={() => {
                  setMenuOpen(false);
                  if (onBookingClick) onBookingClick();
                  else scrollTo('booking');
                }}
                size="text-3xl sm:text-5xl md:text-6xl"
                tracking="tracking-[0.15em]"
              >
                04. SOLICITUD DE PASE
              </CinematicMagneticLink>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 text-xs font-mono text-neutral-500 tracking-widest uppercase border-t border-neutral-900 pt-6">
              <span>{tenant?.meta?.address || 'MADRID'}</span>
              <span>{tenant?.meta?.hours}</span>
              <span>{tenant?.meta?.instagram}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CinematicNavigation;
