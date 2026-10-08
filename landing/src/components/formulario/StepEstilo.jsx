import React, { useState, useEffect } from 'react';
import { Check, ExternalLink } from 'lucide-react';
import { ACCENT_PALETTE } from './layoutSwatches';

// Las plantillas oficiales y creadas por TecnOdiel para cada sector
export const REAL_TEMPLATES = {
  restauracion: {
    label: 'Bares y Restaurantes',
    sectorIds: ['restaurante', 'cafeteria'],
    items: [
      { slug: 'noir-atelier', name: 'Cinematográfico', mood: 'Alta cocina, vídeo y fotos a pantalla completa', img: '/demos/noir-atelier.jpg', defaultAccent: '#6DD94B' },
      { slug: 'smash-destroy', name: 'Urbano', mood: 'Hamburgueserías, pizzas y street food', img: '/demos/smash-destroy.jpg', defaultAccent: '#FFE600' },
      { slug: 'aura-velvet', name: 'Cristal', mood: 'Coctelería y copas, moderno y elegante', img: '/demos/aura-velvet.jpg', defaultAccent: '#A855F7' },
      { slug: 'le-maison', name: 'Editorial', mood: 'Estilo revista para bistrós y cocina de autor', img: '/demos/le-maison.jpg', defaultAccent: '#E2D9C8' },
      { slug: 'cyber-fusion', name: 'Futurista', mood: 'Fusión y locales jóvenes que quieren destacar', img: '/demos/cyber-fusion.jpg', defaultAccent: '#00F0FF' },
      { slug: 'casa-encina', name: 'Rústico', mood: 'Asadores y cocina tradicional, cálido y cercano', img: '/demos/casa-encina.jpg', defaultAccent: '#F97316' }
    ]
  },
  salud: {
    label: 'Clínicas y Salud',
    sectorIds: ['clinica'],
    items: [
      { slug: 'swiss-dental', name: 'Minimal', mood: 'Limpio y profesional para clínicas dentales', img: '/demos/swiss-dental.jpg', defaultAccent: '#0055FF' },
      { slug: 'genome-biotech', name: 'Alta tecnología', mood: 'Medicina deportiva y centros avanzados', img: '/demos/genome-biotech.jpg', defaultAccent: '#06B6D4' },
      { slug: 'pequenos-gigantes', name: 'Amable', mood: 'Pediatría y familias, colorido y cercano', img: '/demos/pequenos-gigantes.jpg', defaultAccent: '#70D6BC' },
      { slug: 'espacio-vacio', name: 'Zen', mood: 'Psicología, spa y bienestar, sereno', img: '/demos/espacio-vacio.jpg', defaultAccent: '#A3B18A' },
      { slug: 'aura-gold', name: 'Lujo', mood: 'Estética avanzada y tratamientos premium', img: '/demos/aura-gold.jpg', defaultAccent: '#D4AF37' },
      { slug: 'ortho-tech', name: 'Precisión', mood: 'Ortodoncia y traumatología con aire técnico', img: '/demos/ortho-tech.jpg', defaultAccent: '#3B82F6' }
    ]
  },
  belleza: {
    label: 'Belleza y Barbería',
    sectorIds: ['barberia', 'peluqueria', 'salon', 'estetica'],
    items: [
      { slug: 'noir-atelier', name: 'Adrián Millán', mood: 'Web, reservas y panel de gestión para barbería', img: '/demos/noir-atelier.jpg', defaultAccent: '#6DD94B' },
      { slug: 'casa-encina', name: 'Heritage Vintage', mood: 'Madera, barbería clásica y tradicional', img: '/demos/casa-encina.jpg', defaultAccent: '#b07d48' },
      { slug: 'smash-destroy', name: 'Street Urbano', mood: 'Cortes modernos, degradados y estilo joven', img: '/demos/smash-destroy.jpg', defaultAccent: '#39ff88' },
      { slug: 'swiss-dental', name: 'Minimal Clinic', mood: 'Limpio y profesional para estética y salones', img: '/demos/swiss-dental.jpg', defaultAccent: '#2563eb' },
      { slug: 'aura-gold', name: 'Lujo & Estética', mood: 'Tratamientos premium y cuidado personal', img: '/demos/aura-gold.jpg', defaultAccent: '#d4af37' },
      { slug: 'le-maison', name: 'Editorial Studio', mood: 'Estilo revista y catálogo visual de cortes', img: '/demos/le-maison.jpg', defaultAccent: '#c9a980' }
    ]
  },
  comercio: {
    label: 'Comercio y Otros',
    sectorIds: ['tienda', 'otro'],
    items: [
      { slug: 'noir-atelier', name: 'Comercio Local', mood: 'Tienda de barrio, catálogo y escaparate', img: '/demos/noir-atelier.jpg', defaultAccent: '#6DD94B' },
      { slug: 'swiss-dental', name: 'Minimal Pro', mood: 'Servicios profesionales y marca personal', img: '/demos/swiss-dental.jpg', defaultAccent: '#0284C7' },
      { slug: 'le-maison', name: 'Editorial Elegante', mood: 'Diseño cuidado y galería destacada', img: '/demos/le-maison.jpg', defaultAccent: '#1c1917' },
      { slug: 'smash-destroy', name: 'Moderno Urbano', mood: 'Negocios dinámicos y jóvenes', img: '/demos/smash-destroy.jpg', defaultAccent: '#FFE600' }
    ]
  }
};

function resolveCategory(sector) {
  if (['restaurante', 'cafeteria'].includes(sector)) return 'restauracion';
  if (['clinica'].includes(sector)) return 'salud';
  if (['barberia', 'peluqueria', 'salon', 'estetica'].includes(sector)) return 'belleza';
  return 'comercio';
}

export default function StepEstilo({ form, set }) {
  const initialCategory = resolveCategory(form.sector);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // Sincronizar categoría si cambia el sector
  useEffect(() => {
    setSelectedCategory(resolveCategory(form.sector));
  }, [form.sector]);

  const currentGroup = REAL_TEMPLATES[selectedCategory] || REAL_TEMPLATES.restauracion;
  const currentItems = currentGroup.items;

  // Preseleccionar la primera plantilla si no hay ninguna elegida
  useEffect(() => {
    if (!form.layoutVariant || !currentItems.some(it => it.slug === form.layoutVariant)) {
      if (currentItems[0]) {
        set('layoutVariant', currentItems[0].slug);
        set('templateSlug', currentItems[0].slug);
        set('templateName', currentItems[0].name);
      }
    }
  }, [selectedCategory, form.layoutVariant, currentItems, set]);

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl text-white">Elige el estilo que más te represente</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Plantillas reales y funcionando. Te hemos preseleccionado las de tu sector; cámbiala si quieres.
        </p>
      </div>

      {/* Píldoras de sectores */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(REAL_TEMPLATES).map(([catKey, catData]) => {
          const isCurrent = selectedCategory === catKey;
          return (
            <button
              key={catKey}
              type="button"
              onClick={() => setSelectedCategory(catKey)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                isCurrent 
                  ? 'border-[#6DD94B] bg-[#6DD94B]/15 text-[#6DD94B]' 
                  : 'border-white/10 text-zinc-400 hover:border-white/25 hover:text-white'
              }`}
            >
              {catData.label}
            </button>
          );
        })}
      </div>

      {/* Grid de plantillas con imágenes reales */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
        {currentItems.map((item) => {
          const isSelected = form.layoutVariant === item.slug;
          const currentAccent = form.accentOverride || item.defaultAccent;

          return (
            <div
              key={item.slug}
              onClick={() => {
                set('layoutVariant', item.slug);
                set('templateSlug', item.slug);
                set('templateName', item.name);
              }}
              className={`group relative overflow-hidden rounded-xl border text-left transition cursor-pointer select-none ${
                isSelected 
                  ? 'border-[#6DD94B] ring-2 ring-[#6DD94B]/50 bg-white/[0.08] shadow-lg shadow-[#6DD94B]/10' 
                  : 'border-white/10 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.05]'
              }`}
            >
              {/* Imagen en miniatura de la plantilla */}
              <div className="relative h-24 sm:h-28 w-full overflow-hidden bg-zinc-950">
                <img
                  src={item.img}
                  alt={`Estilo ${item.name}`}
                  className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Check verde si está seleccionada */}
                {isSelected && (
                  <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-[#6DD94B] text-black shadow-md">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                )}

                {/* Enlace para ver la demo en vivo */}
                <a
                  href={`/?tenant=${item.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title="Abrir demo en vivo a pantalla completa"
                  className="absolute bottom-2 right-2 rounded-full bg-black/75 px-2 py-0.5 text-[9px] font-semibold text-zinc-200 backdrop-blur hover:bg-[#6DD94B] hover:text-black transition flex items-center gap-1"
                >
                  Demo <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>

              {/* Información y barra de acento */}
              <div className="p-3">
                <div className="flex items-center justify-between gap-1">
                  <p className="truncate text-xs font-bold text-white">Estilo {item.name}</p>
                  <span 
                    className="h-2 w-2 rounded-full shrink-0" 
                    style={{ backgroundColor: currentAccent }}
                    title="Color de acento"
                  />
                </div>
                <p className="mt-1 text-[10px] leading-tight text-zinc-400 line-clamp-2">{item.mood}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selector de color de acento / personalización */}
      <div>
        <span className="mb-2.5 block text-xs font-semibold uppercase tracking-wide text-zinc-400">
          O prueba otro color de acento
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => set('accentOverride', '')}
            className={`h-9 rounded-full border px-3 text-xs font-medium transition cursor-pointer ${
              !form.accentOverride ? 'border-[#6DD94B] text-[#6DD94B] bg-[#6DD94B]/10' : 'border-white/10 text-zinc-400 hover:border-white/25'
            }`}
          >
            Original
          </button>
          {ACCENT_PALETTE.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`Acento ${c}`}
              onClick={() => set('accentOverride', c)}
              style={{ background: c }}
              className={`h-9 w-9 rounded-full border-2 transition cursor-pointer ${
                form.accentOverride === c 
                  ? 'border-white scale-110 shadow-[0_0_12px_rgba(255,255,255,0.4)]' 
                  : 'border-transparent hover:scale-105 opacity-85 hover:opacity-100'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
