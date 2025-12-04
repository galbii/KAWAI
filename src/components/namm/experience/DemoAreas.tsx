'use client'

/**
 * Demo Areas Section
 * Showcases the different product demonstration zones at the booth
 */

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface DemoArea {
  title: string
  description: string
  products: string[]
  imagePath: string
  features: string[]
}

const DEMO_AREAS: DemoArea[] = [
  {
    title: 'Concert Grand Experience',
    description:
      'Experience the pinnacle of piano craftsmanship with our flagship Shigeru Kawai concert grands. Feel the responsive touch and rich tonal palette that professional pianists trust worldwide.',
    products: ['Shigeru Kawai SK-EX', 'Shigeru Kawai SK-7', 'Shigeru Kawai SK-5'],
    imagePath: '/images/namm/general/_MG_7325.jpg',
    features: ['Professional-grade touch', 'Concert hall sound', 'Hand-crafted excellence'],
  },
  {
    title: 'Hybrid Innovation Zone',
    description:
      'Discover the revolutionary Novus NV6 & NV12 hybrid pianos. The perfect marriage of acoustic grand piano action with digital versatility, featuring the breakthrough PentaDrive™ system.',
    products: ['Novus NV6', 'Novus NV12', 'Aures Series'],
    imagePath: '/images/namm/general/TK7_7390.jpg',
    features: ['PentaDrive™ technology', 'Acoustic + Digital', 'Silent practice mode'],
  },
  {
    title: 'Digital Piano Showcase',
    description:
      'Explore our complete range of digital pianos, from the professional CA series to portable models. Advanced sound sampling and responsive key action in modern, elegant designs.',
    products: ['CA Series', 'ES Series', 'KDP Series', 'MP Series'],
    imagePath: '/images/namm/general/CA98R_Side_Dynamic.jpg',
    features: ['Authentic grand piano sound', 'Bluetooth connectivity', 'Versatile features'],
  },
  {
    title: 'Acoustic Grand Collection',
    description:
      'Experience traditional craftsmanship with our renowned K and GL series grand pianos. These instruments represent decades of piano-making excellence for home and professional use.',
    products: ['K Series', 'GL Series', 'GX Series'],
    imagePath: '/images/namm/general/KAWAI_K_Serie_Detail-33(1).jpg',
    features: ['Traditional craftsmanship', 'Millennium III action', 'Superior tone'],
  },
]

function DemoAreaCard({ area, index }: { area: DemoArea; index: number }) {
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

  const isEven = index % 2 === 0

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay: index * 0.2, ease: 'easeOut' }}
      className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
    >
      {/* Image */}
      <div className={cn('relative h-80 md:h-96 rounded-2xl overflow-hidden', isEven ? 'md:order-1' : 'md:order-2')}>
        <Image
          src={area.imagePath}
          alt={area.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className={cn('space-y-6', isEven ? 'md:order-2' : 'md:order-1')}>
        <div>
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">{area.title}</h3>
          <p className="text-lg text-white/80 leading-relaxed">{area.description}</p>
        </div>

        {/* Products List */}
        <div>
          <p className="text-sm uppercase tracking-wider text-white/60 mb-3">Featured Products</p>
          <div className="flex flex-wrap gap-2">
            {area.products.map((product) => (
              <span
                key={product}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm"
              >
                {product}
              </span>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-3">
          {area.features.map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-[#C41E3A]">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-white/90 text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function DemoAreas() {
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
    <section className="py-20 md:py-28 bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6"
          >
            <span className="w-2 h-2 bg-[#C41E3A] rounded-full" />
            <span className="text-white font-semibold text-sm uppercase tracking-wide">
              Demonstration Zones
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6"
          >
            Explore Four Unique
            <span className="block text-[#C41E3A]">Piano Experiences</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl leading-relaxed text-white/80 max-w-3xl mx-auto"
          >
            Each demonstration area is carefully designed to showcase the unique characteristics of
            our piano collections
          </motion.p>
        </div>

        {/* Demo Areas */}
        <div className="space-y-24">
          {DEMO_AREAS.map((area, index) => (
            <DemoAreaCard key={area.title} area={area} index={index} />
          ))}
        </div>

        {/* Bottom Info Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isTitleVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 p-8 md:p-12 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-2xl text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            All Pianos Available for Hands-On Trial
          </h3>
          <p className="text-lg text-white/70 mb-6 max-w-2xl mx-auto">
            No appointment necessary. Our product specialists are on hand throughout the show to
            answer questions and provide personalized demonstrations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="inline-flex items-center gap-2 text-[#C41E3A]">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-white font-semibold">Walk-ins welcome</span>
            </div>
            <div className="inline-flex items-center gap-2 text-[#C41E3A]">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-white font-semibold">Expert guidance available</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
