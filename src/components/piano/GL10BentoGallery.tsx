'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'
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
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-kawai-gold/20 to-transparent transition-transform duration-1000"></div>
        <span className="relative z-10">{children}</span>
      </Component>
    </motion.div>
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

  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-gradient-to-br from-kawai-black via-gray-900 to-kawai-black border border-kawai-gold/20 hover:border-kawai-gold/40 transition-all duration-700 h-[500px]",
        className
      )}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -8, scale: 1.02 }}
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
              priority: sellingPoint.priority
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

        {/* Icon */}
        {sellingPoint.icon && (
          <div className="absolute top-4 right-4 w-12 h-12 bg-kawai-gold/10 backdrop-blur-sm border border-kawai-gold/30 rounded-full flex items-center justify-center">
            <div className="text-kawai-gold text-xl">
              {sellingPoint.icon}
            </div>
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

        {/* Hover reveal button */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pt-2">
          <button className="text-kawai-gold text-sm font-light hover:text-kawai-gold/80 transition-colors duration-200 flex items-center gap-2">
            Learn More
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Subtle golden glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-kawai-gold/5 via-transparent to-kawai-gold/5" />
      </div>
    </motion.div>
  )
}

// Main GL-10 Bento Gallery Component
export function GL10BentoGallery() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  // GL-10 Selling Points Data
  const gl10SellingPoints: GL10SellingPoint[] = [
    {
      id: 'award-winning',
      title: 'Industry Award Winner',
      subtitle: 'Recognition',
      description: 'MMR Magazine\'s "2016 Product of the Year" - the highest award any instrument in the global music products industry can receive.',
      image: '/images/gl10/award-recognition.webp',
      imageAlt: 'GL-10 award recognition and accolades',
      badge: 'Award Winner',
      icon: '🏆',
      features: ['MMR 2016 Product of Year', 'Industry Recognition', 'Global Excellence'],
      priority: true
    },
    {
      id: 'millennium-action',
      title: 'Millennium III Action',
      subtitle: 'Technology',
      description: 'ABS-Carbon composite technology creates lighter, stronger action parts for faster response, better control, and greater stability than conventional all-wood actions.',
      image: '/images/gl10/action-technology.webp',
      imageAlt: 'GL-10 Millennium III Action with ABS-Carbon technology',
      icon: '⚙️',
      features: ['ABS-Carbon Composite', 'Faster Response', 'Superior Control']
    },
    {
      id: 'premium-soundboard',
      title: 'Premium Soundboard',
      subtitle: 'Craftsmanship',
      description: 'Quarter-sawn solid spruce soundboard, strategically tapered and resonance-tested to meet demanding standards for optimal tonal projection.',
      image: '/images/gl10/soundboard-craftsmanship.webp',
      imageAlt: 'GL-10 premium quarter-sawn solid spruce soundboard',
      icon: '🎵',
      features: ['Quarter-Sawn Spruce', 'Resonance Tested', 'Strategic Tapering']
    },
    {
      id: 'space-efficiency',
      title: 'Perfect for Any Home',
      subtitle: 'Space Efficiency',
      description: 'At 5\'0" in length, the GL-10 delivers authentic grand piano experience in spaces where every inch matters, without sacrificing musical quality.',
      image: '/images/gl10/compact-elegance.webp',
      imageAlt: 'GL-10 baby grand piano fitting perfectly in home setting',
      icon: '🏠',
      features: ['5\'0" Length', 'Compact Design', 'Home-Friendly']
    },
    {
      id: 'luxury-features',
      title: 'Luxury Safety Features',
      subtitle: 'Premium Details',
      description: 'Soft-closing lid and fallboard prevent trapped fingers while adding a luxurious touch previously found only on high-end instruments.',
      image: '/images/gl10/luxury-features.webp',
      imageAlt: 'GL-10 soft-closing lid demonstrating luxury and safety',
      icon: '✨',
      features: ['Soft-Closing Lid', 'Safety First', 'Luxury Touch']
    },
    {
      id: 'exceptional-value',
      title: 'Unmatched Value',
      subtitle: 'Investment',
      description: 'Features the same Millennium III action as higher-priced models. Best possible instrument around its budget range with professional-grade components.',
      image: '/images/gl10/value-proposition.webp',
      imageAlt: 'GL-10 representing exceptional value in baby grand pianos',
      badge: 'Best Value',
      icon: '💎',
      features: ['Professional Grade', 'Premium Components', 'Smart Investment']
    },
    {
      id: 'warranty-coverage',
      title: '10-Year Warranty',
      subtitle: 'Assurance',
      description: 'Every Kawai grand piano is covered by our Ten Year Fully Transferable Warranty - the seal of Kawai craftsmanship and assurance of satisfaction.',
      image: '/images/gl10/warranty-coverage.webp',
      imageAlt: 'GL-10 warranty documentation and coverage details',
      icon: '🛡️',
      features: ['10-Year Coverage', 'Fully Transferable', 'Kawai Craftsmanship']
    },
    {
      id: 'finish-options',
      title: 'Five Elegant Finishes',
      subtitle: 'Customization',
      description: 'Choose from Polished Ebony, Polished Mahogany, French Polished Mahogany, Snow White, and Satin Ebony to match your home décor perfectly.',
      image: '/images/gl10/finish-options.webp',
      imageAlt: 'GL-10 available in multiple elegant finish options',
      icon: '🎨',
      features: ['5 Finish Options', 'Home Integration', 'Personal Style']
    }
  ]

  const handleCtaClick = () => {
    const assessmentSection = document.getElementById('signature-experience')
    if (assessmentSection) {
      assessmentSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="gl10-bento-gallery"
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
            GL-10 Excellence
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-kawai-pearl leading-tight mb-6">
            Why the{' '}
            <span className="text-kawai-gold font-normal">GL-10 Baby Grand</span>
            {' '}Stands Apart
          </h2>

          <p className="text-lg md:text-xl text-kawai-pearl/80 font-light leading-relaxed max-w-3xl mx-auto mb-8">
            Discover the eight compelling reasons why the GL-10 has earned its reputation as the finest baby grand piano
            in its class, combining award-winning design with uncompromising musical excellence.
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {/* Featured card - spans 2 columns */}
          <div className="lg:col-span-2">
            <SellingPointCard
              sellingPoint={gl10SellingPoints[0]}
              className="h-[600px]"
              index={0}
            />
          </div>

          {/* Standard cards */}
          {gl10SellingPoints.slice(1, 3).map((point, index) => (
            <SellingPointCard
              key={point.id}
              sellingPoint={point}
              index={index + 1}
            />
          ))}

          {/* Row 2 */}
          {gl10SellingPoints.slice(3, 7).map((point, index) => (
            <SellingPointCard
              key={point.id}
              sellingPoint={point}
              index={index + 3}
            />
          ))}

          {/* Featured bottom card - spans 2 columns */}
          <div className="lg:col-span-2">
            <SellingPointCard
              sellingPoint={gl10SellingPoints[7]}
              className="h-[500px]"
              index={7}
            />
          </div>
        </motion.div>

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
              Ready to Experience the GL-10?
            </h3>
            <p className="text-kawai-pearl/70 font-light mb-8 leading-relaxed text-lg max-w-3xl mx-auto">
              The GL-10 Baby Grand represents the perfect harmony of compact elegance, premium craftsmanship,
              and authentic grand piano performance. Join us to discover why this award-winning instrument
              has become the choice of discerning musicians worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <PremiumButton
                variant="primary"
                size="lg"
                onClick={handleCtaClick}
                className="mx-auto"
              >
                Schedule Your Experience
              </PremiumButton>
              <div className="text-kawai-pearl/50 text-sm text-center">
                Private Consultation • Expert Guidance • By Appointment Only
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-kawai-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-kawai-gold/5 rounded-full blur-3xl" />
    </section>
  )
}

// Export with alias for backward compatibility
export { GL10BentoGallery as PremiumBentoGallery }