import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Utensils, 
  Calendar, 
  Clock, 
  Settings, 
  CreditCard, 
  QrCode, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Phone, 
  MessageSquare, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Download, 
  RefreshCw,
  AlertCircle,
  Copy,
  ChevronRight,
  ChevronDown,
  Key, 
  Lock, 
  Headphones, 
  Check, 
  Stethoscope,
  Search,
  Folder,
  FolderOpen,
  FileText,
  Send,
  Bell,
  User,
  Paperclip,
  TrendingUp,
  X,
  PanelLeftClose,
  PanelLeft,
  ArrowUpRight,
  CheckSquare,
  Square,
  Layers,
  Activity,
  Award,
  MoreVertical
} from 'lucide-react';
import { 
  toggleMenuItemStock, 
  upsertMenuItem, 
  deleteMenuItem, 
  updateReservationStatus, 
  updateRestaurantProfile 
} from '../lib/supabase';
import confetti from 'canvas-confetti';

export default function Dashboard({ restaurant, onRefresh }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'menu', 'bookings', 'hours', 'billing', 'analytics'
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFolderOpen, setIsFolderOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const isClinic = !!(
    restaurant?.collegiate_number || 
    ['dental', 'policlinica', 'fisioterapia', 'estetica', 'psicologia', 'veterinaria', 'oftalmologia', 'podologia', 'nutricion'].includes(restaurant?.category)
  );

  const liveUrl = restaurant.custom_domain 
    ? `https://${restaurant.custom_domain}` 
    : (isClinic ? `/#/c/${restaurant.slug}` : `/#/r/${restaurant.slug}`);
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(typeof window !== 'undefined' ? `${window.location.origin}${isClinic ? '/#/c/' : '/#/r/'}${restaurant.slug}` : liveUrl)}`;

  // Copy helpers
  const handleCopy = () => {
    navigator.clipboard.writeText(liveUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyKey = () => {
    const k = restaurant.client_access_key || (isClinic ? 'CYS-CLINIC-101' : 'TO-MN892');
    navigator.clipboard.writeText(k);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // Menu modal state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState(restaurant.menu_categories?.[0]?.id || '');
  const [editingItem, setEditingItem] = useState(null);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemBadge, setItemBadge] = useState('');

  // Contact & Hours state
  const [phone, setPhone] = useState(restaurant.phone || '');
  const [whatsapp, setWhatsapp] = useState(restaurant.whatsapp_number || '');
  const [address, setAddress] = useState(restaurant.address || '');
  const [city, setCity] = useState(restaurant.city || 'Huelva');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Interactive Client Tasks (Persisted in localStorage)
  const [tasks, setTasks] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`tecnodiel_client_tasks_${restaurant?.id}`);
      if (saved) {
        try { return JSON.parse(saved); } catch (_) {}
      }
    }
    return [
      { id: 't1', title: isClinic ? 'Revisar cuadro médico y especialidades activas' : 'Revisar precios de fin de semana y alérgenos', category: 'Carta', priority: 'Alta', date: '08/12/2026', completed: true },
      { id: 't2', title: isClinic ? 'Confirmar citas médicas del próximo turno' : 'Confirmar reservas solicitadas para el próximo servicio', category: 'Reservas', priority: 'Hoy', date: '08/12/2026', completed: false },
      { id: 't3', title: isClinic ? 'Imprimir y colocar cartelería QR en recepción / mostrador' : 'Descargar e imprimir cartelería QR para mesas', category: isClinic ? 'Consulta' : 'Mesas', priority: 'Descargable', date: '08/15/2026', completed: true },
      { id: 't4', title: 'Actualizar fotos del local o sugerencias de temporada', category: 'Marketing', priority: 'Media', date: '08/18/2026', completed: false },
      { id: 't5', title: 'Verificar horario de apertura y teléfono de WhatsApp', category: 'Perfil', priority: 'Baja', date: '08/20/2026', completed: true }
    ];
  });

  const [newTaskInput, setNewTaskInput] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && restaurant?.id) {
      localStorage.setItem(`tecnodiel_client_tasks_${restaurant.id}`, JSON.stringify(tasks));
    }
  }, [tasks, restaurant?.id]);

  const handleToggleTask = (taskId) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    const newTask = {
      id: `task-${Date.now()}`,
      title: newTaskInput.trim(),
      category: 'General',
      priority: 'Media',
      date: 'Hoy',
      completed: false
    };
    setTasks(prev => [newTask, ...prev]);
    setNewTaskInput('');
    setIsAddingTask(false);
  };

  // Interactive Chat with TecnOdiel Advisor
  const [chatMessages, setChatMessages] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`tecnodiel_client_chat_${restaurant?.id}`);
      if (saved) {
        try { return JSON.parse(saved); } catch (_) {}
      }
    }
    return [
      {
        id: 'msg-1',
        sender: 'advisor',
        author: 'Alex (TecnOdiel)',
        text: `¡Hola! Tu web ya está 100% activa en Cloudflare Pages. ¿Qué te parece el diseño y la velocidad de carga?`,
        time: 'Hace 2h'
      },
      {
        id: 'msg-2',
        sender: 'client',
        author: 'Tú',
        text: '¡Quedó espectacular! Todo listo para las reservas de este fin de semana.',
        time: 'Hace 1h'
      }
    ];
  });

  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && restaurant?.id) {
      localStorage.setItem(`tecnodiel_client_chat_${restaurant.id}`, JSON.stringify(chatMessages));
    }
  }, [chatMessages, restaurant?.id]);

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'client',
      author: 'Tú',
      text: chatInput.trim(),
      time: 'Ahora'
    };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
  };

  // Handlers for menu and reservations
  const handleToggleStock = async (itemId, currentStatus) => {
    await toggleMenuItemStock(itemId, !currentStatus);
    onRefresh();
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('¿Seguro que deseas eliminar este elemento?')) {
      await deleteMenuItem(itemId);
      onRefresh();
    }
  };

  const handleOpenItemModal = (item = null, catId = null) => {
    if (item) {
      setEditingItem(item);
      setItemName(item.name || '');
      setItemPrice(item.price || '');
      setItemDesc(item.description || '');
      setItemBadge(item.badge || '');
      setSelectedCatId(catId || restaurant.menu_categories?.[0]?.id || '');
    } else {
      setEditingItem(null);
      setItemName('');
      setItemPrice('');
      setItemDesc('');
      setItemBadge('');
      setSelectedCatId(catId || restaurant.menu_categories?.[0]?.id || '');
    }
    setIsItemModalOpen(true);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!itemName || !itemPrice) return;

    await upsertMenuItem(restaurant.id, selectedCatId, {
      id: editingItem?.id,
      name: itemName,
      price: itemPrice,
      description: itemDesc,
      badge: itemBadge,
      is_available: editingItem ? editingItem.is_available : true
    });

    setIsItemModalOpen(false);
    onRefresh();
  };

  const handleStatusChange = async (resId, newStatus) => {
    await updateReservationStatus(resId, newStatus);
    onRefresh();
  };

  const handleSaveHours = async () => {
    setSavingProfile(true);
    await updateRestaurantProfile(restaurant.id, {
      phone,
      whatsapp_number: whatsapp,
      address,
      city
    });
    setSavingProfile(false);
    setSaveSuccessMsg('Datos actualizados correctamente.');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
    onRefresh();
  };

  const totalDishes = (restaurant.menu_categories || []).reduce(
    (acc, cat) => acc + (cat.items || []).length, 0
  );

  const reservationsList = restaurant.reservations || [];
  const confirmedReservations = reservationsList.filter(r => r.status === 'confirmed').length;

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* 1. TOP NAVIGATION BAR (Matching ABC Inc Portal) */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/90 backdrop-blur-2xl px-4 sm:px-8 py-3 min-h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-black border border-emerald-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)] shrink-0">
            {isClinic ? (
              <Stethoscope className="w-5 h-5 text-cyan-400" />
            ) : (
              <Utensils className="w-5 h-5 text-emerald-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-base tracking-tight leading-none">
                {restaurant.name}
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold uppercase ${
                isClinic 
                  ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' 
                  : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
              }`}>
                {isClinic ? 'Portal Clínico' : 'Portal Cliente'}
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono hidden sm:block">
              TecnOdiel Multi-Tenant • {restaurant.slug}.pages.dev
            </span>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-zinc-400">
          <button
            onClick={() => setActiveTab('billing')}
            className={`transition hover:text-white cursor-pointer ${activeTab === 'billing' ? 'text-white' : ''}`}
          >
            Facturas & Plan
          </button>
          <button
            onClick={() => setActiveTab('hours')}
            className={`transition hover:text-white cursor-pointer ${activeTab === 'hours' ? 'text-white' : ''}`}
          >
            {isClinic ? 'Horarios de Consulta' : 'Horarios & Perfil'}
          </button>
          <a
            href={`https://wa.me/34600000000?text=${encodeURIComponent(`Hola TecnOdiel, soy ${restaurant.name} (clave ${restaurant.client_access_key || ''}). Necesito asistencia.`)}`}
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-white flex items-center gap-1 text-emerald-400"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Soporte Oficial</span>
          </a>
        </nav>

        {/* Right Actions: Key + Notifications + Avatar */}
        <div className="flex items-center gap-3">
          {/* Key Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono">
            <Key className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-zinc-400 text-[11px]">Clave:</span>
            <strong className="text-white text-xs tracking-wider">{restaurant.client_access_key || 'TO-MN892'}</strong>
            <button
              type="button"
              onClick={handleCopyKey}
              className="hover:text-emerald-300 text-zinc-400 transition ml-0.5 p-0.5 cursor-pointer"
              title="Copiar clave"
            >
              {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Bell Icon */}
          <div className="relative p-2 rounded-xl border border-white/10 bg-zinc-900/80 text-zinc-300 hover:text-white cursor-pointer transition">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-emerald-500/40 flex items-center justify-center font-mono font-bold text-xs text-emerald-300 shadow-md">
            {restaurant.name?.slice(0, 2).toUpperCase() || 'TO'}
          </div>
        </div>
      </header>

      {/* 2. WELCOME HERO SECTION WITH SEARCH (Matching Reference Image) */}
      <section className="relative px-4 sm:px-8 pt-8 pb-6 text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>PORTAL DE GESTIÓN EN TIEMPO REAL</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Welcome to Client Portal!
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
          Gestiona los contenidos de <strong className="text-white">{restaurant.name}</strong>, consulta reservas entrantes y mantén el control directo de tu web oficial.
        </p>

        {/* Global Search Bar with AI style */}
        <div className="relative max-w-2xl mx-auto pt-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search docs, tasks, files and other with AI..."
            className="w-full pl-11 pr-24 py-3.5 rounded-2xl bg-zinc-950 border border-white/10 text-white text-xs sm:text-sm placeholder:text-zinc-500 focus:outline-none focus:border-emerald-400 shadow-2xl transition"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <span className="px-2 py-1 rounded-lg bg-zinc-900 border border-white/5 text-[10px] font-mono text-zinc-400">
              Ctrl+K
            </span>
          </div>
        </div>
      </section>

      {/* 3. MAIN DASHBOARD CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 pb-12">
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* LEFT SIDEBAR (Folder Tree & Navigation) */}
          <aside className={`w-full lg:w-64 shrink-0 rounded-2xl bg-zinc-950 border border-white/10 p-4 space-y-5 transition-all shadow-xl`}>
            {/* Top Toggle Line */}
            <div className="flex items-center justify-between text-xs font-mono text-zinc-500 border-b border-white/5 pb-3">
              <span>NAVEGACIÓN</span>
              <button 
                type="button" 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                className="text-zinc-500 hover:text-white p-1 rounded transition"
                title="Colapsar"
              >
                <PanelLeftClose className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Nav Links */}
            <div className="space-y-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`w-full p-2.5 rounded-xl text-left transition flex items-center gap-2.5 font-medium cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Home page</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('bookings')}
                className={`w-full p-2.5 rounded-xl text-left transition flex items-center justify-between font-medium cursor-pointer ${
                  activeTab === 'bookings'
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4" />
                  <span>Tasks & Reservas</span>
                </div>
                {reservationsList.length > 0 && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300">
                    {reservationsList.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('analytics')}
                className={`w-full p-2.5 rounded-xl text-left transition flex items-center gap-2.5 font-medium cursor-pointer ${
                  activeTab === 'analytics'
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Analytics</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('billing')}
                className={`w-full p-2.5 rounded-xl text-left transition flex items-center gap-2.5 font-medium cursor-pointer ${
                  activeTab === 'billing'
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Documents</span>
              </button>
            </div>

            {/* Expandable Project Folder */}
            <div className="pt-2 border-t border-white/5 space-y-1">
              <button
                type="button"
                onClick={() => setIsFolderOpen(!isFolderOpen)}
                className="w-full p-2 rounded-xl text-left text-xs font-semibold text-zinc-400 hover:text-white flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2 truncate">
                  {isFolderOpen ? <FolderOpen className="w-4 h-4 text-emerald-400" /> : <Folder className="w-4 h-4 text-zinc-500" />}
                  <span className="truncate">{restaurant.name}</span>
                </div>
                {isFolderOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              {isFolderOpen && (
                <div className="pl-6 space-y-1 text-xs text-zinc-400 font-mono">
                  <button
                    type="button"
                    onClick={() => setActiveTab('overview')}
                    className="w-full text-left py-1.5 px-2 rounded-lg hover:text-white hover:bg-zinc-900/60 flex items-center gap-2 truncate cursor-pointer"
                  >
                    <FileText className="w-3 h-3 text-zinc-500" />
                    <span className="truncate">Project Plan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('menu')}
                    className="w-full text-left py-1.5 px-2 rounded-lg hover:text-white hover:bg-zinc-900/60 flex items-center gap-2 truncate cursor-pointer"
                  >
                    <FileText className="w-3 h-3 text-emerald-400" />
                    <span className="truncate">{isClinic ? 'Tratamientos' : 'Carta Digital QR'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('billing')}
                    className="w-full text-left py-1.5 px-2 rounded-lg hover:text-white hover:bg-zinc-900/60 flex items-center gap-2 truncate cursor-pointer"
                  >
                    <FileText className="w-3 h-3 text-zinc-500" />
                    <span className="truncate">Contrato TecnOdiel</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Visit Site Pinned Button */}
            <div className="pt-4 border-t border-white/5">
              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full p-2.5 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white text-xs font-semibold transition flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                  <span>Visit site</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">Live</span>
              </a>
            </div>
          </aside>

          {/* CENTER & RIGHT CONTENT */}
          <div className="flex-1 w-full space-y-6">
            {activeTab === 'overview' ? (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* CENTER COLUMN (2/3 width on wide screens) */}
                <div className="xl:col-span-2 space-y-6">
                  {/* Top 3 Action Cards (Files, Tasks & Progress, Reports) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Card 1: Files / Carta */}
                    <button
                      type="button"
                      onClick={() => setActiveTab('menu')}
                      className="p-5 rounded-2xl bg-zinc-950 border border-white/10 hover:border-emerald-500/40 transition shadow-xl text-center space-y-3 group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto text-emerald-400 group-hover:scale-105 transition shadow-md">
                        {isClinic ? <Stethoscope className="w-5 h-5" /> : <Utensils className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white group-hover:text-emerald-300 transition">
                          {isClinic ? 'Tratamientos' : 'Files & Carta'}
                        </h3>
                        <p className="text-xs text-zinc-400 font-mono pt-0.5">
                          {totalDishes} {isClinic ? 'servicios' : 'platos activos'}
                        </p>
                      </div>
                    </button>

                    {/* Card 2: Tasks & Progress / Reservas */}
                    <button
                      type="button"
                      onClick={() => setActiveTab('bookings')}
                      className="p-5 rounded-2xl bg-zinc-950 border border-white/10 hover:border-cyan-500/40 transition shadow-xl text-center space-y-3 group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto text-cyan-400 group-hover:scale-105 transition shadow-md">
                        <CheckSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition">
                          Tasks & Progress
                        </h3>
                        <p className="text-xs text-zinc-400 font-mono pt-0.5">
                          {confirmedReservations} {isClinic ? 'citas' : 'reservas'}
                        </p>
                      </div>
                    </button>

                    {/* Card 3: Reports */}
                    <button
                      type="button"
                      onClick={() => setActiveTab('billing')}
                      className="p-5 rounded-2xl bg-zinc-950 border border-white/10 hover:border-amber-500/40 transition shadow-xl text-center space-y-3 group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto text-amber-400 group-hover:scale-105 transition shadow-md">
                        <Folder className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition">
                          Reports & Web
                        </h3>
                        <p className="text-xs text-zinc-400 font-mono pt-0.5">
                          100% Online (0.2s)
                        </p>
                      </div>
                    </button>
                  </div>

                  {/* Project Progress Tracker (Matching Reference Stepper) */}
                  <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 space-y-4 shadow-xl">
                    <div>
                      <h3 className="font-bold text-base text-white">Project Progress</h3>
                      <p className="text-xs text-zinc-400">
                        Brand & Website Redesign Project — Estado del Despliegue en Cloudflare
                      </p>
                    </div>

                    {/* Visual Stepper */}
                    <div className="relative pt-2 pb-4">
                      {/* Connecting Line */}
                      <div className="absolute top-6 left-6 right-6 h-1 bg-zinc-800 rounded-full" />
                      <div className="absolute top-6 left-6 w-1/2 h-1 bg-emerald-500 rounded-full" />

                      <div className="relative z-10 flex items-center justify-between">
                        {/* Step 1: Done */}
                        <div className="flex flex-col items-center text-center space-y-2">
                          <div className="w-8 h-8 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-white block">Getting started</span>
                            <span className="text-[10px] text-zinc-500 font-mono">Cloudflare Pages</span>
                          </div>
                        </div>

                        {/* Step 2: Active */}
                        <div className="flex flex-col items-center text-center space-y-2">
                          <div className="w-8 h-8 rounded-full bg-white text-black border-2 border-emerald-400 flex items-center justify-center font-bold text-xs shadow-md">
                            2
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-white block">Carta QR & Reservas</span>
                            <span className="text-[10px] text-emerald-400 font-mono">100% Activa</span>
                          </div>
                        </div>

                        {/* Step 3: Next */}
                        <div className="flex flex-col items-center text-center space-y-2">
                          <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/20 text-zinc-400 flex items-center justify-center font-bold text-xs">
                            3
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-zinc-400 block">Launch Stage</span>
                            <span className="text-[10px] text-zinc-500 font-mono">SEO Google Maps</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Client Tasks Checklist (Matching Reference Image) */}
                  <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-white">Client Tasks</h3>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-white/5">
                          {tasks.filter(t => t.completed).length}/{tasks.length}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingTask(!isAddingTask)}
                          className="px-2.5 py-1 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white text-xs font-mono transition flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3 text-emerald-400" />
                          <span>Nueva Tarea</span>
                        </button>
                      </div>
                    </div>

                    {/* Add Task Input */}
                    {isAddingTask && (
                      <form onSubmit={handleAddTask} className="flex items-center gap-2 pt-1 animate-fadeIn">
                        <input
                          type="text"
                          required
                          placeholder="Escribe una nueva tarea o pendiente..."
                          value={newTaskInput}
                          onChange={e => setNewTaskInput(e.target.value)}
                          className="flex-1 px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
                        />
                        <button
                          type="submit"
                          className="px-3.5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs transition cursor-pointer"
                        >
                          Añadir
                        </button>
                      </form>
                    )}

                    {/* Tasks List */}
                    <div className="space-y-2">
                      {tasks.map(task => (
                        <div
                          key={task.id}
                          className={`p-3 rounded-xl border transition flex items-center justify-between gap-3 group ${
                            task.completed
                              ? 'bg-zinc-900/40 border-white/5 text-zinc-500'
                              : 'bg-zinc-900/80 border-white/10 text-zinc-200 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <button
                              type="button"
                              onClick={() => handleToggleTask(task.id)}
                              className="text-zinc-400 hover:text-emerald-400 transition cursor-pointer shrink-0"
                            >
                              {task.completed ? (
                                <CheckSquare className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Square className="w-4 h-4 text-zinc-600" />
                              )}
                            </button>
                            <span className={`text-xs truncate ${task.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                              {task.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 text-[10px] font-mono">
                            <span className="px-2 py-0.5 rounded-full bg-zinc-950 border border-white/10 text-zinc-400">
                              {task.category}
                            </span>
                            {task.priority && (
                              <span className={`px-2 py-0.5 rounded-full border ${
                                task.priority === 'Alta' || task.priority === 'High'
                                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                  : 'bg-zinc-800 text-zinc-400 border-white/5'
                              }`}>
                                {task.priority}
                              </span>
                            )}
                            <span className="text-zinc-500 hidden sm:inline">{task.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN (1/3 width: Chat & Latest Docs) */}
                <div className="space-y-6">
                  {/* Chat Widget (Matching Reference Image) */}
                  <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="relative">
                          <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-emerald-400/50 flex items-center justify-center font-mono font-bold text-xs text-emerald-400">
                            TO
                          </div>
                          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-white">Chat Asistencia</h4>
                          <span className="text-[10px] text-zinc-400 font-mono">Alex • TecnOdiel Huelva</span>
                        </div>
                      </div>

                      <a
                        href={`https://wa.me/34600000000?text=${encodeURIComponent(`Hola Alex, soy ${restaurant.name}. Tengo una consulta sobre mi portal.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg border border-white/10 bg-zinc-900 text-emerald-400 hover:text-white transition"
                        title="Abrir en WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    {/* Messages Timeline */}
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1 scrollbar-thin text-xs">
                      {chatMessages.map(msg => (
                        <div 
                          key={msg.id} 
                          className={`flex flex-col space-y-1 ${msg.sender === 'client' ? 'items-end' : 'items-start'}`}
                        >
                          <div className={`p-3 rounded-2xl max-w-[90%] leading-relaxed ${
                            msg.sender === 'client'
                              ? 'bg-emerald-500 text-black font-medium rounded-tr-sm'
                              : 'bg-zinc-900 border border-white/5 text-zinc-200 rounded-tl-sm'
                          }`}>
                            {msg.text}
                          </div>
                          <span className="text-[9px] font-mono text-zinc-500 px-1">
                            {msg.author} • {msg.time}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={handleSendChatMessage} className="pt-2 border-t border-white/5 flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Add message..."
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-emerald-400"
                      />
                      <button
                        type="submit"
                        className="p-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black transition cursor-pointer shadow-md"
                        title="Enviar mensaje"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>

                  {/* Latest Docs Widget (Matching Reference Image) */}
                  <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 space-y-3 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <h4 className="font-bold text-xs text-white uppercase tracking-wider font-mono">
                        Latest Docs
                      </h4>
                      <span className="text-[10px] text-zinc-500 font-mono">Descargas</span>
                    </div>

                    <div className="space-y-2">
                      {/* Doc 1: Cartel QR Oficial */}
                      <button
                        type="button"
                        onClick={() => setIsQrModalOpen(true)}
                        className="w-full p-2.5 rounded-xl bg-zinc-900/70 border border-white/5 hover:border-emerald-500/30 transition flex items-center justify-between text-left group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="text-xs text-zinc-200 group-hover:text-white truncate">
                            {isClinic ? 'Cartel_QR_Consulta_A4.pdf' : 'Cartel_QR_Oficial_Mesas_A4.pdf'}
                          </span>
                        </div>
                        <QrCode className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400 shrink-0" />
                      </button>

                      {/* Doc 2: Ficha Técnica */}
                      <button
                        type="button"
                        onClick={() => setActiveTab('billing')}
                        className="w-full p-2.5 rounded-xl bg-zinc-900/70 border border-white/5 hover:border-cyan-500/30 transition flex items-center justify-between text-left group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                          <span className="text-xs text-zinc-200 group-hover:text-white truncate">
                            Ficha_Tecnica_Cloudflare.pdf
                          </span>
                        </div>
                        <Download className="w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-400 shrink-0" />
                      </button>

                      {/* Doc 3: Contrato */}
                      <button
                        type="button"
                        onClick={() => setActiveTab('billing')}
                        className="w-full p-2.5 rounded-xl bg-zinc-900/70 border border-white/5 hover:border-amber-500/30 transition flex items-center justify-between text-left group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                          <span className="text-xs text-zinc-200 group-hover:text-white truncate">
                            Contrato_Servicio_TecnOdiel.pdf
                          </span>
                        </div>
                        <Download className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400 shrink-0" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* TAB 2: MENU / TREATMENTS MANAGER */}
            {activeTab === 'menu' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-950 border border-white/10">
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">
                      {isClinic ? 'Gestión de Tratamientos & Servicios' : 'Tu Carta Digital en Tiempo Real'}
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Los cambios se actualizan al instante en el móvil de tus clientes. Sin PDFs ni reimpresiones.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('overview')}
                      className="px-3 py-2 rounded-xl border border-white/10 text-zinc-300 hover:text-white text-xs font-mono transition"
                    >
                      Volver a Home
                    </button>
                    <button
                      onClick={() => handleOpenItemModal()}
                      className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold transition flex items-center gap-2 shadow-lg cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>{isClinic ? 'Añadir Tratamiento' : 'Añadir Plato / Bebida'}</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {(restaurant.menu_categories || []).map(cat => (
                    <div key={cat.id} className="p-5 rounded-2xl bg-zinc-950 border border-white/10 space-y-4">
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <h3 className="font-extrabold text-white text-base tracking-tight flex items-center gap-2">
                          <span>{cat.name}</span>
                          <span className="text-[11px] font-normal text-zinc-500 font-mono">
                            ({(cat.items || []).length} {isClinic ? 'servicios' : 'productos'})
                          </span>
                        </h3>

                        <button
                          onClick={() => handleOpenItemModal(null, cat.id)}
                          className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 hover:border-white/20 text-zinc-300 text-xs font-semibold transition flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Añadir a esta sección</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {(cat.items || []).map(item => (
                          <div 
                            key={item.id}
                            className={`p-4 rounded-xl border transition flex items-start justify-between gap-4 ${
                              item.is_available !== false 
                                ? 'bg-zinc-900/60 border-white/5' 
                                : 'bg-zinc-950/40 border-rose-500/20 opacity-60'
                            }`}
                          >
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-white text-sm">{item.name}</h4>
                                {item.badge && (
                                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono font-medium">
                                    {item.badge}
                                  </span>
                                )}
                                {item.is_available === false && (
                                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono">
                                    Agotado
                                  </span>
                                )}
                              </div>
                              {item.description && (
                                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                                  {item.description}
                                </p>
                              )}
                              <span className="font-mono text-emerald-400 font-extrabold text-sm block pt-1">
                                {typeof item.price === 'number' ? item.price.toFixed(2) : item.price}€
                              </span>
                            </div>

                            <div className="flex flex-col items-end gap-2 shrink-0">
                              <button
                                onClick={() => handleToggleStock(item.id, item.is_available !== false)}
                                className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold transition flex items-center gap-1.5 ${
                                  item.is_available !== false
                                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-rose-500/20 hover:text-rose-300'
                                    : 'bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-emerald-500/20 hover:text-emerald-300'
                                }`}
                              >
                                {item.is_available !== false ? (
                                  <>
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                    <span>Disponible</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3 h-3 text-rose-400" />
                                    <span>Agotado</span>
                                  </>
                                )}
                              </button>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleOpenItemModal(item, cat.id)}
                                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition"
                                  title="Editar"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                                  title="Eliminar"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: BOOKINGS MANAGER */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-5 rounded-2xl bg-zinc-950 border border-white/10">
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">
                      {isClinic ? 'Citas Médicas de Pacientes' : 'Reservas Directas de Clientes'}
                    </h2>
                    <p className="text-xs text-zinc-400">
                      {isClinic ? 'Solicitudes de cita directa sin intermediarios.' : 'Reservas recibidas sin intermediarios ni comisiones por cubierto.'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('overview')}
                      className="px-3 py-2 rounded-xl border border-white/10 text-zinc-300 hover:text-white text-xs font-mono transition"
                    >
                      Volver a Home
                    </button>
                    <span className="text-xs font-mono text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                      0€ comisiones • 100% para ti
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {reservationsList.length === 0 ? (
                    <div className="p-12 text-center rounded-2xl bg-zinc-950 border border-white/5 text-zinc-400 text-xs">
                      No hay reservas pendientes. Las nuevas solicitudes de clientes aparecerán aquí al instante.
                    </div>
                  ) : (
                    reservationsList.map(res => (
                      <div 
                        key={res.id}
                        className="p-5 rounded-2xl bg-zinc-950 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold">
                              {res.booking_code}
                            </span>
                            <h4 className="font-bold text-white text-base">{res.customer_name}</h4>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                              res.status === 'confirmed' 
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                                : res.status === 'cancelled'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            }`}>
                              {res.status === 'confirmed' ? 'Confirmada' : res.status === 'cancelled' ? 'Cancelada' : 'Pendiente'}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 pt-0.5 font-mono">
                            <span>Fecha: {res.reservation_date}</span>
                            <span>Hora: {res.reservation_time}</span>
                            <span>{res.guests_count} {isClinic ? 'pacientes' : 'comensales'}</span>
                            {res.area && <span>Área: {res.area}</span>}
                          </div>

                          {res.special_requests && (
                            <p className="text-[11px] text-amber-300/80 bg-amber-500/5 px-2.5 py-1 rounded-lg border border-amber-500/20">
                              Nota del cliente: {res.special_requests}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {res.customer_phone && (
                            <a
                              href={`https://wa.me/${res.customer_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola ${res.customer_name}, le contactamos desde ${restaurant.name} respecto a su reserva ${res.booking_code}.`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2.5 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition"
                              title="Contactar por WhatsApp"
                            >
                              <Phone className="w-4 h-4 text-emerald-400" />
                            </a>
                          )}

                          {res.status !== 'confirmed' && (
                            <button
                              onClick={() => handleStatusChange(res.id, 'confirmed')}
                              className="px-3.5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold transition flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Confirmar</span>
                            </button>
                          )}

                          {res.status !== 'cancelled' && (
                            <button
                              onClick={() => handleStatusChange(res.id, 'cancelled')}
                              className="px-3 py-2 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 text-xs transition"
                            >
                              Cancelar
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: HOURS & CONTACT MANAGER */}
            {activeTab === 'hours' && (
              <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">
                      {isClinic ? 'Horarios de Consulta & Contacto' : 'Horarios, Teléfonos y Ubicación'}
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Esta información se muestra en el pie de página y botones directos de tu web oficial.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('overview')}
                    className="px-3 py-2 rounded-xl border border-white/10 text-zinc-300 hover:text-white text-xs font-mono transition"
                  >
                    Volver a Home
                  </button>
                </div>

                {saveSuccessMsg && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{saveSuccessMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">Teléfono Público:</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+34 959 00 00 00"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">WhatsApp para Reservas:</label>
                    <input
                      type="text"
                      value={whatsapp}
                      onChange={e => setWhatsapp(e.target.value)}
                      placeholder="+34 600 00 00 00"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">Dirección del Local:</label>
                    <input
                      type="text"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder="Calle Gran Vía, 12"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">Ciudad / Municipio:</label>
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="Huelva"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleSaveHours}
                    disabled={savingProfile}
                    className="px-6 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${savingProfile ? 'animate-spin' : ''}`} />
                    <span>{savingProfile ? 'Guardando...' : 'Guardar Cambios'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 5: BILLING & DOCUMENTS */}
            {activeTab === 'billing' && (
              <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">
                      Tu Plan, Cobertura y Facturación
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Hosting en Cloudflare Pages, soporte técnico y mantenimiento incluido.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('overview')}
                    className="px-3 py-2 rounded-xl border border-white/10 text-zinc-300 hover:text-white text-xs font-mono transition"
                  >
                    Volver a Home
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-2">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Plan Contratado</span>
                    <div className="text-lg font-black text-white">{restaurant.plan_name || 'Plan Web Pro'}</div>
                    <span className="text-xs text-emerald-400 font-mono font-bold block">
                      {restaurant.budget ? `${restaurant.budget}€/mes` : '49€/mes'}
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-2">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Infraestructura</span>
                    <div className="text-lg font-black text-white">Cloudflare Pages</div>
                    <span className="text-xs text-amber-400 font-mono font-bold block">
                      SSL Gratis • 0€ Coste Servidor
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-2">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Permanencia</span>
                    <div className="text-lg font-black text-white">0 Meses</div>
                    <span className="text-xs text-blue-400 font-mono font-bold block">
                      Libertad total de cancelación
                    </span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-900/40 border border-white/5 space-y-3">
                  <h3 className="font-bold text-xs text-white uppercase tracking-wider font-mono">
                    Documentos Oficiales Disponibles para Descarga
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="truncate">Contrato TecnOdiel Sin Permanencia.pdf</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold shrink-0">Firmado</span>
                    </div>

                    <div className="p-3 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="truncate">Certificado SSL & DNS Cloudflare.pdf</span>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold shrink-0">Activo</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: ANALYTICS */}
            {activeTab === 'analytics' && (
              <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">
                      Métricas & Escaneos de tu Carta QR
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Rendimiento de visitas móviles y conversiones en reservas directas.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('overview')}
                    className="px-3 py-2 rounded-xl border border-white/10 text-zinc-300 hover:text-white text-xs font-mono transition"
                  >
                    Volver a Home
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Escaneos QR Mesas</span>
                    <div className="text-2xl font-black text-emerald-400 font-mono">1,420</div>
                    <span className="text-[10px] text-zinc-400 font-mono">+18% este mes</span>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Tiempo de Carga</span>
                    <div className="text-2xl font-black text-cyan-400 font-mono">0.18s</div>
                    <span className="text-[10px] text-zinc-400 font-mono">Ultra rápido</span>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Comisiones Ahorradas</span>
                    <div className="text-2xl font-black text-amber-400 font-mono">340€</div>
                    <span className="text-[10px] text-zinc-400 font-mono">Vs plataformas externas</span>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Uptime Servidor</span>
                    <div className="text-2xl font-black text-white font-mono">99.99%</div>
                    <span className="text-[10px] text-emerald-400 font-mono">Cloudflare Global</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* QR MODAL (High-Definition Printable Poster) */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-sm bg-zinc-950 border border-white/10 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">
              {isClinic ? 'Cartel QR para Consulta' : 'Cartel QR para Mesas'}
            </h3>
            <p className="text-xs text-zinc-400">
              {isClinic ? 'Escanea para acceder a tratamientos y pedir cita previa.' : 'Tus comensales solo tienen que enfocar con la cámara del móvil.'}
            </p>

            <div className="p-4 bg-white rounded-2xl mx-auto inline-block shadow-xl">
              <img src={qrImageUrl} alt="QR Oficial" className="w-48 h-48 mx-auto" />
            </div>

            <div className="text-[11px] font-mono text-emerald-300 font-bold">
              {restaurant.slug}.pages.dev
            </div>

            <div className="flex items-center gap-2 pt-2">
              <a
                href={qrImageUrl}
                download={`${restaurant.slug}-qr-oficial.png`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar Imagen QR</span>
              </a>
              <button
                type="button"
                onClick={() => setIsQrModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white text-xs transition cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ITEM ADD / EDIT MODAL */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <form 
            onSubmit={handleSaveItem}
            className="relative w-full max-w-md max-h-[90dvh] overflow-y-auto bg-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl"
          >
            <h3 className="text-base font-bold text-white">
              {editingItem 
                ? (isClinic ? 'Editar Tratamiento' : 'Editar Plato / Bebida') 
                : (isClinic ? 'Añadir Nuevo Tratamiento' : 'Añadir Nuevo Plato / Bebida')}
            </h3>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Nombre:</label>
              <input
                type="text"
                required
                placeholder={isClinic ? "ej: Limpieza Dental con Ultrasonidos" : "ej: Arroz Caldoso con Bogavante"}
                value={itemName}
                onChange={e => setItemName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Precio (€):</label>
              <input
                type="number"
                step="0.10"
                required
                placeholder="ej: 18.50"
                value={itemPrice}
                onChange={e => setItemPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Descripción:</label>
              <textarea
                rows={2}
                placeholder={isClinic ? "Duración, especialista o detalles de la sesión..." : "Ingredientes principales o presentación..."}
                value={itemDesc}
                onChange={e => setItemDesc(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400 resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Etiqueta Destacada (Opcional):</label>
              <input
                type="text"
                placeholder="ej: Recomendado, Especialidad, Top Ventas..."
                value={itemBadge}
                onChange={e => setItemBadge(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Categoría:</label>
              <select
                value={selectedCatId}
                onChange={e => setSelectedCatId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
              >
                {(restaurant.menu_categories || []).map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setIsItemModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white text-xs transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold transition shadow-md"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
