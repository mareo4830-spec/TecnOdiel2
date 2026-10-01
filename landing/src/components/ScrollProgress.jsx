import React from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[2px] pointer-events-none bg-transparent">
      {/* Precision Industrial Hairline Progress */}
      <motion.div
        style={{ scaleX }}
        className="h-full w-full origin-left bg-white/80"
      />
    </div>
  )
}
