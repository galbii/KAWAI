'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface EmotionalBenefitsProps {
  className?: string
  onCTAClick?: () => void
}

const benefits = [
  {
    label: 'Focus',
    description: 'Learn to tune out distractions and concentrate on what matters'
  },
  {
    label: 'Confidence',
    description: 'Feel proud as you watch yourself improve'
  },
  {
    label: 'Stress Relief',
    description: 'Find a creative outlet to relax and unwind'
  },
  {
    label: 'Community',
    description: 'Join individuals who have impacted the music industry'
  }
]

export default function EmotionalBenefits({ className, onCTAClick }: EmotionalBenefitsProps) {
  return (
    <section className={cn("relative py-32 sm:py-40 lg:py-48 overflow-hidden", className)}>
      {/* Crystal Piano Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://pub-486ee03121a24ede8b51409434e22709.r2.dev/pianos/crystal/DSC_1820_sRGB.jpg"
          alt="Crystal Piano"
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />

        {/* Very subtle overlay - just for text readability */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Subtle Christmas Snowflakes - Floating Animation */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute text-white/40 animate-[fall_linear_infinite]"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                fontSize: `${Math.random() * 8 + 8}px`,
                animationDuration: `${Math.random() * 10 + 15}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            >
              ❄
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.4;
          }
          90% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif text-white mb-6 leading-tight tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] relative">
            Music Lessons Teach
            <br />
            More Than Notes
            {/* Subtle festive sparkles */}
            <span className="absolute -top-4 -right-4 text-kawai-gold text-2xl opacity-60 animate-pulse">✨</span>
            <span className="absolute top-1/2 -left-8 text-kawai-gold text-xl opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }}>✨</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-kawai-red via-kawai-gold to-emerald-600 mx-auto mb-8 shadow-lg" />
          <p className="text-lg sm:text-xl lg:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed font-light drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
            Life lessons that shape character and build resilience
          </p>
        </motion.div>

        {/* Benefits Grid - FAQ Style */}
        <div className="max-w-4xl mx-auto space-y-3 mb-24">
          {benefits.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.06,
                ease: "easeOut"
              }}
              className="group"
            >
              {/* Simple FAQ-Style Card - More Transparent & Compact */}
              <div className="bg-white/60 backdrop-blur-md p-4 sm:p-5 border-l-4 border-kawai-red shadow-[0_2px_15px_rgba(0,0,0,0.25)] hover:bg-white/70 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-300">
                <div className="flex items-start gap-3">
                  {/* Decorative Accent */}
                  <div className="flex-shrink-0 w-1.5 h-1.5 bg-kawai-gold rounded-full mt-1.5" />

                  {/* Content */}
                  <div className="flex-1">
                    {/* Title - FAQ Style */}
                    <h3 className="font-bold text-lg sm:text-xl mb-1 text-kawai-black">
                      {item.label}
                    </h3>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA - Compact & Transparent */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="bg-white/60 backdrop-blur-md px-8 py-5 border-t-4 border-kawai-red shadow-[0_2px_15px_rgba(0,0,0,0.25)] hover:bg-white/70 transition-all duration-300">
            <p className="text-xl sm:text-2xl lg:text-3xl text-kawai-black font-serif mb-1">
              Give the gift that keeps giving
            </p>

            <p className="text-xs sm:text-sm text-gray-700 mb-4 font-light">
              Spots are limited
            </p>

            {/* Reserve Now CTA */}
            <button
              onClick={onCTAClick}
              className="bg-gradient-to-r from-kawai-red via-kawai-gold to-emerald-600 hover:shadow-lg text-white px-8 py-3 font-bold text-base sm:text-lg transition-all duration-300 hover:scale-105 shadow-md"
            >
              Reserve Now
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
