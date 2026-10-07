import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  SquareKanban,
  Clock,
  Handshake,
  MessagesSquare,
  Settings,
  Search,
  Plus,
  Bell,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  LogOut,
  LogIn,
  Sun,
  Moon,
  Database,
  Github,
  Triangle,
  MessageCircle,
  FolderOpen,
  ArrowDownLeft,
  ArrowUpRight,
  GitCommitHorizontal,
  FolderPlus,
  RefreshCw,
  Rocket,
  PiggyBank,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Utensils,
  Stethoscope,
  Boxes,
  X,
  Send,
  Building2,
  UserRound,
  Filter,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Phone,
  Eye
} from 'lucide-react';
import { MOCK_TENANTS } from '../../../../src/multi-tenant/mockTenants.js';
import { fetchLeads, updateLead } from '../../../../src/lib/leads.js';

// ── CONFIGURACIÓN & METADATOS EXACTOS DE VIRTUALDESK-MAIN ──
export const APP_CONFIG = {
  name: 'TECNODIEL',
  shortName: 'TO',
  location: 'Huelva, España',
  agencyPreviewDomain: 'preview.tecnodiel.es'
};

export const PARTNERS = [
  { id: 'mario', name: 'Mario', role: 'Full-Stack Architect', email: 'mario@tecnodiel.es', availability: 'Tiempo completo', avatar: 'M', color: 'bg-indigo-600' },
  { id: 'dani', name: 'Dani', role: 'UI/UX & Creative', email: 'dani@tecnodiel.es', availability: 'Tiempo completo', avatar: 'D', color: 'bg-purple-600' },
  { id: 'javier', name: 'Javier', role: 'Operations & Business', email: 'javier@tecnodiel.es', availability: 'Media jornada', avatar: 'J', color: 'bg-emerald-600' }
];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Panel', title: 'Panel general', icon: LayoutDashboard },
  { id: 'projects', label: 'Proyectos', title: 'Proyectos', icon: FolderKanban },
  { id: 'kanban', label: 'Kanban', title: 'Kanban', icon: SquareKanban },
  { id: 'hours', label: 'Horas y Reparto', title: 'Horas y Reparto', icon: Clock },
  { id: 'crm', label: 'CRM', title: 'CRM de clientes', icon: Handshake },
  { id: 'chats', label: 'Chats', title: 'Chats', icon: MessagesSquare },
  { id: 'settings', label: 'Ajustes', title: 'Ajustes', icon: Settings }
];

const BUSINESS_TYPE_META = {
  hosteleria: { label: 'Hostelería', icon: Utensils, tint: 'bg-amber-500/15 text-amber-300' },
  clinica: { label: 'Clínica & Salud', icon: Stethoscope, tint: 'bg-cyan-500/15 text-cyan-300' },
  saas: { label: 'SaaS Multi-Tenant', icon: Boxes, tint: 'bg-indigo-500/15 text-indigo-300' }
};

const STATUS_META = {
  planeado: { label: 'Planeado', badge: 'bg-gray-800 text-gray-300 ring-1 ring-gray-700' },
  en_progreso: { label: 'En progreso', badge: 'bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-500/30' },
  hecho: { label: 'Hecho', badge: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30' }
};

const PIPELINE_STAGES = [
  { id: 'nuevo', label: 'Solicitudes nuevas' },
  { id: 'contactado', label: 'Contactado' },
  { id: 'reunion', label: 'Reunión' },
  { id: 'propuesta', label: 'Propuesta' },
  { id: 'negociacion', label: 'Negociación' },
  { id: 'cerrado', label: 'Cerrado' }
];

const eur = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

export default function VirtualDeskAdminApp({ onSwitchToClientView }) {
  // Estado de navegación
  const [activeTab, setActiveTab] = useState('dashboard');
  const [partner, setPartner] = useState(PARTNERS[0]); // Mario por defecto
  const [theme, setTheme] = useState('dark');

  // Check-in State (idéntico a VirtualDesk-main)
  const [activeCheckin, setActiveCheckin] = useState({
    active: false,
    startedAt: null,
    projectName: 'TecnOdiel Core Multi-Tenant',
    projectId: 'p1'
  });
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isCheckinMenuOpen, setIsCheckinMenuOpen] = useState(false);

  // Search & Notifications & Profile
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isChatWidgetOpen, setIsChatWidgetOpen] = useState(false);

  // Cronómetro del Check-in
  useEffect(() => {
    let timer = null;
    if (activeCheckin.active && activeCheckin.startedAt) {
      timer = setInterval(() => {
        const diff = Math.floor((Date.now() - activeCheckin.startedAt) / 1000);
        setElapsedSeconds(diff);
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(timer);
  }, [activeCheckin]);

  const formatTimer = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const handleStartCheckin = (projectId, projectName) => {
    setActiveCheckin({
      active: true,
      startedAt: Date.now(),
      projectId,
      projectName
    });
    setIsCheckinMenuOpen(false);
  };

  const handleStopCheckin = () => {
    setActiveCheckin({
      active: false,
      startedAt: null,
      projectName: null,
      projectId: null
    });
    setIsCheckinMenuOpen(false);
  };

  // Keyboard shortcut Ctrl+K / Cmd+K para buscador global
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsNotificationsOpen(false);
        setIsProfileOpen(false);
        setIsCheckinMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Notificaciones
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Push a main verificado', body: 'Mario subió el aislamiento total DOM/CSS de las 12 plantillas.', time: 'Hace 5 min', read: false },
    { id: 2, title: 'Nuevo Lead en CRM', body: 'Dr. Alejandro Morales (Clínica Dental Sevilla) agendó demo.', time: 'Hace 23 min', read: false },
    { id: 3, title: 'Despliegue Vercel Operativo', body: 'preview.tecnodiel.es sincronizado con Cloudflare SSL.', time: 'Hace 1 h', read: true }
  ]);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Integraciones (VirtualDesk-main exacto)
  const integrations = [
    { id: 'supabase', name: 'Supabase', icon: Database, tint: 'bg-emerald-500/15 text-emerald-300', status: 'Conectado', statusClass: 'bg-emerald-500/10 text-emerald-400', details: 'PostgreSQL · Auth · Edge Functions' },
    { id: 'github', name: 'GitHub', icon: Github, tint: 'bg-gray-700/50 text-gray-200', status: 'Demo', statusClass: 'bg-amber-500/10 text-amber-300', details: 'tecnodiel/saas-core · branch main' },
    { id: 'vercel', name: 'Vercel', icon: Triangle, tint: 'bg-white/10 text-white', status: 'Operativo', statusClass: 'bg-emerald-500/10 text-emerald-400', details: 'preview.tecnodiel.es · auto-deploy' },
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, tint: 'bg-green-500/15 text-green-300', status: 'Conectado', statusClass: 'bg-emerald-500/10 text-emerald-400', details: 'Cloud API v19.0 · webhook activo' }
  ];

  // Proyectos / Tenants vinculados
  const [projectsList, setProjectsList] = useState([
    {
      id: 'p1',
      name: 'Hostelería Multi-Tenant',
      businessName: 'Plataforma SaaS Hostelería (6 Plantillas)',
      businessType: 'saas',
      status: 'en_progreso',
      progress: 92,
      price: 2400,
      layout: 'split',
      contributors: ['mario', 'dani'],
      tenantsCount: 6,
      tenantsLive: 6,
      repo: 'tecnodiel/hosteleria-platform'
    },
    {
      id: 'p2',
      name: 'Clínicas & Salud Multi-Tenant',
      businessName: 'Plataforma SaaS Clínicas (6 Plantillas)',
      businessType: 'saas',
      status: 'en_progreso',
      progress: 88,
      price: 2600,
      layout: 'centered',
      contributors: ['mario', 'javier'],
      tenantsCount: 6,
      tenantsLive: 6,
      repo: 'tecnodiel/clinicas-platform'
    },
    {
      id: 'p3',
      name: 'Noir & Atelier',
      businessName: 'Restaurante Gastronómico de Autor',
      businessType: 'hosteleria',
      status: 'hecho',
      progress: 100,
      price: 850,
      layout: 'split',
      contributors: ['mario', 'dani'],
      tenantsCount: 1,
      tenantsLive: 1,
      repo: 'noir-atelier.tecnodiel.app'
    },
    {
      id: 'p4',
      name: 'Smash & Destroy',
      businessName: 'Hamburguesería Neo-Bento',
      businessType: 'hosteleria',
      status: 'hecho',
      progress: 100,
      price: 650,
      layout: 'centered',
      contributors: ['dani'],
      tenantsCount: 1,
      tenantsLive: 1,
      repo: 'smash-destroy.tecnodiel.app'
    },
    {
      id: 'p5',
      name: 'Swiss Dental Luxury',
      businessName: 'Clínica Odontológica de Lujo',
      businessType: 'clinica',
      status: 'hecho',
      progress: 100,
      price: 950,
      layout: 'split',
      contributors: ['mario'],
      tenantsCount: 1,
      tenantsLive: 1,
      repo: 'swiss-dental.tecnodiel.app'
    }
  ]);

  // Kanban Tasks
  const [kanbanTasks, setKanbanTasks] = useState([
    { id: 'k1', title: 'Text masking clip-path en Awwwards Cinematic', subtitle: 'Hostelería', status: 'hecho', assignee: 'mario', projectId: 'p1' },
    { id: 'k2', title: 'Spring physics (400/10) en Neo-Bento Brutalist', subtitle: 'Hostelería', status: 'hecho', assignee: 'dani', projectId: 'p1' },
    { id: 'k3', title: 'Scroll horizontal y tracking en Horizontal Zen', subtitle: 'Clínicas', status: 'en_progreso', assignee: 'mario', projectId: 'p2' },
    { id: 'k4', title: 'Línea de escáner luminosa en Tech-Ortho', subtitle: 'Clínicas', status: 'en_progreso', assignee: 'dani', projectId: 'p2' },
    { id: 'k5', title: 'Onboarding Dr. Morales (Clínica Sevilla)', subtitle: 'CRM', status: 'planeado', assignee: 'javier', projectId: 'p2' },
    { id: 'k6', title: 'Auditoría SEO & rendimiento Lighthouse 99+', subtitle: 'Global', status: 'planeado', assignee: 'mario', projectId: 'p1' }
  ]);

  // CRM Leads
  const [crmLeads, setCrmLeads] = useState([
    { id: 'l1', businessName: 'Restaurante El Faro', contactName: 'Alfonso Gómez', city: 'Huelva', stage: 'contactado', value: 750, owner: 'javier', days: 2 },
    { id: 'l2', businessName: 'Clínica Dr. Morales', contactName: 'Dr. Alejandro Morales', city: 'Sevilla', stage: 'reunion', value: 950, owner: 'javier', days: 1 },
    { id: 'l3', businessName: 'Botanical Velvet Lounge', contactName: 'Laura Merino', city: 'Huelva', stage: 'propuesta', value: 850, owner: 'dani', days: 3 },
    { id: 'l4', businessName: 'FisioSport Avanzada', contactName: 'Marcos Rivas', city: 'Sevilla', stage: 'negociacion', value: 1100, owner: 'mario', days: 4 },
    { id: 'l5', businessName: 'Noir & Atelier', contactName: 'Sébastien Leclair', city: 'Huelva', stage: 'cerrado', value: 850, owner: 'mario', days: 0 },
    { id: 'l6', businessName: 'Swiss Dental Luxury', contactName: 'Dra. Beatríz Von', city: 'Sevilla', stage: 'cerrado', value: 950, owner: 'mario', days: 0 }
  ]);

  // Solicitudes reales enviadas desde el formulario de la landing
  const [webLeads, setWebLeads] = useState([]);
  const [leadsError, setLeadsError] = useState(null);
  const [leadsLoading, setLeadsLoading] = useState(false);

  const loadWebLeads = useCallback(async () => {
    setLeadsLoading(true);
    const { rows, error } = await fetchLeads();
    setWebLeads(rows);
    setLeadsError(error);
    setLeadsLoading(false);
  }, []);

  useEffect(() => { loadWebLeads(); }, [loadWebLeads]);

  const moveWebLead = async (lead, stage) => {
    setWebLeads(prev => prev.map(l => (l.id === lead.id ? { ...l, stage } : l)));
    await updateLead(lead.id, { stage });
  };

  const createSiteForLead = (lead) => {
    const isHealth = /cl[ií]nica|salud|est[eé]tica|bienestar/i.test(lead.sector || '');
    window.location.hash = isHealth ? '#/cys' : '#/multiwebs';
  };

  // Chats
  const [chatTab, setChatTab] = useState('clientes'); // 'clientes' o 'equipo'
  const [clientChats, setClientChats] = useState([
    {
      id: 'c1',
      clientName: 'Noir & Atelier (Hostelería)',
      lastMsg: 'Hola Mario, ¿podemos subir el nuevo menú de primavera?',
      time: '14:22',
      unread: 1,
      messages: [
        { id: 1, sender: 'Noir & Atelier', text: 'Hola Mario, ¿podemos subir el nuevo menú de primavera?', time: '14:22', isMe: false },
        { id: 2, sender: 'Mario (TecnOdiel)', text: '¡Buenas! Ya está activado en vuestro panel de cliente para editarlo directamente.', time: '14:25', isMe: true }
      ]
    },
    {
      id: 'c2',
      clientName: 'Swiss Dental (Clínica)',
      lastMsg: 'Perfecto, la agenda online funciona de maravilla.',
      time: 'Ayer',
      unread: 0,
      messages: [
        { id: 1, sender: 'Swiss Dental', text: 'Perfecto, la agenda online funciona de maravilla.', time: 'Ayer 18:30', isMe: false }
      ]
    }
  ]);
  const [selectedChatId, setSelectedChatId] = useState('c1');
  const [teamMessages, setTeamMessages] = useState([
    { id: 1, sender: 'Dani', text: 'Acabo de dejar pulido el tema brutalist con los offset shadows de 8px.', time: '12:15', isMe: false },
    { id: 2, sender: 'Mario', text: 'Genial. He implementado los magnetics links y la física de rebote.', time: '12:18', isMe: true },
    { id: 3, sender: 'Javier', text: 'El lead del Dr. Morales en Sevilla pinta muy bien para esta semana.', time: '12:40', isMe: false }
  ]);
  const [chatInputText, setChatInputText] = useState('');

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInputText.trim()) return;

    if (chatTab === 'clientes') {
      setClientChats(prev => prev.map(c => {
        if (c.id === selectedChatId) {
          return {
            ...c,
            lastMsg: chatInputText,
            time: 'Ahora',
            messages: [
              ...c.messages,
              { id: Date.now(), sender: `${partner.name} (TecnOdiel)`, text: chatInputText, time: 'Ahora', isMe: true }
            ]
          };
        }
        return c;
      }));
    } else {
      setTeamMessages(prev => [
        ...prev,
        { id: Date.now(), sender: partner.name, text: chatInputText, time: 'Ahora', isMe: true }
      ]);
    }
    setChatInputText('');
  };

  // Buscador filtrado
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    const res = [];
    projectsList.forEach(p => {
      if (p.name.toLowerCase().includes(q) || p.businessName.toLowerCase().includes(q)) {
        res.push({ title: p.name, subtitle: p.businessName, group: 'Proyectos', tab: 'projects' });
      }
    });
    kanbanTasks.forEach(k => {
      if (k.title.toLowerCase().includes(q) || k.subtitle.toLowerCase().includes(q)) {
        res.push({ title: k.title, subtitle: `Estado: ${k.status}`, group: 'Kanban', tab: 'kanban' });
      }
    });
    crmLeads.forEach(l => {
      if (l.businessName.toLowerCase().includes(q) || l.contactName.toLowerCase().includes(q)) {
        res.push({ title: l.businessName, subtitle: `${l.contactName} (${l.city})`, group: 'CRM', tab: 'crm' });
      }
    });
    return res;
  }, [searchQuery, projectsList, kanbanTasks, crmLeads]);

  const activeNavItem = NAV_ITEMS.find(i => i.id === activeTab) || NAV_ITEMS[0];

  return (
    <div className="min-h-screen bg-[#121212] text-zinc-100 flex flex-col lg:flex-row font-['Montserrat',Inter,sans-serif] selection:bg-[#6DD94B] selection:text-black">
      {/* ── BARRA LATERAL (SIDEBAR TECNODIEL) ── */}
      <aside className="w-full lg:w-64 border-r border-white/10 bg-[#161616] flex flex-col shrink-0 select-none">
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-9 w-9 rounded-xl grid place-items-center bg-[#6DD94B] font-black text-black shadow-md shadow-[#6DD94B]/20 text-xs">
              {APP_CONFIG.shortName}
            </span>
            <div>
              <span className="text-sm font-extrabold tracking-wide text-white block leading-tight">
                {APP_CONFIG.name}
              </span>
              <span className="text-[10px] text-[#6DD94B] font-bold uppercase tracking-wider">
                {APP_CONFIG.location}
              </span>
            </div>
          </div>

          {onSwitchToClientView && (
            <button
              onClick={onSwitchToClientView}
              className="text-[11px] bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              title="Ir al Portal de Cliente"
            >
              Ver Cliente ➔
            </button>
          )}
        </div>

        {/* Navigation Items con píldora deslizante */}
        <nav className="p-3 space-y-1 flex-1 relative">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all relative group cursor-pointer ${
                  isActive
                    ? 'bg-[#6DD94B]/15 text-[#6DD94B] shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {/* Barrita elástica vertical indicadora */}
                {isActive && (
                  <span className="absolute left-1 top-2.5 bottom-2.5 w-1 rounded-full bg-[#6DD94B] shadow-[0_0_10px_#6DD94B]" />
                )}
                <Icon className={`h-4 w-4 shrink-0 transition-colors ${isActive ? 'text-[#6DD94B]' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                <span className="flex-1 text-left">{item.label}</span>

                {item.id === 'chats' && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#6DD94B] px-1.5 text-[11px] font-black text-black">
                    2
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Socio Activo Footer */}
        <div className="p-3 border-t border-gray-800 bg-gray-950/80">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-900/80 border border-gray-800/80">
            <span className={`h-8 w-8 rounded-lg grid place-items-center ${partner.color} text-white font-bold text-xs shrink-0`}>
              {partner.avatar}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{partner.name}</p>
              <p className="text-[10px] text-gray-400 truncate">{partner.role}</p>
            </div>
            <span className={`h-2 w-2 rounded-full ${activeCheckin.active ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'}`} title={activeCheckin.active ? 'En sesión' : 'Inactivo'} />
          </div>
        </div>
      </aside>

      {/* ── CUERPO PRINCIPAL (HEADER + SECCIONES) ── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header Superior (Estética TecnOdiel) */}
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#161616]/90 backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-3 px-4 py-3 sm:px-6">
            {/* Título */}
            <h1 className="min-w-0 flex-1 truncate text-base font-extrabold text-white sm:text-xl xl:flex-none">
              {activeNavItem.title}
            </h1>

            {/* Buscador + Botón Añadir Proyecto */}
            <div className="order-last flex w-full items-center gap-2 xl:order-none xl:ml-auto xl:w-auto">
              {/* Buscador Global (Cmd+K) */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="flex h-10 w-full items-center gap-2 rounded-xl border border-white/10 bg-[#181818] px-3 text-sm text-zinc-400 hover:border-white/20 hover:text-white xl:w-64 cursor-pointer"
              >
                <Search className="h-4 w-4 text-zinc-500" />
                <span className="flex-1 text-left truncate">Buscar...</span>
                <kbd className="rounded border border-white/10 bg-black/40 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">
                  ⌘K
                </kbd>
              </button>

              {/* Botón + Añadir Proyecto con verde TecnOdiel */}
              <button
                onClick={() => setIsNewProjectOpen(true)}
                className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-[#6DD94B] px-4 text-sm font-black text-black shadow-lg shadow-[#6DD94B]/20 hover:bg-white cursor-pointer transition"
              >
                <Plus className="h-4 w-4 stroke-[3]" />
                <span className="hidden sm:inline">Añadir Proyecto</span>
              </button>
            </div>

            {/* Acciones de la barra superior (Theme, Check-in, Notificaciones, Perfil) */}
            <div className="flex items-center gap-1.5 sm:gap-2 relative">
              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Cambiar tema"
                className="grid h-10 w-10 place-items-center rounded-xl text-zinc-400 hover:bg-white/5 hover:text-white transition cursor-pointer"
              >
                {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>

              {/* CheckinButton Interactivo */}
              <div className="relative">
                {!activeCheckin.active ? (
                  <button
                    onClick={() => setIsCheckinMenuOpen(!isCheckinMenuOpen)}
                    className="inline-flex h-10 items-center gap-2 rounded-full bg-[#0D844A] hover:bg-[#09663a] px-4 text-xs font-black uppercase tracking-wide text-white shadow-lg transition cursor-pointer"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Check-in</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsCheckinMenuOpen(!isCheckinMenuOpen)}
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-rose-600 px-3 text-xs font-bold tracking-wide text-white shadow-lg shadow-rose-900/30 hover:bg-rose-500 transition sm:px-4 font-mono cursor-pointer"
                  >
                    <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                    <span>{formatTimer(elapsedSeconds)}</span>
                    <span className="hidden sm:inline ml-1 text-[11px] font-sans font-bold bg-black/20 px-1.5 py-0.5 rounded">Check-out</span>
                  </button>
                )}

                {/* Dropdown de Check-in */}
                {isCheckinMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl z-50 overflow-hidden">
                    {!activeCheckin.active ? (
                      <>
                        <div className="p-3 border-b border-gray-800 bg-gray-950/50">
                          <p className="text-xs font-bold uppercase tracking-wider text-white">¿En qué vas a trabajar?</p>
                          <p className="text-[11px] text-gray-400">Selecciona el proyecto para computar tus horas verificadas.</p>
                        </div>
                        <div className="max-h-60 overflow-y-auto p-1.5 space-y-1">
                          {projectsList.map(p => (
                            <button
                              key={p.id}
                              onClick={() => handleStartCheckin(p.id, p.name)}
                              className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-800 text-left transition cursor-pointer"
                            >
                              <FolderOpen className="h-4 w-4 text-indigo-400 shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-white truncate">{p.name}</p>
                                <p className="text-[10px] text-gray-400 truncate">{p.businessName}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="p-4 space-y-3">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">● SESIÓN EN CURSO</span>
                          <p className="text-sm font-bold text-white mt-0.5">{activeCheckin.projectName}</p>
                          <p className="text-2xl font-mono font-bold text-white mt-2">{formatTimer(elapsedSeconds)}</p>
                        </div>
                        <button
                          onClick={handleStopCheckin}
                          className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Finalizar y Guardar Sesión</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Notificaciones */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  aria-label="Notificaciones"
                  className="relative grid h-10 w-10 place-items-center rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition cursor-pointer"
                >
                  <Bell className="h-4 w-4" />
                  {unreadNotifications > 0 && (
                    <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-gray-950 bg-rose-500" />
                  )}
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl z-50 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
                      <p className="text-xs font-bold text-white">Notificaciones</p>
                      <button
                        onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                      >
                        <CheckCheck className="h-3 w-3" />
                        Marcar leídas
                      </button>
                    </div>
                    <ul className="max-h-72 divide-y divide-gray-800 overflow-y-auto">
                      {notifications.map(n => (
                        <li key={n.id} className="p-3 hover:bg-gray-800/60 transition">
                          <p className="text-xs font-semibold text-white">{n.title}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{n.body}</p>
                          <span className="text-[10px] text-gray-500 mt-1 block">{n.time}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-1 rounded-xl p-1 hover:bg-gray-800 transition cursor-pointer"
                >
                  <span className={`h-8 w-8 rounded-lg grid place-items-center ${partner.color} text-white font-bold text-xs`}>
                    {partner.avatar}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-gray-500 hidden sm:block" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl z-50 overflow-hidden p-2">
                    <div className="p-3 border-b border-gray-800 space-y-1">
                      <p className="text-xs font-bold text-white">{partner.name}</p>
                      <p className="text-[11px] text-gray-400">{partner.email}</p>
                      <span className="inline-block text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        {partner.availability}
                      </span>
                    </div>
                    <div className="p-1 space-y-0.5">
                      <p className="text-[10px] text-gray-500 px-2 py-1 uppercase font-mono">Cambiar socio:</p>
                      {PARTNERS.map(p => (
                        <button
                          key={p.id}
                          onClick={() => { setPartner(p); setIsProfileOpen(false); }}
                          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition ${
                            partner.id === p.id ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                          }`}
                        >
                          <span className={`h-5 w-5 rounded grid place-items-center ${p.color} text-[10px] font-bold text-white`}>
                            {p.avatar}
                          </span>
                          <span>{p.name} ({p.role.split(' ')[0]})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ── CONTENIDO PRINCIPAL POR PESTAÑAS ── */}
        <main className="flex-1 p-4 sm:p-6 pb-24 max-w-[1600px] w-full mx-auto">
          {/* TAB 1: PANEL / DASHBOARD (6 WIDGETS EXACTOS) */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-12 animate-fadeIn">
              {/* WIDGET 1: KANBAN DE TRABAJOS (8 COLUMNAS XL) */}
              <div className="md:col-span-2 xl:col-span-8 rounded-2xl border border-gray-800 bg-gray-900/90 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <div className="flex items-center gap-2">
                    <SquareKanban className="h-5 w-5 text-indigo-400" />
                    <h3 className="font-semibold text-white text-sm">Kanban de Trabajos</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('kanban')}
                    className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-indigo-300 cursor-pointer"
                  >
                    <span>Ver tablero</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* 3 Columnas compactas del widget */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { id: 'planeado', title: 'Por hacer', color: 'border-gray-800' },
                    { id: 'en_progreso', title: 'En progreso', color: 'border-indigo-500/40' },
                    { id: 'hecho', title: 'Hecho', color: 'border-emerald-500/40' }
                  ].map(col => {
                    const tasksInCol = kanbanTasks.filter(t => t.status === col.id);
                    return (
                      <div key={col.id} className={`p-3 rounded-xl bg-gray-950/60 border ${col.color} space-y-2`}>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-300">{col.title}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">
                            {tasksInCol.length}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {tasksInCol.slice(0, 3).map(task => (
                            <div key={task.id} className="p-2.5 rounded-lg bg-gray-900 border border-gray-800 text-left space-y-1.5 shadow-sm">
                              <p className="text-xs font-medium text-white leading-snug">{task.title}</p>
                              <div className="flex items-center justify-between text-[10px] text-gray-400">
                                <span className="font-mono text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                                  {task.subtitle}
                                </span>
                                <span className="uppercase font-bold text-gray-500">{task.assignee}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* WIDGET 2: INTEGRACIONES (4 COLUMNAS XL) */}
              <div className="md:col-span-2 xl:col-span-4 rounded-2xl border border-gray-800 bg-gray-900/90 p-5 space-y-3">
                <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
                  <Database className="h-5 w-5 text-emerald-400" />
                  <h3 className="font-semibold text-white text-sm">Integraciones</h3>
                </div>
                <ul className="space-y-2">
                  {integrations.map(item => {
                    const Icon = item.icon;
                    return (
                      <li key={item.id} className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-800/30 px-3 py-2">
                        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${item.tint}`}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-white">{item.name}</p>
                          <p className="truncate text-[10px] text-gray-500">{item.details}</p>
                        </div>
                        <span className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold ${item.statusClass}`}>
                          {item.status}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <p className="text-[11px] text-gray-500 pt-1">Los tokens de GitHub, Vercel y WhatsApp viven solo en Edge Functions.</p>
              </div>

              {/* WIDGET 3: MIS PROYECTOS (4 COLUMNAS XL) */}
              <div className="md:col-span-2 xl:col-span-4 rounded-2xl border border-gray-800 bg-gray-900/90 p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <div className="flex items-center gap-2">
                    <FolderKanban className="h-5 w-5 text-indigo-400" />
                    <h3 className="font-semibold text-white text-sm">Mis Proyectos</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('projects')}
                    className="text-xs text-gray-400 hover:text-indigo-300 flex items-center gap-0.5"
                  >
                    <span>Ver todos</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
                <ul className="space-y-2.5">
                  {projectsList.slice(0, 3).map(p => {
                    const typeMeta = BUSINESS_TYPE_META[p.businessType];
                    const Icon = typeMeta.icon;
                    return (
                      <li key={p.id} className="p-3 rounded-xl border border-gray-800 bg-gray-800/40 space-y-2 hover:border-indigo-500/50 transition">
                        <div className="flex items-center gap-3">
                          <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${typeMeta.tint}`}>
                            <Icon className="h-4 w-4" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-white truncate">{p.name}</p>
                            <p className="text-[10px] text-gray-400 truncate">{p.businessName}</p>
                          </div>
                          <span className="text-xs font-mono font-bold text-indigo-300">{p.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${p.progress}%` }} />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* WIDGET 4: HORAS DE HOY (4 COLUMNAS XL) */}
              <div className="xl:col-span-4 rounded-2xl border border-gray-800 bg-gray-900/90 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-emerald-400" />
                    <h3 className="font-semibold text-white text-sm">Horas de Hoy</h3>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">Tope: 8 h</span>
                </div>
                <div className="space-y-3.5">
                  {[
                    { id: 'mario', name: 'Mario', hours: activeCheckin.active ? 6.5 : 5.5, max: 8 },
                    { id: 'dani', name: 'Dani', hours: 4.0, max: 8 },
                    { id: 'javier', name: 'Javier', hours: 3.0, max: 8 }
                  ].map(row => (
                    <div key={row.id} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-white flex items-center gap-1.5">
                          {row.name}
                          {partner.id === row.id && activeCheckin.active && (
                            <span className="text-[10px] font-bold text-emerald-400">● en curso</span>
                          )}
                        </span>
                        <span className="text-gray-400 font-mono">{row.hours.toFixed(1)} / 8 h</span>
                      </div>
                      <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden flex">
                        <div className="bg-emerald-500 h-full" style={{ width: `${(row.hours / 8) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-gray-500">Horas verificadas con commits a la rama main.</p>
              </div>

              {/* WIDGET 5: FONDO COMÚN (4 COLUMNAS XL) */}
              <div className="xl:col-span-4 rounded-2xl border border-gray-800 bg-gray-900/90 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <div className="flex items-center gap-2">
                    <PiggyBank className="h-5 w-5 text-emerald-400" />
                    <h3 className="font-semibold text-white text-sm">Fondo Común</h3>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    Reserva 300 €
                  </span>
                </div>
                <div>
                  <p className="text-3xl font-semibold tabular-nums text-white">{eur.format(3420)}</p>
                  <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-gray-800">
                    <div className="bg-gray-500" style={{ width: '9%' }} />
                    <div className="bg-emerald-500" style={{ width: '91%' }} />
                  </div>
                  <div className="mt-2 flex justify-between text-xs font-mono">
                    <span className="text-gray-400">Reserva {eur.format(300)}</span>
                    <span className="font-medium text-emerald-300">Repartible {eur.format(3120)}</span>
                  </div>
                </div>
                <ul className="space-y-1.5 border-t border-gray-800 pt-3 text-xs">
                  <li className="flex justify-between items-center text-gray-300">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <ArrowDownLeft className="h-3.5 w-3.5" />
                      <span>Pago Noir & Atelier</span>
                    </span>
                    <span className="font-mono text-emerald-300">+850 €</span>
                  </li>
                  <li className="flex justify-between items-center text-gray-300">
                    <span className="flex items-center gap-1.5 text-rose-400">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      <span>Dominio Cloudflare</span>
                    </span>
                    <span className="font-mono text-rose-300">−18 €</span>
                  </li>
                </ul>
              </div>

              {/* WIDGET 6: ACTIVIDAD DEL EQUIPO (12 COLUMNAS XL CON LIVEBADGE) */}
              <div className="md:col-span-2 xl:col-span-12 rounded-2xl border border-gray-800 bg-gray-900/90 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-indigo-400" />
                    <h3 className="font-semibold text-white text-sm">Actividad del Equipo</h3>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </span>
                    En directo
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { title: 'Push a main', desc: 'Mario sincronizó las 12 plantillas multi-tenant con aislamiento DOM', time: 'Hace 10 min', icon: GitCommitHorizontal, tint: 'text-purple-400 bg-purple-500/10' },
                    { title: 'Check-in iniciado', desc: 'Dani activó sesión en Smash & Destroy (Hamburguesería)', time: 'Hace 45 min', icon: LogIn, tint: 'text-emerald-400 bg-emerald-500/10' },
                    { title: 'Despliegue Vercel', desc: 'Producción actualizada con Cloudflare SSL', time: 'Hace 2 h', icon: Rocket, tint: 'text-sky-400 bg-sky-500/10' }
                  ].map((act, i) => {
                    const Icon = act.icon;
                    return (
                      <div key={i} className="p-3 rounded-xl border border-gray-800 bg-gray-950/60 flex items-start gap-3">
                        <span className={`p-2 rounded-lg ${act.tint} shrink-0`}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-white">{act.title}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2">{act.desc}</p>
                          <span className="text-[10px] text-gray-500 font-mono mt-1 block">{act.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROYECTOS & TENANTS */}
          {activeTab === 'projects' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Carpetas de Proyectos & Tenants</h2>
                  <p className="text-xs text-gray-400">Cada proyecto representa un cliente o un ecosistema multi-tenant con sus 12 plantillas.</p>
                </div>
                <button
                  onClick={() => setIsNewProjectOpen(true)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-900/30 transition cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Nuevo Proyecto / Tenant</span>
                </button>
              </div>

              {/* Grid de carpetas con pestañas estilo VirtualDesk-main */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {projectsList.map(project => {
                  const typeMeta = BUSINESS_TYPE_META[project.businessType];
                  const status = STATUS_META[project.status];
                  const isSaas = project.businessType === 'saas';
                  const TypeIcon = isSaas ? Boxes : typeMeta.icon;

                  return (
                    <div key={project.id} className="group flex flex-col focus:outline-none">
                      {/* Pestaña superior de carpeta */}
                      <div className="flex">
                        <span className="flex h-7 items-center gap-1.5 rounded-t-xl border border-b-0 border-gray-800 bg-gray-900 px-3 text-xs font-medium text-gray-400 group-hover:border-indigo-500/50 transition">
                          <TypeIcon className="h-3.5 w-3.5" />
                          <span>{isSaas ? 'SaaS Multi-Tenant' : typeMeta.label}</span>
                        </span>
                      </div>

                      {/* Cuerpo de la carpeta */}
                      <article className="-mt-px flex flex-1 flex-col rounded-2xl rounded-tl-none border border-gray-800 bg-gray-900 p-5 group-hover:border-indigo-500/50 group-hover:shadow-xl transition space-y-4">
                        <div className="flex items-start gap-3">
                          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${isSaas ? 'bg-indigo-500/15 text-indigo-300' : typeMeta.tint}`}>
                            <TypeIcon className="h-5 w-5" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-sm text-white line-clamp-1">{project.name}</h3>
                            <p className="text-xs text-gray-400 truncate">{project.businessName}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${status.badge}`}>
                            {status.label}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 text-xs">
                          <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700 text-[11px]">
                            {project.tenantsCount} {project.tenantsCount === 1 ? 'tenant' : 'tenants'}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[11px]">
                            {project.tenantsLive} en producción
                          </span>
                          <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700 text-[11px] font-mono">
                            {eur.format(project.price)}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>Progreso</span>
                            <span className="font-mono text-white">{project.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${project.progress}%` }} />
                          </div>
                        </div>

                        <div className="border-t border-gray-800 pt-3 flex items-center justify-between text-xs">
                          <div className="flex -space-x-1.5">
                            {project.contributors.map(cId => {
                              const pInfo = PARTNERS.find(x => x.id === cId);
                              return (
                                <span key={cId} className={`h-6 w-6 rounded-full border border-gray-900 grid place-items-center ${pInfo?.color || 'bg-gray-700'} text-[10px] font-bold text-white`}>
                                  {pInfo?.avatar || cId[0].toUpperCase()}
                                </span>
                              );
                            })}
                          </div>
                          <span className="text-[11px] font-mono text-gray-500 truncate max-w-[150px]">
                            {project.repo}
                          </span>
                        </div>
                      </article>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: KANBAN COMPLETO */}
          {activeTab === 'kanban' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Tablero de Tareas & Trabajos (Kanban)</h2>
                  <p className="text-xs text-gray-400">Control de flujo de trabajo ágil por etapas y socios asignados.</p>
                </div>
                <button
                  onClick={() => {
                    const title = prompt('Título de la tarea:');
                    if (title) {
                      setKanbanTasks(prev => [
                        ...prev,
                        { id: `k-${Date.now()}`, title, subtitle: 'Tarea', status: 'planeado', assignee: partner.id, projectId: 'p1' }
                      ]);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Añadir Tarea</span>
                </button>
              </div>

              {/* 3 Columnas principales */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'planeado', title: 'Por hacer / Planeado', color: 'border-gray-800' },
                  { id: 'en_progreso', title: 'En progreso activo', color: 'border-indigo-500/50' },
                  { id: 'hecho', title: 'Terminado y verificado', color: 'border-emerald-500/50' }
                ].map(col => {
                  const tasks = kanbanTasks.filter(t => t.status === col.id);
                  return (
                    <div key={col.id} className={`rounded-2xl border ${col.color} bg-gray-900/80 p-4 space-y-3`}>
                      <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                        <span className="text-sm font-bold text-white">{col.title}</span>
                        <span className="text-xs font-mono bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">
                          {tasks.length}
                        </span>
                      </div>
                      <div className="space-y-2.5 min-h-[300px]">
                        {tasks.map(t => (
                          <div key={t.id} className="p-3.5 rounded-xl bg-gray-950 border border-gray-800 space-y-2 hover:border-gray-700 transition">
                            <p className="text-xs font-semibold text-white leading-snug">{t.title}</p>
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                                {t.subtitle}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold text-gray-400 uppercase">
                                  {t.assignee}
                                </span>
                                {/* Botones para mover de columna */}
                                <div className="flex items-center gap-1">
                                  {col.id !== 'planeado' && (
                                    <button
                                      onClick={() => setKanbanTasks(prev => prev.map(x => x.id === t.id ? { ...x, status: 'planeado' } : x))}
                                      className="text-[10px] bg-gray-800 hover:bg-gray-700 text-gray-300 px-1 rounded"
                                      title="Mover a Por Hacer"
                                    >
                                      ←
                                    </button>
                                  )}
                                  {col.id !== 'en_progreso' && (
                                    <button
                                      onClick={() => setKanbanTasks(prev => prev.map(x => x.id === t.id ? { ...x, status: 'en_progreso' } : x))}
                                      className="text-[10px] bg-indigo-600/30 hover:bg-indigo-600 text-white px-1 rounded"
                                      title="Mover a En Progreso"
                                    >
                                      ●
                                    </button>
                                  )}
                                  {col.id !== 'hecho' && (
                                    <button
                                      onClick={() => setKanbanTasks(prev => prev.map(x => x.id === t.id ? { ...x, status: 'hecho' } : x))}
                                      className="text-[10px] bg-emerald-600/30 hover:bg-emerald-600 text-white px-1 rounded"
                                      title="Mover a Hecho"
                                    >
                                      →
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: HORAS Y REPARTO */}
          {activeTab === 'hours' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-lg font-bold text-white">Registro de Horas, Reparto & Fondo Común</h2>
                <p className="text-xs text-gray-400">Modelo económico transparente de TecnOdiel (Regla 65% trabajo, 20% comercial, 10% fondo común, 5% gastos).</p>
              </div>

              {/* Tarjetas de Métricas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Horas contadas (7 días)', value: '38,5 h' },
                  { label: 'Sesiones registradas', value: '14' },
                  { label: 'Verificadas por push', value: '100 %' },
                  { label: 'Fondo Común Disponible', value: '3.120 €' }
                ].map((s, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-gray-800 bg-gray-900">
                    <p className="text-xs text-gray-400">{s.label}</p>
                    <p className="text-xl font-bold text-white mt-1">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Calculadora de Reparto 65/20/10/5 */}
              <div className="p-6 rounded-2xl border border-gray-800 bg-gray-900/90 space-y-4">
                <h3 className="font-bold text-white text-sm">Simulador de Reparto por Proyecto</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-gray-950 border border-gray-800">
                    <span className="text-[11px] text-indigo-400 font-mono font-bold block">65% EJECUCIÓN TÉCNICA</span>
                    <p className="text-xs text-gray-400 mt-1">Para el desarrollador/diseñador que pica el código y monta la web.</p>
                    <p className="text-lg font-bold text-white mt-2">552,50 € <span className="text-xs text-gray-500 font-normal">de 850 €</span></p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-950 border border-gray-800">
                    <span className="text-[11px] text-emerald-400 font-mono font-bold block">20% CAPTACIÓN / LEAD</span>
                    <p className="text-xs text-gray-400 mt-1">Para el socio que consiguió y cerró el cliente.</p>
                    <p className="text-lg font-bold text-white mt-2">170,00 € <span className="text-xs text-gray-500 font-normal">de 850 €</span></p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-950 border border-gray-800">
                    <span className="text-[11px] text-amber-400 font-mono font-bold block">10% FONDO COMÚN</span>
                    <p className="text-xs text-gray-400 mt-1">Aportación directa a la hucha intocable de la agencia.</p>
                    <p className="text-lg font-bold text-white mt-2">85,00 € <span className="text-xs text-gray-500 font-normal">de 850 €</span></p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-950 border border-gray-800">
                    <span className="text-[11px] text-rose-400 font-mono font-bold block">5% GASTOS TÉCNICOS</span>
                    <p className="text-xs text-gray-400 mt-1">Servidores, Cloudflare, dominios y licencias.</p>
                    <p className="text-lg font-bold text-white mt-2">42,50 € <span className="text-xs text-gray-500 font-normal">de 850 €</span></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CRM DE CLIENTES */}
          {activeTab === 'crm' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Pipeline de Clientes (CRM)</h2>
                  <p className="text-xs text-gray-400">Embudo comercial de prospectos en Huelva y Sevilla. Las solicitudes del formulario de la web llegan a «Solicitudes nuevas».</p>
                  {leadsError && <p className="text-[11px] text-amber-400 mt-1">No se pudieron leer las solicitudes de la base de datos ({leadsError}). ¿Has ejecutado supabase_leads.sql?</p>}
                </div>
                <button onClick={loadWebLeads} className="px-4 py-2 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 text-xs font-semibold cursor-pointer">
                  {leadsLoading ? 'Actualizando…' : 'Actualizar solicitudes'}
                </button>
                <button
                  onClick={() => {
                    const name = prompt('Nombre del negocio:');
                    if (name) {
                      setCrmLeads(prev => [
                        ...prev,
                        { id: `l-${Date.now()}`, businessName: name, contactName: 'Responsable', city: 'Huelva', stage: 'contactado', value: 850, owner: partner.id, days: 0 }
                      ]);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Añadir Lead</span>
                </button>
              </div>

              {/* 5 Columnas del Pipeline */}
              <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-3">
                {PIPELINE_STAGES.map(stage => {
                  const leads = crmLeads.filter(l => l.stage === stage.id);
                  return (
                    <div key={stage.id} className="rounded-2xl border border-gray-800 bg-gray-900/80 p-3 space-y-2.5">
                      <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                        <span className="text-xs font-bold text-white uppercase">{stage.label}</span>
                        <span className="text-[10px] font-mono bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded">
                          {leads.length}
                        </span>
                      </div>
                      <div className="space-y-2 min-h-[260px]">
                        {webLeads.filter(w => (w.stage || 'nuevo') === stage.id).map(w => (
                          <div key={w.id} className="p-3 rounded-xl bg-gray-950 border border-emerald-500/30 space-y-1.5 shadow-sm">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs font-bold text-white truncate">{w.business_name || w.name}</p>
                              <span className="text-[9px] font-mono uppercase text-emerald-400 shrink-0">web</span>
                            </div>
                            <p className="text-[11px] text-gray-400 truncate">{w.name}{w.sector ? ` · ${w.sector}` : ''}</p>
                            {(w.phone || w.email) && <p className="text-[11px] text-gray-300 truncate">{[w.phone, w.email].filter(Boolean).join(' · ')}</p>}
                            {w.services?.length > 0 && <p className="text-[10px] text-gray-500 leading-snug">{w.services.join(', ')}</p>}
                            {w.message && <p className="text-[10px] text-gray-500 italic leading-snug line-clamp-3">“{w.message}”</p>}
                            <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-gray-800/80 text-[10px]">
                              <span className="text-gray-600">{w.created_at ? new Date(w.created_at).toLocaleDateString('es-ES') : ''}{w.pending_sync ? ' · sin sincronizar' : ''}</span>
                              {w.phone && (
                                <a href={`https://wa.me/${String(w.phone).replace(/\D/g, '').replace(/^(?!34)(\d{9})$/, '34$1')}`} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">WhatsApp</a>
                              )}
                            </div>
                            <select
                              value={w.stage || 'nuevo'}
                              onChange={(e) => moveWebLead(w, e.target.value)}
                              className="w-full rounded-lg bg-gray-900 border border-gray-800 text-[11px] text-gray-300 px-2 py-1.5 cursor-pointer"
                              aria-label="Mover solicitud de etapa"
                            >
                              {PIPELINE_STAGES.map(st => <option key={st.id} value={st.id}>{st.label}</option>)}
                            </select>
                            <button onClick={() => createSiteForLead(w)} className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold py-1.5 cursor-pointer">
                              Crear su web
                            </button>
                          </div>
                        ))}
                        {leads.map(lead => (
                          <div key={lead.id} className="p-3 rounded-xl bg-gray-950 border border-gray-800 space-y-1.5 shadow-sm">
                            <p className="text-xs font-bold text-white truncate">{lead.businessName}</p>
                            <p className="text-[11px] text-gray-400 truncate">{lead.contactName} · {lead.city}</p>
                            <div className="flex items-center justify-between pt-1 border-t border-gray-800/80 text-[10px]">
                              <span className="font-mono text-emerald-400 font-bold">{eur.format(lead.value)}</span>
                              <span className="text-gray-500 uppercase">{lead.owner}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: CHATS */}
          {activeTab === 'chats' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setChatTab('clientes')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                    chatTab === 'clientes' ? 'bg-indigo-600 text-white' : 'bg-gray-900 text-gray-400 border border-gray-800'
                  }`}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Clientes · WhatsApp / Portal</span>
                </button>
                <button
                  onClick={() => setChatTab('equipo')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                    chatTab === 'equipo' ? 'bg-indigo-600 text-white' : 'bg-gray-900 text-gray-400 border border-gray-800'
                  }`}
                >
                  <MessagesSquare className="h-4 w-4" />
                  <span>Chat Interno del Equipo</span>
                </button>
              </div>

              {/* Ventana de Chat Dividida */}
              <div className="grid grid-cols-1 md:grid-cols-3 rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden h-[540px]">
                {/* Lista lateral de conversaciones */}
                <div className="border-r border-gray-800 bg-gray-950/60 flex flex-col">
                  <div className="p-3 border-b border-gray-800">
                    <span className="text-xs font-bold text-white">Bandeja Activa</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {chatTab === 'clientes' ? (
                      clientChats.map(c => (
                        <button
                          key={c.id}
                          onClick={() => setSelectedChatId(c.id)}
                          className={`w-full p-2.5 rounded-xl text-left transition cursor-pointer flex items-center gap-2.5 ${
                            selectedChatId === c.id ? 'bg-indigo-600/20 border border-indigo-500/40 text-white' : 'hover:bg-gray-850 text-gray-300'
                          }`}
                        >
                          <span className="h-8 w-8 rounded-lg bg-indigo-600/30 text-indigo-300 grid place-items-center font-bold text-xs shrink-0">
                            {c.clientName[0]}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-white truncate">{c.clientName}</p>
                            <p className="text-[11px] text-gray-400 truncate">{c.lastMsg}</p>
                          </div>
                          <span className="text-[10px] text-gray-500 shrink-0">{c.time}</span>
                        </button>
                      ))
                    ) : (
                      <div className="p-3 text-xs text-gray-400 space-y-2">
                        <p className="font-bold text-white">Canal General de TecnOdiel</p>
                        <p className="text-[11px]">Chat seguro encriptado entre Mario, Dani y Javier.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Área de mensajes & composer */}
                <div className="md:col-span-2 flex flex-col bg-gray-900">
                  <div className="p-3.5 border-b border-gray-800 bg-gray-950/30 flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      {chatTab === 'clientes' ? clientChats.find(c => c.id === selectedChatId)?.clientName : 'Chat Interno #general'}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      En línea
                    </span>
                  </div>

                  {/* Historial de Mensajes */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {(chatTab === 'clientes'
                      ? (clientChats.find(c => c.id === selectedChatId)?.messages || [])
                      : teamMessages
                    ).map(msg => (
                      <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed ${
                          msg.isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none'
                        }`}>
                          <p className="font-bold text-[10px] opacity-75 mb-0.5">{msg.sender}</p>
                          <p>{msg.text}</p>
                        </div>
                        <span className="text-[9px] text-gray-500 mt-1 font-mono">{msg.time}</span>
                      </div>
                    ))}
                  </div>

                  {/* Input de Mensaje */}
                  <form onSubmit={handleSendChat} className="p-3 border-t border-gray-800 bg-gray-950/80 flex items-center gap-2">
                    <input
                      type="text"
                      value={chatInputText}
                      onChange={e => setChatInputText(e.target.value)}
                      placeholder="Escribe un mensaje..."
                      className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer transition shrink-0"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: AJUSTES */}
          {activeTab === 'settings' && (
            <div className="mx-auto max-w-4xl grid gap-4 sm:gap-6 md:grid-cols-2 animate-fadeIn">
              <div className="p-5 rounded-2xl border border-gray-800 bg-gray-900 space-y-3">
                <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
                  <Building2 className="h-4 w-4 text-indigo-400" />
                  <h3 className="font-semibold text-white text-sm">Agencia TecnOdiel</h3>
                </div>
                <dl className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <dt className="text-gray-400">Nombre Oficial:</dt>
                    <dd className="font-semibold text-white">{APP_CONFIG.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-400">Siglas / Monograma:</dt>
                    <dd className="font-semibold text-white">{APP_CONFIG.shortName}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-400">Sede:</dt>
                    <dd className="font-semibold text-white">{APP_CONFIG.location}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-400">Dominio Preview:</dt>
                    <dd className="font-mono text-indigo-300">{APP_CONFIG.agencyPreviewDomain}</dd>
                  </div>
                </dl>
              </div>

              <div className="p-5 rounded-2xl border border-gray-800 bg-gray-900 space-y-3">
                <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
                  <Database className="h-4 w-4 text-emerald-400" />
                  <h3 className="font-semibold text-white text-sm">Infraestructura & Conexión</h3>
                </div>
                <dl className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <dt className="text-gray-400">Base de Datos:</dt>
                    <dd className="font-semibold text-emerald-400">Supabase SSL (Conectado)</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-400">Alojamiento:</dt>
                    <dd className="font-semibold text-white">Cloudflare Pages Edge</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-400">Aislamiento Plantillas:</dt>
                    <dd className="font-semibold text-emerald-400">12 Plantillas Autónomas</dd>
                  </div>
                </dl>
              </div>

              <div className="md:col-span-2 p-5 rounded-2xl border border-gray-800 bg-gray-900 space-y-3">
                <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
                  <UserRound className="h-4 w-4 text-indigo-400" />
                  <h3 className="font-semibold text-white text-sm">Tu Perfil de Socio Activo</h3>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`h-12 w-12 rounded-xl grid place-items-center ${partner.color} text-white font-bold text-lg`}>
                    {partner.avatar}
                  </span>
                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-white text-sm">{partner.name}</p>
                    <p className="text-gray-400">{partner.role}</p>
                    <p className="font-mono text-gray-500">{partner.email}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── BOTÓN FLOTANTE CHATWIDGET (ESQUINA INFERIOR DERECHA) ── */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsChatWidgetOpen(!isChatWidgetOpen)}
          className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-950/60 grid place-items-center hover:scale-105 transition cursor-pointer relative"
          aria-label="Abrir chat del equipo"
        >
          {isChatWidgetOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
          {!isChatWidgetOpen && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 text-gray-950 font-bold text-[9px] grid place-items-center">
              1
            </span>
          )}
        </button>

        {isChatWidgetOpen && (
          <div className="absolute bottom-16 right-0 w-80 sm:w-96 rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl overflow-hidden flex flex-col h-96 animate-fadeIn">
            <div className="p-3 border-b border-gray-800 bg-gray-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessagesSquare className="h-4 w-4 text-indigo-400" />
                <span className="text-xs font-bold text-white">Chat Rápido de Equipo</span>
              </div>
              <button onClick={() => setIsChatWidgetOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {teamMessages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`p-2.5 rounded-xl text-xs max-w-[80%] ${msg.isMe ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-200'}`}>
                    <p className="text-[10px] opacity-75 font-bold mb-0.5">{msg.sender}</p>
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendChat} className="p-2 border-t border-gray-800 bg-gray-950 flex items-center gap-2">
              <input
                type="text"
                value={chatInputText}
                onChange={e => setChatInputText(e.target.value)}
                placeholder="Escribe al equipo..."
                className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button type="submit" className="p-1.5 rounded-lg bg-indigo-600 text-white cursor-pointer">
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ── MODAL SPOTLIGHT BUSCADOR GLOBAL (CMD+K) ── */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4">
          <div className="w-full max-w-xl rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl overflow-hidden animate-fadeIn">
            <div className="p-3 border-b border-gray-800 flex items-center gap-3">
              <Search className="h-5 w-5 text-gray-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar proyectos, tareas del kanban, clientes CRM..."
                className="w-full bg-transparent text-sm text-white focus:outline-none"
              />
              <button onClick={() => setIsSearchOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {searchQuery.trim().length < 2 ? (
                <div className="p-6 text-center text-xs text-gray-500">
                  Escribe al menos 2 caracteres para buscar en todo TecnOdiel...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-500">
                  No se encontraron resultados para "{searchQuery}".
                </div>
              ) : (
                <div className="space-y-1">
                  {searchResults.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setActiveTab(r.tab);
                        setIsSearchOpen(false);
                      }}
                      className="w-full p-2.5 rounded-xl hover:bg-gray-800 flex items-center justify-between text-left transition cursor-pointer"
                    >
                      <div>
                        <p className="text-xs font-semibold text-white">{r.title}</p>
                        <p className="text-[10px] text-gray-400">{r.subtitle}</p>
                      </div>
                      <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                        {r.group}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL AÑADIR PROYECTO ── */}
      {isNewProjectOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4">
          <div className="w-full max-w-lg rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="font-bold text-white text-base">Crear Nuevo Proyecto en TecnOdiel</h3>
              <button onClick={() => setIsNewProjectOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">Nombre Comercial del Cliente:</label>
                <input
                  type="text"
                  placeholder="Ej. Marisquería El Rincón"
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 block mb-1">Tipo de Proyecto:</label>
                  <select className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white">
                    <option value="hosteleria">Hostelería (Restaurante / Bar)</option>
                    <option value="clinica">Clínica & Salud</option>
                    <option value="saas">SaaS Multi-Tenant</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Presupuesto (€):</label>
                  <input
                    type="number"
                    placeholder="850"
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-gray-800">
              <button
                onClick={() => setIsNewProjectOpen(false)}
                className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  alert('¡Proyecto creado con éxito y vinculado a las plantillas multi-tenant!');
                  setIsNewProjectOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                Crear Proyecto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
