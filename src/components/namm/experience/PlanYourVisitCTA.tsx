'use client'

/**
 * Plan Your Visit CTA Section
 * Final call-to-action with directions, contact info, and visit planning
 */

import React from 'react'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface ContactInfo {
  icon: React.ReactNode
  title: string
  content: string
  link?: string
}

const CONTACT_INFO: ContactInfo[] = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    title: 'Location',
    content: 'Anaheim Convention Center, Hall B, Booth TBA',
    link: 'https://maps.google.com/?q=Anaheim+Convention+Center',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    title: 'Dates',
    content: 'January 22-24, 2026 | All Show Hours',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    title: 'Contact',
    content: 'info@kawaius.com',
    link: 'mailto:info@kawaius.com',
  },
]

export default function PlanYourVisitCTA() {
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
        {/* Main CTA Content */}
        <div ref={titleRef} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
              Ready to Experience
              <span className="block text-[#C41E3A]">Kawai at NAMM 2026?</span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl leading-relaxed text-white/80 max-w-3xl mx-auto mb-12"
          >
            We can't wait to welcome you to the Kawai booth. Here's everything you need to plan your
            perfect visit.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
          >
            <button
              onClick={() =>
                window.open('https://maps.google.com/?q=Anaheim+Convention+Center', '_blank')
              }
              className="group px-8 py-4 bg-gradient-to-r from-[#E31937] to-[#FF3B55] text-white text-lg font-semibold rounded-md
                         hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center justify-center gap-2">
                Get Directions
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </button>
            <button
              onClick={() => {
                const section = document.querySelector('#schedule')
                section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className="px-8 py-4 bg-transparent text-white text-lg font-semibold rounded-md
                         border-2 border-white hover:bg-white hover:text-black transition-all duration-300 hover:scale-105"
            >
              View Schedule
            </button>
          </motion.div>
        </div>

        {/* Contact Information Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          {CONTACT_INFO.map((info, index) => (
            <motion.div
              key={info.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
            >
              {info.link ? (
                <a
                  href={info.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'block p-8 rounded-2xl',
                    'bg-white/5 backdrop-blur-sm border border-white/10',
                    'hover:bg-white/10 hover:border-white/20',
                    'transition-all duration-300 hover:scale-105',
                    'text-center group'
                  )}
                >
                  <div className="flex justify-center mb-4 text-[#C41E3A] group-hover:scale-110 transition-transform">
                    {info.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{info.title}</h3>
                  <p className="text-white/80">{info.content}</p>
                </a>
              ) : (
                <div
                  className={cn(
                    'p-8 rounded-2xl',
                    'bg-white/5 backdrop-blur-sm border border-white/10',
                    'text-center'
                  )}
                >
                  <div className="flex justify-center mb-4 text-[#C41E3A]">{info.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{info.title}</h3>
                  <p className="text-white/80">{info.content}</p>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* What to Bring Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="p-10 md:p-12 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-2xl"
        >
          <h3 className="text-3xl font-bold text-white mb-8 text-center">What to Bring</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🎫', text: 'NAMM Badge' },
              { icon: '💼', text: 'Business Cards' },
              { icon: '📱', text: 'Smartphone' },
              { icon: '📝', text: 'Notepad' },
            ].map((item) => (
              <div
                key={item.text}
                className="flex flex-col items-center gap-3 p-6 bg-white/5 rounded-xl"
              >
                <span className="text-4xl">{item.icon}</span>
                <span className="text-white font-semibold">{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Final Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isTitleVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-16 text-center"
        >
          <p className="text-2xl md:text-3xl font-light text-white/90 mb-4">
            See you at NAMM 2026!
          </p>
          <p className="text-lg text-white/60">
            Follow us on social media for live updates during the show
          </p>
          <div className="flex gap-6 justify-center mt-6">
            {[
              { name: 'Instagram', icon: '📷' },
              { name: 'Facebook', icon: '👍' },
              { name: 'YouTube', icon: '▶️' },
            ].map((social) => (
              <button
                key={social.name}
                className="text-3xl hover:scale-125 transition-transform duration-300"
                title={social.name}
              >
                {social.icon}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
