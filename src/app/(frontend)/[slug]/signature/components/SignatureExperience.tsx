'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { InteractiveAssessment } from '@/components/assessment/InteractiveAssessment'
import { DualConversion } from './DualConversion'
import { ExitIntentModal } from './ExitIntentModal'
import { WelcomeScreen } from './WelcomeScreen'
import type { AssessmentResponse } from '../types'
import { ASSESSMENT_QUESTIONS } from '../lib/constants'

interface SignatureExperienceProps {
  slug: string
}

type ExperienceStage = 'welcome' | 'assessment' | 'conversion' | 'complete'

export function SignatureExperience({ slug }: SignatureExperienceProps) {
  const [currentStage, setCurrentStage] = useState<ExperienceStage>('welcome')
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResponse | null>(null)
  const [showExitIntent, setShowExitIntent] = useState(false)

  // Handle welcome screen continuation
  const handleWelcomeContinue = () => {
    setCurrentStage('assessment')
  }

  // Handle assessment completion
  const handleAssessmentComplete = async (results: AssessmentResponse) => {
    setAssessmentResults(results)
    setCurrentStage('conversion')
  }

  // Handle conversion completion
  const handleConversionComplete = (type: 'email' | 'booking', data: any) => {
    console.log(`Conversion completed: ${type}`, data)
    setCurrentStage('complete')
    
    // Track analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        event_category: 'signature_experience',
        event_label: type,
        value: type === 'booking' ? 1000 : 100 // Estimated lead value
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
            <div className="flex items-center justify-center space-x-4 text-sm font-medium">
              <div className={`flex items-center ${currentStage === 'assessment' ? 'text-kawai-red' : 'text-kawai-black/40'}`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2 ${
                  currentStage === 'assessment' ? 'border-kawai-red bg-kawai-red/10' :
                  ['conversion', 'complete'].includes(currentStage) ? 'border-kawai-red bg-kawai-red/10' : 'border-kawai-black/30'
                }`}>
                  {['conversion', 'complete'].includes(currentStage) ? '✓' : '1'}
                </div>
                Application
              </div>

              <div className={`w-16 h-0.5 ${
                ['conversion', 'complete'].includes(currentStage) ? 'bg-kawai-red' : 'bg-kawai-black/30'
              }`} />

              <div className={`flex items-center ${currentStage === 'conversion' ? 'text-kawai-red' : 'text-kawai-black/40'}`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2 ${
                  currentStage === 'conversion' ? 'border-kawai-red bg-kawai-red/10' :
                  currentStage === 'complete' ? 'border-kawai-red bg-kawai-red/10' : 'border-kawai-black/30'
                }`}>
                  {currentStage === 'complete' ? '✓' : '2'}
                </div>
                Your Offer
              </div>

              <div className={`w-16 h-0.5 ${
                currentStage === 'complete' ? 'bg-kawai-red' : 'bg-kawai-black/30'
              }`} />

              <div className={`flex items-center ${currentStage === 'complete' ? 'text-kawai-red' : 'text-kawai-black/40'}`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2 ${
                  currentStage === 'complete' ? 'border-kawai-red bg-kawai-red/10' : 'border-kawai-black/30'
                }`}>
                  {currentStage === 'complete' ? '✓' : '3'}
                </div>
                Confirmation
              </div>
            </div>
          </motion.div>

          {/* Main Experience Stages */}
          <AnimatePresence mode="wait">

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
                  Event Application
                </h2>
                <p className="text-xl text-kawai-black/70 max-w-2xl mx-auto">
                  Our craftsmanship experts will evaluate your responses to determine eligibility for event reservation and special pricing.
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
                estimatedTime={4}
              />
            </motion.div>
          )}

          {/* Conversion Stage */}
          {currentStage === 'conversion' && assessmentResults && (
            <motion.div
              key="conversion"
              variants={stageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={stageTransition}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-light text-kawai-black mb-4">
                  Event Reservation Confirmed
                </h2>
                <p className="text-xl text-kawai-black/70 max-w-2xl mx-auto">
                  You qualify for our exclusive event and special pricing. Choose your preferred event format below.
                </p>
              </div>
              
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
                  Event Registration Complete
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Your exclusive event registration is confirmed. Expect your formal event details and craftsmanship expert appointment within 24 hours.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div className="p-6">
                    <div className="text-3xl mb-3">🏆</div>
                    <h3 className="font-semibold mb-2">Event Credentials</h3>
                    <p className="text-gray-600">Your exclusive event access and heritage collection preview within 24 hours</p>
                  </div>
                  <div className="p-6">
                    <div className="text-3xl mb-3">👨‍🎨</div>
                    <h3 className="font-semibold mb-2">Craftsmanship Expert</h3>
                    <p className="text-gray-600">Personal consultation with our certified craftsmanship specialists</p>
                  </div>
                  <div className="p-6">
                    <div className="text-3xl mb-3">💎</div>
                    <h3 className="font-semibold mb-2">Exclusive Event Access</h3>
                    <p className="text-gray-600">Private event viewing of instruments worthy of your discerning standards</p>
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