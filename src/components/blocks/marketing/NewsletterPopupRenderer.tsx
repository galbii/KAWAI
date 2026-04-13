'use client'

import { useEffect, useState, useCallback, useTransition, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { CheckCircleIcon, EnvelopeIcon, UserIcon } from '@heroicons/react/24/outline'
import { Modal } from '@/components/ui/modal'
import { FormField } from '@/components/ui/form-field'
import { FormAlert } from '@/components/ui/form-alert'
import { trackFormInteraction } from '@/lib/analytics/unified-tracking'
import { submitNewsletterPopupSignup } from '@/lib/actions/newsletter-popup-signup'
import type { MarketingNewsletterPopupBlock } from '@/payload-types'
import { cn } from '@/lib/utils'

const DEFAULT_STORAGE_KEY = 'kawai-newsletter-popup-shown'

// ─── Theme tokens ────────────────────────────────────────────────────────────
const THEMES = {
  light: {
    bg: '#FAF8F5',
    border: 'rgba(30,27,22,0.08)',
    accentBar: '#E11922',
    heading: '#1E1B16',
    subheading: '#6B7280',
    privacyText: 'rgba(30,27,22,0.45)',
    successIcon: '#E11922',
    submitBg: '#E11922',
    submitBgHover: '#c7151c',
    submitFg: '#FFFFFF',
    inputBg: '#FFFFFF',
    inputBorder: 'rgba(30,27,22,0.15)',
  },
  dark: {
    bg: '#1E1B16',
    border: 'rgba(255,255,255,0.08)',
    accentBar: '#d5c78c',
    heading: '#FFFFFF',
    subheading: '#9CA3AF',
    privacyText: 'rgba(255,255,255,0.38)',
    successIcon: '#d5c78c',
    submitBg: '#d5c78c',
    submitBgHover: '#c4b57c',
    submitFg: '#1E1B16',
    inputBg: 'rgba(255,255,255,0.06)',
    inputBorder: 'rgba(255,255,255,0.12)',
  },
  red: {
    bg: '#E11922',
    border: 'rgba(255,255,255,0.15)',
    accentBar: '#FFFFFF',
    heading: '#FFFFFF',
    subheading: 'rgba(255,255,255,0.82)',
    privacyText: 'rgba(255,255,255,0.55)',
    successIcon: '#FFFFFF',
    submitBg: '#FFFFFF',
    submitBgHover: '#F0F0F0',
    submitFg: '#E11922',
    inputBg: 'rgba(255,255,255,0.15)',
    inputBorder: 'rgba(255,255,255,0.25)',
  },
} as const

// ─── Modal size → max-width class ────────────────────────────────────────────
const MODAL_SIZE = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
} as const

interface FormValues {
  email: string
  firstName?: string
  lastName?: string
}

export function NewsletterPopupRenderer({
  content,
  form: formConfig,
  behavior,
  appearance,
  tracking,
}: MarketingNewsletterPopupBlock) {
  const [isOpen, setIsOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const hasTrackedOpen = useRef(false)
  const scrollListenerRef = useRef<(() => void) | null>(null)

  const theme = THEMES[(appearance?.theme as keyof typeof THEMES) ?? 'light']
  const modalSize = MODAL_SIZE[(appearance?.size as keyof typeof MODAL_SIZE) ?? 'md']

  const storageKey =
    (behavior?.storageKey && behavior.storageKey.trim())
      ? behavior.storageKey.trim()
      : DEFAULT_STORAGE_KEY

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()

  // ─── Show popup logic ─────────────────────────────────────────────────────
  const openPopup = useCallback(() => {
    if (isOpen || submitted) return
    if (behavior?.showOncePerSession !== false) {
      if (localStorage.getItem(storageKey)) return
    }
    setIsOpen(true)
  }, [isOpen, submitted, behavior?.showOncePerSession, storageKey])

  useEffect(() => {
    const delay = behavior?.autoShowDelay ?? 4000

    // Timer-based trigger
    const timer = setTimeout(openPopup, delay)

    // Scroll-based trigger (30% of page)
    if (behavior?.triggerOnScroll !== false) {
      const onScroll = () => {
        const scrolled = window.scrollY
        const total = document.documentElement.scrollHeight - window.innerHeight
        if (total > 0 && scrolled / total >= 0.3) {
          openPopup()
        }
      }
      scrollListenerRef.current = onScroll
      window.addEventListener('scroll', onScroll, { passive: true })
    }

    return () => {
      clearTimeout(timer)
      if (scrollListenerRef.current) {
        window.removeEventListener('scroll', scrollListenerRef.current)
      }
    }
  }, [openPopup, behavior?.autoShowDelay, behavior?.triggerOnScroll])

  // Track modal open
  useEffect(() => {
    if (isOpen && !hasTrackedOpen.current) {
      hasTrackedOpen.current = true
      trackFormInteraction({
        blockType: 'marketing-newsletter-popup',
        blockData: { tracking },
        action: 'form_start',
        formName: 'Newsletter Popup',
      })
    }
  }, [isOpen, tracking])

  // ─── Dismiss ──────────────────────────────────────────────────────────────
  const handleClose = useCallback(() => {
    setIsOpen(false)
    if (behavior?.showOncePerSession !== false) {
      localStorage.setItem(storageKey, '1')
    }
  }, [behavior?.showOncePerSession, storageKey])

  // ─── Submit ───────────────────────────────────────────────────────────────
  const onSubmit = (values: FormValues) => {
    setServerError(null)
    const fd = new FormData()
    fd.set('email', values.email)
    if (values.firstName) fd.set('firstName', values.firstName)
    if (values.lastName) fd.set('lastName', values.lastName)
    if (formConfig?.customTags) fd.set('customTags', formConfig.customTags)

    startTransition(async () => {
      const result = await submitNewsletterPopupSignup(null, fd)
      if (result.success) {
        setSubmitted(true)
        localStorage.setItem(storageKey, '1')
        trackFormInteraction({
          blockType: 'marketing-newsletter-popup',
          blockData: { tracking },
          action: 'form_submit',
          formName: 'Newsletter Popup',
        })
        // Auto-close after 3s
        setTimeout(() => setIsOpen(false), 3000)
      } else {
        setServerError(result.message)
      }
    })
  }

  const showFirstName = formConfig?.showFirstName !== false
  const showLastName = Boolean(formConfig?.showLastName)
  const firstNameRequired = Boolean(formConfig?.firstNameRequired)
  const lastNameRequired = Boolean(formConfig?.lastNameRequired)

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size={modalSize}
      layout="centered"
      showCloseButton
    >
      {/* Accent bar */}
      <div
        className="absolute left-0 right-0 top-0 h-1 rounded-t-lg"
        style={{ background: theme.accentBar }}
      />

      <div
        className="rounded-lg px-6 py-8"
        style={{ background: theme.bg }}
      >
        {submitted ? (
          // ─── Success state ────────────────────────────────────────────────
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <CheckCircleIcon
              className="h-14 w-14"
              style={{ color: theme.successIcon }}
            />
            <h2
              className="text-2xl font-semibold tracking-tight"
              style={{ color: theme.heading, fontFamily: 'var(--font-brand-serif)' }}
            >
              {content?.successHeading ?? "You're subscribed!"}
            </h2>
            <p
              className="max-w-xs text-sm leading-relaxed"
              style={{ color: theme.subheading }}
            >
              {content?.successMessage ??
                'Thank you for joining the Kawai community. Watch your inbox for updates.'}
            </p>
          </div>
        ) : (
          // ─── Form state ───────────────────────────────────────────────────
          <>
            {/* Heading */}
            <div className="mb-6">
              <h2
                className="mb-2 text-2xl font-semibold tracking-tight"
                style={{ color: theme.heading, fontFamily: 'var(--font-brand-serif)' }}
              >
                {content?.heading ?? 'Stay in Tune'}
              </h2>
              {content?.subheading && (
                <p className="text-sm leading-relaxed" style={{ color: theme.subheading }}>
                  {content.subheading}
                </p>
              )}
            </div>

            {/* Server error */}
            {serverError && (
              <FormAlert variant="error" message={serverError} className="mb-4" />
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
              {/* Name row */}
              {(showFirstName || showLastName) && (
                <div
                  className={cn(
                    'grid gap-3',
                    showFirstName && showLastName ? 'grid-cols-2' : 'grid-cols-1',
                  )}
                >
                  {showFirstName && (
                    <FormField
                      name="firstName"
                      label="First Name"
                      placeholder="Jane"
                      required={firstNameRequired}
                      icon={UserIcon}
                      error={errors.firstName}
                      register={register as any}
                    />
                  )}
                  {showLastName && (
                    <FormField
                      name="lastName"
                      label="Last Name"
                      placeholder="Smith"
                      required={lastNameRequired}
                      error={errors.lastName}
                      register={register as any}
                    />
                  )}
                </div>
              )}

              {/* Email */}
              <FormField
                name="email"
                label="Email Address"
                type="email"
                placeholder={formConfig?.emailPlaceholder ?? 'your@email.com'}
                required
                icon={EnvelopeIcon}
                error={errors.email}
                register={register as any}
              />

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className={cn(
                  'mt-1 w-full rounded-md py-3 text-sm font-semibold transition-colors duration-150',
                  isPending && 'cursor-not-allowed opacity-70',
                )}
                style={{
                  background: theme.submitBg,
                  color: theme.submitFg,
                }}
              >
                {isPending ? 'Subscribing…' : (formConfig?.submitText ?? 'Subscribe')}
              </button>

              {/* Privacy note */}
              {content?.privacyText && (
                <p className="text-center text-xs" style={{ color: theme.privacyText }}>
                  {content.privacyText}
                </p>
              )}
            </form>
          </>
        )}
      </div>
    </Modal>
  )
}
