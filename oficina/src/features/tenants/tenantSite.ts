import type { BusinessType, Tenant, TenantBusinessType } from '../../types';
import { esc, SITE_COPY } from '../projects/mockSite';
import { hoursSummary } from './components/HoursEditor';
import { effectiveVariant, SOCIAL_META, SOCIALS, socialUrl } from './tenantMeta';

export type SiteData = Pick<
  Tenant,
  | 'name'
  | 'tagline'
  | 'logoUrl'
  | 'businessType'
  | 'layout'
  | 'layoutVariant'
  | 'address'
  | 'openingHours'
  | 'phone'
  | 'whatsapp'
  | 'publicEmail'
  | 'socials'
  | 'domain'
  | 'previewHost'
>;

const COPY_TYPE: Record<TenantBusinessType, BusinessType> = {
  barberia: 'barberia',
  peluqueria: 'peluqueria',
  salon: 'peluqueria',
  estetica: 'estetica',
  restaurante: 'restaurante',
  cafeteria: 'cafeteria',
  clinica: 'clinica',
  otro: 'otro',
};

const digits = (phone: string) => phone.replace(/[^\d+]/g, '').replace(/^\+/, '');

/**
 * Web simulada del tenant con la variante de layout elegida y los datos que ya tenemos. Se usa en el
 * asistente (vista en vivo) y en la pestaña Preview mientras la preview real no existe.
 */
export function buildTenantSite(d: SiteData): string {
  const v = effectiveVariant(d.layout ?? 'classic', d.layoutVariant);
  const copy = SITE_COPY[COPY_TYPE[d.businessType ?? 'otro']];
  const name = d.name.trim() || 'Tu negocio';
  const radius = v.radius === '999px' ? '24px' : v.radius;
  const services = copy.services.map(([n, p]) => `<li><span>${esc(n)}</span><strong>${esc(p)}</strong></li>`).join('');
  const hours =
    d.openingHours && Object.keys(d.openingHours).length
      ? hoursSummary(d.openingHours)
          .map((h) => `<li><span>${esc(h.day)}</span><span class="${h.hours === 'Cerrado' ? 'off' : ''}">${esc(h.hours)}</span></li>`)
          .join('')
      : '';
  const socials = SOCIALS.filter((s) => d.socials[s]?.trim())
    .map((s) => `<a href="${esc(socialUrl(s, d.socials[s]!))}" target="_blank" rel="noreferrer">${esc(SOCIAL_META[s].label)}</a>`)
    .join('');
  const contact = [
    d.phone ? `<a class="chip" href="tel:${esc(d.phone)}">📞 ${esc(d.phone)}</a>` : '',
    d.whatsapp ? `<a class="chip" href="https://wa.me/${esc(digits(d.whatsapp))}" target="_blank" rel="noreferrer">💬 WhatsApp</a>` : '',
    d.publicEmail ? `<a class="chip" href="mailto:${esc(d.publicEmail)}">✉️ ${esc(d.publicEmail)}</a>` : '',
  ].join('');
  const logo = d.logoUrl ? `<img src="${esc(d.logoUrl)}" alt="" />` : '';
  const host = d.domain ?? d.previewHost ?? 'preview pendiente';

  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:${v.font};background:${v.surface};color:${v.text};line-height:1.5}
a{color:inherit}
nav{display:flex;justify-content:space-between;align-items:center;padding:16px 28px;border-bottom:1px solid ${v.text}1f}
nav .brand{display:flex;align-items:center;gap:10px;font-weight:700}
nav img{width:32px;height:32px;border-radius:${radius};object-fit:cover}
nav span.links{display:flex;gap:18px;font-size:14px;opacity:.75}
.hero{padding:80px 28px 64px;text-align:center;max-width:780px;margin:0 auto}
.hero h1{font-size:52px;line-height:1.05;margin-bottom:14px;letter-spacing:-.01em}
.hero p{font-size:18px;opacity:.78;margin-bottom:26px}
.btn{display:inline-block;background:${v.accent};color:${v.surface};padding:14px 28px;border-radius:${radius};font-weight:700;text-decoration:none}
.chips{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:22px}
.chip{font-size:13px;padding:7px 12px;border:1px solid ${v.accent}66;border-radius:${radius};text-decoration:none}
section{max-width:780px;margin:0 auto;padding:0 28px 56px}
h2{font-size:22px;margin-bottom:14px}
ul{list-style:none;display:grid;gap:8px}
.services li{display:flex;justify-content:space-between;padding:15px 18px;border:1px solid ${v.accent}40;border-radius:${radius}}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:28px}
.hours li{display:flex;justify-content:space-between;font-size:14px;border-bottom:1px dashed ${v.text}26;padding:4px 0}
.hours .off{opacity:.45}
.addr{font-size:15px;opacity:.85}
.map{margin-top:12px;height:120px;border-radius:${radius};background:repeating-linear-gradient(45deg,${v.accent}22 0 12px,transparent 12px 24px);display:grid;place-items:center;font-size:13px;opacity:.8}
footer{text-align:center;font-size:13px;padding:24px;border-top:1px solid ${v.text}1f}
footer .social{display:flex;gap:16px;justify-content:center;margin-bottom:8px;font-weight:600}
footer small{opacity:.6}
.empty{opacity:.5;font-size:14px}
@media (max-width:640px){nav{padding:12px 16px}nav span.links{display:none}.hero{padding:52px 16px 40px}.hero h1{font-size:34px}.hero p{font-size:16px}section{padding:0 16px 40px}.grid{grid-template-columns:1fr}}
</style></head><body>
<nav><span class="brand">${logo}${esc(name)}</span><span class="links"><a>Servicios</a><a>Horario</a><a>Contacto</a></span></nav>
<div class="hero"><h1>${esc(name)}</h1><p>${esc(d.tagline?.trim() || copy.tagline)}</p><a class="btn">${esc(copy.cta)}</a>${contact ? `<div class="chips">${contact}</div>` : ''}</div>
<section><h2>Servicios</h2><ul class="services">${services}</ul></section>
<section class="grid">
<div><h2>Horario</h2>${hours ? `<ul class="hours">${hours}</ul>` : '<p class="empty">Horario pendiente</p>'}</div>
<div><h2>Dónde estamos</h2>${d.address ? `<p class="addr">${esc(d.address)}</p><div class="map">📍 Mapa</div>` : '<p class="empty">Dirección pendiente</p>'}</div>
</section>
<footer>${socials ? `<div class="social">${socials}</div>` : ''}<small>${esc(host)} · ${esc(v.name)} · vista simulada</small></footer>
</body></html>`;
}
