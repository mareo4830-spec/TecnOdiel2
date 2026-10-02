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
  ArrowLeft, 
  Users, 
  Trash2, 
  AlertTriangle,
  Stethoscope,
  Utensils,
  ChevronDown,
  ChevronUp,
  Activity,
  Check,
  RefreshCw,
  Filter
} from 'lucide-react';
import { 
  getAllRestaurantsForAdmin, 
  updateRestaurantTasks, 
  updateRestaurantAdminNotes, 
  deleteRestaurant 
} from '../lib/supabase';
import AdminTeamWorkspace from './AdminTeamWorkspace';

export default function AdminMonitoringDashboard({ onImpersonateClient, onLogout, onNavigateToLanding }) {
  const [activeAdminTab, setActiveAdminTab] = useState('clients'); // 'clients' | 'team'
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all'); // 'all', 'restaurants', 'clinics', 'pending', 'live'
  const [copiedKey, setCopiedKey] = useState(null);
  const [savingNotesId, setSavingNotesId] = useState(null);
  const [notesState, setNotesState] = useState({});
  const [expandedTasksMap, setExpandedTasksMap] = useState({});
  const [restaurantToDelete, setRestaurantToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState('');

  const loadData = async () => {
    setLoading(true);
    const list = await getAllRestaurantsForAdmin();
    setRestaurants(list || []);
    
    // Inicializar mapa de notas internas
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
    if (!key) return;
    navigator.clipboard.writeText(key);
    setCopiedKey(restId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleToggleTask = async (restaurant, taskId) => {
    const currentTasks = restaurant.pending_tasks || [];
    const updatedTasks = currentTasks.map(t => 
      t.id === taskId ? { ...t, done: !t.done } : t
    );

    // Actualización optimista de interfaz
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

  const handleToggleExpandTasks = (restId) => {
    setExpandedTasksMap(prev => ({
      ...prev,
      [restId]: !prev[restId]
    }));
  };

  const handleConfirmDelete = async () => {
    if (!restaurantToDelete) return;
    setIsDeleting(true);
    const success = await deleteRestaurant(restaurantToDelete.id);
    setIsDeleting(false);

    if (success) {
      setRestaurants(prev => prev.filter(r => r.id !== restaurantToDelete.id));
      setDeleteSuccessMsg(`El negocio "${restaurantToDelete.name}" ha sido eliminado de la plataforma.`);
      setTimeout(() => setDeleteSuccessMsg(''), 4000);
      setRestaurantToDelete(null);
    } else {
      alert('No se pudo eliminar el negocio. Inténtalo de nuevo.');
    }
  };

  // Clasificación clínica vs restaurante
  const isClinic = (r) => !!(
    r?.collegiate_number || 
    ['dental', 'policlinica', 'fisioterapia', 'estetica', 'psicologia', 'veterinaria', 'oftalmologia', 'podologia', 'nutricion'].includes(r?.category)
  );

  // Cálculos de métricas globales
  const totalWebs = restaurants.length;
  const restaurantsCount = restaurants.filter(r => !isClinic(r)).length;
  const clinicsCount = restaurants.filter(r => isClinic(r)).length;
  const totalMRR = restaurants.reduce((sum, r) => sum + (parseFloat(r.budget) || 49), 0);
  const publishedWebs = restaurants.filter(r => r.cloudflare_url || r.published_url || r.slug).length;
  const totalPendingTasks = restaurants.reduce((sum, r) => {
    const tasks = r.pending_tasks || [];
    return sum + tasks.filter(t => !t.done).length;
  }, 0);

  // Filtrado de negocios
  const filtered = restaurants.filter(r => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      (r.name || '').toLowerCase().includes(q) ||
      (r.slug || '').toLowerCase().includes(q) ||
      (r.client_access_key || '').toLowerCase().includes(q) ||
      (r.phone || '').includes(q) ||
      (r.city || '').toLowerCase().includes(q)
    );

    if (!matchesSearch) return false;

    if (filterCategory === 'restaurants') return !isClinic(r);
    if (filterCategory === 'clinics') return isClinic(r);
    if (filterCategory === 'pending') {
      const pending = (r.pending_tasks || []).filter(t => !t.done);
      return pending.length > 0;
    }
    if (filterCategory === 'live') {
      return !!(r.cloudflare_url || r.published_url || r.slug);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      
      {/* 1. TOP HEADER EJECUTIVO Y LIMPIO */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/90 backdrop-blur-2xl px-4 sm:px-8 py-3 min-h-16 flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Identidad de Marca Admin */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black border border-emerald-500/50 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.25)]">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-base tracking-tight leading-none">
                  TecnOdiel Central
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold uppercase tracking-wider">
                  Panel Maestro
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 font-mono hidden sm:block">
                Monitorización de Clientes, Infraestructura y Entregables
              </span>
            </div>
          </div>

          {/* Botones de salida rápida en móvil */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-xl border border-white/10 bg-zinc-900 text-xs font-semibold text-zinc-300 hover:text-white"
            >
              Salir
            </button>
          </div>
        </div>

        {/* Conmutador de Pestañas: Clientes vs Equipo */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-zinc-900/90 border border-white/10 w-full md:w-auto justify-center">
          <button
            type="button"
            onClick={() => setActiveAdminTab('clients')}
            className={`flex-1 md:flex-initial px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeAdminTab === 'clients'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Directorio de Clientes</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
              activeAdminTab === 'clients' ? 'bg-black/15 text-black' : 'bg-zinc-800 text-zinc-300'
            }`}>
              {restaurants.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab('team')}
            className={`flex-1 md:flex-initial px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeAdminTab === 'team'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Equipo Interno</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </div>

        {/* Acciones de Cabecera en Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/60 border border-white/5 text-[11px] font-mono text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Cloudflare & Supabase Activos</span>
          </div>

          {onNavigateToLanding && (
            <button
              type="button"
              onClick={onNavigateToLanding}
              className="px-3.5 py-1.5 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
              title="Volver a la portada oficial de TecnOdiel"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Inicio</span>
            </button>
          )}

          <button
            type="button"
            onClick={onLogout}
            className="px-3.5 py-1.5 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 hover:text-rose-300 hover:border-rose-500/30 transition flex items-center gap-1.5 cursor-pointer"
            title="Cerrar sesión del panel de administrador"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </header>

      {/* 2. CONTENIDO PRINCIPAL */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-8">
        
        {/* VISTA 1: EQUIPO DE TRABAJO */}
        {activeAdminTab === 'team' ? (
          <AdminTeamWorkspace />
        ) : (
          /* VISTA 2: MONITORIZACIÓN DE CLIENTES */
          <div className="space-y-8">
            
            {/* KPI METRIC CARDS (EJECUTIVAS Y MODERNAS) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* KPI 1: Total Clientes */}
              <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 shadow-xl space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                  <span>TOTAL CLIENTES</span>
                  <Building2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-3xl font-black text-white font-mono tracking-tight">
                    {totalWebs}
                  </div>
                  <p className="text-[11px] text-zinc-400 pt-1">
                    {restaurantsCount} restaurantes • {clinicsCount} clínicas
                  </p>
                </div>
              </div>

              {/* KPI 2: Facturación Recurrente */}
              <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 shadow-xl space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                  <span>FACTURACIÓN MENSUAL (MRR)</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-3xl font-black text-emerald-300 font-mono tracking-tight">
                    {totalMRR.toFixed(0)}€
                  </div>
                  <p className="text-[11px] text-zinc-400 pt-1">
                    Ingresos recurrentes estimados
                  </p>
                </div>
              </div>

              {/* KPI 3: Webs Publicadas */}
              <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 shadow-xl space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                  <span>WEBS DESPLEGADAS</span>
                  <Globe className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <div className="text-3xl font-black text-cyan-300 font-mono tracking-tight">
                    {publishedWebs}
                  </div>
                  <p className="text-[11px] text-zinc-400 pt-1">
                    100% Cloudflare Pages & SSL
                  </p>
                </div>
              </div>

              {/* KPI 4: Tareas Pendientes */}
              <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 shadow-xl space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                  <span>TAREAS PENDIENTES</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="text-3xl font-black text-white font-mono tracking-tight">
                    {totalPendingTasks}
                  </div>
                  <p className="text-[11px] text-zinc-400 pt-1">
                    Configuraciones y entregables
                  </p>
                </div>
              </div>
            </div>

            {/* AVISO DE ACCIÓN COMPLETADA */}
            {deleteSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-fadeIn shadow-lg font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{deleteSuccessMsg}</span>
              </div>
            )}

            {/* BARRA DE BÚSQUEDA Y FILTROS */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-white/10 space-y-3 shadow-xl">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                
                {/* Input de Búsqueda */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Buscar por negocio, slug, municipio, teléfono o clave de cliente (ej: TO-MN892)..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-emerald-400 transition"
                  />
                </div>

                {/* Filtros por Categoría */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: 'all', label: 'Todos', count: totalWebs },
                    { id: 'restaurants', label: 'Restaurantes', count: restaurantsCount },
                    { id: 'clinics', label: 'Clínicas', count: clinicsCount },
                    { id: 'pending', label: 'Con Pendientes', count: restaurants.filter(r => (r.pending_tasks || []).some(t => !t.done)).length },
                    { id: 'live', label: 'Publicadas', count: publishedWebs }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setFilterCategory(tab.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                        filterCategory === tab.id
                          ? 'bg-white text-black font-bold shadow-md'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5 hover:border-white/15'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        filterCategory === tab.id ? 'bg-black/15 text-black font-bold' : 'bg-black text-zinc-400'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* LISTADO DE CLIENTES */}
            {loading ? (
              <div className="text-center py-20 rounded-2xl bg-zinc-950 border border-white/5 text-zinc-400 text-xs font-mono space-y-3">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-400" />
                <p>Cargando clientes y proyectos en tiempo real...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 rounded-2xl bg-zinc-950 border border-white/5 text-zinc-400 text-xs space-y-2">
                <p className="font-semibold text-zinc-300">No se encontraron clientes con esos criterios.</p>
                <p className="text-zinc-500">Prueba a buscar con otro término o limpia los filtros.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map(restaurant => {
                  const clinicMode = isClinic(restaurant);
                  const liveUrl = restaurant.cloudflare_url || restaurant.published_url || `https://${restaurant.slug}.pages.dev`;
                  const tasks = restaurant.pending_tasks || [];
                  const completedTasksCount = tasks.filter(t => t.done).length;
                  const totalTasksCount = tasks.length || 1;
                  const progressPct = Math.round((completedTasksCount / totalTasksCount) * 100);
                  const isExpanded = !!expandedTasksMap[restaurant.id];

                  return (
                    <div
                      key={restaurant.id}
                      className="rounded-2xl border border-white/10 bg-zinc-950/90 p-5 sm:p-6 shadow-xl space-y-5 transition-all hover:border-white/20"
                    >
                      {/* FILA SUPERIOR: IDENTIDAD, CLAVE Y BOTONES DE ACCIÓN */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/5 pb-4">
                        
                        {/* Nombre, categoría y datos */}
                        <div className="flex items-start sm:items-center gap-3.5">
                          <div className={`w-11 h-11 rounded-2xl bg-zinc-900 border flex items-center justify-center shrink-0 shadow-md ${
                            clinicMode ? 'border-cyan-500/40 text-cyan-400' : 'border-emerald-500/40 text-emerald-400'
                          }`}>
                            {clinicMode ? <Stethoscope className="w-5 h-5" /> : <Utensils className="w-5 h-5" />}
                          </div>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                                {restaurant.name}
                              </h3>
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold uppercase ${
                                clinicMode 
                                  ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' 
                                  : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                              }`}>
                                {clinicMode ? 'Clínica' : 'Restaurante'}
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 border border-white/5 text-zinc-400">
                                {restaurant.category || 'general'}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono mt-1 flex-wrap">
                              <span>/{restaurant.slug}</span>
                              <span>•</span>
                              <span>{restaurant.city || 'Huelva'}</span>
                              {restaurant.phone && (
                                <>
                                  <span>•</span>
                                  <span>Tel: {restaurant.phone}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Clave privada, plan y acciones ejecutivas */}
                        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                          
                          {/* Clave Privada de Cliente */}
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-xs font-mono">
                            <Key className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-zinc-400 text-[11px]">Clave:</span>
                            <strong className="text-white text-xs tracking-wider">
                              {restaurant.client_access_key}
                            </strong>
                            <button
                              type="button"
                              onClick={() => handleCopyKey(restaurant.client_access_key, restaurant.id)}
                              className="ml-0.5 p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer"
                              title="Copiar clave privada"
                            >
                              {copiedKey === restaurant.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>

                          {/* Plan y Cuota Mensual */}
                          <div className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300 flex items-center gap-1.5">
                            <CreditCard className="w-3.5 h-3.5 text-purple-400" />
                            <span className="font-bold text-white">
                              {parseFloat(restaurant.budget || 49).toFixed(0)}€/mes
                            </span>
                          </div>

                          {/* Ver Web en Vivo */}
                          <a
                            href={liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                            title="Abrir la web en vivo"
                          >
                            <Globe className="w-3.5 h-3.5 text-cyan-400" />
                            <span className="hidden sm:inline">Web en Vivo</span>
                            <ExternalLink className="w-3 h-3 text-zinc-500" />
                          </a>

                          {/* Enviar Clave por WhatsApp */}
                          {restaurant.whatsapp_number && (
                            <a
                              href={`https://wa.me/${restaurant.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent(
                                `Hola ${restaurant.name}, te escribimos desde TecnOdiel. Tu clave de acceso privada al portal es: ${restaurant.client_access_key}. ¿Podemos ayudarte con algún cambio en tu web o carta?`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                              title="Enviar mensaje y clave por WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="hidden sm:inline">WhatsApp</span>
                            </a>
                          )}

                          {/* Abrir Su Panel (Impersonar cliente con vista supervisor) */}
                          <button
                            type="button"
                            onClick={() => onImpersonateClient(restaurant.slug || restaurant.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
                            title="Abrir el panel exactamente como lo ve este cliente"
                          >
                            <Eye className="w-3.5 h-3.5 text-black" />
                            <span>Abrir Su Panel</span>
                          </button>

                          {/* Eliminar Negocio */}
                          <button
                            type="button"
                            onClick={() => setRestaurantToDelete(restaurant)}
                            className="p-2 rounded-xl border border-white/10 bg-zinc-900 hover:bg-rose-500/15 hover:border-rose-500/40 text-zinc-400 hover:text-rose-300 transition cursor-pointer"
                            title="Eliminar este negocio"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* FILA CENTRAL: TAREAS PENDIENTES & CHECKLIST CON BARRA DE PROGRESO */}
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <button
                            type="button"
                            onClick={() => handleToggleExpandTasks(restaurant.id)}
                            className="font-bold text-white flex items-center gap-2 hover:text-emerald-300 transition cursor-pointer"
                          >
                            <span>Entregables & Configuración</span>
                            <span className="text-[11px] font-mono text-zinc-400 font-normal">
                              ({completedTasksCount} de {totalTasksCount} listas)
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5 text-zinc-400" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                            )}
                          </button>

                          <div className="flex items-center gap-2 w-36">
                            <div className="h-1.5 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-400 transition-all duration-300"
                                style={{ width: `${progressPct}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-mono text-zinc-400 font-bold">{progressPct}%</span>
                          </div>
                        </div>

                        {/* Listado de tareas (Desplegable para mantener la interfaz ultra limpia) */}
                        {isExpanded && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1 animate-fadeIn">
                            {tasks.map(task => (
                              <div
                                key={task.id}
                                onClick={() => handleToggleTask(restaurant, task.id)}
                                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 text-xs select-none ${
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
                                <span className={`truncate ${task.done ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                                  {task.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* FILA INFERIOR: NOTAS INTERNAS DE ADMINISTRACIÓN */}
                      <div className="pt-2 border-t border-white/5 flex items-center gap-2">
                        <Edit3 className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <input
                          type="text"
                          placeholder="Nota interna de administración para este cliente (ej: 'Pendiente enviar fotos de postres el viernes')..."
                          value={notesState[restaurant.id] !== undefined ? notesState[restaurant.id] : (restaurant.admin_notes || '')}
                          onChange={e => {
                            const val = e.target.value;
                            setNotesState(prev => ({ ...prev, [restaurant.id]: val }));
                          }}
                          className="flex-1 px-3 py-1.5 rounded-xl bg-zinc-900/70 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-emerald-400 transition"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveNotes(restaurant.id)}
                          disabled={savingNotesId === restaurant.id}
                          className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0 disabled:opacity-50"
                        >
                          <Save className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{savingNotesId === restaurant.id ? 'Guardando...' : 'Guardar Nota'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* 3. MODAL DE CONFIRMACIÓN PARA ELIMINAR NEGOCIO */}
      {restaurantToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md max-h-[90dvh] overflow-y-auto bg-zinc-950 border border-rose-500/30 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  ¿Eliminar este negocio de la plataforma?
                </h3>
                <span className="text-[11px] text-zinc-400 font-mono">
                  Esta acción es irreversible
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/5 space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Negocio:</span>
                <span className="text-white font-bold">{restaurantToDelete.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Slug:</span>
                <span className="text-zinc-300">{restaurantToDelete.slug}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Clave:</span>
                <span className="text-emerald-400 font-bold">{restaurantToDelete.client_access_key}</span>
              </div>
            </div>

            <p className="text-xs text-rose-300/90 leading-relaxed bg-rose-500/5 p-3 rounded-xl border border-rose-500/20">
              Se eliminará toda la configuración, la carta o servicios y las reservas registradas.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setRestaurantToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-zinc-300 hover:text-white text-xs transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-lg active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeleting ? 'Eliminando...' : 'Eliminar Definitivamente'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
