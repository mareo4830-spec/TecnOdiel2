/*
 * Copia ligera de `LAYOUT_VARIANTS` de la Oficina Virtual
 * (oficina/src/features/tenants/tenantMeta.ts) — mismas claves, mismos colores y tipografías,
 * para que lo que el cliente elige aquí case 1:1 con el asistente de tenants cuando el equipo
 * lo revise y lo cree de verdad.
 */
export const LAYOUT_FAMILIES = [
  { id: 'classic', label: 'Clásico', hint: 'Elegante y de toda la vida' },
  { id: 'minimal', label: 'Minimalista', hint: 'Limpio, blanco y directo' },
  { id: 'editorial', label: 'Editorial', hint: 'Tipografía grande, con carácter' },
  { id: 'playful', label: 'Divertido', hint: 'Cercano y colorido' },
];

export const LAYOUT_VARIANTS = [
  { key: 'classic_heritage', layout: 'classic', name: 'Heritage', description: 'Madera y vintage', surface: '#1c140d', text: '#efe4d4', accent: '#b07d48', font: 'Playfair Display, serif', radius: '4px' },
  { key: 'classic_industrial', layout: 'classic', name: 'Industrial', description: 'Metal y urbano', surface: '#15181b', text: '#e3e6e8', accent: '#e07a2f', font: 'Oswald, sans-serif', radius: '0' },
  { key: 'classic_prestige', layout: 'classic', name: 'Prestige', description: 'Lujo y dorado', surface: '#0a0a0a', text: '#e4e4e7', accent: '#d4af37', font: 'Plus Jakarta Sans, sans-serif', radius: '16px' },
  { key: 'classic_street', layout: 'classic', name: 'Street', description: 'Urbano y neón', surface: '#07080b', text: '#f1f4f8', accent: '#39ff88', font: 'Bebas Neue, sans-serif', radius: '8px' },
  { key: 'classic_club', layout: 'classic', name: 'Club', description: 'Deportivo y dinámico', surface: '#0d1b2a', text: '#f1f4f8', accent: '#e63946', font: 'Archivo, sans-serif', radius: '12px' },
  { key: 'minimal_clinic', layout: 'minimal', name: 'Clinic', description: 'Blanco, estéril y azul', surface: '#ffffff', text: '#0f172a', accent: '#2563eb', font: 'Manrope, sans-serif', radius: '12px' },
  { key: 'minimal_spa', layout: 'minimal', name: 'Spa', description: 'Zen, tierra y pastel', surface: '#f6f1ea', text: '#3b3129', accent: '#a47e5f', font: 'Cormorant Garamond, serif', radius: '16px' },
  { key: 'minimal_luxury', layout: 'minimal', name: 'Luxury', description: 'Mármol y oro rosa', surface: '#fbf9f7', text: '#2d2426', accent: '#b76e79', font: 'Playfair Display, serif', radius: '8px' },
  { key: 'minimal_botanical', layout: 'minimal', name: 'Botanical', description: 'Verde y natural', surface: '#f4f6ef', text: '#243024', accent: '#4f7a52', font: 'Fraunces, serif', radius: '999px' },
  { key: 'minimal_chic', layout: 'minimal', name: 'Chic', description: 'Monocromático y moda', surface: '#ffffff', text: '#111111', accent: '#111111', font: 'Syne, sans-serif', radius: '0' },
  { key: 'editorial_magazine', layout: 'editorial', name: 'Magazine', description: 'Asimétrico y tipografía grande', surface: '#171411', text: '#f3ede2', accent: '#c9a980', font: 'Fraunces, serif', radius: '0' },
  { key: 'editorial_studio', layout: 'editorial', name: 'Studio', description: 'Vibrante y creativo', surface: '#fffaf5', text: '#1d1a2e', accent: '#ff5c39', font: 'Syne, sans-serif', radius: '12px' },
  { key: 'editorial_gallery', layout: 'editorial', name: 'Gallery', description: 'Visual y cajas grandes', surface: '#0c0c0c', text: '#f2f0eb', accent: '#e8e2d6', font: 'DM Serif Display, serif', radius: '0' },
  { key: 'editorial_fluid', layout: 'editorial', name: 'Fluid', description: 'Formas suaves y moderno', surface: '#f7f5ff', text: '#1e1a33', accent: '#7c5cff', font: 'Plus Jakarta Sans, sans-serif', radius: '999px' },
  { key: 'editorial_pop', layout: 'editorial', name: 'Pop', description: 'Colores de alto contraste', surface: '#fff200', text: '#111111', accent: '#ff2d95', font: 'Bebas Neue, sans-serif', radius: '4px' },
  { key: 'playful_paws', layout: 'playful', name: 'Paws', description: 'Cálido y amigable', surface: '#fffbeb', text: '#3b2506', accent: '#f59e0b', font: 'Fredoka, sans-serif', radius: '16px' },
  { key: 'playful_boutique', layout: 'playful', name: 'Boutique', description: 'Coqueto y elegante', surface: '#fff5f8', text: '#3a1b27', accent: '#d9467a', font: 'Playfair Display, serif', radius: '12px' },
  { key: 'playful_nature', layout: 'playful', name: 'Nature', description: 'Campo y aire libre', surface: '#f3f8ef', text: '#1f3324', accent: '#3f8f5b', font: 'Baloo 2, sans-serif', radius: '16px' },
  { key: 'playful_bubble', layout: 'playful', name: 'Bubble', description: 'Burbujas y pastel', surface: '#f0f9ff', text: '#0c2a3d', accent: '#38bdf8', font: 'Fredoka, sans-serif', radius: '999px' },
  { key: 'playful_vibrant', layout: 'playful', name: 'Vibrant', description: 'Colores intensos y divertidos', surface: '#fdf4ff', text: '#2e1065', accent: '#8b5cf6', font: 'Baloo 2, sans-serif', radius: '16px' },
];

export function variantsOf(layout) {
  return LAYOUT_VARIANTS.filter((v) => v.layout === layout);
}

/** "Ambiente" elegido por el cliente → familia de layout recomendada. */
export const AMBIENTE_TO_FAMILY = {
  minimalista: 'minimal',
  clasico: 'classic',
  elegante: 'editorial',
  divertido: 'playful',
};

export const ACCENT_PALETTE = ['#6DD94B', '#2563eb', '#e07a2f', '#d4af37', '#e63946', '#a47e5f', '#7c5cff', '#f59e0b', '#38bdf8', '#111111'];
