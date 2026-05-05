'use client'

import { motion } from 'framer-motion'

const ease = [0.25, 0.46, 0.45, 0.94] as const

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2, delayChildren: 0.5 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease } },
}

export function HeroAnimated() {
  return (
    <motion.div
      className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      <motion.p
        className="text-kawai-gold text-[10px] tracking-[0.45em] uppercase mb-10"
        style={{ fontFamily: 'var(--font-brand-sans)' }}
        variants={fadeUp}
      >
        Shigeru Kawai
      </motion.p>

      <motion.span
        className="block h-px w-10 bg-kawai-gold mx-auto mb-10"
        style={{ opacity: 0.4 }}
        variants={fadeUp}
      />

      <motion.h1
        className="text-kawai-black font-light italic leading-[0.9] mb-10"
        style={{
          fontFamily: 'var(--font-brand-luxury)',
          fontSize: 'clamp(3.5rem, 10vw, 8rem)',
        }}
        variants={fadeUp}
      >
        The Collection
      </motion.h1>

      <motion.p
        className="text-kawai-charcoal/60 text-sm leading-relaxed max-w-lg mx-auto"
        style={{ fontFamily: 'var(--font-brand-sans)' }}
        variants={fadeUp}
      >
        Six grand pianos. Each handcrafted at the Ryuyo Grand Piano Factory in Hamamatsu, Japan
        — taking three to five times longer to complete than a standard instrument. One
        commitment to excellence, expressed across an entire range.
      </motion.p>

      <motion.div
        className="mt-16 flex flex-col items-center gap-2"
        style={{ opacity: 0.3 }}
        variants={fadeUp}
      >
        <span
          className="text-kawai-charcoal/50 text-[9px] tracking-[0.3em] uppercase"
          style={{ fontFamily: 'var(--font-brand-sans)' }}
        >
          Explore
        </span>
        <motion.span
          className="block w-px bg-kawai-charcoal/25"
          initial={{ height: 0 }}
          animate={{ height: '2rem' }}
          transition={{ duration: 0.8, ease, delay: 1.8 }}
        />
      </motion.div>
    </motion.div>
  )
}
