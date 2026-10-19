/**
 * Shigeru Kawai products live on the /shigeru microsite, not the main catalog.
 *
 * The Payload product docs (type `shigeru`) stay active — the microsite reads
 * their images, finishes and specs — but they are hidden from main-site
 * surfaces via the `visibility.hideFrom*` flags, and /products/[slug] sends
 * them here instead.
 */

import { SHIGERU_MODELS } from '@/app/(shigeru-website)/shigeru/_data/models'

export const SHIGERU_MODELS_PATH = '/shigeru/models'

export function isShigeruProduct(type: string | null | undefined): boolean {
  return (type ?? '').trim().toLowerCase() === 'shigeru'
}

/**
 * Microsite page for a product's `model` value. Payload stores numbered models
 * without a dash (`SK2`) and SK-EX with one; the microsite slugs are `sk-2` …
 * `sk-ex`. Unknown models fall back to the range page rather than a 404.
 */
export function shigeruModelPath(model: string | null | undefined): string {
  const slug = (model ?? '').trim().toLowerCase().replace(/^sk-?/, 'sk-')
  return SHIGERU_MODELS.some((m) => m.slug === slug)
    ? `${SHIGERU_MODELS_PATH}/${slug}`
    : SHIGERU_MODELS_PATH
}
