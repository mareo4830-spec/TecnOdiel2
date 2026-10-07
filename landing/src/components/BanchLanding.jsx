import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpRight, 
  Utensils, 
  Stethoscope, 
  Globe, 
  Zap, 
  Search, 
  Smartphone, 
  ShieldCheck, 
  ShoppingBag, 
  Check, 
  ChevronDown, 
  Layers, 
  Database, 
  Sparkles, 
  Building2,
  Clock,
  ExternalLink,
  ArrowRight,
  Sliders,
  Eye,
  CheckCircle2,
  MousePointer2
} from 'lucide-react';
import MarqueeTicker from './MarqueeTicker';

export default function BanchLanding({ 
  onNavigateToMultiwebs, 
  onNavigateToCyS, 
  onOpenAudit,
  onNavigateToPortal
}) {
  // Cursor interactivo Banch (#cursor)
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [cursorHovered, setCursorHovered] = useState(false);
  const [cursorText, setCursorText] = useState('');

  // Active panel en showcase interactivo Banch (0: Hostelería, 1: Clínicas, 2: Rendimiento, 3: Portal)
  const [activePanel, setActivePanel] = useState(0);

  // Active template selector dentro del panel interactivo
  const [activeHostTemplate, setActiveHostTemplate] = useState(0);
  const [activeClinicTemplate, setActiveClinicTemplate] = useState(0);

  // Scroll detection para cambio dinámico de fondos (#121212 -> #0D844A -> #FFFFFF -> #121212)
  const [scrollSection, setScrollSection] = useState('black');

  // Form State Banch
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    platform: 'hosteleria',
    message: '',
    privacy: false
  });

  // Track cursor position
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Track scroll para cambiar el fondo dinámico estilo Banch
  useEffect(() => {
    const handleScroll = () => {
      const vh = window.innerHeight;
      const specElement = document.getElementById('especificaciones');
      const greenElement = document.getElementById('made-to-work');

      if (specElement) {
        const specRect = specElement.getBoundingClientRect();
        if (specRect.top <= vh / 2 && specRect.bottom >= vh / 2) {
          setScrollSection('white');
          return;
        }
      }

      if (greenElement) {
        const greenRect = greenElement.getBoundingClientRect();
        if (greenRect.top <= vh / 2 && greenRect.bottom >= vh / 2) {
          setScrollSection('green');
          return;
        }
      }

      setScrollSection('black');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnterInteract = (text = '') => {
    setCursorHovered(true);
    setCursorText(text);
  };

  const handleMouseLeaveInteract = () => {
    setCursorHovered(false);
    setCursorText('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.privacy) {
      alert('Por favor, acepta la política de privacidad para continuar.');
      return;
    }
    setFormSent(true);
  };

  // 6 Plantillas de Hostelería con características de diseño reales
  const hosteleriaTemplates = [
    {
      id: 1,
      num: '01',
      name: 'The Awwwards Cinematic',
      tag: 'Referencia Instagram / Ultra Oscuro',
      bg: '#000000',
      accent: '#6DD94B',
      desc: 'Fondo negro profundo con mix-blend-mode sobre vídeo. Text Masking con clip-path vertical, overflow-hidden y parallax dinámico con enlaces magnéticos.',
      feature: 'Parallax + Clip-path Text Reveal'
    },
    {
      id: 2,
      num: '02',
      name: 'The Neo-Bento Brutalist',
      tag: 'Hamburgueserías & Street Food',
      bg: '#FFFFFF',
      accent: '#EAB308',
      desc: 'Grid asimétrico Bento box. Bordes negros de 4px, sombras sólidas de 8px sin desenfoque y físicas spring ultra-reactivas (stiffness 400).',
      feature: 'Sombras sólidas 8px + Físicas Spring'
    },
    {
      id: 3,
      num: '03',
      name: 'The Glass Fluid',
      tag: 'Coctelerías Premium & Nightlife',
      bg: '#090d16',
      accent: '#38BDF8',
      desc: 'Gradientes de malla (Mesh gradients) continuos. Paneles acrílicos con backdrop-blur-3xl, cápsulas redondeadas y brillo interior luminoso.',
      feature: 'Mesh Gradients + Acrílico 3D'
    },
    {
      id: 4,
      num: '04',
      name: 'The Editorial Print',
      tag: 'Restaurantes de Autor & Fine Dining',
      bg: '#F9F6F0',
      accent: '#18181b',
      desc: 'Revista de alta gama impresa. Fondo sepia/hueso, layout multi-columna, tipografía serif editorial y barridos de imagen horizontales.',
      feature: 'Tipografía Serif + Multi-columna'
    },
    {
      id: 5,
      num: '05',
      name: 'The Cyber-Terminal',
      tag: 'Comida Fusión & Geek Kitchen',
      bg: '#0d1117',
      accent: '#22c55e',
      desc: 'Fondo grafito con rejilla técnica SVG. Tipografía monoespaciada de consola, efecto typewriter automático y glitches de imagen interactivos.',
      feature: 'Monospace + Auto Typewriter'
    },
    {
      id: 6,
      num: '06',
      name: 'The Rustic Organic',
      tag: 'Asadores Tradicionales & Brasas',
      bg: '#1c1611',
      accent: '#f97316',
      desc: 'Tonos tierra cálidos. Máscaras SVG con bordes de papel rasgado, fotografías Polaroid superpuestas y botones de curvatura asimétrica.',
      feature: 'Bordes rasgados + Polaroid'
    }
  ];

  // 6 Plantillas de Clínicas con características de diseño reales
  const clinicTemplates = [
    {
      id: 1,
      num: '01',
      name: 'The Ultra-Minimal Swiss',
      tag: 'Dentales de Lujo & Cirugía',
      bg: '#ffffff',
      accent: '#18181b',
      desc: 'Blanco absoluto. Grid matemático suizo con tipografías proporcionales frente a grandes vacíos. Botones con flecha delgada revelada al pasar el ratón.',
      feature: 'Grid Suizo + Blanco Puro'
    },
    {
      id: 2,
      num: '02',
      name: 'The Dark Biotech',
      tag: 'Medicina Deportiva & Biotecnología',
      bg: '#040d1a',
      accent: '#6DD94B',
      desc: 'Azul marino profundo. Fondo con gráficos moleculares vectoriales, layout tipo dashboard y decodificador de caracteres tipográficos.',
      feature: 'Decoder Tipográfico + Dashboard'
    },
    {
      id: 3,
      num: '03',
      name: 'The Pediatric Playful',
      tag: 'Pediatría & Odontopediatría',
      bg: '#fdf4ff',
      accent: '#ec4899',
      desc: 'Colores pastel amables. Blobs orgánicos continuos, tipografía redondeada y botones elásticos de goma que rebotan al hacer clic.',
      feature: 'Blobs Orgánicos + Físicas Goma'
    },
    {
      id: 4,
      num: '04',
      name: 'The Horizontal Zen',
      tag: 'Psicología & Fisioterapia',
      bg: '#13191c',
      accent: '#14b8a6',
      desc: 'Navegación completa en scroll horizontal. Tonos arena y niebla, tracking tipográfico expansivo y orbes circulares de interacción.',
      feature: 'Scroll Horizontal + Tonos Niebla'
    },
    {
      id: 5,
      num: '05',
      name: 'The Luxury Curtain',
      tag: 'Clínicas Estéticas & Antiaging',
      bg: '#0a0a0a',
      accent: '#eab308',
      desc: 'Oro mate y negro obsidiana. Transiciones de telón deslizante vertical, serifs de alta costura y bordes envolventes dorados.',
      feature: 'Transición Telón + Oro Mate'
    },
    {
      id: 6,
      num: '06',
      name: 'The Tech-Ortho',
      tag: 'Ortodoncia Avanzada & 3D',
      bg: '#0e1726',
      accent: '#3b82f6',
      desc: 'Estética Wireframe arquitectónica. Líneas estructurales visibles, ilustraciones isométricas y línea de escáner láser luminoso sobre imágenes.',
      feature: 'Escáner Láser + Wireframe CAD'
    }
  ];

  const panelsData = [
    {
      id: 0,
      code: '01',
      title: 'RESTO & BARS',
      platform: 'HOSTELERÍA',
      desc: '6 Plantillas independientes con aislamiento total de CSS y DOM. Carta digital QR táctil en 0.2 segundos y reservas directas a tu WhatsApp sin pagar el 15-30% a plataformas intermediarias.',
      action: onNavigateToMultiwebs,
      actionText: 'ABRIR CONFIGURADOR HOSTELERÍA',
      templates: hosteleriaTemplates,
      activeTemplate: activeHostTemplate,
      setActiveTemplate: setActiveHostTemplate
    },
    {
      id: 1,
      code: '02',
      title: 'CLINIC & HEALTH',
      platform: 'CLÍNICAS & SALUD',
      desc: '6 Plantillas médicas especializadas. Cita previa online 24/7, catálogo de tratamientos, sincronización con calendario y RGPD sanitaria con alojamiento SSL de alta seguridad.',
      action: onNavigateToCyS,
      actionText: 'ABRIR CONFIGURADOR CLÍNICAS',
      templates: clinicTemplates,
      activeTemplate: activeClinicTemplate,
      setActiveTemplate: setActiveClinicTemplate
    },
    {
      id: 2,
      code: '03',
      title: 'LOCAL IMPACT',
      platform: 'MÁS CLIENTES EN HUELVA & SEVILLA',
      desc: 'Optimización #1 en Google Maps y SEO local. Tus clientes encuentran tu negocio al instante desde su smartphone y piden o reservan con 1 toque sin barreras.',
      action: onOpenAudit,
      actionText: 'SOLICITAR CONSULTORÍA GRATUITA',
      highlights: [
        'Aparece antes que tu competencia en búsquedas locales',
        '0€ comisiones en pedidos y reservas',
        'Carga instantánea de 0.2s en conexiones móviles 4G/5G',
        'Cobros directos con Bizum o Tarjeta bancaria a tu cuenta'
      ]
    },
    {
      id: 3,
      code: '04',
      title: 'VIRTUALDESK',
      platform: 'PORTAL PRIVADO & OFICINA ADMIN',
      desc: 'Portal de Clientes limpio y directo para ver estadísticas y chatear con nuestro equipo. Además, Oficina Virtual Admin idéntica a VirtualDesk con Kanban, Reparto 65/20/10/5 y CRM.',
      action: onNavigateToPortal,
      actionText: 'ENTRAR AL PORTAL Y OFICINA VIRTUAL',
      highlights: [
        'Chat directo con Mario y Dani para cambios inmediatos',
        'Panel de visitas y reservas en tiempo real',
        'Oficina Virtual exacta a VirtualDesk con tablero Kanban',
        'Acceso seguro con Google OAuth y Supabase Auth'
      ]
    }
  ];

  return (
    <div className="relative w-full bg-[#121212] text-white font-mono selection:bg-[#6DD94B] selection:text-black overflow-x-hidden min-h-screen">
      {/* ── CURSOR INTERACTIVO BANCH BAUSOLA (#cursor .cursor--inner) ── */}
      <div 
        className="fixed pointer-events-none z-[999999] transition-transform duration-75 ease-out hidden md:block"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div 
          className={`rounded-full border border-[#6DD94B] flex items-center justify-center transition-all duration-300 ${
            cursorHovered 
              ? 'w-24 h-24 bg-[#6DD94B]/20 backdrop-blur-xs scale-110 shadow-[0_0_25px_rgba(109,217,75,0.4)]' 
              : 'w-8 h-8 bg-transparent'
          }`}
        >
          {cursorText && (
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6DD94B] text-center px-1">
              {cursorText}
            </span>
          )}
        </div>
      </div>

      {/* ── FONDOS DINÁMICOS TRANSICIONADOS (BG-BLACK, BG-GREEN, BG-WHITE) ── */}
      <div 
        className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-700 bg-[#121212] ${
          scrollSection === 'black' ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div 
        className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-700 bg-[#0D844A] ${
          scrollSection === 'green' ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div 
        className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-700 bg-white ${
          scrollSection === 'white' ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* ── HEADER FIJO BANCH CON ANIMACIÓN DE ENTRADA ── */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 w-full h-[90px] sm:h-[100px] z-[9999] border-b border-white/10 bg-[#121212]/90 backdrop-blur-md"
      >
        <div className="max-w-[1440px] h-full mx-auto px-4 sm:px-8 flex items-center justify-between relative">
          {/* Logo & Símbolo */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onMouseEnter={() => handleMouseEnterInteract('TECNODIEL')}
            onMouseLeave={handleMouseLeaveInteract}
          >
            <span className="h-9 w-9 bg-[#6DD94B] text-black font-black flex items-center justify-center text-sm font-mono tracking-tighter shadow-[0_0_15px_rgba(109,217,75,0.4)]">
              TO
            </span>
            <div className="flex flex-col">
              <span className="font-bold tracking-widest text-sm sm:text-base uppercase text-white font-mono">
                TECNODIEL
              </span>
              <span className="text-[9px] font-mono tracking-widest text-[#6DD94B] uppercase -mt-0.5">
                WEB ARCHITECTURE // HUELVA
              </span>
            </div>
          </div>

          {/* Payoff Centrado en Desktop (Banch: "IMAGINE TOMORROW") */}
          <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 text-center text-xs uppercase tracking-[0.2em] font-mono text-white/50 font-medium">
            IMAGINE TOMORROW // HUELVA & SEVILLA
          </div>

          {/* Navegación y Botón Banch */}
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden sm:flex items-center gap-4 text-xs uppercase font-mono tracking-wider text-white/70">
              <button 
                onClick={onNavigateToMultiwebs}
                onMouseEnter={() => handleMouseEnterInteract('6 RESTO')}
                onMouseLeave={handleMouseLeaveInteract}
                className="hover:text-[#6DD94B] transition-colors cursor-pointer"
              >
                Hostelería
              </button>
              <span className="text-white/20">/</span>
              <button 
                onClick={onNavigateToCyS}
                onMouseEnter={() => handleMouseEnterInteract('6 CLÍNICA')}
                onMouseLeave={handleMouseLeaveInteract}
                className="hover:text-[#6DD94B] transition-colors cursor-pointer"
              >
                Clínicas
              </button>
              <span className="text-white/20">/</span>
              <button 
                onClick={onNavigateToPortal}
                onMouseEnter={() => handleMouseEnterInteract('PORTAL VD')}
                onMouseLeave={handleMouseLeaveInteract}
                className="hover:text-[#6DD94B] transition-colors cursor-pointer"
              >
                Portal
              </button>
            </div>

            {/* Botón Estilo Banch con borde fino blanco */}
            <button
              onClick={onOpenAudit}
              onMouseEnter={() => handleMouseEnterInteract('DESDE 99€')}
              onMouseLeave={handleMouseLeaveInteract}
              className="border border-white hover:border-[#6DD94B] px-4 sm:px-7 py-3 text-xs sm:text-sm font-mono uppercase tracking-widest text-white hover:bg-white hover:text-[#0D844A] transition-all duration-300 cursor-pointer"
            >
              Desde 99€
            </button>

            {/* Caja cuadrada verde de acción rápida Banch */}
            <button
              onClick={onOpenAudit}
              onMouseEnter={() => handleMouseEnterInteract('ABRIR')}
              onMouseLeave={handleMouseLeaveInteract}
              className="h-10 w-10 sm:h-12 sm:w-12 bg-[#6DD94B] hover:bg-white text-black flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-[0_0_20px_rgba(109,217,75,0.3)]"
              title="Solicitar presupuesto o demo"
            >
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── SECCIÓN 1: HERO CON ANIMACIONES DE REVELACIÓN (TEXT MASKING) + HALO CENTRAL BANCH (#hover / .click-me) ── */}
      <section className="relative min-h-[100dvh] pt-[120px] sm:pt-[150px] pb-16 px-4 sm:px-8 max-w-[1440px] mx-auto flex flex-col justify-between z-10">
        <div className="my-auto space-y-6 sm:space-y-8 relative">
          
          {/* Subtítulo introductorio con text-masking */}
          <div className="overflow-hidden">
            <motion.span 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs sm:text-sm font-mono uppercase tracking-[0.25em] text-[#6DD94B] block"
            >
              // SOFTWARE MULTI-TENANT PARA NEGOCIOS REALES
            </motion.span>
            <motion.p 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-white/50 font-mono text-xs uppercase tracking-wider mt-1"
            >
              WHAT'S IN THE FUTURE OF WEB PLATFORMS?
            </motion.p>
          </div>

          {/* TÍTULO COLOSAL BANCH CON TEXT MASKING REVEAL */}
          <div className="space-y-1 relative">
            <div className="overflow-hidden">
              <motion.h1 
                initial={{ y: '120%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-[115px] font-black uppercase tracking-tight leading-[0.88] text-white font-sans"
              >
                SMART
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1 
                initial={{ y: '120%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-[115px] font-black uppercase tracking-tight leading-[0.88] text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400 font-sans"
              >
                WORKING
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1 
                initial={{ y: '120%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-[115px] font-black uppercase tracking-tight leading-[0.88] text-[#6DD94B] drop-shadow-[0_0_50px_rgba(109,217,75,0.45)] font-sans"
              >
                PLATFORMS
              </motion.h1>
            </div>

            {/* ── HALO CIRCULAR INTERACTIVO BANCH BAUSOLA (#hover & .click-me) ── */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 flex-col items-center justify-center z-20"
            >
              {/* Órbita rotatoria con líneas técnicas */}
              <div className="relative w-64 h-64 flex items-center justify-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border border-dashed border-[#6DD94B]/30"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
                  className="absolute inset-3 rounded-full border border-white/10"
                />

                {/* Botón Central .click-me con spring al hacer hover */}
                <motion.button
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const el = document.getElementById('paneles-arquitectura');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onMouseEnter={() => handleMouseEnterInteract('EXPLORAR')}
                  onMouseLeave={handleMouseLeaveInteract}
                  className="relative z-10 w-32 h-32 rounded-full bg-[#6DD94B] hover:bg-white text-black font-mono font-black text-xs uppercase flex flex-col items-center justify-center shadow-[0_0_40px_rgba(109,217,75,0.5)] transition-colors cursor-pointer group"
                >
                  <span className="text-[10px] tracking-widest text-black/70 mb-0.5">CLICK ME</span>
                  <span className="text-sm font-black leading-tight text-center">12 WEBS<br/>EN VIVO</span>
                  <ArrowDownIcon className="w-3.5 h-3.5 mt-1 group-hover:translate-y-0.5 transition-transform" />
                </motion.button>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#6DD94B] mt-3">
                [ TOCA PARA DESPLEGAR PANELES ]
              </span>
            </motion.div>
          </div>

          {/* Detalle y Píldoras Banch animadas */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-xl space-y-4 pt-2"
          >
            <p className="text-sm sm:text-base text-white/80 font-mono leading-relaxed">
              La <span className="text-[#6DD94B] font-bold">solución inteligente</span> para la presencia digital de tu negocio. Sin intermediarios, sin comisiones por pedido y con diseño exclusivo que convierte visitantes en clientes.
            </p>

            {/* Píldoras Banch */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <button
                onClick={onNavigateToMultiwebs}
                className="px-4 py-2 border border-white/20 text-xs font-mono uppercase tracking-wider text-white hover:border-[#6DD94B] hover:text-[#6DD94B] transition cursor-pointer"
              >
                🍔 6 Plantillas Hostelería
              </button>
              <button
                onClick={onNavigateToCyS}
                className="px-4 py-2 border border-white/20 text-xs font-mono uppercase tracking-wider text-white hover:border-[#6DD94B] hover:text-[#6DD94B] transition cursor-pointer"
              >
                🏥 6 Plantillas Clínicas
              </button>
              <span className="px-4 py-2 border border-[#6DD94B]/50 bg-[#6DD94B]/10 text-xs font-mono uppercase tracking-wider text-[#6DD94B]">
                ⚡ Carga en 0.2s
              </span>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator Banch animado */}
        <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-8">
          <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-white/60">
            <span className="h-2 w-2 bg-[#6DD94B] animate-ping" />
            <span>DISPONIBLES PARA NUEVOS PROYECTOS • HUELVA & SEVILLA</span>
          </div>

          <a 
            href="#paneles-arquitectura"
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#6DD94B] hover:underline"
          >
            <span>SCROLL PARA EXPLORAR</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </a>
        </div>
      </section>

      {/* ── MARQUEE TICKER BANCH ENTRE SECCIONES ── */}
      <MarqueeTicker />

      {/* ── SECCIÓN 2: PANELES DESLIZANTES HORIZONTALES ICÓNICOS BANCH (.panel.left-1, .panel.right-2) ── */}
      <section id="paneles-arquitectura" className="py-24 sm:py-36 px-4 sm:px-8 border-t border-white/10 bg-[#121212] relative z-10">
        <div className="max-w-[1440px] mx-auto space-y-10">
          
          {/* Header de la sección */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#6DD94B] block mb-2 font-bold">
                // ARQUITECTURA MULTI-TENANT AISLADA
              </span>
              <h2 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight font-sans">
                PANELES CINEMÁTICOS BANCH
              </h2>
            </div>
            <p className="text-xs font-mono text-white/50 uppercase tracking-widest max-w-xs text-right hidden sm:block">
              DESLIZAMIENTO LATERAL • CERO INTERFERENCIAS DE CSS
            </p>
          </div>

          {/* Selector de pestañas interactivas para disparar las animaciones de paneles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 border border-white/15 p-2 bg-[#181818]">
            {panelsData.map((panel, idx) => (
              <button
                key={panel.id}
                onClick={() => setActivePanel(idx)}
                onMouseEnter={() => handleMouseEnterInteract(panel.code)}
                onMouseLeave={handleMouseLeaveInteract}
                className={`py-3 px-4 text-xs font-mono uppercase tracking-wider text-left transition-all duration-300 cursor-pointer flex items-center justify-between ${
                  activePanel === idx 
                    ? 'bg-[#6DD94B] text-black font-black' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{panel.code} // {panel.title}</span>
                <span className={`text-[10px] ${activePanel === idx ? 'text-black' : 'text-[#6DD94B]'}`}>
                  {activePanel === idx ? '● ACTIVO' : '○'}
                </span>
              </button>
            ))}
          </div>

          {/* CONTENEDOR DE PANELES DESLIZANTES (LEFT & RIGHT SLIDE PHYSICS) */}
          <div className="relative overflow-hidden min-h-[580px] border border-white/15 bg-[#181818]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePanel}
                initial={{ opacity: 0, x: activePanel % 2 === 0 ? -100 : 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: activePanel % 2 === 0 ? 100 : -100 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-0 h-full"
              >
                {/* LADO IZQUIERDO: INFORMACIÓN Y ACCIÓN */}
                <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 bg-[#151515]">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono font-bold text-[#6DD94B] px-2 py-0.5 border border-[#6DD94B]/30 bg-[#6DD94B]/10">
                        PANEL {panelsData[activePanel].code}
                      </span>
                      <span className="text-xs font-mono uppercase text-white/50 tracking-widest">
                        {panelsData[activePanel].platform}
                      </span>
                    </div>

                    <h3 className="text-4xl sm:text-6xl font-black uppercase text-white leading-none font-sans">
                      {panelsData[activePanel].title}
                    </h3>

                    <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-mono">
                      {panelsData[activePanel].desc}
                    </p>

                    {panelsData[activePanel].highlights && (
                      <div className="space-y-2 pt-2">
                        {panelsData[activePanel].highlights.map((hl, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs font-mono text-white/80">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#6DD94B] shrink-0" />
                            <span>{hl}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-8 mt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <span className="text-xs font-mono text-white/50">PRECIO: DESDE 99€ // LLAVE EN MANO</span>
                    <button
                      onClick={panelsData[activePanel].action}
                      className="px-6 py-3 bg-[#6DD94B] text-black hover:bg-white text-xs font-mono font-bold uppercase transition flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(109,217,75,0.3)]"
                    >
                      <span>{panelsData[activePanel].actionText}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* LADO DERECHO: DEMO INTERACTIVA DE LAS PLANTILLAS AISLADAS */}
                <div className="lg:col-span-7 p-6 sm:p-10 bg-[#121212] flex flex-col justify-between">
                  {panelsData[activePanel].templates ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <span className="text-xs font-mono text-[#6DD94B] uppercase font-bold">
                          // CATÁLOGO DE 6 PLANTILLAS AISLADAS
                        </span>
                        <span className="text-[10px] font-mono text-white/50 uppercase">
                          SELECCIONA PARA INSPECCIONAR
                        </span>
                      </div>

                      {/* Botonera de las 6 plantillas */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {panelsData[activePanel].templates.map((tpl, tIndex) => (
                          <button
                            key={tpl.id}
                            onClick={() => panelsData[activePanel].setActiveTemplate(tIndex)}
                            className={`p-3 border text-left transition-all cursor-pointer ${
                              panelsData[activePanel].activeTemplate === tIndex
                                ? 'border-[#6DD94B] bg-[#6DD94B]/15 text-white'
                                : 'border-white/10 bg-[#181818] text-white/50 hover:text-white hover:border-white/30'
                            }`}
                          >
                            <span className="text-[10px] font-mono text-[#6DD94B] block font-bold">
                              {tpl.num}
                            </span>
                            <span className="text-xs font-mono font-bold uppercase block truncate">
                              {tpl.name}
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Tarjeta de previsualización de la plantilla activa */}
                      {(() => {
                        const cur = panelsData[activePanel].templates[panelsData[activePanel].activeTemplate];
                        return (
                          <motion.div
                            key={cur.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="p-6 border border-white/15 bg-[#181818] space-y-4"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono px-2 py-0.5 border border-[#6DD94B]/30 bg-[#6DD94B]/10 text-[#6DD94B] uppercase">
                                {cur.tag}
                              </span>
                              <span className="text-xs font-mono text-white/50">
                                Feature: <strong className="text-white">{cur.feature}</strong>
                              </span>
                            </div>

                            <h4 className="text-xl sm:text-2xl font-bold uppercase text-white font-mono">
                              {cur.name}
                            </h4>

                            <p className="text-xs text-white/70 font-mono leading-relaxed">
                              {cur.desc}
                            </p>

                            <div className="pt-2 flex items-center justify-between text-xs font-mono text-[#6DD94B]">
                              <span>DOM & CSS 100% AISLADO</span>
                              <button
                                onClick={panelsData[activePanel].action}
                                className="underline hover:text-white transition flex items-center gap-1 cursor-pointer"
                              >
                                <span>Ver en Formulario</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })()}
                    </div>
                  ) : (
                    /* Para paneles de rendimiento o portal */
                    <div className="h-full flex flex-col justify-center items-center text-center p-8 space-y-6">
                      <div className="w-20 h-20 rounded-full border border-[#6DD94B] flex items-center justify-center bg-[#6DD94B]/10">
                        <Sparkles className="w-8 h-8 text-[#6DD94B]" />
                      </div>
                      <div className="space-y-2 max-w-md">
                        <h4 className="text-2xl font-black uppercase text-white font-sans">
                          {panelsData[activePanel].title}
                        </h4>
                        <p className="text-xs text-white/60 font-mono">
                          Toda la infraestructura está desplegada en el Edge global de Cloudflare y bases de datos Supabase PostgreSQL en Frankfurt con cifrado SSL.
                        </p>
                      </div>
                      <button
                        onClick={panelsData[activePanel].action}
                        className="px-6 py-3 border border-white hover:border-[#6DD94B] text-xs font-mono uppercase text-white hover:bg-[#6DD94B] hover:text-black transition cursor-pointer font-bold"
                      >
                        {panelsData[activePanel].actionText}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 3: CAJA DE CRISTAL TRANSLÚCIDA BANCH (GLASS) ── */}
      <section className="py-24 sm:py-36 px-4 sm:px-8 bg-black relative flex items-center justify-center overflow-hidden z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl p-10 sm:p-20 bg-black/60 backdrop-blur-md border border-white/20 text-center shadow-[0_4px_40px_rgba(0,0,0,0.5)]"
        >
          <p className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight text-[#09844B] font-sans">
            TECNODIEL, EL SOFTWARE WEB MULTI-TENANT QUE <span className="text-[#6DD94B]">LIMITA AL MÍNIMO TUS ESFUERZOS</span> Y MULTIPLICA TUS VENTAS.
          </p>
          <div className="mt-8 flex justify-center">
            <button
              onClick={onOpenAudit}
              className="border border-white hover:border-[#6DD94B] px-8 py-3.5 text-xs font-mono uppercase tracking-widest text-white hover:bg-white hover:text-[#0D844A] transition-all cursor-pointer font-bold"
            >
              Consultar Mi Caso • Desde 99€
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── SECCIÓN 4: BLOQUE VERDE MASIVO BANCH (ID: "made-to-work") ── */}
      <section id="made-to-work" className="h-[380px] sm:h-[480px] bg-[#0D844A] flex items-center justify-center px-4 text-center overflow-hidden relative z-10">
        <div className="absolute inset-0 bg-[radial-gradient(#6DD94B_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        <motion.h2 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight text-white relative z-10 font-sans"
        >
          MADE TO WORK BETTER
        </motion.h2>
      </section>

      {/* ── SECCIÓN 5: ¿POR QUÉ TECNODIEL? (WHY-BANCH) ── */}
      <section className="py-24 sm:py-36 px-4 sm:px-8 max-w-[1440px] mx-auto z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#6DD94B] block font-bold">
              // PROPUESTA DE VALOR REAL
            </span>
            <h2 className="text-4xl sm:text-6xl font-black uppercase text-[#09844B] leading-none font-sans">
              ¿POR QUÉ <br />
              <span className="text-white">TECNODIEL?</span>
            </h2>
            <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-[#6DD94B] font-mono">
              Está hecho a medida para agevolar y hacer crecer tu negocio.
            </h3>
            <p className="text-sm text-white/70 leading-relaxed font-mono">
              Tus clientes deciden con el móvil en la mano. Si no te encuentran o tu web va lenta, eligen a la competencia. Nuestras plataformas cargan en menos de 0.2 segundos, no exigen descargar PDF de menús y dirigen los pedidos directamente a tu teléfono.
            </p>
            <p className="text-sm text-white/70 leading-relaxed font-mono">
              Nosotros nos ocupamos de todo: hosting Cloudflare en el Edge, base de datos Supabase SSL, diseño galardonado, alta en Google Maps y soporte técnico directo desde Huelva.
            </p>
            <div className="pt-4">
              <button
                onClick={onOpenAudit}
                className="border border-white hover:border-[#6DD94B] px-8 py-3.5 text-xs font-mono uppercase tracking-widest text-white hover:bg-white hover:text-[#0D844A] transition-all cursor-pointer font-bold"
              >
                Hablar con Nosotros
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#181818] border border-white/10 p-8 sm:p-12 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-mono uppercase text-[#6DD94B] font-bold">GARANTÍAS COMPROBADAS</span>
              <span className="text-xs font-mono text-white/50">HUELVA // ESPAÑA</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Velocidad de Carga 0.2s', desc: 'Lighthouse 99+. El cliente nunca se va por lentitud.' },
                { title: '0€ Comisiones por Reserva', desc: 'No pagas el 15-30% a plataformas intermediarias.' },
                { title: 'Carta Digital Táctil', desc: 'Fotos reales que abren el apetito y se actualizan al instante.' },
                { title: 'Dominio y SSL Incluidos', desc: 'Seguridad máxima con certificado SSL Cloudflare.' },
                { title: 'Cobro por Bizum o Tarjeta', desc: 'El dinero llega directo a tu cuenta bancaria.' },
                { title: 'Soporte con Nombre y Apellidos', desc: 'Hablas directamente con Mario y Dani, no con un bot.' }
              ].map((g, i) => (
                <div key={i} className="p-4 bg-[#121212] border border-white/10 space-y-1">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#6DD94B]" />
                    <span className="text-xs font-bold uppercase text-white font-mono">{g.title}</span>
                  </div>
                  <p className="text-[11px] text-white/60 pl-6 leading-relaxed font-mono">{g.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 6: TABLA DE ESPECIFICACIONES TÉCNICAS BANCH (ID: "especificaciones") ── */}
      <section id="especificaciones" className="bg-white text-black py-20 sm:py-32 px-4 sm:px-8 z-10 relative">
        <div className="max-w-[1440px] mx-auto space-y-12">
          <div className="border-b-2 border-[#09844B] pb-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#09844B] font-bold block mb-1">
                // MATRIZ DE RENDIMIENTO
              </span>
              <h2 className="text-3xl sm:text-5xl font-black uppercase text-[#09844B] tracking-tight font-sans">
                ESPECIFICACIONES TÉCNICAS
              </h2>
            </div>
            <p className="text-xs font-mono text-neutral-500 uppercase">
              ESTÁNDARES DE INGENIERÍA TECNODIEL
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-[#09844B]">
                  <th className="py-4 w-16 text-neutral-400">ID</th>
                  <th className="py-4 text-[#09844B] font-bold uppercase">CARACTERÍSTICA</th>
                  <th className="py-4 uppercase text-black font-extrabold">HOSTELERÍA (RESTO)</th>
                  <th className="py-4 uppercase text-black font-extrabold">CLÍNICAS & SALUD</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    id: '01',
                    title: 'Arquitectura DOM & CSS',
                    host: 'Aislamiento total por plantilla (6 plantillas)',
                    clin: 'Aislamiento total por plantilla (6 plantillas)'
                  },
                  {
                    id: '02',
                    title: 'Tiempo de Carga en Móvil',
                    host: '< 0.25 s (Cloudflare Global Edge)',
                    clin: '< 0.28 s (Cloudflare Global Edge)'
                  },
                  {
                    id: '03',
                    title: 'Herramientas de Venta',
                    host: 'Carta digital QR interactiva + WhatsApp',
                    clin: 'Agenda de citas online + WhatsApp VIP'
                  },
                  {
                    id: '04',
                    title: 'Pasarelas de Pago',
                    host: 'Bizum directo + Stripe Checkout',
                    clin: 'Cobro de reservas con Bizum / Tarjeta'
                  },
                  {
                    id: '05',
                    title: 'Base de Datos & Auth',
                    host: 'Supabase PostgreSQL con SSL',
                    clin: 'Supabase PostgreSQL con SSL médico'
                  },
                  {
                    id: '06',
                    title: 'Portal de Clientes',
                    host: 'Métricas + Chat directo con Mario',
                    clin: 'Métricas de pacientes + Chat directo'
                  },
                  {
                    id: '07',
                    title: 'Oficina Virtual Admin',
                    host: 'VirtualDesk exacto (Kanban, Reparto 65%)',
                    clin: 'VirtualDesk exacto (Kanban, Reparto 65%)'
                  },
                  {
                    id: '08',
                    title: 'Precio y Comisiones',
                    host: 'Desde 99€ • 0€ comisiones por pedido',
                    clin: 'Desde 99€ • 0€ comisiones por cita'
                  }
                ].map((row) => (
                  <tr key={row.id} className="border-b border-[#09844B]/30 hover:bg-[#09844B]/5 transition-colors">
                    <td className="py-5 font-bold text-[#09844B]">{row.id}</td>
                    <td className="py-5 font-bold uppercase text-black">{row.title}</td>
                    <td className="py-5 text-neutral-800">{row.host}</td>
                    <td className="py-5 text-neutral-800">{row.clin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 7: CTA MASIVO BANCH ── */}
      <section className="py-24 sm:py-36 px-4 sm:px-8 text-center bg-[#181818] border-t border-white/10 z-10 relative">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#6DD94B] block font-bold">
            // EL MOMENTO ES AHORA
          </span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase text-white tracking-tight leading-none font-sans">
            ESTE ES EL FUTURO DE LAS WEBS PROFESIONALES
          </h2>
          <p className="text-lg font-bold uppercase text-[#6DD94B] tracking-wider font-mono">
            ¿QUIERES VER TU NEGOCIO EN LO MÁS ALTO?
          </p>
          <div className="pt-4">
            <button
              onClick={onOpenAudit}
              className="border border-white hover:border-[#6DD94B] px-10 py-4 text-xs sm:text-sm font-mono uppercase tracking-widest text-white hover:bg-white hover:text-[#0D844A] transition-all cursor-pointer font-bold"
            >
              Quiero Mi Web • Desde 99€
            </button>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 8: CONTACTO CON FORMULARIO BANCH (INPUTS LÍNEA INFERIOR BLANCA) ── */}
      <section id="contact" className="py-24 sm:py-36 px-4 sm:px-8 bg-black border-t border-white/10 z-10 relative">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Columna Izquierda Texto */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#6DD94B] block font-bold">
              // CONTACTO DIRECTO
            </span>
            <h2 className="text-4xl sm:text-6xl font-black uppercase text-white leading-none font-sans">
              SABEMOS CÓMO <br />
              <span className="text-[#6DD94B]">IMPULSAR</span> <br />
              TU NEGOCIO
            </h2>
            <p className="text-sm text-white/70 leading-relaxed font-mono">
              El futuro de las plataformas web ha llegado a Huelva y Sevilla. Escríbenos para recibir tu propuesta técnica personalizada y ver tu plantilla en directo.
            </p>
            <div className="pt-4 space-y-2 text-xs font-mono text-white/50">
              <p>📍 HUELVA & SEVILLA, ANDALUCÍA</p>
              <p>✉️ CONTACTO@TECNODIEL.ES</p>
              <p>⚡ RESPUESTA EN MENOS DE 2 HORAS</p>
            </div>
          </div>

          {/* Columna Derecha Formulario Banch */}
          <div className="lg:col-span-7">
            {formSent ? (
              <div className="p-10 border border-[#6DD94B] bg-[#0D844A]/10 text-center space-y-4">
                <span className="h-12 w-12 bg-[#6DD94B] text-black font-bold mx-auto flex items-center justify-center font-mono">
                  ✓
                </span>
                <h3 className="text-2xl font-black uppercase text-white font-sans">¡Mensaje Enviado con Éxito!</h3>
                <p className="text-xs font-mono text-white/70">
                  Mario o Dani revisarán tu negocio y te contactarán hoy mismo con la propuesta.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8 font-mono">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-white/50 block">nombre</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Tu nombre completo"
                    className="w-full bg-transparent border-b-2 border-white pb-2 text-sm text-white focus:border-[#6DD94B] focus:outline-none font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-white/50 block">email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="tucorreo@negocio.es"
                      className="w-full bg-transparent border-b-2 border-white pb-2 text-sm text-white focus:border-[#6DD94B] focus:outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-white/50 block">teléfono / whatsapp</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="600 000 000"
                      className="w-full bg-transparent border-b-2 border-white pb-2 text-sm text-white focus:border-[#6DD94B] focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-white/50 block">tipo de negocio</label>
                  <select
                    value={formData.platform}
                    onChange={e => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full bg-[#161616] border-b-2 border-white pb-2 text-sm text-white focus:border-[#6DD94B] focus:outline-none font-mono"
                  >
                    <option value="hosteleria">Hostelería (Restaurante, Bar, Coctelería, Asador)</option>
                    <option value="clinica">Clínica & Salud (Dental, Fisioterapia, Estética, Salud)</option>
                    <option value="otro">Otro negocio local</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-white/50 block">mensaje o necesidades</label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Cuéntanos brevemente sobre tu negocio y qué te gustaría mejorar..."
                    className="w-full bg-transparent border-b-2 border-white pb-2 text-sm text-white focus:border-[#6DD94B] focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-4 pt-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.privacy}
                      onChange={e => setFormData({ ...formData, privacy: e.target.checked })}
                      className="mt-1 accent-[#6DD94B]"
                    />
                    <span className="text-xs text-white/60 font-mono leading-relaxed">
                      Declaro haber leído la política de privacidad y autorizo el tratamiento de mis datos personales para recibir información de mi proyecto en TecnOdiel.
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="border border-white hover:border-[#6DD94B] px-10 py-4 text-xs font-mono uppercase tracking-widest text-white hover:bg-white hover:text-[#0D844A] transition-all cursor-pointer font-bold"
                  >
                    Enviar Mensaje
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 9: FOOTER COLOSAL IDÉNTICO A BANCH ── */}
      <footer className="py-20 px-4 sm:px-8 border-t border-white/10 bg-[#0c0c0c] text-center z-10 relative font-mono">
        <div className="max-w-[1440px] mx-auto space-y-6">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#6DD94B] block font-bold">
            // TECNODIEL HUELVA
          </span>
          <h2 className="text-3xl sm:text-6xl md:text-7xl font-black uppercase text-white tracking-tight leading-none font-sans">
            DESCUBRE NUESTRAS PLATAFORMAS & SERVICIOS
          </h2>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onNavigateToMultiwebs}
              className="border border-white/30 hover:border-white px-6 py-3 text-xs font-mono uppercase text-white transition-all cursor-pointer"
            >
              Catálogo Hostelería
            </button>
            <button
              onClick={onNavigateToCyS}
              className="border border-white/30 hover:border-white px-6 py-3 text-xs font-mono uppercase text-white transition-all cursor-pointer"
            >
              Catálogo Clínicas
            </button>
            <button
              onClick={onNavigateToPortal}
              className="border border-[#6DD94B] bg-[#6DD94B]/10 px-6 py-3 text-xs font-mono uppercase text-[#6DD94B] hover:bg-[#6DD94B] hover:text-black transition-all cursor-pointer font-bold"
            >
              Portal Privado & Oficina Virtual
            </button>
          </div>
          <p className="text-[11px] font-mono text-white/40 pt-8 border-t border-white/5">
            © {new Date().getFullYear()} TecnOdiel • Alojamiento en Cloudflare Pages Edge • Base de datos Supabase SSL
          </p>
        </div>
      </footer>
    </div>
  );
}

// Icono auxiliar para el halo circular
function ArrowDownIcon(props) {
  return (
    <svg 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={2.5} 
      stroke="currentColor" 
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
    </svg>
  );
}
