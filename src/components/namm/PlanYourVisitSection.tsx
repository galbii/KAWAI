/**
 * PlanYourVisitSection Component - NAMM 2026
 *
 * Premium logistics section with warm beige aesthetic matching ArtistLineupSection
 * Features:
 * - Framer Motion animations with scroll triggers
 * - Premium card styling with gradients and glows
 * - Visual FAQ component (structured data handled by NAMMStructuredData)
 * - Warm beige background with paper texture
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PlanYourVisitSectionProps {
  className?: string
  showMap?: boolean
}

interface InfoCardProps {
  title: string
  children: React.ReactNode
  index: number
  accentColor?: 'red' | 'amber' | 'emerald' | 'blue'
}

interface FAQItemProps {
  question: string
  answer: string | React.ReactNode
  index: number
}

function InfoCard({ title, children, index, accentColor = 'red' }: InfoCardProps) {
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

  const accentColors = {
    red: {
      border: 'border-kawai-red/20 hover:border-kawai-red/40',
      glow: 'from-kawai-red/10 via-transparent to-transparent'
    },
    amber: {
      border: 'border-amber-600/20 hover:border-amber-600/40',
      glow: 'from-amber-600/10 via-transparent to-transparent'
    },
    emerald: {
      border: 'border-emerald-600/20 hover:border-emerald-600/40',
      glow: 'from-emerald-600/10 via-transparent to-transparent'
    },
    blue: {
      border: 'border-blue-600/20 hover:border-blue-600/40',
      glow: 'from-blue-600/10 via-transparent to-transparent'
    }
  }

  const colors = accentColors[accentColor]

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group h-full"
    >
      <div className={cn(
        'relative h-full overflow-hidden rounded-2xl p-6 lg:p-8',
        'bg-gradient-to-br from-white via-white to-[#F5F1E8]/30',
        'border-2',
        colors.border,
        'shadow-lg shadow-[#2C2826]/5',
        'hover:shadow-xl hover:shadow-[#2C2826]/10',
        'hover:scale-[1.02]',
        'transition-all duration-500 ease-out'
      )}>
        {/* Subtle gradient glow effect */}
        <div className={cn(
          'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500',
          'bg-gradient-radial',
          colors.glow,
          'blur-2xl pointer-events-none'
        )} />

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, currentColor 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />
        </div>

        <div className="relative z-10">
          {/* Title */}
          <h3 className="font-semibold text-xl text-[#2C2826] mb-4 leading-tight">
            {title}
          </h3>

          {/* Content */}
          <div className="text-sm text-[#5A5550] space-y-3 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function FAQItem({ question, answer, index }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const itemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (itemRef.current) {
      observer.observe(itemRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="border-b border-[#D4CFC7] last:border-b-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full py-6 flex items-start justify-between gap-4 text-left group",
          "transition-colors duration-200",
          isOpen ? "text-kawai-red" : "text-[#2C2826] hover:text-kawai-red"
        )}
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-lg leading-tight">
          {question}
        </span>
        <svg
          className={cn(
            "w-6 h-6 flex-shrink-0 transition-transform duration-300 mt-1",
            isOpen ? "rotate-180" : "rotate-0"
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-[#5A5550] leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function PlanYourVisitSection({
  className,
  showMap = true
}: PlanYourVisitSectionProps) {
  const [isTitleVisible, setIsTitleVisible] = useState(false)
  const titleRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for title animation
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
    <section className={cn(
      "py-24 lg:py-32 relative overflow-hidden",
      className
    )}>
      {/* Warm beige gradient background - matching ArtistLineupSection */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F5F1E8] via-[#EDE8DF] to-[#F0EBE3]" />

      {/* Subtle paper texture overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noise)" /%3E%3C/svg%3E")',
            backgroundRepeat: 'repeat'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* FAQ Section - Visual Component (Schema handled by NAMMStructuredData) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto mb-16"
        >
          {/* FAQ Subheader */}
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-light tracking-tight text-[#2C2826] mb-4">
              Frequently Asked Questions
            </h3>
            <p className="text-lg font-light text-[#5A5550]">
              Everything you need to know about visiting Kawai at NAMM 2026
            </p>
          </div>

          {/* FAQ Items */}
          <div className={cn(
            'relative overflow-hidden rounded-2xl p-8 lg:p-10',
            'bg-gradient-to-br from-white via-white to-[#F5F1E8]/30',
            'border-2 border-[#D4CFC7]',
            'shadow-lg shadow-[#2C2826]/5'
          )}>
            <FAQItem
              question="What are the NAMM 2026 dates and hours?"
              answer={
                <div className="space-y-3">
                  <p><strong>The NAMM Show 2026</strong> runs January 22–24, 2026 at the Anaheim Convention Center in California.</p>
                  <p><strong>Exhibit Hall Hours:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Thursday, January 22: 10:00 AM – 6:00 PM</li>
                    <li>Friday, January 23: 10:00 AM – 6:00 PM</li>
                    <li>Saturday, January 24: 10:00 AM – 5:00 PM</li>
                  </ul>
                  <p className="text-sm italic">Note: Exhibitors may escort buyers onto the show floor from 8:00 AM – 10:00 AM on Friday and Saturday.</p>
                </div>
              }
              index={0}
            />

            <FAQItem
              question="Where is the Kawai booth located at NAMM 2026?"
              answer={
                <div className="space-y-2">
                  <p><strong>Kawai Booth #9110</strong> is located in <strong>Hall B, First Floor</strong> of the Anaheim Convention Center.</p>
                  <p>Address: 800 W Katella Ave, Anaheim, CA 92802</p>
                  <p className="text-sm">Look for our distinctive red branding and listen for the sound of premium pianos being demonstrated throughout the day.</p>
                </div>
              }
              index={1}
            />

            <FAQItem
              question="Do I need a badge to visit the Kawai booth?"
              answer={
                <div className="space-y-2">
                  <p>Yes, <strong>NAMM Show badges are required</strong> to enter the exhibit halls and visit our booth.</p>
                  <p>NAMM is a trade-only event. Badges are available to:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Music retailers and dealers</li>
                    <li>Music educators and school administrators</li>
                    <li>Professional musicians and artists</li>
                    <li>Music industry professionals</li>
                  </ul>
                  <p className="text-sm">Register for your badge at <a href="https://www.namm.org" target="_blank" rel="noopener noreferrer" className="text-kawai-red hover:underline">namm.org</a>. Badges are non-refundable and non-transferable.</p>
                </div>
              }
              index={2}
            />

            <FAQItem
              question="Where should I park for NAMM 2026?"
              answer={
                <div className="space-y-3">
                  <p>Several parking options are available near the Anaheim Convention Center:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Anaheim Convention Center parking structure</li>
                    <li>Toy Story parking lot</li>
                    <li>Garden Walk parking (validation required - available at Hall E, Arena Badge Will Call, and NAMM Help Desk)</li>
                  </ul>
                  <p className="text-sm"><strong>Important:</strong> Overnight parking is NOT permitted.</p>
                </div>
              }
              index={3}
            />

            <FAQItem
              question="How do I get to the Anaheim Convention Center?"
              answer={
                <div className="space-y-3">
                  <p><strong>By Air:</strong></p>
                  <ul className="space-y-2 mb-3">
                    <li className="flex items-start gap-2">
                      <span className="text-kawai-red mt-1 flex-shrink-0">•</span>
                      <div>
                        <strong>John Wayne Airport (SNA)</strong> – 15 minutes away, closest airport, ideal for domestic travelers
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-kawai-red mt-1 flex-shrink-0">•</span>
                      <div>
                        <strong>Los Angeles International (LAX)</strong> – 45 minutes away, more international flight options
                      </div>
                    </li>
                  </ul>
                  <p><strong>By Shuttle:</strong> Anaheim Resort Transit (ART) provides complimentary shuttle service to/from the Convention Center for guests at participating hotels. Routes 4, 5, and 18 stop on the east side of the center.</p>
                  <p className="text-sm">Consider shuttle services to avoid parking hassles and traffic.</p>
                </div>
              }
              index={4}
            />

            <FAQItem
              question="What pianos will Kawai showcase at NAMM 2026?"
              answer={
                <div className="space-y-2">
                  <p>Kawai will feature our most innovative and exclusive instruments, including:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>CR-45 Crystal Grand</strong> – Ultra-exclusive transparent acrylic grand</li>
                    <li><strong>Novus NV12 & NV6</strong> – Revolutionary hybrid pianos</li>
                    <li><strong>HERALBONY Artistic Collaboration</strong> – One of a kind SK-5 with a new bold artistic twist</li>
                    <li><strong>Shigeru Kawai</strong> – Handcrafted concert grands from our master artisans</li>
                  </ul>
                  <p className="text-sm">Visit <a href="/namm-2026/experience" className="text-kawai-red hover:underline">our featured pianos page</a> for detailed information and demonstrations.</p>
                </div>
              }
              index={5}
            />
          </div>
        </motion.div>

        {/* Plan Your Visit Section Header */}
        <div ref={titleRef} id="plan-visit-details" className="text-center mb-16 lg:mb-20 mt-24">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-[#2C2826] mb-6"
          >
            Plan Your Visit
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl font-light leading-relaxed text-[#5A5550] max-w-3xl mx-auto"
          >
            Everything you need to know to experience Kawai at NAMM 2026. From event details to travel logistics, we've got you covered.
          </motion.p>
        </div>

        {/* Info Cards Grid - Essential Quick Reference */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Event Dates */}
          <InfoCard title="Event Dates" index={0} accentColor="red">
            <div className="space-y-3">
              <div>
                <p className="font-bold text-[#2C2826] text-lg">
                  The NAMM Show 2026
                </p>
                <p className="text-[#5A5550] mt-1">
                  January 22–24, 2026
                </p>
              </div>

              <div className="pt-3 border-t border-[#D4CFC7]">
                <p className="font-semibold text-[#2C2826]">
                  Exhibit Hall Hours
                </p>
                <ul className="mt-2 space-y-1.5 text-[#5A5550]">
                  <li>Thursday, Jan 22: 10am–6pm</li>
                  <li>Friday, Jan 23: 10am–6pm</li>
                  <li>Saturday, Jan 24: 10am–5pm</li>
                </ul>
              </div>

              <p className="text-xs text-[#7A7570] pt-3 border-t border-[#D4CFC7]">
                Visit us during exhibit hours for live demonstrations and exclusive piano previews
              </p>
            </div>
          </InfoCard>

          {/* Booth Location */}
          <InfoCard title="Booth Location" index={1} accentColor="red">
            <div className="space-y-3">
              {/* Convention Center Access Map */}
              <div className="mb-6 -mx-6 lg:-mx-8 -mt-6 lg:-mt-8">
                <img
                  src="https://pub-486ee03121a24ede8b51409434e22709.r2.dev/homepage/hall%20b.png"
                  alt="Anaheim Convention Center access map showing Hall B #9110"
                  className="w-full h-auto"
                />
              </div>

              <p className="font-semibold text-[#2C2826]">
                Anaheim Convention Center
              </p>
              <p className="text-[#5A5550]">
                800 W Katella Ave, Anaheim, CA 92802
              </p>
              <div className="mt-3 pt-3 border-t border-[#D4CFC7]">
                <p className="font-bold text-kawai-red text-lg">
                  Kawai Booth 9110
                </p>
                <p className="text-xs text-[#7A7570] mt-1">
                  Hall B · First Floor
                </p>
              </div>
            </div>
          </InfoCard>
        </div>

      </div>
    </section>
  )
}
