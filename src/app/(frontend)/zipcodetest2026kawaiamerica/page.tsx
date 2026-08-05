import type { Metadata } from 'next'
import { ZipTestTool } from './ZipTestTool'

/**
 * INTERNAL TEST PAGE — RSM lead-routing dry run.
 *
 * Enter a ZIP / postal code and see exactly where the signup-offer RSM
 * notification WOULD be sent (nearest dealer's rsmEmail or the fallback
 * inbox), with the candidate dealers on the find-a-dealer map. Sends nothing.
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
        <h1 className="mb-1 text-2xl font-bold text-kawai-black">RSM Lead Routing — Dry Run</h1>
        <p className="mb-8 text-sm text-kawai-charcoal/70">
          Enter a ZIP or Canadian postal code to see which RSM the signup-offer notification would
          go to. Nothing is sent — no Resend email, no HubSpot, no Shopify.
        </p>
        <ZipTestTool />
      </div>
    </main>
  )
}
