'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Zap, Target, Activity, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Benefit {
  icon: React.ReactNode
  title: string
  description: string
  stat?: string
}

const BENEFITS: Benefit[] = [
  {
    icon: <Zap className="w-8 h-8" />,
    title: 'Lightning-Fast Repetition',
    description: 'ABS-Carbon composite parts are 30% lighter than traditional wood, allowing for faster key return and improved note repetition.',
    stat: '30% Lighter'
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: 'Unmatched Precision',
    description: 'CNC machined to tolerances of 0.01mm, ensuring perfect consistency across all 88 keys for uniform touch and response.',
    stat: '0.01mm Tolerance'
  },
  {
    icon: <Activity className="w-8 h-8" />,
    title: 'Enhanced Dynamic Control',
    description: 'The reduced mass and friction-free design provide exceptional control from pianissimo to fortissimo with effortless transitions.',
    stat: 'Full Dynamic Range'
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Lifetime Durability',
    description: 'Immune to humidity and temperature changes that warp wood, maintaining perfect regulation for decades without adjustment.',
    stat: 'Maintenance-Free'
  }
]

interface Comparison {
  feature: string
  traditional: string
  millenniumIII: string
}

const COMPARISONS: Comparison[] = [
  {
    feature: 'Material',
    traditional: 'Solid Wood',
    millenniumIII: 'ABS-Carbon Composite'
  },
  {
    feature: 'Weight',
    traditional: 'Heavy',
    millenniumIII: '30% Lighter'
  },
  {
    feature: 'Humidity Stability',
    traditional: 'Susceptible to Warping',
    millenniumIII: 'Completely Stable'
  },
  {
    feature: 'Repetition Speed',
    traditional: 'Standard',
    millenniumIII: 'Up to 40% Faster'
  },
  {
    feature: 'Consistency',
    traditional: 'Varies Between Keys',
    millenniumIII: 'Perfect Uniformity'
  },
  {
    feature: 'Maintenance',
    traditional: 'Regular Regulation Required',
    millenniumIII: 'Minimal Adjustment Needed'
  }
]

export default function GL10MillenniumAction() {
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
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-[#8B7355]/10 to-[#D4AF37]/10 rounded-full mb-6">
            <span className="text-sm font-semibold text-[#8B7355] tracking-wide uppercase">
              Advanced Technology
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-kawai-charcoal mb-6">
            Millennium III Action
            <br />
            <span className="text-[#8B7355]">The Heart of Performance</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Revolutionary ABS-Carbon composite technology that redefines what&apos;s possible
            in piano action design. Lighter, faster, and more responsive than ever before.
          </p>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-20 shadow-2xl"
        >
          <Image
            src="/images/gl10-hero.jpg"
            alt="Millennium III Action Technology"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 90vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end p-8">
            <div className="text-white">
              <h3 className="text-2xl md:text-3xl font-serif mb-2">
                Precision Engineering
              </h3>
              <p className="text-white/90">
                Every component machined to microscopic tolerances
              </p>
            </div>
          </div>
        </motion.div>

        {/* Benefits Grid */}
        <div className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl md:text-4xl font-serif text-kawai-charcoal text-center mb-12"
          >
            Performance Advantages
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BENEFITS.map((benefit, index) => (
              <div
                key={index}
                className={cn(
                  'group relative p-8 rounded-2xl',
                  'bg-gradient-to-br from-white to-kawai-pearl',
                  'border-2 border-[#8B7355]/10',
                  'hover:border-[#8B7355]/30 hover:shadow-xl',
                  'transition-all duration-300'
                )}
              >
                {/* Stat Badge */}
                {benefit.stat && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-[#8B7355] to-[#D4AF37] text-white text-xs font-bold rounded-full">
                    {benefit.stat}
                  </div>
                )}

                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-[#8B7355] to-[#D4AF37] text-white mb-4 group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-kawai-charcoal mb-3">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-serif text-kawai-charcoal text-center mb-12">
            Millennium III vs Traditional Wood
          </h2>

          <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-[#8B7355]/10">
            {/* Table Header */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-br from-kawai-charcoal to-gray-900 text-white">
              <div className="font-semibold">Feature</div>
              <div className="font-semibold text-center">Traditional Wood</div>
              <div className="font-semibold text-center bg-gradient-to-r from-[#8B7355] to-[#D4AF37] rounded-lg px-4 py-2">
                Millennium III
              </div>
            </div>

            {/* Table Rows */}
            {COMPARISONS.map((comparison, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.05 }}
                className={cn(
                  'grid grid-cols-3 gap-4 p-6',
                  index % 2 === 0 ? 'bg-kawai-pearl/30' : 'bg-white'
                )}
              >
                <div className="font-medium text-kawai-charcoal">
                  {comparison.feature}
                </div>
                <div className="text-center text-gray-600">
                  {comparison.traditional}
                </div>
                <div className="text-center font-semibold text-[#8B7355]">
                  {comparison.millenniumIII}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technology Deep Dive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="bg-gradient-to-br from-[#8B7355]/5 to-[#D4AF37]/5 rounded-3xl p-8 md:p-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif text-kawai-charcoal text-center mb-8">
            The Science Behind the Sound
          </h2>

          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-kawai-charcoal mb-3">
                ABS-Carbon Composite Construction
              </h3>
              <p className="text-gray-600 leading-relaxed">
                The Millennium III Action uses advanced ABS-Carbon composite materials for key
                action components. This aerospace-grade material is incredibly strong while being
                significantly lighter than traditional wood, enabling faster key return and improved
                control without sacrificing durability.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-kawai-charcoal mb-3">
                CNC Precision Manufacturing
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Every action part is manufactured using Computer Numerical Control (CNC) machines
                that achieve tolerances of just 0.01mm—about one-tenth the width of a human hair.
                This level of precision ensures that all 88 keys feel identical, providing perfect
                consistency from the lowest bass to the highest treble.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-kawai-charcoal mb-3">
                Climate Stability
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Unlike wood, which expands and contracts with changes in humidity and temperature,
                ABS-Carbon composite remains dimensionally stable. This means your piano maintains
                its regulation and feel year-round, requiring far less maintenance and delivering
                consistent performance regardless of environmental conditions.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Experience the difference that Millennium III Action technology makes.
            The GL-10 delivers concert-hall performance with the most advanced piano
            action ever created.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
