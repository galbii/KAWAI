'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'
import { useSignatureExperience } from './SignatureExperienceContext'
import type { SignatureHeroSection } from '@/lib/types/signature'
import { cn } from '@/lib/utils'
import { usePostHog } from 'posthog-js/react'

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
        scale: disabled ? 1 : 1.02,
        y: disabled ? 0 : -2
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileTap={{
        scale: disabled ? 1 : 0.98,
        y: disabled ? 0 : 0
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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 4.0, duration: 0.8, ease: "easeOut" }}
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
  const videoRef = useRef<HTMLVideoElement>(null)
  const [mounted, setMounted] = useState(false)
  const [viewportHeight, setViewportHeight] = useState(800)
  const [animationStage, setAnimationStage] = useState(0)

  // Get modal opening function from context
  const { openAssessmentModal } = useSignatureExperience()

  // PostHog analytics hook
  const posthog = usePostHog()

  // Get signature page slug from URL
  const getSignaturePageSlug = () => {
    if (typeof window !== 'undefined') {
      const pathSegments = window.location.pathname.split('/')
      // Look for the segment before '/signature'
      const signatureIndex = pathSegments.indexOf('signature')
      if (signatureIndex > 0) {
        return pathSegments[signatureIndex - 1]
      }
    }
    return 'unknown'
  }

  // Update viewport height on mount and resize
  useEffect(() => {
    const updateViewportHeight = () => {
      setViewportHeight(window.innerHeight)
    }

    updateViewportHeight()
    window.addEventListener('resize', updateViewportHeight)
    return () => window.removeEventListener('resize', updateViewportHeight)
  }, [])

  // Staged animation sequence: Baby Grand → Signature → October 9th-11th → Description → CTAs
  useEffect(() => {
    const timers = [
      setTimeout(() => setAnimationStage(1), 800),   // Baby Grand appears
      setTimeout(() => setAnimationStage(2), 1800),  // Signature appears
      setTimeout(() => setAnimationStage(3), 2800),  // October 9th-11th appears
      setTimeout(() => setAnimationStage(4), 3800),  // Description appears
      setTimeout(() => setAnimationStage(5), 5300),  // Show CTAs
    ]

    return () => timers.forEach(timer => clearTimeout(timer))
  }, [mounted])

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
    return undefined
  }, [enableSmoothScrolling])

  // Minimal luxury messaging approach
  const fallbackData: SignatureHeroSection = {
    exclusiveText: "",
    titlePrefix: "",
    titleMain: "Baby Grand Signature Event",
    titleSuffix: "",
    subtitle: "October 9 – 11th",
    description: "Own a piece of musical history and refined craftsmanship. Reserve your appointment today, spots are limited.",
    primaryCta: {
      text: "Join Event",
      action: "modal"
    },
    secondaryCta: {
      text: "View Collection",
      action: "scroll"
    },
    overlayOpacity: 0,
    textAlignment: "center",
    showScrollIndicator: false
  }
  
  const heroData = { ...fallbackData, ...data }
  
  // Get optimized background image (fallback for video)
  const backgroundImageProps = getImagePropsWithFallback(
    heroData.heroBackgroundImage,
    '/videos/background_signature.webp', // Updated fallback to video poster
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
      // Fire PostHog signature_started event
      const signaturePageSlug = getSignaturePageSlug()
      posthog?.capture('signature_started', {
        cta_location: 'hero_section',
        cta_text: heroData.secondaryCta.text || 'View Collection',
        signature_page: signaturePageSlug,
        entry_point: 'hero_secondary_cta',
        timestamp: new Date().toISOString()
      })

      console.log('HeroSection: PostHog signature_started event fired from hero secondary CTA')

      // Directly open the assessment modal using context
      openAssessmentModal()
    } else if (heroData.secondaryCta?.link) {
      window.open(heroData.secondaryCta.link, '_self')
    }
  }
  
  // Elegant fade-in animations inspired by premium heritage component

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
      {/* Background Video with Parallax */}
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
        {/* Video background - stays visible throughout */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          poster="/videos/background_signature.webp"
          className="absolute inset-0 w-full h-full object-cover object-center scale-[1.2]"
          style={{
            zIndex: 1,
          }}
        >
          <source src="/videos/background_signature.webm" type="video/webm" />
          <source src="/videos/background_signature.mp4" type="video/mp4" />
        </video>
        
        {/* Fallback image for browsers that don't support video */}
        <noscript>
          <Image
            {...backgroundImageProps}
            alt="Signature Collection Background"
            className="object-cover object-center scale-[1.2]"
          />
        </noscript>
      </motion.div>


      


      {/* Main Content - Minimal Luxury Layout */}
      <motion.div
        className={cn(
          "relative z-10 max-w-5xl mx-auto px-8 lg:px-16 flex flex-col min-h-screen justify-center",
          textAlignmentClasses[heroData.textAlignment || 'center']
        )}
        style={{
          y: contentY,
          opacity: contentOpacity,
          // Add transform3d for GPU acceleration
          transform: 'translate3d(0, 0, 0)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        {/* Sequential Text Transitions - Same Position */}
        <div className="flex flex-col items-center justify-center">

          {/* Main Text Area - All transitions happen here */}
          <div className="relative text-center min-h-[200px] md:min-h-[300px] lg:min-h-[400px] flex items-center justify-center">
            
            {/* Stage 1: Baby Grand - Fades in from below */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, y: 80 }}
              animate={{
                opacity: animationStage >= 1 ? 1 : 0,
                y: animationStage >= 1 ? 0 : 80
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="relative text-center">
                {/* Baby Grand - Smaller, lighter styling */}
                <motion.span
                  className="block font-light tracking-wide text-center mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: animationStage >= 1 ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  style={{
                    fontSize: 'clamp(2rem, 8vw, 4rem)',
                    color: 'white',
                    fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
                    textShadow: '0 2px 40px rgba(0,0,0,0.4)',
                    fontWeight: '300'
                  }}
                >
                  Baby Grand
                </motion.span>
                
                {/* Signature - The emphasized word */}
                <motion.span
                  className="block leading-[0.8] font-black tracking-tight text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{
                    opacity: animationStage >= 2 ? 1 : 0,
                    y: animationStage >= 2 ? 0 : 30
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{
                    fontSize: 'clamp(4.5rem, 16vw, 11rem)',
                    color: '#d5c78c',
                    fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
                    textShadow: '0 6px 80px rgba(0,0,0,0.7), 0 4px 40px rgba(213,199,140,0.3)',
                    fontWeight: '900'
                  }}
                >
                  Signature
                </motion.span>
                
                {/* October 9th-11th - Final part of sequence */}
                <motion.span
                  className="block font-light tracking-[0.2em] text-center mt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: animationStage >= 3 ? 1 : 0,
                    y: animationStage >= 3 ? 0 : 20
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{
                    fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
                    color: 'white',
                    fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
                    textShadow: '0 2px 30px rgba(0,0,0,0.6)',
                    fontWeight: '300'
                  }}
                >
                  October 9th – 11th
                </motion.span>
                
                {/* Description - Very small text under date */}
                <motion.p
                  className="font-light leading-relaxed text-center mt-6 max-w-2xl mx-auto px-4"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{
                    opacity: animationStage >= 4 ? 1 : 0,
                    y: animationStage >= 4 ? 0 : 15
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  style={{
                    fontSize: 'clamp(1rem, 3vw, 1.25rem)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
                    textShadow: '0 2px 30px rgba(0,0,0,0.5)',
                    fontWeight: '300',
                    lineHeight: '1.6'
                  }}
                >
                  {heroData.description}
                </motion.p>
              </div>
            </motion.div>
          </div>


        </div>

        {/* Stage 5: CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-6 mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{
            opacity: animationStage >= 5 ? 1 : 0,
            y: animationStage >= 5 ? 0 : 30
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Primary CTA - Join Event (Most Important) */}
          {heroData.primaryCta && (
            <SignatureButton
              variant="primary"
              onClick={handlePrimaryCTA}
              className="min-w-[240px] text-lg"
            >
              {heroData.primaryCta.text}
            </SignatureButton>
          )}
          
          {/* Secondary CTA - View Collection */}
          {heroData.secondaryCta && (
            <SignatureButton
              variant="secondary"
              onClick={handleSecondaryCTA}
              className="min-w-[240px] text-lg"
            >
              {heroData.secondaryCta.text}
            </SignatureButton>
          )}
        </motion.div>
      </motion.div>
      
      {/* Scroll Indicator */}
      {heroData.showScrollIndicator && <ScrollIndicator />}
      

    </section>
  )
}