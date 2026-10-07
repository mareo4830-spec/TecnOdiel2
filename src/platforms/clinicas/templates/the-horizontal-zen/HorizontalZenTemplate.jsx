import React, { useRef } from 'react';
import ZenCircleButton from './components/ZenCircleButton.jsx';
import { useTenant } from '../../../../multi-tenant/TenantProvider.jsx';

/**
 * 🧘 PLANTILLA 4: THE HORIZONTAL ZEN (Psicología / Spa)
 * 
 * - Navegación 100% de scroll horizontal.
 * - Tonos arena (#E7E1D8) y niebla (#F3EFEA).
 * - Textos con tracking ultra-amplio que se contrae gradualmente.
 * - Botones que son círculos perfectos translúcidos con micro-ondas.
 */
export const HorizontalZenTemplate = ({ tenantOverride }) => {
  const { tenant: contextTenant } = useTenant();
  const tenant = tenantOverride || contextTenant;
  const scrollContainerRef = useRef(null);

  const panels = [
    {
      num: '01 // ORIGEN',
      title: 'EL SILENCIO INTERIOR',
      desc: 'Terapia contemplativa, regulación somática y reducción del estrés en un entorno no invasivo.',
      img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80'
    },
    {
      num: '02 // RESPIRACIÓN',
      title: 'BIENESTAR HOLÍSTICO',
      desc: 'Integración cuerpo-mente con psicólogos clínicos y terapeutas especializados en mindfulness.',
      img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80'
    },
    {
      num: '03 // ARMONÍA',
      title: 'SANTUARIO BOTÁNICO',
      desc: 'Baños de bosque, hidroterapia templada y sesiones individuales de escucha compasiva.',
      img: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div className="h-screen w-screen bg-[#F3EFEA] text-[#4A453E] font-sans selection:bg-[#D5CEC2] selection:text-black overflow-hidden flex flex-col">
      {/* Barra Fija Superior */}
      <header className="h-20 w-full px-8 md:px-14 flex items-center justify-between border-b border-[#E0D9CE] shrink-0 bg-[#F3EFEA]/80 backdrop-blur-md z-20">
        <div>
          <span className="text-[10px] tracking-[0.4em] uppercase text-[#8C8476] block">
            PSICOLOGÍA CLÍNICA & SPA SOMÁTICO
          </span>
          <span className="font-light text-xl tracking-[0.2em] uppercase text-[#4A453E]">
            {tenant?.name || 'ESPACIO VACÍO & CALMA'}
          </span>
        </div>

        <div className="flex items-center space-x-6">
          <span className="text-[10px] font-mono tracking-widest text-[#8C8476] uppercase hidden sm:block">
            DESPLAZAMIENTO HORIZONTAL ➔
          </span>
          <ZenCircleButton onClick={() => alert('Sesión de terapia solicitada')}>
            RESERVAR SESIÓN
          </ZenCircleButton>
        </div>
      </header>

      {/* Contenedor de Scroll 100% Horizontal */}
      <div
        ref={scrollContainerRef}
        className="flex-1 w-full overflow-x-auto overflow-y-hidden flex flex-row items-center divide-x divide-[#E0D9CE] scroll-smooth"
      >
        {/* Panel 1: Entrada Hero Horizontal */}
        <section className="h-full w-[85vw] md:w-[65vw] shrink-0 p-12 md:p-24 flex flex-col justify-center space-y-8 bg-[#F3EFEA]">
          <span className="text-[11px] tracking-[0.5em] uppercase text-[#8C8476]">
            INVITACIÓN A LA PAUSA
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extralight uppercase leading-[1.05] tracking-[0.12em] text-[#38332D]">
            RESPIRAR. <br />
            RECONECTAR. <br />
            SANAR EN CALMA.
          </h1>
          <p className="max-w-md text-sm text-[#736B5E] font-light leading-relaxed">
            Un refugio acústico y emocional diseñado para detener la sobreestimulación urbana.
            Tratamientos psicológicos basados en evidencia científica dentro de un remanso de paz.
          </p>
        </section>

        {/* Paneles 2, 3, 4: Recorrido Terapéutico */}
        {panels.map((p, i) => (
          <section
            key={i}
            className="h-full w-[85vw] md:w-[55vw] shrink-0 p-12 md:p-20 flex flex-col justify-between bg-[#EBE5DC]"
          >
            <div>
              <span className="text-[10px] tracking-[0.4em] text-[#8C8476] uppercase block mb-4">
                {p.num}
              </span>
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden mb-8 border border-[#D5CEC2]">
                <img src={p.img} alt={p.title} className="w-full h-full object-cover filter brightness-95" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-light tracking-[0.15em] uppercase mb-3">
                {p.title}
              </h2>
              <p className="text-xs text-[#736B5E] font-light leading-relaxed max-w-sm">
                {p.desc}
              </p>
            </div>

            <div className="pt-6">
              <ZenCircleButton onClick={() => alert(`Explorando: ${p.title}`)}>
                EXPLORAR
              </ZenCircleButton>
            </div>
          </section>
        ))}

        {/* Panel Final */}
        <section className="h-full w-[60vw] md:w-[40vw] shrink-0 p-12 md:p-20 flex flex-col justify-center items-center text-center space-y-8 bg-[#E5DFD4]">
          <span className="text-[10px] tracking-[0.4em] text-[#8C8476] uppercase">
            CONTACTO DISCRETO
          </span>
          <h3 className="text-3xl font-extralight tracking-widest uppercase">
            TU TIEMPO COMIENZA AQUÍ
          </h3>
          <ZenCircleButton onClick={() => alert('Contactando')}>
            ESCRÍBENOS
          </ZenCircleButton>
          <span className="text-[10px] tracking-widest text-[#8C8476]">
            © MMXXVI {tenant?.name || 'ESPACIO VACÍO'}
          </span>
        </section>
      </div>
    </div>
  );
};

export default HorizontalZenTemplate;
