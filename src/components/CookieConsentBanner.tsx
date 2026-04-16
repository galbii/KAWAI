'use client'

import { useEffect } from 'react'
import * as CookieConsent from 'vanilla-cookieconsent'
import 'vanilla-cookieconsent/dist/cookieconsent.css'
import posthog from 'posthog-js'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function gtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push(args)
}

function applyAnalyticsConsent(accepted: boolean) {
  gtag('consent', 'update', { analytics_storage: accepted ? 'granted' : 'denied' })
  if (accepted) {
    posthog.opt_in_capturing()
  } else {
    posthog.opt_out_capturing()
  }
}

function applyMarketingConsent(accepted: boolean) {
  gtag('consent', 'update', {
    ad_storage: accepted ? 'granted' : 'denied',
    ad_user_data: accepted ? 'granted' : 'denied',
    ad_personalization: accepted ? 'granted' : 'denied',
  })
  if (accepted) {
    initMetaPixel()
  }
}

function initMetaPixel() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID
  if (!pixelId || typeof window === 'undefined' || window.fbq) return

  // Standard Meta Pixel loader — only runs after marketing consent
  // Uses FacebookPixelFunction from @/lib/types for the setup properties
  const fbq = window.fbq = function (...args: unknown[]) {
    const f = fbq as unknown as { callMethod?: (...a: unknown[]) => void; queue: unknown[] }
    f.callMethod ? f.callMethod(...args) : f.queue.push(args)
  }
  const internal = fbq as unknown as {
    callMethod?: (...args: unknown[]) => void
    queue: unknown[]
    loaded: boolean
    version: string
  }
  internal.queue = []
  internal.loaded = true
  internal.version = '2.0'

  const t = document.createElement('script')
  t.async = true
  t.src = 'https://connect.facebook.net/en_US/fbevents.js'
  const s = document.getElementsByTagName('script')[0]
  s?.parentNode?.insertBefore(t, s)

  window.fbq('init', pixelId)
  window.fbq('track', 'PageView')
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CookieConsentBanner() {
  useEffect(() => {
    CookieConsent.run({
      guiOptions: {
        consentModal: {
          layout: 'bar',
          position: 'bottom center',
          flipButtons: false,
          equalWeightButtons: false,
        },
        preferencesModal: {
          layout: 'box',
          position: 'right',
        },
      },
      categories: {
        necessary: {
          enabled: true,
          readOnly: true,
        },
        analytics: {
          enabled: false,
          autoClear: {
            cookies: [
              { name: /^_ph_/ },
              { name: /^ph_/ },
              { name: /^_ga/ },
              { name: '_gid' },
            ],
          },
        },
        marketing: {
          enabled: false,
          autoClear: {
            cookies: [
              { name: '_fbp' },
              { name: '_fbc' },
            ],
          },
        },
      },
      onConsent: () => {
        applyAnalyticsConsent(CookieConsent.acceptedCategory('analytics'))
        applyMarketingConsent(CookieConsent.acceptedCategory('marketing'))
      },
      onChange: ({ changedCategories }) => {
        if (changedCategories.includes('analytics')) {
          applyAnalyticsConsent(CookieConsent.acceptedCategory('analytics'))
        }
        if (changedCategories.includes('marketing')) {
          applyMarketingConsent(CookieConsent.acceptedCategory('marketing'))
        }
      },
      language: {
        default: 'en',
        translations: {
          en: {
            consentModal: {
              title: 'Cookie preferences',
              description:
                'We use cookies to improve your experience and understand how our site is used. You can accept or manage your preferences.',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Necessary only',
              showPreferencesBtn: 'Manage preferences',
            },
            preferencesModal: {
              title: 'Cookie preferences',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Necessary only',
              savePreferencesBtn: 'Save preferences',
              closeIconLabel: 'Close',
              sections: [
                {
                  title: 'Strictly necessary',
                  description: 'Required for the site to function. Cannot be disabled.',
                  linkedCategory: 'necessary',
                },
                {
                  title: 'Analytics',
                  description:
                    'Help us understand how visitors use our site (Google Analytics, PostHog) so we can improve it.',
                  linkedCategory: 'analytics',
                },
                {
                  title: 'Marketing',
                  description:
                    'Used to show relevant advertising and measure campaign effectiveness (Meta Pixel).',
                  linkedCategory: 'marketing',
                },
              ],
            },
          },
        },
      },
    })
  }, [])

  return null
}
