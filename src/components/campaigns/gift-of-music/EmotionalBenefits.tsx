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
    label: 'Discipline',
    description: 'Build consistency in practice that transfers to careers, academics, and long-term goals'
  },
  {
    label: 'Performance Confidence',
    description: 'Learn to execute under pressure—from recitals to presentations to high-stakes meetings'
  },
  {
    label: 'Emotional Communication',
    description: 'Express complex feelings nonverbally—a skill that deepens relationships and self-awareness'
  },
  {
    label: 'Intrinsic Excellence',
    description: 'Develop internal standards that drive quality work, regardless of recognition or reward'
  },
  {
    label: 'Pattern Recognition',
    description: 'Train your brain to decode complexity—applicable to problem-solving across all fields'
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

        {/* Benefits Grid - Clean Typography Focused */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-24">
          {benefits.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
                ease: "easeOut"
              }}
              className="group relative"
            >
              {/* Minimal Card - Pure White with Strong Shadow */}
              <div className="relative p-8 lg:p-10 bg-white/95 backdrop-blur-sm rounded-none border-l-4 border-gradient-to-b from-kawai-red via-kawai-gold to-emerald-600 hover:bg-white transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
                {/* Festive Corner Accent - Subtle Star/Ornament Shape */}
                <div className="absolute top-0 right-0 w-16 h-16">
                  <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-kawai-gold/20" />
                  <div className="absolute top-2 right-2 text-kawai-gold/30 text-xs">✦</div>
                </div>

                {/* Content */}
                <div className="relative">
                  {/* Title */}
                  <h3 className="font-serif text-2xl sm:text-3xl mb-4 text-kawai-black leading-tight">
                    {item.label}
                  </h3>

                  {/* Description */}
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-light">
                    {item.description}
                  </p>

                  {/* Festive Decorative Element - Holiday Colors */}
                  <div className="mt-6 w-12 h-0.5 bg-gradient-to-r from-kawai-red via-kawai-gold to-emerald-600 group-hover:w-20 transition-all duration-300" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA - Minimalist */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-center"
        >
          <div className="inline-block px-12 py-8 bg-white/95 backdrop-blur-sm border-t-4 border-gradient-to-r from-kawai-red via-kawai-gold to-emerald-600 shadow-[0_8px_30px_rgba(0,0,0,0.4)] relative">
            {/* Festive corner decorations */}
            <div className="absolute -top-2 left-8 text-kawai-red text-xl opacity-50">✦</div>
            <div className="absolute -top-2 right-8 text-emerald-600 text-xl opacity-50">✦</div>

            <p className="text-2xl sm:text-3xl lg:text-4xl text-kawai-black font-serif leading-relaxed mb-2">
              Give the gift that keeps giving
            </p>

            <p className="text-xs sm:text-sm text-gray-600 mb-6 font-light">
              Spots are limited
            </p>

            <div className="w-32 h-1 bg-gradient-to-r from-kawai-red via-kawai-gold to-emerald-600 mx-auto mb-8 shadow-md" />

            {/* Reserve Now CTA */}
            <button
              onClick={onCTAClick}
              className="bg-gradient-to-r from-kawai-red via-kawai-gold to-emerald-600 hover:shadow-lg text-white px-10 py-4 font-bold text-lg transition-all duration-300 hover:scale-105 shadow-md"
            >
              Reserve Now
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
