import Image from 'next/image'
import {
  DEFAULT_RENTAL_CTA_TEXT,
  RENTAL_INQUIRY_ANCHOR,
  rentalInquiryHref,
  rentalPianoTypeOf,
  resolveRentalHighlights,
} from '@/lib/rentals'
import {
  getRentalImageFallbacks,
  mediaUrl,
  rentalCategoryOf,
  type RentalImageFallbacks,
} from '@/lib/rentals-images'
import { RentalTiles, type RentalTile } from './rentals/RentalTiles'

interface MonthlyRental {
  pianoType: string
  startingPrice: number
  unit?: string | null
  description?: string | null
  image?: unknown
}

interface EventRentalRate {
  pianoType: string
  price: number
  durationLabel: string
}

interface PianoRentalsData {
  pianoRentalsEnabled?: boolean
  pianoRentalsTitle?: string
  pianoRentalsDescription?: string
  rentalHighlights?: { text?: string | null }[] | null
  monthlyRentals?: MonthlyRental[]
  rentToOwn?: {
    enabled?: boolean
    applicationMonths?: number
    minimumRentalMonths?: number
    description?: string
  }
  eventRentals?: {
    enabled?: boolean
    rates?: EventRentalRate[]
    eventTypes?: { eventType: string }[]
    contactPhone?: string
    contactNote?: string
  }
  rentalCtaText?: string
  rentalCtaLink?: string
}

interface PianoRentalsSectionProps {
  data: PianoRentalsData
  storeslug: string
  /**
   * Rentals-page mode: tiles link to the form on the same page, and the
   * closing CTA is dropped because the form sits directly below.
   */
  onRentalsPage?: boolean
  /** Pass when the caller already fetched them (rentals page). */
  fallbacks?: RentalImageFallbacks
}

const SERIF = 'var(--font-crimson), Georgia, serif'

/** Stored units look like '/month' — strip the slash so we can add our own. */
const unitLabel = (unit?: string | null) => (unit ?? 'month').replace(/^\s*\/\s*/, '').trim() || 'month'

/** Red-rule label + light Crimson heading — the homepage section header. */
function SectionHeading({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-8 md:mb-12">
      <div className="mb-4 flex items-center gap-3">
        <span className="block h-px w-6 bg-kawai-red" />
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-kawai-charcoal/60">{label}</p>
      </div>
      <h2
        className="font-light leading-tight text-kawai-black"
        style={{ fontFamily: SERIF, fontSize: 'clamp(1.9rem, 3.4vw, 3rem)', letterSpacing: '-0.02em' }}
      >
        {children}
      </h2>
    </div>
  )
}

export async function PianoRentalsSection({
  data,
  storeslug,
  onRentalsPage = false,
  fallbacks,
}: PianoRentalsSectionProps) {
  if (!data.pianoRentalsEnabled) return null
  if (!data.monthlyRentals || data.monthlyRentals.length === 0) return null

  const images = fallbacks ?? (await getRentalImageFallbacks())
  const highlights = resolveRentalHighlights(data.rentalHighlights)
  // An empty link used to fall back to '#', which just jumped to the top of
  // the page — default to this store's rental inquiry page instead.
  const ctaHref = data.rentalCtaLink?.trim() || rentalInquiryHref(storeslug)
  const ctaText = data.rentalCtaText?.trim() || DEFAULT_RENTAL_CTA_TEXT
  const creditMonths = data.rentToOwn?.enabled ? (data.rentToOwn.applicationMonths ?? 6) : 0
  const events = data.eventRentals?.enabled ? data.eventRentals : null

  const tiles: RentalTile[] = data.monthlyRentals.map((rate) => {
    const category = rentalCategoryOf(rate.pianoType)
    const piano = rentalPianoTypeOf(category)
    return {
      label: rate.pianoType,
      tag: category ?? 'Rental',
      price: rate.startingPrice,
      unit: unitLabel(rate.unit),
      description: rate.description ?? null,
      imageUrl: mediaUrl(rate.image) ?? (category ? images.byCategory[category] : undefined) ?? null,
      href: onRentalsPage
        ? `${piano ? `?piano=${piano}` : ''}#${RENTAL_INQUIRY_ANCHOR}`
        : rentalInquiryHref(storeslug, undefined, piano),
    }
  })

  // Rent-to-own photo: the first collection shot not already on the page.
  const used = new Set([images.hero, ...tiles.map((t) => t.imageUrl)])
  const ownImage = images.all.find((url) => !used.has(url)) ?? images.byCategory.grand ?? null

  return (
    <section className="bg-kawai-pearl">
      {/* Monthly rentals */}
      <div className="container mx-auto max-w-screen-2xl px-6 md:px-10 py-16 md:py-24">
        <SectionHeading label={onRentalsPage ? 'Monthly rentals' : 'Rental program'}>
          {onRentalsPage ? 'Choose your piano' : data.pianoRentalsTitle || 'Rent a brand-new Kawai'}
        </SectionHeading>
        {!onRentalsPage && data.pianoRentalsDescription && (
          <p className="-mt-4 mb-10 max-w-2xl text-lg leading-relaxed text-kawai-black/70">
            {data.pianoRentalsDescription}
          </p>
        )}
        <RentalTiles tiles={tiles} />
      </div>

      {/* Rent to own — one bold statement beside one photo */}
      {creditMonths > 0 && (
        <div className="bg-kawai-black text-white">
          <div className="grid lg:grid-cols-2">
            <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[560px]">
              {ownImage && (
                <Image src={ownImage} alt="" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              )}
            </div>
            <div className="flex flex-col justify-center px-6 py-16 md:px-16 lg:py-20 lg:px-20">
              <p
                className="font-light leading-none"
                style={{ fontFamily: SERIF, fontSize: 'clamp(3.5rem, 7vw, 7rem)', letterSpacing: '-0.03em' }}
              >
                Rent to Own
              </p>
              <p className="mt-6 max-w-md text-xl leading-relaxed text-white/80">
                If you decide to buy, your{' '}
                <strong className="font-semibold text-white underline decoration-kawai-red-400 decoration-2 underline-offset-[6px]">
                  first {creditMonths} months of rental fees
                </strong>{' '}
                can be applied toward the down payment.
              </p>
              {data.rentToOwn?.description && (
                <p className="mt-8 max-w-md text-sm leading-relaxed text-white/55">{data.rentToOwn.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Why rent from Kawai */}
      <div className="container mx-auto max-w-screen-2xl px-6 md:px-10 py-16 md:py-24">
        <SectionHeading label="Why rent from Kawai">A great way to start</SectionHeading>
        <ul className="grid gap-x-12 border-t border-kawai-black/15 md:grid-cols-2 lg:grid-cols-3">
          {highlights.map((text, index) => (
            <li key={index} className="border-b border-kawai-black/15 py-6 text-[1.05rem] leading-relaxed text-kawai-black/80">
              {text}
            </li>
          ))}
        </ul>

        {/* Event rentals */}
        {events && events.rates && events.rates.length > 0 && (
          <div className="mt-16 md:mt-24">
            <SectionHeading label="Event rentals">
              {events.eventTypes && events.eventTypes.length > 0
                ? `For ${events.eventTypes.map((e) => e.eventType.toLowerCase()).join(', ')}`
                : 'A Kawai for your event'}
            </SectionHeading>
            <table className="w-full max-w-3xl text-left">
              <caption className="sr-only">Event rental rates</caption>
              <thead>
                <tr className="text-sm text-kawai-black/55">
                  <th scope="col" className="pb-3 font-normal">Piano</th>
                  <th scope="col" className="hidden pb-3 font-normal sm:table-cell">Duration</th>
                  <th scope="col" className="pb-3 text-right font-normal">Rate</th>
                </tr>
              </thead>
              <tbody>
                {events.rates.map((rate, i) => (
                  <tr key={i} className="border-t border-kawai-black/15">
                    <td className="py-5 font-semibold text-kawai-black">
                      {rate.pianoType}
                      <span className="block text-sm font-normal text-kawai-black/55 sm:hidden">{rate.durationLabel}</span>
                    </td>
                    <td className="hidden py-5 text-kawai-black/60 sm:table-cell">{rate.durationLabel}</td>
                    <td className="py-5 text-right font-semibold tabular-nums">${rate.price.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(events.contactPhone || events.contactNote) && (
              <p className="mt-6 text-sm text-kawai-black/65">
                {events.contactNote}{' '}
                {events.contactPhone && (
                  <a
                    href={`tel:${events.contactPhone}`}
                    className="font-medium text-kawai-black underline decoration-kawai-red underline-offset-4 hover:text-kawai-red"
                  >
                    {events.contactPhone}
                  </a>
                )}
              </p>
            )}
          </div>
        )}

        {!onRentalsPage && (
          <div className="mt-12 flex justify-center">
            <a
              href={ctaHref}
              className="inline-flex items-center rounded-full bg-kawai-red px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors duration-300 hover:bg-kawai-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-red"
            >
              {ctaText}
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
