import React, { useState, useEffect } from 'react';
import { 
  Check, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Utensils, 
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
  Layers
} from 'lucide-react';
import { createRestaurant, sanitizeSlug } from '../../lib/supabase';
import confetti from 'canvas-confetti';

// Las 6 plantillas de la landing tal cual, con su imagen de fondo real
export const RESTAURANT_TEMPLATES = [
  {
    id: 'the-awwwards-cinematic',
    num: '01',
    name: 'Cinematográfico',
    tag: 'Alta cocina, vídeo y fotos a pantalla completa',
    desc: 'Vídeos y fotos de tus platos a pantalla completa para abrir el apetito desde el primer segundo.',
    image: '/demos/noir-atelier.jpg',
    primary: '#ffffff',
    bg: '#000000'
  },
  {
    id: 'the-neo-bento-brutalist',
    num: '02',
    name: 'Urbano',
    tag: 'Hamburgueserías y street food con mucha personalidad',
    desc: 'Diseño joven y dinámico, ideal para smash burgers, pizzas y comida para llevar.',
    image: '/demos/smash-destroy.jpg',
    primary: '#FFE600',
    bg: '#ffffff'
  },
  {
    id: 'the-glass-fluid',
    num: '03',
    name: 'Cristal',
    tag: 'Coctelería y locales de copas, moderno y elegante',
    desc: 'Estilo nocturno y elegante para cartas de cócteles, copas, vinos selectos y cenas.',
    image: '/demos/aura-velvet.jpg',
    primary: '#a855f7',
    bg: '#070510'
  },
  {
    id: 'the-editorial-print',
    num: '04',
    name: 'Editorial',
    tag: 'Estilo revista para bistrós y cocina de autor',
    desc: 'Diseño sobrio y limpio como una revista de alta cocina para menú degustación.',
    image: '/demos/le-maison.jpg',
    primary: '#1c1917',
    bg: '#F9F6F0'
  },
  {
    id: 'the-cyber-terminal',
    num: '05',
    name: 'Futurista',
    tag: 'Fusión y locales jóvenes que quieren destacar',
    desc: 'Tus clientes ven la carta rápido y te envían el pedido directo sin complicaciones.',
    image: '/demos/cyber-fusion.jpg',
    primary: '#00FF66',
    bg: '#121316'
  },
  {
    id: 'the-rustic-organic',
    num: '06',
    name: 'Rústico',
    tag: 'Asadores y cocina tradicional, cálido y cercano',
    desc: 'Tonos cálidos y ambiente acogedor de toda la vida para carnes, guisos y raciones.',
    image: '/demos/casa-encina.jpg',
    primary: '#8B5A2B',
    bg: '#2A1E17'
  }
];

// Opciones de servicios seleccionables (idénticas a la imagen del usuario)
const SERVICE_OPTIONS = [
  'Reserva de mesas',
  'Carta digital QR',
  'Página web completa',
  'Panel de administración',
  'Cobro por Bizum / Tarjeta',
  'Tienda online / Para llevar',
  'Posicionamiento en Google Maps',
  'Automatización con WhatsApp',
  'No lo sé, necesito consejo'
];

export default function RestaurantWizard({ onCreated, onCancel }) {
  const [step, setStep] = useState(1); // 1: Plantilla, 2: Servicios, 3: Redes y detalles, 4: Listo
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    business_name: '',
    phone: '',
    email: '',
    template_id: 'the-awwwards-cinematic',
    selected_services: ['Carta digital QR', 'Reserva de mesas', 'Página web completa'],
    instagram_url: '',
    facebook_url: '',
    current_website: '',
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
    const finalBusinessName = formData.business_name || formData.name || 'Mi Restaurante';
    const slug = sanitizeSlug(finalBusinessName);

    const fullPayload = {
      name: finalBusinessName,
      slug: slug,
      subdomain: slug,
      slogan: 'Cocina de calidad y buen servicio',
      description: formData.notes || 'Carta digital y reservas directas.',
      category: 'tapas',
      template_id: formData.template_id,
      hero_image: RESTAURANT_TEMPLATES.find(t => t.id === formData.template_id)?.image,
      phone: formData.phone || '+34 600 000 000',
      whatsapp_number: formData.phone || '+34 600 000 000',
      email: formData.email || 'contacto@restaurante.es',
      instagram_url: formData.instagram_url,
      current_website: formData.current_website,
      selected_modules: formData.selected_services,
      client_access_key: `TO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    };

    try {
      const saved = await createRestaurant(fullPayload);
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
      } else {
        window.location.hash = `#/portal?r=${slug}`;
      }
    } catch (err) {
      console.warn('Guardando en modo local:', err);
      const fallback = { ...fullPayload, id: `rest-${Date.now()}` };
      if (onCreated) onCreated(fallback);
      else window.location.hash = `#/portal?r=${slug}`;
    } finally {
      setSaving(false);
    }
  };

  const selectedTemplateObj = RESTAURANT_TEMPLATES.find(t => t.id === formData.template_id);

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
              <span>CONFIGURA TU RESTAURANTE</span>
              <span className="text-[10px] bg-[#6DD94B] text-black px-2 py-0.5 rounded font-black">
                TECNODIEL
              </span>
            </h1>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Paso {step} de 3 • Todo lo que quieras cambiar lo afinamos en el chat de tu portal
            </p>
          </div>
        </div>

        {/* Pasos */}
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
                {num === 1 ? 'Plantilla' : num === 2 ? 'Servicios' : 'Tus Redes'}
              </span>
            </div>
          ))}
        </div>
      </header>

      {/* ── CONTENIDO DEL FORMULARIO ── */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-between">
        
        {/* ── PASO 1: LAS 6 PLANTILLAS DE LA LANDING TAL CUAL CON SU FOTO DE FONDO ── */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs uppercase font-extrabold text-[#6DD94B] tracking-wider block">
                // PASO 01 • ELIGE EL ESTILO DE TU WEB
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-white">
                ¿Qué estilo encaja mejor con tu negocio?
              </h2>
              <p className="text-sm text-zinc-400">
                Selecciona una de las 6 plantillas de la landing. Luego podrás cambiar fotos y platos a tu gusto en el chat.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {RESTAURANT_TEMPLATES.map((tpl) => {
                const isSelected = formData.template_id === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => setFormData({ ...formData, template_id: tpl.id })}
                    className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-200 cursor-pointer group flex flex-col justify-end min-h-[260px] sm:min-h-[280px] p-5 shadow-xl ${
                      isSelected 
                        ? 'border-[#6DD94B] ring-4 ring-[#6DD94B]/20 scale-[1.02]' 
                        : 'border-white/10 hover:border-white/40'
                    }`}
                  >
                    {/* Imagen de fondo real */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${tpl.image})` }}
                    />
                    {/* Gradiente oscuro para máxima legibilidad */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/30" />

                    {/* Insignia superior */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                      <span className="px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-extrabold text-[#6DD94B] border border-white/15 uppercase">
                        {tpl.num} // {tpl.name}
                      </span>
                      {isSelected && (
                        <span className="h-7 w-7 rounded-full bg-[#6DD94B] text-black flex items-center justify-center font-bold shadow-lg">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </span>
                      )}
                    </div>

                    {/* Contenido inferior */}
                    <div className="relative z-10 space-y-1.5">
                      <span className="text-[11px] font-bold text-[#6DD94B] block uppercase tracking-wide">
                        {tpl.tag}
                      </span>
                      <h3 className="text-lg font-black text-white leading-tight uppercase">
                        {tpl.name}
                      </h3>
                      <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                        {tpl.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-8 py-3.5 bg-[#6DD94B] hover:bg-white text-black font-extrabold text-xs sm:text-sm uppercase rounded-xl flex items-center gap-2 transition cursor-pointer shadow-[0_0_20px_rgba(109,217,75,0.3)]"
              >
                <span>Continuar a Servicios</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── PASO 2: QUÉ SERVICIOS TE INTERESAN ── */}
        {step === 2 && (
          <div className="space-y-6 max-w-3xl mx-auto w-full">
            <div className="space-y-1">
              <span className="text-xs uppercase font-extrabold text-[#6DD94B] tracking-wider block">
                // PASO 02 • QUÉ NECESITA TU NEGOCIO
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-white">
                ¿Qué servicios te interesan?
              </h2>
              <p className="text-sm text-zinc-400">
                Selecciona todas las opciones que te gustaría tener en tu web. Puedes marcar varias.
              </p>
            </div>

            {/* Píldoras de selección como en la imagen del usuario */}
            <div className="flex flex-wrap gap-2.5 sm:gap-3 pt-2">
              {SERVICE_OPTIONS.map((srv) => {
                const isSelected = formData.selected_services.includes(srv);
                return (
                  <button
                    key={srv}
                    type="button"
                    onClick={() => toggleService(srv)}
                    className={`px-4 sm:px-5 py-3 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                      isSelected
                        ? 'border-[#6DD94B] bg-[#6DD94B]/15 text-[#6DD94B] shadow-[0_0_15px_rgba(109,217,75,0.2)]'
                        : 'border-white/15 bg-zinc-900/80 text-zinc-300 hover:border-white/40 hover:text-white'
                    }`}
                  >
                    {isSelected ? (
                      <Check className="w-4 h-4 text-[#6DD94B] stroke-[3]" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-zinc-600" />
                    )}
                    <span>{srv}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-4 rounded-xl border border-white/10 bg-zinc-900/60 text-xs text-zinc-400 flex items-start gap-3">
              <HelpCircle className="w-4 h-4 text-[#6DD94B] shrink-0 mt-0.5" />
              <p>
                No te preocupes si dudas con alguna opción: una vez dentro de tu portal podrás hablar con nosotros por chat y añadir o quitar servicios sin ningún compromiso.
              </p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-white/20 hover:border-white text-zinc-300 hover:text-white font-bold text-xs uppercase rounded-xl transition cursor-pointer"
              >
                ← Volver a plantilla
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-8 py-3.5 bg-[#6DD94B] hover:bg-white text-black font-extrabold text-xs sm:text-sm uppercase rounded-xl flex items-center gap-2 transition cursor-pointer shadow-[0_0_20px_rgba(109,217,75,0.3)]"
              >
                <span>Siguiente: Redes & Detalles</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── PASO 3: REDES SOCIALES O WEB PREVIA & ENVIAR ── */}
        {step === 3 && (
          <div className="space-y-6 max-w-2xl mx-auto w-full">
            <div className="space-y-1">
              <span className="text-xs uppercase font-extrabold text-[#6DD94B] tracking-wider block">
                // PASO 03 • TUS REDES SOCIALES Y CONTACTO
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-white">
                ¿Tienes redes sociales o una web ya hecha?
              </h2>
              <p className="text-sm text-zinc-400">
                Así podremos revisar tu carta, logotipo y fotos actuales para dejártelo todo listo.
              </p>
            </div>

            <div className="bg-[#181818] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block">
                  Nombre del Negocio o Restaurante *
                </label>
                <input
                  type="text"
                  required
                  value={formData.business_name}
                  onChange={e => setFormData({ ...formData, business_name: e.target.value })}
                  placeholder="Ej. Taberna La Esquina / Burger Smash"
                  className="w-full bg-[#121212] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#6DD94B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block">
                  Tu Instagram o Facebook (si tienes)
                </label>
                <input
                  type="text"
                  value={formData.instagram_url}
                  onChange={e => setFormData({ ...formData, instagram_url: e.target.value })}
                  placeholder="@tunegocio / https://instagram.com/tunegocio"
                  className="w-full bg-[#121212] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#6DD94B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block">
                  ¿Tienes ya una web hecha? (Opcional)
                </label>
                <input
                  type="text"
                  value={formData.current_website}
                  onChange={e => setFormData({ ...formData, current_website: e.target.value })}
                  placeholder="https://miwebactual.es o déjalo vacío si es nueva"
                  className="w-full bg-[#121212] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#6DD94B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block">
                  Cuéntanos cualquier detalle de tu negocio (Opcional)
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Por ejemplo: si tienes platos estrella, si necesitas carta en inglés, tus horarios..."
                  className="w-full bg-[#121212] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#6DD94B]"
                />
              </div>
            </div>

            {/* Resumen de confirmación */}
            <div className="p-4 rounded-xl border border-[#6DD94B]/30 bg-[#6DD94B]/10 flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#6DD94B] shrink-0" />
                <span>Plantilla elegida: <strong>{selectedTemplateObj?.name}</strong></span>
              </div>
              <span className="font-bold text-[#6DD94B] uppercase">Chat en vivo incluido</span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-3 border border-white/20 hover:border-white text-zinc-300 hover:text-white font-bold text-xs uppercase rounded-xl transition cursor-pointer"
              >
                ← Volver a servicios
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={handleFinish}
                className="px-8 py-4 bg-[#6DD94B] hover:bg-white text-black font-extrabold text-xs sm:text-sm uppercase rounded-xl flex items-center gap-2 transition cursor-pointer shadow-[0_0_25px_rgba(109,217,75,0.4)] disabled:opacity-50"
              >
                <span>{saving ? 'Creando tu cuenta...' : 'ENTRAR A MI PORTAL DE CLIENTE'}</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
