import React from 'react';
import LegalLayout from './LegalLayout';
import { UserCheck, Database, Lock, Eye, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function PoliticaPrivacidad({ onNavigateHome }) {
  return (
    <LegalLayout
      title="Política de Privacidad"
      subtitle="Tratamiento y protección de datos personales con arreglo al Reglamento General de Protección de Datos (RGPD UE 2016/679) y la Ley Orgánica 3/2018 (LOPDGDD)."
      currentPath="politica-privacidad"
      onNavigateHome={onNavigateHome}
    >
      {/* 1. Responsable del Tratamiento */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
          <UserCheck className="h-5 w-5 text-[#6DD94B]" />
          1. Responsable del tratamiento de sus datos
        </h2>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-sm space-y-2">
          <p><strong className="text-white">Identidad:</strong> [NOMBRE_EMPRESA] (marca comercial: TecnOdiel)</p>
          <p><strong className="text-white">NIF / CIF:</strong> [NIF/CIF]</p>
          <p><strong className="text-white">Dirección postal:</strong> [DIRECCIÓN], Huelva, España</p>
          <p><strong className="text-white">Correo electrónico DPO / Privacidad:</strong> <span className="text-[#6DD94B] font-mono">[EMAIL_CONTACTO]</span></p>
        </div>
      </section>

      {/* 2. Datos recopilados */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
          <Database className="h-5 w-5 text-[#6DD94B]" />
          2. Datos personales que recopilamos
        </h2>
        <p>Recopilamos únicamente los datos necesarios y pertinentes para atender sus consultas y prestar nuestros servicios:</p>
        <ul className="list-disc pl-6 space-y-2 text-zinc-300">
          <li>
            <strong className="text-white">Formularios de solicitud y presupuesto:</strong> Nombre, nombre comercial de su negocio, teléfono (estrictamente verificado a 9 dígitos), dirección de correo electrónico y sector de actividad.
          </li>
          <li>
            <strong className="text-white">Chatbots y canales conversacionales (Botpress / WhatsApp):</strong> Mensajes y datos aportados voluntariamente por el usuario para resolver dudas o solicitar presupuestos.
          </li>
          <li>
            <strong className="text-white">Autenticación de clientes y equipo (Google OAuth):</strong> Nombre de perfil, correo electrónico e identificador seguro al acceder a la Oficina Virtual o al Portal de Clientes.
          </li>
          <li>
            <strong className="text-white">Datos de navegación:</strong> Dirección IP anonimizada, metadatos técnicos y cookies necesarias para garantizar la seguridad y el funcionamiento de la web.
          </li>
        </ul>
      </section>

      {/* 3. Finalidades del Tratamiento */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
          <CheckCircle2 className="h-5 w-5 text-[#6DD94B]" />
          3. Finalidad del tratamiento de datos
        </h2>
        <p>Los datos recabados son tratados con las siguientes finalidades específicas:</p>
        <ol className="list-decimal pl-6 space-y-2 text-zinc-300">
          <li>Gestionar y contestar a las solicitudes de presupuesto, auditorías gratuitas y propuestas comerciales solicitadas.</li>
          <li>Desarrollar y mantener la relación comercial y contractual (diseño web, despliegue de cartas QR, soporte técnico).</li>
          <li>Facilitar el acceso al Portal de Clientes y a la Oficina Virtual para la gestión de proyectos.</li>
          <li>Prevenir el fraude, ataques informáticos y garantizar la seguridad del sitio web.</li>
          <li>Cumplir con las obligaciones fiscales, contables y mercantiles aplicables.</li>
        </ol>
      </section>

      {/* 4. Base Jurídica */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
          <Lock className="h-5 w-5 text-[#6DD94B]" />
          4. Base jurídica y legitimación
        </h2>
        <p>
          El tratamiento de sus datos se realiza bajo las siguientes bases jurídicas:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-zinc-300">
          <li>
            <strong className="text-white">Consentimiento del interesado (art. 6.1.a RGPD):</strong> Otorgado de forma libre, informada y voluntaria al marcar la casilla de verificación en los formularios de contacto y al aceptar las cookies analíticas.
          </li>
          <li>
            <strong className="text-white">Ejecución de un contrato o medidas precontractuales (art. 6.1.b RGPD):</strong> Para la elaboración de presupuestos solicitados y la prestación del servicio contratado.
          </li>
          <li>
            <strong className="text-white">Cumplimiento de obligaciones legales (art. 6.1.c RGPD):</strong> Facturación, fiscalidad y normativa mercantil.
          </li>
        </ul>
      </section>

      {/* 5. Plazo de Conservación */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
          5. Plazo de conservación de los datos
        </h2>
        <p>
          Los datos personales proporcionados se conservarán mientras se mantenga la relación comercial o durante el tiempo estrictamente necesario para cumplir con la finalidad para la que fueron recabados.
        </p>
        <p>
          En el caso de solicitudes de información que no deriven en contratación, los datos serán eliminados transcurridos <strong className="text-white">12 meses</strong> desde la última comunicación, salvo que el usuario solicite su supresión previa.
        </p>
      </section>

      {/* 6. Destinatarios y Encargados */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
          6. Comunicación a terceros y transferencias internacionales
        </h2>
        <p>
          <strong className="text-[#6DD94B]">TecnOdiel no vende, alquila ni cede sus datos a terceros con fines comerciales.</strong>
        </p>
        <p>
          Para poder prestar el servicio técnico, colaboramos con proveedores de infraestructura tecnológica debidamente auditados que actúan como Encargados del Tratamiento bajo estrictos acuerdos DPA (Data Processing Agreements) con garantías de privacidad:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-zinc-300 text-sm">
          <li><strong>Supabase Inc.:</strong> Base de datos relacional y autenticación en servidores de la Unión Europea.</li>
          <li><strong>Vercel Inc.:</strong> Alojamiento frontend, CDN y distribución global bajo el marco EU-US Data Privacy Framework.</li>
          <li><strong>Google LLC:</strong> Autenticación federada (OAuth 2.0) únicamente cuando el usuario elige iniciar sesión con Google.</li>
        </ul>
      </section>

      {/* 7. Derechos del Usuario */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
          <Eye className="h-5 w-5 text-[#6DD94B]" />
          7. Sus derechos en materia de protección de datos
        </h2>
        <p>Como titular de los datos, la legislación le reconoce los siguientes derechos:</p>
        <div className="grid gap-3 sm:grid-cols-2 text-sm">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <h4 className="font-bold text-white">Acceso y Rectificación</h4>
            <p className="text-xs text-zinc-400 mt-1">Saber qué datos conservamos y corregir los inexactos.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <h4 className="font-bold text-white">Supresión (Derecho al Olvido)</h4>
            <p className="text-xs text-zinc-400 mt-1">Solicitar el borrado íntegro de su información.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <h4 className="font-bold text-white">Limitación y Oposición</h4>
            <p className="text-xs text-zinc-400 mt-1">Restringir temporalmente u oponerse a un tratamiento concreto.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <h4 className="font-bold text-white">Portabilidad</h4>
            <p className="text-xs text-zinc-400 mt-1">Recibir sus datos en formato electrónico estructurado.</p>
          </div>
        </div>
        <p>
          Para ejercer cualquiera de estos derechos, basta con enviar una comunicación por correo electrónico a{' '}
          <strong className="text-[#6DD94B]">[EMAIL_CONTACTO]</strong> indicando en el asunto "Ejercicio Derechos RGPD" y adjuntando acreditación de su identidad.
        </p>
        <p className="text-xs text-zinc-400 flex items-center gap-1.5 pt-2">
          <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
          Asimismo, le informamos de su derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD, www.aepd.es) si considera vulnerados sus derechos.
        </p>
      </section>
    </LegalLayout>
  );
}
