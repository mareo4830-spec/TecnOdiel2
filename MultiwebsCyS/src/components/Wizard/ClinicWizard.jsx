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
  Stethoscope, 
  HeartPulse, 
  Activity, 
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
  Users,
  LayoutDashboard
} from 'lucide-react';
import { 
  TEMPLATES, 
  COLOR_PALETTES, 
  BASE_WEB_PRICE, 
  AVAILABLE_MODULES, 
  CLINIC_CATEGORIES, 
  MEDICAL_INSURANCES, 
  CLINIC_PHOTO_PRESETS, 
  getPresetServicesForStyle 
} from '../../lib/mockData';
import { createClinic, sanitizeSlug } from '../../lib/supabase';
import TemplateRenderer from '../Templates/TemplateRenderer';
import ErrorBoundary from '../ErrorBoundary';
import SlideCommit from '../ui/SlideCommit';
import confetti from 'canvas-confetti';

export default function ClinicWizard({ onCreated, onCancel, onOpenPortal }) {
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
  const treatmentGalleryInputRef = useRef(null);
  const treatmentCameraInputRef = useRef(null);

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
      showTweakNotice('Foto de portada de la clínica actualizada');
    });
    e.target.value = '';
  };

  const handleTreatmentImageUpload = (e) => {
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
        showTweakNotice('Foto del tratamiento guardada con éxito');
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
    name: 'Clínica Dental Odiel Sonrisas',
    slug: 'clinica-dental-sonrisas',
    subdomain: 'clinica-dental-sonrisas',
    slogan: 'Tu sonrisa perfecta con tecnología 3D y trato cercano',
    description: 'Centro odontológico de referencia en Huelva. Especialistas en implantología guiada sin dolor, ortodoncia invisible y estética dental. Primera consulta y radiografía panorámica digital gratuitas.',
    category: 'dental',
    collegiate_number: 'Col. Odontólogos Nº 21/0482',
    accepted_insurances: ['Adeslas', 'Sanitas', 'Asisa', 'DKV Seguros', 'Privado / Sin Seguro'],
    emergency_phone: '+34 611 22 33 44',
    cta_text: 'Pedir Cita Online Gratuita',

    template_id: 'dental_pure',
    hero_layout: 'split',
    hero_image_side: 'right',
    hero_image_size: 'md',
    hero_image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1920&q=80',

    primary_color: '#06b6d4',
    accent_color: '#22d3ee',
    background_color: '#041724',
    surface_color: '#08253a',
    font_family: 'Inter',

    owner_name: 'Dra. Carmen Odiel Valdivia',
    phone: '+34 959 28 30 40',
    whatsapp_number: '+34611223344',
    email: 'citas@dentalsonrisas.es',
    address: 'Avenida Martín Alonso Pinzón, 14',
    city: 'Huelva',
    postal_code: '21003',
    google_maps_url: 'https://maps.google.com',
    instagram_url: 'https://instagram.com/dentalsonrisas_huelva',
    facebook_url: '',

    lunch_shift: { enabled: true, open: '09:00', close: '14:00' },
    dinner_shift: { enabled: true, open: '16:00', close: '20:30' },
    closed_days: ['Sábado', 'Domingo'],

    selected_modules: ['booking_engine', 'whatsapp_triage', 'patient_portal', 'seo_local_google'],
    menu_categories: getPresetServicesForStyle('dental_pure')
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
    let tpl = 'dental_pure';
    if (catId === 'policlinica') tpl = 'medica_policlinica';
    else if (catId === 'fisioterapia') tpl = 'fisio_sport';
    else if (catId === 'estetica') tpl = 'estetica_glow';
    else if (catId === 'psicologia') tpl = 'psico_mente';
    else if (catId === 'veterinaria') tpl = 'veterinaria_care';
    else if (catId === 'oftalmologia') tpl = 'oftalmo_laser';
    else if (catId === 'podologia') tpl = 'podologia_active';

    const tplObj = TEMPLATES.find(t => t.id === tpl);
    const presets = getPresetServicesForStyle(tpl);

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

  const handlePaletteSelect = (pal) => {
    setFormData(prev => ({
      ...prev,
      primary_color: pal.primary,
      accent_color: pal.accent,
      background_color: pal.bg,
      surface_color: pal.surface
    }));
  };

  const toggleInsurance = (ins) => {
    setFormData(prev => {
      const current = prev.accepted_insurances || [];
      const exists = current.includes(ins);
      const updated = exists ? current.filter(i => i !== ins) : [...current, ins];
      return { ...prev, accepted_insurances: updated };
    });
  };

  const handleUpdateTreatment = (catIdx, itemIdx, field, value) => {
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
      const saved = await createClinic(formData);
      try {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.5 } });
      } catch (e) {}
      if (onCreated) onCreated(saved);
    } catch (err) {
      console.warn('Fallback saving clinic locally:', err);
      const fallbackClinic = {
        ...formData,
        id: `clinic-${Date.now()}`
      };
      try {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.5 } });
      } catch (e) {}
      if (onCreated) onCreated(fallbackClinic);
    } finally {
      setSaving(false);
    }
  };

  const SECTIONS = [
    { id: 1, label: 'Tu Centro', sub: 'Nombre, especialidad y dirección web' },
    { id: 2, label: 'Diseño & Portada', sub: 'Plantilla visual y foto del centro' },
    { id: 3, label: 'Colores & Letra', sub: 'Cromática médica y tipografía' },
    { id: 4, label: 'Citas & Mutuas', sub: 'Aseguradoras y confirmación online' },
    { id: 5, label: 'Horarios & Servicios', sub: 'Consultas y cuadro de tratamientos' },
    { id: 6, label: 'Equipo & Extras', sub: 'Colegiados, teléfono y servicios pro' },
    { id: 7, label: 'Tu Web Lista', sub: 'Revisa y edita tu web en vivo' }
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
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
                <span className="font-extrabold text-sm text-white">Configurador de Web para Clínicas & Salud</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
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
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ver Web Directa</span>
            </button>
          </div>
        </header>
      ) : (
        /* Top Bar for Step 7 */
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
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
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

            {onOpenPortal && (
              <button
                type="button"
                onClick={() => onOpenPortal()}
                className="px-3 py-1.5 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 hover:text-white font-semibold transition hidden sm:flex items-center gap-1.5 cursor-pointer"
                title="Abrir portal de clientes"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
                <span>Portal Clientes</span>
              </button>
            )}

            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="px-4 sm:px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-extrabold transition flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50 min-h-[40px] cursor-pointer shrink-0"
            >
              <span>{saving ? 'Guardando...' : 'Lanzar Web Clínica'}</span>
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
            {/* Progress */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2.5 shadow-lg">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-zinc-400 uppercase text-[11px] font-semibold">// PROGRESO DEL FORMULARIO</span>
                <span className="font-mono text-cyan-400 font-bold">Paso {activeSection} de 6</span>
              </div>
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                <div 
                  className="bg-cyan-400 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${(activeSection / 6) * 100}%` }}
                />
              </div>
            </div>

            {/* Step 1: Tu Centro Médico */}
            {activeSection === 1 && (
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-5 shadow-xl animate-fadeIn">
                <div className="border-b border-white/10 pb-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-cyan-400" />
                    <span>Paso 1: Tu Centro Médico & Especialidad</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Indica el nombre de tu clínica y su especialidad para configurar los servicios y la dirección web automáticamente.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-semibold text-zinc-300 uppercase">
                        Nombre Completo del Director / Titular *
                      </label>
                      <input
                        type="text"
                        value={formData.owner_name}
                        onChange={e => setFormData({ ...formData, owner_name: e.target.value })}
                        placeholder="Ej. Dra. Carmen Odiel Valdivia"
                        className="w-full bg-zinc-900 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white font-medium focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-semibold text-zinc-300 uppercase">
                        Email Oficial del Centro *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="citas@dentalsonrisas.es"
                        className="w-full bg-zinc-900 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white font-medium focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold text-zinc-300 uppercase">
                      Nombre de la Clínica o Centro de Salud *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => handleNameChange(e.target.value)}
                      placeholder="Ej. Clínica Dental Odiel Sonrisas"
                      className="w-full bg-zinc-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs font-mono flex items-center justify-between">
                    <span className="text-zinc-400">Dirección Web Automática:</span>
                    <span className="text-cyan-400 font-bold">https://{formData.slug || 'clinica'}.tecnodiel.app</span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono font-semibold text-zinc-300 uppercase">
                      Especialidad Principal del Centro
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {CLINIC_CATEGORIES.map(cat => {
                        const CategoryIcon = cat.id === 'fisioterapia' ? HeartPulse
                          : cat.id === 'estetica' ? Sparkles
                          : cat.id === 'policlinica' ? Activity
                          : cat.id === 'psicologia' ? Users
                          : cat.id === 'oftalmologia' ? Eye
                          : cat.id === 'veterinaria' ? ShieldCheck
                          : Stethoscope;

                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleCategorySelect(cat.id)}
                            className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 cursor-pointer interactive-selectable ${
                              formData.category === cat.id
                                ? 'bg-cyan-500/20 border-cyan-500 text-white font-bold shadow-sm'
                                : 'bg-zinc-900 border-white/10 text-zinc-300 hover:bg-zinc-800'
                            }`}
                          >
                            <CategoryIcon className="w-5 h-5 text-cyan-400 shrink-0" />
                            <span className="text-xs">{cat.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold text-zinc-300 uppercase">
                      Número de Colegiado o Código NICA (Opcional)
                    </label>
                    <input
                      type="text"
                      value={formData.collegiate_number}
                      onChange={e => setFormData({ ...formData, collegiate_number: e.target.value })}
                      placeholder="Ej. Col. Odontólogos Nº 21/0482 o NICA 48192"
                      className="w-full bg-zinc-900 border border-white/15 rounded-xl px-4 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
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
                    <Layout className="w-5 h-5 text-cyan-400" />
                    <span>Paso 2: Estilo Visual & Foto de Portada</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Elige la plantilla visual adecuada y la fotografía de tu gabinete o equipo médico.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-semibold text-zinc-300 uppercase">
                      Estilos Visuales de Plantilla Clínica
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {TEMPLATES.map(tpl => (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              template_id: tpl.id,
                              primary_color: tpl.previewColors.primary,
                              accent_color: tpl.previewColors.accent,
                              background_color: tpl.previewColors.bg,
                              surface_color: tpl.previewColors.card,
                              font_family: tpl.defaultFont,
                              hero_layout: tpl.defaultLayout,
                              menu_categories: getPresetServicesForStyle(tpl.id)
                            }));
                          }}
                          className={`p-3.5 rounded-xl border text-left transition space-y-1.5 cursor-pointer interactive-selectable ${
                            formData.template_id === tpl.id
                              ? 'bg-cyan-500/20 border-cyan-500 text-white font-bold'
                              : 'bg-zinc-900 border-white/10 text-zinc-300 hover:bg-zinc-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">{tpl.name}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-cyan-300 border border-cyan-500/30">
                              {tpl.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">{tpl.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-mono font-semibold text-zinc-300 uppercase">
                      Foto de Portada del Centro
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={formData.hero_image}
                        onChange={e => setFormData({ ...formData, hero_image: e.target.value })}
                        placeholder="URL de la foto..."
                        className="flex-1 bg-zinc-900 border border-white/15 rounded-xl px-4 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                      {CLINIC_PHOTO_PRESETS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormData({ ...formData, hero_image: p.url })}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs shrink-0 cursor-pointer interactive-selectable ${
                            formData.hero_image === p.url ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold' : 'bg-zinc-900 border-white/10 text-zinc-300'
                          }`}
                        >
                          <img src={p.url} alt={p.label} className="w-5 h-5 rounded object-cover" />
                          <span>{p.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Colores Sanitarios & Letra */}
            {activeSection === 3 && (
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-5 shadow-xl animate-fadeIn">
                <div className="border-b border-white/10 pb-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Palette className="w-5 h-5 text-cyan-400" />
                    <span>Paso 3: Colores Sanitarios & Tipografía</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Selecciona una paleta equilibrada para proyectar higiene, confianza médica y profesionalismo.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-semibold text-zinc-300 uppercase">
                      Paletas Clínicas Recomendadas
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {COLOR_PALETTES.map((pal, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handlePaletteSelect(pal)}
                          className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 cursor-pointer interactive-selectable ${
                            formData.primary_color === pal.primary
                              ? 'bg-white/15 border-white text-white font-bold'
                              : 'bg-zinc-900 border-white/10 text-zinc-300 hover:bg-zinc-800'
                          }`}
                        >
                          <div className="w-5 h-5 rounded-full border border-black/40 shrink-0" style={{ backgroundColor: pal.primary }} />
                          <span className="text-xs">{pal.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-mono font-semibold text-zinc-300 uppercase">
                      Tipografía Principal
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Inter', 'Outfit', 'Playfair Display'].map(f => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setFormData({ ...formData, font_family: f })}
                          className={`p-3 rounded-xl border text-center transition text-xs cursor-pointer interactive-selectable ${
                            formData.font_family === f ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold' : 'bg-zinc-900 border-white/10 text-zinc-300'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Citas Médicas & Mutuas */}
            {activeSection === 4 && (
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-5 shadow-xl animate-fadeIn">
                <div className="border-b border-white/10 pb-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                    <span>Paso 4: Sistema de Citas Médicas & Mutuas</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Indica las aseguradoras médicas que atiendes en tu consulta y el texto de llamada a la acción.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold text-zinc-300 uppercase">
                      Texto del Botón de Cita Online
                    </label>
                    <input
                      type="text"
                      value={formData.cta_text}
                      onChange={e => setFormData({ ...formData, cta_text: e.target.value })}
                      className="w-full bg-zinc-900 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white font-bold focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono font-semibold text-zinc-300 uppercase">
                      Aseguradoras & Mutuas Médicas Aceptadas
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {MEDICAL_INSURANCES.map((ins, idx) => {
                        const isChecked = (formData.accepted_insurances || []).includes(ins);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => toggleInsurance(ins)}
                            className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between text-xs cursor-pointer interactive-selectable ${
                              isChecked
                                ? 'bg-cyan-500/20 border-cyan-500 text-white font-bold'
                                : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white'
                            }`}
                          >
                            <span>{ins}</span>
                            {isChecked && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Horarios & Tratamientos */}
            {activeSection === 5 && (
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-5 shadow-xl animate-fadeIn">
                <div className="border-b border-white/10 pb-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-cyan-400" />
                    <span>Paso 5: Horarios de Consulta & Cuadro de Tratamientos</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Configura los turnos de atención y añade tus tratamientos estrella con sus precios y descripciones.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase">Horario Mañanas</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={formData.lunch_shift.open}
                          onChange={e => setFormData({ ...formData, lunch_shift: { ...formData.lunch_shift, open: e.target.value } })}
                          className="w-full bg-zinc-900 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                        />
                        <span>a</span>
                        <input
                          type="text"
                          value={formData.lunch_shift.close}
                          onChange={e => setFormData({ ...formData, lunch_shift: { ...formData.lunch_shift, close: e.target.value } })}
                          className="w-full bg-zinc-900 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase">Horario Tardes</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={formData.dinner_shift.open}
                          onChange={e => setFormData({ ...formData, dinner_shift: { ...formData.dinner_shift, open: e.target.value } })}
                          className="w-full bg-zinc-900 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                        />
                        <span>a</span>
                        <input
                          type="text"
                          value={formData.dinner_shift.close}
                          onChange={e => setFormData({ ...formData, dinner_shift: { ...formData.dinner_shift, close: e.target.value } })}
                          className="w-full bg-zinc-900 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono font-semibold text-zinc-300 uppercase">
                        Tratamientos del Centro (Se editan en vivo en el paso 7)
                      </label>
                      <span className="text-[11px] text-cyan-400 font-mono">
                        {(formData.menu_categories || []).flatMap(c => c.items || []).length} tratamientos cargados
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/10 space-y-2">
                      {(formData.menu_categories || []).map((cat, cIdx) => (
                        <div key={cIdx} className="space-y-1.5">
                          <span className="text-xs font-bold text-white font-mono">{cat.category}:</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
                            {(cat.items || []).map((it, iIdx) => (
                              <div key={iIdx} className="p-2 rounded-lg bg-black/40 border border-white/5 flex justify-between text-xs">
                                <span className="text-zinc-200">{it.name}</span>
                                <span className="text-cyan-300 font-mono font-bold">{it.price}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Contacto & Extras */}
            {activeSection === 6 && (
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-5 shadow-xl animate-fadeIn">
                <div className="border-b border-white/10 pb-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-cyan-400" />
                    <span>Paso 6: Contacto, Ubicación & Módulos Pro</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Indica dónde está tu clínica y qué servicios digitales deseas activar.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase">Teléfono Fijo / Citas</label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase">WhatsApp de Citas</label>
                      <input
                        type="text"
                        value={formData.whatsapp_number}
                        onChange={e => setFormData({ ...formData, whatsapp_number: e.target.value })}
                        className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase">Dirección</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                        className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase">Ciudad</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase">Instagram / Redes Sociales</label>
                      <input
                        type="text"
                        value={formData.instagram_url}
                        onChange={e => setFormData({ ...formData, instagram_url: e.target.value })}
                        placeholder="https://instagram.com/mi_clinica"
                        className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase">Nº Colegiado / Registro Sanitario</label>
                      <input
                        type="text"
                        value={formData.collegiate_number}
                        onChange={e => setFormData({ ...formData, collegiate_number: e.target.value })}
                        placeholder="Col. 21/0482 o NICA 48192"
                        className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-mono font-semibold text-zinc-300 uppercase">
                      Módulos & Servicios Digitales de TecnOdiel CyS
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {AVAILABLE_MODULES.map(mod => {
                        const isChecked = (formData.selected_modules || []).includes(mod.id);
                        return (
                          <button
                            key={mod.id}
                            type="button"
                            onClick={() => {
                              const current = formData.selected_modules || [];
                              const exists = current.includes(mod.id);
                              const updated = exists ? current.filter(id => id !== mod.id) : [...current, mod.id];
                              setFormData({ ...formData, selected_modules: updated });
                            }}
                            className={`p-3 rounded-xl border text-left transition flex items-start justify-between cursor-pointer ${
                              isChecked
                                ? 'bg-cyan-500/15 border-cyan-500 text-white'
                                : 'bg-zinc-900 border-white/10 text-zinc-400'
                            }`}
                          >
                            <div className="space-y-0.5 pr-2">
                              <span className="text-xs font-bold text-white block">{mod.name}</span>
                              <span className="text-[11px] text-zinc-400 block">{mod.description}</span>
                            </div>
                            <span className="text-xs font-mono text-cyan-400 font-bold shrink-0">+{mod.price}€/m</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Navigation Pills (Inspirado en DdMiQCJyBZt) */}
            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              <button
                type="button"
                disabled={activeSection === 1}
                onClick={() => setActiveSection(prev => Math.max(1, prev - 1))}
                className="group relative px-5 py-2.5 rounded-full border border-white/15 bg-zinc-900/80 hover:bg-zinc-800 text-xs font-mono font-semibold text-zinc-300 hover:text-white disabled:opacity-25 transition-all flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                <span>Paso Anterior</span>
              </button>

              {/* Indicador de píldoras centrales */}
              <div className="hidden sm:flex items-center gap-1.5 p-1.5 rounded-full bg-zinc-900/90 border border-white/10 shadow-inner">
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setActiveSection(num)}
                    className={`w-7 h-7 rounded-full text-[11px] font-mono font-bold transition-all flex items-center justify-center cursor-pointer ${
                      activeSection === num
                        ? 'bg-cyan-400 text-black shadow-[0_0_12px_rgba(6,182,212,0.5)] scale-110'
                        : activeSection > num
                        ? 'bg-zinc-800 text-cyan-400 border border-cyan-500/30'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {activeSection > num ? <Check className="w-3.5 h-3.5" /> : `0${num}`}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setActiveSection(prev => Math.min(7, prev + 1))}
                className="group relative px-6 py-2.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-mono font-black transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(6,182,212,0.4)] active:scale-95"
              >
                <span>{activeSection === 6 ? 'Ver Esqueleto Clínico' : 'Siguiente Paso'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* STEP 7: Esqueleto Visual Estático (4 Cuadros) & SlideCommit */
        <div className="flex-1 flex overflow-hidden relative">
          {/* Live Responsive Skeleton Area — Left */}
          <div className="flex-1 p-2 sm:p-4 md:p-6 flex flex-col items-center justify-start overflow-y-auto relative">
            {/* Ambient Glow */}
            <div
              className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[140px] pointer-events-none opacity-20"
              style={{ backgroundColor: formData.primary_color }}
            />

            {/* Device Mockup Toolbar */}
            <div className="w-full flex flex-col items-center z-10 space-y-3">
              <div className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                    <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Pulsa cualquier cuadro para ajustar colores o tipografía</span>
                  </span>
                </div>
                <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-white/10 rounded-xl shadow-md">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`px-2.5 py-1 rounded-lg transition text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${previewDevice === 'desktop' ? 'bg-white text-black font-bold shadow-sm' : 'text-zinc-400 hover:text-white'}`}
                    title="Vista de Ordenador"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Escritorio</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`px-2.5 py-1 rounded-lg transition text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${previewDevice === 'mobile' ? 'bg-white text-black font-bold shadow-sm' : 'text-zinc-400 hover:text-white'}`}
                    title="Vista de Móvil"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Móvil</span>
                  </button>
                </div>
              </div>

              {/* Toast Feedback */}
              {tweakNotice && (
                <div className="px-4 py-2 rounded-xl bg-zinc-900/90 border border-cyan-500/40 text-cyan-300 font-mono text-xs shadow-xl animate-fadeIn">
                  {tweakNotice}
                </div>
              )}

              {/* Header explicativo del Esqueleto Clínico */}
              <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/90 border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 w-full max-w-6xl">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                      Esqueleto Visual Médico (4 Cuadros Interactivos)
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-white font-sans">
                    Verifica la estética de tu centro médico antes de activar el portal
                  </h2>
                  <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">
                    Estos 4 cuadros estáticos te permiten probar tipografías, colores de confianza médica y estructura. Tus datos clínicos reales se cargarán desde administración en tu portal de cliente con Google OAuth.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-white/10 rounded-xl shrink-0">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-1.5 cursor-pointer ${
                      previewDevice === 'desktop' ? 'bg-white text-black font-bold shadow' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Escritorio</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-1.5 cursor-pointer ${
                      previewDevice === 'mobile' ? 'bg-white text-black font-bold shadow' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Móvil</span>
                  </button>
                </div>
              </div>

              {/* Grid de los 4 Cuadros Estáticos de Clínica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-6xl">

                {/* CUADRO 1: TRATAMIENTOS & ESPECIALIDADES MÉDICAS */}
                <div
                  className="p-5 rounded-2xl border transition-all duration-300 shadow-xl relative overflow-hidden flex flex-col justify-between"
                  style={{
                    backgroundColor: formData.surface_color || '#0a1017',
                    borderColor: `${formData.primary_color}40`,
                    fontFamily: formData.font_family || 'Inter, sans-serif'
                  }}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: `${formData.primary_color}25` }}>
                      <div className="flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-black/40 border border-white/10">
                          <Activity className="w-4 h-4" style={{ color: formData.primary_color }} />
                        </span>
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider block text-zinc-400 font-sans">
                            Cuadro 1 // Esqueleto Cuadro Médico
                          </span>
                          <h4 className="text-sm font-bold text-white">Especialidades & Tratamientos</h4>
                        </div>
                      </div>
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase"
                        style={{ backgroundColor: `${formData.primary_color}20`, color: formData.primary_color }}
                      >
                        Cuadro Médico
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {[
                        { name: 'Odontología & Estética Dental', time: '1ª Consulta Gratuita', badge: 'Alta Demanda', desc: 'Diagnóstico 3D, carillas de porcelana e implantes de carga inmediata.' },
                        { name: 'Fisioterapia & Readaptación', time: 'Sesiones 50 min', badge: 'Especialista', desc: 'Terapia manual avanzada, punción seca y recuperación funcional.' },
                        { name: 'Medicina General & Analíticas', time: 'Atención Inmediata', badge: 'Diario', desc: 'Control preventivo de salud y recetas oficiales homologadas.' }
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between gap-3"
                        >
                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white truncate">{item.name}</span>
                              <span
                                className="text-[9px] font-sans px-1.5 py-0.2 rounded font-semibold shrink-0"
                                style={{ backgroundColor: `${formData.primary_color}30`, color: formData.primary_color }}
                              >
                                {item.badge}
                              </span>
                            </div>
                            <p className="text-[10px] text-zinc-400 font-sans truncate">{item.desc}</p>
                          </div>
                          <span className="text-xs font-mono font-bold text-cyan-300 shrink-0">
                            {item.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t flex items-center justify-between text-[11px] font-sans text-zinc-400" style={{ borderColor: `${formData.primary_color}20` }}>
                    <span>Tipografía: <strong className="text-white font-mono">{formData.font_family}</strong></span>
                    <span className="flex items-center gap-1 font-mono text-cyan-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Catálogo Homologado
                    </span>
                  </div>
                </div>

                {/* CUADRO 2: LANDING PAGE MÉDICA & HERO */}
                <div
                  className="p-5 rounded-2xl border transition-all duration-300 shadow-xl relative overflow-hidden flex flex-col justify-between"
                  style={{
                    backgroundColor: formData.background_color || '#041724',
                    borderColor: `${formData.primary_color}40`,
                    fontFamily: formData.font_family || 'Inter, sans-serif'
                  }}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: `${formData.primary_color}25` }}>
                      <div className="flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-black/40 border border-white/10">
                          <Globe className="w-4 h-4" style={{ color: formData.primary_color }} />
                        </span>
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider block text-zinc-400 font-sans">
                            Cuadro 2 // Esqueleto Landing Médica
                          </span>
                          <h4 className="text-sm font-bold text-white">Portada Médica & Prestigio</h4>
                        </div>
                      </div>
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase"
                        style={{ backgroundColor: `${formData.accent_color}20`, color: formData.accent_color }}
                      >
                        RGPD & Sanidad
                      </span>
                    </div>

                    <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/60 p-4 space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-sans text-zinc-400 pb-2 border-b border-white/5">
                        <span className="font-bold text-white">{formData.name}</span>
                        <div className="flex gap-2">
                          <span>Especialidades</span>
                          <span>Equipo</span>
                          <span>Cita Online</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 py-2">
                        <span
                          className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full inline-block"
                          style={{ backgroundColor: `${formData.primary_color}25`, color: formData.primary_color }}
                        >
                          {formData.slogan || 'Cuidado de vanguardia y cercanía para tu salud'}
                        </span>
                        <h3 className="text-lg font-black text-white leading-tight">
                          Excelencia médica y tecnología diagnóstica en cada consulta
                        </h3>
                        <p className="text-[11px] text-zinc-400 font-sans line-clamp-2">
                          {formData.description || 'Instalaciones sanitarias de última generación con equipo clínico colegiado.'}
                        </p>
                      </div>

                      <div className="pt-2">
                        <button
                          type="button"
                          className="px-4 py-2 rounded-xl text-xs font-sans font-bold text-black transition flex items-center gap-1.5 shadow"
                          style={{ backgroundColor: formData.primary_color }}
                        >
                          <span>{formData.cta_text || 'Pedir Cita Online 24/7'}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t flex items-center justify-between text-[11px] font-sans text-zinc-400" style={{ borderColor: `${formData.primary_color}20` }}>
                    <span>Disposición: <strong className="text-white font-mono">{formData.hero_layout}</strong></span>
                    <span className="flex items-center gap-1 font-mono text-cyan-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Colegiado: {formData.collegiate_number || 'Oficial'}
                    </span>
                  </div>
                </div>

                {/* CUADRO 3: SISTEMA DE CITA PREVIA & MUTUAS */}
                <div
                  className="p-5 rounded-2xl border transition-all duration-300 shadow-xl relative overflow-hidden flex flex-col justify-between"
                  style={{
                    backgroundColor: formData.surface_color || '#0a1017',
                    borderColor: `${formData.primary_color}40`,
                    fontFamily: formData.font_family || 'Inter, sans-serif'
                  }}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: `${formData.primary_color}25` }}>
                      <div className="flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-black/40 border border-white/10">
                          <Calendar className="w-4 h-4" style={{ color: formData.primary_color }} />
                        </span>
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider block text-zinc-400 font-sans">
                            Cuadro 3 // Esqueleto Citas & Mutuas
                          </span>
                          <h4 className="text-sm font-bold text-white">Cita Previa Automatizada</h4>
                        </div>
                      </div>
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase"
                        style={{ backgroundColor: 'rgba(6,182,212,0.15)', color: '#06b6d4' }}
                      >
                        24 Horas / Día
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-3 font-sans">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded-lg bg-zinc-900 border border-white/5 space-y-0.5">
                          <span className="text-[10px] text-zinc-400 font-mono">MUTUA O PRIVADO</span>
                          <div className="text-white font-bold truncate">Adeslas / Sanitas / Privado</div>
                        </div>
                        <div className="p-2 rounded-lg bg-zinc-900 border border-white/5 space-y-0.5">
                          <span className="text-[10px] text-zinc-400 font-mono">PRIMER HUECO</span>
                          <div className="text-cyan-300 font-bold">Mañana, 10:15h</div>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-500/30 text-[11px] text-cyan-300 flex items-center justify-between">
                        <span>WhatsApp Clínico Directo:</span>
                        <span className="font-mono font-bold">{formData.whatsapp_number}</span>
                      </div>

                      <button
                        type="button"
                        className="w-full py-2.5 rounded-xl text-xs font-bold text-black transition flex items-center justify-center gap-2"
                        style={{ backgroundColor: formData.primary_color }}
                      >
                        <span>Reservar Cita en Calendario</span>
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t flex items-center justify-between text-[11px] font-sans text-zinc-400" style={{ borderColor: `${formData.primary_color}20` }}>
                    <span>Recordatorios: <strong className="text-white font-mono">SMS / WhatsApp</strong></span>
                    <span className="flex items-center gap-1 font-mono text-cyan-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 0% Ausencias
                    </span>
                  </div>
                </div>

                {/* CUADRO 4: FICHA PACIENTE & PORTAL CLÍNICO */}
                <div
                  className="p-5 rounded-2xl border transition-all duration-300 shadow-xl relative overflow-hidden flex flex-col justify-between"
                  style={{
                    backgroundColor: formData.background_color || '#041724',
                    borderColor: `${formData.primary_color}40`,
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: `${formData.primary_color}25` }}>
                      <div className="flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-black/40 border border-white/10">
                          <ShieldCheck className="w-4 h-4" style={{ color: formData.primary_color }} />
                        </span>
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider block text-zinc-400">
                            Cuadro 4 // Esqueleto Portal Médico
                          </span>
                          <h4 className="text-sm font-bold text-white font-sans">Portal de Gestión & Pacientes</h4>
                        </div>
                      </div>
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-cyan-500/15 text-cyan-400"
                      >
                        Google OAuth
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 rounded-xl bg-black/60 border border-white/10">
                          <span className="text-[10px] text-zinc-400 font-mono block">CITAS DE HOY</span>
                          <span className="text-xl font-black text-white font-mono">18 Pacientes</span>
                          <span className="text-[10px] text-cyan-400 block pt-0.5">Sincronizado 100%</span>
                        </div>
                        <div className="p-3 rounded-xl bg-black/60 border border-white/10">
                          <span className="text-[10px] text-zinc-400 font-mono block">CONSULTAS ONLINE</span>
                          <span className="text-xl font-black text-cyan-300 font-mono">42</span>
                          <span className="text-[10px] text-zinc-400 block pt-0.5">Pacientes activos</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-cyan-400" />
                          <span className="text-zinc-300 font-medium">Cuadro Médico & Horarios</span>
                        </div>
                        <span className="font-mono text-zinc-400 text-[11px]">En Línea</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t flex items-center justify-between text-[11px] font-sans text-zinc-400" style={{ borderColor: `${formData.primary_color}20` }}>
                    <span>Acceso Titular: <strong className="text-white font-mono">{formData.email}</strong></span>
                    <span className="flex items-center gap-1 font-mono text-cyan-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Portal Clínico Listo
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Final Action: SlideCommit Button */}
              <div className="w-full max-w-2xl p-6 rounded-3xl bg-zinc-950/90 border border-white/10 shadow-2xl flex flex-col items-center text-center space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                    // FINALIZAR Y ENVIAR RESPUESTAS
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    Desliza para enviar tu configuración al equipo de TecnOdiel
                  </h3>
                  <p className="text-xs text-zinc-400 max-w-md">
                    Guardaremos tu solicitud médica para que los administradores generen tu web definitiva con la plantilla acordada. Podrás acceder a tu portal con tu cuenta de Google.
                  </p>
                </div>

                <div className="w-full flex justify-center pt-2">
                  <SlideCommit
                    label="Desliza para enviar y crear tu cuenta médica"
                    doneLabel="¡Enviado con Éxito!"
                    width={340}
                    handleColor={formData.primary_color || '#06b6d4'}
                    successColor="#06b6d4"
                    onDone={handleSave}
                  />
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveSection(6)}
                    className="hover:text-white transition underline cursor-pointer"
                  >
                    ← Volver a editar respuestas
                  </button>
                  <span>•</span>
                  <span className="text-cyan-400">Garantía TecnOdiel 100% a Medida</span>
                </div>
              </div>
            </div>
          </div>

          {/* Inspector Panel on Right */}
          {isInspectorOpen && (
            <aside className="w-80 sm:w-96 border-l border-white/10 bg-zinc-950/95 backdrop-blur-xl p-4 sm:p-5 flex flex-col justify-between overflow-y-auto z-20 shrink-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
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
                <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-zinc-900/80 border border-white/5 text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setSelectedElement({ type: 'background', label: 'Fondo & Colores' })}
                    className={`py-1.5 px-1 rounded-lg text-center transition cursor-pointer truncate ${
                      selectedElement?.type === 'background' || selectedElement?.type === 'colors'
                        ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/40'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Fondo
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedElement({ type: 'hero_image', label: 'Portada & Layout' })}
                    className={`py-1.5 px-1 rounded-lg text-center transition cursor-pointer truncate ${
                      selectedElement?.type === 'hero_image' || selectedElement?.type === 'hero_layout'
                        ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/40'
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
                        ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/40'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Texto
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedElement({ type: 'cta_button', label: 'Botón de Cita' })}
                    className={`py-1.5 px-1 rounded-lg text-center transition cursor-pointer truncate ${
                      selectedElement?.type === 'cta_button'
                        ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/40'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Botón
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs flex items-center justify-between">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">Tocado en pantalla:</span>
                  <div className="font-bold text-white text-xs truncate max-w-[180px]">{selectedElement?.label || selectedElement?.title || 'General'}</div>
                </div>

                {/* 1. BACKGROUND & COLORS INSPECTOR */}
                {(selectedElement?.type === 'background' || selectedElement?.type === 'colors' || selectedElement?.type === 'theme') && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold flex items-center justify-between">
                        <span>Color de Fondo de la Web</span>
                        <span className="text-zinc-300 font-mono text-[10px]">{formData.background_color}</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.background_color || '#041724'}
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
                          placeholder="#041724"
                          className="flex-1 bg-zinc-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      {/* Quick Swatches */}
                      <div className="grid grid-cols-4 gap-1.5 pt-1">
                        {[
                          { label: 'Océano', hex: '#041724' },
                          { label: 'Clínico', hex: '#081a24' },
                          { label: 'Grafito', hex: '#0a0e14' },
                          { label: 'Esmeralda', hex: '#041c16' },
                          { label: 'Índigo', hex: '#0b0f24' },
                          { label: 'Negro', hex: '#000000' },
                          { label: 'Ceniza', hex: '#10141d' },
                          { label: 'Noche', hex: '#080b10' }
                        ].map(sw => (
                          <button
                            key={sw.hex}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, background_color: sw.hex }));
                              showTweakNotice(`Fondo: ${sw.label}`);
                            }}
                            className={`p-1.5 rounded-lg border text-left text-[10px] font-mono transition flex items-center gap-1.5 cursor-pointer ${
                              formData.background_color === sw.hex ? 'border-cyan-400 bg-white/10 text-white font-bold' : 'border-white/10 bg-zinc-900 text-zinc-400'
                            }`}
                          >
                            <span className="w-2.5 h-2.5 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: sw.hex }} />
                            <span className="truncate">{sw.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-white/10">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold flex items-center justify-between">
                        <span>Color de Tarjetas / Superficie</span>
                        <span className="text-zinc-300 font-mono text-[10px]">{formData.surface_color}</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.surface_color || '#0a1017'}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, surface_color: e.target.value }));
                            showTweakNotice('Superficie actualizada');
                          }}
                          className="w-10 h-9 rounded-lg bg-transparent border border-white/20 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.surface_color || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, surface_color: e.target.value }))}
                          placeholder="#0a1017"
                          className="flex-1 bg-zinc-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-white/10">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold flex items-center justify-between">
                        <span>Color Principal de Acento</span>
                        <span className="text-zinc-300 font-mono text-[10px]">{formData.primary_color}</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.primary_color || '#06b6d4'}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, primary_color: e.target.value }));
                            showTweakNotice('Color principal actualizado');
                          }}
                          className="w-10 h-9 rounded-lg bg-transparent border border-white/20 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.primary_color || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
                          placeholder="#06b6d4"
                          className="flex-1 bg-zinc-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. TYPOGRAPHY */}
                {selectedElement?.type === 'title' && (
                  <div className="space-y-3">
                    <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold block">Tipografía Médica</label>
                    <div className="space-y-1.5">
                      {[
                        { label: 'Inter (Clara & Moderna)', value: 'Inter, sans-serif' },
                        { label: 'Plus Jakarta Sans (Moderna)', value: 'Plus Jakarta Sans, sans-serif' },
                        { label: 'Outfit (Vanguardista)', value: 'Outfit, sans-serif' },
                        { label: 'Playfair Display (Elegante & Exclusiva)', value: 'Playfair Display, serif' }
                      ].map(font => (
                        <button
                          key={font.value}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, font_family: font.value }));
                            showTweakNotice(`Fuente: ${font.label}`);
                          }}
                          className={`w-full p-2.5 rounded-xl border text-left text-xs transition cursor-pointer flex items-center justify-between ${
                            formData.font_family === font.value
                              ? 'border-cyan-400 bg-cyan-500/10 text-white font-bold'
                              : 'border-white/10 bg-zinc-900 text-zinc-400 hover:text-white'
                          }`}
                          style={{ fontFamily: font.value }}
                        >
                          <span>{font.label}</span>
                          {formData.font_family === font.value && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-white/10">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">Lema / Slogan</label>
                      <input
                        type="text"
                        value={formData.slogan || ''}
                        onChange={e => setFormData({ ...formData, slogan: e.target.value })}
                        className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                )}

                {/* 3. CTA BUTTON */}
                {selectedElement?.type === 'cta_button' && (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">Texto del Botón de Cita</label>
                      <input
                        type="text"
                        value={formData.cta_text || 'Pedir Cita Online'}
                        onChange={e => setFormData({ ...formData, cta_text: e.target.value })}
                        className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                )}

                {/* 4. HERO LAYOUT */}
                {(selectedElement?.type === 'hero_image' || selectedElement?.type === 'hero_layout') && (
                  <div className="space-y-3">
                    <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold block">Disposición del Hero</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Centrado Clásico', value: 'centered' },
                        { label: 'Split con Imagen', value: 'split' },
                        { label: 'Pantalla Completa', value: 'fullscreen' },
                        { label: 'Tarjetas Múltiples', value: 'cards' }
                      ].map(layout => (
                        <button
                          key={layout.value}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, hero_layout: layout.value }));
                            showTweakNotice(`Disposición: ${layout.label}`);
                          }}
                          className={`p-2.5 rounded-xl border text-center text-xs transition cursor-pointer ${
                            formData.hero_layout === layout.value
                              ? 'border-cyan-400 bg-cyan-500/10 text-white font-bold'
                              : 'border-white/10 bg-zinc-900 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {layout.label}
                        </button>
                      ))}
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
                  className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  <span>{saving ? 'Guardando...' : 'Lanzar Web Clínica'}</span>
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
