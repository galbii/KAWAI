'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// Import components and utilities
import { AssessmentProgress } from './AssessmentProgress'
import {
  MusicalIdentityQuestion,
  PerformanceAspirationsQuestion,
  AcousticEnvironmentQuestion,
  InvestmentTimelineQuestion,
  AestheticPreferenceQuestion,
  CollectionAccessQuestion,
  InvestmentRangeQuestion,
  ExclusiveAccessQuestion
} from './questions'

// Import types and validation
import type {
  AssessmentResponse,
  InteractiveAssessmentProps,
  AssessmentQuestion
} from '@/app/(frontend)/[slug]/signature/types'
import {
  assessmentResponseSchema,
  validateQuestionResponse,
  type FormStateType,
  defaultFormState
} from '@/app/(frontend)/[slug]/signature/lib/validation'
import { ASSESSMENT_QUESTIONS, ASSESSMENT_CONFIG } from '@/app/(frontend)/[slug]/signature/lib/constants'

/**
 * Question component mapping for dynamic rendering
 */
const QUESTION_COMPONENTS = {
  musicalIdentity: MusicalIdentityQuestion,
  performanceAspirations: PerformanceAspirationsQuestion,
  acousticEnvironment: AcousticEnvironmentQuestion,
  investmentTimeline: InvestmentTimelineQuestion,
  aestheticPreference: AestheticPreferenceQuestion,
  collectionAccessLevel: CollectionAccessQuestion,
  investmentRange: InvestmentRangeQuestion,
  exclusiveAccess: ExclusiveAccessQuestion
} as const

/**
 * Main Interactive Assessment Component
 * Orchestrates the complete assessment flow with React Hook Form and smooth animations
 */
export const InteractiveAssessment: React.FC<InteractiveAssessmentProps> = ({
  questions = ASSESSMENT_QUESTIONS,
  onComplete,
  onProgress,
  allowBack = true,
  saveProgress = true,
  sessionId = `assessment_${Date.now()}`,
  customStyling,
  progressIndicator = true,
  estimatedTime = ASSESSMENT_CONFIG.estimatedTimeMinutes,
  className
}) => {
  // Form state management
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startTime] = useState(new Date())
  const [errors, setErrors] = useState<Record<string, string>>({})

  // React Hook Form setup with Zod validation
  const form = useForm<Partial<AssessmentResponse>>({
    resolver: zodResolver(assessmentResponseSchema.partial()),
    mode: 'onChange',
    defaultValues: {}
  })

  const { control, handleSubmit, watch, setValue, trigger, getValues } = form
  const watchedValues = watch()

  // Current question and component
  const currentQuestion = questions[currentQuestionIndex]
  const CurrentQuestionComponent = currentQuestion ? 
    QUESTION_COMPONENTS[currentQuestion.id as keyof typeof QUESTION_COMPONENTS] : null

  // Current question value
  const currentValue = watchedValues[currentQuestion?.id as keyof AssessmentResponse] as string | undefined

  // Validation state for current question
  const isCurrentQuestionValid = useMemo(() => {
    if (!currentQuestion || !currentValue) return false
    return validateQuestionResponse(currentQuestion.id, currentValue)
  }, [currentQuestion, currentValue])

  // Navigation state
  const canGoBack = allowBack && currentQuestionIndex > 0
  const canGoNext = isCurrentQuestionValid || ASSESSMENT_CONFIG.allowSkipQuestions
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  // Progress calculations
  const completionPercentage = Math.round(((currentQuestionIndex + 1) / questions.length) * 100)
  const estimatedTimeRemaining = estimatedTime * (1 - (currentQuestionIndex + 1) / questions.length)

  // Progress callback
  useEffect(() => {
    onProgress?.(currentQuestionIndex + 1, questions.length)
  }, [currentQuestionIndex, questions.length, onProgress])

  // Auto-save progress
  useEffect(() => {
    if (saveProgress && Object.keys(watchedValues).length > 0) {
      const saveData = {
        sessionId,
        currentStep: currentQuestionIndex,
        responses: watchedValues,
        timestamp: new Date(),
        completionPercentage
      }
      
      // Save to localStorage
      try {
        localStorage.setItem(`assessment_${sessionId}`, JSON.stringify(saveData))
      } catch (error) {
        console.warn('Failed to save assessment progress:', error)
      }
    }
  }, [watchedValues, currentQuestionIndex, saveProgress, sessionId, completionPercentage])

  // Load saved progress on mount
  useEffect(() => {
    if (saveProgress) {
      try {
        const savedData = localStorage.getItem(`assessment_${sessionId}`)
        if (savedData) {
          const parsed = JSON.parse(savedData)
          if (parsed.responses) {
            Object.entries(parsed.responses).forEach(([key, value]) => {
              setValue(key as keyof AssessmentResponse, value as any)
            })
          }
          if (typeof parsed.currentStep === 'number') {
            setCurrentQuestionIndex(parsed.currentStep)
          }
          const completed = Array.from({ length: parsed.currentStep }, (_, i) => i + 1)
          setCompletedSteps(completed)
        }
      } catch (error) {
        console.warn('Failed to load saved assessment progress:', error)
      }
    }
  }, [sessionId, saveProgress, setValue])

  // Handle question change
  const handleQuestionChange = useCallback((value: string) => {
    if (!currentQuestion) return
    
    setValue(currentQuestion.id as keyof AssessmentResponse, value as any)
    trigger(currentQuestion.id as keyof AssessmentResponse)
    
    // Clear any existing errors for this question
    if (errors[currentQuestion.id]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[currentQuestion.id]
        return newErrors
      })
    }
  }, [currentQuestion, setValue, trigger, errors])

  // Handle next question
  const handleNext = useCallback(async () => {
    if (!currentQuestion) return

    // Validate current question
    const isValid = await trigger(currentQuestion.id as keyof AssessmentResponse)
    
    if (!isValid && !ASSESSMENT_CONFIG.allowSkipQuestions) {
      setErrors(prev => ({
        ...prev,
        [currentQuestion.id]: 'Please select an option to continue'
      }))
      return
    }

    // Mark step as completed
    if (isCurrentQuestionValid) {
      setCompletedSteps(prev => {
        const newCompleted = [...prev]
        if (!newCompleted.includes(currentQuestionIndex + 1)) {
          newCompleted.push(currentQuestionIndex + 1)
        }
        return newCompleted
      })
    }

    // Move to next question or submit
    if (isLastQuestion) {
      await handleAssessmentSubmit()
    } else {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }, [currentQuestion, currentQuestionIndex, isLastQuestion, isCurrentQuestionValid, trigger])

  // Handle previous question
  const handleBack = useCallback(() => {
    if (canGoBack) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }, [canGoBack])

  // Handle final assessment submission
  const handleAssessmentSubmit = useCallback(async () => {
    setIsSubmitting(true)
    
    try {
      const values = getValues()
      
      // Validate complete assessment
      const validatedResponse = assessmentResponseSchema.parse({
        ...values,
        timestamp: new Date(),
        sessionId
      })

      // Call completion callback
      await onComplete(validatedResponse)

      // Clear saved progress
      if (saveProgress) {
        try {
          localStorage.removeItem(`assessment_${sessionId}`)
        } catch (error) {
          console.warn('Failed to clear saved progress:', error)
        }
      }

    } catch (error) {
      console.error('Assessment submission failed:', error)
      setErrors({ submit: 'Failed to submit assessment. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }, [getValues, onComplete, sessionId, saveProgress])

  // Custom theme application
  const themeVars = customStyling ? {
    '--primary-color': customStyling.primaryColor,
    '--background-color': customStyling.backgroundColor
  } as React.CSSProperties : {}

  return (
    <div
      className={cn("relative min-h-screen bg-stone-50", className)}
      style={themeVars}
    >
      {/* Progress Indicator */}
      {progressIndicator && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-kawai-black/20 py-4"
        >
          <div className="max-w-4xl mx-auto px-4">
            <AssessmentProgress
              currentStep={currentQuestionIndex + 1}
              totalSteps={questions.length}
              completedSteps={completedSteps}
              variant="dots"
              showPercentage={true}
              showTimeEstimate={true}
              estimatedTimeMinutes={estimatedTimeRemaining}
            />
          </div>
        </motion.div>
      )}

      {/* Main Assessment Content */}
      <div className="relative">
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 md:p-12 mx-4 sm:mx-0">
              <form onSubmit={handleSubmit(handleAssessmentSubmit)} className="w-full">
            <AnimatePresence mode="wait" initial={false}>
              {CurrentQuestionComponent && (
                <motion.div
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }}
                >
                  <Controller
                    name={currentQuestion.id as keyof AssessmentResponse}
                    control={control}
                    render={({ field, fieldState }) => (
                      <CurrentQuestionComponent
                        question={currentQuestion}
                        value={field.value as string}
                        onChange={handleQuestionChange}
                        onNext={handleNext}
                        onBack={handleBack}
                        isValid={isCurrentQuestionValid}
                        showNavigation={true}
                        stepNumber={currentQuestionIndex + 1}
                        totalSteps={questions.length}
                      />
                    )}
                  />
                </motion.div>
              )}
            </AnimatePresence>
              </form>
            </div>
          </div>

            {/* Error Display */}
            <AnimatePresence>
              {Object.keys(errors).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="fixed bottom-4 right-4 z-50"
                >
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm font-medium">
                        {Object.values(errors)[0]}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
        </div>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isSubmitting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <div className="text-center space-y-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-kawai-red/20 border-t-kawai-red rounded-full mx-auto"
                />
                <div>
                  <h3 className="text-lg font-semibold text-kawai-black mb-2">
                    Evaluating Your Application
                  </h3>
                  <p className="text-kawai-black/70">
                    Our master craftsmen are reviewing your qualifications for exclusive access...
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Assessment Metadata (for debugging in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-black/80 text-white text-xs p-2 rounded font-mono">
          <div>Step: {currentQuestionIndex + 1}/{questions.length}</div>
          <div>Valid: {isCurrentQuestionValid ? '✓' : '✗'}</div>
          <div>Progress: {completionPercentage}%</div>
          <div>Session: {sessionId}</div>
        </div>
      )}
    </div>
  )
}

export default InteractiveAssessment