'use client'

/**
 * Event Schedule Section
 * Displays the schedule of demos, performances, and activities
 */

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface ScheduleEvent {
  time: string
  title: string
  description: string
  type: 'performance' | 'demo' | 'workshop' | 'special'
  duration: string
}

interface DaySchedule {
  day: string
  date: string
  events: ScheduleEvent[]
}

const SCHEDULE: DaySchedule[] = [
  {
    day: 'Thursday',
    date: 'January 22, 2026',
    events: [
      {
        time: '10:00 AM',
        title: 'Grand Opening & Welcome',
        description: 'Meet the Kawai team and receive your exclusive welcome gift',
        type: 'special',
        duration: '30 min',
      },
      {
        time: '11:00 AM',
        title: 'Concert Grand Demonstration',
        description: 'Shigeru Kawai SK-EX showcase with Master Piano Artisan',
        type: 'demo',
        duration: '45 min',
      },
      {
        time: '1:00 PM',
        title: 'Artist Performance - TBA',
        description: 'Live performance featuring renowned concert pianist',
        type: 'performance',
        duration: '30 min',
      },
      {
        time: '2:30 PM',
        title: 'Hybrid Piano Workshop',
        description: 'Deep dive into Novus NV6/NV12 PentaDrive™ technology',
        type: 'workshop',
        duration: '45 min',
      },
      {
        time: '4:00 PM',
        title: 'Digital Piano Showcase',
        description: 'CA Series and ES Series feature demonstrations',
        type: 'demo',
        duration: '30 min',
      },
    ],
  },
  {
    day: 'Friday',
    date: 'January 23, 2026',
    events: [
      {
        time: '10:30 AM',
        title: 'Technology Innovation Talk',
        description: 'Engineering team discusses latest piano innovations',
        type: 'workshop',
        duration: '40 min',
      },
      {
        time: '12:00 PM',
        title: 'Artist Performance - TBA',
        description: 'Live performance on Shigeru Kawai SK-7',
        type: 'performance',
        duration: '30 min',
      },
      {
        time: '2:00 PM',
        title: 'Acoustic Grand Comparison',
        description: 'Compare K, GL, and GX series side-by-side',
        type: 'demo',
        duration: '45 min',
      },
      {
        time: '3:30 PM',
        title: 'Meet the Master Artisans',
        description: 'Q&A with Kawai Master Piano Artisans',
        type: 'special',
        duration: '60 min',
      },
    ],
  },
  {
    day: 'Saturday',
    date: 'January 24, 2026',
    events: [
      {
        time: '10:00 AM',
        title: 'Final Day Showcase',
        description: 'Highlights from our complete product lineup',
        type: 'demo',
        duration: '45 min',
      },
      {
        time: '11:30 AM',
        title: 'Artist Performance - TBA',
        description: 'Special closing performance',
        type: 'performance',
        duration: '30 min',
      },
      {
        time: '1:00 PM',
        title: 'Last Chance Consultations',
        description: 'Final opportunity for one-on-one expert guidance',
        type: 'special',
        duration: '90 min',
      },
      {
        time: '3:00 PM',
        title: 'Prize Drawing & Farewell',
        description: 'Grand prize drawing and closing remarks',
        type: 'special',
        duration: '30 min',
      },
    ],
  },
]

const EVENT_TYPE_STYLES = {
  performance: {
    icon: '🎤',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
  },
  demo: {
    icon: '🎹',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
  },
  workshop: {
    icon: '🔬',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
  },
  special: {
    icon: '⭐',
    color: 'text-[#C41E3A]',
    bg: 'bg-[#C41E3A]/10',
    border: 'border-[#C41E3A]/30',
  },
}

function ScheduleEventCard({ event }: { event: ScheduleEvent }) {
  const style = EVENT_TYPE_STYLES[event.type]

  return (
    <div
      className={cn(
        'p-6 rounded-xl border transition-all duration-300',
        'hover:scale-[1.02] hover:shadow-lg',
        style.bg,
        style.border
      )}
    >
      <div className="flex items-start gap-4">
        {/* Icon & Time */}
        <div className="flex-shrink-0">
          <div className={cn('text-3xl mb-2')}>{style.icon}</div>
          <div className="text-white font-bold text-lg">{event.time}</div>
          <div className="text-white/60 text-sm">{event.duration}</div>
        </div>

        {/* Content */}
        <div className="flex-grow">
          <h4 className={cn('text-xl font-bold mb-2', style.color)}>{event.title}</h4>
          <p className="text-white/80 leading-relaxed">{event.description}</p>
        </div>
      </div>
    </div>
  )
}

export default function EventSchedule() {
  const [activeDay, setActiveDay] = useState(0)
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

  const currentSchedule = SCHEDULE[activeDay]

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full mb-6"
          >
            <span className="w-2 h-2 bg-[#C41E3A] rounded-full animate-pulse" />
            <span className="text-gray-900 font-semibold text-sm uppercase tracking-wide">
              Event Schedule
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6"
          >
            Plan Your Days
            <span className="block text-[#C41E3A]">at NAMM 2026</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl leading-relaxed text-gray-600 max-w-3xl mx-auto"
          >
            Don't miss any of our exclusive performances, demos, and special events
          </motion.p>
        </div>

        {/* Day Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap gap-4 justify-center mb-12"
        >
          {SCHEDULE.map((schedule, index) => (
            <button
              key={schedule.day}
              onClick={() => setActiveDay(index)}
              className={cn(
                'px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300',
                'hover:scale-105',
                activeDay === index
                  ? 'bg-gradient-to-r from-[#E31937] to-[#FF3B55] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              )}
            >
              <div className="text-sm opacity-80 mb-1">{schedule.day}</div>
              <div className="font-bold">{schedule.date.split(',')[1]?.trim()}</div>
            </button>
          ))}
        </motion.div>

        {/* Schedule Display */}
        {currentSchedule && (
          <motion.div
            key={activeDay}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            {/* Date Header */}
            <div className="mb-8 p-6 bg-gradient-to-r from-gray-900 to-black rounded-2xl text-center">
              <h3 className="text-3xl font-bold text-white mb-2">{currentSchedule.day}</h3>
              <p className="text-white/70 text-lg">{currentSchedule.date}</p>
            </div>

            {/* Events List */}
            <div className="space-y-4">
              {currentSchedule.events.map((event, index) => (
                <motion.div
                  key={`${event.time}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <ScheduleEventCard event={event} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isTitleVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 flex flex-wrap gap-6 justify-center"
        >
          {Object.entries(EVENT_TYPE_STYLES).map(([type, style]) => (
            <div key={type} className="flex items-center gap-2">
              <span className="text-2xl">{style.icon}</span>
              <span className="text-gray-600 capitalize">{type}</span>
            </div>
          ))}
        </motion.div>

        {/* Important Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isTitleVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-xl"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Schedule Subject to Change</h4>
              <p className="text-gray-700">
                Artist lineups and specific times may be updated closer to the event. Check back
                here or visit our booth for the latest schedule. All times are in Pacific Time (PT).
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
