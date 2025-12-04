'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

/**
 * Booth experience feature interface
 */
export interface BoothFeature {
  icon: string
  title: string
  description: string
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
 * Individual feature card component with scroll animation
 */
function FeatureCard({ feature, index }: { feature: BoothFeature; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

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
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: 'easeOut'
      }}
      className="group h-full"
    >
      <div className={cn(
        'h-full p-8 rounded-xl',
        'bg-gradient-to-br from-amber-50 to-orange-50',
        'hover:bg-white hover:shadow-xl',
        'transition-all duration-500 ease-out',
        'border border-transparent hover:border-gray-200',
        'flex flex-col items-start'
      )}>
        {/* Icon */}
        <div className={cn(
          'text-5xl mb-6',
          'group-hover:scale-110 transition-transform duration-300'
        )}>
          {feature.icon}
        </div>

        {/* Title */}
        <h3 className={cn(
          'text-xl md:text-2xl font-bold text-gray-900 mb-3',
          'group-hover:text-red-600 transition-colors duration-300'
        )}>
          {feature.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed text-base">
          {feature.description}
        </p>
      </div>
    </motion.div>
  )
}

/**
 * Default booth experience features for NAMM 2026
 * This will be replaced with CMS data in future integration
 */
const DEFAULT_FEATURES: BoothFeature[] = [
  {
    icon: '🎹',
    title: 'Hands-On Piano Demos',
    description: 'Try every piano in our lineup. From concert grands to digital pianos, experience the full range of Kawai craftsmanship and innovation with unlimited access to all instruments.'
  },
  {
    icon: '🎤',
    title: 'Live Artist Performances',
    description: 'Watch renowned pianists perform throughout the day. Experience the expressive power of Kawai pianos through captivating performances scheduled every hour during show hours.'
  },
  {
    icon: '👥',
    title: 'Meet the Experts',
    description: 'Talk directly with Kawai product specialists and Master Piano Artisans. Get answers to your questions, learn about our manufacturing process, and discover what makes Kawai pianos exceptional.'
  },
  {
    icon: '🔬',
    title: 'Technology Showcase',
    description: 'Explore the revolutionary PentaDrive™ hybrid system up close. See detailed cutaway displays and interactive exhibits demonstrating our latest innovations in piano technology.'
  },
  {
    icon: '📸',
    title: 'Photo Opportunities',
    description: 'Capture memories at our Instagram-worthy booth featuring the stunning SK-EX Concert Grand. Share your NAMM experience with custom backdrops and professional lighting.'
  },
  {
    icon: '🎁',
    title: 'Exclusive Offers',
    description: 'Take advantage of NAMM attendee-only promotions and special pricing. Speak with our sales team about exclusive show specials available only to trade show visitors.'
  }
]

/**
 * Booth Experience Section Component
 * Communicates why visitors should prioritize the Kawai booth at NAMM 2026
 */
export default function BoothExperienceSection({
  title = 'Why Visit the Kawai Booth?',
  subtitle = 'More than just pianos - experience the future of musical innovation',
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
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className={cn(
              'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight',
              'text-gray-900 mb-6'
            )}
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={cn(
              'text-xl md:text-2xl leading-relaxed',
              'text-gray-600 max-w-3xl mx-auto'
            )}
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className={cn(
          'grid gap-6 md:gap-8',
          'grid-cols-1',
          'md:grid-cols-2',
          'lg:grid-cols-3'
        )}>
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              index={index}
            />
          ))}
        </div>

        {/* Call to Action Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isTitleVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className={cn(
            'mt-16 p-8 md:p-12 rounded-2xl',
            'bg-gradient-to-r from-gray-900 to-gray-800',
            'text-center'
          )}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Join Us at NAMM 2026
          </h3>
          <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
            Visit Booth #1234 to experience the perfect blend of tradition and innovation.
            Our team is ready to welcome you to the world of Kawai.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="text-white">
              <p className="text-sm uppercase tracking-wide text-gray-400 mb-1">Location</p>
              <p className="text-xl font-semibold">Anaheim Convention Center - Hall B</p>
            </div>
            <div className="hidden sm:block w-px bg-gray-600" />
            <div className="text-white">
              <p className="text-sm uppercase tracking-wide text-gray-400 mb-1">Dates</p>
              <p className="text-xl font-semibold">January 22-24, 2026</p>
            </div>
          </div>
        </motion.div>

        {/* SEO-optimized keywords naturally integrated */}
        <div className="sr-only">
          NAMM 2026 booth, piano demonstration, live performance, piano showcase, trade show,
          music exhibition, piano technology, hybrid piano, concert grand, digital piano,
          Kawai booth, NAMM Show 2026, Anaheim Convention Center, piano exhibition booth,
          music industry event, piano trade show, professional piano demonstration
        </div>
      </div>
    </section>
  )
}
