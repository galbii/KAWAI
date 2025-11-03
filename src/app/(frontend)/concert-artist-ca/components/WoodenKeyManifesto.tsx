'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion, useInView, type Variants } from 'framer-motion'

export default function WoodenKeyManifesto() {
  const shouldReduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })

  const imageVariants: Variants = {
    hidden: {
      opacity: 0,
      x: shouldReduceMotion ? 0 : -100
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 1,
        ease: [0.4, 0, 0.2, 1] as const
      }
    }
  }

  const contentVariants: Variants = {
    hidden: {
      opacity: 0,
      x: shouldReduceMotion ? 0 : 100,
      y: shouldReduceMotion ? 0 : 30
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 1,
        ease: [0.4, 0, 0.2, 1] as const
      }
    }
  }

  const h2Variants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.8,
        ease: [0.4, 0, 0.2, 1] as const
      }
    }
  }

  const primaryCopyVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.8,
        ease: [0.4, 0, 0.2, 1] as const,
        delay: shouldReduceMotion ? 0 : 0.3
      }
    }
  }

  const detailCopyVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.8,
        ease: [0.4, 0, 0.2, 1] as const,
        delay: shouldReduceMotion ? 0 : 0.6
      }
    }
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full bg-black"
    >
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Image Section - 50% */}
        <motion.div
          className="relative h-[50vh] lg:h-screen"
          variants={imageVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <Image
            src="/images/concert-artist/wooden-keys-macro.jpg"
            alt="Close-up macro photography of authentic wooden piano keys"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={90}
          />
        </motion.div>

        {/* Content Section - 50% */}
        <motion.div
          className="flex items-center justify-center px-6 py-16 lg:px-12 lg:py-20"
          variants={contentVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <div className="max-w-2xl space-y-8">
            {/* H2 */}
            <motion.h2
              variants={h2Variants}
              className="text-4xl font-bold leading-tight text-white md:text-6xl"
            >
              100% Wooden Keys
            </motion.h2>

            {/* Primary Copy */}
            <motion.p
              variants={primaryCopyVariants}
              className="text-lg leading-relaxed text-white/80 md:text-xl"
            >
              Every note. Every key. Authentic wooden touch from the first
              lesson through concert performance. This is what separates a
              practice instrument from a forever instrument.
            </motion.p>

            {/* Detail Copy */}
            <motion.p
              variants={detailCopyVariants}
              className="text-sm leading-relaxed text-white/60"
            >
              All Concert Artist models feature complete wooden key actions
              across all 88 keysnot plastic, not partial wood. Complete
              authenticity that translates directly to acoustic piano playing.
            </motion.p>

            {/* Callout Badge */}
            <motion.div
              variants={detailCopyVariants}
              className="inline-block"
            >
              <div className="rounded-full bg-kawai-red/10 px-6 py-3 ring-1 ring-kawai-red/30">
                <p className="text-sm font-semibold text-kawai-red">
                  The only 100% wooden-key series under $4,000
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
