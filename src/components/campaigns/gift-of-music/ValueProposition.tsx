'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ValuePropositionProps {
  className?: string
}

const values = [
  {
    icon: '🎹',
    title: '45-Minute Private Lesson',
    value: '$75 Value',
    description: 'Learn your first song in one session with personalized instruction'
  },
  {
    icon: '💰',
    title: 'Registration Fee WAIVED',
    value: '$100 Value',
    description: 'No upfront costs or hidden fees - start learning immediately'
  },
  {
    icon: '📋',
    title: 'Personalized Learning Plan',
    value: 'Included',
    description: 'Customized curriculum tailored to skill level & musical goals'
  },
  {
    icon: '⭐',
    title: 'Professional Assessment',
    value: 'Included',
    description: 'Expert guidance from nationally certified instructors'
  }
]

export default function ValueProposition({ className }: ValuePropositionProps) {
  return (
    <section className={cn("py-16 sm:py-24 bg-gradient-to-br from-white via-gray-50 to-white", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-gray-900 mb-4">
            What Your Child Gets <span className="text-kawai-red">(FREE)</span>
          </h2>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto">
            Over $175 in value - completely free this holiday season
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {values.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
              className="group relative p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-kawai-gold/70 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="font-bold text-xl text-gray-900 mb-3 leading-tight">
                {item.title}
              </h3>

              {/* Value */}
              <p className="text-2xl text-kawai-red font-bold mb-3">
                {item.value}
              </p>

              {/* Description */}
              <p className="text-base text-gray-600 leading-relaxed">
                {item.description}
              </p>

              {/* Decorative element */}
              <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-kawai-red/10 to-kawai-gold/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
