import type { LeadSource, LeadStage } from '../../types';

export const STAGE_META: Record<LeadStage, { label: string; dot: string; badge: string; probability: number }> = {
  contactado: { label: 'Contactado', dot: 'bg-gray-400', badge: 'bg-gray-500/15 text-gray-300 ring-gray-500/30', probability: 0.1 },
  interesado: { label: 'Interesado', dot: 'bg-sky-400', badge: 'bg-sky-500/15 text-sky-300 ring-sky-500/30', probability: 0.3 },
  propuesta: { label: 'Propuesta enviada', dot: 'bg-indigo-400', badge: 'bg-indigo-500/15 text-indigo-300 ring-indigo-500/30', probability: 0.5 },
  negociacion: { label: 'Negociación', dot: 'bg-amber-400', badge: 'bg-amber-500/15 text-amber-300 ring-amber-500/30', probability: 0.75 },
  cerrado: { label: 'Cerrado', dot: 'bg-emerald-400', badge: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30', probability: 1 },
  perdido: { label: 'Perdido', dot: 'bg-rose-400', badge: 'bg-rose-500/15 text-rose-300 ring-rose-500/30', probability: 0 },
};

/** Columnas del pipeline. "Perdido" se consulta aparte para no ensuciar el tablero. */
export const PIPELINE_STAGES: LeadStage[] = ['contactado', 'interesado', 'propuesta', 'negociacion', 'cerrado'];
export const ALL_STAGES: LeadStage[] = [...PIPELINE_STAGES, 'perdido'];

export const SOURCE_LABEL: Record<LeadSource, string> = {
  puerta_fria: 'Puerta fría',
  instagram: 'Instagram',
  recomendacion: 'Recomendación',
  google: 'Google',
  whatsapp: 'WhatsApp',
  formulario_web: 'Formulario web',
};

export const SOURCES = Object.keys(SOURCE_LABEL) as LeadSource[];

/** Enlace a WhatsApp con el número en formato internacional sin símbolos. */
export function whatsappLink(phone: string, text?: string): string {
  const digits = phone.replace(/\D/g, '');
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}
