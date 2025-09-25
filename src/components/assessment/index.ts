/**
 * Assessment Components Index
 * Central export point for all assessment-related components
 */

// Main Assessment Component
export { default as InteractiveAssessment } from './InteractiveAssessment'
export type { InteractiveAssessmentProps } from '@/components/pages/signature/types'

// Supporting Components
export { default as QuestionStep } from './QuestionStep'
export { default as AssessmentProgress } from './AssessmentProgress'

// Individual Question Components
export {
  MusicalIdentityQuestion,
  PerformanceAspirationsQuestion,
  AcousticEnvironmentQuestion,
  InvestmentTimelineQuestion,
  AestheticPreferenceQuestion,
  CollectionAccessQuestion
} from './questions'

// Re-export validation utilities
export {
  assessmentResponseSchema,
  questionStepSchema,
  assessmentProgressSchema,
  validateQuestionResponse,
  validateCompleteAssessment,
  getValidationErrors,
  type AssessmentResponseType,
  type QuestionStepType,
  type AssessmentProgressType,
  type FormStateType
} from '@/components/pages/signature/lib/validation'

// Re-export assessment constants
export {
  ASSESSMENT_QUESTIONS,
  ASSESSMENT_CONFIG,
  ASSESSMENT_UI_CONFIG
} from '@/components/pages/signature/lib/constants'