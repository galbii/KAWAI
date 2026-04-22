'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { captureBookingLead } from '@/lib/actions/booking-lead'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BookingModalProps {
  open: boolean
  onClose: () => void
  calendlyUrl?: string | null | undefined
  locationName?: string | null | undefined
  storeslug?: string | null | undefined
}

interface ContactForm {
  firstName: string
  lastName: string
  email: string
  phone: string
}

type FormErrors = Partial<Record<keyof ContactForm, string>>

// ─── Pure helpers ─────────────────────────────────────────────────────────────

function toE164US(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return ''
  // Already has US country code (11 digits starting with 1)
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  // Standard 10-digit US number
  if (digits.length === 10) return `+1${digits}`
  // Best effort — prepend +1
  return `+1${digits}`
}

function buildCalendlyUrl(base: string, form: ContactForm): string {
  const phone = toE164US(form.phone)
  const params = new URLSearchParams({
    name: `${form.firstName} ${form.lastName}`.trim(),
    email: form.email,
    ...(phone ? { a1: phone } : {}),
    hide_gdpr_banner: '1',
  })
  return `${base}${base.includes('?') ? '&' : '?'}${params.toString()}`
}

function validate(form: ContactForm): FormErrors {
  const errors: FormErrors = {}
  if (!form.firstName.trim()) errors.firstName = 'Required'
  if (!form.lastName.trim()) errors.lastName = 'Required'
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = 'Enter a valid email address'
  return errors
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Field({
  label,
  required,
  error,
  children,
  half,
}: {
  label: string
  required?: boolean | undefined
  error?: string | undefined
  children: React.ReactNode
  half?: boolean | undefined
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', half && 'min-w-0')}>
      <label className="text-[0.65rem] tracking-[0.18em] uppercase font-semibold text-kawai-charcoal/50 select-none">
        {label}
        {required && <span className="text-kawai-red ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-kawai-red text-xs flex items-center gap-1">
          <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}

function Input({
  error,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      {...props}
      className={cn(
        'w-full px-4 py-3 text-[16px] sm:text-sm text-kawai-black bg-white border rounded-sm outline-none transition-all duration-200',
        'placeholder:text-kawai-charcoal/30 font-[family-name:var(--font-brand-sans)]',
        error
          ? 'border-kawai-red/60 ring-1 ring-kawai-red/20 bg-kawai-red-50'
          : 'border-kawai-neutral hover:border-kawai-charcoal/40 focus:border-kawai-red/50 focus:ring-1 focus:ring-kawai-red/15',
        className,
      )}
    />
  )
}

function ProgressBar({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-[2px] bg-kawai-neutral overflow-hidden rounded-full">
        <div
          className="h-full bg-kawai-red transition-all duration-500 ease-[var(--ease-elegant)]"
          style={{ width: step === 1 ? '50%' : '100%' }}
        />
      </div>
      <span className="text-[0.62rem] tracking-[0.15em] text-kawai-charcoal/35 uppercase font-medium whitespace-nowrap">
        {step} / 2
      </span>
    </div>
  )
}

function SakuraMark() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-5 h-5 text-kawai-red" aria-hidden>
      {[0, 72, 144, 216, 288].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 20 20)`}>
          <ellipse cx="20" cy="11" rx="5" ry="9" fill="currentColor" fillOpacity="0.9" />
          <ellipse cx="20" cy="5.5" rx="2" ry="2.5" fill="white" fillOpacity="0.4" />
        </g>
      ))}
      <circle cx="20" cy="20" r="4" fill="white" fillOpacity="0.5" />
      <circle cx="20" cy="20" r="2.5" fill="currentColor" />
    </svg>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function BookingModal({ open, onClose, calendlyUrl, locationName, storeslug }: BookingModalProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [form, setForm] = useState<ContactForm>({ firstName: '', lastName: '', email: '', phone: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [iframeLoading, setIframeLoading] = useState(true)

  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open || !mounted) return null

  const embedUrl = calendlyUrl ? buildCalendlyUrl(calendlyUrl, form) : null

  type StringFormField = 'firstName' | 'lastName' | 'email' | 'phone'

  function update(field: StringFormField) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(f => ({ ...f, [field]: e.target.value }))
      if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  function handleContinue() {
    const errs = validate(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setIframeLoading(true)
    setStep(2)
    // Fire-and-forget CRM capture
    captureBookingLead({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone ? toE164US(form.phone) : undefined,
      storeslug,
    })
  }

  function handleBack() { setStep(1) }

  function handleClose() {
    setStep(1)
    setForm({ firstName: '', lastName: '', email: '', phone: '' })
    setErrors({})
    setIframeLoading(true)
    onClose()
  }

  return createPortal(
    <>
      <style>{`
        @keyframes bm-overlay-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes bm-panel-in {
          0%   { opacity: 0; transform: scale(0.91) translateY(28px); }
          60%  { opacity: 1; transform: scale(1.018) translateY(-4px); }
          78%  { transform: scale(0.996) translateY(1px); }
          100% { transform: scale(1) translateY(0); }
        }
        @keyframes bm-step-in {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .bm-overlay { animation: bm-overlay-in 0.22s ease both; }
        .bm-panel   { animation: bm-panel-in 0.5s cubic-bezier(0.34,1.2,0.64,1) both; }
        .bm-step    { animation: bm-step-in 0.38s cubic-bezier(0.22,1,0.36,1) 0.12s both; }
      `}</style>

      {/* Overlay */}
      <div
        className="bm-overlay fixed inset-0 z-[9010] bg-kawai-black/50 backdrop-blur-md"
        onClick={handleClose}
        aria-hidden
      />

      {/* Centering shell — sits above the overlay */}
      <div
        className="fixed inset-0 z-[9011] flex items-center justify-center p-4 sm:p-8 pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-label="Book Your Appointment"
      >
      {/* Panel */}
      <div
        className="bm-panel pointer-events-auto w-full max-w-[440px] bg-white rounded-2xl overflow-hidden shadow-[0_40px_100px_rgba(30,27,22,0.28),0_12px_32px_rgba(30,27,22,0.14)] flex flex-col"
        style={{ maxHeight: '90dvh' }}
      >
        {/* Red accent strip */}
        <div className="h-[3px] bg-kawai-red flex-shrink-0" />

        {/* Header */}
        <div className="relative px-6 pt-5 pb-5 flex-shrink-0 border-b border-kawai-neutral/60">
          {/* Left red strip — desktop only */}
          <div className="hidden sm:block absolute left-0 inset-y-0 w-[3px] bg-kawai-red" />

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-2">
                <SakuraMark />
                <span className="text-kawai-red text-[0.62rem] tracking-[0.22em] uppercase font-semibold">
                  {locationName ?? 'Kawai Piano'}
                </span>
              </div>

              {/* Title */}
              <h2
                className="font-[family-name:var(--font-family-cormorant)] font-normal text-kawai-black leading-tight mb-4"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 1.9rem)' }}
              >
                {step === 1 ? 'Book Your Appointment' : 'Select a Time'}
              </h2>

              {/* Progress */}
              <ProgressBar step={step} />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1 mt-0.5 flex-shrink-0">
              {step === 2 && (
                <button
                  onClick={handleBack}
                  className="w-8 h-8 flex items-center justify-center text-kawai-charcoal/40 hover:text-kawai-black hover:bg-kawai-neutral/40 transition-colors rounded-full"
                  aria-label="Back to contact details"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                  </svg>
                </button>
              )}
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center text-kawai-charcoal/40 hover:text-kawai-black hover:bg-kawai-neutral/40 transition-colors rounded-full"
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">

          {/* ── Step 1: Contact details ── */}
          {step === 1 && (
            <div className="bm-step px-6 py-7">

              {/* Info banner */}
              <div className="flex items-start gap-3 bg-kawai-red-50 border border-kawai-red/15 rounded-lg px-4 py-3 mb-7">
                <svg className="w-4 h-4 text-kawai-red flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                <p className="text-kawai-charcoal/65 text-xs leading-relaxed">
                  Your appointment confirmation will be sent to your email address.
                </p>
              </div>

              {/* Form fields */}
              <div className="space-y-5 mb-7">
                {/* Name row */}
                <div className="grid grid-cols-2 gap-4">
                  <Field label="First Name" required error={errors.firstName} half>
                    <Input
                      type="text"
                      placeholder="Jane"
                      value={form.firstName}
                      onChange={update('firstName')}
                      error={!!errors.firstName}
                      autoComplete="given-name"
                      autoFocus
                    />
                  </Field>
                  <Field label="Last Name" required error={errors.lastName} half>
                    <Input
                      type="text"
                      placeholder="Smith"
                      value={form.lastName}
                      onChange={update('lastName')}
                      error={!!errors.lastName}
                      autoComplete="family-name"
                    />
                  </Field>
                </div>

                <Field label="Email Address" required error={errors.email}>
                  <Input
                    type="email"
                    placeholder="jane@example.com"
                    value={form.email}
                    onChange={update('email')}
                    error={!!errors.email}
                    autoComplete="email"
                  />
                </Field>

                <Field label="Phone Number">
                  <Input
                    type="tel"
                    placeholder="(555) 000-0000"
                    value={form.phone}
                    onChange={update('phone')}
                    autoComplete="tel"
                  />
                </Field>
              </div>

              {/* CTA */}
              <button
                onClick={handleContinue}
                className="w-full flex items-center justify-between px-6 py-4 bg-kawai-red hover:bg-kawai-red-700 text-white text-sm tracking-[0.15em] uppercase font-semibold transition-colors rounded-sm group relative overflow-hidden shadow-brand-red-glow"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                <span className="relative z-10">Continue to Book</span>
                <svg className="w-4 h-4 relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>

              {/* Implicit consent disclosure */}
              <p className="mt-4 text-kawai-charcoal/40 text-[0.68rem] leading-relaxed text-center">
                By submitting this form, you agree to receive promotional emails and
                updates from Kawai Piano. You may unsubscribe at any time.
              </p>

              {/* Offer reminder */}
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="w-1 h-1 rounded-full bg-kawai-red animate-pulse" />
                <p className="text-kawai-charcoal/35 text-[0.65rem] tracking-[0.1em] uppercase">
                  Spring offer ends May 17, 2026
                </p>
              </div>
            </div>
          )}

          {/* ── Step 2: Calendly or confirmation ── */}
          {step === 2 && (
            <div className="bm-step">
              {embedUrl ? (
                <div className="relative bg-white">
                  {iframeLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10" style={{ minHeight: 520 }}>
                      <div className="mb-5">
                        <SakuraMark />
                      </div>
                      <div className="w-6 h-6 rounded-full border-2 border-kawai-neutral border-t-kawai-red animate-spin mb-3" />
                      <p className="text-kawai-charcoal/35 text-xs tracking-[0.2em] uppercase">
                        Loading your calendar…
                      </p>
                    </div>
                  )}
                  <iframe
                    src={embedUrl}
                    className={cn('w-full border-0 block', iframeLoading && 'invisible')}
                    style={{ minHeight: 580 }}
                    title="Book a trade-in appointment"
                    onLoad={() => setIframeLoading(false)}
                    allow="camera; microphone"
                  />
                </div>
              ) : (
                /* Confirmation (no Calendly URL configured) */
                <div className="px-6 py-12 text-center">
                  <div className="w-14 h-14 rounded-full bg-kawai-red flex items-center justify-center mx-auto mb-6 shadow-brand-red-glow">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  </div>

                  <h3
                    className="font-[family-name:var(--font-family-cormorant)] font-normal text-kawai-black mb-3"
                    style={{ fontSize: '1.75rem' }}
                  >
                    We&apos;ll be in touch, {form.firstName}.
                  </h3>

                  <p className="text-kawai-charcoal/55 text-sm leading-relaxed mb-1">
                    Appointment details will be sent to
                  </p>
                  <p className="text-kawai-black font-medium text-sm mb-8">{form.email}</p>

                  <div className="flex items-center gap-3 bg-kawai-pearl/60 border border-kawai-neutral/60 rounded-lg px-4 py-3 mb-8 text-left">
                    <SakuraMark />
                    <div>
                      <p className="text-kawai-black text-xs font-semibold">Spring Trade-In Bonus</p>
                      <p className="text-kawai-charcoal/50 text-xs">Up to $500 over any appraisal · ends May 17</p>
                    </div>
                  </div>

                  <button
                    onClick={handleClose}
                    className="w-full px-6 py-3.5 border border-kawai-neutral hover:border-kawai-red/40 hover:bg-kawai-red-50 text-kawai-black text-sm tracking-[0.12em] uppercase font-medium transition-all rounded-sm"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    </>,
    document.body
  )
}
