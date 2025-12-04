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
  description: string
  highlights: string[]
  imageUrl: string
  ctaText: string
  ctaLink: string
  theme: 'crystal' | 'artistic' | 'tech' | 'craftsmanship'
  badge?: string
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
          <div className="space-y-6">
            {piano.badge && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-600/20 to-yellow-600/20 border border-amber-600/30 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs font-light tracking-wider uppercase text-amber-200">{piano.badge}</span>
              </div>
            )}

            <div>
              <h3 className="text-4xl lg:text-5xl xl:text-6xl font-light text-white mb-4 tracking-tight leading-tight">
                {piano.name}
              </h3>
              <p className="text-xl lg:text-2xl font-light text-cyan-100/80 mb-6">
                {piano.tagline}
              </p>
              <p className="text-base lg:text-lg text-zinc-300 leading-relaxed">
                {piano.description}
              </p>
            </div>

            <ul className="space-y-3">
              {piano.highlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-3 text-zinc-200">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  </div>
                  <span className="text-sm lg:text-base font-light">{highlight}</span>
                </li>
              ))}
            </ul>

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
          <div className="space-y-6 order-1 lg:order-2">
            {piano.badge && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-fuchsia-500/20 to-pink-500/20 border border-fuchsia-400/30 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-fuchsia-400" />
                <span className="text-xs font-light tracking-wider uppercase text-fuchsia-200">{piano.badge}</span>
              </div>
            )}

            <div>
              <h3 className="text-4xl lg:text-5xl xl:text-6xl font-light text-white mb-4 tracking-tight leading-tight">
                {piano.name}
              </h3>
              <p className="text-xl lg:text-2xl font-light text-fuchsia-100/90 mb-6">
                {piano.tagline}
              </p>
              <p className="text-base lg:text-lg text-purple-100 leading-relaxed">
                {piano.description}
              </p>
            </div>

            <ul className="space-y-3">
              {piano.highlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-3 text-purple-50">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-fuchsia-500/30 to-pink-500/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-300" />
                  </div>
                  <span className="text-sm lg:text-base font-light">{highlight}</span>
                </li>
              ))}
            </ul>

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
          <div className="space-y-6">
            {piano.badge && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-light tracking-wider uppercase text-emerald-200">{piano.badge}</span>
              </div>
            )}

            <div>
              <h3 className="text-4xl lg:text-5xl xl:text-6xl font-light text-white mb-4 tracking-tight leading-tight">
                {piano.name}
              </h3>
              <p className="text-xl lg:text-2xl font-light text-emerald-100/80 mb-6">
                {piano.tagline}
              </p>
              <p className="text-base lg:text-lg text-zinc-300 leading-relaxed">
                {piano.description}
              </p>
            </div>

            <ul className="space-y-3">
              {piano.highlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-3 text-zinc-200">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mt-0.5 flex-shrink-0 border border-emerald-500/30">
                    <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm lg:text-base font-light">{highlight}</span>
                </li>
              ))}
            </ul>

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
          <div className="space-y-6 order-1 lg:order-2">
            {piano.badge && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-600/30 backdrop-blur-sm">
                <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs font-light tracking-wider uppercase text-amber-200">{piano.badge}</span>
              </div>
            )}

            <div>
              <h3 className="text-4xl lg:text-5xl xl:text-6xl font-light text-white mb-4 tracking-tight leading-tight">
                {piano.name}
              </h3>
              <p className="text-xl lg:text-2xl font-light text-amber-100/80 mb-6">
                {piano.tagline}
              </p>
              <p className="text-base lg:text-lg text-stone-300 leading-relaxed">
                {piano.description}
              </p>
            </div>

            <ul className="space-y-3">
              {piano.highlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-3 text-stone-200">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-600/20 to-orange-600/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  </div>
                  <span className="text-sm lg:text-base font-light">{highlight}</span>
                </li>
              ))}
            </ul>

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
    description: 'Only 3 units crafted per year worldwide. This ultra-rare transparent acrylic grand piano reveals the intricate inner workings of acoustic piano artistry—a stunning fusion of engineering precision and sculptural beauty.',
    highlights: [
      'Transparent acrylic construction with visible mechanics',
      'Handcrafted in Shigeru Kawai Ryuyo factory',
      'Concert-length key buttons for maximum energy transfer',
      '185cm (6\'2") grand with premium spruce soundboard'
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
      'Interactive public art piano experience'
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
      'Silent practice with authentic acoustic touch'
    ],
    imageUrl: '/images/placeholders/piano-hybrid.jpg',
    ctaText: 'Experience Novus Technology',
    ctaLink: '/products/novus-series',
    theme: 'tech',
    badge: 'Revolutionary Hybrid'
  },
  {
    id: 'master-series',
    name: 'Master Series Uprights',
    tagline: 'Handcrafted Excellence',
    description: 'The upright equivalent of Shigeru Kawai concert grands. Handcrafted by master artisans with extended key lengths, premium hardwood rims, and meticulous voicing. Near-grand quality in an elegant upright cabinet.',
    highlights: [
      'Handcrafted by Shigeru Kawai master artisans',
      'Extended key length for enhanced control',
      'Premium materials and voicing',
      'Professional conservatory-level performance'
    ],
    imageUrl: '/images/placeholders/piano-upright.jpg',
    ctaText: 'Request Exclusive Preview',
    ctaLink: '#contact',
    theme: 'craftsmanship',
    badge: 'Exclusive Preview'
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
