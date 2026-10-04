import React, { useState } from 'react';
import { 
  Wine, Utensils, Flame, Sparkles, Coffee, Fish, Pizza, Beer, 
  Palmtree, Gem, Crown, Compass, Waves, Sun, Moon, Zap, 
  ShieldCheck, MapPin, Phone, Instagram, Calendar, Clock, 
  ChevronRight, ArrowUpRight, Check, Heart, Award, Star, GlassWater,
  Thermometer, Gauge, Tag, Info, Terminal, Radio, Eye, Layers, QrCode
} from 'lucide-react';
import BookingModal from '../Booking/BookingModal';
import CinematicScrollHero from './CinematicScrollHero';
import QrCodeModal from '../Carta/QrCodeModal';
import { normalizeTemplateId } from './templateNormalizer';

// Template metadata definitions for the Curated Iconic Archetypes
export const TEMPLATE_THEMES = {
  cinematic_experience: {
    icon: Flame,
    tagline: 'Experiencia Cinemática & Brasa Viva',
    badgeText: 'DEL FUEGO AL PLATO // STORYTELLING AL SCROLL',
    styleClass: 'theme-cinematic',
    archetype: 'cinematic_scroll',
    cardBorder: 'border-orange-500/40 hover:border-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.2)]',
    buttonShape: 'rounded-xl font-bold tracking-tight',
    badgeShape: 'rounded-full font-mono',
    defaultPrimary: '#f97316',
    defaultAccent: '#ef4444',
    defaultBg: '#080302',
    defaultSurface: '#160a07'
  },
  tapas_andaluzas: {
    icon: Sun,
    tagline: 'Taberna de Solera & Jamón de Bellota',
    badgeText: 'Albero, Guitarras & Solera del Sur',
    styleClass: 'theme-tapas',
    archetype: 'taberna_iberica',
    cardBorder: 'border-amber-800/50 hover:border-amber-500 shadow-md',
    buttonShape: 'rounded-xl font-serif font-bold',
    badgeShape: 'rounded-full',
    defaultPrimary: '#eab308',
    defaultAccent: '#ca8a04',
    defaultBg: '#1c1006',
    defaultSurface: '#2a180b'
  },
  nocturne: {
    icon: Wine,
    tagline: 'Mixología de Autor & Clandestino',
    badgeText: 'Experiencia Nocturna de Autor',
    styleClass: 'theme-nocturne',
    archetype: 'nocturne',
    cardBorder: 'border-amber-400/20 hover:border-amber-400/60 shadow-lg',
    buttonShape: 'rounded-2xl font-sans',
    badgeShape: 'rounded-full',
    defaultPrimary: '#f59e0b',
    defaultAccent: '#fbbf24',
    defaultBg: '#060608',
    defaultSurface: '#0f0f14'
  },
  urban_street_smash: {
    icon: Flame,
    tagline: 'Smash Burgers & Streetwear',
    badgeText: '100% Carne Crujiente // Costra Maillard',
    styleClass: 'theme-smash',
    archetype: 'street_smash',
    cardBorder: 'border-2 border-yellow-400 shadow-[5px_5px_0px_#facc15]',
    buttonShape: 'rounded-none uppercase font-black tracking-widest',
    badgeShape: 'rounded-none',
    defaultPrimary: '#facc15',
    defaultAccent: '#ff5500',
    defaultBg: '#09090b',
    defaultSurface: '#18181b'
  },
  tokyo_omakase: {
    icon: Moon,
    tagline: 'Barra Omakase & Zen Japonés',
    badgeText: 'Omakase del Chef // 東京 • 職人',
    styleClass: 'theme-omakase',
    archetype: 'omakase',
    cardBorder: 'border-stone-800 hover:border-stone-600',
    buttonShape: 'rounded-sm tracking-widest uppercase text-xs',
    badgeShape: 'rounded-none',
    defaultPrimary: '#f5f5f4',
    defaultAccent: '#e11d48',
    defaultBg: '#111113',
    defaultSurface: '#1c1917'
  },
  steakhouse_asador: {
    icon: Flame,
    tagline: 'Asador Prime & Cortes Madurados',
    badgeText: 'Carbón Vegetal & Dry Aged 60 Días',
    styleClass: 'theme-steakhouse',
    archetype: 'asador_prime',
    cardBorder: 'border-red-950/80 hover:border-red-600/70 shadow-lg',
    buttonShape: 'rounded-xl font-black uppercase tracking-wider',
    badgeShape: 'rounded-md',
    defaultPrimary: '#ef4444',
    defaultAccent: '#f97316',
    defaultBg: '#180704',
    defaultSurface: '#280c08'
  },
  bistro_parisien: {
    icon: Award,
    tagline: 'Bistró Francés & Belle Époque',
    badgeText: 'Maison de Cuisine & Sommelier',
    styleClass: 'theme-bistro',
    archetype: 'bistro_paris',
    cardBorder: 'border-amber-500/40 hover:border-amber-400 shadow-md',
    buttonShape: 'rounded-xl font-serif italic',
    badgeShape: 'rounded-full',
    defaultPrimary: '#10b981',
    defaultAccent: '#eab308',
    defaultBg: '#04160e',
    defaultSurface: '#072417'
  },
  marisqueria_costera: {
    icon: Fish,
    tagline: 'Marisquería de Lonja & Gamba Blanca',
    badgeText: 'Subasta Matinal // Costa de Huelva',
    styleClass: 'theme-marisqueria',
    archetype: 'coastal_lonja',
    cardBorder: 'border-sky-800/50 hover:border-sky-400 shadow-md',
    buttonShape: 'rounded-2xl',
    badgeShape: 'rounded-full',
    defaultPrimary: '#0284c7',
    defaultAccent: '#38bdf8',
    defaultBg: '#021424',
    defaultSurface: '#05233e'
  },
  pasticceria_dolce: {
    icon: Heart,
    tagline: 'Pastelería Boutique & Desayunos Dolce',
    badgeText: 'Pastelería Fina & Brunch de Autor',
    styleClass: 'theme-dolce',
    archetype: 'pasticceria_dolce',
    cardBorder: 'border-pink-500/30 hover:border-pink-400 shadow-md',
    buttonShape: 'rounded-full font-medium',
    badgeShape: 'rounded-full',
    defaultPrimary: '#ec4899',
    defaultAccent: '#f472b6',
    defaultBg: '#1c1218',
    defaultSurface: '#2b1b25'
  },
  cerveceria_craft: {
    icon: Beer,
    tagline: 'Fábrica de Cerveza & Taproom',
    badgeText: '12 Grifos Artesanales // Lúpulo Fresco',
    styleClass: 'theme-brewery',
    archetype: 'craft_brewery',
    cardBorder: 'border-amber-800/40 hover:border-amber-500 shadow-md',
    buttonShape: 'rounded-lg font-mono font-bold uppercase',
    badgeShape: 'rounded-md',
    defaultPrimary: '#d97706',
    defaultAccent: '#f59e0b',
    defaultBg: '#1a0f04',
    defaultSurface: '#291807'
  },
  cyberpunk: {
    icon: Zap,
    tagline: 'Cyber Neon & Experimental Bar',
    badgeText: 'Sintético // 2077 Night Hub',
    styleClass: 'theme-cyberpunk',
    archetype: 'cyber_hud',
    cardBorder: 'border border-cyan-500/50 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]',
    buttonShape: 'rounded-none font-mono uppercase tracking-widest',
    badgeShape: 'rounded-none font-mono',
    defaultPrimary: '#06b6d4',
    defaultAccent: '#a855f7',
    defaultBg: '#010914',
    defaultSurface: '#04172a'
  },
  pizzeria_napolitana: {
    icon: Pizza,
    tagline: 'Pizzería Napolitana & Forno a Legna',
    badgeText: 'Horno de Leña 480°C • Fermentazione 72H',
    styleClass: 'theme-pizza',
    archetype: 'pizzeria_napoli',
    cardBorder: 'border-rose-900/40 hover:border-rose-500 shadow-md',
    buttonShape: 'rounded-2xl font-serif font-bold',
    badgeShape: 'rounded-full',
    defaultPrimary: '#e11d48',
    defaultAccent: '#22c55e',
    defaultBg: '#14070a',
    defaultSurface: '#220d12'
  },
  trattoria_italiana: {
    icon: Utensils,
    tagline: 'Trattoria Toscana & Pasta Fresca',
    badgeText: 'Pasta Fatta a Mano & Vino Chianti',
    styleClass: 'theme-trattoria',
    archetype: 'trattoria_toscana',
    cardBorder: 'border-amber-700/40 hover:border-amber-500 shadow-md',
    buttonShape: 'rounded-xl font-serif font-bold',
    badgeShape: 'rounded-md',
    defaultPrimary: '#f59e0b',
    defaultAccent: '#84cc16',
    defaultBg: '#160d07',
    defaultSurface: '#27170e'
  },
  taqueria_fiesta: {
    icon: Flame,
    tagline: 'Cantina Mexicana & Taquería Callejera',
    badgeText: 'Maíz Nixtamalizado // Barra de Mezcal',
    styleClass: 'theme-taqueria',
    archetype: 'taqueria_mexicana',
    cardBorder: 'border-orange-500/40 hover:border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)]',
    buttonShape: 'rounded-xl font-black uppercase tracking-wider',
    badgeShape: 'rounded-lg',
    defaultPrimary: '#f97316',
    defaultAccent: '#10b981',
    defaultBg: '#170b04',
    defaultSurface: '#281409'
  },
  beach_club: {
    icon: Sun,
    tagline: 'Beach Club & Chiringuito Mediterráneo',
    badgeText: 'Sunset Sessions // Arroces Frente al Mar',
    styleClass: 'theme-beach',
    archetype: 'beach_club_med',
    cardBorder: 'border-sky-500/30 hover:border-sky-400 shadow-md',
    buttonShape: 'rounded-full font-sans tracking-wide font-bold',
    badgeShape: 'rounded-full',
    defaultPrimary: '#38bdf8',
    defaultAccent: '#facc15',
    defaultBg: '#04151f',
    defaultSurface: '#082333'
  },
  coffee_specialty: {
    icon: Coffee,
    tagline: 'Specialty Coffee Roaster & Bakery',
    badgeText: 'Orígenes Únicos // +88 Puntos SCA',
    styleClass: 'theme-coffee',
    archetype: 'specialty_coffee',
    cardBorder: 'border-amber-800/40 hover:border-amber-500 shadow-sm',
    buttonShape: 'rounded-lg font-mono font-medium',
    badgeShape: 'rounded-md',
    defaultPrimary: '#d97706',
    defaultAccent: '#fbbf24',
    defaultBg: '#140d07',
    defaultSurface: '#23170e'
  },
  pulperia_gallega: {
    icon: Fish,
    tagline: 'Pulpería Tradicional da Ría',
    badgeText: 'Caldero de Cobre & Cuncas de Ribeiro',
    styleClass: 'theme-pulperia',
    archetype: 'pulperia_tradicional',
    cardBorder: 'border-red-800/50 hover:border-red-500 shadow-md',
    buttonShape: 'rounded-xl font-serif font-bold',
    badgeShape: 'rounded-full',
    defaultPrimary: '#dc2626',
    defaultAccent: '#ca8a04',
    defaultBg: '#160907',
    defaultSurface: '#27120e'
  },
  bodega_enoteca: {
    icon: Wine,
    tagline: 'Bodega Subterránea & Enoteca',
    badgeText: 'Duelas de Roble & Vinos de Guarda',
    styleClass: 'theme-bodega',
    archetype: 'bodega_enoteca',
    cardBorder: 'border-purple-800/40 hover:border-purple-400 shadow-lg',
    buttonShape: 'rounded-xl font-serif font-bold',
    badgeShape: 'rounded-full',
    defaultPrimary: '#9333ea',
    defaultAccent: '#eab308',
    defaultBg: '#110617',
    defaultSurface: '#1e0c27'
  },
  brutalist: {
    icon: Zap,
    tagline: 'Raw Neo-Brutalism & Street Beats',
    badgeText: 'RAW DESIGN // 0% COMPROMISE',
    styleClass: 'theme-brutalist',
    archetype: 'brutalist_raw',
    cardBorder: 'border-2 border-yellow-300 shadow-[4px_4px_0px_#ccff00]',
    buttonShape: 'rounded-none uppercase font-black tracking-widest',
    badgeShape: 'rounded-none font-mono',
    defaultPrimary: '#ccff00',
    defaultAccent: '#ffffff',
    defaultBg: '#050505',
    defaultSurface: '#111115'
  },
  minimalist: {
    icon: Moon,
    tagline: 'Arquitectura Gastronómica & Silencio',
    badgeText: 'ÉPURE // SILENCIO VISUAL',
    styleClass: 'theme-minimalist',
    archetype: 'minimalist_pure',
    cardBorder: 'border-white/10 hover:border-white/40',
    buttonShape: 'rounded-full uppercase tracking-widest text-xs font-light',
    badgeShape: 'rounded-full',
    defaultPrimary: '#ffffff',
    defaultAccent: '#a1a1aa',
    defaultBg: '#000000',
    defaultSurface: '#0a0a0d'
  },
  velvet: {
    icon: GlassWater,
    tagline: 'Velvet Speakeasy & Private Booths',
    badgeText: 'Clandestino Exclusivo // Velvet & Gold',
    styleClass: 'theme-velvet',
    archetype: 'velvet_lounge',
    cardBorder: 'border-rose-900/40 hover:border-rose-400 shadow-lg',
    buttonShape: 'rounded-2xl font-serif font-medium',
    badgeShape: 'rounded-full',
    defaultPrimary: '#e11d48',
    defaultAccent: '#fbbf24',
    defaultBg: '#0a0306',
    defaultSurface: '#180810'
  },
  tecnodiel_elite: {
    icon: Sparkles,
    tagline: 'TecnOdiel Titanium Flagship',
    badgeText: 'High-Converting Web Engine // 0.2s',
    styleClass: 'theme-tecnodiel',
    archetype: 'tecnodiel_titanium',
    cardBorder: 'border-emerald-500/40 hover:border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]',
    buttonShape: 'rounded-xl font-bold tracking-tight',
    badgeShape: 'rounded-full',
    defaultPrimary: '#10b981',
    defaultAccent: '#34d399',
    defaultBg: '#020604',
    defaultSurface: '#05140b'
  }
};

export function getTemplateArchetype(templateId) {
  const norm = normalizeTemplateId(templateId);
  const meta = TEMPLATE_THEMES[norm];
  return meta?.archetype || 'default_elegance';
}

export default function DynamicThemedTemplate({ 
  restaurant = {}, 
  isPreview = false,
  previewDevice = 'desktop',
  onSelectElement = null,
  selectedElement = null
}) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);

  const rawId = restaurant?.template_id;
  const templateId = normalizeTemplateId(rawId);
  const meta = TEMPLATE_THEMES[templateId] || TEMPLATE_THEMES.tapas_andaluzas;
  const archetype = meta.archetype || 'default_elegance';
  const IconComponent = meta.icon || Utensils;

  const primaryColor = restaurant?.primary_color || meta.defaultPrimary || '#eab308';
  const accentColor = restaurant?.accent_color || meta.defaultAccent || '#ca8a04';
  const bgColor = restaurant?.background_color || meta.defaultBg || '#1c1006';
  const surfaceColor = restaurant?.surface_color || meta.defaultSurface || '#2a180b';
  const categories = Array.isArray(restaurant?.menu_categories) ? restaurant.menu_categories : [];

  const heroImage = restaurant?.hero_image || 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?auto=format&fit=crop&w=1920&q=80';
  const heroLayout = restaurant?.hero_layout || 'split';
  const heroImageSide = restaurant?.hero_image_side || 'right';
  const heroImageSize = restaurant?.hero_image_size || 'medium';
  const heroImageRounded = restaurant?.hero_image_rounded || 'rounded-2xl';

  const isMobile = previewDevice === 'mobile';
  const isTablet = previewDevice === 'tablet';

  const getImageHeight = (size = heroImageSize) => {
    const s = String(size || '').toLowerCase();
    if (isMobile) {
      if (s === 'small' || s === 'sm') return 'h-[180px]';
      if (s === 'large' || s === 'lg') return 'h-[320px]';
      if (s === 'full' || s === 'xl') return 'h-[400px]';
      return 'h-[250px]';
    }
    if (s === 'small' || s === 'sm') return 'h-[240px]';
    if (s === 'large' || s === 'lg') return 'h-[460px]';
    if (s === 'full' || s === 'xl') return 'h-[580px]';
    return 'h-[340px]';
  };

  const getGridCols = () => {
    if (isMobile) {
      return {
        container: 'grid grid-cols-1 gap-6 items-center',
        textCol: 'w-full order-2 space-y-4',
        imageCol: 'w-full order-1 relative'
      };
    }
    return {
      container: 'grid grid-cols-1 lg:grid-cols-12 gap-8 items-center',
      textCol: heroImageSide === 'left' ? 'lg:col-span-7 order-2 space-y-5' : 'lg:col-span-7 order-1 space-y-5',
      imageCol: heroImageSide === 'left' ? 'lg:col-span-5 order-1 relative' : 'lg:col-span-5 order-2 relative'
    };
  };

  const editableClass = (type) => {
    if (!isPreview) return '';
    const isSelected = selectedElement?.type === type;
    return `cursor-pointer transition-all duration-150 relative group/edit ${
      isSelected 
        ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-black shadow-[0_0_20px_rgba(16,185,129,0.4)] rounded-xl' 
        : 'hover:ring-2 hover:ring-emerald-400/80 hover:ring-dashed rounded-xl'
    }`;
  };

  const handleEdit = (e, type, title = '', data = {}) => {
    if (!isPreview || !onSelectElement) return;
    if (e && e.stopPropagation) e.stopPropagation();
    onSelectElement({ type, label: title || type, title, data: { restaurant, ...data } });
  };

  const handleBookingClick = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (isPreview) {
      handleEdit(e, 'cta_button', 'Botón de Reserva / Llamada a la acción');
    }
    setIsBookingOpen(true);
  };

  // Smooth scroll without changing window.location.hash to prevent router resets!
  const scrollToCarta = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    const el = document.getElementById('carta');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const scrollParent = el.closest('.overflow-y-auto') || document.querySelector('.overflow-y-auto');
      if (scrollParent) {
        const topPos = el.offsetTop - 50;
        scrollParent.scrollTo({ top: topPos, behavior: 'smooth' });
      }
    }
  };

  return (
    <div 
      onClick={(e) => handleEdit(e, 'background', 'Fondo y Color de la Web')}
      className={`min-h-screen text-zinc-100 selection:bg-white selection:text-black relative overflow-x-hidden font-sans ${isPreview ? 'cursor-pointer' : ''}`}
      style={{ backgroundColor: bgColor }}
      title={isPreview ? "Pulsa para cambiar el color de fondo o la paleta cromática" : undefined}
    >
      {/* ─────────────────────────────────────────────────────────────
          ARCHETYPE-SPECIFIC ATMOSPHERIC BACKGROUND EFFECTS
         ───────────────────────────────────────────────────────────── */}
      {archetype === 'taberna_iberica' && (
        <>
          <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle, #eab308 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }}
          />
          <div className="absolute top-0 right-0 w-[550px] h-[350px] rounded-full blur-[140px] pointer-events-none opacity-25 bg-amber-600" />
        </>
      )}

      {archetype === 'nocturne' && (
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[150px] pointer-events-none opacity-30"
          style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }}
        />
      )}

      {archetype === 'omakase' && (
        <>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-stone-900/40 rounded-full blur-[160px] pointer-events-none" />
          <div className="absolute top-20 right-6 text-[140px] font-black text-white/[0.03] select-none pointer-events-none font-serif leading-none">
            旬
          </div>
        </>
      )}

      {archetype === 'street_smash' && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, #facc15 1.5px, transparent 1.5px)',
            backgroundSize: '24px 24px'
          }}
        />
      )}

      {archetype === 'cyber_hud' && (
        <>
          <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'linear-gradient(to right, #06b6d425 1px, transparent 1px), linear-gradient(to bottom, #06b6d425 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }}
          />
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06b6d4]" />
        </>
      )}

      {archetype === 'coastal_lonja' && (
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none opacity-25 blur-[130px]"
          style={{ background: 'radial-gradient(circle, #0284c7 0%, #0369a1 40%, transparent 80%)' }}
        />
      )}

      {archetype === 'asador_prime' && (
        <div 
          className="absolute top-0 right-1/4 w-96 h-96 rounded-full pointer-events-none opacity-30 blur-[130px]"
          style={{ background: 'radial-gradient(circle, #dc2626 0%, #7c2d12 50%, transparent 80%)' }}
        />
      )}

      {archetype === 'bistro_paris' && (
        <div className="absolute inset-0 bg-radial-vignette opacity-50 pointer-events-none" />
      )}

      {archetype === 'pasticceria_dolce' && (
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full blur-[140px] pointer-events-none opacity-25"
          style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)' }}
        />
      )}

      {archetype === 'craft_brewery' && (
        <div 
          className="absolute top-0 right-10 w-96 h-96 rounded-full pointer-events-none opacity-25 blur-[130px]"
          style={{ background: 'radial-gradient(circle, #d97706 0%, transparent 70%)' }}
        />
      )}

      {/* ─────────────────────────────────────────────────────────────
          GLOBAL NAVIGATION HEADER (BESPOKE BY ARCHETYPE)
         ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-white/10 backdrop-blur-2xl bg-black/85">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            onClick={(e) => handleEdit(e, 'title', 'Nombre de tu Local')}
            className={`flex items-center gap-3 p-1 rounded-xl transition ${editableClass('title')}`}
            title={isPreview ? "Pulsa para editar el nombre de tu restaurante" : undefined}
          >
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
                  {restaurant.name || 'Restaurante'}
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
              type="button"
              onClick={() => setIsQrModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/15 bg-zinc-900/80 hover:bg-zinc-800 text-xs text-zinc-200 hover:text-white transition cursor-pointer"
              title="Ver código QR para las mesas del restaurante"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-400" />
              <span>Carta QR Mesa</span>
            </button>
            <button
              onClick={handleBookingClick}
              className={`px-4 py-2 sm:px-5 sm:py-2.5 ${meta.buttonShape} text-xs font-bold transition flex items-center gap-2 shadow-lg cursor-pointer interactive-button ${editableClass('cta_button')}`}
              style={{
                backgroundColor: primaryColor,
                color: '#000000',
                boxShadow: `0 0 20px ${primaryColor}40`
              }}
              title={isPreview ? "Pulsa para editar el botón de reserva" : undefined}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Reservar Mesa</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          BESPOKE HERO ARCHETYPE 0: CINEMATIC SCROLL STORYTELLING (DEL FUEGO AL PLATO)
         ───────────────────────────────────────────────────────────── */}
      {archetype === 'cinematic_scroll' && (
        <CinematicScrollHero
          restaurant={restaurant}
          isPreview={isPreview}
          isMobile={isMobile}
          handleEdit={handleEdit}
          editableClass={editableClass}
          handleBookingClick={handleBookingClick}
          scrollToCarta={scrollToCarta}
          primaryColor={primaryColor}
          accentColor={accentColor}
          onOpenQrModal={() => setIsQrModalOpen(true)}
        />
      )}

      {/* ─────────────────────────────────────────────────────────────
          BESPOKE HERO ARCHETYPE 1: TABERNA IBÉRICA & TAPAS (ALBERO & MADERA)
         ───────────────────────────────────────────────────────────── */}
      {archetype === 'taberna_iberica' && (
        <section className="relative pt-6 pb-12 px-4 max-w-6xl mx-auto font-serif">
          {heroLayout === 'centered' ? (
            <div 
              onClick={(e) => handleEdit(e, 'hero_image', 'Imagen de Portada')}
              className={`rounded-3xl border-2 border-amber-800/60 p-6 sm:p-14 min-h-[460px] flex flex-col justify-end text-center relative overflow-hidden shadow-2xl ${editableClass('hero_image')}`}
              title={isPreview ? "Pulsa para editar la foto de portada" : undefined}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center -z-10 scale-105 transition duration-1000"
                style={{ backgroundImage: `url(${heroImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/30 -z-10" />
              <div className="max-w-2xl space-y-4 mx-auto flex flex-col items-center">
                <div 
                  onClick={(e) => handleEdit(e, 'slogan', 'Lema del Local')}
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-sans font-semibold ${editableClass('slogan')}`}
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Taberna Tradicional • Tapas, Medias & Raciones</span>
                </div>
                <h1 
                  onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
                  className={`text-3xl ${isMobile ? 'text-3xl' : 'sm:text-5xl lg:text-6xl'} font-black text-amber-100 tracking-tight leading-tight ${editableClass('title')}`}
                >
                  {restaurant.slogan || restaurant.name}
                </h1>
                <p 
                  onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                  className={`text-xs sm:text-sm text-amber-200/80 leading-relaxed max-w-lg font-sans ${editableClass('slogan')}`}
                >
                  {restaurant.description || 'El sabor auténtico del sur: jamón de bellota 100% ibérico cortado a cuchillo al momento, gambas blancas de Huelva al ajillo y vinos finos servidos en bota y catavinos.'}
                </p>
                <div className="pt-2 flex flex-wrap justify-center items-center gap-3 font-sans">
                  <button
                    onClick={handleBookingClick}
                    className={`px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider transition shadow-xl cursor-pointer ${editableClass('cta_button')}`}
                  >
                    {restaurant.cta_text || 'Reservar Mesa en Taberna'}
                  </button>
                  <button
                    type="button"
                    onClick={scrollToCarta}
                    className="px-5 py-3.5 rounded-xl border border-amber-600/50 bg-amber-950/60 hover:bg-amber-900/60 text-amber-200 font-bold text-xs uppercase transition cursor-pointer"
                  >
                    Ver Pizarra de Tapas
                  </button>
                </div>
              </div>
            </div>
          ) : heroLayout === 'minimal' ? (
            <div className="rounded-3xl border-2 border-amber-800/60 bg-[#231409] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
              <div className="max-w-2xl space-y-4">
                <div 
                  onClick={(e) => handleEdit(e, 'slogan', 'Lema del Local')}
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-sans font-semibold ${editableClass('slogan')}`}
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Taberna Tradicional • Tapas, Medias & Raciones</span>
                </div>
                <h1 
                  onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
                  className={`text-3xl ${isMobile ? 'text-3xl' : 'sm:text-5xl'} font-black text-amber-100 tracking-tight leading-tight ${editableClass('title')}`}
                >
                  {restaurant.slogan || restaurant.name}
                </h1>
                <p 
                  onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                  className={`text-xs sm:text-sm text-amber-200/80 leading-relaxed max-w-lg font-sans ${editableClass('slogan')}`}
                >
                  {restaurant.description || 'El sabor auténtico del sur: jamón de bellota 100% ibérico cortado a cuchillo al momento, gambas blancas de Huelva al ajillo y vinos finos.'}
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3 font-sans">
                  <button
                    onClick={handleBookingClick}
                    className={`px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider transition shadow-xl cursor-pointer ${editableClass('cta_button')}`}
                  >
                    {restaurant.cta_text || 'Reservar Mesa en Taberna'}
                  </button>
                  <button
                    type="button"
                    onClick={scrollToCarta}
                    className="px-5 py-3.5 rounded-xl border border-amber-600/50 bg-amber-950/60 hover:bg-amber-900/60 text-amber-200 font-bold text-xs uppercase transition cursor-pointer"
                  >
                    Ver Pizarra de Tapas
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border-2 border-amber-800/60 bg-[#231409] p-6 sm:p-12 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-amber-700/40 text-xs font-mono uppercase tracking-widest text-amber-400/90">
                <span className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>SOLERA & BODEGUITA // HUELVA & SEVILLA</span>
                </span>
                <span className="hidden sm:inline text-amber-500/70">CORTE DE JAMÓN A CUCHILLO • D.O. JABUGO</span>
              </div>

              <div className={getGridCols().container}>
                <div className={getGridCols().textCol}>
                  <div 
                    onClick={(e) => handleEdit(e, 'slogan', 'Lema del Local')}
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-sans font-semibold ${editableClass('slogan')}`}
                  >
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>Taberna Tradicional • Tapas, Medias & Raciones</span>
                  </div>

                  <h1 
                    onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
                    className={`text-3xl ${isMobile ? 'text-3xl' : 'sm:text-5xl'} font-black text-amber-100 tracking-tight leading-tight ${editableClass('title')}`}
                  >
                    {restaurant.slogan || restaurant.name}
                  </h1>

                  <p 
                    onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                    className={`text-xs sm:text-sm text-amber-200/80 leading-relaxed max-w-lg font-sans ${editableClass('slogan')}`}
                  >
                    {restaurant.description || 'El sabor auténtico del sur: jamón de bellota 100% ibérico cortado a cuchillo al momento, gambas blancas de Huelva al ajillo y vinos finos servidos en bota y catavinos.'}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3 font-sans">
                    <button
                      onClick={handleBookingClick}
                      className={`px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider transition shadow-xl cursor-pointer ${editableClass('cta_button')}`}
                    >
                      {restaurant.cta_text || 'Reservar Mesa en Taberna'}
                    </button>
                    <button
                      type="button"
                      onClick={scrollToCarta}
                      className="px-5 py-3.5 rounded-xl border border-amber-600/50 bg-amber-950/60 hover:bg-amber-900/60 text-amber-200 font-bold text-xs uppercase transition cursor-pointer"
                    >
                      Ver Pizarra de Tapas
                    </button>
                  </div>
                </div>

                <div 
                  onClick={(e) => handleEdit(e, 'hero_image', 'Imagen de Portada')}
                  className={`${getGridCols().imageCol} ${editableClass('hero_image')}`}
                  title={isPreview ? "Pulsa para editar la foto de portada" : undefined}
                >
                  <div className={`relative ${heroImageRounded} overflow-hidden border-2 border-amber-700/60 shadow-2xl bg-amber-950/40 p-2`}>
                    <img 
                      src={heroImage} 
                      alt={restaurant.name}
                      className={`w-full ${getImageHeight(heroImageSize)} object-cover rounded-xl filter contrast-105`}
                    />
                    <div className="absolute bottom-4 left-4 right-4 bg-black/90 p-3 rounded-lg border border-amber-700/50 text-[11px] font-sans text-amber-200 flex justify-between items-center">
                      <span className="font-bold">JAMÓN DEL DÍA: D.O. JABUGO</span>
                      <span className="text-amber-400 font-mono font-bold">100% BELLOTA</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          BESPOKE HERO ARCHETYPE 2: NOCTURNE LOUNGE & MIXOLOGÍA (VIP OBSIDIAN)
         ───────────────────────────────────────────────────────────── */}
      {archetype === 'nocturne' && (
        <section className="relative pt-6 pb-14 px-4 max-w-6xl mx-auto font-sans">
          {heroLayout === 'split' ? (
            <div className="relative rounded-3xl overflow-hidden border border-amber-400/20 bg-gradient-to-b from-[#14141d] to-[#07070a] p-6 sm:p-12 shadow-2xl">
              <div className={getGridCols().container}>
                <div className={getGridCols().textCol}>
                  <div 
                    onClick={(e) => handleEdit(e, 'slogan', 'Lema del Local')}
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono border border-amber-400/30 bg-amber-400/10 text-amber-300 uppercase tracking-widest backdrop-blur-md ${editableClass('slogan')}`}
                  >
                    <Wine className="w-3.5 h-3.5 text-amber-400" />
                    <span>Atmósfera Clandestina & Mixología de Noche</span>
                  </div>

                  <h1 
                    onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
                    className={`text-3xl ${isMobile ? 'text-3xl' : 'sm:text-5xl lg:text-6xl'} font-light text-white tracking-tight leading-tight ${editableClass('title')}`}
                  >
                    {restaurant.slogan || restaurant.name}
                  </h1>

                  <p 
                    onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                    className={`text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl font-light ${editableClass('slogan')}`}
                  >
                    {restaurant.description || 'Un espacio íntimo y refinado donde la mixología contemporánea se encuentra con creaciones culinarias de autor, luces suaves y acústica envolvente.'}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-4">
                    <button
                      onClick={handleBookingClick}
                      className={`px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition shadow-[0_0_25px_rgba(245,158,11,0.4)] flex items-center gap-2 cursor-pointer ${editableClass('cta_button')}`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{restaurant.cta_text || 'Reservar Mesa VIP'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={scrollToCarta}
                      className="px-5 py-3.5 rounded-xl border border-white/20 hover:border-white/40 text-xs font-semibold text-white bg-black/40 backdrop-blur-md transition cursor-pointer"
                    >
                      Ver Cócteles & Bocados
                    </button>
                  </div>
                </div>

                <div 
                  onClick={(e) => handleEdit(e, 'hero_image', 'Imagen de Portada')}
                  className={`${getGridCols().imageCol} ${editableClass('hero_image')}`}
                  title={isPreview ? "Pulsa para editar la foto de portada" : undefined}
                >
                  <div className={`relative ${heroImageRounded} overflow-hidden border border-amber-400/30 p-2 bg-black/60 shadow-2xl`}>
                    <img 
                      src={heroImage} 
                      alt={restaurant.name}
                      className={`w-full ${getImageHeight(heroImageSize)} object-cover rounded-xl`}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : heroLayout === 'minimal' ? (
            <div className="relative rounded-3xl overflow-hidden border border-amber-400/20 bg-gradient-to-b from-[#14141d] to-[#07070a] p-6 sm:p-10 shadow-2xl">
              <div className="max-w-2xl space-y-4">
                <div 
                  onClick={(e) => handleEdit(e, 'slogan', 'Lema del Local')}
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono border border-amber-400/30 bg-amber-400/10 text-amber-300 uppercase tracking-widest backdrop-blur-md ${editableClass('slogan')}`}
                >
                  <Wine className="w-3.5 h-3.5 text-amber-400" />
                  <span>Atmósfera Clandestina & Mixología de Noche</span>
                </div>
                <h1 
                  onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
                  className={`text-3xl ${isMobile ? 'text-3xl' : 'sm:text-5xl'} font-light text-white tracking-tight leading-tight ${editableClass('title')}`}
                >
                  {restaurant.slogan || restaurant.name}
                </h1>
                <p 
                  onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                  className={`text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl font-light ${editableClass('slogan')}`}
                >
                  {restaurant.description || 'Un espacio íntimo y refinado donde la mixología contemporánea se encuentra con creaciones culinarias de autor.'}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <button
                    onClick={handleBookingClick}
                    className={`px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition shadow-[0_0_25px_rgba(245,158,11,0.4)] flex items-center gap-2 cursor-pointer ${editableClass('cta_button')}`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{restaurant.cta_text || 'Reservar Mesa VIP'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={scrollToCarta}
                    className="px-5 py-3.5 rounded-xl border border-white/20 hover:border-white/40 text-xs font-semibold text-white bg-black/40 backdrop-blur-md transition cursor-pointer"
                  >
                    Ver Cócteles & Bocados
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div 
              onClick={(e) => handleEdit(e, 'hero_image', 'Imagen de Portada')}
              className={`relative rounded-3xl overflow-hidden border border-amber-400/20 bg-gradient-to-b from-[#14141d] to-[#07070a] p-6 sm:p-14 min-h-[440px] flex flex-col justify-end shadow-2xl ${editableClass('hero_image')}`}
              title={isPreview ? "Pulsa para editar la foto de portada" : undefined}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center -z-10 scale-105 transition duration-1000 opacity-40"
                style={{ backgroundImage: `url(${heroImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-transparent -z-10" />

              <div className="max-w-2xl space-y-4">
                <div 
                  onClick={(e) => handleEdit(e, 'slogan', 'Lema del Local')}
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono border border-amber-400/30 bg-amber-400/10 text-amber-300 uppercase tracking-widest backdrop-blur-md ${editableClass('slogan')}`}
                >
                  <Wine className="w-3.5 h-3.5 text-amber-400" />
                  <span>Atmósfera Clandestina & Mixología de Noche</span>
                </div>

                <h1 
                  onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
                  className={`text-3xl ${isMobile ? 'text-3xl' : 'sm:text-5xl lg:text-6xl'} font-light text-white tracking-tight leading-tight ${editableClass('title')}`}
                >
                  {restaurant.slogan || restaurant.name}
                </h1>

                <p 
                  onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                  className={`text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl font-light ${editableClass('slogan')}`}
                >
                  {restaurant.description || 'Un espacio íntimo y refinado donde la mixología contemporánea se encuentra con creaciones culinarias de autor, luces suaves y acústica envolvente.'}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-4">
                  <button
                    onClick={handleBookingClick}
                    className={`px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition shadow-[0_0_25px_rgba(245,158,11,0.4)] flex items-center gap-2 cursor-pointer ${editableClass('cta_button')}`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{restaurant.cta_text || 'Reservar Mesa VIP'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={scrollToCarta}
                    className="px-5 py-3.5 rounded-xl border border-white/20 hover:border-white/40 text-xs font-semibold text-white bg-black/40 backdrop-blur-md transition cursor-pointer"
                  >
                    Ver Cócteles & Bocados
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          BESPOKE HERO ARCHETYPE 3: TOKYO OMAKASE (ZEN WABI-SABI)
          ───────────────────────────────────────────────────────────── */}
      {archetype === 'omakase' && (
        <section className="relative pt-8 pb-14 px-4 max-w-6xl mx-auto">
          {heroLayout === 'centered' ? (
            <div 
              onClick={(e) => handleEdit(e, 'hero_image', 'Imagen de Portada')}
              className={`border border-stone-800 bg-stone-950 p-6 sm:p-14 min-h-[460px] flex flex-col justify-end text-center relative overflow-hidden shadow-2xl ${editableClass('hero_image')}`}
              title={isPreview ? "Pulsa para editar la foto de portada" : undefined}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center -z-10 scale-105 transition duration-1000 opacity-50"
                style={{ backgroundImage: `url(${heroImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/30 -z-10" />
              <div className="max-w-2xl space-y-4 mx-auto flex flex-col items-center">
                <div 
                  onClick={(e) => handleEdit(e, 'slogan', 'Lema')}
                  className={`inline-flex items-center gap-2 px-3 py-1 border border-stone-700 bg-stone-900 text-stone-300 text-[10px] font-mono uppercase tracking-widest ${editableClass('slogan')}`}
                >
                  <Moon className="w-3.5 h-3.5 text-stone-400" />
                  <span>Barra Omakase • Máximo 10 Comensales</span>
                </div>
                <h1 
                  onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
                  className={`text-3xl ${isMobile ? 'text-3xl' : 'sm:text-5xl lg:text-6xl'} font-light text-stone-100 tracking-tight leading-tight ${editableClass('title')}`}
                >
                  {restaurant.slogan || restaurant.name}
                </h1>
                <p 
                  onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                  className={`text-xs sm:text-sm text-stone-300 leading-relaxed max-w-lg font-light ${editableClass('slogan')}`}
                >
                  {restaurant.description || 'La experiencia Omakase confía el menú por completo a las manos del Shokunin.'}
                </p>
                <div className="pt-2 flex flex-wrap justify-center items-center gap-4">
                  <button
                    onClick={handleBookingClick}
                    className={`px-6 py-3.5 bg-stone-100 hover:bg-white text-stone-950 font-bold text-xs tracking-wider uppercase transition shadow-xl cursor-pointer ${editableClass('cta_button')}`}
                  >
                    {restaurant.cta_text || 'Reservar Pase de Barra'}
                  </button>
                  <button
                    type="button"
                    onClick={scrollToCarta}
                    className="px-5 py-3.5 border border-stone-700 text-stone-300 hover:text-white hover:border-stone-500 text-xs tracking-wider uppercase transition cursor-pointer"
                  >
                    Ver Secuencia de Pases
                  </button>
                </div>
              </div>
            </div>
          ) : heroLayout === 'minimal' ? (
            <div className="border border-stone-800 bg-stone-950/70 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
              <div className="max-w-2xl space-y-4">
                <div 
                  onClick={(e) => handleEdit(e, 'slogan', 'Lema')}
                  className={`inline-flex items-center gap-2 px-3 py-1 border border-stone-700 bg-stone-900 text-stone-300 text-[10px] font-mono uppercase tracking-widest ${editableClass('slogan')}`}
                >
                  <Moon className="w-3.5 h-3.5 text-stone-400" />
                  <span>Barra Omakase • Máximo 10 Comensales</span>
                </div>
                <h1 
                  onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
                  className={`text-3xl ${isMobile ? 'text-3xl' : 'sm:text-5xl'} font-light text-stone-100 tracking-tight leading-tight ${editableClass('title')}`}
                >
                  {restaurant.slogan || restaurant.name}
                </h1>
                <p 
                  onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                  className={`text-xs sm:text-sm text-stone-400 leading-relaxed max-w-lg font-light ${editableClass('slogan')}`}
                >
                  {restaurant.description || 'La experiencia Omakase confía el menú por completo a las manos del Shokunin.'}
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <button
                    onClick={handleBookingClick}
                    className={`px-6 py-3.5 bg-stone-100 hover:bg-white text-stone-950 font-bold text-xs tracking-wider uppercase transition shadow-xl cursor-pointer ${editableClass('cta_button')}`}
                  >
                    {restaurant.cta_text || 'Reservar Pase de Barra'}
                  </button>
                  <button
                    type="button"
                    onClick={scrollToCarta}
                    className="px-5 py-3.5 border border-stone-700 text-stone-300 hover:text-white hover:border-stone-500 text-xs tracking-wider uppercase transition cursor-pointer"
                  >
                    Ver Secuencia de Pases
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-stone-800 bg-stone-950/70 p-6 sm:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-2 right-4 text-xs font-mono tracking-widest text-stone-600 uppercase">
                // EDOMAE TRADITION • 一期一会
              </div>
              <div className={getGridCols().container}>
                <div className={getGridCols().textCol}>
                  <div 
                    onClick={(e) => handleEdit(e, 'slogan', 'Lema')}
                    className={`inline-flex items-center gap-2 px-3 py-1 border border-stone-700 bg-stone-900 text-stone-300 text-[10px] font-mono uppercase tracking-widest ${editableClass('slogan')}`}
                  >
                    <Moon className="w-3.5 h-3.5 text-stone-400" />
                    <span>Barra Omakase • Máximo 10 Comensales</span>
                  </div>
                  <h1 
                    onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
                    className={`text-3xl ${isMobile ? 'text-3xl' : 'sm:text-5xl'} font-light text-stone-100 tracking-tight leading-tight ${editableClass('title')}`}
                  >
                    {restaurant.slogan || restaurant.name}
                  </h1>
                  <p 
                    onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                    className={`text-xs sm:text-sm text-stone-400 leading-relaxed max-w-lg font-light ${editableClass('slogan')}`}
                  >
                    {restaurant.description || 'La experiencia Omakase confía el menú por completo a las manos del Shokunin. Producto puro, arroz cocido con vinagre rojo akazu y corte exacto al milímetro.'}
                  </p>
                  
                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <button
                      onClick={handleBookingClick}
                      className={`px-6 py-3.5 bg-stone-100 hover:bg-white text-stone-950 font-bold text-xs tracking-wider uppercase transition shadow-xl cursor-pointer ${editableClass('cta_button')}`}
                    >
                      {restaurant.cta_text || 'Reservar Pase de Barra'}
                    </button>
                    <button
                      type="button"
                      onClick={scrollToCarta}
                      className="px-5 py-3.5 border border-stone-700 text-stone-300 hover:text-white hover:border-stone-500 text-xs tracking-wider uppercase transition cursor-pointer"
                    >
                      Ver Secuencia de Pases
                    </button>
                  </div>
                </div>

                <div 
                  onClick={(e) => handleEdit(e, 'hero_image', 'Imagen de Portada')}
                  className={`${getGridCols().imageCol} ${editableClass('hero_image')}`}
                  title={isPreview ? "Pulsa para editar la foto de portada" : undefined}
                >
                  <div className={`relative border border-stone-800 p-2 bg-stone-900/60 shadow-2xl ${heroImageRounded}`}>
                    <img 
                      src={heroImage} 
                      alt={restaurant.name}
                      className={`w-full ${getImageHeight(heroImageSize)} object-cover filter contrast-105 rounded`}
                    />
                    <div className="absolute bottom-4 left-4 right-4 bg-black/85 backdrop-blur-md p-3 border border-stone-800 text-[11px] font-mono text-stone-300 flex items-center justify-between">
                      <span>CORTE DEL DÍA: O-TORO DE ALMADRABA</span>
                      <span className="text-amber-400 font-bold">TEMPERATURA 36.5°C</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          BESPOKE HERO ARCHETYPE 4: STREET SMASH & WOK (KINETIC / RETRO DINER)
         ───────────────────────────────────────────────────────────── */}
      {archetype === 'street_smash' && (
        <section className="relative pt-6 pb-12 px-4 max-w-6xl mx-auto">
          {/* Kinetic Marquee Ticker */}
          <div className="mb-6 overflow-hidden rounded-xl bg-yellow-400 text-black py-2.5 font-black uppercase text-xs tracking-widest shadow-lg flex items-center whitespace-nowrap">
            <div className="flex items-center gap-8 animate-marquee">
              <span>100% CARNE DE VACA MADURADA</span>
              <span>•</span>
              <span>SMASH CRUNCHY EDGES</span>
              <span>•</span>
              <span>PAN BRIOCHE DE MANTEQUILLA</span>
              <span>•</span>
              <span>DOUBLE CHEESE MELT</span>
              <span>•</span>
              <span>PATATAS CORTE CASERO TRIPLE COCCIÓN</span>
              <span>•</span>
              <span>PEDIDOS ONLINE & TAKE AWAY</span>
            </div>
          </div>

          <div className="relative rounded-3xl border-2 border-yellow-400 bg-zinc-950 p-6 sm:p-12 shadow-[8px_8px_0px_#facc15] overflow-hidden">
            {heroLayout === 'centered' ? (
              <div 
                onClick={(e) => handleEdit(e, 'hero_image', 'Imagen de Portada')}
                className={`min-h-[440px] flex flex-col justify-end text-center relative overflow-hidden p-6 sm:p-12 ${editableClass('hero_image')}`}
                title={isPreview ? "Pulsa para editar la foto de portada" : undefined}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center -z-10 scale-105 transition duration-1000 opacity-40"
                  style={{ backgroundImage: `url(${heroImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/30 -z-10" />
                <div className="max-w-2xl space-y-4 mx-auto flex flex-col items-center">
                  <div 
                    onClick={(e) => handleEdit(e, 'slogan', 'Lema')}
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-md bg-yellow-400/20 border border-yellow-400 text-yellow-300 text-xs font-black uppercase tracking-wider ${editableClass('slogan')}`}
                  >
                    <Flame className="w-4 h-4 fill-yellow-400" />
                    <span>SMASH CULTURE // CRUNCHY EDGES</span>
                  </div>
                  <h1 
                    onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
                    className={`text-4xl ${isMobile ? 'text-3xl' : 'sm:text-6xl'} font-black text-white uppercase tracking-tight leading-none ${editableClass('title')}`}
                  >
                    {restaurant.slogan || restaurant.name}
                  </h1>
                  <p 
                    onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                    className={`text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-lg font-medium ${editableClass('slogan')}`}
                  >
                    {restaurant.description || 'Carne picada fresca a diario en el local, aplastada a fuego vivo a 260°C para lograr la auténtica reacción Maillard.'}
                  </p>
                  <div className="pt-2 flex flex-wrap justify-center items-center gap-3">
                    <button
                      onClick={handleBookingClick}
                      className={`px-6 py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-wider transition shadow-lg cursor-pointer ${editableClass('cta_button')}`}
                    >
                      {restaurant.cta_text || '¡Pedir Mesa / Comer Aquí!'}
                    </button>
                    <button
                      type="button"
                      onClick={scrollToCarta}
                      className="px-5 py-3.5 rounded-xl border-2 border-white/20 hover:border-white text-white font-bold text-xs uppercase transition cursor-pointer"
                    >
                      Ver Burgers & Combos
                    </button>
                  </div>
                </div>
              </div>
            ) : heroLayout === 'minimal' ? (
              <div className="max-w-2xl space-y-4">
                <div 
                  onClick={(e) => handleEdit(e, 'slogan', 'Lema')}
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-md bg-yellow-400/20 border border-yellow-400 text-yellow-300 text-xs font-black uppercase tracking-wider ${editableClass('slogan')}`}
                >
                  <Flame className="w-4 h-4 fill-yellow-400" />
                  <span>SMASH CULTURE // CRUNCHY EDGES</span>
                </div>
                <h1 
                  onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
                  className={`text-4xl ${isMobile ? 'text-3xl' : 'sm:text-5xl'} font-black text-white uppercase tracking-tight leading-none ${editableClass('title')}`}
                >
                  {restaurant.slogan || restaurant.name}
                </h1>
                <p 
                  onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                  className={`text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-lg font-medium ${editableClass('slogan')}`}
                >
                  {restaurant.description || 'Carne picada fresca a diario en el local, aplastada a fuego vivo a 260°C para lograr la auténtica reacción Maillard.'}
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleBookingClick}
                    className={`px-6 py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-wider transition shadow-lg cursor-pointer ${editableClass('cta_button')}`}
                  >
                    {restaurant.cta_text || '¡Pedir Mesa / Comer Aquí!'}
                  </button>
                  <button
                    type="button"
                    onClick={scrollToCarta}
                    className="px-5 py-3.5 rounded-xl border-2 border-white/20 hover:border-white text-white font-bold text-xs uppercase transition cursor-pointer"
                  >
                    Ver Burgers & Combos
                  </button>
                </div>
              </div>
            ) : (
              <div className={getGridCols().container}>
                <div className={getGridCols().textCol}>
                  <div 
                    onClick={(e) => handleEdit(e, 'slogan', 'Lema')}
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-md bg-yellow-400/20 border border-yellow-400 text-yellow-300 text-xs font-black uppercase tracking-wider ${editableClass('slogan')}`}
                  >
                    <Flame className="w-4 h-4 fill-yellow-400" />
                    <span>SMASH CULTURE // CRUNCHY EDGES</span>
                  </div>
                  <h1 
                    onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
                    className={`text-4xl ${isMobile ? 'text-3xl' : 'sm:text-6xl'} font-black text-white uppercase tracking-tight leading-none ${editableClass('title')}`}
                  >
                    {restaurant.slogan || restaurant.name}
                  </h1>
                  <p 
                    onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                    className={`text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-lg font-medium ${editableClass('slogan')}`}
                  >
                    {restaurant.description || 'Carne picada fresca a diario en el local, aplastada a fuego vivo a 260°C para lograr la auténtica reacción Maillard. Crujiente por fuera, jugo puro por dentro.'}
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={handleBookingClick}
                      className={`px-6 py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-wider transition shadow-lg active:translate-y-1 cursor-pointer ${editableClass('cta_button')}`}
                    >
                      {restaurant.cta_text || '¡Pedir Mesa / Comer Aquí!'}
                    </button>
                    <button
                      type="button"
                      onClick={scrollToCarta}
                      className="px-5 py-3.5 rounded-xl border-2 border-white/20 hover:border-white text-white font-bold text-xs uppercase transition cursor-pointer"
                    >
                      Ver Burgers & Combos
                    </button>
                  </div>
                </div>

                <div 
                  onClick={(e) => handleEdit(e, 'hero_image', 'Imagen de Portada')}
                  className={`${getGridCols().imageCol} ${editableClass('hero_image')}`}
                  title={isPreview ? "Pulsa para editar la foto de portada" : undefined}
                >
                  <div className={`relative ${heroImageRounded} overflow-hidden border-2 border-white/10 shadow-2xl`}>
                    <img 
                      src={heroImage} 
                      alt={restaurant.name}
                      className={`w-full ${getImageHeight(heroImageSize)} object-cover`}
                    />
                    <div className="absolute top-3 right-3 bg-yellow-400 text-black font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider rotate-3 shadow-md">
                      Top Ventas
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          BESPOKE HERO ARCHETYPE 5: COASTAL LONJA (MEDITERRÁNEO & MAR)
         ───────────────────────────────────────────────────────────── */}
      {archetype === 'coastal_lonja' && (
        <section className="relative pt-8 sm:pt-10 pb-16 px-4 max-w-6xl mx-auto">
          <div className="rounded-3xl border border-sky-800/60 bg-gradient-to-b from-sky-950/60 to-zinc-950 p-6 sm:p-12 shadow-2xl relative overflow-hidden">
            {heroLayout === 'minimal' ? (
              <div className="max-w-3xl mx-auto text-center space-y-4 py-8">
                <div 
                  onClick={(e) => handleEdit(e, 'slogan', 'Lema')}
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/40 bg-sky-500/10 text-sky-300 text-xs font-mono ${editableClass('slogan')}`}
                >
                  <Fish className="w-3.5 h-3.5 text-sky-400" />
                  <span>Pesca del Día // Subasta de Lonja 06:00 AM</span>
                </div>
                <h1 
                  onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
                  className={`text-3xl ${isMobile ? 'text-2xl' : 'sm:text-5xl'} font-extrabold text-white tracking-tight ${editableClass('title')}`}
                >
                  {restaurant.slogan || restaurant.name}
                </h1>
                <p 
                  onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                  className={`text-xs sm:text-sm text-sky-100/70 leading-relaxed max-w-xl mx-auto ${editableClass('slogan')}`}
                >
                  {restaurant.description || 'Gamba blanca de la costa de Huelva, carabineros de profundidad, arroces en su punto exacto al fuego y pescados salvajes a la sal o a la brasa.'}
                </p>
                <div className="flex justify-center flex-wrap items-center gap-3 pt-3">
                  <button
                    onClick={handleBookingClick}
                    className={`px-6 py-3 rounded-2xl bg-sky-400 hover:bg-sky-300 text-black font-bold text-xs transition shadow-[0_0_20px_rgba(56,189,248,0.4)] cursor-pointer ${editableClass('cta_button')}`}
                  >
                    {restaurant.cta_text || 'Reservar Mesa con Salitre'}
                  </button>
                  <button
                    type="button"
                    onClick={scrollToCarta}
                    className="px-5 py-3 rounded-2xl border border-sky-500/30 bg-sky-950/40 text-sky-200 text-xs font-semibold hover:border-sky-400 transition cursor-pointer"
                  >
                    Pizarra de la Lonja
                  </button>
                </div>
              </div>
            ) : heroLayout === 'centered' ? (
              <div className="space-y-6">
                <div 
                  onClick={(e) => handleEdit(e, 'hero_image', 'Imagen de Portada')}
                  className={`w-full rounded-2xl overflow-hidden border border-sky-700/40 shadow-2xl relative ${editableClass('hero_image')}`}
                  title={isPreview ? "Pulsa para editar la foto de portada" : undefined}
                >
                  <img 
                    src={heroImage} 
                    alt={restaurant.name}
                    className={`w-full ${getImageHeight(heroImageSize)} object-cover`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                    <span className="text-xs text-sky-300 font-mono">Lonja del Cantábrico y Golfo de Cádiz</span>
                  </div>
                </div>
                <div className="text-center space-y-3 max-w-2xl mx-auto">
                  <h1 
                    onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
                    className={`text-3xl ${isMobile ? 'text-2xl' : 'sm:text-5xl'} font-extrabold text-white tracking-tight ${editableClass('title')}`}
                  >
                    {restaurant.slogan || restaurant.name}
                  </h1>
                  <p 
                    onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                    className={`text-xs sm:text-sm text-sky-100/70 leading-relaxed ${editableClass('slogan')}`}
                  >
                    {restaurant.description || 'Gamba blanca de la costa de Huelva, carabineros de profundidad y pescados salvajes a la brasa.'}
                  </p>
                  <div className="flex justify-center flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={handleBookingClick}
                      className={`px-6 py-3 rounded-2xl bg-sky-400 hover:bg-sky-300 text-black font-bold text-xs transition shadow-[0_0_20px_rgba(56,189,248,0.4)] cursor-pointer ${editableClass('cta_button')}`}
                    >
                      {restaurant.cta_text || 'Reservar Mesa con Salitre'}
                    </button>
                    <button
                      type="button"
                      onClick={scrollToCarta}
                      className="px-5 py-3 rounded-2xl border border-sky-500/30 bg-sky-950/40 text-sky-200 text-xs font-semibold hover:border-sky-400 transition cursor-pointer"
                    >
                      Pizarra de la Lonja
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className={getGridCols().container}>
                <div className={`${getGridCols().textCol} space-y-4`}>
                  <div 
                    onClick={(e) => handleEdit(e, 'slogan', 'Lema')}
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/40 bg-sky-500/10 text-sky-300 text-xs font-mono ${editableClass('slogan')}`}
                  >
                    <Fish className="w-3.5 h-3.5 text-sky-400" />
                    <span>Pesca del Día // Subasta de Lonja 06:00 AM</span>
                  </div>
                  <h1 
                    onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
                    className={`text-3xl ${isMobile ? 'text-2xl' : 'sm:text-5xl'} font-extrabold text-white tracking-tight ${editableClass('title')}`}
                  >
                    {restaurant.slogan || restaurant.name}
                  </h1>
                  <p 
                    onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                    className={`text-xs sm:text-sm text-sky-100/70 leading-relaxed ${editableClass('slogan')}`}
                  >
                    {restaurant.description || 'Gamba blanca de la costa de Huelva, carabineros de profundidad, arroces en su punto exacto al fuego y pescados salvajes a la sal o a la brasa.'}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={handleBookingClick}
                      className={`px-6 py-3 rounded-2xl bg-sky-400 hover:bg-sky-300 text-black font-bold text-xs transition shadow-[0_0_20px_rgba(56,189,248,0.4)] cursor-pointer ${editableClass('cta_button')}`}
                    >
                      {restaurant.cta_text || 'Reservar Mesa con Salitre'}
                    </button>
                    <button
                      type="button"
                      onClick={scrollToCarta}
                      className="px-5 py-3 rounded-2xl border border-sky-500/30 bg-sky-950/40 text-sky-200 text-xs font-semibold hover:border-sky-400 transition cursor-pointer"
                    >
                      Pizarra de la Lonja
                    </button>
                  </div>
                </div>

                <div 
                  onClick={(e) => handleEdit(e, 'hero_image', 'Imagen de Portada')}
                  className={`${getGridCols().imageCol} ${editableClass('hero_image')}`}
                  title={isPreview ? "Pulsa para editar la foto de portada" : undefined}
                >
                  <div className={`rounded-2xl overflow-hidden border border-sky-700/40 shadow-2xl shrink-0`}>
                    <img 
                      src={heroImage} 
                      alt={restaurant.name}
                      className={`w-full ${getImageHeight(heroImageSize)} object-cover`}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          BESPOKE HERO ARCHETYPE 6: CYBERPUNK HUD (SCI-FI TERMINAL)
         ───────────────────────────────────────────────────────────── */}
      {archetype === 'cyber_hud' && (
        <section className="relative pt-8 pb-14 px-4 max-w-6xl mx-auto font-mono">
          <div className="border border-cyan-500/50 bg-black/90 p-5 sm:p-10 shadow-[0_0_30px_rgba(6,182,212,0.25)] relative">
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

            {heroLayout === 'minimal' ? (
              <div className="space-y-4 max-w-2xl mx-auto text-center py-6">
                <div 
                  onClick={(e) => handleEdit(e, 'slogan', 'Lema')}
                  className={`inline-block px-2.5 py-1 bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-[11px] uppercase tracking-wider ${editableClass('slogan')}`}
                >
                  [ PROTOCOLO MIXOLOGÍA EXPERIMENTAL ]
                </div>
                <h1 
                  onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
                  className={`text-3xl ${isMobile ? 'text-2xl' : 'sm:text-5xl'} font-black text-white tracking-wider uppercase ${editableClass('title')}`}
                >
                  {restaurant.slogan || restaurant.name}
                </h1>
                <p 
                  onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                  className={`text-xs text-zinc-400 leading-relaxed max-w-md mx-auto font-sans ${editableClass('slogan')}`}
                >
                  {restaurant.description || 'Infusiones criogénicas, destilados ultrasónicos y gastronomía sintética de alta fidelidad sensorial. Bienvenido al futuro de la noche.'}
                </p>
                <div className="pt-2 flex justify-center flex-wrap items-center gap-3">
                  <button
                    onClick={handleBookingClick}
                    className={`px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs uppercase tracking-widest transition shadow-[0_0_20px_#06b6d4] cursor-pointer ${editableClass('cta_button')}`}
                  >
                    {restaurant.cta_text || '[ INICIAR_RESERVA ]'}
                  </button>
                  <button
                    type="button"
                    onClick={scrollToCarta}
                    className="px-5 py-3 border border-cyan-500/50 bg-black text-cyan-400 hover:bg-cyan-950/40 text-xs uppercase tracking-wider transition cursor-pointer"
                  >
                    [ VER_REGISTRO_CARTA ]
                  </button>
                </div>
              </div>
            ) : heroLayout === 'centered' ? (
              <div className="space-y-6">
                <div 
                  onClick={(e) => handleEdit(e, 'hero_image', 'Imagen de Portada')}
                  className={`relative border border-cyan-500/40 p-1 bg-zinc-950 ${editableClass('hero_image')}`}
                  title={isPreview ? "Pulsa para editar la foto de portada" : undefined}
                >
                  <img 
                    src={heroImage} 
                    alt={restaurant.name}
                    className={`w-full ${getImageHeight(heroImageSize)} object-cover filter brightness-90 contrast-125`}
                  />
                  <div className="absolute bottom-2 left-2 text-[9px] text-cyan-400 font-mono bg-black/70 px-2 py-0.5">
                    STATUS: OPTIMAL_ATMOSPHERE // DATA_FEED_OK
                  </div>
                </div>
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                  <h1 
                    onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
                    className={`text-3xl ${isMobile ? 'text-2xl' : 'sm:text-5xl'} font-black text-white tracking-wider uppercase ${editableClass('title')}`}
                  >
                    {restaurant.slogan || restaurant.name}
                  </h1>
                  <p 
                    onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                    className={`text-xs text-zinc-400 leading-relaxed max-w-md mx-auto font-sans ${editableClass('slogan')}`}
                  >
                    {restaurant.description || 'Gastronomía sintética y mixología avanzada.'}
                  </p>
                  <div className="pt-2 flex justify-center flex-wrap items-center gap-3">
                    <button
                      onClick={handleBookingClick}
                      className={`px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs uppercase tracking-widest transition shadow-[0_0_20px_#06b6d4] cursor-pointer ${editableClass('cta_button')}`}
                    >
                      {restaurant.cta_text || '[ INICIAR_RESERVA ]'}
                    </button>
                    <button
                      type="button"
                      onClick={scrollToCarta}
                      className="px-5 py-3 border border-cyan-500/50 bg-black text-cyan-400 hover:bg-cyan-950/40 text-xs uppercase tracking-wider transition cursor-pointer"
                    >
                      [ VER_REGISTRO_CARTA ]
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className={getGridCols().container}>
                <div className={`${getGridCols().textCol} space-y-4`}>
                  <div 
                    onClick={(e) => handleEdit(e, 'slogan', 'Lema')}
                    className={`inline-block px-2.5 py-1 bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-[11px] uppercase tracking-wider ${editableClass('slogan')}`}
                  >
                    [ PROTOCOLO MIXOLOGÍA EXPERIMENTAL ]
                  </div>
                  <h1 
                    onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
                    className={`text-3xl ${isMobile ? 'text-2xl' : 'sm:text-5xl'} font-black text-white tracking-wider uppercase ${editableClass('title')}`}
                  >
                    {restaurant.slogan || restaurant.name}
                  </h1>
                  <p 
                    onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                    className={`text-xs text-zinc-400 leading-relaxed max-w-md font-sans ${editableClass('slogan')}`}
                  >
                    {restaurant.description || 'Infusiones criogénicas, destilados ultrasónicos y gastronomía sintética de alta fidelidad sensorial. Bienvenido al futuro de la noche.'}
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={handleBookingClick}
                      className={`px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs uppercase tracking-widest transition shadow-[0_0_20px_#06b6d4] cursor-pointer ${editableClass('cta_button')}`}
                    >
                      {restaurant.cta_text || '[ INICIAR_RESERVA ]'}
                    </button>
                    <button
                      type="button"
                      onClick={scrollToCarta}
                      className="px-5 py-3 border border-cyan-500/50 bg-black text-cyan-400 hover:bg-cyan-950/40 text-xs uppercase tracking-wider transition cursor-pointer"
                    >
                      [ VER_REGISTRO_CARTA ]
                    </button>
                  </div>
                </div>

                <div 
                  onClick={(e) => handleEdit(e, 'hero_image', 'Imagen de Portada')}
                  className={`${getGridCols().imageCol} relative ${editableClass('hero_image')}`}
                  title={isPreview ? "Pulsa para editar la foto de portada" : undefined}
                >
                  <div className="relative border border-cyan-500/40 p-1 bg-zinc-950">
                    <img 
                      src={heroImage} 
                      alt={restaurant.name}
                      className={`w-full ${getImageHeight(heroImageSize)} object-cover filter brightness-90 contrast-125`}
                    />
                    <div className="absolute bottom-2 left-2 text-[9px] text-cyan-400 font-mono">
                      STATUS: OPTIMAL_ATMOSPHERE
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          BESPOKE HERO ARCHETYPE 7: BISTRO PARISIEN (ART DÉCO & GOLD)
         ───────────────────────────────────────────────────────────── */}
      {archetype === 'bistro_paris' && (
        <section className="relative pt-10 pb-16 px-4 max-w-5xl mx-auto font-serif">
          <div className="p-6 sm:p-14 border border-amber-500/40 bg-[#061910] rounded-2xl shadow-2xl relative">
            {heroLayout === 'minimal' ? (
              <div className="text-center max-w-xl mx-auto space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Award className="w-6 h-6" />
                </div>
                <span 
                  onClick={(e) => handleEdit(e, 'slogan', 'Lema')}
                  className={`text-[11px] uppercase tracking-[0.25em] text-amber-400 font-sans block font-semibold ${editableClass('slogan')}`}
                >
                  Maison de Cuisine & Sommelier
                </span>
                <h1 
                  onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
                  className={`text-4xl ${isMobile ? 'text-3xl' : 'sm:text-6xl'} font-normal text-amber-100 tracking-normal ${editableClass('title')}`}
                >
                  {restaurant.name}
                </h1>
                <p 
                  onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                  className={`text-xs sm:text-sm text-stone-300 font-sans leading-relaxed font-light ${editableClass('slogan')}`}
                >
                  {restaurant.description || 'Un homenaje a la elegancia clásica parisina, donde cada salsa se elabora a fuego pausado durante 24 horas y cada copa se marida con precisión.'}
                </p>
                <div className="flex justify-center gap-4 pt-2 font-sans">
                  <button
                    onClick={handleBookingClick}
                    className={`px-7 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider transition shadow-xl cursor-pointer ${editableClass('cta_button')}`}
                  >
                    {restaurant.cta_text || 'Réserver Une Table'}
                  </button>
                  <button
                    type="button"
                    onClick={scrollToCarta}
                    className="px-6 py-3 rounded-xl border border-amber-500/40 text-amber-200 hover:border-amber-400 text-xs font-semibold transition cursor-pointer"
                  >
                    Consulter La Carte
                  </button>
                </div>
              </div>
            ) : heroLayout === 'centered' ? (
              <div className="space-y-6">
                <div 
                  onClick={(e) => handleEdit(e, 'hero_image', 'Imagen de Portada')}
                  className={`w-full rounded-xl overflow-hidden border border-amber-500/40 shadow-2xl ${editableClass('hero_image')}`}
                  title={isPreview ? "Pulsa para editar la foto de portada" : undefined}
                >
                  <img 
                    src={heroImage} 
                    alt={restaurant.name}
                    className={`w-full ${getImageHeight(heroImageSize)} object-cover`}
                  />
                </div>
                <div className="text-center space-y-4 max-w-xl mx-auto">
                  <div className="w-10 h-10 mx-auto rounded-full border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <h1 
                    onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
                    className={`text-4xl ${isMobile ? 'text-3xl' : 'sm:text-6xl'} font-normal text-amber-100 ${editableClass('title')}`}
                  >
                    {restaurant.name}
                  </h1>
                  <p 
                    onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                    className={`text-xs sm:text-sm text-stone-300 font-sans leading-relaxed ${editableClass('slogan')}`}
                  >
                    {restaurant.description || 'Elegancia clásica y alta gastronomía francesa.'}
                  </p>
                  <div className="flex justify-center gap-4 pt-2 font-sans">
                    <button
                      onClick={handleBookingClick}
                      className={`px-7 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider transition shadow-xl cursor-pointer ${editableClass('cta_button')}`}
                    >
                      {restaurant.cta_text || 'Réserver Une Table'}
                    </button>
                    <button
                      type="button"
                      onClick={scrollToCarta}
                      className="px-6 py-3 rounded-xl border border-amber-500/40 text-amber-200 hover:border-amber-400 text-xs font-semibold transition cursor-pointer"
                    >
                      Consulter La Carte
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className={getGridCols().container}>
                <div className={`${getGridCols().textCol} space-y-4`}>
                  <div className="w-10 h-10 rounded-full border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <span 
                    onClick={(e) => handleEdit(e, 'slogan', 'Lema')}
                    className={`text-[11px] uppercase tracking-[0.25em] text-amber-400 font-sans block font-semibold ${editableClass('slogan')}`}
                  >
                    Maison de Cuisine & Sommelier
                  </span>
                  <h1 
                    onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
                    className={`text-3xl ${isMobile ? 'text-2xl' : 'sm:text-5xl'} font-normal text-amber-100 tracking-normal ${editableClass('title')}`}
                  >
                    {restaurant.name}
                  </h1>
                  <p 
                    onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                    className={`text-xs sm:text-sm text-stone-300 font-sans leading-relaxed font-light ${editableClass('slogan')}`}
                  >
                    {restaurant.description || 'Un homenaje a la elegancia clásica parisina, donde cada salsa se elabora a fuego pausado.'}
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2 font-sans">
                    <button
                      onClick={handleBookingClick}
                      className={`px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider transition shadow-xl cursor-pointer ${editableClass('cta_button')}`}
                    >
                      {restaurant.cta_text || 'Réserver Une Table'}
                    </button>
                    <button
                      type="button"
                      onClick={scrollToCarta}
                      className="px-5 py-3 rounded-xl border border-amber-500/40 text-amber-200 hover:border-amber-400 text-xs font-semibold transition cursor-pointer"
                    >
                      Consulter La Carte
                    </button>
                  </div>
                </div>

                <div 
                  onClick={(e) => handleEdit(e, 'hero_image', 'Imagen de Portada')}
                  className={`${getGridCols().imageCol} ${editableClass('hero_image')}`}
                  title={isPreview ? "Pulsa para editar la foto de portada" : undefined}
                >
                  <div className="rounded-xl overflow-hidden border border-amber-500/40 shadow-2xl">
                    <img 
                      src={heroImage} 
                      alt={restaurant.name}
                      className={`w-full ${getImageHeight(heroImageSize)} object-cover`}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          BESPOKE HERO ARCHETYPE 8: ASADOR PRIME (EMBER & DRY AGED)
         ───────────────────────────────────────────────────────────── */}
      {archetype === 'asador_prime' && (
        <section className="relative pt-10 pb-16 px-4 max-w-6xl mx-auto">
          <div className="bg-[#230906] border border-red-950/80 p-6 sm:p-12 rounded-2xl shadow-2xl">
            {heroLayout === 'minimal' ? (
              <div className="max-w-2xl mx-auto text-center space-y-4 py-6">
                <div 
                  onClick={(e) => handleEdit(e, 'slogan', 'Lema')}
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-950/60 border border-red-600/50 text-red-400 text-xs font-mono uppercase tracking-wider ${editableClass('slogan')}`}
                >
                  <Flame className="w-3.5 h-3.5 text-red-500" />
                  <span>CÁMARA DRY AGED // CORTES SELECCIONADOS</span>
                </div>
                <h1 
                  onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
                  className={`text-3xl ${isMobile ? 'text-2xl' : 'sm:text-5xl'} font-black text-white uppercase tracking-tight ${editableClass('title')}`}
                >
                  {restaurant.slogan || restaurant.name}
                </h1>
                <p 
                  onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                  className={`text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-lg mx-auto ${editableClass('slogan')}`}
                >
                  {restaurant.description || 'Carbón vegetal de encina a 400°C, maduraciones controladas desde 45 hasta 90 días, y el respeto más puro por la infiltración de grasa.'}
                </p>
                <div className="flex justify-center flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={handleBookingClick}
                    className={`px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider transition shadow-[0_0_25px_rgba(220,38,38,0.5)] cursor-pointer ${editableClass('cta_button')}`}
                  >
                    {restaurant.cta_text || 'Reservar Mesa de Brasa'}
                  </button>
                  <button
                    type="button"
                    onClick={scrollToCarta}
                    className="px-5 py-3.5 rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-200 text-xs font-bold uppercase hover:border-zinc-500 transition cursor-pointer"
                  >
                    Ver Cortes & Maduración
                  </button>
                </div>
              </div>
            ) : heroLayout === 'centered' ? (
              <div className="space-y-6">
                <div 
                  onClick={(e) => handleEdit(e, 'hero_image', 'Imagen de Portada')}
                  className={`rounded-xl overflow-hidden border border-red-900/60 shadow-2xl relative ${editableClass('hero_image')}`}
                  title={isPreview ? "Pulsa para editar la foto de portada" : undefined}
                >
                  <img 
                    src={heroImage} 
                    alt={restaurant.name}
                    className={`w-full ${getImageHeight(heroImageSize)} object-cover filter contrast-110`}
                  />
                  <div className="absolute bottom-3 left-3 right-3 bg-black/90 p-3 rounded-lg border border-red-900/40 text-[11px] font-mono text-zinc-300 flex justify-between items-center">
                    <span>MADURACIÓN CÁMARA 1:</span>
                    <span className="text-red-400 font-bold">60 DÍAS • BMS 7</span>
                  </div>
                </div>
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                  <h1 
                    onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
                    className={`text-3xl ${isMobile ? 'text-2xl' : 'sm:text-5xl'} font-black text-white uppercase tracking-tight ${editableClass('title')}`}
                  >
                    {restaurant.slogan || restaurant.name}
                  </h1>
                  <p 
                    onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                    className={`text-xs sm:text-sm text-zinc-300 leading-relaxed ${editableClass('slogan')}`}
                  >
                    {restaurant.description || 'Carbón vegetal de encina y cortes selectos madurados.'}
                  </p>
                  <div className="flex justify-center flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={handleBookingClick}
                      className={`px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider transition shadow-[0_0_25px_rgba(220,38,38,0.5)] cursor-pointer ${editableClass('cta_button')}`}
                    >
                      {restaurant.cta_text || 'Reservar Mesa de Brasa'}
                    </button>
                    <button
                      type="button"
                      onClick={scrollToCarta}
                      className="px-5 py-3.5 rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-200 text-xs font-bold uppercase hover:border-zinc-500 transition cursor-pointer"
                    >
                      Ver Cortes & Maduración
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className={getGridCols().container}>
                <div className={`${getGridCols().textCol} space-y-5`}>
                  <div 
                    onClick={(e) => handleEdit(e, 'slogan', 'Lema')}
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-950/60 border border-red-600/50 text-red-400 text-xs font-mono uppercase tracking-wider ${editableClass('slogan')}`}
                  >
                    <Flame className="w-3.5 h-3.5 text-red-500" />
                    <span>CÁMARA DRY AGED // CORTES SELECCIONADOS</span>
                  </div>
                  <h1 
                    onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
                    className={`text-3xl ${isMobile ? 'text-2xl' : 'sm:text-5xl'} font-black text-white uppercase tracking-tight ${editableClass('title')}`}
                  >
                    {restaurant.slogan || restaurant.name}
                  </h1>
                  <p 
                    onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                    className={`text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-lg ${editableClass('slogan')}`}
                  >
                    {restaurant.description || 'Carbón vegetal de encina a 400°C, maduraciones controladas desde 45 hasta 90 días, y el respeto más puro por la infiltración de grasa y el chuletón de raza.'}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={handleBookingClick}
                      className={`px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider transition shadow-[0_0_25px_rgba(220,38,38,0.5)] cursor-pointer ${editableClass('cta_button')}`}
                    >
                      {restaurant.cta_text || 'Reservar Mesa de Brasa'}
                    </button>
                    <button
                      type="button"
                      onClick={scrollToCarta}
                      className="px-5 py-3.5 rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-200 text-xs font-bold uppercase hover:border-zinc-500 transition cursor-pointer"
                    >
                      Ver Cortes & Maduración
                    </button>
                  </div>
                </div>

                <div 
                  onClick={(e) => handleEdit(e, 'hero_image', 'Imagen de Portada')}
                  className={`${getGridCols().imageCol} relative ${editableClass('hero_image')}`}
                  title={isPreview ? "Pulsa para editar la foto de portada" : undefined}
                >
                  <div className="rounded-xl overflow-hidden border border-red-900/60 shadow-2xl relative">
                    <img 
                      src={heroImage} 
                      alt={restaurant.name}
                      className={`w-full ${getImageHeight(heroImageSize)} object-cover filter contrast-110`}
                    />
                    <div className="absolute bottom-3 left-3 right-3 bg-black/90 p-3 rounded-lg border border-red-900/40 text-[11px] font-mono text-zinc-300 flex justify-between items-center">
                      <span>MADURACIÓN CÁMARA 1:</span>
                      <span className="text-red-400 font-bold">60 DÍAS • BMS 7</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          BESPOKE HERO ARCHETYPE 9: PASTICCERIA DOLCE & BRUNCH
         ───────────────────────────────────────────────────────────── */}
      {archetype === 'pasticceria_dolce' && (
        <section className="relative pt-10 pb-16 px-4 max-w-6xl mx-auto">
          <div className="rounded-3xl border border-pink-500/30 bg-gradient-to-tr from-[#2b1824] via-[#1c1218] to-[#251520] p-6 sm:p-12 shadow-2xl relative overflow-hidden">
            {heroLayout === 'minimal' ? (
              <div className="max-w-2xl mx-auto text-center space-y-4 py-6">
                <div 
                  onClick={(e) => handleEdit(e, 'slogan', 'Lema')}
                  className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-pink-400/40 bg-pink-400/10 text-pink-300 text-xs font-medium ${editableClass('slogan')}`}
                >
                  <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400/20" />
                  <span>Obrador Artesanal & Specialty Coffee</span>
                </div>
                <h1 
                  onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
                  className={`text-3xl ${isMobile ? 'text-2xl' : 'sm:text-5xl'} font-light text-pink-100 tracking-tight ${editableClass('title')}`}
                >
                  {restaurant.slogan || restaurant.name}
                </h1>
                <p 
                  onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                  className={`text-xs sm:text-sm text-pink-200/80 leading-relaxed max-w-lg mx-auto ${editableClass('slogan')}`}
                >
                  {restaurant.description || 'Croissants hojaldrados de mantequilla francesa, tostas de masa madre con huevos benedictinos y café de especialidad tostado semanalmente.'}
                </p>
                <div className="flex justify-center flex-wrap items-center gap-3 pt-3">
                  <button
                    onClick={handleBookingClick}
                    className={`px-6 py-3.5 rounded-full bg-pink-500 hover:bg-pink-400 text-white font-bold text-xs transition shadow-[0_0_25px_rgba(236,72,153,0.4)] cursor-pointer ${editableClass('cta_button')}`}
                  >
                    {restaurant.cta_text || 'Reservar Mesa Brunch'}
                  </button>
                  <button
                    type="button"
                    onClick={scrollToCarta}
                    className="px-5 py-3.5 rounded-full border border-pink-400/30 bg-white/5 text-pink-200 text-xs font-semibold hover:border-pink-300 transition cursor-pointer"
                  >
                    Ver Vitrina & Bebidas
                  </button>
                </div>
              </div>
            ) : heroLayout === 'centered' ? (
              <div className="space-y-6">
                <div 
                  onClick={(e) => handleEdit(e, 'hero_image', 'Imagen de Portada')}
                  className={`rounded-3xl overflow-hidden border border-pink-500/30 shadow-2xl p-2 bg-pink-950/20 ${editableClass('hero_image')}`}
                  title={isPreview ? "Pulsa para editar la foto de portada" : undefined}
                >
                  <img 
                    src={heroImage} 
                    alt={restaurant.name}
                    className={`w-full ${getImageHeight(heroImageSize)} object-cover rounded-2xl`}
                  />
                </div>
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                  <h1 
                    onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
                    className={`text-3xl ${isMobile ? 'text-2xl' : 'sm:text-5xl'} font-light text-pink-100 tracking-tight ${editableClass('title')}`}
                  >
                    {restaurant.slogan || restaurant.name}
                  </h1>
                  <p 
                    onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                    className={`text-xs sm:text-sm text-pink-200/80 leading-relaxed ${editableClass('slogan')}`}
                  >
                    {restaurant.description || 'Obrador de repostería fina y brunch.'}
                  </p>
                  <div className="flex justify-center flex-wrap items-center gap-3 pt-3">
                    <button
                      onClick={handleBookingClick}
                      className={`px-6 py-3.5 rounded-full bg-pink-500 hover:bg-pink-400 text-white font-bold text-xs transition shadow-[0_0_25px_rgba(236,72,153,0.4)] cursor-pointer ${editableClass('cta_button')}`}
                    >
                      {restaurant.cta_text || 'Reservar Mesa Brunch'}
                    </button>
                    <button
                      type="button"
                      onClick={scrollToCarta}
                      className="px-5 py-3.5 rounded-full border border-pink-400/30 bg-white/5 text-pink-200 text-xs font-semibold hover:border-pink-300 transition cursor-pointer"
                    >
                      Ver Vitrina & Bebidas
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className={getGridCols().container}>
                <div className={`${getGridCols().textCol} space-y-4`}>
                  <div 
                    onClick={(e) => handleEdit(e, 'slogan', 'Lema')}
                    className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-pink-400/40 bg-pink-400/10 text-pink-300 text-xs font-medium ${editableClass('slogan')}`}
                  >
                    <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400/20" />
                    <span>Obrador Artesanal & Specialty Coffee</span>
                  </div>
                  <h1 
                    onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
                    className={`text-3xl ${isMobile ? 'text-2xl' : 'sm:text-5xl'} font-light text-pink-100 tracking-tight ${editableClass('title')}`}
                  >
                    {restaurant.slogan || restaurant.name}
                  </h1>
                  <p 
                    onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                    className={`text-xs sm:text-sm text-pink-200/80 leading-relaxed max-w-lg ${editableClass('slogan')}`}
                  >
                    {restaurant.description || 'Croissants hojaldrados de mantequilla francesa, tostas de masa madre con huevos benedictinos y café de especialidad tostado semanalmente.'}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-3">
                    <button
                      onClick={handleBookingClick}
                      className={`px-6 py-3.5 rounded-full bg-pink-500 hover:bg-pink-400 text-white font-bold text-xs transition shadow-[0_0_25px_rgba(236,72,153,0.4)] cursor-pointer ${editableClass('cta_button')}`}
                    >
                      {restaurant.cta_text || 'Reservar Mesa Brunch'}
                    </button>
                    <button
                      type="button"
                      onClick={scrollToCarta}
                      className="px-5 py-3.5 rounded-full border border-pink-400/30 bg-white/5 text-pink-200 text-xs font-semibold hover:border-pink-300 transition cursor-pointer"
                    >
                      Ver Vitrina & Bebidas
                    </button>
                  </div>
                </div>

                <div 
                  onClick={(e) => handleEdit(e, 'hero_image', 'Imagen de Portada')}
                  className={`${getGridCols().imageCol} relative ${editableClass('hero_image')}`}
                  title={isPreview ? "Pulsa para editar la foto de portada" : undefined}
                >
                  <div className="rounded-3xl overflow-hidden border border-pink-500/30 shadow-2xl p-2 bg-pink-950/20">
                    <img 
                      src={heroImage} 
                      alt={restaurant.name}
                      className={`w-full ${getImageHeight(heroImageSize)} object-cover rounded-2xl`}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          BESPOKE HERO ARCHETYPE 10: CRAFT BREWERY & TAPROOM
         ───────────────────────────────────────────────────────────── */}
      {archetype === 'craft_brewery' && (
        <section className="relative pt-8 pb-14 px-4 max-w-6xl mx-auto font-mono">
          <div className="rounded-2xl border-2 border-amber-800/60 bg-[#251508] p-6 sm:p-12 shadow-2xl relative overflow-hidden">
            {heroLayout === 'minimal' ? (
              <div className="max-w-2xl mx-auto text-center space-y-4 py-6">
                <div 
                  onClick={(e) => handleEdit(e, 'slogan', 'Lema')}
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs uppercase tracking-widest font-bold ${editableClass('slogan')}`}
                >
                  <Beer className="w-4 h-4 text-amber-400" />
                  <span>Fábrica Cervecera // 12 Grifos en Rotación</span>
                </div>
                <h1 
                  onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
                  className={`text-3xl ${isMobile ? 'text-2xl' : 'sm:text-5xl'} font-black text-amber-100 uppercase tracking-tight ${editableClass('title')}`}
                >
                  {restaurant.slogan || restaurant.name}
                </h1>
                <p 
                  onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                  className={`text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-lg mx-auto font-sans ${editableClass('slogan')}`}
                >
                  {restaurant.description || 'Cerveza artesana fresca servida directamente desde nuestros tanques de maduración, combinada con bocados ahumados de pulled pork.'}
                </p>
                <div className="pt-2 flex justify-center flex-wrap items-center gap-3">
                  <button
                    onClick={handleBookingClick}
                    className={`px-6 py-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider transition shadow-xl cursor-pointer ${editableClass('cta_button')}`}
                  >
                    {restaurant.cta_text || 'Reservar Mesa Taproom'}
                  </button>
                  <button
                    type="button"
                    onClick={scrollToCarta}
                    className="px-5 py-3.5 rounded-lg border border-amber-700/60 text-amber-200 text-xs font-bold uppercase hover:bg-amber-950/40 transition cursor-pointer"
                  >
                    Pizarra de Cervezas
                  </button>
                </div>
              </div>
            ) : heroLayout === 'centered' ? (
              <div className="space-y-6">
                <div 
                  onClick={(e) => handleEdit(e, 'hero_image', 'Imagen de Portada')}
                  className={`rounded-xl overflow-hidden border border-amber-700/60 shadow-2xl p-1 bg-black/40 ${editableClass('hero_image')}`}
                  title={isPreview ? "Pulsa para editar la foto de portada" : undefined}
                >
                  <img 
                    src={heroImage} 
                    alt={restaurant.name}
                    className={`w-full ${getImageHeight(heroImageSize)} object-cover rounded-lg filter contrast-105`}
                  />
                  <div className="mt-2 bg-amber-950/80 p-2 text-[10px] text-amber-300 flex justify-between">
                    <span>LÚPULOS DE HOY: CITRA & MOSAIC</span>
                    <span className="font-bold">TEMP SERVICIO: 4°C</span>
                  </div>
                </div>
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                  <h1 
                    onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
                    className={`text-3xl ${isMobile ? 'text-2xl' : 'sm:text-5xl'} font-black text-amber-100 uppercase tracking-tight ${editableClass('title')}`}
                  >
                    {restaurant.slogan || restaurant.name}
                  </h1>
                  <p 
                    onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                    className={`text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans ${editableClass('slogan')}`}
                  >
                    {restaurant.description || 'Cerveza artesana fresca de tirador.'}
                  </p>
                  <div className="pt-2 flex justify-center flex-wrap items-center gap-3">
                    <button
                      onClick={handleBookingClick}
                      className={`px-6 py-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider transition shadow-xl cursor-pointer ${editableClass('cta_button')}`}
                    >
                      {restaurant.cta_text || 'Reservar Mesa Taproom'}
                    </button>
                    <button
                      type="button"
                      onClick={scrollToCarta}
                      className="px-5 py-3.5 rounded-lg border border-amber-700/60 text-amber-200 text-xs font-bold uppercase hover:bg-amber-950/40 transition cursor-pointer"
                    >
                      Pizarra de Cervezas
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className={getGridCols().container}>
                <div className={`${getGridCols().textCol} space-y-4`}>
                  <div 
                    onClick={(e) => handleEdit(e, 'slogan', 'Lema')}
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs uppercase tracking-widest font-bold ${editableClass('slogan')}`}
                  >
                    <Beer className="w-4 h-4 text-amber-400" />
                    <span>Fábrica Cervecera // 12 Grifos en Rotación</span>
                  </div>
                  <h1 
                    onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
                    className={`text-3xl ${isMobile ? 'text-2xl' : 'sm:text-5xl'} font-black text-amber-100 uppercase tracking-tight ${editableClass('title')}`}
                  >
                    {restaurant.slogan || restaurant.name}
                  </h1>
                  <p 
                    onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                    className={`text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-lg font-sans ${editableClass('slogan')}`}
                  >
                    {restaurant.description || 'Cerveza artesana fresca servida directamente desde nuestros tanques de maduración, combinada con bocados ahumados de pulled pork y patatas de taproom.'}
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={handleBookingClick}
                      className={`px-6 py-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider transition shadow-xl cursor-pointer ${editableClass('cta_button')}`}
                    >
                      {restaurant.cta_text || 'Reservar Mesa Taproom'}
                    </button>
                    <button
                      type="button"
                      onClick={scrollToCarta}
                      className="px-5 py-3.5 rounded-lg border border-amber-700/60 text-amber-200 text-xs font-bold uppercase hover:bg-amber-950/40 transition cursor-pointer"
                    >
                      Pizarra de Cervezas
                    </button>
                  </div>
                </div>

                <div 
                  onClick={(e) => handleEdit(e, 'hero_image', 'Imagen de Portada')}
                  className={`${getGridCols().imageCol} relative ${editableClass('hero_image')}`}
                  title={isPreview ? "Pulsa para editar la foto de portada" : undefined}
                >
                  <div className="rounded-xl overflow-hidden border border-amber-700/60 shadow-2xl p-1 bg-black/40">
                    <img 
                      src={heroImage} 
                      alt={restaurant.name}
                      className={`w-full ${getImageHeight(heroImageSize)} object-cover rounded-lg filter contrast-105`}
                    />
                    <div className="mt-2 bg-amber-950/80 p-2 text-[10px] text-amber-300 flex justify-between">
                      <span>LÚPULOS DE HOY: CITRA & MOSAIC</span>
                      <span className="font-bold">TEMP SERVICIO: 4°C</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}


      {/* ─────────────────────────────────────────────────────────────
          BESPOKE HEROES FOR REMAINING ARCHETYPES (GROUPED FALLBACK)
         ───────────────────────────────────────────────────────────── */}

      {/* ── BRUTALIST RAW: Giant acid-green typographic slab, no image ── */}
      {archetype === 'brutalist_raw' && (
        <section className="relative pt-10 pb-16 px-4 max-w-6xl mx-auto">
          <div className="relative border-4 border-[#ccff00] bg-black p-6 sm:p-12 overflow-hidden shadow-[8px_8px_0px_#ccff00]">
            {/* Marquee bar */}
            <div className="mb-8 overflow-hidden border-b-4 border-[#ccff00] pb-3">
              <div className="font-mono font-black text-[#ccff00] text-xs uppercase tracking-[0.3em] animate-pulse">
                ▶ RAW DESIGN // 0% COMPROMISE // NO FILTERS // BRUTALIST FOOD ◀ &nbsp;&nbsp; ▶ RAW DESIGN // 0% COMPROMISE ◀
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch">
              <div className="space-y-6 pr-0 lg:pr-8 border-r-0 lg:border-r-4 border-[#ccff00]">
                <div
                  onClick={(e) => handleEdit(e, 'slogan', 'Lema')}
                  className={`inline-block px-3 py-1 border-2 border-[#ccff00] text-[#ccff00] text-[10px] font-black uppercase tracking-[0.4em] ${editableClass('slogan')}`}
                >
                  {meta.badgeText}
                </div>
                <h1
                  onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
                  className={`text-[clamp(2.5rem,8vw,5.5rem)] font-black text-white leading-none uppercase tracking-tighter ${editableClass('title')}`}
                  style={{ textShadow: '4px 4px 0px #ccff00' }}
                >
                  {restaurant.slogan || restaurant.name}
                </h1>
                <p
                  onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                  className={`text-sm text-zinc-400 font-mono leading-relaxed max-w-lg ${editableClass('slogan')}`}
                >
                  {restaurant.description}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={handleBookingClick}
                    className={`px-7 py-4 border-2 border-white bg-[#ccff00] text-black text-xs font-black uppercase tracking-widest transition hover:bg-white cursor-pointer ${editableClass('cta_button')}`}
                  >
                    {restaurant.cta_text || 'RESERVAR'}
                  </button>
                  <button
                    type="button"
                    onClick={scrollToCarta}
                    className="px-6 py-4 border-2 border-zinc-600 text-zinc-300 text-xs font-black uppercase tracking-widest hover:border-white hover:text-white transition cursor-pointer"
                  >
                    VER CARTA
                  </button>
                </div>
              </div>
              <div className="hidden lg:flex items-center justify-center pl-8">
                <div className="text-[180px] leading-none font-black text-[#ccff00]/10 select-none" style={{ textShadow: '0 0 60px #ccff0040' }}>
                  RAW
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── MINIMALIST PURE: Full-bleed whitespace, giant type, no colour ── */}
      {archetype === 'minimalist_pure' && (
        <section className="relative pt-16 pb-20 px-4 max-w-5xl mx-auto">
          <div className="text-center space-y-8">
            <div
              onClick={(e) => handleEdit(e, 'slogan', 'Lema')}
              className={`inline-flex items-center gap-3 ${editableClass('slogan')}`}
            >
              <span className="h-px w-12 bg-white/30 inline-block" />
              <span className="text-[10px] font-mono tracking-[0.5em] text-zinc-400 uppercase">{meta.badgeText}</span>
              <span className="h-px w-12 bg-white/30 inline-block" />
            </div>
            <h1
              onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
              className={`text-[clamp(2.5rem,9vw,7rem)] font-thin text-white leading-none tracking-tighter ${editableClass('title')}`}
            >
              {restaurant.slogan || restaurant.name}
            </h1>
            <div
              onClick={(e) => handleEdit(e, 'hero_image', 'Imagen')}
              className={`mx-auto w-full max-w-2xl aspect-[16/7] overflow-hidden ${editableClass('hero_image')}`}
              title={isPreview ? 'Pulsa para editar la imagen' : undefined}
            >
              <img
                src={heroImage}
                alt={restaurant.name}
                className="w-full h-full object-cover filter grayscale contrast-125"
              />
            </div>
            <p
              onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
              className={`text-xs sm:text-sm text-zinc-500 leading-relaxed max-w-xl mx-auto font-light tracking-wide ${editableClass('slogan')}`}
            >
              {restaurant.description}
            </p>
            <div className="flex justify-center flex-wrap items-center gap-4 pt-4">
              <button
                onClick={handleBookingClick}
                className={`px-10 py-3.5 rounded-full border border-white text-white text-xs font-light uppercase tracking-[0.3em] hover:bg-white hover:text-black transition cursor-pointer ${editableClass('cta_button')}`}
              >
                {restaurant.cta_text || 'Reservar'}
              </button>
              <button
                type="button"
                onClick={scrollToCarta}
                className="px-8 py-3.5 rounded-full border border-zinc-700 text-zinc-400 text-xs font-light uppercase tracking-[0.3em] hover:border-zinc-400 hover:text-white transition cursor-pointer"
              >
                Carta Digital
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── VELVET LOUNGE: Dark-wine full cover with glow rim ── */}
      {archetype === 'velvet_lounge' && (
        <section className="relative pt-6 pb-14 px-4 max-w-6xl mx-auto">
          <div
            onClick={(e) => handleEdit(e, 'hero_image', 'Imagen de Portada')}
            className={`relative rounded-3xl overflow-hidden min-h-[500px] flex flex-col justify-end p-8 sm:p-14 border border-rose-900/60 shadow-[0_0_80px_rgba(225,29,72,0.2)] ${editableClass('hero_image')}`}
            title={isPreview ? 'Pulsa para editar la imagen' : undefined}
          >
            <div className="absolute inset-0 bg-cover bg-center -z-10" style={{ backgroundImage: `url(${heroImage})` }} />
            <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(135deg, rgba(10,3,6,0.97) 0%, rgba(30,8,16,0.85) 50%, rgba(10,3,6,0.97) 100%)' }} />
            {/* Velvet rim effect */}
            <div className="absolute inset-0 border-[3px] border-rose-900/30 rounded-3xl -z-5 pointer-events-none" style={{ boxShadow: 'inset 0 0 80px rgba(225,29,72,0.08)' }} />
            <div className="max-w-xl space-y-5">
              <div
                onClick={(e) => { e.stopPropagation(); handleEdit(e, 'slogan', 'Lema'); }}
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-rose-500/40 bg-rose-950/60 text-rose-300 text-[11px] font-serif italic tracking-wider ${editableClass('slogan')}`}
              >
                <Wine className="w-3.5 h-3.5" />
                <span>{meta.badgeText}</span>
              </div>
              <h1
                onClick={(e) => { e.stopPropagation(); handleEdit(e, 'title', 'Nombre'); }}
                className={`text-4xl sm:text-6xl font-black text-rose-50 leading-tight font-serif ${editableClass('title')}`}
                style={{ textShadow: '0 2px 40px rgba(225,29,72,0.4)' }}
              >
                {restaurant.slogan || restaurant.name}
              </h1>
              <p
                onClick={(e) => { e.stopPropagation(); handleEdit(e, 'slogan', 'Descripción'); }}
                className={`text-sm text-rose-200/70 leading-relaxed font-serif italic ${editableClass('slogan')}`}
              >
                {restaurant.description}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleBookingClick}
                  className={`px-8 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-serif italic font-semibold transition flex items-center gap-2 shadow-[0_0_30px_rgba(225,29,72,0.4)] cursor-pointer ${editableClass('cta_button')}`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{restaurant.cta_text || 'Reservar Mesa Privada'}</span>
                </button>
                <button
                  type="button"
                  onClick={scrollToCarta}
                  className="px-6 py-3.5 rounded-2xl border border-rose-900/60 bg-black/40 text-rose-200 text-xs font-serif italic hover:bg-rose-950/60 transition cursor-pointer"
                >
                  Ver Cartas
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── BODEGA ENOTECA: Purple-underground split layout, serif heavy ── */}
      {archetype === 'bodega_enoteca' && (
        <section className="relative pt-6 pb-14 px-4 max-w-6xl mx-auto font-serif">
          <div className="rounded-3xl border-2 border-purple-900/60 bg-[#110617] p-6 sm:p-12 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
              <div className="space-y-6">
                <div
                  onClick={(e) => handleEdit(e, 'slogan', 'Lema')}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/40 bg-purple-950/60 text-purple-300 text-xs font-mono ${editableClass('slogan')}`}
                >
                  <Wine className="w-3.5 h-3.5" />
                  <span>{meta.badgeText}</span>
                </div>
                <h1
                  onClick={(e) => handleEdit(e, 'title', 'Nombre')}
                  className={`text-4xl sm:text-6xl font-black text-purple-50 leading-tight italic ${editableClass('title')}`}
                >
                  {restaurant.slogan || restaurant.name}
                </h1>
                <p
                  onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                  className={`text-sm text-purple-200/70 leading-relaxed ${editableClass('slogan')}`}
                >
                  {restaurant.description}
                </p>
                <div className="grid grid-cols-3 gap-3 py-3 border-t border-purple-900/60">
                  {[['D.O.Ca Rioja', 'Selección'], ['Maduración', '+18 Meses'], ['Quesos', 'Artesanos']].map(([k, v]) => (
                    <div key={k} className="text-center p-2 rounded-xl bg-purple-950/60 border border-purple-800/40">
                      <div className="text-[10px] font-mono text-purple-400 uppercase">{k}</div>
                      <div className="text-xs font-bold text-purple-100 mt-0.5">{v}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleBookingClick}
                    className={`px-7 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold italic transition shadow-lg cursor-pointer ${editableClass('cta_button')}`}
                  >
                    {restaurant.cta_text || 'Reservar Cata Privada'}
                  </button>
                  <button type="button" onClick={scrollToCarta} className="px-5 py-3.5 rounded-xl border border-purple-700/50 text-purple-300 text-xs hover:bg-purple-900/40 transition cursor-pointer">Ver Bodega</button>
                </div>
              </div>
              <div
                onClick={(e) => handleEdit(e, 'hero_image', 'Imagen')}
                className={`${editableClass('hero_image')} relative`}
                title={isPreview ? 'Pulsa para editar' : undefined}
              >
                <div className="rounded-2xl overflow-hidden border-2 border-purple-700/40 shadow-[0_0_50px_rgba(147,51,234,0.25)]">
                  <img src={heroImage} alt={restaurant.name} className={`w-full ${getImageHeight(heroImageSize)} object-cover filter contrast-110`} />
                  <div className="p-3 bg-purple-950 border-t border-purple-800/40 text-[10px] font-mono text-purple-300 flex justify-between">
                    <span>CAVA CLIMATIZADA 14°C</span>
                    <span className="font-bold">D.O. PREMIUM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── SPECIALTY COFFEE: Nordic warm split, brew stats ── */}
      {archetype === 'specialty_coffee' && (
        <section className="relative pt-6 pb-14 px-4 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-amber-900/40 shadow-2xl">
            {/* Left: photo */}
            <div
              onClick={(e) => handleEdit(e, 'hero_image', 'Imagen')}
              className={`relative ${editableClass('hero_image')}`}
              title={isPreview ? 'Pulsa para editar' : undefined}
            >
              <img src={heroImage} alt={restaurant.name} className="w-full h-full min-h-[280px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#140d07]/70" />
            </div>
            {/* Right: content */}
            <div className="bg-[#1c1207] p-7 sm:p-10 flex flex-col justify-center space-y-5 border-l-0 lg:border-l border-amber-900/30">
              <div
                onClick={(e) => handleEdit(e, 'slogan', 'Lema')}
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-600/20 border border-amber-600/40 text-amber-300 text-[11px] font-mono uppercase tracking-widest ${editableClass('slogan')}`}
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>{meta.badgeText}</span>
              </div>
              <h1
                onClick={(e) => handleEdit(e, 'title', 'Nombre')}
                className={`text-3xl sm:text-5xl font-black text-amber-50 leading-tight ${editableClass('title')}`}
              >
                {restaurant.slogan || restaurant.name}
              </h1>
              <p
                onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                className={`text-sm text-amber-200/70 leading-relaxed ${editableClass('slogan')}`}
              >
                {restaurant.description}
              </p>
              <div className="grid grid-cols-3 gap-2 py-3 border-t border-amber-900/40">
                {[['SCA Score', '+88pts'], ['Origen', 'Finca Única'], ['Método', 'Pour-Over']].map(([k, v]) => (
                  <div key={k} className="text-center p-2 rounded-xl bg-amber-950/60 border border-amber-800/30">
                    <div className="text-[10px] font-mono text-amber-500 uppercase">{k}</div>
                    <div className="text-xs font-bold text-amber-100 mt-0.5">{v}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleBookingClick}
                  className={`px-6 py-3.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-black text-xs font-black uppercase tracking-wider transition cursor-pointer ${editableClass('cta_button')}`}
                >
                  {restaurant.cta_text || 'Reservar Mesa'}
                </button>
                <button type="button" onClick={scrollToCarta} className="px-5 py-3.5 rounded-lg border border-amber-700/50 text-amber-200 text-xs font-bold uppercase hover:bg-amber-950/40 transition cursor-pointer">Ver Carta</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── TECNODIEL TITANIUM: Emerald HUD with metrics ── */}
      {archetype === 'tecnodiel_titanium' && (
        <section className="relative pt-8 pb-16 px-4 max-w-6xl mx-auto">
          <div className="relative rounded-3xl border border-emerald-500/30 bg-[#020a05] p-6 sm:p-12 overflow-hidden shadow-[0_0_60px_rgba(16,185,129,0.15)]">
            <div className="absolute inset-0 pointer-events-none opacity-15" style={{ backgroundImage: 'linear-gradient(to right, #10b98125 1px, transparent 1px), linear-gradient(to bottom, #10b98125 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_10px_#10b981]" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-mono uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>TECNODIEL // PERFORMANCE WEB ENGINE TITANIUM</span>
                </div>
                <h1
                  onClick={(e) => handleEdit(e, 'title', 'Nombre')}
                  className={`text-4xl sm:text-6xl font-black text-white leading-tight tracking-tight ${editableClass('title')}`}
                  style={{ textShadow: '0 0 40px rgba(16,185,129,0.3)' }}
                >
                  {restaurant.slogan || restaurant.name}
                </h1>
                <p
                  onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                  className={`text-sm text-emerald-100/60 leading-relaxed ${editableClass('slogan')}`}
                >
                  {restaurant.description}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[['Velocidad', '0.2s', 'LCP'], ['Conversión', '+340%', 'vs PDF'], ['Uptime', '99.99%', 'SLA'], ['QR Mesas', '∞', 'Escaneos']].map(([label, val, sub]) => (
                    <div key={label} className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/25 text-center">
                      <div className="text-[10px] font-mono text-emerald-500 uppercase">{label}</div>
                      <div className="text-lg font-black text-emerald-300 my-0.5">{val}</div>
                      <div className="text-[9px] font-mono text-emerald-600">{sub}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleBookingClick}
                    className={`px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold tracking-tight transition flex items-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.4)] cursor-pointer ${editableClass('cta_button')}`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{restaurant.cta_text || 'Reservar Mesa'}</span>
                  </button>
                  <button type="button" onClick={scrollToCarta} className="px-6 py-3.5 rounded-xl border border-emerald-500/30 text-emerald-300 text-xs font-bold hover:bg-emerald-950/40 transition cursor-pointer">Ver Carta QR</button>
                </div>
              </div>
              <div
                onClick={(e) => handleEdit(e, 'hero_image', 'Imagen')}
                className={`lg:col-span-5 ${editableClass('hero_image')}`}
                title={isPreview ? 'Pulsa para editar' : undefined}
              >
                <div className="rounded-2xl overflow-hidden border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                  <img src={heroImage} alt={restaurant.name} className={`w-full ${getImageHeight(heroImageSize)} object-cover filter contrast-110 brightness-90`} />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── GENERIC FALLBACK for remaining archetypes (pizza, trattoria, taqueria, beach, pulperia, etc.) ── */}
      {(!['cinematic_scroll', 'taberna_iberica', 'nocturne', 'omakase', 'street_smash', 'coastal_lonja', 'cyber_hud', 'bistro_paris', 'asador_prime', 'pasticceria_dolce', 'craft_brewery', 'brutalist_raw', 'minimalist_pure', 'velvet_lounge', 'bodega_enoteca', 'specialty_coffee', 'tecnodiel_titanium'].includes(archetype)) && (
        <section className="relative pt-8 sm:pt-12 pb-16 px-4 max-w-6xl mx-auto">
          {heroLayout === 'minimal' ? (
            <div className="p-8 sm:p-14 rounded-3xl border border-white/10 bg-zinc-950/80 text-center max-w-3xl mx-auto space-y-4">
              <div
                onClick={(e) => handleEdit(e, 'slogan', 'Lema')}
                className={`inline-flex items-center gap-2 px-3 py-1 ${meta.badgeShape} text-[11px] font-mono border backdrop-blur-md uppercase tracking-wider ${editableClass('slogan')}`}
                style={{ borderColor: `${primaryColor}40`, backgroundColor: `${primaryColor}20`, color: accentColor }}
              >
                <IconComponent className="w-3.5 h-3.5" />
                <span>{meta.badgeText}</span>
              </div>
              <h1
                onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
                className={`text-3xl ${isMobile ? 'text-2xl' : 'sm:text-5xl'} font-black text-white tracking-tight leading-tight ${editableClass('title')}`}
              >
                {restaurant.slogan || restaurant.name}
              </h1>
              <p onClick={(e) => handleEdit(e, 'slogan', 'Descripción')} className={`text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl mx-auto ${editableClass('slogan')}`}>
                {restaurant.description}
              </p>
              <div className="flex justify-center flex-wrap items-center gap-3 pt-4">
                <button
                  onClick={handleBookingClick}
                  className={`px-6 py-3.5 ${meta.buttonShape} text-xs font-bold transition shadow-lg flex items-center gap-2 cursor-pointer ${editableClass('cta_button')}`}
                  style={{ backgroundColor: primaryColor, color: '#000000', boxShadow: `0 0 20px ${primaryColor}40` }}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{restaurant.cta_text || 'Reservar Mesa'}</span>
                </button>
                <button type="button" onClick={scrollToCarta} className={`px-5 py-3.5 ${meta.buttonShape} border border-white/20 hover:border-white/40 text-xs font-semibold text-white transition cursor-pointer`}>
                  Ver Carta Digital
                </button>
              </div>
            </div>
          ) : heroLayout === 'split' ? (
            <div className={`p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl ${getGridCols().container}`} style={{ backgroundColor: `${bgColor}ee` }}>
              <div className={`${getGridCols().textCol} space-y-4`}>
                <div
                  onClick={(e) => handleEdit(e, 'slogan', 'Lema')}
                  className={`inline-flex items-center gap-2 px-3 py-1 ${meta.badgeShape} text-[11px] font-mono border backdrop-blur-md uppercase tracking-wider ${editableClass('slogan')}`}
                  style={{ borderColor: `${primaryColor}40`, backgroundColor: `${primaryColor}20`, color: accentColor }}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                  <span>{meta.badgeText}</span>
                </div>
                <h1
                  onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
                  className={`text-3xl ${isMobile ? 'text-2xl' : 'sm:text-5xl'} font-black text-white tracking-tight leading-tight ${editableClass('title')}`}
                >
                  {restaurant.slogan || restaurant.name}
                </h1>
                <p onClick={(e) => handleEdit(e, 'slogan', 'Descripción')} className={`text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl ${editableClass('slogan')}`}>
                  {restaurant.description}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-4">
                  <button
                    onClick={handleBookingClick}
                    className={`px-6 py-3.5 ${meta.buttonShape} text-xs font-bold transition shadow-lg flex items-center gap-2 cursor-pointer ${editableClass('cta_button')}`}
                    style={{ backgroundColor: primaryColor, color: '#000000', boxShadow: `0 0 20px ${primaryColor}40` }}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{restaurant.cta_text || 'Reservar Mesa'}</span>
                  </button>
                  <button type="button" onClick={scrollToCarta} className={`px-5 py-3.5 ${meta.buttonShape} border border-white/20 hover:border-white/40 text-xs font-semibold text-white transition cursor-pointer`}>
                    Ver Carta Digital
                  </button>
                </div>
              </div>
              <div onClick={(e) => handleEdit(e, 'hero_image', 'Imagen de Portada')} className={`${getGridCols().imageCol} ${editableClass('hero_image')}`} title={isPreview ? 'Pulsa para editar' : undefined}>
                <div className={`rounded-2xl overflow-hidden shadow-2xl`} style={{ borderColor: `${primaryColor}30`, borderWidth: 2, borderStyle: 'solid' }}>
                  <img src={heroImage} alt={restaurant.name} className={`w-full ${getImageHeight(heroImageSize)} object-cover`} />
                </div>
              </div>
            </div>
          ) : (
            /* Centered / Cover hero */
            <div
              onClick={(e) => handleEdit(e, 'hero_image', 'Imagen de Portada')}
              className={`relative rounded-3xl overflow-hidden border p-6 sm:p-14 min-h-[440px] flex flex-col justify-end shadow-2xl ${editableClass('hero_image')}`}
              style={{ borderColor: `${primaryColor}30` }}
              title={isPreview ? 'Pulsa para editar' : undefined}
            >
              <div className="absolute inset-0 bg-cover bg-center -z-10 scale-105 transition duration-1000" style={{ backgroundImage: `url(${heroImage})` }} />
              <div className="absolute inset-0 -z-10" style={{ background: `linear-gradient(to top, ${bgColor} 0%, ${bgColor}cc 40%, ${bgColor}50 100%)` }} />
              <div className="max-w-2xl space-y-4">
                <div
                  onClick={(e) => { e.stopPropagation(); handleEdit(e, 'slogan', 'Lema'); }}
                  className={`inline-flex items-center gap-2 px-3 py-1 ${meta.badgeShape} text-[11px] font-mono border backdrop-blur-md uppercase tracking-wider ${editableClass('slogan')}`}
                  style={{ borderColor: `${primaryColor}40`, backgroundColor: `${primaryColor}20`, color: accentColor }}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                  <span>{meta.badgeText}</span>
                </div>
                <h1
                  onClick={(e) => { e.stopPropagation(); handleEdit(e, 'title', 'Nombre'); }}
                  className={`text-3xl ${isMobile ? 'text-2xl' : 'sm:text-5xl lg:text-6xl'} font-black text-white tracking-tight leading-tight ${editableClass('title')}`}
                >
                  {restaurant.slogan || restaurant.name}
                </h1>
                <p onClick={(e) => { e.stopPropagation(); handleEdit(e, 'slogan', 'Descripción'); }} className={`text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl ${editableClass('slogan')}`}>
                  {restaurant.description}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-4">
                  <button
                    onClick={handleBookingClick}
                    className={`px-6 py-3.5 ${meta.buttonShape} text-xs font-bold transition shadow-lg flex items-center gap-2 cursor-pointer ${editableClass('cta_button')}`}
                    style={{ backgroundColor: primaryColor, color: '#000000', boxShadow: `0 0 20px ${primaryColor}40` }}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{restaurant.cta_text || 'Reservar Mesa'}</span>
                  </button>
                  <button type="button" onClick={scrollToCarta} className={`px-5 py-3.5 ${meta.buttonShape} border border-white/20 hover:border-white/40 text-xs font-semibold text-white transition cursor-pointer`}>
                    Ver Carta Digital
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      )}


      {/* ─────────────────────────────────────────────────────────────
          ARCHETYPE SIGNATURE INTERACTIVE WIDGET
         ───────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 mb-12">
        {archetype === 'taberna_iberica' && (
          <div className="p-5 rounded-2xl border-2 border-amber-800/50 bg-[#28170c] shadow-lg font-sans">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-xs mb-3">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>GARANTÍA DE SOLERA & MATERIA PRIMA DEL SUR:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-amber-200/90">
              <div className="p-3 bg-amber-950/60 rounded-xl border border-amber-700/40">
                <span className="text-amber-100 font-bold block mb-1">1. D.O. JABUGO 100% BELLOTA</span>
                Jamones criados en libertad en dehesas de encina con curación natural mínima de 36 meses.
              </div>
              <div className="p-3 bg-amber-950/60 rounded-xl border border-amber-700/40">
                <span className="text-amber-100 font-bold block mb-1">2. ACEITE VIRGEN EXTRA</span>
                Todas nuestras frituras y ajillos se realizan exclusivamente con AOVE de cooperativa andaluza.
              </div>
              <div className="p-3 bg-amber-950/60 rounded-xl border border-amber-700/40">
                <span className="text-amber-100 font-bold block mb-1">3. MANZANILLAS EN RAMA</span>
                Servidas directamente de bota a baja temperatura para respetar todo su velo de flor.
              </div>
            </div>
          </div>
        )}

        {archetype === 'nocturne' && (
          <div className="p-5 rounded-2xl border border-amber-400/20 bg-[#0f0f15] shadow-lg">
            <div className="flex items-center justify-between gap-4 text-xs font-mono text-amber-300">
              <div className="flex items-center gap-2">
                <Wine className="w-4 h-4 text-amber-400" />
                <span>MIXOLOGÍA DE AUTOR // CARTA DE DESTILADOS BOTÁNICOS</span>
              </div>
              <span className="text-zinc-400 text-[11px]">HIELO CRISTALINO TALLADO A MANO • CRUSTA CASERA</span>
            </div>
          </div>
        )}

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
          <div className="p-6 rounded-2xl border-2 border-yellow-400 bg-zinc-950 shadow-md">
            <div className="text-xs font-black uppercase text-yellow-400 tracking-wider mb-2 flex items-center gap-2">
              <Flame className="w-4 h-4" />
              <span>LA FÓRMULA SMASH // PASO A PASO:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-yellow-400 font-bold block">01. PICADO FRESCO</span>
                Blend propio de vacuno mayor, moldeado en bolas de 90g sin compactar.
              </div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-yellow-400 font-bold block">02. PLANCHA 260°C</span>
                Espátula de acero inoxidable pesado y papel manteca a máxima presión.
              </div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-yellow-400 font-bold block">03. COSTRA MAILLARD</span>
                Bordes ultrafinos crujientes con caramelización proteica explosiva.
              </div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-yellow-400 font-bold block">04. CHEESE CLOCHE</span>
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

        {archetype === 'pizzeria_napoli' && (
          <div className="p-5 rounded-2xl border border-rose-900/60 bg-[#1e0a0f] shadow-lg font-serif">
            <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-wider text-xs mb-3">
              <Pizza className="w-4 h-4 text-rose-500" />
              <span>DISCIPLINA DE LA PIZZA VERACE NAPOLETANA (D.O.P.):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs text-rose-200/90 font-sans">
              <div className="p-3 bg-black/40 rounded-xl border border-rose-950">
                <span className="text-white font-bold block mb-1">1. IMPASTO 72H</span>
                Fermentación natural en frío sin prisas para máxima digestibilidad.
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-rose-950">
                <span className="text-white font-bold block mb-1">2. FORNO 480°C</span>
                Cocción de 60 a 90 segundos sobre piedra volcánica napolitana.
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-rose-950">
                <span className="text-white font-bold block mb-1">3. CORNICIONE ALTO</span>
                Borde inflado, elástico y con alveolado perfecto.
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-rose-950">
                <span className="text-white font-bold block mb-1">4. FIORDILATTE D.O.P.</span>
                Queso de Agerola y tomate San Marzano triturado a mano.
              </div>
            </div>
          </div>
        )}

        {archetype === 'trattoria_toscana' && (
          <div className="p-5 rounded-2xl border border-amber-800/60 bg-[#24130b] shadow-lg font-serif">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-xs mb-3">
              <Utensils className="w-4 h-4 text-amber-500" />
              <span>TRADIZIONE DI FAMIGLIA & PASTA FATTA A MANO:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-amber-200/90 font-sans">
              <div className="p-3 bg-black/40 rounded-xl border border-amber-900/50">
                <span className="text-white font-bold block mb-1">PASTA FRESCA AL DÍA</span>
                Amasada cada mañana con sémola de trigo duro y huevos camperos.
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-amber-900/50">
                <span className="text-white font-bold block mb-1">RAGÙ TOSCANO 8 HORAS</span>
                Cocción lenta con carnes selectas y vino tinto Chianti.
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-amber-900/50">
                <span className="text-white font-bold block mb-1">BURRATA DI BUFALA</span>
                Directa desde Italia cada semana con aceite toscano.
              </div>
            </div>
          </div>
        )}

        {archetype === 'taqueria_mexicana' && (
          <div className="p-5 rounded-2xl border border-orange-500/40 bg-[#261208] shadow-lg">
            <div className="flex items-center gap-2 text-orange-400 font-bold uppercase tracking-wider text-xs mb-3">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>FIESTA EN EL TACO // MAÍZ CRIOLLO NIXTAMALIZADO:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs text-orange-200">
              <div className="p-3 bg-zinc-950 rounded-xl border border-orange-950">
                <span className="text-orange-400 font-bold block mb-1">TROMPO AL PASTOR</span>
                Cerdo al achiote cortado fino con piña asada al carbón.
              </div>
              <div className="p-3 bg-zinc-950 rounded-xl border border-orange-950">
                <span className="text-orange-400 font-bold block mb-1">TORTILLAS A MANO</span>
                Prensadas al momento sobre comal caliente de hierro.
              </div>
              <div className="p-3 bg-zinc-950 rounded-xl border border-orange-950">
                <span className="text-orange-400 font-bold block mb-1">SALSAS TATEMADAS</span>
                Desde habanero explosivo hasta salsa verde asada.
              </div>
              <div className="p-3 bg-zinc-950 rounded-xl border border-orange-950">
                <span className="text-orange-400 font-bold block mb-1">BARRA DE MEZCAL</span>
                Mezcales oaxaqueños con sal de gusano y naranja.
              </div>
            </div>
          </div>
        )}

        {archetype === 'beach_club_med' && (
          <div className="p-5 rounded-2xl border border-sky-500/30 bg-[#082233] shadow-lg">
            <div className="flex items-center gap-2 text-sky-400 font-bold uppercase tracking-wider text-xs mb-3">
              <Sun className="w-4 h-4 text-yellow-400" />
              <span>EXPERIENCIA BEACH CLUB // MEDITERRÁNEO & SUNSET:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-sky-200">
              <div className="p-3 bg-black/40 rounded-xl border border-sky-900/50">
                <span className="text-white font-bold block mb-1">ARROCES A LA LEÑA</span>
                Cocinado sobre sarmiento con socarrat crujiente de marisco.
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-sky-900/50">
                <span className="text-white font-bold block mb-1">CAMAS BALINESAS</span>
                Servicio exclusivo de toallas, champán y fruta fresca.
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-sky-900/50">
                <span className="text-white font-bold block mb-1">SUNSET SESSIONS</span>
                DJ residente al atardecer y cócteles frente a las olas.
              </div>
            </div>
          </div>
        )}

        {archetype === 'specialty_coffee' && (
          <div className="p-5 rounded-xl border border-amber-800/40 bg-[#1f130b] font-mono text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider mb-2">
              <Coffee className="w-4 h-4 text-amber-500" />
              <span>MÉTODOS DE EXTRACCIÓN & NOTAS DE CATA:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-zinc-300 text-[11px]">
              <div className="p-2.5 bg-black/50 border border-amber-950 rounded-lg">
                <span className="text-amber-300 font-bold block">V60 / KALITA WAVE</span>
                Taza limpia y floral, extrayendo los matices del grano.
              </div>
              <div className="p-2.5 bg-black/50 border border-amber-950 rounded-lg">
                <span className="text-amber-300 font-bold block">FLAT WHITE DE GRANJA</span>
                Espresso doble + leche micro-emulsionada a 62°C.
              </div>
              <div className="p-2.5 bg-black/50 border border-amber-950 rounded-lg">
                <span className="text-amber-300 font-bold block">COLD BREW NITRO 18H</span>
                Maceración en frío con infusión de nitrógeno cremoso.
              </div>
            </div>
          </div>
        )}

        {archetype === 'pulperia_tradicional' && (
          <div className="p-5 rounded-2xl border-2 border-red-900/50 bg-[#25100c] shadow-lg font-serif">
            <div className="flex items-center gap-2 text-red-400 font-bold uppercase tracking-wider text-xs mb-3">
              <Fish className="w-4 h-4 text-red-500" />
              <span>TRADICIÓN DA RÍA // COBRE & CASTAÑO:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-red-200/90 font-sans">
              <div className="p-3 bg-black/40 rounded-xl border border-red-950">
                <span className="text-white font-bold block mb-1">CALDERO DE COBRE</span>
                El pulpo se asusta tres veces y se cuece al dente en agua de mar.
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-red-950">
                <span className="text-white font-bold block mb-1">PLATO DE CASTAÑO</span>
                La madera de castaño potencia el aroma del pimentón de la Vera.
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-red-950">
                <span className="text-white font-bold block mb-1">CUNCAS DE RIBEIRO</span>
                Vino blanco gallego servido en cunca tradicional fría.
              </div>
            </div>
          </div>
        )}

        {archetype === 'bodega_enoteca' && (
          <div className="p-5 rounded-2xl border border-purple-800/40 bg-[#1c0b25] shadow-lg font-serif">
            <div className="flex items-center gap-2 text-purple-300 font-bold uppercase tracking-wider text-xs mb-3">
              <Wine className="w-4 h-4 text-purple-400" />
              <span>CAVA DE GUARDA & SELECCIÓN ENOLÓGICA:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-purple-200/90 font-sans">
              <div className="p-3 bg-black/40 rounded-xl border border-purple-950">
                <span className="text-white font-bold block mb-1">+250 REFERENCIAS</span>
                Vinos de guarda, pequeños viticultores y añadas históricas.
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-purple-950">
                <span className="text-white font-bold block mb-1">COPAS RIEDEL</span>
                Cristalería de precisión para oxigenar y revelar cada buqué.
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-purple-950">
                <span className="text-white font-bold block mb-1">MARIDAJE DE QUESOS</span>
                Quesos artesanos de pastor afinados junto a confituras.
              </div>
            </div>
          </div>
        )}

        {archetype === 'brutalist_raw' && (
          <div className="border-2 border-yellow-300 bg-black p-4 font-mono text-xs shadow-[4px_4px_0px_#ccff00]">
            <div className="flex items-center justify-between text-[#ccff00] font-black uppercase tracking-widest text-[11px] mb-2">
              <span>/// RAW SPECIFICATION /// UNDERGROUND MODE</span>
              <span>100% ONLINE</span>
            </div>
            <div className="text-zinc-300 text-[11px] flex flex-wrap gap-4">
              <span>0% COMISIONES</span>
              <span>SIN INTERMEDIARIOS</span>
              <span>CARGA EN 0.1s</span>
              <span className="text-white font-bold">RESERVAS DIRECTAS</span>
            </div>
          </div>
        )}

        {archetype === 'minimalist_pure' && (
          <div className="py-6 border-y border-white/10 text-center font-light text-zinc-400 text-xs tracking-[0.25em] uppercase">
            <span className="text-white font-normal">ÉPURE & PRÉCISION</span> • INGREDIENTES PUROS DE TEMPORADA • ARMONÍA VISUAL
          </div>
        )}

        {archetype === 'velvet_lounge' && (
          <div className="p-5 rounded-2xl border border-rose-900/40 bg-[#16060e] shadow-xl">
            <div className="flex items-center justify-between gap-4 text-xs font-mono text-rose-300">
              <div className="flex items-center gap-2">
                <GlassWater className="w-4 h-4 text-rose-400" />
                <span>VELVET SPEAKEASY // RESERVADOS & JAZZ EN DIRECTO</span>
              </div>
              <span className="text-zinc-400 text-[11px]">COCTELERÍA CLANDESTINA • CÓDIGO ELEGANTE</span>
            </div>
          </div>
        )}

        {archetype === 'tecnodiel_titanium' && (
          <div className="p-5 rounded-2xl border border-emerald-500/40 bg-zinc-950/80 shadow-[0_0_30px_rgba(16,185,129,0.15)] flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>TECNODIEL ENGINE // MÁXIMA VELOCIDAD & CONVERSIÓN:</span>
            </div>
            <div className="flex items-center gap-4 text-zinc-300 text-[11px] font-mono">
              <span>CARGA: <strong className="text-emerald-400">0.2s</strong></span>
              <span>PEDIDOS: <strong className="text-white">WHATSAPP DIRECTO</strong></span>
              <span>COMISIONES: <strong className="text-emerald-400">0.00€</strong></span>
            </div>
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          INFO STRIP (HOURS, ADDRESS, PHONE, BOOKING STATUS)
         ───────────────────────────────────────────────────────────── */}
      <section 
        onClick={(e) => handleEdit(e, 'contact', 'Datos de Contacto')}
        className={`border-y border-white/5 py-6 bg-black/40 backdrop-blur-md ${editableClass('contact')}`}
        title={isPreview ? "Pulsa para editar horarios, dirección y teléfono" : undefined}
      >
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
              {archetype === 'taberna_iberica' ? 'TABERNA DE SOLERA // PIZARRA DEL DÍA' :
               archetype === 'nocturne' ? 'COCKTAILS & AUTHOR BITES' :
               archetype === 'omakase' ? 'SECUENCIA GASTRONÓMICA' : 
               archetype === 'street_smash' ? 'THE STREET SMASH MENU' : 
               archetype === 'coastal_lonja' ? 'TABLÓN DE LA LONJA' : 
               archetype === 'cyber_hud' ? 'DATA_INDEX // SELECTION' : 
               archetype === 'bistro_paris' ? "L'ARDOISE DU JOUR" : 
               archetype === 'asador_prime' ? 'NUESTROS CORTES & MADURACIÓN' :
               archetype === 'pasticceria_dolce' ? 'VITRINA DULCE & BRUNCH' :
               archetype === 'craft_brewery' ? 'PIZARRA DE GRIFOS & TAPROOM' : 'CARTA DIGITAL'}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {archetype === 'taberna_iberica' ? 'Nuestras Tapas & Raciones' :
               archetype === 'nocturne' ? 'Carta de Mixología & Noche' :
               archetype === 'omakase' ? 'Propuesta Omakase del Chef' : 
               archetype === 'street_smash' ? 'Burgers, Sides & Shakes' : 
               archetype === 'coastal_lonja' ? 'Mariscos & Arroces de Costa' : 
               archetype === 'asador_prime' ? 'Cortes Selectos a la Brasa' : 
               archetype === 'pasticceria_dolce' ? 'Desayunos, Brunch & Postres' :
               archetype === 'craft_brewery' ? 'Cervezas Artesanas & Bocados' : 'Nuestra Carta'}
            </h2>
          </div>

          {/* Category Tabs */}
          {categories.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat, idx) => (
                <button
                  key={cat.id || idx}
                  onClick={() => setActiveCategory(idx)}
                  className={`px-4 py-2 text-xs font-semibold whitespace-nowrap transition cursor-pointer interactive-selectable ${meta.buttonShape} ${
                    activeCategory === idx 
                      ? 'text-black font-bold shadow-md scale-[1.02]' 
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

        {/* ── ARCHETYPE MENU VARIANT 1: TABERNA IBÉRICA (PIZARRA RÚSTICA CON TIZA & SOLERA) ── */}
        {archetype === 'taberna_iberica' && (
          <div className="rounded-2xl border-2 border-amber-800/60 bg-[#251509] p-6 sm:p-10 shadow-2xl font-serif">
            <div className="border-b border-amber-700/40 pb-3 mb-6 flex items-center justify-between text-xs font-mono text-amber-300">
              <span>PIZARRA DE COCINA TRADICIONAL</span>
              <span>CARTA EN VIVO</span>
            </div>
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : isTablet ? 'grid-cols-2 gap-4' : 'grid-cols-1 md:grid-cols-2 gap-6'}`}>
              {categories.length > 0 && categories[activeCategory] && (categories[activeCategory].items || []).map((item, itIdx) => (
                <div 
                  key={item.id || itIdx} 
                  onClick={(e) => handleEdit(e, 'menu_item', item.name, { categoryIndex: activeCategory, itemIndex: itIdx, item })}
                  className={`p-4 rounded-xl bg-amber-950/40 border border-amber-700/30 hover:border-amber-500/60 transition flex flex-col justify-between cursor-pointer ${editableClass('menu_item')}`}
                  title={isPreview ? "Pulsa para editar este plato" : undefined}
                >
                  <div className="flex gap-4 items-start">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover shrink-0 border border-amber-800/40" />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline gap-3 mb-1.5">
                        <h3 className="font-bold text-amber-100 text-base sm:text-lg tracking-wide">
                          {item.name}
                        </h3>
                        <span className="font-mono font-bold text-amber-400 text-base shrink-0">
                          {typeof item.price === 'number' ? item.price.toFixed(2) : item.price}€
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-xs text-amber-200/70 font-sans font-light leading-relaxed mb-3">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-amber-800/30 flex items-center justify-between text-[10px] font-sans">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                      {item.badge || 'Especialidad'}
                    </span>
                    <span className="text-amber-400/80 font-mono">Tapa / Ración</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ARCHETYPE MENU VARIANT 2: NOCTURNE LOUNGE (OBSIDIAN & GOLD LUXURY CARDS) ── */}
        {archetype === 'nocturne' && (
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : isTablet ? 'grid-cols-2 gap-4' : 'grid-cols-1 md:grid-cols-2 gap-4'}`}>
            {categories.length > 0 && categories[activeCategory] && (categories[activeCategory].items || []).map((item, itIdx) => (
              <div 
                key={item.id || itIdx}
                onClick={(e) => handleEdit(e, 'menu_item', item.name, { categoryIndex: activeCategory, itemIndex: itIdx, item })}
                className={`p-5 rounded-2xl border border-amber-400/20 bg-[#0f0f15] hover:border-amber-400/50 transition shadow-lg flex flex-col justify-between cursor-pointer ${editableClass('menu_item')}`}
                title={isPreview ? "Pulsa para editar este plato" : undefined}
              >
                <div className="flex gap-4 items-start">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0 border border-amber-400/30" />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline gap-3 mb-2">
                      <h3 className="font-light text-white text-base sm:text-lg">
                        {item.name}
                      </h3>
                      <span className="font-mono text-amber-400 font-bold text-sm shrink-0">
                        {typeof item.price === 'number' ? item.price.toFixed(2) : item.price}€
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-xs text-zinc-400 font-light leading-relaxed mb-3">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                  <span className="text-amber-300/80 font-medium">{item.badge || 'Mixología de Autor'}</span>
                  <span>PREPARADO AL MOMENTO</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── ARCHETYPE MENU VARIANT 3: OMAKASE (DOTTED LEADERS & SEQUENTIAL) ── */}
        {archetype === 'omakase' && (
          <div className="border border-stone-800 bg-stone-950 p-6 sm:p-10 divide-y divide-stone-800">
            {categories.length > 0 && categories[activeCategory] && (categories[activeCategory].items || []).map((item, itIdx) => (
              <div 
                key={item.id || itIdx} 
                onClick={(e) => handleEdit(e, 'menu_item', item.name, { categoryIndex: activeCategory, itemIndex: itIdx, item })}
                className={`py-5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 group cursor-pointer ${editableClass('menu_item')}`}
                title={isPreview ? "Pulsa para editar este plato" : undefined}
              >
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

        {/* ── ARCHETYPE MENU VARIANT 4: STREET SMASH (POSTER CARDS WITH COMBO CHIPS) ── */}
        {archetype === 'street_smash' && (
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : isTablet ? 'grid-cols-2 gap-4' : 'grid-cols-1 md:grid-cols-2 gap-4'}`}>
            {categories.length > 0 && categories[activeCategory] && (categories[activeCategory].items || []).map((item, itIdx) => (
              <div 
                key={item.id || itIdx}
                onClick={(e) => handleEdit(e, 'menu_item', item.name, { categoryIndex: activeCategory, itemIndex: itIdx, item })}
                className={`p-5 rounded-2xl border-2 border-zinc-800 bg-zinc-950 hover:border-yellow-400 transition shadow-[4px_4px_0px_rgba(250,204,21,0.4)] flex flex-col justify-between cursor-pointer ${editableClass('menu_item')}`}
                title={isPreview ? "Pulsa para editar este plato" : undefined}
              >
                <div className="flex gap-4 items-start">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0 border border-yellow-400/40" />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-3 mb-2">
                      <h3 className="font-black uppercase text-base text-white tracking-wide">
                        {item.name}
                      </h3>
                      <span className="px-2.5 py-1 rounded-lg bg-yellow-400 text-black font-black text-sm shrink-0">
                        {typeof item.price === 'number' ? item.price.toFixed(2) : item.price}€
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-xs text-zinc-400 font-medium leading-relaxed mb-3">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                  <span>+3.50€ COMBO PATATAS & BEBIDA</span>
                  <span className="text-yellow-400 font-bold">100% CARNE FRESCA</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── ARCHETYPE MENU VARIANT 5: CYBER HUD (TELEMETRY BOXES) ── */}
        {archetype === 'cyber_hud' && (
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : isTablet ? 'grid-cols-2 gap-4' : 'grid-cols-1 md:grid-cols-2 gap-4'} font-mono`}>
            {categories.length > 0 && categories[activeCategory] && (categories[activeCategory].items || []).map((item, itIdx) => (
              <div 
                key={item.id || itIdx}
                onClick={(e) => handleEdit(e, 'menu_item', item.name, { categoryIndex: activeCategory, itemIndex: itIdx, item })}
                className={`p-4 border border-cyan-500/40 bg-zinc-950/80 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] transition relative cursor-pointer ${editableClass('menu_item')}`}
                title={isPreview ? "Pulsa para editar este plato" : undefined}
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

        {/* ── ARCHETYPE MENU VARIANT 6: BISTRO PARISIEN (GOLD FILIGREE & WINE PAIRING) ── */}
        {archetype === 'bistro_paris' && (
          <div className="p-6 sm:p-10 border border-amber-600/30 bg-[#06140e] rounded-2xl shadow-xl font-serif">
            <div className="divide-y divide-amber-900/30">
              {categories.length > 0 && categories[activeCategory] && (categories[activeCategory].items || []).map((item, itIdx) => (
                <div 
                  key={item.id || itIdx} 
                  onClick={(e) => handleEdit(e, 'menu_item', item.name, { categoryIndex: activeCategory, itemIndex: itIdx, item })}
                  className={`py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 cursor-pointer ${editableClass('menu_item')}`}
                  title={isPreview ? "Pulsa para editar este plato" : undefined}
                >
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

        {/* ── ARCHETYPE MENU VARIANT 7: ASADOR PRIME (CARNES MADURADAS & CORTES) ── */}
        {archetype === 'asador_prime' && (
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : isTablet ? 'grid-cols-2 gap-4' : 'grid-cols-1 md:grid-cols-2 gap-4'}`}>
            {categories.length > 0 && categories[activeCategory] && (categories[activeCategory].items || []).map((item, itIdx) => (
              <div 
                key={item.id || itIdx}
                onClick={(e) => handleEdit(e, 'menu_item', item.name, { categoryIndex: activeCategory, itemIndex: itIdx, item })}
                className={`p-5 rounded-2xl border border-red-950 bg-[#1e0705] hover:border-red-600/60 transition shadow-lg flex flex-col justify-between cursor-pointer ${editableClass('menu_item')}`}
                title={isPreview ? "Pulsa para editar este plato" : undefined}
              >
                <div className="flex gap-4 items-start">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0 border border-red-900/60" />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline gap-3 mb-2">
                      <h3 className="font-bold uppercase text-white text-base tracking-wide">
                        {item.name}
                      </h3>
                      <span className="font-mono text-red-400 font-bold text-base shrink-0">
                        {typeof item.price === 'number' ? item.price.toFixed(2) : item.price}€
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="pt-2 border-t border-red-900/30 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-red-400 font-bold">{item.badge || 'Madurado'}</span>
                  <span className="text-zinc-400">BRASA DE ENCINA 400°C</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── ARCHETYPE MENU VARIANT 8: COASTAL LONJA (MARISCOS & LONJA DE HUELVA) ── */}
        {archetype === 'coastal_lonja' && (
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : isTablet ? 'grid-cols-2 gap-4' : 'grid-cols-1 md:grid-cols-2 gap-4'}`}>
            {categories.length > 0 && categories[activeCategory] && (categories[activeCategory].items || []).map((item, itIdx) => (
              <div 
                key={item.id || itIdx}
                onClick={(e) => handleEdit(e, 'menu_item', item.name, { categoryIndex: activeCategory, itemIndex: itIdx, item })}
                className={`p-5 rounded-2xl border border-sky-800/50 bg-[#051c33] hover:border-sky-400 transition shadow-lg flex flex-col justify-between cursor-pointer ${editableClass('menu_item')}`}
                title={isPreview ? "Pulsa para editar este plato" : undefined}
              >
                <div className="flex gap-4 items-start">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0 border border-sky-700/50" />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline gap-3 mb-2">
                      <h3 className="font-extrabold text-white text-base">
                        {item.name}
                      </h3>
                      <span className="font-mono text-sky-300 font-bold text-base shrink-0">
                        {typeof item.price === 'number' ? item.price.toFixed(2) : item.price}€
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-xs text-sky-100/70 leading-relaxed mb-3">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="pt-2 border-t border-sky-900/40 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-sky-300 font-medium">{item.badge || 'Pesca del Día'}</span>
                  <span className="text-sky-400/80">SUBASTA MATINAL</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── ARCHETYPE MENU VARIANT 9: PASTICCERIA DOLCE (BRUNCH & VITRINA PASTEL) ── */}
        {archetype === 'pasticceria_dolce' && (
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : isTablet ? 'grid-cols-2 gap-4' : 'grid-cols-1 md:grid-cols-2 gap-4'}`}>
            {categories.length > 0 && categories[activeCategory] && (categories[activeCategory].items || []).map((item, itIdx) => (
              <div 
                key={item.id || itIdx}
                onClick={(e) => handleEdit(e, 'menu_item', item.name, { categoryIndex: activeCategory, itemIndex: itIdx, item })}
                className={`p-5 rounded-3xl border border-pink-500/30 bg-[#24131e] hover:border-pink-400 transition shadow-md flex flex-col justify-between cursor-pointer ${editableClass('menu_item')}`}
                title={isPreview ? "Pulsa para editar este plato" : undefined}
              >
                <div className="flex gap-4 items-start">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-pink-500/40" />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline gap-3 mb-2">
                      <h3 className="font-medium text-pink-100 text-base">
                        {item.name}
                      </h3>
                      <span className="font-mono text-pink-400 font-bold text-base shrink-0">
                        {typeof item.price === 'number' ? item.price.toFixed(2) : item.price}€
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-xs text-pink-200/70 leading-relaxed mb-3">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="pt-2 border-t border-pink-900/40 flex items-center justify-between text-[10px]">
                  <span className="text-pink-300 font-medium">{item.badge || 'Recién Horneado'}</span>
                  <span className="text-pink-400/70 font-mono">100% ARTESANAL</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── ARCHETYPE MENU VARIANT 10: CRAFT BREWERY (TAPROOM & GRIFOS) ── */}
        {archetype === 'craft_brewery' && (
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : isTablet ? 'grid-cols-2 gap-4' : 'grid-cols-1 md:grid-cols-2 gap-4'} font-mono`}>
            {categories.length > 0 && categories[activeCategory] && (categories[activeCategory].items || []).map((item, itIdx) => (
              <div 
                key={item.id || itIdx}
                onClick={(e) => handleEdit(e, 'menu_item', item.name, { categoryIndex: activeCategory, itemIndex: itIdx, item })}
                className={`p-5 rounded-xl border border-amber-800/50 bg-[#211105] hover:border-amber-500 transition shadow-md flex flex-col justify-between cursor-pointer ${editableClass('menu_item')}`}
                title={isPreview ? "Pulsa para editar este plato" : undefined}
              >
                <div className="flex gap-4 items-start">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0 border border-amber-700/50" />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline gap-3 mb-2">
                      <h3 className="font-bold uppercase text-amber-100 text-sm tracking-wide">
                        {item.name}
                      </h3>
                      <span className="text-amber-400 font-bold text-base shrink-0">
                        {typeof item.price === 'number' ? item.price.toFixed(2) : item.price}€
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-xs text-zinc-300 font-sans leading-relaxed mb-3">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="pt-2 border-t border-amber-900/40 flex items-center justify-between text-[10px]">
                  <span className="text-amber-400 font-bold">{item.badge || 'Tirador Directo'}</span>
                  <span className="text-zinc-400">CERVEZA FRESCA DE BARRIL</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── ARCHETYPE MENU VARIANT 11: STANDARD TILED CARDS FALLBACK ── */}
        {(!['taberna_iberica', 'nocturne', 'omakase', 'street_smash', 'cyber_hud', 'bistro_paris', 'asador_prime', 'coastal_lonja', 'pasticceria_dolce', 'craft_brewery'].includes(archetype)) && (
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : isTablet ? 'grid-cols-2 gap-4' : 'grid-cols-1 md:grid-cols-2 gap-4'}`}>
            {categories.length > 0 && categories[activeCategory] && (categories[activeCategory].items || []).map((item, itIdx) => (
              <div 
                key={item.id || itIdx}
                onClick={(e) => handleEdit(e, 'menu_item', item.name, { categoryIndex: activeCategory, itemIndex: itIdx, item })}
                className={`p-5 ${meta.buttonShape} border ${meta.cardBorder} transition backdrop-blur-sm flex flex-col justify-between cursor-pointer ${editableClass('menu_item')}`}
                style={{ backgroundColor: surfaceColor }}
                title={isPreview ? "Pulsa para editar este plato" : undefined}
              >
                <div className="flex gap-4 items-start">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10" />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline gap-3 mb-2">
                      <h3 className="font-bold text-white text-base tracking-tight">
                        {item.name}
                      </h3>
                      <span 
                        className="font-mono font-bold text-sm shrink-0"
                        style={{ color: primaryColor }}
                      >
                        {typeof item.price === 'number' ? item.price.toFixed(2) : item.price}€
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
                {item.badge && (
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                    <span 
                      className="px-2 py-0.5 rounded font-medium"
                      style={{ backgroundColor: `${primaryColor}20`, color: accentColor }}
                    >
                      {item.badge}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FOOTER SECTION
         ───────────────────────────────────────────────────────────── */}
      <footer 
        onClick={(e) => handleEdit(e, 'contact', 'Pie de Página')}
        className={`border-t border-white/10 py-10 bg-black/70 cursor-pointer ${editableClass('contact')}`}
        title={isPreview ? "Pulsa para editar contacto" : undefined}
      >
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">{restaurant.name}</span>
            <span>•</span>
            <span className="font-mono text-[11px] text-zinc-500">Impulsado por TecnOdiel</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            {restaurant.phone && <span>Tel: {restaurant.phone}</span>}
            {restaurant.address && <span>{restaurant.address}</span>}
          </div>
        </div>
      </footer>

      {/* Booking Modal (Live interactive reservation engine) */}
      {isBookingOpen && (
        <BookingModal 
          restaurant={restaurant} 
          onClose={() => setIsBookingOpen(false)} 
        />
      )}

      {/* Standalone Table QR Modal */}
      <QrCodeModal
        restaurant={restaurant}
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />
    </div>
  );
}
