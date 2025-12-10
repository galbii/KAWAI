/**
 * DealerEventDetailsSection Component - NAMM 2026 Dealer Reception
 *
 * Redesigned with attention-catching layout:
 * - Hero-style Date/Time/Venue section with dramatic typography
 * - Auto-playing carousel showcasing 5 experiences
 * - Compact grid for additional details
 * - Gold accents and premium aesthetic
 */

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Clock,
  MapPin,
  Wine,
  Piano,
  MessageSquare,
  UsersRound,
  Eye,
  ChevronLeft,
  ChevronRight,
  Users,
  Info
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface EventDetailsSectionProps {
  className?: string
}

interface CarouselSlide {
  id: number
  icon: React.ElementType
  title: string
  description: string
  gradient: string
}

const EXPERIENCE_SLIDES: CarouselSlide[] = [
  {
    id: 1,
    icon: Wine,
    title: 'Premium Cocktails & Cuisine',
    description: 'Enjoy carefully curated hors d\'oeuvres and signature cocktails throughout the evening',
    gradient: 'from-amber-900/20 via-orange-800/20 to-amber-900/20'
  },
  {
    id: 2,
    icon: Piano,
    title: 'Hands-On Experience',
    description: 'Try our exclusive instruments including the CR-45 Crystal Grand, HERALBONY collaboration, and revolutionary Novus hybrids',
    gradient: 'from-yellow-900/20 via-[#D4AF37]/20 to-yellow-900/20'
  },
  {
    id: 3,
    icon: MessageSquare,
    title: 'One-on-One Expertise',
    description: 'Meet with Kawai specialists for personalized consultations about our latest innovations and dealer programs',
    gradient: 'from-red-950/20 via-red-900/20 to-red-950/20'
  },
  {
    id: 4,
    icon: UsersRound,
    title: 'Connect with Peers',
    description: 'Network with fellow authorized dealers and industry professionals in an exclusive setting',
    gradient: 'from-slate-900/20 via-gray-800/20 to-slate-900/20'
  },
  {
    id: 5,
    icon: Eye,
    title: 'First Look at New Releases',
    description: 'Be among the first to see and experience our latest innovations before they\'re available to the public',
    gradient: 'from-purple-950/20 via-purple-900/20 to-purple-950/20'
  }
]

const AUTO_PLAY_INTERVAL = 4500 // 4.5 seconds

function ExperienceCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const totalSlides = EXPERIENCE_SLIDES.length

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1))
    }, AUTO_PLAY_INTERVAL)

    return () => clearInterval(interval)
  }, [currentSlide, isAutoPlaying, totalSlides])

  const handlePrevious = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))
    setIsAutoPlaying(false)
  }, [totalSlides])

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1))
    setIsAutoPlaying(false)
  }, [totalSlides])

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }, [])

  const currentExperience = EXPERIENCE_SLIDES[currentSlide]
  const IconComponent = currentExperience?.icon

  // Animation variants
  const slideVariants = {
    enter: {
      opacity: 0,
      x: 100,
      scale: 0.95
    },
    center: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
      }
    },
    exit: {
      opacity: 0,
      x: -100,
      scale: 0.95,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
      }
    }
  }

  return (
    <div
      className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-white via-[#F5F1E8] to-white border-2 border-[#D4AF37]/30 shadow-2xl shadow-[#D4AF37]/20"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Carousel content */}
      <div className="relative h-[400px] md:h-[500px] lg:h-[550px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 flex flex-col items-center justify-center p-8 md:p-12 lg:p-16"
          >
            {/* Background gradient */}
            <div className={cn(
              'absolute inset-0 bg-gradient-to-br',
              currentExperience?.gradient
            )} />

            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-[0.03]">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 20% 50%, currentColor 1px, transparent 1px)',
                backgroundSize: '32px 32px'
              }} />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center max-w-3xl">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
                className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8941F] text-white mb-8 shadow-lg shadow-[#D4AF37]/30"
              >
                {IconComponent && <IconComponent className="w-10 h-10 md:w-12 md:h-12" strokeWidth={1.5} />}
              </motion.div>

              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-3xl md:text-4xl lg:text-5xl font-light text-[#2C2826] mb-6 tracking-tight"
              >
                {currentExperience?.title}
              </motion.h3>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-lg md:text-xl lg:text-2xl font-light text-[#5A5550] leading-relaxed"
              >
                {currentExperience?.description}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between px-4 md:px-6 z-20">
          <button
            onClick={handlePrevious}
            className={cn(
              'flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full',
              'bg-[#D4AF37] text-white hover:bg-[#B8941F]',
              'shadow-lg hover:shadow-xl shadow-[#D4AF37]/30',
              'transition-all duration-300 hover:scale-110',
              'focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50'
            )}
            aria-label="Previous experience"
          >
            <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2.5} />
          </button>

          <button
            onClick={handleNext}
            className={cn(
              'flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full',
              'bg-[#D4AF37] text-white hover:bg-[#B8941F]',
              'shadow-lg hover:shadow-xl shadow-[#D4AF37]/30',
              'transition-all duration-300 hover:scale-110',
              'focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50'
            )}
            aria-label="Next experience"
          >
            <ChevronRight className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="relative bg-gradient-to-r from-[#F5F1E8] to-white py-6 px-4 border-t-2 border-[#D4AF37]/20">
        <div className="flex items-center justify-center gap-3">
          {EXPERIENCE_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'relative h-2.5 rounded-full transition-all duration-300',
                'focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50',
                currentSlide === index
                  ? 'w-16 bg-[#D4AF37] shadow-md shadow-[#D4AF37]/30'
                  : 'w-2.5 bg-[#D4AF37]/30 hover:bg-[#D4AF37]/50'
              )}
              aria-label={`Go to experience ${index + 1}`}
              aria-current={currentSlide === index}
            >
              {/* Progress indicator */}
              {currentSlide === index && isAutoPlaying && (
                <motion.div
                  className="absolute left-0 top-0 h-full rounded-full bg-[#B8941F]"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: AUTO_PLAY_INTERVAL / 1000, ease: 'linear' }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function DealerEventDetailsSection({
  className
}: EventDetailsSectionProps) {
  const [isTitleVisible, setIsTitleVisible] = useState(false)
  const [isHeroVisible, setIsHeroVisible] = useState(false)
  const titleRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  // Intersection observers
  useEffect(() => {
    const titleObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsTitleVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsHeroVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (titleRef.current) {
      titleObserver.observe(titleRef.current)
    }

    if (heroRef.current) {
      heroObserver.observe(heroRef.current)
    }

    return () => {
      titleObserver.disconnect()
      heroObserver.disconnect()
    }
  }, [])

  return (
    <section className={cn(
      "py-24 lg:py-32 relative overflow-hidden",
      className
    )}>
      {/* Warm beige gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F5F1E8] via-[#EDE8DF] to-[#F0EBE3]" />

      {/* Subtle paper texture overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noise)" /%3E%3C/svg%3E")',
            backgroundRepeat: 'repeat'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16 lg:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-[#2C2826] mb-6"
          >
            Event Details
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl font-light leading-relaxed text-[#5A5550] max-w-3xl mx-auto"
          >
            Join us for an exclusive evening of innovation, networking, and celebration
          </motion.p>
        </div>

        {/* "What to Expect" Carousel Section - MOVED TO TOP */}
        <motion.div
          ref={heroRef}
          initial={{ opacity: 0, y: 40 }}
          animate={isHeroVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="mb-16 lg:mb-24"
        >
          <div className="text-center mb-10">
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#2C2826] mb-4 tracking-tight">
              What to Expect
            </h3>
            <p className="text-lg md:text-xl font-light text-[#5A5550]">
              Five exceptional experiences await you
            </p>
          </div>

          <ExperienceCarousel />
        </motion.div>

        {/* Hero Date/Time/Venue Section - MOVED BELOW CAROUSEL */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isHeroVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-16 lg:mb-24"
        >
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-white via-[#F5F1E8] to-white border-4 border-[#D4AF37] shadow-2xl shadow-[#D4AF37]/30">
            {/* Gold accent frame decorations */}
            <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-[#D4AF37]/40 rounded-tl-3xl" />
            <div className="absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-[#D4AF37]/40 rounded-tr-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 border-b-4 border-l-4 border-[#D4AF37]/40 rounded-bl-3xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-[#D4AF37]/40 rounded-br-3xl" />

            {/* Radial gold glow effect */}
            <div className="absolute inset-0 bg-gradient-radial from-[#D4AF37]/10 via-transparent to-transparent opacity-50" />

            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-[0.03]">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 50% 50%, currentColor 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }} />
            </div>

            <div className="relative z-10 text-center py-16 px-8 md:py-20 md:px-12 lg:py-24 lg:px-16">
              {/* Date - Hero Typography */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isHeroVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-8"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8941F] text-white mb-6 shadow-xl shadow-[#D4AF37]/40">
                  <Calendar className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
                </div>
                <h3 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-[#2C2826] tracking-tight mb-2">
                  January 23, 2026
                </h3>
                <p className="text-sm md:text-base uppercase tracking-[0.3em] text-[#D4AF37] font-semibold">
                  Save the Date
                </p>
              </motion.div>

              {/* Time */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isHeroVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mb-8 pb-8 border-b-2 border-[#D4AF37]/20"
              >
                <div className="inline-flex items-center justify-center gap-3 mb-2">
                  <Clock className="w-8 h-8 md:w-10 md:h-10 text-[#D4AF37]" strokeWidth={1.5} />
                  <h4 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#2C2826] tracking-tight">
                    6:00 PM - 9:00 PM PST
                  </h4>
                </div>
                <p className="text-base md:text-lg text-[#5A5550] font-light">
                  Three hours of exclusive networking and experiences
                </p>
              </motion.div>

              {/* Venue */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isHeroVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="inline-flex items-center justify-center gap-3 mb-3">
                  <MapPin className="w-8 h-8 md:w-10 md:h-10 text-[#D4AF37]" strokeWidth={1.5} />
                  <h4 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#2C2826] tracking-tight">
                    Anaheim Convention Center
                  </h4>
                </div>
                <p className="text-lg md:text-xl text-[#5A5550] font-light mb-4">
                  Private Reception Hall
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8941F] shadow-lg shadow-[#D4AF37]/40">
                  <span className="text-xs md:text-sm uppercase tracking-wider text-white/90 font-medium">
                    Visit our booth
                  </span>
                  <span className="text-2xl md:text-3xl font-bold text-white">
                    #9110
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Grid - Additional Details */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isHeroVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid gap-6 md:grid-cols-2"
        >
          {/* Who Should Attend */}
          <div className="rounded-2xl p-6 md:p-8 bg-gradient-to-br from-white via-white to-[#F5F1E8]/30 border-2 border-[#D4AF37]/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#D4AF37]/10">
                <Users className="w-6 h-6 text-[#D4AF37]" strokeWidth={1.5} />
              </div>
              <h4 className="text-xl md:text-2xl font-light text-[#2C2826]">
                Who Should Attend
              </h4>
            </div>

            <ul className="space-y-3 text-sm md:text-base">
              <li className="flex items-start gap-2 text-[#5A5550]">
                <span className="text-[#D4AF37] mt-1 flex-shrink-0">•</span>
                <span><strong className="text-[#2C2826]">Authorized Kawai Dealers</strong> - Current partners in good standing</span>
              </li>
              <li className="flex items-start gap-2 text-[#5A5550]">
                <span className="text-[#D4AF37] mt-1 flex-shrink-0">•</span>
                <span><strong className="text-[#2C2826]">Prospective Partners</strong> - Interested in joining our family</span>
              </li>
              <li className="flex items-start gap-2 text-[#5A5550]">
                <span className="text-[#D4AF37] mt-1 flex-shrink-0">•</span>
                <span><strong className="text-[#2C2826]">Special Guests</strong> - VIP industry partners and stakeholders</span>
              </li>
              <li className="flex items-start gap-2 text-[#5A5550]">
                <span className="text-[#D4AF37] mt-1 flex-shrink-0">•</span>
                <span><strong className="text-[#2C2826]">Industry Professionals</strong> - Key decision makers</span>
              </li>
            </ul>
          </div>

          {/* Important Details */}
          <div className="rounded-2xl p-6 md:p-8 bg-gradient-to-br from-white via-white to-[#F5F1E8]/30 border-2 border-[#D4AF37]/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#D4AF37]/10">
                <Info className="w-6 h-6 text-[#D4AF37]" strokeWidth={1.5} />
              </div>
              <h4 className="text-xl md:text-2xl font-light text-[#2C2826]">
                Important Details
              </h4>
            </div>

            <div className="space-y-4 text-sm md:text-base">
              <div>
                <p className="font-semibold text-[#2C2826] mb-1">Dress Code</p>
                <p className="text-[#5A5550]">Business Casual / Cocktail Attire</p>
              </div>

              <div className="pt-4 border-t border-[#D4CFC7]">
                <p className="font-semibold text-[#2C2826] mb-1">Parking</p>
                <p className="text-[#5A5550]">Complimentary valet available</p>
              </div>

              <div className="pt-4 border-t border-[#D4CFC7]">
                <p className="font-semibold text-[#2C2826] mb-1">RSVP Deadline</p>
                <p className="text-[#D4AF37] font-bold text-lg">January 15, 2026</p>
                <p className="text-xs text-[#7A7570] mt-1">Limited capacity - reserve early</p>
              </div>

              <div className="pt-4 border-t border-[#D4CFC7]">
                <p className="font-semibold text-[#2C2826] mb-1">Questions?</p>
                <p className="text-[#5A5550]">Contact your regional representative</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
