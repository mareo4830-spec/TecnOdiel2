import { CalendarCheck } from 'lucide-react';
import type { LayoutVariant } from '../../../types';
import { LAYOUT_META, LAYOUTS } from '../../projects/projectMeta';
import { effectiveVariant, type LayoutVariantMeta, variantsOf } from '../tenantMeta';

/** Mini web del tenant con los colores y la tipografía de la variante elegida. */
export function LayoutPreview({ variant, name, tagline }: { variant: LayoutVariantMeta; name: string; tagline: string | null }) {
  return (
    <div
      className="overflow-hidden rounded-xl border border-gray-700 shadow-lg"
      style={{ background: variant.surface, color: variant.text, fontFamily: variant.font }}
      aria-label={`Vista previa del estilo ${variant.name}`}
    >
      <div className="flex items-center justify-between px-4 py-2.5 text-[11px] opacity-80">
        <span className="font-semibold">{name || 'Tu negocio'}</span>
        <span className="flex gap-3">
          <span>Servicios</span>
          <span>Galería</span>
          <span>Contacto</span>
        </span>
      </div>
      <div className="px-4 pb-5 pt-4">
        <p className="text-xl font-bold leading-tight sm:text-2xl">{name || 'Tu negocio'}</p>
        <p className="mt-1 text-xs opacity-75">{tagline || 'Reserva tu cita online en segundos'}</p>
        <span
          className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
          style={{ background: variant.accent, color: variant.surface, borderRadius: variant.radius }}
        >
          <CalendarCheck className="h-3.5 w-3.5" />
          Reservar cita
        </span>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {['Corte', 'Color', 'Peinado'].map((s) => (
            <div
              key={s}
              className="px-2 py-2 text-[10px]"
              style={{ border: `1px solid ${variant.accent}55`, borderRadius: variant.radius === '999px' ? '16px' : variant.radius }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface LayoutPickerProps {
  layout: LayoutVariant | null;
  variant: string | null;
  name: string;
  tagline: string | null;
  onChange: (layout: LayoutVariant, variant: string | null) => void;
}

/** Los 4 layouts del SaaS con sus 5 variantes y una preview en vivo. */
export function LayoutPicker({ layout, variant, name, tagline, onChange }: LayoutPickerProps) {
  const current = layout ?? 'classic';
  const active = effectiveVariant(current, variant);
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="space-y-3">
        <div role="radiogroup" aria-label="Layout" className="grid grid-cols-2 gap-2">
          {LAYOUTS.map((l) => (
            <button
              key={l}
              type="button"
              role="radio"
              aria-checked={layout === l}
              onClick={() => onChange(l, null)}
              className={`rounded-xl border px-3 py-2 text-left text-sm font-medium transition ${
                layout === l ? 'border-indigo-500 bg-indigo-500/10 text-white' : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
              }`}
            >
              {LAYOUT_META[l].label.replace('Layout ', '')}
            </button>
          ))}
        </div>
        {layout && (
          <div role="radiogroup" aria-label="Variante de estilo" className="space-y-1.5">
            {variantsOf(layout).map((v, i) => {
              const selected = active.key === v.key;
              return (
                <button
                  key={v.key}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => onChange(layout, v.key)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
                    selected ? 'border-indigo-500 bg-indigo-500/10' : 'border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <span className="flex shrink-0 overflow-hidden rounded-md border border-gray-700" aria-hidden>
                    <span className="h-6 w-4" style={{ background: v.surface }} />
                    <span className="h-6 w-4" style={{ background: v.accent }} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-white">
                      {v.name}
                      {i === 0 && !variant && <span className="ml-1.5 text-[11px] font-normal text-gray-500">por defecto</span>}
                    </span>
                    <span className="block truncate text-xs text-gray-400">{v.description}</span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
      <div>
        <p className="mb-1.5 text-xs text-gray-500">Vista previa · {active.name}</p>
        <LayoutPreview variant={active} name={name} tagline={tagline} />
      </div>
    </div>
  );
}
