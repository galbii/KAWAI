import type { Media } from '@/payload-types'

// ============================
// ASSESSMENT DATA INTERFACES
// ============================

/**
 * Musical Identity Assessment Values
 * Maps to user's current piano journey stage
 */
export type MusicalIdentity = 
  | 'beginning'        // Just starting their piano journey
  | 'returning'        // Returning to piano after a break  
  | 'active'          // Currently playing regularly
  | 'professional'    // Professional musician/teacher
  | 'family-legacy'   // Multi-generational piano family

/**
 * Performance Aspirations Assessment Values
 * Maps to primary intended use cases
 */
export type PerformanceAspirations = 
  | 'family-gatherings'   // Playing for family and friends
  | 'serious-practice'    // Dedicated practice and skill building
  | 'entertaining'        // Social entertaining and hosting
  | 'recording'          // Recording and digital content creation
  | 'teaching'           // Teaching others

/**
 * Acoustic Environment Assessment Values
 * Maps to physical space considerations
 */
export type AcousticEnvironment = 
  | 'cozy-living'           // Small, intimate living spaces
  | 'open-great-room'       // Large, open floor plans
  | 'dedicated-music'       // Dedicated music/practice room
  | 'formal-entertaining'   // Formal living/dining areas
  | 'multiple-spaces'       // Multiple locations/rooms

/**
 * Investment Timeline Assessment Values
 * Maps to purchase urgency and decision timeline
 */
export type InvestmentTimeline = 
  | 'ready-30-days'        // Ready to purchase within 30 days
  | 'exploring-2-6-months' // Actively exploring, 2-6 month timeframe
  | 'planning-this-year'   // Planning purchase within this year
  | 'beginning-research'   // Just beginning research phase

/**
 * Aesthetic Preference Assessment Values
 * Maps to finish and style preferences
 */
export type AestheticPreference = 
  | 'classic-ebony'         // Traditional ebony/black finishes
  | 'rich-mahogany'         // Warm wood tones and traditional styles
  | 'contemporary-white'    // Modern, light, contemporary aesthetics
  | 'experience-differences' // Want to see and compare options

/**
 * Collection Access Level Assessment Values
 * Maps to conversion path selection
 */
export type CollectionAccessLevel = 
  | 'curated-recommendations' // Digital recommendations only
  | 'private-viewing'        // In-person showroom experience
  | 'both'                   // Combination of both approaches

/**
 * Complete Assessment Response Interface
 * Captures all 6 strategic assessment questions
 */
export interface AssessmentResponse {
  musicalIdentity: MusicalIdentity
  performanceAspirations: PerformanceAspirations
  acousticEnvironment: AcousticEnvironment
  investmentTimeline: InvestmentTimeline
  aestheticPreference: AestheticPreference
  collectionAccessLevel: CollectionAccessLevel
  timestamp?: Date
  sessionId?: string
}

/**
 * Individual Assessment Question Interface
 * Defines structure for each question in the assessment
 */
export interface AssessmentQuestion {
  id: keyof AssessmentResponse
  title: string
  description: string
  options: AssessmentOption[]
  category: 'identity' | 'aspirations' | 'environment' | 'timeline' | 'aesthetic' | 'access'
  order: number
  required: boolean
}

/**
 * Assessment Option Interface  
 * Defines individual answer options for each question
 */
export interface AssessmentOption {
  value: string
  label: string
  description: string
  icon?: string
  image?: Media | string | null
  weight?: number // For scoring/matching algorithms
  tags?: string[] // For advanced filtering
}

// ============================
// PIANO RECOMMENDATION INTERFACES
// ============================

/**
 * Piano Categories for Recommendations
 */
export type PianoCategory = 'grand' | 'upright' | 'digital' | 'hybrid'

/**
 * Piano Price Ranges for Filtering
 */
export type PriceRange = 
  | 'entry'     // Under $10,000
  | 'mid'       // $10,000 - $35,000  
  | 'premium'   // $35,000 - $75,000
  | 'luxury'    // $75,000+

/**
 * Piano Feature Tags for Matching
 */
export type PianoFeature = 
  | 'silent-system'
  | 'bluetooth-audio'
  | 'recording-capability'
  | 'app-integration'
  | 'premium-action'
  | 'concert-sound'
  | 'space-saving'
  | 'traditional-craftsmanship'

/**
 * Piano Recommendation Interface
 * Individual piano model recommendation with metadata
 */
export interface PianoRecommendation {
  id: string
  name: string
  model: string
  category: PianoCategory
  priceRange: PriceRange
  msrp?: number
  image: Media | string | null
  shortDescription: string
  keyFeatures: string[]
  features: PianoFeature[]
  matchScore: number // 0-100 compatibility score
  matchReasons: string[] // Why this piano was recommended
  slug: string
  productUrl: string
  brochureUrl?: string
  videoUrl?: string
  availableFinishes?: string[]
  dimensions?: {
    length: number
    width: number  
    height: number
  }
  weight?: number
}

/**
 * Recommendation Set Interface
 * Complete set of recommendations for a user
 */
export interface RecommendationSet {
  primary: PianoRecommendation // Top recommendation
  alternatives: PianoRecommendation[] // 2-3 alternative options
  honorableMentions: PianoRecommendation[] // Additional considerations
  totalScore: number
  explanationSummary: string
  assessmentId: string
  generatedAt: Date
  expiresAt?: Date
}

/**
 * Matching Logic Configuration
 * Algorithm configuration for piano recommendations
 */
export interface MatchingCriteria {
  identityWeights: Record<MusicalIdentity, number>
  aspirationWeights: Record<PerformanceAspirations, number>
  environmentWeights: Record<AcousticEnvironment, number>
  timelineWeights: Record<InvestmentTimeline, number>
  aestheticWeights: Record<AestheticPreference, number>
  featureBoosts: Record<PianoFeature, number>
  categoryPreferences: Record<PianoCategory, number>
}

// ============================
// CONVERSION PATH INTERFACES
// ============================

/**
 * Conversion Path Types
 * Dual-path system based on user preferences
 */
export type ConversionPath = 'digital' | 'showroom' | 'hybrid'

/**
 * Lead Quality Scoring
 * Qualification levels for sales follow-up
 */
export type LeadQuality = 'hot' | 'warm' | 'nurture' | 'cold'

/**
 * Conversion Action Types
 * Available next steps for users
 */
export type ConversionAction = 
  | 'download-guide'
  | 'schedule-consultation'
  | 'request-quote'
  | 'virtual-tour'
  | 'showroom-visit'
  | 'video-call'
  | 'email-follow-up'
  | 'catalog-request'

/**
 * Digital Conversion Path Interface
 * For users preferring digital-first experience
 */
export interface DigitalConversionPath {
  type: 'digital'
  primaryAction: ConversionAction
  secondaryActions: ConversionAction[]
  resources: DigitalResource[]
  followUpSequence: FollowUpStep[]
  estimatedEngagementTime: number // minutes
}

/**
 * Showroom Conversion Path Interface  
 * For users preferring in-person experience
 */
export interface ShowroomConversionPath {
  type: 'showroom'
  primaryAction: ConversionAction
  secondaryActions: ConversionAction[]
  appointmentTypes: AppointmentType[]
  availableTimes: TimeSlot[]
  preparation: PreparationStep[]
  estimatedVisitDuration: number // minutes
}

/**
 * Hybrid Conversion Path Interface
 * Combines digital and in-person touchpoints
 */
export interface HybridConversionPath {
  type: 'hybrid'
  digitalFirst: boolean
  digitalSteps: DigitalResource[]
  showroomSteps: AppointmentType[]
  sequenceRecommended: string[]
  estimatedTotalTime: number // days
}

/**
 * Digital Resource Interface
 * Available digital assets and content
 */
export interface DigitalResource {
  id: string
  title: string
  description: string
  type: 'pdf' | 'video' | 'interactive' | 'webinar' | 'catalog'
  url?: string
  downloadUrl?: string
  duration?: number // minutes for video content
  fileSize?: string
  thumbnail?: Media | string | null
  featured: boolean
}

/**
 * Appointment Type Interface
 * Available in-person consultation types
 */
export interface AppointmentType {
  id: string
  title: string
  description: string
  duration: number // minutes
  preparation?: string[]
  includes: string[]
  availability: 'immediate' | 'scheduled' | 'by-request'
}

/**
 * Time Slot Interface
 * Available appointment times
 */
export interface TimeSlot {
  datetime: Date
  duration: number
  appointmentType: string
  available: boolean
  consultant?: string
}

/**
 * Preparation Step Interface
 * Steps to prepare for showroom visit
 */
export interface PreparationStep {
  title: string
  description: string
  optional: boolean
  estimatedTime?: number // minutes
}

/**
 * Follow-up Step Interface
 * Digital nurture sequence steps
 */
export interface FollowUpStep {
  delay: number // days after previous step
  type: 'email' | 'sms' | 'call' | 'resource'
  title: string
  content: string
  resources?: DigitalResource[]
  trackingMetrics?: string[]
}

/**
 * Lead Qualification Interface
 * Comprehensive lead scoring and qualification
 */
export interface LeadQualification {
  quality: LeadQuality
  score: number // 0-100
  readinessScore: number // 0-100
  budgetQualified: boolean
  timelineQualified: boolean
  engagementLevel: 'low' | 'medium' | 'high'
  preferredContact: 'email' | 'phone' | 'text'
  followUpPriority: 1 | 2 | 3 | 4 | 5
  assignedConsultant?: string
  notes?: string[]
}

// ============================
// COMPONENT PROP INTERFACES
// ============================

/**
 * Hero Section Props
 * Main landing page hero component
 */
export interface SignatureHeroProps {
  headline: string
  subheadline: string
  description: string
  backgroundImage?: Media | string | null
  backgroundVideo?: Media | string | null
  primaryCta: {
    text: string
    action: 'start-assessment' | 'view-collection' | 'schedule-visit'
  }
  secondaryCta?: {
    text: string
    action: string
    url?: string
  }
  trustIndicators?: TrustIndicator[]
  socialProof?: SocialProofItem[]
  className?: string
}

/**
 * Interactive Assessment Props
 * Assessment flow component properties
 */
export interface InteractiveAssessmentProps {
  questions: AssessmentQuestion[]
  onComplete: (response: AssessmentResponse) => void
  onProgress?: (currentStep: number, totalSteps: number) => void
  allowBack?: boolean
  saveProgress?: boolean
  sessionId?: string
  customStyling?: {
    theme: 'light' | 'dark'
    primaryColor: string
    backgroundColor: string
  }
  progressIndicator?: boolean
  estimatedTime?: number // minutes
  className?: string
}

/**
 * Dual Conversion Props
 * Conversion path selection component
 */
export interface DualConversionProps {
  recommendations: RecommendationSet
  digitalPath: DigitalConversionPath
  showroomPath: ShowroomConversionPath
  hybridPath?: HybridConversionPath
  onPathSelect: (path: ConversionPath) => void
  onActionSelect: (action: ConversionAction) => void
  leadQualification?: LeadQualification
  customization?: {
    hideHybrid?: boolean
    emphasizeShowroom?: boolean
    customCtaText?: Record<ConversionPath, string>
  }
  className?: string
}

/**
 * Exit Intent Modal Props
 * Exit-intent capture modal
 */
export interface ExitIntentModalProps {
  isOpen: boolean
  onClose: () => void
  onCapture: (email: string, interests?: string[]) => void
  headline: string
  description: string
  incentive?: {
    title: string
    description: string
    value?: string
  }
  alternativeOffers?: AlternativeOffer[]
  trustSignals?: TrustSignal[]
  className?: string
}

/**
 * Form Step Props
 * Individual assessment step component
 */
export interface FormStepProps {
  question: AssessmentQuestion
  value?: string
  onChange: (value: string) => void
  onNext?: () => void
  onBack?: () => void
  isValid: boolean
  showNavigation?: boolean
  stepNumber: number
  totalSteps: number
  className?: string
}

/**
 * Progress Indicator Props
 * Assessment progress display
 */
export interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  completedSteps: number[]
  stepTitles?: string[]
  variant: 'dots' | 'bar' | 'steps'
  showPercentage?: boolean
  showLabels?: boolean
  className?: string
}

/**
 * Piano Showcase Props
 * Piano recommendation display component
 */
export interface PianoShowcaseProps {
  piano: PianoRecommendation
  variant: 'card' | 'featured' | 'comparison'
  showMatchScore?: boolean
  showFeatures?: boolean
  showPricing?: boolean
  onViewDetails?: (pianoId: string) => void
  onRequestQuote?: (pianoId: string) => void
  onScheduleDemo?: (pianoId: string) => void
  className?: string
}

/**
 * Recommendation Results Props
 * Complete recommendations display
 */
export interface RecommendationResultsProps {
  recommendationSet: RecommendationSet
  onPianoSelect: (piano: PianoRecommendation) => void
  onRetakeAssessment?: () => void
  showAlternatives?: boolean
  showExplanation?: boolean
  allowFiltering?: boolean
  sortOptions?: ('match-score' | 'price-low' | 'price-high' | 'name')[]
  className?: string
}

// ============================
// SUPPORTING INTERFACES
// ============================

/**
 * Trust Indicator Interface
 * Trust building elements for hero section
 */
export interface TrustIndicator {
  icon: string
  text: string
  subtitle?: string
}

/**
 * Social Proof Item Interface
 * Social proof elements (testimonials, ratings, etc.)
 */
export interface SocialProofItem {
  type: 'testimonial' | 'rating' | 'award' | 'statistic'
  content: string
  author?: string
  rating?: number
  source?: string
  image?: Media | string | null
}

/**
 * Alternative Offer Interface
 * Alternative offers for exit intent
 */
export interface AlternativeOffer {
  title: string
  description: string
  action: ConversionAction
  value?: string
}

/**
 * Trust Signal Interface
 * Trust building signals for forms
 */
export interface TrustSignal {
  icon: string
  text: string
}

/**
 * Contact Information Interface
 * Lead capture contact details
 */
export interface ContactInformation {
  firstName: string
  lastName: string
  email: string
  phone?: string
  zipCode?: string
  preferredContact: 'email' | 'phone' | 'text'
  optInMarketing: boolean
  source?: string
  utmParameters?: Record<string, string>
}

/**
 * Analytics Event Interface
 * Tracking and analytics events
 */
export interface AnalyticsEvent {
  event: string
  category: 'assessment' | 'recommendation' | 'conversion' | 'engagement'
  action: string
  label?: string
  value?: number
  properties?: Record<string, any>
  timestamp: Date
  sessionId: string
  userId?: string
}

/**
 * Session Data Interface
 * Complete user session information
 */
export interface SessionData {
  sessionId: string
  startTime: Date
  lastActivity: Date
  assessmentResponse?: AssessmentResponse
  recommendationSet?: RecommendationSet
  selectedPath?: ConversionPath
  completedActions: ConversionAction[]
  leadQualification?: LeadQualification
  contactInformation?: ContactInformation
  analyticsEvents: AnalyticsEvent[]
  source?: string
  utmParameters?: Record<string, string>
}

/**
 * Configuration Interface
 * Global configuration for signature experience
 */
export interface SignatureConfig {
  assessmentConfig: {
    enableSaveProgress: boolean
    showEstimatedTime: boolean
    allowSkipQuestions: boolean
    requireAllQuestions: boolean
  }
  recommendationConfig: {
    maxRecommendations: number
    minMatchScore: number
    enableAlternatives: boolean
    showMatchReasons: boolean
  }
  conversionConfig: {
    enableHybridPath: boolean
    emphasizeShowroom: boolean
    defaultPath: ConversionPath
    requireContactInfo: boolean
  }
  analyticsConfig: {
    enableTracking: boolean
    trackingProvider: string
    customEvents: string[]
  }
  integrationConfig: {
    crmIntegration: boolean
    emailAutomation: boolean
    calendarIntegration: boolean
  }
}

// Type Guards for Runtime Type Checking
export function isValidMusicalIdentity(value: string): value is MusicalIdentity {
  return ['beginning', 'returning', 'active', 'professional', 'family-legacy'].includes(value)
}

export function isValidConversionPath(value: string): value is ConversionPath {
  return ['digital', 'showroom', 'hybrid'].includes(value)
}

export function isValidLeadQuality(value: string): value is LeadQuality {
  return ['hot', 'warm', 'nurture', 'cold'].includes(value)
}

// Utility Types
export type AssessmentQuestionId = keyof AssessmentResponse
export type ConversionPathData = DigitalConversionPath | ShowroomConversionPath | HybridConversionPath
export type AnyConversionAction = ConversionAction | string
export type RecommendationDisplay = 'grid' | 'list' | 'carousel' | 'detailed'