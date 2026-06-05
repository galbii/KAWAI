'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PHProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const initPostHog = () => {
      // Guard against double-init: instrumentation-client.ts may have already called posthog.init()
      if (posthog.__loaded) return

      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        ...(process.env.NEXT_PUBLIC_POSTHOG_HOST && { api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST }),
        person_profiles: 'identified_only',
        capture_pageview: true,
        capture_pageleave: true,
        opt_out_capturing_by_default: true,
        // Session recording starts disabled and is enabled only after the first
        // user interaction (click or scroll). This eliminates the 6-second beacon
        // loop on page load and avoids recording bandwidth on bounce sessions.
        disable_session_recording: true,
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') posthog.debug()
        }
      })

      // Enable session recording on first meaningful interaction
      const enableRecording = () => {
        posthog.startSessionRecording()
      }
      document.addEventListener('click', enableRecording, { once: true })
      document.addEventListener('scroll', enableRecording, { once: true })
    }

    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(initPostHog, { timeout: 3000 })
      } else {
        setTimeout(initPostHog, 1000)
      }
    }
  }, [])

  return (
    <PostHogProvider client={posthog}>
      {children}
    </PostHogProvider>
  )
}