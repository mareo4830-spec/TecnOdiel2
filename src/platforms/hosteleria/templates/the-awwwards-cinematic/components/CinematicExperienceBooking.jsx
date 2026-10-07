import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CinematicTextReveal from './CinematicTextReveal.jsx';
import CinematicMagneticLink from './CinematicMagneticLink.jsx';

/**
 * Sección de Reserva Privada y Acceso al Santuario Culinario
 * Exclusivo de "1. THE AWWWARDS CINEMATIC"
 * Cero botones rectangulares: Toda la acción de solicitud se ejecuta
 * a través de un enlace magnético de gran formato con línea expansiva.
 */
export const CinematicExperienceBooking = ({ tenant }) => {
  const [guests, setGuests] = useState('2');
  const [date, setDate] = useState('');
  const [selectedPass, setSelectedPass] = useState('pass-1');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="relative w-full min-h-screen bg-black py-28 md:py-44 px-6 md:px-16 overflow-hidden border-t border-neutral-900">
      <div className="max-w-5xl mx-auto">
        {/* Cabecera */}
        <div className="text-center mb-16">
          <CinematicTextReveal delay={0.1}>
            <span className="text-xs font-mono tracking-[0.4em] text-neutral-500 uppercase">
              ACCESO RESTRINGIDO // PLAZAS LIMITADAS
            </span>
          </CinematicTextReveal>

          <CinematicTextReveal delay={0.2} duration={1.2}>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-extralight uppercase tracking-tight text-white mt-4">
              SOLICITAR <span className="font-serif italic text-neutral-400">PASE PRIVADO</span>
            </h2>
          </CinematicTextReveal>

          <div className="max-w-xl mx-auto mt-6">
            <CinematicTextReveal delay={0.3}>
              <p className="text-sm md:text-base text-neutral-400 font-light leading-relaxed">
                Cada velada alberga únicamente a un número selecto de invitados para preservar el
                silencio, el tempo y la máxima precisión organoléptica.
              </p>
            </CinematicTextReveal>
          </div>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-neutral-800 p-12 text-center bg-neutral-950/70"
          >
            <span className="block font-mono text-xs tracking-widest text-neutral-400 mb-2">
              SOLICITUD EN REGISTRO DE MEMBRESÍA
            </span>
            <h3 className="text-3xl sm:text-4xl font-light text-white uppercase mb-4">
              SU PETICIÓN ESTÁ EN CURSO
            </h3>
            <p className="text-neutral-400 font-light max-w-md mx-auto text-sm leading-relaxed mb-8">
              Nuestro Maître d' someterá su solicitud al protocolo de disponibilidad del día elegido.
              Recibirá confirmación codificada vía mensaje privado.
            </p>
            <CinematicMagneticLink
              onClick={() => setSubmitted(false)}
              size="text-sm sm:text-base"
              tracking="tracking-[0.3em]"
            >
              ← EMITIR NUEVA CONSULTA
            </CinematicMagneticLink>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 border-b border-neutral-900 pb-12">
              {/* Comensales */}
              <div className="space-y-3">
                <label className="block text-[11px] font-mono tracking-[0.3em] text-neutral-500 uppercase">
                  COMENSALES
                </label>
                <div className="flex space-x-4">
                  {['2', '4', '6'].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setGuests(num)}
                      className={`text-lg font-light transition-colors ${
                        guests === num
                          ? 'text-white border-b-2 border-white pb-1'
                          : 'text-neutral-600 hover:text-neutral-300'
                      }`}
                    >
                      {num} PAX
                    </button>
                  ))}
                </div>
              </div>

              {/* Fecha */}
              <div className="space-y-3">
                <label className="block text-[11px] font-mono tracking-[0.3em] text-neutral-500 uppercase">
                  FECHA DESEADA
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-transparent border-b border-neutral-800 focus:border-white text-white text-sm font-mono tracking-wider py-1 outline-none transition-colors"
                />
              </div>

              {/* Itinerario */}
              <div className="space-y-3">
                <label className="block text-[11px] font-mono tracking-[0.3em] text-neutral-500 uppercase">
                  ITINERARIO
                </label>
                <select
                  value={selectedPass}
                  onChange={(e) => setSelectedPass(e.target.value)}
                  className="w-full bg-black border-b border-neutral-800 focus:border-white text-neutral-200 text-sm tracking-wider py-1 outline-none cursor-pointer"
                >
                  <option value="pass-1">EL ORIGEN DEL VACÍO (14 PASOS)</option>
                  <option value="pass-2">ALQUIMIA CINEGÉTICA (21 PASOS)</option>
                </select>
              </div>
            </div>

            {/* Datos de contacto elegantes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-b border-neutral-900 pb-12">
              <div className="space-y-2">
                <label className="block text-[11px] font-mono tracking-[0.3em] text-neutral-500 uppercase">
                  NOMBRE COMPLETO DEL ANFITRIÓN
                </label>
                <input
                  type="text"
                  required
                  placeholder="NOMBRE Y APELLIDOS"
                  className="w-full bg-transparent border-b border-neutral-800 focus:border-white text-white text-sm tracking-widest uppercase py-2 outline-none transition-colors placeholder:text-neutral-700"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-mono tracking-[0.3em] text-neutral-500 uppercase">
                  TELÉFONO O TELÉGRAFO DE CONTACTO
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+34 600 000 000"
                  className="w-full bg-transparent border-b border-neutral-800 focus:border-white text-white text-sm tracking-widest font-mono py-2 outline-none transition-colors placeholder:text-neutral-700"
                />
              </div>
            </div>

            {/* BOTÓN MAGNÉTICO DE ENVÍO - ESTRICTAMENTE SIN RECTÁNGULOS */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6">
              <span className="text-[11px] font-mono text-neutral-600 tracking-widest uppercase text-center sm:text-left">
                RESPUESTA ESTIMADA: MENOS DE 12 HORAS · CONFIDENCIALIDAD TOTAL
              </span>

              <CinematicMagneticLink
                onClick={handleSubmit}
                size="text-xl sm:text-2xl md:text-3xl"
                tracking="tracking-[0.25em]"
              >
                CONFIRMAR Y EMITIR SOLICITUD →
              </CinematicMagneticLink>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default CinematicExperienceBooking;
