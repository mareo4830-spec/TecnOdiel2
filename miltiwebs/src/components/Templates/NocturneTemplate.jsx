import React, { useState } from 'react';
import { Wine, Clock, MapPin, Phone, Instagram, Calendar, ChevronRight, ShieldCheck, ArrowUpRight } from 'lucide-react';
import BookingModal from '../Booking/BookingModal';

export default function NocturneTemplate({ 
  restaurant, 
  isPreview = false, 
  previewDevice = 'desktop',
  onSelectElement = null,
  selectedElement = null 
}) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);

  const primaryColor = restaurant.primary_color || '#f59e0b';
  const accentColor = restaurant.accent_color || '#fbbf24';
  const bgColor = restaurant.background_color || '#050507';
  const surfaceColor = restaurant.surface_color || '#0d0d12';
  const categories = restaurant.menu_categories || [];

  const isMobile = previewDevice === 'mobile';
  const isTablet = previewDevice === 'tablet';
  const heroImageSide = restaurant.hero_image_side || 'right';
  const heroImageSize = restaurant.hero_image_size || 'md';

  const handleEdit = (e, type, label, data = null) => {
    if (isPreview && onSelectElement) {
      e.stopPropagation();
      onSelectElement({ type, label, data });
    }
  };

  const editableClass = (type) => {
    if (!isPreview) return '';
    const isSelected = selectedElement?.type === type;
    return `hover:ring-2 hover:ring-amber-400 hover:ring-offset-2 hover:ring-offset-black transition-all cursor-pointer ${
      isSelected ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-black shadow-[0_0_15px_rgba(251,191,36,0.3)]' : ''
    }`;
  };

  const getImageHeight = () => {
    if (isMobile) return 'h-52';
    if (isTablet) return 'h-72';
    switch (heroImageSize) {
      case 'sm': case 'small': return 'h-64';
      case 'lg': case 'large': return 'h-[480px]';
      case 'xl': case 'full': return 'h-[560px]';
      case 'md': case 'medium':
      default: return 'h-[380px]';
    }
  };

  const fontFamily = restaurant.font_family === 'Playfair Display' 
    ? 'font-luxury' 
    : restaurant.font_family === 'Inter' 
    ? 'font-sans' 
    : 'font-modern';

  const layout = restaurant.hero_layout || 'split';
  const texture = restaurant.texture || 'spotlight';

  return (
    <div 
      className={`min-h-screen text-zinc-100 selection:bg-amber-500 selection:text-black relative overflow-x-hidden ${fontFamily} ${
        texture === 'grain' ? 'cinematic-grain' : ''
      }`}
      style={{ backgroundColor: bgColor }}
    >
      {/* Texture Ambient Effect */}
      {texture === 'spotlight' && (
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[140px] pointer-events-none opacity-30"
          style={{ background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)` }}
        />
      )}
      {texture === 'vignette' && (
        <div className="absolute inset-0 bg-radial-vignette pointer-events-none -z-0" />
      )}

      {/* Top Bar / Navigation */}
      <header className="sticky top-0 z-40 border-b border-white/5 backdrop-blur-xl bg-black/75">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            onClick={(e) => handleEdit(e, 'brand', 'Marca / Logo')}
            className={`flex items-center gap-2.5 ${editableClass('brand')}`}
            title={isPreview ? "Pulsa para editar el nombre de marca" : undefined}
          >
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center border font-bold text-xs shrink-0 emil-pressable"
              style={{ 
                borderColor: `${primaryColor}40`, 
                backgroundColor: `${primaryColor}15`, 
                color: primaryColor 
              }}
            >
              <Wine className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-white block text-sm sm:text-base leading-tight">
                {restaurant.name}
              </span>
              <span className="text-[10px] tracking-widest uppercase text-zinc-400 block font-mono">
                {restaurant.category === 'night_bar' ? 'Mixology & Night Lounge' : 'Gastro Bar'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {restaurant.dress_code && !isMobile && (
              <span className="hidden sm:inline-flex text-[10px] font-mono uppercase px-2.5 py-1 rounded-full border border-white/10 text-zinc-400">
                {restaurant.dress_code}
              </span>
            )}
            <button
              onClick={(e) => isPreview ? handleEdit(e, 'cta_button', 'Botón de Reserva') : setIsBookingOpen(true)}
              className={`emil-pressable px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg touch-target-44 ${editableClass('cta_button')}`}
              style={{
                backgroundColor: primaryColor,
                color: '#000000',
                boxShadow: `0 0 20px ${primaryColor}40`
              }}
              title={isPreview ? "Pulsa para editar el botón de reserva" : undefined}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{restaurant.cta_text || 'Reservar Mesa'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section based on hero_layout (centered, split, minimal) */}
      <section className="relative pt-8 sm:pt-10 pb-16 px-4 max-w-6xl mx-auto">
        {layout === 'centered' && (
          <div 
            onClick={(e) => handleEdit(e, 'hero_image', 'Imagen de Portada')}
            className={`relative rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-14 min-h-[420px] flex flex-col justify-end ${editableClass('hero_image')}`}
            title={isPreview ? "Pulsa para editar la foto de portada" : undefined}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center -z-10 scale-105 transition duration-1000"
              style={{ backgroundImage: `url(${restaurant.hero_image || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1920&q=80'})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/30 -z-10" />

            <div className="max-w-2xl space-y-4">
              <div 
                onClick={(e) => handleEdit(e, 'slogan', 'Lema')}
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono border backdrop-blur-md uppercase tracking-wider ${editableClass('slogan')}`}
                style={{
                  borderColor: `${primaryColor}40`,
                  backgroundColor: `${primaryColor}20`,
                  color: accentColor
                }}
              >
                <span>Experiencia Nocturna & Cocteleria de Autor</span>
              </div>

              <h1 
                onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
                className={`text-3xl ${isMobile ? 'text-2xl' : 'sm:text-5xl lg:text-6xl'} font-black text-white tracking-tight leading-tight ${editableClass('title')}`}
              >
                {restaurant.slogan || restaurant.name}
              </h1>

              <p 
                onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                className={`text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl ${editableClass('slogan')}`}
              >
                {restaurant.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-4">
                <button
                  onClick={(e) => isPreview ? handleEdit(e, 'cta_button', 'Botón de Reserva') : setIsBookingOpen(true)}
                  className={`px-6 py-3 rounded-xl font-bold text-xs transition flex items-center gap-2 shadow-2xl ${editableClass('cta_button')}`}
                  style={{
                    backgroundColor: primaryColor,
                    color: '#000000',
                    boxShadow: `0 0 25px ${primaryColor}50`
                  }}
                >
                  <Calendar className="w-4 h-4" />
                  <span>{restaurant.cta_text || 'Reservar Mesa Online'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => document.getElementById('carta')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="px-5 py-3 rounded-xl border border-white/15 bg-black/40 backdrop-blur-md text-white text-xs font-semibold hover:border-white/30 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Carta Digital</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                </button>
              </div>
            </div>
          </div>
        )}

        {layout === 'split' && (
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-1 lg:grid-cols-12 gap-8'} items-center pt-4`}>
            {/* Text Column */}
            <div className={`${isMobile ? 'order-2' : heroImageSide === 'left' ? 'lg:col-span-7 order-2 lg:order-2' : 'lg:col-span-7 order-1 lg:order-1'} space-y-5`}>
              <div 
                onClick={(e) => handleEdit(e, 'slogan', 'Lema')}
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono border uppercase tracking-wider ${editableClass('slogan')}`}
                style={{
                  borderColor: `${primaryColor}40`,
                  backgroundColor: `${primaryColor}15`,
                  color: accentColor
                }}
              >
                <span>Mixologia Contemporanea</span>
              </div>

              <h1 
                onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
                className={`text-3xl ${isMobile ? 'text-2xl' : 'sm:text-5xl'} font-black text-white tracking-tight leading-tight ${editableClass('title')}`}
              >
                {restaurant.slogan || restaurant.name}
              </h1>

              <p 
                onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                className={`text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-lg ${editableClass('slogan')}`}
              >
                {restaurant.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={(e) => isPreview ? handleEdit(e, 'cta_button', 'Botón de Reserva') : setIsBookingOpen(true)}
                  className={`px-6 py-3 rounded-xl font-bold text-xs transition flex items-center gap-2 shadow-2xl ${editableClass('cta_button')}`}
                  style={{
                    backgroundColor: primaryColor,
                    color: '#000000',
                    boxShadow: `0 0 25px ${primaryColor}50`
                  }}
                >
                  <Calendar className="w-4 h-4" />
                  <span>{restaurant.cta_text || 'Reservar Mesa Online'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => document.getElementById('carta')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="px-5 py-3 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold cursor-pointer transition"
                >
                  <span>Explorar Carta</span>
                </button>
              </div>
            </div>

            {/* Image Column */}
            <div 
              onClick={(e) => handleEdit(e, 'hero_image', 'Imagen de Portada')}
              className={`${isMobile ? 'order-1' : heroImageSide === 'left' ? 'lg:col-span-5 order-1 lg:order-1' : 'lg:col-span-5 order-2 lg:order-2'} ${editableClass('hero_image')}`}
              title={isPreview ? "Pulsa para editar la foto de portada" : undefined}
            >
              <div className="rounded-3xl overflow-hidden border border-white/10 p-2 bg-zinc-900/40">
                <img 
                  src={restaurant.hero_image || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1920&q=80'}
                  alt={restaurant.name}
                  className={`w-full ${getImageHeight()} object-cover rounded-2xl`}
                />
              </div>
            </div>
          </div>
        )}

        {layout === 'minimal' && (
          <div className="py-12 text-center max-w-3xl mx-auto space-y-6">
            <span 
              onClick={(e) => handleEdit(e, 'slogan', 'Lema')}
              className={`text-[11px] font-mono text-zinc-400 uppercase tracking-widest block ${editableClass('slogan')}`}
            >
              {restaurant.category === 'night_bar' ? 'Bar de Noche & Cocteleria' : 'Restaurante Exclusivo'}
            </span>
            <h1 
              onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
              className={`text-4xl ${isMobile ? 'text-3xl' : 'sm:text-6xl'} font-black text-white tracking-tight ${editableClass('title')}`}
            >
              {restaurant.name}
            </h1>
            <p 
              onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
              className={`text-sm text-zinc-300 leading-relaxed max-w-xl mx-auto ${editableClass('slogan')}`}
            >
              {restaurant.slogan || restaurant.description}
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={(e) => isPreview ? handleEdit(e, 'cta_button', 'Botón de Reserva') : setIsBookingOpen(true)}
                className={`px-7 py-3 rounded-xl font-bold text-xs shadow-2xl ${editableClass('cta_button')}`}
                style={{
                  backgroundColor: primaryColor,
                  color: '#000000',
                  boxShadow: `0 0 25px ${primaryColor}40`
                }}
              >
                {restaurant.cta_text || 'Reservar Mesa Ahora'}
              </button>
            </div>
          </div>
        )}

        {/* Micro info line */}
        <div 
          onClick={(e) => handleEdit(e, 'contact', 'Datos de Contacto')}
          className={`flex flex-wrap gap-6 pt-6 text-xs text-zinc-400 border-t border-white/5 mt-8 ${editableClass('contact')}`}
          title={isPreview ? "Pulsa para editar contacto" : undefined}
        >
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-zinc-500" />
            {restaurant.address}, {restaurant.city}
          </span>
          <span className="flex items-center gap-1.5 font-mono">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            {restaurant.dinner_shift?.enabled !== false ? `Cenas: ${restaurant.dinner_shift?.open || '19:30'} - ${restaurant.dinner_shift?.close || '02:30'}` : 'Horario Continuo'}
          </span>
          {restaurant.closed_days && restaurant.closed_days.length > 0 && (
            <span className="text-zinc-500">
              Descanso: {restaurant.closed_days.join(', ')}
            </span>
          )}
        </div>
      </section>

      {/* Menu Section */}
      <section id="carta" className="py-12 px-4 max-w-6xl mx-auto border-t border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 block mb-1">
              Propuesta Gastronomica
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Carta Digital & Mixologia
            </h2>
          </div>

          {categories.length > 1 && (
            <div className="flex overflow-x-auto no-scrollbar gap-1.5 p-1 rounded-xl bg-zinc-900/80 border border-white/5 max-w-full">
              {categories.map((cat, idx) => (
                <button
                  key={cat.id || idx}
                  onClick={() => setActiveCategory(idx)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition emil-pressable shrink-0 ${
                    activeCategory === idx
                      ? 'bg-white text-black shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Menu Items Grid */}
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : isTablet ? 'grid-cols-2 gap-4' : 'grid-cols-1 md:grid-cols-2 gap-4'}`}>
          {(categories[activeCategory]?.items || []).map((item, idx) => (
            <div 
              key={item.id || idx}
              onClick={(e) => handleEdit(e, 'menu_item', item.name, { categoryIndex: activeCategory, itemIndex: idx, item })}
              className={`p-5 rounded-2xl border border-white/5 hover:border-white/20 transition-all duration-200 flex justify-between gap-4 group emil-pressable cursor-pointer ${editableClass('menu_item')}`}
              style={{ backgroundColor: surfaceColor }}
              title={isPreview ? "Pulsa para editar este plato" : undefined}
            >
              <div className="flex gap-4 items-start flex-1">
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10" />
                )}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-sm sm:text-base group-hover:text-amber-300 transition">
                      {item.name}
                    </h3>
                    {item.badge && (
                      <span 
                        className="px-2 py-0.5 rounded-full text-[10px] font-mono border"
                        style={{ 
                          borderColor: `${primaryColor}40`, 
                          backgroundColor: `${primaryColor}15`, 
                          color: accentColor 
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                  {item.allergens && item.allergens.length > 0 && (
                    <span className="text-[10px] text-zinc-500 block pt-1 font-mono">
                      Alergenos: {item.allergens.join(', ')}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right flex flex-col justify-between shrink-0 pl-2">
                <span className="font-mono font-bold text-sm sm:text-base text-white">
                  {typeof item.price === 'number' ? `${item.price.toFixed(2)}€` : item.price}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">IVA inc.</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking CTA Banner */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <div 
          className="rounded-3xl p-8 sm:p-12 border border-white/10 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-8"
          style={{ backgroundColor: surfaceColor }}
        >
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-mono" style={{ color: accentColor }}>
              <ShieldCheck className="w-4 h-4" />
              <span>Reserva Inmediata Sin Intermediarios</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Asegura tu mesa en los diferentes espacios del local
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Zonas configurables: {(restaurant.booking_rules?.available_areas || []).join(' • ')}.
            </p>
          </div>

          <button
            onClick={() => setIsBookingOpen(true)}
            className="emil-pressable shrink-0 px-7 py-3.5 rounded-xl font-bold text-xs transition shadow-2xl flex items-center gap-2 touch-target-44"
            style={{
              backgroundColor: primaryColor,
              color: '#000000',
              boxShadow: `0 0 30px ${primaryColor}50`
            }}
          >
            <Calendar className="w-4 h-4" />
            <span>Gestionar Reserva Directa</span>
          </button>
        </div>
      </section>

      {/* Mobile Sticky Floating Booking Bar (Emil Kowalski responsive signature pattern) */}
      <div className="sm:hidden fixed bottom-4 inset-x-4 z-40">
        <div className="bg-zinc-950/90 backdrop-blur-2xl border border-white/15 rounded-2xl p-2.5 flex items-center justify-between shadow-[0_10px_35px_rgba(0,0,0,0.9)]">
          <div className="pl-2">
            <span className="block text-xs font-bold text-white tracking-tight">{restaurant.name}</span>
            <span className="block text-[10px] text-zinc-400 font-mono">Mesa garantizada en 1 min</span>
          </div>
          <button
            onClick={() => setIsBookingOpen(true)}
            className="emil-pressable px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg touch-target-44"
            style={{
              backgroundColor: primaryColor,
              color: '#000000',
              boxShadow: `0 0 15px ${primaryColor}40`
            }}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Reservar</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer 
        onClick={(e) => handleEdit(e, 'contact', 'Pie de Página')}
        className={`border-t border-white/5 py-10 px-4 text-xs text-zinc-500 max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 pb-24 sm:pb-10 ${editableClass('contact')}`}
        title={isPreview ? "Pulsa para editar contacto" : undefined}
      >
        <div>
          <span className="text-zinc-300 font-semibold">{restaurant.name}</span> • {restaurant.address}, {restaurant.city}
        </div>
        <div className="flex items-center gap-4">
          {restaurant.instagram_url && (
            <a href={restaurant.instagram_url} target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center gap-1 font-mono text-[11px] emil-pressable">
              <Instagram className="w-3.5 h-3.5" />
              <span>Instagram</span>
            </a>
          )}
          <span className="font-mono text-[10px]">TecnOdiel Multi-Webs Engine</span>
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
