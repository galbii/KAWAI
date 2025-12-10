/**
 * DealerRSVPSection Component - NAMM 2026
 *
 * Premium RSVP call-to-action section with bold gradient
 * Features:
 * - Burgundy to Gold gradient background
 * - Large prominent RSVP button
 * - Urgency badge with countdown/deadline
 * - Contact information for inquiries
 * - Framer Motion entrance animations
 * - High contrast design for maximum visibility
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Calendar, Mail, Phone, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DealerRSVPSectionProps {
  className?: string
  rsvpLink?: string
}

export default function DealerRSVPSection({
  className,
  rsvpLink = '#rsvp-form'
}: DealerRSVPSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for entrance animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className={cn(
        "py-24 lg:py-32 relative overflow-hidden",
        className
      )}
    >
      {/* Bold gradient background: Burgundy to Gold */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#8B4513] via-[#A0522D] to-[#D4AF37]" />

      {/* Decorative light rays effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-white via-transparent to-transparent blur-sm" />
        <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-white via-transparent to-transparent blur-sm" />
        <div className="absolute top-0 right-1/4 w-1 h-full bg-gradient-to-b from-white via-transparent to-transparent blur-sm" />
      </div>

      {/* Subtle sparkle pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 60% 70%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
          backgroundSize: '100px 100px, 150px 150px, 120px 120px',
          backgroundPosition: '0 0, 50px 50px, 25px 75px'
        }} />
      </div>

      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/10 to-black/30" />

      <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-10 text-center">
        {/* Urgency Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={isVisible ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg mb-8"
        >
          <Sparkles className="w-5 h-5 text-white animate-pulse" />
          <span className="text-white font-semibold text-sm tracking-wide">
            RSVP REQUIRED BY JANUARY 15, 2026
          </span>
          <Sparkles className="w-5 h-5 text-white animate-pulse" />
        </motion.div>

        {/* Main Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-tight"
        >
          Secure Your Spot Today
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xl md:text-2xl font-light leading-relaxed text-white/90 max-w-2xl mx-auto mb-12"
        >
          Join us for an unforgettable evening. Limited seating available for this exclusive event.
        </motion.p>

        {/* Large RSVP Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={isVisible ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <a
            href={rsvpLink}
            className={cn(
              'group inline-flex items-center justify-center gap-4',
              'px-12 py-6 rounded-2xl',
              'bg-white text-[#8B4513] font-bold text-xl',
              'border-4 border-[#D4AF37]',
              'shadow-[0_0_40px_rgba(212,175,55,0.5)]',
              'hover:shadow-[0_0_60px_rgba(212,175,55,0.8)]',
              'hover:scale-110 hover:border-white',
              'transition-all duration-500 ease-out',
              'relative overflow-hidden'
            )}
          >
            {/* Animated glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />

            <Calendar className="w-7 h-7" />
            <span>Reserve Your Spot</span>
            <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform duration-300" />
          </a>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={isVisible ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mb-12 max-w-md mx-auto"
        />

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="space-y-6"
        >
          <p className="text-lg text-white/80 font-medium">
            Already registered? Contact us with questions:
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
            {/* Email */}
            <a
              href="mailto:dealers@kawaius.com"
              className={cn(
                'group inline-flex items-center gap-3',
                'px-6 py-3 rounded-xl',
                'bg-white/10 backdrop-blur-sm',
                'border border-white/20',
                'hover:bg-white/20 hover:border-white/40',
                'transition-all duration-300'
              )}
            >
              <Mail className="w-5 h-5 text-white" />
              <span className="text-white font-medium">
                dealers@kawaius.com
              </span>
            </a>

            {/* Phone */}
            <a
              href="tel:+18004212177"
              className={cn(
                'group inline-flex items-center gap-3',
                'px-6 py-3 rounded-xl',
                'bg-white/10 backdrop-blur-sm',
                'border border-white/20',
                'hover:bg-white/20 hover:border-white/40',
                'transition-all duration-300'
              )}
            >
              <Phone className="w-5 h-5 text-white" />
              <span className="text-white font-medium">
                1-800-421-2177
              </span>
            </a>
          </div>
        </motion.div>

        {/* Decorative sparkles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute top-1/4 left-1/4 pointer-events-none"
        >
          <Sparkles className="w-6 h-6 text-white/30 animate-pulse" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-1/3 right-1/4 pointer-events-none"
        >
          <Sparkles className="w-8 h-8 text-white/20 animate-pulse" style={{ animationDelay: '0.5s' }} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute top-1/3 right-1/3 pointer-events-none"
        >
          <Sparkles className="w-5 h-5 text-white/25 animate-pulse" style={{ animationDelay: '1s' }} />
        </motion.div>
      </div>
    </section>
  )
}
