import React from 'react';
import CinematicTextReveal from './CinematicTextReveal.jsx';
import CinematicMagneticLink from './CinematicMagneticLink.jsx';

/**
 * Footer Cinemático Editorial (Instagram Luxury Reference)
 * Exclusivo de "1. THE AWWWARDS CINEMATIC"
 * Tipografía monumental, créditos de cine y enlaces magnéticos.
 */
export const CinematicFooter = ({ tenant }) => {
  return (
    <footer className="relative w-full bg-black text-white border-t border-neutral-900 py-20 px-6 md:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col justify-between min-h-[50vh]">
        {/* Metadatos y Ubicación */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-neutral-900 pb-16">
          <div className="md:col-span-5 space-y-4">
            <span className="font-mono text-xs text-neutral-500 tracking-[0.3em] uppercase block">
              LOCALIZACIÓN & RESERVAS
            </span>
            <p className="text-sm font-light text-neutral-300 leading-relaxed max-w-sm">
              {tenant?.meta?.address || 'Paseo de la Castellana 142, Subsuelo Privé, Madrid'}
            </p>
            <p className="text-xs font-mono text-neutral-500 tracking-wider">
              {tenant?.meta?.reservationPhone || '+34 910 889 201'}
            </p>
          </div>

          <div className="md:col-span-4 space-y-4">
            <span className="font-mono text-xs text-neutral-500 tracking-[0.3em] uppercase block">
              HORARIO DE APERTURA
            </span>
            <p className="text-sm font-light text-neutral-300 leading-relaxed">
              {tenant?.meta?.hours || 'Miércoles a Domingo · 20:00 — 02:00'}
            </p>
            <p className="text-xs font-mono text-neutral-500 tracking-wider">
              ESTRICTO CUMPLIMIENTO HORARIO
            </p>
          </div>

          <div className="md:col-span-3 space-y-4">
            <span className="font-mono text-xs text-neutral-500 tracking-[0.3em] uppercase block">
              RED SOCIAL PRIVADA
            </span>
            <div>
              <CinematicMagneticLink
                href={`https://instagram.com`}
                target="_blank"
                rel="noopener noreferrer"
                size="text-sm sm:text-base"
                tracking="tracking-[0.2em]"
              >
                {tenant?.meta?.instagram || '@NOIR.ATELIER'}
              </CinematicMagneticLink>
            </div>
          </div>
        </div>

        {/* Cierre Monumental / Tipografía del Tenant en Gran Formato */}
        <div className="pt-16 pb-8">
          <CinematicTextReveal duration={1.2}>
            <div className="text-[12vw] font-black uppercase tracking-[-0.05em] leading-none text-neutral-800 hover:text-neutral-100 transition-colors duration-700 select-none">
              {tenant?.name || 'NOIR & ATELIER'}
            </div>
          </CinematicTextReveal>
        </div>

        {/* Fila de créditos finales tipo película */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono tracking-[0.3em] text-neutral-600 uppercase border-t border-neutral-900/80 pt-8 gap-4">
          <div>
            © MMXXVI {tenant?.name || 'NOIR & ATELIER'}. TODOS LOS DERECHOS RESERVADOS.
          </div>
          <div>
            AWWWARDS SITE OF THE DAY CANDIDATE · MULTI-TENANT ARCHITECTURE
          </div>
          <div className="cursor-pointer hover:text-white transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            RETORNAR AL CENIT ↑
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CinematicFooter;
