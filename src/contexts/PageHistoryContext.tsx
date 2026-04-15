'use client'

/**
 * Page History Context
 *
 * Tracks the last 5 pages visited by the user, persisted in localStorage.
 *
 * Hydration safety: `isInitialized` is false on SSR and during first render.
 * It becomes true only after the mount useEffect fires on the client, ensuring
 * no history content is rendered on first paint (prevents React hydration error #418).
 *
 * Title timing: A 150ms timeout after pathname changes gives Next.js App Router
 * time to update <title> before we read document.title.
 *
 * Toggle: `isHistoryEnabled` persists to localStorage. When false, new pages are
 * not recorded (existing history is preserved until manually cleared).
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { usePathname } from 'next/navigation'
import {
  clearPageHistory,
  getPageHistory,
  pushPageHistory,
  type PageHistoryEntry,
} from '@/lib/page-history-storage'

const HISTORY_ENABLED_KEY = 'kawai_history_enabled'

// ============================================================================
// Types
// ============================================================================

interface PageHistoryContextType {
  history: PageHistoryEntry[]
  /** False on SSR and initial render — gate all history UI on this flag */
  isInitialized: boolean
  /** Whether tracking is active — persisted to localStorage */
  isHistoryEnabled: boolean
  toggleHistory: () => void
  clearHistory: () => void
}

// ============================================================================
// Context
// ============================================================================

const PageHistoryContext = createContext<PageHistoryContextType | undefined>(undefined)

// ============================================================================
// Provider
// ============================================================================

export function PageHistoryProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [history, setHistory] = useState<PageHistoryEntry[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [isHistoryEnabled, setIsHistoryEnabled] = useState(true)

  // Load history + enabled preference from localStorage once on client mount
  useEffect(() => {
    setHistory(getPageHistory())
    const stored = localStorage.getItem(HISTORY_ENABLED_KEY)
    // Default to true if never set
    setIsHistoryEnabled(stored === null ? true : stored === 'true')
    setIsInitialized(true)
  }, [])

  // Track pathname changes — wait 150ms for document.title to update
  useEffect(() => {
    if (!isInitialized) return
    if (!isHistoryEnabled) return
    if (pathname.startsWith('/admin')) return

    const timer = setTimeout(() => {
      const title = document.title || pathname
      pushPageHistory({ path: pathname, title, visitedAt: Date.now() })
      setHistory(getPageHistory())
    }, 150)

    return () => clearTimeout(timer)
  }, [pathname, isInitialized, isHistoryEnabled])

  const toggleHistory = useCallback(() => {
    setIsHistoryEnabled((prev) => {
      const next = !prev
      localStorage.setItem(HISTORY_ENABLED_KEY, String(next))
      return next
    })
  }, [])

  const clearHistory = useCallback(() => {
    clearPageHistory()
    setHistory([])
  }, [])

  return (
    <PageHistoryContext.Provider value={{ history, isInitialized, isHistoryEnabled, toggleHistory, clearHistory }}>
      {children}
    </PageHistoryContext.Provider>
  )
}

// ============================================================================
// Hook
// ============================================================================

export function usePageHistory(): PageHistoryContextType {
  const context = useContext(PageHistoryContext)
  if (context === undefined) {
    throw new Error('usePageHistory must be used within a PageHistoryProvider')
  }
  return context
}
