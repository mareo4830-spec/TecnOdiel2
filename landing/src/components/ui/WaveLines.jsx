import React, { useMemo } from 'react';
import './WaveLines.css';

/*
 * Fondo de líneas verdes ondulantes SIN WebGL ni JavaScript por frame.
 *
 * Sustituye al shader `Threads` (40 líneas x 2 ruidos Perlin por píxel, a pantalla completa), que
 * consumía GPU y main thread. Aquí cada capa es un SVG estático con varias ondas senoidales que
 * se desplaza en horizontal exactamente un periodo en bucle con una animación CSS de `transform`:
 * eso lo resuelve el compositor sin repintar nada, así que el coste es prácticamente nulo y el
 * movimiento sigue siendo continuo. Cada capa tiene su propio periodo y velocidad, de modo que
 * las líneas se cruzan y "respiran" como en el efecto original.
 */

const GREEN = '109, 217, 75';
const H = 460; // alto de cada capa (px)
const STEP = 24; // muestreo de la onda (px)
const VIEW_W = 2200; // ancho máximo de pantalla que cubre una capa (más un periodo extra)

// Cada capa: periodo (px), duración del bucle (s), nº de líneas, amplitud, dispersión vertical y fase inicial.
const LAYERS = [
  { period: 1100, dur: 70, lines: 9, amp: 120, spread: 60, phase: 0.0, dir: 1 },
  { period: 760, dur: 52, lines: 8, amp: 80, spread: 46, phase: 1.7, dir: -1 },
  { period: 1500, dur: 95, lines: 7, amp: 150, spread: 80, phase: 3.1, dir: 1 },
];

function buildPath(width, period, amp, phase, yOffset) {
  const k = (Math.PI * 2) / period;
  let d = '';
  for (let x = 0; x <= width; x += STEP) {
    const y = H / 2 + yOffset + Math.sin(x * k + phase) * amp;
    d += `${x === 0 ? 'M' : 'L'}${x} ${y.toFixed(1)} `;
  }
  return d;
}

function Layer({ period, dur, lines, amp, spread, phase, dir }) {
  const width = VIEW_W + period;
  const paths = useMemo(() => {
    return Array.from({ length: lines }, (_, i) => {
      const p = i / (lines - 1 || 1);
      return {
        d: buildPath(width, period, amp * (1 - p * 0.35), phase + p * 0.9, (p - 0.5) * spread),
        // Las líneas del final del haz son más finas y tenues, como en el efecto original.
        opacity: 0.85 - p * 0.55,
        stroke: 1.6 - p * 0.9,
      };
    });
  }, [width, period, amp, spread, phase, lines]);

  return (
    <svg
      className="wave-layer"
      width={width}
      height={H}
      viewBox={`0 0 ${width} ${H}`}
      aria-hidden
      style={{
        '--wave-period': `${period}px`,
        '--wave-dur': `${dur}s`,
        '--wave-dir': dir === 1 ? 'normal' : 'reverse',
      }}
    >
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill="none" stroke={`rgba(${GREEN}, ${p.opacity})`} strokeWidth={p.stroke} strokeLinecap="round" />
      ))}
    </svg>
  );
}

export default function WaveLines({ className = '' }) {
  return (
    <div className={`wave-lines ${className}`} aria-hidden>
      {LAYERS.map((layer, i) => (
        <Layer key={i} {...layer} />
      ))}
      {/* Fundido a la izquierda para no competir con el texto del hero */}
      <div className="wave-lines-fade" />
    </div>
  );
}
