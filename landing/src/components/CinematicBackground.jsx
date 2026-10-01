import React, { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CinematicBackground() {
  const [isPointerDevice, setIsPointerDevice] = useState(false)

  // Cursor coords for subtle monochromatic hardware highlight
  const mouseX = useMotionValue(-1000)
  const mouseY = useMotionValue(-1000)

  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 30 })
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 30 })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)')
    setIsPointerDevice(mediaQuery.matches)

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    if (mediaQuery.matches) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true })
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [mouseX, mouseY])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none bg-[#070709]">
      {/* Precision Industrial Architectural Grid */}
      <div 
        className="absolute inset-0 bg-grid-industrial opacity-60"
        style={{
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, #000 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, #000 60%, transparent 100%)'
        }}
      />

      {/* Subtle Hairline Axis Guides */}
      <div className="absolute inset-x-0 top-16 h-px bg-white/[0.04]" />
      <div className="absolute inset-y-0 left-8 md:left-16 w-px bg-white/[0.03] hidden sm:block" />
      <div className="absolute inset-y-0 right-8 md:right-16 w-px bg-white/[0.03] hidden sm:block" />

      {/* Subtle Monochromatic Flashlight (Desktop only) */}
      {isPointerDevice && (
        <motion.div
          style={{
            x: smoothX,
            y: smoothY,
            translateX: '-50%',
            translateY: '-50%',
          }}
          className="pointer-events-none fixed top-0 left-0 w-[420px] h-[420px] rounded-full bg-white/[0.025] blur-[80px] will-change-transform"
        />
      )}

      {/* Top Industrial Telemetry Coordinates */}
      <div className="absolute top-2 left-3 sm:left-6 hidden md:flex items-center gap-3 font-mono text-[9px] tracking-widest text-zinc-600 uppercase">
        <span>LOC: HUELVA [37°15'N 6°56'W]</span>
        <span>•</span>
        <span>HOST: CLOUDFLARE EDGE</span>
      </div>

      <div className="absolute top-2 right-3 sm:right-6 hidden md:flex items-center gap-3 font-mono text-[9px] tracking-widest text-zinc-600 uppercase">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
        <span>SYS_STATUS: OPERATIONAL</span>
      </div>

      {/* Corner Precision Crosshairs */}
      <span className="absolute top-20 left-4 sm:left-8 font-mono text-[10px] text-zinc-700 hidden sm:block select-none">+</span>
      <span className="absolute top-20 right-4 sm:right-8 font-mono text-[10px] text-zinc-700 hidden sm:block select-none">+</span>
      <span className="absolute bottom-16 left-4 sm:left-8 font-mono text-[10px] text-zinc-700 hidden sm:block select-none">+</span>
      <span className="absolute bottom-16 right-4 sm:right-8 font-mono text-[10px] text-zinc-700 hidden sm:block select-none">+</span>

      {/* Deep Matte Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/90 pointer-events-none" />
    </div>
  )
}
