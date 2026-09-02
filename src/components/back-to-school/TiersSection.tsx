import { normalizeModel } from '@/lib/data/rebates'
import type { RebateCategory } from '@/lib/payload/rebate-types'
import { RuledGround, BTS_CONTAINER } from './RuledGround'
import { SectionHead } from './SectionHead'
import { Reveal } from './Choreography'

/**
 * Where to begin — the program sorted by who is going to play the piano, not by
 * what the piano is made of.
 *
 * This replaces the three "why September" reasons that stood here. Timing,
 * price and touch are all still argued on the page (the deadline runs through
 * the hero, the ledger and the dock; the touch argument moved into the starter
 * tier where a parent is actually asking the question), but a family landing on
 * this page does not need three reasons to buy — they need to know which of
 * eighteen pianos is theirs. The three tiers answer that in reading order, and
 * each one hands off to the ledger below.
 *
 * The marks beside each tier are dynamics — p, mf, ff. They carry the
 * progression the way a musician already reads a progression, and they are
 * decorative: the tier name and the audience line say it in words.
 */

type TierKey = 'starter' | 'step' | 'concert'

interface Tier {
  key: TierKey
  /** Musical dynamic mark — decorative, aria-hidden. */
  mark: string
  name: string
  audience: string
  body: string
}

const TIERS: readonly Tier[] = [
  {
    key: 'starter',
    mark: 'p',
    name: 'The Perfect Starter',
    audience: 'Beginners · families · first pianos',
    body: 'Eighty-eight weighted keys with real hammer action, so the technique a student builds at home is the one their teacher expects at the lesson. Headphones for late practice, a footprint that fits a family room, and nothing to tune.',
  },
  {
    key: 'step',
    mark: 'mf',
    name: 'The Step Up',
    audience: 'Advancing students · teachers · working musicians',
    body: 'Where practice gets demanding. The CA digitals and CX consoles put a wooden-key grand action under the hands at home; the K-Series uprights are full acoustic pianos, built in the same factory and voiced by the same hands as the concert instruments.',
  },
  {
    key: 'concert',
    mark: 'ff',
    name: 'The Concert Instrument',
    audience: 'Performers · professionals · conservatory players',
    body: 'Millennium III action, hand-selected soundboards, and the voice a performer builds a program on. These are the grands Kawai puts on stages — and for September, they are in the rebate program with everything else.',
  },
] as const

/**
 * Model → tier. Kept as an explicit list because the split a shopper cares
 * about is not the split the catalogue makes: the CA and CX digitals belong
 * beside the K-Series uprights, not beside the entry-level slabs, even though
 * the product type says "digital" for all of them.
 */
const TIER_MODELS: Record<TierKey, readonly string[]> = {
  starter: ['ES60', 'ES120', 'CN201', 'CN301', 'KDP120', 'K15'],
  step: ['ES920', 'CX102', 'CX202', 'CA401', 'CA501', 'CA701', 'CA901', 'K200', 'K300', 'K400', 'K500'],
  concert: ['GL10', 'GL20', 'GL30', 'GX2', 'GX3', 'GX5', 'GX6', 'GX7'],
}

const TIER_BY_MODEL: ReadonlyMap<string, TierKey> = new Map(
  (Object.entries(TIER_MODELS) as [TierKey, readonly string[]][]).flatMap(([tier, models]) =>
    models.map((model) => [normalizeModel(model), tier] as const),
  ),
)

/** Anything the list above doesn't name falls back to its product category. */
function tierForCategory(slug: string): TierKey {
  if (slug === 'grand' || slug === 'shigeru' || slug === 'hybrid') return 'concert'
  if (slug === 'upright') return 'step'
  return 'starter'
}

/** Model labels per tier, cheapest first — read off the live program, so a chip
 *  can never name a piano the ledger below doesn't carry. */
function modelsByTier(data: RebateCategory[]): Record<TierKey, string[]> {
  const rows = data
    .flatMap((category) => category.products.map((product) => ({ product, slug: category.slug })))
    .sort((a, b) => a.product.yourPrice - b.product.yourPrice)

  const out: Record<TierKey, string[]> = { starter: [], step: [], concert: [] }
  for (const { product, slug } of rows) {
    const tier = TIER_BY_MODEL.get(normalizeModel(product.model)) ?? tierForCategory(slug)
    if (!out[tier].includes(product.label)) out[tier].push(product.label)
  }
  return out
}

/** High enough that the Step Up tier can show its uprights alongside its
 *  digitals — the point of that tier is the spread. */
const MAX_CHIPS = 12

export function TiersSection({ data }: { data: RebateCategory[] }) {
  const byTier = modelsByTier(data)
  const total = data.reduce((n, category) => n + category.products.length, 0)

  return (
    <section className="relative bg-kawai-pearl border-t border-kawai-black/10">
      <RuledGround animate />

      <div className={`relative ${BTS_CONTAINER} py-16 md:py-24`}>
        <SectionHead
          eyebrow="Where to begin"
          title="Three ways in"
          aside="Every piano here is in the September program. The only question is which one the player needs."
          meta={total > 0 ? `${total} models` : undefined}
          className="mb-4"
        />

        <ol>
          {TIERS.map((tier) => {
            const models = byTier[tier.key]
            const shown = models.slice(0, MAX_CHIPS)
            const rest = models.length - shown.length

            return (
              <li
                key={tier.key}
                className="group border-b border-kawai-black/12 py-12 md:py-16 transition-colors hover:bg-white/55"
              >
                <div className="grid gap-y-7 gap-x-8 lg:gap-x-16 md:grid-cols-[3.5rem_minmax(0,1fr)] lg:grid-cols-[4.5rem_minmax(0,0.85fr)_minmax(0,1fr)]">
                  {/* Dynamic mark — p, mf, ff */}
                  <Reveal
                    delay={0.05}
                    className="bts-serif text-kawai-red/25 leading-none select-none transition-colors duration-500 group-hover:text-kawai-red/60"
                    style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 600 }}
                    aria-hidden
                  >
                    {tier.mark}
                  </Reveal>

                  <div>
                    <h3 className="bts-display bts-h3 text-kawai-black">
                      <Reveal as="span" variant="line" className="block" delay={0.08}>
                        {tier.name}
                      </Reveal>
                    </h3>
                    <Reveal
                      as="p"
                      delay={0.16}
                      className="bts-eyebrow text-kawai-red mt-4"
                      style={{ letterSpacing: '0.2em' }}
                    >
                      {tier.audience}
                    </Reveal>
                  </div>

                  <div className="lg:pt-1">
                    <Reveal as="p" delay={0.2} className="text-kawai-charcoal/75 text-[1.02rem] leading-relaxed max-w-xl">
                      {tier.body}
                    </Reveal>

                    {shown.length > 0 && (
                      <Reveal as="ul" delay={0.28} className="flex flex-wrap gap-2 mt-7">
                        {shown.map((label) => (
                          <li
                            key={label}
                            className="bts-num border border-kawai-black/20 px-3 py-1.5 text-kawai-black/80 text-xs tracking-[0.1em] uppercase transition-colors group-hover:border-kawai-black/35"
                          >
                            {label}
                          </li>
                        ))}
                        {rest > 0 && (
                          <li className="bts-num px-3 py-1.5 text-kawai-charcoal/45 text-xs tracking-[0.1em] uppercase">
                            +{rest} more
                          </li>
                        )}
                      </Reveal>
                    )}

                    <Reveal delay={0.34} className="mt-7">
                      <a
                        href="#rebates"
                        className="inline-flex items-center gap-2 text-kawai-black text-sm tracking-[0.14em] uppercase font-semibold underline underline-offset-[6px] decoration-kawai-black/25 hover:text-kawai-red hover:decoration-kawai-red transition-colors"
                      >
                        See the prices
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                      </a>
                    </Reveal>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
