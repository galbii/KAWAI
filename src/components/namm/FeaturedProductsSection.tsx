'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

/**
 * Product card props for future CMS integration
 */
export interface ProductCardProps {
  name: string
  category: string
  description: string
  features: string[]
  imageUrl: string
  productPageSlug: string
}

/**
 * Featured Products Section props
 */
interface FeaturedProductsSectionProps {
  title?: string
  subtitle?: string
  products?: ProductCardProps[]
}

/**
 * Individual product card component with hover effects
 */
function ProductCard({ product, index }: { product: ProductCardProps; index: number }) {
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
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: 'easeOut'
      }}
      className="group h-full"
    >
      <div className={cn(
        'h-full bg-white rounded-xl overflow-hidden shadow-md',
        'hover:shadow-2xl hover:-translate-y-2',
        'transition-all duration-500 ease-out',
        'flex flex-col'
      )}>
        {/* Product Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={cn(
              'object-cover',
              'group-hover:scale-110 transition-transform duration-700 ease-out'
            )}
            loading="lazy"
          />

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className={cn(
              'inline-block px-3 py-1.5 rounded-full text-xs font-semibold',
              'bg-black/80 text-white backdrop-blur-sm'
            )}>
              {product.category}
            </span>
          </div>
        </div>

        {/* Product Content */}
        <div className="flex flex-col flex-1 p-6 space-y-4">
          {/* Product Name */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
              {product.name}
            </h3>
            <p className="text-gray-600 leading-relaxed line-clamp-3">
              {product.description}
            </p>
          </div>

          {/* Key Features */}
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
              Key Features
            </h4>
            <ul className="space-y-2">
              {product.features.slice(0, 3).map((feature, idx) => (
                <li key={idx} className="flex items-start text-sm text-gray-700">
                  <span className={cn(
                    'w-1.5 h-1.5 rounded-full bg-red-600 mr-2.5 mt-2 flex-shrink-0'
                  )} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Button */}
          <div className="pt-4 border-t border-gray-100">
            <Button
              asChild
              variant="default"
              size="lg"
              className={cn(
                'w-full bg-gray-900 hover:bg-gray-800 text-white',
                'group/btn transition-all duration-300'
              )}
            >
              <Link href={`/products/${product.productPageSlug}`}>
                <span>Learn More</span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Default product data for NAMM 2026
 * This will be replaced with CMS data in future integration
 */
const DEFAULT_PRODUCTS: ProductCardProps[] = [
  {
    name: 'Shigeru Kawai SK-EX Concert Grand',
    category: 'Concert Grand Piano',
    description: 'The pinnacle of piano craftsmanship. Handcrafted in Japan by Master Piano Artisans, the SK-EX delivers unparalleled tonal richness and expressive power for the world\'s most demanding performers.',
    features: [
      'Millennium III carbon fiber reinforced action',
      'Extended key length for enhanced control',
      'Premium spruce soundboard for superior resonance'
    ],
    imageUrl: '/images/placeholders/piano-grand.jpg',
    productPageSlug: 'sk-ex'
  },
  {
    name: 'Novus NV6 Hybrid Piano',
    category: 'Hybrid Piano',
    description: 'Experience the revolutionary hybrid piano that seamlessly blends acoustic piano touch with digital versatility. The NV6 features a real grand piano action with our groundbreaking PentaDrive™ Hybrid Technology.',
    features: [
      'PentaDrive™ 5-sensor hybrid action system',
      'SK-EX Concert Grand piano sampling',
      'Real acoustic hammer action with no strings'
    ],
    imageUrl: '/images/placeholders/piano-hybrid.jpg',
    productPageSlug: 'nv6'
  },
  {
    name: 'Novus NV12 Hybrid Piano',
    category: 'Hybrid Piano',
    description: 'Our flagship hybrid piano in a stunning upright cabinet. The NV12 combines the authentic touch of a grand piano with the convenience and versatility of digital technology, creating a truly unique musical experience.',
    features: [
      'Grand Feel III wooden-key action',
      'Advanced speaker system with 8 speakers',
      'Virtual Technician for personalized tone shaping'
    ],
    imageUrl: '/images/placeholders/piano-upright-hybrid.jpg',
    productPageSlug: 'nv12'
  },
  {
    name: 'CA99 Digital Piano',
    category: 'Digital Piano',
    description: 'The flagship of our Concert Artist series delivers concert-level performance in a sophisticated digital instrument. With Grand Feel III action and class-leading sound technology, the CA99 sets new standards for digital pianos.',
    features: [
      'Grand Feel III wooden-key keyboard action',
      'SK-EX, EX, and Shigeru SK-5 piano sounds',
      'Integrated Bluetooth® MIDI and Audio'
    ],
    imageUrl: '/images/placeholders/piano-digital.jpg',
    productPageSlug: 'ca99'
  }
]

/**
 * Featured Products Section Component
 * Showcases key pianos at NAMM 2026 with conversion-focused design
 */
export default function FeaturedProductsSection({
  title = 'Featured Pianos at NAMM 2026',
  subtitle = 'Be among the first to experience our latest innovations in acoustic, hybrid, and digital piano technology',
  products = DEFAULT_PRODUCTS
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
    <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50">
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
              'text-gray-600 max-w-4xl mx-auto'
            )}
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Products Grid */}
        <div className={cn(
          'grid gap-8',
          'grid-cols-1',
          'md:grid-cols-2',
          'lg:grid-cols-4'
        )}>
          {products.map((product, index) => (
            <ProductCard
              key={product.productPageSlug}
              product={product}
              index={index}
            />
          ))}
        </div>

        {/* SEO-optimized keywords naturally integrated */}
        <div className="sr-only">
          NAMM 2026, NAMM Show, piano exhibition, concert grand piano, hybrid piano technology,
          digital piano innovation, Shigeru Kawai, PentaDrive hybrid system, Grand Feel action,
          piano demonstration, piano showcase, professional piano, premium piano, acoustic piano,
          piano technology
        </div>
      </div>
    </section>
  )
}
