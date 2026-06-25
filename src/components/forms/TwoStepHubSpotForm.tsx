'use client'

import * as React from 'react'
import { useMemo, useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { UserIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'
import { FormField } from '@/components/ui/form-field'
import { HubSpotEmbed } from '@/components/forms/HubSpotEmbed'
import { cn } from '@/lib/utils'

/**
 * Reusable multi-step lead form that prefills a HubSpot form.
 *
 * The form is split into one or more native, Kawai-styled steps (configured via
 * `fields`). Once the visitor completes the steps, `onComplete` runs — the hook
 * where caller-specific logic lives (dealer routing, analytics, augmenting the
 * payload) — and then the target HubSpot form is embedded (via the share-link
 * iframe, {@link HubSpotEmbed}) with the collected values pre-populated through
 * URL query parameters keyed by each field's HubSpot internal name.
 *
 * Field names default to HubSpot internal names (firstname/lastname/email/phone)
 * so prefill maps 1:1; override per-field with `hubspotName` when they differ.
 *
 * Prefill via query string is best-effort — HubSpot populates fields whose
 * internal name matches a query key when the hosted form permits it.
 */

export type PreFormField = {
  /** Field key + react-hook-form name. Defaults to the HubSpot internal name. */
  name: string
  label: string
  type?: 'text' | 'email' | 'tel'
  placeholder?: string
  required?: boolean
  icon?: React.ComponentType<{ className?: string }>
  helpText?: string
  /** Which step the field belongs to (1-based). Defaults to 1. */
  step?: number
  /** HubSpot field internal name for prefill. Defaults to `name`. */
  hubspotName?: string
  /** Validation rules. `email` enforces an email shape; otherwise min-length / pattern. */
  validation?: {
    email?: boolean
    minLength?: number
    pattern?: { regex: RegExp; message: string }
  }
}

export type PreFormValues = Record<string, string>

type Props = {
  /** The HubSpot share-link URL (e.g. https://share.hsforms.com/xxxx). */
  formSrc: string
  /** Step-1/step-2 field configuration. Defaults to name → email/phone. */
  fields?: PreFormField[]
  /**
   * Runs once the visitor finishes the native steps, before the HubSpot form is
   * shown. Return an augmented object to change what gets prefilled, or throw to
   * abort. This is the hook for caller-specific logic.
   */
  onComplete?: (data: PreFormValues) => PreFormValues | void | Promise<PreFormValues | void>
  continueLabel?: string
  submitLabel?: string
  iframeTitle?: string
  /** Wrapper class for the embedded-form scroll container. */
  className?: string
}

const DEFAULT_FIELDS: PreFormField[] = [
  {
    name: 'firstname',
    label: 'First Name',
    placeholder: 'Jane',
    required: true,
    step: 1,
    icon: UserIcon,
  },
  {
    name: 'lastname',
    label: 'Last Name',
    placeholder: 'Doe',
    required: true,
    step: 1,
    icon: UserIcon,
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'jane@example.com',
    required: true,
    step: 1,
    icon: EnvelopeIcon,
    validation: { email: true },
  },
  {
    name: 'phone',
    label: 'Phone',
    type: 'tel',
    placeholder: '(555) 123-4567',
    required: true,
    step: 1,
    icon: PhoneIcon,
    validation: { minLength: 7 },
  },
]

function buildSchema(fields: PreFormField[]) {
  const shape: Record<string, z.ZodTypeAny> = {}
  for (const f of fields) {
    let schema: z.ZodString
    if (f.validation?.email) {
      schema = z.string().email('Enter a valid email address')
    } else {
      schema = z.string()
      const min = f.validation?.minLength ?? (f.required ? 1 : 0)
      if (min > 0) {
        schema = schema.min(
          min,
          min === 1 ? `${f.label} is required` : `${f.label} must be at least ${min} characters`,
        )
      }
      if (f.validation?.pattern) {
        schema = schema.regex(f.validation.pattern.regex, f.validation.pattern.message)
      }
    }
    shape[f.name] = f.required ? schema : schema.optional().or(z.literal(''))
  }
  return z.object(shape)
}

/** Append the collected values to the share URL as prefill query parameters. */
function buildPrefilledSrc(formSrc: string, fields: PreFormField[], data: PreFormValues): string {
  try {
    const url = new URL(formSrc)
    for (const f of fields) {
      const value = data[f.name]
      if (value) url.searchParams.set(f.hubspotName ?? f.name, value)
    }
    return url.toString()
  } catch {
    return formSrc
  }
}

const primaryButton = cn(
  'inline-flex w-full items-center justify-center gap-2 rounded-full bg-kawai-red px-7 py-3.5',
  'font-[family-name:var(--font-brand-sans)] text-sm font-semibold uppercase tracking-[0.12em] text-white',
  'transition-all duration-300 hover:bg-kawai-red/90 hover:shadow-[0_8px_32px_rgba(225,25,34,0.45)]',
  'disabled:opacity-60',
)

const secondaryButton = cn(
  'inline-flex items-center justify-center rounded-full border border-kawai-black/20 px-6 py-3.5',
  'font-[family-name:var(--font-brand-sans)] text-sm font-semibold uppercase tracking-[0.12em] text-kawai-charcoal',
  'transition-colors duration-200 hover:border-kawai-black/40 hover:text-kawai-black',
)

export function TwoStepHubSpotForm({
  formSrc,
  fields = DEFAULT_FIELDS,
  onComplete,
  continueLabel = 'Continue',
  submitLabel = 'Get My Discount',
  iframeTitle = 'Kawai sign-up form',
  className,
}: Props) {
  const schema = useMemo(() => buildSchema(fields), [fields])

  // Ordered, de-duplicated step groups derived from each field's `step`.
  const steps = useMemo(() => {
    const numbers = Array.from(new Set(fields.map((f) => f.step ?? 1))).sort((a, b) => a - b)
    return numbers.map((n) => ({
      step: n,
      fields: fields.filter((f) => (f.step ?? 1) === n),
    }))
  }, [fields])

  const [stepIndex, setStepIndex] = useState(0)
  const [prefilledSrc, setPrefilledSrc] = useState<string | null>(null)

  const defaultValues = useMemo<PreFormValues>(
    () => Object.fromEntries(fields.map((f) => [f.name, ''])),
    [fields],
  )

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<PreFormValues>({
    resolver: zodResolver(schema) as Resolver<PreFormValues>,
    defaultValues,
    mode: 'onBlur',
  })

  const isLastStep = stepIndex === steps.length - 1
  const currentStep = steps[stepIndex]

  const goNext = async () => {
    const names = currentStep?.fields.map((f) => f.name) ?? []
    const valid = await trigger(names)
    if (valid) setStepIndex((i) => Math.min(i + 1, steps.length - 1))
  }

  const finish = async (data: PreFormValues) => {
    const augmented = (await onComplete?.(data)) ?? undefined
    const finalData = augmented ?? data
    setPrefilledSrc(buildPrefilledSrc(formSrc, fields, finalData))
  }

  // — Embedded HubSpot form (final view) —
  if (prefilledSrc) {
    return (
      <div className={cn('max-h-[58vh] overflow-y-auto', className)}>
        <HubSpotEmbed
          src={prefilledSrc}
          title={iframeTitle}
          className="w-full rounded-xl border-0"
        />
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(finish)}
      className={className}
      noValidate
    >
      {steps.length > 1 && (
        <div className="mb-5 flex items-center gap-2" aria-hidden>
          {steps.map((s, i) => (
            <span
              key={s.step}
              className={cn(
                'h-1 flex-1 rounded-full transition-colors duration-300',
                i <= stepIndex ? 'bg-kawai-red' : 'bg-kawai-black/10',
              )}
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentStep?.step ?? stepIndex}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="space-y-4"
        >
          {currentStep?.fields.map((f) => (
            <FormField
              key={f.name}
              name={f.name}
              label={f.label}
              register={register}
              error={errors[f.name]}
              {...(f.type !== undefined && { type: f.type })}
              {...(f.placeholder !== undefined && { placeholder: f.placeholder })}
              {...(f.required !== undefined && { required: f.required })}
              {...(f.icon !== undefined && { icon: f.icon })}
              {...(f.helpText !== undefined && { helpText: f.helpText })}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex items-center gap-3">
        {stepIndex > 0 && (
          <button type="button" onClick={() => setStepIndex((i) => Math.max(i - 1, 0))} className={secondaryButton}>
            Back
          </button>
        )}
        {isLastStep ? (
          <button type="submit" disabled={isSubmitting} className={primaryButton}>
            {isSubmitting ? 'Submitting…' : submitLabel}
          </button>
        ) : (
          <button type="button" onClick={goNext} className={primaryButton}>
            {continueLabel}
          </button>
        )}
      </div>
    </form>
  )
}
