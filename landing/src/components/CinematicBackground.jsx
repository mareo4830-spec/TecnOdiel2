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

    let throttleTimer = null
    const handleMouseMove = (e) => {
      if (throttleTimer) return
      throttleTimer = requestAnimationFrame(() => {
        mouseX.set(e.clientX)
        mouseY.set(e.clientY)
        throttleTimer = null
      })
    }

    if (mediaQuery.matches) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true })
    }

    return () => {
      if (throttleTimer) cancelAnimationFrame(throttleTimer)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [mouseX, mouseY])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {/* Dynamic Cursor Spotlight (Desktop only, GPU accelerated) */}
      {isPointerDevice && (
        <motion.div
          style={{
            x: smoothX,
            y: smoothY,
            translateX: '-50%',
            translateY: '-50%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.02) 45%, transparent 70%)',
          }}
          className="pointer-events-none fixed top-0 left-0 w-[550px] h-[550px] rounded-full transform-gpu will-change-transform"
        />
      )}

      {/* Floating Aurora Orb 1: Emerald (Brand Accent) */}
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.1, 0.95, 1],
          opacity: [0.35, 0.5, 0.38, 0.35],
        }}
        transition={{
          repeat: Infinity,
          duration: 18,
          ease: 'easeInOut',
        }}
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(16, 185, 129, 0.05) 50%, transparent 75%)',
        }}
        className="absolute top-1/4 -left-32 w-[550px] h-[550px] rounded-full transform-gpu will-change-transform"
      />

      {/* Floating Aurora Orb 2: Deep Indigo / Violet */}
      <motion.div
        animate={{
          x: [0, -35, 25, 0],
          y: [0, 35, -25, 0],
          scale: [1, 0.95, 1.1, 1],
          opacity: [0.25, 0.4, 0.28, 0.25],
        }}
        transition={{
          repeat: Infinity,
          duration: 22,
          ease: 'easeInOut',
          delay: 2,
        }}
        style={{
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.2) 0%, rgba(79, 70, 229, 0.04) 50%, transparent 75%)',
        }}
        className="absolute top-2/3 -right-28 w-[600px] h-[600px] rounded-full transform-gpu will-change-transform"
      />

      {/* Floating Aurora Orb 3: Cyan / Metallic */}
      <motion.div
        animate={{
          x: [0, 25, -20, 0],
          y: [0, -30, 25, 0],
          scale: [1, 1.08, 0.92, 1],
          opacity: [0.2, 0.35, 0.22, 0.2],
        }}
        transition={{
          repeat: Infinity,
          duration: 25,
          ease: 'easeInOut',
          delay: 4,
        }}
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.18) 0%, rgba(6, 182, 212, 0.03) 50%, transparent 75%)',
        }}
        className="absolute top-1/2 left-1/3 w-[500px] h-[500px] rounded-full transform-gpu will-change-transform"
      />

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 bg-radial-vignette opacity-80" />
    </div>
  )
}
