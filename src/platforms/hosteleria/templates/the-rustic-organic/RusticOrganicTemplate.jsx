import React from 'react';
import { motion } from 'framer-motion';
import RusticOrganicButton from './components/RusticOrganicButton.jsx';
import { useTenant } from '../../../../multi-tenant/TenantProvider.jsx';

/**
 * 🥩 PLANTILLA 6: THE RUSTIC ORGANIC (Asadores tradicionales)
 * 
 * - Tonos tierra cálidos y madera (#2A1E17, #F4ECE1, #8B5A2B).
 * - Máscaras SVG / bordes de papel rasgado en contenedores.
 * - Fotografías solapadas estilo polaroid con animaciones de caída y rotación.
 * - Botones: Formas irregulares hechas con border-radius complejo artesano.
 */
export const RusticOrganicTemplate = ({ tenantOverride }) => {
  const { tenant: contextTenant } = useTenant();
  const tenant = tenantOverride || contextTenant;

  const polaroidDrop = {
    hidden: { y: -50, opacity: 0 },
    visible: (custom) => ({
      y: 0,
      opacity: 1,
      rotate: custom,
      transition: { duration: 0.8, ease: 'easeOut' }
    })
  };

  const meats = [
    {
      title: 'CHULETÓN DE BUEY RUBIO VALLE DE ESLA',
      weight: '1.2 KG · MADURACIÓN 60 DÍAS',
      price: '78€',
      rot: -3,
      img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80'
    },
    {
      title: 'LECHAZO CHURRO ASADO EN HORNO DE LEÑA',
      weight: 'CUARTO DELANTERO A LA BRASA DE ENCINA',
      price: '38€',
      rot: 2.5,
      img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=700&q=80'
    },
    {
      title: 'COSTILLAR IBÉRICO LAQUEADO CON MIEL DE ROMERO',
      weight: 'COCCIÓN LENTA 12H A FUEGO VIVO',
      price: '26€',
      rot: -1.8,
      img: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=700&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-[#2A1E17] text-[#F4ECE1] font-serif selection:bg-[#8B5A2B] selection:text-white p-4 sm:p-8 md:p-14 overflow-x-hidden">
      {/* Contenedor Principal tipo Pergamino Rasgado */}
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Cabecera Tradicional */}
        <header className="relative bg-[#3A2B21] border-2 border-[#543317] p-8 sm:p-12 shadow-2xl rounded-sm">
          {/* Borde dentado SVG de papel rasgado superior */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#C49A6C] block mb-2 font-sans">
                FUEGO, BRASA & TRADICIÓN FAMILIAR
              </span>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-normal tracking-wide text-[#F4ECE1]">
                {tenant?.name || 'ASADOR CASA DE LA ENCINA'}
              </h1>
            </div>

            <RusticOrganicButton onClick={() => alert('Reservando mesa junto al fuego')}>
              RESERVAR MESA JUNTO AL FUEGO
            </RusticOrganicButton>
          </div>
        </header>

        {/* Hero Rústico con Fotos Polaroid Solapadas cayendo en la pantalla */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-sans tracking-[0.25em] text-[#C49A6C] uppercase">
              DESDE 1948 // LEÑA DE ROBLE Y ENCINA
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light leading-snug">
              EL SABOR AUTÉNTICO QUE SOLO DA EL TIEMPO Y LA BRASA.
            </h2>
            <p className="text-sm font-sans text-[#D4C5B9] leading-relaxed">
              En nuestro asador el fuego nunca se apaga. Seleccionamos el ganado en origen, maduramos
              en nuestras propias cámaras y asamos despacio, como nos enseñaron nuestros abuelos.
            </p>
            <div className="pt-2">
              <RusticOrganicButton onClick={() => alert('Conociendo las brasas')}>
                NUESTRO CORTE DE CARNE →
              </RusticOrganicButton>
            </div>
          </div>

          {/* Galería de Fotos Polaroid que "caen" y rotan */}
          <div className="lg:col-span-6 flex justify-center relative min-h-[360px]">
            <motion.div
              custom={-4}
              initial="hidden"
              whileInView="visible"
              variants={polaroidDrop}
              className="absolute left-4 sm:left-12 top-0 bg-[#F4ECE1] p-4 pb-8 shadow-2xl w-64 border border-[#D4C5B9]"
            >
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80"
                alt="Brasa viva"
                className="w-full aspect-square object-cover mb-3 filter sepia-[0.3]"
              />
              <span className="block text-center text-xs font-serif text-[#2A1E17] italic">
                La brasa de encina viva
              </span>
            </motion.div>

            <motion.div
              custom={5}
              initial="hidden"
              whileInView="visible"
              variants={polaroidDrop}
              className="absolute right-4 sm:right-12 top-10 bg-[#F4ECE1] p-4 pb-8 shadow-2xl w-64 border border-[#D4C5B9] z-10"
            >
              <img
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
                alt="Horno tradicional"
                className="w-full aspect-square object-cover mb-3 filter sepia-[0.2]"
              />
              <span className="block text-center text-xs font-serif text-[#2A1E17] italic">
                Horno de leña de adobe
              </span>
            </motion.div>
          </div>
        </section>

        {/* Carta de Carnes & Asados */}
        <section className="bg-[#3A2B21] border-2 border-[#543317] p-8 sm:p-12 shadow-xl">
          <h3 className="text-2xl sm:text-3xl font-light text-center mb-10 text-[#F4ECE1] border-b border-[#543317] pb-4">
            CORTES Y ESPECIALIDADES DEL DÍA
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {meats.map((m, idx) => (
              <motion.div
                key={idx}
                custom={m.rot}
                initial="hidden"
                whileInView="visible"
                variants={polaroidDrop}
                className="bg-[#F4ECE1] text-[#2A1E17] p-4 pb-6 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <img
                    src={m.img}
                    alt={m.title}
                    className="w-full aspect-video object-cover mb-4 filter sepia-[0.25]"
                  />
                  <h4 className="font-serif font-bold text-lg mb-1 leading-tight">{m.title}</h4>
                  <p className="text-xs font-sans text-neutral-600 mb-4">{m.weight}</p>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-neutral-300">
                  <span className="text-xl font-bold font-sans text-[#8B5A2B]">{m.price}</span>
                  <button
                    onClick={() => alert(`Añadido: ${m.title}`)}
                    className="text-xs uppercase font-sans tracking-wider text-[#2A1E17] font-bold underline"
                  >
                    PEDIR CORTE +
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer Rústico */}
        <footer className="text-center text-xs font-sans text-[#C49A6C] tracking-widest uppercase border-t border-[#543317] pt-8">
          © MMXXVI {tenant?.name || 'ASADOR TRADICIONAL'} · THE RUSTIC ORGANIC WOODFIRE ARCHITECTURE
        </footer>
      </div>
    </div>
  );
};

export default RusticOrganicTemplate;
