'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface ValuePropositionProps {
  className?: string
}

const values = [
  {
    title: 'Complimentary Private Lesson',
    value: '45 Minutes',
    description: 'Train on professional-grade instruments in soundproof studios—the same facility trusted by Dallas Jazz Piano Society for professional concerts'
  },
  {
    title: 'Join a Gifted Community',
    value: 'Exclusive',
    description: 'Join a community of gifted individuals under the instruction of professional and accomplished instructors'
  },
  {
    title: 'Zero Enrollment Barriers',
    value: 'Registration Waived',
    description: 'Immediate access with no registration fees or hidden costs—join a community of students learning from competition-winning faculty'
  },
  {
    title: 'Personalized Assessment & Plan',
    value: 'Tailored',
    description: 'Custom curriculum designed by conservatory-trained instructors who\'ve won national competitions and hold degrees from Johns Hopkins Peabody Institute'
  }
]

export default function ValueProposition({ className }: ValuePropositionProps) {
  return (
    <section className={cn("py-24 sm:py-32 lg:py-40 bg-gradient-to-br from-gray-50 via-white to-gray-50", className)}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          {/* KMS Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/images/kms/KMS Logo.png"
              alt="KMS Music School"
              width={400}
              height={50}
              className="h-12 sm:h-14 w-auto opacity-90"
            />
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-kawai-black mb-6 leading-tight">
            <span className="text-kawai-red">Learn from the Best</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-kawai-red via-kawai-gold to-emerald-600 mx-auto mb-8" />
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            Study with accomplished instructors who bring professional experience and proven teaching methods to every lesson
          </p>
        </motion.div>

        {/* Value Cards */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10 mb-16">
          {values.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut"
              }}
              className="group relative"
            >
              {/* Clean White Card */}
              <div className="relative p-8 lg:p-10 bg-white rounded-none border-l-4 border-kawai-gold hover:border-kawai-red transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-16 h-16">
                  <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-kawai-gold/20" />
                  <div className="absolute top-2 right-2 text-kawai-gold/30 text-xs">✦</div>
                </div>

                {/* Content */}
                <div className="relative">
                  {/* Value Badge */}
                  <div className="inline-block mb-4">
                    <span className="text-2xl sm:text-3xl font-bold text-kawai-red">
                      {item.value}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-2xl sm:text-3xl mb-4 text-kawai-black leading-tight">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-light">
                    {item.description}
                  </p>

                  {/* Decorative Line */}
                  <div className="mt-6 w-12 h-0.5 bg-gradient-to-r from-kawai-red via-kawai-gold to-emerald-600 group-hover:w-20 transition-all duration-300" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Facility Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600 font-light"
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-kawai-gold rounded-full" />
            <span>Est. 2018</span>
          </div>
          <div className="w-px h-4 bg-gray-300" />
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-kawai-gold rounded-full" />
            <span>200-Seat Concert Hall</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
