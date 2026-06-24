'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  CheckCircleIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { Modal } from '@/components/ui/modal'
import { FormField } from '@/components/ui/form-field'
import { DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { BrandEyebrow } from './brand-ui'
import { offerCopy } from './scenes'

/**
 * Dealer-discount signup form. PROTOTYPE — validates and shows a success state,
 * but does not yet persist anything. The submit handler logs the payload and
 * leaves a single, obvious hook for the real dealer-routing flow.
 */

const offerSchema = z.object({
  fullName: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(7, 'Enter a valid phone number'),
  zip: z.string().regex(/^\d{5}$/, 'Enter a 5-digit ZIP code'),
})

export type OfferFormValues = z.infer<typeof offerSchema>

type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function OfferModal({ isOpen, onClose }: Props) {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
    defaultValues: { fullName: '', email: '', phone: '', zip: '' },
  })

  // Reset back to the form whenever the modal is fully closed, so a reopen
  // never lands on a stale success screen.
  useEffect(() => {
    if (isOpen) return undefined
    const t = setTimeout(() => {
      setSubmitted(false)
      reset()
    }, 200)
    return () => clearTimeout(t)
  }, [isOpen, reset])

  const onSubmit = async (values: OfferFormValues) => {
    // Simulate a network round-trip so the loading state is visible.
    await new Promise((r) => setTimeout(r, 600))

    // TODO: wire to the real dealer-routing flow — resolve ZIP → nearest
    // Authorized dealer, then upsert the lead (Shopify upsertCustomer with the
    // dealer slug as a tag, mirroring src/lib/actions/contact-form.ts).
    console.log('[OfferModal] prototype submission', values)

    setSubmitted(true)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      className="bg-kawai-pearl text-kawai-black"
    >
      {submitted ? (
        <div className="flex flex-col items-center py-6 text-center">
          <CheckCircleIcon className="mb-5 h-14 w-14 text-kawai-red" />
          <DialogTitle className="font-[family-name:var(--font-brand-serif)] text-3xl font-light tracking-tight text-kawai-black">
            {offerCopy.success.headline}
          </DialogTitle>
          <DialogDescription className="mt-3 max-w-sm text-base leading-relaxed text-kawai-charcoal">
            {offerCopy.success.body}
          </DialogDescription>
          <button
            type="button"
            onClick={onClose}
            className="mt-8 font-[family-name:var(--font-brand-sans)] text-sm font-semibold uppercase tracking-[0.12em] text-kawai-red transition-colors hover:text-kawai-red/75"
          >
            Done
          </button>
        </div>
      ) : (
        <div className="py-1">
          <div className="mb-5">
            <BrandEyebrow className="text-kawai-red/80">{offerCopy.eyebrow}</BrandEyebrow>
          </div>

          <DialogTitle className="font-[family-name:var(--font-brand-serif)] text-[clamp(1.75rem,4vw,2.25rem)] font-light leading-[1.1] tracking-tight text-kawai-black">
            {offerCopy.headline}
          </DialogTitle>
          <DialogDescription className="mt-3 text-sm leading-relaxed text-kawai-charcoal">
            {offerCopy.body}
          </DialogDescription>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
            <FormField
              name="fullName"
              label="Full Name"
              placeholder="Jane Doe"
              required
              icon={UserIcon}
              register={register}
              error={errors.fullName}
            />
            <FormField
              name="email"
              label="Email"
              type="email"
              placeholder="jane@example.com"
              required
              icon={EnvelopeIcon}
              register={register}
              error={errors.email}
            />
            <FormField
              name="phone"
              label="Phone"
              type="tel"
              placeholder="(555) 123-4567"
              required
              icon={PhoneIcon}
              register={register}
              error={errors.phone}
            />
            <FormField
              name="zip"
              label="ZIP Code"
              placeholder="90210"
              required
              icon={MapPinIcon}
              register={register}
              error={errors.zip}
              helpText={offerCopy.zipHelp}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative mt-2 inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-kawai-red px-7 py-3.5 font-[family-name:var(--font-brand-sans)] text-sm font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-kawai-red/90 hover:shadow-[0_8px_32px_rgba(225,25,34,0.45)] disabled:opacity-60"
            >
              <span className="relative z-10">
                {isSubmitting ? 'Submitting…' : offerCopy.submitLabel}
              </span>
            </button>

            <p className="pt-1 text-center text-[11px] leading-relaxed text-kawai-charcoal/60">
              By signing up you agree to be contacted by your local Authorized Kawai dealer.
            </p>
          </form>
        </div>
      )}
    </Modal>
  )
}
