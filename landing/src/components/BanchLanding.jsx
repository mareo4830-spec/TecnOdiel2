import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  CheckCircle2, 
  Phone,
  MessageCircle,
  MapPin,
  HeartHandshake
} from 'lucide-react';
import MarqueeTicker from './MarqueeTicker';

export default function BanchLanding({ 
  onNavigateToMultiwebs, 
  onNavigateToCyS, 
  onOpenAudit, 
  onNavigateToPortal 
}) {
  // Cursor interactivo Banch
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [cursorHovered, setCursorHovered] = useState(false);
  const [cursorText, setCursorText] = useState('');

  // Selector de paneles (0: Hostelería, 1: Clínicas, 2: Clientes locales, 3: Panel privado)
  const [activePanel, setActivePanel] = useState(0);

  // Plantilla seleccionada en el preview
  const [activeHostTemplate, setActiveHostTemplate] = useState(0);
  const [activeClinicTemplate, setActiveClinicTemplate] = useState(0);

  // Transición dinámica de fondos al hacer scroll
  const [scrollSection, setScrollSection] = useState('black');

  // Estado del formulario de contacto
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    platform: 'hosteleria',
    message: '',
    privacy: false
  });

  // Seguimiento del cursor
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Control del fondo según el scroll
  useEffect(() => {
    const handleScroll = () => {
      const vh = window.innerHeight;
      const specElement = document.getElementById('incluido');
      const greenElement = document.getElementById('compromiso');

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
      alert('Por favor, acepta la casilla de contacto para que podamos responderte.');
      return;
    }
    setFormSent(true);
  };

  // 6 Opciones claras para Hostelería (Restaurantes, Bares, Cafeterías)
  const hosteleriaTemplates = [
    {
      id: 1,
      num: '01',
      name: 'Visual & Vídeo',
      tag: 'Fotos grandes y platos que entran por los ojos',
      desc: 'Pensada para que a tus clientes se les haga la boca agua nada más abrir la web. Vídeos y fotografías de tus platos estrella a pantalla completa, sin textos complicados.',
      benefit: 'Ideal para destacar tu comida y abrir el apetito.'
    },
    {
      id: 2,
      num: '02',
      name: 'Moderna & Urbana',
      tag: 'Hamburgueserías, pizzerías y comida rápida',
      desc: 'Diseño dinámico, con colores vivos y muy directo. Tus clientes eligen sus hamburguesas, pizzas o combos favoritos y te piden en pocos toques.',
      benefit: 'Perfecta para pedir comida para llevar o a domicilio.'
    },
    {
      id: 3,
      num: '03',
      name: 'Coctelería & Noche',
      tag: 'Copas, terrazas, gastrobares y eventos',
      desc: 'Estilo elegante, oscuro y con ambiente nocturno. Ideal para mostrar tu carta de cócteles, copas, vinos especiales y reservas de mesa para cenar o tomar algo.',
      benefit: 'Atrae clientes para el tardeo, cenas y copas.'
    },
    {
      id: 4,
      num: '04',
      name: 'Carta Gastronómica',
      tag: 'Restaurantes de autor y cocina cuidada',
      desc: 'Diseño sobrio, limpio y de revista. Perfecto para restaurantes con menú degustación o producto de alta calidad que quieren transmitir prestigio y buen gusto.',
      benefit: 'Elegancia total y lectura limpia de cada plato.'
    },
    {
      id: 5,
      num: '05',
      name: 'Rápida para Móvil',
      tag: 'Comida para llevar y pedir sin esperas',
      desc: 'Enfocada 100% en el móvil. Los clientes ven la carta rápido, añaden platos con un toque y te envían el pedido directo a tu WhatsApp sin tener que descargarse nada.',
      benefit: 'Máxima rapidez: tus clientes piden en 30 segundos.'
    },
    {
      id: 6,
      num: '06',
      name: 'Tradicional & Asador',
      tag: 'Carnes a la brasa, tabernas y comida casera',
      desc: 'Tonos cálidos y ambiente acogedor de toda la vida. Resalta tus carnes, guisos tradicionales, tapas y raciones para que el cliente se sienta como en casa.',
      benefit: 'Transmite el sabor casero y la autenticidad de tu cocina.'
    }
  ];

  // 6 Opciones claras para Clínicas y Salud
  const clinicTemplates = [
    {
      id: 1,
      num: '01',
      name: 'Limpia & Profesional',
      tag: 'Dentales y medicina general',
      desc: 'Fondo blanco impecable y diseño ordenado que transmite máxima higiene, confianza y tranquilidad médica desde el primer segundo.',
      benefit: 'Transmite seguridad y máxima higiene sanitaria.'
    },
    {
      id: 2,
      num: '02',
      name: 'Dinámica & Fisioterapia',
      tag: 'Fisioterapia, osteopatía y deporte',
      desc: 'Aspecto moderno y activo, pensada para mostrar cómo ayudas a recuperar lesiones, aliviar dolores y mejorar la calidad de vida de tus pacientes.',
      benefit: 'Muestra tus tratamientos y casos de recuperación.'
    },
    {
      id: 3,
      num: '03',
      name: 'Cercana & Familiar',
      tag: 'Pediatría, familias y niños',
      desc: 'Colores amables y un tono acogedor que quita el miedo al médico y hace que las familias se sientan cómodas y en buenas manos.',
      benefit: 'Tranquiliza a los padres y conecta con los pacientes.'
    },
    {
      id: 4,
      num: '04',
      name: 'Relajante & Bienestar',
      tag: 'Psicología, nutrición y spa',
      desc: 'Diseño tranquilo con tonos suaves para consultas de psicología, nutrición, salud mental y relajación. Fácil de navegar sin agobios.',
      benefit: 'Crea un ambiente de calma antes de la consulta.'
    },
    {
      id: 5,
      num: '05',
      name: 'Exclusiva & Estética',
      tag: 'Medicina estética y cuidado facial',
      desc: 'Toques elegantes y sofisticados para clínicas de medicina estética, dermatología y estética dental que quieren reflejar cuidado y belleza.',
      benefit: 'Destaca tus tratamientos de rejuvenecimiento y belleza.'
    },
    {
      id: 6,
      num: '06',
      name: 'Especialistas & Tratamientos',
      tag: 'Aparatología avanzada y ortodoncia',
      desc: 'Muestra tus instalaciones, tecnología moderna, antes y después de tratamientos y a todo tu equipo médico con total claridad.',
      benefit: 'Demuestra tu tecnología y la experiencia de tu equipo.'
    }
  ];

  const panelsData = [
    {
      id: 0,
      code: '01',
      title: 'RESTAURANTES Y BARES',
      platform: 'PARA HOSTELERÍA',
      desc: 'Ponemos tu carta en el móvil de tus clientes con fotos reales que entran por los ojos. Sin obligarles a descargarse un PDF lento ni registrarse. Las reservas y pedidos llegan directos a tu WhatsApp o teléfono, y el 100% de lo que cobras es para ti, sin pagarle comisiones del 15% o 30% a aplicaciones de reparto.',
      action: onNavigateToMultiwebs,
      actionText: 'VER Y CONFIGURAR TU CARTA',
      templates: hosteleriaTemplates,
      activeTemplate: activeHostTemplate,
      setActiveTemplate: setActiveHostTemplate
    },
    {
      id: 1,
      code: '02',
      title: 'CLÍNICAS Y SALUD',
      platform: 'PARA CENTROS MÉDICOS Y DENTALES',
      desc: 'Tu clínica abierta para dar citas a cualquier hora del día. Tus pacientes pueden elegir especialidad, ver tus tratamientos con total claridad y reservar su hueco sin tener que llamar por teléfono. Todo adaptado a la ley sanitaria y con recordatorios para que nadie falte a su consulta.',
      action: onNavigateToCyS,
      actionText: 'VER Y CONFIGURAR TU CLÍNICA',
      templates: clinicTemplates,
      activeTemplate: activeClinicTemplate,
      setActiveTemplate: setActiveClinicTemplate
    },
    {
      id: 2,
      code: '03',
      title: 'MÁS CLIENTES EN TU ZONA',
      platform: 'HUELVA, SEVILLA Y ALREDEDORES',
      desc: 'Arreglamos y mejoramos la presencia de tu empresa en internet para que la gente de Huelva y tu zona te encuentre la primera cuando busque en Google y Google Maps.',
      action: onOpenAudit,
      actionText: 'PEDIR ESTUDIO GRATUITO PARA MI NEGOCIO',
      highlights: [
        'Aparece antes que tu competencia cuando busquen tu servicio en tu ciudad.',
        '0% de comisiones: todo lo que ganes de tus clientes va directo a ti.',
        'Tu web abre al instante en cualquier móvil, incluso con poca cobertura.',
        'Cobros sencillos con Bizum o tarjeta directamente a tu cuenta bancaria.'
      ]
    },
    {
      id: 3,
      code: '04',
      title: 'TU PANEL PRIVADO',
      platform: 'GESTIÓN FÁCIL Y CONTACTO DIRECTO',
      desc: 'Accede a tu zona privada para ver cuánta gente visita tu web, cambiar precios de tu carta o servicios cuando quieras, y pulsar un botón para hablar en directo por WhatsApp o llamada con Mario y Dani.',
      action: onNavigateToPortal,
      actionText: 'ENTRAR AL PANEL DE CLIENTE',
      highlights: [
        'Hablas con personas reales de Huelva, no con un contestador automático.',
        'Mira en tiempo real cuántas personas entran y piden en tu web.',
        'Cambia platos, precios y horarios tú mismo en segundos.',
        'Todo seguro y protegido con tu cuenta de Google.'
      ]
    }
  ];

  return (
    <div className="relative w-full bg-[#121212] text-white font-sans selection:bg-[#6DD94B] selection:text-black overflow-x-hidden min-h-screen">
      {/* ── CURSOR INTERACTIVO SUAVE BANCH ── */}
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
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6DD94B] text-center px-1">
              {cursorText}
            </span>
          )}
        </div>
      </div>

      {/* ── FONDOS DINÁMICOS ── */}
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

      {/* ── CABECERA PRINCIPAL CERCANA ── */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 w-full h-[85px] sm:h-[95px] z-[9999] border-b border-white/10 bg-[#121212]/95 backdrop-blur-md"
      >
        <div className="max-w-[1440px] h-full mx-auto px-4 sm:px-8 flex items-center justify-between relative">
          {/* Logo & Identidad de Huelva */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onMouseEnter={() => handleMouseEnterInteract('TECNODIEL')}
            onMouseLeave={handleMouseLeaveInteract}
          >
            <span className="h-10 w-10 bg-[#6DD94B] text-black font-black flex items-center justify-center text-base tracking-tight shadow-[0_0_15px_rgba(109,217,75,0.4)]">
              TO
            </span>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-wider text-base uppercase text-white">
                TECNODIEL
              </span>
              <span className="text-[11px] text-[#6DD94B] font-semibold">
                Startup de Huelva • Digitalizamos empresas
              </span>
            </div>
          </div>

          {/* Mensaje central */}
          <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 text-center text-xs uppercase tracking-wider text-white/60 font-medium">
            Huelva y Sevilla • Soluciones web de confianza
          </div>

          {/* Navegación y contacto */}
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden sm:flex items-center gap-5 text-sm font-medium text-white/80">
              <button 
                onClick={onNavigateToMultiwebs}
                onMouseEnter={() => handleMouseEnterInteract('RESTAURANTES')}
                onMouseLeave={handleMouseLeaveInteract}
                className="hover:text-[#6DD94B] transition-colors cursor-pointer"
              >
                Para Restaurantes
              </button>
              <span className="text-white/20">/</span>
              <button 
                onClick={onNavigateToCyS}
                onMouseEnter={() => handleMouseEnterInteract('CLÍNICAS')}
                onMouseLeave={handleMouseLeaveInteract}
                className="hover:text-[#6DD94B] transition-colors cursor-pointer"
              >
                Para Clínicas
              </button>
              <span className="text-white/20">/</span>
              <button 
                onClick={onNavigateToPortal}
                onMouseEnter={() => handleMouseEnterInteract('TU PANEL')}
                onMouseLeave={handleMouseLeaveInteract}
                className="hover:text-[#6DD94B] transition-colors cursor-pointer"
              >
                Tu Panel
              </button>
            </div>

            {/* Botón principal */}
            <button
              onClick={onOpenAudit}
              onMouseEnter={() => handleMouseEnterInteract('DESDE 99€')}
              onMouseLeave={handleMouseLeaveInteract}
              className="border border-white hover:border-[#6DD94B] px-4 sm:px-6 py-2.5 text-xs sm:text-sm uppercase font-bold tracking-wider text-white hover:bg-white hover:text-[#0D844A] transition-all duration-300 cursor-pointer"
            >
              Desde 99€
            </button>

            {/* Botón verde de contacto rápido */}
            <button
              onClick={onOpenAudit}
              onMouseEnter={() => handleMouseEnterInteract('CONSULTAR')}
              onMouseLeave={handleMouseLeaveInteract}
              className="h-10 w-10 sm:h-11 sm:w-11 bg-[#6DD94B] hover:bg-white text-black flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-[0_0_20px_rgba(109,217,75,0.3)]"
              title="Hablar con nosotros"
            >
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── SECCIÓN 1: HERO CERCANO, LEGIBLE Y DIRECTO ── */}
      <section className="relative min-h-[100dvh] pt-[120px] sm:pt-[150px] pb-16 px-4 sm:px-8 max-w-[1440px] mx-auto flex flex-col justify-between z-10">
        <div className="my-auto space-y-6 sm:space-y-8 relative">
          
          {/* Subtítulo introductorio */}
          <div className="overflow-hidden">
            <motion.span 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs sm:text-sm uppercase tracking-wider text-[#6DD94B] font-bold block"
            >
              // SOMOS DE HUELVA • SOLUCIONES REALES Y CERCANAS
            </motion.span>
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-white/60 text-sm sm:text-base font-medium mt-1"
            >
              Sin tecnicismos raros, sin palabras raras en inglés y sin complicaciones.
            </motion.p>
          </div>

          {/* TÍTULO PRINCIPAL GRANDE Y CLARO */}
          <div className="space-y-1 relative">
            <div className="overflow-hidden">
              <motion.h1 
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-[100px] font-black uppercase tracking-tight leading-[0.92] text-white"
              >
                DIGITALIZAMOS
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1 
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-[100px] font-black uppercase tracking-tight leading-[0.92] text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400"
              >
                Y ARREGLAMOS
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1 
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-[100px] font-black uppercase tracking-tight leading-[0.92] text-[#6DD94B] drop-shadow-[0_0_50px_rgba(109,217,75,0.45)]"
              >
                TU EMPRESA
              </motion.h1>
            </div>

            {/* ── BOTÓN INTERACTIVO CENTRAL CERCANO (#hover & .click-me) ── */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 flex-col items-center justify-center z-20"
            >
              <div className="relative w-64 h-64 flex items-center justify-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border border-dashed border-[#6DD94B]/35"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 35, ease: 'linear' }}
                  className="absolute inset-4 rounded-full border border-white/10"
                />

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const el = document.getElementById('soluciones');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onMouseEnter={() => handleMouseEnterInteract('EXPLORAR')}
                  onMouseLeave={handleMouseLeaveInteract}
                  className="relative z-10 w-36 h-36 rounded-full bg-[#6DD94B] hover:bg-white text-black font-extrabold text-xs uppercase flex flex-col items-center justify-center shadow-[0_0_40px_rgba(109,217,75,0.5)] transition-colors cursor-pointer group p-3 text-center"
                >
                  <span className="text-[10px] tracking-wider text-black/70 mb-1">HAZ CLIC AQUÍ</span>
                  <span className="text-sm font-black leading-tight">ELIGE TU<br/>NEGOCIO</span>
                  <ChevronDown className="w-4 h-4 mt-1 group-hover:translate-y-1 transition-transform" />
                </motion.button>
              </div>
              <span className="text-xs uppercase tracking-wider text-[#6DD94B] mt-2 font-bold">
                [ Toca para ver cómo te ayudamos ]
              </span>
            </motion.div>
          </div>

          {/* Explicación en cristiano */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-2xl space-y-4 pt-2"
          >
            <p className="text-base sm:text-lg text-white/90 leading-relaxed font-normal">
              Hacemos páginas web sencillas, rápidas y bonitas que <span className="text-[#6DD94B] font-bold">de verdad te traen clientes</span> y te quitan trabajo. Sin comisiones abusivas por cada pedido, sin líos informáticos y hablando directamente de tú a tú con nosotros. Desde 99€.
            </p>

            {/* Accesos rápidos */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={onNavigateToMultiwebs}
                className="px-4 py-2.5 border border-white/20 text-xs sm:text-sm font-bold uppercase tracking-wider text-white hover:border-[#6DD94B] hover:text-[#6DD94B] transition cursor-pointer bg-white/5"
              >
                🍔 Para Restaurantes y Bares
              </button>
              <button
                onClick={onNavigateToCyS}
                className="px-4 py-2.5 border border-white/20 text-xs sm:text-sm font-bold uppercase tracking-wider text-white hover:border-[#6DD94B] hover:text-[#6DD94B] transition cursor-pointer bg-white/5"
              >
                🏥 Para Clínicas y Salud
              </button>
              <span className="px-4 py-2.5 border border-[#6DD94B]/50 bg-[#6DD94B]/10 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#6DD94B] flex items-center gap-1.5">
                ⚡ Tu web lista y rápida
              </span>
            </div>
          </motion.div>
        </div>

        {/* Barra inferior */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-white/10 pt-6 mt-8 gap-3">
          <div className="flex items-center gap-3 text-xs sm:text-sm uppercase tracking-wider text-white/70 font-semibold">
            <span className="h-2.5 w-2.5 rounded-full bg-[#6DD94B] animate-ping" />
            <span>DISPONIBLES PARA EMPEZAR HOY MISMO • HUELVA Y SEVILLA</span>
          </div>

          <a 
            href="#soluciones"
            className="flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wider text-[#6DD94B] font-bold hover:underline"
          >
            <span>BAJAR PARA VER OPCIONES</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </a>
        </div>
      </section>

      {/* ── TICKER DE VENTAJAS REALES ── */}
      <MarqueeTicker />

      {/* ── SECCIÓN 2: OPCIONES CLARAS PARA TU NEGOCIO ── */}
      <section id="soluciones" className="py-20 sm:py-32 px-4 sm:px-8 border-t border-white/10 bg-[#121212] relative z-10">
        <div className="max-w-[1440px] mx-auto space-y-10">
          
          {/* Header de la sección */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-xs sm:text-sm uppercase tracking-wider text-[#6DD94B] block mb-2 font-bold">
                // SOLUCIONES LISTAS PARA TRABAJAR
              </span>
              <h2 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
                CÓMO AYUDAMOS A TU EMPRESA
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-white/60 max-w-sm text-right hidden sm:block">
              Tú nos dices qué necesitas y nosotros te lo dejamos todo funcionando desde el primer día.
            </p>
          </div>

          {/* Pestañas de selección */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 border border-white/15 p-2 bg-[#181818]">
            {panelsData.map((panel, idx) => (
              <button
                key={panel.id}
                onClick={() => setActivePanel(idx)}
                onMouseEnter={() => handleMouseEnterInteract(panel.code)}
                onMouseLeave={handleMouseLeaveInteract}
                className={`py-3.5 px-4 text-xs sm:text-sm uppercase font-bold text-left transition-all duration-300 cursor-pointer flex items-center justify-between ${
                  activePanel === idx 
                    ? 'bg-[#6DD94B] text-black font-black' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{panel.code} // {panel.title}</span>
                <span className={`text-[11px] ${activePanel === idx ? 'text-black' : 'text-[#6DD94B]'}`}>
                  {activePanel === idx ? '✓ VIENDO' : ''}
                </span>
              </button>
            ))}
          </div>

          {/* Contenedor del panel activo */}
          <div className="relative overflow-hidden min-h-[560px] border border-white/15 bg-[#181818]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePanel}
                initial={{ opacity: 0, x: activePanel % 2 === 0 ? -60 : 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: activePanel % 2 === 0 ? 60 : -60 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-0 h-full"
              >
                {/* Lado izquierdo: Explicación cercana y botón de acción */}
                <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 bg-[#151515]">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#6DD94B] px-2.5 py-1 border border-[#6DD94B]/30 bg-[#6DD94B]/10">
                        OPCIÓN {panelsData[activePanel].code}
                      </span>
                      <span className="text-xs uppercase text-white/60 font-semibold">
                        {panelsData[activePanel].platform}
                      </span>
                    </div>

                    <h3 className="text-3xl sm:text-5xl font-black uppercase text-white leading-tight">
                      {panelsData[activePanel].title}
                    </h3>

                    <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal">
                      {panelsData[activePanel].desc}
                    </p>

                    {panelsData[activePanel].highlights && (
                      <div className="space-y-2.5 pt-2">
                        {panelsData[activePanel].highlights.map((hl, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-white/90">
                            <CheckCircle2 className="w-4 h-4 text-[#6DD94B] shrink-0 mt-0.5" />
                            <span>{hl}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-8 mt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <span className="text-xs uppercase text-white/60 font-bold">PRECIO: DESDE 99€ // TODO INCLUIDO</span>
                    <button
                      onClick={panelsData[activePanel].action}
                      className="px-6 py-3 bg-[#6DD94B] text-black hover:bg-white text-xs sm:text-sm font-extrabold uppercase transition flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(109,217,75,0.3)]"
                    >
                      <span>{panelsData[activePanel].actionText}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Lado derecho: Opciones de plantillas explicadas en cristiano */}
                <div className="lg:col-span-7 p-6 sm:p-10 bg-[#121212] flex flex-col justify-between">
                  {panelsData[activePanel].templates ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <span className="text-xs uppercase text-[#6DD94B] font-bold">
                          // 6 ESTILOS DE DISEÑO A ELEGIR
                        </span>
                        <span className="text-xs text-white/50">
                          Haz clic para ver qué incluye cada una
                        </span>
                      </div>

                      {/* Botones de los 6 estilos */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {panelsData[activePanel].templates.map((tpl, tIndex) => (
                          <button
                            key={tpl.id}
                            onClick={() => panelsData[activePanel].setActiveTemplate(tIndex)}
                            className={`p-3 border text-left transition-all cursor-pointer ${
                              panelsData[activePanel].activeTemplate === tIndex
                                ? 'border-[#6DD94B] bg-[#6DD94B]/15 text-white'
                                : 'border-white/10 bg-[#181818] text-white/60 hover:text-white hover:border-white/30'
                            }`}
                          >
                            <span className="text-[11px] text-[#6DD94B] block font-bold">
                              {tpl.num}
                            </span>
                            <span className="text-xs sm:text-sm font-bold uppercase block truncate">
                              {tpl.name}
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Tarjeta explicativa del estilo seleccionado */}
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
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <span className="text-xs px-2.5 py-1 border border-[#6DD94B]/30 bg-[#6DD94B]/10 text-[#6DD94B] font-bold uppercase inline-block">
                                {cur.tag}
                              </span>
                              <span className="text-xs text-[#6DD94B] font-semibold">
                                ✓ {cur.benefit}
                              </span>
                            </div>

                            <h4 className="text-2xl font-black uppercase text-white">
                              {cur.name}
                            </h4>

                            <p className="text-sm text-white/80 leading-relaxed font-normal">
                              {cur.desc}
                            </p>

                            <div className="pt-2 flex items-center justify-between text-xs sm:text-sm font-bold text-[#6DD94B]">
                              <span>Adaptada a móvil, tablet y ordenador</span>
                              <button
                                onClick={panelsData[activePanel].action}
                                className="underline hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                              >
                                <span>Elegir este estilo</span>
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })()}
                    </div>
                  ) : (
                    /* Lado derecho para Clientes Locales o Panel de Cliente */
                    <div className="h-full flex flex-col justify-center items-center text-center p-8 space-y-6">
                      <div className="w-20 h-20 rounded-full border border-[#6DD94B] flex items-center justify-center bg-[#6DD94B]/10">
                        <Sparkles className="w-8 h-8 text-[#6DD94B]" />
                      </div>
                      <div className="space-y-3 max-w-md">
                        <h4 className="text-2xl sm:text-3xl font-black uppercase text-white">
                          {panelsData[activePanel].title}
                        </h4>
                        <p className="text-sm text-white/80 leading-relaxed">
                          Nos encargamos de toda la parte técnica para que tú solo tengas que preocuparte de atender a tus clientes y hacer crecer tu negocio.
                        </p>
                      </div>
                      <button
                        onClick={panelsData[activePanel].action}
                        className="px-8 py-3.5 border border-[#6DD94B] bg-[#6DD94B] text-black hover:bg-white text-xs sm:text-sm font-extrabold uppercase transition cursor-pointer"
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

      {/* ── SECCIÓN 3: COMPROMISO CENTRAL VERDE (ID: "compromiso") ── */}
      <section id="compromiso" className="h-[340px] sm:h-[440px] bg-[#0D844A] flex items-center justify-center px-4 text-center overflow-hidden relative z-10">
        <div className="absolute inset-0 bg-[radial-gradient(#6DD94B_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl space-y-4 relative z-10"
        >
          <span className="text-xs uppercase tracking-widest text-black/80 font-black bg-[#6DD94B] px-3 py-1">
            NUESTRO COMPROMISO EN HUELVA
          </span>
          <h2 className="text-3xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white leading-tight">
            HECHO PARA QUE TU NEGOCIO TRABAJE MEJOR Y VENDA MÁS
          </h2>
        </motion.div>
      </section>

      {/* ── SECCIÓN 4: ¿POR QUÉ CONFIAR EN NOSOTROS? ── */}
      <section className="py-20 sm:py-32 px-4 sm:px-8 max-w-[1440px] mx-auto z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase tracking-wider text-[#6DD94B] block font-bold">
              // SOMOS TU EQUIPO DE CONFIANZA
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase text-[#09844B] leading-none">
              ¿POR QUÉ <br />
              <span className="text-white">TECNODIEL?</span>
            </h2>
            <h3 className="text-lg sm:text-xl font-bold uppercase text-[#6DD94B]">
              Porque somos de Huelva, te cogemos el teléfono y no te dejamos tirado.
            </h3>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal">
              Sabemos lo duro que es llevar un negocio día a día. Entre atender a los clientes, los proveedores y el trabajo, no tienes tiempo para pelearte con páginas web complicadas ni agencias que te cobran un ojo de la cara y luego desaparecen.
            </p>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal">
              En TecnOdiel nos encargamos de todo de principio a fin: te creamos la web, te subimos las fotos y la carta, te configuramos las citas y te damos soporte continuo. Si necesitas cambiar algo, nos mandas un WhatsApp y te lo dejamos listo.
            </p>
            <div className="pt-4">
              <button
                onClick={onOpenAudit}
                className="border border-white hover:border-[#6DD94B] px-8 py-3.5 text-xs sm:text-sm uppercase tracking-wider text-white hover:bg-white hover:text-[#0D844A] transition-all cursor-pointer font-bold"
              >
                Hablar con Nosotros Directamente
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#181818] border border-white/10 p-8 sm:p-12 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs uppercase text-[#6DD94B] font-bold">LO QUE TE GARANTIZAMOS</span>
              <span className="text-xs text-white/50">HUELVA Y SEVILLA</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Abre en 1 segundo', desc: 'Tu web vuela en el móvil. Los clientes nunca se van por lentitud.' },
                { title: 'Sin comisiones por pedido', desc: 'No pagas el 15% o 30% a plataformas intermediarias.' },
                { title: 'Carta digital táctil', desc: 'Fotos reales que abren el apetito y se actualizan al instante.' },
                { title: 'Dominio y seguridad incluidos', desc: 'Todo listo, legal y protegido con candado de seguridad SSL.' },
                { title: 'Cobro por Bizum o tarjeta', desc: 'El dinero llega directo a tu cuenta bancaria sin comisiones raras.' },
                { title: 'Atención con personas reales', desc: 'Hablas directamente con nosotros (Mario y Dani), no con un contestador.' }
              ].map((g, i) => (
                <div key={i} className="p-4 bg-[#121212] border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#6DD94B] shrink-0" />
                    <span className="text-xs sm:text-sm font-bold uppercase text-white">{g.title}</span>
                  </div>
                  <p className="text-xs text-white/70 pl-6 leading-relaxed font-normal">{g.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 5: TABLA COMPARATIVA CLARA (ID: "incluido") ── */}
      <section id="incluido" className="bg-white text-black py-20 sm:py-32 px-4 sm:px-8 z-10 relative">
        <div className="max-w-[1440px] mx-auto space-y-12">
          <div className="border-b-2 border-[#09844B] pb-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#09844B] font-bold block mb-1">
                // TRANSPARENCIA TOTAL
              </span>
              <h2 className="text-3xl sm:text-5xl font-black uppercase text-[#09844B] tracking-tight">
                TODO LO QUE INCLUYE TU WEB
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 uppercase font-semibold">
              SIN LETRA PEQUEÑA NI COSTES OCULTOS
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-[#09844B]">
                  <th className="py-4 w-16 text-neutral-400 font-bold">#</th>
                  <th className="py-4 text-[#09844B] font-bold uppercase">CARACTERÍSTICA</th>
                  <th className="py-4 uppercase text-black font-extrabold">HOSTELERÍA (BARES Y RESTAURANTES)</th>
                  <th className="py-4 uppercase text-black font-extrabold">CLÍNICAS Y CENTROS DE SALUD</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    id: '01',
                    title: 'Diseño a medida',
                    host: '6 estilos a elegir adaptados a tu tipo de comida',
                    clin: '6 estilos a elegir según tu especialidad médica'
                  },
                  {
                    id: '02',
                    title: 'Velocidad en el móvil',
                    host: 'Carga instantánea en menos de 1 segundo',
                    clin: 'Carga instantánea en menos de 1 segundo'
                  },
                  {
                    id: '03',
                    title: 'Herramientas de venta',
                    host: 'Carta digital QR interactiva + Pedidos por WhatsApp',
                    clin: 'Cita previa online en calendario + WhatsApp VIP'
                  },
                  {
                    id: '04',
                    title: 'Cobros',
                    host: 'Bizum directo y cobro con tarjeta sin comisiones',
                    clin: 'Cobro de consultas o reservas con Bizum y tarjeta'
                  },
                  {
                    id: '05',
                    title: 'Panel para cambiar datos',
                    host: 'Cambia platos, precios y fotos tú mismo en segundos',
                    clin: 'Gestiona citas, servicios y horarios fácilmente'
                  },
                  {
                    id: '06',
                    title: 'Soporte cercano',
                    host: 'Mario y Dani disponibles por WhatsApp y llamada',
                    clin: 'Mario y Dani disponibles por WhatsApp y llamada'
                  },
                  {
                    id: '07',
                    title: 'Precio y comisiones',
                    host: 'Desde 99€ • 0€ de comisiones por pedido',
                    clin: 'Desde 99€ • 0€ de comisiones por cita'
                  }
                ].map((row) => (
                  <tr key={row.id} className="border-b border-[#09844B]/30 hover:bg-[#09844B]/5 transition-colors">
                    <td className="py-4 font-bold text-[#09844B]">{row.id}</td>
                    <td className="py-4 font-bold uppercase text-black">{row.title}</td>
                    <td className="py-4 text-neutral-800 font-normal">{row.host}</td>
                    <td className="py-4 text-neutral-800 font-normal">{row.clin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 6: LLAMADA A LA ACCIÓN ── */}
      <section className="py-20 sm:py-32 px-4 sm:px-8 text-center bg-[#181818] border-t border-white/10 z-10 relative">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="text-xs uppercase tracking-wider text-[#6DD94B] block font-bold">
            // EL MOMENTO DE MEJORAR TU EMPRESA ES AHORA
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase text-white tracking-tight leading-tight">
            ¿QUIERES VER TU NEGOCIO EN LO MÁS ALTO?
          </h2>
          <p className="text-base sm:text-lg font-bold text-[#6DD94B] uppercase tracking-wide">
            Hablamos contigo, vemos qué necesitas y te damos una solución clara hoy mismo.
          </p>
          <div className="pt-4">
            <button
              onClick={onOpenAudit}
              className="border border-white hover:border-[#6DD94B] px-10 py-4 text-xs sm:text-sm uppercase tracking-wider text-white hover:bg-white hover:text-[#0D844A] transition-all cursor-pointer font-bold"
            >
              Pedir Presupuesto Sin Compromiso • Desde 99€
            </button>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 7: CONTACTO DIRECTO (ESTILO EXACTO A LA IMAGEN) ── */}
      <section id="contact" className="py-20 sm:py-32 px-4 sm:px-8 bg-black border-t border-white/10 z-10 relative">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Lado izquierdo: Información y WhatsApp */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase tracking-wider text-[#6DD94B] font-extrabold block">
              // HABLEMOS DE TU PROYECTO
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              ¿Tienes un negocio y quieres dar el salto digital?
            </h2>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal">
              Cuéntanos cómo trabajas y te preparamos una propuesta a tu medida, con presupuesto cerrado y sin compromiso. Si prefieres hablar, escríbenos por WhatsApp.
            </p>

            <div className="pt-2 space-y-3 text-sm text-white/80">
              <p className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#6DD94B] shrink-0" />
                <span>Huelva, Andalucía</span>
              </p>
              <p className="flex items-center gap-2.5">
                <span className="text-[#6DD94B]">✉️</span>
                <span>contacto@tecnodiel.com</span>
              </p>
            </div>

            <div className="pt-4">
              <a
                href="https://wa.me/34600000000?text=Hola%20TecnOdiel,%20tengo%20un%20negocio%20y%20quiero%20informaci%C3%B3n%20para%20dar%20el%20salto%20digital"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#6DD94B] text-[#6DD94B] hover:bg-[#6DD94B] hover:text-black text-xs sm:text-sm font-bold transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Hablemos por WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Lado derecho: Tarjeta blanca limpia (como en la imagen del usuario) */}
          <div className="lg:col-span-7">
            <div className="bg-white text-zinc-900 rounded-3xl p-6 sm:p-10 shadow-2xl">
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!formData.privacy) {
                  alert('Por favor, acepta la política de privacidad para continuar.');
                  return;
                }
                const payload = {
                  name: formData.name,
                  business_name: formData.business_name || formData.name,
                  phone: formData.phone,
                  email: formData.email,
                  business_type: formData.platform
                };
                try {
                  sessionStorage.setItem('tecnodiel_lead_data', JSON.stringify(payload));
                  localStorage.setItem('tecnodiel_lead_data', JSON.stringify(payload));
                } catch (_) {}

                if (formData.platform === 'clinica') {
                  if (onNavigateToCyS) onNavigateToCyS();
                  else window.location.hash = '#/cys';
                } else {
                  if (onNavigateToMultiwebs) onNavigateToMultiwebs();
                  else window.location.hash = '#/multiwebs';
                }
              }} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block">
                      TU NOMBRE *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ej. Adrián"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#0D844A] focus:bg-white transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block">
                      NOMBRE DEL NEGOCIO
                    </label>
                    <input
                      type="text"
                      value={formData.business_name || ''}
                      onChange={e => setFormData({ ...formData, business_name: e.target.value })}
                      placeholder="Ej. Barbería Millán / Bar El Puerto"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#0D844A] focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block">
                      TELÉFONO / WHATSAPP *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="600 000 000"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#0D844A] focus:bg-white transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block">
                      EMAIL *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="tu@negocio.com"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#0D844A] focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block">
                    ¿QUÉ TIPO DE NEGOCIO TIENES? *
                  </label>
                  <select
                    value={formData.platform}
                    onChange={e => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-[#0D844A] focus:bg-white transition cursor-pointer font-medium"
                  >
                    <option value="hosteleria">Restaurante / Bar / Cafetería</option>
                    <option value="clinica">Clínica / Salud / Dental</option>
                    <option value="otro">Comercio u otro negocio local</option>
                  </select>
                </div>

                <div className="pt-2 space-y-3">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-zinc-600">
                    <input
                      type="checkbox"
                      checked={formData.privacy}
                      onChange={e => setFormData({ ...formData, privacy: e.target.checked })}
                      className="mt-0.5 accent-[#0D844A] rounded"
                    />
                    <span>
                      He leído y acepto la política de privacidad. Usaremos tus datos solo para contactarte sobre tu solicitud.
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#0D844A] hover:bg-[#096637] text-white font-extrabold text-sm uppercase rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>QUIERO MI PROPUESTA GRATIS</span>
                  </button>

                  <p className="text-center text-[11px] text-zinc-500 font-medium">
                    Sin compromiso • Presupuesto cerrado • Respuesta en menos de 24h
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── PIE DE PÁGINA CERCANO ── */}
      <footer className="py-16 px-4 sm:px-8 border-t border-white/10 bg-[#0c0c0c] text-center z-10 relative">
        <div className="max-w-[1440px] mx-auto space-y-6">
          <span className="text-xs uppercase tracking-wider text-[#6DD94B] block font-bold">
            // TECNODIEL HUELVA
          </span>
          <h2 className="text-2xl sm:text-5xl font-black uppercase text-white tracking-tight">
            DIGITALIZAMOS TU NEGOCIO CON CERCANÍA Y PROFESIONALIDAD
          </h2>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onNavigateToMultiwebs}
              className="border border-white/30 hover:border-white px-6 py-3 text-xs sm:text-sm uppercase text-white transition-all cursor-pointer font-bold"
            >
              Configurador Restaurantes
            </button>
            <button
              onClick={onNavigateToCyS}
              className="border border-white/30 hover:border-white px-6 py-3 text-xs sm:text-sm uppercase text-white transition-all cursor-pointer font-bold"
            >
              Configurador Clínicas
            </button>
            <button
              onClick={onNavigateToPortal}
              className="border border-[#6DD94B] bg-[#6DD94B]/10 px-6 py-3 text-xs sm:text-sm uppercase text-[#6DD94B] hover:bg-[#6DD94B] hover:text-black transition-all cursor-pointer font-bold"
            >
              Acceso a Tu Panel de Cliente
            </button>
          </div>
          <p className="text-xs text-white/50 pt-8 border-t border-white/5">
            © {new Date().getFullYear()} TecnOdiel • Startup de Huelva • Páginas web y digitalización para empresas locales
          </p>
        </div>
      </footer>
    </div>
  );
}
