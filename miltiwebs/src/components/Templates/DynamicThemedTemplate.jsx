import React, { useState } from 'react';
import { 
  Wine, Utensils, Flame, Sparkles, Coffee, Fish, Pizza, Beer, 
  Palmtree, Gem, Crown, Compass, Waves, Sun, Moon, Zap, 
  ShieldCheck, MapPin, Phone, Instagram, Calendar, Clock, 
  ChevronRight, ArrowUpRight, Check, Heart, Award, Star, GlassWater
} from 'lucide-react';
import BookingModal from '../Booking/BookingModal';

// Metadata and visual styling presets for all 30 templates
export const TEMPLATE_THEMES = {
  nocturne: {
    icon: Wine,
    tagline: 'Mixología & Noche Exclusiva',
    badgeText: 'Experiencia Nocturna de Autor',
    styleClass: 'theme-nocturne',
    heroEffect: 'spotlight',
    cardBorder: 'border-white/10 hover:border-amber-400/40',
    buttonShape: 'rounded-xl',
    badgeShape: 'rounded-full'
  },
  minimalist: {
    icon: Utensils,
    tagline: 'Minimalismo Nórdico & Producto',
    badgeText: 'Paz Visual & Cocina Cuidada',
    styleClass: 'theme-minimal',
    heroEffect: 'clean',
    cardBorder: 'border-zinc-800 hover:border-zinc-500',
    buttonShape: 'rounded-md',
    badgeShape: 'rounded-sm'
  },
  brutalist: {
    icon: Zap,
    tagline: 'Underground & Street Vibe',
    badgeText: 'Energía Sin Filtros',
    styleClass: 'theme-brutalist',
    heroEffect: 'glitch',
    cardBorder: 'border-2 border-lime-400 shadow-[4px_4px_0px_#ccff00]',
    buttonShape: 'rounded-none uppercase tracking-widest font-black',
    badgeShape: 'rounded-none'
  },
  artisan: {
    icon: Flame,
    tagline: 'Horno de Leña & Fuego Lento',
    badgeText: 'Tradición, Madera & Brasa',
    styleClass: 'theme-artisan',
    heroEffect: 'grain',
    cardBorder: 'border-amber-900/40 hover:border-orange-500/50',
    buttonShape: 'rounded-2xl',
    badgeShape: 'rounded-full'
  },
  velvet: {
    icon: GlassWater,
    tagline: 'Terciopelo, Jazz & Clandestino',
    badgeText: 'Velvet Speakeasy & Burdeos',
    styleClass: 'theme-velvet',
    heroEffect: 'vignette',
    cardBorder: 'border-rose-900/30 hover:border-rose-500/40',
    buttonShape: 'rounded-xl',
    badgeShape: 'rounded-full'
  },
  cyberpunk: {
    icon: Zap,
    tagline: 'Cyber Neon & Experimental Bar',
    badgeText: 'Sintético // 2077 Night Hub',
    styleClass: 'theme-cyberpunk',
    heroEffect: 'grid',
    cardBorder: 'border border-cyan-500/40 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]',
    buttonShape: 'rounded-lg font-mono uppercase tracking-wider',
    badgeShape: 'rounded-md font-mono'
  },
  tokyo_omakase: {
    icon: Moon,
    tagline: 'Barra Omakase & Minimalismo Zen',
    badgeText: 'Omakase del Chef // 東京',
    styleClass: 'theme-omakase',
    heroEffect: 'clean',
    cardBorder: 'border-zinc-800 hover:border-rose-500/30',
    buttonShape: 'rounded-sm tracking-widest',
    badgeShape: 'rounded-full'
  },
  mediterranean_breeze: {
    icon: Waves,
    tagline: 'Brisa Marina & Arroces de Costa',
    badgeText: 'Sabor a Mar & Salitre',
    styleClass: 'theme-mediterranean',
    heroEffect: 'spotlight',
    cardBorder: 'border-sky-900/40 hover:border-sky-400/50',
    buttonShape: 'rounded-2xl',
    badgeShape: 'rounded-full'
  },
  bistro_parisien: {
    icon: Award,
    tagline: 'Bistró Clásico & Café de Época',
    badgeText: 'Art Déco & Haute Cuisine',
    styleClass: 'theme-bistro',
    heroEffect: 'grain',
    cardBorder: 'border-emerald-900/40 hover:border-amber-400/40',
    buttonShape: 'rounded-xl',
    badgeShape: 'rounded-full'
  },
  urban_street_smash: {
    icon: Flame,
    tagline: 'Smash Burgers & Streetwear',
    badgeText: '100% Carne Crujiente & Queso Fundido',
    styleClass: 'theme-smash',
    heroEffect: 'glitch',
    cardBorder: 'border-2 border-orange-500/50 hover:border-orange-400',
    buttonShape: 'rounded-xl font-black uppercase',
    badgeShape: 'rounded-lg'
  },
  tapas_andaluzas: {
    icon: Sun,
    tagline: 'Taberna de Solera & Jamón Ibérico',
    badgeText: 'Albero, Guitarras & Tapas del Sur',
    styleClass: 'theme-tapas',
    heroEffect: 'grain',
    cardBorder: 'border-amber-800/40 hover:border-yellow-400/50',
    buttonShape: 'rounded-xl',
    badgeShape: 'rounded-full'
  },
  steakhouse_asador: {
    icon: Flame,
    tagline: 'Asador de Brasa & Cortes Madurados',
    badgeText: 'Carbón Vegetal & Txuletones',
    styleClass: 'theme-steakhouse',
    heroEffect: 'vignette',
    cardBorder: 'border-red-950 hover:border-red-500/40',
    buttonShape: 'rounded-xl font-bold',
    badgeShape: 'rounded-md'
  },
  pasticceria_dolce: {
    icon: Heart,
    tagline: 'Pastelería Boutique & Desayunos Dolce',
    badgeText: 'Crema Pastelera & Café de Ensueño',
    styleClass: 'theme-dolce',
    heroEffect: 'spotlight',
    cardBorder: 'border-pink-900/30 hover:border-pink-400/40',
    buttonShape: 'rounded-full',
    badgeShape: 'rounded-full'
  },
  botanical_garden: {
    icon: LeafIcon,
    tagline: 'Cocina Verde, Orgánica & Vital',
    badgeText: 'Del Huerto a la Mesa // 100% Natural',
    styleClass: 'theme-botanical',
    heroEffect: 'spotlight',
    cardBorder: 'border-emerald-900/40 hover:border-emerald-400/50',
    buttonShape: 'rounded-2xl',
    badgeShape: 'rounded-full'
  },
  rooftop_sunset: {
    icon: Sun,
    tagline: 'Sky Lounge & Cócteles al Atardecer',
    badgeText: 'Vistas Panorámicas & Golden Hour',
    styleClass: 'theme-rooftop',
    heroEffect: 'spotlight',
    cardBorder: 'border-purple-900/30 hover:border-rose-400/40',
    buttonShape: 'rounded-2xl',
    badgeShape: 'rounded-full'
  },
  trattoria_italiana: {
    icon: Utensils,
    tagline: 'Auténtica Cocina Toscana & Pasta Fresca',
    badgeText: 'Tradizione di Famiglia & Chianti',
    styleClass: 'theme-trattoria',
    heroEffect: 'grain',
    cardBorder: 'border-green-950 hover:border-emerald-600/40',
    buttonShape: 'rounded-xl',
    badgeShape: 'rounded-full'
  },
  cerveceria_craft: {
    icon: Beer,
    tagline: 'Fábrica de Cerveza & Taproom',
    badgeText: '12 Grifos Artesanales // Lúpulo Fresco',
    styleClass: 'theme-brewery',
    heroEffect: 'grain',
    cardBorder: 'border-amber-900/40 hover:border-amber-500/50',
    buttonShape: 'rounded-lg uppercase font-bold',
    badgeShape: 'rounded-md'
  },
  marisqueria_costera: {
    icon: Fish,
    tagline: 'Marisquería de Lonja & Gamba Blanca',
    badgeText: 'Recién Pescado en la Costa de Huelva',
    styleClass: 'theme-marisqueria',
    heroEffect: 'spotlight',
    cardBorder: 'border-cyan-900/40 hover:border-cyan-400/50',
    buttonShape: 'rounded-xl',
    badgeShape: 'rounded-full'
  },
  taqueria_fiesta: {
    icon: Flame,
    tagline: 'Tacos al Pastor, Cantina & Mezcal',
    badgeText: '¡Viva el Sabor! // Tortilla a Mano',
    styleClass: 'theme-taqueria',
    heroEffect: 'grain',
    cardBorder: 'border-lime-900/40 hover:border-lime-400/50',
    buttonShape: 'rounded-xl font-bold',
    badgeShape: 'rounded-full'
  },
  coffee_specialty: {
    icon: Coffee,
    tagline: 'Tostadero & Café de Especialidad',
    badgeText: 'Granos de Finca & Extracciones de Precisión',
    styleClass: 'theme-coffee',
    heroEffect: 'grain',
    cardBorder: 'border-amber-950 hover:border-amber-600/40',
    buttonShape: 'rounded-xl',
    badgeShape: 'rounded-full'
  },
  gelato_artesanal: {
    icon: Heart,
    tagline: 'Gelato Italiano & Crepes de Autor',
    badgeText: 'Receta Tradicional Italiana // Cremoso',
    styleClass: 'theme-gelato',
    heroEffect: 'spotlight',
    cardBorder: 'border-teal-900/30 hover:border-teal-400/40',
    buttonShape: 'rounded-2xl',
    badgeShape: 'rounded-full'
  },
  pizzeria_napolitana: {
    icon: Pizza,
    tagline: 'Pizzería Napolitana & Horno de Piedra',
    badgeText: 'Fermentación 48 Horas // Vera Pizza',
    styleClass: 'theme-pizzeria',
    heroEffect: 'grain',
    cardBorder: 'border-red-900/40 hover:border-orange-500/50',
    buttonShape: 'rounded-xl',
    badgeShape: 'rounded-full'
  },
  lounge_shisha: {
    icon: Moon,
    tagline: 'Tetería VIP, Shishas & Arabian Nights',
    badgeText: 'Atmósfera Mística & Reservados Exclusivos',
    styleClass: 'theme-shisha',
    heroEffect: 'spotlight',
    cardBorder: 'border-purple-900/40 hover:border-amber-400/50',
    buttonShape: 'rounded-2xl',
    badgeShape: 'rounded-full'
  },
  beach_club: {
    icon: Palmtree,
    tagline: 'Beach Club, Balinesas & Puestas de Sol',
    badgeText: 'Oasis Balear // Cócteles & Arroces',
    styleClass: 'theme-beach',
    heroEffect: 'spotlight',
    cardBorder: 'border-cyan-900/40 hover:border-yellow-400/40',
    buttonShape: 'rounded-2xl',
    badgeShape: 'rounded-full'
  },
  gourmet_vanguardia: {
    icon: Gem,
    tagline: 'Vanguardia Molecular & Menú Degustación',
    badgeText: 'Criterio Michelin & Alta Cocina Emocional',
    styleClass: 'theme-vanguardia',
    heroEffect: 'clean',
    cardBorder: 'border-zinc-800 hover:border-zinc-400',
    buttonShape: 'rounded-none tracking-widest uppercase',
    badgeShape: 'rounded-none'
  },
  wok_asian_fusion: {
    icon: Flame,
    tagline: 'Wok Street Food, Bao & Ramen',
    badgeText: 'Fuego al Wok & Callejón Asiático',
    styleClass: 'theme-wok',
    heroEffect: 'glitch',
    cardBorder: 'border-red-900/50 hover:border-red-500/60',
    buttonShape: 'rounded-lg font-bold',
    badgeShape: 'rounded-md'
  },
  churreria_tradicional: {
    icon: Coffee,
    tagline: 'Chocolatería Castiza & Porras de Rueda',
    badgeText: 'Masa Fresca de Madrugada & Chocolate Espeso',
    styleClass: 'theme-churreria',
    heroEffect: 'grain',
    cardBorder: 'border-amber-950 hover:border-amber-500/50',
    buttonShape: 'rounded-xl',
    badgeShape: 'rounded-full'
  },
  bodega_enoteca: {
    icon: Crown,
    tagline: 'Bodega Centenaria & Cata de Vinos',
    badgeText: 'Vinos de Autor & Tablas de Curados',
    styleClass: 'theme-bodega',
    heroEffect: 'grain',
    cardBorder: 'border-red-950 hover:border-amber-600/40',
    buttonShape: 'rounded-xl font-serif',
    badgeShape: 'rounded-full'
  },
  pulperia_gallega: {
    icon: Compass,
    tagline: 'Pulpería de Ría & Tradición Gallega',
    badgeText: 'Pulpo á Feira & Albariño en Cunca',
    styleClass: 'theme-pulperia',
    heroEffect: 'grain',
    cardBorder: 'border-zinc-800 hover:border-red-600/50',
    buttonShape: 'rounded-xl',
    badgeShape: 'rounded-full'
  },
  tecnodiel_elite: {
    icon: Sparkles,
    tagline: 'Firma TecnOdiel Cyber Luxury',
    badgeText: 'Ingeniería Digital // Máximo Rendimiento',
    styleClass: 'theme-tecnodiel',
    heroEffect: 'grid',
    cardBorder: 'border-emerald-500/30 hover:border-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.35)]',
    buttonShape: 'rounded-xl font-mono',
    badgeShape: 'rounded-full'
  }
};

function LeafIcon(props) {
  return <Sparkles {...props} />;
}

export default function DynamicThemedTemplate({ restaurant, isPreview = false }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);

  const templateId = restaurant.template_id || 'nocturne';
  const meta = TEMPLATE_THEMES[templateId] || TEMPLATE_THEMES.nocturne;
  const IconComponent = meta.icon || Wine;

  const primaryColor = restaurant.primary_color || '#f59e0b';
  const accentColor = restaurant.accent_color || '#fbbf24';
  const bgColor = restaurant.background_color || '#050507';
  const surfaceColor = restaurant.surface_color || '#0d0d12';
  const categories = restaurant.menu_categories || [];

  const fontFamily = restaurant.font_family === 'Playfair Display' 
    ? 'font-serif' 
    : restaurant.font_family === 'Inter' 
    ? 'font-sans' 
    : 'font-modern';

  const layout = restaurant.hero_layout || 'centered';
  const texture = restaurant.texture || meta.heroEffect || 'spotlight';

  return (
    <div 
      className={`min-h-screen text-zinc-100 selection:bg-white selection:text-black relative overflow-x-hidden ${fontFamily}`}
      style={{ backgroundColor: bgColor }}
    >
      {/* Dynamic Background Effects */}
      {texture === 'spotlight' && (
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] rounded-full blur-[140px] pointer-events-none opacity-25"
          style={{ background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)` }}
        />
      )}

      {texture === 'grid' && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right, ${primaryColor}22 1px, transparent 1px), linear-gradient(to bottom, ${primaryColor}22 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      )}

      {texture === 'grain' && (
        <div className="absolute inset-0 bg-radial-vignette opacity-40 pointer-events-none" />
      )}

      {/* Header Bar */}
      <header className="sticky top-0 z-40 border-b border-white/5 backdrop-blur-2xl bg-black/80">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className={`w-9 h-9 ${meta.buttonShape} flex items-center justify-center border font-bold text-xs shrink-0 transition-transform hover:scale-105`}
              style={{ 
                borderColor: `${primaryColor}50`, 
                backgroundColor: `${primaryColor}18`, 
                color: primaryColor,
                boxShadow: `0 0 15px ${primaryColor}25`
              }}
            >
              <IconComponent className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-white block text-sm sm:text-base leading-tight">
                {restaurant.name}
              </span>
              <span 
                className="text-[10px] tracking-wider uppercase block font-mono font-medium"
                style={{ color: accentColor }}
              >
                {meta.tagline}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {restaurant.dress_code && (
              <span className="hidden sm:inline-flex text-[10px] font-mono uppercase px-2.5 py-1 rounded-full border border-white/10 text-zinc-300 bg-white/5">
                {restaurant.dress_code}
              </span>
            )}
            <button
              onClick={() => setIsBookingOpen(true)}
              className={`px-4 py-2 sm:px-5 sm:py-2.5 ${meta.buttonShape} text-xs font-bold transition flex items-center gap-2 shadow-lg hover:brightness-110 active:scale-95`}
              style={{
                backgroundColor: primaryColor,
                color: '#000000',
                boxShadow: `0 0 20px ${primaryColor}40`
              }}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Reservar Mesa</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-12 pb-16 px-4 max-w-6xl mx-auto">
        {layout === 'centered' && (
          <div className="relative rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-14 min-h-[460px] flex flex-col justify-end shadow-2xl">
            <div 
              className="absolute inset-0 bg-cover bg-center -z-10 scale-105 transition duration-1000"
              style={{ backgroundImage: `url(${restaurant.hero_image || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1920&q=80'})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/30 -z-10" />

            <div className="max-w-2xl space-y-4">
              <div 
                className={`inline-flex items-center gap-2 px-3 py-1 ${meta.badgeShape} text-[11px] font-mono border backdrop-blur-md uppercase tracking-wider`}
                style={{
                  borderColor: `${primaryColor}40`,
                  backgroundColor: `${primaryColor}20`,
                  color: accentColor
                }}
              >
                <IconComponent className="w-3.5 h-3.5" />
                <span>{meta.badgeText}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                {restaurant.slogan || restaurant.name}
              </h1>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl">
                {restaurant.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-4">
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className={`px-6 py-3.5 ${meta.buttonShape} font-bold text-xs transition flex items-center gap-2 shadow-2xl hover:brightness-110 active:scale-95`}
                  style={{
                    backgroundColor: primaryColor,
                    color: '#000000',
                    boxShadow: `0 0 25px ${primaryColor}50`
                  }}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reservar Mesa Online</span>
                </button>

                <a
                  href="#carta"
                  className={`px-5 py-3.5 ${meta.buttonShape} border border-white/15 bg-black/40 backdrop-blur-md text-white text-xs font-semibold hover:border-white/30 transition flex items-center gap-1.5`}
                >
                  <span>Ver Carta Digital</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                </a>
              </div>
            </div>
          </div>
        )}

        {layout === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
            <div className="lg:col-span-7 space-y-5">
              <div 
                className={`inline-flex items-center gap-2 px-3 py-1 ${meta.badgeShape} text-[11px] font-mono border uppercase tracking-wider`}
                style={{
                  borderColor: `${primaryColor}40`,
                  backgroundColor: `${primaryColor}15`,
                  color: accentColor
                }}
              >
                <IconComponent className="w-3.5 h-3.5" />
                <span>{meta.badgeText}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                {restaurant.slogan || restaurant.name}
              </h1>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-lg">
                {restaurant.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className={`px-6 py-3.5 ${meta.buttonShape} font-bold text-xs transition flex items-center gap-2 shadow-2xl hover:brightness-110 active:scale-95`}
                  style={{
                    backgroundColor: primaryColor,
                    color: '#000000',
                    boxShadow: `0 0 25px ${primaryColor}50`
                  }}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reservar Mesa Online</span>
                </button>
                <a
                  href="#carta"
                  className={`px-5 py-3.5 ${meta.buttonShape} border border-white/15 bg-zinc-900/80 text-white text-xs font-semibold hover:border-white/30 transition`}
                >
                  <span>Explorar Carta</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div 
                className={`overflow-hidden border p-2 bg-zinc-900/40 shadow-2xl ${meta.cardBorder}`}
                style={{ borderRadius: '1.5rem' }}
              >
                <img 
                  src={restaurant.hero_image || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1920&q=80'}
                  alt={restaurant.name}
                  className="w-full h-[360px] object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        )}

        {layout === 'minimal' && (
          <div className="py-12 text-center max-w-3xl mx-auto space-y-6">
            <span 
              className="text-[11px] font-mono uppercase tracking-widest block font-bold"
              style={{ color: accentColor }}
            >
              {meta.tagline}
            </span>
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
              {restaurant.name}
            </h1>
            <p className="text-sm text-zinc-300 leading-relaxed max-w-xl mx-auto">
              {restaurant.slogan || restaurant.description}
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setIsBookingOpen(true)}
                className={`px-7 py-3.5 ${meta.buttonShape} font-bold text-xs shadow-2xl hover:brightness-110`}
                style={{
                  backgroundColor: primaryColor,
                  color: '#000000',
                  boxShadow: `0 0 25px ${primaryColor}40`
                }}
              >
                <span>Reservar Mesa Online</span>
              </button>
              <a
                href="#carta"
                className={`px-6 py-3.5 ${meta.buttonShape} border border-white/15 bg-zinc-900/60 text-white text-xs font-semibold`}
              >
                <span>Ver Carta Digital</span>
              </a>
            </div>
          </div>
        )}
      </section>

      {/* Info & Ambiance Strip */}
      <section className="border-y border-white/5 py-6 bg-black/40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block font-mono">Horarios</span>
              <span className="text-zinc-200 font-semibold">
                {restaurant.dinner_shift?.enabled ? `Cenas ${restaurant.dinner_shift.open} - ${restaurant.dinner_shift.close}` : 'Abierto según reserva'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block font-mono">Ubicación</span>
              <span className="text-zinc-200 font-semibold">{restaurant.city || 'Huelva'}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block font-mono">Contacto</span>
              <span className="text-zinc-200 font-semibold">{restaurant.phone || '+34 959 10 20 30'}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-zinc-400 shrink-0" />
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block font-mono">Reserva</span>
              <span className="text-emerald-400 font-semibold">Confirmación Inmediata</span>
            </div>
          </div>
        </div>
      </section>

      {/* Digital Menu (Carta Digital) */}
      <section id="carta" className="py-16 px-4 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div 
              className="text-[11px] font-mono uppercase tracking-widest font-bold mb-1"
              style={{ color: accentColor }}
            >
              Selección Exclusiva
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Nuestra Carta
            </h2>
          </div>

          {/* Category Tabs */}
          {categories.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat, idx) => (
                <button
                  key={cat.id || idx}
                  onClick={() => setActiveCategory(idx)}
                  className={`px-4 py-2 text-xs font-semibold whitespace-nowrap transition ${meta.buttonShape} ${
                    activeCategory === idx 
                      ? 'text-black' 
                      : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-zinc-200'
                  }`}
                  style={activeCategory === idx ? { backgroundColor: primaryColor } : {}}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Menu Items Grid */}
        {categories.length > 0 && categories[activeCategory] && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(categories[activeCategory].items || []).map((item, itIdx) => (
              <div 
                key={item.id || itIdx}
                className={`p-5 rounded-2xl border transition group hover:-translate-y-0.5 ${meta.cardBorder}`}
                style={{ backgroundColor: surfaceColor }}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-sm sm:text-base group-hover:text-zinc-100">
                        {item.name}
                      </h3>
                      {item.badge && (
                        <span 
                          className={`text-[9px] px-2 py-0.5 ${meta.badgeShape} font-mono font-bold uppercase tracking-wider`}
                          style={{
                            backgroundColor: `${primaryColor}20`,
                            color: accentColor,
                            border: `1px solid ${primaryColor}40`
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <div 
                    className="font-mono font-extrabold text-base sm:text-lg shrink-0"
                    style={{ color: primaryColor }}
                  >
                    {typeof item.price === 'number' ? item.price.toFixed(2) : item.price}€
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Booking CTA Strip */}
      <section className="py-14 px-4 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="max-w-4xl mx-auto text-center space-y-5 p-8 sm:p-12 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl">
          <IconComponent className="w-8 h-8 mx-auto" style={{ color: primaryColor }} />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            ¿Quieres vivir la experiencia en {restaurant.name}?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Reserva tu mesa en segundos sin intermediarios ni costes extra. Confirmación directa en tu pantalla.
          </p>
          <button
            onClick={() => setIsBookingOpen(true)}
            className={`px-8 py-3.5 ${meta.buttonShape} text-xs font-extrabold transition shadow-2xl hover:brightness-110 active:scale-95`}
            style={{
              backgroundColor: primaryColor,
              color: '#000000',
              boxShadow: `0 0 30px ${primaryColor}50`
            }}
          >
            Reservar Ahora
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-4 text-center text-xs text-zinc-500 bg-black/80">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-300">{restaurant.name}</span>
            <span>•</span>
            <span>{restaurant.address || 'Huelva'}</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            {restaurant.google_maps_url && (
              <a href={restaurant.google_maps_url} target="_blank" rel="noreferrer" className="hover:text-white transition">
                Google Maps
              </a>
            )}
            {restaurant.instagram_url && (
              <a href={restaurant.instagram_url} target="_blank" rel="noreferrer" className="hover:text-white transition">
                Instagram
              </a>
            )}
            <a 
              href="https://tecnodiel.com" 
              target="_blank" 
              rel="noreferrer" 
              className="text-zinc-500 hover:text-emerald-400 transition font-mono text-[10px]"
            >
              TecnOdiel Engine
            </a>
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      {isBookingOpen && (
        <BookingModal 
          restaurant={restaurant}
          onClose={() => setIsBookingOpen(false)}
        />
      )}
    </div>
  );
}
