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
