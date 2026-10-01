import React, { useState } from 'react';
import { GlassWater, Calendar, Clock, MapPin, Sparkles, ShieldCheck } from 'lucide-react';
import BookingModal from '../Booking/BookingModal';

export default function VelvetTemplate({ restaurant, isPreview = false }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const categories = restaurant.menu_categories || [];

  const primaryColor = restaurant.primary_color || '#e11d48';
  const bgColor = restaurant.background_color || '#070204';
  const surfaceColor = restaurant.surface_color || '#110508';

  const fontFamily = restaurant.font_family === 'Playfair Display' 
    ? 'font-luxury' 
    : restaurant.font_family === 'Inter' 
    ? 'font-sans' 
    : 'font-modern';

  return (
    <div 
      className={`min-h-screen text-zinc-100 selection:bg-rose-600 selection:text-white relative ${fontFamily}`}
      style={{ backgroundColor: bgColor }}
    >
      <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-rose-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-rose-500/10 bg-[#070204]/85 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-950/60 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <GlassWater className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight block leading-tight">
                {restaurant.name}
              </span>
              <span className="text-[10px] tracking-widest uppercase text-rose-400 font-mono">
                Velvet Speakeasy & Jazz
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {restaurant.dress_code && (
              <span className="hidden md:inline-flex text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border border-rose-500/20 text-rose-300">
                {restaurant.dress_code}
              </span>
            )}
            <button
              onClick={() => setIsBookingOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_20px_rgba(225,29,72,0.4)]"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Acceso Reservado</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-14 pb-16 px-4 max-w-6xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden border border-rose-500/20 p-8 sm:p-14 min-h-[460px] flex flex-col justify-end">
          <div 
            className="absolute inset-0 bg-cover bg-center -z-10"
            style={{ backgroundImage: `url(${restaurant.hero_image || 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1920&q=80'})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070204] via-[#070204]/80 to-transparent -z-10" />

          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono uppercase text-rose-300 bg-rose-950/60 border border-rose-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
              <span>Acceso Clandestino • Destilados & Jazz</span>
            </span>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
              {restaurant.slogan || restaurant.name}
            </h1>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl">
              {restaurant.description}
            </p>

            <div className="flex flex-wrap gap-3 pt-4">
              <button
                onClick={() => setIsBookingOpen(true)}
                className="px-6 py-3 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white transition flex items-center gap-2 shadow-[0_0_25px_rgba(225,29,72,0.5)]"
              >
                <Calendar className="w-4 h-4" />
                <span>Reservar Mesa Privada</span>
              </button>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-wrap gap-6 pt-6 text-xs text-zinc-400 border-t border-rose-500/10 mt-8">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            {restaurant.address}, {restaurant.city}
          </span>
          <span className="flex items-center gap-1.5 font-mono">
            <Clock className="w-3.5 h-3.5 text-rose-400" />
            {restaurant.dinner_shift?.enabled !== false ? `Apertura: ${restaurant.dinner_shift?.open || '20:30'} - ${restaurant.dinner_shift?.close || '03:00'}` : 'Horario Nocturno'}
          </span>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-12 px-4 max-w-6xl mx-auto border-t border-rose-500/10">
        <div className="mb-8">
          <span className="text-[10px] uppercase font-mono tracking-widest text-rose-400 block mb-1">
            Destilados & Creaciones
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Carta Privada
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(categories[0]?.items || []).map((item) => (
            <div key={item.id} className="p-5 rounded-2xl border border-rose-500/10 flex justify-between gap-4" style={{ backgroundColor: surfaceColor }}>
              <div>
                <h3 className="font-bold text-white text-base">{item.name}</h3>
                <p className="text-xs text-zinc-400 mt-1">{item.description}</p>
              </div>
              <span className="font-mono font-bold text-rose-400 text-base shrink-0">
                {typeof item.price === 'number' ? `${item.price.toFixed(2)}€` : item.price}
              </span>
            </div>
          ))}
        </div>
      </section>

      <BookingModal
        restaurant={restaurant}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}
