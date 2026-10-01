import React, { useState, useEffect } from 'react'
import { ArrowUpRight, MessageCircle } from 'lucide-react'

export default function Navbar({ onOpenAudit }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
      scrolled 
        ? 'bg-[#08080a]/95 backdrop-blur-md border-b border-zinc-800' 
        : 'bg-[#08080a]/80 backdrop-blur-sm border-b border-zinc-800/60'
    }`}>
      <div className="mx-auto max-w-6xl px-3.5 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand Logo & Machined Badge */}
        <a
          href="#"
          className="group flex items-center gap-2.5 sm:gap-3 text-white focus:outline-none"
          aria-label="TecnOdiel - Portada"
        >
          <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded bg-zinc-900 border border-zinc-700 text-zinc-100 font-mono text-xs font-bold tracking-wider group-hover:border-zinc-500 transition-colors shadow-inner">
            <span>TO</span>
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#08080a]" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold tracking-tight text-white uppercase font-sans">
                TecnOdiel
              </span>
              <span className="hidden xs:inline-block font-mono text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400">
                HUELVA
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono tracking-wider">
              Ingeniería Web & Software
            </span>
          </div>
        </a>

        {/* Center Industrial Telemetry (Hidden on small mobile) */}
        <div className="hidden lg:flex items-center gap-2.5 font-mono text-[11px] text-zinc-400 px-3 py-1 rounded bg-zinc-900/60 border border-zinc-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-zinc-300 font-medium">SISTEMA OPERATIVO</span>
          <span className="text-zinc-600">//</span>
          <span className="text-zinc-400">EDICIÓN 2026</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick WhatsApp on Desktop */}
          <a
            href="https://wa.me/34600000000?text=Hola%20TecnOdiel,%20quiero%20información%20sobre%20una%20web%20para%20mi%20negocio"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-zinc-800 hover:border-zinc-600 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white font-mono text-xs transition-colors"
            title="Chat directo por WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp</span>
          </a>

          {/* Primary Industrial Button: Desde 99€ */}
          <button
            onClick={onOpenAudit}
            className="btn-industrial min-h-[40px] sm:min-h-[42px] inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded bg-white hover:bg-zinc-200 text-black font-mono text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            id="nav-cta-audit"
            aria-label="Configurar web desde 99 euros"
          >
            <span>Desde 99€</span>
            <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </header>
  )
}
