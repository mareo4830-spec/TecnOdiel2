import React, { useEffect } from 'react';
import { Check, Image as ImageIcon } from 'lucide-react';

export const ACCENT_PALETTE = [
  '#6DD94B', // Verde TecnOdiel
  '#2563EB', // Azul Royal
  '#F97316', // Naranja
  '#D4AF37', // Oro / Dorado
  '#E63946', // Rojo
  '#A47E5F', // Tostado / Cuero
  '#7C5CFF', // Violeta / Púrpura
  '#FFA000', // Amarillo Mostaza
  '#06B6D4', // Cian
  '#EC4899', // Rosa
  '#FFFFFF'  // Blanco
];

export const SECTOR_STYLES = {
  restauracion: [
    { key: 'bistro-split', layoutType: 'split', name: 'Estilo Bistró', mood: 'Foto grande a la derecha, carta y botón de reserva', defaultAccent: '#6DD94B' },
    { key: 'urban-street', layoutType: 'playful', name: 'Estilo Urbano', mood: 'Street food, tarjetas redondeadas y pedido rápido', defaultAccent: '#FFA000' },
    { key: 'lounge-velvet', layoutType: 'luxury', name: 'Estilo Lounge', mood: 'Elegante y oscuro, cócteles y botón dorado', defaultAccent: '#A855F7' },
    { key: 'zen-terraza', layoutType: 'zen', name: 'Estilo Terraza', mood: 'Calma, espacio amplio y botón de contorno fino', defaultAccent: '#A3B18A' },
    { key: 'tech-gourmet', layoutType: 'tech', name: 'Estilo Vanguardia', mood: 'Moderno, métricas de experiencia y llamada clara', defaultAccent: '#06B6D4' },
    { key: 'asador-grid', layoutType: 'grid', name: 'Estilo Tradicional', mood: 'Cuadrícula limpia con fotos de platos y botón pedir', defaultAccent: '#F97316' }
  ],
  salud: [
    { key: 'clinic-minimal', layoutType: 'split', name: 'Estilo Minimal', mood: 'Limpio y profesional para clínicas dentales', defaultAccent: '#2563EB' },
    { key: 'tech-advanced', layoutType: 'tech', name: 'Estilo Alta Tecnología', mood: 'Medicina deportiva y centros avanzados', defaultAccent: '#06B6D4' },
    { key: 'amable-family', layoutType: 'playful', name: 'Estilo Amable', mood: 'Pediatría y familias, colorido y cercano', defaultAccent: '#70D6BC' },
    { key: 'zen-wellness', layoutType: 'zen', name: 'Estilo Zen', mood: 'Psicología, spa y bienestar, sereno', defaultAccent: '#A3B18A' },
    { key: 'luxury-aesthetics', layoutType: 'luxury', name: 'Estilo Lujo', mood: 'Estética avanzada y tratamientos premium', defaultAccent: '#D4AF37' },
    { key: 'precision-grid', layoutType: 'grid', name: 'Estilo Precisión', mood: 'Ortodoncia y traumatología con aire técnico', defaultAccent: '#3B82F6' }
  ],
  belleza: [
    { key: 'barber-modern', layoutType: 'playful', name: 'Estilo Barber Urbano', mood: 'Cortes modernos, degradados y reserva directa', defaultAccent: '#6DD94B' },
    { key: 'salon-luxury', layoutType: 'luxury', name: 'Estilo Salón Glamour', mood: 'Belleza, peluquería femenina y color VIP', defaultAccent: '#D4AF37' },
    { key: 'spa-natural', layoutType: 'zen', name: 'Estilo Spa Natural', mood: 'Masajes, estética orgánica y bienestar', defaultAccent: '#A3B18A' },
    { key: 'studio-minimal', layoutType: 'split', name: 'Estilo Minimal Hair', mood: 'Estudio limpio, fotos claras y cita online', defaultAccent: '#2563EB' },
    { key: 'creative-hair', layoutType: 'tech', name: 'Estilo Tendencias', mood: 'Diseño de autor, moda y reservas activas', defaultAccent: '#A855F7' },
    { key: 'barber-classic', layoutType: 'grid', name: 'Estilo Barber Clásico', mood: 'Navaja tradicional y servicios organizados', defaultAccent: '#F97316' }
  ],
  comercio: [
    { key: 'shop-minimal', layoutType: 'split', name: 'Estilo Escaparate', mood: 'Catálogo limpio, foto destacada y contacto directo', defaultAccent: '#6DD94B' },
    { key: 'tech-store', layoutType: 'tech', name: 'Estilo Tech Store', mood: 'Fichas estructuradas y llamada a la acción', defaultAccent: '#06B6D4' },
    { key: 'boutique-chic', layoutType: 'luxury', name: 'Estilo Boutique', mood: 'Moda exclusiva, accesorios y estética selecta', defaultAccent: '#D4AF37' },
    { key: 'market-local', layoutType: 'playful', name: 'Estilo Cercano', mood: 'Comercio local, productos y atención rápida', defaultAccent: '#FFA000' },
    { key: 'studio-art', layoutType: 'zen', name: 'Estilo Creativo', mood: 'Estudio de diseño, portafolio y proyectos', defaultAccent: '#A3B18A' },
    { key: 'services-grid', layoutType: 'grid', name: 'Estilo Servicios', mood: 'Bloques claros de servicios y presupuesto', defaultAccent: '#3B82F6' }
  ]
};

function resolveCategory(sector) {
  if (sector === 'clinica') return 'salud';
  return 'restauracion';
}

/**
 * Esqueleto interactivo de la plantilla web:
 * Dibuja la maqueta estructural mostrando la disposición exacta de
 * cabecera, titulares, botones y fotos.
 * Los botones y elementos de acento cambian de color en tiempo real.
 */
function WireframeSkeleton({ layoutType, accent }) {
  return (
    <div className="relative flex h-full w-full flex-col justify-between p-2 select-none pointer-events-none font-sans overflow-hidden bg-black/60">
      {/* Barra superior del navegador con controles y botón de acción */}
      <div className="flex items-center justify-between border-b border-white/10 pb-1.5 shrink-0">
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
          <span className="h-1.5 w-6 rounded-full bg-white/40 ml-1" />
        </div>
        <span 
          className="h-2.5 px-1.5 rounded-xs text-[5px] font-black uppercase text-black flex items-center justify-center transition-all duration-300 shadow-xs"
          style={{ backgroundColor: accent }}
        >
          BOTÓN
        </span>
      </div>

      {/* ── 1. ESQUELETO SPLIT (Titular a la izquierda + Caja de foto a la derecha + Botón) ── */}
      {layoutType === 'split' && (
        <div className="flex flex-1 items-center justify-between gap-1.5 pt-1.5">
          <div className="flex flex-1 flex-col justify-center gap-1">
            <span className="h-2 w-4/5 rounded-xs bg-white/80" />
            <span className="h-1.5 w-3/5 rounded-xs bg-white/50" />
            <span className="h-1 w-full rounded-xs bg-white/20 mt-0.5" />
            <span 
              className="mt-1 h-3 w-14 rounded-xs flex items-center justify-center text-[6px] font-black text-black transition-all duration-300 shadow-xs"
              style={{ backgroundColor: accent }}
            >
              BOTÓN
            </span>
          </div>
          <div className="flex h-12 w-14 shrink-0 flex-col items-center justify-center rounded border border-dashed border-white/25 bg-white/[0.04]">
            <ImageIcon className="h-3 w-3 text-white/40" />
            <span className="text-[5px] text-white/40 font-bold tracking-wider mt-0.5">FOTO</span>
          </div>
        </div>
      )}

      {/* ── 2. ESQUELETO TECH (Titular centrado + Tarjetas de métricas + Botón completo) ── */}
      {layoutType === 'tech' && (
        <div className="flex flex-1 flex-col justify-between pt-1">
          <div className="flex flex-col items-center gap-0.5">
            <span className="h-1.5 w-3/5 rounded-xs bg-white/85" />
            <span className="h-1 w-2/5 rounded-xs bg-white/45" />
          </div>
          <div className="grid grid-cols-2 gap-1 my-0.5">
            <div className="flex items-center gap-1 rounded border border-white/10 bg-white/[0.03] p-1">
              <span className="h-1.5 w-1.5 rounded-full shrink-0 transition-colors duration-300" style={{ backgroundColor: accent }} />
              <span className="h-1 w-full rounded-xs bg-white/50" />
            </div>
            <div className="flex items-center gap-1 rounded border border-white/10 bg-white/[0.03] p-1">
              <span className="h-1.5 w-1.5 rounded-full shrink-0 bg-white/25" />
              <span className="h-1 w-full rounded-xs bg-white/50" />
            </div>
          </div>
          <span 
            className="h-2.5 w-full rounded-xs flex items-center justify-center text-[6px] font-black text-black transition-all duration-300 shadow-xs"
            style={{ backgroundColor: accent }}
          >
            BOTÓN PRINCIPAL
          </span>
        </div>
      )}

      {/* ── 3. ESQUELETO PLAYFUL (Píldoras redondeadas + Superposición de fotos + Botón suave) ── */}
      {layoutType === 'playful' && (
        <div className="flex flex-1 items-center justify-between gap-1.5 pt-1">
          <div className="flex flex-1 flex-col justify-center gap-0.5">
            <span 
              className="w-fit rounded-full px-1.5 py-0.2 text-[5px] font-bold transition-all duration-300"
              style={{ backgroundColor: `${accent}25`, color: accent, border: `1px solid ${accent}60` }}
            >
              TAG
            </span>
            <span className="h-2 w-4/5 rounded-full bg-white/85" />
            <span className="h-1 w-3/5 rounded-full bg-white/50" />
            <span 
              className="mt-0.5 h-3 w-12 rounded-full flex items-center justify-center text-[6px] font-black text-black transition-all duration-300 shadow-xs"
              style={{ backgroundColor: accent }}
            >
              BOTÓN
            </span>
          </div>
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
            <div className="absolute top-0 right-0 h-8 w-8 rounded-lg border border-dashed border-white/20 bg-white/[0.04] flex items-center justify-center">
              <ImageIcon className="h-2 w-2 text-white/30" />
            </div>
            <div className="absolute bottom-0 left-0 h-9 w-9 rounded-lg border border-white/25 bg-white/[0.08] shadow-sm flex flex-col items-center justify-center">
              <ImageIcon className="h-2.5 w-2.5 text-white/50" />
              <span className="text-[5px] text-white/40 font-bold">FOTO</span>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. ESQUELETO ZEN (Titular orgánico + Foto vertical estilizada + Botón borde fino) ── */}
      {layoutType === 'zen' && (
        <div className="flex flex-1 items-center justify-between gap-1.5 pt-1">
          <div className="flex flex-1 flex-col justify-center gap-1">
            <span className="h-1 w-1/3 rounded-xs transition-colors duration-300" style={{ backgroundColor: accent }} />
            <span className="h-2 w-4/5 rounded-xs bg-white/90" />
            <span className="h-1 w-3/5 rounded-xs bg-white/30" />
            <span 
              className="mt-0.5 h-3 w-14 rounded-xs border flex items-center justify-center text-[6px] font-bold transition-all duration-300"
              style={{ borderColor: accent, color: accent }}
            >
              BOTÓN
            </span>
          </div>
          <div className="flex h-12 w-11 shrink-0 flex-col items-center justify-center rounded border border-dashed border-white/25 bg-white/[0.04]">
            <ImageIcon className="h-3 w-3 text-white/40" />
            <span className="text-[5px] text-white/40 font-bold tracking-wider mt-0.5">FOTO</span>
          </div>
        </div>
      )}

      {/* ── 5. ESQUELETO LUXURY (Composición simétrica + 2 fotos flanqueando + Botón centrado) ── */}
      {layoutType === 'luxury' && (
        <div className="flex flex-1 flex-col justify-between pt-1">
          <div className="flex items-center justify-between gap-1">
            <div className="h-7 w-7 rounded border border-dashed border-white/20 bg-white/[0.03] flex items-center justify-center shrink-0">
              <ImageIcon className="h-2.5 w-2.5 text-white/30" />
            </div>
            <div className="flex flex-1 flex-col items-center gap-0.5 text-center">
              <span className="h-1 w-6 rounded-full transition-colors duration-300" style={{ backgroundColor: accent }} />
              <span className="h-1.5 w-12 rounded-xs bg-white/90" />
              <span className="h-1 w-8 rounded-xs bg-white/40" />
            </div>
            <div className="h-7 w-7 rounded border border-dashed border-white/20 bg-white/[0.03] flex items-center justify-center shrink-0">
              <ImageIcon className="h-2.5 w-2.5 text-white/30" />
            </div>
          </div>
          <div className="flex justify-center">
            <span 
              className="h-2.5 px-3 rounded-xs flex items-center justify-center text-[6px] font-black text-black transition-all duration-300 shadow-xs"
              style={{ backgroundColor: accent }}
            >
              BOTÓN ELEGANTE
            </span>
          </div>
        </div>
      )}

      {/* ── 6. ESQUELETO GRID (3 columnas con foto en cada bloque + Barra de acento) ── */}
      {layoutType === 'grid' && (
        <div className="flex flex-1 flex-col justify-between pt-1">
          <div className="flex items-center justify-between pb-0.5">
            <span className="h-1 w-12 rounded-xs bg-white/50" />
            <span className="h-1 w-2 rounded-full transition-colors duration-300" style={{ backgroundColor: accent }} />
          </div>
          <div className="grid grid-cols-3 gap-1">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex flex-col rounded border border-white/10 bg-white/[0.03] p-0.5">
                <div className="flex h-5 w-full items-center justify-center rounded-xs border border-dashed border-white/15 bg-white/[0.04]">
                  <ImageIcon className="h-1.5 w-1.5 text-white/30" />
                </div>
                <span className="mt-0.5 h-1 w-full rounded-xs bg-white/40" />
                <span 
                  className="mt-0.5 h-1 w-3/4 rounded-xs transition-colors duration-300" 
                  style={{ backgroundColor: accent }} 
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function StepEstilo({ form, set }) {
  const selectedCategory = resolveCategory(form.sector);
  const currentItems = SECTOR_STYLES[selectedCategory] || SECTOR_STYLES.restauracion;

  // Preseleccionar la primera plantilla si no hay ninguna elegida
  useEffect(() => {
    if (!form.layoutVariant || !currentItems.some(it => it.key === form.layoutVariant)) {
      if (currentItems[0]) {
        set('layoutVariant', currentItems[0].key);
        set('templateSlug', currentItems[0].key);
        set('templateName', currentItems[0].name);
      }
    }
  }, [selectedCategory, form.layoutVariant, currentItems, set]);

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl text-white">Elige el estilo que más te represente</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Estructura y distribución de contenidos para tu web. Elige el esqueleto y personaliza el color de acento.
        </p>
      </div>

      {/* Grid fijo de 6 esqueletos (sin sliders ni desplazamientos) */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
        {currentItems.map((item) => {
          const isSelected = form.layoutVariant === item.key;
          const currentAccent = form.accentOverride || item.defaultAccent;

          return (
            <div
              key={item.key}
              onClick={() => {
                set('layoutVariant', item.key);
                set('templateSlug', item.key);
                set('templateName', item.name);
              }}
              className={`group relative overflow-hidden rounded-xl border text-left transition cursor-pointer select-none ${
                isSelected 
                  ? 'border-[#6DD94B] ring-2 ring-[#6DD94B]/50 bg-white/[0.08] shadow-lg shadow-[#6DD94B]/10' 
                  : 'border-white/10 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.05]'
              }`}
            >
              {/* Contenedor del esqueleto con tamaño fijado */}
              <div className="relative h-24 sm:h-28 w-full overflow-hidden border-b border-white/5">
                <WireframeSkeleton
                  layoutType={item.layoutType}
                  accent={currentAccent}
                />

                {/* Check verde si está seleccionada */}
                {isSelected && (
                  <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-[#6DD94B] text-black shadow-md z-10">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                )}
              </div>

              {/* Información del estilo y punto con el color de acento actual */}
              <div className="p-3">
                <div className="flex items-center justify-between gap-1">
                  <p className="truncate text-xs font-bold text-white">{item.name}</p>
                  <span 
                    className="h-2 w-2 rounded-full shrink-0 transition-colors duration-300" 
                    style={{ backgroundColor: currentAccent }}
                    title={`Color de acento: ${currentAccent}`}
                  />
                </div>
                <p className="mt-1 text-[10px] leading-tight text-zinc-400 line-clamp-2">{item.mood}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selector de color de acento: al cambiarlo, los esqueletos cambian de verdad */}
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
