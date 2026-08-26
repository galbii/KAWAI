# Store Signup Campaigns Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let marketing author a promo signup landing page end to end in the Payload admin — copy, background, form questions, email recipients, Shopify tags — served at `/store/[storeslug]/signup/[[...campaign]]` with no deploy.

**Architecture:** Two new collections (`signup-campaigns`, `signup-leads`) drive one optional-catch-all route. Pure logic (schema building, recipient resolution, answer denormalization, campaign resolution) lives in `src/lib/signup/` as unit-tested modules with no Payload or network dependency; the collections, route, and Server Action are thin consumers. Submission writes the lead first, then fires Resend and Shopify independently — neither can fail the submission.

**Tech Stack:** Next.js 15 (App Router), Payload CMS 3.85, MongoDB (mongoose), Zod 4.4.3, react-hook-form 7.80 + `@hookform/resolvers` 5.4, Resend 6.14, Tailwind v4, `bun:test`.

**Spec:** `docs/2026-08-25-store-signup-campaigns-design.md`

## Global Constraints

- **Runtime is Bun.** Never `npm`/`yarn`/`pnpm`. Tests: `bun test <path>`.
- **Zod 4 idioms.** Use `z.email()`, `z.iso.date()`, `z.enum()`. The `z.string().email()` form is deprecated in v4 — do not use it in new code.
- **Tests are colocated** `*.test.ts` next to the module, importing from `bun:test`. Model: `src/lib/rsm/lead-envelopes.test.ts`.
- **TypeScript strict**, with `exactOptionalPropertyTypes` and `noUncheckedIndexedAccess`. Array access returns `T | undefined` — always `?.` or `?? default`.
- **Never `type: 'upload'` by hand.** Use `imageField` / `videoField` / `mediaField` from `@/lib/payload/fields`.
- **Access control** from `@/lib/payload/access`: `anyone`, `authenticated`, `adminOnly`.
- **`depth: 1`** on block-heavy documents. Never `depth: 2+` without written justification.
- **Local API with a `user`** always sets `overrideAccess: false`.
- **Hooks** pass `req` to nested operations, guard with `context.skipHook`, fire-and-forget the revalidate `fetch` (never `await`), always `return doc`.
- **Accessibility (WCAG 2.1 AA, active ADA matter):** every control has a real `<label>` or `aria-label` — a placeholder is not an accessible name. Exactly one `<h1>` per page. `kawai-red-400` (not `kawai-red`) for red text on dark. Text over imagery needs a scrim guaranteeing 4.5:1.
- **Brand:** `kawai-red` `#E11922`, `kawai-black` `#1E1B16`, `kawai-pearl` `#FAF8F5`, `kawai-neutral` `#DBDBDB`, `kawai-gold` `#d5c78c`. Logo `public/images/kms/KMS Logo.png` (1430×128).
- **Run `bun run payload generate:importmap`** after adding or moving any admin component.
- **Never commit** unless the plan step says to.

---

## File Structure

**New — pure logic (unit tested, no Payload/network imports):**

| File | Responsibility |
|---|---|
| `src/lib/signup/types.ts` | Shared types for questions, core config, answers, recipients |
| `src/lib/signup/schema.ts` | `buildSignupSchema()` — questions → Zod schema |
| `src/lib/signup/answers.ts` | `denormalizeAnswers()` — validated values → `{name,label,value}[]` |
| `src/lib/signup/recipients.ts` | `resolveSignupRecipients()` — toggles → To/Cc |
| `src/lib/signup/resolve.ts` | `resolveCampaign()` — slug + date → active \| ended \| missing |

**New — Payload config:**

| File | Responsibility |
|---|---|
| `src/collections/SignupCampaigns.ts` | Campaign collection |
| `src/collections/SignupLeads.ts` | Lead collection |
| `src/collections/hooks/revalidateSignupCampaign.ts` | `afterChange` revalidation |
| `src/blocks/signup/Instructors.ts` · `Details.ts` · `Location.ts` · `index.ts` | Three new blocks |

**New — route and components:**

| File | Responsibility |
|---|---|
| `src/app/(frontend)/store/[storeslug]/signup/[[...campaign]]/page.tsx` | Route, resolution, metadata |
| `src/components/signup/SignupHero.tsx` | Background, scrim, the page `<h1>` (server) |
| `src/components/signup/SignupRail.tsx` | Sticky rail + cap logic (client) |
| `src/components/signup/SignupForm.tsx` | react-hook-form + zodResolver (client) |
| `src/components/signup/SignupQuestionField.tsx` | One question row by type (client) |
| `src/components/signup/SignupMobileBar.tsx` | Sticky bottom CTA (client) |
| `src/components/signup/SignupEndedPanel.tsx` | Ended state (server) |
| `src/components/signup/SignupLockup.tsx` | Logo │ rule │ storefront (server) |
| `src/lib/actions/signup-campaign-submit.ts` | Server Action pipeline |
| `src/lib/signup/notify.ts` | Resend notification + confirmation |

**Modified:** `src/payload.config.ts` (register 2 collections + 3 blocks), `src/lib/payload/queries.ts` (campaign queries).

---

## Task 1: Shared types and the Zod schema builder

The heart of the feature. Everything downstream depends on these type names.

**Files:**
- Create: `src/lib/signup/types.ts`
- Create: `src/lib/signup/schema.ts`
- Test: `src/lib/signup/schema.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `SignupQuestionType`, `SignupQuestion`, `SignupCoreConfig`, `SignupAnswer`, `SignupRecipients`, and `buildSignupSchema(core: SignupCoreConfig, questions: SignupQuestion[]): z.ZodObject`. Tasks 3, 9, 10 depend on these exact names.

- [ ] **Step 1: Write the types**

```typescript
// src/lib/signup/types.ts

/** The field types a marketer can add as a campaign question. */
export type SignupQuestionType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'

export interface SignupQuestionOption {
  label: string
  value: string
}

/**
 * One campaign-defined question. Mirrors a `form.questions` row on
 * `signup-campaigns`. Nullables match what Payload returns for empty fields.
 */
export interface SignupQuestion {
  type: SignupQuestionType
  label: string
  /** Slug used as the form field name. Unique within a campaign. */
  name: string
  required?: boolean | null
  options?: SignupQuestionOption[] | null
  helpText?: string | null
  width?: 'full' | 'half' | null
}

/** Which of the always-present contact fields this campaign collects. */
export interface SignupCoreConfig {
  collectPhone: boolean
  requirePhone: boolean
  collectZip: boolean
  requireZip: boolean
}

/**
 * An answer as stored on a lead. Carries the label as it read at submission
 * time so later edits to the campaign cannot corrupt the archive.
 */
export interface SignupAnswer {
  name: string
  label: string
  value: string
}

export interface SignupRecipients {
  to: string[]
  cc: string[]
}
```

- [ ] **Step 2: Write the failing test**

```typescript
// src/lib/signup/schema.test.ts
import { describe, expect, it } from 'bun:test'
import { buildSignupSchema } from './schema'
import type { SignupCoreConfig, SignupQuestion } from './types'

const CORE: SignupCoreConfig = {
  collectPhone: true,
  requirePhone: false,
  collectZip: true,
  requireZip: false,
}

const VALID_CORE = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
}

describe('buildSignupSchema — contact core', () => {
  it('always requires first name, last name and a valid email', () => {
    const schema = buildSignupSchema(CORE, [])
    expect(schema.safeParse(VALID_CORE).success).toBe(true)
    expect(schema.safeParse({ ...VALID_CORE, email: 'nope' }).success).toBe(false)
    expect(schema.safeParse({ ...VALID_CORE, firstName: '' }).success).toBe(false)
    expect(schema.safeParse({ lastName: 'L', email: 'a@b.co' }).success).toBe(false)
  })

  it('accepts a missing phone when collected but not required', () => {
    const schema = buildSignupSchema(CORE, [])
    expect(schema.safeParse(VALID_CORE).success).toBe(true)
  })

  it('rejects a missing phone when required', () => {
    const schema = buildSignupSchema({ ...CORE, requirePhone: true }, [])
    expect(schema.safeParse(VALID_CORE).success).toBe(false)
    expect(schema.safeParse({ ...VALID_CORE, phone: '5551234567' }).success).toBe(true)
  })

  it('strips phone entirely when the campaign does not collect it', () => {
    const schema = buildSignupSchema({ ...CORE, collectPhone: false }, [])
    const parsed = schema.parse({ ...VALID_CORE, phone: '5551234567' })
    expect('phone' in parsed).toBe(false)
  })
})

describe('buildSignupSchema — campaign questions', () => {
  const instrument: SignupQuestion = {
    type: 'select',
    label: 'Which instrument?',
    name: 'instrument',
    required: true,
    options: [
      { label: 'Piano', value: 'piano' },
      { label: 'Voice', value: 'voice' },
    ],
  }

  it('requires a required question and restricts it to its options', () => {
    const schema = buildSignupSchema(CORE, [instrument])
    expect(schema.safeParse({ ...VALID_CORE, instrument: 'piano' }).success).toBe(true)
    expect(schema.safeParse({ ...VALID_CORE, instrument: 'tuba' }).success).toBe(false)
    expect(schema.safeParse(VALID_CORE).success).toBe(false)
  })

  it('allows an optional question to be omitted', () => {
    const schema = buildSignupSchema(CORE, [{ ...instrument, required: false }])
    expect(schema.safeParse(VALID_CORE).success).toBe(true)
  })

  it('coerces a checkbox to boolean and defaults it to false', () => {
    const schema = buildSignupSchema(CORE, [
      { type: 'checkbox', label: 'Send me updates', name: 'updates' },
    ])
    const parsed = schema.parse(VALID_CORE)
    expect(parsed.updates).toBe(false)
    expect(schema.parse({ ...VALID_CORE, updates: true }).updates).toBe(true)
  })

  it('validates a date question as ISO YYYY-MM-DD', () => {
    const schema = buildSignupSchema(CORE, [
      { type: 'date', label: 'Preferred day', name: 'day', required: true },
    ])
    expect(schema.safeParse({ ...VALID_CORE, day: '2026-10-18' }).success).toBe(true)
    expect(schema.safeParse({ ...VALID_CORE, day: '10/18/2026' }).success).toBe(false)
  })

  it('ignores keys the campaign never defined', () => {
    const schema = buildSignupSchema(CORE, [])
    const parsed = schema.parse({ ...VALID_CORE, isAdmin: true })
    expect('isAdmin' in parsed).toBe(false)
  })

  it('treats a select with no options as free text rather than throwing', () => {
    const schema = buildSignupSchema(CORE, [
      { type: 'select', label: 'Broken', name: 'broken', options: [] },
    ])
    expect(schema.safeParse({ ...VALID_CORE, broken: 'anything' }).success).toBe(true)
  })
})
```

- [ ] **Step 3: Run the test and watch it fail**

Run: `bun test src/lib/signup/schema.test.ts`
Expected: FAIL — cannot resolve `./schema`.

- [ ] **Step 4: Implement the builder**

```typescript
// src/lib/signup/schema.ts
import { z } from 'zod'
import type { SignupCoreConfig, SignupQuestion } from './types'

/**
 * Build the validation schema for one campaign's form.
 *
 * The server derives this from the STORED campaign on every submission — the
 * client never supplies field definitions. If it could, a crafted POST would
 * bypass every `required` constraint and every option whitelist.
 *
 * Zod strips unknown keys by default, so anything the campaign did not define
 * is silently dropped rather than reaching the database.
 */
export function buildSignupSchema(
  core: SignupCoreConfig,
  questions: SignupQuestion[],
) {
  const shape: Record<string, z.ZodTypeAny> = {
    firstName: z.string().trim().min(1, 'Please enter your first name'),
    lastName: z.string().trim().min(1, 'Please enter your last name'),
    email: z.email('Please enter a valid email address'),
  }

  if (core.collectPhone) {
    const phone = z.string().trim()
    shape.phone = core.requirePhone
      ? phone.min(10, 'Please enter a valid phone number')
      : phone.optional()
  }

  if (core.collectZip) {
    const zip = z.string().trim()
    shape.zip = core.requireZip
      ? zip.min(3, 'Please enter your ZIP or postal code')
      : zip.optional()
  }

  for (const question of questions) {
    shape[question.name] = questionSchema(question)
  }

  return z.object(shape)
}

function questionSchema(question: SignupQuestion): z.ZodTypeAny {
  const required = question.required === true

  if (question.type === 'checkbox') {
    // Unchecked boxes are simply absent from a form POST, so a checkbox is
    // never "missing" — it is false. A required checkbox means "must be ticked".
    const box = z.coerce.boolean().default(false)
    return required
      ? box.refine((v) => v === true, { message: `${question.label} is required` })
      : box
  }

  if (question.type === 'date') {
    const date = z.iso.date('Please enter a valid date')
    return required ? date : date.optional()
  }

  if (question.type === 'select' || question.type === 'radio') {
    const values = (question.options ?? []).map((o) => o.value).filter(Boolean)
    // A marketer can save an option-less select. Degrade to free text rather
    // than throwing at request time and taking the whole page down.
    if (values.length === 0) {
      const free = z.string().trim()
      return required ? free.min(1, `${question.label} is required`) : free.optional()
    }
    const choice = z.enum(values as [string, ...string[]])
    return required ? choice : choice.optional()
  }

  const text = z.string().trim()
  return required ? text.min(1, `${question.label} is required`) : text.optional()
}
```

- [ ] **Step 5: Run the test and watch it pass**

Run: `bun test src/lib/signup/schema.test.ts`
Expected: PASS, 11 tests.

- [ ] **Step 6: Commit**

```bash
git add src/lib/signup/types.ts src/lib/signup/schema.ts src/lib/signup/schema.test.ts
git commit -m "feat(signup): add campaign question types and dynamic Zod schema builder"
```

---

## Task 2: Answer denormalization

**Files:**
- Create: `src/lib/signup/answers.ts`
- Test: `src/lib/signup/answers.test.ts`

**Interfaces:**
- Consumes: `SignupQuestion`, `SignupAnswer` from Task 1.
- Produces: `denormalizeAnswers(questions: SignupQuestion[], values: Record<string, unknown>): SignupAnswer[]`. Task 10 calls this.

- [ ] **Step 1: Write the failing test**

```typescript
// src/lib/signup/answers.test.ts
import { describe, expect, it } from 'bun:test'
import { denormalizeAnswers } from './answers'
import type { SignupQuestion } from './types'

const QUESTIONS: SignupQuestion[] = [
  {
    type: 'select',
    label: 'Which instrument?',
    name: 'instrument',
    options: [
      { label: 'Piano', value: 'piano' },
      { label: 'Voice', value: 'voice' },
    ],
  },
  { type: 'text', label: 'Student name', name: 'studentName' },
  { type: 'checkbox', label: 'Send me updates', name: 'updates' },
]

describe('denormalizeAnswers', () => {
  it('captures the label as it read at submission time', () => {
    const answers = denormalizeAnswers(QUESTIONS, {
      instrument: 'piano',
      studentName: 'Ada',
      updates: true,
    })
    expect(answers).toEqual([
      { name: 'instrument', label: 'Which instrument?', value: 'Piano' },
      { name: 'studentName', label: 'Student name', value: 'Ada' },
      { name: 'updates', label: 'Send me updates', value: 'Yes' },
    ])
  })

  it('resolves a choice to its human-readable option label', () => {
    const answers = denormalizeAnswers(QUESTIONS, { instrument: 'voice' })
    expect(answers[0]?.value).toBe('Voice')
  })

  it('keeps the raw value when it matches no known option', () => {
    const answers = denormalizeAnswers(QUESTIONS, { instrument: 'tuba' })
    expect(answers[0]?.value).toBe('tuba')
  })

  it('renders booleans as Yes and No', () => {
    expect(denormalizeAnswers(QUESTIONS, { updates: false })[0]?.value).toBe('No')
  })

  it('omits questions the visitor left blank', () => {
    const answers = denormalizeAnswers(QUESTIONS, { studentName: 'Ada' })
    expect(answers).toHaveLength(1)
    expect(answers[0]?.name).toBe('studentName')
  })

  it('ignores submitted values with no matching question', () => {
    const answers = denormalizeAnswers(QUESTIONS, { ghost: 'boo' })
    expect(answers).toHaveLength(0)
  })

  it('stays readable after the campaign renames a question', () => {
    // The archive is a snapshot: a lead captured under the old label keeps it.
    const before = denormalizeAnswers(QUESTIONS, { instrument: 'piano' })
    const renamed: SignupQuestion[] = [
      { ...QUESTIONS[0]!, label: 'Primary instrument' },
    ]
    const after = denormalizeAnswers(renamed, { instrument: 'piano' })
    expect(before[0]?.label).toBe('Which instrument?')
    expect(after[0]?.label).toBe('Primary instrument')
  })
})
```

- [ ] **Step 2: Run the test and watch it fail**

Run: `bun test src/lib/signup/answers.test.ts`
Expected: FAIL — cannot resolve `./answers`.

- [ ] **Step 3: Implement**

```typescript
// src/lib/signup/answers.ts
import type { SignupAnswer, SignupQuestion } from './types'

/**
 * Freeze a submission's answers into `{ name, label, value }` triples.
 *
 * Leads store the question label as it read at submission time rather than a
 * pointer into the live campaign. Marketers rename, reorder and delete
 * questions constantly; without this snapshot, one edit would quietly make
 * every historical lead unreadable and a deleted question would orphan its
 * answers outright.
 */
export function denormalizeAnswers(
  questions: SignupQuestion[],
  values: Record<string, unknown>,
): SignupAnswer[] {
  const answers: SignupAnswer[] = []

  for (const question of questions) {
    const raw = values[question.name]
    if (raw === undefined || raw === null || raw === '') continue

    answers.push({
      name: question.name,
      label: question.label,
      value: displayValue(question, raw),
    })
  }

  return answers
}

function displayValue(question: SignupQuestion, raw: unknown): string {
  if (typeof raw === 'boolean') return raw ? 'Yes' : 'No'

  const value = String(raw)
  const match = question.options?.find((o) => o.value === value)
  return match?.label ?? value
}
```

- [ ] **Step 4: Run the test and watch it pass**

Run: `bun test src/lib/signup/answers.test.ts`
Expected: PASS, 7 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/signup/answers.ts src/lib/signup/answers.test.ts
git commit -m "feat(signup): denormalize lead answers so campaign edits cannot corrupt the archive"
```

---

## Task 3: Recipient resolution

**Files:**
- Create: `src/lib/signup/recipients.ts`
- Test: `src/lib/signup/recipients.test.ts`

**Interfaces:**
- Consumes: `SignupRecipients` from Task 1.
- Produces: `resolveSignupRecipients(input: RecipientInput): SignupRecipients` and the exported `RecipientInput` interface. Task 11 calls this.

- [ ] **Step 1: Write the failing test**

```typescript
// src/lib/signup/recipients.test.ts
import { afterEach, describe, expect, it } from 'bun:test'
import { resolveSignupRecipients } from './recipients'

afterEach(() => {
  delete process.env.LEAD_NOTIFY_CC_EMAIL
  delete process.env.LEAD_NOTIFY_FALLBACK_EMAIL
})

const BASE = {
  recipients: ['events@kawaius.com'],
  cc: [],
  includeStorefrontEmail: false,
  includeSchoolEmail: false,
  storefrontEmail: 'houston@kawaius.com',
  schoolEmail: 'school-houston@kawaius.com',
  rsmEmail: null,
}

describe('resolveSignupRecipients', () => {
  it('uses the explicit campaign list by default', () => {
    expect(resolveSignupRecipients(BASE).to).toEqual(['events@kawaius.com'])
  })

  it('adds the storefront email only when the toggle is on', () => {
    const on = resolveSignupRecipients({ ...BASE, includeStorefrontEmail: true })
    expect(on.to).toContain('houston@kawaius.com')
    expect(resolveSignupRecipients(BASE).to).not.toContain('houston@kawaius.com')
  })

  it('adds the school email only when the toggle is on', () => {
    const on = resolveSignupRecipients({ ...BASE, includeSchoolEmail: true })
    expect(on.to).toContain('school-houston@kawaius.com')
  })

  it('adds a matched RSM when one was resolved', () => {
    const out = resolveSignupRecipients({ ...BASE, rsmEmail: 'rsm@kawaius.com' })
    expect(out.to).toContain('rsm@kawaius.com')
  })

  it('skips a toggled-on source that has no address', () => {
    const out = resolveSignupRecipients({
      ...BASE,
      includeStorefrontEmail: true,
      storefrontEmail: null,
    })
    expect(out.to).toEqual(['events@kawaius.com'])
  })

  it('deduplicates case-insensitively and preserves first-seen casing', () => {
    const out = resolveSignupRecipients({
      ...BASE,
      recipients: ['Events@kawaius.com', 'events@KAWAIUS.com'],
      includeStorefrontEmail: true,
      storefrontEmail: 'EVENTS@kawaius.com',
    })
    expect(out.to).toEqual(['Events@kawaius.com'])
  })

  it('falls back rather than resolving to nobody', () => {
    process.env.LEAD_NOTIFY_FALLBACK_EMAIL = 'fallback@kawaius.com'
    const out = resolveSignupRecipients({ ...BASE, recipients: [] })
    expect(out.to).toEqual(['fallback@kawaius.com'])
  })

  it('defaults cc to the corporate inbox and never duplicates it into to', () => {
    process.env.LEAD_NOTIFY_CC_EMAIL = 'contact@kawaius.com'
    expect(resolveSignupRecipients(BASE).cc).toEqual(['contact@kawaius.com'])

    const overlap = resolveSignupRecipients({
      ...BASE,
      recipients: ['contact@kawaius.com'],
    })
    expect(overlap.cc).toEqual([])
  })

  it('prefers an explicit cc list over the default', () => {
    process.env.LEAD_NOTIFY_CC_EMAIL = 'contact@kawaius.com'
    const out = resolveSignupRecipients({ ...BASE, cc: ['ops@kawaius.com'] })
    expect(out.cc).toEqual(['ops@kawaius.com'])
  })

  it('trims and drops blank entries', () => {
    const out = resolveSignupRecipients({
      ...BASE,
      recipients: ['  events@kawaius.com  ', '', '   '],
    })
    expect(out.to).toEqual(['events@kawaius.com'])
  })
})
```

- [ ] **Step 2: Run the test and watch it fail**

Run: `bun test src/lib/signup/recipients.test.ts`
Expected: FAIL — cannot resolve `./recipients`.

- [ ] **Step 3: Implement**

```typescript
// src/lib/signup/recipients.ts
import type { SignupRecipients } from './types'

export interface RecipientInput {
  /** Explicit addresses from the campaign's Notifications tab. */
  recipients: string[]
  cc: string[]
  includeStorefrontEmail: boolean
  includeSchoolEmail: boolean
  storefrontEmail: string | null
  schoolEmail: string | null
  /** Already-matched RSM address, or null. Matching happens upstream. */
  rsmEmail: string | null
}

const DEFAULT_CC = 'contact@kawaius.com'

/**
 * Resolve who receives a signup notification.
 *
 * Pure by design: the caller does the ZIP geocoding and RSM lookup and hands
 * the result in, so every toggle combination is unit-testable without a
 * network. Never returns an empty `to` — a lead with nowhere to go is a lost
 * lead, so an empty resolution falls back to the corporate inbox.
 */
export function resolveSignupRecipients(input: RecipientInput): SignupRecipients {
  const to = dedupe([
    ...input.recipients,
    ...(input.includeStorefrontEmail ? [input.storefrontEmail] : []),
    ...(input.includeSchoolEmail ? [input.schoolEmail] : []),
    ...(input.rsmEmail ? [input.rsmEmail] : []),
  ])

  const resolved = to.length > 0 ? to : dedupe([fallbackAddress()])

  const ccCandidates = input.cc.length > 0 ? input.cc : [ccAddress()]
  const seen = new Set(resolved.map((a) => a.toLowerCase()))
  const cc = dedupe(ccCandidates).filter((a) => !seen.has(a.toLowerCase()))

  return { to: resolved, cc }
}

function ccAddress(): string {
  return process.env.LEAD_NOTIFY_CC_EMAIL?.trim() || DEFAULT_CC
}

function fallbackAddress(): string {
  return process.env.LEAD_NOTIFY_FALLBACK_EMAIL?.trim() || ccAddress()
}

/** Trim, drop blanks, dedupe case-insensitively, keep first-seen casing. */
function dedupe(values: (string | null | undefined)[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []

  for (const value of values) {
    const trimmed = value?.trim()
    if (!trimmed) continue
    const key = trimmed.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(trimmed)
  }

  return out
}
```

- [ ] **Step 4: Run the test and watch it pass**

Run: `bun test src/lib/signup/recipients.test.ts`
Expected: PASS, 10 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/signup/recipients.ts src/lib/signup/recipients.test.ts
git commit -m "feat(signup): resolve notification recipients from campaign toggles"
```

---

## Task 4: Campaign resolution

**Files:**
- Create: `src/lib/signup/resolve.ts`
- Test: `src/lib/signup/resolve.test.ts`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `resolveCampaign(candidates: ResolvableCampaign[], opts): CampaignResolution`, plus exported `ResolvableCampaign` and `CampaignResolution`. Task 8 (the route) calls this.

- [ ] **Step 1: Write the failing test**

```typescript
// src/lib/signup/resolve.test.ts
import { describe, expect, it } from 'bun:test'
import { resolveCampaign, type ResolvableCampaign } from './resolve'

const NOW = new Date('2026-10-01T12:00:00Z')

const fall: ResolvableCampaign = {
  slug: 'fall-open-house',
  isActive: true,
  isDefault: true,
  startDate: '2026-09-01T00:00:00Z',
  endDate: '2026-10-31T00:00:00Z',
}

const holiday: ResolvableCampaign = {
  slug: 'holiday-recital',
  isActive: true,
  isDefault: false,
  startDate: '2026-12-01T00:00:00Z',
  endDate: null,
}

const expired: ResolvableCampaign = {
  slug: 'spring-sale',
  isActive: true,
  isDefault: false,
  startDate: '2026-03-01T00:00:00Z',
  endDate: '2026-04-30T00:00:00Z',
}

describe('resolveCampaign — named URL', () => {
  it('returns the named campaign', () => {
    const r = resolveCampaign([fall, holiday], { slug: 'holiday-recital', now: NOW })
    expect(r.status).toBe('active')
    expect(r.campaign?.slug).toBe('holiday-recital')
  })

  it('reports an expired campaign as ended, never as missing', () => {
    // These URLs live on printed flyers that outlive the promo. A 404 throws
    // away the traffic; the ended panel keeps it.
    const r = resolveCampaign([expired], { slug: 'spring-sale', now: NOW })
    expect(r.status).toBe('ended')
    expect(r.campaign?.slug).toBe('spring-sale')
  })

  it('reports an unknown slug as missing', () => {
    expect(resolveCampaign([fall], { slug: 'nope', now: NOW }).status).toBe('missing')
  })

  it('reports an inactive campaign as missing even when named directly', () => {
    const r = resolveCampaign([{ ...fall, isActive: false }], {
      slug: 'fall-open-house',
      now: NOW,
    })
    expect(r.status).toBe('missing')
  })

  it('reports a not-yet-started campaign as missing', () => {
    const r = resolveCampaign([holiday], { slug: 'holiday-recital', now: NOW })
    expect(r.status).toBe('active')
    const early = resolveCampaign([holiday], {
      slug: 'holiday-recital',
      now: new Date('2026-11-01T00:00:00Z'),
    })
    expect(early.status).toBe('missing')
  })
})

describe('resolveCampaign — bare URL', () => {
  it('resolves the default campaign when no slug is given', () => {
    const r = resolveCampaign([fall, holiday], { slug: null, now: NOW })
    expect(r.campaign?.slug).toBe('fall-open-house')
  })

  it('is missing when no campaign is marked default', () => {
    const r = resolveCampaign([{ ...fall, isDefault: false }], { slug: null, now: NOW })
    expect(r.status).toBe('missing')
  })

  it('ignores a default that is outside its date window', () => {
    const r = resolveCampaign([{ ...expired, isDefault: true }], { slug: null, now: NOW })
    expect(r.status).toBe('missing')
  })

  it('picks the most recently started default when several qualify', () => {
    const older: ResolvableCampaign = { ...fall, slug: 'older', startDate: '2026-01-01T00:00:00Z' }
    const r = resolveCampaign([older, fall], { slug: null, now: NOW })
    expect(r.campaign?.slug).toBe('fall-open-house')
  })

  it('treats an absent start or end date as open-ended', () => {
    const always: ResolvableCampaign = {
      slug: 'evergreen',
      isActive: true,
      isDefault: true,
      startDate: null,
      endDate: null,
    }
    expect(resolveCampaign([always], { slug: null, now: NOW }).status).toBe('active')
  })
})
```

- [ ] **Step 2: Run the test and watch it fail**

Run: `bun test src/lib/signup/resolve.test.ts`
Expected: FAIL — cannot resolve `./resolve`.

- [ ] **Step 3: Implement**

```typescript
// src/lib/signup/resolve.ts

export interface ResolvableCampaign {
  slug: string
  isActive: boolean
  isDefault: boolean
  /** ISO strings as Payload returns them, or null for open-ended. */
  startDate: string | null
  endDate: string | null
}

export interface CampaignResolution<T extends ResolvableCampaign = ResolvableCampaign> {
  status: 'active' | 'ended' | 'missing'
  campaign: T | null
}

interface ResolveOptions {
  /** The campaign slug from the URL, or null for the bare /signup URL. */
  slug: string | null
  now: Date
}

/**
 * Decide which campaign a request resolves to.
 *
 * Pure so every date-boundary case is testable without a database. The caller
 * supplies only campaigns already scoped to the requested storefront.
 *
 * An expired campaign resolves to `ended`, not `missing` — these URLs are
 * printed on flyers and encoded in QR codes that outlive the promo, so a 404
 * would discard real traffic and the link equity built up with it.
 */
export function resolveCampaign<T extends ResolvableCampaign>(
  candidates: T[],
  { slug, now }: ResolveOptions,
): CampaignResolution<T> {
  const live = candidates.filter((c) => c.isActive)

  if (slug) {
    const named = live.find((c) => c.slug === slug)
    if (!named) return { status: 'missing', campaign: null }
    if (hasEnded(named, now)) return { status: 'ended', campaign: named }
    if (!hasStarted(named, now)) return { status: 'missing', campaign: null }
    return { status: 'active', campaign: named }
  }

  const defaults = live
    .filter((c) => c.isDefault && hasStarted(c, now) && !hasEnded(c, now))
    .sort((a, b) => startTime(b) - startTime(a))

  const chosen = defaults[0]
  return chosen ? { status: 'active', campaign: chosen } : { status: 'missing', campaign: null }
}

function hasStarted(campaign: ResolvableCampaign, now: Date): boolean {
  if (!campaign.startDate) return true
  return new Date(campaign.startDate).getTime() <= now.getTime()
}

function hasEnded(campaign: ResolvableCampaign, now: Date): boolean {
  if (!campaign.endDate) return false
  return new Date(campaign.endDate).getTime() < now.getTime()
}

function startTime(campaign: ResolvableCampaign): number {
  return campaign.startDate ? new Date(campaign.startDate).getTime() : 0
}
```

- [ ] **Step 4: Run the test and watch it pass**

Run: `bun test src/lib/signup/resolve.test.ts`
Expected: PASS, 10 tests.

- [ ] **Step 5: Run the whole signup suite together**

Run: `bun test src/lib/signup/`
Expected: PASS, 38 tests across 4 files.

- [ ] **Step 6: Commit**

```bash
git add src/lib/signup/resolve.ts src/lib/signup/resolve.test.ts
git commit -m "feat(signup): resolve campaigns by slug and date window"
```

---

## Task 5: The `signup-campaigns` collection

**Files:**
- Create: `src/collections/SignupCampaigns.ts`
- Create: `src/collections/hooks/revalidateSignupCampaign.ts`
- Modify: `src/payload.config.ts` (import + `collections` array, around line 295)

**Interfaces:**
- Consumes: `SignupQuestion` shape from Task 1 — the `form.questions` array field must produce exactly those property names (`type`, `label`, `name`, `required`, `options`, `helpText`, `width`).
- Produces: the `signup-campaigns` slug and the generated `SignupCampaign` type in `src/payload-types.ts`.

- [ ] **Step 1: Write the revalidation hook**

```typescript
// src/collections/hooks/revalidateSignupCampaign.ts
import type { CollectionAfterChangeHook } from 'payload'

/**
 * Bust the Next.js Data Cache for a campaign after an admin edit.
 * Fire-and-forget by design — a slow or down revalidate endpoint must never
 * block the editor's save.
 */
export const revalidateSignupCampaign: CollectionAfterChangeHook = ({ doc, context }) => {
  if (context?.skipHook) return doc

  fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: process.env.REVALIDATION_SECRET,
      tag: `signup-campaign-${doc.slug}`,
    }),
  }).catch((err) => console.error('[signup-campaigns] Revalidation failed:', err))

  return doc
}
```

- [ ] **Step 2: Write the collection**

Field names must match Task 1's `SignupQuestion` and `SignupCoreConfig` exactly.

```typescript
// src/collections/SignupCampaigns.ts
import type { CollectionConfig } from 'payload'
import { adminOnly, anyone, authenticated } from '@/lib/payload/access'
import { mediaField } from '@/lib/payload/fields'
import { revalidateSignupCampaign } from './hooks/revalidateSignupCampaign'

export const SignupCampaigns: CollectionConfig = {
  slug: 'signup-campaigns',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'slug', 'isActive', 'isDefault', 'updatedAt'],
    description: 'Promo signup landing pages served at /store/{store}/signup',
  },
  access: {
    create: authenticated,
    read: anyone,
    update: authenticated,
    delete: adminOnly,
  },
  hooks: {
    afterChange: [revalidateSignupCampaign],
    beforeValidate: [
      ({ data }) => {
        // RSM auto-routing geocodes a ZIP. Enabling it without collecting one
        // would silently route every lead to the fallback inbox, so the two
        // settings are kept consistent here rather than trusted to the editor.
        if (data?.notify?.autoRouteToRSM) {
          data.form = { ...data.form, collectZip: true, requireZip: true }
        }
        return data
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Campaign',
          fields: [
            { name: 'title', type: 'text', required: true },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              index: true,
              admin: { description: 'URL segment, e.g. fall-open-house' },
            },
            {
              name: 'stores',
              type: 'relationship',
              relationTo: 'storefronts',
              hasMany: true,
              required: true,
              admin: { description: 'Which storefronts this campaign runs at' },
            },
            { name: 'isActive', type: 'checkbox', index: true, defaultValue: false },
            {
              name: 'isDefault',
              type: 'checkbox',
              defaultValue: false,
              admin: { description: 'Serve this campaign at the bare /signup URL' },
            },
            { name: 'startDate', type: 'date' },
            {
              name: 'endDate',
              type: 'date',
              admin: { description: 'Leave empty for open-ended. After this date the page shows an "ended" panel.' },
            },
          ],
        },
        {
          label: 'Content',
          fields: [
            {
              name: 'hero',
              type: 'group',
              fields: [
                { name: 'kicker', type: 'text', admin: { description: 'Small line above the headline' } },
                {
                  name: 'heading',
                  type: 'text',
                  required: true,
                  admin: { description: 'The page H1. Exactly one per page — do not add another in a block.' },
                },
                { name: 'subheading', type: 'textarea' },
                mediaField('background', {
                  admin: { description: 'Image or video behind the hero' },
                }),
                {
                  name: 'scrim',
                  type: 'select',
                  defaultValue: 'medium',
                  options: [
                    { label: 'Light', value: 'light' },
                    { label: 'Medium', value: 'medium' },
                    { label: 'Heavy', value: 'heavy' },
                  ],
                  admin: { description: 'Darkening behind hero text. Must keep text at 4.5:1 — check visually.' },
                },
              ],
            },
            {
              name: 'blocks',
              type: 'blocks',
              blockReferences: [
                'content-rich-text',
                'content-image',
                'content-video',
                'content-banner',
                'layout-columns',
                'layout-spacer',
                'layout-divider',
                'signup-instructors',
                'signup-details',
                'signup-location',
              ],
              blocks: [],
              admin: { initCollapsed: true },
            },
          ],
        },
        {
          label: 'Form',
          fields: [
            { name: 'form', type: 'group', fields: [
              { name: 'title', type: 'text', defaultValue: 'Reserve your spot' },
              { name: 'subtitle', type: 'text', defaultValue: 'Takes about 2 minutes' },
              { name: 'submitLabel', type: 'text', defaultValue: 'Save My Spot' },
              { name: 'finePrint', type: 'textarea' },
              { name: 'collectPhone', type: 'checkbox', defaultValue: true },
              { name: 'requirePhone', type: 'checkbox', defaultValue: false },
              { name: 'collectZip', type: 'checkbox', defaultValue: true },
              { name: 'requireZip', type: 'checkbox', defaultValue: false },
              {
                name: 'questions',
                type: 'array',
                admin: {
                  description: 'Campaign-specific questions. The first 4 render in the sticky rail; the rest open in a second step.',
                },
                fields: [
                  {
                    name: 'type',
                    type: 'select',
                    required: true,
                    defaultValue: 'text',
                    options: [
                      { label: 'Short text', value: 'text' },
                      { label: 'Long text', value: 'textarea' },
                      { label: 'Dropdown', value: 'select' },
                      { label: 'Radio buttons', value: 'radio' },
                      { label: 'Checkbox', value: 'checkbox' },
                      { label: 'Date', value: 'date' },
                    ],
                  },
                  { name: 'label', type: 'text', required: true },
                  {
                    name: 'name',
                    type: 'text',
                    required: true,
                    admin: { description: 'Field key, lowercase, no spaces. Unique within this campaign.' },
                  },
                  { name: 'required', type: 'checkbox', defaultValue: false },
                  {
                    name: 'options',
                    type: 'array',
                    admin: { condition: (_, sibling) => ['select', 'radio'].includes(sibling?.type) },
                    fields: [
                      { name: 'label', type: 'text', required: true },
                      { name: 'value', type: 'text', required: true },
                    ],
                  },
                  { name: 'helpText', type: 'text' },
                  {
                    name: 'width',
                    type: 'select',
                    defaultValue: 'full',
                    options: [
                      { label: 'Full width', value: 'full' },
                      { label: 'Half width', value: 'half' },
                    ],
                  },
                ],
              },
              {
                name: 'successMode',
                type: 'select',
                defaultValue: 'message',
                options: [
                  { label: 'Show a message', value: 'message' },
                  { label: 'Redirect', value: 'redirect' },
                ],
              },
              {
                name: 'successMessage',
                type: 'richText',
                admin: { condition: (_, sibling) => sibling?.successMode === 'message' },
              },
              {
                name: 'redirectUrl',
                type: 'text',
                admin: { condition: (_, sibling) => sibling?.successMode === 'redirect' },
              },
            ]},
          ],
        },
        {
          label: 'Notifications',
          fields: [
            { name: 'notify', type: 'group', fields: [
              {
                name: 'recipients',
                type: 'array',
                fields: [{ name: 'email', type: 'email', required: true }],
                admin: { description: 'Who receives each lead' },
              },
              { name: 'includeStorefrontEmail', type: 'checkbox', defaultValue: false },
              { name: 'includeSchoolEmail', type: 'checkbox', defaultValue: false },
              {
                name: 'autoRouteToRSM',
                type: 'checkbox',
                defaultValue: false,
                admin: { description: 'Route by ZIP to the nearest dealer\'s RSM. Forces ZIP collection on.' },
              },
              { name: 'cc', type: 'array', fields: [{ name: 'email', type: 'email', required: true }] },
              {
                name: 'subjectTemplate',
                type: 'text',
                defaultValue: 'New signup — {{campaign}} ({{store}})',
                admin: { description: 'Supports {{campaign}}, {{store}}, {{firstName}}' },
              },
              {
                name: 'liveSendEnabled',
                type: 'checkbox',
                defaultValue: false,
                admin: { description: 'OFF by default. While off, recipients are logged but no email is sent.' },
              },
              { name: 'sendConfirmationToLead', type: 'checkbox', defaultValue: true },
              { name: 'confirmationSubject', type: 'text', defaultValue: 'Thanks — we\'ve got your spot' },
              { name: 'confirmationBody', type: 'richText' },
            ]},
          ],
        },
        {
          label: 'Shopify',
          fields: [
            { name: 'shopify', type: 'group', fields: [
              { name: 'enableSync', type: 'checkbox', defaultValue: true },
              {
                name: 'tags',
                type: 'array',
                fields: [{ name: 'tag', type: 'text', required: true }],
                admin: { description: 'signup-{slug} and store-{storeslug} are added automatically' },
              },
              { name: 'acceptsMarketing', type: 'checkbox', defaultValue: false },
            ]},
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'meta', type: 'group', fields: [
              { name: 'title', type: 'text' },
              { name: 'description', type: 'textarea' },
              mediaField('image'),
            ]},
          ],
        },
      ],
    },
  ],
}
```

- [ ] **Step 3: Register in the config**

In `src/payload.config.ts`, add the import beside the other collection imports and add `SignupCampaigns` to the `collections` array (around line 295), under a `// Signup Campaigns` comment after the Business collections.

```typescript
import { SignupCampaigns } from './collections/SignupCampaigns'
```

- [ ] **Step 4: Verify types generate and the admin builds**

Run: `bun run build`
Expected: build succeeds; `src/payload-types.ts` now exports `SignupCampaign`.

Then confirm the shape matches Task 1:

Run: `grep -n "questions" -A 12 src/payload-types.ts | head -25`
Expected: `type`, `label`, `name`, `required`, `options`, `helpText`, `width` all present. If any name differs, fix the collection — Task 9 and Task 10 cast to `SignupQuestion` and a mismatch breaks them.

- [ ] **Step 5: Commit**

```bash
git add src/collections/SignupCampaigns.ts src/collections/hooks/revalidateSignupCampaign.ts src/payload.config.ts
git commit -m "feat(signup): add signup-campaigns collection"
```

---

## Task 6: The `signup-leads` collection

**Files:**
- Create: `src/collections/SignupLeads.ts`
- Modify: `src/payload.config.ts`

**Interfaces:**
- Consumes: `signup-campaigns` (Task 5), `SignupAnswer` (Task 1).
- Produces: the `signup-leads` slug and generated `SignupLead` type. Task 10 writes to it.

- [ ] **Step 1: Write the collection**

```typescript
// src/collections/SignupLeads.ts
import type { CollectionConfig } from 'payload'
import { adminOnly, authenticated } from '@/lib/payload/access'

export const SignupLeads: CollectionConfig = {
  slug: 'signup-leads',
  admin: {
    useAsTitle: 'email',
    group: 'Business',
    defaultColumns: ['email', 'campaignSlug', 'storeslug', 'resendStatus', 'shopifyStatus', 'submittedAt'],
    description: 'Submissions from store signup campaign pages',
  },
  access: {
    // Written server-side via the Local API only. A public create would let
    // anyone forge leads directly against the REST endpoint.
    create: () => false,
    read: authenticated,
    update: authenticated,
    delete: adminOnly,
  },
  fields: [
    { name: 'campaign', type: 'relationship', relationTo: 'signup-campaigns', index: true },
    {
      name: 'campaignSlug',
      type: 'text',
      index: true,
      admin: { description: 'Denormalized — survives deletion of the campaign' },
    },
    { name: 'storefront', type: 'relationship', relationTo: 'storefronts', index: true },
    { name: 'storeslug', type: 'text', index: true },

    { name: 'firstName', type: 'text' },
    { name: 'lastName', type: 'text' },
    { name: 'email', type: 'email', index: true, required: true },
    { name: 'phone', type: 'text' },
    { name: 'zip', type: 'text' },

    {
      name: 'answers',
      type: 'array',
      admin: {
        description: 'Campaign questions as they read at submission time. Never rewrite these when the campaign changes.',
      },
      fields: [
        { name: 'name', type: 'text' },
        { name: 'label', type: 'text' },
        { name: 'value', type: 'text' },
      ],
    },

    {
      name: 'utm',
      type: 'group',
      fields: [
        { name: 'source', type: 'text' },
        { name: 'medium', type: 'text' },
        { name: 'campaign', type: 'text' },
        { name: 'term', type: 'text' },
        { name: 'content', type: 'text' },
      ],
    },

    { name: 'sourceUrl', type: 'text' },
    { name: 'userAgent', type: 'text' },
    { name: 'ipAddress', type: 'text' },
    { name: 'submittedAt', type: 'date' },

    {
      type: 'row',
      fields: [
        {
          name: 'resendStatus',
          type: 'select',
          defaultValue: 'pending',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Sent', value: 'sent' },
            { label: 'Failed', value: 'failed' },
            { label: 'Held (live send off)', value: 'held' },
          ],
        },
        { name: 'resendEmailId', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'confirmationStatus',
          type: 'select',
          defaultValue: 'pending',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Sent', value: 'sent' },
            { label: 'Failed', value: 'failed' },
            { label: 'Skipped', value: 'skipped' },
          ],
        },
        { name: 'confirmationEmailId', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'shopifyStatus',
          type: 'select',
          defaultValue: 'pending',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Synced', value: 'synced' },
            { label: 'Failed', value: 'failed' },
            { label: 'Skipped', value: 'skipped' },
          ],
        },
        { name: 'shopifyCustomerId', type: 'text' },
      ],
    },
  ],
}
```

- [ ] **Step 2: Register in the config**

Add the import and place `SignupLeads` in the `collections` array immediately after `SignupCampaigns`.

- [ ] **Step 3: Verify**

Run: `bun run build`
Expected: succeeds; `SignupLead` exported from `src/payload-types.ts`.

- [ ] **Step 4: Commit**

```bash
git add src/collections/SignupLeads.ts src/payload.config.ts
git commit -m "feat(signup): add signup-leads collection with per-channel delivery status"
```

---

## Task 7: The three signup blocks

**Files:**
- Create: `src/blocks/signup/Instructors.ts`, `Details.ts`, `Location.ts`, `index.ts`
- Modify: `src/payload.config.ts` (`blocks` array, around line 338)

**Interfaces:**
- Consumes: nothing.
- Produces: block slugs `signup-instructors`, `signup-details`, `signup-location` — already referenced by Task 5's `blockReferences`, so Task 5's admin will not render blocks correctly until this task lands.

- [ ] **Step 1: Write the blocks**

```typescript
// src/blocks/signup/Instructors.ts
import type { Block } from 'payload'

export const SignupInstructors: Block = {
  slug: 'signup-instructors',
  interfaceName: 'SignupInstructorsBlock',
  labels: { singular: 'Instructors', plural: 'Instructors' },
  admin: { group: 'Signup' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: "Who you'll meet" },
    { name: 'intro', type: 'textarea' },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 6,
      admin: { description: 'Maximum faculty to show. Pulled from the linked Music School.' },
    },
  ],
}
```

```typescript
// src/blocks/signup/Details.ts
import type { Block } from 'payload'

export const SignupDetails: Block = {
  slug: 'signup-details',
  interfaceName: 'SignupDetailsBlock',
  labels: { singular: 'Event Details', plural: 'Event Details' },
  admin: { group: 'Signup' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'What to expect' },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'icon',
          type: 'select',
          defaultValue: 'calendar',
          options: [
            { label: 'Calendar', value: 'calendar' },
            { label: 'Clock', value: 'clock' },
            { label: 'Price tag', value: 'price' },
            { label: 'People', value: 'people' },
            { label: 'Location pin', value: 'pin' },
            { label: 'Note', value: 'note' },
          ],
        },
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
  ],
}
```

```typescript
// src/blocks/signup/Location.ts
import type { Block } from 'payload'

export const SignupLocation: Block = {
  slug: 'signup-location',
  interfaceName: 'SignupLocationBlock',
  labels: { singular: 'Location', plural: 'Locations' },
  admin: { group: 'Signup' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'Getting here' },
    { name: 'showMap', type: 'checkbox', defaultValue: true },
    { name: 'showHours', type: 'checkbox', defaultValue: true },
    {
      name: 'parkingNote',
      type: 'textarea',
      admin: { description: 'Address and hours come from the Storefront record automatically.' },
    },
  ],
}
```

```typescript
// src/blocks/signup/index.ts
export { SignupInstructors } from './Instructors'
export { SignupDetails } from './Details'
export { SignupLocation } from './Location'
```

- [ ] **Step 2: Register the blocks**

Import them in `src/payload.config.ts` and append to the global `blocks` array (around line 338) under a `// Signup campaign blocks` comment.

- [ ] **Step 3: Verify the admin renders them**

Run: `bun run build`
Expected: succeeds.

Run: `bun run dev`, open `http://localhost:3000/admin/collections/signup-campaigns/create`, Content tab → Add Block.
Expected: a "Signup" group listing Instructors, Event Details, Location alongside the reused content and layout blocks.

- [ ] **Step 4: Commit**

```bash
git add src/blocks/signup/ src/payload.config.ts
git commit -m "feat(signup): add instructors, details and location blocks"
```

---

## Task 8: Campaign queries and the route

**Files:**
- Modify: `src/lib/payload/queries.ts` (append)
- Create: `src/app/(frontend)/store/[storeslug]/signup/[[...campaign]]/page.tsx`
- Create: `src/components/signup/SignupLockup.tsx`
- Create: `src/components/signup/SignupHero.tsx`
- Create: `src/components/signup/SignupEndedPanel.tsx`

**Interfaces:**
- Consumes: `resolveCampaign` (Task 4), `signup-campaigns` (Task 5), `getStorefrontBySlugDirect` (existing).
- Produces: `getSignupCampaignsForStore(storeslug: string): Promise<SignupCampaign[]>`, `getAllSignupCampaignParams()`. Task 10 also calls `getSignupCampaignsForStore`.

- [ ] **Step 1: Add the queries**

Append to `src/lib/payload/queries.ts`. Note the named type alias — an inline `Promise<{...} | null>` annotation inside an `unstable_cache` argument fails to parse in this codebase.

```typescript
type SignupCampaignList = SignupCampaign[]

/**
 * All campaigns attached to a storefront. Resolution (default vs named,
 * date windows) happens in `resolveCampaign` so it stays unit-testable.
 *
 * depth: 1 populates hero media and block images. depth: 2 would inspect
 * those Media docs for relationships they do not have — dozens of wasted
 * round-trips on a block-heavy document.
 */
export function getSignupCampaignsForStore(storeslug: string) {
  return unstable_cache(
    async (): Promise<SignupCampaignList> => {
      const payload = await getPayloadClient()
      const storefront = await payload.find({
        collection: 'storefronts',
        where: { slug: { equals: storeslug } },
        select: { id: true },
        depth: 0,
        limit: 1,
      })

      const storefrontId = storefront.docs[0]?.id
      if (!storefrontId) return []

      const result = await payload.find({
        collection: 'signup-campaigns',
        where: {
          and: [{ stores: { contains: storefrontId } }, { isActive: { equals: true } }],
        },
        depth: 1,
        limit: 50,
      })

      return result.docs
    },
    [`signup-campaigns-${storeslug}`],
    { tags: [`signup-campaigns-${storeslug}`, 'signup-campaigns'], revalidate: 3600 },
  )()
}

/** Every active campaign × store pair, for generateStaticParams. */
export async function getAllSignupCampaignParams(): Promise<
  { storeslug: string; campaign: string[] }[]
> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'signup-campaigns',
    where: { isActive: { equals: true } },
    select: { slug: true, stores: true },
    depth: 1,
    limit: 200,
  })

  const params: { storeslug: string; campaign: string[] }[] = []

  for (const campaign of result.docs) {
    for (const store of campaign.stores ?? []) {
      const storeslug = typeof store === 'object' && store !== null ? store.slug : null
      if (!storeslug) continue
      params.push({ storeslug, campaign: [campaign.slug] })
    }
  }

  return params
}
```

Add `SignupCampaign` to the `@/payload-types` import at the top of the file.

- [ ] **Step 2: Write the lockup**

```tsx
// src/components/signup/SignupLockup.tsx
import Image from 'next/image'

/**
 * Header lockup: KMS logo │ hairline rule │ storefront name.
 *
 * The asset is 1430×128 — an 11:1 ratio — so it is given an explicit height
 * and auto width, and the rule and city wrap beneath it on narrow screens.
 * The red PNG is used as-is on this light header; it must not be placed on a
 * dark background without a proper white/mono asset (a CSS invert() fringes
 * on the curves).
 */
export function SignupLockup({ storeName }: { storeName: string }) {
  return (
    <header className="border-b border-kawai-neutral bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6">
        <Image
          src="/images/kms/KMS Logo.png"
          alt="Kawai Music School"
          width={1430}
          height={128}
          priority
          className="h-5 w-auto sm:h-6"
        />
        <span aria-hidden="true" className="hidden h-5 w-px bg-kawai-neutral sm:block" />
        <span className="text-sm font-semibold uppercase tracking-[0.14em] text-kawai-black">
          {storeName}
        </span>
      </div>
    </header>
  )
}
```

- [ ] **Step 3: Write the hero**

```tsx
// src/components/signup/SignupHero.tsx
import Image from 'next/image'
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'
import type { SignupCampaign } from '@/payload-types'

const SCRIM = {
  light: 'from-black/30 to-black/45',
  medium: 'from-black/40 to-black/60',
  heavy: 'from-black/55 to-black/75',
} as const

/**
 * Owns the page's single <h1>. No block may emit another.
 *
 * The scrim is not decoration — hero text sits over marketer-chosen imagery,
 * and WCAG 1.4.3 still demands 4.5:1. Automated tools cannot measure text on
 * an image, so this must be checked visually per campaign.
 */
export function SignupHero({ hero }: { hero: SignupCampaign['hero'] }) {
  const scrim = SCRIM[hero?.scrim ?? 'medium'] ?? SCRIM.medium
  const image = getImagePropsWithFallback(
    hero?.background ?? null,
    '/images/defaults/piano-fallback.jpg',
    'hero',
    { priority: true, sizes: '100vw' },
  )

  return (
    <section className="relative isolate overflow-hidden bg-kawai-black">
      <Image {...image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
      <div className={`absolute inset-0 bg-gradient-to-b ${scrim}`} aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        {hero?.kicker ? (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-kawai-gold">
            {hero.kicker}
          </p>
        ) : null}
        <h1 className="max-w-[14ch] text-4xl font-extrabold leading-[1.03] tracking-tight text-kawai-pearl sm:text-6xl">
          {hero?.heading}
        </h1>
        {hero?.subheading ? (
          <p className="mt-5 max-w-[42ch] text-base leading-relaxed text-kawai-pearl/85">
            {hero.subheading}
          </p>
        ) : null}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Write the ended panel**

```tsx
// src/components/signup/SignupEndedPanel.tsx
import Link from 'next/link'

/**
 * Rendered at HTTP 200 when a campaign's endDate has passed.
 *
 * Deliberately not a 404: these URLs go on printed flyers and QR codes that
 * outlive the promo, so the traffic is real and worth catching.
 */
export function SignupEndedPanel({
  campaignTitle,
  storeName,
  storeslug,
}: {
  campaignTitle: string
  storeName: string
  storeslug: string
}) {
  return (
    <main className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-kawai-black sm:text-4xl">
        {campaignTitle} has ended
      </h1>
      <p className="mt-4 text-base leading-relaxed text-kawai-charcoal">
        Thanks for your interest. This event is over, but {storeName} is open and
        would love to hear from you.
      </p>
      <Link
        href={`/store/${storeslug}`}
        className="mt-8 inline-block rounded-md bg-kawai-red px-6 py-3 font-semibold text-white transition-colors hover:bg-kawai-red-600"
      >
        Visit {storeName}
      </Link>
    </main>
  )
}
```

- [ ] **Step 5: Write the route**

```tsx
// src/app/(frontend)/store/[storeslug]/signup/[[...campaign]]/page.tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getSignupCampaignsForStore, getAllSignupCampaignParams, getStorefrontBySlugDirect } from '@/lib/payload/queries'
import { resolveCampaign, type ResolvableCampaign } from '@/lib/signup/resolve'
import { getSiteAlternates } from '@/lib/site-context'
import { SignupLockup } from '@/components/signup/SignupLockup'
import { SignupHero } from '@/components/signup/SignupHero'
import { SignupEndedPanel } from '@/components/signup/SignupEndedPanel'
import { RenderBlocks } from '@/blocks/RenderBlocks'

export const revalidate = 3600
export const dynamicParams = true

type Params = { storeslug: string; campaign?: string[] }

export async function generateStaticParams() {
  return getAllSignupCampaignParams()
}

/** Shared by generateMetadata and the page so resolution happens once per shape. */
async function resolve(params: Params) {
  const [storefront, campaigns] = await Promise.all([
    getStorefrontBySlugDirect(params.storeslug),
    getSignupCampaignsForStore(params.storeslug),
  ])

  const slug = params.campaign?.[0] ?? null
  const resolution = resolveCampaign(
    campaigns.map((c) => ({
      ...c,
      isActive: Boolean(c.isActive),
      isDefault: Boolean(c.isDefault),
      startDate: c.startDate ?? null,
      endDate: c.endDate ?? null,
    })) as (ResolvableCampaign & (typeof campaigns)[number])[],
    { slug, now: new Date() },
  )

  return { storefront, resolution }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const resolved = await params
  const { storefront, resolution } = await resolve(resolved)
  const campaign = resolution.campaign
  const path = `/store/${resolved.storeslug}/signup${campaign ? `/${campaign.slug}` : ''}`

  return {
    title: campaign?.meta?.title ?? campaign?.title ?? 'Sign Up',
    description: campaign?.meta?.description ?? undefined,
    alternates: { languages: await getSiteAlternates(path) },
    robots: resolution.status === 'ended' ? { index: false } : undefined,
  }
}

export default async function SignupCampaignPage({ params }: { params: Promise<Params> }) {
  const resolved = await params
  const { storefront, resolution } = await resolve(resolved)

  if (!storefront || resolution.status === 'missing' || !resolution.campaign) notFound()

  const campaign = resolution.campaign
  const storeName = storefront.storeName ?? resolved.storeslug

  if (resolution.status === 'ended') {
    return (
      <>
        <SignupLockup storeName={storeName} />
        <SignupEndedPanel
          campaignTitle={campaign.title}
          storeName={storeName}
          storeslug={resolved.storeslug}
        />
      </>
    )
  }

  return (
    <>
      <SignupLockup storeName={storeName} />
      <SignupHero hero={campaign.hero} />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="lg:grid lg:grid-cols-[1.35fr_1fr] lg:gap-8 lg:items-start">
          <div className="space-y-4">
            <RenderBlocks blocks={campaign.blocks ?? []} />
          </div>
          {/* Task 9 mounts SignupRail here */}
        </div>
      </main>
    </>
  )
}
```

- [ ] **Step 6: Verify against a real campaign**

Run: `bun run dev`. In the admin create a campaign — title "Fall Open House", slug `fall-open-house`, stores → Houston, `isActive` on, `isDefault` on, hero heading "Find the music in your family", one rich-text block. Save.

Visit `http://localhost:3000/store/houston/signup`
Expected: lockup, hero with the H1, the rich-text block. No form yet.

Visit `http://localhost:3000/store/houston/signup/fall-open-house`
Expected: identical page.

Visit `http://localhost:3000/store/houston/signup/nope`
Expected: 404.

Set `endDate` to yesterday, save, reload the named URL.
Expected: the ended panel, HTTP 200.

Confirm exactly one `<h1>`:

Run: `curl -s http://localhost:3000/store/houston/signup | grep -c "<h1"`
Expected: `1`

- [ ] **Step 7: Commit**

```bash
git add src/lib/payload/queries.ts src/components/signup/ "src/app/(frontend)/store/[storeslug]/signup"
git commit -m "feat(signup): render campaign landing pages with hero, blocks and ended state"
```

---

## Task 9: The form and the sticky rail

**Files:**
- Create: `src/components/signup/SignupQuestionField.tsx`
- Create: `src/components/signup/SignupForm.tsx`
- Create: `src/components/signup/SignupRail.tsx`
- Modify: `src/app/(frontend)/store/[storeslug]/signup/[[...campaign]]/page.tsx`

**Interfaces:**
- Consumes: `buildSignupSchema` (Task 1), `SignupQuestion` (Task 1), `submitSignupCampaign` (Task 10 — stub it in this task, wire it in Task 10).
- Produces: `<SignupRail campaign={...} storeslug={...} />`.

**The rail cap:** the first `RAIL_QUESTION_LIMIT = 4` questions render inline. Beyond that, the rail shows contact fields plus a Continue button that opens the remainder in the shared `Modal`. Without the cap, a form taller than the viewport has nowhere to stick and scrolls away — which removes the entire reason to choose this layout.

- [ ] **Step 1: Write the question field**

Every branch renders a real `<label>` or a `<fieldset><legend>`. A placeholder is not an accessible name.

```tsx
// src/components/signup/SignupQuestionField.tsx
'use client'

import type { FieldError, UseFormRegister } from 'react-hook-form'
import type { SignupQuestion } from '@/lib/signup/types'

interface Props {
  question: SignupQuestion
  register: UseFormRegister<Record<string, unknown>>
  error?: FieldError | undefined
}

export function SignupQuestionField({ question, register, error }: Props) {
  const id = `q-${question.name}`
  const describedBy = [question.helpText ? `${id}-help` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(' ') || undefined

  const help = question.helpText ? (
    <p id={`${id}-help`} className="mt-1 text-xs text-kawai-charcoal/70">{question.helpText}</p>
  ) : null

  const errorEl = error ? (
    <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-kawai-red">{error.message}</p>
  ) : null

  const labelClass = 'block text-xs font-semibold uppercase tracking-[0.12em] text-kawai-charcoal'
  const controlClass =
    'mt-1 w-full rounded border border-kawai-neutral bg-white px-3 py-2 text-sm text-kawai-black focus:border-kawai-red focus:outline-none focus:ring-2 focus:ring-kawai-red/30'

  if (question.type === 'checkbox') {
    return (
      <div>
        <label htmlFor={id} className="flex items-start gap-2 text-sm text-kawai-black">
          <input
            id={id}
            type="checkbox"
            aria-describedby={describedBy}
            {...register(question.name)}
            className="mt-0.5 h-4 w-4 rounded border-kawai-neutral text-kawai-red focus:ring-kawai-red/30"
          />
          <span>{question.label}{question.required ? ' *' : ''}</span>
        </label>
        {help}
        {errorEl}
      </div>
    )
  }

  if (question.type === 'radio') {
    return (
      <fieldset aria-describedby={describedBy}>
        <legend className={labelClass}>{question.label}{question.required ? ' *' : ''}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {(question.options ?? []).map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-kawai-neutral bg-white px-3 py-1.5 text-sm text-kawai-charcoal has-[:checked]:border-kawai-black has-[:checked]:bg-kawai-black has-[:checked]:text-kawai-pearl"
            >
              <input type="radio" value={option.value} {...register(question.name)} className="sr-only" />
              {option.label}
            </label>
          ))}
        </div>
        {help}
        {errorEl}
      </fieldset>
    )
  }

  if (question.type === 'select') {
    return (
      <div>
        <label htmlFor={id} className={labelClass}>{question.label}{question.required ? ' *' : ''}</label>
        <select id={id} aria-describedby={describedBy} {...register(question.name)} className={controlClass}>
          <option value="">Please choose…</option>
          {(question.options ?? []).map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {help}
        {errorEl}
      </div>
    )
  }

  if (question.type === 'textarea') {
    return (
      <div>
        <label htmlFor={id} className={labelClass}>{question.label}{question.required ? ' *' : ''}</label>
        <textarea id={id} rows={3} aria-describedby={describedBy} {...register(question.name)} className={controlClass} />
        {help}
        {errorEl}
      </div>
    )
  }

  return (
    <div>
      <label htmlFor={id} className={labelClass}>{question.label}{question.required ? ' *' : ''}</label>
      <input
        id={id}
        type={question.type === 'date' ? 'date' : 'text'}
        aria-describedby={describedBy}
        {...register(question.name)}
        className={controlClass}
      />
      {help}
      {errorEl}
    </div>
  )
}
```

- [ ] **Step 2: Write the form**

```tsx
// src/components/signup/SignupForm.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { buildSignupSchema } from '@/lib/signup/schema'
import type { SignupCoreConfig, SignupQuestion } from '@/lib/signup/types'
import { SignupQuestionField } from './SignupQuestionField'
import { submitSignupCampaign } from '@/lib/actions/signup-campaign-submit'

export const RAIL_QUESTION_LIMIT = 4

interface Props {
  campaignSlug: string
  storeslug: string
  core: SignupCoreConfig
  questions: SignupQuestion[]
  submitLabel: string
  finePrint?: string | null
  /** Render only the first RAIL_QUESTION_LIMIT questions; the rest live in the modal. */
  inlineOnly?: boolean
  onOverflow?: () => void
  onSuccess: (result: { mode: 'message' | 'redirect'; message?: string; redirectUrl?: string }) => void
}

export function SignupForm({
  campaignSlug, storeslug, core, questions, submitLabel, finePrint,
  inlineOnly = false, onOverflow, onSuccess,
}: Props) {
  const [serverError, setServerError] = useState<string | null>(null)
  const schema = buildSignupSchema(core, questions)
  const { register, handleSubmit, formState } = useForm<Record<string, unknown>>({
    resolver: zodResolver(schema),
  })

  const overflow = questions.length > RAIL_QUESTION_LIMIT
  const shown = inlineOnly ? questions.slice(0, RAIL_QUESTION_LIMIT) : questions

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null)
    const result = await submitSignupCampaign({ campaignSlug, storeslug, values })
    if (!result.success) {
      setServerError(result.error ?? 'Something went wrong. Please try again.')
      return
    }
    onSuccess(result)
  })

  const controlClass =
    'mt-1 w-full rounded border border-kawai-neutral bg-white px-3 py-2 text-sm text-kawai-black focus:border-kawai-red focus:outline-none focus:ring-2 focus:ring-kawai-red/30'
  const labelClass = 'block text-xs font-semibold uppercase tracking-[0.12em] text-kawai-charcoal'

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-3">
      {/* Honeypot — visually and programmatically hidden from real users. */}
      <input
        type="text" tabIndex={-1} autoComplete="off" aria-hidden="true"
        {...register('company')} className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="firstName" className={labelClass}>First name *</label>
          <input id="firstName" autoComplete="given-name" {...register('firstName')} className={controlClass} />
          {formState.errors.firstName ? (
            <p role="alert" className="mt-1 text-xs text-kawai-red">{String(formState.errors.firstName.message)}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="lastName" className={labelClass}>Last name *</label>
          <input id="lastName" autoComplete="family-name" {...register('lastName')} className={controlClass} />
          {formState.errors.lastName ? (
            <p role="alert" className="mt-1 text-xs text-kawai-red">{String(formState.errors.lastName.message)}</p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>Email *</label>
        <input id="email" type="email" autoComplete="email" {...register('email')} className={controlClass} />
        {formState.errors.email ? (
          <p role="alert" className="mt-1 text-xs text-kawai-red">{String(formState.errors.email.message)}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {core.collectPhone ? (
          <div>
            <label htmlFor="phone" className={labelClass}>Phone{core.requirePhone ? ' *' : ''}</label>
            <input id="phone" type="tel" autoComplete="tel" {...register('phone')} className={controlClass} />
          </div>
        ) : null}
        {core.collectZip ? (
          <div>
            <label htmlFor="zip" className={labelClass}>ZIP{core.requireZip ? ' *' : ''}</label>
            <input id="zip" autoComplete="postal-code" {...register('zip')} className={controlClass} />
          </div>
        ) : null}
      </div>

      {shown.length > 0 ? (
        <div className="space-y-3 border-t border-kawai-neutral/60 pt-3">
          {shown.map((q) => (
            <SignupQuestionField
              key={q.name}
              question={q}
              register={register}
              error={formState.errors[q.name] as never}
            />
          ))}
        </div>
      ) : null}

      {serverError ? (
        <p role="alert" className="rounded bg-kawai-red/10 px-3 py-2 text-sm text-kawai-red">{serverError}</p>
      ) : null}

      {inlineOnly && overflow ? (
        <button
          type="button"
          onClick={onOverflow}
          className="w-full rounded bg-kawai-red px-4 py-3 font-bold text-white transition-colors hover:bg-kawai-red-600"
        >
          Continue
        </button>
      ) : (
        <button
          type="submit"
          disabled={formState.isSubmitting}
          className="w-full rounded bg-kawai-red px-4 py-3 font-bold text-white transition-colors hover:bg-kawai-red-600 disabled:opacity-60"
        >
          {formState.isSubmitting ? 'Sending…' : submitLabel}
        </button>
      )}

      {finePrint ? <p className="text-center text-[11px] leading-snug text-kawai-charcoal/60">{finePrint}</p> : null}
    </form>
  )
}
```

- [ ] **Step 3: Write the rail**

```tsx
// src/components/signup/SignupRail.tsx
'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { useModal } from '@/hooks/useModal'
import { SignupForm, RAIL_QUESTION_LIMIT } from './SignupForm'
import type { SignupCoreConfig, SignupQuestion } from '@/lib/signup/types'

interface Props {
  campaignSlug: string
  storeslug: string
  title: string
  subtitle?: string | null
  submitLabel: string
  finePrint?: string | null
  core: SignupCoreConfig
  questions: SignupQuestion[]
}

export function SignupRail(props: Props) {
  const { isOpen, open, close } = useModal()
  const [done, setDone] = useState<string | null>(null)

  const overflow = props.questions.length > RAIL_QUESTION_LIMIT

  const onSuccess = (result: { mode: 'message' | 'redirect'; message?: string; redirectUrl?: string }) => {
    if (result.mode === 'redirect' && result.redirectUrl) {
      window.location.assign(result.redirectUrl)
      return
    }
    close()
    setDone(result.message ?? 'Thanks — you\'re all set. Check your email for a confirmation.')
  }

  return (
    <aside id="signup-form" className="mt-8 lg:mt-0 lg:sticky lg:top-6">
      <div className="overflow-hidden rounded-lg border border-kawai-neutral bg-white shadow-lg">
        <div className="bg-kawai-black px-4 py-3">
          <p className="text-base font-bold text-kawai-pearl">{props.title}</p>
          {props.subtitle ? (
            <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-kawai-gold">
              {props.subtitle}
            </p>
          ) : null}
        </div>
        <div className="px-4 py-4">
          {done ? (
            <p role="status" className="py-6 text-center text-sm text-kawai-black">{done}</p>
          ) : (
            <SignupForm {...props} inlineOnly={overflow} onOverflow={open} onSuccess={onSuccess} />
          )}
        </div>
      </div>

      {overflow ? (
        <Modal isOpen={isOpen} onClose={close}>
          <div className="max-h-[80vh] overflow-y-auto p-5">
            <h2 className="mb-4 text-xl font-bold text-kawai-black">{props.title}</h2>
            <SignupForm {...props} inlineOnly={false} onSuccess={onSuccess} />
          </div>
        </Modal>
      ) : null}
    </aside>
  )
}
```

- [ ] **Step 4: Mount the rail in the route**

Replace the `{/* Task 9 mounts SignupRail here */}` comment with:

```tsx
<SignupRail
  campaignSlug={campaign.slug}
  storeslug={resolved.storeslug}
  title={campaign.form?.title ?? 'Reserve your spot'}
  subtitle={campaign.form?.subtitle}
  submitLabel={campaign.form?.submitLabel ?? 'Save My Spot'}
  finePrint={campaign.form?.finePrint}
  core={{
    collectPhone: Boolean(campaign.form?.collectPhone),
    requirePhone: Boolean(campaign.form?.requirePhone),
    collectZip: Boolean(campaign.form?.collectZip),
    requireZip: Boolean(campaign.form?.requireZip),
  }}
  questions={(campaign.form?.questions ?? []) as SignupQuestion[]}
/>
```

Import `SignupRail` and the `SignupQuestion` type.

- [ ] **Step 5: Verify**

`bun run dev`. Add three questions to the campaign.
Expected: all three render in the rail; the rail stays pinned while the left column scrolls.

Add three more (six total).
Expected: four render inline, the button reads "Continue", clicking it opens the modal with all six.

Keyboard-only pass: Tab reaches every control, each announces its label, the modal traps focus and closes on Escape.

Run: `bun run lint`
Expected: clean.

- [ ] **Step 6: Commit**

```bash
git add src/components/signup/ "src/app/(frontend)/store/[storeslug]/signup"
git commit -m "feat(signup): add campaign form with sticky rail and overflow modal"
```

---

## Task 10: The Server Action — validate and persist

Resend and Shopify arrive in Tasks 11 and 12. This task ends with leads reliably saved.

**Files:**
- Create: `src/lib/actions/signup-campaign-submit.ts`

**Interfaces:**
- Consumes: `buildSignupSchema` (1), `denormalizeAnswers` (2), `resolveCampaign` (4), `getSignupCampaignsForStore` (8), `signup-leads` (6).
- Produces: `submitSignupCampaign(input): Promise<SubmitResult>` where
  `SubmitResult = { success: true; mode: 'message' | 'redirect'; message?: string; redirectUrl?: string } | { success: false; error: string }`.
  Task 9's `SignupForm` already calls this exact signature.

- [ ] **Step 1: Write the action**

```typescript
// src/lib/actions/signup-campaign-submit.ts
'use server'

import { headers } from 'next/headers'
import { getPayloadClient, getSignupCampaignsForStore, getStorefrontBySlugDirect } from '@/lib/payload/queries'
import { buildSignupSchema } from '@/lib/signup/schema'
import { denormalizeAnswers } from '@/lib/signup/answers'
import { resolveCampaign, type ResolvableCampaign } from '@/lib/signup/resolve'
import type { SignupQuestion } from '@/lib/signup/types'

export type SubmitResult =
  | { success: true; mode: 'message' | 'redirect'; message?: string; redirectUrl?: string }
  | { success: false; error: string }

interface SubmitInput {
  campaignSlug: string
  storeslug: string
  values: Record<string, unknown>
}

/**
 * Handle one campaign form submission.
 *
 * Order is deliberate. The campaign is re-fetched server-side and the schema
 * derived from THAT — never from anything the client sent. If the client could
 * supply field definitions, a crafted POST would bypass every `required` rule
 * and every option whitelist.
 *
 * The lead is written before any outbound call, so the visitor's data is
 * durable before anything that can fail over the network is attempted.
 */
export async function submitSignupCampaign(input: SubmitInput): Promise<SubmitResult> {
  try {
    // Honeypot: a hidden field only an automated filler would populate.
    if (typeof input.values.company === 'string' && input.values.company.trim() !== '') {
      // Report success so the bot has nothing to learn from the response.
      return { success: true, mode: 'message', message: 'Thanks!' }
    }

    const [storefront, campaigns] = await Promise.all([
      getStorefrontBySlugDirect(input.storeslug),
      getSignupCampaignsForStore(input.storeslug),
    ])

    if (!storefront) return { success: false, error: 'This store was not found.' }

    const { status, campaign } = resolveCampaign(
      campaigns.map((c) => ({
        ...c,
        isActive: Boolean(c.isActive),
        isDefault: Boolean(c.isDefault),
        startDate: c.startDate ?? null,
        endDate: c.endDate ?? null,
      })) as (ResolvableCampaign & (typeof campaigns)[number])[],
      { slug: input.campaignSlug, now: new Date() },
    )

    if (status !== 'active' || !campaign) {
      return { success: false, error: 'This signup is no longer accepting submissions.' }
    }

    const questions = (campaign.form?.questions ?? []) as SignupQuestion[]
    const schema = buildSignupSchema(
      {
        collectPhone: Boolean(campaign.form?.collectPhone),
        requirePhone: Boolean(campaign.form?.requirePhone),
        collectZip: Boolean(campaign.form?.collectZip),
        requireZip: Boolean(campaign.form?.requireZip),
      },
      questions,
    )

    const parsed = schema.safeParse(input.values)
    if (!parsed.success) {
      return { success: false, error: 'Please check the highlighted fields and try again.' }
    }

    const values = parsed.data as Record<string, unknown>
    const headerList = await headers()
    const payload = await getPayloadClient()

    const lead = await payload.create({
      collection: 'signup-leads',
      data: {
        campaign: campaign.id,
        campaignSlug: campaign.slug,
        storefront: storefront.id,
        storeslug: input.storeslug,
        firstName: String(values.firstName ?? ''),
        lastName: String(values.lastName ?? ''),
        email: String(values.email ?? ''),
        phone: values.phone ? String(values.phone) : undefined,
        zip: values.zip ? String(values.zip) : undefined,
        answers: denormalizeAnswers(questions, values),
        sourceUrl: headerList.get('referer') ?? undefined,
        userAgent: headerList.get('user-agent') ?? undefined,
        ipAddress: headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? undefined,
        submittedAt: new Date().toISOString(),
      },
    })

    // Tasks 11 and 12 dispatch notification and Shopify sync here. Both are
    // independent of each other and neither may fail this submission.

    if (campaign.form?.successMode === 'redirect' && campaign.form.redirectUrl) {
      return { success: true, mode: 'redirect', redirectUrl: campaign.form.redirectUrl }
    }

    return {
      success: true,
      mode: 'message',
      message: 'Thanks — you\'re all set. Check your email for a confirmation.',
    }
  } catch (error) {
    console.error('[signup] Submission failed:', error)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}
```

- [ ] **Step 2: Verify end to end**

`bun run dev`, submit the Houston form with valid values.
Expected: success message; a new document in `/admin/collections/signup-leads` with the contact core, `answers` carrying labels and human-readable values, and `campaignSlug` / `storeslug` populated.

Submit with an invalid email.
Expected: inline field error; no lead written.

Confirm the server ignores client-side field tampering:

```bash
# Post a value for a question this campaign never defined.
curl -s -X POST http://localhost:3000/store/houston/signup \
  -H 'Content-Type: application/json' \
  -d '{"campaignSlug":"fall-open-house","storeslug":"houston","values":{"firstName":"A","lastName":"B","email":"a@b.co","isAdmin":true}}' > /dev/null
```
Expected: the created lead has no trace of `isAdmin` — Zod strips unknown keys.

Rename a question's label in the admin and reload the lead.
Expected: the lead still shows the **old** label. This is the denormalization guarantee.

- [ ] **Step 3: Commit**

```bash
git add src/lib/actions/signup-campaign-submit.ts
git commit -m "feat(signup): validate submissions server-side and persist leads"
```

---

## Task 11: Resend notification and confirmation

**Files:**
- Create: `src/lib/signup/notify.ts`
- Create: `src/lib/signup/notify.test.ts`
- Modify: `src/lib/actions/signup-campaign-submit.ts`

**Interfaces:**
- Consumes: `resolveSignupRecipients` (3), `SignupAnswer` (1), `escapeHtml` from `@/lib/rsm/lead-email`.
- Produces: `buildNotificationSubject(template, vars)`, `buildNotificationHtml(input)`, `sendSignupNotification(input): Promise<{ status, emailId? }>`.

- [ ] **Step 1: Write the failing test for the pure parts**

```typescript
// src/lib/signup/notify.test.ts
import { describe, expect, it } from 'bun:test'
import { buildNotificationSubject, buildNotificationHtml } from './notify'

describe('buildNotificationSubject', () => {
  it('substitutes every supported variable', () => {
    const subject = buildNotificationSubject('New signup — {{campaign}} ({{store}}) from {{firstName}}', {
      campaign: 'Fall Open House',
      store: 'Houston',
      firstName: 'Ada',
    })
    expect(subject).toBe('New signup — Fall Open House (Houston) from Ada')
  })

  it('leaves an unknown placeholder untouched rather than printing undefined', () => {
    const subject = buildNotificationSubject('Hi {{nope}}', {
      campaign: 'C', store: 'S', firstName: 'F',
    })
    expect(subject).toBe('Hi {{nope}}')
  })

  it('falls back to a sane default for an empty template', () => {
    expect(buildNotificationSubject('', { campaign: 'C', store: 'S', firstName: 'F' }))
      .toBe('New signup — C (S)')
  })
})

describe('buildNotificationHtml', () => {
  const base = {
    campaignTitle: 'Fall Open House',
    storeName: 'Houston',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    phone: '5551234567',
    zip: '77002',
    answers: [{ name: 'instrument', label: 'Which instrument?', value: 'Piano' }],
    sourceUrl: 'https://kawaius.com/store/houston/signup',
  }

  it('includes the contact core and every answer', () => {
    const html = buildNotificationHtml(base)
    expect(html).toContain('ada@example.com')
    expect(html).toContain('Which instrument?')
    expect(html).toContain('Piano')
  })

  it('escapes HTML so a lead cannot inject markup into the inbox', () => {
    const html = buildNotificationHtml({ ...base, firstName: '<script>alert(1)</script>' })
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
  })

  it('omits rows for fields that were not collected', () => {
    const html = buildNotificationHtml({ ...base, phone: undefined, zip: undefined })
    expect(html).not.toContain('Phone')
    expect(html).not.toContain('ZIP')
  })
})
```

- [ ] **Step 2: Run the test and watch it fail**

Run: `bun test src/lib/signup/notify.test.ts`
Expected: FAIL — cannot resolve `./notify`.

- [ ] **Step 3: Implement**

```typescript
// src/lib/signup/notify.ts
import 'server-only'
import { Resend } from 'resend'
import { escapeHtml } from '@/lib/rsm/lead-email'
import { resolveSignupRecipients, type RecipientInput } from './recipients'
import type { SignupAnswer } from './types'

interface SubjectVars { campaign: string; store: string; firstName: string }

export function buildNotificationSubject(template: string, vars: SubjectVars): string {
  if (!template.trim()) return `New signup — ${vars.campaign} (${vars.store})`

  return template
    .replace(/\{\{campaign\}\}/g, vars.campaign)
    .replace(/\{\{store\}\}/g, vars.store)
    .replace(/\{\{firstName\}\}/g, vars.firstName)
}

interface NotificationInput {
  campaignTitle: string
  storeName: string
  firstName: string
  lastName: string
  email: string
  phone?: string | undefined
  zip?: string | undefined
  answers: SignupAnswer[]
  sourceUrl?: string | undefined
}

/** Every interpolated value is escaped — a lead's name reaches a human inbox. */
export function buildNotificationHtml(input: NotificationInput): string {
  const rows: [string, string][] = [
    ['Name', `${input.firstName} ${input.lastName}`.trim()],
    ['Email', input.email],
  ]
  if (input.phone) rows.push(['Phone', input.phone])
  if (input.zip) rows.push(['ZIP', input.zip])

  const contact = rows
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#6b655c">${escapeHtml(k)}</td><td style="padding:4px 0"><strong>${escapeHtml(v)}</strong></td></tr>`)
    .join('')

  const answers = input.answers.length
    ? `<h3 style="margin:20px 0 6px;font-size:14px">Responses</h3><table style="border-collapse:collapse;font-size:14px">${input.answers
        .map((a) => `<tr><td style="padding:4px 12px 4px 0;color:#6b655c">${escapeHtml(a.label)}</td><td style="padding:4px 0"><strong>${escapeHtml(a.value)}</strong></td></tr>`)
        .join('')}</table>`
    : ''

  return `<div style="font-family:-apple-system,Segoe UI,sans-serif;color:#1E1B16">
<h2 style="margin:0 0 4px;font-size:18px">New signup — ${escapeHtml(input.campaignTitle)}</h2>
<p style="margin:0 0 16px;color:#6b655c;font-size:13px">${escapeHtml(input.storeName)}</p>
<table style="border-collapse:collapse;font-size:14px">${contact}</table>
${answers}
${input.sourceUrl ? `<p style="margin-top:20px;font-size:12px;color:#a39c92">Submitted from ${escapeHtml(input.sourceUrl)}</p>` : ''}
</div>`
}

interface SendInput extends NotificationInput {
  leadId: string
  campaignSlug: string
  storeslug: string
  subjectTemplate: string
  liveSendEnabled: boolean
  recipients: RecipientInput
}

/** Resend tag values accept only ASCII letters, numbers, underscores and dashes. */
function sanitizeTag(value: string): string {
  return value.replace(/[^A-Za-z0-9_-]/g, '-').slice(0, 60)
}

export async function sendSignupNotification(
  input: SendInput,
): Promise<{ status: 'sent' | 'failed' | 'held'; emailId?: string }> {
  const { to, cc } = resolveSignupRecipients(input.recipients)

  // Held-back safety valve: the pipeline runs end to end and logs the exact
  // recipients a live send would use, so routing is verifiable before a single
  // real email leaves. Mirrors notify-rsm-of-lead.ts.
  if (!input.liveSendEnabled) {
    console.info(
      `[signup] HELD — would notify To: ${to.join(', ')} Cc: ${cc.join(', ') || '(none)'} for lead ${input.leadId}`,
    )
    return { status: 'held' }
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[signup] RESEND_API_KEY missing — notification skipped')
    return { status: 'failed' }
  }

  try {
    const resend = new Resend(apiKey)
    const { data, error } = await resend.emails.send(
      {
        from: process.env.RESEND_FROM_EMAIL ?? 'noreply@kawaius.com',
        to,
        cc: cc.length ? cc : undefined,
        replyTo: input.email,
        subject: buildNotificationSubject(input.subjectTemplate, {
          campaign: input.campaignTitle,
          store: input.storeName,
          firstName: input.firstName,
        }),
        html: buildNotificationHtml(input),
        tags: [
          { name: 'campaign', value: sanitizeTag(input.campaignSlug) },
          { name: 'store', value: sanitizeTag(input.storeslug) },
        ],
      },
      // Expires after 24h; pattern is <event-type>/<entity-id>. A double-fired
      // submit cannot notify twice.
      { idempotencyKey: `signup-lead/${input.leadId}` },
    )

    if (error) {
      console.error('[signup] Resend notification failed:', error.message)
      return { status: 'failed' }
    }

    return { status: 'sent', emailId: data?.id }
  } catch (error) {
    console.error('[signup] Resend notification threw:', error)
    return { status: 'failed' }
  }
}
```

- [ ] **Step 4: Run the test and watch it pass**

Run: `bun test src/lib/signup/notify.test.ts`
Expected: PASS, 6 tests.

- [ ] **Step 5: Wire into the action**

In `signup-campaign-submit.ts`, replace the Task 10/11/12 comment with the notification dispatch. Resolve the music school email only when its toggle is on, and never let a failure escape:

```typescript
const notify = campaign.notify
const school = notify?.includeSchoolEmail
  ? await getMusicSchoolByStorefrontSlug(input.storeslug)
  : null

const notification = await sendSignupNotification({
  leadId: String(lead.id),
  campaignSlug: campaign.slug,
  storeslug: input.storeslug,
  campaignTitle: campaign.title,
  storeName: storefront.storeName ?? input.storeslug,
  firstName: String(values.firstName ?? ''),
  lastName: String(values.lastName ?? ''),
  email: String(values.email ?? ''),
  phone: values.phone ? String(values.phone) : undefined,
  zip: values.zip ? String(values.zip) : undefined,
  answers: denormalizeAnswers(questions, values),
  sourceUrl: headerList.get('referer') ?? undefined,
  subjectTemplate: notify?.subjectTemplate ?? '',
  liveSendEnabled: Boolean(notify?.liveSendEnabled),
  recipients: {
    recipients: (notify?.recipients ?? []).map((r) => r.email).filter(Boolean) as string[],
    cc: (notify?.cc ?? []).map((r) => r.email).filter(Boolean) as string[],
    includeStorefrontEmail: Boolean(notify?.includeStorefrontEmail),
    includeSchoolEmail: Boolean(notify?.includeSchoolEmail),
    storefrontEmail: storefront.contactInfo?.email ?? null,
    schoolEmail: school?.contactInfo?.schoolEmail ?? null,
    rsmEmail: null, // autoRouteToRSM wiring is a follow-up; see note below
  },
}).catch((error) => {
  console.error('[signup] Notification dispatch failed:', error)
  return { status: 'failed' as const }
})

await payload.update({
  collection: 'signup-leads',
  id: lead.id,
  data: {
    resendStatus: notification.status,
    resendEmailId: 'emailId' in notification ? notification.emailId : undefined,
  },
  context: { skipHook: true },
})
```

Import `sendSignupNotification` and `getMusicSchoolByStorefrontSlug`.

> **Note on `autoRouteToRSM`:** the toggle exists in the collection and `resolveSignupRecipients` accepts an `rsmEmail`, but the ZIP→dealer→RSM lookup is not wired here. Reusing that pipeline means extracting the matching half of `notify-rsm-of-lead.ts` into a shared helper, which is its own task. Until then the toggle has no effect. Either schedule that extraction or hide the field with `admin.hidden: true` so it cannot be switched on with no result.

- [ ] **Step 6: Verify the held-back path first**

Leave `liveSendEnabled` OFF. Submit the form.
Expected: server log `[signup] HELD — would notify To: … Cc: …`; the lead's `resendStatus` is `held`; no email sent.

Turn `liveSendEnabled` ON with your own address as the recipient. Submit.
Expected: email arrives with contact core and answers; `resendStatus` is `sent` and `resendEmailId` is populated; replying goes to the lead's address.

- [ ] **Step 7: Commit**

```bash
git add src/lib/signup/notify.ts src/lib/signup/notify.test.ts src/lib/actions/signup-campaign-submit.ts
git commit -m "feat(signup): send lead notifications via Resend behind a held-back flag"
```

---

## Task 12: Shopify sync

**Files:**
- Create: `src/lib/signup/shopify.ts`
- Create: `src/lib/signup/shopify.test.ts`
- Modify: `src/lib/actions/signup-campaign-submit.ts`

**Interfaces:**
- Consumes: `upsertCustomer` and `CustomerInput` from `@/lib/shopify/customers`, `siteTags()`.
- Produces: `buildSignupTags(campaignTags, campaignSlug, storeslug, siteTags): string[]` and `syncSignupLeadToShopify(input): Promise<{ status, customerId? }>`.

- [ ] **Step 1: Write the failing test for tag construction**

```typescript
// src/lib/signup/shopify.test.ts
import { describe, expect, it } from 'bun:test'
import { buildSignupTags } from './shopify'

describe('buildSignupTags', () => {
  it('always adds the campaign and store tags', () => {
    const tags = buildSignupTags([], 'fall-open-house', 'houston', [])
    expect(tags).toContain('signup-fall-open-house')
    expect(tags).toContain('store-houston')
  })

  it('keeps campaign-authored tags', () => {
    const tags = buildSignupTags(['vip', 'open-house'], 'fall', 'houston', [])
    expect(tags).toContain('vip')
    expect(tags).toContain('open-house')
  })

  it('appends site tags for the Canadian domain', () => {
    expect(buildSignupTags([], 'fall', 'houston', ['canada'])).toContain('canada')
  })

  it('deduplicates and drops blanks', () => {
    const tags = buildSignupTags(['vip', 'vip', '', '  '], 'fall', 'houston', [])
    expect(tags.filter((t) => t === 'vip')).toHaveLength(1)
    expect(tags).not.toContain('')
  })

  it('trims whitespace from authored tags', () => {
    expect(buildSignupTags(['  vip  '], 'fall', 'houston', [])).toContain('vip')
  })
})
```

- [ ] **Step 2: Run the test and watch it fail**

Run: `bun test src/lib/signup/shopify.test.ts`
Expected: FAIL — cannot resolve `./shopify`.

- [ ] **Step 3: Implement**

```typescript
// src/lib/signup/shopify.ts
import 'server-only'
import { upsertCustomer } from '@/lib/shopify/customers'

/**
 * Tags for a signup lead's Shopify customer record.
 *
 * `signup-{slug}` and `store-{storeslug}` are always present so any campaign's
 * leads are segmentable in Shopify without the marketer remembering to add
 * them by hand.
 */
export function buildSignupTags(
  campaignTags: string[],
  campaignSlug: string,
  storeslug: string,
  siteTags: string[],
): string[] {
  const all = [
    ...campaignTags,
    `signup-${campaignSlug}`,
    `store-${storeslug}`,
    ...siteTags,
  ]

  const seen = new Set<string>()
  const out: string[] = []

  for (const tag of all) {
    const trimmed = tag?.trim()
    if (!trimmed || seen.has(trimmed)) continue
    seen.add(trimmed)
    out.push(trimmed)
  }

  return out
}

function isShopifyConfigured(): boolean {
  return Boolean(
    process.env.SHOPIFY_APP_API_KEY &&
      process.env.SHOPIFY_APP_CLIENT_SECRET &&
      process.env.SHOPIFY_STORE_DOMAIN,
  )
}

interface SyncInput {
  email: string
  firstName: string
  lastName: string
  phone?: string | undefined
  tags: string[]
  acceptsMarketing: boolean
}

/**
 * Mirror a lead into Shopify. Never throws — a Shopify outage must not cost
 * the visitor their submission, which is already safely on disk.
 */
export async function syncSignupLeadToShopify(
  input: SyncInput,
): Promise<{ status: 'synced' | 'failed' | 'skipped'; customerId?: string }> {
  if (!isShopifyConfigured()) {
    console.warn('[signup] Shopify not configured — sync skipped')
    return { status: 'skipped' }
  }

  try {
    const customer = await upsertCustomer({
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      tags: input.tags,
      ...(input.acceptsMarketing
        ? { emailMarketingConsent: { marketingState: 'SUBSCRIBED' as const } }
        : {}),
    })

    return { status: 'synced', customerId: customer?.id }
  } catch (error) {
    console.error('[signup] Shopify sync failed:', error)
    return { status: 'failed' }
  }
}
```

- [ ] **Step 4: Run the test and watch it pass**

Run: `bun test src/lib/signup/shopify.test.ts`
Expected: PASS, 5 tests.

- [ ] **Step 5: Wire into the action**

After the notification block in `signup-campaign-submit.ts`:

```typescript
const shopifyResult = campaign.shopify?.enableSync
  ? await syncSignupLeadToShopify({
      email: String(values.email ?? ''),
      firstName: String(values.firstName ?? ''),
      lastName: String(values.lastName ?? ''),
      phone: values.phone ? String(values.phone) : undefined,
      tags: buildSignupTags(
        (campaign.shopify?.tags ?? []).map((t) => t.tag).filter(Boolean) as string[],
        campaign.slug,
        input.storeslug,
        await siteTags(),
      ),
      acceptsMarketing: Boolean(campaign.shopify?.acceptsMarketing),
    })
  : { status: 'skipped' as const }

await payload.update({
  collection: 'signup-leads',
  id: lead.id,
  data: {
    shopifyStatus: shopifyResult.status,
    shopifyCustomerId: 'customerId' in shopifyResult ? shopifyResult.customerId : undefined,
  },
  context: { skipHook: true },
})
```

Import `buildSignupTags`, `syncSignupLeadToShopify`, and `siteTags` from `@/lib/shopify/site-tags`.

- [ ] **Step 6: Verify**

Submit with a fresh email address.
Expected: `shopifyStatus` is `synced`; in Shopify Admin the customer carries `signup-fall-open-house` and `store-houston`.

Submit again with the **same** email but a different campaign.
Expected: one customer, tags from both campaigns merged — `upsertCustomer` merges rather than overwriting.

Temporarily unset `SHOPIFY_STORE_DOMAIN` and submit.
Expected: submission still succeeds, `shopifyStatus` is `skipped`, lead still saved.

- [ ] **Step 7: Commit**

```bash
git add src/lib/signup/shopify.ts src/lib/signup/shopify.test.ts src/lib/actions/signup-campaign-submit.ts
git commit -m "feat(signup): sync leads to Shopify with campaign and store tags"
```

---

## Task 13: Mobile bar and accessibility pass

**Files:**
- Create: `src/components/signup/SignupMobileBar.tsx`
- Modify: `src/components/signup/SignupRail.tsx`, the route

**Interfaces:**
- Consumes: the `#signup-form` anchor already on `SignupRail`'s `<aside>`.
- Produces: `<SignupMobileBar label={...} />`.

Mobile has no rail — the bottom bar is the entire mobile conversion path, so it gets its own task rather than being an afterthought.

- [ ] **Step 1: Write the bar**

```tsx
// src/components/signup/SignupMobileBar.tsx
'use client'

import { useEffect, useState } from 'react'

/**
 * Sticky bottom CTA, mobile only. Hidden once the form is on screen so it
 * never covers the fields it points at.
 */
export function SignupMobileBar({ label }: { label: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const target = document.getElementById('signup-form')
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry?.isIntersecting),
      { rootMargin: '-80px 0px 0px 0px' },
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-kawai-neutral bg-white/95 p-3 backdrop-blur transition-transform lg:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <a
        href="#signup-form"
        className="block rounded bg-kawai-red px-4 py-3 text-center font-bold text-white"
      >
        {label}
      </a>
    </div>
  )
}
```

- [ ] **Step 2: Mount it**

In the route, after `</main>`:

```tsx
<SignupMobileBar label={campaign.form?.submitLabel ?? 'Save My Spot'} />
```

Add `pb-20 lg:pb-0` to the `<main>` so the bar never covers the last block.

- [ ] **Step 3: Run the accessibility checks**

At 375px width:
- The bar appears on scroll and hides when the form is visible.
- Tapping it moves focus and scroll to the form.
- Every control announces its label with VoiceOver.
- Tab order is visual order; focus rings are visible throughout.
- The overflow modal traps focus and returns it to the trigger on close.

Heading structure:

Run: `curl -s http://localhost:3000/store/houston/signup | grep -o "<h[1-6]" | sort | uniq -c`
Expected: exactly one `<h1>`, no level skipped.

Contrast, checked visually — automated tools cannot measure text over an image:
- Hero text over the campaign background at every scrim setting.
- No `kawai-red` used for text on a dark background anywhere (`kawai-red-400` only).

Run: `bun run lint`
Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add src/components/signup/SignupMobileBar.tsx "src/app/(frontend)/store/[storeslug]/signup"
git commit -m "feat(signup): add mobile sticky CTA and complete the accessibility pass"
```

---

## Task 14: Remove the superseded prior attempt

**Files:**
- Delete: `src/collections/SitePages.ts.disabled`, `src/collections/Sites.ts.disabled`
- Create: `scripts/drop-landing-pages.ts`

The orphaned `landing-pages` collection is an abandoned earlier run at this exact feature — 1 junk document, `slug: "slugger"`, no code behind it. Leaving it means three parallel concepts for one job.

- [ ] **Step 1: Confirm it is still dead**

```bash
grep -rn "landing-pages\|LandingPages" src/ || echo "NO CODE REFERENCES — safe to drop"
```
Expected: no references. **If anything is found, stop and reassess** — do not drop a collection that has a consumer.

- [ ] **Step 2: Inspect before deleting**

```typescript
// scripts/drop-landing-pages.ts
import mongoose from 'mongoose'

const DRY_RUN = !process.argv.includes('--commit')

async function main() {
  await mongoose.connect(process.env.DATABASE_URI!, { family: 4 })
  const db = mongoose.connection.db!

  const names = (await db.listCollections().toArray()).map((c) => c.name)
  if (!names.includes('landing-pages')) {
    console.log('landing-pages does not exist — nothing to do')
    return mongoose.disconnect()
  }

  const docs = await db.collection('landing-pages').find({}).toArray()
  console.log(`landing-pages holds ${docs.length} document(s):`)
  for (const doc of docs) console.log(`  ${doc._id}  slug=${doc.slug}  title=${doc.title}`)

  if (DRY_RUN) {
    console.log('\nDRY RUN — re-run with --commit to drop.')
    return mongoose.disconnect()
  }

  await db.collection('landing-pages').drop()
  console.log('Dropped landing-pages.')
  await mongoose.disconnect()
}

main()
```

Run: `bun run backup:db`
Then: `node --env-file=.env.local scripts/drop-landing-pages.ts`
Expected: lists exactly the one junk document. **If it lists anything that looks like real content, stop.**

- [ ] **Step 3: Drop it**

Run: `node --env-file=.env.local scripts/drop-landing-pages.ts --commit`
Expected: `Dropped landing-pages.`

- [ ] **Step 4: Delete the disabled files**

```bash
rm src/collections/SitePages.ts.disabled src/collections/Sites.ts.disabled
```

- [ ] **Step 5: Verify nothing broke**

Run: `bun run build && bun test src/lib/signup/`
Expected: build succeeds; 49 tests pass.

- [ ] **Step 6: Commit**

```bash
git add -A src/collections scripts/drop-landing-pages.ts
git commit -m "chore(signup): remove superseded landing-pages collection and disabled configs"
```

---

## Self-Review

**Spec coverage.** Every section maps to a task: §3 URL model → 4, 8. §4.1 campaigns → 5. §4.2 leads → 6. §5 blocks → 7. §6.1 pipeline → 10. §6.2 Resend → 11. §6.3 recipients → 3, 11. §6.4 held-back → 3, 11. §6.5 Shopify → 12. §6.6 spam → 9, 10. §7.1 route → 8. §7.2 ended state → 4, 8. §7.3 layout/lockup → 8, 9. §7.4 components → 8, 9, 13. §7.5 accessibility → 9, 13. §8 revalidation → 5. §9 error handling → 10, 11, 12. §10 testing → 1–4, 11, 12. §11 build order → task order. §12 env → no new vars.

**One deliberate gap.** `notify.autoRouteToRSM` is configurable but inert — the ZIP→dealer→RSM matching in `notify-rsm-of-lead.ts` is entangled with that action and extracting it is its own task. Flagged inline in Task 11 Step 5 with two options (schedule the extraction, or hide the field). This is called out rather than silently shipped.

**Type consistency.** `SignupQuestion` / `SignupCoreConfig` / `SignupAnswer` / `SignupRecipients` are defined once in Task 1 and imported everywhere after. `submitSignupCampaign`'s return type is fixed in Task 10 and matches what Task 9's `SignupForm` consumes. `RAIL_QUESTION_LIMIT` is exported from `SignupForm` and imported by `SignupRail`. Task 5's `form.questions` field names are verified against `SignupQuestion` in Task 5 Step 4 — the one place a Payload/TypeScript drift could silently break Tasks 9 and 10.

**Placeholder scan.** No TBD, no "add error handling", no "similar to Task N". Every code step carries runnable code; every verification step names a command and its expected output.
