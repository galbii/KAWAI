'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { InteractiveAssessment } from '@/components/assessment/InteractiveAssessment'
import { EmailContinuationForm } from './EmailContinuationForm'
import { DualConversion } from './DualConversion'
import { ExitIntentModal } from './ExitIntentModal'
import { WelcomeScreen } from './WelcomeScreen'
import type { AssessmentResponse } from '../types'
import { ASSESSMENT_QUESTIONS } from '../lib/constants'

interface SignatureExperienceProps {
  slug: string
}

type ExperienceStage = 'welcome' | 'email' | 'assessment' | 'conversion' | 'complete'

export function SignatureExperience({ slug }: SignatureExperienceProps) {
  const [currentStage, setCurrentStage] = useState<ExperienceStage>('welcome')
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResponse | null>(null)
  const [emailData, setEmailData] = useState<any>(null)
  const [showExitIntent, setShowExitIntent] = useState(false)

  // Handle welcome screen continuation
  const handleWelcomeContinue = () => {
    setCurrentStage('email')
  }

  // Handle email form completion
  const handleEmailComplete = (type: 'email', data: any) => {
    console.log('Email form completed:', data)
    setEmailData(data)
    setCurrentStage('assessment')
  }

  // Handle assessment completion
  const handleAssessmentComplete = async (results: AssessmentResponse) => {
    console.log('Assessment completed:', results)
    setAssessmentResults(results)
    setCurrentStage('conversion')
    console.log('Stage set to conversion')
  }

  // Handle dual conversion completion
  const handleConversionComplete = (type: 'email' | 'booking', data: any) => {
    console.log(`Conversion completed: ${type}`, data)
    console.log('Render check - currentStage:', currentStage, 'assessmentResults:', assessmentResults)
    setCurrentStage('complete')

    // Track analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion_completed', {
        event_category: 'signature_experience',
        event_label: type,
        value: type === 'booking' ? 1000 : 500
      })
    }
  }

  // Stage transition animations
  const stageVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 }
  }

  const stageTransition = {
    type: "spring" as const,
    stiffness: 100,
    damping: 20,
    duration: 0.6
  }

  return (
    <section id="signature-experience" className="min-h-screen bg-stone-50">
      {/* Conditional container - full width for welcome, contained for other stages */}
      {currentStage === 'welcome' ? (
        <AnimatePresence mode="wait">
          <motion.div
            key="welcome"
            variants={stageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={stageTransition}
            className="min-h-screen"
          >
            <WelcomeScreen onContinue={handleWelcomeContinue} />
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="container mx-auto px-4 py-16">
          {/* Progress Indicator */}
          <motion.div
            className="max-w-4xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-center space-x-3 text-sm font-medium">
              {/* Email Stage */}
              <div className={`flex items-center ${currentStage === 'email' ? 'text-kawai-red' : 'text-kawai-black/40'}`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2 ${
                  currentStage === 'email' ? 'border-kawai-red bg-kawai-red/10' :
                  ['assessment', 'conversion', 'complete'].includes(currentStage) ? 'border-kawai-red bg-kawai-red/10' : 'border-kawai-black/30'
                }`}>
                  {['assessment', 'conversion', 'complete'].includes(currentStage) ? '✓' : '1'}
                </div>
                Email
              </div>

              <div className={`w-12 h-0.5 ${
                ['assessment', 'conversion', 'complete'].includes(currentStage) ? 'bg-kawai-red' : 'bg-kawai-black/30'
              }`} />

              {/* Assessment Stage */}
              <div className={`flex items-center ${currentStage === 'assessment' ? 'text-kawai-red' : 'text-kawai-black/40'}`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2 ${
                  currentStage === 'assessment' ? 'border-kawai-red bg-kawai-red/10' :
                  ['conversion', 'complete'].includes(currentStage) ? 'border-kawai-red bg-kawai-red/10' : 'border-kawai-black/30'
                }`}>
                  {['conversion', 'complete'].includes(currentStage) ? '✓' : '2'}
                </div>
                Assessment
              </div>

              <div className={`w-12 h-0.5 ${
                ['conversion', 'complete'].includes(currentStage) ? 'bg-kawai-red' : 'bg-kawai-black/30'
              }`} />

              {/* Conversion Stage */}
              <div className={`flex items-center ${currentStage === 'conversion' ? 'text-kawai-red' : 'text-kawai-black/40'}`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2 ${
                  currentStage === 'conversion' ? 'border-kawai-red bg-kawai-red/10' :
                  currentStage === 'complete' ? 'border-kawai-red bg-kawai-red/10' : 'border-kawai-black/30'
                }`}>
                  {currentStage === 'complete' ? '✓' : '3'}
                </div>
                Choose Path
              </div>

              <div className={`w-12 h-0.5 ${
                currentStage === 'complete' ? 'bg-kawai-red' : 'bg-kawai-black/30'
              }`} />

              {/* Complete Stage */}
              <div className={`flex items-center ${currentStage === 'complete' ? 'text-kawai-red' : 'text-kawai-black/40'}`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2 ${
                  currentStage === 'complete' ? 'border-kawai-red bg-kawai-red/10' : 'border-kawai-black/30'
                }`}>
                  {currentStage === 'complete' ? '✓' : '4'}
                </div>
                Complete
              </div>
            </div>
          </motion.div>

          {/* Main Experience Stages */}
          <AnimatePresence mode="wait">

          {/* Email Form Stage */}
          {currentStage === 'email' && (
            <motion.div
              key="email"
              variants={stageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={stageTransition}
              className="max-w-4xl mx-auto"
            >
              <EmailContinuationForm
                onComplete={handleEmailComplete}
                location={slug}
                onBack={() => setCurrentStage('welcome')}
              />
            </motion.div>
          )}

          {/* Assessment Stage */}
          {currentStage === 'assessment' && (
            <motion.div
              key="assessment"
              variants={stageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={stageTransition}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-light font-serif text-kawai-black mb-4">
                  Musical Journey Assessment
                </h2>
                <p className="text-xl text-kawai-black/70 max-w-2xl mx-auto">
                  Help us understand your musical journey to provide the best recommendations for your signature piano experience.
                </p>
              </div>

              <InteractiveAssessment
                questions={ASSESSMENT_QUESTIONS}
                onComplete={handleAssessmentComplete}
                onProgress={(currentStep, totalSteps) => {
                  // Track progress for analytics
                  console.log('Assessment progress:', currentStep, 'of', totalSteps)
                }}
                allowBack={true}
                saveProgress={true}
                progressIndicator={true}
                estimatedTime={3}
              />
            </motion.div>
          )}

          {/* Dual Conversion Stage */}
          {currentStage === 'conversion' && assessmentResults && (
            <motion.div
              key="dual-conversion"
              variants={stageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={stageTransition}
              className="max-w-4xl mx-auto"
            >
              <DualConversion
                assessmentResults={assessmentResults!}
                onComplete={handleConversionComplete}
                location={slug}
              />
            </motion.div>
          )}

          {/* Completion Stage */}
          {currentStage === 'complete' && (
            <motion.div
              key="complete"
              variants={stageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={stageTransition}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="bg-white rounded-2xl shadow-xl p-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h2 className="text-4xl font-light text-gray-900 mb-4">
                  Signature Experience Complete
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Thank you for completing our signature piano experience. Your request has been submitted and you'll receive follow-up information soon.
                </p>

                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div className="p-6">
                    <div className="text-3xl mb-3">📧</div>
                    <h3 className="font-semibold mb-2">Follow-up Details</h3>
                    <p className="text-gray-600">Personalized information based on your selections</p>
                  </div>
                  <div className="p-6">
                    <div className="text-3xl mb-3">🎹</div>
                    <h3 className="font-semibold mb-2">Signature Collection</h3>
                    <p className="text-gray-600">Access to our heritage piano collection</p>
                  </div>
                  <div className="p-6">
                    <div className="text-3xl mb-3">👨‍🎨</div>
                    <h3 className="font-semibold mb-2">Expert Guidance</h3>
                    <p className="text-gray-600">Consultation from certified piano specialists</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          </AnimatePresence>

          {/* Exit Intent Modal */}
          <ExitIntentModal
            isOpen={showExitIntent}
            onClose={() => setShowExitIntent(false)}
            onCapture={(data) => {
              console.log('Exit intent capture:', data)
              setShowExitIntent(false)
            }}
          />
        </div>
      )}
    </section>
  )
}