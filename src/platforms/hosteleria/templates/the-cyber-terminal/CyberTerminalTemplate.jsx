import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CyberTerminalButton from './components/CyberTerminalButton.jsx';
import { useTenant } from '../../../../multi-tenant/TenantProvider.jsx';

/**
 * 💻 PLANTILLA 5: THE CYBER-TERMINAL (Comida Fusión / Geek)
 * 
 * - Fondo gris grafito (#121316) con patrón de cuadrícula SVG.
 * - Tipografía 100% monoespaciada tipo consola.
 * - Acentos en verde neón (#00FF66).
 * - Efecto Typewriter en textos al entrar en el viewport.
 * - Efectos de fallo eléctrico (Glitch) aleatorios en imágenes.
 * - Botones: Contornos neón que en hover se rellenan con patrón ASCII/verde parpadeante.
 */
export const CyberTerminalTemplate = ({ tenantOverride }) => {
  const { tenant: contextTenant } = useTenant();
  const tenant = tenantOverride || contextTenant;

  // Lógica de Typewriter Effect
  const fullText = "INITIALIZING MATRIX_CUISINE_V2.0 -- TOKYO x OAXACA CYBERPUNK SYNTHESIS.";
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let idx = 0;
    const timer = setInterval(() => {
      setDisplayText(fullText.slice(0, idx));
      idx++;
      if (idx > fullText.length) clearInterval(timer);
    }, 35);
    return () => clearInterval(timer);
  }, []);

  const dishes = [
    {
      code: 'NODE://01_RAMEN_TACO',
      name: 'CYBER-BIRRIA RAMEN',
      desc: 'Caldo dashi infusionado 48h con chile guajillo, noodles alcalinos caseros y chashu de wagyu flambeado.',
      price: '$16.40',
      glitch: true
    },
    {
      code: 'NODE://02_GUNKAN_MOLE',
      name: 'NIGIRI DE MOLE NEGRO & ATÚN',
      desc: 'Atún bluefin marinado en mirin, reducción de mole madre oaxaqueño de 300 días y crispy panko.',
      price: '$19.00',
      glitch: false
    },
    {
      code: 'NODE://03_MATCHA_CHURRO',
      name: 'CHURRO MATCHA NEON PROTOCOL',
      desc: 'Masa frita en aceite de sésamo tostado, azúcar de matcha de Kioto y salsa de chocolate blanco con mezcal.',
      price: '$9.50',
      glitch: true
    }
  ];

  return (
    <div className="min-h-screen bg-[#121316] text-[#00FF66] font-mono selection:bg-[#00FF66] selection:text-black p-4 sm:p-8 md:p-14 overflow-x-hidden relative">
      {/* Patrón de cuadrícula SVG industrial grafito */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(to right, #00FF66 1px, transparent 1px), linear-gradient(to bottom, #00FF66 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto space-y-12">
        {/* Terminal Header */}
        <header className="border-2 border-[#00FF66] bg-black/80 p-6 flex flex-wrap items-center justify-between gap-4 shadow-[0_0_15px_rgba(0,255,102,0.15)]">
          <div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#00FF66] inline-block animate-pulse" />
              <span className="ml-2 text-neutral-400">root@terminal:~/{tenant?.slug || 'cyber-fuse'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-widest mt-2 uppercase">
              &gt; {tenant?.name || 'CYBER_FUSION.OS'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <CyberTerminalButton onClick={() => alert('Sincronizando pedido por terminal...')}>
              CONECTAR SOCKET
            </CyberTerminalButton>
          </div>
        </header>

        {/* Hero de Consola con Typewriter Effect */}
        <section className="border border-[#00FF66]/50 bg-black/60 p-8 sm:p-12 space-y-6">
          <div className="text-xs text-neutral-400 tracking-wider">
            [SYS_LOG] ESTADO: CONEXIÓN ESTABLE · 100Gbps FIBER · KITCHEN_DAEMON: ONLINE
          </div>

          <div className="min-h-[60px] text-lg sm:text-2xl text-white font-medium">
            <span>&gt; {displayText}</span>
            <span className="inline-block w-3 h-6 bg-[#00FF66] ml-1 animate-ping" />
          </div>

          <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
            Fusión gastronómica distópica. Algoritmos de sabor que entrelazan la cocina callejera asiática
            con los ahumados prehispánicos. Sin conservantes analógicos.
          </p>

          <div className="pt-4 flex flex-wrap gap-4">
            <CyberTerminalButton onClick={() => alert('Compilando orden')}>
              INICIAR DESCARGA DE COMIDA
            </CyberTerminalButton>
          </div>
        </section>

        {/* Matriz de Platos con Efecto Glitch */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#00FF66]/40 pb-2">
            <span className="text-xs uppercase tracking-widest text-[#00FF66]">
              CATÁLOGO DE PAQUETES DE DATOS // MENU_ITEMS
            </span>
            <span className="text-xs text-neutral-500">[3 NODOS ACTIVOS]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dishes.map((dish, i) => (
              <div
                key={i}
                className="border-2 border-[#00FF66]/60 bg-black/70 p-6 flex flex-col justify-between hover:border-[#00FF66] hover:shadow-[0_0_20px_rgba(0,255,102,0.2)] transition-all group"
              >
                <div>
                  {/* Imagen con fallo glitch */}
                  <div className="relative aspect-video overflow-hidden border border-[#00FF66]/30 mb-4 bg-neutral-900">
                    <img
                      src="https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=700&q=80"
                      alt={dish.name}
                      className={`w-full h-full object-cover filter contrast-150 grayscale group-hover:grayscale-0 transition-all ${
                        dish.glitch ? 'hover:skew-x-2 hover:scale-105' : ''
                      }`}
                    />
                    <div className="absolute top-2 right-2 bg-black px-2 py-0.5 text-[10px] text-[#00FF66] border border-[#00FF66]">
                      {dish.price}
                    </div>
                  </div>

                  <span className="text-[10px] text-neutral-400 block mb-1">{dish.code}</span>
                  <h3 className="text-lg font-bold text-white mb-2">{dish.name}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-6">{dish.desc}</p>
                </div>

                <CyberTerminalButton
                  onClick={() => alert(`Añadido paquete: ${dish.name}`)}
                  className="w-full text-center"
                >
                  EJECUTAR ORDEN
                </CyberTerminalButton>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Consola */}
        <footer className="border-t border-[#00FF66]/40 pt-8 flex justify-between items-center text-xs text-neutral-500">
          <span>HOST: 127.0.0.1:8080 · TERMINAL CYBER-FUSION</span>
          <span>© 2026 {tenant?.name || 'CYBER_TERMINAL'}</span>
        </footer>
      </div>
    </div>
  );
};

export default CyberTerminalTemplate;
