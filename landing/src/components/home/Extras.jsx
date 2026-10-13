import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, CalendarCheck, MessageCircle, BarChart3, Users, Bot, ShoppingBag, Megaphone, ArrowUpRight, Check, X, Send } from 'lucide-react';
import { waLink } from './content.js';

const goTo = (href) => (e) => {
  const el = document.querySelector(href);
  if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
};

const Eyebrow = ({ children, dark }) => (
  <span className={`inline-block text-xs font-bold uppercase tracking-[0.2em] ${dark ? 'text-[#6DD94B]' : 'text-[#0D844A]'}`}>{children}</span>
);

/* ───────── DEMOS EN VIVO (lo mejor de la versión de Mario: enseñar el producto) ───────── */
export const DEMOS = {
  restauracion: {
    label: 'Bares y restaurantes',
    items: [
      { slug: 'noir-atelier', name: 'Cinematográfico', mood: 'Alta cocina, vídeo y fotos a pantalla completa' },
      { slug: 'smash-destroy', name: 'Urbano', mood: 'Hamburgueserías y street food con mucha personalidad' },
      { slug: 'aura-velvet', name: 'Cristal', mood: 'Coctelería y locales de copas, moderno y elegante' },
      { slug: 'le-maison', name: 'Editorial', mood: 'Estilo revista para bistrós y cocina de autor' },
      { slug: 'cyber-fusion', name: 'Futurista', mood: 'Fusión y locales jóvenes que quieren destacar' },
      { slug: 'casa-encina', name: 'Rústico', mood: 'Asadores y cocina tradicional, cálido y cercano' }
    ]
  },
  salud: {
    label: 'Clínicas y bienestar',
    items: [
      { slug: 'swiss-dental', name: 'Minimal', mood: 'Limpio y profesional para clínicas dentales' },
      { slug: 'genome-biotech', name: 'Alta tecnología', mood: 'Medicina deportiva y centros de última generación' },
      { slug: 'pequenos-gigantes', name: 'Amable', mood: 'Pediatría y familias, colorido y cercano' },
      { slug: 'espacio-vacio', name: 'Zen', mood: 'Psicología, spa y bienestar, sereno' },
      { slug: 'aura-gold', name: 'Lujo', mood: 'Estética avanzada y tratamientos premium' },
      { slug: 'ortho-tech', name: 'Precisión', mood: 'Ortodoncia y traumatología con aire técnico' }
    ]
  }
};

/** Busca un estilo por slug (para prellenar el formulario desde el popup del preview). */
export const findDemo = (slug) => {
  for (const [group, v] of Object.entries(DEMOS)) {
    const item = v.items.find((i) => i.slug === slug);
    if (item) return { ...item, group };
  }
  return null;
};

/* ───────── ESCAPARATE DE SERVICIOS (carrusel infinito de tarjetas con maquetas ilustradas, estilo Squarespace) ───────── */

/** Tarjetita blanca flotante (aviso, pago, recordatorio…). */
const Chip = ({ className = '', style, children }) => (
  <div className={`svc-float absolute flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-[10px] font-semibold text-zinc-800 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6)] sm:text-xs ${className}`} style={style}>{children}</div>
);

/** Web de mentira con marco redondeado, barra de menú y contenido ilustrado. */
const Site = ({ bg = '#f4f6f4', ink = '#121212', brand, nav = [], children, className = '' }) => (
  <div className={`overflow-hidden rounded-md shadow-[0_45px_100px_-30px_rgba(0,0,0,0.85)] ${className}`} style={{ background: bg, color: ink }}>
    <div className="flex items-center justify-between px-4 py-2.5 text-[7px] uppercase tracking-[0.18em] sm:px-5 sm:py-3 sm:text-[9px]">
      <span className="font-extrabold">{brand}</span>
      <span className="flex gap-3 opacity-60">{nav.map((n) => <span key={n}>{n}</span>)}</span>
    </div>
    {children}
  </div>
);

const Btn = ({ children, bg = '#0D844A', fg = '#fff' }) => (
  <span className="inline-block rounded-full px-3 py-1.5 text-[7px] font-bold uppercase tracking-[0.12em] sm:text-[9px]" style={{ background: bg, color: fg }}>{children}</span>
);

const Hl = ({ children, c = '#0D844A' }) => <span style={{ color: c }}>{children}</span>;

const QR_CELLS = '111011101001101110100111010111001101001011110011010110111010100101101011101100'.split('');
const QrMock = () => (
  <div className="grid grid-cols-9 gap-[2px] rounded-md bg-white p-2">
    {QR_CELLS.map((c, i) => <span key={i} className={`h-[6px] w-[6px] sm:h-2 sm:w-2 ${c === '1' ? 'bg-zinc-900' : 'bg-transparent'}`} />)}
  </div>
);

const MiniCalendar = ({ className = '', style }) => (
  <div className={`svc-float absolute rounded-lg bg-white p-3 text-zinc-800 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6)] ${className}`} style={style}>
    <p className="text-[10px] font-bold sm:text-xs">Octubre</p>
    <div className="mt-2 grid grid-cols-7 gap-x-2 gap-y-1 text-center text-[8px] text-zinc-400 sm:text-[9px]">
      {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d, i) => <span key={i} className="font-semibold">{d}</span>)}
      {Array.from({ length: 14 }, (_, i) => i + 12).map((d) => (
        <span key={d} className={d === 16 ? 'rounded-full bg-[#0D844A] font-bold text-white' : 'text-zinc-700'}>{d}</span>
      ))}
    </div>
  </div>
);

const Mock = {
  reservas: () => (
    <>
      <Site brand="Tu Negocio" nav={['Servicios', 'Equipo', 'Reservas']} className="w-[88%] max-w-[680px]">
        <div className="flex items-end gap-4 px-5 pb-0 pt-3 sm:px-7">
          <div className="pb-6 sm:pb-8">
            <p className="text-[20px] font-extrabold leading-[1.05] tracking-tight sm:text-[34px]">Reserva tu cita<br /><Hl>en 30 segundos</Hl></p>
            <p className="mt-2 text-[8px] text-zinc-500 sm:text-[11px]">Elige profesional, día y hora.</p>
            <div className="mt-3 sm:mt-4"><Btn>Reservar cita</Btn></div>
          </div>
          <div className="ml-auto flex items-end gap-2">
            <div className="h-24 w-14 rounded-t-full sm:h-36 sm:w-20" style={{ background: 'linear-gradient(180deg,#6DD94B,#0D844A)' }} />
            <div className="h-16 w-12 rounded-t-full sm:h-24 sm:w-16" style={{ background: 'linear-gradient(180deg,#1f2a24,#121212)' }} />
          </div>
        </div>
      </Site>
      <MiniCalendar className="bottom-6 left-2 sm:bottom-10 sm:left-[4%]" />
      <Chip className="right-2 top-6 sm:right-[4%]" style={{ animationDelay: '-2s' }}><CalendarCheck className="h-4 w-4 text-[#0D844A]" />Cita confirmada · Jue 17:30</Chip>
      <Chip className="bottom-14 right-2 !rounded-full !px-4 sm:right-[8%]" style={{ animationDelay: '-3s' }}>Sin llamadas</Chip>
    </>
  ),
  carta: () => (
    <>
      <Site bg="#121212" ink="#ffffff" brand="Casa del Mar" nav={['Carta', 'Vinos', 'Reservas']} className="w-[88%] max-w-[680px] ring-1 ring-white/10">
        <div className="grid grid-cols-5 gap-5 px-5 pb-6 pt-2 sm:px-7 sm:pb-8">
          <div className="col-span-3">
            <p className="text-[20px] font-extrabold leading-none tracking-tight sm:text-[32px]">Nuestra <Hl c="#6DD94B">carta</Hl></p>
            <div className="mt-3 space-y-2 sm:mt-4">
              {[['Croquetas caseras', '9 €'], ['Gambas de Huelva', '16 €'], ['Arroz con choco', '14 €'], ['Tarta de queso', '6 €']].map(([k, v]) => (
                <div key={k} className="flex items-baseline gap-2 text-[8px] sm:text-[11px]"><span>{k}</span><span className="flex-1 border-b border-dotted border-white/25" /><span className="font-bold text-[#6DD94B]">{v}</span></div>
              ))}
            </div>
          </div>
          <div className="col-span-2 flex items-end justify-center">
            <div className="h-28 w-full rounded-t-full sm:h-40" style={{ background: 'radial-gradient(circle at 50% 30%,#6DD94B,#0D844A 60%,#06361e)' }} />
          </div>
        </div>
      </Site>
      <div className="svc-float absolute bottom-5 left-2 rounded-lg bg-white p-2 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6)] sm:bottom-10 sm:left-[5%]"><QrMock /><p className="mt-1 text-center text-[9px] font-bold text-zinc-700">Escanea la carta</p></div>
      <Chip className="right-2 top-6 sm:right-[4%]" style={{ animationDelay: '-3s' }}><Check className="h-4 w-4 text-[#0D844A]" />Carta actualizada al instante</Chip>
    </>
  ),
  panel: () => (
    <>
      <Site brand="Panel · Mi negocio" nav={['Hoy', 'Agenda', 'Gastos']} className="w-[88%] max-w-[680px]">
        <div className="flex">
          <div className="w-1/5 space-y-1.5 bg-[#121212] p-2.5 sm:p-3">{['Agenda', 'Personal', 'Servicios', 'Gastos'].map((t, i) => <div key={t} className={`rounded px-1.5 py-1 text-[7px] font-semibold sm:text-[9px] ${i === 0 ? 'bg-[#6DD94B] text-black' : 'bg-white/10 text-white/80'}`}>{t}</div>)}</div>
          <div className="flex-1 bg-white p-3 sm:p-4">
            <div className="grid grid-cols-3 gap-2">{[['Citas hoy', '18'], ['Ingresos', '640 €'], ['Nuevos', '+7']].map(([k, v]) => <div key={k} className="rounded-md bg-[#f4f6f4] p-2"><p className="text-[7px] text-zinc-500 sm:text-[9px]">{k}</p><p className="text-xs font-extrabold sm:text-base">{v}</p></div>)}</div>
            <div className="mt-3 flex h-16 items-end gap-1.5 rounded-md bg-[#f4f6f4] p-2 sm:h-24">{[40, 65, 50, 80, 60, 95, 70].map((h, i) => <span key={i} className="flex-1 rounded-t-sm bg-[#0D844A]" style={{ height: `${h}%`, opacity: 0.5 + i * 0.07 }} />)}</div>
          </div>
        </div>
      </Site>
      <Chip className="right-2 top-6 sm:right-[4%]"><BarChart3 className="h-4 w-4 text-[#0D844A]" />+32 % citas este mes</Chip>
      <Chip className="bottom-5 left-2 sm:bottom-10 sm:left-[4%]" style={{ animationDelay: '-2s' }}><Users className="h-4 w-4 text-[#0D844A]" />Personal y horarios</Chip>
    </>
  ),
  tienda: () => (
    <>
      <Site bg="#f4f6f4" brand="Mi Tienda" nav={['Productos', 'Ofertas', 'Carrito']} className="w-[88%] max-w-[680px]">
        <div className="px-5 pb-6 pt-1 sm:px-7 sm:pb-8">
          <p className="text-[16px] font-extrabold tracking-tight sm:text-[26px]">Productos <Hl>destacados</Hl></p>
          <div className="mt-3 grid grid-cols-3 gap-3 sm:mt-4 sm:gap-4">
            {[['#6DD94B', '#0D844A', '24 €'], ['#2a2f2c', '#121212', '38 €'], ['#a8e88f', '#3f9a5b', '19 €']].map(([a, b, pr], i) => (
              <div key={i}>
                <div className="flex h-20 items-center justify-center rounded-md bg-white sm:h-32"><span className="h-10 w-10 rounded-full sm:h-16 sm:w-16" style={{ background: `radial-gradient(circle at 35% 30%,${a},${b})` }} /></div>
                <p className="mt-1 flex justify-between text-[7px] font-semibold sm:text-[10px]"><span>Producto {i + 1}</span><span>{pr}</span></p>
              </div>
            ))}
          </div>
        </div>
      </Site>
      <Chip className="bottom-5 left-2 sm:bottom-10 sm:left-[4%]"><ShoppingBag className="h-4 w-4 text-[#0D844A]" />Pedido nuevo · 38,50 €</Chip>
      <div className="svc-float absolute right-2 top-6 flex items-center gap-1.5 rounded-lg bg-white p-2 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6)] sm:right-[4%]" style={{ animationDelay: '-3s' }}>
        <span className="rounded bg-[#1a1f71] px-1.5 py-1 text-[9px] font-black italic text-white">VISA</span>
        <span className="relative h-5 w-8"><span className="absolute left-0 h-5 w-5 rounded-full bg-[#eb001b]" /><span className="absolute left-3 h-5 w-5 rounded-full bg-[#f79e1b]/90" /></span>
        <span className="rounded bg-black px-1.5 py-1 text-[9px] font-bold text-white">Pay</span>
      </div>
    </>
  ),
  ia: () => (
    <>
      <div className="w-[50%] max-w-[300px] rounded-[26px] bg-zinc-950 p-2 shadow-[0_45px_100px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/15">
        <div className="space-y-2 rounded-[20px] bg-[#0b141a] p-3 sm:p-4">
          <p className="flex items-center gap-2 text-[10px] font-bold text-white"><Bot className="h-4 w-4 text-[#6DD94B]" />Asistente</p>
          <p className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white/10 px-3 py-2 text-[10px] text-white sm:text-xs">¿Tenéis hueco mañana por la tarde?</p>
          <p className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-[#0D844A] px-3 py-2 text-[10px] text-white sm:text-xs">Sí. Te reservo mañana a las 17:30. ¿Lo confirmo?</p>
          <p className="max-w-[60%] rounded-2xl rounded-tl-sm bg-white/10 px-3 py-2 text-[10px] text-white sm:text-xs">¿Y cuánto cuesta el pack?</p>
          <p className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-[#0D844A] px-3 py-2 text-[10px] text-white sm:text-xs">45 €. Te mando el enlace para reservarlo.</p>
        </div>
      </div>
      <Chip className="bottom-6 left-2 sm:bottom-12 sm:left-[12%]"><Bot className="h-4 w-4 text-[#0D844A]" />Responde 24/7 por WhatsApp</Chip>
      <Chip className="right-2 top-6 sm:right-[12%]" style={{ animationDelay: '-2.5s' }}><Check className="h-4 w-4 text-[#0D844A]" />Cita y venta cerradas solas</Chip>
    </>
  ),
  marketing: () => (
    <>
      <Site brand="Campañas" nav={['Borradores', 'Enviadas', 'Clientes']} className="w-[88%] max-w-[680px]">
        <div className="grid grid-cols-5 gap-4 px-5 pb-6 pt-2 sm:px-7 sm:pb-8">
          <div className="col-span-3 overflow-hidden rounded-md bg-white shadow-sm">
            <div className="flex h-20 items-center justify-between px-4 sm:h-32" style={{ background: 'linear-gradient(120deg,#0D844A,#6DD94B)' }}>
              <p className="text-2xl font-extrabold leading-none text-white sm:text-5xl">-20 %</p>
              <Megaphone className="h-8 w-8 text-white/90 sm:h-14 sm:w-14" />
            </div>
            <div className="space-y-1.5 p-3 sm:p-4">
              <p className="text-[9px] font-extrabold sm:text-sm">Este fin de semana, tu cliente favorito</p>
              <span className="block h-1.5 w-full rounded bg-zinc-200" /><span className="block h-1.5 w-4/5 rounded bg-zinc-200" />
              <div className="pt-1"><Btn>Reservar ahora</Btn></div>
            </div>
          </div>
          <div className="col-span-2 space-y-2">
            {[['Enviados', '248'], ['Abiertos', '62 %'], ['Reservas', '31']].map(([k, v]) => (
              <div key={k} className="rounded-md bg-[#121212] p-2 text-white sm:p-3"><p className="text-[7px] text-white/60 sm:text-[9px]">{k}</p><p className="text-sm font-extrabold text-[#6DD94B] sm:text-xl">{v}</p></div>
            ))}
          </div>
        </div>
      </Site>
      <Chip className="right-2 top-6 sm:right-[4%]"><Send className="h-4 w-4 text-[#0D844A]" />Enviada a 248 clientes</Chip>
      <Chip className="bottom-5 left-2 sm:bottom-10 sm:left-[4%]" style={{ animationDelay: '-2.5s' }}><MessageCircle className="h-4 w-4 text-[#25D366]" />WhatsApp y email</Chip>
    </>
  )
};

const SHOWCASE = [
  { key: 'reservas', title: 'Reservas automáticas', text: 'Tus clientes piden cita desde el móvil a cualquier hora, con agenda por profesional y recordatorios. Sin llamadas ni comisiones.', bg: 'linear-gradient(120deg,#0a0a0a 0%,#0c2418 55%,#0D844A 130%)' },
  { key: 'carta', title: 'Carta y menú digital', text: 'Una carta con QR siempre al día, con fotos y alérgenos, y pedidos directos a tu WhatsApp sin pagar a terceros.', bg: 'linear-gradient(120deg,#0a0a0a 0%,#14230f 55%,#3f8a2c 130%)' },
  { key: 'panel', title: 'Gestiona todo en un panel', text: 'Personal, servicios, horarios, notificaciones y gastos en un único panel claro, sin hojas de cálculo.', bg: 'linear-gradient(120deg,#0a0a0a 0%,#0e2a22 55%,#1b8a62 130%)' },
  { key: 'tienda', title: 'Tienda online', text: 'Catálogo, pedidos y cobros integrados en tu web. Tus clientes compran y tú te quedas con todo el margen.', bg: 'linear-gradient(120deg,#0a0a0a 0%,#1a2a0b 55%,#5fb83a 130%)' },
  { key: 'ia', title: 'Automatización con IA para ventas y citas', text: 'Un asistente que atiende a tus clientes por WhatsApp, agenda citas y cierra ventas mientras tú trabajas.', bg: 'linear-gradient(120deg,#0a0a0a 0%,#0b2a2a 55%,#0f8f7a 130%)' },
  { key: 'marketing', title: 'Campañas de marketing para tus clientes', text: 'Envía promociones por WhatsApp y email a tus clientes y mide cuántos las abren y cuántos reservan.', bg: 'linear-gradient(120deg,#0a0a0a 0%,#162b0c 55%,#6DD94B 140%)' }
];

/** Carrusel infinito de tarjetas anchas (3 copias + salto sin animar al llegar a un extremo). */
function InfiniteCarousel({ slides, label, renderCard }) {
  const n = slides.length;
  const [i, setI] = useState(n);
  const [anim, setAnim] = useState(true);
  const [paused, setPaused] = useState(false);
  const drag = useRef(null);
  const items = [...slides, ...slides, ...slides];
  const go = (d) => { setAnim(true); setI((v) => v + d); };
  const goToDot = (k) => {
    let d = (((k - i) % n) + n) % n;
    if (d > n / 2) d -= n;
    go(d);
  };

  useEffect(() => {
    if (paused || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    const t = setInterval(() => { setAnim(true); setI((v) => v + 1); }, 5500);
    return () => clearInterval(t);
  }, [paused]);

  useEffect(() => {
    if (anim) return undefined;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setAnim(true)));
    return () => cancelAnimationFrame(id);
  }, [anim]);

  const onEnd = (e) => {
    if (e.target !== e.currentTarget || e.propertyName !== 'transform') return;
    if (i >= 2 * n) { setAnim(false); setI(i - n); }
    else if (i < n) { setAnim(false); setI(i + n); }
  };
  const cur = ((i % n) + n) % n;

  return (
    <>
      <div
        className="relative mt-12 select-none"
        style={{ '--w': 'clamp(300px, 74vw, 1040px)', '--g': '12px', touchAction: 'pan-y' }}
        onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
        onPointerDown={(e) => { drag.current = e.clientX; }}
        onPointerUp={(e) => { if (drag.current != null) { const dx = e.clientX - drag.current; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); } drag.current = null; }}
        onPointerCancel={() => { drag.current = null; }}
        role="region" aria-roledescription="carrusel" aria-label={label}
      >
        <div onTransitionEnd={onEnd}
          className={`flex ${anim ? 'transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]' : ''}`}
          style={{ gap: 'var(--g)', marginLeft: 'calc(50% - var(--w) / 2)', transform: `translateX(calc(${i} * (var(--w) + var(--g)) * -1))` }}>
          {items.map((c, k) => {
            const active = k === i;
            return (
              <article key={`${c.key}-${Math.floor(k / n)}`} aria-hidden={!active} onClick={() => !active && go(k - i)}
                className={`relative h-[500px] shrink-0 overflow-hidden rounded-md transition-opacity duration-700 sm:h-[560px] ${active ? 'opacity-100' : 'cursor-pointer opacity-55'}`}
                style={{ width: 'var(--w)', background: c.bg }}>
                {renderCard(c, active)}
              </article>
            );
          })}
        </div>

        <button onClick={() => go(-1)} aria-label="Anterior" className="absolute left-3 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-[#6DD94B] hover:text-black md:flex"><ChevronLeft className="h-5 w-5" /></button>
        <button onClick={() => go(1)} aria-label="Siguiente" className="absolute right-3 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-[#6DD94B] hover:text-black md:flex"><ChevronRight className="h-5 w-5" /></button>
      </div>

      <div className="mt-6 flex justify-center gap-2" role="tablist" aria-label="Elegir diapositiva">
        {slides.map((c, k) => (
          <button key={c.key} role="tab" aria-selected={k === cur} aria-label={c.title} onClick={() => goToDot(k)}
            className={`h-1.5 w-1.5 cursor-pointer rounded-full transition ${k === cur ? 'bg-[#6DD94B]' : 'bg-white/30 hover:bg-white/60'}`} />
        ))}
      </div>
    </>
  );
}

const FLOAT_CSS = '@keyframes svc-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}.svc-float{animation:svc-float 6s ease-in-out infinite}@media (prefers-reduced-motion:reduce){.svc-float{animation:none}}';

export function Demos() {
  return (
    <section id="demos" className="overflow-hidden bg-[#121212] py-20 sm:py-28">
      <style>{FLOAT_CSS}</style>
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="max-w-2xl">
          <Eyebrow dark>MIRA CÓMO QUEDARÍA TU WEB</Eyebrow>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">Todo lo que tu negocio necesita, en un solo lugar</h2>
          <p className="mt-5 text-lg text-zinc-400">Web, reservas, carta, panel y automatización con IA, hechos a tu medida. <strong className="text-white">Desde 99 €.</strong></p>
        </div>
      </div>
      <InfiniteCarousel slides={SHOWCASE} label="Servicios de TecnOdiel" renderCard={(c) => {
        const Mk = Mock[c.key];
        return (
          <>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_10%,rgba(109,217,75,0.18),transparent_55%),radial-gradient(ellipse_at_50%_120%,rgba(0,0,0,0.6),transparent_60%)]" />
            <div className="relative z-10 max-w-[19rem] p-6 sm:p-9">
              <h3 className="text-xl font-bold leading-tight text-white sm:text-2xl">{c.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-white/70">{c.text}</p>
            </div>
            <div className="absolute inset-x-0 bottom-0 top-[24%] flex items-center justify-center">
              <div className="relative flex w-full justify-center pb-6"><Mk /></div>
            </div>
            <a href="#contacto" onClick={goTo('#contacto')} aria-label={`Quiero: ${c.title}`}
              className="absolute bottom-5 right-5 z-20 flex h-9 w-9 items-center justify-center rounded-full text-white/90 transition hover:bg-[#6DD94B] hover:text-black">
              <ArrowRight className="h-5 w-5" />
            </a>
          </>
        );
      }} />
      <p className="mt-8 px-5 text-center text-sm text-zinc-500">¿No ves tu sector? Hacemos webs a medida para cualquier negocio local. <a href="#contacto" onClick={goTo('#contacto')} className="font-semibold text-[#6DD94B] hover:underline">Cuéntanos tu idea</a></p>
    </section>
  );
}

/* ───────── ELIGE TU ESTILO (demos en vivo, mismo carrusel infinito) ───────── */
export function HowItWorks() {
  const [tab, setTab] = useState('restauracion');
  const slides = DEMOS[tab].items.map((it) => ({
    key: it.slug, title: `Estilo ${it.name}`, text: it.mood, slug: it.slug,
    bg: 'linear-gradient(120deg,#0a0a0a 0%,#0c2418 60%,#0D844A 140%)'
  }));
  return (
    <section id="estilos" className="overflow-hidden bg-[#121212] py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Eyebrow dark>ELIGE TU ESTILO</Eyebrow>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">Elige el estilo que mejor te represente</h2>
            <p className="mt-5 text-lg text-zinc-400">Webs reales y funcionando. Ábrelas, tócalas y dinos cuál te gusta: la dejamos con tu logo, tus fotos y tus servicios. <strong className="text-white">Desde 99 €.</strong></p>
          </div>
          <div role="tablist" className="flex rounded-full border border-white/15 p-1">
            {Object.entries(DEMOS).map(([k, v]) => (
              <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
                className={`cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold transition ${tab === k ? 'bg-[#6DD94B] text-black' : 'text-zinc-300 hover:text-white'}`}>{v.label}</button>
            ))}
          </div>
        </div>
      </div>
      <InfiniteCarousel key={tab} slides={slides} label="Estilos de web" renderCard={(c) => (
        <>
          <img src={`/demos/${c.slug}.jpg`} alt={`Vista previa del estilo ${c.title}`} loading="lazy" draggable="false" className="absolute inset-0 h-full w-full object-cover object-top" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/90 via-black/35 to-black/80" />
          <div className="relative z-10 max-w-[19rem] p-6 sm:p-9">
            <h3 className="text-xl font-bold leading-tight text-white sm:text-2xl">{c.title}</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-white/75">{c.text}</p>
          </div>
          <span className="absolute right-5 top-5 z-10 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">Demo en vivo</span>
          <a href={`/?tenant=${c.slug}`} target="_blank" rel="noopener noreferrer" aria-label={`Abrir demo ${c.title}`}
            className="absolute bottom-5 left-6 z-20 inline-flex items-center gap-2 rounded-full bg-[#6DD94B] px-5 py-2.5 text-sm font-bold text-black transition hover:bg-white sm:left-9">
            Abrir demo <ArrowUpRight className="h-4 w-4" />
          </a>
        </>
      )} />
      <p className="mt-8 px-5 text-center text-sm text-zinc-500">¿No ves tu sector? Hacemos webs a medida para cualquier negocio local. <a href="#contacto" onClick={goTo('#contacto')} className="font-semibold text-[#6DD94B] hover:underline">Cuéntanos tu idea</a></p>
    </section>
  );
}

/* ───────── CALCULADORA DE AHORRO + COMPARATIVA ───────── */
const ROWS = [
  ['Comisión por cada cita o reserva', '0 €', 'Habitual'],
  ['Diseño y funciones a tu medida', true, false],
  ['Tus clientes y tus datos son tuyos', true, false],
  ['Hablas con quien lo construye (Huelva)', true, false],
  ['Te ayudamos si nunca has usado software', true, false],
  ['Precio de partida', 'Desde 99 €', 'Cuota + comisiones']
];

export function Savings() {
  const [monthly, setMonthly] = useState(120);
  const yearly = Math.max(0, Number(monthly) || 0) * 12;
  return (
    <section className="bg-[#f4f6f4] py-20 text-zinc-900 sm:py-28">
      <div className="mx-auto grid max-w-[1280px] gap-12 px-5 sm:px-8 lg:grid-cols-2">
        <div>
          <Eyebrow>CALCULA TU AHORRO</Eyebrow>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">¿Cuánto te cuestan hoy las comisiones y cuotas?</h2>
          <p className="mt-4 text-zinc-600">Pon lo que pagas al mes a plataformas de reservas o pedidos (cuotas + comisiones).</p>
          <label htmlFor="sv" className="mt-8 block text-sm font-semibold">Pago mensual actual: <span className="text-[#0D844A]">{Number(monthly).toLocaleString('es-ES')} €</span></label>
          <input id="sv" type="range" min="0" max="600" step="10" value={monthly} onChange={(e) => setMonthly(e.target.value)} className="mt-3 w-full accent-[#0D844A]" />
          <div className="mt-8 rounded-2xl bg-[#121212] p-8 text-white">
            <p className="text-sm text-zinc-400">Con una solución propia dejarías de pagar comisiones: hasta</p>
            <p className="mt-2 text-5xl font-extrabold text-[#6DD94B]">{yearly.toLocaleString('es-ES')} €<span className="text-xl font-semibold text-zinc-400"> / año</span></p>
            <p className="mt-2 text-xs text-zinc-500">Estimación orientativa: el ahorro real depende de tu caso y de lo que contrates con nosotros.</p>
            <a href={waLink(`Hola, pago unos ${monthly} €/mes en plataformas y quiero saber cuánto ahorraría.`)} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#6DD94B] px-7 py-3.5 text-sm font-bold text-black hover:bg-white"><MessageCircle className="h-4 w-4" />Quiero ahorrar esto</a>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Comparativa TecnOdiel frente a plataformas con comisión</caption>
            <thead><tr className="bg-[#121212] text-white"><th className="p-4 font-semibold"> </th><th className="p-4 font-bold text-[#6DD94B]">TecnOdiel</th><th className="p-4 font-semibold text-zinc-300">Plataformas grandes</th></tr></thead>
            <tbody className="divide-y divide-zinc-200">
              {ROWS.map(([k, a, b]) => (
                <tr key={k}>
                  <th scope="row" className="p-4 font-medium text-zinc-700">{k}</th>
                  {[a, b].map((v, i) => (
                    <td key={i} className={`p-4 ${i === 0 ? 'font-bold text-[#0D844A]' : 'text-zinc-500'}`}>
                      {v === true ? <Check className="h-5 w-5 text-[#0D844A]" aria-label="Sí" /> : v === false ? <X className="h-5 w-5 text-red-400" aria-label="No" /> : v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ───────── BARRA MÓVIL FIJA (el contacto siempre a un toque) ───────── */
export function MobileBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-white/10 bg-[#121212]/95 p-3 backdrop-blur lg:hidden" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
      <a href={waLink()} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#6DD94B] py-3 text-sm font-bold text-[#6DD94B]"><MessageCircle className="h-4 w-4" />WhatsApp</a>
      <a href="#contacto" onClick={goTo('#contacto')} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#6DD94B] py-3 text-sm font-bold text-black"><Send className="h-4 w-4" />Presupuesto</a>
    </div>
  );
}
