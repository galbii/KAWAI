'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function ExperienceCarouselHero() {
  const videoRef = useRef<HTMLVideoElement>(null)

  // Play video when component mounts
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => console.log('Video autoplay failed:', err))
    }
  }, [])

  const overlayVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
      }
    }
  }

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-black pt-16"
      aria-label="NAMM 2026 Experience"
    >
      {/* Video Background */}
      <div className="absolute inset-0">
        <div className="relative h-full w-full">
          {/* Hero Video */}
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="https://pub-486ee03121a24ede8b51409434e22709.r2.dev/homepage/masterseriesnologo.webm" type="video/webm" />
          </video>
        </div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-20 flex min-h-screen items-start justify-center px-4 pt-20 md:pt-32">
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl text-center space-y-32"
        >
          {/* NAMM Show Logo */}
          <div className="relative w-full max-w-xs mx-auto mb-6">
            <Image
              src="/images/namm/NS26_Tag_TMBH_Aligned_White-PSD.png"
              alt="The NAMM Show"
              width={400}
              height={134}
              className="w-full h-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] filter"
              priority
            />
          </div>

          {/* Kawai Logo */}
          <div className="relative w-full max-w-3xl mx-auto">
            <Image
              src="/images/Kawai (Red)(2).png"
              alt="Kawai"
              width={1200}
              height={300}
              className="w-full h-auto drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)]"
              priority
            />
          </div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            {/* Primary CTA - View Collection */}
            <motion.a
              href="#pianos"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className={cn(
                "group inline-flex items-center justify-center gap-3",
                "px-12 py-5 rounded-xl min-w-[200px]",
                "w-full sm:w-auto",
                "bg-black hover:bg-zinc-900",
                "text-white text-xl font-medium tracking-wide",
                "shadow-xl shadow-black/40",
                "hover:shadow-2xl hover:shadow-black/50",
                "transition-all duration-300 ease-in-out",
                "hover:scale-110 active:scale-95",
                "focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent",
                "transform-gpu cursor-pointer"
              )}
            >
              <span>View Collection</span>
              <svg
                className={cn(
                  "w-6 h-6 transition-transform duration-200 ease-in-out",
                  "group-hover:translate-y-1"
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.a>

            {/* Secondary CTA - Event Details */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Link
                href="/namm-2026"
                className={cn(
                  "group inline-flex items-center justify-center gap-3",
                  "px-12 py-5 rounded-xl min-w-[200px]",
                  "w-full sm:w-auto",
                  "bg-black hover:bg-zinc-900",
                  "text-white text-xl font-medium tracking-wide",
                  "shadow-xl shadow-black/40",
                  "hover:shadow-2xl hover:shadow-black/50",
                  "transition-all duration-300 ease-in-out",
                  "hover:scale-110 active:scale-95",
                  "focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent",
                  "transform-gpu cursor-pointer"
                )}
              >
                <span>Event Details</span>
                <svg
                  className={cn(
                    "w-6 h-6 transition-transform duration-200 ease-in-out",
                    "group-hover:translate-x-1"
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
