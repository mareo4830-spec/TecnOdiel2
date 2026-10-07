import React, { useState } from 'react';
import { ArrowUpRight, Check, X, MessageCircle, Send, ClipboardList, Wand2, Rocket } from 'lucide-react';
import { waLink } from './content.js';

const goTo = (href) => (e) => {
  const el = document.querySelector(href);
  if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
};

const Eyebrow = ({ children, dark }) => (
  <span className={`inline-block text-xs font-bold uppercase tracking-[0.2em] ${dark ? 'text-[#6DD94B]' : 'text-[#0D844A]'}`}>{children}</span>
);

/* ───────── DEMOS EN VIVO (lo mejor de la versión de Mario: enseñar el producto) ───────── */
const DEMOS = {
  restauracion: {
    label: 'Bares y restaurantes',
    items: [
      { slug: 'noir-atelier', name: 'Cinematográfico', mood: 'Alta cocina, vídeo y fotos a pantalla completa', grad: 'from-zinc-900 to-black' },
      { slug: 'smash-destroy', name: 'Urbano', mood: 'Hamburgueserías y street food con mucha personalidad', grad: 'from-yellow-400 to-orange-500' },
      { slug: 'aura-velvet', name: 'Cristal', mood: 'Coctelería y locales de copas, moderno y elegante', grad: 'from-fuchsia-500 to-indigo-600' },
      { slug: 'le-maison', name: 'Editorial', mood: 'Estilo revista para bistrós y cocina de autor', grad: 'from-stone-200 to-stone-400' },
      { slug: 'cyber-fusion', name: 'Futurista', mood: 'Fusión y locales jóvenes que quieren destacar', grad: 'from-emerald-500 to-cyan-600' },
      { slug: 'casa-encina', name: 'Rústico', mood: 'Asadores y cocina tradicional, cálido y cercano', grad: 'from-amber-700 to-orange-900' }
    ]
  },
  salud: {
    label: 'Clínicas y bienestar',
    items: [
      { slug: 'swiss-dental', name: 'Minimal', mood: 'Limpio y profesional para clínicas dentales', grad: 'from-white to-zinc-300' },
      { slug: 'genome-biotech', name: 'Alta tecnología', mood: 'Medicina deportiva y centros de última generación', grad: 'from-slate-800 to-emerald-700' },
      { slug: 'pequenos-gigantes', name: 'Amable', mood: 'Pediatría y familias, colorido y cercano', grad: 'from-sky-400 to-pink-400' },
      { slug: 'espacio-vacio', name: 'Zen', mood: 'Psicología, spa y bienestar, sereno', grad: 'from-teal-200 to-teal-500' },
      { slug: 'aura-gold', name: 'Lujo', mood: 'Estética avanzada y tratamientos premium', grad: 'from-yellow-600 to-amber-900' },
      { slug: 'ortho-tech', name: 'Precisión', mood: 'Ortodoncia y traumatología con aire técnico', grad: 'from-blue-600 to-cyan-400' }
    ]
  }
};

export function Demos() {
  const [tab, setTab] = useState('restauracion');
  const d = DEMOS[tab];
  return (
    <section id="demos" className="bg-[#121212] py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Eyebrow dark>MIRA CÓMO QUEDARÍA TU WEB</Eyebrow>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">Elige el estilo que mejor te represente</h2>
            <p className="mt-5 text-lg text-zinc-400">Webs reales y funcionando. Ábrelas, tócalas y dinos cuál te gusta: la dejamos con tu logo, tus fotos y tus servicios. <strong className="text-white">Desde 99 €.</strong></p>
          </div>
          <div role="tablist" className="flex rounded-full border border-white/15 p-1">
            {Object.entries(DEMOS).map(([k, v]) => (
              <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition cursor-pointer ${tab === k ? 'bg-[#6DD94B] text-black' : 'text-zinc-300 hover:text-white'}`}>{v.label}</button>
            ))}
          </div>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {d.items.map((it) => (
            <a key={it.slug} href={`/?tenant=${it.slug}`} target="_blank" rel="noopener noreferrer"
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-[#6DD94B]/60">
              <div className={`relative flex h-40 items-end bg-gradient-to-br ${it.grad} p-5`}>
                <div className="absolute inset-x-5 top-4 flex gap-1.5"><span className="h-2 w-2 rounded-full bg-white/60" /><span className="h-2 w-2 rounded-full bg-white/40" /><span className="h-2 w-2 rounded-full bg-white/30" /></div>
                <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur">Demo en vivo</span>
              </div>
              <div className="p-6">
                <h3 className="flex items-center justify-between text-lg font-bold text-white">Estilo {it.name}<ArrowUpRight className="h-5 w-5 text-[#6DD94B] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></h3>
                <p className="mt-2 text-sm text-zinc-400">{it.mood}</p>
              </div>
            </a>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-zinc-500">¿No ves tu sector? Hacemos webs a medida para cualquier negocio local. <a href="#contacto" onClick={goTo('#contacto')} className="font-semibold text-[#6DD94B] hover:underline">Cuéntanos tu idea</a></p>
      </div>
    </section>
  );
}

/* ───────── CÓMO FUNCIONA ───────── */
export function HowItWorks() {
  const steps = [
    { icon: ClipboardList, title: 'Nos cuentas tu negocio', text: 'Rellenas el formulario o nos escribes por WhatsApp. Sin tecnicismos: solo cómo trabajas hoy.' },
    { icon: Wand2, title: 'Lo preparamos a tu medida', text: 'Elegimos contigo el estilo y las funciones. Te enseñamos el resultado antes de decidir nada.' },
    { icon: Rocket, title: 'Estás online en días', text: 'Tu web, tus reservas y tu panel funcionando, con formación y soporte directo en Huelva.' }
  ];
  return (
    <section className="bg-white py-20 text-zinc-900 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="text-center"><Eyebrow>CÓMO FUNCIONA</Eyebrow><h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">Digitalizarte es más fácil de lo que crees</h2></div>
        <ol className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="relative rounded-2xl border border-zinc-200 p-8">
              <span className="absolute -top-4 left-8 flex h-8 w-8 items-center justify-center rounded-full bg-[#0D844A] text-sm font-bold text-white">{i + 1}</span>
              <s.icon className="h-9 w-9 text-[#0D844A]" />
              <h3 className="mt-5 text-xl font-bold">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-zinc-600">{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12 text-center"><a href="#contacto" onClick={goTo('#contacto')} className="inline-flex rounded-full bg-[#0D844A] px-9 py-4 text-sm font-bold text-white transition hover:bg-[#09663a]">Empezar ahora, es gratis</a></div>
      </div>
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
