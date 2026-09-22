import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

/**
 * Bust the Next.js Data Cache for /software after an admin edit.
 *
 * The page renders one cached list of every model, so a single `software-releases`
 * tag covers it. Fire-and-forget by design — a slow or down revalidate endpoint
 * must never block the editor's save.
 */
function revalidate(): void {
  fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: process.env.REVALIDATION_SECRET,
      tag: 'software-releases',
    }),
  }).catch((err) => console.error('[software-releases] Revalidation failed:', err))
}

export const revalidateSoftwareRelease: CollectionAfterChangeHook = ({ doc, context }) => {
  if (context?.skipHook) return doc
  revalidate()
  return doc
}

export const revalidateSoftwareReleaseAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  revalidate()
  return doc
}
