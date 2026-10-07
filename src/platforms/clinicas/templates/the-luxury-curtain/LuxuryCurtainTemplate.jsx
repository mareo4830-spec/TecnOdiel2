import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CurtainGoldButton from './components/CurtainGoldButton.jsx';
import { useTenant } from '../../../../multi-tenant/TenantProvider.jsx';

/**
 * 👑 PLANTILLA 5: THE LUXURY CURTAIN (Clínicas Estéticas)
 * 
 * - Oro mate (#D4AF37) y negro profundo (#0A0A0A).
 * - Tipografías Serif extrafinas.
 * - Animaciones de "telón": la sección se desliza hacia arriba para revelar el siguiente acto estético.
 * - Botones: Líneas finas doradas que envuelven el texto lentamente al hacer hover.
 */
export const LuxuryCurtainTemplate = ({ tenantOverride }) => {
  const { tenant: contextTenant } = useTenant();
  const tenant = tenantOverride || contextTenant;
  const [activeAct, setActiveAct] = useState(0);

  const acts = [
    {
      subtitle: 'ACTO I // ARQUITECTURA FACIAL',
      title: 'ARMONIZACIÓN FACIAL & ORO BOTULÍNICO',
      desc: 'Técnicas no quirúrgicas que restauran los volúmenes óseos y la luminosidad celular con una naturalidad absoluta.',
      img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80'
    },
    {
      subtitle: 'ACTO II // DERMO-PERFECCIÓN',
      title: 'LÁSER PICO-SEGUNDO & BIO-ESTIMULACIÓN',
      desc: 'Renovación integral del colágeno dérmico sin tiempo de baja social. La piel renace tersa y satinada.',
      img: 'https://images.unsplash.com/photo-1512290900672-1f41b593a388?auto=format&fit=crop&w=1200&q=80'
    },
    {
      subtitle: 'ACTO III // ESCULTURA CORPORAL',
      title: 'LIPODISEÑO HD & ONDAS ELECTROMAGNÉTICAS',
      desc: 'Definición anatómica de alta definición combinada con tratamientos de drenaje y remodelado de contornos.',
      img: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1200&q=80'
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-[#F3EFEA] font-serif selection:bg-[#D4AF37] selection:text-black overflow-hidden flex flex-col justify-between p-6 sm:p-12 md:p-16">
      {/* Cabecera Dorada de Alta Gama */}
      <header className="max-w-7xl mx-auto w-full flex justify-between items-center border-b border-[#D4AF37]/20 pb-8 z-20">
        <div>
          <span className="text-[10px] tracking-[0.4em] text-[#D4AF37] uppercase block font-sans">
            MÉDICINA ESTÉTICA DE ALTA COSTURA
          </span>
          <h1 className="text-2xl sm:text-3xl font-light tracking-wide uppercase text-white">
            {tenant?.name || 'AURA GOLD CLINIC'}
          </h1>
        </div>

        <CurtainGoldButton onClick={() => alert('Solicitud de diagnóstico estético')}>
          CONSULTA PRIVADA
        </CurtainGoldButton>
      </header>

      {/* Escenario de Animación de Telón (La sección completa se desliza verticalmente) */}
      <main className="max-w-7xl mx-auto w-full my-auto py-12 relative min-h-[60vh] flex items-center z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeAct}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          >
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-sans tracking-[0.4em] text-[#D4AF37] uppercase block">
                {acts[activeAct].subtitle}
              </span>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-white leading-tight uppercase">
                {acts[activeAct].title}
              </h2>
              <p className="text-sm font-sans font-light text-neutral-400 leading-relaxed max-w-xl">
                {acts[activeAct].desc}
              </p>

              <div className="pt-4 flex items-center gap-6">
                <CurtainGoldButton onClick={() => alert('Reservando tratamiento')}>
                  RESERVAR TRATAMIENTO →
                </CurtainGoldButton>
                <button
                  onClick={() => setActiveAct((a) => (a + 1) % acts.length)}
                  className="text-xs font-sans tracking-widest text-[#D4AF37] hover:text-white uppercase transition-colors"
                >
                  SIGUIENTE ACTO [{(activeAct + 1) % acts.length + 1}/3] ➔
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[3/4] overflow-hidden border border-[#D4AF37]/30 shadow-2xl">
                <img
                  src={acts[activeAct].img}
                  alt={acts[activeAct].title}
                  className="w-full h-full object-cover filter brightness-90 contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Telón */}
      <footer className="max-w-7xl mx-auto w-full border-t border-[#D4AF37]/20 pt-6 flex justify-between items-center text-[10px] font-sans tracking-[0.3em] uppercase text-neutral-500 z-20">
        <span>© MMXXVI {tenant?.name || 'AURA GOLD'} · THE LUXURY CURTAIN CLÍNICA</span>
        <span>MADRID · SALAMANCA DISTRICT</span>
      </footer>
    </div>
  );
};

export default LuxuryCurtainTemplate;
