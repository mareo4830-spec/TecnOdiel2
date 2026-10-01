import React, { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function TiltCard({ children, className = '', tiltIntensity = 10, glare = true }) {
  const cardRef = useRef(null)

  // Mouse offset from center (-0.5 to 0.5)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring physics for buttery smooth motion
  const mouseXSpring = useSpring(x, { stiffness: 180, damping: 20 })
  const mouseYSpring = useSpring(y, { stiffness: 180, damping: 20 })

  // 3D rotations based on mouse position
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [tiltIntensity, -tiltIntensity])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-tiltIntensity, tiltIntensity])

  // Glare position
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%'])
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%'])

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseXPos = e.clientX - rect.left
    const mouseYPos = e.clientY - rect.top

    // Normalize between -0.5 and 0.5
    x.set(mouseXPos / width - 0.5)
    y.set(mouseYPos / height - 0.5)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`relative perspective-1000 will-change-transform ${className}`}
    >
      {/* Specular glare shine follower */}
      {glare && (
        <motion.div
          style={{
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) =>
                `radial-gradient(circle 280px at ${gx} ${gy}, rgba(255, 255, 255, 0.08), transparent 70%)`
            ),
          }}
          className="pointer-events-none absolute inset-0 z-20 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      )}
      {children}
    </motion.div>
  )
}
