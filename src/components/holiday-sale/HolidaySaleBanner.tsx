import Link from 'next/link'
import { SaleCtaPair } from '@/components/sale-template/SaleCtas'
import { toSaleStore, type StorefrontLike } from '@/components/sale-template/store'
import { DISPLAY, SANS } from '@/components/sale-template/tokens'
import { PROGRAM_END } from '@/app/(frontend)/fall-financing/_components/campaign'
import { holidayFinancing } from '@/app/(frontend)/store/[storeslug]/holiday-sale-event/financing'
import { REQUEST_LABEL } from '@/app/(frontend)/store/[storeslug]/holiday-sale-event/labels'
import { STORE_SALE_PATH } from '@/app/(frontend)/store/[storeslug]/holiday-sale-event/sale-path'
import { StoreLeadProvider } from '@/app/(frontend)/store/[storeslug]/holiday-sale-event/StoreLeadProvider'
import { holidayDaysUntilDeadline } from './campaign'

interface HolidaySaleBannerProps {
  storeslug: string
  /** The storefront record: name and phone are read from it, never typed. */
  storefront?: StorefrontLike | null
  /** The holiday page's own dry-run switch (FALL_FINANCING_TEST_MODE), read on the server. */
  testMode?: boolean
  /** Test seam; the page never passes it. */
  now?: Date
}

/** This store's live holiday sale page. Never the /holiday-sale-eventv1 backup. */
export const holidaySaleHref = (storeslug: string) => `/store/${storeslug}/${STORE_SALE_PATH}`

/** The existing labels from the holiday page (its _content.ts), not new copy. */
const CALL_LABEL = 'Call Now'

/**
 * The holiday sale banner on the storefront home page, directly under the news
 * carousel.
 *
 * kawai-store-contact-banner v1 (Chance, relayed by Marcy, 8:38 AM PT Nov 24,
 * 2026): restyled to match the /holiday-sale-event hero (SaleHero): a cream
 * field (Kawai pearl), the store name between red rules, the headline in the
 * holiday display serif (Fraunces 900, `--font-holiday-display`), and the
 * hero's own pair: solid Kawai red Request Inventory, which opens the holiday
 * page's existing lead form (StoreLeadProvider, no new form), and Call Now, a
 * tel: link to this store's own phone, left out when the record has none.
 *
 * Content is the approved holiday offer only: 0% financing on every model
 * (holidayFinancing.heading, the same line the sale page prints) and contacting
 * the store. No rates, lender terms, rebates, SH-9 or lessons.
 *
 * Mounted on /store/[storeslug] only. It is not a carousel slide, and the
 * /holiday-sale-event pages never render it. Renders nothing after December
 * 31, 2026 23:59:59.
 */
export function HolidaySaleBanner({ storeslug, storefront, testMode = false, now }: HolidaySaleBannerProps) {
  if (holidayDaysUntilDeadline(now) <= 0) return null

  const store = toSaleStore(storefront ?? {}, storeslug)
  // "Kawai" is written out beside it, as in the earlier banner.
  const cleanedName = store.name.replace(/piano gallery/gi, '').replace(/kawai/gi, '').trim()

  return (
    <section
      className="relative isolate overflow-hidden border-y border-kawai-black/10 bg-kawai-pearl"
      aria-label="Holiday Sale Event"
      data-banner="holiday-sale"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center px-5 py-14 text-center sm:px-10 md:py-20">
        <p
          className="flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-kawai-black/70"
          style={{ fontFamily: SANS }}
        >
          <span aria-hidden className="h-px w-8 bg-kawai-red" />
          {cleanedName ? `Kawai ${cleanedName} · Holiday Sale Event` : 'Holiday Sale Event'}
          <span aria-hidden className="h-px w-8 bg-kawai-red" />
        </p>

        <h2
          className="mt-7 max-w-3xl text-balance leading-[1.02] text-kawai-black"
          style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 'clamp(2.3rem, 6.5vw, 4.6rem)' }}
        >
          {holidayFinancing.heading}
        </h2>

        <p
          className="mt-6 max-w-xl text-balance text-[clamp(1.15rem,2.6vw,1.5rem)] leading-snug text-kawai-black/85"
          style={{ fontFamily: DISPLAY, fontWeight: 700 }}
        >
          Contact the store and we&apos;ll help you find yours.
        </p>

        <div className="mt-9 flex w-full flex-col items-center">
          <StoreLeadProvider storeSlug={storeslug} testMode={testMode}>
            <SaleCtaPair
              cta={{ requestLabel: REQUEST_LABEL, leadIn: '' }}
              callLabel={CALL_LABEL}
              store={store}
              placement="store-home-banner"
            />
          </StoreLeadProvider>
        </div>

        <p className="mt-7 text-sm text-kawai-black/70" style={{ fontFamily: SANS }}>
          <Link
            href={holidaySaleHref(storeslug)}
            className="font-semibold text-kawai-red underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-red"
          >
            See the sale
          </Link>
          <span aria-hidden className="mx-2">·</span>
          Sale event ends {PROGRAM_END}
        </p>
      </div>
    </section>
  )
}
