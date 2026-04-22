'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useFormState } from 'react-dom'
import { submitSimpleCustomerSignup } from '@/lib/actions/simple-customer-signup'
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

function SakuraIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      {[0, 72, 144, 216, 288].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 20 20)`}>
          <ellipse cx="20" cy="11" rx="5" ry="9" fill="currentColor" fillOpacity="0.9" />
          <ellipse cx="20" cy="5.5" rx="2" ry="2.5" fill="white" fillOpacity="0.35" />
        </g>
      ))}
      <circle cx="20" cy="20" r="4" fill="white" fillOpacity="0.5" />
      <circle cx="20" cy="20" r="2.5" fill="currentColor" />
    </svg>
  )
}

const INPUT_BASE =
  'w-full bg-white border border-kawai-neutral text-kawai-black placeholder:text-kawai-charcoal/35 rounded-sm px-4 py-3 text-sm transition-colors focus:outline-none focus:border-kawai-red/60 focus:ring-1 focus:ring-kawai-red/20 font-[family-name:var(--font-brand-sans)]'

const INPUT_ERROR =
  'border-kawai-red/60 focus:border-kawai-red focus:ring-kawai-red/20'

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
    <section id="grand-lead-form" className="relative bg-kawai-pearl py-16 md:py-24 overflow-hidden">

      {/* Brand-anchoring red rule at top */}
      <div className="absolute top-0 inset-x-0 h-[3px] bg-kawai-red" />

      {/* Subtle grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
        aria-hidden
      />

      <div className="relative max-w-xl mx-auto px-6">

        {/* Section header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2.5 mb-5">
            <SakuraIcon className="w-4 h-4 text-kawai-red/50" />
            <span className="text-kawai-red/70 text-xs tracking-[0.28em] uppercase font-medium font-[family-name:var(--font-brand-sans)]">
              Book Your Appointment
            </span>
            <SakuraIcon className="w-4 h-4 text-kawai-red/50" />
          </div>

          <h2
            className="font-kawai-script text-kawai-black leading-[1.05] mb-4"
            style={{ fontSize: 'clamp(3rem, 8vw, 5rem)' }}
          >
            Let&apos;s find your grand.
          </h2>

          <p className="text-kawai-charcoal/60 text-base leading-relaxed max-w-md mx-auto font-[family-name:var(--font-brand-sans)]">
            Leave your details and we&apos;ll follow up with financing specifics,
            availability, and a personalized recommendation — no obligation.
          </p>
        </div>

        {/* Card */}
        {formState?.success ? (
          <div className="bg-white border border-kawai-neutral/60 shadow-brand-medium rounded-sm p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-kawai-red/8 border border-kawai-red/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-5 h-5 text-kawai-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <div className="w-8 h-[2px] bg-kawai-red mx-auto mb-5" aria-hidden />
            <h3
              className="font-kawai-script text-kawai-black mb-3 leading-none"
              style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
            >
              We&apos;ll be in touch soon.
            </h3>
            <p className="text-kawai-charcoal/55 text-sm leading-relaxed font-[family-name:var(--font-brand-sans)] max-w-xs mx-auto">
              A member of our team will reach out within one business day with personalized
              details for the Grand Spring Sale.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-kawai-neutral/60 shadow-brand-medium rounded-sm p-8 md:p-10">

            {formState && !formState.success && (
              <div className="mb-6 px-4 py-3 bg-kawai-red/5 border border-kawai-red/20 rounded-sm">
                <p className="text-kawai-red text-sm font-medium font-[family-name:var(--font-brand-sans)]">
                  {formState.message ?? 'Something went wrong. Please try again.'}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              {/* First + Last name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-kawai-charcoal/70 text-sm font-medium mb-1.5 font-[family-name:var(--font-brand-sans)]">
                    First Name <span className="text-kawai-red">*</span>
                  </label>
                  <input
                    {...register('firstName')}
                    type="text"
                    placeholder="Jane"
                    className={`${INPUT_BASE} ${errors.firstName ? INPUT_ERROR : ''}`}
                  />
                  {errors.firstName && (
                    <p className="mt-1.5 text-kawai-red text-xs font-[family-name:var(--font-brand-sans)]">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-kawai-charcoal/70 text-sm font-medium mb-1.5 font-[family-name:var(--font-brand-sans)]">
                    Last Name <span className="text-kawai-red">*</span>
                  </label>
                  <input
                    {...register('lastName')}
                    type="text"
                    placeholder="Smith"
                    className={`${INPUT_BASE} ${errors.lastName ? INPUT_ERROR : ''}`}
                  />
                  {errors.lastName && (
                    <p className="mt-1.5 text-kawai-red text-xs font-[family-name:var(--font-brand-sans)]">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-kawai-charcoal/70 text-sm font-medium mb-1.5 font-[family-name:var(--font-brand-sans)]">
                  Email Address <span className="text-kawai-red">*</span>
                </label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="jane@example.com"
                  className={`${INPUT_BASE} ${errors.email ? INPUT_ERROR : ''}`}
                />
                {errors.email && (
                  <p className="mt-1.5 text-kawai-red text-xs font-[family-name:var(--font-brand-sans)]">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Piano interest */}
              {products.length > 0 && (
                <div>
                  <label className="block text-kawai-charcoal/70 text-sm font-medium mb-1.5 font-[family-name:var(--font-brand-sans)]">
                    Which model interests you?{' '}
                    <span className="text-kawai-charcoal/35 font-normal">(optional)</span>
                  </label>
                  <select
                    {...register('pianoInterest')}
                    className={`${INPUT_BASE} cursor-pointer`}
                  >
                    <option value="">Not sure yet — I&apos;d like help choosing</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.model}>
                        {p.name ?? p.model}
                        {p.price?.msrp
                          ? ` — MSRP ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(p.price.msrp)}`
                          : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Divider */}
              <div className="h-px bg-kawai-neutral/50" />

              {/* Subscribe checkbox */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  defaultChecked
                  {...register('subscribeToUpdates')}
                  className="mt-0.5 w-4 h-4 accent-kawai-red border-kawai-neutral rounded flex-shrink-0"
                />
                <span className="text-kawai-charcoal/55 text-sm leading-snug group-hover:text-kawai-charcoal/75 transition-colors font-[family-name:var(--font-brand-sans)]">
                  Notify me about upcoming events, new models, and exclusive offers
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-kawai-red hover:bg-kawai-red/90 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm tracking-[0.12em] uppercase font-medium transition-colors rounded-sm shadow-[0_4px_20px_rgba(225,25,34,0.25)] font-[family-name:var(--font-brand-sans)] mt-1"
              >
                {isSubmitting ? 'Sending…' : 'Get Personalized Pricing Details'}
              </button>

              <p className="text-kawai-charcoal/35 text-xs text-center font-[family-name:var(--font-brand-sans)]">
                Your information is private. We&apos;ll only use it to follow up about this offer.
              </p>
            </form>
          </div>
        )}
      </div>
    </section>
  )
}
