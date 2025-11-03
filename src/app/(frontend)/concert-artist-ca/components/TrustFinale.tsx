'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield, Home, Award } from 'lucide-react'

interface TrustBadge {
  id: string
  icon: typeof Shield
  text: string
}

const trustBadges: TrustBadge[] = [
  {
    id: 'warranty',
    icon: Shield,
    text: '5-Year Warranty',
  },
  {
    id: 'service',
    icon: Home,
    text: 'In-Home Service',
  },
  {
    id: 'craftsmanship',
    icon: Award,
    text: '97 Years Craftsmanship',
  },
]

const badgeVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      delay: index * 0.2,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  }),
}

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.6,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  },
}

export default function TrustFinale() {
  return (
    <section
      className="py-12 md:py-16"
      style={{ backgroundColor: '#2C2C2C' }}
    >
      <div className="mx-auto max-w-4xl px-4 text-center">
        {/* Trust Badges */}
        <div className="mb-8 flex flex-wrap justify-center gap-8">
          {trustBadges.map((badge, index) => {
            const IconComponent = badge.icon

            return (
              <motion.div
                key={badge.id}
                custom={index}
                variants={badgeVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                className="flex flex-col items-center"
              >
                <IconComponent
                  className="mb-2 h-8 w-8 text-white"
                  strokeWidth={1.5}
                />
                <span className="text-sm text-white">{badge.text}</span>
              </motion.div>
            )
          })}
        </div>

        {/* Main Content */}
        <motion.div
          variants={contentVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <h2
            className="mb-4 text-3xl font-serif text-white md:text-4xl"
            style={{ fontFamily: 'Crimson Text, serif' }}
          >
            Discover Your Concert Artist
          </h2>

          <p
            className="mb-8 text-sm"
            style={{ color: 'rgba(255, 255, 255, 0.6)' }}
          >
            Available at authorized KAWAI dealers
          </p>

          <Link href="/pianos/concert-artist">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 30px rgba(196, 30, 58, 0.5)',
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="rounded-lg px-10 py-4 text-lg text-white shadow-lg transition-shadow"
              style={{ backgroundColor: '#C41E3A' }}
            >
              Explore Collection
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
