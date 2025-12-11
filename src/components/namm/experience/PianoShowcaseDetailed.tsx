'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
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
  const [isExpanded, setIsExpanded] = useState(false)
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

        {/* Content - Centered overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[700px] lg:min-h-[800px] px-10 lg:px-20 py-20">
          {/* Main content - centered */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center space-y-8 max-w-5xl"
          >
            {piano.badge && (
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 backdrop-blur-md shadow-lg">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-300 animate-pulse shadow-lg shadow-cyan-400/50" />
                <span className="text-xs font-medium tracking-widest uppercase text-cyan-100 drop-shadow-sm">{piano.badge}</span>
              </div>
            )}

            <h3 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-5 tracking-tight leading-none drop-shadow-2xl">
              {piano.name}
            </h3>
            <p className="text-2xl lg:text-3xl xl:text-4xl font-light text-cyan-50 drop-shadow-lg">
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
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "inline-flex items-center gap-3 px-10 py-5 rounded-full",
                "bg-gradient-to-r from-cyan-500/15 to-blue-500/15",
                "border-2 border-cyan-400/50 hover:border-cyan-300/70",
                "text-cyan-50 hover:text-white",
                "backdrop-blur-md transition-all duration-500",
                "group/btn hover:scale-110 hover:shadow-2xl hover:shadow-cyan-500/30",
                "transform-gpu"
              )}
            >
              <span className="font-medium text-lg">{isExpanded ? 'Show Less' : 'Learn More'}</span>
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

      {/* Expandable Details Section */}
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="overflow-hidden bg-gradient-to-br from-slate-950 via-cyan-950 to-blue-950"
      >
        <div className="p-10 lg:p-20 border-t border-cyan-400/20">
          <div className="max-w-5xl mx-auto space-y-10">
            {/* Description */}
            <div className="text-center space-y-6">
              <p className="text-2xl lg:text-3xl text-cyan-50 leading-relaxed font-light drop-shadow-lg">
                {piano.description}
              </p>
            </div>

            {/* Highlights */}
            <div className="grid md:grid-cols-2 gap-6">
              {piano.highlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 text-slate-100"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400/30 to-blue-500/30 flex items-center justify-center mt-1 flex-shrink-0 border border-cyan-400/40 shadow-lg shadow-cyan-500/20">
                    <div className="w-2 h-2 rounded-full bg-cyan-300 shadow-sm" />
                  </div>
                  <span className="text-lg lg:text-xl font-light leading-relaxed drop-shadow-sm">{highlight}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center pt-6">
              <Link
                href={piano.ctaLink}
                className={cn(
                  "inline-flex items-center gap-4 px-12 py-6 rounded-full",
                  "bg-gradient-to-r from-cyan-500/20 to-blue-500/20",
                  "border-2 border-cyan-400/50 hover:border-cyan-300/70",
                  "text-cyan-50 hover:text-white text-xl font-semibold",
                  "backdrop-blur-md transition-all duration-500",
                  "hover:scale-110 hover:shadow-2xl hover:shadow-cyan-500/40",
                  "transform-gpu"
                )}
              >
                <span>View Full Details</span>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/**
 * HERALBONY K-200 - Artistic collaboration piano
 * Vibrant multi-color theme (purple/fuchsia/pink/yellow)
 * Enhanced with TWO expandable sections: Piano Details + Artist Bio
 */
function ArtisticShowcase({ piano, index }: { piano: FeaturedPianoDetailed; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1, rootMargin: '100px' }
    )
    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 1.2, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative overflow-hidden rounded-3xl shadow-2xl"
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

        {/* Multi-color splash effects */}
        <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-radial from-yellow-400/25 via-orange-500/15 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-radial from-cyan-400/20 via-blue-500/10 to-transparent blur-3xl" />

        {/* Content - Centered overlay with minimal content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[700px] lg:min-h-[800px] px-10 lg:px-20 py-20">
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
              onClick={() => setIsExpanded(!isExpanded)}
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
              <span className="font-medium text-lg">{isExpanded ? 'Show Less' : 'Discover The Story'}</span>
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

      {/* Expandable Section 1: Piano Details */}
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="overflow-hidden bg-gradient-to-br from-pink-950 via-rose-950 to-purple-950"
      >
        <div className="p-10 lg:p-20 border-t border-fuchsia-400/20">
          <div className="max-w-5xl mx-auto space-y-10">
            {/* Piano Details Content */}
            <div className="text-center space-y-6">
              <p className="text-2xl lg:text-3xl text-white leading-relaxed font-light drop-shadow-lg">
                {piano.description}
              </p>
            </div>

            {/* Highlights */}
            <div className="grid md:grid-cols-2 gap-6">
              {piano.highlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 text-white"
                >
                  <div className="w-2 h-2 rounded-full bg-fuchsia-300 shadow-lg shadow-fuchsia-400/50 mt-2 flex-shrink-0" />
                  <span className="text-lg lg:text-xl font-light drop-shadow-md">{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Expandable Section 2: Sato Artist Bio */}
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="overflow-hidden bg-gradient-to-br from-purple-950 via-fuchsia-950 to-pink-950"
      >
        <div className="p-10 lg:p-20 border-t border-fuchsia-400/20">
          <div className="grid lg:grid-cols-2 gap-16 items-start max-w-7xl mx-auto">
            {/* Artist Photo */}
            <div className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={SATO_BIO.imageUrl}
                alt={SATO_BIO.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-950/90 via-purple-950/40 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <h4 className="text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-2xl">
                  {SATO_BIO.name}
                </h4>
                <p className="text-xl lg:text-2xl text-fuchsia-100 font-light drop-shadow-lg">
                  {SATO_BIO.artwork}
                </p>
              </div>
            </div>

            {/* Artist Bio */}
            <div className="space-y-8 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-1 bg-gradient-to-r from-fuchsia-400 to-pink-400 rounded-full" />
                <span className="text-sm font-semibold tracking-widest uppercase text-fuchsia-300">
                  About the Artist
                </span>
              </div>
              <p className="text-xl lg:text-2xl text-purple-100 leading-relaxed font-light drop-shadow-md">
                {SATO_BIO.bio}
              </p>
              <div className="pt-8">
                <Link
                  href="/products/heralbony-sk3"
                  className={cn(
                    "inline-flex items-center gap-4 px-12 py-6 rounded-full",
                    "bg-gradient-to-r from-fuchsia-500/20 to-pink-500/20",
                    "border-2 border-fuchsia-400/50 hover:border-fuchsia-300/70",
                    "text-fuchsia-50 hover:text-white text-xl font-semibold",
                    "backdrop-blur-md transition-all duration-500",
                    "hover:scale-110 hover:shadow-2xl hover:shadow-fuchsia-500/40",
                    "transform-gpu"
                  )}
                >
                  <span>View Full Details</span>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
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
 * Novus Series - Tech hybrid pianos
 * Clean tech aesthetic with emerald/teal
 * Expandable design with centered main content
 */
function TechHybridShowcase({ piano, index }: { piano: FeaturedPianoDetailed; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
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
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[700px] lg:min-h-[800px] px-10 lg:px-20 py-20">
          {/* Main content - centered */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center space-y-8 max-w-5xl"
          >
            {piano.badge && (
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/40 backdrop-blur-md shadow-lg">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-pulse shadow-lg shadow-emerald-400/50" />
                <span className="text-xs font-medium tracking-widest uppercase text-black drop-shadow-sm">{piano.badge}</span>
              </div>
            )}

            <h3 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-black mb-5 tracking-tight leading-none drop-shadow-2xl">
              {piano.name}
            </h3>
            <p className="text-2xl lg:text-3xl xl:text-4xl font-light text-black drop-shadow-2xl">
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
              onClick={() => setIsExpanded(!isExpanded)}
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
              <span className="font-medium text-lg">{isExpanded ? 'Show Less' : 'Learn More'}</span>
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

      {/* Expandable Details Section */}
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="overflow-hidden bg-gradient-to-br from-slate-950 via-teal-950 to-emerald-950"
      >
        <div className="p-10 lg:p-20 border-t border-emerald-400/20">
          <div className="max-w-5xl mx-auto space-y-10">
            {/* Description */}
            <div className="text-center space-y-6">
              <p className="text-2xl lg:text-3xl text-emerald-50 leading-relaxed font-light drop-shadow-lg">
                {piano.description}
              </p>
            </div>

            {/* Highlights */}
            <div className="grid md:grid-cols-2 gap-6">
              {piano.highlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 text-slate-100"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400/30 to-teal-500/30 flex items-center justify-center mt-1 flex-shrink-0 border border-emerald-400/40 shadow-lg shadow-emerald-500/20">
                    <svg className="w-3.5 h-3.5 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-lg lg:text-xl font-light leading-relaxed drop-shadow-sm">{highlight}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center pt-6">
              <Link
                href={piano.ctaLink}
                className={cn(
                  "inline-flex items-center gap-4 px-12 py-6 rounded-full",
                  "bg-gradient-to-r from-emerald-500/20 to-teal-500/20",
                  "border-2 border-emerald-400/50 hover:border-emerald-300/70",
                  "text-emerald-50 hover:text-white text-xl font-semibold",
                  "backdrop-blur-md transition-all duration-500",
                  "hover:scale-110 hover:shadow-2xl hover:shadow-emerald-500/40",
                  "transform-gpu"
                )}
              >
                <span>View Full Details</span>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/**
 * Master Series - Premium craftsmanship teaser with video
 * Mysterious reveal with cinematic video background
 * Expandable design heightens the mystery
 */
function CraftsmanshipShowcase({ piano, index }: { piano: FeaturedPianoDetailed; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
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
      {/* Mysterious dark background with cinematic video */}
      <div className="relative min-h-[800px] bg-black p-10 lg:p-20">
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
        <div className="absolute inset-0 opacity-[0.12]">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-amber-300 via-transparent to-transparent" />
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-amber-300 via-transparent to-transparent" />
          <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-white via-transparent to-transparent" />
        </div>

        {/* Mysterious glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-radial from-amber-600/25 via-transparent to-transparent blur-3xl" />

        <div className="relative z-10 flex flex-col items-center justify-center min-h-[600px] lg:min-h-[700px] px-10 lg:px-20 py-20">
          {/* Main content - centered */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center space-y-8 max-w-5xl"
          >
            <h3 className="text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-8 tracking-tight leading-none drop-shadow-2xl">
              {piano.name}
            </h3>
            <p className="text-3xl lg:text-4xl xl:text-5xl font-light text-black drop-shadow-xl leading-relaxed">
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
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "inline-flex items-center gap-3 px-10 py-5 rounded-full",
                "bg-black hover:bg-black",
                "border-2 border-white/30 hover:border-white/50",
                "text-white hover:text-white",
                "backdrop-blur-md transition-all duration-500",
                "group/btn hover:scale-110 hover:shadow-2xl hover:shadow-white/50",
                "transform-gpu"
              )}
            >
              <span className="font-light text-lg">{isExpanded ? 'Hide The Mystery' : 'Unveil The Mystery'}</span>
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

      {/* Expandable Mystery Section */}
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="overflow-hidden bg-black"
      >
        <div className="p-10 lg:p-20 border-t border-white/20">
          <div className="max-w-5xl mx-auto space-y-10">
            {/* Description */}
            <div className="text-center space-y-6">
              <p className="text-2xl lg:text-3xl text-white leading-relaxed font-light drop-shadow-lg">
                {piano.description}
              </p>
            </div>

            {/* Mysterious hints */}
            <div className="space-y-6 max-w-2xl mx-auto">
              {piano.highlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-center gap-4 text-white"
                >
                  <div className="w-2 h-2 rounded-full bg-white shadow-lg shadow-white/50" />
                  <span className="text-lg lg:text-xl font-light tracking-wide drop-shadow-sm">{highlight}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center pt-6">
              <Link
                href={piano.ctaLink}
                className={cn(
                  "inline-flex items-center gap-4 px-12 py-6 rounded-full",
                  "bg-white/10 hover:bg-white/15",
                  "border-2 border-white/30 hover:border-white/50",
                  "text-white hover:text-white text-xl font-semibold",
                  "backdrop-blur-md transition-all duration-500",
                  "hover:scale-110 hover:shadow-2xl hover:shadow-white/40",
                  "transform-gpu"
                )}
              >
                <span>Learn More</span>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/**
 * NAMM 2026 Featured Pianos - Complete Data
 * All details included for the experience page
 * HERALBONY moved to top position as featured showcase
 */
const FEATURED_PIANOS_DETAILED: FeaturedPianoDetailed[] = [
  {
    id: 'heralbony',
    name: 'HERALBONY with Kawai',
    tagline: 'Where Music Radiates Color',
    description: 'A bold artistic collaboration featuring vibrant artwork by artists with intellectual disabilities. This SK-3 concert grand transforms into a public art installation that challenges perceptions and celebrates inclusive creativity through sound and vision.',
    highlights: [
      'Vibrant original artwork by artist Sato',
      'Social mission supporting artists with disabilities',
      'Shigeru Kawai SK-3 concert grand base (186cm / 6\'1")',
      'Interactive public art piano experience',
      'Limited edition with certificate of authenticity'
    ],
    imageUrl: '/images/namm/heralbony closeup.JPG',
    ctaText: 'Discover The Story',
    ctaLink: '/products/heralbony-sk3',
    theme: 'artistic',
    badge: 'Artistic Collaboration'
  },
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
    imageUrl: 'https://pub-486ee03121a24ede8b51409434e22709.r2.dev/pianos/crystal/024.jpg',
    ctaText: 'Explore Crystal Grand',
    ctaLink: '/products/cr-45',
    theme: 'crystal',
    badge: 'Ultra Exclusive • 3 Per Year'
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
    imageUrl: 'https://pub-486ee03121a24ede8b51409434e22709.r2.dev/pianos/crystal/DSC_1820_sRGB.jpg',
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
    ctaText: 'Learn More',
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
  const [isIntroExpanded, setIsIntroExpanded] = useState(false)
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

          {/* Expandable Intro Text */}
          <motion.div
            initial={false}
            animate={{
              height: isIntroExpanded ? 'auto' : 0,
              opacity: isIntroExpanded ? 1 : 0
            }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-xl md:text-2xl lg:text-3xl font-light leading-relaxed text-zinc-300 max-w-5xl mx-auto drop-shadow-lg mb-8"
            >
              {subtitle}
            </motion.p>
          </motion.div>

          {/* Learn More Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <button
              onClick={() => setIsIntroExpanded(!isIntroExpanded)}
              className={cn(
                "inline-flex items-center gap-3 px-8 py-4 rounded-full",
                "bg-gradient-to-r from-white/10 to-white/5",
                "border-2 border-white/30 hover:border-white/50",
                "text-white hover:text-white",
                "backdrop-blur-md transition-all duration-500",
                "hover:scale-105 shadow-xl hover:shadow-white/20",
                "transform-gpu"
              )}
            >
              <span className="font-light text-lg">{isIntroExpanded ? 'Show Less' : 'Learn More'}</span>
              <svg
                className={cn(
                  "w-5 h-5 transition-transform duration-500",
                  isIntroExpanded ? "rotate-90" : ""
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </motion.div>
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
