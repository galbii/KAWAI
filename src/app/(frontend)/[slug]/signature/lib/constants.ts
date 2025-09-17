import type {
  AssessmentQuestion,
  MusicalIdentity,
  PerformanceAspirations,
  AcousticEnvironment,
  InvestmentTimeline,
  AestheticPreference,
  CollectionAccessLevel,
  ConversionAction,
  DigitalResource,
  AppointmentType,
  TrustIndicator,
  SocialProofItem
} from '../types'

// ============================
// ASSESSMENT CONSTANTS
// ============================

/**
 * Invitation Request Questions
 * Streamlined 3-question assessment that builds toward requesting an exclusive invitation
 */
export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'musicalIdentity',
    title: 'Tell us about your musical background',
    description: 'Understanding your musical journey helps us determine if our exclusive event is the right fit for you.',
    category: 'identity',
    order: 1,
    required: true,
    options: [
      {
        value: 'beginning',
        label: 'Starting My Musical Journey',
        description: "I'm beginning my piano journey and want to start with exceptional instruments",
        icon: 'seedling',
        weight: 10
      },
      {
        value: 'returning',
        label: 'Returning to Piano',
        description: "I'm returning to piano after time away and want to rekindle my passion",
        icon: 'refresh',
        weight: 20
      },
      {
        value: 'active',
        label: 'Active Player',
        description: "I play regularly and am looking for an instrument that matches my dedication",
        icon: 'play-circle',
        weight: 30
      },
      {
        value: 'professional',
        label: 'Professional Musician',
        description: "I'm a professional musician who appreciates concert-quality instruments",
        icon: 'award',
        weight: 40
      },
      {
        value: 'family-legacy',
        label: 'Family Music Tradition',
        description: "I'm continuing or starting a family tradition of piano excellence",
        icon: 'home',
        weight: 25
      }
    ]
  },
  {
    id: 'investmentTimeline',
    title: "When are you planning to welcome a piano into your life?",
    description: 'Your timeline helps us prioritize invitations for our most relevant exclusive events.',
    category: 'timeline',
    order: 2,
    required: true,
    options: [
      {
        value: 'ready-30-days',
        label: 'Ready Now',
        description: 'I\'m ready to make this important decision and would welcome immediate access',
        icon: 'clock',
        weight: 40,
        tags: ['immediate', 'committed']
      },
      {
        value: 'exploring-2-6-months',
        label: 'Actively Exploring (Next 3-6 Months)',
        description: 'Seriously evaluating options and would benefit from exclusive access',
        icon: 'search',
        weight: 30,
        tags: ['active', 'evaluating']
      },
      {
        value: 'planning-this-year',
        label: 'Planning This Year',
        description: 'Building toward a piano acquisition within the next 12 months',
        icon: 'calendar',
        weight: 20,
        tags: ['strategic', 'planned']
      },
      {
        value: 'beginning-research',
        label: 'Future Consideration',
        description: 'Exploring possibilities for future piano ownership',
        icon: 'book',
        weight: 10,
        tags: ['exploration', 'learning']
      }
    ]
  },
  {
    id: 'exclusiveAccess',
    title: 'How interested are you in exclusive piano experiences?',
    description: 'This helps us determine if you would value an invitation to our private signature events.',
    category: 'access',
    order: 3,
    required: true,
    options: [
      {
        value: 'highly-interested',
        label: 'Very Interested',
        description: 'I would greatly value access to exclusive piano events and private consultations',
        icon: 'star',
        weight: 40,
        tags: ['exclusive', 'priority']
      },
      {
        value: 'interested',
        label: 'Interested',
        description: 'Exclusive access sounds appealing if it matches my needs',
        icon: 'heart',
        weight: 30,
        tags: ['interested', 'selective']
      },
      {
        value: 'somewhat-interested',
        label: 'Somewhat Interested',
        description: 'I\'m curious about what exclusive events might offer',
        icon: 'eye',
        weight: 20,
        tags: ['curious', 'exploring']
      },
      {
        value: 'prefer-standard',
        label: 'Prefer Standard Experience',
        description: 'I prefer traditional showroom visits and standard appointments',
        icon: 'home',
        weight: 10,
        tags: ['traditional', 'standard']
      }
    ]
  }
]

/**
 * Assessment Question Lookup by ID
 */
export const ASSESSMENT_QUESTIONS_BY_ID = ASSESSMENT_QUESTIONS.reduce((acc, question) => {
  acc[question.id] = question
  return acc
}, {} as Record<string, AssessmentQuestion>)

/**
 * Assessment Progress Configuration
 */
export const ASSESSMENT_CONFIG = {
  totalSteps: ASSESSMENT_QUESTIONS.length,
  estimatedTimeMinutes: 4,
  allowSkipQuestions: false,
  saveProgressEnabled: true,
  showProgressIndicator: true,
  enableBackButton: true,
  autoAdvance: false,
  sessionTimeoutMinutes: 30
} as const


// ============================
// CONVERSION PATH CONSTANTS
// ============================

/**
 * Available Conversion Actions
 */
export const CONVERSION_ACTIONS: Record<ConversionAction, { name: string; description: string; category: string }> = {
  'download-guide': {
    name: 'Download Piano Guide',
    description: 'Get our comprehensive piano buying guide',
    category: 'digital'
  },
  'schedule-consultation': {
    name: 'Schedule Consultation',
    description: 'Book a personal consultation with our experts',
    category: 'showroom'
  },
  'request-quote': {
    name: 'Request Quote',
    description: 'Get pricing information for specific pianos',
    category: 'sales'
  },
  'virtual-tour': {
    name: 'Virtual Showroom Tour',
    description: 'Take an interactive tour of our showroom',
    category: 'digital'
  },
  'showroom-visit': {
    name: 'Visit Showroom',
    description: 'Schedule an in-person showroom visit',
    category: 'showroom'
  },
  'video-call': {
    name: 'Video Consultation',
    description: 'Connect with an expert via video call',
    category: 'hybrid'
  },
  'email-follow-up': {
    name: 'Email Follow-up',
    description: 'Receive personalized recommendations via email',
    category: 'digital'
  },
  'catalog-request': {
    name: 'Request Catalog',
    description: 'Receive detailed piano catalogs and brochures',
    category: 'digital'
  }
}

/**
 * Digital Resources Configuration
 */
export const DIGITAL_RESOURCES: DigitalResource[] = [
  {
    id: 'piano-buying-guide',
    title: 'Complete Piano Buying Guide',
    description: 'Everything you need to know about choosing the perfect piano',
    type: 'pdf',
    downloadUrl: '/resources/piano-buying-guide.pdf',
    duration: 15,
    fileSize: '2.3 MB',
    featured: true
  },
  {
    id: 'kawai-collection-catalog',
    title: 'Kawai Piano Collection Catalog',
    description: 'Comprehensive catalog of our entire Kawai piano collection',
    type: 'catalog',
    downloadUrl: '/resources/kawai-catalog.pdf',
    fileSize: '8.4 MB',
    featured: true
  },
  {
    id: 'piano-care-guide',
    title: 'Piano Care & Maintenance Guide',
    description: 'Expert tips for keeping your piano in perfect condition',
    type: 'pdf',
    downloadUrl: '/resources/piano-care-guide.pdf',
    fileSize: '1.8 MB',
    featured: false
  },
  {
    id: 'virtual-showroom-tour',
    title: 'Virtual Showroom Experience',
    description: 'Interactive 360° tour of our Lake St. Louis showroom',
    type: 'interactive',
    url: '/virtual-tour',
    duration: 10,
    featured: true
  },
  {
    id: 'piano-lessons-intro',
    title: 'Getting Started with Piano Lessons',
    description: 'Introduction to piano lessons and finding the right teacher',
    type: 'video',
    url: '/resources/lessons-intro',
    duration: 8,
    featured: false
  }
]

/**
 * Appointment Types Configuration
 */
export const APPOINTMENT_TYPES: AppointmentType[] = [
  {
    id: 'piano-consultation',
    title: 'Piano Consultation',
    description: 'Personal consultation to discuss your piano needs and preferences',
    duration: 60,
    preparation: [
      'Think about your musical goals',
      'Consider your budget range',
      'Measure your intended piano space'
    ],
    includes: [
      'Expert guidance on piano selection',
      'Hands-on playing experience',
      'Personalized recommendations',
      'Financing options discussion'
    ],
    availability: 'scheduled'
  },
  {
    id: 'piano-trial',
    title: 'Extended Piano Trial',
    description: 'Extended time to try specific pianos you\'re considering',
    duration: 90,
    preparation: [
      'List specific models you want to try',
      'Bring sheet music you\'d like to play',
      'Consider bringing family members'
    ],
    includes: [
      'Uninterrupted playing time',
      'Technical explanations',
      'Comparison guidance',
      'Recording your performances (optional)'
    ],
    availability: 'scheduled'
  },
  {
    id: 'family-visit',
    title: 'Family Piano Visit',
    description: 'Family-friendly visit to explore pianos together',
    duration: 75,
    preparation: [
      'Discuss family musical goals',
      'Consider each family member\'s interests',
      'Plan for children\'s attention spans'
    ],
    includes: [
      'Family-oriented presentation',
      'Kid-friendly piano introduction',
      'Discussion of learning paths',
      'Family pricing options'
    ],
    availability: 'scheduled'
  },
  {
    id: 'express-consultation',
    title: 'Express Consultation',
    description: 'Quick consultation for focused questions or specific needs',
    duration: 30,
    includes: [
      'Focused discussion',
      'Quick piano overview',
      'Specific question answers',
      'Next steps planning'
    ],
    availability: 'immediate'
  }
]

// ============================
// UI/UX CONSTANTS
// ============================

/**
 * Trust Indicators for Hero Section
 */
export const TRUST_INDICATORS: TrustIndicator[] = [
  {
    icon: 'award',
    text: 'Est. 1927',
    subtitle: 'Nearly a century of excellence'
  },
  {
    icon: 'map-pin',
    text: 'Lake St. Louis',
    subtitle: 'Premier Missouri showroom'
  },
  {
    icon: 'users',
    text: '1000+ Happy Families',
    subtitle: 'Trusted by the community'
  },
  {
    icon: 'shield-check',
    text: 'Certified Experts',
    subtitle: 'Kawai-certified technicians'
  }
]

/**
 * Social Proof Items
 */
export const SOCIAL_PROOF_ITEMS: SocialProofItem[] = [
  {
    type: 'testimonial',
    content: 'The personalized service and expert guidance made choosing our family piano effortless. Our Kawai CA901 has brought so much joy to our home.',
    author: 'Sarah M.',
    source: 'Google Reviews'
  },
  {
    type: 'rating',
    content: '4.9/5 stars from over 200 reviews',
    rating: 4.9,
    source: 'Google Reviews'
  },
  {
    type: 'statistic',
    content: '97% customer satisfaction rate',
    source: 'Customer surveys'
  },
  {
    type: 'award',
    content: 'Missouri\'s Top Piano Dealer',
    source: 'Kawai America'
  }
]

/**
 * Assessment UI Configuration
 */
export const ASSESSMENT_UI_CONFIG = {
  theme: {
    primaryColor: '#2563eb',
    secondaryColor: '#64748b',
    backgroundColor: '#ffffff',
    accentColor: '#0ea5e9'
  },
  animation: {
    transitionDuration: 300,
    enableAnimations: true,
    slideDirection: 'horizontal'
  },
  progressIndicator: {
    variant: 'dots' as const,
    showPercentage: true,
    showLabels: false
  },
  buttons: {
    size: 'large' as const,
    style: 'rounded',
    variant: 'primary' as const
  }
} as const

/**
 * Conversion Path UI Configuration
 */
export const CONVERSION_UI_CONFIG = {
  digitalPath: {
    primaryColor: '#10b981',
    icon: 'monitor',
    badge: 'Most Convenient'
  },
  showroomPath: {
    primaryColor: '#f59e0b',
    icon: 'building',
    badge: 'Most Personal'
  },
  hybridPath: {
    primaryColor: '#8b5cf6',
    icon: 'layers',
    badge: 'Best of Both'
  }
} as const

// ============================
// SYSTEM CONFIGURATION
// ============================

/**
 * Session Configuration
 */
export const SESSION_CONFIG = {
  sessionTimeoutMinutes: 45,
  saveProgressInterval: 30000, // 30 seconds
  maxSessionRetries: 3,
  enableAnalytics: true,
  enableErrorTracking: true
} as const

/**
 * API Configuration
 */
export const API_CONFIG = {
  endpoints: {
    assessment: '/api/signature/assessment',
    recommendations: '/api/signature/recommendations',
    conversion: '/api/signature/conversion',
    contact: '/api/signature/contact',
    analytics: '/api/signature/analytics'
  },
  timeout: 10000, // 10 seconds
  retries: 2,
  cacheEnabled: true,
  cacheDuration: 300000 // 5 minutes
} as const

/**
 * Analytics Event Names
 */
export const ANALYTICS_EVENTS = {
  assessment: {
    started: 'signature_assessment_started',
    question_answered: 'signature_question_answered',
    completed: 'signature_assessment_completed',
    abandoned: 'signature_assessment_abandoned'
  },
  recommendations: {
    viewed: 'signature_recommendations_viewed',
    piano_selected: 'signature_piano_selected',
    filter_applied: 'signature_filter_applied'
  },
  conversion: {
    path_selected: 'signature_path_selected',
    action_taken: 'signature_action_taken',
    lead_generated: 'signature_lead_generated'
  },
  engagement: {
    time_spent: 'signature_time_spent',
    exit_intent: 'signature_exit_intent',
    return_visit: 'signature_return_visit'
  }
} as const

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  assessment: {
    incomplete: 'Please complete all assessment questions before proceeding.',
    invalid_response: 'Invalid response selected. Please try again.',
    session_expired: 'Your session has expired. Please start over.',
    save_failed: 'Failed to save progress. Please try again.'
  },
  recommendations: {
    generation_failed: 'Unable to generate recommendations. Please try again.',
    no_results: 'No suitable pianos found. Please retake the assessment.',
    load_failed: 'Failed to load recommendations. Please refresh the page.'
  },
  contact: {
    invalid_email: 'Please enter a valid email address.',
    invalid_phone: 'Please enter a valid phone number.',
    submission_failed: 'Failed to submit information. Please try again.',
    required_fields: 'Please fill in all required fields.'
  },
  system: {
    network_error: 'Network error. Please check your connection and try again.',
    server_error: 'Server error. Please try again later.',
    timeout: 'Request timed out. Please try again.'
  }
} as const

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  assessment: 'Assessment completed successfully!',
  recommendations: 'Your personalized piano recommendations are ready!',
  contact: 'Thank you! We\'ll be in touch soon.',
  quote: 'Quote request submitted successfully!',
  consultation: 'Consultation scheduled successfully!'
} as const

// Export all constants for easy importing
export const SIGNATURE_CONSTANTS = {
  ASSESSMENT_QUESTIONS,
  ASSESSMENT_QUESTIONS_BY_ID,
  ASSESSMENT_CONFIG,
  CONVERSION_ACTIONS,
  DIGITAL_RESOURCES,
  APPOINTMENT_TYPES,
  TRUST_INDICATORS,
  SOCIAL_PROOF_ITEMS,
  ASSESSMENT_UI_CONFIG,
  CONVERSION_UI_CONFIG,
  SESSION_CONFIG,
  API_CONFIG,
  ANALYTICS_EVENTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
} as const