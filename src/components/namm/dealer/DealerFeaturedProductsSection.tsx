'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * Featured piano interface for NAMM 2026 Dealer Reception
 */
interface FeaturedPiano {
  id: string
  name: string
  tagline: string
  features: string[]
  imageUrl: string
}

/**
 * Dealer Featured Products Section props
 */
interface DealerFeaturedProductsSectionProps {
  title?: string
  subtitle?: string
}

/**
 * Compact horizontal piano card for dealer reception
 */
function CompactPianoCard({ piano, index }: { piano: FeaturedPiano; index: number }) {
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
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="group relative overflow-hidden rounded-2xl"
    >
      {/* Card container with horizontal layout */}
      <div className="relative bg-gradient-to-br from-zinc-900 via-stone-900 to-zinc-950 overflow-hidden">
        {/* Gold accent border glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-[#D4AF37]/30" />
          <div className="absolute inset-0 bg-gradient-radial from-[#D4AF37]/5 via-transparent to-transparent blur-xl" />
        </div>

        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative z-10 grid md:grid-cols-[40%_60%] min-h-[320px]">
          {/* Image Section - LEFT (40%) */}
          <div className="relative h-[280px] md:h-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-zinc-900/50 md:to-zinc-900/80 z-10" />
            <Image
              src={piano.imageUrl}
              alt={piano.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
            {/* Gold glow effect behind image */}
            <div className="absolute inset-0 bg-gradient-radial from-[#D4AF37]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl -z-10" />
          </div>

          {/* Content Section - RIGHT (60%) */}
          <div className="relative p-6 md:p-8 lg:p-10 flex flex-col justify-center">
            {/* Gold accent line */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#D4AF37]/40 via-[#D4AF37]/20 to-transparent" />

            <div className="space-y-5">
              {/* Piano Name */}
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-light text-white tracking-tight leading-tight group-hover:text-[#D4AF37]/90 transition-colors duration-300">
                {piano.name}
              </h3>

              {/* Tagline */}
              <p className="text-lg md:text-xl font-light text-zinc-300/90 leading-relaxed">
                {piano.tagline}
              </p>

              {/* Features List */}
              <ul className="space-y-2.5">
                {piano.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm md:text-base text-zinc-400 font-light leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * NAMM 2026 Dealer Reception Featured Pianos Data
 */
const DEALER_FEATURED_PIANOS: FeaturedPiano[] = [
  {
    id: 'cr45-crystal',
    name: 'CR-45 Crystal Grand',
    tagline: "The World's Most Exclusive Piano",
    features: [
      'Transparent crystal case',
      'Only 3 produced per year',
      'Concert grand action'
    ],
    imageUrl: '/images/placeholders/piano-grand.jpg'
  },
  {
    id: 'heralbony',
    name: 'HERALBONY Collaboration',
    tagline: 'Where Music Meets Art',
    features: [
      'Unique artistic design',
      'Premium K-200 upright',
      'Limited edition'
    ],
    imageUrl: '/images/namm/heralbony closeup.JPG'
  },
  {
    id: 'novus-nv10s',
    name: 'NOVUS NV-10S',
    tagline: "The World's First Upright with Grand Piano Action",
    features: [
      "Real Millennium III grand piano action in upright form",
      "Silent practice with headphones",
      "Shigeru Kawai SK-EX and other premium sounds"
    ],
    imageUrl: '/images/banners/NV10S-hybrid-styling.webp'
  }
]

/**
 * Dealer Featured Products Section Component
 * Compact showcase for NAMM 2026 dealer reception with horizontal card layout
 */
export default function DealerFeaturedProductsSection({
  title = 'Featured at the Reception',
  subtitle = 'Get hands-on with these exclusive instruments during the evening'
}: DealerFeaturedProductsSectionProps) {
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
    <section className="py-16 lg:py-24 bg-black relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-black to-zinc-950" />

      {/* Subtle gold accent glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#D4AF37]/5 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-12 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#D4AF37]" />
              <span className="text-xs tracking-[0.3em] uppercase text-[#D4AF37] font-light">
                Exclusive Showcase
              </span>
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#D4AF37]" />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white mb-4"
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl font-light leading-relaxed text-zinc-400 max-w-3xl mx-auto"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Featured Pianos Grid - Compact horizontal cards */}
        <div className="grid grid-cols-1 gap-6 lg:gap-8">
          {DEALER_FEATURED_PIANOS.map((piano, index) => (
            <CompactPianoCard key={piano.id} piano={piano} index={index} />
          ))}
        </div>

        {/* Optional: Call-to-action footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12 lg:mt-16"
        >
          <p className="text-zinc-500 font-light text-sm md:text-base">
            Register for the reception to experience these instruments firsthand
          </p>
        </motion.div>

        {/* SEO Keywords */}
        <div className="sr-only">
          NAMM 2026 dealer reception, CR-45 Crystal Grand, HERALBONY piano,
          Novus NV10 hybrid, exclusive piano showcase, dealer event,
          hands-on piano experience, limited edition pianos
        </div>
      </div>
    </section>
  )
}
