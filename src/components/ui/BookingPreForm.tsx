'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// Validation schemas for each step
const step1Schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
})

const step2Schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
})

const fullSchema = step1Schema.merge(step2Schema)

type Step1Data = z.infer<typeof step1Schema>
type Step2Data = z.infer<typeof step2Schema>
type FullFormData = z.infer<typeof fullSchema>

export interface BookingPreFormData {
  email: string
  firstName: string
  lastName: string
  name?: string
  phone: string
}

interface BookingPreFormProps {
  onSubmit: (data: BookingPreFormData) => void
  onCancel?: () => void
  modalTitle?: string
}

/**
 * Multi-Step Booking Form - Piano Key Inspired Luxury
 *
 * A premium two-step contact collection experience with:
 * - Piano key-inspired progress indicators
 * - Smooth mechanical transitions
 * - Refined typography and spacing
 * - Gold hardware accents
 * - Tactile interaction feedback
 */
export function BookingPreForm({ onSubmit, onCancel, modalTitle }: BookingPreFormProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1)
  const [step1Data, setStep1Data] = useState<Partial<Step1Data>>({})

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
  } = useForm<FullFormData>({
    resolver: zodResolver(fullSchema),
    defaultValues: step1Data,
    mode: 'onBlur',
  })

  const actualModalTitle = modalTitle || 'Schedule Your Consultation'

  // Handle step 1 completion
  const handleStep1Next = async () => {
    const isValid = await trigger(['firstName', 'lastName'])
    if (isValid) {
      const formData = new FormData(document.querySelector('form') as HTMLFormElement)
      setStep1Data({
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
      })
      setCurrentStep(2)
    }
  }

  // Handle final submission
  const handleFinalSubmit = (data: FullFormData) => {
    const prefillData: BookingPreFormData = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      name: `${data.firstName} ${data.lastName}`,
      phone: data.phone,
    }
    onSubmit(prefillData)
  }

  // Piano key press animation variants
  const keyPressVariants = {
    initial: { y: 0, boxShadow: '0 6px 0 0 rgba(160, 23, 48, 0.8), 0 12px 24px rgba(196, 30, 58, 0.3)' },
    hover: { y: -2, boxShadow: '0 8px 0 0 rgba(160, 23, 48, 0.9), 0 16px 32px rgba(196, 30, 58, 0.4)' },
    tap: { y: 3, boxShadow: '0 2px 0 0 rgba(160, 23, 48, 0.6), 0 4px 8px rgba(196, 30, 58, 0.2)' },
  }

  // Step transition variants
  const stepVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
  }

  return (
    <div className="w-full max-w-lg mx-auto p-8 md:p-12 relative">
      {/* Subtle wood grain texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015] rounded-2xl"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulance type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Header with clean typography */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-8 relative"
      >
        <h2 className="text-2xl md:text-3xl font-semibold text-[#2C2C2C] mb-2 tracking-tight">
          {actualModalTitle}
        </h2>
        <p className="text-sm text-[#2C2C2C]/60">
          Please enter your information to continue
        </p>
      </motion.div>

      {/* Form Container */}
      <form onSubmit={handleSubmit(handleFinalSubmit)} className="relative">
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" custom={currentStep}>
            {currentStep === 1 ? (
              /* Step 1: Name Fields */
              <motion.div
                key="step1"
                custom={1}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 },
                }}
                className="space-y-6"
              >
                {/* First Name */}
                <div className="relative group">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-[#2C2C2C]/70 mb-2"
                  >
                    First Name
                  </label>
                  <div className="relative">
                    <input
                      {...register('firstName')}
                      type="text"
                      id="firstName"
                      className={cn(
                        'w-full px-5 py-4 rounded-lg border-2 text-[#2C2C2C] text-lg',
                        'focus:outline-none focus:border-[#D4AF37] focus:shadow-[0_0_0_4px_rgba(212,175,55,0.1)]',
                        'transition-all duration-300',
                        'bg-gradient-to-b from-white to-[#F8F8F8]',
                        errors.firstName
                          ? 'border-[#C41E3A] bg-red-50/50'
                          : 'border-[#2C2C2C]/10 hover:border-[#2C2C2C]/20'
                      )}
                      placeholder="Enter your first name"
                      
                    />
                    {/* Gold accent line on focus */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                  </div>
                  {errors.firstName && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-[#C41E3A] flex items-center gap-2"
                      
                    >
                      <span className="w-1 h-1 rounded-full bg-[#C41E3A]" />
                      {errors.firstName.message}
                    </motion.p>
                  )}
                </div>

                {/* Last Name */}
                <div className="relative group">
                  <label
                    htmlFor="lastName"
                    className="block text-xs font-medium text-[#2C2C2C]/70 mb-2 uppercase tracking-widest"
                    
                  >
                    Last Name
                  </label>
                  <div className="relative">
                    <input
                      {...register('lastName')}
                      type="text"
                      id="lastName"
                      className={cn(
                        'w-full px-5 py-4 rounded-lg border-2 text-[#2C2C2C] text-lg',
                        'focus:outline-none focus:border-[#D4AF37] focus:shadow-[0_0_0_4px_rgba(212,175,55,0.1)]',
                        'transition-all duration-300',
                        'bg-gradient-to-b from-white to-[#F8F8F8]',
                        errors.lastName
                          ? 'border-[#C41E3A] bg-red-50/50'
                          : 'border-[#2C2C2C]/10 hover:border-[#2C2C2C]/20'
                      )}
                      placeholder="Enter your last name"
                      
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                  </div>
                  {errors.lastName && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-[#C41E3A] flex items-center gap-2"
                      
                    >
                      <span className="w-1 h-1 rounded-full bg-[#C41E3A]" />
                      {errors.lastName.message}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            ) : (
              /* Step 2: Contact Fields */
              <motion.div
                key="step2"
                custom={2}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 },
                }}
                className="space-y-6"
              >
                {/* Email */}
                <div className="relative group">
                  <label
                    htmlFor="email"
                    className="block text-xs font-medium text-[#2C2C2C]/70 mb-2 uppercase tracking-widest"
                    
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      {...register('email')}
                      type="email"
                      id="email"
                      className={cn(
                        'w-full px-5 py-4 rounded-lg border-2 text-[#2C2C2C] text-lg',
                        'focus:outline-none focus:border-[#D4AF37] focus:shadow-[0_0_0_4px_rgba(212,175,55,0.1)]',
                        'transition-all duration-300',
                        'bg-gradient-to-b from-white to-[#F8F8F8]',
                        errors.email
                          ? 'border-[#C41E3A] bg-red-50/50'
                          : 'border-[#2C2C2C]/10 hover:border-[#2C2C2C]/20'
                      )}
                      placeholder="your.email@example.com"
                      
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                  </div>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-[#C41E3A] flex items-center gap-2"
                      
                    >
                      <span className="w-1 h-1 rounded-full bg-[#C41E3A]" />
                      {errors.email.message}
                    </motion.p>
                  )}
                </div>

                {/* Phone */}
                <div className="relative group">
                  <label
                    htmlFor="phone"
                    className="block text-xs font-medium text-[#2C2C2C]/70 mb-2 uppercase tracking-widest"
                    
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      {...register('phone')}
                      type="tel"
                      id="phone"
                      className={cn(
                        'w-full px-5 py-4 rounded-lg border-2 text-[#2C2C2C] text-lg',
                        'focus:outline-none focus:border-[#D4AF37] focus:shadow-[0_0_0_4px_rgba(212,175,55,0.1)]',
                        'transition-all duration-300',
                        'bg-gradient-to-b from-white to-[#F8F8F8]',
                        errors.phone
                          ? 'border-[#C41E3A] bg-red-50/50'
                          : 'border-[#2C2C2C]/10 hover:border-[#2C2C2C]/20'
                      )}
                      placeholder="(555) 123-4567"
                      
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                  </div>
                  {errors.phone && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-[#C41E3A] flex items-center gap-2"
                      
                    >
                      <span className="w-1 h-1 rounded-full bg-[#C41E3A]" />
                      {errors.phone.message}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons - Piano Key Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex gap-4 mt-10"
        >
          {/* Back / Cancel Button */}
          {currentStep === 1 && onCancel ? (
            <motion.button
              type="button"
              onClick={onCancel}
              variants={keyPressVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="flex-1 px-8 py-4 rounded-lg border-2 border-[#2C2C2C]/20 text-[#2C2C2C] font-medium hover:border-[#2C2C2C]/40 hover:bg-[#2C2C2C]/05 transition-colors duration-200 uppercase tracking-widest text-sm"
              
            >
              Cancel
            </motion.button>
          ) : currentStep === 2 ? (
            <motion.button
              type="button"
              onClick={() => setCurrentStep(1)}
              variants={keyPressVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="flex-1 px-8 py-4 rounded-lg border-2 border-[#2C2C2C]/20 text-[#2C2C2C] font-medium hover:border-[#2C2C2C]/40 hover:bg-[#2C2C2C]/05 transition-colors duration-200 uppercase tracking-widest text-sm"
              
            >
              Back
            </motion.button>
          ) : null}

          {/* Next / Submit Button - Piano Key Design */}
          <motion.button
            type={currentStep === 1 ? 'button' : 'submit'}
            onClick={currentStep === 1 ? handleStep1Next : undefined}
            disabled={isSubmitting}
            variants={keyPressVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            className={cn(
              'flex-1 px-8 py-4 rounded-lg font-medium text-white relative overflow-hidden',
              'uppercase tracking-widest text-sm',
              'bg-gradient-to-b from-[#C41E3A] to-[#A01730]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'shadow-[0_6px_0_0_rgba(160,23,48,0.8),0_12px_24px_rgba(196,30,58,0.3)]'
            )}
            
          >
            {/* Gold shimmer effect */}
            <div
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full pointer-events-none opacity-30"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)',
                transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
            />
            <span className="relative z-10">
              {isSubmitting
                ? 'Processing...'
                : currentStep === 1
                ? 'Continue'
                : 'Book Consultation'}
            </span>
          </motion.button>
        </motion.div>
      </form>

      {/* Privacy Notice - Refined Typography */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-8 text-xs text-center text-[#2C2C2C]/40 leading-relaxed"
        
      >
        Your information will be used to schedule your consultation and may be added to our mailing
        list. We respect your privacy.
      </motion.p>
    </div>
  )
}
