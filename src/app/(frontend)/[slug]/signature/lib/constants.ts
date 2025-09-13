import type {
  AssessmentQuestion,
  MusicalIdentity,
  PerformanceAspirations,
  AcousticEnvironment,
  InvestmentTimeline,
  AestheticPreference,
  CollectionAccessLevel,
  ConversionAction,
  PianoCategory,
  PriceRange,
  PianoFeature,
  MatchingCriteria,
  DigitalResource,
  AppointmentType,
  TrustIndicator,
  SocialProofItem
} from '../types'

// ============================
// ASSESSMENT CONSTANTS
// ============================

/**
 * Assessment Question Configuration
 * Complete set of 6 strategic questions with options
 */
export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'musicalIdentity',
    title: 'Where are you in your piano journey?',
    description: 'Understanding your musical background helps us recommend the perfect instrument for your needs.',
    category: 'identity',
    order: 1,
    required: true,
    options: [
      {
        value: 'beginning',
        label: 'Just Beginning',
        description: 'Taking my first steps into the world of piano',
        icon: 'seedling',
        weight: 10
      },
      {
        value: 'returning',
        label: 'Returning Player',
        description: 'Coming back to piano after some time away',
        icon: 'refresh',
        weight: 20
      },
      {
        value: 'active',
        label: 'Active Player',
        description: 'Currently playing and practicing regularly',
        icon: 'play-circle',
        weight: 30
      },
      {
        value: 'professional',
        label: 'Professional Musician',
        description: 'Piano is part of my professional life or advanced studies',
        icon: 'award',
        weight: 40
      },
      {
        value: 'family-legacy',
        label: 'Family Tradition',
        description: 'Continuing or starting a family musical tradition',
        icon: 'home',
        weight: 25
      }
    ]
  },
  {
    id: 'performanceAspirations',
    title: 'How do you envision using your piano?',
    description: 'Your intended use helps us match you with instruments that excel in those areas.',
    category: 'aspirations',
    order: 2,
    required: true,
    options: [
      {
        value: 'family-gatherings',
        label: 'Family & Friends',
        description: 'Playing for family gatherings and intimate settings',
        icon: 'users',
        weight: 15,
        tags: ['social', 'casual']
      },
      {
        value: 'serious-practice',
        label: 'Serious Practice',
        description: 'Dedicated practice sessions and skill development',
        icon: 'target',
        weight: 35,
        tags: ['practice', 'development']
      },
      {
        value: 'entertaining',
        label: 'Social Entertaining',
        description: 'Hosting events and entertaining guests',
        icon: 'music',
        weight: 20,
        tags: ['social', 'performance']
      },
      {
        value: 'recording',
        label: 'Recording & Creating',
        description: 'Recording music or creating digital content',
        icon: 'microphone',
        weight: 30,
        tags: ['technology', 'creative']
      },
      {
        value: 'teaching',
        label: 'Teaching Others',
        description: 'Teaching piano to students or family members',
        icon: 'graduation-cap',
        weight: 25,
        tags: ['education', 'sharing']
      }
    ]
  },
  {
    id: 'acousticEnvironment',
    title: 'Tell us about your piano space',
    description: 'The acoustic environment influences which piano will sound and fit best in your home.',
    category: 'environment',
    order: 3,
    required: true,
    options: [
      {
        value: 'cozy-living',
        label: 'Cozy Living Space',
        description: 'Intimate rooms with warm acoustics',
        icon: 'home',
        weight: 10,
        tags: ['small', 'intimate']
      },
      {
        value: 'open-great-room',
        label: 'Open Great Room',
        description: 'Large, open floor plans with high ceilings',
        icon: 'maximize',
        weight: 30,
        tags: ['large', 'open']
      },
      {
        value: 'dedicated-music',
        label: 'Music Room',
        description: 'Dedicated music or practice room',
        icon: 'music',
        weight: 35,
        tags: ['dedicated', 'focused']
      },
      {
        value: 'formal-entertaining',
        label: 'Formal Areas',
        description: 'Formal living or dining areas for entertaining',
        icon: 'crown',
        weight: 25,
        tags: ['formal', 'elegant']
      },
      {
        value: 'multiple-spaces',
        label: 'Multiple Spaces',
        description: 'Need flexibility to use in different areas',
        icon: 'shuffle',
        weight: 15,
        tags: ['flexible', 'portable']
      }
    ]
  },
  {
    id: 'investmentTimeline',
    title: 'What\'s your timeline for acquiring a piano?',
    description: 'Your timeline helps us prioritize recommendations and availability.',
    category: 'timeline',
    order: 4,
    required: true,
    options: [
      {
        value: 'ready-30-days',
        label: 'Ready Within 30 Days',
        description: 'I\'m ready to make a decision and purchase soon',
        icon: 'clock',
        weight: 40,
        tags: ['urgent', 'ready']
      },
      {
        value: 'exploring-2-6-months',
        label: 'Exploring (2-6 Months)',
        description: 'Actively shopping and comparing options',
        icon: 'search',
        weight: 30,
        tags: ['active', 'comparing']
      },
      {
        value: 'planning-this-year',
        label: 'Planning This Year',
        description: 'Planning to purchase sometime this year',
        icon: 'calendar',
        weight: 20,
        tags: ['planning', 'this-year']
      },
      {
        value: 'beginning-research',
        label: 'Just Beginning Research',
        description: 'Starting to learn about options and possibilities',
        icon: 'book',
        weight: 10,
        tags: ['research', 'learning']
      }
    ]
  },
  {
    id: 'aestheticPreference',
    title: 'Which aesthetic appeals to you most?',
    description: 'Understanding your style preferences helps us show you pianos that will complement your space.',
    category: 'aesthetic',
    order: 5,
    required: true,
    options: [
      {
        value: 'classic-ebony',
        label: 'Classic Ebony',
        description: 'Timeless black finishes with traditional elegance',
        icon: 'gem',
        weight: 25,
        tags: ['traditional', 'elegant', 'black']
      },
      {
        value: 'rich-mahogany',
        label: 'Rich Wood Tones',
        description: 'Warm mahogany, walnut, and natural wood finishes',
        icon: 'tree',
        weight: 20,
        tags: ['warm', 'natural', 'wood']
      },
      {
        value: 'contemporary-white',
        label: 'Contemporary White',
        description: 'Modern white and light finishes for contemporary spaces',
        icon: 'sun',
        weight: 15,
        tags: ['modern', 'light', 'contemporary']
      },
      {
        value: 'experience-differences',
        label: 'Want to Experience All',
        description: 'I\'d like to see and compare different finish options',
        icon: 'eye',
        weight: 30,
        tags: ['comparison', 'undecided']
      }
    ]
  },
  {
    id: 'collectionAccessLevel',
    title: 'How would you prefer to explore our collection?',
    description: 'Choose the experience that best fits your preference for discovering your perfect piano.',
    category: 'access',
    order: 6,
    required: true,
    options: [
      {
        value: 'curated-recommendations',
        label: 'Curated Recommendations',
        description: 'Receive personalized digital recommendations and resources',
        icon: 'star',
        weight: 20,
        tags: ['digital', 'convenient']
      },
      {
        value: 'private-viewing',
        label: 'Private Showroom Experience',
        description: 'Schedule a personal consultation in our Lake St. Louis showroom',
        icon: 'calendar',
        weight: 40,
        tags: ['in-person', 'consultation']
      },
      {
        value: 'both',
        label: 'Both Experiences',
        description: 'Combine digital resources with an in-person showroom visit',
        icon: 'layers',
        weight: 35,
        tags: ['comprehensive', 'both']
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
  estimatedTimeMinutes: 3,
  allowSkipQuestions: false,
  saveProgressEnabled: true,
  showProgressIndicator: true,
  enableBackButton: true,
  autoAdvance: false,
  sessionTimeoutMinutes: 30
} as const

// ============================
// PIANO RECOMMENDATION CONSTANTS
// ============================

/**
 * Piano Categories Configuration
 */
export const PIANO_CATEGORIES: Record<PianoCategory, { name: string; description: string; icon: string }> = {
  grand: {
    name: 'Grand Pianos',
    description: 'Premium acoustic grand pianos for exceptional touch and tone',
    icon: 'music'
  },
  upright: {
    name: 'Upright Pianos',
    description: 'Space-efficient acoustic pianos with rich, full sound',
    icon: 'home'
  },
  digital: {
    name: 'Digital Pianos',
    description: 'Advanced digital pianos with realistic touch and modern features',
    icon: 'zap'
  },
  hybrid: {
    name: 'Hybrid Pianos',
    description: 'Innovative combination of acoustic action with digital versatility',
    icon: 'layers'
  }
}

/**
 * Price Range Configuration
 */
export const PRICE_RANGES: Record<PriceRange, { name: string; min: number; max: number; description: string }> = {
  entry: {
    name: 'Entry Level',
    min: 0,
    max: 10000,
    description: 'Quality instruments for beginners and casual players'
  },
  mid: {
    name: 'Mid-Range',
    min: 10000,
    max: 35000,
    description: 'Professional features for serious musicians'
  },
  premium: {
    name: 'Premium',
    min: 35000,
    max: 75000,
    description: 'High-end instruments for discerning players'
  },
  luxury: {
    name: 'Luxury',
    min: 75000,
    max: 500000,
    description: 'Concert-quality instruments and exclusive models'
  }
}

/**
 * Piano Features Configuration
 */
export const PIANO_FEATURES: Record<PianoFeature, { name: string; description: string; category: string }> = {
  'silent-system': {
    name: 'Silent System',
    description: 'Practice with headphones without disturbing others',
    category: 'technology'
  },
  'bluetooth-audio': {
    name: 'Bluetooth Audio',
    description: 'Stream music and connect to apps wirelessly',
    category: 'connectivity'
  },
  'recording-capability': {
    name: 'Recording Capability',
    description: 'Built-in recording and playback functionality',
    category: 'technology'
  },
  'app-integration': {
    name: 'App Integration',
    description: 'Compatible with learning and performance apps',
    category: 'connectivity'
  },
  'premium-action': {
    name: 'Premium Action',
    description: 'Advanced key action for expressive performance',
    category: 'touch'
  },
  'concert-sound': {
    name: 'Concert Sound',
    description: 'Professional-grade sound quality and projection',
    category: 'sound'
  },
  'space-saving': {
    name: 'Space-Saving Design',
    description: 'Compact design optimized for smaller spaces',
    category: 'design'
  },
  'traditional-craftsmanship': {
    name: 'Traditional Craftsmanship',
    description: 'Hand-crafted with traditional piano-making techniques',
    category: 'craftsmanship'
  }
}

/**
 * Piano Matching Algorithm Weights
 * Configuration for recommendation scoring
 */
export const MATCHING_CRITERIA: MatchingCriteria = {
  identityWeights: {
    'beginning': 5,
    'returning': 10,
    'active': 15,
    'professional': 25,
    'family-legacy': 12
  },
  aspirationWeights: {
    'family-gatherings': 8,
    'serious-practice': 20,
    'entertaining': 12,
    'recording': 18,
    'teaching': 15
  },
  environmentWeights: {
    'cozy-living': 5,
    'open-great-room': 15,
    'dedicated-music': 20,
    'formal-entertaining': 12,
    'multiple-spaces': 8
  },
  timelineWeights: {
    'ready-30-days': 25,
    'exploring-2-6-months': 20,
    'planning-this-year': 15,
    'beginning-research': 5
  },
  aestheticWeights: {
    'classic-ebony': 10,
    'rich-mahogany': 8,
    'contemporary-white': 6,
    'experience-differences': 15
  },
  featureBoosts: {
    'silent-system': 8,
    'bluetooth-audio': 5,
    'recording-capability': 12,
    'app-integration': 6,
    'premium-action': 15,
    'concert-sound': 18,
    'space-saving': 10,
    'traditional-craftsmanship': 12
  },
  categoryPreferences: {
    'grand': 25,
    'upright': 15,
    'digital': 20,
    'hybrid': 18
  }
}

/**
 * Recommendation Configuration
 */
export const RECOMMENDATION_CONFIG = {
  maxRecommendations: 1, // Primary recommendation
  maxAlternatives: 3,
  maxHonorableMentions: 4,
  minMatchScore: 60,
  scoreThresholds: {
    excellent: 90,
    very_good: 80,
    good: 70,
    fair: 60
  },
  expirationDays: 30
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
  PIANO_CATEGORIES,
  PRICE_RANGES,
  PIANO_FEATURES,
  MATCHING_CRITERIA,
  RECOMMENDATION_CONFIG,
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