'use client'

import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { captureBookingLead } from '@/lib/actions/booking-lead'
import { bookBackToSchoolAppointment } from '@/lib/actions/back-to-school-booking'
import { trackLead, trackSchedule } from '@/components/MetaPixel'
import { RuledGround } from './RuledGround'
import { CAMPAIGN_YEAR, CAMPAIGN_MONTH, DEADLINE_LONG } from './campaign'
import {
  slotsForDate,
  isBookableDate,
  toIsoDate,
  formatLongDate,
  type HoursEntry,
} from './schedule'
import { appointmentIcsUrl, googleCalendarUrl } from './calendar'

/**
 * The Back to School booking form — replaces the shared Calendly modal on this
 * campaign. Drawn in the page's practice-paper language, and the calendar step
 * is the hero's September calendar made interactive: the visitor circles their
 * own day.
 *
 * Flow: contact details (same questions as before) → pick a day Sept 7–30 and
 * a time from the store's actual hours → one server action adds the customer
 * to Shopify (tagged 'back-to-school' + storeslug) and emails the showroom via
 * Resend. No iframe, no postMessage listening, no third-party scheduling.
 */

export interface BookingModalProps {
  open: boolean
  onClose: () => void
  storeslug: string
  locationName?: string | null | undefined
  hours?: HoursEntry[] | null | undefined
}

interface ContactForm {
  firstName: string
  lastName: string
  email: string
  phone: string
}

type FormErrors = Partial<Record<keyof ContactForm, string>>

const EMPTY_FORM: ContactForm = { firstName: '', lastName: '', email: '', phone: '' }

function validate(form: ContactForm): FormErrors {
  const errors: FormErrors = {}
  if (!form.firstName.trim()) errors.firstName = 'Required'
  if (!form.lastName.trim()) errors.lastName = 'Required'
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = 'Enter a valid email address'
  return errors
}

function toE164US(phone: string): string {
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

// ─── Small pieces ─────────────────────────────────────────────────────────────

const OSWALD = 'var(--font-oswald), sans-serif'
const CORMORANT = 'var(--font-family-cormorant), Georgia, serif'

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-5 h-px bg-kawai-red" aria-hidden />
      <span
        className="text-kawai-red uppercase"
        style={{ fontFamily: OSWALD, fontSize: '0.62rem', letterSpacing: '0.24em' }}
      >
        {children}
      </span>
    </div>
  )
}

function Field({
  label,
  htmlFor,
  required,
  error,
  children,
}: {
  label: string
  htmlFor: string
  required?: boolean
  error?: string | undefined
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <label
        htmlFor={htmlFor}
        className="text-kawai-charcoal/60 uppercase select-none"
        style={{ fontFamily: OSWALD, fontSize: '0.66rem', letterSpacing: '0.2em' }}
      >
        {label}
        {required && <span className="text-kawai-red ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-kawai-red text-xs">{error}</p>}
    </div>
  )
}

function Input({
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      {...props}
      className={cn(
        // Square, flat, and on white — the same panel language the ledger and
        // the showroom card are drawn in. 16px on mobile so iOS doesn't zoom.
        'w-full px-4 py-3.5 text-[16px] sm:text-sm text-kawai-black bg-white border outline-none transition-colors duration-200',
        'placeholder:text-kawai-charcoal/35',
        error
          ? 'border-kawai-red ring-2 ring-kawai-red/15'
          : 'border-kawai-black/15 hover:border-kawai-black/35 focus:border-kawai-red focus:ring-2 focus:ring-kawai-red/15',
      )}
    />
  )
}

const primaryButton =
  'group w-full inline-flex items-center justify-center gap-3 px-6 py-5 bg-kawai-red hover:bg-kawai-red-600 disabled:opacity-50 disabled:hover:bg-kawai-red text-white text-sm tracking-[0.18em] uppercase font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-black'

const secondaryButton =
  'px-6 py-5 border border-kawai-black/25 hover:bg-kawai-black hover:text-kawai-pearl text-kawai-black text-sm tracking-[0.14em] uppercase font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-black'

// ─── Calendar step ────────────────────────────────────────────────────────────

const WEEKDAY_HEADER = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const

function SeptemberPicker({
  hours,
  selected,
  onSelect,
}: {
  hours: HoursEntry[] | null | undefined
  selected: Date | null
  onSelect: (d: Date) => void
}) {
  // `now` is fixed per mount so the grid doesn't shift mid-interaction.
  const now = useMemo(() => new Date(), [])
  const firstWeekday = new Date(CAMPAIGN_YEAR, CAMPAIGN_MONTH - 1, 1).getDay()
  const daysInMonth = 30

  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <span
          className="text-kawai-black uppercase"
          style={{ fontFamily: OSWALD, fontSize: '1.35rem', fontWeight: 600, letterSpacing: '0.01em' }}
        >
          September 2026
        </span>
        <span
          className="text-kawai-red uppercase"
          style={{ fontFamily: OSWALD, fontSize: '0.64rem', letterSpacing: '0.18em' }}
        >
          Sept 7 – 30
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1" aria-hidden>
        {WEEKDAY_HEADER.map((d, i) => (
          <span
            key={i}
            className="text-center text-kawai-charcoal/45 py-1.5"
            style={{ fontFamily: OSWALD, fontSize: '0.66rem', letterSpacing: '0.12em' }}
          >
            {d}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstWeekday }).map((_, i) => (
          <span key={`blank-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1
          const date = new Date(CAMPAIGN_YEAR, CAMPAIGN_MONTH - 1, day)
          const bookable = isBookableDate(hours, date, now)
          const isSelected = selected?.getDate() === day
          return (
            <button
              key={day}
              type="button"
              disabled={!bookable}
              onClick={() => onSelect(date)}
              aria-label={`${formatLongDate(date)}${bookable ? '' : ' — unavailable'}`}
              aria-pressed={isSelected}
              // Square cells on white: the calendar reads as a grid on the
              // page's paper rather than a row of pills.
              style={{ fontFamily: OSWALD, fontSize: '0.95rem' }}
              className={cn(
                'aspect-square flex items-center justify-center border transition-colors',
                bookable
                  ? isSelected
                    ? 'bg-kawai-red border-kawai-red text-white font-semibold'
                    : 'bg-white border-kawai-black/12 text-kawai-black hover:border-kawai-red hover:text-kawai-red'
                  : 'border-transparent text-kawai-charcoal/25 cursor-default',
              )}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function BookingModal({ open, onClose, storeslug, locationName, hours }: BookingModalProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [form, setForm] = useState<ContactForm>(EMPTY_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [booked, setBooked] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const slots = useMemo(
    () => (selectedDate ? slotsForDate(hours ?? null, selectedDate) : []),
    [hours, selectedDate],
  )

  // Built here rather than in the success markup so the link is one value the
  // whole screen shares with the .ics route — same date, same slot, same store.
  const googleUrl = useMemo(() => {
    if (!selectedDate || !selectedTime) return null
    return googleCalendarUrl({
      storeName: locationName ?? 'Kawai',
      isoDate: toIsoDate(selectedDate),
      time: selectedTime,
      details: 'Your Back to School appointment. The pianos will be uncovered and in tune when you arrive.',
    })
  }, [selectedDate, selectedTime, locationName])

  if (!open || !mounted) return null

  function update(field: keyof ContactForm) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }))
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  function handleContinue() {
    const errs = validate(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setStep(2)
    // Capture the lead in the CRM now, before the calendar — an abandoned
    // scheduling step still puts the customer in Shopify, tagged with the sale
    // and the store, so the showroom can follow up.
    //
    // No ad-platform conversion fires here. Reaching the calendar is not a
    // lead: anyone who fills in step 1, sees the calendar and closes the modal
    // would otherwise be counted. Meta's Lead fires in handleConfirm, once an
    // appointment actually exists.
    void captureBookingLead({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone ? toE164US(form.phone) : undefined,
      storeslug,
      customTags: ['back-to-school'],
      note: 'Back to School booking started',
    })
  }

  async function handleConfirm() {
    if (!selectedDate || !selectedTime || submitting) return
    setSubmitting(true)
    setSubmitError(null)
    const result = await bookBackToSchoolAppointment({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      ...(form.phone.trim() ? { phone: toE164US(form.phone) } : {}),
      storeslug,
      date: toIsoDate(selectedDate),
      time: selectedTime,
    }).catch(() => ({ ok: false as const, error: undefined }))
    setSubmitting(false)

    if (!result.ok) {
      setSubmitError(
        ('error' in result ? result.error : undefined) ??
          'Something went wrong sending your request. Please try again.',
      )
      return
    }

    setBooked(true)
    trackSchedule({
      content_name: 'Back to School Appointment',
      ...(locationName ? { content_category: locationName } : {}),
    })
    // The booked appointment is the lead — see handleContinue.
    trackLead({
      content_name: 'Back to School Booking',
      ...(locationName ? { content_category: locationName } : {}),
    })
    window.dataLayer = window.dataLayer ?? []
    // Event name kept from the Calendly era so existing GTM triggers and GA
    // reports stay continuous — the mechanism changed, the conversion didn't.
    window.dataLayer.push({
      event: 'calendly_booking_confirmed',
      event_category: 'booking',
      event_label: locationName ?? 'Back to School Appointment',
    })
    pushSignupConversion(form)
  }

  function handleClose() {
    setStep(1)
    setForm(EMPTY_FORM)
    setErrors({})
    setSelectedDate(null)
    setSelectedTime(null)
    setSubmitting(false)
    setSubmitError(null)
    setBooked(false)
    onClose()
  }

  return createPortal(
    <>
      <style>{`
        @keyframes btsm-overlay-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes btsm-panel-in {
          from { opacity: 0; transform: translateY(22px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes btsm-step-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .btsm-overlay { animation: btsm-overlay-in 0.2s ease both; }
        .btsm-panel   { animation: btsm-panel-in 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .btsm-step    { animation: btsm-step-in 0.3s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      <div
        className="btsm-overlay fixed inset-0 z-[9010] bg-kawai-black/55 backdrop-blur-md"
        onClick={handleClose}
        aria-hidden
      />

      <div
        className="fixed inset-0 z-[9011] flex items-center justify-center p-4 sm:p-8 pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-label="Book an appointment"
      >
        <div
          className="btsm-panel pointer-events-auto w-full max-w-[520px] bg-kawai-pearl overflow-hidden shadow-[0_40px_100px_rgba(30,27,22,0.34),0_12px_32px_rgba(30,27,22,0.16)] flex flex-col relative"
          style={{ maxHeight: '90dvh' }}
        >
          <div className="h-[4px] bg-kawai-red flex-shrink-0 relative z-10" />
          <RuledGround marginRule={false} />

          {/* Header */}
          <div className="relative px-6 pt-5 pb-4 flex-shrink-0 border-b border-kawai-black/10">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <Eyebrow>{locationName ?? 'Kawai Piano'} · Back to School</Eyebrow>
                <h2
                  className="text-kawai-black uppercase mt-3"
                  style={{
                    fontFamily: OSWALD,
                    fontSize: 'clamp(1.65rem, 4.2vw, 2.25rem)',
                    fontWeight: 600,
                    lineHeight: 0.94,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {booked ? 'Your invitation is on its way.' : step === 1 ? 'Book an appointment' : 'Circle a day'}
                </h2>
                {/* The page's counterpoint voice, once, where the visitor is
                    deciding whether this is worth their afternoon. */}
                {!booked && (
                  <p
                    className="text-kawai-charcoal/65 mt-2.5"
                    style={{ fontFamily: CORMORANT, fontStyle: 'italic', fontSize: '1.02rem', lineHeight: 1.3 }}
                  >
                    {step === 1
                      ? 'We’ll have them tuned and uncovered for you.'
                      : 'Pick a day and we’ll confirm it by email.'}
                  </p>
                )}
              </div>
              <button
                onClick={handleClose}
                className="w-9 h-9 flex-shrink-0 flex items-center justify-center text-kawai-charcoal/45 hover:text-kawai-pearl hover:bg-kawai-black transition-colors"
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {!booked && (
              <div className="flex items-center gap-2 mt-4" aria-hidden>
                {[1, 2].map((s) => (
                  <span
                    key={s}
                    className={cn(
                      'h-[3px] flex-1 transition-colors duration-300',
                      s <= step ? 'bg-kawai-red' : 'bg-kawai-black/12',
                    )}
                  />
                ))}
                <span
                  className="text-kawai-charcoal/50 uppercase whitespace-nowrap"
                  style={{ fontFamily: OSWALD, fontSize: '0.66rem', letterSpacing: '0.16em' }}
                >
                  {step} / 2
                </span>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="relative overflow-y-auto flex-1">

            {/* ── Success ── */}
            {booked && selectedDate && selectedTime && (
              <div className="btsm-step px-6 py-10 text-center">
                {/* Stamped rather than ticked — the confirmation is an
                    invitation, and this is the mark on it. */}
                <div className="w-12 h-12 bg-kawai-red flex items-center justify-center mx-auto mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75 10 18.25 19.5 6.75" />
                  </svg>
                </div>
                <p
                  className="text-kawai-black uppercase"
                  style={{
                    fontFamily: OSWALD,
                    fontSize: 'clamp(1.3rem, 4vw, 1.7rem)',
                    fontWeight: 600,
                    lineHeight: 1,
                    letterSpacing: '-0.005em',
                  }}
                >
                  {formatLongDate(selectedDate)}
                </p>
                <p
                  className="text-kawai-red uppercase mt-2 mb-6"
                  style={{ fontFamily: OSWALD, fontSize: '0.95rem', letterSpacing: '0.22em' }}
                >
                  {selectedTime}
                </p>
                <p className="text-kawai-charcoal/60 text-sm leading-relaxed max-w-xs mx-auto mb-7">
                  Your official invitation is on its way to{' '}
                  <span className="text-kawai-black">{form.email}</span> —{' '}
                  {locationName ?? 'the showroom'} will confirm the time from there. Your rebate is
                  held either way until {DEADLINE_LONG}.
                </p>

                {/* Straight into their calendar, before the tab is closed and the
                    appointment lives only in an inbox. */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mb-7">
                  <a
                    href={appointmentIcsUrl({
                      storeslug,
                      isoDate: toIsoDate(selectedDate),
                      time: selectedTime,
                    })}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-kawai-black hover:bg-kawai-charcoal text-kawai-pearl text-xs tracking-[0.16em] uppercase font-semibold transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                    Add to calendar
                  </a>
                  {googleUrl && (
                    <a
                      href={googleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-3.5 border border-kawai-black/20 hover:border-kawai-red/60 hover:text-kawai-red text-kawai-black text-xs tracking-[0.16em] uppercase font-semibold transition-colors"
                    >
                      Google Calendar
                    </a>
                  )}
                </div>

                <button
                  onClick={handleClose}
                  className="text-kawai-charcoal/60 hover:text-kawai-red text-sm tracking-[0.14em] uppercase font-semibold underline underline-offset-4 decoration-kawai-black/20 hover:decoration-kawai-red transition-colors"
                >
                  Done
                </button>
              </div>
            )}

            {/* ── Step 1: contact details ── */}
            {!booked && step === 1 && (
              <div className="btsm-step px-6 py-6">
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="First name" htmlFor="bts-firstName" required error={errors.firstName}>
                      <Input
                        id="bts-firstName"
                        type="text"
                        placeholder="Jane"
                        value={form.firstName}
                        onChange={update('firstName')}
                        error={!!errors.firstName}
                        autoComplete="given-name"
                        autoFocus
                      />
                    </Field>
                    <Field label="Last name" htmlFor="bts-lastName" required error={errors.lastName}>
                      <Input
                        id="bts-lastName"
                        type="text"
                        placeholder="Smith"
                        value={form.lastName}
                        onChange={update('lastName')}
                        error={!!errors.lastName}
                        autoComplete="family-name"
                      />
                    </Field>
                  </div>
                  <Field label="Email address" htmlFor="bts-email" required error={errors.email}>
                    <Input
                      id="bts-email"
                      type="email"
                      placeholder="jane@example.com"
                      value={form.email}
                      onChange={update('email')}
                      error={!!errors.email}
                      autoComplete="email"
                    />
                  </Field>
                  <Field label="Phone number" htmlFor="bts-phone">
                    <Input
                      id="bts-phone"
                      type="tel"
                      placeholder="(555) 000-0000"
                      value={form.phone}
                      onChange={update('phone')}
                      autoComplete="tel"
                    />
                  </Field>
                </div>

                <button onClick={handleContinue} className={primaryButton}>
                  Pick a day &amp; time
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </button>

                <p className="mt-4 text-kawai-charcoal/45 text-[0.68rem] leading-relaxed text-center">
                  By continuing you agree to receive emails from Kawai Piano about your
                  appointment and offers. Unsubscribe any time.
                </p>
              </div>
            )}

            {/* ── Step 2: day + time ── */}
            {!booked && step === 2 && (
              <div className="btsm-step px-6 py-6">
                <SeptemberPicker
                  hours={hours}
                  selected={selectedDate}
                  onSelect={(d) => {
                    setSelectedDate(d)
                    setSelectedTime(null)
                    setSubmitError(null)
                  }}
                />

                {selectedDate && (
                  <div className="mt-5 pt-5 border-t border-kawai-black/10">
                    <p
                      className="text-kawai-charcoal/60 uppercase mb-3"
                      style={{ fontFamily: OSWALD, fontSize: '0.66rem', letterSpacing: '0.2em' }}
                    >
                      Times for {formatLongDate(selectedDate).split(',')[0]}, September {selectedDate.getDate()}
                    </p>
                    {slots.length > 0 ? (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {slots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => {
                              setSelectedTime(slot)
                              setSubmitError(null)
                            }}
                            aria-pressed={selectedTime === slot}
                            style={{ fontFamily: OSWALD, letterSpacing: '0.06em' }}
                            className={cn(
                              'py-3 text-[0.8rem] border transition-colors',
                              selectedTime === slot
                                ? 'bg-kawai-red border-kawai-red text-white font-semibold'
                                : 'bg-white border-kawai-black/15 text-kawai-black hover:border-kawai-red hover:text-kawai-red',
                            )}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-kawai-charcoal/55 text-sm">
                        The showroom is closed that day — pick another.
                      </p>
                    )}
                  </div>
                )}

                {submitError && (
                  <p role="alert" className="mt-4 text-sm text-kawai-red">
                    {submitError}
                  </p>
                )}

                <div className="mt-6 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className={secondaryButton}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={!selectedDate || !selectedTime || submitting}
                    className={primaryButton}
                  >
                    {submitting ? 'Sending…' : 'Request this time'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body,
  )
}
