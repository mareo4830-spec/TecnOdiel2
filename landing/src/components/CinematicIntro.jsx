import React, { useEffect, useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'

export default function CinematicIntro({ onComplete, subtitle = "Webs que Facturan • Soluciones Reales" }) {
  const [isExiting, setIsExiting] = useState(false)
  const isExitingRef = useRef(false)
  const touchStartY = useRef(null)
  const touchStartX = useRef(null)

  const handleFinish = useCallback(() => {
    if (!isExitingRef.current) {
      isExitingRef.current = true
      setIsExiting(true)
      setTimeout(() => {
        onComplete()
      }, 650)
    }
  }, [onComplete])

  useEffect(() => {
    // 1. Wheel scroll down on desktop
    const handleWheel = (e) => {
      if (e.deltaY > 5 || Math.abs(e.deltaY) > 25) {
        handleFinish()
      }
    }

    // 2. Touch gesture detection (swipe down / scroll down)
    const handleTouchStart = (e) => {
      if (e.touches && e.touches.length > 0) {
        touchStartY.current = e.touches[0].clientY
        touchStartX.current = e.touches[0].clientX
      }
    }

    const handleTouchMove = (e) => {
      if (touchStartY.current === null || !e.touches || e.touches.length === 0) return
      const currentY = e.touches[0].clientY
      const currentX = e.touches[0].clientX
      const deltaY = currentY - touchStartY.current
      const deltaX = currentX - touchStartX.current

      // If user slides vertically by more than 20px, dismiss
      if (Math.abs(deltaY) > 20 && Math.abs(deltaY) > Math.abs(deltaX)) {
        handleFinish()
      }
    }

    const handleTouchEnd = () => {
      touchStartY.current = null
      touchStartX.current = null
    }

    // 3. Page scroll listener fallback
    const handleScroll = () => {
      if (window.scrollY > 10) {
        handleFinish()
      }
    }

    // 4. Down keys
    const handleKeyDown = (e) => {
      if (['ArrowDown', 'PageDown', 'Space', 'Enter'].includes(e.key)) {
        handleFinish()
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('keydown', handleKeyDown)

    // Safety fallback: 30s so screen never locks if left completely untouched
    const fallbackTimer = setTimeout(() => {
      handleFinish()
    }, 30000)

    return () => {
      clearTimeout(fallbackTimer)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleFinish])

  // Split letter animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const letterVariants = {
    hidden: { opacity: 0, y: 40, rotateX: 60, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 14,
        stiffness: 150,
      },
    },
  }

  return (
    <motion.div
      onClick={handleFinish}
      initial={{ opacity: 0 }}
      animate={{
        opacity: isExiting ? 0 : 1,
        y: isExiting ? -90 : 0,
        scale: isExiting ? 1.04 : 1,
        filter: isExiting ? 'blur(10px)' : 'blur(0px)',
      }}
      exit={{ opacity: 0, y: -120, filter: 'blur(14px)' }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black select-none cursor-pointer overflow-hidden touch-none"
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 bg-grid-subtle opacity-35" />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: 'easeInOut',
        }}
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-emerald-500/20 via-white/10 to-cyan-500/20 blur-[130px] rounded-full"
      />

      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-6xl">
        {/* Top Radar Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 backdrop-blur-xl"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-zinc-300">
            TECNODIEL // HUELVA
          </span>
        </motion.div>

        {/* Massive Giant Title */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-6xl xs:text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] font-black tracking-tighter text-white uppercase leading-none select-none perspective-1000"
        >
          <motion.span variants={letterVariants} className="inline-block text-white">
            Tecn
          </motion.span>
          <motion.span variants={letterVariants} className="inline-block text-metallic-pure text-glow">
            Odiel
          </motion.span>
        </motion.h1>

        {/* Subtitle with laser sweep */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-4 sm:mt-6 text-xs sm:text-base md:text-lg font-mono tracking-widest uppercase text-zinc-400"
        >
          {subtitle}
        </motion.p>

        {/* Visual indicator to slide down */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10 sm:mt-14 inline-flex flex-col items-center gap-2 group cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleFinish();
          }}
        >
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/15 bg-white/[0.05] backdrop-blur-xl group-hover:border-emerald-500/50 group-hover:bg-white/[0.1] transition-all duration-300 shadow-lg shadow-black/40">
            <ArrowDown className="h-4 w-4 text-emerald-400 animate-bounce" />
            <span className="text-xs sm:text-sm font-medium tracking-wide text-zinc-200">
              Desliza para abajo
            </span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
            o toca para entrar
          </span>
        </motion.div>
      </div>
    </motion.div>
  )
}
