/**
 * GTM dataLayer event for a completed campaign signup.
 *
 * The event name and payload shape mirror the /signup2 form
 * (components/forms/TwoStepHubSpotForm.tsx) deliberately: Tag Manager already
 * has a trigger listening for the custom event `signup_form_submitted`, and
 * that trigger is what fires the Meta lead tag. Renaming the event or
 * reshaping `user_data` here would silently stop campaign leads reaching Meta
 * while the form still looked like it worked.
 *
 * Consent is intentionally NOT checked here, matching /signup2. This only
 * writes to a JavaScript array in the page; whether anything is transmitted is
 * decided by Google consent mode inside Tag Manager, which CookieConsentBanner
 * drives through gtag('consent','update') and fbq('consent', …). Adding a
 * second gate here would diverge from /signup2 and double-gate the EEA path.
 */
export const SIGNUP_FORM_SUBMITTED = 'signup_form_submitted'

export interface SignupAnalyticsInput {
  campaignSlug: string
  storeslug: string
  email: string
  phone?: string | undefined
  zip?: string | undefined
}

/**
 * Pure builder, so the payload the Meta tag depends on is assertable in a test
 * rather than only observable in a browser with Tag Manager attached.
 *
 * Empty fields are omitted rather than sent blank — Meta hashes `user_data`
 * for Advanced Matching, and an empty string hashes to a real value that
 * matches nothing, which quietly degrades match quality.
 */
export function buildSignupDataLayerEvent(input: SignupAnalyticsInput): Record<string, unknown> {
  const address: Record<string, unknown> = {}
  if (input.zip) address.postal_code = input.zip

  const userData: Record<string, unknown> = {}
  if (input.email) userData.email = input.email
  if (input.phone) userData.phone_number = input.phone
  if (Object.keys(address).length) userData.address = address

  return {
    event: SIGNUP_FORM_SUBMITTED,
    event_category: 'signup',
    // /signup2 sends a fixed form name here. Campaigns send their slug so one
    // trigger can still segment by campaign downstream.
    event_label: input.campaignSlug,
    signup_store: input.storeslug,
    ...(Object.keys(userData).length ? { user_data: userData } : {}),
  }
}

export function pushSignupFormSubmitted(input: SignupAnalyticsInput): void {
  if (typeof window === 'undefined') return
  const w = window as Window & { dataLayer?: unknown[] }
  w.dataLayer = w.dataLayer ?? []
  w.dataLayer.push(buildSignupDataLayerEvent(input))
}
