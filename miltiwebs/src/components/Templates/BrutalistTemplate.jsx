import React, { useState } from 'react';
import { Terminal, Calendar, Clock, MapPin, Phone, ArrowUpRight, Check, Zap, Flame, Shield } from 'lucide-react';
import BookingModal from '../Booking/BookingModal';

export default function BrutalistTemplate({ restaurant, isPreview = false }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const categories = restaurant.menu_categories || [];

  const primaryColor = restaurant.primary_color || '#ccff00'; // Acid green/yellow default for brutalism
  const bgColor = '#050505';
  const surfaceColor = '#0f0f11';

  return (
    <div 
      className="min-h-screen text-zinc-100 font-mono selection:bg-yellow-400 selection:text-black relative bg-[#050505]"
      style={{
        backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px)`,
        backgroundSize: '24px 24px'
      }}
    >
      {/* Brutalist Running Ticker Bar */}
      <div className="bg-yellow-400 text-black font-extrabold text-[11px] py-1 px-4 overflow-hidden whitespace-nowrap border-b-2 border-black flex items-center justify-between tracking-widest uppercase">
        <div className="flex gap-8 animate-marquee">
          <span>/// {restaurant.name.toUpperCase()} /// BARRA INDEPENDIENTE /// RESERVA DIRECTA SIN INTERMEDIARIOS /// AFORO CONTROLADO /// NO BOOKSY /// ACCESO VIP ///</span>
          <span>/// {restaurant.name.toUpperCase()} /// COCTELERIA & BEBIDAS /// 0% COMISIONES /// ENTRADA CONFIRMADA ///</span>
        </div>
      </div>

      {/* Heavy Industrial Header */}
      <header className="sticky top-0 z-40 border-b-2 border-white/20 bg-black/95 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white text-black font-black flex items-center justify-center text-sm border-2 border-black shadow-[3px_3px_0px_#ccff00]">
              !
            </div>
            <div>
              <span className="font-black text-white text-base tracking-tighter uppercase block leading-none">
                {restaurant.name}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">
                [EST. 2026 // UNDERGROUND BAR]
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {restaurant.dress_code && (
              <span className="hidden sm:inline-block px-2.5 py-1 text-[10px] uppercase font-bold border border-white/20 bg-zinc-900 text-zinc-300">
                CODE: {restaurant.dress_code}
              </span>
            )}
            <button
              onClick={() => setIsBookingOpen(true)}
              className="px-4 py-2 bg-[#ccff00] text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#ffffff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#ffffff] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5 stroke-[3]" />
              <span>Pase de Mesa</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section: Blueprint Industrial */}
      <section className="pt-8 sm:pt-14 pb-12 px-4 max-w-6xl mx-auto">
        <div className="border-2 border-white/20 bg-zinc-950 p-6 sm:p-10 relative overflow-hidden shadow-[8px_8px_0px_rgba(255,255,255,0.15)]">
          {/* Technical Grid Markers */}
          <div className="absolute top-2 left-2 text-[9px] text-zinc-600 font-mono">SYS_LOC: {restaurant.city || 'BASE'} // 37.26°N</div>
          <div className="absolute top-2 right-2 text-[9px] text-zinc-600 font-mono">[RAW_MODE: ON]</div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-block px-3 py-1 bg-zinc-900 border border-white/20 text-[#ccff00] text-[10px] uppercase font-bold tracking-widest">
                /// {restaurant.category === 'night_bar' ? 'UNDERGROUND DRINKS & BEATS' : 'BARRA PURA & PRODUCTO CRUDO'}
              </div>

              <h1 className="text-3xl sm:text-6xl font-black text-white tracking-tight uppercase leading-[0.95]">
                {restaurant.name}
              </h1>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-mono border-l-2 border-[#ccff00] pl-3.5">
                {restaurant.slogan || restaurant.description}
              </p>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-[11px]">
                <div className="p-2.5 bg-zinc-900 border border-white/10">
                  <span className="text-zinc-500 block text-[9px] uppercase">Zonas Disponibles</span>
                  <span className="font-bold text-white uppercase">{restaurant.booking_rules?.available_areas?.[0] || 'Barra Principal'}</span>
                </div>
                <div className="p-2.5 bg-zinc-900 border border-white/10">
                  <span className="text-zinc-500 block text-[9px] uppercase">Max Mesa</span>
                  <span className="font-bold text-[#ccff00]">{restaurant.booking_rules?.max_guests_per_table || 8} PAX</span>
                </div>
                <div className="p-2.5 bg-zinc-900 border border-white/10 col-span-2 sm:col-span-1">
                  <span className="text-zinc-500 block text-[9px] uppercase">Confirmacion</span>
                  <span className="font-bold text-white uppercase">DIRECTA AL LOCAL</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[6px_6px_0px_#ccff00] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_#ccff00] transition-all flex items-center justify-center gap-2"
                >
                  <span>Reservar Mesa Sin Intermediarios</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>

            {/* Hero Image as Raw Industrial Frame */}
            <div className="lg:col-span-5">
              <div className="relative border-2 border-white/30 p-2 bg-black shadow-[6px_6px_0px_#ccff00]">
                <div className="relative h-64 sm:h-80 overflow-hidden bg-zinc-900">
                  <img 
                    src={restaurant.hero_image || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1920&q=80'} 
                    alt={restaurant.name}
                    className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition duration-500"
                  />
                  <div className="absolute bottom-2 left-2 bg-black px-2 py-0.5 text-[9px] font-bold border border-white/20 text-[#ccff00]">
                    FIG. 01 // INTERIOR_VIEW
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ticket Admission CTA Callout */}
      <section className="px-4 max-w-6xl mx-auto pb-12">
        <div className="border-2 border-dashed border-white/30 bg-zinc-950 p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative">
          <div className="space-y-1.5 max-w-xl">
            <span className="text-[10px] text-[#ccff00] font-bold tracking-widest uppercase block">[ 01 // ACCESO EXCLUSIVO ]</span>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">
              TICKET STUB: RESERVA DIRECTA AHORA
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              Sin pagar sobrecostes a apps externas. Tu confirmación llega al segundo vía WhatsApp directamente a los camareros de sala.
            </p>
          </div>

          {/* Barcode & Button */}
          <div className="flex flex-col items-center sm:items-end gap-2 shrink-0">
            <div className="font-mono text-[9px] tracking-widest text-zinc-500">|||||| |||| |||||||| ||||| |||||||</div>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="px-5 py-2.5 bg-[#ccff00] text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#ffffff]"
            >
              Pedir Asiento en Sala
            </button>
          </div>
        </div>
      </section>

      {/* Menu / Carte in Brutalist Receipt Style */}
      <section className="px-4 max-w-6xl mx-auto pb-20">
        <div className="border-b-2 border-white/20 pb-4 mb-8 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#ccff00] tracking-widest uppercase">[ 02 // SELECCION DE BOTELLAS & PLATO ]</span>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">
              MANIFIESTO DE LA CARTA
            </h2>
          </div>
          <span className="text-xs text-zinc-500 font-mono">VALORES NETOS // IVA INCLUIDO</span>
        </div>

        {categories.map((cat, idx) => (
          <div key={cat.id || idx} className="mb-10">
            <div className="bg-zinc-900 border-2 border-white/20 px-4 py-2 mb-4 flex items-center justify-between">
              <span className="font-black text-sm uppercase text-white tracking-wider">
                SECT. {idx + 1} // {cat.name}
              </span>
              <span className="text-[10px] text-[#ccff00] font-bold">{cat.items?.length || 0} ITEMS</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(cat.items || []).map((item) => (
                <div 
                  key={item.id}
                  className="p-4 bg-zinc-950 border border-white/10 hover:border-white/40 transition group relative"
                >
                  <div className="flex justify-between items-baseline gap-2 mb-1.5">
                    <h4 className="font-bold text-sm text-white uppercase group-hover:text-[#ccff00] transition">
                      {item.name}
                    </h4>
                    <span className="font-black text-base text-[#ccff00] shrink-0 font-mono">
                      {item.price.toFixed(2)}€
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 font-mono leading-relaxed mb-3">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px]">
                    {item.badge ? (
                      <span className="px-2 py-0.5 bg-zinc-900 border border-white/10 text-white font-bold uppercase">
                        [{item.badge}]
                      </span>
                    ) : (
                      <span className="text-zinc-600 font-mono">ORIGEN_LOCAL</span>
                    )}

                    {item.allergens?.length > 0 && (
                      <span className="text-zinc-500 font-mono">ALERGENOS: {item.allergens.join(', ')}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Mobile Sticky Brutalist Pass Bar */}
      <div className="sm:hidden fixed bottom-4 inset-x-3 z-40">
        <div className="bg-black border-2 border-white p-2.5 flex items-center justify-between shadow-[4px_4px_0px_#ccff00]">
          <div className="pl-1">
            <span className="block text-xs font-black text-white uppercase">{restaurant.name}</span>
            <span className="block text-[9px] text-[#ccff00] font-bold">PASE DIRECTO // SIN ESPERA</span>
          </div>
          <button
            onClick={() => setIsBookingOpen(true)}
            className="brutalist-pressable px-4 py-2 bg-[#ccff00] text-black font-black text-xs uppercase border-2 border-black touch-target-44 flex items-center gap-1.5"
          >
            <span>OBTENER PASE</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="border-t-2 border-white/20 bg-black py-10 px-4 pb-24 sm:pb-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-zinc-400">
          <div className="space-y-1 text-center md:text-left">
            <span className="font-black text-white text-base block">{restaurant.name}</span>
            <span>{restaurant.address} • {restaurant.city} ({restaurant.postal_code})</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-bold text-white">TEL: {restaurant.phone}</span>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="brutalist-pressable px-4 py-2 bg-zinc-900 border border-white/20 text-[#ccff00] font-bold text-xs uppercase"
            >
              Reservar Mesa
            </button>
          </div>
        </div>
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
