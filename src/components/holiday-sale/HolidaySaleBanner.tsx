import Link from 'next/link'
import { RuledGround, BTS_CONTAINER } from '@/components/back-to-school/RuledGround'
import { CampaignStyles, CampaignNoScript } from '@/components/back-to-school/CampaignStyles'
import { Reveal } from '@/components/back-to-school/Choreography'
import { telHref } from '@/components/sale-template/store'
import { PROGRAM_END } from '@/app/(frontend)/fall-financing/_components/campaign'
import { holidayFinancing } from '@/app/(frontend)/store/[storeslug]/holiday-sale-event/financing'
import { STORE_SALE_PATH } from '@/app/(frontend)/store/[storeslug]/holiday-sale-event/sale-path'
import { holidayDaysUntilDeadline } from './campaign'

interface HolidaySaleBannerProps {
  storeslug: string
  locationName?: string | null
  phone?: string | null
  /** Test seam; the page never passes it. */
  now?: Date
}

/** This store's live holiday sale page. Never the /holiday-sale-eventv1 backup. */
export const holidaySaleHref = (storeslug: string) => `/store/${storeslug}/${STORE_SALE_PATH}`

/**
 * The holiday sale banner on the storefront home page, directly under the news
 * carousel, in the slot and style of BackToSchoolPromo (PromoSection.tsx).
 *
 * Content is the approved holiday offer only: 0% financing on every model
 * (holidayFinancing.heading, the same line the sale page prints) and contacting
 * the store. No rates, lender terms, rebates, SH-9 or lessons.
 *
 * Mounted on /store/[storeslug] only. It is not a carousel slide, and the
 * /holiday-sale-event pages never render it. Server component; renders nothing
 * after December 31, 2026 23:59:59.
 */
export function HolidaySaleBanner({ storeslug, locationName, phone, now }: HolidaySaleBannerProps) {
  if (holidayDaysUntilDeadline(now) <= 0) return null

  // "Kawai" is written out beside it, as in BackToSchoolPromo.
  const cleanedName = (locationName ?? '')
    .replace(/piano gallery/gi, '')
    .replace(/kawai/gi, '')
    .trim()
  const tel = telHref({ phone: phone ?? null })
  const contactHref = tel ?? `/store/${storeslug}/contact`

  return (
    <section
      className="relative bg-kawai-black overflow-hidden"
      aria-label="Holiday Sale Event"
      data-banner="holiday-sale"
    >
      <CampaignStyles />
      <CampaignNoScript />
      <RuledGround tone="dark" animate />

      <div className={`relative ${BTS_CONTAINER} py-14 md:py-20`}>
        <div className="flex items-center gap-3.5 mb-6">
          <Reveal as="span" variant="ruleX" className="w-10 h-px bg-kawai-red-400" aria-hidden />
          <Reveal as="span" delay={0.08} className="bts-eyebrow text-kawai-pearl/80">
            {cleanedName ? `Kawai ${cleanedName} · Holiday Sale Event` : 'Holiday Sale Event'}
          </Reveal>
        </div>

        <h2 className="bts-display text-kawai-pearl">
          <Reveal
            as="span"
            variant="line"
            className="block"
            style={{ fontSize: 'clamp(2.2rem, 6.5vw, 4.8rem)' }}
          >
            {holidayFinancing.heading}
          </Reveal>
        </h2>

        <Reveal
          as="p"
          delay={0.16}
          className="bts-serif text-kawai-pearl/85 mt-6 max-w-xl leading-snug"
          style={{ fontSize: 'clamp(1.15rem, 2vw, 1.5rem)' }}
        >
          Contact the store and we&apos;ll help you find yours.
        </Reveal>

        <Reveal delay={0.24} className="mt-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <Link
              href={holidaySaleHref(storeslug)}
              className="group inline-flex items-center justify-center gap-3 px-9 py-5 bg-kawai-red hover:bg-kawai-red-600 text-white text-sm tracking-[0.18em] uppercase font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-pearl"
            >
              See the sale
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <a
              href={contactHref}
              className="inline-flex items-center justify-center px-9 py-5 border border-kawai-pearl/45 text-kawai-pearl hover:bg-kawai-pearl hover:text-kawai-black text-sm tracking-[0.18em] uppercase font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-pearl"
            >
              Contact the store
            </a>
          </div>
        </Reveal>

        <Reveal as="p" delay={0.3} className="bts-eyebrow text-kawai-pearl/45 mt-6">
          Sale event ends {PROGRAM_END}
        </Reveal>
      </div>
    </section>
  )
}
