// Marketing domain types - Campaign and lead generation management
// Types for marketing campaigns, lead qualification, and conversion optimization

import type { Media } from '@/payload-types'
import type { UserId } from '@/types/common/utils'
import type { CustomerPreferences } from './piano'
import type { Timestamps } from '@/types/common/utils'

// Campaign management types
export interface MarketingCampaign extends Timestamps {
  id: string
  name: string
  description: string
  type: CampaignType
  status: CampaignStatus
  targeting: CampaignTargeting
  content: CampaignContent
  budget: CampaignBudget
  schedule: CampaignSchedule
  performance: CampaignPerformance
  automation: CampaignAutomation
}

export type CampaignType =
  | 'brand-awareness'
  | 'lead-generation'
  | 'conversion'
  | 'retention'
  | 'event-promotion'
  | 'product-launch'
  | 'seasonal'
  | 'remarketing'

export type CampaignStatus =
  | 'draft'
  | 'scheduled'
  | 'active'
  | 'paused'
  | 'completed'
  | 'cancelled'
  | 'archived'

// Campaign targeting and segmentation
export interface CampaignTargeting {
  audience: AudienceSegment
  geographic: GeographicTargeting
  demographic: DemographicTargeting
  behavioral: BehavioralTargeting
  psychographic: PsychographicTargeting
  exclusions?: TargetingExclusions
}

export interface AudienceSegment {
  name: string
  size: number
  description: string
  criteria: SegmentCriteria
  priority: 'high' | 'medium' | 'low'
}

export interface SegmentCriteria {
  customerStage: ('prospect' | 'lead' | 'customer' | 'advocate')[]
  engagement: ('high' | 'medium' | 'low' | 'inactive')[]
  purchaseHistory: {
    hasUrgency?: boolean
    timeframe?: 'recent' | 'past-year' | 'historical'
    categories?: string[]
  }
  interactions: {
    website: boolean
    email: boolean
    social: boolean
    events: boolean
    showroom: boolean
  }
}

export interface GeographicTargeting {
  countries: string[]
  regions: string[]
  cities: string[]
  postalCodes: string[]
  radius?: {
    center: {
      latitude: number
      longitude: number
    }
    miles: number
  }
  dealerTerritories?: string[]
}

export interface DemographicTargeting {
  ageRange?: {
    min: number
    max: number
  }
  income?: {
    min: number
    max: number
    currency: string
  }
  education?: ('high-school' | 'college' | 'graduate' | 'post-graduate')[]
  occupation?: string[]
  householdSize?: {
    min: number
    max: number
  }
  parentalStatus?: ('parent' | 'not-parent' | 'expecting')[]
}

export interface BehavioralTargeting {
  websiteBehavior: {
    pagesVisited: string[]
    timeOnSite?: {
      min: number // seconds
      max?: number
    }
    frequency?: 'first-time' | 'returning' | 'frequent'
  }
  purchaseBehavior: {
    priceRange?: string[]
    categories?: string[]
    frequency?: 'first-time' | 'repeat' | 'high-value'
    timing?: 'recent' | 'seasonal' | 'planned'
  }
  engagement: {
    emailOpens: boolean
    clickThroughs: boolean
    socialInteraction: boolean
    eventAttendance: boolean
  }
}

export interface PsychographicTargeting {
  interests: string[]
  lifestyle: string[]
  values: string[]
  personality: string[]
  musicGenres?: string[]
  pianoExperience?: ('beginner' | 'intermediate' | 'advanced' | 'professional')[]
  motivations?: ('learning' | 'performance' | 'teaching' | 'enjoyment' | 'investment')[]
}

export interface TargetingExclusions {
  existingCustomers?: boolean
  recentPurchasers?: {
    enabled: boolean
    timeframe: number // days
  }
  competitors?: boolean
  unsubscribed?: boolean
  bounced?: boolean
  complained?: boolean
}

// Campaign content and creative
export interface CampaignContent {
  creative: CampaignCreative
  messaging: CampaignMessaging
  assets: CampaignAssets
  variants: CampaignVariant[]
  personalization: PersonalizationSettings
}

export interface CampaignCreative {
  theme: string
  visualStyle: {
    colors: string[]
    fonts: string[]
    imagery: 'lifestyle' | 'product' | 'artistic' | 'technical'
    mood: 'elegant' | 'modern' | 'traditional' | 'inspiring'
  }
  format: CreativeFormat[]
  dimensions: CreativeDimensions[]
}

export type CreativeFormat =
  | 'static-image'
  | 'animated-gif'
  | 'video'
  | 'carousel'
  | 'slideshow'
  | 'interactive'

export interface CreativeDimensions {
  name: string
  width: number
  height: number
  aspectRatio: string
  platform: string[]
}

export interface CampaignMessaging {
  headline: string
  subheadline?: string
  bodyText: string
  callToAction: CallToAction
  valueProposition: string
  benefits: string[]
  socialProof?: SocialProof
  urgency?: UrgencyMessaging
}

export interface CallToAction {
  primary: {
    text: string
    action: CTAAction
    destination: string
  }
  secondary?: {
    text: string
    action: CTAAction
    destination: string
  }
}

export type CTAAction =
  | 'visit-showroom'
  | 'schedule-consultation'
  | 'download-guide'
  | 'watch-demo'
  | 'request-quote'
  | 'call-now'
  | 'learn-more'
  | 'start-trial'

export interface SocialProof {
  type: 'testimonial' | 'review' | 'statistic' | 'award' | 'endorsement'
  content: string
  source?: string
  rating?: number
  image?: Media | string
}

export interface UrgencyMessaging {
  type: 'limited-time' | 'limited-quantity' | 'seasonal' | 'exclusive'
  message: string
  expirationDate?: Date | string
  countdown?: boolean
}

export interface CampaignAssets {
  images: Media[]
  videos: Media[]
  audio?: Media[]
  documents?: Media[]
  logos: Media[]
  backgrounds: Media[]
}

export interface CampaignVariant {
  id: string
  name: string
  description: string
  audience: string
  content: Partial<CampaignContent>
  performance?: VariantPerformance
  status: 'draft' | 'active' | 'paused' | 'winner' | 'loser'
}

export interface VariantPerformance {
  impressions: number
  clicks: number
  conversions: number
  engagementRate: number
  conversionRate: number
  cost: number
  revenue: number
  confidence: number // statistical confidence
}

export interface PersonalizationSettings {
  enabled: boolean
  rules: PersonalizationRule[]
  defaultContent: string
  testing: {
    enabled: boolean
    variants: number
    trafficSplit: number[] // percentages
  }
}

export interface PersonalizationRule {
  condition: PersonalizationCondition
  content: PersonalizedContent
  priority: number
}

export interface PersonalizationCondition {
  segment?: string
  behavior?: string
  demographics?: Record<string, any>
  location?: string
  device?: 'mobile' | 'tablet' | 'desktop'
  timeOfDay?: string
  dayOfWeek?: string
}

export interface PersonalizedContent {
  headline?: string
  image?: Media | string
  ctaText?: string
  offer?: string
  message?: string
}

// Campaign budget and ROI tracking
export interface CampaignBudget {
  total: number
  spent: number
  remaining: number
  currency: string
  allocation: BudgetAllocation
  bidding: BiddingStrategy
  tracking: BudgetTracking
}

export interface BudgetAllocation {
  channels: Record<string, number> // channel -> percentage
  geographies: Record<string, number>
  audiences: Record<string, number>
  timeperiods: Record<string, number>
}

export interface BiddingStrategy {
  type: 'manual' | 'automatic' | 'target-cpa' | 'target-roas' | 'maximize-clicks'
  targetCPA?: number // cost per acquisition
  targetROAS?: number // return on ad spend
  maxCPC?: number // max cost per click
  dayparting?: {
    enabled: boolean
    schedule: DaypartSchedule[]
  }
}

export interface DaypartSchedule {
  dayOfWeek: number // 0-6, Sunday = 0
  startTime: string // "09:00"
  endTime: string // "17:00"
  bidAdjustment: number // percentage modifier
}

export interface BudgetTracking {
  dailySpend: Record<string, number> // date -> amount
  channelSpend: Record<string, number>
  alerts: BudgetAlert[]
  pacing: {
    status: 'on-track' | 'overspend' | 'underspend'
    projectedTotal: number
    daysRemaining: number
  }
}

export interface BudgetAlert {
  type: 'budget-threshold' | 'daily-limit' | 'performance-decline'
  threshold: number
  triggered: boolean
  lastTriggered?: Date | string
  recipients: string[] // email addresses
}

// Campaign scheduling and automation
export interface CampaignSchedule {
  startDate: Date | string
  endDate?: Date | string
  timezone: string
  dayparting?: DaypartSchedule[]
  frequency: FrequencyCapping
  seasonal?: SeasonalScheduling
}

export interface FrequencyCapping {
  impressions?: {
    max: number
    period: 'hour' | 'day' | 'week' | 'month'
  }
  clicks?: {
    max: number
    period: 'hour' | 'day' | 'week' | 'month'
  }
  conversions?: {
    max: number
    period: 'day' | 'week' | 'month'
  }
}

export interface SeasonalScheduling {
  events: SeasonalEvent[]
  adjustments: SeasonalAdjustment[]
}

export interface SeasonalEvent {
  name: string
  startDate: Date | string
  endDate: Date | string
  budgetMultiplier: number
  contentVariant?: string
}

export interface SeasonalAdjustment {
  period: 'back-to-school' | 'holiday' | 'summer' | 'spring' | 'wedding-season'
  budgetAdjustment: number // percentage
  bidAdjustment: number // percentage
  contentFocus: string[]
}

// Campaign automation and workflows
export interface CampaignAutomation {
  triggers: AutomationTrigger[]
  workflows: AutomationWorkflow[]
  rules: AutomationRule[]
  integrations: AutomationIntegration[]
}

export interface AutomationTrigger {
  id: string
  name: string
  type: TriggerType
  conditions: TriggerCondition[]
  actions: AutomationAction[]
  enabled: boolean
}

export type TriggerType =
  | 'user-behavior'
  | 'performance-metric'
  | 'time-based'
  | 'external-event'
  | 'lead-score'

export interface TriggerCondition {
  field: string
  operator: 'equals' | 'greater-than' | 'less-than' | 'contains' | 'not-equals'
  value: any
  timeframe?: {
    amount: number
    unit: 'minutes' | 'hours' | 'days' | 'weeks'
  }
}

export interface AutomationAction {
  type: ActionType
  parameters: Record<string, any>
  delay?: {
    amount: number
    unit: 'minutes' | 'hours' | 'days'
  }
}

export type ActionType =
  | 'send-email'
  | 'create-task'
  | 'update-lead-score'
  | 'assign-to-sales'
  | 'add-to-sequence'
  | 'pause-campaign'
  | 'adjust-budget'
  | 'send-notification'

export interface AutomationWorkflow {
  id: string
  name: string
  description: string
  steps: WorkflowStep[]
  status: 'active' | 'inactive' | 'draft'
  metrics: WorkflowMetrics
}

export interface WorkflowStep {
  id: string
  name: string
  type: 'trigger' | 'condition' | 'action' | 'delay'
  configuration: Record<string, any>
  connections: string[] // IDs of next steps
}

export interface WorkflowMetrics {
  enrollments: number
  completions: number
  dropoffPoints: Record<string, number> // step ID -> dropoff count
  averageCompletionTime: number // hours
  conversionRate: number
}

export interface AutomationRule {
  id: string
  name: string
  condition: string // human-readable rule
  action: string // human-readable action
  enabled: boolean
  priority: number
}

export interface AutomationIntegration {
  service: string
  type: 'crm' | 'email' | 'analytics' | 'advertising' | 'social'
  configuration: Record<string, any>
  status: 'connected' | 'disconnected' | 'error'
  lastSync?: Date | string
}

// Lead management and qualification
export interface MarketingLead extends Timestamps {
  id: string
  source: LeadSource
  contact: LeadContact
  qualification: LeadQualification
  preferences: CustomerPreferences
  journey: LeadJourney
  scoring: LeadScoring
  assignment: LeadAssignment
  status: LeadStatus
}

export interface LeadSource {
  channel: 'organic-search' | 'paid-search' | 'social-media' | 'referral' | 'direct' | 'email' | 'offline'
  campaign?: string
  medium: string
  source: string
  content?: string
  term?: string
  firstTouch: Date | string
  lastTouch: Date | string
}

export interface LeadContact {
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
  preferredContact: 'email' | 'phone' | 'text'
  timezone?: string
  languagePreference?: string
}

export interface LeadQualification {
  budget: {
    range?: string
    confirmed: boolean
    financing: boolean
  }
  timeline: {
    urgency: 'immediate' | 'within-month' | 'within-quarter' | 'research-phase'
    flexibility: 'flexible' | 'fixed' | 'urgent'
  }
  authority: {
    decisionMaker: boolean
    influences: string[]
    approval: 'self' | 'spouse' | 'family' | 'committee'
  }
  need: {
    primary: string
    secondary: string[]
    painPoints: string[]
    solutions: string[]
  }
}

export interface LeadJourney {
  touchpoints: Touchpoint[]
  stages: JourneyStage[]
  currentStage: string
  progression: StageProgression[]
  milestones: Milestone[]
}

export interface Touchpoint {
  date: Date | string
  channel: string
  type: 'visit' | 'email' | 'call' | 'form' | 'download' | 'demo' | 'meeting'
  details: string
  engagement: number // 1-10 scale
  outcome: 'positive' | 'neutral' | 'negative'
  notes?: string
}

export interface JourneyStage {
  name: string
  description: string
  entryDate?: Date | string
  exitDate?: Date | string
  duration?: number // days
  actions: string[]
  nextStages: string[]
}

export interface StageProgression {
  from: string
  to: string
  date: Date | string
  trigger: string
  automatic: boolean
}

export interface Milestone {
  name: string
  description: string
  achievedDate: Date | string
  value: number
  category: 'engagement' | 'qualification' | 'conversion'
}

// Lead scoring system
export interface LeadScoring {
  totalScore: number
  maxScore: number
  breakdown: ScoreBreakdown
  history: ScoreHistory[]
  thresholds: ScoreThresholds
  lastUpdated: Date | string
}

export interface ScoreBreakdown {
  demographic: number
  behavioral: number
  engagement: number
  qualification: number
  recency: number
}

export interface ScoreHistory {
  date: Date | string
  score: number
  change: number
  reason: string
  category: string
}

export interface ScoreThresholds {
  cold: number // 0-30
  warm: number // 31-60
  hot: number // 61-80
  qualified: number // 81-100
}

// Lead assignment and routing
export interface LeadAssignment {
  assignedTo?: UserId
  assignedDate?: Date | string
  assignmentRules: AssignmentRule[]
  queue: AssignmentQueue
  history: AssignmentHistory[]
}

export interface AssignmentRule {
  priority: number
  conditions: Record<string, any>
  assignee: UserId
  capacity?: number
  active: boolean
}

export interface AssignmentQueue {
  position?: number
  estimatedWaitTime?: number // hours
  lastUpdated: Date | string
}

export interface AssignmentHistory {
  date: Date | string
  from?: UserId
  to?: UserId
  reason: 'initial' | 'reassignment' | 'escalation' | 'distribution'
  notes?: string
}

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'opportunity'
  | 'proposal'
  | 'negotiation'
  | 'closed-won'
  | 'closed-lost'
  | 'nurture'
  | 'unqualified'

// Marketing performance and analytics
export interface CampaignPerformance {
  metrics: PerformanceMetrics
  attribution: AttributionAnalysis
  audience: AudienceInsights
  optimization: OptimizationRecommendations
  reporting: PerformanceReporting
}

export interface PerformanceMetrics {
  reach: {
    impressions: number
    uniqueReach: number
    frequency: number
  }
  engagement: {
    clicks: number
    clickThroughRate: number
    engagements: number
    engagementRate: number
  }
  conversion: {
    leads: number
    opportunities: number
    sales: number
    revenue: number
    conversionRate: number
  }
  cost: {
    totalSpend: number
    costPerClick: number
    costPerLead: number
    costPerAcquisition: number
    returnOnAdSpend: number
  }
  quality: {
    leadQuality: number
    salesVelocity: number
    customerLifetimeValue: number
  }
}

export interface AttributionAnalysis {
  model: 'first-touch' | 'last-touch' | 'linear' | 'time-decay' | 'position-based'
  touchpoints: AttributionTouchpoint[]
  conversion: AttributionConversion[]
  influence: InfluenceScore[]
}

export interface AttributionTouchpoint {
  channel: string
  campaign: string
  touchpoint: number
  credit: number // percentage
  value: number
}

export interface AttributionConversion {
  leadId: string
  path: string[]
  duration: number // days
  touchpoints: number
  value: number
}

export interface InfluenceScore {
  channel: string
  directInfluence: number
  assistedInfluence: number
  totalInfluence: number
}

export interface AudienceInsights {
  demographics: DemographicInsights
  behavior: BehaviorInsights
  engagement: EngagementInsights
  preferences: PreferenceInsights
}

export interface DemographicInsights {
  age: Record<string, number>
  gender: Record<string, number>
  income: Record<string, number>
  location: Record<string, number>
}

export interface BehaviorInsights {
  timeOfDay: Record<string, number>
  dayOfWeek: Record<string, number>
  device: Record<string, number>
  browserInteraction: Record<string, number>
}

export interface EngagementInsights {
  contentTypes: Record<string, number>
  messageResonance: Record<string, number>
  callToActionPerformance: Record<string, number>
}

export interface PreferenceInsights {
  pianoTypes: Record<string, number>
  priceRanges: Record<string, number>
  features: Record<string, number>
  motivations: Record<string, number>
}

export interface OptimizationRecommendations {
  priority: 'high' | 'medium' | 'low'
  recommendations: Recommendation[]
  testingOpportunities: TestingOpportunity[]
  budgetOptimization: BudgetOptimization
}

export interface Recommendation {
  category: 'targeting' | 'creative' | 'bidding' | 'timing' | 'budget'
  suggestion: string
  rationale: string
  expectedImpact: 'high' | 'medium' | 'low'
  effort: 'high' | 'medium' | 'low'
  confidence: number // percentage
}

export interface TestingOpportunity {
  element: 'headline' | 'image' | 'cta' | 'audience' | 'bidding'
  hypothesis: string
  testDesign: string
  successMetrics: string[]
  estimatedDuration: number // days
}

export interface BudgetOptimization {
  currentAllocation: Record<string, number>
  recommendedAllocation: Record<string, number>
  expectedImprovement: number // percentage
  riskLevel: 'low' | 'medium' | 'high'
}

export interface PerformanceReporting {
  frequency: 'daily' | 'weekly' | 'monthly'
  recipients: string[]
  metrics: string[]
  format: 'dashboard' | 'email' | 'pdf' | 'api'
  automation: {
    enabled: boolean
    triggers: string[]
    conditions: Record<string, any>
  }
}