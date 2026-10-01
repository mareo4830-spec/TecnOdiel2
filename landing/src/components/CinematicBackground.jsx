import React, { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CinematicBackground() {
  const [isPointerDevice, setIsPointerDevice] = useState(false)

  // Mouse coords for subtle spotlight
  const mouseX = useMotionValue(-1000)
  const mouseY = useMotionValue(-1000)

  // Spring physics for smooth follower
  const smoothX = useSpring(mouseX, { stiffness: 60, damping: 25 })
  const smoothY = useSpring(mouseY, { stiffness: 60, damping: 25 })

  useEffect(() => {
    // Only enable mouse glow on fine pointer devices (desktop/laptop)
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
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {/* Dynamic Cursor Spotlight (Desktop only, ultra smooth) */}
      {isPointerDevice && (
        <motion.div
          style={{
            x: smoothX,
            y: smoothY,
            translateX: '-50%',
            translateY: '-50%',
          }}
          className="pointer-events-none fixed top-0 left-0 w-[550px] h-[550px] rounded-full bg-radial-spotlight opacity-40 blur-[90px] will-change-transform"
        />
      )}

      {/* Floating Aurora Orb 1: Emerald (Brand Accent) */}
      <motion.div
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -60, 30, 0],
          scale: [1, 1.15, 0.95, 1],
          opacity: [0.12, 0.22, 0.14, 0.12],
        }}
        transition={{
          repeat: Infinity,
          duration: 18,
          ease: 'easeInOut',
        }}
        className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-emerald-500/20 blur-[130px] will-change-transform"
      />

      {/* Floating Aurora Orb 2: Deep Indigo / Violet */}
      <motion.div
        animate={{
          x: [0, -50, 40, 0],
          y: [0, 50, -40, 0],
          scale: [1, 0.9, 1.2, 1],
          opacity: [0.1, 0.2, 0.12, 0.1],
        }}
        transition={{
          repeat: Infinity,
          duration: 22,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute top-2/3 -right-28 w-[600px] h-[600px] rounded-full bg-indigo-600/15 blur-[150px] will-change-transform"
      />

      {/* Floating Aurora Orb 3: Cyan / Metallic */}
      <motion.div
        animate={{
          x: [0, 35, -25, 0],
          y: [0, -40, 35, 0],
          scale: [1, 1.1, 0.9, 1],
          opacity: [0.08, 0.16, 0.1, 0.08],
        }}
        transition={{
          repeat: Infinity,
          duration: 25,
          ease: 'easeInOut',
          delay: 4,
        }}
        className="absolute top-1/2 left-1/3 w-[450px] h-[450px] rounded-full bg-cyan-400/15 blur-[140px] will-change-transform"
      />

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 bg-radial-vignette opacity-80" />
    </div>
  )
}
