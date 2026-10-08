import type { BusinessType, LayoutVariant, Project } from '../../types';

export const SITE_COPY: Record<BusinessType, { tagline: string; cta: string; services: [string, string][] }> = {
  barberia: {
    tagline: 'Cortes clásicos, degradados y afeitado a navaja',
    cta: 'Reservar cita',
    services: [['Corte de pelo', '14 €'], ['Corte + barba', '20 €'], ['Afeitado a navaja', '12 €']],
  },
  peluqueria: {
    tagline: 'Color, corte y peinado con cita previa',
    cta: 'Pedir cita',
    services: [['Corte y peinado', '22 €'], ['Mechas', '55 €'], ['Tratamiento hidratante', '18 €']],
  },
  salon: {
    tagline: 'Belleza y bienestar con cita previa',
    cta: 'Pedir cita',
    services: [['Manicura', '18 €'], ['Maquillaje de evento', '35 €'], ['Tratamiento facial', '28 €']],
  },
  restaurante: {
    tagline: 'Cocina de la ría y producto de la lonja',
    cta: 'Reservar mesa',
    services: [['Menú del día', '14 €'], ['Arroz marinero (2 pers.)', '32 €'], ['Gamba blanca', 'S/M']],
  },
  clinica: {
    tagline: 'Tu sonrisa en buenas manos',
    cta: 'Pedir cita',
    services: [['Primera visita', 'Gratis'], ['Limpieza dental', '45 €'], ['Blanqueamiento', '220 €']],
  },
  estetica: {
    tagline: 'Tratamientos faciales y corporales con cita previa',
    cta: 'Pedir cita',
    services: [['Limpieza facial', '35 €'], ['Manicura semipermanente', '20 €'], ['Depilación láser', 'Desde 30 €']],
  },
  cafeteria: {
    tagline: 'Café de especialidad y desayunos caseros',
    cta: 'Ver carta',
    services: [['Desayuno completo', '4,50 €'], ['Café de especialidad', '2 €'], ['Tarta casera', '3,50 €']],
  },
  tienda: {
    tagline: 'Producto local con envío a domicilio',
    cta: 'Ver catálogo',
    services: [['Novedades', 'Ver'], ['Ofertas', 'Ver'], ['Envío en 24 h', 'Gratis +40 €']],
  },
  otro: {
    tagline: 'Tu negocio de confianza',
    cta: 'Contactar',
    services: [['Servicio principal', 'Consultar'], ['Presupuesto', 'Gratis'], ['Atención', 'Lunes a sábado']],
  },
};

const THEME: Record<LayoutVariant, { bg: string; fg: string; accent: string; card: string; font: string; radius: string }> = {
  classic: { bg: '#faf7f2', fg: '#2b2118', accent: '#9a3412', card: '#ffffff', font: 'Georgia, serif', radius: '4px' },
  editorial: { bg: '#0b0f19', fg: '#f3f4f6', accent: '#6366f1', card: '#151b2b', font: 'Inter, system-ui, sans-serif', radius: '16px' },
  minimal: { bg: '#ffffff', fg: '#111827', accent: '#111827', card: '#f5f5f5', font: 'Helvetica, Arial, sans-serif', radius: '0' },
  playful: { bg: '#fff5f8', fg: '#3a1b27', accent: '#d9467a', card: '#ffffff', font: 'Quicksand, system-ui, sans-serif', radius: '24px' },
};

export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** HTML autocontenido que imita la web del cliente para la pestaña Preview en modo mock. */
export function buildMockSite(project: Project): string {
  const copy = SITE_COPY[project.businessType];
  const t = THEME[project.layout];
  const services = copy.services
    .map(([name, price]) => `<li><span>${esc(name)}</span><strong>${esc(price)}</strong></li>`)
    .join('');

  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:${t.font};background:${t.bg};color:${t.fg};line-height:1.5}
nav{display:flex;justify-content:space-between;align-items:center;padding:18px 32px;border-bottom:1px solid ${t.fg}1a}
nav b{font-size:18px}nav span{display:flex;gap:20px;font-size:14px;opacity:.75}
.hero{padding:88px 32px;text-align:center;max-width:760px;margin:0 auto}
.hero h1{font-size:52px;line-height:1.1;margin-bottom:16px}
.hero p{font-size:19px;opacity:.75;margin-bottom:28px}
.btn{display:inline-block;background:${t.accent};color:#fff;padding:14px 28px;border-radius:${t.radius};font-weight:600;text-decoration:none}
section{max-width:760px;margin:0 auto;padding:0 32px 72px}
h2{font-size:24px;margin-bottom:16px}
ul{list-style:none;display:grid;gap:10px}
li{display:flex;justify-content:space-between;background:${t.card};padding:16px 20px;border-radius:${t.radius}}
footer{text-align:center;font-size:13px;opacity:.6;padding:24px;border-top:1px solid ${t.fg}1a}
@media (max-width:600px){nav{padding:14px 18px}nav span{display:none}.hero{padding:56px 18px}.hero h1{font-size:34px}.hero p{font-size:16px}section{padding:0 18px 48px}}
</style></head><body>
<nav><b>${esc(project.businessName)}</b><span><a>Servicios</a><a>Galería</a><a>Contacto</a></span></nav>
<div class="hero"><h1>${esc(project.businessName)}</h1><p>${esc(copy.tagline)} · ${esc(project.client.city || 'Huelva')}</p><a class="btn">${esc(copy.cta)}</a></div>
<section><h2>Servicios</h2><ul>${services}</ul></section>
<footer>${esc(project.domain ?? 'dominio pendiente')} · Vista previa simulada</footer>
</body></html>`;
}
