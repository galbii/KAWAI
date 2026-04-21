'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useFormState } from 'react-dom'
import { submitSimpleCustomerSignup } from '@/lib/actions/simple-customer-signup'
import { FormField } from '@/components/ui/form-field'
import { FormAlert } from '@/components/ui/form-alert'
import { UserIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import type { GrandSaleProduct } from '@/lib/payload/queries'

interface SaleLeadFormProps {
  storeslug: string
  products: GrandSaleProduct[]
}

const schema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  pianoInterest: z.string().optional(),
  subscribeToUpdates: z.boolean().optional(),
})

type FormData = z.infer<typeof schema>

export function SaleLeadForm({ storeslug, products }: SaleLeadFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const [formState, formAction] = useFormState(submitSimpleCustomerSignup, null)

  const onSubmit = async (data: FormData) => {
    const formData = new FormData()
    formData.append('firstName', data.firstName)
    formData.append('lastName', data.lastName)
    formData.append('email', data.email)
    formData.append('storefrontSlug', storeslug)
    formData.append('subscribeToUpdates', String(data.subscribeToUpdates ?? true))

    const tags = ['grand-spring-sale']
    if (data.pianoInterest) tags.push(`interest:${data.pianoInterest}`)
    formData.append('customTags', tags.join(','))

    setIsSubmitting(true)
    try {
      await formAction(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (formState?.success) reset()
  }, [formState, reset])

  return (
    <section id="grand-lead-form" className="py-16 md:py-24 bg-kawai-black/90 backdrop-blur-md">
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-kawai-red/70 text-xs tracking-[0.3em] uppercase mb-4">
            Get Personalized Pricing
          </p>
          <h2 className="text-3xl md:text-4xl font-light font-[family-name:var(--font-brand-luxury)] text-white mb-4">
            Let&apos;s find your grand.
          </h2>
          <p className="text-kawai-pearl/50 text-base font-light max-w-md mx-auto">
            Leave your details and we&apos;ll follow up with financing specifics, availability,
            and a personalized recommendation — no obligation.
          </p>
        </div>

        {formState?.success ? (
          <div className="bg-white/5 border border-white/10 rounded-sm p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-kawai-red/10 border border-kawai-red/20 flex items-center justify-center mx-auto mb-5">
              <svg className="w-6 h-6 text-kawai-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h3 className="text-white text-xl font-light font-[family-name:var(--font-brand-serif)] mb-3">
              We&apos;ll be in touch soon.
            </h3>
            <p className="text-kawai-pearl/50 text-sm">
              A member of our team will reach out within one business day with personalized
              details for the Grand Spring Sale.
            </p>
          </div>
        ) : (
          <div className="bg-white/[0.04] border border-white/10 rounded-sm p-8 md:p-10">
            {formState && !formState.success && (
              <FormAlert
                variant="error"
                title="Something went wrong"
                message={formState.message}
                className="mb-6"
              />
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  name="firstName"
                  label="First Name"
                  type="text"
                  placeholder="Jane"
                  required
                  icon={UserIcon}
                  {...(errors.firstName && { error: errors.firstName })}
                  register={register}
                />
                <FormField
                  name="lastName"
                  label="Last Name"
                  type="text"
                  placeholder="Smith"
                  required
                  icon={UserIcon}
                  {...(errors.lastName && { error: errors.lastName })}
                  register={register}
                />
              </div>

              <FormField
                name="email"
                label="Email Address"
                type="email"
                placeholder="jane@example.com"
                required
                icon={EnvelopeIcon}
                {...(errors.email && { error: errors.email })}
                register={register}
              />

              {products.length > 0 && (
                <div>
                  <label className="block text-kawai-pearl/60 text-sm mb-1.5">
                    Which model interests you? <span className="text-kawai-pearl/30">(optional)</span>
                  </label>
                  <select
                    {...register('pianoInterest')}
                    className="w-full bg-white/5 border border-white/10 text-kawai-pearl rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-kawai-red/50 transition-colors"
                  >
                    <option value="">Not sure yet — I&apos;d like help choosing</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.model}>
                        {p.name ?? p.model}{p.price?.msrp ? ` — MSRP ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(p.price.msrp)}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  {...register('subscribeToUpdates')}
                  className="mt-0.5 w-4 h-4 text-kawai-red border-white/20 rounded bg-white/5 focus:ring-kawai-red"
                />
                <span className="text-kawai-pearl/50 text-sm leading-snug">
                  Notify me about upcoming events, new models, and exclusive offers
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-kawai-red hover:bg-kawai-red/90 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm tracking-[0.1em] uppercase font-medium transition-colors rounded-sm mt-2"
              >
                {isSubmitting ? 'Sending…' : 'Get personalized pricing details'}
              </button>

              <p className="text-kawai-pearl/30 text-xs text-center">
                Your information is private. We&apos;ll only use it to follow up about this offer.
              </p>
            </form>
          </div>
        )}
      </div>
    </section>
  )
}
