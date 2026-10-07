import React from 'react';
import { motion } from 'framer-motion';
import EditorialTextAction from './components/EditorialTextAction.jsx';
import { useTenant } from '../../../../multi-tenant/TenantProvider.jsx';

/**
 * 📖 PLANTILLA 4: THE EDITORIAL PRINT (Restaurantes de Autor)
 * 
 * - Fondo color hueso/sepia (#F9F6F0).
 * - Layout multi-columna (estilo revista impresa de alta gama).
 * - Tipografía exclusivamente Serif.
 * - Separadores de líneas finas negras (0.5px - 1px).
 * - Animaciones: Fade-ins lentísimos (duration: 1.5s).
 * - Imágenes con efecto de barrido (wipe) de izquierda a derecha.
 * - Botones: PROHIBIDOS. Solo texto fino y mayúsculo con hover engrosado y subrayado ultra-fino.
 */
export const EditorialPrintTemplate = ({ tenantOverride }) => {
  const { tenant: contextTenant } = useTenant();
  const tenant = tenantOverride || contextTenant;

  const slowFade = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  const wipeVariants = {
    hidden: { clipPath: 'inset(0 100% 0 0)' },
    visible: {
      clipPath: 'inset(0 0% 0 0)',
      transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-neutral-900 font-serif selection:bg-neutral-900 selection:text-[#F9F6F0] p-6 sm:p-12 md:p-20 overflow-x-hidden">
      {/* Cabecera Tipo Revista */}
      <motion.header
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={slowFade}
        className="max-w-6xl mx-auto border-b border-black pb-8 mb-16 flex flex-col md:flex-row justify-between items-baseline gap-6"
      >
        <div>
          <span className="text-[10px] tracking-[0.4em] uppercase text-neutral-500 block mb-2 font-sans">
            PUBLICACIÓN GASTRONÓMICA VOL. IV · EDICIÓN IMPRESA
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight uppercase">
            {tenant?.name || 'LE MAISON DE PROVENCE'}
          </h1>
        </div>

        <div className="flex items-center space-x-12">
          <EditorialTextAction onClick={() => alert('Lectura del sumario')}>
            SUMARIO
          </EditorialTextAction>
          <EditorialTextAction onClick={() => alert('Consulta de mesa')}>
            RESERVAS DE AUTOR
          </EditorialTextAction>
        </div>
      </motion.header>

      {/* Artículo Principal con Wipe Image y Columnas de Revista */}
      <main className="max-w-6xl mx-auto space-y-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Imagen con efecto Wipe de Izquierda a Derecha */}
          <div className="lg:col-span-7">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={wipeVariants}
              className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-200 border-b border-black"
            >
              <img
                src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=85"
                alt="Plato de autor"
                className="w-full h-full object-cover filter grayscale contrast-110"
              />
            </motion.div>
            <span className="text-[10px] font-sans text-neutral-500 tracking-widest uppercase block mt-2">
              FIGURA 1.0 · COMPOSICIÓN ESTIVAL CON ACEITE DE SALVIA Y CIRUELAS SILVESTRES.
            </span>
          </div>

          {/* Texto en Columnas Estilo Periódico de Lujo */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slowFade}
            className="lg:col-span-5 space-y-6"
          >
            <div className="text-xs uppercase tracking-[0.3em] font-sans text-neutral-500 border-b border-neutral-300 pb-2">
              CRÍTICA GASTRONÓMICA // ENSAYO
            </div>
            <h2 className="text-2xl sm:text-3xl font-light leading-snug">
              LA MEMORIA OLFATIVA Y EL PAISAJE INMUTABLE.
            </h2>
            <div className="columns-1 sm:columns-2 gap-8 text-xs leading-relaxed text-neutral-700 text-justify">
              <p className="mb-4 first-letter:text-4xl first-letter:font-normal first-letter:float-left first-letter:mr-2">
                En esta casa no se busca la estridencia ni el artificio vacuo. Cada receta responde
                a un estudio minucioso de la temporalidad botánica y la pesca sostenible del litoral.
              </p>
              <p>
                Los caldos clarificados reposan horas en silencio, rescatando el aroma de la
                madera mojada y la salmuera antigua. El resultado es una lírica austera pero
                conmovedora.
              </p>
            </div>
            <div className="pt-4 border-t border-black">
              <EditorialTextAction onClick={() => alert('Consultar el menú')}>
                EXPLORAR EL MENÚ DE OTOÑO →
              </EditorialTextAction>
            </div>
          </motion.div>
        </div>

        {/* Separador de Línea Fina Negra */}
        <div className="w-full h-[0.5px] bg-black" />

        {/* Carta Impresa de Degustación en Formato Tabla Editorial */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slowFade}
          className="space-y-8"
        >
          <span className="text-xs uppercase tracking-[0.3em] font-sans text-neutral-500 block">
            ÍNDICE DE COMPOSICIONES
          </span>

          <div className="space-y-6">
            {[
              {
                num: 'I',
                title: 'Consomé de faisán silvestre y trufa negra',
                desc: 'Acompañado de crujiente de centeno y emulsión de saúco.',
                price: '28€'
              },
              {
                num: 'II',
                title: 'Lubina salvaje al vapor de hojas de higuera',
                desc: 'Jugo reducido de espinas tostadas y hinojo marino confitado.',
                price: '42€'
              },
              {
                num: 'III',
                title: 'Pichón de bresse en dos cocciones con moras glaseadas',
                desc: 'Pechuga sonrosada a la brasa y paté de sus higadillos con oporto.',
                price: '46€'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row justify-between items-baseline border-b border-neutral-300 pb-4 gap-2"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-4">
                    <span className="text-xs font-sans text-neutral-400">{item.num}</span>
                    <h3 className="text-lg sm:text-xl font-normal">{item.title}</h3>
                  </div>
                  <p className="text-xs text-neutral-600 font-sans tracking-wide pl-7">
                    {item.desc}
                  </p>
                </div>
                <span className="text-sm font-sans font-medium">{item.price}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Pie Editorial */}
      <footer className="max-w-6xl mx-auto border-t border-black mt-24 pt-8 flex justify-between items-center text-[10px] font-sans tracking-[0.3em] uppercase text-neutral-500">
        <span>EDITADO EN MMXXVI POR {tenant?.name || 'LE MAISON'}</span>
        <EditorialTextAction onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          SUBIR AL PRINCIPIO ↑
        </EditorialTextAction>
      </footer>
    </div>
  );
};

export default EditorialPrintTemplate;
