import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowUpRight, 
  Zap, 
  Smartphone, 
  ShieldCheck, 
  Search, 
  ShoppingBag, 
  HeartHandshake, 
  Check, 
  MessageCircle,
  Cpu,
  Server,
  Terminal,
  ArrowRight,
  ExternalLink,
  Store,
  Clock,
  Shield,
  Layers,
  MapPin,
  Tag,
  CheckCircle2
} from 'lucide-react'

export default function MainPortalCard({ onOpenAudit }) {
  const currentYear = new Date().getFullYear()
  const [activeShowcaseTab, setActiveShowcaseTab] = useState(0)

  const systemModules = [
    {
      code: 'SYS-01',
      tag: 'EDGE_CDN',
      icon: Zap,
      title: 'Arquitectura Web de Alta Velocidad',
      description: 'Carga instantánea (<300ms) en cualquier teléfono móvil. Despliegue estático sobre la red global de Cloudflare, eliminando bases de datos lentas y plugins sobrecargados de WordPress.',
      spec: 'Latencia < 0.3s'
    },
    {
      code: 'SYS-02',
      tag: 'SEO_LOCAL',
      icon: Search,
      title: 'Posicionamiento Google & Google Maps',
      description: 'Optimización de código técnico para motores de búsqueda y sincronización con tu ficha de negocio local para aparecer en los primeros resultados de Huelva.',
      spec: 'Google Local Huelva'
    },
    {
      code: 'SYS-03',
      tag: 'QR_ENGINE',
      icon: Smartphone,
      title: 'Carta Digital QR Dinámica e Interactiva',
      description: 'Menú táctil de alta velocidad con fotos en alta definición, filtros de alérgenos y precios editables en segundos. Sin incómodos archivos PDF pesados.',
      spec: 'Sin PDFs pesados'
    },
    {
      code: 'SYS-04',
      tag: 'DIRECT_FLOW',
      icon: ShieldCheck,
      title: 'Canal Directo de Pedidos & Reservas',
      description: 'Tus clientes reservan mesa o realizan pedidos directo a tu WhatsApp o panel privado. Cero intermediarios y cero comisiones del 15% al 30% por pedido.',
      spec: '0% Comisiones'
    },
    {
      code: 'SYS-05',
      tag: 'INSTANT_PAY',
      icon: ShoppingBag,
      title: 'Pasarela Bizum y Tarjeta Comercial',
      description: 'Vende tus productos o cobra anticipos de reservas directamente en tu cuenta bancaria. Liquidación inmediata sin retenciones de saldo.',
      spec: 'Cobro Directo'
    },
    {
      code: 'SYS-06',
      tag: 'LOCAL_OPS',
      icon: HeartHandshake,
      title: 'Infraestructura & Soporte Técnico en Huelva',
      description: 'Dominio, certificados de seguridad SSL de 256 bits, copias de seguridad automáticas y atención técnica directa desde Huelva, persona a persona.',
      spec: 'Soporte Local'
    },
  ]

  const liveDemos = [
    {
      name: 'Marea Negra',
      category: 'Marisquería & Arroces',
      location: 'Punta Umbría / Huelva',
      styleTag: 'ESTILO 01 // MINIMALISTA COSTEÑO',
      description: 'Carta digital táctil con marisco fresco del día, reserva directa de mesas en terraza y alérgenos certificados.',
      slug: 'marea-negra',
      highlights: ['Carta interactiva QR', 'Reservas a WhatsApp', 'Carga en 0.2s']
    },
    {
      name: 'Taberna El Rincón',
      category: 'Tapas de Autor & Vinos',
      location: 'Huelva Centro',
      styleTag: 'ESTILO 08 // TABERNA & BODEGA',
      description: 'Menú degustación, sugerencias del chef actualizadas a diario y cobro de anticipos por Bizum sin intermediarios.',
      slug: 'taberna-el-rincon',
      highlights: ['Menú del día editable', 'Sin comisiones delivery', 'Ficha Google Maps']
    },
    {
      name: 'La Brasa Urbana',
      category: 'Burgers & Grill',
      location: 'Isla Chica, Huelva',
      styleTag: 'ESTILO 14 // INDUSTRIAL DARK',
      description: 'Catálogo visual de hamburguesas gourmet con opciones personalizadas, punto de carne y pedido directo para recoger.',
      slug: 'la-brasa-urbana',
      highlights: ['Pedidos para recoger', 'Fotos en alta resolución', '100% Responsive']
    }
  ]

  const comparisonData = [
    {
      param: 'Comisiones por venta o cubierto',
      tecnodiel: '0% — 100% íntegro para tu negocio',
      others: '15% al 30% por pedido (Apps delivery)'
    },
    {
      param: 'Tiempo de carga en móviles (4G/5G)',
      tecnodiel: '< 0.3s (Cloudflare Edge Global)',
      others: '3.5s - 7.0s (WordPress sobrecargado)'
    },
    {
      param: 'Carta y Catálogo Digital',
      tecnodiel: 'Táctil, interactiva y sin esperas',
      others: 'PDFs pesados de difícil lectura'
    },
    {
      param: 'Propiedad del sistema y datos',
      tecnodiel: '100% de tu negocio sin ataduras',
      others: 'Alquiler cautivo en plataforma ajena'
    },
    {
      param: 'Atención técnica y mantenimiento',
      tecnodiel: 'Directo en Huelva por teléfono y WhatsApp',
      others: 'Chatbots automáticos o tickets lentos'
    }
  ]

  return (
    <div className="relative w-full max-w-5xl mx-auto px-3.5 sm:px-6 pt-20 sm:pt-24 pb-24 select-none">
      {/* Industrial Chassis Outer Container */}
      <div className="relative rounded-lg border border-zinc-800 bg-[#09090c] overflow-hidden shadow-2xl">
        {/* Subtle corner crosshairs (Swiss/Industrial design token) */}
        <span className="absolute top-2 left-2 font-mono text-[10px] text-zinc-600 select-none hidden sm:block">+</span>
        <span className="absolute top-2 right-2 font-mono text-[10px] text-zinc-600 select-none hidden sm:block">+</span>
        <span className="absolute bottom-2 left-2 font-mono text-[10px] text-zinc-600 select-none hidden sm:block">+</span>
        <span className="absolute bottom-2 right-2 font-mono text-[10px] text-zinc-600 select-none hidden sm:block">+</span>

        {/* Industrial Telemetry Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-2.5 sm:py-3 border-b border-zinc-800 bg-zinc-950 font-mono text-[10px] sm:text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-zinc-200 font-bold tracking-wider uppercase">TECNODIEL // INGENIERÍA DIGITAL</span>
            <span className="text-zinc-600 hidden xs:inline">•</span>
            <span className="text-zinc-400 hidden xs:inline">HUELVA, ESPAÑA</span>
          </div>

          <div className="flex items-center gap-3 text-zinc-400">
            <span className="hidden md:inline">HOST: CLOUDFLARE EDGE</span>
            <span className="text-zinc-600 hidden md:inline">•</span>
            <span>ESTADO: <strong className="text-emerald-400 font-semibold">ACTIVO</strong></span>
          </div>
        </div>

        {/* Main Body */}
        <div className="p-4 sm:p-8 md:p-10">
          {/* Engineering Category Tag & Main Headline */}
          <div className="mb-6 sm:mb-8 text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700/80 mb-4">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono text-[10px] sm:text-xs text-zinc-200 uppercase tracking-widest font-semibold">
                DESARROLLO WEB & SISTEMAS // HUELVA
              </span>
            </div>

            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-[1.08] font-sans">
              SISTEMAS WEB DE ALTO RENDIMIENTO <br className="hidden sm:inline" />
              <span className="text-zinc-300">PARA NEGOCIOS REALES DE HUELVA.</span>
            </h1>

            <p className="mt-3.5 text-xs sm:text-sm md:text-base text-zinc-300 max-w-3xl leading-relaxed font-normal">
              Desarrollamos páginas web ultrarrápidas, cartas digitales táctiles con código QR y pasarelas de reservas directas. Sin intermediarios, sin comisiones del 20% por pedido y con asistencia técnica presencial y telefónica en Huelva.
            </p>
          </div>

          {/* Quick Action Console (High Mobile Ergonomics - Min 44px Touch Target) */}
          <div className="p-4 sm:p-5 rounded border border-zinc-800 bg-zinc-900/60 mb-8 sm:mb-12">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
              {/* Primary Industrial Button */}
              <button
                onClick={onOpenAudit}
                className="btn-industrial flex-1 min-h-[44px] inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded bg-white hover:bg-zinc-200 text-black font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                id="cta-configurar-proyecto"
                aria-label="Configurar Proyecto desde 99 euros"
              >
                <span>Configurar Proyecto — Desde 99€</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              {/* Direct WhatsApp Contact Button */}
              <a
                href="https://wa.me/34600000000?text=Hola%20TecnOdiel,%20quiero%20información%20sobre%20una%20web%20para%20mi%20negocio"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-industrial min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded border border-zinc-700 hover:border-zinc-500 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 font-mono text-xs sm:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                aria-label="Hablar por WhatsApp con el equipo de TecnOdiel"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Hablar por WhatsApp</span>
              </a>
            </div>

            {/* Micro Industrial Specs Bar (No Emojis - Pure SVGs per minimalist skill) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4 mt-4 border-t border-zinc-800 font-mono text-[10px] sm:text-[11px] text-zinc-300 text-left">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Carga móvil: <strong className="text-white">&lt; 0.3s (Cloudflare)</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Comisiones por pedido: <strong className="text-white">0% para siempre</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Atención: <strong className="text-white">Huelva capital y provincia</strong></span>
              </div>
            </div>
          </div>

          {/* Interactive Live Demo Showroom (UI-UX Pro Max Proof Pattern) */}
          <div className="mb-8 sm:mb-12 rounded border border-zinc-800 bg-zinc-950 p-4 sm:p-6 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-white uppercase tracking-wider">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Demostraciones en Vivo // Hostelería de Huelva</span>
              </div>
              <span className="font-mono text-[10px] text-zinc-400 uppercase">
                30 PLANTILLAS Y MOTORES ACTIVOS
              </span>
            </div>

            {/* Showcase Selector Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
              {liveDemos.map((demo, idx) => (
                <button
                  key={demo.slug}
                  onClick={() => setActiveShowcaseTab(idx)}
                  className={`min-h-[44px] text-left p-3 rounded border font-mono transition-colors cursor-pointer ${
                    activeShowcaseTab === idx
                      ? 'bg-zinc-800 border-zinc-600 text-white'
                      : 'bg-zinc-900/50 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                  aria-label={`Ver demostración de ${demo.name}`}
                >
                  <div className="text-[10px] text-zinc-400 uppercase tracking-wider">{demo.category}</div>
                  <div className="text-xs font-bold text-white">{demo.name}</div>
                </button>
              ))}
            </div>

            {/* Active Demo Preview Card */}
            <AnimatePresence mode="wait">
              {(() => {
                const currentDemo = liveDemos[activeShowcaseTab]
                return (
                  <motion.div
                    key={currentDemo.slug}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="rounded border border-zinc-800 bg-zinc-900/40 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 max-w-xl">
                      <div className="inline-block font-mono text-[9px] px-2 py-0.5 rounded bg-zinc-800 text-emerald-400 border border-zinc-700">
                        {currentDemo.styleTag}
                      </div>
                      <h4 className="text-base font-bold text-white">
                        {currentDemo.name} — <span className="text-zinc-400 font-normal text-xs">{currentDemo.location}</span>
                      </h4>
                      <p className="text-xs text-zinc-300 font-normal leading-relaxed">
                        {currentDemo.description}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10px] text-zinc-400">
                        {currentDemo.highlights.map((h, i) => (
                          <span key={i} className="flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>{h}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                      <a
                        href={`#/r/${currentDemo.slug}`}
                        className="btn-industrial flex-1 sm:flex-initial min-h-[44px] w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-mono text-xs font-semibold transition-colors"
                        aria-label={`Ver web en vivo de ${currentDemo.name}`}
                      >
                        <span>Ver Demo en Vivo</span>
                        <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                      </a>
                    </div>
                  </motion.div>
                )
              })()}
            </AnimatePresence>
          </div>

          {/* System Capabilities Section Header */}
          <div className="flex items-center justify-between pb-3 mb-4 sm:mb-6 border-b border-zinc-800">
            <span className="font-mono text-[11px] sm:text-xs text-white font-bold uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              Módulos y Capacidades del Sistema
            </span>
            <span className="font-mono text-[10px] text-zinc-400 uppercase">
              6 MÓDULOS DE ARQUITECTURA
            </span>
          </div>

          {/* 6 Industrial System Modules Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-12 text-left">
            {systemModules.map((item) => {
              const IconComp = item.icon
              return (
                <div
                  key={item.code}
                  className="group relative rounded border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/60 hover:border-zinc-700 p-4 transition-all duration-150 flex flex-col justify-between"
                >
                  <div>
                    {/* Module Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-200">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className="font-mono text-[10px] font-bold text-zinc-200 tracking-wider">
                          {item.code}
                        </span>
                      </div>
                      <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">
                        {item.spec}
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight mb-1.5 font-sans">
                      {item.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Industrial Comparison Specification Table */}
          <div className="rounded border border-zinc-800 bg-zinc-900/40 p-4 sm:p-6 mb-8 sm:mb-12 text-left overflow-x-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800 font-mono text-[11px] sm:text-xs text-white font-bold uppercase tracking-wider">
              <span className="flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                Matriz Comparativa de Rendimiento
              </span>
              <span className="font-mono text-[10px] text-emerald-400 font-semibold">
                VENTAJA DIRECTA TECNODIEL
              </span>
            </div>

            <table className="w-full text-left font-mono text-[11px] sm:text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 text-[10px] uppercase">
                  <th className="py-2.5 pr-4 font-semibold">Parámetro</th>
                  <th className="py-2.5 px-3 font-bold text-emerald-400">TecnOdiel</th>
                  <th className="py-2.5 pl-3 font-normal text-zinc-400">Otras Opciones / Apps</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {comparisonData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3 pr-4 text-zinc-200 font-sans text-xs">{row.param}</td>
                    <td className="py-3 px-3 text-white font-medium bg-emerald-950/20">{row.tecnodiel}</td>
                    <td className="py-3 pl-3 text-zinc-400 font-light">{row.others}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Transparent Pricing Spec Block (Invoice-style precision) */}
          <div className="rounded border border-zinc-700 bg-zinc-900/90 p-5 sm:p-8 text-center sm:text-left flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl space-y-2">
              <div className="inline-block font-mono text-[10px] uppercase tracking-widest text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40">
                PRESUPUESTO CERRADO // PAGO ÚNICO
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                Web Completa Implantada Desde 99€
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                Incluye diseño responsive para móviles, carta digital QR interactiva o catálogo de servicios, reservas directas por WhatsApp y alta en Cloudflare. Sin comisiones mensuales por venta.
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 font-mono text-[10px] text-zinc-400">
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Entrega en 48-72h</span>
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Código 100% de tu propiedad</span>
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Soporte presencial en Huelva</span>
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-end shrink-0 w-full sm:w-auto">
              <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight mb-2">
                99€ <span className="text-xs text-zinc-400 font-normal uppercase">/ proyecto</span>
              </div>
              <button
                onClick={onOpenAudit}
                className="btn-industrial min-h-[44px] w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded bg-white hover:bg-zinc-200 text-black font-mono text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Solicitar presupuesto de 99 euros"
              >
                <span>Solicitar Ahora</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>

        {/* Industrial Footer Telemetry */}
        <div className="px-4 sm:px-6 py-3.5 border-t border-zinc-800 bg-zinc-950 font-mono text-[10px] text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span>© {currentYear} TecnOdiel</span>
            <span className="mx-2">•</span>
            <span>Huelva, Andalucía, España</span>
          </div>
          <div className="text-zinc-400">
            ALOJAMIENTO CLOUDFLARE EDGE • SSL 256-BIT • SUPABASE
          </div>
        </div>
      </div>
    </div>
  )
}
