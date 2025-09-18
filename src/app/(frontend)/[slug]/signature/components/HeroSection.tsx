'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'
import type { SignatureHeroSection } from '@/lib/types/signature'
import { cn } from '@/lib/utils'

// Lenis smooth scrolling setup
let lenisInstance: any = null

// Button component with luxury styling
interface SignatureButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'md' | 'lg'
  className?: string
  onClick?: () => void
  disabled?: boolean
}

function SignatureButton({
  children,
  variant = 'primary',
  size = 'lg',
  className = '',
  onClick,
  disabled = false
}: SignatureButtonProps) {
  const baseStyles = "relative font-light tracking-[0.1em] transition-all duration-500 overflow-hidden group focus:outline-none focus:ring-2 focus:ring-white/20"

  const variants = {
    primary: "bg-white/95 text-black hover:bg-white hover:scale-[1.02] shadow-2xl hover:shadow-white/20",
    secondary: "bg-transparent text-white border border-white/30 hover:border-white/60 hover:bg-white/5 hover:scale-[1.02]",
    outline: "bg-transparent text-white/80 border border-white/20 hover:border-white/40 hover:bg-white/5"
  }

  const sizes = {
    md: "px-8 py-4 text-sm",
    lg: "px-12 py-5 text-base"
  }
  
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      whileHover={{
        scale: disabled ? 1 : 1.02
      }}
      transition={{ duration: 0.4 }}
      whileTap={{
        scale: disabled ? 1 : 0.98,
        transition: { duration: 0.2 }
      }}
    >
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700"></div>
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}

// Scroll indicator component
function ScrollIndicator() {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
  
  const scrollToNext = () => {
    if (lenisInstance) {
      lenisInstance.scrollTo(window.innerHeight, { duration: 1.5 })
    } else {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      })
    }
  }
  
  return (
    <motion.div
      style={{ opacity }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer group"
      onClick={scrollToNext}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.8 }}
    >
      <div className="flex flex-col items-center space-y-2 text-kawai-pearl/70 hover:text-kawai-pearl transition-colors duration-300">
        <span className="text-xs font-light tracking-widest">SCROLL</span>
        <div className="w-px h-8 bg-gradient-to-b from-kawai-pearl/70 to-transparent group-hover:from-kawai-pearl transition-colors duration-300"></div>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            ease: "easeInOut"
          }}
          className="w-1 h-1 bg-kawai-pearl/70 rounded-full group-hover:bg-kawai-pearl transition-colors duration-300"
        />
      </div>
    </motion.div>
  )
}

// Main hero section component
interface HeroSectionProps {
  data?: SignatureHeroSection
  enableSmoothScrolling?: boolean
}

export function HeroSection({ data, enableSmoothScrolling = true }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [viewportHeight, setViewportHeight] = useState(800)

  // Update viewport height on mount and resize
  useEffect(() => {
    const updateViewportHeight = () => {
      setViewportHeight(window.innerHeight)
    }

    updateViewportHeight()
    window.addEventListener('resize', updateViewportHeight)
    return () => window.removeEventListener('resize', updateViewportHeight)
  }, [])

  // Improved parallax effects with dynamic ranges and easing
  const { scrollY } = useScroll()

  // Use viewport height for more natural scroll ranges
  const scrollRange = viewportHeight * 1.5 // Increased range for smoother transition

  // Calculate safe parallax distances to prevent image from scrolling off screen
  const imageScale = 1.2 // 20% larger than viewport
  const extraImageHeight = (imageScale - 1) * viewportHeight // Extra image area available
  const maxSafeParallaxDistance = extraImageHeight * 0.8 // Use 80% of extra space for safety

  // Constrained parallax that never scrolls the image completely off screen
  const backgroundY = useTransform(
    scrollY,
    [0, scrollRange],
    [0, -Math.min(maxSafeParallaxDistance, viewportHeight * 0.15)] // Clamped to safe distance
  )

  const contentY = useTransform(
    scrollY,
    [0, scrollRange],
    [0, -viewportHeight * 0.08] // Reduced content movement for subtlety
  )

  // Add opacity fade effect for better visual transition
  const contentOpacity = useTransform(
    scrollY,
    [0, scrollRange * 0.5, scrollRange],
    [1, 0.8, 0.2]
  )
  
  // Initialize Lenis smooth scrolling
  useEffect(() => {
    setMounted(true)
    
    if (enableSmoothScrolling && typeof window !== 'undefined') {
      const initLenis = async () => {
        try {
          const Lenis = (await import('lenis')).default
          lenisInstance = new Lenis({
            duration: 1.0, // Slightly faster for more responsive feel
            easing: (t: number) => 1 - Math.pow(1 - t, 3), // Cubic easing out for smooth deceleration
            smoothWheel: true,
            wheelMultiplier: 1.2, // Slightly increase scroll sensitivity
            touchMultiplier: 2 // Better touch responsiveness
          })
          
          function raf(time: number) {
            lenisInstance?.raf(time)
            requestAnimationFrame(raf)
          }
          
          requestAnimationFrame(raf)
        } catch (error) {
          console.warn('Failed to initialize Lenis smooth scrolling:', error)
        }
      }
      
      initLenis()
      
      return () => {
        if (lenisInstance) {
          lenisInstance.destroy()
          lenisInstance = null
        }
      }
    }
  }, [enableSmoothScrolling])

  // Fallback data with refined luxury messaging
  const fallbackData: SignatureHeroSection = {
    exclusiveText: "",
    titlePrefix: "",
    titleMain: "Baby Grand Signature",
    titleSuffix: "",
    subtitle: "Transform your space into a Grand Concert Hall",
    description: "See if you are qualified for a personal invite to this special event for the community that helped us build our legacy.",
    primaryCta: {
      text: "Explore Collection",
      action: "scroll"
    },
    secondaryCta: {
      text: "Register Now",
      action: "modal"
    },
    overlayOpacity: 0.4,
    textAlignment: "center",
    showScrollIndicator: false
  }
  
  const heroData = { ...fallbackData, ...data }
  
  // Get optimized background image
  const backgroundImageProps = getImagePropsWithFallback(
    heroData.heroBackgroundImage,
    '/images/signature/GX_cover.jpg', // Updated fallback image
    'hero',
    {
      fill: true,
      priority: true,
      className: 'object-cover object-center'
    }
  )
  
  // Handle CTA actions
  const handlePrimaryCTA = () => {
    if (heroData.primaryCta?.action === 'scroll') {
      // Navigate to Premium Bento Gallery section
      const bentoGallerySection = document.getElementById('premium-bento-gallery')
      if (bentoGallerySection) {
        if (lenisInstance) {
          lenisInstance.scrollTo(bentoGallerySection, { duration: 1.5 })
        } else {
          bentoGallerySection.scrollIntoView({ behavior: 'smooth' })
        }
      }
    } else if (heroData.primaryCta?.link) {
      window.open(heroData.primaryCta.link, '_self')
    }
  }
  
  const handleSecondaryCTA = () => {
    if (heroData.secondaryCta?.action === 'modal') {
      // Navigate to signature experience section
      const signatureExperienceSection = document.getElementById('signature-experience')
      if (signatureExperienceSection) {
        if (lenisInstance) {
          lenisInstance.scrollTo(signatureExperienceSection, { duration: 1.5 })
        } else {
          signatureExperienceSection.scrollIntoView({ behavior: 'smooth' })
        }
      }
    } else if (heroData.secondaryCta?.link) {
      window.open(heroData.secondaryCta.link, '_self')
    }
  }
  
  // Enhanced animation variants for luxury feel
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4,
        delayChildren: 0.3
      }
    }
  }

  const textVariants = {
    hidden: {
      opacity: 0,
      y: 40
    },
    visible: {
      opacity: 1,
      y: 0
    }
  }

  const titleVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1
    }
  }

  const buttonVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1
    }
  }

  const textAlignmentClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end"
  }

  if (!mounted) {
    return (
      <section className="relative h-screen flex items-center justify-center bg-kawai-black">
        <div className="absolute inset-0 bg-gradient-to-b from-kawai-black/50 to-kawai-black/80"></div>
      </section>
    )
  }

  return (
    <section
      ref={containerRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: '#0a0a0a' // Deep black fallback
      }}
    >
      {/* Background Image/Video with Parallax */}
      <motion.div
        className="absolute inset-0 w-full h-full min-h-screen"
        style={{
          y: backgroundY,
          // Add transform3d for GPU acceleration
          transform: 'translate3d(0, 0, 0)',
          // Ensure background always covers the area
          backgroundColor: '#0a0a0a'
        }}
      >
        <Image
          {...backgroundImageProps}
          alt="Signature Collection Background"
          className="object-cover object-center scale-[1.2]" // Increased scaling to ensure full coverage during parallax
        />
      </motion.div>

      {/* Fixed overlay that doesn't move with parallax */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-kawai-black/40 via-kawai-black/60 to-kawai-black/80 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom,
            rgba(10, 10, 10, ${heroData.overlayOpacity || 0.6}),
            rgba(10, 10, 10, ${(heroData.overlayOpacity || 0.6) + 0.2})
          )`
        }}
      />
      
      {/* Main Content */}
      <motion.div
        className={cn(
          "relative z-10 max-w-4xl mx-auto px-8 lg:px-12 flex flex-col",
          textAlignmentClasses[heroData.textAlignment || 'center']
        )}
        style={{
          y: contentY,
          opacity: contentOpacity,
          // Add transform3d for GPU acceleration
          transform: 'translate3d(0, 0, 0)'
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Event Dates */}
        {heroData.exclusiveText && (
          <motion.div
            variants={textVariants}
            className="mb-8"
          >
            <span className="inline-block text-kawai-pearl/90 text-xl md:text-2xl font-light tracking-wider border border-kawai-pearl/30 px-6 py-3 rounded-lg backdrop-blur-sm bg-kawai-black/20">
              {heroData.exclusiveText}
            </span>
          </motion.div>
        )}


        {/* Main Title */}
        <motion.div
          variants={titleVariants}
          className="mb-16"
        >
          <h1 className="text-center">
            {heroData.titlePrefix && (
              <span
                className="block font-light mb-8 tracking-[0.25em] opacity-90 text-center"
                style={{
                  fontSize: 'clamp(0.875rem, 2.5vw, 1.5rem)',
                  color: '#E5E1DB',
                  fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif'
                }}
              >
                {heroData.titlePrefix}
              </span>
            )}
            <span
              className="block leading-[0.9] text-center w-full"
              style={{
                fontSize: 'clamp(2.5rem, 10vw, 7rem)',
                letterSpacing: '0.1em',
                textAlign: 'center',
                fontWeight: '300',
                fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                color: '#F8F6F0'
              }}
            >
              {heroData.titleMain.includes('Signature') ? (
                <>
                  {heroData.titleMain.split('Signature')[0]}
                  <span style={{ color: '#d5c78c' }}>Signature</span>
                  {heroData.titleMain.split('Signature')[1]}
                </>
              ) : (
                heroData.titleMain
              )}
            </span>
            <div
              className="block font-light mt-6 tracking-[0.2em] text-center underline"
              style={{
                fontSize: 'clamp(0.875rem, 2.5vw, 1.25rem)',
                color: '#F8F6F0',
                fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif'
              }}
            >
              October 9 - 11th
            </div>
            {heroData.titleSuffix && (
              <div
                className="block font-light mt-6 tracking-[0.15em] opacity-90 text-center"
                style={{
                  fontSize: 'clamp(1rem, 3vw, 2rem)',
                  color: '#E5E1DB',
                  fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif'
                }}
              >
                {heroData.titleSuffix}
              </div>
            )}
          </h1>
        </motion.div>
        
        {/* Subtitle */}
        {heroData.subtitle && (
          <motion.h2
            variants={textVariants}
            className="text-xl md:text-2xl lg:text-3xl font-light mb-12 max-w-2xl"
            style={{
              color: '#E5E1DB',
              fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
              lineHeight: '1.4'
            }}
          >
            {heroData.subtitle}
          </motion.h2>
        )}

        {/* Description */}
        {heroData.description && (
          <motion.p
            variants={textVariants}
            className="text-base md:text-lg font-light leading-relaxed mb-20 max-w-xl"
            style={{
              color: '#B8B4AE',
              fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif'
            }}
          >
            {heroData.description}
          </motion.p>
        )}

        {/* CTA Buttons */}
        <motion.div
          variants={buttonVariants}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          {heroData.primaryCta && (
            <SignatureButton
              variant="primary"
              onClick={handlePrimaryCTA}
              className="min-w-[200px]"
            >
              {heroData.primaryCta.text}
            </SignatureButton>
          )}
          
          {heroData.secondaryCta && (
            <SignatureButton
              variant="secondary"
              onClick={handleSecondaryCTA}
              className="min-w-[200px]"
            >
              {heroData.secondaryCta.text}
            </SignatureButton>
          )}
        </motion.div>
      </motion.div>
      
      {/* Scroll Indicator */}
      {heroData.showScrollIndicator && <ScrollIndicator />}
      
      {/* Elegant bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-kawai-black to-transparent pointer-events-none" />
    </section>
  )
}