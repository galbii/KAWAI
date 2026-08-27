'use server'

import { upsertCustomer, addCustomerLocation } from '@/lib/shopify/customers'
import { siteTags } from '@/lib/shopify/site-tags'
import { shopifyAdminClient } from '@/lib/shopify/admin-client'

export interface BookingLeadInput {
  firstName: string
  lastName: string
  email: string
  phone?: string | undefined
  storeslug?: string | null | undefined
  customTags?: string[]
  note?: string
}

const CUSTOMER_EMAIL_MARKETING_CONSENT_UPDATE = `
  mutation customerEmailMarketingConsentUpdate($input: CustomerEmailMarketingConsentUpdateInput!) {
    customerEmailMarketingConsentUpdate(input: $input) {
      customer {
        id
        emailMarketingConsent {
          marketingState
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`

async function setMarketingConsent(customerId: string): Promise<void> {
  try {
    await shopifyAdminClient.mutate<{
      customerEmailMarketingConsentUpdate: {
        userErrors: Array<{ field: string[]; message: string }>
      }
    }>(CUSTOMER_EMAIL_MARKETING_CONSENT_UPDATE, {
      input: {
        customerId,
        emailMarketingConsent: {
          marketingState: 'SUBSCRIBED',
          marketingOptInLevel: 'SINGLE_OPT_IN',
          consentUpdatedAt: new Date().toISOString(),
        },
      },
    })
  } catch (error) {
    console.error('[BookingLead] Failed to set marketing consent:', error)
  }
}

export async function captureBookingLead(input: BookingLeadInput): Promise<void> {
  const tags: string[] = [...(input.customTags ?? ['baby-grand'])]
  if (input.storeslug) tags.push(input.storeslug)

  // 'canada' when submitted on ca.kawaius.com (same US-store CRM)
  tags.push(...(await siteTags()))

  try {
    const base = {
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      tags,
      note: input.note ?? 'Booking appointment inquiry',
    }

    let customer
    try {
      customer = await upsertCustomer({
        ...base,
        ...(input.phone ? { phone: input.phone } : {}),
      })
    } catch (error) {
      // Shopify validates phone numbers and rejects the whole upsert over a bad
      // one. A typo'd phone must not cost us the lead — retry without it.
      const message = error instanceof Error ? error.message : ''
      if (!input.phone || !/phone/i.test(message)) throw error
      console.warn('[BookingLead] Shopify rejected the phone — retrying without it')
      customer = await upsertCustomer(base)
    }

    const promises: Promise<unknown>[] = [setMarketingConsent(customer.id)]

    if (input.storeslug) {
      promises.push(addCustomerLocation(customer.id, input.storeslug))
    }

    await Promise.allSettled(promises)
  } catch (error) {
    console.error('[BookingLead] Failed to capture lead:', error)
    // Fire-and-forget — never block the user flow
  }
}
