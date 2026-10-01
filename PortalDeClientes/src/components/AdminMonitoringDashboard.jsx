import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink, 
  Key, 
  Copy, 
  CreditCard, 
  CheckSquare, 
  Square, 
  MessageSquare, 
  Phone, 
  Eye, 
  Edit3, 
  Save, 
  Globe, 
  ShieldCheck, 
  TrendingUp, 
  DollarSign, 
  Layers, 
  LogOut,
  Sparkles,
  ArrowRight,
  Users
} from 'lucide-react';
import { 
  getAllRestaurantsForAdmin, 
  updateRestaurantTasks, 
  updateRestaurantAdminNotes,
  updateRestaurantPlanSettings
} from '../lib/supabase';
import AdminTeamWorkspace from './AdminTeamWorkspace';

export default function AdminMonitoringDashboard({ onImpersonateClient, onLogout }) {
  const [activeAdminTab, setActiveAdminTab] = useState('clients'); // 'clients' | 'team'
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending_tasks', 'published'
  const [copiedKey, setCopiedKey] = useState(null);
  const [savingNotesId, setSavingNotesId] = useState(null);
  const [notesState, setNotesState] = useState({});
  const [editingPlanRest, setEditingPlanRest] = useState(null);

  const loadData = async () => {
    setLoading(true);
    const list = await getAllRestaurantsForAdmin();
    setRestaurants(list);
    
    // Initialize notes map
    const nMap = {};
    (list || []).forEach(r => {
      nMap[r.id] = r.admin_notes || '';
    });
    setNotesState(nMap);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopyKey = (key, restId) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(restId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleToggleTask = async (restaurant, taskId) => {
    const currentTasks = restaurant.pending_tasks || [];
    const updatedTasks = currentTasks.map(t => 
      t.id === taskId ? { ...t, done: !t.done } : t
    );

    // Optimistic UI update
    setRestaurants(prev => prev.map(r => 
      r.id === restaurant.id ? { ...r, pending_tasks: updatedTasks } : r
    ));

    await updateRestaurantTasks(restaurant.id, updatedTasks);
  };

  const handleSaveNotes = async (restaurantId) => {
    setSavingNotesId(restaurantId);
    await updateRestaurantAdminNotes(restaurantId, notesState[restaurantId] || '');
    setSavingNotesId(null);
    setRestaurants(prev => prev.map(r => 
      r.id === restaurantId ? { ...r, admin_notes: notesState[restaurantId] } : r
    ));
  };

  // KPIs
  const totalWebs = restaurants.length;
  const totalMRR = restaurants.reduce((sum, r) => sum + (parseFloat(r.budget) || 99), 0);
  const publishedWebs = restaurants.filter(r => r.cloudflare_url || r.published_url).length;
  const totalPendingTasks = restaurants.reduce((sum, r) => {
    const tasks = r.pending_tasks || [];
    return sum + tasks.filter(t => !t.done).length;
  }, 0);

  // Filter logic
  const filtered = restaurants.filter(r => {
    const matchesSearch = 
      (r.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.slug || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.client_access_key || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.phone || '').includes(searchQuery);

    if (!matchesSearch) return false;

    if (filterStatus === 'pending_tasks') {
      const pending = (r.pending_tasks || []).filter(t => !t.done);
      return pending.length > 0;
    }
    if (filterStatus === 'published') {
      return !!(r.cloudflare_url || r.published_url);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/90 backdrop-blur-2xl px-4 sm:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-black border border-emerald-500/50 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-base tracking-tight leading-none">
                TecnOdiel
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold uppercase">
                Panel Maestro Admin
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">
              Monitorización Global de Clientes, Tareas y Facturación
            </span>
          </div>
        </div>

        {/* View Switcher: Clientes vs Equipo */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-900/90 border border-white/10">
          <button
            type="button"
            onClick={() => setActiveAdminTab('clients')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeAdminTab === 'clients'
                ? 'bg-emerald-400 text-black shadow-lg'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Clientes & Webs</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${activeAdminTab === 'clients' ? 'bg-black/20 text-black' : 'bg-zinc-800 text-zinc-300'}`}>
              {restaurants.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab('team')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeAdminTab === 'team'
                ? 'bg-white text-black shadow-lg'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Equipo: Mario, Javier & Daniel</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onLogout}
            className="px-3.5 py-1.5 rounded-xl border border-white/10 bg-zinc-900/80 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition flex items-center gap-1.5"
            title="Cerrar sesión de administrador"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-8">
        {activeAdminTab === 'team' ? (
          /* VISTA EQUIPO: MARIO, JAVIER Y DANIEL */
          <AdminTeamWorkspace />
        ) : (
          /* VISTA CLIENTES & WEBS */
          <>
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/80 border border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-400 text-xs font-medium">Total Clientes / Webs</span>
              <Building2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {totalWebs}
            </div>
            <span className="text-[10px] font-mono text-zinc-500">Restaurantes activos</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/80 border border-emerald-500/20 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-400 text-xs font-medium">Facturación Mensual (MRR)</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-300">
              {totalMRR.toFixed(2)} €
            </div>
            <span className="text-[10px] font-mono text-emerald-400/80">Recurrente estimado</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/80 border border-amber-500/20 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-400 text-xs font-medium">Webs en Cloudflare</span>
              <Globe className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-300">
              {publishedWebs}
            </div>
            <span className="text-[10px] font-mono text-amber-400/80">100% online y seguras</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/80 border border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-400 text-xs font-medium">Tareas Pendientes</span>
              <Clock className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {totalPendingTasks}
            </div>
            <span className="text-[10px] font-mono text-zinc-500">Acciones del equipo</span>
          </div>
        </div>

        {/* Search, Filter & Actions Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-950/60 border border-white/10">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar por negocio, slug, teléfono o clave de cliente (ej: TO-MN892)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-emerald-400 transition"
            />
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: 'Todas las Webs' },
              { id: 'pending_tasks', label: 'Con Pendientes' },
              { id: 'published', label: 'En Cloudflare' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  filterStatus === tab.id
                    ? 'bg-emerald-400 text-black font-bold'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Client Monitoring Cards */}
        {loading ? (
          <div className="text-center py-16 text-zinc-500 text-xs font-mono">
            Cargando base de datos de clientes desde Supabase...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-zinc-500 text-sm">
            No se encontraron clientes que coincidan con la búsqueda.
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map(restaurant => {
              const liveUrl = restaurant.cloudflare_url || restaurant.published_url || `https://${restaurant.slug}.pages.dev`;
              const tasks = restaurant.pending_tasks || [];
              const completedTasksCount = tasks.filter(t => t.done).length;
              const totalTasksCount = tasks.length || 1;
              const progressPct = Math.round((completedTasksCount / totalTasksCount) * 100);

              return (
                <div
                  key={restaurant.id}
                  className="rounded-3xl border border-white/10 bg-zinc-950/90 p-5 sm:p-7 shadow-xl space-y-6 transition hover:border-white/20"
                >
                  {/* Top Bar: Brand, Key & Plan */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/5 pb-5">
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/15 flex items-center justify-center text-white shrink-0">
                        <Building2 className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                            {restaurant.name}
                          </h2>
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-semibold">
                            {restaurant.category || 'hostelería'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono mt-1 flex-wrap">
                          <span>/{restaurant.slug}</span>
                          <span>•</span>
                          <span>{restaurant.city || 'Huelva'}</span>
                          {restaurant.phone && (
                            <>
                              <span>•</span>
                              <span>📞 {restaurant.phone}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right side: Key, Plan & Actions */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      {/* Client Unique Access Key */}
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-emerald-500/30">
                        <Key className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[11px] font-mono text-zinc-400">Clave Cliente:</span>
                        <strong className="text-xs font-mono text-white tracking-wider">
                          {restaurant.client_access_key}
                        </strong>
                        <button
                          type="button"
                          onClick={() => handleCopyKey(restaurant.client_access_key, restaurant.id)}
                          className="ml-1 p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition"
                          title="Copiar clave de acceso para dársela al cliente"
                        >
                          <Copy className="w-3 h-3 text-emerald-400" />
                        </button>
                        {copiedKey === restaurant.id && (
                          <span className="text-[10px] font-mono text-emerald-400 ml-1">¡Copiada!</span>
                        )}
                      </div>

                      {/* Budget / Plan Pill */}
                      <div className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                        <span>{restaurant.plan_name || 'Plan Pro'}</span>
                        <span className="text-white font-bold font-mono">
                          {parseFloat(restaurant.budget || 99).toFixed(0)}€/mes
                        </span>
                      </div>

                      {/* Direct Live Link */}
                      <a
                        href={liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition flex items-center gap-1.5"
                        title="Ver web real en Cloudflare Pages"
                      >
                        <Globe className="w-3.5 h-3.5 text-amber-400" />
                        <span className="hidden sm:inline">Web en Vivo</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      {/* Impersonate / Enter Client Portal */}
                      <button
                        type="button"
                        onClick={() => onImpersonateClient(restaurant.slug || restaurant.id)}
                        className="px-4 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-extrabold transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        title="Abrir el panel exactamente como lo ve este cliente para ayudarle o configurarle platos"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Abrir Su Panel</span>
                      </button>
                    </div>
                  </div>

                  {/* Mid Section: Interactive Checklist ("Lo que falta en esta web") */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                          // ESTADO DEL PROYECTO & TAREAS PENDIENTES:
                        </span>
                        <span className="text-[11px] font-mono text-zinc-400">
                          ({completedTasksCount} de {totalTasksCount} listas)
                        </span>
                      </div>

                      <div className="flex items-center gap-2 w-32">
                        <div className="h-1.5 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-400 transition-all duration-300"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-zinc-400">{progressPct}%</span>
                      </div>
                    </div>

                    {/* Tasks Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {tasks.map(task => (
                        <div
                          key={task.id}
                          onClick={() => handleToggleTask(restaurant, task.id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 text-xs select-none ${
                            task.done
                              ? 'border-emerald-500/20 bg-emerald-500/5 text-zinc-300 hover:border-emerald-500/40'
                              : 'border-white/10 bg-zinc-900/60 text-zinc-400 hover:border-white/20 hover:text-white'
                          }`}
                        >
                          {task.done ? (
                            <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-zinc-600 shrink-0" />
                          )}
                          <span className={task.done ? 'line-through text-zinc-400' : 'text-zinc-200'}>
                            {task.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Section: Admin Internal Notes & Contact Dueño */}
                  <div className="pt-2 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
                    <div className="flex-1 flex items-center gap-2">
                      <Edit3 className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <input
                        type="text"
                        placeholder="Nota interna de administración (ej: 'Llamar el martes para cambiar precios de carta de vino')..."
                        value={notesState[restaurant.id] !== undefined ? notesState[restaurant.id] : (restaurant.admin_notes || '')}
                        onChange={e => {
                          const val = e.target.value;
                          setNotesState(prev => ({ ...prev, [restaurant.id]: val }));
                        }}
                        className="flex-1 px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-emerald-400 transition"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveNotes(restaurant.id)}
                        disabled={savingNotesId === restaurant.id}
                        className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1 transition"
                      >
                        <Save className="w-3 h-3" />
                        <span>{savingNotesId === restaurant.id ? 'Guardando...' : 'Guardar Nota'}</span>
                      </button>
                    </div>

                    {/* Direct WhatsApp to Owner */}
                    {restaurant.whatsapp_number && (
                      <a
                        href={`https://wa.me/${restaurant.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent(
                          `Hola ${restaurant.name}, te escribimos desde el equipo de gestión de TecnOdiel. Tu clave de acceso privada al portal es: ${restaurant.client_access_key}. ¿Podemos ayudarte con algún detalle de la carta o la web?`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold transition flex items-center justify-center gap-1.5 shrink-0"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Enviar Clave & Mensaje por WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </>
    )}
  </main>
    </div>
  );
}
