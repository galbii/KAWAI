'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GL10ProgressBarProps {
  completedSections: string[]
  totalSections: number
  className?: string
  sectionLabels?: string[]
}

export default function GL10ProgressBar({
  completedSections,
  totalSections,
  className,
  sectionLabels
}: GL10ProgressBarProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredSection, setHoveredSection] = useState<number | null>(null)

  // Calculate progress percentage
  const progress = (completedSections.length / totalSections) * 100

  // Smooth spring animation for progress
  const smoothProgress = useSpring(progress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Show progress bar after scrolling down a bit
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsVisible(scrollPosition > 100)
    }

    handleScroll() // Check initial position
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Update spring animation when progress changes
  useEffect(() => {
    smoothProgress.set(progress)
  }, [progress, smoothProgress])

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'backdrop-blur-md bg-white/80',
        className
      )}
    >
      {/* Progress Bar Container */}
      <div className="relative h-6 md:h-6 w-full">
        {/* Background */}
        <div className="absolute inset-0 bg-kawai-pearl" />

        {/* Progress Fill */}
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-kawai-red via-red-600 to-kawai-red"
          style={{
            width: smoothProgress.get() + '%',
            scaleX: smoothProgress.get() / 100
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* Shimmer Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        </motion.div>

        {/* Section Markers (if labels provided) */}
        {sectionLabels && sectionLabels.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-between px-4">
            {sectionLabels.map((label, index) => {
              const sectionProgress = ((index + 1) / totalSections) * 100
              const isCompleted = completedSections.length > index

              return (
                <div
                  key={index}
                  className="relative group"
                  onMouseEnter={() => setHoveredSection(index)}
                  onMouseLeave={() => setHoveredSection(null)}
                >
                  {/* Marker Dot */}
                  <motion.div
                    className={cn(
                      'w-3 h-3 rounded-full border-2 transition-all duration-300',
                      isCompleted
                        ? 'bg-white border-white scale-110'
                        : 'bg-kawai-pearl border-gray-300'
                    )}
                    whileHover={{ scale: 1.5 }}
                  />

                  {/* Label Tooltip */}
                  {hoveredSection === index && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap pointer-events-none"
                    >
                      {label}
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                    </motion.div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Progress Percentage Indicator */}
        <motion.div
          className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {Math.round(progress)}%
        </motion.div>
      </div>

      {/* Subtle Bottom Border */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
    </motion.div>
  )
}
