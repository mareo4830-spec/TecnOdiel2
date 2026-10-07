import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BentoMechanicalButton from './components/BentoMechanicalButton.jsx';
import { useTenant } from '../../../../multi-tenant/TenantProvider.jsx';

/**
 * 🍔 PLANTILLA 2: THE NEO-BENTO BRUTALIST (Hamburgueserías urbanas)
 * 
 * - Fondo blanco puro (#FFFFFF).
 * - Grid asimétrico (Bento Box).
 * - Bordes negros durísimos (border-4 border-black).
 * - Sombras sólidas sin desenfoque (8px offset shadows #000000).
 * - Físicas de rebote (Spring physics: stiffness: 400, damping: 10) que caen y rebotan al entrar en viewport.
 * - Botones: Bloques mecánicos gigantes amarillo/cyan que bajan 8px y pierden la sombra.
 */
export const NeoBentoBrutalistTemplate = ({ tenantOverride }) => {
  const { tenant: contextTenant } = useTenant();
  const tenant = tenantOverride || contextTenant;
  const [cartCount, setCartCount] = useState(0);

  const springDrop = {
    hidden: { y: -120, opacity: 0, rotate: -2 },
    visible: {
      y: 0,
      opacity: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10
      }
    }
  };

  const burgers = [
    {
      id: 'b1',
      title: 'THE DOUBLE SMASH CHEDDAR BOMB',
      desc: 'Doble disco de 100g madurada, cuádruple cheddar fundido, cebolla crispy y salsa secreta en pan brioche artesano.',
      price: '13.90€',
      badge: 'TOP VENTAS 🔥',
      color: 'bg-[#FFE600]',
      img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'b2',
      title: 'TRUFFLE BACON MONSTER',
      desc: 'Buey 180g, mayonesa de trufa negra, bacon ahumado en madera de manzano y queso gouda añejo.',
      price: '15.50€',
      badge: 'DELUXE MEAT',
      color: 'bg-[#00F0FF]',
      img: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'b3',
      title: 'CRISPY VOLCANO CHICKEN',
      desc: 'Pollo marinado en suero de leche, rebozado extra crujiente estilo Nashville, pepinillos y sweet chili glaze.',
      price: '12.50€',
      badge: 'EXTRA PICANTE 🌶️',
      color: 'bg-[#FF0055]',
      img: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#FFE600] selection:text-black p-4 sm:p-8 md:p-12 overflow-x-hidden">
      {/* Barra superior Bento Brutalista */}
      <motion.header
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={springDrop}
        style={{ boxShadow: '8px 8px 0px #000000' }}
        className="max-w-7xl mx-auto bg-[#FFE600] border-4 border-black p-6 flex flex-wrap items-center justify-between gap-4 mb-10"
      >
        <div className="flex items-center gap-4">
          <span className="bg-black text-white text-xl sm:text-2xl font-black px-4 py-2 border-2 border-black tracking-wider">
            BURGER // LAB
          </span>
          <span className="font-black text-2xl sm:text-3xl uppercase tracking-tight">
            {tenant?.name || 'SMASH & DESTROY'}
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="bg-white border-4 border-black px-4 py-2 font-black text-sm uppercase">
            PEDIDOS ACTIVOS: {cartCount} ITEMS
          </div>
          <BentoMechanicalButton
            variant="cyan"
            onClick={() => alert('¡Llamando al rider o abriendo pedido para recoger!')}
          >
            PEDIR AHORA ➔
          </BentoMechanicalButton>
        </div>
      </motion.header>

      {/* Grid Asimétrico Bento Box */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
        {/* Bloque 1: Hero Principal (7 cols) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={springDrop}
          style={{ boxShadow: '8px 8px 0px #000000' }}
          className="md:col-span-7 bg-[#00F0FF] border-4 border-black p-8 sm:p-12 flex flex-col justify-between min-h-[440px]"
        >
          <div className="space-y-4">
            <span className="inline-block bg-black text-[#00F0FF] font-black text-sm px-3 py-1 uppercase">
              CARNE 100% VACA VIEJA MADURADA
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase leading-[0.9] tracking-tight">
              SIN TONTERÍAS. <br />
              SOLO GRASA, COSTRA & GLORIA.
            </h1>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 items-center">
            <BentoMechanicalButton
              variant="yellow"
              onClick={() => {
                setCartCount((c) => c + 1);
              }}
            >
              ¡QUIERO UNA SMASH! 🔥
            </BentoMechanicalButton>
            <span className="font-black text-sm tracking-widest uppercase bg-white px-3 py-2 border-2 border-black">
              TIEMPO ESTIMADO: 15 MIN
            </span>
          </div>
        </motion.div>

        {/* Bloque 2: Foto Impactante con borde brutalista (5 cols) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={springDrop}
          style={{ boxShadow: '8px 8px 0px #000000' }}
          className="md:col-span-5 bg-white border-4 border-black overflow-hidden relative min-h-[380px]"
        >
          <img
            src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80"
            alt="Smash burger brutal"
            className="w-full h-full object-cover filter contrast-125 saturate-150"
          />
          <div className="absolute top-4 left-4 bg-[#FF0055] text-white border-4 border-black font-black px-4 py-1 text-lg rotate-[-4deg]">
            SMASHED CRISPY!
          </div>
        </motion.div>

        {/* Bloque 3: Marquee Brutalista (12 cols) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={springDrop}
          style={{ boxShadow: '8px 8px 0px #000000' }}
          className="md:col-span-12 bg-black text-white border-4 border-black py-4 overflow-hidden"
        >
          <div className="flex whitespace-nowrap animate-marquee font-black text-2xl tracking-widest uppercase gap-8">
            <span>🧀 EXTRA CHEDDAR INGLES</span>
            <span>🥩 CARNE PICADA A DIARIO</span>
            <span>🥓 BACON CRUJIENTE AHUMADO</span>
            <span>🍔 BRIOCHE DE MANTEQUILLA FRANCESA</span>
            <span>🍟 PATATAS CORTE CASERO</span>
          </div>
        </motion.div>

        {/* Bloques 4, 5, 6: Catálogo de Hamburguesas (4 cols c/u) */}
        {burgers.map((b, i) => (
          <motion.div
            key={b.id}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={springDrop}
            style={{ boxShadow: '8px 8px 0px #000000' }}
            className={`md:col-span-4 border-4 border-black p-6 flex flex-col justify-between ${b.color}`}
          >
            <div>
              <div className="relative aspect-video border-4 border-black overflow-hidden mb-4 bg-white">
                <img src={b.img} alt={b.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 right-2 bg-white border-2 border-black font-black text-xs px-2 py-0.5">
                  {b.badge}
                </span>
              </div>
              <h3 className="text-2xl font-black uppercase leading-tight mb-2">
                {b.title}
              </h3>
              <p className="font-bold text-xs leading-relaxed mb-4">
                {b.desc}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t-4 border-black mt-4">
              <span className="text-3xl font-black bg-white border-2 border-black px-3 py-1">
                {b.price}
              </span>
              <BentoMechanicalButton
                variant={i % 2 === 0 ? 'cyan' : 'yellow'}
                onClick={() => setCartCount((c) => c + 1)}
                className="text-sm px-4 py-3"
              >
                METER AL SACO +
              </BentoMechanicalButton>
            </div>
          </motion.div>
        ))}
      </main>

      {/* Footer Neo-Bento */}
      <motion.footer
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={springDrop}
        style={{ boxShadow: '8px 8px 0px #000000' }}
        className="max-w-7xl mx-auto bg-white border-4 border-black p-8 flex flex-col sm:flex-row justify-between items-center gap-6"
      >
        <span className="font-black text-lg uppercase">
          © 2026 {tenant?.name || 'SMASH & DESTROY'} · BENTO BRUTALIST V1.0
        </span>
        <div className="flex gap-4">
          <BentoMechanicalButton
            variant="pink"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            VOLVER ARRIBA ↑
          </BentoMechanicalButton>
        </div>
      </motion.footer>
    </div>
  );
};

export default NeoBentoBrutalistTemplate;
