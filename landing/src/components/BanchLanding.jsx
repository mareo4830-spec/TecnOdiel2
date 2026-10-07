import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  Utensils, 
  Stethoscope, 
  Globe, 
  Zap, 
  Search, 
  Smartphone, 
  ShieldCheck, 
  ShoppingBag, 
  HeartHandshake, 
  Check, 
  ChevronDown, 
  Layers, 
  Database, 
  Sparkles, 
  Phone, 
  Send,
  Building2,
  Clock,
  ExternalLink,
  Lock
} from 'lucide-react';

/**
 * ESTÉTICA EXACTA BANCH BAUSOLA (https://banch.bausola.com/?ref=onepagelove)
 * Adaptada a la plataforma TecnOdiel:
 * - Tipografía industrial mayúscula contundente
 * - Colores oficiales: Verde Neón (#6DD94B), Verde Oscuro (#0D844A), Negro Grafito (#232323 / #121212) y Blanco Puro (#FFFFFF)
 * - Header fijo con Payoff centrado "IMAGINE TOMORROW // HUELVA" y botones perimetrales con borde fino
 * - Text masking de titulares titánicos (What's in the / future of / web architecture?)
 * - Paneles de 600px en gris con títulos verdes de 80px
 * - Bloque de cristal translúcido (glass)
 * - Bloque verde masivo "MADE TO PERFORM HIGHER"
 * - Sección "¿Por qué TecnOdiel?" de 2 columnas
 * - Tabla técnica minimalista blanca con numeración 01-08 y líneas verdes
 * - Sección CTA con títulos enormes
 * - Formulario de contacto con inputs de línea inferior blanca sin fondo
 * - Footer colosal Banch
 */
export default function BanchLanding({ 
  onNavigateToMultiwebs, 
  onNavigateToCyS, 
  onOpenAudit,
  onNavigateToPortal
}) {
  const [activePanel, setActivePanel] = useState(1);
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    platform: 'hosteleria',
    message: '',
    privacy: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.privacy) {
      alert('Por favor, acepta la política de privacidad para continuar.');
      return;
    }
    setFormSent(true);
  };

  return (
    <div className="w-full bg-[#121212] text-white font-sans selection:bg-[#6DD94B] selection:text-black overflow-x-hidden">
      {/* ── HEADER FIJO IDÉNTICO A BANCH BAUSOLA ── */}
      <header className="fixed top-0 left-0 w-full h-[90px] sm:h-[100px] z-[9999] border-b border-white/10 bg-[#121212]/85 backdrop-blur-md">
        <div className="max-w-[1440px] h-full mx-auto px-4 sm:px-8 flex items-center justify-between relative">
          {/* Logo & Símbolo */}
          <div className="flex items-center gap-3">
            <span className="h-8 w-8 sm:h-9 sm:w-9 rounded-sm bg-[#6DD94B] text-black font-black flex items-center justify-center text-sm font-mono tracking-tighter">
              TO
            </span>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-widest text-sm sm:text-base uppercase text-white font-mono">
                TECNODIEL
              </span>
              <span className="text-[9px] font-mono tracking-widest text-[#6DD94B] uppercase -mt-0.5">
                WEB ARCHITECTURE
              </span>
            </div>
          </div>

          {/* Payoff Centrado en Desktop (Banch: "IMAGINE TOMORROW") */}
          <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 text-center text-xs uppercase tracking-[0.2em] font-mono text-zinc-400 font-medium">
            IMAGINE TOMORROW // HUELVA & SEVILLA
          </div>

          {/* Navegación y Botón Banch */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Selector de Plataformas */}
            <div className="hidden sm:flex items-center gap-4 text-xs uppercase font-mono tracking-wider text-zinc-400">
              <button 
                onClick={onNavigateToMultiwebs}
                className="hover:text-[#6DD94B] transition-colors cursor-pointer"
              >
                Hostelería
              </button>
              <span className="text-zinc-600">/</span>
              <button 
                onClick={onNavigateToCyS}
                className="hover:text-[#6DD94B] transition-colors cursor-pointer"
              >
                Clínicas
              </button>
              <span className="text-zinc-600">/</span>
              <button 
                onClick={onNavigateToPortal}
                className="hover:text-[#6DD94B] transition-colors cursor-pointer"
              >
                Portal
              </button>
            </div>

            {/* Botón Estilo Banch con borde fino blanco */}
            <button
              onClick={onOpenAudit}
              className="border border-white hover:border-[#6DD94B] px-4 sm:px-7 py-3 text-xs sm:text-sm font-mono uppercase tracking-widest text-white hover:bg-white hover:text-[#0D844A] transition-all duration-300 cursor-pointer"
            >
              Desde 99€
            </button>

            {/* Caja cuadrada verde de acción rápida Banch */}
            <button
              onClick={onOpenAudit}
              className="h-10 w-10 sm:h-12 sm:w-12 bg-[#6DD94B] hover:bg-[#38d600] text-black flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shrink-0"
              title="Solicitar presupuesto o demo"
            >
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── SECCIÓN 1: HERO IDÉNTICO A BANCH ── */}
      <section className="relative min-h-[100dvh] pt-[120px] sm:pt-[140px] pb-16 px-4 sm:px-8 max-w-[1440px] mx-auto flex flex-col justify-between">
        <div className="my-auto space-y-6 sm:space-y-8">
          {/* Subtítulo introductorio con text-masking */}
          <div className="space-y-1">
            <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.25em] text-[#6DD94B] block">
              // SOFTWARE MULTI-TENANT PARA NEGOCIOS REALES
            </span>
            <p className="text-zinc-400 font-mono text-xs uppercase tracking-wider">
              WHAT'S IN THE FUTURE OF WEB PLATFORMS?
            </p>
          </div>

          {/* TÍTULO COLOSAL BANCH (120px+) */}
          <h1 className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-[110px] font-black uppercase tracking-tight leading-[0.88] text-white">
            SMART <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
              WORKING
            </span> <br />
            <span className="text-[#6DD94B] drop-shadow-[0_0_40px_rgba(109,217,75,0.4)]">
              PLATFORMS
            </span>
          </h1>

          {/* Detalle y Píldoras Banch */}
          <div className="max-w-xl space-y-4 pt-2">
            <p className="text-sm sm:text-lg text-zinc-300 font-normal leading-relaxed">
              La <span className="text-[#6DD94B] font-semibold">solución inteligente</span> para la presencia digital de tu negocio. Sin intermediarios, sin comisiones por pedido y con diseño exclusivo que convierte visitantes en clientes.
            </p>

            {/* Píldoras con borde redondeado Banch */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <span className="px-4 py-2 rounded-full border border-white/20 text-xs font-mono uppercase tracking-wider text-zinc-300">
                🍔 6 Plantillas Hostelería
              </span>
              <span className="px-4 py-2 rounded-full border border-white/20 text-xs font-mono uppercase tracking-wider text-zinc-300">
                🏥 6 Plantillas Clínicas
              </span>
              <span className="px-4 py-2 rounded-full border border-[#6DD94B]/50 bg-[#6DD94B]/10 text-xs font-mono uppercase tracking-wider text-[#6DD94B]">
                ⚡ Carga en 0.2s
              </span>
            </div>
          </div>
        </div>

        {/* Scroll indicator Banch */}
        <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-8">
          <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-[#6DD94B] animate-ping" />
            <span>DISPONIBLES PARA NUEVOS PROYECTOS • HUELVA & SEVILLA</span>
          </div>

          <a 
            href="#soluciones"
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#6DD94B] hover:underline"
          >
            <span>SCROLL PARA EXPLORAR</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </a>
        </div>
      </section>

      {/* ── SECCIÓN 2: PANELES FLOTANTES BANCH (HOSTELERÍA, CLÍNICAS, VELOCIDAD, PORTAL) ── */}
      <section id="soluciones" className="py-20 sm:py-32 px-4 sm:px-8 border-t border-white/10 bg-[#161616]">
        <div className="max-w-[1440px] mx-auto space-y-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#6DD94B] block mb-2">
                // ARQUITECTURA MULTI-TENANT AISLADA
              </span>
              <h2 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
                PANELES DE SERVICIO & CATÁLOGO
              </h2>
            </div>
            <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest max-w-xs text-right hidden sm:block">
              AISLAMIENTO TOTAL DEL DOM Y CSS • CERO INTERFERENCIAS
            </p>
          </div>

          {/* Grid de 4 Paneles Gigantes Estilo Banch */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* PANEL 1: HOSTELERÍA */}
            <div className="bg-[#232323] p-8 sm:p-12 border border-white/10 relative overflow-hidden flex flex-col justify-between group hover:border-[#6DD94B]/60 transition-all duration-300 min-h-[440px]">
              <div>
                <span className="text-xs font-mono uppercase text-[#6DD94B] font-bold tracking-widest block mb-4">
                  01 / PLATAFORMA HOSTELERÍA
                </span>
                <h3 className="text-4xl sm:text-6xl font-black uppercase text-white leading-none mb-4">
                  RESTO & BARS
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                  6 Plantillas autónomas con estética rompedora: Cinematic Parallax, Bento Brutalist, Glass Fluid, Editorial Print, Cyber Terminal y Rustic Organic. Cartas interactivas táctiles QR sin descargar PDF y reservas directas a tu WhatsApp.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Awwwards Standard', 'Bento Grid 8px', 'Mesh Gradients', 'Sin PDFs'].map(tg => (
                    <span key={tg} className="text-[10px] font-mono uppercase px-2.5 py-1 bg-black/60 border border-white/10 text-zinc-300">
                      {tg}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400">DESDE 99€ // LLAVE EN MANO</span>
                <button
                  onClick={onNavigateToMultiwebs}
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#6DD94B] hover:text-white font-bold cursor-pointer"
                >
                  <span>Abrir Configurador</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* PANEL 2: CLÍNICAS & SALUD */}
            <div className="bg-[#232323] p-8 sm:p-12 border border-white/10 relative overflow-hidden flex flex-col justify-between group hover:border-[#6DD94B]/60 transition-all duration-300 min-h-[440px]">
              <div>
                <span className="text-xs font-mono uppercase text-[#6DD94B] font-bold tracking-widest block mb-4">
                  02 / PLATAFORMA CLÍNICAS
                </span>
                <h3 className="text-4xl sm:text-6xl font-black uppercase text-white leading-none mb-4">
                  CLINIC & HEALTH
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                  6 Plantillas médicas de alta gama: Ultra-Minimal Swiss, Dark Biotech con decodificador, Pediatric Playful, Horizontal Zen con scroll apaisado, Luxury Curtain en oro y Tech-Ortho con escáner láser luminoso.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Swiss Minimal', 'Biotech Decoder', 'Scroll Horizontal', 'Citas Online'].map(tg => (
                    <span key={tg} className="text-[10px] font-mono uppercase px-2.5 py-1 bg-black/60 border border-white/10 text-zinc-300">
                      {tg}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400">DESDE 99€ // CON AGENDA</span>
                <button
                  onClick={onNavigateToCyS}
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#6DD94B] hover:text-white font-bold cursor-pointer"
                >
                  <span>Abrir Configurador</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* PANEL 3: VELOCIDAD Y MÁS CLIENTES */}
            <div className="bg-[#232323] p-8 sm:p-12 border border-white/10 relative overflow-hidden flex flex-col justify-between group hover:border-[#6DD94B]/60 transition-all duration-300 min-h-[440px]">
              <div>
                <span className="text-xs font-mono uppercase text-[#6DD94B] font-bold tracking-widest block mb-4">
                  03 / MÁS CLIENTES EN TU NEGOCIO
                </span>
                <h3 className="text-4xl sm:text-6xl font-black uppercase text-white leading-none mb-4">
                  LOCAL IMPACT
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                  Aparece antes que tu competencia cuando busquen tu negocio en Huelva y Sevilla con optimización de Google Maps y SEO local. Tus clientes reservan mesa o piden en 1 clic directo a tu WhatsApp. 0 comisiones para plataformas externas.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Google Maps #1', 'Bizum & Tarjeta', '0% Comisiones', 'Soporte en Huelva'].map(tg => (
                    <span key={tg} className="text-[10px] font-mono uppercase px-2.5 py-1 bg-black/60 border border-white/10 text-zinc-300">
                      {tg}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400">100% TU BENEFICIO</span>
                <button
                  onClick={onOpenAudit}
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#6DD94B] hover:text-white font-bold cursor-pointer"
                >
                  <span>Quiero Mi Web</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* PANEL 4: PORTAL DE CLIENTES & ADMIN */}
            <div className="bg-[#232323] p-8 sm:p-12 border border-white/10 relative overflow-hidden flex flex-col justify-between group hover:border-[#6DD94B]/60 transition-all duration-300 min-h-[440px]">
              <div>
                <span className="text-xs font-mono uppercase text-[#6DD94B] font-bold tracking-widest block mb-4">
                  04 / PORTALES INTEGRADOS
                </span>
                <h3 className="text-4xl sm:text-6xl font-black uppercase text-white leading-none mb-4">
                  LIVE PORTAL
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                  Portal de Clientes limpio y exclusivo para ver tus visitas, actualizar tu carta o servicios y pulsar "Hablar con Nosotros" para chatear en directo con Mario y el equipo técnico. Además, Oficina Virtual Admin exacta a VirtualDesk con Kanban, Reparto 65/20/10/5 y CRM.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Chat Directo', 'Métricas Reales', 'Oficina Virtual VD', 'Kanban Ágil'].map(tg => (
                    <span key={tg} className="text-[10px] font-mono uppercase px-2.5 py-1 bg-black/60 border border-white/10 text-zinc-300">
                      {tg}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400">ACCESO SEGURO SSL</span>
                <button
                  onClick={onNavigateToPortal}
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#6DD94B] hover:text-white font-bold cursor-pointer"
                >
                  <span>Entrar al Portal</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 3: CAJA DE CRISTAL TRANSLÚCIDA BANCH (GLASS) ── */}
      <section className="py-24 sm:py-36 px-4 sm:px-8 bg-black relative flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-5xl p-10 sm:p-20 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 text-center shadow-[0_4px_40px_rgba(0,0,0,0.5)]">
          <p className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight text-[#09844B]">
            TECNODIEL, EL SOFTWARE WEB MULTI-TENANT QUE <span className="text-[#6DD94B]">LIMITA AL MÍNIMO TUS ESFUERZOS</span> Y MULTIPLICA TUS VENTAS.
          </p>
          <div className="mt-8 flex justify-center">
            <button
              onClick={onOpenAudit}
              className="border border-white hover:border-[#6DD94B] px-8 py-3.5 text-xs font-mono uppercase tracking-widest text-white hover:bg-white hover:text-[#0D844A] transition-all cursor-pointer"
            >
              Consultar Mi Caso • Desde 99€
            </button>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 4: BLOQUE VERDE MASIVO BANCH (QUATTRO: "MADE TO WORK BETTER") ── */}
      <section className="h-[380px] sm:h-[480px] bg-[#0D844A] flex items-center justify-center px-4 text-center overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(#6DD94B_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        <h2 className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight text-white relative z-10">
          MADE TO WORK BETTER
        </h2>
      </section>

      {/* ── SECCIÓN 5: ¿POR QUÉ TECNODIEL? (WHY-BANCH) ── */}
      <section className="py-24 sm:py-36 px-4 sm:px-8 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#6DD94B] block">
              // PROPUESTA DE VALOR REAL
            </span>
            <h2 className="text-4xl sm:text-6xl font-black uppercase text-[#09844B] leading-none">
              ¿POR QUÉ <br />
              <span className="text-white">TECNODIEL?</span>
            </h2>
            <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-[#6DD94B]">
              Está hecho a medida para agevolar y hacer crecer tu negocio.
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed font-light">
              Tus clientes deciden con el móvil en la mano. Si no te encuentran o tu web va lenta, eligen a la competencia. Nuestras plataformas cargan en menos de 0.2 segundos, no exigen descargar PDF de menús y dirigen los pedidos directamente a tu teléfono.
            </p>
            <p className="text-sm text-zinc-300 leading-relaxed font-light">
              Nosotros nos ocupamos de todo: hosting Cloudflare en el Edge, base de datos Supabase SSL, diseño galardonado, alta en Google Maps y soporte técnico directo desde Huelva.
            </p>
            <div className="pt-4">
              <button
                onClick={onOpenAudit}
                className="border border-white hover:border-[#6DD94B] px-8 py-3.5 text-xs font-mono uppercase tracking-widest text-white hover:bg-white hover:text-[#0D844A] transition-all cursor-pointer"
              >
                Hablar con Nosotros
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#232323] border border-white/10 p-8 sm:p-12 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-mono uppercase text-[#6DD94B] font-bold">GARANTÍAS COMPROBADAS</span>
              <span className="text-xs font-mono text-zinc-400">HUELVA // ESPAÑA</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Velocidad de Carga 0.2s', desc: 'Lighthouse 99+. El cliente nunca se va por lentitud.' },
                { title: '0€ Comisiones por Reserva', desc: 'No pagas el 15-30% a plataformas intermediarias.' },
                { title: 'Carta Digital Táctil', desc: 'Fotos reales que abren el apetito y se actualizan al instante.' },
                { title: 'Dominio y SSL Incluidos', desc: 'Seguridad máxima con certificado SSL Cloudflare.' },
                { title: 'Cobro por Bizum o Tarjeta', desc: 'El dinero llega directo a tu cuenta bancaria.' },
                { title: 'Soporte con Nombre y Apellidos', desc: 'Hablas directamente con Mario y Dani, no con un bot.' }
              ].map((g, i) => (
                <div key={i} className="p-4 bg-black/50 border border-white/5 space-y-1">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#6DD94B]" />
                    <span className="text-xs font-bold uppercase text-white">{g.title}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 pl-6 leading-relaxed">{g.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 6: TABLA DE ESPECIFICACIONES TÉCNICAS BANCH (SPECIFICATION) ── */}
      <section className="bg-white text-black py-20 sm:py-32 px-4 sm:px-8">
        <div className="max-w-[1440px] mx-auto space-y-12">
          <div className="border-b-2 border-[#09844B] pb-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#09844B] font-bold block mb-1">
                // MATRIZ DE RENDIMIENTO
              </span>
              <h2 className="text-3xl sm:text-5xl font-black uppercase text-[#09844B] tracking-tight">
                ESPECIFICACIONES TÉCNICAS
              </h2>
            </div>
            <p className="text-xs font-mono text-neutral-500 uppercase">
              ESTÁNDARES DE INGENIERÍA TECNODIEL
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-[#09844B]">
                  <th className="py-4 w-16 text-neutral-400">ID</th>
                  <th className="py-4 text-[#09844B] font-bold uppercase">CARACTERÍSTICA</th>
                  <th className="py-4 uppercase text-black font-extrabold">HOSTELERÍA (RESTO)</th>
                  <th className="py-4 uppercase text-black font-extrabold">CLÍNICAS & SALUD</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    id: '01',
                    title: 'Arquitectura DOM & CSS',
                    host: 'Aislamiento total por plantilla (6 plantillas)',
                    clin: 'Aislamiento total por plantilla (6 plantillas)'
                  },
                  {
                    id: '02',
                    title: 'Tiempo de Carga en Móvil',
                    host: '< 0.25 s (Cloudflare Global Edge)',
                    clin: '< 0.28 s (Cloudflare Global Edge)'
                  },
                  {
                    id: '03',
                    title: 'Herramientas de Venta',
                    host: 'Carta digital QR interactiva + WhatsApp',
                    clin: 'Agenda de citas online + WhatsApp VIP'
                  },
                  {
                    id: '04',
                    title: 'Pasarelas de Pago',
                    host: 'Bizum directo + Stripe Checkout',
                    clin: 'Cobro de reservas con Bizum / Tarjeta'
                  },
                  {
                    id: '05',
                    title: 'Base de Datos & Auth',
                    host: 'Supabase PostgreSQL con SSL',
                    clin: 'Supabase PostgreSQL con SSL médico'
                  },
                  {
                    id: '06',
                    title: 'Portal de Clientes',
                    host: 'Métricas + Chat directo con Mario',
                    clin: 'Métricas de pacientes + Chat directo'
                  },
                  {
                    id: '07',
                    title: 'Oficina Virtual Admin',
                    host: 'VirtualDesk exacto (Kanban, Reparto 65%)',
                    clin: 'VirtualDesk exacto (Kanban, Reparto 65%)'
                  },
                  {
                    id: '08',
                    title: 'Precio y Comisiones',
                    host: 'Desde 99€ • 0€ comisiones por pedido',
                    clin: 'Desde 99€ • 0€ comisiones por cita'
                  }
                ].map((row) => (
                  <tr key={row.id} className="border-b border-[#09844B]/30 hover:bg-[#09844B]/5 transition-colors">
                    <td className="py-5 font-bold text-[#09844B]">{row.id}</td>
                    <td className="py-5 font-bold uppercase text-black">{row.title}</td>
                    <td className="py-5 text-neutral-800">{row.host}</td>
                    <td className="py-5 text-neutral-800">{row.clin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 7: CTA MASIVO BANCH ── */}
      <section className="py-24 sm:py-36 px-4 sm:px-8 text-center bg-[#181818] border-t border-white/10">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#6DD94B] block">
            // EL MOMENTO ES AHORA
          </span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase text-white tracking-tight leading-none">
            ESTE ES EL FUTURO DE LAS WEBS PROFESIONALES
          </h2>
          <p className="text-lg font-bold uppercase text-[#6DD94B] tracking-wider">
            ¿SEI CURIOSO? ¿QUIERES VER TU NEGOCIO EN LO MÁS ALTO?
          </p>
          <div className="pt-4">
            <button
              onClick={onOpenAudit}
              className="border border-white hover:border-[#6DD94B] px-10 py-4 text-xs sm:text-sm font-mono uppercase tracking-widest text-white hover:bg-white hover:text-[#0D844A] transition-all cursor-pointer font-bold"
            >
              Quiero Mi Web • Desde 99€
            </button>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 8: CONTACTO CON FORMULARIO BANCH (INPUTS LÍNEA INFERIOR BLANCA) ── */}
      <section id="contact" className="py-24 sm:py-36 px-4 sm:px-8 bg-black border-t border-white/10">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Columna Izquierda Texto */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#6DD94B] block">
              // CONTACTO DIRECTO
            </span>
            <h2 className="text-4xl sm:text-6xl font-black uppercase text-white leading-none">
              SABEMOS CÓMO <br />
              <span className="text-[#6DD94B]">IMPULSAR</span> <br />
              TU NEGOCIO
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed font-light">
              El futuro de las plataformas web ha llegado a Huelva. Escríbenos para recibir tu propuesta técnica personalizada y ver tu plantilla en directo.
            </p>
            <div className="pt-4 space-y-2 text-xs font-mono text-zinc-400">
              <p>📍 HUELVA & SEVILLA, ANDALUCÍA</p>
              <p>✉️ CONTACTO@TECNODIEL.ES</p>
              <p>⚡ RESPUESTA EN MENOS DE 2 HORAS</p>
            </div>
          </div>

          {/* Columna Derecha Formulario Banch */}
          <div className="lg:col-span-7">
            {formSent ? (
              <div className="p-10 border border-[#6DD94B] bg-[#0D844A]/10 text-center space-y-4">
                <span className="h-12 w-12 rounded-full bg-[#6DD94B] text-black font-bold mx-auto flex items-center justify-center">
                  ✓
                </span>
                <h3 className="text-2xl font-black uppercase text-white">¡Mensaje Enviado con Éxito!</h3>
                <p className="text-xs font-mono text-zinc-300">
                  Mario o Dani revisarán tu negocio y te contactarán hoy mismo con la propuesta.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-zinc-400 block">nombre</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Tu nombre completo"
                    className="w-full bg-transparent border-b-2 border-white pb-2 text-sm text-white focus:border-[#6DD94B] focus:outline-none font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-zinc-400 block">email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="tucorreo@negocio.es"
                      className="w-full bg-transparent border-b-2 border-white pb-2 text-sm text-white focus:border-[#6DD94B] focus:outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-zinc-400 block">teléfono / whatsapp</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="600 000 000"
                      className="w-full bg-transparent border-b-2 border-white pb-2 text-sm text-white focus:border-[#6DD94B] focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-zinc-400 block">tipo de negocio</label>
                  <select
                    value={formData.platform}
                    onChange={e => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full bg-[#161616] border-b-2 border-white pb-2 text-sm text-white focus:border-[#6DD94B] focus:outline-none font-mono"
                  >
                    <option value="hosteleria">Hostelería (Restaurante, Bar, Coctelería, Asador)</option>
                    <option value="clinica">Clínica & Salud (Dental, Fisioterapia, Estética, Salud)</option>
                    <option value="otro">Otro negocio local</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-zinc-400 block">mensaje o necesidades</label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Cuéntanos brevemente sobre tu negocio y qué te gustaría mejorar..."
                    className="w-full bg-transparent border-b-2 border-white pb-2 text-sm text-white focus:border-[#6DD94B] focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-4 pt-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.privacy}
                      onChange={e => setFormData({ ...formData, privacy: e.target.checked })}
                      className="mt-1 accent-[#6DD94B]"
                    />
                    <span className="text-xs text-zinc-400 font-mono leading-relaxed">
                      Declaro haber leído la política de privacidad y autorizo el tratamiento de mis datos personales para recibir información de mi proyecto en TecnOdiel.
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="border border-white hover:border-[#6DD94B] px-10 py-4 text-xs font-mono uppercase tracking-widest text-white hover:bg-white hover:text-[#0D844A] transition-all cursor-pointer font-bold"
                  >
                    Enviar Mensaje
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 9: FOOTER COLOSAL IDÉNTICO A BANCH ── */}
      <footer className="py-20 px-4 sm:px-8 border-t border-white/10 bg-[#0c0c0c] text-center">
        <div className="max-w-[1440px] mx-auto space-y-6">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#6DD94B] block">
            // TECNODIEL HUELVA
          </span>
          <h2 className="text-3xl sm:text-6xl md:text-7xl font-black uppercase text-white tracking-tight leading-none">
            DESCUBRE NUESTRAS PLATAFORMAS & SERVICIOS
          </h2>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onNavigateToMultiwebs}
              className="border border-white/30 hover:border-white px-6 py-3 text-xs font-mono uppercase text-white transition-all cursor-pointer"
            >
              Catálogo Hostelería
            </button>
            <button
              onClick={onNavigateToCyS}
              className="border border-white/30 hover:border-white px-6 py-3 text-xs font-mono uppercase text-white transition-all cursor-pointer"
            >
              Catálogo Clínicas
            </button>
            <button
              onClick={onNavigateToPortal}
              className="border border-[#6DD94B] bg-[#6DD94B]/10 px-6 py-3 text-xs font-mono uppercase text-[#6DD94B] hover:bg-[#6DD94B] hover:text-black transition-all cursor-pointer font-bold"
            >
              Portal Privado & Oficina Virtual
            </button>
          </div>
          <p className="text-[11px] font-mono text-zinc-500 pt-8 border-t border-white/5">
            © {new Date().getFullYear()} TecnOdiel • Alojamiento en Cloudflare Pages Edge • Base de datos Supabase SSL
          </p>
        </div>
      </footer>
    </div>
  );
}
