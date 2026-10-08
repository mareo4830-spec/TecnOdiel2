import React from 'react';
import LegalLayout from './LegalLayout';
import { Cookie, Settings, ShieldCheck, Info } from 'lucide-react';

export default function PoliticaCookies({ onNavigateHome }) {
  const handleResetCookies = () => {
    localStorage.removeItem('tecnodiel_cookie_consent');
    window.location.reload();
  };

  return (
    <LegalLayout
      title="Política de Cookies"
      subtitle="Información detallada sobre el uso de cookies y tecnologías similares de almacenamiento local en tecnodiel.vercel.app conforme a la LSSI-CE y directrices de la AEPD."
      currentPath="politica-cookies"
      onNavigateHome={onNavigateHome}
    >
      {/* 1. ¿Qué son las cookies? */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
          <Cookie className="h-5 w-5 text-[#6DD94B]" />
          1. ¿Qué es una cookie?
        </h2>
        <p>
          Una cookie es un pequeño archivo de texto que un sitio web descarga y almacena en su navegador o dispositivo (ordenador, tablet o teléfono móvil) cuando visita determinadas páginas web. Las cookies permiten a un sitio web, entre otras cosas, recordar sus preferencias de navegación, garantizar la seguridad de las sesiones, recordar elementos técnicos y recopilar información estadística anonimizada.
        </p>
      </section>

      {/* 2. Tipos de cookies utilizadas */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
          <ShieldCheck className="h-5 w-5 text-[#6DD94B]" />
          2. Tipos de cookies que utiliza este sitio web
        </h2>
        <p>
          En este sitio web utilizamos cookies propias y de terceros clasificadas en las siguientes categorías:
        </p>

        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="text-base font-bold text-white flex items-center justify-between">
              <span>a) Cookies Técnicas y Estrictamente Necesarias</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#6DD94B]/20 text-[#6DD94B] px-2.5 py-0.5 rounded-full">Siempre activas</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Son indispensables para el correcto funcionamiento del sitio web y la prestación de los servicios solicitados (por ejemplo, mantener la sesión de autenticación con Google/Supabase, gestionar la navegación segura, y recordar su elección respecto al banner de cookies). No pueden desactivarse en nuestros sistemas.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="text-base font-bold text-white flex items-center justify-between">
              <span>b) Cookies de Preferencias y Funcionalidad</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 text-zinc-300 px-2.5 py-0.5 rounded-full">Configurables</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Permiten recordar información para que el usuario acceda al servicio con determinadas características personalizadas (como el sector seleccionado en el configurador o los borradores temporales de solicitud).
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="text-base font-bold text-white flex items-center justify-between">
              <span>c) Cookies Analíticas y de Rendimiento</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 text-zinc-300 px-2.5 py-0.5 rounded-full">Requieren consentimiento</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Nos permiten cuantificar el número de usuarios y realizar la medición y análisis estadístico de la utilización que hacen los usuarios de la web (páginas visitadas, tiempos de carga, interacción con el escaparate interactivo) con el fin de introducir mejoras en base al análisis de los datos.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Tabla de cookies */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
          3. Inventario detallado de cookies y almacenamiento local
        </h2>

        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-white/5 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Nombre</th>
                <th className="p-3">Proveedor</th>
                <th className="p-3">Finalidad</th>
                <th className="p-3">Duración</th>
                <th className="p-3">Tipo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="p-3 font-mono text-[#6DD94B]">tecnodiel_cookie_consent</td>
                <td className="p-3">TecnOdiel</td>
                <td className="p-3">Almacena la preferencia de consentimiento de cookies del usuario.</td>
                <td className="p-3">1 año</td>
                <td className="p-3">Técnica (Necesaria)</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-[#6DD94B]">tecnodiel-admin-auth</td>
                <td className="p-3">Supabase / TecnOdiel</td>
                <td className="p-3">Token de sesión segura para acceso al panel de administración y socios.</td>
                <td className="p-3">Sesión / Persistente</td>
                <td className="p-3">Técnica (Autenticación)</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-[#6DD94B]">sb-*-auth-token</td>
                <td className="p-3">Supabase</td>
                <td className="p-3">Mantiene el estado de autenticación federada con Google.</td>
                <td className="p-3">Persistente</td>
                <td className="p-3">Técnica (Seguridad)</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-[#6DD94B]">bp-webchat-*</td>
                <td className="p-3">Botpress Cloud</td>
                <td className="p-3">Permite mantener el hilo conversacional del chatbot de asistencia interactiva.</td>
                <td className="p-3">Sesión</td>
                <td className="p-3">Funcionalidad</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Cómo gestionar y revocar el consentimiento */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
          <Settings className="h-5 w-5 text-[#6DD94B]" />
          4. ¿Cómo configurar o revocar el consentimiento?
        </h2>
        <p>
          En cualquier momento puede modificar o revocar su consentimiento para el uso de cookies no esenciales pulsando en el siguiente botón:
        </p>

        <div className="rounded-2xl border border-[#6DD94B]/30 bg-[#6DD94B]/5 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-white">Restablecer preferencias de cookies</h4>
            <p className="text-xs text-zinc-400 mt-1">Hará que el banner de cookies vuelva a aparecer para que elijas de nuevo.</p>
          </div>
          <button
            onClick={handleResetCookies}
            className="shrink-0 rounded-xl bg-[#6DD94B] px-4 py-2.5 text-xs font-bold text-black hover:bg-white transition cursor-pointer"
          >
            Reconfigurar cookies
          </button>
        </div>

        <p className="text-xs text-zinc-400 pt-2">
          También puede permitir, bloquear o eliminar las cookies instaladas en su equipo mediante la configuración de las opciones del navegador instalado en su ordenador o dispositivo móvil:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-xs text-zinc-400">
          <li><strong>Google Chrome:</strong> Configuración ➔ Privacidad y seguridad ➔ Cookies y otros datos de sitios.</li>
          <li><strong>Mozilla Firefox:</strong> Opciones ➔ Privacidad & Seguridad ➔ Cookies y datos del sitio.</li>
          <li><strong>Apple Safari:</strong> Preferencias ➔ Privacidad ➔ Bloquear todas las cookies.</li>
          <li><strong>Microsoft Edge:</strong> Configuración ➔ Cookies y permisos del sitio.</li>
        </ul>
      </section>
    </LegalLayout>
  );
}
