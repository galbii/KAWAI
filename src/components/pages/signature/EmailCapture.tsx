'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { emailCaptureSchema, type EmailCaptureData } from './lib/validation'

interface EmailCaptureProps {
  onSubmit: (data: EmailCaptureData) => Promise<void>
  onSuccess?: (data: EmailCaptureData) => void
  onError?: (error: string) => void
  isSubmitting?: boolean
  className?: string
}

/**
 * Simple Email Capture Component
 * Clean and working version for the signature page
 */
export const EmailCapture: React.FC<EmailCaptureProps> = ({
  onSubmit,
  onSuccess,
  onError,
  isSubmitting = false,
  className
}) => {
  const [step, setStep] = useState<'form' | 'success' | 'error'>('form')

  const { register, handleSubmit, formState: { errors } } = useForm<EmailCaptureData>({
    resolver: zodResolver(emailCaptureSchema),
    defaultValues: {
      optInMarketing: true
    }
  })

  const handleFormSubmit = async (data: EmailCaptureData) => {
    try {
      await onSubmit(data)
      setStep('success')
      onSuccess?.(data)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setStep('error')
      onError?.(errorMessage)
    }
  }

  if (step === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn("text-center p-6", className)}
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h3>
        <p className="text-gray-600">
          Your curated piano selection will be delivered to your inbox within 24 hours.
        </p>
      </motion.div>
    )
  }

  if (step === 'error') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn("text-center p-6", className)}
      >
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
        <p className="text-gray-600 mb-4">
          Please try again or contact us directly for assistance.
        </p>
        <button
          onClick={() => setStep('form')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("bg-white rounded-xl shadow-lg p-6", className)}
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          Get Your Curated Selection
        </h3>
        <p className="text-gray-600">
          Receive personalized piano recommendations with exclusive pricing and expert insights.
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            {...register('firstName')}
            type="text"
            id="firstName"
            className={cn(
              "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              errors.firstName ? "border-red-300" : "border-gray-300"
            )}
            placeholder="Your first name"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            className={cn(
              "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              errors.email ? "border-red-300" : "border-gray-300"
            )}
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              {...register('optInMarketing')}
              id="optInMarketing"
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="optInMarketing" className="text-gray-700">
              I'd like to receive exclusive offers and piano insights via email
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200",
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5"
          )}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </div>
          ) : (
            "Send My Curated Selection"
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          ✓ No spam, unsubscribe anytime ✓ Privacy protected
        </p>
      </div>
    </motion.div>
  )
}