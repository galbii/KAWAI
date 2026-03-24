'use client'

import { useEffect } from 'react'
import * as CookieConsent from 'vanilla-cookieconsent'
import 'vanilla-cookieconsent/dist/cookieconsent.css'
import posthog from 'posthog-js'

function applyAnalyticsConsent(accepted: boolean) {
  if (accepted) {
    posthog.opt_in_capturing()
  } else {
    posthog.opt_out_capturing()
  }
}

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
            ],
          },
        },
      },
      onConsent: () => {
        applyAnalyticsConsent(CookieConsent.acceptedCategory('analytics'))
      },
      onChange: ({ changedCategories }) => {
        if (changedCategories.includes('analytics')) {
          applyAnalyticsConsent(CookieConsent.acceptedCategory('analytics'))
        }
      },
      language: {
        default: 'en',
        translations: {
          en: {
            consentModal: {
              title: 'Cookie preferences',
              description:
                'We use analytics cookies to improve your experience and understand how our site is used. You can accept or manage your preferences.',
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
                    'Help us understand how visitors use our site so we can improve it.',
                  linkedCategory: 'analytics',
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
