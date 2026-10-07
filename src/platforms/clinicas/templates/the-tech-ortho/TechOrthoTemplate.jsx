import React from 'react';
import { motion } from 'framer-motion';
import OrthoSolidButton from './components/OrthoSolidButton.jsx';
import { useTenant } from '../../../../multi-tenant/TenantProvider.jsx';

/**
 * 📐 PLANTILLA 6: THE TECH-ORTHO (Ortodoncia Avanzada)
 * 
 * - Estética "Wireframe" técnica arquitectónica.
 * - Fondos blancos con líneas de diseño técnico visibles (malla de blueprint blanco).
 * - Tipografías técnicas e ilustraciones isométricas.
 * - Animaciones de escáner (una línea luminosa que barre las imágenes de arriba abajo).
 * - Botones: Bloques sólidos azules (#0055FF) sin efectos locos, máxima usabilidad y contraste.
 */
export const TechOrthoTemplate = ({ tenantOverride }) => {
  const { tenant: contextTenant } = useTenant();
  const tenant = tenantOverride || contextTenant;

  const techSpecs = [
    { code: 'ALIGN_SYS_01', title: 'Planificación Virtual 3D Biomecánica', acc: 'Precisión ±0.02mm' },
    { code: 'SCAN_INTRA_02', title: 'Escaneado Óptico Intraoral Sin Molestias', acc: 'Cero moldes de alginato' },
    { code: 'FORCE_VECT_03', title: 'Control Vectorial de Movimiento Radicular', acc: 'Micro-tornillos de anclaje esquelético' }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#0055FF] selection:text-white p-6 sm:p-12 md:p-16 relative overflow-x-hidden">
      {/* Patrón Técnico Wireframe / Blueprint en Fondo Blanco */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(to right, #0055FF 0.5px, transparent 0.5px), linear-gradient(to bottom, #0055FF 0.5px, transparent 0.5px)',
          backgroundSize: '48px 48px'
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto space-y-16">
        {/* Cabecera Técnica de Alta Precisión */}
        <header className="border border-slate-300 bg-white p-6 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 border border-[#0055FF] flex items-center justify-center font-mono text-xs text-[#0055FF] font-bold">
              3D
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase block">
                ORTODONCIA COMPUTACIONAL WIREFRAME
              </span>
              <h1 className="text-xl font-bold uppercase tracking-tight text-slate-900">
                {tenant?.name || 'ORTHO_TECH STUDIO'}
              </h1>
            </div>
          </div>

          <OrthoSolidButton onClick={() => alert('Escáner 3D programado')}>
            AGENDAR ESCÁNER 3D
          </OrthoSolidButton>
        </header>

        {/* Sección Hero con Animación de Escáner Luminoso */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-block font-mono text-xs px-2.5 py-1 bg-blue-50 border border-blue-200 text-[#0055FF]">
              ESPECIFICACIÓN // DIGITAL SMILE SIMULATION
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight uppercase text-slate-950">
              ALINEACIÓN DENTAL BASADA EN FÍSICA COMPUTACIONAL.
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed max-w-lg font-normal">
              Predecimos cada micrómetro de desplazamiento óseo mediante tomografía computarizada
              de haz cónico y alineadores transparentes multicapa de última generación.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <OrthoSolidButton onClick={() => alert('Calculando caso')}>
                CALCULAR MI CASO ONLINE
              </OrthoSolidButton>
            </div>
          </div>

          {/* Imagen con Escáner Láser que barre de arriba abajo */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] border-2 border-slate-300 overflow-hidden bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80"
                alt="Escáner ortodoncia técnico"
                className="w-full h-full object-cover filter contrast-125 grayscale"
              />

              {/* Línea luminosa de escáner animada */}
              <motion.div
                animate={{ y: ['0%', '350%'] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-0 left-0 w-full h-[3px] bg-[#0055FF] shadow-[0_0_12px_#0055FF] z-10"
              />

              <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 font-mono text-[9px] text-[#0055FF] border border-blue-200">
                STATUS: SCAN_IN_PROGRESS_60FPS
              </div>
            </div>
          </div>
        </section>

        {/* Tabla Técnica de Especificaciones */}
        <section className="border border-slate-300 bg-white p-8">
          <div className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-6 border-b border-slate-200 pb-2">
            PARÁMETROS DEL TRATAMIENTO PREDICTIVO
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {techSpecs.map((t, idx) => (
              <div key={idx} className="border border-slate-200 p-5 space-y-2">
                <span className="font-mono text-[10px] text-[#0055FF] font-semibold">{t.code}</span>
                <h3 className="font-bold text-sm text-slate-900">{t.title}</h3>
                <p className="font-mono text-xs text-slate-500">{t.acc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Técnico */}
        <footer className="border-t border-slate-300 pt-6 flex justify-between items-center text-xs font-mono text-slate-500">
          <span>SISTEMA DE PLANIFICACIÓN ORTHO CAD/CAM · CE MARKED</span>
          <span>© 2026 {tenant?.name || 'ORTHO_TECH'}</span>
        </footer>
      </div>
    </div>
  );
};

export default TechOrthoTemplate;
