/**
 * Site Availability Field
 *
 * Reusable select that restricts a document to kawaius.com, ca.kawaius.com, or
 * both (default). Add it to any collection, then filter that collection's
 * frontend queries with `availableOnSite(site)` / `isAvailableOnSite(doc, site)`
 * from `@/lib/site-availability`.
 */

import type { SelectField } from 'payload'
import { SITE_AVAILABILITY_FIELD, SITE_AVAILABILITY_OPTIONS } from '@/lib/site-availability'

/**
 * @example
 * ```typescript
 * fields: [
 *   siteAvailabilityField(),
 *   // or with a collection-specific description
 *   siteAvailabilityField({ admin: { description: 'Where this page is published.' } }),
 * ]
 * ```
 */
export const siteAvailabilityField = (options?: Partial<Omit<SelectField, 'type' | 'options'>>): SelectField => {
  const { admin, ...restOptions } = options || {}

  return {
    name: SITE_AVAILABILITY_FIELD,
    label: 'Site Availability',
    type: 'select',
    options: SITE_AVAILABILITY_OPTIONS.map((o) => ({ ...o })),
    // Not `required`: documents saved before this field existed have no value,
    // and every helper in @/lib/site-availability treats a missing value as 'all'.
    defaultValue: 'all',
    index: true,
    ...restOptions,
    admin: {
      position: 'sidebar',
      description:
        'Which site serves this document. "US only" hides it everywhere on ca.kawaius.com; "Canada only" hides it everywhere on kawaius.com. Leave on "All sites" unless the item is region-exclusive.',
      ...admin,
    },
  } as SelectField
}

/**
 * The same select for a block or an array row (promo popups, rebate tables,
 * carousel items). Blocks have no sidebar, and an index on a nested path would
 * never be queried — renderers filter these in memory with `isAvailableOnSite`.
 *
 * @example
 * ```typescript
 * fields: [nestedSiteAvailabilityField(), ...]
 * ```
 */
export const nestedSiteAvailabilityField = (options?: Partial<Omit<SelectField, 'type' | 'options'>>): SelectField => {
  const { admin, ...restOptions } = options || {}

  return {
    name: SITE_AVAILABILITY_FIELD,
    label: 'Site Availability',
    type: 'select',
    options: SITE_AVAILABILITY_OPTIONS.map((o) => ({ ...o })),
    defaultValue: 'all',
    ...restOptions,
    admin: {
      description:
        'Which site shows this. Set US-market offers to "US only" and Canadian offers to "Canada only", or the other site advertises an offer its visitors cannot redeem.',
      ...admin,
    },
  } as SelectField
}
