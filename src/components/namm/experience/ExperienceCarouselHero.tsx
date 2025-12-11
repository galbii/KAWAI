'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50 z-10" />

          {/* Hero Video */}
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="https://pub-486ee03121a24ede8b51409434e22709.r2.dev/pianos/crystal/kling_20251211_Image_to_Video_animate_wa_2196_0.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-20 flex min-h-screen items-center justify-center px-4">
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl text-center"
        >
          <h1 className="mb-6 text-5xl font-light tracking-tight text-white md:text-7xl lg:text-8xl" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.9), 0 2px 4px rgba(0, 0, 0, 0.8)' }}>
            Experience the Kawai Booth
            <br />
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.9), 0 2px 4px rgba(0, 0, 0, 0.8)' }}>
              at NAMM 2026
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg font-light text-gray-300 md:text-xl lg:text-2xl" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.9), 0 1px 3px rgba(0, 0, 0, 0.8)' }}>
            Step into innovation. Discover our latest pianos and revolutionary technology.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
