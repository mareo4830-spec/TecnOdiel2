import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Check, 
  Copy, 
  ExternalLink, 
  Globe, 
  Rocket, 
  Sparkles, 
  MessageCircle, 
  ShieldCheck, 
  Server, 
  ArrowRight,
  Layers,
  ShoppingBag,
  CheckCircle2
} from 'lucide-react';

export default function DeployDomainModal({ isOpen, onClose, data }) {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedDns, setCopiedDns] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'domain' | 'dns' | 'whatsapp'

  if (!isOpen || !data) return null;

  const {
    businessName = 'Tu Negocio',
    slug = 'mi-negocio',
    accessKey = 'TO-892',
    templateName = 'Cinematográfico',
    services = [],
    phone = '',
    email = '',
    isHealth = false
  } = data;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://tecnodiel.com';
  const liveWebUrl = `${origin}/#/r/${slug}`;
  const portalUrl = `${origin}/#/portal?r=${slug}`;
  const cloudflareDomain = `${slug}.pages.dev`;

  const cleanPhone = String(phone || '').replace(/\D/g, '').replace(/^(?!34)(\d{9})$/, '34$1');

  // Dominios sugeridos automáticos
  const domainSuggestions = [
    {
      domain: `${slug}.es`,
      tld: '.es',
      price: '~7,95 €/año',
      bestFor: 'Recomendado en España y Huelva',
      donDominioUrl: `https://www.dondominio.com/es/search/?query=${encodeURIComponent(`${slug}.es`)}`,
      namecheapUrl: `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(`${slug}.es`)}`
    },
    {
      domain: `${slug}huelva.es`,
      tld: '.es',
      price: '~7,95 €/año',
      bestFor: 'Máximo posicionamiento local en Google Maps',
      donDominioUrl: `https://www.dondominio.com/es/search/?query=${encodeURIComponent(`${slug}huelva.es`)}`,
      namecheapUrl: `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(`${slug}huelva.es`)}`
    },
    {
      domain: `${slug}.com`,
      tld: '.com',
      price: '~10,50 €/año',
      bestFor: 'Alcance internacional y marca global',
      donDominioUrl: `https://www.dondominio.com/es/search/?query=${encodeURIComponent(`${slug}.com`)}`,
      namecheapUrl: `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(`${slug}.com`)}`
    }
  ];

  const whatsappMessage = `¡Hola! Soy Mario de TecnOdiel.\n\nYa tenemos tu nueva web montada y funcionando para ${businessName} 🚀\n\nPuedes ver cómo ha quedado en este enlace:\n${liveWebUrl}\n\nTambién te hemos dejado activo tu panel privado de gestión:\n${portalUrl}\nClave de acceso: ${accessKey}\n\n¿Qué te parece? Si te gusta, te conectamos el dominio propio hoy mismo para que esté lista para tus clientes.`;

  const handleCopy = (text, type) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (type === 'key') {
        setCopiedKey(true);
        setTimeout(() => setCopiedKey(false), 2000);
      } else if (type === 'dns') {
        setCopiedDns(true);
        setTimeout(() => setCopiedDns(false), 2000);
      } else if (type === 'url') {
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-[#121212] border border-[#6DD94B]/30 rounded-3xl shadow-[0_0_60px_rgba(109,217,75,0.2)] overflow-hidden font-sans text-white my-auto"
        >
          {/* Barra superior con gradiente de marca */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#0D844A] via-[#6DD94B] to-[#38d600]" />

          {/* Header del Modal */}
          <div className="p-6 sm:p-8 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#161616]/90">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#6DD94B]/15 text-[#6DD94B] border border-[#6DD94B]/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#6DD94B] animate-ping" />
                  WEB MONTADA Y OPERATIVA
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  ID: {slug}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {businessName}
              </h2>
              <p className="text-xs text-zinc-400">
                Plantilla: <strong className="text-white">{templateName}</strong> • Acceso cliente: <strong className="text-[#6DD94B]">{accessKey}</strong>
              </p>
            </div>

            <button
              onClick={onClose}
              className="self-end sm:self-center p-2 rounded-xl border border-white/10 hover:border-white text-zinc-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Selector de pestañas del modal */}
          <div className="flex items-center gap-1 sm:gap-2 px-6 pt-4 border-b border-white/10 bg-[#161616]/40 overflow-x-auto">
            {[
              { id: 'overview', label: '1. Ver Web en Directo', icon: Globe },
              { id: 'domain', label: '2. Comprar Dominio', icon: ShoppingBag },
              { id: 'dns', label: '3. Conectar DNS / Subir', icon: Server },
              { id: 'whatsapp', label: '4. Enviar por WhatsApp', icon: MessageCircle }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition border-b-2 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'border-[#6DD94B] text-[#6DD94B] bg-[#6DD94B]/10'
                      : 'border-transparent text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Contenido de la pestaña activa */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* ── TAB 1: OVERVIEW & VER WEB ── */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-[#6DD94B]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono uppercase text-[#6DD94B] font-bold">
                      ✓ Despliegue completado
                    </span>
                    <h3 className="text-base font-extrabold text-white">
                      La web ya está completamente montada en el servidor
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Todos los datos de la solicitud (servicios, horarios, plantilla y contacto) han sido inyectados.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => window.open(liveWebUrl, '_blank')}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl sm:rounded-2xl bg-[#6DD94B] hover:bg-white text-black font-black text-xs shadow-lg shadow-[#6DD94B]/25 transition-all duration-200 cursor-pointer active:scale-95"
                    >
                      <span>Abrir Web en Directo</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Card Enlace Directo */}
                  <div className="p-4 rounded-2xl bg-[#181818] border border-white/10 space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                      URL Pública Temporal (Activa Ya)
                    </span>
                    <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-zinc-200">
                      <span className="truncate">{liveWebUrl}</span>
                      <button
                        onClick={() => handleCopy(liveWebUrl, 'url')}
                        className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer active:scale-90"
                        title="Copiar URL"
                      >
                        {copiedUrl ? <Check className="w-4 h-4 text-[#6DD94B]" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      Subdominio Cloudflare: <strong className="text-zinc-300">https://{cloudflareDomain}</strong>
                    </p>
                  </div>

                  {/* Card Portal del Cliente */}
                  <div className="p-4 rounded-2xl bg-[#181818] border border-white/10 space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                      Acceso al Portal del Cliente
                    </span>
                    <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-zinc-200">
                      <span>Clave: <strong className="text-[#6DD94B]">{accessKey}</strong></span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopy(accessKey, 'key')}
                          className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer active:scale-90"
                          title="Copiar Clave"
                        >
                          {copiedKey ? <Check className="w-4 h-4 text-[#6DD94B]" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => window.open(portalUrl, '_blank')}
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-[#6DD94B] hover:text-black text-white text-[11px] font-bold transition cursor-pointer active:scale-95"
                        >
                          Entrar
                        </button>
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      El cliente puede editar su carta, ver reservas y chatear con vosotros.
                    </p>
                  </div>
                </div>

                {/* Siguiente paso recomendado */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setActiveTab('domain')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all duration-200 cursor-pointer active:scale-95"
                  >
                    <span>Siguiente paso: Comprar Dominio</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── TAB 2: COMPRAR DOMINIO ── */}
            {activeTab === 'domain' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white">
                    Sugerencias de Dominios Listas para Comprar
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Haz clic en cualquiera de los proveedores para comprobar disponibilidad y comprar el dominio para tu cliente.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {domainSuggestions.map((sug, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#181818] border border-white/10 hover:border-[#6DD94B]/40 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-mono font-black text-white">
                            {sug.domain}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#6DD94B]/15 text-[#6DD94B] border border-[#6DD94B]/30 font-bold">
                            {sug.price}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400">
                          {sug.bestFor}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <a
                          href={sug.donDominioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-[#6DD94B] text-black font-black text-xs transition-all duration-200 active:scale-95 shadow-sm"
                        >
                          <span>DonDominio</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={sug.namecheapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/20 hover:border-[#6DD94B] hover:text-[#6DD94B] text-zinc-300 font-bold text-xs transition-all duration-200 active:scale-95"
                        >
                          <span>Namecheap</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-[#181818]/60 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-xs text-zinc-400">
                    ¿Prefieres comprarlo directamente en Cloudflare?
                  </div>
                  <a
                    href="https://dash.cloudflare.com/?to=/:account/domains"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#6DD94B] hover:underline font-bold inline-flex items-center gap-1"
                  >
                    <span>Abrir Cloudflare Registrar</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition-all active:scale-95 cursor-pointer"
                  >
                    ← Volver
                  </button>
                  <button
                    onClick={() => setActiveTab('dns')}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl sm:rounded-2xl bg-[#6DD94B] hover:bg-white text-black font-black text-xs shadow-lg shadow-[#6DD94B]/20 transition-all duration-200 active:scale-95 cursor-pointer"
                  >
                    <span>Siguiente: Conectar DNS</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── TAB 3: DNS & SUBIDA ── */}
            {activeTab === 'dns' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white">
                    Configuración de DNS para Dominio Propio
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Una vez comprado el dominio en DonDominio o Cloudflare, añade estos dos registros CNAME para que apunten a la plataforma con SSL gratis automático.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#181818] border border-white/10 space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="border-b border-white/10 text-zinc-400">
                          <th className="pb-2">Tipo</th>
                          <th className="pb-2">Nombre / Host</th>
                          <th className="pb-2">Valor / Destino</th>
                          <th className="pb-2">Proxy / SSL</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-zinc-200">
                        <tr>
                          <td className="py-2.5 text-[#6DD94B] font-bold">CNAME</td>
                          <td className="py-2.5">@</td>
                          <td className="py-2.5 font-bold text-white">cname.tecnodiel.com</td>
                          <td className="py-2.5 text-emerald-400">Activado (Nube naranja)</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 text-[#6DD94B] font-bold">CNAME</td>
                          <td className="py-2.5">www</td>
                          <td className="py-2.5 font-bold text-white">cname.tecnodiel.com</td>
                          <td className="py-2.5 text-emerald-400">Activado (Nube naranja)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => handleCopy("Tipo: CNAME | Host: @ | Destino: cname.tecnodiel.com\nTipo: CNAME | Host: www | Destino: cname.tecnodiel.com", 'dns')}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all duration-200 active:scale-95 cursor-pointer"
                    >
                      {copiedDns ? <Check className="w-4 h-4 text-[#6DD94B]" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedDns ? '¡Registros copiados!' : 'Copiar Registros DNS'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1">
                  <p className="font-bold">⚡ Propagación en menos de 5 minutos</p>
                  <p className="text-zinc-400">
                    Gracias a la infraestructura de Cloudflare Edge de TecnOdiel, en cuanto pongas los CNAME la web emitirá el certificado SSL y estará visible en todo el mundo.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setActiveTab('domain')}
                    className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition-all active:scale-95 cursor-pointer"
                  >
                    ← Volver
                  </button>
                  <button
                    onClick={() => setActiveTab('whatsapp')}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl sm:rounded-2xl bg-[#6DD94B] hover:bg-white text-black font-black text-xs shadow-lg shadow-[#6DD94B]/20 transition-all duration-200 active:scale-95 cursor-pointer"
                  >
                    <span>Siguiente: Avisar al Cliente</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── TAB 4: AVISAR AL CLIENTE POR WHATSAPP ── */}
            {activeTab === 'whatsapp' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white">
                    Notificar al Cliente por WhatsApp
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Mensaje redactado con lenguaje cercano, sin tecnicismos, con el enlace de su web montada y su clave de acceso.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#181818] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Mensaje pre-redactado:</span>
                    <span className="font-mono text-[11px] text-[#6DD94B]">
                      Teléfono: +{cleanPhone || '34...'}
                    </span>
                  </div>

                  <pre className="p-4 rounded-xl bg-black/60 border border-white/10 text-xs font-sans text-zinc-300 whitespace-pre-wrap leading-relaxed">
                    {whatsappMessage}
                  </pre>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <button
                      onClick={() => handleCopy(whatsappMessage, 'msg')}
                      className="text-xs text-zinc-400 hover:text-white inline-flex items-center gap-1.5 p-2 rounded-lg hover:bg-white/5 transition-all active:scale-95 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Texto</span>
                    </button>

                    <a
                      href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl sm:rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-black font-black text-xs shadow-lg shadow-[#25D366]/30 transition-all duration-200 active:scale-95"
                    >
                      <MessageCircle className="w-4 h-4 fill-black" />
                      <span>Abrir Chat de WhatsApp</span>
                    </a>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setActiveTab('dns')}
                    className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition-all active:scale-95 cursor-pointer"
                  >
                    ← Volver
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 rounded-xl sm:rounded-2xl bg-white hover:bg-[#6DD94B] text-black font-black text-xs transition-all duration-200 active:scale-95 cursor-pointer"
                  >
                    Listo y Cerrar
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
