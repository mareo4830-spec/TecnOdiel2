import React from 'react';
import { motion } from 'framer-motion';

/**
 * Revelado tipográfico de alta gama mediante Text Masking & Clip-Path
 * Exclusivo de "1. THE AWWWARDS CINEMATIC".
 * Anima desde translateY(100%) a translateY(0%) dentro de un contenedor overflow: hidden,
 * combinado con un corte geométrico de clip-path progresivo.
 */
export const CinematicTextReveal = ({
  children,
  className = '',
  delay = 0,
  duration = 1.1,
  as = 'div',
  triggerOnce = true
}) => {
  const Component = motion[as] || motion.div;

  const containerVariants = {
    hidden: {
      clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
      opacity: 0.1
    },
    visible: {
      clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)',
      opacity: 1,
      transition: {
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // Cubic-bezier cinemático ultra suave
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: {
      y: '100%',
      opacity: 0,
      rotateZ: 1.5
    },
    visible: {
      y: '0%',
      opacity: 1,
      rotateZ: 0,
      transition: {
        duration,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <div className={`overflow-hidden relative ${className}`}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: triggerOnce, margin: '-10% 0px' }}
      >
        <Component variants={itemVariants}>
          {children}
        </Component>
      </motion.div>
    </div>
  );
};

export default CinematicTextReveal;
