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
  Filter,
  Plus,
  Wrench,
  X
} from 'lucide-react';
import { 
  getAllRestaurantsForAdmin, 
  updateRestaurantTasks, 
  updateRestaurantAdminNotes, 
  deleteRestaurant 
} from '../lib/supabase';
import AdminTeamWorkspace from './AdminTeamWorkspace';

// Plantillas disponibles y diferenciadas para instanciar webs desde formulario
const AVAILABLE_TEMPLATES = [
  { id: 'cinematic', name: 'Estilo Cinemático Chuletón', type: 'restaurant', desc: 'Narrativa visual inmersiva con vídeo, brasas y carta lateral fluida.' },
  { id: 'taberna_andaluza', name: 'Taberna Andaluza Tradicional', type: 'restaurant', desc: 'Tonos albero, solera andaluza, azulejos y carta de raciones.' },
  { id: 'nocturne', name: 'Nocturne Velvet Lounge', type: 'restaurant', desc: 'Alta coctelería y gastronomía nocturna en atmósfera oscura e íntima.' },
  { id: 'tokyo_omakase', name: 'Tokyo Omakase Minimal', type: 'restaurant', desc: 'Estética japonesa zen, líneas limpias y exclusividad por pases.' },
  { id: 'mediterraneo_bistro', name: 'Bistró Mediterráneo', type: 'restaurant', desc: 'Frescura marinera, luz natural y cocina de lonja directa.' },
  { id: 'dental_pure', name: 'Dental Pure & Estética', type: 'clinic', desc: 'Diseño clínico higiénico, cian sanitario y cita 3D de alta gama.' },
  { id: 'policlinica_central', name: 'Policlínica & Cuadro Médico', type: 'clinic', desc: 'Estructura multiespecialidad con gestión de mutuas y agendas médicas.' },
  { id: 'fisioterapia_elite', name: 'Fisioterapia & Readaptación', type: 'clinic', desc: 'Enfoque deportivo activo con reserva de sesiones y patologías.' },
  { id: 'derma_laser', name: 'Dermatología & Láser Avanzado', type: 'clinic', desc: 'Estética médica de vanguardia con catálogo de tratamientos y diagnóstico.' }
];

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

  // Modal: Añadir Web desde Formulario
  const [isAddWebModalOpen, setIsAddWebModalOpen] = useState(false);
  const [isCreatingWeb, setIsCreatingWeb] = useState(false);
  const [newWebData, setNewWebData] = useState({
    businessType: 'restaurant', // 'restaurant' | 'clinic'
    owner_name: '',
    name: '',
    slug: '',
    email: '',
    phone: '',
    whatsapp_number: '',
    address: '',
    city: 'Huelva',
    postal_code: '21001',
    template_id: 'cinematic',
    primary_color: '#10b981',
    accent_color: '#06b6d4',
    font_family: 'Playfair Display',
    slogan: '',
    description: '',
    instagram_url: '',
    collegiate_number: '',
    budget: 99.00
  });

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

  // Instanciar web a partir de las respuestas del formulario
  const handleCreateWebFromForm = async (e) => {
    e.preventDefault();
    if (!newWebData.name.trim()) return;

    setIsCreatingWeb(true);
    const cleanSlug = newWebData.slug.trim() || newWebData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const prefix = newWebData.businessType === 'clinic' ? 'CYS' : 'TO';
    const accessKey = `${prefix}-${cleanSlug.toUpperCase().slice(0, 6)}-${Math.floor(100 + Math.random() * 900)}`;

    const newEntry = {
      id: `gen-${Date.now()}`,
      name: newWebData.name,
      owner_name: newWebData.owner_name || 'Titular Registrado',
      slug: cleanSlug,
      email: newWebData.email.toLowerCase().trim(),
      phone: newWebData.phone,
      whatsapp_number: newWebData.whatsapp_number || newWebData.phone,
      address: newWebData.address,
      city: newWebData.city,
      postal_code: newWebData.postal_code,
      template_id: newWebData.template_id,
      category: newWebData.businessType === 'clinic' ? 'dental' : 'traditional',
      primary_color: newWebData.primary_color,
      accent_color: newWebData.accent_color,
      font_family: newWebData.font_family,
      slogan: newWebData.slogan || (newWebData.businessType === 'clinic' ? 'Salud y Cuidado Integral' : 'Gastronomía de Calidad'),
      description: newWebData.description || 'Página web profesional gestionada por TecnOdiel.',
      instagram_url: newWebData.instagram_url,
      collegiate_number: newWebData.collegiate_number,
      client_access_key: accessKey,
      plan_name: newWebData.businessType === 'clinic' ? 'Plan Clínica & Salud Pro' : 'Plan Hostelería Pro',
      budget: parseFloat(newWebData.budget) || 99.00,
      billing_plan: 'monthly',
      contract_status: 'active',
      published_url: `https://${cleanSlug}.pages.dev`,
      cloudflare_url: `https://${cleanSlug}.pages.dev`,
      pending_tasks: [
        { id: 'task-1', label: 'Verificar respuestas y estilos del formulario', done: true },
        { id: 'task-2', label: 'Ajustar carta / servicios al gusto del cliente', done: false },
        { id: 'task-3', label: 'Conectar Google OAuth y enviar enlace al cliente', done: false }
      ],
      admin_notes: `Creado desde formulario por admin. Titular: ${newWebData.owner_name}. Plantilla asignada: ${newWebData.template_id}.`
    };

    // Guardar en Supabase o en persistencia local
    try {
      const { data, error } = await supabase.from('restaurants').insert([newEntry]).select().single();
      if (!error && data) {
        setRestaurants(prev => [data, ...prev]);
      } else {
        // Fallback local storage
        const storageKey = newWebData.businessType === 'clinic' ? 'tecnodiel_cys_clinics' : 'tecnodiel_restaurants';
        const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
        existing.unshift(newEntry);
        localStorage.setItem(storageKey, JSON.stringify(existing));
        setRestaurants(prev => [newEntry, ...prev]);
      }
    } catch (_) {
      setRestaurants(prev => [newEntry, ...prev]);
    }

    setIsCreatingWeb(false);
    setIsAddWebModalOpen(false);
    setDeleteSuccessMsg(`¡Web "${newEntry.name}" creada con éxito! Clave generada: ${accessKey}`);
    setTimeout(() => setDeleteSuccessMsg(''), 6000);
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

          <button
            type="button"
            onClick={() => setIsAddWebModalOpen(true)}
            className="px-4 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold transition flex items-center gap-1.5 shadow-[0_0_20px_rgba(16,185,129,0.35)] cursor-pointer"
            title="Crear una web instanciada directamente a partir del formulario"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Añadir Web desde Formulario</span>
          </button>

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

      {/* MODAL: AÑADIR WEB DESDE FORMULARIO */}
      {isAddWebModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-3xl p-5 sm:p-7 shadow-[0_0_80px_rgba(0,0,0,0.9)] space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white font-sans">
                    Añadir Web desde Formulario
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono">
                    Genera la web y portal del cliente con todas las respuestas del cuestionario
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddWebModalOpen(false)}
                className="p-2 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWebFromForm} className="space-y-4 font-sans text-xs">
              
              {/* Selector de Tipo de Negocio */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">
                  Sector del Formulario
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewWebData(prev => ({ 
                      ...prev, 
                      businessType: 'restaurant',
                      template_id: 'cinematic',
                      primary_color: '#10b981',
                      budget: 99.00
                    }))}
                    className={`p-3 rounded-2xl border text-left font-semibold transition cursor-pointer flex items-center gap-2.5 ${
                      newWebData.businessType === 'restaurant'
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-white'
                        : 'border-white/10 bg-zinc-900 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Utensils className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="font-bold">Restauración & Hostelería</div>
                      <div className="text-[10px] text-zinc-400 font-normal">Chuletón, Taberna, Nocturne, Omakase</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewWebData(prev => ({ 
                      ...prev, 
                      businessType: 'clinic',
                      template_id: 'dental_pure',
                      primary_color: '#06b6d4',
                      budget: 119.00
                    }))}
                    className={`p-3 rounded-2xl border text-left font-semibold transition cursor-pointer flex items-center gap-2.5 ${
                      newWebData.businessType === 'clinic'
                        ? 'border-cyan-500/50 bg-cyan-500/10 text-white'
                        : 'border-white/10 bg-zinc-900 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Stethoscope className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="font-bold">Clínica & Salud (CyS)</div>
                      <div className="text-[10px] text-zinc-400 font-normal">Dental, Policlínica, Fisioterapia, Láser</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Datos del Titular y Negocio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">
                    Nombre Completo del Titular *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Manuel García Rodríguez"
                    value={newWebData.owner_name}
                    onChange={e => setNewWebData({ ...newWebData, owner_name: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">
                    Nombre del Negocio / Local *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Asador El Candil / Clínica Dental Vital"
                    value={newWebData.name}
                    onChange={e => {
                      const name = e.target.value;
                      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setNewWebData({ ...newWebData, name, slug });
                    }}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400 text-xs"
                  />
                </div>
              </div>

              {/* Email (para Google OAuth) y Teléfono */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold flex items-center justify-between">
                    <span>Email del Cliente (Google OAuth) *</span>
                    <span className="text-emerald-400 font-mono text-[10px]">Acceso Portal</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="cliente@gmail.com"
                    value={newWebData.email}
                    onChange={e => setNewWebData({ ...newWebData, email: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">
                    WhatsApp / Teléfono *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+34 600 12 34 56"
                    value={newWebData.whatsapp_number}
                    onChange={e => setNewWebData({ ...newWebData, whatsapp_number: e.target.value, phone: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Dirección y Ciudad */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">
                    Dirección
                  </label>
                  <input
                    type="text"
                    placeholder="Calle Marina, 12"
                    value={newWebData.address}
                    onChange={e => setNewWebData({ ...newWebData, address: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">
                    Municipio
                  </label>
                  <input
                    type="text"
                    placeholder="Huelva"
                    value={newWebData.city}
                    onChange={e => setNewWebData({ ...newWebData, city: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400 text-xs"
                  />
                </div>
              </div>

              {/* Redes Sociales y Datos Colegiados */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">
                    Instagram del Negocio
                  </label>
                  <input
                    type="text"
                    placeholder="https://instagram.com/tunegocio"
                    value={newWebData.instagram_url}
                    onChange={e => setNewWebData({ ...newWebData, instagram_url: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400 text-xs"
                  />
                </div>

                {newWebData.businessType === 'clinic' ? (
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">
                      Nº Colegiado / Registro Sanitario
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: COL-21094 / NICA 4512"
                      value={newWebData.collegiate_number}
                      onChange={e => setNewWebData({ ...newWebData, collegiate_number: e.target.value })}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 text-xs font-mono"
                    />
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">
                      Lema / Slogan
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Brasas, solera y producto de Huelva"
                      value={newWebData.slogan}
                      onChange={e => setNewWebData({ ...newWebData, slogan: e.target.value })}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400 text-xs"
                    />
                  </div>
                )}
              </div>

              {/* Selección de Plantilla Diferenciada */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold flex items-center justify-between">
                  <span>Plantilla Diferenciada a Instanciar</span>
                  <span className="text-zinc-500 text-[10px]">Las plantillas no se parecen entre sí</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {AVAILABLE_TEMPLATES
                    .filter(t => t.type === newWebData.businessType)
                    .map(tpl => (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => setNewWebData(prev => ({ ...prev, template_id: tpl.id }))}
                        className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                          newWebData.template_id === tpl.id
                            ? 'border-emerald-400 bg-white/10 text-white shadow-md'
                            : 'border-white/5 bg-zinc-900/80 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">{tpl.name}</span>
                          {newWebData.template_id === tpl.id && (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                        </div>
                        <p className="text-[10px] text-zinc-400 pt-1 leading-snug">{tpl.desc}</p>
                      </button>
                    ))}
                </div>
              </div>

              {/* Botones de Envío del Modal */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddWebModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-zinc-300 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCreatingWeb}
                  className="px-6 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold transition flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 stroke-[2.5]" />
                  <span>{isCreatingWeb ? 'Instanciando...' : 'Crear Web y Generar Acceso'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
