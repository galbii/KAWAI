/**
 * Per-dealer lead counter.
 *
 * Bumps `Dealers.leadCount` each time a visitor picks that dealer in the
 * post-signup picker, so sales can see which locations the site actually feeds.
 *
 * Two things this deliberately does NOT do:
 *   - Block or fail the notification. Counting is bookkeeping; a lead reaching
 *     a human always wins. Every path here swallows its errors.
 *   - Trigger dealer revalidation. `context.skipRevalidation` keeps a counter
 *     bump from busting the find-a-dealer caches on every single lead.
 *
 * Never call this from the test tool — it writes to production dealer records.
 */

import { getPayloadClient } from '@/lib/payload/queries'

/**
 * Atomically increment one dealer's lead count.
 *
 * Prefers a native `$inc` so two leads landing on the same dealer at the same
 * moment can't both read N and write N+1. Falls back to a read-then-write via
 * the Local API if the underlying model isn't reachable — a lost count under
 * exact concurrency beats not counting at all.
 */
export async function incrementDealerLeadCount(dealerId: string): Promise<void> {
  try {
    const payload = await getPayloadClient()

    const model = (
      payload.db as unknown as {
        collections?: Record<string, { updateOne?: (f: unknown, u: unknown) => Promise<unknown> }>
      }
    ).collections?.dealers

    if (typeof model?.updateOne === 'function') {
      await model.updateOne({ _id: dealerId }, { $inc: { leadCount: 1 } })
      return
    }

    const current = await payload.findByID({
      collection: 'dealers',
      id: dealerId,
      depth: 0,
      select: { leadCount: true },
    })

    await payload.update({
      collection: 'dealers',
      id: dealerId,
      data: { leadCount: (current?.leadCount ?? 0) + 1 },
      depth: 0,
      context: { skipRevalidation: true },
    })
  } catch (err) {
    console.error(`[lead-counter] Could not increment leadCount for ${dealerId}:`, err)
  }
}
