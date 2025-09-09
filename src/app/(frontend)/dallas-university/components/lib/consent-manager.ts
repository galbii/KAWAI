'use client'

import posthog from 'posthog-js'

export type ConsentStatus = 'accepted' | 'declined' | 'pending'

export class ConsentManager {
  private static instance: ConsentManager
  private consentStatus: ConsentStatus = 'pending'
  private listeners: Array<(status: ConsentStatus) => void> = []

  private constructor() {
    if (typeof window !== 'undefined') {
      this.loadConsentFromStorage()
    }
  }

  static getInstance(): ConsentManager {
    if (!ConsentManager.instance) {
      ConsentManager.instance = new ConsentManager()
    }
    return ConsentManager.instance
  }

  private loadConsentFromStorage(): void {
    const stored = localStorage.getItem('cookie_consent')
    if (stored === 'accepted' || stored === 'declined') {
      this.consentStatus = stored as ConsentStatus
    }
  }

  getConsentStatus(): ConsentStatus {
    return this.consentStatus
  }

  hasConsent(): boolean {
    return this.consentStatus === 'accepted'
  }

  acceptConsent(): void {
    this.setConsent('accepted')
  }

  declineConsent(): void {
    this.setConsent('declined')
  }

  private setConsent(status: ConsentStatus): void {
    this.consentStatus = status
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookie_consent', status)
      localStorage.setItem('consent_timestamp', new Date().toISOString())
      
      // Update PostHog configuration based on consent
      this.updatePostHogConsent(status)
    }

    // Notify all listeners
    this.listeners.forEach(listener => listener(status))
  }

  private updatePostHogConsent(status: ConsentStatus): void {
    if (status === 'accepted') {
      // Enable data collection
      posthog.set_config({
        persistence: 'localStorage+cookie',
        opt_out_capturing_by_default: false
      })
      posthog.opt_in_capturing()
      
      // Enable session recording if consented
      posthog.startSessionRecording()
    } else {
      // Disable data collection
      posthog.set_config({
        persistence: 'memory', // Memory only, no persistent storage
        opt_out_capturing_by_default: true
      })
      posthog.opt_out_capturing()
      
      // Disable session recording
      posthog.stopSessionRecording()
    }
  }

  onConsentChange(callback: (status: ConsentStatus) => void): () => void {
    this.listeners.push(callback)
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  // GDPR compliance methods
  exportUserData(): Promise<{ consent_status: ConsentStatus; consent_timestamp: string | null; posthog_distinct_id: string | undefined; user_properties: Record<string, unknown> }> {
    if (!this.hasConsent()) {
      throw new Error('Cannot export data without user consent')
    }
    
    return new Promise((resolve) => {
      const userData = {
        consent_status: this.consentStatus,
        consent_timestamp: localStorage.getItem('consent_timestamp'),
        posthog_distinct_id: posthog.get_distinct_id(),
        user_properties: posthog.get_property('$set') || {}
      }
      resolve(userData)
    })
  }

  deleteUserData(): Promise<void> {
    return new Promise((resolve) => {
      // Clear PostHog data
      posthog.reset()
      
      // Clear consent data
      localStorage.removeItem('cookie_consent')
      localStorage.removeItem('consent_timestamp')
      
      // Reset consent status
      this.consentStatus = 'pending'
      
      resolve()
    })
  }
}

// Export singleton instance
export const consentManager = ConsentManager.getInstance()

// Hook for React components
import { useState, useEffect } from 'react'

export function useConsent() {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>(
    consentManager.getConsentStatus()
  )

  useEffect(() => {
    const unsubscribe = consentManager.onConsentChange(setConsentStatus)
    return unsubscribe
  }, [])

  return {
    consentStatus,
    hasConsent: consentManager.hasConsent(),
    acceptConsent: () => consentManager.acceptConsent(),
    declineConsent: () => consentManager.declineConsent(),
    exportUserData: () => consentManager.exportUserData(),
    deleteUserData: () => consentManager.deleteUserData()
  }
}