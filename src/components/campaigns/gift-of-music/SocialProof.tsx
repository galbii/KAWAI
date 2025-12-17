'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SocialProofProps {
  className?: string
}

const testimonials = [
  {
    stars: 5,
    text: "My daughter went from shy to confident in just 3 months. The instructors are incredible! She looks forward to every lesson.",
    author: "Sarah M.",
    role: "Parent of 7-year-old",
    highlight: "shy to confident"
  },
  {
    stars: 5,
    text: "Best decision we made. My son practices every day without being asked. He loves it and has already performed twice!",
    author: "Michael T.",
    role: "Parent of 8-year-old",
    highlight: "practices every day"
  },
  {
    stars: 5,
    text: "The personalized approach made all the difference. Our daughter is now playing pieces we never thought possible at her age!",
    author: "Jennifer L.",
    role: "Parent of 9-year-old",
    highlight: "personalized approach"
  }
]

const stats = [
  { number: '230+', label: 'Happy Families' },
  { number: '15+', label: 'Years Teaching' },
  { number: '4.9/5', label: 'Average Rating' },
  { number: '500+', label: 'Students Taught' }
]

export default function SocialProof({ className }: SocialProofProps) {
  return (
    <section className={cn("py-16 sm:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-gray-900 mb-4">
            What Parents Are Saying
          </h2>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto">
            Real families, real transformations
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.1 + index * 0.1 }}
              className="text-center p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-kawai-gold/50 transition-all duration-300 hover:shadow-lg"
            >
              <p className="text-4xl sm:text-5xl font-bold text-kawai-red mb-2">
                {stat.number}
              </p>
              <p className="text-sm sm:text-base text-gray-600 font-semibold">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.5 + index * 0.1 }}
              className="group relative p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-kawai-gold/70 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Quote mark decoration */}
              <div className="absolute top-6 right-6 text-6xl text-kawai-gold/10 font-serif leading-none">
                "
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-6">
                {[...Array(testimonial.stars)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-6 h-6 fill-yellow-500"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 mb-8 text-lg leading-relaxed relative z-10">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="border-t-2 border-gray-100 pt-6">
                <p className="font-bold text-gray-900 text-lg mb-1">
                  {testimonial.author}
                </p>
                <p className="text-sm text-gray-600">
                  {testimonial.role}
                </p>
              </div>

              {/* Decorative gradient */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-kawai-red/5 to-kawai-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-full border-2 border-emerald-200">
            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-emerald-900 font-semibold text-lg">
              Trusted by families since 2009
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
