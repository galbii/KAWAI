'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'
import { useSignatureExperience } from './SignatureExperienceContext'
import { cn } from '@/lib/utils'

// GL-10 Selling Point Card Interface
interface GL10SellingPoint {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  imageAlt: string
  badge?: string
  icon?: string
  features?: string[]
  priority?: boolean
}

// YouTube Video Modal Component
interface YouTubeVideoModalProps {
  isOpen: boolean
  onClose: () => void
  videoId: string
  title?: string
}

function YouTubeVideoModal({ isOpen, onClose, videoId, title = 'Video' }: YouTubeVideoModalProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  // Reset video loaded state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setIsVideoLoaded(false)
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-4xl bg-kawai-black rounded-2xl shadow-2xl overflow-hidden border border-kawai-gold/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-kawai-gold/20">
              <h3 className="text-xl font-light text-kawai-pearl">{title}</h3>
              <button
                onClick={onClose}
                className="text-kawai-pearl/60 hover:text-kawai-pearl transition-colors duration-200 p-2 hover:bg-kawai-gold/10 rounded-full"
                aria-label="Close video"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Video Container */}
            <div className="relative aspect-video bg-kawai-black">
              {!isVideoLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex space-x-2">
                    <motion.div
                      className="w-3 h-3 bg-kawai-gold rounded-full"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className="w-3 h-3 bg-kawai-gold rounded-full"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                    />
                    <motion.div
                      className="w-3 h-3 bg-kawai-gold rounded-full"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                    />
                  </div>
                </div>
              )}
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                onLoad={() => setIsVideoLoaded(true)}
              />
            </div>

            {/* Footer with additional info */}
            <div className="p-4 bg-gradient-to-r from-kawai-black via-gray-900 to-kawai-black border-t border-kawai-gold/10">
              <p className="text-kawai-pearl/60 text-sm text-center">
                Discover the exceptional craftsmanship of our signature piano collection
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
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
    <div className="transform transition-all duration-200 hover:scale-105">
      <Component
        {...(href ? { href } : { onClick })}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
      >
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-kawai-gold/20 to-transparent transition-transform duration-1000"></div>
        <span className="relative z-10">{children}</span>
      </Component>
    </div>
  )
}

// Single Selling Point Card Component
interface SellingPointCardProps {
  sellingPoint: GL10SellingPoint
  className?: string
  index: number
}

function SellingPointCard({
  sellingPoint,
  className = '',
  index
}: SellingPointCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, index * 100)
    return () => clearTimeout(timer)
  }, [index])

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-gradient-to-br from-kawai-black via-gray-900 to-kawai-black border border-kawai-gold/20 hover:border-kawai-gold/40 transition-all duration-300 h-[500px]",
        "transform transition-opacity duration-500",
        isVisible ? "opacity-100" : "opacity-0",
        className
      )}
    >
      {/* Main Image */}
      <div className="relative h-[60%] overflow-hidden">
        <Image
          {...getImagePropsWithFallback(
            sellingPoint.image,
            '/images/signature/fallback-piano.webp',
            'gallery',
            {
              fill: true,
              className: 'object-cover object-center transition-transform duration-700 group-hover:scale-110',
              ...(sellingPoint.priority !== undefined && { priority: sellingPoint.priority })
            }
          )}
          alt={sellingPoint.imageAlt}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Image overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-kawai-black/80 via-kawai-black/20 to-transparent" />

        {/* Badge */}
        {sellingPoint.badge && (
          <div className="absolute top-4 left-4 bg-kawai-gold/90 text-kawai-black px-3 py-1 rounded-full text-xs font-medium tracking-wide">
            {sellingPoint.badge}
          </div>
        )}


        {/* Loading placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-kawai-black via-gray-800 to-kawai-black animate-pulse" />
        )}
      </div>

      {/* Content Section */}
      <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
        <div className="space-y-2">
          <div className="text-kawai-gold text-xs font-light tracking-[0.2em] uppercase">
            {sellingPoint.subtitle}
          </div>
          <h3 className="text-kawai-pearl text-xl font-light leading-tight group-hover:text-kawai-gold transition-colors duration-300">
            {sellingPoint.title}
          </h3>
        </div>

        <p className="text-kawai-pearl/80 text-sm font-light leading-relaxed line-clamp-3">
          {sellingPoint.description}
        </p>

        {/* Features list */}
        {sellingPoint.features && (
          <div className="flex flex-wrap gap-2 pt-2">
            {sellingPoint.features.slice(0, 3).map((feature, idx) => (
              <span
                key={idx}
                className="text-xs text-kawai-gold/80 bg-kawai-gold/10 px-2 py-1 rounded-full border border-kawai-gold/20"
              >
                {feature}
              </span>
            ))}
          </div>
        )}

      </div>

      {/* Subtle golden glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-kawai-gold/5 via-transparent to-kawai-gold/5" />
      </div>
    </div>
  )
}

// Main GL-10 Bento Gallery Component
export function PremiumBentoGallery() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Video modal state
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  // Get modal opening function from context
  const { openAssessmentModal } = useSignatureExperience()

  // GL-10 Selling Points Data
  const gl10SellingPoints: GL10SellingPoint[] = [
    {
      id: 'award-winning',
      title: 'Industry Award Winner',
      subtitle: 'Recognition',
      description: 'MMR Magazine\'s "2016 Product of the Year" - the highest award any instrument in the global music products industry can receive.',
      image: '/images/signature/pianos/gl-10/gl-10-hero.webp',
      imageAlt: 'Kawai GL-10 baby grand piano - award-winning design and craftsmanship',
      badge: 'Award Winner',
      features: ['MMR 2016 Product of Year', 'Industry Recognition', 'Global Excellence'],
      priority: true
    },
    {
      id: 'space-efficiency',
      title: 'Perfect for Any Home',
      subtitle: 'Space Efficiency',
      description: 'At 5\'0" in length, the GL-10 delivers authentic grand piano experience in spaces where every inch matters, without sacrificing musical quality.',
      image: '/images/signature/pianos/gl-10/gl-10-detail.webp',
      imageAlt: 'GL-10 baby grand piano fitting perfectly in elegant home setting with premium craftsmanship',
      features: ['5\'0" Length', 'Compact Design', 'Home-Friendly']
    },
    {
      id: 'luxury-features',
      title: 'Luxury Safety Features',
      subtitle: 'Premium Details',
      description: 'Soft-closing lid and fallboard prevent trapped fingers while adding a luxurious touch previously found only on high-end instruments.',
      image: '/images/signature/pianos/gl-10/f4QT8LYQ.jpeg',
      imageAlt: 'GL-10 luxury features including soft-closing lid and premium details',
      features: ['Soft-Closing Lid', 'Safety First', 'Luxury Touch']
    },
    {
      id: 'free-delivery-tuning',
      title: 'Free Delivery & Tuning',
      subtitle: 'Exclusive Offer',
      description: 'With your signature event invitation, receive complimentary white-glove delivery and professional tuning service included at no extra cost.',
      image: '/images/signature/pianos/gx-1/gx-1-hero.webp',
      imageAlt: 'Professional piano delivery and tuning service included with signature invitation',
      badge: 'Free Service',
      features: ['White-Glove Delivery', 'Professional Tuning', 'Complimentary'],
      priority: true
    }
  ]

  const handleCtaClick = () => {
    // Directly open the assessment modal using context
    openAssessmentModal()
  }

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
            Signature Excellence
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-kawai-pearl leading-tight mb-6">
            Why the{' '}
            <span className="text-kawai-gold font-normal">GL-10 Baby Grand</span>
            {' '}Stands Apart
          </h2>

          <p className="text-lg md:text-xl text-kawai-pearl/80 font-light leading-relaxed max-w-3xl mx-auto mb-8">
            Discover the compelling reasons why the GL-10 has earned its reputation as the finest baby grand piano
            in its class, combining award-winning design with uncompromising musical excellence.
          </p>
        </motion.div>

        {/* YouTube Video Embed Section */}
        <motion.div
          className="relative max-w-4xl mx-auto mb-20"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="relative bg-gradient-to-br from-white/5 via-kawai-pearl/5 to-white/10 border border-kawai-gold/20 rounded-3xl overflow-hidden backdrop-blur-sm">
            {/* Video container with aspect ratio */}
            <div className="relative aspect-video">
              <iframe
                src="https://www.youtube.com/embed/yQyYVcIiuMg?rel=0&modestbranding=1&showinfo=0"
                title="Advanced Technology - Millennium III Action"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>

            {/* Optional overlay with title */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-kawai-black/90 via-kawai-black/60 to-transparent p-6">
              <div className="text-kawai-gold text-sm font-light tracking-[0.2em] uppercase mb-2">
                Advanced Technology
              </div>
              <h3 className="text-2xl md:text-3xl font-light text-kawai-pearl leading-tight">
                Millennium III Action
              </h3>
            </div>

            {/* Enhanced glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-kawai-gold/10 via-transparent to-kawai-gold/5 rounded-3xl blur-2xl -z-10 scale-110" />
          </div>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-4xl mx-auto">
          {/* Row 1: Award Winner + Perfect Home */}
          {gl10SellingPoints[0] && (
            <SellingPointCard
              key={gl10SellingPoints[0].id}
              sellingPoint={gl10SellingPoints[0]}
              className="h-[500px]"
              index={0}
            />
          )}

          {gl10SellingPoints[1] && (
            <SellingPointCard
              key={gl10SellingPoints[1].id}
              sellingPoint={gl10SellingPoints[1]}
              className="h-[500px]"
              index={1}
            />
          )}

          {/* Row 2: Luxury Features + Free Delivery */}
          {gl10SellingPoints[2] && (
            <SellingPointCard
              key={gl10SellingPoints[2].id}
              sellingPoint={gl10SellingPoints[2]}
              className="h-[500px]"
              index={2}
            />
          )}

          {gl10SellingPoints[3] && (
            <SellingPointCard
              key={gl10SellingPoints[3].id}
              sellingPoint={gl10SellingPoints[3]}
              className="h-[500px]"
              index={3}
            />
          )}
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          className="text-center mt-16 md:mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto p-8 rounded-2xl border border-kawai-gold/20 bg-gradient-to-br from-kawai-black/50 to-transparent backdrop-blur-sm">
            <div className="text-kawai-gold text-xs font-light tracking-[0.2em] uppercase mb-3">
              Experience Excellence
            </div>
            <h3 className="text-3xl md:text-4xl font-light text-kawai-pearl mb-4">
              Ready to Experience Our Signature?
            </h3>
            <p className="text-kawai-pearl/70 font-light mb-8 leading-relaxed text-lg max-w-3xl mx-auto">
              What makes our baby grand selection truly exceptional? From award-winning craftsmanship
              to innovative technology, our signature collection represents the pinnacle of piano artistry.
              Each instrument is carefully selected for its superior touch, remarkable tone, and enduring beauty
              that transforms any space into a concert hall.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <PremiumButton
                variant="primary"
                size="lg"
                onClick={handleCtaClick}
                className="mx-auto"
              >
                Join Event
              </PremiumButton>
              <PremiumButton
                variant="secondary"
                size="lg"
                onClick={() => setIsVideoModalOpen(true)}
              >
                Learn More
              </PremiumButton>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-kawai-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-kawai-gold/5 rounded-full blur-3xl" />

      {/* YouTube Video Modal */}
      <YouTubeVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoId="bFes2TDepd8"
        title="Discover Our Signature Piano Collection"
      />
    </section>
  )
}

// Keep original export name for compatibility
export { PremiumBentoGallery as HorizontalScrollPianoGallery }