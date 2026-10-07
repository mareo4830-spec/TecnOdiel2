import React, { useRef } from 'react';
import { useTenant } from '../../../../multi-tenant/TenantProvider.jsx';
import CinematicNoiseGrain from './components/CinematicNoiseGrain.jsx';
import CinematicNavigation from './components/CinematicNavigation.jsx';
import CinematicHero from './components/CinematicHero.jsx';
import CinematicStory from './components/CinematicStory.jsx';
import CinematicMenuExhibition from './components/CinematicMenuExhibition.jsx';
import CinematicExperienceBooking from './components/CinematicExperienceBooking.jsx';
import CinematicFooter from './components/CinematicFooter.jsx';

/**
 * 🍔 PLANTILLA 1: THE AWWWARDS CINEMATIC (Hostelería)
 * 
 * ESPECIFICACIONES CUMPLIDAS CON RIGOR:
 * - Aislamiento total del DOM y CSS. Ecosistema propio y autocontenido.
 * - Estilo: Inmersivo, oscuro, puro impacto visual sobre negro absoluto (#000000).
 * - CSS/Layout: mix-blend-mode para superposición de textos masivos sobre media con grain filter.
 * - Animaciones: Clip-path text masking, translateY(100%) dentro de overflow: hidden, parallax agresivo (useScroll + useTransform).
 * - Botones: Cero rectángulos. Solo enlaces magnéticos con física de cursor y línea expansiva en hover.
 */
export const AwwwardsCinematicTemplate = ({ tenantOverride = null }) => {
  const tenantContext = useTenant();
  const tenant = tenantOverride || tenantContext.tenant;

  const bookingRef = useRef(null);
  const menuRef = useRef(null);

  const handleScrollToBooking = () => {
    const el = document.getElementById('booking');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-neutral-100 selection:bg-white selection:text-black font-sans antialiased overflow-x-hidden">
      {/* 1. Capa Global de Grano Analógico de 35mm (Grain Overlay) */}
      <CinematicNoiseGrain />

      {/* 2. Barra de Navegación Aislada con mix-blend-difference */}
      <CinematicNavigation
        tenant={tenant}
        onBookingClick={handleScrollToBooking}
      />

      {/* 3. Hero Monumental con Parallax Agresivo y Tipografía Masiva */}
      <div id="hero">
        <CinematicHero
          tenant={tenant}
          onExploreClick={handleScrollToMenu}
          onBookingClick={handleScrollToBooking}
        />
      </div>

      {/* 4. Manifiesto & Historia Inmersiva */}
      <div id="story">
        <CinematicStory
          tenant={tenant}
          onBookingClick={handleScrollToBooking}
        />
      </div>

      {/* 5. Catálogo Culinario / Actos Gastronómicos con Previsualización */}
      <div id="menu">
        <CinematicMenuExhibition
          tenant={tenant}
          onBookingClick={handleScrollToBooking}
        />
      </div>

      {/* 6. Reserva de Experiencias (Sin botones rectangulares) */}
      <div id="booking">
        <CinematicExperienceBooking
          tenant={tenant}
        />
      </div>

      {/* 7. Footer Editorial Cinematográfico */}
      <div id="footer">
        <CinematicFooter
          tenant={tenant}
        />
      </div>
    </div>
  );
};

export default AwwwardsCinematicTemplate;
