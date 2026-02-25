/**
 * Admin Root Provider
 *
 * Wraps the entire Payload admin UI with necessary providers.
 * This ensures all admin components have access to shared context.
 *
 * IMPORTANT: This provider also renders the MediaManagerModal globally,
 * ensuring it's available on all admin pages (dashboard, edit views, list views, etc.)
 *
 * Usage in payload.config.ts:
 * ```typescript
 * admin: {
 *   components: {
 *     providers: ['/components/admin/AdminRootProvider#AdminRootProvider'],
 *   }
 * }
 * ```
 */
'use client'

import React from 'react'
import { MediaManagerProvider } from './media-manager/MediaManagerProvider'
import { MediaManagerModal } from './media-manager/MediaManagerModal'
import { MediaManagerButton } from './media-manager/MediaManagerButton'

interface AdminRootProviderProps {
  children: React.ReactNode
}

export const AdminRootProvider: React.FC<AdminRootProviderProps> = ({ children }) => {
  return (
    <MediaManagerProvider>
      {children}
      {/* Modal + Button rendered here so they're available on ALL admin pages.
          Placing here (not afterNavLinks) avoids CSS transform issues in the sidebar
          that would break position:fixed child elements. */}
      <MediaManagerModal />
      <MediaManagerButton />
    </MediaManagerProvider>
  )
}
