import React, { useState, useEffect, useRef } from 'react';
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
  Instagram,
  Check,
  AlertCircle,
  HelpCircle,
  Stethoscope
} from 'lucide-react';

/**
 * PORTAL DE CLIENTES (RÉPLICA VIRTUALDESK-MAIN)
 * Estética idéntica a VirtualDesk (sidebar oscuro, bg-gray-950, acentos índigo y esmeralda)
 * Contiene únicamente los datos necesarios y canal de chat directo con Mario & Dani (TecnOdiel).
 */
export const VirtualDeskClientPortal = ({
  tenantData = {},
  onSwitchToAdminView,
  onLogout
}) => {
  const businessName = tenantData.name || tenantData.business_name || 'Mi Negocio';
  const slug = tenantData.slug || 'mi-negocio';
  const isClinic = tenantData.collegiate_number || tenantData.category === 'dental' || tenantData.category === 'policlinica' || (tenantData.selected_modules || []).some(m => typeof m === 'string' && m.toLowerCase().includes('cita'));
  
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'chat' | 'services' | 'stats'
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Mario (TecnOdiel)',
      text: `¡Hola ${businessName}! Te damos la bienvenida a tu portal privado. Ya tenemos tu web configurada con la plantilla seleccionada.`,
      time: '10:00',
      isAgency: true
    },
    {
      id: 2,
      sender: 'Mario (TecnOdiel)',
      text: 'Cualquier cosa que quieras cambiar —platos, precios, fotos, horarios o textos— dínoslo por este chat y te lo actualizamos en el momento.',
      time: '10:01',
      isAgency: true
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const chatBottomRef = useRef(null);

  const selectedServices = tenantData.selected_modules || (isClinic 
    ? ['Cita previa online 24/7', 'Recordatorios WhatsApp', 'Página web médica completa']
    : ['Carta digital QR', 'Reserva de mesas', 'Página web completa']);

  const templateName = tenantData.template_id || (isClinic ? 'Limpia & Profesional' : 'Visual & Vídeo');

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
      let replyText = '¡Oído! Dani y yo nos ponemos con ello ahora mismo y te avisamos cuando quede publicado.';
      const lower = userText.toLowerCase();
      if (lower.includes('precio') || lower.includes('plato') || lower.includes('carta') || lower.includes('menu')) {
        replyText = '¡Recibido! Actualizamos ese detalle en tu carta digital en unos minutos.';
      } else if (lower.includes('foto') || lower.includes('imagen')) {
        replyText = 'Perfecto, podemos optimizar tus fotos y colocarlas en el encabezado de tu web hoy mismo.';
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
    }, 1100);
  };

  const handleQuickQuestion = (text) => {
    setInputMessage(text);
  };

  // URL de la web pública
  const liveUrl = isClinic ? `#/c/${slug}` : `#/r/${slug}`;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col lg:flex-row font-sans selection:bg-indigo-600 selection:text-white">
      {/* ── BARRA LATERAL (IDÉNTICA A VIRTUALDESK) ── */}
      <aside className="w-full lg:w-64 border-r border-gray-800 bg-gray-950 flex flex-col shrink-0">
        {/* Cabecera Sidebar */}
        <div className="h-16 px-5 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white shadow-md shadow-emerald-600/30">
              {businessName.substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-xs tracking-tight text-white block truncate">
                {businessName}
              </span>
              <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Portal Activo
              </span>
            </div>
          </div>

          {onSwitchToAdminView && (
            <button
              onClick={onSwitchToAdminView}
              title="Acceso administrativo"
              className="text-[10px] bg-gray-900 hover:bg-gray-800 text-indigo-400 border border-indigo-900/60 px-2 py-1 rounded transition"
            >
              Admin ➔
            </button>
          )}
        </div>

        {/* Navegación del Portal */}
        <nav className="p-3 space-y-1.5 flex-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-indigo-600/15 text-indigo-400 font-semibold border-l-2 border-indigo-500'
                : 'text-gray-400 hover:bg-gray-900 hover:text-gray-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Mi Web & Resumen</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'chat'
                ? 'bg-indigo-600/15 text-indigo-400 font-semibold border-l-2 border-indigo-500'
                : 'text-gray-400 hover:bg-gray-900 hover:text-gray-100'
            }`}
          >
            <MessagesSquare className="w-4 h-4 text-emerald-400" />
            <span className="flex-1 text-left">Hablar con Nosotros</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'services'
                ? 'bg-indigo-600/15 text-indigo-400 font-semibold border-l-2 border-indigo-500'
                : 'text-gray-400 hover:bg-gray-900 hover:text-gray-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Mis Servicios ({selectedServices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'stats'
                ? 'bg-indigo-600/15 text-indigo-400 font-semibold border-l-2 border-indigo-500'
                : 'text-gray-400 hover:bg-gray-900 hover:text-gray-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Visitas & Actividad</span>
          </button>
        </nav>

        {/* Tarjeta de Asistencia Directa */}
        <div className="p-3.5 border-t border-gray-800 bg-gray-900/40 m-3 rounded-xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-bold text-white">Equipo TecnOdiel</span>
          </div>
          <p className="text-[10px] text-gray-400 leading-relaxed">
            Mario y Dani te atienden sin esperas. Escríbenos por el chat o directo al WhatsApp.
          </p>
          <a
            href="https://wa.me/34600000000?text=Hola%20Mario,%20soy%20de%20mi%20portal%20TecnOdiel"
            target="_blank"
            rel="noreferrer"
            className="w-full bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp Directo
          </a>
        </div>

        {/* Pie del Sidebar: Usuario */}
        <div className="p-3 border-t border-gray-800 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2 truncate">
            <User className="w-4 h-4 text-gray-500 shrink-0" />
            <span className="truncate">{tenantData.phone || 'Cliente Verificado'}</span>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem('tecnodiel_auth_session');
              window.location.hash = '#/';
              window.location.reload();
            }}
            title="Cerrar sesión"
            className="hover:text-red-400 p-1 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        {/* SECCIÓN 1: MI NEGOCIO & RESUMEN */}
        {activeTab === 'overview' && (
          <div className="max-w-[1100px] mx-auto space-y-8 animate-fadeIn">
            {/* Cabecera con botón de ver web */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {businessName}
                  </h1>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    Activo & Online
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Tu plataforma web personalizada con dominio y diseño optimizado para móvil.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition shadow-lg shadow-indigo-600/20"
                >
                  <Globe className="w-4 h-4" />
                  Ver Mi Web en Vivo
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Banner de llamada al chat */}
            <div className="bg-gradient-to-r from-indigo-950/60 via-gray-900 to-emerald-950/40 border border-indigo-900/40 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  ¿Quieres cambiar algún plato, precio, foto o texto?
                </h3>
                <p className="text-xs text-gray-300">
                  No te preocupes por paneles difíciles. Escríbenos por el chat y Mario o Dani te lo dejan listo en unos minutos.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('chat')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-3 rounded-xl flex items-center gap-2 shrink-0 transition shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                <MessagesSquare className="w-4 h-4" />
                Abrir Chat de Cambios
              </button>
            </div>

            {/* 3 Métricas Clave */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5">
                <span className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                  Visitas estimadas
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-white flex items-baseline gap-2">
                  <span>1.420</span>
                  <span className="text-xs text-emerald-400 font-mono font-bold">+24%</span>
                </div>
                <span className="text-[11px] text-gray-500 mt-2 block">
                  Clientes que han abierto tu carta o web
                </span>
              </div>

              <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5">
                <span className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                  {isClinic ? 'Citas solicitadas' : 'Peticiones / Reservas'}
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">
                  38
                </div>
                <span className="text-[11px] text-gray-500 mt-2 block">
                  Recibidas directamente en tu teléfono
                </span>
              </div>

              <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5">
                <span className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                  Estilo de Plantilla
                </span>
                <div className="text-base sm:text-lg font-bold text-emerald-400 truncate">
                  {templateName}
                </div>
                <span className="text-[11px] text-gray-500 mt-2 block">
                  0% comisiones • 100% para ti
                </span>
              </div>
            </div>

            {/* Resumen de los datos del cliente */}
            <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">
                Ficha de tu Negocio
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-gray-500 block text-[11px]">Teléfono / WhatsApp</span>
                  <span className="font-semibold text-white">{tenantData.phone || '+34 600 000 000'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[11px]">Email de contacto</span>
                  <span className="font-semibold text-white">{tenantData.email || 'contacto@negocio.es'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[11px]">Enlace para tus clientes</span>
                  <span className="font-semibold text-indigo-400 font-mono">tecnodiel.es/{slug}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[11px]">Clave de acceso cliente</span>
                  <span className="font-mono bg-gray-800 px-2 py-0.5 rounded text-emerald-400 text-[11px]">
                    {tenantData.client_access_key || 'TO-VERIFICADO'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN 2: HABLAR CON NOSOTROS (CHAT DIRECTO CON MARIO & DANI) */}
        {activeTab === 'chat' && (
          <div className="max-w-[900px] mx-auto space-y-4 animate-fadeIn">
            {/* Header del chat */}
            <div className="border-b border-gray-800 pb-4 flex flex-wrap justify-between items-center gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <MessagesSquare className="w-5 h-5 text-emerald-400" />
                  Chat Directo con Mario y Dani
                </h1>
                <p className="text-xs text-gray-400">
                  Dinos qué necesitas cambiar en tu web y lo implementamos sin que tú tengas que tocar nada.
                </p>
              </div>
              <div className="text-xs text-emerald-400 flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/20 px-3 py-1.5 rounded-full font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Mario & Dani Conectados
              </div>
            </div>

            {/* Atajos de mensajes rápidos */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                'Quiero cambiar los precios de la carta',
                'Quiero añadir fotos nuevas a la web',
                'Quiero actualizar el horario de apertura',
                'Quiero poner un anuncio o aviso especial'
              ].map((shortcut) => (
                <button
                  key={shortcut}
                  type="button"
                  onClick={() => handleQuickQuestion(shortcut)}
                  className="text-[11px] bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 hover:border-gray-700 px-3 py-1.5 rounded-lg transition cursor-pointer"
                >
                  {shortcut}
                </button>
              ))}
            </div>

            {/* Contenedor de mensajes */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl flex flex-col h-[500px] overflow-hidden shadow-2xl">
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.isAgency ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[10px] text-gray-500 font-mono">
                      <span>{m.sender}</span>
                      <span>•</span>
                      <span>{m.time}</span>
                    </div>
                    <div
                      className={`max-w-md px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        m.isAgency
                          ? 'bg-gray-800/90 text-gray-100 rounded-tl-none border border-gray-700/60 shadow-md'
                          : 'bg-indigo-600 text-white rounded-tr-none shadow-md'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                <div ref={chatBottomRef} />
              </div>

              {/* Input para redactar */}
              <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-gray-800 bg-gray-950 flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Escribe aquí tu petición a Mario y Dani..."
                  className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-gray-500 outline-none focus:border-indigo-500 transition"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 sm:px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Enviar</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* SECCIÓN 3: MIS SERVICIOS */}
        {activeTab === 'services' && (
          <div className="max-w-[1000px] mx-auto space-y-6 animate-fadeIn">
            <div className="border-b border-gray-800 pb-4">
              <h1 className="text-2xl font-bold text-white">Servicios Incluidos en tu Plan</h1>
              <p className="text-xs text-gray-400">
                Todo lo que está activado y en funcionamiento para tu negocio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedServices.map((srv, idx) => (
                <div
                  key={idx}
                  className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 flex items-start gap-3.5"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{srv}</h4>
                    <p className="text-xs text-gray-400 mt-1">
                      Operativo y disponible 24/7 sin límites de consultas ni comisiones por uso.
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">¿Te gustaría añadir más funciones?</h4>
                <p className="text-xs text-gray-400">
                  Podemos activar cobros con Bizum, más idiomas o avisos automáticos en cualquier momento.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('chat')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shrink-0"
              >
                Pedir Nueva Función
              </button>
            </div>
          </div>
        )}

        {/* SECCIÓN 4: ESTADÍSTICAS & ACTIVIDAD */}
        {activeTab === 'stats' && (
          <div className="max-w-[1000px] mx-auto space-y-6 animate-fadeIn">
            <div className="border-b border-gray-800 pb-4">
              <h1 className="text-2xl font-bold text-white">Actividad y Estadísticas</h1>
              <p className="text-xs text-gray-400">
                Resumen de tráfico y consultas recibidas en tu web.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-2">
                  Visitas desde Móviles
                </span>
                <div className="text-3xl font-extrabold text-white">92%</div>
                <p className="text-xs text-gray-500 mt-2">
                  La inmensa mayoría de tus clientes te visita desde el teléfono mientras está en la calle o en tu local.
                </p>
              </div>

              <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-2">
                  Velocidad de Carga
                </span>
                <div className="text-3xl font-extrabold text-emerald-400">0.4 segundos</div>
                <p className="text-xs text-gray-500 mt-2">
                  Optimizado al máximo para que abra al instante, incluso con mala cobertura.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default VirtualDeskClientPortal;
