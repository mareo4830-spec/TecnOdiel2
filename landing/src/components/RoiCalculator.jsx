import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, TrendingUp, ShieldCheck, Clock, ArrowUpRight, Coins } from 'lucide-react'
import TiltCard from './TiltCard'
import SlideCommit from './ui/SlideCommit'

export default function RoiCalculator({ onOpenAudit }) {
  const [clientsPerMonth, setClientsPerMonth] = useState(350)
  const [averageTicket, setAverageTicket] = useState(25)

  // Typical platform commission per diner is ~2€ to 2.50€
  const commissionPerPerson = 2.0
  // Estimated percentage of reservations handled digitally vs manual phone calls
  const digitalShare = 0.65

  // Yearly commission savings
  const monthlySavings = Math.round(clientsPerMonth * digitalShare * commissionPerPerson)
  const yearlySavings = monthlySavings * 12

  // Hours saved per month (assuming 3 min per phone call)
  const hoursSavedPerMonth = Math.round((clientsPerMonth * digitalShare * 3) / 60)

  // Estimated extra revenue from being #1 in Google Maps (+15% more customers)
  const estimatedNewRevenue = Math.round(clientsPerMonth * 0.15 * averageTicket)

  return (
    <section className="relative w-full bg-black py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 border-t border-white/5 overflow-hidden">
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
              // CALCULADORA DE RENTABILIDAD EN VIVO
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Calcula cuánto dinero y tiempo <br />
            <span className="text-zinc-400 font-light">ahorras al mes con TecnOdiel.</span>
          </h2>
          <p className="mt-4 text-xs sm:text-base text-zinc-300 font-normal leading-relaxed">
            Mueve los selectores según el volumen de tu local o servicio y comprueba por qué una web propia se amortiza sola desde el primer mes.
          </p>
        </motion.div>

        {/* Interactive Dual Card Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Controls Column */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-zinc-950/80 border border-white/10 backdrop-blur-2xl shadow-xl space-y-6"
          >
            {/* Quick Sector Presets */}
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-2 font-semibold">
                Perfiles Rápidos:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Cafetería / Bar', clients: 150, ticket: 10 },
                  { label: 'Restaurante / Tapas', clients: 350, ticket: 25 },
                  { label: 'Asador / Finde', clients: 650, ticket: 40 },
                  { label: 'Clínica / Salud', clients: 220, ticket: 55 },
                ].map((preset) => {
                  const isSelected = clientsPerMonth === preset.clients && averageTicket === preset.ticket;
                  return (
                    <motion.button
                      key={preset.label}
                      type="button"
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                      onClick={() => {
                        setClientsPerMonth(preset.clients);
                        setAverageTicket(preset.ticket);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer border ${
                        isSelected
                          ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                          : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {preset.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Clientes / Comensales al Mes:
                </label>
                <span className="font-mono text-lg sm:text-xl font-bold text-emerald-400">
                  {clientsPerMonth} personas
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="1500"
                step="25"
                value={clientsPerMonth}
                onChange={(e) => setClientsPerMonth(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-400 mt-1">
                <span>50 comensales</span>
                <span>1.500 comensales</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Ticket Medio Estimado:
                </label>
                <span className="font-mono text-lg sm:text-xl font-bold text-cyan-400">
                  {averageTicket} € / persona
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={averageTicket}
                onChange={(e) => setAverageTicket(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-400 mt-1">
                <span>10 €</span>
                <span>100 €</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] sm:text-xs text-zinc-400 font-mono leading-relaxed">
              💡 Calculado sobre la comisión media de portales de reserva (2,00€ por cubierto) frente al coste fijo cero de tu propia plataforma TecnOdiel.
            </div>
          </motion.div>

          {/* Real-time Impact Result Board */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <TiltCard
              tiltIntensity={6}
              className="p-6 sm:p-8 md:p-10 rounded-3xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-black border border-emerald-500/30 backdrop-blur-2xl shadow-[0_0_60px_rgba(16,185,129,0.15)] relative overflow-hidden"
            >
              {/* Glowing Laser Border Top */}
              <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-emerald-400 font-semibold block mb-4">
                // ESTIMACIÓN DIRECTA PARA TU NEGOCIO
              </span>

              <div className="space-y-4 sm:space-y-5 mb-8">
                {/* Metric 1 */}
                <div className="p-4 rounded-2xl bg-black/60 border border-emerald-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                      <Coins className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-xs text-zinc-400 font-mono block">Ahorro en Comisiones al Año</span>
                      <span className="text-xl sm:text-2xl font-black text-white">{yearlySavings.toLocaleString('es-ES')} €</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                    100% TUYO
                  </span>
                </div>

                {/* Metric 2 */}
                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-xs text-zinc-400 font-mono block">Tiempo Ahorrado al Teléfono</span>
                      <span className="text-xl sm:text-2xl font-black text-white">{hoursSavedPerMonth} Horas / mes</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded">
                    AUTOMÁTICO
                  </span>
                </div>

                {/* Metric 3 */}
                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-xs text-zinc-400 font-mono block">Ingresos Extra con Google Maps</span>
                      <span className="text-xl sm:text-2xl font-black text-white">+{estimatedNewRevenue.toLocaleString('es-ES')} € / mes</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-1 rounded">
                    NUEVOS CLIENTES
                  </span>
                </div>
              </div>

              <div className="w-full flex justify-center pt-2">
                <SlideCommit
                  width="100%"
                  height={50}
                  radius={14}
                  label="Quiero una Propuesta Personalizada"
                  doneLabel="¡Abriendo Propuesta!"
                  trackColor="#09090b"
                  handleColor="#ffffff"
                  successColor="#10b981"
                  onConfirm={async () => {
                    if (onOpenAudit) onOpenAudit();
                    return true;
                  }}
                />
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
