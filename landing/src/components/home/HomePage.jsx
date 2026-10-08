import React, { useEffect, useState, useRef } from 'react';
import {
  ArrowRight, ArrowUpRight, Check, ChevronDown, Menu, X, MessageCircle, MapPin, Mail,
  CalendarCheck, QrCode, LayoutDashboard, Bot, Globe, ShoppingBag, BarChart3, BellRing,
  Image as ImageIcon, Rocket, RefreshCw, LifeBuoy, Users, Heart, User, LogOut
} from 'lucide-react';
import LeadForm from './LeadForm.jsx';
import { useAccount } from '../../lib/adminAuth.js';
import { APP_URLS } from '../../config/apps.js';
import { Demos, HowItWorks, Savings, MobileBar, findDemo } from './Extras.jsx';
import LogoMark from './LogoMark.jsx';
import Threads from '../ui/Threads.jsx';
import HeroShowcase from './HeroShowcase.jsx';
import { CONTACT, NAV, WHY, PROJECTS, SERVICES, SECTORS, FAQ, FOOTER, waLink } from './content.js';

// Paleta TecnOdiel (la misma de siempre): verde neón #6DD94B, verde oscuro #0D844A, grafito #121212 y blanco.
const ICONS = { CalendarCheck, QrCode, LayoutDashboard, Bot, Globe, ShoppingBag, BarChart3, BellRing, Image: ImageIcon, Rocket, RefreshCw, LifeBuoy, Users };

const goTo = (href) => (e) => {
  if (!href?.startsWith('#')) return;
  const el = document.querySelector(href);
  if (el) {
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const Eyebrow = ({ children, dark }) => (
  <span className={`inline-block text-xs font-bold uppercase tracking-[0.2em] ${dark ? 'text-[#6DD94B]' : 'text-[#0D844A]'}`}>{children}</span>
);

const Logo = () => (
  <a href="#inicio" onClick={goTo('#inicio')} className="flex items-center gap-3">
    <LogoMark className="h-11 w-11" />
    <span className="leading-none">
      <span className="block text-lg font-extrabold tracking-wide text-white">TECNODIEL</span>
      <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6DD94B]">Huelva</span>
    </span>
  </a>
);

/* ───────────── HEADER ───────────── */
/* ───────────── CUENTA (login con Google) ───────────── */
function AccountArea({ account, mobile = false, onDone }) {
  const [menu, setMenu] = useState(false);
  const { role, profile, signIn, signOut, enabled } = account;
  if (!enabled || role === 'loading') return null;
  const done = () => onDone?.();

  if (role === 'guest') {
    return (
      <button onClick={() => { signIn(); done(); }} className={mobile ? 'block w-full py-3 text-left text-sm font-semibold text-[#6DD94B] cursor-pointer' : 'flex items-center gap-2 rounded-full border border-white/20 px-3.5 py-1.5 text-xs font-semibold text-zinc-200 transition hover:border-[#6DD94B] hover:text-[#6DD94B] cursor-pointer'}>
        <User className="h-4 w-4" />Iniciar sesión
      </button>
    );
  }

  const isAdmin = role === 'admin';
  const href = isAdmin ? APP_URLS.oficina : APP_URLS.portal;
  const label = isAdmin ? 'Entrar a la oficina' : 'Mi portal de cliente';
  const Icon = isAdmin ? LayoutDashboard : Users;

  if (mobile) {
    return (
      <div className="mt-2 border-t border-white/10 pt-3">
        <p className="truncate pb-1 text-xs text-zinc-400">{profile?.email}</p>
        <a href={href} className="flex items-center gap-2 py-2.5 text-sm font-semibold text-[#6DD94B]"><Icon className="h-4 w-4" />{label}</a>
        <button onClick={() => { signOut(); done(); }} className="flex items-center gap-2 py-2.5 text-sm text-zinc-300 cursor-pointer"><LogOut className="h-4 w-4" />Cerrar sesión</button>
      </div>
    );
  }

  return (
    <div className="relative flex items-center gap-3">
      <a href={href} className="flex items-center gap-2 rounded-full bg-[#6DD94B]/10 px-3.5 py-1.5 text-xs font-semibold text-[#6DD94B] ring-1 ring-[#6DD94B]/40 transition hover:bg-[#6DD94B] hover:text-black">
        <Icon className="h-4 w-4" />{label}
      </a>
      <button onClick={() => setMenu((m) => !m)} aria-label="Menú de usuario" aria-expanded={menu} className="grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-white/20 bg-white/5 text-sm font-bold text-white transition hover:border-[#6DD94B] cursor-pointer">
        {profile?.avatar ? <img src={profile.avatar} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" /> : (profile?.name || '?').charAt(0).toUpperCase()}
      </button>
      {menu && (
        <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl border border-white/10 bg-[#121212] p-2 shadow-2xl">
          <p className="truncate px-3 py-2 text-xs text-zinc-400">{profile?.email}</p>
          <button onClick={() => { setMenu(false); signOut(); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-200 hover:bg-white/5 cursor-pointer"><LogOut className="h-4 w-4" />Cerrar sesión</button>
        </div>
      )}
    </div>
  );
}

function Header({ onPortal, account }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);

      if (currentScrollY < 15) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 60) {
        // Al deslizar para abajo se esconde
        setVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        // Al deslizar para arriba aparece
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-in-out ${
      !visible && !open ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
    } ${scrolled || open ? 'bg-[#121212]/95 backdrop-blur border-b border-white/10' : 'bg-transparent'}`}>
      <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-5 sm:px-8">
        <Logo />
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Principal">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} onClick={goTo(n.href)} className="group text-left leading-tight">
              <span className="block text-sm font-semibold text-white group-hover:text-[#6DD94B]">{n.label}</span>
              <span className="block text-[11px] text-zinc-400">{n.sub}</span>
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <button onClick={onPortal} className="text-sm font-semibold text-zinc-300 hover:text-white cursor-pointer">Área clientes</button>
          <AccountArea account={account} />
          <a href="#contacto" onClick={goTo('#contacto')} className="rounded-full bg-[#6DD94B] px-6 py-2.5 text-sm font-bold text-black transition hover:bg-white">
            Pide tu propuesta
          </a>
        </div>
        <button className="p-2 text-white lg:hidden cursor-pointer" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-white/10 bg-[#121212] px-5 pb-6 pt-2 lg:hidden">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} onClick={(e) => { goTo(n.href)(e); setOpen(false); }} className="block border-b border-white/5 py-4">
              <span className="block font-semibold text-white">{n.label}</span>
              <span className="block text-xs text-zinc-400">{n.sub}</span>
            </a>
          ))}
          <button onClick={onPortal} className="mt-4 block w-full py-3 text-left text-sm font-semibold text-zinc-300 cursor-pointer">Área clientes</button>
          <AccountArea account={account} mobile onDone={() => setOpen(false)} />
          <a href="#contacto" onClick={(e) => { goTo('#contacto')(e); setOpen(false); }} className="mt-2 block rounded-full bg-[#6DD94B] px-6 py-3 text-center text-sm font-bold text-black">Pide tu propuesta</a>
        </div>
      )}
    </header>
  );
}

/* ───────────── HERO ───────────── */
function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-[#121212] pt-20">
      {/* Fondo interactivo de líneas animadas WebGL (Threads) en verde neón */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-70">
        <Threads
          color={[0.43, 0.85, 0.29]}
          amplitude={3.2}
          distance={0.12}
          enableMouseInteraction={true}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(60% 50% at 70% 30%, rgba(109,217,75,0.18), transparent 70%), radial-gradient(40% 40% at 10% 90%, rgba(13,132,74,0.30), transparent 70%)' }} />
      <div className="pointer-events-none absolute inset-0" style={{ backgroundSize: '64px 64px', backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)', maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)' }} />
      <div className="relative z-10 mx-auto grid min-h-[calc(100dvh-5rem)] max-w-[1280px] items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <Eyebrow dark>Software a medida para negocios de Huelva</Eyebrow>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[4.25rem]">
            Digitalizamos tu negocio, <span className="text-[#6DD94B]">a tu medida</span>
          </h1>
          <h2 className="mt-6 text-xl font-semibold text-zinc-200 sm:text-2xl">Tu próximo paso digital empieza aquí</h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Reserva de citas, cartas digitales, panel de administración y automatización con IA para peluquerías, restauración, clínicas y comercios locales. Más económico, personal y cercano que las grandes plataformas.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a href="#contacto" onClick={goTo('#contacto')} className="inline-flex items-center gap-2 rounded-full bg-[#6DD94B] px-8 py-4 text-sm font-bold text-black transition hover:bg-white">
              Calcula tu presupuesto <ArrowRight className="h-4 w-4" />
            </a>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-4 text-sm font-bold text-white transition hover:border-[#6DD94B] hover:text-[#6DD94B]">
              <MessageCircle className="h-4 w-4" /> Hablemos por WhatsApp
            </a>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-zinc-300">
            {['Desde 99 €', 'Sin comisiones', 'Presupuesto cerrado', 'Trato directo en Huelva'].map((t) => (
              <li key={t} className="flex items-center gap-2"><Check className="h-4 w-4 text-[#6DD94B]" />{t}</li>
            ))}
          </ul>
        </div>

        {/* Columna derecha: Escaparate rotatorio de webs y plantillas con el tamaño exacto del marco */}
        <div className="flex flex-col items-center justify-center lg:items-end w-full">
          <HeroShowcase />
        </div>
      </div>
      <a href="#por-que" onClick={goTo('#por-que')} aria-label="Bajar" className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-[#6DD94B] sm:block"><ChevronDown className="h-6 w-6 animate-bounce" /></a>
    </section>
  );
}

/* ───────────── POR QUÉ ───────────── */
function Why() {
  return (
    <section id="por-que" className="bg-white py-20 text-zinc-900 sm:py-28">
      <div className="mx-auto grid max-w-[1280px] gap-14 px-5 sm:px-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <Eyebrow>{WHY.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">{WHY.title}</h2>
          <p className="mt-6 text-lg leading-relaxed text-zinc-600">{WHY.text}</p>
          <ul className="mt-8 space-y-4">
            {WHY.bullets.map((b) => (
              <li key={b} className="flex items-start gap-4">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#6DD94B]"><Check className="h-4 w-4 text-black" /></span>
                <span className="text-zinc-700">{b}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-6">
          <div className="rounded-2xl bg-[#121212] p-8 text-white">
            <Heart className="h-8 w-8 text-[#6DD94B]" />
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#6DD94B]">{WHY.highlight.eyebrow}</p>
            <h3 className="mt-2 text-2xl font-bold">{WHY.highlight.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{WHY.highlight.text}</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {WHY.stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-zinc-200 p-5 text-center">
                <p className="text-3xl font-extrabold text-[#0D844A]">{s.value}</p>
                <p className="mt-1 text-xs font-medium text-zinc-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── PROYECTOS ───────────── */
function Projects({ onAction }) {
  return (
    <section id="proyectos" className="bg-[#f4f6f4] py-20 text-zinc-900 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><Eyebrow>{PROJECTS.eyebrow}</Eyebrow><h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">{PROJECTS.title}</h2></div>
          <a href="#contacto" onClick={goTo('#contacto')} className="inline-flex items-center gap-2 text-sm font-bold text-[#0D844A] hover:underline">Quiero algo así <ArrowRight className="h-4 w-4" /></a>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PROJECTS.items.map((p) => {
            const Wrapper = p.href ? 'a' : 'button';
            const props = p.href ? { href: p.href, target: '_blank', rel: 'noopener noreferrer' } : { type: 'button', onClick: () => onAction(p.action) };
            return (
              <Wrapper key={p.title} {...props} className={`group relative flex flex-col overflow-hidden rounded-2xl border p-7 text-left transition hover:-translate-y-1 hover:shadow-xl cursor-pointer ${p.featured ? "border-[#0D844A] bg-[#121212] text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.9)]" : 'border-zinc-200 bg-white'}`}>
                {p.featured && (<>
                  <img src="/demos/adrianmillan-local.jpg" alt="Captura real de adrianmillan.es" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-center brightness-110 transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
                </>)}
                <span className={`relative text-xs font-bold uppercase tracking-wider ${p.featured ? 'text-[#6DD94B]' : 'text-[#0D844A]'}`}>{p.tag}</span>
                <h3 className="relative mt-4 text-xl font-bold leading-snug">{p.title}</h3>
                <p className={`relative mt-3 flex-1 text-sm leading-relaxed ${p.featured ? 'text-zinc-200' : 'text-zinc-600'}`}>{p.text}</p>
                <p className={`relative mt-5 text-xs font-medium ${p.featured ? 'text-zinc-300' : 'text-zinc-500'}`}>{p.sector}</p>
                <div className="relative mt-3 flex flex-wrap gap-2">
                  {p.chips.map((c) => <span key={c} className={`rounded-full px-3 py-1 text-xs font-medium ${p.featured ? 'bg-white/10 text-zinc-200' : 'bg-zinc-100 text-zinc-700'}`}>{c}</span>)}
                </div>
                <span className={`relative mt-6 inline-flex items-center gap-2 text-sm font-bold ${p.featured ? 'text-[#6DD94B]' : 'text-[#0D844A]'}`}>
                  {p.href ? 'Visitar la web' : 'Ver demostración'} <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ───────────── SERVICIOS ───────────── */
function Services() {
  return (
    <section id="servicios" className="bg-[#121212] py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="max-w-2xl"><Eyebrow dark>{SERVICES.eyebrow}</Eyebrow><h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">{SERVICES.title}</h2><p className="mt-5 text-lg text-zinc-400">{SERVICES.text}</p></div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.items.map((s) => {
            const Icon = ICONS[s.icon] || Globe;
            return (
              <a key={s.title} href="#contacto" onClick={goTo('#contacto')} className="group rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-[#6DD94B]/60 hover:bg-white/[0.06]">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#6DD94B]/10 text-[#6DD94B] transition group-hover:bg-[#6DD94B] group-hover:text-black"><Icon className="h-6 w-6" /></span>
                <h3 className="mt-5 text-lg font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{s.text}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#6DD94B]">Más info <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ───────────── NEGOCIOS (equivalente a "Confían en nosotros") ───────────── */
function Sectors() {
  const loop = [...SECTORS.items, ...SECTORS.items];
  return (
    <section className="overflow-hidden bg-white py-16 text-zinc-900">
      <div className="mx-auto max-w-[1280px] px-5 text-center sm:px-8">
        <Eyebrow>{SECTORS.eyebrow}</Eyebrow>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">{SECTORS.title}</h2>
      </div>
      <div className="relative mt-10">
        <div className="flex w-max td-marquee gap-4">
          {loop.map((s, i) => (
            <span key={i} className="whitespace-nowrap rounded-full border border-zinc-200 bg-zinc-50 px-7 py-3 text-sm font-semibold text-zinc-700">{s}</span>
          ))}
        </div>
      </div>
      <style>{`.td-marquee{animation:tdmarquee 40s linear infinite}.td-marquee:hover{animation-play-state:paused}@keyframes tdmarquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}@media (prefers-reduced-motion:reduce){.td-marquee{animation:none}}`}</style>
    </section>
  );
}

/* ───────────── FAQ ───────────── */
function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="bg-white py-20 text-zinc-900 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <div className="text-center"><Eyebrow>{FAQ.eyebrow}</Eyebrow><h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{FAQ.title}</h2></div>
        <div className="mt-12 divide-y divide-zinc-200 border-y border-zinc-200">
          {FAQ.items.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-6 py-5 text-left cursor-pointer">
                  <span className="font-semibold">{f.q}</span>
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xl leading-none transition ${isOpen ? 'bg-[#0D844A] text-white' : 'bg-zinc-100 text-zinc-600'}`}>{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && <p className="pb-6 pr-12 leading-relaxed text-zinc-600">{f.a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ───────────── CTA + FORMULARIO ───────────── */
function Contact({ style, onNavigateToMultiwebs, onNavigateToCyS }) {
  return (
    <section id="contacto" className="relative overflow-hidden bg-[#121212] py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'radial-gradient(50% 50% at 15% 20%, rgba(109,217,75,0.14), transparent 70%)' }} />
      <div className="relative mx-auto grid max-w-[1280px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Eyebrow dark>HABLEMOS DE TU PROYECTO</Eyebrow>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">¿Tienes un negocio y quieres dar el salto digital?</h2>
          <p className="mt-6 text-lg leading-relaxed text-zinc-400">Cuéntanos cómo trabajas y te preparamos una propuesta a tu medida, con presupuesto cerrado y sin compromiso. Si prefieres hablar, escríbenos por WhatsApp.</p>
          <ul className="mt-8 space-y-4 text-zinc-300">
            <li className="flex items-center gap-3"><MapPin className="h-5 w-5 text-[#6DD94B]" /> {CONTACT.city}, Andalucía</li>
            <li className="flex items-center gap-3"><Mail className="h-5 w-5 text-[#6DD94B]" /> <a href={`mailto:${CONTACT.email}`} className="hover:text-white">{CONTACT.email}</a></li>
          </ul>
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#6DD94B] px-8 py-4 text-sm font-bold text-[#6DD94B] transition hover:bg-[#6DD94B] hover:text-black">
            <MessageCircle className="h-4 w-4" /> Hablemos por WhatsApp
          </a>
        </div>
        <LeadForm 
          style={style} 
          onNavigateToMultiwebs={onNavigateToMultiwebs}
          onNavigateToCyS={onNavigateToCyS}
        />
      </div>
    </section>
  );
}

/* ───────────── FOOTER ───────────── */
function Footer({ onPortal }) {
  return (
    <footer className="bg-black pt-16 pb-16 text-zinc-400 lg:pb-0">
      <div className="mx-auto grid max-w-[1280px] gap-12 px-5 sm:px-8 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div><Logo /><p className="mt-5 max-w-xs text-sm leading-relaxed">Software a medida, cercano y económico para los negocios de Huelva. Digitalizamos tu día a día.</p>
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#6DD94B] hover:underline"><MessageCircle className="h-4 w-4" />¡Hablemos por WhatsApp!</a></div>
        <nav aria-label="Empresa"><h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Empresa</h4>
          <ul className="mt-5 space-y-3 text-sm">
            {FOOTER.company.map((l) => <li key={l.label}><a href={l.href} onClick={goTo(l.href)} className="hover:text-white">{l.label}</a></li>)}
            <li><button onClick={onPortal} className="hover:text-white cursor-pointer">Área de clientes</button></li>
          </ul>
        </nav>
        <nav aria-label="Soluciones"><h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Soluciones</h4>
          <ul className="mt-5 space-y-3 text-sm">{FOOTER.solutions.map((l) => <li key={l}><a href="#contacto" onClick={goTo('#contacto')} className="hover:text-white">{l}</a></li>)}</ul></nav>
        <nav aria-label="Servicios"><h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Servicios</h4>
          <ul className="mt-5 space-y-3 text-sm">{SERVICES.items.slice(0, 7).map((s) => <li key={s.title}><a href="#servicios" onClick={goTo('#servicios')} className="hover:text-white">{s.title}</a></li>)}</ul></nav>
      </div>
      <div className="mx-auto mt-14 flex max-w-[1280px] flex-wrap items-center justify-between gap-4 border-t border-white/10 px-5 py-6 text-xs sm:px-8">
        <p>© {new Date().getFullYear()} TecnOdiel. Todos los derechos reservados.</p>
        <p className="flex gap-5"><span>Información legal</span><span>Política de privacidad</span><span>Política de cookies</span></p>
      </div>
    </footer>
  );
}

export default function HomePage({ onNavigateToMultiwebs, onNavigateToCyS, onNavigateToPortal, onNavigateToAdmin }) {
  // Llegada desde el popup de un preview: ?estilo=<slug> prellena el formulario y baja a él.
  const [style] = useState(() => {
    try { const slug = new URLSearchParams(window.location.search).get('estilo'); return slug ? findDemo(slug) : null; } catch { return null; }
  });
  useEffect(() => {
    if (!style) return;
    const t = setTimeout(() => document.querySelector('#contacto')?.scrollIntoView({ behavior: 'smooth' }), 400);
    return () => clearTimeout(t);
  }, [style]);
  const onAction = (a) => (a === 'clinicas' ? onNavigateToCyS : onNavigateToMultiwebs)?.();
  const onPortal = () => (onNavigateToPortal ? onNavigateToPortal() : (window.location.hash = '#/portal'));
  const account = useAccount();
  return (
    <div className="font-['Montserrat',Inter,system-ui,sans-serif] antialiased">
      <Header onPortal={onPortal} account={account} />
      <main>
        <Hero />
        <Sectors />
        <Demos />
        <Why />
        <HowItWorks />
        <Savings />
        <Projects onAction={onAction} />
        <Services />
        <Faq />
        <Contact 
          style={style} 
          onNavigateToMultiwebs={onNavigateToMultiwebs}
          onNavigateToCyS={onNavigateToCyS}
        />
      </main>
      <Footer onPortal={onPortal} />
      <MobileBar />
    </div>
  );
}
