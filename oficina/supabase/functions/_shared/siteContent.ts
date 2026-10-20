/*
 * Contenido de la portada de un tenant (tenants.site_content) y su traducción al negocio del SaaS.
 * La oficina lo guarda tal cual lo edita el socio; aquí se valida, se limpia y se convierte en
 * public_config, contact, design_tokens, servicios, equipo y dueño con acceso de administrador.
 */

export type Motion = 'calm' | 'smooth' | 'lively';

export interface SiteService {
  name: string;
  price: number;
  minutes: number;
}
export interface SiteMember {
  name: string;
  role: string;
  photoUrl: string | null;
}
export interface SiteReview {
  name: string;
  text: string;
  rating: number;
}
export interface SiteFaq {
  question: string;
  answer: string;
}

export interface SiteContent {
  about: string | null;
  heroImageUrl: string | null;
  aboutImageUrl: string | null;
  placeImageUrl: string | null;
  accent: string | null;
  motion: Motion | null;
  services: SiteService[];
  team: SiteMember[];
  reviews: SiteReview[];
  rating: number | null;
  reviewUrl: string | null;
  faq: SiteFaq[];
  owner: { email: string; name: string | null } | null;
}

const rec = (v: unknown): Record<string, unknown> => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {});
const list = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
function text(v: unknown, max = 300): string | null {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  return t ? t.slice(0, max) : null;
}
function https(v: unknown): string | null {
  const t = text(v, 500);
  return t && /^https:\/\/\S+$/.test(t) ? t : null;
}
const HEX = /^#[0-9a-f]{6}$/i;
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Lee y limpia site_content. Lo que no es válido se descarta en silencio. */
export function parseSiteContent(raw: unknown): SiteContent {
  const r = rec(raw);
  const accent = text(r.accent, 7);
  const motion = r.motion === 'calm' || r.motion === 'smooth' || r.motion === 'lively' ? r.motion : null;
  const rating = typeof r.rating === 'number' && r.rating > 0 && r.rating <= 5 ? Math.round(r.rating * 10) / 10 : null;
  const owner = rec(r.owner);
  const ownerEmail = text(owner.email, 200)?.toLowerCase() ?? null;

  return {
    about: text(r.about, 1200),
    heroImageUrl: https(r.heroImageUrl),
    aboutImageUrl: https(r.aboutImageUrl),
    placeImageUrl: https(r.placeImageUrl),
    accent: accent && HEX.test(accent) ? accent.toLowerCase() : null,
    motion,
    services: list(r.services)
      .map(rec)
      .map((s) => ({ name: text(s.name, 120), price: Number(s.price), minutes: Math.round(Number(s.minutes)) }))
      .filter((s): s is SiteService => !!s.name && Number.isFinite(s.price) && s.price >= 0 && s.minutes > 0 && s.minutes <= 600)
      .slice(0, 60),
    team: list(r.team)
      .map(rec)
      .map((m) => ({ name: text(m.name, 80), role: text(m.role, 80) ?? 'Profesional', photoUrl: https(m.photoUrl) }))
      .filter((m): m is SiteMember => !!m.name)
      .slice(0, 30),
    reviews: list(r.reviews)
      .map(rec)
      .map((v) => ({ name: text(v.name, 60), text: text(v.text, 400), rating: Math.min(5, Math.max(1, Math.round(Number(v.rating) || 5))) }))
      .filter((v): v is SiteReview => !!v.name && !!v.text)
      .slice(0, 12),
    rating,
    reviewUrl: https(r.reviewUrl),
    faq: list(r.faq)
      .map(rec)
      .map((f) => ({ question: text(f.question, 160), answer: text(f.answer, 800) }))
      .filter((f): f is SiteFaq => !!f.question && !!f.answer)
      .slice(0, 10),
    owner: ownerEmail && EMAIL.test(ownerEmail) ? { email: ownerEmail, name: text(owner.name, 120) } : null,
  };
}

/** Lo que la portada lee de public_config. Las claves vacías se quitan para no pisar otras. */
export function publicConfigFromContent(c: SiteContent): Record<string, unknown> {
  const out: Record<string, unknown> = {
    about: c.about,
    heroImageUrl: c.heroImageUrl,
    aboutImageUrl: c.aboutImageUrl,
    placeImageUrl: c.placeImageUrl,
    reviews: c.reviews.length ? c.reviews : null,
    rating: c.rating,
    reviewUrl: c.reviewUrl,
    faq: c.faq.length ? c.faq : null,
  };
  return out;
}

// ── Color de marca → tokens del SaaS ─────────────────────────────────────────────────────────

type Rgb = [number, number, number];
const toRgb = (hex: string): Rgb => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const toHex = (c: Rgb) => `#${c.map((x) => Math.round(Math.min(255, Math.max(0, x))).toString(16).padStart(2, '0')).join('')}`;
const mix = (a: Rgb, b: Rgb, t: number): Rgb => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
function luminance([r, g, b]: Rgb): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/**
 * Sobrescrituras de businesses.design_tokens: el color de marca (con sus tonos claro, oscuro y el
 * de texto encima) y la intensidad de las animaciones. El resto lo pone la variante elegida.
 * Devuelve {} si no hay nada que cambiar.
 */
export function designTokensFromContent(c: SiteContent): Record<string, unknown> {
  const tokens: Record<string, unknown> = {};
  if (c.accent) {
    const rgb = toRgb(c.accent);
    tokens.palette = {
      accent: c.accent,
      accentLight: toHex(mix(rgb, [255, 255, 255], 0.25)),
      accentDark: toHex(mix(rgb, [0, 0, 0], 0.22)),
      accentContrast: luminance(rgb) > 0.42 ? '#111111' : '#ffffff',
    };
  }
  if (c.motion) tokens.motion = c.motion;
  return tokens;
}

/** "@salon", "salon" o "https://instagram.com/salon/" → "salon" (lo que espera contact.instagram). */
export function instagramHandle(value: string | null | undefined): string | null {
  const t = text(value, 200);
  if (!t) return null;
  const handle = t
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
    .replace(/^@/, '')
    .split(/[/?#]/)[0];
  return /^[a-z0-9._]{1,30}$/i.test(handle) ? handle : null;
}

export function initials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]!.toUpperCase())
      .join('') || '·'
  );
}
