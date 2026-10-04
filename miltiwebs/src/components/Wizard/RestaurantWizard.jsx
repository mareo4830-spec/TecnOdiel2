import React, { useState, useRef } from 'react';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  CheckCircle2, 
  Globe, 
  Utensils, 
  Flame, 
  Wine, 
  Coffee, 
  Compass, 
  ChefHat, 
  Zap, 
  Sparkles, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Eye, 
  Sliders, 
  Edit3, 
  Type, 
  Layout, 
  Palette, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  X, 
  FileText, 
  Camera, 
  Image as ImageIcon, 
  Upload, 
  ArrowLeftRight, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpRight,
  QrCode
} from 'lucide-react';
import { 
  TEMPLATES, 
  COLOR_PALETTES, 
  BASE_WEB_PRICE, 
  AVAILABLE_MODULES, 
  RESTAURANT_CATEGORIES, 
  getPresetMenuForStyle, 
  DEFAULT_MENUS_BY_STYLE 
} from '../../lib/mockData';
import { createRestaurant, sanitizeSlug } from '../../lib/supabase';
import TemplateRenderer from '../Templates/TemplateRenderer';
import ErrorBoundary from '../ErrorBoundary';
import confetti from 'canvas-confetti';

export const HERO_PHOTO_PRESETS = [
  { label: 'Taberna / Jamón', url: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?auto=format&fit=crop&w=1920&q=80' },
  { label: 'Burger Smash', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1920&q=80' },
  { label: 'Cóctel & Noche', url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1920&q=80' },
  { label: 'Asador & Brasa', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1920&q=80' },
  { label: 'Marisco & Lonja', url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1920&q=80' },
  { label: 'Sushi & Omakase', url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1920&q=80' },
  { label: 'Bistró & Elegante', url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1920&q=80' },
  { label: 'Brunch & Café', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1920&q=80' },
  { label: 'Cerveza Taproom', url: 'https://images.unsplash.com/photo-1538488881522-4321453c6d4f?auto=format&fit=crop&w=1920&q=80' }
];

export default function RestaurantWizard({ onCreated, onCancel }) {
  const [activeSection, setActiveSection] = useState(1);
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [saving, setSaving] = useState(false);
  const [tweakNotice, setTweakNotice] = useState('');
  const [billingPlan, setBillingPlan] = useState('monthly');
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);

  // Click-to-Edit Inspector State
  const [selectedElement, setSelectedElement] = useState({
    type: 'hero_image',
    label: 'Foto de Portada'
  });
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);

  // File & Camera input refs
  const heroGalleryInputRef = useRef(null);
  const heroCameraInputRef = useRef(null);
  const dishGalleryInputRef = useRef(null);
  const dishCameraInputRef = useRef(null);

  const compressAndLoadImage = (file, onSuccess) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1600;
        let width = img.width;
        let height = img.height;
        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
        onSuccess(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleHeroImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    compressAndLoadImage(file, (dataUrl) => {
      setFormData(prev => ({ ...prev, hero_image: dataUrl }));
      showTweakNotice('Foto de portada actualizada con éxito');
    });
    e.target.value = '';
  };

  const handleDishImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    compressAndLoadImage(file, (dataUrl) => {
      if (selectedElement?.data) {
        const { categoryIndex, itemIndex } = selectedElement.data;
        setFormData(prev => {
          const updatedCategories = [...prev.menu_categories];
          if (updatedCategories[categoryIndex]?.items[itemIndex]) {
            updatedCategories[categoryIndex].items[itemIndex] = {
              ...updatedCategories[categoryIndex].items[itemIndex],
              image: dataUrl
            };
          }
          return { ...prev, menu_categories: updatedCategories };
        });
        setSelectedElement(prev => ({
          ...prev,
          data: {
            ...prev.data,
            item: { ...prev.data.item, image: dataUrl }
          }
        }));
        showTweakNotice('Foto del plato guardada con éxito');
      }
    });
    e.target.value = '';
  };

  const handleSelectElement = (element) => {
    setSelectedElement(element);
    setIsInspectorOpen(true);
    showTweakNotice(`Editando: ${element.label}`);
  };

  const showTweakNotice = (msg) => {
    setTweakNotice(msg);
    setTimeout(() => setTweakNotice(''), 2500);
  };

  // State
  const [formData, setFormData] = useState({
    name: 'Taberna El Albero',
    slug: 'taberna-el-albero',
    subdomain: 'taberna-el-albero',
    slogan: 'Tapas de solera, jamón ibérico y vinos del sur',
    description: 'Taberna tradicional con esencia andaluza, jamón de bellota 100% ibérico cortado a cuchillo al momento, gambas de Huelva y solera en bota.',
    category: 'tapas',
    dress_code: 'Informal / Agradable',
    cta_text: 'Reservar Mesa Online',

    template_id: 'tapas_andaluzas',
    hero_layout: 'split',
    hero_image_side: 'right',
    hero_image_size: 'md',
    hero_image: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?auto=format&fit=crop&w=1920&q=80',

    primary_color: '#eab308',
    accent_color: '#ca8a04',
    background_color: '#1c1006',
    surface_color: '#2a180b',
    font_family: 'Playfair Display',

    phone: '+34 959 28 30 40',
    whatsapp_number: '+34611223344',
    email: 'contacto@tabernaelalbero.es',
    address: 'Calle Concepción, 8',
    city: 'Huelva',
    postal_code: '21001',
    google_maps_url: 'https://maps.google.com',

    lunch_shift: { enabled: true, open: '13:00', close: '16:30' },
    dinner_shift: { enabled: true, open: '20:30', close: '00:00' },
    closed_days: ['Lunes'],

    selected_modules: ['booking_engine', 'nfc_menu', 'seo_ranking'],
    menu_categories: DEFAULT_MENUS_BY_STYLE.tapas_andaluzas || []
  });

  const handleNameChange = (val) => {
    const s = sanitizeSlug(val);
    setFormData(prev => ({
      ...prev,
      name: val,
      slug: s,
      subdomain: s
    }));
  };

  const handleCategorySelect = (catId) => {
    let tpl = 'tapas_andaluzas';
    if (catId === 'gastronomic') tpl = 'tokyo_omakase';
    else if (catId === 'asador') tpl = 'steakhouse_asador';
    else if (catId === 'mediterranean') tpl = 'marisqueria_costera';
    else if (catId === 'pizzeria') tpl = 'pizzeria_napolitana';
    else if (catId === 'burger') tpl = 'urban_street_smash';
    else if (catId === 'night_bar') tpl = 'nocturne';
    else if (catId === 'cafe') tpl = 'coffee_specialty';

    const tplObj = TEMPLATES.find(t => t.id === tpl);
    const presets = DEFAULT_MENUS_BY_STYLE[tpl] || DEFAULT_MENUS_BY_STYLE.tapas_andaluzas;

    setFormData(prev => ({
      ...prev,
      category: catId,
      template_id: tpl,
      primary_color: tplObj?.previewColors?.primary || prev.primary_color,
      accent_color: tplObj?.previewColors?.accent || prev.accent_color,
      background_color: tplObj?.previewColors?.bg || prev.background_color,
      surface_color: tplObj?.previewColors?.card || prev.surface_color,
      font_family: tplObj?.defaultFont || prev.font_family,
      hero_image: tplObj?.heroBg || prev.hero_image,
      hero_layout: tplObj?.defaultLayout || 'split',
      menu_categories: presets
    }));
  };

  const handleTemplateSelect = (tpl) => {
    const presets = DEFAULT_MENUS_BY_STYLE[tpl.id] || formData.menu_categories;
    setFormData(prev => ({
      ...prev,
      template_id: tpl.id,
      category: tpl.category || prev.category,
      primary_color: tpl.previewColors.primary,
      accent_color: tpl.previewColors.accent,
      background_color: tpl.previewColors.bg,
      surface_color: tpl.previewColors.card,
      font_family: tpl.defaultFont || prev.font_family,
      hero_image: tpl.heroBg || prev.hero_image,
      hero_layout: tpl.defaultLayout || 'split',
      menu_categories: presets
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

  const toggleModule = (modId) => {
    setFormData(prev => {
      const current = prev.selected_modules || [];
      const exists = current.includes(modId);
      const updated = exists ? current.filter(m => m !== modId) : [...current, modId];
      return { ...prev, selected_modules: updated };
    });
  };

  const handleUpdateDish = (catIdx, itemIdx, field, value) => {
    setFormData(prev => {
      const updated = [...(prev.menu_categories || [])];
      if (updated[catIdx]?.items?.[itemIdx]) {
        const items = [...updated[catIdx].items];
        items[itemIdx] = { ...items[itemIdx], [field]: value };
        updated[catIdx] = { ...updated[catIdx], items };
      }
      return { ...prev, menu_categories: updated };
    });
  };

  const handleAddDish = (catIdx) => {
    setFormData(prev => {
      const updated = [...(prev.menu_categories || [])];
      if (updated[catIdx]) {
        const newItem = {
          id: `item-${Date.now()}`,
          name: 'Nuevo Plato de la Casa',
          description: 'Ingredientes de temporada seleccionados por nuestro chef.',
          price: 12.00,
          badge: 'Novedad',
          allergens: []
        };
        updated[catIdx] = {
          ...updated[catIdx],
          items: [...(updated[catIdx].items || []), newItem]
        };
      }
      return { ...prev, menu_categories: updated };
    });
    showTweakNotice('Plato añadido a la carta');
  };

  const handleDeleteDish = (catIdx, itemIdx) => {
    setFormData(prev => {
      const updated = [...(prev.menu_categories || [])];
      if (updated[catIdx]?.items) {
        const items = updated[catIdx].items.filter((_, idx) => idx !== itemIdx);
        updated[catIdx] = { ...updated[catIdx], items };
      }
      return { ...prev, menu_categories: updated };
    });
    showTweakNotice('Plato eliminado');
  };

  const calculatePlanPrice = () => {
    const modulesCost = (formData.selected_modules || []).reduce((sum, modId) => {
      const found = AVAILABLE_MODULES.find(m => m.id === modId);
      return sum + (found ? found.price : 0);
    }, 0);
    const subtotal = BASE_WEB_PRICE + modulesCost;
    if (billingPlan === 'annual') return Math.round(subtotal * 0.8);
    return subtotal;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const saved = await createRestaurant(formData);
      try {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.5 } });
      } catch (e) {}
      if (onCreated) onCreated(saved);
    } catch (err) {
      console.warn('Fallback saving restaurant locally:', err);
      const fallbackRest = {
        ...formData,
        id: `rest-${Date.now()}`
      };
      try {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.5 } });
      } catch (e) {}
      if (onCreated) onCreated(fallbackRest);
    } finally {
      setSaving(false);
    }
  };

  const SECTIONS = [
    { id: 1, label: 'Tu Restaurante', sub: 'Nombre, estilo y dirección web automática' },
    { id: 2, label: 'Diseño & Portada', sub: 'Plantilla visual y foto del local' },
    { id: 3, label: 'Colores & Letra', sub: 'Cromática gastronómica y tipografía' },
    { id: 4, label: 'Reservas & Contacto', sub: 'WhatsApp directo, teléfono y turnos' },
    { id: 5, label: 'Carta Digital QR', sub: 'Platos, raciones, fotos y precios' },
    { id: 6, label: 'Módulos & Extras', sub: 'Motor WhatsApp, Google Maps y dominio' },
    { id: 7, label: 'Tu Web Lista', sub: 'Revisa y edita tu web en vivo al pulsar' }
  ];

  const getCategoryIconComponent = (catId) => {
    switch (catId) {
      case 'asador':
        return Flame;
      case 'night_bar':
        return Wine;
      case 'cafe':
        return Coffee;
      case 'mediterranean':
        return Compass;
      case 'pizzeria':
        return ChefHat;
      case 'burger':
        return Zap;
      case 'gastronomic':
        return Sparkles;
      default:
        return Utensils;
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Global Hidden File Inputs for Hero & Dishes (Available in all wizard steps including Step 7) */}
      <input
        type="file"
        ref={heroGalleryInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleHeroImageUpload}
      />
      <input
        type="file"
        ref={heroCameraInputRef}
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleHeroImageUpload}
      />
      <input
        type="file"
        ref={dishGalleryInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleDishImageUpload}
      />
      <input
        type="file"
        ref={dishCameraInputRef}
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleDishImageUpload}
      />

      {/* Top Header */}
      {activeSection <= 6 ? (
        <header className="h-16 border-b border-white/10 bg-zinc-950/90 backdrop-blur-2xl px-4 sm:px-6 flex items-center justify-between z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="p-2 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition"
              title="Volver"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-white">Configurador de Web para Restaurantes & Bares</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  Paso 0{activeSection} de 06
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">
                {SECTIONS.find(s => s.id === activeSection)?.sub}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSection(7)}
              className="px-3.5 py-1.5 rounded-xl border border-white/15 bg-zinc-900 hover:bg-zinc-800 text-xs text-white font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ver Web Directa</span>
            </button>
          </div>
        </header>
      ) : (
        /* Top Bar for Step 7 (Live Preview) */
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
                Toca cualquier texto, foto o botón en pantalla para retocarlo al instante
              </span>
            </div>
          </div>

          {/* Device Toggles & Launch Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-white/10 rounded-xl">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg transition text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                  previewDevice === 'desktop' ? 'bg-white text-black font-bold shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Escritorio</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('tablet')}
                className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg transition text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                  previewDevice === 'tablet' ? 'bg-white text-black font-bold shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Tablet</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg transition text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                  previewDevice === 'mobile' ? 'bg-white text-black font-bold shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Móvil</span>
              </button>
            </div>

            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="px-4 sm:px-5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-extrabold transition flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] disabled:opacity-50 min-h-[40px] cursor-pointer shrink-0"
            >
              <span>{saving ? 'Guardando...' : 'Lanzar Web Restaurante'}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </header>
      )}

      {/* Main Content */}
      {activeSection <= 6 ? (
        /* Steps 1-6 Questionnaire */
        <div className="flex-1 overflow-y-auto bg-zinc-950/40 px-3 sm:px-6 py-4 sm:py-8">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Progress Bar */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2.5 shadow-lg">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-zinc-400 uppercase text-[11px] font-semibold">// PROGRESO DEL FORMULARIO</span>
                <span className="font-mono text-emerald-400 font-bold">Paso {activeSection} de 6</span>
              </div>
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                <div 
                  className="bg-emerald-400 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${(activeSection / 6) * 100}%` }}
                />
              </div>
            </div>

            {/* Step 1: Tu Restaurante & Estilo */}
            {activeSection === 1 && (
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-5 shadow-xl animate-fadeIn">
                <div className="border-b border-white/10 pb-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-emerald-400" />
                    <span>Paso 1: Tu Restaurante & Estilo Gastronómico</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Indica el nombre de tu negocio y su especialidad culinaria para configurar la carta y la dirección web automáticamente.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold text-zinc-300 uppercase">
                      Nombre del Restaurante o Bar *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => handleNameChange(e.target.value)}
                      placeholder="Ej. Taberna El Albero"
                      className="w-full bg-zinc-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs font-mono flex items-center justify-between">
                    <span className="text-zinc-400">Dirección Web Automática:</span>
                    <span className="text-emerald-400 font-bold">https://{formData.slug || 'restaurante'}.tecnodiel.app</span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono font-semibold text-zinc-300 uppercase">
                      Estilo Gastronómico Principal
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {RESTAURANT_CATEGORIES.map(cat => {
                        const CategoryIcon = getCategoryIconComponent(cat.id);
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleCategorySelect(cat.id)}
                            className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 cursor-pointer interactive-selectable ${
                              formData.category === cat.id
                                ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold shadow-sm'
                                : 'bg-zinc-900 border-white/10 text-zinc-300 hover:bg-zinc-800'
                            }`}
                          >
                            <CategoryIcon className="w-5 h-5 text-emerald-400 shrink-0" />
                            <span className="text-xs">{cat.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold text-zinc-300 uppercase">
                      Eslogan o Lema Característico
                    </label>
                    <input
                      type="text"
                      value={formData.slogan}
                      onChange={e => setFormData({ ...formData, slogan: e.target.value })}
                      placeholder="Ej. Tapas de solera, jamón ibérico y vinos del sur"
                      className="w-full bg-zinc-900 border border-white/15 rounded-xl px-4 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold text-zinc-300 uppercase">
                      Ambiente / Código de Vestimenta (Opcional)
                    </label>
                    <input
                      type="text"
                      value={formData.dress_code}
                      onChange={e => setFormData({ ...formData, dress_code: e.target.value })}
                      placeholder="Ej. Informal / Agradable o Smart Casual"
                      className="w-full bg-zinc-900 border border-white/15 rounded-xl px-4 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Diseño & Portada */}
            {activeSection === 2 && (
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-5 shadow-xl animate-fadeIn">
                <div className="border-b border-white/10 pb-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Layout className="w-5 h-5 text-emerald-400" />
                    <span>Paso 2: Diseño Visual & Foto de Portada</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Elige la plantilla que mejor exprese la personalidad de tu local y selecciona la foto principal.
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-semibold text-zinc-300 uppercase">
                      Elige tu Plantilla ({TEMPLATES.length} Disponibles)
                    </label>

                    {/* ★ FEATURED: Cinemático — Full-Width Hero Card */}
                    {(() => {
                      const cinematicTpl = TEMPLATES.find(t => t.id === 'cinematic_experience');
                      if (!cinematicTpl) return null;
                      const isSel = formData.template_id === cinematicTpl.id;
                      return (
                        <button
                          key={cinematicTpl.id}
                          type="button"
                          onClick={() => handleTemplateSelect(cinematicTpl)}
                          className={`w-full p-4 rounded-2xl border-2 text-left transition flex items-start gap-4 cursor-pointer interactive-selectable relative overflow-hidden ${
                            isSel
                              ? 'bg-orange-500/15 border-orange-500 text-white shadow-[0_0_25px_rgba(249,115,22,0.3)]'
                              : 'bg-gradient-to-r from-zinc-900 via-[#160a03] to-zinc-900 border-orange-500/40 hover:border-orange-400 hover:bg-orange-500/10'
                          }`}
                        >
                          <div className="absolute top-2 right-3 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/50 text-orange-300 uppercase tracking-widest">
                            ★ NUEVO — EXCLUSIVO
                          </div>
                          <div className="w-12 h-12 rounded-xl shrink-0 mt-0.5 border-2 border-orange-500/60 shadow-[0_0_20px_rgba(249,115,22,0.4)] flex items-center justify-center text-2xl" style={{ backgroundColor: '#160a03' }}>
                            🔥
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="font-extrabold text-sm text-orange-200 flex items-center gap-2">{cinematicTpl.name}</div>
                            <div className="text-[11px] text-orange-400/90 font-mono">{cinematicTpl.badge}</div>
                            <div className="text-[11px] text-zinc-400 leading-snug max-w-md">{cinematicTpl.description}</div>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {cinematicTpl.tags?.map(tag => (
                                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-orange-950/60 border border-orange-500/30 text-orange-300 font-mono">{tag}</span>
                              ))}
                            </div>
                          </div>
                        </button>
                      );
                    })()}

                    {/* Rest of templates in grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                      {TEMPLATES.filter(t => t.id !== 'cinematic_experience').map(tpl => (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => handleTemplateSelect(tpl)}
                          className={`p-3 rounded-xl border text-left transition flex items-start gap-3 cursor-pointer interactive-selectable ${
                            formData.template_id === tpl.id
                              ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-sm'
                              : 'bg-zinc-900 border-white/10 text-zinc-300 hover:bg-zinc-800'
                          }`}
                        >
                          <div 
                            className="w-8 h-8 rounded-lg shrink-0 mt-0.5 border border-white/20"
                            style={{ backgroundColor: tpl.previewColors.primary }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-xs truncate text-white">{tpl.name}</div>
                            <div className="text-[10px] text-zinc-400 font-mono mt-0.5">{tpl.badge}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Foto de Portada Presets */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-semibold text-zinc-300 uppercase">
                      Foto de Portada del Restaurante
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {HERO_PHOTO_PRESETS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormData({ ...formData, hero_image: p.url })}
                          className={`relative h-20 rounded-xl overflow-hidden border transition cursor-pointer group interactive-selectable ${
                            formData.hero_image === p.url ? 'border-emerald-400 ring-2 ring-emerald-400/30' : 'border-white/10'
                          }`}
                        >
                          <img src={p.url} alt={p.label} className="w-full h-full object-cover group-hover:scale-105 transition" />
                          <div className="absolute inset-0 bg-black/50 flex items-end p-1.5">
                            <span className="text-[10px] font-semibold text-white leading-tight">{p.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Subida o Cámara */}
                    <div className="pt-2 flex items-center gap-2">

                      <button
                        type="button"
                        onClick={() => heroGalleryInputRef.current?.click()}
                        className="px-3 py-2 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-200 transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Subir Foto Propia</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => heroCameraInputRef.current?.click()}
                        className="px-3 py-2 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-200 transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Hacer Foto con Cámara</span>
                      </button>
                    </div>
                  </div>

                  {/* Disposición de la foto */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-semibold text-zinc-400 uppercase">
                        Disposición de la Cabecera
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, hero_layout: 'split' })}
                          className={`p-2 rounded-xl text-xs font-semibold border transition text-center cursor-pointer ${
                            formData.hero_layout === 'split' ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold' : 'bg-zinc-900 border-white/10 text-zinc-300'
                          }`}
                        >
                          Dividida (Split)
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, hero_layout: 'centered' })}
                          className={`p-2 rounded-xl text-xs font-semibold border transition text-center cursor-pointer ${
                            formData.hero_layout === 'centered' ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold' : 'bg-zinc-900 border-white/10 text-zinc-300'
                          }`}
                        >
                          Centrada
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-semibold text-zinc-400 uppercase">
                        Lado de la Imagen (Split)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, hero_image_side: 'left' })}
                          className={`p-2 rounded-xl text-xs font-semibold border transition text-center cursor-pointer ${
                            formData.hero_image_side === 'left' ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold' : 'bg-zinc-900 border-white/10 text-zinc-300'
                          }`}
                        >
                          Izquierda
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, hero_image_side: 'right' })}
                          className={`p-2 rounded-xl text-xs font-semibold border transition text-center cursor-pointer ${
                            formData.hero_image_side === 'right' ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold' : 'bg-zinc-900 border-white/10 text-zinc-300'
                          }`}
                        >
                          Derecha
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Colores & Letra */}
            {activeSection === 3 && (
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-5 shadow-xl animate-fadeIn">
                <div className="border-b border-white/10 pb-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Palette className="w-5 h-5 text-emerald-400" />
                    <span>Paso 3: Colores & Tipografía</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Define la paleta cromática de tu negocio y la fuente tipográfica que mejor encaje.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-semibold text-zinc-300 uppercase">
                      Paletas Cromáticas Recomendadas
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {COLOR_PALETTES.map(pal => (
                        <button
                          key={pal.id}
                          type="button"
                          onClick={() => handlePaletteSelect(pal)}
                          className="p-3 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-left transition flex items-center justify-between cursor-pointer interactive-selectable"
                        >
                          <span className="text-xs font-semibold text-white truncate">{pal.name}</span>
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: pal.primary }} />
                            <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: pal.accent }} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-mono font-semibold text-zinc-300 uppercase">
                      Tipografía Principal
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {['Playfair Display', 'Outfit', 'Inter', 'JetBrains Mono', 'Cormorant Garamond', 'Syne'].map(f => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setFormData({ ...formData, font_family: f })}
                          className={`p-3 rounded-xl border text-center transition cursor-pointer text-xs interactive-selectable ${
                            formData.font_family === f
                              ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold'
                              : 'bg-zinc-900 border-white/10 text-zinc-300 hover:bg-zinc-800'
                          }`}
                          style={{ fontFamily: f }}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Reservas & Contacto */}
            {activeSection === 4 && (
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-5 shadow-xl animate-fadeIn">
                <div className="border-b border-white/10 pb-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-400" />
                    <span>Paso 4: Reservas Directas & Contacto</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Configura tu WhatsApp directo para recibir reservas en tiempo real sin pagar comisiones por comensal.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-semibold text-zinc-300 uppercase">
                        WhatsApp de Reservas *
                      </label>
                      <input
                        type="text"
                        value={formData.whatsapp_number}
                        onChange={e => setFormData({ ...formData, whatsapp_number: e.target.value })}
                        placeholder="+34 611 22 33 44"
                        className="w-full bg-zinc-900 border border-white/15 rounded-xl px-4 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-semibold text-zinc-300 uppercase">
                        Teléfono de Atención
                      </label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+34 959 28 30 40"
                        className="w-full bg-zinc-900 border border-white/15 rounded-xl px-4 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold text-zinc-300 uppercase">
                      Dirección del Restaurante
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Calle Concepción, 8"
                      className="w-full bg-zinc-900 border border-white/15 rounded-xl px-4 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-semibold text-zinc-300 uppercase">
                        Ciudad
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Huelva"
                        className="w-full bg-zinc-900 border border-white/15 rounded-xl px-4 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-semibold text-zinc-300 uppercase">
                        Código Postal
                      </label>
                      <input
                        type="text"
                        value={formData.postal_code}
                        onChange={e => setFormData({ ...formData, postal_code: e.target.value })}
                        placeholder="21001"
                        className="w-full bg-zinc-900 border border-white/15 rounded-xl px-4 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">Horario Mediodía</label>
                      <div className="flex items-center gap-2 text-xs">
                        <input
                          type="time"
                          value={formData.lunch_shift.open}
                          onChange={e => setFormData({ ...formData, lunch_shift: { ...formData.lunch_shift, open: e.target.value } })}
                          className="bg-zinc-900 border border-white/10 rounded-lg px-2 py-1 text-white"
                        />
                        <span>a</span>
                        <input
                          type="time"
                          value={formData.lunch_shift.close}
                          onChange={e => setFormData({ ...formData, lunch_shift: { ...formData.lunch_shift, close: e.target.value } })}
                          className="bg-zinc-900 border border-white/10 rounded-lg px-2 py-1 text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">Horario Noche</label>
                      <div className="flex items-center gap-2 text-xs">
                        <input
                          type="time"
                          value={formData.dinner_shift.open}
                          onChange={e => setFormData({ ...formData, dinner_shift: { ...formData.dinner_shift, open: e.target.value } })}
                          className="bg-zinc-900 border border-white/10 rounded-lg px-2 py-1 text-white"
                        />
                        <span>a</span>
                        <input
                          type="time"
                          value={formData.dinner_shift.close}
                          onChange={e => setFormData({ ...formData, dinner_shift: { ...formData.dinner_shift, close: e.target.value } })}
                          className="bg-zinc-900 border border-white/10 rounded-lg px-2 py-1 text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Carta Digital QR & Platos */}
            {activeSection === 5 && (
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-5 shadow-xl animate-fadeIn">
                <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-emerald-400" />
                      <span>Paso 5: Carta Digital QR & Platos</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Tus platos se cargan en 0.2 segundos cuando el cliente escanea el QR en la mesa.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {(formData.menu_categories || []).map((cat, catIdx) => (
                    <div key={cat.id || catIdx} className="p-4 rounded-xl bg-zinc-900/60 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-emerald-400 font-mono">{cat.name}</span>
                        <button
                          type="button"
                          onClick={() => handleAddDish(catIdx)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Añadir Plato</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {(cat.items || []).map((item, itemIdx) => (
                          <div key={item.id || itemIdx} className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={item.name}
                                onChange={e => handleUpdateDish(catIdx, itemIdx, 'name', e.target.value)}
                                className="flex-1 bg-zinc-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white font-semibold focus:outline-none focus:border-emerald-400"
                                placeholder="Nombre del plato"
                              />
                              <div className="flex items-center gap-1 w-24">
                                <input
                                  type="number"
                                  step="0.5"
                                  value={item.price}
                                  onChange={e => handleUpdateDish(catIdx, itemIdx, 'price', parseFloat(e.target.value) || 0)}
                                  className="w-full bg-zinc-900 border border-white/10 rounded-lg px-2 py-1 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-400"
                                />
                                <span className="text-xs text-zinc-400">€</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeleteDish(catIdx, itemIdx)}
                                className="p-1 rounded text-zinc-500 hover:text-red-400 transition"
                                title="Eliminar plato"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <input
                              type="text"
                              value={item.description}
                              onChange={e => handleUpdateDish(catIdx, itemIdx, 'description', e.target.value)}
                              className="w-full bg-zinc-900/60 border border-white/5 rounded-lg px-2.5 py-1 text-[11px] text-zinc-300 focus:outline-none"
                              placeholder="Descripción breve de los ingredientes"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Módulos & Extras */}
            {activeSection === 6 && (
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-5 shadow-xl animate-fadeIn">
                <div className="border-b border-white/10 pb-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>Paso 6: Servicios Pro & Resumen de Inversión</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Activa módulos opcionales para maximizar clientes sin pagar comisiones por cada mesa.
                  </p>
                </div>

                <div className="space-y-3">
                  {AVAILABLE_MODULES.map(mod => {
                    const isSelected = (formData.selected_modules || []).includes(mod.id);
                    return (
                      <div
                        key={mod.id}
                        onClick={() => toggleModule(mod.id)}
                        className={`p-4 rounded-xl border transition flex items-center justify-between gap-4 cursor-pointer ${
                          isSelected ? 'bg-emerald-950/20 border-emerald-500/50' : 'bg-zinc-900/50 border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white">{mod.name}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold">
                              {mod.badge || 'PRO'}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400">{mod.description}</p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-mono text-xs font-bold text-white">+{mod.price}€/mes</span>
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                            isSelected ? 'bg-emerald-400 border-emerald-400 text-black' : 'border-white/20'
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pricing Summary Box */}
                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-300">
                    <span>Plan TecnOdiel Restaurantes:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setBillingPlan('monthly')}
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                          billingPlan === 'monthly' ? 'bg-white text-black' : 'text-zinc-400'
                        }`}
                      >
                        Mensual
                      </button>
                      <button
                        type="button"
                        onClick={() => setBillingPlan('annual')}
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                          billingPlan === 'annual' ? 'bg-emerald-400 text-black font-bold' : 'text-zinc-400'
                        }`}
                      >
                        Anual (-20%)
                      </button>
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between border-t border-white/10 pt-2">
                    <span className="text-xs text-zinc-400">Total Inversión:</span>
                    <span className="text-2xl font-black text-emerald-400 font-mono">
                      {calculatePlanPrice()}€<span className="text-xs text-zinc-400 font-normal">/mes</span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Stepper Buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                disabled={activeSection === 1}
                onClick={() => setActiveSection(prev => Math.max(1, prev - 1))}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white disabled:opacity-30 transition cursor-pointer interactive-button"
              >
                Anterior
              </button>

              <button
                type="button"
                onClick={() => setActiveSection(prev => Math.min(7, prev + 1))}
                className="px-6 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer shadow-md interactive-button"
              >
                <span>{activeSection === 6 ? 'Ver Web Lista' : 'Siguiente'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Step 7: Live Interactive Preview & Inspector */
        <div className="flex-1 flex overflow-hidden relative">
          {/* Live Responsive Preview Window Container */}
          <div className="flex-1 p-2 sm:p-4 md:p-6 flex flex-col items-center justify-start overflow-y-auto relative">
            {/* Ambient Glow */}
            <div 
              className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[140px] pointer-events-none opacity-20"
              style={{ backgroundColor: formData.primary_color }}
            />

            {/* Device Mockup Wrapper */}
            <div className="w-full flex flex-col items-center z-10 space-y-3">
              {/* Contextual Device Toolbar */}
              <div className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                    <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Pulsa cualquier texto, imagen o botón para editarlo</span>
                  </span>
                </div>

                {/* Device Switcher */}
                <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-white/10 rounded-xl shadow-md">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`px-2.5 py-1 rounded-lg transition text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                      previewDevice === 'desktop' ? 'bg-white text-black font-bold shadow-sm' : 'text-zinc-400 hover:text-white'
                    }`}
                    title="Vista de Ordenador"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Escritorio</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('tablet')}
                    className={`px-2.5 py-1 rounded-lg transition text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                      previewDevice === 'tablet' ? 'bg-white text-black font-bold shadow-sm' : 'text-zinc-400 hover:text-white'
                    }`}
                    title="Vista de Tablet"
                  >
                    <Tablet className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Tablet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`px-2.5 py-1 rounded-lg transition text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                      previewDevice === 'mobile' ? 'bg-white text-black font-bold shadow-sm' : 'text-zinc-400 hover:text-white'
                    }`}
                    title="Vista de Móvil"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Móvil</span>
                  </button>
                </div>
              </div>

              {/* Toast Feedback */}
              {tweakNotice && (
                <div className="px-4 py-2 rounded-xl bg-zinc-900/90 border border-emerald-500/40 text-emerald-300 font-mono text-xs shadow-xl animate-fadeIn">
                  {tweakNotice}
                </div>
              )}

              {/* The Actual Render Frame */}
              <div 
                className={`transition-all duration-300 ease-out bg-black rounded-3xl overflow-hidden border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative ${
                  previewDevice === 'mobile' 
                    ? 'w-[390px] min-h-[780px] ring-8 ring-zinc-900' 
                    : previewDevice === 'tablet' 
                    ? 'w-[768px] min-h-[900px] ring-8 ring-zinc-900' 
                    : 'w-full max-w-6xl min-h-[800px]'
                }`}
              >
                <TemplateRenderer
                  restaurant={formData}
                  isPreview={true}
                  previewDevice={previewDevice}
                  onSelectElement={handleSelectElement}
                  selectedElement={selectedElement}
                />
              </div>
            </div>
          </div>

          {/* Inspector Panel on Right */}
          {isInspectorOpen && (
            <aside className="w-80 sm:w-96 border-l border-white/10 bg-zinc-950/95 backdrop-blur-xl p-4 sm:p-5 flex flex-col justify-between overflow-y-auto z-20 shrink-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-xs uppercase tracking-wider text-white">Inspector Visual</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsInspectorOpen(false)}
                    className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Switch Tabs */}
                <div className="grid grid-cols-5 gap-1 p-1 rounded-xl bg-zinc-900/80 border border-white/5 text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setSelectedElement({ type: 'background', label: 'Fondo & Colores' })}
                    className={`py-1.5 px-1 rounded-lg text-center transition cursor-pointer truncate ${
                      selectedElement?.type === 'background' || selectedElement?.type === 'colors'
                        ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Fondo
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedElement({ type: 'hero_image', label: 'Foto de Portada' })}
                    className={`py-1.5 px-1 rounded-lg text-center transition cursor-pointer truncate ${
                      selectedElement?.type === 'hero_image'
                        ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Portada
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedElement({ type: 'title', label: 'Nombre & Lema' })}
                    className={`py-1.5 px-1 rounded-lg text-center transition cursor-pointer truncate ${
                      selectedElement?.type === 'title' || selectedElement?.type === 'slogan'
                        ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Texto
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedElement({ type: 'cta_button', label: 'Botón de Reserva' })}
                    className={`py-1.5 px-1 rounded-lg text-center transition cursor-pointer truncate ${
                      selectedElement?.type === 'cta_button'
                        ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Botón
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedElement({ type: 'menu_item', label: 'Platos & Carta' })}
                    className={`py-1.5 px-1 rounded-lg text-center transition cursor-pointer truncate ${
                      selectedElement?.type === 'menu_item' || selectedElement?.type === 'dish_item'
                        ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Platos
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">Tocado en pantalla:</span>
                  <div className="font-bold text-white text-xs truncate max-w-[180px]">{selectedElement?.label || selectedElement?.title || 'General'}</div>
                </div>

                {/* 1. BACKGROUND & COLORS INSPECTOR */}
                {(selectedElement?.type === 'background' || selectedElement?.type === 'colors' || selectedElement?.type === 'theme') && (
                  <div className="space-y-4">
                    {/* Background Color */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold flex items-center justify-between">
                        <span>Color de Fondo de la Web</span>
                        <span className="text-zinc-300 font-mono text-[10px]">{formData.background_color}</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.background_color || '#1c1006'}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, background_color: e.target.value }));
                            showTweakNotice('Color de fondo actualizado');
                          }}
                          className="w-10 h-9 rounded-lg bg-transparent border border-white/20 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.background_color || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, background_color: e.target.value }))}
                          placeholder="#09090b"
                          className="flex-1 bg-zinc-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                        />
                      </div>

                      {/* Quick Swatches */}
                      <div className="grid grid-cols-4 gap-1.5 pt-1">
                        {[
                          { label: 'Obsidian', hex: '#060608' },
                          { label: 'Brasa', hex: '#180704' },
                          { label: 'Albero', hex: '#1c1006' },
                          { label: 'Esmeralda', hex: '#04160e' },
                          { label: 'Lonja', hex: '#021424' },
                          { label: 'Velvet', hex: '#0a0306' },
                          { label: 'Negro', hex: '#000000' },
                          { label: 'Grafito', hex: '#09090b' }
                        ].map(sw => (
                          <button
                            key={sw.hex}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, background_color: sw.hex }));
                              showTweakNotice(`Fondo: ${sw.label}`);
                            }}
                            className={`p-1.5 rounded-lg border text-left text-[10px] font-mono transition flex items-center gap-1.5 cursor-pointer ${
                              formData.background_color === sw.hex ? 'border-emerald-400 bg-white/10 text-white font-bold' : 'border-white/10 bg-zinc-900 text-zinc-400'
                            }`}
                          >
                            <span className="w-2.5 h-2.5 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: sw.hex }} />
                            <span className="truncate">{sw.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Surface / Cards Color */}
                    <div className="space-y-1.5 pt-2 border-t border-white/10">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold flex items-center justify-between">
                        <span>Color de Tarjetas / Superficie</span>
                        <span className="text-zinc-300 font-mono text-[10px]">{formData.surface_color}</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.surface_color || '#2a180b'}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, surface_color: e.target.value }));
                            showTweakNotice('Color de tarjetas actualizado');
                          }}
                          className="w-10 h-9 rounded-lg bg-transparent border border-white/20 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.surface_color || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, surface_color: e.target.value }))}
                          placeholder="#18181b"
                          className="flex-1 bg-zinc-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                    </div>

                    {/* Primary Accent Color */}
                    <div className="space-y-1.5 pt-2 border-t border-white/10">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold flex items-center justify-between">
                        <span>Color Principal de Acento</span>
                        <span className="text-zinc-300 font-mono text-[10px]">{formData.primary_color}</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.primary_color || '#eab308'}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, primary_color: e.target.value }));
                            showTweakNotice('Color de acento actualizado');
                          }}
                          className="w-10 h-9 rounded-lg bg-transparent border border-white/20 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.primary_color || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
                          className="flex-1 bg-zinc-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                        />
                      </div>

                      {/* Accent swatches */}
                      <div className="grid grid-cols-4 gap-1.5 pt-1">
                        {[
                          { label: 'Oro', hex: '#eab308' },
                          { label: 'Esmeralda', hex: '#10b981' },
                          { label: 'Rojo', hex: '#ef4444' },
                          { label: 'Naranja', hex: '#f97316' },
                          { label: 'Cian', hex: '#06b6d4' },
                          { label: 'Azul', hex: '#0284c7' },
                          { label: 'Fucsia', hex: '#ec4899' },
                          { label: 'Blanco', hex: '#ffffff' }
                        ].map(sw => (
                          <button
                            key={sw.hex}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, primary_color: sw.hex }));
                              showTweakNotice(`Acento: ${sw.label}`);
                            }}
                            className={`p-1.5 rounded-lg border text-left text-[10px] font-mono transition flex items-center gap-1.5 cursor-pointer ${
                              formData.primary_color === sw.hex ? 'border-emerald-400 bg-white/10 text-white font-bold' : 'border-white/10 bg-zinc-900 text-zinc-400'
                            }`}
                          >
                            <span className="w-2.5 h-2.5 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: sw.hex }} />
                            <span className="truncate">{sw.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Palettes 1-Click */}
                    <div className="space-y-1.5 pt-2 border-t border-white/10">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">
                        Paletas Recomendadas (1 Clic)
                      </label>
                      <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
                        {COLOR_PALETTES.map(pal => (
                          <button
                            key={pal.id}
                            type="button"
                            onClick={() => {
                              handlePaletteSelect(pal);
                              showTweakNotice(`Paleta: ${pal.name}`);
                            }}
                            className="p-2 rounded-lg border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-left transition flex items-center justify-between cursor-pointer text-xs"
                          >
                            <span className="text-zinc-300 font-semibold truncate text-[11px]">{pal.name}</span>
                            <div className="flex items-center gap-1 shrink-0">
                              <span className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: pal.primary }} />
                              <span className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: pal.bg }} />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. HERO IMAGE CONTROLS */}
                {selectedElement?.type === 'hero_image' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">Subir o Cambiar Foto</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => heroGalleryInputRef.current?.click()}
                          className="p-2.5 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-xs text-white font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Galería</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => heroCameraInputRef.current?.click()}
                          className="p-2.5 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-xs text-white font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Cámara</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Tamaño de la Foto</span>
                      </label>
                      <div className="grid grid-cols-4 gap-1">
                        {['sm', 'md', 'lg', 'xl'].map(sz => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, hero_image_size: sz }));
                              showTweakNotice(`Tamaño: ${sz.toUpperCase()}`);
                            }}
                            className={`py-1.5 rounded-lg text-xs font-semibold border transition text-center cursor-pointer ${
                              (formData.hero_image_size || 'md') === sz
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold'
                                : 'bg-zinc-900 border-white/10 text-zinc-300'
                            }`}
                          >
                            {sz.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold flex items-center gap-1.5">
                        <ArrowLeftRight className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Lado de la Foto</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, hero_image_side: 'left', hero_layout: 'split' }));
                            showTweakNotice('Foto a la izquierda');
                          }}
                          className={`p-2 rounded-xl text-xs font-semibold border transition text-center cursor-pointer ${
                            formData.hero_image_side === 'left' && formData.hero_layout === 'split'
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold'
                              : 'bg-zinc-900 border-white/10 text-zinc-300'
                          }`}
                        >
                          Izquierda
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, hero_image_side: 'right', hero_layout: 'split' }));
                            showTweakNotice('Foto a la derecha');
                          }}
                          className={`p-2 rounded-xl text-xs font-semibold border transition text-center cursor-pointer ${
                            formData.hero_image_side === 'right' && formData.hero_layout === 'split'
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold'
                              : 'bg-zinc-900 border-white/10 text-zinc-300'
                          }`}
                        >
                          Derecha
                        </button>
                      </div>
                    </div>

                    {/* Presets Grid */}
                    <div className="space-y-1.5 pt-2 border-t border-white/10">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">Fotos Recomendadas</label>
                      <div className="grid grid-cols-3 gap-1.5 max-h-36 overflow-y-auto pr-1">
                        {HERO_PHOTO_PRESETS.map((p, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, hero_image: p.url }));
                              showTweakNotice(`Foto: ${p.label}`);
                            }}
                            className="relative h-14 rounded-lg overflow-hidden border border-white/10 hover:border-emerald-400 transition cursor-pointer"
                          >
                            <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-end p-1">
                              <span className="text-[9px] text-white font-medium truncate">{p.label}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. TITLE & TYPOGRAPHY CONTROLS */}
                {selectedElement?.type === 'title' && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">Nombre del Restaurante</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={e => handleNameChange(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">Tipografía</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {['Playfair Display', 'Outfit', 'Inter', 'JetBrains Mono', 'Cormorant Garamond', 'Syne'].map(f => (
                          <button
                            key={f}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, font_family: f }));
                              showTweakNotice(`Fuente: ${f}`);
                            }}
                            className={`p-2 rounded-lg border text-center transition cursor-pointer text-xs ${
                              formData.font_family === f
                                ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold'
                                : 'bg-zinc-900 border-white/10 text-zinc-300'
                            }`}
                            style={{ fontFamily: f }}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. SLOGAN & DESCRIPTION */}
                {selectedElement?.type === 'slogan' && (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">Lema / Eslogan</label>
                      <textarea
                        rows={2}
                        value={formData.slogan}
                        onChange={e => setFormData({ ...formData, slogan: e.target.value })}
                        className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">Descripción del Local</label>
                      <textarea
                        rows={3}
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>
                )}

                {/* 5. CTA BUTTON */}
                {selectedElement?.type === 'cta_button' && (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">Texto del Botón</label>
                      <input
                        type="text"
                        value={formData.cta_text || 'Reservar Mesa Online'}
                        onChange={e => setFormData({ ...formData, cta_text: e.target.value })}
                        className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase">Sugerencias rápidas</label>
                      <div className="flex flex-wrap gap-1.5">
                        {['Reservar Mesa Online', 'Reservar Mesa', 'Hacer una Reserva', 'Pedir Mesa Ya', 'Reserva Directa'].map(txt => (
                          <button
                            key={txt}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, cta_text: txt }));
                              showTweakNotice(`Botón: "${txt}"`);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[11px] border transition cursor-pointer ${
                              formData.cta_text === txt
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold'
                                : 'bg-zinc-900 border-white/10 text-zinc-300 hover:text-white'
                            }`}
                          >
                            {txt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-zinc-300 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Botón Interactivo Activo</span>
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        Al pulsar este botón en la vista previa o en la web real, se abre directamente la ventana de reserva para tus clientes.
                      </p>
                    </div>
                  </div>
                )}

                {/* 6. DISH / MENU ITEM */}
                {(selectedElement?.type === 'menu_item' || selectedElement?.type === 'dish_item') && (
                  <div className="space-y-3">
                    {selectedElement?.data?.item ? (
                      <>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">Nombre del Plato</label>
                          <input
                            type="text"
                            value={selectedElement.data.item.name || ''}
                            onChange={e => {
                              const { categoryIndex, itemIndex } = selectedElement.data;
                              handleUpdateDish(categoryIndex, itemIndex, 'name', e.target.value);
                              setSelectedElement(prev => ({
                                ...prev,
                                data: { ...prev.data, item: { ...prev.data.item, name: e.target.value } }
                              }));
                            }}
                            className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 font-semibold"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">Precio (€)</label>
                          <input
                            type="number"
                            step="0.5"
                            value={selectedElement.data.item.price || 0}
                            onChange={e => {
                              const val = parseFloat(e.target.value) || 0;
                              const { categoryIndex, itemIndex } = selectedElement.data;
                              handleUpdateDish(categoryIndex, itemIndex, 'price', val);
                              setSelectedElement(prev => ({
                                ...prev,
                                data: { ...prev.data, item: { ...prev.data.item, price: val } }
                              }));
                            }}
                            className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-400"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">Descripción</label>
                          <textarea
                            rows={2}
                            value={selectedElement.data.item.description || ''}
                            onChange={e => {
                              const { categoryIndex, itemIndex } = selectedElement.data;
                              handleUpdateDish(categoryIndex, itemIndex, 'description', e.target.value);
                              setSelectedElement(prev => ({
                                ...prev,
                                data: { ...prev.data, item: { ...prev.data.item, description: e.target.value } }
                              }));
                            }}
                            className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-emerald-400"
                          />
                        </div>

                        <div className="space-y-1.5 pt-1">
                          <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">Foto del Plato</label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => dishGalleryInputRef.current?.click()}
                              className="p-2 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-xs text-white font-semibold flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Galería</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => dishCameraInputRef.current?.click()}
                              className="p-2 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-xs text-white font-semibold flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Camera className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Cámara</span>
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-xs text-zinc-400">Pulsa en cualquier plato de la carta en la vista previa para editar su nombre, precio y foto.</p>
                        <button
                          type="button"
                          onClick={() => handleAddDish(0)}
                          className="w-full py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Añadir Nuevo Plato a la Carta</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 7. CONTACT & HOURS */}
                {selectedElement?.type === 'contact' && (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">WhatsApp de Reservas</label>
                      <input
                        type="text"
                        value={formData.whatsapp_number}
                        onChange={e => setFormData({ ...formData, whatsapp_number: e.target.value })}
                        className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">Teléfono</label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">Dirección</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                        className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Inspector Bottom Launch */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSave}
                  className="w-full py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  <span>{saving ? 'Guardando...' : 'Lanzar Web Oficial'}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </aside>
          )}
        </div>
      )}
    </div>
  );
}
