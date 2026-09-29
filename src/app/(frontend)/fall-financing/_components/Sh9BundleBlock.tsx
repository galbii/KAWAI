'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Q4_CONTAINER } from './PromoStyles'
import { BlockHead, ProductCard, TabRow, PromoButton } from './PromoUI'
import { bundle, PROGRAM_END_SHORT, SECTION } from './campaign'
import { formatPrice } from '@/lib/utils'
import type { PromoGroup } from '@/lib/payload/promo-types'

/**
 * Buy a CN or CA Series piano, get a pair of SH-9 headphones.
 *
 * The content is a pairing — one thing given with another — so the block is
 * built as a pairing: the headphones stated once on the left, at rest, and the
 * instruments that earn them on the right, switchable by series. Neither side
 * makes sense without the other, which is why they share a row rather than
 * stacking as two sections.
 *
 * The tab switch is the only motion here, and it answers a tap.
 */
export function Sh9BundleBlock({ groups }: { groups: PromoGroup[] }) {
  const [active, setActive] = useState(groups[0]?.handle ?? '')
  const shown = groups.find((g) => g.handle === active) ?? groups[0]

  return (
    <section
      id={SECTION.bundle}
      className="scroll-mt-20 border-b border-[color:var(--rule)] bg-[color:var(--paper)]"
    >
      <div className={`${Q4_CONTAINER} py-20 md:py-28`}>
        <BlockHead
          heading={bundle.heading}
          standfirst={bundle.standfirst}
          aside={`Through ${PROGRAM_END_SHORT}`}
        />

        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.6fr)] lg:gap-16">
          {/* What you get. Stated once, at rest. */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative aspect-square w-full overflow-hidden bg-[color:var(--card)]">
              <Image
                src="https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/250829_0028.webp"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 360px"
                className="object-cover object-center"
              />
            </div>

            <p className="q4-model mt-6 text-[1.3rem] text-[color:var(--ink)]">
              {bundle.headphone.model}
            </p>
            <p className="mt-1 text-[0.95rem] text-[color:var(--muted)]">
              {bundle.headphone.name}
            </p>
            <p className="q4-num mt-3 text-[1.1rem] text-[color:var(--money)]">
              {formatPrice(bundle.headphone.value)} value, included
            </p>
            <p className="mt-4 text-[0.92rem] leading-relaxed text-[color:var(--muted)]">
              {bundle.headphone.blurb}
            </p>

            {/* The terms as a plain list. Not numbered — they are four
                conditions that all hold at once, not four steps in order. */}
            <ul className="mt-7 space-y-3 border-t border-[color:var(--rule)] pt-7">
              {bundle.points.map((point) => (
                <li
                  key={point}
                  className="grid grid-cols-[auto_1fr] gap-3 text-[0.92rem] leading-snug text-[color:var(--muted)]"
                >
                  <span
                    aria-hidden
                    className="mt-[0.45em] h-[3px] w-[3px] shrink-0 rounded-full bg-[color:var(--money)]"
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* What earns it. */}
          <div>
            {groups.length === 0 ? (
              <p className="border border-[color:var(--rule-soft)] bg-[color:var(--card)] px-6 py-12 text-center text-[0.95rem] text-[color:var(--muted)]">
                {bundle.emptyState}
              </p>
            ) : (
              <>
                <TabRow
                  label={bundle.tabsLabel}
                  tabs={groups.map((g) => ({
                    id: g.handle,
                    label: g.title,
                    count: g.products.length,
                  }))}
                  active={shown?.handle ?? ''}
                  onSelect={setActive}
                />

                {/* Keyed on the handle so the panel re-runs its entrance when
                    the series changes — the movement is what tells you the
                    grid under your finger is now a different set. */}
                <div
                  key={shown?.handle}
                  role="tabpanel"
                  className="q4-panel mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
                >
                  {shown?.products.map((product) => (
                    <ProductCard
                      key={product.slug}
                      product={product}
                      savingLabel="SH-9 pair included"
                    />
                  ))}
                </div>
              </>
            )}

            <div className="mt-10 flex flex-wrap items-center gap-5">
              <PromoButton />
              <p className="max-w-[46ch] text-[0.76rem] leading-relaxed text-[color:var(--muted-dim)]">
                {bundle.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
