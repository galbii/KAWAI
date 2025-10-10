'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GL10WelcomeProps {
  onComplete: (email: string) => void
  savedEmail?: string
}

export default function GL10Welcome({ onComplete, savedEmail }: GL10WelcomeProps) {
  const [email, setEmail] = useState(savedEmail || '')
  const [isFocused, setIsFocused] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)

    try {
      // Log the email capture locally (no external integration for now)
      console.log('GL-10 Email captured:', {
        email,
        source: 'GL-10 Signature Experience',
        timestamp: new Date().toISOString()
      })

      // Simulate brief processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500))

      onComplete(email)
    } catch (err) {
      console.error('Email submission error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-16 pb-64 bg-[#FAF8F5]">
      <div className="w-full max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center space-y-8"
        >
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight text-[#2C2C2C]"
          >
            Welcome to the{' '}
            <span className="text-[#D4AF37]">GL-10 Baby Grand</span>
            <br />
            Signature Experience
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="text-lg md:text-xl text-[#2C2C2C]/70 font-light"
          >
            Take the assessment to claim free delivery and tuning or book an appointment to reserve special financing offers!
          </motion.p>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            onSubmit={handleSubmit}
            className="space-y-6 mt-12"
          >
            {/* Email Input with Floating Label */}
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError('')
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={cn(
                  'w-full px-6 py-4 text-lg rounded-lg border-2 transition-all duration-200',
                  'bg-white text-[#2C2C2C] placeholder-transparent',
                  'focus:outline-none focus:ring-0',
                  error
                    ? 'border-[#C41E3A]'
                    : isFocused
                      ? 'border-[#D4AF37]'
                      : 'border-[#2C2C2C]/10 hover:border-[#2C2C2C]/20'
                )}
                placeholder="Email Address"
                aria-label="Email Address"
                aria-invalid={!!error}
                aria-describedby={error ? 'email-error' : undefined}
              />
              <label
                htmlFor="email"
                className={cn(
                  'absolute left-6 transition-all duration-200 pointer-events-none',
                  'text-[#2C2C2C]/60',
                  email || isFocused
                    ? '-top-2.5 text-sm bg-[#FAF8F5] px-2'
                    : 'top-4 text-lg'
                )}
              >
                Email Address
              </label>

              {/* Error Message */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  id="email-error"
                  className="absolute -bottom-6 left-0 text-sm text-[#C41E3A]"
                >
                  {error}
                </motion.p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'w-full px-8 py-4 text-lg font-medium rounded-lg',
                'bg-[#C41E3A] text-white',
                'hover:bg-[#C41E3A]/90 transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'shadow-lg hover:shadow-xl'
              )}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                'Begin My Journey'
              )}
            </motion.button>

            {/* Privacy Text */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-sm text-[#2C2C2C]/50 mt-4"
            >
              Your information is private and secure
            </motion.p>
          </motion.form>
        </motion.div>
      </div>
    </section>
  )
}
