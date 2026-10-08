import React, { useEffect } from 'react';
import { ArrowLeft, Shield, FileText, Cookie, ChevronRight } from 'lucide-react';
import LogoMark from '../home/LogoMark';

export default function LegalLayout({ title, subtitle, lastUpdated = 'Octubre 2026', currentPath, children, onNavigateHome }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navLinks = [
    { label: 'Aviso Legal', href: '#/aviso-legal', icon: FileText, active: currentPath === 'aviso-legal' },
    { label: 'Política de Privacidad', href: '#/politica-privacidad', icon: Shield, active: currentPath === 'politica-privacidad' },
    { label: 'Política de Cookies', href: '#/politica-cookies', icon: Cookie, active: currentPath === 'politica-cookies' },
  ];

  return (
    <div className="min-h-screen bg-[#121212] text-zinc-300 font-['Montserrat',Inter,system-ui,sans-serif] selection:bg-[#6DD94B] selection:text-black">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#121212]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-4">
            <a href="#/" onClick={(e) => { if (onNavigateHome) { e.preventDefault(); onNavigateHome(); } }} className="flex items-center gap-2.5 group">
              <LogoMark className="h-9 w-9 transition-transform group-hover:scale-105" />
              <span className="leading-tight">
                <span className="block text-base font-extrabold tracking-wide text-white">TECNODIEL</span>
                <span className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#6DD94B]">Legal & RGPD</span>
              </span>
            </a>
          </div>

          <a
            href="#/"
            onClick={(e) => {
              if (onNavigateHome) {
                e.preventDefault();
                onNavigateHome();
              }
            }}
            className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-bold text-white transition hover:border-[#6DD94B] hover:text-[#6DD94B] hover:bg-[#6DD94B]/5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Volver al inicio</span>
          </a>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8 md:py-16">
        {/* Navigation Tabs between legal pages */}
        <div className="mb-10 flex flex-wrap gap-2 border-b border-white/10 pb-4">
          {navLinks.map((tab) => {
            const Icon = tab.icon;
            return (
              <a
                key={tab.label}
                href={tab.href}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                  tab.active
                    ? 'bg-[#6DD94B] text-black shadow-lg shadow-[#6DD94B]/20 font-bold'
                    : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </a>
            );
          })}
        </div>

        {/* Header Title */}
        <div className="mb-12 border-b border-white/10 pb-8">
          <span className="inline-block rounded-full bg-[#6DD94B]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#6DD94B] ring-1 ring-[#6DD94B]/30 mb-4">
            Marco Normativo RGPD & LSSI-CE
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">{title}</h1>
          {subtitle && <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl">{subtitle}</p>}
          <p className="mt-4 text-xs font-medium text-zinc-500">Última actualización: {lastUpdated}</p>
        </div>

        {/* Content Body */}
        <div className="prose prose-invert max-w-none space-y-8 text-sm sm:text-base leading-relaxed text-zinc-300">
          {children}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white">¿Tienes alguna duda sobre tus datos o nuestros términos?</h3>
            <p className="text-xs text-zinc-400 mt-1">Escríbenos a nuestro canal de soporte legal y te responderemos en menos de 24 horas.</p>
          </div>
          <a
            href="mailto:[EMAIL_CONTACTO]"
            className="shrink-0 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-[#6DD94B] hover:text-black transition"
          >
            Contactar DPO / Privacidad
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black py-8 text-xs text-zinc-500">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 sm:px-8">
          <p>© {new Date().getFullYear()} TecnOdiel. Todos los derechos reservados.</p>
          <div className="flex flex-wrap gap-4">
            <a href="#/aviso-legal" className="hover:text-white transition">Aviso Legal</a>
            <a href="#/politica-privacidad" className="hover:text-white transition">Privacidad</a>
            <a href="#/politica-cookies" className="hover:text-white transition">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
