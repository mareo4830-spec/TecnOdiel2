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
 * PORTAL DE CLIENTES (ESTÉTICA 100% TECNODIEL LANDING)
 * Paleta idéntica a la nueva landing:
 * - Fondo grafito puro: #121212
 * - Paneles y tarjetas: #181818 con border-white/10
 * - Acentos de marca: Verde neón #6DD94B y Verde oscuro #0D844A
 * - Botones redondeados tipo píldora, tipografía limpia y cercana
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
  
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'chat' | 'services' | 'stats'
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Mario (TecnOdiel)',
      text: `¡Hola ${businessName}! Ya tenemos tu espacio web conectado con la plantilla elegida.`,
      time: '10:00',
      isAgency: true
    },
    {
      id: 2,
      sender: 'Mario (TecnOdiel)',
      text: 'Cualquier plato, precio, foto u horario que quieras retocar, dínoslo por este chat y Dani o yo te lo dejamos listo en el momento.',
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
    }, 1000);
  };

  const handleQuickQuestion = (text) => {
    setInputMessage(text);
  };

  // URL de la web pública
  const liveUrl = isClinic ? `#/c/${slug}` : `#/r/${slug}`;

  return (
    <div className="min-h-screen bg-[#121212] text-zinc-100 flex flex-col lg:flex-row font-['Montserrat',Inter,sans-serif] selection:bg-[#6DD94B] selection:text-black">
      {/* ── BARRA LATERAL (ESTÉTICA TECNODIEL) ── */}
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
                Portal Activo
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

        {/* Navegación del Portal con acentos en verde TecnOdiel */}
        <nav className="p-3 space-y-1.5 flex-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#6DD94B]/15 text-[#6DD94B] border-l-2 border-[#6DD94B]'
                : 'text-zinc-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Mi Web & Resumen</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-[#6DD94B]/15 text-[#6DD94B] border-l-2 border-[#6DD94B]'
                : 'text-zinc-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <MessagesSquare className="w-4 h-4 text-[#6DD94B]" />
            <span className="flex-1 text-left">Hablar con Nosotros</span>
            <span className="w-2 h-2 rounded-full bg-[#6DD94B] animate-ping" />
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'services'
                ? 'bg-[#6DD94B]/15 text-[#6DD94B] border-l-2 border-[#6DD94B]'
                : 'text-zinc-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Mis Servicios ({selectedServices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'stats'
                ? 'bg-[#6DD94B]/15 text-[#6DD94B] border-l-2 border-[#6DD94B]'
                : 'text-zinc-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Visitas & Actividad</span>
          </button>
        </nav>

        {/* Tarjeta de Asistencia Directa TecnOdiel */}
        <div className="p-4 border-t border-white/10 bg-[#181818] m-3 rounded-2xl space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6DD94B]" />
            <span className="text-xs font-extrabold text-white">Equipo TecnOdiel</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Mario y Dani te atienden sin esperas. Escríbenos por el chat o directo al WhatsApp.
          </p>
          <a
            href="https://wa.me/34600000000?text=Hola%20Mario,%20soy%20de%20mi%20portal%20TecnOdiel"
            target="_blank"
            rel="noreferrer"
            className="w-full bg-[#0D844A] hover:bg-[#09663a] text-white text-xs font-bold py-2.5 rounded-full flex items-center justify-center gap-2 transition shadow-md shadow-[#0D844A]/20"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp Directo
          </a>
        </div>

        {/* Pie del Sidebar */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2 truncate">
            <User className="w-4 h-4 text-zinc-500 shrink-0" />
            <span className="truncate">{tenantData.phone || 'Cliente Verificado'}</span>
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

      {/* ── CONTENIDO PRINCIPAL ── */}
      <main className="flex-1 p-5 sm:p-8 md:p-10 overflow-y-auto">
        {/* SECCIÓN 1: MI NEGOCIO & RESUMEN */}
        {activeTab === 'overview' && (
          <div className="max-w-[1100px] mx-auto space-y-8 animate-fadeIn">
            {/* Cabecera */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    {businessName}
                  </h1>
                  <span className="text-[11px] font-black uppercase tracking-wider bg-[#6DD94B]/15 text-[#6DD94B] border border-[#6DD94B]/30 px-3 py-1 rounded-full">
                    Online & Activo
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Tu plataforma web personalizada con dominio, código optimizado y 0% de comisiones.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-[#6DD94B] hover:bg-white text-black text-xs font-black px-6 py-3 flex items-center gap-2 transition shadow-lg shadow-[#6DD94B]/20 cursor-pointer"
                >
                  <Globe className="w-4 h-4" />
                  Ver Mi Web en Vivo
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Banner de llamada al chat */}
            <div className="bg-gradient-to-r from-[#181818] via-[#1c1c1c] to-[#181818] border border-white/10 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-2xl">
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#6DD94B]" />
                  ¿Quieres cambiar algún plato, precio, foto u horario?
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300">
                  Dínoslo por el chat y Mario o Dani te lo dejamos listo en unos minutos sin complicaciones.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('chat')}
                className="rounded-full bg-[#6DD94B] hover:bg-white text-black text-xs font-black px-6 py-3 flex items-center gap-2 shrink-0 transition shadow-lg shadow-[#6DD94B]/20 cursor-pointer"
              >
                <MessagesSquare className="w-4 h-4" />
                Abrir Chat de Cambios
              </button>
            </div>

            {/* 3 Métricas Clave */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-[#181818] border border-white/10 rounded-2xl p-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Visitas estimadas
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white flex items-baseline gap-2">
                  <span>1.420</span>
                  <span className="text-xs text-[#6DD94B] font-bold">+24%</span>
                </div>
                <span className="text-xs text-zinc-500 mt-2 block">
                  Clientes que han abierto tu carta o web
                </span>
              </div>

              <div className="bg-[#181818] border border-white/10 rounded-2xl p-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  {isClinic ? 'Citas solicitadas' : 'Peticiones / Reservas'}
                </span>
                <div className="text-3xl sm:text-4xl font-black text-[#6DD94B]">
                  38
                </div>
                <span className="text-xs text-zinc-500 mt-2 block">
                  Recibidas directamente en tu teléfono
                </span>
              </div>

              <div className="bg-[#181818] border border-white/10 rounded-2xl p-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Estilo de Plantilla
                </span>
                <div className="text-base sm:text-lg font-black text-white truncate">
                  {templateName}
                </div>
                <span className="text-xs text-[#6DD94B] mt-2 block font-semibold">
                  0% comisiones • 100% para ti
                </span>
              </div>
            </div>

            {/* Ficha del Negocio */}
            <div className="bg-[#181818] border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#6DD94B]">
                Ficha de tu Negocio
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-zinc-500 block text-[11px]">Teléfono / WhatsApp</span>
                  <span className="font-semibold text-white">{tenantData.phone || '+34 600 000 000'}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[11px]">Email de contacto</span>
                  <span className="font-semibold text-white">{tenantData.email || 'contacto@negocio.es'}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[11px]">Enlace para tus clientes</span>
                  <span className="font-semibold text-[#6DD94B] font-mono">tecnodiel.es/{slug}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[11px]">Clave de acceso cliente</span>
                  <span className="font-mono bg-black/40 px-2 py-0.5 rounded text-[#6DD94B] text-[11px] border border-white/10">
                    {tenantData.client_access_key || 'TO-VERIFICADO'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN 2: HABLAR CON NOSOTROS (CHAT DIRECTO CON MARIO & DANI) */}
        {activeTab === 'chat' && (
          <div className="max-w-[900px] mx-auto space-y-5 animate-fadeIn">
            {/* Header del chat */}
            <div className="border-b border-white/10 pb-4 flex flex-wrap justify-between items-center gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <MessagesSquare className="w-5 h-5 text-[#6DD94B]" />
                  Chat Directo con Mario y Dani
                </h1>
                <p className="text-xs text-zinc-400">
                  Dinos qué necesitas cambiar en tu web y lo implementamos sin que tú tengas que tocar nada.
                </p>
              </div>
              <div className="text-xs text-[#6DD94B] flex items-center gap-2 bg-[#6DD94B]/10 border border-[#6DD94B]/30 px-3 py-1.5 rounded-full font-bold">
                <span className="w-2 h-2 rounded-full bg-[#6DD94B] animate-pulse" />
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
                          : 'bg-[#0D844A] text-white rounded-tr-none'
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
                  placeholder="Escribe aquí tu petición a Mario y Dani..."
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
          </div>
        )}

        {/* SECCIÓN 3: MIS SERVICIOS */}
        {activeTab === 'services' && (
          <div className="max-w-[1000px] mx-auto space-y-6 animate-fadeIn">
            <div className="border-b border-white/10 pb-4">
              <h1 className="text-2xl sm:text-3xl font-black text-white">Servicios Incluidos en tu Plan</h1>
              <p className="text-xs text-zinc-400">
                Todo lo que está activado y en funcionamiento para tu negocio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedServices.map((srv, idx) => (
                <div
                  key={idx}
                  className="bg-[#181818] border border-white/10 rounded-2xl p-5 flex items-start gap-4"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#6DD94B]/15 border border-[#6DD94B]/30 flex items-center justify-center text-[#6DD94B] shrink-0">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{srv}</h4>
                    <p className="text-xs text-zinc-400 mt-1">
                      Operativo y disponible 24/7 sin límites de consultas ni comisiones por uso.
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#181818] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">¿Te gustaría añadir más funciones?</h4>
                <p className="text-xs text-zinc-400">
                  Podemos activar cobros con Bizum, más idiomas o avisos automáticos en cualquier momento.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('chat')}
                className="rounded-full bg-[#6DD94B] hover:bg-white text-black text-xs font-black px-6 py-3 transition cursor-pointer shrink-0"
              >
                Pedir Nueva Función
              </button>
            </div>
          </div>
        )}

        {/* SECCIÓN 4: ESTADÍSTICAS & ACTIVIDAD */}
        {activeTab === 'stats' && (
          <div className="max-w-[1000px] mx-auto space-y-6 animate-fadeIn">
            <div className="border-b border-white/10 pb-4">
              <h1 className="text-2xl sm:text-3xl font-black text-white">Actividad y Estadísticas</h1>
              <p className="text-xs text-zinc-400">
                Resumen de tráfico y consultas recibidas en tu web.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="bg-[#181818] border border-white/10 rounded-2xl p-6">
                <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider block mb-2">
                  Visitas desde Móviles
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white">92%</div>
                <p className="text-xs text-zinc-400 mt-2">
                  La inmensa mayoría de tus clientes te visita desde el teléfono mientras está en la calle o en tu local.
                </p>
              </div>

              <div className="bg-[#181818] border border-white/10 rounded-2xl p-6">
                <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider block mb-2">
                  Velocidad de Carga
                </span>
                <div className="text-3xl sm:text-4xl font-black text-[#6DD94B]">0.4 segundos</div>
                <p className="text-xs text-zinc-400 mt-2">
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
