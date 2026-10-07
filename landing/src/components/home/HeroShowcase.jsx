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
  }
];

export default function HeroShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Rotación automática cada 4.5 segundos (se pausa al pasar el ratón)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SHOWCASE_ITEMS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const current = SHOWCASE_ITEMS[currentIndex];
  const NotifIcon = current.notification.icon;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + SHOWCASE_ITEMS.length) % SHOWCASE_ITEMS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SHOWCASE_ITEMS.length);
  };

  return (
    <div 
      className="relative hidden lg:block select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Marco de ventana del navegador moderno */}
      <div className="rounded-2xl border border-white/10 bg-[#181818] p-4 shadow-[0_30px_90px_-20px_rgba(109,217,75,0.30)] transition-all">
        {/* Cabecera del navegador */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-400/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
            <span className="h-3 w-3 rounded-full bg-[#6DD94B]" />
          </div>

          {/* Barra de dirección URL */}
          <div className="flex items-center gap-1.5 rounded-full bg-black/60 px-4 py-1 text-xs text-zinc-300 border border-white/5">
            <Lock className="h-3 w-3 text-[#6DD94B]" />
            <span className="font-mono">{current.title}</span>
          </div>

          {/* Badge de tipo de web */}
          <div className="flex items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
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
        <div className="relative mt-3 aspect-[16/10] overflow-hidden rounded-xl bg-black/80 group">
          <img 
            key={current.id}
            src={current.image} 
            alt={current.title}
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Gradiente sutil para legibilidad de textos */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

          {/* Métricas destacadas en el pie de la imagen */}
          <div className="absolute inset-x-0 bottom-0 p-3.5 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-white text-sm drop-shadow">{current.subtitle}</p>
              <div className="mt-1 flex items-center gap-3 text-[11px] text-zinc-300 font-mono">
                {current.metrics.map((m, i) => (
                  <span key={i} className="flex items-center gap-1">
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
                className="inline-flex items-center gap-1.5 rounded-full bg-[#6DD94B] px-3.5 py-1.5 text-xs font-bold text-black shadow-md hover:bg-white transition"
              >
                Ver web <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <a
                href="#demos"
                className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-bold text-black hover:bg-white transition"
              >
                Ver demo <ChevronRight className="h-3 w-3" />
              </a>
            )}
          </div>

          {/* Botones laterales de navegación */}
          <button
            onClick={handlePrev}
            aria-label="Anterior web"
            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-[#6DD94B] hover:text-black transition cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Siguiente web"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-[#6DD94B] hover:text-black transition cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Selector rápido inferior (píldoras interactivas) */}
        <div className="mt-3 flex items-center justify-between gap-1.5 pt-2 border-t border-white/5">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {SHOWCASE_ITEMS.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(idx)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition cursor-pointer whitespace-nowrap ${
                  currentIndex === idx
                    ? 'bg-[#6DD94B] text-black font-bold shadow-sm'
                    : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>

          <div className="text-[10px] text-zinc-500 font-mono shrink-0">
            {currentIndex + 1} / {SHOWCASE_ITEMS.length}
          </div>
        </div>
      </div>

      {/* Notificación flotante de cliente / reserva real */}
      <div className="absolute -bottom-5 -left-5 flex items-center gap-3.5 rounded-2xl bg-white px-5 py-3.5 text-zinc-900 shadow-2xl transition-all border border-zinc-200">
        <div className="h-9 w-9 rounded-xl bg-[#6DD94B]/20 flex items-center justify-center shrink-0">
          <NotifIcon className="h-5 w-5 text-[#0D844A]" />
        </div>
        <div>
          <p className="text-xs font-bold leading-tight text-zinc-900">{current.notification.title}</p>
          <p className="text-[11px] text-zinc-600 mt-0.5">{current.notification.detail}</p>
        </div>
      </div>
    </div>
  );
}
