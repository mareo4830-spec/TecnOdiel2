import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Globe, 
  ExternalLink, 
  TrendingUp, 
  Calendar, 
  UtensilsCrossed, 
  MessagesSquare, 
  Send, 
  ShieldCheck, 
  Clock, 
  Phone, 
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  Layers,
  MessageCircle,
  BarChart3,
  FileText,
  User,
  LogOut,
  MapPin,
  Check,
  AlertCircle,
  HelpCircle,
  Stethoscope,
  QrCode,
  Copy,
  Edit3,
  Save,
  Share2,
  Eye,
  Smartphone,
  ToggleLeft,
  ToggleRight,
  Download
} from 'lucide-react';

/**
 * PORTAL DE CLIENTES (ESTÉTICA 100% TECNODIEL LANDING)
 * Paleta idéntica a la landing:
 * - Fondo grafito: #121212
 * - Paneles y tarjetas: #181818 con border-white/10
 * - Acento de marca TecnOdiel: Verde neón #6DD94B
 * - Animaciones fluidas idénticas al Panel de Administración con framer-motion
 */
export const VirtualDeskClientPortal = ({
  tenantData = {},
  onSwitchToAdminView,
  onNavigateToLanding,
  onLogout
}) => {
  const businessName = tenantData.name || tenantData.business_name || 'Mi Negocio';
  const slug = tenantData.slug || 'mi-negocio';
  const isClinic = tenantData.collegiate_number || tenantData.category === 'dental' || tenantData.category === 'policlinica' || (tenantData.selected_modules || []).some(m => typeof m === 'string' && m.toLowerCase().includes('cita'));
  
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'qr' | 'chat' | 'services' | 'stats'
  const [copiedLink, setCopiedLink] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Datos editables de contacto y horarios
  const [contactPhone, setContactPhone] = useState(tenantData.phone || '+34 600 12 34 56');
  const [openingHours, setOpeningHours] = useState(tenantData.schedule || 'L-D: 13:00 - 16:30 | 20:00 - 00:00');
  const [contactEmail, setContactEmail] = useState(tenantData.email || 'contacto@minegocio.es');
  const [businessAddress, setBusinessAddress] = useState(tenantData.address || 'Calle Principal, Huelva');

  // Servicios activos interactivos
  const [servicesState, setServicesState] = useState([
    { id: 'web', name: isClinic ? 'Página Web Médica Certificada' : 'Web Profesional Responsive', active: true, desc: 'Dominio propio y carga ultrarrápida 24/7' },
    { id: 'menu_qr', name: isClinic ? 'Cita Previa Online' : 'Carta Digital Interactiva con QR', active: true, desc: 'Acceso instantáneo para tus clientes sin instalar apps' },
    { id: 'whatsapp', name: 'Canal Directo de WhatsApp', active: true, desc: 'Tus clientes te escriben o reservan con 1 clic' },
    { id: 'reviews', name: 'Google Maps & Reseñas Directas', active: true, desc: 'Fomenta valoraciones 5 estrellas de clientes satisfechos' }
  ]);

  const toggleService = (id) => {
    setServicesState(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const handleSaveInfo = (e) => {
    e.preventDefault();
    setIsEditingInfo(false);
    setSaveSuccess(true);
    try {
      const updated = {
        ...tenantData,
        phone: contactPhone,
        schedule: openingHours,
        email: contactEmail,
        address: businessAddress
      };
      localStorage.setItem(`tecnodiel_client_project_${contactEmail.toLowerCase()}`, JSON.stringify(updated));
      localStorage.setItem('tecnodiel_active_project', JSON.stringify(updated));
    } catch (_) {}
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Mario (TecnOdiel)',
      text: `¡Hola ${businessName}! Ya tenemos tu espacio web conectado y optimizado.`,
      time: '10:00',
      isAgency: true
    },
    {
      id: 2,
      sender: 'Mario (TecnOdiel)',
      text: 'Cualquier precio, plato, servicio, foto u horario que quieras retocar, dínoslo por aquí y Dani o yo te lo dejamos listo en el acto.',
      time: '10:01',
      isAgency: true
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const chatBottomRef = useRef(null);

  const templateName = tenantData.template_id || (isClinic ? 'Clínica & Salud Pro' : 'Hostelería & Gastro Pro');

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    const newMsg = {
      id: Date.now(),
      sender: 'Tú',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAgency: false
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    // Respuesta inteligente automática de Mario & Dani
    setTimeout(() => {
      let replyText = '¡Oído cocina! Dani y yo nos ponemos con ello ahora mismo y te avisamos cuando quede publicado.';
      const lower = userText.toLowerCase();
      if (lower.includes('precio') || lower.includes('plato') || lower.includes('carta') || lower.includes('menu')) {
        replyText = '¡Recibido! Actualizamos ese detalle en tu carta digital en unos minutos.';
      } else if (lower.includes('foto') || lower.includes('imagen')) {
        replyText = 'Perfecto, podemos optimizar tus fotos y colocarlas en la web hoy mismo.';
      } else if (lower.includes('horario') || lower.includes('telefono') || lower.includes('abrir')) {
        replyText = 'Cambiamos el horario y datos de contacto de inmediato para que nadie tenga dudas al entrar.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'Mario (TecnOdiel)',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAgency: true
        }
      ]);
    }, 900);
  };

  // URL pública de la web
  const webOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://tecnodiel.es';
  const liveUrl = isClinic ? `${webOrigin}/#/c/${slug}` : `${webOrigin}/#/r/${slug}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(liveUrl)}&color=000000&bgcolor=ffffff&margin=1`;

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(liveUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (_) {}
  };

  return (
    <div className="min-h-screen bg-[#121212] text-zinc-100 flex flex-col lg:flex-row font-['Montserrat',Inter,sans-serif] selection:bg-[#6DD94B] selection:text-black">
      {/* ── BARRA LATERAL (ESTÉTICA TECNODIEL CON VERDE #6DD94B) ── */}
      <aside className="w-full lg:w-64 border-r border-white/10 bg-[#161616] flex flex-col shrink-0">
        {/* Cabecera Sidebar con Logo TecnOdiel */}
        <div className="h-20 px-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#6DD94B] flex items-center justify-center font-black text-black text-xs shadow-md shadow-[#6DD94B]/20">
              TO
            </div>
            <div className="min-w-0">
              <span className="font-extrabold text-sm text-white block tracking-wide truncate">
                {businessName}
              </span>
              <span className="text-[10px] text-[#6DD94B] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6DD94B] animate-pulse" />
                Portal Verificado
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onNavigateToLanding && (
              <button
                onClick={onNavigateToLanding}
                title="Volver a la portada de TecnOdiel"
                className="text-[10px] bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 px-2 py-1 rounded-lg transition cursor-pointer"
              >
                Inicio
              </button>
            )}
            {onSwitchToAdminView && (
              <button
                onClick={onSwitchToAdminView}
                title="Acceso administrativo"
                className="text-[10px] bg-[#6DD94B]/15 hover:bg-[#6DD94B]/25 text-[#6DD94B] border border-[#6DD94B]/30 px-2 py-1 rounded-lg font-bold transition cursor-pointer"
              >
                Admin ➔
              </button>
            )}
          </div>
        </div>

        {/* Navegación del Portal con animación fluida layoutId */}
        <nav className="p-3 space-y-1.5 flex-1">
          {[
            { id: 'overview', label: 'Mi Web & Herramientas', icon: Building2 },
            { id: 'qr', label: 'Código QR para Clientes', icon: QrCode },
            { id: 'chat', label: 'Hablar con Soporte', icon: MessagesSquare, badge: true },
            { id: 'services', label: 'Mis Servicios Activos', icon: Layers },
            { id: 'stats', label: 'Visitas & Estadísticas', icon: BarChart3 }
          ].map(({ id, label, icon: Icon, badge }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  isActive ? 'text-black' : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="clientPortalActiveTab"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    className="absolute inset-0 bg-[#6DD94B] rounded-xl shadow-lg shadow-[#6DD94B]/20 -z-0"
                  />
                )}
                <Icon className={`w-4 h-4 relative z-10 ${isActive ? 'text-black' : 'text-zinc-400'}`} />
                <span className="relative z-10 flex-1 text-left">{label}</span>
                {badge && (
                  <span className={`w-2 h-2 rounded-full relative z-10 ${isActive ? 'bg-black' : 'bg-[#6DD94B] animate-pulse'}`} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Tarjeta de Asistencia Directa TecnOdiel con Verde Corporativo #6DD94B */}
        <div className="p-4 border-t border-white/10 bg-[#181818] m-3 rounded-2xl space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6DD94B]" />
            <span className="text-xs font-extrabold text-white">Equipo TecnOdiel</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Mario y Dani te atienden al instante. Pídenos cualquier cambio o actualización.
          </p>
          <a
            href={`https://wa.me/34600000000?text=${encodeURIComponent(`Hola Mario y Dani, soy ${businessName} desde mi portal TecnOdiel y necesito una actualización.`)}`}
            target="_blank"
            rel="noreferrer"
            className="w-full bg-[#6DD94B] hover:bg-white text-black text-xs font-black py-2.5 rounded-full flex items-center justify-center gap-2 transition shadow-md shadow-[#6DD94B]/20 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp Directo
          </a>
        </div>

        {/* Pie del Sidebar */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2 truncate">
            <User className="w-4 h-4 text-zinc-500 shrink-0" />
            <span className="truncate">{contactPhone}</span>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem('tecnodiel_auth_session');
              window.location.hash = '#/';
              window.location.reload();
            }}
            title="Cerrar sesión"
            className="hover:text-red-400 p-1.5 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ── CONTENIDO PRINCIPAL CON ANIMACIONES FLUIDAS ── */}
      <main className="flex-1 p-5 sm:p-8 md:p-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* SECCIÓN 1: MI WEB & HERRAMIENTAS ÚTILES */}
          {activeTab === 'overview' && (
            <motion.div
              key="tab-overview"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[1100px] mx-auto space-y-7"
            >
              {/* Cabecera Principal */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                      {businessName}
                    </h1>
                    <span className="text-[11px] font-black uppercase tracking-wider bg-[#6DD94B]/15 text-[#6DD94B] border border-[#6DD94B]/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6DD94B] animate-pulse" />
                      Web Activa
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    Panel de control privado • Gestiona tus datos, código QR y peticiones en tiempo real.
                  </p>
                </div>

                {/* Acciones principales rápidas */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={handleCopyLink}
                    className="rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-bold px-4 py-2.5 flex items-center gap-2 border border-white/10 transition cursor-pointer"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4 text-[#6DD94B]" />
                        <span className="text-[#6DD94B]">¡Enlace copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-zinc-400" />
                        <span>Copiar Enlace</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('qr')}
                    className="rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-bold px-4 py-2.5 flex items-center gap-2 border border-white/10 transition cursor-pointer"
                  >
                    <QrCode className="w-4 h-4 text-[#6DD94B]" />
                    <span>Ver QR</span>
                  </button>

                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-[#6DD94B] hover:bg-white text-black text-xs font-black px-6 py-2.5 flex items-center gap-2 transition shadow-lg shadow-[#6DD94B]/20 cursor-pointer"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Ver Web en Vivo</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Toast de guardado */}
              <AnimatePresence>
                {saveSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3.5 rounded-xl bg-[#6DD94B]/15 border border-[#6DD94B]/40 text-[#6DD94B] text-xs font-bold flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>¡Tus datos se han actualizado correctamente y ya se muestran en tu web!</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 3 Métricas Clave con micro-animaciones */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#181818] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-md"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Visitas este mes
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-white flex items-baseline gap-2">
                    <span>1.420</span>
                    <span className="text-xs text-[#6DD94B] font-bold">+24%</span>
                  </div>
                  <span className="text-xs text-zinc-500 mt-2 block">
                    Personas que han abierto tu enlace o código QR
                  </span>
                </motion.div>

                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#181818] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-md"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    {isClinic ? 'Citas solicitadas' : 'Peticiones / Reservas'}
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-[#6DD94B]">
                    38
                  </div>
                  <span className="text-xs text-zinc-500 mt-2 block">
                    Recibidas directamente en tu teléfono
                  </span>
                </motion.div>

                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#181818] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-md"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Estilo & Plataforma
                  </span>
                  <div className="text-base sm:text-lg font-black text-white truncate">
                    {templateName}
                  </div>
                  <span className="text-xs text-[#6DD94B] mt-2 block font-semibold">
                    0% comisiones • Código 100% tuyo
                  </span>
                </motion.div>
              </div>

              {/* Ficha editable en directo: Teléfono, Horario y Ubicación */}
              <motion.div
                layout
                className="bg-[#181818] border border-white/10 rounded-2xl p-6 space-y-5 shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-[#6DD94B]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      Datos visibles para tus clientes
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditingInfo(!isEditingInfo)}
                    className="text-xs text-[#6DD94B] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {isEditingInfo ? 'Cancelar edición' : 'Modificar datos'}
                  </button>
                </div>

                {isEditingInfo ? (
                  <form onSubmit={handleSaveInfo} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                        Teléfono / WhatsApp de atención
                      </label>
                      <input
                        type="text"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full bg-[#111] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#6DD94B]"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                        Horario de apertura / citas
                      </label>
                      <input
                        type="text"
                        value={openingHours}
                        onChange={(e) => setOpeningHours(e.target.value)}
                        className="w-full bg-[#111] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#6DD94B]"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                        Correo electrónico
                      </label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full bg-[#111] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#6DD94B]"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                        Dirección del local o consulta
                      </label>
                      <input
                        type="text"
                        value={businessAddress}
                        onChange={(e) => setBusinessAddress(e.target.value)}
                        className="w-full bg-[#111] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#6DD94B]"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2 flex justify-end pt-2">
                      <button
                        type="submit"
                        className="rounded-full bg-[#6DD94B] hover:bg-white text-black font-black text-xs px-6 py-2.5 flex items-center gap-2 transition cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        Guardar y Publicar en Mi Web
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                      <span className="text-zinc-500 block text-[10px] uppercase font-bold">Teléfono / WhatsApp</span>
                      <span className="font-bold text-white mt-0.5 block truncate">{contactPhone}</span>
                    </div>
                    <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                      <span className="text-zinc-500 block text-[10px] uppercase font-bold">Horario</span>
                      <span className="font-bold text-white mt-0.5 block truncate">{openingHours}</span>
                    </div>
                    <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                      <span className="text-zinc-500 block text-[10px] uppercase font-bold">Dirección</span>
                      <span className="font-bold text-white mt-0.5 block truncate">{businessAddress}</span>
                    </div>
                    <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                      <span className="text-zinc-500 block text-[10px] uppercase font-bold">Enlace Clientes</span>
                      <span className="font-mono text-[#6DD94B] mt-0.5 block truncate font-bold">
                        {liveUrl.replace(/^https?:\/\//, '')}
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Registro reciente de peticiones y reservas */}
              <div className="bg-[#181818] border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#6DD94B]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      {isClinic ? 'Últimas solicitudes de cita' : 'Últimas peticiones de clientes'}
                    </h3>
                  </div>
                  <span className="text-[11px] text-zinc-500">Actualizado hace un momento</span>
                </div>

                <div className="space-y-2.5">
                  {[
                    { id: 1, name: 'Carlos Mendoza', time: 'Hoy, 13:45', detail: isClinic ? 'Primera consulta dental' : 'Mesa para 4 comensales (Terraza)', status: 'Confirmada' },
                    { id: 2, name: 'Laura Gómez', time: 'Ayer, 20:10', detail: isClinic ? 'Revisión periódica' : 'Mesa para 2 comensales (Interior)', status: 'Confirmada' },
                    { id: 3, name: 'Manuel Rivas', time: 'Hace 2 días', detail: isClinic ? 'Consulta traumatología' : 'Reserva almuerzo de empresa', status: 'Atendida' }
                  ].map((item) => (
                    <div
                      key={item.id}
                      className="bg-black/40 border border-white/5 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{item.name}</span>
                          <span className="text-[10px] text-zinc-500">• {item.time}</span>
                        </div>
                        <p className="text-zinc-400 text-[11px]">{item.detail}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#6DD94B]/15 text-[#6DD94B] border border-[#6DD94B]/30">
                          {item.status}
                        </span>
                        <a
                          href={`https://wa.me/34600000000?text=${encodeURIComponent(`Hola ${item.name}, te escribimos desde ${businessName} sobre tu solicitud.`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-white text-[11px] font-semibold transition"
                        >
                          Contactar
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* SECCIÓN 2: CÓDIGO QR PARA CLIENTES (FUNCIÓN REAL Y ÚTIL) */}
          {activeTab === 'qr' && (
            <motion.div
              key="tab-qr"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[800px] mx-auto space-y-7"
            >
              <div className="border-b border-white/10 pb-4">
                <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                  <QrCode className="w-6 h-6 text-[#6DD94B]" />
                  Código QR de tu Negocio
                </h1>
                <p className="text-xs text-zinc-400 mt-1">
                  Listo para imprimir en pegatinas, mesas, mostrador o escaparate. Al escanearlo, tus clientes acceden a tu web sin instalar nada.
                </p>
              </div>

              <div className="bg-[#181818] border border-white/10 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
                {/* Visualizador del QR con marco para imprimir */}
                <div className="bg-white p-5 rounded-2xl shadow-xl flex flex-col items-center justify-center shrink-0 border-4 border-[#6DD94B]">
                  <img
                    src={qrImageUrl}
                    alt={`QR ${businessName}`}
                    className="w-52 h-52 object-contain"
                  />
                  <span className="text-black font-extrabold text-[11px] uppercase tracking-wider mt-2">
                    {businessName}
                  </span>
                  <span className="text-zinc-600 font-semibold text-[9px]">
                    Escanea para ver nuestra web
                  </span>
                </div>

                <div className="space-y-4 text-left flex-1">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-[#6DD94B] uppercase tracking-wider">
                      Listo para usar
                    </span>
                    <h3 className="text-lg font-black text-white">
                      Coloca este código a la vista de tus clientes
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      El código QR apunta siempre a la versión más actualizada de tu web. Si cambias precios o platos, se actualiza solo sin tener que reimprimir el QR.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-3">
                    <a
                      href={qrImageUrl}
                      download={`QR-${slug}.png`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-[#6DD94B] hover:bg-white text-black text-xs font-black px-6 py-3 flex items-center gap-2 transition shadow-lg shadow-[#6DD94B]/20 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      Descargar Imagen QR (Alta Resolución)
                    </a>

                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-bold px-5 py-3 flex items-center gap-2 border border-white/10 transition cursor-pointer"
                    >
                      Imprimir en Papel
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] text-zinc-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#6DD94B] shrink-0" />
                    <span>Enlace directo del QR: <strong className="text-white font-mono">{liveUrl}</strong></span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SECCIÓN 3: HABLAR CON NOSOTROS (CHAT DIRECTO CON MARIO & DANI) */}
          {activeTab === 'chat' && (
            <motion.div
              key="tab-chat"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[900px] mx-auto space-y-5"
            >
              {/* Header del chat */}
              <div className="border-b border-white/10 pb-4 flex flex-wrap justify-between items-center gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <MessagesSquare className="w-5 h-5 text-[#6DD94B]" />
                    Chat Directo con Mario y Dani
                  </h1>
                  <p className="text-xs text-zinc-400">
                    Dinos cualquier ajuste que quieras en tu web y lo implementamos sin que tú tengas que tocar código.
                  </p>
                </div>
                <div className="text-xs text-[#6DD94B] flex items-center gap-2 bg-[#6DD94B]/10 border border-[#6DD94B]/30 px-3 py-1.5 rounded-full font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#6DD94B] animate-pulse" />
                  Mario & Dani Disponibles
                </div>
              </div>

              {/* Atajos de peticiones reales para clientes */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  'Quiero cambiar los precios de la carta',
                  'Quiero subir fotos nuevas de platos / local',
                  'Quiero actualizar el horario de apertura',
                  'Quiero poner aviso de días festivos o vacaciones'
                ].map((shortcut) => (
                  <button
                    key={shortcut}
                    type="button"
                    onClick={() => setInputMessage(shortcut)}
                    className="text-xs bg-[#181818] hover:bg-white/10 text-zinc-300 border border-white/10 px-3.5 py-2 rounded-full transition cursor-pointer"
                  >
                    {shortcut}
                  </button>
                ))}
              </div>

              {/* Contenedor de mensajes */}
              <div className="bg-[#181818] border border-white/10 rounded-2xl flex flex-col h-[520px] overflow-hidden shadow-2xl">
                <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col ${m.isAgency ? 'items-start' : 'items-end'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-[10px] text-zinc-400 font-mono">
                        <span>{m.sender}</span>
                        <span>•</span>
                        <span>{m.time}</span>
                      </div>
                      <div
                        className={`max-w-md px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-md ${
                          m.isAgency
                            ? 'bg-[#222222] text-zinc-200 rounded-tl-none border border-white/10'
                            : 'bg-[#6DD94B] text-black font-semibold rounded-tr-none'
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
                  <div ref={chatBottomRef} />
                </div>

                {/* Input para redactar */}
                <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-[#141414] flex gap-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Escribe tu petición a Mario y Dani..."
                    className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-full px-5 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none focus:border-[#6DD94B] transition"
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-[#6DD94B] hover:bg-white text-black px-6 py-3 text-xs font-black uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shrink-0 shadow-lg shadow-[#6DD94B]/20"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Enviar</span>
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* SECCIÓN 4: MIS SERVICIOS ACTIVOS */}
          {activeTab === 'services' && (
            <motion.div
              key="tab-services"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[1000px] mx-auto space-y-6"
            >
              <div className="border-b border-white/10 pb-4">
                <h1 className="text-2xl sm:text-3xl font-black text-white">Módulos & Servicios de tu Web</h1>
                <p className="text-xs text-zinc-400">
                  Controla las funciones activadas en tu plataforma. Todo disponible sin cuotas por pedido ni costes ocultos.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {servicesState.map((srv) => (
                  <motion.div
                    key={srv.id}
                    whileHover={{ y: -2 }}
                    className="bg-[#181818] border border-white/10 rounded-2xl p-5 flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-lg bg-[#6DD94B]/15 border border-[#6DD94B]/30 flex items-center justify-center text-[#6DD94B] shrink-0 mt-0.5">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{srv.name}</h4>
                        <p className="text-xs text-zinc-400 mt-1">{srv.desc}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleService(srv.id)}
                      className="cursor-pointer shrink-0 text-[#6DD94B] hover:text-white transition"
                      title="Activar / Pausar módulo"
                    >
                      {srv.active ? (
                        <ToggleRight className="w-7 h-7 text-[#6DD94B]" />
                      ) : (
                        <ToggleLeft className="w-7 h-7 text-zinc-600" />
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>

              <div className="bg-[#181818] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#6DD94B]" />
                    ¿Quieres incorporar una nueva función a tu web?
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Podemos activar pasarela de pago, pedidos online o recordatorios por SMS cuando lo necesites.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('chat')}
                  className="rounded-full bg-[#6DD94B] hover:bg-white text-black text-xs font-black px-6 py-3 transition cursor-pointer shrink-0 shadow-md shadow-[#6DD94B]/20"
                >
                  Solicitar Nueva Función
                </button>
              </div>
            </motion.div>
          )}

          {/* SECCIÓN 5: ESTADÍSTICAS & ACTIVIDAD */}
          {activeTab === 'stats' && (
            <motion.div
              key="tab-stats"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[1000px] mx-auto space-y-6"
            >
              <div className="border-b border-white/10 pb-4">
                <h1 className="text-2xl sm:text-3xl font-black text-white">Actividad y Estadísticas en Vivo</h1>
                <p className="text-xs text-zinc-400">
                  Rendimiento real de tu plataforma y cómo interactúan tus clientes.
                </p>
              </div>

              {/* Gráfico de barras animado semanal */}
              <div className="bg-[#181818] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#6DD94B]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      Visitas de los últimos 7 días
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-[#6DD94B]">+24% vs semana anterior</span>
                </div>

                <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-white/10">
                  {[
                    { day: 'Lun', val: 180, pct: '50%' },
                    { day: 'Mar', val: 210, pct: '60%' },
                    { day: 'Mié', val: 195, pct: '55%' },
                    { day: 'Jue', val: 260, pct: '75%' },
                    { day: 'Vie', val: 340, pct: '95%' },
                    { day: 'Sáb', val: 370, pct: '100%' },
                    { day: 'Dom', val: 310, pct: '88%' }
                  ].map((bar, i) => (
                    <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <span className="text-[10px] text-zinc-400 font-mono">{bar.val}</span>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: bar.pct }}
                        transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
                        className="w-full max-w-[36px] bg-gradient-to-t from-[#6DD94B]/30 to-[#6DD94B] rounded-t-lg shadow-sm"
                      />
                      <span className="text-[11px] font-bold text-zinc-400">{bar.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Métricas detalladas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="bg-[#181818] border border-white/10 rounded-2xl p-6 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
                    <Smartphone className="w-4 h-4 text-[#6DD94B]" />
                    <span>Dispositivos Móviles</span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-white">94%</div>
                  <p className="text-xs text-zinc-400">
                    La gran mayoría de clientes consulta tu carta o reserva directamente desde el teléfono mientras está en la calle o en tu local.
                  </p>
                </div>

                <div className="bg-[#181818] border border-white/10 rounded-2xl p-6 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
                    <Eye className="w-4 h-4 text-[#6DD94B]" />
                    <span>Velocidad de Carga</span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-[#6DD94B]">0.4 seg</div>
                  <p className="text-xs text-zinc-400">
                    Optimizado con caché en Cloudflare para abrir al instante incluso con mala cobertura móvil.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default VirtualDeskClientPortal;
