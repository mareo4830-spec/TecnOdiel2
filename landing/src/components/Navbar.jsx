import React, { useState, useEffect } from 'react'
import { ArrowUpRight } from 'lucide-react'

export default function Navbar({ onOpenAudit }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className={`mx-auto max-w-7xl px-3.5 sm:px-6 md:px-12 transition-all duration-300 ${scrolled ? 'py-1.5 sm:py-3' : 'py-2.5 sm:py-5'
        }`}>
        <nav
          className={`flex items-center justify-between px-3.5 sm:px-6 py-2 sm:py-2.5 transition-all duration-500 rounded-full ${scrolled
              ? 'bg-zinc-950/85 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.8)]'
              : 'bg-zinc-950/40 backdrop-blur-md sm:bg-transparent border border-white/5 sm:border-transparent'
            }`}
          aria-label="Navegación principal"
        >
          {/* Brand Logo */}
          <a
            href="#"
            className="group flex items-center gap-2.5 sm:gap-3 text-white transition-opacity hover:opacity-90"
            aria-label="TecnOdiel - Inicio"
          >
            <div className="relative flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-zinc-900 border border-white/15 transition-transform duration-300 group-hover:scale-105 group-hover:border-white/40">
              <span className="font-mono text-[11px] sm:text-xs font-bold text-white tracking-widest">TO</span>
              <div className="absolute -inset-0.5 rounded-lg bg-white/10 blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                TecnOdiel
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" title="Disponibles para nuevos proyectos" />
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-widest uppercase text-zinc-400 font-mono -mt-0.5 sm:-mt-1">
                Problemas Reales // Negocios Locales
              </span>
            </div>
          </a>


          {/* Action CTA: Desde 99€ (Visible on Desktop and Mobile) */}
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAudit}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-4 sm:px-5 py-2 text-xs font-bold text-black transition-all duration-300 hover:bg-zinc-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95 cursor-pointer"
              id="nav-cta-audit"
              aria-label="Tu web desde 99€"
            >
              <span>Desde 99€</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}
