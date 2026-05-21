import type { FieldHook } from 'payload'

/**
 * Replaces Payload's default `" - Copy"` suffix on duplication, which violates
 * URL-safe slug regexes (spaces and uppercase). Produces `{slug}-copy-{base36 ts}`
 * so repeated duplicates of the same source don't collide on the unique index.
 */
export const slugBeforeDuplicate: FieldHook = ({ value }) => {
  if (typeof value !== 'string' || !value) return value
  return `${value}-copy-${Date.now().toString(36)}`
}
