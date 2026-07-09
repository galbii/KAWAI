import type { Metadata } from 'next'
import Link from 'next/link'
import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload/queries'
import { getStaticAlternates } from '@/lib/site-context'
import ShigeruDealerGrid, { type ShigeruDealerDoc } from '../_components/ShigeruDealerGrid'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Authorized Shigeru Kawai Dealers | Find a Dealer Near You',
  description:
    'Find an authorized Shigeru Kawai dealer near you across the United States and Canada. Experience the SK Series grand pianos in person at a location near you.',
  alternates: getStaticAlternates('/shigeru/dealers'),
}

// Canadian province codes — used to separate US from Canada
const CANADIAN_PROVINCES = new Set([
  'BC', 'ON', 'QC', 'AB', 'MB', 'SK', 'NS', 'NB', 'PE', 'NL', 'NT', 'YT', 'NU',
])

function isCanada(dealer: ShigeruDealerDoc): boolean {
  const state = dealer.address?.state?.trim().toUpperCase() ?? ''
  const country = dealer.address?.country?.toLowerCase() ?? ''
  return CANADIAN_PROVINCES.has(state) || country.includes('canada')
}

// Named return type — avoids the unstable_cache inline-type parse error
type DealerList = ShigeruDealerDoc[]

const getShigeruDealers = unstable_cache(
  async (): Promise<DealerList> => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'dealers',
      where: {
        and: [
          { isActive: { equals: true } },
          { shigeruKawaiDealer: { equals: true } },
        ],
      },
      select: {
        dealerName: true,
        isFeatured: true,
        description: true,
        address: true,
        contactInfo: true,
        coordinates: true,
      },
      sort: 'dealerName',
      depth: 0,
      limit: 300,
    })
    return docs as DealerList
  },
  ['shigeru-dealers'],
  { tags: ['dealers', 'shigeru-dealers'], revalidate: 3600 },
)

export default async function ShigeruDealersPage() {
  const dealers = await getShigeruDealers()

  const usDealers = dealers
    .filter((d) => !isCanada(d))
    .sort((a, b) => a.dealerName.localeCompare(b.dealerName))

  const canadaDealers = dealers
    .filter(isCanada)
    .sort((a, b) => a.dealerName.localeCompare(b.dealerName))

  const totalCount = dealers.length

  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      {/* ── Hero: white title zone ── */}
      <section className="bg-white px-6 pt-36 pb-12">
        <div className="max-w-6xl mx-auto">
          <p
            className="text-kawai-muted text-[10px] tracking-[0.45em] uppercase mb-6"
            style={{ fontFamily: 'var(--font-oswald)' }}
          >
            Shigeru Kawai · North America
          </p>
          <h1
            className="text-kawai-black font-bold uppercase leading-none"
            style={{
              fontFamily: 'var(--font-oswald)',
              fontSize: 'clamp(2.6rem, 6vw, 5rem)',
              letterSpacing: '0.02em',
            }}
          >
            Authorized
            <br />
            <span className="text-kawai-gold">Dealers</span>
          </h1>
        </div>
      </section>

      {/* ── Stats: dark zone ── */}
      <section className="px-6 pt-10 pb-10 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center gap-8">
            <span className="block h-px w-14 bg-kawai-gold/30" aria-hidden />
            <div className="flex flex-wrap gap-12">
              <div>
                <span
                  className="block text-white font-bold leading-none mb-2"
                  style={{ fontFamily: 'var(--font-oswald)', fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
                >
                  {totalCount}
                </span>
                <span
                  className="text-white/30 text-[9px] tracking-[0.35em] uppercase"
                  style={{ fontFamily: 'var(--font-oswald)' }}
                >
                  Authorized Dealers
                </span>
              </div>
              <div>
                <span
                  className="block text-white font-bold leading-none mb-2"
                  style={{ fontFamily: 'var(--font-oswald)', fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
                >
                  {usDealers.length}
                </span>
                <span
                  className="text-white/30 text-[9px] tracking-[0.35em] uppercase"
                  style={{ fontFamily: 'var(--font-oswald)' }}
                >
                  United States
                </span>
              </div>
              <div>
                <span
                  className="block text-white font-bold leading-none mb-2"
                  style={{ fontFamily: 'var(--font-oswald)', fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
                >
                  {canadaDealers.length}
                </span>
                <span
                  className="text-white/30 text-[9px] tracking-[0.35em] uppercase"
                  style={{ fontFamily: 'var(--font-oswald)' }}
                >
                  Canada
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Dealer grid + map (client component handles both) ── */}
      <ShigeruDealerGrid usDealers={usDealers} canadaDealers={canadaDealers} />

      {/* ── Headquarters ── */}
      <section className="px-6 pb-24 border-t border-white/[0.04] pt-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between mb-8">
            <p
              className="text-white/20 text-[10px] tracking-[0.4em] uppercase"
              style={{ fontFamily: 'var(--font-oswald)' }}
            >
              North American Headquarters
            </p>
            <span className="hidden md:block h-px flex-1 mx-8 bg-white/[0.04]" aria-hidden />
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.04] overflow-hidden"
            style={{ borderRadius: '10px' }}
          >
            <div className="bg-[#0e0e0e] p-8">
              <p
                className="text-kawai-gold font-semibold text-[15px] tracking-[0.06em] uppercase mb-3"
                style={{ fontFamily: 'var(--font-oswald)' }}
              >
                Kawai America Corporation
              </p>
              <p className="text-white/40 text-sm leading-relaxed">
                2055 E University Dr<br />
                Rancho Dominguez, CA 90220
              </p>
            </div>
            <div className="bg-[#0e0e0e] p-8">
              <p
                className="text-white/20 text-[9px] tracking-[0.3em] uppercase mb-3"
                style={{ fontFamily: 'var(--font-oswald)' }}
              >
                Phone
              </p>
              <a
                href="tel:+13106311771"
                className="text-white/60 hover:text-white text-sm transition-colors duration-200"
              >
                +1 310-631-1771
              </a>
              <p className="text-white/25 text-xs mt-1">Press 3 for Sales</p>
            </div>
            <div className="bg-[#0e0e0e] p-8 flex flex-col justify-center">
              <Link
                href="/shigeru/contact"
                style={{ fontFamily: 'var(--font-oswald)', borderRadius: '6px' }}
                className="inline-flex items-center gap-2 border border-kawai-gold/30 hover:border-kawai-gold/65 text-kawai-gold text-[12px] font-semibold tracking-[0.08em] uppercase px-6 py-3 transition-all duration-300 hover:bg-kawai-gold/[0.06]"
              >
                Send an Inquiry
                <svg width="12" height="9" viewBox="0 0 12 9" fill="none" aria-hidden="true">
                  <path d="M1 4.5H11M7.5 1L11 4.5L7.5 8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
