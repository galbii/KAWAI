// User domain types - Customer and staff management
// Types for user accounts, preferences, and interactions

import type { User } from '@/payload-types'
import type { UserId } from '@/types/common/utils'
import type { CustomerPreferences } from './piano'

// Enhanced user with business context
export interface EnhancedUser extends User {
  id: UserId
  profile: UserProfile
  preferences: UserPreferences
  activity: UserActivity
  permissions: UserPermissions
}

export interface UserProfile {
  firstName: string
  lastName: string
  displayName?: string
  avatar?: string
  bio?: string
  location?: {
    city: string
    state: string
    country: string
  }
  contact: {
    email: string
    phone?: string
    preferredMethod: 'email' | 'phone' | 'sms'
  }
  demographics?: {
    ageRange?: string
    occupation?: string
    musicalBackground?: string
  }
}

export interface UserPreferences extends CustomerPreferences {
  communication: {
    newsletter: boolean
    promotions: boolean
    events: boolean
    productUpdates: boolean
  }
  privacy: {
    shareData: boolean
    trackingConsent: boolean
    analyticsConsent: boolean
  }
}

export interface UserActivity {
  lastLogin: Date | string
  loginCount: number
  pageViews: number
  sessionDuration: number // average minutes
  interactions: UserInteraction[]
}

export interface UserInteraction {
  type: 'page-view' | 'form-submit' | 'download' | 'consultation' | 'purchase'
  timestamp: Date | string
  details: Record<string, any>
}

export interface UserPermissions {
  role: 'admin' | 'editor' | 'dealer' | 'customer' | 'prospect'
  collections: Record<string, ('read' | 'create' | 'update' | 'delete')[]>
  features: string[]
}