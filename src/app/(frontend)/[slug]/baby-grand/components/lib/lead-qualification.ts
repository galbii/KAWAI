import type {
  AssessmentResponse,
  LeadQualification,
  LeadQuality,
  ContactInformation,
  MusicalIdentity,
  PerformanceAspirations,
  AcousticEnvironment,
  InvestmentTimeline,
  AestheticPreference,
  CollectionAccessLevel
} from '../types'

/**
 * Lead Qualification Scoring System
 * Comprehensive scoring algorithm for qualifying piano leads
 */

// Scoring weights for different qualification factors
export const QUALIFICATION_WEIGHTS = {
  // Assessment-based scoring (60% of total)
  identity: 15,         // Musical identity indicates seriousness
  aspirations: 20,      // Performance goals show commitment level
  environment: 10,      // Space readiness indicates purchase ability
  timeline: 25,         // Timeline urgency is critical for scoring
  aesthetic: 5,         // Aesthetic preferences show engagement
  access: 15,           // Conversion path preference indicates intent
  
  // Engagement-based scoring (25% of total)
  timeSpent: 10,        // Time spent in assessment
  completionRate: 8,    // Assessment completion indicates serious intent
  deviceType: 2,        // Desktop vs mobile engagement patterns
  
  // Contact quality scoring (15% of total)
  emailDomain: 3,       // Professional vs personal email domains
  phoneProvided: 5,     // Phone number indicates higher intent
  locationProvided: 2,  // Geographic data for follow-up
  optInMarketing: 5     // Marketing opt-in shows ongoing interest
} as const

/**
 * Musical Identity scoring - indicates seriousness and expertise level
 */
export function scoreMusicalIdentity(identity: MusicalIdentity): number {
  const scores = {
    'professional': 100,      // Highest priority - likely to purchase quality instruments
    'active': 85,            // Regular players need good instruments
    'family-legacy': 90,     // Family tradition indicates long-term commitment
    'returning': 75,         // Returning players often upgrade instruments
    'beginning': 60          // Beginners may start with entry-level instruments
  }
  
  return scores[identity] || 60
}

/**
 * Performance Aspirations scoring - commitment and investment level
 */
export function scorePerformanceAspirations(aspirations: PerformanceAspirations): number {
  const scores = {
    'recording': 100,        // Professional use, highest budget potential
    'teaching': 95,          // Professionals need quality instruments
    'serious-practice': 90,  // Dedicated players invest in good pianos
    'entertaining': 75,      // Social use indicates regular engagement
    'family-gatherings': 65  // Casual use, potentially lower budget
  }
  
  return scores[aspirations] || 65
}

/**
 * Acoustic Environment scoring - space readiness and purchasing power
 */
export function scoreAcousticEnvironment(environment: AcousticEnvironment): number {
  const scores = {
    'dedicated-music': 100,      // Dedicated space shows serious commitment
    'formal-entertaining': 90,   // Formal areas suggest higher budget
    'open-great-room': 80,      // Large spaces allow for bigger instruments
    'multiple-spaces': 75,      // Multiple locations suggest affluence
    'cozy-living': 60          // Smaller space may limit options
  }
  
  return scores[environment] || 60
}

/**
 * Investment Timeline scoring - urgency and decision readiness
 */
export function scoreInvestmentTimeline(timeline: InvestmentTimeline): number {
  const scores = {
    'ready-30-days': 100,        // Immediate purchase intent - hot lead
    'exploring-2-6-months': 85,  // Active shopping phase - warm lead
    'planning-this-year': 65,    // Medium-term planning - warm lead
    'beginning-research': 40     // Early research - nurture lead
  }
  
  return scores[timeline] || 40
}

/**
 * Aesthetic Preference scoring - engagement level
 */
export function scoreAestheticPreference(preference: AestheticPreference): number {
  const scores = {
    'experience-differences': 100,  // Wants to see options - high engagement
    'classic-ebony': 80,           // Specific preference shows research
    'rich-mahogany': 80,           // Specific preference shows research  
    'contemporary-white': 80       // Specific preference shows research
  }
  
  return scores[preference] || 70
}

/**
 * Collection Access Level scoring - conversion intent
 */
export function scoreCollectionAccessLevel(access: CollectionAccessLevel): number {
  const scores = {
    'private-viewing': 100,        // In-person viewing shows highest intent
    'both': 90,                   // Wants multiple touchpoints
    'curated-recommendations': 70  // Digital-first approach
  }
  
  return scores[access] || 70
}

/**
 * Engagement scoring based on session behavior
 */
export function scoreEngagement(data: {
  timeSpent: number // minutes
  completionRate: number // 0-100
  deviceType: 'desktop' | 'mobile' | 'tablet'
  sourceChannel?: string
}): number {
  let score = 0
  
  // Time spent scoring (higher engagement = higher score)
  if (data.timeSpent >= 10) score += 100
  else if (data.timeSpent >= 7) score += 80
  else if (data.timeSpent >= 5) score += 60
  else if (data.timeSpent >= 3) score += 40
  else score += 20
  
  // Completion rate scoring
  score += data.completionRate
  
  // Device type scoring (desktop users often more serious)
  const deviceScores = {
    'desktop': 100,
    'tablet': 85,
    'mobile': 70
  }
  score += (deviceScores[data.deviceType] - 85) * 0.5 // Weighted adjustment
  
  return Math.min(100, score / 2) // Normalize to 0-100
}

/**
 * Contact quality scoring
 */
export function scoreContactQuality(contact: Partial<ContactInformation>): number {
  let score = 0
  
  // Email domain scoring
  if (contact.email) {
    const domain = contact.email.split('@')[1]
    const professionalDomains = ['gmail.com', 'outlook.com', 'yahoo.com', 'icloud.com']
    const businessPatterns = ['.edu', '.gov', '.org', '.com']

    if (domain && !professionalDomains.includes(domain)) {
      // Likely business or custom domain
      score += 80
    } else if (domain) {
      // Consumer email
      score += 60
    }
  }
  
  // Phone provided scoring
  if (contact.phone) {
    score += 90
  } else {
    score += 30
  }
  
  // Location/ZIP provided scoring
  if (contact.zipCode) {
    score += 70
  } else {
    score += 50
  }
  
  // Marketing opt-in scoring
  if (contact.optInMarketing) {
    score += 80
  } else {
    score += 40
  }
  
  return score / 4 // Average the components
}

/**
 * Calculate comprehensive lead qualification score
 */
export function calculateLeadScore(
  assessment: AssessmentResponse,
  engagementData?: {
    timeSpent: number
    completionRate: number
    deviceType: 'desktop' | 'mobile' | 'tablet'
    sourceChannel?: string
  },
  contactData?: Partial<ContactInformation>
): LeadQualification {
  
  // Assessment-based scoring (60% weight)
  const identityScore = scoreMusicalIdentity(assessment.musicalIdentity)
  const aspirationScore = assessment.performanceAspirations ? scorePerformanceAspirations(assessment.performanceAspirations) : 0
  const environmentScore = assessment.acousticEnvironment ? scoreAcousticEnvironment(assessment.acousticEnvironment) : 0
  const timelineScore = scoreInvestmentTimeline(assessment.investmentTimeline)
  const aestheticScore = assessment.aestheticPreference ? scoreAestheticPreference(assessment.aestheticPreference) : 0
  const accessScore = assessment.collectionAccessLevel ? scoreCollectionAccessLevel(assessment.collectionAccessLevel) : 0
  
  const assessmentScore = (
    (identityScore * QUALIFICATION_WEIGHTS.identity) +
    (aspirationScore * QUALIFICATION_WEIGHTS.aspirations) +
    (environmentScore * QUALIFICATION_WEIGHTS.environment) +
    (timelineScore * QUALIFICATION_WEIGHTS.timeline) +
    (aestheticScore * QUALIFICATION_WEIGHTS.aesthetic) +
    (accessScore * QUALIFICATION_WEIGHTS.access)
  ) / (QUALIFICATION_WEIGHTS.identity + QUALIFICATION_WEIGHTS.aspirations + 
       QUALIFICATION_WEIGHTS.environment + QUALIFICATION_WEIGHTS.timeline + 
       QUALIFICATION_WEIGHTS.aesthetic + QUALIFICATION_WEIGHTS.access)
  
  // Engagement-based scoring (25% weight)
  const engagementScore = engagementData ? scoreEngagement(engagementData) : 70
  
  // Contact quality scoring (15% weight)
  const contactScore = contactData ? scoreContactQuality(contactData) : 60
  
  // Combined weighted score
  const totalScore = Math.round(
    (assessmentScore * 0.60) + 
    (engagementScore * 0.25) + 
    (contactScore * 0.15)
  )
  
  // Readiness score (focused on timeline and engagement)
  const readinessScore = Math.round(
    (timelineScore * 0.7) + 
    (engagementScore * 0.3)
  )
  
  // Budget qualification
  const budgetQualified = determineBudgetQualification(assessment, contactData)
  
  // Timeline qualification
  const timelineQualified = assessment.investmentTimeline === 'ready-30-days' || 
                           assessment.investmentTimeline === 'exploring-2-6-months'
  
  // Engagement level
  const engagementLevel = getEngagementLevel(engagementScore)
  
  // Lead quality determination
  const quality = determineLeadQuality(totalScore, readinessScore, budgetQualified, timelineQualified)
  
  // Follow-up priority (1-5 scale)
  const followUpPriority = calculateFollowUpPriority(quality, assessment.investmentTimeline, assessment.collectionAccessLevel || 'curated-recommendations')

  // Preferred contact method
  const preferredContact = contactData?.preferredContact ||
    (assessment.collectionAccessLevel === 'private-viewing' ? 'phone' : 'email')
  
  return {
    quality,
    score: totalScore,
    readinessScore,
    budgetQualified,
    timelineQualified,
    engagementLevel,
    preferredContact,
    followUpPriority,
    assignedConsultant: assignConsultant(assessment, quality),
    notes: generateQualificationNotes(assessment, totalScore, engagementData)
  }
}

/**
 * Determine budget qualification based on assessment signals
 */
function determineBudgetQualification(
  assessment: AssessmentResponse, 
  contact?: Partial<ContactInformation>
): boolean {
  // High-budget indicators
  const highBudgetSignals = [
    assessment.musicalIdentity === 'professional',
    assessment.performanceAspirations === 'recording',
    assessment.performanceAspirations === 'teaching',
    assessment.acousticEnvironment === 'dedicated-music',
    assessment.acousticEnvironment === 'formal-entertaining',
    assessment.aestheticPreference !== 'experience-differences' // Specific preferences often indicate research
  ]
  
  const positiveSignals = highBudgetSignals.filter(Boolean).length
  
  // Professional email domain adds weight
  if (contact?.email) {
    const domain = contact.email.split('@')[1]
    if (domain && !['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com'].includes(domain)) {
      return positiveSignals >= 2
    }
  }
  
  return positiveSignals >= 3
}

/**
 * Get engagement level from engagement score
 */
function getEngagementLevel(engagementScore: number): 'low' | 'medium' | 'high' {
  if (engagementScore >= 80) return 'high'
  if (engagementScore >= 60) return 'medium'
  return 'low'
}

/**
 * Determine overall lead quality
 */
function determineLeadQuality(
  totalScore: number,
  readinessScore: number,
  budgetQualified: boolean,
  timelineQualified: boolean
): LeadQuality {
  // Hot leads: High score + ready to buy + budget qualified
  if (totalScore >= 85 && readinessScore >= 80 && budgetQualified && timelineQualified) {
    return 'hot'
  }
  
  // Warm leads: Good score + some urgency OR high engagement
  if (totalScore >= 70 && (readinessScore >= 60 || budgetQualified)) {
    return 'warm'
  }
  
  // Nurture leads: Moderate engagement but longer timeline
  if (totalScore >= 50) {
    return 'nurture'
  }
  
  // Cold leads: Low engagement/scores
  return 'cold'
}

/**
 * Calculate follow-up priority (1 = highest, 5 = lowest)
 */
function calculateFollowUpPriority(
  quality: LeadQuality,
  timeline: InvestmentTimeline,
  access: CollectionAccessLevel
): 1 | 2 | 3 | 4 | 5 {
  // Priority modifiers
  const qualityPriority = {
    'hot': 1,
    'warm': 2,
    'nurture': 3,
    'cold': 4
  }
  
  const timelinePriority = {
    'ready-30-days': 1,
    'exploring-2-6-months': 2,
    'planning-this-year': 3,
    'beginning-research': 4
  }
  
  const accessPriority = {
    'private-viewing': 1,
    'both': 2,
    'curated-recommendations': 3
  }
  
  const avgPriority = (
    qualityPriority[quality] + 
    timelinePriority[timeline] + 
    accessPriority[access]
  ) / 3
  
  return Math.ceil(avgPriority) as 1 | 2 | 3 | 4 | 5
}

/**
 * Assign consultant based on assessment and lead quality
 */
function assignConsultant(assessment: AssessmentResponse, quality: LeadQuality): string {
  // Hot leads get senior consultants
  if (quality === 'hot') {
    if (assessment.musicalIdentity === 'professional' || 
        assessment.performanceAspirations === 'recording') {
      return 'Senior Piano Specialist'
    }
    return 'Senior Consultant'
  }
  
  // Warm leads get standard consultants
  if (quality === 'warm') {
    return 'Piano Consultant'
  }
  
  // Nurture and cold leads can be handled by junior staff or automation
  return 'Junior Consultant'
}

/**
 * Generate qualification notes for CRM
 */
function generateQualificationNotes(
  assessment: AssessmentResponse,
  score: number,
  engagement?: { timeSpent: number; deviceType: string; sourceChannel?: string }
): string[] {
  const notes: string[] = []
  
  // Score-based notes
  if (score >= 90) {
    notes.push('Excellent lead quality - high priority follow-up')
  } else if (score >= 75) {
    notes.push('Strong lead potential - good conversion candidate')
  } else if (score >= 60) {
    notes.push('Moderate lead quality - nurture with valuable content')
  } else {
    notes.push('Early-stage lead - focus on education and relationship building')
  }
  
  // Assessment-specific insights
  if (assessment.musicalIdentity === 'professional') {
    notes.push('Professional musician - emphasize performance features and quality')
  }
  
  if (assessment.investmentTimeline === 'ready-30-days') {
    notes.push('Ready to purchase within 30 days - prioritize immediate follow-up')
  }
  
  if (assessment.collectionAccessLevel === 'private-viewing') {
    notes.push('Prefers in-person experience - schedule showroom appointment')
  }
  
  if (assessment.performanceAspirations === 'recording') {
    notes.push('Recording focus - highlight technical specifications and sound quality')
  }
  
  // Engagement-based notes
  if (engagement?.timeSpent && engagement.timeSpent >= 10) {
    notes.push('High engagement - spent significant time on assessment')
  }
  
  if (engagement?.deviceType === 'desktop') {
    notes.push('Desktop user - likely serious researcher with focused intent')
  }
  
  return notes
}

/**
 * Get recommended follow-up actions based on qualification
 */
export function getRecommendedActions(qualification: LeadQualification): string[] {
  const actions: string[] = []
  
  switch (qualification.quality) {
    case 'hot':
      actions.push('Immediate phone call within 2 hours')
      actions.push('Send personalized video message')
      actions.push('Schedule private consultation')
      actions.push('Prepare detailed proposal')
      break
      
    case 'warm':
      actions.push('Email follow-up within 24 hours')
      actions.push('Send detailed product information')
      actions.push('Invite to virtual or in-person consultation')
      actions.push('Add to weekly follow-up sequence')
      break
      
    case 'nurture':
      actions.push('Add to monthly newsletter')
      actions.push('Send educational content about piano selection')
      actions.push('Invite to piano events and workshops')
      actions.push('Quarterly check-in calls')
      break
      
    case 'cold':
      actions.push('Add to general email list')
      actions.push('Send basic introductory materials')
      actions.push('Semi-annual follow-up')
      break
  }
  
  return actions
}

/**
 * Calculate lifetime value prediction based on qualification
 */
export function predictLifetimeValue(
  assessment: AssessmentResponse,
  qualification: LeadQualification
): { estimated: number; confidence: 'low' | 'medium' | 'high' } {
  let baseValue = 15000 // Average piano purchase
  let confidence: 'low' | 'medium' | 'high' = 'medium'
  
  // Identity-based adjustments
  const identityMultipliers = {
    'professional': 2.5,
    'family-legacy': 2.0,
    'active': 1.5,
    'returning': 1.2,
    'beginning': 0.8
  }
  
  baseValue *= identityMultipliers[assessment.musicalIdentity]
  
  // Aspiration-based adjustments
  if (assessment.performanceAspirations === 'recording') {
    baseValue *= 1.8
    confidence = 'high'
  } else if (assessment.performanceAspirations === 'teaching') {
    baseValue *= 1.5
  }
  
  // Environment-based adjustments
  if (assessment.acousticEnvironment === 'dedicated-music') {
    baseValue *= 1.4
  } else if (assessment.acousticEnvironment === 'formal-entertaining') {
    baseValue *= 1.3
  }
  
  // Quality-based adjustments
  const qualityMultipliers = {
    'hot': 1.3,
    'warm': 1.1,
    'nurture': 0.9,
    'cold': 0.7
  }
  
  baseValue *= qualityMultipliers[qualification.quality]
  
  // Confidence adjustments
  if (qualification.score >= 85) confidence = 'high'
  else if (qualification.score < 60) confidence = 'low'
  
  return {
    estimated: Math.round(baseValue),
    confidence
  }
}

export default {
  calculateLeadScore,
  getRecommendedActions,
  predictLifetimeValue,
  QUALIFICATION_WEIGHTS
}