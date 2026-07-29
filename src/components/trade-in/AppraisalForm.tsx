'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useFormState } from 'react-dom'
import { submitTradeInInquiry } from '@/lib/actions/trade-in-inquiry'
import { cn } from '@/lib/utils'
import type { GrandSaleProduct } from '@/lib/payload/queries'

interface AppraisalFormProps {
  storeslug: string
  products: GrandSaleProduct[]
}

const PIANO_BRANDS = [
  'Steinway & Sons', 'Yamaha', 'Kawai', 'Baldwin', 'Bösendorfer',
  'Fazioli', 'Roland', 'Casio', 'Young Chang', 'Samick', 'Other',
]

const PIANO_TYPES = [
  { value: 'upright', label: 'Upright' },
  { value: 'baby-grand', label: 'Baby Grand' },
  { value: 'grand', label: 'Grand' },
  { value: 'digital', label: 'Digital' },
  { value: 'other', label: 'Other' },
] as const

const CONDITIONS = [
  {
    value: 'excellent',
    label: 'Excellent',
    description: 'Plays beautifully, no cosmetic issues',
  },
  {
    value: 'good',
    label: 'Good',
    description: 'Plays well, minor surface wear',
  },
  {
    value: 'fair',
    label: 'Fair',
    description: 'Functional, visible wear or minor repairs needed',
  },
  {
    value: 'needs-work',
    label: 'Needs Work',
    description: 'Significant repairs or voicing needed',
  },
] as const

const clientSchema = z.object({
  firstName: z.string().min(2, 'Required — at least 2 characters'),
  lastName: z.string().min(2, 'Required — at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  pianoBrand: z.string().min(1, 'Please select a brand'),
  pianoType: z.enum(['upright', 'baby-grand', 'grand', 'digital', 'other']),
  pianoYear: z.string().optional(),
  pianoCondition: z.enum(['excellent', 'good', 'fair', 'needs-work']),
  pianoModel: z.string().optional(),
  targetGrand: z.string().optional(),
})

type FormValues = z.infer<typeof clientSchema>

function FieldError({ message }: { message?: string | undefined }) {
  if (!message) return null
  return <p className="text-kawai-red text-xs mt-1.5">{message}</p>
}

export function AppraisalForm({ storeslug, products }: AppraisalFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formState, formAction] = useFormState(submitTradeInInquiry, null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: { pianoType: 'upright', pianoCondition: 'good' },
  })

  const selectedType = watch('pianoType')
  const selectedCondition = watch('pianoCondition')

  useEffect(() => {
    if (formState?.success) reset()
  }, [formState, reset])

  const onSubmit = async (data: FormValues) => {
    const fd = new FormData()
    Object.entries(data).forEach(([k, v]) => { if (v !== undefined) fd.append(k, String(v)) })
    fd.append('storefrontSlug', storeslug)
    setIsSubmitting(true)
    try { await formAction(fd) } finally { setIsSubmitting(false) }
  }

  if (formState?.success) {
    return (
      <section id="appraisal-form" className="bg-kawai-black/90 backdrop-blur-md py-20 md:py-28">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="w-16 h-16 mx-auto mb-8 border border-kawai-red/30 rounded-lg flex items-center justify-center">
            <svg className="w-7 h-7 text-kawai-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h3
            className="font-[family-name:var(--font-family-cormorant)] text-white mb-4"
            style={{ fontSize: '2.5rem' }}
          >
            We&apos;ll be in touch.
          </h3>
          <p className="text-kawai-pearl/50 text-lg leading-relaxed max-w-md mx-auto">
            Your appraisal request has been received. A member of our team will follow up
            within one business day with a preliminary range and next steps.
          </p>
          <div className="mt-10">
            <a
              href="grand-spring-sale"
              className="inline-flex items-center gap-3 text-kawai-pearl/40 hover:text-kawai-pearl/70 transition-colors text-sm tracking-wide group"
            >
              <span>Explore the Spring Grand Collection</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="appraisal-form" className="bg-kawai-black py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-8 bg-kawai-red/40" />
            <span className="text-kawai-red/60 text-xs tracking-[0.2em] uppercase font-medium">
              Appraisal Request
            </span>
          </div>
          <h2
            className="font-[family-name:var(--font-family-cormorant)] font-normal text-white leading-tight mb-4"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.75rem)' }}
          >
            Tell us about your piano.
          </h2>
          <p className="text-kawai-pearl/45 text-base leading-relaxed max-w-lg">
            We review every inquiry personally. Fill this out and we&apos;ll follow up
            within one business day with a preliminary range — no obligation.
          </p>
        </div>

        {formState && !formState.success && (
          <div className="mb-8 p-4 border border-kawai-red/30 bg-kawai-red/5 text-kawai-pearl/80 text-sm rounded-sm">
            {formState.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
          {/* Piano details */}
          <fieldset>
            <legend className="text-kawai-pearl/30 text-xs tracking-[0.3em] uppercase mb-8 pb-3 border-b border-white/8 w-full block">
              Your Piano
            </legend>

            <div className="space-y-8">
              {/* Brand */}
              <div>
                <label className="text-kawai-pearl/60 text-sm tracking-wide block mb-3">
                  Brand <span className="text-kawai-red/60">*</span>
                </label>
                <div className="relative">
                  <select
                    {...register('pianoBrand')}
                    className="w-full bg-white/4 border border-white/10 text-kawai-pearl px-4 py-3.5 text-sm appearance-none focus:outline-none focus:border-kawai-red/40 transition-colors rounded-sm"
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                  >
                    <option value="" style={{ background: '#111' }}>Select a brand</option>
                    {PIANO_BRANDS.map((b) => (
                      <option key={b} value={b} style={{ background: '#111' }}>{b}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-kawai-pearl/30">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>
                <FieldError message={errors.pianoBrand?.message} />
              </div>

              {/* Piano type — segmented buttons */}
              <div>
                <label className="text-kawai-pearl/60 text-sm tracking-wide block mb-3">
                  Type <span className="text-kawai-red/60">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {PIANO_TYPES.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setValue('pianoType', value, { shouldValidate: true })}
                      className={cn(
                        'px-4 py-2.5 text-sm border rounded-sm transition-colors tracking-wide',
                        selectedType === value
                          ? 'bg-kawai-red border-kawai-red text-white'
                          : 'border-white/10 text-kawai-pearl/50 hover:border-white/25 hover:text-kawai-pearl/80',
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <input type="hidden" {...register('pianoType')} />
                <FieldError message={errors.pianoType?.message} />
              </div>

              {/* Model + Year inline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="appraisal-pianoModel" className="text-kawai-pearl/60 text-sm tracking-wide block mb-3">
                    Model <span className="text-kawai-pearl/25 font-light">(optional)</span>
                  </label>
                  <input
                    id="appraisal-pianoModel"
                    {...register('pianoModel')}
                    placeholder={'e.g., U1, GH1B, 5\'10"'}
                    className="w-full bg-white/4 border border-white/10 text-kawai-pearl px-4 py-3.5 text-sm focus:outline-none focus:border-kawai-red/40 transition-colors placeholder:text-kawai-pearl/20 rounded-none"
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                  />
                </div>
                <div>
                  <label htmlFor="appraisal-pianoYear" className="text-kawai-pearl/60 text-sm tracking-wide block mb-3">
                    Approximate Year <span className="text-kawai-pearl/25 font-light">(optional)</span>
                  </label>
                  <input
                    id="appraisal-pianoYear"
                    {...register('pianoYear')}
                    placeholder="e.g., 1994"
                    className="w-full bg-white/4 border border-white/10 text-kawai-pearl px-4 py-3.5 text-sm focus:outline-none focus:border-kawai-red/40 transition-colors placeholder:text-kawai-pearl/20 rounded-none"
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                  />
                </div>
              </div>

              {/* Condition — card selector */}
              <div>
                <label className="text-kawai-pearl/60 text-sm tracking-wide block mb-3">
                  Condition <span className="text-kawai-red/60">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {CONDITIONS.map(({ value, label, description }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setValue('pianoCondition', value, { shouldValidate: true })}
                      className={cn(
                        'p-4 text-left border rounded-lg transition-colors',
                        selectedCondition === value
                          ? 'border-kawai-red/50 bg-kawai-red/8'
                          : 'border-white/8 bg-white/2 hover:border-white/20',
                      )}
                      style={selectedCondition === value ? { background: 'rgba(225,25,34,0.08)' } : { background: 'rgba(255,255,255,0.02)' }}
                    >
                      <div className={cn(
                        'text-sm font-medium mb-1.5',
                        selectedCondition === value ? 'text-kawai-pearl' : 'text-kawai-pearl/55',
                      )}>
                        {label}
                      </div>
                      <div className="text-kawai-pearl/30 text-xs leading-snug">{description}</div>
                    </button>
                  ))}
                </div>
                <input type="hidden" {...register('pianoCondition')} />
                <FieldError message={errors.pianoCondition?.message} />
              </div>

              {/* Target grand */}
              {products.length > 0 && (
                <div>
                  <label htmlFor="appraisal-targetGrand" className="text-kawai-pearl/60 text-sm tracking-wide block mb-3">
                    I&apos;m hoping to upgrade to{' '}
                    <span className="text-kawai-pearl/25 font-light">(optional)</span>
                  </label>
                  <div className="relative">
                    <select
                      id="appraisal-targetGrand"
                      {...register('targetGrand')}
                      className="w-full bg-white/4 border border-white/10 text-kawai-pearl px-4 py-3.5 text-sm appearance-none focus:outline-none focus:border-kawai-red/40 transition-colors rounded-sm"
                      style={{ background: 'rgba(255,255,255,0.04)' }}
                    >
                      <option value="" style={{ background: '#111' }}>Not sure yet — help me choose</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.model} style={{ background: '#111' }}>
                          {p.name ?? p.model}
                          {p.price?.msrp
                            ? ` — ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(p.price.msrp)}`
                            : ''}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-kawai-pearl/30">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </fieldset>

          {/* Contact details */}
          <fieldset>
            <legend className="text-kawai-pearl/30 text-xs tracking-[0.3em] uppercase mb-8 pb-3 border-b border-white/8 w-full block">
              How to reach you
            </legend>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="appraisal-firstName" className="text-kawai-pearl/60 text-sm tracking-wide block mb-3">
                    First name <span className="text-kawai-red/60">*</span>
                  </label>
                  <input
                    id="appraisal-firstName"
                    {...register('firstName')}
                    placeholder="Jane"
                    className="w-full bg-white/4 border border-white/10 text-kawai-pearl px-4 py-3.5 text-sm focus:outline-none focus:border-kawai-red/40 transition-colors placeholder:text-kawai-pearl/20 rounded-none"
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                  />
                  <FieldError message={errors.firstName?.message} />
                </div>
                <div>
                  <label htmlFor="appraisal-lastName" className="text-kawai-pearl/60 text-sm tracking-wide block mb-3">
                    Last name <span className="text-kawai-red/60">*</span>
                  </label>
                  <input
                    id="appraisal-lastName"
                    {...register('lastName')}
                    placeholder="Smith"
                    className="w-full bg-white/4 border border-white/10 text-kawai-pearl px-4 py-3.5 text-sm focus:outline-none focus:border-kawai-red/40 transition-colors placeholder:text-kawai-pearl/20 rounded-none"
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                  />
                  <FieldError message={errors.lastName?.message} />
                </div>
              </div>

              <div>
                <label htmlFor="appraisal-email" className="text-kawai-pearl/60 text-sm tracking-wide block mb-3">
                  Email <span className="text-kawai-red/60">*</span>
                </label>
                <input
                  id="appraisal-email"
                  {...register('email')}
                  type="email"
                  placeholder="jane@example.com"
                  className="w-full bg-white/4 border border-white/10 text-kawai-pearl px-4 py-3.5 text-sm focus:outline-none focus:border-kawai-red/40 transition-colors placeholder:text-kawai-pearl/20 rounded-none"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                />
                <FieldError message={errors.email?.message} />
              </div>

              <div>
                <label htmlFor="appraisal-phone" className="text-kawai-pearl/60 text-sm tracking-wide block mb-3">
                  Phone <span className="text-kawai-pearl/25 font-light">(optional)</span>
                </label>
                <input
                  id="appraisal-phone"
                  {...register('phone')}
                  type="tel"
                  placeholder="(555) 867-5309"
                  className="w-full bg-white/4 border border-white/10 text-kawai-pearl px-4 py-3.5 text-sm focus:outline-none focus:border-kawai-red/40 transition-colors placeholder:text-kawai-pearl/20 rounded-none"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                />
              </div>
            </div>
          </fieldset>

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-between px-8 py-5 bg-kawai-red hover:bg-kawai-red/90 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm tracking-[0.1em] uppercase font-medium transition-colors rounded-sm group"
            >
              <span>{isSubmitting ? 'Submitting…' : 'Request my trade-in appraisal'}</span>
              {!isSubmitting && (
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              )}
            </button>
            <p className="text-kawai-pearl/20 text-xs mt-4 text-center">
              No obligation. We review every inquiry personally and respond within one business day.
            </p>
          </div>
        </form>
      </div>
    </section>
  )
}
