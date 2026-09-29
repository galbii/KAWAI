'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Q4_CONTAINER } from './PromoStyles'
import { BlockHead, TabRow, PromoButton } from './PromoUI'
import { financing, SECTION, POST_APR, BLENDED_APR, INTRO_APR } from './campaign'
import { formatPrice } from '@/lib/utils'
import { planFor } from '@/lib/financing/plan'
import { FALL_2026 } from '@/lib/financing/terms'
import type { FinancedCategory, FinancedProduct } from '@/lib/payload/financing-types'

/**
 * The acoustic range as a payment ledger — one line per model, each carrying
 * what the program puts that piano at per month.
 *
 * Two levels of filter, because the catalogue has two levels. The categories
 * (grand, upright, Shigeru) are how a shopper thinks about the instrument; the
 * series underneath (GL, GX, K, K Professional) are how Kawai ranges it, and a
 * shopper who already knows they want a GX should not have to scroll fourteen
 * grands to compare four. The series row only appears when the active category
 * has more than one, so it never shows a single pointless tab.
 *
 * Every figure comes from `planFor()`, which `plan.test.ts` pins to the
 * lender's own worked example — so this table and the disclosures at the foot
 * of the page cannot drift apart.
 *
 * The row shows the promotional payment and the window it holds for. What
 * replaces that payment is still disclosed, just not thirty-three times over:
 * the expanded row breaks out both windows, the term, the APR and the total,
 * and the note under the table states the whole stream in prose. Quoting a
 * monthly payment obliges the page to disclose the full repayment terms and
 * the APR, so neither of those should be removed or moved out of sight.
 */

const ALL = 'all'

export function FinancingBlock({ data }: { data: FinancedCategory[] }) {
  const [category, setCategory] = useState<string>(data[0]?.slug ?? '')
  const [series, setSeries] = useState<string>(ALL)
  const [openSlug, setOpenSlug] = useState<string | null>(null)

  const activeCategory = data.find((c) => c.slug === category) ?? data[0]

  /** Series present in the active category, in catalogue order. */
  const seriesTabs = useMemo(() => {
    const seen = new Map<string, { id: string; label: string; count: number }>()
    for (const p of activeCategory?.products ?? []) {
      const id = p.collectionHandle ?? 'other'
      const label = p.collectionTitle ?? 'Other'
      const row = seen.get(id) ?? { id, label, count: 0 }
      row.count += 1
      seen.set(id, row)
    }
    const list = [...seen.values()]
    // One series is not a choice — don't render a row the shopper cannot use.
    return list.length > 1
      ? [{ id: ALL, label: financing.allSeries, count: activeCategory?.products.length ?? 0 }, ...list]
      : []
  }, [activeCategory])

  const rows = useMemo(() => {
    const all = activeCategory?.products ?? []
    return series === ALL ? all : all.filter((p) => (p.collectionHandle ?? 'other') === series)
  }, [activeCategory, series])

  function selectCategory(slug: string) {
    setCategory(slug)
    setSeries(ALL)
    setOpenSlug(null)
  }

  return (
    <section
      id={SECTION.financing}
      className="scroll-mt-20 border-b border-[color:var(--rule)] bg-[color:var(--paper)]"
    >
      <div className={`${Q4_CONTAINER} py-20 md:py-28`}>
        <BlockHead
          heading={financing.heading}
          standfirst={financing.standfirst}
          aside={`${rows.length} ${rows.length === 1 ? 'model' : 'models'}`}
        />

        {data.length === 0 ? (
          <p className="border border-[color:var(--rule-soft)] bg-[color:var(--card)] px-6 py-12 text-center text-[0.95rem] text-[color:var(--muted)]">
            {financing.emptyState}
          </p>
        ) : (
          <>
            {/* What's in and what's out, before the table rather than under it —
                someone scanning for a digital should find out here, not after
                reading thirty rows that never include one. */}
            <dl className="mb-10 grid gap-x-12 gap-y-3 border-y border-[color:var(--rule)] py-5 sm:grid-cols-2">
              <div className="flex gap-3">
                <dt className="shrink-0 text-[0.88rem] font-medium text-[color:var(--ink)]">Covers</dt>
                <dd className="text-[0.88rem] leading-snug text-[color:var(--muted)]">
                  {financing.includes}
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="shrink-0 text-[0.88rem] font-medium text-[color:var(--muted-dim)]">
                  Excludes
                </dt>
                <dd className="text-[0.88rem] leading-snug text-[color:var(--muted)]">
                  {financing.excludes}
                </dd>
              </div>
            </dl>

            <TabRow
              label="Choose a category"
              tabs={data.map((c) => ({ id: c.slug, label: c.label, count: c.products.length }))}
              active={activeCategory?.slug ?? ''}
              onSelect={selectCategory}
            />

            {seriesTabs.length > 0 && (
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="mr-1 text-[0.82rem] text-[color:var(--muted-dim)]">
                  {financing.seriesLabel}
                </span>
                {seriesTabs.map((s) => {
                  const on = s.id === series
                  return (
                    <button
                      key={s.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => {
                        setSeries(s.id)
                        setOpenSlug(null)
                      }}
                      className={`q4-focus border px-3.5 py-1.5 text-[0.84rem] transition-colors duration-200 ${
                        on
                          ? 'border-[color:var(--ink)] bg-[color:var(--ink)] text-white'
                          : 'border-[color:var(--rule)] text-[color:var(--muted)] hover:border-[color:var(--ink)] hover:text-[color:var(--ink)]'
                      }`}
                    >
                      {s.label}
                    </button>
                  )
                })}
              </div>
            )}

            <div
              key={`${activeCategory?.slug}-${series}`}
              className="q4-panel mt-8 border border-[color:var(--rule-soft)] bg-[color:var(--card)]"
            >
              {rows.map((product) => (
                <LedgerRow
                  key={product.slug}
                  product={product}
                  open={openSlug === product.slug}
                  onToggle={() =>
                    setOpenSlug((cur) => (cur === product.slug ? null : product.slug))
                  }
                />
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-start gap-6">
              <PromoButton />
              <p className="max-w-[58ch] text-[0.76rem] leading-relaxed text-[color:var(--muted-dim)]">
                {financing.paymentNote}
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

/** Whole dollars: a per-model figure is an estimate, and cents imply a quote. */
const monthly = (amount: number) => formatPrice(Math.round(amount))

function LedgerRow({
  product,
  open,
  onToggle,
}: {
  product: FinancedProduct
  open: boolean
  onToggle: () => void
}) {
  // No published price, no honest payment. The model still qualifies, so the
  // row stays — the Shigeru line is sold by consultation and never carries one.
  const plan = product.price == null ? null : planFor(product.price, FALL_2026)
  const panelId = `fin-${product.slug}`

  return (
    <div className="border-b border-[color:var(--rule-soft)] last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="q4-focus group grid w-full grid-cols-[auto_1fr_auto] items-center gap-x-4 px-4 py-4 text-left transition-colors duration-200 hover:bg-[color:var(--paper)] sm:gap-x-6 sm:px-6"
      >
        <span className="relative h-11 w-11 shrink-0 overflow-hidden bg-[color:var(--paper)] sm:h-14 sm:w-14" aria-hidden>
          {product.imageUrl && (
            <Image src={product.imageUrl} alt="" fill sizes="56px" className="object-contain" />
          )}
        </span>

        <span className="min-w-0">
          <span className="q4-model block text-[1.05rem] leading-tight text-[color:var(--ink)]">
            {product.label}
          </span>
          <span className="mt-0.5 block truncate text-[0.8rem] text-[color:var(--muted-dim)]">
            {product.price == null ? (
              financing.onRequest
            ) : (
              <span className="q4-num">{formatPrice(product.price)}</span>
            )}
          </span>
        </span>

        <span className="text-right">
          {plan ? (
            <>
              <span className="q4-num whitespace-nowrap text-[1.15rem] text-[color:var(--ink)]">
                {monthly(plan.introMonthly)}
                <span className="text-[0.8rem] text-[color:var(--muted-dim)]">/mo</span>
              </span>
              <span className="mt-0.5 block whitespace-nowrap text-[0.74rem] text-[color:var(--muted-dim)]">
                first {plan.introMonths} months
              </span>
            </>
          ) : (
            <span className="text-[0.84rem] text-[color:var(--muted-dim)]">
              {financing.onRequest}
            </span>
          )}
        </span>
      </button>

      {open && (
        <div id={panelId} className="border-t border-[color:var(--rule-soft)] bg-[color:var(--paper)] px-4 py-6 sm:px-6">
          {plan === null ? (
            <p className="max-w-[52ch] text-[0.9rem] leading-relaxed text-[color:var(--muted)]">
              {financing.onRequestNote}
            </p>
          ) : (
            <dl className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
              <Figure
                term={`Months 1–${plan.introMonths}`}
                value={`${monthly(plan.introMonthly)}/mo`}
                note={`at ${INTRO_APR}`}
              />
              <Figure
                term={`Months ${plan.introMonths + 1}–${plan.termMonths}`}
                value={`${monthly(plan.postMonthly)}/mo`}
                note={`at ${POST_APR}`}
              />
              <Figure term="Term" value={`${plan.termMonths} months`} note={`APR ${BLENDED_APR}`} />
              <Figure
                term="Total of payments"
                value={formatPrice(Math.round(plan.totalPaid))}
                note={`${formatPrice(Math.round(plan.financeCharge))} finance charge`}
              />
            </dl>
          )}
        </div>
      )}
    </div>
  )
}

function Figure({ term, value, note }: { term: string; value: string; note: string }) {
  return (
    <div>
      <dt className="text-[0.78rem] text-[color:var(--muted-dim)]">{term}</dt>
      <dd className="q4-num mt-1 whitespace-nowrap text-[1.05rem] leading-none text-[color:var(--ink)]">
        {value}
        <span className="mt-1.5 block text-[0.74rem] text-[color:var(--muted-dim)]">{note}</span>
      </dd>
    </div>
  )
}
