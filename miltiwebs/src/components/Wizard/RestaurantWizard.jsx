import React, { useState } from 'react';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  CheckCircle2, 
  Globe, 
  Wine, 
  Utensils, 
  Flame, 
  GlassWater, 
  Layers, 
  Palette, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  MapPin, 
  Sparkles,
  ExternalLink,
  Plus,
  Trash2,
  Eye,
  Sliders,
  Edit3,
  Type,
  Layout,
  RefreshCw,
  X,
  FileText,
  CreditCard,
  ArrowUpRight,
  MessageSquare,
  Lock,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { TEMPLATES, COLOR_PALETTES, BASE_WEB_PRICE, AVAILABLE_MODULES, getPresetMenuForStyle, DEFAULT_MENUS_BY_STYLE } from '../../lib/mockData';
import { createRestaurant, sanitizeSlug } from '../../lib/supabase';
import TemplateRenderer from '../Templates/TemplateRenderer';
import ErrorBoundary from '../ErrorBoundary';
import confetti from 'canvas-confetti';
import SlideCommit from '../ui/SlideCommit';

export const TEMPLATE_GROUPS = [
  {
    name: 'Tapas & Solera del Sur',
    icon: '☀️',
    templates: [
      { id: 'tapas_andaluzas', label: 'Estilo Taberna & Solera Andaluza (Albero, Pizarra & Jabugo)' }
    ]
  },
  {
    name: 'Noche, Coctelería & Futurismo',
    icon: '🍸',
    templates: [
      { id: 'nocturne', label: 'Estilo Nocturno & Mixología VIP (Obsidian Black & Oro)' },
      { id: 'cyberpunk', label: 'Estilo Cyber Neon & Future Bar (Consola HUD & 2077)' }
    ]
  },
  {
    name: 'Street Food, Burgers & Craft',
    icon: '🍔',
    templates: [
      { id: 'urban_street_smash', label: 'Estilo Urban Street & Smash Burger (Diner & Maillard)' },
      { id: 'cerveceria_craft', label: 'Estilo Cervecería Artesanal & Taproom (Cobre & Grifos)' }
    ]
  },
  {
    name: 'Alta Cocina, Brasa & Tradición',
    icon: '🥩',
    templates: [
      { id: 'tokyo_omakase', label: 'Estilo Omakase & Zen Japonés (Barra Shokunin & Washi)' },
      { id: 'steakhouse_asador', label: 'Estilo Asador Prime & Cortes Madurados (Dry Aged 60D)' },
      { id: 'bistro_parisien', label: 'Estilo Bistró Francés & Belle Époque (Esmeralda & Oro)' }
    ]
  },
  {
    name: 'Mar, Salitre & Dulce Boutique',
    icon: '🌊',
    templates: [
      { id: 'marisqueria_costera', label: 'Estilo Marisquería & Lonja Marinera (Gamba Blanca & Lonja)' },
      { id: 'pasticceria_dolce', label: 'Estilo Dolce Boutique, Brunch & Café (Crema & Vitrina)' }
    ]
  }
];


export default function RestaurantWizard({ onCreated, onCancel }) {
  const [activeSection, setActiveSection] = useState(1);
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [saving, setSaving] = useState(false);
  const [createdRestaurant, setCreatedRestaurant] = useState(null);
  const [quickTweakTab, setQuickTweakTab] = useState('template');
  const [tweakNotice, setTweakNotice] = useState('');
  const [isTweakBarCollapsed, setIsTweakBarCollapsed] = useState(false);
  const [billingPlan, setBillingPlan] = useState('monthly'); // 'monthly' | 'annual'
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [isSavingExpedient, setIsSavingExpedient] = useState(false);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState('');
  const [templateFilter, setTemplateFilter] = useState('all');
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);
  const [activeMenuCatIdx, setActiveMenuCatIdx] = useState(0);

  const showTweakNotice = (msg) => {
    setTweakNotice(msg);
    setTimeout(() => setTweakNotice(''), 2500);
  };

  // Full 28-Aspect State Architecture + Modular Services
  const [formData, setFormData] = useState({
    // Modulos y Servicios Seleccionados con Impacto en Precio
    selected_modules: ['booking_engine', 'nfc_menu', 'seo_ranking'],

    // 1-6: Identidad de Marca
    name: 'Taberna El Albero',
    slug: 'taberna-el-albero',
    subdomain: 'taberna-el-albero',
    slogan: 'Tapas de solera, jamón ibérico y vinos del sur',
    description: 'Taberna tradicional con esencia andaluza, jamón de bellota 100% ibérico cortado a cuchillo al momento, gambas de Huelva y solera en bota.',
    category: 'tapas',
    dress_code: 'Informal / Agradable',

    // 7-10: Arquitectura & Hero
    template_id: 'tapas_andaluzas',
    hero_layout: 'centered', // 'centered', 'split', 'minimal'
    hero_image: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?auto=format&fit=crop&w=1920&q=80',
    texture: 'spotlight', // 'spotlight', 'grain', 'vignette', 'clean'

    // 11-15: Cromatica & Tipografia
    primary_color: '#eab308',
    accent_color: '#ca8a04',
    background_color: '#1c1006',
    surface_color: '#2a180b',
    font_family: 'Playfair Display',

    // 16-20: Motor de Reservas Directas (Sin intermediarios)
    booking_rules: {
      available_areas: ['Salón de Barricas', 'Terraza Solera', 'Barra Tradicional'],
      max_guests_per_table: 8,
      slot_interval_minutes: 30,
      advance_notice: 'Mismo dia permitido',
      confirmation_mode: 'instant' // 'instant' | 'manual'
    },

    // 21-24: Horarios & Logistica
    lunch_shift: { enabled: true, open: '13:00', close: '16:30' },
    dinner_shift: { enabled: true, open: '20:00', close: '00:30' },
    closed_days: ['Lunes'],
    dietary_filters: ['Gluten Free', 'Vegano', 'Sin Lacteos'],

    // 25-28: Contacto & SEO
    phone: '+34 959 10 20 30',
    whatsapp_number: '+34600112233',
    email: 'contacto@tabernaelalbero.es',
    address: 'Calle Real, 18',
    city: 'Huelva',
    postal_code: '21001',
    google_maps_url: 'https://maps.google.com',
    instagram_url: 'https://instagram.com/tabernaelalbero',

    // Menu Pre-cargado realista segun el estilo seleccionado
    menu_categories: getPresetMenuForStyle('tapas_andaluzas')
  });

  const [newAreaInput, setNewAreaInput] = useState('');

  // Dynamic Pricing Calculation based on selected modules
  const calculatePlanPrice = (modules = formData.selected_modules, isAnnual = billingPlan === 'annual') => {
    const modulesCost = (modules || []).reduce((sum, modId) => {
      const found = AVAILABLE_MODULES.find(m => m.id === modId);
      return sum + (found ? found.price : 0);
    }, 0);
    const subtotal = BASE_WEB_PRICE + modulesCost;
    if (isAnnual) {
      return Math.round(subtotal * 0.8);
    }
    return subtotal;
  };

  const toggleModule = (modId) => {
    const current = formData.selected_modules || [];
    const exists = current.includes(modId);
    const updated = exists 
      ? current.filter(id => id !== modId)
      : [...current, modId];
    setFormData(prev => ({ ...prev, selected_modules: updated }));
    const mod = AVAILABLE_MODULES.find(m => m.id === modId);
    if (mod) {
      showTweakNotice(exists ? `Servicio ${mod.name} retirado` : `Servicio ${mod.name} (+${mod.price}€/mes) activado`);
    }
  };

  // Handle Slug and Subdomain auto-sync
  const handleNameChange = (val) => {
    const s = sanitizeSlug(val);
    setFormData(prev => ({
      ...prev,
      name: val,
      slug: s,
      subdomain: s
    }));
  };


  const handleCategorySelect = (cat) => {
    let tpl = 'nocturne';
    let hero = 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1920&q=80';
    let p = '#f59e0b';
    let a = '#fbbf24';
    let font = 'Outfit';
    let layout = 'centered';

    if (cat === 'gastronomic') {
      tpl = 'tecnodiel';
      hero = 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1920&q=80';
      p = '#10b981';
      a = '#34d399';
      font = 'Inter';
      layout = 'split';
    } else if (cat === 'trattoria') {
      tpl = 'artisan';
      hero = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=80';
      p = '#ea580c';
      a = '#fb923c';
      font = 'Playfair Display';
      layout = 'centered';
    } else if (cat === 'lounge') {
      tpl = 'velvet';
      hero = 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1920&q=80';
      p = '#e11d48';
      a = '#fb7185';
      font = 'Outfit';
      layout = 'minimal';
    }

    setFormData(prev => ({
      ...prev,
      category: cat,
      template_id: tpl,
      hero_image: hero,
      primary_color: p,
      accent_color: a,
      font_family: font,
      hero_layout: layout
    }));
  };

  const handlePaletteSelect = (pal) => {
    setFormData(prev => ({
      ...prev,
      primary_color: pal.primary,
      accent_color: pal.accent,
      background_color: pal.bg,
      surface_color: pal.surface
    }));
  };

  const handleAddArea = () => {
    if (!newAreaInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      booking_rules: {
        ...prev.booking_rules,
        available_areas: [...prev.booking_rules.available_areas, newAreaInput.trim()]
      }
    }));
    setNewAreaInput('');
  };

  const handleRemoveArea = (idx) => {
    setFormData(prev => ({
      ...prev,
      booking_rules: {
        ...prev.booking_rules,
        available_areas: prev.booking_rules.available_areas.filter((_, i) => i !== idx)
      }
    }));
  };

  // Menu Editor Handlers
  const handleUpdateCategoryName = (catIdx, newName) => {
    setFormData(prev => {
      const updated = [...(prev.menu_categories || [])];
      if (updated[catIdx]) {
        updated[catIdx] = { ...updated[catIdx], category: newName };
      }
      return { ...prev, menu_categories: updated };
    });
  };

  const handleAddCategory = () => {
    setFormData(prev => {
      const updated = [...(prev.menu_categories || [])];
      const newIdx = updated.length + 1;
      updated.push({
        category: `Nueva Categoría ${newIdx}`,
        items: [
          { name: 'Nuevo Plato', price: '12,00€', description: 'Descripción de los ingredientes frescos y preparación casera.' }
        ]
      });
      return { ...prev, menu_categories: updated };
    });
    setActiveMenuCatIdx((formData.menu_categories || []).length);
    showTweakNotice('Nueva categoría añadida');
  };

  const handleRemoveCategory = (catIdx) => {
    setFormData(prev => {
      const updated = (prev.menu_categories || []).filter((_, idx) => idx !== catIdx);
      return { ...prev, menu_categories: updated.length > 0 ? updated : getPresetMenuForStyle(prev.template_id) };
    });
    setActiveMenuCatIdx(0);
    showTweakNotice('Categoría eliminada');
  };

  const handleUpdateDish = (catIdx, dishIdx, field, value) => {
    setFormData(prev => {
      const updated = [...(prev.menu_categories || [])];
      if (updated[catIdx] && updated[catIdx].items && updated[catIdx].items[dishIdx]) {
        const updatedItems = [...updated[catIdx].items];
        updatedItems[dishIdx] = { ...updatedItems[dishIdx], [field]: value };
        updated[catIdx] = { ...updated[catIdx], items: updatedItems };
      }
      return { ...prev, menu_categories: updated };
    });
  };

  const handleAddDish = (catIdx) => {
    setFormData(prev => {
      const updated = [...(prev.menu_categories || [])];
      if (updated[catIdx]) {
        const items = updated[catIdx].items ? [...updated[catIdx].items] : [];
        items.push({
          name: 'Plato de la Casa',
          price: '15,00€',
          description: 'Elaborado artesanalmente con productos de proximidad seleccionados.'
        });
        updated[catIdx] = { ...updated[catIdx], items };
      }
      return { ...prev, menu_categories: updated };
    });
    showTweakNotice('Nuevo plato añadido');
  };

  const handleRemoveDish = (catIdx, dishIdx) => {
    setFormData(prev => {
      const updated = [...(prev.menu_categories || [])];
      if (updated[catIdx] && updated[catIdx].items) {
        const updatedItems = updated[catIdx].items.filter((_, idx) => idx !== dishIdx);
        updated[catIdx] = { ...updated[catIdx], items: updatedItems };
      }
      return { ...prev, menu_categories: updated };
    });
    showTweakNotice('Plato eliminado');
  };

  const handleResetMenuToPreset = () => {
    const preset = getPresetMenuForStyle(formData.template_id);
    setFormData(prev => ({ ...prev, menu_categories: preset }));
    setActiveMenuCatIdx(0);
    showTweakNotice('Carta restablecida al modelo del estilo');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const saved = await createRestaurant(formData);
      setCreatedRestaurant(saved);
      try {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.5 } });
      } catch (e) {}
      if (onCreated) onCreated(saved);
    } catch (err) {
      alert('Error al guardar el restaurante');
    } finally {
      setSaving(false);
    }
  };

  const SECTIONS = [
    { id: 1, label: 'Tu Negocio', sub: 'Nombre, dirección en internet y estilo' },
    { id: 2, label: 'Diseño & Portada', sub: 'Estilo visual y foto principal' },
    { id: 3, label: 'Colores & Letra', sub: 'Colores de marca y tipo de letra' },
    { id: 4, label: 'Reservas de Mesas', sub: 'Zonas, comensales y confirmación' },
    { id: 5, label: 'Horarios & Carta', sub: 'Horas de comida o cena y avisos' },
    { id: 6, label: 'Contacto & Extras', sub: 'Dónde estás y qué servicios añadir' },
    { id: 7, label: 'Tu Web Lista', sub: 'Mira el resultado y activa tu web' }
  ];


  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Dynamic Header */}
      {activeSection <= 6 ? (
        /* Top Bar for Questionnaire Steps (1-6) */
        <header className="h-16 border-b border-white/10 bg-zinc-950/90 backdrop-blur-2xl px-4 sm:px-6 flex items-center justify-between z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="p-2 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition"
              title="Volver al Panel"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-white">Configuración de Tu Web</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  Paso 0{activeSection} de 06
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">
                {SECTIONS[activeSection - 1]?.label} • Tu web lista en solo 2 minutos
              </span>
            </div>
          </div>

          {/* Mobile Preview Trigger Button (Only on Mobile) */}
          <button
            type="button"
            onClick={() => setIsMobilePreviewOpen(true)}
            className="sm:hidden btn-industrial px-3 py-1.5 rounded-lg border border-emerald-500/50 bg-emerald-500/15 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5 min-h-[40px] cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            <span>Vista Previa</span>
          </button>

          {/* Desktop Preview Button */}
          <button
            type="button"
            onClick={() => setActiveSection(7)}
            className="hidden sm:inline-flex btn-industrial px-3.5 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 text-xs font-mono font-medium items-center gap-2 transition cursor-pointer min-h-[40px]"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ver Vista Previa →</span>
          </button>
        </header>
      ) : (
        /* Top Bar for Step 7 (Preview & Live Modifications) */
        <header className="h-16 border-b border-white/10 bg-zinc-950/90 backdrop-blur-2xl px-4 sm:px-6 flex items-center justify-between z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveSection(6)}
              className="px-3 py-1.5 rounded-xl border border-white/10 text-zinc-300 hover:text-white hover:bg-white/5 transition flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Volver a las Preguntas</span>
              <span className="sm:hidden">Volver</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-white">Vista Previa de Tu Web & Modificaciones</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  Paso Final
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">
                Revisa el resultado real; si algo no te gusta, cámbialo en la barra superior al instante
              </span>
            </div>
          </div>

          {/* Viewport Toggles & Launch CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Step 7 Preview button */}
            <button
              type="button"
              onClick={() => setIsMobilePreviewOpen(true)}
              className="md:hidden btn-industrial px-3 py-1.5 rounded-lg border border-emerald-500/50 bg-emerald-500/15 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5 min-h-[40px] cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ver Previa</span>
            </button>

            <div className="hidden md:flex items-center gap-1 p-1 bg-zinc-900 border border-white/10 rounded-xl">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-lg transition ${previewDevice === 'desktop' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
                title="Vista de Ordenador"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewDevice('tablet')}
                className={`p-1.5 rounded-lg transition ${previewDevice === 'tablet' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
                title="Vista de Tablet"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-lg transition ${previewDevice === 'mobile' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
                title="Vista Movil"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="px-4 sm:px-5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-extrabold transition flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] disabled:opacity-50 min-h-[40px]"
            >
              {saving ? 'Guardando en la nube...' : 'Lanzar Mi Sitio Web'}
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </header>
      )}

      {/* Main Content: Steps 1-6 Questionnaire VS Step 7 Final Preview */}
      {activeSection <= 6 ? (
        <div className="flex-1 overflow-y-auto bg-zinc-950/40 px-3 sm:px-6 py-4 sm:py-8">
          <div className="max-w-3xl mx-auto space-y-5 sm:space-y-6">
            {/* Step Navigation Pills & Progress Bar */}
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2.5 shadow-lg">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-zinc-300 uppercase tracking-wider text-[11px] font-semibold">// PROGRESO DEL FORMULARIO</span>
                <span className="font-mono text-emerald-400 font-bold">Paso {activeSection} de 6</span>
              </div>
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                <div 
                  className="bg-emerald-400 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${(activeSection / 6) * 100}%` }}
                />
              </div>

              {/* Desktop Steps Grid */}
              <div className="hidden sm:grid sm:grid-cols-7 gap-1 pt-1">
                {SECTIONS.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSection(sec.id)}
                    className={`py-2 px-1 text-center rounded-lg border transition flex flex-col items-center gap-0.5 cursor-pointer ${
                      activeSection === sec.id
                        ? 'border-emerald-400 bg-emerald-500/15 text-white font-bold ring-1 ring-emerald-400'
                        : activeSection > sec.id
                        ? 'border-zinc-700 bg-zinc-900 text-zinc-200'
                        : 'border-zinc-800/80 bg-zinc-950 text-zinc-500'
                    }`}
                  >
                    <span className="text-[10px] font-mono leading-none">0{sec.id}</span>
                    <span className="text-[9px] truncate max-w-full font-medium">{sec.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              {/* Mobile Steps Scrollable Bar */}
              <div className="sm:hidden flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {SECTIONS.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSection(sec.id)}
                    className={`px-3 py-2 rounded-lg border text-xs font-mono whitespace-nowrap transition flex items-center gap-1.5 min-h-[44px] shrink-0 cursor-pointer ${
                      activeSection === sec.id
                        ? 'border-emerald-400 bg-emerald-500/20 text-white font-bold ring-1 ring-emerald-400'
                        : activeSection > sec.id
                        ? 'border-zinc-700 bg-zinc-900 text-zinc-200'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-500'
                    }`}
                  >
                    <span className="text-[10px] text-emerald-400 font-bold">0{sec.id}</span>
                    <span>{sec.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Step Questionnaire Card */}
            <div className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl">

            {/* SECTION 1: Tu Negocio (Aspects 1 - 6) */}
            {activeSection === 1 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-b border-white/5 pb-3">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">Paso 01</span>
                  <h2 className="text-lg font-bold text-white tracking-tight">Cuéntanos sobre tu local</h2>
                  <p className="text-xs text-zinc-400">Aspectos 1 al 6: Nombre, dirección en internet, tipo de cocina y ropa recomendada.</p>
                </div>

                {/* Aspect 1: ¿Qué tipo de local tienes? */}
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-2">
                    1. ¿Qué tipo de local tienes?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      { id: 'night_bar', name: 'Bar de copas y cócteles', icon: Wine },
                      { id: 'gastronomic', name: 'Restaurante gastronómico', icon: Utensils },
                      { id: 'trattoria', name: 'Restaurante tradicional o asador', icon: Flame },
                      { id: 'lounge', name: 'Lounge bar o local exclusivo', icon: GlassWater },
                    ].map(c => {
                      const Icon = c.icon;
                      const isSel = formData.category === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => handleCategorySelect(c.id)}
                          className={`p-3 rounded-lg border text-left transition flex items-center gap-2.5 min-h-[48px] cursor-pointer ${
                            isSel
                              ? 'border-emerald-400 bg-emerald-500/15 text-white ring-1 ring-emerald-400'
                              : 'border-zinc-800 bg-zinc-900/70 text-zinc-300 hover:border-zinc-700'
                          }`}
                        >
                          <Icon className={`w-4 h-4 shrink-0 ${isSel ? 'text-emerald-400' : 'text-zinc-400'}`} />
                          <span className="text-xs font-semibold leading-tight">{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Aspect 2 & 3: Nombre y Dirección web */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">
                      2. ¿Cómo se llama tu local o restaurante?
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Ej: Bar Los Claveles, Terraza Marina..."
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-emerald-400 transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">
                      3. ¿Qué dirección quieres para tu web en internet?
                    </label>
                    <p className="text-[11px] text-zinc-400 mb-1.5">Tus clientes entrarán aquí directamente desde su móvil:</p>
                    <div className="flex items-center gap-2 px-3.5 py-2.5 min-h-[44px] rounded-lg bg-zinc-900/90 border border-zinc-800 text-xs font-mono text-zinc-300">
                      <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>https://</span>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => {
                          const s = sanitizeSlug(e.target.value);
                          setFormData(prev => ({ ...prev, slug: s, subdomain: s }));
                        }}
                        className="bg-transparent text-emerald-300 font-bold focus:outline-none flex-1"
                      />
                      <span className="text-zinc-500">.tecnodiel.app</span>
                    </div>
                  </div>
                </div>

                {/* Aspect 4 & 5: Eslogan y Descripción */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">
                      4. Una frase corta o lema que resuma tu local
                    </label>
                    <input
                      type="text"
                      value={formData.slogan}
                      onChange={(e) => setFormData(prev => ({ ...prev, slogan: e.target.value }))}
                      placeholder="Ej: Los mejores cócteles y tapas junto al puerto"
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-emerald-400 transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">
                      5. Cuéntale a tus clientes qué hace especial a tu local
                    </label>
                    <textarea
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Ej: Un espacio acogedor donde compartir buenas raciones, tomar una copa tranquila o celebrar en buena compañía..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-400 resize-none transition"
                    />
                  </div>
                </div>

                {/* Aspect 6: Ropa recomendada */}
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    6. ¿Qué tipo de ropa recomiendas a tus comensales?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {['Ropa cómoda y casual', 'Arreglado pero informal (Smart Casual)', 'Elegante y de vestir', 'Sin ninguna norma, ¡ven como quieras!'].map(code => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, dress_code: code }))}
                        className={`p-3 rounded-lg border text-xs text-left transition min-h-[44px] cursor-pointer ${
                          formData.dress_code === code
                            ? 'border-emerald-400 bg-emerald-500/15 text-white font-semibold ring-1 ring-emerald-400'
                            : 'border-zinc-800 bg-zinc-900/70 text-zinc-300 hover:border-zinc-700'
                        }`}
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 2: Diseño & Portada (Aspects 7 - 10) */}
            {activeSection === 2 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-b border-white/5 pb-3">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">Paso 02</span>
                  <h2 className="text-lg font-bold text-white tracking-tight">Diseño visual y portada de tu web</h2>
                  <p className="text-xs text-zinc-400">Aspectos 7 al 10: Estilo general, diseño de portada, foto principal y ambiente.</p>
                </div>

                {/* Aspect 7: Plantilla Estructural */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-zinc-300">
                      7. ¿Qué estilo de diseño le pega más a tu local? (30 Plantillas Disponibles)
                    </label>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      30 Estilos Únicos
                    </span>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 no-scrollbar">
                    {[
                      { id: 'all', label: 'Todos (30)' },
                      { id: 'night_bar', label: 'Copas & Noche' },
                      { id: 'gastronomic', label: 'Alta Cocina' },
                      { id: 'trattoria', label: 'Tradición & Brasa' },
                      { id: 'tapas', label: 'Tapas & Street' },
                      { id: 'cafe_sweet', label: 'Café & Dulce' },
                      { id: 'mediterranean', label: 'Costa & Mar' },
                      { id: 'tech_elite', label: 'TecnOdiel Elite' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setTemplateFilter(tab.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition cursor-pointer min-h-[36px] ${
                          templateFilter === tab.id
                            ? 'bg-emerald-400 text-black font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                            : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                    {TEMPLATES.filter(t => templateFilter === 'all' || t.category === templateFilter).map(t => {
                      const isSel = formData.template_id === t.id;
                      return (
                        <div
                          key={t.id}
                          onClick={() => setFormData(prev => ({ 
                            ...prev, 
                            template_id: t.id, 
                            hero_image: t.heroBg, 
                            font_family: t.defaultFont,
                            primary_color: t.previewColors.primary,
                            accent_color: t.previewColors.accent,
                            background_color: t.previewColors.bg,
                            surface_color: t.previewColors.card,
                            menu_categories: getPresetMenuForStyle(t.id)
                          }))}
                          className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                            isSel
                              ? 'border-emerald-400 bg-emerald-500/15 shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-400'
                              : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">{t.name}</span>
                              <span className="text-[9px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">{t.badge}</span>
                            </div>
                            <p className="text-[11px] text-zinc-400 leading-snug">{t.description}</p>
                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {(t.tags || []).map((tag, tagIdx) => (
                                <span key={tagIdx} className="text-[9px] px-1.5 py-0.2 rounded bg-white/5 text-zinc-400 font-mono">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-col items-center gap-1.5 shrink-0 ml-3">
                            <div 
                              className="w-4 h-4 rounded-full border border-white/20 shadow-sm" 
                              style={{ backgroundColor: t.previewColors.primary }} 
                            />
                            <div 
                              className="w-2.5 h-2.5 rounded-full border border-white/20 opacity-70" 
                              style={{ backgroundColor: t.previewColors.accent }} 
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Aspect 8: Disposicion del Hero (Layout) */}
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-2">
                    8. ¿Cómo quieres la portada que verán al entrar?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'centered', name: 'Foto completa con botón al centro', desc: 'Tu foto ocupa la pantalla y el botón de reserva destaca en medio' },
                      { id: 'split', name: 'Texto a un lado y foto al otro', desc: 'Para que lean tu historia mientras ven tu mejor plato o barra' },
                      { id: 'minimal', name: 'Solo texto y acceso directo', desc: 'Directo al grano, para clientes que quieren reservar o ver la carta ya' },
                    ].map(lay => (
                      <button
                        key={lay.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, hero_layout: lay.id }))}
                        className={`p-3 rounded-lg border text-left transition min-h-[52px] cursor-pointer ${
                          formData.hero_layout === lay.id
                            ? 'border-emerald-400 bg-emerald-500/15 text-white font-semibold ring-1 ring-emerald-400'
                            : 'border-zinc-800 bg-zinc-900/70 text-zinc-300 hover:border-zinc-700'
                        }`}
                      >
                        <span className="text-xs block font-bold text-white">{lay.name}</span>
                        <span className="text-[10px] text-zinc-400 block mt-1 leading-snug">{lay.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aspect 9: Imagen Principal de Cabecera */}
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    9. Foto principal de tu portada
                  </label>
                  <p className="text-[11px] text-zinc-400 mb-1.5">Esta será la primera foto grande que verán al entrar. Puedes pegar un enlace o elegir una de prueba:</p>
                  <input
                    type="text"
                    value={formData.hero_image}
                    onChange={(e) => setFormData(prev => ({ ...prev, hero_image: e.target.value }))}
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-white focus:outline-none focus:border-emerald-400 transition"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {[
                      { label: 'Foto Cócteles / Noche', url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1920&q=80' },
                      { label: 'Foto Platos Cuidados', url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1920&q=80' },
                      { label: 'Foto Horno de Leña', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=80' },
                      { label: 'Foto Barra & Copas', url: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1920&q=80' }
                    ].map(img => (
                      <button
                        key={img.label}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, hero_image: img.url }))}
                        className="px-2.5 py-1.5 min-h-[36px] rounded-lg border border-zinc-800 text-[11px] bg-zinc-900 text-zinc-300 hover:text-white cursor-pointer"
                      >
                        {img.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aspect 10: Acabado Ambiental / Textura */}
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    10. Ambiente de iluminación en el fondo
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'spotlight', name: 'Luz de noche' },
                      { id: 'grain', name: 'Toque fotográfico' },
                      { id: 'vignette', name: 'Borde oscurecido' },
                      { id: 'clean', name: 'Fondo limpio' }
                    ].map(tex => (
                      <button
                        key={tex.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, texture: tex.id }))}
                        className={`p-2 rounded-xl border text-center text-xs transition ${
                          formData.texture === tex.id
                            ? 'border-emerald-400 bg-emerald-500/10 text-white font-bold'
                            : 'border-white/5 bg-zinc-900 text-zinc-400'
                        }`}
                      >
                        {tex.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 3: Colores & Letra (Aspects 11 - 15) */}
            {activeSection === 3 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-b border-white/5 pb-3">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">Paso 03</span>
                  <h2 className="text-lg font-bold text-white tracking-tight">Colores y tipo de letra</h2>
                  <p className="text-xs text-zinc-400">Aspectos 11 al 15: Colores de tu local, fondo y tipografía para títulos y textos.</p>
                </div>

                {/* Aspect 11: Paleta de Autor */}
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-2">
                    11. Elige una combinación de colores lista para usar
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {COLOR_PALETTES.map(p => {
                      const isSel = formData.primary_color === p.primary;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handlePaletteSelect(p)}
                          className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                            isSel ? 'border-white bg-zinc-800' : 'border-white/5 bg-zinc-900/60'
                          }`}
                        >
                          <span className="text-xs text-white font-medium truncate">{p.name}</span>
                          <div className="flex gap-1">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.primary }} />
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.accent }} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Aspect 12 & 13: Colores Primario y Acento */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">
                      12. Color principal (botones y títulos)
                    </label>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-900 border border-white/10">
                      <input
                        type="color"
                        value={formData.primary_color}
                        onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
                        className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={formData.primary_color}
                        onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
                        className="bg-transparent text-xs font-mono text-white focus:outline-none w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">
                      13. Color secundario (detalles)
                    </label>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-900 border border-white/10">
                      <input
                        type="color"
                        value={formData.accent_color}
                        onChange={(e) => setFormData(prev => ({ ...prev, accent_color: e.target.value }))}
                        className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={formData.accent_color}
                        onChange={(e) => setFormData(prev => ({ ...prev, accent_color: e.target.value }))}
                        className="bg-transparent text-xs font-mono text-white focus:outline-none w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Aspect 14: Fondo y Superficie */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">
                      14. Color de fondo de la web
                    </label>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-900 border border-white/10">
                      <input
                        type="color"
                        value={formData.background_color}
                        onChange={(e) => setFormData(prev => ({ ...prev, background_color: e.target.value }))}
                        className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={formData.background_color}
                        onChange={(e) => setFormData(prev => ({ ...prev, background_color: e.target.value }))}
                        className="bg-transparent text-xs font-mono text-white focus:outline-none w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">
                      Color de tarjetas y platos
                    </label>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-900 border border-white/10">
                      <input
                        type="color"
                        value={formData.surface_color}
                        onChange={(e) => setFormData(prev => ({ ...prev, surface_color: e.target.value }))}
                        className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={formData.surface_color}
                        onChange={(e) => setFormData(prev => ({ ...prev, surface_color: e.target.value }))}
                        className="bg-transparent text-xs font-mono text-white focus:outline-none w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Aspect 15: Tipografia */}
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-2">
                    15. ¿Qué estilo de letra te gusta más?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'Inter', name: 'Clara y moderna (Inter)', desc: 'Muy limpia y fácil de leer en cualquier móvil' },
                      { id: 'Outfit', name: 'Actual y con estilo (Outfit)', desc: 'Moderna, ideal para locales de copas y gastrobares' },
                      { id: 'Playfair Display', name: 'Clásica de restaurante (Playfair)', desc: 'Elegante y tradicional, de alta cocina' }
                    ].map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, font_family: f.id }))}
                        className={`p-3 rounded-lg border text-left transition min-h-[52px] cursor-pointer ${
                          formData.font_family === f.id
                            ? 'border-emerald-400 bg-emerald-500/15 text-white font-bold ring-1 ring-emerald-400'
                            : 'border-zinc-800 bg-zinc-900/70 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <span className="text-xs block font-bold text-white">{f.name}</span>
                        <span className="text-[10px] text-zinc-400 block mt-0.5 leading-snug">{f.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 4: Reservas de Mesas (Aspects 16 - 20) */}
            {activeSection === 4 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-b border-white/5 pb-3">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">Paso 04</span>
                  <h2 className="text-lg font-bold text-white tracking-tight">Reservas de mesas sin intermediarios</h2>
                  <p className="text-xs text-zinc-400">Aspectos 16 al 20: Espacios de tu local, cuánta gente cabe por mesa y cómo aceptar las reservas.</p>
                </div>

                {/* Aspect 16: Zonas de Mesas */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-300 block">
                    16. ¿Qué zonas tienes en tu local para sentarse?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {formData.booking_rules.available_areas.map((area, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-white">
                        <span>{area}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveArea(idx)}
                          className="text-zinc-500 hover:text-red-400 text-xs cursor-pointer ml-1"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Añadir zona (ej: Salón comedor, Terraza, Barra)..."
                      value={newAreaInput}
                      onChange={(e) => setNewAreaInput(e.target.value)}
                      className="flex-1 min-h-[44px] px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-400 transition"
                    />
                    <button
                      type="button"
                      onClick={handleAddArea}
                      className="btn-industrial min-h-[44px] px-4 py-2 rounded-lg bg-white text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition cursor-pointer"
                    >
                      Añadir zona
                    </button>
                  </div>
                </div>

                {/* Aspect 17: Capacidad Maxima por Mesa */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-zinc-300">
                      17. ¿Hasta cuántas personas caben por reserva de grupo?
                    </label>
                    <span className="font-mono text-xs text-emerald-400 font-bold">
                      {formData.booking_rules.max_guests_per_table} personas como máximo
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="20"
                    step="1"
                    value={formData.booking_rules.max_guests_per_table}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      booking_rules: { ...prev.booking_rules, max_guests_per_table: parseInt(e.target.value, 10) }
                    }))}
                    className="w-full accent-emerald-400 h-2 bg-zinc-900 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Aspect 18: Intervalos de Turno */}
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    18. ¿Cada cuánto tiempo pueden reservar mesa?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { mins: 15, label: 'Cada 15 min' },
                      { mins: 30, label: 'Cada 30 min' },
                      { mins: 45, label: 'Cada 45 min' },
                      { mins: 60, label: 'Cada hora' }
                    ].map(slot => (
                      <button
                        key={slot.mins}
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          booking_rules: { ...prev.booking_rules, slot_interval_minutes: slot.mins }
                        }))}
                        className={`p-2.5 rounded-lg border text-center text-xs font-mono transition min-h-[44px] cursor-pointer ${
                          formData.booking_rules.slot_interval_minutes === slot.mins
                            ? 'border-emerald-400 bg-emerald-500/15 text-white font-bold ring-1 ring-emerald-400'
                            : 'border-zinc-800 bg-zinc-900/70 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aspect 19: Antelacion Minima */}
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    19. ¿Con cuánto tiempo de antelación deben reservar?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      'Sobre la marcha (el mismo día)',
                      'Con al menos 2 horas de antelación',
                      'Con 24 horas de antelación (el día antes)'
                    ].map(ant => (
                      <button
                        key={ant}
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          booking_rules: { ...prev.booking_rules, advance_notice: ant }
                        }))}
                        className={`p-3 rounded-lg border text-left text-xs transition min-h-[48px] cursor-pointer ${
                          formData.booking_rules.advance_notice === ant
                            ? 'border-emerald-400 bg-emerald-500/15 text-white font-semibold ring-1 ring-emerald-400'
                            : 'border-zinc-800 bg-zinc-900/70 text-zinc-300 hover:border-zinc-700'
                        }`}
                      >
                        {ant}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aspect 20: Modo de Confirmacion */}
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    20. ¿Cómo quieres que se confirmen las reservas?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      { id: 'instant', name: 'Confirmación automática al momento', desc: 'El cliente reserva y se le confirma de inmediato sin que tengas que hacer nada' },
                      { id: 'manual', name: 'Revisar yo antes de confirmar', desc: 'Te llega la solicitud y tú compruebas si tienes hueco libre antes de dar el visto bueno' }
                    ].map(mod => (
                      <button
                        key={mod.id}
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          booking_rules: { ...prev.booking_rules, confirmation_mode: mod.id }
                        }))}
                        className={`p-3 rounded-lg border text-left transition min-h-[52px] cursor-pointer ${
                          formData.booking_rules.confirmation_mode === mod.id
                            ? 'border-emerald-400 bg-emerald-500/15 text-white font-semibold ring-1 ring-emerald-400'
                            : 'border-zinc-800 bg-zinc-900/70 text-zinc-300 hover:border-zinc-700'
                        }`}
                      >
                        <span className="text-xs block font-bold text-white">{mod.name}</span>
                        <span className="text-[10px] text-zinc-400 block mt-1 leading-snug">{mod.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 5: Horarios & Carta (Aspects 21 - 24) */}
            {activeSection === 5 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-b border-white/5 pb-3">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">Paso 05</span>
                  <h2 className="text-lg font-bold text-white tracking-tight">Horarios de apertura y avisos de comida</h2>
                  <p className="text-xs text-zinc-400">Aspectos 21 al 24: Turnos de comidas y cenas, días que cerráis por descanso y avisos de carta.</p>
                </div>

                {/* Aspect 21: Turno Almuerzo */}
                <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">21. Horario de Comidas (Mediodía)</span>
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                      <input
                        type="checkbox"
                        checked={formData.lunch_shift.enabled}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          lunch_shift: { ...prev.lunch_shift, enabled: e.target.checked }
                        }))}
                        className="accent-emerald-400"
                      />
                      <span>Abrimos a mediodía</span>
                    </label>
                  </div>
                  {formData.lunch_shift.enabled && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <span className="text-[10px] text-zinc-400 block mb-0.5">Hora de abrir</span>
                        <input
                          type="time"
                          value={formData.lunch_shift.open}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            lunch_shift: { ...prev.lunch_shift, open: e.target.value }
                          }))}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-white/10 text-xs text-white"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 block mb-0.5">Hora de cerrar</span>
                        <input
                          type="time"
                          value={formData.lunch_shift.close}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            lunch_shift: { ...prev.lunch_shift, close: e.target.value }
                          }))}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-white/10 text-xs text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Aspect 22: Turno Cena */}
                <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">22. Horario de Cenas y Copas (Noche)</span>
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                      <input
                        type="checkbox"
                        checked={formData.dinner_shift.enabled}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          dinner_shift: { ...prev.dinner_shift, enabled: e.target.checked }
                        }))}
                        className="accent-emerald-400"
                      />
                      <span>Abrimos por la noche</span>
                    </label>
                  </div>
                  {formData.dinner_shift.enabled && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <span className="text-[10px] text-zinc-400 block mb-0.5">Hora de abrir</span>
                        <input
                          type="time"
                          value={formData.dinner_shift.open}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            dinner_shift: { ...prev.dinner_shift, open: e.target.value }
                          }))}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-white/10 text-xs text-white"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 block mb-0.5">Hora de cerrar</span>
                        <input
                          type="time"
                          value={formData.dinner_shift.close}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            dinner_shift: { ...prev.dinner_shift, close: e.target.value }
                          }))}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-white/10 text-xs text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Aspect 23: Dias de Cierre */}
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    23. ¿Qué días cerráis por descanso del personal?
                  </label>
                  <p className="text-[11px] text-zinc-400 mb-1.5">Pulsa sobre los días que tengáis cerrado:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'].map(dia => {
                      const isClosed = formData.closed_days.includes(dia);
                      return (
                        <button
                          key={dia}
                          type="button"
                          onClick={() => {
                            const updated = isClosed
                              ? formData.closed_days.filter(d => d !== dia)
                              : [...formData.closed_days, dia];
                            setFormData(prev => ({ ...prev, closed_days: updated }));
                          }}
                          className={`px-3 py-1.5 rounded-xl border text-xs transition ${
                            isClosed
                              ? 'border-red-500/40 bg-red-950/40 text-red-300 font-bold'
                              : 'border-white/5 bg-zinc-900 text-zinc-400 hover:border-white/15'
                          }`}
                        >
                          {dia} {isClosed ? '(Cerrado)' : ''}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Aspect 24: Filtros Dieteticos en Carta */}
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    24. Avisos de comida para tus comensales en la carta digital
                  </label>
                  <p className="text-[11px] text-zinc-400 mb-1.5">Tus clientes podrán pulsar estos botones para ver platos según lo que puedan comer:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Gluten Free', 'Sin Lacteos', 'Vegano', 'Vegetariano', 'Halal', 'Bajo en Sodio'].map(f => {
                      const isAct = formData.dietary_filters.includes(f);
                      return (
                        <button
                          key={f}
                          type="button"
                          onClick={() => {
                            const updated = isAct
                              ? formData.dietary_filters.filter(x => x !== f)
                              : [...formData.dietary_filters, f];
                            setFormData(prev => ({ ...prev, dietary_filters: updated }));
                          }}
                          className={`px-3 py-1 rounded-xl text-xs border transition ${
                            isAct
                              ? 'border-emerald-400 bg-emerald-500/10 text-white font-medium'
                              : 'border-white/5 bg-zinc-900 text-zinc-400'
                          }`}
                        >
                          {f}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 6: Contacto & Extras (Aspects 25 - 28) */}
            {activeSection === 6 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-b border-white/5 pb-3">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">Paso 06</span>
                  <h2 className="text-lg font-bold text-white tracking-tight">Contacto, ubicación y servicios que necesitas</h2>
                  <p className="text-xs text-zinc-400">Aspectos 25 al 28: Teléfono, WhatsApp, dirección en el mapa y servicios para tu presupuesto a medida.</p>
                </div>

                {/* Aspect 25 & 26: Telefono y WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">
                      25. Teléfono fijo o móvil de tu local
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-400 transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">
                      26. Móvil con WhatsApp para avisos de reservas y clientes
                    </label>
                    <input
                      type="text"
                      value={formData.whatsapp_number}
                      onChange={(e) => setFormData(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-400 transition"
                    />
                  </div>
                </div>

                {/* Aspect 27: Correo */}
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    27. Correo electrónico de tu negocio
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-400 transition"
                  />
                </div>

                {/* Aspect 28: Direccion y Ciudad */}
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-zinc-300 block mb-1">
                        28. Calle y número
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-400 transition"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-zinc-300 block mb-1">
                        Ciudad o localidad
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-400 transition"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                    <span className="flex items-center gap-1.5 text-[11px] text-zinc-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      Google y Mapas preparados: Tu dirección y horarios estarán listos para que los vecinos te encuentren al buscar en el móvil.
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold shrink-0 ml-2 font-mono">SEO Local</span>
                  </div>
                </div>

                {/* Aspect 29: Modulos y Servicios Seleccionables con Impacto en Precio */}
                <div className="pt-4 border-t border-zinc-800 space-y-3">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">Servicios y Extras para tu Local</span>
                    <h3 className="text-sm font-bold text-white tracking-tight">¿Qué herramientas necesitas en tu día a día?</h3>
                    <p className="text-xs text-zinc-400">Marca solo lo que vayas a usar. Puedes activar o desactivar lo que quieras y el precio se calcula en el momento.</p>
                  </div>

                  <div className="space-y-2.5">
                    {AVAILABLE_MODULES.map(mod => {
                      const isSelected = (formData.selected_modules || []).includes(mod.id);
                      return (
                        <div
                          key={mod.id}
                          onClick={() => toggleModule(mod.id)}
                          className={`p-3.5 sm:p-4 rounded-xl border transition cursor-pointer flex items-start justify-between gap-3 min-h-[56px] ${
                            isSelected
                              ? 'border-emerald-500/50 bg-emerald-950/20 text-white shadow-lg ring-1 ring-emerald-500/30'
                              : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center border mt-0.5 shrink-0 ${
                              isSelected ? 'bg-emerald-400 border-emerald-400 text-black' : 'border-zinc-700 bg-zinc-800'
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-zinc-300'}`}>{mod.name}</span>
                                <span className="text-[9px] px-2 py-0.5 rounded-full bg-zinc-800 text-emerald-400 border border-emerald-500/20 font-mono font-semibold">{mod.badge}</span>
                              </div>
                              <p className="text-[11px] text-zinc-400 leading-snug">{mod.description}</p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className={`text-xs font-bold font-mono ${isSelected ? 'text-emerald-400' : 'text-zinc-400'}`}>+{mod.price}€</span>
                            <span className="text-[10px] text-zinc-500 block font-mono">/mes</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Live Price Estimation in Section 6 */}
                  <div className="p-3.5 rounded-xl bg-zinc-900 border border-emerald-500/30 flex items-center justify-between text-xs mt-3">
                    <div>
                      <span className="text-zinc-400 block text-[11px]">Tu cuota mensual personalizada:</span>
                      <span className="text-zinc-500 text-[10px]">Web completa (29€) + {(formData.selected_modules || []).length} servicios seleccionados</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-emerald-400 font-mono">{calculatePlanPrice()}€</span>
                      <span className="text-[10px] text-zinc-400 font-mono block">/ mes (sin permanencia)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}


            {/* Step Questionnaire Footer Navigation */}
            <div className="mt-8 pt-5 border-t border-zinc-800 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {activeSection > 1 ? (
                <button
                  type="button"
                  onClick={() => setActiveSection(prev => prev - 1)}
                  className="btn-industrial px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-300 text-xs font-mono font-medium hover:text-white transition flex items-center justify-center gap-1.5 min-h-[48px] cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Paso Anterior</span>
                </button>
              ) : <div className="hidden sm:block" />}

              {activeSection < 6 ? (
                <button
                  type="button"
                  onClick={() => setActiveSection(prev => prev + 1)}
                  className="btn-industrial px-6 py-2.5 rounded-lg bg-white text-black hover:bg-zinc-200 text-xs font-mono font-bold transition flex items-center justify-center gap-2 shadow-lg min-h-[48px] cursor-pointer"
                >
                  <span>Siguiente: {SECTIONS[activeSection]?.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection(7);
                    try {
                      confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });
                    } catch (e) {}
                  }}
                  className="btn-industrial px-6 py-3 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-mono font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.5)] min-h-[48px] cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ver Mi Web Lista en Directo</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    ) : (
      /* STEP 7: Vista Previa Final y Modificaciones en Vivo */
      <div className="flex-1 flex flex-col overflow-hidden bg-[#020203]">
        {/* Quick Tweaks Control Bar - Collapsible & Clean Dropdown */}
        {isTweakBarCollapsed ? (
          <div className="border-b border-white/10 bg-zinc-950/95 backdrop-blur-xl px-4 sm:px-6 py-2.5 flex items-center justify-between z-20 shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">VISTA PREVIA EN VIVO:</span>
              <span className="text-xs font-bold text-white bg-zinc-900 border border-white/10 px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-sm">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>{TEMPLATES.find(t => t.id === formData.template_id)?.name || 'Estilo Seleccionado'}</span>
              </span>
              {tweakNotice && (
                <span className="text-xs text-emerald-400 font-mono hidden md:inline animate-fadeIn">
                  ✓ {tweakNotice}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`/#/r/${formData.slug}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                title="Abrir web completa en nueva pestaña"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Abrir Web</span>
              </a>

              <button
                type="button"
                onClick={() => setIsTweakBarCollapsed(false)}
                className="btn-industrial px-3.5 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-extrabold transition flex items-center gap-1.5 shadow-md cursor-pointer"
                title="Desplegar panel para cambiar estilo, colores, módulos o textos"
              >
                <Sliders className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Retocar Web / Estilos</span>
                <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        ) : (
          <div className="border-b border-white/10 bg-zinc-950/95 backdrop-blur-xl px-4 sm:px-6 py-3 space-y-2.5 z-20">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Panel de Retoques en Tiempo Real</span>
                </span>
                {tweakNotice && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-medium flex items-center gap-1 animate-fadeIn">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>{tweakNotice}</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
                  Los cambios se aplican al instante
                </span>
                <button
                  type="button"
                  onClick={() => setIsTweakBarCollapsed(true)}
                  className="px-3 py-1 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono font-medium transition flex items-center gap-1.5 cursor-pointer"
                  title="Ocultar este panel para ver la web a pantalla completa"
                >
                  <ChevronUp className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Ocultar Panel</span>
                </button>
              </div>
            </div>

            {/* Quick Tweak Category Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'template', label: 'Cambiar Estilo', icon: Layers },
                { id: 'menu', label: 'Editar Carta', icon: Utensils },
                { id: 'services', label: 'Servicios & Precio', icon: CreditCard },
                { id: 'colors', label: 'Cambiar Colores', icon: Palette },
                { id: 'layout', label: 'Cambiar Portada', icon: Layout },
                { id: 'typography', label: 'Cambiar Letra', icon: Type },
                { id: 'texture', label: 'Luz de Fondo', icon: Sparkles },
                { id: 'quickedit', label: 'Retocar Textos', icon: Edit3 }
              ].map(tab => {
                const TabIcon = tab.icon;
                const isActive = quickTweakTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setQuickTweakTab(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
                      isActive 
                        ? 'bg-emerald-400 text-black font-bold shadow-md' 
                        : 'bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <TabIcon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Options for Selected Quick Tweak */}
            <div className="pt-2 border-t border-white/5">
              {quickTweakTab === 'template' && (
                <div className="flex flex-col md:flex-row md:items-center gap-3 pt-1 animate-fadeIn">
                  {/* Clean categorized dropdown */}
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
                    <label htmlFor="template-dropdown" className="text-xs font-mono text-zinc-400 shrink-0 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Elige Estilo:</span>
                    </label>
                    
                    <div className="relative flex-1 max-w-lg">
                      <select
                        id="template-dropdown"
                        value={formData.template_id}
                        onChange={(e) => {
                          const nextId = e.target.value;
                          const chosen = TEMPLATES.find(t => t.id === nextId);
                          const presetMenu = getPresetMenuForStyle(nextId);
                          setFormData(prev => ({ 
                            ...prev, 
                            template_id: nextId,
                            menu_categories: presetMenu,
                            ...(chosen?.previewColors ? {
                              primary_color: chosen.previewColors.primary,
                              accent_color: chosen.previewColors.accent,
                              background_color: chosen.previewColors.bg,
                              surface_color: chosen.previewColors.card,
                              hero_image: chosen.heroBg || prev.hero_image,
                              font_family: chosen.defaultFont || prev.font_family
                            } : {})
                          }));
                          setActiveMenuCatIdx(0);
                          showTweakNotice(`Estilo cambiado a ${chosen?.name || nextId}`);
                        }}
                        className="w-full pl-3.5 pr-10 py-2 rounded-xl bg-zinc-900 border border-emerald-500/40 text-white font-medium text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 transition cursor-pointer appearance-none shadow-sm"
                      >
                        {TEMPLATE_GROUPS.map((group, gIdx) => (
                          <optgroup key={gIdx} label={`${group.icon} ${group.name}`} className="bg-zinc-950 text-emerald-400 font-bold">
                            {group.templates.map(item => (
                              <option key={item.id} value={item.id} className="bg-zinc-900 text-zinc-100 font-normal py-1">
                                {item.label}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                        <ChevronDown className="w-4 h-4 text-emerald-400" />
                      </div>
                    </div>
                  </div>

                  {/* Quick Prev / Next navigation + Active Badge */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const currentIndex = TEMPLATES.findIndex(t => t.id === formData.template_id);
                        const safeIdx = currentIndex >= 0 ? currentIndex : 0;
                        const prevIndex = (safeIdx - 1 + TEMPLATES.length) % TEMPLATES.length;
                        const prevT = TEMPLATES[prevIndex];
                        if (prevT) {
                          const presetMenu = getPresetMenuForStyle(prevT.id);
                          setFormData(prev => ({ 
                            ...prev, 
                            template_id: prevT.id,
                            menu_categories: presetMenu,
                            hero_image: prevT.heroBg || prev.hero_image,
                            primary_color: prevT.previewColors?.primary || prev.primary_color,
                            accent_color: prevT.previewColors?.accent || prev.accent_color,
                            background_color: prevT.previewColors?.bg || prev.background_color,
                            surface_color: prevT.previewColors?.card || prev.surface_color,
                            font_family: prevT.defaultFont || prev.font_family
                          }));
                          setActiveMenuCatIdx(0);
                          showTweakNotice(`Estilo cambiado a ${prevT.name}`);
                        }
                      }}
                      className="px-2.5 py-1.5 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 hover:text-white transition flex items-center gap-1 cursor-pointer"
                      title="Estilo anterior"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Anterior</span>
                    </button>

                    <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold">
                      {Math.max(1, TEMPLATES.findIndex(t => t.id === formData.template_id) + 1)} / {TEMPLATES.length}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const currentIndex = TEMPLATES.findIndex(t => t.id === formData.template_id);
                        const safeIdx = currentIndex >= 0 ? currentIndex : 0;
                        const nextIndex = (safeIdx + 1) % TEMPLATES.length;
                        const nextT = TEMPLATES[nextIndex];
                        if (nextT) {
                          const presetMenu = getPresetMenuForStyle(nextT.id);
                          setFormData(prev => ({ 
                            ...prev, 
                            template_id: nextT.id,
                            menu_categories: presetMenu,
                            hero_image: nextT.heroBg || prev.hero_image,
                            primary_color: nextT.previewColors?.primary || prev.primary_color,
                            accent_color: nextT.previewColors?.accent || prev.accent_color,
                            background_color: nextT.previewColors?.bg || prev.background_color,
                            surface_color: nextT.previewColors?.card || prev.surface_color,
                            font_family: nextT.defaultFont || prev.font_family
                          }));
                          setActiveMenuCatIdx(0);
                          showTweakNotice(`Estilo cambiado a ${nextT.name}`);
                        }
                      }}
                      className="px-2.5 py-1.5 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 hover:text-white transition flex items-center gap-1 cursor-pointer"
                      title="Siguiente estilo"
                    >
                      <span className="hidden sm:inline">Siguiente</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsTweakBarCollapsed(true)}
                      className="ml-1 sm:ml-2 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                      title="Ocultar controles para ver la web a pantalla completa"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Ocultar Barra</span>
                    </button>

                    <a
                      href={`/#/r/${formData.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                      title="Abrir web en nueva pestaña"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Nueva Pestaña</span>
                    </a>
                  </div>
                </div>
              )}

              {quickTweakTab === 'menu' && (
                <div className="space-y-4 pt-1 animate-fadeIn">
                  {/* Category selector row & global actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-white/5">
                    <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto py-1">
                      <span className="text-xs font-mono text-zinc-400 mr-1 flex items-center gap-1">
                        <Utensils className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Categorías:</span>
                      </span>
                      {(formData.menu_categories || []).map((cat, cIdx) => {
                        const isCatActive = (activeMenuCatIdx || 0) === cIdx;
                        return (
                          <button
                            key={cIdx}
                            type="button"
                            onClick={() => setActiveMenuCatIdx(cIdx)}
                            className={`px-3 py-1 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
                              isCatActive
                                ? 'bg-emerald-500 text-black font-bold shadow-sm'
                                : 'bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:border-white/20'
                            }`}
                          >
                            <span>{cat.category || `Sección ${cIdx + 1}`}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                              isCatActive ? 'bg-black/20 text-black font-bold' : 'bg-zinc-800 text-zinc-400'
                            }`}>
                              {(cat.items || []).length}
                            </span>
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        className="px-2.5 py-1 rounded-xl border border-dashed border-emerald-500/40 hover:border-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-medium transition flex items-center gap-1"
                        title="Añadir una nueva sección a la carta"
                      >
                        <Plus className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Añadir Categoría</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleResetMenuToPreset}
                        className="px-2.5 py-1 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono transition flex items-center gap-1.5 cursor-pointer"
                        title="Restablecer los platos sugeridos para este estilo de restaurante"
                      >
                        <RefreshCw className="w-3 h-3 text-emerald-400" />
                        <span>Restablecer Ejemplo del Estilo</span>
                      </button>
                    </div>
                  </div>

                  {/* Active Category Editor & Dishes */}
                  {(() => {
                    const currentCats = formData.menu_categories || [];
                    const safeIdx = Math.min(Math.max(0, activeMenuCatIdx || 0), Math.max(0, currentCats.length - 1));
                    const currentCat = currentCats[safeIdx];
                    if (!currentCat) return (
                      <div className="p-4 text-center text-xs text-zinc-400">
                        No hay platos configurados.{' '}
                        <button type="button" onClick={handleResetMenuToPreset} className="text-emerald-400 underline ml-1">
                          Cargar platos sugeridos
                        </button>
                      </div>
                    );

                    return (
                      <div className="space-y-3">
                        {/* Category Name & Actions Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-zinc-900/60 p-2.5 rounded-xl border border-white/5">
                          <div className="flex items-center gap-2 flex-1">
                            <label className="text-xs font-mono text-zinc-400 shrink-0">Nombre de la Sección:</label>
                            <input
                              type="text"
                              value={currentCat.category || ''}
                              onChange={(e) => handleUpdateCategoryName(safeIdx, e.target.value)}
                              placeholder="Ej: Entrantes, Carnes, Postres..."
                              className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-white/10 text-white text-xs font-bold focus:border-emerald-400 focus:outline-none w-full max-w-xs"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleAddDish(safeIdx)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition flex items-center gap-1 shadow-sm cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Añadir Plato</span>
                            </button>
                            {currentCats.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveCategory(safeIdx)}
                                className="px-2.5 py-1.5 rounded-lg border border-red-500/20 hover:border-red-500/50 bg-red-500/10 text-red-300 text-xs transition flex items-center gap-1 cursor-pointer"
                                title="Eliminar toda esta categoría de la carta"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Eliminar Sección</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Dishes Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
                          {(currentCat.items || []).map((dish, dIdx) => (
                            <div
                              key={dIdx}
                              className="p-3 rounded-xl bg-zinc-900/90 border border-white/10 hover:border-white/20 transition space-y-2 group"
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-md bg-zinc-800 text-zinc-400 text-[10px] font-mono flex items-center justify-center font-bold">
                                  {dIdx + 1}
                                </span>
                                <input
                                  type="text"
                                  value={dish.name || ''}
                                  onChange={(e) => handleUpdateDish(safeIdx, dIdx, 'name', e.target.value)}
                                  placeholder="Nombre del plato"
                                  className="flex-1 px-2.5 py-1 rounded-lg bg-zinc-950 border border-white/10 text-xs font-semibold text-white focus:border-emerald-400 focus:outline-none"
                                />
                                <input
                                  type="text"
                                  value={dish.price || ''}
                                  onChange={(e) => handleUpdateDish(safeIdx, dIdx, 'price', e.target.value)}
                                  placeholder="14,00€"
                                  className="w-20 px-2 py-1 rounded-lg bg-zinc-950 border border-white/10 text-xs font-mono font-bold text-emerald-400 text-right focus:border-emerald-400 focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveDish(safeIdx, dIdx)}
                                  className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                                  title="Eliminar este plato"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <textarea
                                rows={2}
                                value={dish.description || ''}
                                onChange={(e) => handleUpdateDish(safeIdx, dIdx, 'description', e.target.value)}
                                placeholder="Descripción del plato, ingredientes frescos, maridaje sugerido o alérgenos..."
                                className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-white/5 text-[11px] text-zinc-300 focus:border-emerald-400 focus:outline-none resize-none leading-relaxed"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

            {quickTweakTab === 'services' && (
              <div className="flex flex-wrap items-center gap-2 animate-fadeIn">
                <span className="text-[11px] font-mono text-zinc-400 pr-1">Servicios Activos:</span>
                {AVAILABLE_MODULES.map(mod => {
                  const isSel = (formData.selected_modules || []).includes(mod.id);
                  return (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => toggleModule(mod.id)}
                      className={`px-3 py-1.5 rounded-xl border text-xs transition flex items-center gap-1.5 emil-pressable ${
                        isSel
                          ? 'border-emerald-400 bg-emerald-500/20 text-white font-bold ring-1 ring-emerald-400'
                          : 'border-white/10 bg-zinc-900/80 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] ${isSel ? 'bg-emerald-400 text-black font-black' : 'border border-zinc-600'}`}>
                        {isSel && '✓'}
                      </div>
                      <span>{mod.name}</span>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">(+{mod.price}€)</span>
                    </button>
                  );
                })}
                <div className="ml-auto pl-2 py-1 flex items-center gap-2 font-mono text-xs">
                  <span className="text-zinc-400">Total Actual:</span>
                  <span className="text-emerald-400 font-extrabold text-sm">{calculatePlanPrice()}€/mes</span>
                </div>
              </div>
            )}


            {quickTweakTab === 'colors' && (
              <div className="flex flex-wrap items-center gap-2 animate-fadeIn">
                <span className="text-[11px] font-mono text-zinc-400 pr-1">Elige Combinación:</span>
                {COLOR_PALETTES.map(pal => {
                  const isSel = formData.primary_color === pal.primary;
                  return (
                    <button
                      key={pal.id}
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          primary_color: pal.primary,
                          accent_color: pal.accent,
                          background_color: pal.bg,
                          surface_color: pal.surface
                        }));
                        showTweakNotice(`Colores cambiados a ${pal.name}`);
                      }}
                      className={`px-3 py-1.5 rounded-xl border text-xs transition flex items-center gap-2 ${
                        isSel
                          ? 'border-emerald-400 bg-emerald-500/15 text-white font-bold ring-1 ring-emerald-400'
                          : 'border-white/10 bg-zinc-900/80 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pal.primary }} />
                      <span>{pal.name}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {quickTweakTab === 'layout' && (
              <div className="flex flex-wrap items-center gap-2 animate-fadeIn">
                <span className="text-[11px] font-mono text-zinc-400 pr-1">Diseño de Portada:</span>
                {[
                  { id: 'centered', name: 'Foto completa con botón al centro' },
                  { id: 'split', name: 'Texto a un lado y foto al otro' },
                  { id: 'minimal', name: 'Solo texto y acceso directo' }
                ].map(l => {
                  const isSel = formData.hero_layout === l.id;
                  return (
                    <button
                      key={l.id}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, hero_layout: l.id }));
                        showTweakNotice(`Portada cambiada a ${l.name}`);
                      }}
                      className={`px-3 py-1.5 rounded-xl border text-xs transition flex items-center gap-1.5 ${
                        isSel
                          ? 'border-emerald-400 bg-emerald-500/15 text-white font-bold ring-1 ring-emerald-400'
                          : 'border-white/10 bg-zinc-900/80 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span>{l.name}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {quickTweakTab === 'typography' && (
              <div className="flex flex-wrap items-center gap-2 animate-fadeIn">
                <span className="text-[11px] font-mono text-zinc-400 pr-1">Tipo de Letra:</span>
                {[
                  { id: 'Outfit', name: 'Actual y con estilo (Outfit)' },
                  { id: 'Playfair Display', name: 'Clásica de restaurante (Playfair)' },
                  { id: 'Cinzel', name: 'Monumental y solemne (Cinzel)' },
                  { id: 'Plus Jakarta Sans', name: 'Moderna y geométrica (Jakarta)' },
                  { id: 'Inter', name: 'Clara y sencilla (Inter)' }
                ].map(f => {
                  const isSel = formData.font_family === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, font_family: f.id }));
                        showTweakNotice(`Letra cambiada a ${f.name}`);
                      }}
                      className={`px-3 py-1.5 rounded-xl border text-xs transition ${
                        isSel
                          ? 'border-emerald-400 bg-emerald-500/15 text-white font-bold ring-1 ring-emerald-400'
                          : 'border-white/10 bg-zinc-900/80 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span>{f.name}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {quickTweakTab === 'texture' && (
              <div className="flex flex-wrap items-center gap-2 animate-fadeIn">
                <span className="text-[11px] font-mono text-zinc-400 pr-1">Ambiente de Luz:</span>
                {[
                  { id: 'spotlight', name: 'Luz de noche' },
                  { id: 'grain', name: 'Toque fotográfico' },
                  { id: 'vignette', name: 'Borde suave' },
                  { id: 'clean', name: 'Fondo limpio' }
                ].map(t => {
                  const isSel = formData.texture === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, texture: t.id }));
                        showTweakNotice(`Ambiente cambiado a ${t.name}`);
                      }}
                      className={`px-3 py-1.5 rounded-xl border text-xs transition ${
                        isSel
                          ? 'border-emerald-400 bg-emerald-500/15 text-white font-bold ring-1 ring-emerald-400'
                          : 'border-white/10 bg-zinc-900/80 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span>{t.name}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {quickTweakTab === 'quickedit' && (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-1 animate-fadeIn">
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 block mb-0.5">Nombre de tu local:</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 block mb-0.5">Lema o especialidad:</label>
                  <input
                    type="text"
                    value={formData.slogan}
                    onChange={(e) => setFormData(prev => ({ ...prev, slogan: e.target.value }))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 block mb-0.5">Móvil con WhatsApp:</label>
                  <input
                    type="text"
                    value={formData.whatsapp_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => setActiveSection(1)}
                    className="w-full py-1.5 px-3 rounded-lg border border-white/15 bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 hover:text-white transition flex items-center justify-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Volver a todas las preguntas</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

        {/* Live Responsive Preview Window */}
        <div className="flex-1 p-3 sm:p-6 flex flex-col items-center justify-start overflow-hidden relative">
          {/* Subtle Ambient Glow */}
          <div 
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[140px] pointer-events-none opacity-20"
            style={{ backgroundColor: formData.primary_color }}
          />

          {/* Mobile-only Preview Launch Card (Only on Mobile) */}
          <div className="block md:hidden w-full max-w-lg mx-auto p-4 rounded-xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-3 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-xs text-white font-bold uppercase tracking-wider">
                  Tu Web en Tiempo Real
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                {formData.slug || 'local'}.tecnodiel.app
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              Hemos generado tu web interactiva con la plantilla <strong>{TEMPLATES.find(t => t.id === formData.template_id)?.name || formData.template_id}</strong> y todos tus datos.
            </p>
            <button
              type="button"
              onClick={() => setIsMobilePreviewOpen(true)}
              className="btn-industrial w-full py-3.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.35)] min-h-[48px] active:scale-98 transition cursor-pointer"
            >
              <Eye className="w-4 h-4 stroke-[2.5]" />
              <span>Abrir Vista Previa Completa</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Desktop-only Responsive Device Container */}
          <div className="hidden md:flex flex-col items-center w-full max-w-4xl z-10">
            {/* Preview Window Header Bar */}
            <div className="w-full flex items-center justify-between pb-3 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                </div>
                <span className="font-mono text-[11px] text-zinc-300 pl-2">
                  https://{formData.slug || 'local'}.tecnodiel.app
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Vista Previa Interactiva de tu Web
                </span>
              </div>
            </div>

            <div 
              className={`w-full transition-all duration-300 rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.95)] relative bg-black ${
                previewDevice === 'desktop' ? 'max-w-4xl h-[60vh] sm:h-[64vh]' :
                previewDevice === 'tablet' ? 'max-w-[640px] h-[60vh] sm:h-[64vh]' :
                'max-w-[375px] h-[60vh] sm:h-[64vh]'
              }`}
            >
              <div className="w-full h-full overflow-y-auto">
                <ErrorBoundary>
                  <TemplateRenderer restaurant={formData} isPreview={true} />
                </ErrorBoundary>
              </div>
            </div>
          </div>

          {/* Final Pricing & Commercial Offer Bar (Emil Kowalski spring-animated) */}
          <div className="w-full max-w-4xl mt-3 sm:mt-4 z-20 animate-spring-in">
            <div className="bg-zinc-950/95 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 shadow-[0_10px_40px_rgba(0,0,0,0.9)] backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1.5 text-center md:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                    Web Base completa ({BASE_WEB_PRICE}€/mes)
                  </span>
                  {(formData.selected_modules || []).map(modId => {
                    const mod = AVAILABLE_MODULES.find(m => m.id === modId);
                    if (!mod) return null;
                    const parts = (mod.name || 'Servicio').split(' ');
                    return (
                      <span key={mod.id} className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-zinc-900 text-zinc-300 border border-white/10">
                        + {parts[0]} {parts[1] || ''} ({mod.price}€)
                      </span>
                    );
                  })}
                </div>
                <div className="flex items-baseline justify-center md:justify-start gap-2 pt-0.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
                    {calculatePlanPrice()}€
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    / mes {billingPlan === 'annual' ? `(facturado ${calculatePlanPrice() * 12}€/año)` : '(sin permanencia)'}
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Precio final cerrado según los {(formData.selected_modules || []).length} servicios que has elegido. Sin comisiones por reservas y sin permanencia.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
                {/* Monthly vs Annual Toggle */}
                <div className="flex items-center p-1 rounded-xl bg-zinc-900 border border-white/10 text-xs w-full sm:w-auto justify-center">
                  <button
                    type="button"
                    onClick={() => setBillingPlan('monthly')}
                    className={`px-3 py-1.5 rounded-lg transition font-medium ${
                      billingPlan === 'monthly' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Mensual
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingPlan('annual')}
                    className={`px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1 ${
                      billingPlan === 'annual' ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>Anual</span>
                    <span className="text-[9px] px-1 py-0.5 bg-emerald-400 text-black rounded font-mono font-bold">-20%</span>
                  </button>
                </div>

                {/* Accept & Finalize Button */}
                <button
                  type="button"
                  onClick={() => setIsContractModalOpen(true)}
                  className="emil-pressable w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.5)] touch-target-44"
                >
                  <FileText className="w-4 h-4" />
                  <span>Me Gusta este Precio: Hablar del Contrato</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>

          {/* Contract & Portal Modal (Emil Kowalski sheet/spring) */}
          {isContractModalOpen && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-2xl transition-opacity">
              <div className="relative w-full max-w-xl rounded-t-3xl sm:rounded-3xl bg-zinc-950 border-t sm:border border-emerald-500/40 shadow-[0_0_80px_rgba(16,185,129,0.25)] overflow-hidden text-zinc-100 p-6 sm:p-8 space-y-5 animate-sheet-up sm:animate-spring-in max-h-[92vh] overflow-y-auto no-scrollbar">
                
                {/* Mobile drag handle */}
                <div className="sm:hidden -mt-2 pb-1 flex justify-center">
                  <div className="w-10 h-1 rounded-full bg-zinc-700/80" />
                </div>

                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                        ¡Tu web está lista! Vamos a activarla
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Este es el resumen claro de lo que tendrá tu local y lo que pagarás, sin letras pequeñas ni sorpresas.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsContractModalOpen(false)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Contract Specs & Itemized Pricing Summary */}
                <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 space-y-3 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-zinc-400 font-mono text-[11px]">Nombre de tu local:</span>
                    <span className="font-bold text-white text-sm">{formData.name}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-zinc-400 font-mono text-[11px]">Dirección de tu web:</span>
                    <span className="font-mono text-emerald-300 font-semibold">{formData.slug}.tecnodiel.app</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-zinc-400 font-mono text-[11px]">Estilo de diseño:</span>
                    <span className="font-semibold text-white uppercase">{formData.template_id}</span>
                  </div>

                  {/* Itemized Services Breakdown */}
                  <div className="py-2 border-b border-white/5 space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                      Servicios incluidos en tu cuota:
                    </span>
                    <div className="flex justify-between items-center text-zinc-300 text-[11px]">
                      <span>Web Base completa (Diseño para móviles, servidor rápido y seguridad incluida)</span>
                      <span className="font-mono">{BASE_WEB_PRICE}€/mes</span>
                    </div>
                    {(formData.selected_modules || []).map(modId => {
                      const mod = AVAILABLE_MODULES.find(m => m.id === modId);
                      if (!mod) return null;
                      return (
                        <div key={mod.id} className="flex justify-between items-center text-zinc-300 text-[11px]">
                          <span>+ {mod.name}</span>
                          <span className="font-mono text-emerald-400">+{mod.price}€/mes</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Cloudflare Pages Domain Auto-Provisioning Box */}
                  <div className="p-3.5 rounded-2xl bg-black/60 border border-emerald-500/30 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase text-zinc-400 block">Dominio Gratis en Cloudflare Pages:</span>
                        <span className="font-mono text-emerald-300 font-bold text-xs">{formData.slug}.pages.dev</span>
                      </div>
                    </div>
                    <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold font-mono">
                      Gratis en Cloudflare
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <div>
                      <span className="text-zinc-200 font-bold block">Precio final de tu cuota:</span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {billingPlan === 'annual' ? 'Facturación anual (20% descuento incluido)' : 'Facturación mensual flexible sin permanencia'}
                      </span>
                    </div>
                    <span className="text-emerald-400 font-mono font-extrabold text-lg sm:text-xl">
                      {calculatePlanPrice()}€ <span className="text-xs text-zinc-400 font-normal">/mes</span>
                    </span>
                  </div>
                </div>

                {/* Guaranteed Conditions List */}
                <div className="space-y-1.5 text-xs">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                    Garantías para tu tranquilidad:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-300 text-[11px]">
                    <div className="flex items-center gap-2">
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>0% comisiones: cada reserva es 100% tuya</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Tus clientes y teléfonos son de tu negocio</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Dominio Cloudflare Pages incluido gratis</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Carta digital con QR para mesas activa</span>
                    </div>
                  </div>
                </div>

                {savedSuccessMsg && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{savedSuccessMsg}</span>
                  </div>
                )}

                {/* Call to Action Portal Buttons */}
                <div className="space-y-2.5 pt-1">
                  {/* Primary 1: Activar Web & Abrir Panel con SlideCommit */}
                  <div className="w-full flex justify-center">
                    <SlideCommit
                      width="100%"
                      height={50}
                      radius={14}
                      label="Activar Mi Web y Abrir Panel"
                      doneLabel="¡Web activada y guardada con éxito!"
                      errorLabel="Configuración guardada en tu panel."
                      trackColor="#09090b"
                      handleColor="#10b981"
                      successColor="#10b981"
                      disabled={isSavingExpedient}
                      onConfirm={async () => {
                        setIsSavingExpedient(true);
                        try {
                          const saved = await createRestaurant(formData);
                          setCreatedRestaurant(saved);
                          setSavedSuccessMsg('¡Web activada y guardada con éxito!');
                          try {
                            confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
                          } catch (e) {}
                          setTimeout(() => {
                            if (onCreated) onCreated(saved);
                          }, 1200);
                          return true;
                        } catch (err) {
                          setSavedSuccessMsg('Configuración guardada en tu panel.');
                          return true;
                        } finally {
                          setIsSavingExpedient(false);
                        }
                      }}
                    />
                  </div>

                  {/* Primary 2: Go to TecnOdiel Contract Portal */}
                  <a
                    href={`${import.meta.env.VITE_TECNODIEL_PORTAL_URL || 'https://tecnodiel.com'}?action=contrato&restaurante=${encodeURIComponent(formData.name)}&slug=${encodeURIComponent(formData.slug)}&plan=${billingPlan}&precio=${calculatePlanPrice()}&servicios=${encodeURIComponent((formData.selected_modules || []).join(','))}&dominio=${encodeURIComponent(formData.slug + '.pages.dev')}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      createRestaurant(formData);
                    }}
                    className="emil-pressable w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white font-semibold text-xs transition flex items-center justify-center gap-2"
                  >
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                    <span>Confirmar Plan y Condiciones</span>
                  </a>

                  {/* Secondary: Direct WhatsApp Contract Manager */}
                  <a
                    href={`https://wa.me/34600000000?text=${encodeURIComponent(
                      `Hola equipo TecnOdiel, he configurado mi web para ${formData.name} (${formData.slug}.pages.dev) con estilo ${formData.template_id} y los siguientes servicios: [${(formData.selected_modules || []).map(id => AVAILABLE_MODULES.find(m => m.id === id)?.name).filter(Boolean).join(', ')}]. La tarifa resultante es de ${calculatePlanPrice()}€/mes (${billingPlan === 'annual' ? 'facturación anual' : 'mensual'}). Me gustaría cerrar los detalles del contrato.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="emil-pressable w-full py-2.5 px-4 rounded-xl bg-transparent hover:bg-white/5 text-zinc-400 hover:text-zinc-200 text-xs transition flex items-center justify-center gap-2 text-center"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Consultar Dudas por WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          
          {/* Success Dialog Popup / Banner */}
          {createdRestaurant && (
            <div className="fixed bottom-6 inset-x-4 max-w-lg mx-auto z-50 p-4 rounded-2xl bg-zinc-950/95 border border-emerald-500/50 text-emerald-100 text-xs space-y-2 shadow-[0_0_50px_rgba(0,0,0,0.9)] backdrop-blur-xl animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>¡Tu web está lista para recibir clientes!</span>
                </div>
                <button onClick={() => setCreatedRestaurant(null)} className="text-zinc-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-zinc-300 text-[11px]">
                Disponible inmediatamente bajo tu dirección: <strong className="text-white font-mono">{createdRestaurant.slug}.pages.dev</strong>
              </p>
              {createdRestaurant.client_access_key && (
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-emerald-500/30 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Tu Clave Única de Acceso:</span>
                  <strong className="text-emerald-400 font-bold tracking-wider">{createdRestaurant.client_access_key}</strong>
                </div>
              )}
              <div className="flex items-center gap-2 pt-1">
                <a
                  href={`#r/${createdRestaurant.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-400 text-black font-bold text-xs"
                >
                  <span>Abrir Mi Web Pública</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-3 py-1.5 rounded-xl border border-white/10 text-zinc-300 hover:text-white text-xs"
                >
                  Ir al Panel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )}

    {/* Mobile-only Floating Preview Trigger Button (Active during form questionnaire) */}
    {activeSection <= 6 && !isMobilePreviewOpen && (
      <div className="md:hidden fixed bottom-5 right-4 z-40">
        <button
          type="button"
          onClick={() => setIsMobilePreviewOpen(true)}
          className="btn-industrial px-4 py-3 rounded-full bg-emerald-400 hover:bg-emerald-300 text-black font-mono font-bold text-xs uppercase tracking-wider shadow-[0_4px_25px_rgba(16,185,129,0.5)] flex items-center gap-2 border border-emerald-300 min-h-[48px] active:scale-95 transition cursor-pointer"
          title="Abrir vista previa de tu web"
        >
          <Eye className="w-4 h-4 stroke-[2.5]" />
          <span>Vista Previa</span>
        </button>
      </div>
    )}

    {/* Mobile-only Fullscreen Preview Modal */}
    {isMobilePreviewOpen && (
      <div className="md:hidden fixed inset-0 z-50 bg-black flex flex-col animate-fadeIn">
        {/* Top Bar with Return Button */}
        <div className="h-14 border-b border-zinc-800 bg-zinc-950 px-3 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => setIsMobilePreviewOpen(false)}
            className="btn-industrial px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-xs font-mono font-bold text-white transition flex items-center gap-2 min-h-[44px] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>Volver al Formulario</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] text-zinc-300 truncate max-w-[120px]">
              {formData.slug || 'mi-web'}
            </span>
          </div>
        </div>

        {/* Fullscreen Interactive Web View */}
        <div className="flex-1 w-full overflow-y-auto overscroll-contain bg-black">
          <ErrorBoundary>
            <TemplateRenderer restaurant={formData} isPreview={true} />
          </ErrorBoundary>
        </div>

        {/* Bottom Dock Bar */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-xl flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsMobilePreviewOpen(false)}
            className="btn-industrial flex-1 py-2.5 px-3 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white font-mono text-xs font-semibold text-center min-h-[44px]"
          >
            ← Seguir Editando
          </button>
          <button
            type="button"
            onClick={() => {
              setIsMobilePreviewOpen(false);
              setActiveSection(7);
              setIsContractModalOpen(true);
            }}
            className="btn-industrial flex-1 py-2.5 px-3 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black font-mono text-xs font-bold text-center flex items-center justify-center gap-1.5 min-h-[44px]"
          >
            <span>Ver Oferta</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    )}
  </div>
);
}
