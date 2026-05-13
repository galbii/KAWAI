import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// Required env vars:
//   RESEND_API_KEY        — Resend API key
//   RESEND_FROM_EMAIL     — Verified Resend sender, e.g. cnoonan@kawaius.com
//   WARRANTY_NOTIFY_EMAIL — Inbox for internal alerts (defaults to RESEND_FROM_EMAIL)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  console.log('[warranty-notify] POST received')

  // Require shared secret to prevent inbox spam
  const auth = request.headers.get('authorization') ?? ''
  const secret = process.env.REVALIDATION_SECRET
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { formId } = body as { formId?: string }

    console.log('[warranty-notify] formId:', formId)

    const fromAddress = process.env.RESEND_FROM_EMAIL
    if (!fromAddress) {
      console.error('[warranty-notify] RESEND_FROM_EMAIL is not set')
      return NextResponse.json({ error: 'Sender address not configured' }, { status: 500 })
    }

    const notifyAddress = process.env.WARRANTY_NOTIFY_EMAIL ?? fromAddress

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [notifyAddress],
      subject: 'New KAWAI Piano Warranty Registration',
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family:'Helvetica Neue',Arial,sans-serif;background:#FAF8F5;padding:40px 20px;color:#1E1B16">
            <div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #DBDBDB;border-radius:8px;overflow:hidden">
              <div style="background:#1E1B16;padding:24px 32px">
                <p style="margin:0;color:#E11922;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase">Warranty Registration</p>
                <h1 style="margin:6px 0 0;color:#fff;font-size:20px;font-weight:700">New Registration Submitted</h1>
              </div>
              <div style="padding:28px 32px;font-size:14px;line-height:1.6">
                <p style="margin:0 0 12px">A customer has completed the piano warranty registration form.</p>
                <p style="margin:0;color:#6b7280;font-size:12px">Form ID: ${formId ?? 'unknown'}</p>
                <p style="margin:4px 0 0;color:#6b7280;font-size:12px">Submitted at: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })} CT</p>
                <p style="margin:20px 0 0">View the full submission in <a href="https://app.hubspot.com/forms/${formId}" style="color:#E11922">HubSpot</a>.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('[warranty-notify] Resend error:', error)
      return NextResponse.json({ error }, { status: 500 })
    }

    console.log('[warranty-notify] Email sent:', data?.id)
    return NextResponse.json({ success: true, emailId: data?.id })
  } catch (err) {
    console.error('[warranty-notify] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
