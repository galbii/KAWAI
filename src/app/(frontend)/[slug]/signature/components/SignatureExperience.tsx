'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { InteractiveAssessment } from '@/components/assessment/InteractiveAssessment'
import { PianoRecommendation } from './PianoRecommendation'
import { DualConversion } from './DualConversion'
import { ExitIntentModal } from './ExitIntentModal'
import type { AssessmentResponse } from '../types'
import { ASSESSMENT_QUESTIONS } from '../lib/constants'

// Custom PianoRecommendation interface for SignatureExperience
interface PianoRec {
  id: string
  name: string
  model: string
  series: string
  category: 'grand' | 'upright' | 'digital' | 'hybrid'
  image: string
  priceRange: string
  matchScore: number
  keyFeatures: string[]
  whyRecommended: string
  specifications: {
    length: string
    width: string
    weight: string
    finish: string
    warranty: string
  }
  availableFinishes: string[]
  inStock: boolean
  consultationRecommended: boolean
}

interface SignatureExperienceProps {
  slug: string
}

type ExperienceStage = 'assessment' | 'recommendation' | 'conversion' | 'complete'

export function SignatureExperience({ slug }: SignatureExperienceProps) {
  const [currentStage, setCurrentStage] = useState<ExperienceStage>('assessment')
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResponse | null>(null)
  const [recommendations, setRecommendations] = useState<PianoRec[] | null>(null)
  const [showExitIntent, setShowExitIntent] = useState(false)

  // Handle assessment completion
  const handleAssessmentComplete = async (results: AssessmentResponse) => {
    setAssessmentResults(results)
    
    // Process recommendations (this would typically call your matching API)
    const mockRecommendations: PianoRec[] = [
      {
        id: 'kawai-sk-ex',
        name: 'Kawai SK-EX Concert Grand',
        model: 'SK-EX',
        series: 'Shigeru Kawai',
        category: 'grand',
        image: '/images/signature/sk-ex-hero.webp',
        priceRange: '$180,000 - $220,000',
        matchScore: 95,
        keyFeatures: [
          'Concert-level touch and tone',
          'Handcrafted by Master Piano Artisans',
          'Extended dynamic range',
          'Premium Neotex key surface'
        ],
        whyRecommended: `Based on your professional aspirations and preference for serious practice, the SK-EX delivers the nuanced touch and tonal complexity that advanced musicians demand. Its concert-grand projection perfectly suits your great room environment.`,
        specifications: {
          length: `9'1" (277 cm)`,
          width: `5'1" (155 cm)`,
          weight: '880 lbs (399 kg)',
          finish: 'Polished Ebony',
          warranty: '10 Year Full Warranty'
        },
        availableFinishes: ['Polished Ebony', 'Satin Mahogany'],
        inStock: true,
        consultationRecommended: true
      },
      {
        id: 'kawai-ca901',
        name: 'Kawai CA901 Hybrid',
        model: 'CA901',
        series: 'Concert Artist',
        category: 'hybrid',
        image: '/images/signature/ca901-hero.webp',
        priceRange: '$12,000 - $15,000',
        matchScore: 88,
        keyFeatures: [
          'Grand Feel III action',
          'SK-EX concert grand sampling',
          'Soundboard speaker system',
          'Advanced connectivity'
        ],
        whyRecommended: `Your interest in both practice and entertaining makes this hybrid perfect. The Grand Feel III wooden-key action provides authentic touch, while advanced features support both serious study and family music-making.`,
        specifications: {
          length: `57" (145 cm)`,
          width: `19" (48 cm)`,
          weight: '275 lbs (125 kg)',
          finish: 'Satin Black',
          warranty: '3 Year Full Warranty'
        },
        availableFinishes: ['Satin Black', 'Satin White'],
        inStock: true,
        consultationRecommended: false
      }
    ]
    
    setRecommendations(mockRecommendations)
    setCurrentStage('recommendation')
  }

  // Handle recommendation selection
  const handleRecommendationSelect = (recommendation: PianoRec) => {
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
    <section id="signature-experience" className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container mx-auto px-4 py-16">
        
        {/* Progress Indicator */}
        <motion.div 
          className="max-w-4xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-center space-x-8 text-sm font-medium">
            <div className={`flex items-center ${currentStage === 'assessment' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2 ${
                currentStage === 'assessment' ? 'border-blue-600 bg-blue-50' : 
                ['recommendation', 'conversion', 'complete'].includes(currentStage) ? 'border-green-500 bg-green-50' : 'border-gray-300'
              }`}>
                {['recommendation', 'conversion', 'complete'].includes(currentStage) ? '✓' : '1'}
              </div>
              Discovery
            </div>
            
            <div className={`w-16 h-0.5 ${
              ['recommendation', 'conversion', 'complete'].includes(currentStage) ? 'bg-green-500' : 'bg-gray-300'
            }`} />
            
            <div className={`flex items-center ${currentStage === 'recommendation' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2 ${
                currentStage === 'recommendation' ? 'border-blue-600 bg-blue-50' : 
                ['conversion', 'complete'].includes(currentStage) ? 'border-green-500 bg-green-50' : 'border-gray-300'
              }`}>
                {['conversion', 'complete'].includes(currentStage) ? '✓' : '2'}
              </div>
              Recommendation
            </div>
            
            <div className={`w-16 h-0.5 ${
              ['conversion', 'complete'].includes(currentStage) ? 'bg-green-500' : 'bg-gray-300'
            }`} />
            
            <div className={`flex items-center ${currentStage === 'conversion' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2 ${
                currentStage === 'conversion' ? 'border-blue-600 bg-blue-50' : 
                currentStage === 'complete' ? 'border-green-500 bg-green-50' : 'border-gray-300'
              }`}>
                {currentStage === 'complete' ? '✓' : '3'}
              </div>
              Connection
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
                <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
                  Your Musical Journey Begins
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Let us understand your musical aspirations to curate the perfect piano experience for you.
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

          {/* Recommendation Stage */}
          {currentStage === 'recommendation' && recommendations && (
            <motion.div
              key="recommendation"
              variants={stageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={stageTransition}
              className="max-w-6xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
                  Your Perfect Match
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Based on your responses, we've curated these exceptional instruments for your consideration.
                </p>
              </div>
              
              <PianoRecommendation
                recommendations={recommendations}
                assessmentResults={assessmentResults!}
                onSelect={handleRecommendationSelect}
                showComparison={recommendations.length > 1}
              />
            </motion.div>
          )}

          {/* Conversion Stage */}
          {currentStage === 'conversion' && recommendations && (
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
                <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
                  Take the Next Step
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Choose how you'd like to continue your piano selection journey.
                </p>
              </div>
              
              <DualConversion
                recommendations={recommendations}
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
                  Thank You
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Your piano journey continues. We'll be in touch soon with your personalized recommendations and next steps.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div className="p-6">
                    <div className="text-3xl mb-3">📧</div>
                    <h3 className="font-semibold mb-2">What's Next</h3>
                    <p className="text-gray-600">Personalized recommendations and exclusive offers in your inbox within 24 hours</p>
                  </div>
                  <div className="p-6">
                    <div className="text-3xl mb-3">📞</div>
                    <h3 className="font-semibold mb-2">Expert Consultation</h3>
                    <p className="text-gray-600">Our piano specialists will contact you to schedule your private viewing</p>
                  </div>
                  <div className="p-6">
                    <div className="text-3xl mb-3">🎹</div>
                    <h3 className="font-semibold mb-2">Your Perfect Piano</h3>
                    <p className="text-gray-600">Experience your recommended instruments in our exclusive showroom</p>
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
    </section>
  )
}