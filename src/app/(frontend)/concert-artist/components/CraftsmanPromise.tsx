'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function CraftsmanPromise() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section
      ref={ref}
      className="relative bg-[#FAF8F5] py-24 md:py-32 lg:py-40 overflow-hidden"
    >
      {/* Decorative year marker - background element */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.03 } : { opacity: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
        aria-hidden="true"
      >
        <span className="font-serif text-[20vw] md:text-[16vw] lg:text-[12vw] text-black leading-none">
          1927
        </span>
      </motion.div>

      <div className="container mx-auto px-6 md:px-8 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="mb-8 md:mb-10"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px bg-black/20 w-12"></div>
              <span className="text-[11px] md:text-xs tracking-[0.25em] uppercase text-black/60 font-sans">
                The Founding Legend
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-black leading-[1.1] mb-12 md:mb-16"
            style={{ fontFamily: "'Crimson Text', 'Playfair Display', serif" }}
          >
            The Craftsman's Promise
          </motion.h2>

          {/* Main quote - special treatment */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12 md:mb-16 relative pl-8 md:pl-12 border-l-2 border-black/15"
          >
            <div className="space-y-6">
              <p className="text-lg md:text-xl lg:text-2xl text-black/80 leading-relaxed font-light">
                In <span className="font-serif text-2xl md:text-3xl" style={{ fontFamily: "'Crimson Text', serif" }}>1927</span>, Koichi Kawai, a master piano craftsman, established a guiding philosophy:
              </p>
              <blockquote
                className="text-xl md:text-2xl lg:text-3xl text-black leading-relaxed italic font-serif"
                style={{ fontFamily: "'Crimson Text', 'Playfair Display', serif" }}
              >
                "As long as you are building pianos, you should strive to build the finest ones in the world."
              </blockquote>
            </div>
          </motion.div>

          {/* Body content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-8 md:space-y-10 text-base md:text-lg text-black/75 leading-relaxed max-w-3xl"
          >
            <p className="text-lg md:text-xl">
              97 years later, that promise lives in every CA series piano.
            </p>

            <p className="text-xl md:text-2xl text-black font-light leading-relaxed">
              When you place your fingers on CA401 wooden keys—the entry model at $3,199—you're touching the same craftsmanship philosophy that goes into our $200,000 Shigeru Kawai SK-EX concert grands.
            </p>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8 pt-8 md:pt-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-3"
              >
                <div className="h-px bg-black/20 w-8"></div>
                <p className="text-sm md:text-base text-black/80 leading-relaxed">
                  The same master builders.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="space-y-3"
              >
                <div className="h-px bg-black/20 w-8"></div>
                <p className="text-sm md:text-base text-black/80 leading-relaxed">
                  The same Japanese <span className="italic">takumi</span> (匠) artisan tradition.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="space-y-3"
              >
                <div className="h-px bg-black/20 w-8"></div>
                <p className="text-sm md:text-base text-black/80 leading-relaxed">
                  The same obsessive attention to how wood responds to human touch.
                </p>
              </motion.div>
            </div>

            {/* Closing statement */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="pt-12 md:pt-16 border-t border-black/10"
            >
              <p
                className="text-2xl md:text-3xl lg:text-4xl text-black leading-tight font-serif text-center"
                style={{ fontFamily: "'Crimson Text', 'Playfair Display', serif" }}
              >
                This is not compromise. <br className="hidden md:inline" />
                This is democratic mastery.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
