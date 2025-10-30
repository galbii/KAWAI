'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'

export default function StoriesOfTouch() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="bg-[#FAF8F5] py-16 px-4 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px bg-black/20 w-12"></div>
            <p className="text-[11px] md:text-xs font-medium uppercase tracking-[0.25em] text-black/60">
              Stories of Touch
            </p>
            <div className="h-px bg-black/20 w-12"></div>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-black leading-tight">
            A Professional's Perspective
          </h2>
        </motion.div>

        {/* Featured Story - Vardan Ovsepian */}
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start max-w-7xl mx-auto">
          {/* Video Side - Takes up 3 columns */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-2 lg:order-1 lg:col-span-3"
          >
            {/* Video Container with 16:9 aspect ratio */}
            <div className="relative w-full overflow-hidden rounded-sm shadow-xl" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/kqsk_8ypvsU"
                title="Exploring the CA901 | Kawai Pianos"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

            {/* Video Caption */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 text-sm text-black/60 italic text-center"
            >
              Vardan Ovsepian explores the CA901
            </motion.p>
          </motion.div>

          {/* Story Side - Takes up 2 columns */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="order-1 lg:order-2 lg:col-span-2 space-y-6"
          >
            {/* Artist Name & Title */}
            <div className="space-y-2">
              <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl text-black font-light">
                Vardan Ovsepian
              </h3>
              <p className="text-sm uppercase tracking-[0.2em] text-black/60 font-medium">
                Jazz Pianist & Composer
              </p>
              <div className="h-px bg-black/15 w-16"></div>
            </div>

            {/* Quote */}
            <blockquote className="relative pl-6 md:pl-8 border-l-2 border-black/15">
              <p className="font-serif text-lg md:text-xl lg:text-2xl text-black/85 leading-relaxed italic">
                "The CA901 has become my daily companion. The Grand Feel III action responds like a concert grand, and the TwinDrive soundboard captures the resonance I need for jazz improvisation. It's rare to find a digital piano that inspires rather than compromises."
              </p>
            </blockquote>

            {/* Supporting Text */}
            <div className="space-y-4 text-base md:text-lg text-black/70 leading-relaxed">
              <p>
                As a professional jazz pianist, Vardan demands an instrument that keeps pace with his creative process—one that translates the subtlety of touch into nuanced expression.
              </p>
              <p className="font-light">
                The CA901's wooden keys and authentic hammer action provide the tactile feedback essential for hours of daily practice, while the SK-EX concert grand sampling delivers the tonal complexity his music requires.
              </p>
            </div>

            {/* Closing Statement */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="pt-6 border-t border-black/10"
            >
              <p className="font-serif text-base md:text-lg text-black/80 italic">
                "This is the instrument I wish I'd had from the beginning—where practice feels like performance, and performance feels like home."
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
