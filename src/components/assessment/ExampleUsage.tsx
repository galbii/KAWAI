/**
 * Example Usage for Interactive Assessment Components
 * Demonstrates integration patterns for the Kawai Signature landing page
 */

'use client'

import React, { useState, useCallback } from 'react'
import { InteractiveAssessment } from './InteractiveAssessment'
import type { 
  AssessmentResponse, 
  RecommendationSet,
  ConversionPath 
} from '@/app/(frontend)/[slug]/signature/types'
import { ASSESSMENT_QUESTIONS } from '@/app/(frontend)/[slug]/signature/lib/constants'

/**
 * Complete Signature Assessment Example
 * Shows full integration with recommendation generation and conversion routing
 */
export const SignatureAssessmentExample: React.FC = () => {
  const [isComplete, setIsComplete] = useState(false)
  const [recommendations, setRecommendations] = useState<RecommendationSet | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Handle assessment completion
  const handleAssessmentComplete = useCallback(async (response: AssessmentResponse) => {
    setLoading(true)
    setError(null)

    try {
      // Example: Send to recommendation API
      const apiResponse = await fetch('/api/signature/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(response)
      })

      if (!apiResponse.ok) {
        throw new Error('Failed to generate recommendations')
      }

      const recommendationData = await apiResponse.json()
      setRecommendations(recommendationData)
      setIsComplete(true)

      // Example: Track analytics event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'signature_assessment_completed', {
          event_category: 'assessment',
          event_label: 'complete',
          custom_parameters: {
            musical_identity: response.musicalIdentity,
            performance_aspirations: response.performanceAspirations,
            timeline: response.investmentTimeline
          }
        })
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [])

  // Handle progress tracking
  const handleProgress = useCallback((currentStep: number, totalSteps: number) => {
    const percentage = (currentStep / totalSteps) * 100
    
    // Example: Track progress analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'signature_assessment_progress', {
        event_category: 'assessment',
        event_label: `step_${currentStep}`,
        value: Math.round(percentage)
      })
    }

    console.log(`Assessment progress: ${currentStep}/${totalSteps} (${Math.round(percentage)}%)`)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Generating your personalized recommendations...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-red-600 text-5xl">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900">Something went wrong</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => {
              setError(null)
              setIsComplete(false)
              setRecommendations(null)
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (isComplete && recommendations) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="mb-8">
            <div className="text-6xl mb-4">🎹</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Your Perfect Piano Awaits!
            </h1>
            <p className="text-xl text-gray-600">
              We've found {recommendations.alternatives.length + 1} pianos that match your preferences perfectly.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Top Recommendation
            </h2>
            <div className="flex items-center justify-center space-x-6">
              <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                🎹
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold">{recommendations.primary.name}</h3>
                <p className="text-gray-600 mb-2">{recommendations.primary.shortDescription}</p>
                <div className="flex items-center space-x-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {recommendations.primary.matchScore}% Match
                  </span>
                  <span className="text-gray-500">{recommendations.primary.category}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-x-4">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Schedule Private Viewing
            </button>
            <button className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              View All Recommendations
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <InteractiveAssessment
      questions={ASSESSMENT_QUESTIONS}
      onComplete={handleAssessmentComplete}
      onProgress={handleProgress}
      allowBack={true}
      saveProgress={true}
      progressIndicator={true}
      estimatedTime={3}
      sessionId={`signature_assessment_${Date.now()}`}
    />
  )
}

/**
 * Simple Assessment Example
 * Minimal integration for basic use cases
 */
export const SimpleAssessmentExample: React.FC = () => {
  const handleComplete = async (response: AssessmentResponse) => {
    console.log('Assessment completed:', response)
    alert('Assessment completed! Check console for results.')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <InteractiveAssessment questions={ASSESSMENT_QUESTIONS} onComplete={handleComplete} />
    </div>
  )
}

/**
 * Custom Styled Assessment Example
 * Shows theming and customization options
 */
export const CustomStyledAssessmentExample: React.FC = () => {
  const handleComplete = async (response: AssessmentResponse) => {
    console.log('Custom assessment completed:', response)
  }

  return (
    <InteractiveAssessment
      questions={ASSESSMENT_QUESTIONS}
      onComplete={handleComplete}
      customStyling={{
        theme: 'dark',
        primaryColor: '#8b5cf6',
        backgroundColor: '#1f2937'
      }}
      className="bg-gray-900"
    />
  )
}

/**
 * Assessment with Analytics Example
 * Demonstrates comprehensive tracking integration
 */
export const AnalyticsAssessmentExample: React.FC = () => {
  const [startTime] = useState(Date.now())

  const handleComplete = async (response: AssessmentResponse) => {
    const completionTime = Date.now() - startTime
    
    // Example: PostHog analytics
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('signature_assessment_completed', {
        completion_time_ms: completionTime,
        musical_identity: response.musicalIdentity,
        performance_aspirations: response.performanceAspirations,
        acoustic_environment: response.acousticEnvironment,
        investment_timeline: response.investmentTimeline,
        aesthetic_preference: response.aestheticPreference,
        collection_access_level: response.collectionAccessLevel,
        session_id: response.sessionId
      })
    }

    console.log(`Assessment completed in ${completionTime}ms`, response)
  }

  const handleProgress = (step: number, total: number) => {
    // Track step progression
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('signature_assessment_step', {
        step_number: step,
        total_steps: total,
        completion_percentage: (step / total) * 100
      })
    }
  }

  return (
    <InteractiveAssessment
      questions={ASSESSMENT_QUESTIONS}
      onComplete={handleComplete}
      onProgress={handleProgress}
    />
  )
}

/**
 * Embedded Assessment Example
 * Shows integration within existing page layouts
 */
export const EmbeddedAssessmentExample: React.FC = () => {
  const [showAssessment, setShowAssessment] = useState(false)
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResponse | null>(null)

  const handleComplete = async (response: AssessmentResponse) => {
    setAssessmentResults(response)
    setShowAssessment(false)
  }

  if (showAssessment) {
    return (
      <InteractiveAssessment
        questions={ASSESSMENT_QUESTIONS}
        onComplete={handleComplete}
        className="fixed inset-0 z-50"
      />
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Existing page content */}
      <div className="py-20 text-center">
        <h1 className="text-4xl font-bold mb-8">Find Your Perfect Piano</h1>
        
        {assessmentResults ? (
          <div className="max-w-md mx-auto p-6 bg-green-50 rounded-lg border border-green-200">
            <div className="text-green-600 text-2xl mb-4">✓</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Assessment Complete!
            </h3>
            <p className="text-gray-600 mb-4">
              We found the perfect match for your {assessmentResults.musicalIdentity} journey.
            </p>
            <button
              onClick={() => setAssessmentResults(null)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              View Recommendations
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAssessment(true)}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
          >
            Start Piano Assessment
          </button>
        )}
      </div>
    </div>
  )
}

// Export all examples
export default {
  SignatureAssessmentExample,
  SimpleAssessmentExample,
  CustomStyledAssessmentExample,
  AnalyticsAssessmentExample,
  EmbeddedAssessmentExample
}