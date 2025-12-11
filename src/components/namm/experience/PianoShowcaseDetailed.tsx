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
  name: 'SATO',
  imageUrl: '/images/namm/sato.jpg',
  bio: 'Sato is a visionary artist whose vibrant, energetic artwork transforms everyday objects into extraordinary experiences. Working through HERALBONY, a Japanese creative company that champions bold artistic perspectives, Sato\'s distinctive style radiates joy and color to the world. Their collaboration with Kawai represents a groundbreaking fusion of visual art and musical craftsmanship.',
  artwork: ''
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
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
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
      id={piano.id}
      ref={cardRef}
      initial={{ opacity: 0, y: 80 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
      transition={{ duration: 1, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative overflow-hidden rounded-3xl shadow-2xl scroll-mt-20"
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

            <h3 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-5 tracking-tight leading-none drop-shadow-2xl" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.6)' }}>
              {piano.name}
            </h3>
            <p className="text-2xl lg:text-3xl xl:text-4xl font-light text-cyan-50 drop-shadow-lg" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.7), 0 1px 3px rgba(0, 0, 0, 0.5)' }}>
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
            {/* Hook Line */}
            <div className="text-center">
              <p className="text-3xl lg:text-4xl font-light text-cyan-200 leading-tight drop-shadow-lg italic">
                Witness the soul of a piano—every hammer, every string, every moment of musical artistry made visible.
              </p>
            </div>

            {/* Description with Read More */}
            <div className="text-center space-y-4">
              <p className="text-xl lg:text-2xl text-cyan-50 leading-relaxed font-light drop-shadow-lg">
                {isDescriptionExpanded ? piano.description : `${piano.description.slice(0, 180)}...`}
              </p>
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="text-cyan-300 hover:text-cyan-100 text-lg font-medium transition-colors duration-200 underline decoration-cyan-400/50 underline-offset-4"
              >
                {isDescriptionExpanded ? 'Show Less' : 'Read More'}
              </button>
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
      id={piano.id}
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 1.2, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative overflow-hidden rounded-3xl shadow-2xl scroll-mt-20"
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
              <div className="absolute bottom-8 left-8 right-8">
                <h4 className="text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-2xl">
                  {SATO_BIO.name}
                </h4>
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
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
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
      id={piano.id}
      ref={cardRef}
      initial={{ opacity: 0, y: 80 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
      transition={{ duration: 1, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative overflow-hidden rounded-3xl shadow-2xl scroll-mt-20"
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

        {/* Novus Logo - Top Left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-8 left-8 lg:top-12 lg:left-12 z-20"
        >
          <Image
            src="https://pub-486ee03121a24ede8b51409434e22709.r2.dev/pianos/crystal/Novus_Hybrid%20Piano_NV5_logo_black.png"
            alt="Novus Hybrid Piano"
            width={500}
            height={250}
            className="w-32 lg:w-40 xl:w-48 h-auto drop-shadow-2xl"
          />
        </motion.div>

        {/* Content - Centered overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[700px] lg:min-h-[800px] px-10 lg:px-20 py-20">
          {/* Main content - centered */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center space-y-8 max-w-5xl"
          >
            <h3 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-5 tracking-tight leading-none drop-shadow-2xl" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.6)' }}>
              {piano.name}
            </h3>
            <p className="text-2xl lg:text-3xl xl:text-4xl font-light text-white drop-shadow-2xl" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.7), 0 1px 3px rgba(0, 0, 0, 0.5)' }}>
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
            {/* Hook Line */}
            <div className="text-center">
              <p className="text-3xl lg:text-4xl font-light text-emerald-200 leading-tight drop-shadow-lg italic">
                The world's first hybrid piano to eliminate speakers—sound radiates naturally through a living, breathing soundboard.
              </p>
            </div>

            {/* Description with Read More */}
            <div className="text-center space-y-4">
              <p className="text-xl lg:text-2xl text-emerald-50 leading-relaxed font-light drop-shadow-lg">
                {isDescriptionExpanded ? piano.description : `${piano.description.slice(0, 200)}...`}
              </p>
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="text-emerald-300 hover:text-emerald-100 text-lg font-medium transition-colors duration-200 underline decoration-emerald-400/50 underline-offset-4"
              >
                {isDescriptionExpanded ? 'Show Less' : 'Read More'}
              </button>
            </div>

            {/* Highlights */}
            <div className="space-y-8">
              {piano.highlights.map((highlight, idx) => {
                // Check if this is a section header (starts and ends with **)
                const isHeader = highlight.startsWith('**') && highlight.endsWith('**')
                // Check if this is a spacer (empty string)
                const isSpacer = highlight.trim() === ''

                if (isSpacer) {
                  return <div key={idx} className="h-4" />
                }

                if (isHeader) {
                  return (
                    <h4 key={idx} className="text-2xl lg:text-3xl font-semibold text-emerald-300 mt-8 first:mt-0 mb-4 tracking-wide">
                      {highlight.replace(/\*\*/g, '')}
                    </h4>
                  )
                }

                return (
                  <div key={idx} className="flex items-start gap-4 text-slate-100">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400/30 to-teal-500/30 flex items-center justify-center mt-1 flex-shrink-0 border border-emerald-400/40 shadow-lg shadow-emerald-500/20">
                      <svg className="w-3.5 h-3.5 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-lg lg:text-xl font-light leading-relaxed drop-shadow-sm">{highlight}</span>
                  </div>
                )
              })}
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
      id={piano.id}
      ref={cardRef}
      initial={{ opacity: 0, y: 80 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
      transition={{ duration: 1, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative overflow-hidden rounded-3xl shadow-2xl scroll-mt-20"
    >
      {/* Mysterious dark background with cinematic video */}
      <div className="relative min-h-[1000px] lg:min-h-[1200px] xl:min-h-[1400px] bg-black p-12 lg:p-24 xl:p-32">
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

        <div className="relative z-10 flex flex-col justify-between items-center text-center min-h-[900px] lg:min-h-[1100px] xl:min-h-[1300px] px-10 lg:px-20 py-24 lg:py-32 xl:py-40">
          {/* Main title - upper area */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex-1 flex items-center justify-center"
          >
            <h3 className="text-7xl lg:text-8xl xl:text-9xl font-bold text-white tracking-tight leading-none drop-shadow-2xl max-w-6xl" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.6)' }}>
              {piano.name}
            </h3>
          </motion.div>

          {/* Tagline - bottom area */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-6xl"
          >
            <p className="text-4xl lg:text-5xl xl:text-6xl font-light text-black drop-shadow-xl leading-relaxed" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.7), 0 1px 3px rgba(0, 0, 0, 0.5)', fontFamily: '"Miller Banner Compressed", Georgia, serif' }}>
              {piano.tagline}
            </p>
          </motion.div>
        </div>
      </div>
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
    description: 'A bold artistic collaboration celebrating unique creative vision. This SK-3 concert grand becomes a canvas for Sato\'s vibrant artwork, transforming into a public art installation that challenges preconceptions and reveals the extraordinary power of different perspectives through sound and vision.',
    highlights: [
      'Vibrant original artwork by visionary artist Sato',
      'Shigeru Kawai SK-3 concert grand base (186cm / 6\'1")',
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
    tagline: 'Not Just an Instrument—A Masterpiece',
    description: 'A symbol of luxury and exclusivity—the CR-45\'s transparent acrylic body offers a rare glimpse into piano mechanics, revealing hammers and strings in motion. This 185cm (6\'1") masterpiece features Millennium III ABS-Carbon action, concert-length key buttons, NEOTEX™ key surfaces, and a solid spruce soundboard. Owning a CR-45 is not merely playing an instrument—it is felt, seen, and heard as a manifestation of unparalleled craftsmanship.',
    highlights: [
      'Transparent acrylic reveals hammers & strings in motion',
      'Millennium III Action with ABS-Carbon fiber technology',
      'Concert-length key buttons & NEOTEX™ moisture-absorbing keys',
      'Extended keysticks & vertically laminated bridge with solid maple cap',
      'Ultra-slow "Soft Fall" system & stepless angle music stand',
      '185cm (6\'1") with solid spruce soundboard & dual-duplex scaling'
    ],
    imageUrl: 'https://pub-486ee03121a24ede8b51409434e22709.r2.dev/pianos/crystal/024.jpg',
    ctaText: 'Explore Crystal Grand',
    ctaLink: '/products/cr-45',
    theme: 'crystal'
  },
  {
    id: 'novus',
    name: 'NV6 & NV12',
    tagline: 'The Hybrid Reinvented. Acoustic Action. Acoustic Sound.',
    description: 'Kawai\'s flagship hybrid series combines the expressive touch and nuanced response of real acoustic piano actions with modern digital versatility. The groundbreaking NV12 grand features the world\'s first PentaDrive speakerless soundboard system, while the NV6 upright delivers authentic performance in a space-conscious design. Both feature Millennium III Hybrid actions, SK-EX Rendering piano engine, and modern connectivity.',
    highlights: [
      '**NV12 Grand Piano Hybrid**',
      'Peerless Millennium III Hybrid grand piano keyboard action',
      'Unique real grand piano damper mechanism',
      'Groundbreaking PentaDrive speakerless soundboard system',
      'SK-EX Rendering piano engine with Competition Grand sounds',
      'Stunning grand-piano cabinet with 3-position topboard',
      '',
      '**NV6 Upright Piano Hybrid**',
      'Superb Millennium III Hybrid upright piano keyboard action',
      'Unique real upright piano damper mechanism',
      'High-performance speaker system with wooden soundboard',
      'Ultra-slim ebony polish cabinet with Soft Fall fallboard',
      '',
      '**Shared Features (Both Models)**',
      'Bluetooth® MIDI and Audio v5 wireless connectivity',
      'Large 5" LCD touchscreen display in cheekblock',
      'USB audio interface with USB-C port & power delivery',
      'Spatial Headphone Sound for enhanced depth and realism',
      'Premium audio processing and amplification technologies'
    ],
    imageUrl: 'https://pub-486ee03121a24ede8b51409434e22709.r2.dev/pianos/crystal/DSC_1820_sRGB.jpg',
    ctaText: 'Experience Novus Technology',
    ctaLink: '/products/novus-series',
    theme: 'tech',
    badge: 'NEW 2025 • PentaDrive Technology'
  },
  {
    id: 'master-series',
    name: 'Something Extraordinary',
    tagline: 'Just You, the Sound, and the Moment.',
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
  subtitle = ''
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
    <section id="pianos" className="py-32 lg:py-40 bg-black relative overflow-hidden scroll-mt-0">
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

          {/* Expandable Intro Text - Only show if subtitle exists */}
          {subtitle && (
            <>
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
            </>
          )}
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
