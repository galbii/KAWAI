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

  it('coerces string checkbox values with allowlist', () => {
    const schema = buildSignupSchema(CORE, [
      { type: 'checkbox', label: 'Send me updates', name: 'updates' },
    ])
    expect(schema.parse({ ...VALID_CORE, updates: 'false' }).updates).toBe(false)
    expect(schema.parse({ ...VALID_CORE, updates: 'true' }).updates).toBe(true)
    expect(schema.parse({ ...VALID_CORE, updates: 'on' }).updates).toBe(true)
    expect(schema.parse({ ...VALID_CORE, updates: 'anything else' }).updates).toBe(false)
  })

  it('enforces required checkbox and rejects string "false"', () => {
    const schema = buildSignupSchema(CORE, [
      { type: 'checkbox', label: 'I agree to terms', name: 'agree', required: true },
    ])
    expect(schema.safeParse({ ...VALID_CORE, agree: true }).success).toBe(true)
    expect(schema.safeParse({ ...VALID_CORE, agree: 'true' }).success).toBe(true)
    expect(schema.safeParse({ ...VALID_CORE, agree: 'on' }).success).toBe(true)
    expect(schema.safeParse({ ...VALID_CORE, agree: false }).success).toBe(false)
    expect(schema.safeParse({ ...VALID_CORE, agree: 'false' }).success).toBe(false)
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
