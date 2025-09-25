'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// Interfaces
interface BookingFormData {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  selectedDate: string
  selectedTime: string
  pianoInterest: string
  notes: string
}

interface ConsultationBookingModalProps {
  isOpen: boolean
  onClose: () => void
  signaturePageSlug?: string
  onSuccess?: (bookingData: BookingFormData) => void
}

// Available date options (October 9-12, 2024)
const availableDates = [
  { value: '2024-10-09', label: 'October 9', day: 'Wednesday' },
  { value: '2024-10-10', label: 'October 10', day: 'Thursday' },
  { value: '2024-10-11', label: 'October 11', day: 'Friday' },
  { value: '2024-10-12', label: 'October 12', day: 'Saturday' },
]

// Available time slots
const timeSlots = [
  { value: '09:00', label: '9:00 AM', period: 'Morning' },
  { value: '10:00', label: '10:00 AM', period: 'Morning' },
  { value: '11:00', label: '11:00 AM', period: 'Morning' },
  { value: '13:00', label: '1:00 PM', period: 'Afternoon' },
  { value: '14:00', label: '2:00 PM', period: 'Afternoon' },
  { value: '15:00', label: '3:00 PM', period: 'Afternoon' },
  { value: '16:00', label: '4:00 PM', period: 'Afternoon' },
  { value: '17:00', label: '5:00 PM', period: 'Evening' },
  { value: '18:00', label: '6:00 PM', period: 'Evening' },
]

const pianoTypes = [
  { value: 'grand', label: 'Grand Piano' },
  { value: 'upright', label: 'Upright Piano' },
  { value: 'digital', label: 'Digital Piano' },
  { value: 'hybrid', label: 'Hybrid Piano' },
  { value: 'multiple', label: 'Not Sure / Multiple' },
]

// Premium input component
function PremiumInput({
  label,
  error,
  required = false,
  className = '',
  ...props
}: {
  label: string
  error?: string
  required?: boolean
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={cn('space-y-2', className)}>
      <label className="block text-sm font-medium text-kawai-pearl">
        {label}
        {required && <span className="text-kawai-gold ml-1">*</span>}
      </label>
      <input
        {...props}
        className={cn(
          'w-full px-4 py-3 rounded-lg border transition-all duration-300',
          'bg-kawai-black/50 backdrop-blur-sm text-kawai-pearl placeholder-kawai-pearl/50',
          'border-kawai-gold/30 hover:border-kawai-gold/50 focus:border-kawai-gold focus:ring-1 focus:ring-kawai-gold/30',
          'focus:outline-none',
          error && 'border-red-400 focus:border-red-400 focus:ring-red-400/30'
        )}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-xs"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

// Premium select component
function PremiumSelect({
  label,
  options,
  error,
  required = false,
  className = '',
  ...props
}: {
  label: string
  options: { value: string; label: string }[]
  error?: string
  required?: boolean
  className?: string
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={cn('space-y-2', className)}>
      <label className="block text-sm font-medium text-kawai-pearl">
        {label}
        {required && <span className="text-kawai-gold ml-1">*</span>}
      </label>
      <select
        {...props}
        className={cn(
          'w-full px-4 py-3 rounded-lg border transition-all duration-300 cursor-pointer',
          'bg-kawai-black/50 backdrop-blur-sm text-kawai-pearl',
          'border-kawai-gold/30 hover:border-kawai-gold/50 focus:border-kawai-gold focus:ring-1 focus:ring-kawai-gold/30',
          'focus:outline-none',
          error && 'border-red-400 focus:border-red-400 focus:ring-red-400/30'
        )}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-kawai-black text-kawai-pearl">
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-xs"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

// Premium textarea component
function PremiumTextarea({
  label,
  error,
  required = false,
  className = '',
  ...props
}: {
  label: string
  error?: string
  required?: boolean
  className?: string
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className={cn('space-y-2', className)}>
      <label className="block text-sm font-medium text-kawai-pearl">
        {label}
        {required && <span className="text-kawai-gold ml-1">*</span>}
      </label>
      <textarea
        {...props}
        className={cn(
          'w-full px-4 py-3 rounded-lg border transition-all duration-300 resize-none',
          'bg-kawai-black/50 backdrop-blur-sm text-kawai-pearl placeholder-kawai-pearl/50',
          'border-kawai-gold/30 hover:border-kawai-gold/50 focus:border-kawai-gold focus:ring-1 focus:ring-kawai-gold/30',
          'focus:outline-none min-h-[100px]',
          error && 'border-red-400 focus:border-red-400 focus:ring-red-400/30'
        )}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-xs"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

// Date and time selection grid
function DateTimeSelector({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  errors
}: {
  selectedDate: string
  selectedTime: string
  onDateChange: (date: string) => void
  onTimeChange: (time: string) => void
  errors: { selectedDate?: string; selectedTime?: string }
}) {
  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-kawai-pearl">
          Select Date <span className="text-kawai-gold">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {availableDates.map((date) => (
            <motion.button
              key={date.value}
              type="button"
              onClick={() => onDateChange(date.value)}
              className={cn(
                'p-4 rounded-lg border transition-all duration-300 text-left',
                'hover:scale-105 focus:outline-none focus:ring-2 focus:ring-kawai-gold/30',
                selectedDate === date.value
                  ? 'bg-kawai-gold text-kawai-black border-kawai-gold shadow-lg shadow-kawai-gold/20'
                  : 'bg-kawai-black/30 text-kawai-pearl border-kawai-gold/30 hover:border-kawai-gold/50 hover:bg-kawai-gold/10'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="font-medium">{date.label}</div>
              <div className={cn(
                'text-xs',
                selectedDate === date.value ? 'text-kawai-black/70' : 'text-kawai-pearl/60'
              )}>
                {date.day}
              </div>
            </motion.button>
          ))}
        </div>
        {errors.selectedDate && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-xs"
          >
            {errors.selectedDate}
          </motion.p>
        )}
      </div>

      {/* Time Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-kawai-pearl">
          Select Time <span className="text-kawai-gold">*</span>
        </label>
        <div className="space-y-4">
          {['Morning', 'Afternoon', 'Evening'].map((period) => {
            const periodSlots = timeSlots.filter(slot => slot.period === period)
            return (
              <div key={period} className="space-y-2">
                <h4 className="text-xs font-medium text-kawai-pearl/70 uppercase tracking-wider">
                  {period}
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {periodSlots.map((slot) => (
                    <motion.button
                      key={slot.value}
                      type="button"
                      onClick={() => onTimeChange(slot.value)}
                      className={cn(
                        'py-2 px-3 rounded-lg border transition-all duration-300 text-sm',
                        'hover:scale-105 focus:outline-none focus:ring-2 focus:ring-kawai-gold/30',
                        selectedTime === slot.value
                          ? 'bg-kawai-gold text-kawai-black border-kawai-gold shadow-lg shadow-kawai-gold/20'
                          : 'bg-kawai-black/30 text-kawai-pearl border-kawai-gold/30 hover:border-kawai-gold/50 hover:bg-kawai-gold/10'
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {slot.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        {errors.selectedTime && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-xs"
          >
            {errors.selectedTime}
          </motion.p>
        )}
      </div>
    </div>
  )
}

// Main booking modal component
export function ConsultationBookingModal({
  isOpen,
  onClose,
  signaturePageSlug,
  onSuccess
}: ConsultationBookingModalProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    selectedDate: '',
    selectedTime: '',
    pianoInterest: '',
    notes: ''
  })

  const [errors, setErrors] = useState<Partial<BookingFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Handle form field changes
  const handleChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<BookingFormData> = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.selectedDate) newErrors.selectedDate = 'Please select a date'
    if (!formData.selectedTime) newErrors.selectedTime = 'Please select a time'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Create booking data
      const bookingData = {
        ...formData,
        eventType: 'premium-consultation',
        status: 'pending',
        sourceSignaturePage: signaturePageSlug || '',
        userAgent: navigator.userAgent,
        // Note: In production, you'd get IP address server-side for security
      }

      // Submit to Payload CMS API
      const response = await fetch('/api/consultation-bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit booking')
      }

      const result = await response.json()
      console.log('Booking submitted successfully:', result)

      setSubmitSuccess(true)
      onSuccess?.(formData)

      // Close modal after delay
      setTimeout(() => {
        onClose()
        setSubmitSuccess(false)
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          selectedDate: '',
          selectedTime: '',
          pianoInterest: '',
          notes: ''
        })
      }, 2000)

    } catch (error) {
      console.error('Error submitting booking:', error)
      setErrors({ email: 'Failed to submit booking. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-kawai-black/90 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative bg-gradient-to-br from-gray-900 to-kawai-black rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-kawai-gold/20"
          >
            {/* Success state */}
            <AnimatePresence>
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-kawai-black/95 backdrop-blur-sm flex items-center justify-center z-10"
                >
                  <div className="text-center space-y-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: "spring" }}
                      className="w-16 h-16 bg-kawai-gold rounded-full flex items-center justify-center mx-auto"
                    >
                      <svg className="w-8 h-8 text-kawai-black" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                    <h3 className="text-2xl font-light text-kawai-pearl">Consultation Booked!</h3>
                    <p className="text-kawai-pearl/70">We'll send you a confirmation email shortly.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-kawai-gold/20">
              <div>
                <h2 className="text-2xl font-light text-kawai-pearl">
                  Reserve Your <span className="text-kawai-gold">Premium Consultation</span>
                </h2>
                <p className="text-kawai-pearl/70 text-sm mt-1">
                  Exclusive access to our signature piano selection • October 9-12, 2024
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-kawai-pearl/60 hover:text-kawai-pearl transition-colors duration-300 p-2"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-kawai-pearl border-b border-kawai-gold/20 pb-2">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PremiumInput
                      label="First Name"
                      required
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      {...(errors.firstName && { error: errors.firstName })}
                    />
                    <PremiumInput
                      label="Last Name"
                      required
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      {...(errors.lastName && { error: errors.lastName })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PremiumInput
                      label="Email Address"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      {...(errors.email && { error: errors.email })}
                    />
                    <PremiumInput
                      label="Phone Number"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleChange('phoneNumber', e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                {/* Date and Time Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-kawai-pearl border-b border-kawai-gold/20 pb-2">
                    Select Your Consultation
                  </h3>
                  <DateTimeSelector
                    selectedDate={formData.selectedDate}
                    selectedTime={formData.selectedTime}
                    onDateChange={(date) => handleChange('selectedDate', date)}
                    onTimeChange={(time) => handleChange('selectedTime', time)}
                    errors={errors}
                  />
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-kawai-pearl border-b border-kawai-gold/20 pb-2">
                    Additional Information
                  </h3>
                  <PremiumSelect
                    label="Piano Interest"
                    options={pianoTypes}
                    value={formData.pianoInterest}
                    onChange={(e) => handleChange('pianoInterest', e.target.value)}
                  />
                  <PremiumTextarea
                    label="Special Requests or Questions"
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="Tell us about your musical background, space requirements, or any specific instruments you'd like to explore..."
                    rows={3}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-3 border border-kawai-gold/30 text-kawai-pearl hover:bg-kawai-gold/10 transition-all duration-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      'flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300',
                      'bg-gradient-to-r from-kawai-gold to-kawai-gold/90 text-kawai-black',
                      'hover:from-kawai-gold/90 hover:to-kawai-gold shadow-lg hover:shadow-xl',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      'focus:outline-none focus:ring-2 focus:ring-kawai-gold/30'
                    )}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  >
                    {isSubmitting ? 'Booking Your Consultation...' : 'Reserve My Consultation'}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}