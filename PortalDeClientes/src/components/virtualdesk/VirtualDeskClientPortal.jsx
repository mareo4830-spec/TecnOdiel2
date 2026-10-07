import React, { useState } from 'react';
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
  ArrowUpRight
} from 'lucide-react';

/**
 * PORTAL DE CLIENTES SIMPLIFICADO (ESTÉTICA VIRTUALDESK)
 * "solo con los datos necesarios, poder hablar con nosotros, etc."
 * 
 * Módulos esenciales:
 * 1. Estado y Acceso Directo a su Web (Plantilla Activa)
 * 2. Métricas Clave (Visitas, Reservas, Impacto)
 * 3. Mi Negocio (Horarios, Ubicación y Carta/Servicios)
 * 4. "Hablar con Nosotros" (Canal de chat directo con Mario/TecnOdiel)
 */
export const VirtualDeskClientPortal = ({
  tenantData = {
    name: 'Noir & Atelier',
    slug: 'noir-atelier',
    platform: 'hosteleria',
    template: 'the-awwwards-cinematic',
    city: 'Madrid',
    visits: '3.840',
    bookings: '48',
    status: 'Publicado y Optimizado'
  },
  onSwitchToAdminView
}) => {
  const [activeSection, setActiveSection] = useState('overview'); // 'overview' | 'chat' | 'services'
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Mario (TecnOdiel)',
      text: '¡Hola! Te damos la bienvenida a tu portal. ¿Necesitas ajustar algo en tu carta o en la plantilla?',
      time: '10:00',
      isAgency: true
    },
    {
      id: 2,
      sender: 'Tú',
      text: 'Hola Mario, la web cinemática ha quedado impresionante. Queríamos cambiar dos platos del menú de otoño.',
      time: '11:15',
      isAgency: false
    },
    {
      id: 3,
      sender: 'Mario (TecnOdiel)',
      text: 'Perfecto, indícanos aquí mismo los nombres y precios o déjalos en notas y te los actualizamos en menos de 1 hora.',
      time: '11:20',
      isAgency: true
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'Tú',
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAgency: false
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    // Respuesta simulada de soporte del equipo TecnOdiel
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'Mario (TecnOdiel)',
          text: 'Mensaje recibido. Lo revisamos ahora mismo y te confirmamos.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAgency: true
        }
      ]);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col lg:flex-row font-sans selection:bg-indigo-600 selection:text-white">
      {/* ── BARRA LATERAL DEL CLIENTE (VIRTUALDESK STYLE) ── */}
      <aside className="w-full lg:w-64 border-r border-gray-800 bg-gray-950 flex flex-col shrink-0">
        <div className="h-16 px-5 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white shadow-md shadow-emerald-600/30">
              CL
            </div>
            <div>
              <span className="font-semibold text-xs tracking-tight text-white block">Portal del Cliente</span>
              <span className="text-[10px] text-gray-400 font-mono truncate max-w-[120px] block">{tenantData.name}</span>
            </div>
          </div>

          {onSwitchToAdminView && (
            <button
              onClick={onSwitchToAdminView}
              className="text-[10px] bg-gray-900 hover:bg-gray-800 text-indigo-400 border border-indigo-900/60 px-2 py-1 rounded"
            >
              Admin ➔
            </button>
          )}
        </div>

        {/* Menú Simplificado */}
        <nav className="p-3 space-y-1.5 flex-1">
          <button
            onClick={() => setActiveSection('overview')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
              activeSection === 'overview'
                ? 'bg-indigo-600/15 text-indigo-400 font-semibold border-l-2 border-indigo-500'
                : 'text-gray-400 hover:bg-gray-900 hover:text-gray-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Mi Negocio & Métricas</span>
          </button>

          <button
            onClick={() => setActiveSection('chat')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
              activeSection === 'chat'
                ? 'bg-indigo-600/15 text-indigo-400 font-semibold border-l-2 border-indigo-500'
                : 'text-gray-400 hover:bg-gray-900 hover:text-gray-100'
            }`}
          >
            <MessagesSquare className="w-4 h-4 text-emerald-400" />
            <span className="flex-1 text-left">Hablar con Nosotros</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <button
            onClick={() => setActiveSection('services')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
              activeSection === 'services'
                ? 'bg-indigo-600/15 text-indigo-400 font-semibold border-l-2 border-indigo-500'
                : 'text-gray-400 hover:bg-gray-900 hover:text-gray-100'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Carta & Servicios</span>
          </button>
        </nav>

        {/* Estado del Soporte */}
        <div className="p-4 border-t border-gray-800 bg-gray-900/40 m-3 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-bold text-white">Soporte TecnOdiel Directo</span>
          </div>
          <p className="text-[10px] text-gray-400">
            Mario y el equipo responden tus consultas de forma prioritaria.
          </p>
        </div>
      </aside>

      {/* ── CONTENIDO DEL CLIENTE ── */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {/* SECCIÓN 1: MI NEGOCIO & MÉTRICAS (SOLO LO NECESARIO) */}
        {activeSection === 'overview' && (
          <div className="max-w-[1200px] mx-auto space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-5">
              <div>
                <h1 className="text-2xl font-bold text-white">{tenantData.name}</h1>
                <p className="text-xs text-gray-400 mt-1">
                  Tu plataforma web activa con arquitectura multi-tenant de alto rendimiento.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="#/cinematic"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" /> Ver Mi Web en Vivo <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Tarjetas de Métricas Esenciales */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
                <span className="text-[10px] font-mono uppercase text-gray-400 block mb-2">Visitas este mes</span>
                <div className="text-3xl font-bold text-white flex items-baseline gap-2">
                  <span>{tenantData.visits}</span>
                  <span className="text-xs text-emerald-400 font-mono">+18%</span>
                </div>
                <span className="text-[11px] text-gray-500 mt-2 block">Tráfico verificado en Vercel</span>
              </div>

              <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
                <span className="text-[10px] font-mono uppercase text-gray-400 block mb-2">Pases / Reservas Solicitadas</span>
                <div className="text-3xl font-bold text-indigo-400">
                  {tenantData.bookings}
                </div>
                <span className="text-[11px] text-gray-500 mt-2 block">Formularios completados con éxito</span>
              </div>

              <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
                <span className="text-[10px] font-mono uppercase text-gray-400 block mb-2">Plantilla & Tecnología</span>
                <div className="text-lg font-bold text-emerald-400">
                  {tenantData.template?.toUpperCase()}
                </div>
                <span className="text-[11px] text-gray-500 mt-2 block">DOM y CSS 100% aislados</span>
              </div>
            </div>

            {/* Acceso Rápido a Hablar con Nosotros */}
            <div className="bg-gradient-to-r from-indigo-950/70 to-gray-900 border border-indigo-900/50 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-base font-bold text-white mb-1">¿Necesitas cambiar un plato, horario o foto?</h3>
                <p className="text-xs text-gray-300">
                  Habla directamente con nuestros ingenieros sin intermediarios ni esperas.
                </p>
              </div>
              <button
                onClick={() => setActiveSection('chat')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-5 py-3 rounded-xl flex items-center gap-2 shrink-0 shadow-lg shadow-emerald-600/20"
              >
                <MessagesSquare className="w-4 h-4" /> Hablar con Nosotros Ahora
              </button>
            </div>
          </div>
        )}

        {/* SECCIÓN 2: HABLAR CON NOSOTROS (CHAT DIRECTO CON EL EQUIPO) */}
        {activeSection === 'chat' && (
          <div className="max-w-[1000px] mx-auto space-y-6">
            <div className="border-b border-gray-800 pb-5 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-white">Hablar con Nosotros</h1>
                <p className="text-xs text-gray-400">Canal directo con el equipo técnico de TecnOdiel.</p>
              </div>
              <div className="text-xs text-emerald-400 flex items-center gap-1.5 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Equipo Disponible
              </div>
            </div>

            {/* Caja de Conversación */}
            <div className="bg-gray-900/70 border border-gray-800 rounded-2xl flex flex-col h-[520px] overflow-hidden shadow-2xl">
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.isAgency ? 'items-start' : 'items-end'}`}
                  >
                    <span className="text-[10px] text-gray-500 font-mono mb-1">{m.sender} · {m.time}</span>
                    <div
                      className={`max-w-md px-4 py-3 rounded-2xl text-xs ${
                        m.isAgency
                          ? 'bg-gray-800 text-gray-100 rounded-tl-none border border-gray-700'
                          : 'bg-indigo-600 text-white rounded-tr-none'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input de Mensaje */}
              <form onSubmit={handleSend} className="p-4 border-t border-gray-800 bg-gray-950 flex gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Escribe tu mensaje para Mario o el equipo..."
                  className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl text-xs font-semibold flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Enviar
                </button>
              </form>
            </div>
          </div>
        )}

        {/* SECCIÓN 3: CARTA & SERVICIOS */}
        {activeSection === 'services' && (
          <div className="max-w-[1100px] mx-auto space-y-6">
            <div className="border-b border-gray-800 pb-5">
              <h1 className="text-2xl font-bold text-white">Carta & Menú Digital</h1>
              <p className="text-xs text-gray-400">Elementos publicados actualmente en tu web.</p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 space-y-4">
              <p className="text-xs text-gray-300">
                Tus platos y menús degustación están sincronizados con la plantilla activa.
                Para añadir un plato nuevo o modificar un precio, puedes escribirnos directamente por el chat.
              </p>

              <button
                onClick={() => setActiveSection('chat')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2"
              >
                <MessagesSquare className="w-3.5 h-3.5" /> Solicitar Actualización de Carta
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default VirtualDeskClientPortal;
