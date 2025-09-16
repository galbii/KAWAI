/**
 * Kawai Signature Landing Page Components
 * Core component exports for the signature page
 */

// Core Components
export { default as DualConversion } from './DualConversion'
export { EmailCapture } from './EmailCapture'
export { default as BookingForm } from './BookingForm'
export { default as ExitIntentModal } from './ExitIntentModal'

// Re-export validation utilities
export {
  emailCaptureSchema,
  bookingFormSchema,
  exitIntentSchema,
  leadQualificationSchema,
  conversionDataSchema,
  assessmentResponseSchema,
  contactInfoSchema,
  validateQuestionResponse,
  getValidationErrors
} from '../lib/validation'

// Re-export constants
export { ASSESSMENT_QUESTIONS } from '../lib/constants'