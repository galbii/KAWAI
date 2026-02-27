'use client'

import React from 'react'
import { MediaManagerProvider } from './media-manager/MediaManagerProvider'
import { MediaManagerModal } from './media-manager/MediaManagerModal'
import { FloatingActionBar } from './FloatingActionBar'
import { GlobalDropZone } from './GlobalDropZone'

interface AdminRootProviderProps {
  children: React.ReactNode
}

export const AdminRootProvider: React.FC<AdminRootProviderProps> = ({ children }) => {
  return (
    <MediaManagerProvider>
      {children}
      {/*
       * MediaManagerModal + FloatingActionBar rendered here (root level) so they're
       * available on ALL admin pages. Placing here (not afterNavLinks/sidebar) avoids
       * CSS transform stacking context issues that break position:fixed children.
       *
       * FloatingActionBar renders three clean white pill buttons on the right edge:
       *   Dashboard → /admin
       *   Collections → opens collections browse modal
       *   Media → opens MediaManagerModal
       */}
      <MediaManagerModal />
      <FloatingActionBar />
      <GlobalDropZone />
    </MediaManagerProvider>
  )
}
