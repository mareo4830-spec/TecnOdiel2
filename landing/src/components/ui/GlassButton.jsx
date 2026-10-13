import React, { useEffect, useState } from 'react';
import SpecularButton from './SpecularButton.jsx';
import GlassSurface from './GlassSurface.jsx';
import './GlassButton.css';

/*
 * Botón estándar de la landing: cristal transparente (GlassSurface) + borde con destello especular
 * verde (SpecularButton). Admite `href` (se abre con onClick, en pestaña nueva si target="_blank").
 */
const SIZES = {
  sm: '!px-4 !py-1.5 !text-xs !font-bold',
  cta: '!px-6 !py-2.5 !text-sm !font-bold',
  md: '!px-7 !py-3.5 !text-sm !font-bold',
  lg: '!px-8 !py-4 !text-sm !font-bold',
  xl: '!px-8 !py-5 !text-sm sm:!text-base !font-black uppercase tracking-wider',
};

export default function GlassButton({
  children,
  onClick,
  href,
  target,
  size = 'sm',
  radius = 999,
  autoAnimate = false,
  pulse = 0,
  className = '',
  id,
}) {
  // Cada `pulse` ms: el brillo sube y el botón hace un latido breve.
  const [beating, setBeating] = useState(false);
  useEffect(() => {
    if (!pulse) return undefined;
    let off;
    const timer = setInterval(() => {
      setBeating(true);
      clearTimeout(off);
      off = setTimeout(() => setBeating(false), 1800);
    }, pulse);
    return () => { clearInterval(timer); clearTimeout(off); };
  }, [pulse]);

  const handle = (e) => {
    if (onClick) onClick(e);
    if (href) {
      if (target === '_blank') window.open(href, '_blank', 'noopener,noreferrer');
      else window.location.href = href;
    }
  };
  return (
    <span id={id} className={`relative inline-flex ${beating ? 'glass-btn--beat' : ''} ${className}`}>
      <GlassSurface
        width="100%"
        height="100%"
        borderRadius={radius}
        blur={11}
        brightness={50}
        opacity={0.93}
        backgroundOpacity={0.04}
        saturation={1.5}
        distortionScale={-110}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      />
      <SpecularButton
        size="sm"
        radius={radius}
        tint="#6DD94B"
        tintOpacity={0.14}
        textColor="#ffffff"
        lineColor="#b8ff9c"
        baseColor="#6DD94B"
        intensity={beating ? 2.6 : 1.2}
        shineSize={14}
        shineFade={45}
        thickness={1.2}
        proximity={280}
        autoAnimate={autoAnimate || beating}
        className={`w-full ${SIZES[size] ?? SIZES.sm}`}
        onClick={handle}
      >
        <span className="inline-flex items-center justify-center gap-2">{children}</span>
      </SpecularButton>
    </span>
  );
}
