'use server'

import { z } from 'zod'
import { upsertCustomer } from '@/lib/shopify/customers'
import { siteTags } from '@/lib/shopify/site-tags'

const tradeInSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  pianoBrand: z.string().min(1, 'Please select a piano brand'),
  pianoType: z.enum(['upright', 'baby-grand', 'grand', 'digital', 'other']),
  pianoYear: z.string().optional(),
  pianoCondition: z.enum(['excellent', 'good', 'fair', 'needs-work']),
  pianoModel: z.string().optional(),
  targetGrand: z.string().optional(),
  storefrontSlug: z.string().min(1),
})

type TradeInData = z.infer<typeof tradeInSchema>

interface TradeInResult {
  success: boolean
  message: string
  errors?: Record<string, string>
}

export async function submitTradeInInquiry(
  prevState: TradeInResult | null,
  formData: FormData,
): Promise<TradeInResult> {
  try {
    const rawData: TradeInData = {
      firstName: formData.get('firstName')?.toString() ?? '',
      lastName: formData.get('lastName')?.toString() ?? '',
      email: formData.get('email')?.toString() ?? '',
      phone: formData.get('phone')?.toString() ?? undefined,
      pianoBrand: formData.get('pianoBrand')?.toString() ?? '',
      pianoType: (formData.get('pianoType')?.toString() ?? 'upright') as TradeInData['pianoType'],
      pianoYear: formData.get('pianoYear')?.toString() ?? undefined,
      pianoCondition: (formData.get('pianoCondition')?.toString() ?? 'good') as TradeInData['pianoCondition'],
      pianoModel: formData.get('pianoModel')?.toString() ?? undefined,
      targetGrand: formData.get('targetGrand')?.toString() ?? undefined,
      storefrontSlug: formData.get('storefrontSlug')?.toString() ?? '',
    }

    const validation = tradeInSchema.safeParse(rawData)
    if (!validation.success) {
      const errors: Record<string, string> = {}
      validation.error.issues.forEach((issue) => {
        errors[issue.path.join('.')] = issue.message
      })
      return { success: false, message: 'Please check the form for errors', errors }
    }

    const data = validation.data

    const tags = [
      'trade-in-inquiry',
      'grand-spring-sale',
      data.storefrontSlug,
      `piano-brand:${data.pianoBrand.toLowerCase().replace(/\s+/g, '-')}`,
      `piano-type:${data.pianoType}`,
      `piano-condition:${data.pianoCondition}`,
      ...(data.targetGrand ? [`interested-in:${data.targetGrand}`] : []),
      // 'canada' when submitted on ca.kawaius.com (same US-store CRM)
      ...(await siteTags()),
    ]

    const noteLines = [
      `Trade-in inquiry — ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
      `Piano: ${data.pianoBrand}${data.pianoModel ? ` ${data.pianoModel}` : ''} (${data.pianoType})`,
      data.pianoYear ? `Year: ${data.pianoYear}` : null,
      `Condition: ${data.pianoCondition}`,
      data.targetGrand ? `Interested in: ${data.targetGrand}` : null,
      `Location: ${data.storefrontSlug}`,
    ]
      .filter(Boolean)
      .join('\n')

    await upsertCustomer({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      ...(data.phone ? { phone: data.phone } : {}),
      tags,
      note: noteLines,
      emailMarketingConsent: {
        marketingState: 'SUBSCRIBED',
        marketingOptInLevel: 'SINGLE_OPT_IN',
      },
    })

    return {
      success: true,
      message: "We've received your trade-in request. Expect to hear from us within one business day.",
    }
  } catch (error) {
    console.error('[Trade-In Inquiry] Error:', error)
    return {
      success: false,
      message: 'Something went wrong. Please try again or call us directly.',
    }
  }
}
