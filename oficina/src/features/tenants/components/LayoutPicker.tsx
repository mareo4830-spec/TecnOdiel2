import { CalendarCheck, ExternalLink } from 'lucide-react';
import { useMemo } from 'react';
import type { LayoutVariant } from '../../../types';
import { LAYOUT_META, LAYOUTS } from '../../projects/projectMeta';
import { effectiveVariant, type LayoutVariantMeta, variantDemoUrl, variantsOf } from '../tenantMeta';
import { useAllTenants } from '../tenantService';

/** Mini web del tenant con los colores y la tipografía de la variante elegida. */
export function LayoutPreview({
  variant,
  name,
  tagline,
  accent,
}: {
  variant: LayoutVariantMeta;
  name: string;
  tagline: string | null;
  /** Color de marca del tenant, si lo cambia respecto al de la portada. */
  accent?: string | null;
}) {
  const color = accent || variant.accent;
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
          style={{ background: color, color: variant.surface, borderRadius: variant.radius }}
        >
          <CalendarCheck className="h-3.5 w-3.5" />
          Reservar cita
        </span>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {['Corte', 'Color', 'Peinado'].map((s) => (
            <div
              key={s}
              className="px-2 py-2 text-[10px]"
              style={{ border: `1px solid ${color}55`, borderRadius: variant.radius === '999px' ? '16px' : variant.radius }}
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
  accent?: string | null;
  /** Tenant que se edita: no cuenta como "ya en uso" de su propia portada. */
  tenantId?: string;
  onChange: (layout: LayoutVariant, variant: string | null) => void;
}

/**
 * Los 4 grupos de portadas del SaaS con sus 5 diseños, una vista previa en vivo y cuántos negocios
 * usan ya cada diseño (si se repite, se diferencia con el color de marca y la animación).
 */
export function LayoutPicker({ layout, variant, name, tagline, accent, tenantId, onChange }: LayoutPickerProps) {
  const tenants = useAllTenants();
  const current = layout ?? 'barber';
  const active = effectiveVariant(current, variant);
  const usage = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const t of tenants) {
      if (t.id === tenantId || !t.layout) continue;
      const key = effectiveVariant(t.layout, t.layoutVariant).key;
      counts[key] = (counts[key] ?? 0) + 1;
    }
    return counts;
  }, [tenants, tenantId]);

  if (layout === 'classic') {
    return (
      <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
        Este negocio usa la web propia de Adrián Millán. Su portada no se cambia desde aquí.
      </p>
    );
  }

  const repeated = usage[active.key] ?? 0;

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <div className="space-y-3">
        <div role="radiogroup" aria-label="Tipo de portada" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
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
              {LAYOUT_META[l].label}
            </button>
          ))}
        </div>
        {layout && (
          <div role="radiogroup" aria-label="Diseño de la portada" className="space-y-1.5">
            {variantsOf(layout).map((v, i) => {
              const selected = active.key === v.key;
              const used = usage[v.key] ?? 0;
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
                  <span
                    className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${used ? 'bg-amber-500/15 text-amber-300' : 'bg-emerald-500/15 text-emerald-300'}`}
                  >
                    {used ? `En uso · ${used}` : 'Libre'}
                  </span>
                </button>
              );
            })}
          </div>
        )}
        {repeated > 0 && (
          <p className="rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
            Este diseño ya lo usa{repeated > 1 ? `n ${repeated} negocios` : ' otro negocio'}. Cámbiale el color de marca o la animación para
            que no se vean iguales.
          </p>
        )}
      </div>
      <div>
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <p className="text-xs text-gray-500">Vista previa · {active.name}</p>
          <a
            href={variantDemoUrl(active.key)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-indigo-300 hover:underline"
          >
            Ver la portada real <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <LayoutPreview variant={active} name={name} tagline={tagline} accent={accent} />
      </div>
    </div>
  );
}
