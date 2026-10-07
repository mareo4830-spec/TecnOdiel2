import React from 'react';

/**
 * Icono oficial de TecnOdiel.
 * - Anillo verde neón (#6DD94B)
 * - T blanca estilizada
 * - Nodo verde neón
 */
export default function LogoMark({ className = 'h-10 w-10', title = 'TecnOdiel' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label={title} xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="13" fill="#0b0b0b" />
      <rect x="0.75" y="0.75" width="46.5" height="46.5" rx="12.25" fill="none" stroke="#6DD94B" strokeOpacity="0.35" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="16" fill="none" stroke="#6DD94B" strokeWidth="3.4" strokeLinecap="round" strokeDasharray="82 19" transform="rotate(-62 24 24)" />
      <path d="M13.5 18.5c3.6-4.2 7.2-4.2 10.5 0s6.9 4.2 10.5 0" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 20.6v10" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="24" cy="33.4" r="3" fill="#6DD94B" />
    </svg>
  );
}
