/**
 * Page Layout Context
 *
 * Provides access to the full page layout (all blocks) to any component that needs it.
 * This enables blocks like SideNavigation to auto-generate navigation from page structure.
 *
 * Usage:
 * ```tsx
 * const pageLayout = usePageLayout()
 * // Access all blocks on the page
 * ```
 */
'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { Page } from '@/payload-types'

export const PageLayoutContext = createContext<Page['layout']>([])

/**
 * Hook to access the full page layout from any block component
 */
export function usePageLayout() {
  return useContext(PageLayoutContext)
}

/**
 * Client Component wrapper for the PageLayoutContext Provider
 * This allows Server Components to wrap their children with the provider
 */
export function PageLayoutProvider({
  blocks,
  children,
}: {
  blocks: Page['layout']
  children: ReactNode
}) {
  return <PageLayoutContext.Provider value={blocks}>{children}</PageLayoutContext.Provider>
}
