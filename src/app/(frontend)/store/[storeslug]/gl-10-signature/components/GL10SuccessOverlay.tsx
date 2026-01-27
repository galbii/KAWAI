'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import confetti from 'canvas-confetti'

interface GL10SuccessOverlayProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

// Benefit cards data
const SUCCESS_BENEFITS = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Email Confirmation',
    description: 'Check your inbox for details and calendar invite'
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    title: 'Signature Access',
    description: 'Exclusive viewing of our GL-10 collection'
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: 'Expert Guidance',
    description: 'Our team will guide you through your experience'
  }
]

export default function GL10SuccessOverlay({ isOpen, onClose, className }: GL10SuccessOverlayProps) {
  // Fire confetti on mount
  useEffect(() => {
    if (isOpen) {
      // Delay confetti slightly for better effect
      const timer = setTimeout(() => {
        fireConfetti()
      }, 300)

      return () => clearTimeout(timer)
    }
    return undefined
  }, [isOpen])

  // Confetti configuration
  const fireConfetti = () => {
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 9999,
      colors: ['#C41E3A', '#D4AF37', '#2C2C2C', '#F8F8F8']
    }

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // Fire from two sides
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)
  }

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 25,
        delay: 0.1
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: { duration: 0.2 }
    }
  }

  const benefitVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.5 + i * 0.1,
        duration: 0.4,
      }
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={cn(
            'fixed inset-0 z-[100] flex items-center justify-center p-4',
            className
          )}
        >
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/80 backdrop-blur-lg"
          />

          {/* Success Card */}
          <motion.div
            variants={cardVariants}
            className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="p-8 md:p-12 text-center">
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2
                }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-6"
              >
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>

              {/* Headline */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-3xl md:text-4xl font-light text-gray-900 mb-3"
              >
                See You There!
              </motion.h2>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="text-lg text-gray-600 mb-8"
              >
                Your invitation has been confirmed
              </motion.p>

              {/* Benefit Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {SUCCESS_BENEFITS.map((benefit, index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    variants={benefitVariants}
                    initial="hidden"
                    animate="visible"
                    className="group"
                  >
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 h-full transition-all duration-300 hover:shadow-lg hover:scale-105">
                      {/* Icon */}
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-kawai-red to-red-600 rounded-xl mb-4 text-white group-hover:scale-110 transition-transform duration-300">
                        {benefit.icon}
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {benefit.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-600">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                onClick={onClose}
                className="inline-flex items-center justify-center px-8 py-3 bg-kawai-red hover:bg-red-700 text-white font-medium rounded-full transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                Continue Exploring
              </motion.button>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-kawai-red/20 to-red-600/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-3xl" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
