import React, { useState, useEffect, useRef, useMemo, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import {
  Home, FolderKanban, FileText, PackageCheck, LifeBuoy, ChevronRight, LogOut, ExternalLink, Check, Clock,
  CalendarClock, ArrowRight, Send, Copy, Download, QrCode, Calendar, ShieldCheck, Globe, MessageCircle,
  Banknote, Store, Bot, Plus, Sparkles, Pencil, Save, Users, Eye, CheckCircle2, Menu, X,
} from 'lucide-react';
import { supabase, portalAuthClient } from '../../lib/supabase';

/*
 * PORTAL DEL CLIENTE. Estructura tipo "portal de implantación" (inicio con avance, próximo paso,
 * documentos, entregables, tareas y equipo) con la estética de la landing de TecnOdiel y el mismo
 * lenguaje de movimiento que la Oficina Virtual: entradas en cascada (expo.out), números que
 * cuentan, píldora deslizante en el menú y brillos/elevación en las tarjetas.
 */

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Funciones oficiales del formulario de TecnOdiel. */
const ALL_FORM_FEATURES = [
  { id: 'reservas', name: 'Reserva de citas online', desc: 'Tus clientes reservan solos en tu web 24/7, sin llamadas.', icon: Calendar, tag: 'Automatización' },
  { id: 'carta', name: 'Carta o menú digital con QR', desc: 'Sin PDFs pesados. Se actualiza al momento y se abre en el móvil.', icon: QrCode, tag: 'Hostelería' },
  { id: 'panel', name: 'Panel de administrador', desc: 'Gestiona reservas, platos, horarios y datos sin depender de nadie.', icon: ShieldCheck, tag: 'Control total' },
  { id: 'seo', name: 'SEO local avanzado', desc: 'Destaca en Google y Google Maps en tu zona.', icon: Globe, tag: 'Visibilidad' },
  { id: 'whatsapp', name: 'Contacto directo por WhatsApp', desc: 'Un botón para que cualquier cliente te escriba con un clic.', icon: MessageCircle, tag: 'Atención directa' },
  { id: 'pagos', name: 'Pasarela de pago online', desc: 'Cobra señales o pedidos por adelantado de forma segura.', icon: Banknote, tag: 'Finanzas' },
  { id: 'tienda', name: 'Tienda / pedidos online', desc: 'Vende productos, menús o pedidos para recoger desde tu web.', icon: Store, tag: 'Ventas' },
  { id: 'ia', name: 'Asistente con IA', desc: 'Responde preguntas frecuentes de tus clientes automáticamente.', icon: Bot, tag: 'Inteligencia Artificial' },
];

const STEPS = [
  { id: 'solicitud', label: 'Solicitud recibida' },
  { id: 'kickoff', label: 'Reunión de inicio' },
  { id: 'desarrollo', label: 'Desarrollo de tu web' },
  { id: 'publicada', label: 'Publicación' },
];
const STEP_PROGRESS = [12, 38, 72, 100];
const STAGE_TO_STEP = { planeado: 1, en_progreso: 2, hecho: 3 };

const NAV = [
  { id: 'inicio', label: 'Inicio', icon: Home },
  { id: 'proyecto', label: 'Mi proyecto', icon: FolderKanban },
  { id: 'documentos', label: 'Documentos', icon: FileText },
  { id: 'entregables', label: 'Entregables', icon: PackageCheck },
  { id: 'soporte', label: 'Soporte', icon: LifeBuoy },
];

const DEFAULT_TASKS = [
  { id: 'task-form', label: 'Completar el formulario de tu negocio', done: false },
  { id: 'task-logo', label: 'Enviarnos tu logotipo en alta resolución', done: false },
  { id: 'task-fotos', label: 'Compartir fotos de tu local y tus productos', done: false },
  { id: 'task-textos', label: 'Revisar los textos que hemos preparado', done: false },
];

const card = 'rounded-2xl border border-white/10 bg-[#181818] p-5 sm:p-6 transition-[border-color,box-shadow,transform] duration-300 hover:border-[#6DD94B]/30 hover:shadow-[0_8px_40px_-12px_rgba(109,217,75,0.25)]';
const primaryBtn = 'group relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full bg-[#6DD94B] px-5 py-3 text-xs font-bold uppercase tracking-wider text-black transition hover:brightness-110 active:scale-[0.97]';
const ghostBtn = 'group inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:border-[#6DD94B]/50 hover:bg-[#6DD94B]/10 active:scale-[0.97]';

// ---------------------------------------------------------------- movimiento

/** Entrada en cascada de los bloques de primer nivel (igual que PageReveal de la Oficina). */
function Reveal({ children, className = '' }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const host = ref.current;
    if (!host || reduced()) return undefined;
    const blocks = [...host.children].slice(0, 24);
    const tween = gsap.fromTo(
      blocks,
      { y: 26, opacity: 0, scale: 0.985 },
      { y: 0, opacity: 1, scale: 1, duration: 0.85, ease: 'expo.out', stagger: 0.07, clearProps: 'transform,opacity' },
    );
    return () => { tween.revert(); };
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}

/** Número que cuenta hasta su valor. */
function CountUp({ value, suffix = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const obj = { v: 0 };
    const render = () => { el.textContent = `${Math.round(obj.v)}${suffix}`; };
    if (reduced()) { obj.v = value; render(); return undefined; }
    const tween = gsap.to(obj, { v: value, duration: 1.4, ease: 'power3.out', onUpdate: render });
    return () => { tween.kill(); };
  }, [value, suffix]);
  return <span ref={ref} className="tabular-nums">0{suffix}</span>;
}

/** Título que sube letra a letra desde una máscara (como el splash de la Oficina). */
function SplitTitle({ text, className = '' }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (!ref.current || reduced()) return undefined;
    const tween = gsap.from(ref.current.querySelectorAll('.ch'), { yPercent: 115, duration: 0.7, ease: 'expo.out', stagger: 0.025, delay: 0.1 });
    return () => { tween.revert(); };
  }, [text]);
  return (
    <h1 ref={ref} className={className} aria-label={text}>
      {[...text].map((c, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden align-bottom">
          <span className="ch inline-block">{c === ' ' ? ' ' : c}</span>
        </span>
      ))}
    </h1>
  );
}

function Pill({ tone = 'zinc', icon: Icon, children }) {
  const tones = {
    green: 'bg-[#6DD94B]/15 text-[#6DD94B] ring-[#6DD94B]/30',
    amber: 'bg-amber-500/15 text-amber-300 ring-amber-500/30',
    sky: 'bg-sky-500/15 text-sky-300 ring-sky-500/30',
    zinc: 'bg-white/5 text-zinc-400 ring-white/10',
  };
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${tones[tone]}`}>
      {Icon && <Icon className="h-3 w-3" />}{children}
    </span>
  );
}

// ---------------------------------------------------------------- piezas

function ProgressStepper({ step }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (!ref.current || reduced()) return undefined;
    const ctx = gsap.context(() => {
      gsap.from('.st-node', { scale: 0, duration: 0.6, ease: 'back.out(2)', stagger: 0.12, delay: 0.3 });
      gsap.from('.st-fill', { scaleX: 0, transformOrigin: 'left center', duration: 1.2, ease: 'expo.out', delay: 0.35 });
      gsap.from('.st-label', { y: 10, opacity: 0, duration: 0.6, ease: 'power3.out', stagger: 0.1, delay: 0.5 });
    }, ref);
    return () => ctx.revert();
  }, [step]);

  return (
    <div ref={ref} className="relative">
      <div className="absolute left-[12.5%] right-[12.5%] top-[19px] h-1 rounded-full bg-white/10">
        <div className="st-fill h-full rounded-full bg-gradient-to-r from-[#0D844A] to-[#6DD94B]" style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }} />
      </div>
      <ol className="relative grid grid-cols-4">
        {STEPS.map((s, i) => {
          const done = i < step || (step === STEPS.length - 1 && i === step);
          const current = i === step && !done;
          return (
            <li key={s.id} className="flex flex-col items-center text-center">
              <span className={`st-node relative grid h-10 w-10 place-items-center rounded-full border-2 transition-colors ${done ? 'border-[#6DD94B] bg-[#6DD94B] text-black' : current ? 'border-[#6DD94B] bg-[#121212]' : 'border-white/15 bg-[#121212]'}`}>
                {current && <span className="absolute inset-0 animate-ping rounded-full bg-[#6DD94B]/30" />}
                {done ? <Check className="h-5 w-5" /> : <span className={`h-3 w-3 rounded-full ${current ? 'bg-[#6DD94B]' : 'bg-white/15'}`} />}
              </span>
              <span className={`st-label mt-3 px-1 text-xs font-semibold leading-tight sm:text-sm ${done || current ? 'text-white' : 'text-zinc-500'}`}>{s.label}</span>
              <span className={`st-label mt-0.5 text-[11px] ${done ? 'text-zinc-500' : current ? 'font-semibold text-[#6DD94B]' : 'text-zinc-600'}`}>
                {done ? 'Completado' : current ? 'En curso' : 'Pendiente'}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function ListRow({ icon: Icon, title, hint, status, action }) {
  return (
    <motion.li whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 400, damping: 28 }} className="flex items-center gap-3 border-b border-white/5 py-3 last:border-0">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/5 text-[#6DD94B]"><Icon className="h-4 w-4" /></span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{title}</p>
        {hint && <p className="truncate text-[11px] text-zinc-500">{hint}</p>}
      </div>
      {status}
      {action}
    </motion.li>
  );
}

function Checklist({ tasks, onToggle }) {
  return (
    <ul className="space-y-1">
      {tasks.map((t) => (
        <li key={t.id}>
          <button type="button" onClick={() => onToggle(t.id)} className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-white/5">
            <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors ${t.done ? 'border-[#6DD94B] bg-[#6DD94B]' : 'border-white/25 group-hover:border-[#6DD94B]/60'}`}>
              <AnimatePresence>
                {t.done && <motion.span initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 600, damping: 22 }}><Check className="h-3.5 w-3.5 text-black" /></motion.span>}
              </AnimatePresence>
            </span>
            <span className={`text-sm transition-colors ${t.done ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>{t.label}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

// ---------------------------------------------------------------- portal

export const VirtualDeskClientPortal = ({ tenantData = {}, onNavigateToLanding, onLogout }) => {
  const businessName = tenantData.name || tenantData.business_name || 'Mi negocio';
  const firstName = (tenantData.contact_name || '').trim().split(' ')[0];
  const initials = (firstName || businessName).slice(0, 2).toUpperCase();
  const slug = tenantData.slug || 'mi-negocio';
  const isClinic = Boolean(tenantData.collegiate_number || tenantData.category === 'dental' || tenantData.category === 'policlinica');

  const [tab, setTab] = useState('inicio');
  const [menuOpen, setMenuOpen] = useState(false);

  // Fase del proyecto
  const step = useMemo(() => {
    if (STAGE_TO_STEP[tenantData.stage] != null) return STAGE_TO_STEP[tenantData.stage];
    return tenantData.published_url || tenantData.cloudflare_url ? 3 : 1;
  }, [tenantData]);
  const progress = STEP_PROGRESS[step];
  const liveUrl = tenantData.published_url || tenantData.cloudflare_url || null;
  const signed = tenantData.contract_status === 'active' || tenantData.contract_status === 'signed';

  // Tareas del cliente (persisten en el navegador)
  const [tasks, setTasks] = useState(() => {
    const base = Array.isArray(tenantData.pending_tasks) && tenantData.pending_tasks.length ? tenantData.pending_tasks : DEFAULT_TASKS;
    try {
      const saved = JSON.parse(localStorage.getItem(`tecnodiel_tasks_${slug}`) || 'null');
      if (saved) return base.map((t) => (saved[t.id] != null ? { ...t, done: saved[t.id] } : t));
    } catch (_) {}
    return base;
  });
  const toggleTask = (id) => setTasks((prev) => {
    const next = prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    try { localStorage.setItem(`tecnodiel_tasks_${slug}`, JSON.stringify(Object.fromEntries(next.map((t) => [t.id, t.done])))); } catch (_) {}
    return next;
  });
  const pendingTasks = tasks.filter((t) => !t.done);

  // Soporte (chat)
  const time = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const [messages, setMessages] = useState([
    { id: 1, text: `¡Hola${firstName ? ` ${firstName}` : ''}! Soy Mario, de TecnOdiel. Aquí me tienes para cualquier duda de tu web.`, time: '10:00', agency: true },
  ]);
  const [draft, setDraft] = useState('');
  const chatEnd = useRef(null);
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, [messages, tab]);

  const say = (text) => {
    setMessages((m) => [...m, { id: Date.now(), text, time: time(), agency: false }]);
    setTimeout(() => setMessages((m) => [...m, { id: Date.now() + 1, text: 'Recibido. Javier y yo nos ponemos con ello y te avisamos por aquí.', time: time(), agency: true }]), 900);
  };
  const askTeam = (text) => { say(text); setTab('soporte'); };
  const send = (e) => { e.preventDefault(); if (!draft.trim()) return; say(draft.trim()); setDraft(''); };

  // Funciones del proyecto
  const initialFeatureIds = useMemo(() => {
    if (Array.isArray(tenantData?.intake?.features) && tenantData.intake.features.length) return tenantData.intake.features;
    if (Array.isArray(tenantData?.features) && tenantData.features.length) return tenantData.features;
    return isClinic ? ['reservas', 'panel', 'whatsapp', 'seo'] : ['reservas', 'carta', 'panel', 'whatsapp'];
  }, [tenantData, isClinic]);
  const [requested, setRequested] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`tecnodiel_requested_features_${slug}`) || '[]'); } catch (_) { return []; }
  });
  const included = ALL_FORM_FEATURES.filter((f) => initialFeatureIds.includes(f.id));
  const available = ALL_FORM_FEATURES.filter((f) => !initialFeatureIds.includes(f.id));
  const requestFeature = (f) => {
    if (requested.includes(f.id)) return;
    const next = [...requested, f.id];
    setRequested(next);
    try { localStorage.setItem(`tecnodiel_requested_features_${slug}`, JSON.stringify(next)); } catch (_) {}
    say(`Hola, me gustaría activar la función "${f.name}" en mi web de ${businessName}.`);
  };

  // Datos del negocio
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [info, setInfo] = useState({
    phone: tenantData.phone || '', email: tenantData.email || '', address: tenantData.address || '', schedule: tenantData.schedule || '',
  });
  const saveInfo = (e) => {
    e.preventDefault();
    setEditing(false);
    setSaved(true);
    try {
      const updated = { ...tenantData, ...info };
      if (info.email) localStorage.setItem(`tecnodiel_client_project_${info.email.toLowerCase()}`, JSON.stringify(updated));
      localStorage.setItem('tecnodiel_active_project', JSON.stringify(updated));
    } catch (_) {}
    setTimeout(() => setSaved(false), 2500);
  };

  // QR de la web
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://tecnodiel.es';
  const publicUrl = liveUrl || (isClinic ? `${origin}/#/c/${slug}` : `${origin}/#/r/${slug}`);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(publicUrl)}&color=000000&bgcolor=ffffff&margin=1`;
  const [copied, setCopied] = useState(false);
  const copyLink = () => { try { navigator.clipboard.writeText(publicUrl); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch (_) {} };

  // Documentos y entregables (según la fase)
  const documents = [
    { id: 'propuesta', title: 'Propuesta y presupuesto', hint: 'Lo que acordamos contigo', ok: true, label: 'Disponible' },
    { id: 'contrato', title: 'Contrato de servicio', hint: 'Condiciones y plazos', ok: signed, label: signed ? 'Firmado' : 'Pendiente de firma', done: signed },
    { id: 'alcance', title: 'Alcance del proyecto', hint: 'Páginas, funciones y plazos', ok: step >= 1, label: step >= 1 ? 'Disponible' : 'Pendiente' },
    { id: 'guia', title: 'Guía de uso y accesos', hint: 'Cómo gestionar tu web', ok: step >= 3, label: step >= 3 ? 'Disponible' : 'Pendiente' },
  ];
  const deliverables = [
    { id: 'diseno', title: 'Diseño de tu web', hint: 'Estructura, colores y textos', ok: step >= 2 },
    { id: 'web', title: 'Web publicada', hint: liveUrl || 'Tu dirección en internet', ok: step >= 3 },
    { id: 'panel', title: 'Panel de gestión', hint: 'Accesos para editar tu web', ok: step >= 3 },
    { id: 'qr', title: 'Código QR', hint: 'Listo para imprimir', ok: step >= 3 },
  ];
  const deliveredCount = deliverables.filter((d) => d.ok).length;

  const nextStep = [
    { eyebrow: 'Tu próximo paso', title: 'Estamos revisando tu solicitud', text: 'Un socio de TecnOdiel te contactará en breve para cerrar los detalles contigo.', cta: 'Escribir al equipo', onClick: () => askTeam('Hola, quería comentar los detalles de mi solicitud.'), icon: Sparkles },
    { eyebrow: 'Tu próximo paso', title: 'Agenda tu reunión de inicio', text: 'Conozcámonos, fijemos fecha y definamos juntos el plan de trabajo.', cta: 'Agendar reunión', onClick: () => askTeam('Hola, me gustaría agendar la reunión de inicio. ¿Qué días os vienen bien?'), icon: CalendarClock },
    { eyebrow: 'Tu próximo paso', title: 'Revisa el avance de tu web', text: 'Estamos construyendo tu web. Cuando tengamos algo que enseñarte te avisamos por aquí.', cta: 'Pedir novedades', onClick: () => askTeam('Hola, ¿cómo va mi web? ¿Podéis enseñarme el avance?'), icon: Eye },
    { eyebrow: 'Todo listo', title: '¡Tu web ya está online!', text: 'Compártela con tus clientes y pídenos cualquier cambio cuando lo necesites.', cta: liveUrl ? 'Ver mi web' : 'Pedir cambios', onClick: () => (liveUrl ? window.open(liveUrl, '_blank', 'noopener') : askTeam('Hola, quiero pedir un cambio en mi web.')), icon: Globe },
  ][step];

  const logout = async () => {
    try {
      sessionStorage.removeItem('tecnodiel_auth_session');
      sessionStorage.removeItem('tecnodiel_formulario_draft');
      sessionStorage.removeItem('tecnodiel_pending_portal_redirect');
      localStorage.removeItem('tecnodiel_client_slug');
      localStorage.removeItem('tecnodiel_has_project');
      localStorage.removeItem('tecnodiel-admin-auth');
      await portalAuthClient.auth.signOut();
      await supabase.auth.signOut();
    } catch (_) {}
    if (onLogout) return onLogout();
    if (onNavigateToLanding) return onNavigateToLanding();
    window.location.href = '/';
    return undefined;
  };

  // Ambiente: resplandores que derivan lentamente + menú lateral que entra en cascada
  const root = useRef(null);
  useLayoutEffect(() => {
    if (reduced()) return undefined;
    const ctx = gsap.context(() => {
      gsap.from('.nav-item', { x: -18, opacity: 0, duration: 0.7, ease: 'expo.out', stagger: 0.06, delay: 0.1 });
      gsap.from('.brand-mark', { scale: 0.4, rotate: -25, opacity: 0, duration: 0.6, ease: 'back.out(1.8)' });
      gsap.to('.glow-a', { x: 60, y: 40, duration: 9, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      gsap.to('.glow-b', { x: -50, y: -30, duration: 11, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    }, root);
    return () => ctx.revert();
  }, []);

  const goto = (id) => { setTab(id); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const current = NAV.find((n) => n.id === tab)?.label || 'Mi cuenta';

  // ---------------------------------------------------------------- secciones
  const Inicio = (
    <Reveal className="space-y-5">
      <header>
        <SplitTitle text={firstName ? `Bienvenido, ${firstName}` : 'Te damos la bienvenida'} className="text-3xl font-black tracking-tight text-white sm:text-5xl" />
        <p className="mt-2 text-sm text-zinc-400 sm:text-base">Aquí encontrarás el avance de tu proyecto y todo lo que necesitas para empezar.</p>
      </header>

      <section className={card}>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold sm:text-xl">Tu web: {businessName}</h2>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-[#6DD94B]"><CountUp value={progress} suffix=" %" /></span>
            <Pill tone={step === 3 ? 'green' : 'amber'} icon={step === 3 ? CheckCircle2 : Clock}>{step === 3 ? 'Publicada' : STEPS[step].label}</Pill>
          </div>
        </div>
        <ProgressStepper step={step} />
      </section>

      <section className="relative overflow-hidden rounded-2xl border border-[#6DD94B]/25 bg-gradient-to-br from-[#6DD94B]/12 via-[#181818] to-[#0D844A]/10 p-5 sm:p-6">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }} className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#6DD94B]/15 text-[#6DD94B] ring-1 ring-[#6DD94B]/30">
            <nextStep.icon className="h-7 w-7" />
          </motion.span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#6DD94B]">{nextStep.eyebrow}</p>
            <h3 className="mt-1 text-xl font-bold sm:text-2xl">{nextStep.title}</h3>
            <p className="mt-1 text-sm text-zinc-400">{nextStep.text}</p>
          </div>
          <button type="button" onClick={nextStep.onClick} className={`${primaryBtn} w-full sm:w-auto`}>
            <span className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/40 transition-all duration-700 group-hover:left-[150%]" />
            {nextStep.cta}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className={card}>
          <h3 className="text-lg font-bold">Documentos importantes</h3>
          <p className="mb-2 text-xs text-zinc-500">Todo en un solo lugar</p>
          <ul>
            {documents.slice(0, 3).map((d) => (
              <ListRow key={d.id} icon={FileText} title={d.title} status={<Pill tone={d.done ? 'green' : d.ok ? 'sky' : 'zinc'} icon={d.done ? Check : d.ok ? FileText : Clock}>{d.label}</Pill>}
                action={d.ok && <button type="button" onClick={() => askTeam(`Hola, ¿me podéis enviar una copia de "${d.title}"?`)} className="cursor-pointer text-xs font-semibold text-[#6DD94B] underline-offset-2 hover:underline">Pedir</button>} />
            ))}
          </ul>
          <button type="button" onClick={() => goto('documentos')} className="mt-2 cursor-pointer text-xs font-semibold text-zinc-400 transition hover:text-white">Ver todos →</button>
        </section>

        <section className={card}>
          <h3 className="text-lg font-bold">Entregables del proyecto</h3>
          <p className="mb-2 text-xs text-zinc-500">Se habilitarán a medida que avancemos</p>
          <ul>
            {deliverables.slice(0, 3).map((d) => (
              <ListRow key={d.id} icon={PackageCheck} title={d.title} status={<Pill tone={d.ok ? 'green' : 'zinc'} icon={d.ok ? Check : Clock}>{d.ok ? 'Entregado' : 'Pendiente'}</Pill>} />
            ))}
          </ul>
          <button type="button" onClick={() => goto('entregables')} className="mt-2 cursor-pointer text-xs font-semibold text-zinc-400 transition hover:text-white">Ver todos →</button>
        </section>

        <section className={card}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Lo que necesitamos de ti</h3>
            <Pill tone={pendingTasks.length ? 'amber' : 'green'}>{pendingTasks.length ? `${pendingTasks.length} pendientes` : 'Todo listo'}</Pill>
          </div>
          <div className="mt-3"><Checklist tasks={tasks} onToggle={toggleTask} /></div>
          <button type="button" onClick={() => goto('proyecto')} className={`${primaryBtn} mt-4`}>Completar información<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></button>
        </section>

        <section className={card}>
          <h3 className="text-lg font-bold">Tu equipo, a un mensaje</h3>
          <p className="mt-1 text-sm text-zinc-400">¿Tienes dudas sobre el proceso? Estamos aquí para acompañarte.</p>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {['M', 'J'].map((l, i) => (
                  <motion.span key={l} whileHover={{ y: -4, zIndex: 2 }} className={`grid h-12 w-12 place-items-center rounded-full border-2 border-[#181818] text-sm font-black text-black ${i ? 'bg-emerald-300' : 'bg-[#6DD94B]'}`}>{l}</motion.span>
                ))}
              </div>
              <div><p className="text-sm font-bold">Mario y Javier</p><p className="flex items-center gap-1.5 text-[11px] text-zinc-500"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#6DD94B]" />Equipo TecnOdiel</p></div>
            </div>
            <button type="button" onClick={() => goto('soporte')} className={`${ghostBtn} ml-auto`}>Contactar equipo<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></button>
          </div>
        </section>
      </div>
    </Reveal>
  );

  const Proyecto = (
    <Reveal className="space-y-5">
      <header>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Mi proyecto</h1>
        <p className="mt-2 text-sm text-zinc-400">Tu web, lo que incluye y los datos de tu negocio.</p>
      </header>

      <section className={`${card} flex flex-wrap items-center justify-between gap-4`}>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#6DD94B]">{tenantData.plan_name || 'Tu plan'}</p>
          <h2 className="mt-1 truncate text-xl font-bold">{businessName}</h2>
          <p className="truncate text-sm text-zinc-500">{liveUrl || 'Tu web aún no está publicada'}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {liveUrl && <a href={liveUrl} target="_blank" rel="noreferrer" className={primaryBtn}>Ver mi web<ExternalLink className="h-4 w-4" /></a>}
          <button type="button" onClick={copyLink} className={ghostBtn}>{copied ? <Check className="h-4 w-4 text-[#6DD94B]" /> : <Copy className="h-4 w-4" />}{copied ? 'Copiado' : 'Copiar enlace'}</button>
        </div>
      </section>

      <section className={card}>
        <h3 className="mb-4 text-lg font-bold">Tu web incluye</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {included.map((f) => (
            <motion.div key={f.id} whileHover={{ y: -3 }} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#6DD94B]/15 text-[#6DD94B]"><f.icon className="h-5 w-5" /></span>
              <div><p className="text-sm font-bold">{f.name}</p><p className="mt-0.5 text-xs leading-snug text-zinc-400">{f.desc}</p></div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className={card}>
        <h3 className="text-lg font-bold">Añade más funciones</h3>
        <p className="mb-4 text-xs text-zinc-500">Pídelas con un clic y el equipo se pone con ello.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {available.map((f) => {
            const asked = requested.includes(f.id);
            return (
              <motion.div key={f.id} whileHover={{ y: -3 }} className="flex items-start gap-3 rounded-xl border border-dashed border-white/15 p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/5 text-zinc-400"><f.icon className="h-5 w-5" /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold">{f.name}</p>
                  <p className="mt-0.5 text-xs leading-snug text-zinc-400">{f.desc}</p>
                  <button type="button" disabled={asked} onClick={() => requestFeature(f)} className={`mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold transition ${asked ? 'bg-[#6DD94B]/15 text-[#6DD94B]' : 'bg-white/5 text-white hover:bg-[#6DD94B] hover:text-black'}`}>
                    {asked ? <><Check className="h-3 w-3" />Solicitada</> : <><Plus className="h-3 w-3" />Solicitar</>}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <section className={card}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold">Datos de tu negocio</h3>
            {!editing && <button type="button" onClick={() => setEditing(true)} className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-[#6DD94B] hover:underline"><Pencil className="h-3.5 w-3.5" />Editar</button>}
          </div>
          <form onSubmit={saveInfo} className="grid gap-3 sm:grid-cols-2">
            {[['phone', 'Teléfono'], ['email', 'Correo'], ['address', 'Dirección'], ['schedule', 'Horario']].map(([k, label]) => (
              <label key={k} className="block">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">{label}</span>
                <input disabled={!editing} value={info[k]} onChange={(e) => setInfo({ ...info, [k]: e.target.value })} placeholder="—" className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-[#6DD94B] disabled:opacity-70" />
              </label>
            ))}
            <AnimatePresence>
              {editing && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex gap-2 sm:col-span-2">
                  <button type="submit" className={primaryBtn}><Save className="h-4 w-4" />Guardar</button>
                  <button type="button" onClick={() => setEditing(false)} className={ghostBtn}>Cancelar</button>
                </motion.div>
              )}
            </AnimatePresence>
            {saved && <p className="flex items-center gap-1.5 text-xs font-semibold text-[#6DD94B] sm:col-span-2"><Check className="h-3.5 w-3.5" />Datos guardados</p>}
          </form>
        </section>

        <section className={`${card} text-center`}>
          <h3 className="text-lg font-bold">Tu código QR</h3>
          <p className="mb-4 text-xs text-zinc-500">Para tu local, tarjetas o carta</p>
          <motion.img whileHover={{ scale: 1.04, rotate: -1.5 }} src={qrUrl} alt="Código QR de tu web" className="mx-auto h-40 w-40 rounded-2xl bg-white p-2" />
          <a href={qrUrl} download={`qr-${slug}.png`} target="_blank" rel="noreferrer" className={`${ghostBtn} mt-4`}><Download className="h-4 w-4" />Descargar</a>
        </section>
      </div>
    </Reveal>
  );

  const Documentos = (
    <Reveal className="space-y-5">
      <header>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Documentos</h1>
        <p className="mt-2 text-sm text-zinc-400">Todo lo firmado y acordado, en un solo lugar.</p>
      </header>
      <section className={card}>
        <ul>
          {documents.map((d) => (
            <ListRow key={d.id} icon={FileText} title={d.title} hint={d.hint} status={<Pill tone={d.done ? 'green' : d.ok ? 'sky' : 'zinc'} icon={d.done ? Check : d.ok ? FileText : Clock}>{d.label}</Pill>}
              action={d.ok && <button type="button" onClick={() => askTeam(`Hola, ¿me podéis enviar una copia de "${d.title}"?`)} className={`${ghostBtn} !px-3 !py-1.5 !text-[10px]`}>Pedir copia</button>} />
          ))}
        </ul>
      </section>
    </Reveal>
  );

  const Entregables = (
    <Reveal className="space-y-5">
      <header>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Entregables</h1>
        <p className="mt-2 text-sm text-zinc-400">Se habilitan a medida que avanzamos.</p>
      </header>
      <section className={card}>
        <div className="mb-2 flex items-center justify-between text-xs text-zinc-500"><span>Entregados</span><span className="font-semibold text-white"><CountUp value={deliveredCount} /> / {deliverables.length}</span></div>
        <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-white/10">
          <motion.div initial={{ width: 0 }} animate={{ width: `${(deliveredCount / deliverables.length) * 100}%` }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }} className="h-full rounded-full bg-gradient-to-r from-[#0D844A] to-[#6DD94B]" />
        </div>
        <ul>
          {deliverables.map((d) => (
            <ListRow key={d.id} icon={PackageCheck} title={d.title} hint={d.hint} status={<Pill tone={d.ok ? 'green' : 'zinc'} icon={d.ok ? Check : Clock}>{d.ok ? 'Entregado' : 'Pendiente'}</Pill>} />
          ))}
        </ul>
      </section>
    </Reveal>
  );

  const Soporte = (
    <Reveal className="space-y-5">
      <header>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Soporte</h1>
        <p className="mt-2 text-sm text-zinc-400">Escríbenos cualquier cambio, duda o idea. Te respondemos por aquí.</p>
      </header>
      <section className={`${card} flex h-[28rem] flex-col !p-0`}>
        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 14, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 420, damping: 30 }} className={`flex ${m.agency ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.agency ? 'rounded-bl-md bg-white/[0.07] text-zinc-100' : 'rounded-br-md bg-[#6DD94B] text-black'}`}>
                  <p className="leading-snug">{m.text}</p>
                  <p className={`mt-1 text-[10px] ${m.agency ? 'text-zinc-500' : 'text-black/60'}`}>{m.agency ? 'Mario · ' : ''}{m.time}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={chatEnd} />
        </div>
        <form onSubmit={send} className="flex gap-2 border-t border-white/10 p-3">
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Escribe tu mensaje…" className="min-w-0 flex-1 rounded-full border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-[#6DD94B]" />
          <button type="submit" aria-label="Enviar" className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full bg-[#6DD94B] text-black transition hover:brightness-110 active:scale-90"><Send className="h-4 w-4" /></button>
        </form>
      </section>
    </Reveal>
  );

  const Cuenta = (
    <Reveal className="space-y-5">
      <header>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Mi cuenta</h1>
        <p className="mt-2 text-sm text-zinc-400">Tu sesión en el portal de TecnOdiel.</p>
      </header>
      <section className={`${card} flex flex-wrap items-center justify-between gap-4`}>
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-[#6DD94B] text-xl font-black text-black">{initials.slice(0, 1)}</span>
          <div><p className="font-bold">{businessName}</p><p className="text-sm text-zinc-500">{tenantData.email || 'Cuenta de Google'}</p></div>
        </div>
        <button type="button" onClick={logout} className={`${ghostBtn} hover:!border-red-400/50 hover:!bg-red-500/10`}><LogOut className="h-4 w-4" />Cerrar sesión</button>
      </section>
    </Reveal>
  );

  const sections = { inicio: Inicio, proyecto: Proyecto, documentos: Documentos, entregables: Entregables, soporte: Soporte, cuenta: Cuenta };

  return (
    <div ref={root} className="relative flex min-h-screen flex-col bg-[#121212] font-['Montserrat',Inter,sans-serif] text-zinc-100 selection:bg-[#6DD94B] selection:text-black lg:flex-row">
      {/* Resplandores de fondo */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="glow-a absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-[#6DD94B]/10 blur-[110px]" />
        <div className="glow-b absolute -bottom-32 left-1/3 h-[26rem] w-[26rem] rounded-full bg-[#0D844A]/20 blur-[120px]" />
        <div className="absolute inset-0 opacity-50" style={{ backgroundSize: '64px 64px', backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px)' }} />
      </div>

      {/* Barra superior móvil */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#121212]/90 px-4 py-3 backdrop-blur lg:hidden">
        <span className="font-black">Tecn<span className="text-[#6DD94B]">Odiel</span></span>
        <button type="button" onClick={() => setMenuOpen((v) => !v)} aria-label="Menú" className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-white/10">{menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}</button>
      </div>

      {/* Menú lateral */}
      <aside className={`${menuOpen ? 'flex' : 'hidden'} z-20 w-full shrink-0 flex-col border-r border-white/10 bg-[#161616]/95 backdrop-blur lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64`}>
        <div className="hidden items-center gap-3 px-6 py-7 lg:flex">
          <span className="brand-mark grid h-10 w-10 place-items-center rounded-xl bg-[#6DD94B] text-sm font-black text-black shadow-lg shadow-[#6DD94B]/25">TO</span>
          <span className="text-lg font-black">Tecn<span className="text-[#6DD94B]">Odiel</span></span>
        </div>
        <p className="px-6 pb-2 pt-4 text-[11px] font-bold uppercase tracking-widest text-zinc-500 lg:pt-0">Portal del cliente</p>
        <nav className="flex-1 space-y-1 px-3">
          {NAV.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <button key={id} type="button" onClick={() => goto(id)} className={`nav-item group relative flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${active ? 'text-black' : 'text-zinc-400 hover:text-white'}`}>
                {active && <motion.span layoutId="portal-nav-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} className="absolute inset-0 rounded-xl bg-[#6DD94B] shadow-lg shadow-[#6DD94B]/20" />}
                {!active && <span className="absolute inset-0 rounded-xl bg-white/0 transition-colors group-hover:bg-white/5" />}
                <Icon className="relative h-[18px] w-[18px] transition-transform group-hover:scale-110" />
                <span className="relative">{label}</span>
                {id === 'soporte' && !active && <span className="relative ml-auto h-2 w-2 animate-pulse rounded-full bg-[#6DD94B]" />}
              </button>
            );
          })}
        </nav>
        <button type="button" onClick={() => goto('cuenta')} className="group m-3 flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-left transition hover:border-[#6DD94B]/40">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#6DD94B] text-sm font-black text-black">{initials}</span>
          <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">Mi cuenta</span><span className="block truncate text-[11px] text-zinc-500">{businessName}</span></span>
          <ChevronRight className="h-4 w-4 text-zinc-500 transition-transform group-hover:translate-x-1" />
        </button>
      </aside>

      {/* Contenido */}
      <main className="relative z-10 min-w-0 flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-8">
          <div className="mb-6 flex items-center justify-between gap-3 text-xs">
            <p className="text-zinc-500">Mi proyecto <span className="mx-1 text-zinc-700">/</span><span className="font-semibold text-[#6DD94B]">{current}</span></p>
            <Pill tone="green" icon={Users}>Portal verificado</Pill>
          </div>
          <div key={tab}>{sections[tab]}</div>
          <footer className="mt-10 border-t border-white/10 pt-4 text-xs text-zinc-500">TecnOdiel · Tu progreso, paso a paso.</footer>
        </div>
      </main>
    </div>
  );
};

export default VirtualDeskClientPortal;
