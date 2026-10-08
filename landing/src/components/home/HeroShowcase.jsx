import React from 'react';
import CardSwap, { Card } from '../ui/CardSwap.jsx';
import { 
  ExternalLink, ChevronRight, Utensils, Scissors, Stethoscope, Lock 
} from 'lucide-react';

export const SHOWCASE_ITEMS = [
  {
    id: 'adrianmillan',
    type: 'real',
    badge: 'Caso Real · Huelva',
    title: 'adrianmillan.es',
    subtitle: 'Barbería y estética en Huelva',
    image: '/demos/adrianmillan-local.jpg',
    url: 'https://adrianmillan.es',
    isExternal: true,
    notification: {
      icon: Scissors,
      title: 'Nueva cita confirmada',
      detail: 'adrianmillan.es · 0 € en comisiones'
    },
    metrics: [
      { label: 'Citas online', value: '24/7' },
      { label: 'Comisiones', value: '0 €' },
      { label: 'SEO local', value: 'Huelva' }
    ]
  },
  {
    id: 'noir-atelier',
    type: 'template',
    badge: 'Plantilla Hostelería',
    title: 'noir-atelier.es',
    subtitle: 'Restaurante gastronómico de autor',
    image: '/demos/noir-atelier.jpg',
    url: '#demos',
    isExternal: false,
    notification: {
      icon: Utensils,
      title: 'Mesa reservada para 4',
      detail: 'Carta digital interactiva con alérgenos'
    },
    metrics: [
      { label: 'Carta QR', value: 'Con fotos' },
      { label: 'Reservas', value: 'WhatsApp' },
      { label: 'Sin intermediarios', value: '100%' }
    ]
  },
  {
    id: 'swiss-dental',
    type: 'template',
    badge: 'Plantilla Clínicas',
    title: 'swiss-dental.es',
    subtitle: 'Clínica odontológica y salud',
    image: '/demos/swiss-dental.jpg',
    url: '#demos',
    isExternal: false,
    notification: {
      icon: Stethoscope,
      title: 'Cita médica agendada',
      detail: 'Agenda online sin llamadas perdidas'
    },
    metrics: [
      { label: 'Citas', value: 'Automáticas' },
      { label: 'Recordatorios', value: 'WhatsApp' },
      { label: 'A medida', value: '100%' }
    ]
  },
  {
    id: 'smash-destroy',
    type: 'template',
    badge: 'Plantilla Street Food',
    title: 'smash-destroy.es',
    subtitle: 'Hamburguesería y comida urbana',
    image: '/demos/smash-destroy.jpg',
    url: '#demos',
    isExternal: false,
    notification: {
      icon: Utensils,
      title: 'Pedido recibido por WhatsApp',
      detail: 'Carta rápida optimizada para móvil'
    },
    metrics: [
      { label: 'Pedidos', value: 'Directos' },
      { label: 'Carta QR', value: 'Sin PDFs' },
      { label: 'Diseño', value: 'Moderno' }
    ]
  },
  {
    id: 'le-maison',
    type: 'template',
    badge: 'Plantilla Alta Cocina',
    title: 'le-maison.es',
    subtitle: 'Cocina de autor y menú degustación',
    image: '/demos/le-maison.jpg',
    url: '#demos',
    isExternal: false,
    notification: {
      icon: Utensils,
      title: 'Reserva confirmada',
      detail: 'Mesa para 2 a las 21:30'
    },
    metrics: [
      { label: 'Menú interactivo', value: '100%' },
      { label: 'Experiencia', value: 'Exclusiva' },
      { label: 'Reserva online', value: 'Instantánea' }
    ]
  },
  {
    id: 'aura-velvet',
    type: 'template',
    badge: 'Plantilla Belleza & Spa',
    title: 'aura-velvet.es',
    subtitle: 'Estudio de belleza y bienestar',
    image: '/demos/aura-velvet.jpg',
    url: '#demos',
    isExternal: false,
    notification: {
      icon: Scissors,
      title: 'Tratamiento agendado',
      detail: 'Cita reservada sin esperas'
    },
    metrics: [
      { label: 'Servicios', value: 'Catálogo' },
      { label: 'Citas', value: '24/7' },
      { label: 'Estilo', value: 'Premium' }
    ]
  }
];

// Función normal (no componente): CardSwap necesita que el hijo directo sea <Card> para engancharle el ref.
const showcaseCard = (item) => {
  return (
    <Card key={item.id} customClass="hero-card">
      {/* Cabecera estilo ventana de navegador */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3.5 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-400/80" />
          <span className="h-2 w-2 rounded-full bg-yellow-400/80" />
          <span className="h-2 w-2 rounded-full bg-[#6DD94B]" />
        </div>
        <div className="flex min-w-0 items-center gap-1.5 rounded-full border border-white/5 bg-black/60 px-3 py-0.5 text-[11px] text-zinc-300">
          <Lock className="h-2.5 w-2.5 shrink-0 text-[#6DD94B]" />
          <span className="truncate font-mono">{item.title}</span>
        </div>
        <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${
          item.type === 'real'
            ? 'border border-[#6DD94B]/30 bg-[#6DD94B]/20 text-[#6DD94B]'
            : 'border border-white/10 bg-white/10 text-zinc-300'
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${item.type === 'real' ? 'bg-[#6DD94B]' : 'bg-zinc-400'}`} />
          {item.badge}
        </span>
      </div>

      {/* Preview de la web / plantilla */}
      <div className="relative m-2.5 mt-2 aspect-[16/10] overflow-hidden rounded-xl bg-black/80">
        <img src={item.image} alt={item.title} decoding="async" className="h-full w-full object-cover object-top" draggable={false} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-black via-black/85 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
          <div className="min-w-0">
            <p className="text-sm font-bold text-white sm:text-base">{item.subtitle}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 font-mono text-[11px] text-zinc-200">
              {item.metrics.map((m) => (
                <span key={m.label}>
                  <span className="font-bold text-[#6DD94B]">✓</span> {m.label}: <strong className="text-white">{m.value}</strong>
                </span>
              ))}
            </div>
          </div>
          {item.isExternal ? (
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#6DD94B] px-3.5 py-1.5 text-xs font-bold text-black shadow-md transition hover:bg-white">
              Ver <ExternalLink className="h-3 w-3" />
            </a>
          ) : (
            <a href="#demos" className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-bold text-black transition hover:bg-white">
              Demo <ChevronRight className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </Card>
  );
};

/* Escaparate rotatorio de webs reales y plantillas: pila de tarjetas 3D (React Bits CardSwap). */
export default function HeroShowcase() {
  return (
    <div className="hero-cardswap select-none">
      <CardSwap width={580} height={410} cardDistance={40} verticalDistance={46} delay={3500} pauseOnHover skewAmount={4}>
        {SHOWCASE_ITEMS.map(showcaseCard)}
      </CardSwap>
    </div>
  );
}
