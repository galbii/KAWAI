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
