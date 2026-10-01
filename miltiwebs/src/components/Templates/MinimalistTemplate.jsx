import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import BookingModal from '../Booking/BookingModal';

export default function MinimalistTemplate({ restaurant, isPreview = false }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const categories = restaurant.menu_categories || [];

  const primaryColor = restaurant.primary_color || '#ffffff';
  const bgColor = '#000000';

  return (
    <div className="min-h-screen text-zinc-300 font-sans selection:bg-white selection:text-black bg-black">
      {/* Hairline Minimal Header */}
      <header className="border-b border-white/5 bg-black/90 backdrop-blur-md sticky top-0 z-40 px-6 sm:px-12 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-white font-light text-base tracking-[0.25em] uppercase">
              {restaurant.name}
            </span>
            <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-500 font-mono hidden sm:inline">
              / 侘寂 SILENCIO VISUAL
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <span className="hidden md:inline text-zinc-500 tracking-widest text-[11px] uppercase">
              {restaurant.city || 'Sede Central'}
            </span>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="px-5 py-2 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 text-xs tracking-widest uppercase font-light"
            >
              Solicitar Asiento
            </button>
          </div>
        </div>
      </header>

      {/* Hero: Radical Asymmetry & Calm Luxury */}
      <section className="pt-16 sm:pt-28 pb-20 px-6 sm:px-12 max-w-5xl mx-auto">
        <div className="space-y-12">
          {/* Subtle Accent Mark */}
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1px] bg-white/30" />
            <span className="text-[10px] font-mono tracking-[0.35em] uppercase text-zinc-500">
              EXPERIENCIA GASTRONOMICA PURA
            </span>
          </div>

          {/* Monumental Clean Heading */}
          <div className="space-y-6 max-w-3xl">
            <h1 className="text-4xl sm:text-7xl font-extralight text-white tracking-tight leading-[1.05]">
              {restaurant.name}
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed max-w-xl">
              {restaurant.slogan || restaurant.description}
            </p>
          </div>

          {/* Minimalist Floating Photo */}
          <div className="relative pt-6">
            <div className="relative h-72 sm:h-[450px] overflow-hidden rounded-sm border border-white/10">
              <img 
                src={restaurant.hero_image || 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1920&q=80'} 
                alt={restaurant.name}
                className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition duration-700"
              />
            </div>
            <div className="flex justify-between items-center pt-3 text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
              <span>ESPACIO DE DEGUSTACION</span>
              <span>AFORO LIMITADO A {restaurant.booking_rules?.max_guests_per_table || 8} POR MESA</span>
            </div>
          </div>
        </div>
      </section>

      {/* Subtle Philosophy Callout */}
      <section className="py-16 px-6 sm:px-12 border-y border-white/5 bg-zinc-950/30">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-[10px] tracking-[0.35em] text-zinc-500 font-mono uppercase block">
            RESERVAS DIRECTAS • SIN PLATAFORMAS EXTERNAS
          </span>
          <p className="text-lg sm:text-2xl font-light text-zinc-200 tracking-wide leading-relaxed">
            "{restaurant.description}"
          </p>
          <div className="pt-4">
            <button
              onClick={() => setIsBookingOpen(true)}
              className="inline-flex items-center gap-3 text-xs tracking-[0.2em] text-white uppercase border-b border-white/40 pb-1 hover:border-white transition"
            >
              <span>Consultar Disponibilidad de Mesa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Carte / Menu: Architectural Simplicity */}
      <section className="py-24 px-6 sm:px-12 max-w-5xl mx-auto space-y-20">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono tracking-[0.35em] text-zinc-500 uppercase block">
            SELECCION CULINARIA
          </span>
          <h2 className="text-2xl sm:text-3xl font-light text-white tracking-widest uppercase">
            Carta de Temporada
          </h2>
        </div>

        {categories.map((cat, idx) => (
          <div key={cat.id || idx} className="space-y-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-light text-white tracking-[0.25em] uppercase">
                {cat.name}
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                0{idx + 1}
              </span>
            </div>

            <div className="divide-y divide-white/5">
              {(cat.items || []).map((item) => (
                <div key={item.id} className="py-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 group">
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-3">
                      <h4 className="text-sm text-white font-normal tracking-wide group-hover:text-zinc-300 transition">
                        {item.name}
                      </h4>
                      {item.badge && (
                        <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                          • {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 font-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-light text-white font-mono">
                      {item.price.toFixed(2)} €
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Booking Footer Callout */}
      <section className="py-20 px-6 sm:px-12 border-t border-white/5 bg-zinc-950/20 text-center">
        <div className="max-w-xl mx-auto space-y-6">
          <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase block">
            ACCESO CONFIRMADO AL INSTANTE
          </span>
          <h3 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Reserve su experiencia en mesa
          </h3>
          <p className="text-xs text-zinc-400 font-light leading-relaxed">
            Garantizamos la privacidad y tranquilidad de cada servicio. Las reservas son gestionadas directamente por el restaurante.
          </p>
          <button
            onClick={() => setIsBookingOpen(true)}
            className="px-8 py-3.5 rounded-full border border-white text-black bg-white hover:bg-zinc-200 transition-all text-xs tracking-widest uppercase font-medium shadow-xl"
          >
            Reservar Mesa Directa
          </button>
        </div>
      </section>

      {/* Minimalist Quiet Floating Action Bar for Mobile (Emil Kowalski style) */}
      <div className="sm:hidden fixed bottom-4 inset-x-6 z-40">
        <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-full px-4 py-2 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.95)]">
          <span className="text-[11px] tracking-widest text-zinc-300 uppercase font-light truncate max-w-[150px]">
            {restaurant.name}
          </span>
          <button
            onClick={() => setIsBookingOpen(true)}
            className="emil-pressable px-4 py-2 rounded-full bg-white text-black text-[11px] tracking-widest uppercase font-medium touch-target-44 flex items-center shadow-lg"
          >
            Reservar
          </button>
        </div>
      </div>

      {/* Quiet Footer */}
      <footer className="border-t border-white/5 py-12 px-6 sm:px-12 text-center text-[11px] text-zinc-600 font-light tracking-widest uppercase space-y-2 pb-24 sm:pb-12">
        <div>{restaurant.name} • {restaurant.address} • {restaurant.city}</div>
        <div>TELÉFONO DE CONTACTO: {restaurant.phone}</div>
      </footer>

      {/* Booking Modal */}
      <BookingModal
        restaurant={restaurant}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}
