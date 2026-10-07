import React, { useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

/**
 * Enlace Magnético Cinemático (Cinematic Magnetic Link)
 * REGLA ESTRICTA: Prohibido usar botones rectangulares.
 * El texto masivo actúa como un enlace gravitatorio donde el cursor es atraído magnéticamente
 * y despliega una línea expansiva continua en hover.
 */
export const CinematicMagneticLink = ({
  children,
  onClick,
  href,
  className = '',
  size = 'text-xl md:text-3xl lg:text-4xl',
  tracking = 'tracking-[0.18em]',
  lineColor = 'bg-white',
  target,
  rel
}) => {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Físicas magnéticas con springs de Framer Motion
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { top, left, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Rango de atracción magnética suave (hasta 22px de desplazamiento cinemático)
    const distanceX = (clientX - centerX) * 0.35;
    const distanceY = (clientY - centerY) * 0.35;

    x.set(distanceX);
    y.set(distanceY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className={`relative inline-flex flex-col items-start cursor-pointer select-none py-2 group ${className}`}
    >
      {/* Texto masivo sin contenedores ni rectángulos */}
      <div className="relative overflow-hidden">
        <span
          className={`block font-extralight uppercase transition-colors duration-500 text-neutral-100 group-hover:text-white ${size} ${tracking}`}
          style={{ fontStretch: 'expanded' }}
        >
          {children}
        </span>
      </div>

      {/* Línea expansiva que crece de 0% a 100% en hover */}
      <div className="w-full h-[1.5px] bg-neutral-800/60 overflow-hidden mt-1 relative">
        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className={`absolute inset-0 h-full ${lineColor}`}
        />
      </div>

      {/* Brillo sutil periférico durante la interacción magnética */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.35 : 0 }}
        transition={{ duration: 0.4 }}
        className="pointer-events-none absolute -bottom-3 left-0 w-full h-4 bg-white/20 blur-md rounded-full"
      />
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className="inline-block" onClick={onClick}>
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-block bg-transparent border-0 p-0 m-0 outline-none focus:outline-none"
    >
      {content}
    </button>
  );
};

export default CinematicMagneticLink;
