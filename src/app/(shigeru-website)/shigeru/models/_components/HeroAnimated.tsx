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
      className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      <motion.p
        className="text-kawai-gold text-[13px] tracking-[0.45em] uppercase mb-12"
        style={{ fontFamily: 'var(--font-oswald)' }}
        variants={fadeUp}
      >
        Shigeru Kawai
      </motion.p>

      <motion.span
        className="block h-px w-12 bg-kawai-gold mx-auto mb-12"
        style={{ opacity: 0.4 }}
        variants={fadeUp}
      />

      <motion.h1
        className="text-kawai-black font-extrabold leading-[0.85] mb-14 uppercase"
        style={{
          fontFamily: 'var(--font-oswald)',
          fontSize: 'clamp(5rem, 14vw, 13rem)',
          letterSpacing: '0.04em',
        }}
        variants={fadeUp}
      >
        The Collection
      </motion.h1>

      <motion.p
        className="text-kawai-charcoal/60 text-base leading-relaxed max-w-xl mx-auto"
        style={{ fontFamily: 'var(--font-brand-sans)' }}
        variants={fadeUp}
      >
        Six grand pianos. Each handcrafted at the Ryuyo Grand Piano Factory in Hamamatsu, Japan
        — taking three to five times longer to complete than a standard instrument. One
        commitment to excellence, expressed across an entire range.
      </motion.p>

      <motion.div
        className="mt-20 flex flex-col items-center gap-2"
        style={{ opacity: 0.3 }}
        variants={fadeUp}
      >
        <span
          className="text-kawai-charcoal/50 text-[10px] tracking-[0.3em] uppercase"
          style={{ fontFamily: 'var(--font-brand-sans)' }}
        >
          Explore
        </span>
        <motion.span
          className="block w-px bg-kawai-charcoal/25"
          initial={{ height: 0 }}
          animate={{ height: '2.5rem' }}
          transition={{ duration: 0.8, ease, delay: 1.8 }}
        />
      </motion.div>
    </motion.div>
  )
}
