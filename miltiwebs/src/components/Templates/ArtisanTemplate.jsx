import React, { useState } from 'react';
import { Flame, Calendar, Clock, MapPin, Phone, ShieldCheck, Heart } from 'lucide-react';
import BookingModal from '../Booking/BookingModal';

export default function ArtisanTemplate({ restaurant, isPreview = false }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const categories = restaurant.menu_categories || [];

  const primaryColor = restaurant.primary_color || '#ea580c';
  const bgColor = restaurant.background_color || '#0a0806';
  const surfaceColor = restaurant.surface_color || '#14100c';

  const fontFamily = restaurant.font_family === 'Playfair Display' 
    ? 'font-luxury' 
    : restaurant.font_family === 'Outfit' 
    ? 'font-modern' 
    : 'font-sans';

  return (
    <div 
      className={`min-h-screen text-zinc-100 selection:bg-orange-500 selection:text-white ${fontFamily}`}
      style={{ backgroundColor: bgColor }}
    >
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-orange-500/10 bg-[#0a0806]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif font-bold text-white text-lg block leading-none">
                {restaurant.name}
              </span>
              <span className="text-[10px] tracking-wider uppercase text-orange-400 font-sans">
                Trattoria Tradicional & Fuego
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {restaurant.dress_code && (
              <span className="hidden md:inline-flex text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border border-orange-500/20 text-orange-300">
                {restaurant.dress_code}
              </span>
            )}
            <button
              onClick={() => setIsBookingOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white shadow-lg"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Reservar Mesa</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-12 pb-16 px-4 max-w-6xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden border border-orange-500/20 p-8 sm:p-14 min-h-[460px] flex flex-col justify-end">
          <div 
            className="absolute inset-0 bg-cover bg-center -z-10"
            style={{ backgroundImage: `url(${restaurant.hero_image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=80'})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0806] via-[#0a0806]/75 to-transparent -z-10" />

          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-serif italic text-orange-300 bg-orange-950/60 border border-orange-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
              <span>Tradicion, masa madre y brasas vivas</span>
            </span>

            <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white tracking-tight leading-tight">
              {restaurant.slogan || restaurant.name}
            </h1>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl">
              {restaurant.description}
            </p>

            <div className="flex flex-wrap gap-3 pt-4">
              <button
                onClick={() => setIsBookingOpen(true)}
                className="px-6 py-3 rounded-xl font-bold text-xs bg-orange-600 hover:bg-orange-500 text-white transition flex items-center gap-2 shadow-xl"
              >
                <Calendar className="w-4 h-4" />
                <span>Reservar Mesa de Autor</span>
              </button>
            </div>
          </div>
        </div>

        {/* Micro info */}
        <div className="flex flex-wrap gap-6 pt-6 text-xs text-zinc-400 border-t border-orange-500/10 mt-8">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-orange-400" />
            {restaurant.address}, {restaurant.city}
          </span>
          <span className="flex items-center gap-1.5 font-mono">
            <Clock className="w-3.5 h-3.5 text-orange-400" />
            {restaurant.lunch_shift?.enabled ? `Comidas: ${restaurant.lunch_shift.open}-${restaurant.lunch_shift.close}` : ''}
            {restaurant.lunch_shift?.enabled && restaurant.dinner_shift?.enabled ? ' • ' : ''}
            {restaurant.dinner_shift?.enabled ? `Cenas: ${restaurant.dinner_shift.open}-${restaurant.dinner_shift.close}` : ''}
          </span>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-12 px-4 max-w-6xl mx-auto border-t border-orange-500/10">
        <div className="mb-8">
          <span className="text-[10px] uppercase font-mono tracking-widest text-orange-400 block mb-1">
            Recetas Tradicionales & Horno
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Nuestra Carta Artesanal
          </h2>
        </div>

        {categories.map((cat, cIdx) => (
          <div key={cat.id || cIdx} className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-serif italic text-orange-400 text-sm">{cat.name}</span>
              <div className="h-[1px] flex-1 bg-orange-500/20" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(cat.items || []).map((item) => (
                <div 
                  key={item.id} 
                  className="p-5 rounded-2xl border border-orange-500/15 hover:border-orange-500/35 transition-all duration-200 flex justify-between gap-4 emil-pressable" 
                  style={{ backgroundColor: surfaceColor }}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-bold text-white text-base">{item.name}</h3>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-sans bg-orange-500/10 border border-orange-500/20 text-orange-300">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">{item.description}</p>
                    {item.allergens?.length > 0 && (
                      <span className="text-[10px] text-zinc-500 font-mono block pt-1">
                        Alérgenos: {item.allergens.join(', ')}
                      </span>
                    )}
                  </div>
                  <div className="text-right shrink-0 pl-2">
                    <span className="font-serif font-bold text-orange-400 text-base font-mono">
                      {typeof item.price === 'number' ? `${item.price.toFixed(2)}€` : item.price}
                    </span>
                    <span className="text-[9px] text-zinc-500 block font-sans">IVA inc.</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Mobile Sticky Floating Booking Bar */}
      <div className="sm:hidden fixed bottom-4 inset-x-4 z-40">
        <div className="bg-[#14100c]/95 backdrop-blur-xl border border-orange-500/30 rounded-2xl p-2.5 flex items-center justify-between shadow-[0_10px_35px_rgba(0,0,0,0.9)]">
          <div className="pl-2">
            <span className="block text-xs font-serif font-bold text-white">{restaurant.name}</span>
            <span className="block text-[10px] text-orange-300 font-sans">Mesa de brasas garantizada</span>
          </div>
          <button
            onClick={() => setIsBookingOpen(true)}
            className="emil-pressable px-4 py-2 rounded-xl text-xs font-bold bg-orange-600 text-white flex items-center gap-1.5 shadow-lg touch-target-44"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Reservar</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-orange-500/10 py-10 px-4 text-xs text-zinc-500 max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 pb-24 sm:pb-10 font-sans">
        <div>
          <span className="text-zinc-300 font-serif font-bold">{restaurant.name}</span> • {restaurant.address}, {restaurant.city}
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[11px] text-orange-400">Tel: {restaurant.phone}</span>
          <span className="font-mono text-[10px]">TecnOdiel Multi-Webs Engine</span>
        </div>
      </footer>

      <BookingModal
        restaurant={restaurant}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}
