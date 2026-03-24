'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PHProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Guard against double-init: instrumentation-client.ts may have already called posthog.init()
    if (posthog.__loaded) return

    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      ...(process.env.NEXT_PUBLIC_POSTHOG_HOST && { api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST }),
      person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
      capture_pageleave: true, // Enable pageleave capture
      opt_out_capturing_by_default: true,
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug()
      }
    })
  }, [])

  return (
    <PostHogProvider client={posthog}>
      {children}
    </PostHogProvider>
  )
}