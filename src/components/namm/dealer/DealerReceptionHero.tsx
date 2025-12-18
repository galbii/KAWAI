'use client'

/**
 * DealerReceptionHero Component
 *
 * Static hero section for NAMM 2026 Dealer Reception page
 * Features elegant design with KAWAI branding and exclusive event messaging
 */

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function DealerReceptionHero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showGreeting, setShowGreeting] = useState(true)
  const [showContent, setShowContent] = useState(false)

  // Set video to start at 9 seconds
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 9
    }
  }, [])

  // Handle greeting animation sequence
  useEffect(() => {
    // Show greeting for 3 seconds
    const greetingTimer = setTimeout(() => {
      setShowGreeting(false)
    }, 3000)

    // Show main content after greeting fades out (3s + 0.5s fade out)
    const contentTimer = setTimeout(() => {
      setShowContent(true)
    }, 3500)

    return () => {
      clearTimeout(greetingTimer)
      clearTimeout(contentTimer)
    }
  }, [])

  const scrollToEventDetails = () => {
    const eventDetailsSection = document.getElementById('event-details')
    if (eventDetailsSection) {
      eventDetailsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden pt-16"
      aria-label="NAMM 2026 Dealer Reception Invitation"
    >
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        style={{ willChange: 'transform' }}
        aria-hidden="true"
      >
        <source src="/assets/videos/Hero_compressed.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay for Text Readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10" />

      {/* Subtle red and gold glow overlays */}
      <div className="absolute inset-0 z-[11]">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-[#C41E3A]/10 rounded-full blur-[120px] opacity-30" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#D4AF37]/10 rounded-full blur-[100px] opacity-20" />
      </div>

      {/* Content Container */}
      <div className="relative z-20 flex min-h-screen items-center justify-center px-6 py-20">
        <div className="max-w-6xl w-full">

          {/* Greeting - "You're Invited" */}
          <AnimatePresence>
            {showGreeting && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-white">
                  You're Invited
                </h2>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content - Shows after greeting */}
          {showContent && (
            <>
              {/* Event Badge */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0 }}
                className="flex justify-center mb-12"
              >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 backdrop-blur-sm">
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-sm font-medium text-[#D4AF37] uppercase tracking-wide">
                January 23, 2026 • 6:00 PM - 9:00 PM
              </span>
            </div>
          </motion.div>

              {/* NAMM Show Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex justify-center mb-6"
              >
            <div className="relative w-full max-w-[180px] aspect-[2/1]">
              <Image
                src="/images/namm/NS_Logo_Dark.png"
                alt="The NAMM Show"
                fill
                className="object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                priority
                sizes="180px"
              />
            </div>
          </motion.div>

              {/* KAWAI Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex justify-center mb-12"
              >
            <div className="relative w-full max-w-2xl aspect-[5/1]">
              <Image
                src="/images/Kawai (Red)(2).png"
                alt="KAWAI"
                fill
                className="object-contain drop-shadow-[0_0_30px_rgba(196,30,58,0.3)]"
                priority
                sizes="(max-width: 768px) 90vw, 672px"
              />
            </div>
          </motion.div>

              {/* Main Heading */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center mb-8"
              >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white mb-4">
              Dealer Reception
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#C41E3A] to-transparent mx-auto" />
          </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="max-w-3xl mx-auto text-center mb-12"
              >
            <p className="text-xl md:text-2xl lg:text-3xl font-light text-gray-200 leading-relaxed mb-6">
              Join us for an <span className="text-[#D4AF37] font-normal">exclusive evening</span> where we'd like to express our appreciation with fine food, craft cocktails, and exciting announcements.
            </p>
            <p className="text-lg md:text-xl text-gray-300 font-light">
              We're also offering <span className="text-[#D4AF37] font-medium">exclusive pricing opportunities</span> available only to those who attend!
            </p>
          </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex justify-center mb-16"
              >
            <button
              onClick={scrollToEventDetails}
              className={cn(
                'group relative inline-flex items-center gap-3 px-10 py-5 rounded-full overflow-hidden',
                'bg-gradient-to-r from-[#C41E3A] to-[#A01828]',
                'text-white font-semibold text-lg',
                'transition-all duration-300',
                'shadow-[0_0_30px_rgba(196,30,58,0.4)] hover:shadow-[0_0_50px_rgba(196,30,58,0.6)]',
                'hover:scale-105 active:scale-95',
                'border border-[#C41E3A]/50'
              )}
            >
              <span className="relative z-10">Learn More</span>
              <svg
                className="relative z-10 w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>

              {/* Shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
            </button>
          </motion.div>

              {/* Scroll Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="flex justify-center"
              >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-3"
            >
              <span className="text-xs font-light uppercase tracking-widest text-gray-500">
                Scroll to Explore
              </span>
              <div className="w-px h-16 bg-gradient-to-b from-[#D4AF37] via-[#D4AF37]/50 to-transparent" />
              </motion.div>
              </motion.div>
            </>
          )}

        </div>
      </div>
    </section>
  )
}
