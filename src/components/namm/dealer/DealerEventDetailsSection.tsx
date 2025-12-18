/**
 * DealerEventDetailsSection Component - NAMM 2026 Dealer Reception
 *
 * Compact design with homepage gray/red aesthetic:
 * - Clean carousel showcasing 5 experiences
 * - Minimal Date/Time/Venue section
 * - Red accents matching homepage branding
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  Clock,
  MapPin,
  UtensilsCrossed,
  Users,
  User,
  Gift
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface EventDetailsSectionProps {
  className?: string
}

interface ExperienceItem {
  id: number
  icon: React.ElementType
  title: string
  description: string
}

const EXPERIENCES: ExperienceItem[] = [
  {
    id: 1,
    icon: UtensilsCrossed,
    title: 'Catering',
    description: 'Enjoy a meal and some drinks as an appreciation for your partnership and dedication to the Kawai brand.'
  },
  {
    id: 2,
    icon: Users,
    title: 'Connection',
    description: 'Meet with similar individuals in the business and create connections, share ideas, and expand your network.'
  },
  {
    id: 3,
    icon: User,
    title: 'Kentaro Kawai',
    description: 'Meet the current president of Kawai Musical Instruments and hear a special word from him about our vision for the future.'
  },
  {
    id: 4,
    icon: Gift,
    title: 'A Special Offer',
    description: 'We\'d like to offer the committed individuals an exclusive event offer as a thanks for attending our special event. Find out more at the event.'
  }
]

interface ExperienceCardProps {
  experience: ExperienceItem
  index: number
  isVisible: boolean
}

function ExperienceCard({ experience, index, isVisible }: ExperienceCardProps) {
  const Icon = experience.icon
  const isEven = index % 2 === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className={cn(
        'grid md:grid-cols-2 gap-8 md:gap-12 items-center',
        isEven ? '' : 'md:grid-flow-dense'
      )}
    >
      {/* Icon Section */}
      <div className={cn(
        'relative',
        isEven ? 'md:order-1' : 'md:order-2'
      )}>
        <div className="flex justify-center md:justify-start">
          <div className="relative">
            {/* Icon container with elegant styling */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-kawai-red/10 to-kawai-red/5 flex items-center justify-center shadow-lg">
              <Icon className="w-16 h-16 md:w-20 md:h-20 text-kawai-red" strokeWidth={1.5} />

              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-full border-2 border-kawai-red/20" />
              <div className="absolute inset-[-8px] rounded-full border border-kawai-red/10" />
            </div>

            {/* Number badge */}
            <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-kawai-red text-white flex items-center justify-center font-serif text-lg font-semibold shadow-lg">
              {index + 1}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className={cn(
        'text-center md:text-left',
        isEven ? 'md:order-2' : 'md:order-1'
      )}>
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif text-kawai-black mb-4 tracking-tight">
          {experience.title}
        </h3>
        <p className="text-lg md:text-xl text-kawai-black/70 leading-relaxed">
          {experience.description}
        </p>
      </div>
    </motion.div>
  )
}

export default function DealerEventDetailsSection({
  className
}: EventDetailsSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [cardVisibility, setCardVisibility] = useState<boolean[]>(new Array(EXPERIENCES.length).fill(false))
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  // Section header visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Individual card visibility with staggered animations
  useEffect(() => {
    const observers = cardRefs.current.map((ref, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            setCardVisibility(prev => {
              const newState = [...prev]
              newState[index] = true
              return newState
            })
          }
        },
        { threshold: 0.3 }
      )

      if (ref) {
        observer.observe(ref)
      }

      return observer
    })

    return () => {
      observers.forEach(observer => observer.disconnect())
    }
  }, [])

  return (
    <section
      id="event-details"
      className={cn(
        "py-16 lg:py-20 relative overflow-hidden bg-white scroll-mt-20",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-20"
        >
          <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-4">
            DEALER RECEPTION
          </div>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif text-kawai-black mb-4 tracking-tight">
            What to Expect
          </h3>
          <p className="text-xl text-kawai-black/70 max-w-3xl mx-auto">
            An evening crafted with care, connection, and appreciation
          </p>
        </motion.div>

        {/* Staggered Alternating Experience Cards */}
        <div className="space-y-20 lg:space-y-32 mb-16 lg:mb-20">
          {EXPERIENCES.map((experience, index) => (
            <div
              key={experience.id}
              ref={el => { cardRefs.current[index] = el }}
            >
              <ExperienceCard
                experience={experience}
                index={index}
                isVisible={cardVisibility[index] ?? false}
              />
            </div>
          ))}
        </div>

        {/* Closing Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center py-12 lg:py-16 px-6"
        >
          <div className="max-w-3xl mx-auto">
            <div className="inline-block mb-6">
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-kawai-red to-transparent" />
            </div>
            <h4 className="text-4xl md:text-5xl lg:text-6xl font-serif text-kawai-black mb-6 tracking-tight">
              We can't wait to see you there
            </h4>
            <p className="text-xl text-kawai-black/70">
              Join us for an unforgettable evening celebrating our partnership
            </p>
            <div className="inline-block mt-6">
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-kawai-red to-transparent" />
            </div>
          </div>
        </motion.div>

        {/* Date/Time/Venue Section - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="bg-kawai-pearl rounded-xl p-8 md:p-10">
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {/* Date */}
              <div className="text-center md:text-left">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-kawai-red/10 text-kawai-red mb-3">
                  <Calendar className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <h4 className="text-xl md:text-2xl font-serif text-kawai-black mb-1">
                  January 23, 2026
                </h4>
                <p className="text-sm text-kawai-black/60">
                  Save the date
                </p>
              </div>

              {/* Time */}
              <div className="text-center md:text-left">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-kawai-red/10 text-kawai-red mb-3">
                  <Clock className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <h4 className="text-xl md:text-2xl font-serif text-kawai-black mb-1">
                  6:00 PM - 9:00 PM PST
                </h4>
                <p className="text-sm text-kawai-black/60">
                  Three hours of networking
                </p>
              </div>

              {/* Venue */}
              <div className="text-center md:text-left">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-kawai-red/10 text-kawai-red mb-3">
                  <MapPin className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <h4 className="text-xl md:text-2xl font-serif text-kawai-black mb-1">
                  Anaheim Convention Center
                </h4>
                <p className="text-sm text-kawai-black/60">
                  Private Reception Hall • Booth <span className="font-semibold text-kawai-red">#207</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
