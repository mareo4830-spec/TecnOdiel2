import {
  CalendarClock,
  Coffee,
  Eye,
  Store,
  Stethoscope,
  UtensilsCrossed,
  Cloud,
  Database,
  Globe,
  MapPin,
  Search,
  Bell,
  Scissors,
  Sparkles,
  Flower2,
  Brush,
  type LucideIcon,
} from 'lucide-react';
import type {
  SaasProjectConfig,
  SocialNetwork,
  Tenant,
  DnsProviderId,
  IntegrationProvider,
  LayoutVariant,
  PaymentConcept,
  TenantBusinessType,
  TenantIntegrationStatus,
  TenantRequirement,
  TenantStatus,
  Weekday,
} from '../../types';
/** Límite de una etiqueta DNS (lo que va antes de .vercel.app). */
export const MAX_LABEL = 63;

/**
 * Host de preview de un tenant según la config del SaaS:
 * vercel_app → <slug>-<sufijo>.vercel.app · agency_domain → <slug>.<dominio de la agencia>.
 */
export function previewHostFor(slug: string, cfg: SaasProjectConfig | null | undefined): string {
  const s = slug || 'slug';
  if (cfg?.previewMode === 'agency_domain' && cfg.agencyPreviewDomain.trim()) return `${s}.${cfg.agencyPreviewDomain.trim()}`;
  const suffix = cfg?.vercelAppSuffix?.trim();
  return `${s}${suffix ? `-${suffix}` : ''}.vercel.app`;
}

export const tenantPreviewUrl = (t: Pick<Tenant, 'previewHost'>) => (t.previewHost ? `https://${t.previewHost}` : null);

export const SOCIAL_META: Record<SocialNetwork, { label: string; placeholder: string; prefix: string }> = {
  instagram: { label: 'Instagram', placeholder: '@salonaurora', prefix: 'https://instagram.com/' },
  facebook: { label: 'Facebook', placeholder: 'salonaurora', prefix: 'https://facebook.com/' },
  tiktok: { label: 'TikTok', placeholder: '@salonaurora', prefix: 'https://tiktok.com/@' },
  google: { label: 'Reseñas de Google', placeholder: 'https://g.page/r/…/review', prefix: '' },
};
export const SOCIALS = Object.keys(SOCIAL_META) as SocialNetwork[];

/** Convierte "@usuario", "usuario" o una URL en la URL del perfil. */
export function socialUrl(network: SocialNetwork, value: string): string {
  const v = value.trim();
  if (/^https?:\/\//.test(v)) return v;
  return `${SOCIAL_META[network].prefix}${v.replace(/^@/, '')}`;
}

export const TENANT_STATUS_META: Record<TenantStatus, { label: string; badge: string; dot: string }> = {
  draft: { label: 'Borrador', badge: 'bg-gray-500/15 text-gray-300 ring-gray-500/30', dot: 'bg-gray-400' },
  provisioning: { label: 'Provisionando', badge: 'bg-sky-500/15 text-sky-300 ring-sky-500/30', dot: 'bg-sky-400' },
  live: { label: 'En producción', badge: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30', dot: 'bg-emerald-400' },
  suspended: { label: 'Suspendido', badge: 'bg-amber-500/15 text-amber-300 ring-amber-500/30', dot: 'bg-amber-400' },
  error: { label: 'Error', badge: 'bg-rose-500/15 text-rose-300 ring-rose-500/30', dot: 'bg-rose-400' },
};
export const TENANT_STATUSES: TenantStatus[] = ['draft', 'provisioning', 'live', 'suspended', 'error'];

export const TENANT_TYPE_META: Record<TenantBusinessType, { label: string; icon: LucideIcon; tint: string }> = {
  barberia: { label: 'Barbería', icon: Scissors, tint: 'bg-sky-500/15 text-sky-300' },
  peluqueria: { label: 'Peluquería', icon: Sparkles, tint: 'bg-fuchsia-500/15 text-fuchsia-300' },
  salon: { label: 'Salón', icon: Brush, tint: 'bg-violet-500/15 text-violet-300' },
  estetica: { label: 'Estética', icon: Flower2, tint: 'bg-rose-500/15 text-rose-300' },
  restaurante: { label: 'Restaurante', icon: UtensilsCrossed, tint: 'bg-amber-500/15 text-amber-300' },
  cafeteria: { label: 'Cafetería', icon: Coffee, tint: 'bg-orange-500/15 text-orange-300' },
  clinica: { label: 'Clínica', icon: Stethoscope, tint: 'bg-teal-500/15 text-teal-300' },
  otro: { label: 'Otro', icon: Store, tint: 'bg-gray-500/15 text-gray-300' },
};
export const TENANT_TYPES = Object.keys(TENANT_TYPE_META) as TenantBusinessType[];

/** Pasos del provisionado en orden (el último, go-live, no tiene fila de integración). */
export const PROVIDERS: IntegrationProvider[] = ['places', 'supabase', 'preview', 'vercel', 'dns', 'onesignal', 'gsc'];
/** Pasos de "Crear preview": bastan para ver la web en <slug>-<sufijo>.vercel.app antes del go-live. */
export const PREVIEW_STEPS: IntegrationProvider[] = ['supabase', 'preview'];
export const PIPELINE_STEPS = [...PROVIDERS, 'go-live'] as const;
export type PipelineStep = (typeof PIPELINE_STEPS)[number];

export const PROVIDER_META: Record<PipelineStep, { label: string; icon: LucideIcon; description: string }> = {
  places: { label: 'Google Places', icon: MapPin, description: 'Ficha de Maps: place_id, dirección, coordenadas y horario.' },
  supabase: { label: 'Supabase del SaaS', icon: Database, description: 'Negocio, dominios, plan y servicios en la BD del SaaS.' },
  preview: { label: 'Preview', icon: Eye, description: 'Host de preview (.vercel.app o de la agencia) en Vercel y en business_domains.' },
  vercel: { label: 'Vercel', icon: Cloud, description: 'Dominio del cliente y www en el proyecto del SaaS.' },
  dns: { label: 'DNS', icon: Globe, description: 'Registros que pide Vercel en Cloudflare o IONOS y verificación.' },
  onesignal: { label: 'OneSignal', icon: Bell, description: 'App de notificaciones push y su REST key en Vault.' },
  gsc: { label: 'Search Console', icon: Search, description: 'Verificación DNS, propiedad sc-domain y sitemap.' },
  'go-live': { label: 'Go-live', icon: CalendarClock, description: 'Activa el negocio, pasa a live y fija la renovación.' },
};

export const INTEGRATION_STATUS_META: Record<TenantIntegrationStatus, { label: string; badge: string }> = {
  pending: { label: 'Pendiente', badge: 'bg-gray-500/15 text-gray-300 ring-gray-500/30' },
  running: { label: 'En curso', badge: 'bg-sky-500/15 text-sky-300 ring-sky-500/30' },
  ok: { label: 'OK', badge: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30' },
  error: { label: 'Error', badge: 'bg-rose-500/15 text-rose-300 ring-rose-500/30' },
  skipped: { label: 'Omitido', badge: 'bg-gray-500/10 text-gray-400 ring-gray-600/30' },
};

export const DNS_PROVIDER_META: Record<DnsProviderId, { label: string }> = {
  cloudflare: { label: 'Cloudflare' },
  ionos: { label: 'IONOS' },
};

export const PAYMENT_CONCEPT_LABEL: Record<PaymentConcept, string> = {
  deposit: 'Depósito (50 %)',
  final: 'Pago final (50 %)',
  single: 'Pago único',
  maintenance: 'Mantenimiento anual',
  ai: 'IA mensual',
};

export const REQUIREMENT_LABEL: Record<TenantRequirement, string> = {
  name: 'Nombre del negocio',
  business_type: 'Tipo de negocio',
  layout: 'Layout de la web',
  plan: 'Plan',
  domain: 'Dominio',
  opening_hours: 'Horario',
  address: 'Dirección',
  payment: 'Cobro inicial (depósito o pago único)',
};
export const REQUIREMENTS: TenantRequirement[] = ['name', 'business_type', 'layout', 'plan', 'domain', 'opening_hours', 'address', 'payment'];

export const WEEKDAYS: Weekday[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
export const WEEKDAY_LABEL: Record<Weekday, string> = {
  mon: 'Lunes',
  tue: 'Martes',
  wed: 'Miércoles',
  thu: 'Jueves',
  fri: 'Viernes',
  sat: 'Sábado',
  sun: 'Domingo',
};

/** Etiquetas de las features del SaaS (public.feature_keys()). */
export const FEATURE_LABEL: Record<string, string> = {
  has_store: 'Tienda',
  has_gallery: 'Galería',
  allow_manual_booking: 'Cita manual',
  enable_emails: 'Emails',
  enable_campaigns: 'Campañas',
  enable_pwa: 'PWA y push',
  enable_seo_advanced: 'SEO avanzado',
};

export interface LayoutVariantMeta {
  key: string;
  layout: LayoutVariant;
  name: string;
  description: string;
  surface: string;
  text: string;
  accent: string;
  font: string;
  radius: string;
}

const v = (key: string, name: string, description: string, surface: string, text: string, accent: string, font: string, radius: string): LayoutVariantMeta => ({
  key,
  layout: key.split('_')[0] as LayoutVariant,
  name,
  description,
  surface,
  text,
  accent,
  font,
  radius,
});

/**
 * Copia visual de public.layout_variants del SaaS (colores y tipografía por defecto) para la preview.
 * Debe coincidir con src/themes/layouts/catalog.ts del SaaS. classic_prestige es la web propia de
 * Adrián Millán: se muestra pero no se ofrece para tenants nuevos.
 */
export const LAYOUT_VARIANTS: LayoutVariantMeta[] = [
  v('barber_tradicion', 'Tradición', 'Tarifa pintada, latón y cuero', '#1f1210', '#f2e6d0', '#b8893b', 'DM Serif Display, serif', '0'),
  v('barber_urbano', 'Urbano', 'Cartel enorme, hormigón y naranja', '#e4e1db', '#111111', '#ff4d1a', 'Bebas Neue, sans-serif', '0'),
  v('barber_club', 'Club', 'Club de caballeros: verde y latón', '#0e2219', '#efe9dc', '#c9a45c', 'Cormorant Garamond, serif', '6px'),
  v('barber_taller', 'Taller', 'Acero, amarillo y ficha técnica', '#161a1d', '#e8ebec', '#f2c230', 'Oswald, sans-serif', '0'),
  v('barber_barrio', 'Barrio', 'Luminosa, cercana y cobalto', '#fbfaf7', '#14213d', '#1f4fd8', 'Archivo, sans-serif', '999px'),
  v('women_atelier', 'Atelier', 'Revista de moda y estilistas', '#f6f3ee', '#141414', '#8c1c2b', 'Playfair Display, serif', '0'),
  v('women_color', 'Color', 'Probador de tonos en la portada', '#0f2b2e', '#f1ece4', '#e8875a', 'Syne, sans-serif', '20px'),
  v('women_novias', 'Novias', 'Invitación, arcos y champán', '#faf6f1', '#3a2f2a', '#b08d57', 'Cormorant Garamond, serif', '28px'),
  v('women_rizos', 'Rizos', 'Ondas, rosa y mostaza', '#f7e4dc', '#3b1f14', '#d4a017', 'Baloo 2, sans-serif', '999px'),
  v('women_esencia', 'Esencia', 'Minimalismo nórdico', '#ffffff', '#1c1c1c', '#1c1c1c', 'Josefin Sans, sans-serif', '0'),
  v('beauty_spa', 'Spa', 'Salvia, piedra y respiración', '#eef0e8', '#2c3a2e', '#6f8f72', 'Cormorant Garamond, serif', '28px'),
  v('beauty_nails', 'Nails', 'Esmaltes, rosa y cereza', '#fbe8ea', '#1a0a0d', '#c8102e', 'Archivo, sans-serif', '999px'),
  v('beauty_glow', 'Glow', 'Clínica de piel por tiempos', '#f7fbfa', '#0e2a2a', '#11998e', 'Plus Jakarta Sans, sans-serif', '20px'),
  v('beauty_noir', 'Noir', 'Negro y rosa champán', '#0d0b0c', '#f4ece8', '#e8b4b8', 'DM Serif Display, serif', '6px'),
  v('beauty_mirada', 'Mirada', 'Cejas y pestañas, anillo que gira', '#f3e9e4', '#2b1a15', '#a4515f', 'Playfair Display, serif', '999px'),
  v('unisex_estudio', 'Estudio', 'Rejilla de bloques y rojo', '#f5f5f0', '#111111', '#e6372b', 'Space Grotesk, sans-serif', '12px'),
  v('unisex_loft', 'Loft', 'Carbón, ladrillo y fotos que desfilan', '#1e1c1b', '#ece6e1', '#c4562f', 'Archivo, sans-serif', '6px'),
  v('unisex_neon', 'Neón', 'Noche y rosa neón', '#0b0f24', '#eef0ff', '#ff2e88', 'Syne, sans-serif', '20px'),
  v('unisex_natural', 'Natural', 'Lino, oliva y fichas apiladas', '#efe9df', '#2a2e1f', '#5e6b2f', 'Fraunces, serif', '20px'),
  v('unisex_pop', 'Pop', 'Amarillo, rosa y pegatinas', '#ffe14d', '#111111', '#ff3c8e', 'Fredoka, sans-serif', '28px'),
  v('classic_prestige', 'Prestige', 'Web propia de Adrián Millán', '#0a0a0a', '#e4e4e7', '#d4af37', 'Plus Jakarta Sans, sans-serif', '16px'),
];

/** Grupo de portadas que encaja con cada tipo de negocio (se puede cambiar a mano). */
export const LAYOUT_FOR_TYPE: Record<TenantBusinessType, LayoutVariant> = {
  barberia: 'barber',
  peluqueria: 'women',
  salon: 'beauty',
  estetica: 'beauty',
  restaurante: 'unisex',
  cafeteria: 'unisex',
  clinica: 'beauty',
  otro: 'unisex',
};

/** Portada real del SaaS con datos de ejemplo (el SaaS permite ?variant= en sus previews). */
export const SAAS_DEMO_URL = 'https://saas-demo-preview.vercel.app';
export const variantDemoUrl = (key: string) => `${SAAS_DEMO_URL}/?variant=${encodeURIComponent(key)}`;

export function variantsOf(layout: LayoutVariant): LayoutVariantMeta[] {
  return LAYOUT_VARIANTS.filter((x) => x.layout === layout);
}

/** Variante efectiva: la elegida o, si no hay, la primera del layout (igual que el provisionado). */
export function effectiveVariant(layout: LayoutVariant, variant: string | null): LayoutVariantMeta {
  return LAYOUT_VARIANTS.find((x) => x.key === variant && x.layout === layout) ?? variantsOf(layout)[0];
}
