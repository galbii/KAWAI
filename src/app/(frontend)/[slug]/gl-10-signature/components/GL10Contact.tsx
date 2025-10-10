'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, User, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

// Zod validation schema
const contactSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Please enter a valid first name'),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Please enter a valid last name'),
  phone: z
    .string()
    .min(10, 'Please enter a valid phone number')
    .regex(/^[\d\s()+-]+$/, 'Please enter a valid phone number')
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => val.length >= 10, 'Phone number must be at least 10 digits')
})

export type ContactFormData = z.infer<typeof contactSchema>

interface GL10ContactProps {
  onComplete: (data: ContactFormData) => void
  savedData?: Partial<ContactFormData>
}

// Phone number formatting utility
function formatPhoneNumber(value: string): string {
  const phoneNumber = value.replace(/\D/g, '')
  const phoneNumberLength = phoneNumber.length

  if (phoneNumberLength < 4) return phoneNumber
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
}

export default function GL10Contact({ onComplete, savedData }: GL10ContactProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    setValue,
    watch
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: savedData?.firstName || '',
      lastName: savedData?.lastName || '',
      phone: savedData?.phone || ''
    }
  })

  const phoneValue = watch('phone')

  // Handle phone number formatting
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setValue('phone', formatted, { shouldValidate: !!touchedFields.phone })
  }

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)

    // Brief delay for UX
    await new Promise((resolve) => setTimeout(resolve, 500))

    setShowSuccess(true)

    // Wait for success animation
    setTimeout(() => {
      onComplete(data)
    }, 1200)
  }

  return (
    <section className="py-16 md:py-24 pb-64 bg-kawai-pearl">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-10 md:mb-12">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-kawai-charcoal mb-4">
              Let's Make This Personal
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Tell us a bit about yourself so we can craft your perfect experience
            </p>
          </div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border-2 border-kawai-pearl">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name Fields Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="relative">
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      First Name <span className="text-kawai-red">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className={cn(
                          'w-5 h-5 transition-colors',
                          errors.firstName ? 'text-red-500' : 'text-gray-400'
                        )} />
                      </div>
                      <input
                        id="firstName"
                        type="text"
                        {...register('firstName')}
                        className={cn(
                          'w-full min-h-[56px] pl-12 pr-4 py-4 text-lg',
                          'bg-white border-2 rounded-xl transition-all duration-200',
                          'text-gray-900 placeholder:text-gray-400',
                          'focus:outline-none focus:ring-2 focus:ring-kawai-red/20',
                          errors.firstName
                            ? 'border-red-300 focus:border-red-500'
                            : 'border-gray-200 focus:border-kawai-red'
                        )}
                        placeholder="John"
                        disabled={isSubmitting}
                      />
                    </div>
                    <AnimatePresence>
                      {errors.firstName && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mt-2 text-sm text-red-600"
                        >
                          {errors.firstName.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Last Name */}
                  <div className="relative">
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Last Name <span className="text-kawai-red">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className={cn(
                          'w-5 h-5 transition-colors',
                          errors.lastName ? 'text-red-500' : 'text-gray-400'
                        )} />
                      </div>
                      <input
                        id="lastName"
                        type="text"
                        {...register('lastName')}
                        className={cn(
                          'w-full min-h-[56px] pl-12 pr-4 py-4 text-lg',
                          'bg-white border-2 rounded-xl transition-all duration-200',
                          'text-gray-900 placeholder:text-gray-400',
                          'focus:outline-none focus:ring-2 focus:ring-kawai-red/20',
                          errors.lastName
                            ? 'border-red-300 focus:border-red-500'
                            : 'border-gray-200 focus:border-kawai-red'
                        )}
                        placeholder="Doe"
                        disabled={isSubmitting}
                      />
                    </div>
                    <AnimatePresence>
                      {errors.lastName && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mt-2 text-sm text-red-600"
                        >
                          {errors.lastName.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="relative">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone Number <span className="text-kawai-red">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className={cn(
                        'w-5 h-5 transition-colors',
                        errors.phone ? 'text-red-500' : 'text-gray-400'
                      )} />
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      onChange={handlePhoneChange}
                      className={cn(
                        'w-full min-h-[56px] pl-12 pr-4 py-4 text-lg',
                        'bg-white border-2 rounded-xl transition-all duration-200',
                        'text-gray-900 placeholder:text-gray-400',
                        'focus:outline-none focus:ring-2 focus:ring-kawai-red/20',
                        errors.phone
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-200 focus:border-kawai-red'
                      )}
                      placeholder="(555) 123-4567"
                      disabled={isSubmitting}
                    />
                  </div>
                  <AnimatePresence>
                    {errors.phone && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-2 text-sm text-red-600"
                      >
                        {errors.phone.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      'w-full min-h-[56px] px-8 py-4 text-lg font-semibold',
                      'bg-kawai-red text-white rounded-xl',
                      'transition-all duration-200',
                      'hover:bg-kawai-red/90 hover:shadow-lg hover:-translate-y-0.5',
                      'focus:outline-none focus:ring-4 focus:ring-kawai-red/20',
                      'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0',
                      'relative overflow-hidden'
                    )}
                  >
                    <AnimatePresence mode="wait">
                      {showSuccess ? (
                        <motion.span
                          key="success"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 className="w-6 h-6" />
                          Success!
                        </motion.span>
                      ) : (
                        <motion.span
                          key="submit"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          {isSubmitting ? 'Processing...' : 'Continue to Your Invitation'}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </div>

                {/* Privacy Note */}
                <p className="text-center text-sm text-gray-500 pt-2">
                  Your information is secure and will only be used to personalize your experience.
                </p>
              </form>
            </div>

            {/* Decorative Border Accent */}
            <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-kawai-red/5 rounded-3xl -z-10" />
            <div className="absolute -top-2 -left-2 w-24 h-24 bg-kawai-red/5 rounded-3xl -z-10" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
