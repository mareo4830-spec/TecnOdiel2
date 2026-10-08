import React from 'react';
import LegalLayout from './LegalLayout';
import { Building2, ShieldCheck, Mail, MapPin, Scale } from 'lucide-react';

export default function AvisoLegal({ onNavigateHome }) {
  return (
    <LegalLayout
      title="Aviso Legal"
      subtitle="Información legal relativa al titular del sitio web tecnodiel.vercel.app y las condiciones generales de uso."
      currentPath="aviso-legal"
      onNavigateHome={onNavigateHome}
    >
      {/* 1. Datos Identificativos */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
          <Building2 className="h-5 w-5 text-[#6DD94B]" />
          1. Datos identificativos del titular (Ley 34/2002 - LSSI-CE)
        </h2>
        <p>
          En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información
          y de Comercio Electrónico (LSSI-CE), se facilitan a continuación los datos identificativos del responsable del sitio web:
        </p>

        <div className="grid gap-3 sm:grid-cols-2 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-sm">
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-zinc-500">Denominación / Razón Social</span>
            <span className="text-white font-medium">[NOMBRE_EMPRESA] (TecnOdiel)</span>
          </div>
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-zinc-500">NIF / CIF</span>
            <span className="text-white font-medium">[NIF/CIF]</span>
          </div>
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-zinc-500">Domicilio Social</span>
            <span className="text-white font-medium">[DIRECCIÓN], Huelva, España</span>
          </div>
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-zinc-500">Correo Electrónico de Contacto</span>
            <span className="text-[#6DD94B] font-medium">[EMAIL_CONTACTO]</span>
          </div>
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-zinc-500">Actividad Principal</span>
            <span className="text-white font-medium">Diseño web, digitalización comercial y desarrollo de software</span>
          </div>
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-zinc-500">Dominio / Sitio Web</span>
            <span className="text-white font-medium">tecnodiel.vercel.app</span>
          </div>
        </div>
      </section>

      {/* 2. Objeto y Ámbito de Aplicación */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
          <Scale className="h-5 w-5 text-[#6DD94B]" />
          2. Objeto y condiciones generales de uso
        </h2>
        <p>
          El presente Aviso Legal regula el acceso, navegación y uso del sitio web <strong className="text-white">TecnOdiel</strong>.
          La condición de usuario se adquiere mediante la mera navegación o utilización de cualquiera de los servicios
          o herramientas habilitadas en la web (incluidos chatbots de asistencia, simuladores de cartas QR o formularios de contacto).
        </p>
        <p>
          El acceso a este sitio web es libre y gratuito. El usuario se compromete a hacer un uso adecuado, ético y lícito
          de los contenidos y servicios de conformidad con la ley vigente, la moral, el orden público y las presentes condiciones.
        </p>
      </section>

      {/* 3. Propiedad Intelectual e Industrial */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
          <ShieldCheck className="h-5 w-5 text-[#6DD94B]" />
          3. Propiedad intelectual e industrial
        </h2>
        <p>
          Todos los elementos que integran este sitio web (incluyendo a título enunciativo pero no limitativo: código fuente,
          diseño gráfico, logotipos, isotipo de TecnOdiel, arquitectura interactiva, textos, iconos, fotografías, demos y software)
          son titularidad exclusiva de <strong className="text-white">[NOMBRE_EMPRESA]</strong> o de terceros que han autorizado
          expresamente su uso.
        </p>
        <p>
          Queda expresamente prohibida la reproducción, distribución, comunicación pública, transformación o cualquier otra
          forma de explotación de los contenidos sin la previa autorización por escrito de TecnOdiel.
        </p>
      </section>

      {/* 4. Exclusión de Responsabilidad */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
          4. Exclusión de garantías y responsabilidad
        </h2>
        <p>
          [NOMBRE_EMPRESA] no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-zinc-300">
          <li>Errores u omisiones en los contenidos informativos o presupuestarios preliminares.</li>
          <li>Falta de disponibilidad puntual del portal por mantenimiento, caídas del proveedor de hosting o causas de fuerza mayor.</li>
          <li>La transmisión de virus o programas maliciosos a pesar de haber adoptado todas las medidas tecnológicas de seguridad necesarias.</li>
        </ul>
      </section>

      {/* 5. Enlaces Externos */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
          5. Enlaces a terceros (Links)
        </h2>
        <p>
          En el caso de que en la web se dispusiesen enlaces o hipervínculos hacia otros sitios de Internet (como WhatsApp Business,
          perfiles en redes sociales, pasarelas de pago o webs cliente de demostración), TecnOdiel no ejercerá ningún tipo de control
          sobre dichos sitios y contenidos, ni asumirá responsabilidad alguna por los mismos.
        </p>
      </section>

      {/* 6. Ley Aplicable y Jurisdicción */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
          6. Legislación aplicable y jurisdicción competente
        </h2>
        <p>
          Para la resolución de todas las controversias o cuestiones relacionadas con el presente sitio web o de las actividades
          en él desarrolladas, será de aplicación la legislación española vigente. Las partes se someten expresamente a los
          Juzgados y Tribunales de la ciudad de <strong className="text-white">Huelva (España)</strong>, con renuncia a cualquier otro fuero que pudiera corresponderles.
        </p>
      </section>
    </LegalLayout>
  );
}
