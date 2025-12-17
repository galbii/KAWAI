'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface InstructorCredentialsProps {
  className?: string
}

const credentials = [
  {
    icon: '🎓',
    label: 'Master Degree Instructors',
    description: 'Advanced musical education'
  },
  {
    icon: '⏰',
    label: '15+ Years Experience',
    description: 'Proven teaching excellence'
  },
  {
    icon: '👥',
    label: '500+ Students Taught',
    description: 'Trusted track record'
  }
]

const certifications = [
  {
    icon: '✓',
    text: 'Certified by National Association for Music Education'
  },
  {
    icon: '✓',
    text: 'Background-checked & insured instructors'
  },
  {
    icon: '✓',
    text: 'Ongoing professional development & training'
  },
  {
    icon: '✓',
    text: 'Specialized in teaching children & beginners'
  }
]

export default function InstructorCredentials({ className }: InstructorCredentialsProps) {
  return (
    <section className={cn("py-16 sm:py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden", className)}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-kawai-gold rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-kawai-red rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif mb-6">
            Learn From Certified Experts
          </h2>
          <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto">
            World-class instruction from passionate, experienced educators
          </p>
        </motion.div>

        {/* Credentials Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {credentials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3 + index * 0.1 }}
              className="group text-center p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 hover:border-kawai-gold/50 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>

              {/* Label */}
              <p className="font-bold text-2xl text-kawai-gold mb-2">
                {item.label}
              </p>

              {/* Description */}
              <p className="text-gray-300 text-base">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Certifications List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 sm:p-12">
            <h3 className="text-2xl sm:text-3xl font-serif text-center mb-8 text-kawai-gold">
              Our Commitment to Excellence
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-kawai-gold/20 flex items-center justify-center mt-0.5">
                    <svg className="w-5 h-5 text-kawai-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-white text-base sm:text-lg leading-relaxed flex-1">
                    {cert.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.9 }}
          className="mt-16 text-center"
        >
          <p className="text-xl sm:text-2xl text-gray-300 font-semibold">
            Your child deserves the best. That's exactly what we deliver.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
