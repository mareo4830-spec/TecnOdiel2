import React, { useEffect, useState } from 'react';

const DELAY_MS = 7000;

/**
 * Popup que aparece a los 7 s de entrar en una demo (preview) de plantilla.
 * "Quiero esta web" lleva a la landing con el formulario abierto y el estilo ya elegido (?estilo=<slug>).
 * Se muestra una vez por plantilla y sesión para no ser pesado.
 */
export default function PreviewLeadPopup({ slug, name }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
    let seen = false;
    try { seen = sessionStorage.getItem(`td_popup_${slug}`) === '1'; } catch { /* sin storage */ }
    if (seen) return undefined;
    const t = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(t);
  }, [slug]);

  const close = () => {
    setOpen(false);
    try { sessionStorage.setItem(`td_popup_${slug}`, '1'); } catch { /* sin storage */ }
  };

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null;

  const goToForm = () => {
    try { sessionStorage.setItem(`td_popup_${slug}`, '1'); } catch { /* sin storage */ }
    window.location.href = `/?estilo=${encodeURIComponent(slug)}#contacto`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={close}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="td-popup-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#121212] p-8 text-center text-white shadow-[0_30px_80px_-20px_rgba(109,217,75,0.4)]"
        style={{ fontFamily: "Montserrat, Inter, system-ui, sans-serif" }}
      >
        <button type="button" onClick={close} aria-label="Cerrar" className="absolute right-4 top-4 text-2xl leading-none text-zinc-400 hover:text-white">×</button>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6DD94B]">Tecn<span className="text-white">Odiel</span> · Huelva</p>
        <h2 id="td-popup-title" className="mt-4 text-2xl font-extrabold leading-tight">¿Te gusta esta web?</h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          Háblanos y la diseñamos a tu gusto, con tu logo, tus fotos y tus servicios. Sin compromiso y con presupuesto cerrado.
        </p>
        <button type="button" onClick={goToForm} className="mt-7 w-full rounded-full bg-[#6DD94B] px-6 py-3.5 text-sm font-bold text-black transition hover:bg-white">
          Quiero esta web
        </button>
        <button type="button" onClick={close} className="mt-3 text-sm font-medium text-zinc-400 hover:text-white">Seguir viendo</button>
        {name && <p className="mt-5 text-[11px] text-zinc-600">Estás viendo la demo «{name}»</p>}
      </div>
    </div>
  );
}
