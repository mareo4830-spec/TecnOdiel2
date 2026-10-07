import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  SquareKanban, 
  Clock, 
  Handshake, 
  MessagesSquare, 
  Settings, 
  Building2, 
  Activity, 
  Plug, 
  Send, 
  Plus, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Users,
  Search,
  Bell,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { MOCK_TENANTS } from '../../../../src/multi-tenant/mockTenants.js';

/**
 * PORTAL DE ADMINISTRACIÓN COMPLETO (RÉPLICA DE VIRTUALDESK-MAIN)
 * Panel interno de la agencia TecnOdiel:
 * - Panel (Dashboard con widgets)
 * - Proyectos & Tenants (vinculados a las 12 plantillas Multi-Tenant)
 * - Kanban (Pipeline de trabajos)
 * - Horas y Reparto (Calculadora 65/20/10/5)
 * - CRM (Pipeline de leads de Contactado a Cerrado)
 * - Chats (WhatsApp Business + Chat Interno del Equipo)
 * - Ajustes de la agencia
 */
export const VirtualDeskAdminApp = ({ onSwitchToClientView }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [teamMembers] = useState([
    { id: 'mario', name: 'Mario', role: 'Full-Stack Architect', avatar: 'M', active: true },
    { id: 'dani', name: 'Dani', role: 'UI/UX & Creative', avatar: 'D', active: true },
    { id: 'javier', name: 'Javier', role: 'Operations & Business', avatar: 'J', active: false }
  ]);

  const [activeChatTab, setActiveChatTab] = useState('clients');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'Noir & Atelier (Cliente)', text: 'Hola Mario, ¿podemos actualizar el menú del fin de semana?', time: '14:22', isClient: true },
    { id: 2, sender: 'Mario (TecnOdiel)', text: '¡Por supuesto! Ya tenéis disponible el editor en vuestro portal de cliente.', time: '14:25', isClient: false }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const [kanbanTasks, setKanbanTasks] = useState([
    { id: 1, title: 'Revisión SEO Noir & Atelier', col: 'done', tag: 'Hostelería' },
    { id: 2, title: 'Despliegue Smash & Destroy en Vercel', col: 'progress', tag: 'Hostelería' },
    { id: 3, title: 'Configurar agenda Swiss Dental', col: 'todo', tag: 'Clínicas' },
    { id: 4, title: 'Sesión de fotos Aura Gold', col: 'progress', tag: 'Clínicas' },
    { id: 5, title: 'Reunión lead Dr. Morales (Clínica Sevilla)', col: 'todo', tag: 'CRM' }
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: 'Mario (TecnOdiel)',
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isClient: false
      }
    ]);
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col lg:flex-row font-sans selection:bg-indigo-600 selection:text-white">
      {/* ── BARRA LATERAL (SIDEBAR VIRTUALDESK) ── */}
      <aside className="w-full lg:w-60 border-r border-gray-800 bg-gray-950 flex flex-col shrink-0">
        <div className="h-16 px-5 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-600/30">
              VD
            </div>
            <div>
              <span className="font-semibold text-sm tracking-tight text-white block">TecnOdiel</span>
              <span className="text-[10px] text-gray-400 font-mono">Oficina Virtual</span>
            </div>
          </div>

          {onSwitchToClientView && (
            <button
              onClick={onSwitchToClientView}
              className="text-[11px] bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-700 px-2.5 py-1 rounded-md transition-colors"
            >
              Ver Cliente ➔
            </button>
          )}
        </div>

        {/* Navegación Principal */}
        <nav className="p-3 space-y-1 flex-1">
          {[
            { id: 'dashboard', label: 'Panel', icon: LayoutDashboard },
            { id: 'projects', label: 'Proyectos & Tenants', icon: FolderKanban },
            { id: 'kanban', label: 'Kanban', icon: SquareKanban },
            { id: 'hours', label: 'Horas y Reparto', icon: Clock },
            { id: 'crm', label: 'CRM de Clientes', icon: Handshake },
            { id: 'chats', label: 'Chats & Mensajes', icon: MessagesSquare, badge: chatMessages.length },
            { id: 'settings', label: 'Ajustes', icon: Settings }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 font-semibold border-l-2 border-indigo-500'
                    : 'text-gray-400 hover:bg-gray-900 hover:text-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Socio Activo */}
        <div className="p-3 border-t border-gray-800">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-900/70 border border-gray-800">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
              M
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-medium text-white block truncate">Mario (Socio)</span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                En línea
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {/* VISTA 1: DASHBOARD (PANEL) */}
        {activeTab === 'dashboard' && (
          <div className="max-w-[1500px] mx-auto space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-5">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">Panel General de la Agencia</h1>
                <p className="text-xs text-gray-400 mt-1">
                  Resumen en tiempo real de operaciones, tenants activos y comunicación con clientes.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-md flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Oficina Operativa (Huelva/Remoto)
                </span>
              </div>
            </div>

            {/* Grid de Widgets de VirtualDesk */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Widget 1: Kanban de Trabajos (Col 8) */}
              <div className="md:col-span-8 bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <SquareKanban className="w-4 h-4 text-indigo-400" />
                    <h2 className="text-sm font-semibold text-white">Trabajos en Curso</h2>
                  </div>
                  <button onClick={() => setActiveTab('kanban')} className="text-xs text-indigo-400 hover:text-indigo-300">
                    Ver tablero completo ➔
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {['todo', 'progress', 'done'].map((status) => {
                    const titles = { todo: 'Planeado', progress: 'En Progreso', done: 'Completado' };
                    const colors = { todo: 'border-yellow-500/30 text-yellow-400', progress: 'border-blue-500/30 text-blue-400', done: 'border-emerald-500/30 text-emerald-400' };
                    const filtered = kanbanTasks.filter((t) => t.col === status);
                    return (
                      <div key={status} className="bg-gray-950/80 border border-gray-800/80 rounded-xl p-3 space-y-2">
                        <div className={`text-[11px] font-bold uppercase tracking-wider pb-1 border-b ${colors[status]}`}>
                          {titles[status]} ({filtered.length})
                        </div>
                        {filtered.map((task) => (
                          <div key={task.id} className="bg-gray-900 p-2.5 rounded-lg border border-gray-800 text-xs text-gray-200">
                            <span className="text-[9px] text-gray-400 font-mono block mb-1 uppercase">[{task.tag}]</span>
                            {task.title}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Widget 2: Integraciones (Col 4) */}
              <div className="md:col-span-4 bg-gray-900/60 border border-gray-800 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Plug className="w-4 h-4 text-indigo-400" />
                    <h2 className="text-sm font-semibold text-white">Integraciones de Sistema</h2>
                  </div>

                  <div className="space-y-3">
                    {[
                      { name: 'Supabase Postgres & Auth', status: 'Conectado', ok: true },
                      { name: 'Vercel Preview Deployer', status: 'Operativo', ok: true },
                      { name: 'WhatsApp Business API', status: 'Sincronizado', ok: true },
                      { name: 'GitHub Multi-Repo CI/CD', status: '24 commits hoy', ok: true }
                    ].map((integ, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-950/60 border border-gray-800 text-xs">
                        <span className="text-gray-300 font-medium">{integ.name}</span>
                        <span className="text-emerald-400 text-[11px] flex items-center gap-1 font-mono">
                          <CheckCircle2 className="w-3 h-3" />
                          {integ.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-800/80 text-[11px] text-gray-400">
                  Todas las API keys seguras y activas en producción.
                </div>
              </div>

              {/* Widget 3: Tenants & Proyectos Activos (Col 6) */}
              <div className="md:col-span-6 bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-400" />
                    <h2 className="text-sm font-semibold text-white">Tenants Multi-Tenant (12 Diseñados)</h2>
                  </div>
                  <button onClick={() => setActiveTab('projects')} className="text-xs text-indigo-400 hover:text-indigo-300">
                    Gestionar todos ➔
                  </button>
                </div>

                <div className="space-y-2.5">
                  {MOCK_TENANTS.slice(0, 4).map((t) => (
                    <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-950 border border-gray-800">
                      <div>
                        <span className="text-xs font-bold text-white block">{t.name}</span>
                        <span className="text-[10px] text-indigo-400 font-mono uppercase">{t.platform} · {t.template}</span>
                      </div>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                        Online
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Widget 4: Reparto y Fondo Común (Col 6) */}
              <div className="md:col-span-6 bg-gray-900/60 border border-gray-800 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <h2 className="text-sm font-semibold text-white">Fondo Común y Horas de Hoy</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                      <span className="text-[10px] font-mono text-gray-400 block uppercase">Fondo de Reserva</span>
                      <span className="text-2xl font-bold text-emerald-400">1.840,00 €</span>
                      <span className="text-[10px] text-gray-500 block mt-1">Mínimo 300 € intacto</span>
                    </div>

                    <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                      <span className="text-[10px] font-mono text-gray-400 block uppercase">Horas Computadas Hoy</span>
                      <span className="text-2xl font-bold text-indigo-400">14.5 h</span>
                      <span className="text-[10px] text-gray-500 block mt-1">3 socios activos</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-300 space-y-1">
                    <p>• 65 % Reparto por horas verificadas con pushes a main</p>
                    <p>• 20 % Fondo de agencia · 10 % Cierre de venta · 5 % Auditoría técnica</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-800">
                  <button onClick={() => setActiveTab('hours')} className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
                    Abrir calculadora de reparto ➔
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VISTA 2: PROYECTOS & TENANTS */}
        {activeTab === 'projects' && (
          <div className="max-w-[1500px] mx-auto space-y-6">
            <div className="flex justify-between items-center border-b border-gray-800 pb-5">
              <div>
                <h1 className="text-2xl font-bold text-white">Catálogo de Proyectos & Tenants</h1>
                <p className="text-xs text-gray-400">Plataformas Hostelería y Clínicas con las 12 plantillas aisladas.</p>
              </div>
              <button
                onClick={() => alert('Abriendo asistente de nuevo tenant...')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" /> Nuevo Tenant
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_TENANTS.map((t) => (
                <div key={t.id} className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 flex flex-col justify-between hover:border-gray-700 transition-colors">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-white uppercase">{t.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                        {t.platform}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 block mb-3 font-mono">
                      Plantilla: {t.template}
                    </span>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {t.description || `Ubicación: ${t.city}. Totalmente configurado y funcional.`}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-800 flex justify-between items-center">
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Activo
                    </span>
                    <button
                      onClick={() => {
                        window.location.hash = `#/cinematic`;
                      }}
                      className="text-xs text-indigo-400 hover:text-white flex items-center gap-1"
                    >
                      Previsualizar <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISTA 3: KANBAN */}
        {activeTab === 'kanban' && (
          <div className="max-w-[1500px] mx-auto space-y-6">
            <div className="flex justify-between items-center border-b border-gray-800 pb-5">
              <div>
                <h1 className="text-2xl font-bold text-white">Tablero Kanban de la Agencia</h1>
                <p className="text-xs text-gray-400">Flujo de trabajo unificado entre Mario, Dani y Javier.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { key: 'todo', title: 'Por Hacer', color: 'border-yellow-500' },
                { key: 'progress', title: 'En Progreso', color: 'border-blue-500' },
                { key: 'done', title: 'Completado', color: 'border-emerald-500' }
              ].map((col) => (
                <div key={col.key} className="bg-gray-900/40 border border-gray-800 rounded-2xl p-4 space-y-3">
                  <div className={`text-xs font-bold uppercase tracking-wider text-white border-b-2 ${col.color} pb-2`}>
                    {col.title}
                  </div>
                  {kanbanTasks
                    .filter((t) => t.col === col.key)
                    .map((task) => (
                      <div key={task.id} className="bg-gray-900 border border-gray-800 rounded-xl p-3.5 space-y-2">
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-300">
                          {task.tag}
                        </span>
                        <h4 className="text-xs font-medium text-white">{task.title}</h4>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISTA 4: HORAS Y REPARTO */}
        {activeTab === 'hours' && (
          <div className="max-w-[1200px] mx-auto space-y-6">
            <div className="border-b border-gray-800 pb-5">
              <h1 className="text-2xl font-bold text-white">Horas Verificadas & Reparto</h1>
              <p className="text-xs text-gray-400">Cálculo transparente de ingresos por proyecto según el reglamento interno.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {teamMembers.map((m) => (
                <div key={m.id} className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                      {m.avatar}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{m.name}</h3>
                      <span className="text-[10px] text-gray-400">{m.role}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs pt-2 border-t border-gray-800">
                    <div className="flex justify-between text-gray-400">
                      <span>Horas validadas esta semana:</span>
                      <span className="text-white font-mono font-bold">28.5 h</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Proyectos asignados:</span>
                      <span className="text-white font-mono">4</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISTA 5: CRM */}
        {activeTab === 'crm' && (
          <div className="max-w-[1500px] mx-auto space-y-6">
            <div className="border-b border-gray-800 pb-5">
              <h1 className="text-2xl font-bold text-white">CRM de Clientes & Oportunidades</h1>
              <p className="text-xs text-gray-400">Seguimiento de restaurantes y clínicas desde el primer contacto hasta el cierre.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['Contactado', 'Reunión Fijada', 'Propuesta Enviada', 'Cerrado / Activo'].map((stage, idx) => (
                <div key={idx} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 space-y-3">
                  <span className="text-xs font-bold text-white uppercase block border-b border-gray-800 pb-2">
                    {stage}
                  </span>
                  <div className="bg-gray-950 p-3 rounded-lg border border-gray-800 text-xs text-gray-300 space-y-1">
                    <div className="font-bold text-white">Restaurante El Faro</div>
                    <div className="text-[10px] text-gray-500">Punta Umbría · Plan Hostelería Pro</div>
                    <div className="text-[10px] text-emerald-400 font-mono">Presupuesto: 1.200 €</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISTA 6: CHATS & HABLAR CON NOSOTROS */}
        {activeTab === 'chats' && (
          <div className="max-w-[1300px] mx-auto space-y-6">
            <div className="border-b border-gray-800 pb-5 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-white">Bandeja de Mensajería & Chats</h1>
                <p className="text-xs text-gray-400">Conversaciones con clientes del SaaS y comunicación interna del equipo.</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveChatTab('clients')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    activeChatTab === 'clients' ? 'bg-indigo-600 text-white' : 'bg-gray-900 text-gray-400'
                  }`}
                >
                  Clientes (WhatsApp/Portal)
                </button>
                <button
                  onClick={() => setActiveChatTab('team')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    activeChatTab === 'team' ? 'bg-indigo-600 text-white' : 'bg-gray-900 text-gray-400'
                  }`}
                >
                  Equipo TecnOdiel
                </button>
              </div>
            </div>

            {/* Ventana de Chat */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl flex flex-col h-[520px] overflow-hidden">
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.isClient ? 'items-start' : 'items-end'}`}
                  >
                    <span className="text-[10px] text-gray-500 font-mono mb-1">{msg.sender} · {msg.time}</span>
                    <div
                      className={`max-w-md px-4 py-2.5 rounded-2xl text-xs ${
                        msg.isClient
                          ? 'bg-gray-800 text-gray-100 rounded-tl-none border border-gray-700'
                          : 'bg-indigo-600 text-white rounded-tr-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Formulario de Envío de Mensaje */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800 flex items-center gap-3 bg-gray-950">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe una respuesta al cliente o al equipo..."
                  className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Enviar
                </button>
              </form>
            </div>
          </div>
        )}

        {/* VISTA 7: AJUSTES */}
        {activeTab === 'settings' && (
          <div className="max-w-[1000px] mx-auto space-y-6">
            <div className="border-b border-gray-800 pb-5">
              <h1 className="text-2xl font-bold text-white">Ajustes de la Agencia</h1>
              <p className="text-xs text-gray-400">Configuración global de VirtualDesk, Vercel multi-dominio y claves de Supabase.</p>
            </div>

            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 space-y-4 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">Nombre de la Agencia</label>
                <input defaultValue="TecnOdiel Soluciones Digitales" className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-white" />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Ciudad y Sede</label>
                <input defaultValue="Huelva, España" className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-white" />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Dominio Base de Tenants</label>
                <input defaultValue="tecnodiel.com / *.vercel.app" className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-white" />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default VirtualDeskAdminApp;
