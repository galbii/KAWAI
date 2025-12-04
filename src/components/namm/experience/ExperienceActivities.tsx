'use client'

/**
 * Experience Activities Section
 * Showcases special activities and unique experiences at the booth
 */

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface Activity {
  icon: string
  title: string
  description: string
  duration?: string
  availability: string
}

const ACTIVITIES: Activity[] = [
  {
    icon: '🎤',
    title: 'Meet the Artists',
    description:
      'Get up close with world-renowned pianists. Ask questions, get autographs, and learn about their instrument preferences and performance techniques.',
    duration: 'Throughout show hours',
    availability: 'Check schedule for specific times',
  },
  {
    icon: '📸',
    title: 'Photo Opportunities',
    description:
      'Capture your NAMM moment with our stunning SK-EX concert grand. Professional lighting and custom backdrops make every shot Instagram-worthy.',
    availability: 'Always available',
  },
  {
    icon: '🎓',
    title: 'Expert Consultations',
    description:
      'Schedule one-on-one time with Master Piano Artisans and product specialists. Get personalized recommendations based on your needs and playing style.',
    duration: '15-30 minutes',
    availability: 'Walk-ins or appointments',
  },
  {
    icon: '🔧',
    title: 'Technology Workshops',
    description:
      'Learn about the PentaDrive™ hybrid system, Millennium III action, and other innovations. Interactive demonstrations reveal the engineering behind our pianos.',
    duration: '20 minutes',
    availability: 'Scheduled sessions',
  },
  {
    icon: '🎹',
    title: 'Blind Sound Test',
    description:
      'Put your ears to the test! Compare Kawai pianos against competitors in our blind listening experience. Discover what makes our instruments stand out.',
    duration: '10-15 minutes',
    availability: 'On-demand',
  },
  {
    icon: '🎁',
    title: 'Exclusive Giveaways',
    description:
      'Enter to win exclusive Kawai merchandise, accessories, and special prizes. Plus, receive your commemorative NAMM 2026 gift just for visiting our booth.',
    availability: 'While supplies last',
  },
]

function ActivityCard({ activity, index }: { activity: Activity; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
      className="group h-full"
    >
      <div
        className={cn(
          'h-full p-8 rounded-2xl',
          'bg-white/5 backdrop-blur-sm border border-white/10',
          'hover:bg-white/10 hover:border-white/20',
          'transition-all duration-500 ease-out',
          'flex flex-col'
        )}
      >
        {/* Icon */}
        <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
          {activity.icon}
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold text-white mb-4 group-hover:text-[#C41E3A] transition-colors duration-300">
          {activity.title}
        </h3>

        {/* Description */}
        <p className="text-white/70 leading-relaxed text-base mb-6 flex-grow">
          {activity.description}
        </p>

        {/* Meta Info */}
        <div className="space-y-2 pt-4 border-t border-white/10">
          {activity.duration && (
            <div className="flex items-center gap-2 text-sm text-white/60">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{activity.duration}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 bg-[#C41E3A] rounded-full" />
            <span className="text-[#C41E3A] font-semibold">{activity.availability}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function ExperienceActivities() {
  const [isTitleVisible, setIsTitleVisible] = useState(false)
  const titleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsTitleVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (titleRef.current) {
      observer.observe(titleRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section className="py-20 md:py-28 bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6"
          >
            <span className="w-2 h-2 bg-[#C41E3A] rounded-full animate-pulse" />
            <span className="text-white font-semibold text-sm uppercase tracking-wide">
              Special Activities
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6"
          >
            Beyond the Piano
            <span className="block text-[#C41E3A]">Unique Experiences</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl leading-relaxed text-white/80 max-w-3xl mx-auto"
          >
            Make the most of your visit with exclusive activities designed to deepen your connection
            with Kawai
          </motion.p>
        </div>

        {/* Activities Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {ACTIVITIES.map((activity, index) => (
            <ActivityCard key={activity.title} activity={activity} index={index} />
          ))}
        </div>

        {/* Bottom CTA Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isTitleVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="p-10 md:p-12 bg-gradient-to-br from-[#E31937] to-[#FF3B55] rounded-2xl shadow-2xl text-center"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Experience It All?
          </h3>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Download our booth activity schedule and plan your perfect NAMM visit. Don't miss any of
            the exclusive experiences we've prepared for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                const section = document.querySelector('#schedule')
                section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className="px-8 py-4 bg-white text-[#C41E3A] text-lg font-semibold rounded-md
                         hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              View Full Schedule
            </button>
            <button
              onClick={() => {
                const section = document.querySelector('#plan-visit')
                section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className="px-8 py-4 bg-transparent text-white text-lg font-semibold rounded-md
                         border-2 border-white hover:bg-white hover:text-[#C41E3A] transition-all duration-300 hover:scale-105"
            >
              Plan Your Visit
            </button>
          </div>
        </motion.div>

        {/* Pro Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isTitleVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          {[
            {
              tip: 'Arrive Early',
              description: 'Beat the crowds and get the best access to pianos and experts',
            },
            {
              tip: 'Bring Business Cards',
              description: 'Network with artists, specialists, and fellow piano enthusiasts',
            },
            {
              tip: 'Stay for Performances',
              description: 'Experience the full sonic potential of each instrument',
            },
          ].map((item) => (
            <div
              key={item.tip}
              className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
            >
              <h4 className="text-lg font-bold text-[#C41E3A] mb-2">{item.tip}</h4>
              <p className="text-white/70 text-sm">{item.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
