import React, { useState } from 'react';
import { X, Calendar, Clock, Users, MapPin, CheckCircle2, Phone, Mail, MessageSquare, AlertCircle, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { createReservation } from '../../lib/supabase';

export default function BookingModal({ restaurant, isOpen = true, onClose }) {
  if (!isOpen || !restaurant) return null;

  const [step, setStep] = useState(1); // 1: Seleccion mesa, 2: Datos contacto, 3: Confirmacion
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('21:30');
  const [guests, setGuests] = useState(2);
  const [area, setArea] = useState(restaurant.booking_rules?.available_areas?.[0] || 'Salon Principal');
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const maxGuests = restaurant.booking_rules?.max_guests_per_table || 8;
  const guestOptions = Array.from({ length: Math.min(maxGuests, 12) }, (_, i) => i + 1);

  // Proximos 7 dias para seleccion directa
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('es-ES', { weekday: 'short' });
    const dayNumber = d.getDate();
    const month = d.toLocaleDateString('es-ES', { month: 'short' });
    return { dateStr, dayName, dayNumber, month, isToday: i === 0 };
  });

  // Generacion dinamica de franjas horarias segun turnos configurados
  const lunchEnabled = restaurant.lunch_shift?.enabled !== false;
  const dinnerEnabled = restaurant.dinner_shift?.enabled !== false;

  const timeSlots = [];
  if (lunchEnabled) {
    timeSlots.push({
      label: 'Turno de Mediodia / Almuerzo',
      times: ['13:30', '14:00', '14:30', '15:00', '15:30']
    });
  }
  if (dinnerEnabled) {
    timeSlots.push({
      label: 'Turno de Noche & Cocteleria',
      times: ['20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30']
    });
  }
  if (timeSlots.length === 0) {
    timeSlots.push({
      label: 'Horario Continuo',
      times: ['20:00', '21:00', '22:00', '23:00']
    });
  }

  const handleNext = (e) => {
    e.preventDefault();
    if (!date || !time) {
      setErrorMsg('Por favor selecciona fecha y hora para tu reserva.');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handleConfirmReservation = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErrorMsg('Por favor indica tu nombre y telefono de contacto.');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);

    try {
      const res = await createReservation(restaurant.id, {
        date,
        time,
        guests,
        area,
        name,
        phone,
        email,
        notes
      });

      setConfirmedBooking(res);
      setStep(3);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}
    } catch (err) {
      setErrorMsg('Ocurrio un error al procesar tu reserva. Intentalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    if (!confirmedBooking) return;
    const cleanNumber = (restaurant.whatsapp_number || restaurant.phone || '').replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hola ${restaurant.name}, confirmo la reserva con codigo ${confirmedBooking.booking_code} para el ${confirmedBooking.reservation_date} a las ${confirmedBooking.reservation_time} (${confirmedBooking.guests_count} personas, ${confirmedBooking.area}) a nombre de ${confirmedBooking.customer_name}.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  const primaryColor = restaurant.primary_color || '#10b981';

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-2xl transition-opacity duration-200">
      <div 
        className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-zinc-950 border-t sm:border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.95)] overflow-hidden transition-all text-zinc-100 animate-sheet-up sm:animate-spring-in max-h-[92vh] sm:max-h-[85vh] flex flex-col"
        style={{ borderColor: `${primaryColor}40` }}
      >
        {/* Mobile Pull Drag Handle Indicator (Emil Kowalski Drawer style) */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1 rounded-full bg-zinc-700/80" />
        </div>

        {/* Glow Header Accent */}
        <div 
          className="absolute top-0 inset-x-0 h-1" 
          style={{ background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)` }}
        />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 pt-3 sm:pt-5 pb-4 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center border font-mono text-xs font-bold shrink-0"
              style={{ 
                backgroundColor: `${primaryColor}15`, 
                borderColor: `${primaryColor}40`,
                color: primaryColor 
              }}
            >
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-tight">
                {step === 3 ? 'Reserva Confirmada' : `Reservar Mesa en ${restaurant.name}`}
              </h3>
              <p className="text-[11px] text-zinc-400">
                {step === 1 && 'Paso 1: Fecha, comensales y espacio'}
                {step === 2 && 'Paso 2: Datos de contacto y requerimientos'}
                {step === 3 && 'Reserva gestionada directamente por el restaurante'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition emil-pressable touch-target-44 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 no-scrollbar">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Date, Guests, Time, Area */}
          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-5">
              {/* Comensales */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                    1. Numero de Comensales
                  </label>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    Max. {maxGuests} por mesa
                  </span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                  {guestOptions.map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGuests(num)}
                      className={`py-2 text-xs font-semibold rounded-xl border transition ${
                        guests === num
                          ? 'border-white bg-white text-black font-bold shadow-md'
                          : 'border-white/10 bg-zinc-900/80 text-zinc-300 hover:border-white/20'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector de Dias */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-2">
                  2. Fecha de Asistencia
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                  {days.map(d => (
                    <button
                      key={d.dateStr}
                      type="button"
                      onClick={() => setDate(d.dateStr)}
                      className={`flex flex-col items-center py-2 px-1 rounded-xl border transition ${
                        date === d.dateStr
                          ? 'border-emerald-400 bg-emerald-500/10 text-white'
                          : 'border-white/5 bg-zinc-900/60 text-zinc-400 hover:border-white/15'
                      }`}
                      style={date === d.dateStr ? { borderColor: primaryColor, backgroundColor: `${primaryColor}20` } : {}}
                    >
                      <span className="text-[10px] uppercase font-medium">{d.dayName}</span>
                      <span className="text-sm font-bold text-white my-0.5">{d.dayNumber}</span>
                      <span className="text-[9px] text-zinc-500">{d.month}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector de Horarios */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-2">
                  3. Franja Horaria
                </label>
                <div className="space-y-3">
                  {timeSlots.map((group, gIdx) => (
                    <div key={gIdx} className="space-y-1.5">
                      <span className="text-[10px] text-zinc-500 font-mono block uppercase">{group.label}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {group.times.map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setTime(t)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                              time === t
                                ? 'bg-white text-black border-white font-bold'
                                : 'bg-zinc-900 border-white/10 text-zinc-300 hover:border-white/20'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selector de Zona */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-2">
                  4. Espacio / Zona Preferida
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(restaurant.booking_rules?.available_areas || ['Salon Central', 'Terraza']).map(a => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setArea(a)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs transition ${
                        area === a
                          ? 'border-white/40 bg-zinc-800 text-white font-semibold'
                          : 'border-white/5 bg-zinc-900/60 text-zinc-400 hover:border-white/15'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{a}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Informacion de dress code si existe */}
              {restaurant.dress_code && (
                <div className="p-3 rounded-xl bg-zinc-900/40 border border-white/5 text-[11px] text-zinc-400 flex items-center justify-between">
                  <span>Codigo de Vestimenta:</span>
                  <span className="text-zinc-200 font-semibold">{restaurant.dress_code}</span>
                </div>
              )}

              {/* Continuar */}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg"
                style={{
                  backgroundColor: primaryColor,
                  color: '#000000',
                  boxShadow: `0 0 20px ${primaryColor}40`
                }}
              >
                <span>Siguiente: Datos de Titular</span>
                <Clock className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* STEP 2: Customer Contact Info */}
          {step === 2 && (
            <form onSubmit={handleConfirmReservation} className="space-y-4">
              <div className="p-3 rounded-xl bg-zinc-900/70 border border-white/5 flex items-center justify-between text-xs">
                <div>
                  <span className="text-zinc-400 block text-[10px]">Detalle de reserva:</span>
                  <span className="font-semibold text-white">
                    {date} • {time} • {guests} comensales • {area}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-zinc-400 hover:text-white underline font-mono"
                >
                  Modificar
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Nombre Completo del Titular *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Alejandro Morales"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-white/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">Telefono Movil *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+34 600 000 000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-white/40 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">Correo Electronico</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@ejemplo.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-white/40"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Observaciones, Alergenos o Peticiones Especiales</label>
                <textarea
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: Intolerancia al gluten, mesa apartada, evento privado..."
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-white/40 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 bg-zinc-900 text-zinc-300 text-xs font-semibold hover:border-white/20"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                  style={{
                    backgroundColor: primaryColor,
                    color: '#000000',
                    boxShadow: `0 0 20px ${primaryColor}40`
                  }}
                >
                  {submitting ? 'Procesando...' : 'Confirmar Reserva Directa'}
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Confirmacion Exitosa */}
          {step === 3 && confirmedBooking && (
            <div className="text-center py-4 space-y-4">
              <div 
                className="w-12 h-12 mx-auto rounded-full flex items-center justify-center border"
                style={{
                  backgroundColor: `${primaryColor}20`,
                  borderColor: primaryColor,
                  color: primaryColor
                }}
              >
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Localizador de Reserva</span>
                <h4 className="text-xl font-black text-white tracking-widest mt-0.5 font-mono">
                  #{confirmedBooking.booking_code}
                </h4>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 text-left space-y-2 text-xs">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-zinc-400">Establecimiento:</span>
                  <span className="font-semibold text-white">{restaurant.name}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-zinc-400">Fecha & Hora:</span>
                  <span className="font-semibold text-white">{confirmedBooking.reservation_date} a las {confirmedBooking.reservation_time}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-zinc-400">Comensales & Espacio:</span>
                  <span className="font-semibold text-white">{confirmedBooking.guests_count} personas ({confirmedBooking.area})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Titular:</span>
                  <span className="font-semibold text-white">{confirmedBooking.customer_name}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleWhatsAppRedirect}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-400 hover:bg-emerald-300 text-black transition flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Enviar Confirmacion a WhatsApp de Atencion</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2 px-4 rounded-xl border border-white/10 bg-zinc-900 text-zinc-300 hover:text-white text-xs font-semibold"
                >
                  Finalizar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
