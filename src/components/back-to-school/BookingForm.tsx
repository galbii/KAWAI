'use client'

import { useMemo, useState } from 'react'
import { RuledGround } from './RuledGround'
import { OSWALD, DEADLINE_LONG } from './campaign'
import {
  EMPTY_FORM,
  submitBooking,
  validate,
  type ContactForm,
  type FormErrors,
} from './booking-core'
import { Field, Input, SeptemberPicker, SlotGrid, primaryButton } from './BookingFields'
import { slotsForDate, toIsoDate, formatLongDate, type HoursEntry } from './schedule'
import { appointmentIcsUrl, googleCalendarUrl } from './calendar'

/**
 * The booking form, on the page, with nothing folded away.
 *
 * The modal on /back-to-school asks the same questions across two steps behind
 * a click: a visitor never sees a field until they have already committed to
 * opening something. Here every field, the calendar, and the times are in the
 * initial HTML of the section — the visitor can see the whole ask before
 * deciding to answer it, which is the entire point of the simplified page.
 *
 * Same validation and the same submitBooking() path as the modal, so a booking
 * made here is indistinguishable downstream from one made there.
 */

interface BookingFormProps {
  storeslug: string
  locationName?: string | null | undefined
  hours?: HoursEntry[] | null | undefined
  className?: string
}

export function BookingForm({ storeslug, locationName, hours, className = '' }: BookingFormProps) {
  const [form, setForm] = useState<ContactForm>(EMPTY_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [booked, setBooked] = useState(false)

  const slots = useMemo(
    () => (selectedDate ? slotsForDate(hours ?? null, selectedDate) : []),
    [hours, selectedDate],
  )

  const googleUrl = useMemo(() => {
    if (!selectedDate || !selectedTime) return null
    return googleCalendarUrl({
      storeName: locationName ?? 'Kawai',
      isoDate: toIsoDate(selectedDate),
      time: selectedTime,
      details:
        'Your Back to School appointment. The pianos will be uncovered and in tune when you arrive.',
    })
  }, [selectedDate, selectedTime, locationName])

  function update(field: keyof ContactForm) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }))
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return

    // Contact errors and a missing slot surface together — a visitor who filled
    // nothing in should be told everything that is missing in one pass, not led
    // through it a field at a time.
    const errs = validate(form)
    setErrors(errs)
    const missingSlot = !selectedDate || !selectedTime
    if (Object.keys(errs).length > 0 || missingSlot) {
      setSubmitError(missingSlot ? 'Pick a day and a time above.' : null)
      return
    }

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

  const panel =
    'relative bg-kawai-pearl border border-kawai-black/12 shadow-[0_18px_50px_rgba(30,27,22,0.10)] overflow-hidden'

  // ── Confirmed ──
  if (booked && selectedDate && selectedTime) {
    return (
      <div className={`${panel} ${className}`}>
        <div className="h-[4px] bg-kawai-red relative z-10" />
        <RuledGround marginRule={false} />
        <div className="relative px-6 sm:px-10 py-12 text-center">
          {/* Stamped rather than ticked — the confirmation is an invitation,
              and this is the mark on it. */}
          <div className="w-12 h-12 bg-kawai-red flex items-center justify-center mx-auto mb-6">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75 10 18.25 19.5 6.75" />
            </svg>
          </div>
          <p
            className="text-kawai-black uppercase"
            style={{
              fontFamily: OSWALD,
              fontSize: 'clamp(1.4rem, 4vw, 2rem)',
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
          <p className="text-kawai-charcoal/65 text-sm leading-relaxed max-w-sm mx-auto mb-8">
            Your official invitation is on its way to{' '}
            <span className="text-kawai-black">{form.email}</span> —{' '}
            {locationName ?? 'the showroom'} will confirm the time from there. Your rebate is held
            either way until {DEADLINE_LONG}.
          </p>

          {/* Straight into their calendar, before the tab is closed and the
              appointment lives only in an inbox. */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <a
              href={appointmentIcsUrl({
                storeslug,
                isoDate: toIsoDate(selectedDate),
                time: selectedTime,
              })}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-kawai-black hover:bg-kawai-charcoal text-kawai-pearl text-xs tracking-[0.16em] uppercase font-semibold transition-colors"
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
                className="inline-flex items-center justify-center px-6 py-4 border border-kawai-black/20 hover:border-kawai-red/60 hover:text-kawai-red text-kawai-black text-xs tracking-[0.16em] uppercase font-semibold transition-colors"
              >
                Google Calendar
              </a>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── The ask ──
  return (
    <form onSubmit={handleSubmit} noValidate className={`${panel} ${className}`}>
      <div className="h-[4px] bg-kawai-red relative z-10" />
      <RuledGround marginRule={false} />

      <div className="relative grid lg:grid-cols-2">
        {/* Who */}
        <div className="px-6 sm:px-9 py-8 lg:border-r border-kawai-black/10">
          <p
            className="text-kawai-charcoal/50 uppercase mb-5"
            style={{ fontFamily: OSWALD, fontSize: '0.66rem', letterSpacing: '0.22em' }}
          >
            01 — Your details
          </p>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="First name" htmlFor="bts2-firstName" required error={errors.firstName}>
                <Input
                  id="bts2-firstName"
                  type="text"
                  placeholder="Jane"
                  value={form.firstName}
                  onChange={update('firstName')}
                  error={!!errors.firstName}
                  autoComplete="given-name"
                />
              </Field>
              <Field label="Last name" htmlFor="bts2-lastName" required error={errors.lastName}>
                <Input
                  id="bts2-lastName"
                  type="text"
                  placeholder="Smith"
                  value={form.lastName}
                  onChange={update('lastName')}
                  error={!!errors.lastName}
                  autoComplete="family-name"
                />
              </Field>
            </div>
            <Field label="Email address" htmlFor="bts2-email" required error={errors.email}>
              <Input
                id="bts2-email"
                type="email"
                placeholder="jane@example.com"
                value={form.email}
                onChange={update('email')}
                error={!!errors.email}
                autoComplete="email"
              />
            </Field>
            <Field label="Phone number" htmlFor="bts2-phone">
              <Input
                id="bts2-phone"
                type="tel"
                placeholder="(555) 000-0000"
                value={form.phone}
                onChange={update('phone')}
                autoComplete="tel"
              />
            </Field>
          </div>
        </div>

        {/* When */}
        <div className="px-6 sm:px-9 py-8 border-t lg:border-t-0 border-kawai-black/10">
          <p
            className="text-kawai-charcoal/50 uppercase mb-5"
            style={{ fontFamily: OSWALD, fontSize: '0.66rem', letterSpacing: '0.22em' }}
          >
            02 — Pick a day &amp; time
          </p>

          <SeptemberPicker
            hours={hours}
            selected={selectedDate}
            onSelect={(d) => {
              setSelectedDate(d)
              setSelectedTime(null)
              setSubmitError(null)
            }}
          />

          <div className="mt-5 pt-5 border-t border-kawai-black/10">
            <p
              className="text-kawai-charcoal/60 uppercase mb-3"
              style={{ fontFamily: OSWALD, fontSize: '0.66rem', letterSpacing: '0.2em' }}
            >
              {selectedDate
                ? `Times for ${formatLongDate(selectedDate).split(',')[0]}, September ${selectedDate.getDate()}`
                : 'Times'}
            </p>
            {selectedDate ? (
              <SlotGrid
                slots={slots}
                selected={selectedTime}
                onSelect={(slot) => {
                  setSelectedTime(slot)
                  setSubmitError(null)
                }}
              />
            ) : (
              // The row is held rather than hidden so choosing a day doesn't
              // push the submit button down the screen mid-decision.
              <p className="text-kawai-charcoal/45 text-sm">Circle a day above to see its times.</p>
            )}
          </div>
        </div>
      </div>

      {/* The ask */}
      <div className="relative px-6 sm:px-9 py-7 border-t border-kawai-black/10 bg-white/60">
        {submitError && (
          <p role="alert" className="mb-4 text-sm text-kawai-red text-center">
            {submitError}
          </p>
        )}

        <button type="submit" disabled={submitting} className={`${primaryButton} sm:w-auto sm:px-14 sm:mx-auto sm:flex`}>
          {submitting ? 'Sending…' : 'Request this time'}
          {!submitting && (
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          )}
        </button>

        <p className="mt-4 text-kawai-charcoal/45 text-[0.68rem] leading-relaxed text-center max-w-md mx-auto">
          By continuing you agree to receive emails from Kawai Piano about your appointment and
          offers. Unsubscribe any time.
        </p>
      </div>
    </form>
  )
}
