import React from 'react';
import SwissArrowButton from './components/SwissArrowButton.jsx';
import { useTenant } from '../../../../multi-tenant/TenantProvider.jsx';

/**
 * 🦷 PLANTILLA 1: THE ULTRA-MINIMAL SWISS (Dentales de Lujo)
 * 
 * - Blanco absoluto (#FFFFFF).
 * - Grid matemático suizo riguroso.
 * - Tipografías minúsculas con tracking frente a espacios vacíos gigantescos.
 * - Botones invisibles que solo revelan una flecha fina '→' al pasar el ratón.
 * - Animaciones casi imperceptibles, solo micro-interacciones.
 */
export const UltraMinimalSwissTemplate = ({ tenantOverride }) => {
  const { tenant: contextTenant } = useTenant();
  const tenant = tenantOverride || contextTenant;

  const services = [
    { code: '01', title: 'Implantología Digital Guiada', time: '45 min' },
    { code: '02', title: 'Diseño de Sonrisa en Cerámica Feldespática', time: '60 min' },
    { code: '03', title: 'Ortodoncia Invisible Predictiva 3D', time: '30 min' },
    { code: '04', title: 'Blanqueamiento Láser Bio-Compatible', time: '40 min' }
  ];

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white p-8 sm:p-16 md:p-24">
      {/* Grid Matemático Suizo Superior */}
      <header className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-neutral-200 pb-12 mb-28">
        <div className="md:col-span-4">
          <span className="text-[10px] tracking-[0.35em] uppercase text-neutral-400 block mb-1">
            CLINICAL IDENTITY // ZÜRICH - MADRID
          </span>
          <h1 className="text-xl font-medium tracking-tight uppercase">
            {tenant?.name || 'SWISS DENTAL ATELIER'}
          </h1>
        </div>

        <div className="md:col-span-4 text-[11px] text-neutral-500 tracking-wider space-y-1">
          <p>DR. CHRISTIAN VON WEBER</p>
          <p>MASTER OF SCIENCE IN ORAL SURGERY</p>
          <p>BAHNHOFSTRASSE 14, 8001 ZÜRICH</p>
        </div>

        <div className="md:col-span-4 flex md:justify-end items-start">
          <SwissArrowButton onClick={() => alert('Cita médica solicitada')}>
            SOLICITAR CONSULTA PRIVADA
          </SwissArrowButton>
        </div>
      </header>

      {/* Espacio Vacío Gigante + Título Monumental Minimalista */}
      <main className="max-w-6xl mx-auto space-y-36">
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8">
            <span className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 block mb-4">
              PRECISIÓN MILIMÉTRICA
            </span>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-[-0.04em] leading-[1.05] uppercase">
              ODONTOLOGÍA <br />
              ESTÉTICA & MICROCIRUGÍA <br />
              SIN CONCESIONES.
            </h2>
          </div>

          <div className="md:col-span-4 flex flex-col justify-end text-xs text-neutral-500 leading-relaxed font-light">
            <p className="mb-6">
              El rigor de la ingeniería biomédica suiza aplicado a la armonía dental.
              Espacios asépticos, luz natural calibrada y silencio clínico absoluto.
            </p>
            <SwissArrowButton onClick={() => alert('Ver protocolo suizo')}>
              PROTOCOLO DIAGNÓSTICO
            </SwissArrowButton>
          </div>
        </section>

        {/* Grid de Servicios con Proporción Áurea */}
        <section className="border-t border-neutral-200 pt-16">
          <div className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 mb-12">
            CATÁLOGO DE INTERVENCIONES
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
            {services.map((s) => (
              <div
                key={s.code}
                className="group border-b border-neutral-100 pb-6 flex items-baseline justify-between transition-colors hover:border-black"
              >
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 mr-4">{s.code}</span>
                  <span className="text-sm font-light uppercase tracking-wider">{s.title}</span>
                </div>
                <SwissArrowButton onClick={() => alert(`Detalles: ${s.title}`)}>
                  {s.time}
                </SwissArrowButton>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer Suizo Matemático */}
      <footer className="max-w-6xl mx-auto border-t border-neutral-200 mt-36 pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] text-neutral-400 tracking-[0.3em] uppercase gap-4">
        <span>SWISS MINIMAL DESIGN SYSTEM // 2026</span>
        <span>© {tenant?.name || 'SWISS DENTAL'}</span>
      </footer>
    </div>
  );
};

export default UltraMinimalSwissTemplate;
