/**
 * Shared types for the /software firmware directory.
 *
 * Mirrors the `software-releases` Payload collection, narrowed to the fields the
 * frontend actually renders. Kept separate from `@/payload-types` so the page and
 * its pure helpers can be unit-tested without pulling in the generated CMS types.
 */

export type SoftwareCategory = 'digital' | 'hybrid' | 'anytime'

/**
 * One downloadable artifact. Most instruments have exactly one ("System"), but the
 * CA901/CA701, CA99/CA79, NV10S and NV5S ship a separately-versioned LCD touch
 * panel image alongside the system firmware, so this is always a list.
 */
export interface SoftwareDownload {
  label: string
  version: string
  /** Absolute URL on kawai-global.com — Kawai Japan hosts the binaries, we link them. */
  fileUrl: string
  fileBytes?: number | null
  instructionsUrl?: string | null
}

export interface SoftwareModel {
  slug: string
  model: string
  /** Searchable names, including each half of a combined model like CA901/CA701. */
  aliases: string[]
  category: SoftwareCategory
  series: string
  downloads: SoftwareDownload[]
  /** Optional caveat or prerequisite shown under the model name. */
  notes?: string
}

export interface SeriesGroup {
  series: string
  count: number
  models: SoftwareModel[]
}

export interface CategoryGroup {
  category: SoftwareCategory
  label: string
  count: number
  series: SeriesGroup[]
}
