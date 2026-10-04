import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Flame, 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  QrCode, 
  Clock, 
  ChevronRight, 
  Eye, 
  ChefHat,
  ThermometerSnowflake,
  ShieldCheck,
  UtensilsCrossed
} from 'lucide-react';

export const CINEMATIC_STAGES = [
  {
    id: 'brasa',
    stepNumber: '01',
    badge: 'La Brasa Viva • 450°C',
    title: 'El Fuego & El Carbón de Encina',
    subtitle: 'Vaca Rubia Gallega con 45 Días de Maduración Dry-Aged',
    description: 'La pieza reposa sobre brasas incandescentes de leña de encina. La grasa infiltrada empieza a fundir lentamente, perfumando la carne con aromas ancestrales de humo y roble.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1920&q=85',
    alt: 'Chuletón asándose sobre las brasas de carbón al rojo vivo',
    specs: [
      { label: 'Temperatura', value: '450°C' },
      { label: 'Maduración', value: '45 Días' },
      { label: 'Leña', value: 'Encina & Sarmiento' }
    ],
    statusPill: 'En Fuego Vivo'
  },
  {
    id: 'sellado',
    stepNumber: '02',
    badge: 'Reacción Maillard • Costra Crujiente',
    title: 'El Sellado Violento & El Punto Perfecto',
    subtitle: 'Caramelización Exterior y Corazón Sangrante a 52°C',
    description: 'El choque térmico desata la magia de Maillard. Una corteza dorada y crujiente sella cada gota de jugo interior. El aroma a humo tostado anuncia una terneza que se deshace en la boca.',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1920&q=85',
    alt: 'Chuletón en parrilla con costra caramelizada y llamas de brasa',
    specs: [
      { label: 'Corazón', value: '52°C Rosa' },
      { label: 'Costra', value: 'Caramelizada' },
      { label: 'Infiltración', value: 'BMS 8' }
    ],
    statusPill: 'Sellado al Punto'
  },
  {
    id: 'emplatado',
    stepNumber: '03',
    badge: 'Emplatado en Mesa • Servido Caliente',
    title: 'Trinchado en Sala & Lluvia de Sal Maldon',
    subtitle: 'Directo del Fuego a tu Mesa en Pizarra Térmica',
    description: 'El maestro asador trincha la pieza con precisión milimétrica. Láminas de carne jugosa dispuestas sobre plato negro atemperado, coronadas con escamas de sal volcánica crujiente y aceite de humo.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1920&q=85',
    alt: 'Chuletón trinchado servido en plato artesanal con escamas de sal',
    specs: [
      { label: 'Corte', value: 'Trinchado Grueso' },
      { label: 'Salazón', value: 'Sal Maldon' },
      { label: 'Presentación', value: 'Pizarra 80°C' }
    ],
    statusPill: 'Listo para Degustar'
  }
];

export default function CinematicScrollHero({
  restaurant = {},
  isPreview = false,
  isMobile = false,
  handleEdit = () => {},
  editableClass = () => '',
  handleBookingClick = () => {},
  scrollToCarta = () => {},
  primaryColor = '#f97316',
  accentColor = '#ef4444',
  onOpenQrModal = null
}) {
  const containerRef = useRef(null);
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  // Framer Motion scroll hook inside the storytelling hero container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      if (latest < 0.35) {
        setActiveStageIndex(0);
      } else if (latest < 0.70) {
        setActiveStageIndex(1);
      } else {
        setActiveStageIndex(2);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const currentStage = CINEMATIC_STAGES[activeStageIndex];

  // Dynamic values that can be customized in the inspector
  const heroTitle = restaurant.name || 'Asador & Brasa Madre';
  const heroSlogan = restaurant.slogan || 'La Alquimia del Fuego: Del Carbón Incandescente al Trinchado en Tu Plato';
  const ctaText = restaurant.cta_text || 'Reservar Mesa de Brasa';
  const heroHeroImage = restaurant.hero_image || currentStage.image;

  return (
    <section 
      ref={containerRef}
      className="relative text-white selection:bg-orange-500 selection:text-black overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% -10%, #200803 0%, #080302 60%, #020202 100%)'
      }}
    >
      {/* Cinematic Ember Particles Background Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-30 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] -top-24 -right-24 rounded-full blur-[140px] bg-orange-600/25" />
        <div className="absolute w-[450px] h-[450px] bottom-0 -left-20 rounded-full blur-[160px] bg-red-700/20" />
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, #f97316 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 relative z-10">
        
        {/* Header Ribbon / Stage Stepper */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-orange-500/20 mb-8 sm:mb-12">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
              <Flame className="w-5 h-5 text-orange-400 animate-pulse" />
            </span>
            <div>
              <span className="text-[11px] font-mono tracking-widest text-orange-400 uppercase font-bold block">
                EXPERIENCIA GASTRONÓMICA CINEMÁTICA
              </span>
              <span className="text-xs text-zinc-400 font-sans">
                Desliza la página o pulsa las fases para presenciar la preparación del chuletón
              </span>
            </div>
          </div>

          {/* Interactive Stage Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-950/80 border border-white/10 backdrop-blur-md self-start md:self-auto overflow-x-auto max-w-full">
            {CINEMATIC_STAGES.map((stg, idx) => {
              const isActive = activeStageIndex === idx;
              return (
                <button
                  key={stg.id}
                  type="button"
                  onClick={() => setActiveStageIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    isActive 
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold shadow-md shadow-orange-950/50' 
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="opacity-75">{stg.stepNumber}.</span>
                  <span>{stg.id === 'brasa' ? 'La Brasa' : stg.id === 'sellado' ? 'El Sellado' : 'En el Plato'}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Split Grid: Left Storytelling Narrative / Right Cinematic Visual Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ─────────────────────────────────────────────────────────────
              COLUMNA IZQUIERDA: EL TEXTO NARRATIVO Y CONTROLES (EDITABLE)
             ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Stage Badge */}
            <motion.div
              key={`badge-${currentStage.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/40 text-orange-300 text-xs font-mono font-semibold shadow-inner"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>{currentStage.badge}</span>
            </motion.div>

            {/* Restaurant Title & Slogan */}
            <div className="space-y-3">
              <h1
                onClick={(e) => handleEdit(e, 'title', 'Nombre del Restaurante')}
                className={`text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-[1.08] ${editableClass('title')}`}
                style={{ fontFamily: restaurant.font_family || 'Playfair Display' }}
                title={isPreview ? "Pulsa para editar el nombre del asador" : undefined}
              >
                {heroTitle}
              </h1>

              <p
                onClick={(e) => handleEdit(e, 'slogan', 'Lema del Restaurante')}
                className={`text-sm sm:text-base text-zinc-300 leading-relaxed font-sans ${editableClass('slogan')}`}
                title={isPreview ? "Pulsa para editar el lema" : undefined}
              >
                {heroSlogan}
              </p>
            </div>

            {/* Stage Specific Narrative Card (Changes with Stage) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${currentStage.id}`}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="p-5 sm:p-6 rounded-2xl bg-zinc-950/70 border border-orange-500/30 backdrop-blur-xl space-y-4 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-mono font-extrabold text-orange-400">
                      Fase {currentStage.stepNumber}
                    </span>
                    <span className="text-zinc-600 font-mono">/ 03</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-950/80 border border-orange-500/40 text-orange-300 uppercase font-semibold">
                    {currentStage.statusPill}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg sm:text-xl font-extrabold text-white font-serif">
                    {currentStage.title}
                  </h3>
                  <p className="text-xs font-mono text-orange-300/90 font-medium">
                    {currentStage.subtitle}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                  {currentStage.description}
                </p>

                {/* Technical Specifications Pills */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5">
                  {currentStage.specs.map((sp, i) => (
                    <div key={i} className="p-2 rounded-xl bg-black/60 border border-white/10 text-center">
                      <span className="block text-[10px] font-mono text-zinc-500 uppercase">{sp.label}</span>
                      <span className="text-xs font-mono font-bold text-white truncate block">{sp.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Action Buttons: Booking & Dedicated Carta */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <motion.button
                type="button"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                onClick={handleBookingClick}
                className={`px-6 py-3.5 rounded-xl text-black font-extrabold text-xs sm:text-sm transition flex items-center gap-2 shadow-[0_0_30px_rgba(249,115,22,0.4)] cursor-pointer ${editableClass('cta_button')}`}
                style={{ backgroundColor: primaryColor }}
                title={isPreview ? "Pulsa para editar el botón o probar el modal de reservas" : undefined}
              >
                <Calendar className="w-4 h-4 stroke-[2.5]" />
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </motion.button>

              <button
                type="button"
                onClick={scrollToCarta}
                className="px-5 py-3.5 rounded-xl border border-white/15 bg-zinc-900/90 hover:bg-zinc-800 text-white font-semibold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer"
              >
                <UtensilsCrossed className="w-4 h-4 text-orange-400" />
                <span>Ver Carta Digital</span>
              </button>

              {onOpenQrModal && (
                <button
                  type="button"
                  onClick={onOpenQrModal}
                  className="px-4 py-3.5 rounded-xl border border-orange-500/30 bg-orange-950/20 hover:bg-orange-900/40 text-orange-400 font-semibold text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer"
                  title="Generar y descargar el código QR exclusivo para las mesas de este restaurante"
                >
                  <QrCode className="w-4 h-4" />
                  <span className="hidden sm:inline">Carta QR Mesa</span>
                </button>
              )}
            </div>

            {/* Guarantee / Quality Badge */}
            <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-400 pt-1">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                <span>Origen Certificado</span>
              </div>
              <span className="text-zinc-600">•</span>
              <div className="flex items-center gap-1.5">
                <ThermometerSnowflake className="w-3.5 h-3.5 text-orange-400" />
                <span>Cámara de Sal Propia</span>
              </div>
              <span className="text-zinc-600">•</span>
              <span>Corte Diario</span>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              COLUMNA DERECHA: EL LIENZO CINEMÁTICO TRANSICIONABLE
             ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-6 relative">
            <div 
              onClick={(e) => handleEdit(e, 'hero_image', 'Foto Cinemática')}
              className={`relative rounded-3xl overflow-hidden border-2 border-orange-500/40 shadow-[0_20px_60px_rgba(249,115,22,0.25)] group bg-black ${editableClass('hero_image')}`}
              title={isPreview ? "Pulsa para editar la foto o imagen de la pieza" : undefined}
            >
              {/* Aspect Ratio Container */}
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/11]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`image-${currentStage.id}`}
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1.0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                  >
                    <img 
                      src={activeStageIndex === 0 && restaurant.hero_image ? restaurant.hero_image : currentStage.image}
                      alt={currentStage.alt}
                      className="w-full h-full object-cover filter contrast-115 brightness-95"
                    />

                    {/* Dark gradient vignettes for cinema framing */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
                  </motion.div>
                </AnimatePresence>

                {/* Animated Glowing Embers Effect Over Meat */}
                {activeStageIndex === 0 && (
                  <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                    <div className="flex items-center gap-2 text-xs font-mono text-orange-400 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-orange-500/40 w-fit">
                      <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                      <span>FUEGO DIRECTO: 450°C SOBRE BRASA DE ENCINA</span>
                    </div>
                  </div>
                )}

                {activeStageIndex === 1 && (
                  <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                    <div className="flex items-center gap-2 text-xs font-mono text-amber-400 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-amber-500/40 w-fit">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      <span>SELLADO EN PARRILLA: CORTEZA CARAMELIZADA</span>
                    </div>
                  </div>
                )}

                {activeStageIndex === 2 && (
                  <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-emerald-500/40 w-fit">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>LISTO EN MESA: TRINCHADO CON SAL MALDON</span>
                    </div>
                  </div>
                )}

                {/* Top Corner Stage Pill */}
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-[11px] font-mono text-zinc-300">
                  <ChefHat className="w-3.5 h-3.5 text-orange-400" />
                  <span>Fase 0{activeStageIndex + 1} / 03</span>
                </div>
              </div>

              {/* Bottom Interactive Scrub Bar */}
              <div className="p-3 bg-zinc-950 border-t border-white/10 flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-zinc-400">
                  Fase activa: <strong className="text-white">{currentStage.title}</strong>
                </span>

                <div className="flex items-center gap-1.5">
                  {[0, 1, 2].map((idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveStageIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        activeStageIndex === idx 
                          ? 'w-7 bg-orange-500 shadow-[0_0_10px_#f97316]' 
                          : 'w-2 bg-zinc-700 hover:bg-zinc-500'
                      }`}
                      title={`Ir a la fase ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Ambient Base Reflection */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-orange-600/30 blur-2xl rounded-full pointer-events-none" />
          </div>

        </div>

      </div>
    </section>
  );
}
