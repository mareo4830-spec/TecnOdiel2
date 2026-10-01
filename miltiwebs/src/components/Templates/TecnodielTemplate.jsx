import React, { useState } from 'react';
import { Utensils, Calendar, MapPin, Clock, Phone, Sparkles, Award, ArrowUpRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import BookingModal from '../Booking/BookingModal';

export default function TecnodielTemplate({ restaurant, isPreview = false }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(0);

  const primaryColor = restaurant.primary_color || '#10b981';
  const accentColor = restaurant.accent_color || '#34d399';
  const bgColor = restaurant.background_color || '#000000';
  const surfaceColor = restaurant.surface_color || '#09090b';
  const categories = restaurant.menu_categories || [];

  const fontFamily = restaurant.font_family === 'Playfair Display' 
    ? 'font-luxury' 
    : restaurant.font_family === 'Outfit' 
    ? 'font-modern' 
    : 'font-sans';

  const layout = restaurant.hero_layout || 'split';
  const texture = restaurant.texture || 'grain';

  return (
    <div 
      className={`min-h-screen text-zinc-100 selection:bg-emerald-500 selection:text-black relative ${fontFamily} ${
        texture === 'grain' ? 'cinematic-grain' : ''
      }`}
      style={{ backgroundColor: bgColor }}
    >
      {/* Background Radial Glow */}
      {texture === 'spotlight' && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-radial-spotlight pointer-events-none opacity-60" />
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-black/80 backdrop-blur-2xl">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center border"
              style={{
                borderColor: `${primaryColor}40`,
                backgroundColor: `${primaryColor}15`,
                color: primaryColor
              }}
            >
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <span className="font-black text-white text-base tracking-tight leading-none block">
                {restaurant.name}
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400">
                Alta Cocina de Vanguardia
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {restaurant.dress_code && (
              <span className="hidden md:inline-flex text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border border-white/10 text-zinc-400">
                {restaurant.dress_code}
              </span>
            )}
            <button
              onClick={() => setIsBookingOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-emerald-400 hover:bg-emerald-300 text-black"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Reservar Experiencia</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-14 pb-16 px-4 max-w-6xl mx-auto">
        {layout === 'split' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Gastronomia Sensorial de Origen</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.05]">
                {restaurant.slogan || 'El arte culinario elevado a su maxima pureza.'}
              </h1>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xl">
                {restaurant.description}
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="px-6 py-3.5 rounded-xl font-bold text-xs bg-emerald-400 hover:bg-emerald-300 text-black transition flex items-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.4)]"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reservar Mesa Online</span>
                </button>

                <a
                  href="#degustacion"
                  className="px-5 py-3.5 rounded-xl border border-white/10 bg-zinc-900/60 hover:bg-zinc-800 text-white text-xs font-semibold transition flex items-center gap-2"
                >
                  <span>Descubrir Menu</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border border-white/15 p-2 bg-zinc-900/40 backdrop-blur-xl group">
                <img
                  src={restaurant.hero_image || 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1920&q=80'}
                  alt={restaurant.name}
                  className="w-full h-[400px] object-cover rounded-2xl group-hover:scale-105 transition duration-700"
                />
                <div className="absolute bottom-5 left-5 right-5 p-3.5 rounded-xl bg-black/85 backdrop-blur-md border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-mono text-emerald-400 tracking-wider block">Propuesta Culinaria</span>
                    <span className="text-xs font-bold text-white">Menu Degustacion de Origen</span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative rounded-3xl overflow-hidden border border-white/10 p-8 sm:p-14 min-h-[460px] flex flex-col justify-end">
            <div 
              className="absolute inset-0 bg-cover bg-center -z-10"
              style={{ backgroundImage: `url(${restaurant.hero_image || 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1920&q=80'})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent -z-10" />
            <div className="max-w-2xl space-y-4">
              <span className="text-xs font-mono uppercase text-emerald-400 tracking-wider">Alta Cocina</span>
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
                {restaurant.slogan || restaurant.name}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl">
                {restaurant.description}
              </p>
              <button
                onClick={() => setIsBookingOpen(true)}
                className="px-6 py-3 rounded-xl font-bold text-xs bg-emerald-400 text-black shadow-xl"
              >
                Reservar Mesa Online
              </button>
            </div>
          </div>
        )}

        {/* Schedule & Location banner */}
        <div className="flex flex-wrap gap-6 pt-6 text-xs text-zinc-400 border-t border-white/5 mt-8">
          <span className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            {restaurant.address}, {restaurant.city}
          </span>
          <span className="flex items-center gap-2 font-mono">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            {restaurant.lunch_shift?.enabled ? `Almuerzos: ${restaurant.lunch_shift.open}-${restaurant.lunch_shift.close}` : ''}
            {restaurant.lunch_shift?.enabled && restaurant.dinner_shift?.enabled ? ' • ' : ''}
            {restaurant.dinner_shift?.enabled ? `Cenas: ${restaurant.dinner_shift.open}-${restaurant.dinner_shift.close}` : ''}
          </span>
          {restaurant.closed_days && restaurant.closed_days.length > 0 && (
            <span className="text-zinc-500">
              Cierre: {restaurant.closed_days.join(', ')}
            </span>
          )}
        </div>
      </section>

      {/* Menu & Tasting Section */}
      <section id="degustacion" className="py-12 px-4 max-w-6xl mx-auto border-t border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 block mb-1">
              Carta & Experiencias
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Creaciones Gastronomicas
            </h2>
          </div>

          {categories.length > 1 && (
            <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-zinc-900/80 border border-white/5">
              {categories.map((cat, idx) => (
                <button
                  key={cat.id || idx}
                  onClick={() => setSelectedCategory(idx)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedCategory === idx
                      ? 'bg-emerald-400 text-black font-bold shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(categories[selectedCategory]?.items || []).map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition flex justify-between gap-4 group"
              style={{ backgroundColor: surfaceColor }}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-sm sm:text-base group-hover:text-emerald-300 transition">
                    {item.name}
                  </h3>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
                {item.allergens && item.allergens.length > 0 && (
                  <span className="text-[10px] text-zinc-500 block pt-1 font-mono">
                    Alergenos: {item.allergens.join(', ')}
                  </span>
                )}
              </div>
              <div className="text-right shrink-0">
                <span className="font-mono text-sm sm:text-base font-bold text-emerald-400 block">
                  {typeof item.price === 'number' ? `${item.price.toFixed(2)}€` : item.price}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">IVA inc.</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        restaurant={restaurant}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}
