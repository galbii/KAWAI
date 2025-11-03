'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeftRight, Compass, MapPin, LucideIcon } from 'lucide-react'

interface ExperienceCard {
  id: string
  icon: LucideIcon
  title: string
  description: string
  buttonText: string
  link: string
}

const experienceCards: ExperienceCard[] = [
  {
    id: 'compare',
    icon: ArrowLeftRight,
    title: 'Compare Models',
    description: 'See specifications side-by-side',
    buttonText: 'Compare Models',
    link: '/pianos/compare',
  },
  {
    id: 'finder',
    icon: Compass,
    title: 'Find Your Piano',
    description: 'Answer 3 questions, get your match',
    buttonText: 'Start Piano Finder',
    link: '/piano-finder',
  },
  {
    id: 'demo',
    icon: MapPin,
    title: 'Schedule Demo',
    description: 'Experience wooden keys in person',
    buttonText: 'Find Showroom',
    link: '/showroom',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  },
}

export default function ExperienceInvitation() {
  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: '#FAF8F5' }}>
      <div className="mx-auto max-w-7xl px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center text-3xl font-bold"
          style={{ color: '#2C2C2C' }}
        >
          Experience Concert Artist
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          {experienceCards.map((card) => {
            const IconComponent = card.icon

            return (
              <motion.div
                key={card.id}
                variants={cardVariants}
                className="rounded-lg border bg-white p-8 text-center"
                style={{ borderColor: 'rgba(0, 0, 0, 0.2)' }}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  className="mb-4 inline-flex h-12 w-12 items-center justify-center"
                >
                  <IconComponent
                    className="h-12 w-12"
                    style={{ color: '#C41E3A' }}
                    strokeWidth={1.5}
                  />
                </motion.div>

                <h3
                  className="mb-2 text-xl font-bold"
                  style={{ color: '#2C2C2C' }}
                >
                  {card.title}
                </h3>

                <p
                  className="mb-6 text-sm"
                  style={{ color: 'rgba(44, 44, 44, 0.7)' }}
                >
                  {card.description}
                </p>

                <Link href={card.link} className="block w-full">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="w-full rounded-md px-6 py-3 text-white shadow-md transition-shadow hover:shadow-lg"
                    style={{ backgroundColor: '#C41E3A' }}
                  >
                    {card.buttonText}
                  </motion.button>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
