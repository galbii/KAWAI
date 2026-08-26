'use client'

import { useMemo, useState } from 'react'
import { RebateSchedule } from '@/app/(frontend)/digital-piano-rebate/components/RebateSchedule'
import RebateModelModal from '@/components/rebates/RebateModelModal'
import { toRebateSeries } from '@/components/rebates/toRebateSeries'
import { BookingModal } from '@/components/trade-in/BookingModal'
import type { RebateCategory, RebateProduct } from '@/lib/payload/rebate-types'
import { DEADLINE_LONG, DATE_RANGE } from './campaign'

interface RebateSectionProps {
  data: RebateCategory[]
  locationName?: string | null
  calendlyUrl?: string | null
  storeslug: string
}

type SelectedModel = { product: RebateProduct; categoryLabel: string; isShigeru: boolean }

/**
 * The rebate table, in storefront mode.
 *
 * Same UI and data path as the /signup rebate section, with one difference: a
 * dealer page's conversion is an in-store appointment, not a mail-list sign-up,
 * so every "Sign Up" affordance here opens the BookingModal instead. Kept as its
 * own wrapper rather than a prop on SignupRebateSection so /signup is untouched.
 */
export function RebateSection({ data, locationName, calendlyUrl, storeslug }: RebateSectionProps) {
  const [selected, setSelected] = useState<SelectedModel | null>(null)
  const [bookingOpen, setBookingOpen] = useState(false)

  const bySlug = useMemo(() => {
    const map = new Map<string, SelectedModel>()
    for (const category of data) {
      for (const product of category.products) {
        map.set(product.slug, {
          product,
          categoryLabel: category.label,
          isShigeru: category.slug === 'shigeru',
        })
      }
    }
    return map
  }, [data])

  if (data.length === 0) return null

  function openBooking() {
    setSelected(null)
    setBookingOpen(true)
  }

  return (
    <div id="rebates" className="scroll-mt-24">
      {/* `deadline` is left empty on purpose: RebateSchedule appends it to both the
          heading and the subtitle, which prints the date twice. The heading text
          carries it instead, so the shared component needs no change. */}
      <RebateSchedule
        schedule={toRebateSeries(data)}
        eyebrow="Back to School · Instant Rebates"
        heading={`Every model in the program — through ${DEADLINE_LONG}`}
        deadline=""
        leadGen
        hideMobileFilters
        onSignUp={openBooking}
        signUpLabel="Book to Claim"
        onViewModel={(slug) => {
          const hit = bySlug.get(slug)
          if (hit) setSelected(hit)
        }}
        footnote={`Savings shown are the instant rebate taken off the price at the counter on qualifying new Kawai pianos${locationName ? ` at ${locationName}` : ''}. Back to School program runs ${DATE_RANGE}; rebates end ${DEADLINE_LONG}. 0% financing for 36 months is subject to credit approval. Trade-in bonus requires a written independent appraisal.`}
      />

      <RebateModelModal
        product={selected?.product ?? null}
        isOpen={selected !== null}
        categoryLabel={selected?.categoryLabel ?? ''}
        isShigeru={selected?.isShigeru ?? false}
        onSignUp={openBooking}
        onClose={() => setSelected(null)}
      />

      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        calendlyUrl={calendlyUrl}
        locationName={locationName}
        storeslug={storeslug}
      />
    </div>
  )
}
