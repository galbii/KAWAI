import 'server-only'
import { getSite } from '@/lib/site-context'

/**
 * Site-of-origin tags for a Shopify customer upsert.
 *
 * Every lead-capture Server Action writes to the SAME Shopify store — the US
 * one (`SHOPIFY_STORE_DOMAIN`). The CA store (`SHOPIFY_CA_STORE_DOMAIN`) is used
 * only for CAD pricing and CA checkout, never for CRM writes. So a visitor who
 * submits a form on ca.kawaius.com lands in the US customer list indistinguishable
 * from a US lead unless we tag them. This adds that tag.
 *
 * Relies on the `x-site` header set in {@link file://./../../middleware.ts} —
 * Server Action POSTs go to the page's own URL (not `/api/*`), so they match the
 * middleware matcher and carry the header. Note that on localhost the host is
 * never `ca.`, so this always resolves to `[]` in dev.
 *
 * Tag is lowercase `canada` to match the tags already written by the footer
 * newsletter signup.
 *
 * @returns `['canada']` on the CA domain, `[]` on the US domain.
 *
 * @example
 * ```typescript
 * const tags = ['footer-newsletter', ...(await siteTags())]
 * await upsertCustomer({ email, tags })
 * ```
 */
export async function siteTags(): Promise<string[]> {
  return (await getSite()) === 'cad' ? ['canada'] : []
}
