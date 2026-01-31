'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'

export function RebateCTA() {
  const ctaRef = useRef(null)
  const isInView = useInView(ctaRef, { once: true, amount: 0.3 })

  return (
    <section
      ref={ctaRef}
      className="relative py-32 md:py-40 bg-white"
    >
      <div className="container mx-auto px-8 lg:px-20 max-w-7xl">
        <div className="max-w-3xl mx-auto">
          {/* Clean headline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2
              className="text-4xl md:text-5xl font-light text-kawai-charcoal mb-8 leading-tight"
              style={{
                fontFamily: 'var(--font-crimson), Georgia, serif',
                letterSpacing: '-0.02em'
              }}
            >
              Visit Your
              <br />
              Authorized Dealer
            </h2>

            <p className="text-lg text-kawai-charcoal/60 font-light leading-relaxed max-w-xl mx-auto mb-3">
              Experience these exceptional instruments in person and claim your instant rebate
            </p>

            <p className="text-sm text-kawai-charcoal/40 tracking-wide">
              Limited time offer
            </p>
          </motion.div>

          {/* Clean CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Link
              href="/find-a-dealer"
              className="group inline-flex items-center justify-center gap-3 bg-kawai-red text-white px-10 py-4 hover:bg-kawai-red-700 transition-colors duration-300"
            >
              <span className="text-sm tracking-wide font-medium">Find a Dealer</span>
              <svg
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            <Link
              href="/pianos"
              className="group inline-flex items-center justify-center gap-3 border border-kawai-charcoal/20 text-kawai-charcoal px-10 py-4 hover:border-kawai-charcoal/40 transition-colors duration-300"
            >
              <span className="text-sm tracking-wide font-medium">View All Pianos</span>
            </Link>
          </motion.div>

          {/* Minimal divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-16 h-px bg-kawai-charcoal/10 mx-auto mb-16"
          />

          {/* Clean trust markers */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center"
          >
            {[
              { label: 'Authorized Dealers', detail: 'Official warranty & support' },
              { label: 'Instant Rebate', detail: 'Applied at purchase' },
              { label: 'Since 1927', detail: 'Japanese craftsmanship' }
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <p className="text-sm tracking-[0.15em] uppercase text-kawai-charcoal font-medium">
                  {item.label}
                </p>
                <p className="text-sm text-kawai-charcoal/40 font-light">
                  {item.detail}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
