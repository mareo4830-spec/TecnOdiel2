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

/** Copia visual de public.layout_variants del SaaS (colores y tipografía por defecto) para la preview. */
export const LAYOUT_VARIANTS: LayoutVariantMeta[] = [
  v('classic_heritage', 'Heritage', 'Madera y vintage', '#1c140d', '#efe4d4', '#b07d48', 'Playfair Display, serif', '4px'),
  v('classic_industrial', 'Industrial', 'Metal y urbano', '#15181b', '#e3e6e8', '#e07a2f', 'Oswald, sans-serif', '0'),
  v('classic_prestige', 'Prestige', 'Lujo y dorado', '#0a0a0a', '#e4e4e7', '#d4af37', 'Plus Jakarta Sans, sans-serif', '16px'),
  v('classic_street', 'Street', 'Urbano y neón', '#07080b', '#f1f4f8', '#39ff88', 'Bebas Neue, sans-serif', '8px'),
  v('classic_club', 'Club', 'Deportivo y dinámico', '#0d1b2a', '#f1f4f8', '#e63946', 'Archivo, sans-serif', '12px'),
  v('minimal_clinic', 'Clinic', 'Blanco, estéril y azul', '#ffffff', '#0f172a', '#2563eb', 'Manrope, sans-serif', '12px'),
  v('minimal_spa', 'Spa', 'Zen, tierra y pastel', '#f6f1ea', '#3b3129', '#a47e5f', 'Cormorant Garamond, serif', '16px'),
  v('minimal_luxury', 'Luxury', 'Mármol y oro rosa', '#fbf9f7', '#2d2426', '#b76e79', 'Playfair Display, serif', '8px'),
  v('minimal_botanical', 'Botanical', 'Verde y natural', '#f4f6ef', '#243024', '#4f7a52', 'Fraunces, serif', '999px'),
  v('minimal_chic', 'Chic', 'Monocromático y moda', '#ffffff', '#111111', '#111111', 'Syne, sans-serif', '0'),
  v('editorial_magazine', 'Magazine', 'Asimétrico y tipografía grande', '#171411', '#f3ede2', '#c9a980', 'Fraunces, serif', '0'),
  v('editorial_studio', 'Studio', 'Vibrante y creativo', '#fffaf5', '#1d1a2e', '#ff5c39', 'Syne, sans-serif', '12px'),
  v('editorial_gallery', 'Gallery', 'Visual y cajas grandes', '#0c0c0c', '#f2f0eb', '#e8e2d6', 'DM Serif Display, serif', '0'),
  v('editorial_fluid', 'Fluid', 'Formas suaves y moderno', '#f7f5ff', '#1e1a33', '#7c5cff', 'Plus Jakarta Sans, sans-serif', '999px'),
  v('editorial_pop', 'Pop', 'Colores de alto contraste', '#fff200', '#111111', '#ff2d95', 'Bebas Neue, sans-serif', '4px'),
  v('playful_paws', 'Paws', 'Cálido y amigable', '#fffbeb', '#3b2506', '#f59e0b', 'Fredoka, sans-serif', '16px'),
  v('playful_boutique', 'Boutique', 'Coqueto y elegante', '#fff5f8', '#3a1b27', '#d9467a', 'Playfair Display, serif', '12px'),
  v('playful_nature', 'Nature', 'Campo y aire libre', '#f3f8ef', '#1f3324', '#3f8f5b', 'Baloo 2, sans-serif', '16px'),
  v('playful_bubble', 'Bubble', 'Burbujas y pastel', '#f0f9ff', '#0c2a3d', '#38bdf8', 'Fredoka, sans-serif', '999px'),
  v('playful_vibrant', 'Vibrant', 'Colores intensos y divertidos', '#fdf4ff', '#2e1065', '#8b5cf6', 'Baloo 2, sans-serif', '16px'),
];

export function variantsOf(layout: LayoutVariant): LayoutVariantMeta[] {
  return LAYOUT_VARIANTS.filter((x) => x.layout === layout);
}

/** Variante efectiva: la elegida o, si no hay, la primera del layout (igual que el provisionado). */
export function effectiveVariant(layout: LayoutVariant, variant: string | null): LayoutVariantMeta {
  return LAYOUT_VARIANTS.find((x) => x.key === variant && x.layout === layout) ?? variantsOf(layout)[0];
}
