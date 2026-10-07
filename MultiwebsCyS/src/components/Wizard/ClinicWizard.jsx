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

  // Click-to-Edit Inspector State (solo se abre si el usuario clica en algo que quiere editar)
  const [selectedElement, setSelectedElement] = useState(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

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
    <div className="min-h-screen bg-[#121212] text-white flex flex-col font-mono selection:bg-[#6DD94B] selection:text-black">
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
                <span className="font-mono font-black text-xs sm:text-sm text-white uppercase tracking-wider">CONFIGURADOR CLÍNICAS // TECNODIEL</span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-[#0D844A]/20 border border-[#6DD94B]/40 text-[#6DD94B] font-bold">
                  PASO 0{activeSection} / 06
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline uppercase">
                {SECTIONS.find(s => s.id === activeSection)?.sub}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSection(7)}
              className="px-4 py-2 border border-white/20 bg-[#181818] hover:border-[#6DD94B] text-xs text-white font-mono uppercase tracking-wider flex items-center gap-2 transition cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#6DD94B]" />
              <span>Ver Web Directa</span>
            </button>
          </div>
        </header>
      ) : (
        /* Top Bar for Step 7 */
        <header className="h-16 border-b border-white/15 bg-[#121212]/95 backdrop-blur-2xl px-4 sm:px-6 flex items-center justify-between z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveSection(6)}
              className="px-3 py-1.5 border border-white/15 text-zinc-300 hover:text-white hover:bg-white/5 transition flex items-center gap-1.5 text-xs font-mono uppercase"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Volver a las Preguntas</span>
              <span className="sm:hidden">Volver</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-xs sm:text-sm text-white uppercase tracking-wider">VISTA PREVIA // WEB CLÍNICA</span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-[#0D844A]/20 border border-[#6DD94B]/40 text-[#6DD94B] font-bold">
                  PASO FINAL
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline uppercase">
                Toca cualquier texto o tratamiento en pantalla para retocarlo al instante
              </span>
            </div>
          </div>

          {/* Device Toggles & Launch Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1 p-1 bg-[#181818] border border-white/15 font-mono">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`px-2.5 py-1 transition text-xs font-mono uppercase flex items-center gap-1 cursor-pointer ${
                  previewDevice === 'desktop' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Escritorio</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('tablet')}
                className={`px-2.5 py-1 transition text-xs font-mono uppercase flex items-center gap-1 cursor-pointer ${
                  previewDevice === 'tablet' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Tablet</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`px-2.5 py-1 transition text-xs font-mono uppercase flex items-center gap-1 cursor-pointer ${
                  previewDevice === 'mobile' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
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
                className="px-3.5 py-2 border border-white/20 bg-[#181818] hover:border-[#6DD94B] text-xs font-mono uppercase tracking-wider text-zinc-200 transition hidden sm:flex items-center gap-1.5 cursor-pointer"
                title="Abrir portal de clientes"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#6DD94B]" />
                <span>Portal Clientes</span>
              </button>
            )}

            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="px-5 py-2 bg-[#6DD94B] hover:bg-[#38d600] text-black text-xs font-mono font-black uppercase tracking-wider transition flex items-center gap-2 shadow-[0_0_20px_rgba(109,217,75,0.4)] disabled:opacity-50 min-h-[40px] cursor-pointer shrink-0"
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
            <div className="p-4 bg-[#181818] border border-white/15 space-y-2.5 shadow-xl">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-zinc-400 uppercase text-[11px] font-semibold">// PROGRESO DEL FORMULARIO</span>
                <span className="font-mono text-[#6DD94B] font-bold">Paso {activeSection} de 6</span>
              </div>
              <div className="w-full bg-[#121212] h-1.5 overflow-hidden border border-white/10">
                <div 
                  className="bg-[#6DD94B] h-full transition-all duration-300 shadow-[0_0_10px_#6DD94B]"
                  style={{ width: `${(activeSection / 6) * 100}%` }}
                />
              </div>
            </div>

            {/* Step 1: Tu Centro Médico & Especialidad */}
            {activeSection === 1 && (
              <div className="p-6 sm:p-8 bg-[#181818] border border-white/15 space-y-6 shadow-2xl animate-fadeIn">
                <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-mono font-black uppercase text-white tracking-wider flex items-center gap-2">
                      <Stethoscope className="w-5 h-5 text-[#6DD94B]" />
                      <span>// PASO 01: SELECCIÓN DE PLANTILLA & DATOS DE LA CLÍNICA</span>
                    </h3>
                    <p className="text-xs font-mono text-zinc-400 mt-1 uppercase">
                      Elige primero la plantilla clínica para tu centro y completa sus datos para previsualizarlo en vivo.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-[#6DD94B] bg-[#0D844A]/20 border border-[#6DD94B]/40 px-2.5 py-1 shrink-0 uppercase font-bold">
                    6 PLANTILLAS AISLADAS
                  </span>
                </div>

                {/* ── SELECTOR PRINCIPAL DE LAS 6 PLANTILLAS DE CLÍNICAS ESTILO BANCH ── */}
                <div className="space-y-3 p-5 bg-[#121212] border border-white/10">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <span>🏥 CATÁLOGO CLÍNICAS & SALUD (6 PLANTILLAS EXCLUSIVAS)</span>
                    </label>
                    <span className="text-[10px] font-mono text-[#6DD94B] bg-[#0D844A]/20 border border-[#6DD94B]/40 px-2 py-0.5">
                      AISLAMIENTO TOTAL DOM & CSS ✓
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                    {TEMPLATES.slice(0, 6).map((tpl, idx) => {
                      const isSel = formData.template_id === tpl.id;
                      return (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => handleTemplateSelect(tpl)}
                          className={`p-3.5 border text-left transition-all duration-200 flex items-start gap-3 cursor-pointer relative overflow-hidden ${
                            isSel
                              ? 'bg-[#232323] border-[#6DD94B] text-white shadow-[0_0_20px_rgba(109,217,75,0.25)]'
                              : 'bg-[#181818] border-white/10 hover:border-white/30 text-zinc-300'
                          }`}
                        >
                          <div
                            className="w-9 h-9 shrink-0 mt-0.5 border flex items-center justify-center font-mono font-bold text-xs bg-black/60 border-[#6DD94B] text-[#6DD94B]"
                          >
                            0{idx + 1}
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-mono font-bold text-xs text-white uppercase truncate">{tpl.name}</span>
                              {isSel && (
                                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-[#6DD94B] text-black shrink-0 uppercase">
                                  ACTIVA
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-mono text-[#6DD94B] block uppercase">{tpl.badge}</span>
                            <p className="text-[11px] text-zinc-400 font-light line-clamp-2 leading-tight">{tpl.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
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
                        className="w-full bg-[#121212] border border-white/15 px-4 py-2.5 text-xs text-white font-mono focus:border-[#6DD94B] focus:outline-none transition-colors"
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
                        className="w-full bg-[#121212] border border-white/15 px-4 py-2.5 text-xs text-white font-mono focus:border-[#6DD94B] focus:outline-none transition-colors"
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
                      className="w-full bg-[#121212] border border-white/15 px-4 py-2.5 text-sm text-white font-mono font-bold focus:border-[#6DD94B] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="p-3 bg-[#121212] border border-white/10 text-xs font-mono flex items-center justify-between">
                    <span className="text-zinc-400">// DIRECCIÓN WEB:</span>
                    <span className="text-[#6DD94B] font-bold">https://{formData.slug || 'clinica'}.tecnodiel.app</span>
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
                            className={`p-3 border text-left transition flex items-center gap-2.5 cursor-pointer interactive-selectable ${
                              formData.category === cat.id
                                ? 'bg-[#232323] border-[#6DD94B] text-white font-bold shadow-[0_0_15px_rgba(109,217,75,0.25)]'
                                : 'bg-[#121212] border-white/10 text-zinc-300 hover:border-white/30'
                            }`}
                          >
                            <CategoryIcon className="w-5 h-5 text-[#6DD94B] shrink-0" />
                            <span className="text-xs font-mono uppercase">{cat.name}</span>
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
                      className="w-full bg-[#121212] border border-white/15 px-4 py-2 text-xs text-white font-mono focus:border-[#6DD94B] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Diseño & Portada */}
            {activeSection === 2 && (
              <div className="p-6 sm:p-8 bg-[#181818] border border-white/15 space-y-6 shadow-2xl animate-fadeIn">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-base sm:text-lg font-mono font-black uppercase text-white tracking-wider flex items-center gap-2">
                    <Layout className="w-5 h-5 text-[#6DD94B]" />
                    <span>// PASO 02: ESTILO VISUAL & FOTO DE PORTADA</span>
                  </h3>
                  <p className="text-xs font-mono text-zinc-400 mt-1 uppercase">
                    Elige la plantilla visual adecuada y la fotografía de tu gabinete o equipo médico.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <span>🏥 CATÁLOGO CLÍNICAS & SALUD (6 PLANTILLAS EXCLUSIVAS)</span>
                      </label>
                      <span className="text-[10px] font-mono text-[#6DD94B] bg-[#0D844A]/20 border border-[#6DD94B]/40 px-2 py-0.5">
                        AISLAMIENTO TOTAL DOM & CSS ✓
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3 max-h-[460px] overflow-y-auto pr-1">
                      {TEMPLATES.slice(0, 6).map((tpl, idx) => {
                        const isSel = formData.template_id === tpl.id;
                        return (
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
                            className={`w-full p-4 border text-left transition-all flex items-start gap-4 cursor-pointer relative overflow-hidden ${
                              isSel
                                ? 'bg-[#232323] border-[#6DD94B] text-white shadow-[0_0_25px_rgba(109,217,75,0.3)]'
                                : 'bg-[#121212] border-white/10 hover:border-white/30 text-zinc-300'
                            }`}
                          >
                            <div
                              className="w-10 h-10 shrink-0 mt-0.5 border flex items-center justify-center font-mono font-bold text-sm bg-black/60 border-[#6DD94B] text-[#6DD94B]"
                            >
                              0{idx + 1}
                            </div>
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-mono font-bold text-sm text-white uppercase">{tpl.name}</span>
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 border border-[#6DD94B]/40 bg-[#0D844A]/20 text-[#6DD94B] shrink-0 uppercase">
                                  {tpl.badge}
                                </span>
                              </div>
                              <p className="text-xs text-zinc-400 font-light leading-snug">{tpl.description}</p>
                              {tpl.tags && (
                                <div className="flex flex-wrap gap-1 pt-1">
                                  {tpl.tags.map((tg) => (
                                    <span key={tg} className="text-[9px] font-mono px-1.5 py-0.5 bg-black/50 text-zinc-400 border border-white/10 uppercase">
                                      {tg}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
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
                        className="flex-1 bg-[#121212] border border-white/15 px-4 py-2 text-xs text-white font-mono focus:border-[#6DD94B] focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                      {CLINIC_PHOTO_PRESETS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormData({ ...formData, hero_image: p.url })}
                          className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-mono uppercase shrink-0 cursor-pointer ${
                            formData.hero_image === p.url ? 'bg-[#232323] border-[#6DD94B] text-[#6DD94B] font-bold' : 'bg-[#121212] border-white/10 text-zinc-300 hover:border-white/30'
                          }`}
                        >
                          <img src={p.url} alt={p.label} className="w-5 h-5 object-cover" />
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
              <div className="p-6 sm:p-8 bg-[#181818] border border-white/15 space-y-6 shadow-2xl animate-fadeIn">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-base sm:text-lg font-mono font-black uppercase text-white tracking-wider flex items-center gap-2">
                    <Palette className="w-5 h-5 text-[#6DD94B]" />
                    <span>// PASO 03: COLORES SANITARIOS & TIPOGRAFÍA</span>
                  </h3>
                  <p className="text-xs font-mono text-zinc-400 mt-1 uppercase">
                    Selecciona una paleta equilibrada para proyectar higiene, confianza médica y profesionalismo.
                  </p>
                </div>

                <div className="space-y-5">
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
                          className={`p-3 border text-left transition flex items-center gap-2.5 cursor-pointer font-mono uppercase ${
                            formData.primary_color === pal.primary
                              ? 'bg-[#232323] border-[#6DD94B] text-white font-bold'
                              : 'bg-[#121212] border-white/10 text-zinc-300 hover:border-white/30'
                          }`}
                        >
                          <div className="w-4 h-4 border border-black/40 shrink-0" style={{ backgroundColor: pal.primary }} />
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
                          className={`p-3 border text-center transition text-xs font-mono uppercase cursor-pointer ${
                            formData.font_family === f ? 'bg-[#232323] border-[#6DD94B] text-[#6DD94B] font-bold' : 'bg-[#121212] border-white/10 text-zinc-300 hover:border-white/30'
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
              <div className="p-6 sm:p-8 bg-[#181818] border border-white/15 space-y-6 shadow-2xl animate-fadeIn">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-base sm:text-lg font-mono font-black uppercase text-white tracking-wider flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#6DD94B]" />
                    <span>// PASO 04: SISTEMA DE CITAS MÉDICAS & MUTUAS</span>
                  </h3>
                  <p className="text-xs font-mono text-zinc-400 mt-1 uppercase">
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
                      className="w-full bg-[#121212] border border-white/15 px-4 py-2.5 text-xs text-white font-mono font-bold focus:border-[#6DD94B] focus:outline-none"
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
                            className={`p-2.5 border text-left transition flex items-center justify-between text-xs font-mono uppercase cursor-pointer ${
                              isChecked
                                ? 'bg-[#232323] border-[#6DD94B] text-white font-bold'
                                : 'bg-[#121212] border-white/10 text-zinc-400 hover:border-white/30'
                            }`}
                          >
                            <span>{ins}</span>
                            {isChecked && <Check className="w-3.5 h-3.5 text-[#6DD94B]" />}
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
              <div className="p-6 sm:p-8 bg-[#181818] border border-white/15 space-y-6 shadow-2xl animate-fadeIn">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-base sm:text-lg font-mono font-black uppercase text-white tracking-wider flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#6DD94B]" />
                    <span>// PASO 05: HORARIOS DE CONSULTA & CUADRO DE TRATAMIENTOS</span>
                  </h3>
                  <p className="text-xs font-mono text-zinc-400 mt-1 uppercase">
                    Configura los turnos de atención y añade tus tratamientos estrella con sus precios.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase">Horario Mañanas</label>
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <input
                          type="text"
                          value={formData.lunch_shift.open}
                          onChange={e => setFormData({ ...formData, lunch_shift: { ...formData.lunch_shift, open: e.target.value } })}
                          className="w-full bg-[#121212] border border-white/15 px-2.5 py-1.5 text-xs text-white font-mono focus:border-[#6DD94B]"
                        />
                        <span>a</span>
                        <input
                          type="text"
                          value={formData.lunch_shift.close}
                          onChange={e => setFormData({ ...formData, lunch_shift: { ...formData.lunch_shift, close: e.target.value } })}
                          className="w-full bg-[#121212] border border-white/15 px-2.5 py-1.5 text-xs text-white font-mono focus:border-[#6DD94B]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase">Horario Tardes</label>
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <input
                          type="text"
                          value={formData.dinner_shift.open}
                          onChange={e => setFormData({ ...formData, dinner_shift: { ...formData.dinner_shift, open: e.target.value } })}
                          className="w-full bg-[#121212] border border-white/15 px-2.5 py-1.5 text-xs text-white font-mono focus:border-[#6DD94B]"
                        />
                        <span>a</span>
                        <input
                          type="text"
                          value={formData.dinner_shift.close}
                          onChange={e => setFormData({ ...formData, dinner_shift: { ...formData.dinner_shift, close: e.target.value } })}
                          className="w-full bg-[#121212] border border-white/15 px-2.5 py-1.5 text-xs text-white font-mono focus:border-[#6DD94B]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono font-semibold text-zinc-300 uppercase">
                        Tratamientos del Centro
                      </label>
                      <span className="text-[11px] text-[#6DD94B] font-mono uppercase">
                        {(formData.menu_categories || []).flatMap(c => c.items || []).length} tratamientos cargados
                      </span>
                    </div>

                    <div className="p-4 bg-[#121212] border border-white/10 space-y-3">
                      {(formData.menu_categories || []).map((cat, cIdx) => (
                        <div key={cIdx} className="space-y-1.5">
                          <span className="text-xs font-bold text-white font-mono uppercase">{cat.category}:</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
                            {(cat.items || []).map((it, iIdx) => (
                              <div key={iIdx} className="p-2.5 bg-black/50 border border-white/10 flex justify-between text-xs font-mono">
                                <span className="text-zinc-200">{it.name}</span>
                                <span className="text-[#6DD94B] font-bold">{it.price}</span>
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
              <div className="p-6 sm:p-8 bg-[#181818] border border-white/15 space-y-6 shadow-2xl animate-fadeIn">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-base sm:text-lg font-mono font-black uppercase text-white tracking-wider flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#6DD94B]" />
                    <span>// PASO 06: CONTACTO, UBICACIÓN & MÓDULOS PRO</span>
                  </h3>
                  <p className="text-xs font-mono text-zinc-400 mt-1 uppercase">
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
                        className="w-full bg-[#121212] border border-white/15 px-3 py-2 text-xs text-white font-mono focus:border-[#6DD94B]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase">WhatsApp de Citas</label>
                      <input
                        type="text"
                        value={formData.whatsapp_number}
                        onChange={e => setFormData({ ...formData, whatsapp_number: e.target.value })}
                        className="w-full bg-[#121212] border border-white/15 px-3 py-2 text-xs text-white font-mono focus:border-[#6DD94B]"
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
                        className="w-full bg-[#121212] border border-white/15 px-3 py-2 text-xs text-white font-mono focus:border-[#6DD94B]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase">Ciudad</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-[#121212] border border-white/15 px-3 py-2 text-xs text-white font-mono focus:border-[#6DD94B]"
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
                        className="w-full bg-[#121212] border border-white/15 px-3 py-2 text-xs text-white font-mono focus:border-[#6DD94B]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase">Nº Colegiado / Registro Sanitario</label>
                      <input
                        type="text"
                        value={formData.collegiate_number}
                        onChange={e => setFormData({ ...formData, collegiate_number: e.target.value })}
                        placeholder="Col. 21/0482 o NICA 48192"
                        className="w-full bg-[#121212] border border-white/15 px-3 py-2 text-xs text-white font-mono focus:border-[#6DD94B]"
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
                            className={`p-3 border text-left transition flex items-start justify-between cursor-pointer ${
                              isChecked
                                ? 'bg-[#232323] border-[#6DD94B] text-white'
                                : 'bg-[#121212] border-white/10 text-zinc-400 hover:border-white/20'
                            }`}
                          >
                            <div className="space-y-0.5 pr-2">
                              <span className="text-xs font-bold text-white block font-mono uppercase">{mod.name}</span>
                              <span className="text-[11px] text-zinc-400 block font-light">{mod.description}</span>
                            </div>
                            <span className="text-xs font-mono text-[#6DD94B] font-bold shrink-0">+{mod.price}€/m</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Navigation Pills (Estilo Banch) */}
            <div className="flex items-center justify-between pt-6 border-t border-white/15">
              <button
                type="button"
                disabled={activeSection === 1}
                onClick={() => setActiveSection(prev => Math.max(1, prev - 1))}
                className="px-5 py-2.5 border border-white/15 bg-[#121212] hover:border-white text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-white disabled:opacity-25 transition-all flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Paso Anterior</span>
              </button>

              {/* Indicador de píldoras centrales Banch */}
              <div className="hidden sm:flex items-center gap-1.5 p-1 bg-[#121212] border border-white/15">
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setActiveSection(num)}
                    className={`w-8 h-8 text-xs font-mono font-bold transition-all flex items-center justify-center cursor-pointer ${
                      activeSection === num
                        ? 'bg-[#6DD94B] text-black shadow-[0_0_12px_rgba(109,217,75,0.4)]'
                        : activeSection > num
                        ? 'bg-[#181818] text-[#6DD94B] border border-[#6DD94B]/30'
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
                className="px-6 py-2.5 bg-[#6DD94B] hover:bg-[#38d600] text-black text-xs font-mono font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(109,217,75,0.35)]"
              >
                <span>{activeSection === 6 ? 'Ver Esqueleto Clínico' : 'Siguiente Paso'}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
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
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] bg-[#0D844A]/20 text-[#6DD94B] border border-[#6DD94B]/30 font-mono uppercase">
                    <Edit3 className="w-3.5 h-3.5 text-[#6DD94B]" />
                    <span>Pulsa cualquier cuadro para ajustar colores o tipografía</span>
                  </span>
                </div>
                <div className="flex items-center gap-1 p-1 bg-[#181818] border border-white/15">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`px-2.5 py-1 transition text-xs font-mono uppercase flex items-center gap-1.5 cursor-pointer ${previewDevice === 'desktop' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
                    title="Vista de Ordenador"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Escritorio</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`px-2.5 py-1 transition text-xs font-mono uppercase flex items-center gap-1.5 cursor-pointer ${previewDevice === 'mobile' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
                    title="Vista de Móvil"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Móvil</span>
                  </button>
                </div>
              </div>

              {/* Toast Feedback */}
              {tweakNotice && (
                <div className="px-4 py-2 bg-[#181818] border border-[#6DD94B]/50 text-[#6DD94B] font-mono text-xs shadow-xl animate-fadeIn uppercase">
                  {tweakNotice}
                </div>
              )}

              {/* Header explicativo del Esqueleto Clínico */}
              <div className="p-4 sm:p-5 bg-[#181818] border border-white/15 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 w-full max-w-6xl">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#6DD94B] animate-pulse" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#6DD94B]">
                      Esqueleto Visual Médico (4 Cuadros Interactivos)
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-white font-mono uppercase">
                    Verifica la estética de tu centro médico antes de activar el portal
                  </h2>
                  <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl font-light">
                    Estos 4 cuadros estáticos te permiten probar tipografías, colores de confianza médica y estructura. Tus datos clínicos reales se cargarán desde administración en tu portal de cliente con Google OAuth.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 p-1 bg-[#121212] border border-white/15 shrink-0">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`px-3 py-1.5 text-xs font-mono uppercase transition flex items-center gap-1.5 cursor-pointer ${
                      previewDevice === 'desktop' ? 'bg-white text-black font-bold shadow' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Escritorio</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`px-3 py-1.5 text-xs font-mono uppercase transition flex items-center gap-1.5 cursor-pointer ${
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
                  onClick={() => {
                    setSelectedElement({ type: 'treatments', label: 'Especialidades & Cuadro Médico' });
                    setIsInspectorOpen(true);
                    showTweakNotice('Editando: Especialidades & Tratamientos');
                  }}
                  className="p-5 border transition-all duration-300 shadow-xl relative overflow-hidden flex flex-col justify-between cursor-pointer hover:border-[#6DD94B] group"
                  style={{
                    backgroundColor: formData.surface_color || '#181818',
                    borderColor: `${formData.primary_color}40`,
                    fontFamily: formData.font_family || 'Inter, sans-serif'
                  }}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: `${formData.primary_color}25` }}>
                      <div className="flex items-center gap-2">
                        <span className="p-2 bg-black/60 border border-white/10">
                          <Activity className="w-4 h-4" style={{ color: formData.primary_color }} />
                        </span>
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider block text-zinc-400">
                            Cuadro 1 // Esqueleto Cuadro Médico
                          </span>
                          <h4 className="text-sm font-bold text-white uppercase font-mono">Especialidades & Tratamientos</h4>
                        </div>
                      </div>
                      <span
                        className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase border border-[#6DD94B]/30"
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
                          className="p-3 bg-black/50 border border-white/5 flex items-center justify-between gap-3"
                        >
                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white truncate font-mono uppercase">{item.name}</span>
                              <span
                                className="text-[9px] font-mono uppercase px-1.5 py-0.2 border"
                                style={{ backgroundColor: `${formData.primary_color}30`, borderColor: `${formData.primary_color}50`, color: formData.primary_color }}
                              >
                                {item.badge}
                              </span>
                            </div>
                            <p className="text-[10px] text-zinc-400 font-light truncate">{item.desc}</p>
                          </div>
                          <span className="text-xs font-mono font-bold text-[#6DD94B] shrink-0">
                            {item.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t flex items-center justify-between text-[11px] font-mono text-zinc-400" style={{ borderColor: `${formData.primary_color}20` }}>
                    <span>Tipografía: <strong className="text-white font-mono">{formData.font_family}</strong></span>
                    <span className="flex items-center gap-1 font-mono text-[#6DD94B]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Catálogo Homologado
                    </span>
                  </div>
                </div>

                {/* CUADRO 2: LANDING PAGE MÉDICA & HERO */}
                <div
                  onClick={() => {
                    setSelectedElement({ type: 'hero', label: 'Portada Médica & Prestigio' });
                    setIsInspectorOpen(true);
                    showTweakNotice('Editando: Portada Médica & Prestigio');
                  }}
                  className="p-5 border border-white/15 bg-[#181818] transition-all duration-300 relative overflow-hidden flex flex-col justify-between cursor-pointer hover:border-[#6DD94B] group"
                  style={{
                    backgroundColor: formData.background_color || '#181818',
                    fontFamily: formData.font_family || 'monospace'
                  }}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="p-2 bg-[#121212] border border-white/15">
                          <Globe className="w-4 h-4 text-[#6DD94B]" />
                        </span>
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider block text-white/50">
                            CUADRO 02 // PORTADA MÉDICA
                          </span>
                          <h4 className="text-sm font-bold text-white uppercase font-mono">Portada Médica & Prestigio</h4>
                        </div>
                      </div>
                      <span
                        className="px-2.5 py-0.5 border border-[#6DD94B]/30 bg-[#6DD94B]/10 text-[10px] font-mono font-bold uppercase text-[#6DD94B]"
                      >
                        RGPD & SANIDAD
                      </span>
                    </div>

                    <div className="relative border border-white/15 bg-[#121212] p-4 space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-mono text-white/50 pb-2 border-b border-white/10">
                        <span className="font-bold text-white uppercase">{formData.name}</span>
                        <div className="flex gap-2">
                          <span>ESPECIALIDADES</span>
                          <span>EQUIPO</span>
                          <span className="text-[#6DD94B]">CITA ONLINE</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 py-2">
                        <span
                          className="text-[10px] font-mono font-semibold px-2 py-0.5 border border-[#6DD94B]/30 bg-[#6DD94B]/10 text-[#6DD94B] inline-block"
                        >
                          {formData.slogan || 'Cuidado de vanguardia y cercanía para tu salud'}
                        </span>
                        <h3 className="text-base font-bold text-white leading-tight font-mono uppercase">
                          Excelencia médica y tecnología diagnóstica
                        </h3>
                        <p className="text-[11px] text-white/60 font-mono line-clamp-2">
                          {formData.description || 'Instalaciones sanitarias de última generación con equipo clínico colegiado.'}
                        </p>
                      </div>

                      <div className="pt-2">
                        <button
                          type="button"
                          className="px-4 py-2 border border-[#6DD94B] bg-[#6DD94B] text-black text-xs font-mono font-bold uppercase transition flex items-center gap-1.5 hover:bg-white hover:border-white"
                        >
                          <span>{formData.cta_text || 'Pedir Cita Online 24/7'}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/50">
                    <span>Disposición: <strong className="text-white font-mono">{formData.hero_layout}</strong></span>
                    <span className="flex items-center gap-1 font-mono text-[#6DD94B]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Colegiado: {formData.collegiate_number || 'Oficial'}
                    </span>
                  </div>
                </div>

                {/* CUADRO 3: SISTEMA DE CITA PREVIA & MUTUAS */}
                <div
                  onClick={() => {
                    setSelectedElement({ type: 'reservations', label: 'Cita Previa Automatizada' });
                    setIsInspectorOpen(true);
                    showTweakNotice('Editando: Cita Previa Automatizada');
                  }}
                  className="p-5 border border-white/15 bg-[#181818] transition-all duration-300 relative overflow-hidden flex flex-col justify-between cursor-pointer hover:border-[#6DD94B] group"
                  style={{
                    backgroundColor: formData.surface_color || '#181818',
                    fontFamily: formData.font_family || 'monospace'
                  }}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="p-2 bg-[#121212] border border-white/15">
                          <Calendar className="w-4 h-4 text-[#6DD94B]" />
                        </span>
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider block text-white/50">
                            CUADRO 03 // CITAS & MUTUAS
                          </span>
                          <h4 className="text-sm font-bold text-white uppercase font-mono">Cita Previa Automatizada</h4>
                        </div>
                      </div>
                      <span
                        className="px-2.5 py-0.5 border border-[#6DD94B]/30 bg-[#6DD94B]/10 text-[10px] font-mono font-bold uppercase text-[#6DD94B]"
                      >
                        24H / 7D
                      </span>
                    </div>

                    <div className="p-3.5 border border-white/15 bg-[#121212] space-y-3 font-mono">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 bg-[#181818] border border-white/10 space-y-0.5">
                          <span className="text-[10px] text-white/50 font-mono">MUTUA O PRIVADO</span>
                          <div className="text-white font-bold truncate">Adeslas / Sanitas / Privado</div>
                        </div>
                        <div className="p-2 bg-[#181818] border border-white/10 space-y-0.5">
                          <span className="text-[10px] text-white/50 font-mono">PRIMER HUECO</span>
                          <div className="text-[#6DD94B] font-bold">Mañana, 10:15h</div>
                        </div>
                      </div>

                      <div className="p-2.5 border border-white/15 bg-[#181818] text-[11px] text-white/80 flex items-center justify-between">
                        <span className="text-white/50 font-mono">WhatsApp Clínico Directo:</span>
                        <span className="font-mono font-bold text-[#6DD94B]">{formData.whatsapp_number}</span>
                      </div>

                      <button
                        type="button"
                        className="w-full py-2.5 border border-[#6DD94B] bg-[#6DD94B] text-black text-xs font-mono font-bold uppercase transition flex items-center justify-center gap-2 hover:bg-white hover:border-white"
                      >
                        <span>Reservar Cita en Calendario</span>
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/50">
                    <span>Recordatorios: <strong className="text-white font-mono">SMS / WhatsApp</strong></span>
                    <span className="flex items-center gap-1 font-mono text-[#6DD94B]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 0% Ausencias
                    </span>
                  </div>
                </div>

                {/* CUADRO 4: FICHA PACIENTE & PORTAL CLÍNICO */}
                <div
                  onClick={() => {
                    setSelectedElement({ type: 'portal', label: 'Portal de Gestión & Pacientes' });
                    setIsInspectorOpen(true);
                    showTweakNotice('Portal de Paciente: Gestión con Google OAuth');
                  }}
                  className="p-5 border border-white/15 bg-[#181818] transition-all duration-300 relative overflow-hidden flex flex-col justify-between cursor-pointer hover:border-[#6DD94B] group"
                  style={{
                    backgroundColor: formData.background_color || '#181818',
                    fontFamily: 'monospace'
                  }}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="p-2 bg-[#121212] border border-white/15">
                          <ShieldCheck className="w-4 h-4 text-[#6DD94B]" />
                        </span>
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider block text-white/50">
                            CUADRO 04 // PORTAL MÉDICO
                          </span>
                          <h4 className="text-sm font-bold text-white uppercase font-mono">Portal de Gestión & Pacientes</h4>
                        </div>
                      </div>
                      <span
                        className="px-2.5 py-0.5 border border-[#6DD94B]/30 bg-[#6DD94B]/10 text-[10px] font-mono font-bold uppercase text-[#6DD94B]"
                      >
                        GOOGLE OAUTH
                      </span>
                    </div>

                    <div className="space-y-2.5 font-mono">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 bg-[#121212] border border-white/15">
                          <span className="text-[10px] text-white/50 font-mono block">CITAS DE HOY</span>
                          <span className="text-xl font-bold text-white font-mono">18 Pacientes</span>
                          <span className="text-[10px] text-[#6DD94B] block pt-0.5">Sincronizado 100%</span>
                        </div>
                        <div className="p-3 bg-[#121212] border border-white/15">
                          <span className="text-[10px] text-white/50 font-mono block">CONSULTAS ONLINE</span>
                          <span className="text-xl font-bold text-[#6DD94B] font-mono">42</span>
                          <span className="text-[10px] text-white/50 block pt-0.5">Pacientes activos</span>
                        </div>
                      </div>

                      <div className="p-3 bg-[#121212] border border-white/10 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-[#6DD94B]" />
                          <span className="text-white/80 font-mono">Cuadro Médico & Horarios</span>
                        </div>
                        <span className="font-mono text-[#6DD94B] text-[11px]">En Línea</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/50">
                    <span>Acceso Titular: <strong className="text-white font-mono">{formData.email}</strong></span>
                    <span className="flex items-center gap-1 font-mono text-[#6DD94B]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Portal Clínico Listo
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Final Action: SlideCommit Button */}
              <div className="w-full max-w-2xl p-6 border border-white/15 bg-[#181818] flex flex-col items-center text-center space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#6DD94B] font-bold">
                    // FINALIZAR Y ENVIAR RESPUESTAS
                  </span>
                  <h3 className="text-lg font-bold text-white font-mono uppercase">
                    Desliza para enviar tu configuración al equipo de TecnOdiel
                  </h3>
                  <p className="text-xs text-white/60 max-w-md font-mono">
                    Guardaremos tu solicitud médica para que los administradores generen tu web definitiva con la plantilla acordada. Podrás acceder a tu portal con tu cuenta de Google.
                  </p>
                </div>

                <div className="w-full flex justify-center pt-2">
                  <SlideCommit
                    label="Desliza para enviar y crear tu cuenta médica"
                    doneLabel="¡Enviado con Éxito!"
                    width={340}
                    handleColor="#6DD94B"
                    successColor="#6DD94B"
                    onDone={handleSave}
                  />
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-white/50 pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveSection(6)}
                    className="hover:text-white transition underline cursor-pointer"
                  >
                    ← Volver a editar respuestas
                  </button>
                  <span>•</span>
                  <span className="text-[#6DD94B]">Garantía TecnOdiel 100% a Medida</span>
                </div>
              </div>
            </div>
          </div>

          {/* Inspector Panel on Right */}
          {isInspectorOpen && (
            <aside className="w-80 sm:w-96 border-l border-white/15 bg-[#121212] p-4 sm:p-5 flex flex-col justify-between overflow-y-auto z-20 shrink-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/15 pb-3">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#6DD94B]" />
                    <span className="font-mono font-bold text-xs uppercase tracking-wider text-white">Inspector Visual</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsInspectorOpen(false)}
                    className="p-1 hover:bg-white/10 text-white/50 hover:text-white transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Switch Tabs */}
                <div className="grid grid-cols-4 gap-1 p-1 bg-[#181818] border border-white/15 text-[11px] font-mono">
                  <button
                    type="button"
                    onClick={() => setSelectedElement({ type: 'background', label: 'Fondo & Colores' })}
                    className={`py-1.5 px-1 text-center transition cursor-pointer truncate ${
                      selectedElement?.type === 'background' || selectedElement?.type === 'colors'
                        ? 'bg-[#6DD94B] text-black font-bold'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Fondo
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedElement({ type: 'hero_image', label: 'Portada & Layout' })}
                    className={`py-1.5 px-1 text-center transition cursor-pointer truncate ${
                      selectedElement?.type === 'hero_image' || selectedElement?.type === 'hero_layout'
                        ? 'bg-[#6DD94B] text-black font-bold'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Portada
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedElement({ type: 'title', label: 'Nombre & Lema' })}
                    className={`py-1.5 px-1 text-center transition cursor-pointer truncate ${
                      selectedElement?.type === 'title' || selectedElement?.type === 'slogan'
                        ? 'bg-[#6DD94B] text-black font-bold'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Texto
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedElement({ type: 'cta_button', label: 'Botón de Cita' })}
                    className={`py-1.5 px-1 text-center transition cursor-pointer truncate ${
                      selectedElement?.type === 'cta_button'
                        ? 'bg-[#6DD94B] text-black font-bold'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Botón
                  </button>
                </div>

                <div className="p-2.5 border border-white/15 bg-[#181818] text-xs flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#6DD94B] uppercase font-semibold">Tocado en pantalla:</span>
                  <div className="font-mono font-bold text-white text-xs truncate max-w-[180px]">{selectedElement?.label || selectedElement?.title || 'General'}</div>
                </div>

                {/* 1. BACKGROUND & COLORS INSPECTOR */}
                {(selectedElement?.type === 'background' || selectedElement?.type === 'colors' || selectedElement?.type === 'theme') && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-white/50 uppercase font-semibold flex items-center justify-between">
                        <span>Color de Fondo de la Web</span>
                        <span className="text-[#6DD94B] font-mono text-[10px]">{formData.background_color}</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.background_color || '#121212'}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, background_color: e.target.value }));
                            showTweakNotice('Color de fondo actualizado');
                          }}
                          className="w-10 h-9 bg-transparent border border-white/20 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.background_color || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, background_color: e.target.value }))}
                          placeholder="#121212"
                          className="flex-1 bg-[#181818] border border-white/15 px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#6DD94B]"
                        />
                      </div>

                      {/* Quick Swatches */}
                      <div className="grid grid-cols-4 gap-1.5 pt-1">
                        {[
                          { label: 'Grafito', hex: '#121212' },
                          { label: 'Gris Banch', hex: '#181818' },
                          { label: 'Negro Puro', hex: '#000000' },
                          { label: 'Verde Banch', hex: '#0D844A' },
                          { label: 'Blanco', hex: '#FFFFFF' },
                          { label: 'Carbón', hex: '#232323' },
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
                            className={`p-1.5 border text-left text-[10px] font-mono transition flex items-center gap-1.5 cursor-pointer ${
                              formData.background_color === sw.hex ? 'border-[#6DD94B] bg-[#6DD94B]/20 text-white font-bold' : 'border-white/15 bg-[#181818] text-white/50'
                            }`}
                          >
                            <span className="w-2.5 h-2.5 border border-white/20 shrink-0" style={{ backgroundColor: sw.hex }} />
                            <span className="truncate">{sw.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-white/15">
                      <label className="text-[11px] font-mono text-white/50 uppercase font-semibold flex items-center justify-between">
                        <span>Color de Tarjetas / Superficie</span>
                        <span className="text-[#6DD94B] font-mono text-[10px]">{formData.surface_color}</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.surface_color || '#181818'}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, surface_color: e.target.value }));
                            showTweakNotice('Superficie actualizada');
                          }}
                          className="w-10 h-9 bg-transparent border border-white/20 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.surface_color || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, surface_color: e.target.value }))}
                          placeholder="#181818"
                          className="flex-1 bg-[#181818] border border-white/15 px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#6DD94B]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-white/15">
                      <label className="text-[11px] font-mono text-white/50 uppercase font-semibold flex items-center justify-between">
                        <span>Color Principal de Acento</span>
                        <span className="text-[#6DD94B] font-mono text-[10px]">{formData.primary_color}</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.primary_color || '#6DD94B'}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, primary_color: e.target.value }));
                            showTweakNotice('Color principal actualizado');
                          }}
                          className="w-10 h-9 bg-transparent border border-white/20 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.primary_color || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
                          placeholder="#6DD94B"
                          className="flex-1 bg-[#181818] border border-white/15 px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#6DD94B]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. TYPOGRAPHY */}
                {selectedElement?.type === 'title' && (
                  <div className="space-y-3 font-mono">
                    <label className="text-[11px] font-mono text-white/50 uppercase font-semibold block">Tipografía Médica</label>
                    <div className="space-y-1.5">
                      {[
                        { label: 'Monospace Banch (Técnica)', value: 'monospace' },
                        { label: 'Inter (Clara & Moderna)', value: 'Inter, sans-serif' },
                        { label: 'Plus Jakarta Sans (Moderna)', value: 'Plus Jakarta Sans, sans-serif' },
                        { label: 'Playfair Display (Elegante & Exclusiva)', value: 'Playfair Display, serif' }
                      ].map(font => (
                        <button
                          key={font.value}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, font_family: font.value }));
                            showTweakNotice(`Fuente: ${font.label}`);
                          }}
                          className={`w-full p-2.5 border text-left text-xs transition cursor-pointer flex items-center justify-between ${
                            formData.font_family === font.value
                              ? 'border-[#6DD94B] bg-[#6DD94B] text-black font-bold'
                              : 'border-white/15 bg-[#181818] text-white/60 hover:text-white'
                          }`}
                          style={{ fontFamily: font.value }}
                        >
                          <span>{font.label}</span>
                          {formData.font_family === font.value && <Check className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-white/15">
                      <label className="text-[11px] font-mono text-white/50 uppercase font-semibold">Lema / Slogan</label>
                      <input
                        type="text"
                        value={formData.slogan || ''}
                        onChange={e => setFormData({ ...formData, slogan: e.target.value })}
                        className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#6DD94B]"
                      />
                    </div>
                  </div>
                )}

                {/* 3. CTA BUTTON */}
                {selectedElement?.type === 'cta_button' && (
                  <div className="space-y-3 font-mono">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-white/50 uppercase font-semibold">Texto del Botón de Cita</label>
                      <input
                        type="text"
                        value={formData.cta_text || 'Pedir Cita Online'}
                        onChange={e => setFormData({ ...formData, cta_text: e.target.value })}
                        className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#6DD94B]"
                      />
                    </div>
                  </div>
                )}

                {/* 4. HERO LAYOUT */}
                {(selectedElement?.type === 'hero_image' || selectedElement?.type === 'hero_layout') && (
                  <div className="space-y-3 font-mono">
                    <label className="text-[11px] font-mono text-white/50 uppercase font-semibold block">Disposición del Hero</label>
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
                          className={`p-2.5 border text-center text-xs transition cursor-pointer font-mono ${
                            formData.hero_layout === layout.value
                              ? 'border-[#6DD94B] bg-[#6DD94B] text-black font-bold'
                              : 'border-white/15 bg-[#181818] text-white/60 hover:text-white'
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
              <div className="pt-4 border-t border-white/15 space-y-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSave}
                  className="w-full py-3 bg-[#6DD94B] text-black font-mono font-bold text-xs uppercase transition flex items-center justify-center gap-2 hover:bg-white disabled:opacity-50 cursor-pointer"
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
