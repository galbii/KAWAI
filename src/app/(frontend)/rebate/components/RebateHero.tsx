'use client'

import { motion } from 'framer-motion'

export function RebateHero() {
  return (
    <section
      className="relative bg-white overflow-hidden"
      style={{
        paddingTop: '120px',
        paddingBottom: '120px'
      }}
    >
      <div className="container mx-auto px-8 lg:px-20 max-w-7xl">
        {/* Minimalist badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16 text-center"
        >
          <span className="text-xs tracking-[0.25em] uppercase text-kawai-charcoal/50 font-medium">
            Limited Time Offer
          </span>
        </motion.div>

        {/* Clean headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mb-20"
        >
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-kawai-charcoal mb-8 leading-[0.95]"
            style={{
              fontFamily: 'var(--font-crimson), Georgia, serif',
              letterSpacing: '-0.03em'
            }}
          >
            Instant Rebate
            <br />
            <span className="font-normal text-kawai-red">Event</span>
          </h1>

          <p className="text-xl md:text-2xl text-kawai-charcoal/60 font-light max-w-2xl mx-auto leading-relaxed">
            Save up to <span className="text-kawai-charcoal font-normal">$2,500</span> on select professional pianos
          </p>
        </motion.div>

        {/* Simple divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-16 h-px bg-kawai-red mx-auto"
        />
      </div>
    </section>
  )
}
