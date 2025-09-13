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
  const baseStyles = "relative font-medium tracking-wide transition-all duration-300 overflow-hidden group focus:outline-none focus:ring-2 focus:ring-kawai-pearl/20"
  
  const variants = {
    primary: "bg-kawai-pearl text-kawai-black hover:bg-kawai-pearl/90 hover:scale-105 shadow-lg hover:shadow-xl",
    secondary: "bg-transparent text-kawai-pearl border border-kawai-pearl hover:bg-kawai-pearl hover:text-kawai-black hover:scale-105",
    outline: "bg-transparent text-kawai-pearl border border-kawai-pearl/30 hover:border-kawai-pearl hover:bg-kawai-pearl/10"
  }
  
  const sizes = {
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  }
  
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      whileHover={{ 
        scale: disabled ? 1 : 1.05,
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: disabled ? 1 : 0.98,
        transition: { duration: 0.1 }
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
  
  // Parallax effects
  const { scrollY } = useScroll()
  const backgroundY = useTransform(scrollY, [0, 800], [0, -400])
  const contentY = useTransform(scrollY, [0, 800], [0, -200])
  
  // Initialize Lenis smooth scrolling
  useEffect(() => {
    setMounted(true)
    
    if (enableSmoothScrolling && typeof window !== 'undefined') {
      const initLenis = async () => {
        try {
          const Lenis = (await import('lenis')).default
          lenisInstance = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true
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

  // Fallback data with luxury messaging
  const fallbackData: SignatureHeroSection = {
    exclusiveText: "By Invitation Only",
    titlePrefix: "Kawai",
    titleMain: "Signature Collection",
    titleSuffix: "2025",
    subtitle: "Curated for the Discerning Musician",
    description: "Experience the pinnacle of piano craftsmanship with our exclusive signature collection. Each instrument represents decades of heritage, innovation, and uncompromising artistic excellence.",
    primaryCta: {
      text: "Begin Your Journey",
      action: "scroll"
    },
    secondaryCta: {
      text: "Private Consultation",
      action: "modal"
    },
    overlayOpacity: 0.6,
    textAlignment: "center",
    showScrollIndicator: true
  }
  
  const heroData = { ...fallbackData, ...data }
  
  // Get optimized background image
  const backgroundImageProps = getImagePropsWithFallback(
    heroData.heroBackgroundImage,
    '/images/signature/hero-bg.webp', // Fallback image
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
      if (lenisInstance) {
        lenisInstance.scrollTo(window.innerHeight, { duration: 1.5 })
      } else {
        window.scrollTo({
          top: window.innerHeight,
          behavior: 'smooth'
        })
      }
    } else if (heroData.primaryCta?.link) {
      window.open(heroData.primaryCta.link, '_self')
    }
  }
  
  const handleSecondaryCTA = () => {
    if (heroData.secondaryCta?.action === 'modal') {
      // In production, this would open a consultation modal
      console.log('Opening consultation modal...')
    } else if (heroData.secondaryCta?.link) {
      window.open(heroData.secondaryCta.link, '_self')
    }
  }
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  }
  
  const textVariants = {
    hidden: { 
      opacity: 0, 
      y: 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8
      }
    }
  }
  
  const titleVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1.2
      }
    }
  }
  
  const buttonVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6
      }
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
        className="absolute inset-0 w-full h-full"
        style={{ y: backgroundY }}
      >
        <Image
          {...backgroundImageProps}
          alt="Signature Collection Background"
          className="object-cover object-center scale-110" // Scale for parallax room
        />
        
        {/* Dynamic overlay based on data */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-kawai-black/40 via-kawai-black/60 to-kawai-black/80"
          style={{
            background: `linear-gradient(to bottom, 
              rgba(10, 10, 10, ${heroData.overlayOpacity || 0.6}), 
              rgba(10, 10, 10, ${(heroData.overlayOpacity || 0.6) + 0.2})
            )`
          }}
        />
      </motion.div>
      
      {/* Main Content */}
      <motion.div
        className={cn(
          "relative z-10 max-w-6xl mx-auto px-6 lg:px-8 flex flex-col",
          textAlignmentClasses[heroData.textAlignment || 'center']
        )}
        style={{ y: contentY }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Exclusive Text */}
        {heroData.exclusiveText && (
          <motion.div
            variants={textVariants}
            className="mb-6"
          >
            <span className="inline-block text-kawai-pearl/80 text-sm font-light tracking-[0.3em] uppercase border border-kawai-pearl/20 px-4 py-2 rounded-full backdrop-blur-sm bg-kawai-black/20">
              {heroData.exclusiveText}
            </span>
          </motion.div>
        )}
        
        {/* Main Title */}
        <motion.div 
          variants={titleVariants}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-light leading-none tracking-tight text-kawai-pearl">
            {heroData.titlePrefix && (
              <span className="block text-kawai-pearl/60 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extralight mb-2">
                {heroData.titlePrefix}
              </span>
            )}
            <span className="block font-normal">
              {heroData.titleMain}
            </span>
            {heroData.titleSuffix && (
              <span className="block text-kawai-pearl/80 text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extralight mt-2">
                {heroData.titleSuffix}
              </span>
            )}
          </h1>
        </motion.div>
        
        {/* Subtitle */}
        {heroData.subtitle && (
          <motion.h2 
            variants={textVariants}
            className="text-xl md:text-2xl lg:text-3xl font-light text-kawai-pearl/80 mb-6 max-w-3xl"
          >
            {heroData.subtitle}
          </motion.h2>
        )}
        
        {/* Description */}
        {heroData.description && (
          <motion.p 
            variants={textVariants}
            className="text-base md:text-lg text-kawai-pearl/70 font-light leading-relaxed mb-12 max-w-2xl"
          >
            {heroData.description}
          </motion.p>
        )}
        
        {/* CTA Buttons */}
        <motion.div 
          variants={buttonVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
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