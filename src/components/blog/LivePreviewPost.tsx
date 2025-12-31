'use client'

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
import React from 'react'

interface LivePreviewPostProps {
  post: any
  isDraftMode: boolean
  children: React.ReactNode
}

export function LivePreviewPost({ post, isDraftMode, children }: LivePreviewPostProps) {
  const router = useRouter()

  return (
    <>
      {/* RefreshRouteOnSave component for server-side rendering refresh */}
      {isDraftMode && (
        <RefreshRouteOnSave
          refresh={router.refresh}
          serverURL={process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}
        />
      )}

      {/* Render children with server data */}
      {children}
    </>
  )
}
