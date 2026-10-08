import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  Check, 
  ExternalLink, 
  DollarSign, 
  MessageSquare,
  Palette
} from 'lucide-react';
import { submitLead } from '../../../../src/lib/leads.js';

const EMPTY = { 
  name: '', 
  business_name: '', 
  phone: '', 
  email: '', 
  sector: 'Restaurante / Bar / Cafetería', 
  privacy: false 
};

const SECTORS = [
  'Restaurante / Bar / Cafetería',
  'Clínica / Salud / Dental',
  'Comercio local / Otro servicio'
];

// Las plantillas oficiales creadas para cada sector con su demo real
export const SECTOR_TEMPLATES = {
  'Restaurante / Bar / Cafetería': [
    { id: 'noir-atelier', name: 'Cinematográfico', tag: 'Alta cocina, fotos y vídeo a pantalla completa', img: '/demos/noir-atelier.jpg', demo: '/?tenant=noir-atelier' },
    { id: 'smash-destroy', name: 'Urbano', tag: 'Hamburgueserías, pizzas y street food', img: '/demos/smash-destroy.jpg', demo: '/?tenant=smash-destroy' },
    { id: 'aura-velvet', name: 'Cristal', tag: 'Coctelería y locales de copas, moderno y elegante', img: '/demos/aura-velvet.jpg', demo: '/?tenant=aura-velvet' },
    { id: 'le-maison', name: 'Editorial', tag: 'Estilo revista para bistrós y cocina de autor', img: '/demos/le-maison.jpg', demo: '/?tenant=le-maison' },
    { id: 'cyber-fusion', name: 'Futurista', tag: 'Fusión y locales jóvenes que quieren destacar', img: '/demos/cyber-fusion.jpg', demo: '/?tenant=cyber-fusion' },
    { id: 'casa-encina', name: 'Rústico', tag: 'Asadores y cocina tradicional, cálido y cercano', img: '/demos/casa-encina.jpg', demo: '/?tenant=casa-encina' },
  ],
  'Clínica / Salud / Dental': [
    { id: 'swiss-dental', name: 'Minimal', tag: 'Limpio y profesional para clínicas dentales', img: '/demos/swiss-dental.jpg', demo: '/?tenant=swiss-dental' },
    { id: 'genome-biotech', name: 'Alta tecnología', tag: 'Medicina deportiva y centros avanzados', img: '/demos/genome-biotech.jpg', demo: '/?tenant=genome-biotech' },
    { id: 'pequenos-gigantes', name: 'Amable', tag: 'Pediatría y familias, colorido y cercano', img: '/demos/pequenos-gigantes.jpg', demo: '/?tenant=pequenos-gigantes' },
    { id: 'espacio-vacio', name: 'Zen', tag: 'Psicología, spa y bienestar, sereno', img: '/demos/espacio-vacio.jpg', demo: '/?tenant=espacio-vacio' },
    { id: 'aura-gold', name: 'Lujo', tag: 'Estética avanzada y tratamientos premium', img: '/demos/aura-gold.jpg', demo: '/?tenant=aura-gold' },
    { id: 'ortho-tech', name: 'Precisión', tag: 'Ortodoncia y traumatología con aire técnico', img: '/demos/ortho-tech.jpg', demo: '/?tenant=ortho-tech' },
  ],
  'Comercio local / Otro servicio': [
    { id: 'noir-atelier', name: 'Comercio Local', tag: 'Tienda de barrio, servicios y autónomos', img: '/demos/noir-atelier.jpg', demo: '/?tenant=noir-atelier' },
    { id: 'swiss-dental', name: 'Minimal Pro', tag: 'Servicios profesionales y escaparate online', img: '/demos/swiss-dental.jpg', demo: '/?tenant=swiss-dental' },
    { id: 'le-maison', name: 'Editorial', tag: 'Diseño cuidado y catálogo de productos', img: '/demos/le-maison.jpg', demo: '/?tenant=le-maison' },
    { id: 'smash-destroy', name: 'Moderno & Urbano', tag: 'Negocios dinámicos y jóvenes', img: '/demos/smash-destroy.jpg', demo: '/?tenant=smash-destroy' },
  ]
};

const ACCENT_COLORS = [
  { id: '#6DD94B', name: 'Verde Neón', bg: '#6DD94B' },
  { id: '#0284C7', name: 'Azul Profesional', bg: '#0284C7' },
  { id: '#F59E0B', name: 'Dorado Premium', bg: '#F59E0B' },
  { id: '#18181B', name: 'Grafito Minimal', bg: '#18181B' }
];

export default function LeadForm({ 
  style: initialStyle = null,
  onNavigateToMultiwebs,
  onNavigateToCyS
}) {
  const [form, setForm] = useState(() => ({
    ...EMPTY,
    sector: initialStyle?.group === 'salud' 
      ? 'Clínica / Salud / Dental' 
      : 'Restaurante / Bar / Cafetería'
  }));

  // Plantilla seleccionada
  const [selectedTemplateId, setSelectedTemplateId] = useState(() => {
    if (initialStyle?.slug) return initialStyle.slug;
    return initialStyle?.group === 'salud' ? 'swiss-dental' : 'noir-atelier';
  });

  // Color de acento personalizable
  const [accentColor, setAccentColor] = useState('#6DD94B');

  // 1 o 2 seleccionables comerciales de alto impacto para venta
  const [costSaving, setCostSaving] = useState(true);
  const [directOrders, setDirectOrders] = useState(true);

  const [status, setStatus] = useState('idle'); // idle | sending | done
  const [error, setError] = useState('');
  const [hasAttempted, setHasAttempted] = useState(false);
  const [shaking, setShaking] = useState(false);

  // Estados para la animación fluida del botón que huye (magnetic evasion physics)
  const [dodgeOffset, setDodgeOffset] = useState({ x: 0, y: 0 });
  const buttonContainerRef = useRef(null);
  const buttonRef = useRef(null);

  // Validaciones en tiempo real
  const isNameValid = form.name.trim().length > 0;
  const isPhoneValid = form.phone.length === 9;
  const isEmailValid = form.email.trim().includes('@') && form.email.trim().includes('.') && form.email.trim().length >= 5;
  const isFormValid = isNameValid && isPhoneValid && isEmailValid && form.privacy;

  // Contador de campos completados (0 a 3)
  const completedFields = (isNameValid ? 1 : 0) + (isPhoneValid ? 1 : 0) + (isEmailValid ? 1 : 0);

  // Lista de plantillas según el sector actual
  const currentTemplates = SECTOR_TEMPLATES[form.sector] || SECTOR_TEMPLATES['Restaurante / Bar / Cafetería'];

  // Si cambia el sector y la plantilla no pertenece al sector, sincronizar con la primera disponible
  useEffect(() => {
    const list = SECTOR_TEMPLATES[form.sector] || [];
    if (!list.some(t => t.id === selectedTemplateId)) {
      if (list[0]) setSelectedTemplateId(list[0].id);
    }
  }, [form.sector, selectedTemplateId]);

  // Cuando el formulario está 100% completo, vuelve a su sitio y se bloquea suavemente
  useEffect(() => {
    if (isFormValid) {
      setDodgeOffset({ x: 0, y: 0 });
      setError('');
    }
  }, [isFormValid]);

  // ── FÍSICA FLUIDA DEL BOTÓN QUE HUYE (Magnetic Evasion) ──
  const handleContainerMouseMove = (e) => {
    if (isFormValid) return; // Si ya está completado, no se mueve
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const dist = Math.hypot(dx, dy);

    // Umbral de aproximación del cursor
    const triggerRadius = 125;
    if (dist < triggerRadius) {
      const angle = Math.atan2(dy, dx);
      const repelDist = Math.max(0, triggerRadius - dist);
      // Multiplicador: a medida que rellenas campos, huye menos distancia
      const multiplier = completedFields === 0 ? 1 : completedFields === 1 ? 0.68 : 0.42;
      const magnitude = (repelDist * 1.15 + 28) * multiplier;

      // Dirección contraria al cursor
      const targetX = -Math.cos(angle) * magnitude;
      const targetY = -Math.sin(angle) * (magnitude * 0.65);

      setDodgeOffset({
        x: Math.round(Math.max(-145, Math.min(145, targetX))),
        y: Math.round(Math.max(-50, Math.min(42, targetY)))
      });
    }
  };

  const handleContainerMouseLeave = () => {
    if (isFormValid) return;
    // Retorno progresivo al centro cuando el cursor sale del área
    setTimeout(() => {
      setDodgeOffset((prev) => ({
        x: Math.round(prev.x * 0.25),
        y: Math.round(prev.y * 0.25)
      }));
    }, 350);
  };

  const triggerErrorShake = (msg) => {
    setError(msg);
    setShaking(true);
    setHasAttempted(true);
    setTimeout(() => setShaking(false), 550);
  };

  const handlePhoneChange = (e) => {
    // REGLA: Solo números y máximo 9 dígitos estrictos
    const onlyDigits = e.target.value.replace(/\D/g, '').slice(0, 9);
    setForm((f) => ({ ...f, phone: onlyDigits }));
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleButtonClick = (e) => {
    if (!isFormValid) {
      e.preventDefault();
      // Pequeño salto evasivo dinámico al hacer clic sin haber rellenado
      setDodgeOffset((prev) => ({
        x: prev.x >= 0 ? -110 : 110,
        y: prev.y >= 0 ? -38 : 38
      }));
      if (!isNameValid) {
        triggerErrorShake('Dinos tu nombre para poder preparar tu propuesta.');
      } else if (!isPhoneValid) {
        triggerErrorShake('El teléfono debe tener exactamente 9 números (ej. 600123456).');
      } else if (!isEmailValid) {
        triggerErrorShake('Indícanos un email válido con @ y dominio.');
      } else if (!form.privacy) {
        triggerErrorShake('Debes marcar la casilla de política de privacidad.');
      }
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!isNameValid) {
      return triggerErrorShake('Dinos tu nombre para poder preparar tu propuesta.');
    }
    if (!isPhoneValid) {
      return triggerErrorShake('El número debe tener exactamente 9 números (ej. 600123456).');
    }
    if (!isEmailValid) {
      return triggerErrorShake('Indícanos un email válido con @ y dominio.');
    }
    if (!form.privacy) {
      return triggerErrorShake('Debes marcar la casilla de política de privacidad.');
    }

    setStatus('sending');

    const selectedTemplate = currentTemplates.find(t => t.id === selectedTemplateId) || currentTemplates[0];

    // 1. Guardar datos en sesión para que los siguientes pasos del configurador ya los tengan
    try {
      const payload = {
        name: form.name.trim(),
        business_name: form.business_name.trim() || form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        sector: form.sector,
        template: selectedTemplate?.id,
        templateName: selectedTemplate?.name,
        accentColor,
        costSaving,
        directOrders
      };
      sessionStorage.setItem('tecnodiel_lead_data', JSON.stringify(payload));
      localStorage.setItem('tecnodiel_lead_data', JSON.stringify(payload));
    } catch (_) {}

    // 2. Notificar lead en segundo plano con plantilla y preferencias de venta
    try {
      await submitLead({
        name: form.name,
        business_name: form.business_name || form.name,
        phone: form.phone,
        email: form.email,
        sector: form.sector,
        message: `Plantilla: ${selectedTemplate?.name || selectedTemplateId} | Color: ${accentColor} | Ahorro costes: ${costSaving ? 'Sí' : 'No'} | Pedidos directos: ${directOrders ? 'Sí' : 'No'}`
      });
    } catch (err) {
      console.warn('Lead submit error:', err);
    }

    // 3. Redirigir al configurador de Restaurante o Clínica
    const isClinic = form.sector.toLowerCase().includes('clínica') || 
                     form.sector.toLowerCase().includes('salud') || 
                     form.sector.toLowerCase().includes('dental');

    if (isClinic) {
      if (onNavigateToCyS) onNavigateToCyS();
      else window.location.hash = '#/cys';
    } else {
      if (onNavigateToMultiwebs) onNavigateToMultiwebs();
      else window.location.hash = '#/multiwebs';
    }
  };

  const baseInputCls =
    'w-full rounded-xl border bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition';
  const labelCls = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-700';

  return (
    <form 
      id="propuesta-lead-form"
      onSubmit={onSubmit} 
      noValidate 
      className={`rounded-2xl bg-white p-6 sm:p-9 text-zinc-900 shadow-2xl space-y-5 relative ${shaking ? 'runaway-shake' : ''}`}
    >
      <style>{`
        @keyframes runawayShake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-10px) rotate(-0.8deg); }
          30% { transform: translateX(10px) rotate(0.8deg); }
          45% { transform: translateX(-6px) rotate(-0.4deg); }
          60% { transform: translateX(6px) rotate(0.4deg); }
          75% { transform: translateX(-3px); }
        }
        .runaway-shake {
          animation: runawayShake 0.45s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
      `}</style>

      {/* ── CABECERA DEL FORMULARIO ── */}
      <div className="border-b border-zinc-100 pb-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0D844A]">
            PASO 1 DE 2 • SOLICITUD RÁPIDA
          </span>
          <span className="text-[11px] font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full font-semibold">
            {completedFields}/3 datos obligatorios
          </span>
        </div>
        <h3 className="text-xl font-extrabold text-zinc-900 mt-1">
          Cuéntanos sobre tu negocio
        </h3>
        <p className="text-xs text-zinc-500 mt-0.5">
          Completa los campos para desbloquear tu propuesta personalizada.
        </p>
      </div>

      {/* ── CAMPOS DE CONTACTO ── */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Tu nombre */}
        <div>
          <label className={labelCls} htmlFor="lf-name">Tu nombre *</label>
          <input 
            id="lf-name" 
            className={`${baseInputCls} ${
              hasAttempted && !isNameValid 
                ? 'border-red-400 bg-red-50/40 ring-2 ring-red-400/30' 
                : 'border-zinc-300 focus:border-[#0D844A] focus:ring-2 focus:ring-[#6DD94B]/40'
            }`} 
            value={form.name} 
            onChange={set('name')} 
            placeholder="Ej. Mario" 
            autoComplete="name" 
            maxLength={120} 
            required 
          />
        </div>

        {/* Nombre del negocio */}
        <div>
          <label className={labelCls} htmlFor="lf-biz">Nombre del negocio</label>
          <input 
            id="lf-biz" 
            className={`${baseInputCls} border-zinc-300 focus:border-[#0D844A] focus:ring-2 focus:ring-[#6DD94B]/40`} 
            value={form.business_name} 
            onChange={set('business_name')} 
            placeholder="Ej. Asador El Rincón" 
            maxLength={160} 
          />
        </div>

        {/* Teléfono / WhatsApp (SOLO 9 NÚMEROS) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700" htmlFor="lf-phone">
              Teléfono / WhatsApp *
            </label>
            <span className={`text-[10px] font-mono font-bold ${form.phone.length === 9 ? 'text-[#0D844A]' : 'text-zinc-400'}`}>
              {form.phone.length}/9 números
            </span>
          </div>
          <input 
            id="lf-phone" 
            type="tel" 
            inputMode="numeric"
            pattern="[0-9]{9}"
            maxLength={9}
            className={`${baseInputCls} font-mono ${
              hasAttempted && !isPhoneValid 
                ? 'border-red-400 bg-red-50/40 ring-2 ring-red-400/30' 
                : 'border-zinc-300 focus:border-[#0D844A] focus:ring-2 focus:ring-[#6DD94B]/40'
            }`} 
            value={form.phone} 
            onChange={handlePhoneChange} 
            placeholder="600123456" 
            autoComplete="tel" 
            required 
          />
          <p className="text-[10px] text-zinc-400 mt-1">
            Solo números (9 dígitos exactos)
          </p>
        </div>

        {/* Email */}
        <div>
          <label className={labelCls} htmlFor="lf-email">Tu email *</label>
          <input 
            id="lf-email" 
            type="email" 
            className={`${baseInputCls} ${
              hasAttempted && !isEmailValid 
                ? 'border-red-400 bg-red-50/40 ring-2 ring-red-400/30' 
                : 'border-zinc-300 focus:border-[#0D844A] focus:ring-2 focus:ring-[#6DD94B]/40'
            }`} 
            value={form.email} 
            onChange={set('email')} 
            placeholder="mario@negocio.es" 
            autoComplete="email" 
            maxLength={160} 
            required 
          />
        </div>
      </div>

      {/* ── SELECTOR DE TIPO DE NEGOCIO ── */}
      <div>
        <label className={labelCls} htmlFor="lf-sector">¿Qué tipo de negocio tienes? *</label>
        <select 
          id="lf-sector" 
          className={`${baseInputCls} border-zinc-300 focus:border-[#0D844A] focus:ring-2 focus:ring-[#6DD94B]/40 font-semibold`} 
          value={form.sector} 
          onChange={set('sector')}
          required
        >
          {SECTORS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* ── SECCIÓN DE PLANTILLAS YA CREADAS (Restaurantes / Clínicas / Comercio) ── */}
      <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 block">
              Elige tu plantilla base ({currentTemplates.length} disponibles)
            </span>
            <span className="text-[11px] text-zinc-500">
              Webs ya creadas y probadas. La dejamos lista con tu carta o servicios.
            </span>
          </div>

          {/* Selector de color de acento / personalización */}
          <div className="flex items-center gap-1.5 bg-white border border-zinc-200 px-2.5 py-1 rounded-full shadow-xs">
            <Palette className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-[10px] font-semibold text-zinc-600 mr-1">Tono:</span>
            {ACCENT_COLORS.map((c) => (
              <button
                type="button"
                key={c.id}
                onClick={() => setAccentColor(c.id)}
                title={`Tono ${c.name}`}
                className={`h-4 w-4 rounded-full border transition cursor-pointer ${
                  accentColor === c.id 
                    ? 'ring-2 ring-[#0D844A] ring-offset-1 scale-110 border-black/40' 
                    : 'border-black/20 opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: c.bg }}
              />
            ))}
          </div>
        </div>

        {/* Carrusel / Grid de plantillas con foto real y diseño */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
          {currentTemplates.map((t) => {
            const isSelected = selectedTemplateId === t.id;
            return (
              <div
                key={t.id}
                onClick={() => setSelectedTemplateId(t.id)}
                className={`group relative overflow-hidden rounded-xl border text-left transition cursor-pointer select-none ${
                  isSelected
                    ? 'border-[#0D844A] bg-white ring-2 ring-[#6DD94B]/50 shadow-md'
                    : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-xs'
                }`}
              >
                {/* Imagen en miniatura */}
                <div className="relative h-16 w-full overflow-hidden bg-zinc-900">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {isSelected && (
                    <span className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#0D844A] text-white shadow-xs">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                  )}
                  <a
                    href={t.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    title="Ver demo en vivo a pantalla completa"
                    className="absolute bottom-1.5 right-1.5 rounded-full bg-black/70 px-1.5 py-0.5 text-[9px] font-semibold text-white backdrop-blur hover:bg-[#0D844A] transition flex items-center gap-0.5"
                  >
                    Demo <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>

                {/* Info de la plantilla */}
                <div className="p-2">
                  <span className="block text-[11px] font-extrabold text-zinc-900 truncate">
                    Estilo {t.name}
                  </span>
                  <span className="block text-[9px] text-zinc-500 leading-tight line-clamp-1">
                    {t.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 1 O 2 SELECCIONABLES COMERCIALES DE ALTO IMPACTO (PARA VENDER) ── */}
      <div className="space-y-2 pt-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-700 block">
          Opciones recomendadas para tu negocio:
        </span>

        {/* 1. ¿Quieres digitalizarte ahorrando costes? */}
        <label 
          onClick={() => setCostSaving(v => !v)}
          className={`flex items-start gap-3 rounded-xl border p-3 transition cursor-pointer select-none ${
            costSaving 
              ? 'border-[#0D844A]/50 bg-[#6DD94B]/10 shadow-xs' 
              : 'border-zinc-200 bg-white hover:border-zinc-300'
          }`}
        >
          <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
            costSaving ? 'border-[#0D844A] bg-[#0D844A] text-white' : 'border-zinc-300 bg-white'
          }`}>
            {costSaving && <Check className="h-3 w-3 stroke-[3]" />}
          </div>
          <div className="min-w-0">
            <span className="block text-xs font-bold text-zinc-900">
              ¿Quieres digitalizarte ahorrando costes? (Recomendado)
            </span>
            <span className="block text-[11px] text-zinc-500 leading-snug mt-0.5">
              Ahorra hasta un 60% frente a plataformas grandes. Sin comisiones por pedido ni mensualidades abusivas.
            </span>
          </div>
        </label>

        {/* 2. ¿Quieres reservas y pedidos directos en tu web / WhatsApp? */}
        <label 
          onClick={() => setDirectOrders(v => !v)}
          className={`flex items-start gap-3 rounded-xl border p-3 transition cursor-pointer select-none ${
            directOrders 
              ? 'border-[#0D844A]/50 bg-[#6DD94B]/10 shadow-xs' 
              : 'border-zinc-200 bg-white hover:border-zinc-300'
          }`}
        >
          <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
            directOrders ? 'border-[#0D844A] bg-[#0D844A] text-white' : 'border-zinc-300 bg-white'
          }`}>
            {directOrders && <Check className="h-3 w-3 stroke-[3]" />}
          </div>
          <div className="min-w-0">
            <span className="block text-xs font-bold text-zinc-900">
              ¿Quieres reservas y pedidos directos sin comisiones?
            </span>
            <span className="block text-[11px] text-zinc-500 leading-snug mt-0.5">
              Tus clientes piden o reservan directamente en tu web o WhatsApp, sin intermediarios.
            </span>
          </div>
        </label>
      </div>

      {/* ── CASILLA DE PRIVACIDAD RGPD ── */}
      <label className="flex items-start gap-3 text-xs text-zinc-600 pt-1 cursor-pointer select-none">
        <input 
          type="checkbox" 
          required
          checked={form.privacy} 
          onChange={(e) => setForm((f) => ({ ...f, privacy: e.target.checked }))} 
          className="mt-0.5 h-4 w-4 accent-[#0D844A] cursor-pointer" 
        />
        <span>
          He leído y acepto la{' '}
          <a 
            href="#/politica-privacidad" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="underline font-semibold text-zinc-800 hover:text-[#0D844A]"
            onClick={(e) => e.stopPropagation()}
          >
            Política de Privacidad
          </a>.
        </span>
      </label>

      {/* ── MENSAJE DE ERROR ── */}
      {error && (
        <div role="alert" className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs font-semibold text-red-700 animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── BOTÓN QUE HUYE CON FÍSICA FLUIDA (RUNAWAY BUTTON MEJORADO) ── */}
      <div 
        ref={buttonContainerRef}
        onMouseMove={handleContainerMouseMove}
        onMouseLeave={handleContainerMouseLeave}
        className="relative pt-2 flex justify-center items-center min-h-[68px] overflow-visible"
      >
        <button 
          ref={buttonRef}
          type="submit" 
          disabled={status === 'sending'}
          onClick={handleButtonClick}
          style={{
            transform: `translate(${dodgeOffset.x}px, ${dodgeOffset.y}px)`,
            transition: isFormValid 
              ? 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.25s, box-shadow 0.25s' 
              : 'transform 0.24s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          className={`relative z-10 flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl px-8 py-4 text-xs sm:text-sm font-black uppercase tracking-wider transition-all select-none cursor-pointer shadow-xl ${
            isFormValid
              ? 'bg-[#0D844A] hover:bg-[#09663a] text-white shadow-[#0D844A]/30 ring-2 ring-[#6DD94B]/50'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 shadow-zinc-900/30'
          }`}
        >
          {status === 'sending' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Abriendo propuesta...</span>
            </>
          ) : isFormValid ? (
            <>
              <span>¡Todo listo! Quiero mi propuesta gratis</span>
              <Sparkles className="h-4 w-4 text-[#6DD94B]" />
            </>
          ) : (
            <>
              <span>Rellena los campos obligatorios</span>
              <ArrowRight className="h-4 w-4 text-[#6DD94B]" />
            </>
          )}
        </button>
      </div>

      <p className="text-center text-[11px] text-zinc-500 pt-0.5">
        {isFormValid 
          ? '✓ Formulario listo: haz clic para recibir tu propuesta' 
          : 'El botón se desbloquea al rellenar los 3 datos obligatorios (nombre, 9 números de teléfono y email)'}
      </p>
    </form>
  );
}
