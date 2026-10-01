import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Utensils, Store, Smartphone, CheckCircle2, Star, Calendar, MessageCircle, Phone, ArrowUpRight, Flame, MapPin, Sparkles } from 'lucide-react'

export default function InteractiveDeviceDemo({ onOpenAudit }) {
  const [activeTab, setActiveTab] = useState('restaurant')
  const [selectedDish, setSelectedDish] = useState(0)
  const [reservedSuccess, setReservedSuccess] = useState(false)
  const [activeParty, setActiveParty] = useState(4)

  const dishes = [
    {
      name: 'Gamba Blanca de Huelva',
      price: '24,00€',
      tag: 'Producto Estrella',
      desc: 'Selección de la lonja de Isla Cristina, cocida en su punto justo de sal.',
      allergens: ['Crustáceos'],
      calories: '180 kcal'
    },
    {
      name: 'Jamón Ibérico 100% Bellota',
      price: '26,00€',
      tag: 'D.O. Jabugo',
      desc: 'Cortado a cuchillo al momento, servido con picos artesanos y tomate rallado.',
      allergens: [],
      calories: '320 kcal'
    },
    {
      name: 'Arroz Caldoso con Bogavante',
      price: '21,50€ / p',
      tag: 'Mínimo 2 pers.',
      desc: 'Fondo tradicional de marisco con bogavante fresco azul del Atlántico.',
      allergens: ['Crustáceos', 'Moluscos'],
      calories: '450 kcal'
    }
  ]

  const handleSimulateBooking = () => {
    setReservedSuccess(true)
    setTimeout(() => {
      setReservedSuccess(false)
    }, 4000)
  }

  return (
    <section className="relative w-full bg-black py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 border-t border-white/5 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-emerald-500/[0.04] blur-[160px] rounded-full" />

      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-semibold">
              // PRUÉBALO TÚ MISMO EN VIVO
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Así es exactamente como verán <br />
            <span className="text-zinc-400 font-light">tu negocio tus clientes en el móvil.</span>
          </h2>
          <p className="mt-4 text-xs sm:text-base text-zinc-300 font-normal leading-relaxed">
            Sin PDFs ilegibles ni páginas lentas. Una experiencia digital inmediata, táctil y diseñada para que reserven mesa o te pidan presupuesto en segundos.
          </p>

          {/* Interactive Mode Selector */}
          <div className="mt-8 inline-flex p-1.5 rounded-full bg-zinc-900 border border-white/10 shadow-2xl">
            <button
              onClick={() => setActiveTab('restaurant')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                activeTab === 'restaurant'
                  ? 'bg-emerald-500 text-black font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Utensils className="h-3.5 w-3.5" />
              <span>Restaurantes & Bares</span>
            </button>

            <button
              onClick={() => setActiveTab('business')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                activeTab === 'business'
                  ? 'bg-cyan-400 text-black font-bold shadow-[0_0_20px_rgba(34,211,238,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Store className="h-3.5 w-3.5" />
              <span>Comercios & Negocios</span>
            </button>
          </div>
        </motion.div>

        {/* Dual Column: Interactive Device Simulator & Explanatory Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          {/* Left Column: Realistic Interactive Smartphone Container */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex justify-center"
          >
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] rounded-[42px] border-[5px] border-zinc-800 bg-black p-3.5 shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_30px_rgba(52,211,153,0.15)] ring-1 ring-white/20 overflow-hidden">
              {/* Phone Speaker & Dynamic Island */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 rounded-full bg-zinc-900 border border-white/10 z-30 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-950 border border-zinc-800 mr-2" />
                <div className="w-8 h-1 rounded-full bg-zinc-800" />
              </div>

              {/* Phone Screen Canvas */}
              <div className="relative rounded-[32px] bg-zinc-950 border border-white/10 pt-8 pb-5 px-3.5 sm:px-4 min-h-[560px] flex flex-col justify-between overflow-hidden">
                {/* Mode 1: Restaurant Simulator */}
                {activeTab === 'restaurant' && (
                  <motion.div
                    key="restaurant"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35 }}
                    className="flex flex-col h-full justify-between"
                  >
                    <div>
                      {/* Restaurant Header */}
                      <div className="border-b border-white/10 pb-3 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-white tracking-tight flex items-center gap-1.5">
                            Marisquería El Odiel
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          </span>
                          <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                            Abierto Hoy
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-400 font-mono block mt-0.5">
                          Plaza de las Monjas, Huelva • Carta Digital QR
                        </span>
                      </div>

                      {/* Quick Interactive Dish Selector */}
                      <div className="space-y-2 mb-3">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block font-semibold">
                          Toca un plato para ver la carta:
                        </span>
                        {dishes.map((dish, idx) => (
                          <motion.button
                            key={idx}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedDish(idx)}
                            className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                              selectedDish === idx
                                ? 'bg-white/[0.08] border-emerald-400/50 shadow-[0_0_15px_rgba(52,211,153,0.15)]'
                                : 'bg-white/[0.02] border-white/5 hover:border-white/15'
                            }`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-bold text-white">{dish.name}</span>
                              <span className="text-xs font-mono font-bold text-emerald-400">{dish.price}</span>
                            </div>
                            <p className="text-[10px] text-zinc-400 line-clamp-1 leading-snug">{dish.desc}</p>
                          </motion.button>
                        ))}
                      </div>

                      {/* Selected Dish Detail Drawer */}
                      <div className="bg-emerald-500/[0.06] border border-emerald-500/20 p-2.5 rounded-xl">
                        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-300">
                          <span className="text-emerald-400 font-semibold">{dishes[selectedDish].tag}</span>
                          <span>{dishes[selectedDish].calories}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] font-mono text-zinc-400">Alérgenos:</span>
                          {dishes[selectedDish].allergens.length > 0 ? (
                            dishes[selectedDish].allergens.map((a, i) => (
                              <span key={i} className="text-[9px] bg-white/10 px-1.5 py-0.2 rounded text-zinc-200">
                                {a}
                              </span>
                            ))
                          ) : (
                            <span className="text-[9px] text-emerald-400">Sin alérgenos comunes</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Direct Booking Panel */}
                    <div className="mt-4 pt-3 border-t border-white/10">
                      <div className="flex items-center justify-between mb-2 text-[10px] font-mono text-zinc-300">
                        <span>Seleccionar Personas:</span>
                        <div className="flex gap-1">
                          {[2, 4, 6, 8].map((num) => (
                            <button
                              key={num}
                              onClick={() => setActiveParty(num)}
                              className={`h-5 w-6 rounded text-[10px] font-bold ${
                                activeParty === num
                                  ? 'bg-emerald-400 text-black'
                                  : 'bg-white/5 text-zinc-400'
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={handleSimulateBooking}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-400 transition-colors"
                      >
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Confirmar Reserva Directa (0€ Comisión)</span>
                      </motion.button>

                      {/* Toast Confirmation Feedback */}
                      <AnimatePresence>
                        {reservedSuccess && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="mt-2 p-2 rounded-lg bg-emerald-950/90 border border-emerald-400/40 text-[10px] text-emerald-300 text-center font-mono flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                            <span>¡Reserva para {activeParty} pers. notificada a tu WhatsApp!</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}

                {/* Mode 2: Local Business Google Maps Simulator */}
                {activeTab === 'business' && (
                  <motion.div
                    key="business"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35 }}
                    className="flex flex-col h-full justify-between"
                  >
                    <div>
                      {/* Simulated Google Search Bar */}
                      <div className="bg-zinc-900 rounded-full px-3 py-1.5 border border-white/10 flex items-center gap-2 text-[10px] text-zinc-300 mb-3">
                        <MapPin className="h-3 w-3 text-cyan-400" />
                        <span className="truncate">"Reformas & Baños Huelva"</span>
                      </div>

                      {/* #1 Ranked Business Card */}
                      <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-cyan-500/40 shadow-[0_0_25px_rgba(34,211,238,0.15)] mb-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
                            Nº1 PATROCINADO Y ORGÁNICO
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400">HUELVA</span>
                        </div>

                        <h4 className="text-sm font-bold text-white">Reformas & Espacios Huelva</h4>
                        
                        <div className="flex items-center gap-1.5 my-1 text-[11px] text-amber-400">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} className="h-3 w-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <span className="font-bold text-white">5.0</span>
                          <span className="text-zinc-400 text-[10px]">(148 reseñas locales)</span>
                        </div>

                        <p className="text-[10px] text-zinc-300 leading-snug mt-1">
                          Especialistas en cocinas y baños. Presupuesto cerrado en 24h sin compromiso.
                        </p>
                      </div>

                      {/* High Conversion Direct Callout */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono uppercase text-zinc-400 block font-semibold">
                          Acciones que convierten clientes:
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href="tel:600000000"
                            onClick={(e) => { e.preventDefault(); alert("Simulación: El cliente te llama inmediatamente a tu teléfono."); }}
                            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-white font-bold transition-all"
                          >
                            <Phone className="h-3 w-3 text-cyan-400" />
                            <span>Llamar Ya</span>
                          </a>

                          <a
                            href="https://wa.me/34600000000"
                            onClick={(e) => { e.preventDefault(); alert("Simulación: Se abre WhatsApp con el mensaje pre-redactado pidiendo presupuesto."); }}
                            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-500 text-black text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:bg-emerald-400 transition-all"
                          >
                            <MessageCircle className="h-3 w-3 text-black" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Result Metric */}
                    <div className="pt-3 border-t border-white/10 text-center">
                      <span className="font-mono text-[10px] text-cyan-400 font-bold block">
                        +42 Presupuestos Recibidos Este Mes
                      </span>
                      <span className="text-[9px] text-zinc-400 font-mono">
                        Tráfico 100% cualificado de gente buscando en Huelva
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Explanatory Breakdown of What TecnOdiel Does */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6"
          >
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2 block font-medium">
                // EL IMPACTO REAL EN TU BOLSILLO
              </span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
                No hacemos webs para "estar en internet". <br />
                <span className="text-emerald-400 font-light">Hacemos webs para que tu negocio facture más.</span>
              </h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Utensils className="h-4 w-4" />
                  </div>
                  <h4 className="text-base font-bold text-white">Si tienes un Restaurante o Bar:</h4>
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                  Sustituimos el PDF incómodo por una carta táctil que vuela en el móvil. Tus clientes eligen platos con apetito y reservan mesa directamente en tu WhatsApp o panel sin que pagues comisiones de 2€ por persona a plataformas intermediarias.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Store className="h-4 w-4" />
                  </div>
                  <h4 className="text-base font-bold text-white">Si tienes una Clínica, Taller, Reformas o Tienda:</h4>
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                  Optimizamos tu ficha de Google Maps y creamos una página limpia que genera confianza instantánea. Quien busque tu servicio en Huelva te encontrará el primero y te contactará en 1 clic.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <h4 className="text-base font-bold text-white">Cero dolores de cabeza tecnológicos:</h4>
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                  Nosotros nos encargamos del dominio, del diseño, de las fotos y de la programación. Tú solo te preocupas de atender a los clientes que entran por la puerta.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <motion.button
                onClick={onOpenAudit}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 bg-white px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold text-black hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)]"
              >
                <span>Pedir Presupuesto Para Mi Negocio</span>
                <ArrowUpRight className="h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
