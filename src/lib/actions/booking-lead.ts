'use server'

import { upsertCustomer, addCustomerLocation } from '@/lib/shopify/customers'
import { shopifyAdminClient } from '@/lib/shopify/admin-client'

export interface BookingLeadInput {
  firstName: string
  lastName: string
  email: string
  phone?: string | undefined
  storeslug?: string | null | undefined
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
  const tags: string[] = ['baby-grand']
  if (input.storeslug) tags.push(input.storeslug)

  try {
    const customer = await upsertCustomer({
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      ...(input.phone ? { phone: input.phone } : {}),
      tags,
      note: 'Grand Spring Sale — booking appointment inquiry',
    })

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
