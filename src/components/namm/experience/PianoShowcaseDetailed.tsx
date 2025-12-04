'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

/**
 * Featured Piano Interface for NAMM 2026 Experience Page
 * Full-detail version with all piano information
 */
interface FeaturedPianoDetailed {
  id: string
  name: string
  tagline: string
  description: string
  highlights: string[]
  imageUrl: string
  ctaText: string
  ctaLink: string
  theme: 'crystal' | 'artistic' | 'tech' | 'craftsmanship'
  badge?: string
}

/**
 * Component Props
 */
interface PianoShowcaseDetailedProps {
  title?: string
  subtitle?: string
}

/**
 * CR-45 Crystal Grand - Ultra-luxury transparent piano
 * Crystalline/glass effects with cyan/blue theme
 */
function CrystalGrandShowcase({ piano, index }: { piano: FeaturedPianoDetailed; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.15 }
    )
    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 80 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
      transition={{ duration: 1, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative overflow-hidden rounded-3xl shadow-2xl"
    >
      {/* Crystalline background with enhanced glass effects */}
      <div className="relative min-h-[800px] bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950 p-10 lg:p-20">
        {/* Multi-layer glass reflection effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-cyan-100/5 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-tl from-cyan-400/10 via-blue-400/5 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-cyan-500/5" />

        {/* Enhanced crystalline pattern overlay */}
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 25% 35%, white 1px, transparent 1px),
              radial-gradient(circle at 75% 65%, white 1.5px, transparent 1.5px),
              radial-gradient(circle at 50% 80%, cyan 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px, 70px 70px, 60px 60px'
          }} />
        </div>

        {/* Animated light rays */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent" />
          <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-blue-400 to-transparent" />
        </div>

        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            {piano.badge && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 backdrop-blur-md shadow-lg"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-300 animate-pulse shadow-lg shadow-cyan-400/50" />
                <span className="text-xs font-medium tracking-widest uppercase text-cyan-100 drop-shadow-sm">{piano.badge}</span>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h3 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-5 tracking-tight leading-none drop-shadow-2xl">
                {piano.name}
              </h3>
              <p className="text-2xl lg:text-3xl font-light text-cyan-50 mb-6 drop-shadow-lg">
                {piano.tagline}
              </p>
              <p className="text-lg lg:text-xl text-slate-200 leading-relaxed drop-shadow-md">
                {piano.description}
              </p>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-4"
            >
              {piano.highlights.map((highlight, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.6, delay: 0.5 + idx * 0.1 }}
                  className="flex items-start gap-4 text-slate-100"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400/30 to-blue-500/30 flex items-center justify-center mt-1 flex-shrink-0 border border-cyan-400/40 shadow-lg shadow-cyan-500/20">
                    <div className="w-2 h-2 rounded-full bg-cyan-300 shadow-sm" />
                  </div>
                  <span className="text-base lg:text-lg font-light leading-relaxed drop-shadow-sm">{highlight}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <Link
                href={piano.ctaLink}
                className={cn(
                  "inline-flex items-center gap-3 px-10 py-5 rounded-full",
                  "bg-gradient-to-r from-cyan-500/15 to-blue-500/15",
                  "border-2 border-cyan-400/50 hover:border-cyan-300/70",
                  "text-cyan-50 hover:text-white text-lg font-medium",
                  "backdrop-blur-md transition-all duration-500",
                  "group/btn hover:scale-110 hover:shadow-2xl hover:shadow-cyan-500/30",
                  "transform-gpu"
                )}
              >
                <span>{piano.ctaText}</span>
                <svg className="w-5 h-5 transition-transform group-hover/btn:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </div>

          {/* Prominent Piano Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative h-[500px] lg:h-[700px]"
          >
            <Image
              src={piano.imageUrl}
              alt={piano.name}
              fill
              className="object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-1000 ease-out"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={index === 0}
            />
            {/* Enhanced glow effect */}
            <div className="absolute inset-0 bg-gradient-radial from-cyan-400/30 via-blue-500/15 to-transparent blur-3xl -z-10 group-hover:from-cyan-400/40 transition-all duration-1000" />
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-cyan-500/10 blur-2xl -z-10" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * HERALBONY K-200 - Artistic collaboration piano
 * Vibrant multi-color theme (purple/fuchsia/pink/yellow)
 */
function ArtisticShowcase({ piano, index }: { piano: FeaturedPianoDetailed; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.15 }
    )
    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 80 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
      transition={{ duration: 1, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative overflow-hidden rounded-3xl shadow-2xl"
    >
      {/* Vibrant artistic background with explosive colors */}
      <div className="relative min-h-[800px] bg-gradient-to-br from-purple-950 via-fuchsia-900 to-pink-900 p-10 lg:p-20">
        {/* Multi-color splash effects */}
        <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-radial from-yellow-400/25 via-orange-500/15 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-radial from-cyan-400/20 via-blue-500/10 to-transparent blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-gradient-radial from-pink-500/20 via-transparent to-transparent blur-3xl" />

        {/* Enhanced paint splatter pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 15% 25%, fuchsia 3px, transparent 3px),
              radial-gradient(circle at 85% 75%, yellow 4px, transparent 4px),
              radial-gradient(circle at 60% 45%, pink 2.5px, transparent 2.5px),
              radial-gradient(circle at 30% 70%, cyan 2px, transparent 2px)
            `,
            backgroundSize: '90px 90px, 110px 110px, 70px 70px, 95px 95px'
          }} />
        </div>

        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          {/* Prominent Piano Image - LEFT side (reversed layout) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative h-[500px] lg:h-[700px] order-2 lg:order-1"
          >
            <Image
              src={piano.imageUrl}
              alt={piano.name}
              fill
              className="object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-1000 ease-out"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Vibrant multi-color glow */}
            <div className="absolute inset-0 bg-gradient-radial from-fuchsia-500/35 via-pink-500/20 to-transparent blur-3xl -z-10 group-hover:from-fuchsia-500/45 transition-all duration-1000" />
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-yellow-400/15 blur-2xl -z-10" />
          </motion.div>

          {/* Content - RIGHT side */}
          <div className="space-y-8 order-1 lg:order-2">
            {piano.badge && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-fuchsia-500/25 to-pink-500/25 border border-fuchsia-300/50 backdrop-blur-md shadow-lg"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-fuchsia-300 shadow-lg shadow-fuchsia-400/50" />
                <span className="text-xs font-medium tracking-widest uppercase text-fuchsia-100 drop-shadow-sm">{piano.badge}</span>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h3 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-5 tracking-tight leading-none drop-shadow-2xl">
                {piano.name}
              </h3>
              <p className="text-2xl lg:text-3xl font-light text-fuchsia-50 mb-6 drop-shadow-lg">
                {piano.tagline}
              </p>
              <p className="text-lg lg:text-xl text-purple-50 leading-relaxed drop-shadow-md">
                {piano.description}
              </p>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-4"
            >
              {piano.highlights.map((highlight, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.6, delay: 0.5 + idx * 0.1 }}
                  className="flex items-start gap-4 text-purple-50"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-fuchsia-500/40 to-pink-500/40 flex items-center justify-center mt-1 flex-shrink-0 border border-fuchsia-300/50 shadow-lg shadow-fuchsia-500/25">
                    <div className="w-2 h-2 rounded-full bg-fuchsia-200 shadow-sm" />
                  </div>
                  <span className="text-base lg:text-lg font-light leading-relaxed drop-shadow-sm">{highlight}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <Link
                href={piano.ctaLink}
                className={cn(
                  "inline-flex items-center gap-3 px-10 py-5 rounded-full",
                  "bg-gradient-to-r from-fuchsia-500/15 to-pink-500/15",
                  "border-2 border-fuchsia-300/50 hover:border-fuchsia-200/70",
                  "text-fuchsia-50 hover:text-white text-lg font-medium",
                  "backdrop-blur-md transition-all duration-500",
                  "group/btn hover:scale-110 hover:shadow-2xl hover:shadow-fuchsia-500/30",
                  "transform-gpu"
                )}
              >
                <span>{piano.ctaText}</span>
                <svg className="w-5 h-5 transition-transform group-hover/btn:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Novus Series - Tech hybrid pianos
 * Clean tech aesthetic with emerald/teal
 */
function TechHybridShowcase({ piano, index }: { piano: FeaturedPianoDetailed; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.15 }
    )
    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 80 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
      transition={{ duration: 1, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative overflow-hidden rounded-3xl shadow-2xl"
    >
      {/* Clean tech aesthetic with emerald/teal */}
      <div className="relative min-h-[800px] bg-gradient-to-br from-slate-950 via-zinc-900 to-teal-950 p-10 lg:p-20">
        {/* Technical grid pattern */}
        <div className="absolute inset-0 opacity-[0.05]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(to right, emerald 1px, transparent 1px), linear-gradient(to bottom, emerald 1px, transparent 1px)',
            backgroundSize: '35px 35px'
          }} />
        </div>

        {/* Circuit board inspired accent lines */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent" />
          <div className="absolute top-3/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
          <div className="absolute left-1/4 top-0 h-full w-px bg-gradient-to-b from-transparent via-emerald-400/50 to-transparent" />
          <div className="absolute right-1/4 top-0 h-full w-px bg-gradient-to-b from-transparent via-teal-400/50 to-transparent" />
        </div>

        {/* Enhanced ambient tech glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-radial from-emerald-500/15 via-teal-500/8 to-transparent blur-3xl" />

        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            {piano.badge && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/40 backdrop-blur-md shadow-lg"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-pulse shadow-lg shadow-emerald-400/50" />
                <span className="text-xs font-medium tracking-widest uppercase text-emerald-100 drop-shadow-sm">{piano.badge}</span>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h3 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-5 tracking-tight leading-none drop-shadow-2xl">
                {piano.name}
              </h3>
              <p className="text-2xl lg:text-3xl font-light text-emerald-50 mb-6 drop-shadow-lg">
                {piano.tagline}
              </p>
              <p className="text-lg lg:text-xl text-slate-200 leading-relaxed drop-shadow-md">
                {piano.description}
              </p>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-4"
            >
              {piano.highlights.map((highlight, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.6, delay: 0.5 + idx * 0.1 }}
                  className="flex items-start gap-4 text-slate-100"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-500/30 flex items-center justify-center mt-1 flex-shrink-0 border border-emerald-400/40 shadow-lg shadow-emerald-500/20">
                    <svg className="w-3.5 h-3.5 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-base lg:text-lg font-light leading-relaxed drop-shadow-sm">{highlight}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <Link
                href={piano.ctaLink}
                className={cn(
                  "inline-flex items-center gap-3 px-10 py-5 rounded-full",
                  "bg-gradient-to-r from-emerald-500/15 to-teal-500/15",
                  "border-2 border-emerald-400/50 hover:border-emerald-300/70",
                  "text-emerald-50 hover:text-white text-lg font-medium",
                  "backdrop-blur-md transition-all duration-500",
                  "group/btn hover:scale-110 hover:shadow-2xl hover:shadow-emerald-500/30",
                  "transform-gpu"
                )}
              >
                <span>{piano.ctaText}</span>
                <svg className="w-5 h-5 transition-transform group-hover/btn:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </div>

          {/* Prominent Piano Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative h-[500px] lg:h-[700px]"
          >
            <Image
              src={piano.imageUrl}
              alt={piano.name}
              fill
              className="object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-1000 ease-out"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Tech glow effect */}
            <div className="absolute inset-0 bg-gradient-radial from-emerald-500/25 via-teal-500/12 to-transparent blur-3xl -z-10 group-hover:from-emerald-500/35 transition-all duration-1000" />
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-emerald-400/10 blur-2xl -z-10" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Master Series - Premium craftsmanship teaser
 * Warm amber/gold with premium feel
 */
function CraftsmanshipShowcase({ piano, index }: { piano: FeaturedPianoDetailed; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.15 }
    )
    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 80 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
      transition={{ duration: 1, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative overflow-hidden rounded-3xl shadow-2xl"
    >
      {/* Elegant craftsmanship background with warm amber/gold */}
      <div className="relative min-h-[800px] bg-gradient-to-br from-amber-950 via-yellow-950 to-orange-950 p-10 lg:p-20">
        {/* Enhanced wood grain texture effect */}
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              repeating-linear-gradient(90deg, transparent, transparent 2px, white 2px, white 3px),
              repeating-linear-gradient(90deg, transparent 10px, white 10px, white 11px)
            `,
            backgroundSize: '55px 100%, 120px 100%'
          }} />
        </div>

        {/* Luxurious shimmer effect */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
          <div className="absolute bottom-0 right-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
        </div>

        {/* Warm premium glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-gradient-radial from-amber-600/20 via-yellow-700/10 to-transparent blur-3xl" />

        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          {/* Prominent Piano Image - LEFT side (reversed layout) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative h-[500px] lg:h-[700px] order-2 lg:order-1"
          >
            <Image
              src={piano.imageUrl}
              alt={piano.name}
              fill
              className="object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-1000 ease-out"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Warm premium glow effect */}
            <div className="absolute inset-0 bg-gradient-radial from-amber-500/30 via-yellow-600/15 to-transparent blur-3xl -z-10 group-hover:from-amber-500/40 transition-all duration-1000" />
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-amber-600/15 blur-2xl -z-10" />
          </motion.div>

          {/* Content - RIGHT side */}
          <div className="space-y-8 order-1 lg:order-2">
            {piano.badge && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-600/25 to-yellow-600/25 border border-amber-400/40 backdrop-blur-md shadow-lg"
              >
                <svg className="w-3.5 h-3.5 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs font-medium tracking-widest uppercase text-amber-100 drop-shadow-sm">{piano.badge}</span>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h3 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-5 tracking-tight leading-none drop-shadow-2xl">
                {piano.name}
              </h3>
              <p className="text-2xl lg:text-3xl font-light text-amber-50 mb-6 drop-shadow-lg">
                {piano.tagline}
              </p>
              <p className="text-lg lg:text-xl text-stone-200 leading-relaxed drop-shadow-md">
                {piano.description}
              </p>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-4"
            >
              {piano.highlights.map((highlight, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.6, delay: 0.5 + idx * 0.1 }}
                  className="flex items-start gap-4 text-stone-100"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-600/30 to-yellow-600/30 flex items-center justify-center mt-1 flex-shrink-0 border border-amber-400/40 shadow-lg shadow-amber-500/20">
                    <div className="w-2 h-2 rounded-full bg-amber-300 shadow-sm" />
                  </div>
                  <span className="text-base lg:text-lg font-light leading-relaxed drop-shadow-sm">{highlight}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <Link
                href={piano.ctaLink}
                className={cn(
                  "inline-flex items-center gap-3 px-10 py-5 rounded-full",
                  "bg-gradient-to-r from-amber-600/15 to-yellow-600/15",
                  "border-2 border-amber-400/50 hover:border-amber-300/70",
                  "text-amber-50 hover:text-white text-lg font-medium",
                  "backdrop-blur-md transition-all duration-500",
                  "group/btn hover:scale-110 hover:shadow-2xl hover:shadow-amber-500/30",
                  "transform-gpu"
                )}
              >
                <span>{piano.ctaText}</span>
                <svg className="w-5 h-5 transition-transform group-hover/btn:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * NAMM 2026 Featured Pianos - Complete Data
 * All details included for the experience page
 */
const FEATURED_PIANOS_DETAILED: FeaturedPianoDetailed[] = [
  {
    id: 'cr45',
    name: 'CR-45 Crystal Grand',
    tagline: 'The World\'s Most Exclusive Piano',
    description: 'Only 3 units crafted per year worldwide. This ultra-rare transparent acrylic grand piano reveals the intricate inner workings of acoustic piano artistry—a stunning fusion of engineering precision and sculptural beauty.',
    highlights: [
      'Transparent acrylic construction with visible mechanics',
      'Handcrafted in Shigeru Kawai Ryuyo factory',
      'Concert-length key buttons for maximum energy transfer',
      '185cm (6\'2") grand with premium spruce soundboard',
      'Individually numbered and certified'
    ],
    imageUrl: '/images/placeholders/piano-grand.jpg',
    ctaText: 'Explore Crystal Grand',
    ctaLink: '/products/cr-45',
    theme: 'crystal',
    badge: 'Ultra Exclusive • 3 Per Year'
  },
  {
    id: 'heralbony',
    name: 'HERALBONY × Kawai',
    tagline: 'Where Music Radiates Color',
    description: 'A bold artistic collaboration featuring vibrant artwork by artists with intellectual disabilities. This K-200 upright transforms into a public art installation that challenges perceptions and celebrates inclusive creativity through sound and vision.',
    highlights: [
      'Vibrant original artwork by artist Chihiro Yagyu',
      'Social mission supporting artists with disabilities',
      'Professional K-200 upright base (114cm)',
      'Interactive public art piano experience',
      'Limited edition with certificate of authenticity'
    ],
    imageUrl: '/images/placeholders/piano-upright.jpg',
    ctaText: 'Discover The Story',
    ctaLink: '/products/heralbony-k200',
    theme: 'artistic',
    badge: 'Artistic Collaboration'
  },
  {
    id: 'novus',
    name: 'Novus NV6 & NV12',
    tagline: 'Feel Acoustic. Play Silent.',
    description: 'Revolutionary hybrid pianos featuring real acoustic piano actions (not simulations) with digital versatility. The NV12 introduces groundbreaking PentaDrive technology—transducers energizing a full-size soundboard instead of traditional speakers.',
    highlights: [
      'Real Millennium III acoustic actions (upright & grand)',
      'PentaDrive™ soundboard technology (NV12)',
      'SK-EX Concert Grand multi-channel sampling',
      'Silent practice with authentic acoustic touch',
      'Bluetooth audio streaming and recording'
    ],
    imageUrl: '/images/placeholders/piano-hybrid.jpg',
    ctaText: 'Experience Novus Technology',
    ctaLink: '/products/novus-series',
    theme: 'tech',
    badge: 'Revolutionary Hybrid'
  },
  {
    id: 'master-series',
    name: 'Something Extraordinary',
    tagline: 'A New Chapter in Piano Craftsmanship',
    description: 'We\'ve been working on something special. A new expression of artisanal excellence that redefines what\'s possible. Details will be revealed at NAMM 2026—this is your first glimpse.',
    highlights: [
      'Handcrafted by master artisans',
      'Unprecedented attention to detail',
      'Innovation meets tradition',
      'Exclusive NAMM 2026 reveal',
      'Limited global availability'
    ],
    imageUrl: '/images/placeholders/piano-upright.jpg',
    ctaText: 'Be Among the First to Know',
    ctaLink: '#contact',
    theme: 'craftsmanship',
    badge: 'World Premiere • NAMM 2026'
  }
]

/**
 * Piano Showcase Detailed - Main Component
 * Full-width hero-style cards with MORE vibrant styling for NAMM 2026 experience page
 */
export default function PianoShowcaseDetailed({
  title = 'Pianos That Redefine Possibility',
  subtitle = 'From crystal-clear transparency to revolutionary hybrid technology, experience the most innovative pianos ever created. Each one pushes the boundaries of what a piano can be.'
}: PianoShowcaseDetailedProps) {
  const [isTitleVisible, setIsTitleVisible] = useState(false)
  const titleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsTitleVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (titleRef.current) {
      observer.observe(titleRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section className="py-32 lg:py-40 bg-black relative overflow-hidden">
      {/* Enhanced background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-black to-zinc-950" />
      <div className="absolute inset-0 bg-gradient-radial from-purple-950/20 via-transparent to-transparent" />

      <div className="max-w-[1600px] mx-auto px-6 lg:px-16 relative z-10">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-28">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-white mb-8 drop-shadow-2xl"
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-xl md:text-2xl lg:text-3xl font-light leading-relaxed text-zinc-300 max-w-5xl mx-auto drop-shadow-lg"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Featured Pianos - Full-width hero cards */}
        <div className="space-y-20">
          {FEATURED_PIANOS_DETAILED.map((piano, index) => {
            switch (piano.theme) {
              case 'crystal':
                return <CrystalGrandShowcase key={piano.id} piano={piano} index={index} />
              case 'artistic':
                return <ArtisticShowcase key={piano.id} piano={piano} index={index} />
              case 'tech':
                return <TechHybridShowcase key={piano.id} piano={piano} index={index} />
              case 'craftsmanship':
                return <CraftsmanshipShowcase key={piano.id} piano={piano} index={index} />
              default:
                return null
            }
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-center mt-32"
        >
          <p className="text-2xl lg:text-3xl font-light text-zinc-400 mb-8">
            Ready to experience these extraordinary instruments in person?
          </p>
          <Link
            href="#contact"
            className={cn(
              "inline-flex items-center gap-4 px-12 py-6 rounded-full",
              "bg-gradient-to-r from-[#C41E3A]/80 to-[#E31937]/80",
              "border-2 border-[#C41E3A] hover:border-white",
              "text-white text-xl font-semibold",
              "backdrop-blur-sm transition-all duration-500",
              "hover:scale-110 hover:shadow-2xl hover:shadow-[#C41E3A]/40",
              "transform-gpu"
            )}
          >
            <span>Visit Us at NAMM 2026</span>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>

        {/* SEO Keywords */}
        <div className="sr-only">
          NAMM 2026, CR-45 Crystal Grand, transparent piano, acrylic piano, HERALBONY collaboration,
          artistic piano, Novus NV6, Novus NV12, hybrid piano technology, PentaDrive soundboard,
          Master Series, handcrafted piano, Shigeru Kawai, acoustic piano action, exclusive piano,
          limited edition piano, concert grand, premium piano showcase, innovative piano design,
          modern piano technology, luxury pianos, NAMM Show 2026, Anaheim Convention Center
        </div>
      </div>
    </section>
  )
}
