'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

// Progress state interface
export interface GL10Progress {
  email: string
  musicalIdentity: {
    experience: string
    goals: string[]
    interests: string[]
  }
  timeline: {
    purchaseWindow: string
    visitPreference: string
  }
  contactDetails: {
    name: string
    phone: string
    preferredContact: string
  }
  completedSections: string[]
  scrollPosition: number
}

// Context value interface
interface GL10ContextValue {
  progress: GL10Progress
  updateProgress: (updates: Partial<GL10Progress>) => void
  scrollToSection: (sectionId: string) => void
  setCurrentSection: (sectionId: string) => void
  currentSection: string
}

// Initial progress state
const initialProgress: GL10Progress = {
  email: '',
  musicalIdentity: {
    experience: '',
    goals: [],
    interests: []
  },
  timeline: {
    purchaseWindow: '',
    visitPreference: ''
  },
  contactDetails: {
    name: '',
    phone: '',
    preferredContact: ''
  },
  completedSections: [],
  scrollPosition: 0
}

// Create context
const GL10Context = createContext<GL10ContextValue | undefined>(undefined)

// Provider props
interface GL10ProviderProps {
  children: React.ReactNode
  slug: string
}

// Provider component
export function GL10Provider({ children, slug }: GL10ProviderProps) {
  const [progress, setProgress] = useState<GL10Progress>(initialProgress)
  const [currentSection, setCurrentSection] = useState<string>('hero')
  const [isInitialized, setIsInitialized] = useState(false)

  const storageKey = `gl10_signature_${slug}`

  // Load saved progress from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsedProgress = JSON.parse(saved)
        setProgress(parsedProgress)
      }
    } catch (error) {
      console.error('Failed to load saved progress:', error)
    } finally {
      setIsInitialized(true)
    }
  }, [storageKey])

  // Auto-save to localStorage when progress changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(progress))
      } catch (error) {
        console.error('Failed to save progress:', error)
      }
    }
  }, [progress, storageKey, isInitialized])

  // Update progress method
  const updateProgress = useCallback((updates: Partial<GL10Progress>) => {
    setProgress((prev) => ({
      ...prev,
      ...updates,
      // Handle nested object updates
      musicalIdentity: {
        ...prev.musicalIdentity,
        ...(updates.musicalIdentity || {})
      },
      timeline: {
        ...prev.timeline,
        ...(updates.timeline || {})
      },
      contactDetails: {
        ...prev.contactDetails,
        ...(updates.contactDetails || {})
      }
    }))
  }, [])

  // Scroll to section method
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 80 // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })

      setCurrentSection(sectionId)
      updateProgress({ scrollPosition: offsetPosition })
    }
  }, [updateProgress])

  const value: GL10ContextValue = {
    progress,
    updateProgress,
    scrollToSection,
    setCurrentSection,
    currentSection
  }

  return (
    <GL10Context.Provider value={value}>
      {children}
    </GL10Context.Provider>
  )
}

// Custom hook to use context
export function useGL10Context() {
  const context = useContext(GL10Context)
  if (context === undefined) {
    throw new Error('useGL10Context must be used within a GL10Provider')
  }
  return context
}
