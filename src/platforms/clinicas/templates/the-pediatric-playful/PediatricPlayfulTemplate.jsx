import React from 'react';
import { motion } from 'framer-motion';
import PlayfulBlobButton from './components/PlayfulBlobButton.jsx';
import { useTenant } from '../../../../multi-tenant/TenantProvider.jsx';

/**
 * 🧸 PLANTILLA 3: THE PEDIATRIC PLAYFUL (Pediatría)
 * 
 * - Colores pastel muy suaves y amables (#E8F8F5, #F5EEF8, #FEF9E7).
 * - Manchas orgánicas SVG (Blobs).
 * - Tipografías redondeadas gruesas y cálidas.
 * - Botones redondos y elásticos como de goma que se estiran y rebotan.
 */
export const PediatricPlayfulTemplate = ({ tenantOverride }) => {
  const { tenant: contextTenant } = useTenant();
  const tenant = tenantOverride || contextTenant;

  const features = [
    { title: 'Consultas sin Miedos', desc: 'Espacios de juego y exploración donde los peques se sienten en casa.', icon: '🎪', bg: 'bg-[#FFF3CD]' },
    { title: 'Vacunación Mágica', desc: 'Técnicas de distracción lúdica y cero lágrimas garantizadas.', icon: '✨', bg: 'bg-[#D1E7DD]' },
    { title: 'Crecimiento & Nutrición', desc: 'Seguimiento cariñoso del desarrollo de tu bebé paso a paso.', icon: '🌱', bg: 'bg-[#E2D9F3]' }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-slate-800 font-sans selection:bg-[#70D6BC] selection:text-white p-6 sm:p-12 md:p-16 overflow-x-hidden relative">
      {/* Manchas Orgánicas (Blobs) SVG en el fondo */}
      <div className="fixed inset-0 pointer-events-none opacity-40 overflow-hidden">
        <svg viewBox="0 0 500 500" className="absolute -top-20 -left-20 w-96 h-96 fill-[#D1E7DD]">
          <path d="M413.5,315.5Q372,381,304,409.5Q236,438,171,409.5Q106,381,81.5,315.5Q57,250,91,188Q125,126,187.5,91.5Q250,57,322,81.5Q394,106,424.5,178Q455,250,413.5,315.5Z" />
        </svg>
        <svg viewBox="0 0 500 500" className="absolute top-1/2 -right-20 w-96 h-96 fill-[#FCEAE6]">
          <path d="M433,313Q386,376,321.5,417.5Q257,459,191,421.5Q125,384,86,317Q47,250,79,180.5Q111,111,180.5,74Q250,37,323,68.5Q396,100,438,175Q480,250,433,313Z" />
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-16">
        {/* Cabecera Amigable */}
        <header className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 flex flex-wrap justify-between items-center gap-4 shadow-sm border border-neutral-100">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🧸</span>
            <div>
              <span className="text-xs font-bold tracking-widest text-[#56B29C] uppercase block">
                CLÍNICA PEDIÁTRICA INTEGRAL
              </span>
              <h1 className="text-2xl font-black text-slate-800">
                {tenant?.name || 'PEQUEÑOS GIGANTES'}
              </h1>
            </div>
          </div>

          <PlayfulBlobButton onClick={() => alert('¡Pedir cita para tu peque!')}>
            PEDIR CITA ONLINE
          </PlayfulBlobButton>
        </header>

        {/* Hero Infantil */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7 space-y-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#E8F8F5] text-[#2B8A74] text-xs font-bold">
              ¡CUIDAMOS DE SUS SONRISAS DESDE EL DÍA 1! ⭐
            </span>
            <h2 className="text-4xl sm:text-6xl font-black leading-tight text-slate-900">
              UNA PEDIATRÍA DONDE VENIR AL MÉDICO ES UNA AVENTURA.
            </h2>
            <p className="text-slate-600 text-base leading-relaxed max-w-lg">
              Profesionales médicos especializados en infancia con un enfoque dulce,
              cercano y libre de batas blancas amenazantes.
            </p>
            <div className="pt-2">
              <PlayfulBlobButton
                color="bg-[#FF9B85]"
                textColor="text-white"
                onClick={() => alert('Conociendo a nuestro equipo de doctores')}
              >
                CONOCER AL EQUIPO
              </PlayfulBlobButton>
            </div>
          </div>

          <div className="md:col-span-5 relative">
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=700&q=80"
                alt="Doctora pediátrica amable"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Tarjetas Redondeadas de Especialidades */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              className={`rounded-3xl p-8 shadow-sm border border-neutral-100 ${f.bg} flex flex-col justify-between`}
            >
              <div>
                <span className="text-4xl mb-4 block">{f.icon}</span>
                <h3 className="text-xl font-black text-slate-800 mb-2">{f.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">{f.desc}</p>
              </div>
              <button
                onClick={() => alert(`Información de ${f.title}`)}
                className="text-xs font-bold uppercase tracking-wider text-slate-700 underline text-left"
              >
                SABER MÁS ➔
              </button>
            </motion.div>
          ))}
        </section>

        {/* Footer */}
        <footer className="text-center text-xs text-slate-500 font-medium py-8 border-t border-slate-200">
          © 2026 {tenant?.name || 'PEQUEÑOS GIGANTES'} · PEDIATRIC PLAYFUL EXPERIENCE
        </footer>
      </div>
    </div>
  );
};

export default PediatricPlayfulTemplate;
