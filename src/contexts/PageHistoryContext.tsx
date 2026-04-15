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

// ============================================================================
// Types
// ============================================================================

interface PageHistoryContextType {
  history: PageHistoryEntry[]
  /** False on SSR and initial render — gate all history UI on this flag */
  isInitialized: boolean
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

  // Load history from localStorage once on client mount
  useEffect(() => {
    setHistory(getPageHistory())
    setIsInitialized(true)
  }, [])

  // Track pathname changes — wait 150ms for document.title to update
  useEffect(() => {
    if (!isInitialized) return
    if (pathname.startsWith('/admin')) return

    const timer = setTimeout(() => {
      const title = document.title || pathname
      pushPageHistory({ path: pathname, title, visitedAt: Date.now() })
      setHistory(getPageHistory())
    }, 150)

    return () => clearTimeout(timer)
  }, [pathname, isInitialized])

  const clearHistory = useCallback(() => {
    clearPageHistory()
    setHistory([])
  }, [])

  return (
    <PageHistoryContext.Provider value={{ history, isInitialized, clearHistory }}>
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
