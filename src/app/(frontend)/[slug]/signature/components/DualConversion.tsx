'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { RefactoredEmailForm } from '@/components/forms/RefactoredEmailForm'

import type { AssessmentResponse } from '../types'

interface DualConversionProps {
  assessmentResults: AssessmentResponse
  onComplete: (type: 'email' | 'booking', data: Record<string, unknown>) => void
  location: string
  className?: string
}

// Booking form schema
const bookingSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  preferredDate: z.string().min(1, 'Please select a preferred date'),
  preferredTime: z.string().min(1, 'Please select a preferred time'),
  message: z.string().optional()
})

type BookingFormData = z.infer<typeof bookingSchema>

/**
 * Dual Conversion Component
 * Offers digital (email capture) or in-person (booking) conversion paths
 */
export const DualConversion: React.FC<DualConversionProps> = ({
  assessmentResults,
  onComplete,
  location,
  className
}) => {
  const [selectedPath, setSelectedPath] = useState<'digital' | 'showroom' | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Booking form
  const bookingForm = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    mode: 'onChange'
  })


  const handleBookingSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true)
    try {
      await onComplete('booking', {
        ...data,
        conversionType: 'showroom',
        assessmentResults,
        location
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!selectedPath) {
    return (
      <div className={cn("max-w-4xl mx-auto", className)}>
        {/* Qualification Success Message */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-kawai-red/10 rounded-full mb-6">
            <svg className="w-8 h-8 text-kawai-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-light font-serif text-kawai-black mb-4">
            You're invited
          </h2>
          <p className="text-xl text-kawai-black/70 max-w-2xl mx-auto mb-2">
            Kawai believes you'd be a perfect fit for this event and would like to offer a warm welcome to the Signature Collection!
          </p>
          <p className="text-lg text-kawai-red font-medium">
            Get personalized recommendations or claim your invite now!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Digital Path */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedPath('digital')}
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100 cursor-pointer group hover:shadow-xl transition-all duration-300"
          >
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Receive Heritage Collection Preview
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Access exclusive preview of our master craftsman collection with detailed heritage specifications and your formal consultation invitation.
                </p>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Exclusive heritage collection catalog</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Formal invitation within 24 hours</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Master craftsman consultation priority</span>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
              >
                Access Preview Collection
              </motion.button>
            </div>
          </motion.div>

          {/* Showroom Path */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedPath('showroom')}
            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-100 cursor-pointer group hover:shadow-xl transition-all duration-300"
          >
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Request Premium Consultation
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Secure private access to our heritage instruments with dedicated guidance from certified master craftsmen.
                </p>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span>Private master craftsman appointment</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span>Exclusive heritage instrument access</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span>Limited-time consultation rates</span>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
              >
                Request Consultation
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={cn("max-w-2xl mx-auto", className)}>
      <AnimatePresence mode="wait">
        {selectedPath === 'digital' && (
          <RefactoredEmailForm
            onComplete={onComplete}
            assessmentResults={assessmentResults}
            location={location}
            onBack={() => setSelectedPath(null)}
          />
        )}

        {selectedPath === 'showroom' && (
          <motion.div
            key="booking-form"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Request Your Master Craftsman Consultation
              </h3>
              <p className="text-gray-600">
                Secure your private appointment with our certified heritage specialists for exclusive instrument access.
              </p>
            </div>
            
            <form onSubmit={bookingForm.handleSubmit(handleBookingSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    {...bookingForm.register('firstName')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="John"
                  />
                  {bookingForm.formState.errors.firstName && (
                    <p className="text-red-600 text-sm mt-1">
                      {bookingForm.formState.errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    {...bookingForm.register('lastName')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Doe"
                  />
                  {bookingForm.formState.errors.lastName && (
                    <p className="text-red-600 text-sm mt-1">
                      {bookingForm.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    {...bookingForm.register('email')}
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="john.doe@example.com"
                  />
                  {bookingForm.formState.errors.email && (
                    <p className="text-red-600 text-sm mt-1">
                      {bookingForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    {...bookingForm.register('phone')}
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="(555) 123-4567"
                  />
                  {bookingForm.formState.errors.phone && (
                    <p className="text-red-600 text-sm mt-1">
                      {bookingForm.formState.errors.phone.message}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date *
                  </label>
                  <input
                    {...bookingForm.register('preferredDate')}
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                  {bookingForm.formState.errors.preferredDate && (
                    <p className="text-red-600 text-sm mt-1">
                      {bookingForm.formState.errors.preferredDate.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time *
                  </label>
                  <select
                    {...bookingForm.register('preferredTime')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="">Select a time</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                    <option value="5:00 PM">5:00 PM</option>
                  </select>
                  {bookingForm.formState.errors.preferredTime && (
                    <p className="text-red-600 text-sm mt-1">
                      {bookingForm.formState.errors.preferredTime.message}
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Message (optional)
                </label>
                <textarea
                  {...bookingForm.register('message')}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Any specific heritage instruments you'd like to experience or questions about our collection..."
                />
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedPath(null)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Back
                </button>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Requesting...' : 'Request My Consultation'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default DualConversion