'use server'

import { z } from 'zod'

const shigeruContactSchema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  pianoInterest: z.enum(['general', 'sk-2', 'sk-3', 'sk-5', 'sk-6', 'sk-7', 'sk-ex']),
  message: z.string().min(10, 'Please include a brief message (10 characters minimum)'),
})

export type ShigeruContactInput = z.infer<typeof shigeruContactSchema>

export interface ShigeruContactResult {
  success: boolean
  message: string
  errors?: Partial<Record<keyof ShigeruContactInput, string>>
}

const PIANO_LABELS: Record<ShigeruContactInput['pianoInterest'], string> = {
  general: 'General Inquiry',
  'sk-2': 'SK-2 Classic Salon Grand',
  'sk-3': 'SK-3 Conservatory Grand',
  'sk-5': 'SK-5 Chamber Grand',
  'sk-6': 'SK-6 Orchestra Grand',
  'sk-7': 'SK-7 Semi-Concert Grand',
  'sk-ex': 'SK-EX Concert Grand',
}

export async function submitShigeruContact(
  formData: ShigeruContactInput,
): Promise<ShigeruContactResult> {
  const parsed = shigeruContactSchema.safeParse(formData)

  if (!parsed.success) {
    const errors: ShigeruContactResult['errors'] = {}
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof ShigeruContactInput | undefined
      if (field) errors[field] = issue.message
    }
    return { success: false, message: 'Please correct the errors below.', errors }
  }

  const { name, email, phone, pianoInterest, message } = parsed.data
  const pianoLabel = PIANO_LABELS[pianoInterest]
  const [firstName = name, ...rest] = name.trim().split(' ')
  const lastName = rest.join(' ') || '(not provided)'

  // Log the inquiry — available in Vercel/Render logs immediately
  console.log('[Shigeru Contact] New inquiry:', {
    name,
    email,
    phone: phone ?? '—',
    interest: pianoLabel,
    message,
    timestamp: new Date().toISOString(),
  })

  // Capture lead in Shopify CRM (same pattern as existing contact forms)
  try {
    const { upsertCustomer } = await import('@/lib/shopify/customers')
    await upsertCustomer({
      firstName,
      lastName,
      email,
      ...(phone ? { phone } : {}),
      tags: ['shigeru-kawai-inquiry', `interest:${pianoInterest}`],
      note: `Piano interest: ${pianoLabel}\n\nMessage: ${message}`,
    })
  } catch (err) {
    // Non-fatal — lead is still logged above; don't surface Shopify errors to user
    console.error('[Shigeru Contact] Shopify upsert failed:', err)
  }

  // TODO: Send notification email to contact@kawaius.com via Resend
  // if (process.env.RESEND_API_KEY) {
  //   await fetch('https://api.resend.com/emails', {
  //     method: 'POST',
  //     headers: {
  //       Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       from: 'inquiries@kawaius.com',
  //       to: 'contact@kawaius.com',
  //       subject: `Shigeru Kawai Inquiry — ${pianoLabel}`,
  //       text: `From: ${name} <${email}>\nPhone: ${phone ?? '—'}\nInterest: ${pianoLabel}\n\n${message}`,
  //     }),
  //   })
  // }

  return {
    success: true,
    message: 'Thank you. A Shigeru Kawai specialist will be in touch shortly.',
  }
}
