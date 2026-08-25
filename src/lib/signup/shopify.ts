import 'server-only'
import { upsertCustomer } from '@/lib/shopify/customers'

function isShopifyConfigured(): boolean {
  return Boolean(
    process.env.SHOPIFY_APP_API_KEY &&
      process.env.SHOPIFY_APP_CLIENT_SECRET &&
      process.env.SHOPIFY_STORE_DOMAIN,
  )
}

interface SyncInput {
  email: string
  firstName: string
  lastName: string
  phone?: string | undefined
  tags: string[]
  acceptsMarketing: boolean
}

/**
 * Mirror a lead into Shopify. Never throws — a Shopify outage must not cost the
 * visitor their submission, which is already safely on disk.
 */
export async function syncSignupLeadToShopify(
  input: SyncInput,
): Promise<{ status: 'synced' | 'failed' | 'skipped'; customerId?: string }> {
  if (!isShopifyConfigured()) {
    console.warn('[signup] Shopify not configured — sync skipped')
    return { status: 'skipped' }
  }

  try {
    const customer = await upsertCustomer({
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      ...(input.phone ? { phone: input.phone } : {}),
      tags: input.tags,
      ...(input.acceptsMarketing
        ? { emailMarketingConsent: { marketingState: 'SUBSCRIBED' as const } }
        : {}),
    })

    return { status: 'synced', ...(customer?.id ? { customerId: String(customer.id) } : {}) }
  } catch (error) {
    console.error('[signup] Shopify sync failed:', error)
    return { status: 'failed' }
  }
}
