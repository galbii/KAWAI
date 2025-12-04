'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

/**
 * Featured piano interface for NAMM 2026
 */
interface FeaturedPiano {
  id: string
  name: string
  tagline: string
  imageUrl: string
  ctaText: string
  ctaLink: string
  theme: 'crystal' | 'artistic' | 'tech' | 'craftsmanship'
}

/**
 * Featured Products Section props
 */
interface FeaturedProductsSectionProps {
  title?: string
  subtitle?: string
}

/**
 * CR-45 Crystal Grand - Ultra-luxury transparent piano
 */
function CrystalGrandCard({ piano, index }: { piano: FeaturedPiano; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.2 }
    )
    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className="group relative overflow-hidden rounded-3xl"
    >
      {/* Crystalline background with glass effects */}
      <div className="relative min-h-[600px] lg:min-h-[700px] bg-gradient-to-br from-zinc-900 via-slate-900 to-zinc-950 p-8 lg:p-16">
        {/* Glass reflection effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/[0.05] via-transparent to-transparent" />

        {/* Crystalline pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 30% 40%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1.5px, transparent 1.5px)',
            backgroundSize: '60px 60px, 80px 80px'
          }} />
        </div>

        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div>
              <h3 className="text-4xl lg:text-5xl xl:text-6xl font-light text-white mb-4 tracking-tight leading-tight">
                {piano.name}
              </h3>
              <p className="text-xl lg:text-2xl font-light text-cyan-100/80">
                {piano.tagline}
              </p>
            </div>

            <Link
              href={piano.ctaLink}
              className={cn(
                "inline-flex items-center gap-3 px-8 py-4 rounded-full",
                "bg-gradient-to-r from-cyan-500/10 to-blue-500/10",
                "border border-cyan-500/30 hover:border-cyan-400/50",
                "text-cyan-100 hover:text-white",
                "backdrop-blur-sm transition-all duration-300",
                "group/btn hover:scale-105"
              )}
            >
              <span className="font-light">{piano.ctaText}</span>
              <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Prominent transparent piano image */}
          <div className="relative h-[400px] lg:h-[600px]">
            <Image
              src={piano.imageUrl}
              alt={piano.name}
              fill
              className="object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Glow effect behind piano */}
            <div className="absolute inset-0 bg-gradient-radial from-cyan-500/20 via-transparent to-transparent blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * HERALBONY K-200 - Artistic collaboration piano
 */
function ArtisticPianoCard({ piano, index }: { piano: FeaturedPiano; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.2 }
    )
    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className="group relative overflow-hidden rounded-3xl"
    >
      {/* Vibrant artistic background */}
      <div className="relative min-h-[600px] lg:min-h-[700px] bg-gradient-to-br from-purple-900 via-fuchsia-900 to-pink-900 p-8 lg:p-16">
        {/* Color splash effects */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-yellow-500/20 via-orange-500/10 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-cyan-500/20 via-blue-500/10 to-transparent blur-3xl" />

        {/* Paint splatter pattern */}
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 30%, white 2px, transparent 2px), radial-gradient(circle at 80% 70%, white 3px, transparent 3px), radial-gradient(circle at 60% 50%, white 1.5px, transparent 1.5px)',
            backgroundSize: '100px 100px, 120px 120px, 80px 80px'
          }} />
        </div>

        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          {/* Prominent transparent piano image - LEFT side */}
          <div className="relative h-[400px] lg:h-[600px] order-2 lg:order-1">
            <Image
              src={piano.imageUrl}
              alt={piano.name}
              fill
              className="object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Colorful glow effect */}
            <div className="absolute inset-0 bg-gradient-radial from-fuchsia-500/25 via-transparent to-transparent blur-3xl -z-10" />
          </div>

          {/* Content - RIGHT side */}
          <div className="space-y-8 order-1 lg:order-2">
            <div>
              <h3 className="text-4xl lg:text-5xl xl:text-6xl font-light text-white mb-4 tracking-tight leading-tight">
                {piano.name}
              </h3>
              <p className="text-xl lg:text-2xl font-light text-fuchsia-100/90">
                {piano.tagline}
              </p>
            </div>

            <Link
              href={piano.ctaLink}
              className={cn(
                "inline-flex items-center gap-3 px-8 py-4 rounded-full",
                "bg-gradient-to-r from-fuchsia-500/10 to-pink-500/10",
                "border border-fuchsia-400/30 hover:border-fuchsia-300/50",
                "text-fuchsia-100 hover:text-white",
                "backdrop-blur-sm transition-all duration-300",
                "group/btn hover:scale-105"
              )}
            >
              <span className="font-light">{piano.ctaText}</span>
              <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Novus Series - Modern tech hybrid pianos
 */
function TechHybridCard({ piano, index }: { piano: FeaturedPiano; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.2 }
    )
    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className="group relative overflow-hidden rounded-3xl"
    >
      {/* Clean tech aesthetic background */}
      <div className="relative min-h-[600px] lg:min-h-[700px] bg-gradient-to-br from-slate-900 via-zinc-900 to-stone-900 p-8 lg:p-16">
        {/* Technical grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Blueprint-style accent lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
        </div>

        {/* Ambient tech glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-emerald-500/10 via-transparent to-transparent blur-3xl" />

        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div>
              <h3 className="text-4xl lg:text-5xl xl:text-6xl font-light text-white mb-4 tracking-tight leading-tight">
                {piano.name}
              </h3>
              <p className="text-xl lg:text-2xl font-light text-emerald-100/80">
                {piano.tagline}
              </p>
            </div>

            <Link
              href={piano.ctaLink}
              className={cn(
                "inline-flex items-center gap-3 px-8 py-4 rounded-full",
                "bg-gradient-to-r from-emerald-500/10 to-teal-500/10",
                "border border-emerald-500/30 hover:border-emerald-400/50",
                "text-emerald-100 hover:text-white",
                "backdrop-blur-sm transition-all duration-300",
                "group/btn hover:scale-105"
              )}
            >
              <span className="font-light">{piano.ctaText}</span>
              <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Prominent transparent piano image */}
          <div className="relative h-[400px] lg:h-[600px]">
            <Image
              src={piano.imageUrl}
              alt={piano.name}
              fill
              className="object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Tech glow effect */}
            <div className="absolute inset-0 bg-gradient-radial from-emerald-500/15 via-transparent to-transparent blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Master Series - Premium craftsmanship teaser
 */
function CraftsmanshipCard({ piano, index }: { piano: FeaturedPiano; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.2 }
    )
    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className="group relative overflow-hidden rounded-3xl"
    >
      {/* Elegant craftsmanship background */}
      <div className="relative min-h-[600px] lg:min-h-[700px] bg-gradient-to-br from-amber-950 via-stone-900 to-zinc-950 p-8 lg:p-16">
        {/* Wood grain texture effect */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, white 2px, white 3px)',
            backgroundSize: '60px 100%'
          }} />
        </div>

        {/* Warm ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-radial from-amber-600/15 via-transparent to-transparent blur-3xl" />

        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          {/* Prominent transparent piano image - LEFT side */}
          <div className="relative h-[400px] lg:h-[600px] order-2 lg:order-1">
            <Image
              src={piano.imageUrl}
              alt={piano.name}
              fill
              className="object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Warm glow effect */}
            <div className="absolute inset-0 bg-gradient-radial from-amber-500/20 via-transparent to-transparent blur-3xl -z-10" />
          </div>

          {/* Content - RIGHT side */}
          <div className="space-y-8 order-1 lg:order-2">
            <div>
              <h3 className="text-4xl lg:text-5xl xl:text-6xl font-light text-white mb-4 tracking-tight leading-tight">
                {piano.name}
              </h3>
              <p className="text-xl lg:text-2xl font-light text-amber-100/80">
                {piano.tagline}
              </p>
            </div>

            <Link
              href={piano.ctaLink}
              className={cn(
                "inline-flex items-center gap-3 px-8 py-4 rounded-full",
                "bg-gradient-to-r from-amber-600/10 to-orange-600/10",
                "border border-amber-600/30 hover:border-amber-500/50",
                "text-amber-100 hover:text-white",
                "backdrop-blur-sm transition-all duration-300",
                "group/btn hover:scale-105"
              )}
            >
              <span className="font-light">{piano.ctaText}</span>
              <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * NAMM 2026 Featured Pianos Data
 */
const FEATURED_PIANOS: FeaturedPiano[] = [
  {
    id: 'cr45',
    name: 'CR-45 Crystal Grand',
    tagline: 'The World\'s Most Exclusive Piano',
    imageUrl: '/images/placeholders/piano-grand.jpg',
    ctaText: 'Explore Crystal Grand',
    ctaLink: '/namm-2026/experience',
    theme: 'crystal'
  },
  {
    id: 'heralbony',
    name: 'HERALBONY × Kawai',
    tagline: 'Where Music Radiates Color',
    imageUrl: '/images/placeholders/piano-upright.jpg',
    ctaText: 'Discover The Story',
    ctaLink: '/namm-2026/experience',
    theme: 'artistic'
  },
  {
    id: 'novus',
    name: 'Novus NV6 & NV12',
    tagline: 'Feel Acoustic. Play Silent.',
    imageUrl: '/images/placeholders/piano-hybrid.jpg',
    ctaText: 'Experience Novus Technology',
    ctaLink: '/namm-2026/experience',
    theme: 'tech'
  },
  {
    id: 'master-series',
    name: 'Something Extraordinary',
    tagline: 'A New Chapter in Piano Craftsmanship',
    imageUrl: '/images/placeholders/piano-upright.jpg',
    ctaText: 'Be Among the First to Know',
    ctaLink: '/namm-2026/experience',
    theme: 'craftsmanship'
  }
]

/**
 * Featured Products Section Component
 * Premium showcase for NAMM 2026 featured pianos with unique treatments
 */
export default function FeaturedProductsSection({
  title = 'Featured at NAMM 2026',
  subtitle = 'Discover our most innovative and exclusive pianos. From transparent crystal grands to revolutionary hybrids, experience the future of piano craftsmanship.'
}: FeaturedProductsSectionProps) {
  const [isTitleVisible, setIsTitleVisible] = useState(false)
  const titleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsTitleVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (titleRef.current) {
      observer.observe(titleRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section className="py-24 lg:py-32 bg-black relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-black to-zinc-950" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-white mb-6"
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl font-light leading-relaxed text-zinc-400 max-w-4xl mx-auto"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Featured Pianos - Each with unique treatment */}
        <div className="space-y-12">
          {FEATURED_PIANOS.map((piano, index) => {
            switch (piano.theme) {
              case 'crystal':
                return <CrystalGrandCard key={piano.id} piano={piano} index={index} />
              case 'artistic':
                return <ArtisticPianoCard key={piano.id} piano={piano} index={index} />
              case 'tech':
                return <TechHybridCard key={piano.id} piano={piano} index={index} />
              case 'craftsmanship':
                return <CraftsmanshipCard key={piano.id} piano={piano} index={index} />
              default:
                return null
            }
          })}
        </div>

        {/* SEO Keywords */}
        <div className="sr-only">
          NAMM 2026, CR-45 Crystal Grand, transparent piano, HERALBONY collaboration,
          Novus NV6, Novus NV12, hybrid piano technology, Master Series uprights,
          Shigeru Kawai, PentaDrive soundboard, acoustic piano action, exclusive piano,
          handcrafted piano, artistic piano, concert grand, premium piano showcase
        </div>
      </div>
    </section>
  )
}
