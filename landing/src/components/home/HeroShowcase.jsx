import React, { useState, useEffect } from 'react';
import { 
  ExternalLink, ChevronLeft, ChevronRight, Sparkles, 
  CalendarCheck, Utensils, Scissors, Stethoscope, Lock, Globe 
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

export default function HeroShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Rotación automática continua cada 3.5 segundos sin atascarse
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SHOWCASE_ITEMS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const current = SHOWCASE_ITEMS[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + SHOWCASE_ITEMS.length) % SHOWCASE_ITEMS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SHOWCASE_ITEMS.length);
  };

  return (
    <div className="relative w-full max-w-[440px] sm:max-w-[480px] lg:max-w-[500px] select-none mx-auto lg:mr-0">
      {/* Marco de ventana del navegador moderno y estilizado */}
      <div className="rounded-3xl border border-white/10 bg-[#161616]/95 p-4 sm:p-5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]">
        {/* Cabecera del navegador */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-400/80" />
            <span className="h-2 w-2 rounded-full bg-yellow-400/80" />
            <span className="h-2 w-2 rounded-full bg-[#6DD94B]" />
          </div>

          {/* Barra de dirección URL */}
          <div className="flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-0.5 text-[11px] text-zinc-300 border border-white/5">
            <Lock className="h-2.5 w-2.5 text-[#6DD94B]" />
            <span className="font-mono text-[11px]">{current.title}</span>
          </div>

          {/* Badge de tipo de web */}
          <div className="flex items-center gap-1">
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${
              current.type === 'real'
                ? 'bg-[#6DD94B]/20 text-[#6DD94B] border border-[#6DD94B]/30'
                : 'bg-white/10 text-zinc-300 border border-white/10'
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${current.type === 'real' ? 'bg-[#6DD94B] animate-pulse' : 'bg-zinc-400'}`} />
              {current.badge}
            </span>
          </div>
        </div>

        {/* Imagen de la web / plantilla con transición fluida */}
        <div className="relative mt-2.5 aspect-[16/10] overflow-hidden rounded-xl bg-black/80 group">
          <img 
            key={current.id}
            src={current.image} 
            alt={current.title}
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Gradiente sutil para legibilidad de textos */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-90" />

          {/* Métricas destacadas en el pie de la imagen */}
          <div className="absolute inset-x-0 bottom-0 p-3 flex items-end justify-between text-xs">
            <div>
              <p className="font-bold text-white text-xs sm:text-sm drop-shadow">{current.subtitle}</p>
              <div className="mt-1 flex items-center gap-2 text-[10px] text-zinc-300 font-mono">
                {current.metrics.map((m, i) => (
                  <span key={i} className="flex items-center gap-0.5">
                    <span className="text-[#6DD94B] font-bold">✓</span> {m.label}: <strong className="text-white">{m.value}</strong>
                  </span>
                ))}
              </div>
            </div>

            {current.isExternal ? (
              <a
                href={current.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full bg-[#6DD94B] px-3 py-1 text-[11px] font-bold text-black shadow-md hover:bg-white transition shrink-0"
              >
                Ver <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <a
                href="#demos"
                className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-black hover:bg-white transition shrink-0"
              >
                Demo <ChevronRight className="h-3 w-3" />
              </a>
            )}
          </div>

          {/* Botones laterales de navegación */}
          <button
            onClick={handlePrev}
            aria-label="Anterior web"
            className="absolute left-1.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-[#6DD94B] hover:text-black transition cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Siguiente web"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-[#6DD94B] hover:text-black transition cursor-pointer"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Selector rápido inferior (píldoras interactivas con indicador de progreso activo) */}
        <div className="mt-2.5 flex items-center justify-between gap-1.5 pt-2 border-t border-white/5">
          <div className="flex items-center gap-1 overflow-x-auto py-0.5">
            {SHOWCASE_ITEMS.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(idx)}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition cursor-pointer whitespace-nowrap ${
                  currentIndex === idx
                    ? 'bg-[#6DD94B] text-black font-bold shadow-sm'
                    : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>

          <div className="text-[9px] text-zinc-500 font-mono shrink-0">
            {currentIndex + 1} / {SHOWCASE_ITEMS.length}
          </div>
        </div>
      </div>
    </div>
  );
}
