import React from 'react'
import { motion } from 'framer-motion'

export default function SectionDivider({ title, subtitle }) {
  return (
    <div className="relative w-full py-8 sm:py-12 overflow-hidden flex items-center justify-center">
      {/* Background Line */}
      <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Sweeping Laser Beam */}
      <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none">
        <div className="w-1/3 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-laser opacity-70 blur-[1px]" />
      </div>

      {/* Center Holographic Badge (if title provided) */}
      {title && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-zinc-950/90 px-4 py-1 backdrop-blur-xl shadow-[0_0_20px_rgba(0,0,0,0.8)]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-zinc-300">
            {title}
          </span>
          {subtitle && (
            <span className="hidden sm:inline font-mono text-[10px] text-zinc-300">
              // {subtitle}
            </span>
          )}
        </motion.div>
      )}
    </div>
  )
}
