'use client'

import * as React from 'react'
import { useMemo, useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { UserIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, CheckIcon } from '@heroicons/react/24/outline'
import { FormField } from '@/components/ui/form-field'
import { submitHubSpotForm, type HubSpotFormConfig } from '@/lib/hubspot/forms'
import { cn } from '@/lib/utils'

/**
 * Reusable multi-step lead form that submits directly to a HubSpot form.
 *
 * The form is split into one or more native, Kawai-styled steps (configured via
 * `fields`). On the final step it POSTs to HubSpot's public Forms API — no
 * cross-origin iframe — so the submission happens in our page context. That lets
 * us (a) attribute the lead via the `hubspotutk` cookie and (b) push a GTM
 * `dataLayer` event the instant it succeeds (`dataLayerEvent`), which a
 * cross-origin share-link embed can't do. On success a branded confirmation
 * replaces the form; on failure an inline error lets the visitor retry.
 *
 * Field `name`s default to HubSpot internal names (firstname/lastname/email/
 * phone) so they map 1:1; override per-field with `hubspotName` when they differ.
 */

/** Option for a `select` or `checkbox-group` field. `value` must match HubSpot's internal value. */
export type PreFormOption = { label: string; value: string }

export type PreFormField = {
  /** Field key + react-hook-form name. Defaults to the HubSpot internal name. */
  name: string
  label: string
  type?: 'text' | 'email' | 'tel' | 'select' | 'checkbox-group'
  placeholder?: string
  required?: boolean
  icon?: React.ComponentType<{ className?: string }>
  helpText?: string
  /** Which step the field belongs to (1-based). Defaults to 1. */
  step?: number
  /** HubSpot field internal name for submission. Defaults to `name`. */
  hubspotName?: string
  /** Choices for `select` / `checkbox-group`. Ignored by text-style fields. */
  options?: readonly PreFormOption[]
  /** Validation rules. `email` enforces an email shape; otherwise min-length / pattern. */
  validation?: {
    email?: boolean
    minLength?: number
    pattern?: { regex: RegExp; message: string }
  }
}

/**
 * Values handed to `onComplete` and submitted to HubSpot — always strings.
 * A `checkbox-group` is flattened to HubSpot's multi-select wire format (a
 * single semicolon-separated string) before it gets here.
 */
export type PreFormValues = Record<string, string>

/** Internal react-hook-form state. Only `checkbox-group` fields hold arrays. */
type FormState = Record<string, string | string[]>

/** HubSpot represents a multi-checkbox value as one `;`-joined string. */
const HUBSPOT_MULTI_SEPARATOR = ';'

function isCheckboxGroup(f: PreFormField): boolean {
  return f.type === 'checkbox-group'
}

/** Flatten form state into the string-only shape HubSpot (and `onComplete`) expect. */
function toSubmissionValues(state: FormState): PreFormValues {
  return Object.fromEntries(
    Object.entries(state).map(([key, value]) => [
      key,
      Array.isArray(value) ? value.join(HUBSPOT_MULTI_SEPARATOR) : (value ?? ''),
    ]),
  )
}

type Props = {
  /** HubSpot portal + form GUID the collected values are submitted to. */
  form: HubSpotFormConfig
  /** Step-1/step-2 field configuration. Defaults to name → email/phone. */
  fields?: PreFormField[]
  /**
   * Runs once the visitor finishes the native steps, before the HubSpot submit.
   * Return an augmented object to change what gets submitted, or throw to abort.
   * This is the hook for caller-specific logic (dealer routing, extra fields).
   */
  onComplete?: (data: PreFormValues) => PreFormValues | void | Promise<PreFormValues | void>
  /**
   * Fires once the confirmation screen has replaced the form — after HubSpot
   * has accepted the submission. Use this for anything that should appear *on
   * top of* the success state (e.g. a follow-up modal); `onComplete` runs
   * before the submit and would race the confirmation.
   */
  onSubmitted?: (data: PreFormValues) => void
  continueLabel?: string
  submitLabel?: string
  className?: string
  /** GTM `dataLayer` event pushed on a successful submission. */
  dataLayerEvent?: string
  /** Identifies the form in analytics (event_label) + HubSpot `pageName`. */
  formName?: string
  /**
   * Dry-run the submit: run validation and `onComplete`/`onSubmitted` and show
   * the confirmation, but POST nothing to HubSpot and push no analytics event.
   * For test variants of a page that must exercise the real flow without
   * writing junk into the CRM.
   */
  skipSubmit?: boolean
  /** GDPR consent text — only pass when the HubSpot form has consent enabled. */
  consentText?: string
  /** Confirmation copy shown after a successful submission. */
  successTitle?: string
  successBody?: string
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
  {
    // Required on the HubSpot form — used to match the lead to a nearby dealer.
    // Accepts a US ZIP (+4) or a Canadian postal code (A1A 1A1, optional space).
    name: 'zip',
    label: 'ZIP / Postal Code',
    placeholder: '90210 or M5V 2T6',
    required: true,
    step: 1,
    icon: MapPinIcon,
    helpText: "We'll match you to your nearest Authorized Kawai dealer.",
    validation: {
      pattern: {
        regex: /^(\d{5}(-\d{4})?|[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d)$/,
        message: 'Enter a valid ZIP or postal code',
      },
    },
  },
  {
    // Required on the HubSpot form — omitting it makes the API reject the whole
    // submission ("Required field 'piano_type' is missing"), so it must be
    // required here too. Values must match HubSpot's option values exactly.
    name: 'piano_type',
    label: 'What are you shopping for?',
    type: 'checkbox-group',
    required: true,
    step: 1,
    helpText: 'Select all that interest you.',
    options: [
      { label: 'Grand Piano', value: 'Grand Piano' },
      { label: 'Upright Piano', value: 'Upright Piano' },
      { label: 'Hybrid Piano', value: 'Hybrid Piano' },
      { label: 'Digital Piano', value: 'Digital Piano' },
      { label: 'Accessories', value: 'Accessories' },
    ],
  },
  {
    // Optional on the HubSpot form — blank values are stripped before the POST.
    name: 'when_are_you_looking_to_purchase_',
    label: 'When are you looking to purchase?',
    type: 'select',
    placeholder: 'Please select',
    step: 1,
    options: [
      { label: 'Within 30 days', value: 'within_30_days' },
      { label: '1-3 months', value: '1_3_months' },
      { label: '3-6 months', value: '3_6_months' },
      { label: 'Just researching', value: 'just_researching' },
    ],
  },
]

function buildSchema(fields: PreFormField[]) {
  const shape: Record<string, z.ZodTypeAny> = {}
  for (const f of fields) {
    if (isCheckboxGroup(f)) {
      // react-hook-form collects same-named checkboxes into an array of the
      // checked `value`s, so "required" here means "at least one selected".
      const arr = z.array(z.string())
      shape[f.name] = f.required ? arr.min(1, `${f.label} is required`) : arr
      continue
    }

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

const primaryButton = cn(
  'inline-flex w-full items-center justify-center gap-2 rounded-full bg-kawai-red px-7 py-3.5',
  'font-[family-name:var(--font-brand-sans)] text-sm font-semibold uppercase tracking-[0.12em] text-white',
  'transition-all duration-300 hover:bg-kawai-red/90 hover:shadow-[0_8px_32px_rgba(225,25,34,0.45)]',
  'disabled:opacity-60',
)

/** Matches the `<Label>` used by FormField so all field types read as one form. */
const fieldLabel = 'flex items-center text-sm leading-none font-medium text-foreground select-none'

/** Mirrors the `<Input>` control styling so the select sits flush with the text fields. */
const selectControl = cn(
  'border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base text-foreground shadow-xs outline-none transition-[color,box-shadow] md:text-sm',
  'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
  'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
)

/** Tappable pill wrapping each checkbox — the whole pill is the label/hit target. */
const checkboxPill = cn(
  'inline-flex cursor-pointer items-center gap-2 rounded-full border border-input px-4 py-2',
  'text-sm text-kawai-charcoal transition-colors duration-200',
  'hover:border-kawai-red/50 hover:text-kawai-black',
  'has-[:checked]:border-kawai-red has-[:checked]:bg-kawai-red/5 has-[:checked]:text-kawai-black',
  'has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50',
)

const secondaryButton = cn(
  'inline-flex items-center justify-center rounded-full border border-kawai-black/20 px-6 py-3.5',
  'font-[family-name:var(--font-brand-sans)] text-sm font-semibold uppercase tracking-[0.12em] text-kawai-charcoal',
  'transition-colors duration-200 hover:border-kawai-black/40 hover:text-kawai-black',
)

export function TwoStepHubSpotForm({
  form,
  fields = DEFAULT_FIELDS,
  onComplete,
  onSubmitted,
  continueLabel = 'Continue',
  submitLabel = 'Get My Discount',
  className,
  dataLayerEvent = 'signup_form_submitted',
  formName = 'dealer_discount_signup',
  skipSubmit = false,
  consentText,
  successTitle = 'You’re all set',
  successBody = 'Thanks for signing up. Your local Authorized Kawai dealer will be in touch shortly.',
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
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const defaultValues = useMemo<FormState>(
    () => Object.fromEntries(fields.map((f) => [f.name, isCheckboxGroup(f) ? [] : ''])),
    [fields],
  )

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormState>({
    resolver: zodResolver(schema) as Resolver<FormState>,
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

  const finish = async (state: FormState) => {
    setSubmitError(null)
    try {
      // Flatten checkbox arrays to HubSpot's `;`-joined format before anything
      // downstream sees them, so `onComplete` keeps its string-only contract.
      const data = toSubmissionValues(state)
      const augmented = (await onComplete?.(data)) ?? undefined
      const finalData = augmented ?? data

      const hsFields = fields
        .map((f) => ({ name: f.hubspotName ?? f.name, value: finalData[f.name] ?? '' }))
        .filter((f) => f.value !== '')

      if (!skipSubmit) {
        await submitHubSpotForm(form, hsFields, {
          pageName: formName,
          ...(consentText ? { consent: { consentToProcess: true, text: consentText } } : {}),
        })
      }

      // The conversion signal — GTM keys a Custom Event trigger on this for both
      // GA4 and Google Ads. `user_data` powers Google Ads Enhanced Conversions:
      // GTM/Google hashes it (SHA-256) in the browser before it leaves, so no raw
      // PII is sent to Ads. Only include fields the visitor actually provided.
      const address: Record<string, string> = {}
      if (finalData.firstname) address.first_name = finalData.firstname
      if (finalData.lastname) address.last_name = finalData.lastname
      if (finalData.zip) address.postal_code = finalData.zip

      const userData: Record<string, unknown> = {}
      if (finalData.email) userData.email = finalData.email
      if (finalData.phone) userData.phone_number = finalData.phone
      if (Object.keys(address).length) userData.address = address

      if (!skipSubmit) {
        window.dataLayer = window.dataLayer ?? []
        window.dataLayer.push({
          event: dataLayerEvent,
          event_category: 'signup',
          event_label: formName,
          ...(Object.keys(userData).length ? { user_data: userData } : {}),
        })
      }

      setSubmitted(true)
      onSubmitted?.(finalData)
    } catch (err) {
      setSubmitError(
        err instanceof Error && err.message
          ? err.message
          : 'Something went wrong submitting the form. Please try again.',
      )
    }
  }

  // — Success confirmation —
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex flex-col items-center py-10 text-center"
      >
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-kawai-red">
          <CheckIcon className="h-6 w-6 text-kawai-red" />
        </div>
        <p className="font-[family-name:var(--font-brand-serif)] text-xl font-light text-kawai-black">
          {successTitle}
        </p>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-kawai-charcoal/70">{successBody}</p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit(finish)} className={className} noValidate>
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
          {currentStep?.fields.map((f) => {
            const errorMessage = errors[f.name]?.message as string | undefined

            if (f.type === 'checkbox-group') {
              return (
                <fieldset key={f.name} className="space-y-2">
                  <legend className={fieldLabel}>
                    {f.label}
                    {f.required && <span className="ml-1 text-kawai-red">*</span>}
                  </legend>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {f.options?.map((opt) => (
                      <label key={opt.value} className={checkboxPill}>
                        <input
                          type="checkbox"
                          value={opt.value}
                          className="h-4 w-4 shrink-0 accent-kawai-red"
                          {...register(f.name)}
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                  {errorMessage ? (
                    <p className="text-sm text-kawai-red">{errorMessage}</p>
                  ) : (
                    f.helpText && <p className="text-sm text-muted-foreground">{f.helpText}</p>
                  )}
                </fieldset>
              )
            }

            if (f.type === 'select') {
              return (
                <div key={f.name} className="space-y-2">
                  <label htmlFor={f.name} className={fieldLabel}>
                    {f.label}
                    {f.required && <span className="ml-1 text-kawai-red">*</span>}
                  </label>
                  <select
                    id={f.name}
                    aria-invalid={!!errorMessage}
                    className={selectControl}
                    {...register(f.name)}
                  >
                    <option value="">{f.placeholder ?? 'Please select'}</option>
                    {f.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errorMessage ? (
                    <p className="text-sm text-kawai-red">{errorMessage}</p>
                  ) : (
                    f.helpText && <p className="text-sm text-muted-foreground">{f.helpText}</p>
                  )}
                </div>
              )
            }

            return (
              <FormField
                key={f.name}
                name={f.name}
                label={f.label}
                register={register}
                error={errorMessage}
                {...(f.type !== undefined && { type: f.type })}
                {...(f.placeholder !== undefined && { placeholder: f.placeholder })}
                {...(f.required !== undefined && { required: f.required })}
                {...(f.icon !== undefined && { icon: f.icon })}
                {...(f.helpText !== undefined && { helpText: f.helpText })}
              />
            )
          })}
        </motion.div>
      </AnimatePresence>

      {submitError && (
        <p role="alert" className="mt-4 text-sm font-medium text-kawai-red">
          {submitError}
        </p>
      )}

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
