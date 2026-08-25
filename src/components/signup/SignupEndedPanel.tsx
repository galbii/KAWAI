import Link from 'next/link'

/**
 * Rendered at HTTP 200 when a campaign's endDate has passed.
 *
 * Deliberately not a 404: these URLs go on printed flyers and QR codes that
 * outlive the promo, so the traffic is real and worth catching.
 */
export function SignupEndedPanel({
  campaignTitle,
  storeName,
  storeslug,
}: {
  campaignTitle: string
  storeName: string
  storeslug: string
}) {
  return (
    <main className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-kawai-black sm:text-4xl">
        {campaignTitle} has ended
      </h1>
      <p className="mt-4 text-base leading-relaxed text-kawai-charcoal">
        Thanks for your interest. This event is over, but {storeName} is open and would love to
        hear from you.
      </p>
      <Link
        href={`/store/${storeslug}`}
        className="mt-8 inline-block rounded-md bg-kawai-red px-6 py-3 font-semibold text-white transition-colors hover:bg-kawai-red-600"
      >
        Visit {storeName}
      </Link>
    </main>
  )
}
