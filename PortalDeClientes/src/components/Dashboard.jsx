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
  MoreVertical,
  Maximize2,
  Minimize2,
  LogOut,
  ArrowLeft,
  UtensilsCrossed,
  Shield,
  HelpCircle
} from 'lucide-react';
import { 
  toggleMenuItemStock, 
  upsertMenuItem, 
  deleteMenuItem, 
  updateReservationStatus, 
  updateRestaurantProfile 
} from '../lib/supabase';

export default function Dashboard({ 
  restaurant, 
  onRefresh,
  onSwitchRestaurant, 
  onNavigateToMultiwebs, 
  onNavigateToCyS,
  onNavigateToLanding,
  isAdminImpersonating,
  onBackToAdmin
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'menu', 'bookings', 'hours', 'billing', 'analytics', 'messages'
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFolderOpen, setIsFolderOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isChatMaximized, setIsChatMaximized] = useState(false);

  const isClinic = !!(
    restaurant?.collegiate_number || 
    ['dental', 'policlinica', 'fisioterapia', 'estetica', 'psicologia', 'veterinaria', 'oftalmologia', 'podologia', 'nutricion'].includes(restaurant?.category)
  );

  const liveUrl = restaurant?.custom_domain 
    ? `https://${restaurant.custom_domain}` 
    : (isClinic ? `/#/c/${restaurant?.slug || ''}` : `/#/r/${restaurant?.slug || ''}`);

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
    typeof window !== 'undefined' ? `${window.location.origin}${isClinic ? '/#/c/' : '/#/r/'}${restaurant?.slug || ''}` : liveUrl
  )}`;

  // Copiar enlaces y claves
  const handleCopy = () => {
    navigator.clipboard.writeText(liveUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyKey = () => {
    const k = restaurant?.client_access_key || (isClinic ? 'CYS-CLINIC-101' : 'TO-MN892');
    navigator.clipboard.writeText(k);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // Modales y edición de platos/servicios
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState(restaurant?.menu_categories?.[0]?.id || '');
  const [editingItem, setEditingItem] = useState(null);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemBadge, setItemBadge] = useState('');

  // Horarios y teléfonos
  const [phone, setPhone] = useState(restaurant?.phone || '');
  const [whatsapp, setWhatsapp] = useState(restaurant?.whatsapp_number || '');
  const [address, setAddress] = useState(restaurant?.address || '');
  const [city, setCity] = useState(restaurant?.city || 'Huelva');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Tareas pendientes del cliente (guardadas en localStorage)
  const [tasks, setTasks] = useState(() => {
    if (typeof window !== 'undefined' && restaurant?.id) {
      const saved = localStorage.getItem(`tecnodiel_client_tasks_${restaurant.id}`);
      if (saved) {
        try { return JSON.parse(saved); } catch (_) {}
      }
    }
    return [
      { 
        id: 't1', 
        title: isClinic ? 'Revisar precios de tratamientos y especialistas' : 'Comprobar que los precios de la carta sean los correctos', 
        category: 'Carta', 
        priority: 'Importante', 
        completed: true 
      },
      { 
        id: 't2', 
        title: isClinic ? 'Confirmar citas médicas de los próximos pacientes' : 'Confirmar las reservas de mesa para el próximo turno', 
        category: 'Reservas', 
        priority: 'Hoy', 
        completed: false 
      },
      { 
        id: 't3', 
        title: isClinic ? 'Descargar e imprimir el cartel con código QR para recepción' : 'Descargar e imprimir el cartel con código QR para las mesas', 
        category: 'Imprimir', 
        priority: 'Listo', 
        completed: true 
      },
      { 
        id: 't4', 
        title: 'Comprobar que el teléfono y WhatsApp de contacto están al día', 
        category: 'Contacto', 
        priority: 'Normal', 
        completed: false 
      },
      { 
        id: 't5', 
        title: isClinic ? 'Añadir nuevos servicios o promociones del mes' : 'Añadir las sugerencias o platos especiales del fin de semana', 
        category: 'Contenido', 
        priority: 'Opcional', 
        completed: true 
      }
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
      priority: 'Normal',
      completed: false
    };
    setTasks(prev => [newTask, ...prev]);
    setNewTaskInput('');
    setIsAddingTask(false);
  };

  // Chat real con soporte de TecnOdiel
  const [chatMessages, setChatMessages] = useState(() => {
    if (typeof window !== 'undefined' && restaurant?.id) {
      const saved = localStorage.getItem(`tecnodiel_client_chat_${restaurant.id}`);
      if (saved) {
        try { return JSON.parse(saved); } catch (_) {}
      }
    }
    return [
      {
        id: 'msg-1',
        sender: 'advisor',
        author: 'Alex (Técnico TecnOdiel)',
        text: `¡Hola! Tu página web ya está funcionando al 100% en internet. Si quieres cambiar cualquier cosa de la carta, los horarios o las fotos, escríbeme por aquí o por WhatsApp.`,
        time: 'Hace 2 horas'
      },
      {
        id: 'msg-2',
        sender: 'client',
        author: 'Tú',
        text: '¡Muchas gracias! Ya he revisado los precios de la carta y están perfectos.',
        time: 'Hace 1 hora'
      }
    ];
  });

  const [chatInput, setChatInput] = useState('');
  const [isSendingMsg, setIsSendingMsg] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && restaurant?.id) {
      localStorage.setItem(`tecnodiel_client_chat_${restaurant.id}`, JSON.stringify(chatMessages));
    }
  }, [chatMessages, restaurant?.id]);

  const handleSendChatMessage = (textToSend = null) => {
    const text = (textToSend || chatInput).trim();
    if (!text) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'client',
      author: 'Tú',
      text: text,
      time: 'Ahora'
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsSendingMsg(true);

    // Respuesta inteligente automática de soporte técnico (simulada en tiempo real)
    setTimeout(() => {
      let replyText = `¡Mensaje recibido! Nuestro equipo técnico de TecnOdiel lo está revisando. Si necesitas una respuesta urgente o hablar directamente con nosotros, pulsa el botón verde para abrir WhatsApp.`;
      
      const lower = text.toLowerCase();
      if (lower.includes('carta') || lower.includes('precio') || lower.includes('plato') || lower.includes('menu')) {
        replyText = `¡Entendido! Recuerda que puedes cambiar los precios de tus platos en cualquier momento desde la pestaña "Mi Carta y Precios". Si quieres que subamos fotos nuevas o añadamos secciones enteras, dínoslo por WhatsApp y lo hacemos por ti.`;
      } else if (lower.includes('reserva') || lower.includes('mesa') || lower.includes('cita')) {
        replyText = `Puedes ver y confirmar todas tus reservas desde la pestaña "Reservas de Mesas". Si algún cliente tiene una duda urgente, puedes pulsar en su botón de WhatsApp para escribirle con un solo clic.`;
      } else if (lower.includes('horario') || lower.includes('telefono') || lower.includes('abrir') || lower.includes('direccion')) {
        replyText = `Puedes actualizar tus teléfonos y dirección en la pestaña "Horarios y Teléfono". Se cambiará al momento en tu página web.`;
      } else if (lower.includes('factura') || lower.includes('pago') || lower.includes('plan')) {
        replyText = `Tienes disponible la información de tu cuota de 49€/mes y tu contrato sin permanencia en la pestaña "Mis Facturas y Plan".`;
      }

      const advisorReply = {
        id: `msg-${Date.now() + 1}`,
        sender: 'advisor',
        author: 'Alex (Técnico TecnOdiel)',
        text: replyText,
        time: 'Ahora mismo'
      };

      setChatMessages(prev => [...prev, advisorReply]);
      setIsSendingMsg(false);
    }, 700);
  };

  // Quick Chips para preguntas frecuentes en el chat
  const quickQuestions = [
    'Quiero cambiar una foto de mi web',
    'Tengo una duda con una reserva',
    'Actualizar precios de mi carta',
    'Preguntar sobre mi factura'
  ];

  // Gestores de carta y reservas
  const handleToggleStock = async (itemId, currentStatus) => {
    await toggleMenuItemStock(itemId, !currentStatus);
    onRefresh();
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('¿Seguro que deseas eliminar este elemento de la carta?')) {
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
      setSelectedCatId(catId || restaurant?.menu_categories?.[0]?.id || '');
    } else {
      setEditingItem(null);
      setItemName('');
      setItemPrice('');
      setItemDesc('');
      setItemBadge('');
      setSelectedCatId(catId || restaurant?.menu_categories?.[0]?.id || '');
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
    setSaveSuccessMsg('Datos guardados correctamente. Ya se ven en tu web.');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
    onRefresh();
  };

  const totalDishes = (restaurant?.menu_categories || []).reduce(
    (acc, cat) => acc + (cat.items || []).length, 0
  );

  const reservationsList = restaurant?.reservations || [];
  const confirmedReservations = reservationsList.filter(r => r.status === 'confirmed').length;

  // Filtrado simple de búsqueda en vivo
  const filteredDishes = searchQuery.trim() ? (
    (restaurant?.menu_categories || []).flatMap(cat => 
      (cat.items || []).filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  ) : [];

  const filteredReservations = searchQuery.trim() ? (
    reservationsList.filter(r => 
      r.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.booking_code?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ) : [];

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      
      {/* =========================================================================
          1. BARRA LATERAL A LA IZQUIERDA DEL TODO (TOTALMENTE COLAPSABLE / OCULTABLE)
      ========================================================================= */}
      
      {/* Fondo oscuro traslúcido en móviles cuando la barra está abierta */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden animate-fadeIn"
        />
      )}

      {/* Contenedor de la barra lateral anclado al extremo izquierdo de la pantalla */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 bg-zinc-950 border-r border-white/10 flex flex-col justify-between transition-all duration-300 shadow-2xl ${
          isSidebarOpen ? 'w-64 sm:w-72 translate-x-0' : '-translate-x-full w-0 overflow-hidden'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto scrollbar-thin">
          
          {/* Cabecera de la barra lateral con botón para ocultarla */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-3 bg-zinc-900/40">
            <div className="flex items-center gap-2.5 truncate">
              <div className={`w-8 h-8 rounded-xl bg-black border flex items-center justify-center shrink-0 shadow-sm ${
                isClinic ? 'border-cyan-500/40 text-cyan-400' : 'border-emerald-500/40 text-emerald-400'
              }`}>
                {isClinic ? (
                  <Stethoscope className="w-4 h-4" />
                ) : (
                  <Utensils className="w-4 h-4" />
                )}
              </div>
              <div className="truncate">
                <span className="font-black text-white text-sm tracking-tight block truncate">
                  {restaurant.name}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {isClinic ? 'Clínica en línea' : 'Web en línea'}
                </span>
              </div>
            </div>

            {/* Botón para ocultar la barra */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 rounded-lg border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
              title="Ocultar menú lateral"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          {/* Menú de navegación principal (palabras claras y entendibles) */}
          <div className="p-3 sm:p-4 space-y-6 flex-1">
            
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-zinc-500 uppercase px-2 pb-1.5 tracking-wider font-semibold">
                Navegación
              </div>

              {/* Botón 1: Inicio */}
              <button
                type="button"
                onClick={() => { setActiveTab('overview'); if (window.innerWidth < 1024) setIsSidebarOpen(false); }}
                className={`w-full p-2.5 rounded-xl text-left transition flex items-center gap-3 text-xs font-semibold cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Inicio (Resumen)</span>
              </button>

              {/* Botón 2: Mi Carta y Precios / Servicios */}
              <button
                type="button"
                onClick={() => { setActiveTab('menu'); if (window.innerWidth < 1024) setIsSidebarOpen(false); }}
                className={`w-full p-2.5 rounded-xl text-left transition flex items-center justify-between text-xs font-semibold cursor-pointer ${
                  activeTab === 'menu'
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  {isClinic ? <Stethoscope className="w-4 h-4 text-cyan-400" /> : <Utensils className="w-4 h-4 text-emerald-400" />}
                  <span className="truncate">{isClinic ? 'Mis Servicios y Tarifas' : 'Mi Carta y Precios'}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400">
                  {totalDishes}
                </span>
              </button>

              {/* Botón 3: Reservas / Citas */}
              <button
                type="button"
                onClick={() => { setActiveTab('bookings'); if (window.innerWidth < 1024) setIsSidebarOpen(false); }}
                className={`w-full p-2.5 rounded-xl text-left transition flex items-center justify-between text-xs font-semibold cursor-pointer ${
                  activeTab === 'bookings'
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span className="truncate">{isClinic ? 'Citas de Pacientes' : 'Reservas de Mesas'}</span>
                </div>
                {reservationsList.length > 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                    {reservationsList.length}
                  </span>
                )}
              </button>

              {/* Botón 4: Horarios y Teléfonos */}
              <button
                type="button"
                onClick={() => { setActiveTab('hours'); if (window.innerWidth < 1024) setIsSidebarOpen(false); }}
                className={`w-full p-2.5 rounded-xl text-left transition flex items-center gap-3 text-xs font-semibold cursor-pointer ${
                  activeTab === 'hours'
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Horarios y Teléfono</span>
              </button>

              {/* Botón 5: Mis Facturas y Plan */}
              <button
                type="button"
                onClick={() => { setActiveTab('billing'); if (window.innerWidth < 1024) setIsSidebarOpen(false); }}
                className={`w-full p-2.5 rounded-xl text-left transition flex items-center gap-3 text-xs font-semibold cursor-pointer ${
                  activeTab === 'billing'
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <CreditCard className="w-4 h-4 text-purple-400" />
                <span>Mis Facturas y Plan</span>
              </button>

              {/* Botón 6: Visitas a la web */}
              <button
                type="button"
                onClick={() => { setActiveTab('analytics'); if (window.innerWidth < 1024) setIsSidebarOpen(false); }}
                className={`w-full p-2.5 rounded-xl text-left transition flex items-center gap-3 text-xs font-semibold cursor-pointer ${
                  activeTab === 'analytics'
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span>Visitas y Clientes</span>
              </button>

              {/* Botón 7: Mensajes y Soporte */}
              <button
                type="button"
                onClick={() => { setIsChatMaximized(true); if (window.innerWidth < 1024) setIsSidebarOpen(false); }}
                className={`w-full p-2.5 rounded-xl text-left transition flex items-center justify-between text-xs font-semibold cursor-pointer ${
                  isChatMaximized
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>Mensajes y Soporte</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </button>
            </div>

            {/* Sección: Descargas útiles para el local */}
            <div className="pt-2 border-t border-white/5 space-y-1">
              <div className="text-[10px] font-mono text-zinc-500 uppercase px-2 pb-1.5 tracking-wider font-semibold">
                Para tu local
              </div>

              {/* Botón Cartel QR */}
              <button
                type="button"
                onClick={() => setIsQrModalOpen(true)}
                className="w-full p-2 rounded-xl text-left text-xs text-zinc-300 hover:text-white hover:bg-zinc-900 flex items-center gap-2.5 transition cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>Cartel con Código QR</span>
              </button>

              {/* Botón Contrato */}
              <button
                type="button"
                onClick={() => { setActiveTab('billing'); if (window.innerWidth < 1024) setIsSidebarOpen(false); }}
                className="w-full p-2 rounded-xl text-left text-xs text-zinc-300 hover:text-white hover:bg-zinc-900 flex items-center gap-2.5 transition cursor-pointer"
              >
                <FileText className="w-4 h-4 text-zinc-400" />
                <span>Contrato TecnOdiel</span>
              </button>
            </div>
          </div>

          {/* Pie de la barra lateral con botón para ver la web y salir */}
          <div className="p-3 sm:p-4 border-t border-white/10 space-y-2 bg-zinc-900/30">
            {/* Botón Ver mi página web */}
            <a
              href={liveUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full p-2.5 rounded-xl border border-white/15 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition flex items-center justify-between group cursor-pointer shadow-lg"
            >
              <div className="flex items-center gap-2 truncate">
                <ArrowUpRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition shrink-0" />
                <span className="truncate">Ver mi página web</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                Online
              </span>
            </a>

            {/* Botón si el admin está supervisando */}
            {isAdminImpersonating && onBackToAdmin && (
              <button
                type="button"
                onClick={onBackToAdmin}
                className="w-full p-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Volver a Panel Maestro</span>
              </button>
            )}

            {/* Botones de navegación adicionales */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {onNavigateToLanding && (
                <button
                  type="button"
                  onClick={onNavigateToLanding}
                  className="p-1.5 rounded-lg border border-white/5 bg-zinc-900/60 hover:bg-zinc-800 text-[11px] text-zinc-400 hover:text-white transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Inicio</span>
                </button>
              )}
              {onSwitchRestaurant && (
                <button
                  type="button"
                  onClick={onSwitchRestaurant}
                  className="p-1.5 rounded-lg border border-white/5 bg-zinc-900/60 hover:bg-rose-500/10 text-[11px] text-zinc-400 hover:text-rose-300 transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Salir</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          2. ÁREA DE CONTENIDO PRINCIPAL (SE EXPANDE AL 100% CUANDO SE OCULTA LA BARRA)
      ========================================================================= */}
      <div className={`flex-1 flex flex-col transition-all duration-300 min-h-screen ${
        isSidebarOpen ? 'lg:pl-72' : 'lg:pl-0'
      }`}>

        {/* BARRA SUPERIOR (HEADER DEL CONTENIDO) */}
        <header className="sticky top-0 z-30 border-b border-white/10 bg-black/90 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Botón para mostrar la barra si está oculta */}
            {!isSidebarOpen && (
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white transition flex items-center gap-2 cursor-pointer shadow-md"
                title="Mostrar menú lateral"
              >
                <PanelLeft className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold hidden sm:inline">Menú lateral</span>
              </button>
            )}

            {/* Botón de apertura en móviles siempre accesible si está oculta */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300"
              title="Abrir menú"
            >
              <PanelLeft className="w-4 h-4 text-emerald-400" />
            </button>

            {/* Nombre y sección activa */}
            <div className="truncate">
              <span className="font-bold text-white text-sm sm:text-base tracking-tight truncate block">
                {activeTab === 'overview' && 'Inicio • Resumen de tu negocio'}
                {activeTab === 'menu' && (isClinic ? 'Mis Servicios y Tarifas' : 'Mi Carta y Precios')}
                {activeTab === 'bookings' && (isClinic ? 'Citas de Pacientes' : 'Reservas de Mesas')}
                {activeTab === 'hours' && 'Horarios, Teléfonos y Ubicación'}
                {activeTab === 'billing' && 'Mis Facturas y Plan TecnOdiel'}
                {activeTab === 'analytics' && 'Visitas y Clientes de este mes'}
              </span>
              <span className="text-[11px] text-zinc-400 font-mono hidden sm:block truncate">
                {restaurant.name} • {restaurant.slug}.pages.dev
              </span>
            </div>
          </div>

          {/* Acciones de la barra superior */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Clave de acceso con botón de copiar */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono">
              <Key className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-zinc-400 text-[11px]">Tu clave:</span>
              <strong className="text-white text-xs tracking-wider">{restaurant.client_access_key || 'TO-MN892'}</strong>
              <button
                type="button"
                onClick={handleCopyKey}
                className="hover:text-emerald-300 text-zinc-400 transition ml-0.5 p-0.5 cursor-pointer"
                title="Copiar clave de acceso"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Botón WhatsApp de Ayuda Rápida */}
            <a
              href={`https://wa.me/34600000000?text=${encodeURIComponent(`Hola TecnOdiel, soy ${restaurant.name} (clave ${restaurant.client_access_key || ''}). Necesito ayuda con mi panel.`)}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ayuda WhatsApp</span>
            </a>

            {/* Botón grande: Ver mi web */}
            <a
              href={liveUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
              title="Abrir tu página web en internet"
            >
              <ExternalLink className="w-3.5 h-3.5 text-black" />
              <span className="hidden sm:inline">Ver mi web</span>
            </a>
          </div>
        </header>

        {/* HERO Y BUSCADOR INTUITIVO (SOLO EN LA PESTAÑA DE INICIO) */}
        {activeTab === 'overview' && (
          <section className="relative px-4 sm:px-8 pt-8 pb-4 text-center max-w-4xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>PANEL DE CONTROL DIRECTO</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              ¡Hola, {restaurant.name}!
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
              Todo lo que cambies aquí se actualiza al instante en la web de tus clientes y en el código QR. Sin complicaciones y con palabras claras.
            </p>

            {/* Buscador intuitivo en lenguaje humano */}
            <div className="relative max-w-2xl mx-auto pt-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar un plato, una reserva de cliente, horario o ayuda..."
                className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-zinc-950 border border-white/10 text-white text-xs sm:text-sm placeholder:text-zinc-500 focus:outline-none focus:border-emerald-400 shadow-2xl transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Resultados rápidos de búsqueda si el usuario escribe algo */}
            {searchQuery.trim() && (
              <div className="max-w-2xl mx-auto mt-2 p-4 rounded-2xl bg-zinc-900 border border-white/15 text-left space-y-3 animate-fadeIn shadow-2xl">
                <div className="text-xs font-bold text-white uppercase font-mono">
                  Resultados encontrados:
                </div>
                {filteredDishes.length === 0 && filteredReservations.length === 0 ? (
                  <p className="text-xs text-zinc-400">No hemos encontrado ningún plato ni reserva con ese nombre.</p>
                ) : (
                  <div className="space-y-2">
                    {filteredDishes.map(item => (
                      <div 
                        key={item.id} 
                        onClick={() => { setActiveTab('menu'); handleOpenItemModal(item); }}
                        className="p-2.5 rounded-xl bg-black/60 border border-white/5 hover:border-emerald-500/40 cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <Utensils className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="font-bold text-white">{item.name}</span>
                        </div>
                        <span className="font-mono text-emerald-400 font-bold">{item.price}€</span>
                      </div>
                    ))}
                    {filteredReservations.map(res => (
                      <div 
                        key={res.id} 
                        onClick={() => setActiveTab('bookings')}
                        className="p-2.5 rounded-xl bg-black/60 border border-white/5 hover:border-cyan-500/40 cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="font-bold text-white">{res.customer_name}</span>
                          <span className="text-[10px] text-zinc-400 font-mono">({res.guests_count} personas)</span>
                        </div>
                        <span className="font-mono text-zinc-300">{res.reservation_date} a las {res.reservation_time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* CONTENIDO PRINCIPAL POR PESTAÑAS */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6">
          
          {/* =====================================================================
              PESTAÑA 1: INICIO (ESTRUCTURA DE 3 COLUMNAS DEL MOCKUP EN LENGUAJE CLARO)
          ===================================================================== */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* COLUMNA CENTRAL (2/3 de ancho) */}
              <div className="xl:col-span-2 space-y-6">
                
                {/* 3 Tarjetas de Acceso Rápido */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Tarjeta 1: Carta / Menú */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('menu')}
                    className="p-5 rounded-2xl bg-zinc-950 border border-white/10 hover:border-emerald-500/40 transition shadow-xl text-left space-y-3 group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition shadow-md">
                      {isClinic ? <Stethoscope className="w-5 h-5" /> : <Utensils className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white group-hover:text-emerald-300 transition">
                        {isClinic ? 'Mis Servicios' : 'Mi Carta y Precios'}
                      </h3>
                      <p className="text-xs text-zinc-400 font-mono pt-0.5">
                        {totalDishes} {isClinic ? 'servicios listados' : 'platos en la carta'}
                      </p>
                      <p className="text-[11px] text-zinc-500 pt-1">
                        Cambiar precios o marcar platos agotados hoy.
                      </p>
                    </div>
                  </button>

                  {/* Tarjeta 2: Reservas */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('bookings')}
                    className="p-5 rounded-2xl bg-zinc-950 border border-white/10 hover:border-cyan-500/40 transition shadow-xl text-left space-y-3 group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition shadow-md">
                      <CheckSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition">
                        {isClinic ? 'Citas Médicas' : 'Reservas de Mesas'}
                      </h3>
                      <p className="text-xs text-zinc-400 font-mono pt-0.5">
                        {confirmedReservations} {isClinic ? 'citas confirmadas' : 'reservas confirmadas'}
                      </p>
                      <p className="text-[11px] text-zinc-500 pt-1">
                        Ver quién viene hoy y confirmar su mesa.
                      </p>
                    </div>
                  </button>

                  {/* Tarjeta 3: Tu Web en Internet */}
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-5 rounded-2xl bg-zinc-950 border border-white/10 hover:border-amber-500/40 transition shadow-xl text-left space-y-3 group cursor-pointer block"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-amber-400 group-hover:scale-105 transition shadow-md">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition">
                        Tu Web en Internet
                      </h3>
                      <p className="text-xs text-zinc-400 font-mono pt-0.5">
                        100% Activa y Rápida
                      </p>
                      <p className="text-[11px] text-zinc-500 pt-1">
                        Se abre en 0.2 segundos en el móvil.
                      </p>
                    </div>
                  </a>
                </div>

                {/* Pasos para tener tu web perfecta (Stepper en lenguaje 100% entendible) */}
                <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 space-y-4 shadow-xl">
                  <div>
                    <h3 className="font-bold text-base text-white">Pasos para tener tu web perfecta</h3>
                    <p className="text-xs text-zinc-400">
                      Guía sencilla para que tu negocio funcione solo en internet.
                    </p>
                  </div>

                  {/* Barra visual de pasos */}
                  <div className="relative pt-2 pb-2">
                    <div className="absolute top-6 left-6 right-6 h-1 bg-zinc-800 rounded-full" />
                    <div className="absolute top-6 left-6 w-1/2 h-1 bg-emerald-500 rounded-full" />

                    <div className="relative z-10 flex items-center justify-between">
                      {/* Paso 1: Hecho */}
                      <div className="flex flex-col items-center text-center space-y-2 max-w-[120px]">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-white block">1. Web creada</span>
                          <span className="text-[10px] text-zinc-400">Ya está en internet</span>
                        </div>
                      </div>

                      {/* Paso 2: Activo */}
                      <div className="flex flex-col items-center text-center space-y-2 max-w-[120px]">
                        <div className="w-8 h-8 rounded-full bg-white text-black border-2 border-emerald-400 flex items-center justify-center font-bold text-xs shadow-md">
                          2
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-white block">2. Carta y precios</span>
                          <span className="text-[10px] text-emerald-400 font-semibold">Revisar precios</span>
                        </div>
                      </div>

                      {/* Paso 3: Siguiente */}
                      <div className="flex flex-col items-center text-center space-y-2 max-w-[120px]">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/20 text-zinc-400 flex items-center justify-center font-bold text-xs">
                          3
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-zinc-400 block">3. Cartel QR</span>
                          <span className="text-[10px] text-zinc-500">Poner en mesas</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cosas recomendadas por revisar (Checklist interactivo fácil) */}
                <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-base text-white">Cosas recomendadas por revisar</h3>
                      <p className="text-xs text-zinc-400">Marca las tareas que ya tengas listas en tu local.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-zinc-900 text-zinc-300 border border-white/5 font-bold">
                        {tasks.filter(t => t.completed).length} de {tasks.length} listas
                      </span>
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

                  {/* Formulario para añadir tarea */}
                  {isAddingTask && (
                    <form onSubmit={handleAddTask} className="flex items-center gap-2 pt-1 animate-fadeIn">
                      <input
                        type="text"
                        required
                        placeholder="Escribe lo que quieres apuntar o acordarte..."
                        value={newTaskInput}
                        onChange={e => setNewTaskInput(e.target.value)}
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs transition cursor-pointer"
                      >
                        Añadir
                      </button>
                    </form>
                  )}

                  {/* Listado de tareas */}
                  <div className="space-y-2">
                    {tasks.map(task => (
                      <div
                        key={task.id}
                        className={`p-3 rounded-xl border transition flex items-center justify-between gap-3 ${
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
                          <span className={`px-2 py-0.5 rounded-full border ${
                            task.priority === 'Importante' || task.priority === 'Hoy'
                              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                              : 'bg-zinc-800 text-zinc-400 border-white/5'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* COLUMNA DERECHA (1/3: Widget de Chat Funcional & Descargas) */}
              <div className="space-y-6">
                
                {/* WIDGET DE MENSAJES Y SOPORTE */}
                <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-emerald-400/50 flex items-center justify-center font-mono font-bold text-xs text-emerald-400 shadow-md">
                          TO
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black animate-pulse" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-white">Hablar con Soporte</h4>
                        <span className="text-[10px] text-zinc-400 font-mono">Alex • Técnico Asignado</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Botón para poner el chat en pantalla completa */}
                      <button
                        type="button"
                        onClick={() => setIsChatMaximized(true)}
                        className="p-1.5 rounded-lg border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition cursor-pointer"
                        title="Poner el chat en grande"
                      >
                        <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                      </button>

                      {/* Botón directo para WhatsApp */}
                      <a
                        href={`https://wa.me/34600000000?text=${encodeURIComponent(`Hola Alex, soy ${restaurant.name}. Tengo una consulta sobre mi web.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-emerald-400 hover:text-emerald-300 transition"
                        title="Abrir en WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Historial de mensajes en tiempo real */}
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1 scrollbar-thin text-xs">
                    {chatMessages.map(msg => (
                      <div 
                        key={msg.id} 
                        className={`flex flex-col space-y-1 ${msg.sender === 'client' ? 'items-end' : 'items-start'}`}
                      >
                        <div className={`p-3 rounded-2xl max-w-[90%] leading-relaxed ${
                          msg.sender === 'client'
                            ? 'bg-emerald-500 text-black font-semibold rounded-tr-sm shadow-md'
                            : 'bg-zinc-900 border border-white/5 text-zinc-200 rounded-tl-sm'
                        }`}>
                          {msg.text}
                        </div>
                        <span className="text-[9px] font-mono text-zinc-500 px-1">
                          {msg.author} • {msg.time}
                        </span>
                      </div>
                    ))}
                    {isSendingMsg && (
                      <div className="text-[10px] text-emerald-400 font-mono italic animate-pulse">
                        Alex está escribiendo una respuesta...
                      </div>
                    )}
                  </div>

                  {/* Preguntas rápidas en 1 clic */}
                  <div className="pt-2 border-t border-white/5 space-y-1.5">
                    <span className="text-[10px] text-zinc-500 font-mono block">Preguntas rápidas:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {quickQuestions.slice(0, 2).map((q, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSendChatMessage(q)}
                          className="text-[10px] px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:border-emerald-500/30 transition text-left cursor-pointer truncate max-w-full"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Formulario de envío de mensaje */}
                  <form 
                    onSubmit={e => { e.preventDefault(); handleSendChatMessage(); }} 
                    className="pt-2 border-t border-white/5 flex items-center gap-2"
                  >
                    <input
                      type="text"
                      placeholder="Escribe tu mensaje a soporte..."
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-emerald-400"
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim()}
                      className="p-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black transition cursor-pointer shadow-md disabled:opacity-50"
                      title="Enviar mensaje"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>

                {/* DOCUMENTOS Y CARTELES PARA DESCARGAR */}
                <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <h4 className="font-bold text-xs text-white uppercase tracking-wider font-mono">
                      Documentos y Carteles
                    </h4>
                    <span className="text-[10px] text-zinc-500 font-mono">Descargas</span>
                  </div>

                  <div className="space-y-2">
                    {/* Cartel QR A4 */}
                    <button
                      type="button"
                      onClick={() => setIsQrModalOpen(true)}
                      className="w-full p-2.5 rounded-xl bg-zinc-900/70 border border-white/5 hover:border-emerald-500/30 transition flex items-center justify-between text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <QrCode className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-xs text-zinc-200 group-hover:text-white truncate">
                          {isClinic ? 'Cartel QR para Consulta (Folio A4)' : 'Cartel QR para Mesas (Folio A4)'}
                        </span>
                      </div>
                      <Download className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400 shrink-0" />
                    </button>

                    {/* Contrato de servicio */}
                    <button
                      type="button"
                      onClick={() => setActiveTab('billing')}
                      className="w-full p-2.5 rounded-xl bg-zinc-900/70 border border-white/5 hover:border-purple-500/30 transition flex items-center justify-between text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                        <span className="text-xs text-zinc-200 group-hover:text-white truncate">
                          Contrato TecnOdiel (Sin Permanencia)
                        </span>
                      </div>
                      <Download className="w-3.5 h-3.5 text-zinc-500 group-hover:text-purple-400 shrink-0" />
                    </button>

                    {/* Ficha de Garantía Web */}
                    <button
                      type="button"
                      onClick={() => setActiveTab('billing')}
                      className="w-full p-2.5 rounded-xl bg-zinc-900/70 border border-white/5 hover:border-cyan-500/30 transition flex items-center justify-between text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="text-xs text-zinc-200 group-hover:text-white truncate">
                          Ficha de Seguridad y Garantía Web
                        </span>
                      </div>
                      <Download className="w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-400 shrink-0" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              PESTAÑA 2: GESTOR DE CARTA / SERVICIOS
          ===================================================================== */}
          {activeTab === 'menu' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-950 border border-white/10">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    {isClinic ? 'Tus Servicios y Tratamientos' : 'Tu Carta Digital en Tiempo Real'}
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Cualquier cambio de precio o plato se actualiza al momento en el móvil de los clientes.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className="px-3.5 py-2 rounded-xl border border-white/10 text-zinc-300 hover:text-white text-xs font-mono transition"
                  >
                    Volver a Inicio
                  </button>
                  <button
                    onClick={() => handleOpenItemModal()}
                    className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold transition flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>{isClinic ? 'Añadir Servicio' : 'Añadir Nuevo Plato'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {(restaurant?.menu_categories || []).map(cat => (
                  <div key={cat.id} className="p-5 rounded-2xl bg-zinc-950 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <h3 className="font-extrabold text-white text-base tracking-tight flex items-center gap-2">
                        <span>{cat.name}</span>
                        <span className="text-[11px] font-normal text-zinc-500 font-mono">
                          ({(cat.items || []).length} {isClinic ? 'servicios' : 'platos'})
                        </span>
                      </h3>

                      <button
                        onClick={() => handleOpenItemModal(null, cat.id)}
                        className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 hover:border-white/20 text-zinc-300 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
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
                                  Agotado hoy
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
                            {/* Botón para marcar disponible o agotado */}
                            <button
                              onClick={() => handleToggleStock(item.id, item.is_available !== false)}
                              className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
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
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
                                title="Editar plato"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                                title="Eliminar de la carta"
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

          {/* =====================================================================
              PESTAÑA 3: GESTOR DE RESERVAS / CITAS
          ===================================================================== */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-950 border border-white/10">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    {isClinic ? 'Citas de Pacientes' : 'Reservas de Mesas Directas'}
                  </h2>
                  <p className="text-xs text-zinc-400">
                    {isClinic ? 'Citas solicitadas directamente desde tu página web.' : 'Reservas recibidas directamente de los clientes sin comisiones a terceros.'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className="px-3.5 py-2 rounded-xl border border-white/10 text-zinc-300 hover:text-white text-xs font-mono transition"
                  >
                    Volver a Inicio
                  </button>
                  <span className="text-xs font-mono text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                    0€ comisiones por cubierto
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {reservationsList.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl bg-zinc-950 border border-white/5 text-zinc-400 text-xs space-y-2">
                    <p className="text-zinc-300 font-semibold">No hay reservas pendientes por el momento.</p>
                    <p className="text-zinc-500">En cuanto un cliente reserve mesa desde la web, aparecerá aquí con su teléfono para que puedas confirmárselo al instante.</p>
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
                            {res.status === 'confirmed' ? 'Confirmada' : res.status === 'cancelled' ? 'Cancelada' : 'Pendiente de Confirmar'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 pt-0.5 font-mono">
                          <span>Fecha: {res.reservation_date}</span>
                          <span>Hora: {res.reservation_time}</span>
                          <span>{res.guests_count} {isClinic ? 'pacientes' : 'comensales'}</span>
                          {res.area && <span>Zona: {res.area}</span>}
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
                            className="p-2.5 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition flex items-center gap-1.5"
                            title="Hablar por WhatsApp con el cliente"
                          >
                            <Phone className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-mono hidden sm:inline">WhatsApp</span>
                          </a>
                        )}

                        {res.status !== 'confirmed' && (
                          <button
                            onClick={() => handleStatusChange(res.id, 'confirmed')}
                            className="px-3.5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Confirmar</span>
                          </button>
                        )}

                        {res.status !== 'cancelled' && (
                          <button
                            onClick={() => handleStatusChange(res.id, 'cancelled')}
                            className="px-3 py-2 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 text-xs transition cursor-pointer"
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

          {/* =====================================================================
              PESTAÑA 4: HORARIOS, TELÉFONOS Y UBICACIÓN
          ===================================================================== */}
          {activeTab === 'hours' && (
            <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    {isClinic ? 'Horarios de Consulta y Contacto' : 'Horarios, Teléfonos y Ubicación'}
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Esta información es la que verán los clientes en los botones de llamada de tu página web.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('overview')}
                  className="px-3.5 py-2 rounded-xl border border-white/10 text-zinc-300 hover:text-white text-xs font-mono transition"
                >
                  Volver a Inicio
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
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">Teléfono Público de Llamadas:</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+34 959 00 00 00"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">Teléfono WhatsApp para Reservas:</label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value)}
                    placeholder="+34 600 00 00 00"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">Dirección del Local o Consulta:</label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Calle Gran Vía, 12"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">Ciudad o Municipio:</label>
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

          {/* =====================================================================
              PESTAÑA 5: FACTURAS Y SERVICIO TECNODIEL
          ===================================================================== */}
          {activeTab === 'billing' && (
            <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    Tu Cuota Mensual y Servicio TecnOdiel
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Tu web está alojada en servidores de alta velocidad con soporte técnico y mantenimiento incluido.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('overview')}
                  className="px-3.5 py-2 rounded-xl border border-white/10 text-zinc-300 hover:text-white text-xs font-mono transition"
                >
                  Volver a Inicio
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-2">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Cuota Mensual</span>
                  <div className="text-lg font-black text-white">{restaurant.plan_name || 'Plan Web Pro'}</div>
                  <span className="text-xs text-emerald-400 font-mono font-bold block">
                    {restaurant.budget ? `${restaurant.budget}€/mes` : '49€/mes'}
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-2">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Servidor y Mantenimiento</span>
                  <div className="text-lg font-black text-white">Incluido al 100%</div>
                  <span className="text-xs text-amber-400 font-mono font-bold block">
                    Seguridad y copias de seguridad diarias
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-2">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Permanencia</span>
                  <div className="text-lg font-black text-white">0 Meses</div>
                  <span className="text-xs text-blue-400 font-mono font-bold block">
                    Sin ataduras, puedes cancelar cuando quieras
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900/40 border border-white/5 space-y-3">
                <h3 className="font-bold text-xs text-white uppercase tracking-wider font-mono">
                  Documentos Oficiales Disponibles
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="truncate">Contrato del Servicio TecnOdiel.pdf</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold shrink-0">Activo</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="truncate">Ficha de Garantía y Velocidad Web.pdf</span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold shrink-0">Activo</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              PESTAÑA 6: VISITAS Y RENDIMIENTO
          ===================================================================== */}
          {activeTab === 'analytics' && (
            <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    ¿Cuánta gente visita tu página web?
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Datos reales de visitas y escaneos de clientes en tu local.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('overview')}
                  className="px-3.5 py-2 rounded-xl border border-white/10 text-zinc-300 hover:text-white text-xs font-mono transition"
                >
                  Volver a Inicio
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Lecturas de Código QR este mes</span>
                  <div className="text-3xl font-black text-emerald-400 font-mono">1.420</div>
                  <span className="text-[10px] text-zinc-400 font-mono">+18% más que el mes pasado</span>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Rapidez de carga en el móvil</span>
                  <div className="text-3xl font-black text-cyan-400 font-mono">0.2 seg</div>
                  <span className="text-[10px] text-zinc-400 font-mono">Se abre al instante sin esperar</span>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Dinero Ahorrado en Comisiones</span>
                  <div className="text-3xl font-black text-amber-400 font-mono">340€</div>
                  <span className="text-[10px] text-zinc-400 font-mono">100% de los ingresos para ti</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* =========================================================================
          3. MODAL DE CHAT EN PANTALLA COMPLETA ("QUE SE PUEDA PONER EN GRANDE")
      ========================================================================= */}
      {isChatMaximized && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-fadeIn">
          <div className="relative w-full max-w-4xl h-[88vh] bg-zinc-950 border border-white/10 rounded-3xl flex flex-col shadow-2xl overflow-hidden">
            
            {/* Cabecera del chat en grande */}
            <div className="p-4 sm:p-5 border-b border-white/10 bg-zinc-900/80 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-black border border-emerald-400/60 flex items-center justify-center font-mono font-black text-sm text-emerald-400 shadow-md">
                    TO
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-black animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    Chat Directo con Soporte TecnOdiel
                  </h3>
                  <p className="text-[11px] text-zinc-400 font-mono">
                    Alex (Técnico asignado a {restaurant.name}) • En línea ahora
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Botón WhatsApp prioritario */}
                <a
                  href={`https://wa.me/34600000000?text=${encodeURIComponent(`Hola Alex, soy ${restaurant.name} (clave ${restaurant.client_access_key || ''}). Tengo una consulta técnica.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Abrir en WhatsApp</span>
                </a>

                {/* Botón minimizar / cerrar pantalla completa */}
                <button
                  type="button"
                  onClick={() => setIsChatMaximized(false)}
                  className="p-2 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition cursor-pointer"
                  title="Minimizar chat"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Zona de mensajes ampliada */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 scrollbar-thin">
              <div className="text-center py-2">
                <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-zinc-900 border border-white/5 text-zinc-400">
                  Canal de soporte directo para {restaurant.name} • Horario: Lunes a Domingo
                </span>
              </div>

              {chatMessages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`flex flex-col space-y-1.5 ${msg.sender === 'client' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`p-4 rounded-2xl max-w-[80%] leading-relaxed text-sm ${
                    msg.sender === 'client'
                      ? 'bg-emerald-500 text-black font-semibold rounded-tr-sm shadow-lg'
                      : 'bg-zinc-900 border border-white/10 text-zinc-100 rounded-tl-sm shadow-md'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 px-1">
                    {msg.author} • {msg.time}
                  </span>
                </div>
              ))}

              {isSendingMsg && (
                <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 max-w-[280px] text-xs text-emerald-400 font-mono animate-pulse flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Alex está redactando la respuesta...</span>
                </div>
              )}
            </div>

            {/* Preguntas frecuentes rápidas */}
            <div className="px-4 sm:px-6 py-2 border-t border-white/5 bg-zinc-900/40 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono text-zinc-500">Preguntas frecuentes:</span>
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendChatMessage(q)}
                  className="text-xs px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 hover:border-emerald-500/40 text-zinc-300 hover:text-white transition cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input para escribir mensaje en grande */}
            <form 
              onSubmit={e => { e.preventDefault(); handleSendChatMessage(); }} 
              className="p-4 sm:p-5 border-t border-white/10 bg-zinc-950 flex items-center gap-3"
            >
              <input
                type="text"
                placeholder="Escribe tu mensaje o duda aquí..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                className="flex-1 px-4 py-3 rounded-2xl bg-zinc-900 border border-white/10 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-emerald-400"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="px-6 py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-sm transition cursor-pointer shadow-lg disabled:opacity-50 flex items-center gap-2"
              >
                <span>Enviar</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          4. MODAL DEL CARTEL CON CÓDIGO QR PARA IMPRIMIR
      ========================================================================= */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-sm bg-zinc-950 border border-white/10 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">
              {isClinic ? 'Cartel QR para Recepción y Mostrador' : 'Cartel QR para Mesas y Barra'}
            </h3>
            <p className="text-xs text-zinc-400">
              {isClinic ? 'Tus pacientes solo tienen que enfocar con la cámara de su móvil para ver servicios y pedir cita.' : 'Tus clientes solo tienen que enfocar con la cámara del móvil para ver la carta y reservar.'}
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

      {/* =========================================================================
          5. MODAL PARA AÑADIR O EDITAR PLATOS / SERVICIOS
      ========================================================================= */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <form 
            onSubmit={handleSaveItem}
            className="relative w-full max-w-md max-h-[90dvh] overflow-y-auto bg-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl"
          >
            <h3 className="text-base font-bold text-white">
              {editingItem 
                ? (isClinic ? 'Editar Servicio' : 'Editar Plato') 
                : (isClinic ? 'Añadir Nuevo Servicio' : 'Añadir Nuevo Plato a la Carta')}
            </h3>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Nombre del plato o servicio:</label>
              <input
                type="text"
                required
                placeholder={isClinic ? "ej: Limpieza Dental con Ultrasonidos" : "ej: Arroz marinero con gambas de Huelva"}
                value={itemName}
                onChange={e => setItemName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Precio en euros (€):</label>
              <input
                type="number"
                step="0.10"
                required
                placeholder="ej: 14.50"
                value={itemPrice}
                onChange={e => setItemPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Descripción o ingredientes:</label>
              <textarea
                rows={2}
                placeholder={isClinic ? "Duración, especialista o detalles de la sesión..." : "Ingredientes principales o cómo se presenta..."}
                value={itemDesc}
                onChange={e => setItemDesc(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400 resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Etiqueta destacada (Opcional):</label>
              <input
                type="text"
                placeholder="ej: Especialidad de la casa, Recomendado del chef..."
                value={itemBadge}
                onChange={e => setItemBadge(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Categoría de la carta:</label>
              <select
                value={selectedCatId}
                onChange={e => setSelectedCatId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
              >
                {(restaurant?.menu_categories || []).map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setIsItemModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white text-xs transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold transition shadow-md cursor-pointer"
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
