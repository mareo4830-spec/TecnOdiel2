import React, { useEffect, useState } from 'react';
import SpecularButton from './ui/SpecularButton.jsx';

/*
 * Icono flotante del chatbot de Botpress con el mismo estilo que los botones de la landing:
 * cristal transparente (CSS inyectado en el shadow DOM del widget) y borde con destello especular
 * verde (SpecularButton superpuesto, sin capturar clics: el icono sigue siendo el de Botpress).
 */
const STYLE_ID = 'tecnodiel-glass-fab';
const CSS = `
.bpFab{background:rgba(109,217,75,.10)!important;backdrop-filter:blur(12px) saturate(1.6);-webkit-backdrop-filter:blur(12px) saturate(1.6);border:1px solid rgba(109,217,75,.45)!important;box-shadow:0 8px 30px rgba(0,0,0,.45),inset 0 0 14px rgba(109,217,75,.22)!important;overflow:hidden}
.bpFabImage{mix-blend-mode:screen;transform:scale(.8)}
`;

export default function ChatbotGlassFab() {
  const [box, setBox] = useState(null);

  useEffect(() => {
    const sync = () => {
      const root = document.querySelector('#fab-root')?.shadowRoot;
      const fab = root?.querySelector('.bpFab');
      if (!root || !fab) { setBox((b) => (b ? null : b)); return; }
      if (!root.querySelector(`#${STYLE_ID}`)) {
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = CSS;
        root.appendChild(style);
      }
      const r = fab.getBoundingClientRect();
      setBox((b) => (b && b.left === r.left && b.top === r.top && b.width === r.width && b.height === r.height
        ? b
        : { left: r.left, top: r.top, width: r.width, height: r.height }));
    };
    sync();
    const timer = setInterval(sync, 500);
    window.addEventListener('resize', sync);
    return () => { clearInterval(timer); window.removeEventListener('resize', sync); };
  }, []);

  if (!box || box.width === 0) return null;
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none fixed"
      style={{ left: box.left, top: box.top, width: box.width, height: box.height, zIndex: 2147483000 }}
    >
      <SpecularButton
        size="sm"
        radius={999}
        tintOpacity={0}
        lineColor="#b8ff9c"
        baseColor="#6DD94B"
        intensity={1.3}
        shineSize={16}
        shineFade={45}
        thickness={1.3}
        proximity={320}
        className="pointer-events-none h-full w-full !p-0"
      >
        {''}
      </SpecularButton>
    </span>
  );
}
