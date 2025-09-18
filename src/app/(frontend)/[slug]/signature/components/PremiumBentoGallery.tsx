'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'
import { cn } from '@/lib/utils'

// Enhanced piano model interface with multiple images
interface PianoModel {
  id: string
  name: string
  series: 'GL' | 'GX'
  model: string
  size: 'featured' | 'standard'
  price?: string
  keyFeatures: string[]
  description: string
  image: string
  imageAlt: string
  images: string[]
  layout?: 'side-by-side' | 'large-small' | 'stacked' | 'l-shape' | 'grid' | 'grid-2x2'
}

// Premium button component with Kawai signature styling
interface PremiumButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  size?: 'md' | 'lg'
  className?: string
  onClick?: () => void
  href?: string
}

function PremiumButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  href
}: PremiumButtonProps) {
  const baseStyles = "relative font-medium tracking-wide transition-all duration-500 overflow-hidden group focus:outline-none focus:ring-2 focus:ring-kawai-gold/30 border"

  const variants = {
    primary: "bg-kawai-gold text-kawai-black border-kawai-gold hover:bg-kawai-gold/90 hover:border-kawai-gold/90 shadow-lg hover:shadow-xl",
    secondary: "bg-transparent text-kawai-gold border-kawai-gold/40 hover:bg-kawai-gold/10 hover:border-kawai-gold backdrop-blur-sm"
  }

  const sizes = {
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  }

  const Component = href ? 'a' : 'button'

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Component
        {...(href ? { href } : { onClick })}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
      >
        {/* Golden shimmer effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-kawai-gold/20 to-transparent transition-transform duration-1000"></div>
        <span className="relative z-10">{children}</span>
      </Component>
    </motion.div>
  )
}

// Horizontal scroll piano card component
interface HorizontalPianoCardProps {
  piano: PianoModel
  className?: string
  onClick?: (piano: PianoModel) => void
}

function HorizontalPianoCard({
  piano,
  className = '',
  onClick
}: HorizontalPianoCardProps) {

  // Image layout renderer
  const renderImageLayout = () => {
    const layout = piano.layout || 'side-by-side'

    switch (layout) {
      case 'side-by-side':
        return (
          <div className="grid grid-cols-2 gap-4 h-80">
            {piano.images.slice(0, 2).map((image, index) => (
              <div key={index} className="relative overflow-hidden rounded-lg">
                <Image
                  {...getImagePropsWithFallback(image, '/images/signature/fallback-piano.webp', 'gallery', {
                    fill: true,
                    className: 'object-cover object-center transition-transform duration-700 group-hover:scale-105'
                  })}
                  alt={`${piano.name} view ${index + 1}`}
                />
              </div>
            ))}
          </div>
        )

      case 'large-small':
        return (
          <div className="grid grid-cols-3 gap-4 h-80">
            <div className="col-span-2 relative overflow-hidden rounded-lg">
              <Image
                {...getImagePropsWithFallback(piano.images[0], '/images/signature/fallback-piano.webp', 'gallery', {
                  fill: true,
                  className: 'object-cover object-center transition-transform duration-700 group-hover:scale-105'
                })}
                alt={`${piano.name} main view`}
              />
            </div>
            <div className="relative overflow-hidden rounded-lg">
              <Image
                {...getImagePropsWithFallback(piano.images[1], '/images/signature/fallback-piano.webp', 'gallery', {
                  fill: true,
                  className: 'object-cover object-center transition-transform duration-700 group-hover:scale-105'
                })}
                alt={`${piano.name} detail view`}
              />
            </div>
          </div>
        )

      case 'stacked':
        return (
          <div className="flex flex-col gap-4 h-80">
            <div className="relative flex-1 overflow-hidden rounded-lg">
              <Image
                {...getImagePropsWithFallback(piano.images[0], '/images/signature/fallback-piano.webp', 'gallery', {
                  fill: true,
                  className: 'object-cover object-center transition-transform duration-700 group-hover:scale-105'
                })}
                alt={`${piano.name} main view`}
              />
            </div>
            <div className="relative h-24 overflow-hidden rounded-lg">
              <Image
                {...getImagePropsWithFallback(piano.images[1], '/images/signature/fallback-piano.webp', 'gallery', {
                  fill: true,
                  className: 'object-cover object-center transition-transform duration-700 group-hover:scale-105'
                })}
                alt={`${piano.name} detail view`}
              />
            </div>
          </div>
        )

      case 'l-shape':
        return (
          <div className="grid grid-cols-3 grid-rows-2 gap-4 h-80">
            <div className="col-span-2 row-span-2 relative overflow-hidden rounded-lg">
              <Image
                {...getImagePropsWithFallback(piano.images[0], '/images/signature/fallback-piano.webp', 'gallery', {
                  fill: true,
                  className: 'object-cover object-center transition-transform duration-700 group-hover:scale-105'
                })}
                alt={`${piano.name} main view`}
              />
            </div>
            <div className="relative overflow-hidden rounded-lg">
              <Image
                {...getImagePropsWithFallback(piano.images[1], '/images/signature/fallback-piano.webp', 'gallery', {
                  fill: true,
                  className: 'object-cover object-center transition-transform duration-700 group-hover:scale-105'
                })}
                alt={`${piano.name} detail view`}
              />
            </div>
          </div>
        )

      case 'grid':
        return (
          <div className="grid grid-cols-2 grid-rows-2 gap-4 h-80">
            <div className="col-span-2 relative overflow-hidden rounded-lg">
              <Image
                {...getImagePropsWithFallback(piano.images[0], '/images/signature/fallback-piano.webp', 'gallery', {
                  fill: true,
                  className: 'object-cover object-center transition-transform duration-700 group-hover:scale-105'
                })}
                alt={`${piano.name} main view`}
              />
            </div>
            {piano.images.slice(1, 3).map((image, index) => (
              <div key={index} className="relative overflow-hidden rounded-lg">
                <Image
                  {...getImagePropsWithFallback(image, '/images/signature/fallback-piano.webp', 'gallery', {
                    fill: true,
                    className: 'object-cover object-center transition-transform duration-700 group-hover:scale-105'
                  })}
                  alt={`${piano.name} view ${index + 2}`}
                />
              </div>
            ))}
          </div>
        )

      case 'grid-2x2':
        return (
          <div className="grid grid-cols-2 grid-rows-2 gap-4 h-80">
            {piano.images.slice(0, 4).map((image, index) => (
              <div key={index} className="relative overflow-hidden rounded-lg">
                <Image
                  {...getImagePropsWithFallback(image, '/images/signature/fallback-piano.webp', 'gallery', {
                    fill: true,
                    className: 'object-cover object-center transition-transform duration-700 group-hover:scale-105'
                  })}
                  alt={`${piano.name} view ${index + 1}`}
                />
              </div>
            ))}
          </div>
        )

      default:
        return (
          <div className="relative h-80 overflow-hidden rounded-lg">
            <Image
              {...getImagePropsWithFallback(piano.images[0], '/images/signature/fallback-piano.webp', 'gallery', {
                fill: true,
                className: 'object-cover object-center transition-transform duration-700 group-hover:scale-105'
              })}
              alt={piano.imageAlt}
            />
          </div>
        )
    }
  }

  return (
    <motion.div
      className={cn(
        "flex-shrink-0 w-[600px] sm:w-[700px] md:w-[800px] lg:w-[900px] group cursor-pointer overflow-hidden rounded-xl bg-gradient-to-br from-kawai-black via-gray-900 to-kawai-black border border-kawai-gold/20 hover:border-kawai-gold/40 transition-all duration-500 p-4 sm:p-6",
        className
      )}
      onClick={() => onClick?.(piano)}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Images Section */}
      <div className="mb-6 relative">
        {renderImageLayout()}

        {/* Click to view indicator */}
        <div className="absolute top-4 right-4 bg-kawai-black/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg className="w-5 h-5 text-kawai-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>

        {/* Image count badge */}
        <div className="absolute bottom-4 left-4 bg-kawai-black/80 backdrop-blur-sm rounded-full px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-kawai-gold text-xs font-light">
            {piano.images.length} {piano.images.length === 1 ? 'Image' : 'Images'}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-4">
        <div className="text-kawai-gold text-xs md:text-sm font-light tracking-[0.2em] uppercase border-l-2 border-kawai-gold pl-3">
          {piano.series} Series
        </div>

        <div>
          <h3 className="text-kawai-pearl text-2xl md:text-3xl font-light leading-tight mb-3 group-hover:text-kawai-gold transition-colors duration-300">
            {piano.name}
          </h3>
          <p className="text-kawai-pearl/80 text-base font-light leading-relaxed mb-4">
            {piano.description}
          </p>
        </div>

        {/* Key Features */}
        <div className="flex flex-wrap gap-2">
          {piano.keyFeatures.map((feature, index) => (
            <span
              key={index}
              className="text-xs text-kawai-gold/80 bg-kawai-gold/10 px-3 py-1 rounded-full border border-kawai-gold/20"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// Piano Image Modal Component
interface PianoImageModalProps {
  piano: PianoModel | null
  isOpen: boolean
  onClose: () => void
}

function PianoImageModal({ piano, isOpen, onClose }: PianoImageModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && currentImageIndex > 0) setCurrentImageIndex(currentImageIndex - 1)
      if (e.key === 'ArrowRight' && piano && currentImageIndex < piano.images.length - 1) setCurrentImageIndex(currentImageIndex + 1)
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, currentImageIndex, onClose, piano])

  useEffect(() => {
    if (isOpen) setCurrentImageIndex(0)
  }, [isOpen, piano])

  if (!isOpen || !piano) return null

  const currentImage = piano.images[currentImageIndex]

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-kawai-black/95 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 flex flex-col p-4 md:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="text-kawai-gold text-sm font-light tracking-[0.2em] uppercase mb-2">
              {piano.series} Series
            </div>
            <h2 className="text-2xl md:text-3xl text-kawai-pearl font-light">
              {piano.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-kawai-gold/40 bg-kawai-gold/10 hover:bg-kawai-gold/20 text-kawai-gold transition-colors duration-300"
          >
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6">
          {/* Main Image */}
          <div className="flex-1 relative bg-gradient-to-br from-kawai-black via-gray-900 to-kawai-black rounded-xl overflow-hidden">
            <Image
              {...getImagePropsWithFallback(currentImage, '/images/signature/fallback-piano.webp', 'hero', {
                fill: true,
                className: 'object-contain'
              })}
              alt={`${piano.name} - Image ${currentImageIndex + 1}`}
              onClick={(e) => e.stopPropagation()}
            />

            {/* Navigation Arrows */}
            {piano.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (currentImageIndex > 0) setCurrentImageIndex(currentImageIndex - 1)
                  }}
                  disabled={currentImageIndex === 0}
                  className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-kawai-gold/40 backdrop-blur-sm transition-all duration-300",
                    currentImageIndex > 0
                      ? "bg-kawai-gold/10 hover:bg-kawai-gold/20 text-kawai-gold"
                      : "bg-kawai-black/20 text-kawai-pearl/30 cursor-not-allowed"
                  )}
                >
                  <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (currentImageIndex < piano.images.length - 1) setCurrentImageIndex(currentImageIndex + 1)
                  }}
                  disabled={currentImageIndex === piano.images.length - 1}
                  className={cn(
                    "absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-kawai-gold/40 backdrop-blur-sm transition-all duration-300",
                    currentImageIndex < piano.images.length - 1
                      ? "bg-kawai-gold/10 hover:bg-kawai-gold/20 text-kawai-gold"
                      : "bg-kawai-black/20 text-kawai-pearl/30 cursor-not-allowed"
                  )}
                >
                  <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 space-y-6" onClick={(e) => e.stopPropagation()}>
            {/* Thumbnails */}
            {piano.images.length > 1 && (
              <div className="space-y-4">
                <h3 className="text-kawai-pearl text-lg font-light">All Views</h3>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                  {piano.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={cn(
                        "relative aspect-video rounded-lg overflow-hidden border-2 transition-all duration-300",
                        currentImageIndex === index
                          ? "border-kawai-gold"
                          : "border-kawai-gold/20 hover:border-kawai-gold/40"
                      )}
                    >
                      <Image
                        {...getImagePropsWithFallback(image, '/images/signature/fallback-piano.webp', 'thumbnail', {
                          fill: true,
                          className: 'object-cover'
                        })}
                        alt={`${piano.name} thumbnail ${index + 1}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Piano Details */}
            <div className="space-y-4">
              <h3 className="text-kawai-pearl text-lg font-light">About This Piano</h3>
              <p className="text-kawai-pearl/80 text-sm leading-relaxed">
                {piano.description}
              </p>

              {/* Key Features */}
              <div>
                <h4 className="text-kawai-pearl text-base font-light mb-3">Key Features</h4>
                <div className="space-y-2">
                  {piano.keyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-kawai-gold"></div>
                      <span className="text-kawai-pearl/80 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Counter */}
        {piano.images.length > 1 && (
          <div className="text-center mt-4">
            <span className="text-kawai-pearl/60 text-sm">
              {currentImageIndex + 1} of {piano.images.length}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Main Horizontal Scroll Piano Gallery Component
export function HorizontalScrollPianoGallery() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [selectedPiano, setSelectedPiano] = useState<PianoModel | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  // Enhanced piano model data with multiple images
  const pianoModels: PianoModel[] = [
    {
      id: 'gx-3',
      name: 'GX-3 Baby Grand',
      series: 'GX',
      model: 'GX-3',
      size: 'featured',
      price: 'Starting at $55,000',
      keyFeatures: ['Concert Hall Touch', 'Premium Soundboard', 'Hand-Crafted Action'],
      description: 'Our flagship baby grand piano featuring the renowned Millennium III action and premium tonal woods. Hand-selected by master craftsmen for unparalleled musical expression.',
      image: '/images/signature/pianos/gx-3/gx-3-hero.webp',
      imageAlt: 'Kawai GX-3 baby grand piano in elegant finish',
      images: [
        '/images/signature/pianos/gx-3/gx-3-hero.webp',
        '/images/signature/pianos/gx-3/gx-3-secondary.webp'
      ],
      layout: 'side-by-side'
    },
    {
      id: 'gl-50',
      name: 'GL-50 Baby Grand',
      series: 'GL',
      model: 'GL-50',
      size: 'standard',
      price: 'Starting at $42,000',
      keyFeatures: ['Extended Length', 'Rich Resonance', 'Professional Touch'],
      description: 'The largest in our GL series, offering exceptional depth and projection. Perfect for serious pianists seeking professional-grade performance in a home setting.',
      image: '/images/signature/pianos/gl-50/gl-50-hero.webp',
      imageAlt: 'Kawai GL-50 baby grand piano showcasing elegant curves',
      images: [
        '/images/signature/pianos/gl-50/gl-50-hero.webp',
        '/images/signature/pianos/gl-50/gl-50-secondary.webp'
      ],
      layout: 'large-small'
    },
    {
      id: 'gx-1',
      name: 'GX-1 Baby Grand',
      series: 'GX',
      model: 'GX-1',
      size: 'standard',
      price: 'Starting at $38,000',
      keyFeatures: ['Compact Elegance', 'Premium Components', 'Concert Lineage'],
      description: 'Entry into our prestigious GX series. Inherits the DNA of our concert grands while fitting elegantly in intimate spaces.',
      image: '/images/signature/pianos/gx-1/gx-1-hero.webp',
      imageAlt: 'Kawai GX-1 baby grand piano in studio setting',
      images: [
        '/images/signature/pianos/gx-1/gx-1-hero.webp',
        '/images/signature/pianos/gx-1/gx-1-secondary.webp'
      ],
      layout: 'stacked'
    },
    {
      id: 'gl-30',
      name: 'GL-30 Baby Grand',
      series: 'GL',
      model: 'GL-30',
      size: 'standard',
      price: 'Starting at $32,000',
      keyFeatures: ['Balanced Design', 'Clear Tone', 'Responsive Touch'],
      description: 'Mid-size elegance with exceptional clarity. Offers the perfect balance of power and control for advancing pianists.',
      image: '/images/signature/pianos/gl-30/gl-30-hero.webp',
      imageAlt: 'Kawai GL-30 baby grand piano highlighting craftsmanship',
      images: [
        '/images/signature/pianos/gl-30/gl-30-hero.webp',
        '/images/signature/pianos/gl-30/gl-30-secondary.webp'
      ],
      layout: 'l-shape'
    },
    {
      id: 'gx-2',
      name: 'GX-2 Baby Grand',
      series: 'GX',
      model: 'GX-2',
      size: 'standard',
      price: 'Starting at $45,000',
      keyFeatures: ['Extended Soundboard', 'Enhanced Projection', 'Premium Action'],
      description: 'Mid-tier GX excellence with extended soundboard for enhanced resonance. Bridges the gap between intimate and concert-level performance.',
      image: '/images/signature/pianos/gx-2/gx-2-hero.webp',
      imageAlt: 'Kawai GX-2 baby grand piano demonstrating elegant proportions',
      images: [
        '/images/signature/pianos/gx-2/gx-2-hero.webp',
        '/images/signature/pianos/gx-2/gx-2-secondary.webp',
        '/images/signature/pianos/gx-2/gx-2-detail.webp'
      ],
      layout: 'grid'
    },
    {
      id: 'gl-10',
      name: 'GL-10 Baby Grand',
      series: 'GL',
      model: 'GL-10',
      size: 'standard',
      price: 'Starting at $28,000',
      keyFeatures: ['Compact Form', 'Pure Tone', 'Accessible Luxury'],
      description: 'Compact baby grand without compromise. Delivers the authentic grand piano experience in spaces where every inch matters.',
      image: '/images/signature/pianos/gl-10/gl-10-hero.webp',
      imageAlt: 'Kawai GL-10 baby grand piano perfect for smaller spaces',
      images: [
        '/images/signature/pianos/gl-10/gl-10-hero.webp',
        '/images/signature/pianos/gl-10/gl-10-secondary.webp',
        '/images/signature/pianos/gl-10/gl-10-detail.webp'
      ],
      layout: 'grid-2x2'
    }
  ]

  // Scroll navigation functions
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -900, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 900, behavior: 'smooth' })
    }
  }

  // Check scroll boundaries
  const checkScrollBoundaries = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  // Handle scroll events
  const handleScroll = () => {
    checkScrollBoundaries()
  }

  const handlePianoClick = (piano: PianoModel) => {
    // Track interaction for analytics (if needed)
    // gtag?.('event', 'piano_card_click', { piano_id: piano.id, model: piano.model })

    // Open image modal
    setSelectedPiano(piano)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedPiano(null)
  }

  const handleCtaClick = () => {
    // Scroll to assessment section
    const assessmentSection = document.getElementById('signature-experience')
    if (assessmentSection) {
      assessmentSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Initialize scroll boundaries on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      checkScrollBoundaries()
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      id="premium-bento-gallery"
      ref={containerRef}
      className="relative py-20 md:py-32 bg-gradient-to-b from-kawai-black via-gray-900 to-kawai-black overflow-hidden"
    >
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-kawai-gold/10 via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <motion.div
          className="text-center max-w-4xl mx-auto mb-16 md:mb-20"
          style={{ y, opacity }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-block text-kawai-gold text-sm font-light tracking-[0.3em] uppercase mb-4 border border-kawai-gold/30 px-4 py-2 rounded-full backdrop-blur-sm">
            Signature Selection
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-kawai-pearl leading-tight mb-6">
            Our Curated{' '}
            <span className="text-kawai-gold font-normal">Signature Collection</span>
            {' '}of Baby Grands
          </h2>

          <p className="text-lg md:text-xl text-kawai-pearl/80 font-light leading-relaxed max-w-3xl mx-auto mb-8">
            Six exceptional baby grand pianos, each representing the pinnacle of Japanese craftsmanship and tonal excellence.
            From the intimate GL-10 to our flagship GX-3, discover the instrument that will elevate your musical journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <PremiumButton
              variant="primary"
              size="lg"
              onClick={handleCtaClick}
            >
              Find Your Perfect Signature Selection
            </PremiumButton>
            <PremiumButton
              variant="secondary"
              size="lg"
              onClick={handleCtaClick}
            >
              Reserve Private Assessment
            </PremiumButton>
          </div>
        </motion.div>

        {/* Horizontal Scroll Gallery */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {/* Navigation Arrows */}
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-kawai-gold/40 backdrop-blur-sm transition-all duration-300",
              canScrollLeft
                ? "bg-kawai-gold/10 hover:bg-kawai-gold/20 text-kawai-gold"
                : "bg-kawai-black/20 text-kawai-pearl/30 cursor-not-allowed"
            )}
          >
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-kawai-gold/40 backdrop-blur-sm transition-all duration-300",
              canScrollRight
                ? "bg-kawai-gold/10 hover:bg-kawai-gold/20 text-kawai-gold"
                : "bg-kawai-black/20 text-kawai-pearl/30 cursor-not-allowed"
            )}
          >
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto scrollbar-hide pb-4 px-16"
            onScroll={handleScroll}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            } as React.CSSProperties}
          >
            {pianoModels.map((piano, index) => (
              <motion.div
                key={piano.id}
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <HorizontalPianoCard
                  piano={piano}
                  onClick={handlePianoClick}
                />
              </motion.div>
            ))}
          </div>

          {/* Scroll Indicators */}
          <div className="flex justify-center mt-8 gap-2">
            {pianoModels.map((_, index) => (
              <button
                key={index}
                className="w-2 h-2 rounded-full bg-kawai-gold/30 hover:bg-kawai-gold/60 transition-colors duration-300"
                onClick={() => {
                  if (scrollRef.current) {
                    scrollRef.current.scrollTo({
                      left: index * 920, // card width + gap
                      behavior: 'smooth'
                    })
                  }
                }}
              />
            ))}
          </div>
        </motion.div>

      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-kawai-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-kawai-gold/5 rounded-full blur-3xl" />

      {/* Piano Image Modal */}
      <PianoImageModal
        piano={selectedPiano}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  )
}

// Export the new component and keep backward compatibility
export { HorizontalScrollPianoGallery as PremiumBentoGallery }