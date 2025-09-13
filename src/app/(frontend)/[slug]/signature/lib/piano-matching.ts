import type { 
  AssessmentResponse, 
  PianoRecommendation, 
  RecommendationSet,
  MatchingCriteria,
  PianoCategory,
  PriceRange,
  PianoFeature,
  MusicalIdentity,
  PerformanceAspirations,
  AcousticEnvironment,
  InvestmentTimeline,
  AestheticPreference
} from '../types'
import type { Media } from '@/payload-types'

/**
 * Piano Matching Algorithm Configuration
 * Weights and scoring criteria for personalized recommendations
 */
export const MATCHING_CRITERIA: MatchingCriteria = {
  // Musical Identity weights (influences complexity and feature needs)
  identityWeights: {
    'beginning': 0.7,      // Favor simpler, more accessible models
    'returning': 0.8,      // Balance of features and ease-of-use
    'active': 0.9,         // Full feature set important
    'professional': 1.0,   // Maximum feature weight
    'family-legacy': 0.85  // Traditional craftsmanship emphasis
  },
  
  // Performance Aspirations weights (influences sound quality and features)
  aspirationWeights: {
    'family-gatherings': 0.7,     // Emphasis on warm, inviting sound
    'serious-practice': 0.95,     // Technical precision important
    'entertaining': 0.8,          // Versatility and presentation
    'recording': 1.0,            // Maximum sound quality needs
    'teaching': 0.9              // Reliability and consistency
  },
  
  // Acoustic Environment weights (influences piano size and projection)
  environmentWeights: {
    'cozy-living': 0.6,           // Compact models preferred
    'open-great-room': 0.9,       // Larger models for projection
    'dedicated-music': 1.0,       // Full-size instruments optimal
    'formal-entertaining': 0.85,   // Elegant appearance important
    'multiple-spaces': 0.7       // Versatility and portability
  },
  
  // Investment Timeline weights (influences urgency and decision factors)
  timelineWeights: {
    'ready-30-days': 1.0,        // High urgency, ready to buy
    'exploring-2-6-months': 0.85, // Active shopping phase
    'planning-this-year': 0.7,    // Planning stage
    'beginning-research': 0.5     // Early research phase
  },
  
  // Aesthetic Preference weights (influences finish recommendations)
  aestheticWeights: {
    'classic-ebony': 0.9,         // Traditional black finishes
    'rich-mahogany': 0.85,        // Wood tones and warmth
    'contemporary-white': 0.8,     // Modern aesthetics
    'experience-differences': 0.75 // Open to options
  },
  
  // Feature boosts (additional scoring for specific features)
  featureBoosts: {
    'silent-system': 15,          // Valuable for practice flexibility
    'bluetooth-audio': 10,        // Modern connectivity
    'recording-capability': 20,    // Professional features
    'app-integration': 8,         // Technology integration
    'premium-action': 25,         // Touch quality emphasis
    'concert-sound': 30,          // Sound quality premium
    'space-saving': 12,           // Practical considerations
    'traditional-craftsmanship': 18 // Heritage and quality
  },
  
  // Category preferences by context
  categoryPreferences: {
    'grand': 1.0,      // Premium category
    'upright': 0.85,   // Traditional choice
    'digital': 0.8,    // Modern convenience
    'hybrid': 0.9      // Best of both worlds
  }
}

/**
 * Mock Piano Database for Matching Algorithm
 * In production, this would come from the CMS
 */
export const PIANO_DATABASE: PianoRecommendation[] = [
  // Grand Pianos - Premium Recommendations
  {
    id: 'sk-ex-concert-grand',
    name: 'Shigeru Kawai SK-EX',
    model: 'SK-EX',
    category: 'grand',
    priceRange: 'luxury',
    msrp: 189000,
    image: null,
    shortDescription: 'Concert grand piano representing the pinnacle of Kawai craftsmanship',
    keyFeatures: [
      'Concert-level sound projection',
      'Millennium III Action with ABS-Carbon',
      'Solid spruce soundboard',
      'Premium Neotex key surfaces',
      'Hand-selected materials throughout'
    ],
    features: ['concert-sound', 'premium-action', 'traditional-craftsmanship'],
    matchScore: 0,
    matchReasons: [],
    slug: 'shigeru-kawai-sk-ex',
    productUrl: '/pianos/grand/shigeru-kawai-sk-ex',
    brochureUrl: '/resources/brochures/sk-ex.pdf',
    videoUrl: 'https://www.youtube.com/watch?v=example-sk-ex',
    availableFinishes: ['Ebony Polish', 'Mahogany Polish'],
    dimensions: { length: 275, width: 155, height: 102 },
    weight: 480
  },
  {
    id: 'gx-3-grand',
    name: 'Kawai GX-3',
    model: 'GX-3',
    category: 'grand',
    priceRange: 'premium',
    msrp: 67900,
    image: null,
    shortDescription: '6\'2" grand piano offering professional performance in a versatile size',
    keyFeatures: [
      'Tapered solid spruce soundboard',
      'Millennium III Action',
      'Neotex keytops for enhanced grip',
      'Soft-close fallboard',
      'Premium German strings'
    ],
    features: ['concert-sound', 'premium-action', 'traditional-craftsmanship'],
    matchScore: 0,
    matchReasons: [],
    slug: 'kawai-gx-3',
    productUrl: '/pianos/grand/kawai-gx-3',
    brochureUrl: '/resources/brochures/gx-3.pdf',
    availableFinishes: ['Ebony Polish', 'Mahogany Polish', 'White Polish'],
    dimensions: { length: 188, width: 149, height: 102 },
    weight: 317
  },
  
  // Digital Pianos - Modern Solutions
  {
    id: 'ca901-digital',
    name: 'Kawai CA901',
    model: 'CA901',
    category: 'digital',
    priceRange: 'premium',
    msrp: 5999,
    image: null,
    shortDescription: 'Flagship digital piano with Grand Feel III action and premium sound',
    keyFeatures: [
      'Grand Feel III wooden key action',
      'SK-EX, SK-5, and EX concert grand samples',
      'TwinDrive soundboard speaker system',
      'Bluetooth® Audio and MIDI connectivity',
      'Large color touchscreen display'
    ],
    features: ['premium-action', 'concert-sound', 'bluetooth-audio', 'app-integration', 'recording-capability'],
    matchScore: 0,
    matchReasons: [],
    slug: 'kawai-ca901',
    productUrl: '/pianos/digital/kawai-ca901',
    brochureUrl: '/resources/brochures/ca901.pdf',
    videoUrl: 'https://www.youtube.com/watch?v=example-ca901',
    availableFinishes: ['Premium Rosewood', 'Premium Cherry', 'Satin Black', 'Satin White'],
    dimensions: { length: 145, width: 46, height: 88 },
    weight: 68
  },
  {
    id: 'ca701-digital',
    name: 'Kawai CA701',
    model: 'CA701',
    category: 'digital',
    priceRange: 'mid',
    msrp: 4199,
    image: null,
    shortDescription: 'Premium digital piano with Grand Feel III action in elegant cabinet',
    keyFeatures: [
      'Grand Feel III wooden key action',
      'SK-EX Rendering sound technology',
      'Onkyo speaker system',
      'Bluetooth® connectivity',
      'USB recording and playback'
    ],
    features: ['premium-action', 'concert-sound', 'bluetooth-audio', 'recording-capability'],
    matchScore: 0,
    matchReasons: [],
    slug: 'kawai-ca701',
    productUrl: '/pianos/digital/kawai-ca701',
    availableFinishes: ['Premium Rosewood', 'Satin Black', 'Satin White'],
    dimensions: { length: 136, width: 42, height: 85 },
    weight: 58
  },
  {
    id: 'cn201-digital',
    name: 'Kawai CN201',
    model: 'CN201',
    category: 'digital',
    priceRange: 'entry',
    msrp: 1999,
    image: null,
    shortDescription: 'Accessible digital piano with authentic touch and premium sounds',
    keyFeatures: [
      'Responsive Hammer Compact II action',
      'Harmonic Imaging XL sound technology',
      '88-key sampling from Shigeru Kawai concert grand',
      'Bluetooth® Audio functionality',
      'Integrated music stand and headphone hooks'
    ],
    features: ['bluetooth-audio', 'space-saving'],
    matchScore: 0,
    matchReasons: [],
    slug: 'kawai-cn201',
    productUrl: '/pianos/digital/kawai-cn201',
    availableFinishes: ['Satin Black', 'Satin White'],
    dimensions: { length: 133, width: 40, height: 81 },
    weight: 41
  },
  
  // Hybrid Pianos - Best of Both Worlds
  {
    id: 'novus-nv5-hybrid',
    name: 'Kawai Novus NV5',
    model: 'NV5',
    category: 'hybrid',
    priceRange: 'luxury',
    msrp: 7999,
    image: null,
    shortDescription: 'Revolutionary hybrid piano combining acoustic and digital technology',
    keyFeatures: [
      'Real acoustic piano action',
      'Acoustic and digital sound modes',
      'Silent practice capability',
      'Millennium III Upright Action',
      'Premium sound sampling technology'
    ],
    features: ['silent-system', 'premium-action', 'concert-sound', 'traditional-craftsmanship'],
    matchScore: 0,
    matchReasons: [],
    slug: 'kawai-novus-nv5',
    productUrl: '/pianos/hybrid/kawai-novus-nv5',
    brochureUrl: '/resources/brochures/novus-nv5.pdf',
    availableFinishes: ['Polished Ebony'],
    dimensions: { length: 149, width: 61, height: 130 },
    weight: 104
  },
  
  // Upright Pianos - Traditional Choice
  {
    id: 'k300-upright',
    name: 'Kawai K-300',
    model: 'K-300',
    category: 'upright',
    priceRange: 'mid',
    msrp: 8699,
    image: null,
    shortDescription: '48" professional upright piano with exceptional touch and tone',
    keyFeatures: [
      'Millennium III Upright Action',
      'Solid spruce soundboard',
      'Hard rock maple bridge',
      'Premium Neotex key surfaces',
      'Soft-close fallboard'
    ],
    features: ['premium-action', 'traditional-craftsmanship', 'space-saving'],
    matchScore: 0,
    matchReasons: [],
    slug: 'kawai-k-300',
    productUrl: '/pianos/upright/kawai-k-300',
    availableFinishes: ['Polished Ebony', 'Satin Mahogany', 'Satin Walnut'],
    dimensions: { length: 151, width: 61, height: 122 },
    weight: 227
  }
]

/**
 * Calculate piano recommendation match score based on assessment
 */
export function calculateMatchScore(
  piano: PianoRecommendation,
  assessment: AssessmentResponse
): number {
  let totalScore = 0
  let maxPossibleScore = 0
  
  // Identity matching
  const identityWeight = MATCHING_CRITERIA.identityWeights[assessment.musicalIdentity]
  totalScore += identityWeight * 100
  maxPossibleScore += 100
  
  // Aspirations matching  
  const aspirationWeight = MATCHING_CRITERIA.aspirationWeights[assessment.performanceAspirations]
  totalScore += aspirationWeight * 100
  maxPossibleScore += 100
  
  // Environment matching (influences category preference)
  const environmentWeight = MATCHING_CRITERIA.environmentWeights[assessment.acousticEnvironment]
  const categoryWeight = MATCHING_CRITERIA.categoryPreferences[piano.category]
  totalScore += (environmentWeight * categoryWeight) * 100
  maxPossibleScore += 100
  
  // Timeline urgency (doesn't affect match quality, but influences lead scoring)
  const timelineWeight = MATCHING_CRITERIA.timelineWeights[assessment.investmentTimeline]
  totalScore += timelineWeight * 50
  maxPossibleScore += 50
  
  // Aesthetic preference matching
  const aestheticWeight = MATCHING_CRITERIA.aestheticWeights[assessment.aestheticPreference]
  totalScore += aestheticWeight * 75
  maxPossibleScore += 75
  
  // Feature matching bonuses
  piano.features.forEach(feature => {
    const boost = MATCHING_CRITERIA.featureBoosts[feature] || 0
    totalScore += boost
    maxPossibleScore += boost
  })
  
  // Normalize score to 0-100 range
  const normalizedScore = Math.min(100, Math.round((totalScore / maxPossibleScore) * 100))
  return normalizedScore
}

/**
 * Generate match reasons based on assessment and piano features
 */
export function generateMatchReasons(
  piano: PianoRecommendation,
  assessment: AssessmentResponse
): string[] {
  const reasons: string[] = []
  
  // Musical identity reasons
  switch (assessment.musicalIdentity) {
    case 'beginning':
      if (piano.features.includes('bluetooth-audio')) {
        reasons.push('Perfect for learning with app integration and practice features')
      }
      if (piano.category === 'digital') {
        reasons.push('Digital convenience allows for flexible practice sessions')
      }
      break
    case 'professional':
      if (piano.features.includes('concert-sound')) {
        reasons.push('Concert-level sound quality meets professional standards')
      }
      if (piano.features.includes('premium-action')) {
        reasons.push('Premium action provides the responsiveness professionals demand')
      }
      break
    case 'family-legacy':
      if (piano.features.includes('traditional-craftsmanship')) {
        reasons.push('Traditional craftsmanship honors your family\'s musical heritage')
      }
      break
  }
  
  // Performance aspirations reasons
  switch (assessment.performanceAspirations) {
    case 'recording':
      if (piano.features.includes('recording-capability')) {
        reasons.push('Built-in recording capabilities perfect for content creation')
      }
      break
    case 'entertaining':
      if (piano.category === 'grand') {
        reasons.push('Grand piano presence creates stunning focal point for entertaining')
      }
      break
    case 'teaching':
      if (piano.features.includes('silent-system')) {
        reasons.push('Silent practice system allows flexible teaching schedules')
      }
      break
  }
  
  // Environment reasons
  switch (assessment.acousticEnvironment) {
    case 'cozy-living':
      if (piano.features.includes('space-saving')) {
        reasons.push('Compact design fits beautifully in intimate living spaces')
      }
      break
    case 'dedicated-music':
      if (piano.category === 'grand') {
        reasons.push('Dedicated music room allows this instrument to truly shine')
      }
      break
    case 'open-great-room':
      if (piano.features.includes('concert-sound')) {
        reasons.push('Powerful projection fills large, open spaces with rich sound')
      }
      break
  }
  
  // Aesthetic reasons
  if (assessment.aestheticPreference === 'classic-ebony' && 
      piano.availableFinishes?.includes('Ebony Polish')) {
    reasons.push('Available in classic ebony finish to match your aesthetic preference')
  }
  
  // Timeline-based urgency reasons
  if (assessment.investmentTimeline === 'ready-30-days') {
    reasons.push('Available for immediate delivery to meet your timeline')
  }
  
  return reasons
}

/**
 * Generate personalized piano recommendations based on assessment
 */
export function generateRecommendations(
  assessment: AssessmentResponse,
  availablePianos: PianoRecommendation[] = PIANO_DATABASE
): RecommendationSet {
  // Calculate match scores for all pianos
  const scoredPianos = availablePianos.map(piano => ({
    ...piano,
    matchScore: calculateMatchScore(piano, assessment),
    matchReasons: generateMatchReasons(piano, assessment)
  }))
  
  // Sort by match score
  const rankedPianos = scoredPianos.sort((a, b) => b.matchScore - a.matchScore)
  
  // Select recommendations
  const primary = rankedPianos[0]
  const alternatives = rankedPianos.slice(1, 4) // Top 3 alternatives
  const honorableMentions = rankedPianos.slice(4, 7) // Additional considerations
  
  // Calculate total score (weighted average)
  const totalScore = Math.round(
    (primary.matchScore * 0.6) + 
    (alternatives.reduce((sum, p) => sum + p.matchScore, 0) / alternatives.length * 0.4)
  )
  
  // Generate explanation summary
  const explanationSummary = generateExplanationSummary(primary, assessment)
  
  return {
    primary,
    alternatives,
    honorableMentions,
    totalScore,
    explanationSummary,
    assessmentId: assessment.sessionId || `assessment_${Date.now()}`,
    generatedAt: new Date()
  }
}

/**
 * Generate personalized explanation for recommendation
 */
function generateExplanationSummary(
  primaryRecommendation: PianoRecommendation,
  assessment: AssessmentResponse
): string {
  const identityContext = getIdentityContext(assessment.musicalIdentity)
  const aspirationContext = getAspirationContext(assessment.performanceAspirations)
  const environmentContext = getEnvironmentContext(assessment.acousticEnvironment)
  
  return `Based on your ${identityContext} and ${aspirationContext}, the ${primaryRecommendation.name} emerges as your ideal match. This ${primaryRecommendation.category} piano excels in ${environmentContext}, offering the perfect balance of ${primaryRecommendation.keyFeatures.slice(0, 2).join(' and ').toLowerCase()} that aligns with your musical vision.`
}

function getIdentityContext(identity: MusicalIdentity): string {
  switch (identity) {
    case 'beginning': return 'journey as a beginning pianist'
    case 'returning': return 'return to piano after time away'
    case 'active': return 'active musical practice'
    case 'professional': return 'professional musical pursuits'
    case 'family-legacy': return 'family\'s rich musical heritage'
    default: return 'musical journey'
  }
}

function getAspirationContext(aspirations: PerformanceAspirations): string {
  switch (aspirations) {
    case 'family-gatherings': return 'desire to bring music to family moments'
    case 'serious-practice': return 'commitment to serious musical development'
    case 'entertaining': return 'passion for entertaining and hosting'
    case 'recording': return 'focus on recording and content creation'
    case 'teaching': return 'dedication to teaching others'
    default: return 'musical aspirations'
  }
}

function getEnvironmentContext(environment: AcousticEnvironment): string {
  switch (environment) {
    case 'cozy-living': return 'intimate living spaces'
    case 'open-great-room': return 'expansive, open environments'
    case 'dedicated-music': return 'dedicated musical spaces'
    case 'formal-entertaining': return 'formal entertaining areas'
    case 'multiple-spaces': return 'versatile, multi-room settings'
    default: return 'your unique space'
  }
}

/**
 * Filter recommendations by budget and preferences
 */
export function filterRecommendations(
  recommendations: RecommendationSet,
  filters: {
    maxPrice?: number
    categories?: PianoCategory[]
    features?: PianoFeature[]
    finishes?: string[]
  }
): RecommendationSet {
  const filterPiano = (piano: PianoRecommendation): boolean => {
    if (filters.maxPrice && piano.msrp && piano.msrp > filters.maxPrice) return false
    if (filters.categories && !filters.categories.includes(piano.category)) return false
    if (filters.features && !filters.features.some(f => piano.features.includes(f))) return false
    if (filters.finishes && piano.availableFinishes && 
        !filters.finishes.some(f => piano.availableFinishes?.includes(f))) return false
    return true
  }
  
  return {
    ...recommendations,
    primary: filterPiano(recommendations.primary) ? recommendations.primary : recommendations.alternatives[0],
    alternatives: recommendations.alternatives.filter(filterPiano),
    honorableMentions: recommendations.honorableMentions.filter(filterPiano)
  }
}