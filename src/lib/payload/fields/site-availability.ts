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
