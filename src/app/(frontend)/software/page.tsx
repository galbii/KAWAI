import type { Metadata } from 'next'
import Link from 'next/link'
import { getStaticAlternates } from '@/lib/site-context'
import { getSoftwareReleases } from '@/lib/software/queries'
import { SoftwareDirectory } from '@/components/software/SoftwareDirectory'

export const metadata: Metadata = {
  title: 'Software & Firmware Updates | Kawai Pianos',
  description:
    'Download the latest system software and firmware for Kawai digital, hybrid, AnyTime and AURES pianos. Search by model to find your update file and instructions.',
  alternates: getStaticAlternates('/software'),
}

/** Fallback rebuild hourly; admin edits bust the cache immediately via /api/revalidate. */
export const revalidate = 3600

export default async function SoftwarePage() {
  const models = await getSoftwareReleases()

  if (models.length === 0) {
    return (
      <main className="bg-kawai-pearl">
        <section className="bg-kawai-black">
          <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-20 sm:px-6 lg:px-8">
            <h1 className="font-[family-name:var(--font-brand-serif)] text-4xl text-white sm:text-5xl">
              Software &amp; firmware
            </h1>
          </div>
        </section>
        <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-[15px] text-kawai-charcoal">
            Firmware downloads are being updated. Please check back shortly, or{' '}
            <Link href="/technical-support-division" className="text-kawai-red underline underline-offset-4">
              contact technical support
            </Link>
            .
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-kawai-pearl">
      <SoftwareDirectory models={models} />

      <aside className="border-t border-kawai-neutral/60 bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="max-w-2xl text-[13px] leading-relaxed text-kawai-charcoal/75">
            Update files are hosted and digitally signed by Kawai Japan, and open on
            kawai-global.com. If an update does not apply cleanly, stop and{' '}
            <Link
              href="/technical-support-division"
              className="text-kawai-red underline underline-offset-4 transition-colors hover:text-kawai-red-700"
            >
              contact technical support
            </Link>{' '}
            rather than repeating it.
          </p>
        </div>
      </aside>
    </main>
  )
}
