'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { 
  AppointmentType,
  TimeSlot,
  ContactInformation
} from '../types'

import { bookingFormSchema, type BookingFormData } from '../lib/validation'

interface BookingFormProps {
  appointmentTypes: AppointmentType[]
  availableTimeSlots?: TimeSlot[]
  onSubmit: (data: BookingFormData) => Promise<void>
  onCancel?: () => void
  initialData?: Partial<BookingFormData>
  showroomName?: string
  showroomAddress?: string
  showroomPhone?: string
  isSubmitting?: boolean
  className?: string
}

/**
 * Comprehensive Booking Form Component
 * Handles private viewing appointment scheduling with extensive qualification
 */
export const BookingForm: React.FC<BookingFormProps> = ({
  appointmentTypes,
  availableTimeSlots = [],
  onSubmit,
  onCancel,
  initialData,
  showroomName = "Kawai Piano Showroom",
  showroomAddress = "123 Music Way, Piano City, PC 12345",
  showroomPhone = "(555) 123-4567",
  isSubmitting = false,
  className
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedAppointmentType, setSelectedAppointmentType] = useState<AppointmentType | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimeSlots, setShowTimeSlots] = useState(false)

  const totalSteps = 4

  const { register, handleSubmit, control, formState: { errors }, watch, setValue } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      groupSize: 1,
      optInMarketing: true,
      experienceLevel: 'intermediate',
      timelineUrgency: 'exploring',
      ...initialData
    }
  })

  const watchedValues = watch()

  // Get current date for date picker minimum
  const today = new Date().toISOString().split('T')[0]

  // Generate next 30 days for date selection
  const availableDates = useMemo(() => {
    const dates = []
    const now = new Date()
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(now)
      date.setDate(now.getDate() + i)
      
      // Skip Sundays and Mondays (typically closed)
      if (date.getDay() !== 0 && date.getDay() !== 1) {
        dates.push({
          value: date.toISOString().split('T')[0],
          label: date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          }),
          dayOfWeek: date.getDay()
        })
      }
    }
    
    return dates
  }, [])

  // Generate time slots for selected date
  const timeSlots = useMemo(() => {
    if (!watchedValues.preferredDate) return []
    
    const selectedDate = new Date(watchedValues.preferredDate)
    const dayOfWeek = selectedDate.getDay()
    
    // Business hours: Tue-Thu: 10-8, Fri-Sat: 10-6, Sun: 12-5
    const businessHours = {
      2: { start: 10, end: 20 }, // Tuesday
      3: { start: 10, end: 20 }, // Wednesday  
      4: { start: 10, end: 20 }, // Thursday
      5: { start: 10, end: 18 }, // Friday
      6: { start: 10, end: 18 }  // Saturday
    }
    
    const hours = businessHours[dayOfWeek as keyof typeof businessHours]
    if (!hours) return []
    
    const slots = []
    for (let hour = hours.start; hour < hours.end; hour += 2) {
      slots.push({
        value: `${hour}:00`,
        label: new Date(2000, 0, 1, hour, 0).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        available: Math.random() > 0.3 // Mock availability
      })
    }
    
    return slots
  }, [watchedValues.preferredDate])

  const handleFormSubmit = useCallback(async (data: BookingFormData) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error('Booking submission failed:', error)
    }
  }, [onSubmit])

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }, [currentStep, totalSteps])

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }, [currentStep])

  const canProceedToStep2 = !!(watchedValues.firstName && watchedValues.lastName && 
                           watchedValues.email && watchedValues.phone)

  const canProceedToStep3 = !!watchedValues.appointmentType

  const canProceedToStep4 = !!watchedValues.preferredDate

  return (
    <div className={cn("max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden", className)}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold">
            Schedule Your Private Viewing
          </h2>
          <p className="text-purple-100">
            Book an exclusive appointment at {showroomName}
          </p>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
              <div key={step} className="flex items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-all",
                  step <= currentStep 
                    ? "bg-white text-purple-600" 
                    : "bg-purple-400 text-purple-200"
                )}>
                  {step <= currentStep ? (
                    step < currentStep ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step
                    )
                  ) : (
                    step
                  )}
                </div>
                {step < totalSteps && (
                  <div className={cn(
                    "h-1 w-8 md:w-16 mx-2 transition-all",
                    step < currentStep ? "bg-white" : "bg-purple-400"
                  )} />
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-between text-xs mt-2 opacity-80">
            <span>Contact</span>
            <span>Service</span>
            <span>Schedule</span>
            <span>Confirm</span>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 md:p-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Contact Information */}
          {currentStep === 1 && (
            <ContactInformationStep
              key="step1"
              register={register}
              errors={errors}
              onNext={nextStep}
              canProceed={canProceedToStep2}
            />
          )}

          {/* Step 2: Appointment Type */}
          {currentStep === 2 && (
            <AppointmentTypeStep
              key="step2"
              appointmentTypes={appointmentTypes}
              selectedType={selectedAppointmentType}
              onTypeSelect={setSelectedAppointmentType}
              register={register}
              control={control}
              errors={errors}
              onNext={nextStep}
              onPrev={prevStep}
              setValue={setValue}
              canProceed={canProceedToStep3}
            />
          )}

          {/* Step 3: Date & Time Selection */}
          {currentStep === 3 && (
            <DateTimeStep
              key="step3"
              availableDates={availableDates}
              timeSlots={timeSlots}
              register={register}
              errors={errors}
              watchedValues={watchedValues}
              onNext={nextStep}
              onPrev={prevStep}
              canProceed={canProceedToStep4}
            />
          )}

          {/* Step 4: Additional Details & Confirmation */}
          {currentStep === 4 && (
            <ConfirmationStep
              key="step4"
              register={register}
              control={control}
              errors={errors}
              watchedValues={watchedValues}
              selectedAppointmentType={selectedAppointmentType}
              availableDates={availableDates}
              timeSlots={timeSlots}
              showroomName={showroomName}
              showroomAddress={showroomAddress}
              showroomPhone={showroomPhone}
              onPrev={prevStep}
              onCancel={onCancel}
              isSubmitting={isSubmitting}
            />
          )}
        </AnimatePresence>
      </form>
    </div>
  )
}

/**
 * Step 1: Contact Information
 */
const ContactInformationStep: React.FC<{
  register: any
  errors: any
  onNext: () => void
  canProceed: boolean
}> = ({ register, errors, onNext, canProceed }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2 mb-8">
        <h3 className="text-2xl font-bold text-gray-900">Contact Information</h3>
        <p className="text-gray-600">Let us know how to reach you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <input
            {...register('firstName')}
            type="text"
            className={cn(
              "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all",
              errors.firstName ? "border-red-300" : "border-gray-300"
            )}
            placeholder="Your first name"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            {...register('lastName')}
            type="text"
            className={cn(
              "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all",
              errors.lastName ? "border-red-300" : "border-gray-300"
            )}
            placeholder="Your last name"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            {...register('email')}
            type="email"
            className={cn(
              "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all",
              errors.email ? "border-red-300" : "border-gray-300"
            )}
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            {...register('phone')}
            type="tel"
            className={cn(
              "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all",
              errors.phone ? "border-red-300" : "border-gray-300"
            )}
            placeholder="(555) 123-4567"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className={cn(
            "px-8 py-3 rounded-lg font-semibold transition-all",
            canProceed 
              ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl" 
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          )}
        >
          Continue
        </button>
      </div>
    </motion.div>
  )
}

/**
 * Step 2: Appointment Type Selection
 */
const AppointmentTypeStep: React.FC<{
  appointmentTypes: AppointmentType[]
  selectedType: AppointmentType | null
  onTypeSelect: (type: AppointmentType) => void
  register: any
  control: any
  errors: any
  onNext: () => void
  onPrev: () => void
  setValue: any
  canProceed: boolean
}> = ({ 
  appointmentTypes, 
  selectedType, 
  onTypeSelect, 
  register, 
  control, 
  errors, 
  onNext, 
  onPrev, 
  setValue,
  canProceed 
}) => {
  const handleTypeSelection = useCallback((type: AppointmentType) => {
    onTypeSelect(type)
    setValue('appointmentType', type.id)
  }, [onTypeSelect, setValue])

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2 mb-8">
        <h3 className="text-2xl font-bold text-gray-900">Choose Your Experience</h3>
        <p className="text-gray-600">Select the type of appointment that best fits your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {appointmentTypes.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => handleTypeSelection(type)}
            className={cn(
              "p-6 border-2 rounded-xl text-left transition-all hover:shadow-lg",
              selectedType?.id === type.id 
                ? "border-purple-600 bg-purple-50" 
                : "border-gray-200 hover:border-gray-300"
            )}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h4 className="font-semibold text-gray-900">{type.title}</h4>
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  selectedType?.id === type.id 
                    ? "border-purple-600 bg-purple-600" 
                    : "border-gray-300"
                )}>
                  {selectedType?.id === type.id && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-600">{type.description}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Duration: {type.duration} minutes</span>
                <span className={cn(
                  "px-2 py-1 rounded-full",
                  type.availability === 'immediate' ? "bg-green-100 text-green-700" :
                  type.availability === 'scheduled' ? "bg-blue-100 text-blue-700" :
                  "bg-yellow-100 text-yellow-700"
                )}>
                  {type.availability === 'immediate' ? 'Available Now' :
                   type.availability === 'scheduled' ? 'Scheduled' : 'By Request'}
                </span>
              </div>

              {type.includes && type.includes.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-700 mb-1">What's Included:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {type.includes.slice(0, 3).map((item, index) => (
                      <li key={index} className="flex items-center space-x-1">
                        <div className="w-1 h-1 bg-purple-400 rounded-full" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Additional Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Piano Experience Level
          </label>
          <Controller
            name="experienceLevel"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="beginner">Beginner - New to piano</option>
                <option value="intermediate">Intermediate - Some experience</option>
                <option value="advanced">Advanced - Experienced player</option>
                <option value="professional">Professional - Teaching or performing</option>
              </select>
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Group Size
          </label>
          <Controller
            name="groupSize"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'person' : 'people'}
                  </option>
                ))}
              </select>
            )}
          />
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onPrev}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
        >
          Back
        </button>
        
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className={cn(
            "px-8 py-3 rounded-lg font-semibold transition-all",
            canProceed 
              ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl" 
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          )}
        >
          Continue
        </button>
      </div>
    </motion.div>
  )
}

/**
 * Step 3: Date & Time Selection
 */
const DateTimeStep: React.FC<{
  availableDates: Array<{ value: string; label: string; dayOfWeek: number }>
  timeSlots: Array<{ value: string; label: string; available: boolean }>
  register: any
  errors: any
  watchedValues: any
  onNext: () => void
  onPrev: () => void
  canProceed: boolean
}> = ({ 
  availableDates, 
  timeSlots, 
  register, 
  errors, 
  watchedValues, 
  onNext, 
  onPrev, 
  canProceed 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2 mb-8">
        <h3 className="text-2xl font-bold text-gray-900">Select Date & Time</h3>
        <p className="text-gray-600">Choose your preferred appointment slot</p>
      </div>

      {/* Date Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Preferred Date *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
          {availableDates.map((date) => (
            <label key={date.value} className="relative cursor-pointer">
              <input
                {...register('preferredDate')}
                type="radio"
                value={date.value}
                className="sr-only"
              />
              <div className={cn(
                "p-3 border-2 rounded-lg text-center transition-all hover:shadow-md",
                watchedValues.preferredDate === date.value
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200 hover:border-gray-300"
              )}>
                <div className="text-sm font-medium text-gray-900">
                  {date.label}
                </div>
              </div>
            </label>
          ))}
        </div>
        {errors.preferredDate && (
          <p className="mt-1 text-sm text-red-600">{errors.preferredDate.message}</p>
        )}
      </div>

      {/* Time Selection */}
      {watchedValues.preferredDate && timeSlots.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Preferred Time
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {timeSlots.map((slot) => (
              <label key={slot.value} className={cn(
                "relative cursor-pointer",
                !slot.available && "cursor-not-allowed opacity-50"
              )}>
                <input
                  {...register('preferredTime')}
                  type="radio"
                  value={slot.value}
                  disabled={!slot.available}
                  className="sr-only"
                />
                <div className={cn(
                  "p-3 border-2 rounded-lg text-center transition-all",
                  watchedValues.preferredTime === slot.value && slot.available
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-200 hover:border-gray-300",
                  !slot.available && "bg-gray-100 border-gray-100"
                )}>
                  <div className="text-sm font-medium">
                    {slot.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {slot.available ? 'Available' : 'Booked'}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Business Hours Info */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Showroom Hours</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <div className="flex justify-between">
            <span>Tuesday - Thursday:</span>
            <span>10:00 AM - 8:00 PM</span>
          </div>
          <div className="flex justify-between">
            <span>Friday - Saturday:</span>
            <span>10:00 AM - 6:00 PM</span>
          </div>
          <div className="flex justify-between">
            <span>Sunday - Monday:</span>
            <span className="text-blue-600">Closed</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onPrev}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
        >
          Back
        </button>
        
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className={cn(
            "px-8 py-3 rounded-lg font-semibold transition-all",
            canProceed 
              ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl" 
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          )}
        >
          Continue
        </button>
      </div>
    </motion.div>
  )
}

/**
 * Step 4: Confirmation & Additional Details
 */
const ConfirmationStep: React.FC<{
  register: any
  control: any
  errors: any
  watchedValues: any
  selectedAppointmentType: AppointmentType | null
  availableDates: Array<{ value: string; label: string }>
  timeSlots: Array<{ value: string; label: string }>
  showroomName: string
  showroomAddress: string
  showroomPhone: string
  onPrev: () => void
  onCancel?: () => void
  isSubmitting: boolean
}> = ({ 
  register, 
  control, 
  errors, 
  watchedValues, 
  selectedAppointmentType,
  availableDates,
  timeSlots,
  showroomName,
  showroomAddress,
  showroomPhone,
  onPrev, 
  onCancel, 
  isSubmitting 
}) => {
  const selectedDate = availableDates.find(d => d.value === watchedValues.preferredDate)
  const selectedTime = timeSlots.find(t => t.value === watchedValues.preferredTime)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2 mb-8">
        <h3 className="text-2xl font-bold text-gray-900">Confirm Your Appointment</h3>
        <p className="text-gray-600">Review your details and complete your booking</p>
      </div>

      {/* Appointment Summary */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
        <h4 className="font-semibold text-purple-900 mb-4">Appointment Summary</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div>
              <span className="text-gray-600">Name:</span>
              <span className="ml-2 font-medium">{watchedValues.firstName} {watchedValues.lastName}</span>
            </div>
            <div>
              <span className="text-gray-600">Email:</span>
              <span className="ml-2 font-medium">{watchedValues.email}</span>
            </div>
            <div>
              <span className="text-gray-600">Phone:</span>
              <span className="ml-2 font-medium">{watchedValues.phone}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div>
              <span className="text-gray-600">Service:</span>
              <span className="ml-2 font-medium">{selectedAppointmentType?.title}</span>
            </div>
            <div>
              <span className="text-gray-600">Date:</span>
              <span className="ml-2 font-medium">{selectedDate?.label}</span>
            </div>
            <div>
              <span className="text-gray-600">Time:</span>
              <span className="ml-2 font-medium">{selectedTime?.label}</span>
            </div>
            <div>
              <span className="text-gray-600">Duration:</span>
              <span className="ml-2 font-medium">{selectedAppointmentType?.duration} minutes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Budget Range (Optional)
          </label>
          <Controller
            name="budgetRange"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="">Select a range</option>
                <option value="under-10k">Under $10,000</option>
                <option value="10k-25k">$10,000 - $25,000</option>
                <option value="25k-50k">$25,000 - $50,000</option>
                <option value="50k-100k">$50,000 - $100,000</option>
                <option value="over-100k">Over $100,000</option>
                <option value="undecided">Still deciding</option>
              </select>
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How did you hear about us?
          </label>
          <Controller
            name="hearAboutUs"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="">Select an option</option>
                <option value="google">Google Search</option>
                <option value="social-media">Social Media</option>
                <option value="referral">Friend/Family Referral</option>
                <option value="advertisement">Advertisement</option>
                <option value="music-teacher">Music Teacher</option>
                <option value="other">Other</option>
              </select>
            )}
          />
        </div>
      </div>

      {/* Special Requests */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special Requests or Questions
        </label>
        <textarea
          {...register('specialRequests')}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          placeholder="Any specific questions, accessibility needs, or special accommodations?"
        />
      </div>

      {/* Marketing Opt-in */}
      <div className="flex items-start space-x-3">
        <input
          {...register('optInMarketing')}
          type="checkbox"
          className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-0.5"
        />
        <label className="text-sm text-gray-600 leading-relaxed">
          I'd like to receive updates about new piano arrivals, special events, and exclusive offers. 
          You can unsubscribe anytime.
        </label>
      </div>

      {/* Showroom Information */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Visit Information</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{showroomAddress}</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>{showroomPhone}</span>
          </div>
          <p className="mt-2 text-xs">
            Free parking available. Please arrive 10 minutes early for your appointment.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onPrev}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
        >
          Back
        </button>
        
        <div className="flex space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-all"
            >
              Cancel
            </button>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl",
              isSubmitting && "opacity-50 cursor-not-allowed"
            )}
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Booking Appointment...</span>
              </div>
            ) : (
              "Confirm Appointment"
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default BookingForm