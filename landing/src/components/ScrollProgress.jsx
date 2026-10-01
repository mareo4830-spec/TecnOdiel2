import React from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001
  })

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[2.5px] pointer-events-none bg-transparent">
      {/* Dynamic Laser Progress Line */}
      <motion.div
        style={{ scaleX }}
        className="h-full w-full origin-left bg-gradient-to-r from-emerald-500 via-cyan-400 to-white shadow-[0_0_12px_rgba(52,211,153,0.8)]"
      />
      {/* Glowing tip indicator */}
      <motion.div
        style={{ scaleX }}
        className="absolute top-0 right-0 h-full w-12 origin-left bg-gradient-to-r from-transparent to-white/90 blur-[1px]"
      />
    </div>
  )
}
