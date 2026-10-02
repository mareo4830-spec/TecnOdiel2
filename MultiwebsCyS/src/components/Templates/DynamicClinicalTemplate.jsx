import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Stethoscope, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  Sparkles, 
  HeartPulse,
  Activity,
  Award,
  Users,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AppointmentModal from '../Booking/AppointmentModal';

export default function DynamicClinicalTemplate({ 
  clinic, 
  isPreview = false,
  previewDevice = 'desktop',
  onSelectElement,
  selectedElement,
  hero_layout,
  hero_image_side,
  hero_image_size
}) {
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);

  // Normalized visual variables
  const layout = hero_layout || clinic.hero_layout || 'split';
  const imageSide = hero_image_side || clinic.hero_image_side || 'right';
  const imageSize = hero_image_size || clinic.hero_image_size || 'md';

  const primaryColor = clinic.primary_color || '#06b6d4';
  const accentColor = clinic.accent_color || '#22d3ee';
  const bgColor = clinic.background_color || '#041724';
  const surfaceColor = clinic.surface_color || '#08253a';

  const categories = clinic.menu_categories || [];
  const currentCategory = categories[activeCategory] || categories[0];

  const isMobile = previewDevice === 'mobile';
  const isTablet = previewDevice === 'tablet';

  const editableClass = (type) => {
    if (!isPreview) return '';
    const isSelected = selectedElement?.type === type;
    return `cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-cyan-400 hover:ring-offset-2 hover:ring-offset-black ${
      isSelected ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-black bg-cyan-400/5' : ''
    }`;
  };

  const handleEdit = (e, type, label, data = null) => {
    if (isPreview && onSelectElement) {
      e.stopPropagation();
      onSelectElement({ type, label, data });
    }
  };

  const handleAppointmentClick = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (isPreview) {
      handleEdit(e, 'cta_button', 'Botón de Cita');
    }
    setIsAppointmentOpen(true);
  };

  const getImageHeight = (size) => {
    if (isMobile) return 'h-[280px]';
    if (isTablet) return 'h-[360px]';
    switch (size) {
      case 'sm': return 'h-[320px]';
      case 'lg': return 'h-[520px]';
      case 'xl': return 'h-[620px]';
      default: return 'h-[420px]';
    }
  };

  return (
    <div 
      onClick={(e) => handleEdit(e, 'background', 'Fondo y Color de la Clínica')}
      className={`min-h-screen text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black ${editableClass('background')}`}
      style={{ backgroundColor: bgColor }}
    >
      {/* 1. Header / Top Navigation */}
      <header 
        className="sticky top-0 z-30 border-b border-white/10 backdrop-blur-xl transition"
        style={{ backgroundColor: `${bgColor}e6` }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div 
            onClick={(e) => handleEdit(e, 'title', 'Nombre de la Clínica')}
            className={`flex items-center gap-3 ${editableClass('title')}`}
          >
            <motion.div 
              whileHover={{ scale: 1.08, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md shrink-0 cursor-pointer"
              style={{ backgroundColor: primaryColor }}
            >
              <HeartPulse className="w-5 h-5" />
            </motion.div>
            <div>
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-2">
                <span>{clinic.name || 'Centro Médico & Salud'}</span>
              </h1>
              <p className="text-[11px] font-mono text-zinc-400 truncate max-w-[200px] sm:max-w-none">
                {clinic.collegiate_number || 'Centro Sanitario Autorizado'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            {clinic.phone && (
              <a
                href={`tel:${clinic.phone}`}
                className="hidden md:flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white font-mono px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                <span>{clinic.phone}</span>
              </a>
            )}

            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              onClick={handleAppointmentClick}
              className={`px-4 py-2 rounded-xl text-black font-extrabold text-xs transition flex items-center gap-1.5 shadow-lg ${editableClass('cta_button')}`}
              style={{ backgroundColor: primaryColor }}
            >
              <Calendar className="w-4 h-4 stroke-[2.5]" />
              <span>{clinic.cta_text || 'Pedir Cita Online'}</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden border-b border-white/10 py-8 sm:py-16">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full blur-[140px] pointer-events-none opacity-25"
          style={{ backgroundColor: primaryColor }}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          {layout === 'centered' ? (
            /* Centered Hero */
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <div 
                onClick={(e) => handleEdit(e, 'slogan', 'Especialidad & Lema')}
                className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-semibold border ${editableClass('slogan')}`}
                style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}40`, color: accentColor }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{clinic.slogan || 'Medicina de Precisión & Cuidado Humano'}</span>
              </div>

              <h2 
                onClick={(e) => handleEdit(e, 'title', 'Nombre del Centro')}
                className={`text-3xl sm:text-5xl font-extrabold text-white tracking-tight ${editableClass('title')}`}
              >
                {clinic.name}
              </h2>

              <p 
                onClick={(e) => handleEdit(e, 'slogan', 'Descripción del Centro')}
                className={`text-sm sm:text-base text-zinc-300 leading-relaxed font-sans ${editableClass('slogan')}`}
              >
                {clinic.description || 'Comprometidos con tu salud y bienestar. Diagnóstico avanzado, especialistas de referencia y atención cercana en gabinetes equipados con tecnología médica de última generación.'}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                  onClick={handleAppointmentClick}
                  className="px-6 py-3 rounded-xl text-black font-extrabold text-xs sm:text-sm transition flex items-center gap-2 shadow-xl"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Calendar className="w-4 h-4 stroke-[2.5]" />
                  <span>{clinic.cta_text || 'Pedir Cita Online'}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </motion.button>
              </div>

              {clinic.hero_image && (
                <div 
                  onClick={(e) => handleEdit(e, 'hero_image', 'Foto de Portada')}
                  className={`mt-8 rounded-2xl overflow-hidden border border-white/15 shadow-2xl relative ${editableClass('hero_image')}`}
                >
                  <img
                    src={clinic.hero_image}
                    alt={clinic.name}
                    className={`w-full object-cover ${getImageHeight(imageSize)}`}
                  />
                </div>
              )}
            </div>
          ) : layout === 'minimal' ? (
            /* Minimal Hero */
            <div className="max-w-3xl space-y-5">
              <div 
                onClick={(e) => handleEdit(e, 'slogan', 'Especialidad & Lema')}
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold border ${editableClass('slogan')}`}
                style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}40`, color: accentColor }}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{clinic.slogan || 'Atención Médica Colegiada'}</span>
              </div>

              <h2 
                onClick={(e) => handleEdit(e, 'title', 'Nombre del Centro')}
                className={`text-3xl sm:text-5xl font-extrabold text-white tracking-tight ${editableClass('title')}`}
              >
                {clinic.name}
              </h2>

              <p 
                onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                className={`text-sm sm:text-base text-zinc-300 leading-relaxed ${editableClass('slogan')}`}
              >
                {clinic.description}
              </p>

              <motion.button
                type="button"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                onClick={handleAppointmentClick}
                className="px-6 py-3 rounded-xl text-black font-extrabold text-xs sm:text-sm transition flex items-center gap-2 shadow-xl"
                style={{ backgroundColor: primaryColor }}
              >
                <Calendar className="w-4 h-4 stroke-[2.5]" />
                <span>{clinic.cta_text || 'Pedir Cita Online'}</span>
              </motion.button>
            </div>
          ) : (
            /* Split Hero (Default & Most Popular for Clinics) */
            <div className={`grid grid-cols-1 ${isMobile ? 'grid-cols-1 gap-6' : 'lg:grid-cols-12 gap-8 items-center'}`}>
              {/* Text Column */}
              <div className={`${isMobile ? 'order-2' : imageSide === 'left' ? 'lg:col-span-6 lg:order-2' : 'lg:col-span-6 lg:order-1'} space-y-4 sm:space-y-6 text-left`}>
                <div 
                  onClick={(e) => handleEdit(e, 'slogan', 'Especialidad & Lema')}
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold border ${editableClass('slogan')}`}
                  style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}40`, color: accentColor }}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>{clinic.slogan || 'Tecnología Avanzada & Salud'}</span>
                </div>

                <h2 
                  onClick={(e) => handleEdit(e, 'title', 'Nombre del Centro')}
                  className={`text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight ${editableClass('title')}`}
                >
                  {clinic.name}
                </h2>

                <p 
                  onClick={(e) => handleEdit(e, 'slogan', 'Descripción')}
                  className={`text-sm sm:text-base text-zinc-300 leading-relaxed font-sans ${editableClass('slogan')}`}
                >
                  {clinic.description || 'Diagnóstico de máxima precisión, aparatología médica de vanguardia y especialistas colegiados dedicados a tu recuperación y bienestar integral.'}
                </p>

                {/* Key Clinical Badges */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <motion.span whileHover={{ scale: 1.04 }} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-zinc-300 flex items-center gap-1.5 transition-colors">
                    <Check className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Cita Previa Sin Esperas</span>
                  </motion.span>
                  <motion.span whileHover={{ scale: 1.04 }} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-zinc-300 flex items-center gap-1.5 transition-colors">
                    <Check className="w-3.5 h-3.5 text-cyan-400" />
                    <span>1ª Consulta & Valoración</span>
                  </motion.span>
                  <motion.span whileHover={{ scale: 1.04 }} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-zinc-300 flex items-center gap-1.5 transition-colors">
                    <Check className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Acepta Principales Mutuas</span>
                  </motion.span>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                    onClick={handleAppointmentClick}
                    className={`px-5 py-3 rounded-xl text-black font-extrabold text-xs sm:text-sm transition flex items-center gap-2 shadow-xl ${editableClass('cta_button')}`}
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Calendar className="w-4 h-4 stroke-[2.5]" />
                    <span>{clinic.cta_text || 'Pedir Cita Online'}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </motion.button>

                  {clinic.whatsapp_number && (
                    <motion.a
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      href={`https://wa.me/${clinic.whatsapp_number.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/15 text-white font-semibold text-xs sm:text-sm transition flex items-center gap-2"
                    >
                      <span>Consulta por WhatsApp</span>
                    </motion.a>
                  )}
                </div>
              </div>

              {/* Image Column */}
              <div className={`${isMobile ? 'order-1' : imageSide === 'left' ? 'lg:col-span-6 lg:order-1' : 'lg:col-span-6 lg:order-2'}`}>
                <div 
                  onClick={(e) => handleEdit(e, 'hero_image', 'Foto de Portada')}
                  className={`rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 shadow-2xl relative ${editableClass('hero_image')}`}
                >
                  <img
                    src={clinic.hero_image || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1920&q=80'}
                    alt={clinic.name}
                    className={`w-full object-cover ${getImageHeight(imageSize)}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Floating Trust Badge */}
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-mono text-zinc-300 font-semibold">Instalaciones Homologadas</span>
                    </div>
                    <span className="font-mono text-[11px] text-cyan-400 font-bold">100% Calidad Garantizada</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. Accepted Insurances Strip */}
      {clinic.accepted_insurances && clinic.accepted_insurances.length > 0 && (
        <section className="border-b border-white/10 bg-zinc-950/60 py-4 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="font-mono text-zinc-400 uppercase text-[11px] font-semibold">
                Mutuas y Aseguradoras Aceptadas:
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {clinic.accepted_insurances.map((ins, idx) => (
                <motion.span 
                  key={idx}
                  whileHover={{ scale: 1.06, y: -1 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300 font-mono text-[11px] cursor-default"
                >
                  {ins}
                </motion.span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Treatments & Clinical Services Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 border-b border-white/10">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span 
              className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border"
              style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}30`, color: accentColor }}
            >
              Tratamientos & Especialidades
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Cuadro de Servicios Clínicos
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400">
              Selecciona una especialidad para ver nuestros tratamientos con diagnóstico y aparatología de última generación.
            </p>
          </div>

          {/* Category Tabs */}
          {categories.length > 1 && (
            <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat, idx) => {
                const isActive = activeCategory === idx;
                return (
                  <motion.button
                    key={idx}
                    type="button"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                    onClick={() => setActiveCategory(idx)}
                    className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                      isActive
                        ? 'text-black'
                        : 'text-zinc-300 hover:text-white bg-zinc-900/60 border border-white/10'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeClinicalTab"
                        className="absolute inset-0 bg-cyan-400 rounded-xl shadow-[0_0_18px_rgba(34,211,238,0.4)]"
                        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{cat.category || `Especialidad ${idx + 1}`}</span>
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* Services Grid */}
          <div className={`grid grid-cols-1 ${isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'md:grid-cols-2'} gap-4 sm:gap-6`}>
            {(currentCategory?.items || []).map((service, itemIdx) => (
              <motion.div
                key={itemIdx}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                onClick={(e) => handleEdit(e, 'treatment_item', service.name, { categoryIndex: activeCategory, itemIndex: itemIdx, item: service })}
                className={`p-5 rounded-2xl border border-white/10 transition-all hover:border-cyan-500/50 hover:shadow-[0_10px_30px_rgba(6,182,212,0.15)] space-y-3.5 flex flex-col justify-between cursor-pointer ${editableClass('treatment_item')}`}
                style={{ backgroundColor: surfaceColor }}
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      {service.image ? (
                        <img 
                          src={service.image} 
                          alt={service.name} 
                          className="w-12 h-12 rounded-xl object-cover border border-white/15 shrink-0" 
                        />
                      ) : (
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
                          style={{ backgroundColor: `${primaryColor}30`, color: accentColor }}
                        >
                          <Stethoscope className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-sm sm:text-base text-white">
                          {service.name}
                        </h4>
                        {service.badge && (
                          <span 
                            className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase mt-0.5"
                            style={{ backgroundColor: `${primaryColor}20`, color: accentColor }}
                          >
                            {service.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0 font-mono font-bold text-sm text-cyan-300">
                      {service.price}
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                    {service.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-zinc-400">
                    Cita Previa Recomendada
                  </span>
                  <motion.button
                    type="button"
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAppointmentClick}
                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition"
                  >
                    <span>Pedir Cita</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Contact, Schedule & Map Section */}
      <section 
        onClick={(e) => handleEdit(e, 'contact', 'Contacto & Horarios')}
        className={`py-12 sm:py-16 px-4 sm:px-6 bg-zinc-950/80 border-b border-white/10 ${editableClass('contact')}`}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Col 1: Ubicación */}
          <div className="space-y-3 p-5 rounded-2xl bg-zinc-900/60 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-white">Dónde Estamos</h4>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {clinic.address || 'Calle Gran Vía, 12'}<br />
              {clinic.postal_code || '21001'} {clinic.city || 'Huelva'}
            </p>
            {clinic.google_maps_url && (
              <a
                href={clinic.google_maps_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:underline pt-1 font-mono"
              >
                <span>Ver en Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Col 2: Horarios de Consulta */}
          <div className="space-y-3 p-5 rounded-2xl bg-zinc-900/60 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-white">Horarios de Consulta</h4>
            <div className="space-y-1.5 text-xs text-zinc-300 font-mono">
              <div className="flex justify-between">
                <span>Mañanas:</span>
                <span className="text-white font-semibold">{clinic.lunch_shift?.open || '09:00'} - {clinic.lunch_shift?.close || '14:00'}</span>
              </div>
              <div className="flex justify-between">
                <span>Tardes:</span>
                <span className="text-white font-semibold">{clinic.dinner_shift?.open || '16:00'} - {clinic.dinner_shift?.close || '20:30'}</span>
              </div>
              <div className="flex justify-between text-zinc-400 pt-1 border-t border-white/5">
                <span>Cerrado:</span>
                <span>{(clinic.closed_days || ['Sábado', 'Domingo']).join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Col 3: Contacto Directo & Urgencias */}
          <div className="space-y-3 p-5 rounded-2xl bg-zinc-900/60 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-white">Atención al Paciente</h4>
            <div className="space-y-2 text-xs text-zinc-300">
              <p>Teléfono Central: <strong className="text-white font-mono">{clinic.phone || '+34 959 10 20 30'}</strong></p>
              <p>WhatsApp Citas: <strong className="text-cyan-400 font-mono">{clinic.whatsapp_number || '+34 600 11 22 33'}</strong></p>
              <p className="text-[11px] text-zinc-400 font-mono truncate">Email: {clinic.email || 'citas@clinica.es'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="mt-auto py-8 px-4 sm:px-6 bg-black border-t border-white/10 text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="text-zinc-300 font-bold">{clinic.name}</span>
            <span className="mx-2">•</span>
            <span>{clinic.collegiate_number || 'Centro Sanitario Autorizado'}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Aviso Legal</span>
            <span>Privacidad de Datos Médicos (RGPD)</span>
            <span>Web por TecnOdiel CyS</span>
          </div>
        </div>
      </footer>

      {/* Appointment Modal */}
      <AppointmentModal
        clinic={clinic}
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
      />
    </div>
  );
}
