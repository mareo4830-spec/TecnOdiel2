import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  X, 
  Check, 
  CheckCircle2, 
  ShieldCheck, 
  Stethoscope, 
  User, 
  Phone, 
  Mail, 
  AlertCircle,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { createAppointment } from '../../lib/supabase';
import { MEDICAL_INSURANCES } from '../../lib/mockData';

export default function AppointmentModal({ clinic, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    insurance: clinic?.accepted_insurances?.[0] || 'Privado / Sin Seguro',
    treatment: clinic?.menu_categories?.[0]?.items?.[0]?.name || 'Primera Consulta & Diagnóstico',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const quickDays = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('es-ES', { weekday: 'short' });
    const dayNum = d.getDate();
    const month = d.toLocaleDateString('es-ES', { month: 'short' });
    return { dateStr, dayName, dayNum, month, isToday: i === 0 };
  });

  const availableTimes = ['09:30', '10:30', '11:30', '12:30', '16:30', '17:30', '18:30', '19:30'];

  const availableInsurances = clinic?.accepted_insurances?.length 
    ? clinic.accepted_insurances 
    : MEDICAL_INSURANCES;

  const availableTreatments = [
    'Primera Consulta & Diagnóstico',
    'Revisión Periódica',
    'Urgencia / Dolor Agudo',
    ...((clinic?.menu_categories || []).flatMap(c => c.items || []).map(it => it.name))
  ].filter((v, i, a) => a.indexOf(v) === i);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setErrorMsg('Por favor, indica tu nombre y teléfono móvil para confirmar la cita médica.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const saved = await createAppointment(clinic.id, formData);
      setConfirmedAppointment(saved);
      try {
        confetti({ particleCount: 90, spread: 65, origin: { y: 0.55 } });
      } catch (err) {}
    } catch (err) {
      setErrorMsg('Error al conectar con el servidor. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const primaryColor = clinic?.primary_color || '#06b6d4';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden">
        {/* Backdrop with fade animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-2xl"
        />

        {/* Modal Window with spring physics */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 24 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-zinc-950 border-t sm:border border-cyan-500/30 shadow-[0_0_70px_rgba(6,182,212,0.3)] text-zinc-100 overflow-hidden max-h-[92vh] sm:max-h-[88vh] flex flex-col z-10"
        >
          {/* Top Medical Pulse Accent */}
          <div 
            className="absolute top-0 inset-x-0 h-1"
            style={{ background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)` }}
          />

          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-zinc-900/60">
            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.05 }}
                className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0"
              >
                <Calendar className="w-5 h-5" />
              </motion.div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-white tracking-tight flex items-center gap-1.5">
                  <span>Pedir Cita Online</span>
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                </h3>
                <p className="text-[11px] text-zinc-400 font-mono truncate max-w-[220px] sm:max-w-none">
                  {clinic.name}
                </p>
              </div>
            </div>
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 no-scrollbar">
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 shake-error"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {confirmedAppointment ? (
                <motion.div 
                  key="confirmed-view"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="text-center py-6 space-y-4"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 450, damping: 18, delay: 0.1 }}
                    className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(6,182,212,0.4)]"
                  >
                    <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                  </motion.div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1">¡Cita Médica Confirmada!</h4>
                    <p className="text-xs text-zinc-300 max-w-xs mx-auto">
                      Hemos registrado tu solicitud en <strong>{clinic.name}</strong>. Recibirás un recordatorio automático por WhatsApp.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 font-mono text-xs text-left space-y-2 max-w-sm mx-auto">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-zinc-500">CÓDIGO:</span>
                      <span className="text-cyan-400 font-bold">{confirmedAppointment.appointment_code}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-zinc-500">FECHA:</span>
                      <span className="text-white">{confirmedAppointment.date} a las {confirmedAppointment.time}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-zinc-500">TRATAMIENTO:</span>
                      <span className="text-white truncate max-w-[170px]">{confirmedAppointment.treatment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">SEGURO:</span>
                      <span className="text-zinc-300">{confirmedAppointment.insurance}</span>
                    </div>
                  </div>

                  <motion.button
                    type="button"
                    onClick={onClose}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs transition cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.4)] interactive-button"
                  >
                    Cerrar y Volver a la Web
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form 
                  key="form-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit} 
                  className="space-y-4"
                >
                  {/* Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-zinc-400 font-semibold uppercase flex items-center gap-1">
                        <User className="w-3 h-3 text-cyan-400" />
                        <span>Nombre y Apellidos *</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ej. Carmen Rodríguez"
                        className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/40 interactive-input"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-zinc-400 font-semibold uppercase flex items-center gap-1">
                        <Phone className="w-3 h-3 text-cyan-400" />
                        <span>Teléfono Móvil *</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+34 600 00 00 00"
                        className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/40 font-mono interactive-input"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-zinc-400 font-semibold uppercase flex items-center gap-1">
                      <Mail className="w-3 h-3 text-cyan-400" />
                      <span>Email (Para el justificante)</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="paciente@ejemplo.com"
                      className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/40 interactive-input"
                    />
                  </div>

                  {/* Selectable Mutuas / Insurances with animated chips */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono text-zinc-400 font-semibold uppercase flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Aseguradora Médica / Mutua</span>
                      </span>
                      <span className="text-[10px] text-cyan-400 font-mono">Seleccionado: {formData.insurance}</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar pr-1">
                      {availableInsurances.map((ins, i) => {
                        const isSelected = formData.insurance === ins;
                        return (
                          <motion.button
                            key={i}
                            type="button"
                            onClick={() => setFormData({ ...formData, insurance: ins })}
                            whileHover={{ scale: 1.05, y: -1 }}
                            whileTap={{ scale: 0.94 }}
                            transition={{ type: "spring", stiffness: 450, damping: 25 }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-cyan-500/25 border-cyan-400 text-white font-bold shadow-[0_0_12px_rgba(6,182,212,0.35)]'
                                : 'bg-zinc-900 border-white/10 text-zinc-400 hover:border-white/25 hover:text-zinc-200'
                            }`}
                          >
                            {isSelected && (
                              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                <Check className="w-3 h-3 text-cyan-400 stroke-[3]" />
                              </motion.span>
                            )}
                            <span>{ins}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selectable Treatment with animated chips */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono text-zinc-400 font-semibold uppercase flex items-center gap-1">
                      <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Motivo de Consulta o Especialidad</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto no-scrollbar pr-1">
                      {availableTreatments.map((t, idx) => {
                        const isSelected = formData.treatment === t;
                        return (
                          <motion.button
                            key={idx}
                            type="button"
                            onClick={() => setFormData({ ...formData, treatment: t })}
                            whileHover={{ scale: 1.02, y: -1 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className={`p-2 rounded-xl border text-left text-xs transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                              isSelected
                                ? 'bg-cyan-500/20 border-cyan-400 text-white font-semibold shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                                : 'bg-zinc-900/70 border-white/10 text-zinc-400 hover:border-white/20 hover:text-zinc-200'
                            }`}
                          >
                            <span className="truncate">{t}</span>
                            {isSelected && (
                              <span className="w-4 h-4 rounded-full bg-cyan-400 text-black flex items-center justify-center shrink-0">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </span>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Date & Time with quick chips */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono text-zinc-400 font-semibold uppercase flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Día de Cita</span>
                    </label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {quickDays.map(d => {
                        const isSelected = formData.date === d.dateStr;
                        return (
                          <motion.button
                            key={d.dateStr}
                            type="button"
                            onClick={() => setFormData({ ...formData, date: d.dateStr })}
                            whileHover={{ y: -2, scale: 1.04 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className={`flex flex-col items-center py-2 px-1 rounded-xl border transition-colors cursor-pointer ${
                              isSelected
                                ? 'border-cyan-400 bg-cyan-500/20 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                                : 'border-white/5 bg-zinc-900/70 text-zinc-400 hover:border-white/20 hover:bg-zinc-800'
                            }`}
                          >
                            <span className="text-[10px] uppercase font-medium">{d.dayName}</span>
                            <span className="text-sm font-bold text-white my-0.5">{d.dayNum}</span>
                            <span className="text-[9px] text-zinc-500">{d.month}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-zinc-400 font-semibold uppercase flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Hora Aproximada</span>
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {availableTimes.map(t => {
                        const isSelected = formData.time === t;
                        return (
                          <motion.button
                            key={t}
                            type="button"
                            onClick={() => setFormData({ ...formData, time: t })}
                            whileHover={{ scale: 1.06, y: -1 }}
                            whileTap={{ scale: 0.94 }}
                            transition={{ type: "spring", stiffness: 450, damping: 25 }}
                            className={`py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors cursor-pointer text-center ${
                              isSelected
                                ? 'bg-cyan-400 text-black border-cyan-400 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                                : 'bg-zinc-900 border-white/10 text-zinc-300 hover:border-white/25 hover:bg-zinc-800'
                            }`}
                          >
                            {t}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-zinc-400 font-semibold uppercase">
                      Observaciones médicas o síntomas (Opcional)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={e => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Indica brevemente tus síntomas o si requieres algún horario en particular..."
                      className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/40 resize-none interactive-input"
                    />
                  </div>

                  <div className="pt-2">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02, y: -1.5 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.4)] cursor-pointer disabled:opacity-50 interactive-button"
                    >
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>{isSubmitting ? 'Confirmando Cita...' : 'Confirmar Cita Médica'}</span>
                    </motion.button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
