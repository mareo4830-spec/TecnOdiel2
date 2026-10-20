import { Plus, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import type { SiteContent, SiteFaq, SiteMember, SiteMotion, SiteReview, SiteService } from '../../../types';
import { Field, inputClass } from './TenantBits';

/*
 * Editor del contenido de la portada del SaaS (tenants.site_content). Todo es opcional: lo que se
 * deja vacío lo rellena la portada (fotos de ejemplo, servicios típicos, preguntas con los datos
 * del negocio). Lo usan el asistente de alta y la pestaña Datos de la ficha.
 */

const HTTPS = /^https:\/\/\S+$/;
const EMAIL = /^\S+@\S+\.\S+$/;
const HEX = /^#[0-9a-f]{6}$/i;

export const MOTION_META: Record<SiteMotion, { label: string; hint: string }> = {
  calm: { label: 'Tranquila', hint: 'Entradas lentas y suaves' },
  smooth: { label: 'Suave', hint: 'Lo normal de la portada' },
  lively: { label: 'Viva', hint: 'Rápida y con rebote' },
};

/** Errores del contenido, con la misma clave que el campo. Vacío = correcto. */
export function contentErrors(c: SiteContent): Record<string, string> {
  const e: Record<string, string> = {};
  if (c.accent && !HEX.test(c.accent)) e.accent = 'Color no válido (#rrggbb).';
  for (const k of ['heroImageUrl', 'aboutImageUrl', 'placeImageUrl', 'reviewUrl'] as const) {
    if (c[k] && !HTTPS.test(c[k]!)) e[k] = 'Debe ser una URL https://';
  }
  if (c.owner?.email && !EMAIL.test(c.owner.email)) e.owner = 'Email no válido.';
  if (c.rating !== undefined && (c.rating <= 0 || c.rating > 5)) e.rating = 'Entre 0,1 y 5.';
  if (c.services?.some((s) => !s.name.trim() || !(s.price >= 0) || !(s.minutes > 0))) e.services = 'Cada servicio necesita nombre, precio y minutos.';
  if (c.team?.some((m) => !m.name.trim() || (m.photoUrl && !HTTPS.test(m.photoUrl)))) e.team = 'Cada persona necesita nombre; la foto, https://';
  if (c.reviews?.some((r) => !r.name.trim() || !r.text.trim())) e.reviews = 'Cada reseña necesita nombre y texto.';
  if (c.faq?.some((f) => !f.question.trim() || !f.answer.trim())) e.faq = 'Cada pregunta necesita su respuesta.';
  return e;
}

/** Quita lo vacío antes de guardar (la BD guarda solo lo que hay). */
export function cleanContent(c: SiteContent): SiteContent {
  const t = (v?: string) => v?.trim() || undefined;
  const out: SiteContent = {
    about: t(c.about),
    heroImageUrl: t(c.heroImageUrl),
    aboutImageUrl: t(c.aboutImageUrl),
    placeImageUrl: t(c.placeImageUrl),
    accent: t(c.accent)?.toLowerCase(),
    motion: c.motion,
    services: c.services?.filter((s) => s.name.trim()).map((s) => ({ ...s, name: s.name.trim() })),
    team: c.team?.filter((m) => m.name.trim()).map((m) => ({ name: m.name.trim(), role: m.role.trim() || 'Profesional', photoUrl: m.photoUrl?.trim() || null })),
    reviews: c.reviews?.filter((r) => r.name.trim() && r.text.trim()),
    rating: c.rating,
    reviewUrl: t(c.reviewUrl),
    faq: c.faq?.filter((f) => f.question.trim() && f.answer.trim()),
    owner: c.owner?.email.trim() ? { email: c.owner.email.trim().toLowerCase(), name: c.owner.name?.trim() || null } : undefined,
  };
  for (const k of Object.keys(out) as (keyof SiteContent)[]) {
    const v = out[k];
    if (v === undefined || (Array.isArray(v) && v.length === 0)) delete out[k];
  }
  return out;
}

function Block({ title, hint, error, children }: { title: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-3 rounded-xl border border-gray-800 bg-gray-800/20 p-4">
      <legend className="px-1 text-sm font-semibold text-white">{title}</legend>
      {hint && <p className="-mt-1 text-xs text-gray-400">{hint}</p>}
      {children}
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </fieldset>
  );
}

/** Lista editable genérica: filas con sus campos, añadir y quitar. */
function Rows<T>({
  items,
  empty,
  add,
  onChange,
  render,
}: {
  items: T[];
  empty: T;
  add: string;
  onChange: (items: T[]) => void;
  render: (item: T, set: (patch: Partial<T>) => void) => ReactNode;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          <div className="grid flex-1 gap-2">{render(item, (patch) => onChange(items.map((x, j) => (j === i ? { ...x, ...patch } : x))))}</div>
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="mt-1 rounded-lg p-2 text-gray-500 hover:bg-gray-800 hover:text-rose-300"
            aria-label="Quitar"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, { ...empty }])}
        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-indigo-300 hover:bg-gray-800"
      >
        <Plus className="h-4 w-4" /> {add}
      </button>
    </div>
  );
}

/** Color de marca y animación: lo que diferencia dos negocios con la misma portada. */
export function BrandFields({
  value,
  onChange,
  defaultAccent,
  errors = {},
}: {
  value: SiteContent;
  onChange: (c: SiteContent) => void;
  defaultAccent: string;
  errors?: Record<string, string>;
}) {
  const accent = value.accent ?? '';
  return (
    <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
      <Field label="Color de marca" error={errors.accent} hint="Vacío = el color de la portada.">
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={HEX.test(accent) ? accent : defaultAccent}
            onChange={(e) => onChange({ ...value, accent: e.target.value })}
            className="h-10 w-12 cursor-pointer rounded-lg border border-gray-700 bg-gray-900"
            aria-label="Elegir color de marca"
          />
          <input className={`${inputClass} font-mono`} value={accent} onChange={(e) => onChange({ ...value, accent: e.target.value })} placeholder={defaultAccent} />
          {accent && (
            <button type="button" onClick={() => onChange({ ...value, accent: undefined })} className="shrink-0 text-xs text-gray-400 hover:text-white">
              Quitar
            </button>
          )}
        </div>
      </Field>
      <div>
        <p className="mb-1.5 text-sm font-medium text-gray-300">Animaciones</p>
        <div role="radiogroup" aria-label="Animaciones" className="grid grid-cols-3 gap-2">
          {(Object.keys(MOTION_META) as SiteMotion[]).map((m) => {
            const on = (value.motion ?? null) === m;
            return (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => onChange({ ...value, motion: on ? undefined : m })}
                className={`rounded-xl border px-2 py-2 text-left transition ${on ? 'border-indigo-500 bg-indigo-500/10' : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'}`}
              >
                <span className="block text-sm font-medium text-white">{MOTION_META[m].label}</span>
                <span className="block text-[11px] text-gray-400">{MOTION_META[m].hint}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-1 text-[11px] text-gray-500">Sin elegir = la de la portada.</p>
      </div>
    </div>
  );
}

const num = (v: string) => (v.trim() === '' ? NaN : Number(v.replace(',', '.')));

/** Todo el contenido de la portada salvo marca y animación (que van con el diseño). */
export function ContentEditor({ value, onChange, errors = {} }: { value: SiteContent; onChange: (c: SiteContent) => void; errors?: Record<string, string> }) {
  const set = (patch: Partial<SiteContent>) => onChange({ ...value, ...patch });
  return (
    <div className="space-y-4">
      <Block title="Presentación" hint="El texto de «quiénes somos». Vacío = una frase genérica con el nombre del negocio.">
        <textarea
          className={`${inputClass} min-h-24`}
          value={value.about ?? ''}
          onChange={(e) => set({ about: e.target.value })}
          placeholder="Llevamos 15 años cortando en el barrio…"
          maxLength={1200}
        />
      </Block>

      <Block title="Fotos de la portada" hint="URLs https://. Las vacías se rellenan con fotos de ejemplo de la portada hasta que haya propias.">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {(
            [
              ['heroImageUrl', 'Foto principal'],
              ['aboutImageUrl', 'Foto del local'],
              ['placeImageUrl', 'Fachada / cómo llegar'],
            ] as const
          ).map(([k, label]) => (
            <Field key={k} label={label} error={errors[k]}>
              <input className={inputClass} value={value[k] ?? ''} onChange={(e) => set({ [k]: e.target.value })} placeholder="https://…" />
            </Field>
          ))}
        </div>
      </Block>

      <Block title="Servicios" hint="Se crean en el SaaS en el primer volcado. Vacío = servicios típicos del tipo de negocio." error={errors.services}>
        <Rows<SiteService>
          items={value.services ?? []}
          empty={{ name: '', price: 0, minutes: 30 }}
          add="Añadir servicio"
          onChange={(services) => set({ services })}
          render={(s, patch) => (
            <div className="grid grid-cols-[1fr_5.5rem_5.5rem] gap-2">
              <input className={inputClass} value={s.name} onChange={(e) => patch({ name: e.target.value })} placeholder="Corte de pelo" aria-label="Servicio" />
              <input
                className={inputClass}
                inputMode="decimal"
                value={Number.isFinite(s.price) ? String(s.price) : ''}
                onChange={(e) => patch({ price: num(e.target.value) })}
                placeholder="€"
                aria-label="Precio en euros"
              />
              <input
                className={inputClass}
                inputMode="numeric"
                value={Number.isFinite(s.minutes) ? String(s.minutes) : ''}
                onChange={(e) => patch({ minutes: Math.round(num(e.target.value)) })}
                placeholder="min"
                aria-label="Duración en minutos"
              />
            </div>
          )}
        />
      </Block>

      <Block title="Equipo" hint="Se crea en el SaaS en el primer volcado. Después lo gestiona el negocio desde su panel." error={errors.team}>
        <Rows<SiteMember>
          items={value.team ?? []}
          empty={{ name: '', role: '', photoUrl: null }}
          add="Añadir persona"
          onChange={(team) => set({ team })}
          render={(m, patch) => (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_10rem_1fr]">
              <input className={inputClass} value={m.name} onChange={(e) => patch({ name: e.target.value })} placeholder="Nombre" aria-label="Nombre" />
              <input className={inputClass} value={m.role} onChange={(e) => patch({ role: e.target.value })} placeholder="Barbero, Estilista…" aria-label="Puesto" />
              <input
                className={inputClass}
                value={m.photoUrl ?? ''}
                onChange={(e) => patch({ photoUrl: e.target.value || null })}
                placeholder="Foto https:// (opcional)"
                aria-label="Foto"
              />
            </div>
          )}
        />
      </Block>

      <Block title="Reseñas" hint="Solo reseñas reales (p. ej. copiadas de Google). Sin reseñas, la sección no aparece." error={errors.reviews}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[8rem_1fr]">
          <Field label="Nota media" error={errors.rating}>
            <input
              className={inputClass}
              inputMode="decimal"
              value={value.rating ?? ''}
              onChange={(e) => set({ rating: e.target.value.trim() ? num(e.target.value) : undefined })}
              placeholder="4,8"
            />
          </Field>
          <Field label="Enlace para dejar reseña" error={errors.reviewUrl} hint="Vacío = el de Google de Contacto y redes.">
            <input className={inputClass} value={value.reviewUrl ?? ''} onChange={(e) => set({ reviewUrl: e.target.value })} placeholder="https://g.page/r/…" />
          </Field>
        </div>
        <Rows<SiteReview>
          items={value.reviews ?? []}
          empty={{ name: '', text: '', rating: 5 }}
          add="Añadir reseña"
          onChange={(reviews) => set({ reviews })}
          render={(r, patch) => (
            <>
              <div className="grid grid-cols-[1fr_5rem] gap-2">
                <input className={inputClass} value={r.name} onChange={(e) => patch({ name: e.target.value })} placeholder="Nombre" aria-label="Nombre" />
                <select className={inputClass} value={r.rating} onChange={(e) => patch({ rating: Number(e.target.value) })} aria-label="Estrellas">
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} ★
                    </option>
                  ))}
                </select>
              </div>
              <textarea className={inputClass} value={r.text} onChange={(e) => patch({ text: e.target.value })} placeholder="Lo que escribió" aria-label="Texto" maxLength={400} />
            </>
          )}
        />
      </Block>

      <Block title="Preguntas frecuentes" hint="Vacío = se generan con los datos del negocio (cómo reservar, cambiar cita, dirección, horario)." error={errors.faq}>
        <Rows<SiteFaq>
          items={value.faq ?? []}
          empty={{ question: '', answer: '' }}
          add="Añadir pregunta"
          onChange={(faq) => set({ faq })}
          render={(f, patch) => (
            <>
              <input className={inputClass} value={f.question} onChange={(e) => patch({ question: e.target.value })} placeholder="Pregunta" aria-label="Pregunta" />
              <textarea className={inputClass} value={f.answer} onChange={(e) => patch({ answer: e.target.value })} placeholder="Respuesta" aria-label="Respuesta" />
            </>
          )}
        />
      </Block>

      <Block title="Acceso del dueño" hint="Cuenta de Google con la que el dueño entrará al panel de administración de su web." error={errors.owner}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            className={inputClass}
            value={value.owner?.email ?? ''}
            onChange={(e) => set({ owner: { email: e.target.value, name: value.owner?.name ?? null } })}
            placeholder="dueno@gmail.com"
            inputMode="email"
            aria-label="Email de Google del dueño"
          />
          <input
            className={inputClass}
            value={value.owner?.name ?? ''}
            onChange={(e) => set({ owner: { email: value.owner?.email ?? '', name: e.target.value || null } })}
            placeholder="Nombre (opcional)"
            aria-label="Nombre del dueño"
          />
        </div>
      </Block>
    </div>
  );
}
