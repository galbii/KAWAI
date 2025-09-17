'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'
import { cn } from '@/lib/utils'

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

// Gallery card component
interface GalleryCardProps {
  title: string
  subtitle: string
  description: string
  image: string
  imageAlt: string
  size: 'large' | 'medium' | 'small'
  cta?: string
  className?: string
  onClick?: () => void
}

function GalleryCard({
  title,
  subtitle,
  description,
  image,
  imageAlt,
  size,
  cta,
  className = '',
  onClick
}: GalleryCardProps) {
  const sizeClasses = {
    large: "md:col-span-2 md:row-span-2 min-h-[400px] md:min-h-[500px]",
    medium: "md:col-span-1 md:row-span-2 min-h-[300px] md:min-h-[400px]",
    small: "md:col-span-1 md:row-span-1 min-h-[200px] md:min-h-[240px]"
  }

  const imageProps = getImagePropsWithFallback(
    image,
    '/images/signature/fallback-piano.webp',
    'gallery',
    {
      fill: true,
      className: 'object-cover object-center transition-transform duration-700 group-hover:scale-105'
    }
  )

  return (
    <motion.div
      className={cn(
        "relative group cursor-pointer overflow-hidden rounded-lg bg-gradient-to-br from-kawai-black via-gray-900 to-kawai-black border border-kawai-gold/20 hover:border-kawai-gold/40 transition-all duration-500",
        sizeClasses[size],
        className
      )}
      onClick={onClick}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          {...imageProps}
          alt={imageAlt}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-kawai-black via-kawai-black/60 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-500" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
        <motion.div
          className="transform transition-transform duration-500 group-hover:translate-y-0 translate-y-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-kawai-gold text-xs md:text-sm font-light tracking-[0.2em] uppercase mb-2 border-l-2 border-kawai-gold pl-3">
            {subtitle}
          </div>
          <h3 className="text-kawai-pearl text-xl md:text-2xl lg:text-3xl font-light leading-tight mb-3 group-hover:text-kawai-gold transition-colors duration-300">
            {title}
          </h3>
          <p className="text-kawai-pearl/80 text-sm md:text-base font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 mb-4">
            {description}
          </p>
          {cta && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
              <div className="text-kawai-gold text-xs font-light tracking-wide border-t border-kawai-gold/20 pt-3 mt-3">
                {cta} →
              </div>
            </div>
          )}
        </motion.div>

        {/* Hover indicator */}
        <div className="absolute top-4 right-4 w-8 h-8 rounded-full border border-kawai-gold/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg className="w-4 h-4 text-kawai-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </div>
      </div>
    </motion.div>
  )
}

// Main Premium Bento Gallery Component
export function PremiumBentoGallery() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  const galleryItems = [
    {
      id: 'heritage',
      title: 'Master Piano Artisans',
      subtitle: 'Century of Advancement',
      description: 'A century of advancement, knowledge and craftsmanship culminates in every piano within our Signature Selection. Each instrument embodies the soul of our master artisans who dedicate their lives to perfecting the art of piano creation.',
      image: '/images/signature/heritage-craftsman.webp',
      imageAlt: 'Master craftsman working on Shigeru Kawai piano',
      size: 'large' as const,
      cta: 'Discover which artisan-crafted model suits your style'
    },
    {
      id: 'exclusivity',
      title: 'Limited to 400 Annually',
      subtitle: 'Handcrafted Exclusivity',
      description: 'Handcrafted in carefully limited numbers — fewer than 400 instruments per year. Each piano is individually signed by our master craftsmen, ensuring your instrument is truly one of a kind.',
      image: '/images/signature/exclusive-showroom.webp',
      imageAlt: 'Exclusive Shigeru Kawai piano collection',
      size: 'medium' as const,
      cta: 'Reserve your assessment for limited collection access'
    },
    {
      id: 'materials',
      title: 'Tonal Wood Selection',
      subtitle: 'Material Mastery',
      description: 'Our master craftsmen personally select each piece of aged European spruce, rock maple, and mahogany. Only 3% of examined wood meets our exacting standards for tonal perfection.',
      image: '/images/signature/premium-materials.webp',
      imageAlt: 'Premium wood materials for piano construction',
      size: 'small' as const,
      cta: 'Find your perfect tonal match'
    },
    {
      id: 'performance',
      title: 'Concert Hall Validation',
      subtitle: 'Artist Chosen',
      description: 'From Carnegie Hall to the Sydney Opera House, leading concert pianists choose pianos from our curated Signature Selection for performances that define their careers. Experience the instrument that elevates artistry.',
      image: '/images/signature/concert-performance.webp',
      imageAlt: 'Shigeru Kawai piano in concert hall',
      size: 'small' as const,
      cta: 'Discover your concert-level instrument'
    }
  ]

  const handleCardClick = (item: typeof galleryItems[0]) => {
    // Track interaction for analytics (if needed)
    // gtag?.('event', 'gallery_card_click', { card_id: item.id })

    // Scroll to assessment section
    const assessmentSection = document.getElementById('signature-experience')
    if (assessmentSection) {
      assessmentSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleCtaClick = () => {
    // Scroll to assessment section
    const assessmentSection = document.getElementById('signature-experience')
    if (assessmentSection) {
      assessmentSection.scrollIntoView({ behavior: 'smooth' })
    }
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
            Signature Selection
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-kawai-pearl leading-tight mb-6">
            Where{' '}
            <span className="text-kawai-gold font-normal">Master Artisans</span>
            {' '}Meet Musical Destiny
          </h2>

          <p className="text-lg md:text-xl text-kawai-pearl/80 font-light leading-relaxed max-w-3xl mx-auto mb-8">
            The Signature Selection represents our curated catalog of baby grands for this exclusive event. Each instrument is
            handcrafted in carefully limited numbers by master artisans, carrying forward a century of advancement,
            knowledge and craftsmanship. Only 400 instruments are created annually worldwide.
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

        {/* Bento Gallery Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <GalleryCard
                {...item}
                onClick={() => handleCardClick(item)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div
          className="text-center mt-16 md:mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="max-w-3xl mx-auto p-8 rounded-lg border border-kawai-gold/20 bg-gradient-to-br from-kawai-black/50 to-transparent backdrop-blur-sm">
            <div className="text-kawai-gold text-xs font-light tracking-[0.2em] uppercase mb-3">
              Limited Annual Production
            </div>
            <h3 className="text-2xl md:text-3xl font-light text-kawai-pearl mb-4">
              Your Artisan-Crafted Instrument Awaits
            </h3>
            <p className="text-kawai-pearl/70 font-light mb-6 leading-relaxed">
              With our curated Signature Selection of baby grands available for this exclusive event, securing your perfect instrument begins
              with understanding your unique musical journey. Our personalized assessment ensures you discover the
              one instrument destined to elevate your artistry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <PremiumButton
                variant="primary"
                size="lg"
                onClick={handleCtaClick}
                className="mx-auto"
              >
                Begin Personalized Assessment
              </PremiumButton>
              <div className="text-kawai-pearl/50 text-sm">
                Complimentary • Private • By Appointment
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