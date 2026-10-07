import React, { useState, useEffect } from 'react';
import { 
  Check, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Stethoscope, 
  Globe, 
  Instagram, 
  Send, 
  Sparkles, 
  MessageCircle,
  HelpCircle,
  Phone,
  Mail,
  Building2,
  Calendar,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { createClinic, sanitizeSlug } from '../../lib/supabase';
import confetti from 'canvas-confetti';

// Las 6 plantillas de Clínicas y Salud tal cual están en la landing
export const CLINIC_TEMPLATES = [
  {
    id: 'the-ultra-minimal-swiss',
    num: '01',
    name: 'Minimal',
    tag: 'Limpio y profesional para clínicas dentales',
    desc: 'Fondo blanco impecable y diseño ordenado que transmite máxima higiene, confianza y tranquilidad médica.',
    image: '/demos/swiss-dental.jpg',
    primary: '#0055FF',
    bg: '#ffffff'
  },
  {
    id: 'the-dark-biotech',
    num: '02',
    name: 'Alta tecnología',
    tag: 'Medicina deportiva y centros de última generación',
    desc: 'Aspecto moderno y activo para mostrar tratamientos de rehabilitación, lesiones y readaptación física.',
    image: '/demos/genome-biotech.jpg',
    primary: '#06b6d4',
    bg: '#030712'
  },
  {
    id: 'the-pediatric-playful',
    num: '03',
    name: 'Amable',
    tag: 'Pediatría y familias, colorido y cercano',
    desc: 'Colores amables y ambiente acogedor que quita el miedo al médico y transmite cercanía a los padres.',
    image: '/demos/pequenos-gigantes.jpg',
    primary: '#70D6BC',
    bg: '#FAF7F2'
  },
  {
    id: 'the-horizontal-zen',
    num: '04',
    name: 'Zen',
    tag: 'Psicología, spa y bienestar, sereno',
    desc: 'Diseño tranquilo y suave para consultas de psicología, nutrición, salud mental y bienestar.',
    image: '/demos/espacio-vacio.jpg',
    primary: '#8C8476',
    bg: '#F3EFEA'
  },
  {
    id: 'the-luxury-curtain',
    num: '05',
    name: 'Lujo',
    tag: 'Estética avanzada y tratamientos premium',
    desc: 'Elegancia y sofisticación para clínicas de estética, dermatología y tratamientos de belleza.',
    image: '/demos/aura-gold.jpg',
    primary: '#D4AF37',
    bg: '#0A0A0A'
  },
  {
    id: 'the-tech-ortho',
    num: '06',
    name: 'Precisión',
    tag: 'Ortodoncia y traumatología con aire técnico',
    desc: 'Muestra tus instalaciones, aparatología de última tecnología y cuadro de especialistas colegiados.',
    image: '/demos/ortho-tech.jpg',
    primary: '#0055FF',
    bg: '#ffffff'
  }
];

// Opciones de servicios sanitarios seleccionables
const SERVICE_OPTIONS = [
  'Cita previa online 24/7',
  'Recordatorios por WhatsApp',
  'Página web médica completa',
  'Panel de administración de citas',
  'Filtro de seguros y mutuas',
  'Posicionamiento en Google Maps',
  'Ficha de especialistas y equipo',
  'Cobro de consultas / reservas',
  'No lo sé, necesito consejo'
];

export default function ClinicWizard({ onCreated, onCancel, onOpenPortal }) {
  const [step, setStep] = useState(1); // 1: Plantilla, 2: Servicios, 3: Redes y detalles
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    business_name: '',
    phone: '',
    email: '',
    template_id: 'the-ultra-minimal-swiss',
    selected_services: ['Cita previa online 24/7', 'Recordatorios por WhatsApp', 'Página web médica completa'],
    instagram_url: '',
    facebook_url: '',
    current_website: '',
    collegiate_number: '',
    notes: ''
  });

  // Cargar datos pre-rellenados de la landing si existen
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('tecnodiel_lead_data') || localStorage.getItem('tecnodiel_lead_data');
      if (raw) {
        const parsed = JSON.parse(raw);
        setFormData(prev => ({
          ...prev,
          name: parsed.name || prev.name,
          business_name: parsed.business_name || parsed.name || prev.business_name,
          phone: parsed.phone || prev.phone,
          email: parsed.email || prev.email
        }));
      }
    } catch (_) {}
  }, []);

  const toggleService = (srv) => {
    setFormData(prev => {
      const exists = prev.selected_services.includes(srv);
      return {
        ...prev,
        selected_services: exists 
          ? prev.selected_services.filter(s => s !== srv)
          : [...prev.selected_services, srv]
      };
    });
  };

  const handleFinish = async () => {
    setSaving(true);
    const finalBusinessName = formData.business_name || formData.name || 'Mi Clínica';
    const slug = sanitizeSlug(finalBusinessName);

    const fullPayload = {
      name: finalBusinessName,
      slug: slug,
      subdomain: slug,
      slogan: 'Salud, rigor médico y atención cercana',
      description: formData.notes || 'Atención personalizada y cita previa online.',
      category: 'dental',
      template_id: formData.template_id,
      hero_image: CLINIC_TEMPLATES.find(t => t.id === formData.template_id)?.image,
      phone: formData.phone || '+34 600 000 000',
      whatsapp_number: formData.phone || '+34 600 000 000',
      email: formData.email || 'citas@clinica.es',
      instagram_url: formData.instagram_url,
      current_website: formData.current_website,
      collegiate_number: formData.collegiate_number,
      selected_modules: formData.selected_services,
      client_access_key: `TO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    };

    try {
      const saved = await createClinic(fullPayload);
      try {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      } catch (_) {}

      // Guardar sesión para el portal de clientes
      try {
        sessionStorage.setItem('tecnodiel_auth_session', JSON.stringify({
          slug: slug,
          key: fullPayload.client_access_key
        }));
      } catch (_) {}

      if (onCreated) {
        onCreated(saved || fullPayload);
      } else if (onOpenPortal) {
        onOpenPortal(slug);
      } else {
        window.location.hash = `#/portal?r=${slug}`;
      }
    } catch (err) {
      console.warn('Guardando en modo local:', err);
      const fallback = { ...fullPayload, id: `clinic-${Date.now()}` };
      if (onCreated) onCreated(fallback);
      else if (onOpenPortal) onOpenPortal(slug);
      else window.location.hash = `#/portal?r=${slug}`;
    } finally {
      setSaving(false);
    }
  };

  const selectedTemplateObj = CLINIC_TEMPLATES.find(t => t.id === formData.template_id);

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col font-sans selection:bg-[#6DD94B] selection:text-black">
      {/* ── CABECERA LIMPIA ── */}
      <header className="h-16 sm:h-20 border-b border-white/10 bg-[#161616] px-4 sm:px-8 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel || (() => window.history.back())}
            className="p-2 border border-white/10 hover:border-white text-zinc-400 hover:text-white transition flex items-center gap-1.5 text-xs font-bold uppercase rounded-lg cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Volver</span>
          </button>
          <div className="h-5 w-px bg-white/10 hidden sm:block" />
          <div>
            <h1 className="text-sm sm:text-base font-extrabold uppercase text-white flex items-center gap-2">
              <span>CONFIGURA TU CLÍNICA</span>
              <span className="text-[10px] bg-[#6DD94B] text-black px-2 py-0.5 rounded font-black">
                TECNODIEL
              </span>
            </h1>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Paso {step} de 3 • Cualquier cambio lo coordinamos en el chat de tu portal con Mario y Dani
            </p>
          </div>
        </div>

        {/* Indicador de Pasos */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-bold transition ${
                step === num 
                  ? 'bg-[#6DD94B] text-black' 
                  : step > num 
                  ? 'bg-zinc-800 text-[#6DD94B]' 
                  : 'bg-zinc-900 text-zinc-500'
              }`}
            >
              <span>0{num}</span>
              <span className="hidden md:inline">
                {num === 1 ? 'Plantilla' : num === 2 ? 'Servicios' : 'Tus Datos'}
              </span>
            </div>
          ))}
        </div>
      </header>

      {/* ── CONTENIDO DEL FORMULARIO ── */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-between">
        {/* PASO 1: ELEGIR PLANTILLA */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#6DD94B] uppercase">Paso 01</span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
                Elige el diseño que mejor encaja con tu centro
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                Son las 6 plantillas de la web con fotos reales. Elige la base que más te guste; los colores, fotos de tus instalaciones y textos los adaptamos a ti.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CLINIC_TEMPLATES.map((tmpl) => {
                const isSelected = formData.template_id === tmpl.id;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => setFormData(prev => ({ ...prev, template_id: tmpl.id }))}
                    className={`group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-200 flex flex-col text-left ${
                      isSelected 
                        ? 'border-[#6DD94B] ring-2 ring-[#6DD94B]/30 shadow-xl shadow-[#6DD94B]/10' 
                        : 'border-white/10 hover:border-white/30 bg-zinc-900/60'
                    }`}
                  >
                    {/* Imagen de fondo real */}
                    <div className="h-44 sm:h-48 w-full relative overflow-hidden bg-zinc-950">
                      <img 
                        src={tmpl.image} 
                        alt={tmpl.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                      
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="text-xs font-mono font-black bg-black/70 backdrop-blur-md text-[#6DD94B] px-2 py-0.5 rounded border border-white/10">
                          {tmpl.num}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white px-2 py-0.5 rounded backdrop-blur-md">
                          {tmpl.tag}
                        </span>
                      </div>

                      {isSelected && (
                        <div className="absolute top-3 right-3 bg-[#6DD94B] text-black p-1.5 rounded-full shadow-lg">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}

                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-lg font-black uppercase text-white drop-shadow">
                          {tmpl.name}
                        </h3>
                      </div>
                    </div>

                    {/* Descripción */}
                    <div className="p-4 bg-zinc-900/90 flex-1 flex flex-col justify-between">
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        {tmpl.desc}
                      </p>
                      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-bold">
                        <span className={isSelected ? 'text-[#6DD94B]' : 'text-zinc-400 group-hover:text-white'}>
                          {isSelected ? '✓ Seleccionada' : 'Seleccionar plantilla'}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#6DD94B] transition" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PASO 2: SERVICIOS QUE TE INTERESAN */}
        {step === 2 && (
          <div className="space-y-6 max-w-2xl mx-auto w-full animate-fadeIn">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#6DD94B] uppercase">Paso 02</span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
                ¿Qué servicios te interesan para tu centro?
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                Marca todo lo que tengas en mente. Puedes elegir varios o desmarcar lo que no necesites.
              </p>
            </div>

            {/* Chips de servicios interactivos */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              {SERVICE_OPTIONS.map((srv) => {
                const active = formData.selected_services.includes(srv);
                return (
                  <button
                    key={srv}
                    type="button"
                    onClick={() => toggleService(srv)}
                    className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase transition flex items-center gap-2 cursor-pointer border ${
                      active
                        ? 'bg-[#6DD94B] text-black border-[#6DD94B] shadow-md shadow-[#6DD94B]/20'
                        : 'bg-zinc-900 text-zinc-300 border-white/10 hover:border-white/30 hover:bg-zinc-800'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${active ? 'bg-black' : 'bg-zinc-600'}`} />
                    {srv}
                  </button>
                );
              })}
            </div>

            {/* Tarjeta informativa de cercanía */}
            <div className="p-4 rounded-xl border border-white/10 bg-zinc-900/40 flex items-start gap-3 mt-6">
              <MessageCircle className="w-5 h-5 text-[#6DD94B] shrink-0 mt-0.5" />
              <div className="text-xs text-zinc-300 leading-relaxed">
                <span className="font-bold text-white block mb-0.5">Tranquilo, no hay compromisos:</span>
                Si luego quieres añadir o quitar algo, o no tienes claro qué mutuas incluir, nos lo dices directamente por el chat del portal o por WhatsApp y lo ajustamos en el momento.
              </div>
            </div>
          </div>
        )}

        {/* PASO 3: REDES SOCIALES, WEB ACTUAL Y NOTAS */}
        {step === 3 && (
          <div className="space-y-6 max-w-2xl mx-auto w-full animate-fadeIn">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#6DD94B] uppercase">Paso 03</span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
                Tus redes sociales y detalles de tu centro
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                Si ya tienes redes, web antigua o número de registro sanitario, ponlo aquí para que podamos reutilizar fotos, servicios e información médica.
              </p>
            </div>

            <div className="space-y-4">
              {/* Instagram */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-pink-500" />
                  Instagram de tu centro / clínica
                </label>
                <input
                  type="text"
                  placeholder="ej. @clinicadental_huelva o enlace"
                  value={formData.instagram_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, instagram_url: e.target.value }))}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#6DD94B] transition"
                />
              </div>

              {/* Web actual si tiene */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-sky-400" />
                  ¿Tienes ya alguna web hecha? (opcional)
                </label>
                <input
                  type="text"
                  placeholder="ej. www.miclinicaactual.es"
                  value={formData.current_website}
                  onChange={(e) => setFormData(prev => ({ ...prev, current_website: e.target.value }))}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#6DD94B] transition"
                />
              </div>

              {/* Registro sanitario / colegiado */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#6DD94B]" />
                  Nº Colegiado / Registro Sanitario (opcional)
                </label>
                <input
                  type="text"
                  placeholder="ej. Col. 21/0432 - NICA 45892"
                  value={formData.collegiate_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, collegiate_number: e.target.value }))}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#6DD94B] transition"
                />
              </div>

              {/* Notas y preferencias */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  ¿Algo especial que quieras comentarnos?
                </label>
                <textarea
                  rows={3}
                  placeholder="ej. Somos 3 doctores, trabajamos con Adeslas y Sanitas, queremos que la gente pueda pedir cita por WhatsApp..."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#6DD94B] transition resize-none"
                />
              </div>
            </div>

            {/* Recordatorio amigable de Mario & Dani */}
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/10 text-xs text-zinc-400 leading-relaxed flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#6DD94B] shrink-0" />
              <span>
                Al terminar, entrarás directo a tu <strong className="text-white">Portal de Cliente</strong>. Allí tendrás un chat directo con Mario y Dani para pedir cualquier ajuste en tus textos, tratamientos, fotos o citas.
              </span>
            </div>
          </div>
        )}

        {/* ── BOTONES DE NAVEGACIÓN INFERIOR ── */}
        <div className="pt-8 border-t border-white/10 flex items-center justify-between mt-8">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 rounded-xl border border-white/20 hover:border-white text-xs font-bold uppercase text-zinc-300 hover:text-white transition flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </button>
          ) : (
            <button
              type="button"
              onClick={onCancel || (() => window.history.back())}
              className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-bold uppercase text-zinc-400 hover:text-white transition cursor-pointer"
            >
              Cancelar
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-6 py-3 rounded-xl bg-[#6DD94B] hover:bg-[#5bc53a] text-black text-xs sm:text-sm font-black uppercase tracking-wider transition flex items-center gap-2 cursor-pointer shadow-lg shadow-[#6DD94B]/20"
            >
              Siguiente
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              disabled={saving}
              className="px-8 py-3.5 rounded-xl bg-[#6DD94B] hover:bg-[#5bc53a] text-black text-xs sm:text-sm font-black uppercase tracking-wider transition flex items-center gap-2 cursor-pointer shadow-xl shadow-[#6DD94B]/30 disabled:opacity-50"
            >
              {saving ? 'Creando tu portal...' : '¡Listo, acceder a mi portal!'}
              <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
