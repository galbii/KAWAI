import type { Metadata } from 'next'
import { ZipTestTool } from './ZipTestTool'

/**
 * INTERNAL TEST PAGE — RSM lead routing + post-submit dealer picker.
 *
 * Dry run: enter a lead + ZIP / postal code and see exactly where the
 * signup-offer RSM notification WOULD be sent (nearest dealer's rsmEmail or the
 * fallback inbox), with the candidate dealers on the find-a-dealer map.
 *
 * Simulate lead submission: walks the whole visitor flow — resolve the 5
 * nearest dealers, open the dealer picker a visitor sees after submitting, then
 * deliver BOTH production emails (the RSM notification and, if a dealer was
 * picked, the dealer's own note) to operator-supplied test inboxes. No real RSM
 * or dealer is addressed, copied or BCC'd; the envelopes production would use
 * are reported on the page. Neither HubSpot nor Shopify is touched.
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
        <h1 className="mb-1 text-2xl font-bold text-kawai-black">
          RSM Lead Routing &amp; Dealer Picker Test
        </h1>
        <p className="mb-8 text-sm text-kawai-charcoal/70">
          Enter a lead and a ZIP or Canadian postal code to see which RSM the signup-offer
          notification would go to. <strong>Dry run</strong> sends nothing.{' '}
          <strong>Simulate lead submission</strong> runs the full visitor flow: the dealer picker
          opens with the 5 closest dealers, and whatever you choose (including
          &ldquo;I&rsquo;m not sure&rdquo;) shapes the emails delivered to your own test inboxes —
          the RSM notification, plus the dealer&rsquo;s own note when a dealer is picked. No real
          RSM or dealer is emailed, copied or BCC&rsquo;d; you&rsquo;ll see exactly who production
          would have delivered to. No lead reaches HubSpot or Shopify.
        </p>
        <ZipTestTool />
      </div>
    </main>
  )
}
