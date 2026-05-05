'use client'

import { motion } from 'framer-motion'

const ease = [0.25, 0.46, 0.45, 0.94] as const

export function HeroAnimated() {
  return (
    <div className="relative z-10 flex flex-col items-center text-center w-full">

      {/* Brand label — muted, purely functional */}
      <motion.p
        className="text-kawai-charcoal/30 text-[11px] tracking-[0.55em] uppercase mb-14"
        style={{ fontFamily: 'var(--font-oswald)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease, delay: 0.2 }}
      >
        Shigeru Kawai
      </motion.p>

      {/* "THE" — ghosted, wide tracking, clip reveal */}
      <div className="overflow-hidden pb-1 mb-2">
        <motion.div
          className="text-kawai-black/20 font-light uppercase leading-none"
          style={{
            fontFamily: 'var(--font-oswald)',
            fontSize: 'clamp(3rem, 7vw, 7.5rem)',
            letterSpacing: '0.22em',
          }}
          initial={{ y: '110%' }}
          animate={{ y: 0 }}
          transition={{ duration: 1.1, ease, delay: 0.5 }}
        >
          The
        </motion.div>
      </div>

      {/* "COLLECTION" — extrabold, clip reveal */}
      <div className="overflow-hidden pb-2 mb-14">
        <motion.h1
          className="text-kawai-black font-extrabold uppercase leading-none"
          style={{
            fontFamily: 'var(--font-oswald)',
            fontSize: 'clamp(4.5rem, 11vw, 11rem)',
            letterSpacing: '0.04em',
          }}
          initial={{ y: '105%' }}
          animate={{ y: 0 }}
          transition={{ duration: 1.1, ease, delay: 0.66 }}
        >
          Collection
        </motion.h1>
      </div>

      {/* Gold rule — animated width reveal */}
      <motion.span
        className="block h-px bg-kawai-gold mb-10"
        style={{ opacity: 0.45 }}
        initial={{ width: 0 }}
        animate={{ width: '3.5rem' }}
        transition={{ duration: 0.65, ease, delay: 1.15 }}
      />

      {/* Single-line descriptor */}
      <motion.p
        className="text-kawai-charcoal/45 text-sm"
        style={{ fontFamily: 'var(--font-brand-sans)', letterSpacing: '0.04em' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease, delay: 1.35 }}
      >
        Six handcrafted grand pianos&ensp;·&ensp;Ryuyo Grand Piano Factory, Hamamatsu
      </motion.p>

      {/* Scroll indicator — line only */}
      <motion.span
        className="block w-px bg-kawai-charcoal/15 mt-20"
        initial={{ height: 0 }}
        animate={{ height: '3rem' }}
        transition={{ duration: 0.8, ease, delay: 2 }}
      />

    </div>
  )
}
