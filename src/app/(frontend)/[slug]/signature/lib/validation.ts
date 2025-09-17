import { z } from 'zod'
import type {
  MusicalIdentity,
  PerformanceAspirations,
  AcousticEnvironment,
  InvestmentTimeline,
  AestheticPreference,
  CollectionAccessLevel,
  AssessmentResponse
} from '../types'

/**
 * Zod validation schemas for interactive assessment form
 * Provides runtime validation and type safety for all assessment questions
 */

// Individual question validation schemas
export const musicalIdentitySchema = z.enum([
  'beginning',
  'returning', 
  'active',
  'professional',
  'family-legacy'
] as const)

export const performanceAspirationsSchema = z.enum([
  'family-gatherings',
  'serious-practice',
  'entertaining',
  'recording', 
  'teaching'
] as const)

export const acousticEnvironmentSchema = z.enum([
  'cozy-living',
  'open-great-room',
  'dedicated-music',
  'formal-entertaining',
  'multiple-spaces'
] as const)

export const investmentTimelineSchema = z.enum([
  'ready-30-days',
  'exploring-2-6-months',
  'planning-this-year',
  'beginning-research'
] as const)

export const aestheticPreferenceSchema = z.enum([
  'classic-ebony',
  'rich-mahogany',
  'contemporary-white',
  'experience-differences'
] as const)

export const collectionAccessLevelSchema = z.enum([
  'curated-recommendations',
  'private-viewing',
  'both'
] as const)

export const investmentRangeSchema = z.enum([
  'premium-25k',
  'luxury-50k',
  'signature-75k',
  'bespoke-100k',
  'consultation-required'
] as const)

export const exclusiveAccessSchema = z.enum([
  'highly-interested',
  'interested',
  'somewhat-interested',
  'prefer-standard'
] as const)

/**
 * Complete Assessment Response Schema
 * Validates all 7 questions together with optional metadata
 */
export const assessmentResponseSchema = z.object({
  musicalIdentity: musicalIdentitySchema,
  performanceAspirations: performanceAspirationsSchema.optional(),
  acousticEnvironment: acousticEnvironmentSchema.optional(),
  investmentTimeline: investmentTimelineSchema,
  aestheticPreference: aestheticPreferenceSchema.optional(),
  collectionAccessLevel: collectionAccessLevelSchema.optional(),
  investmentRange: investmentRangeSchema.optional(),
  exclusiveAccess: exclusiveAccessSchema.optional(),
  timestamp: z.date().optional(),
  sessionId: z.string().optional()
})

/**
 * Individual Question Step Schema
 * For validating single question responses during form progression
 */
export const questionStepSchema = z.object({
  questionId: z.enum([
    'musicalIdentity',
    'performanceAspirations',
    'acousticEnvironment',
    'investmentTimeline',
    'aestheticPreference',
    'collectionAccessLevel',
    'investmentRange',
    'exclusiveAccess'
  ]),
  value: z.string().min(1, 'Please select an option'),
  isValid: z.boolean().optional()
})

/**
 * Assessment Progress Schema
 * For tracking form completion state
 */
export const assessmentProgressSchema = z.object({
  currentStep: z.number().min(0),
  totalSteps: z.number().min(1),
  completedSteps: z.array(z.number()),
  responses: z.record(z.string(), z.string().min(1)).optional(),
  isComplete: z.boolean().optional(),
  lastUpdated: z.date().optional()
})

/**
 * Contact Information Schema
 * For lead capture during conversion
 */
export const contactInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  zipCode: z.string().optional(),
  preferredContact: z.enum(['email', 'phone', 'text']).default('email'),
  optInMarketing: z.boolean().default(false),
  source: z.string().optional(),
  utmParameters: z.record(z.string(), z.string()).optional()
})

/**
 * Form State Schema
 * For managing overall assessment form state
 */
export const formStateSchema = z.object({
  currentQuestionIndex: z.number().min(0).max(6),
  responses: assessmentResponseSchema.partial(),
  isValid: z.boolean(),
  canProceed: z.boolean(),
  canGoBack: z.boolean(),
  completionPercentage: z.number().min(0).max(100),
  estimatedTimeRemaining: z.number().optional(),
  sessionId: z.string().optional(),
  startTime: z.date().optional(),
  lastActivity: z.date().optional()
})

// Type inference helpers
export type MusicalIdentityType = z.infer<typeof musicalIdentitySchema>
export type PerformanceAspirationsType = z.infer<typeof performanceAspirationsSchema>
export type AcousticEnvironmentType = z.infer<typeof acousticEnvironmentSchema>
export type InvestmentTimelineType = z.infer<typeof investmentTimelineSchema>
export type AestheticPreferenceType = z.infer<typeof aestheticPreferenceSchema>
export type CollectionAccessLevelType = z.infer<typeof collectionAccessLevelSchema>
export type AssessmentResponseType = z.infer<typeof assessmentResponseSchema>
export type QuestionStepType = z.infer<typeof questionStepSchema>
export type AssessmentProgressType = z.infer<typeof assessmentProgressSchema>
export type ContactInfoType = z.infer<typeof contactInfoSchema>
export type FormStateType = z.infer<typeof formStateSchema>

/**
 * Validation helper functions
 */
export const validateQuestionResponse = (questionId: string, value: string): boolean => {
  try {
    switch (questionId) {
      case 'musicalIdentity':
        musicalIdentitySchema.parse(value)
        return true
      case 'performanceAspirations':
        performanceAspirationsSchema.parse(value)
        return true
      case 'acousticEnvironment':
        acousticEnvironmentSchema.parse(value)
        return true
      case 'investmentTimeline':
        investmentTimelineSchema.parse(value)
        return true
      case 'aestheticPreference':
        aestheticPreferenceSchema.parse(value)
        return true
      case 'collectionAccessLevel':
        collectionAccessLevelSchema.parse(value)
        return true
      case 'investmentRange':
        investmentRangeSchema.parse(value)
        return true
      case 'exclusiveAccess':
        exclusiveAccessSchema.parse(value)
        return true
      default:
        return false
    }
  } catch {
    return false
  }
}

export const validateCompleteAssessment = (responses: Partial<AssessmentResponse>): boolean => {
  try {
    assessmentResponseSchema.parse(responses)
    return true
  } catch {
    return false
  }
}

export const getValidationErrors = (responses: Partial<AssessmentResponse>): Record<string, string> => {
  const errors: Record<string, string> = {}
  
  try {
    assessmentResponseSchema.parse(responses)
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.issues.forEach((err) => {
        const field = err.path[0] as string
        errors[field] = err.message
      })
    }
  }
  
  return errors
}

/**
 * Enhanced Conversion Form Validation Schemas
 * Comprehensive validation for all conversion path forms
 */

/**
 * Email Capture Form Schema
 */
const emailCaptureSchema = z.object({
  email: z.string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address')
    .max(254, 'Email address is too long'),
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name is too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name contains invalid characters'),
  interests: z.array(z.string()).optional(),
  urgency: z.enum(['immediate', 'soon', 'exploring']).optional(),
  optInMarketing: z.boolean().optional(),
  source: z.string().optional(),
  utmParameters: z.record(z.string(), z.string()).optional()
})

/**
 * Booking Form Schema - Multi-step appointment booking
 */
const bookingFormSchema = z.object({
  // Contact Information
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name is too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name contains invalid characters'),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name is too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name contains invalid characters'),
  email: z.string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address')
    .max(254, 'Email address is too long'),
  phone: z.string()
    .min(10, 'Please enter a valid phone number')
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number'),
  
  // Appointment Details
  appointmentType: z.string().min(1, 'Please select an appointment type'),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  specificTimeSlot: z.string().optional(),
  
  // Additional Information
  pianoInterest: z.array(z.string()).optional(),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced', 'professional']).optional(),
  specialRequests: z.string().max(500, 'Special requests must be less than 500 characters').optional(),
  budgetRange: z.string().optional(),
  timelineUrgency: z.enum(['immediate', 'soon', 'exploring']).optional(),
  groupSize: z.number().min(1, 'Group size must be at least 1').max(10, 'Group size cannot exceed 10').optional(),
  accessibilityNeeds: z.string().max(300, 'Accessibility needs must be less than 300 characters').optional(),
  hearAboutUs: z.string().optional(),
  optInMarketing: z.boolean().optional()
})

/**
 * Exit Intent Modal Schema
 */
const exitIntentSchema = z.object({
  email: z.string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address')
    .max(254, 'Email address is too long'),
  interests: z.array(z.string()).optional(),
  reason: z.string().max(200, 'Reason must be less than 200 characters').optional(),
  urgency: z.enum(['immediate', 'soon', 'exploring']).optional(),
  source: z.string().default('exit-intent-modal')
})

/**
 * Lead Qualification Schema
 */
const leadQualificationSchema = z.object({
  quality: z.enum(['hot', 'warm', 'nurture', 'cold']),
  score: z.number().min(0).max(100),
  readinessScore: z.number().min(0).max(100),
  budgetQualified: z.boolean(),
  timelineQualified: z.boolean(),
  engagementLevel: z.enum(['low', 'medium', 'high']),
  preferredContact: z.enum(['email', 'phone', 'text']),
  followUpPriority: z.number().min(1).max(5),
  assignedConsultant: z.string().optional(),
  notes: z.array(z.string()).optional()
})

/**
 * Comprehensive Conversion Data Schema
 */
const conversionDataSchema = z.object({
  sessionId: z.string(),
  assessmentResponse: assessmentResponseSchema,
  contactInformation: contactInfoSchema,
  leadQualification: leadQualificationSchema,
  selectedPath: z.enum(['digital', 'showroom', 'hybrid']),
  completedActions: z.array(z.string()),
  engagementMetrics: z.object({
    timeSpent: z.number().min(0),
    pagesVisited: z.number().min(1),
    deviceType: z.enum(['desktop', 'mobile', 'tablet']),
    sourceChannel: z.string().optional(),
    utmParameters: z.record(z.string(), z.string()).optional()
  }),
  timestamp: z.date().default(() => new Date())
})

/**
 * Form Field Validation Helpers
 */

/**
 * Validate email format with advanced checks
 */
export const validateEmail = (email: string): { valid: boolean; error?: string } => {
  if (!email) return { valid: false, error: 'Email is required' }
  
  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address' }
  }
  
  // Length check
  if (email.length > 254) {
    return { valid: false, error: 'Email address is too long' }
  }
  
  // Common typo check
  const commonTypos = [
    'gmai.com', 'gmial.com', 'gmaail.com',
    'outlok.com', 'outloo.com', 'hotmial.com'
  ]
  
  const domain = email.split('@')[1]
  if (commonTypos.includes(domain)) {
    return { valid: false, error: 'Please check your email address for typos' }
  }
  
  return { valid: true }
}

/**
 * Validate phone number with international support
 */
export const validatePhone = (phone: string): { valid: boolean; error?: string; formatted?: string } => {
  if (!phone) return { valid: false, error: 'Phone number is required' }
  
  // Remove all non-digits
  const digitsOnly = phone.replace(/\D/g, '')
  
  // Check length
  if (digitsOnly.length < 10) {
    return { valid: false, error: 'Phone number must be at least 10 digits' }
  }
  
  if (digitsOnly.length > 15) {
    return { valid: false, error: 'Phone number is too long' }
  }
  
  // US phone number formatting
  if (digitsOnly.length === 10) {
    const formatted = `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`
    return { valid: true, formatted }
  }
  
  // US phone number with country code
  if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    const number = digitsOnly.slice(1)
    const formatted = `+1 (${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`
    return { valid: true, formatted }
  }
  
  // International numbers
  return { valid: true, formatted: `+${digitsOnly}` }
}

/**
 * Validate name fields with internationalization support
 */
export const validateName = (name: string, field: 'firstName' | 'lastName' = 'firstName'): { valid: boolean; error?: string } => {
  if (!name) return { valid: false, error: `${field === 'firstName' ? 'First' : 'Last'} name is required` }
  
  if (name.length < 1) {
    return { valid: false, error: `${field === 'firstName' ? 'First' : 'Last'} name is required` }
  }
  
  if (name.length > 50) {
    return { valid: false, error: `${field === 'firstName' ? 'First' : 'Last'} name is too long` }
  }
  
  // Allow letters, spaces, hyphens, and apostrophes for international names
  const nameRegex = /^[a-zA-ZÀ-ÿĀ-žА-я\s'-]+$/
  if (!nameRegex.test(name)) {
    return { valid: false, error: `${field === 'firstName' ? 'First' : 'Last'} name contains invalid characters` }
  }
  
  return { valid: true }
}

/**
 * Real-time form validation helper
 */
export const validateFormField = (
  fieldName: string,
  value: any,
  schema: z.ZodObject<any>
): { valid: boolean; error?: string } => {
  try {
    if ('shape' in schema && schema.shape[fieldName]) {
      const fieldSchema = schema.shape[fieldName]
      fieldSchema.parse(value)
      return { valid: true }
    }
    return { valid: false, error: 'Unknown field' }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.issues[0]?.message || 'Invalid value' }
    }
    return { valid: false, error: 'Validation failed' }
  }
}

/**
 * Form submission data sanitization
 */
export const sanitizeFormData = <T extends Record<string, any>>(data: T): T => {
  const sanitized = { ...data } as any
  
  // Trim string values
  Object.keys(sanitized).forEach(key => {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitized[key].trim()
    }
  })
  
  // Remove empty arrays and null values
  Object.keys(sanitized).forEach(key => {
    if (Array.isArray(sanitized[key]) && sanitized[key].length === 0) {
      delete sanitized[key]
    }
    if (sanitized[key] === null || sanitized[key] === undefined) {
      delete sanitized[key]
    }
  })
  
  return sanitized as T
}

/**
 * Security validation for form inputs
 */
export const validateSecurityConstraints = (data: Record<string, any>): { safe: boolean; issues?: string[] } => {
  const issues: string[] = []
  
  // Check for common XSS patterns
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi
  ]
  
  // Check for SQL injection patterns
  const sqlPatterns = [
    /(\s*(union|select|insert|update|delete|drop|create|alter|exec|execute)\s+)/gi,
    /((\s|%20)*(or|and)(\s|%20)*(1|0)\s*(=|<|>)\s*(1|0))/gi,
    /((char|nchar|varchar|nvarchar|text|ntext)\s*\(\s*\d+\s*\))/gi
  ]
  
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'string') {
      // Check for XSS
      xssPatterns.forEach(pattern => {
        if (pattern.test(value)) {
          issues.push(`Potential XSS detected in field: ${key}`)
        }
      })
      
      // Check for SQL injection
      sqlPatterns.forEach(pattern => {
        if (pattern.test(value)) {
          issues.push(`Potential SQL injection detected in field: ${key}`)
        }
      })
      
      // Check for excessive length (potential DoS)
      if (value.length > 10000) {
        issues.push(`Field ${key} exceeds maximum length`)
      }
    }
  })
  
  return {
    safe: issues.length === 0,
    issues: issues.length > 0 ? issues : undefined
  }
}

/**
 * Type-safe form validation wrapper
 */
export const validateForm = <T extends z.ZodSchema>(
  schema: T,
  data: unknown
): { success: boolean; data?: z.infer<T>; errors?: Record<string, string> } => {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.issues.forEach(issue => {
        const path = issue.path.join('.')
        errors[path] = issue.message
      })
      return { success: false, errors }
    }
    return { success: false, errors: { _form: 'Validation failed' } }
  }
}

// Export all validation schemas for use in components
export {
  emailCaptureSchema,
  bookingFormSchema,
  exitIntentSchema,
  leadQualificationSchema,
  conversionDataSchema
}

// Type exports for TypeScript support
export type EmailCaptureData = z.infer<typeof emailCaptureSchema>
export type BookingFormData = z.infer<typeof bookingFormSchema>
export type ExitIntentData = z.infer<typeof exitIntentSchema>
export type LeadQualificationData = z.infer<typeof leadQualificationSchema>
export type ConversionData = z.infer<typeof conversionDataSchema>

/**
 * Default form values for initial state
 */
export const defaultFormState: FormStateType = {
  currentQuestionIndex: 0,
  responses: {},
  isValid: false,
  canProceed: false,
  canGoBack: false,
  completionPercentage: 0
}

/**
 * Question ID to schema mapping for dynamic validation
 */
export const questionSchemaMap = {
  musicalIdentity: musicalIdentitySchema,
  performanceAspirations: performanceAspirationsSchema,
  acousticEnvironment: acousticEnvironmentSchema,
  investmentTimeline: investmentTimelineSchema,
  aestheticPreference: aestheticPreferenceSchema,
  collectionAccessLevel: collectionAccessLevelSchema,
  investmentRange: investmentRangeSchema,
  exclusiveAccess: exclusiveAccessSchema
} as const

/**
 * Validation error messages
 */
export const validationMessages = {
  required: 'Please select an option to continue',
  invalid: 'Please select a valid option',
  incomplete: 'Please complete all questions before proceeding',
  network: 'Unable to save progress. Please check your connection.',
  session: 'Your session has expired. Please start over.',
  generic: 'An error occurred. Please try again.'
} as const