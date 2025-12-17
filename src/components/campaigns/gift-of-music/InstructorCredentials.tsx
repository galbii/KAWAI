'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface InstructorCredentialsProps {
  className?: string
}

const facultyCredentials = [
  {
    label: 'Award-Winning Artists',
    subtitle: 'Competition Champions',
    description: 'Faculty members are competition winners, having earned accolades in prestigious national and international music competitions including Korean Culture & Arts National, National Youth Music, and VMP National competitions'
  },
  {
    label: 'Elite Musical Education',
    subtitle: 'Conservatory-Trained',
    description: 'Our instructors hold degrees from world-renowned institutions: Johns Hopkins Peabody Institute, University of Texas at Austin, Southern Methodist University, and University of North Texas'
  },
  {
    label: 'Active Professional Musicians',
    subtitle: 'Real-World Experience',
    description: 'Faculty regularly perform at professional venues and host masterclasses with internationally renowned guest artists, bringing current performance expertise directly into the studio'
  }
]

const facilityHighlights = [
  'State-of-the-art 200-seat concert hall with professional acoustics and live streaming capability',
  'World-class instruments including the Shigeru Kawai SK-EX concert grand—Kawai\'s flagship piano',
  'Professional recording studios with soundproof rooms for optimal learning environment',
  'Partnership with Dallas Jazz Piano Society for professional concert opportunities and masterclasses'
]

export default function InstructorCredentials({ className }: InstructorCredentialsProps) {
  return (
    <section className={cn("py-24 sm:py-32 lg:py-40 bg-gradient-to-br from-gray-900 via-kawai-black to-gray-900 text-white relative overflow-hidden", className)}>
      {/* Subtle background accents */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-kawai-gold rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-kawai-red rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif mb-6 leading-tight">
            Learn From Award-Winning
            <br />
            <span className="text-kawai-gold">Professional Musicians</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-kawai-red via-kawai-gold to-emerald-600 mx-auto mb-8" />
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
            Dallas's premier music academy with competition-winning faculty and world-class facilities since 2018
          </p>
        </motion.div>

        {/* Faculty Credential Cards */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-10 mb-20">
          {facultyCredentials.map((item, index) => (
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
              {/* Minimalist Card */}
              <div className="relative p-8 lg:p-10 bg-white/5 backdrop-blur-sm rounded-none border-l-4 border-kawai-gold hover:border-white hover:bg-white/10 transition-all duration-300">
                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-16 h-16">
                  <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-kawai-gold/20" />
                  <div className="absolute top-2 right-2 text-kawai-gold/30 text-xs">✦</div>
                </div>

                {/* Content */}
                <div className="relative">
                  {/* Subtitle */}
                  <p className="text-sm sm:text-base text-kawai-gold mb-3 font-light tracking-wide uppercase">
                    {item.subtitle}
                  </p>

                  {/* Title */}
                  <h3 className="font-serif text-2xl sm:text-3xl mb-6 text-white leading-tight">
                    {item.label}
                  </h3>

                  {/* Description */}
                  <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-light">
                    {item.description}
                  </p>

                  {/* Decorative Line */}
                  <div className="mt-6 w-12 h-0.5 bg-gradient-to-r from-kawai-red via-kawai-gold to-emerald-600 group-hover:w-20 transition-all duration-300" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* World-Class Facility Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-white/5 backdrop-blur-md rounded-none border-t-4 border-kawai-gold p-8 sm:p-12 lg:p-16">
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

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-center mb-4 text-kawai-gold">
              A Premium Learning Environment
            </h3>
            <p className="text-center text-base sm:text-lg text-gray-400 font-light mb-12 max-w-2xl mx-auto">
              State-of-the-art facilities designed for serious musical education
            </p>

            <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
              {facilityHighlights.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-2 h-2 bg-kawai-gold rounded-full mt-2.5" />
                  <p className="text-white text-base sm:text-lg lg:text-xl leading-relaxed font-light flex-1">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-xl sm:text-2xl lg:text-3xl text-white/90 font-serif leading-relaxed mb-2">
            Train with faculty who perform on world stages and hold degrees from the nation's top conservatories
          </p>
          <p className="text-sm sm:text-base text-gray-400 font-light">
            Limited enrollment. Expert instruction at this level is inherently exclusive.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
