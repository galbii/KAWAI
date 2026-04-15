/**
 * Page History Storage Utilities
 *
 * Client-side utilities for persisting recently visited pages in localStorage.
 * Handles SSR safety and capping the list at 5 entries.
 *
 * @example
 * ```typescript
 * import { pushPageHistory, getPageHistory } from '@/lib/page-history-storage'
 *
 * // Record a page visit
 * pushPageHistory({ path: '/pianos/grand', title: 'Grand Pianos', visitedAt: Date.now() })
 *
 * // Retrieve history
 * const history = getPageHistory()
 * ```
 */

// ============================================================================
// Configuration
// ============================================================================

const PAGE_HISTORY_KEY = 'kawai_page_history'
const MAX_HISTORY_LENGTH = 5

// ============================================================================
// Types
// ============================================================================

export interface PageHistoryEntry {
  /** The URL pathname, e.g. "/pianos/grand" */
  path: string
  /** Raw document.title at time of visit, e.g. "Grand Pianos | Kawai Piano" */
  title: string
  /** Unix timestamp (Date.now()) of the visit */
  visitedAt: number
}

// ============================================================================
// SSR Safety Helpers
// ============================================================================

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined'
}

function isLocalStorageAvailable(): boolean {
  if (!isBrowser()) return false
  try {
    const testKey = '__kawai_storage_test__'
    localStorage.setItem(testKey, 'test')
    localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

// ============================================================================
// Page History Management
// ============================================================================

/**
 * Retrieve the current page history from localStorage.
 * Returns an empty array on SSR or if localStorage is unavailable.
 */
export function getPageHistory(): PageHistoryEntry[] {
  if (!isLocalStorageAvailable()) return []
  try {
    const raw = localStorage.getItem(PAGE_HISTORY_KEY)
    if (!raw) return []
    return JSON.parse(raw) as PageHistoryEntry[]
  } catch {
    return []
  }
}

/**
 * Record a page visit, prepending it to the list.
 *
 * Rules:
 * - /admin/* paths are silently ignored
 * - Existing entries with the same path are removed before prepending (deduplication)
 * - The list is capped at MAX_HISTORY_LENGTH (5) entries
 */
export function pushPageHistory(entry: PageHistoryEntry): void {
  if (!isLocalStorageAvailable()) return
  if (entry.path.startsWith('/admin')) return
  try {
    const current = getPageHistory()
    // Remove any existing entry for this path, then prepend fresh entry
    const deduplicated = current.filter((e) => e.path !== entry.path)
    const updated = [entry, ...deduplicated].slice(0, MAX_HISTORY_LENGTH)
    localStorage.setItem(PAGE_HISTORY_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error('[Page History] Failed to save entry:', error)
  }
}

/**
 * Clear all page history from localStorage.
 */
export function clearPageHistory(): void {
  if (!isLocalStorageAvailable()) return
  try {
    localStorage.removeItem(PAGE_HISTORY_KEY)
  } catch (error) {
    console.error('[Page History] Failed to clear history:', error)
  }
}

// ============================================================================
// Display Helpers — shared by all components rendering history entries
// ============================================================================

/**
 * Strip the site-name suffix Next.js metadata templates append.
 * "Grand Pianos | Kawai Piano Gallery" → "Grand Pianos"
 * Falls back to prettifying the last path segment.
 */
export function formatHistoryTitle(title: string, path: string): string {
  const stripped = title.split(' | ')[0]?.trim()
  if (stripped && stripped.length > 0) return stripped
  const last = path.split('/').filter(Boolean).pop() ?? path
  return last.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

/**
 * Human-readable relative timestamp.
 * "Just now" / "4m ago" / "2h ago" / "Yesterday" / "3d ago"
 */
export function formatHistoryTime(visitedAt: number): string {
  const diff = Date.now() - visitedAt
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Yesterday'
  return `${days}d ago`
}
