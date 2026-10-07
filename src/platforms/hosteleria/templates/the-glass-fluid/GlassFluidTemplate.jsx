import React from 'react';
import { motion } from 'framer-motion';
import FluidPillButton from './components/FluidPillButton.jsx';
import { useTenant } from '../../../../multi-tenant/TenantProvider.jsx';

/**
 * 🍸 PLANTILLA 3: THE GLASS FLUID (Coctelerías Premium)
 * 
 * - Fondos vivos con Mesh Gradients en movimiento continuo.
 * - TODO el contenido dentro de paneles acrílicos (backdrop-blur-3xl, bg-white/5, rounded-[3rem]).
 * - Animaciones senoidales flotantes y ondas fluidas.
 * - Botones: Píldoras acrílicas con brillo interior inset 0 0 20px rgba(255,255,255,0.5).
 */
export const GlassFluidTemplate = ({ tenantOverride }) => {
  const { tenant: contextTenant } = useTenant();
  const tenant = tenantOverride || contextTenant;

  const floatingVariants = {
    animate: {
      y: [0, -14, 0],
      rotate: [0, 1.2, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  const cocktails = [
    {
      name: 'NEBULA VIOLET GIN SOUR',
      notes: 'Ginebra botánica de lavanda, licor de violetas silvestres, espuma de clara y polvo de oro 24k.',
      price: '18€',
      img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=700&q=80'
    },
    {
      name: 'SMOKY OBSIDIAN MEZCAL',
      notes: 'Mezcal artesanal oaxaqueño, carbón activo de coco, néctar de agave ahumado y sal volcánica.',
      price: '20€',
      img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=700&q=80'
    },
    {
      name: 'LIQUID JADE CHAMPAGNE',
      notes: 'Champagne Brut Nature, licor de melón Midori macerado en albahaca tailandesa y perlas de lima caviar.',
      price: '24€',
      img: 'https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=700&q=80'
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#070510] text-white font-sans overflow-x-hidden selection:bg-purple-500 selection:text-white p-4 sm:p-8 md:p-14">
      {/* Mesh Gradient Animado en Fondo Continuo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            x: [0, 80, 0],
            y: [0, -60, 0]
          }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-purple-600/30 to-pink-600/20 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.1, 0.9, 1.1],
            x: [0, -70, 0],
            y: [0, 90, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[40%] -right-[15%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-tr from-cyan-600/30 to-blue-600/20 blur-[130px]"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-12">
        {/* Barra Superior Acrílica (rounded-[3rem]) */}
        <header className="backdrop-blur-3xl bg-white/5 border border-white/10 rounded-[3rem] p-6 sm:p-8 flex items-center justify-between shadow-2xl">
          <div>
            <span className="font-extralight tracking-[0.35em] text-sm uppercase text-purple-300 block">
              COCKTAIL & ALCHEMY
            </span>
            <span className="font-light text-2xl sm:text-3xl tracking-wider text-white">
              {tenant?.name || 'AURA & VELVET'}
            </span>
          </div>

          <FluidPillButton onClick={() => alert('Reservando mesa VIP acrílica')}>
            RESERVAR MESA
          </FluidPillButton>
        </header>

        {/* Hero Acrílico Flotante */}
        <motion.section
          variants={floatingVariants}
          animate="animate"
          className="backdrop-blur-3xl bg-white/5 border border-white/10 rounded-[3rem] p-8 sm:p-16 shadow-2xl relative overflow-hidden"
        >
          <div className="max-w-2xl space-y-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs tracking-widest text-cyan-300 uppercase">
              NOCTURNO · TRANSLÚCIDO · SENSORIAL
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extralight tracking-tight leading-[1.05]">
              LA COCTELERÍA <br />
              <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-200 to-cyan-200">
                LÍQUIDA & ETÉREA
              </span>
            </h1>
            <p className="text-neutral-300 font-light text-base sm:text-lg leading-relaxed">
              Mezclas moleculares infusionadas en frío, botánicos exóticos y destilados añejados bajo cristal.
              Un refugio sensorial donde la noche discurre a ritmo senoidal.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <FluidPillButton onClick={() => alert('Visualizando la carta de mixología')}>
                EXPLORAR ELIXIRES →
              </FluidPillButton>
            </div>
          </div>
        </motion.section>

        {/* Galería de Cócteles en Paneles Acrílicos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cocktails.map((c, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              className="backdrop-blur-3xl bg-white/5 border border-white/10 rounded-[3rem] p-6 shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-square rounded-[2.5rem] overflow-hidden mb-6 border border-white/10">
                  <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
                  <span className="absolute top-4 right-4 backdrop-blur-xl bg-black/40 px-3 py-1 rounded-full text-xs font-mono text-purple-200">
                    {c.price}
                  </span>
                </div>
                <h3 className="text-xl font-light tracking-wide text-white mb-2 uppercase">
                  {c.name}
                </h3>
                <p className="text-xs font-light text-neutral-300 leading-relaxed mb-6">
                  {c.notes}
                </p>
              </div>

              <FluidPillButton onClick={() => alert(`Solicitando el cóctel ${c.name}`)} className="w-full text-center">
                PEDIR CÓCTEL
              </FluidPillButton>
            </motion.div>
          ))}
        </div>

        {/* Footer Acrílico */}
        <footer className="backdrop-blur-3xl bg-white/5 border border-white/10 rounded-[3rem] p-8 text-center text-xs tracking-[0.3em] text-neutral-400 uppercase">
          © MMXXVI {tenant?.name || 'AURA & VELVET'} · THE GLASS FLUID COCKTAIL ARCHITECTURE
        </footer>
      </div>
    </div>
  );
};

export default GlassFluidTemplate;
