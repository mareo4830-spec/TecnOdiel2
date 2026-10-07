import React, { useState, useEffect } from 'react';

/**
 * Efecto de Texto Decodificador
 * Cambia caracteres aleatorios hasta revelar la palabra final.
 */
export const BiotechDecoderText = ({
  targetText = '',
  speed = 30,
  className = ''
}) => {
  const [text, setText] = useState('');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@$%&';

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setText(
        targetText
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return targetText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iteration >= targetText.length) {
        clearInterval(interval);
      }
      iteration += 1 / 2;
    }, speed);

    return () => clearInterval(interval);
  }, [targetText, speed]);

  return <span className={className}>{text}</span>;
};

export default BiotechDecoderText;
