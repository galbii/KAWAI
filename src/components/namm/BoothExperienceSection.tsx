'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * Booth experience feature interface
 */
export interface BoothFeature {
  icon: React.ReactNode
  title: string
  description: string
  image: string
  imageAlt: string
}

/**
 * Booth Experience Section props
 */
interface BoothExperienceSectionProps {
  title?: string
  subtitle?: string
  features?: BoothFeature[]
}

/**
 * Professional SVG Icons for luxury aesthetic
 */
const Icons = {
  Collection: () => (
    <svg className="w-10 h-10 lg:w-12 lg:h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v13.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  ),
  Performance: () => (
    <svg className="w-10 h-10 lg:w-12 lg:h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
    </svg>
  ),
  Consultation: () => (
    <svg className="w-10 h-10 lg:w-12 lg:h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  Innovation: () => (
    <svg className="w-10 h-10 lg:w-12 lg:h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
    </svg>
  )
}

/**
 * Individual feature card with alternating image/content layout - Dark theme
 */
function FeatureCard({ feature, index }: { feature: BoothFeature; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const isEven = index % 2 === 0

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={cardRef}
      initial={{
        opacity: 0,
        x: isEven ? -60 : 60,
        scale: 0.95
      }}
      animate={isVisible ? {
        opacity: 1,
        x: 0,
        scale: 1
      } : {
        opacity: 0,
        x: isEven ? -60 : 60,
        scale: 0.95
      }}
      transition={{
        duration: 1,
        delay: index * 0.2,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className="group h-full"
    >
      <div className={cn(
        'h-full overflow-hidden rounded-2xl',
        // Dark theme background with subtle border
        'bg-zinc-950/90 backdrop-blur-sm',
        'border border-stone-800/50',
        // Enhanced shadows and glow on hover
        'shadow-2xl shadow-black/50',
        'hover:shadow-[0_20px_70px_-15px_rgba(0,0,0,0.9)]',
        'hover:border-stone-700',
        'transition-all duration-700 ease-out',
        // Alternating layout using grid
        'grid grid-cols-1 lg:grid-cols-2',
        'min-h-[500px] lg:min-h-[400px]'
      )}>
        {/* Image Section - Order changes based on even/odd */}
        <div className={cn(
          'relative overflow-hidden',
          isEven ? 'lg:order-1' : 'lg:order-2',
          'h-64 lg:h-auto'
        )}>
          {/* Image with enhanced overlay for dark theme */}
          <div className="absolute inset-0">
            <Image
              src={feature.image}
              alt={feature.imageAlt}
              fill
              className={cn(
                'object-cover',
                'group-hover:scale-110 transition-transform duration-1000 ease-out',
                // Slightly reduce brightness to blend with dark theme
                'brightness-90 group-hover:brightness-100'
              )}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Enhanced gradient overlay for dark theme */}
            <div className={cn(
              'absolute inset-0',
              'bg-gradient-to-t from-black/60 via-black/20 to-transparent',
              'lg:bg-gradient-to-r',
              isEven ? 'lg:from-black/20 lg:to-black/50' : 'lg:from-black/50 lg:to-black/20'
            )} />
          </div>

          {/* Floating icon badge on image - Light badge for dark theme */}
          <div className={cn(
            'absolute bottom-6 z-10',
            isEven ? 'right-6 lg:right-auto lg:left-6' : 'left-6 lg:left-auto lg:right-6'
          )}>
            <div className={cn(
              'p-4 rounded-xl',
              // Light badge that pops on dark theme
              'bg-white/95 backdrop-blur-md',
              'shadow-2xl shadow-black/50',
              'text-stone-800',
              'group-hover:text-kawai-red group-hover:scale-110',
              'group-hover:shadow-kawai-red/30 group-hover:shadow-xl',
              'transition-all duration-300'
            )}>
              {feature.icon}
            </div>
          </div>
        </div>

        {/* Content Section - Dark theme text */}
        <div className={cn(
          'flex flex-col justify-center',
          'p-8 lg:p-12',
          isEven ? 'lg:order-2' : 'lg:order-1',
          // Subtle gradient overlay for depth
          'relative',
          'before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:to-stone-950/30 before:pointer-events-none'
        )}>
          <div className="relative z-10">
            {/* Title - White for dark theme */}
            <h3 className={cn(
              'text-3xl lg:text-4xl font-light text-white mb-6 tracking-tight',
              'leading-tight'
            )}>
              {feature.title}
            </h3>

            {/* Description - Light gray for readability */}
            <p className="text-base lg:text-lg font-light leading-relaxed text-stone-300 mb-6">
              {feature.description}
            </p>

            {/* Accent line with glow effect */}
            <div className="relative">
              <div className={cn(
                'w-16 h-0.5 bg-gradient-to-r',
                'from-kawai-red to-amber-600',
                'group-hover:w-24 transition-all duration-500'
              )} />
              {/* Subtle glow effect */}
              <div className={cn(
                'absolute inset-0 w-16 h-0.5 bg-gradient-to-r',
                'from-kawai-red to-amber-600',
                'blur-sm opacity-50',
                'group-hover:w-24 group-hover:opacity-75 transition-all duration-500'
              )} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Premium booth experience features for NAMM 2026 with images
 */
const DEFAULT_FEATURES: BoothFeature[] = [
  {
    icon: <Icons.Collection />,
    title: 'Curated Collections',
    description: 'Explore thoughtfully curated piano collections designed for every artist. From concert grands to hybrid innovations, experience instruments selected for their exceptional voice and craftsmanship through hands-on demonstrations.',
    image: '/images/namm/general/TK7_7390.jpg',
    imageAlt: 'Kawai piano collection showcase'
  },
  {
    icon: <Icons.Performance />,
    title: 'Artist Performances',
    description: 'Witness world-class pianists perform throughout the day on our premium stage. Each live performance showcases the expressive capabilities of Kawai instruments in an intimate showroom setting.',
    image: '/images/namm/general/_MG_7325.jpg',
    imageAlt: 'Live artist performance at Kawai booth'
  },
  {
    icon: <Icons.Consultation />,
    title: 'Master Artisan Consultation',
    description: 'Connect with Kawai Master Piano Artisans and professional representatives. Discover the meticulous craftsmanship behind each instrument and receive personalized guidance tailored to your musical journey.',
    image: '/images/namm/general/KAWAI_K_Serie_Detail-33(1).jpg',
    imageAlt: 'Kawai master artisan craftsmanship detail'
  },
  {
    icon: <Icons.Innovation />,
    title: 'Innovation Showcase',
    description: 'Experience cutting-edge piano technology in our elegant demonstration area. From the revolutionary Novus NV6 hybrid system to our flagship concert grands, witness innovation that respects tradition.',
    image: '/images/namm/general/CA98R_Side_Dynamic.jpg',
    imageAlt: 'Kawai innovative piano technology'
  }
]

/**
 * Booth Experience Section Component
 * Premium dark theme with alternating image/content cards
 */
export default function BoothExperienceSection({
  title = 'The Kawai Booth Experience at NAMM 2026',
  subtitle = 'Where artistry meets innovation. Discover our premium showroom designed to immerse you in over a century of piano craftsmanship.',
  features = DEFAULT_FEATURES
}: BoothExperienceSectionProps) {
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
    <section className={cn(
      'py-24 lg:py-32 relative overflow-hidden',
      // Rich dark gradient base
      'bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-900'
    )}>
      {/* Strong vertical spotlight down center - Main feature */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-800/40 to-zinc-950" />
      </div>

      {/* Top spotlight beam - Stage lighting from above */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[1200px] h-[800px]">
        <div className="absolute inset-0 bg-gradient-radial from-white/20 via-zinc-700/10 to-transparent blur-3xl" />
      </div>

      {/* Center glow enhancement */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[600px]">
        <div className="absolute inset-0 bg-gradient-radial from-zinc-600/25 via-zinc-800/10 to-transparent blur-2xl" />
      </div>

      {/* Diagonal accent beams from corners */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-kawai-red/20 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-amber-500/15 via-transparent to-transparent" />
      </div>

      {/* Geometric light rays - Stage effect */}
      <div className="absolute inset-0 opacity-[0.08]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-white via-white to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -ml-32 w-px h-3/4 bg-gradient-to-b from-transparent via-white/50 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 ml-32 w-px h-3/4 bg-gradient-to-b from-transparent via-white/50 to-transparent" />
      </div>

      {/* Textured overlay for depth */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              white 2px,
              white 3px
            )
          `,
          backgroundSize: '100% 60px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header - Dark theme */}
        <div ref={titleRef} className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1 }}
            className={cn(
              'text-4xl md:text-5xl lg:text-6xl font-light tracking-tight',
              'text-white mb-6'
            )}
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1, delay: 0.2 }}
            className={cn(
              'text-xl lg:text-2xl font-light leading-relaxed',
              'text-stone-300 max-w-4xl mx-auto'
            )}
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Event Details Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1, delay: 0.4 }}
          className={cn(
            'mb-20 p-8 lg:p-12 rounded-2xl',
            'bg-gradient-to-br from-zinc-950/90 via-black to-zinc-950/90',
            'border border-stone-800/50',
            'shadow-2xl shadow-black/50',
            'relative overflow-hidden'
          )}
        >
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-radial from-kawai-red/5 via-transparent to-transparent" />

          <div className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {/* Event Dates */}
              <div>
                <p className="text-sm uppercase tracking-wider text-amber-600/70 mb-3 font-light">
                  Event Dates
                </p>
                <p className="text-2xl lg:text-3xl font-light text-white mb-1">
                  January 22–24, 2026
                </p>
                <p className="text-base text-stone-400 font-light">
                  All Show Hours
                </p>
              </div>

              {/* Location */}
              <div>
                <p className="text-sm uppercase tracking-wider text-amber-600/70 mb-3 font-light">
                  Location
                </p>
                <p className="text-2xl lg:text-3xl font-light text-white mb-1">
                  Anaheim Convention Center
                </p>
                <p className="text-base text-stone-400 font-light">
                  Anaheim, California
                </p>
              </div>

              {/* Booth Information */}
              <div>
                <p className="text-sm uppercase tracking-wider text-amber-600/70 mb-3 font-light">
                  Visit Us
                </p>
                <p className="text-2xl lg:text-3xl font-light text-white mb-1">
                  Booth 9011
                </p>
                <p className="text-base text-stone-400 font-light">
                  Hall B · First Floor
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Grid - Full Width Cards with Alternating Layout */}
        <div className="space-y-12 lg:space-y-16">
          {features.map((feature, index) => (
            <FeatureCard
              key={typeof feature.title === 'string' ? feature.title : index}
              feature={feature}
              index={index}
            />
          ))}
        </div>

        {/* NAMM Logo Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isTitleVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-24 flex justify-center"
        >
          <div className="relative w-full max-w-2xl">
            <Image
              src="/images/namm/NS26_Tag_TMBH_Aligned_White-PSD.png"
              alt="The NAMM Show 2026"
              width={800}
              height={300}
              className="w-full h-auto"
              priority={false}
            />
          </div>
        </motion.div>

        {/* SEO-optimized keywords naturally integrated */}
        <div className="sr-only">
          NAMM 2026, NAMM Show 2026, Kawai booth NAMM 2026, best booths at NAMM,
          piano demonstrations NAMM 2026, live artist performances, hands-on piano demos,
          what to expect at NAMM 2026, piano booth experience, professional piano demonstration,
          Kawai pianos NAMM 2026, NAMM 2026 exhibitors, piano trade show, music exhibition,
          Anaheim Convention Center NAMM, NAMM 2026 piano showcase, hybrid piano demonstrations,
          concert grand piano demos, piano technology showcase, NAMM 2026 performances
        </div>
      </div>
    </section>
  )
}
