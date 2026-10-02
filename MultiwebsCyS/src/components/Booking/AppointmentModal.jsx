import React, { useState } from 'react';
import { Calendar, Clock, X, Check, CheckCircle2, ShieldCheck, Stethoscope, User, Phone, Mail } from 'lucide-react';
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

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Por favor, indica tu nombre y teléfono de contacto para confirmar tu cita.');
      return;
    }

    setIsSubmitting(true);
    try {
      const saved = await createAppointment(clinic.id, formData);
      setConfirmedAppointment(saved);
      try {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.5 } });
      } catch (err) {}
    } catch (err) {
      alert('Error al reservar la cita. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-zinc-950 border border-cyan-500/30 shadow-[0_0_60px_rgba(6,182,212,0.25)] text-zinc-100 overflow-hidden animate-spring-in max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Pedir Cita Online</h3>
              <p className="text-[11px] text-zinc-400 font-mono">{clinic.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {confirmedAppointment ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-1">¡Cita Médica Confirmada!</h4>
                <p className="text-xs text-zinc-300 max-w-xs mx-auto">
                  Hemos registrado tu cita en <strong>{clinic.name}</strong>. Te enviaremos un recordatorio por WhatsApp.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900 border border-white/10 font-mono text-xs text-left space-y-1.5 max-w-xs mx-auto">
                <div className="flex justify-between">
                  <span className="text-zinc-500">CÓDIGO:</span>
                  <span className="text-cyan-400 font-bold">{confirmedAppointment.appointment_code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">FECHA:</span>
                  <span className="text-white">{confirmedAppointment.date} a las {confirmedAppointment.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">TRATAMIENTO:</span>
                  <span className="text-white truncate max-w-[150px]">{confirmedAppointment.treatment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">SEGURO:</span>
                  <span className="text-zinc-300">{confirmedAppointment.insurance}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs transition cursor-pointer"
              >
                Cerrar y Volver a la Web
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
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
                    className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-zinc-400 font-semibold uppercase flex items-center gap-1">
                    <Phone className="w-3 h-3 text-cyan-400" />
                    <span>Teléfono Móvil (WhatsApp) *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+34 600 00 00 00"
                    className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

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
                  className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-zinc-400 font-semibold uppercase flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-cyan-400" />
                    <span>Aseguradora / Mutua</span>
                  </label>
                  <select
                    value={formData.insurance}
                    onChange={e => setFormData({ ...formData, insurance: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  >
                    {(clinic.accepted_insurances || MEDICAL_INSURANCES).map((ins, i) => (
                      <option key={i} value={ins}>{ins}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-zinc-400 font-semibold uppercase flex items-center gap-1">
                    <Stethoscope className="w-3 h-3 text-cyan-400" />
                    <span>Motivo o Tratamiento</span>
                  </label>
                  <select
                    value={formData.treatment}
                    onChange={e => setFormData({ ...formData, treatment: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Primera Consulta & Diagnóstico">Primera Consulta & Diagnóstico</option>
                    <option value="Revisión Periódica">Revisión Periódica</option>
                    <option value="Urgencia / Dolor Agudo">Urgencia / Dolor Agudo</option>
                    {(clinic.menu_categories || []).flatMap(c => c.items || []).map((it, idx) => (
                      <option key={idx} value={it.name}>{it.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-zinc-400 font-semibold uppercase">
                    Fecha deseada
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-zinc-400 font-semibold uppercase">
                    Hora orientativa
                  </label>
                  <select
                    value={formData.time}
                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="09:30">09:30 (Mañana)</option>
                    <option value="10:30">10:30 (Mañana)</option>
                    <option value="11:30">11:30 (Mañana)</option>
                    <option value="12:30">12:30 (Mañana)</option>
                    <option value="16:30">16:30 (Tarde)</option>
                    <option value="17:30">17:30 (Tarde)</option>
                    <option value="18:30">18:30 (Tarde)</option>
                    <option value="19:30">19:30 (Tarde)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-zinc-400 font-semibold uppercase">
                  Observaciones médicas o síntomas (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Indica brevemente si tienes dolor, alergias conocidas o si prefieres un doctor en específico..."
                  className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-industrial w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.35)] cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{isSubmitting ? 'Confirmando Cita...' : 'Confirmar Cita Médica'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
