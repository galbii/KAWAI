import type { Metadata } from 'next'
import { ZipTestTool } from './ZipTestTool'

/**
 * INTERNAL TEST PAGE — RSM lead-routing dry run.
 *
 * Dry run: enter a lead + ZIP / postal code and see exactly where the
 * signup-offer RSM notification WOULD be sent (nearest dealer's rsmEmail or the
 * fallback inbox), with the candidate dealers on the find-a-dealer map.
 *
 * Test send: additionally deliver the real production email — plus the 5
 * closest dealers — to operator-supplied test inboxes. The matched RSM is never
 * emailed, and neither HubSpot nor Shopify is touched.
 *
 * Not linked from anywhere, noindexed, and the backing action is password-
 * gated (verified server-side on every call). Delete after testing.
 */

export const metadata: Metadata = {
  title: 'ZIP Routing Test — Internal',
  robots: { index: false, follow: false },
}

export default function ZipCodeTestPage() {
  return (
    <main className="min-h-screen bg-kawai-pearl px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-kawai-red">
          Internal Test Tool
        </p>
        <h1 className="mb-1 text-2xl font-bold text-kawai-black">RSM Lead Routing &amp; Email Test</h1>
        <p className="mb-8 text-sm text-kawai-charcoal/70">
          Enter a lead and a ZIP or Canadian postal code to see which RSM the signup-offer
          notification would go to. <strong>Dry run</strong> sends nothing.{' '}
          <strong>Send test email</strong> delivers the real RSM email — lead details plus the 5
          closest dealers — to your own test inboxes only. The matched RSM is never emailed, and no
          lead reaches HubSpot or Shopify.
        </p>
        <ZipTestTool />
      </div>
    </main>
  )
}
