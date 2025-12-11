'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
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
      { threshold: 0.15, rootMargin: '50px' }
    )
    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 1, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative overflow-hidden rounded-3xl"
    >
      {/* Full-bleed image background */}
      <div className="relative min-h-[700px] lg:min-h-[800px]">
        {/* Piano Image - Full Card Background */}
        <div className="absolute inset-0">
          <Image
            src={piano.imageUrl}
            alt={piano.name}
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
        </div>

        {/* Glass reflection effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/[0.15] via-transparent to-transparent" />

        {/* Crystalline pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 30% 40%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1.5px, transparent 1.5px)',
            backgroundSize: '60px 60px, 80px 80px'
          }} />
        </div>

        {/* Content - Centered overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[700px] lg:min-h-[800px] px-6 lg:px-12 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center space-y-8 max-w-5xl"
          >
            <h3 className="text-4xl lg:text-5xl xl:text-6xl font-light text-white mb-4 tracking-tight leading-tight drop-shadow-2xl">
              {piano.name}
            </h3>
            <p className="text-xl lg:text-2xl font-light text-cyan-100/90 drop-shadow-2xl">
              {piano.tagline}
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12"
          >
            <Link
              href={piano.ctaLink}
              className={cn(
                "inline-flex items-center gap-3 px-10 py-5 rounded-full",
                "bg-gradient-to-r from-cyan-500/10 to-blue-500/10",
                "border-2 border-cyan-500/30 hover:border-cyan-400/50",
                "text-cyan-100 hover:text-white",
                "backdrop-blur-md transition-all duration-500",
                "group/btn hover:scale-110 shadow-2xl hover:shadow-cyan-500/50",
                "transform-gpu"
              )}
            >
              <span className="font-medium text-lg">{piano.ctaText}</span>
              <svg className="w-5 h-5 transition-transform group-hover/btn:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * HERALBONY K-200 - Artistic collaboration piano
 * Enhanced with expandable artist bio section
 */
function ArtisticPianoCard({ piano, index }: { piano: FeaturedPiano; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.15, rootMargin: '50px' }
    )
    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  const handleCardClick = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 1, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative overflow-hidden rounded-3xl cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Full-bleed image background */}
      <div className="relative min-h-[700px] lg:min-h-[800px]">
        {/* Piano Image - Full Card Background */}
        <div className="absolute inset-0">
          <Image
            src={piano.imageUrl}
            alt={piano.name}
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
        </div>

        {/* Color splash effects */}
        <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-radial from-yellow-500/20 via-orange-500/10 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-radial from-cyan-500/20 via-blue-500/10 to-transparent blur-3xl" />

        {/* Content - Centered overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[700px] lg:min-h-[800px] px-6 lg:px-12 py-16">
          {/* Logos - CENTERED IN MIDDLE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center space-y-8 max-w-5xl"
          >
            <h3 className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6">
              <Image
                src="/images/namm/HERALBONY_7_logotype-symbol_2_black.png"
                alt="HERALBONY"
                width={500}
                height={100}
                className="h-14 lg:h-16 xl:h-20 w-auto brightness-0 invert drop-shadow-2xl"
                priority
              />
              <span className="text-3xl lg:text-4xl xl:text-5xl font-light text-white drop-shadow-2xl">with</span>
              <Image
                src="/images/optimized/logos/Kawai-Red.png"
                alt="KAWAI"
                width={400}
                height={80}
                className="h-12 lg:h-14 xl:h-18 w-auto drop-shadow-2xl"
                priority
              />
            </h3>
            <p className="text-2xl lg:text-3xl xl:text-4xl font-light text-white drop-shadow-2xl leading-relaxed">
              {piano.tagline}
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12"
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleCardClick()
              }}
              className={cn(
                "inline-flex items-center gap-3 px-10 py-5 rounded-full",
                "bg-gradient-to-r from-white/10 to-white/5",
                "border-2 border-white/30 hover:border-white/50",
                "text-white hover:text-white",
                "backdrop-blur-md transition-all duration-500",
                "group/btn hover:scale-110 shadow-2xl hover:shadow-fuchsia-500/50",
                "transform-gpu"
              )}
            >
              <span className="font-medium text-lg">{isExpanded ? 'Show Less' : piano.ctaText}</span>
              <svg
                className={cn(
                  "w-5 h-5 transition-transform duration-500",
                  isExpanded ? "rotate-90" : "group-hover/btn:translate-x-2"
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Expandable Artist Bio Section */}
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="overflow-hidden bg-gradient-to-br from-purple-950 via-fuchsia-950 to-pink-950"
      >
        <div className="p-8 lg:p-16 border-t border-fuchsia-400/20">
          <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
            {/* Artist Photo */}
            <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden">
              <Image
                src={SATO_BIO.imageUrl}
                alt={SATO_BIO.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h4 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  {SATO_BIO.name}
                </h4>
                <p className="text-lg text-fuchsia-200 font-light">
                  {SATO_BIO.artwork}
                </p>
              </div>
            </div>

            {/* Artist Bio */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-0.5 bg-gradient-to-r from-fuchsia-400 to-pink-400" />
                <span className="text-sm font-medium tracking-widest uppercase text-fuchsia-300">
                  Meet the Artist
                </span>
              </div>
              <p className="text-lg lg:text-xl text-purple-100 leading-relaxed font-light">
                {SATO_BIO.bio}
              </p>
              <div className="pt-6">
                <Link
                  href="/products/heralbony-sk3"
                  onClick={(e) => e.stopPropagation()}
                  className={cn(
                    "inline-flex items-center gap-3 px-8 py-4 rounded-full",
                    "bg-gradient-to-r from-fuchsia-500/20 to-pink-500/20",
                    "border border-fuchsia-400/40 hover:border-fuchsia-300/60",
                    "text-fuchsia-100 hover:text-white",
                    "backdrop-blur-sm transition-all duration-300",
                    "hover:scale-105"
                  )}
                >
                  <span className="font-light">View Full Details</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
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
      { threshold: 0.15, rootMargin: '50px' }
    )
    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 1, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative overflow-hidden rounded-3xl"
    >
      {/* Full-bleed image background */}
      <div className="relative min-h-[700px] lg:min-h-[800px]">
        {/* Piano Image - Full Card Background */}
        <div className="absolute inset-0">
          <Image
            src={piano.imageUrl}
            alt={piano.name}
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
        </div>

        {/* Tech-themed gradient overlays */}
        <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-radial from-emerald-500/20 via-teal-500/10 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-radial from-teal-500/20 via-emerald-500/10 to-transparent blur-3xl" />

        {/* Novus logo overlay - positioned on the right */}
        <div className="absolute top-8 right-8 z-10">
          <Image
            src="https://pub-486ee03121a24ede8b51409434e22709.r2.dev/pianos/crystal/Novus_Hybrid%20Piano_NV5_logo_black.png"
            alt="Novus Hybrid Piano"
            width={200}
            height={100}
            className="w-32 lg:w-48 h-auto drop-shadow-2xl"
          />
        </div>

        {/* Content - Centered overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[700px] lg:min-h-[800px] px-6 lg:px-12 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center space-y-8 max-w-5xl"
          >
            <h3 className="text-4xl lg:text-5xl xl:text-6xl font-light text-black mb-4 tracking-tight leading-tight drop-shadow-2xl">
              {piano.name}
            </h3>
            <p className="text-xl lg:text-2xl font-light text-black drop-shadow-2xl">
              {piano.tagline}
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12"
          >
            <Link
              href={piano.ctaLink}
              className={cn(
                "inline-flex items-center gap-3 px-10 py-5 rounded-full",
                "bg-gradient-to-r from-white/10 to-white/5",
                "border-2 border-black/30 hover:border-black/50",
                "text-black hover:text-black",
                "backdrop-blur-md transition-all duration-500",
                "group/btn hover:scale-110 shadow-2xl hover:shadow-emerald-500/50",
                "transform-gpu"
              )}
            >
              <span className="font-medium text-lg">{piano.ctaText}</span>
              <svg className="w-5 h-5 transition-transform group-hover/btn:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Master Series - Premium craftsmanship teaser with video
 */
function CraftsmanshipCard({ piano, index }: { piano: FeaturedPiano; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true)
          // Play video when card becomes visible
          if (videoRef.current) {
            videoRef.current.play().catch((err) => console.log('Video autoplay failed:', err))
          }
        }
      },
      { threshold: 0.15, rootMargin: '50px' }
    )
    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 1, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative overflow-hidden rounded-3xl"
    >
      {/* Mysterious dark background with video */}
      <div className="relative min-h-[600px] lg:min-h-[700px] bg-black p-8 lg:p-16">
        {/* Video background - Minimal overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-95"
          >
            <source src="https://pub-486ee03121a24ede8b51409434e22709.r2.dev/pianos/masterseries/masterseriesanmiation.mp4" type="video/mp4" />
          </video>
          {/* 5% dark overlay for text contrast */}
          <div className="absolute inset-0 bg-black/5" />
        </div>

        {/* Dramatic light rays */}
        <div className="absolute inset-0 opacity-[0.08]">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-amber-300 via-transparent to-transparent" />
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-amber-300 via-transparent to-transparent" />
        </div>

        {/* Mysterious glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-amber-600/20 via-transparent to-transparent blur-3xl" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-10 min-h-[500px] lg:min-h-[600px]">
          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-6 max-w-3xl"
          >
            <h3 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 tracking-tight leading-none drop-shadow-2xl">
              {piano.name}
            </h3>
            <p className="text-2xl lg:text-3xl font-light text-black leading-relaxed drop-shadow-xl">
              {piano.tagline}
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <Link
              href={piano.ctaLink}
              className={cn(
                "inline-flex items-center gap-3 px-10 py-5 rounded-full",
                "bg-black hover:bg-black",
                "border-2 border-black hover:border-white/50",
                "text-white hover:text-white text-lg font-medium",
                "transition-all duration-500",
                "group/btn hover:scale-110 hover:shadow-2xl hover:shadow-white/40",
                "transform-gpu"
              )}
            >
              <span className="font-light">Learn More</span>
              <svg className="w-5 h-5 transition-transform group-hover/btn:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Artist bio information for HERALBONY collaboration
 */
interface ArtistBio {
  name: string
  imageUrl: string
  bio: string
  artwork: string
}

const SATO_BIO: ArtistBio = {
  name: 'Sato',
  imageUrl: '/images/namm/sato.jpg',
  bio: 'Sato is a talented artist whose vibrant, energetic artwork transforms everyday objects into extraordinary experiences. Working through HERALBONY, a Japanese social enterprise that supports artists with intellectual disabilities, Sato\'s distinctive style brings joy and color to the world. Their collaboration with Kawai represents a groundbreaking fusion of visual art and musical craftsmanship.',
  artwork: 'Radiant Energy - A celebration of color, movement, and creative expression'
}

/**
 * NAMM 2026 Featured Pianos Data
 * HERALBONY moved to top position as featured showcase
 */
const FEATURED_PIANOS: FeaturedPiano[] = [
  {
    id: 'heralbony',
    name: 'HERALBONY with Kawai',
    tagline: 'Where Music Radiates Color',
    imageUrl: '/images/namm/heralbony closeup.JPG',
    ctaText: 'Discover The Story',
    ctaLink: '/products/heralbony-sk3',
    theme: 'artistic'
  },
  {
    id: 'cr45',
    name: 'CR-45 Crystal Grand',
    tagline: 'The World\'s Most Exclusive Piano',
    imageUrl: 'https://pub-486ee03121a24ede8b51409434e22709.r2.dev/pianos/crystal/024.jpg',
    ctaText: 'Explore Crystal Grand',
    ctaLink: '/products/cr-45',
    theme: 'crystal'
  },
  {
    id: 'novus',
    name: 'Novus NV6 & NV12',
    tagline: 'Feel Acoustic. Play Silent.',
    imageUrl: 'https://pub-486ee03121a24ede8b51409434e22709.r2.dev/pianos/crystal/DSC_1820_sRGB.jpg',
    ctaText: 'Experience Novus Technology',
    ctaLink: '/products/novus-series',
    theme: 'tech'
  },
  {
    id: 'master-series',
    name: 'Something Extraordinary',
    tagline: 'A New Chapter in Piano Craftsmanship',
    imageUrl: '/images/placeholders/piano-upright.jpg',
    ctaText: 'Learn More',
    ctaLink: '#contact',
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
    <section className="py-24 lg:py-32 bg-black relative overflow-hidden scroll-smooth">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-black to-zinc-950" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-24 lg:mb-32">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-white mb-6"
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-xl md:text-2xl font-light leading-relaxed text-zinc-400 max-w-4xl mx-auto"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Featured Pianos - Each with unique treatment */}
        <div className="space-y-16 lg:space-y-20">
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
