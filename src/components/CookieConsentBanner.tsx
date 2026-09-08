'use client'

import { useEffect } from 'react'
import * as CookieConsent from 'vanilla-cookieconsent'
import 'vanilla-cookieconsent/dist/cookieconsent.css'
import posthog from 'posthog-js'
import { isConsentRestricted } from '@/lib/consent-region'

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

  // HubSpot drops hubspotutk/__hstc/__hssc, so it rides the analytics category.
  // _hsp is queued and replayed by the loader, so pushing before (or without) it
  // is safe. revokeCookieConsent clears the cookies and halts further tracking.
  const _hsp = (window._hsp = window._hsp ?? [])
  if (accepted) {
    initHubSpot()
    _hsp.push(['setHubSpotConsent', { analytics: true, functionality: true }])
  } else {
    _hsp.push(['revokeCookieConsent'])
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
    if (window.fbq) window.fbq('consent', 'grant')
  } else if (window.fbq) {
    // Pixel may already be loaded (opt-out model loads it on mount) — revoke
    // stops it sending further events without unloading the script.
    window.fbq('consent', 'revoke')
  }
}

/**
 * HubSpot tracking code. `js.hs-scripts.com/{portal}.js` is only a loader — it
 * injects hs-analytics, hscollectedforms and hs-banner, which is why all four
 * hosts are allowlisted in `src/lib/csp.ts`.
 *
 * This sets the `hubspotutk` cookie that `src/lib/hubspot/forms.ts` reads when
 * submitting to the Forms API — without it, native form leads land in the CRM
 * with no original-source attribution.
 */
function initHubSpot() {
  const portalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID
  if (!portalId || typeof document === 'undefined') return
  if (document.getElementById('hs-script-loader')) return

  const script = document.createElement('script')
  script.id = 'hs-script-loader'
  script.async = true
  script.defer = true
  script.src = `https://js.hs-scripts.com/${portalId}.js`
  document.head.appendChild(script)
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
    // Opt-out model outside the EEA/UK/CH: analytics + marketing default ON, and
    // the Meta Pixel + HubSpot tracking code load immediately rather than waiting
    // for a banner click. Restricted regions keep the opt-in model (categories
    // off, both tags gated until onConsent fires with the category accepted).
    const restricted = isConsentRestricted()

    if (!restricted) {
      initMetaPixel()
      initHubSpot()
    }

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
          enabled: !restricted,
          autoClear: {
            cookies: [
              { name: /^_ph_/ },
              { name: /^ph_/ },
              { name: /^_ga/ },
              { name: '_gid' },
              { name: 'hubspotutk' },
              { name: /^__hs/ },
            ],
          },
        },
        marketing: {
          enabled: !restricted,
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
                    'Help us understand how visitors use our site (Google Analytics, PostHog, HubSpot) so we can improve it.',
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
