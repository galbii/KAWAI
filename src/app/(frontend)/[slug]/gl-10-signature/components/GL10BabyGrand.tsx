'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Award, Home, Sparkles, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
}

const FEATURES: Feature[] = [
  {
    icon: <Home className="w-8 h-8" />,
    title: 'Compact Excellence',
    description: 'At just 5\'0", the GL-10 fits perfectly in any room while delivering the full grand piano experience you\'ve always dreamed of.'
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: 'No Compromise',
    description: 'Don\'t let the size fool you. The GL-10 features the same premium materials and construction as larger grand pianos.'
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: 'Award-Winning Design',
    description: 'Recognized globally for exceptional tone, touch, and craftsmanship that sets the standard for baby grand pianos.'
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: 'Handcrafted Heritage',
    description: 'Meticulously crafted in Japan by master artisans using techniques refined over 95 years of piano-making excellence.'
  }
]

interface Specification {
  label: string
  value: string
}

const SPECIFICATIONS: Specification[] = [
  { label: 'Length', value: '5\'0" (153 cm)' },
  { label: 'Width', value: '59" (150 cm)' },
  { label: 'Height', value: '40" (101 cm)' },
  { label: 'Weight', value: '606 lbs (275 kg)' },
  { label: 'Soundboard', value: 'Tapered Solid Spruce' },
  { label: 'Action', value: 'Millennium III' },
  { label: 'Hammers', value: 'Mahogany Core, Premium Felt' },
  { label: 'Keys', value: '88 Keys, Extended Key Length' },
  { label: 'Pedals', value: 'Soft, Sostenuto, Damper' },
  { label: 'Finish Options', value: 'Polished Ebony, Satin Walnut' }
]

export default function GL10BabyGrand() {
  return (
    <section className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-kawai-charcoal mb-6">
            The Perfect Balance of
            <br />
            <span className="text-[#8B7355]">Size and Sound</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The GL-10 Baby Grand represents the pinnacle of compact piano design,
            delivering exceptional performance without compromise.
          </p>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full h-[400px] md:h-[600px] rounded-3xl overflow-hidden mb-20 shadow-2xl"
        >
          <Image
            src="/images/gl10-hero.jpg"
            alt="GL-10 Baby Grand Piano"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 90vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </motion.div>

        {/* Features Grid */}
        <div className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl md:text-4xl font-serif text-kawai-charcoal text-center mb-12"
          >
            Exceptional in Every Way
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className={cn(
                  'group relative p-8 rounded-2xl',
                  'bg-gradient-to-br from-kawai-pearl to-white',
                  'border border-[#8B7355]/10',
                  'hover:shadow-xl hover:scale-[1.02]',
                  'transition-all duration-300'
                )}
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-[#8B7355] to-[#D4AF37] text-white mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-kawai-charcoal mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Specifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-br from-kawai-charcoal to-gray-900 rounded-3xl p-8 md:p-12 text-white"
        >
          <h2 className="text-3xl md:text-4xl font-serif text-center mb-12">
            Technical Specifications
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 max-w-4xl mx-auto">
            {SPECIFICATIONS.map((spec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.05 }}
                className="flex justify-between items-baseline pb-3 border-b border-white/10"
              >
                <span className="text-gray-400 font-medium">{spec.label}</span>
                <span className="text-white font-semibold text-right">{spec.value}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Comparison Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-20 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-serif text-kawai-charcoal mb-8">
            Why Choose the GL-10?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="p-6 rounded-2xl bg-white border-2 border-[#8B7355]/20">
              <div className="text-4xl font-bold text-[#8B7355] mb-2">5'0"</div>
              <div className="text-sm text-gray-600">Perfect for apartments, studios, and intimate spaces</div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#8B7355]/10 to-[#D4AF37]/10 border-2 border-[#8B7355]">
              <div className="text-4xl font-bold text-kawai-red mb-2">GL-10</div>
              <div className="text-sm text-gray-900 font-medium">The sweet spot: Grand sound in a compact package</div>
            </div>

            <div className="p-6 rounded-2xl bg-white border-2 border-[#8B7355]/20">
              <div className="text-4xl font-bold text-[#8B7355] mb-2">5'5"+</div>
              <div className="text-sm text-gray-600">Larger grands require significant floor space</div>
            </div>
          </div>

          <p className="mt-8 text-gray-600 max-w-3xl mx-auto">
            The GL-10 delivers 95% of the performance of a 5'5" grand piano while occupying 30% less floor space—making it the ideal choice for discerning pianists with space constraints.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
