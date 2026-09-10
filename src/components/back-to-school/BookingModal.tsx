'use client'

import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { RuledGround } from './RuledGround'
import { OSWALD, CORMORANT, DEADLINE_LONG } from './campaign'
import {
  EMPTY_FORM,
  submitBooking,
  validate,
  type ContactForm,
  type FormErrors,
} from './booking-core'
import {
  Eyebrow,
  Field,
  Input,
  SeptemberPicker,
  SlotGrid,
  primaryButton,
  secondaryButton,
} from './BookingFields'
import { slotsForDate, toIsoDate, formatLongDate, type HoursEntry } from './schedule'
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
 *
 * The fields, the calendar, the validation and the submit path all live outside
 * this file (BookingFields / booking-core) because /back-to-school2 renders the
 * same form inline on the page. This component is the two-step modal wrapper
 * around them; BookingForm is the one-screen one.
 */

export interface BookingModalProps {
  open: boolean
  onClose: () => void
  storeslug: string
  locationName?: string | null | undefined
  hours?: HoursEntry[] | null | undefined
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
    // Nothing is written anywhere here. Reaching the calendar is not a lead —
    // and a step-1 CRM write plus the one inside bookBackToSchoolAppointment
    // meant every booking hit Shopify twice (create, then update) with the same
    // email, which downstream integrations counted as two leads. Back →
    // Continue repeated it again each cycle. The customer goes into Shopify
    // exactly once, in handleConfirm, when an appointment actually exists.
  }

  async function handleConfirm() {
    if (!selectedDate || !selectedTime || submitting) return
    setSubmitting(true)
    setSubmitError(null)
    const result = await submitBooking({
      form,
      storeslug,
      date: selectedDate,
      time: selectedTime,
      locationName,
    })
    setSubmitting(false)

    if (!result.ok) {
      setSubmitError(result.error)
      return
    }
    setBooked(true)
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
                    <SlotGrid
                      slots={slots}
                      selected={selectedTime}
                      onSelect={(slot) => {
                        setSelectedTime(slot)
                        setSubmitError(null)
                      }}
                    />
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
