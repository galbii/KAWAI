/**
 * The parts of a Back to School booking that are not markup: the shape of the
 * contact form, its validation, and the one submit path that writes the
 * appointment and fires every conversion event.
 *
 * Extracted from BookingModal so the inline form on /back-to-school2 and the
 * two-step modal on /back-to-school submit through exactly the same code. A
 * booking made either way must land in Shopify identically and count as the
 * same GA4 / Meta / Google Ads conversion — duplicating this was the fastest
 * way for those two to silently drift apart.
 */

import { bookBackToSchoolAppointment } from '@/lib/actions/back-to-school-booking'
import { trackSchedule } from '@/components/MetaPixel'
import { toIsoDate } from './schedule'

export interface ContactForm {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export type FormErrors = Partial<Record<keyof ContactForm, string>>

export const EMPTY_FORM: ContactForm = { firstName: '', lastName: '', email: '', phone: '' }

export function validate(form: ContactForm): FormErrors {
  const errors: FormErrors = {}
  if (!form.firstName.trim()) errors.firstName = 'Required'
  if (!form.lastName.trim()) errors.lastName = 'Required'
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = 'Enter a valid email address'
  return errors
}

export function toE164US(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return ''
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  if (digits.length === 10) return `+1${digits}`
  return `+1${digits}`
}

/**
 * Same conversion push the sign-up forms fire (see TwoStepHubSpotForm) so a
 * booked appointment counts as the same GA4 / Google Ads conversion. user_data
 * follows the Enhanced Conversions shape; GTM hashes it before it leaves.
 */
function pushSignupConversion(form: ContactForm) {
  const userData: Record<string, unknown> = { email: form.email }
  const phone = toE164US(form.phone)
  if (phone) userData.phone_number = phone
  userData.address = { first_name: form.firstName, last_name: form.lastName }

  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push({
    event: 'signup_form_submitted',
    event_category: 'signup',
    event_label: 'back_to_school_booking',
    user_data: userData,
  })
}

export type BookingResult = { ok: true } | { ok: false; error: string }

/**
 * Write the appointment, then fire the conversions.
 *
 * The customer reaches Shopify exactly once, here — an earlier version also
 * wrote on step 1 of the modal, so every booking hit Shopify twice with the
 * same email and downstream integrations counted two leads. Nothing before the
 * appointment exists is a lead.
 */
export async function submitBooking(args: {
  form: ContactForm
  storeslug: string
  date: Date
  time: string
  locationName?: string | null | undefined
}): Promise<BookingResult> {
  const { form, storeslug, date, time, locationName } = args

  const result = await bookBackToSchoolAppointment({
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    email: form.email.trim(),
    ...(form.phone.trim() ? { phone: toE164US(form.phone) } : {}),
    storeslug,
    date: toIsoDate(date),
    time,
  }).catch(() => ({ ok: false as const, error: undefined }))

  if (!result.ok) {
    return {
      ok: false,
      error:
        ('error' in result ? result.error : undefined) ??
        'Something went wrong sending your request. Please try again.',
    }
  }

  // Schedule is fired here because no GTM tag fires it — this is its only
  // source. Meta's Lead is deliberately NOT fired here: GTM fires
  // fbq('track','Lead') off signup_form_submitted, so calling trackLead() too
  // sent Meta two Lead events per booking with no eventID to dedupe them.
  trackSchedule({
    content_name: 'Back to School Appointment',
    ...(locationName ? { content_category: locationName } : {}),
  })
  pushSignupConversion(form)

  return { ok: true }
}
