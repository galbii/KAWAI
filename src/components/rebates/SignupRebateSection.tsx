'use client'

import { useMemo, useState } from 'react'
import { RebateSchedule } from '@/app/(frontend)/digital-piano-rebate/components/RebateSchedule'
import RebateModelModal from './RebateModelModal'
import { toRebateSeries } from './toRebateSeries'
import type { RebateCategory, RebateProduct } from '@/lib/payload/rebate-types'

type Props = {
  data: RebateCategory[]
  /** Opens the dealer sign-up offer popup (lead-gen conversion). */
  onSignUp: () => void
  eyebrow: string
  heading: string
  footnote?: string
}

type SelectedModel = { product: RebateProduct; categoryLabel: string; isShigeru: boolean }

/**
 * The /signup rebate section — the marketing Rebate Table UI (`RebateSchedule`)
 * in lead-gen mode, fed by the signup rebate data via {@link toRebateSeries}.
 * Each row's "View {model}" opens the cinematic {@link RebateModelModal} (touch &
 * action / tone / features over the collection film) rather than navigating away.
 * Returns null when there are no active rebates (e.g. the CA site).
 */
export default function SignupRebateSection({ data, onSignUp, eyebrow, heading, footnote }: Props) {
  const [selected, setSelected] = useState<SelectedModel | null>(null)

  // Resolve a row's slug back to its full rebate product (savings, price, etc.).
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

  return (
    <>
      <RebateSchedule
        schedule={toRebateSeries(data)}
        eyebrow={eyebrow}
        heading={heading}
        deadline=""
        leadGen
        onSignUp={onSignUp}
        signUpLabel="Sign Up Now"
        onViewModel={(slug) => {
          const hit = bySlug.get(slug)
          if (hit) setSelected(hit)
        }}
        {...(footnote ? { footnote } : {})}
      />

      <RebateModelModal
        product={selected?.product ?? null}
        isOpen={selected !== null}
        categoryLabel={selected?.categoryLabel ?? ''}
        isShigeru={selected?.isShigeru ?? false}
        onSignUp={onSignUp}
        onClose={() => setSelected(null)}
      />
    </>
  )
}
