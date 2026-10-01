import React, { useState } from 'react';
import { 
  Wine, Utensils, Flame, Sparkles, Coffee, Fish, Pizza, Beer, 
  Palmtree, Gem, Crown, Compass, Waves, Sun, Moon, Zap, 
  ShieldCheck, MapPin, Phone, Instagram, Calendar, Clock, 
  ChevronRight, ArrowUpRight, Check, Heart, Award, Star, GlassWater,
  Thermometer, Gauge, Tag, Info, Terminal, Radio, Eye, Layers
} from 'lucide-react';
import BookingModal from '../Booking/BookingModal';
import { normalizeTemplateId } from './templateNormalizer';

// Template metadata definitions
export const TEMPLATE_THEMES = {
  nocturne: {
    icon: Wine,
    tagline: 'Mixología & Noche Exclusiva',
    badgeText: 'Experiencia Nocturna de Autor',
    styleClass: 'theme-nocturne',
    archetype: 'michelin_haute',
    cardBorder: 'border-white/10 hover:border-amber-400/40',
    buttonShape: 'rounded-xl',
    badgeShape: 'rounded-full'
  },
  minimalist: {
    icon: Utensils,
    tagline: 'Minimalismo Nórdico & Producto',
    badgeText: 'Paz Visual & Cocina Cuidada',
    styleClass: 'theme-minimal',
    archetype: 'default_elegance',
    cardBorder: 'border-zinc-800 hover:border-zinc-500',
    buttonShape: 'rounded-md',
    badgeShape: 'rounded-sm'
  },
  brutalist: {
    icon: Zap,
    tagline: 'Underground & Street Vibe',
    badgeText: 'Energía Sin Filtros',
    styleClass: 'theme-brutalist',
    archetype: 'street_smash',
    cardBorder: 'border-2 border-lime-400 shadow-[4px_4px_0px_#ccff00]',
    buttonShape: 'rounded-none uppercase tracking-widest font-black',
    badgeShape: 'rounded-none'
  },
  artisan: {
    icon: Flame,
    tagline: 'Horno de Leña & Fuego Lento',
    badgeText: 'Tradición, Madera & Brasa',
    styleClass: 'theme-artisan',
    archetype: 'asador_prime',
    cardBorder: 'border-amber-900/40 hover:border-orange-500/50',
    buttonShape: 'rounded-2xl',
    badgeShape: 'rounded-full'
  },
  velvet: {
    icon: GlassWater,
    tagline: 'Terciopelo, Jazz & Clandestino',
    badgeText: 'Velvet Speakeasy & Burdeos',
    styleClass: 'theme-velvet',
    archetype: 'bistro_paris',
    cardBorder: 'border-rose-900/30 hover:border-rose-500/40',
    buttonShape: 'rounded-xl',
    badgeShape: 'rounded-full'
  },
  cyberpunk: {
    icon: Zap,
    tagline: 'Cyber Neon & Experimental Bar',
    badgeText: 'Sintético // 2077 Night Hub',
    styleClass: 'theme-cyberpunk',
    archetype: 'cyber_hud',
    cardBorder: 'border border-cyan-500/40 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]',
    buttonShape: 'rounded-none font-mono uppercase tracking-wider',
    badgeShape: 'rounded-none font-mono'
  },
  tokyo_omakase: {
    icon: Moon,
    tagline: 'Barra Omakase & Minimalismo Zen',
    badgeText: 'Omakase del Chef // 東京 • 職人',
    styleClass: 'theme-omakase',
    archetype: 'omakase',
    cardBorder: 'border-stone-800 hover:border-stone-600',
    buttonShape: 'rounded-sm tracking-widest',
    badgeShape: 'rounded-none'
  },
  mediterranean_breeze: {
    icon: Waves,
    tagline: 'Brisa Marina & Arroces de Costa',
    badgeText: 'Sabor a Mar, Salitre & Arroz',
    styleClass: 'theme-mediterranean',
    archetype: 'coastal_lonja',
    cardBorder: 'border-sky-900/40 hover:border-sky-400/50',
    buttonShape: 'rounded-2xl',
    badgeShape: 'rounded-full'
  },
  bistro_parisien: {
    icon: Award,
    tagline: 'Bistró Clásico & Café de Época',
    badgeText: 'Haute Cuisine & Accord Vins',
    styleClass: 'theme-bistro',
    archetype: 'bistro_paris',
    cardBorder: 'border-amber-900/40 hover:border-amber-400/60',
    buttonShape: 'rounded-xl font-serif',
    badgeShape: 'rounded-full'
  },
  urban_street_smash: {
    icon: Flame,
    tagline: 'Smash Burgers & Streetwear',
    badgeText: '100% Carne Crujiente // Costra Maillard',
    styleClass: 'theme-smash',
    archetype: 'street_smash',
    cardBorder: 'border-2 border-orange-500/60 hover:border-orange-400 shadow-[4px_4px_0px_#f97316]',
    buttonShape: 'rounded-xl font-black uppercase tracking-wider',
    badgeShape: 'rounded-lg'
  },
  tapas_andaluzas: {
    icon: Sun,
    tagline: 'Taberna de Solera & Jamón Ibérico',
    badgeText: 'Albero, Guitarras & Tapas del Sur',
    styleClass: 'theme-tapas',
    archetype: 'taberna_iberica',
    cardBorder: 'border-amber-800/40 hover:border-amber-400/60',
    buttonShape: 'rounded-xl',
    badgeShape: 'rounded-full'
  },
  steakhouse_asador: {
    icon: Flame,
    tagline: 'Asador Prime & Cortes Madurados',
    badgeText: 'Carbón Vegetal & Dry Aged 60 Días',
    styleClass: 'theme-steakhouse',
    archetype: 'asador_prime',
    cardBorder: 'border-red-950 hover:border-red-600/60',
    buttonShape: 'rounded-xl font-bold uppercase',
    badgeShape: 'rounded-md'
  },
  pasticceria_dolce: {
    icon: Heart,
    tagline: 'Pastelería Boutique & Desayunos Dolce',
    badgeText: 'Crema Pastelera & Café de Ensueño',
    styleClass: 'theme-dolce',
    archetype: 'specialty_coffee',
    cardBorder: 'border-pink-900/30 hover:border-pink-400/50',
    buttonShape: 'rounded-full',
    badgeShape: 'rounded-full'
  },
  botanical_garden: {
    icon: Sparkles,
    tagline: 'Cocina Verde, Orgánica & Vital',
    badgeText: 'Del Huerto a la Mesa // Km 0',
    styleClass: 'theme-botanical',
    archetype: 'botanical_organic',
    cardBorder: 'border-emerald-900/40 hover:border-emerald-400/60',
    buttonShape: 'rounded-2xl',
    badgeShape: 'rounded-full'
  },
  rooftop_sunset: {
    icon: Sun,
    tagline: 'Sky Lounge & Cócteles al Atardecer',
    badgeText: 'Vistas Panorámicas // Golden Hour',
    styleClass: 'theme-rooftop',
    archetype: 'sunset_beach',
    cardBorder: 'border-purple-900/30 hover:border-amber-400/50',
    buttonShape: 'rounded-2xl',
    badgeShape: 'rounded-full'
  },
  trattoria_italiana: {
    icon: Utensils,
    tagline: 'Auténtica Cocina Toscana & Pasta Fresca',
    badgeText: 'Tradizione di Famiglia & Chianti',
    styleClass: 'theme-trattoria',
    archetype: 'pizzeria_napoli',
    cardBorder: 'border-green-950 hover:border-emerald-600/50',
    buttonShape: 'rounded-xl font-serif',
    badgeShape: 'rounded-full'
  },
  cerveceria_craft: {
    icon: Beer,
    tagline: 'Fábrica de Cerveza & Taproom',
    badgeText: '12 Grifos Artesanales // Lúpulo Fresco',
    styleClass: 'theme-brewery',
    archetype: 'craft_brewery',
    cardBorder: 'border-amber-900/40 hover:border-amber-500/60',
    buttonShape: 'rounded-lg uppercase font-bold',
    badgeShape: 'rounded-md'
  },
  marisqueria_costera: {
    icon: Fish,
    tagline: 'Marisquería de Lonja & Gamba Blanca',
    badgeText: 'Subasta Matinal // Costa de Huelva',
    styleClass: 'theme-marisqueria',
    archetype: 'coastal_lonja',
    cardBorder: 'border-cyan-900/40 hover:border-cyan-400/60',
    buttonShape: 'rounded-xl',
    badgeShape: 'rounded-full'
  },
  taqueria_fiesta: {
    icon: Flame,
    tagline: 'Tacos al Pastor, Cantina & Mezcal',
    badgeText: '¡Viva el Sabor! // Tortilla a Mano',
    styleClass: 'theme-taqueria',
    archetype: 'taqueria_mexicana',
    cardBorder: 'border-lime-900/40 hover:border-lime-400/60 shadow-[3px_3px_0px_#84cc16]',
    buttonShape: 'rounded-xl font-bold uppercase',
    badgeShape: 'rounded-md'
  },
  coffee_specialty: {
    icon: Coffee,
    tagline: 'Tostadero & Café de Especialidad',
    badgeText: 'Granos de Finca // Extracción 9 Bar',
    styleClass: 'theme-coffee',
    archetype: 'specialty_coffee',
    cardBorder: 'border-amber-950 hover:border-amber-600/50',
    buttonShape: 'rounded-xl',
    badgeShape: 'rounded-full'
  },
  gelato_artesanal: {
    icon: Heart,
    tagline: 'Gelato Italiano & Crepes de Autor',
    badgeText: 'Mantecado Diario // 100% Natural',
    styleClass: 'theme-gelato',
    archetype: 'specialty_coffee',
    cardBorder: 'border-teal-900/30 hover:border-teal-400/50',
    buttonShape: 'rounded-2xl',
    badgeShape: 'rounded-full'
  },
  pizzeria_napolitana: {
    icon: Pizza,
    tagline: 'Pizzería Napolitana & Horno de Leña',
    badgeText: 'Fermentación 48h // Vera Pizza DOP',
    styleClass: 'theme-pizzeria',
    archetype: 'pizzeria_napoli',
    cardBorder: 'border-red-900/40 hover:border-orange-500/60',
    buttonShape: 'rounded-xl',
    badgeShape: 'rounded-full'
  },
  lounge_shisha: {
    icon: Moon,
    tagline: 'Tetería VIP, Shishas & Arabian Nights',
    badgeText: 'Atmósfera Mística & Reservados Exclusivos',
    styleClass: 'theme-shisha',
    archetype: 'sunset_beach',
    cardBorder: 'border-purple-900/40 hover:border-amber-400/60',
    buttonShape: 'rounded-2xl',
    badgeShape: 'rounded-full'
  },
  beach_club: {
    icon: Palmtree,
    tagline: 'Beach Club, Balinesas & Puestas de Sol',
    badgeText: 'Oasis Balear // DJ Sessions & Marisco',
    styleClass: 'theme-beach',
    archetype: 'sunset_beach',
    cardBorder: 'border-cyan-900/40 hover:border-amber-400/50',
    buttonShape: 'rounded-2xl',
    badgeShape: 'rounded-full'
  },
  gourmet_vanguardia: {
    icon: Gem,
    tagline: 'Vanguardia Molecular & Menú Degustación',
    badgeText: 'Criterio Michelin // Haute Cuisine Emocional',
    styleClass: 'theme-vanguardia',
    archetype: 'michelin_haute',
    cardBorder: 'border-zinc-800 hover:border-zinc-400',
    buttonShape: 'rounded-none tracking-widest uppercase text-xs',
    badgeShape: 'rounded-none'
  },
  wok_asian_fusion: {
    icon: Flame,
    tagline: 'Wok Street Food, Bao & Ramen',
    badgeText: 'Fuego al Wok // Callejón Nocturno',
    styleClass: 'theme-wok',
    archetype: 'street_smash',
    cardBorder: 'border-red-900/50 hover:border-red-500/70',
    buttonShape: 'rounded-lg font-bold uppercase',
    badgeShape: 'rounded-md'
  },
  churreria_tradicional: {
    icon: Coffee,
    tagline: 'Chocolatería Castiza & Porras de Rueda',
    badgeText: 'Masa de Madrugada & Chocolate a la Taza',
    styleClass: 'theme-churreria',
    archetype: 'taberna_iberica',
    cardBorder: 'border-amber-950 hover:border-amber-500/60',
    buttonShape: 'rounded-xl',
    badgeShape: 'rounded-full'
  },
  bodega_enoteca: {
    icon: Crown,
    tagline: 'Bodega Centenaria & Cata de Vinos',
    badgeText: 'Roble Francés & Soleras Centenarias',
    styleClass: 'theme-bodega',
    archetype: 'taberna_iberica',
    cardBorder: 'border-red-950 hover:border-amber-600/50',
    buttonShape: 'rounded-xl font-serif',
    badgeShape: 'rounded-full'
  },
  pulperia_gallega: {
    icon: Compass,
    tagline: 'Pulpería de Ría & Tradición Gallega',
    badgeText: 'Pulpo á Feira & Cunca de Albariño',
    styleClass: 'theme-pulperia',
    archetype: 'taberna_iberica',
    cardBorder: 'border-zinc-800 hover:border-red-600/60',
    buttonShape: 'rounded-xl',
    badgeShape: 'rounded-full'
  },
  tecnodiel_elite: {
    icon: Sparkles,
    tagline: 'Firma TecnOdiel Cyber Luxury',
    badgeText: 'Digital Engine // Ultra Performance',
    styleClass: 'theme-tecnodiel',
    archetype: 'cyber_luxury',
    cardBorder: 'border-emerald-500/30 hover:border-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.35)]',
    buttonShape: 'rounded-xl font-mono',
    badgeShape: 'rounded-full'
  }
};

export function getTemplateArchetype(templateId) {
  const meta = TEMPLATE_THEMES[templateId];
  return meta?.archetype || 'default_elegance';
}

export default function DynamicThemedTemplate({ restaurant = {}, isPreview = false }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);

  const rawId = restaurant?.template_id;
  const templateId = normalizeTemplateId(rawId);
  const meta = TEMPLATE_THEMES[templateId] || TEMPLATE_THEMES.nocturne;
  const archetype = getTemplateArchetype(templateId);
  const IconComponent = meta.icon || Wine;

  const primaryColor = restaurant?.primary_color || meta.defaultPrimary || '#f59e0b';
  const accentColor = restaurant?.accent_color || meta.defaultAccent || '#fbbf24';
  const bgColor = restaurant?.background_color || meta.defaultBg || '#050507';
  const surfaceColor = restaurant?.surface_color || meta.defaultSurface || '#0d0d12';
  const categories = Array.isArray(restaurant?.menu_categories) ? restaurant.menu_categories : [];

  const heroImage = restaurant?.hero_image || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1920&q=80';

  return (
    <div 
      className="min-h-screen text-zinc-100 selection:bg-white selection:text-black relative overflow-x-hidden font-sans"
      style={{ backgroundColor: bgColor }}
    >
      {/* ─────────────────────────────────────────────────────────────
          ARCHETYPE-SPECIFIC ATMOSPHERIC BACKGROUND EFFECTS
         ───────────────────────────────────────────────────────────── */}
      {archetype === 'omakase' && (
        <>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-stone-900/30 rounded-full blur-[160px] pointer-events-none" />
          <div className="absolute top-20 right-6 text-[140px] font-black text-white/[0.02] select-none pointer-events-none font-serif leading-none">
            旬
          </div>
        </>
      )}

      {archetype === 'street_smash' && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle, ${primaryColor} 1.5px, transparent 1.5px)`,
            backgroundSize: '24px 24px'
          }}
        />
      )}

      {archetype === 'cyber_hud' && (
        <>
          <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `linear-gradient(to right, ${primaryColor}25 1px, transparent 1px), linear-gradient(to bottom, ${primaryColor}25 1px, transparent 1px)`,
              backgroundSize: '32px 32px'
            }}
          />
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06b6d4]" />
        </>
      )}

      {archetype === 'coastal_lonja' && (
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none opacity-20 blur-[130px]"
          style={{ background: `radial-gradient(circle, #0284c7 0%, #0369a1 40%, transparent 80%)` }}
        />
      )}

      {archetype === 'asador_prime' && (
        <div 
          className="absolute top-0 right-1/4 w-96 h-96 rounded-full pointer-events-none opacity-25 blur-[120px]"
          style={{ background: `radial-gradient(circle, #ea580c 0%, #7c2d12 50%, transparent 80%)` }}
        />
      )}

      {archetype === 'bistro_paris' && (
        <div className="absolute inset-0 bg-radial-vignette opacity-50 pointer-events-none" />
      )}

      {/* ─────────────────────────────────────────────────────────────
          GLOBAL NAVIGATION HEADER (BESPOKE BY ARCHETYPE)
         ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-white/10 backdrop-blur-2xl bg-black/85">
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
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-white block text-sm sm:text-base leading-tight">
                  {restaurant.name}
                </span>
                {archetype === 'cyber_hud' && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 border border-cyan-500/40 text-cyan-400 bg-cyan-950/40">
                    SYS.V2
                  </span>
                )}
                {archetype === 'omakase' && (
                  <span className="text-[10px] text-zinc-400 font-serif tracking-widest hidden sm:inline">
                    東京
                  </span>
                )}
              </div>
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

      {/* ─────────────────────────────────────────────────────────────
          BESPOKE HERO ARCHETYPE 1: TOKYO OMAKASE (ZEN WABI-SABI)
         ───────────────────────────────────────────────────────────── */}
      {archetype === 'omakase' && (
        <section className="relative pt-12 pb-16 px-4 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-stone-800 bg-stone-950/70 p-6 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-2 right-4 text-xs font-mono tracking-widest text-stone-600 uppercase">
              // EDOMAE TRADITION • 一期一会
            </div>
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-stone-700 bg-stone-900 text-stone-300 text-[10px] font-mono uppercase tracking-widest">
                <Moon className="w-3.5 h-3.5 text-stone-400" />
                <span>Barra Omakase • Máximo 10 Comensales</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-light text-stone-100 tracking-tight leading-tight">
                {restaurant.slogan || `${restaurant.name}`}
              </h1>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-lg font-light">
                {restaurant.description || 'La experiencia Omakase confía el menú por completo a las manos del Shokunin. Producto puro, arroz cocido con vinagre rojo akazu y corte exacto al milímetro.'}
              </p>
              
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="px-6 py-3.5 bg-stone-100 hover:bg-white text-stone-950 font-bold text-xs tracking-wider uppercase transition shadow-xl"
                >
                  Reservar Pase de Barra
                </button>
                <a
                  href="#carta"
                  className="px-5 py-3.5 border border-stone-700 text-stone-300 hover:text-white hover:border-stone-500 text-xs tracking-wider uppercase transition"
                >
                  Ver Secuencia de Pases
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative border border-stone-800 p-2 bg-stone-900/60 shadow-2xl">
                <img 
                  src={heroImage} 
                  alt={restaurant.name}
                  className="w-full h-[380px] object-cover filter contrast-105"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-black/85 backdrop-blur-md p-3 border border-stone-800 text-[11px] font-mono text-stone-300 flex items-center justify-between">
                  <span>CORTE DEL DÍA: O-TORO DE ALMADRABA</span>
                  <span className="text-amber-400 font-bold">TEMPERATURA 36.5°C</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          BESPOKE HERO ARCHETYPE 2: STREET SMASH & WOK (KINETIC / RETRO DINER)
         ───────────────────────────────────────────────────────────── */}
      {archetype === 'street_smash' && (
        <section className="relative pt-6 pb-12 px-4 max-w-6xl mx-auto">
          {/* Kinetic Marquee Ticker */}
          <div className="mb-6 overflow-hidden rounded-xl bg-orange-500 text-black py-2.5 font-black uppercase text-xs tracking-widest shadow-lg flex items-center whitespace-nowrap">
            <div className="flex items-center gap-8 animate-marquee">
              <span>🔥 100% CARNE DE VACA MADURADA</span>
              <span>•</span>
              <span>SMASH CRUNCHY EDGES</span>
              <span>•</span>
              <span>PAN BRIOCHE DE MANTEQUILLA</span>
              <span>•</span>
              <span>DOUBLE CHEESE MELT</span>
              <span>•</span>
              <span>PATATAS CORTE CASERO TRIPLE COCCIÓN</span>
              <span>•</span>
              <span>🔥 PEDIDOS ONLINE & TAKE AWAY</span>
            </div>
          </div>

          <div className="relative rounded-3xl border-2 border-orange-500/60 bg-zinc-950 p-6 sm:p-12 shadow-[8px_8px_0px_#f97316] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-orange-500/20 border border-orange-500 text-orange-400 text-xs font-black uppercase tracking-wider">
                  <Flame className="w-4 h-4 fill-orange-400" />
                  <span>SMASH CULTURE // CRUNCHY EDGES</span>
                </div>
                <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight leading-none">
                  {restaurant.slogan || restaurant.name}
                </h1>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-lg font-medium">
                  {restaurant.description || 'Carne picada fresca a diario en el local, aplastada a fuego vivo a 260°C para lograr la auténtica reacción Maillard. Crujiente por fuera, jugo puro por dentro.'}
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setIsBookingOpen(true)}
                    className="px-6 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-black text-xs uppercase tracking-wider transition shadow-lg active:translate-y-1"
                  >
                    ¡Pedir Mesa / Comer Aquí!
                  </button>
                  <a
                    href="#carta"
                    className="px-5 py-3.5 rounded-xl border-2 border-white/20 hover:border-white text-white font-bold text-xs uppercase transition"
                  >
                    Ver Burgers & Combos
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl">
                  <img 
                    src={heroImage} 
                    alt={restaurant.name}
                    className="w-full h-[320px] object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-yellow-400 text-black font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider rotate-3 shadow-md">
                    ★ Best Seller
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          BESPOKE HERO ARCHETYPE 3: COASTAL LONJA (MEDITERRÁNEO & MAR)
         ───────────────────────────────────────────────────────────── */}
      {archetype === 'coastal_lonja' && (
        <section className="relative pt-10 pb-16 px-4 max-w-6xl mx-auto">
          <div className="rounded-3xl border border-sky-800/60 bg-gradient-to-b from-sky-950/50 to-zinc-950 p-6 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-4 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/40 bg-sky-500/10 text-sky-300 text-xs font-mono">
                  <Fish className="w-3.5 h-3.5 text-sky-400" />
                  <span>Pesca del Día // Subasta de Lonja 06:00 AM</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                  {restaurant.slogan || restaurant.name}
                </h1>
                <p className="text-xs sm:text-sm text-sky-100/70 leading-relaxed">
                  {restaurant.description || 'Gamba blanca de la costa, carabineros de profundidad, arroces en su punto exacto al fuego y pescados salvajes a la sal o a la brasa.'}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setIsBookingOpen(true)}
                    className="px-6 py-3 rounded-2xl bg-sky-400 hover:bg-sky-300 text-black font-bold text-xs transition shadow-[0_0_20px_rgba(56,189,248,0.4)]"
                  >
                    Reservar Mesa con Salitre
                  </button>
                  <a
                    href="#carta"
                    className="px-5 py-3 rounded-2xl border border-sky-500/30 bg-sky-950/40 text-sky-200 text-xs font-semibold hover:border-sky-400 transition"
                  >
                    Pizarra de la Lonja
                  </a>
                </div>
              </div>

              <div className="w-full lg:w-96 rounded-2xl overflow-hidden border border-sky-700/40 shadow-2xl shrink-0">
                <img 
                  src={heroImage} 
                  alt={restaurant.name}
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          BESPOKE HERO ARCHETYPE 4: CYBERPUNK HUD (SCI-FI TERMINAL)
         ───────────────────────────────────────────────────────────── */}
      {archetype === 'cyber_hud' && (
        <section className="relative pt-8 pb-14 px-4 max-w-6xl mx-auto font-mono">
          <div className="border border-cyan-500/50 bg-black/90 p-5 sm:p-10 shadow-[0_0_30px_rgba(6,182,212,0.25)] relative">
            {/* HUD Corner Accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

            <div className="flex items-center justify-between text-[10px] text-cyan-400 border-b border-cyan-500/20 pb-3 mb-6">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3 h-3 animate-pulse text-cyan-400" />
                TERMINAL://LINK_ACTIVE [NODE: 2077_HUELVA]
              </span>
              <span className="text-zinc-500">LAT: 37.2614° N • LON: -6.9447° W</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-block px-2.5 py-1 bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-[11px] uppercase tracking-wider">
                  [ PROTOCOLO MIXOLOGÍA EXPERIMENTAL ]
                </div>
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-wider uppercase">
                  {restaurant.slogan || restaurant.name}
                </h1>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-md font-sans">
                  {restaurant.description || 'Infusiones criogénicas, destilados ultrasónicos y gastronomía sintética de alta fidelidad sensorial. Bienvenido al futuro de la noche.'}
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setIsBookingOpen(true)}
                    className="px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs uppercase tracking-widest transition shadow-[0_0_20px_#06b6d4]"
                  >
                    [ INICIAR_RESERVA ]
                  </button>
                  <a
                    href="#carta"
                    className="px-5 py-3 border border-cyan-500/50 bg-black text-cyan-400 hover:bg-cyan-950/40 text-xs uppercase tracking-wider transition"
                  >
                    [ VER_REGISTRO_CARTA ]
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 relative">
                <div className="relative border border-cyan-500/40 p-1 bg-zinc-950">
                  <img 
                    src={heroImage} 
                    alt={restaurant.name}
                    className="w-full h-64 object-cover filter brightness-90 contrast-125"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-2 left-2 text-[9px] text-cyan-400 font-mono">
                    STATUS: OPTIMAL_ATMOSPHERE
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          BESPOKE HERO ARCHETYPE 5: BISTRO PARISIEN (ART DÉCO & GOLD)
         ───────────────────────────────────────────────────────────── */}
      {archetype === 'bistro_paris' && (
        <section className="relative pt-12 pb-16 px-4 max-w-5xl mx-auto text-center font-serif">
          <div className="p-8 sm:p-14 border border-amber-600/30 bg-[#06140e] rounded-2xl shadow-2xl relative">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-amber-400 font-sans block mb-2 font-semibold">
              Maison de Cuisine & Sommelier
            </span>
            <h1 className="text-4xl sm:text-6xl font-normal text-amber-100 tracking-normal mb-4">
              {restaurant.name}
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto font-sans leading-relaxed mb-6 font-light">
              {restaurant.description || 'Un homenaje a la elegancia clásica parisina, donde cada salsa se elabora a fuego pausado durante 24 horas y cada copa se marida con precisión.'}
            </p>
            <div className="flex justify-center gap-4 pt-2 font-sans">
              <button
                onClick={() => setIsBookingOpen(true)}
                className="px-7 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider transition shadow-xl"
              >
                Réserver Une Table
              </button>
              <a
                href="#carta"
                className="px-6 py-3 rounded-xl border border-amber-500/40 text-amber-200 hover:border-amber-400 text-xs font-semibold transition"
              >
                Consulter La Carte
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          BESPOKE HERO ARCHETYPE 6: ASADOR PRIME (EMBER & DRY AGED)
         ───────────────────────────────────────────────────────────── */}
      {archetype === 'asador_prime' && (
        <section className="relative pt-10 pb-16 px-4 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-zinc-950 border border-red-950/80 p-6 sm:p-12 rounded-2xl shadow-2xl">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-950/60 border border-red-600/50 text-red-400 text-xs font-mono uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 text-red-500" />
                <span>CÁMARA DRY AGED // CORTES SELECCIONADOS</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
                {restaurant.slogan || restaurant.name}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-lg">
                {restaurant.description || 'Carbón vegetal de encina a 400°C, maduraciones controladas desde 45 hasta 90 días, y el respeto más puro por la infiltración de grasa y el chuletón de raza.'}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider transition shadow-[0_0_25px_rgba(220,38,38,0.5)]"
                >
                  Reservar Mesa de Brasa
                </button>
                <a
                  href="#carta"
                  className="px-5 py-3.5 rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-200 text-xs font-bold uppercase hover:border-zinc-500 transition"
                >
                  Ver Cortes & Maduración
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="rounded-xl overflow-hidden border border-red-900/60 shadow-2xl relative">
                <img 
                  src={heroImage} 
                  alt={restaurant.name}
                  className="w-full h-80 object-cover filter contrast-110"
                />
                <div className="absolute bottom-3 left-3 right-3 bg-black/90 p-3 rounded-lg border border-red-900/40 text-[11px] font-mono text-zinc-300 flex justify-between items-center">
                  <span>MADURACIÓN CÁMARA 1:</span>
                  <span className="text-red-400 font-bold">60 DÍAS • BMS 7</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          BESPOKE HERO ARCHETYPE 7: SUNSET BEACH & ROOFTOP
         ───────────────────────────────────────────────────────────── */}
      {archetype === 'sunset_beach' && (
        <section className="relative pt-10 pb-16 px-4 max-w-6xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden border border-purple-900/40 bg-gradient-to-tr from-zinc-950 via-purple-950/30 to-amber-950/20 p-6 sm:p-14 shadow-2xl">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-300 text-xs font-medium">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Golden Hour // Vistas Panorámicas & Balinesas</span>
              </div>
              <h1 className="text-3xl sm:text-6xl font-extrabold text-white tracking-tight">
                {restaurant.slogan || restaurant.name}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-lg">
                {restaurant.description || 'El punto de encuentro exclusivo para despedir el día frente al mar o sobre las alturas de la ciudad, con coctelería de autor y música selecta.'}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-400 to-rose-500 hover:brightness-110 text-black font-extrabold text-xs transition shadow-2xl"
                >
                  Reservar Balinesa / Mesa VIP
                </button>
                <a
                  href="#carta"
                  className="px-5 py-3.5 rounded-full border border-white/20 bg-white/5 text-white text-xs font-semibold hover:border-white/40 transition"
                >
                  Carta de Cócteles & Botellas
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          BESPOKE HERO ARCHETYPE 8: GENERAL ELEGANT FALLBACK
         ───────────────────────────────────────────────────────────── */}
      {(!['omakase', 'street_smash', 'coastal_lonja', 'cyber_hud', 'asador_prime', 'bistro_paris', 'sunset_beach'].includes(archetype)) && (
        <section className="relative pt-8 sm:pt-12 pb-16 px-4 max-w-6xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-14 min-h-[440px] flex flex-col justify-end shadow-2xl">
            <div 
              className="absolute inset-0 bg-cover bg-center -z-10 scale-105 transition duration-1000"
              style={{ backgroundImage: `url(${heroImage})` }}
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
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          ARCHETYPE SIGNATURE INTERACTIVE WIDGET
         ───────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 mb-12">
        {archetype === 'omakase' && (
          <div className="p-6 border border-stone-800 bg-stone-950 rounded-xl space-y-3 font-mono text-xs text-stone-300">
            <div className="flex items-center gap-2 text-stone-400 font-bold uppercase tracking-wider text-[11px]">
              <Info className="w-4 h-4 text-stone-400" />
              <span>NORMAS DE ETIQUETA EN LA BARRA OMAKASE:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-stone-400 text-[11px] pt-1">
              <div className="p-3 bg-stone-900/60 border border-stone-800">
                <span className="text-white font-bold block mb-1">1. TIEMPO DE DEGUSTACIÓN</span>
                Deguste el nigiri en los primeros 10 segundos tras ser posado en el geta de piedra para conservar la temperatura del arroz.
              </div>
              <div className="p-3 bg-stone-900/60 border border-stone-800">
                <span className="text-white font-bold block mb-1">2. WASABI Y SOJA DE AUTOR</span>
                Cada pieza viene condimentada y cepillada con nikiri shoyu por el Shokunin. No sumerja el arroz en soja adicional.
              </div>
              <div className="p-3 bg-stone-900/60 border border-stone-800">
                <span className="text-white font-bold block mb-1">3. MANO O PALILLOS</span>
                Es bienvenido degustar el nigiri directamente con los dedos para apreciar la textura aireada del grano cocido.
              </div>
            </div>
          </div>
        )}

        {archetype === 'street_smash' && (
          <div className="p-6 rounded-2xl border-2 border-orange-500/40 bg-zinc-950 shadow-md">
            <div className="text-xs font-black uppercase text-orange-400 tracking-wider mb-2 flex items-center gap-2">
              <Flame className="w-4 h-4" />
              <span>LA FÓRMULA SMASH // PASO A PASO:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-orange-400 font-bold block">01. PICADO FRESCO</span>
                Blend propio de vacuno mayor, moldeado en bolas de 90g sin compactar.
              </div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-orange-400 font-bold block">02. PLANCHA 260°C</span>
                Espátula de acero inoxidable pesado y papel manteca a máxima presión.
              </div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-orange-400 font-bold block">03. COSTRA MAILLARD</span>
                Bordes ultrafinos crujientes con caramelización proteica explosiva.
              </div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-orange-400 font-bold block">04. CHEESE CLOCHE</span>
                Doble cheddar fundido al vapor bajo campana en 15 segundos.
              </div>
            </div>
          </div>
        )}

        {archetype === 'cyber_hud' && (
          <div className="p-4 border border-cyan-500/30 bg-black font-mono text-xs flex flex-wrap items-center justify-between gap-4 text-cyan-400">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>TELEMETRÍA EN DIRECTO: SALA SINTÉTICA AL 84% DE AFORO</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-zinc-400">
              <span>TEMP_SALA: 21.2°C</span>
              <span>BEAT: 124 BPM DEEP HOUSE</span>
              <span className="text-cyan-300 font-bold">RESERVAS ONLINE: DISPONIBLES</span>
            </div>
          </div>
        )}

        {archetype === 'asador_prime' && (
          <div className="p-5 rounded-xl border border-red-950 bg-black flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 text-red-400">
              <Gauge className="w-4 h-4 text-red-500" />
              <span>ESTADO DE CÁMARA DE MADURACIÓN:</span>
            </div>
            <div className="flex items-center gap-6 text-zinc-300 text-[11px]">
              <div>TEMPERATURA: <span className="text-white font-bold">1.8°C</span></div>
              <div>HUMEDAD: <span className="text-white font-bold">78%</span></div>
              <div>MADURACIÓN MÁXIMA HOY: <span className="text-red-400 font-bold">90 DÍAS RUBIA GALLEGA</span></div>
            </div>
          </div>
        )}

        {archetype === 'coastal_lonja' && (
          <div className="p-4 rounded-2xl border border-sky-900/50 bg-sky-950/20 flex flex-wrap items-center justify-between gap-3 text-xs text-sky-200">
            <div className="flex items-center gap-2">
              <Waves className="w-4 h-4 text-sky-400" />
              <span className="font-semibold">CALADERO DE HUELVA // MAREA BAJA 14:20H</span>
            </div>
            <span className="text-[11px] font-mono text-sky-400 bg-sky-950/60 px-3 py-1 rounded-full border border-sky-800">
              GARANTÍA DE PESCA DEL DÍA: 100% TRAZABILIDAD
            </span>
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          INFO STRIP (HOURS, ADDRESS, PHONE, BOOKING STATUS)
         ───────────────────────────────────────────────────────────── */}
      <section className="border-y border-white/5 py-6 bg-black/40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block font-mono">Horarios</span>
              <span className="text-zinc-200 font-semibold">
                {restaurant?.dinner_shift?.enabled ? `Cenas ${restaurant.dinner_shift.open || '19:30'} - ${restaurant.dinner_shift.close || '02:30'}` : 'Abierto según reserva'}
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

      {/* ─────────────────────────────────────────────────────────────
          BESPOKE DIGITAL MENU (CARTA DIGITAL) BY ARCHETYPE
         ───────────────────────────────────────────────────────────── */}
      <section id="carta" className="py-16 px-4 max-w-6xl mx-auto">
        {/* Category Navigation Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div 
              className="text-[11px] font-mono uppercase tracking-widest font-bold mb-1"
              style={{ color: accentColor }}
            >
              {archetype === 'omakase' ? 'SECUENCIA GASTRONÓMICA' : 
               archetype === 'street_smash' ? 'THE STREET MENU' : 
               archetype === 'coastal_lonja' ? 'TABLÓN DE LA LONJA' : 
               archetype === 'cyber_hud' ? 'DATA_INDEX // SELECTION' : 
               archetype === 'bistro_paris' ? "L'ARDOISE DU JOUR" : 'CARTA DIGITAL'}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {archetype === 'omakase' ? 'Propuesta Omakase' : 
               archetype === 'street_smash' ? 'Burgers, Sides & Shakes' : 
               archetype === 'coastal_lonja' ? 'Mariscos & Arroces de Costa' : 
               archetype === 'asador_prime' ? 'Nuestros Cortes & Brasa' : 'Nuestra Carta'}
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
                      ? 'text-black font-bold' 
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

        {/* ── ARCHETYPE MENU VARIANT 1: OMAKASE (DOTTED LEADERS & SEQUENTIAL) ── */}
        {archetype === 'omakase' && (
          <div className="border border-stone-800 bg-stone-950 p-6 sm:p-10 divide-y divide-stone-800">
            {categories.length > 0 && categories[activeCategory] && (categories[activeCategory].items || []).map((item, itIdx) => (
              <div key={item.id || itIdx} className="py-5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 group">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-stone-500 font-mono text-xs">{(itIdx + 1).toString().padStart(2, '0')}.</span>
                    <h3 className="font-serif text-lg text-stone-100 group-hover:text-amber-200 transition">
                      {item.name}
                    </h3>
                    {item.badge && (
                      <span className="text-[10px] font-mono px-2 py-0.5 border border-stone-700 text-stone-300">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-xs text-stone-400 font-light max-w-lg pl-7">
                      {item.description}
                    </p>
                  )}
                </div>
                <div className="font-mono text-stone-200 font-bold text-sm shrink-0 sm:text-right pl-7 sm:pl-0">
                  {typeof item.price === 'number' ? item.price.toFixed(2) : item.price}€
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── ARCHETYPE MENU VARIANT 2: STREET SMASH (POSTER CARDS WITH COMBO CHIPS) ── */}
        {archetype === 'street_smash' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.length > 0 && categories[activeCategory] && (categories[activeCategory].items || []).map((item, itIdx) => (
              <div 
                key={item.id || itIdx}
                className="p-5 rounded-2xl border-2 border-zinc-800 bg-zinc-950 hover:border-orange-500 transition shadow-[4px_4px_0px_rgba(249,115,22,0.3)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <h3 className="font-black uppercase text-base text-white tracking-wide">
                      {item.name}
                    </h3>
                    <span className="px-2.5 py-1 rounded-lg bg-orange-500 text-black font-black text-sm shrink-0">
                      {typeof item.price === 'number' ? item.price.toFixed(2) : item.price}€
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-xs text-zinc-400 font-medium leading-relaxed mb-3">
                      {item.description}
                    </p>
                  )}
                </div>
                <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                  <span>+3.50€ COMBO PATATAS & BEBIDA</span>
                  <span className="text-orange-400 font-bold">100% CARNE FRESCA</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── ARCHETYPE MENU VARIANT 3: CYBER HUD (TELEMETRY BOXES) ── */}
        {archetype === 'cyber_hud' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
            {categories.length > 0 && categories[activeCategory] && (categories[activeCategory].items || []).map((item, itIdx) => (
              <div 
                key={item.id || itIdx}
                className="p-4 border border-cyan-500/40 bg-zinc-950/80 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] transition relative"
              >
                <div className="flex justify-between items-start gap-4 mb-2">
                  <div>
                    <span className="text-[10px] text-cyan-400 block">// ITEM_ID: #{itIdx + 101}</span>
                    <h3 className="text-sm font-bold text-white tracking-wider uppercase">
                      {item.name}
                    </h3>
                  </div>
                  <div className="text-cyan-400 font-bold text-sm bg-cyan-950/60 px-2.5 py-1 border border-cyan-500/30">
                    {typeof item.price === 'number' ? item.price.toFixed(2) : item.price} EUR
                  </div>
                </div>
                {item.description && (
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-2">
                    {item.description}
                  </p>
                )}
                <div className="text-[9px] text-cyan-500/70 border-t border-cyan-950 pt-1 flex justify-between">
                  <span>SYNTHESIS: OPTIMIZED</span>
                  <span>SERV_TEMP: -4°C</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── ARCHETYPE MENU VARIANT 4: BISTRO PARISIEN (GOLD FILIGREE & WINE PAIRING) ── */}
        {archetype === 'bistro_paris' && (
          <div className="p-6 sm:p-10 border border-amber-600/30 bg-[#06140e] rounded-2xl shadow-xl font-serif">
            <div className="divide-y divide-amber-900/30">
              {categories.length > 0 && categories[activeCategory] && (categories[activeCategory].items || []).map((item, itIdx) => (
                <div key={item.id || itIdx} className="py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
                  <div>
                    <h3 className="text-base sm:text-lg text-amber-100 font-medium">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-stone-300 font-sans font-light mt-1 max-w-lg">
                        {item.description}
                      </p>
                    )}
                    <div className="mt-1 text-[11px] text-amber-400/80 font-sans flex items-center gap-1.5">
                      <Wine className="w-3 h-3" />
                      <span>Accord recommandé: Selección del Sommelier</span>
                    </div>
                  </div>
                  <div className="font-sans font-bold text-amber-300 text-sm">
                    {typeof item.price === 'number' ? item.price.toFixed(2) : item.price} €
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ARCHETYPE MENU VARIANT 5: STANDARD BESPOKE TILED CARDS ── */}
        {!['omakase', 'street_smash', 'cyber_hud', 'bistro_paris'].includes(archetype) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.length > 0 && categories[activeCategory] && (categories[activeCategory].items || []).map((item, itIdx) => (
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

      {/* ─────────────────────────────────────────────────────────────
          BOOKING CALL TO ACTION STRIP
         ───────────────────────────────────────────────────────────── */}
      <section className="py-14 px-4 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="max-w-4xl mx-auto text-center space-y-5 p-8 sm:p-12 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl">
          <IconComponent className="w-8 h-8 mx-auto" style={{ color: primaryColor }} />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            ¿Quieres vivir la experiencia en {restaurant.name}?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Reserva tu mesa en segundos sin intermediarios ni comisiones. Confirmación directa en tu pantalla.
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
            Reservar Mesa Ahora
          </button>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FOOTER
         ───────────────────────────────────────────────────────────── */}
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
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
        />
      )}
    </div>
  );
}
