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
  Users
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
import confetti from 'canvas-confetti';

export default function ClinicWizard({ onCreated, onCancel }) {
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

    phone: '+34 959 28 30 40',
    whatsapp_number: '+34611223344',
    email: 'citas@dentalsonrisas.es',
    address: 'Avenida Martín Alonso Pinzón, 14',
    city: 'Huelva',
    postal_code: '21003',
    google_maps_url: 'https://maps.google.com',

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
                            className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
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
                          className={`p-3.5 rounded-xl border text-left transition space-y-1.5 cursor-pointer ${
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
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs shrink-0 cursor-pointer ${
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
                          className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
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
                          className={`p-3 rounded-xl border text-center transition text-xs cursor-pointer ${
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
                            className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between text-xs cursor-pointer ${
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

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-2">
              {activeSection > 1 ? (
                <button
                  type="button"
                  onClick={() => setActiveSection(prev => prev - 1)}
                  className="px-4 py-2.5 rounded-xl border border-white/15 bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>
              ) : <div />}

              {activeSection < 6 ? (
                <button
                  type="button"
                  onClick={() => setActiveSection(prev => prev + 1)}
                  className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg"
                >
                  <span>Siguiente Paso</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveSection(7)}
                  className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs flex items-center gap-2 transition cursor-pointer shadow-[0_0_25px_rgba(6,182,212,0.4)]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ver Mi Web Lista en Directo</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* STEP 7: Interactive Live Preview & Touch-to-Edit Engine */
        <div className="flex-1 flex flex-col overflow-hidden bg-[#030712]">
          {/* Hidden File & Camera Inputs */}
          <input
            type="file"
            ref={heroGalleryInputRef}
            accept="image/*"
            onChange={handleHeroImageUpload}
            className="hidden"
          />
          <input
            type="file"
            ref={heroCameraInputRef}
            accept="image/*"
            capture="environment"
            onChange={handleHeroImageUpload}
            className="hidden"
          />
          <input
            type="file"
            ref={treatmentGalleryInputRef}
            accept="image/*"
            onChange={handleTreatmentImageUpload}
            className="hidden"
          />
          <input
            type="file"
            ref={treatmentCameraInputRef}
            accept="image/*"
            capture="environment"
            onChange={handleTreatmentImageUpload}
            className="hidden"
          />

          {/* Clean "Pulsa lo que quieras cambiar" Bar */}
          <div className="border-b border-white/10 bg-zinc-950/95 backdrop-blur-xl px-3 sm:px-6 py-2.5 z-20 shrink-0 shadow-lg">
            <div className="max-w-6xl mx-auto flex flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 font-sans">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Pulsa lo que quieras cambiar en tu web</span>
                  </span>
                  <span className="text-[11px] text-zinc-400 font-sans hidden md:inline">
                    (Toca cualquier elemento en la pantalla o usa estos accesos rápidos)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {tweakNotice && (
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[11px] font-medium flex items-center gap-1 animate-fadeIn">
                      <Check className="w-3 h-3 text-cyan-400" />
                      <span>{tweakNotice}</span>
                    </span>
                  )}
                  <a
                    href={`/#/c/${formData.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded-lg border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                    title="Abrir web clínica en pestaña completa"
                  >
                    <ExternalLink className="w-3 h-3 text-cyan-400" />
                    <span className="hidden sm:inline">Abrir Web</span>
                  </a>
                </div>
              </div>

              {/* Quick-Access Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                <button
                  type="button"
                  onClick={() => handleSelectElement({ type: 'background', label: 'Fondo y Colores de la Clínica' })}
                  className={`px-3 py-1.5 rounded-lg border transition shrink-0 flex items-center gap-1.5 cursor-pointer text-xs ${
                    (selectedElement?.type === 'background' || selectedElement?.type === 'colors' || selectedElement?.type === 'theme')
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold'
                      : 'bg-zinc-900/90 border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Fondo y Colores</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectElement({ type: 'hero_image', label: 'Foto de Portada' })}
                  className={`px-3 py-1.5 rounded-lg border transition shrink-0 flex items-center gap-1.5 cursor-pointer text-xs ${
                    selectedElement?.type === 'hero_image'
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold'
                      : 'bg-zinc-900/90 border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Foto de Portada</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectElement({ type: 'hero_layout', label: 'Lado y Disposición de Portada' })}
                  className={`px-3 py-1.5 rounded-lg border transition shrink-0 flex items-center gap-1.5 cursor-pointer text-xs ${
                    selectedElement?.type === 'hero_layout'
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold'
                      : 'bg-zinc-900/90 border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Cambiar Lado</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectElement({ type: 'hero_size', label: 'Tamaño de Foto de Portada' })}
                  className={`px-3 py-1.5 rounded-lg border transition shrink-0 flex items-center gap-1.5 cursor-pointer text-xs ${
                    selectedElement?.type === 'hero_size'
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold'
                      : 'bg-zinc-900/90 border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tamaño Foto</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectElement({ type: 'title', label: 'Nombre de la Clínica' })}
                  className={`px-3 py-1.5 rounded-lg border transition shrink-0 flex items-center gap-1.5 cursor-pointer text-xs ${
                    selectedElement?.type === 'title'
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold'
                      : 'bg-zinc-900/90 border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <Type className="w-3.5 h-3.5 text-purple-400" />
                  <span>Nombre Clínica</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectElement({ type: 'slogan', label: 'Especialidad & Lema' })}
                  className={`px-3 py-1.5 rounded-lg border transition shrink-0 flex items-center gap-1.5 cursor-pointer text-xs ${
                    selectedElement?.type === 'slogan'
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold'
                      : 'bg-zinc-900/90 border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5 text-pink-400" />
                  <span>Lema & Filosofía</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectElement({ type: 'cta_button', label: 'Botón de Cita Online' })}
                  className={`px-3 py-1.5 rounded-lg border transition shrink-0 flex items-center gap-1.5 cursor-pointer text-xs ${
                    selectedElement?.type === 'cta_button'
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold'
                      : 'bg-zinc-900/90 border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-rose-400" />
                  <span>Botón de Cita</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const firstItem = formData.menu_categories?.[0]?.items?.[0] || { name: 'Consulta Médica', price: '45€' };
                    handleSelectElement({
                      type: 'treatment_item',
                      label: firstItem.name || 'Tratamiento Clínico',
                      data: { categoryIndex: 0, itemIndex: 0, item: firstItem }
                    });
                  }}
                  className={`px-3 py-1.5 rounded-lg border transition shrink-0 flex items-center gap-1.5 cursor-pointer text-xs ${
                    selectedElement?.type === 'treatment_item'
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold'
                      : 'bg-zinc-900/90 border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5 text-orange-400" />
                  <span>Tratamientos & Fotos</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectElement({ type: 'theme', label: 'Estilo Visual & Colores' })}
                  className={`px-3 py-1.5 rounded-lg border transition shrink-0 flex items-center gap-1.5 cursor-pointer text-xs ${
                    selectedElement?.type === 'theme'
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold'
                      : 'bg-zinc-900/90 border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5 text-blue-400" />
                  <span>Estilo & Colores</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectElement({ type: 'contact', label: 'Contacto & Horarios' })}
                  className={`px-3 py-1.5 rounded-lg border transition shrink-0 flex items-center gap-1.5 cursor-pointer text-xs ${
                    selectedElement?.type === 'contact'
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold'
                      : 'bg-zinc-900/90 border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  <span>Contacto & Horarios</span>
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic Contextual Inspector */}
          {isInspectorOpen && selectedElement && (
            <div className="border-b border-white/15 bg-zinc-950/98 backdrop-blur-2xl px-3 sm:px-6 py-3.5 z-30 shadow-2xl animate-fadeIn">
              <div className="max-w-6xl mx-auto space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
                      <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Modificando: {selectedElement.label || selectedElement.type}</span>
                    </span>
                    <span className="text-[11px] text-zinc-400 hidden sm:inline font-sans">
                      — Se actualiza al instante en la pantalla
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsInspectorOpen(false)}
                    className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                    title="Cerrar panel de edición"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Inspector Body based on element type */}
                {(selectedElement.type === 'hero_image' || selectedElement.type === 'hero_layout' || selectedElement.type === 'hero_size') && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      {/* Side Swap */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-zinc-400 font-semibold uppercase">
                          ↔️ Posición de la Imagen (Lado)
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, hero_image_side: 'left', hero_layout: 'split' }));
                              showTweakNotice('Imagen colocada a la izquierda');
                            }}
                            className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                              formData.hero_image_side === 'left' && formData.hero_layout === 'split'
                                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold shadow-sm'
                                : 'bg-zinc-900 border-white/10 text-zinc-300 hover:bg-zinc-800'
                            }`}
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                            <span>A la Izquierda</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, hero_image_side: 'right', hero_layout: 'split' }));
                              showTweakNotice('Imagen colocada a la derecha');
                            }}
                            className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                              formData.hero_image_side === 'right' && formData.hero_layout === 'split'
                                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold shadow-sm'
                                : 'bg-zinc-900 border-white/10 text-zinc-300 hover:bg-zinc-800'
                            }`}
                          >
                            <span>A la Derecha</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Image Size */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-zinc-400 font-semibold uppercase flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Tamaño / Altura de Foto</span>
                        </label>
                        <div className="grid grid-cols-4 gap-1">
                          {[
                            { id: 'sm', label: 'S' },
                            { id: 'md', label: 'M' },
                            { id: 'lg', label: 'L' },
                            { id: 'xl', label: 'XL' }
                          ].map(sz => (
                            <button
                              key={sz.id}
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, hero_image_size: sz.id }));
                                showTweakNotice(`Tamaño de imagen: ${sz.label}`);
                              }}
                              className={`py-2 rounded-lg text-xs font-semibold border transition text-center cursor-pointer ${
                                (formData.hero_image_size || 'md') === sz.id
                                ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                                : 'bg-zinc-900 border-white/10 text-zinc-300 hover:bg-zinc-800'
                              }`}
                            >
                              {sz.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Layout */}
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-[11px] font-mono text-zinc-400 font-semibold uppercase flex items-center gap-1.5">
                          <Layout className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Disposición de Portada</span>
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, hero_layout: 'split' }));
                              showTweakNotice('Disposición: Foto dividida al lado');
                            }}
                            className={`py-2 px-2 rounded-lg text-xs font-semibold border transition text-center cursor-pointer ${
                              formData.hero_layout === 'split'
                                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                                : 'bg-zinc-900 border-white/10 text-zinc-300 hover:bg-zinc-800'
                            }`}
                          >
                            Dividida al Lado
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, hero_layout: 'centered' }));
                              showTweakNotice('Disposición: Fondo completo');
                            }}
                            className={`py-2 px-2 rounded-lg text-xs font-semibold border transition text-center cursor-pointer ${
                              formData.hero_layout === 'centered'
                                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                                : 'bg-zinc-900 border-white/10 text-zinc-300 hover:bg-zinc-800'
                            }`}
                          >
                            Fondo Completo
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, hero_layout: 'minimal' }));
                              showTweakNotice('Disposición: Minimalista');
                            }}
                            className={`py-2 px-2 rounded-lg text-xs font-semibold border transition text-center cursor-pointer ${
                              formData.hero_layout === 'minimal'
                                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                                : 'bg-zinc-900 border-white/10 text-zinc-300 hover:bg-zinc-800'
                            }`}
                          >
                            Solo Texto
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Camera & Gallery Upload Controls */}
                    <div className="p-3 rounded-xl bg-zinc-900/70 border border-white/10 space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Subir Foto del Centro (Galería o Cámara)</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => heroGalleryInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold border border-white/15 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                          >
                            <Upload className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Elegir de Galería</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => heroCameraInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold border border-cyan-500/40 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                          >
                            <Camera className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Hacer Foto con Cámara</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={formData.hero_image || ''}
                          onChange={e => setFormData(prev => ({ ...prev, hero_image: e.target.value }))}
                          placeholder="O pega aquí la URL de la imagen..."
                          className="flex-1 bg-black/60 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 font-mono focus:border-cyan-400 focus:outline-none"
                        />
                      </div>

                      {/* Presets */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase font-semibold">
                          O elige una foto clínica en 1 clic:
                        </span>
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                          {CLINIC_PHOTO_PRESETS.map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, hero_image: preset.url }));
                                showTweakNotice(`Foto cambiada: ${preset.label}`);
                              }}
                              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition shrink-0 cursor-pointer ${
                                formData.hero_image === preset.url
                                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                                  : 'bg-black/50 border-white/10 text-zinc-300 hover:border-white/30'
                              }`}
                            >
                              <img src={preset.url} alt={preset.label} className="w-6 h-6 rounded object-cover" />
                              <span className="text-xs">{preset.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Title Inspector */}
                {selectedElement.type === 'title' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-zinc-400 font-semibold uppercase">
                        Nombre de la Clínica o Centro
                      </label>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={e => handleNameChange(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white font-bold focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-zinc-400 font-semibold uppercase">
                        Dirección Web Asignada (Subdominio)
                      </label>
                      <div className="flex items-center gap-2 bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono text-cyan-400">
                        <span>https://{formData.slug || 'clinica'}.tecnodiel.app</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Slogan & Philosophy Inspector */}
                {selectedElement.type === 'slogan' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-zinc-400 font-semibold uppercase">
                        Lema o Especialidad Destacada
                      </label>
                      <input
                        type="text"
                        value={formData.slogan || ''}
                        onChange={e => setFormData(prev => ({ ...prev, slogan: e.target.value }))}
                        className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-zinc-400 font-semibold uppercase">
                        Descripción o Compromiso Médico
                      </label>
                      <textarea
                        rows={2}
                        value={formData.description || ''}
                        onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* CTA Button Inspector */}
                {selectedElement.type === 'cta_button' && (
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono text-zinc-400 font-semibold uppercase">
                      Texto del Botón de Cita Médica
                    </label>
                    <input
                      type="text"
                      value={formData.cta_text || 'Pedir Cita Online'}
                      onChange={e => setFormData(prev => ({ ...prev, cta_text: e.target.value }))}
                      className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white font-bold focus:border-cyan-400 focus:outline-none"
                    />
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-mono text-zinc-400">Sugerencias:</span>
                      {['Pedir Cita Online Gratuita', 'Reservar Cita Médica', 'Pedir Cita con Especialista', 'Cita por WhatsApp'].map(sug => (
                        <button
                          key={sug}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, cta_text: sug }));
                            showTweakNotice(`Botón: "${sug}"`);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 text-[11px] transition cursor-pointer"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Treatment & Services Inspector */}
                {selectedElement.type === 'treatment_item' && (() => {
                  const catIdx = selectedElement.data?.categoryIndex ?? 0;
                  const itemIdx = selectedElement.data?.itemIndex ?? 0;
                  const item = formData.menu_categories?.[catIdx]?.items?.[itemIdx] || selectedElement.data?.item || { name: '', price: '', description: '' };

                  return (
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="text-xs font-bold text-white">
                            Tratamiento: {item.name || 'Seleccionado'} ({formData.menu_categories?.[catIdx]?.category || 'Cuadro Clínico'})
                          </span>
                        </div>

                        {/* Switch specialty category */}
                        <div className="flex items-center gap-2">
                          <select
                            value={catIdx}
                            onChange={e => {
                              const newCat = parseInt(e.target.value, 10);
                              const firstItem = formData.menu_categories?.[newCat]?.items?.[0] || { name: 'Tratamiento', price: '40€' };
                              setSelectedElement({
                                type: 'treatment_item',
                                label: firstItem.name || 'Tratamiento',
                                data: { categoryIndex: newCat, itemIndex: 0, item: firstItem }
                              });
                            }}
                            className="bg-zinc-900 border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                          >
                            {(formData.menu_categories || []).map((cat, idx) => (
                              <option key={idx} value={idx}>{cat.category}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div className="space-y-1">
                          <label className="text-[11px] font-mono text-zinc-400 font-semibold uppercase">
                            Nombre del Tratamiento
                          </label>
                          <input
                            type="text"
                            value={item.name || ''}
                            onChange={e => {
                              handleUpdateTreatment(catIdx, itemIdx, 'name', e.target.value);
                              setSelectedElement(prev => ({
                                ...prev,
                                label: e.target.value,
                                data: { ...prev.data, item: { ...item, name: e.target.value } }
                              }));
                            }}
                            className="w-full bg-zinc-900 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white font-bold focus:border-cyan-400 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-mono text-zinc-400 font-semibold uppercase">
                            Precio o Tarifa
                          </label>
                          <input
                            type="text"
                            value={item.price || ''}
                            onChange={e => {
                              handleUpdateTreatment(catIdx, itemIdx, 'price', e.target.value);
                              setSelectedElement(prev => ({
                                ...prev,
                                data: { ...prev.data, item: { ...item, price: e.target.value } }
                              }));
                            }}
                            className="w-full bg-zinc-900 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white font-mono font-bold focus:border-cyan-400 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-mono text-zinc-400 font-semibold uppercase">
                            Foto del Tratamiento (Cámara / Galería)
                          </label>
                          <div className="flex items-center gap-1.5">
                            {item.image && (
                              <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover border border-white/20 shrink-0" />
                            )}
                            <button
                              type="button"
                              onClick={() => treatmentGalleryInputRef.current?.click()}
                              className="flex-1 py-1.5 px-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-semibold border border-white/15 transition flex items-center justify-center gap-1 cursor-pointer"
                              title="Seleccionar foto de galería"
                            >
                              <Upload className="w-3 h-3 text-cyan-400" />
                              <span>Galería</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => treatmentCameraInputRef.current?.click()}
                              className="flex-1 py-1.5 px-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[11px] font-semibold border border-cyan-500/40 transition flex items-center justify-center gap-1 cursor-pointer"
                              title="Tomar foto con cámara"
                            >
                              <Camera className="w-3 h-3 text-cyan-400" />
                              <span>Cámara</span>
                            </button>
                            {item.image && (
                              <button
                                type="button"
                                onClick={() => {
                                  handleUpdateTreatment(catIdx, itemIdx, 'image', undefined);
                                  setSelectedElement(prev => ({
                                    ...prev,
                                    data: { ...prev.data, item: { ...item, image: undefined } }
                                  }));
                                  showTweakNotice('Foto eliminada');
                                }}
                                className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-zinc-400 font-semibold uppercase">
                          Descripción Clínica o Explicación
                        </label>
                        <input
                          type="text"
                          value={item.description || ''}
                          onChange={e => {
                            handleUpdateTreatment(catIdx, itemIdx, 'description', e.target.value);
                            setSelectedElement(prev => ({
                              ...prev,
                              data: { ...prev.data, item: { ...item, description: e.target.value } }
                            }));
                          }}
                          className="w-full bg-zinc-900 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  );
                })()}

                {/* Theme, Background & Palette Inspector */}
                {(selectedElement.type === 'theme' || selectedElement.type === 'background' || selectedElement.type === 'colors') && (
                  <div className="space-y-4">
                    {/* Background Color Picker & Swatches */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold flex items-center justify-between">
                        <span>Color de Fondo Principal</span>
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

                      {/* Quick Dark Presets */}
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

                    {/* Surface / Cards Color */}
                    <div className="space-y-1.5 pt-2 border-t border-white/10">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold flex items-center justify-between">
                        <span>Color de Tarjetas / Superficie</span>
                        <span className="text-zinc-300 font-mono text-[10px]">{formData.surface_color}</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.surface_color || '#08253a'}
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
                          placeholder="#08253a"
                          className="flex-1 bg-zinc-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
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
                          value={formData.primary_color || '#06b6d4'}
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
                          className="flex-1 bg-zinc-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      {/* Accent swatches */}
                      <div className="grid grid-cols-4 gap-1.5 pt-1">
                        {[
                          { label: 'Cian', hex: '#06b6d4' },
                          { label: 'Turquesa', hex: '#14b8a6' },
                          { label: 'Esmeralda', hex: '#10b981' },
                          { label: 'Azul', hex: '#0284c7' },
                          { label: 'Violeta', hex: '#8b5cf6' },
                          { label: 'Lima', hex: '#84cc16' },
                          { label: 'Oro', hex: '#eab308' },
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
                              formData.primary_color === sw.hex ? 'border-cyan-400 bg-white/10 text-white font-bold' : 'border-white/10 bg-zinc-900 text-zinc-400'
                            }`}
                          >
                            <span className="w-2.5 h-2.5 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: sw.hex }} />
                            <span className="truncate">{sw.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Template Visual Styles */}
                    <div className="space-y-1 pt-2 border-t border-white/10">
                      <label className="text-[11px] font-mono text-zinc-400 font-semibold uppercase">
                        Elige un Estilo Visual de Plantilla Clínica
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-36 overflow-y-auto pr-1">
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
                                menu_categories: getPresetServicesForStyle(tpl.id)
                              }));
                              showTweakNotice(`Estilo: ${tpl.name}`);
                            }}
                            className={`p-2 rounded-xl text-left border transition cursor-pointer flex flex-col gap-1 ${
                              formData.template_id === tpl.id
                                ? 'bg-cyan-500/20 border-cyan-500 text-white font-bold'
                                : 'bg-zinc-900/80 border-white/10 text-zinc-300 hover:bg-zinc-800'
                            }`}
                          >
                            <span className="text-xs font-semibold truncate">{tpl.name}</span>
                            <span className="text-[10px] text-zinc-400 font-mono">{tpl.archetype}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Palettes 1-Click */}
                    <div className="space-y-1 pt-2 border-t border-white/10">
                      <label className="text-[11px] font-mono text-zinc-400 font-semibold uppercase">
                        Paleta de Color Principal (1 Clic)
                      </label>
                      <div className="flex flex-wrap items-center gap-2">
                        {COLOR_PALETTES.map((pal, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              handlePaletteSelect(pal);
                              showTweakNotice(`Paleta: ${pal.name}`);
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition cursor-pointer text-xs ${
                              formData.primary_color === pal.primary
                                ? 'bg-white/15 border-white text-white font-bold'
                                : 'bg-zinc-900 border-white/10 text-zinc-300 hover:bg-zinc-800'
                            }`}
                          >
                            <div className="w-3.5 h-3.5 rounded-full border border-black/40" style={{ backgroundColor: pal.primary }} />
                            <span>{pal.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact Inspector */}
                {selectedElement.type === 'contact' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-zinc-400 font-semibold uppercase">Teléfono</label>
                      <input
                        type="text"
                        value={formData.phone || ''}
                        onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full bg-zinc-900 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-zinc-400 font-semibold uppercase">WhatsApp</label>
                      <input
                        type="text"
                        value={formData.whatsapp_number || ''}
                        onChange={e => setFormData(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                        className="w-full bg-zinc-900 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-zinc-400 font-semibold uppercase">Dirección</label>
                      <input
                        type="text"
                        value={formData.address || ''}
                        onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full bg-zinc-900 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-zinc-400 font-semibold uppercase">Ciudad</label>
                      <input
                        type="text"
                        value={formData.city || ''}
                        onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full bg-zinc-900 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

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
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                    <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
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
                    title="Vista Móvil"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Móvil</span>
                  </button>
                </div>
              </div>

              {/* Realistic Device Chassis */}
              {previewDevice === 'mobile' ? (
                /* iPhone Frame */
                <div className="w-full max-w-[390px] mx-auto transition-all duration-300">
                  <div className="bg-zinc-950 border-[6px] border-zinc-800 rounded-[44px] shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col">
                    {/* Dynamic Island Notch */}
                    <div className="w-full flex justify-center py-2 bg-black shrink-0 z-20">
                      <div className="w-28 h-5 bg-zinc-900 rounded-full flex items-center justify-between px-3 border border-white/5">
                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      </div>
                    </div>

                    {/* Web Container */}
                    <div className="w-full h-[600px] sm:h-[660px] overflow-y-auto overscroll-contain bg-black preview-device-mobile">
                      <ErrorBoundary>
                        <TemplateRenderer 
                          clinic={formData} 
                          isPreview={true} 
                          previewDevice="mobile"
                          onSelectElement={handleSelectElement}
                          selectedElement={selectedElement}
                        />
                      </ErrorBoundary>
                    </div>

                    {/* iOS Home Indicator */}
                    <div className="w-full flex justify-center py-2 bg-black shrink-0 z-20">
                      <div className="w-32 h-1 bg-white/40 rounded-full" />
                    </div>
                  </div>
                </div>
              ) : previewDevice === 'tablet' ? (
                /* iPad Frame */
                <div className="w-full max-w-[720px] mx-auto transition-all duration-300">
                  <div className="bg-zinc-950 border-[6px] border-zinc-800 rounded-[32px] shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col">
                    {/* iPad Camera Dot */}
                    <div className="w-full flex justify-center py-1.5 bg-zinc-950 shrink-0 z-20">
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                    </div>

                    {/* Web Container */}
                    <div className="w-full h-[600px] sm:h-[660px] overflow-y-auto overscroll-contain bg-black preview-device-tablet">
                      <ErrorBoundary>
                        <TemplateRenderer 
                          clinic={formData} 
                          isPreview={true} 
                          previewDevice="tablet"
                          onSelectElement={handleSelectElement}
                          selectedElement={selectedElement}
                        />
                      </ErrorBoundary>
                    </div>

                    {/* iPad Home Indicator */}
                    <div className="w-full flex justify-center py-1.5 bg-zinc-950 shrink-0 z-20">
                      <div className="w-36 h-1 bg-white/30 rounded-full" />
                    </div>
                  </div>
                </div>
              ) : (
                /* Desktop Browser Frame */
                <div className="w-full max-w-5xl mx-auto transition-all duration-300">
                  <div className="bg-zinc-950 border border-white/10 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="w-full bg-zinc-900 px-4 py-2 border-b border-white/10 flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-cyan-500/80" />
                        </div>
                        <span className="font-mono text-[11px] text-zinc-300 pl-2">
                          https://{formData.slug || 'clinica'}.tecnodiel.app
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400 hidden sm:inline">
                        100% Interactivo & Cita Previa 24/7
                      </span>
                    </div>

                    {/* Web Container */}
                    <div className="w-full h-[600px] sm:h-[660px] overflow-y-auto overscroll-contain bg-black">
                      <ErrorBoundary>
                        <TemplateRenderer 
                          clinic={formData} 
                          isPreview={true} 
                          previewDevice="desktop"
                          onSelectElement={handleSelectElement}
                          selectedElement={selectedElement}
                        />
                      </ErrorBoundary>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Pricing Bar */}
            <div className="w-full max-w-5xl mt-3 sm:mt-4 z-20 animate-spring-in">
              <div className="bg-zinc-950/95 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 shadow-[0_10px_40px_rgba(0,0,0,0.9)] backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1.5 text-center md:text-left flex-1">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">
                      Web Clínica Base Completa ({BASE_WEB_PRICE}€/mes)
                    </span>
                    {(formData.selected_modules || []).map(modId => {
                      const mod = AVAILABLE_MODULES.find(m => m.id === modId);
                      if (!mod) return null;
                      return (
                        <span key={mod.id} className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-zinc-900 text-zinc-300 border border-white/10">
                          + {mod.name.split(' ')[0]} ({mod.price}€)
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
                    Tarifa plana para clínicas y centros de salud. Sin costes ocultos por paciente y sin intermediarios.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
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
                      className={`px-3 py-1.5 rounded-lg transition font-medium ${
                        billingPlan === 'annual' ? 'bg-cyan-500 text-black font-extrabold shadow-sm' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Anual (-20%)
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsContractModalOpen(true)}
                    className="btn-industrial w-full sm:w-auto px-5 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.35)] cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Activar Web Clínica</span>
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
