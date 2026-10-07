import React from 'react';
import BiotechMagneticButton from './components/BiotechMagneticButton.jsx';
import BiotechDecoderText from './components/BiotechDecoderText.jsx';
import { useTenant } from '../../../../multi-tenant/TenantProvider.jsx';

/**
 * 🧬 PLANTILLA 2: THE DARK BIOTECH (Medicina Deportiva)
 * 
 * - Azul marino casi negro (#030712 / #050d24).
 * - Gráficos de fondo de moléculas SVG / bio-redes.
 * - Layout tipo Dashboard con métricas biométricas en tiempo real.
 * - Botones magnéticos con brillos interiores azules.
 * - Textos que aparecen decodificándose (caracteres dinámicos).
 */
export const DarkBiotechTemplate = ({ tenantOverride }) => {
  const { tenant: contextTenant } = useTenant();
  const tenant = tenantOverride || contextTenant;

  const metrics = [
    { label: 'RECUPERACIÓN MUSCULAR', val: '99.4%', status: 'OPTIMAL' },
    { label: 'VO2 MAX TRACKING', val: '+18.2%', status: 'ENHANCED' },
    { label: 'BIOMARCADORES SANGRE', val: '32 PUNTOS', status: 'SYNCHRONIZED' },
    { label: 'TIEMPO REHABILITACIÓN', val: '-42%', status: 'ACCELERATED' }
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-neutral-100 font-sans selection:bg-cyan-500 selection:text-black p-4 sm:p-8 md:p-14 overflow-x-hidden relative">
      {/* Fondo de Moléculas y Bio-redes SVG */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full">
          <circle cx="20%" cy="30%" r="120" stroke="#06b6d4" strokeWidth="1" fill="none" strokeDasharray="4 4" />
          <circle cx="75%" cy="65%" r="180" stroke="#3b82f6" strokeWidth="1" fill="none" strokeDasharray="6 6" />
          <line x1="20%" y1="30%" x2="75%" y2="65%" stroke="#06b6d4" strokeWidth="0.8" opacity="0.3" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-10">
        {/* Header Dashboard */}
        <header className="border border-cyan-900/50 bg-[#060c21]/90 rounded-2xl p-6 flex flex-wrap justify-between items-center gap-4 backdrop-blur-xl">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] text-cyan-400 block mb-1 uppercase">
              BIOTECH PERFORMANCE & RECOVERY LAB
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase flex items-center gap-3">
              <BiotechDecoderText targetText={tenant?.name || 'GENOME SPORT MEDICINE'} />
            </h1>
          </div>

          <BiotechMagneticButton onClick={() => alert('Abriendo telemetría del paciente')}>
            ACCESO TELEMETRÍA PACIENTE
          </BiotechMagneticButton>
        </header>

        {/* Hero Dashboard */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-block px-3 py-1 rounded-md bg-cyan-950/80 border border-cyan-800/80 text-[11px] font-mono text-cyan-300">
              [SISTEMA BIO-MÉTRICO ACTIVO · MODELO ATLETA 2026]
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extralight tracking-tight text-white uppercase leading-[1.08]">
              MEDICINA DE ÉLITE <br />
              <span className="text-cyan-400 font-normal">REGENERACIÓN</span> CELULAR.
            </h2>

            <p className="text-neutral-400 text-sm leading-relaxed max-w-xl">
              Aplicamos terapia con células madre, cámaras hiperbáricas de última generación
              y análisis genómico de alto rendimiento para acelerar el retorno al juego.
            </p>

            <div className="pt-2">
              <BiotechMagneticButton onClick={() => alert('Solicitando valoración física')}>
                EVALUACIÓN BIOMÉTRICA INMEDIATA
              </BiotechMagneticButton>
            </div>
          </div>

          {/* Gráfico / Panel de Métricas Dashboard */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {metrics.map((m, i) => (
              <div
                key={i}
                className="border border-cyan-900/40 bg-[#070e28]/80 rounded-xl p-5 flex flex-col justify-between"
              >
                <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest">
                  {m.label}
                </span>
                <div className="my-4 text-3xl font-bold font-mono text-white">{m.val}</div>
                <div className="flex items-center gap-1.5 text-[9px] font-mono text-cyan-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>{m.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Biotech */}
        <footer className="border-t border-cyan-950 pt-8 flex justify-between items-center text-[10px] font-mono text-neutral-500 uppercase">
          <span>PROTOCOLO CLÍNICO BIOTECH · ISO 13485 CERTIFIED</span>
          <span>© 2026 {tenant?.name || 'GENOME'}</span>
        </footer>
      </div>
    </div>
  );
};

export default DarkBiotechTemplate;
