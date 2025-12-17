'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface EmotionalBenefitsProps {
  className?: string
}

const benefits = [
  {
    icon: '🎯',
    label: 'Discipline',
    description: 'Regular practice builds strong work ethic and dedication',
    color: 'from-purple-500/20 to-pink-500/20'
  },
  {
    icon: '🧩',
    label: 'Problem-Solving',
    description: 'Learning music develops critical thinking skills',
    color: 'from-blue-500/20 to-cyan-500/20'
  },
  {
    icon: '✨',
    label: 'Confidence',
    description: 'Performing builds unshakeable self-esteem',
    color: 'from-yellow-500/20 to-orange-500/20'
  },
  {
    icon: '❤️',
    label: 'Emotional Intelligence',
    description: 'Music teaches expression and understanding feelings',
    color: 'from-red-500/20 to-pink-500/20'
  },
  {
    icon: '🏆',
    label: 'Achievement',
    description: 'Mastering songs creates a sense of accomplishment',
    color: 'from-green-500/20 to-emerald-500/20'
  },
  {
    icon: '🤝',
    label: 'Social Skills',
    description: 'Music brings people together and builds community',
    color: 'from-indigo-500/20 to-purple-500/20'
  }
]

export default function EmotionalBenefits({ className }: EmotionalBenefitsProps) {
  return (
    <section className={cn("py-16 sm:py-24 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white relative overflow-hidden", className)}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-kawai-gold rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-600 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif mb-6">
            Music Lessons Teach More Than Notes
          </h2>
          <p className="text-xl sm:text-2xl text-emerald-200 max-w-3xl mx-auto">
            These aren't just music lessons. They're life lessons that shape character and build resilience.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
              className="group relative p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 hover:border-kawai-gold/50 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Gradient background */}
              <div className={cn(
                "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                item.color
              )} />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>

                {/* Title */}
                <h3 className="font-bold text-2xl mb-3 text-kawai-gold group-hover:text-white transition-colors duration-300">
                  {item.label}
                </h3>

                {/* Description */}
                <p className="text-base text-emerald-100 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="mt-16 text-center"
        >
          <p className="text-xl sm:text-2xl text-white/90 font-semibold">
            Give your child the gift that keeps giving - for a lifetime.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
