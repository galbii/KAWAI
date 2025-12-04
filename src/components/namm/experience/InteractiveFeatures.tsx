'use client'

/**
 * Interactive Features Section
 * Showcases the unique interactive elements of the Kawai booth
 */

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface Feature {
  icon: string
  title: string
  description: string
  highlight: string
}

const FEATURES: Feature[] = [
  {
    icon: '🎹',
    title: 'Try Every Piano',
    description:
      'Experience unlimited access to our complete lineup. From concert grands to digital pianos, every instrument is available for hands-on exploration.',
    highlight: 'No appointment needed',
  },
  {
    icon: '🎤',
    title: 'Live Performances',
    description:
      'Watch renowned pianists perform hourly demonstrations. Experience the expressive power and tonal range of Kawai instruments through professional artistry.',
    highlight: 'Hourly performances',
  },
  {
    icon: '🔬',
    title: 'Technology Deep Dive',
    description:
      'Explore cutaway displays of our revolutionary PentaDrive™ hybrid system. See the innovation that bridges acoustic and digital piano technology.',
    highlight: 'Interactive exhibits',
  },
]

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.2, ease: 'easeOut' }}
      className="group h-full"
    >
      <div
        className={cn(
          'h-full p-8 md:p-10 rounded-2xl',
          'bg-white border border-gray-200',
          'hover:shadow-2xl hover:border-[#C41E3A]/30',
          'transition-all duration-500 ease-out',
          'flex flex-col'
        )}
      >
        {/* Icon */}
        <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
          {feature.icon}
        </div>

        {/* Title */}
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-[#C41E3A] transition-colors duration-300">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed text-base md:text-lg mb-6 flex-grow">
          {feature.description}
        </p>

        {/* Highlight Badge */}
        <div className="inline-flex items-center gap-2 text-[#C41E3A] font-semibold text-sm">
          <span className="w-2 h-2 bg-[#C41E3A] rounded-full animate-pulse" />
          {feature.highlight}
        </div>
      </div>
    </motion.div>
  )
}

export default function InteractiveFeatures() {
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
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#C41E3A]/10 rounded-full mb-6"
          >
            <span className="w-2 h-2 bg-[#C41E3A] rounded-full" />
            <span className="text-[#C41E3A] font-semibold text-sm uppercase tracking-wide">
              Interactive Experience
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6"
          >
            What Makes Our Booth
            <span className="block text-[#C41E3A]">Unforgettable</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl leading-relaxed text-gray-600 max-w-3xl mx-auto"
          >
            More than just a showcase—an immersive journey through piano innovation
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isTitleVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col md:flex-row items-center gap-4 p-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl">
            <div className="text-left">
              <p className="text-lg font-semibold text-gray-900 mb-1">
                Want the full booth experience?
              </p>
              <p className="text-gray-600">Check out our virtual booth tour below</p>
            </div>
            <button
              onClick={() => {
                const section = document.querySelector('#booth-tour')
                section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className="px-8 py-3 bg-gradient-to-r from-[#E31937] to-[#FF3B55] text-white font-semibold rounded-md
                         hover:shadow-lg transition-all duration-300 hover:scale-105 whitespace-nowrap"
            >
              Virtual Tour
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
