// Dealer domain types - Multi-tenant dealer management
// Types for dealer locations, campaigns, and regional customization

import type { Storefront, Media } from '@/payload-types'
import type { DealerSlug, UserId } from '@/types/common/utils'
import type { PianoProduct } from './piano'
import type { Timestamps } from '@/types/common/utils'

// Enhanced storefront location with business logic
export interface EnhancedStorefront extends Omit<Storefront, 'createdAt' | 'updatedAt'>, Timestamps {
  id: string
  slug: DealerSlug
  businessDetails: DealerBusinessDetails
  inventory: DealerInventory
  services: DealerServices
  marketing: DealerMarketing
  staff: DealerStaff[]
  performance: DealerPerformance
  settings: DealerSettings
}

// Dealer business information
export interface DealerBusinessDetails {
  legalName: string
  dbaName?: string
  businessType: 'sole-proprietorship' | 'partnership' | 'corporation' | 'llc'
  taxId?: string
  licensing: {
    businessLicense: string
    musicDealerLicense?: string
    stateRegistration: string
    expirationDates: Record<string, Date | string>
  }
  insurance: {
    liability: boolean
    property: boolean
    businessInterruption: boolean
    expirationDate: Date | string
  }
}

// Dealer contact and location information
export interface DealerContactInfo {
  primaryPhone: string
  secondaryPhone?: string
  fax?: string
  email: string
  supportEmail?: string
  salesEmail?: string
  website?: string
  socialMedia: {
    facebook?: string
    instagram?: string
    youtube?: string
    tiktok?: string
    linkedin?: string
  }
}

export interface DealerAddress {
  street: string
  street2?: string
  city: string
  state: string
  zipCode: string
  country: string
  coordinates?: {
    latitude: number
    longitude: number
  }
  timezone: string
  deliveryNotes?: string
}

export interface DealerHours {
  monday: DayHours
  tuesday: DayHours
  wednesday: DayHours
  thursday: DayHours
  friday: DayHours
  saturday: DayHours
  sunday: DayHours
  holidays?: HolidayHours[]
  appointmentOnly?: boolean
  specialNotes?: string
}

export interface DayHours {
  open: boolean
  openTime?: string // "09:00"
  closeTime?: string // "17:30"
  breaks?: Array<{
    start: string
    end: string
    reason: string
  }>
}

export interface HolidayHours {
  date: Date | string
  name: string
  hours?: DayHours
  closed: boolean
  note?: string
}

// Dealer inventory management
export interface DealerInventory {
  pianos: DealerPianoInventory[]
  accessories: DealerAccessoryInventory[]
  services: DealerServiceInventory[]
  totalValue: number
  lastUpdated: Date | string
}

export interface DealerPianoInventory {
  pianoId: string
  serialNumbers: string[]
  condition: 'new' | 'demo' | 'used' | 'certified-pre-owned' | 'rental-return'
  location: 'showroom' | 'warehouse' | 'consignment' | 'on-order'
  pricing: {
    dealerCost?: number
    msrp: number
    currentPrice: number
    margin: number
    lastPriceUpdate: Date | string
  }
  availability: {
    displayModel: boolean
    forSale: boolean
    forRental: boolean
    reserved?: {
      customerId: string
      expirationDate: Date | string
    }
  }
  history: InventoryHistoryEntry[]
}

export interface DealerAccessoryInventory {
  accessoryId: string
  quantity: number
  condition: 'new' | 'used'
  pricing: {
    dealerCost: number
    msrp: number
    currentPrice: number
  }
}

export interface DealerServiceInventory {
  serviceType: 'tuning' | 'repair' | 'maintenance' | 'moving' | 'restoration'
  available: boolean
  pricing: ServicePricing
  technicians: string[] // staff IDs
  scheduling: {
    leadTime: number // days
    duration: number // hours
    availability: 'weekdays' | 'weekends' | 'both'
  }
}

export interface ServicePricing {
  basePrice: number
  hourlyRate?: number
  travelFee?: number
  minimumCharge?: number
  packageDeals?: Array<{
    name: string
    price: number
    description: string
  }>
}

export interface InventoryHistoryEntry {
  date: Date | string
  action: 'received' | 'sold' | 'moved' | 'damaged' | 'returned' | 'price-change'
  details: string
  userId?: UserId
  cost?: number
  notes?: string
}

// Dealer services and capabilities
export interface DealerServices {
  sales: SalesServices
  rentals: RentalServices
  maintenance: MaintenanceServices
  education: EducationServices
  special: SpecialServices[]
}

export interface SalesServices {
  newPianos: boolean
  usedPianos: boolean
  consignment: boolean
  tradeIns: boolean
  financing: {
    available: boolean
    partners: string[]
    rates?: {
      min: number
      max: number
      terms: number[]
    }
  }
  warranties: {
    extended: boolean
    inHouse: boolean
    transferable: boolean
  }
}

export interface RentalServices {
  shortTerm: boolean // less than 3 months
  longTerm: boolean // 3+ months
  rentToOwn: boolean
  delivery: boolean
  pickup: boolean
  maintenance: 'included' | 'additional' | 'not-available'
  minimumRental: {
    duration: number
    unit: 'days' | 'weeks' | 'months'
  }
}

export interface MaintenanceServices {
  tuning: {
    available: boolean
    inHome: boolean
    inShop: boolean
    emergency: boolean
    rates: ServicePricing
  }
  repair: {
    available: boolean
    warranty: boolean
    estimate: 'free' | 'fee' | 'credited'
    specialties: string[]
  }
  restoration: {
    available: boolean
    specialties: string[]
    portfolio: Media[]
  }
  moving: {
    local: boolean
    longDistance: boolean
    storage: boolean
    insurance: boolean
  }
}

export interface EducationServices {
  lessons: {
    available: boolean
    instructors: string[] // staff IDs
    styles: string[]
    levels: string[]
    formats: ('individual' | 'group' | 'online')[]
  }
  workshops: {
    available: boolean
    topics: string[]
    frequency: 'monthly' | 'quarterly' | 'occasional'
  }
  masterclasses: boolean
  recitals: boolean
}

export interface SpecialServices {
  name: string
  description: string
  category: string
  available: boolean
  pricing?: ServicePricing
  requirements?: string[]
}

// Dealer staff management
export interface DealerStaff {
  id: UserId
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    photo?: Media | string
  }
  employment: {
    position: string
    department: 'sales' | 'service' | 'administration' | 'instruction'
    startDate: Date | string
    employmentType: 'full-time' | 'part-time' | 'contractor' | 'volunteer'
    status: 'active' | 'inactive' | 'terminated'
  }
  qualifications: {
    certifications: string[]
    specialties: string[]
    languages: string[]
    experience: number // years
    education?: string
  }
  permissions: {
    sales: boolean
    inventory: boolean
    service: boolean
    administration: boolean
    marketing: boolean
  }
  schedule?: {
    regularHours: Partial<DealerHours>
    availability: string
    timeOff: Array<{
      start: Date | string
      end: Date | string
      reason: string
    }>
  }
  performance?: {
    salesGoals?: Record<string, number>
    achievements?: string[]
    reviews?: Array<{
      date: Date | string
      rating: number
      comments: string
    }>
  }
}

// Dealer marketing and campaigns
export interface DealerMarketing {
  branding: DealerBranding
  campaigns: DealerCampaign[]
  advertising: DealerAdvertising
  events: DealerEvent[]
  customerDatabase: DealerCustomerData
}

export interface DealerBranding {
  logo?: Media | string
  colors: {
    primary: string
    secondary?: string
    accent?: string
  }
  fonts: {
    primary: string
    secondary?: string
  }
  tagline?: string
  messaging: {
    unique_selling_proposition: string
    target_audience: string
    brand_voice: string
  }
  materials: {
    businessCards?: Media | string
    brochures?: Media[]
    signage?: Media[]
  }
}

export interface DealerCampaign {
  id: string
  name: string
  type: 'sale' | 'promotion' | 'event' | 'seasonal' | 'grand-opening'
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled'
  dateRange: {
    start: Date | string
    end: Date | string
  }
  targeting: {
    geographic: string[]
    demographic: string[]
    interests: string[]
  }
  content: {
    title: string
    description: string
    images: Media[]
    videos?: Media[]
    cta: {
      text: string
      action: 'visit' | 'call' | 'email' | 'form' | 'calendar'
      target?: string
    }
  }
  budget?: {
    total: number
    spent: number
    channels: Record<string, number>
  }
  metrics: CampaignMetrics
}

export interface CampaignMetrics {
  impressions: number
  clicks: number
  conversions: number
  leads: number
  sales: number
  revenue: number
  costPerLead: number
  returnOnInvestment: number
  lastUpdated: Date | string
}

export interface DealerAdvertising {
  channels: AdvertisingChannel[]
  budget: {
    monthly: number
    allocated: Record<string, number>
    spent: Record<string, number>
  }
  targeting: {
    radius: number // miles
    demographics: string[]
    interests: string[]
    behaviors: string[]
  }
}

export interface AdvertisingChannel {
  name: string
  type: 'google-ads' | 'facebook' | 'instagram' | 'print' | 'radio' | 'tv' | 'direct-mail'
  active: boolean
  budget: number
  performance: {
    impressions: number
    clicks: number
    conversions: number
    cost: number
  }
}

export interface DealerEvent {
  id: string
  title: string
  description: string
  type: 'open-house' | 'sale' | 'concert' | 'workshop' | 'masterclass' | 'community'
  date: Date | string
  duration: number // hours
  capacity?: number
  registration: {
    required: boolean
    fee?: number
    deadline?: Date | string
    attendees?: number
  }
  marketing: {
    channels: string[]
    budget?: number
    materials?: Media[]
  }
  staff: UserId[]
  results?: {
    attendance: number
    leads: number
    sales: number
    revenue: number
    feedback: number // average rating
  }
}

// Dealer customer management
export interface DealerCustomerData {
  totalCustomers: number
  activeCustomers: number
  newCustomers: {
    thisMonth: number
    lastMonth: number
    trend: 'up' | 'down' | 'stable'
  }
  segments: CustomerSegment[]
  engagement: {
    newsletterSubscribers: number
    socialMediaFollowers: number
    eventAttendees: number
  }
}

export interface CustomerSegment {
  name: string
  criteria: Record<string, any>
  count: number
  characteristics: string[]
  marketingApproach: string
}

// Dealer performance analytics
export interface DealerPerformance {
  sales: SalesPerformance
  inventory: InventoryPerformance
  customer: CustomerPerformance
  marketing: MarketingPerformance
  financial: FinancialPerformance
  lastUpdated: Date | string
}

export interface SalesPerformance {
  period: 'month' | 'quarter' | 'year'
  revenue: {
    total: number
    target: number
    lastPeriod: number
    trend: 'up' | 'down' | 'stable'
  }
  units: {
    total: number
    target: number
    lastPeriod: number
    byCategory: Record<string, number>
  }
  averageTransaction: number
  conversionRate: number
  topSeller: {
    staffId: UserId
    sales: number
  }
}

export interface InventoryPerformance {
  turnover: number
  daysOnFloor: {
    average: number
    byCategory: Record<string, number>
  }
  stockLevels: {
    optimal: number
    current: number
    status: 'understocked' | 'optimal' | 'overstocked'
  }
  fastMovers: string[] // product IDs
  slowMovers: string[] // product IDs
}

export interface CustomerPerformance {
  satisfaction: {
    rating: number
    responseRate: number
    lastSurvey: Date | string
  }
  retention: {
    rate: number
    repeatCustomers: number
    referrals: number
  }
  lifetime: {
    averageValue: number
    averageDuration: number // months
  }
}

export interface MarketingPerformance {
  leadGeneration: {
    total: number
    qualified: number
    cost: number
    sources: Record<string, number>
  }
  digitalPresence: {
    websiteTraffic: number
    socialEngagement: number
    onlineReviews: {
      count: number
      rating: number
    }
  }
  campaigns: {
    active: number
    roi: number
    bestPerforming: string
  }
}

export interface FinancialPerformance {
  margins: {
    gross: number
    net: number
    trend: 'improving' | 'stable' | 'declining'
  }
  expenses: {
    rent: number
    salaries: number
    marketing: number
    utilities: number
    insurance: number
    other: number
    total: number
  }
  profitability: {
    monthly: number
    yearly: number
    target: number
  }
}

// Dealer settings and preferences
export interface DealerSettings {
  general: GeneralSettings
  inventory: InventorySettings
  pricing: PricingSettings
  marketing: MarketingSettings
  integration: IntegrationSettings
}

export interface GeneralSettings {
  timezone: string
  currency: 'USD' | 'CAD' | 'EUR'
  language: 'en' | 'es' | 'fr'
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD'
  notifications: {
    email: boolean
    sms: boolean
    inApp: boolean
    frequency: 'immediate' | 'hourly' | 'daily' | 'weekly'
  }
}

export interface InventorySettings {
  autoReorder: {
    enabled: boolean
    threshold: number
    leadTime: number
  }
  pricing: {
    autoUpdate: boolean
    marginMin: number
    marginTarget: number
  }
  categories: {
    visible: string[]
    featured: string[]
    order: string[]
  }
}

export interface PricingSettings {
  strategy: 'msrp' | 'competitive' | 'value' | 'premium'
  margins: Record<string, number>
  discounts: {
    maximum: number
    approval: {
      required: boolean
      threshold: number
      approvers: UserId[]
    }
  }
  financing: {
    enabled: boolean
    providers: string[]
    rates: Record<string, number>
  }
}

export interface MarketingSettings {
  automation: {
    enabled: boolean
    welcomeSeries: boolean
    followUp: boolean
    abandoned: boolean
  }
  personalization: {
    enabled: boolean
    recommendations: boolean
    contentCustomization: boolean
  }
  tracking: {
    googleAnalytics: boolean
    facebookPixel: boolean
    customEvents: boolean
  }
}

export interface IntegrationSettings {
  crm: {
    provider?: string
    enabled: boolean
    syncFrequency: 'realtime' | 'hourly' | 'daily'
  }
  accounting: {
    provider?: string
    enabled: boolean
    syncTransactions: boolean
  }
  inventory: {
    provider?: string
    enabled: boolean
    autoSync: boolean
  }
  marketing: {
    emailProvider?: string
    socialMedia: string[]
    analytics: string[]
  }
}