'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { aboutImages } from './images'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
}
const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
}

export default function AboutHero() {
  const reduce = useReducedMotion()

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-kawai-black text-white">
      {/* Background image with a slow settle-in zoom. */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={reduce ? false : { scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: 'easeOut' }}
      >
        <Image
          src={aboutImages.hero}
          alt="A pianist performing on a Kawai piano in warm light"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>
      {/* Left-weighted wash keeps the headline crisp; bottom vignette grounds the frame. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/60 to-black/25" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

      <div className="container mx-auto px-6">
        <motion.div
          className="max-w-3xl"
          variants={container}
          initial={reduce ? 'show' : 'hidden'}
          animate="show"
        >
          <motion.p
            variants={item}
            className="mb-5 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.3em] text-kawai-gold"
          >
            <span className="h-px w-10 bg-kawai-gold" />
            Since 1927
          </motion.p>
          <motion.h1
            variants={item}
            className="mb-6 font-[family-name:var(--font-brand-serif)] text-[clamp(3rem,9vw,7.5rem)] font-medium leading-[0.95] tracking-[-0.02em]"
          >
            Crafting
            <br />
            Inspiration
          </motion.h1>
          <motion.p
            variants={item}
            className="mb-9 max-w-xl text-lg leading-relaxed text-white/75 md:text-xl"
          >
            Three generations. Nearly a century of innovation. One uncompromising standard.
          </motion.p>
          <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="#story">Our Story</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/70 bg-transparent text-white hover:bg-white hover:text-kawai-black"
              asChild
            >
              <Link href="/pianos">Explore Pianos</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/50"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <motion.span
          aria-hidden
          className="block h-10 w-px origin-top bg-gradient-to-b from-white/60 to-transparent"
          {...(reduce
            ? {}
            : {
                animate: { scaleY: [0.4, 1, 0.4], opacity: [0.4, 1, 0.4] },
                transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' as const },
              })}
        />
      </motion.div>
    </section>
  )
}
